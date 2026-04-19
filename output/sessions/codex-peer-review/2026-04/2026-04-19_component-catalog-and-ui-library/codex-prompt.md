# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/
```

---

## Brief: Component Catalog and UI Library

**Date:** 2026-04-19
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

Note: no clarified brief was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.

---

### Problem Statement

The local business platform is adopting a config-driven site generation model. Sites are built by composing section components from JSON configuration — no generative TSX. Seven composable section components exist and are proven in a PoC site. Themes (orion, vega, etc.) are being retired; Header and Footer will become composable sections in this system.

Before expanding the catalog and building new components, we need two things:

1. **A definitive component catalog** — every section type a local service business site might need, with all constituent data fields, slots (show/hide toggles), layout params, animation config, and interaction states documented in a single reference document.

2. **A Next.js UI library route** — a live page at `/ui-library` in the PoC test site that renders each component with realistic data, with a client-side toggle that highlights which data field maps to which rendered element.

---

### Goals

1. Produce a master catalog document covering all section components needed for a complete local service business website — including Header, Footer, and policy/text page sections not yet in the system.

2. For each component, document completely:
   - All data fields (name, type, required/optional, description)
   - All slots (boolean show/hide toggles with what each controls)
   - All layout params (values, what each does)
   - Animation config: global preset + per-section override
   - Interaction states: hover, focus, active behaviours

3. For Header specifically, document all structural variants exhaustively:
   - Nav link styles (inline, hamburger-only, mega menu, dropdown)
   - States (sticky, transparent-on-scroll, solid)
   - Mobile: overlay, drawer, or collapsed
   - Mega menu: single-column, multi-column, with images
   - CTA button placement (inline, floating, none)
   - Logo position (left, centre)
   - Whether it should be a composable section or a separate `headerConfig` block

4. Build the UI library route in `sites/poc-composition-test/app/ui-library/` that:
   - Renders all 7 existing composable components with realistic trade/service business sample data
   - Has a "Show field labels" toggle (client-side) that annotates each rendered element with its field name
   - Is restyled by conversation — changing layout params/slots in the page TSX, not a config editor

---

### Non-Goals

- Do NOT build any new composable components (PortfolioGrid, ContactFormSection, BlogGrid, etc.)
- Do NOT build a Header or Footer composable component
- Do NOT build a config editor UI
- Do NOT modify any existing composable components or the composition schema
- Do NOT migrate existing sites away from themes yet

---

### Acceptance Criteria

1. A `component-catalog.md` document exists at `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md` covering:
   - All 7 existing components with complete field/slot/layout documentation
   - All 6 gap components (PortfolioGrid, ContactFormSection, BlogGrid, AccordionSection, LogoStrip, PricingTable) documented but not built
   - HeaderSection documented with all variant states
   - FooterSection documented with all variant options
   - TextSection (for policy/about/terms pages) documented
   - Animation system documented: global preset enum + per-section motionConfig override
   - Interaction states (hover, focus) documented per component

2. A UI library route exists at `sites/poc-composition-test/app/ui-library/page.tsx` that:
   - Renders all 7 existing components with sample data
   - Compiles and type-checks clean
   - Includes a client-side "Show field labels" toggle that annotates rendered elements

3. `npm run type-check` passes from `sites/poc-composition-test/`

---

### Constraints

**Architecture constraints (NON-NEGOTIABLE):**

- No Tailwind `theme()` function in CSS files — use `var(--token-name)` only
- No hardcoded hex colors — use theme token classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
- No default exports — named exports only
- No individual static page files — dynamic `[slug]` routes only (not relevant here, but reflects the MDX principle)
- TypeScript strict mode — no `any`, interfaces for all props
- The UI library page is a Server Component with a single Client Component wrapper for the toggle
- The existing composable components are already Server Components — do not add `"use client"` to them
- Tailwind content globs: never use `packages/themes/**/*` — use scoped patterns

**System constraints:**

- The 7 existing composable components accept `{ slots, layout, data, className }` props — the UI library must pass data directly, not via the composition renderer
- The `data-field` toggle approach should add coloured borders + floating labels via CSS, not DOM manipulation
- The UI library page should be self-contained — no changes to existing pages or composition.json

**Header/Footer constraint:**

- Current theme Header/Footer components are Server Components that accept typed props (see Codebase Snapshot)
- The composition system's `renderComposedPage` has no awareness of Header/Footer
- Any plan for Header as a composable section must address the routing constraint: Header renders on every page, so it cannot be a section in a single-page config

---

### Relevant Architecture

**Composition system package** (`packages/component-composition/src/`):

```typescript
// types.ts
export type ComponentName =
  | "HeroSection"
  | "ServiceCards"
  | "FeatureGrid"
  | "TestimonialGrid"
  | "StatsStrip"
  | "CTASection"
  | "ContentSection";

export interface LayoutParams {
  columns?: 1 | 2 | 3 | 4;
  background?: "surface" | "subtle" | "inverse" | "brand" | "muted";
  paddingY?: "compact" | "standard" | "spacious";
  align?: "left" | "center" | "right" | "split";
  maxItems?: number;
  fullBleed?: boolean;
  mediaPosition?: "left" | "right" | "top" | "bottom";
}

export interface BaseSectionConfig {
  id?: string;
  component: ComponentName;
  slots?: Record<string, boolean>;
  layout?: LayoutParams;
  condition?: ConditionConfig;
  dataKey?: string;
}

export interface SiteCompositionConfig {
  version: "1";
  siteId: string;
  defaultSlots?: Record<string, Record<string, boolean>>;
  pages: PageComposition[];
}
```

**Component props contract** (all 7 existing components):

```typescript
interface ComposableComponentProps {
  slots?: Record<string, boolean>;
  layout?: Record<string, unknown>;
  data: Record<string, unknown>;
  className?: string;
}
```

**Renderer** (`render-page.tsx`):

```typescript
export function renderComposedPage(options: {
  composition: SiteCompositionConfig;
  pageType: string;
  data: Record<string, unknown>;
  flags?: Record<string, unknown>;
}): RenderResult;
```

**PoC site integration** (`sites/poc-composition-test/app/page.tsx`):

```typescript
import compositionConfig from "../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default function HomePage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "home",
    data: siteData,
  });
  return <main className="min-h-screen">{elements}</main>;
}
```

**Theme system** (`packages/theme-system/src/types.ts`):

- `ThemeConfig` has: colors (brand + surface + semantic), spacing, radii, shadows, transitions, typography, components
- `components.navigation.style`: "transparent" | "solid" | "blur"
- `components.hero.variant`: "centered" | "split" | "fullscreen" | "full-bleed"

**Current theme Header props** (to be retired, but informs what Header needs):

```typescript
// Orion/Vega Header accepts:
{
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

// Footer accepts:
{
  siteName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { locality: string; region: string };
  certifications: Array<{ name: string; description: string; icon?: string }>;
  services: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; title: string }>;
  copyright: string;
}
```

---

### Codebase Snapshot

```
packages/
  component-composition/src/
    types.ts              — TypeScript interfaces
    schemas.ts            — Zod validation schemas
    registry.ts           — ComponentName → ComponentDefinition map
    render-page.tsx       — renderComposedPage() function
    conditions.ts         — condition evaluator

  core-components/src/components/composable/
    hero-section.tsx      — HeroSection composable component
    service-cards.tsx     — ServiceCards composable component
    feature-grid.tsx      — FeatureGrid composable component
    testimonial-grid.tsx  — TestimonialGrid composable component
    stats-strip.tsx       — StatsStrip composable component
    cta-section.tsx       — CTASection composable component
    content-section.tsx   — ContentSection composable component

  themes/orion/components/
    header.tsx            — OrionHeader Server Component (to be retired)
    footer.tsx            — OrionFooter Server Component (to be retired)
  themes/vega/components/
    header.tsx            — VegaHeader Server Component (to be retired)
    footer.tsx            — VegaFooter Server Component (to be retired)

  theme-system/src/types.ts  — ThemeConfig, LayoutParams, ComponentRegistry

tools/lib/
  composition-catalog.ts        — AI-readable catalog (7 components)
  composition-structural-pass.ts — Claude AI structural pass
  composition-visual-pass.ts    — Claude AI visual pass

sites/poc-composition-test/
  app/page.tsx            — Home page (uses renderComposedPage)
  app/ui-library/         — TO BE CREATED
  composition.json        — Live SiteCompositionConfig
  lib/page-data.ts        — Mock siteData object
  tailwind.config.ts      — Tailwind config with theme tokens
```

---

### What a Good Plan Should Cover

1. **Component catalog structure** — how to organise the catalog document so it is both human-readable and can eventually be machine-parsed. Should each component entry follow the same schema? Should animation and interaction be inline or in a separate global section?

2. **Animation system design** — the decision is: global preset (enum: none | subtle | energetic) + per-section override (full motionConfig object). What should the motionConfig shape be? What animation types are worth supporting (fade-up, slide-in, scale, parallax)? How does this integrate with the existing `LayoutParams` interface — should it be added there or as a separate top-level field in `BaseSectionConfig`?

3. **Interaction state documentation** — hover lift, glow, colour shift, underline. How granular should this be per component? Should hover states be slots (show/hide), tokens (reference theme transition values), or just documented as "component default" with no config?

4. **Header composable section** — the routing constraint is real: Header renders on every page but `renderComposedPage` operates per-page. The options are: (a) a separate `headerConfig` block in `SiteCompositionConfig`, (b) Header as a reserved first section on every page config with a shared slot, (c) Header remains outside the composition system and is configured via `site.config.ts`. Which is correct?

5. **Field label toggle implementation** — the plan must be concrete about how `data-field` attributes are applied to rendered elements given that the existing components are Server Components. Options: (a) wrap each component call in the UI library page with a client component that adds attributes via ref, (b) add `data-field` attributes directly in the component JSX (but this leaks UI library concerns into production components), (c) use a CSS overlay approach with absolute-positioned labels. Which is feasible without modifying existing components?

6. **UI library page structure** — should it be one long scrolling page, or tabbed by component? Should layout param variations be shown as multiple instances of each component, or a single instance with a sidebar control? (Remember: restyling is via conversation, not a config editor.)

7. **TextSection** — policy pages, about pages, and terms pages need a simple prose section. What fields does it need? Is `ContentSection` sufficient, or is a dedicated TextSection warranted?

8. **Scope of the catalog gaps** — PortfolioGrid, ContactFormSection, BlogGrid, AccordionSection, LogoStrip, PricingTable are documented but not built. Should the catalog doc include schema stubs (TypeScript interface + Zod schema fragments) to make them easy to build later, or just field listings?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/`
