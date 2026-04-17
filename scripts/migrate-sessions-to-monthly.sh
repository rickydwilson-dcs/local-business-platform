#!/usr/bin/env bash
# Migrates flat session folders into YYYY-MM/ monthly buckets.
# Uses git mv for tracked folders, plain mv for untracked ones.
set -euo pipefail

SESSIONS_DIR="output/sessions"
CODEX_DIR="$SESSIONS_DIR/codex-peer-review"

# Helper: move a directory, using git mv if tracked, plain mv if not
move_dir() {
  local src="$1"
  local dest="$2"
  if git ls-files --error-unmatch "$src" >/dev/null 2>&1 || git ls-files "$src" | grep -q .; then
    git mv "$src" "$dest"
  else
    mv "$src" "$dest"
  fi
}

# Phase 1: Migrate regular date-prefixed session folders
for dir in "$SESSIONS_DIR"/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  month=${name:0:7}  # YYYY-MM
  mkdir -p "$SESSIONS_DIR/$month"
  move_dir "$dir" "$SESSIONS_DIR/$month/$name"
done

# Phase 2: Migrate legacy folders that don't follow YYYY-MM-DD_topic format
mkdir -p "$SESSIONS_DIR/2024-10"
move_dir "$SESSIONS_DIR/2024_project-history" "$SESSIONS_DIR/2024-10/2024_project-history"

# 2025-12_december-sessions already has a 2025-12 month bucket from the date loop
move_dir "$SESSIONS_DIR/2025-12_december-sessions" "$SESSIONS_DIR/2025-12/2025-12_december-sessions"

mkdir -p "$SESSIONS_DIR/2026-01"
move_dir "$SESSIONS_DIR/2026-01_january-sessions" "$SESSIONS_DIR/2026-01/2026-01_january-sessions"

# Phase 3: Migrate codex-peer-review subfolders
for dir in "$CODEX_DIR"/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  month=${name:0:7}
  mkdir -p "$CODEX_DIR/$month"
  move_dir "$dir" "$CODEX_DIR/$month/$name"
done

echo "Migration complete. Run 'git status' to verify, then commit."
