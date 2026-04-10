# Plan to YOLO

Converts the approved `synthesis.md` from the most recent codex peer review into a YOLO implementation brief, then outputs a terminal command to launch an autonomous session.

---

## Step 1: Find the Active Review Folder

```bash
ls -dt output/sessions/codex-peer-review/20*/ | head -1
```

Use the most recently modified subfolder.

Read `[active-folder]/synthesis.md`. If it does not exist, STOP: "No synthesis.md found in `[active-folder]`. Run `/plan.with.codex synthesise` first."

## Step 2: Derive the Session Folder Path

Parse the review folder name: `YYYY-MM-DD_topic-slug`

Target session folder: `output/sessions/YYYY-MM-DD_topic-slug/`

Create it if it doesn't exist:

```bash
mkdir -p output/sessions/YYYY-MM-DD_topic-slug
```

## Step 3: Write the YOLO Brief

Produce `output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md` by expanding the synthesis into an executable implementation brief.

**Model tiers — include this table verbatim in every generated brief:**

```markdown
## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).
```

Use this table when assigning models to each phase below.

The brief must:

**3a. Open with standard headers:**

Derive the feature branch name from the topic slug: `feature/topic-slug`

```markdown
# YOLO Implementation Brief: [Title from synthesis]

**Branch:** feature/topic-slug (created from develop)
**Session spec:** output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

[2–3 sentence summary: what the problem is, what the plan does, why it was approved]

The synthesis was reviewed and approved. Implement it exactly as specified below.
```

**3b. Pre-flight block:**

````markdown
## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/topic-slug   # create feature branch from develop
pnpm type-check   # must be clean before starting
```
````

```

**3c. Expand each phase from the synthesis into a numbered section:**

For each phase:
- Retain the goal, files, and verification gate exactly from the synthesis
- Annotate each phase with a `**Model:**` line immediately after `**Goal:**`, using the tier table. For Task agents within a phase, include `model: [tier]` in the agent spawn block. Example:
```

**Goal:** Add ComponentRegistry exports to lyra and atlas
**Model:** haiku — mechanical import + export additions to two files

Spawn two agents in parallel:
Task: Fix lyra/index.ts registry export
model: haiku
Prompt: [...]

````
- Add explicit parallelism instructions wherever work is independent:
- Reading multiple files → use parallel reads
- Editing independent files in the same phase → use parallel Task agents
- Running independent checks (lint, type-check, build) → note which can run together
- If any phase produces new TypeScript files or modifies existing ones, the final phase MUST include a verification gate that runs `pnpm type-check` across the monorepo. If the work touches pipeline tools or theme packages, also run `pnpm pipeline:smoke`.
- Include the commit command at the end of each phase, exactly as specified in the synthesis
- Format verification gates as a named bash block that must pass before continuing:
```bash
# Verification gate — STOP if this fails
[commands]
````

**3c-bis. Parallel execution groups — REQUIRED block, emitted immediately after the phase list and before the Cost Estimate:**

Every generated brief MUST include a `## Parallel execution groups` section. This is the single source of truth for what can run concurrently during the YOLO session. The block distills the parallelism instructions from the individual phases into an explicit, executor-friendly plan so the worker does not have to re-derive it from prose.

Structure:

```markdown
## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

Work items that can run in parallel within a single phase. Launch every item in a group in one message.

| Group | Phase   | Items                                                                                                    | File overlap            | Model | Rationale                                          |
| ----- | ------- | -------------------------------------------------------------------------------------------------------- | ----------------------- | ----- | -------------------------------------------------- |
| G1    | Phase 1 | Read `packages/themes/lyra/index.ts`, `packages/themes/atlas/index.ts`, `packages/themes/orion/index.ts` | none (reads only)       | n/a   | Independent reads — batch in one message           |
| G2    | Phase 2 | Edit `lyra/registry.ts`, Edit `atlas/registry.ts`                                                        | none                    | haiku | Mechanical registry additions to independent files |
| G3    | Phase 4 | Run `pnpm lint`, Run `pnpm type-check`                                                                   | none (read-only checks) | n/a   | Independent verification commands                  |

### Cross-phase groups (only if phases are truly independent)

Only populate this table if the synthesis explicitly states two or more phases have NO shared files and NO ordering dependency. Default: leave empty. Cross-phase parallelism is the exception, not the rule.

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                                | Reason                                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm build`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                                         | One commit per phase, in order. Commits are never batched.                 |
| Any file edited by two or more items                                | Same-file edits must always serialise.                                     |
```

**Rules for populating the groups table:**

1. **File overlap is the hard constraint.** Two items that touch the same file cannot be in the same group, full stop. When in doubt, serialise.
2. **Reads are always safe to parallelise.** If a phase reads 3+ files before editing, emit a group listing all the reads.
3. **Verification commands are parallelisable only if they are read-only and independent.** `pnpm lint` and `pnpm type-check` can run in parallel. `pnpm build` must run alone (it writes to `.next/` and `dist/`).
4. **Task subagents with `model:` annotations count as parallel items.** If Phase 2 spawns two `haiku` subagents on different files, they are a group.
5. **If the synthesis does not describe any parallelism for a given phase, emit a row stating `— no parallel work in this phase —` rather than omitting the phase.** Explicit "nothing to parallelise" is more useful than silence.
6. **Every group must name its model tier.** Mixed-tier groups are allowed (e.g. one `haiku` + one `sonnet` subagent in the same message) but each item's tier must be stated.
7. **Cross-phase parallelism defaults to empty.** Only fill the cross-phase table if the synthesis text explicitly declares phase independence. The executor will read this section and trust it literally — an incorrect entry causes corruption.

**3d. Cost Estimate section (after all phases and the Parallel execution groups block, before Final Report):**

After expanding all phases, include a cost estimate table. Populate it by scanning the synthesis for file counts and approximate sizes.

```markdown
## Cost Estimate

| Phase                 | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: [short name] | sonnet | ~12k              | ~2k                | $0.07      |
| Phase 2: [short name] | haiku  | ~8k               | ~1k                | $0.01      |
| ...                   |        |                   |                    |            |
| **Total**             |        | **~Xk**           | **~Yk**            | **~$Z.ZZ** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).
```

To populate: a file with ~100 lines ≈ 500 input tokens. A phase editing 3 medium files might output ~1k tokens. Be conservative (round up).

**3e. Final report section:**

```markdown
## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.
```

**3f. Session file update section:**

````markdown
## Update Session File

After completing all phases, append to `output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```
````

Confirm this was done in the final report.

````

**3g. Execution rules footer:**
```markdown
## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- For any brief that creates or modifies theme packages or pipeline tools: the final phase MUST include `pnpm pipeline:smoke` as a verification gate before the final commit
- **If the brief writes to files outside the primary repo**, the terminal command MUST include `--additionalDirectories` for each external path. `--dangerously-skip-permissions` only covers the directory the session is launched from — writes to other repos or user-global paths (e.g. `~/.claude/agents/`) will trigger interactive permission prompts, breaking unattended execution. Common cases:
  - Brief touches another repo (e.g. `/Users/rickywilson/Sites/force/`): add `--additionalDirectories /Users/rickywilson/Sites/force`
  - Brief writes to user-global agent/skill directories (`~/.claude/agents/`, `~/.claude/commands/`, `~/.claude/docs/`): add `--additionalDirectories ~/.claude`
  - Brief touches multiple external paths: add one `--additionalDirectories` per path
````

## Step 4: Output the Terminal Command, Cost Summary, and Next Steps

Print this block for the user to copy-paste:

---

**Paste into terminal:**

```
claude --dangerously-skip-permissions --model sonnet [ADDITIONAL_DIRS] -p "Read output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md in full, then implement every phase it describes exactly as written."
```

Replace `[ADDITIONAL_DIRS]` based on the brief's file targets:

- If the brief ONLY writes within the primary repo: remove `[ADDITIONAL_DIRS]` entirely.
- If the brief writes to another repo: replace with `--additionalDirectories /path/to/other/repo`
- If the brief writes to `~/.claude/agents/` or other user-global paths: replace with `--additionalDirectories ~/.claude`
- If both: use multiple flags, e.g. `--additionalDirectories /path/to/repo --additionalDirectories ~/.claude`

Without these flags, writes outside the launch directory trigger interactive permission prompts that break unattended YOLO execution.

---

Then print a **Cost & Model Summary** so the user can review before running:

```
Brief saved to: output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md

## Cost & Model Summary

Estimated total cost: ~$X.XX

| Phase | Model | Goal |
|-------|-------|------|
| Phase 1 | sonnet | [one-line goal] |
| Phase 2 | haiku | [one-line goal] |
| Phase 3 | sonnet | [one-line goal] |
| ... | | |

To override the orchestrator model: change `--model sonnet` to `--model opus`
To set a hard budget ceiling: add `--max-budget-usd N` to the command

Review the brief before running if you want to make any manual adjustments.

## After the YOLO session completes

All work will be on the `feature/topic-slug` branch — nothing has been pushed.
Back in VS Code / your IDE, you need to:

  1. git checkout feature/topic-slug   (if not already on it)
  2. Review the changes: git log --oneline develop..HEAD
  3. Merge into develop: git checkout develop && git merge feature/topic-slug
  4. Then run /deploy.changes to push develop → staging → main
```
