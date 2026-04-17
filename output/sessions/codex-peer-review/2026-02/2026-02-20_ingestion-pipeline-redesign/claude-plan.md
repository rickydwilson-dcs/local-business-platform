# Claude's Plan: Ingestion Pipeline Redesign — Per-Theme Component Generation

**Date:** 2026-02-20
**Author:** Claude (independent plan, written before Codex review)

---

## Core Architectural Decision

Every theme owns its components. When the pipeline ingests a reference site, it produces a complete set of components for that theme — no matching against existing components, no reuse. Components are categorized (Hero, Nav, CTA, etc.) for the showcase to group variants across themes.

**Component location:** Per-theme components live inside the theme package itself at `packages/themes/<name>/components/`. This keeps themes self-contained — deleting a theme package removes everything associated with it.

**Existing themes (orion, vega):** Retrofitted later, not in this session. For now, orion and vega continue using core-components. Newly ingested themes get per-theme components from day one. The showcase handles both patterns.

---

## Phase 1: Update `ReferenceAnalysis` Type

**File:** `tools/lib/reference-analysis-types.ts`

Remove matching-focused fields. Replace with generation-focused fields.

**Remove:**

- `componentMappings[]` (REUSE/ADAPT/NEW matching)
- `newComponentBacklog[]` (only existed for NEW matches)

**Replace with:**

```typescript
componentSpecs: Array<{
  name: string; // PascalCase component name, e.g. "HeroFullBleed"
  category: ComponentCategory; // "Hero" | "Navigation" | "Cards" | "CTA" | etc.
  description: string; // What this section does visually
  propsInterface: string; // TypeScript interface as string
  structuralNotes: string; // DOM structure description: layout, key elements, responsive behavior
  tokenUsage: string[]; // Which token families it uses: ["brand-primary", "surface-background", ...]
  referenceSection: string; // Which detectedSection this maps to
}>;
```

**Add a `ComponentCategory` type** (align with showcase's `ElementCategory`):

```typescript
type ComponentCategory =
  | "Hero"
  | "Navigation"
  | "Cards"
  | "CTA"
  | "Content"
  | "Social Proof"
  | "Blog"
  | "Stats"
  | "Footer"
  | "Custom";
```

**Keep unchanged:**

- `visualLanguage` — still needed for token generation
- `detectedSections[]` — still the raw section detection output
- `registryRecommendation` — simplified (see Phase 3)
- `themeTokenRecommendations` — still needed for token generation

**Verification:** TypeScript compiles. Existing `scaffold-theme-package.ts` will break (expected — updated in Phase 4).

---

## Phase 2: Rewrite `REFERENCE_ANALYSIS_PROMPT`

**File:** `tools/lib/reference-analysis-prompts.ts`

The current prompt asks the model to match sections against a hardcoded 17-component list. Replace with a prompt that asks the model to:

1. Detect all visual sections top-to-bottom (same as today)
2. Classify each section into a `ComponentCategory` (no matching — just categorization)
3. For each section, produce a `componentSpec`:
   - Describe the structural layout (grid? full-bleed? split? flexbox?)
   - Describe key elements (background image? overlay? typed animation? button count?)
   - Draft a TypeScript props interface
   - List which theme tokens the component should use
   - Name the component with a descriptive PascalCase name

The prompt should explicitly say: "Do NOT match against existing components. Every section gets a new component specification."

**Remove:** The hardcoded component list from instruction #3.

**Keep:** Colour sampling instructions, JSON-only output format, `visualLanguage` and `themeTokenRecommendations` sections.

**Verification:** Run the pipeline against an existing screenshot with `--analyse --dry-run`. Confirm the output JSON has `componentSpecs` instead of `componentMappings`.

---

## Phase 3: Simplify `ComponentRegistry` and Remove Layout Classification

**File:** `packages/theme-system/src/types.ts`

The current `ComponentRegistry` has hardcoded variant enums (`heroVariant: "image-overlay" | "split" | "minimal"`). These were an attempt to describe themes in a fixed taxonomy — but with per-theme unique components, the taxonomy is the component catalog itself.

**Option A (minimal change):** Keep `ComponentRegistry` but make variant fields optional and add a `componentManifest` field:

```typescript
export interface ComponentRegistry {
  theme: ThemeName;
  componentManifest?: Record<ComponentCategory, string>; // category → component file path
  // Keep existing variant fields as optional for backward compat with orion/vega
  heroVariant?: "image-overlay" | "split" | "minimal";
  headerVariant?: "dark" | "light";
  cardVariant?: "icon-circle" | "standard" | "overlay";
  sectionVariant?: "dark-accent" | "gradient" | "standard" | "banded";
}
```

**Option B (clean break):** Replace `ComponentRegistry` entirely:

```typescript
export interface ComponentRegistry {
  theme: ThemeName;
  components: Array<{
    name: string;
    category: ComponentCategory;
    path: string; // relative path from theme package root
  }>;
}
```

**Recommendation:** Option A. It preserves backward compatibility with existing orion/vega themes while supporting the new model. The variant fields become documentation for hand-built themes; `componentManifest` becomes the source of truth for pipeline-generated themes.

**Remove `classifyLayoutPattern()`** from `tools/generate-theme-from-reference.ts`. This Haiku-based text-only classification step picks "orion" or "vega" — which is no longer relevant since new themes don't map to existing families. The vision analysis (Sonnet) does everything we need.

**Verification:** `pnpm type-check` passes. Existing `orionRegistry` and `vegaRegistry` objects still valid.

---

## Phase 4: Update `scaffold-theme-package.ts`

**File:** `tools/scaffold-theme-package.ts`

The scaffolder currently creates `index.ts` + `globals.css` + `README.md` + `SETUP.md`. Update it to also scaffold component files.

**New output structure:**

```
packages/themes/<name>/
  index.ts          — registry + tokens (updated to include componentManifest)
  globals.css       — theme-specific CSS utilities
  components/
    hero-full-bleed.tsx
    nav-overlay.tsx
    cta-band.tsx
    ... (one per componentSpec)
  README.md         — component catalog + setup instructions
  SETUP.md          — manual steps checklist
```

**Component file generation:** For each `componentSpec` in the analysis:

1. Create a file at `packages/themes/<name>/components/<kebab-case-name>.tsx`
2. Contents: a scaffold with the props interface, basic JSX structure using theme tokens, and TODO comments for the structural details
3. The scaffold is NOT a finished component — it's a starting point that a developer/AI refines. The structural notes and reference section description provide the specification.

**Why scaffold, not finished component:** The vision model can describe structure accurately but generating production-quality React components from a screenshot in one shot is unreliable. The scaffold + spec approach gives the implementation session (human or AI) a clear contract to build against.

**Update `index.ts` generation** to include `componentManifest` in the registry:

```typescript
export const <name>Registry: ComponentRegistry = {
  theme: "<name>",
  componentManifest: {
    "Hero": "./components/hero-full-bleed",
    "Navigation": "./components/nav-overlay",
    // ...
  },
};
```

**Update `package.json` exports** to include the components directory:

```json
"./<name>/components/*": "./<name>/components/*"
```

**Verification:** Run scaffolder against a reference-analysis.json. Confirm component files are created, `index.ts` has `componentManifest`, and `pnpm type-check` passes.

---

## Phase 5: Update Pipeline Entry Point

**File:** `tools/generate-theme-from-reference.ts`

Simplify the main flow:

```
Reference URL + screenshot
  → [Step 1] Colour extraction (keep as-is)
  → [Step 2] Vision analysis (Sonnet) — sections + categories + component specs + tokens
  → [Step 3] Token reconciliation (vision tokens override scraped if confident)
  → [Step 4] Write reference-analysis.json + .md report
  → [Step 5] Run scaffold (inline or call scaffold-theme-package.ts)
```

**Remove:**

- `classifyLayoutPattern()` — the Haiku text-only classification step
- `LayoutClassification` interface
- The `layout.theme` parameter passing (no longer picking orion/vega)

**Keep:**

- Colour extraction (Step 1) — still valuable as a first pass before vision
- Vision analysis (Step 2b) — becomes Step 2, now the primary analysis
- Token reconciliation (Step 3)
- Report generation

**Verification:**

```bash
npx tsx tools/generate-theme-from-reference.ts \
  --url https://example.com \
  --image /path/to/screenshot.png \
  --name test-theme \
  --analyse --dry-run
```

Confirm: no REUSE/ADAPT/NEW in output, `componentSpecs` array present, component scaffold files listed.

---

## Phase 6: Update Showcase Registry Pattern

**File:** `sites/showcase/registry/index.ts` + individual registry files

Change `ElementDefinition.render` to support per-theme render functions:

```typescript
export interface ElementDefinition {
  slug: string;
  name: string;
  category: ElementCategory;
  description: string;
  renders: Record<string, () => React.ReactNode>; // theme name → render function
}

// Derived: themes = Object.keys(renders)
```

Update existing registry files (hero.tsx, cards.tsx, etc.) to use the new pattern:

```typescript
// Before:
render: (theme) => theme === 'orion' ? <HeroWithImage .../> : <HeroSection .../>

// After:
renders: {
  orion: () => <HeroWithImage .../>,
  vega: () => <HeroSection .../>,
}
```

Update consuming pages:

- `ElementCard.tsx` — `element.renders[t.name]?.()`
- `/elements/[slug]/page.tsx` — skip themes with no render
- `/compare/page.tsx` — show placeholder for missing variants
- `/themes/[name]/page.tsx` — filter to elements that have a render for this theme

**For new pipeline-generated themes:** The scaffolder generates a registry file alongside the components:

```
packages/themes/<name>/
  showcase-registry.tsx  — ElementDefinition entries for each component
```

The showcase's `register-all-themes.ts` imports these automatically.

**Verification:** Showcase builds successfully. Browse page filters by category. Compare page shows all themes. Missing variants show placeholder instead of crashing.

---

## Phase 7: Delete Dead Code

- `tools/lib/component-mapping-catalog.ts` — never used, now architecturally obsolete
- `COMPONENT_CATALOG` references (if any remain in comments)
- `classifyLayoutPattern()` and `LayoutClassification` interface in `generate-theme-from-reference.ts`

**Verification:** `pnpm build` and `pnpm type-check` from root.

---

## Risks

| Risk                                                                                              | Mitigation                                                                                                                                           |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component scaffolds are low quality — developers spend more time fixing than writing from scratch | Keep scaffolds minimal: props interface + token-usage hints + structural description in comments. Don't try to generate full JSX.                    |
| The vision model produces inconsistent component specs across runs                                | Pin temperature to 0, provide detailed schema in prompt, validate output against Zod schema before writing files                                     |
| Existing orion/vega themes break when `ComponentRegistry` changes                                 | Option A (additive changes + optional fields) maintains backward compat. Existing registries remain valid.                                           |
| Showcase becomes unwieldy with many themes                                                        | Category filtering already exists. The compare page scales via CSS grid. May need pagination later but not now.                                      |
| `globals.css` per theme needs to be self-contained                                                | Each theme's globals only needs classes used by its own components. The scaffold step should generate globals entries alongside component scaffolds. |
| `THEME_NAMES` const array needs manual updating for each new theme                                | The scaffolder already updates `packages/themes/package.json`. Extend it to also update `THEME_NAMES` in `types.ts`.                                 |

---

## File Change Summary

| File                                          | Change                                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `tools/lib/reference-analysis-types.ts`       | Remove `componentMappings`, `newComponentBacklog`. Add `componentSpecs`, `ComponentCategory`       |
| `tools/lib/reference-analysis-prompts.ts`     | Rewrite prompt: remove component matching list, add categorization + spec generation               |
| `tools/lib/component-mapping-catalog.ts`      | **Delete**                                                                                         |
| `packages/theme-system/src/types.ts`          | Add `componentManifest?` to `ComponentRegistry`, add `ComponentCategory` type                      |
| `tools/generate-theme-from-reference.ts`      | Remove `classifyLayoutPattern()`, `LayoutClassification`. Simplify to: extract → vision → scaffold |
| `tools/scaffold-theme-package.ts`             | Generate component scaffold files + `componentManifest` in registry + showcase registry file       |
| `sites/showcase/registry/index.ts`            | Change `render` to `renders: Record<string, () => React.ReactNode>`                                |
| `sites/showcase/registry/*.tsx`               | Refactor from `render(theme)` branching to `renders: { theme: () => ... }`                         |
| `sites/showcase/components/ElementCard.tsx`   | Use `renders[theme]?.()`                                                                           |
| `sites/showcase/app/elements/[slug]/page.tsx` | Use `renders[theme]?.()`, skip missing                                                             |
| `sites/showcase/app/compare/page.tsx`         | Use `renders[theme]?.()`, placeholder for missing                                                  |
| `sites/showcase/app/themes/[name]/page.tsx`   | Filter elements by `renders[name]` existence                                                       |
| `sites/showcase/lib/register-all-themes.ts`   | Auto-import new theme showcase registries                                                          |

---

## Implementation Order

Phases 1-2-3 can be done together (type changes + prompt rewrite + registry update).
Phase 4 depends on 1-2-3 (scaffolder consumes new types).
Phase 5 depends on 4 (pipeline calls scaffolder).
Phase 6 can be done in parallel with 4-5 (showcase is independent of the pipeline).
Phase 7 is cleanup after everything else works.

**Suggested execution:**

1. Phases 1+2+3 → verify types compile
2. Phase 4 → verify scaffolder produces correct output
3. Phase 5 → verify end-to-end pipeline
4. Phase 6 → verify showcase builds
5. Phase 7 → cleanup + final verification
