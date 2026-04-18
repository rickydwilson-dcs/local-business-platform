# Component Composition System

## Purpose

Replace generative TSX (where Claude emits raw component code per section) with configuration-driven composition: a library of slot-aware Server Component sections, a per-site JSON composition config, and a two-pass AI pipeline (structural → `composition.json`, visual → `theme.config.ts` + CSS). This eliminates the fragile generative act that conflates structure and style and makes the output non-deterministic.

## Core Invariants

1. **Structural composition and visual styling are separate artifacts and separate AI passes.**  
   The structural pass produces `composition.json`. The visual pass produces `theme.config.ts` + `globals.css` overrides. They run independently and must never merge into a single prompt.

2. **`SiteCompositionConfig` is the only source of page structure.**  
   Page TSX files are thin wrappers that call `renderComposedPage(composition, pageType, data)`. No section-level TSX is hand-written or generated per deployment.

3. **Per-site `theme.config.ts` + CSS are the only visual inputs.**  
   Named themes (`packages/themes/orion`, `vega`, etc.) are optional presets — not required architecture. Existing sites are completely unaffected.

4. **Slot toggles are binary visibility only.**  
   A slot either shows or doesn't. Style variants belong in token values or `layout` params, not in slot booleans. A slot named `showEyebrow: false` suppresses the eyebrow. It cannot change its colour or font.

5. **All composable components are Server Components by default.**  
   No `"use client"` directive unless the component requires genuine browser state (scroll, resize, user input). Composable sections have none of these needs.

6. **Token classes only — no hardcoded hex, no inline styles, no `theme()` function in CSS.**  
   All colour references use Tailwind token classes (`bg-brand-primary`, `text-surface-foreground`) or CSS custom properties (`var(--color-brand-primary)`). This rule is enforced by static grep in CI.

## Slot Toggle Semantics

A slot is a `boolean` that controls whether a sub-element renders. Semantics:

- `true` → render the sub-element (subject to data availability)
- `false` → suppress unconditionally — the sub-element is absent from the DOM

Slots are declared in `ComponentNameSlots` and validated by `ComponentNameSlotsSchema` (a `.strict()` Zod object). Unknown slot keys are rejected at schema validation time, preventing configuration drift.

Style variants belong in `layout` params (e.g. `layout.background: "inverse"`), not in slots. If you find yourself naming a slot `showDarkBackground`, you're misusing the system.

## Condition Model

Sections declare a structured `ConditionConfig` object:

```typescript
interface ConditionConfig {
  type: "always" | "flag" | "data-present";
  key?: string;
  equals?: string | boolean | number;
}
```

- `{ type: "always" }` — render unconditionally (default)
- `{ type: "flag", key: "showTestimonials" }` — render only when the feature flag is truthy
- `{ type: "flag", key: "layout", equals: "minimal" }` — render only when flag equals a value
- `{ type: "data-present", key: "testimonials" }` — render only when `data.testimonials` is non-empty

The condition model is **not** an expression language. There are no `AND`/`OR` combinators, no arithmetic, no template strings. If a section needs complex conditional logic, that belongs in the page wrapper, not in `composition.json`.

## Package Boundaries

| Package                                               | Contents                                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `packages/component-composition/`                     | Runtime: `SiteCompositionConfig` types, Zod schemas, `ConditionConfig` evaluator, component registry, `renderComposedPage()` |
| `packages/core-components/src/components/composable/` | The 7 composable section components and their `.slots.ts` schema files                                                       |
| `tools/lib/composition-structural-pass.ts`            | AI pass: DesignBrief → SiteCompositionConfig                                                                                 |
| `tools/lib/composition-visual-pass.ts`                | AI pass: DesignBrief → theme config + CSS overrides                                                                          |

`packages/component-composition/` depends on `@platform/core-components` (imports components for the registry). `packages/core-components` does **not** depend on `packages/component-composition` — the dependency is one-directional.

## Named Theme Packages

Named theme packages (`packages/themes/orion`, `packages/themes/vega`, etc.) are optional presets that provide pre-built `Header`, `Footer`, and page layout components. They are not required by the composition system.

Existing sites that use named themes are completely unaffected by this system. The composition system coexists — a site can use a named theme for its header/footer and use the composition system for its main content sections.

## Migration

The composition system is additive. Existing sites, named themes, and the ingestion pipeline continue to work as before. The `poc-composition-test` site demonstrates the full stack without touching any production site. Production adoption is a separate decision.

## Answering the Three Questions

**Where do layout choices live?**  
In `composition.json` — specifically `sections[].layout` and the `pageType` structure. The JSON is Zod-validated against a discriminated union schema, so every layout param is type-safe.

**Where does visual identity live?**  
In `theme.config.ts` (token values: colours, typography, radii) and site-specific `globals.css` (CSS custom property overrides). The visual pass produces both.

**Where do slot toggles live?**  
In `composition.json` — specifically `sections[].slots`. Each key maps to a `boolean`. The schema is `.strict()` so unknown keys are rejected. The renderer merges section-level slots over `defaultSlots` from the config root.

## Evaluation Findings

_Populated after PoC evaluation — see `poc-evaluation.md` in the session folder._
