# Wrap Up Session

Writes `session-wrap-up.md` to the active session folder, summarizing what was done.

---

## Step 1: Find the Active Session Folder

If `$ARGUMENTS` was passed (e.g. `/wrap-up-session 2026-04/2026-04-11_canonical-pages-completeness`), use that as the folder name directly: `output/sessions/$ARGUMENTS/`.

If that path does not exist, try searching monthly buckets:

```bash
ls -d output/sessions/*/$ARGUMENTS/ 2>/dev/null | head -1
```

Otherwise check for a current-session pointer:

```bash
cat output/sessions/.current-session 2>/dev/null
```

If that file exists and is non-empty, use `output/sessions/[contents]/`.

Otherwise, find the most recently modified session folder:

```bash
ls -dt output/sessions/*/[0-9]*/ | head -1
```

Confirm the folder exists before proceeding.

---

## Step 2: Read Session Context

Read whichever of these exist in the session folder (parallel reads):

- `yolo-brief.md` — look especially at the `## Completed` section
- `session.md`

Also run in parallel:

```bash
git log --oneline develop..HEAD 2>/dev/null | head -20
git diff --name-only develop...HEAD 2>/dev/null | head -30
```

If `develop..HEAD` produces nothing (on develop itself), fall back to `git log --oneline -10`.

---

## Step 3: Write `session-wrap-up.md`

Write `output/sessions/[folder]/session-wrap-up.md` using this structure:

```markdown
# Session Wrap-Up: [topic from folder name, human-readable]

**Date:** YYYY-MM-DD
**Session folder:** output/sessions/YYYY-MM-DD_topic/
**Branch:** feature/topic (or develop if no feature branch)
**Status:** Completed | Partial | Abandoned

## Goal

One sentence. What was this session trying to achieve?

## What Was Done

2–5 bullets. Specific and concrete — not "made changes" but what actually changed.

## Key Decisions

Bullets. Non-obvious decisions: why an approach was chosen, what was ruled out, what surprised us.
**Omit this section if there were no non-obvious decisions.**

## Commits

- `abc1234` — commit message

**Omit if there were no commits.**

## Files Changed

Top 5–10 most significant files. Not a full diff listing.

## What Was Learned / Why It Matters

1 short paragraph. Platform-level insights, patterns established, technical debt created or resolved.

## Follow-On Tasks

- Optional tasks that became visible during this session.
  **Omit if there are none.**
```

**Rules:**

- Do not duplicate what's already in `## Completed` in `yolo-brief.md` — reference it, don't repeat it
- Only list commit SHAs that appear in `git log`
- Be concise — each section should take under 30 seconds to read

---

## Step 4: Confirm

Output: "Session wrap-up written to output/sessions/[folder]/session-wrap-up.md"
