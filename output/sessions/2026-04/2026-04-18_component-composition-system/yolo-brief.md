# YOLO Implementation Brief: Component Composition System

**Branch:** feature/component-composition-system (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-18_component-composition-system/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The current pipeline generates raw TSX per section using Claude, conflating structural composition and visual styling into a single fragile generative act. This plan replaces that with a configuration-driven composition system: a library of slot-aware Server Component sections, a per-site JSON composition config, and a two-pass AI pipeline (structural → composition.json, visual → theme.config.ts + CSS). The approach was dual-model reviewed (Claude + Codex) and synthesised into this spec.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15/$75                | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3/$15                 | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80/$4               | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/component-composition-system
pnpm type-check   # must be clean before starting
```

STOP if either fails.

---

## Phase 0: Architecture Decision Document

**Goal:** Write the architecture decision document that locks invariants before any code is written.
**Model:** haiku — pure writing, no code

Read `docs/architecture/` directory listing to understand existing doc format and conventions.

Create `docs/architecture/component-composition-system.md` with these sections:

- **Purpose:** Replace generative TSX with configuration-driven composition
- **Core invariants:**
  - Structural composition and visual styling are separate artifacts and separate AI passes
  - `SiteCompositionConfig` is the only source of page structure (not page TSX files)
  - Per-site `theme.config.ts` + CSS are the only visual inputs; named themes are optional presets
  - Slot toggles are binary visibility only — no style variants in slots
  - All composable components are Server Components by default — no `"use client"` unless genuinely stateful
  - Token classes only — no hardcoded hex, no inline styles, no `theme()` function in CSS
- **Slot toggle semantics:** Binary show/hide. Sub-element appears or doesn't. Style variants belong in token values or layout params.
- **Condition model:** Structured `ConditionConfig` object `{ type: "always" | "flag" | "data-present"; key?: string; equals?: ... }`. Not an expression language.
- **Package boundaries:** `packages/component-composition/` for runtime (schemas, registry, conditions, renderer). Composable section components in `packages/core-components/src/components/composable/`.
- **Named theme packages:** Optional presets (`packages/themes/orion`, `vega`, etc.) — not required architecture. Existing sites are unaffected.
- **Migration:** New system coexists with existing sites and named themes. No breakage.

The doc answers these three questions: "Where do layout choices live?" (composition JSON), "Where does visual identity live?" (theme tokens + CSS), "Where do slot toggles live?" (composition JSON, Zod-validated).

```bash
# Verification gate — STOP if this fails
test -f docs/architecture/component-composition-system.md && echo "PASS: doc exists" || echo "FAIL: doc missing"
```

```bash
git add docs/architecture/component-composition-system.md
git commit -m "docs(architecture): add component composition system decision document

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 1: Composition Package — Types, Schemas, Conditions

**Goal:** Create `packages/component-composition/` with core type system, Zod schemas, and condition evaluator.
**Model:** sonnet

Read in parallel (G1): `packages/theme-system/src/types.ts`, `packages/theme-system/package.json`, `packages/core-components/package.json`, `tools/lib/design-brief-types.ts`

**Step 1: Create package scaffold**

Create `packages/component-composition/package.json`:

```json
{
  "name": "@platform/component-composition",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0"
  }
}
```

Create `packages/component-composition/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**Step 2: Create `src/types.ts`**

```typescript
// PageType — align with reference-analysis types
export type PageType =
  | "home"
  | "about"
  | "services-list"
  | "service-detail"
  | "location-detail"
  | "blog-list"
  | "blog-post"
  | "contact"
  | "projects"
  | "custom";

// ComponentName — source of truth; registry derives from this
export const COMPONENT_NAMES = [
  "HeroSection",
  "ServiceCards",
  "FeatureGrid",
  "TestimonialGrid",
  "StatsStrip",
  "CTASection",
  "ContentSection",
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

// ConditionConfig — structured condition for section rendering
export interface ConditionConfig {
  type: "always" | "flag" | "data-present";
  key?: string;
  equals?: string | boolean | number;
}

// RenderDiagnostic — non-fatal render error
export interface RenderDiagnostic {
  sectionIndex: number;
  component: string;
  error: string;
  severity: "warning" | "error";
}

// RenderResult
export interface RenderResult {
  elements: React.ReactElement[];
  diagnostics: RenderDiagnostic[];
}

// SiteCompositionConfig interfaces
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
}

export interface PageComposition {
  pageType: PageType | string;
  sections: BaseSectionConfig[];
}

export interface SiteCompositionConfig {
  version: "1";
  siteId: string;
  defaultSlots?: Record<string, Record<string, boolean>>;
  pages: PageComposition[];
}
```

**Step 3: Create `src/conditions.ts`**

```typescript
import type { ConditionConfig } from "./types";

export function evaluateCondition(
  condition: ConditionConfig | undefined,
  ctx: { flags?: Record<string, unknown>; data?: Record<string, unknown> }
): boolean {
  if (!condition || condition.type === "always") return true;

  const flags = ctx.flags ?? {};
  const data = ctx.data ?? {};

  if (condition.type === "flag") {
    if (!condition.key) return true;
    const val = flags[condition.key];
    if (condition.equals !== undefined) return val === condition.equals;
    return Boolean(val);
  }

  if (condition.type === "data-present") {
    if (!condition.key) return true;
    const val = data[condition.key];
    if (val == null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return Boolean(val);
  }

  return true;
}
```

**Step 4: Create `src/schemas.ts`** (stub — discriminated union added in Phase 3 once component schemas exist)

```typescript
import { z } from "zod";
import { COMPONENT_NAMES } from "./types";

export const ConditionConfigSchema = z.object({
  type: z.enum(["always", "flag", "data-present"]),
  key: z.string().optional(),
  equals: z.union([z.string(), z.boolean(), z.number()]).optional(),
});

export const LayoutParamsSchema = z.object({
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  paddingY: z.enum(["compact", "standard", "spacious"]).optional(),
  align: z.enum(["left", "center", "right", "split"]).optional(),
  maxItems: z.number().int().positive().optional(),
  fullBleed: z.boolean().optional(),
  mediaPosition: z.enum(["left", "right", "top", "bottom"]).optional(),
});

// Stub SectionSchema — replaced with discriminated union in Phase 3
export const SectionSchema = z.object({
  id: z.string().optional(),
  component: z.enum(COMPONENT_NAMES),
  slots: z.record(z.string(), z.boolean()).optional(),
  layout: LayoutParamsSchema.optional(),
  condition: ConditionConfigSchema.optional(),
});

export const PageCompositionSchema = z.object({
  pageType: z.string(),
  sections: z.array(SectionSchema),
});

export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  pages: z.array(PageCompositionSchema),
});
```

**Step 5: Create `src/index.ts`**

```typescript
export * from "./types";
export * from "./conditions";
export * from "./schemas";
```

Add `@platform/component-composition: workspace:*` to root `pnpm-workspace.yaml` if packages are listed there. Otherwise pnpm auto-discovers via `packages/*/package.json`.

```bash
# Verification gate — STOP if this fails
pnpm install && npx tsx -e "
async function main() {
  const { SiteCompositionConfigSchema } = await import('./packages/component-composition/src/schemas.js');
  const result = SiteCompositionConfigSchema.parse({ version: '1', siteId: 'test', pages: [] });
  console.log(result.version === '1' ? 'PASS: schema valid' : 'FAIL');
  try {
    SiteCompositionConfigSchema.parse({ version: '1', siteId: 'test', pages: [{ pageType: 'home', sections: [{ component: 'INVALID_COMPONENT' }] }] });
    console.log('FAIL: should have rejected invalid component name');
  } catch (e) {
    console.log('PASS: invalid component name rejected');
  }
}
main().catch(console.error);
" 2>&1
```

```bash
git add packages/component-composition/
git commit -m "feat(composition): add component-composition package with types, schemas, conditions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Composable Section Components (7)

**Goal:** Create 7 slot-aware Server Component sections in `packages/core-components/src/components/composable/`.
**Model:** sonnet

Read in parallel (G2): `packages/core-components/src/index.ts`, `packages/core-components/package.json`, `packages/theme-system/src/types.ts`

Each component requires two files:

- `ComponentName.tsx` — component + props interface + DEFAULT_SLOTS (zod-free)
- `ComponentName.slots.ts` — `ComponentNameSlotsSchema` + `ComponentNameLayoutSchema` (zod@3 `.object({...}).strict()`)

**Hard constraints enforced on every component:**

- No `"use client"` directive
- No `@/lib/*` imports
- No hardcoded hex values — only Tailwind token classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
- Named exports only — no `export default`
- Images via `next/image` with `src` from `data` prop

Create `packages/core-components/src/components/composable/` directory.

**Create all 7 components.** Use the component pattern below for each:

```typescript
// ComponentName.tsx template
import type { LayoutParams } from "@platform/component-composition";

export interface ComponentNameSlots {
  showX: boolean;
  showY: boolean;
  // ...
}

export const COMPONENT_NAME_DEFAULT_SLOTS: ComponentNameSlots = {
  showX: true,
  showY: true,
};

interface ComponentNameProps {
  slots?: Partial<ComponentNameSlots>;
  layout?: Pick<LayoutParams, "background" | "align" /* relevant params */>;
  data: Record<string, unknown>;
  className?: string;
}

export function ComponentName({
  slots: slotOverrides,
  layout,
  data,
  className,
}: ComponentNameProps) {
  const slots = { ...COMPONENT_NAME_DEFAULT_SLOTS, ...slotOverrides };

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  // ... render using slots.showX conditionals
}
```

```typescript
// ComponentName.slots.ts template
import { z } from "zod";

export const ComponentNameSlotsSchema = z
  .object({
    showX: z.boolean(),
    showY: z.boolean(),
  })
  .strict();

export const ComponentNameLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
    align: z.enum(["left", "center", "right", "split"]).optional(),
    // only params relevant to this component
  })
  .strict();
```

**The 7 components — slots and layout params:**

**HeroSection** (`hero-section.tsx` + `hero-section.slots.ts`):

- Slots: `showEyebrow`, `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showHeroImage`, `showTrustBadges`
- Layout: `background`, `align` (left/center/split), `fullBleed`
- Data keys: `heading`, `eyebrow`, `subheading`, `primaryCtaText`, `primaryCtaHref`, `secondaryCtaText`, `secondaryCtaHref`, `heroImage`, `trustBadges`
- Render: When `align === "split"`, render a two-column grid (text left, image right). When `align === "center"` or `"left"`, render stacked. `fullBleed` makes the section `min-h-[60vh]`.

**ServiceCards** (`service-cards.tsx` + `service-cards.slots.ts`):

- Slots: `showIcon`, `showImage`, `showDescription`, `showCta`, `showBadge`
- Layout: `columns` (2/3/4), `background`
- Data keys: `heading`, `subheading`, `services` (array of `{ title, description, icon, image, href, badge }`)
- Render: Section heading + grid of cards. Column count from `layout.columns ?? 3`.

**FeatureGrid** (`feature-grid.tsx` + `feature-grid.slots.ts`):

- Slots: `showSectionHeading`, `showSectionIntro`, `showIcons`, `showDescriptions`
- Layout: `columns` (2/3/4), `background`
- Data keys: `heading`, `intro`, `features` (array of `{ title, description, icon }`)
- Render: Icon-card grid — icon above title above description.

**TestimonialGrid** (`testimonial-grid.tsx` + `testimonial-grid.slots.ts`):

- Slots: `showStars`, `showDate`, `showAvatar`, `showAuthorName`, `showLocation`, `showTitle`
- Layout: `columns` (1/2/3), `background`
- Data keys: `heading`, `subheading`, `testimonials` (array of `{ name, location, rating, text, title, date, avatarInitials }`)
- Render: Section heading + grid of testimonial cards.

**StatsStrip** (`stats-strip.tsx` + `stats-strip.slots.ts`):

- Slots: `showLabel`, `showDescription`, `showDividers`
- Layout: `columns` (3/4), `background`, `paddingY`
- Data keys: `stats` (array of `{ value, label, description }`)
- Render: Horizontal strip of stat items. Dividers between items when `slots.showDividers`.

**CTASection** (`cta-section.tsx` + `cta-section.slots.ts`):

- Slots: `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showTrustLine`
- Layout: `background`, `align`
- Data keys: `heading`, `subheading`, `primaryCtaText`, `primaryCtaHref`, `secondaryCtaText`, `secondaryCtaHref`, `trustLine`
- Render: Full-width band with heading, optional subheading, CTA buttons.

**ContentSection** (`content-section.tsx` + `content-section.slots.ts`):

- Slots: `showImage`, `showSubheading`, `showCta`, `showList`
- Layout: `align` (left/center/split), `background`, `fullBleed`
- Data keys: `heading`, `subheading`, `body`, `image`, `ctaText`, `ctaHref`, `listItems`
- Render: Flexible heading + body prose + optional image. When `align === "split"`, two-column layout.

**Create barrel `packages/core-components/src/components/composable/index.ts`:**

```typescript
export * from "./hero-section";
export * from "./service-cards";
export * from "./feature-grid";
export * from "./testimonial-grid";
export * from "./stats-strip";
export * from "./cta-section";
export * from "./content-section";
// slots schemas
export * from "./hero-section.slots";
export * from "./service-cards.slots";
export * from "./feature-grid.slots";
export * from "./testimonial-grid.slots";
export * from "./stats-strip.slots";
export * from "./cta-section.slots";
export * from "./content-section.slots";
```

**Modify `packages/core-components/src/index.ts`** — append:

```typescript
export * from "./components/composable";
```

```bash
# Verification gate — STOP if any fails
pnpm --filter @platform/core-components type-check
grep -rn '#[0-9a-fA-F]\{6\}' packages/core-components/src/components/composable/ && echo "FAIL: hardcoded hex found" || echo "PASS: no hardcoded hex"
grep -rn '"use client"' packages/core-components/src/components/composable/ && echo "FAIL: use client found" || echo "PASS: no use client"
grep -rn 'export default' packages/core-components/src/components/composable/ && echo "FAIL: default export found" || echo "PASS: no default exports"
```

```bash
git add packages/core-components/src/components/composable/ packages/core-components/src/index.ts
git commit -m "feat(composition): add 7 composable section components with slot system

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Component Registry and Page Renderer

**Goal:** Wire the static component registry and non-fatal page renderer in `packages/component-composition/`.
**Model:** sonnet

Read in parallel (G3): `packages/component-composition/src/types.ts`, `packages/component-composition/src/schemas.ts`, `packages/core-components/src/components/composable/index.ts`

**Step 1: Create `packages/component-composition/src/registry.ts`**

```typescript
import type React from "react";
import type { z } from "zod";
import {
  HeroSection,
  HeroSectionSlots,
  HERO_SECTION_DEFAULT_SLOTS,
} from "@platform/core-components";
import {
  ServiceCards,
  ServiceCardsSlots,
  SERVICE_CARDS_DEFAULT_SLOTS,
} from "@platform/core-components";
import {
  FeatureGrid,
  FeatureGridSlots,
  FEATURE_GRID_DEFAULT_SLOTS,
} from "@platform/core-components";
import {
  TestimonialGrid,
  TestimonialGridSlots,
  TESTIMONIAL_GRID_DEFAULT_SLOTS,
} from "@platform/core-components";
import { StatsStrip, StatsStripSlots, STATS_STRIP_DEFAULT_SLOTS } from "@platform/core-components";
import { CTASection, CTASectionSlots, CTA_SECTION_DEFAULT_SLOTS } from "@platform/core-components";
import {
  ContentSection,
  ContentSectionSlots,
  CONTENT_SECTION_DEFAULT_SLOTS,
} from "@platform/core-components";
import {
  HeroSectionSlotsSchema,
  HeroSectionLayoutSchema,
  ServiceCardsSlotsSchema,
  ServiceCardsLayoutSchema,
  FeatureGridSlotsSchema,
  FeatureGridLayoutSchema,
  TestimonialGridSlotsSchema,
  TestimonialGridLayoutSchema,
  StatsStripSlotsSchema,
  StatsStripLayoutSchema,
  CTASectionSlotsSchema,
  CTASectionLayoutSchema,
  ContentSectionSlotsSchema,
  ContentSectionLayoutSchema,
} from "@platform/core-components";
import type { ComponentName } from "./types";

export interface ComponentDefinition {
  component: React.ComponentType<any>;
  defaultSlots: Record<string, boolean>;
  slotsSchema: z.ZodObject<any>;
  layoutSchema: z.ZodObject<any>;
}

export const COMPONENT_REGISTRY: Record<ComponentName, ComponentDefinition> = {
  HeroSection: {
    component: HeroSection,
    defaultSlots: HERO_SECTION_DEFAULT_SLOTS,
    slotsSchema: HeroSectionSlotsSchema,
    layoutSchema: HeroSectionLayoutSchema,
  },
  ServiceCards: {
    component: ServiceCards,
    defaultSlots: SERVICE_CARDS_DEFAULT_SLOTS,
    slotsSchema: ServiceCardsSlotsSchema,
    layoutSchema: ServiceCardsLayoutSchema,
  },
  FeatureGrid: {
    component: FeatureGrid,
    defaultSlots: FEATURE_GRID_DEFAULT_SLOTS,
    slotsSchema: FeatureGridSlotsSchema,
    layoutSchema: FeatureGridLayoutSchema,
  },
  TestimonialGrid: {
    component: TestimonialGrid,
    defaultSlots: TESTIMONIAL_GRID_DEFAULT_SLOTS,
    slotsSchema: TestimonialGridSlotsSchema,
    layoutSchema: TestimonialGridLayoutSchema,
  },
  StatsStrip: {
    component: StatsStrip,
    defaultSlots: STATS_STRIP_DEFAULT_SLOTS,
    slotsSchema: StatsStripSlotsSchema,
    layoutSchema: StatsStripLayoutSchema,
  },
  CTASection: {
    component: CTASection,
    defaultSlots: CTA_SECTION_DEFAULT_SLOTS,
    slotsSchema: CTASectionSlotsSchema,
    layoutSchema: CTASectionLayoutSchema,
  },
  ContentSection: {
    component: ContentSection,
    defaultSlots: CONTENT_SECTION_DEFAULT_SLOTS,
    slotsSchema: ContentSectionSlotsSchema,
    layoutSchema: ContentSectionLayoutSchema,
  },
};
```

**Step 2: Update `packages/component-composition/src/schemas.ts`**

Replace the stub `SectionSchema` with a discriminated union built from registry schemas. Import each component's `SlotsSchema` and `LayoutSchema`. Build per-component section schemas and combine:

```typescript
// Add after existing imports:
import {
  HeroSectionSlotsSchema,
  HeroSectionLayoutSchema /* ... all 7 */,
} from "@platform/core-components";

const HeroSectionSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("HeroSection"),
  slots: HeroSectionSlotsSchema.partial().optional(),
  layout: HeroSectionLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});
// ... repeat for all 7 components

export const SectionSchema = z.discriminatedUnion("component", [
  HeroSectionSectionSchema,
  ServiceCardsSectionSchema,
  FeatureGridSectionSchema,
  TestimonialGridSectionSchema,
  StatsStripSectionSchema,
  CTASectionSectionSchema,
  ContentSectionSectionSchema,
]);

// Update SiteCompositionConfigSchema to use new SectionSchema
export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  pages: z.array(
    z.object({
      pageType: z.string(),
      sections: z.array(SectionSchema),
    })
  ),
});
```

**Step 3: Create `packages/component-composition/src/render-page.tsx`**

```typescript
import React from "react";
import { evaluateCondition } from "./conditions";
import { COMPONENT_REGISTRY } from "./registry";
import type { SiteCompositionConfig, ComponentName, RenderDiagnostic, RenderResult } from "./types";

export function renderComposedPage(options: {
  composition: SiteCompositionConfig;
  pageType: string;
  data: Record<string, unknown>;
  flags?: Record<string, unknown>;
}): RenderResult {
  const { composition, pageType, data, flags = {} } = options;
  const page = composition.pages.find((p) => p.pageType === pageType);
  const diagnostics: RenderDiagnostic[] = [];

  if (!page) {
    diagnostics.push({
      sectionIndex: -1,
      component: "",
      error: `No page found for pageType "${pageType}"`,
      severity: "warning",
    });
    return { elements: [], diagnostics };
  }

  const elements: React.ReactElement[] = [];

  page.sections.forEach((section, index) => {
    // Evaluate condition
    if (!evaluateCondition(section.condition, { flags, data })) return;

    const definition = COMPONENT_REGISTRY[section.component as ComponentName];
    if (!definition) {
      diagnostics.push({
        sectionIndex: index,
        component: section.component,
        error: `Unknown component "${section.component}"`,
        severity: "error",
      });
      return;
    }

    // Merge defaultSlots from config + section-level slots
    const configDefaults = composition.defaultSlots?.[section.component] ?? {};
    const slots = { ...definition.defaultSlots, ...configDefaults, ...section.slots };

    try {
      const Component = definition.component;
      elements.push(
        React.createElement(Component, {
          key: section.id ?? `section-${index}`,
          slots,
          layout: section.layout,
          data,
        })
      );
    } catch (err) {
      diagnostics.push({
        sectionIndex: index,
        component: section.component,
        error: err instanceof Error ? err.message : String(err),
        severity: "error",
      });
    }
  });

  return { elements, diagnostics };
}
```

**Step 4: Update `packages/component-composition/package.json`** — add `@platform/core-components: workspace:*` to dependencies.

**Step 5: Update `packages/component-composition/src/index.ts`** — add exports for `registry` and `render-page`.

```bash
# Verification gate — STOP if any fails
pnpm install
npx tsx -e "
async function main() {
  const { SiteCompositionConfigSchema } = await import('./packages/component-composition/src/schemas.js');

  // Valid config passes
  const valid = SiteCompositionConfigSchema.parse({
    version: '1', siteId: 'test',
    pages: [{ pageType: 'home', sections: [{ component: 'HeroSection', slots: { showEyebrow: false } }] }]
  });
  console.log(valid ? 'PASS: valid config parsed' : 'FAIL');

  // Invalid slot key rejected
  try {
    SiteCompositionConfigSchema.parse({
      version: '1', siteId: 'test',
      pages: [{ pageType: 'home', sections: [{ component: 'HeroSection', slots: { nonExistentSlot: true } }] }]
    });
    console.log('FAIL: invalid slot key should have been rejected');
  } catch (e) {
    console.log('PASS: invalid slot key rejected by discriminated union');
  }

  // Invalid component name rejected
  try {
    SiteCompositionConfigSchema.parse({
      version: '1', siteId: 'test',
      pages: [{ pageType: 'home', sections: [{ component: 'BOGUS' }] }]
    });
    console.log('FAIL: invalid component name should have been rejected');
  } catch (e) {
    console.log('PASS: invalid component name rejected');
  }
}
main().catch(console.error);
" 2>&1

pnpm type-check
```

```bash
git add packages/component-composition/
git commit -m "feat(composition): add component registry, discriminated union schema, and page renderer

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4a: Structural AI Pass

**Goal:** Build the structural AI pass that maps a DesignBrief to a valid `SiteCompositionConfig`.
**Model:** sonnet

Read in parallel (G4): `tools/lib/core-component-catalog.ts`, `tools/lib/component-matcher.ts`, `tools/lib/design-brief-types.ts`, `output/briefs/navagarden/design-brief.json`

**Step 1: Extend `tools/lib/core-component-catalog.ts`**

Add entries for the 7 composable components. Add a `composable?: boolean` flag to the `CatalogEntry` interface if not present. Each entry:

```typescript
{
  name: "HeroSection",
  category: "Hero",
  requiredSlots: ["heading", "heroImage", "primaryCtaText"],
  layoutCues: ["hero", "full-bleed", "split", "centered", "above-fold"],
  interaction: "none",
  importPath: "@platform/core-components",
  composable: true,
}
```

Add entries for all 7: `HeroSection`, `ServiceCards`, `FeatureGrid`, `TestimonialGrid`, `StatsStrip`, `CTASection`, `ContentSection`. Use appropriate `layoutCues` and `category` values from the synthesis.

**Step 2: Create `tools/lib/composition-catalog.ts`**

AI-facing component catalog — structured for generation prompts, not matching:

```typescript
export const COMPOSITION_CATALOG = [
  {
    name: "HeroSection",
    description:
      "Primary above-fold hero section. Use for the first section of any page. Handles full-bleed, split (text/image), and centered layouts via layout.align.",
    slots: {
      showEyebrow: "Small label above heading",
      showSubheading: "Subheading or intro text below heading",
      showPrimaryCta: "Primary call-to-action button",
      showSecondaryCta: "Secondary/outline CTA button",
      showHeroImage: "Hero image or illustration",
      showTrustBadges: "Trust indicators (badges, certifications)",
    },
    layoutParams: {
      align: ["left", "center", "split"],
      background: ["surface", "subtle", "inverse", "brand"],
      fullBleed: "boolean — makes section min-h-[60vh]",
    },
  },
  // ... all 7 components with same structure
] as const;
```

**Step 3: Create `tools/lib/composition-structural-pass.ts`**

````typescript
import Anthropic from "@anthropic-ai/sdk";
import { matchComponents } from "./component-matcher";
import { COMPOSITION_CATALOG } from "./composition-catalog";
import { SiteCompositionConfigSchema } from "@platform/component-composition";
import type { DesignBrief } from "./design-brief-types";
import type { SiteCompositionConfig } from "@platform/component-composition";

export async function generateStructuralComposition(
  brief: DesignBrief,
  options?: { model?: string }
): Promise<SiteCompositionConfig> {
  const client = new Anthropic();
  const model = options?.model ?? "claude-sonnet-4-6";

  // Deterministic prefill: run component matcher on each section blueprint
  const prefills: Record<string, string> = {};
  for (const page of brief.pageBlueprints) {
    for (const section of page.sections) {
      const matches = matchComponents(section /* catalog */);
      if (matches.length > 0 && matches[0].score > 0.6) {
        prefills[section.id] = matches[0].component;
      }
    }
  }

  const systemPrompt = `You are a component composition expert. Given a DesignBrief JSON and a component catalog, produce a SiteCompositionConfig JSON that maps each section blueprint to the best-fit component.

Rules:
- Output ONLY valid JSON matching the SiteCompositionConfig schema
- Only use component names from the catalog
- Set slots to disable sub-elements NOT present in the blueprint's contentSlots
- Set layout params to reflect the reference's layoutPattern
- Set condition.type to "data-present" with the relevant data key for sections that appear conditionally
- Most sections should use condition: { type: "always" }
- The prefills object shows suggested component choices for sections where the matcher is confident (score > 0.6) — use these unless you have strong reason not to`;

  const userPrompt = `Component catalog:
${JSON.stringify(COMPOSITION_CATALOG, null, 2)}

Suggested prefills (section id → component name, score > 0.6):
${JSON.stringify(prefills, null, 2)}

DesignBrief:
${JSON.stringify(brief, null, 2)}

Produce a SiteCompositionConfig JSON with version "1", siteId derived from brief.reference.url, and pages for each pageBlueprint. Include home page at minimum.`;

  async function attempt(repairContext?: string): Promise<SiteCompositionConfig> {
    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: repairContext
          ? `${userPrompt}\n\nPrevious attempt failed validation:\n${repairContext}\n\nFix the errors and return only valid JSON.`
          : userPrompt,
      },
    ];

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch =
      content.text.match(/```json\n?([\s\S]+?)\n?```/) ?? content.text.match(/(\{[\s\S]+\})/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[1]);
    return SiteCompositionConfigSchema.parse(parsed);
  }

  try {
    return await attempt();
  } catch (err) {
    // Retry once with Zod error as repair context
    const errorMsg = err instanceof Error ? err.message : String(err);
    return await attempt(errorMsg);
  }
}
````

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { generateStructuralComposition } = await import('./tools/lib/composition-structural-pass.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('output/briefs/navagarden/design-brief.json', 'utf-8')));
  const config = await generateStructuralComposition(brief);
  console.log('siteId:', config.siteId);
  console.log('pages:', config.pages.length);
  console.log('home sections:', config.pages.find(p => p.pageType === 'home')?.sections.length);
  console.log('PASS: structural pass produced valid SiteCompositionConfig');
}
main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
" 2>&1
```

```bash
git add tools/lib/core-component-catalog.ts tools/lib/composition-catalog.ts tools/lib/composition-structural-pass.ts
git commit -m "feat(pipeline): add structural AI pass — DesignBrief → SiteCompositionConfig

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4b: Visual AI Pass

**Goal:** Build the visual AI pass that maps a DesignBrief to theme token values and CSS overrides.
**Model:** sonnet

Read in parallel (G5): `tools/lib/design-brief-types.ts`, `packages/theme-system/src/types.ts`, `output/briefs/navagarden/design-brief.json`

**Step 1: Create `tools/lib/visual-output-schema.ts`**

```typescript
import { z } from "zod";

export const VisualPassOutputSchema = z.object({
  themeConfig: z.record(z.string(), z.unknown()), // DeepPartialThemeConfig — validated loosely
  cssOverrides: z.string(),
  fontLinks: z.array(z.string().url()),
  provenance: z.record(
    z.string(),
    z.object({
      source: z.enum(["computed", "vision", "derived", "fallback"]),
    })
  ),
});

export type VisualPassOutput = z.infer<typeof VisualPassOutputSchema>;
```

**Step 2: Create `tools/lib/composition-visual-pass.ts`**

````typescript
import Anthropic from "@anthropic-ai/sdk";
import { VisualPassOutputSchema } from "./visual-output-schema";
import type { DesignBrief } from "./design-brief-types";
import type { VisualPassOutput } from "./visual-output-schema";

const HEX_PATTERN = /#[0-9a-fA-F]{6}/g;

export async function generateVisualConfig(
  brief: DesignBrief,
  options?: { model?: string }
): Promise<VisualPassOutput> {
  const client = new Anthropic();
  const model = options?.model ?? "claude-sonnet-4-6";

  const systemPrompt = `You are a design token expert. Given a DesignBrief JSON, produce a visual configuration object for a white-label website.

Rules:
- Output ONLY valid JSON matching the VisualPassOutput schema
- themeConfig must conform to DeepPartialThemeConfig shape (colors, typography, components)
- Prefer tokens with provenance "computed" over "vision" over "derived"
- cssOverrides must use ONLY CSS custom properties (var(--color-brand-primary)) — NEVER hardcoded hex values
- fontLinks must be valid Google Fonts <link> href URLs
- Express button/card tweaks in themeConfig.components`;

  const userPrompt = `DesignBrief:
${JSON.stringify(brief, null, 2)}

Produce a VisualPassOutput JSON with:
- themeConfig: colors (brand, surface, semantic, overlay), typography (fontFamily, headingStyle, headingWeight), components (button fontWeight, card borderRadius)
- cssOverrides: any site-specific CSS using only var(--...) custom properties
- fontLinks: Google Fonts <link> href values for the fonts in typography.fontFamily
- provenance: for each top-level token group (brand, surface, typography), record the source

Output schema:
{
  "themeConfig": { "colors": { "brand": {...}, "surface": {...} }, "typography": {...}, "components": {...} },
  "cssOverrides": "/* CSS string */",
  "fontLinks": ["https://fonts.googleapis.com/..."],
  "provenance": { "brand.primary": { "source": "computed" }, ... }
}`;

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch =
    content.text.match(/```json\n?([\s\S]+?)\n?```/) ?? content.text.match(/(\{[\s\S]+\})/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  const parsed = JSON.parse(jsonMatch[1]);
  const output = VisualPassOutputSchema.parse(parsed);

  // Check for hardcoded hex in CSS overrides
  const hexMatches = output.cssOverrides.match(HEX_PATTERN);
  if (hexMatches) {
    throw new Error(
      `Visual pass produced hardcoded hex values in cssOverrides: ${hexMatches.join(", ")}. All colors must use var(--...) custom properties.`
    );
  }

  return output;
}
````

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { generateVisualConfig } = await import('./tools/lib/composition-visual-pass.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('output/briefs/navagarden/design-brief.json', 'utf-8')));
  const output = await generateVisualConfig(brief);
  console.log('fontLinks:', output.fontLinks.length);
  console.log('themeConfig keys:', Object.keys(output.themeConfig));
  const hexCheck = output.cssOverrides.match(/#[0-9a-fA-F]{6}/g);
  console.log(hexCheck ? 'FAIL: hardcoded hex in cssOverrides' : 'PASS: no hardcoded hex');
  console.log('PASS: visual pass produced valid output');
}
main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
" 2>&1
```

```bash
git add tools/lib/visual-output-schema.ts tools/lib/composition-visual-pass.ts
git commit -m "feat(pipeline): add visual AI pass — DesignBrief → theme config + CSS

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: PoC Test Site

**Goal:** Wire everything into a test site that renders a home page from composition config + theme tokens with zero hand-written section TSX.
**Model:** sonnet

Read in parallel (G6): `sites/base-template/package.json`, `sites/base-template/next.config.ts`, `sites/base-template/tailwind.config.ts`, `sites/base-template/app/layout.tsx`

**Step 1: Run AI passes to generate site artifacts**

```bash
# Generate composition config from navagarden brief
npx tsx -e "
async function main() {
  const { generateStructuralComposition } = await import('./tools/lib/composition-structural-pass.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('output/briefs/navagarden/design-brief.json', 'utf-8')));
  const config = await generateStructuralComposition(brief);
  fs.writeFileSync('sites/poc-composition-test/composition.json', JSON.stringify(config, null, 2));
  console.log('PASS: composition.json written');
}
main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
" 2>&1

# Generate visual config from navagarden brief
npx tsx -e "
async function main() {
  const { generateVisualConfig } = await import('./tools/lib/composition-visual-pass.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('output/briefs/navagarden/design-brief.json', 'utf-8')));
  const output = await generateVisualConfig(brief);

  // Write CSS overrides
  fs.writeFileSync('sites/poc-composition-test/app/composition-overrides.css', output.cssOverrides);

  // Write theme config (as TypeScript)
  const themeTs = \`import type { DeepPartialThemeConfig } from '@platform/theme-system';

export const themeConfig: DeepPartialThemeConfig = \${JSON.stringify(output.themeConfig, null, 2)} as DeepPartialThemeConfig;
\`;
  fs.writeFileSync('sites/poc-composition-test/theme.config.ts', themeTs);

  // Print font links for manual addition to layout.tsx
  console.log('Font links to add to layout.tsx:');
  output.fontLinks.forEach(link => console.log(\`  <link rel="stylesheet" href="\${link}" />\`));
  console.log('PASS: visual config written');
}
main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
" 2>&1
```

**Step 2: Scaffold `sites/poc-composition-test/`**

Copy from base-template: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.js`, `tailwind.config.ts`.

Update `sites/poc-composition-test/package.json`:

- Change name to `poc-composition-test`
- Add `@platform/component-composition: workspace:*` to dependencies
- Remove any base-template-specific dependencies not needed

Create `sites/poc-composition-test/lib/page-data.ts` with mock data matching navagarden content structure:

```typescript
export const siteData: Record<string, unknown> = {
  // Hero
  heading: "Professional Garden Design & Landscaping",
  eyebrow: "Award-winning landscape architects",
  subheading: "Creating beautiful outdoor spaces across Hungary since 2010.",
  primaryCtaText: "Get a Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: "View Our Work",
  secondaryCtaHref: "/projects",

  // Services
  services: [
    {
      title: "Garden Design",
      description: "Bespoke garden designs tailored to your lifestyle.",
      icon: "🌿",
      href: "/services/garden-design",
    },
    {
      title: "Landscaping",
      description: "Full landscaping and construction services.",
      icon: "🏗️",
      href: "/services/landscaping",
    },
    {
      title: "Maintenance",
      description: "Ongoing care to keep your garden looking its best.",
      icon: "✂️",
      href: "/services/maintenance",
    },
  ],

  // Features
  features: [
    { title: "Expert Team", description: "Over 20 years of combined experience.", icon: "👥" },
    { title: "Sustainable Methods", description: "Eco-friendly practices throughout.", icon: "🌱" },
    { title: "Full Project Management", description: "From design to completion.", icon: "📋" },
  ],

  // Stats
  stats: [
    { value: "500+", label: "Projects Completed" },
    { value: "15", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "50+", label: "Awards Won" },
  ],

  // Testimonials
  testimonials: [
    {
      name: "Anna Kovács",
      location: "Budapest",
      rating: 5,
      text: "Absolutely transformed our garden. Highly recommended!",
      avatarInitials: "AK",
    },
    {
      name: "Péter Szabó",
      location: "Debrecen",
      rating: 5,
      text: "Professional, creative, and delivered on time.",
      avatarInitials: "PS",
    },
  ],

  // CTA
  ctaHeading: "Ready to Transform Your Garden?",
  ctaSubheading: "Book a free consultation with our design team.",
  primaryCtaText: "Book Consultation",
  primaryCtaHref: "/contact",
};
```

Create `sites/poc-composition-test/app/layout.tsx` (from base-template, add font link tags from visual pass output).

Create `sites/poc-composition-test/app/globals.css` (import theme CSS, import composition-overrides.css).

Create `sites/poc-composition-test/app/page.tsx`:

```typescript
import compositionConfig from '../composition.json';
import { SiteCompositionConfigSchema, renderComposedPage } from '@platform/component-composition';
import { siteData } from '@/lib/page-data';

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default function HomePage() {
  const { elements, diagnostics } = renderComposedPage({
    composition: config,
    pageType: 'home',
    data: siteData,
  });

  if (diagnostics.length > 0) {
    console.warn('[Composition diagnostics]', diagnostics);
  }

  return <main className="min-h-screen">{elements}</main>;
}
```

```bash
# Verification gate — STOP if this fails
pnpm install
pnpm --filter poc-composition-test type-check
echo "Type-check passed. Starting dev server check..."
# Build to verify — dev server check
pnpm --filter poc-composition-test build 2>&1 | tail -20
```

```bash
# Verify existing sites still build
pnpm --filter dj-fox-electrical build 2>&1 | tail -5
pnpm --filter base-template build 2>&1 | tail -5
```

```bash
git add sites/poc-composition-test/
git commit -m "feat(poc): add poc-composition-test site wired to composition system

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6: Tests and Quality Gates

**Goal:** Unit tests for schema validation, condition evaluation, and renderer. Static checks for composable components.
**Model:** sonnet for tests, haiku for grep checks

Run in parallel (G7): Tests creation (sonnet) + static grep checks (haiku)

**Create test files:**

`packages/component-composition/src/__tests__/schemas.test.ts`:

- Valid config with each of the 7 components parses without error
- Invalid component name throws ZodError
- Invalid slot key for specific component throws ZodError
- Condition schema validates all three types

`packages/component-composition/src/__tests__/conditions.test.ts`:

- `"always"` returns true
- `"flag"` with matching key/value returns true
- `"flag"` with non-matching key returns false
- `"data-present"` with non-empty array returns true
- `"data-present"` with empty array returns false
- `"data-present"` with null returns false
- Undefined condition returns true

`packages/component-composition/src/__tests__/render-page.test.tsx`:

- Renders correct sections in order
- Skips sections with false conditions
- Collects diagnostic for unknown component — does not throw
- Merges `defaultSlots` from config with section-level slots (section overrides config)
- Returns empty elements with diagnostic when page type not found

**Update `scripts/check-token-usage.ts`** (or create if it doesn't exist) to add checks for composable directory:

```typescript
// Add to existing checks:
checkNoHardcodedHex("packages/core-components/src/components/composable");
checkNoUseClient("packages/core-components/src/components/composable");
checkNoDefaultExports("packages/core-components/src/components/composable");
```

```bash
# Verification gate — STOP if any fails
pnpm --filter @platform/component-composition test
pnpm lint
pnpm type-check
```

```bash
git add packages/component-composition/src/__tests__/ scripts/check-token-usage.ts
git commit -m "test(composition): add schema, condition, and renderer unit tests + static quality gates

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 7: Evaluation

**Goal:** Run both AI passes against both reference briefs, evaluate PoC fidelity, document gaps.
**Model:** haiku — mechanical execution + writing

Run structural and visual passes against `output/briefs/designlab/design-brief.json` (in addition to navagarden which was done in Phase 5).

Write `output/sessions/2026-04/2026-04-18_component-composition-system/poc-evaluation.md` with:

- Visual fidelity score (1–5) for navagarden render
- Structural correctness assessment (right sections, right order, correct slot suppression)
- Catalog gaps — which sections from each brief's pageBlueprints couldn't map to a composable component
- Gap backlog — components to build in Phase 2 expansion

Update `docs/architecture/component-composition-system.md` with evaluation findings.

```bash
git add output/sessions/2026-04/2026-04-18_component-composition-system/poc-evaluation.md docs/architecture/component-composition-system.md
git commit -m "docs: add PoC evaluation findings and component gap backlog

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase    | Items                                                                                                                                                                        | File overlap                                                            | Model          | Rationale                                |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------- | ---------------------------------------- |
| G1    | Phase 1  | Read `packages/theme-system/src/types.ts`, Read `packages/theme-system/package.json`, Read `packages/core-components/package.json`, Read `tools/lib/design-brief-types.ts`   | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G2    | Phase 2  | Read `packages/core-components/src/index.ts`, Read `packages/core-components/package.json`, Read `packages/theme-system/src/types.ts`                                        | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G3    | Phase 3  | Read `packages/component-composition/src/types.ts`, Read `packages/component-composition/src/schemas.ts`, Read `packages/core-components/src/components/composable/index.ts` | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G4    | Phase 4a | Read `tools/lib/core-component-catalog.ts`, Read `tools/lib/component-matcher.ts`, Read `tools/lib/design-brief-types.ts`, Read `output/briefs/navagarden/design-brief.json` | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G5    | Phase 4b | Read `tools/lib/design-brief-types.ts`, Read `packages/theme-system/src/types.ts`, Read `output/briefs/navagarden/design-brief.json`                                         | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G6    | Phase 5  | Read `sites/base-template/package.json`, Read `sites/base-template/next.config.ts`, Read `sites/base-template/tailwind.config.ts`, Read `sites/base-template/app/layout.tsx` | none (reads only)                                                       | n/a            | Independent reads — batch in one message |
| G7    | Phase 6  | Write test files (sonnet), Run grep static checks (haiku)                                                                                                                    | No overlap — tests in component-composition, checks are read-only greps | sonnet + haiku | Tests and static checks are independent  |

### Cross-phase groups

| Group | Phases  | Items                                   | Rationale                                                                                                    |
| ----- | ------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| G8    | 4a + 4b | Structural pass (4a) + Visual pass (4b) | Both depend only on Phase 1 types and the DesignBrief — no shared files, no ordering dependency between them |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| Phase 0 before Phase 1            | Architecture doc locks invariants before any code             |
| Phase 1 before Phase 2            | Component types needed before components use them             |
| Phase 2 before Phase 3            | Registry imports component implementations and slot schemas   |
| Phase 3 before Phase 5            | PoC site imports renderer from composition package            |
| Phase 4a + 4b before Phase 5      | PoC site needs generated composition.json and theme.config.ts |
| Verification gates between phases | Each phase's output gates the next                            |
| Git commits                       | One commit per phase, in order — never batched                |

---

## Cost Estimate

| Phase                                      | Model          | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------ | -------------- | ----------------- | ------------------ | ---------- |
| Phase 0: Architecture doc                  | haiku          | ~3k               | ~1k                | ~$0.01     |
| Phase 1: Composition package               | sonnet         | ~8k               | ~3k                | ~$0.07     |
| Phase 2: 7 composable components           | sonnet         | ~12k              | ~8k                | ~$0.16     |
| Phase 3: Registry + renderer               | sonnet         | ~10k              | ~4k                | ~$0.09     |
| Phase 4a: Structural pass (incl. API call) | sonnet         | ~15k              | ~4k                | ~$0.11     |
| Phase 4b: Visual pass (incl. API call)     | sonnet         | ~12k              | ~3k                | ~$0.09     |
| Phase 5: PoC site                          | sonnet         | ~10k              | ~4k                | ~$0.09     |
| Phase 6: Tests + quality gates             | sonnet + haiku | ~10k              | ~5k                | ~$0.07     |
| Phase 7: Evaluation                        | haiku          | ~5k               | ~2k                | ~$0.02     |
| **Total**                                  |                | **~85k**          | **~34k**           | **~$0.71** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check` passes, `pnpm --filter poc-composition-test build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-18_component-composition-system/yolo-brief.md`:

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

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Phase 4a and 4b are the only cross-phase parallel pair.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`
