# Orchestration Patterns

> **Cross-repo doc.** This guide is authored in local-business-platform and is the canonical reference for orchestration patterns across LBP and force. Force maintains a copy in `~/Sites/force/docs/guides/orchestration-patterns.md` that is synced via `just sync-skills` — see force's justfile.

How skills in this monorepo are structured, when to delegate work to subagents, and when the orchestrator should do the work itself.

## Who this is for

Anyone writing a new skill (`.claude/commands/*.md`) or refactoring an existing one. This doc captures the patterns already in use — it is descriptive, not prescriptive. When in doubt, pick the pattern that most closely matches your skill's shape.

## The four patterns

### Pattern A — Sequential orchestrator-only

Used by: `/deploy.changes`, `/update.docs`, `/brief.me`, `/pipeline.kill-site`, `/pipeline.kill-theme`

Main Claude does all the work itself. No subagents spawned. Steps run in strict sequence, each with a verification gate before the next step begins.

**Flow:**

```
Orchestrator
    │
    ├─ Step 1 ──→ Verify gate 1 ──→ STOP if fails
    │
    ├─ Step 2 ──→ Verify gate 2 ──→ STOP if fails
    │
    └─ Step N ──→ Report
```

**When to use Pattern A:**

- The work is sequential by nature (git operations, CI handoffs, file-ordering constraints)
- Each step depends on the result of the previous step
- Parallelism offers no benefit (e.g. you can't merge to staging before develop CI passes)
- The total context load fits comfortably within one session

**When NOT to use Pattern A:**

- You have 3+ independent read-heavy tasks — use Pattern C instead
- The work involves file modifications to multiple independent files — use Pattern D

**Key implementation details:**

1. Each step is a numbered `### Step N:` heading with a bash verification gate
2. Gates use explicit `STOP` instructions on failure — never silently skip
3. The orchestrator never spawns the Task tool

**Minimal skeleton (from `/deploy.changes`):**

```markdown
## Steps

### Step 1: Verify Branch

git branch --show-current

# Must be on develop. If not, STOP.

### Step 2: Pre-commit Verification

# Group 3a (parallel read-only): type-check + lint + vercel audit

# Group 3b (sequential write): build + test — ONLY if 3a passed

### Step 3: Commit if Needed

# Check git status, commit if dirty

### Step 4: Push and merge develop → staging → main

# Each push followed by: gh run watch

# STOP if CI fails at any stage
```

**Pitfalls:**

- Don't serialize steps that can be parallelised (type-check + lint are independent — run them together as a sub-group within a sequential skill)
- Don't skip verification gates to save time — the gate IS the safety

---

### Pattern B — Meta-orchestrator chaining

Used by: `/review.fix.deploy`

Main Claude invokes other skills as sub-workflows. No direct subagent spawning — the chaining skills do that internally. This is a thin coordination layer with argument routing.

**Flow:**

```
Meta-orchestrator
    │
    ├─ Phase 1: run /review.code ──────────────────→ aggregated-report.md
    │
    ├─ Phase 2: run /fix.findings [scope] --auto ──→ fixes-applied.md
    │
    └─ Phase 3: run /deploy.changes ───────────────→ commit on main
```

**When to use Pattern B:**

- You are composing an existing set of skills into a pipeline
- Each phase is already a complete skill with its own verification logic
- You want autonomous end-to-end execution without duplicating skill logic

**When NOT to use Pattern B:**

- The phases are tightly coupled and need to share state directly — write them as one skill
- You need more than 3 chained skills — debug visibility drops off fast (see Anti-patterns)

**Key implementation details:**

1. Each phase invokes a skill by name — Claude Code handles the expansion
2. Arguments are routed via a mapping table:

   ```markdown
   | Input      | Passed to /fix.findings |
   | ---------- | ----------------------- |
   | (none)     | `high --auto`           |
   | `critical` | `critical --auto`       |
   ```

3. The meta-orchestrator adds the `--auto` flag to suppress confirmation gates in sub-skills
4. Pre-flight checks (branch, clean working tree) run BEFORE any phase is invoked

**Minimal skeleton (from `/review.fix.deploy`):**

```markdown
## Pre-flight

git branch --show-current # must be develop
git status --porcelain # must be clean

## Phase 1: Review

Run /review.code. Wait. Read aggregated report.
If no findings, skip Phase 2.

## Phase 2: Fix

Run /fix.findings [scope from $ARGUMENTS] --auto.
Check git status after — if no changes, inform user and STOP.

## Phase 3: Deploy

Run /deploy.changes.

## Phase 4: Report
```

**Pitfalls:**

- Never chain more than 3 skills — the fourth chain breaks error traceability
- Always verify the previous phase produced output before starting the next

---

### Pattern C — Parallel delegation

Used by: `/review.code`

Main Claude spawns N specialist subagents in a **single Task tool message** with `run_in_background: true`, then waits for all of them via TaskOutput. Each agent writes to a disjoint findings file. The orchestrator aggregates after all complete. Works only when the work is fully read-only so there is no file-write contention.

**Flow:**

```
Orchestrator
    │
    └─ Single message: spawn agents 1..N (run_in_background: true)
         │        │        │        │
       Agent 1  Agent 2  Agent 3  Agent 4    ← all run concurrently
         │        │        │        │
     findings- findings- findings- findings-
     security  quality  a11y      arch
         │        │        │        │
         └────────┴────────┴────────┘
                        │
                Orchestrator reads all 4,
                writes aggregated-report.md,
                reports to user
```

**When to use Pattern C:**

- The work is entirely **read-only** — no file writes during agent execution
- You have 2–6 independent work units that can run at the same time
- Each agent writes to a **disjoint output file** (no shared write targets)
- Agent context is large enough to justify fresh subagent contexts (e.g. domain-specific expertise)

**When NOT to use Pattern C:**

- Any agent in the fan-out writes to source files — use Pattern D instead
- You need more than 6 agents — aggregation quality degrades (see Anti-patterns)

**Key implementation details:**

1. Conditional agents (e.g. Vercel auditor) are computed before the fan-out and included **in the same single message** — never launched sequentially after the core agents
2. Each agent receives the session directory path so it knows where to write
3. Previously fixed findings (from prior `/fix.findings` runs) are injected into each agent prompt to prevent re-reporting

**Exact Task tool spawn shape (from `/review.code`):**

```
Task tool parameters:
  description: "Security review audit"
  subagent_type: "cs-security-engineer"
  run_in_background: true

Prompt: [Full agent-specific prompt including: what to read, what
         criteria to apply, where to write findings, exact findings format]
```

All 4–6 agents are spawned in **one message block** — do not launch them sequentially.

**Minimal skeleton:**

```markdown
## Step 1: Setup

Create session directory. Write session.md with agent status table.
Determine conditional agents (check which files are in scope).

## Step 2: Spawn Parallel Agents

SINGLE MESSAGE with run_in_background: true for all applicable agents.
Agent 1: [specialist A] → findings-A.md
Agent 2: [specialist B] → findings-B.md
Agent N: [specialist N] → findings-N.md

## Step 3: Aggregate

Wait for all agents. Read all findings files.
Write aggregated-report.md.

## Step 4: Report
```

**Pitfalls:**

- Never launch agents sequentially when they can be parallel — the pattern's value is the wall-clock reduction
- Never use this pattern for steps that write to source files

---

### Pattern D — Hybrid batch-and-delegate

Used by: `/fix.findings`

Main Claude handles the trivial/small/medium work directly in batched passes (batched by target file, bottom-of-file-upward ordering, per-batch verification gate). Large findings are delegated to specialist subagents, and those subagents can be spawned in parallel **only if their target files do not overlap**. This is the only pattern that writes to source files while also spawning subagents — the file-overlap check is the critical safety rule.

**Flow:**

```
Orchestrator
    │
    ├─ Phase 1: Direct fixes (trivial/small/medium)
    │    ├─ Batch: findings targeting file A → fix bottom-up → verify
    │    ├─ Batch: findings targeting file B → fix bottom-up → verify
    │    └─ ...
    │
    ├─ Phase 2: Large fixes (plan + delegate)
    │    ├─ Write plan-FINDING-ID.md for each large finding
    │    └─ Spawn fix-executor subagents:
    │         ├─ If no file overlap → single message, run_in_background: true
    │         └─ If file overlap → sequential, one at a time
    │
    └─ Phase 3: Final verification (type-check, lint, build, test)
```

**When to use Pattern D:**

- The skill both reads AND writes to source files
- Work naturally divides into: small changes (do directly) vs. large changes (plan then delegate)
- Large changes may be parallelizable if they target disjoint files

**File-overlap decision rule:**

```
For each pair of large findings (F_i, F_j):
  If F_i.target_files ∩ F_j.target_files = ∅ → can spawn in parallel
  If any overlap → must sequence (run F_i fully before spawning F_j)
```

**Key implementation details:**

1. **Batching rules:** group findings by target file; within a batch, fix from highest line number downward to avoid line-number shifts after edits
2. **Per-batch verification:** type-check + lint + build after every batch — revert the entire batch on any failure, log as "Failed"
3. **Large fix delegation:** write a `plan-[FINDING-ID].md` first (for audit trail), then spawn the executor with the plan embedded in the prompt
4. **Specialist selection by finding prefix:**

   | Finding prefix | Subagent type          |
   | -------------- | ---------------------- |
   | `SEC-*`        | `cs-security-engineer` |
   | `CQ-*`         | `cs-code-reviewer`     |
   | `A11Y-*`       | `cs-frontend-engineer` |
   | `ARCH-*`       | `cs-architect`         |

5. **Never auto-commit** — all changes left uncommitted for user review
6. Stale-finding detection: read the target file before fixing; if lines don't match the finding, mark as "stale" and skip

**Minimal skeleton (from `/fix.findings`):**

```markdown
## Phase 1: Direct Fixes

Group by target file. For each file group:

1. Read the target file
2. Apply fixes bottom-up
3. Run: pnpm type-check, then pnpm lint, then pnpm build (each separately)
4. If all pass → log as Fixed
5. If any fail → git checkout -- [files], log as Failed

## Phase 2: Large Fixes

For each large finding:

1. Write plan-[ID].md (prerequisites, tasks, final verification, risks)
2. Spawn fix-executor agent with plan embedded in prompt
3. Spawn in parallel only if no file overlap with other large findings
4. Read results file after each agent completes

## Phase 3: Final Verification

pnpm type-check && pnpm lint && pnpm build && pnpm test
E2E smoke: npm run --prefix sites/[modified-site] test:e2e:smoke

## Step 5: Log Results

Write fixes-applied.md with Applied / Stale / Failed / Skipped tables
```

**Pitfalls:**

- Never batch more than 5 trivial/small findings per batch — verification is cheap, merge conflicts are not
- Never parallelize large subagents that share a target file — they will overwrite each other's changes
- Always revert on failure — never cascade failures through to the next batch

---

### Pattern E — Phase-delegated orchestration (new, introduced with `/pipeline.ingest` decomposition)

Used by: `/pipeline.ingest` (from 2026-04-10 onwards), planned for future pipeline skills

The orchestrator runs multi-phase work where:

- **Phase A** fans out independent read-heavy work to subagents in parallel (e.g. asset downloads, token extraction from screenshots)
- **Phase B** delegates a single specialist validation to a subagent with a read-only auditor
- **Phase C** keeps stateful filesystem work in the orchestrator itself

Each phase has a verification gate between it and the next. The motivation is to give heavy work a fresh subagent context instead of carrying 1000+ lines through the whole skill.

**Flow:**

```
Orchestrator
    │
    ├─ Phase A: parallel fan-out (read-heavy, independent)
    │    ├─ Subagent: download + hash reference assets
    │    └─ Subagent: extract tokens from screenshots
    │         │
    │    [verification gate: all assets present, tokens extracted]
    │
    ├─ Phase B: delegated validation (specialist, read-only)
    │    └─ Subagent: cs-theme-package-validator
    │         │
    │    [verification gate: validation passed]
    │
    └─ Phase C: stateful scaffolding (orchestrator owns)
         └─ Orchestrator: test-site scaffold, git ops, CI trigger
```

**When to use Pattern E:**

- The skill is long (>500 lines) with distinct phases, each naturally scoping to a fresh context
- Phase A involves large parallel downloads or multi-image analysis where fresh subagent context is cheaper than carrying prior output
- Phase B requires a specialist auditor whose findings gate Phase C
- Phase C is stateful filesystem work (scaffolding, git operations) that cannot be parallelized

**When NOT to use Pattern E:**

- The phases are tightly coupled with shared in-memory state — keep as Pattern A
- The skill is short enough to fit in one session context without degradation

**Key implementation details:**

1. Phase boundaries are explicit — each phase ends with a verification gate that must pass before Phase B begins
2. Phase A subagents write to the session directory (disjoint files); Phase C orchestrator reads those files
3. Stitch MCP calls are an exception: keep them in the orchestrator even for long pipeline skills — MCP context is session-bound and lost when a subagent is spawned

**Pitfalls:**

- Do not delegate stateful Stitch MCP calls to subagents — they lose MCP session context
- Each phase transition is a synchronization point — make it explicit in the skill with a check before continuing

---

## Choosing between patterns

Decision tree — work through these in order:

1. Does the skill chain other skills? → **Pattern B**
2. Does the skill spawn parallel work?
   - All read-only? → **Pattern C**
   - Some writes, with phases separating read vs. write? → **Pattern E**
   - Mixed (small writes directly + large delegated with file-overlap check)? → **Pattern D**
3. None of the above → **Pattern A**

Quick reference:

| Pattern | Name                      | Spawns subagents? | Writes files?  | Best for                               |
| ------- | ------------------------- | ----------------- | -------------- | -------------------------------------- |
| A       | Sequential orchestrator   | No                | Yes            | Git operations, sequential pipelines   |
| B       | Meta-orchestrator         | No (indirectly)   | No             | Chaining existing skills               |
| C       | Parallel delegation       | Yes (fan-out)     | No (read-only) | Code reviews, parallel audits          |
| D       | Hybrid batch-and-delegate | Sometimes         | Yes            | Fix pipelines with mixed effort levels |
| E       | Phase-delegated           | Yes (per phase)   | Yes (phased)   | Long pipeline skills (>500 lines)      |

---

## The `## Parallel execution groups` block

Every YOLO brief emitted by `/plan.to.yolo` must contain a `## Parallel execution groups` block. This is the single source of truth for what a YOLO session can batch in one Task tool message.

**Why it matters:** A YOLO session that treats all phases as sequential leaves performance on the table. A YOLO session that incorrectly parallelizes overlapping file writes creates merge conflicts. The parallel groups block makes the safe parallelism explicit.

**Schema** (from `.claude/commands/plan.to.yolo.md` section 3c-bis):

```markdown
## Parallel execution groups

| Group | Phase   | Items                  | File overlap | Model  | Rationale         |
| ----- | ------- | ---------------------- | ------------ | ------ | ----------------- |
| G1    | Phase 1 | Read A, Read B, Read C | none (reads) | n/a    | Independent reads |
| G2    | Phase 2 | Edit X, Edit Y         | none         | sonnet | Disjoint files    |

### Sequential points — MUST NOT parallelise

| Item           | Reason                                        |
| -------------- | --------------------------------------------- |
| G1 → G2        | G2 depends on G1 output                       |
| Phase 2 commit | Must happen before Phase 3 reads branch state |
```

**Example from a real YOLO brief (2026-04-10):**

| Group | Phase   | Items                                                                          | File overlap | Model | Rationale                                   |
| ----- | ------- | ------------------------------------------------------------------------------ | ------------ | ----- | ------------------------------------------- |
| G1    | Phase 1 | Read CLAUDE.md, Read .gitignore                                                | none (reads) | n/a   | Independent reads before the CLAUDE.md edit |
| G2    | Phase 2 | Read force/justfile, Read force/.claude/CLAUDE.md                              | none (reads) | n/a   | Independent reads before justfile edit      |
| G3    | Phase 3 | Read w1-w5, GOVERNANCE, force CLAUDE.md, review.code.md, cs-prompt-engineer.md | none (reads) | n/a   | 9 independent reads to ground the new skill |
| G4    | Phase 4 | Read review.code.md, fix.findings.md, deploy.changes.md, review.fix.deploy.md  | none (reads) | n/a   | 4 canonical skill examples for the guide    |

See `.claude/commands/plan.to.yolo.md` for the full schema specification.

---

## Anti-patterns

1. **Do not create a `cs-orchestrator` agent.** Main Claude is the orchestrator. A subagent wrapper has no access to persistent state and degrades the pattern.

2. **Do not fan out more than 6 subagents in one message.** Aggregation quality degrades above 6 — the orchestrator's ability to synthesize N findings files drops off, and the probability of at least one agent timeout increases super-linearly.

3. **Do not use parallel delegation for any step that modifies files.** Use Pattern D (with the file-overlap check) instead. Parallel writes to the same file cause silent data loss — later writes overwrite earlier ones.

4. **Do not chain more than 3 skills in a meta-orchestrator.** Debug visibility drops off fast. When Phase 2 of a 4-phase chain fails, you must trace back through 3 intermediate states to find the root cause.

5. **Do not skip the verification gate between phases.** The gate is the synchronisation barrier. Without it, Phase N+1 starts on corrupted output from Phase N and produces misleading results.

6. **Do not delegate Stitch MCP calls to subagents.** MCP context is session-bound. A subagent that inherits a Stitch session description cannot make new Stitch API calls — the MCP connection belongs to the orchestrator's session only.

7. **Do not run build or test in parallel with type-check or lint.** Build and test write to the filesystem (`.next/`, `dist/`, test-results). Running them concurrently with type-check causes filesystem races. The correct grouping: (type-check + lint) in parallel, then (build + test) sequentially — as documented in `/deploy.changes` Groups 3a and 3b.

---

## Cross-repo note

The force repo (`/Users/rickywilson/Sites/force/`) uses a subset of these patterns:

- **Pattern A** for its orchestrator-only skills (`/update.docs`, `/deploy.changes` equivalents)
- **Pattern C** for its copy of `/review.code`

Force has one additional constraint — `GOVERNANCE §8` forbids concurrent **jobs** (one job runs at a time in the queue). However, within a single dispatched job, the parallel subagent patterns above are still permitted. The ban is on concurrent jobs, not on concurrent subagents within a job. See `force/CLAUDE.md` for the authoritative rule.

---

## References

- `.claude/commands/review.code.md` — canonical Pattern C example
- `.claude/commands/fix.findings.md` — canonical Pattern D example
- `.claude/commands/pipeline.ingest.md` — canonical Pattern E example (after 2026-04-10)
- `.claude/commands/deploy.changes.md` — canonical Pattern A example
- `.claude/commands/review.fix.deploy.md` — canonical Pattern B example
- `.claude/commands/plan.to.yolo.md` — YOLO brief schema including the `## Parallel execution groups` block
- `docs/architecture/how-build-pipeline-works.md` — Turborepo build graph (separate concern but related)
