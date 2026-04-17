# YOLO Implementation Brief: Reorganize Session Folders into Monthly Buckets

**Branch:** feature/session-folder-reorg (created from develop)
**Session spec:** output/sessions/2026-04-16_session-folder-reorg/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `output/sessions/` directory has grown to 94 flat session folders (plus 29 inside `codex-peer-review/`), making it unwieldy to navigate. This brief reorganizes all sessions into `YYYY-MM/` monthly buckets and updates all automation (9 skill files, 1 shell script) and documentation that creates or finds session paths.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (-> haiku) or requires deep cross-file reasoning (-> opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/session-folder-reorg   # create feature branch from develop
```

---

## Phase 1: Create and Run Migration Script

**Goal:** Move all 94 session folders and 29 codex-peer-review folders into `YYYY-MM/` monthly buckets using `git mv`.
**Model:** sonnet — needs judgment for edge cases (legacy folders, ordering)

### Step 1: Write the migration script

Write `scripts/migrate-sessions-to-monthly.sh`:

```bash
#!/usr/bin/env bash
# Migrates flat session folders into YYYY-MM/ monthly buckets.
# Uses git mv to preserve history.
set -euo pipefail

SESSIONS_DIR="output/sessions"
CODEX_DIR="$SESSIONS_DIR/codex-peer-review"

# Phase 1: Migrate regular date-prefixed session folders
for dir in "$SESSIONS_DIR"/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  month=${name:0:7}  # YYYY-MM
  mkdir -p "$SESSIONS_DIR/$month"
  git mv "$dir" "$SESSIONS_DIR/$month/$name"
done

# Phase 2: Migrate legacy folders that don't follow YYYY-MM-DD_topic format
mkdir -p "$SESSIONS_DIR/2024-10"
git mv "$SESSIONS_DIR/2024_project-history" "$SESSIONS_DIR/2024-10/2024_project-history"

# 2025-12_december-sessions already has a 2025-12 month bucket from the date loop
git mv "$SESSIONS_DIR/2025-12_december-sessions" "$SESSIONS_DIR/2025-12/2025-12_december-sessions"

mkdir -p "$SESSIONS_DIR/2026-01"
git mv "$SESSIONS_DIR/2026-01_january-sessions" "$SESSIONS_DIR/2026-01/2026-01_january-sessions"

# Phase 3: Migrate codex-peer-review subfolders
for dir in "$CODEX_DIR"/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  month=${name:0:7}
  mkdir -p "$CODEX_DIR/$month"
  git mv "$dir" "$CODEX_DIR/$month/$name"
done

echo "Migration complete. Run 'git status' to verify, then commit."
```

### Step 2: Make it executable and run it

```bash
chmod +x scripts/migrate-sessions-to-monthly.sh
bash scripts/migrate-sessions-to-monthly.sh
```

### Step 3: Verify the migration

```bash
# Top level should only show YYYY-MM/ dirs, codex-peer-review/, and dot-files
ls output/sessions/

# Spot-check a few folders exist at their new paths
ls output/sessions/2026-04/2026-04-11_deploy/
ls output/sessions/codex-peer-review/2026-04/2026-04-16_extract-pipeline-correlation/
ls output/sessions/2024-10/2024_project-history/

# Verify git tracked the moves
git status | head -20
```

### Verification gate

```bash
# Verification gate — STOP if this fails
# Confirm no date-prefixed folders remain at top level
remaining=$(ls -d output/sessions/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$remaining" -ne "0" ]; then
  echo "FAIL: $remaining session folders were not migrated"
  exit 1
fi
# Confirm no date-prefixed folders remain in codex-peer-review top level
remaining_codex=$(ls -d output/sessions/codex-peer-review/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$remaining_codex" -ne "0" ]; then
  echo "FAIL: $remaining_codex codex-peer-review folders were not migrated"
  exit 1
fi
# Also check legacy folders are gone
for legacy in "2024_project-history" "2025-12_december-sessions" "2026-01_january-sessions"; do
  if [ -d "output/sessions/$legacy" ]; then
    echo "FAIL: legacy folder $legacy was not migrated"
    exit 1
  fi
done
echo "PASS: All session folders migrated to monthly buckets"
```

### Commit

```bash
git add output/sessions/ scripts/migrate-sessions-to-monthly.sh
git commit -m "$(cat <<'EOF'
chore: reorganize session folders into YYYY-MM monthly buckets

Moves 94 session folders and 29 codex-peer-review folders from flat
structure into YYYY-MM/ monthly directories. Legacy folders
(2024_project-history, 2025-12_december-sessions, 2026-01_january-sessions)
are placed in their respective month buckets.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Update Automation — Skills and Hook Script

**Goal:** Update 9 skill files and 1 shell script so they create/find session folders inside monthly buckets.
**Model:** sonnet — multiple files with similar but not identical edits, needs care to get each right

Read ALL 10 files before editing any of them. Then apply all edits.

### Files and exact changes

**IMPORTANT:** For each file, the pattern is consistent:

- Session **creation** paths: insert `$(date +%Y-%m)/` or `${MONTH}/` between `output/sessions/` and the date-prefixed folder name
- Session **lookup** globs: insert `*/` between `output/sessions/` and the `[0-9]*` or `20*` pattern
- `.current-session` pointer value: include the month prefix when writing

#### 2.1 `.claude/commands/review.code.md` (661 lines)

Find and change the session creation (around line 27):

```
# Old:
SESSION_DIR="output/sessions/$(date +%Y-%m-%d)_code-review"
mkdir -p "$SESSION_DIR"

# New:
SESSION_DIR="output/sessions/$(date +%Y-%m)/$(date +%Y-%m-%d)_code-review"
mkdir -p "$SESSION_DIR"
```

Find and replace ALL occurrences of `output/sessions/YYYY-MM-DD_code-review/` in the agent prompt templates with `output/sessions/YYYY-MM/YYYY-MM-DD_code-review/`. There are approximately 6 occurrences throughout the agent prompts (security, code quality, accessibility, architecture, vercel config, theme package sections). Each instance like:

```
Write your findings to `output/sessions/YYYY-MM-DD_code-review/findings-security.md`
```

becomes:

```
Write your findings to `output/sessions/YYYY-MM/YYYY-MM-DD_code-review/findings-security.md`
```

The `find output/sessions -name "fixes-applied.md"` in Step 1.5 uses recursive `find` — leave it unchanged.

#### 2.2 `.claude/commands/plan.to.yolo.md` (318 lines)

Step 1 — codex-peer-review lookup:

```
# Old (line ~10):
ls -dt output/sessions/codex-peer-review/20*/ | head -1

# New:
ls -dt output/sessions/codex-peer-review/*/20*/ | head -1
```

Step 2 — session folder target:

```
# Old:
Target session folder: `output/sessions/YYYY-MM-DD_topic-slug/`
mkdir -p output/sessions/YYYY-MM-DD_topic-slug

# New:
Target session folder: `output/sessions/YYYY-MM/YYYY-MM-DD_topic-slug/`
mkdir -p output/sessions/YYYY-MM/YYYY-MM-DD_topic-slug
```

Update ALL other path references throughout the file (~8 occurrences) from `output/sessions/YYYY-MM-DD_topic-slug` to `output/sessions/YYYY-MM/YYYY-MM-DD_topic-slug`. This includes:

- The brief header `**Session spec:**` line
- The `yolo-brief.md` path in the terminal command
- The `## Update Session File` section paths
- The `Brief saved to:` output line
- The after-session instructions

#### 2.3 `.claude/commands/plan.with.codex.md` (275 lines)

Phase 1 Step 2 — folder creation:

```
# Old:
FOLDER="output/sessions/codex-peer-review/${DATE}_${TOPIC}"
mkdir -p "$FOLDER"

# New:
MONTH=$(date +%Y-%m)
FOLDER="output/sessions/codex-peer-review/${MONTH}/${DATE}_${TOPIC}"
mkdir -p "$FOLDER"
```

Phase 2 Step 1 — synthesise lookup:

```
# Old:
ls -dt output/sessions/codex-peer-review/20*/ | head -1

# New:
ls -dt output/sessions/codex-peer-review/*/20*/ | head -1
```

Update all embedded path references in the codex prompt template and instructions (~6 occurrences). Paths like `output/sessions/codex-peer-review/[DATE_TOPIC]/` become `output/sessions/codex-peer-review/YYYY-MM/[DATE_TOPIC]/`.

#### 2.4 `.claude/commands/brief.me.md` (118 lines)

Step 4 — folder creation:

```
# Old:
FOLDER="output/sessions/codex-peer-review/${DATE}_[topic-slug]"
mkdir -p "$FOLDER"

# New:
MONTH=$(date +%Y-%m)
FOLDER="output/sessions/codex-peer-review/${MONTH}/${DATE}_[topic-slug]"
mkdir -p "$FOLDER"
```

Update output paths at lines ~108, ~110:

```
# Old:
output/sessions/codex-peer-review/[DATE]_[topic]/brief.md

# New:
output/sessions/codex-peer-review/YYYY-MM/[DATE]_[topic]/brief.md
```

#### 2.5 `.claude/commands/wrap-up-session.md` (102 lines)

Step 1 — finding the active session. This has three methods that all need updating:

**Method 1** — direct argument (line ~9). Add a fallback:

````
# Old:
If `$ARGUMENTS` was passed (e.g. `/wrap-up-session 2026-04-11_canonical-pages-completeness`), use that as the folder name directly: `output/sessions/$ARGUMENTS/`.

# New:
If `$ARGUMENTS` was passed (e.g. `/wrap-up-session 2026-04/2026-04-11_canonical-pages-completeness`), use that as the folder name directly: `output/sessions/$ARGUMENTS/`.

If that path does not exist, try searching monthly buckets:

```bash
ls -d output/sessions/*/$ARGUMENTS/ 2>/dev/null | head -1
````

```

**Method 3** — most recent folder (line ~22):
```

# Old:

ls -dt output/sessions/[0-9]\*/ | head -1

# New:

ls -dt output/sessions/_/[0-9]_/ | head -1

```

**Method 2** (`.current-session` pointer) — no change needed; path concatenation works with new format.

#### 2.6 `.claude/commands/fix.findings.md` (319 lines)

Step 1 — locate review session:
```

# Old:

ls -d output/sessions/\*\_code-review 2>/dev/null | sort -r | head -1

# New:

ls -d output/sessions/_/_\_code-review 2>/dev/null | sort -r | head -1

```

#### 2.7 `.claude/commands/deploy.changes.md` (195 lines)

Update session path references in the Vercel audit prompt section (~3 occurrences around lines 63-77):
```

# Old:

output/sessions/YYYY-MM-DD_deploy/

# New:

output/sessions/YYYY-MM/YYYY-MM-DD_deploy/

```

Also update the `mkdir -p` instruction for the deploy session directory if present.

#### 2.8 `.claude/commands/pipeline.validate-site.md` (498 lines)

Update usage example (documentation only, line ~18):
```

# Old:

--session-dir output/sessions/YYYY-MM-DD_validate-sitename

# New:

--session-dir output/sessions/YYYY-MM/YYYY-MM-DD_validate-sitename

```

#### 2.9 `.claude/commands/review.fix.deploy.md` (93 lines)

Update session path reference:
```

# Old:

Session: output/sessions/YYYY-MM-DD_code-review/

# New:

Session: output/sessions/YYYY-MM/YYYY-MM-DD_code-review/

````

#### 2.10 `scripts/session-end-hook.sh` (53 lines)

Update the fallback glob (line ~24):
```bash
# Old:
SESSION_DIR=$(ls -dt "$SESSIONS_DIR"/[0-9]*/ 2>/dev/null | head -1 | tr -d '\n')

# New:
SESSION_DIR=$(ls -dt "$SESSIONS_DIR"/*/[0-9]*/ 2>/dev/null | head -1 | tr -d '\n')
````

The `.current-session` pointer reading (lines 20-22) works unchanged — `SESSION_DIR="$SESSIONS_DIR/$SESSION_NAME"` produces the correct path when `SESSION_NAME` contains `2026-04/2026-04-16_topic`.

### Verification gate

```bash
# Verification gate — STOP if this fails
# Confirm no skill files still reference the old flat pattern for session creation/lookup
# (exclude prose/documentation lines that describe the naming format)
old_pattern_count=$(grep -rn 'output/sessions/\$(date' .claude/commands/ scripts/ 2>/dev/null | grep -v 'YYYY-MM' | grep -v '%Y-%m)/' | wc -l | tr -d ' ')
if [ "$old_pattern_count" -ne "0" ]; then
  echo "FAIL: $old_pattern_count files still reference old flat session path pattern"
  grep -rn 'output/sessions/\$(date' .claude/commands/ scripts/ 2>/dev/null | grep -v 'YYYY-MM' | grep -v '%Y-%m)/'
  exit 1
fi
echo "PASS: All automation updated for monthly bucket structure"
```

### Commit

```bash
git add .claude/commands/ scripts/session-end-hook.sh
git commit -m "$(cat <<'EOF'
chore: update session automation for monthly bucket structure

Updates 9 skill files and the session-end-hook.sh script to create and
find session folders inside YYYY-MM/ monthly buckets. The .current-session
pointer now stores paths like 2026-04/2026-04-16_topic instead of flat
folder names.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Update Documentation and Clean Up Settings

**Goal:** Update README, CLAUDE.md, and codex-peer-review README to reflect the new structure. Remove stale additionalDirectories entries.
**Model:** sonnet — documentation rewrite with judgment calls on examples

### 3.1 `output/README.md` (314 lines)

Key changes:

- **Directory structure diagram** (lines ~15-28): Replace flat layout with monthly-bucket layout showing `sessions/2026-04/2026-04-11_deploy/` etc.
- **Session naming convention** (lines ~33-42): Add note about monthly bucket: "Sessions are filed under their month: `output/sessions/YYYY-MM/YYYY-MM-DD_topic-description/`"
- **Creating a new session** (lines ~48-99): Update `mkdir -p` examples to include month directory: `mkdir -p output/sessions/$(date +%Y-%m)/YYYY-MM-DD_topic-description`
- **`.current-session` pointer examples** (lines ~91-119): Update value format from `YYYY-MM-DD_topic` to `YYYY-MM/YYYY-MM-DD_topic`
- **Quick Reference table** (lines ~299-306): Update all commands, especially "List all sessions" from `ls -d output/[0-9]*/ | sort -r` to `ls -d output/sessions/*/[0-9]*/ | sort -r`
- **Archiving section** (lines ~206-235): Update example paths

### 3.2 `CLAUDE.md` (313 lines)

Update the "Output Folder" section (around line 297-303):

```
# Old:
**Naming:** `YYYY-MM-DD_topic-description`

# New:
**Naming:** `YYYY-MM/YYYY-MM-DD_topic-description`
```

### 3.3 `output/sessions/codex-peer-review/README.md` (29 lines)

Update the file tree example to show the monthly bucket structure.

### 3.4 `.claude/settings.json` (60 lines)

Remove stale `additionalDirectories` entries that point to specific session folders:

- Remove: `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-06_mad-graphics-cygnus-theme`
- Remove: `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-13_translate-pipeline`
- Keep: `/Users/rickywilson/Sites/local-business-platform/output/sessions` (parent directory)
- Keep: `/Users/rickywilson/Sites/local-business-platform/output/sessions/codex-peer-review`

### Verification gate

```bash
# Verification gate — STOP if this fails
# Check documentation references are updated
old_doc_refs=$(grep -n 'output/sessions/20[0-9][0-9]-[0-9][0-9]-' output/README.md CLAUDE.md output/sessions/codex-peer-review/README.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$old_doc_refs" -ne "0" ]; then
  echo "FAIL: $old_doc_refs documentation lines still reference old flat session paths"
  grep -n 'output/sessions/20[0-9][0-9]-[0-9][0-9]-' output/README.md CLAUDE.md output/sessions/codex-peer-review/README.md 2>/dev/null
  exit 1
fi
echo "PASS: Documentation updated for monthly bucket structure"
```

### Commit

```bash
git add output/README.md CLAUDE.md output/sessions/codex-peer-review/README.md .claude/settings.json
git commit -m "$(cat <<'EOF'
docs: update session documentation for monthly bucket structure

Updates output README, CLAUDE.md, and codex-peer-review README to
reflect the YYYY-MM/ monthly bucket organization. Removes stale
additionalDirectories entries from settings.json.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Final Verification

**Goal:** Run comprehensive checks to confirm everything works end-to-end.
**Model:** sonnet

### Step 1: Confirm folder structure

```bash
# Top level should only show YYYY-MM/ dirs, codex-peer-review/, and dot-files
ls output/sessions/

# Codex top level should only show YYYY-MM/ dirs and README.md
ls output/sessions/codex-peer-review/
```

### Step 2: Grep for old patterns across all changed files

```bash
# No old flat patterns in automation or docs
grep -rn 'output/sessions/20[0-9][0-9]-[0-9][0-9]-' .claude/commands/ scripts/ CLAUDE.md output/README.md output/sessions/codex-peer-review/README.md 2>/dev/null
# Should return 0 results
```

### Step 3: Test session-end-hook glob

```bash
# Create a test folder to verify the glob finds it
mkdir -p output/sessions/2026-04/2026-04-16_test-glob-verify
ls -dt output/sessions/*/[0-9]*/ | head -3
# Should show the test folder
rmdir output/sessions/2026-04/2026-04-16_test-glob-verify
```

### Step 4: Verify no build impact

```bash
# This is a documentation/tooling-only change — no TypeScript, no builds needed
# But verify nothing is broken in the repo state
git status
git log --oneline -5
```

### Verification gate

```bash
# Verification gate — STOP if this fails
echo "All verification checks passed"
```

No commit for this phase — it's verification only.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                      | File overlap      | Model  | Rationale                                        |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ------ | ------------------------------------------------ |
| G1    | Phase 2 | Read all 10 files (9 skill files + session-end-hook.sh)                                                                                    | none (reads only) | n/a    | Independent reads — batch in one message         |
| G2    | Phase 2 | Edit `review.code.md`, Edit `plan.to.yolo.md`, Edit `plan.with.codex.md`, Edit `brief.me.md`                                               | none              | sonnet | Independent skill files with no shared content   |
| G3    | Phase 2 | Edit `wrap-up-session.md`, Edit `fix.findings.md`, Edit `deploy.changes.md`, Edit `pipeline.validate-site.md`, Edit `review.fix.deploy.md` | none              | sonnet | Independent skill files with no shared content   |
| G4    | Phase 2 | Edit `scripts/session-end-hook.sh`                                                                                                         | n/a (single file) | sonnet | Standalone edit, could join G2 or G3 but trivial |
| G5    | Phase 3 | Read `output/README.md`, Read `CLAUDE.md`, Read `codex-peer-review/README.md`, Read `.claude/settings.json`                                | none (reads only) | n/a    | Independent reads before editing                 |
| G6    | Phase 3 | Edit `output/README.md`, Edit `CLAUDE.md`, Edit `codex-peer-review/README.md`, Edit `.claude/settings.json`                                | none              | sonnet | Independent documentation files                  |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                                 | Reason                                                      |
| -------------------------------------------------------------------- | ----------------------------------------------------------- |
| Phase 1 (migration) must complete before Phase 2 (automation update) | Automation references paths that change in migration        |
| Phase 2 must complete before Phase 3 (docs)                          | Docs should reflect the automation that's actually in place |
| Git commits between phases                                           | One commit per phase, in order. Commits are never batched.  |
| Verification gates between phases                                    | Each phase's output gates the next.                         |

---

## Cost Estimate

| Phase                       | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Migration script   | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 2: Update automation  | sonnet | ~25k              | ~10k               | $0.23      |
| Phase 3: Update docs        | sonnet | ~10k              | ~5k                | $0.11      |
| Phase 4: Final verification | sonnet | ~5k               | ~1k                | $0.03      |
| **Total**                   |        | **~48k**          | **~18k**           | **~$0.42** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Any exceptions or intentional deviations from the plan
3. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-16_session-folder-reorg/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

## Completed

**Date:** 2026-04-17
**Status:** All phases executed successfully

All 94 session folders and 29 codex-peer-review subfolders were migrated into YYYY-MM monthly buckets via git mv (untracked folders via plain mv). Automation was updated across 9 skill files and the session-end-hook.sh script. Documentation in output/README.md, CLAUDE.md, and codex-peer-review/README.md was updated. Stale additionalDirectories entries were removed from settings.json. One complication: the lint-staged pre-commit hook conflicted with pre-existing dirty files (stash artifacts and untracked test-sirius merge conflict markers), requiring careful selective staging for each commit. A stray untracked codex-peer-review folder (`2026-04-17_design-brief-pipeline`) appeared post-Phase 1 (from stash artifacts) and was manually moved to the correct bucket in Phase 4.

### Commits

- `e46bc42` — chore: reorganize session folders into YYYY-MM monthly buckets
- `5bf5486` — chore: update session automation for monthly bucket structure
- `1540b88` — docs: update session documentation for monthly bucket structure

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

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
- Do NOT rewrite contents of old session files (yolo-briefs, wrap-ups etc.) — they are historical artifacts
- Do NOT change `find output/sessions -name "fixes-applied.md"` in review.code.md — `find` is already recursive
- Do NOT change `output/sessions/.session-metadata-template.yaml` or `.gitkeep` — they stay at sessions root
- **NOTE:** This brief writes to `.claude/commands/` and `.claude/settings.json` which are outside the primary source tree. The terminal command MUST include `--additionalDirectories ~/.claude` to avoid permission prompts.
