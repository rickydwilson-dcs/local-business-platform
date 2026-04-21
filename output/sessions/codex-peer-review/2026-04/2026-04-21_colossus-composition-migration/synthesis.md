# Implementation Plan: Colossus Scaffolding — Self-Contained Composition Migration

**Date:** 2026-04-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                  | Claude                                                                           | Codex                                                                                                                                          | Synthesised Decision                                                                                                                                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Physical location       | Parallel `sites/colossus-scaffolding-test/` then swap (matches DJ Fox precedent) | In-place on `sites/colossus-scaffolding` via feature branch                                                                                    | **Parallel site.** User explicitly selected parallel via `AskUserQuestion` earlier. Codex's in-place argument (avoid lockfile churn, cleaner) is noted as a fallback if the parallel approach hits blockers.                                                                |
| Visual thresholds       | 6–12% per page, tiered by page-type (too loose)                                  | 1.2–1.8% per page, 0.75% suite weighted mean, 1.2% for critical templates                                                                      | **Codex's thresholds.** 1.8% is tight enough to catch DJ Fox-class drift (missing section, invisible text, placeholder form) while still tolerating anti-aliasing noise. Claude's 6–12% would have let the DJ Fox bugs through.                                             |
| Viewports               | 1440×900 / 768×1024 / 375×667                                                    | 1440×**1800** / 768×1024 / **390**×844                                                                                                         | **Codex's sizing.** Full-page desktop at 1800px height catches below-fold regressions. 390×844 matches iPhone 14 Pro footprint, the most common modern small viewport.                                                                                                      |
| REVIEW / warn zone      | Diff 15–25% triggers `cs-visual-fidelity-reviewer` on that page                  | Pure pass/fail, no human step                                                                                                                  | **Codex's pass/fail.** User's explicit goal: "I don't want to have my time used checking every individual page." A REVIEW zone that pulls in a human review agent defeats that. Keep a local-dev "warn" band (1.2–1.8%) for the developer's own feedback, but CI is binary. |
| Component count         | 7 new composables (includes `LargeFeatureCards`)                                 | 5 new composables (treats large cards as `FeatureGrid` variant)                                                                                | **Codex's leaner list.** Try `FeatureGrid` with a `variant: "large-feature"` first. Promote to its own composable only if the variant approach breaks down. Net: 5 new composables + 1 FeatureGrid variant.                                                                 |
| Determinism hardening   | `reducedMotion: 'reduce'` + 2s settle delay                                      | CSS animation freeze injection, font ready wait, timezone/locale normalisation, Leaflet tile pane masked, consent overlay masked, single retry | **Codex's full determinism kit.** Claude's was naïve; Codex's catches the concrete noise sources.                                                                                                                                                                           |
| Token preflight         | Not proposed                                                                     | Preflight token audit script before visual runs                                                                                                | **Adopt.** Directly addresses the DJ Fox `text-surface-inverse-foreground` invisible-text bug — catches it at static-analysis time before any screenshot is taken.                                                                                                          |
| Semantic structure gate | Section count + heading tree order + image/link counts (±tolerances)             | Section count + **H1 exact match** + ordered heading outline signature                                                                         | **Merge.** H1 exact text match (Codex) + full heading tree order (Claude) + section count + image count ±1 + link count ±10%. Stricter than either alone.                                                                                                                   |
| CI posture              | Mentioned lightly                                                                | Per-PR fast checks (semantic + critical routes only), full parity at phase boundaries, required on staging promotion                           | **Codex's tiered CI model.** Keeps PR feedback fast, enforces full parity at meaningful gates.                                                                                                                                                                              |
| YOLO brief              | Explicit YOLO exit gate + `UPDATE REMEDIATION AUDIT` pattern                     | Not mentioned                                                                                                                                  | **Keep Claude's YOLO structure.** Required by user's memory/feedback patterns.                                                                                                                                                                                              |
| Baseline storage        | `sites/colossus-scaffolding/__baseline__/`                                       | `sites/colossus-scaffolding/tests/visual-baseline/`                                                                                            | **Codex's path.** `tests/visual-baseline/` makes the intent obvious and groups with other test assets.                                                                                                                                                                      |

## Blind Spots Caught

**Codex caught (Claude missed):**

- **Leaflet tile non-determinism** — map tiles vary subtly between captures; without masking the tile pane this produces false positives on every county/location page. Markers must be validated via DOM assertions instead of pixel diff.
- **Consent/cookie overlay masking** — the consent banner pops up asynchronously and will destroy pixel-diff runs if not handled.
- **Preflight Tailwind token audit** — the exact class of bug that cost DJ Fox a full polish pass (invisible text on dark background from a missing utility) can be caught statically by scanning which theme-token classes the composition produces vs. which the theme-system plugin actually registers.
- **Timezone / locale normalisation during capture** — dates rendered by `Intl.DateTimeFormat` will differ between baseline and target machines without a locked locale, causing spurious diffs on any page showing blog dates, timestamps, or the current year.
- **CSS animation freeze injection** — `reducedMotion: 'reduce'` isn't enough for some third-party components; a CSS freeze rule injected at capture time is more reliable.
- **Suite-wide weighted mean threshold** — catches "many tiny but real" drifts that individually pass the per-page threshold but together represent systemic drift.
- **Contrast-assertion spot-checks on key text nodes** — cheap programmatic check that catches the specific invisible-text failure mode.

**Claude caught (Codex missed):**

- **User's explicit preference for parallel site** — Codex reasoned from first principles to in-place, but the user had already answered this via `AskUserQuestion`. Honour the user's answer.
- **DJ Fox production swap pattern** — Codex's "merge develop → staging → main" glosses over the physical rename step (`colossus-scaffolding` → `colossus-scaffolding-legacy`, `-test` → `colossus-scaffolding`), which is exactly what made DJ Fox's 2026-04-21 swap work cleanly with the existing Vercel project.
- **YOLO brief with the `UPDATE REMEDIATION AUDIT` pattern** — required by user's documented working-style pattern in memory.
- **`pnpm install` / lockfile commit after site rename** — Codex's plan would have failed CI on the rename step without this.
- **Vercel `rootDirectory` stays the same after rename** — worth stating explicitly; avoids confusion during the swap.

---

## Implementation Plan

### Context

Colossus Scaffolding currently runs on `@platform/themes/vega`. We are migrating it to the self-contained composition architecture proven on DJ Fox Electrical (swapped to production 2026-04-21). The load-bearing concern is not the migration mechanics — the 7-step self-containment recipe is documented and proven. It is **preventing the DJ Fox-class visual drift** that occurred because visual review was manual and vision-based, leading Claude to declare "done" multiple times before the site was parity-accurate.

This plan therefore sinks disproportionate upfront effort into an **automated production-parity gate** that blocks completion until Colossus's build matches `colossusscaffolding.com` within measured thresholds across three viewports, with no per-page human inspection required.

Colossus introduces structural complexity DJ Fox did not: county→towns hierarchy in content and navigation, nested `/services/{service}/{location}` routes, a Leaflet coverage map, and site-specific sections (local authority expertise, pricing packages, county gateway cards, town finder). Five new composable components + one `FeatureGrid` variant are required before the migration can proceed.

### Outcome

`sites/colossus-scaffolding/` replaced with a self-contained composition-based implementation that matches `colossusscaffolding.com` within measured visual + structural diff thresholds across 71 MDX-driven pages × 3 viewports, with CI-enforced visual regression protection ongoing after the swap.

---

### Phase 0 — Build the production-parity validation gate

**This is the insurance policy. Build it first and dry-run against the unchanged site. No other phase begins until this gate is working and producing 0% drift on an unchanged site.**

#### 0.1 New tooling

New files under `tools/visual-parity/`:

- `route-manifest.ts` — crawls production sitemap + link graph, produces `manifest.json` (list of routes, template classification, viewport set).
- `capture-production.ts` — captures baselines for every route × 3 viewports.
- `capture-local.ts` — captures same routes against a dev server / preview URL.
- `compare-visual.ts` — pixel diff via existing `tools/lib/pipeline-visual-compare.ts`; writes diff PNGs; emits per-page JSON report.
- `compare-semantic.ts` — DOM structural diff: H1 exact match, heading outline, section count, image count ±1, link count ±10%, landmark presence.
- `preflight-tokens.ts` — scans which Tailwind theme-token classes composition.json will produce vs. which the theme-system plugin registers; flags missing registrations before any screenshot runs.
- `parity-report.ts` — aggregates visual + semantic + route-coverage + token results into a single `parity-report.md` with PASS/FAIL verdict per page, suite-wide weighted mean, exit code.

Package.json scripts on the site:

- `visual:baseline:capture` → captures production baseline.
- `visual:parity` → captures local + runs all gates + writes report + exits non-zero on any FAIL.

#### 0.2 Viewports

| Viewport | Dimensions  | Purpose                        |
| -------- | ----------- | ------------------------------ |
| Desktop  | 1440 × 1800 | Full-page including below-fold |
| Tablet   | 768 × 1024  | Mid-breakpoint                 |
| Mobile   | 390 × 844   | iPhone-class                   |

#### 0.3 Thresholds (hard fail above, warn in 1.2–1.8% band)

| Scope                                                                                         | Threshold               |
| --------------------------------------------------------------------------------------------- | ----------------------- |
| Per-route per-viewport                                                                        | > 1.8% diff → FAIL      |
| Critical templates (home, locations index, one county, one town, one service-location nested) | > 1.2% diff → FAIL      |
| Suite-wide weighted mean                                                                      | > 0.75% → FAIL          |
| Semantic: H1 text                                                                             | exact match required    |
| Semantic: heading outline                                                                     | exact sequence required |
| Semantic: section count                                                                       | exact match required    |
| Semantic: image count                                                                         | ±1 tolerated            |
| Semantic: link count                                                                          | ±10% tolerated          |

Any page in 1.2–1.8% shows as `WARN` in local dev output but does not fail CI. Pure pass/fail at the gate — no human in the loop.

#### 0.4 Determinism kit applied to every capture

- Disable animations via injected CSS freeze rule.
- Wait for `networkidle` + `document.fonts.ready` + 1s settle.
- Force `Europe/London` timezone and `en-GB` locale on the Playwright context.
- Mask Leaflet tile pane (`.leaflet-tile-pane`) — markers validated via DOM.
- Mask consent banner if present at capture time.
- Single retry on failed capture before final verdict.

#### 0.5 Dry-run gate validation

Run `capture-production` against `colossusscaffolding.com`, then `capture-local` + `compare-visual` against the **unchanged** `sites/colossus-scaffolding/`. Expected result: 0 FAILs, suite mean <0.2%. Any noise above this reveals a bug in the tooling and blocks Phase 1.

---

### Phase 1 — Capture the baseline

- Run `pnpm --filter colossus-scaffolding run visual:baseline:capture`.
- Commit baseline PNGs + `manifest.json` to `sites/colossus-scaffolding/tests/visual-baseline/`.
- Trade-off accepted: repo bloat vs. deterministic CI gating. Baselines are refreshed via a dedicated `baseline-update` PR, not continuously.

---

### Phase 2 — Scaffold the parallel test site

Applies the 7-step self-containment recipe adapted from `project_site_self_containment.md`.

1. `cp -R sites/colossus-scaffolding sites/colossus-scaffolding-test`
2. Update `sites/colossus-scaffolding-test/package.json` — rename `"name"`, drop `@platform/themes` dependency, add `@platform/component-composition`.
3. Stub `sites/colossus-scaffolding-test/composition.json` (Phase 4 fills it out).
4. Inline `vegaRegistry` into `theme.config.ts` as a literal `componentRegistry` object; drop the import.
5. Copy `packages/themes/vega/components/Header.tsx` → `sites/colossus-scaffolding-test/components/site-header.tsx` (rename export `VegaHeader` → `SiteHeader`). Same for Footer. Keep as Server Components; extract interactive bits into `components/header-locations-dropdown.client.tsx`.
6. Inline `packages/themes/vega/globals.css` into `sites/colossus-scaffolding-test/app/globals.css`; rewrite `animations.css` import to `@platform/core-components/src/styles/animations.css`.
7. Delete `@platform/themes/vega*` path aliases from `tsconfig.json`; remove those entries from `tailwind.config.ts` content globs.
8. Run the invariant: `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test --exclude-dir=node_modules --exclude-dir=.next` — must return zero.
9. Delete-simulation: `mv packages/themes/vega packages/themes/vega.disabled`; `pnpm --filter colossus-scaffolding-test run build` must succeed; restore.

**Gate 2:** invariant passes + delete-simulation passes + `visual:parity` vs baseline shows all PASS (the site is still visually identical to production because the copied Vega components render the same output).

---

### Phase 3 — Build the 5 new composables + 1 variant + shared primitive extensions

All composables go in `packages/core-components/src/components/composable/` with `.slots.ts` + Vitest tests. All register in `packages/core-components/src/components/composable/index.ts` and `tools/lib/composition-catalog.ts`. All register as dispatchable components in the composition renderer.

#### 3.1 `CountyGatewayCards`

Cards-per-county on locations index. dataKey: `locations.counties`. Input shape: `CountyInfo[]` from existing `getAllCounties()`. Cards show county name, description, highlight list, town-count badge, CTA.

#### 3.2 `TownFinderSection`

Searchable autocomplete over towns. Client component. Port from current `sites/colossus-scaffolding/components/ui/town-finder.tsx` but use only theme tokens. dataKey: `locations.towns`.

#### 3.3 `LocalAuthorityExpertise`

Location detail page section. Council name, relationship summary, expertise bullets, fast-track claims, coverage neighbourhoods. dataKey: `localAuthority` from location MDX frontmatter. Renders nothing gracefully if field absent.

#### 3.4 `CoverageMapSection`

Leaflet-based. Client component via `next/dynamic({ ssr: false })` to avoid SSR breakage. Takes `center`, `zoom`, `markers`. dataKey: `coverage`. Must expose markers in the DOM tree (not just on the map canvas) so the semantic gate can validate marker count/positions.

#### 3.5 `PricingPackagesSection`

Three-tier pricing (essential/standard/premium pattern on Colossus location pages). dataKey: `pricing.packages`. Distinct from existing `PricingTable` (job-cost grid) and `RateCardsSection` (rate list).

#### 3.6 `FeatureGrid` variant: `large-feature`

Extend existing `FeatureGrid` with a `variant: "large-feature"` for the location "specialists" section (large cards with icon, title, description, focal image). If during implementation the variant approach distorts the base component's API, promote to a new `LargeFeatureCards` composable — but try the variant first.

#### 3.7 Primitive extension: `buildGroupedColumns` + `HeaderNavDropdown` grouped mode

- New helper `packages/core-components/src/components/ui/buildGroupedColumns.ts` — groups a flat list by a parent key (e.g. `county`) with the parent name as the column header.
- Extend `header-nav-dropdown.tsx` to accept `groups?: Array<{ label, items }>` alongside the existing alpha-column props. Keep the existing `buildAlphaColumns` helper untouched — DJ Fox keeps working.
- Vitest snapshot with Colossus's 37-location fixture.

**Gate 3:** `pnpm --filter @platform/core-components run test` passes. No new hardcoded hex colors (grep). All new composables appear in `composition-catalog.ts`.

---

### Phase 4 — Wire composition.json and Colossus pages

Add composition entries for every page type. Page types reused from DJ Fox or new:

| Page type                                                                           | Route                    | Status           | New sections                                                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| home                                                                                | `/`                      | reuse            | adds `CountyGatewayCards` block                                                                                 |
| services                                                                            | `/services`              | reuse            | —                                                                                                               |
| service-detail                                                                      | `/services/{slug}`       | reuse            | —                                                                                                               |
| service-location-detail                                                             | `/services/{slug}/{loc}` | **new**          | `LocalAuthorityExpertise`                                                                                       |
| locations                                                                           | `/locations`             | reuse (redesign) | `CountyGatewayCards`, `TownFinderSection`, `CoverageMapSection`                                                 |
| county-detail                                                                       | `/locations/{county}`    | **new**          | full new pageType                                                                                               |
| location-detail                                                                     | `/locations/{town}`      | reuse (extend)   | `FeatureGrid[variant=large-feature]`, `LocalAuthorityExpertise`, `CoverageMapSection`, `PricingPackagesSection` |
| about, reviews, blog, blog-post, projects, project-detail, contact, privacy, cookie | various                  | reuse            | —                                                                                                               |

For `/locations/[slug]/page.tsx`, the single route classifies the slug (county vs town) from MDX frontmatter and dispatches to `renderComposedPage("county-detail", data)` or `renderComposedPage("location-detail", data)`. Classifier has a Vitest test asserting exactly 5 county slugs are detected (East Sussex, West Sussex, Kent, Surrey, Essex).

For `/services/[slug]/[location]/page.tsx`, the wrapper fetches nested MDX data and calls `renderComposedPage("service-location-detail", data)` with dot-path friendly keys.

**Gate 4:**

- `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test --exclude-dir=node_modules --exclude-dir=.next` → zero hits.
- `pnpm --filter colossus-scaffolding-test run build` passes (webpack).
- Delete-simulation passes again.
- Preflight token audit passes — no missing theme-token class registrations.

---

### Phase 5 — Iterative per-page validation loop

After each pageType is wired:

1. `pnpm --filter colossus-scaffolding-test run visual:parity --page {pageType}` (scoped).
2. If FAIL on visual → inspect the auto-generated diff PNG, fix composition entry / component / data, rerun.
3. If FAIL on semantic → fix the pageType's section list or data shape.
4. If WARN on visual (1.2–1.8%) → note in report but do not block.
5. Proceed to next pageType.

No human page-by-page inspection. The diff PNGs are generated automatically for any non-PASS result.

---

### Phase 6 — Final parity certification

Full suite run:

- `pnpm --filter colossus-scaffolding-test run visual:parity` across all 71 pages × 3 viewports.
- `pnpm --filter colossus-scaffolding-test run test`.
- `pnpm --filter colossus-scaffolding-test exec playwright test e2e/smoke.spec.ts`.
- `pnpm --filter colossus-scaffolding-test run type-check`.

**Gate 6 (final technical done):**

- Visual parity: 0 FAILs, suite mean ≤ 0.75%.
- Semantic parity: 0 FAILs.
- Unit tests pass.
- Smoke e2e pass.
- Type-check clean.

The YOLO brief (Phase 7) contains this gate as its exit criterion. A YOLO Claude instance that cannot satisfy Gate 6 cannot claim done.

---

### Phase 7 — Write the YOLO execution brief

Write `output/sessions/2026-04-22_colossus-migration/brief.md`:

- All phases above as discrete, ordered tasks.
- Gate 6 reproduced verbatim as the hard exit gate.
- The `UPDATE REMEDIATION AUDIT` section from memory pattern — the YOLO session must update its tracking doc as it goes.
- Post-migration checklist: after swap, recapture baseline against the new canonical site so future regressions catch real drift, not migration noise.

---

### Phase 8 — Production swap

Mirrors the DJ Fox 2026-04-21 swap recipe:

1. `git mv sites/colossus-scaffolding sites/colossus-scaffolding-legacy`.
2. `git mv sites/colossus-scaffolding-test sites/colossus-scaffolding`.
3. `pnpm install` — lockfile update is required after site rename (per memory feedback `feedback_site_rename_lockfile.md`).
4. Commit lockfile in the same commit as the rename.
5. Vercel `rootDirectory` stays the same (it's `sites/colossus-scaffolding`, which still exists post-rename). No Vercel project changes.
6. Push via `/deploy.changes` → `develop → staging → main`. Required CI check: `visual:parity` against staging deployment URL, not local dev server.

**Gate 8:** Staging parity suite passes before promotion to main.

---

### Phase 9 — Lock in ongoing regression protection

- Re-capture baseline against the new production site (post-swap) and commit. This becomes the forward-looking reference.
- Add CI job: `visual:parity` runs on every PR to `develop` with critical-templates-only scope. Full suite runs on every PR to `staging` and `main`.
- Document the workflow in `docs/guides/visual-regression.md`.
- Register the pattern in `project_site_self_containment.md` so the next migration (base-template) reuses the tooling.

---

## Critical Files

**New files to create:**

- `tools/visual-parity/route-manifest.ts`
- `tools/visual-parity/capture-production.ts`
- `tools/visual-parity/capture-local.ts`
- `tools/visual-parity/compare-visual.ts`
- `tools/visual-parity/compare-semantic.ts`
- `tools/visual-parity/preflight-tokens.ts`
- `tools/visual-parity/parity-report.ts`
- `packages/core-components/src/components/ui/buildGroupedColumns.ts`
- `packages/core-components/src/components/composable/county-gateway-cards.tsx` (+ `.slots.ts`, test)
- `packages/core-components/src/components/composable/town-finder-section.tsx` (+ `.slots.ts`, test)
- `packages/core-components/src/components/composable/local-authority-expertise.tsx` (+ `.slots.ts`, test)
- `packages/core-components/src/components/composable/coverage-map-section.tsx` (+ `.slots.ts`, test)
- `packages/core-components/src/components/composable/pricing-packages-section.tsx` (+ `.slots.ts`, test)
- `sites/colossus-scaffolding-test/composition.json`
- `sites/colossus-scaffolding-test/components/site-header.tsx`
- `sites/colossus-scaffolding-test/components/site-footer.tsx`
- `sites/colossus-scaffolding-test/components/header-locations-dropdown.client.tsx`
- `sites/colossus-scaffolding/tests/visual-baseline/` (directory with PNGs + manifest.json)
- `output/sessions/2026-04-22_colossus-migration/{session.md, brief.md}`
- `docs/guides/visual-regression.md`

**Existing files that must be modified:**

- `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — accept `groups` prop alongside alpha columns.
- `packages/core-components/src/components/composable/feature-grid.tsx` — add `variant: "large-feature"` case.
- `packages/core-components/src/components/composable/index.ts` — export the 5 new composables.
- `tools/lib/composition-catalog.ts` — register 5 new entries.
- `packages/component-composition/src/render-page.tsx` — dispatch the 5 new component keys.
- `sites/colossus-scaffolding-test/theme.config.ts` — inline `componentRegistry`, drop `vegaRegistry` import.
- `sites/colossus-scaffolding-test/app/layout.tsx` — swap `VegaHeader`/`VegaFooter` for local `SiteHeader`/`SiteFooter`, pass `locationsGroupBy: "county"`.
- `sites/colossus-scaffolding-test/app/globals.css` — inline Vega globals, drop package import.
- `sites/colossus-scaffolding-test/tsconfig.json` — drop theme path aliases.
- `sites/colossus-scaffolding-test/tailwind.config.ts` — drop theme content globs.
- `sites/colossus-scaffolding-test/package.json` — drop `@platform/themes` dep, add `@platform/component-composition`, add `visual:*` scripts.
- `sites/colossus-scaffolding-test/app/page.tsx` and the other pageType wrappers — reduce to data loader + `renderComposedPage(...)` call.

**Reusable existing utilities:**

- `tools/lib/pipeline-visual-compare.ts:47` — `compareImages()` does pixel diff + diff-PNG generation.
- `tools/lib/screenshot-capture.ts:38` — Playwright lifecycle pattern to adapt for multi-viewport.
- `tools/lib/visual-qa-loop.ts` — dev-server lifecycle pattern.
- `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — existing dropdown primitive with `buildAlphaColumns` helper (keeps working for DJ Fox).
- `packages/component-composition/src/render-page.tsx` — dot-path resolver + layout registry (already fixed).
- `sites/colossus-scaffolding/lib/locations.ts` — `getAllCounties()` county hierarchy builder.

---

## Risks & Trade-offs

1. **Leaflet tile non-determinism** — mitigated by masking the tile pane and validating markers via DOM, not pixels.
2. **Threshold tuning** — 1.8% per page is tight. If the dry-run against unchanged Colossus shows false positives, the thresholds must tune, not the masks. If they tune above 2.5% per page, the whole gate is too loose to catch DJ Fox-class drift — revisit the determinism kit before loosening.
3. **Missing Tailwind tokens (DJ Fox repeat)** — preflight token audit catches this before any screenshot. The audit must be run after every composition.json change.
4. **Baseline freshness vs. repo bloat** — baselines committed to repo. Refreshed only via dedicated PR. Expected baseline size: ~71 routes × 3 viewports × ~500KB = ~100MB. Accept the trade-off.
5. **Parallel-site lockfile churn** — renaming at the end requires `pnpm install` and lockfile commit. Documented in memory; the YOLO brief includes it as a step.
6. **County classifier edge cases** — redirect towns (`hove` → `brighton`) must not be misclassified. Classifier test explicitly asserts exactly 5 county slugs.
7. **`FeatureGrid` variant might not fit `specialists` section** — if the variant approach distorts the base component API, promote to a new `LargeFeatureCards` composable. Budget one hour for this branch point.
8. **Nested service-location route count** — 6 pages currently, but new locations added later will auto-enrol. Confirm `generateStaticParams()` for that route discovers files from the correct directory pattern before Phase 4 closes.

---

## Verification

End-to-end verification that the migration is actually done, runnable as a checklist:

1. `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test --exclude-dir=node_modules --exclude-dir=.next` → zero.
2. `mv packages/themes/vega packages/themes/vega.disabled && pnpm --filter colossus-scaffolding-test run build` → succeeds. Restore.
3. `pnpm --filter colossus-scaffolding-test run visual:parity` against local dev → 0 FAILs, suite mean ≤ 0.75%, all semantic gates PASS.
4. `pnpm --filter colossus-scaffolding-test run build` → success.
5. `pnpm --filter colossus-scaffolding-test run test` → passes.
6. `pnpm --filter colossus-scaffolding-test exec playwright test e2e/smoke.spec.ts` → passes.
7. Preflight token audit → no missing registrations.
8. Manual dropdown smoke: open `/` on dev server, hover Locations nav, confirm towns appear grouped under county headers (East Sussex, West Sussex, Kent, Surrey, Essex).
9. Post-swap: `visual:parity` against staging URL → 0 FAILs.
10. Post-swap: re-capture baseline against the new production deployment and commit as the forward-looking reference.
