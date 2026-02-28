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

Remove tracked files from the git index and working tree:
```bash
git rm -rf packages/themes/<name>/
```

Clean up any untracked artifacts:
```bash
rm -rf packages/themes/<name>/
```

## Step 4: Clean Theme Exports

Read `packages/themes/package.json`. Identify the lines containing export entries with keys matching:
- `./<name>`
- `./<name>/manifest`
- `./<name>/showcase`
- `./<name>/components`

Use the Edit tool to remove those lines. Handle trailing comma cleanup if the removed entries were at the end of the exports object.

**Verification** (single command — do NOT chain with `&&` or `||`):
```bash
grep '<name>' packages/themes/package.json
```
If grep returns matches: STOP with "FAIL: theme exports still reference <name>."
If grep returns nothing (exit code 1): exports are clean — continue.

## Step 5: Remove from THEME_NAMES

Read `packages/theme-system/src/types.ts`.

Find the `THEME_NAMES` array (e.g., `export const THEME_NAMES = ["orion", "vega", "<name>"] as const;`).

Use the Edit tool to remove `"<name>"` from the array. Handle comma cleanup:
- If it was the last element, remove the preceding comma too
- If it was the only extra element, ensure the array is still valid syntax

**Verification** (single command):
```bash
grep '"<name>"' packages/theme-system/src/types.ts
```
If grep returns a match: STOP with "FAIL: <name> still in THEME_NAMES."
If grep returns nothing (exit code 1): THEME_NAMES is clean — continue.

## Step 6: Remove from ThemeName Union

Read `packages/core-components/src/context/theme-context.tsx`.

Find the `ThemeName` type (e.g., `export type ThemeName = "orion" | "vega" | "<name>";`).

Use the Edit tool to remove `| "<name>"` from the union type.

**Verification** (single command):
```bash
grep '"<name>"' packages/core-components/src/context/theme-context.tsx
```
If grep returns a match: STOP with "FAIL: <name> still in ThemeName type."
If grep returns nothing (exit code 1): ThemeName is clean — continue.

## Step 7: Reinstall and Verify

```bash
pnpm install
```

Run each verification as a **separate command**. Do NOT chain with `&&` or `||` — interpret each result individually.

**Check 1 — Theme directory removed:**
```bash
ls -d packages/themes/<name>/ 2>/dev/null
```
If output is returned: FAIL — directory still exists. STOP.

**Check 2 — No exports referencing this theme:**
```bash
grep '<name>' packages/themes/package.json
```
If matches found: FAIL — exports still reference <name>. STOP.

**Check 3 — Not in THEME_NAMES:**
```bash
grep '"<name>"' packages/theme-system/src/types.ts
```
If matches found: FAIL — still in THEME_NAMES. STOP.

**Check 4 — Not in ThemeName union:**
```bash
grep '"<name>"' packages/core-components/src/context/theme-context.tsx
```
If matches found: FAIL — still in ThemeName. STOP.

If all four checks pass, verify no broken types:
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
