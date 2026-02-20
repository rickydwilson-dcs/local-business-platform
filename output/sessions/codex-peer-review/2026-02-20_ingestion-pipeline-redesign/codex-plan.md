# Codex Implementation Plan: Ingestion Pipeline Redesign (Per-Theme Component Generation)

## 1. Freeze target architecture and migration policy first

1. Define the new invariant explicitly in code/docs: for newly ingested themes, every detected section generates a theme-owned component; no REUSE/ADAPT/NEW matching.
2. Keep existing `orion`/`vega` behavior intact initially (no forced retrofit), and gate new behavior behind a “v2 ingestion” mode/default.
3. Clarify ownership model:
- Shared primitives remain in `packages/core-components` (atoms/helpers allowed).
- Generated structural sections live under `packages/themes/<name>/components/` and are owned by that theme.

Files to modify:
- `tools/generate-theme-from-reference.ts` (mode + behavior contract)
- `tools/README.md` (pipeline behavior and migration note)
- Optional design note: `docs/ingestion-v2-architecture.md` (new)

Verification gate:
- Team can point to a single documented rule set for “what gets generated where” before implementation begins.

Risks/trade-offs:
- Not retrofitting existing themes preserves delivery speed but creates a temporary mixed model (legacy shared-structure themes + new per-theme-structure themes).

## 2. Replace matching-oriented analysis schema with generation-oriented schema

1. Redesign `ReferenceAnalysis` to remove matching fields:
- Remove `componentMappings[]` and `newComponentBacklog[]`.
- Add `sectionBlueprints[]` where each entry is generation-ready:
  - `id`, `name`, `category` (existing showcase category union)
  - `purpose`, `layoutPattern`, `contentSlots`, `interactionNeeds`
  - `componentFileName`, `componentExportName`
  - `tokenUsageHints` (required tokens/classes, no hex)
  - `confidence`
- Add `themeComponentManifest` summary for scaffold step.

2. Keep visual/token data, but mark as “theme-level defaults” only.

Files to modify:
- `tools/lib/reference-analysis-types.ts`
- `tools/generate-theme-from-reference.ts` (minimal fallback object + markdown report)

Verification gate:
- TypeScript compile passes with no references to removed fields.
- Emitted JSON validates against new interface and contains category metadata per section.

Risks/trade-offs:
- Schema break for any scripts expecting old fields; mitigate by `analysisVersion: "2"` and explicit rejection of v1 in scaffold v2 path.

## 3. Redesign vision prompt to detect sections + categorize, not match existing components

1. Replace `REFERENCE_ANALYSIS_PROMPT` instructions:
- Remove hardcoded component list and all REUSE/ADAPT/NEW instructions.
- Require ordered section detection, category assignment (Hero/Cards/Social Proof/CTAs/Content/Navigation/Blog/Stats/Typography/Tokens), structural notes, and component naming suggestions.

2. Enforce output determinism:
- Keep structured JSON-only response.
- Add explicit rules for category normalization and unique `componentFileName` generation.

3. Keep model choice per constraint:
- Use `claude-sonnet-4-6` as sole structural analysis step.
- Deprecate/remove text-only Haiku layout classification from pipeline path.

Files to modify:
- `tools/lib/reference-analysis-prompts.ts`
- `tools/generate-theme-from-reference.ts` (`classifyLayoutPattern` removal and call path simplification)

Verification gate:
- Prompt output no longer includes `status`, `existingComponent`, `newComponentBacklog`, or a matching list.
- One manual run on ColorCode screenshot yields categorized sections spanning expected categories.

Risks/trade-offs:
- Losing Haiku fallback reduces redundancy but improves consistency by removing contradictory dual classification.

## 4. Build a component code-generation step in the pipeline (not a manual gap session)

1. Add generation stage after analysis to produce actual TSX files per section blueprint:
- Generate one file per section under `packages/themes/<name>/components/<category>/<component>.tsx`.
- Use named exports + typed props interfaces.
- Default to Server Components; only add `"use client"` when blueprint flags required interactivity.

2. Add a template-based generator (deterministic scaffolding + AI-filled internals):
- Deterministic wrappers for file structure, import policy, props interface, export naming.
- AI generation restricted to JSX/Tailwind body inside template guardrails.

3. Enforce token-only styling contract:
- Post-generation linter/validator rejects hex literals and inline style color values.
- Allowed Tailwind tokens like `bg-brand-primary`, `text-surface-foreground`, etc.

Files to create/modify:
- `tools/lib/theme-component-generator.ts` (new)
- `tools/lib/theme-component-templates.ts` (new)
- `tools/generate-theme-from-reference.ts` (invoke generator)
- `tools/lib/reference-analysis-types.ts` (blueprint fields used by generator)

Verification gate:
- Running pipeline writes component files for every detected section.
- Validation script confirms no disallowed color literals in generated components.

Risks/trade-offs:
- Direct code generation increases failure modes (invalid TSX/props mismatch). Mitigate with deterministic templates + immediate `tsc` check of generated package.

## 5. Evolve theme package scaffold to include self-contained components + manifest

1. Extend `scaffold-theme-package.ts` (or merge into main generator) so theme output is complete:
- `packages/themes/<name>/index.ts` (registry, defaults, registration)
- `packages/themes/<name>/globals.css` (theme-specific utility classes used by its own components)
- `packages/themes/<name>/components/...` (generated sections)
- `packages/themes/<name>/manifest.ts` (component metadata: slug, category, export, import path)
- `packages/themes/<name>/README.md` (generated inventory)

2. Add exports for theme-owned components:
- From `packages/themes/<name>/index.ts`, export component modules and manifest.
- Update `packages/themes/package.json` export map as today.

Files to modify:
- `tools/scaffold-theme-package.ts`
- `packages/themes/package.json` (per new theme export)
- `packages/themes/<name>/*` (generated)

Verification gate:
- Deleting `packages/core-components` references from new theme components does not break `packages/themes/<name>` build.
- Theme can be imported without touching other themes.

Risks/trade-offs:
- Duplicated structure across themes raises maintenance cost, but this is the intended decoupling requirement.

## 6. Reassess `ComponentRegistry` role under per-theme structural uniqueness

1. Keep `ComponentRegistry` for backwards compatibility, but reduce architectural importance:
- Preserve existing fields for legacy consumers (`heroVariant`, etc.).
- Treat it as high-level metadata only; no closed-set structural authority for new themes.

2. Add optional manifest linkage instead of expanding enums indefinitely:
- Add optional `componentManifestId?: string` or `componentSet?: string` in theme metadata (if needed) rather than exploding variant enums.

Files to modify:
- `packages/theme-system/src/types.ts` (minimal additive change only if required)
- `packages/themes/<name>/index.ts` (registry metadata references manifest)

Verification gate:
- Existing `orion`/`vega` configs remain valid with no required changes.
- New theme registry can coexist without inventing many new variant enum values.

Risks/trade-offs:
- Keeping old enums may feel redundant, but immediate removal is high-risk and unnecessary for this redesign.

## 7. Update showcase registry ingestion to be manifest-driven for new themes

1. Shift showcase registration pattern:
- Keep current static registry files for `orion`/`vega` initially.
- Add a loader path for theme manifests from `packages/themes/<name>/manifest.ts`.
- Convert `ElementDefinition.render(theme)` branching to component references registered per theme entry.

2. Proposed shape:
- `ElementDefinition` remains category-based.
- New helper builds `elements` from theme manifests: each element entry binds one concrete render component for one theme/category/slug, then UI groups by category and theme.

3. Keep route structure unchanged (constraint).

Files to modify:
- `sites/showcase/registry/index.ts`
- New: `sites/showcase/registry/from-theme-manifest.ts`
- Existing category files (`sites/showcase/registry/*.tsx`) kept for legacy themes until migrated.

Verification gate:
- Showcase can display side-by-side category variants where a new theme contributes its generated components.
- No manual `if (theme === ...)` branching required for newly ingested themes.

Risks/trade-offs:
- Dual registration system (legacy + manifest) during transition adds complexity, but isolates migration risk.

## 8. Resolve globals.css self-containment per theme

1. Make each generated theme self-contained:
- `packages/themes/<name>/globals.css` includes only utilities that new theme components depend on.
- No reliance on Orion/Vega utility classes.

2. Add validation:
- Scan generated component classNames for utility classes that are custom/non-Tailwind and verify they are defined in that theme’s `globals.css`.

Files to modify:
- `tools/scaffold-theme-package.ts`
- `tools/lib/theme-component-generator.ts`
- Generated `packages/themes/<name>/globals.css`

Verification gate:
- Removing another theme folder does not break styling or compile of the generated theme.

Risks/trade-offs:
- More CSS duplication across themes, but satisfies strict decoupling.

## 9. Remove dead matching infrastructure and redundant code paths

1. Remove unused static matching catalog from active pipeline:
- Delete or archive `tools/lib/component-mapping-catalog.ts` if unused after redesign.

2. Remove/rewrite markdown report sections tied to mapping status.

3. Update CLI docs and flags:
- Keep `--analyse` but redefine outputs (`reference-analysis.json` + generated components + manifest).

Files to modify:
- `tools/lib/component-mapping-catalog.ts` (delete or deprecate)
- `tools/generate-theme-from-reference.ts`
- `tools/README.md`

Verification gate:
- Search for `REUSE|ADAPT|NEW` in pipeline paths returns none.
- Prompt text has no existing-component matching list.

Risks/trade-offs:
- If downstream tooling still expects old terms, it must be updated in same phase to avoid silent breakage.

## 10. Implementation sequence with hard gates

1. Phase A: Contracts
- Implement Steps 2 and 3 (new analysis schema + prompt + single Sonnet analysis path).
- Gate: JSON output validated for one reference screenshot.

2. Phase B: Generation engine
- Implement Steps 4 and 5 (component code generation + theme manifest + scaffold updates).
- Gate: generated theme compiles and exports all section components.

3. Phase C: Showcase integration
- Implement Step 7 (manifest-driven registration for new themes).
- Gate: new theme appears in showcase categories without theme-branching code.

4. Phase D: Cleanup and stabilization
- Implement Steps 8 and 9, then run full checks.
- Gate: `pnpm lint`, `pnpm type-check`, and showcase build pass.

## 11. Key risks to manage throughout

1. Quality drift in generated TSX:
- Mitigate with strict templates + compile checks + token-lint checks.

2. Category misclassification by vision model:
- Mitigate with controlled category enum, confidence field, and manual override flag (`--category-override <file>` future extension).

3. Transition complexity in showcase:
- Mitigate with a clear compatibility layer: legacy static registries remain until each theme migrates.

4. Scope creep into runtime theming:
- Explicitly reject runtime switching in architecture docs and PR checks.
