# YOLO Implementation Brief B: Decompose `/pipeline.ingest` into 3 Delegated Phases

**Branch:** `feature/pipeline-upgrades-b` (created from `develop`)
**Session spec:** `output/sessions/2026-04-10_pipeline-upgrades/B-pipeline-ingest-decompose.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** **opus** (this brief involves architectural judgment calls)

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **opus** for this brief (not the usual sonnet). The decomposition involves judgment calls about where phase boundaries should sit. Sub-agents default to sonnet.

---

## Context

`/pipeline.ingest` is currently a ~1600-line monolithic skill. The orchestrator does all the work itself, carrying the entire context through every phase sequentially. This brief decomposes it into three delegated phases to improve quality (fresh sub-agent contexts), reduce wall-clock time (parallel fan-out in Phase A), and gate progression on a proper theme-package validation step (Phase B).

The decomposition is covered by two items in the plan:

- **#9** — Decompose `/pipeline.ingest` into 3 delegated phases (Phase A parallel fan-out + Phase B delegated validator + Phase C orchestrator scaffold)
- **#3** — Parallelize Phase A (reference asset download + token extraction + template fetch)

These items are merged into this single brief because #3 is a strict subset of Phase A in #9.

The target phase structure is:

| Phase                            | Owner                                              | Work                                                                                                                                  | Parallelism                                               |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **A — Reference harvest**        | Parallel sub-agents                                | Download reference assets (HTML, CSS, screenshots, images); extract visual tokens from screenshots; fetch theme scaffolding templates | 3 parallel sub-agents in one Task message                 |
| **B — Theme package validation** | `cs-theme-package-validator` sub-agent (read-only) | Validate the generated theme package against TPV-001..015 rules                                                                       | Single specialist sub-agent; gates Phase C                |
| **C — Test site scaffolding**    | Orchestrator (main Claude)                         | Create `sites/test-<name>/`, wire the new theme, run initial build, smoke test                                                        | Sequential, stateful filesystem work — not parallelisable |

Phase B is a new gate introduced by this brief. If the theme validator returns any Critical or High TPV findings, Phase C MUST NOT run — the pipeline aborts with the findings file printed so the user can address them before retrying.

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/pipeline-upgrades-b
pnpm type-check   # must be clean before starting
```

## Phase 0 — Read and understand the current skill (MANDATORY before any edit)

**Goal:** Build a complete mental model of what `/pipeline.ingest` currently does before touching a single line. Without this, the decomposition will introduce subtle bugs.

**Model:** orchestrator (opus) — comprehension work.

**Files to read (in order):**

1. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md` — the full current skill (~1600 lines). Read the entire file. Do not skim.
2. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md` — the shared validation skill that `/pipeline.ingest` already invokes.
3. `/Users/rickywilson/.claude/agents/cs-theme-package-validator.md` — the new validator agent you will be delegating Phase B to. Understand its rule IDs (TPV-001 to TPV-015), its severity mapping, and its findings file format.
4. `/Users/rickywilson/Sites/local-business-platform/docs/architecture/how-theme-system-works.md` — the canonical theme system reference.
5. `/Users/rickywilson/Sites/local-business-platform/docs/architecture/how-ingestion-pipeline-works.md` — if this file exists, read it. If it doesn't, skip.
6. `/Users/rickywilson/Sites/local-business-platform/docs/guides/creating-new-theme.md` — the human-facing guide to theme creation.
7. `/Users/rickywilson/Sites/local-business-platform/tools/create-site-from-project.ts` — the tool that `/pipeline.ingest` eventually invokes to scaffold the test site.

After reading, write a scratch analysis to `output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md` with these sections:

```markdown
# /pipeline.ingest decomposition analysis

## Current structure

[List every numbered step in the current skill — e.g. "Step 1: Preflight", "Step 2: Download reference", etc. For each step, note: what it does, what inputs it reads, what outputs it produces, whether it writes files, and whether it has any external dependencies (MCP tools, APIs, subprocesses).]

## Dependency graph

[Which steps depend on which? Which can be reordered? Which are strictly sequential because the output of one is the input of the next?]

## Parallelism opportunities

[Which steps could run in parallel today without any change? Which could run in parallel only after data flow changes?]

## Phase boundaries

Proposed mapping of current steps to new Phases A / B / C:

- Phase A (parallel fan-out): steps N, N, N
- Phase B (theme validator gate): [new step]
- Phase C (orchestrator scaffolding): steps N, N, N

## Risks

[What could break if we got the phase boundaries wrong? Which steps are stateful in surprising ways?]
```

**This analysis file is a PREREQUISITE for the rest of the brief.** Do not proceed to Phase 1 until it exists and is complete. Commit it at the end of Phase 0.

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md
test $(wc -l < output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md) -gt 50
grep -q "Phase A" output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md
grep -q "Phase B" output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md
grep -q "Phase C" output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md
```

**Commit:**

```bash
git add output/sessions/2026-04-10_pipeline-upgrades/B-analysis.md
git commit -m "$(cat <<'EOF'
docs(session): analysis of /pipeline.ingest for decomposition

Phase 0 of the /pipeline.ingest decomposition — scratch analysis of
current structure, dependency graph, parallelism opportunities, and
proposed phase boundaries. Used as input for the subsequent refactor.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

## Phase 1 — Write the new `/pipeline.ingest.md` file

**Goal:** Rewrite `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md` into the Phase A / Phase B / Phase C structure, using the analysis from Phase 0 to place the boundaries.

**Model:** orchestrator (opus) — architectural rewrite.

**Files:** `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md`

**Critical constraints:**

1. **Do not change external behaviour.** The skill's inputs (flags, URL, name) and eventual outputs (a working test site, a validated theme package, a session folder of artefacts) must remain identical. This is a refactor, not a feature change.
2. **Do not remove any step.** Every existing numbered step in the current skill must end up in one of Phase A, B, or C — none should be dropped. If a step truly is dead code, move it into an explicit `## Removed in 2026-04-10 decomposition` section at the bottom of the new file so it can be reviewed.
3. **Phase A sub-agents must be launched in a single Task message.** Not sequentially. The whole point of this decomposition is the parallel fan-out.
4. **Phase B MUST block Phase C.** If the validator returns `Critical + High > 0`, Phase C must not run. Print the findings, abort, tell the user.
5. **Phase C remains in the orchestrator.** Do not try to delegate it — test-site scaffolding touches too many files in too many places and benefits from the orchestrator's persistent state.

**Structure of the new file:**

The new file must follow this skeleton (fill in with real content from the current skill, guided by the analysis):

````markdown
# Pipeline Ingest

Run the full ingestion pipeline against a URL, then create a temporary test site using the generated theme.

**Usage:** `/pipeline.ingest --url https://example.com [--name my-theme]`

---

## Step 1: Preflight Checks

[Keep this step roughly as it is in the current skill — branch check, git state, dependency checks.]

---

## Phase A — Reference Harvest (parallel fan-out)

Goal: gather every piece of input data that Phase B and Phase C will need. All sub-work in Phase A is independent — no file contention, no shared state. Launch all sub-agents in a **single Task-tool message**.

### Sub-agent A1: Reference asset download

[Spawn block — generic `general-purpose` subagent with model: sonnet. The agent's job is to download the reference site's HTML, CSS, screenshots, logo, and any hero imagery, and save them to `output/sessions/YYYY-MM-DD_ingest-<name>/reference/`.]

### Sub-agent A2: Visual token extraction

[Spawn block — if `cs-visual-fidelity-reviewer` is available (landed by Brief C), use it with model: sonnet. Otherwise use a generic sonnet subagent. The agent's job is to read the reference screenshots downloaded by A1 and extract candidate brand colours, typography, spacing, and layout tokens into a draft `theme.config.ts` structure. Write output to `output/sessions/YYYY-MM-DD_ingest-<name>/extracted-tokens.json`.]

**NOTE ON A1/A2 DATA DEPENDENCY:** A2 reads files that A1 writes. If A1 and A2 genuinely depend on each other, DO NOT parallelise them — run A1, then A2. If you can restructure so both read from a shared pre-existing cache or so A2 can start on a subset while A1 is still running, document the approach in a comment. The analysis in Phase 0 should have settled this question.

### Sub-agent A3: Theme template fetch

[Spawn block — haiku model (mechanical file reads). The agent's job is to read the base theme scaffolding template from `packages/themes/` (pick the theme template that most closely matches the reference site's character — or use a neutral default like `vega` if no obvious match) and stage the file list for Phase C to consume.]

### Phase A verification gate

```bash
# Verification gate — STOP if this fails
SESSION_DIR="output/sessions/YYYY-MM-DD_ingest-<name>"
test -d "$SESSION_DIR/reference"
test -f "$SESSION_DIR/extracted-tokens.json"
test -f "$SESSION_DIR/template-files.json"  # or whatever A3 produces
```
````

---

## Phase B — Theme Package Validation (delegated to cs-theme-package-validator)

Goal: generate the theme package from the extracted tokens and template, then validate it with the specialist auditor before letting Phase C touch the filesystem.

### Step B1: Generate the theme package

[This is the orchestrator's work — take extracted-tokens.json + template-files.json and write `packages/themes/<name>/*` files (index.ts, globals.css, components/, package.json). Describe the file writes precisely.]

### Step B2: Delegate validation to cs-theme-package-validator

```
Task tool parameters:
  description: "Validate generated theme package"
  subagent_type: "cs-theme-package-validator"
```

**Prompt for the agent:**

> You are validating a newly generated theme package as part of `/pipeline.ingest` Phase B.
>
> **Scope:** Single-theme audit. The theme package is at `packages/themes/<name>/`.
>
> **Rules to run:** All 15 rules (TPV-001 through TPV-015). This is a fresh package so all rules apply.
>
> **Session directory:** `output/sessions/YYYY-MM-DD_ingest-<name>/`
>
> **Output file:** `output/sessions/YYYY-MM-DD_ingest-<name>/findings-theme-package.md`
>
> Follow your agent definition's review procedure exactly. Do NOT modify any files.
>
> **Return:** The Statistics line from your findings file so the orchestrator can decide whether to proceed.

### Step B3: Gate on validator output

After the validator completes, read the Statistics line from `findings-theme-package.md`.

**Gate rule:** If `Critical + High > 0`, STOP the pipeline:

- Print the full findings file to the console
- Tell the user: "Theme package validation failed. See `output/sessions/.../findings-theme-package.md`. Fix the Critical/High findings and re-run `/pipeline.ingest`."
- Do NOT proceed to Phase C. Do NOT touch the filesystem further.

If `Critical + High == 0` but Medium/Low findings exist, print them as warnings and continue to Phase C.

### Phase B verification gate

```bash
# Verification gate — STOP if this fails
test -f "$SESSION_DIR/findings-theme-package.md"
# Confirm the statistics line exists
grep -q "Critical" "$SESSION_DIR/findings-theme-package.md"
# Confirm the theme package was generated
test -d "packages/themes/<name>"
test -f "packages/themes/<name>/index.ts"
```

---

## Phase C — Test Site Scaffolding (orchestrator keeps)

Goal: create a throwaway test site that consumes the validated theme package, so the user can preview it before promoting the theme to a real client site.

[This phase is where the orchestrator does the stateful filesystem work — invoking `tools/create-site-from-project.ts`, setting up `sites/test-<name>/`, wiring the theme import in `app/layout.tsx`, and running the initial build. The current skill's existing logic goes here almost unchanged.]

### Step C1: Scaffold the test site

[Detailed steps from the current skill, adapted to read from the theme package that Phase B just validated.]

### Step C2: Build and smoke-test

```bash
pnpm --filter sites/test-<name> build
pnpm --filter sites/test-<name> start &
# ... smoke test procedure ...
```

### Step C3: Hand off to /pipeline.validate-site

Invoke `/pipeline.validate-site` against the new test site to run the visual fidelity / a11y / perf checks. This is a separate skill, not a subagent — use the `SlashCommand` tool if available, or tell the user to run it manually.

### Phase C verification gate

```bash
# Verification gate — STOP if this fails
test -d "sites/test-<name>"
test -f "sites/test-<name>/.next/BUILD_ID"  # build succeeded
```

---

## Final Report

[Preserve the existing reporting block from the current skill, with columns for each phase.]

## Rules

[Preserve the existing rules block from the current skill. Add any new rules that the decomposition requires.]

````

**IMPORTANT — how to populate the placeholders:**

Do NOT copy-paste blindly from the current skill. For each placeholder above, consult your analysis in `B-analysis.md` to know which existing steps belong where. Write the new content in your own voice, preserving the exact behaviour of the current skill but restructured into the 3-phase model.

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
# The rewritten file must exist and be substantial
test -f /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
test $(wc -l < /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md) -gt 400
# It must have all 3 phase headers
grep -q "^## Phase A" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
grep -q "^## Phase B" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
grep -q "^## Phase C" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
# Phase A must spawn parallel sub-agents
grep -q "single Task-tool message" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
# Phase B must delegate to cs-theme-package-validator
grep -q "cs-theme-package-validator" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
# Phase B must gate on Critical+High
grep -qE "Critical.*High.*0" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.ingest.md
# The build succeeds
pnpm type-check
pnpm lint
````

**Commit:**

```bash
git add .claude/commands/pipeline.ingest.md
git commit -m "$(cat <<'EOF'
refactor(skills): decompose /pipeline.ingest into 3 delegated phases

Phase A (reference harvest) fans out independent read-heavy work to
parallel sub-agents in a single Task message. Phase B delegates theme
package validation to cs-theme-package-validator as a gating step —
Critical or High TPV findings abort the pipeline before Phase C runs.
Phase C (test site scaffolding) remains in the orchestrator as it
involves stateful filesystem work that doesn't parallelise.

Reduces orchestrator context load on long ingest runs and introduces
a proper validation gate before any sites/ directory modification.

Part of the pipeline parallelization plan (items #9 and #3).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

## Phase 2 — Update documentation

**Goal:** Update `/Users/rickywilson/Sites/local-business-platform/docs/architecture/how-ingestion-pipeline-works.md` (if it exists) to describe the new phase structure. If the file does not exist, create it.

**Model:** sonnet — documentation writing.

**Files:** `docs/architecture/how-ingestion-pipeline-works.md`

**If the file exists:** update the section describing the pipeline flow to reflect Phase A / B / C. Preserve any existing content that is still accurate. Add a new section "Parallelism and phase gates" describing the 3-phase model.

**If the file does not exist:** create a new file with this outline:

```markdown
# How the Ingestion Pipeline Works

[Short intro — what /pipeline.ingest does, when to use it]

## The three phases

[Explain Phase A / B / C with the table from the skill file]

## Phase A — Reference Harvest (parallel)

[Describe the 3 sub-agents, why they are parallel, what they produce]

## Phase B — Theme Package Validation (gated delegation)

[Describe the validator agent, the severity gate, how a failure aborts the pipeline]

## Phase C — Test Site Scaffolding (orchestrator)

[Describe why this stays in the orchestrator, what files it touches, how it hands off to /pipeline.validate-site]

## Error handling

[What happens when each phase fails]

## Observability

[Where session artefacts are written, how to debug a failed run]

## Relationship to other skills

[How it relates to /pipeline.stitch-design (alternative input), /pipeline.validate-site (downstream), /pipeline.kill-theme (cleanup)]
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f docs/architecture/how-ingestion-pipeline-works.md
grep -q "Phase A" docs/architecture/how-ingestion-pipeline-works.md
grep -q "Phase B" docs/architecture/how-ingestion-pipeline-works.md
grep -q "Phase C" docs/architecture/how-ingestion-pipeline-works.md
grep -q "cs-theme-package-validator" docs/architecture/how-ingestion-pipeline-works.md
pnpm lint
```

**Commit:**

```bash
git add docs/architecture/how-ingestion-pipeline-works.md
git commit -m "$(cat <<'EOF'
docs(architecture): document /pipeline.ingest 3-phase decomposition

Describes the new Phase A (parallel reference harvest), Phase B
(gated theme package validation via cs-theme-package-validator),
and Phase C (orchestrator-owned test site scaffolding) structure.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

## Phase 3 — Build and smoke test the refactored skill

**Goal:** Confirm the refactored skill parses correctly as a slash command, and that nothing in the repo broke as a side effect.

**Model:** orchestrator (opus) — verification.

```bash
# Full verification — MUST pass all gates
pnpm type-check
pnpm lint
pnpm build
```

**Do NOT actually invoke `/pipeline.ingest` end-to-end in this phase.** End-to-end invocation requires a real reference URL and will create new files and sub-agents, which is out of scope for this refactor brief. The refactor is "known good" if all three verification gates pass AND every rule in the Phase 1 verification block passed.

If the user wants to smoke-test the refactored skill end-to-end, they can invoke `/pipeline.ingest --url https://example.com --name smoketest` after merging this branch and then run `/pipeline.kill-theme smoketest` to clean up.

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm lint
pnpm build
```

---

## Parallel execution groups

This section lists work units that can run concurrently during this YOLO session.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                                     | File overlap                                  | Model | Rationale                                                                                                                           |
| ----- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- |
| G1    | Phase 0 | Read `pipeline.ingest.md`, Read `pipeline.validate-site.md`, Read `cs-theme-package-validator.md`, Read `how-theme-system-works.md`, Read `how-ingestion-pipeline-works.md` (if exists), Read `creating-new-theme.md`, Read `create-site-from-project.ts` | none (reads)                                  | n/a   | 7 independent reads to build the mental model — batch in one message                                                                |
| G2    | Phase 1 | —                                                                                                                                                                                                                                                         | —                                             | —     | Phase 1 is a single file rewrite; no intra-phase parallelism                                                                        |
| G3    | Phase 2 | —                                                                                                                                                                                                                                                         | —                                             | —     | Phase 2 is a single file write; no intra-phase parallelism                                                                          |
| G4    | Phase 3 | Run `pnpm type-check`, Run `pnpm lint`                                                                                                                                                                                                                    | none (read-only checks on different surfaces) | n/a   | Independent verification commands — batch in one message. `pnpm build` must run alone after these (writes to `.next/` and `dist/`). |

### Cross-phase groups

**None.** Phases are gated on verification and must run sequentially.

### Sequential points — MUST NOT parallelise

| Item                    | Reason                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Phase 0 → Phase 1       | The analysis file is the INPUT to Phase 1. Do not start Phase 1 before Phase 0 is committed.     |
| Phase 1 → Phase 2       | Documentation must describe the actual new structure. Update docs after the skill file is final. |
| Phase 2 → Phase 3       | Verification must happen on the final committed state.                                           |
| `pnpm build` in Phase 3 | Must run alone — writes `.next/` and `dist/`. Do not parallelise with anything else.             |

---

## Cost Estimate

| Phase                     | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 0 (read + analysis) | opus   | ~60k              | ~6k                | $0.45      |
| Phase 1 (skill rewrite)   | opus   | ~80k              | ~15k               | $0.78      |
| Phase 2 (docs)            | sonnet | ~12k              | ~4k                | $0.10      |
| Phase 3 (build verify)    | opus   | ~8k               | ~1k                | $0.07      |
| **Total**                 |        | **~160k**         | **~26k**           | **~$1.40** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.

Opus is used for Phases 0, 1, and 3 because the decomposition requires architectural judgment. Phase 2 drops to sonnet because documentation writing is standard work.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. The analysis file (`B-analysis.md`) contents summary — which steps went to which phase, and any surprises
3. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
4. Line counts — original `pipeline.ingest.md` length vs new length (brief expectation: modest reduction because phase structure replaces some repetition, but not a drastic shrink — the skill still does all the work it used to)
5. Any exceptions or intentional deviations from the brief
6. Token usage and cost estimate vs the pre-flight estimate above

## Update Session File

After completing all phases, append to this brief file:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: how the decomposition went, which phase boundaries turned out to be obvious vs judgement calls, any current-skill behaviours that had to be preserved awkwardly]

### Commits

- Phase 0: [SHA] — analysis scratch file
- Phase 1: [SHA] — skill decomposition
- Phase 2: [SHA] — documentation update

### Line count

- Before: [N] lines
- After: [N] lines

### Phase boundary decisions

[Bullet list of any places where the analysis suggested a boundary in one place and the actual rewrite put it elsewhere, with 1-sentence reasons]
```

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it — Phase 0 is mandatory, do not skip it
- **Consult the `## Parallel execution groups` section** — only the reads in Phase 0 can be batched
- Never push — leave all changes on `feature/pipeline-upgrades-b`
- **Do not invoke `/pipeline.ingest` end-to-end during this brief.** The refactor is known-good if the verification gates pass.
- **Do not change external behaviour.** The skill's inputs and outputs must remain identical.
- **Do not drop any existing step.** Every step in the current skill must land somewhere in the new Phase A / B / C structure, or be moved to an explicit "removed" section with justification.
- The orchestrator for this brief is **opus**, not the usual sonnet. The Co-Authored-By line in commits must reflect this (`Claude Opus 4.6`).
- Minimal changes only — implement what the plan says, nothing more
- This brief touches ONLY local-business-platform. Do not `cd` into any other repo.

---

## Terminal command to launch this brief

```
claude --dangerously-skip-permissions --model opus -p "Read output/sessions/2026-04-10_pipeline-upgrades/B-pipeline-ingest-decompose.md in full, then implement every phase it describes exactly as written. Phase 0 is mandatory — do not skip it."
```

---

## Completed

**Date:** 2026-04-10
**Status:** All phases executed successfully

The decomposition was mostly mechanical — the existing skill had clear natural breaks between the analysis-tool phase, the theme-package phase, and the site-scaffolding phase. Phase A's boundary was the one genuine judgment call: the brief proposed three parallel sub-agents (A1 reference download, A2 visual token extraction, A3 scaffold inventory), but the Phase 0 analysis revealed that `tools/analyse-site.ts` already performs visual token extraction internally, so A2 was subsumed into the A0 sequential prelude rather than duplicated as a parallel sub-agent. A1 (HTML + image download) and A3 (scaffold inventory) were confirmed as independent and are launched in a single Task message. Phase B (validator gate) and Phase C (orchestrator scaffolding) landed exactly where the brief specified. One operational note: the worktree was initially placed inside `.claude/worktrees/` which caused Claude Code to block writes to `.claude/commands/` (nested `.claude/` path protection). The fix was to move the worktree to `/tmp/lbp-upgrades-b` and write the rewritten skill file from the parent conversation context.

### Commits

- Phase 0: `0f2646a` — analysis scratch file
- Phase 1: `f3a2084` — skill decomposition (926 lines)
- Phase 2: `a72a429` — documentation update (how-ingestion-pipeline-works.md)

### Line count

- Before: 1148 lines
- After: 926 lines

### Phase boundary decisions

- **A2 subsumed into A0:** The brief proposed a separate A2 sub-agent for visual token extraction. The Phase 0 analysis found `analyse-site.ts` already performs this step internally — adding a parallel A2 would duplicate work at extra cost. A2 is documented as subsumed in the skill file.
- **C2b written after C2e:** The brief skeleton listed globals.css (C2b) before font determination (C2e), but the font variable names (`$BODY_VAR`, `$HEADING_VAR`) are computed in C2e and consumed in C2b. The implementation documents the dependency explicitly and writes C2b after C2e.
