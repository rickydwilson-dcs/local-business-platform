# Pipeline Kill Theme

Remove a generated theme package and clean up all references to it.

**Usage:** `/pipeline.kill-theme <theme-name>`

---

## Step 1: Preflight

```bash
git branch --show-current
```

Must be on `develop`. If not, STOP: "Switch to develop branch first."

Parse `$ARGUMENTS` for the theme name (e.g., `lyra`).

**Built-in theme protection:** If name is `orion` or `vega`, STOP: "Cannot remove built-in theme '<name>'."

## Step 2: Validate

Check the theme directory exists:
```bash
ls -d packages/themes/<name>/ 2>/dev/null
```

If not found: WARN "Theme directory packages/themes/<name>/ not found — checking for stale references..." and continue to cleanup steps (idempotent — references may exist even if directory was already deleted).

Echo the resolved theme name before proceeding: "Removing theme: <name>"

## Step 3: Remove Theme Directory

```bash
rm -rf packages/themes/<name>/
```

## Step 4: Clean Theme Exports

Read `packages/themes/package.json` and remove all export entries with keys matching:
- `./<name>`
- `./<name>/manifest`
- `./<name>/showcase`
- `./<name>/components`

Write the file back with proper JSON formatting (2-space indent, trailing newline).

**Verification — read the file back and confirm no `<name>` references remain.**

## Step 5: Remove from THEME_NAMES

Read `packages/theme-system/src/types.ts`.

Find the `THEME_NAMES` array:
```typescript
export const THEME_NAMES = ["orion", "vega", "<name>"] as const;
```

Remove `"<name>"` from the array. Handle comma cleanup:
- If it was the last element, remove the preceding comma too
- If it was the only extra element, ensure the array is still valid syntax

Write the file back.

**Verification — grep for the theme name:**
```bash
grep '"<name>"' packages/theme-system/src/types.ts
```
Should return nothing.

## Step 6: Remove from ThemeName Union

Read `packages/core-components/src/context/theme-context.tsx`.

Find the `ThemeName` type and remove `| "<name>"` from it.

Write the file back.

**Verification — grep for the theme name:**
```bash
grep '"<name>"' packages/core-components/src/context/theme-context.tsx
```
Should return nothing.

## Step 7: Reinstall and Verify

```bash
pnpm install
```

Run full verification:
```bash
# Theme directory gone
ls packages/themes/<name>/ 2>/dev/null && echo "FAIL: directory still exists" || echo "OK: directory removed"

# No exports referencing this theme
grep '<name>' packages/themes/package.json && echo "FAIL: exports remain" || echo "OK: exports clean"

# Not in THEME_NAMES
grep '"<name>"' packages/theme-system/src/types.ts && echo "FAIL: still in THEME_NAMES" || echo "OK: THEME_NAMES clean"

# Not in ThemeName union
grep '"<name>"' packages/core-components/src/context/theme-context.tsx && echo "FAIL: still in ThemeName" || echo "OK: ThemeName clean"
```

Then verify no broken types:
```bash
pnpm type-check
```

If type-check fails, STOP and report the errors.

## Step 8: Report

- Summary of what was removed and cleaned
- Type-check results (pass/fail)
- `git status --short` to show current state

---

## Rules

- This command does NOT commit or push anything
- This command does NOT remove the test site — use `/pipeline.kill-site` for that
- This command does NOT remove `output/ingestion/<theme>/` — that's kept for debugging
- NEVER delete `orion` or `vega` — they are built-in themes
