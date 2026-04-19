# YOLO Implementation Brief: DJ Fox Electrical → Composition System Migration

**Branch:** feature/dj-fox-composition-migration (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-19_dj-fox-composition-migration/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

DJ Fox Electrical (`sites/dj-fox-electrical`) is the platform's live reference site, currently built on Orion theme page templates (`OrionHomePage`, `OrionAboutPage`, etc.) that hard-wire layout and data together. This plan creates `sites/dj-fox-electrical-test/` — a full visual clone of every page, rebuilt using the composable section system, with zero visible difference as the acceptance criterion. It is the first end-to-end real-world test of the composition system's completeness, requiring 7 new composable components. Header and Footer are driven from `composition.json` via the layout registry pattern (`registerLayoutComponent` / `renderComposedLayout`) merged in `feature/composition-layout-config`.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/dj-fox-composition-migration
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Scaffold the Test Site

**Goal:** Create `sites/dj-fox-electrical-test/` with the full skeleton of a composition-driven site, pointing at DJ Fox config and theme tokens.
**Model:** sonnet — multiple config files with interdependencies; must read source files before copying

Read these files in parallel before writing anything:

- `sites/dj-fox-electrical/site.config.ts`
- `sites/dj-fox-electrical/theme.config.ts`
- `sites/dj-fox-electrical/app/layout.tsx`
- `sites/dj-fox-electrical/app/globals.css`
- `sites/dj-fox-electrical/next.config.ts`
- `sites/poc-composition-test/package.json`
- `sites/poc-composition-test/tailwind.config.ts`
- `sites/poc-composition-test/tsconfig.json`
- `sites/poc-composition-test/app/layout.tsx`
- `packages/themes/orion/components/header.tsx`
- `packages/themes/orion/components/footer.tsx`

Also read `sites/dj-fox-electrical/lib/` directory listing and each lib shim file.

### Files to create

**`sites/dj-fox-electrical-test/site.config.ts`** — copy verbatim from `sites/dj-fox-electrical/site.config.ts`

**`sites/dj-fox-electrical-test/theme.config.ts`** — copy verbatim from `sites/dj-fox-electrical/theme.config.ts`

**`sites/dj-fox-electrical-test/package.json`**:

```json
{
  "name": "dj-fox-electrical-test",
  "version": "0.1.0",
  "private": true
}
```

— then copy all `scripts`, `dependencies`, and `devDependencies` from `sites/poc-composition-test/package.json`, adding any DJ Fox-specific deps that appear in `sites/dj-fox-electrical/package.json` but not the PoC site (e.g. `@platform/themes/orion` if not already present).

**`sites/dj-fox-electrical-test/tailwind.config.ts`** — copy from `sites/poc-composition-test/tailwind.config.ts` exactly (scoped content globs — never `packages/themes/**/*`).

**`sites/dj-fox-electrical-test/tsconfig.json`** — copy from `sites/poc-composition-test/tsconfig.json`.

**`sites/dj-fox-electrical-test/next.config.ts`** — copy from `sites/dj-fox-electrical/next.config.ts` (webpack build, not Turbopack — CI requirement).

**`sites/dj-fox-electrical-test/app/globals.css`** — copy from `sites/dj-fox-electrical/app/globals.css`.

**`sites/dj-fox-electrical-test/app/layout.tsx`** — composition-driven layout using the layout registry. Read `packages/themes/orion/components/header.tsx` and `footer.tsx` to understand the exact prop interfaces before writing `siteData.header` and `siteData.footer` shapes.

```typescript
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import compositionConfig from "../composition.json";
import {
  SiteCompositionConfigSchema,
  renderComposedLayout,
  registerLayoutComponent,
} from "@platform/component-composition";
import { OrionHeader } from "@platform/themes/orion/components";
import { OrionFooter } from "@platform/themes/orion/components";
import { siteData } from "@/lib/page-data";

// Register layout components for this site
registerLayoutComponent("OrionHeader", {
  component: OrionHeader as unknown as React.ComponentType<Record<string, unknown>>,
});
registerLayoutComponent("OrionFooter", {
  component: OrionFooter as unknown as React.ComponentType<Record<string, unknown>>,
});

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: siteData.meta.title,
  description: siteData.meta.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { headerElement, footerElement } = renderComposedLayout({
    composition: config,
    data: siteData as unknown as Record<string, unknown>,
  });
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {headerElement}
        <div className="flex-1">{children}</div>
        {footerElement}
      </body>
    </html>
  );
}
```

**`sites/dj-fox-electrical-test/composition.json`** — stub:

```json
{
  "version": "1",
  "siteId": "dj-fox-electrical-test",
  "headerConfig": {
    "component": "OrionHeader",
    "dataKey": "header"
  },
  "footerConfig": {
    "component": "OrionFooter",
    "dataKey": "footer"
  },
  "pages": []
}
```

**`sites/dj-fox-electrical-test/lib/`** — copy all shim files from `sites/dj-fox-electrical/lib/` verbatim. These call the same factory functions with the same site config — no changes needed.

**`sites/dj-fox-electrical-test/lib/page-data.ts`** — stub only at this stage:

```typescript
export const siteData = {
  meta: {
    title: "D J Fox Electrical | Electricians in Eastbourne",
    description: "NICEIC Approved electricians serving Eastbourne and East Sussex.",
  },
  header: {
    // populated in Phase 3
  },
  footer: {
    // populated in Phase 3
  },
} as const;
```

```bash
# Verification gate — STOP if this fails
cd sites/dj-fox-electrical-test
npm run type-check
```

Commit:

```bash
git add sites/dj-fox-electrical-test/
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): scaffold composition-driven test site

Creates sites/dj-fox-electrical-test/ with DJ Fox config/theme tokens,
composition layout registry wiring (OrionHeader/OrionFooter), and lib
shims copied from the production site. Pages and data layer to follow.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Build 7 New Composable Components

**Goal:** Implement all 7 new components in `packages/core-components/src/components/composable/`, register them in the composition system.
**Model:** opus — 7 new components plus 4 registration files, all interdependent; requires judgment on rendering details not fully specified

Read these files in parallel before writing anything:

- `packages/core-components/src/components/composable/index.ts`
- `packages/core-components/src/components/composable/hero-section.tsx` (reference for pattern)
- `packages/core-components/src/components/composable/feature-grid.tsx` (reference for pattern)
- `packages/component-composition/src/types.ts`
- `packages/component-composition/src/registry.ts`
- `packages/component-composition/src/schemas.ts`
- `packages/themes/orion/pages/home.tsx` (reference: what WhyChooseUs and Services sections look like)
- `packages/themes/orion/pages/contact.tsx` (reference: ContactForm layout)
- `packages/themes/orion/pages/reviews.tsx` (reference: TestimonialCard layout)
- `packages/themes/orion/pages/blog.tsx` (reference: blog card layout)
- `packages/themes/orion/pages/projects.tsx` (reference: project card layout)
- `sites/dj-fox-electrical/app/pricing/page.tsx` (reference: pricing layout)
- `sites/dj-fox-electrical/app/privacy-policy/page.tsx` (reference: TextSection block types)
- `sites/dj-fox-electrical/app/cookie-policy/page.tsx` (reference: cookie policy structure)

All 7 components can be built in parallel. Spawn 7 Task agents simultaneously:

---

**Task agent 1: `faq-section.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/faq-section.tsx`

```typescript
// Named export: FAQSection
// Slots: showSectionHeading (default true), showPhonePrompt (default false)
// Layout: background (surface | subtle | inverse | brand)
// Data:
//   heading?: string
//   faqs: Array<{ question: string; answer: string }>
//   phoneDisplay?: string
//   phoneTel?: string
//
// Render as <details>/<summary> accordion — no "use client" needed.
// When showPhonePrompt is true and phoneTel is set, show a "Still have questions?
// Call [phoneDisplay]" prompt below the accordion.
// Use theme token classes only — bg-surface-subtle, text-surface-foreground, etc.
// No hardcoded hex colours.
```

---

**Task agent 2: `contact-section.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/contact-section.tsx`

```typescript
// Named export: ContactSection
// Slots: showHours (default true), showServiceLinks (default true), showSidebarContact (default true)
// Layout: background (surface | subtle)
// Data:
//   heading?: string
//   subheading?: string
//   email?: string
//   phoneDisplay?: string
//   phoneTel?: string
//   address?: { street?: string; locality: string; region: string; postalCode?: string }
//   hours?: { weekdays?: string; saturday?: string; sunday?: string }
//   serviceLinks?: Array<{ slug: string; title: string }>
//   submitEndpoint?: string   // default: "/api/contact"
//   csrfEndpoint?: string     // default: "/api/csrf-token"
//
// Layout: 3:2 column split (left: form, right: sidebar)
// Left: import and use ContactForm from @platform/core-components (it already exists)
// Right sidebar sections (each conditional on its slot):
//   - Contact details: phone (tel: link), email (mailto: link), address with icons (Phone, Mail, MapPin from lucide-react)
//   - Business hours: Clock icon, weekdays/saturday/sunday rows
//   - Quick service links: first 5 serviceLinks with ArrowRight hover, "View all services" link
// Wrap the whole section in a container with the background token class
```

---

**Task agent 3: `image-grid-section.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/image-grid-section.tsx`

```typescript
// Named export: ImageGridSection
// Slots: showCategoryBadge (default true), showTitle (default true), showArrow (default true)
// Layout: columns (2 | 3, default 3), background (surface | subtle)
// Data:
//   heading?: string
//   cards: Array<{ imageSrc: string; imageAlt: string; category?: string; title: string; href?: string }>
//
// Import and use ImageOverlayCard from @platform/core-components.
// Render cards in a CSS grid with the specified column count.
// If heading is present, render it above the grid.
// Pass showCategoryBadge, showTitle, showArrow as props to ImageOverlayCard if it supports them,
// otherwise implement the overlay logic directly using the card's image + overlay pattern.
// Check ImageOverlayCard's actual prop interface before deciding.
```

---

**Task agent 4: `blog-grid.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/blog-grid.tsx`

```typescript
// Named export: BlogGrid
// Slots: showSectionHeading (true), showCategory (true), showDate (true),
//        showAuthor (false), showExcerpt (true), showReadingTime (false), showCta (false)
// Layout: columns (2 | 3, default 3), background (surface | subtle | inverse)
// Data:
//   heading?: string
//   subheading?: string
//   posts: Array<{
//     slug: string; title: string; excerpt?: string; date?: string;
//     category?: string; heroImage?: string; author?: string;
//     readingTime?: number; featured?: boolean;
//   }>
//   ctaText?: string
//   ctaHref?: string
//
// Each post card:
//   - Optional hero image (aspect-video, object-cover)
//   - Category badge (slot: showCategory)
//   - Date formatted as "12 Jan 2026" (slot: showDate)
//   - Title as <h3> linked to /blog/[slug]
//   - Excerpt truncated to ~2 lines (slot: showExcerpt)
//   - Author (slot: showAuthor)
//   - Reading time "{n} min read" (slot: showReadingTime)
// Optional CTA below grid (slot: showCta): ctaText button linking to ctaHref
// Card background: bg-surface-card, border border-surface-border, rounded-lg
```

---

**Task agent 5: `project-grid.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/project-grid.tsx`

```typescript
// Named export: ProjectGrid
// Slots: showSectionHeading (true), showStats (true), showTags (true),
//        showDate (true), showDescription (true), showCta (false)
// Layout: columns (2 | 3, default 3), background (surface | subtle | inverse)
// Data:
//   heading?: string
//   subheading?: string
//   stats?: Array<{ value: string; label: string }>
//   projects: Array<{
//     slug: string; title: string; description?: string; date?: string; tags?: string[];
//   }>
//   ctaText?: string
//   ctaHref?: string
//
// If showStats and stats are present, render a stats row above the grid
// (2–4 stat items, value large + label small, no dividers needed)
// Each project card:
//   - Tags as small pills (slot: showTags) — bg-surface-subtle text-xs
//   - Title as <h3> linked to /projects/[slug]
//   - Description (slot: showDescription) truncated ~2 lines
//   - Date as year only (slot: showDate)
//   - "View Project →" link
// Optional CTA below grid (slot: showCta)
```

---

**Task agent 6: `pricing-table.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/pricing-table.tsx`

```typescript
// Named export: PricingTable
// Slots: showSectionHeading (true), showDisclaimer (true), showIcons (false)
// Layout: columns (2 | 3 | 4, default 4), background (surface | subtle | muted)
// Data:
//   heading?: string
//   subheading?: string
//   items: Array<{ label: string; priceRange: string; icon?: string }>
//   disclaimer?: string
//
// Each item cell: label (font-medium) on top, priceRange (text-brand-primary, text-lg font-bold) below
// If showIcons is true and item.icon is set, render icon above label
// Cells: bg-surface-card, border border-surface-border, rounded-lg, p-4
// Disclaimer text below grid in text-surface-muted-foreground text-sm (slot: showDisclaimer)
```

---

**Task agent 7: `text-section.tsx`**
model: sonnet
File: `packages/core-components/src/components/composable/text-section.tsx`

```typescript
// Named export: TextSection
// Slots: showToc (default true), showLastUpdated (default true)
// Layout: background (surface | subtle), maxWidth ("prose" | "wide", default "prose")
// Data:
//   heading: string
//   lastUpdated?: string      // ISO date string, rendered as "Last updated: 12 April 2026"
//   intro?: string
//   sections: Array<{
//     id?: string
//     heading: string
//     body?: string           // prose paragraph(s)
//     type?: "prose" | "list" | "callout-grid" | "table" | "numbered-grid" | "two-col"
//     items?: Array<{
//       label?: string; value?: string; description?: string;
//       color?: "blue" | "green" | "purple" | "amber"
//     }>
//   }>
//   tableOfContents?: Array<{ id: string; label: string }>
//
// Outer wrapper: <article> semantic element, max-w-4xl (prose) or max-w-6xl (wide), mx-auto, px-6
// Page heading: <h1> + optional lastUpdated below (slot: showLastUpdated)
// ToC: numbered/linked list of tableOfContents items (slot: showToc), rendered before intro
// Intro: prose paragraph
// Each section renders differently by type:
//   "prose": heading <h2> + body paragraph
//   "list": heading <h2> + <ul> of items[].label (CheckCircle icons)
//   "callout-grid": heading <h2> + 2×2 grid of colored cards
//     - color map: blue→bg-blue-50 border-blue-200, green→bg-green-50 border-green-200,
//       purple→bg-purple-50 border-purple-200, amber→bg-amber-50 border-amber-200
//     - Each card: label (font-semibold) + description
//   "table": heading <h2> + <table> with label/value columns (striped rows)
//   "numbered-grid": heading <h2> + 2×3 grid, each item has badge number + label + description
//   "two-col": heading <h2> + 2-column layout, each item is a bordered card with label + description
// All colours via CSS custom properties / theme tokens where possible.
// For callout colors (blue/green/purple/amber): these are semantic content colors (not brand tokens),
// so Tailwind color classes (bg-blue-50 etc.) are acceptable here — this is a content/semantic use,
// not a brand color.
```

---

After all 7 Task agents complete, perform these registration steps **sequentially** (they all touch shared files):

**Step 2a — Update `packages/core-components/src/components/composable/index.ts`**

Add exports for all 7 new components:

```typescript
export { FAQSection } from "./faq-section";
export { ContactSection } from "./contact-section";
export { ImageGridSection } from "./image-grid-section";
export { BlogGrid } from "./blog-grid";
export { ProjectGrid } from "./project-grid";
export { PricingTable } from "./pricing-table";
export { TextSection } from "./text-section";
```

**Step 2b — Update `packages/component-composition/src/types.ts`**

Extend `ComponentName` union:

```typescript
export type ComponentName =
  | "HeroSection"
  | "ServiceCards"
  | "FeatureGrid"
  | "TestimonialGrid"
  | "StatsStrip"
  | "CTASection"
  | "ContentSection"
  | "FAQSection" // NEW
  | "ContactSection" // NEW
  | "ImageGridSection" // NEW
  | "BlogGrid" // NEW
  | "ProjectGrid" // NEW
  | "PricingTable" // NEW
  | "TextSection"; // NEW
```

**Step 2c — Update `packages/component-composition/src/registry.ts`**

Import and register all 7 new components, following the exact same pattern as existing entries (read the file first).

**Step 2d — Update `packages/component-composition/src/schemas.ts`**

Add Zod slot schemas and layout schemas for each new component, following the pattern of existing entries (read the file first). Slot schemas: each slot field as `z.boolean().default(true/false)`. Layout schemas: extend `LayoutParamsSchema` or define inline per component.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add packages/
git commit -m "$(cat <<'EOF'
feat(core-components): add 7 new composable section components

FAQSection, ContactSection, ImageGridSection, BlogGrid, ProjectGrid,
PricingTable, TextSection — all registered in the composition system.
Enables full-page composition for contact, pricing, policy, blog,
and project pages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Build the Data Layer

**Goal:** Populate `sites/dj-fox-electrical-test/lib/page-data.ts` with all siteData keys and write the full `composition.json` with every page configured.
**Model:** opus — large data file sourced from multiple input files, requires matching exact prop interfaces; composition.json has 15 page configs; high risk of shape mismatches

Read all these files in parallel before writing anything:

- `sites/dj-fox-electrical/site.config.ts`
- `sites/dj-fox-electrical/app/page.tsx`
- `sites/dj-fox-electrical/app/about/page.tsx`
- `sites/dj-fox-electrical/app/contact/page.tsx`
- `sites/dj-fox-electrical/app/services/page.tsx`
- `sites/dj-fox-electrical/app/reviews/page.tsx`
- `sites/dj-fox-electrical/app/projects/page.tsx`
- `sites/dj-fox-electrical/app/blog/page.tsx`
- `sites/dj-fox-electrical/app/pricing/page.tsx`
- `sites/dj-fox-electrical/app/privacy-policy/page.tsx`
- `sites/dj-fox-electrical/app/cookie-policy/page.tsx`
- `packages/themes/orion/components/header.tsx`
- `packages/themes/orion/components/footer.tsx`
- `packages/themes/orion/pages/home.tsx`
- `packages/themes/orion/pages/about.tsx`
- `packages/component-composition/src/types.ts`
- `packages/component-composition/src/registry.ts`

### `lib/page-data.ts`

Build a typed `siteData` object with these top-level keys. All values sourced from `sites/dj-fox-electrical/site.config.ts` and the existing page files — do not invent new content:

**`header`** — must match `OrionHeader` prop interface exactly (read `packages/themes/orion/components/header.tsx`):

- `siteName`, `phoneDisplay`, `phoneTel`, `showPhone`, `primaryCta`, `navigation` (array with `hasDropdown` for Locations), `locations` (array of `{ name, slug }`), `counties` (if used)

**`footer`** — must match `OrionFooter` prop interface exactly (read footer.tsx):

- `siteName`, `tagline`, `phoneDisplay`, `phoneTel`, `email`, `address`, `certifications`, `services` (first 10), `locations` (first 12), `totalServices`, `totalLocations`, `maxServices: 10`, `maxLocations: 12`, `showServices: true`, `showLocations: true`, `copyright`, `builtBy`

**`home`** — data for all home page sections:

- Hero: heading, subheading, eyebrow, primaryCtaText/Href, secondaryCtaText/Href, heroImage, trustBadges
- Stats: stats array (4 items from whyChooseUsItems in page.tsx)
- Services: heading, subheading, services array (first 6 from siteConfig)
- Categories: cards array (3 items from categoryCards in page.tsx)
- Locations: heading, services/cards array (6 priority locations)
- WhyChooseUs: heading, features array (4 items from whyChooseUsItems)
- CTA: heading, subheading, primaryCtaText/Href, secondaryCtaText/Href, trustLine

**`about`** — data for about page sections

**`contact`** — data for contact page sections (email, phone, address, hours, serviceLinks)

**`services`** — data for services page (featuredServices, categories, all services)

**`reviews`** — data for reviews page. Note: testimonials are loaded from MDX at build time in the dynamic page, not from siteData. siteData.reviews provides headings and aggregate stats only; the page.tsx loads testimonials directly.

**`projects`** — similar to reviews — headings and stats from siteData, project list loaded from MDX

**`blog`** — headings only; posts loaded from MDX

**`pricing`** — all pricing page data: emergency banner, rate cards (3), example job costs (8 items for PricingTable), checklist section, benefits grid (6 items), FAQ items, CTA — all sourced from `sites/dj-fox-electrical/app/pricing/page.tsx`

**`privacy`** — full TextSection data structure with all sections from `sites/dj-fox-electrical/app/privacy-policy/page.tsx`, including tableOfContents, lastUpdated, and all section types (prose, list, callout-grid, table, numbered-grid, two-col)

**`cookie`** — full TextSection data from `sites/dj-fox-electrical/app/cookie-policy/page.tsx`

### `composition.json`

Write the full `SiteCompositionConfig` with a `pages` entry for every page type. Each section must have the correct `component`, `slots`, `layout`, and `dataKey` values matching the Scope table in the plan.

Page types needed:

- `home`, `about`, `contact`, `services`, `service-detail`, `locations`, `location-detail`
- `reviews`, `projects`, `project-detail`, `blog`, `blog-post`
- `pricing`, `privacy`, `cookie`

For dynamic pages (`service-detail`, `location-detail`, `blog-post`, `project-detail`): sections that render MDX content use `ContentSection` with `layout.align: "left"` and `dataKey: "mdxContent"`. The page wrapper merges frontmatter + MDX at render time.

```bash
# Verification gate — STOP if this fails
cd sites/dj-fox-electrical-test
npm run type-check
npm run build
```

Commit:

```bash
git add sites/dj-fox-electrical-test/lib/page-data.ts \
        sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): add full composition data layer and page configs

page-data.ts: all siteData keys for 15 page types sourced from DJ Fox
site.config.ts and existing page files. composition.json: complete
SiteCompositionConfig with all pages, sections, slots, and layout params.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Wire Every Page

**Goal:** Create all 15 app routes in `sites/dj-fox-electrical-test/app/`, plus API routes and supporting files.
**Model:** sonnet — repetitive but with important per-page variations; read DJ Fox originals first

Spawn two parallel Task agents (independent file sets):

---

**Task agent A: Static pages** (home, about, contact, services, locations, reviews, projects, blog, pricing, privacy-policy, cookie-policy)
model: sonnet

Read the DJ Fox equivalents in parallel before writing:

- `sites/dj-fox-electrical/app/page.tsx`
- `sites/dj-fox-electrical/app/about/page.tsx`
- `sites/dj-fox-electrical/app/contact/page.tsx`
- `sites/dj-fox-electrical/app/services/page.tsx`
- `sites/dj-fox-electrical/app/locations/page.tsx`
- `sites/dj-fox-electrical/app/reviews/page.tsx`
- `sites/dj-fox-electrical/app/projects/page.tsx`
- `sites/dj-fox-electrical/app/blog/page.tsx`
- `sites/dj-fox-electrical/app/pricing/page.tsx`
- `sites/dj-fox-electrical/app/privacy-policy/page.tsx`
- `sites/dj-fox-electrical/app/cookie-policy/page.tsx`

For each static page, create `sites/dj-fox-electrical-test/app/[route]/page.tsx` using this pattern:

```typescript
import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  // Copy generateMetadata logic from DJ Fox equivalent, or use static metadata
  title: "...",
  description: "...",
};

export default function Page() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "home",   // ← correct pageType for each page
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
```

Copy the `metadata` / `generateMetadata` content verbatim from each DJ Fox original. Copy schema JSON-LD nodes where present.

For the reviews, projects, and blog pages: these load MDX content at build time. Keep `generateStaticParams` and data loading from DJ Fox equivalents, merge the loaded data with siteData before passing to `renderComposedPage`.

---

**Task agent B: Dynamic pages** (services/[slug], locations/[slug], blog/[slug], projects/[slug])
model: sonnet

Read the DJ Fox equivalents in parallel:

- `sites/dj-fox-electrical/app/services/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/locations/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/blog/[slug]/page.tsx`
- `sites/dj-fox-electrical/app/projects/[slug]/page.tsx`

For each dynamic page, create `sites/dj-fox-electrical-test/app/[route]/[slug]/page.tsx`:

- Copy `generateStaticParams` verbatim
- Copy `generateMetadata` verbatim
- Copy schema JSON-LD generation verbatim
- Replace template rendering with `renderComposedPage`:

```typescript
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { frontmatter, content } = await loadService(slug);

  const { elements } = renderComposedPage({
    composition: config,
    pageType: "service-detail",
    data: {
      ...(siteData as unknown as Record<string, unknown>),
      ...frontmatter,
      mdxContent: content,
    },
  });
  return <main className="min-h-screen">{elements}</main>;
}
```

---

After both agents complete, create these additional files sequentially:

**`app/not-found.tsx`** — copy from `sites/dj-fox-electrical/app/not-found.tsx`

**`app/robots.ts`** — copy from `sites/dj-fox-electrical/app/robots.ts`

**`app/sitemap.ts`** — copy from `sites/dj-fox-electrical/app/sitemap.ts`

**`api/contact/route.ts`** — copy from `sites/dj-fox-electrical/app/api/contact/route.ts`

**`api/csrf-token/route.ts`** — copy from `sites/dj-fox-electrical/app/api/csrf-token/route.ts`

```bash
# Verification gate — STOP if this fails
cd sites/dj-fox-electrical-test
npm run type-check
npm run build
```

Confirm in the build output that all 15 page routes appear under the generated static pages list.

Commit:

```bash
git add sites/dj-fox-electrical-test/app/
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): wire all 15 pages via composition renderer

Static pages use renderComposedPage with siteData. Dynamic [slug] pages
copy generateStaticParams/generateMetadata/schema from the production site
and merge MDX frontmatter at render time. API routes copied verbatim.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Visual Comparison

**Goal:** Screenshot-compare every page between the production site and the test site at 1280px viewport.
**Model:** sonnet (orchestrator only — `/pipeline.validate-site` handles the visual review)

Start both dev servers:

```bash
# Terminal 1
cd sites/dj-fox-electrical && npm run dev -- --port 3000

# Terminal 2
cd sites/dj-fox-electrical-test && npm run dev -- --port 3001
```

Wait for both to be ready, then run `/pipeline.validate-site` comparing:

| Page            | Reference (port 3000)                            | Test (port 3001)                                 |
| --------------- | ------------------------------------------------ | ------------------------------------------------ |
| Home            | http://localhost:3000/                           | http://localhost:3001/                           |
| About           | http://localhost:3000/about                      | http://localhost:3001/about                      |
| Contact         | http://localhost:3000/contact                    | http://localhost:3001/contact                    |
| Services        | http://localhost:3000/services                   | http://localhost:3001/services                   |
| Service detail  | http://localhost:3000/services/emergency-callout | http://localhost:3001/services/emergency-callout |
| Locations       | http://localhost:3000/locations                  | http://localhost:3001/locations                  |
| Location detail | http://localhost:3000/locations/eastbourne       | http://localhost:3001/locations/eastbourne       |
| Reviews         | http://localhost:3000/reviews                    | http://localhost:3001/reviews                    |
| Projects        | http://localhost:3000/projects                   | http://localhost:3001/projects                   |
| Blog            | http://localhost:3000/blog                       | http://localhost:3001/blog                       |
| Pricing         | http://localhost:3000/pricing                    | http://localhost:3001/pricing                    |
| Privacy         | http://localhost:3000/privacy-policy             | http://localhost:3001/privacy-policy             |

**Acceptance criteria:**

- No missing sections
- No wrong colours (brand-primary red must match exactly)
- No wrong fonts or font sizes
- Section order identical
- Minor pixel-rounding differences acceptable

**If deviations found:** Fix the relevant component or data layer, rebuild, re-screenshot. Log each fix with what was wrong and what was changed. Do NOT commit fixes until all pages pass.

Commit after all pages pass:

```bash
git add sites/dj-fox-electrical-test/
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): visual parity fixes from comparison review

[list fixes here]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                        | File overlap                       | Model    | Rationale                                              |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | ------------------------------------------------------ |
| G1    | Phase 1 | Read: site.config.ts, theme.config.ts, layout.tsx, globals.css, next.config.ts, poc package.json, poc tailwind.config.ts, poc tsconfig.json, poc layout.tsx, orion header.tsx, orion footer.tsx                                              | none (reads only)                  | n/a      | All independent reads before scaffold                  |
| G2    | Phase 2 | Read: composable/index.ts, hero-section.tsx, feature-grid.tsx, types.ts, registry.ts, schemas.ts, orion home.tsx, contact.tsx, reviews.tsx, blog.tsx, projects.tsx, dj-fox pricing/page.tsx, privacy-policy/page.tsx, cookie-policy/page.tsx | none (reads only)                  | n/a      | All independent reads before component build           |
| G3    | Phase 2 | Create: faq-section.tsx, contact-section.tsx, image-grid-section.tsx, blog-grid.tsx, project-grid.tsx, pricing-table.tsx, text-section.tsx                                                                                                   | none                               | sonnet×7 | All 7 new components are independent — no shared files |
| G4    | Phase 3 | Read: all 11 dj-fox page files + site.config.ts + orion header/footer + types.ts + registry.ts                                                                                                                                               | none (reads only)                  | n/a      | All independent reads before data layer                |
| G5    | Phase 4 | Task agent A (static pages) + Task agent B (dynamic pages)                                                                                                                                                                                   | none — different route directories | sonnet×2 | Independent file sets — no overlap                     |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                  |
| ------ | ------ | ----- | ------------------------------------------ |
| (none) |        |       | All phases depend on previous phase output |

### Sequential points — MUST NOT parallelise

| Item                                        | Reason                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Phase 2 registration steps (2a, 2b, 2c, 2d) | All modify shared package files — must run after the 7 parallel component builds and in order    |
| Phase 3 after Phase 2                       | composition.json references component names that only exist after Phase 2 registration           |
| Phase 4 after Phase 3                       | Pages call `renderComposedPage` with pageTypes that only exist in composition.json after Phase 3 |
| Phase 5 after Phase 4                       | Visual comparison requires a working build                                                       |
| `npm run build` in verification gates       | Writes to `.next/` — must run alone                                                              |
| Git commits                                 | One per phase, in order                                                                          |

---

## Cost Estimate

| Phase                                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Scaffold test site            | sonnet | ~20k              | ~4k                | ~$0.12     |
| Phase 2: 7 new components              | opus   | ~30k              | ~12k               | ~$1.35     |
| Phase 2: Registration steps            | sonnet | ~8k               | ~2k                | ~$0.05     |
| Phase 3: Data layer + composition.json | opus   | ~35k              | ~10k               | ~$1.28     |
| Phase 4: Wire all pages                | sonnet | ~25k              | ~8k                | ~$0.24     |
| Phase 5: Visual comparison             | sonnet | ~10k              | ~2k                | ~$0.05     |
| **Total**                              |        | **~128k**         | **~38k**           | **~$3.09** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~4k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes monorepo-wide and `npm run build` passes in `sites/dj-fox-electrical-test`
3. Visual comparison results — list each page and whether it passed or required fixes
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | opus      | [total across phases] |                    | $X.XX     |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_dj-fox-composition-migration/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, visual comparison outcome]

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

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- **TypeScript cast pattern for layout registry:** always use `as unknown as React.ComponentType<Record<string, unknown>>` (double cast) — single cast is rejected by TypeScript strict mode
- Never push — leave all changes on `feature/dj-fox-composition-migration`
