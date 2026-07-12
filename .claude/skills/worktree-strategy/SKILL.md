---
name: worktree-strategy
description: When and how to use git worktrees for parallel Claude Code sessions on local-business-platform — decision rule, scenarios, and worktree commands. Use when setting up 2+ concurrent sessions, parallel YOLO runs, or deciding whether a task needs a worktree.
---

# Parallel sessions & git worktrees

The default workflow is: feature branch off `develop`, one Claude session at a time, merge back when done. Worktrees are not needed for normal work — the March 2026 remediation of 49 findings across 37 files and 3 sites completed with zero conflicts using feature branches alone.

Worktrees are the right choice only in a narrow set of circumstances. Use the decision rule below.

## Decision rule — use a worktree when ALL of these are true

1. You intend to run **2+ concurrent Claude sessions** against the same repo.
2. The work crosses **different branches** or would cause branch-switch races.
3. The sessions will run **>15 minutes each** (otherwise the setup cost dominates).
4. The work is **independent** (no shared files or build artifacts).

If any of the four conditions is false, use a normal feature branch instead.

## Specific scenarios

| Scenario                                                    | Use worktree?                    | Why                                                                                                     |
| ----------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Parallel YOLO sessions on the same repo                     | **Yes**                          | The killer use case. Each session gets its own worktree + feature branch and merges back when verified. |
| Large architecture refactor needing safety isolation        | No                               | Feature branch + `git stash` is sufficient. Worktrees add friction without safety.                      |
| Pipeline runs spinning up ephemeral test sites              | No                               | Test sites already live in isolated `sites/test-*` directories. Double isolation for no gain.           |
| Concurrent `/pipeline.ingest` + `/review.code` on same repo | Marginal — only if both run long | Usually not worth it.                                                                                   |

## Mechanics

To create a worktree for a parallel session:

```bash
# From the main working copy
git worktree add .claude/worktrees/my-session feature/my-session-branch

# Then cd into it and work as usual
cd .claude/worktrees/my-session
# ... run YOLO, commit, verify ...
```

When the session is done and the branch has been merged back:

```bash
# From any worktree of the repo
git worktree remove .claude/worktrees/my-session
git branch -d feature/my-session-branch
```

`.claude/worktrees/` is gitignored — see the root `.gitignore`.

## What NOT to do

- **Do not use worktrees for single-session work.** It adds friction with no benefit.
- **Do not create nested worktrees.** One level of worktree off the main working copy is the supported topology.
- **Do not use worktrees to work around branch-protection rules.** They are not a shortcut around CI.
- **Do not leave stale worktrees.** `git worktree prune` regularly or remove them when done.

## Cross-repo note

This rule applies to local-business-platform only. The force repo (`/Users/rickywilson/Sites/force/`) has `GOVERNANCE §8` which explicitly forbids parallel job execution. Do not propagate worktree adoption to force until `§8` is lifted — see `force/CLAUDE.md` for the authoritative rule there.
