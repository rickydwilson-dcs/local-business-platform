# Implementation Plan: Ingestion Pipeline Redesign — Per-Theme Component Generation

**Date:** 2026-02-20
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| Component generation approach | Scaffold-only: props interface + TODO comments, refined in a follow-up session | Template-based generator: deterministic file structure + AI-filled JSX body + post-generation hex linter | **Codex wins.** Scaffolds that need a separate implementation session are the current pattern and it's slow. A template-based generator with deterministic wrappers around AI-generated JSX, plus a hex-linter validation pass, is more useful. The linter catches the most likely failure mode (hardcoded colors). |
| New analysis field naming | `componentSpecs[]` with `structuralNotes`, `tokenUsage` | `sectionBlueprints[]` with `layoutPattern`, `contentSlots`, `interactionNeeds` | **Codex wins.** `sectionBlueprints` is clearer — these are blueprints for generation, not specs for matching. The additional fields (`contentSlots`, `interactionNeeds`) give the generator richer input for deciding Server vs Client Component and which content props to expose. |
| Theme manifest | `componentManifest` field added to `ComponentRegistry` type (Record<category, path>) | Separate `manifest.ts` file per theme package | **Codex wins.** A dedicated manifest file keeps the `ComponentRegistry` type focused on theme-system concerns and doesn't pollute it with file-path references. The manifest is consumed by the showcase and tooling, not by the theme-system runtime. |
| Showcase integration | Replace `render(theme)` with `renders: Record<string, () => ReactNode>` — refactor all existing registry files | New `from-theme-manifest.ts` loader for new themes; keep legacy static registry files as-is | **Both, combined.** The `renders` pattern is cleaner and should be the target for all themes. But the Codex point about a manifest-driven loader is good — new themes auto-register via their manifest.ts, while legacy themes keep hand-written registry entries. Migrate orion/vega to `renders` pattern now (low risk, mechanical refactor); add manifest loader for pipeline-generated themes. |
| globals.css validation | Mentioned as a risk, no specific mechanism | Explicit: scan component classNames for non-standard-Tailwind utilities, verify defined in theme's globals.css | **Codex wins.** A validation pass prevents themes from silently depending on another theme's CSS classes. |
| Schema versioning | Not mentioned | `analysisVersion: "2"` + reject v1 JSON in scaffold v2 path | **Codex wins.** Cheap to implement, prevents stale v1 JSON from being fed to the new scaffolder. |
| Documentation | Not mentioned | New `docs/ingestion-v2-architecture.md` + update tools/README.md | **Codex wins.** This is a major architectural shift — it should be documented. |

## Blind Spots Caught

**Codex caught (Claude missed):**
- Schema versioning (`analysisVersion: "2"`) — prevents stale v1 analysis JSON from producing broken output in the new scaffolder
- Post-generation hex linter — validates that generated components actually comply with the token-only constraint
- `interactionNeeds` field in blueprints — enables the generator to decide Server vs Client Component automatically rather than hoping the AI model gets it right
- Documentation artifact (`docs/ingestion-v2-architecture.md`) — architecture shifts need to be recorded
- `contentSlots` field — makes the props interface generation richer by explicitly listing what content areas the component exposes

**Claude caught (Codex missed):**
- Showcase `renders` pattern refactor — the existing `render(theme)` branching pattern should be updated for orion/vega too (not just left as legacy), since it's a mechanical refactor that improves code clarity
- `THEME_NAMES` const array needs auto-updating — the scaffolder should append new theme names to `types.ts`, not require manual editing
- Showcase `register-all-themes.ts` auto-import — new theme showcase registries should be auto-discovered, not manually imported

---

## Implementation Plan

### Phase A: Contracts (Types + Prompt + Classification Removal)

**Goal:** New analysis schema compiles, prompt produces generation-focused output, Haiku classification removed.

#### Step A1: Update `ReferenceAnalysis` type

**File:** `tools/lib/reference-analysis-types.ts`

Bump version: `analysisVersion: "1"` → `analysisVersion: "1" | "2"`

Remove:
- `componentMappings[]`
- `newComponentBacklog[]`

Add:
```typescript
export type ComponentCategory =
  | "Hero" | "Navigation" | "Cards" | "CTA" | "Content"
  | "Social Proof" | "Blog" | "Stats" | "Footer" | "Custom";

sectionBlueprints: Array<{
  id: string;                    // unique slug, e.g. "hero-full-bleed"
  name: string;                  // PascalCase component name, e.g. "HeroFullBleed"
  category: ComponentCategory;
  purpose: string;               // what this section does
  layoutPattern: string;         // structural description: "full-bleed with overlay" / "2-col grid" / etc.
  contentSlots: string[];        // named content areas: ["heading", "subheading", "ctaButtons", "backgroundImage"]
  interactionNeeds: "none" | "minimal" | "stateful";  // drives Server vs Client Component decision
  componentFileName: string;     // kebab-case: "hero-full-bleed.tsx"
  componentExportName: string;   // PascalCase: "HeroFullBleed"
  tokenUsageHints: string[];     // ["bg-brand-primary", "text-surface-foreground", ...]
  confidence: "high" | "medium" | "low";
  referenceSection: string;      // which detectedSection this maps to
}>;
```

Simplify `registryRecommendation` — remove `heroVariant`/`headerVariant`/`cardVariant`/`sectionVariant` (no longer needed for new themes):
```typescript
registryRecommendation: {
  themeName: string;
  confidence: "high" | "medium" | "low";
  reasoning: string;
};
```

#### Step A2: Rewrite `REFERENCE_ANALYSIS_PROMPT`

**File:** `tools/lib/reference-analysis-prompts.ts`

Remove:
- Hardcoded 17-component matching list
- All REUSE/ADAPT/NEW instructions

Replace with instructions to:
1. Detect all visual sections top-to-bottom (same as today)
2. Classify each into a `ComponentCategory`
3. For each section, produce a `sectionBlueprint`:
   - Describe layout pattern (grid/full-bleed/split/flexbox)
   - List content slots (what props the component exposes)
   - Assess interaction needs (none/minimal/stateful)
   - Suggest a PascalCase component name and kebab-case filename
   - List which theme tokens it should use
4. Explicitly state: "Do NOT match against existing components. Every section gets its own blueprint."

Keep: colour sampling instructions, JSON-only output, `visualLanguage`, `themeTokenRecommendations`.

#### Step A3: Remove `classifyLayoutPattern()` and `LayoutClassification`

**File:** `tools/generate-theme-from-reference.ts`

Delete:
- `classifyLayoutPattern()` function
- `LayoutClassification` interface
- The Haiku API call and `layout.theme` parameter flow

The pipeline now goes straight from colour extraction to Sonnet vision analysis.

**Verification gate:**
```bash
pnpm type-check
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --image output/sessions/2026-02-20_reference-theme-generation/colorcode-screenshot.png \
  --name test-theme \
  --analyse --dry-run
```
Confirm: JSON output has `analysisVersion: "2"`, `sectionBlueprints[]` present, no `componentMappings`, no `newComponentBacklog`, no REUSE/ADAPT/NEW.

---

### Phase B: Generation Engine (Component Generator + Scaffold Updates)

**Goal:** Pipeline generates actual component files per section blueprint.

#### Step B1: Create template-based component generator

**New file:** `tools/lib/theme-component-generator.ts`

Design: deterministic file structure wrapping AI-generated JSX body.

For each `sectionBlueprint`:
1. **Deterministic wrapper** (template-based, no AI):
   - File header with `'use client'` directive only when `interactionNeeds === "stateful"`
   - Import statements (React, theme tokens)
   - TypeScript props interface derived from `contentSlots`
   - Named export with `componentExportName`
2. **AI-generated body** (Claude Sonnet call):
   - JSX structure based on `layoutPattern` and `contentSlots`
   - Tailwind classes using only token names from `tokenUsageHints`
   - Responsive breakpoints following platform conventions
3. **Post-generation validation**:
   - Hex literal scanner — reject any `/[#][0-9A-Fa-f]{3,8}/` in generated TSX
   - TypeScript compile check (`tsc --noEmit`) on the generated file
   - Named export verification

**New file:** `tools/lib/theme-component-templates.ts`

Template fragments for common patterns:
- Server Component shell
- Client Component shell (with `'use client'` + `useState` import)
- Props interface from content slots
- Standard import block

#### Step B2: Update `scaffold-theme-package.ts`

**File:** `tools/scaffold-theme-package.ts`

Add version gate: reject `analysisVersion: "1"` with clear error message.

New output structure:
```
packages/themes/<name>/
  index.ts              — registry + tokens + registerTheme()
  globals.css           — theme-specific utility classes (self-contained)
  manifest.ts           — component metadata: slug, category, export name, import path
  components/
    hero-full-bleed.tsx
    nav-overlay.tsx
    cta-band.tsx
    ...
  showcase-registry.tsx — ElementDefinition entries for showcase
  README.md             — generated inventory
```

The `manifest.ts` file:
```typescript
import type { ComponentCategory } from '../../theme-system/src/types';

export interface ThemeComponentEntry {
  slug: string;
  name: string;
  category: ComponentCategory;
  exportName: string;
  importPath: string;
}

export const manifest: ThemeComponentEntry[] = [
  { slug: 'hero-full-bleed', name: 'HeroFullBleed', category: 'Hero',
    exportName: 'HeroFullBleed', importPath: './components/hero-full-bleed' },
  // ...
];
```

The `showcase-registry.tsx` file generates `ElementDefinition` entries (using `renders` pattern) for each component:
```typescript
import { HeroFullBleed } from './components/hero-full-bleed';
// ...

export const novaElements: ElementDefinition[] = [
  {
    slug: 'hero-full-bleed--nova',
    name: 'Hero Full Bleed',
    category: 'Hero',
    description: 'Full-bleed hero with dark overlay',
    renders: {
      nova: () => <HeroFullBleed heading="..." subheading="..." />,
    },
  },
  // ...
];
```

Update `packages/themes/package.json` exports map to include:
```json
"./<name>": "./<name>/index.ts",
"./<name>/manifest": "./<name>/manifest.ts",
"./<name>/showcase": "./<name>/showcase-registry.tsx",
"./<name>/components/*": "./<name>/components/*"
```

Auto-append theme name to `THEME_NAMES` in `packages/theme-system/src/types.ts`.

#### Step B3: globals.css validation

**Add to generator pipeline:** After generating all component files for a theme, scan for non-standard Tailwind classes (anything not in Tailwind's default class list that isn't a theme token class). Verify each custom class is defined in the theme's `globals.css`. Warn on any mismatches.

**Verification gate:**
```bash
# Run scaffolder against a v2 reference-analysis.json
npx tsx tools/scaffold-theme-package.ts \
  --analysis output/sessions/.../reference-analysis.json \
  --name test-theme

# Verify output
ls packages/themes/test-theme/components/   # component files exist
pnpm type-check                             # no TypeScript errors
grep -r '#[0-9A-Fa-f]\{3,8\}' packages/themes/test-theme/components/  # no hex literals
```

---

### Phase C: Pipeline Integration

**Goal:** End-to-end pipeline works: screenshot → analysis → component generation → theme package.

#### Step C1: Simplify pipeline entry point

**File:** `tools/generate-theme-from-reference.ts`

New flow:
```
Reference URL + screenshot
  → [Step 1] Colour extraction (keep as-is)
  → [Step 2] Vision analysis (Sonnet) — sections + categories + blueprints + tokens
  → [Step 3] Token reconciliation (vision tokens override scraped if confident)
  → [Step 4] Write reference-analysis.json (v2) + .md report
  → [Step 5] Component generation (invoke theme-component-generator per blueprint)
  → [Step 6] Scaffold theme package (invoke scaffold-theme-package with generated components)
```

The `--analyse` flag becomes the default behavior (always produce full output). Keep the flag for backward compat but make it a no-op.

**Verification gate:**
```bash
npx tsx tools/generate-theme-from-reference.ts \
  --url https://example.com \
  --image /path/to/screenshot.png \
  --name test-theme

# Full output at packages/themes/test-theme/
ls packages/themes/test-theme/
# → index.ts  globals.css  manifest.ts  showcase-registry.tsx  components/  README.md

pnpm type-check
pnpm build --filter @platform/themes
```

---

### Phase D: Showcase Integration

**Goal:** New theme components appear in showcase, categorized alongside existing themes.

#### Step D1: Update `ElementDefinition` interface

**File:** `sites/showcase/registry/index.ts`

```typescript
export interface ElementDefinition {
  slug: string;
  name: string;
  category: ElementCategory;
  description: string;
  renders: Record<string, () => React.ReactNode>;  // theme name → render function
}
// Derived: themes for each element = Object.keys(element.renders)
```

#### Step D2: Refactor existing registry files to `renders` pattern

**Files:** `sites/showcase/registry/hero.tsx`, `cards.tsx`, `ctas.tsx`, etc.

Mechanical refactor — convert branching `render(theme)` to keyed `renders`:
```typescript
// Before:
render: (theme) => theme === 'orion' ? <HeroWithImage .../> : <HeroSection .../>

// After:
renders: {
  orion: () => <HeroWithImage .../>,
  vega: () => <HeroSection .../>,
}
```

#### Step D3: Add manifest-driven loader for new themes

**New file:** `sites/showcase/registry/from-theme-manifest.ts`

Reads `manifest.ts` + `showcase-registry.tsx` from each theme package and merges their `ElementDefinition` entries into the global `elements` array.

```typescript
// Auto-discovers themes by reading registered themes list
// For each theme with a showcase-registry.tsx, import and merge entries
```

Update `sites/showcase/registry/index.ts` to merge:
```typescript
import { legacyElements } from './legacy';  // orion/vega hand-written entries
import { loadThemeManifestElements } from './from-theme-manifest';

export const elements: ElementDefinition[] = [
  ...legacyElements,
  ...loadThemeManifestElements(),
];
```

#### Step D4: Update consuming pages

- `ElementCard.tsx` — `element.renders[t.name]?.()` with graceful skip for missing
- `/elements/[slug]/page.tsx` — skip themes with no render
- `/compare/page.tsx` — show placeholder for missing variants
- `/themes/[name]/page.tsx` — filter to elements that have a render for this theme

**Verification gate:**
```bash
cd sites/showcase && npm run build
# Browse /compare — all themes visible
# Browse /?category=Hero — hero variants from all themes
# Browse /themes/nova — nova components only
```

---

### Phase E: Cleanup and Documentation

#### Step E1: Delete dead code
- `tools/lib/component-mapping-catalog.ts` — delete entirely
- Remove any remaining `REUSE`/`ADAPT`/`NEW` references in pipeline code
- Remove `classifyLayoutPattern()` remnants if not already done

#### Step E2: Documentation
- **New:** `docs/architecture/how-ingestion-pipeline-works.md` — documents the v2 pipeline: screenshot → vision analysis → component generation → theme package
- **Update:** `tools/README.md` — pipeline CLI flags and behavior
- **Update:** `CLAUDE.md` — add ingestion pipeline architecture reference

#### Step E3: Final verification
```bash
pnpm type-check
pnpm build
pnpm lint
grep -r "REUSE\|ADAPT\|classifyLayoutPattern" tools/  # expect no matches
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| AI-generated JSX quality varies per run | Deterministic templates wrap the AI body; hex linter + tsc check validate output; `temperature: 0` for reproducibility |
| Category misclassification by vision model | Controlled enum in prompt; confidence field for manual review; future `--category-override` flag if needed |
| Transition complexity with dual showcase registration (legacy + manifest) | Clear separation: legacy files for orion/vega, manifest loader for pipeline themes. Migrate legacy to manifests later if desired. |
| globals.css duplication across themes | Expected and desired — self-containment is the goal. Each theme only defines what its components need. |
| `THEME_NAMES` array auto-updating risks merge conflicts | Scaffolder appends to array end; conflicts are trivial to resolve |
| Stale v1 analysis JSON fed to new scaffolder | `analysisVersion: "2"` check with explicit rejection message |

---

## File Change Summary

| File | Change |
|------|--------|
| `tools/lib/reference-analysis-types.ts` | Remove `componentMappings`, `newComponentBacklog`. Add `sectionBlueprints`, `ComponentCategory`. Bump `analysisVersion`. |
| `tools/lib/reference-analysis-prompts.ts` | Rewrite prompt: remove matching list, add categorization + blueprint generation |
| `tools/lib/component-mapping-catalog.ts` | **Delete** |
| `tools/lib/theme-component-generator.ts` | **New** — template-based component generator with AI JSX body + hex linter |
| `tools/lib/theme-component-templates.ts` | **New** — deterministic template fragments |
| `tools/generate-theme-from-reference.ts` | Remove `classifyLayoutPattern()`, `LayoutClassification`. Add component generation step. Simplify flow. |
| `tools/scaffold-theme-package.ts` | Add v2 gate. Generate `manifest.ts`, `showcase-registry.tsx`, component files, self-contained globals.css |
| `packages/theme-system/src/types.ts` | Add `ComponentCategory` type. Simplify `registryRecommendation` for new themes. |
| `sites/showcase/registry/index.ts` | Change `render` to `renders: Record<string, () => ReactNode>`. Add manifest loader merge. |
| `sites/showcase/registry/*.tsx` | Refactor from `render(theme)` branching to `renders: { theme: () => ... }` |
| `sites/showcase/registry/from-theme-manifest.ts` | **New** — auto-discovers and loads theme manifest entries |
| `sites/showcase/components/ElementCard.tsx` | Use `renders[theme]?.()` |
| `sites/showcase/app/elements/[slug]/page.tsx` | Use `renders[theme]?.()`, skip missing |
| `sites/showcase/app/compare/page.tsx` | Use `renders[theme]?.()`, placeholder for missing |
| `sites/showcase/app/themes/[name]/page.tsx` | Filter elements by `renders[name]` existence |
| `docs/architecture/how-ingestion-pipeline-works.md` | **New** — v2 pipeline architecture doc |

---

## Implementation Sequence

```
Phase A (Contracts)     → types + prompt + classification removal → verify JSON output
Phase B (Generation)    → component generator + scaffold updates → verify theme package output
Phase C (Pipeline)      → end-to-end integration → verify full pipeline run
Phase D (Showcase)      → registry refactor + manifest loader → verify showcase build
Phase E (Cleanup)       → dead code removal + docs → final verification
```

Phases A+B are sequential (B depends on A types).
Phase C depends on B.
Phase D can run in parallel with B+C (showcase is independent of pipeline).
Phase E runs last.
