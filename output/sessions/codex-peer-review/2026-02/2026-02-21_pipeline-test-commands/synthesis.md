# Implementation Plan: Pipeline Test Commands

**Date:** 2026-02-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                          | Claude                                           | Codex                                                                    | Synthesised Decision                                                                                                        |
| ------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Marker file name**            | `.test-site` (simple)                            | `.pipeline-test-site.json` (explicit)                                    | Use `.pipeline-test-site.json` — more descriptive, less likely to collide with other tooling                                |
| **Content trimming**            | Leave base-template content as-is (already lean) | Prune to minimal set (1 service, 1 blog post)                            | Leave as-is. Base-template has only 5 services, 3 locations, 2 blogs — already minimal. Pruning adds complexity for no gain |
| **Branch precheck**             | Not mentioned                                    | Require `develop` branch check in every command                          | Include branch check. Aligns with project's NON-NEGOTIABLE git workflow                                                     |
| **Build verification**          | Full `npm run build` after site creation         | `type-check` only, then provide dev server command                       | Use `type-check` only — faster feedback. Full build is optional (user can run it). The point is quick visual verification   |
| **kill-site --force flag**      | Not mentioned                                    | Refuse delete without marker unless `--force`                            | Include `--force` option — important safety rail against accidentally deleting real sites                                   |
| **pnpm install timing**         | Run after every kill command                     | Run only when workspace links are stale                                  | Run after kill-theme (modifies package.json). Skip after kill-site (just removing a directory from a glob workspace)        |
| **Output ingestion cleanup**    | Not addressed                                    | Open question: should kill-site also delete `output/ingestion/<theme>/`? | No — keep ingestion output. It's useful for debugging and re-running. The user can manually delete it                       |
| **Registry fallback flag**      | Hardcoded to vega                                | Open question: `--registry-fallback orion\|vega`                         | Hardcode vega. Over-engineering for a test tool. User can manually edit if needed                                           |
| **type-check after kill-theme** | Not mentioned                                    | Required                                                                 | Include — verifying no broken imports is worth the time for theme removal                                                   |

## Blind Spots Caught

**Codex caught that Claude missed:**

- Branch precheck (`develop` only) — critical given the project's strict git workflow
- `--force` flag on kill-site to protect against accidentally deleting non-test sites
- Echoing resolved names before mutating files (confirmation step)
- Post-kill type-check to catch broken imports
- Working tree cleanliness warning (don't auto-stash, just warn)

**Claude caught that Codex missed:**

- Built-in theme protection on kill-theme (refuse to delete `orion` or `vega`)
- Explicit `pnpm install` after site creation to link workspace
- Settings file update (`.claude/settings.local.json`) for skill permissions
- Detailed verification commands with pass/fail output for kill-theme

---

## Implementation Plan

### What We're Building

Three Claude Code commands (`.claude/commands/*.md`) plus a settings update:

| File                                      | Purpose                       |
| ----------------------------------------- | ----------------------------- |
| `.claude/commands/pipeline.ingest.md`     | Ingest URL + create test site |
| `.claude/commands/pipeline.kill-site.md`  | Remove test site              |
| `.claude/commands/pipeline.kill-theme.md` | Remove theme package          |
| `.claude/settings.local.json`             | Add skill permissions         |

---

### Phase 1: Create `/pipeline.ingest` command

**File to create:** `.claude/commands/pipeline.ingest.md`

**Command structure:**

#### Step 1: Preflight checks

- Verify on `develop` branch. If not, STOP.
- Warn if working tree is dirty (don't block, just warn).
- Parse `$ARGUMENTS` for `--url` (required) and `--name` (optional).
- If no `--url`, STOP with usage message.

#### Step 2: Run the ingestion pipeline

```bash
npx tsx tools/analyse-site.ts --url $URL [--name $NAME]
```

- This takes several minutes. Wait for completion.
- Parse output for theme name (from "Theme: <name>" in summary).
- If `--name` was not supplied, resolve theme name from the pipeline output or by finding the newest folder under `output/ingestion/`.

**Verification gate:** `packages/themes/<theme-name>/index.ts` exists.

#### Step 3: Create test site from base-template

```bash
cp -r sites/base-template sites/test-<theme-name>
rm -rf sites/test-<theme-name>/node_modules sites/test-<theme-name>/.next sites/test-<theme-name>/.turbo
```

**Rationale:** Direct copy, not `create-site-from-project.ts`. ProjectFile requires extensive business data (address, hours, services, regions, pricing) that's meaningless for a theme test. Direct copy inherits base-template's working content and routes — we only swap 3 files.

#### Step 4: Write marker file

Create `sites/test-<theme-name>/.pipeline-test-site.json`:

```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "<theme-name>",
  "sourceUrl": "<url>",
  "pipelineOutput": "output/ingestion/<theme-name>/"
}
```

#### Step 5: Wire theme into test site

**5a. Rewrite `theme.config.ts`:**

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { vegaRegistry } from '@platform/themes/vega';
import { <camelName>DefaultConfig } from '@platform/themes/<theme-name>';

/**
 * Test site theme configuration
 * Generated by /pipeline.ingest — uses vega registry for structural
 * components with <theme-name>'s color and typography tokens overlaid.
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: vegaRegistry,
  ...<camelName>DefaultConfig,
};
```

Uses vega's component registry as structural base because:

- Generated themes produce tokens (colors, typography) but not component registries
- vega provides hero, nav, cards, footer layout patterns
- The spread overlays the generated theme's colors/typography
- Result: generated look on vega's structure — sufficient for visual verification

**5b. Rewrite `app/globals.css`:**

```css
@import "../../packages/themes/<theme-name>/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**5c. Update `package.json` name:**
Set `"name": "test-<theme-name>"` to avoid workspace conflicts.

**5d. Update `site.config.ts` tagline** (cosmetic):
Set tagline to `"Pipeline Test Site — <theme-name> theme"` so it's visually obvious this is a test site.

#### Step 6: Install and verify

```bash
pnpm install
```

Then run type-check:

```bash
cd sites/test-<theme-name> && npx tsc --noEmit
```

If type-check fails, report the error but continue — the user needs to see what's wrong.

#### Step 7: Report

Echo:

- Theme name, source URL, output directory
- Test site location: `sites/test-<theme-name>/`
- Marker file location
- Command to start dev server: `cd sites/test-<theme-name> && npm run dev`
- Reminder: use `/pipeline.kill-site test-<theme-name>` and `/pipeline.kill-theme <theme-name>` to clean up

---

### Phase 2: Create `/pipeline.kill-site` command

**File to create:** `.claude/commands/pipeline.kill-site.md`

#### Step 1: Preflight

- Verify on `develop` branch. If not, STOP.
- Parse `$ARGUMENTS` for site name. Accept both `test-lyra` and `lyra` — normalize to `test-<name>` if prefix missing.

#### Step 2: Validate

- Check `sites/<name>/` exists. If not: "Site not found — nothing to remove." STOP (success, idempotent).
- Check for `.pipeline-test-site.json` marker.
  - If marker missing and `--force` NOT specified: STOP with "This doesn't appear to be a pipeline test site. Use --force to remove anyway."
  - If marker missing and `--force` specified: warn but continue.
- Echo resolved site path before proceeding.

#### Step 3: Remove

```bash
rm -rf sites/<name>/
```

#### Step 4: Verify

```bash
ls sites/<name>/ 2>/dev/null && echo "FAIL: directory still exists" || echo "OK: site removed"
```

Note: No `pnpm install` needed — `pnpm-workspace.yaml` uses `sites/*` glob, so removing the directory is sufficient. The lockfile will update on next install.

#### Step 5: Report

- What was removed
- Remind about `/pipeline.kill-theme <theme-name>` if theme cleanup is also needed
- `git status` to show current state

---

### Phase 3: Create `/pipeline.kill-theme` command

**File to create:** `.claude/commands/pipeline.kill-theme.md`

#### Step 1: Preflight

- Verify on `develop` branch. If not, STOP.
- Parse `$ARGUMENTS` for theme name (e.g., `lyra`).
- **Built-in theme protection:** If name is `orion` or `vega`, STOP with "Cannot remove built-in theme."

#### Step 2: Validate

- Check `packages/themes/<name>/` exists. If not: "Theme directory not found — checking for stale references..." Continue to cleanup steps anyway (idempotent).
- Echo resolved theme name before proceeding.

#### Step 3: Remove theme directory

```bash
rm -rf packages/themes/<name>/
```

#### Step 4: Clean `packages/themes/package.json` exports

Read the file, remove all export entries with keys starting with `./<name>`:

- `./<name>`
- `./<name>/manifest`
- `./<name>/showcase`
- `./<name>/components`

Write the file back with proper formatting.

#### Step 5: Remove from `THEME_NAMES` in `packages/theme-system/src/types.ts`

Find the `THEME_NAMES` array and remove `"<name>"` from it. Handle comma cleanup (no trailing comma before `]`, no leading comma after `[`).

#### Step 6: Remove from `ThemeName` union in `packages/core-components/src/context/theme-context.tsx`

Find the `ThemeName` type and remove `| "<name>"` from it.

#### Step 7: Reinstall and verify

```bash
pnpm install
```

Then verify all references are gone:

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

#### Step 8: Report

- Summary of what was removed/cleaned
- Type-check results
- `git status` to show current state

---

### Phase 4: Register commands in settings

**File to modify:** `.claude/settings.local.json`

Add to the permissions `allow` array:

```json
"Skill(pipeline.ingest:*)",
"Skill(pipeline.kill-site:*)",
"Skill(pipeline.kill-theme:*)"
```

---

## Risks and Mitigations

| Risk                                                          | Severity | Mitigation                                                                                                                             |
| ------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Generated theme may not build/type-check                      | Medium   | Report errors, don't auto-fix. User inspects and decides                                                                               |
| Component registry mismatch (vega structure ≠ reference site) | Low      | Acceptable for color/typography verification. Generated components can be inspected separately in `packages/themes/<name>/components/` |
| kill-theme string edits could corrupt type files              | Medium   | Use Read tool to inspect before/after. Verify with grep. Run type-check as final gate                                                  |
| Partial cleanup if kill commands fail midway                  | Low      | Each step is independent and idempotent. Running again is safe                                                                         |
| pnpm install slow after changes                               | Low      | Only run when needed (after kill-theme, after ingest). Skip for kill-site                                                              |
| Accidentally deleting a real site                             | High     | Marker file check + `--force` requirement. Built-in theme protection for kill-theme                                                    |

---

## Verification Plan (End-to-End)

1. `git status` — clean working tree on `develop`
2. Run `/pipeline.ingest --url https://some-real-site.com`
3. Verify: `sites/test-<name>/` exists, `.pipeline-test-site.json` marker present
4. Verify: `cd sites/test-<name> && npm run dev` starts, pages render with theme colors
5. Run `/pipeline.kill-site test-<name>`
6. Verify: `sites/test-<name>/` is gone
7. Run `/pipeline.kill-theme <name>`
8. Verify: `packages/themes/<name>/` is gone, no references in types/exports
9. `pnpm type-check` — passes
10. `git diff` — should show zero changes (only `output/ingestion/` may remain)
11. `pnpm build` — full build passes (no broken imports)

---

## File Summary

| Action | File                                      | Notes                   |
| ------ | ----------------------------------------- | ----------------------- |
| Create | `.claude/commands/pipeline.ingest.md`     | New command             |
| Create | `.claude/commands/pipeline.kill-site.md`  | New command             |
| Create | `.claude/commands/pipeline.kill-theme.md` | New command             |
| Modify | `.claude/settings.local.json`             | Add 3 skill permissions |

**Runtime artifacts created by `/pipeline.ingest`:**
| Artifact | Location |
|----------|----------|
| Test site | `sites/test-<theme-name>/` |
| Marker file | `sites/test-<theme-name>/.pipeline-test-site.json` |
| Theme wiring | `sites/test-<theme-name>/theme.config.ts` (rewritten) |
| CSS import | `sites/test-<theme-name>/app/globals.css` (rewritten) |
| Package name | `sites/test-<theme-name>/package.json` (name updated) |
| Ingestion output | `output/ingestion/<theme-name>/` (preserved) |

**Files cleaned by `/pipeline.kill-theme`:**
| File | Edit |
|------|------|
| `packages/themes/<name>/` | Deleted |
| `packages/themes/package.json` | Remove 4 export entries |
| `packages/theme-system/src/types.ts` | Remove from THEME_NAMES array |
| `packages/core-components/src/context/theme-context.tsx` | Remove from ThemeName union |
