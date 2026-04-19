# YOLO Implementation Brief: Component Catalog and UI Library

**Branch:** feature/component-catalog-and-ui-library (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The platform is adopting config-driven site generation with composable section components. Before expanding the catalog, we need: (1) a definitive master catalog documenting every section type a local service business site needs — including Header, Footer, TextSection, and 6 gap components — with all fields, slots, layout params, animation config, and interaction states; (2) a live Next.js UI library route rendering all 7 existing composable components with realistic sample data and a client-side field-label toggle. The synthesis was reviewed and approved via dual-model peer review (Claude + Codex independently converged on key decisions). Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/component-catalog-and-ui-library
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Read Existing Component Source Files

**Goal:** Read all 7 existing composable component files, the current catalog, and the PoC site data to have precise field names and slot names before writing the catalog or UI library.
**Model:** haiku — read-only, no editing

Read these files in full (launch all reads in a single message):

- `packages/core-components/src/components/composable/hero-section.tsx`
- `packages/core-components/src/components/composable/service-cards.tsx`
- `packages/core-components/src/components/composable/feature-grid.tsx`
- `packages/core-components/src/components/composable/testimonial-grid.tsx`
- `packages/core-components/src/components/composable/stats-strip.tsx`
- `packages/core-components/src/components/composable/cta-section.tsx`
- `packages/core-components/src/components/composable/content-section.tsx`
- `tools/lib/composition-catalog.ts`
- `sites/poc-composition-test/lib/page-data.ts`
- `packages/component-composition/src/types.ts`

Record the exact prop names, slot names, and data field names used in each component. You will need these to write accurate field tables in the catalog and accurate sample data in the UI library.

```bash
# Verification gate — STOP if this fails
# (All reads succeeded — proceed to Phase 2)
echo "Phase 1 reads complete"
```

No commit for this phase — read-only.

---

## Phase 2: Write the Component Catalog Document

**Goal:** Write the master catalog document covering all components — existing (7), gap (6), structural (Header, Footer, TextSection) — with fields, slots, layout params, interaction states, animation system, and schema stubs.
**Model:** opus — this is the highest-value writing task; accuracy and completeness matter more than speed

**File to create:**
`output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md`

### Document structure

Write the catalog in this order:

#### Section 1: Overview

- Purpose of the catalog
- How to use it (for AI prompt engineers, for developers building components)
- Status key: ✓ Built | ◐ Documented (not built)

#### Section 2: Conventions

- Naming conventions (ComponentName = PascalCase, field names = camelCase)
- Slot semantics: all slots are boolean show/hide; `true` = show, `false` = hide
- Layout param glossary: define each `LayoutParams` field once here (background, align, columns, fullBleed, paddingY, mediaPosition, maxItems)
- Default values: if a slot has a default, it's specified in the component; config only needs to override

#### Section 3: Animation System

Global preset (document only — not yet implemented in schema):

```typescript
// Future addition to SiteCompositionConfig
animationPreset?: "none" | "subtle" | "energetic"
```

- `none` — instant render, no entrance animation
- `subtle` — fade-up, 300ms ease-out, 100ms stagger between sections
- `energetic` — slide-in + scale, 500ms, pronounced stagger

Per-section override (document only — future `motionConfig` field on `BaseSectionConfig`):

```typescript
motionConfig?: {
  enter?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "none";
  duration?: "fast" | "normal" | "slow";
  delay?: number;  // ms, 0–500
}
```

Note: `motionConfig` is a separate field from `layout` — motion is behavioural, layout is structural.

#### Section 4: Interaction & Accessibility Baseline

Document the platform's standard interaction patterns (hardcoded in components, not configurable):

- **Hover (interactive elements):** `transition-all duration-[var(--transition-normal)] hover:-translate-y-0.5 hover:shadow-md`
- **Focus visible:** `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none`
- **Active:** `active:scale-95`
- **Reduced-motion:** All transforms disabled when `prefers-reduced-motion: reduce`; opacity transitions only
- **Keyboard:** All interactive elements reachable via Tab; dropdowns closeable via Escape; cards with `href` are `<a>` elements

#### Section 5: Components (one sub-section each)

Use this template for EVERY component:

````markdown
## ComponentName ✓ / ◐

**Status:** Built ✓ | Documented (not built) ◐
**Use when:** [one sentence — when to reach for this component]
**Page types:** home | about | service-detail | location-detail | contact | etc.

### Data Fields

| Field   | Type   | Required | Default | Constraints  | Description          |
| ------- | ------ | -------- | ------- | ------------ | -------------------- |
| heading | string | yes      | —       | max 80 chars | Main section heading |

### Slots (show/hide toggles)

| Slot        | Default | Controls                    | Notes                                    |
| ----------- | ------- | --------------------------- | ---------------------------------------- |
| showEyebrow | true    | Eyebrow label above heading | Hide on pages where eyebrow is redundant |

### Layout Params

| Param | Values                  | Default | Effect                                         |
| ----- | ----------------------- | ------- | ---------------------------------------------- |
| align | left \| center \| split | left    | Text alignment; split = text left, media right |

### Content Constraints

| Field / Slot | Constraint   | Reason                                              |
| ------------ | ------------ | --------------------------------------------------- |
| heading      | max 80 chars | Wraps badly on mobile above that length             |
| services[]   | 2–8 items    | Grid becomes too dense or sparse outside this range |

### Interaction States

| Element     | Hover                        | Focus                     | Active   | Reduced-motion |
| ----------- | ---------------------------- | ------------------------- | -------- | -------------- |
| Primary CTA | -translate-y-0.5 + shadow-md | ring-2 ring-brand-primary | scale-95 | no transform   |

### Animation

Inherits `animationPreset` from site config. Override per-section with `motionConfig` (future).
Recommended preset: `subtle` for informational sections, `energetic` for hero/CTA.

### Example JSON payload

```json
{
  "heading": "Professional Plumbing You Can Trust",
  "eyebrow": "FastFlo Plumbing & Heating",
  ...
}
```
````

````

#### Components to document (in this order):

**Built ✓ (7) — get exact field/slot names from Phase 1 reads:**
1. `HeroSection` — two layout variants: split (text+image), centered (no image)
2. `ServiceCards` — service tiles grid
3. `FeatureGrid` — USP/benefit icon grid
4. `TestimonialGrid` — review/testimonial cards
5. `StatsStrip` — social proof numbers bar
6. `CTASection` — conversion band; two variants: center/brand, left/surface
7. `ContentSection` — flexible prose+image; two variants: split, centered prose

**Documented, not built ◐ (6 gap components):**
8. `PortfolioGrid` — project/work gallery tiles
   - Fields: `heading`, `subheading?`, `projects[]` ({title, description?, image, category?, href?, completedDate?})
   - Slots: showDescription, showCategory, showDate, showCta, filterByCategory
   - Layout: columns (2|3|4), background
   - Constraints: 3–12 projects; images must be landscape 16:9

9. `ContactFormSection` — form + optional map embed + contact details
   - Fields: `heading`, `subheading?`, `formFields[]` ({label, type: "text"|"email"|"tel"|"textarea"|"select", required, options?}), `submitLabel`, `mapEmbedUrl?`, `address?`, `phone?`, `email?`, `openingHours[]?`
   - Slots: showMap, showAddress, showPhone, showEmail, showOpeningHours, showSubheading
   - Layout: align (split|stacked), background

10. `BlogGrid` — article list / blog index
    - Fields: `heading`, `subheading?`, `posts[]` ({title, excerpt?, image?, author?, date?, category?, href})
    - Slots: showExcerpt, showAuthor, showDate, showCategory, showImage
    - Layout: columns (2|3), background
    - Constraints: 3–12 posts; excerpt max 160 chars

11. `AccordionSection` — FAQ or expandable Q&A
    - Fields: `heading`, `subheading?`, `items[]` ({question, answer})
    - Slots: showSubheading, allowMultiOpen
    - Layout: background, maxWidth (prose|wide|full)
    - Constraints: 3–20 items

12. `LogoStrip` — partner/client/certification logos row
    - Fields: `heading?`, `logos[]` ({src, alt, href?})
    - Slots: showHeading, linkLogos
    - Layout: columns (4|6|8), background, paddingY
    - Constraints: 4–12 logos; all logos same height; SVG or PNG with transparent bg preferred

13. `PricingTable` — service tier comparison
    - Fields: `heading`, `subheading?`, `tiers[]` ({name, price, period?, description?, features[], ctaText, ctaHref, highlighted?})
    - Slots: showSubheading, showDescription, showPeriod
    - Layout: columns (2|3), background
    - Constraints: 2–4 tiers; features[] max 8 per tier

**Documented, not built ◐ (structural components):**

14. `HeaderSection` — site header/navigation
    Document exhaustively:
    - `navStyle`: "inline" | "hamburger-only" | "hamburger-desktop"
      - inline: nav links visible on desktop, hamburger on mobile
      - hamburger-only: hamburger on all viewports
      - hamburger-desktop: hamburger even on desktop (rare — think creative/agency sites)
    - `appearance`: "light" | "dark" | "blur"
    - `sticky`: boolean — header stays at top on scroll
    - `transparentOnScroll`: boolean — header transparent at page top, solid when scrolled
    - `mobileBehaviour`: "overlay" | "drawer-left" | "drawer-right"
    - `megaMenu`: boolean — enables multi-column dropdown
    - Logo: position (left|center), src, alt, width, height
    - CTA: label, href (button in header)
    - Phone: display, tel (click-to-call)
    - `announcementBar`: optional banner above header (text, href?, dismissible?)
    - NavItem: label, href, children? (dropdown), columns? (mega-menu columns), megaImage? (feature image in mega menu)

    States to document: default/solid, transparent-at-top, sticky-scrolled, mobile-closed, mobile-overlay-open, mobile-drawer-open, dropdown-open, mega-menu-open, with-announcement-bar

    Architecture note: HeaderSection is NOT a page section — it is configured via `headerConfig` at the root of `SiteCompositionConfig` and rendered by `app/layout.tsx`. This keeps it DRY (one config for all pages) and out of the `ComponentName` union (prevents AI inserting it into page section lists).

15. `FooterSection` — site footer
    - Logo, tagline
    - `columns[]`: link groups (each with heading + links[])
    - Contact block: phone, email, address, openingHours[]
    - Social: platform + href for each
    - Newsletter: heading, placeholder, buttonLabel
    - Legal: copyright, links[]
    - Certifications: name, icon?, href?
    - builtBy: name, url
    - Slots: showNewsletter, showSocial, showCertifications, showAddress, showPhone, showOpeningHours, showBuiltBy
    - Layout: columns (2|3|4 link column groups), background

    Architecture note: Same as HeaderSection — `footerConfig` at root of `SiteCompositionConfig`, rendered by `layout.tsx`.

16. `TextSection` — prose pages (policy, terms, privacy, about narrative)
    Why not ContentSection: TextSection needs semantic `<article>` wrapper, prose max-width constraint, "last updated" metadata field, and optional table of contents. ContentSection is for split content blocks with media, not long-form text.
    - Fields: `heading`, `subheading?`, `body` (HTML/MDX prose), `lastUpdated?` (ISO date)
    - Slots: showHeading, showSubheading, showLastUpdated, showTableOfContents
    - Layout: align (left|center), maxWidth (prose|wide|full), paddingY (compact|standard|spacious)

#### Section 6: Appendix A — Header & Footer Config Schemas

Full TypeScript interface stubs for `HeaderConfig` and `FooterConfig`. These will be added to `packages/component-composition/src/types.ts` when Header/Footer are implemented.

Mark as: `> ⚠️ Proposed schema — not yet in codebase. Verify field names at implementation time.`

#### Section 7: Appendix B — Gap Component Schema Stubs

For each of the 6 gap components, provide:
- TypeScript interface stub (draft)
- Zod schema fragment (draft)

Mark as: `> ⚠️ Draft schema — verify field names against implementation before use.`

Example format for one stub:
```typescript
// DRAFT — PortfolioGrid
interface PortfolioGridData {
  heading: string;
  subheading?: string;
  projects: Array<{
    title: string;
    description?: string;
    image: string;
    category?: string;
    href?: string;
    completedDate?: string;
  }>;
}

// Zod (draft)
const PortfolioGridDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    category: z.string().optional(),
    href: z.string().optional(),
    completedDate: z.string().optional(),
  })).min(3).max(12),
});
````

```bash
# Verification gate — STOP if this fails
# Review the catalog manually:
# - All 7 built components have data fields table, slots table, layout params table, content constraints, interaction states, and example JSON
# - All 6 gap components have data fields table, slots table, and schema stubs
# - Header, Footer, TextSection sections are present with architecture notes
# - Animation system section is present
# - Interaction baseline section is present
echo "Phase 2 catalog complete — proceed after manual review"
```

```bash
git add output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md
git commit -m "$(cat <<'EOF'
docs(catalog): write master component catalog for composition system

Covers 7 built components, 6 gap components, Header, Footer, TextSection.
Includes animation system design, interaction baseline, and schema stubs.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Add `data-slot` Attributes to Existing Components

**Goal:** Add `data-slot` HTML attributes to 4–5 key landmark elements in each of the 7 existing composable components. This enables CSS selector-based field label annotations in the UI library without any logic or styling change.
**Model:** haiku — mechanical attribute additions to known elements

These are additive-only changes. No logic, no styling, no type signature changes. Each `data-slot` maps to the field name that populates that element.

Read each file first, then edit. The specific elements to tag:

**hero-section.tsx:**

- Eyebrow `<p>` → `data-slot="eyebrow"`
- Main heading `<h1>` → `data-slot="heading"`
- Subheading `<p>` → `data-slot="subheading"`
- Primary CTA `<a>` → `data-slot="primaryCta"`

**service-cards.tsx:**

- Section heading `<h2>` → `data-slot="heading"`
- First/all card title `<h3>` elements → `data-slot="serviceTitle"` (if rendered from array, add to the JSX template element)

**feature-grid.tsx:**

- Section heading `<h2>` → `data-slot="heading"`
- Section intro `<p>` → `data-slot="intro"`
- Feature title `<h3>` (in array template) → `data-slot="featureTitle"`

**testimonial-grid.tsx:**

- Section heading `<h2>` → `data-slot="heading"`
- Quote/text element → `data-slot="quote"`
- Author name element → `data-slot="authorName"`

**stats-strip.tsx:**

- Stat value element → `data-slot="statValue"`
- Stat label element → `data-slot="statLabel"`

**cta-section.tsx:**

- Heading `<h2>` → `data-slot="heading"`
- Subheading `<p>` → `data-slot="subheading"`
- Primary CTA `<a>` → `data-slot="primaryCta"`

**content-section.tsx:**

- Subheading/eyebrow `<p>` → `data-slot="subheading"`
- Heading `<h2>` → `data-slot="heading"`
- Body prose container → `data-slot="body"`
- CTA `<a>` → `data-slot="cta"`

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add packages/core-components/src/components/composable/
git commit -m "$(cat <<'EOF'
feat(composable): add data-slot attributes to landmark elements

Additive-only: HTML data attributes on heading, eyebrow, CTA, and key
structural elements in all 7 composable components. Enables CSS-based
field label annotations in UI library without logic or style changes.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Create UI Library Support Files

**Goal:** Create the sample data file, field map file, annotation CSS, and Client Component toggle. These are created before page.tsx so page.tsx can import them.
**Model:** sonnet

### 4.1 — `ui-library-sample-data.ts`

**File:** `sites/poc-composition-test/app/ui-library/ui-library-sample-data.ts`

Named exports only. Sample theme: "FastFlo Plumbing & Heating" (London).

```typescript
// Named exports — one data object per component, one slots object, one layout object

export const heroData = {
  heading: "Expert Plumbing & Heating in London",
  eyebrow: "FastFlo Plumbing & Heating",
  subheading:
    "From blocked drains to full boiler installations — 24/7 emergency cover across Greater London.",
  primaryCtaText: "Get a Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: "Call Now",
  secondaryCtaHref: "tel:02071234567",
  heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  trustBadges: [
    { label: "Gas Safe Registered", icon: "🔒" },
    { label: "Which? Trusted Trader", icon: "✓" },
    { label: "24/7 Emergency", icon: "⚡" },
  ],
};

export const heroSlots = {
  showEyebrow: true,
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: true,
  showHeroImage: true,
  showTrustBadges: true,
};

// ... one set per component — get exact field names from Phase 1 reads
// serviceCardsData, serviceCardsSlots
// featureGridData, featureGridSlots
// testimonialGridData, testimonialGridSlots
// statsStripData, statsStripSlots
// ctaSectionData, ctaSectionSlots
// contentSectionData, contentSectionSlots
```

Use realistic, non-lorem-ipsum data throughout. All images use Unsplash URLs (already used in poc-composition-test). Ensure exact field names match what was read in Phase 1.

### 4.2 — `ui-library-field-map.ts`

**File:** `sites/poc-composition-test/app/ui-library/ui-library-field-map.ts`

```typescript
export interface FieldMapEntry {
  slot: string; // matches data-slot value on the element
  field: string; // field name in the sample data object
  description: string;
  colorVar: string; // CSS custom property name for annotation colour
}

export const FIELD_MAP: Record<string, FieldMapEntry[]> = {
  HeroSection: [
    {
      slot: "eyebrow",
      field: "eyebrow",
      description: "Eyebrow label above heading",
      colorVar: "--label-green",
    },
    {
      slot: "heading",
      field: "heading",
      description: "Main hero heading",
      colorVar: "--label-blue",
    },
    {
      slot: "subheading",
      field: "subheading",
      description: "Intro text below heading",
      colorVar: "--label-purple",
    },
    {
      slot: "primaryCta",
      field: "primaryCtaText",
      description: "Primary CTA button text + href",
      colorVar: "--label-orange",
    },
  ],
  ServiceCards: [
    { slot: "heading", field: "heading", description: "Section heading", colorVar: "--label-blue" },
    {
      slot: "serviceTitle",
      field: "services[].title",
      description: "Individual service card title",
      colorVar: "--label-green",
    },
  ],
  // ... other components
};
```

### 4.3 — `field-labels.css`

**File:** `sites/poc-composition-test/app/ui-library/field-labels.css`

```css
:root {
  --label-blue: #2563eb;
  --label-green: #16a34a;
  --label-purple: #7c3aed;
  --label-orange: #ea580c;
  --label-pink: #db2777;
  --label-teal: #0d9488;
  --label-red: #dc2626;
  --label-amber: #d97706;
}

[data-show-field-labels="true"] [data-slot] {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  position: relative;
  color: var(--slot-annotation-color, var(--label-blue));
}

[data-show-field-labels="true"] [data-slot]::before {
  content: attr(data-slot);
  position: absolute;
  top: -1.75rem;
  left: 0;
  background: var(--slot-annotation-color, var(--label-blue));
  color: white;
  font-size: 0.625rem;
  font-family: ui-monospace, monospace;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  z-index: 50;
  white-space: nowrap;
  pointer-events: none;
  line-height: 1.4;
}
```

**Important:** No Tailwind `theme()` function. No hardcoded hex in utility classes — annotation colours are defined as CSS custom properties in `:root`.

### 4.4 — `ui-library-toggle.tsx`

**File:** `sites/poc-composition-test/app/ui-library/ui-library-toggle.tsx`

```tsx
"use client";
import { useState } from "react";

interface UILibraryToggleProps {
  children: React.ReactNode;
  componentName: string;
}

export function UILibraryToggle({ children, componentName }: UILibraryToggleProps) {
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div>
      <div data-show-field-labels={showLabels ? "true" : "false"} data-component={componentName}>
        {children}
      </div>
      <div className="flex items-center gap-3 px-6 py-3 bg-surface-subtle border-t border-surface-card-border">
        <button
          type="button"
          onClick={() => setShowLabels((v) => !v)}
          className="text-sm font-medium text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none rounded"
        >
          {showLabels ? "Hide field labels" : "Show field labels"}
        </button>
        {showLabels && (
          <span className="text-xs text-surface-muted-foreground">
            Coloured outlines show which data field maps to which element
          </span>
        )}
      </div>
    </div>
  );
}
```

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add sites/poc-composition-test/app/ui-library/ui-library-sample-data.ts \
        sites/poc-composition-test/app/ui-library/ui-library-field-map.ts \
        sites/poc-composition-test/app/ui-library/field-labels.css \
        sites/poc-composition-test/app/ui-library/ui-library-toggle.tsx
git commit -m "$(cat <<'EOF'
feat(ui-library): add sample data, field map, CSS, and toggle component

Support files for the /ui-library route:
- ui-library-sample-data.ts: FastFlo Plumbing sample data for all 7 components
- ui-library-field-map.ts: data-slot → field name mapping for annotation legend
- field-labels.css: CSS annotation styles (data-show-field-labels toggle)
- ui-library-toggle.tsx: Client Component show/hide toggle wrapper

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Create the UI Library Page

**Goal:** Create `page.tsx` — the Next.js route that renders all 7 composable components with their sample data, layout variants, and the toggle wrapper.
**Model:** sonnet

**File:** `sites/poc-composition-test/app/ui-library/page.tsx`

Key constraints:

- `page.tsx` uses `export default` — this is a Next.js route requirement (exemption to platform's no-default-export rule)
- All other files use named exports
- Import `./field-labels.css` at the top of this file
- Pass data directly to components (not via `renderComposedPage`)
- Components are imported from their package paths — check exact export names from Phase 1 reads

```tsx
import "./field-labels.css";

// Import all 7 composable components — verify exact import paths from Phase 1
import { HeroSection } from "@platform/core-components/composable";
import { ServiceCards } from "@platform/core-components/composable";
import { FeatureGrid } from "@platform/core-components/composable";
import { TestimonialGrid } from "@platform/core-components/composable";
import { StatsStrip } from "@platform/core-components/composable";
import { CTASection } from "@platform/core-components/composable";
import { ContentSection } from "@platform/core-components/composable";

import {
  heroData,
  heroSlots,
  serviceCardsData,
  serviceCardsSlots,
  featureGridData,
  featureGridSlots,
  testimonialGridData,
  testimonialGridSlots,
  statsStripData,
  statsStripSlots,
  ctaSectionData,
  ctaSectionSlots,
  contentSectionData,
  contentSectionSlots,
} from "./ui-library-sample-data";

import { UILibraryToggle } from "./ui-library-toggle";

interface ComponentEntryProps {
  name: string;
  description: string;
  variant?: string;
  children: React.ReactNode;
}

function ComponentEntry({ name, description, variant, children }: ComponentEntryProps) {
  return (
    <section className="border-b border-surface-card-border">
      <div className="px-6 py-4 bg-surface-subtle flex items-start justify-between">
        <div>
          <h2 className="text-h2 font-semibold font-heading">
            {name}
            {variant ? (
              <span className="ml-2 text-sm font-normal text-surface-muted-foreground font-sans">
                — {variant}
              </span>
            ) : null}
          </h2>
          <p className="text-surface-secondary-foreground text-sm mt-1">{description}</p>
        </div>
        <span className="text-xs font-mono bg-surface-card text-surface-muted-foreground px-2 py-1 rounded border border-surface-card-border mt-1">
          {name}
        </span>
      </div>
      <UILibraryToggle componentName={name}>{children}</UILibraryToggle>
    </section>
  );
}

export default function UILibraryPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Page header */}
      <header className="px-6 py-10 border-b border-surface-card-border bg-surface">
        <div className="max-w-4xl">
          <p className="text-sm font-mono text-brand-primary mb-2">Local Business Platform</p>
          <h1 className="text-h1 font-heading mb-3">Component Library</h1>
          <p className="text-surface-secondary-foreground text-lg">
            All 7 composable section components rendered with realistic sample data — FastFlo
            Plumbing &amp; Heating (London). Toggle &quot;Show field labels&quot; on any section to
            see which data field maps to which element.
          </p>
          <p className="text-surface-muted-foreground text-sm mt-3">
            To restyle: open{" "}
            <code className="font-mono text-xs bg-surface-subtle px-1 py-0.5 rounded">
              app/ui-library/page.tsx
            </code>{" "}
            and change the layout props, then save. Hot-reload updates instantly.
          </p>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="px-6 py-4 bg-surface-subtle border-b border-surface-card-border">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-primary">
          {[
            "HeroSection",
            "ServiceCards",
            "FeatureGrid",
            "TestimonialGrid",
            "StatsStrip",
            "CTASection",
            "ContentSection",
          ].map((name) => (
            <li key={name}>
              <a href={`#${name}`} className="hover:underline">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HeroSection — split variant */}
      <div id="HeroSection">
        <ComponentEntry
          name="HeroSection"
          description="Primary above-fold hero. First section of any page."
          variant="split — text left, image right"
        >
          <HeroSection
            data={heroData}
            slots={heroSlots}
            layout={{ align: "split", background: "inverse", fullBleed: true }}
          />
        </ComponentEntry>

        {/* HeroSection — centered variant */}
        <ComponentEntry
          name="HeroSection"
          description="Primary above-fold hero."
          variant="center — no image, brand background"
        >
          <HeroSection
            data={heroData}
            slots={{ ...heroSlots, showHeroImage: false, showTrustBadges: false }}
            layout={{ align: "center", background: "brand", fullBleed: true }}
          />
        </ComponentEntry>
      </div>

      {/* ServiceCards */}
      <div id="ServiceCards">
        <ComponentEntry
          name="ServiceCards"
          description="Grid of service cards — services, products, or offerings."
        >
          <ServiceCards
            data={serviceCardsData}
            slots={serviceCardsSlots}
            layout={{ columns: 3, background: "surface" }}
          />
        </ComponentEntry>
      </div>

      {/* FeatureGrid */}
      <div id="FeatureGrid">
        <ComponentEntry
          name="FeatureGrid"
          description="Icon-card grid for features, benefits, or USPs."
        >
          <FeatureGrid
            data={featureGridData}
            slots={featureGridSlots}
            layout={{ columns: 3, background: "subtle" }}
          />
        </ComponentEntry>
      </div>

      {/* TestimonialGrid */}
      <div id="TestimonialGrid">
        <ComponentEntry
          name="TestimonialGrid"
          description="Grid of review/testimonial cards with stars and author info."
        >
          <TestimonialGrid
            data={testimonialGridData}
            slots={testimonialGridSlots}
            layout={{ columns: 3, background: "surface" }}
          />
        </ComponentEntry>
      </div>

      {/* StatsStrip */}
      <div id="StatsStrip">
        <ComponentEntry
          name="StatsStrip"
          description="Horizontal social proof strip — key metrics and achievements."
        >
          <StatsStrip
            data={statsStripData}
            slots={statsStripSlots}
            layout={{ columns: 4, background: "brand", paddingY: "standard" }}
          />
        </ComponentEntry>
      </div>

      {/* CTASection — center/brand variant */}
      <div id="CTASection">
        <ComponentEntry
          name="CTASection"
          description="Full-width conversion band with heading and CTA buttons."
          variant="center — brand background"
        >
          <CTASection
            data={ctaSectionData}
            slots={ctaSectionSlots}
            layout={{ background: "inverse", align: "center" }}
          />
        </ComponentEntry>

        {/* CTASection — left/surface variant */}
        <ComponentEntry
          name="CTASection"
          description="Full-width conversion band with heading and CTA buttons."
          variant="left — surface background"
        >
          <CTASection
            data={ctaSectionData}
            slots={{ ...ctaSectionSlots, showSecondaryCta: true, showTrustLine: true }}
            layout={{ background: "subtle", align: "left" }}
          />
        </ComponentEntry>
      </div>

      {/* ContentSection — split variant */}
      <div id="ContentSection">
        <ComponentEntry
          name="ContentSection"
          description="Flexible content section: heading + prose + optional image."
          variant="split — text left, image right"
        >
          <ContentSection
            data={contentSectionData}
            slots={{ ...contentSectionSlots, showImage: true, showCta: true }}
            layout={{ align: "split", background: "surface" }}
          />
        </ComponentEntry>

        {/* ContentSection — prose variant */}
        <ComponentEntry
          name="ContentSection"
          description="Flexible content section: heading + prose + optional image."
          variant="center — prose only, no image"
        >
          <ContentSection
            data={contentSectionData}
            slots={{ ...contentSectionSlots, showImage: false, showList: true }}
            layout={{ align: "center", background: "subtle" }}
          />
        </ComponentEntry>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-surface-subtle border-t border-surface-card-border">
        <p className="text-xs text-surface-muted-foreground font-mono">
          Local Business Platform — Component Library — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
```

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/poc-composition-test
npm run type-check
```

```bash
# Also verify dev server renders the page (run manually, check output)
# npm run dev  →  open http://localhost:3000/ui-library
# Confirm: all 7 components visible, toggle works, no console errors
```

```bash
git add sites/poc-composition-test/app/ui-library/page.tsx
git commit -m "$(cat <<'EOF'
feat(ui-library): add /ui-library route with all 7 composable components

Renders HeroSection (2 variants), ServiceCards, FeatureGrid, TestimonialGrid,
StatsStrip, CTASection (2 variants), ContentSection (2 variants) with
realistic FastFlo Plumbing sample data. Field label toggle shows which
data field maps to which rendered element.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Final Verification

**Goal:** Full type-check across monorepo, verify UI library route works end-to-end, confirm no regressions on existing home page.
**Model:** haiku — verification commands only

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
# Verify existing home page still builds (no regressions from data-slot additions)
cd sites/poc-composition-test
npm run build 2>&1 | tail -20
```

Expected: build succeeds, no type errors, no missing export errors.

No commit for this phase.

---

## Parallel Execution Groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                   | File overlap            | Model  | Rationale                                                     |
| ----- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ | ------------------------------------------------------------- |
| G1    | Phase 1 | Read all 10 files simultaneously                                                                                                        | none (reads only)       | haiku  | Independent reads — batch in one message                      |
| G2    | Phase 3 | Edit hero-section.tsx, service-cards.tsx, feature-grid.tsx, testimonial-grid.tsx, stats-strip.tsx, cta-section.tsx, content-section.tsx | none (different files)  | haiku  | Each file is independent — same mechanical attribute addition |
| G3    | Phase 4 | Create ui-library-sample-data.ts, ui-library-field-map.ts, field-labels.css, ui-library-toggle.tsx                                      | none                    | sonnet | All new files, no shared state — create in parallel           |
| G4    | Phase 6 | Run `pnpm type-check` (root), run `npm run build` (site)                                                                                | none (read-only checks) | haiku  | Independent verification commands                             |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                                         |
| ------ | ------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | All phases have ordering dependencies — Phase 1 reads inform Phase 2 content, Phase 3 adds data-slot before Phase 4/5 samples reference those slots, Phase 4 support files must exist before Phase 5 imports them |

### Sequential points — MUST NOT parallelise

| Item                     | Reason                                                                  |
| ------------------------ | ----------------------------------------------------------------------- |
| Phase 1 before Phase 2   | Catalog must use exact field names from source                          |
| Phase 3 before Phase 4/5 | data-slot attributes must exist before CSS and field map reference them |
| Phase 4 before Phase 5   | page.tsx imports from support files created in Phase 4                  |
| Verification gates       | Each phase's output gates the next                                      |
| Git commits              | One commit per phase, in order                                          |

---

## Cost Estimate

| Phase                             | Model  | Est. input tokens                  | Est. output tokens     | Est. cost  |
| --------------------------------- | ------ | ---------------------------------- | ---------------------- | ---------- |
| Phase 1: Read source files        | haiku  | ~15k (10 files × ~1500 tokens avg) | ~0                     | ~$0.004    |
| Phase 2: Write catalog            | opus   | ~8k (brief + context)              | ~8k (long catalog doc) | ~$0.72     |
| Phase 3: Add data-slot attributes | haiku  | ~10k (7 files × ~1400 tokens)      | ~1k (minor edits)      | ~$0.004    |
| Phase 4: Create support files     | sonnet | ~6k (brief + context)              | ~4k (4 files)          | ~$0.08     |
| Phase 5: Create page.tsx          | sonnet | ~8k (brief + support files)        | ~3k (1 file)           | ~$0.07     |
| Phase 6: Verification             | haiku  | ~3k (commands)                     | ~0.5k (output)         | ~$0.001    |
| **Total**                         |        | **~50k**                           | **~16.5k**             | **~$0.88** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes and `npm run build` passes in poc-composition-test
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | opus      |                   |                    | $X.XX     |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   Compare to pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

Phase 1 read all 10 source files in parallel to establish exact field names. Phase 2 wrote the master catalog document covering all 16 components (7 built, 6 gap, 3 structural) with field tables, slot tables, layout params, content constraints, interaction states, example payloads, and TypeScript schema stubs in two appendices. Phase 3 added `data-slot` HTML attributes to landmark elements across all 7 composable component files — additive only, no logic changes. Phase 4 created the 4 UI library support files (sample data, field map, CSS annotations, client toggle). Phase 5 created the `/ui-library` Next.js route rendering all 7 components with 11 total variants and the field-label toggle. The one deviation from the brief: the exact import path for composable components is `@platform/core-components/components/composable` (not `/composable`) — corrected from the brief's suggestion after checking the package exports. All verification gates passed: `pnpm type-check` clean across all 12 workspaces, `npm run build` in poc-composition-test generates `/ui-library` as a static route.

### Commits

- `8b5ac34` docs(catalog): write master component catalog for composition system
- `6cc8e31` feat(composable): add data-slot attributes to landmark elements
- `046ba42` feat(ui-library): add sample data, field map, CSS, and toggle component
- `3c3b3d5` feat(ui-library): add /ui-library route with all 7 composable components

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel Execution Groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- Ensure exact component import paths are verified from Phase 1 reads before writing page.tsx
