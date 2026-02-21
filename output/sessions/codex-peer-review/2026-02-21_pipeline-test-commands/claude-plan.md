# Claude's Plan: Pipeline Test Commands

**Date:** 2026-02-21
**Author:** Claude (independent — written before seeing Codex output)

---

## Phase 1: Create `/pipeline.ingest` command

**File:** `.claude/commands/pipeline.ingest.md`

This is the most complex command. It orchestrates the full flow: ingest → create test site.

### Step 1: Parse arguments

The command receives `$ARGUMENTS` containing at minimum a `--url`. Optional: `--name` to override theme name.

Extract:
- `URL` — required, the website to analyse
- `THEME_NAME` — optional override, otherwise auto-assigned by pipeline

### Step 2: Run the ingestion pipeline

```bash
npx tsx tools/analyse-site.ts --url $URL [--name $THEME_NAME]
```

Wait for completion. Parse the output to extract:
- The theme name (from "Theme: <name>" in summary output)
- The output directory path
- Success/failure status

**Verification gate:** Check that `packages/themes/<theme-name>/index.ts` exists.

### Step 3: Create test site directory

Use a `test-` prefix naming convention: `sites/test-<theme-name>/`

Copy base-template directly (do NOT use `create-site-from-project.ts` — it requires a full ProjectFile JSON which is overkill for a throwaway test site):

```bash
cp -r sites/base-template sites/test-<theme-name>
```

Remove copied artifacts that shouldn't carry over:
```bash
rm -rf sites/test-<theme-name>/node_modules
rm -rf sites/test-<theme-name>/.next
rm -rf sites/test-<theme-name>/.turbo
```

**Rationale for direct copy over ProjectFile approach:**
- ProjectFile requires extensive business data (address, hours, services, regions, pricing) — all meaningless for a theme test
- Direct copy inherits base-template's working content and routes
- We only need to swap 3 files: `theme.config.ts`, `globals.css`, `package.json`

### Step 4: Write marker file

Create `sites/test-<theme-name>/.test-site` as a marker:

```json
{
  "createdAt": "2026-02-21T...",
  "themeName": "<theme-name>",
  "sourceUrl": "<url>",
  "pipelineOutput": "output/ingestion/<theme-name>/"
}
```

This serves two purposes:
- Identifies test sites for the kill command
- Records provenance for debugging

### Step 5: Wire theme into test site

**5a. Update `theme.config.ts`**

The key challenge: generated themes export a `DeepPartialThemeConfig` (color/typography tokens) but NOT a component registry. Sites need a `componentRegistry` for components to render.

**Solution: Use vega registry as the structural base, overlay generated theme tokens.**

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { vegaRegistry } from '@platform/themes/vega';
import { <camelName>DefaultConfig } from '@platform/themes/<theme-name>';

export const themeConfig: DeepPartialThemeConfig = {
  // Use vega's component registry for layout/interaction patterns
  componentRegistry: vegaRegistry,

  // Apply generated theme's colors and typography
  ...(<camelName>DefaultConfig),
};
```

This works because:
- vega provides the structural components (hero, nav, cards, footer)
- The generated theme's color tokens override vega's defaults via spread
- Typography and component styles also override
- The visual result shows the generated theme's look on vega's structure

**5b. Update `app/globals.css`**

Replace the theme CSS import to use the generated theme's globals:

```css
@import "../../packages/themes/<theme-name>/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**5c. Update `package.json`**

Set the package name to avoid conflicts:
```json
{
  "name": "test-<theme-name>",
  ...
}
```

### Step 6: Trim content to essentials

The test site inherits all of base-template's content. For a quick visual check, we can leave it as-is — base-template already has minimal example content (5 services, 3 locations, 2 blog posts, 1 project, 3 testimonials).

No content trimming needed. Base-template's content is already lean enough for testing purposes.

### Step 7: Install dependencies

```bash
pnpm install
```

This links the workspace and resolves the new theme import.

### Step 8: Verify build

```bash
cd sites/test-<theme-name> && npm run build
```

If build fails, report the error but don't auto-fix — the user needs to see what went wrong with the generated theme.

### Step 9: Report and launch dev server

Report:
- Theme name and source URL
- Test site location
- Any build warnings/errors
- Suggest: `cd sites/test-<theme-name> && npm run dev`

Optionally launch the dev server if in YOLO mode.

---

## Phase 2: Create `/pipeline.kill-site` command

**File:** `.claude/commands/pipeline.kill-site.md`

### Step 1: Parse arguments

`$ARGUMENTS` = the site name (e.g., `test-lyra` or just `lyra` — the command should handle both).

Normalize: if the name doesn't start with `test-`, prepend it.

### Step 2: Validate

Check that `sites/<name>/` exists. If not, report "Site not found" and stop.

Optionally check for `.test-site` marker — warn if missing (might be deleting a real site).

### Step 3: Remove site directory

```bash
rm -rf sites/<name>/
```

### Step 4: Clean workspace

```bash
pnpm install
```

This updates the pnpm lockfile to remove the workspace entry. Since `pnpm-workspace.yaml` uses `sites/*` glob, just removing the directory is sufficient — no file edits needed.

### Step 5: Clean caches

```bash
rm -rf node_modules/.cache
```

Turbo cache may reference the deleted site:
```bash
pnpm clean
```

### Step 6: Verify

```bash
ls sites/ | grep test-
```

Report what was removed and confirm the workspace is clean.

---

## Phase 3: Create `/pipeline.kill-theme` command

**File:** `.claude/commands/pipeline.kill-theme.md`

### Step 1: Parse arguments

`$ARGUMENTS` = the theme name (e.g., `lyra`).

### Step 2: Validate

Check that `packages/themes/<name>/` exists. If not, report "Theme not found" and stop.

Protect built-in themes: if name is `orion` or `vega`, STOP with error "Cannot remove built-in theme."

### Step 3: Remove theme directory

```bash
rm -rf packages/themes/<name>/
```

### Step 4: Remove exports from `packages/themes/package.json`

Read the file, remove all export entries matching `./<name>` or `./<name>/*`:
- `./<name>` → `./<name>/index.ts`
- `./<name>/manifest` → `./<name>/manifest.ts`
- `./<name>/showcase` → `./<name>/showcase-registry.tsx`
- `./<name>/components` → `./<name>/components/index.ts`

Write the file back.

### Step 5: Remove from `THEME_NAMES` in `packages/theme-system/src/types.ts`

Find the line:
```typescript
export const THEME_NAMES = ["orion", "vega", "lyra"] as const;
```

Remove `"<name>"` (and any trailing/leading comma) from the array.

### Step 6: Remove from `ThemeName` union in `packages/core-components/src/context/theme-context.tsx`

Find the `ThemeName` type and remove `| "<name>"` from it.

### Step 7: Clean workspace

```bash
pnpm install
```

### Step 8: Verify

```bash
# Theme directory gone
ls packages/themes/<name>/ 2>/dev/null && echo "FAIL: directory still exists" || echo "OK: directory removed"

# No exports referencing this theme
grep '<name>' packages/themes/package.json && echo "FAIL: exports remain" || echo "OK: exports clean"

# Not in THEME_NAMES
grep '<name>' packages/theme-system/src/types.ts && echo "FAIL: still in THEME_NAMES" || echo "OK: THEME_NAMES clean"

# Not in ThemeName union
grep '<name>' packages/core-components/src/context/theme-context.tsx && echo "FAIL: still in ThemeName" || echo "OK: ThemeName clean"
```

Report results.

---

## Phase 4: Register commands in settings

**File:** `.claude/settings.local.json`

Add permission entries for the new commands:
```json
"Skill(pipeline.ingest:*)",
"Skill(pipeline.kill-site:*)",
"Skill(pipeline.kill-theme:*)"
```

---

## Risks and Trade-offs

### Risk 1: Generated theme may not build
**Mitigation:** The ingest command reports build failures but doesn't try to fix them. The user inspects, decides whether to kill-theme and re-run, or manually adjust.

### Risk 2: Component registry mismatch
**Trade-off:** Using vega's registry means the test site shows vega's component structure (hero layout, card grid, etc.) with the generated theme's colors. This is adequate for color/typography verification but won't show custom component layouts the pipeline generated. Acceptable for initial testing — the generated components in `packages/themes/<name>/components/` can be inspected separately.

### Risk 3: kill-theme regex could corrupt files
**Mitigation:** The patterns are specific enough (quoted theme name in array literal / union type) that false positives are unlikely. But the command should read-verify after writing.

### Risk 4: Partial cleanup if kill commands fail midway
**Mitigation:** Each cleanup step is independent — the command can continue past individual failures and report what succeeded/failed. Running again should be safe (idempotent checks at each step).

### Risk 5: pnpm install after site/theme removal could be slow
**Mitigation:** Acceptable for a cleanup command. Could skip if the user is about to create another test site immediately.

---

## File Summary

| Action | File | Created/Modified |
|--------|------|-----------------|
| Create | `.claude/commands/pipeline.ingest.md` | New command |
| Create | `.claude/commands/pipeline.kill-site.md` | New command |
| Create | `.claude/commands/pipeline.kill-theme.md` | New command |
| Modify | `.claude/settings.local.json` | Add skill permissions |
| Create (runtime) | `sites/test-<name>/` | Test site directory |
| Create (runtime) | `sites/test-<name>/.test-site` | Marker file |
| Modify (runtime) | `sites/test-<name>/theme.config.ts` | Theme wiring |
| Modify (runtime) | `sites/test-<name>/app/globals.css` | CSS import |
| Modify (runtime) | `sites/test-<name>/package.json` | Package name |

## Verification Plan

**End-to-end test sequence:**

1. `git status` — clean working tree on develop
2. Run `/pipeline.ingest --url https://some-real-site.com`
3. Verify: `sites/test-<name>/` exists, `.test-site` marker present
4. Verify: `cd sites/test-<name> && npm run dev` starts without errors
5. Visual check: pages render with expected colors/typography
6. Run `/pipeline.kill-site test-<name>`
7. Verify: `sites/test-<name>/` is gone
8. Run `/pipeline.kill-theme <name>`
9. Verify: `packages/themes/<name>/` is gone, no references in types/exports
10. `git diff` — should show zero changes (only `output/ingestion/` may remain, which is gitignored or in output/)
11. `pnpm build` — full build passes (no broken imports)
