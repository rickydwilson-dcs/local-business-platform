# Claude's Independent Plan: Viezu Ready Reckoner + AEO Pages + MCP Endpoint

**Date:** 2026-07-10
**Written before seeing Codex's plan.**

## Phase 0 — Real-data capture (fixtures, before any parsing code is written)

Before writing the sync script, capture real fixtures so the parser is built and tested against
actual Viezu payloads, not an assumed shape:

- Fetch 2-3 pages of the Store API (`/wp-json/wc/store/v1/products?page=1&per_page=100`, etc.)
  and save the raw JSON responses to `tools/__fixtures__/viezu/store-api-page-1.json` etc.
- Fetch 5-8 real product permalink pages spanning different makes/vehicle types (e.g. a car, a
  van, one with only one variation, one with several fuel/variant combinations) and save the raw
  HTML to `tools/__fixtures__/viezu/product-pages/*.html`.
- From those fixtures, manually inspect the `data-product_variations` blob on at least 2-3
  different real products to confirm the pipe-delimited field interpretation (e.g. does
  `"original_bhp":"258 | 197"` consistently pair with a `k_type` or stage indicator elsewhere in
  the same variation object, or is it two genuinely different variations sharing a display row?).
  Write this interpretation down as a comment in the parser once confirmed — do not guess and
  ship an assumption silently.
- **Verification gate:** parser unit tests run against these committed fixtures (not live
  network calls) so CI and future contributors can validate the parser without depending on
  Viezu's uptime or markup staying identical. If Viezu changes their markup later, the fixture
  tests will pass on stale data but the _live_ sync will surface as a hard failure (parser throws
  on missing `data-product_variations` rather than silently producing empty results) — this
  becomes the staleness/breakage detector.

## Phase 1 — Sync script

`tools/sync-viezu-catalog.ts`, modular two-pass design, following `tools/lib/` conventions
(custom User-Agent, delay between requests — same politeness pattern as
`tools/lib/clone-entry/ingest-live-site.ts`):

- **Pass A (catalog index):** walk all Store API pages, collect id/name/permalink/categories
  (make)/attributes per product. Filter categories to car + van tuning lines (see Phase 1a
  scoping decision below); explicitly exclude Agriculture/Marine/HGV-only/Bike/Motorhome-only and
  non-vehicle categories (tools, cables, accessories, tuning-tool brands like Alientech/Autotuner).
  Log the resulting make/model counts so page-volume is known before Phase 3 builds pages.
- **Pass B (performance data):** for each surviving product, fetch its permalink HTML, extract +
  parse the `data-product_variations` JSON (HTML-entity-decode first), and normalize into:
  ```
  { make, model, modelSlug, fuelType, variant, stages: [{ price, bhpGain, torqueGain,
    economyGainBhp, economyGainNm, fuelSaving }] }
  ```
  using the pipe-delimited interpretation confirmed in Phase 0.
- **Output:** one JSON file per make (`sites/dch-automotive/data/car-remaps/{make-slug}.json`)
  plus an `index.json` (make list + counts). Per-make files keep re-sync diffs scoped and
  reviewable in git, and map directly onto the per-make page structure in Phase 3.
- Re-run manually before each deploy; this is a committed data artifact, not a runtime dependency
  on viezu.com. Scheduled re-sync is an explicit non-goal for this pass.

**Phase 1a — scoping decision (car/van vs. also HGV):** Given `#fleet-enquiry` already exists on
this page targeting fleet customers, include **Van** categories alongside Car (both are plausible
DCH customer vehicles), but exclude HGV/Bus/Agriculture/Marine — those are a materially different
market (the DAF Buses HGV example seen in the live-widget screenshot is Viezu's commercial-vehicle
line, not evidence DCH services buses). Flag this as confirmed-with-client-if-unsure, not
silently assumed, since it changes page count materially.

**Verification gate:** run the script against real Viezu, diff the make/model counts against a
manual sample check on 5 known vehicles (bhp/torque/price matching the live site).

## Phase 2 — Shared data-access module

`sites/dch-automotive/lib/car-remaps-data.ts` — reads the per-make JSON files (server-side,
`fs/promises`, similar in spirit to how `lib/content.ts` reads MDX, but for this generated JSON
instead) and exposes: `listMakes()`, `listModelsForMake(makeSlug)`, `findVehicle({make, model,
fuelType, variant})`. Both the JSON API route (Phase 5) and the MCP tool (Phase 6) call this same
module — no duplicated lookup/parsing logic between them.

**Verification gate:** a small vitest suite against 2-3 real per-make JSON files (generated in
Phase 1, committed) confirming lookups return expected shapes for known vehicles.

## Phase 3 — Per-make AEO pages

`sites/dch-automotive/app/car-remaps/[make]/page.tsx` — new dynamic route,
`generateStaticParams()` sourced from `listMakes()`. This does **not** go through the MDX content
pipeline — consistent with `car-remaps/page.tsx` already being a documented bespoke exception on
this specific site (per `sites/dch-automotive/CLAUDE.md`). Each page renders real HTML tables
(not client-only rendering) of every model/engine/stage for that make — "Performance Figures" and
"Blue Optimize Fuel Efficiency Tune" tables, matching the field labels confirmed from the live
widget screenshot — styled with DCH's existing dark/orange theme tokens.

Add a new schema generator to the shared `packages/core-components/src/lib/schema-generators.ts`
factory (additive only — new function in the returned object, no existing exports touched),
modeled on the existing `getArticleSchema`/`getServiceAreaSchema` pattern (a plain function
taking options, returning a `@context`/`@type` object). Decision: **add it to the shared
factory**, not site-local — this platform's explicit architecture rule is "shared utilities use
factory patterns... bug fixes and improvements to shared logic flow to all sites automatically,"
and product/service-catalog schema is a plausible future need for other sites (e.g.
colossus-scaffolding equipment listings), so this is in line with existing precedent even though
only one site consumes it today. Wire it into `sites/dch-automotive/lib/schema.ts`'s existing
re-export block.

**Verification gate:** visit a generated make page in dev, confirm table data renders
server-side (view-source, not just client-rendered), and validate the JSON-LD block is
well-formed (structurally correct schema.org, spot-checked manually — no paid validator needed
for this pass).

## Phase 4 — Interactive ready reckoner (replaces the iframe)

`sites/dch-automotive/components/vehicle-tuning-finder.tsx` — client component, cascading selects
(Make → Model → Fuel Type → Variant), calling the Phase 5 JSON API (not reading static files
directly from the client) so there's one source of truth shared with the MCP tool and the
per-make pages. Renders the same stage-by-stage results as the current widget. Styling/state
pattern reference: `components/fuel-savings-calculator.tsx` (same page, closest existing
analogue — different calculation domain, not code to copy directly).

Replace the iframe block in `car-remaps/page.tsx` (~lines 485–506) with this component. Leave the
rest of the page untouched, including the `#fleet-enquiry` section immediately below it.

**Verification gate:** `npm run dev`, walk the selector for 2-3 real makes/models, confirm output
matches Viezu's live widget for the same vehicles.

## Phase 5 — Public JSON API

`sites/dch-automotive/app/api/car-remaps/route.ts` — `GET` with query params
(`make`/`model`/`fuelType`/`variant`), delegating to `car-remaps-data.ts` from Phase 2. Follows
this site's established route convention (`runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, thin
route file delegating to real logic elsewhere — same shape as `app/api/csrf-token/route.ts`).

**Verification gate:** `curl` the route with real query params, confirm JSON response shape and
correct data for a known vehicle.

## Phase 6 — MCP endpoint

Before writing code: resolve the `zod@^4.1.11` (already in this site's `package.json`) vs.
`mcp-handler`'s documented `zod@^3` peer expectation. Check the current `mcp-handler` /
`@modelcontextprotocol/sdk` npm listings live at implementation time — the peer-dependency
requirement may have been updated since the version referenced during investigation. If a
genuine v3/v4 conflict exists, prefer implementing directly against
`@modelcontextprotocol/sdk`'s HTTP transport without `mcp-handler` (more code, but avoids a
forced zod downgrade across a site that already uses v4 elsewhere, e.g. in `content-schemas.ts`
validation) — do not silently downgrade zod site-wide to satisfy one new dependency.

`sites/dch-automotive/app/api/[transport]/route.ts` (or a fixed `/api/mcp/route.ts` if the
resolved package doesn't need the dynamic transport segment) exposing one tool,
`find_car_remap_specs(make, model, fuelType, engineVariant)`, calling the same
`car-remaps-data.ts` module from Phase 2, returning matching vehicle(s) with stage-by-stage
figures, price, and the canonical `/car-remaps/{make}` page URL (for citation/backlink value when
an agent uses the tool). New deps confined to `sites/dch-automotive/package.json` only — this is
site-specific, not a shared platform concern (no other site has a comparable data catalog today).

**Verification gate:** `npx @modelcontextprotocol/inspector` (or equivalent) against the local
dev server, confirm the tool is discoverable and returns correct data for a known vehicle.

## Phase 7 — `llms.txt` + human-discoverable MCP docs

`sites/dch-automotive/public/llms.txt` (new precedent for the monorepo) listing the per-make
pages with short descriptions, and documenting the JSON API + MCP endpoint URLs. Short section on
`/car-remaps` (or a dedicated info page) publishing the MCP endpoint URL and basic usage — since
MCP has no crawl-based discovery yet, a human has to find this via the site itself until/unless
it's later listed in an MCP directory (explicitly out of scope for this pass, per brief).

**Verification gate:** fetch `/llms.txt` directly, confirm it's valid plain text/markdown and
every linked URL 200s.

## Phase 8 — Final verification + deploy prep

- `pnpm type-check` (root) and `pnpm --filter dch-automotive run lint`.
- Full manual walkthrough: `/car-remaps` interactive tool, 2-3 `/car-remaps/[make]` pages, the
  JSON API, and the MCP endpoint, all against real synced data.
- Standard git workflow: branch off `develop`, commit, push, verify CI, merge to `staging`, verify,
  merge to `main` — per root `CLAUDE.md`, never push directly to `staging`/`main`.

## Files created/modified

- `tools/__fixtures__/viezu/*.json`, `*.html` (new, Phase 0)
- `tools/sync-viezu-catalog.ts` (new, Phase 1)
- `sites/dch-automotive/data/car-remaps/{make-slug}.json` + `index.json` (new/generated, Phase 1)
- `sites/dch-automotive/lib/car-remaps-data.ts` (new, Phase 2)
- `sites/dch-automotive/app/car-remaps/[make]/page.tsx` (new, Phase 3)
- `packages/core-components/src/lib/schema-generators.ts` (edit — additive, Phase 3)
- `sites/dch-automotive/lib/schema.ts` (edit — re-export new generator, Phase 3)
- `sites/dch-automotive/components/vehicle-tuning-finder.tsx` (new, Phase 4)
- `sites/dch-automotive/app/car-remaps/page.tsx` (edit — swap iframe, Phase 4)
- `sites/dch-automotive/app/api/car-remaps/route.ts` (new, Phase 5)
- `sites/dch-automotive/app/api/[transport]/route.ts` (or `/api/mcp/route.ts`) (new, Phase 6)
- `sites/dch-automotive/package.json` (edit — new MCP-related deps, Phase 6)
- `sites/dch-automotive/public/llms.txt` (new, Phase 7)

## Risks and trade-offs

- **Viezu markup drift:** the entire pipeline depends on WooCommerce/WAPF markup conventions that
  Viezu could change without notice. Mitigation: fixture-based tests (Phase 0) catch parser
  regressions against known-good data; the live sync should fail loudly (not silently produce
  empty/wrong data) if the expected `data-product_variations` attribute disappears.
- **Category-filtering scope creep or under-scope:** including too much (HGV/Marine/Agriculture)
  produces irrelevant pages; excluding Van when the fleet-enquiry angle wants it produces a gap.
  Flagged as a decision point in Phase 1a rather than silently assumed either direction.
- **zod version conflict:** `mcp-handler`'s documented zod v3 peer dependency vs. this site's
  existing zod v4 — could force an awkward downgrade or package-choice pivot. Addressed head-on
  in Phase 6 rather than discovered mid-implementation.
- **Thin-content / page-volume risk:** even at one-page-per-make granularity, if the filtered
  catalog yields many dozens of makes, some may have only 1-2 models — worth a quick real-count
  check after Phase 1 before committing to per-make as the final granularity (the client already
  chose this granularity, but the actual number should be sanity-checked, not assumed).
- **MCP tooling immaturity:** this is genuinely new to the monorepo and a fast-moving spec/package
  ecosystem — expect more implementation-time research than a typical feature, and prefer the
  simplest correct implementation over chasing every convenience package.
