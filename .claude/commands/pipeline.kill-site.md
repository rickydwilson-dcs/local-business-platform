# Pipeline Kill Site

Remove a test site created by `/pipeline.ingest`.

**Usage:** `/pipeline.kill-site test-<theme-name>` or `/pipeline.kill-site <theme-name>`
**Options:** `--force` — remove even if `.pipeline-test-site.json` marker is missing

---

## Step 1: Preflight

```bash
git branch --show-current
```

Must be on `develop`. If not, STOP: "Switch to develop branch first."

Parse `$ARGUMENTS` for:
- Site name (required) — e.g., `test-lyra` or just `lyra`
- `--force` (optional) — skip marker check

Normalize the name: if it doesn't start with `test-`, prepend `test-`.

## Step 2: Validate

Check the site exists:
```bash
ls -d sites/<name>/ 2>/dev/null
```

If not found: "Site `sites/<name>/` not found — nothing to remove." STOP (this is success — idempotent).

Check for the marker file:
```bash
ls sites/<name>/.pipeline-test-site.json 2>/dev/null
```

- If marker exists: proceed
- If marker missing and `--force` NOT specified: STOP with "sites/<name>/ does not have a .pipeline-test-site.json marker — this may not be a pipeline test site. Use --force to remove anyway."
- If marker missing and `--force` specified: WARN "No marker file found — proceeding with --force" and continue

Echo the resolved path before proceeding: "Removing: sites/<name>/"

## Step 3: Remove

```bash
rm -rf sites/<name>/
```

## Step 4: Verify

```bash
ls sites/<name>/ 2>/dev/null && echo "FAIL: directory still exists" || echo "OK: site removed"
```

## Step 5: Reconcile Lockfile

1. Run `pnpm install --lockfile-only` at the monorepo root.
2. If it fails, fall back to `pnpm install`.
3. Stage `pnpm-lock.yaml` alongside the site removal.
4. Report: "Lockfile updated — removed entries for test-<theme>"

**Idempotency note:** If the site directory doesn't exist (already deleted), skip lockfile reconciliation unless `--reconcile-lockfile` is explicitly passed.

## Step 6: Report

- Confirm what was removed
- Show `git status --short` for current state
- Remind: "To also remove the theme package, run: /pipeline.kill-theme <theme-name>"

---

## Rules

- This command does NOT commit or push anything
- This command does NOT remove the theme package — use `/pipeline.kill-theme` for that
- This command does NOT remove `output/ingestion/<theme>/` — that's kept for debugging
