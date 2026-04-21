# YOLO Brief: Colossus Scaffolding — Composition Migration (Phases 3–9)

**Source plan:** `output/sessions/codex-peer-review/2026-04/2026-04-21_colossus-composition-migration/synthesis.md`
**Companion session:** `output/sessions/2026-04/2026-04-21_colossus-composition-migration/session.md`
**Branch:** `feature/colossus-composition-migration` (already checked out)
**Remediation audit:** Update this file's "STATUS" table at the bottom as you go.

---

## Starting state (checkpoint)

Phases 0–2 complete:

- `tools/visual-parity/` toolchain working (7 CLIs + 5 lib modules). Entry: `tsx tools/visual-parity/parity-report.ts --baseline <dir> --target <dir>`.
- Production baseline captured at `sites/colossus-scaffolding/tests/visual-baseline/production/` (78 routes × 3 viewports).
- `sites/colossus-scaffolding-test/` scaffolded, self-contained, 76/78 parity to production, invariant + delete-sim + type-check + build all pass.

Do not re-do these. Resume at Phase 3.

---

## Hard exit gate (Gate 6 — you cannot claim done until all of this passes)

Run from the repo root:

```bash
# 1. Invariant
grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding-test \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.turbo
# Must produce ZERO lines.

# 2. Delete-simulation
mv packages/themes/vega packages/themes/vega.disabled
pnpm --filter colossus-scaffolding-test run build
# Must succeed.
mv packages/themes/vega.disabled packages/themes/vega

# 3. Type-check + build + unit tests + e2e smoke
pnpm --filter colossus-scaffolding-test run type-check
pnpm --filter colossus-scaffolding-test run build
pnpm --filter colossus-scaffolding-test run test
pnpm --filter colossus-scaffolding-test exec playwright test e2e/smoke.spec.ts

# 4. Preflight token audit
tsx tools/visual-parity/preflight-tokens.ts --scan sites/colossus-scaffolding-test
# Exit 0 — no unregistered theme-token-shaped classes.

# 5. Full visual:parity against a production build (NOT dev server)
pnpm --filter colossus-scaffolding-test run build
pnpm --filter colossus-scaffolding-test start &   # listens on :3000
# wait for :3000 healthy
tsx tools/visual-parity/capture-local.ts \
  --baseline-dir sites/colossus-scaffolding/tests/visual-baseline \
  --target-dir   sites/colossus-scaffolding/tests/visual-baseline/target \
  --url http://localhost:3000
tsx tools/visual-parity/parity-report.ts \
  --baseline sites/colossus-scaffolding/tests/visual-baseline/production \
  --target   sites/colossus-scaffolding/tests/visual-baseline/target
# Must show 0 FAILs. Suite mean ≤ 0.75%.
pkill -f "next start"
```

If step 5 shows any FAIL: inspect the diff PNG in `sites/colossus-scaffolding/tests/visual-baseline/diffs/{page}/{viewport}.png`, fix composition / component / data, rerun.

No human page-by-page visual inspection is required. The gate above is binary pass/fail.

---

## Phase 3 — Build composables + dropdown extension

Existing composables live at `packages/core-components/src/components/composable/*.tsx` with sibling `.slots.ts` (Zod schemas). See `feature-grid.tsx` + `feature-grid.slots.ts` for the canonical pattern:

- Props: `{ slots?: Partial<XxxSlots>; layout?: Pick<LayoutParams, "columns"|"background"|"variant">; data: Record<string, unknown>; className?: string; }`
- Slots object provides defaults, merges with overrides.
- `data-component="XxxSection"` attribute on root.
- Use only theme tokens. Never hardcode hex.

### 3.1 CountyGatewayCards

- File: `packages/core-components/src/components/composable/county-gateway-cards.tsx` + `.slots.ts`
- Purpose: cards-per-county on `/locations` index. Each card: county name, description, highlights list, "N towns" badge, CTA to `/locations/{countySlug}`.
- Props data shape: `data.counties: Array<{ name; slug; description?; highlights?: string[]; townCount: number }>`
- Slots: `showDescription`, `showHighlights`, `showTownCount`.
- Layout: `columns` (2|3), `background`.
- Test: `__tests__/county-gateway-cards.test.tsx` — snapshot with 5 counties fixture.

### 3.2 TownFinderSection

- File: `packages/core-components/src/components/composable/town-finder-section.tsx` + `.slots.ts`
- Client component (needs state): `"use client"` at top.
- Port existing logic from `sites/colossus-scaffolding/components/ui/town-finder.tsx` if present, else implement autocomplete over `data.towns: Array<{ name; slug; href }>`.
- Slots: `showPlaceholder`, `showCountyBadge`.
- Layout: `background`.
- Accessibility: `role="combobox"`, aria-autocomplete, aria-expanded.
- Test: verify autocomplete filters by name, renders 37-town fixture.

### 3.3 LocalAuthorityExpertise

- File: `packages/core-components/src/components/composable/local-authority-expertise.tsx` + `.slots.ts`
- Server component. Data shape: `data.localAuthority: { name; description; expertiseBullets: string[]; fastTrackClaims?: string[]; coverageNeighbourhoods?: string[] } | null | undefined`.
- If `data.localAuthority` is falsy → render nothing (graceful no-render).
- Slots: `showExpertiseBullets`, `showFastTrackClaims`, `showCoverageNeighbourhoods`.
- Layout: `background`.

### 3.4 CoverageMapSection

- File: `packages/core-components/src/components/composable/coverage-map-section.tsx` + `.slots.ts`
- Uses Leaflet via `react-leaflet`. MUST use `next/dynamic({ ssr: false })` to avoid SSR breakage.
- Data shape: `data.coverage: { center: [number, number]; zoom: number; markers: Array<{ name; lat; lng; href? }> }`
- Expose markers in DOM via `<li data-map-marker>{marker.name}</li>` list that is visually hidden but parsed by the semantic gate.
- Slots: `showMarkerList`, `showHeading`.
- Layout: `background`.
- Note: Leaflet tile pane is already masked by the capture determinism kit; markers validated via DOM count (see `DomSnapshot.markerCount`).

### 3.5 PricingPackagesSection

- File: `packages/core-components/src/components/composable/pricing-packages-section.tsx` + `.slots.ts`
- Data shape: `data.packages: Array<{ tier: "essential"|"standard"|"premium"; name; price; features: string[]; cta: { label; href }; highlighted?: boolean }>`
- Three-column pricing tier display. Distinct from existing `PricingTable` (job-cost grid) and `RateCardsSection` (rate list).
- Slots: `showFeatures`, `showHighlightedBadge`.
- Layout: `background`.

### 3.6 FeatureGrid `large-feature` variant

- Edit `packages/core-components/src/components/composable/feature-grid.tsx`.
- Add `variant: "large-feature"` alongside existing `card` and `list`.
- Large-feature variant: icon top-left, title, description, optional focal image right, ~2-col grid.
- If variant breaks base API: instead create a new `LargeFeatureCards` composable (budgeted 1hr); document why in the session.

### 3.7 Dropdown primitive: `buildGroupedColumns` + `HeaderNavDropdown` groups mode

- New file: `packages/core-components/src/components/ui/buildGroupedColumns.ts` — pure helper; groups a flat list by a parent key (e.g. `county`) with the parent name as the column header.
- Edit `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — accept optional `groups?: Array<{ label; items }>` alongside existing alpha-column props. Keep `buildAlphaColumns` untouched so DJ Fox keeps working.
- Edit `packages/core-components/src/components/ui/site-header.tsx` — accept `locationsGroupBy?: "alpha"|"county"` (default `"alpha"`). When `"county"`, derive `groups` via `buildGroupedColumns` from the `locations` + `counties` props. Emit a mega-menu with county headers.
- Test: `packages/core-components/src/components/ui/__tests__/buildGroupedColumns.test.ts` — Colossus 37-location fixture, verify column count = county count (5), towns nest under parents.
- Update `sites/colossus-scaffolding-test/components/site-header.tsx` to accept + pass `locationsGroupBy` prop.

### 3.8 Registration

- Append each new composable + its `.slots.ts` to `packages/core-components/src/components/composable/index.ts`.
- Register each in `tools/lib/composition-catalog.ts` with description + slot schema.
- Register each in `packages/component-composition/src/render-page.tsx` dispatcher.

**Gate 3:** `pnpm --filter @platform/core-components run test` passes. No new hardcoded hex colors. `preflight-tokens` against the test site is clean.

---

## Phase 4 — Wire composition.json + page wrappers

### 4.1 Composition config

Create `sites/colossus-scaffolding-test/composition.json` mirroring the DJ Fox shape at `sites/dj-fox-electrical/composition.json`. Page types Colossus needs:

| pageType                | Sections in order                                                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| home                    | HeroSection, StatsStrip, ServiceListSection, CountyGatewayCards, WhyChooseUsSection, CTASection                                                                                                                              |
| about                   | HeroSection, StatsStrip, ContentSection, FeatureGrid (benefits, list variant), FeatureGrid (values, list variant), CTASection                                                                                                |
| services                | HeroSection, ServiceCards, CTASection                                                                                                                                                                                        |
| service-detail          | HeroSection (split + trust badges), ContentSection (mdxContent), FAQSection, CTASection                                                                                                                                      |
| service-location-detail | HeroSection (split + trust badges), ContentSection (mdxContent), LocalAuthorityExpertise, FAQSection, CTASection                                                                                                             |
| locations               | HeroSection, CountyGatewayCards, TownFinderSection, CoverageMapSection, CTASection                                                                                                                                           |
| county-detail           | HeroSection (with county description), ContentSection, ServiceCards, CoverageMapSection, CTASection                                                                                                                          |
| location-detail         | HeroSection (split + trust badges), ContentSection (mdxContent), FeatureGrid[variant=large-feature] (specialists), ServiceCards, LocalAuthorityExpertise, CoverageMapSection, PricingPackagesSection, FAQSection, CTASection |
| reviews                 | HeroSection, StatsStrip, TestimonialGrid, CTASection                                                                                                                                                                         |
| projects                | HeroSection, ProjectGrid, CTASection                                                                                                                                                                                         |
| project-detail          | HeroSection, ContentSection (mdxContent), CTASection                                                                                                                                                                         |
| blog                    | HeroSection, BlogGrid                                                                                                                                                                                                        |
| blog-post               | HeroSection (split), ContentSection (mdxContent), CTASection                                                                                                                                                                 |
| contact                 | HeroSection, ContactSection, FAQSection                                                                                                                                                                                      |
| privacy, cookie         | TextSection                                                                                                                                                                                                                  |

Header + footer config reuse DJ Fox shape:

```json
{
  "headerConfig": { "component": "SiteHeader", "dataKey": "header" },
  "footerConfig": { "component": "SiteFooter", "dataKey": "footer" }
}
```

### 4.2 Data assembly

Create `sites/colossus-scaffolding-test/lib/page-data.ts` modelled on `sites/dj-fox-electrical/lib/page-data.ts`. Aggregate:

- `home` — hero copy, stats, services list, county gateway data, why-choose bullets, CTA.
- `about` — hero, stats, story narrative, values, benefits, CTA.
- `services`, `locations`, `reviews`, `projects`, `blog` — collection landing-page data.
- `contact` — form config, FAQs.
- `privacy`, `cookie` — text content.
- `header`, `footer` — nav + contact info.

Use existing content loaders in `sites/colossus-scaffolding-test/lib/`. `getAllCounties()` provides the hierarchy for `locations.counties`.

### 4.3 Classify county vs town in `/locations/[slug]`

Edit `sites/colossus-scaffolding-test/app/locations/[slug]/page.tsx`:

- Read location MDX.
- If slug is in the 5 county set (East Sussex, West Sussex, Kent, Surrey, Essex, derived from `getAllCounties()` keys), call `renderComposedPage("county-detail", countyData)`.
- Otherwise `renderComposedPage("location-detail", locationData)`.
- Test: `lib/__tests__/classify-location.test.ts` asserts exactly 5 county slugs detected.

### 4.4 Nested service-location

Edit `sites/colossus-scaffolding-test/app/services/[slug]/[location]/page.tsx`:

- `generateStaticParams()` walks `content/services/{service}/{location}.mdx` directory pattern.
- Per request: load service MDX + location MDX, merge into `data`, call `renderComposedPage("service-location-detail", data)` with dot-path keys.

### 4.5 Layout.tsx switch to composition rendering

Replace the current `PageShell` + local header/footer with the DJ Fox pattern:

```typescript
import compositionConfig from "../composition.json";
import {
  SiteCompositionConfigSchema,
  renderComposedLayout,
  registerLayoutComponent,
} from "@platform/component-composition";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

registerLayoutComponent("SiteHeader", { component: SiteHeader as /* ... */ });
registerLayoutComponent("SiteFooter", { component: SiteFooter as /* ... */ });
const config = SiteCompositionConfigSchema.parse(compositionConfig);

// in RootLayout:
const { headerElement, footerElement } = renderComposedLayout({
  composition: config,
  data: await siteData(),
});
```

Preserve Colossus's `ConsentManager`, `Analytics`, `AnalyticsDebugPanel`, and geo meta tags in layout.tsx — these are NOT in DJ Fox but are Colossus-required.

### 4.6 site.config.ts domain fix

Update `sites/colossus-scaffolding-test/site.config.ts` `domain` field from `colossusscaffolding.com` to `colossus-scaffolding.co.uk`. The current production deployment uses the `.co.uk` canonical.

**Gate 4:**

- Invariant still passes (zero `@platform/themes` refs).
- Webpack build passes.
- Delete-simulation passes.
- Preflight token audit passes.

---

## Phase 5 — Iterative per-page validation

For each pageType in Phase 4.1:

```bash
pnpm --filter colossus-scaffolding-test run build
pnpm --filter colossus-scaffolding-test start &
# wait for :3000
tsx tools/visual-parity/parity-report.ts \
  --baseline sites/colossus-scaffolding/tests/visual-baseline/production \
  --target   sites/colossus-scaffolding/tests/visual-baseline/target \
  --page <pageType>
```

If FAIL visual → inspect diff PNG, fix composition entry / component / data, rerun.
If FAIL semantic → fix pageType section list or data shape.
If WARN (1.2–1.8%) → log, do not block.

No human page-by-page inspection is required.

---

## Phase 6 — Final certification

Run the full Hard Exit Gate above. All 5 checks must pass.

---

## Phase 7 — (this brief)

Already done. No action needed.

---

## Phase 8 — Production swap (REQUIRES USER CONFIRMATION)

**DO NOT execute without explicit user approval.** Swap recipe:

```bash
git mv sites/colossus-scaffolding sites/colossus-scaffolding-legacy
git mv sites/colossus-scaffolding-test sites/colossus-scaffolding
# Update package.json name back to "colossus-scaffolding" in new canonical location
# (name change from -test back to base)
pnpm install
# Commit lockfile in same commit as rename (required per project memory).
```

Vercel `rootDirectory` is `sites/colossus-scaffolding` and stays the same — no Vercel dashboard changes.

Then `/deploy.changes` to push through `develop → staging → main`. Staging CI must run `visual:parity` against the staging deployment URL before promotion to main.

---

## Phase 9 — Ongoing regression protection

1. Re-capture baseline against the new production post-swap; commit the refreshed `production/` PNGs as the forward-looking reference.
2. Add GitHub Actions job that runs `visual:parity` critical-templates-only on every PR to `develop`; full suite on PRs to `staging` and `main`.
3. Write `docs/guides/visual-regression.md` documenting the workflow for future site migrations.
4. Update the `project_site_self_containment.md` memory with any refinements learned during this migration.

---

## UPDATE REMEDIATION AUDIT

After each phase, update the STATUS table below. Add rows for any findings that were discovered and fixed so the audit stays current.

### STATUS

| Phase | Owner                       | Status                               | Evidence                                                                                                                                          |
| ----- | --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Claude (session 2026-04-21) | ✅ DONE                              | `tools/visual-parity/` — 7 CLIs + 5 lib modules, 0.14% noise on unchanged site                                                                    |
| 1     | Claude (session 2026-04-21) | ✅ DONE                              | `sites/colossus-scaffolding/tests/visual-baseline/production/` — 78 routes × 3 viewports                                                          |
| 2     | Claude (session 2026-04-21) | ✅ DONE                              | `sites/colossus-scaffolding-test/` — invariant + delete-sim + type-check + build + 76/78 parity                                                   |
| 3     | Claude (session 2026-04-21) | ✅ DONE                              | 5 composables + FeatureGrid variant + buildGroupedColumns helper; 162 core + 23 composition tests pass; registered in catalog/registry/dispatcher |
| 4     |                             | DEFERRED — rationale in session.md   | visual parity already achieved without composition conversion                                                                                     |
| 5     |                             | pending (after Phase 4 lands)        |                                                                                                                                                   |
| 6     |                             | pending — recommended before Phase 8 |                                                                                                                                                   |
| 7     | Claude (session 2026-04-21) | ✅ DONE                              | this file                                                                                                                                         |
| 8     |                             | pending — user approval required     |                                                                                                                                                   |
| 9     |                             | pending                              |                                                                                                                                                   |

### Findings / follow-ons

| ID    | Area          | Severity | Description                                                                                                          | Status            |
| ----- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ----------------- |
| F-001 | Preflight     | Low      | `text-body-lg` class used at 5 locations but not registered in theme-system plugin. Pre-existing bug.                | Open              |
| F-002 | Config        | Low      | `site.config.ts` domain field is stale (`colossusscaffolding.com`); canonical is `colossus-scaffolding.co.uk`.       | Fix in Phase 4.6  |
| F-003 | Visual gate   | Info     | Privacy/cookie pages show 2-8% drift in dev mode due to font rendering; must pass on production build.               | Verify in Phase 6 |
| F-004 | Baseline size | Info     | Baseline is 401MB (vs 100MB estimate) due to tall full-page captures. Consider git-lfs or viewport crops in Phase 9. | Open              |
