# Codex Implementation Plan — Pipeline URL Discovery + Test Site Review UX

## 1. Scope and guardrails (pre-flight)
1. Confirm this is an additive change set (no pipeline architecture rewrite), focused on discovery robustness + review usability.
2. Keep backwards compatibility for discovery API and existing CLI usage.
3. Keep changes dependency-free and deterministic.

Files to inspect/modify in this phase:
- `tools/analyse-site.ts`
- `tools/lib/site-discovery.ts`
- `tools/lib/reference-analysis-types.ts`
- `tools/lib/page-template-generator.ts`
- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`
- `.claude/commands/pipeline.ingest.md`
- `tools/__tests__/site-discovery.test.ts`
- Add tests under `tools/__tests__/` for generator/page output behavior

Verification gate:
- `pnpm type-check` passes before edits (baseline confidence).

Risks/trade-offs:
- Existing dirty workspace means careful, targeted edits only.

## 2. Area 1A — Add `--pages` manifest override (predictable discovery)
1. Extend CLI args in `tools/analyse-site.ts`:
- Add `--pages` as comma-separated URL list.
- Parse into `string[]` with trim + empty filtering + URL validation.
2. Extend discovery options in `tools/lib/site-discovery.ts` (backward-compatible):
- `discoverPages(url, { maxPages?, pages? })` where `pages?: string[]`.
- If `pages` is present and non-empty, skip sitemap/nav/probe entirely.
- Classify each provided URL with `classifyPage()`.
- Set `source: "manifest"` for all manifest pages.
3. Extend source typing:
- Update `DiscoveredPage.source` union in `tools/lib/reference-analysis-types.ts` to include `"manifest"`.

Files modified:
- `tools/analyse-site.ts`
- `tools/lib/site-discovery.ts`
- `tools/lib/reference-analysis-types.ts`
- Any call sites/tests with source union assumptions

Verification gate:
- Unit test: `discoverPages(base, { pages: [...] })` returns exactly provided pages (normalized), correctly typed, no extra discovered pages.
- Manual smoke: run discovery-only path with `--pages` and inspect logged/discovered set count.

Risks/trade-offs:
- Strict override behavior is intentional; no auto-discovery merge to avoid nondeterministic results.

## 3. Area 1B — Fix base URL scoping for subdirectory demo/theme URLs
1. Replace host-only normalization with path-preserving base normalization in `normaliseBaseUrl()`:
- Keep protocol + host + pathname prefix.
- Strip trailing slash (except root), strip query/hash.
- Example target: `https://host.com/themes/bold/` -> `https://host.com/themes/bold`.
2. Ensure downstream URL resolution uses this prefix consistently:
- Same-origin checks still host-based.
- Path cleaning/probing resolves relative to base prefix, not host root.
3. Update common-path probing composition to append to base prefix when base path is non-root.

Files modified:
- `tools/lib/site-discovery.ts`
- `tools/__tests__/site-discovery.test.ts`

Verification gate:
- Unit test for `normaliseBaseUrl("https://host.com/themes/bold/")` exact expected output.
- Integration-style test: nav/probe URLs remain under `/themes/bold` for scoped base.

Risks/trade-offs:
- Prefix-preserving probing may miss root-level pages for mixed architectures; acceptable for reference-theme ingestion where scoped URL is explicit.

## 4. Area 1C — Expand page classification + enforce priority-based selection
1. Expand `classifyPage()` with synonym matching (pure sync heuristics):
- `services-list`: `/services`, `/our-services`, `/what-we-do`, `/solutions`, `/offerings`
- `about`: `/about`, `/about-us`, `/our-story`, `/team`, `/who-we-are`
- `contact`: `/contact`, `/get-in-touch`, `/talk-to-us`, `/book`, `/quote`
- `projects`: `/projects`, `/work`, `/portfolio`, `/case-studies`
- Keep existing exact/detail patterns first to avoid regressions.
2. Add deterministic page-type priority selection before `maxPages` truncation:
- Priority: `home > services-list > about > blog-list > contact > service-detail > blog-post > locations-list > location-detail > reviews > projects > pricing > custom`.
- Dedupe by canonical URL/path first, then sort by priority, then depth, then alpha.
3. Add warning hook in `analyse-site.ts`:
- If discovery (non-manifest mode) returns <=2 pages, print warning recommending `--pages`.

Files modified:
- `tools/lib/site-discovery.ts`
- `tools/analyse-site.ts`
- `tools/__tests__/site-discovery.test.ts`

Verification gate:
- Unit test: `/our-services` classifies to `services-list`.
- Unit test: when >`maxPages`, returned set includes required high-priority types before lower-priority custom/blog-post pages.
- Manual log check: warning appears when only 1-2 pages discovered.

Risks/trade-offs:
- Keyword expansion can create false positives (`/team-building` etc.); mitigate by segment-based matching and explicit regex boundaries.

## 5. Area 2A — Review panel overlay for generated test sites
1. Introduce generated route manifest artifact for example pages:
- During example page generation, emit `route-manifest.json` containing route list + labels.
- Keep it static and build-time (no runtime crawling).
2. Update pipeline command instructions (`.claude/commands/pipeline.ingest.md`):
- After overlaying example pages, ensure manifest is copied into test site.
- Update generated `layout.tsx` to render a dev-only fixed review panel component with route links.
- Review panel styling should be intentionally utilitarian and distinct from theme content.
3. Keep panel isolated:
- Render only in non-production env or always for test sites (explicit marker check).

Files modified:
- `tools/lib/page-template-generator.ts` (manifest output)
- `.claude/commands/pipeline.ingest.md`
- (If needed) generated `sites/test-*/app/layout.tsx` template content in command steps

Verification gate:
- Generate example pages and verify manifest exists and lists routes.
- Start test site and confirm overlay shows clickable links for all generated routes.

Risks/trade-offs:
- Injecting panel into layout can interfere with screenshots; keep small/fixed corner with high z-index but minimal overlap.

## 6. Area 2B — Placeholder image props for layout fidelity
1. Detect image-like slots from `SectionBlueprint.contentSlots` using existing typing heuristics (`inferPropType` / slot naming).
2. In `generatePageTsx()` pass explicit props objects for components with image-like props:
- Use inline SVG data URIs (offline-safe) with dimensions and neutral fill.
- Include alt text placeholders.
3. Keep placeholders deterministic per slot (stable dimensions/name) to aid comparison.

Files modified:
- `tools/lib/page-template-generator.ts`
- Add focused tests for generated TSX prop injection

Verification gate:
- Snapshot/unit test for generated TSX includes placeholder objects for `backgroundImage`/`logo`/`image` props.
- Manual render check in test site confirms non-empty visual blocks for image sections.

Risks/trade-offs:
- Over-eager slot detection could inject wrong prop shapes; constrain to known image token names and inferred type markers.

## 7. Area 2C — Hard-fix props access bug (`props['kebab-case']`)
1. Prompt hardening in `buildComponentGenerationPrompt()`:
- Add explicit rule: always access interface props via dot notation camelCase (`props.heroTitle`), never bracket notation for kebab keys.
- Include one positive and one forbidden example.
2. Post-generation normalization in `theme-component-generator.ts`:
- Add regex-based rewrite pass converting `props['kebab-key']` and `props["kebab-key"]` to `props.camelKey`.
- Preserve nested/index expressions that are legitimate (`props.items[0]`) and avoid rewriting dynamic expressions.
3. Hardfail behavior (per user preference):
- Add validation step that fails generation if any `props['...']` remains after rewrite.
- Surface actionable error with component file name.

Files modified:
- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`
- Add tests for rewrite/validation logic

Verification gate:
- Unit tests:
  - `props['event-info-cta']` -> `props.eventInfoCta`
  - `props['cta-button'].map(...)` -> `props.ctaButton.map(...)`
  - `props['items'][0]` safe conversion where interface key is kebab; dynamic expressions untouched
  - residual bracket props triggers hard failure
- `pnpm type-check` passes.

Risks/trade-offs:
- Regex rewriting can mis-handle rare JS edge cases; strict post-check mitigates silent breakage.

## 8. Implementation sequencing and dependencies
1. Discovery API + type extension first (`--pages`, `manifest` source).
2. Base URL normalization + probing fix.
3. Classification expansion + priority truncation + warning.
4. Props bug hardening (prompt + rewrite + hardfail) before review UX so generated components are reliably renderable.
5. Placeholder props generation.
6. Route manifest + review panel instruction updates.
7. Targeted tests, then full type-check.

Verification gate between each step:
- Run only relevant unit tests first to keep iteration fast.
- Run `pnpm type-check` after steps 3 and 7.

## 9. Test matrix (without full 14-step reruns)
1. Discovery tests:
- `--pages` override exactness
- path-preserving normalization
- synonym classification
- priority truncation behavior
2. Generator tests:
- prop bracket rewrite + hardfail
- placeholder image injection in generated pages
- route manifest emission
3. Command-doc consistency check:
- `pipeline.ingest.md` references real generated files/paths and sequence.

Suggested commands:
1. `pnpm --filter tools test` (or equivalent test target for tools workspace)
2. `pnpm type-check`
3. One narrow dry-run pipeline command with `--pages` on a small URL set to validate end-to-end wiring quickly

## 10. Key risks and decisions to lock early
1. **Manifest override semantics**: full bypass vs merge. Recommend full bypass for operator control.
2. **Classification breadth**: too many synonyms increases false positives. Use bounded, segment-aware patterns.
3. **Review panel location**: command-driven generated layout vs pipeline codegen. Keep command-driven now; promote later if stabilized.
4. **Hardfail policy**: bracket-prop residuals should fail fast (aligned with request) to prevent silently broken sites.
5. **Source union change** (`manifest`) may require touching any switch statements assuming three source values.

## 11. Definition of done
1. `--pages` run returns exact manifest pages with correct `pageType` and `source: "manifest"`.
2. Scoped URLs preserve subdirectory base and discover correctly under prefix.
3. Priority truncation keeps important page types under `maxPages`.
4. Generated components contain no `props['kebab-case']` accesses; failures hard-stop generation.
5. Generated example pages include placeholder image props where needed.
6. Test site layout includes review panel with route links sourced from manifest.
7. `pnpm type-check` passes.
