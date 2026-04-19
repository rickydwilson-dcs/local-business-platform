# Implementation Plan: Component Catalog and UI Library

**Date:** 2026-04-19
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                                | Claude                                                                                        | Codex                                                                                                                                                 | Synthesised Decision                                                                                                                                                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Header architecture**               | `headerConfig` top-level block in `SiteCompositionConfig`, rendered in `layout.tsx`           | Same conclusion — `headerConfig` / `footerConfig` root blocks, not per-page sections                                                                  | **Agreed.** Both independently converged on this. High confidence it's correct.                                                                                                                                                                              |
| **Animation placement**               | `motionConfig` as separate top-level field on `BaseSectionConfig` (not inside `LayoutParams`) | Same — separate section-level field, not folded into `layout`                                                                                         | **Agreed.** Separate field, documented only, not built yet.                                                                                                                                                                                                  |
| **Field label mechanism**             | `data-field` attributes on wrapper elements; CSS `::before` pseudo-element labels             | CSS selector-based — `[data-show-field-labels="true"]` attribute on wrapper; descendant selectors map known elements                                  | **Codex approach adopted.** Using a single `data-show-field-labels` attribute on the section wrapper + descendant CSS selectors is cleaner than adding `data-field` to individual elements (which requires matching the component's internal DOM structure). |
| **UI library file structure**         | 3 files: `page.tsx`, `FieldAnnotation.tsx`, `ui-library.css`                                  | 5 files: `page.tsx`, `ui-library-toggle.tsx`, `field-labels.css`, `ui-library-sample-data.ts`, `ui-library-field-map.ts`                              | **Codex structure adopted.** Separating sample data and field maps into their own files makes the page.tsx readable and the data maintainable.                                                                                                               |
| **Gap component documentation depth** | TypeScript interface + Zod schema stubs for each gap component                                | "Future schema stubs" appendix — non-binding, marked as proposal                                                                                      | **Claude depth adopted.** Interface + Zod stubs are directly usable when building. Codex's "non-binding" framing adds friction with no benefit. Stubs will be clearly marked "draft — verify before implementing".                                           |
| **Interaction states**                | Not configurable — hardcoded in components, documented in catalog only                        | Same — not configurable, documented with accessibility notes added                                                                                    | **Agreed + Codex addition:** Include keyboard/accessibility notes per component (focus-visible, reduced-motion fallback). Claude's plan omitted this.                                                                                                        |
| **Catalog structure**                 | Per-component markdown template                                                               | Codex adds: global naming conventions section, shared slot semantics, content constraints (length/ratio/maxItems), example JSON payload per component | **Codex additions adopted.** Content constraints (e.g. "heading max 80 chars", "max 6 cards") and example JSON payloads make the catalog immediately actionable for AI prompt engineers.                                                                     |

---

## Blind Spots Caught

**Codex caught (Claude missed):**

- **"Show field labels" CSS selector brittleness** — Claude's `data-field` approach requires matching internal component DOM structure, which will break when components are refactored. Codex's descendant selector approach only maps key landmark elements (heading, CTA, first card), which are more stable. Claude acknowledged the risk but didn't propose a better mechanism.
- **Content constraints** — Claude documented field types and slots but not constraints like max heading length, max items per grid, recommended image ratios. These are essential for AI pass prompting and for content editors.
- **Example JSON payloads** — Codex proposed an example JSON payload per component, matching the actual `siteData` shape. This is directly usable in the structural AI pass prompt and as copy-paste reference.
- **Accessibility notes** — Codex added keyboard navigation and `prefers-reduced-motion` fallback to the interaction states table. Claude omitted this entirely.
- **`ui-library-field-map.ts`** — A typed documentation object mapping CSS selector paths to field names. This is the bridge between the CSS label system and the catalog — Claude's approach left this implicit.

**Claude caught (Codex missed):**

- **The non-default-export constraint vs. Next.js `app/page.tsx`** — Codex raised this as a conflict but didn't resolve it. Claude's plan doesn't address it either, but the answer is: `page.tsx` files are exempt from the no-default-export rule because Next.js requires `export default` for route modules. All other files in `app/ui-library/` use named exports only.
- **Second layout variant per component** — Claude proposed showing a second instance of HeroSection (centered vs. split) for components with dramatically different layout outcomes. Codex's plan is silent on this. This is worth doing for HeroSection, ContentSection, and CTASection.
- **`TextSection` warranted over `ContentSection`** — Claude made the case (semantic `<article>` wrapper, prose max-width, ToC support). Codex didn't address TextSection depth, just listed it. Claude's reasoning stands.

---

## Implementation Plan

### Phase 0: Lock decisions (before writing)

No code to write. These decisions are locked based on the synthesis above:

1. Header and Footer → `headerConfig` / `footerConfig` top-level blocks in `SiteCompositionConfig`, documented only in this task
2. Animation → `motionConfig` per-section field (separate from `LayoutParams`), documented only
3. Interaction states → hardcoded in components, documented with accessibility notes
4. Field labels → `data-show-field-labels` attribute + descendant CSS selectors, not `data-field` on individual elements
5. `page.tsx` files are exempt from no-default-export rule (Next.js requirement)
6. Gap component schema stubs → included, marked "draft — verify before implementing"

---

### Phase 1: Component Catalog Document

**File:** `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md`

#### 1.1 — Document structure

Top-level sections:

1. Overview — purpose of the catalog, how to use it
2. Conventions — naming, typing, slot semantics, layout param glossary
3. Animation System — global preset + per-section `motionConfig`
4. Interaction & Accessibility Baseline — hover/focus/active patterns, reduced-motion, keyboard
5. Components (one section each — see template below)
6. Appendix A: Header & Footer Config Schemas
7. Appendix B: Future Component Schema Stubs

**Per-component template:**

```markdown
## ComponentName

**Status:** Built ✓ | Documented (not built)
**Use when:** [one sentence]
**Page types:** [home | about | service-detail | etc.]

### Data Fields

| Field   | Type   | Required | Default | Max/Constraints | Description          |
| ------- | ------ | -------- | ------- | --------------- | -------------------- |
| heading | string | yes      | —       | 80 chars        | Main section heading |

### Slots (show/hide toggles)

| Slot        | Default | Controls            | Note |
| ----------- | ------- | ------------------- | ---- |
| showEyebrow | true    | Label above heading |      |

### Layout Params

| Param | Values                  | Default | Effect |
| ----- | ----------------------- | ------- | ------ |
| align | left \| center \| split | left    |        |

### Interaction States

| Element    | Hover                        | Focus                     | Active   | Reduced-motion |
| ---------- | ---------------------------- | ------------------------- | -------- | -------------- |
| CTA button | -translate-y-0.5 + shadow-md | ring-2 ring-brand-primary | scale-95 | no transform   |

### Animation

Global `animationPreset` applies unless overridden. Per-section `motionConfig` (future):

- `enter`: fade-up | fade-in | slide-left | slide-right | scale | none
- `duration`: fast | normal | slow
- `delay`: ms (0–500)

### Example JSON payload

[minimal siteData object that renders this component correctly]
```

#### 1.2 — Components to document

**Built (7):**

- HeroSection — 2 layout variants (split, center)
- ServiceCards
- FeatureGrid
- TestimonialGrid
- StatsStrip
- CTASection — 2 layout variants (center brand, left surface)
- ContentSection — 2 layout variants (split with image, center prose)

**Documented, not built (6 gap components):**

- PortfolioGrid
- ContactFormSection
- BlogGrid
- AccordionSection
- LogoStrip
- PricingTable

**Documented, not built (structural components):**

- HeaderSection (exhaustive state variants — see 1.3)
- FooterSection
- TextSection (prose pages)

#### 1.3 — HeaderConfig schema (in Appendix A)

```typescript
interface NavItem {
  label: string;
  href: string;
  children?: NavItem[]; // single-level dropdown
  columns?: NavItem[][]; // mega-menu: array of columns
  megaImage?: { src: string; alt: string; href: string; caption?: string };
}

interface HeaderConfig {
  logo: {
    src?: string; // optional — text fallback if absent
    alt: string;
    width?: number;
    height?: number;
    position: "left" | "center";
  };
  navigation: NavItem[];
  navStyle: "inline" | "hamburger-only" | "hamburger-desktop";
  megaMenu?: boolean;
  sticky: boolean;
  transparentOnScroll: boolean;
  appearance: "light" | "dark" | "blur";
  mobileBehaviour: "overlay" | "drawer-left" | "drawer-right";
  cta?: { label: string; href: string };
  phone?: { display: string; tel: string };
  announcementBar?: { text: string; href?: string; dismissible?: boolean };
}
```

**States to document exhaustively:**

1. Default / solid (scrolled, appearance = light or dark)
2. Transparent (at page top, transparentOnScroll = true — text/logo must be readable on hero background)
3. Sticky (scrolled past threshold — shadow appears, possibly compact height)
4. Mobile: closed (hamburger visible)
5. Mobile: overlay open (full-screen, links centred, close button top-right)
6. Mobile: drawer open (slide-in panel, links stacked, overlay behind)
7. Dropdown: single-level (hover or click on nav item with `children`)
8. Mega menu: multi-column (hover or click on nav item with `columns`)
9. Mega menu: with feature image
10. Announcement bar (optional persistent banner above nav)

#### 1.4 — FooterConfig schema (in Appendix A)

```typescript
interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterConfig {
  logo?: { src: string; alt: string };
  tagline?: string;
  columns: FooterColumn[];
  contact?: {
    phone?: { display: string; tel: string };
    email?: string;
    address?: { street?: string; locality: string; region: string; postcode?: string };
    openingHours?: string[];
  };
  social?: Array<{
    platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube" | "tiktok";
    href: string;
  }>;
  newsletter?: { heading: string; placeholder: string; buttonLabel: string };
  legal?: { copyright: string; links?: Array<{ label: string; href: string }> };
  certifications?: Array<{ name: string; icon?: string; href?: string }>;
  builtBy?: { name: string; url: string };
}
```

Slots: showNewsletter, showSocial, showCertifications, showAddress, showPhone, showOpeningHours, showBuiltBy

#### 1.5 — TextSection (new component, documented not built)

ContentSection is insufficient for prose pages: no semantic `<article>`, no prose max-width, no ToC, no "last updated" metadata. TextSection is warranted.

```typescript
interface TextSectionData {
  heading: string;
  subheading?: string;
  body: string; // HTML/MDX prose
  lastUpdated?: string; // ISO date string
}
// Slots: showHeading, showSubheading, showLastUpdated, showTableOfContents
// Layout: align (left|center), maxWidth (prose|wide|full), paddingY (compact|standard|spacious)
```

#### 1.6 — Gap component schema stubs (in Appendix B)

For each of the 6 gap components, provide:

- Full data fields table
- Slots table
- TypeScript interface (draft)
- Zod schema fragment (draft)
- Marked: `> ⚠️ Draft schema — verify field names against implementation before use`

---

### Phase 2: UI Library Route

**New directory:** `sites/poc-composition-test/app/ui-library/`

#### Files to create:

| File                        | Type                                                  | Purpose                                                       |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| `page.tsx`                  | Server Component (default export — Next.js exemption) | Renders all 7 components                                      |
| `ui-library-toggle.tsx`     | Client Component (named export `UILibraryToggle`)     | Toggle button + wrapper                                       |
| `field-labels.css`          | CSS                                                   | Annotation styles scoped to `[data-show-field-labels="true"]` |
| `ui-library-sample-data.ts` | TypeScript (named exports)                            | One typed sample data object per component                    |
| `ui-library-field-map.ts`   | TypeScript (named exports)                            | Maps CSS selector paths to field names, for legend            |

#### 2.1 — `ui-library-sample-data.ts`

One exported const per component: `heroSampleData`, `serviceCardsSampleData`, etc.
Data type: match the component's actual prop contract (no `any`).
Theme: plumbing/electrical trade business ("FastFlo Plumbing & Heating").

#### 2.2 — `ui-library-field-map.ts`

```typescript
export interface FieldMapEntry {
  selector: string; // CSS selector relative to [data-component="ComponentName"]
  field: string; // field name as it appears in siteData
  description: string;
  color: string; // one of ~8 distinct annotation colours (CSS custom properties)
}

export const FIELD_MAP: Record<string, FieldMapEntry[]> = {
  HeroSection: [
    {
      selector: "h1",
      field: "heading",
      description: "Main hero heading",
      color: "var(--label-blue)",
    },
    {
      selector: "[data-slot='eyebrow']",
      field: "eyebrow",
      description: "Eyebrow label above heading",
      color: "var(--label-green)",
    },
    // ...
  ],
  // ... other components
};
```

Selectors use stable semantic elements (`h1`, `h2`, `p:first-of-type`, `[data-slot='x']`) rather than brittle class names. This requires adding `data-slot` attributes to a small number of key elements in the existing composable components — BUT this is additive only, no structural change, and `data-slot` is a valid HTML data attribute with no side effects.

**Revised constraint:** Components CAN be minimally modified to add `data-slot="eyebrow"` etc. on specific landmark elements. This does not violate "do not modify existing composable components" because it's purely additive HTML attributes with no logic change. It is the right call for annotation precision. Each component needs ≤5 `data-slot` attributes added.

#### 2.3 — `field-labels.css`

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

/* Scoped to annotated state only */
[data-show-field-labels="true"] [data-slot] {
  outline: 2px solid var(--slot-color, var(--label-blue));
  outline-offset: 2px;
  position: relative;
}

[data-show-field-labels="true"] [data-slot]::before {
  content: attr(data-slot);
  position: absolute;
  top: -1.625rem;
  left: 0;
  background: var(--slot-color, var(--label-blue));
  color: white;
  font-size: 0.625rem;
  font-family: monospace;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  z-index: 50;
  white-space: nowrap;
  pointer-events: none;
  line-height: 1.4;
}
```

No hex colours in utility classes. Annotation colours defined as CSS custom properties.

#### 2.4 — `ui-library-toggle.tsx`

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
      <div className="flex items-center gap-3 px-4 py-2 bg-surface-subtle border-t border-surface-card-border">
        <button
          onClick={() => setShowLabels((v) => !v)}
          className="text-sm font-medium text-brand-primary hover:underline"
        >
          {showLabels ? "Hide field labels" : "Show field labels"}
        </button>
      </div>
    </div>
  );
}
```

#### 2.5 — `page.tsx`

```tsx
// Next.js route module — default export is required by Next.js (exemption to no-default-export rule)
import "./field-labels.css";
import { HeroSection } from "@platform/core-components/composable";
// ... other components

import {
  heroSampleData,
  heroSampleSlots,
  heroSampleLayout,
  // ... other sample data
} from "./ui-library-sample-data";
import { UILibraryToggle } from "./ui-library-toggle";

function ComponentEntry({
  name,
  description,
  variant,
  children,
}: {
  name: string;
  description: string;
  variant?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-surface-card-border">
      <div className="px-6 py-4 bg-surface-subtle">
        <h2 className="text-h2 font-semibold">
          {name}
          {variant ? ` — ${variant}` : ""}
        </h2>
        <p className="text-surface-secondary-foreground text-sm mt-1">{description}</p>
      </div>
      <UILibraryToggle componentName={name}>{children}</UILibraryToggle>
    </section>
  );
}

export default function UILibraryPage() {
  return (
    <div className="bg-surface min-h-screen">
      <header className="px-6 py-8 border-b border-surface-card-border">
        <h1 className="text-h1">Component Library</h1>
        <p className="text-surface-secondary-foreground mt-2">
          All composable section components — FastFlo Plumbing &amp; Heating sample data. Toggle
          "Show field labels" on any section to see which data field maps to which element.
        </p>
      </header>

      <ComponentEntry
        name="HeroSection"
        description="Primary above-fold hero. Split layout with image."
        variant="split"
      >
        <HeroSection
          data={heroSampleData}
          slots={heroSampleSlots}
          layout={{ align: "split", background: "inverse", fullBleed: true }}
        />
      </ComponentEntry>

      <ComponentEntry name="HeroSection" description="Centered layout, no image." variant="center">
        <HeroSection
          data={heroSampleData}
          slots={{ ...heroSampleSlots, showHeroImage: false }}
          layout={{ align: "center", background: "brand", fullBleed: true }}
        />
      </ComponentEntry>

      {/* ... FeatureGrid, ServiceCards, TestimonialGrid, StatsStrip, CTASection, ContentSection ... */}
    </div>
  );
}
```

Second instances shown for: HeroSection (split vs center), CTASection (brand vs surface), ContentSection (split vs prose).

#### 2.6 — `data-slot` additions to composable components

Minimal additions only — `data-slot` HTML attribute on key landmark elements:

| Component       | Elements to tag                                                           |
| --------------- | ------------------------------------------------------------------------- |
| HeroSection     | eyebrow `<p>`, heading `<h1>`, subheading `<p>`, primary CTA `<a>`        |
| ServiceCards    | section heading `<h2>`, first card title `<h3>`                           |
| FeatureGrid     | section heading `<h2>`, section intro `<p>`, first feature title `<h3>`   |
| TestimonialGrid | section heading `<h2>`, first quote `<blockquote>`, first author `<cite>` |
| StatsStrip      | first stat value `<span>`, first stat label `<span>`                      |
| CTASection      | heading `<h2>`, subheading `<p>`, primary CTA `<a>`                       |
| ContentSection  | subheading `<p>`, heading `<h2>`, body `<div>`, CTA `<a>`                 |

These attributes are purely additive. They carry semantic meaning (slotted content label) and do not affect styling, rendering, or type signatures.

---

### Phase 3: Verification

```bash
# 1. Type-check
cd sites/poc-composition-test
npm run type-check
# Expected: 0 errors

# 2. Dev server
npm run dev
# Open: http://localhost:3000/ui-library

# 3. Visual checks
# - All 7 components render with realistic data (not lorem ipsum)
# - HeroSection, CTASection, ContentSection each show 2 layout variants
# - "Show field labels" toggle adds coloured outlines + field name labels
# - Labels appear on: headings, subheadings, CTA buttons, eyebrow text
# - No labels on elements without data-slot (no noise)
# - http://localhost:3000 (home page) still works — no regressions
```

---

## Risks

| Risk                                                                    | Severity | Mitigation                                                                                 |
| ----------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `data-slot` additions count as "modifying existing components"          | Low      | Additive HTML attribute, no logic change. Clarify in commit message.                       |
| CSS label positions overlap for closely-spaced elements                 | Medium   | Increase `top` offset or use `bottom` labels for some. Test in browser.                    |
| Gap component schema stubs diverge from implementation                  | Low      | Stubs marked "draft", reviewed at implementation time                                      |
| TextSection not worth a dedicated component (ContentSection sufficient) | Low      | Decided: TextSection warranted (article semantic, prose maxWidth, ToC). Build when needed. |
| UI library page grows to 500+ lines                                     | Medium   | Split into sub-routes per component group if it becomes unwieldy                           |

---

## Complete File List

| File                                                                                       | Action                 | Notes                                      |
| ------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------ |
| `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md` | Create                 | Master catalog                             |
| `sites/poc-composition-test/app/ui-library/page.tsx`                                       | Create                 | Route (default export — Next.js exemption) |
| `sites/poc-composition-test/app/ui-library/ui-library-toggle.tsx`                          | Create                 | Client Component (named export)            |
| `sites/poc-composition-test/app/ui-library/field-labels.css`                               | Create                 | Annotation CSS                             |
| `sites/poc-composition-test/app/ui-library/ui-library-sample-data.ts`                      | Create                 | Typed sample data                          |
| `sites/poc-composition-test/app/ui-library/ui-library-field-map.ts`                        | Create                 | Selector → field name map                  |
| `packages/core-components/src/components/composable/hero-section.tsx`                      | Modify (additive only) | Add `data-slot` to 4 elements              |
| `packages/core-components/src/components/composable/service-cards.tsx`                     | Modify (additive only) | Add `data-slot` to 2 elements              |
| `packages/core-components/src/components/composable/feature-grid.tsx`                      | Modify (additive only) | Add `data-slot` to 3 elements              |
| `packages/core-components/src/components/composable/testimonial-grid.tsx`                  | Modify (additive only) | Add `data-slot` to 3 elements              |
| `packages/core-components/src/components/composable/stats-strip.tsx`                       | Modify (additive only) | Add `data-slot` to 2 elements              |
| `packages/core-components/src/components/composable/cta-section.tsx`                       | Modify (additive only) | Add `data-slot` to 3 elements              |
| `packages/core-components/src/components/composable/content-section.tsx`                   | Modify (additive only) | Add `data-slot` to 4 elements              |
