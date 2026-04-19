# Claude's Plan: Component Catalog and UI Library

**Date:** 2026-04-19
**Status:** Draft — pending Codex peer review
**Written independently before seeing any Codex output**

---

## Overview

Two deliverables in sequence:

1. **component-catalog.md** — the definitive reference document
2. **UI library route** — live Next.js page at `/ui-library` in `sites/poc-composition-test`

These are independent tasks. The catalog document informs what goes in the UI library, but the UI library only renders the 7 existing components — it does not depend on gap component documentation.

---

## Phase 1: Component Catalog Document

### File

`output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md`

### 1.1 — Document structure

Each component entry follows this template:

```markdown
## ComponentName

**Status:** Built | Documented (not built)
**Use when:** [one sentence — when to reach for this component]
**Page types:** [which page types it typically appears on]

### Data Fields

| Field   | Type   | Required | Description          |
| ------- | ------ | -------- | -------------------- |
| heading | string | yes      | Main section heading |
| ...     |        |          |                      |

### Slots (show/hide toggles)

| Slot        | Default | Controls                  |
| ----------- | ------- | ------------------------- |
| showEyebrow | true    | Small label above heading |
| ...         |         |                           |

### Layout Params

| Param | Values                  | Default | Effect                            |
| ----- | ----------------------- | ------- | --------------------------------- |
| align | left \| center \| split | left    | Text alignment and media position |
| ...   |                         |         |                                   |

### Interaction States

| Element    | Hover                       | Focus                     | Active   |
| ---------- | --------------------------- | ------------------------- | -------- |
| CTA button | brand-primary lift + shadow | ring-2 ring-brand-primary | scale-95 |
| ...        |                             |                           |          |

### Animation

Inherits site `animationPreset`. Per-section override via `motionConfig`:

- `enter`: fade-up | fade-in | slide-left | slide-right | scale | none
- `duration`: fast | normal | slow (maps to theme transitions)
- `delay`: 0 | 100 | 200 | 300 (ms)
```

### 1.2 — Animation system

**Global preset** (added to `SiteCompositionConfig`):

```typescript
animationPreset?: "none" | "subtle" | "energetic"
```

- `none` — no entrance animations, instant render
- `subtle` — fade-up with 300ms ease-out, staggered 100ms between sections
- `energetic` — slide-in + scale with 500ms, pronounced stagger

**Per-section override** (added to `BaseSectionConfig` as optional field, separate from `LayoutParams`):

```typescript
motionConfig?: {
  enter?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "none";
  duration?: "fast" | "normal" | "slow";
  delay?: number; // ms
}
```

Rationale for separate field (not inside `LayoutParams`): `LayoutParams` is visual structure (grid, spacing, background). Motion is behavioural. Keeping them separate preserves single-responsibility and makes it easier to strip animation from non-motion contexts (e.g. PDF renders, print, prefers-reduced-motion).

**Interaction states** are NOT configurable per-section. They are hardcoded in each component using theme tokens:

- Hover: `transition-all duration-[var(--transition-normal)] hover:-translate-y-0.5 hover:shadow-md`
- Focus: `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none`
- Active: `active:scale-95`

This is the right call because interaction states are branding decisions (owned by the component), not layout decisions (owned by the config). Documenting them in the catalog gives designers a reference without creating a config surface that nobody will use correctly.

### 1.3 — Header architecture decision

**The routing constraint:** `renderComposedPage` operates per-page. Header renders on every page. If Header is a section in `pages[n].sections`, it must be duplicated into every page config. This is error-prone and breaks the DRY principle.

**Decision: `headerConfig` as a top-level block in `SiteCompositionConfig`.**

```typescript
interface SiteCompositionConfig {
  version: "1";
  siteId: string;
  animationPreset?: "none" | "subtle" | "energetic";
  headerConfig?: HeaderConfig; // ← new
  footerConfig?: FooterConfig; // ← new
  defaultSlots?: Record<string, Record<string, boolean>>;
  pages: PageComposition[];
}
```

`headerConfig` is rendered by `app/layout.tsx` — not by `renderComposedPage`. This matches how Header currently works (it's in layout.tsx, not in page.tsx). The composition renderer doesn't need to know about it.

This approach:

- Keeps DRY — one header config for all pages
- Doesn't require touching `renderComposedPage`
- Keeps Header out of `ComponentName` union (prevents AI from inserting Header into page sections)
- Allows the AI passes to populate `headerConfig` just like they populate `pages`

**HeaderConfig shape:**

```typescript
interface NavItem {
  label: string;
  href: string;
  children?: NavItem[]; // dropdown items
  columns?: NavItem[][]; // mega-menu columns (array of columns, each an array of items)
  image?: { src: string; alt: string; href: string }; // mega-menu feature image
}

interface HeaderConfig {
  logo: {
    src?: string;
    alt: string;
    width?: number;
    height?: number;
    position: "left" | "center";
  };
  navigation: NavItem[];
  navStyle: "inline" | "hamburger-only" | "hamburger-desktop";
  megaMenu?: boolean; // enables multi-column dropdown support
  sticky: boolean;
  transparentOnScroll: boolean;
  appearance: "light" | "dark" | "blur";
  mobileBehaviour: "overlay" | "drawer-left" | "drawer-right";
  cta?: {
    label: string;
    href: string;
    position: "inline" | "none";
  };
  phone?: {
    display: string;
    tel: string;
  };
}
```

**States to document:**

- Default (scrolled position, appearance = solid)
- Transparent (at top of page, transparentOnScroll = true)
- Sticky (scrolled past threshold, shadow appears)
- Mobile closed (hamburger icon visible)
- Mobile open overlay (full-screen overlay with nav items, close button)
- Mobile open drawer (slide-in panel from left or right)
- Dropdown open (inline nav, single-level)
- Mega menu open (multi-column, optional feature image)

### 1.4 — Footer

```typescript
interface FooterConfig {
  logo?: { src: string; alt: string };
  tagline?: string;
  columns: FooterColumn[]; // link groups (services, locations, company, etc.)
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
  legal?: {
    copyright: string;
    links?: Array<{ label: string; href: string }>;
  };
  certifications?: Array<{ name: string; icon?: string; href?: string }>;
  builtBy?: { name: string; url: string };
}

interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href: string }>;
}
```

**Slots:**

- showNewsletter, showSocial, showCertifications, showAddress, showPhone, showOpeningHours, showBuiltBy

**Layout params:**

- columns: 2 | 3 | 4 (number of link group columns)
- background: surface | subtle | inverse | brand

### 1.5 — TextSection (for policy/about/terms pages)

`ContentSection` can handle prose pages but has no `<article>` semantic wrapper, no max-width prose constraint, and no support for heading anchors or table of contents. A dedicated TextSection is warranted:

```typescript
// TextSection — for policy, terms, privacy, about narrative pages
// Data fields:
{
  heading: string;
  subheading?: string;
  body: string;              // MDX/HTML prose
  lastUpdated?: string;      // ISO date — "Last updated: ..."
  tableOfContents?: boolean; // auto-generate from headings
}

// Slots:
showHeading, showSubheading, showLastUpdated, showTableOfContents

// Layout:
align: "left" | "center" (default: left for prose)
maxWidth: "prose" | "wide" | "full"
paddingY: "compact" | "standard" | "spacious"
```

### 1.6 — Gap components (documented, not built)

For each of the 6 gap components, document:

- Data fields table (same format as existing)
- Slots table
- Layout params
- TypeScript interface stub (so builder can drop it directly into types.ts)
- Zod schema stub (so builder can drop it directly into schemas.ts)

This is the right level — more than a field listing, less than a full implementation. Having schema stubs means the build phase is mechanical, not architectural.

**Gap components to document:**

1. `PortfolioGrid` — project tiles with image, title, category, description, CTA
2. `ContactFormSection` — form fields + optional map embed + contact details
3. `BlogGrid` — article cards with image, title, excerpt, author, date, category
4. `AccordionSection` — FAQ or expandable Q&A pairs
5. `LogoStrip` — row of partner/client/certification logos
6. `PricingTable` — tiered pricing with feature lists and CTAs

---

## Phase 2: UI Library Route

### Files to create

```
sites/poc-composition-test/app/ui-library/
  page.tsx              — Server Component, renders all 7 components
  FieldAnnotation.tsx   — Client Component, toggle wrapper
  ui-library.css        — Annotation styles (data-field highlight)
```

### 2.1 — FieldAnnotation client component

```tsx
// FieldAnnotation.tsx
"use client";

import { useState, useRef } from "react";

interface FieldAnnotationProps {
  children: React.ReactNode;
  fields: Array<{
    fieldName: string;
    selector: string; // CSS selector relative to the wrapper
    color: string; // for the label
  }>;
}
```

**The Server Component constraint:** Existing composable components are Server Components. They don't accept refs. We cannot add `data-field` attributes to their internal elements from outside.

**Solution:** Add `data-field` attributes directly to the wrapper elements in the UI library page (not in the existing components). The UI library constructs sample data objects and passes them — the component renders, then the annotation toggle applies CSS that highlights the wrapper element with a labelled border.

Concretely:

- Each data field used in the sample data is wrapped in a `<span data-field="fieldName">` in the sample data object where possible
- For non-text elements (images, layouts), the annotation panel below the component shows a table mapping field names to their role
- The toggle switches between "rendered view" and "annotated view" (adds `.show-annotations` class to the section wrapper)

**CSS approach (in `ui-library.css`):**

```css
/* When toggle is active, sections get .show-annotations */
.show-annotations [data-field] {
  outline: 2px solid var(--annotation-color, #3b82f6);
  position: relative;
}
.show-annotations [data-field]::before {
  content: attr(data-field);
  position: absolute;
  top: -1.5rem;
  left: 0;
  background: var(--annotation-color, #3b82f6);
  color: white;
  font-size: 0.625rem;
  font-family: monospace;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  z-index: 50;
  white-space: nowrap;
  pointer-events: none;
}
```

**Limitation acknowledged:** For complex components where internal structure can't be annotated from outside (e.g. image inside HeroSection), show a field reference table below the component. The table is always visible regardless of toggle state.

### 2.2 — Page structure

```tsx
// page.tsx — Server Component
import { HeroSection, ServiceCards, FeatureGrid, TestimonialGrid, StatsStrip, CTASection, ContentSection }
  from "@platform/core-components/composable";
import { FieldAnnotation } from "./FieldAnnotation";

// One realistic sample data set per component (trade/service business)
const heroData = { heading: "...", eyebrow: "...", ... };
const heroSlots = { showEyebrow: true, showSubheading: true, ... };
const heroLayout = { align: "split", background: "inverse", fullBleed: true };

export default function UILibraryPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Page header */}
      <header className="px-6 py-8 border-b border-surface-card-border">
        <h1 className="text-h1">Component Library</h1>
        <p className="text-surface-secondary-foreground mt-2">
          All composable section components with realistic sample data.
        </p>
        {/* FieldAnnotation toggle is a Client Component */}
      </header>

      {/* One entry per component */}
      <ComponentEntry
        name="HeroSection"
        description="Primary above-fold hero..."
        fields={heroFieldTable}
      >
        <HeroSection data={heroData} slots={heroSlots} layout={heroLayout} />
      </ComponentEntry>

      {/* ... repeat for all 7 */}
    </div>
  );
}
```

`ComponentEntry` is a Server Component wrapper that renders:

- Component name heading
- Description
- The component itself (passed as `children`)
- A field reference table (always visible — no toggle dependency)

The "Show field labels" toggle lives in a `FieldAnnotation` client component that wraps the rendered component and adds `.show-annotations` when active.

### 2.3 — Sample data philosophy

- All sample data uses a plumbing/electrical trade business theme (consistent with the platform's primary market)
- Data is realistic, not lorem ipsum
- One canonical slot configuration per component (the "typical" usage)
- Layout variations shown as a second instance for components with dramatically different layouts (e.g. HeroSection centered vs. split)

### 2.4 — Restyling workflow

When the user says "make HeroSection use `align: center` and `background: brand`", I update `heroLayout` in `page.tsx` and `npm run dev` hot-reloads. No config editor, no generator — direct prop editing. This is correct because the UI library is a development tool, not a production page.

---

## Phase 3: Type-check verification

```bash
cd sites/poc-composition-test
npm run type-check
npm run dev
# Open http://localhost:3000/ui-library
```

Expected: all 7 components render, toggle works, field reference tables are accurate.

---

## Risks and Trade-offs

| Risk                                                                            | Likelihood | Mitigation                                                                         |
| ------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `data-field` annotation doesn't work cleanly with Server Components             | High       | Use field reference tables as primary annotation, CSS overlay as enhancement only  |
| `headerConfig` top-level block requires schema changes                          | Medium     | The plan explicitly avoids touching `BaseSectionConfig` — headerConfig is additive |
| Gap component schema stubs become stale if the build uses different field names | Low        | Stubs are clearly marked "draft — verify before implementing"                      |
| UI library page grows unwieldy as catalog expands                               | Medium     | Split into component-specific pages later; for now a long single page is fine      |
| Animation motionConfig field placement (BaseSectionConfig vs LayoutParams)      | Low        | Decided: separate top-level field, rationale documented above                      |

---

## File List

| File                                                                                       | Action | Notes                              |
| ------------------------------------------------------------------------------------------ | ------ | ---------------------------------- |
| `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md` | Create | Master catalog document            |
| `sites/poc-composition-test/app/ui-library/page.tsx`                                       | Create | Server Component, all 7 components |
| `sites/poc-composition-test/app/ui-library/FieldAnnotation.tsx`                            | Create | Client Component toggle            |
| `sites/poc-composition-test/app/ui-library/ui-library.css`                                 | Create | Annotation CSS                     |

No changes to packages, existing components, or composition schema.

---

## Verification Gates

1. **After Phase 1:** Peer review `component-catalog.md` — does it cover all components? Are Header variants exhaustive? Are gap component stubs usable?

2. **After Phase 2 — build check:**

   ```bash
   cd sites/poc-composition-test && npm run type-check
   ```

   Must pass with 0 errors.

3. **After Phase 2 — visual check:**

   ```bash
   npm run dev
   # open http://localhost:3000/ui-library
   ```

   - All 7 components render with real-looking data
   - Toggle adds visible coloured borders + field labels
   - Field reference tables are accurate

4. **No regressions:**
   ```bash
   # Ensure existing home page still works
   # open http://localhost:3000
   ```
