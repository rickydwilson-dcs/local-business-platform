# Implementation Plan: Component Composition System

**Date:** 2026-04-18
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                                              | Claude                                                                                    | Codex                                                                                                                    | Synthesised Decision                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slot validation in Zod**                          | Flat `z.record(z.string(), z.boolean())` — simpler but silently ignores invalid slot keys | Discriminated union per component — each component exports its own `SlotsSchema` so invalid keys fail at JSON parse time | **Codex.** Use discriminated union. Maintenance cost is acceptable — adding a component already requires updating the registry. Co-locate each component's `SlotsSchema` and `LayoutSchema` in a `.slots.ts` file alongside the component.                                                                                                                 |
| **Package structure**                               | Extend `theme-system` for schemas, `core-components` for components + renderer            | Two new packages: `packages/component-composition/` + `packages/composable-sections/`                                    | **Compromise: one new package.** Create `packages/component-composition/` for schemas, types, registry, conditions, and renderer. Place composable section components inside `packages/core-components/src/components/composable/` — not a separate package. Adding a full Turborepo workspace for 6–8 components is overhead without payoff at PoC scale. |
| **Component file structure**                        | Single `.tsx` per component                                                               | Three files: `.tsx`, `.types.ts`, `.schema.ts`                                                                           | **Two files:** `ComponentName.tsx` (component + props + DEFAULT_SLOTS) and `ComponentName.slots.ts` (Zod schemas for slots + layout). The `.types.ts` separation adds nothing when the interface is 10–15 lines. The `.slots.ts` IS needed because Zod schemas are imported by the registry in a different package.                                        |
| **Condition model**                                 | Plain string — `siteData[condition]` truthy check                                         | Structured object: `{ type: "always" \| "flag" \| "data-present"; key?: string; equals?: string \| boolean \| number }`  | **Codex.** The structured condition is unambiguous for AI generation. Implementation cost is trivial.                                                                                                                                                                                                                                                      |
| **Hero component strategy**                         | Single `HeroSection` with layout params (`align`, `background`, `fullBleed`)              | Two separate components: `HeroSplit` and `HeroOverlay`                                                                   | **Claude.** A single `HeroSection` with layout params reduces the AI's decision surface — it picks one component and varies `align` and `background`. The visual difference is entirely expressible through layout params.                                                                                                                                 |
| **Component count for PoC**                         | 6                                                                                         | 8 (adds SiteHeader, SiteFooter, splits Hero)                                                                             | **7.** Add `FeatureGrid` (icon-card grid — distinct from ServiceCards, present in both reference briefs). Defer SiteHeader and SiteFooter — existing `SiteHeader`/`Footer` in core-components already work and have complex site-specific nav logic.                                                                                                       |
| **Renderer error strategy**                         | `console.warn` + return null per unknown component                                        | Non-fatal per-section failure with `RenderDiagnostic[]` collection                                                       | **Codex.** Non-fatal rendering is correct for production white-label sites. Return `{ elements, diagnostics }`.                                                                                                                                                                                                                                            |
| **Deterministic prefill before AI structural pass** | Not included                                                                              | Map `category/layoutPattern` to component names heuristically before AI call                                             | **Codex. Adopt.** Reuse existing `matchComponents()` from `tools/lib/component-matcher.ts` to prefill component choices. AI focuses on slot toggles and layout params. Reduces hallucination variance.                                                                                                                                                     |
| **Visual pass output**                              | `{ tokenConfig, cssOverrides }`                                                           | `{ themeConfig, cssOverrides, fontLinks, provenance }`                                                                   | **Codex (simplified).** Include `fontLinks` and `provenance` at token-group level. For PoC: single `theme.config.ts` and one `app/composition-overrides.css` — no further file splitting.                                                                                                                                                                  |
| **Architecture doc**                                | Not mentioned                                                                             | Write `docs/architecture/component-composition-system.md` first as a decision lock                                       | **Codex. Adopt as Phase 0.**                                                                                                                                                                                                                                                                                                                               |
| **CI static checks**                                | Not mentioned                                                                             | Grep for hardcoded hex, inline styles, default exports in new packages                                                   | **Codex. Adopt** — add to existing `scripts/check-token-usage.ts` for the composable directory.                                                                                                                                                                                                                                                            |
| **Data prop mapping**                               | Explicit per-component data key declarations                                              | Generic `data` prop                                                                                                      | **Generic `data: Record<string, unknown>`.** Each component destructures what it needs internally. Type safety from internal destructuring. Revisit for production with per-component `DataSchema`.                                                                                                                                                        |

---

## Blind Spots Caught

1. **Both plans ignored `component-matcher.ts`.** The existing `matchComponents()` function uses Jaccard similarity scoring against `core-component-catalog.ts`. The structural pass prefill layer should call this directly rather than building new matching logic. Extend the catalog with composable component entries and add a `composable: true` flag.

2. **Neither plan addressed the `"use client"` trap.** The existing `hero-section.tsx` in core-components is `"use client"`. The new composable `HeroSection` must be a Server Component — no `@/lib/*` imports, image URLs via `data` prop, no `useState`. This must be an explicit constraint in the component build guidelines.

3. **Codex's separate `packages/composable-sections/` would need Tailwind content glob changes in every site.** Placing components inside core-components avoids this entirely — existing globs already cover it.

4. **Zod version mismatch.** `packages/theme-system` uses `zod@^3.22.0`, `packages/core-components` uses `zod@^4`. The new `packages/component-composition/` must pin `zod@^3.24.0` to stay compatible with theme-system. Component `.slots.ts` files that are consumed by `component-composition` also use zod@3. pnpm workspaces handle this via hoisting — but flag it in the risk register.

5. **`pageType` alignment.** The composition config's `pageType` must align with the existing union from `reference-analysis-types.ts` (`"home" | "about" | "services-list" | "service-detail" | ...`). Import and reuse that union rather than redefining it.

---

## Implementation Plan

### Phase 0: Architecture Decision Document

**Goal:** Lock invariants before writing code.

Create `docs/architecture/component-composition-system.md` covering:

- Purpose: replace generative TSX with configuration-driven composition
- Structural vs visual separation (two artifacts, two AI passes)
- Slot toggle semantics: binary show/hide only, no style variants
- Condition model: structured `ConditionConfig` object
- Package boundaries: `packages/component-composition/` for runtime, composable components in `packages/core-components/src/components/composable/`
- Named theme packages: optional presets, not required architecture
- Migration: coexists with existing sites and named themes, no breakage

**Files created:** `docs/architecture/component-composition-system.md`

**Verification gate:** Doc answers the three canonical questions: "Where do layout choices live?" (composition JSON), "Where does visual identity live?" (theme tokens + CSS), "Where do slot toggles live?" (composition JSON, Zod-validated).

---

### Phase 1: Composition Package — Types, Schemas, Conditions

**Goal:** Create `packages/component-composition/` with core type system, Zod schemas, and condition evaluator.

**Steps:**

1. Scaffold the package:
   - `packages/component-composition/package.json` — name `@platform/component-composition`, raw TypeScript source (no build step, matches core-components pattern), `zod@^3.24.0`, `react@19.x`
   - `packages/component-composition/tsconfig.json` — extends root tsconfig

2. `src/types.ts`:
   - Import `PageType` from existing reference-analysis-types (or redefine inline to avoid pulling the full analysis type tree)
   - `ComponentName` — const array + union type (source of truth; registry derives from this)
   - `ConditionConfig`: `{ type: "always" | "flag" | "data-present"; key?: string; equals?: string | boolean | number }`
   - `BaseSectionConfig`, `PageComposition`, `SiteCompositionConfig` interfaces
   - `RenderDiagnostic`: `{ sectionIndex: number; component: string; error: string; severity: "warning" | "error" }`
   - `RenderResult`: `{ elements: React.ReactElement[]; diagnostics: RenderDiagnostic[] }`

3. `src/conditions.ts`:
   - `evaluateCondition(condition: ConditionConfig | undefined, ctx: { flags: Record<string, unknown>; data: Record<string, unknown> }): boolean`
   - `"always"` or undefined → `true`
   - `"flag"` → `ctx.flags[key] === equals` (or truthiness if `equals` absent)
   - `"data-present"` → `ctx.data[key] != null && !(Array.isArray(ctx.data[key]) && ctx.data[key].length === 0)`

4. `src/schemas.ts` (stub):
   - `ConditionConfigSchema`, `LayoutParamsSchema` (common params: `columns`, `background`, `paddingY`, `align`, `maxItems`, `fullBleed`, `mediaPosition`)
   - `SectionSchema` placeholder — will be replaced with discriminated union once component schemas exist (Phase 3)
   - `SiteCompositionConfigSchema` wrapping pages + sections

5. `src/index.ts` — barrel export

**Files created:**

- `packages/component-composition/package.json`
- `packages/component-composition/tsconfig.json`
- `packages/component-composition/src/types.ts`
- `packages/component-composition/src/conditions.ts`
- `packages/component-composition/src/schemas.ts`
- `packages/component-composition/src/index.ts`

**Verification gate:**

- `pnpm install` resolves the new workspace package
- `SiteCompositionConfigSchema.parse({ version: "1", siteId: "test", pages: [] })` succeeds
- `evaluateCondition` unit tests pass for all three condition types plus edge cases (missing key, empty array, null)

---

### Phase 2: Composable Section Components (7)

**Goal:** Create 7 slot-aware Server Component sections in `packages/core-components/src/components/composable/`.

**Component contract — every component must:**

- Export a `ComponentNameSlots` interface and `COMPONENT_NAME_DEFAULT_SLOTS` constant
- Accept `slots?: Partial<ComponentNameSlots>`, `layout?: LayoutParams`, `data: Record<string, unknown>`, `className?: string`
- Merge: `const slots = { ...COMPONENT_NAME_DEFAULT_SLOTS, ...slotOverrides }`
- Use only Tailwind token classes — no hardcoded hex, no inline styles
- Be a Server Component — no `"use client"`, no `@/lib/*` imports, no React context
- Named export only, no default export

**Per component: two files**

- `ComponentName.tsx` — component + props interface + DEFAULT_SLOTS
- `ComponentName.slots.ts` — `ComponentNameSlotsSchema` (zod@3 `.object({...}).strict()`) + `ComponentNameLayoutSchema`

**The 7 components:**

| Component         | Key slots                                                                                                 | Layout params                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `HeroSection`     | `showEyebrow`, `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showHeroImage`, `showTrustBadges` | `background`, `align` (left/center/split), `fullBleed` |
| `ServiceCards`    | `showIcon`, `showImage`, `showDescription`, `showCta`, `showBadge`                                        | `columns` (2/3/4), `background`                        |
| `FeatureGrid`     | `showSectionHeading`, `showSectionIntro`, `showIcons`, `showDescriptions`                                 | `columns` (2/3/4), `background`                        |
| `TestimonialGrid` | `showStars`, `showDate`, `showAvatar`, `showAuthorName`, `showLocation`, `showTitle`                      | `columns` (1/2/3), `background`                        |
| `StatsStrip`      | `showLabel`, `showDescription`, `showDividers`                                                            | `columns` (3/4), `background`, `paddingY`              |
| `CTASection`      | `showSubheading`, `showPrimaryCta`, `showSecondaryCta`, `showTrustLine`                                   | `background`, `align`                                  |
| `ContentSection`  | `showImage`, `showSubheading`, `showCta`, `showList`                                                      | `align`, `background`, `fullBleed`                     |

**Files created:**

- `packages/core-components/src/components/composable/index.ts`
- `HeroSection.tsx` + `HeroSection.slots.ts`
- `ServiceCards.tsx` + `ServiceCards.slots.ts`
- `FeatureGrid.tsx` + `FeatureGrid.slots.ts`
- `TestimonialGrid.tsx` + `TestimonialGrid.slots.ts`
- `StatsStrip.tsx` + `StatsStrip.slots.ts`
- `CTASection.tsx` + `CTASection.slots.ts`
- `ContentSection.tsx` + `ContentSection.slots.ts`

**Files modified:**

- `packages/core-components/src/index.ts` — add `export * from "./components/composable"`

**Verification gate:**

- `pnpm --filter @platform/core-components type-check` passes
- Each component renders with no slots prop (full render) without error
- `grep -rn '#[0-9a-fA-F]\{6\}' packages/core-components/src/components/composable/` → zero matches
- `grep -rn '"use client"' packages/core-components/src/components/composable/` → zero matches
- `grep -rn 'export default' packages/core-components/src/components/composable/` → zero matches

---

### Phase 3: Component Registry and Page Renderer

**Goal:** Wire the static component registry and the non-fatal page renderer.

**Steps:**

1. `packages/component-composition/src/registry.ts`:
   - Static imports of all 7 composable components from `@platform/core-components`
   - Static imports of all 7 `.slots.ts` Zod schemas
   - `COMPONENT_NAMES` const array (source of truth for the `ComponentName` type)
   - `COMPONENT_REGISTRY: Record<ComponentName, { component: React.ComponentType<any>; slotsSchema: z.ZodObject<any>; layoutSchema: z.ZodObject<any> }>`

2. Update `packages/component-composition/src/schemas.ts`:
   - Replace placeholder `SectionSchema` with discriminated union
   - For each component: `z.object({ component: z.literal("ComponentName"), slots: ComponentNameSlotsSchema.partial().optional(), layout: ComponentNameLayoutSchema.partial().optional(), condition: ConditionConfigSchema.optional(), id: z.string().optional() })`
   - `SectionSchema = z.discriminatedUnion("component", [...])`

3. `packages/component-composition/src/render-page.tsx`:

   ```typescript
   export function renderComposedPage(options: {
     composition: SiteCompositionConfig;
     pageType: string;
     data: Record<string, unknown>;
     flags?: Record<string, unknown>;
   }): RenderResult;
   ```

   - Find page by `pageType`; if not found, return `{ elements: [], diagnostics: [{ severity: "warning", ... }] }`
   - For each section: evaluate condition, look up in registry, merge defaultSlots + section.slots, render component
   - On unknown component or render error: push `RenderDiagnostic`, continue (never throw)

4. Add `@platform/core-components` as dependency in `packages/component-composition/package.json`

**Files created:** `packages/component-composition/src/registry.ts`, `packages/component-composition/src/render-page.tsx`

**Files modified:** `packages/component-composition/src/schemas.ts`, `packages/component-composition/src/index.ts`, `packages/component-composition/package.json`

**Verification gate:**

- `renderComposedPage({ composition: validConfig, pageType: "home", data: mockData })` → `{ elements: [...], diagnostics: [] }`
- Unknown component name → elements for valid sections + one diagnostic, no throw
- `SiteCompositionConfigSchema.parse(configWithBadSlotKey)` → Zod error identifying the invalid key
- `pnpm type-check` passes across all packages

---

### Phase 4: Two-Pass AI Pipeline

**Goal:** Build structural and visual AI passes that produce composition config and theme config from a DesignBrief.

#### Phase 4a: Structural Pass

1. Extend `tools/lib/core-component-catalog.ts`:
   - Add 7 composable component entries with `composable: true` flag, `requiredSlots`, `layoutCues`

2. Create `tools/lib/composition-catalog.ts`:
   - AI-facing catalog: component name, description, slot names, layout param options, slot defaults
   - This is what gets passed to the model — structured for generation, not matching

3. Create `tools/lib/composition-structural-pass.ts`:
   - **Deterministic prefill layer:** Call `matchComponents()` from `tools/lib/component-matcher.ts` for each blueprint section. Pre-populate component choices for score > 0.6. Pass as hints in prompt.
   - **Prompt:** DesignBrief JSON + `composition-catalog` payload. Instructions: map each blueprint section to best-fit component (use prefilled hints), set `slots` to disable sub-elements not in `contentSlots`, set `layout` to match reference's layout pattern, set `condition` appropriately, output JSON only.
   - **Validation + retry:** `SiteCompositionConfigSchema.safeParse()` → on fail, send repair prompt with `error.issues`, retry once.

**Files created:** `tools/lib/composition-catalog.ts`, `tools/lib/composition-structural-pass.ts`
**Files modified:** `tools/lib/core-component-catalog.ts`

**Verification gate:**

- Structural pass against `output/briefs/navagarden/design-brief.json` produces valid `SiteCompositionConfig` without manual edits
- Structural pass against `output/briefs/designlab/design-brief.json` produces valid config
- Both configs use only names from `COMPONENT_NAMES`
- Re-running same brief produces same component ordering (prefill provides stability)

#### Phase 4b: Visual Pass

1. Create `tools/lib/visual-output-schema.ts`:

   ```typescript
   interface VisualPassOutput {
     themeConfig: DeepPartialThemeConfig;
     cssOverrides: string; // token vars only, no hardcoded hex
     fontLinks: string[]; // Google Fonts <link> href values
     provenance: Record<string, { source: "computed" | "vision" | "derived" | "fallback" }>;
   }
   ```

2. Create `tools/lib/composition-visual-pass.ts`:
   - Input: `DesignBrief` (palette with provenance, typography scale, componentVariants, computed style mapper output)
   - Prompt: use `provenance: "computed"` tokens first; map typography scale to `ThemeConfig.typography`; express component tweaks (button radius, card shadow) in `components`; CSS overrides use only `var(--color-brand-primary)` etc.; include Google Fonts links
   - Validate: `themeConfig` against `ThemeConfigSchema.deepPartial()`; CSS check for hardcoded hex (reject + repair if found)

**Files created:** `tools/lib/visual-output-schema.ts`, `tools/lib/composition-visual-pass.ts`

**Verification gate:**

- Visual pass against navagarden brief → valid `DeepPartialThemeConfig`
- CSS overrides contain zero hardcoded hex values
- `fontLinks` array contains valid Google Fonts URLs

---

### Phase 5: PoC Test Site

**Goal:** A working home page rendered entirely from composition config + theme tokens, zero hand-written section TSX.

1. Scaffold `sites/poc-composition-test/` from `sites/base-template/`
2. Add `@platform/component-composition: workspace:*` dependency
3. Run structural pass → `sites/poc-composition-test/composition.json` (manually verify, commit)
4. Run visual pass → `sites/poc-composition-test/theme.config.ts` + `app/composition-overrides.css`
5. Create `sites/poc-composition-test/lib/page-data.ts` — static mock matching navagarden content structure
6. Create `sites/poc-composition-test/app/page.tsx`:

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
     if (diagnostics.length > 0) console.warn('Composition diagnostics:', diagnostics);
     return <main>{elements}</main>;
   }
   ```

**Verification gates:**

- `pnpm --filter poc-composition-test dev` starts without errors
- Home page renders all sections in correct order
- No TypeScript errors
- No hardcoded hex in rendered HTML (all colors resolve from CSS variables)
- `diagnostics` is empty
- Existing sites still build: `pnpm build` succeeds

---

### Phase 6: Tests and Quality Gates

**Files created:**

- `packages/component-composition/src/__tests__/schemas.test.ts` — valid config parses; invalid component name rejected; invalid slot key for specific component rejected
- `packages/component-composition/src/__tests__/conditions.test.ts` — all three condition types, edge cases
- `packages/component-composition/src/__tests__/render-page.test.tsx` — section ordering, condition filtering, graceful unknown component handling, defaultSlots merge
- `tools/lib/__tests__/composition-structural-pass.test.ts` — golden fixture: navagarden + designlab briefs produce schema-valid output
- `tools/lib/__tests__/composition-visual-pass.test.ts` — golden fixture: valid DeepPartialThemeConfig, zero hardcoded hex

**Files modified:**

- `scripts/check-token-usage.ts` — add composable directory to hardcoded hex check, default export check, `"use client"` check

**Verification gate:** `pnpm test`, `pnpm lint`, `pnpm type-check` all pass

---

### Phase 7: Evaluation

Run both AI passes against navagarden and designlab briefs. Evaluate the PoC site on:

1. **Visual fidelity (1–5):** Does the page reflect the reference's design language?
2. **Structural correctness:** Right sections, right order, slot behavior correct?
3. **Catalog gaps:** Which blueprint sections couldn't map to any composable component?

Document in `output/sessions/2026-04/2026-04-18_component-composition-system/poc-evaluation.md`.
Update `docs/architecture/component-composition-system.md` with findings and gap backlog.

---

## Sequencing

| Phase                    | Depends on                    | Can parallelize with |
| ------------------------ | ----------------------------- | -------------------- |
| 0: Architecture doc      | —                             | —                    |
| 1: Composition package   | Phase 0                       | —                    |
| 2: Composable components | Phase 1 (slot schema pattern) | —                    |
| 3: Registry + renderer   | Phase 1 + Phase 2             | —                    |
| 4a: Structural pass      | Phase 1 + Phase 3             | Phase 4b             |
| 4b: Visual pass          | Phase 1                       | Phase 4a, Phase 6    |
| 5: PoC site              | Phase 3 + Phase 4a + Phase 4b | Phase 6              |
| 6: Tests + quality gates | Phase 3                       | Phase 4, Phase 5     |
| 7: Evaluation            | Phase 5                       | —                    |

**Critical path:** 0 → 1 → 2 → 3 → 5

---

## Risk Register

| Risk                                              | Mitigation                                                                                                                                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discriminated union schema becomes unwieldy       | Each component's Zod schemas are co-located and auto-imported by registry. Adding a component = add 2 files + add to registry array. Manageable at 30+ components.                                      |
| `data: Record<string, unknown>` lacks type safety | Acceptable for PoC. Production path: each component defines a `DataSchema`; renderer validates data at render time.                                                                                     |
| AI structural pass hallucinates component names   | Prefill layer handles component names. Zod validation catches all violations. Retry loop repairs.                                                                                                       |
| Existing sites break                              | New packages are additive. No existing import paths modified except core-components barrel (backwards-compatible). `pnpm build` is verification gate.                                                   |
| zod@3 vs zod@4 mismatch                           | `component-composition` pins `zod@^3.24.0`; `.slots.ts` files also use zod@3 (consumed by component-composition). pnpm handles hoisting. If issues arise, move slot schemas into component-composition. |
| Hero `"use client"` trap                          | New `HeroSection` is explicitly a Server Component. No `@/lib/*` imports. Enforced by CI grep check.                                                                                                    |

---

## Critical Files

| File                                         | Role                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `packages/theme-system/src/types.ts`         | Existing `ThemeConfig` + Zod schemas — visual pass output must be compatible      |
| `tools/lib/core-component-catalog.ts`        | Extend with composable entries; source for deterministic prefill                  |
| `tools/lib/component-matcher.ts`             | Reuse `matchComponents()` for structural pass prefill layer                       |
| `tools/lib/design-brief-types.ts`            | Input schema for both AI passes — especially `SectionBlueprintBrief.contentSlots` |
| `packages/core-components/src/index.ts`      | Add composable barrel export here                                                 |
| `output/briefs/navagarden/design-brief.json` | Primary reference for PoC                                                         |
| `output/briefs/designlab/design-brief.json`  | Secondary reference for structural/visual pass validation                         |
