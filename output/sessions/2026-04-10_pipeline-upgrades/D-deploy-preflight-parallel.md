# YOLO Implementation Brief D: `/deploy.changes` Pre-flight Parallelization

**Branch:** `feature/pipeline-upgrades-d` (created from `develop`)
**Session spec:** `output/sessions/2026-04-10_pipeline-upgrades/D-deploy-preflight-parallel.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet (mechanical refactor of an existing sequential block into a parallel fan-out)

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                              |
| ------ | -------- | ---------------------- | ------------------------------------ |
| Opus   | `opus`   | $5 / $25               | Architectural judgement              |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — this brief |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks                     |

Default orchestrator: **sonnet**.

---

## Context

`/deploy.changes` currently runs its pre-flight checks sequentially:

1. `/update.docs` (Step 2)
2. Vercel config audit (Step 2.5 — added earlier in the pipeline upgrade session)
3. `pnpm type-check` (Step 3)
4. `pnpm lint` (Step 3)
5. `pnpm build` (Step 3)
6. `pnpm test` (Step 3, if available)

Of these, `type-check`, `lint`, and the Vercel config audit are **independent read-only checks that can run in parallel**. `build` and `test` have write side effects and must run alone. `/update.docs` runs first because it may modify files that the other checks will then read.

This brief refactors Steps 2.5 and 3 into a two-group parallel fan-out:

- **Group 1 (parallel):** type-check, lint, Vercel config audit (all read-only, no file writes)
- **Group 2 (sequential after Group 1):** build, test (write side effects, run one after the other)

Git promotion (develop → staging → main, Steps 5-7) remains strictly sequential — that is correct and must not be touched.

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/pipeline-upgrades-d
pnpm type-check   # must be clean before starting
```

## Phase 1 — Read the current `/deploy.changes.md` and understand the structure

**Goal:** Confirm the current state matches the assumptions in the Context above, and understand exactly which lines need to change.

**Model:** sonnet.

**Files to read:**

1. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md` — the full current skill

**After reading, confirm these facts**:

- Step 2 (`/update.docs`) runs first and can modify files — must NOT be in the parallel group.
- Step 2.5 (Vercel config audit) was added in a prior session of the pipeline upgrades plan and invokes `cs-vercel-config-auditor` via Task. Read-only. Can be in the parallel group.
- Step 3 currently contains `pnpm type-check`, `pnpm lint`, `pnpm build` as separate bash blocks, and optionally `pnpm test`. `type-check` and `lint` are read-only. `build` and `test` are NOT.
- Steps 4–9 (commit, push develop, merge staging, merge main, return, report) are NOT part of pre-flight and must not be touched.

If any of these facts are wrong, STOP and report the discrepancy. Do not proceed with a broken assumption.

## Phase 2 — Refactor Steps 2.5 and 3 into parallel + sequential groups

**Goal:** Restructure the skill so pre-flight checks use a parallel group for read-only checks and a sequential group for write-side-effect checks.

**Model:** sonnet.

**Files:** `/Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md`

**Exact changes:**

### Change 1: Replace Steps 2.5 and 3 with new Step 3 structure

Delete the current Step 2.5 (Vercel config audit) and Step 3 (Pre-commit verification) blocks. Replace them with a new Step 3 that contains two sub-blocks:

````markdown
### Step 3: Pre-commit Verification — parallel + sequential

Pre-commit verification runs in two groups:

- **Group 3a (parallel, read-only):** type-check, lint, and Vercel config audit run concurrently. Each is independent and does not write files.
- **Group 3b (sequential, write-side-effects):** build and test run sequentially AFTER Group 3a passes. These have filesystem side effects and must not run in parallel.

If anything in Group 3a fails, STOP — do not proceed to Group 3b.
If anything in Group 3b fails, STOP — do not commit broken code.

#### Group 3a — Parallel read-only checks

Launch these three checks in parallel. Type-check and lint are bash commands that run independently; the Vercel config audit is a Task-tool sub-agent invocation. **All three must be launched together — use a single message with parallel Bash calls for type-check and lint, and the Task call for the audit agent, so Claude Code runs them concurrently.**

##### Check 3a-i: TypeScript check

```bash
pnpm type-check
```
````

##### Check 3a-ii: Lint

```bash
pnpm lint
```

##### Check 3a-iii: Vercel config audit

Spawn `cs-vercel-config-auditor` via the Task tool:

```
Task tool parameters:
  description: "Pre-deploy Vercel config audit"
  subagent_type: "cs-vercel-config-auditor"
```

**Prompt for the agent:**

> You are running a pre-deploy audit of the local-business-platform monorepo for Vercel / Next.js / Turborepo configuration issues.
>
> **Scope:** Full audit. Run all applicable rules (VCA-001 through VCA-009).
>
> **Session directory:** If `output/sessions/YYYY-MM-DD_deploy/` already exists (today's date), write into it. Otherwise, create `output/sessions/YYYY-MM-DD_deploy/` and write findings there.
>
> **Output file:** `output/sessions/YYYY-MM-DD_deploy/findings-vercel-config.md`
>
> Follow the review procedure in your agent definition exactly. Do NOT modify any files — this is a read-only audit. Report all findings with severity per the mapping table.
>
> **Return:** The Statistics line from your findings file (format: `Critical: N | High: N | Medium: N | Low: N | Total: N`) so the orchestrator can decide whether to proceed.

##### Group 3a aggregation

Wait for all three checks to complete. Then:

1. If `pnpm type-check` failed, STOP and report the error. Do not continue.
2. If `pnpm lint` failed, STOP and report the error.
3. Read the Statistics line from `output/sessions/YYYY-MM-DD_deploy/findings-vercel-config.md`. If `Critical + High > 0`:
   - Print the full findings file
   - Tell the user: "Vercel config audit blocked the deploy. See `output/sessions/YYYY-MM-DD_deploy/findings-vercel-config.md`. Fix the Critical/High findings and re-run `/deploy.changes`."
   - Do NOT proceed to Group 3b.
4. If Group 3a passed entirely (possibly with Medium/Low Vercel warnings), continue to Group 3b. Note any warnings in the final report.

#### Group 3b — Sequential write-side-effect checks

These run ONLY if Group 3a passed. They run sequentially because each writes files (`.next/`, `dist/`, node_modules cache) and parallel execution causes filesystem races.

```bash
pnpm build
```

If build fails, STOP.

```bash
pnpm test
```

If test scripts are available and test fails, STOP.

Only proceed to committing once both Group 3a and Group 3b have passed.

````

### Change 2: Verify other steps are unchanged

Phase 2 must NOT modify:
- Step 1 (branch verification)
- Step 2 (`/update.docs`)
- Steps 4-9 (commit, push, merge, return, report)

If the original file has a different numbering scheme than expected, preserve the numbering style of the original — do not renumber unrelated steps.

### Change 3: Update the Rules section at the bottom

Add one new rule to the existing "Rules" section:

```markdown
- **Pre-flight checks run in two groups** — Group 3a (parallel read-only) and Group 3b (sequential write-side-effect). Do not serialise Group 3a or parallelise Group 3b.
````

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md

# The new group structure must exist
grep -q "Group 3a" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "Group 3b" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md

# The cs-vercel-config-auditor call must still exist
grep -q "cs-vercel-config-auditor" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md

# type-check, lint, build, test must all still be present
grep -q "pnpm type-check" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "pnpm lint" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "pnpm build" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "pnpm test" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md

# The git promotion steps must still exist unchanged
grep -q "git push origin develop" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "git checkout staging" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md
grep -q "git checkout main" /Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md

# Verify the build still works
pnpm type-check
pnpm lint
```

**Commit:**

```bash
git add .claude/commands/deploy.changes.md
git commit -m "$(cat <<'EOF'
refactor(skills): parallelise /deploy.changes pre-flight checks

Pre-flight now runs in two groups:
- Group 3a (parallel, read-only): type-check, lint, Vercel config audit
- Group 3b (sequential, write-side-effects): build, test

Group 3a runs in a single Task-tool message so the three checks
execute concurrently. Group 3b runs sequentially after because build
and test both write to the filesystem. Git promotion (steps 4-9)
remains strictly sequential.

Reduces wall-clock time for deployments where all checks pass, and
surfaces Vercel config issues in parallel with the standard checks
instead of after them.

Part of the pipeline parallelization plan (item #4).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## Phase 3 — Update documentation

**Goal:** Update `docs/standards/deployment.md` (if it exists) or `docs/guides/deploying-site.md` to mention the new group structure.

**Model:** sonnet.

**Files:** Whichever of the following exists:

- `docs/standards/deployment.md`
- `docs/guides/deploying-site.md`

**If neither exists, skip Phase 3 and move to Phase 4.** Do not create a new doc just to satisfy this phase.

**If one exists**, find the section describing the pre-flight check order and add a sentence:

> As of 2026-04-10, pre-flight checks run in two groups: Group 3a (type-check, lint, Vercel config audit) in parallel, followed by Group 3b (build, test) sequentially. See `.claude/commands/deploy.changes.md` Step 3 for the authoritative procedure.

Then commit:

```bash
git add docs/standards/deployment.md  # or docs/guides/deploying-site.md
git commit -m "$(cat <<'EOF'
docs(deployment): note pre-flight group structure

Pre-flight checks in /deploy.changes now run in two groups (parallel
read-only then sequential write-side-effect). Reference the skill
file for the authoritative procedure.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## Phase 4 — Build verification

**Goal:** Confirm nothing broke as a side effect.

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

| Group | Phase   | Items                                                                                 | File overlap | Model | Rationale                                                         |
| ----- | ------- | ------------------------------------------------------------------------------------- | ------------ | ----- | ----------------------------------------------------------------- |
| G1    | Phase 1 | Read `deploy.changes.md`                                                              | none         | n/a   | Single read; trivial                                              |
| G2    | Phase 2 | —                                                                                     | —            | —     | Single file rewrite; no intra-phase parallelism                   |
| G3    | Phase 3 | Glob for `docs/standards/deployment.md` and `docs/guides/deploying-site.md` existence | none         | n/a   | Two independent existence checks                                  |
| G4    | Phase 4 | Run `pnpm type-check`, Run `pnpm lint`                                                | none         | n/a   | Independent verification commands. `pnpm build` runs alone after. |

### Cross-phase groups

**None.** All phases are sequential.

### Sequential points — MUST NOT parallelise

| Item                    | Reason                                            |
| ----------------------- | ------------------------------------------------- |
| Phase 1 → Phase 2       | Must understand structure before editing          |
| Phase 2 → Phase 3       | Documentation must reflect the actual skill state |
| `pnpm build` in Phase 4 | Writes `.next/` and `dist/` — must run alone      |

---

## Cost Estimate

| Phase                    | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1 (read + analyse) | sonnet | ~4k               | ~1k                | $0.03      |
| Phase 2 (skill refactor) | sonnet | ~8k               | ~3k                | $0.07      |
| Phase 3 (docs update)    | sonnet | ~5k               | ~1k                | $0.03      |
| Phase 4 (build verify)   | sonnet | ~6k               | ~1k                | $0.03      |
| **Total**                |        | **~23k**          | **~6k**            | **~$0.16** |

---

## Final Report

After all phases complete:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations
4. Token usage and cost vs estimate
5. Note whether Phase 3 ran or was skipped (depending on whether a deployment doc file existed)

## Update Session File

Append to this brief file:

```markdown
## Completed

**Date:** [today]
**Status:** All applicable phases executed successfully

[1-paragraph summary: any surprises in the current skill's structure, whether Phase 3 ran or was skipped, confirmation that git promotion steps were left untouched]

### Commits

- Phase 2: [SHA] — pre-flight parallelization
- Phase 3: [SHA or "skipped — no deployment doc found"]
```

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Do NOT touch git promotion steps** (Steps 4-9 in the current skill). They must remain strictly sequential.
- **Do NOT touch Step 1 (branch verification) or Step 2 (`/update.docs`).** Only Step 2.5 and Step 3 change.
- **Do NOT parallelise Group 3b.** Build and test write files; parallel execution causes filesystem races.
- **Consult the `## Parallel execution groups` section** before launching any work.
- Never push — leave all changes on `feature/pipeline-upgrades-d`
- Minimal changes only — implement what the brief says, nothing more
- This brief touches ONLY local-business-platform.
- The Co-Authored-By line in commits must reflect sonnet (`Claude Sonnet 4.6`)

---

## Terminal command to launch this brief

```
claude --dangerously-skip-permissions --model sonnet -p "Read output/sessions/2026-04-10_pipeline-upgrades/D-deploy-preflight-parallel.md in full, then implement every phase it describes exactly as written."
```

## Completed

**Date:** 2026-04-10
**Status:** All applicable phases executed successfully

The current skill structure matched all assumptions in the brief exactly — Step 2.5 (Vercel config audit) was a standalone sequential step, and Step 3 ran type-check, lint, build, and test as a flat sequential block. The refactor merged Step 2.5 into Group 3a alongside type-check and lint, and separated build/test into Group 3b. Git promotion steps (4-9) were left completely untouched. Phase 3 ran on `docs/standards/deployment.md`, which had the right `## Pre-Deployment Checks` section to annotate. One pre-existing lint condition was noted: `dcs-industrial-brutalist` and `dcs-design-taste` sites had unrelated lint errors (not introduced by this change, which touched only markdown files). type-check and build both passed clean.

### Commits

- Phase 2: 351aba2 — pre-flight parallelization
- Phase 3: 9c5add6 — docs(deployment): note pre-flight group structure
