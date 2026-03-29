# YOLO Implementation Brief: Stitch-Derived TSX Pages for Pipeline Test Sites

**Branch:** develop (no new branch — this updates lyra-test in place, then updates the pipeline skill)
**Session spec:** output/sessions/2026-03-29_stitch-tsx-pages/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `pipeline.stitch-design` pipeline creates a test site (`sites/$THEME_NAME-test`) as a quality check. The intent: if the test site looks like the Stitch design, the theme extraction worked correctly. Currently the test site shows base-template placeholder pages — wrong content, wrong layout, no Stitch imagery. The previous attempt served the raw Stitch HTML as static files, but Next.js doesn't apply the Tailwind CDN in static-served files so they render unstyled.

The correct approach: replace the 5 placeholder pages with **self-contained TSX server components** that replicate the Stitch design section-by-section, using our theme tokens for colors, the local images already downloaded at `/stitch-images/img-NNN.jpg`, and Newsreader/Work Sans fonts matching what Stitch generated.

**Two deliverables:**
1. Fix `sites/lyra-test` right now — the already-generated test site from the earlier pipeline run
2. Update `.claude/commands/pipeline.stitch-design.md` so future pipeline runs generate TSX pages automatically (replacing the current Step 5g which says "do NOT attempt to convert Stitch HTML to TSX")

**Inputs already present:**
- Stitch HTML reference files: `output/ingestion/lyra-stitch/html/{home,about,contact,services,service-detail}.html`
- Local images: `sites/lyra-test/public/stitch-images/img-001.jpg` through `img-025.jpg` (25 images)
- Image manifest: `output/ingestion/lyra-stitch/meta/image-manifest.json`
- Theme already wired: `sites/lyra-test/theme.config.ts` uses `lyraRegistry` and `lyraDefaultConfig`

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Deep multi-file reasoning, writing multiple full TSX pages in one pass |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, pipeline skill update |
| Haiku | `haiku` | $0.80 / $4 | Mechanical tasks: verification, grep checks, type-check |

Default orchestrator: **sonnet**. Page generation (Phase 1) uses **opus** — 5 full TSX pages with careful color mapping is exactly the multi-file reasoning scenario worth the cost.

---

## Pre-flight

```bash
git branch --show-current
# Must output: develop
```

```bash
ls sites/lyra-test/public/stitch-images/ | wc -l
# Must be 25
ls output/ingestion/lyra-stitch/html/
# Must show: home.html about.html contact.html services.html service-detail.html
```

If any check fails, STOP and report. Do not proceed with missing inputs.

---

## Implementation Rules (apply to ALL TSX pages in Phase 1)

**No platform imports.** No `@platform/core-components`, no `siteConfig`, no `getContentItems`. These are self-contained Stitch-derived server components.

**Only allowed import:** `import type { Metadata } from 'next';` (include only if needed for a metadata export)

**Links:** `<a href="...">` — not Next.js `<Link>`

**Images:** `<img src="/stitch-images/img-NNN.jpg" alt="..." className="..." />` — not `next/image`

**Icons:** `<span className="material-symbols-outlined">icon_name</span>`. Filled icons: add `style={{ fontVariationSettings: "'FILL' 1" }}`

**Server Components only.** No `'use client'`, no `useState`, no click handlers.

**FAQ accordion:** HTML `<details>`/`<summary>` with Tailwind `group-open:rotate-180` on the chevron — no JS required.

**Nav clearance:** Every page body needs `pt-16` or `pt-20` after the fixed nav.

**Form fields:** Static HTML only — no `action`, no submission handler. Visual comparison only.

---

## Color Token Mapping (Stitch MD3 → lyra-test Tailwind tokens)

Read from `sites/lyra-test/tailwind.config.ts` — available tokens are:
`bg-brand-primary` (#163526), `bg-brand-secondary` (#77574d), `bg-brand-accent` (#f8bd2a),
`bg-surface-background` (#fbf9f5), `bg-surface-muted` (#f5f3ef), `bg-surface-card` (#ffffff),
`text-surface-foreground` (#1b1c1a), `border-surface-border` (#c2c8c1),
`text-on-brand-primary` (#ffffff), `bg-brand-primary-hover` (#132f21)

**Full mapping — use this exactly:**

| Stitch class | Use this |
|---|---|
| `bg-primary` / `text-primary` | `bg-brand-primary` / `text-brand-primary` |
| `bg-primary-container` | `bg-[#2d4c3b]` |
| `bg-primary-fixed` / `text-primary-fixed` | `bg-[#c7ebd4]` / `text-[#c7ebd4]` |
| `bg-primary-fixed-dim` / `text-primary-fixed-dim` | `bg-[#accfb8]` / `text-[#accfb8]` |
| `text-on-primary-container` | `text-[#99bca6]` |
| `text-on-primary-fixed` | `text-[#012113]` |
| `bg-secondary` / `text-secondary` | `bg-brand-secondary` / `text-brand-secondary` |
| `bg-tertiary-fixed-dim` / `text-tertiary-fixed-dim` | `bg-brand-accent` / `text-brand-accent` |
| `text-on-tertiary-fixed` | `text-[#261a00]` |
| `bg-surface` / `bg-background` | `bg-surface-background` |
| `bg-surface-container-low` | `bg-surface-muted` |
| `bg-surface-container` | `bg-[#efeeea]` |
| `bg-surface-container-high` | `bg-[#eae8e4]` |
| `bg-surface-container-highest` | `bg-[#e4e2de]` |
| `bg-surface-container-lowest` | `bg-surface-card` |
| `text-on-surface` | `text-surface-foreground` |
| `text-on-surface-variant` | `text-[#424843]` |
| `text-outline` | `text-[#727973]` |
| `border-outline-variant` | `border-surface-border` |
| `text-on-primary` | `text-white` |
| Hardcoded `text-[#163526]` | `text-brand-primary` |
| Hardcoded `bg-[#163526]` | `bg-brand-primary` |
| Hardcoded `text-[#77574d]` | `text-brand-secondary` |
| Hardcoded `bg-[#fbf9f5]` | `bg-surface-background` |
| Hardcoded `text-[#1b1c1a]` | `text-surface-foreground` |

For any Stitch color not in this table: use Tailwind arbitrary syntax `bg-[#hexvalue]`.

---

## Shared Inline Patterns

These are **inlined** into every page file — no shared component file.

### Nav (all pages)
Fixed, `bg-surface-background/80 backdrop-blur-md shadow-sm z-50`, max-w-7xl centered.
Left: "Smith & Sons" in `text-brand-primary font-bold text-2xl` with Newsreader font.
Right (desktop): links to Home / Services / About / Contact + "Get a Quote" button (`bg-brand-primary text-white px-6 py-2 rounded-lg`).
Mobile: `material-symbols-outlined` hamburger icon (no toggle needed — visual only).
Active page link gets `text-brand-primary font-semibold`.

### Footer (all pages)
`bg-[#efeeea]`, 3-column grid: Brand+tagline | Nav links | Contact+CTA.
Content: Smith & Sons, 12 Oak Lane Surrey GU21, enquiries@smithandsons.co.uk.
Copyright line at bottom.

---

## Phase 1: Generate TSX Pages for lyra-test

**Model:** opus — 5 full TSX files with careful color translation from Stitch HTML

Read each source HTML file before writing its corresponding TSX. The HTML is the source of truth for sections, content, and layout. Do NOT invent sections that aren't in the HTML.

### 1a. Update `sites/lyra-test/app/layout.tsx`

Add a `<head>` element inside `<html lang="en-GB">` (before `<body>`) with Google Fonts:

```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Work+Sans:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet"
  />
</head>
```

### 1b. Update `sites/lyra-test/app/globals.css`

Extend the existing `@layer base` block:

```css
body {
  font-family: 'Work Sans', sans-serif;
}
h1, h2, h3, h4 {
  font-family: 'Newsreader', serif;
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
```

### 1c. Write `sites/lyra-test/app/page.tsx` — Home

Read `output/ingestion/lyra-stitch/html/home.html` in full before writing.

Sections to replicate from home.html:
1. **Nav** (inline pattern, no active link)
2. **Hero** — `<header className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden">`
   - Absolute background: gradient `from-brand-primary to-[#2d4c3b]` + `img-020.jpg` with `mix-blend-overlay object-cover`
   - `lg:grid-cols-12` content grid (relative z-10):
     - Left (7 cols): `bg-brand-accent text-[#261a00]` "Now Booking for Spring Maintenance" badge, white serif h1 with `text-[#c7ebd4]` span for "British Landscapes.", `text-[#c7ebd4] opacity-90` body text, two CTA buttons
     - Right (5 cols, hidden mobile): rotated `aspect-[4/5]` image card with `img-002.jpg`; floating review card overlay (`bg-[#efeeea]`) with 5 filled gold stars + italic quote text
3. **Stats bar** — `bg-[#efeeea] py-12`, 3-col grid. Icons: `history` / `sentiment_satisfied` / `calendar_today`. Stats: "15+ Years In Business", "500+ Happy Customers", "Daily Garden Maintenance". Icon containers: `bg-brand-primary/10 p-4 rounded-full`. Stat numbers: `text-3xl font-bold text-brand-primary` Newsreader
4. **Services Overview** — `bg-surface-background py-24`, 4-col card grid. Each card: `bg-surface-muted rounded-xl overflow-hidden`, `aspect-video` image, `p-8` content with `text-brand-primary` h3, `text-[#424843]` description, "Details" text link with `chevron_right` icon. Cards: img-001 (Lawn Mowing), img-025 (Hedge Trimming), img-011 (Garden Clearance), img-007 (Seasonal Planting)
5. **Testimonials** — `bg-[#efeeea] py-24`, centered h2 with yellow `w-24 h-1 bg-brand-accent` divider, 2-col grid. Each card: `bg-surface-background p-10 rounded-xl shadow-sm border border-surface-border/10`, decorative `format_quote` icon (`text-brand-primary/10`), 5 filled gold stars, serif italic blockquote in `text-brand-primary`, `w-12 h-12 rounded-full bg-[#2d4c3b]` avatar with initials
6. **CTA band** — `bg-brand-primary py-24`, `park` icon large decorative, centered white h2, `text-[#accfb8]` body, two buttons: accent bg dark text + `border-[#c7ebd4]/30 text-white backdrop-blur-sm`
7. **Footer** (inline pattern)

### 1d. Write `sites/lyra-test/app/about/page.tsx` — About

Read `output/ingestion/lyra-stitch/html/about.html` in full before writing.

Sections:
1. **Nav** (active: About)
2. **Hero** — `relative h-[600px] flex items-center overflow-hidden`. Full-bleed `img-024.jpg`. Gradient overlay via inline style `background: linear-gradient(145deg, rgba(22,53,38,0.9) 0%, rgba(45,76,59,0.7) 100%)`. White text: small uppercase `text-[#accfb8]` label, italic serif h1 at `text-5xl md:text-7xl font-bold`, `text-[#99bca6]` body text. Yellow "Est. 2005" badge `bg-brand-accent text-[#261a00]`
3. **Our Story** — `py-24 bg-surface-background`, `lg:grid-cols-12`: 7-col text with serif h2, `text-[#424843]` paragraphs, italic pull-quote with `border-l-4 border-[#e7bdb1] pl-8`; 5-col image `img-003.jpg` in `rounded-xl overflow-hidden` with green badge overlay
4. **Values** — `py-24 bg-surface-muted`, centered h2, 3-col grid. Cards: `bg-surface-background p-8 rounded-xl group hover:bg-[#2d4c3b] transition-colors`. Icon circle: `bg-[#c7ebd4] p-4 rounded-full group-hover:bg-brand-accent`. Icons: `temp_preferences_eco` / `handshake` / `search_insights`. h3 in `text-brand-primary group-hover:text-white`, description in `text-[#424843] group-hover:text-[#accfb8]`
5. **Trust signals** — `py-16 bg-white`, centered, 4 items inline. Each: icon in `text-brand-secondary`, bold text in `text-brand-primary`. Items: RHS Affiliated Member, Fully Insured, 5-Star Rated, Safe Contractor
6. **Team** — `py-24 bg-surface-background`, centered h2, 4-col grid. Each member: `aspect-[3/4]` image with hover reveal overlay (`bg-brand-secondary/80 opacity-0 group-hover:opacity-100`), serif h4 name, small role text in `text-[#727973]`. Members + images: James Smith (img-023), Elena Thorne (img-014), Thomas Smith (img-016), Sarah Green (img-008)
7. **CTA** — `py-24 bg-brand-primary text-white`, centered italic serif h2, `text-[#99bca6]` body, two buttons
8. **Footer**

### 1e. Write `sites/lyra-test/app/contact/page.tsx` — Contact

Read `output/ingestion/lyra-stitch/html/contact.html` in full before writing.

Sections:
1. **Nav** (active: Contact)
2. **Page header** — `bg-surface-background py-20 px-8`, `lg:grid-cols-2`: left has yellow badge, large serif h1 `text-brand-primary`, `text-[#424843]` body; right has `img-009.jpg` in a `rounded-xl overflow-hidden grayscale-[20%]`
3. **Form + Sidebar** — `bg-surface-muted py-20 px-8`, `lg:grid-cols-12`:
   - **Form** (8 cols): white card `bg-white p-8 md:p-12 rounded-xl shadow-sm border border-surface-border/20`. Grid inputs: `grid md:grid-cols-2 gap-6` for name/email; full-width for phone + message. Input style: `w-full bg-[#e4e2de]/40 border-none focus:ring-2 focus:ring-brand-primary rounded-md py-4 px-5 text-surface-foreground`. Submit: `bg-brand-primary text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2` with `send` icon
   - **Sidebar** (4 cols): two cards stacked. Card 1 (`bg-white p-8 rounded-xl border-l-4 border-brand-primary`): 3 info rows with icon circles (`bg-[#c7ebd4] text-brand-primary`), items: Call Us (01234 567890), Our Address (12 High Street, Guildford GU1 1AA), Opening Hours (Mon–Fri 8am–6pm, Sat 8am–4pm). Card 2 (`bg-brand-secondary text-white p-8 rounded-xl`): serif h3, body text, `img-004.jpg` map placeholder with `bg-brand-primary/20 mix-blend-multiply` overlay + centered `map` icon
4. **Landscape break** — `w-full h-80 relative overflow-hidden`. `img-022.jpg` full cover + `bg-brand-primary/30 mix-blend-multiply`. Centered: italic serif h3 white text
5. **Footer** (single-row minimal variant: `bg-[#efeeea] py-6 px-8`, flex justify-between: brand name | copyright | links)

### 1f. Write `sites/lyra-test/app/services/page.tsx` — Services Listing

Read `output/ingestion/lyra-stitch/html/services.html` in full before writing.

Sections:
1. **Nav** (active: Services)
2. **Page header** — `max-w-7xl mx-auto px-6 py-12 md:py-20`: breadcrumb (`Home > Services`) in `text-[#727973] text-sm uppercase tracking-widest`; `lg:grid-cols-2`: serif h1 with italic span + `text-[#424843]` body; yellow badge with `calendar_today` icon on right
3. **Services grid** — `max-w-7xl mx-auto px-6 py-12`, 3-col grid of 6 cards. Cards alternate `bg-[#efeeea]` and `bg-surface-muted` backgrounds. Each: `aspect-[4/3]` image with hover `scale-110 transition-transform`, `text-brand-secondary` Material Symbol icon, serif h3 `text-brand-primary`, `text-[#424843]` description, "Learn more →" link in `text-brand-secondary hover:underline` pointing to `/services/lawn-mowing`
   - Row 1: img-013 + `grass` (Lawn Mowing & Edging), img-017 + `content_cut` (Hedge Trimming), img-019 + `delete_sweep` (Garden Clearance)
   - Row 2: img-021 + `local_florist` (Planting & Borders), img-015 + `cleaning_services` (Patio & Path), img-012 + `auto_awesome` (Seasonal Tidy-ups)
4. **CTA band** — `max-w-7xl mx-auto px-6 py-20`. Inner: `bg-brand-primary rounded-xl p-12 md:p-20 relative overflow-hidden`. Decorative: `potted_plant` icon at `text-[200px] text-[#2d4c3b] absolute -right-8 -bottom-8`. Left-aligned white h2 (`max-w-lg`), `text-[#accfb8]` body, two buttons: `bg-brand-accent text-[#261a00]` + `border-[#c7ebd4]/30 text-white`
5. **Footer**

### 1g. Create `sites/lyra-test/app/services/lawn-mowing/page.tsx` — Service Detail

This is a **new directory and file** creating a static route at `/services/lawn-mowing`. The existing `app/services/[slug]/page.tsx` is untouched.

Read `output/ingestion/lyra-stitch/html/service-detail.html` in full before writing.

Sections:
1. **Nav** (active: Services)
2. **Breadcrumb** — `max-w-7xl mx-auto px-6 py-4`. `text-[#727973] text-sm uppercase tracking-widest flex items-center gap-1`. Items: Home `chevron_right` Services `chevron_right` **Lawn Mowing & Edging** (bold `text-brand-primary`)
3. **Hero** — `max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center`. Left: yellow badge + bold serif h1 with italic span, `text-[#424843]` body, two buttons. Right: `h-[500px] rounded-xl overflow-hidden relative`. `img-018.jpg` full cover + gradient overlay `from-brand-primary/30 to-transparent`
4. **Service overview** — `bg-surface-muted py-20`. `max-w-7xl mx-auto px-6 lg:grid-cols-12`. Left (5 cols): serif h2, yellow `w-16 h-1 bg-brand-accent` divider, two `text-[#424843]` paragraphs. Right (6 cols): white card `bg-white p-8 md:p-12 rounded-xl shadow-sm border-l-4 border-brand-primary`. Four benefit rows, each: `text-brand-secondary` icon + bold label + description. Benefits: Regular Schedule (`calendar_month`), Professional Equipment (`construction`), Precision Edging (`format_align_center`), Green Disposal (`recycling`)
5. **Gallery** — `max-w-7xl mx-auto px-6 py-24`. Centered header: small uppercase label `text-brand-secondary` + italic serif h2. 3-col grid, `aspect-[4/5]` images with `overflow-hidden rounded-xl group`. Middle image: `md:mt-12` offset for stagger. Hover: `bg-gradient-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100`. Hover caption: italic white text. Images: img-010 ("Cotswold Estate"), img-006 ("Sussex Manor Grounds"), img-005 ("Modern Rectory Garden")
6. **FAQ accordion** — `bg-[#efeeea] py-24`. `max-w-3xl mx-auto px-6`. Centered serif h2. Three `<details className="group bg-surface-background rounded-xl p-6 shadow-sm mb-4 open:shadow-md">`:
   - `<summary className="flex justify-between items-center cursor-pointer list-none font-bold text-lg text-brand-primary">` Question text + `<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>`
   - Content div: `text-[#424843] leading-relaxed mt-4`
   - Q1: "How often should I have my lawn mowed?" — seasonal frequency, 2-week spring/summer, 4-week autumn/winter
   - Q2: "Do you bring your own equipment?" — yes, fully equipped professional-grade
   - Q3: "Can I set up a regular maintenance schedule?" — yes, weekly/fortnightly/monthly
7. **CTA panel** — `max-w-7xl mx-auto px-6 py-20`. Inner: `bg-brand-primary rounded-2xl p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center`. Decorative: `w-96 h-96 bg-[#2d4c3b] rounded-full absolute -right-24 -top-24 blur-3xl opacity-30`. White serif h2, `text-[#99bca6]` body, `bg-brand-accent text-[#261a00]` CTA button
8. **Footer** (minimal one-row variant)

### Verification gate after Phase 1

```bash
cd sites/lyra-test && npx tsc --noEmit 2>&1 | head -20
```

Report any errors. If there are import-related errors from other pages in the site (not the new files), note them but do not block — the test site pages we changed are what matters.

```bash
# Check all 5 new/updated page files exist
ls sites/lyra-test/app/page.tsx
ls sites/lyra-test/app/about/page.tsx
ls sites/lyra-test/app/contact/page.tsx
ls sites/lyra-test/app/services/page.tsx
ls sites/lyra-test/app/services/lawn-mowing/page.tsx
echo "PASS: all 5 pages present"
```

```bash
# Confirm no platform imports in the new pages
grep -l "@platform/core-components\|siteConfig\|getContentItems" \
  sites/lyra-test/app/page.tsx \
  sites/lyra-test/app/about/page.tsx \
  sites/lyra-test/app/contact/page.tsx \
  sites/lyra-test/app/services/page.tsx \
  sites/lyra-test/app/services/lawn-mowing/page.tsx 2>/dev/null \
  | wc -l
# Must output 0
```

```bash
# Confirm no next/image usage
grep -r "from 'next/image'\|from \"next/image\"" \
  sites/lyra-test/app/page.tsx \
  sites/lyra-test/app/about/page.tsx \
  sites/lyra-test/app/contact/page.tsx \
  sites/lyra-test/app/services/page.tsx \
  sites/lyra-test/app/services/lawn-mowing/page.tsx 2>/dev/null \
  | wc -l
# Must output 0
```

---

## Phase 2: Update Pipeline Skill

**Model:** sonnet

Read `.claude/commands/pipeline.stitch-design.md` in full before editing.

### 2a. Replace Step 5g

Find the section currently starting with `**5g — Rewrite app/layout.tsx as bare shell**` and replace it entirely with:

```markdown
**5g — Generate Stitch TSX Pages**

Produce five self-contained TSX server component pages that replicate the Stitch HTML designs section-by-section. These replace the base-template placeholder pages and form the visual comparison basis of the test site.

**Pre-conditions:** Images must already be downloaded to `output/ingestion/$THEME_NAME-stitch/images/` and copied to `sites/$THEME_NAME-test/public/stitch-images/`.

**Files to create/replace:**
- `sites/$THEME_NAME-test/app/layout.tsx` — bare shell with Google Fonts head links
- `sites/$THEME_NAME-test/app/globals.css` — add Work Sans / Newsreader / Material Symbols to `@layer base`
- `sites/$THEME_NAME-test/app/page.tsx` — home
- `sites/$THEME_NAME-test/app/about/page.tsx` — about
- `sites/$THEME_NAME-test/app/contact/page.tsx` — contact
- `sites/$THEME_NAME-test/app/services/page.tsx` — services listing
- `sites/$THEME_NAME-test/app/services/[first-service-slug]/page.tsx` — service detail (static route)

**Rules:**
- Read each Stitch HTML file in full before writing its TSX counterpart
- No `'use client'`, no platform imports (`@platform/core-components`, `siteConfig`, etc.)
- All content hardcoded from the Stitch HTML — do not use MDX or siteConfig
- `<img src="/stitch-images/img-NNN.jpg" alt="..." />` — not `next/image`
- `<a href="...">` — not `<Link>`
- Material Symbols: `<span className="material-symbols-outlined">icon_name</span>`. Filled: add `style={{ fontVariationSettings: "'FILL' 1" }}`
- FAQ accordions: `<details>`/`<summary>` with `group-open:rotate-180` on chevron — no JS state
- Nav and footer are inlined per page (no shared import)
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

**layout.tsx pattern:**
```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { [camelCaseThemeName]Registry } from '@platform/themes/$THEME_NAME';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
```

### 2b. Remove Step 5f2

Find and remove the "**5f2 — Build Stitch viewer**" section (the static HTML public/stitch/ approach). It is superseded by Step 5g.

### 2c. Update Step 7 report block

Replace the Dev server / Stitch pages lines with:

```
Dev server:   cd sites/$THEME_NAME-test && npm run dev
              Visit http://localhost:3000 to see Stitch-derived TSX pages

Stitch comparison: http://localhost:3000        (home)
                   http://localhost:3000/about
                   http://localhost:3000/contact
                   http://localhost:3000/services
                   http://localhost:3000/services/[first-service-slug]
```

### Verification gate after Phase 2

```bash
# Confirm old static HTML approach is gone from the skill
grep -c "public/stitch/" .claude/commands/pipeline.stitch-design.md
# Must output 0

# Confirm new TSX approach is present
grep -c "TSX" .claude/commands/pipeline.stitch-design.md
# Must be > 0

echo "PASS: pipeline skill updated"
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: 5 TSX pages + layout | opus | ~60k | ~25k | ~$2.77 |
| Phase 2: Pipeline skill update | sonnet | ~12k | ~3k | ~$0.08 |
| Verification | haiku | ~4k | ~0.5k | ~$0.005 |
| **Total** | | **~76k** | **~28.5k** | **~$2.86** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
The opus cost is the dominant line — 5 full TSX pages is substantial output. Still cheap for what it delivers.

---

## Final Report

After all phases complete, output:
1. Phases completed
2. Type-check result on lyra-test
3. Any deviations from the plan (e.g., a section present in the HTML that needed special handling)
4. Token usage and cost

Then update this session file by appending:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary]

### Key decisions
[any color mapping decisions, layout choices that differed from the HTML]
```

---

## Rules

- STOP on any failed verification gate — do not continue
- Read every HTML file before writing its TSX counterpart
- Never push — no commits needed (these are working-tree changes on develop)
- Images are already present at `sites/lyra-test/public/stitch-images/` — do NOT re-download
- Do NOT delete `public/stitch/` or `public/stitch-images/` — they may remain as reference
- Do NOT touch `sites/base-template/` or any other site
- Do NOT modify `packages/themes/lyra/` or `packages/theme-system/src/types.ts`
- Minimal changes only — the 7 files listed in Phase 1 + the pipeline skill in Phase 2
