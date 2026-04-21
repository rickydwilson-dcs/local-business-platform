# Colossus Scaffolding — Self-Contained Composition Migration

## Context

Colossus Scaffolding currently runs on the `@platform/themes/vega` theme package. We are migrating it to the self-contained composition architecture that now powers DJ Fox Electrical (swapped to production 2026-04-21).

**The headline concern is not the migration mechanics** — the 7-step self-containment recipe is documented and proven. The headline concern is **preventing the DJ Fox-class visual drift**, where several sections rendered as empty scaffolds, a missing Tailwind token caused invisible text, and the issues were only discovered after a human reviewed side-by-side screenshots. Claude declared "done" multiple times before the site was actually parity-accurate.

This plan therefore sinks disproportionate upfront effort into an **automated production-parity validation gate** that will block the migration from being marked complete until Colossus's dev build matches its current live production site within a defined threshold, at three viewports, with no manual page-by-page inspection required.

Colossus introduces complexity DJ Fox did not: a county→towns hierarchy in both content and navigation, nested `/services/{service}/{location}` routes, a Leaflet coverage map, and site-specific sections (local authority expertise, pricing packages, county gateway cards, town finder). These require seven new composable component variants before the migration can proceed.

**Outcome:** `sites/colossus-scaffolding/` replaced with a self-contained composition-based implementation that matches `colossusscaffolding.com` (live production) within a measured visual and structural diff threshold across 71 MDX-driven pages, with ongoing visual regression protection in CI.

---

## Key Decisions (locked in via AskUserQuestion)

1. New Colossus-specific sections are built as **composable variants** in `packages/core-components/src/components/composable/` — not site-local.
2. Migration uses a **production-parity gate**: new tools capture live Colossus at 3 viewports, pixel + DOM diff runs per page, page is not "done" until thresholds pass.
3. Work happens in a **parallel `sites/colossus-scaffolding-test/`** directory, swapped at the end like DJ Fox.
4. New composables are built **directly inside the test site** using Colossus content as the test bed.

---

## Phase 0 — Build the Production-Parity Validation Gate (do this FIRST)

This is the insurance policy. All other phases depend on it. Build and dry-run it against the current `sites/colossus-scaffolding/` before we change anything, so we know the gate works with a 0% drift target on an unchanged site.

### Tools to build

**`tools/capture-production-baseline.ts`** (~200 lines, new)

- Input: canonical production URL (`https://colossusscaffolding.com`), site slug, output dir.
- Uses existing `@playwright/test` Chromium pattern from `tools/lib/screenshot-capture.ts:38-100`.
- Captures full-page PNG for every discoverable route (crawl `sitemap.xml` or static list).
- Captures at three viewports: `1440x900` (desktop), `768x1024` (tablet), `375x667` (mobile).
- Also captures a **DOM snapshot JSON** per page: section count, landmark tags present, heading tree, image count, link count, first-paint text (for catching missing content).
- Runs with `reducedMotion: 'reduce'`, `waitUntil: 'networkidle'`, and a 2s settle delay.
- Output layout:
  ```
  output/sessions/2026-04-22_colossus-migration/baseline/
    production/
      home/desktop.png
      home/tablet.png
      home/mobile.png
      home/dom.json
      locations/desktop.png
      … (one folder per route)
    manifest.json          # list of all captured routes + viewports
  ```

**`tools/validate-migration.ts`** (~300 lines, new)

- Input: baseline dir, target site slug (e.g. `colossus-scaffolding-test`), port (dev server).
- Starts the target's dev server (reuses `tools/lib/visual-qa-loop.ts` lifecycle pattern).
- For each page in the manifest:
  - Captures dev screenshots at all three viewports.
  - Captures dev DOM snapshot.
  - Runs `compareImages()` from `tools/lib/pipeline-visual-compare.ts:47` (already generates red-highlighted diff PNGs). One result per viewport.
  - Runs structural diff (JSON tree comparison — count and type of sections, heading presence, link count within ±10%).
  - Checks HTTP status.
- Produces `migration-report.md` with per-page status (PASS / FAIL / REVIEW) and writes diff PNGs to `output/.../diffs/{page}/{viewport}.png`.
- Emits non-zero exit code if any page is FAIL — designed to be a CI gate and a YOLO brief checkpoint.

**Thresholds:**

| Page type                              | Desktop     | Tablet | Mobile | Notes                                                    |
| -------------------------------------- | ----------- | ------ | ------ | -------------------------------------------------------- |
| Home, locations index, services index  | 6%          | 8%     | 10%    | Flagship pages — strictest                               |
| Service / location / blog detail       | 8%          | 10%    | 12%    | Content-driven, allow MDX variance                       |
| Generic content (about, privacy, etc.) | 8%          | 10%    | 12%    |                                                          |
| **REVIEW** (inconclusive) zone         | diff 15–25% |        |        | Triggers `cs-visual-fidelity-reviewer` on that page only |
| **FAIL** zone                          | diff > 25%  |        |        | Hard block                                               |

These thresholds are deliberately generous for the "few percentage points of variance" the user accepts while still catching the DJ Fox-class failures (missing sections, invisible text, wrong backgrounds, broken hero).

**DOM structural tolerances:**

- Section count must match exactly (missing section → FAIL, matches the "empty scaffold" bug).
- Heading tree (h1→h2→h3 order) must be structurally identical (text may differ).
- Image count within ±1.
- Link count within ±10%.
- Required landmark elements present: `<header>`, `<main>`, `<footer>`, `<nav>`.

**Dry-run validation:** run `capture-production-baseline.ts` then `validate-migration.ts` with the current `sites/colossus-scaffolding/` as both baseline source and target. Expected result: all pages PASS with ~0% diff. Any noise in this dry run reveals bugs in the tooling itself and must be fixed before Phase 1.

### Enforcement mechanism

The YOLO brief written in Phase 6 will contain this exit gate:

> Before claiming the migration complete, run `tsx tools/validate-migration.ts --baseline output/sessions/2026-04-22_colossus-migration/baseline --target colossus-scaffolding-test`. If any page is FAIL, fix and rerun. If any page is REVIEW, invoke `cs-visual-fidelity-reviewer` scoped to just those pages. Only after the report shows 0 FAILs and 0 unresolved REVIEWs may you proceed. Paste the final report summary into the session wrap-up.

---

## Phase 1 — Capture the baseline

- Run `tsx tools/capture-production-baseline.ts --url https://colossusscaffolding.com --slug colossus-scaffolding`.
- Commit the baseline PNGs + manifest to the repo under `sites/colossus-scaffolding/__baseline__/` (git-LFS if size demands).
- Purpose: both the migration gate AND a long-term visual regression baseline usable by Playwright's `toHaveScreenshot()` afterward.

---

## Phase 2 — Scaffold the parallel test site

Apply the 7-step self-containment recipe from `project_site_self_containment.md`, adapted from DJ Fox precedent.

1. `cp -R sites/colossus-scaffolding sites/colossus-scaffolding-test`
2. Update `sites/colossus-scaffolding-test/package.json` — rename `"name"`, delete `@platform/themes` dep, add `@platform/component-composition`.
3. Create `sites/colossus-scaffolding-test/composition.json` (Phase 4 fills it out).
4. Inline `vegaRegistry` into `theme.config.ts` as a literal `componentRegistry` object.
5. Copy `packages/themes/vega/components/Header.tsx` → `sites/colossus-scaffolding-test/components/site-header.tsx` (rename export `VegaHeader` → `SiteHeader`). Same for Footer.
6. Inline `packages/themes/vega/globals.css` into `sites/colossus-scaffolding-test/app/globals.css`.
7. Delete `@platform/themes/vega*` path aliases in `tsconfig.json` and Tailwind content globs.
8. Run the invariant: `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test --exclude-dir=node_modules --exclude-dir=.next` must return zero.
9. Run the delete-simulation: temporarily rename `packages/themes/vega/` and verify `pnpm --filter colossus-scaffolding-test run build` still succeeds.

**At this point the test site should be visually ~identical to production (still using the copied Vega header/footer verbatim).** Run `validate-migration.ts` against the test site — expected PASS on all pages. This is the checkpoint before we start swapping pages to composition.

---

## Phase 3 — Build the seven missing composable components

Each of these is built in `packages/core-components/src/components/composable/`, registered in `tools/lib/composition-catalog.ts`, and dispatched in `packages/component-composition/src/render-page.tsx`. Each gets a Vitest unit test and appears in Colossus's `composition.json` for immediate integration testing.

### 3.1 `CountyGroupedDropdown` (header primitive variant)

- Extension of existing `packages/core-components/src/components/ui/header-nav-dropdown.tsx`.
- Add a `buildGroupedColumns()` helper alongside the existing `buildAlphaColumns()` — groups items by a parent key (e.g. `county`) with the parent as the column header.
- Integration: `SiteHeader` receives `navigation` + `locations` + a new `locationsGroupBy?: "alpha" | "county"` prop. If `"county"`, it calls `buildGroupedColumns` using the `county` field on each location.
- Data source: existing `lib/locations.ts:getAllCounties()` provides the hierarchy.
- Test: Vitest snapshot with Colossus's 37-location fixture; verify column count = county count, towns nest under parents.

### 3.2 `CountyGatewayCards` section

- Variant of `CategoryCardsSection` — cards per county with county name, description, highlight list, town-count badge, CTA to `/locations/{countySlug}`.
- Composition key: `CountyGatewayCards`, dataKey `locations.counties`.
- Data shape: `{ counties: CountyInfo[] }` from `getAllCounties()`.

### 3.3 `TownFinderSection`

- Client component (searchable autocomplete over towns).
- Already present as `components/ui/town-finder.tsx` in current Colossus — port it to composable, accept `towns: TownInfo[]` prop, use existing theme tokens only (no hardcoded colors).
- Composition key: `TownFinderSection`, dataKey `locations.towns`.

### 3.4 `LocalAuthorityExpertise` section

- Location detail page section: council name, relationship summary, expertise bullets, fast-track claims, coverage neighborhoods.
- Composition key: `LocalAuthorityExpertise`, dataKey `localAuthority` (pulled from location MDX frontmatter).
- Graceful fallback: render nothing if frontmatter field absent (some locations won't have it).

### 3.5 `CoverageMapSection` (Leaflet-based)

- Client component — Leaflet is already a Colossus dependency.
- Takes `center: [lat, lng]`, `zoom`, `markers: Array<{ name, lat, lng, href }>`.
- Composition key: `CoverageMapSection`, dataKey `coverage`.
- Must dynamically import Leaflet (`next/dynamic` with `ssr: false`) to avoid SSR issues.

### 3.6 `PricingPackagesSection`

- Three-tier pricing package display (essential / standard / premium pattern).
- Composition key: `PricingPackagesSection`, dataKey `pricing.packages`.
- Different from existing `PricingTable` (job-cost grid) and `RateCardsSection` (rate list) — this is the "choose your package" layout used on Colossus location pages.

### 3.7 `LargeFeatureCards` section

- Location page hero specialists display — large cards with icon, title, description, focal image.
- Composition key: `LargeFeatureCards`, dataKey typically `specialists`.
- Could be a variant of existing `FeatureGrid` with `variant: "large"` — prefer variant over new component if the layouts converge.

### New page types in composition

Composition.json gets two new page types not in DJ Fox:

- `county-detail` — for `/locations/{county-slug}` pages (East Sussex, Kent, etc.). Sections: Hero, CountyOverview (ContentSection variant), CountyGatewayCards (nested towns), CoverageMapSection, ServiceCards, CTASection.
- `service-location-detail` — for `/services/{service}/{location}` routes. Same sections as `service-detail` but with LocalAuthorityExpertise inserted.

The composition renderer (`packages/component-composition/src/render-page.tsx`) already supports arbitrary pageType keys via the dispatcher. Wrapping Next.js pages will be thin: `app/services/[slug]/[location]/page.tsx` fetches MDX and calls `renderComposedPage("service-location-detail", data)`.

---

## Phase 4 — Wire Colossus pages through composition

For each of Colossus's 71 MDX-driven pages + the static app routes, write the entry in `sites/colossus-scaffolding-test/composition.json` mapping `pageType` → sections.

**Page inventory:**

| Page type                                                                                      | Route                    | Existing in DJ Fox? | New sections needed                                                                    |
| ---------------------------------------------------------------------------------------------- | ------------------------ | ------------------- | -------------------------------------------------------------------------------------- |
| home                                                                                           | `/`                      | yes                 | add CountyGatewayCards block                                                           |
| services                                                                                       | `/services`              | yes                 | none (reuse)                                                                           |
| service-detail                                                                                 | `/services/{slug}`       | yes                 | none (reuse)                                                                           |
| service-location-detail                                                                        | `/services/{slug}/{loc}` | no                  | LocalAuthorityExpertise                                                                |
| locations                                                                                      | `/locations`             | yes (redesign)      | CountyGatewayCards, TownFinderSection, CoverageMapSection                              |
| county-detail                                                                                  | `/locations/{county}`    | no                  | full new pageType                                                                      |
| location-detail                                                                                | `/locations/{town}`      | yes                 | LargeFeatureCards, LocalAuthorityExpertise, CoverageMapSection, PricingPackagesSection |
| about, reviews, blog, blog-post, projects, project-detail, contact, privacy, cookie, not-found | various                  | yes                 | none (reuse)                                                                           |

Each page's data is assembled in the site's `lib/content.ts` from the existing MDX loaders — no frontmatter schema changes needed, since the new composables read the same fields `getAllCounties()` already exposes.

---

## Phase 5 — Iterative per-page validation

After each page type is wired:

1. Run `tsx tools/validate-migration.ts --target colossus-scaffolding-test --page {pageType}` to scope the run.
2. If FAIL: inspect the auto-generated diff PNG, fix the composition entry / component / data, rerun.
3. If REVIEW: invoke `cs-visual-fidelity-reviewer` scoped to that page only.
4. Move to next page type.

This is the protection against "declared done without inspection" — each page has a quantitative gate.

---

## Phase 6 — Wrap the migration in a YOLO brief

Write `output/sessions/2026-04-22_colossus-migration/brief.md` containing:

- All phases above as discrete tasks.
- The hard exit gate (full migration-report must show 0 FAILs / 0 unresolved REVIEWs before wrap-up).
- The "UPDATE REMEDIATION AUDIT" section from memory so the audit stays current.
- Post-migration checklist: update `sites/colossus-scaffolding/__baseline__/` to the new canonical screenshots (so future regressions are caught against the composition-era site, not the vega-era site).

This brief is executable in YOLO mode. The user does not need to intervene per page — the validation gate blocks incorrect completion.

---

## Phase 7 — Production swap

Same pattern as DJ Fox (2026-04-21):

1. Rename `sites/colossus-scaffolding/` → `sites/colossus-scaffolding-legacy/`.
2. Rename `sites/colossus-scaffolding-test/` → `sites/colossus-scaffolding/`.
3. Update `pnpm-workspace.yaml` / `turbo.json` only if names changed (they shouldn't).
4. Run `pnpm install` to refresh lockfile (memory item: site-rename requires this).
5. Vercel project `rootDirectory` stays the same — no Vercel changes needed.
6. Push through `develop → staging → main` via `/deploy.changes`.

---

## Phase 8 — Lock in ongoing regression protection

- Port Colossus's existing `e2e/visual-regression.full.spec.ts` to use the captured baseline PNGs as Playwright's `toHaveScreenshot()` reference.
- Add a CI job that runs `tools/validate-migration.ts` against the staging deployment on every PR to `main`.
- Document the workflow in `docs/guides/visual-regression.md` so future site migrations (base-template next) can reuse it.

---

## Critical Files

**New files to create:**

- `tools/capture-production-baseline.ts`
- `tools/validate-migration.ts`
- `packages/core-components/src/components/composable/county-gateway-cards.tsx` (+ `.slots.ts`)
- `packages/core-components/src/components/composable/town-finder-section.tsx` (+ `.slots.ts`)
- `packages/core-components/src/components/composable/local-authority-expertise.tsx` (+ `.slots.ts`)
- `packages/core-components/src/components/composable/coverage-map-section.tsx` (+ `.slots.ts`)
- `packages/core-components/src/components/composable/pricing-packages-section.tsx` (+ `.slots.ts`)
- `packages/core-components/src/components/composable/large-feature-cards.tsx` (+ `.slots.ts`) OR FeatureGrid variant
- `sites/colossus-scaffolding-test/composition.json`
- `sites/colossus-scaffolding-test/components/site-header.tsx` (copied from Vega, extended for county grouping)
- `sites/colossus-scaffolding-test/components/site-footer.tsx`
- `output/sessions/2026-04-22_colossus-migration/session.md` + `brief.md`
- `docs/guides/visual-regression.md`

**Existing files that must be modified:**

- `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — add `buildGroupedColumns` helper
- `packages/core-components/src/components/composable/index.ts` — export new composables
- `tools/lib/composition-catalog.ts` — register new composables in the AI-facing catalog
- `packages/component-composition/src/render-page.tsx` — register new component keys in the dispatcher (this uses a registerSectionComponent pattern per memory)
- `packages/core-components/src/lib/locations.ts` (if exists; else site-level `lib/locations.ts`) — ensure `getAllCounties()` exposes the shape CountyGroupedDropdown needs

**Reusable existing utilities:**

- `tools/lib/pipeline-visual-compare.ts:47` — `compareImages()` already does pixel diff + diff-PNG generation
- `tools/lib/screenshot-capture.ts:38` — Playwright lifecycle pattern to copy
- `tools/lib/visual-qa-loop.ts` — dev-server-lifecycle pattern
- `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — existing dropdown primitive with `buildAlphaColumns` helper
- `packages/component-composition/src/render-page.tsx` — dot-path resolver (bug already fixed) and layout registry
- `sites/colossus-scaffolding/lib/locations.ts` — county hierarchy builder, battle-tested

---

## Verification

End-to-end verification that the migration is truly done:

1. `tsx tools/capture-production-baseline.ts --url https://colossusscaffolding.com` — captures baseline.
2. `tsx tools/validate-migration.ts --target colossus-scaffolding-test` against the unswapped test site — must show 0 FAILs, 0 unresolved REVIEWs across 71 pages × 3 viewports.
3. `pnpm --filter colossus-scaffolding-test run build` — must succeed.
4. `pnpm --filter colossus-scaffolding-test run test` — unit tests pass.
5. `pnpm --filter colossus-scaffolding-test exec playwright test e2e/smoke.spec.ts` — smoke passes.
6. `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test --exclude-dir=node_modules --exclude-dir=.next` — returns zero hits (self-containment invariant).
7. Delete-simulation: temporarily rename `packages/themes/vega/` and re-run the test site build — must still succeed.
8. Post-swap: `tsx tools/validate-migration.ts --target colossus-scaffolding` against the staging deployment URL (not dev server) — must still show 0 FAILs. **This catches prod-vs-dev drift that DJ Fox never tested for.**
9. Live-site smoke: hit the staging URL, click through the 6 main nav items and the new county-grouped locations dropdown — the dropdown must show towns nested under county names (the Colossus-specific feature).

---

## Estimated Effort

| Phase                                 | Est. time                     |
| ------------------------------------- | ----------------------------- |
| 0. Build validation gate              | 3–4 hours                     |
| 1. Capture baseline                   | 15 min (tool does it)         |
| 2. Scaffold test site                 | 45 min (recipe is mechanical) |
| 3. Build 7 composables + 2 page types | 4–6 hours                     |
| 4. Wire composition.json for 71 pages | 1–2 hours (most is template)  |
| 5. Iterative validation + fix loop    | 2–4 hours (depends on drift)  |
| 6. Write YOLO brief                   | 30 min                        |
| 7. Production swap                    | 30 min                        |
| 8. CI integration                     | 1 hour                        |
| **Total, interactive portions**       | **~6–8 hours**                |
| **Total, YOLO-able portions**         | **~6–8 hours** (unattended)   |

The validation gate is the expensive part but it is the thing that lets the rest run unattended without the user intervening per page.
