# Pipeline Stitch Design

Generate a new theme and test site using Google Stitch as the design source.
No reference URL required — Stitch creates the design from a trade/profession description.

**Usage:** `/pipeline.stitch-design --trade "electrical contractor" [--colors "dark navy and yellow"]`

- `--trade` (required) — the business/profession type; used to prompt Stitch
- `--colors` (optional) — colour scheme guidance; if omitted, Stitch chooses its own

Theme name is auto-assigned from the constellation namespace.

---

## Step 1: Preflight

**1.1 — Branch check**

```bash
git branch --show-current
```

Must output `develop`. If not, STOP: "Switch to develop branch first."

**1.2 — Working tree check**

```bash
git status --porcelain
```

If output is non-empty, WARN: "Working tree has uncommitted changes. Proceeding anyway — stitch-design does not commit." Then continue.

**1.3 — Parse arguments**

Parse `$ARGUMENTS` for:
- `--trade` (required) — e.g. `electrical contractor`, `plumber`, `scaffolding company`
- `--colors` (optional) — e.g. `dark navy and yellow`

If `--trade` is missing, STOP with:
```
Usage: /pipeline.stitch-design --trade "electrical contractor" [--colors "dark navy and yellow"]

--trade is required. It describes the business type used to prompt Stitch.
```

**1.4 — Verify Stitch MCP reachable**

Attempt a lightweight probe call to the Stitch MCP (e.g. `list_projects` or equivalent low-cost tool). On failure, STOP:
```
Stitch MCP tools not available.
Ensure the Stitch MCP server is configured at user level (~/.claude/).
See the Stitch MCP documentation for setup instructions.
```

**1.5 — Auto-pick theme name**

```bash
npx tsx tools/lib/theme-name-picker.ts
```

Store the output as `$THEME_NAME`. This reads `THEME_NAMES` from `packages/theme-system/src/types.ts` and returns the first unused name from `CONSTELLATION_NAMES`.

**1.6 — Defensive collision check**

```bash
ls -d packages/themes/$THEME_NAME/ 2>/dev/null
```

If the directory exists, STOP:
```
Theme $THEME_NAME already exists in packages/themes/ but is not in THEME_NAMES —
THEME_NAMES may be out of sync. Investigate before proceeding.
```

---

## Step 2: Create Stitch Project and Generate Pages

**2a — Create project**

Call Stitch MCP `create_project` with human-readable name:
```
<ThemeNameTitleCase> <Trade> Website
```
Examples:
- theme `lyra` + trade `electrical contractor` → `Lyra Electrical Contractor Website`
- theme `nova` + trade `plumber` → `Nova Plumber Website`

Store the returned project ID as `$PROJECT_ID`.

**2b — Apply project-level design intent**

Send as the initial generation prompt or project description:
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

**2c — Generate exactly 5 screens**

Submit one generation request per screen, using the page-specific prompts below:

| Screen | Slug | Key sections |
|--------|------|-------------|
| Home | `home` | Hero with strong CTA, services overview (3–4 cards), social proof/testimonials, stats bar, footer |
| About | `about` | Company story, founding year, team/values, trust signals (accreditations, awards), footer |
| Contact | `contact` | Contact form (name, email, phone, message), business phone/address, opening hours, map placeholder, footer |
| Services | `services` | Grid/listing of service categories with icon, title, short description, "Learn more" link, breadcrumb nav |
| Service Detail | `service-detail` | Single service page: hero + service name, description paragraphs, benefits list, image gallery placeholder, FAQ accordion, CTA panel, breadcrumb back to Services |

After submitting all 5 screens, call `list_screens` for `$PROJECT_ID` and confirm exactly 5 exist. If any failed, STOP and report which screen(s) failed.

```bash
# Verification gate — STOP if this fails
# Confirm list_screens returns exactly 5 screens for $PROJECT_ID
```

---

## Step 3: Download Design Assets

Create output folders:
```bash
mkdir -p output/ingestion/$THEME_NAME-stitch/design-system
mkdir -p output/ingestion/$THEME_NAME-stitch/html
mkdir -p output/ingestion/$THEME_NAME-stitch/meta
```

Download in parallel where possible:

- Call `get_design_system` for `$PROJECT_ID` → write `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`
- Call `list_screens` → write `output/ingestion/$THEME_NAME-stitch/meta/screens.json`
- Write `output/ingestion/$THEME_NAME-stitch/meta/project.json`:
  ```json
  {
    "projectId": "$PROJECT_ID",
    "projectName": "<ThemeNameTitleCase> <Trade> Website",
    "themeName": "$THEME_NAME",
    "trade": "<trade arg>",
    "colors": "<colors arg or null>",
    "generatedAt": "<ISO timestamp>"
  }
  ```
- For each of the 5 screens, call the Stitch HTML export tool → write to `output/ingestion/$THEME_NAME-stitch/html/<slug>.html`

```bash
# Verification gate — STOP if this fails
ls output/ingestion/$THEME_NAME-stitch/design-system/tokens.json
ls output/ingestion/$THEME_NAME-stitch/html/home.html
ls output/ingestion/$THEME_NAME-stitch/html/about.html
ls output/ingestion/$THEME_NAME-stitch/html/contact.html
ls output/ingestion/$THEME_NAME-stitch/html/services.html
ls output/ingestion/$THEME_NAME-stitch/html/service-detail.html
ls output/ingestion/$THEME_NAME-stitch/meta/project.json
ls output/ingestion/$THEME_NAME-stitch/meta/screens.json
# All 8 files must exist and be non-empty
```

---

## Step 4: Create Theme Package

**4a — Extract colours from tokens.json**

Read `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`.

Resolve each ThemeConfig field using the alias resolution order below (first match wins):

| ThemeConfig field | Stitch token aliases to try (in order) | Fallback |
|---|---|---|
| `colors.brand.primary` | `primaryColor`, `primary`, `colors.primary`, `brand.primary`, `brandColor` | `#2563eb` |
| `colors.brand.primaryHover` | `primaryHover`, `primary-hover` | Darken primary ~12% |
| `colors.brand.secondary` | `secondaryColor`, `secondary`, `colors.secondary` | `#1e3a5f` |
| `colors.brand.accent` | `accentColor`, `accent`, `tertiary`, `highlight` | `#06b6d4` |
| `colors.brand.onPrimary` | `onPrimary`, `primaryForeground`, `primaryText` | `#ffffff` if primary luminance < 0.5, else `#111827` |
| `colors.surface.background` | `backgroundColor`, `background`, `surface`, `bgColor` | `#ffffff` |
| `colors.surface.foreground` | `onBackground`, `textColor`, `foreground`, `text` | `#111827` |
| `colors.surface.card` | `surfaceColor`, `cardBackground`, `card`, `surfaceContainer` | `#ffffff` |
| `colors.surface.cardBorder` | `outlineColor`, `border`, `outline`, `divider` | `#e2e8f0` |
| `colors.surface.muted` | `neutralColor`, `muted`, `surfaceVariant`, `neutral` | `#f8fafc` |
| `colors.semantic.success` | `success`, `successColor` | `#10b981` |
| `colors.semantic.warning` | `warning`, `warningColor` | `#f59e0b` |
| `colors.semantic.error` | `error`, `errorColor` | `#ef4444` |
| `colors.semantic.info` | `info`, `infoColor` | `#3b82f6` |
| `colors.overlay.dark` | `overlayDark`, `scrim` | `rgba(0,0,0,0.8)` |
| `colors.overlay.light` | `overlayLight` | `rgba(255,255,255,0.8)` |
| `colors.overlay.primary` | `overlayPrimary` | `rgba(<primary-rgb>,0.8)` |

**4b — Record provenance**

Write `output/ingestion/$THEME_NAME-stitch/meta/token-mapping-report.json`:
```json
{
  "colors.brand.primary": { "source": "direct", "stitchKey": "primaryColor", "value": "#dc2626" },
  "colors.brand.primaryHover": { "source": "derived", "from": "colors.brand.primary", "value": "#b91c1c" },
  "colors.surface.muted": { "source": "fallback", "value": "#f8fafc" }
}
```

Each key maps to one of: `"source": "direct"` (found via alias), `"source": "derived"` (computed from another value), or `"source": "fallback"` (no match, used default).

**4c — Infer ComponentRegistry variants from html/home.html**

Read `output/ingestion/$THEME_NAME-stitch/html/home.html` and apply these heuristics:

| Field | Heuristic | Values |
|---|---|---|
| `heroVariant` | Full-width background image or `background-image` CSS → `"image-overlay"`; two-column split layout → `"split"` | `"image-overlay"` \| `"split"` |
| `headerVariant` | Header/nav background luminance < 0.3 → `"dark"` | `"dark"` \| `"light"` |
| `cardVariant` | Circular icon containers (`border-radius:50%` or `rounded-full`) → `"icon-circle"`; image overlay cards → `"overlay"`; else → `"standard"` | `"icon-circle"` \| `"overlay"` \| `"standard"` |
| `sectionVariant` | Alternating dark brand block → `"dark-accent"`; recurring gradients → `"gradient"`; alternating tinted bands → `"banded"`; else → `"standard"` | `"dark-accent"` \| `"gradient"` \| `"banded"` \| `"standard"` |

**4d — Write packages/themes/$THEME_NAME/index.ts**

Follow the orion/vega export pattern exactly:

```typescript
/**
 * <ThemeNameTitleCase> Theme
 *
 * Generated by /pipeline.stitch-design
 * Stitch project: <project-name> (id: <project-id>)
 * Trade type: <trade>
 *
 * Sites using <ThemeNameTitleCase>: (none yet)
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const <camelCaseThemeName>Registry: ComponentRegistry = {
  theme: "<theme-name>",
  heroVariant: "<inferred>",
  headerVariant: "<inferred>",
  cardVariant: "<inferred>",
  sectionVariant: "<inferred>",
};

export const <camelCaseThemeName>DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '<extracted>',
      primaryHover: '<extracted or derived>',
      secondary: '<extracted>',
      accent: '<extracted>',
      onPrimary: '<extracted or inferred>',
    },
    surface: {
      background: '<extracted>',
      foreground: '<extracted>',
      card: '<extracted>',
      cardBorder: '<extracted>',
      muted: '<extracted>',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: '<extracted or fallback>',
      light: '<extracted or fallback>',
      primary: '<extracted or derived>',
    },
  },
};

registerTheme({ name: '<theme-name>', label: '<ThemeNameTitleCase>', config: <camelCaseThemeName>DefaultConfig });
```

Replace all `<...>` placeholders with the extracted/inferred values from steps 4a–4c.

**4e — Write packages/themes/$THEME_NAME/globals.css**

Copy `packages/themes/vega/globals.css` verbatim (it uses only `@apply` with theme tokens — entirely colour-agnostic). Replace the file header comment to identify the new theme:

```css
/* Shared animation keyframes — do not move below theme-specific CSS */
@import "../../core-components/src/styles/animations.css";

/*
 * <ThemeNameTitleCase> Theme — Global CSS Utilities
 *
 * Theme-level utility classes shared by all <ThemeNameTitleCase> sites.
 * Import this file at the top of your site's app/globals.css:
 *
 *   @import "../../packages/themes/<theme-name>/globals.css";
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 *
 * Generated by /pipeline.stitch-design from Stitch project: <project-name>
 */
```

The remainder of the file (buttons, cards, sections, containers, etc.) is copied unchanged.

**4f — Update THEME_NAMES in packages/theme-system/src/types.ts**

Append `"$THEME_NAME"` to the `THEME_NAMES` array. This is MANDATORY. Without it, the next run of `pickNextThemeName()` will try to create the same name again.

Example — before:
```typescript
export const THEME_NAMES = ["orion", "vega"] as const;
```
After (for theme `lyra`):
```typescript
export const THEME_NAMES = ["orion", "vega", "lyra"] as const;
```

**Verification gate — STOP if this fails:**
```bash
npx tsx -e "import { pickNextThemeName } from './tools/lib/theme-name-picker.ts'; console.log(pickNextThemeName());"
# Output must be the constellation name AFTER $THEME_NAME, not $THEME_NAME itself
```

---

## Step 5: Scaffold and Wire Test Site

**5a — Copy base-template**

```bash
cp -r sites/base-template sites/$THEME_NAME-test
rm -rf sites/$THEME_NAME-test/node_modules sites/$THEME_NAME-test/.next sites/$THEME_NAME-test/.turbo
```

**5b — Write marker file**

Write `sites/$THEME_NAME-test/.pipeline-test-site.json`:
```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "$THEME_NAME",
  "sourceUrl": "stitch:<PROJECT_ID>",
  "pipelineOutput": "output/ingestion/$THEME_NAME-stitch/"
}
```

**5c — Rewrite theme.config.ts**

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { <camelCaseThemeName>Registry, <camelCaseThemeName>DefaultConfig } from '@platform/themes/<theme-name>';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: <camelCaseThemeName>Registry,
  ...<camelCaseThemeName>DefaultConfig,
};
```

**5d — Rewrite app/globals.css**

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

**5e — Generate CI-inert package.json**

1. Read `sites/base-template/package.json`
2. Call `generateTestSitePackageJson('$THEME_NAME-test', basePackageJson)` from `tools/lib/test-site-package.ts`
3. Write the result to `sites/$THEME_NAME-test/package.json`

**Verification gate — STOP if this fails:**
```bash
node -e "
  const p = require('./sites/$THEME_NAME-test/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: CI scripts present:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**5f — Update site.config.ts tagline**

Update the `tagline` field to:
```
Pipeline Test Site — $THEME_NAME theme (Stitch)
```

**5g — Rewrite app/layout.tsx as bare shell**

The test site uses base-template pages wired to the new theme. Do NOT attempt to convert Stitch HTML to TSX — this is out of scope for v1.

```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { <camelCaseThemeName>Registry } from '@platform/themes/<theme-name>';
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
        <ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
          {children}
          <ReviewPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Step 6: Lockfile and Type-check

**6a — Update lockfile**

```bash
pnpm install --lockfile-only
```

If that fails:
```bash
pnpm install
```

**6b — Verify lockfile is valid**

```bash
pnpm install --frozen-lockfile
```

**6c — Type-check test site** (report errors but do not block)

```bash
cd sites/$THEME_NAME-test && npx tsc --noEmit
```

Report any errors to the user without stopping.

**6d — Stage all changes**

```bash
git add sites/$THEME_NAME-test/ packages/themes/$THEME_NAME/ packages/theme-system/src/types.ts pnpm-lock.yaml
```

---

## Step 7: Report

Output this summary to the user:

```
✓ Theme assigned:   $THEME_NAME  (constellation namespace)
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
  2. Inspect meta/token-mapping-report.json — verify colour extraction looks correct
  3. Start dev server and confirm theme tokens resolve
  4. When satisfied: /deploy.changes
```

---

## Rules

- This command does NOT commit or push anything
- Never modifies `sites/base-template/` — only the copy
- If any step fails, STOP and report — do not create a partial theme or test site
