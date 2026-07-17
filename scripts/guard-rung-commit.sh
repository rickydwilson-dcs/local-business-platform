#!/usr/bin/env bash
# PreToolUse(Bash) guard — the staircase's rungs receive merges, never commits.
#
# CLAUDE.md's git workflow is develop → staging → main. Commits belong on
# develop. `staging` and `main` only ever receive a merge, because a commit
# authored directly on a rung has skipped every gate below it and has to be
# cherry-picked back into compliance afterwards.
#
# This asks rather than denies: concluding a conflicted merge on a rung is a
# legitimate (if rare) reason to run `git commit` there, so the human decides.
# Deciding on the *branch* rather than on the command string is deliberate —
# matching "main"/"staging" as text would fire on `git commit -m "fix main nav"`.
#
# Contract: hook input is JSON on stdin (there is no $CLAUDE_TOOL_INPUT env var).
# Exit 0 with no output = proceed to the normal permission flow.
set -uo pipefail

INPUT=$(cat)

CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -n "$CMD" ] || exit 0

# Match `git commit` anywhere in the command, so compound forms
# (`git add -A && git commit -m ...`) are caught too.
printf '%s' "$CMD" | grep -Eq '(^|[^[:alnum:]_-])git[[:space:]]+commit([^[:alnum:]_-]|$)' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)
[ -n "$CWD" ] && [ -d "$CWD" ] || CWD="$PWD"

BRANCH=$(git -C "$CWD" rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0

case "$BRANCH" in
  staging|main) ;;
  *) exit 0 ;;
esac

jq -n --arg branch "$BRANCH" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason: (
      "You are on `" + $branch + "`, which is a promotion rung — per CLAUDE.md it should only ever receive a merge from the branch below it. A commit authored here skips every gate below it and needs cherry-picking back into compliance.\n\nUnless you are concluding a conflicted merge, go back to `develop`, commit there, and re-walk the staircase."
    )
  }
}'
exit 0
