I’ll draft the implementation plan and save it as `codex-plan.md` in the requested folder, then I’ll give you the exact synthesis command.

Implemented plan content for `output/sessions/codex-peer-review/2026-04/2026-04-18_component-composition-system/codex-plan.md`:

```markdown
# Codex Peer Review Plan — Component Composition System

## 1) Scope lock + architecture decisions (foundation)

1. **Lock architectural invariants before coding**
   - **Decisions to formalize:**
     - Structural composition and visual styling are separate artifacts and separate AI passes.
     - `SiteCompositionConfig` is the only source of page structure for PoC home page.
     - Per-site `theme.config.ts` + site CSS are the only visual inputs; named themes are optional presets.
     - Slot toggles are **binary visibility only**; no style variants in slots.
   - **Files**
     - Create: `docs/architecture/component-composition-system.md`
   - **Verification gate**
     - Team can answer: “Where do layout choices live?” (composition), “Where does visual identity live?” (theme tokens + CSS), “Where do style variants live?” (not in slot toggles).

2. **Define strict naming + export conventions**
   - **Rules:** named exports only, TS interfaces for props, RSC by default, token classes only.
   - **Files**
     - Modify: `docs/conventions/components.md` (or create if missing)
   - **Verification gate**
     - Lint/typecheck catches default exports and missing interfaces in new component package.

---

## 2) Build the new composition package (types, schemas, registry)

3. **Create a dedicated package for composition runtime + schemas**
   - **Files**
     - Create: `packages/component-composition/package.json`
     - Create: `packages/component-composition/src/index.ts`
     - Create: `packages/component-composition/src/types.ts`
     - Create: `packages/component-composition/src/schemas.ts`
     - Create: `packages/component-composition/src/registry.ts`
     - Create: `packages/component-composition/src/conditions.ts`
     - Create: `packages/component-composition/src/render-page.tsx`
   - **Verification gate**
     - Package builds and exports schemas/types/renderer without pulling client-only deps.

4. **Define core TS shapes (strongly typed, component-aware)**
   - **Types in `types.ts`:**
     - `export type PageType = "home"` (PoC scope)
     - `export type ComponentName = ...` (enum-like union generated from registry keys)
     - `export interface BaseSectionConfig { id: string; component: ComponentName; condition?: ConditionConfig }`
     - `export interface ConditionConfig { type: "always" | "flag" | "data-present"; key?: string; equals?: string | boolean | number }`
     - `export interface SiteCompositionConfig { siteId: string; version: 1; pages: Array<{ pageType: PageType; sections: SectionConfig[] }> }`
     - `SectionConfig` as **discriminated union by `component`** so `slots`/`layout` are type-bound to component.
   - **Verification gate**
     - In TS, assigning `slots` keys that don’t exist on selected component fails compile-time.

5. **Define Zod schema with discriminated union for sections**
   - **Approach**
     - Each component exports `SlotsSchema` + `LayoutSchema`.
     - `schemas.ts` imports all component schemas and creates:
       - `SectionSchema = z.discriminatedUnion("component", [ ...component-specific section schemas ])`
       - `SiteCompositionConfigSchema` wrapping pages/sections.
   - **Files**
     - Modify: `packages/component-composition/src/schemas.ts`
   - **Verification gate**
     - Invalid component names rejected.
     - Invalid slot keys for a specific component rejected.
     - Unknown layout params rejected (`.strict()`).

6. **Condition evaluation runtime**
   - **`conditions.ts`**
     - `evaluateCondition(condition, ctx)` where `ctx` has `flags` and `data`.
     - Supported:
       - `always`
       - `flag` (`ctx.flags[key] === equals` or truthy)
       - `data-present` (`ctx.data[key] != null`)
   - **Rationale**
     - Keeps condition language minimal, deterministic, JSON-safe for AI generation.
   - **Verification gate**
     - Unit tests for true/false cases and missing keys.

---

## 3) New component library (6–8 components, slot-first API)

7. **Create fresh composable component set (do not retrofit old 55)**
   - **Location**
     - `packages/composable-sections/src/components/...`
   - **Initial 8 components for home-page coverage (navagarden + designlab):**
     1. `SiteHeader`
     2. `HeroSplit`
     3. `HeroOverlay`
     4. `FeatureGrid`
     5. `ServicesGrid`
     6. `Testimonials`
     7. `CTASection`
     8. `SiteFooter`

8. **Standard contract each component must export**
   - **Per component files**
     - `ComponentName.tsx`
     - `ComponentName.types.ts`
     - `ComponentName.schema.ts`
   - **Required exports**
     - `export interface ComponentNameSlotsConfig { ...boolean flags... }`
     - `export const COMPONENT_NAME_DEFAULT_SLOTS: ComponentNameSlotsConfig`
     - `export const ComponentNameSlotsSchema = z.object({...}).strict()`
     - `export interface ComponentNameLayoutConfig { ... }`
     - `export const ComponentNameLayoutSchema = z.object({...}).strict()`
     - `export interface ComponentNameProps { slots?: Partial<ComponentNameSlotsConfig>; layout?: Partial<ComponentNameLayoutConfig>; data: ... }`
   - **Slot merge pattern**
     - `const resolvedSlots = { ...COMPONENT_NAME_DEFAULT_SLOTS, ...slots }`
   - **Verification gate**
     - Rendering with no `slots` shows full component (backward compatibility requirement).

9. **Suggested slot sets + layout params**
   - `SiteHeaderSlots`: `logo`, `primaryNav`, `secondaryNav`, `ctaButton`, `topBar`
   - `HeroSplitSlots`: `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `media`, `trustBadges`
   - `HeroOverlaySlots`: `heading`, `subheading`, `primaryCta`, `secondaryCta`, `backgroundImage`, `overlay`
   - `FeatureGridSlots`: `sectionHeading`, `sectionIntro`, `icons`, `featureDescriptions`
   - `ServicesGridSlots`: `sectionHeading`, `serviceImage`, `serviceExcerpt`, `serviceCta`
   - `TestimonialsSlots`: `sectionHeading`, `quote`, `authorName`, `authorMeta`, `rating`
   - `CTASectionSlots`: `heading`, `body`, `primaryCta`, `secondaryCta`, `supportingNote`
   - `SiteFooterSlots`: `logo`, `navColumns`, `contactBlock`, `socialLinks`, `legal`
   - **Layout examples**
     - `columns`, `mediaPosition`, `maxItems`, `align`, `containerWidth`, `dense`, `variant`.
   - **Verification gate**
     - All classes are token-based utilities only; grep check finds no hardcoded hex or inline style.

10. **Component registry map (runtime-safe, no dynamic import for PoC)**
    - **`registry.ts`**
      - Static imports of all 8 components.
      - `export const componentRegistry: Record<ComponentName, ComponentDefinition>`
      - `ComponentDefinition` includes render fn + slots/layout schemas.
    - **Why static map**
      - Strong typing, predictable RSC behavior, easier validation and error handling.
    - **Verification gate**
      - Unknown component in config never crashes SSR; renderer logs and skips section or renders fallback.

---

## 4) Page renderer implementation

11. **Implement composition renderer**
    - **`render-page.tsx`**
      - API:
        - `renderComposedPage({ composition, pageType, data, flags })`
      - Flow:
        1. Find page by `pageType`
        2. Iterate ordered sections
        3. Evaluate `condition`
        4. Validate section against component schema (defensive runtime check)
        5. Render component from registry with `slots`, `layout`, and mapped data
    - **Error strategy**
      - Non-fatal per-section failure (collect diagnostics + continue).
    - **Verification gate**
      - Unit/integration test confirms order fidelity, condition filtering, graceful unknown handling.

---

## 5) Structural AI pass (DesignBrief → SiteCompositionConfig)

12. **Add structural composition prompt**
    - **Files**
      - Modify: `tools/lib/reference-analysis-prompts.ts` (add structural pass prompt template)
      - Create: `tools/lib/composition-structural-pass.ts`
    - **Prompt contents**
      - Input: existing `DesignBrief` JSON.
      - Include explicit component catalog payload:
        - allowed component names
        - each component’s supported slots + layout params + defaults
      - Rules:
        - output JSON only
        - only allowed enum values
        - home page only for PoC
        - no invented fields
    - **Validation loop**
      - Parse model output → `SiteCompositionConfigSchema`.
      - On fail: generate concise repair prompt with Zod errors; retry (max N attempts).
    - **Verification gate**
      - Structural pass produces valid config from real briefs (`navagarden`, `designlab`) without manual edits.

13. **Map DesignBrief blueprints to component choices**
    - **Heuristic layer before/after AI**
      - Optional deterministic prefill from `pageBlueprints.sections[].category/layoutPattern`.
      - AI focuses on ordering + slot toggles + layout details.
    - **Trade-off**
      - More determinism, less hallucination.
    - **Verification gate**
      - Same input brief yields stable composition across runs (variance reduced).

---

## 6) Visual AI pass (DesignBrief → token config + CSS)

14. **Add visual transfer prompt (independent of structure)**
    - **Files**
      - Modify: `tools/lib/reference-analysis-prompts.ts` (add visual pass prompt)
      - Create: `tools/lib/composition-visual-pass.ts`
      - Create: `tools/lib/visual-output-schema.ts`
    - **Output contract**
      - JSON object with:
        - `themeConfig`: `DeepPartial<ThemeConfig>` compatible object
        - `cssOverrides`: string (or array of CSS blocks)
        - `fontLinks`: array of `<link href=...>` descriptors (no `@import url()`)
        - `provenance`: token-level source map (`computed|vision|derived|fallback`)
    - **Use existing computed tokens**
      - Feed `computed-style-token-mapper.ts` output as a high-priority signal for button radius/padding/shadow.
    - **Verification gate**
      - Output validates against `ThemeConfig` partial schema + provenance schema.

15. **Persist visual outputs in per-site files**
    - **Files (site-level)**
      - `sites/<poc-site>/theme.config.ts` (named export)
      - `sites/<poc-site>/app/theme-overrides.css`
      - `sites/<poc-site>/app/font-links.tsx` or layout helper
    - **Constraint checks**
      - No `theme()` in CSS.
      - Fonts loaded via `<link>` in `layout.tsx`.
    - **Verification gate**
      - `next build --webpack` succeeds with generated files.

---

## 7) PoC site wiring (home page only, zero hand-written page TSX composition)

16. **Create PoC site composition artifacts**
    - **Files**
      - `sites/<poc-site>/composition/home.composition.json`
      - `sites/<poc-site>/app/page.tsx`
      - `sites/<poc-site>/app/layout.tsx`
      - `sites/<poc-site>/lib/page-data.ts` (content payload consumed by components)
    - **`app/page.tsx` shape**
      - Load composition JSON
      - Validate with `SiteCompositionConfigSchema`
      - Call `renderComposedPage(...)`
      - No section TSX authored in page file
    - **Verification gate**
      - Home page renders entirely from composition + tokens/CSS.

17. **Tailwind and build constraints**
    - **Files**
      - Modify site/root `tailwind.config.*`
    - **Required changes**
      - Use scoped theme globs: `packages/themes/*/*.{ts,tsx}`
      - Ensure new component package paths included.
    - **Verification gate**
      - No accidental `node_modules` crawl; classes from new package resolve.

---

## 8) Testing + quality gates

18. **Schema and renderer tests**
    - **Files**
      - `packages/component-composition/src/__tests__/schemas.test.ts`
      - `packages/component-composition/src/__tests__/renderer.test.tsx`
    - **Coverage**
      - enum validation, slot strictness, layout strictness, condition logic, section order.
    - **Verification gate**
      - Test suite green in CI.

19. **Prompt pipeline tests (golden fixtures)**
    - **Files**
      - `tools/lib/__tests__/composition-structural-pass.test.ts`
      - `tools/lib/__tests__/composition-visual-pass.test.ts`
      - fixtures from `output/briefs/navagarden/design-brief.json` and `output/briefs/designlab/design-brief.json`
    - **Verification gate**
      - Both passes emit schema-valid outputs from real briefs.

20. **Static checks for constraints**
    - Add grep/lint checks:
      - no hex in component TSX/CSS modules in composable library
      - no inline styles in section components
      - no default exports in new packages
    - **Verification gate**
      - CI fails fast on architectural violations.

---

## 9) Positioning of named themes (orion/vega)

21. **Reclassify named themes as optional presets**
    - **Action**
      - Keep `packages/themes/orion`, `vega` intact for legacy consumers.
      - Document as bootstrap presets only.
      - New composition flow does not require `
```
