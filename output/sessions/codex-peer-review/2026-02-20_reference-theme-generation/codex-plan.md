# Codex Implementation Plan: Reference-Driven Theme Generation

## 1. Scope decisions and architecture guardrails (MVP boundary)

1. Lock an explicit MVP boundary before coding:
- Workflow A is automated (`reference -> analysis artifacts + new theme package scaffold`).
- Workflow B is manual execution guided by generated gap brief (`gap -> developer-implemented core components`).
- `ComponentRegistry` remains metadata-only; no runtime theme-based component switching is introduced.

2. Standardize naming:
- Add `--theme-name` input (recommended first theme: `nova`) and treat it as reusable event-style theme name, not client-specific.
- Add slug validation (`^[a-z][a-z0-9-]*$`) for package/export safety.

Files to create/modify:
- `tools/generate-theme-from-reference.ts` (new CLI contract and mode separation)
- `output/sessions/codex-peer-review/2026-02-20_reference-theme-generation/codex-plan.md` (this plan)

Verification gate:
- CLI help/usage documents separate `analyse` vs `scaffold` outputs and refuses invalid theme names.

Risks/trade-offs:
- If scope is not fixed early, this expands into automatic TSX generation and runtime theming refactors.
- Keeping registry metadata-only avoids major runtime complexity but means structural parity still needs manual implementation.

## 2. Make theme naming extensible without breaking current consumers

1. Convert `ThemeName` from hardcoded union to source-of-truth constant list in theme-system:
- Introduce `export const THEME_NAMES = ["orion", "vega"] as const;`
- Define `export type ThemeName = (typeof THEME_NAMES)[number];`
- Define `ThemeNameSchema = z.enum(THEME_NAMES);`

2. Remove duplicate unions outside theme-system:
- In client context and tooling, import `ThemeName` type from `@platform/theme-system` (or mirror from a local shared helper if package constraints block direct import).
- Eliminate local `"orion" | "vega"` declarations in:
  - `packages/core-components/src/context/theme-context.tsx`
  - `tools/apply-theme.ts`

3. Add explicit non-regression checks for existing themes:
- Ensure existing registries and generated configs for `orion`/`vega` still typecheck and validate.

Files to modify:
- `packages/theme-system/src/types.ts`
- `packages/theme-system/src/index.ts` (export theme name constants)
- `packages/core-components/src/context/theme-context.tsx`
- `tools/apply-theme.ts`
- `packages/theme-system/src/__tests__/validate.test.ts` (if schema assertions need updates)

Verification gate:
- `pnpm type-check` passes monorepo-wide.
- Existing sites still build with `orion`/`vega` imports unchanged.

Risks/trade-offs:
- `core-components` currently avoids cross-package type imports by design comment; importing from theme-system may violate current TS project boundary assumptions. If blocked, create a tiny shared `ThemeName` constant/type module in `packages/theme-system` and consume through compiled package boundary only.

## 3. Introduce a structured reference-analysis artifact (new canonical output)

1. Add `--analyse` mode to `tools/generate-theme-from-reference.ts` that produces two artifacts:
- Machine-readable JSON (`reference-analysis.json`) for downstream scaffolding.
- Human-readable markdown (`component-gap-report.md`) for Workflow B handoff.

2. Define and version an analysis schema (do not leave freeform):
- `analysisVersion`, `reference` (url, screenshot path, capturedAt)
- `visualLanguage` (palette, typography, spacing density, contrast profile, motif notes)
- `detectedSections[]` (ordered page sections with evidence)
- `componentMappings[]` (`existing`, `adapt`, `new` decision + target component path if existing)
- `registryRecommendation` (proposed variant values + confidence)
- `newComponentBacklog[]` (brief + acceptance criteria + token constraints)
- `themeTokenRecommendations` (brand/surface/semantic/overlay + typography hints)

3. Persist artifacts under an output folder per run:
- `output/theme-analysis/<theme-name>-<timestamp>/...`

Files to create/modify:
- `tools/generate-theme-from-reference.ts`
- `tools/lib/reference-analysis-types.ts` (new schema/types)
- `tools/lib/reference-analysis-prompts.ts` (prompt templates)
- `tools/README.md` (document new mode and outputs)

Verification gate:
- Running `--analyse --url ... --image ... --dry-run` yields valid JSON parse + markdown report.
- JSON schema validation step fails fast on malformed AI output.

Risks/trade-offs:
- Strict schema adds implementation overhead now but prevents brittle downstream parsing.

## 4. Add vision-first analysis pipeline (screenshot + LLM), keep CSS scraper as secondary signal

1. Implement multi-signal extraction order:
- Primary: screenshot vision analysis (required for layout/components and real color accents).
- Secondary: URL/CSS scrape (`extractStylesFromUrl`) merged as corroborating signal only.
- Optional tertiary: logo image color extraction.

2. Implement Anthropic vision call path:
- Read screenshot file from disk, encode base64, send as image content block with structured output tool schema.
- Use a deterministic model config (temperature `0`) and fixed prompt sections:
  - Identify global style and palette (include dominant + accent + usage context)
  - Segment page into ordered sections
  - Map each section to known core components with confidence
  - Mark `NEW` only when no reasonable mapping exists
  - Emit developer-focused build briefs for `NEW`

3. Add robust fallback behavior:
- If vision unavailable/API missing, return partial analysis with explicit `confidence: low` and skip scaffolding unless `--allow-low-confidence` is set.

Files to create/modify:
- `tools/generate-theme-from-reference.ts`
- `tools/lib/claude-client.ts` (ensure image-capable request helper)
- `tools/lib/reference-analysis-prompts.ts`

Verification gate:
- ColorCode run captures non-black accent palette and identifies expected section types (hero highlights, info strip, colored CTA bands, sponsor grid, newsletter, blog cards, footer).

Risks/trade-offs:
- Vision output variability can cause unstable mappings; schema constraints + confidence thresholds reduce but do not eliminate this.

## 5. Implement hybrid component mapping engine (deterministic first, LLM assist second)

1. Build a deterministic mapping catalog:
- Define canonical “reference section archetypes” and map to known core components by file path.
- Example categories: hero, header, cta band, card grid, footer, logo cloud, newsletter form, event info strip.

2. Apply LLM only for ambiguous cases:
- LLM proposes candidate mapping + confidence + rationale.
- Deterministic resolver accepts if confidence threshold met, else marks as `adapt` or `new`.

3. Output explicit backlog for Workflow B:
- For each `new` or `adapt`, include: problem statement, expected props contract, MDX usage shape, token usage requirements, acceptance screenshots/checklist.

Files to create/modify:
- `tools/lib/component-mapping-catalog.ts` (new)
- `tools/lib/reference-analysis-types.ts`
- `tools/generate-theme-from-reference.ts`

Verification gate:
- Unit tests for mapping resolver against seeded section inputs.
- ColorCode analysis should produce a finite, reviewable new-component list (not “everything new”).

Risks/trade-offs:
- Pure LLM mapping is faster but less repeatable; hybrid mapping is more stable and auditable.

## 6. Add theme scaffolding mode for new named package + repo wiring

1. Add `--scaffold-theme` mode that consumes `reference-analysis.json` and creates theme package artifacts.

2. Because current repo uses a single `packages/themes/package.json` with subpath exports (not per-theme package folders with their own package.json/tsconfig), scaffold to actual repo structure:
- Create `packages/themes/<name>/index.ts`
- Create `packages/themes/<name>/globals.css`
- Update `packages/themes/package.json` exports with `./<name>: ./<name>/index.ts`

3. Scaffold generated registry/config:
- `<name>Registry: ComponentRegistry` using recommended variants.
- `<name>DefaultConfig: DeepPartialThemeConfig` from token recommendations.
- `registerTheme({ name: "<name>", label: "<Name>", config: <name>DefaultConfig })`

4. Update imports and generator support:
- Extend `generateThemeConfigContent(...)` to accept dynamic theme name or explicit registry import string.
- Keep backward compatibility for `orion`/`vega` calls.

Files to create/modify:
- `packages/themes/<name>/index.ts` (new)
- `packages/themes/<name>/globals.css` (new)
- `packages/themes/package.json`
- `packages/theme-system/src/types.ts` (add new theme to `THEME_NAMES`)
- `packages/intake-system/src/theme-extraction/theme-generator.ts`
- `packages/intake-system/src/theme-extraction/__tests__/theme-generator.test.ts`
- `sites/*/tsconfig.json` and `sites/showcase/tsconfig.json` (add path alias `@platform/themes/<name>`)
- `sites/showcase/lib/register-all-themes.ts` (import new theme for registry discovery)

Verification gate:
- `pnpm type-check` and `pnpm lint` pass.
- A sample site can import `@platform/themes/<name>` and compile.

Risks/trade-offs:
- Every new theme currently requires touching multiple tsconfig path maps; medium operational friction.
- A later improvement should centralize/auto-generate theme path aliases.

## 7. Define Workflow B propagation contract (manual implementation with strong checklist)

1. Codify non-automated handoff:
- Generated `component-gap-report.md` includes one section per gap with:
  - recommended component filename/location in `packages/core-components/src/components/ui/`
  - props interface draft
  - token-only styling constraints
  - MDX integration expectations
  - test expectations

2. Add a “cross-theme propagation checklist” to enforce consistency when new core components are added:
- Export from `packages/core-components/src/index.ts`
- Add/extend MDX schemas in `packages/core-components/src/lib/content-schemas.ts` if needed
- Ensure base-template usage/examples exist
- Validate appearance across orion/vega/new theme by token-only changes
- Confirm no client hooks/context in server components

3. Do not add per-theme component implementation folders yet; continue shared core-component architecture.

Files to create/modify:
- `output/theme-analysis/.../component-gap-report.md` (generated)
- `packages/core-components/CLAUDE.md` or repo docs (add checklist)
- Optional: `docs/theme-component-propagation.md` (new)

Verification gate:
- Manual dry-run of checklist on one known gap component from ColorCode brief.

Risks/trade-offs:
- Manual Workflow B preserves quality control but depends on discipline; checklist quality is critical.

## 8. Decide ComponentRegistry strategy for new structural patterns

1. Extend registry enums only when they represent reusable taxonomy, not one-off page details:
- Add variants for missing reusable patterns (e.g., `sectionVariant: "banded"`) only if multiple themes likely to use them.
- Keep page-specific structures (e.g., event info strip specifics) out of registry and in component/data composition.

2. Update both TS + Zod together and ensure old configs remain valid:
- Backward-compatible enum expansion only.

Files to modify:
- `packages/theme-system/src/types.ts` (`ComponentRegistry` + `ComponentRegistrySchema`)
- Any consumer tests expecting exact enum members

Verification gate:
- Existing theme registries validate unchanged.
- New theme registry validates with added variant members.

Risks/trade-offs:
- Overloading registry with page-layout semantics will create false coupling since registry is not runtime selector.

## 9. Execution sequence and gates

1. Phase A (foundation): Steps 2 + tests.
- Gate: monorepo type-check green.

2. Phase B (analysis engine): Steps 3, 4, 5.
- Gate: ColorCode analysis output reviewed and accepted as actionable.

3. Phase C (scaffolding): Step 6.
- Gate: new theme import compiles in one site + showcase registration works.

4. Phase D (manual delivery path): Steps 7, 8.
- Gate: first Workflow B component built using generated brief and passes lint/type-check.

5. Phase E (hardening): end-to-end smoke.
- Run:
  - `pnpm lint`
  - `pnpm type-check`
  - targeted tests in `packages/intake-system/src/theme-extraction/__tests__/...`
- Optional: run generator on second event-style reference to validate reuse beyond ColorCode.

## 10. Key implementation risks to track

1. Model dependency risk:
- Vision provider/API failure can block analysis. Mitigation: explicit degraded mode + confidence gating.

2. Contract drift risk:
- If analysis schema changes without versioning, scaffolder breaks. Mitigation: `analysisVersion` + JSON validation.

3. Repo-structure mismatch risk:
- Brief assumes per-theme package.json/tsconfig, but repo currently uses a single `packages/themes/package.json` export map. Mitigation: implement to actual structure now; revisit packaging architecture separately.

4. Type spread risk:
- Hardcoded theme unions exist in multiple files. Mitigation: single source-of-truth constants and eliminate duplicates.

5. Over-automation risk:
- Auto-generating components from vision output will produce fragile code. Mitigation: keep Workflow B human-implemented by design.
