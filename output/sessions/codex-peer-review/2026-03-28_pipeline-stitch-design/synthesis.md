# Implementation Plan: `/pipeline.stitch-design`

**Date:** 2026-03-28
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| Output folder structure | Flat `design-system/` for all assets | Subfolders: `design-system/`, `html/`, `meta/` | **Codex** — separate `html/` and `meta/` gives cleaner organisation; `design-system/tokens.json` stays in `design-system/` |
| Token mapping report | Not generated | `meta/token-mapping-report.json` with source/fallback provenance | **Codex** — valuable debugging aid when token extraction fails silently |
| `pipeline.kill-site` compat | Not addressed | Update kill-site to accept both `<name>-test` and `test-<name>` | **Codex** — must be done; old `test-<name>` sites still need cleanup |
| Stitch project name | `$THEME_NAME-stitch` (slug) | `<ThemeName> <Trade> Website` (human-readable) | **Codex** — more useful in the Stitch UI; store project ID separately |
| `sourceUrl` in marker | `stitch:$PROJECT_ID` sentinel | Empty string | **Claude** — `stitch:$PROJECT_ID` is more informative for future tooling |
| ComponentRegistry variants | 4 variants, 2 values each | 4 variants, 3-4 values each (gradient, banded, overlay) | **Codex** — more complete; maps to richer design possibilities |
| `onPrimary` colour | Not generated | Derived via WCAG contrast check | **Codex** — required for accessible button text; Claude's omission would cause missing token warnings |

## Blind Spots Caught

**Codex caught that Claude missed:**
- `pipeline.kill-site.md` needs updating — the new `<name>-test` naming convention differs from the old `test-<name>` style; without the fix, users would have to pass the full folder name or the cleanup command would fail silently
- `colors.brand.onPrimary` should be derived and emitted — it's used by `text-on-brand-primary` utility class in globals.css; omitting it means button text may be invisible
- `meta/token-mapping-report.json` — without provenance tracking, debugging a bad colour extraction requires re-running the whole pipeline

**Claude caught that Codex missed:**
- `sourceUrl: "stitch:$PROJECT_ID"` as a structured sentinel — important for future tooling to distinguish Stitch-generated sites from URL-scraped ones without reading the full pipeline output
- Explicit note that `pipeline.ingest` step 5b imports `globals.css` — making clear WHY globals.css is required (not just that it is)
- `/pipeline.kill-theme` should be mentioned in the report output alongside `/pipeline.kill-site`

---

## Implementation Plan

### Phase 1: Preflight

**Files modified:** none

1. Confirm branch is `develop`:
   ```bash
   git branch --show-current
   ```
   STOP if not `develop`.

2. Check working tree:
   ```bash
   git status --porcelain
   ```
   WARN if dirty; continue (consistent with `pipeline.ingest` behaviour).

3. Parse arguments:
   - `--trade` (required): business/profession type — used to construct Stitch prompt
   - `--colors` (optional): colour scheme guidance; if omitted, Stitch chooses
   - STOP with usage message if `--trade` is missing

4. Verify Stitch MCP reachable — attempt a lightweight list/probe call against available Stitch MCP tools. On failure, STOP:
   ```
   Stitch MCP tools not available.
   Ensure the Stitch MCP server is configured at user level (~/.claude/).
   See: https://stitch.withgoogle.com/docs/mcp
   ```

5. Auto-pick theme name:
   ```bash
   npx tsx tools/lib/theme-name-picker.ts
   ```
   Store result as `$THEME_NAME`. This reads `THEME_NAMES` from `packages/theme-system/src/types.ts` and returns the first unused name from `CONSTELLATION_NAMES`.

6. Defensive collision check:
   ```bash
   ls packages/themes/$THEME_NAME/ 2>/dev/null
   ```
   If directory exists, STOP: "Theme `$THEME_NAME` already exists in packages/themes/ but is not in THEME_NAMES — THEME_NAMES may be out of sync. Investigate before proceeding."

**Verification gate:** `$THEME_NAME` is set and non-empty; `packages/themes/$THEME_NAME/` does not exist; Stitch MCP alive; `--trade` present.

---

### Phase 2: Create Stitch Project and Generate Pages

**Files modified:** none (Stitch side only)

**2a. Create project**

Call Stitch MCP `create_project` with a human-readable name:
```
<ThemeNameTitleCase> <Trade> Website
```
e.g. for theme `lyra` and trade `electrical contractor`: `Lyra Electrical Contractor Website`

Store returned project ID as `$PROJECT_ID`.

**2b. Build project-level design intent prompt**

```
Design a professional website for a [TRADE] business in the UK.
[If --colors provided:] Use a colour scheme of [COLORS].
[If --colors omitted:] Choose a colour scheme appropriate for a [TRADE] business.

Design intent:
- Trustworthy, local, and conversion-focused — not generic SaaS
- Consistent typography, spacing rhythm, and component language across all pages
- Token-driven colour usage (primary, secondary, accent, surface, on-primary)
- Use realistic placeholder content (company name: "Smith & Sons [Trade]", services, testimonials, contact details)
- Mobile-first layout, clean navigation, prominent CTA buttons
```

**2c. Generate exactly 5 screens** using page-specific prompts:

| # | Screen name | Slug | Key sections |
|---|---|---|---|
| 1 | Home | `home` | Hero with strong CTA, services overview (3–4 cards), social proof/testimonials, stats bar, footer |
| 2 | About | `about` | Company story, founding year, team/values, trust signals (accreditations, awards), footer |
| 3 | Contact | `contact` | Contact form (name, email, phone, message), business phone/address, opening hours, map placeholder, footer |
| 4 | Services | `services` | Grid/listing of service categories with icon, title, short description, "Learn more" link, breadcrumb nav |
| 5 | Service Detail | `service-detail` | Single service: hero + service name, description paragraphs, benefits list, image gallery placeholder, FAQ accordion, CTA panel, breadcrumb back to Services |

After all 5 screens are submitted, call `list_screens` for `$PROJECT_ID` and confirm exactly 5 screens exist. If any failed to generate, STOP and report which screen(s) failed.

**Verification gate:** 5 screens confirmed in Stitch project `$PROJECT_ID`.

---

### Phase 3: Download Design Assets

**Folder created:** `output/ingestion/$THEME_NAME-stitch/`

**Files created:**
- `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`
- `output/ingestion/$THEME_NAME-stitch/html/home.html`
- `output/ingestion/$THEME_NAME-stitch/html/about.html`
- `output/ingestion/$THEME_NAME-stitch/html/contact.html`
- `output/ingestion/$THEME_NAME-stitch/html/services.html`
- `output/ingestion/$THEME_NAME-stitch/html/service-detail.html`
- `output/ingestion/$THEME_NAME-stitch/meta/project.json`
- `output/ingestion/$THEME_NAME-stitch/meta/screens.json`

Steps:
1. Create folders:
   ```bash
   mkdir -p output/ingestion/$THEME_NAME-stitch/design-system
   mkdir -p output/ingestion/$THEME_NAME-stitch/html
   mkdir -p output/ingestion/$THEME_NAME-stitch/meta
   ```
2. Call `get_design_system` for `$PROJECT_ID` → write `design-system/tokens.json`
3. Call `list_screens` for `$PROJECT_ID` → write `meta/screens.json`; write `meta/project.json` with project ID, name, trade, colors arg, timestamp
4. For each of the 5 screens, call `get_screen_html` (or equivalent) → write to `html/<slug>.html`

**Verification gate:** All 9 files exist and are non-empty.

---

### Phase 4: Create Theme Package

**Files created:**
- `packages/themes/$THEME_NAME/index.ts`
- `packages/themes/$THEME_NAME/globals.css`

**Also modified:**
- `packages/theme-system/src/types.ts` (THEME_NAMES update)

**4a. Parse tokens.json — mapping table**

Use the following alias resolution order (first match wins):

| ThemeConfig field | Stitch token aliases to try | Fallback |
|---|---|---|
| `colors.brand.primary` | `primaryColor`, `primary`, `colors.primary`, `brand.primary`, `brandColor` | `#2563eb` |
| `colors.brand.primaryHover` | `primaryHover`, `primary-hover` | Darken primary by ~12% |
| `colors.brand.secondary` | `secondaryColor`, `secondary`, `colors.secondary` | `#1e3a5f` |
| `colors.brand.accent` | `accentColor`, `accent`, `tertiary`, `highlight` | `#06b6d4` |
| `colors.brand.onPrimary` | `onPrimary`, `primaryForeground`, `primaryText` | Compute: `#ffffff` if primary luminance < 0.5, else `#111827` |
| `colors.surface.background` | `backgroundColor`, `background`, `surface`, `bgColor` | `#ffffff` |
| `colors.surface.foreground` | `onBackground`, `textColor`, `foreground`, `text` | `#111827` |
| `colors.surface.card` | `surfaceColor`, `cardBackground`, `card`, `surfaceContainer` | `#ffffff` |
| `colors.surface.cardBorder` | `outlineColor`, `border`, `outline`, `divider` | `#e2e8f0` |
| `colors.surface.muted` | `neutralColor`, `muted`, `surfaceVariant`, `neutral` | `#f8fafc` |
| `colors.semantic.*` | Map if present, else fixed defaults | `#10b981`, `#f59e0b`, `#ef4444`, `#3b82f6` |
| `colors.overlay.dark` | `overlayDark`, `scrim` | `rgba(0,0,0,0.8)` |
| `colors.overlay.light` | `overlayLight` | `rgba(255,255,255,0.8)` |
| `colors.overlay.primary` | `overlayPrimary` | `rgba(<primary-rgb>,0.8)` |

For every token: record whether the value was resolved from a direct match, an alias, or a fallback. Write this provenance to `meta/token-mapping-report.json`:
```json
{
  "colors.brand.primary": { "source": "direct", "stitchKey": "primaryColor", "value": "#dc2626" },
  "colors.brand.primaryHover": { "source": "derived", "from": "colors.brand.primary", "value": "#b91c1c" },
  "colors.surface.muted": { "source": "fallback", "value": "#f8fafc" }
}
```

**4b. Infer ComponentRegistry variants** from `html/home.html`:

| Field | Logic | Values |
|---|---|---|
| `heroVariant` | Hero has full-width background image or `background-image` CSS → `"image-overlay"`; two-column split layout → `"split"` | `"image-overlay"` \| `"split"` |
| `headerVariant` | Header/nav background luminance < 0.3 → `"dark"` | `"dark"` \| `"light"` |
| `cardVariant` | Feature cards have `border-radius:50%` or `rounded-full` on icon container → `"icon-circle"`; cards use image overlays → `"overlay"`; else → `"standard"` | `"icon-circle"` \| `"overlay"` \| `"standard"` |
| `sectionVariant` | Alternating dark brand section → `"dark-accent"`; recurring gradient backgrounds → `"gradient"`; alternating tinted bands → `"banded"`; else → `"standard"` | `"dark-accent"` \| `"gradient"` \| `"banded"` \| `"standard"` |

**4c. Write `packages/themes/$THEME_NAME/index.ts`**:

```typescript
/**
 * [ThemeNameTitleCase] Theme
 *
 * Generated by /pipeline.stitch-design
 * Stitch project: <project-name> (<project-id>)
 * Trade type: <trade>
 *
 * Sites using [ThemeNameTitleCase]: (none yet)
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const [camelCaseThemeName]Registry: ComponentRegistry = {
  theme: "[theme-name]",
  heroVariant: "<inferred>",
  headerVariant: "<inferred>",
  cardVariant: "<inferred>",
  sectionVariant: "<inferred>",
};

export const [camelCaseThemeName]DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: '...', primaryHover: '...', secondary: '...', accent: '...', onPrimary: '...' },
    surface: { background: '...', foreground: '...', card: '...', cardBorder: '...', muted: '...' },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    overlay: { dark: '...', light: '...', primary: '...' },
  },
};

registerTheme({ name: '[theme-name]', label: '[ThemeNameTitleCase]', config: [camelCaseThemeName]DefaultConfig });
```

**4d. Write `packages/themes/$THEME_NAME/globals.css`**

The skill MUST generate a `globals.css` — the test site's `app/globals.css` imports it, and without it the build fails.

Copy vega's `globals.css` verbatim as the starting point (it uses only `@apply` with theme tokens — `bg-brand-primary`, `text-surface-foreground`, etc. — so it is colour-agnostic). Update the header comment to identify the new theme. This is the correct approach because:
- vega's globals.css is entirely token-based (no hardcoded colours)
- it provides a complete, proven set of utility classes
- generating CSS from Stitch HTML would be fragile and inconsistent

**4e. Update `THEME_NAMES` in `packages/theme-system/src/types.ts`**

Append `$THEME_NAME` to the `THEME_NAMES` const array. This is **mandatory** — without it, the next run of `pickNextThemeName()` will attempt to create the same theme name again.

After editing, verify:
```bash
npx tsx -e "import { pickNextThemeName } from './tools/lib/theme-name-picker'; console.log(pickNextThemeName());"
```
The output should be the name AFTER `$THEME_NAME` in `CONSTELLATION_NAMES`.

**Verification gate:** `pnpm type-check` passes from monorepo root.

---

### Phase 5: Scaffold and Wire Test Site

**Directory created:** `sites/$THEME_NAME-test/`

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
  "sourceUrl": "stitch:<PROJECT_ID>",
  "pipelineOutput": "output/ingestion/$THEME_NAME-stitch/"
}
```
Note: `sourceUrl` uses `stitch:<PROJECT_ID>` as a structured sentinel — distinguishes Stitch-generated sites from URL-scraped ones for future tooling.

**5c.** Rewrite `theme.config.ts`:
```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { [camelCaseThemeName]Registry, [camelCaseThemeName]DefaultConfig } from '@platform/themes/$THEME_NAME';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: [camelCaseThemeName]Registry,
  ...[camelCaseThemeName]DefaultConfig,
};
```

**5d.** Rewrite `app/globals.css`:
```css
@import "../../../packages/themes/$THEME_NAME/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — $THEME_NAME theme (Stitch)
 * Generated by /pipeline.stitch-design
 */

@layer base {
  html { scroll-behavior: smooth; }
  body {
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}
```

**5e.** Generate CI-inert `package.json`:
1. Read `sites/base-template/package.json`
2. Call `generateTestSitePackageJson('$THEME_NAME-test', basePackageJson)` from `tools/lib/test-site-package.ts`
3. Write result to `sites/$THEME_NAME-test/package.json`
4. Verify CI-inert:
```bash
node -e "
  const p = require('./sites/$THEME_NAME-test/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: CI scripts present:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**5f.** Update `site.config.ts` tagline → `'Pipeline Test Site — $THEME_NAME theme (Stitch)'`

**5g.** Rewrite `app/layout.tsx` as bare shell with ThemeProvider + ReviewPanel (no SiteHeader/Footer — base-template pages provide their own):
```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { [camelCaseThemeName]Registry } from '@platform/themes/$THEME_NAME';
import { ReviewPanel } from './components/ReviewPanel';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="$THEME_NAME" registry={[camelCaseThemeName]Registry}>
          {children}
          <ReviewPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**5h. Example pages:** Do NOT convert Stitch HTML to TSX in v1. The test site uses base-template pages wired to the new theme — sufficient to verify that theme tokens compile and resolve correctly. The Stitch HTML files in `output/ingestion/$THEME_NAME-stitch/html/` serve as the human-readable visual reference.

---

### Phase 6: Lockfile Reconciliation and Staging

1. Run from monorepo root:
   ```bash
   pnpm install --lockfile-only
   ```
   If `--lockfile-only` fails, fall back to `pnpm install`.

2. Verify:
   ```bash
   pnpm install --frozen-lockfile
   ```

3. Type-check test site (report errors but do not block):
   ```bash
   cd sites/$THEME_NAME-test && npx tsc --noEmit
   ```

4. Stage all new/modified files (no commit):
   ```bash
   git add sites/$THEME_NAME-test/ packages/themes/$THEME_NAME/ packages/theme-system/src/types.ts pnpm-lock.yaml
   ```

---

### Phase 7: Update `pipeline.kill-site` for Naming Compatibility

**File modified:** `.claude/commands/pipeline.kill-site.md`

The new skill creates `sites/<name>-test` (e.g. `sites/lyra-test`). The old `pipeline.ingest` creates `sites/test-<name>` (e.g. `sites/test-lyra`). The kill-site command must handle both.

Update the name normalisation logic in `pipeline.kill-site.md`:
1. Accept `<name>-test` as a direct match → folder is `sites/<name>-test`
2. Accept `test-<name>` as a direct match → folder is `sites/test-<name>`
3. Accept bare `<name>` → try `sites/<name>-test` first, then `sites/test-<name>`, take whichever exists
4. If both exist, report ambiguity and ask for the full folder name

---

### Phase 8: Report

Output to user:

```
✓ Theme assigned:   $THEME_NAME  (constellation namespace, position N)
✓ Stitch project:   <project-name>  (id: $PROJECT_ID)
✓ Design assets:    output/ingestion/$THEME_NAME-stitch/
    html/           — 5 page exports (home, about, contact, services, service-detail)
    design-system/  — tokens.json
    meta/           — project.json, screens.json, token-mapping-report.json
✓ Theme package:    packages/themes/$THEME_NAME/
✓ Test site:        sites/$THEME_NAME-test/
✓ THEME_NAMES:      updated in packages/theme-system/src/types.ts

Dev server:   cd sites/$THEME_NAME-test && npm run dev
Cleanup:      /pipeline.kill-site $THEME_NAME-test   (removes test site)
              /pipeline.kill-theme $THEME_NAME        (removes theme package)

Next steps:
  1. Open Stitch project to review and iterate designs visually
  2. Inspect meta/token-mapping-report.json — verify colour extraction
  3. Start dev server and confirm theme tokens resolve
  4. When satisfied: /deploy.changes
```

---

## Rules (inherited from `pipeline.ingest`)

- Does NOT commit or push anything
- Never modifies `sites/base-template/` — only the copy
- If any phase fails, STOP and report — do not attempt to create a partial theme or test site

---

## Files Created or Modified

| File | Action | Notes |
|---|---|---|
| `.claude/commands/pipeline.stitch-design.md` | **Create** | New skill |
| `.claude/commands/pipeline.kill-site.md` | **Modify** | Add dual naming compatibility |
| `packages/themes/$THEME_NAME/index.ts` | **Create** | New theme package |
| `packages/themes/$THEME_NAME/globals.css` | **Create** | Copied from vega, header updated |
| `packages/theme-system/src/types.ts` | **Modify** | Append to `THEME_NAMES` |
| `sites/$THEME_NAME-test/` | **Create** | Copy of base-template, wired to new theme |
| `output/ingestion/$THEME_NAME-stitch/` | **Create** | Stitch artifacts (not committed by default) |
| `pnpm-lock.yaml` | **Modify** | Lockfile reconciliation |

---

## Verification (end-to-end test)

1. Run `/pipeline.stitch-design --trade "roofing contractor"` on `develop` branch
2. Confirm theme name auto-resolved to `lyra` (next after orion + vega)
3. Confirm Stitch project `Lyra Roofing Contractor Website` exists in Stitch UI with 5 screens
4. Confirm `output/ingestion/lyra-stitch/` contains design-system, html, and meta subfolders with all expected files
5. Confirm `meta/token-mapping-report.json` exists and shows at least some direct/alias matches (not all fallbacks)
6. Confirm `packages/themes/lyra/index.ts` exports `lyraRegistry` and `lyraDefaultConfig` and calls `registerTheme()`
7. Run `pnpm type-check` from monorepo root — must pass
8. Confirm `THEME_NAMES` in `packages/theme-system/src/types.ts` now includes `"lyra"`
9. Confirm `sites/lyra-test/.pipeline-test-site.json` exists
10. Run `cd sites/lyra-test && npm run dev` — site loads without errors
11. Run `/pipeline.kill-site lyra-test` — site removed; theme package and Stitch artifacts remain
12. Run `/pipeline.kill-site test-lyra` (old-style name) — should still work (backward compat check)

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Stitch MCP tool names/schema differ from assumed | Medium | Skill explicitly checks available tools at start; mapping-report.json surfaces extraction failures |
| Token extraction fails silently (all fallbacks used) | Medium | `token-mapping-report.json` makes this visible; user can inspect before wiring theme to production |
| ComponentRegistry variant inference incorrect | Low | Heuristics documented; wrong choice is a 1-line fix in `index.ts`; type-check catches invalid values |
| `THEME_NAMES` update produces merge conflict on shared branches | Low | It's a one-line append; easily resolved |
| Stitch rate limits or generation timeout for 5 screens | Low | Generate screens sequentially with retry guidance in skill; STOP if any screen fails |
