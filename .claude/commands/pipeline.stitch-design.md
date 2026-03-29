# Pipeline Stitch Design

Generate a new theme and test site using Google Stitch as the design source.
No reference URL required — Stitch creates the design from a trade/profession description.

**Usage:**
```
/pipeline.stitch-design --trade "plumber" \
  [--name "Ricky's Plumbing"] \
  [--services "Boiler installation, Emergency repairs, Bathroom fitting"] \
  [--location "East London"] \
  [--tagline "London's most trusted plumber since 1998"] \
  [--phone "020 7946 0321"] \
  [--colors "#1a3a5c"] \
  [--secondary-color "#c47a3a"] \
  [--accent-color "#f5c842"] \
  [--headline-font "newsreader"] \
  [--body-font "work-sans"] \
  [--roundness "default"] \
  [--color-variant "fidelity"] \
  [--logo-desc "A blue shield with a wrench"]
```

**Arguments:**

| Argument | Required | Default | Description |
|---|---|---|---|
| `--trade` | ✓ | — | Business/profession type |
| `--name` | — | `Smith & Sons [Trade]` | Company name used in all content |
| `--services` | — | Generic for trade | Comma-separated list of services |
| `--location` | — | `UK` | Service area, used in content and contact details |
| `--tagline` | — | Generic | Brand tagline for hero and footer |
| `--phone` | — | `0800 XXX XXXX` | Phone number used in contact and footer |
| `--colors` | — | Stitch chooses | Primary brand colour (hex or description) |
| `--secondary-color` | — | Stitch derives | Secondary colour hex |
| `--accent-color` | — | Stitch derives | Accent/highlight colour hex |
| `--headline-font` | — | `newsreader` | Heading font — see font options below |
| `--body-font` | — | `work-sans` | Body/UI font — see font options below |
| `--roundness` | — | `default` | Corner radius: `sharp` `default` `soft` `pill` |
| `--color-variant` | — | `tonal` | Palette generation: `tonal` `fidelity` `vibrant` `expressive` `monochrome` |
| `--logo-desc` | — | — | Description of logo for design system brief |

**Font options:**
- Serif: `newsreader` `eb-garamond` `literata` `source-serif` `domine` `libre-caslon` `noto-serif`
- Sans: `work-sans` `inter` `plus-jakarta` `space-grotesk` `montserrat` `dm-sans` `manrope` `rubik` `geist` `sora`

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

Parse `$ARGUMENTS` for all supported flags. Store each as a variable:

| Flag | Variable | Default if omitted |
|---|---|---|
| `--trade` | `$TRADE` | — (required) |
| `--name` | `$COMPANY_NAME` | `Smith & Sons [Trade]` |
| `--services` | `$SERVICES_LIST` | _(leave empty — Stitch will generate appropriate services for the trade)_ |
| `--location` | `$LOCATION` | `UK` |
| `--tagline` | `$TAGLINE` | _(leave empty — generate from trade)_ |
| `--phone` | `$PHONE` | `0800 XXX XXXX` |
| `--colors` | `$PRIMARY_COLOR` | _(leave empty — Stitch chooses)_ |
| `--secondary-color` | `$SECONDARY_COLOR` | _(leave empty)_ |
| `--accent-color` | `$ACCENT_COLOR` | _(leave empty)_ |
| `--headline-font` | `$HEADLINE_FONT` | `newsreader` |
| `--body-font` | `$BODY_FONT` | `work-sans` |
| `--roundness` | `$ROUNDNESS` | `default` |
| `--color-variant` | `$COLOR_VARIANT` | `tonal` |
| `--logo-desc` | `$LOGO_DESC` | _(leave empty)_ |

Map font/roundness/color-variant args to Stitch enums:

**Font name → Stitch enum:**
`newsreader`→`NEWSREADER`, `eb-garamond`→`EB_GARAMOND`, `literata`→`LITERATA`, `source-serif`→`SOURCE_SERIF_FOUR`, `domine`→`DOMINE`, `libre-caslon`→`LIBRE_CASLON_TEXT`, `noto-serif`→`NOTO_SERIF`, `work-sans`→`WORK_SANS`, `inter`→`INTER`, `plus-jakarta`→`PLUS_JAKARTA_SANS`, `space-grotesk`→`SPACE_GROTESK`, `montserrat`→`MONTSERRAT`, `dm-sans`→`DM_SANS`, `manrope`→`MANROPE`, `rubik`→`RUBIK`, `geist`→`GEIST`, `sora`→`SORA`

**Roundness → Stitch enum:** `sharp`→`ROUND_FOUR`, `default`→`ROUND_EIGHT`, `soft`→`ROUND_TWELVE`, `pill`→`ROUND_FULL`

**Color variant → Stitch enum:** `tonal`→`TONAL_SPOT`, `fidelity`→`FIDELITY`, `vibrant`→`VIBRANT`, `expressive`→`EXPRESSIVE`, `monochrome`→`MONOCHROME`, `neutral`→`NEUTRAL`

If `--trade` is missing, STOP with:
```
Usage: /pipeline.stitch-design --trade "electrical contractor" [options]

--trade is required. It describes the business type used to prompt Stitch.
Run /pipeline.stitch-design with no arguments to see all options.
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

## Step 2: Create Stitch Project, Design System, and Generate Pages

**2a — Create project**

Call Stitch MCP `create_project` with human-readable name:
```
<ThemeNameTitleCase> <Trade> Website
```
Examples:
- theme `lyra` + trade `electrical contractor` → `Lyra Electrical Contractor Website`
- theme `nova` + trade `plumber` → `Nova Plumber Website`

Store the returned project ID as `$PROJECT_ID`.

**2b — Create design system**

Call Stitch MCP `create_design_system` with `projectId: $PROJECT_ID` and these fields:

```
displayName: "$THEME_NAME Design System"
theme:
  headlineFont: <$HEADLINE_FONT enum>       # e.g. NEWSREADER
  bodyFont: <$BODY_FONT enum>               # e.g. WORK_SANS
  customColor: <primary hex>                # from $PRIMARY_COLOR if provided, else omit
  overrideSecondaryColor: <hex>             # from $SECONDARY_COLOR if provided, else omit
  overrideTertiaryColor: <hex>              # from $ACCENT_COLOR if provided, else omit
  colorMode: LIGHT
  colorVariant: <$COLOR_VARIANT enum>       # e.g. TONAL_SPOT
  roundness: <$ROUNDNESS enum>              # e.g. ROUND_EIGHT
  designMd: <constructed below>
```

**Construct `designMd`** from available args — include only the lines for which args were provided:

```markdown
# Brand Identity

Company: $COMPANY_NAME
Trade: $TRADE
[If $LOCATION provided:] Location: $LOCATION
[If $TAGLINE provided:] Tagline: $TAGLINE
[If $LOGO_DESC provided:] Logo: $LOGO_DESC

# Design Principles

- Trustworthy, local, and conversion-focused — not generic SaaS
- Mobile-first layout, clean navigation, prominent CTA buttons
- Consistent spacing rhythm and component language across all pages

# Content

[If $SERVICES_LIST provided:] Services offered: $SERVICES_LIST
[If $PHONE provided:] Phone: $PHONE
```

Store the returned design system asset ID as `$DESIGN_SYSTEM_ID`.

**2c — Generate exactly 5 screens**

Generate the home page first, then use it as the explicit visual reference for all subsequent pages.

**2c-i — Generate home screen**

Submit the home generation request, substituting all `$VARIABLES` with their parsed values:

```
Home page for "$COMPANY_NAME" — a professional $LOCATION $TRADE business.
[If $TAGLINE:] Brand tagline: "$TAGLINE"
[If $SERVICES_LIST:] Services: $SERVICES_LIST
[If $PHONE:] Phone: $PHONE

Sections:
- Fixed navigation bar: company name in headline font (brand primary colour), nav links (Services / About / Contact), prominent "Get a Quote" CTA button
- Hero: full-bleed image with gradient overlay, large serif heading, subheading, two CTA buttons, optional floating review/stats card
- Stats bar: 3 stats with Material Symbols icons, brand-primary accent numbers
- Services overview: 3–4 cards with image, icon, heading, description, "Details" link
  [If $SERVICES_LIST:] Use these services: $SERVICES_LIST
- Testimonials: 2-column card grid, quote icon, star rating, italic blockquote, avatar with initials
- CTA band: full-bleed brand-primary background, decorative icon, heading, body, two buttons
- Footer: 3-column grid — brand+tagline, navigation links, contact details (phone, address)
  [If $TAGLINE:] Use "$TAGLINE" as the brand description in the footer
  [If $PHONE:] Use $PHONE in the footer contact column
```

Store the returned screen ID as `$HOME_SCREEN_ID`.

**2c-ii — Generate remaining 4 screens**

For each of the 4 remaining screens, prepend the following consistency instruction (substituting variables):

```
This is a page for the same website as the home page (screen ID: $HOME_SCREEN_ID).

Company: "$COMPANY_NAME" — a $TRADE business[If $LOCATION:] in $LOCATION]
[If $PHONE:] Phone: $PHONE

MATCH THE HOME PAGE EXACTLY for:
- Navigation bar: identical component — same font, same layout, same button style
- Footer: identical component — same 3-column structure, same content areas
- Typography: same heading font and body font as the home page — do not change font choices
- Hero section style: if this page has a hero, use the same font weight, overlay treatment, and badge style as the home page hero
- Button styles: same border-radius, same padding, same font weight as home page buttons
- Colour usage: same semantic colour assignments as the home page

Page-specific content:
```

Then append the page-specific sections:

| Screen | Slug | Page-specific sections |
|--------|------|----------------------|
| About | `about` | Company story with founding year[If $LOCATION: and $LOCATION roots], pull-quote, team grid (4 members with hover reveal), values cards (3, icon + hover colour change), trust/accreditations bar (4 items, grayscale→colour on hover), CTA band |
| Contact | `contact` | Page header with hero image, contact form (name/email/phone/message), contact info sidebar ([If $PHONE: $PHONE /] address / hours), map image placeholder, landscape image break |
| Services | `services` | Breadcrumb, page header, 6-card service grid (icon + image + description + "Learn more" link)[If $SERVICES_LIST: using these services: $SERVICES_LIST], CTA band with decorative icon |
| Service Detail | `service-detail` | Breadcrumb, hero for [first service from $SERVICES_LIST or "primary service"], description + benefits card (4 benefits with icons), 3-image staggered gallery with hover captions, FAQ accordion (3 questions), CTA panel |

After submitting all 5 screens, call `list_screens` for `$PROJECT_ID` and confirm exactly 5 exist. If any failed, STOP and report which screen(s) failed.

```bash
# Verification gate — STOP if this fails
# Confirm list_screens returns exactly 5 screens for $PROJECT_ID
```

**2d — Apply design system to all screens**

Call `get_project` for `$PROJECT_ID` to retrieve screen instance IDs. Then call `apply_design_system` with:
- `projectId: $PROJECT_ID`
- `assetId: $DESIGN_SYSTEM_ID`
- `selectedScreenInstances`: all screen instances from the project

This enforces fonts, colours, and roundness across any screens that drifted during generation.

---

## Step 3: Download Design Assets

Create output folders:
```bash
mkdir -p output/ingestion/$THEME_NAME-stitch/design-system
mkdir -p output/ingestion/$THEME_NAME-stitch/html
mkdir -p output/ingestion/$THEME_NAME-stitch/images
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

**3b — Download images**

After all HTML files are written, extract and download all AI-generated images:

1. Parse all 5 HTML files for every unique `https://lh3.googleusercontent.com/` URL in `src="..."` attributes
2. Download each to `output/ingestion/$THEME_NAME-stitch/images/img-NNN.jpg` (sequential, zero-padded to 3 digits)
3. Write `output/ingestion/$THEME_NAME-stitch/meta/image-manifest.json`:
   ```json
   { "img-001.jpg": "<original-url>", "img-002.jpg": "<original-url>" }
   ```

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
ls output/ingestion/$THEME_NAME-stitch/meta/image-manifest.json
# All 9 files must exist and be non-empty
ls output/ingestion/$THEME_NAME-stitch/images/ | grep -c img
# Must be > 0
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

**5g — Generate Stitch TSX Pages**

Produce five self-contained TSX server component pages that replicate the Stitch HTML designs section-by-section. These replace the base-template placeholder pages and form the visual comparison basis of the test site.

**Pre-conditions:** Images must already be downloaded to `output/ingestion/$THEME_NAME-stitch/images/` and copied to `sites/$THEME_NAME-test/public/stitch-images/`.

**First — copy images to test site:**
```bash
mkdir -p sites/$THEME_NAME-test/public/stitch-images
cp output/ingestion/$THEME_NAME-stitch/images/img-*.jpg sites/$THEME_NAME-test/public/stitch-images/
ls sites/$THEME_NAME-test/public/stitch-images/ | wc -l
# Must match image count from output/ingestion/$THEME_NAME-stitch/images/
```

**Files to create/replace:**
- `sites/$THEME_NAME-test/app/layout.tsx` — keep ThemeProvider structure; no `<head>` font tags (fonts load via globals.css @import)
- `sites/$THEME_NAME-test/app/globals.css` — rewrite to add Google Fonts `@import` at the top before `@tailwind` directives
- `sites/$THEME_NAME-test/app/page.tsx` — home
- `sites/$THEME_NAME-test/app/about/page.tsx` — about
- `sites/$THEME_NAME-test/app/contact/page.tsx` — contact
- `sites/$THEME_NAME-test/app/services/page.tsx` — services listing
- `sites/$THEME_NAME-test/app/services/[first-service-slug]/page.tsx` — service detail (static route, not dynamic)

**Rules:**
- Read each Stitch HTML file in full before writing its TSX counterpart — the HTML is source of truth for sections, content, and layout
- No `'use client'`, no platform imports (`@platform/core-components`, `siteConfig`, etc.)
- All content hardcoded from the Stitch HTML — do not use MDX or siteConfig
- `<img src="/stitch-images/img-NNN.jpg" alt="..." />` — not `next/image`
- `<a href="...">` — not `<Link>`
- Material Symbols: `<span className="material-symbols-outlined">icon_name</span>`. Filled: add `style={{ fontVariationSettings: "'FILL' 1" }}`
- FAQ accordions: `<details>`/`<summary>` with `group-open:rotate-180` on chevron — no JS state
- Nav and footer are inlined per page (no shared import)
- **Opacity modifiers on theme tokens don't work:** Tailwind's `/opacity` modifier (e.g. `bg-surface-background/80`) renders transparent when the color comes from a CSS custom property. Always use hardcoded hex with opacity instead: `bg-[#fbf9f5]/80`, `bg-[#163526]/30` etc. This applies everywhere — navs, overlays, decorative elements.
- **CSS fidelity:** Copy ALL CSS classes from each Stitch HTML element faithfully. Do not omit or simplify hover effects, transition durations (`duration-500`, `duration-700`), grayscale filters (`grayscale-[20%]`), scale transforms (`scale-105`), opacity values, or micro-interactions. If the Stitch HTML has it, the TSX must have it.
- Translate all Stitch MD3 color tokens to theme token classes using the canonical color map:

| Stitch token | Theme token |
|---|---|
| `primary` | `brand-primary` |
| `secondary` | `brand-secondary` |
| `tertiary-fixed-dim` | `brand-accent` |
| `surface` / `background` | `surface-background` |
| `surface-container-low` | `surface-muted` |
| `on-surface` | `surface-foreground` |
| `outline-variant` | `surface-border` |
| Unmapped colors | Tailwind arbitrary `bg-[#hexvalue]` |

**layout.tsx pattern** — Newsreader and Work Sans via `next/font/google` (Turbopack-native). Material Symbols via `<link>` in `<head>` (server-rendered, not processed by Turbopack CSS bundler — `Material_Symbols_Outlined` is not available in next/font/google):
```tsx
import type { Metadata, Viewport } from 'next';
import { Newsreader, Work_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { [camelCaseThemeName]Registry } from '@platform/themes/$THEME_NAME';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${newsreader.variable} ${workSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="$THEME_NAME" registry={[camelCaseThemeName]Registry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**globals.css pattern** — uses CSS variables from next/font, no `@import url()`:
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
    font-family: var(--font-work-sans), sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-newsreader), serif;
  }
  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    font-feature-settings: 'liga';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
  }
}
```

**Patch next.config.ts CSP** — the base-template CSP blocks Google Fonts. Update `sites/$THEME_NAME-test/next.config.ts`:

Find the `Content-Security-Policy` value and change:
```
style-src 'self' 'unsafe-inline'; font-src 'self';
```
To:
```
style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;
```

**Verification gate:**
```bash
ls sites/$THEME_NAME-test/app/{page.tsx,about/page.tsx,contact/page.tsx,services/page.tsx} | wc -l
# Must be 4
grep -l "@platform/core-components\|siteConfig\|getContentItems" \
  sites/$THEME_NAME-test/app/page.tsx \
  sites/$THEME_NAME-test/app/about/page.tsx \
  sites/$THEME_NAME-test/app/contact/page.tsx \
  sites/$THEME_NAME-test/app/services/page.tsx 2>/dev/null | wc -l
# Must be 0
```

---

## Step 5h: Stitch Fidelity Review + Fix

After TSX pages are generated, start the dev server, compare each rendered page against its Stitch HTML source, then apply fixes. Fully autonomous — no pause for approval.

**5h-i — Start dev server**

```bash
cd sites/$THEME_NAME-test && npm install --silent
```

Then start the dev server in the background and capture the port:
```bash
npm run dev > /tmp/$THEME_NAME-dev.log 2>&1 &
DEV_PID=$!
```

Poll until ready (max 30 seconds):
```bash
for i in 2 3 4 5 6 10; do
  sleep $i
  if grep -q "Local:" /tmp/$THEME_NAME-dev.log 2>/dev/null; then break; fi
done
DEV_PORT=$(grep -o "localhost:[0-9]*" /tmp/$THEME_NAME-dev.log | head -1 | cut -d: -f2)
DEV_PORT=${DEV_PORT:-3000}
echo "Dev server on port $DEV_PORT"
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:$DEV_PORT
```

If HTTP status is not 200, STOP: "Dev server failed to start. Check /tmp/$THEME_NAME-dev.log"

**5h-ii — Review agent (model: sonnet)**

Launch a review agent with the following task:

> Compare each of the 5 rendered pages against its Stitch HTML source. For each difference, write a structured finding.
>
> Pages to compare (substitute actual port for $DEV_PORT):
> - Fetch http://localhost:$DEV_PORT/ → compare against `output/ingestion/$THEME_NAME-stitch/html/home.html`
> - Fetch http://localhost:$DEV_PORT/about → compare against `output/ingestion/$THEME_NAME-stitch/html/about.html`
> - Fetch http://localhost:$DEV_PORT/contact → compare against `output/ingestion/$THEME_NAME-stitch/html/contact.html`
> - Fetch http://localhost:$DEV_PORT/services → compare against `output/ingestion/$THEME_NAME-stitch/html/services.html`
> - Fetch http://localhost:$DEV_PORT/services/[first-service-slug] → compare against `output/ingestion/$THEME_NAME-stitch/html/service-detail.html`
>
> Also read each corresponding TSX file so you can identify where to apply fixes.
>
> For each difference, produce one entry. Write all findings to `output/ingestion/$THEME_NAME-stitch/meta/tsx-review-findings.json`:
> ```json
> [
>   {
>     "id": "H001",
>     "page": "home",
>     "section": "stats-bar",
>     "type": "blocker|visual|minor",
>     "description": "Human-readable description of the difference",
>     "stitch_value": "The class/value/element in the Stitch HTML",
>     "tsx_value": "What the TSX currently has (or 'missing')",
>     "fix_file": "sites/$THEME_NAME-test/app/page.tsx"
>   }
> ]
> ```
>
> Severity definitions:
> - `blocker` — visible breakage: font not loading, missing whole section, broken layout
> - `visual` — CSS detail absent: hover effect, transition duration, grayscale filter, scale transform, animation
> - `minor` — copy difference, color token variant, minor structural deviation
>
> **Do NOT flag as findings:**
> - Form fields being `readOnly` (static visual comparison — intentional)
> - Local `/stitch-images/` paths instead of Google URLs (intentional — images are localised)
> - Simplified footers on contact and service-detail pages (brief-specified minimal footer)
> - Any difference that is explicitly required by the TSX generation rules (e.g. `<a>` not `<Link>`)

**5h-iii — Fix agent (model: sonnet)**

Launch a fix agent with the following task:

> Read `output/ingestion/$THEME_NAME-stitch/meta/tsx-review-findings.json`.
>
> Apply fixes in severity order: blockers first, then visual, then minor.
>
> For each finding:
> 1. Read the `fix_file`
> 2. Apply the minimal change needed to resolve the difference
> 3. After editing each file, run: `cd sites/$THEME_NAME-test && npx tsc --noEmit 2>&1 | head -10`
> 4. If type-check produces new errors, revert the last change and mark the finding as `skipped`
>
> Write a fix log to `output/ingestion/$THEME_NAME-stitch/meta/tsx-fix-log.json`:
> ```json
> [
>   { "id": "H001", "status": "fixed", "description": "Added @import for Google Fonts in globals.css" },
>   { "id": "H002", "status": "skipped", "reason": "Would require client component" }
> ]
> ```
>
> Do not commit anything. Report: total findings, fixed count, skipped count, any blockers that could not be resolved.

**5h-iv — Console QA (Playwright)**

With the dev server still running, use Playwright to visit each page and capture browser console output. This catches 400 image errors, missing `sizes` warnings, broken imports, and any JS exceptions that visual inspection misses.

```bash
cd sites/$THEME_NAME-test
npx playwright test --config=../../playwright.console-qa.config.ts 2>/dev/null || \
npx playwright chromium 2>/dev/null || true
```

If Playwright is not available, use this Node script instead:

```bash
node - <<'EOF'
const http = require('http');
const pages = ['/', '/about', '/contact', '/services', '/services/${FIRST_SERVICE_SLUG}'];
let allClean = true;
(async () => {
  for (const path of pages) {
    await new Promise(r => {
      http.get(`http://localhost:${DEV_PORT}${path}`, res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`FAIL ${path} → HTTP ${res.statusCode}`);
            allClean = false;
          } else {
            console.log(`OK   ${path} → 200`);
          }
          r();
        });
      }).on('error', e => { console.error(`FAIL ${path} → ${e.message}`); allClean = false; r(); });
    });
  }
  process.exit(allClean ? 0 : 1);
})();
EOF
```

**Then** run a targeted Playwright console check for image and JS errors using a one-shot script:

```bash
npx playwright@latest --yes launch --browser chromium - <<'PWEOF' 2>/dev/null || echo "playwright unavailable — skip"
// Requires: npx playwright install chromium
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const PAGES = [
    '/', '/about', '/contact', '/services',
    '/services/${FIRST_SERVICE_SLUG}'
  ];
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push({ url: page.url(), text: msg.text() });
  });
  page.on('response', res => {
    if (res.status() >= 400) errors.push({ url: page.url(), resource: res.url(), status: res.status() });
  });
  for (const p of PAGES) {
    await page.goto('http://localhost:${DEV_PORT}' + p, { waitUntil: 'networkidle' });
  }
  await browser.close();
  if (errors.length) {
    console.error('Console/network errors found:');
    errors.forEach(e => console.error(JSON.stringify(e)));
    process.exit(1);
  } else {
    console.log('All pages clean — no console errors or 4xx resources.');
  }
})();
PWEOF
```

**Interpret results and fix before proceeding:**

| Error pattern | Likely cause | Fix |
|---|---|---|
| `400` on `/_next/image?url=...` | `fill` image missing `sizes` prop, or parent not `position: relative` | Add `sizes="..."` and `relative` to parent |
| `404` on `/stitch-images/img-NNN.jpg` | Image not copied to `public/stitch-images/` | Copy from `output/ingestion/$THEME_NAME-stitch/images/` |
| `Module not found` in console | Missing import or wrong path | Fix import |
| `Warning: Each child in a list should have a unique "key"` | Missing `key` prop on mapped elements | Add `key` |
| `hydration` error | Server/client HTML mismatch | Remove conditional client-only logic from Server Components |

If any `blocker`-level errors are found (400s, 404s, JS exceptions), fix them before moving to Step 6. Add fixes to `tsx-fix-log.json` with `"source": "console-qa"`.

**5h-v — Kill dev server**

```bash
kill $DEV_PID 2>/dev/null || true
rm -f /tmp/$THEME_NAME-dev.log
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
✓ Design system:    $DESIGN_SYSTEM_ID
    headline font:  $HEADLINE_FONT  |  body font: $BODY_FONT
    primary colour: $PRIMARY_COLOR  |  roundness: $ROUNDNESS  |  variant: $COLOR_VARIANT
✓ Company:          $COMPANY_NAME ($TRADE[, $LOCATION if set])
✓ Design assets:    output/ingestion/$THEME_NAME-stitch/
    html/           — 5 page exports (home, about, contact, services, service-detail)
    design-system/  — tokens.json
    meta/           — project.json, screens.json, token-mapping-report.json, image-manifest.json,
                      tsx-review-findings.json, tsx-fix-log.json
    images/         — downloaded AI-generated images
✓ Theme package:    packages/themes/$THEME_NAME/
✓ Test site:        sites/$THEME_NAME-test/
✓ THEME_NAMES:      updated in packages/theme-system/src/types.ts

Dev server:   cd sites/$THEME_NAME-test && npm run dev
              Visit http://localhost:3000 to see Stitch-derived TSX pages

Stitch comparison: http://localhost:3000        (home)
                   http://localhost:3000/about
                   http://localhost:3000/contact
                   http://localhost:3000/services
                   http://localhost:3000/services/[first-service-slug]
Cleanup:      /pipeline.kill-site $THEME_NAME-test   (removes test site)
              /pipeline.kill-theme $THEME_NAME        (removes theme package)

Next steps:
  1. Open Stitch project to review and iterate designs visually
  2. Inspect meta/token-mapping-report.json — verify colour extraction looks correct
  3. Review tsx-review-findings.json and tsx-fix-log.json to see what the fidelity pass caught
  4. Start dev server (npm run dev) and visit the 5 Stitch-derived TSX pages above
  5. When satisfied: /deploy.changes
```

---

## Rules

- This command does NOT commit or push anything
- Never modifies `sites/base-template/` — only the copy
- If any step fails, STOP and report — do not create a partial theme or test site
