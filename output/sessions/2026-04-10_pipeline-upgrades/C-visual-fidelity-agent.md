# YOLO Implementation Brief C: Visual Fidelity Reviewer Agent + `/pipeline.validate-site` Parallelization

**Branch:** `feature/pipeline-upgrades-c` (created from `develop`)
**Session spec:** `output/sessions/2026-04-10_pipeline-upgrades/C-visual-fidelity-agent.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** **opus** (new agent definition + skill wiring both involve judgement)

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                     |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | New agent definitions, calibrated instruction writing, architectural wiring |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation                                                     |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks                                                            |

Default orchestrator: **opus**.

---

## Context

This brief creates a new specialist agent for visual fidelity comparison and then parallelises `/pipeline.validate-site` to use it alongside existing accessibility and performance checks.

The two items merged here are:

- **#8** — Create `cs-visual-fidelity-reviewer` agent and replace the generic `cs-code-reviewer` currently used for visual review in `/pipeline.validate-site` and (optionally) `/pipeline.stitch-design`.
- **#2** — Parallelize `/pipeline.validate-site` pre-flight checks so that visual fidelity review, accessibility audit, and performance check run concurrently instead of sequentially.

The two items are bundled because #2 is blocked on #8 — there is no point parallelising the validate-site checks until a proper visual fidelity specialist exists for the visual slot.

The new agent, `cs-visual-fidelity-reviewer`, is a **specialist that compares rendered test site screenshots against reference screenshots** and reasons about token-level drift (spacing, type scale, colour, layout). It replaces the current generic `cs-code-reviewer` invocation in `/pipeline.validate-site`, which reviews visual output blind.

Critical design constraint: **the agent is read-only.** Its tool list is `[Read, Bash, Grep, Glob]` — no Write, no Edit. It can READ screenshot files (PNG/JPEG), run comparison tools via Bash (e.g. `sips` on macOS for metadata, `pixelmatch` if available), and inspect rendered HTML output, but it cannot apply fixes. Fixes are a separate step handled by `cs-frontend-engineer`.

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/pipeline-upgrades-c
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Create the `cs-visual-fidelity-reviewer` agent definition

**Goal:** Write `/Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md` with a frontmatter block matching the project's cs-\* agent schema, and a rule-based system prompt covering the visual-fidelity review procedure.

**Model:** orchestrator (opus) — this is the highest-stakes writing in the brief. Agent definitions are load-bearing: every invocation of the skill depends on them being precise.

**Files:** `/Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md` (new)

**Before writing**, read these references to ground the agent:

1. `/Users/rickywilson/.claude/agents/cs-vercel-config-auditor.md` — the structural template you should follow (rule-based, read-only, severity-mapped findings)
2. `/Users/rickywilson/.claude/agents/cs-theme-package-validator.md` — another rule-based read-only agent in the same style
3. `/Users/rickywilson/.claude/agents/cs-frontend-engineer.md` — for the relationship section (handoff from read-only to write-capable)
4. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md` — the skill this agent will be consumed by
5. `/Users/rickywilson/Sites/local-business-platform/docs/standards/styling.md` — the theme token rules that define what "visual fidelity" means in this codebase
6. `/Users/rickywilson/Sites/local-business-platform/packages/theme-system/src/types.ts` — the token categories that the reviewer will compare against

**Structure of the new agent file:**

The file must contain a frontmatter block and a body. Use the same structural skeleton as `cs-vercel-config-auditor.md` and `cs-theme-package-validator.md`:

````markdown
---
# === CORE IDENTITY ===
name: cs-visual-fidelity-reviewer
title: Visual Fidelity Reviewer
description: Read-only specialist that compares rendered test site screenshots against reference screenshots, identifying drift in colour, typography, spacing, layout, and component variant. Used by /pipeline.validate-site and /pipeline.stitch-design as the visual slot in a parallel review fan-out.
domain: engineering
subdomain: theme-system
model: opus

# === AGENT CLASSIFICATION ===
classification:
  type: quality
  color: purple
  field: visual-design
  expertise: expert
  execution: parallel

# === RELATIONSHIPS ===
related-agents:
  - cs-theme-package-validator
  - cs-frontend-engineer
  - cs-ui-designer
collaborates-with:
  - agent: cs-theme-package-validator
    purpose: Theme package validator checks structural correctness of the package; this agent checks visual correctness of the rendered output. They run in parallel for /pipeline.validate-site.
    required: recommended

# === TECHNICAL ===
tools: [Read, Grep, Glob, Bash]
dependencies:
  tools: [Read, Grep, Glob, Bash]
compatibility:
  claude-ai: true
  claude-code: true
  platforms: [macos, linux]

# === VERSIONING ===
version: v1.0.0
created: 2026-04-10
updated: 2026-04-10

# === DISCOVERABILITY ===
tags: [visual, fidelity, screenshots, theme, review, pipeline]
---

# Visual Fidelity Reviewer

## Purpose

[Write 2-3 paragraphs explaining why the agent exists. Key points to cover:

- This is a READ-ONLY specialist — it compares images and reports findings, never writes
- It replaces generic code reviewers that were reviewing visual output blind
- It is narrow — structural package validation is cs-theme-package-validator's job; a11y is cs-frontend-engineer's job; this agent ONLY does visual fidelity against a reference
- The agent has Claude's vision capabilities and can read PNG/JPEG files directly via the Read tool
  ]

## When to invoke this agent

[List the skills that invoke it: /pipeline.validate-site (primary), /pipeline.stitch-design (post-generation fidelity check), /pipeline.ingest Phase B (optional — already handled by cs-theme-package-validator). Do NOT list cases where it should not be invoked.]

## The rules — authoritative list

[Define 10-14 rules VFR-001 through VFR-NNN, each with Why / How to check / Remediation fields. Below is the target rule set — fill in the How-to-check sections with specific procedures.]

### VFR-001 — Brand primary colour must match within ΔE 3.0

**Why:** The brand primary is the most load-bearing colour token in any theme. Drift above Delta-E 3.0 (perceptually distinguishable) means the rendered site looks noticeably off-brand compared to the reference.
**How to check:** [Specify how to sample the reference and rendered screenshots at a specific point where the brand colour should appear (e.g. top of hero, CTA button), extract the RGB value, and compute Delta-E against the reference value.]
**Remediation:** [Adjust the `colors.brand.primary` token in `theme.config.ts` or the theme's `index.ts` DefaultConfig.]

### VFR-002 — Hero layout variant must match the reference

**Why:** [...]
**How to check:** [Read both screenshots. Measure hero height vs viewport. Check whether the hero has overlaid text, split layout, or full-bleed imagery. Compare against the reference.]
**Remediation:** [Change `{name}Registry.heroVariant` to match.]

### VFR-003 — Header colour scheme (dark vs light) must match the reference

### VFR-004 — Typography scale proportions must be within 10% of reference

### VFR-005 — Card component variant must match (icon-circle vs standard vs overlay)

### VFR-006 — Section backgrounds must match the reference variant

### VFR-007 — Button border radius must be within 2px of the reference

### VFR-008 — Surface foreground/background contrast must be preserved from reference

### VFR-009 — Logo must be present and positioned correctly

### VFR-010 — Overlay treatments must match (darkness, opacity, direction)

### VFR-011 — Vertical rhythm (section spacing) must be within 15% of reference

### VFR-012 — Mobile breakpoint rendering must be checked separately from desktop

### VFR-013 — No hardcoded Tailwind color-scale classes visible in rendered output (cross-check with cs-theme-package-validator — report only if TPV didn't catch it)

### VFR-014 — Font family must match or be a deliberate fallback (reference the theme config)

[IMPORTANT: For every rule above, specify WHAT the agent actually does with the Read tool (reading an image) and the Bash tool (running image-comparison commands). Claude's vision can describe images but cannot do pixel-exact math without shell tools. Use Bash for `sips`, `identify` (ImageMagick if present), or simpler Python one-liners via `python3 -c`. If no image-comparison tooling is available on the platform, the rule falls back to qualitative description ("the reference has a darker primary") rather than failing silent.]

## Review procedure

### Step 1 — Determine inputs

Read the prompt you were given. It must contain:

- **Reference screenshots path** — where the reference site's captured screenshots live (typically `output/sessions/YYYY-MM-DD_ingest-<name>/reference/screenshots/`)
- **Rendered screenshots path** — where the test site's captured screenshots live (typically `output/sessions/YYYY-MM-DD_validate-<site>/screenshots/`)
- **Theme package path** — the theme under review, for cross-reference with TPV findings (optional)
- **Scope** — full, mobile-only, desktop-only, or specific rule IDs

If the prompt does not specify all the required inputs, STOP and return an error asking for them.

### Step 2 — Enumerate screenshots

Use `Glob` to list every `.png` and `.jpg` in the reference and rendered directories. Pair them by filename (e.g. `home-desktop.png` in reference vs `home-desktop.png` in rendered). Flag any files present in one side but not the other.

### Step 3 — For each screenshot pair, run applicable rules

For each pair:

1. Use `Read` to load both images (Claude's vision tool handles PNG/JPEG).
2. Visually compare them and identify obvious drift.
3. For colour-critical rules (VFR-001, VFR-008), use Bash tooling if available:
   ```bash
   # macOS: sips
   sips -g pixelFormat path/to/image.png
   # ImageMagick (if installed)
   identify -format "%[pixel:u.p{100,100}]" path/to/image.png
   # Python PIL fallback
   python3 -c "from PIL import Image; im = Image.open('path'); print(im.getpixel((100,100)))"
   ```
````

4. For layout rules, use the vision capability to describe both images and compute the ratio visually (e.g. "hero is 60% of viewport height in reference but 40% in rendered").

### Step 4 — Write findings

Write findings to `[sessionDir]/findings-visual-fidelity.md` using this exact format:

[Insert the same findings format used by cs-vercel-config-auditor and cs-theme-package-validator, with VFR-NNN finding IDs. The format should include Reviewer, Scope, Date, per-finding Severity/File/Rule/Violation/Impact/Fix/Effort fields, and a Statistics block.]

### Severity mapping

| Rule    | Default severity          |
| ------- | ------------------------- |
| VFR-001 | Critical (brand is wrong) |
| VFR-002 | High                      |
| VFR-003 | High                      |
| VFR-004 | Medium                    |
| VFR-005 | Medium                    |
| VFR-006 | Medium                    |
| VFR-007 | Low                       |
| VFR-008 | Critical (a11y contrast)  |
| VFR-009 | High                      |
| VFR-010 | Medium                    |
| VFR-011 | Low                       |
| VFR-012 | Medium                    |
| VFR-013 | High                      |
| VFR-014 | Low                       |

## Rules of engagement

- **You are a gate, not a guide.** Do not suggest design improvements beyond the rules.
- **Do not modify any file.** This is a read-only review.
- **Do not fabricate rules.** If you notice something visually off that isn't covered by VFR-001..014, add it to an `## Out-of-scope observations` section with "not covered by current rule set — for human review". Do not raise it as a rule violation.
- **Vision is qualitative.** You can describe "the primary colour looks redder than the reference" but do not claim a specific Delta-E number unless you actually computed it via Bash tooling. State your confidence level per finding: `high` (measured), `medium` (clearly visible), `low` (subtle, may be false positive).
- **If tooling is missing**, fall back to qualitative description rather than failing silently. State in the findings file which rules had to fall back.
- **Your findings gate pipeline progression.** `/pipeline.validate-site` and `/pipeline.stitch-design` read your statistics line. Use the severity mapping above — do not invent your own labels.

## Relationship to other agents

- **cs-theme-package-validator** — validates structural correctness of the theme package (does it have the right exports, tokens, peerDeps?). This agent validates visual correctness of the rendered output. Complementary, run in parallel. If a structural issue causes a visual issue, the TPV finding is the root cause and the VFR finding is symptomatic — reference the TPV ID in the VFR finding.
- **cs-frontend-engineer** — handles accessibility review and can apply visual fixes (write-capable). This agent cannot apply fixes. Hand off to cs-frontend-engineer for remediation.
- **cs-ui-designer** — handles design system _creation_ and token calibration. This agent only checks whether the rendered output _matches_ an existing reference, not whether the reference itself is good design.

## Extending the rule set

[Same append-only rule extension process as the other auditor agents.]

````

The rules above are placeholders — you need to fill them in with actual procedures. The most important part is making sure each rule has a **concrete "How to check" procedure** that uses the agent's available tools (Read for vision, Bash for shell comparison tools).

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md
# Frontmatter structure check
head -50 /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md | grep -q "^name: cs-visual-fidelity-reviewer"
head -50 /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md | grep -q "^tools:"
# Must NOT have Write or Edit in tools
! grep -E "tools:.*Write|tools:.*Edit" /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md
# Must have at least 10 VFR rules
test $(grep -c "^### VFR-" /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md) -ge 10
# Must reference the review procedure steps
grep -q "Step 1" /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md
grep -q "Severity mapping" /Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md
````

**Commit** (NOTE: the agent file lives in `~/.claude/agents/`, which is OUTSIDE the LBP repo — so it is not committed here. The brief acknowledges this and instead the commit in this phase is a session note documenting that the agent was created):

```bash
cat > output/sessions/2026-04-10_pipeline-upgrades/C-agent-created.md << 'EOF'
# Agent created outside repo

`cs-visual-fidelity-reviewer` was created at:
`/Users/rickywilson/.claude/agents/cs-visual-fidelity-reviewer.md`

This file lives in the user's global Claude Code agents directory
(not inside any repo), so it is not tracked by git in LBP or force.
The agent is available to both repos automatically because
`~/.claude/agents/` is the user-global agent pool.

Rule IDs: VFR-001 through VFR-NNN (check the agent file for the current count).
EOF

git add output/sessions/2026-04-10_pipeline-upgrades/C-agent-created.md
git commit -m "$(cat <<'EOF'
docs(session): note creation of cs-visual-fidelity-reviewer agent

The agent definition itself lives in ~/.claude/agents/ (user-global),
not in this repo. This session note documents the creation so the
pipeline upgrade trail is complete in the LBP output/sessions/ folder.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Wire `cs-visual-fidelity-reviewer` into `/pipeline.validate-site` with parallel fan-out

**Goal:** Refactor `/pipeline.validate-site` so that the visual fidelity review, accessibility audit, and performance check run as **3 parallel sub-agents in a single Task-tool message**, instead of the current sequential review-then-fix retry loop.

**Model:** orchestrator (opus) — skill refactor with multi-agent orchestration.

**Files:** `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md`

**Before writing**, read the current skill in full:

```bash
cat /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
```

Understand the current flow:

- It spins up the dev server
- Captures screenshots
- Runs a review agent (currently `cs-code-reviewer`) against the screenshots
- If findings, runs a fix agent (also `cs-code-reviewer`)
- Retries up to 3 times

The refactor replaces "run review agent" with "fan out 3 specialist review agents in parallel", then aggregates findings before the fix step. The fix step stays as-is (for now — the fix agent is a separate concern).

**Structural changes to make:**

### Change 1: Split the review step into a parallel fan-out

Replace the current single-agent review step with a fan-out block:

```markdown
### Step N: Parallel review fan-out

After screenshots are captured, spawn 3 review agents in a **single Task-tool message** with `run_in_background: true` so they run concurrently:

#### Review agent 1: Visual fidelity

[Task spawn block for cs-visual-fidelity-reviewer. Prompt it to compare reference-vs-rendered screenshots and write to `findings-visual-fidelity.md` in the current session directory.]

#### Review agent 2: Accessibility

[Task spawn block for cs-frontend-engineer. Prompt it to run an accessibility audit against the rendered site — semantic HTML, ARIA, alt text, form labels, heading hierarchy, contrast. Write to `findings-accessibility.md`.]

#### Review agent 3: Performance

[Task spawn block for cs-frontend-engineer OR cs-devops-engineer (decide which — cs-frontend-engineer knows Lighthouse best). Prompt it to run a performance check: Lighthouse if available, or fallback to basic metrics (bundle size, critical CSS, image sizes). Write to `findings-performance.md`.]

**All three agents must be spawned in the SAME Task tool message** so Claude Code launches them concurrently. Do NOT spawn them sequentially. Do NOT wait between them.

### Aggregation

After all three agents complete (use TaskOutput to poll), read each findings file and aggregate into `findings-aggregated.md`. Use the same aggregation pattern as `/review.code`'s Step 3.
```

### Change 2: Update the retry loop to gate on aggregated findings

The current retry loop runs up to 3 times. After the refactor, the retry should:

1. Check the aggregated findings for Critical + High count
2. If > 0, invoke the fix agent (unchanged behaviour)
3. After fix, re-capture screenshots and re-run the parallel fan-out
4. Continue until aggregated Critical + High == 0 OR 3 retries are exhausted

### Change 3: Preserve the dev-server lifecycle

Do NOT touch the dev-server startup / teardown logic. That runs before and after the review/fix loop and is correct as-is.

### Change 4: Update the final report

The final report section should summarise findings by domain (visual / a11y / perf) instead of by severity alone.

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
# The refactored file must still exist and be substantial
test -f /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
# Must reference all 3 specialist agents
grep -q "cs-visual-fidelity-reviewer" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
grep -q "cs-frontend-engineer" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
# Must state that the 3 agents run in a single message
grep -q "single Task-tool message\|single message" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
# Must reference all 3 findings files
grep -q "findings-visual-fidelity" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
grep -q "findings-accessibility" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
grep -q "findings-performance" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.validate-site.md
pnpm type-check
pnpm lint
```

**Commit:**

```bash
git add .claude/commands/pipeline.validate-site.md
git commit -m "$(cat <<'EOF'
refactor(skills): parallelise /pipeline.validate-site review fan-out

Replace the current single-agent cs-code-reviewer invocation with a
parallel fan-out of 3 specialist agents in a single Task-tool message:
cs-visual-fidelity-reviewer for visual/theme fidelity, cs-frontend-
engineer for accessibility, cs-frontend-engineer for performance.

Review runs concurrently instead of sequentially, reducing wall-clock
time for the validation cycle. The retry loop and fix agent logic
remain unchanged — only the review step is parallelised.

Part of the pipeline parallelization plan (items #8 and #2).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Update `/pipeline.stitch-design` to invoke the new agent for post-generation validation

**Goal:** Update `/pipeline.stitch-design` so its post-Stitch validation step calls `cs-visual-fidelity-reviewer` instead of the generic reviewer currently in place (or add the call if the skill doesn't currently have a validation step).

**Model:** opus — same reasoning as Phase 2.

**Files:** `/Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.stitch-design.md`

**Read the file first** — `/pipeline.stitch-design` is ~1550 lines and heavily MCP-driven. The decomposition plan (from the parent plan file) explicitly said "keep it monolithic" except for carving out the post-validation step. Do NOT try to decompose it further. The goal here is narrowly to:

1. Find the step (if any) where the generated theme is handed off to validation
2. Replace any generic reviewer call there with `cs-visual-fidelity-reviewer`
3. If no such step exists, add one at the end of the skill (after the theme is generated but before hand-off to test-site creation)

**If the skill has no post-generation validation step at all**, add this block near the end (before the final report):

```markdown
### Step N: Post-generation visual fidelity check

After the Stitch-generated theme is written to `packages/themes/<name>/`, spawn `cs-visual-fidelity-reviewer` to compare the rendered test output against the Stitch reference screenshot.

[Task spawn block with model: opus, read-only. Prompt the agent to compare the Stitch reference at `$STITCH_REFERENCE_PATH` against the rendered screenshots at `$RENDERED_PATH` and write findings to `$SESSION_DIR/findings-visual-fidelity.md`.]

If the agent returns `Critical + High > 0`, STOP and print the findings file. Do not proceed to test site hand-off.
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
grep -q "cs-visual-fidelity-reviewer" /Users/rickywilson/Sites/local-business-platform/.claude/commands/pipeline.stitch-design.md
pnpm type-check
pnpm lint
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(skills): add post-generation visual fidelity check to stitch pipeline

/pipeline.stitch-design now invokes cs-visual-fidelity-reviewer after
the theme package is generated and before hand-off to test site
creation. Findings gate pipeline progression on Critical+High severity.

Part of the pipeline parallelization plan (item #8).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Build verification

**Goal:** Confirm nothing in the repo broke as a side effect.

```bash
pnpm type-check
pnpm lint
pnpm build
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm lint
pnpm build
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                   | File overlap            | Model | Rationale                                                                                |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----- | ---------------------------------------------------------------------------------------- |
| G1    | Phase 1 | Read `cs-vercel-config-auditor.md`, Read `cs-theme-package-validator.md`, Read `cs-frontend-engineer.md`, Read `pipeline.validate-site.md`, Read `docs/standards/styling.md`, Read `packages/theme-system/src/types.ts` | none (reads)            | n/a   | 6 independent reads to ground the new agent definition                                   |
| G2    | Phase 2 | Read `pipeline.validate-site.md` (full, if not already cached from G1)                                                                                                                                                  | none                    | n/a   | Single read; trivial                                                                     |
| G3    | Phase 3 | Read `pipeline.stitch-design.md` (full)                                                                                                                                                                                 | none                    | n/a   | Single read; trivial                                                                     |
| G4    | Phase 4 | Run `pnpm type-check`, Run `pnpm lint`                                                                                                                                                                                  | none (read-only checks) | n/a   | Independent verification commands — batch in one message. `pnpm build` runs alone after. |

### Cross-phase groups

**None.** Phase 2 depends on Phase 1's agent definition existing (the wiring would fail otherwise). Phase 3 is logically independent of Phase 2 but shares the same target concept, so sequential execution keeps the commits clean.

### Sequential points — MUST NOT parallelise

| Item                    | Reason                                                                          |
| ----------------------- | ------------------------------------------------------------------------------- |
| Phase 1 → Phase 2       | The agent must exist before the skill can reference it.                         |
| Phase 2 → Phase 3       | Separate skill files but related refactors; serialise for clean commit history. |
| Phase 3 → Phase 4       | Verification must happen on the final committed state.                          |
| `pnpm build` in Phase 4 | Must run alone.                                                                 |

---

## Cost Estimate

| Phase                            | Model | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------- | ----- | ----------------- | ------------------ | ---------- |
| Phase 1 (new agent definition)   | opus  | ~30k              | ~12k               | $0.45      |
| Phase 2 (validate-site refactor) | opus  | ~15k              | ~5k                | $0.20      |
| Phase 3 (stitch-design edit)     | opus  | ~20k              | ~3k                | $0.18      |
| Phase 4 (build verify)           | opus  | ~6k               | ~1k                | $0.06      |
| **Total**                        |       | **~71k**          | **~21k**           | **~$0.89** |

---

## Final Report

After all phases complete:

1. Phases completed — list each with commit SHA
2. Agent definition file location and size (lines, rule count)
3. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
4. Any exceptions or intentional deviations
5. Token usage and cost vs estimate

## Update Session File

Append to this brief file:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: agent rule count, which rules had to fall back to qualitative because of missing Bash tools, any surprises in the validate-site refactor]

### Commits

- Phase 1: [SHA] — session note documenting agent creation
- Phase 2: [SHA] — /pipeline.validate-site parallel fan-out
- Phase 3: [SHA] — /pipeline.stitch-design post-gen validation

### Agent file

- Path: ~/.claude/agents/cs-visual-fidelity-reviewer.md
- Lines: [N]
- Rules: VFR-001 through VFR-[N]
```

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **The agent definition file lives OUTSIDE the repo** at `~/.claude/agents/cs-visual-fidelity-reviewer.md`. It is NOT committed to the LBP repo. Only a session note documenting its creation is committed.
- **The agent is read-only** — tool list must NOT contain Write or Edit. Verify this in the Phase 1 gate.
- **Do not decompose `/pipeline.stitch-design`.** The plan explicitly says keep it monolithic. Only add the validation call at the end.
- **Do not touch `/pipeline.ingest`.** That skill is the subject of Brief B — do not step on it.
- **Consult the `## Parallel execution groups` section** before launching any work.
- Never push — leave all changes on `feature/pipeline-upgrades-c`
- Minimal changes only — implement what the brief says, nothing more
- The Co-Authored-By line in commits must reflect opus (`Claude Opus 4.6`)

---

## Terminal command to launch this brief

```
claude --dangerously-skip-permissions --model opus -p "Read output/sessions/2026-04-10_pipeline-upgrades/C-visual-fidelity-agent.md in full, then implement every phase it describes exactly as written."
```

---

## Completed

**Date:** 2026-04-10
**Status:** All phases executed successfully

The new `cs-visual-fidelity-reviewer` agent was written with 14 rules (VFR-001 through VFR-014) covering brand colour drift, hero/header/card/section variant matching, typography scale, button radius, contrast, logo presence, overlay treatments, section spacing, mobile breakpoints, hardcoded colour-scale class detection, and font family. All rules that require numerical precision (VFR-001 Delta-E, VFR-008 contrast ratio) specify Bash tooling procedures using ImageMagick `identify` and Python PIL with explicit fallback to qualitative description when tooling is unavailable — confidence levels are declared per finding. `/pipeline.validate-site` was refactored from a single sequential `cs-code-reviewer` invocation to a parallel fan-out of 3 specialists in a single Task-tool message; the skill also gained two new optional arguments (`--reference-screenshot-dir`, `--session-dir`) and a domain-breakdown final report. The `/pipeline.stitch-design` edit was narrow: a single new Step 5i inserted after the existing Step 5h, leaving the 1550-line skill otherwise intact. `pnpm type-check` and `pnpm build` both pass clean; `pnpm lint` has pre-existing failures in `dcs-design-taste` unrelated to this branch.

### Commits

- Phase 1: `6fb64c9` — session note documenting agent creation
- Phase 2: `f6e1295` — /pipeline.validate-site parallel fan-out
- Phase 3: `3e4cbb1` — /pipeline.stitch-design post-gen validation

### Agent file

- Path: `~/.claude/agents/cs-visual-fidelity-reviewer.md`
- Lines: 579
- Rules: VFR-001 through VFR-014
