# Pipeline Upgrades — YOLO Execution Plan

This folder contains 5 YOLO briefs that implement the remaining 11 items from the pipeline parallelization plan ([plans/parallel-finding-puffin.md](~/.claude/plans/parallel-finding-puffin.md)).

Items 1, 6, 7, and F5 have already been completed in the current Claude session (new agents `cs-vercel-config-auditor` and `cs-theme-package-validator` created and wired into `/review.code`, `/deploy.changes`, and `/fix.findings`; the new `## Parallel execution groups` schema added to `/plan.to.yolo`; and force's root `CLAUDE.md` populated to lock in `GOVERNANCE §8`).

## The 5 briefs

| Brief                                                            | Covers items    | Depends on                                                                                                    | Can run in parallel with                  |
| ---------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [A-quick-wins.md](A-quick-wins.md)                               | #5, F1, F3, #10 | Nothing — safe to run first                                                                                   | B, C, D                                   |
| [B-pipeline-ingest-decompose.md](B-pipeline-ingest-decompose.md) | #9, #3          | Nothing — touches only `/pipeline.ingest`                                                                     | A, C, D                                   |
| [C-visual-fidelity-agent.md](C-visual-fidelity-agent.md)         | #8, #2          | Nothing — creates new agent + wires into `/pipeline.validate-site`                                            | A, B, D                                   |
| [D-deploy-preflight-parallel.md](D-deploy-preflight-parallel.md) | #4              | The `cs-vercel-config-auditor` wiring in `/deploy.changes` (already done in this session)                     | A, B, C                                   |
| [E-cross-repo-sync.md](E-cross-repo-sync.md)                     | F2, F4          | A (for #10 doc) and the new `cs-vercel-config-auditor` / `cs-theme-package-validator` to exist (already done) | Should run LAST — depends on A completing |

## Recommended execution order

**Option 1 — Maximum parallelism (4 concurrent YOLO sessions):**

Open 4 terminal windows and run A, B, C, D concurrently. Each session works on disjoint files — no conflicts.

When all 4 complete, run E.

Per the worktree decision rule being added in brief A: **this is the exact scenario that justifies git worktrees.** 4 concurrent sessions on the same repo, >15 min each, independent. Each session should create a worktree:

```bash
# Terminal 1
cd /Users/rickywilson/Sites/local-business-platform
git worktree add .claude/worktrees/upgrades-a feature/pipeline-upgrades-a
cd .claude/worktrees/upgrades-a
# then run the YOLO command for A

# Terminal 2
cd /Users/rickywilson/Sites/local-business-platform
git worktree add .claude/worktrees/upgrades-b feature/pipeline-upgrades-b
cd .claude/worktrees/upgrades-b
# then run the YOLO command for B

# ... and so on for C and D
```

After all 4 complete successfully, merge the feature branches back into `develop` in any order (no file overlap). Then run E in the main working copy.

**Option 2 — Sequential (one terminal, no worktrees):**

Run A, B, C, D, E in order on `develop` directly (no feature branches). Simpler but slower. Each brief creates its own feature branch from develop and leaves changes uncommitted for you to review.

## Brief file naming

Each brief file is a complete, self-contained YOLO prompt with the new `## Parallel execution groups` schema populated. The terminal command to launch each one appears at the bottom of the brief file.

## What was already done in the current Claude session

The following items are **already complete** and must not be re-done by any YOLO session:

- **F5:** `/Users/rickywilson/Sites/force/CLAUDE.md` populated (was empty; now 100 lines)
- **#1:** `/Users/rickywilson/Sites/local-business-platform/.claude/commands/plan.to.yolo.md` — new Section 3c-bis `## Parallel execution groups` block added, Rules footer updated
- **#6:** `/Users/rickywilson/.claude/agents/cs-vercel-config-auditor.md` created; wired into `/deploy.changes` (new Step 2.5 gate), `/review.code` (conditional Agent 5), `/fix.findings` (prefix mapping)
- **#7:** `/Users/rickywilson/.claude/agents/cs-theme-package-validator.md` created; wired into `/review.code` (conditional Agent 6), `/fix.findings` (prefix mapping). The `/pipeline.ingest` wiring is intentionally deferred to brief B (item #9).

## After all 5 briefs complete

Run `/deploy.changes` from the main working copy on `develop`. The new Vercel config auditor will run as part of the pre-flight gate and should pass cleanly.
