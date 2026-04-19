# Claude's Plan: Component Composition System

**Date:** 2026-04-18
**Written before seeing Codex output**

---

## Phase 1: Slot System & Composition Schema

### 1.1 Define the slot system in `packages/theme-system/src/composition-types.ts` (new file)

The slot system needs to be typed per-component without a generic `Record<string, boolean>` that loses type safety. The pattern:

```typescript
// Each component exports its own slots interface + defaults
// The composition schema uses a discriminated union per component name

export interface SlotsConfig {
  [componentName: string]: Record<string, boolean>;
}

// Per-component slot interfaces (co-located with the component file):
export interface HeroSectionSlots {
  showSubheading: boolean;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
  showHeroImage: boolean;
  showTrustBadges: boolean;
}

export interface TestimonialCardSlots {
  showStars: boolean;
  showDate: boolean;
  showTitle: boolean;
  showAvatar: boolean;
  showAuthorName: boolean;
  showLocation: boolean;
}
// ... one interface per component
```

The composition config references slot overrides as `Record<string, boolean>` (untyped at the JSON level, typed at the component render level). The Zod schema validates that slot keys are strings and values are booleans — per-component key validation happens at the component itself via TypeScript merge, not at the JSON schema level. This is a deliberate trade-off: the JSON schema stays simple and the TypeScript compiler catches invalid slot keys when a developer writes a typed composition.

**Rationale:** Discriminated unions per component in Zod would make the schema 2000+ lines and brittle to maintain. The simpler approach is correct here.

### 1.2 `SiteCompositionConfig` Zod schema

```typescript
// packages/theme-system/src/composition-types.ts

const ComponentNameEnum = z.enum([
  "HeroSection",
  "HeroSplit",
  "ServiceCards",
  "TestimonialGrid",
  "StatsStrip",
  "CTASection",
  "ContentSection",
  "FAQSection",
  "SiteHeader",
  "SiteFooter",
  // ... all library components
]);

const LayoutParamsSchema = z.object({
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  paddingY: z.enum(["compact", "standard", "spacious"]).optional(),
  align: z.enum(["left", "center", "right", "split"]).optional(),
  maxItems: z.number().int().positive().optional(),
  fullBleed: z.boolean().optional(),
});

const SectionConfigSchema = z.object({
  component: ComponentNameEnum,
  slots: z.record(z.string(), z.boolean()).optional(),
  layout: LayoutParamsSchema.optional(),
  condition: z.string().optional(), // data key that must be non-empty; "always" = always render
  id: z.string().optional(), // for targeting in CSS / analytics
});

const PageCompositionSchema = z.object({
  pageType: z.string(),
  sections: z.array(SectionConfigSchema),
});

export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  pages: z.array(PageCompositionSchema),
});

export type SiteCompositionConfig = z.infer<typeof SiteCompositionConfigSchema>;
```

**`condition` evaluation:** At render time, a `condition` string maps to a data key. The renderer checks if `siteData[condition]` is non-empty (array with length > 0, string with length > 0, truthy object). `"always"` or absent = always render. This keeps the evaluation simple and avoids a mini expression language.

**Verification gate:** `npx tsx -e "import { SiteCompositionConfigSchema } from './packages/theme-system/src/composition-types.js'; console.log(SiteCompositionConfigSchema.parse({ version: '1', siteId: 'test', pages: [] }))"` — must parse without error.

---

## Phase 2: Component Library (6 components for PoC)

New location: `packages/core-components/src/components/library/` (separate from the existing `/ui/` directory to avoid confusion with legacy components).

Each component file structure:

```typescript
// 1. Slots interface
export interface ComponentNameSlots { ... }
// 2. Default slots constant
export const COMPONENT_NAME_DEFAULT_SLOTS: ComponentNameSlots = { ... }
// 3. Props interface (data props + optional slots + optional layout)
interface ComponentNameProps { ...; slots?: Partial<ComponentNameSlots>; layout?: LayoutParams; className?: string; }
// 4. Component (Server Component, no "use client")
export function ComponentName({ ..., slots: slotOverrides, layout }: ComponentNameProps) {
  const slots = { ...COMPONENT_NAME_DEFAULT_SLOTS, ...slotOverrides };
  // render using slots.showX conditionals and layout params for Tailwind classes
}
```

**The 6 PoC components and their key slots:**

### `HeroSection`

Covers: full-bleed dark hero (designlab), light split hero (navagarden) via `layout.align` and `layout.background`.
Slots: `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showHeroImage`, `showTrustBadges`, `showScrollIndicator`
Layout params used: `background` (inverse/surface/subtle), `align` (left/center/split), `fullBleed`

### `ServiceCards`

Covers: icon-circle cards (designlab), standard image cards (navagarden)
Slots: `showIcon`, `showImage`, `showDescription`, `showCta`, `showBadge`
Layout params: `columns` (2/3/4), `background`

### `TestimonialGrid`

Wraps individual testimonial cards in a grid
Slots (per card): `showStars`, `showDate`, `showAvatar`, `showAuthorName`, `showLocation`, `showTitle`
Layout params: `columns` (1/2/3), `background`

### `StatsStrip`

Key numbers band — compact horizontal row
Slots: `showLabel`, `showDescription`, `showDividers`
Layout params: `columns` (3/4), `background` (surface/inverse/brand), `paddingY`

### `CTASection`

Call to action band — heading + body + buttons
Slots: `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showTrustLine`
Layout params: `background`, `align`

### `ContentSection`

Flexible heading + body + optional image — covers about/intro sections
Slots: `showImage`, `showSubheading`, `showCta`, `showList`
Layout params: `align` (left/center/split), `background`, `fullBleed`

**Not in PoC (deferred):** FAQSection (stateful — needs `"use client"`), SiteHeader, SiteFooter (site-specific nav logic).

**Verification gate:** Each component renders in a Next.js dev server without TypeScript errors. A simple test page imports all 6 and renders them with default slots.

---

## Phase 3: Page Renderer

Location: `packages/core-components/src/lib/composition-renderer.tsx`

**Implementation:**

```typescript
import type { SiteCompositionConfig, PageCompositionSchema } from '@platform/theme-system/composition-types';
import { HeroSection } from '../components/library/hero-section';
import { ServiceCards } from '../components/library/service-cards';
// ... static imports for all library components

// Static registry — no dynamic import needed; tree-shaking handles unused components
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  HeroSection,
  ServiceCards,
  TestimonialGrid,
  StatsStrip,
  CTASection,
  ContentSection,
};

export function renderPage(
  config: SiteCompositionConfig,
  pageType: string,
  siteData: Record<string, unknown>
): React.ReactElement[] {
  const page = config.pages.find(p => p.pageType === pageType);
  if (!page) return [];

  return page.sections
    .filter(section => evaluateCondition(section.condition, siteData))
    .map((section, i) => {
      const Component = COMPONENT_REGISTRY[section.component];
      if (!Component) {
        console.warn(`Unknown component: ${section.component}`);
        return null;
      }
      // Merge defaultSlots from config with section-level slot overrides
      const defaultSlots = config.defaultSlots?.[section.component] ?? {};
      const slots = { ...defaultSlots, ...section.slots };
      return <Component key={section.id ?? i} slots={slots} layout={section.layout} {...extractDataProps(siteData, section.component)} />;
    })
    .filter(Boolean) as React.ReactElement[];
}

function evaluateCondition(condition: string | undefined, data: Record<string, unknown>): boolean {
  if (!condition || condition === 'always') return true;
  const val = data[condition];
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}
```

**Static imports are correct here** — dynamic imports add complexity and hydration concerns for Server Components. Since all components are known at build time, a static registry is the right approach. Unused components are tree-shaken.

**Data prop mapping (`extractDataProps`):** Each component in the registry declares what data keys it consumes (e.g. `HeroSection` needs `heading`, `subheading`, `heroImage`, `ctaButtons`). `extractDataProps` is a thin function that pulls the right keys from `siteData` and passes them as props. Alternative: components accept a generic `data` prop and destructure internally — this is simpler but less type-safe. The registry approach is better for the long term.

**Verification gate:** `renderPage(compositionConfig, 'home', mockSiteData)` returns an array of React elements without runtime errors. Test in a PoC page.

---

## Phase 4: Two-Pass AI Pipeline

### Pass 1: Structural analysis → `composition.json`

New file: `tools/lib/composition-prompts.ts`

**Prompt design:**

- Input: full `DesignBrief` JSON + component catalog (name, slots, layout params per component)
- Output format: `SiteCompositionConfig` JSON — explicit instruction to output nothing else
- Validation: `SiteCompositionConfigSchema.parse(output)` — reject and retry once on schema failure

The component catalog passed to the model:

```json
{
  "components": [
    {
      "name": "HeroSection",
      "description": "Primary hero — full-bleed or split. Use for the first section of any page.",
      "slots": ["showSubheading", "showPrimaryCta", "showSecondaryCta", "showHeroImage", "showTrustBadges"],
      "layoutParams": {
        "background": ["surface", "subtle", "inverse", "brand"],
        "align": ["left", "center", "split"],
        "fullBleed": "boolean"
      }
    },
    ...
  ]
}
```

The prompt instructs the model to:

1. Map each `pageBlueprints[].sections[]` entry to the best-fit component from the catalog
2. Set `slots` to disable sub-elements that were NOT observed in the reference (`contentSlots` in the blueprint)
3. Set `layout` params to reflect the reference's layout pattern (e.g. `split` → `align: "split"`)
4. Set `condition` based on whether the section appeared on all pages or conditionally

**Key insight:** The `contentSlots` field in each `SectionBlueprintBrief` already lists only observed elements. So the structural pass can directly infer which slots to disable: if `"showStars"` maps to a slot but `"rating"` is not in `contentSlots`, set `showStars: false`.

### Pass 2: Visual analysis → `theme.config.ts` + CSS

**Input:** DesignBrief (palette with provenance, typography scale, componentVariants, constraints)

**Output format:**

```typescript
// Output as a TypeScript literal — parseable by the site's theme.config.ts
{
  tokenConfig: {
    colors: { brand: { primary: "#DBA746", ... }, surface: { ... } },
    typography: { fontFamily: { sans: "...", heading: "..." }, ... },
    components: { button: { fontWeight: 700 }, card: { borderRadius: "md" } }
  },
  cssOverrides: [
    "/* Navagarden-specific overrides */",
    ".hero-section { background-image: url('...'); }",
    // token classes only — no hardcoded hex
  ]
}
```

The prompt instructs the model to:

1. Use `provenance: "computed"` tokens first (highest confidence), fall back to `"vision"` tokens
2. Map the `typography.scale` values to `ThemeConfig.typography` (size → rem, weight → numeric)
3. Express component-level tweaks (button fontWeight from computed styles) in `components`
4. Produce CSS overrides using only token custom properties (`var(--color-brand-primary)`)

**Verification gate:** The output `tokenConfig` parses against `ThemeConfigSchema` (existing Zod schema in `packages/theme-system`). CSS overrides are checked for hardcoded hex patterns (same regex as existing postprocessor).

---

## Phase 5: PoC Test Site

Location: `sites/poc-composition-test/`

Scaffold from `sites/base-template` but strip it to the minimum:

- `theme.config.ts` — populated by visual analysis pass output
- `app/layout.tsx` — standard shell, Google Fonts `<link>` tags
- `app/page.tsx` — imports `renderPage` from composition renderer, reads `composition.json`, renders home page
- `composition.json` — output of structural analysis pass (navagarden or designlab)
- No MDX content needed for PoC — mock `siteData` object with headings, CTAs, placeholder image paths

```typescript
// sites/poc-composition-test/app/page.tsx
import compositionConfig from '../composition.json';
import { SiteCompositionConfigSchema } from '@platform/theme-system/composition-types';
import { renderPage } from '@platform/core-components/lib/composition-renderer';

const config = SiteCompositionConfigSchema.parse(compositionConfig);
const siteData = { /* mock data matching navagarden content */ };

export default function HomePage() {
  return <main>{renderPage(config, 'home', siteData)}</main>;
}
```

**Verification gate:** `pnpm --filter poc-composition-test dev` serves a home page with all sections rendering. No TypeScript errors. No hardcoded hex values in rendered HTML (checked via browser DevTools → Computed styles → all colours resolve from CSS variables).

---

## Phase 6: Evaluate

Three evaluation questions:

1. **Visual fidelity** — does the page reflect the reference site's design language? Score 1–5 subjectively. Note which sections look close and which don't.

2. **Structural correctness** — are the right sections present in the right order? Are slots behaving as expected (e.g. `showDate: false` means date doesn't render)?

3. **Catalog gaps** — what sections from the reference's `pageBlueprints` couldn't be mapped to any catalog component? These become the backlog for expanding the library.

Document findings in `output/sessions/2026-04/2026-04-18_component-composition-system/poc-evaluation.md`.

---

## Risks & Trade-offs

**Risk 1: Data prop mapping complexity**
Each component needs to know what data to consume from `siteData`. If this is implicit (components pull by convention from a generic data object), it's flexible but fragile. If it's explicit (each component declares its data schema), it's safe but requires more upfront definition.
_Recommendation:_ Start with explicit prop definitions per component. The PoC has only 6 components so the cost is low.

**Risk 2: Condition evaluation is too simple**
`siteData[condition]` only handles single-key presence. Real conditions might be: "show testimonials only if there are 3 or more" or "show stats strip only on home page". A simple truthy check doesn't cover these.
_Recommendation:_ Accept this limitation for PoC. A condition expression language (e.g. JSONLogic) can be added later if needed.

**Risk 3: Named theme packages and existing sites**
`sites/dj-fox-electrical` and `sites/colossus-scaffolding` currently import from `@platform/themes/orion` and `@platform/themes/vega`. These sites must not break.
_Recommendation:_ Named theme packages remain untouched. The new system coexists. Existing sites keep their current architecture. New sites use the composition system. Migration is optional and incremental.

**Risk 4: RSC + data fetching**
The page renderer returns Server Components, but data (`siteData`) must come from somewhere. In a real site this would be MDX frontmatter, a CMS, or static JSON. For the PoC, a static mock object is fine. For production, the renderer needs to accept async data or be called inside a Server Component that fetches first.
_Recommendation:_ Keep the renderer synchronous for PoC. Document the async data pattern as a follow-up.

**Risk 5: CSS-only visual transfer may not be expressive enough for some references**
A dark background + orange primary + bold sans-serif heading is fully expressible in token values. A site with complex SVG patterns, gradient meshes, or CSS animations is not.
_Recommendation:_ Accept this. For the local-business market (trades, contractors, professional services), the design space is well within token expressibility. Exotic visual effects are out of scope.

---

## File Creation Summary

| File                                                                   | Action                                        |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| `packages/theme-system/src/composition-types.ts`                       | CREATE — SiteCompositionConfig Zod schema     |
| `packages/core-components/src/components/library/hero-section.tsx`     | CREATE                                        |
| `packages/core-components/src/components/library/service-cards.tsx`    | CREATE                                        |
| `packages/core-components/src/components/library/testimonial-grid.tsx` | CREATE                                        |
| `packages/core-components/src/components/library/stats-strip.tsx`      | CREATE                                        |
| `packages/core-components/src/components/library/cta-section.tsx`      | CREATE                                        |
| `packages/core-components/src/components/library/content-section.tsx`  | CREATE                                        |
| `packages/core-components/src/components/library/index.ts`             | CREATE — barrel export                        |
| `packages/core-components/src/lib/composition-renderer.tsx`            | CREATE                                        |
| `tools/lib/composition-prompts.ts`                                     | CREATE — structural + visual prompt functions |
| `sites/poc-composition-test/`                                          | CREATE — scaffolded from base-template        |
| `sites/poc-composition-test/composition.json`                          | CREATE — AI-generated via structural pass     |
| `sites/poc-composition-test/theme.config.ts`                           | CREATE — AI-generated via visual pass         |
