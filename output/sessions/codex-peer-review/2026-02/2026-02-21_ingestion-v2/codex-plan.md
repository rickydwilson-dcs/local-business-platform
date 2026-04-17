# Codex Implementation Plan: Ingestion Pipeline v2 (Multi-Page Crawling + Page Blueprints)

## 1. Define v3 data contract before touching pipeline logic

1. Introduce a new additive schema version (`analysisVersion: "3"`) instead of mutating v2 in-place.
2. Keep existing top-level v2 fields for backward compatibility (`visualLanguage`, `detectedSections`, `sectionBlueprints`, etc.).
3. Add new multi-page structures:

- `siteDiscovery`: crawl inputs/results, canonical URL, discovered page list, skipped links.
- `pageAnalyses[]`: one entry per discovered page (page type, URL, source signals, sections).
- `pageBlueprints[]`: ordered page composition per page type.
- `componentMatches[]`: mapping outcome (`core`, `theme-generated`, `partial`) with confidence and rationale.
- `examplePages[]`: generated file plan + target route type (`home static tsx`, `list page tsx`, `dynamic slug route scaffold`, `mdx template`).

Files to modify:

- `tools/lib/reference-analysis-types.ts`
- `tools/lib/reference-analysis-prompts.ts` (schema examples)
- `tools/generate-theme-from-reference.ts` (version handling)

Verification gate:

- TypeScript compiles with both v2 and v3 accepted where required.
- A v2 analysis can still be scaffolded by current flow unchanged.

Risks/trade-offs:

- Carrying v2+v3 temporarily increases branching complexity, but prevents breaking current automation.

## 2. Add page discovery module (no headless browser)

1. Build deterministic URL discovery pipeline:

- Parse `<nav>` and header/footer anchors from homepage HTML.
- Parse sitemap (`/sitemap.xml`, sitemap index recursion up to limit).
- Parse internal anchors from homepage/body as fallback.
- Normalize and dedupe by canonical URL rules (remove fragments, tracking params, trailing slash normalization).

2. Add page classification heuristics:

- Rule-based classifier by path and page signals (`/about`, `/services`, `/services/*`, `/blog`, `/blog/*`, `/contact`, `/locations`, etc.).
- Distinguish list pages vs detail pages using repeated item/card/article markers.
- Keep unknowns as `custom` type.

3. Add bounded crawl controls:

- `maxPages` default 12.
- per-domain restriction.
- timeout/retry budget.

Files to create/modify:

- `tools/lib/site-discovery.ts` (new)
- `tools/lib/page-classification.ts` (new)
- `tools/generate-theme-from-reference.ts` (integrate discovery)
- Optional reuse: `packages/intake-system/src/theme-extraction/website-analyzer.ts` (export helpers instead of duplicating fetch parsing)

Verification gate:

- Running with `--url` returns at least home + main nav pages on a standard brochure site.
- Discovery output is stable across two runs (same URL ordering after normalization).

Risks/trade-offs:

- HTML-only discovery misses JS-injected links; accepted by constraints.

## 3. Implement screenshot workflow for multi-page analysis

1. Keep current single `--image` behavior unchanged.
2. Add multi-page screenshot mapping options:

- `--screenshots-manifest <json>` mapping URL or pageType to local image path.
- `--screenshots-dir <dir>` with filename convention (`home.png`, `about.png`, `services.png`, etc.).

3. Add optional third-party screenshot fetch adapter (off by default) as extensibility seam, not hard dependency.
4. Add fallback when page screenshot missing:

- Perform HTML-only structural pass with lower confidence and explicit flag in report.

Files to create/modify:

- `tools/lib/screenshot-manifest.ts` (new)
- `tools/generate-theme-from-reference.ts`
- `tools/README.md` (new multi-page invocation examples)

Verification gate:

- Pipeline can run with: URL only, URL + single image, URL + manifest.
- Missing screenshots do not crash run; page gets downgraded confidence.

Risks/trade-offs:

- User-managed screenshots add friction but is the only reliable option under environment constraints.

## 4. Add per-page vision analysis and aggregate synthesis

1. Replace single screenshot analysis call with per-page analysis loop:

- One Sonnet call per page where screenshot exists.
- Prompt includes page context (`pageType`, URL, likely role).

2. Split prompts by responsibility:

- `PAGE_ANALYSIS_PROMPT`: detect sections/order/layout/content slots for one page.
- `SITE_SYNTHESIS_PROMPT`: consolidate page analyses into global tokens, reusable section blueprints, and page-level blueprint composition.

3. Keep token budget bounded:

- Analyze priority pages first: home, services, about, contact, blog list.
- Cap vision calls (default 6) and emit skipped page note.
- Lower `max_tokens` on per-page calls; reserve larger budget for final synthesis.

Files to create/modify:

- `tools/lib/reference-analysis-prompts.ts` (split prompt set)
- `tools/generate-theme-from-reference.ts`
- `tools/lib/vision-analysis.ts` (new orchestration helper)

Verification gate:

- `site-analysis.json` includes per-page section sequences and consolidated global blueprint set.
- Token/cost summary emitted in report.

Risks/trade-offs:

- More API calls increase cost and latency; mitigated by priority + cap.

## 5. Introduce page blueprint schema (composition-first)

1. Add `PageBlueprint` model distinct from section blueprints:

- `id`, `pageType`, `sourceUrl`, `routePattern`, `isContentBacked`.
- `composition[]` ordered list of section instances (reference to matched/generate component + variant/props hints).
- `sharedRegions` markers for header/footer/global CTA.
- `dataBindingHints` for MDX/list routes (`services collection`, `blog posts`, etc.).

2. Add section-instance level metadata:

- `componentRef` (core component export OR theme component export).
- `matchType` (`core`, `new`, `partial`).
- `propsSchemaHint` and `placeholderContentPolicy`.

Files to modify:

- `tools/lib/reference-analysis-types.ts`
- `tools/generate-theme-from-reference.ts` (serialization and markdown reporting)

Verification gate:

- Each discovered page in report has an explicit ordered composition table.
- Shared header/footer patterns are represented once and referenced across pages.

Risks/trade-offs:

- More detailed schema increases implementation effort but solves the current “section list without page structure” gap.

## 6. Add component matching engine against `core-components`

1. Build a real catalog from source, not hardcoded prompt text:

- Create curated metadata file mapping core components to structural signatures (purpose, layout cues, required slots).
- Include at minimum: `HeroWithImage`, `CircularIconCard`, `InfoCard`, `ImageOverlayCard`, `CTASection`, `BlogPostCard`, `SiteHeader`, footer primitives.

2. Implement matching pipeline:

- Deterministic heuristic score from section traits (`layoutPattern`, `contentSlots`, interaction level, category).
- Confidence thresholds:
  - high score -> `core` reuse.
  - medium score -> `partial` (generate theme wrapper/adaptor).
  - low score -> `new` component blueprint.

3. Preserve constraints:

- Reused components remain imported from `@platform/core-components`.
- Generated components remain theme-local and token-only.

Files to create/modify:

- `tools/lib/core-component-catalog.ts` (new)
- `tools/lib/component-matcher.ts` (new)
- `tools/generate-theme-from-reference.ts` (apply matching to page section instances)

Verification gate:

- Report lists matched core components with confidence and rationale.
- Known patterns from dj-fox/base-template map correctly in test fixtures.

Risks/trade-offs:

- Matching false positives can produce awkward wiring; keep conservative thresholds and prefer `partial/new` when uncertain.

## 7. Evolve component generation to skip matched core components

1. Update generation step to only generate theme components for unmatched/partial sections.
2. For `partial`, generate thin adapter component in theme package that composes core component with theme-specific defaults.
3. Continue hex/token validation and named export checks.

Files to modify:

- `tools/lib/theme-component-generator.ts`
- `tools/lib/theme-component-templates.ts`
- `tools/generate-theme-from-reference.ts`

Verification gate:

- Generated theme component folder excludes sections fully matched to core components.
- Build output includes both `core` imports and local theme components without conflicts.

Risks/trade-offs:

- Adapter components can proliferate; mitigate by generating only when necessary and documenting reason in manifest.

## 8. Generate example pages from `PageBlueprint`s with routing-aware templates

1. Add page generator that outputs scaffold files into analysis output folder (not auto-writing into live site unless explicit flag):

- Home: `app/page.tsx` static TSX.
- List pages: `app/services/page.tsx`, `app/blog/page.tsx`, etc. static TSX skeletons.
- Content detail routes: scaffold dynamic route templates (`app/services/[slug]/page.tsx`) that read MDX content and render matched components.
- Include MDX frontmatter templates/examples where needed, not full content generation.

2. Respect architecture constraints:

- MDX-only content approach for content pages.
- dynamic route + `generateStaticParams()` pattern for content details.

Files to create/modify:

- `tools/lib/page-blueprint-generator.ts` (new)
- `tools/lib/page-template-library.ts` (new)
- `tools/generate-theme-from-reference.ts` (invoke generation)

Verification gate:

- Example pages compile in a sandbox sample site after copy.
- Generated routes follow MDX dynamic pattern and do not create forbidden hardcoded content pages.

Risks/trade-offs:

- Overly generic templates may require manual edits, but they still deliver “first build wires correctly” validation target.

## 9. Extend scaffold and reports for site-level outputs

1. Keep existing `reference-analysis.json/md` for compatibility.
2. Add new outputs:

- `site-analysis.json` (full multi-page model).
- `site-analysis.md` human-readable summary:
  - discovered pages
  - per-page section sequence
  - match decisions
  - generated vs reused component counts
  - example page file index
  - API token/cost summary

3. Extend scaffold manifest to include page blueprint and component source (`core` vs `theme`).

Files to modify:

- `tools/scaffold-theme-package.ts`
- `tools/generate-theme-from-reference.ts`
- `packages/themes/<name>/manifest.ts` generation format

Verification gate:

- Acceptance artifacts exist after run: `site-analysis.json`, `site-analysis.md`, example pages directory.

Risks/trade-offs:

- Dual artifacts (`reference-analysis` + `site-analysis`) can be confusing; mitigate with explicit versioned docs.

## 10. CLI design and compatibility strategy

1. Keep existing default invocation valid.
2. Add additive flags:

- `--crawl` enable multi-page mode.
- `--max-pages <n>` crawl limit.
- `--screenshots-manifest <path>` mapping URLs/page types to local screenshots.
- `--screenshots-dir <path>` convention-based lookup.
- `--generate-pages` emit example pages.
- `--analysis-version v2|v3` optional override (default v2 single-page unless `--crawl`, then v3).

3. Preserve old behavior when only `--image` is provided.

Files to modify:

- `tools/generate-theme-from-reference.ts` (arg parsing + mode branch)
- `tools/README.md` (usage matrix)

Verification gate:

- Existing single-screenshot run produces same outputs as before.
- Multi-page run produces additional outputs without breaking old ones.

Risks/trade-offs:

- More flags increase complexity; mitigate with sane defaults and profile presets (single-page vs crawl mode).

## 11. Validation/test plan and rollout phases

1. Phase A: Contracts + discovery

- implement Steps 1-3.
- Gate: stable discovery + schema validation.

2. Phase B: Multi-page analysis + matching

- implement Steps 4-7.
- Gate: fixture site run shows meaningful reuse of core components.

3. Phase C: Example pages + scaffold integration

- implement Steps 8-10.
- Gate: generated page scaffolds compile in sample site.

4. Phase D: Hardening

- Add focused tests:
  - URL discovery/classification unit tests.
  - component matcher fixtures.
  - page blueprint-to-file snapshot tests.
- Run `pnpm lint` and `pnpm type-check`.

Files to create/modify:

- `tools/__tests__/site-discovery.test.ts` (new)
- `tools/__tests__/component-matcher.test.ts` (new)
- `tools/__tests__/page-blueprint-generator.test.ts` (new)

Verification gate:

- All tests and type checks pass; artifacts satisfy acceptance criteria list.

## 12. Key risks and trade-offs to monitor

1. Screenshot coverage risk: without screenshots for discovered pages, structural fidelity drops.

- Mitigation: confidence labels + required screenshot checklist in report.

2. API spend risk: multi-page Sonnet calls can become expensive quickly.

- Mitigation: default priority page subset + explicit cost summary + call caps.

3. Misclassification risk in page typing and matching.

- Mitigation: deterministic rules first, LLM inference second, manual override file support in future.

4. Routing regression risk with generated pages.

- Mitigation: enforce route templates aligned to current MDX dynamic patterns and include compile gate before acceptance.
