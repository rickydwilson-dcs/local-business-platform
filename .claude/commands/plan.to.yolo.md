# Plan to YOLO

Converts the approved `synthesis.md` from the most recent codex peer review into a YOLO implementation brief, then outputs a terminal command to launch an autonomous Opus session.

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

Produce `output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md` by expanding the synthesis into an executable implementation brief. The brief must:

**3a. Open with standard headers:**
```markdown
# YOLO Implementation Brief: [Title from synthesis]

**Branch:** develop
**Session spec:** output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

[2–3 sentence summary: what the problem is, what the plan does, why it was approved]

The synthesis was reviewed and approved. Implement it exactly as specified below.
```

**3b. Pre-flight block:**
```markdown
## Pre-flight

```bash
git checkout develop && git pull
pnpm type-check   # must be clean before starting
```
```

**3c. Expand each phase from the synthesis into a numbered section:**

For each phase:
- Retain the goal, files, and verification gate exactly from the synthesis
- Add explicit parallelism instructions wherever work is independent:
  - Reading multiple files → use parallel reads
  - Editing independent files in the same phase → use parallel Task agents
  - Running independent checks (lint, type-check, build) → note which can run together
- Include the commit command at the end of each phase, exactly as specified in the synthesis
- Format verification gates as a named bash block that must pass before continuing:
  ```bash
  # Verification gate — STOP if this fails
  [commands]
  ```

**3d. Final report section:**
```markdown
## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Final hardcoded-class grep count (compare to baseline from Phase 0 if applicable)
3. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
4. Any exceptions or intentional deviations from the plan
```

**3e. Session file update section:**
```markdown
## Update Session File

After completing all phases, append to `output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, final class count reduction if applicable]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.
```

**3f. Execution rules footer:**
```markdown
## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `develop`
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
```

## Step 4: Output the Terminal Command

Print this block verbatim for the user to copy-paste:

---

**Paste into terminal:**

```
claude --dangerously-skip-permissions --model claude-opus-4-6 -p "Read output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md in full, then implement every phase it describes exactly as written."
```

---

Tell the user:
- Brief saved to: `output/sessions/YYYY-MM-DD_topic-slug/yolo-brief.md`
- The command above launches an Opus session in YOLO mode — it will implement all phases autonomously
- Review the brief before running if you want to make any manual adjustments first
