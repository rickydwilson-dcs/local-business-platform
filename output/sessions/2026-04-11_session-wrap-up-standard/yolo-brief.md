# YOLO Implementation Brief: Session Wrap-Up Standard

**Branch:** feature/session-wrap-up-standard (created from develop)
**Session spec:** output/sessions/2026-04-11_session-wrap-up-standard/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Sessions accumulate `yolo-brief.md` and `session.md` files but have no consistent end-of-session summary. The `## Completed` block in YOLO briefs records that work was done, but it's embedded in the brief rather than a standalone scannable document. This brief implements a `session-wrap-up.md` standard: a new `/wrap-up-session` command, a required final phase in every generated YOLO brief, a bash SessionEnd hook as a fallback, and a CLAUDE.md documentation update.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/session-wrap-up-standard
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Create `/wrap-up-session` Command

**Goal:** Create the slash command that Claude uses to write `session-wrap-up.md`.
**Model:** sonnet — authoring a new command file with non-trivial logic

Write `.claude/commands/wrap-up-session.md` with this exact content:

````markdown
# Wrap Up Session

Writes `session-wrap-up.md` to the active session folder, summarizing what was done.

---

## Step 1: Find the Active Session Folder

If `$ARGUMENTS` was passed (e.g. `/wrap-up-session 2026-04-11_canonical-pages-completeness`), use that as the folder name directly: `output/sessions/$ARGUMENTS/`.

Otherwise check for a current-session pointer:

```bash
cat output/sessions/.current-session 2>/dev/null
```

If that file exists and is non-empty, use `output/sessions/[contents]/`.

Otherwise, find the most recently modified session folder:

```bash
ls -dt output/sessions/[0-9]*/ | head -1
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
````

### Phase 1 Verification Gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
test -f .claude/commands/wrap-up-session.md && echo "OK" || echo "MISSING"
```

### Phase 1 Commit

```bash
git add .claude/commands/wrap-up-session.md
git commit -m "$(cat <<'EOF'
feat(commands): add /wrap-up-session command

Writes session-wrap-up.md to the active session folder. Reads yolo-brief.md,
session.md, and git log to synthesize a structured summary: goal, what was done,
key decisions, commits, files changed, and what was learned.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Update `plan.to.yolo.md` — Add Required Wrap-Up Phase

**Goal:** Every generated YOLO brief must end with a `/wrap-up-session` invocation.
**Model:** sonnet — targeted edit to an existing command file

Read `.claude/commands/plan.to.yolo.md` in full.

Insert a new `**3h.**` block between `3f` (session file update) and `3g` (rules footer).

The `3f` block ends with:

```
Confirm this was done in the final report.

```

```

After that closing triple-backtick line, insert:

```

**3h. Wrap-up section (required final step, after `## Update Session File`, before `## Rules`):**

```markdown
## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**
```

````

This makes the generated brief include a `## Run Wrap-Up` section that the YOLO worker executes as its final step.

### Phase 2 Verification Gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
grep -q "wrap-up-session" .claude/commands/plan.to.yolo.md && echo "OK" || echo "MISSING"
```

### Phase 2 Commit

```bash
git add .claude/commands/plan.to.yolo.md
git commit -m "$(cat <<'EOF'
feat(commands): add required wrap-up phase to plan.to.yolo briefs

Every generated YOLO brief now ends with a '## Run Wrap-Up' section that
instructs the worker to invoke /wrap-up-session as its final step. This makes
YOLO sessions self-documenting without requiring manual intervention.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Create SessionEnd Hook Script

**Goal:** Bash fallback that writes a minimal placeholder when `/wrap-up-session` was not run.
**Model:** sonnet — new bash script with JSON parsing and file I/O

First check if `scripts/` directory exists:
```bash
ls -d /Users/rickywilson/Sites/local-business-platform/scripts/ 2>/dev/null || echo "MISSING"
```

Create `scripts/session-end-hook.sh`:

```bash
#!/usr/bin/env bash
# SessionEnd hook — writes a minimal placeholder if session-wrap-up.md is absent.
# Called by Claude Code SessionEnd hook with JSON payload on stdin.

set -euo pipefail

PAYLOAD=$(cat)
CWD=$(echo "$PAYLOAD" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('cwd',''))" 2>/dev/null || echo "")

# Only act on local-business-platform sessions
if [[ "$CWD" != *"local-business-platform"* ]]; then
  exit 0
fi

PROJECT_ROOT="/Users/rickywilson/Sites/local-business-platform"
SESSIONS_DIR="$PROJECT_ROOT/output/sessions"

# Find most recent session folder (pointer file takes priority)
SESSION_POINTER="$SESSIONS_DIR/.current-session"
if [[ -f "$SESSION_POINTER" ]]; then
  SESSION_NAME=$(cat "$SESSION_POINTER")
  SESSION_DIR="$SESSIONS_DIR/$SESSION_NAME"
else
  SESSION_DIR=$(ls -dt "$SESSIONS_DIR"/[0-9]*/ 2>/dev/null | head -1 | tr -d '\n')
fi

[[ -z "$SESSION_DIR" ]] || [[ ! -d "$SESSION_DIR" ]] && exit 0

WRAP_UP_FILE="$SESSION_DIR/session-wrap-up.md"
[[ -f "$WRAP_UP_FILE" ]] && exit 0  # already written — nothing to do

FOLDER_NAME=$(basename "$SESSION_DIR")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_LOG=$(cd "$PROJECT_ROOT" && git log --oneline -10 2>/dev/null || echo "(no commits found)")

cat > "$WRAP_UP_FILE" << WRAPEOF
# Session Wrap-Up: $FOLDER_NAME

**Date:** $(date +%Y-%m-%d)
**Generated by:** SessionEnd hook (placeholder — /wrap-up-session was not run)
**Status:** Incomplete

> This is an auto-generated placeholder. Run \`/wrap-up-session\` to replace it
> with a proper synthesized summary.

## Recent Commits (at session end)

\`\`\`
$GIT_LOG
\`\`\`

_Generated at $TIMESTAMP_
WRAPEOF
```

Make executable:
```bash
chmod +x scripts/session-end-hook.sh
```

### Phase 3 Verification Gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
test -x scripts/session-end-hook.sh && echo "OK" || echo "NOT EXECUTABLE"
echo '{"cwd":"/Users/rickywilson/Sites/local-business-platform","hook_event_name":"SessionEnd"}' | bash scripts/session-end-hook.sh
echo "Hook ran without error: $?"
```

### Phase 3 Commit

```bash
git add scripts/session-end-hook.sh
git commit -m "$(cat <<'EOF'
feat(scripts): add session-end-hook.sh for wrap-up fallback

SessionEnd hook that detects when /wrap-up-session was not run and writes a
minimal placeholder with timestamp and recent git log. Only fires for
local-business-platform sessions (cwd check).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Update `~/.claude/settings.json` — Add SessionEnd Hook

**Goal:** Wire the bash script into Claude Code's SessionEnd hook.
**Model:** sonnet — careful JSON merge on a global config file

Read `~/.claude/settings.json` in full.

Add a `"hooks"` key at the top level of the JSON object (alongside `"env"`, `"permissions"`, `"model"`, etc.):

```json
"hooks": {
  "SessionEnd": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "bash /Users/rickywilson/Sites/local-business-platform/scripts/session-end-hook.sh"
        }
      ]
    }
  ]
}
```

**CRITICAL:** Do not overwrite the file. Read it, add the `"hooks"` key, write the complete valid JSON back. Verify the result parses cleanly.

### Phase 4 Verification Gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
python3 -m json.tool ~/.claude/settings.json > /dev/null && echo "Valid JSON" || echo "INVALID JSON — fix before continuing"
python3 -c "import json; d=json.load(open('$HOME/.claude/settings.json')); print('hooks key present:', 'hooks' in d)"
```

No commit needed — `~/.claude/settings.json` is not tracked in this repo.

---

## Phase 5: Update `CLAUDE.md` — Document the Standard

**Goal:** Make session wrap-ups part of the documented workflow.
**Model:** haiku — targeted text insertion into a markdown file

Read `CLAUDE.md`. Find the `## Output Folder` section (contains "Use sessions for:").

After the paragraph that ends with `See [output/README.md](output/README.md) for details.`, insert a new section:

```markdown
## Session Wrap-Up Standard

Every session ends with a `session-wrap-up.md` in the session folder:

- **YOLO sessions:** The brief's final phase runs `/wrap-up-session` automatically.
- **Interactive sessions:** Run `/wrap-up-session` before closing.
- **Fallback:** The SessionEnd hook writes a minimal placeholder if the command was skipped.

The wrap-up captures: goal, what was done, key decisions, commits, significant files changed, and what was learned.
```

### Phase 5 Verification Gate — STOP if this fails

```bash
# Verification gate — STOP if this fails
grep -q "Session Wrap-Up Standard" CLAUDE.md && echo "OK" || echo "MISSING"
```

### Phase 5 Commit

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(CLAUDE.md): add session wrap-up standard

Documents the /wrap-up-session command, YOLO brief enforcement, and
SessionEnd hook fallback as the required end-of-session practice.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Smoke Test — Write the First Real Wrap-Up

**Goal:** Verify the new command works by running it on the current session.
**Model:** sonnet — executes the new command

Run:
```
/wrap-up-session 2026-04-11_session-wrap-up-standard
```

Confirm `output/sessions/2026-04-11_session-wrap-up-standard/session-wrap-up.md` was created with proper content (not the hook placeholder).

```bash
# Verification gate — STOP if this fails
test -f output/sessions/2026-04-11_session-wrap-up-standard/session-wrap-up.md && echo "OK" || echo "MISSING"
grep -v "Generated by.*SessionEnd hook" output/sessions/2026-04-11_session-wrap-up-standard/session-wrap-up.md | head -5
```

### Phase 6 Commit

```bash
git add output/sessions/2026-04-11_session-wrap-up-standard/
git commit -m "$(cat <<'EOF'
docs(sessions): add session-wrap-up-standard session and first wrap-up

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently.

### Intra-phase groups

| Group | Phase   | Items                                                                                 | File overlap      | Model  | Rationale                          |
| ----- | ------- | ------------------------------------------------------------------------------------- | ----------------- | ------ | ---------------------------------- |
| G1    | Phase 2 | Read `.claude/commands/plan.to.yolo.md` + identify insertion point (read-only)        | none (read only)  | n/a    | Read before edit — no conflict     |
| G2    | Phase 5 | Run `grep -q "Session Wrap-Up Standard" CLAUDE.md` after edit (verification)          | none (read only)  | n/a    | Independent verification           |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                    | Reason                                                               |
| --------------------------------------- | -------------------------------------------------------------------- |
| Phase 3 before Phase 4                  | Hook script must exist before settings.json references it            |
| Phase 4 JSON edit                       | Global settings file — single writer only                            |
| Git commits                             | One per phase, in order                                              |
| Phase 6 (smoke test) last               | Command must exist (Phase 1) and work is committed before testing    |

---

## Cost Estimate

| Phase                             | Model  | Est. input tokens | Est. output tokens | Est. cost |
| --------------------------------- | ------ | ----------------- | ------------------ | --------- |
| Phase 1: Create wrap-up command   | sonnet | ~4k               | ~1.5k              | $0.04     |
| Phase 2: Edit plan.to.yolo.md     | sonnet | ~6k               | ~0.5k              | $0.03     |
| Phase 3: Session-end hook script  | sonnet | ~3k               | ~1k                | $0.03     |
| Phase 4: settings.json hook       | sonnet | ~5k               | ~0.5k              | $0.02     |
| Phase 5: CLAUDE.md update         | haiku  | ~8k               | ~0.3k              | $0.01     |
| Phase 6: Smoke test               | sonnet | ~4k               | ~1k                | $0.02     |
| **Total**                         |        | **~30k**          | **~4.8k**          | **~$0.15** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Confirmation that `session-wrap-up.md` was created (not a placeholder)
3. Confirmation that `~/.claude/settings.json` is valid JSON with `hooks` key
4. Any exceptions or deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_session-wrap-up-standard/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session 2026-04-11_session-wrap-up-standard

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.**
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model used
- **The brief writes to `~/.claude/settings.json` (outside the primary repo)** — the terminal command MUST include `--additionalDirectories ~/.claude`

## Completed

**Date:** 2026-04-11
**Status:** All phases executed successfully

Implemented the session wrap-up standard across four artifacts: the `/wrap-up-session` slash command, a required wrap-up phase injected into every `plan.to.yolo`-generated brief (3h block), a bash SessionEnd hook fallback (`scripts/session-end-hook.sh`) wired into `~/.claude/settings.json`, and a CLAUDE.md documentation section. A minor bug (`$TIMESTAMP_` unbound variable) was caught and fixed during Phase 3 verification. The first real wrap-up was written for this session as the smoke test.

### Commits

- `efb503d` — feat(commands): add /wrap-up-session command
- `7f7e929` — feat(commands): add required wrap-up phase to plan.to.yolo briefs
- `e563534` — feat(scripts): add session-end-hook.sh for wrap-up fallback
- `28e2fd4` — docs(CLAUDE.md): add session wrap-up standard
````
