I’ll create `codex-plan.md` at the requested path with a full numbered migration plan, then I’ll return the exact synth command.

Implemented plan content for:

`output/sessions/codex-peer-review/2026-04/2026-04-21_colossus-composition-migration/codex-plan.md`

```md
# Colossus Scaffolding — Composition Migration Plan (Codex)

Date: 2026-04-21  
Scope: `sites/colossus-scaffolding` only

## 1) Migration Strategy (High-level)

1. **Migrate in-place on `sites/colossus-scaffolding` (no parallel site clone)** on `develop` branch.
   - Rationale: acceptance criteria explicitly target this path; avoids duplicate-site drift and lockfile churn from renames.
2. **Build a hard, programmatic parity gate first** (route coverage + semantic structure + visual diff), then migrate.
3. **Port Colossus to composition architecture** following DJ Fox pattern:
   - `composition.json`
   - site-local server `SiteHeader`/`SiteFooter`
   - `renderComposedPage` / `renderComposedLayout`
   - inline `componentRegistry` in `theme.config.ts`
4. **Promote Colossus-specific sections into shared composables** (`packages/core-components`) + catalog update.
5. **Keep ongoing regression gates** in CI after cutover (not one-time).

---

## 2) Hard Validation Gate Design (load-bearing)

## 2.1 Gate Components (all required)

1. **Route parity gate**
   - Crawl production (`https://colossusscaffolding.com`) into route manifest.
   - Crawl migrated local/preview site into route manifest.
   - Assert: every production route returns 200 on migrated site.

2. **Semantic structure gate**
   - For each route, compare:
     - H1 text exact match
     - Ordered heading outline signature (`h1/h2/h3` text sequence, normalized whitespace)
     - Section count (`main section` and key landmark block count)
   - Assert exact parity unless route is explicitly exempted (none expected initially).

3. **Visual parity gate (PNG diff, multi-viewport)**
   - Capture full-page screenshots for both production baseline and migrated build.
   - Compare with `tools/lib/pipeline-visual-compare.ts`.

## 2.2 Viewports

- Mobile: **390x844**
- Tablet: **768x1024**
- Desktop: **1440x1800** (full-page capture enabled)

## 2.3 Concrete Thresholds

Use **pixel diff percentage per screenshot** after deterministic stabilization + masks:

- **Per-route-per-viewport hard fail:** `> 1.8%`
- **Critical templates hard fail:** `> 1.2%` for:
  - home `/`
  - locations index `/locations`
  - one county page
  - one town page
  - one nested service-location page
- **Suite-wide weighted mean hard fail:** `> 0.75%`

Rationale: user allows “few percentage points” but rejects major drift. 1.8% per page catches missing sections/placeholder swaps (typically much larger), while allowing minor anti-aliasing and rendering noise. 0.75% suite mean prevents many “small but real” drifts accumulating.

## 2.4 Determinism Rules (to avoid false alarms)

- Disable animations/transitions during capture (inject CSS freeze).
- Wait for network idle + font readiness.
- Standardize timezone/locale.
- Mask dynamic/non-deterministic zones:
  - Leaflet tile pane only (not marker layer)
  - Cookie/consent overlays if present
- Retry each failed screenshot once before final verdict.

## 2.5 “REVIEW zone” policy (no human page-by-page)

- Development-time only: 1.2–1.8% marked “warn”.
- CI exit gate is binary: anything above hard thresholds fails.
- No manual certification step required to mark migration done.

---

## 3) Where changes happen (files)

## 3.1 New/updated gate tooling

1. `tools/visual-parity/colossus-route-manifest.ts` (new)
2. `tools/visual-parity/colossus-capture-production.ts` (new)
3. `tools/visual-parity/colossus-capture-local.ts` (new)
4. `tools/visual-parity/colossus-compare.ts` (new)
5. `tools/visual-parity/colossus-semantic-compare.ts` (new)
6. `sites/colossus-scaffolding/package.json` scripts:
   - `visual:baseline:capture`
   - `visual:parity`
7. CI pipeline step (site-scoped) invoking `pnpm --filter colossus-scaffolding run visual:parity`

## 3.2 Site migration files

1. `sites/colossus-scaffolding/composition.json` (new)
2. `sites/colossus-scaffolding/theme.config.ts` (rewrite to inline `componentRegistry`)
3. `sites/colossus-scaffolding/components/site-header.tsx` (new, server)
4. `sites/colossus-scaffolding/components/site-footer.tsx` (new, server)
5. `sites/colossus-scaffolding/components/header-locations-dropdown-client.tsx` (new, client interactive piece only)
6. `sites/colossus-scaffolding/app/layout.tsx` (switch to composed layout renderer)
7. `sites/colossus-scaffolding/app/page.tsx` (reduce to data loader + `renderComposedPage("home", data)`)
8. `sites/colossus-scaffolding/app/locations/page.tsx` (compose)
9. `sites/colossus-scaffolding/app/locations/[slug]/page.tsx` (compose, county/town split)
10. `sites/colossus-scaffolding/app/services/[slug]/[location]/page.tsx` (compose nested route)
11. `sites/colossus-scaffolding/app/globals.css` (remove vega globals import, inline equivalent + leaflet + animations import)
12. any other route page wrappers currently rendering legacy sections.

## 3.3 Shared composables/catalog

1. `packages/core-components/src/components/composable/local-authority-expertise.tsx` (+ `.slots.ts`, tests)
2. `packages/core-components/src/components/composable/pricing-packages-section.tsx` (+ `.slots.ts`, tests)
3. `packages/core-components/src/components/composable/county-gateway-cards.tsx` (+ `.slots.ts`, tests)
4. `packages/core-components/src/components/composable/town-finder-section.tsx` (+ `.slots.ts`, tests)
5. `packages/core-components/src/components/composable/coverage-map-section.tsx` (+ `.slots.ts`, tests)
6. `packages/core-components/src/components/composable/index.ts` exports
7. `tools/lib/composition-catalog.ts` update entries for new composables

---

## 4) County-grouped dropdown design

1. Keep `Header` as server component.
2. Build dropdown data on server using existing `getAllCounties()` from `sites/colossus-scaffolding/lib/locations.ts`.
3. Extend UI primitive with grouped support:
   - Add helper: `packages/core-components/src/components/ui/buildGroupedColumns.ts` (new)
   - Update `header-nav-dropdown.tsx` to support:
     - `groups: Array<{label, items}>`
     - grouped rendering with county headers
4. Keep alphabetical builder for DJ Fox unchanged; no breaking API.

Gate:

- Unit test for `buildGroupedColumns`.
- Playwright assertion: county headers visible and towns appear under correct county group.

---

## 5) Nested `/services/{service}/{location}` handling

1. Add pageType in `composition.json`: `serviceLocation`.
2. In `app/services/[slug]/[location]/page.tsx`:
   - resolve service + location MDX data
   - construct composition data object with nested keys (dot-path friendly)
   - call `renderComposedPage("serviceLocation", data)`
3. Include explicit sections for local authority, pricing, CTA/contact parity where used in current design.

Gate:

- route manifest includes all existing nested routes
- semantic and visual parity checks for representative and full set

---

## 6) County vs town page handling

1. Keep single route file `app/locations/[slug]/page.tsx`.
2. Detect slug type via existing data loader logic.
3. Render:
   - `renderComposedPage("countyOverview", data)` for 5 county pages
   - `renderComposedPage("townLocation", data)` for towns
4. Define separate pageTypes in `composition.json` to reflect structural differences.

Gate:

- exactly 5 slugs classified county
- county pages pass section-count parity against production

---

## 7) Phased execution plan + gates

## Phase 0 — Baseline & Guardrails

1. Implement visual+semantic+route tooling.
2. Capture production baseline screenshots and semantic snapshots.
3. Commit baseline artifacts for deterministic CI use (see trade-off section).

**Gate 0 (must pass before migration starts):**

- baseline capture succeeds for all discovered routes × 3 viewports.
- manifest locked and versioned.

## Phase 1 — Shared component groundwork

1. Add new composables in `packages/core-components`.
2. Add slot schemas + tests.
3. Update composition catalog.

**Gate 1:**

- package tests pass.
- no hardcoded hex colors.
- exports available for site usage.

## Phase 2 — Header/Footer + dropdown migration

1. Introduce site-local server `SiteHeader`/`SiteFooter`.
2. Implement grouped county dropdown via primitive extension.
3. Replace vega header/footer imports in layout.

**Gate 2:**

- Header/Footer server-component contract satisfied (`'use client'` absent).
- dropdown grouping verified in e2e.
- grep shows no header/footer from `@platform/themes/vega` in layout path.

## Phase 3 — Compose all routes

1. Add `composition.json` pageTypes (`home`, `locationsIndex`, `countyOverview`, `townLocation`, `serviceLocation`, plus blog/project/contact types as needed).
2. Refactor route files to data-loader wrappers + `renderComposedPage`.
3. Ensure dot-path data keys for nested values.
4. Rewrite `theme.config.ts` inline registry.
5. Update globals CSS to remove theme package dependency.

**Gate 3:**

- `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding --exclude-dir=node_modules --exclude-dir=.next` => zero
- local build passes with normal repo state.

## Phase 4 — Dependency severance proof

1. Temporarily rename `packages/themes/vega` to `.disabled`.
2. Run `pnpm --filter colossus-scaffolding run build` (webpack build path).

**Gate 4:**

- build succeeds with vega unavailable.

## Phase 5 — Full parity certification

1. Run route parity + semantic parity + visual parity against production baseline.
2. Run site tests:
   - `pnpm --filter colossus-scaffolding run test`
   - `playwright test e2e/smoke.spec.ts`

**Gate 5 (final technical done):**

- all acceptance checks pass, including thresholds.

## Phase 6 — Release flow

1. Merge `develop` → `staging` and run same parity suite against staging deploy.
2. Promote `staging` → `main`.
3. Verify post-deploy smoke + parity spot-check automation (not manual page-by-page).

---

## 8) Risks & trade-offs

1. **Leaflet map nondeterminism**
   - Risk: tile variance causes false diffs.
   - Mitigation: mask tile pane only; assert marker count/positions separately via DOM test.

2. **County/town misclassification**
   - Risk: wrong pageType selection creates subtle structural mismatch.
   - Mitigation: explicit classifier test expecting exactly 5 counties.

3. **Token omissions (DJ Fox repeat)**
   - Risk: invisible text on dark surfaces.
   - Mitigation: preflight token audit script on classnames used by composition + contrast assertions on key text nodes.

4. **Overfitting thresholds**
   - Risk: too loose misses drift, too strict blocks harmless noise.
   - Mitigation: dual threshold model (per-page + suite mean + critical-template stricter cap).

5. **Baseline freshness vs repo bloat**
   - Decision: commit baseline for deterministic PR gating; refresh intentionally (manual command) only when production-approved design changes.
   - Trade-off accepted: larger repo for reliable non-flaky gating.

---

## 9) Open questions resolved (proposed)

1. **Concrete threshold numbers**
   - Hard gate: per screenshot ≤1.8%, critical templates ≤1.2%, suite mean ≤0.75%.

2. **Baseline strategy**
   - Commit baselines to repo under a site-scoped path (e.g., `sites/colossus-scaffolding/tests/visual-baseline/`).
   - Refresh only through explicit “baseline update” PR.

3. **When to run full parity suite**
   - Fast checks on each PR (semantic + selected critical routes visual).
   - Full route × viewport parity at phase boundaries and required on staging promotion.

4. **REVIEW-zone handling without human**
   - Keep review zone only for developer feedback.
   - CI remains pass/fail; no manual visual sign-off required to close migration.

---

## 10) Definition of Done (mapped to acceptance)

1. No `@platform/themes/*` or `packages/themes/*` refs in site.
2. Build succeeds with `packages/themes/vega` disabled.
3. All production routes served with 200 on migrated site; heading and section parity intact.
4. Visual diff under defined hard thresholds across desktop/tablet/mobile.
5. Header dropdown grouped by county with towns beneath county labels.
6. Build/test/smoke Playwright pass.
7. Entire process certifiable by automated gates (no manual page-by-page review).
```

/plan.with.codex synthesise
