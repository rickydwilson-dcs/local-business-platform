# Claude Plan: `/pipeline.stitch-design` Skill

**Date:** 2026-03-28
**Author:** Claude (independent, pre-synthesis)

---

## Overview

A new skill `.claude/commands/pipeline.stitch-design.md` that creates a full theme + test site using Google Stitch as the design source, rather than a scraped reference URL. The end state is identical to `pipeline.ingest`: a running test site, no commit, ready for the user to review and iterate.

---

## Phase 1: Preflight

**Files touched:** none

**Steps:**
1. Confirm branch is `develop` — `git branch --show-current`. STOP if not.
2. Check working tree — `git status --porcelain`. WARN if dirty (don't block, consistent with pipeline.ingest).
3. Verify Stitch MCP reachable — attempt `list_projects` or similar low-cost Stitch MCP call. If it fails, STOP with: "Stitch MCP tools not available. Ensure the Stitch MCP server is configured at user level (~/.claude/). See: https://stitch.withgoogle.com/docs/mcp"
4. Parse `--trade` (required) and `--colors` (optional). If `--trade` missing, STOP with usage.
5. Auto-pick theme name: call `npx tsx tools/lib/theme-name-picker.ts` to resolve the next unused name from `CONSTELLATION_NAMES`. Store as `$THEME_NAME`.
6. Defensive check: verify `packages/themes/$THEME_NAME/` does not already exist. If it does, STOP with diagnostic — this indicates `THEME_NAMES` in `types.ts` is out of sync.

**Verification gate:** Theme name resolved, Stitch MCP alive, `--trade` present.

---

## Phase 2: Create Stitch Project and Generate Pages

**Files touched:** none (Stitch side only)

**Steps:**

**2a. Create project**
- Call Stitch MCP `create_project` with name `$THEME_NAME-stitch`.
- Store returned project ID as `$PROJECT_ID`.

**2b. Build the generation prompt**

The prompt sent to Stitch should be structured:
```
Design a professional website for a [TRADE] business in the UK.
[If --colors provided:] Use a colour scheme of [COLORS].
[If --colors omitted:] Choose a colour scheme appropriate for a [TRADE] business.

The design should feel trustworthy, local, and trade-appropriate — not generic SaaS.
Use realistic placeholder content (company name, services, testimonials, contact details).
```

**2c. Generate 5 screens** — call `generate_screen` (or equivalent) per page with targeted page-level prompts:

| Page | Slug | Prompt additions |
|------|------|-----------------|
| Home | `home` | Hero with strong CTA, key services overview (3-4 cards), social proof/testimonials, stats bar, footer |
| About | `about` | Company story, founding year, team/values section, trust signals (accreditations, awards), footer |
| Contact | `contact` | Contact form (name, email, phone, message), business phone/address, opening hours, map placeholder, footer |
| Services | `services` | Grid/listing of all service categories with icon, title, short description, and "Learn more" link. Breadcrumb nav. |
| Service Detail | `service-detail` | Single service page: hero with service name, description paragraphs, benefits list, image gallery placeholder, FAQ accordion, CTA panel, breadcrumb back to Services |

Confirm all 5 screens exist in the project before proceeding. If any fail, STOP.

**Verification gate:** `list_screens` returns 5 screens for `$PROJECT_ID`.

---

## Phase 3: Download Design Assets

**Files created:**
- `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`
- `output/ingestion/$THEME_NAME-stitch/design-system/home.html`
- `output/ingestion/$THEME_NAME-stitch/design-system/about.html`
- `output/ingestion/$THEME_NAME-stitch/design-system/contact.html`
- `output/ingestion/$THEME_NAME-stitch/design-system/services.html`
- `output/ingestion/$THEME_NAME-stitch/design-system/service-detail.html`

**Steps:**
1. `mkdir -p output/ingestion/$THEME_NAME-stitch/design-system/`
2. Call Stitch MCP `get_design_system` for `$PROJECT_ID` → write `tokens.json`
3. For each of the 5 screens, call Stitch MCP `get_screen_html` → write to corresponding `.html` file

**Verification gate:** All 6 files exist and are non-empty.

---

## Phase 4: Create Theme Package

**Files created:**
- `packages/themes/$THEME_NAME/index.ts`
- `packages/themes/$THEME_NAME/globals.css`

**Steps:**

**4a. Parse tokens.json**

Extract the following with this mapping (Stitch token → ThemeConfig field):

| Stitch token | ThemeConfig path | Fallback |
|---|---|---|
| `primaryColor` / `primary` / `colors.primary` | `colors.brand.primary` | `#2563eb` |
| Darken primary by ~15% | `colors.brand.primaryHover` | Computed |
| `secondaryColor` / `secondary` | `colors.brand.secondary` | `#1e3a5f` |
| `accentColor` / `accent` / `tertiary` | `colors.brand.accent` | `#06b6d4` |
| `backgroundColor` / `background` / `surface` | `colors.surface.background` | `#ffffff` |
| `onBackground` / `textColor` / `foreground` | `colors.surface.foreground` | `#111827` |
| `surfaceColor` / `cardBackground` / `card` | `colors.surface.card` | `#ffffff` |
| `outlineColor` / `border` | `colors.surface.cardBorder` | `#e2e8f0` |
| `neutralColor` / `muted` / `surfaceVariant` | `colors.surface.muted` | `#f8fafc` |
| Always fixed | `colors.semantic.*` | `#10b981`, `#f59e0b`, `#ef4444`, `#3b82f6` |

When a Stitch token key doesn't match exactly, search for the closest match in the JSON using common variations. If no match found, use the fallback value and add a comment in the generated file.

**4b. Infer ComponentRegistry variants** from design characteristics observed in `home.html`:
- `heroVariant`: If hero `<section>` has a full-width background image → `"image-overlay"`; if it has a two-column split (text left, image right) → `"split"`
- `headerVariant`: If `<header>` or `<nav>` has a dark background colour (luminance < 0.3) → `"dark"`; else → `"light"`
- `cardVariant`: If service cards have circular icon containers (`border-radius: 50%` or `rounded-full`) → `"icon-circle"`; else → `"standard"`
- `sectionVariant`: If there is an alternating dark section (dark background on every other section) → `"dark-accent"`; else → `"standard"`

**4c. Write `packages/themes/$THEME_NAME/index.ts`** following orion/vega exactly:
```typescript
/**
 * [ThemeName] Theme
 *
 * Generated by /pipeline.stitch-design from Stitch project: $THEME_NAME-stitch
 * Trade type: [TRADE]
 *
 * Sites using [ThemeName]: (none yet)
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const [camelThemeName]Registry: ComponentRegistry = { ... };
export const [camelThemeName]DefaultConfig: DeepPartialThemeConfig = { colors: { ... } };
registerTheme({ name: '[theme-name]', label: '[ThemeName]', config: [camelThemeName]DefaultConfig });
```

**4d. Write `packages/themes/$THEME_NAME/globals.css`**

The skill MUST generate a `globals.css` because `pipeline.ingest` step 5b imports it in the test site's `app/globals.css`. Without it, the test site build fails.

Content: copy vega's `globals.css` as a template (it uses only `@apply` with theme tokens — `bg-brand-primary`, `text-surface-foreground`, etc. — so it is colour-agnostic and works for any theme). Prepend the animation import and add a header comment identifying the theme.

This is the correct call because:
- vega's globals.css is entirely token-based (no hardcoded colours)
- it provides a complete, working set of utility classes out of the box
- the alternative (generating CSS from scratch based on Stitch HTML) is fragile and produces inconsistent results

**4e. Update `THEME_NAMES` in `packages/theme-system/src/types.ts`**

Add `$THEME_NAME` to the `THEME_NAMES` array so `pickNextThemeName()` skips it on the next run. This is a mandatory step — without it, the next run will try to create the same theme name again.

```typescript
// Before:
export const THEME_NAMES = ["orion", "vega"] as const;
// After:
export const THEME_NAMES = ["orion", "vega", "lyra"] as const;
```

**Verification gate:** `cd packages/themes && npx tsc --noEmit` (or `pnpm type-check` from root) — must pass.

---

## Phase 5: Scaffold and Wire Test Site

**Files created:** `sites/$THEME_NAME-test/` (full directory)

Mirror `pipeline.ingest` steps 3–7 exactly:

**5a.** Copy base-template:
```bash
cp -r sites/base-template sites/$THEME_NAME-test
rm -rf sites/$THEME_NAME-test/node_modules sites/$THEME_NAME-test/.next sites/$THEME_NAME-test/.turbo
```

**5b.** Write `.pipeline-test-site.json` marker:
```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "$THEME_NAME",
  "sourceUrl": "stitch:$PROJECT_ID",
  "pipelineOutput": "output/ingestion/$THEME_NAME-stitch/"
}
```
Note: `sourceUrl` uses `stitch:$PROJECT_ID` as a sentinel to distinguish from URL-sourced sites.

**5c.** Rewrite `theme.config.ts`:
```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { [camelThemeName]Registry, [camelThemeName]DefaultConfig } from '@platform/themes/$THEME_NAME';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: [camelThemeName]Registry,
  ...[camelThemeName]DefaultConfig,
};
```

**5d.** Rewrite `app/globals.css`:
```css
@import "../../../packages/themes/$THEME_NAME/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-surface-background text-surface-foreground; font-feature-settings: 'rlig' 1, 'calt' 1; }
}
```

**5e.** Generate CI-inert `package.json` via `generateTestSitePackageJson('$THEME_NAME-test', basePackageJson)` from `tools/lib/test-site-package.ts`. Verify CI-inert.

**5f.** Update `site.config.ts` tagline → `'Pipeline Test Site — $THEME_NAME theme (Stitch)'`

**5g.** Rewrite `app/layout.tsx` as bare shell with ThemeProvider (no SiteHeader/Footer).

**5h. Example pages**: Unlike `pipeline.ingest`, no generated example pages exist from an ingestion run. Do NOT attempt to convert Stitch HTML to TSX automatically — this is brittle and out of scope. The test site uses base-template pages wired to the new theme. This is sufficient to verify the theme compiles and tokens resolve correctly. The Stitch HTML files serve as the human-readable visual reference in `output/ingestion/`.

**Verification gate:**
```bash
node -e "
  const p = require('./sites/$THEME_NAME-test/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) process.exit(1);
  if (!p.pipelineTestSite) process.exit(1);
  console.log('PASS');
"
```

---

## Phase 6: Lockfile and Staging

**Steps:**
1. `pnpm install --lockfile-only` from monorepo root
2. If fails, fall back to `pnpm install`
3. `pnpm install --frozen-lockfile` to verify
4. Type-check: `cd sites/$THEME_NAME-test && npx tsc --noEmit` — report errors but don't block
5. Stage: `git add sites/$THEME_NAME-test/ packages/themes/$THEME_NAME/ packages/theme-system/src/types.ts pnpm-lock.yaml`

---

## Phase 7: Report

Output:
- **Theme name:** `$THEME_NAME` (auto-assigned from constellation namespace)
- **Stitch project:** `$THEME_NAME-stitch` (project ID: `$PROJECT_ID`)
- **Design assets:** `output/ingestion/$THEME_NAME-stitch/design-system/`
  - `tokens.json` — design system tokens
  - `home.html`, `about.html`, `contact.html`, `services.html`, `service-detail.html`
- **Theme package:** `packages/themes/$THEME_NAME/`
- **Test site:** `sites/$THEME_NAME-test/`
  - Dev server: `cd sites/$THEME_NAME-test && npm run dev`
- **Next steps:**
  - Open Stitch project to review/iterate designs before committing to code
  - Inspect `tokens.json` — verify colour mapping looks correct
  - Start dev server and verify theme tokens resolve
  - When satisfied: run `/deploy.changes`
- **Cleanup:**
  - `/pipeline.kill-site $THEME_NAME-test` — removes test site
  - `/pipeline.kill-theme $THEME_NAME` — removes theme package

---

## Risks and Trade-offs

| Risk | Severity | Mitigation |
|---|---|---|
| Stitch token JSON schema varies | Medium | Mapping table with multiple key aliases + fallback defaults |
| ComponentRegistry variant inference from HTML is heuristic | Low-Medium | Document heuristics clearly; wrong choice is easy to manually correct in index.ts |
| No example pages in test site (unlike pipeline.ingest) | Low | Explicitly documented as by-design; base-template pages verify theme wiring sufficiently |
| THEME_NAMES sync is a code edit inside a skill | Medium | Skill must do it — otherwise next run breaks. Add a verification step after the edit. |
| Stitch MCP tool names may differ from assumed names | Medium | Skill should use list-tools / inspect available MCP tools at start and adapt |
| globals.css copy from vega works for any theme but doesn't reflect Stitch-specific design details | Low | Acceptable for a test/reference site; the Stitch HTML is the source of truth for final component design |
