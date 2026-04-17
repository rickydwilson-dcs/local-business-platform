# YOLO Implementation Brief A: Quick Wins — Independent Documentation & Tooling

**Branch:** `feature/pipeline-upgrades-a` (created from `develop`)
**Session spec:** `output/sessions/2026-04-10_pipeline-upgrades/A-quick-wins.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Context

This brief implements four independent documentation and tooling items from the pipeline parallelization plan. None of the four phases touch the same files, so they are fully independent and can be implemented in any order. They are grouped together because each individual item is too small to justify its own YOLO session.

The four items are:

1. **#5** — Add a worktree decision rule paragraph to LBP `CLAUDE.md`
2. **F1** — Add a `just sync-skills` target to the force repo
3. **F3** — Create a new `/review.workflows` skill in the force repo that reviews W1–W5 prompts via `cs-prompt-engineer`
4. **#10** — Write a new `docs/guides/orchestration-patterns.md` in LBP documenting the 4 orchestration patterns in use

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/pipeline-upgrades-a
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Worktree decision rule in LBP CLAUDE.md (item #5)

**Goal:** Add a "Parallel sessions & git worktrees" section to `/Users/rickywilson/Sites/local-business-platform/CLAUDE.md` that codifies when to use a worktree vs a feature branch.

**Model:** sonnet — documentation writing with specific structural requirements.

**Files:** `/Users/rickywilson/Sites/local-business-platform/CLAUDE.md`

**Exact content to add** (insert as a new top-level section immediately before `## Documentation`, after the `## When Things Break` section):

````markdown
---

## Parallel sessions & git worktrees

The default workflow is: feature branch off `develop`, one Claude session at a time, merge back when done. Worktrees are not needed for normal work — the March 2026 remediation of 49 findings across 37 files and 3 sites completed with zero conflicts using feature branches alone.

Worktrees are the right choice only in a narrow set of circumstances. Use the decision rule below.

### Decision rule — use a worktree when ALL of these are true

1. You intend to run **2+ concurrent Claude sessions** against the same repo.
2. The work crosses **different branches** or would cause branch-switch races.
3. The sessions will run **>15 minutes each** (otherwise the setup cost dominates).
4. The work is **independent** (no shared files or build artifacts).

If any of the four conditions is false, use a normal feature branch instead.

### Specific scenarios

| Scenario                                                    | Use worktree?                    | Why                                                                                                     |
| ----------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Parallel YOLO sessions on the same repo                     | **Yes**                          | The killer use case. Each session gets its own worktree + feature branch and merges back when verified. |
| Large architecture refactor needing safety isolation        | No                               | Feature branch + `git stash` is sufficient. Worktrees add friction without safety.                      |
| Pipeline runs spinning up ephemeral test sites              | No                               | Test sites already live in isolated `sites/test-*` directories. Double isolation for no gain.           |
| Concurrent `/pipeline.ingest` + `/review.code` on same repo | Marginal — only if both run long | Usually not worth it.                                                                                   |

### Mechanics

To create a worktree for a parallel session:

```bash
# From the main working copy
git worktree add .claude/worktrees/my-session feature/my-session-branch

# Then cd into it and work as usual
cd .claude/worktrees/my-session
# ... run YOLO, commit, verify ...
```
````

When the session is done and the branch has been merged back:

```bash
# From any worktree of the repo
git worktree remove .claude/worktrees/my-session
git branch -d feature/my-session-branch
```

`.claude/worktrees/` is gitignored — see the root `.gitignore`.

### What NOT to do

- **Do not use worktrees for single-session work.** It adds friction with no benefit.
- **Do not create nested worktrees.** One level of worktree off the main working copy is the supported topology.
- **Do not use worktrees to work around branch-protection rules.** They are not a shortcut around CI.
- **Do not leave stale worktrees.** `git worktree prune` regularly or remove them when done.

### Cross-repo note

This rule applies to local-business-platform only. The force repo (`/Users/rickywilson/Sites/force/`) has `GOVERNANCE §8` which explicitly forbids parallel job execution. Do not propagate worktree adoption to force until `§8` is lifted — see `force/CLAUDE.md` for the authoritative rule there.

---

````

**Then update the root `.gitignore`** to add `.claude/worktrees/` if it is not already ignored:

```bash
grep -q '^\.claude/worktrees/' /Users/rickywilson/Sites/local-business-platform/.gitignore || echo '.claude/worktrees/' >> /Users/rickywilson/Sites/local-business-platform/.gitignore
````

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
grep -q "Parallel sessions & git worktrees" /Users/rickywilson/Sites/local-business-platform/CLAUDE.md
grep -q "Decision rule — use a worktree when ALL of these are true" /Users/rickywilson/Sites/local-business-platform/CLAUDE.md
grep -q '^\.claude/worktrees/' /Users/rickywilson/Sites/local-business-platform/.gitignore
```

**Commit:**

```bash
git add CLAUDE.md .gitignore
git commit -m "$(cat <<'EOF'
docs(claude): add worktree decision rule and gitignore entry

Codifies the 4-condition AND-gate for when to use git worktrees vs
feature branches, with specific guidance for parallel YOLO sessions.
Part of the pipeline parallelization plan (item #5).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — force `just sync-skills` target (item F1)

**Goal:** Add a `just sync-skills` target to the force repo's `justfile` that copies the 8 shared skills from local-business-platform into force's `.claude/commands/` directory. This keeps force's skill copies in sync with LBP's originals without coupling the repos.

**Model:** sonnet — justfile syntax + shell script + documentation.

**Files:** `/Users/rickywilson/Sites/force/justfile`

**Context:** Force has 8 skill files in `/Users/rickywilson/Sites/force/.claude/commands/` that are byte-identical copies of LBP originals (see README for the list). When LBP edits a shared skill, force's copy drifts until a manual sync. This target makes the sync explicit and reversible.

**Shared skills to sync** (these 8 must match LBP exactly):

- `brief.me.md`
- `deploy.changes.md`
- `fix.findings.md`
- `plan.to.yolo.md`
- `plan.with.codex.md`
- `review.code.md`
- `review.fix.deploy.md`
- `update.docs.md`

**NOT to sync** (these 5 are LBP-specific and should NOT exist in force):

- `pipeline.ingest.md`
- `pipeline.stitch-design.md`
- `pipeline.validate-site.md`
- `pipeline.kill-site.md`
- `pipeline.kill-theme.md`

**NOT to sync** (this is force-specific, must never be overwritten):

- `review.workflows.md` (created in Phase 3 of this brief)

**Exact changes to `/Users/rickywilson/Sites/force/justfile`:**

Read the existing justfile first. Add this new target at the end of the file (after the last existing target, before any trailing comments):

```makefile
# Sync the 8 shared Claude skills from local-business-platform.
# These skills are maintained in LBP and copied into force on demand.
# Force-specific skills (review.workflows) are never overwritten.
sync-skills:
    #!/usr/bin/env bash
    set -euo pipefail
    LBP_COMMANDS="/Users/rickywilson/Sites/local-business-platform/.claude/commands"
    FORCE_COMMANDS="/Users/rickywilson/Sites/force/.claude/commands"
    SHARED_SKILLS=(
      "brief.me.md"
      "deploy.changes.md"
      "fix.findings.md"
      "plan.to.yolo.md"
      "plan.with.codex.md"
      "review.code.md"
      "review.fix.deploy.md"
      "update.docs.md"
    )
    if [ ! -d "$LBP_COMMANDS" ]; then
      echo "ERROR: LBP commands directory not found at $LBP_COMMANDS"
      exit 1
    fi
    echo "Syncing ${#SHARED_SKILLS[@]} shared skills from LBP to force..."
    UPDATED=0
    SKIPPED=0
    for skill in "${SHARED_SKILLS[@]}"; do
      src="$LBP_COMMANDS/$skill"
      dst="$FORCE_COMMANDS/$skill"
      if [ ! -f "$src" ]; then
        echo "  SKIP: $skill (not present in LBP)"
        SKIPPED=$((SKIPPED + 1))
        continue
      fi
      if [ -f "$dst" ] && cmp -s "$src" "$dst"; then
        echo "  OK:   $skill (already in sync)"
      else
        cp "$src" "$dst"
        echo "  COPY: $skill"
        UPDATED=$((UPDATED + 1))
      fi
    done
    echo ""
    echo "Sync complete. $UPDATED updated, $SKIPPED skipped."
    if [ "$UPDATED" -gt 0 ]; then
      echo ""
      echo "Review the changes with: git diff .claude/commands/"
      echo "Commit when ready."
    fi
```

**Note on justfile syntax:** Use a tab (or the project's existing indentation convention — check first) for the body of the recipe. The `#!/usr/bin/env bash` shebang on the first line makes just execute the body as a single shell script rather than per-line, which is required for the multi-line bash logic.

**Also update `/Users/rickywilson/Sites/force/.claude/CLAUDE.md`** — add one line to the justfile commands table:

Find the existing table in `.claude/CLAUDE.md` that lists justfile commands (it's near the bottom) and add this row in alphabetical order:

```
| `just sync-skills` | Sync the 8 shared Claude skills from local-business-platform |
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/force
just --list | grep -q sync-skills
# Dry run — make sure the recipe parses. Use --dry-run if supported, else just invoke:
just sync-skills
# Confirm the 8 skills are present in force after sync
for s in brief.me.md deploy.changes.md fix.findings.md plan.to.yolo.md plan.with.codex.md review.code.md review.fix.deploy.md update.docs.md; do
  test -f .claude/commands/$s || { echo "MISSING: $s"; exit 1; }
done
# Confirm no LBP pipeline skills leaked into force
for s in pipeline.ingest.md pipeline.stitch-design.md pipeline.validate-site.md pipeline.kill-site.md pipeline.kill-theme.md; do
  test ! -f .claude/commands/$s || { echo "LEAKED: $s should not be in force"; exit 1; }
done
echo "sync-skills verification passed"
```

**Commit** (in the force repo):

```bash
cd /Users/rickywilson/Sites/force
git checkout develop
git checkout -b feature/sync-skills-target
git add justfile .claude/CLAUDE.md .claude/commands/
git commit -m "$(cat <<'EOF'
feat(justfile): add sync-skills target for shared LBP skills

Force maintains byte-identical copies of 8 shared Claude skills from
local-business-platform. This target makes the sync explicit and
reversible. Force-specific skills (review.workflows) are never
overwritten.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

**IMPORTANT:** This phase creates a commit in a DIFFERENT repo (force, not local-business-platform). After the commit, return to the LBP working copy:

```bash
cd /Users/rickywilson/Sites/local-business-platform
```

Note the force commit SHA in the final report so the user can push it separately.

---

## Phase 3 — force `/review.workflows` skill (item F3)

**Goal:** Create a new force-specific skill at `/Users/rickywilson/Sites/force/.claude/commands/review.workflows.md` that spawns `cs-prompt-engineer` against each of W1–W5 to review them for ambiguity, missing error paths, token-budget issues, and turn-count calibration.

**Model:** sonnet — skill file writing following existing force patterns.

**Files:** `/Users/rickywilson/Sites/force/.claude/commands/review.workflows.md` (new)

**Context:** Force's 5 workflow prompts (`workflows/w1-w5.md`) are the mission-critical behaviour of every dispatched job. They are written by hand and never systematically reviewed. `cs-prompt-engineer` exists in the global agent pool but is never referenced by any skill. This new skill uses it.

**Before creating the file**, read the following files to understand the force workflow file structure and the cs-prompt-engineer agent's capabilities:

1. `/Users/rickywilson/Sites/force/workflows/w1-backlog-capture.md`
2. `/Users/rickywilson/Sites/force/workflows/w2-prospect-research.md`
3. `/Users/rickywilson/Sites/force/workflows/w3-theme-extraction.md`
4. `/Users/rickywilson/Sites/force/workflows/w4-site-build.md`
5. `/Users/rickywilson/Sites/force/workflows/w5-feature-build.md`
6. `/Users/rickywilson/.claude/agents/cs-prompt-engineer.md` (to understand what the agent expects)
7. `/Users/rickywilson/Sites/force/.claude/commands/review.code.md` (to copy the parallel fan-out pattern)
8. `/Users/rickywilson/Sites/force/GOVERNANCE.md` — specifically §3 (maxTurns ceilings) and §9 (Model Routing Rules), which the review must respect

Use those reads to calibrate the review criteria to how force actually uses the prompts.

**Create the file with this content** (adapt prose as needed based on what you learned from the reads, but keep the structure and agent orchestration pattern intact):

````markdown
# Review Workflows

Review force's 5 workflow prompts (W1–W5) using the `cs-prompt-engineer` specialist agent. This skill is force-specific — no equivalent exists in local-business-platform.

## Arguments

Parse `$ARGUMENTS`:

- **No arguments** → review all 5 workflows in parallel
- **Workflow ID** → single workflow: `W1`, `W2`, `W3`, `W4`, or `W5`

## Step 1: Setup

Verify you are in the force repo and on the `develop` branch:

```bash
cd /Users/rickywilson/Sites/force
git branch --show-current
```
````

If not on `develop`, STOP and inform the user.

Create the session directory:

```bash
SESSION_DIR="output/sessions/$(date +%Y-%m-%d)_workflow-review"
mkdir -p "$SESSION_DIR"
```

Write `session.md`:

\```markdown

# Session: Workflow Review

**Date:** YYYY-MM-DD
**Status:** Active
**Scope:** [all | W1 | W2 | W3 | W4 | W5]

## Agents

| Workflow | Status  | Findings File  |
| -------- | ------- | -------------- |
| W1       | Pending | findings-w1.md |
| W2       | Pending | findings-w2.md |
| W3       | Pending | findings-w3.md |
| W4       | Pending | findings-w4.md |
| W5       | Pending | findings-w5.md |

\```

## Step 2: Read governance before reviewing

Read `/Users/rickywilson/Sites/force/GOVERNANCE.md` in full. The reviews must respect the rules encoded there — especially:

- §1 Capability Tier Matrix (each workflow has a specific tier)
- §3 Cost Governor — maxTurns ceilings per workflow (W1=10, W2=20, W3=15, W4=40, W5=35)
- §9 Model Routing Rules — prompts must use `tier: draft | quality | reasoning` and must NOT hardcode model names

Any review finding that contradicts GOVERNANCE is an invalid finding.

## Step 3: Spawn parallel review agents

For each workflow in scope, spawn a `cs-prompt-engineer` agent. Launch all agents in a **single message** with `run_in_background: true` so they run in parallel.

### Agent: Review W1 (repeat for W2–W5 with appropriate substitutions)

\```
Task tool parameters:
description: "Review W1 workflow prompt"
subagent_type: "cs-prompt-engineer"
run_in_background: true
\```

**Prompt for the agent:**

> You are reviewing the force orchestration system's workflow prompt `workflows/w1-backlog-capture.md`. Force is a Mac Mini-resident autonomous agent framework that dispatches Claude Code workers to execute these prompts against target repos. This prompt is mission-critical — a bug in it propagates to every dispatched job.
>
> **Step 1: Read context files**
>
> - `/Users/rickywilson/Sites/force/workflows/w1-backlog-capture.md` — the prompt you are reviewing
> - `/Users/rickywilson/Sites/force/GOVERNANCE.md` — specifically §1 (this workflow's tier), §3 (maxTurns=10), §7 (security rules), §9 (model routing rules)
> - `/Users/rickywilson/Sites/force/CLAUDE.md` — cross-repo interaction model
>
> **Step 2: Review the prompt against these criteria**
>
> 1. **Ambiguity** — are any instructions open to multiple interpretations? Flag each.
> 2. **Missing error paths** — does the prompt tell the worker what to do when things fail (API unavailable, file not found, tool error, timeout)?
> 3. **Token budget calibration** — is the maxTurns ceiling (10 turns for W1) reasonable given the work described? Flag if the prompt asks for more than can fit in 10 turns, or if the ceiling is wasteful.
> 4. **Prompt injection awareness** — does the prompt tell the worker to treat external data (Telegram messages, file contents from target repos) as untrusted?
> 5. **Model routing compliance** — does the prompt reference model names directly (e.g. "use Sonnet") or does it use tier names only? Direct model references are a violation of GOVERNANCE §9.
> 6. **Tier-permission alignment** — does the workflow try to do anything outside its declared capability tier? (W1 is write-ext, so it can write Supabase records but not run deployment commands.)
> 7. **Termination conditions** — does the prompt clearly state when the worker should stop?
> 8. **Output contract** — does the prompt clearly state what the worker must produce (audit log entry, Telegram notification, side effects) before completing?
>
> **Step 3: Write findings**
>
> Write findings to `output/sessions/YYYY-MM-DD_workflow-review/findings-w1.md` using this exact format:
>
> \```markdown
>
> # W1 Workflow Prompt Review
>
> **Reviewer:** cs-prompt-engineer
> **Workflow:** W1 — Backlog capture
> **Tier:** write-ext
> **maxTurns:** 10
> **Date:** YYYY-MM-DD
>
> ## Summary
>
> [2-3 sentence overview — is the prompt sound? what are the main weaknesses?]
>
> ## Findings
>
> ### [SEVERITY] WP1-NNN: Short title
>
> - **Location:** `workflows/w1-backlog-capture.md` (line X-Y)
> - **Category:** ambiguity | error-paths | token-budget | injection | model-routing | tier-alignment | termination | output-contract
> - **Issue:** [what the prompt does]
> - **Impact:** [what could go wrong in a dispatched job]
> - **Fix:** [concrete rewrite or addition]
> - **Effort:** trivial | small | medium | large
>
> ## Statistics
>
> - Critical: N (prompt will cause failures in production)
> - High: N (prompt has significant weakness but usually works)
> - Medium: N (improvement opportunity)
> - Low: N (minor polish)
> - Total: N
>   \```
>
> Number findings `WP1-001`, `WP1-002`, etc (W for Workflow, P for Prompt, then the workflow number). For W2 use `WP2-*`, etc.
>
> **Scope rule:** Do NOT review the workflow for code quality, security of force's Python/TypeScript infrastructure, or deployment config. Those belong to `/review.code` and `cs-vercel-config-auditor`. This review is ONLY about the prompt text itself.

Repeat the agent block for W2, W3, W4, W5 with these substitutions:

| Workflow | File                                | Tier        | maxTurns | Finding prefix |
| -------- | ----------------------------------- | ----------- | -------- | -------------- |
| W1       | `workflows/w1-backlog-capture.md`   | write-ext   | 10       | `WP1-*`        |
| W2       | `workflows/w2-prospect-research.md` | write-ext   | 20       | `WP2-*`        |
| W3       | `workflows/w3-theme-extraction.md`  | write-local | 15       | `WP3-*`        |
| W4       | `workflows/w4-site-build.md`        | deploy      | 40       | `WP4-*`        |
| W5       | `workflows/w5-feature-build.md`     | deploy      | 35       | `WP5-*`        |

## Step 4: Aggregate

Wait for all agents to complete. Read every findings file that exists and aggregate into `aggregated-report.md`:

\```markdown

# Aggregated Workflow Review Report

**Date:** YYYY-MM-DD
**Scope:** [all | single-workflow]

## Executive Summary

| Severity  | W1     | W2    | W3    | W4    | W5    | **Total** |
| --------- | ------ | ----- | ----- | ----- | ----- | --------- |
| Critical  | N      | N     | N     | N     | N     | **N**     |
| High      | N      | N     | N     | N     | N     | **N**     |
| Medium    | N      | N     | N     | N     | N     | **N**     |
| Low       | N      | N     | N     | N     | N     | **N**     |
| **Total** | ** N** | **N** | **N** | **N** | **N** | **N**     |

**Governance compliance:** [pass | fail — list any findings that touch §1/§3/§7/§9]

## Findings by workflow

[Per-workflow breakdown with top 3 findings each]

## Cross-workflow patterns

[Any repeated issues across multiple workflows — e.g. all 5 missing a specific error path]
\```

## Step 5: Report

Report to the user:

- Total findings per workflow and severity
- Top 5 most critical findings across all workflows
- Any GOVERNANCE violations (these are blocking)
- Session directory path

## Rules

- **READ-ONLY** — do NOT modify any workflow file. This is a review.
- Do NOT auto-commit anything.
- Workflow prompts are in force's `workflows/` directory only — do NOT look at target repo files.
- Findings that contradict GOVERNANCE are invalid — discard them.
- If `cs-prompt-engineer` is not available in the agent pool, STOP and inform the user. Do not fall back to a generic reviewer.
- Never modify GOVERNANCE.md as a result of this review. If the review suggests a GOVERNANCE change, note it in the aggregated report but leave GOVERNANCE untouched.

````

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f /Users/rickywilson/Sites/force/.claude/commands/review.workflows.md
grep -q "cs-prompt-engineer" /Users/rickywilson/Sites/force/.claude/commands/review.workflows.md
grep -q "GOVERNANCE" /Users/rickywilson/Sites/force/.claude/commands/review.workflows.md
grep -q "WP1-" /Users/rickywilson/Sites/force/.claude/commands/review.workflows.md
# Ensure it was NOT synced from LBP (no LBP-specific references)
! grep -q "pipeline\." /Users/rickywilson/Sites/force/.claude/commands/review.workflows.md
````

**Commit** (in force repo — same feature branch as Phase 2):

```bash
cd /Users/rickywilson/Sites/force
git add .claude/commands/review.workflows.md
git commit -m "$(cat <<'EOF'
feat(skills): add /review.workflows for W1-W5 prompt review

New force-specific skill that spawns cs-prompt-engineer against each
of the 5 workflow prompts in parallel. Reviews for ambiguity, missing
error paths, token-budget calibration, injection awareness, model-
routing compliance, tier alignment, termination conditions, and
output contracts. Respects GOVERNANCE sections §1, §3, §7, §9.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
cd /Users/rickywilson/Sites/local-business-platform
```

---

## Phase 4 — Orchestration patterns guide in LBP (item #10)

**Goal:** Write a new `docs/guides/orchestration-patterns.md` in LBP that documents the 4 orchestration patterns currently in use across the 13 pipeline skills. This is the single most-referenced doc for anyone writing a new skill.

**Model:** sonnet — long-form technical documentation.

**Files:** `/Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md` (new)

**Before writing**, read these 4 representative skills to ground the examples in real code:

1. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/review.code.md` — Pattern C (parallel delegation)
2. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/fix.findings.md` — Pattern D (hybrid batch-and-delegate)
3. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/deploy.changes.md` — Pattern A (sequential orchestrator-only)
4. `/Users/rickywilson/Sites/local-business-platform/.claude/commands/review.fix.deploy.md` — Pattern E (meta-orchestrator chaining)

Also read `/Users/rickywilson/.claude/plans/parallel-finding-puffin.md` (the plan this brief originates from) — it already contains a lot of the material, but do not copy-paste; rewrite in a doc voice.

**Write the file with this structure:**

```markdown
# Orchestration Patterns

How skills in this monorepo are structured, when to delegate work to subagents, and when the orchestrator should do the work itself.

## Who this is for

Anyone writing a new skill (`.claude/commands/*.md`) or refactoring an existing one. This doc captures the patterns already in use — it is descriptive, not prescriptive. When in doubt, pick the pattern that most closely matches your skill's shape.

## The four patterns

[Write sections for each pattern below. Each section should have:

- A name and one-line description
- An ASCII diagram of the flow
- Which existing skills use this pattern
- When to choose it (and when not to)
- The key implementation details (file structure, Task tool spawn shape, verification gates)
- A code snippet showing the minimal skeleton]

### Pattern A — Sequential orchestrator-only

Used by: `/deploy.changes`, `/update.docs`, `/brief.me`, `/pipeline.kill-site`, `/pipeline.kill-theme`

Main Claude does all the work itself. No subagents spawned. Steps run in strict sequence, each with a verification gate.

[Continue: diagram, when to use, skeleton, pitfalls]

### Pattern B — Meta-orchestrator chaining

Used by: `/review.fix.deploy`

Main Claude invokes other skills as sub-workflows. No direct subagent spawning — the chaining skills do that internally. This is a thin coordination layer.

[Continue]

### Pattern C — Parallel delegation

Used by: `/review.code`

Main Claude spawns N specialist subagents in a SINGLE Task tool message with `run_in_background: true`, then waits for all of them via `TaskOutput`. Each agent writes to a disjoint findings file. The orchestrator aggregates after all complete. Works only when the work is fully read-only so there is no file-write contention.

[Continue — include the exact Task tool spawn shape from review.code.md]

### Pattern D — Hybrid batch-and-delegate

Used by: `/fix.findings`

Main Claude handles the trivial/small/medium work directly in batched passes (batched by target file, bottom-to-file-upward ordering, per-batch verification gate). Large findings are delegated to specialist subagents, and those subagents can be spawned in parallel ONLY if their target files do not overlap. This is the only pattern that writes to files while also spawning subagents — the overlap check is the critical safety rule.

[Continue — include the file-overlap decision rule]

### Pattern E — Phase-delegated orchestration (new, introduced with `/pipeline.ingest` decomposition)

Used by: `/pipeline.ingest` (from 2026-04-10 onwards), planned for future pipeline skills

The orchestrator runs multi-phase work where:

- Phase A fans out independent read-heavy work to subagents in parallel (e.g. asset downloads, token extraction)
- Phase B delegates a single specialist validation to a subagent with a read-only auditor
- Phase C keeps stateful filesystem work in the orchestrator itself

Each phase has a verification gate between it and the next. The motivation is to give heavy work a fresh subagent context instead of carrying 1000+ lines through the whole skill. Use this pattern for long pipeline skills (>500 lines) where distinct phases exist.

[Continue — reference pipeline.ingest once brief B has landed it]

## Choosing between patterns

[Decision tree]

1. Does the skill spawn parallel work? → Pattern C or D or E
2. Is all the work read-only? → Pattern C
3. Does some work write files and some read? → Pattern D
4. Are there distinct phases (each with its own verification gate)? → Pattern E
5. Does the skill chain other skills? → Pattern B
6. None of the above? → Pattern A

## The `## Parallel execution groups` block

Every YOLO brief emitted by `/plan.to.yolo` must contain a `## Parallel execution groups` block. This is the single source of truth for what a YOLO session can batch in one Task message. See `.claude/commands/plan.to.yolo.md` section 3c-bis for the schema.

[Continue — brief explanation, one example table, link to the authoritative spec]

## Anti-patterns

[List of things NOT to do]

1. **Do not create a `cs-orchestrator` agent.** Main Claude is the orchestrator. A subagent wrapper has no access to persistent state and degrades the pattern.
2. **Do not fan out more than 6 subagents in one message.** Aggregation quality degrades.
3. **Do not use parallel delegation for any step that modifies files.** Use Pattern D instead.
4. **Do not chain more than 3 skills in a meta-orchestrator.** Debug visibility drops off fast.
5. **Do not skip the verification gate between phases.** The gate is the synchronisation barrier.

## Cross-repo note

The force repo (`/Users/rickywilson/Sites/force/`) uses a subset of these patterns: A (for its orchestrator-only skills) and C (for its copy of `/review.code`). Force has one additional constraint — `GOVERNANCE §8` forbids concurrent _jobs_, but within a single job the parallel subagent patterns above are still permitted. See `force/CLAUDE.md` for the authoritative rule.

## References

- `.claude/commands/review.code.md` — canonical Pattern C example
- `.claude/commands/fix.findings.md` — canonical Pattern D example
- `.claude/commands/pipeline.ingest.md` — canonical Pattern E example (after 2026-04-10)
- `.claude/commands/plan.to.yolo.md` — YOLO brief schema including parallel groups
- `docs/architecture/how-build-pipeline-works.md` — Turborepo build graph (separate concern but related)
```

Fill in the `[Continue — ...]` sections with real content — do not leave placeholders. Use the existing skill files as the source of truth for code snippets.

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
test -f /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
# Minimum-length check — guide should be substantial
test $(wc -l < /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md) -gt 150
# Must reference all 4 existing skills by name
grep -q "review.code" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
grep -q "fix.findings" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
grep -q "deploy.changes" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
grep -q "review.fix.deploy" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
# Must mention the Parallel execution groups block
grep -q "Parallel execution groups" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
pnpm lint   # no lint regression from markdown
```

**Commit** (in LBP, same feature branch as Phase 1):

```bash
cd /Users/rickywilson/Sites/local-business-platform
git add docs/guides/orchestration-patterns.md
git commit -m "$(cat <<'EOF'
docs(guides): add orchestration patterns guide

Documents the 4 orchestration patterns in use across pipeline skills
(sequential, meta-chaining, parallel delegation, hybrid batch-delegate,
phase-delegated). Includes decision tree, anti-patterns, and the
Parallel execution groups block schema introduced in /plan.to.yolo.

Part of the pipeline parallelization plan (item #10).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently during this YOLO session. Each group MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, etc. for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                    | File overlap | Model | Rationale                                                          |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----- | ------------------------------------------------------------------ |
| G1    | Phase 1 | Read `CLAUDE.md`, Read `.gitignore`                                                                                                                                                                      | none (reads) | n/a   | Independent reads before the CLAUDE.md edit                        |
| G2    | Phase 2 | Read `/Users/rickywilson/Sites/force/justfile`, Read `/Users/rickywilson/Sites/force/.claude/CLAUDE.md`                                                                                                  | none (reads) | n/a   | Independent reads before the justfile and CLAUDE.md updates        |
| G3    | Phase 3 | Read all 5 workflow files (`w1-*.md` through `w5-*.md`), Read `force/GOVERNANCE.md`, Read `force/CLAUDE.md`, Read `force/.claude/commands/review.code.md`, Read `~/.claude/agents/cs-prompt-engineer.md` | none (reads) | n/a   | 9 independent reads to ground the new skill in real force patterns |
| G4    | Phase 4 | Read `review.code.md`, Read `fix.findings.md`, Read `deploy.changes.md`, Read `review.fix.deploy.md`                                                                                                     | none (reads) | n/a   | 4 canonical skill examples for the guide — batch in one message    |

### Cross-phase groups

**None.** Each phase modifies distinct files but belongs to different commits in different repos, so they must run sequentially to keep the commit history clean. Do not attempt to parallelise across phases.

### Sequential points — MUST NOT parallelise

| Item                            | Reason                                                           |
| ------------------------------- | ---------------------------------------------------------------- |
| Phase 1 commit → Phase 2 commit | Different repos (LBP vs force), different branches               |
| Phase 2 commit → Phase 3 commit | Same force repo but same feature branch, commits must be ordered |
| Phase 3 commit → Phase 4 commit | Different repos again (force → LBP)                              |
| Verification gates              | Each must pass before the next phase begins                      |

---

## Cost Estimate

| Phase                                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1 (CLAUDE.md + gitignore)        | sonnet | ~8k               | ~2k                | $0.06      |
| Phase 2 (justfile + CLAUDE.md)         | sonnet | ~6k               | ~2k                | $0.05      |
| Phase 3 (review.workflows skill)       | sonnet | ~25k              | ~6k                | $0.17      |
| Phase 4 (orchestration-patterns guide) | sonnet | ~20k              | ~8k                | $0.18      |
| **Total**                              |        | **~59k**          | **~18k**           | **~$0.46** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA (note: Phases 1 and 4 commit to `local-business-platform`, Phases 2 and 3 commit to `force`)
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes in LBP
3. Force state — report whether force's new feature branch is ready to push (it is not pushed automatically)
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           | [total]            | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

## Update Session File

After completing all phases, append to this brief file (`output/sessions/2026-04-10_pipeline-upgrades/A-quick-wins.md`):

```markdown
## Completed

**Date:** [today]
**Status:** All 4 phases executed successfully

[1-paragraph summary: what was implemented, any surprises, any manual steps left for the user]

### Commits

- LBP `feature/pipeline-upgrades-a` / Phase 1: [SHA] — worktree decision rule
- force `feature/sync-skills-target` / Phase 2: [SHA] — just sync-skills
- force `feature/sync-skills-target` / Phase 3: [SHA] — /review.workflows skill
- LBP `feature/pipeline-upgrades-a` / Phase 4: [SHA] — orchestration patterns guide

### Branches left uncommitted-upstream

- LBP: `feature/pipeline-upgrades-a` — ready for review and merge to develop
- force: `feature/sync-skills-target` — ready for review and merge to develop (separate repo)
```

Confirm this was done in the final report.

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- **Consult the `## Parallel execution groups` section before launching any work.** Items listed in a group MUST be launched in a single Task-tool message.
- Never push — leave all changes on the feature branches (in BOTH repos)
- This brief touches TWO repos (LBP and force). Be vigilant about `cd` between them. After every commit, confirm the working directory with `pwd`.
- Minimal changes only — implement what the plan says, nothing more
- Do NOT modify `force/GOVERNANCE.md` under any circumstances
- Do NOT sync the 8 shared skills from LBP to force during this session (that's what the `just sync-skills` target is for — running it is the USER's call, not this brief's)
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)

---

## Terminal command to launch this brief

```
claude --dangerously-skip-permissions --model sonnet -p "Read output/sessions/2026-04-10_pipeline-upgrades/A-quick-wins.md in full, then implement every phase it describes exactly as written."
```
