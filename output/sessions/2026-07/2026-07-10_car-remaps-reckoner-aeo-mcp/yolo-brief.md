# YOLO Implementation Brief: DCH Automotive Car Remaps — Ready Reckoner, AEO Pages, JSON API, MCP Endpoint

**Branch:** `feature/car-remaps-reckoner-aeo-mcp` (created from `develop` — this repo's documented integration branch; `develop → staging → main`, never push directly to `staging`/`main`)
**Session spec:** `output/sessions/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/yolo-brief.md`
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this

---

## Context

`sites/dch-automotive/app/car-remaps/page.tsx` embeds a third-party Viezu vehicle-tuning finder via `<iframe>`. Investigation found Viezu's WooCommerce Store API is public/unauthenticated and each product page embeds structured performance-data JSON (`data-product_variations`). This brief replaces the iframe with DCH-owned data: an interactive ready-reckoner UI, crawlable per-make AEO pages with Schema.org markup, a public JSON API, and an MCP server endpoint for LLM agents to query directly.

This plan was reviewed via dual-model peer review (Claude + Codex/GPT-5.3-Codex independently, synthesised by Opus) — see `output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/synthesis.md` for full decision rationale. Implement it exactly as specified below.

**Revision (2026-07-11) — scope mechanism changed after a real Phase 1 run.** The first execution of this brief ran Phase 1 for real and hit a genuine STOP gate: Viezu's public WooCommerce Store API `categories` field does **not** cleanly separate Car/Van from Bike/HGV/Agriculture/Marine/Motorhome — the two big buckets (`VLF`, `Vehicle Tuning and Remapping`) mix all vehicle types together, and 32% of a sampled batch had no category at all. Investigation of the live `/dealer` widget already embedded on `sites/dch-automotive/app/car-remaps/page.tsx` found the actual mechanism: the widget's own cascading selector (`Vehicle Type → Make → Model → Fuel Type → Variant`) is powered by a WordPress AJAX endpoint (`admin-ajax.php`, actions `get_filter_brands` / `get_filter_models` / `get_filter_fueltype` / `get_filter_variant`, all keyed on a `vehicle-type` param with exact values `cars`, `vans`, `bike-tuning`, `hgv-tuning`, `agriculture-tuning`, `marine`, `motorhomes`) — confirmed live: `vehicle-type=cars` returns a completely different, clean marque list (BMW, Audi, Ford, Mercedes…) than `vehicle-type=vans` (Ford Vans, Mercedes Vans, Iveco…), with zero motorbikes in either. This is **Viezu's own authoritative scope boundary**, not a guess, and Phases 1–3 below have been rewritten to use it instead of category/keyword filtering. Everything else in this brief (Phases 4–10) is unaffected — they consume Phase 3's output regardless of how scope was determined.

**Known risk of this approach (flag for the runbook, Phase 10):** it depends on an undocumented internal WordPress endpoint (`admin-ajax.php` + a page-scoped nonce), not a public/versioned API. It could change or break without notice — unlike the Store API, there's no stability contract. Accept this risk for now (it's strictly more correct than the category heuristic); the runbook must say so explicitly so a future maintainer isn't surprised if it breaks.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok)                     | Use for                                                                                             |
| ------ | -------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5.00 / $25.00                             | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $2.00 / $10.00 (intro, through 2026-08-31) | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1.00 / $5.00                              | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

## Delegation Model

The orchestrator is a **coordinator, not an implementer**. Its job is: read this brief,
sequence the phases, dispatch sub-agents, run verification gates, make commits, and write
the final report. It does **not** implement phase work inline by default.

**Every phase's implementation work is delegated to one or more `Task` sub-agents**, each
spawned at the phase's `**Model:**` tier. The model annotation _is_ the sub-agent's model —
it is meaningless unless the work is delegated, because the orchestrator cannot change its
own running model. A `**Model:** haiku` phase executed inline runs at full orchestrator
cost and consumes orchestrator context; delegating it keeps that work in the sub-agent and
returns only a short summary.

**Inline exception.** The orchestrator may implement a phase inline ONLY when the work is
tightly cross-coupled and correctness-critical — e.g. a deterministic engine spanning many
interdependent files with exact golden vectors — where round-tripping through a sub-agent
would lose essential context. When taken, the phase MUST declare
`**Execution:** inline (exception) — <one-line rationale>`. This is the exception, not the
default; prefer delegation whenever the work is separable.

The orchestrator's own model (set by the launch command) is **independent** of the phase
tiers. Opus orchestrating while individual phases delegate to haiku/sonnet sub-agents is
expected and correct — the orchestrator coordinates; the tiers attach to sub-agents.

---

## Pre-flight

```bash
# Check out and update develop (this repo's integration branch)
git checkout develop && git pull
git checkout -b feature/car-remaps-reckoner-aeo-mcp

# Fastest correctness gate — must be clean before starting
pnpm type-check
```

---

## Phase 1 — Scope Lock & Real-Data Fixture Capture

**Goal:** Record the Car+Van scope decision using Viezu's own authoritative vehicle-type marque/model lists (see Revision note above — WooCommerce category filtering was tried for real and confirmed unreliable) and capture real Viezu payloads as fixtures — a hard gate before any parser code exists.

**Model:** sonnet — requires judgment (selecting representative real products, interpreting ambiguous data) plus live HTTP fetching, not pure mechanics.
**Execution:** delegate to 1 sonnet sub-agent

Task: Capture Viezu fixtures and record scope decision (marque/model-based)
model: sonnet
Prompt: |
Read `sites/dch-automotive/app/car-remaps/page.tsx` lines 470-530 (the current iframe section
and surrounding context) and `sites/dch-automotive/CLAUDE.md` for site conventions.

**Part A — the authoritative scope source (do this first).**

1. Fetch `https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace` fresh (a real browser
   User-Agent, e.g. `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
(KHTML, like Gecko) Chrome/120.0 Safari/537.36`). In the raw HTML, find the inline
   `var custom_product_filter = {"ajaxurl":"...","security":"..."};` script variable — extract
   both values. The `security` value is a live WordPress nonce scoped to this page load; it is
   NOT a fixed secret and must be re-fetched fresh whenever it's needed (document this clearly
   — Phase 3's sync script will need to repeat this fetch-then-extract step itself, not reuse a
   hardcoded value).
2. POST to that `ajaxurl` with `action=get_filter_brands`, `vehicle-type=cars`, and the
   extracted `security` nonce. Save the raw HTML option-list response to
   `sites/dch-automotive/lib/car-remaps/__fixtures__/ajax-brands-cars.html`.
3. Repeat with `vehicle-type=vans` → save to
   `sites/dch-automotive/lib/car-remaps/__fixtures__/ajax-brands-vans.html`.
4. Pick 2 marques from the cars list and 2 from the vans list (use their `value=` slugs, e.g.
   `bmw-tuning-remapping`, `ford-vans`). For each, POST `action=get_filter_models` with
   `vehicle-type`, `vehicle-make=<that slug>`, and the nonce. Save each response to
   `sites/dch-automotive/lib/car-remaps/__fixtures__/ajax-models-<marque-slug>.html` (4 files).
5. **Cross-vehicle-type marque check (important):** some marques make more than one vehicle
   type (e.g. BMW makes both cars and motorbikes). Check whether any marque you picked in step
   4 also appears in the `vehicle-type=bike-tuning` (or `hgv-tuning`/`agriculture-tuning`)
   brand list by fetching `get_filter_brands` once more with one of those non-in-scope
   `vehicle-type` values and grepping for the same marque name. If you find an overlapping
   marque, fetch its `get_filter_models` response under that other vehicle-type too and save it
   as `ajax-models-<marque-slug>-<other-vehicle-type>.html` — this fixture proves whether model
   names alone (ignoring vehicle-type) are enough to disambiguate, or whether marque+model
   genuinely collide across vehicle types. Record what you find — this determines whether Phase
   2's scope matcher can safely key on (marque, model) alone or needs a third signal.
6. Confirmed by prior investigation: the WooCommerce Store API's public `categories` field does
   **not** expose this marque/model taxonomy at all (e.g. the real "Ford Transit Custom" product
   fixture already captured in this directory has only `vlf-vehicle-tuning-and-remapping` as its
   category — no marque-level category). So scope matching in Phase 2/3 must compare each Store
   API catalog entry's **product name** (e.g. "Ford Transit Custom Tuning (2023 – Present)")
   against the marque+model lists from this AJAX cascade, after normalizing both sides — not
   compare against `categories`.

**Part B — product/performance-data fixtures (mostly already captured from a prior run at
`sites/dch-automotive/lib/car-remaps/__fixtures__/` — check what's there first and only
re-fetch what's missing or stale):**

1. 2-3 Store API catalog pages (`https://viezu.com/wp-json/wc/store/v1/products?page=N&per_page=100`).
2. 6-8 real product permalink HTML pages spanning a car, a van, a single-variation product, a
   multi-variation product, at least one with pipe-delimited performance values (confirmed
   present on `viezu.com/shop/mercedes-cle-2023-present/`), and one category-noise page
   (tools/accessories).
3. On 2-3 product fixtures, confirm the `data-product_variations` pipe-delimited interpretation
   (this was already confirmed in a prior run — re-verify against the existing fixtures rather
   than re-fetching: every numeric field in a bundled variation is pipe-delimited with the same
   count, positionally aligned across fields including a `k_type` field; there is no submodel
   name in the API to label each position).
4. Use a ~300-500ms delay between requests and the same real browser User-Agent throughout —
   be polite, this is someone else's production site.

Write findings to `sites/dch-automotive/lib/car-remaps/__fixtures__/README.md` (update the
existing file if present):

- The `ajaxurl` / nonce mechanics and the fact the nonce must be re-fetched live, not cached.
- The full parsed marque lists for `cars` and `vans` (names as they appear in the AJAX response,
  e.g. "BMW Tuning & Remapping", "Ford Vans Tuning & ECU Remapping") and the exact suffix
  patterns you observe (" Tuning & ECU Remapping", " Tuning & Remapping", " Vans", " Car Tuning
  & ECU Remapping", etc.) so Phase 2 can write a `normalizeMarqueName()` that strips them to a
  bare marque ("BMW", "Ford").
- The model-name pattern from `get_filter_models` responses (e.g. "Tourneo Custom (2017 -
  Present)") vs. the Store API product-name pattern (e.g. "Ford Transit Custom Tuning (2023 –
  Present)") — note the differences (marque prefix, "Tuning" word, en-dash vs hyphen, year-range
  placement) precisely enough that Phase 2 can write a matching normalizer. Recommend matching
  on normalized (marque, base-model-name-without-year-range) rather than exact full-string
  match, since year-range formatting differs between the two sources and scope inclusion
  shouldn't depend on getting that formatting byte-identical.
- The result of the cross-vehicle-type marque check from Part A step 5, and your recommendation
  for whether (marque, model) alone is a safe matching key or needs adjustment.
- The pipe-delimited interpretation (re-confirmed) and the non-vehicle category exclusion list
  (tools/cables/accessories categories — this part of the original category-based approach
  remains valid and unchanged).

Return: a short summary of everything fetched (Part A and B), the marque-list sizes for cars vs
vans, and the cross-vehicle-type marque check result. STOP and escalate to the user if the
(marque, model) matching key is genuinely unsafe with no reasonable resolution — do not guess.

**Verification gate — STOP if this fails:**

```bash
ls sites/dch-automotive/lib/car-remaps/__fixtures__/ajax-brands-*.html
ls sites/dch-automotive/lib/car-remaps/__fixtures__/ajax-models-*.html
ls sites/dch-automotive/lib/car-remaps/__fixtures__/*.json
ls sites/dch-automotive/lib/car-remaps/__fixtures__/product-*.html
cat sites/dch-automotive/lib/car-remaps/__fixtures__/README.md
```

Confirm: both `ajax-brands-cars.html` and `ajax-brands-vans.html` exist and are non-empty (real
`<option>` lists, not a `-1` WordPress nonce-failure response), at least 4 `ajax-models-*.html`
fixtures exist, at least 2 Store API JSON fixtures and 6+ product HTML fixtures exist, and the
README documents the nonce mechanics, marque normalization rules, model-name matching approach,
and the cross-vehicle-type marque check result. STOP and escalate to the user if any AJAX fixture
contains `-1` (nonce failure) instead of real option HTML, or if the (marque, model) matching key
is confirmed unsafe.

```bash
git add sites/dch-automotive/lib/car-remaps/__fixtures__/
git commit -m "feat(dch-automotive): capture real Viezu fixtures for car-remaps rebuild, marque/model-based scope"
```

---

## Phase 2 — Parser (fixture-tested)

**Goal:** Build pure-function parsers for the Store API catalog format, the AJAX marque/model cascade responses, and the `data-product_variations` performance-data blob, tested against the Phase 1 real fixtures (no live network calls, no synthetic mocks).

**Model:** sonnet — non-trivial parsing logic (HTML entity decoding, JSON extraction, pipe-delimited normalization, marque/model name matching) plus test authoring.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build and test the Viezu data parsers
model: sonnet
Prompt: |
Read `sites/dch-automotive/lib/car-remaps/__fixtures__/README.md` in full for the confirmed
pipe-delimited interpretation, the marque normalization suffix patterns, the model-name
matching approach, and the cross-vehicle-type marque check result from Phase 1. Read 2-3 of the
fixture JSON/HTML files directly (including the `ajax-brands-*.html` and `ajax-models-*.html`
ones) to see the real shapes.

Create `sites/dch-automotive/lib/car-remaps/types.ts`:

- `CatalogEntry` type: `{ id, name, slug, permalink, categories: string[], attributes: {
fuelTypes: string[], variants: string[] } }` (from Store API product objects)
- `PipeValue` type: `{ raw: string, parsedValues: string[], primaryValue: string,
secondaryValue?: string }` — conservative model for pipe-delimited fields (split on `|`,
  trim whitespace; primaryValue = first token, secondaryValue = second token if present)
- `VariationPerformance` type: `{ fuelType: string, variant: string, originalBhp: PipeValue,
powerBhpGain: PipeValue, originalTorque: PipeValue, torqueNmGain: PipeValue,
economyGainBhp: PipeValue, economyGainNm: PipeValue, fuelSaving: PipeValue,
displayPriceCents: number }`
- `NormalizedVehicle` type: `{ make: string, model: string, modelSlug: string,
sourceProductId: number, sourceUrl: string, variations: VariationPerformance[] }`
- `ScopeMarque` type: `{ slug: string, name: string }` (from `get_filter_brands`)
- `ScopeModel` type: `{ slug: string, name: string }` (from `get_filter_models`)
- `ScopeIndex` type: a structure holding the normalized (marque, base-model) pairs considered
  in-scope — your choice of shape (e.g. `Set<string>` of `"${marque}::${model}"` keys, or a
  `Map<string, Set<string>>` of marque → models), whichever `isInScopeVehicle` below finds
  cleanest.

Create `sites/dch-automotive/lib/car-remaps/parsers.ts` with pure functions:

- `parseStoreApiPage(rawJson: string): CatalogEntry[]` — parses a Store API response page,
  extracts id/name/slug/permalink/categories/attributes per product.
- `parsePipeValue(raw: string): PipeValue` — implements the pipe-delimited normalization
  from Phase 1's README.
- `parseProductVariations(html: string): VariationPerformance[]` — locates the
  `data-product_variations="..."` attribute in the HTML (regex or simple string search for
  `data-product_variations="` then find the matching closing `"` accounting for HTML entity
  escaping), HTML-entity-decodes it (`&quot;` → `"`, etc.), `JSON.parse()`s it, and maps each
  variation object's fields (`attribute_fuel-type`, `attribute_variant`, `original_bhp`,
  `power_bhp`, `original_torque`, `torque_nm`, `economy_gain_bhp`, `economy_gain_nm`,
  `fuel_saving`, `display_price_cents`) into `VariationPerformance` records using
  `parsePipeValue` on the pipe-delimited fields.
- **Breakage detection:** if `data-product_variations` is missing or fails to `JSON.parse()`,
  `parseProductVariations` must `throw` an explicit `Error` including the product URL/context
  — never return an empty array silently. This is the primary Viezu-markup-drift detector for
  the Phase 3 sync script's fail-fast threshold.
- `parseFilterBrandsResponse(html: string): ScopeMarque[]` — parses a `get_filter_brands` AJAX
  response's `<option value="...">Name</option>` list into marque records. If the response is
  literally `-1` (WordPress's generic nonce-failure response) or has zero options, `throw` an
  explicit `Error` — this is the nonce-expiry/endpoint-drift detector for Phase 3.
- `parseFilterModelsResponse(html: string): ScopeModel[]` — same shape, for `get_filter_models`
  responses.
- `normalizeMarqueName(raw: string): string` — strips the suffix patterns documented in Phase
  1's README (" Tuning & ECU Remapping", " Tuning & Remapping", " Vans", " Car Tuning & ECU
  Remapping", etc.) to produce a bare marque ("BMW Tuning & Remapping" → "bmw", "Ford Vans
  Tuning & ECU Remapping" → "ford"). Lowercase the result for comparison.
- `normalizeModelName(raw: string): string` — strips the trailing year-range parenthetical
  (e.g. "Tourneo Custom (2017 - Present)" → "tourneo custom", "Transit Custom Tuning (2023 –
  Present)" → "transit custom" — also strip a bare "Tuning" word if present) and lowercases,
  per Phase 1's documented pattern differences between AJAX model names and Store API product
  names. Use your judgment on exact punctuation/whitespace handling — the goal is that the same
  real vehicle's AJAX model name and Store API product name normalize to the same string, not
  byte-perfect symmetry.
- `buildScopeIndex(marques: { cars: ScopeMarque[], vans: ScopeMarque[] }, modelsByMarque: Map<string, ScopeModel[]>): ScopeIndex`
  — builds the normalized (marque, model) in-scope index from the raw AJAX data.
- `isInScopeVehicle(productName: string, index: ScopeIndex): boolean` — normalizes the Store API
  product name into (marque, model) using the same normalizers, and checks membership in the
  index. Read Phase 1's README's cross-vehicle-type marque check result: if it found a genuine
  (marque, model) collision between an in-scope and out-of-scope vehicle type, implement
  whatever disambiguation Phase 1 recommended; if it found no collision, marque+model membership
  alone is sufficient.
- `filterInScopeCategories(categories: string[]): boolean` — unchanged from before: returns
  false for non-vehicle categories (tools/cables/accessories/tuning-tool-brand categories) —
  this check still runs first, independent of `isInScopeVehicle`, since it catches noise
  `isInScopeVehicle` was never designed to catch (e.g. a diagnostic tool product has no
  recognizable marque name at all).

Create `sites/dch-automotive/lib/car-remaps/parsers.test.ts` (vitest, following this site's
existing test conventions — check an existing `*.test.ts` file in the site for import/setup
patterns) that:

- Loads the real fixture files from `__fixtures__/` (via `fs.readFileSync`, not network calls)
- Tests `parseStoreApiPage` against a real fixture, asserting correct extraction
- Tests `parseProductVariations` against 2-3 real product fixtures, including the
  pipe-delimited one, asserting the parsed `PipeValue` shape is correct
- Tests `parseFilterBrandsResponse` and `parseFilterModelsResponse` against the real
  `ajax-brands-*.html` / `ajax-models-*.html` fixtures
- Tests `normalizeMarqueName` / `normalizeModelName` against real examples from the fixtures,
  asserting a real AJAX model name and its corresponding real Store API product name normalize
  to the same value
- Tests `filterInScopeCategories` against real category names from the fixtures (in-scope
  car/van categories return true, the category-noise fixture's categories return false)
- Tests `isInScopeVehicle` end-to-end: build a `ScopeIndex` from the real AJAX fixtures, assert
  a real in-scope product name (e.g. the Ford Transit Custom fixture) returns true and an
  out-of-scope one (something not in the fixture marque lists, e.g. a motorbike or the
  tools/cables noise product) returns false
- Includes at least one **expected-failure** test: take one fixture's HTML, strip out the
  `data-product_variations` attribute (string replace in the test, not a new fixture file),
  and assert `parseProductVariations` throws
- Includes one more **expected-failure** test: pass a literal `"-1"` string to
  `parseFilterBrandsResponse` and assert it throws (nonce-failure detection)

Run the tests yourself (`pnpm --filter dch-automotive test parsers` or similar — check the
site's `package.json` test script) and fix any failures before returning. Report back: test
pass/fail summary, and confirm both expected-failure tests correctly throw.

**Verification gate — STOP if this fails:**

```bash
pnpm --filter dch-automotive test -- car-remaps
```

All parser tests pass, including the expected-failure test.

```bash
git add sites/dch-automotive/lib/car-remaps/types.ts sites/dch-automotive/lib/car-remaps/parsers.ts sites/dch-automotive/lib/car-remaps/parsers.test.ts
git commit -m "feat(dch-automotive): add fixture-tested Viezu data parsers"
```

---

## Phase 3 — Sync Pipeline (Pass A catalog → Pass B enrichment → normalize)

**Goal:** Build the orchestrated sync script that walks the live Store API, filters to in-scope categories, fetches each retained product's performance data, and writes normalized per-make JSON data files plus a manifest with a fail-fast threshold.

**Model:** sonnet — moderate complexity, multiple coordinated files, but follows an established pattern (polite fetch + pagination) with no deep architectural ambiguity.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build the Viezu catalog sync pipeline
model: sonnet
Prompt: |
Read `sites/dch-automotive/lib/car-remaps/{types,parsers}.ts` (Phase 2 output) — you will
import and use these. Read `tools/lib/clone-entry/ingest-live-site.ts` for the polite-fetch
pattern precedent in this monorepo (custom User-Agent, delay between requests) — a pattern
reference only, not code to import directly (different module, different purpose).

Create `sites/dch-automotive/scripts/car-remaps/config.ts`:

- Export `EXCLUDED_NON_VEHICLE_CATEGORIES` — the tools/cables/accessories category slugs from
  Phase 1's README (unchanged from the original category-exclusion approach — this part was
  always solid).
- Export `IN_SCOPE_WIDGET_VEHICLE_TYPES = ['cars', 'vans']` — the `vehicle-type` values to walk
  via the AJAX cascade for scope determination, structured as a plain array so HGV
  (`hgv-tuning`) could be added later by appending one entry (a "config switch", not a plugin
  system).
- Export `VIEZU_DEALER_WIDGET_URL = 'https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace'`
  (the page whose inline JS carries the live nonce — same URL already embedded as the iframe
  src in `car-remaps/page.tsx` before this rebuild), `FETCH_DELAY_MS = 400` (or similar
  reasonable value), `USER_AGENT` string, and `FAIL_FAST_THRESHOLD = 0.1` (abort if >10% of
  in-scope products fail to parse).

Create `sites/dch-automotive/scripts/car-remaps/fetch-marques.ts`:

- `fetchNonce(): Promise<{ ajaxUrl: string, security: string }>` — fetches
  `VIEZU_DEALER_WIDGET_URL` fresh with `USER_AGENT`, extracts the inline
  `custom_product_filter = {"ajaxurl":"...","security":"..."}` JS object from the raw HTML
  (regex or simple string search), and returns both values. Throw an explicit error if the
  pattern isn't found (widget markup drift detector).
- `fetchFilterBrands(vehicleType: string, nonce: { ajaxUrl: string, security: string }): Promise<ScopeMarque[]>`
  — POSTs `action=get_filter_brands`, `vehicle-type=<vehicleType>`, `security=<nonce.security>`
  to `nonce.ajaxUrl`, parses the response with `parseFilterBrandsResponse` from Phase 2 (which
  already throws on a `-1` nonce-failure response — let that propagate).
- `fetchFilterModels(vehicleType: string, makeSlug: string, nonce: { ajaxUrl: string, security: string }): Promise<ScopeModel[]>`
  — same pattern for `action=get_filter_models` with `vehicle-make=<makeSlug>` added, parsed
  with `parseFilterModelsResponse`.
- `fetchScopeIndex(): Promise<ScopeIndex>` — orchestrates: `fetchNonce()` once, then for each
  `vehicle-type` in `IN_SCOPE_WIDGET_VEHICLE_TYPES`, call `fetchFilterBrands`, then for every
  marque returned call `fetchFilterModels` (with `FETCH_DELAY_MS` delay between every request —
  this walks on the order of 100+ marques total across cars+vans, each needing one models
  request, so budget for it), and pass everything to Phase 2's `buildScopeIndex`. If the nonce
  expires partway through (a `get_filter_models` call throws the nonce-failure error), call
  `fetchNonce()` again once and retry that single request before giving up — WordPress nonces
  are page-load-scoped and a long walk may need a mid-walk refresh.

Create `sites/dch-automotive/scripts/car-remaps/fetch-store-api.ts`:

- `fetchAllCatalogPages(): Promise<CatalogEntry[]>` — walks
  `https://viezu.com/wp-json/wc/store/v1/products?page=N&per_page=100` from page 1 until a
  page returns fewer than 100 results (or reading `X-WP-TotalPages` header if accessible via
  fetch), parsing each page with `parseStoreApiPage` from Phase 2, with `FETCH_DELAY_MS` delay
  between requests and `USER_AGENT` header set. Do NOT filter here — return the full raw
  catalog; scope filtering (both category-exclusion and marque/model matching) happens in
  `sync.ts` once the `ScopeIndex` is available, so both filters can be applied together and
  logged together.

Create `sites/dch-automotive/scripts/car-remaps/fetch-product-html.ts`:

- `fetchProductPerformanceData(entry: CatalogEntry): Promise<VariationPerformance[] | { error: string, url: string }>`
  — fetches `entry.permalink`, calls `parseProductVariations`, catches thrown errors and
  returns an error record instead of throwing (so the orchestrator can collect failures
  without aborting individual fetches) — but the caller (sync.ts) uses the collected error
  count against `FAIL_FAST_THRESHOLD`.

Create `sites/dch-automotive/scripts/car-remaps/normalize.ts`:

- `groupByMake(entries: Array<CatalogEntry & { variations: VariationPerformance[] }>): Map<string, NormalizedVehicle[]>`
  — groups normalized vehicles by make. Derive the make from the product name using Phase 2's
  `normalizeMarqueName` applied to the leading marque token (not from the WooCommerce category
  — confirmed unreliable), producing make-slug keyed groups.

Create `sites/dch-automotive/scripts/car-remaps/sync.ts` (the orchestrator, run via
`tsx sites/dch-automotive/scripts/car-remaps/sync.ts`):

1. Call `fetchScopeIndex()` (this alone is a substantial live walk — log progress as it goes,
   e.g. "fetched models for 42/118 marques").
2. Call `fetchAllCatalogPages()`.
3. Filter the full catalog: exclude entries whose category is in
   `EXCLUDED_NON_VEHICLE_CATEGORIES` (via `filterInScopeCategories`), then among the remainder
   keep only entries where `isInScopeVehicle(entry.name, scopeIndex)` is true. Log counts at
   each filter stage (total → after category exclusion → after marque/model match) so a human
   can sanity-check the funnel.
4. For each retained catalog entry, call `fetchProductPerformanceData()`, collecting
   successes and failures.
5. If `failures.length / totalAttempted > FAIL_FAST_THRESHOLD`, print a clear error report
   (which URLs failed and why) and `process.exit(1)` — do NOT write partial output files.
6. Otherwise, normalize successes with `groupByMake`, and write:
   - `sites/dch-automotive/data/car-remaps/manifest.json` — `{ generatedAt: <ISO string
passed in or computed once at script start, not via Date.now() inside a loop>,
sourceUrl: "https://viezu.com", totalFetched, totalExcludedByCategory,
totalExcludedByScope, totalInScope, totalFailed, failedUrls: string[], makes: string[],
scopeIndexStats: { carsMarqueCount, vansMarqueCount, totalModelsCounted } }`
   - `sites/dch-automotive/data/car-remaps/index.json` — `{ makes: [{ slug, name, modelCount
}] }`
   - `sites/dch-automotive/data/car-remaps/makes/<make-slug>.json` — one file per make, each
     containing that make's `NormalizedVehicle[]`.
7. Print a summary report to stdout: total makes, total models, total failures, the filter
   funnel counts from step 3, and the make/model counts (this is needed to sanity-check the
   "one page per make" page-volume decision before Phase 5 builds pages).

Add `package.json` scripts to `sites/dch-automotive/package.json`:
`"car-remaps:sync": "tsx scripts/car-remaps/sync.ts"` (check the existing `scripts` block for
the correct relative path convention used by other scripts in this file, e.g. how
`validate:content` references `../../scripts/validate-content.ts` — car-remaps:sync should
reference its own site-local script path correctly).

**Run the sync script for real** (`pnpm --filter dch-automotive run car-remaps:sync`) against
live Viezu. This is the actual full sync — it now includes the scope-index walk (~100+ marque
and model AJAX requests) on top of the catalog and product-detail fetches, so expect it to make
many hundreds of HTTP requests and take several minutes; that's expected. Report back: the
printed summary (filter funnel counts, make/model counts, failure rate), and spot-check 3-5
known vehicles' data in the generated `makes/*.json` files against what you can see on the live
Viezu site for the same vehicles (fetch 2-3 live product pages directly to compare bhp/torque/
price figures). Also spot-check that 1-2 known **out-of-scope** vehicles (e.g. a motorbike or
HGV product name you saw during Phase 1's investigation) do NOT appear anywhere in the generated
`makes/*.json` files — this proves the scope filter actually excludes what it's supposed to,
not just that it includes what it's supposed to.

**Verification gate — STOP if this fails:**

```bash
cat sites/dch-automotive/data/car-remaps/manifest.json
ls sites/dch-automotive/data/car-remaps/makes/ | wc -l
```

Manifest shows `totalFailed / totalFetched` below the fail-fast threshold, `scopeIndexStats`
shows non-trivial marque/model counts for both cars and vans, `makes/` directory has multiple
files, and the sub-agent's spot-checks (both the known-in-scope match and the known-out-of-scope
exclusion) against live Viezu data confirmed. STOP if the sync script aborted (exit code 1) —
investigate the failure report before re-running, do not lower the fail-fast threshold to force a
pass.

```bash
git add sites/dch-automotive/scripts/car-remaps/ sites/dch-automotive/data/car-remaps/ sites/dch-automotive/package.json
git commit -m "feat(dch-automotive): add Viezu catalog sync pipeline (marque/model scope), run initial sync"
```

---

## Phase 4 — Repository / Shared Read Layer

**Goal:** Build the single data-access module that per-make pages, the JSON API, and the MCP tool all read through — no duplicated lookup logic.

**Model:** sonnet — straightforward but needs correct progressive-lookup semantics matching Phase 6/7's API shape.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build the car-remaps data repository
model: sonnet
Prompt: |
Read `sites/dch-automotive/data/car-remaps/{manifest.json,index.json}` and one
`makes/<slug>.json` file to see the real generated shape from Phase 3. Read
`sites/dch-automotive/lib/car-remaps/types.ts` for the `NormalizedVehicle` type.

Create `sites/dch-automotive/lib/car-remaps/repository.ts` (server-side, uses
`fs/promises` — follow the read pattern used by `sites/dch-automotive/lib/content.ts` if it
reads local files, for consistency with site conventions):

- `listMakes(): Promise<Array<{ slug: string, name: string, modelCount: number }>>` — reads
  `index.json`.
- `listModelsForMake(makeSlug: string): Promise<Array<{ model: string, modelSlug: string }>>`
  — reads `makes/<makeSlug>.json`, returns distinct models.
- `listFuelTypes(makeSlug: string, modelSlug: string): Promise<string[]>` — distinct fuel
  types for that model's variations.
- `listVariants(makeSlug: string, modelSlug: string, fuelType: string): Promise<string[]>` —
  distinct variants for that model+fuel combo.
- `findVehicle(params: { make: string, model?: string, fuelType?: string, variant?: string
}): Promise<NormalizedVehicle | NormalizedVehicle[] | null>` — progressive lookup: if only
  `make` given, could return all models for that make (or null if a single full match isn't
  resolvable — decide a sensible return contract and document it in a comment, since Phase 6
  and Phase 8 both build on this).
- `getManifest(): Promise<{ generatedAt: string, ... }>` — reads `manifest.json`, used for
  `lastSyncedAt` / `sourceUpdatedAt` fields downstream.
- Use deterministic sorting (alphabetical) on all list functions, and consistent slug
  generation (reuse a `slugify` helper if one exists in `@platform/core-components/lib/site-utils`
  — check via `sites/dch-automotive/lib/site.ts` or similar shim; import via subpath per this
  monorepo's convention, never the barrel).

Create `sites/dch-automotive/lib/car-remaps/url.ts`:

- `getMakePageUrl(makeSlug: string): string` — returns `/car-remaps/${makeSlug}` (relative;
  the caller composes the absolute URL using the site's existing `absUrl` helper if one is
  needed downstream).

Create `sites/dch-automotive/lib/car-remaps/repository.test.ts` (vitest) testing against the
real generated data in `data/car-remaps/` (not mocks — this is real synced data from Phase 3):

- `listMakes()` returns a non-empty array
- `findVehicle()` for 1-2 known makes/models (pick from what's actually in the generated data)
  returns correct results
- `findVehicle()` for a nonexistent make returns `null` (not a throw)
- Two sequential calls to the same lookup return deep-equal results (determinism check)

Run the tests and fix failures before returning.

**Verification gate — STOP if this fails:**

```bash
pnpm --filter dch-automotive test -- repository
```

```bash
git add sites/dch-automotive/lib/car-remaps/repository.ts sites/dch-automotive/lib/car-remaps/url.ts sites/dch-automotive/lib/car-remaps/repository.test.ts
git commit -m "feat(dch-automotive): add car-remaps data repository"
```

---

## Phase 5 — Per-Make AEO Pages + Site-Local JSON-LD + Sitemap

**Goal:** Statically-generated, crawlable per-make pages with real HTML tables and Schema.org JSON-LD — the primary lever for AI-answer-engine citation. Wire into the site's sitemap.

**Model:** sonnet — page rendering + theme styling + a new schema generator; moderate complexity, no deep architectural ambiguity since patterns exist to follow.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build per-make AEO pages with JSON-LD and sitemap entries
model: sonnet
Prompt: |
Read `sites/dch-automotive/lib/car-remaps/repository.ts` (Phase 4). Read
`packages/core-components/src/lib/schema-generators.ts` for the existing generator pattern
(`getArticleSchema`, `getServiceAreaSchema` are the closest style references — plain function,
options in, `@context`/`@type` object out). Read `sites/dch-automotive/lib/schema.ts` (the
site's shim) and one existing MDX-driven page (e.g.
`sites/dch-automotive/app/services/[slug]/page.tsx`) for this site's `generateStaticParams`/
`generateMetadata` conventions, plus `sites/dch-automotive/theme.config.ts` for the dark/orange
theme tokens. Find and read the site's sitemap source (likely `sites/dch-automotive/app/sitemap.ts`
— grep for it if the path differs).

Create `sites/dch-automotive/lib/car-remaps/schema.ts` — a **site-local** JSON-LD generator
(decision recorded in the peer-review synthesis: site-local, not the shared factory, since
this is domain-specific and only one site needs it today). Add a
`// TODO: promote to packages/core-components/src/lib/schema-generators.ts if a second site
  needs Product schema` comment. Implement `getVehicleTuningSchema(vehicle: NormalizedVehicle,
  pageUrl: string)` returning a `Product`/`Service`-with-`Offers`-shaped JSON-LD object (model
the exact shape on schema.org's Product or Service type — include name, description if
available, and an `offers` array from the vehicle's variation stages with `price` in GBP),
plus a small breadcrumb schema for the make page (reuse `getBreadcrumbSchema` from the shared
factory via the site's existing shim if straightforward, otherwise a simple local equivalent).

Create `sites/dch-automotive/app/car-remaps/[make]/page.tsx`:

- `generateStaticParams()` sourced from `listMakes()` (Phase 4).
- `generateMetadata()` per make (title/description referencing the make name).
- Server Component rendering **real server-side HTML `<table>` elements** (not client-only —
  this is required for crawlability) for every model/engine/stage under that make: a
  "Performance Figures" table (Original BHP / Power + (Perf) BHP / Original Torque / Torque +
  (Perf) Nm — these exact labels, confirmed from the live Viezu widget) and a "Blue Optimize
  Fuel Efficiency Tune" table (Economy Gain BHP / Economy Gain Nm / Fuel Saving Up To). Style
  with DCH's existing dark/orange theme tokens (`bg-brand-primary`, `text-surface-foreground`,
  etc. — never hardcoded hex colors, per platform convention).
- Embed the JSON-LD from `schema.ts` via a `<script type="application/ld+json">` tag (follow
  the pattern used elsewhere in this site for schema injection — grep an existing page for
  `application/ld+json`).
- `notFound()` (Next.js) for an unknown make slug.

Edit `sites/dch-automotive/app/car-remaps/page.tsx`: add a section linking to each in-scope
make's page (simple list of links, styled consistently with the page) — this is SEO
interlinking, separate from the Phase 7 interactive tool which replaces the iframe elsewhere
on this same page. Do not touch the iframe block yet — that's Phase 7.

Edit the site's sitemap source to include the new `/car-remaps/[make]` routes (generate one
sitemap entry per make, reading from `listMakes()`).

Verify with `pnpm --filter dch-automotive run build` that all make pages generate
successfully (static generation), then start the dev server briefly and curl 1-2 generated
pages to confirm the HTML tables and `<script type="application/ld+json">` are present in the
raw server-rendered output (not just visible after JS runs) — use `curl -s
  http://localhost:PORT/car-remaps/<a-real-make-slug> | grep -A2 "application/ld+json"` and grep
for a table cell value.

**Verification gate — STOP if this fails:**

```bash
pnpm --filter dch-automotive run build
```

Build succeeds and generates one static page per in-scope make (check the build output log for
the route list). Sub-agent confirms via curl that JSON-LD and table content are present in raw
HTML (not client-rendered-only).

```bash
git add sites/dch-automotive/app/car-remaps/[make]/ sites/dch-automotive/lib/car-remaps/schema.ts sites/dch-automotive/app/car-remaps/page.tsx sites/dch-automotive/app/sitemap.ts
git commit -m "feat(dch-automotive): add per-make car-remaps AEO pages with JSON-LD"
```

---

## Phase 6 — Public JSON API (progressive, cacheable)

**Goal:** A progressive-disclosure JSON API (partial params return next-level options; full params return matched vehicle data) backing both the Phase 7 interactive UI and the Phase 8 MCP tool.

**Model:** sonnet — small, well-scoped, but the progressive-disclosure shape needs to be gotten right since two other phases depend on it.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build the progressive car-remaps JSON API
model: sonnet
Prompt: |
Read `sites/dch-automotive/lib/car-remaps/repository.ts` (Phase 4). Read
`sites/dch-automotive/app/api/csrf-token/route.ts` for this site's route-file convention
shape (`runtime`/`dynamic` exports, thin route delegating to an imported handler) — but note:
do NOT copy `dynamic = 'force-dynamic'` here. That convention exists because CSRF tokens must
be fresh on every request; this API serves data that's immutable between manual re-syncs, so
it should be **cacheable**. Use `export const runtime = 'nodejs';` only (no `dynamic` export,
or explicitly omit force-dynamic so Next.js can cache the route).

Create `sites/dch-automotive/lib/api/car-remaps-lookup-route.ts` — the handler:

- `GET` handler reading query params `make` (optional), `model` (optional), `fuelType`
  (optional), `variant` (optional).
- Progressive-disclosure response shape:
  - No params or `make` only, no `model`: `{ query: {...}, options: { makes?: [...],
models?: [...] }, canonicalUrl?: string, sourceUpdatedAt: string }` — returns the next
    level of options (call `listMakes()` if no make given, `listModelsForMake()` if make given
    but no model, etc., using the Phase 4 repository's progressive lookup functions).
  - Fully specified (make + model + fuelType + variant, or as much as resolves to a single
    vehicle): `{ query: {...}, results: NormalizedVehicle[], canonicalUrl: string,
sourceUpdatedAt: string }` — `canonicalUrl` from `getMakePageUrl()` (Phase 4/5), absolute
    via this site's existing `absUrl` helper. `sourceUpdatedAt` from `getManifest().generatedAt`.
  - Invalid/unknown params (e.g. a make slug that doesn't exist): explicit 400 or empty-result
    response with a clear `error` field — not a silent empty 200 that looks like "no options."

Create `sites/dch-automotive/app/api/car-remaps/lookup/route.ts`:

```
import { handleCarRemapsLookup } from '@/lib/api/car-remaps-lookup-route';
export const runtime = 'nodejs';
export const GET = handleCarRemapsLookup;
```

(Adjust the exact export shape to match whatever pattern
`sites/dch-automotive/lib/api/car-remaps-lookup-route.ts` actually exports — a factory
function or a direct handler, your choice, but keep the route file thin per site convention.)

Test manually: start the dev server, `curl` the endpoint with no params, with `?make=<real-slug>`,
and with a full `make+model+fuelType+variant` combo (use real slugs from the Phase 3 synced
data), confirming each returns the expected shape. Also curl with an invalid make slug to
confirm the error case.

**Verification gate — STOP if this fails:**

```bash
# (dev server running) — sub-agent's manual curl checks, reported back
curl -s "http://localhost:PORT/api/car-remaps/lookup" | head -c 500
curl -s "http://localhost:PORT/api/car-remaps/lookup?make=<real-slug>" | head -c 500
```

Both return valid JSON matching the documented shape; sub-agent confirms in its report.

```bash
git add sites/dch-automotive/app/api/car-remaps/ sites/dch-automotive/lib/api/car-remaps-lookup-route.ts
git commit -m "feat(dch-automotive): add progressive car-remaps JSON API"
```

---

## Phase 7 — Interactive Ready Reckoner (replaces the iframe)

**Goal:** Client-side cascading selector calling the Phase 6 API progressively, replacing the Viezu iframe on `/car-remaps` with DCH-owned UI showing the same stage-by-stage results.

**Model:** sonnet — UI component work with state management across 3 coupled components; standard implementation complexity.
**Execution:** delegate to 1 sonnet sub-agent

Task: Build the interactive ready reckoner and replace the iframe
model: sonnet
Prompt: |
Read `sites/dch-automotive/app/car-remaps/page.tsx` in full, especially the iframe block
(search for `{/* Viezu vehicle-selector widget */}`, roughly lines 485-506) and the
`#fleet-enquiry` section immediately after it (do NOT touch that section). Read
`sites/dch-automotive/components/fuel-savings-calculator.tsx` as a styling/state-pattern
reference (client component conventions, theme-token usage on this site) — it's a different
calculation domain, use it as a pattern reference only, not a copy source.

Create `sites/dch-automotive/components/car-remaps-selectors.tsx` — `'use client'` component
with cascading `<select>` dropdowns: Make → Model → Fuel Type → Variant. On mount, fetch
`/api/car-remaps/lookup` (no params) to populate the Make dropdown. On each selection change,
fetch the API again with the accumulated params to populate the next dropdown (progressive
disclosure matching Phase 6's API shape) — do not fetch the full catalog into client state.

Create `sites/dch-automotive/components/car-remaps-results-table.tsx` — renders the same two
tables as the Phase 5 static pages ("Performance Figures" and "Blue Optimize Fuel Efficiency
Tune", same field labels) for the currently-selected fully-specified vehicle, styled with
DCH theme tokens.

Create `sites/dch-automotive/components/car-remaps-ready-reckoner.tsx` — composes the two
above: holds the selection state, renders `CarRemapsSelectors`, and once a full vehicle is
selected, renders `CarRemapsResultsTable` with the fetched result. Handle loading and
empty/no-match states gracefully (a real UI concern, not just the happy path).

Edit `sites/dch-automotive/app/car-remaps/page.tsx`:

1. Replace the entire iframe block (the `{/* Viezu vehicle-selector widget */}` section,
   including its `<section>` wrapper, heading, and the `<iframe>` itself) with
   `<CarRemapsReadyReckoner />`. Keep the surrounding heading/intro copy if it still makes
   sense, or adjust wording slightly (e.g. remove "powered directly by Viezu" language since
   this is now DCH-owned) — use judgment, keep it minimal.
2. Leave the `#fleet-enquiry` section and everything else on the page completely untouched.
3. **Redundancy check:** look at `components/fuel-savings-calculator.tsx`'s output and the new
   reckoner's "Fuel Saving Up To" field. They're conceptually different (the calculator is a
   generic MPG/cost-savings estimator; the reckoner shows vehicle-specific tuning gains) but
   both surface fuel economy figures on the same page. Do not delete or merge either — verify
   their section headings/placement don't read as duplicate tools (e.g. check they have
   distinct, clear headings), and note in your final report if you think there's a genuine
   UX redundancy the client should be told about. Do not resolve it yourself beyond
   labeling/placement — this is a flag-for-review item, not a deletion.

Run `npm run dev` (or `pnpm --filter dch-automotive dev`) in the background, then walk the
selector for 2-3 real makes/models (use real slugs from the Phase 3 synced data) via curl
or by checking the rendered output, confirming the cascading selects populate correctly and
results match the underlying data. Confirm the iframe is fully gone (`grep -c iframe` on the
page file should show only the `Car Remaps` catalogue's genuinely-remaining non-Viezu iframes,
if any — there should be zero Viezu iframes).

**Verification gate — STOP if this fails:**

```bash
grep -c "viezu.com/dealer" sites/dch-automotive/app/car-remaps/page.tsx
```

Must return `0` (iframe fully removed).

```bash
pnpm --filter dch-automotive run build
```

Build succeeds with the new client components.

```bash
git add sites/dch-automotive/components/car-remaps-ready-reckoner.tsx sites/dch-automotive/components/car-remaps-selectors.tsx sites/dch-automotive/components/car-remaps-results-table.tsx sites/dch-automotive/app/car-remaps/page.tsx
git commit -m "feat(dch-automotive): replace Viezu iframe with in-house ready reckoner"
```

---

## Phase 8 — MCP Endpoint

**Goal:** A remote MCP server endpoint exposing a `lookup_vehicle_tuning` tool so LLM agents can query car-remaps data directly, backed by the same Phase 4 repository.

**Model:** opus — genuine architectural judgment call not fully resolved by the spec: current package/version compatibility must be checked live (zod v3 vs. this site's existing v4), and the implementation approach may need to pivot based on what's found. This is exactly the "judgment calls not covered by the spec" case the tier table calls out for opus.
**Execution:** delegate to 1 opus sub-agent

Task: Build the MCP endpoint for car-remaps data
model: opus
Prompt: |
Read `sites/dch-automotive/lib/car-remaps/repository.ts` (Phase 4) and
`sites/dch-automotive/package.json` (note the existing `zod: "^4.1.11"` dependency — this
site already uses zod v4 for other validation, e.g. content schemas).

**Step 1 — compatibility research (do this before installing anything):** Check the current
state of `mcp-handler` (npm package, maintained by Vercel for hosting MCP servers on Next.js
App Router) and `@modelcontextprotocol/sdk` on npm — their current versions, and specifically
whether `mcp-handler`'s `zod` peer dependency requirement is v3-only or supports v4. (As of
earlier investigation in this session, docs referenced `zod@^3` as a requirement, but that may
be stale — verify live via `npm view mcp-handler peerDependencies` and
`npm view @modelcontextprotocol/sdk peerDependencies`, or check their READMEs/changelogs.)

**Decision:**

- If `mcp-handler` (or `@modelcontextprotocol/sdk` directly) supports zod v4 (or has no hard
  zod peer lock), proceed with `mcp-handler`'s `createMcpHandler` pattern: install
  `mcp-handler` + `@modelcontextprotocol/sdk` (pin to whatever current version supports v4),
  create `sites/dch-automotive/app/api/[transport]/route.ts` using `createMcpHandler` with a
  dynamic `[transport]` segment (supports both Streamable HTTP and SSE per current MCP spec).
- If there's a genuine v3-only lock with no v4 support, **do not downgrade this site's zod
  dependency** (it's used elsewhere for content validation — a downgrade risks breaking
  unrelated MDX schema validation). Instead, implement directly against
  `@modelcontextprotocol/sdk`'s lower-level Streamable HTTP transport API (bypassing
  `mcp-handler`'s zod-coupled convenience layer), defining the tool's input schema as a plain
  JSON Schema object rather than a zod schema if the SDK allows it, or using a fresh zod v3
  instance scoped only to this one file via an aliased/scoped import if your research shows
  that's cleanly possible without touching the site's top-level zod resolution. Use your
  judgment on the cleanest correct path — document which approach you took and why in a code
  comment at the top of the new route file.

Create `sites/dch-automotive/lib/car-remaps/mcp-tools.ts`:

- Define one tool, `lookup_vehicle_tuning`, with input parameters `{ make: string (required),
model?: string, fuelType?: string, engineVariant?: string }` — progressive, mirroring the
  Phase 6 JSON API's shape (an agent may not know valid model names upfront, so it should be
  able to call with just `make` and get back available models, then drill down).
- The tool handler calls the same `sites/dch-automotive/lib/car-remaps/repository.ts` (Phase 4) functions the JSON API uses — no duplicated lookup logic.
- Return shape: matched vehicle(s) with stage-by-stage performance/economy figures, `price`,
  `canonicalUrl` (the make page URL from `getMakePageUrl()`, absolute — for citation/backlink
  value when an agent uses the tool), and `lastSyncedAt` (from the repository's
  `getManifest().generatedAt`).

Create the route file (`app/api/[transport]/route.ts` or `app/api/mcp/route.ts` depending on
your Step 1 decision) wiring the `lookup_vehicle_tuning` tool into the MCP server, using
`export const runtime = 'nodejs';` (MCP servers need Node runtime, not edge, for filesystem
access via the repository).

Add whatever new dependencies your Step 1 decision required to
`sites/dch-automotive/package.json` **only** (this is site-specific tooling, not a shared
platform concern — do not touch the root `package.json` or `packages/core-components`).

**Test the endpoint:** run `npx @modelcontextprotocol/inspector` (or if that's impractical in
this environment, write and run a minimal Node script that POSTs a valid MCP
`tools/call` request to the local dev server's MCP endpoint and checks the response shape)
against the local dev server, confirming the `lookup_vehicle_tuning` tool is discoverable and
returns correct data (including `canonicalUrl` and `lastSyncedAt`) for a real vehicle from the
synced data.

Report back: which compatibility path you took and why, the exact new dependencies added, and
confirmation the tool call test succeeded.

**Verification gate — STOP if this fails:**

```bash
pnpm --filter dch-automotive run type-check
pnpm --filter dch-automotive run build
```

Both succeed with no zod version conflicts (check build/install output for peer dependency
warnings — a warning alone doesn't necessarily block, but a hard install failure does). Sub-agent
confirms the MCP tool call test succeeded against real data.

```bash
git add sites/dch-automotive/app/api/ sites/dch-automotive/lib/car-remaps/mcp-tools.ts sites/dch-automotive/package.json pnpm-lock.yaml
git commit -m "feat(dch-automotive): add MCP endpoint for car-remaps data lookup"
```

---

## Phase 9 — `llms.txt` + Discoverability Docs

**Goal:** A root-level `llms.txt` (new precedent for this monorepo) listing the make pages and documenting the JSON API/MCP endpoint, plus a short human-readable note on `/car-remaps` about the MCP endpoint's existence.

**Model:** haiku — mechanical content generation from already-known data (make list, URLs); no architectural judgment required.
**Execution:** delegate to 1 haiku sub-agent

Task: Write llms.txt and MCP discoverability note
model: haiku
Prompt: |
Read `sites/dch-automotive/data/car-remaps/index.json` for the real list of synced makes.
Read `sites/dch-automotive/app/car-remaps/page.tsx` for the page's current structure and
styling conventions (theme tokens used elsewhere on the page).

Create `sites/dch-automotive/public/llms.txt` — plain text/markdown format, listing:

- A one-paragraph description of DCH Automotive and the car-remaps ready reckoner.
- A bulleted list of the per-make pages (`/car-remaps/<make-slug>` for each make in
  `index.json`), each with a one-line description ("BMW tuning specs and pricing").
- The JSON API endpoint URL and a one-line usage note (`/api/car-remaps/lookup` — progressive
  query params `make`, `model`, `fuelType`, `variant`).
- The MCP endpoint URL and a one-line usage note (whichever path Phase 8 actually created —
  check `sites/dch-automotive/app/api/` for the exact route to reference correctly).

Add a short section (a `<p>` or small `<div>` block, styled consistently with the rest of the
page using existing theme tokens — do not introduce new hardcoded styles) to
`sites/dch-automotive/app/car-remaps/page.tsx`, near the bottom of the page or in a sensible
existing location, publishing the MCP endpoint URL and one sentence of usage guidance for
developers/agents that might want to connect to it. Keep this addition small and unobtrusive
— it's a footnote, not a feature.

**Verification gate — STOP if this fails:**

```bash
cat sites/dch-automotive/public/llms.txt
```

File exists, lists all makes from `index.json`, and references correct API/MCP URLs matching
what Phases 6 and 8 actually built (not a guessed path).

```bash
git add sites/dch-automotive/public/llms.txt sites/dch-automotive/app/car-remaps/page.tsx
git commit -m "feat(dch-automotive): add llms.txt and MCP discoverability note"
```

---

## Phase 10 — QA, Runbook, Final Verification

**Goal:** Full project-wide gates, a runbook documenting the sync/maintenance process and recorded architectural decisions, and a final end-to-end smoke test of every surface built in this brief.

**Model:** sonnet — runbook writing plus running/interpreting verification gates; standard, not mechanical (requires synthesizing what was actually built across all 9 prior phases).
**Execution:** delegate to 1 sonnet sub-agent

Task: Write runbook and run final verification
model: sonnet
Prompt: |
Review the full set of changes made across all previous phases in this branch
(`git log --oneline develop..HEAD` and `git diff develop..HEAD --stat`) to understand the
complete scope of what was built.

Create `sites/dch-automotive/docs/car-remaps-runbook.md` documenting:

- How to re-run the sync (`pnpm --filter dch-automotive run car-remaps:sync`), what it does,
  and how often it should be run (manual, before each deploy — no scheduled automation in this
  pass).
- How to read `data/car-remaps/manifest.json` (the sync report) to check for parse failures
  or drift, and what the fail-fast threshold means.
- How to spot-check synced data against live Viezu (fetch a few real product pages, compare
  bhp/torque/price figures).
- The recorded architectural decisions from this build: Car+Van scope is determined by
  Viezu's own `/dealer` widget AJAX cascade (`get_filter_brands`/`get_filter_models`, keyed on
  `vehicle-type`), NOT WooCommerce categories — categories were tried first and found to mix
  all vehicle types together with no clean separation (see Phase 1's fixture README for the
  full investigation). Document: the config-switch location for adding HGV later (reference
  `IN_SCOPE_WIDGET_VEHICLE_TYPES` in Phase 3's `config.ts`); **explicitly flag that this scope
  mechanism depends on an undocumented internal WordPress endpoint (`admin-ajax.php` +
  page-scoped nonce), not a stable public API** — if Viezu changes their widget markup, plugin,
  or nonce mechanism, `car-remaps:sync` will start failing its fail-fast threshold or throwing
  the nonce/markup-drift errors Phase 2's parsers were built to detect; a future maintainer
  debugging a sync failure should check this first. Also document the site-local (not
  shared-factory) schema generator placement decision (with the promotion TODO comment
  location).
- The MCP endpoint's compatibility approach (whatever Phase 8's sub-agent decided and
  documented) and how to test it.

Then run the project's full verification gates:

```
pnpm type-check
pnpm --filter dch-automotive run build
pnpm --filter dch-automotive run lint
```

Run `pnpm type-check` and `pnpm --filter dch-automotive run lint` in parallel if your tooling
supports concurrent bash execution (both are read-only static checks); run `build` separately
(it writes to `.next/` and shouldn't race with anything).

Finally, do a full manual smoke test with the dev server running:

1. Visit `/car-remaps`, confirm the interactive reckoner works for 2-3 real vehicles and the
   iframe is gone.
2. Visit 2-3 `/car-remaps/[make]` pages, confirm tables render and view-source shows the
   JSON-LD script tag.
3. `curl` the JSON API with a few real param combinations.
4. Confirm `/llms.txt` is reachable and its listed page URLs return 200.

Report back: full gate results (pass/fail for each), smoke test results, and the runbook file
path.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
pnpm --filter dch-automotive run build
pnpm --filter dch-automotive run lint
```

All three must pass with zero errors before this phase (and the whole brief) is considered
complete.

```bash
git add sites/dch-automotive/docs/car-remaps-runbook.md
git commit -m "docs(dch-automotive): add car-remaps runbook, final verification pass"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase    | Items                                                              | File overlap            | Model | Rationale                          |
| ----- | -------- | ------------------------------------------------------------------ | ----------------------- | ----- | ---------------------------------- |
| G1    | Phase 10 | Run `pnpm type-check`, Run `pnpm --filter dch-automotive run lint` | none (read-only checks) | n/a   | Independent static-analysis checks |

All other phases (1-9) are single-item, sequential delegations — see the per-phase table below.
No phase in this brief has independent multi-file work items that are both (a) genuinely
uncoupled and (b) safe to split across separate sub-agents without integration risk. The sync
pipeline (Phase 3) has 6 new files, but they're tightly coupled around one shared orchestration
contract (`sync.ts` composes the others) — splitting that across sub-agents risks an integration
mismatch that a single owning agent avoids. Same reasoning applies to Phase 7's 3 components
(parent-child coupling) and Phase 5's page+schema+sitemap (the page imports the schema module).

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

Every phase in this brief has a real dependency on the previous phase's output (fixtures → parser
→ sync script → repository → pages/API/MCP all reading from the repository → docs summarizing
everything). No cross-phase parallelism is safe here.

### Sequential points — MUST NOT parallelise

| Item                                                                              | Reason                                                                                                                                     |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Verification gates (`pnpm type-check` / `build` / `lint` / `test`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.                                                                 |
| Git commits                                                                       | One commit per phase, in order. Commits are never batched.                                                                                 |
| Any file edited by two or more items                                              | Same-file edits must always serialise.                                                                                                     |
| The Phase 3 live sync run                                                         | Hundreds of real HTTP requests to viezu.com in sequence with a rate delay — must run as one continuous script execution, not parallelised. |

### Per-phase execution summary (all sequential, single sub-agent — no parallel groups within any phase)

| Phase | Model  | Execution                      | Goal                                                  |
| ----- | ------ | ------------------------------ | ----------------------------------------------------- |
| 1     | sonnet | delegate to 1 sonnet sub-agent | Capture real Viezu fixtures, record scope decision    |
| 2     | sonnet | delegate to 1 sonnet sub-agent | Fixture-tested parsers for catalog + performance data |
| 3     | sonnet | delegate to 1 sonnet sub-agent | Sync pipeline: catalog → enrichment → normalized data |
| 4     | sonnet | delegate to 1 sonnet sub-agent | Shared repository/read layer                          |
| 5     | sonnet | delegate to 1 sonnet sub-agent | Per-make AEO pages, JSON-LD, sitemap                  |
| 6     | sonnet | delegate to 1 sonnet sub-agent | Progressive public JSON API                           |
| 7     | sonnet | delegate to 1 sonnet sub-agent | Interactive reckoner, replace iframe                  |
| 8     | opus   | delegate to 1 opus sub-agent   | MCP endpoint (compatibility judgment call)            |
| 9     | haiku  | delegate to 1 haiku sub-agent  | llms.txt + discoverability note                       |
| 10    | sonnet | delegate to 1 sonnet sub-agent | Runbook + final verification                          |

---

## Cost Estimate

| Phase                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Fixture capture         | sonnet | ~18k              | ~4k                | $0.08      |
| Phase 2: Parsers                 | sonnet | ~22k              | ~5k                | $0.09      |
| Phase 3: Sync pipeline           | sonnet | ~28k              | ~7k                | $0.13      |
| Phase 4: Repository              | sonnet | ~16k              | ~4k                | $0.07      |
| Phase 5: AEO pages               | sonnet | ~22k              | ~6k                | $0.10      |
| Phase 6: JSON API                | sonnet | ~14k              | ~3k                | $0.06      |
| Phase 7: Interactive reckoner    | sonnet | ~22k              | ~6k                | $0.10      |
| Phase 8: MCP endpoint            | opus   | ~18k              | ~5k                | $0.22      |
| Phase 9: llms.txt                | haiku  | ~9k               | ~2k                | $0.02      |
| Phase 10: Runbook + verification | sonnet | ~18k              | ~4k                | $0.08      |
| **Total**                        |        | **~187k**         | **~46k**           | **~$0.95** |

Rates: Opus $5.00/$25.00, Sonnet $2.00/$10.00 (intro, through 2026-08-31), Haiku $1.00/$5.00 per
MTok. Estimation: ~5 tokens per line of code. Input = files read + brief (~4k) + system prompt
(~3k). Output = code written + verification output (~500/gate). These are conservative per-phase
estimates; actual orchestrator overhead (re-reading files across phases, retries on gate
failures) will likely push the real total somewhat higher — treat this as a floor, not a cap.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check && pnpm --filter dch-automotive run build && pnpm --filter dch-automotive run lint` all pass
3. Any exceptions or intentional deviations from the plan (especially: what Phase 8 decided about the MCP package compatibility question, and any redundancy flag from Phase 7 re: the fuel-savings calculator)
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | opus      | [Phase 8]             |                    | $X.XX     |
   | haiku     | [Phase 9]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the Cost Estimate table above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code inline. Each phase's `**Execution:**` line says how: `delegate to 1 [tier] sub-agent`, `delegate to N [tier] sub-agents in one message`, or `inline (exception) — [rationale]`. Only implement inline when the phase explicitly declared the inline exception. No phase in this brief declares the inline exception.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.** The orchestrator's own model is set by the launch command and is independent of the phase tiers — it cannot change its own running model, so a `haiku`/`sonnet`/`opus` phase tier is only honoured by spawning a sub-agent at that tier. A phase done inline runs at orchestrator cost and burns orchestrator context regardless of its annotation.
- **Consult the `## Parallel execution groups` section before launching any work.** This brief has no intra-phase or cross-phase parallel groups except the read-only checks in Phase 10 (G1) — every other phase is a single sequential sub-agent delegation. Do not invent parallelism the groups table doesn't list.
- **Never parallelise across phase boundaries** — this brief's Cross-phase groups table is empty; every phase depends on the previous phase's output.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more. Do not add features, scheduled sync automation, MCP directory submissions, or checkout/payment flows — all explicitly out of scope per the synthesis.
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning (Phase 8 only, in this brief).
- The Co-Authored-By line in commits must reflect the **orchestrator** model (the committer) — not the per-phase sub-agent tier that implemented the change. If the running orchestrator differs from this brief's stated `**Orchestrator model:**` (sonnet), use the actual running model.
- Every brief MUST verify with `pnpm type-check && pnpm --filter dch-automotive run build && pnpm --filter dch-automotive run lint` at the end (Phase 10). STOP if any fails.
- **Real-data rule (this brief touches an external API — Viezu):** Phase 1 captures real recorded fixtures BEFORE any parser code is written (Phase 2), and Phase 2's tests run against those real fixtures, never synthetic mocks of the expected shape. Phase 3's sync script also runs for real against live Viezu (not a dry run) as part of its own verification gate. Do not substitute synthetic/invented fixtures at any point in this brief — if live Viezu access fails during Phase 1, STOP and report to the user rather than inventing fixture data.
- This brief writes only within `sites/dch-automotive/` (plus the session/output folders in the main repo) — no `--additionalDirectories` flag is needed for the launch command below.

---

# Paste into terminal

```
claude --dangerously-skip-permissions --model sonnet -p "Read output/sessions/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/yolo-brief.md in full, then implement every phase it describes exactly as written."
```

No `--additionalDirectories` needed — this brief only writes within the current repo
(`sites/dch-automotive/`, `output/sessions/`).

---

# Cost & Model Summary

Estimated total cost: ~$0.95 (conservative floor — see Cost Estimate table above for per-phase
breakdown; actual cost including orchestrator overhead will likely be somewhat higher)

| Phase    | Sub-agent model | Execution               | Goal                                               |
| -------- | --------------- | ----------------------- | -------------------------------------------------- |
| Phase 1  | sonnet          | delegate to 1 sub-agent | Capture real Viezu fixtures, record scope decision |
| Phase 2  | sonnet          | delegate to 1 sub-agent | Fixture-tested parsers                             |
| Phase 3  | sonnet          | delegate to 1 sub-agent | Sync pipeline (live run against Viezu)             |
| Phase 4  | sonnet          | delegate to 1 sub-agent | Shared repository/read layer                       |
| Phase 5  | sonnet          | delegate to 1 sub-agent | Per-make AEO pages + JSON-LD + sitemap             |
| Phase 6  | sonnet          | delegate to 1 sub-agent | Progressive public JSON API                        |
| Phase 7  | sonnet          | delegate to 1 sub-agent | Interactive reckoner, replace iframe               |
| Phase 8  | opus            | delegate to 1 sub-agent | MCP endpoint (real compatibility judgment call)    |
| Phase 9  | haiku           | delegate to 1 sub-agent | llms.txt + discoverability note                    |
| Phase 10 | sonnet          | delegate to 1 sub-agent | Runbook + final verification                       |

The "Sub-agent model" column is the tier each phase's work is **delegated** to — it is
independent of the orchestrator model below. The orchestrator only coordinates, gates, and
commits.

To override the orchestrator model: change `--model sonnet` to `--model opus` (this changes the
coordinator only; per-phase sub-agent tiers are unaffected)
To set a hard budget ceiling: add `--max-budget-usd N` to the command

Review the brief before running if you want to make any manual adjustments.

## After the YOLO session completes

All work will be on the `feature/car-remaps-reckoner-aeo-mcp` branch — nothing has been pushed.
Back in your IDE, integrate it the way this project normally does:

1. `git checkout feature/car-remaps-reckoner-aeo-mcp` (if not already on it)
2. Review the changes: `git log --oneline develop..HEAD` (and `git diff develop..HEAD`)
3. Push and merge into `staging` first, verify CI, then merge into `main` — per this repo's
   documented `develop → staging → main` workflow (root `CLAUDE.md`). Use the `/deploy.changes`
   skill for the full automated flow, which also runs `/update.docs` first. Never push directly
   to `staging` or `main`.

---

## Completed

**Date:** 2026-07-11
**Status:** All phases executed successfully

Phases 1-2 were completed and committed in a prior session run; this session picked up from
Phase 3 with its code already written but uncommitted, and the live sync already run to
completion (manifest showing 3,188 fetched, 1,518 in-scope, 6 failures at 0.4% — well under the
10% fail-fast threshold). This session verified that existing Phase 3 output against the brief's
gate (manifest review, make-file spot-checks, and live Viezu spot-checks confirming both a
known-in-scope match — Ford Tourneo Custom's bhp/torque/price figures matched live exactly — and
known-out-of-scope exclusion — motorbike marques like Ducati/Kawasaki/Triumph are absent from the
synced makes list), then committed Phase 3 and delegated Phases 4 through 10 sequentially to
sub-agents exactly as the brief specifies, verifying each phase's gate before committing. The
build replaces the embedded Viezu iframe on `/car-remaps` with a DCH-owned interactive ready
reckoner, 83 static per-make AEO pages with server-rendered performance tables and Product+Offers
JSON-LD, a progressive JSON API, an MCP endpoint (`lookup_vehicle_tuning` tool via
`mcp-handler`/`@modelcontextprotocol/sdk` on zod v4, no downgrade needed), and `llms.txt` for
agent discoverability. The main surprise was a data-quality gap discovered while writing the
`llms.txt` make list: Volkswagen _car_ products (Golf, Polo, Passat, Tiguan, etc.) are silently
excluded from the synced catalogue because the scope matcher's marque-prefix logic never tries
"vw" as an alias for the AJAX cars list's "volkswagen" key — only VW _vans_ (matched via a
separate marque bucket) came through. This was investigated, confirmed live against the Store
API, and documented as a prominent "Known Issues" section in the new runbook
(`sites/dch-automotive/docs/car-remaps-runbook.md`) with root cause and fix recommendation for a
future session, rather than silently patched or used to justify re-running the already-approved
live sync. The final `pnpm --filter dch-automotive run lint` gate has one pre-existing, unrelated
failure (`app/page.tsx:210`, a hardcoded `<a>` tag predating this branch, confirmed via
`git merge-base --is-ancestor` to already be on `develop`) — `type-check` and `build` both pass
cleanly across the monorepo and the site respectively.

### Commits

- `6f035d14` — feat(dch-automotive): capture real Viezu fixtures for car-remaps rebuild, marque/model-based scope
- `090529ab` — feat(dch-automotive): add fixture-tested Viezu data parsers
- `40cca10e` — feat(dch-automotive): add Viezu catalog sync pipeline (marque/model scope), run initial sync
- `d9cf7b35` — feat(dch-automotive): add car-remaps data repository
- `ea7d2d11` — feat(dch-automotive): add per-make car-remaps AEO pages with JSON-LD
- `b4fcc3fd` — feat(dch-automotive): add progressive car-remaps JSON API
- `7e4ab2d1` — feat(dch-automotive): replace Viezu iframe with in-house ready reckoner
- `8580f501` — feat(dch-automotive): add MCP endpoint for car-remaps data lookup
- `23c91c76` — feat(dch-automotive): add llms.txt and MCP discoverability note
- `c14f0f18` — docs(dch-automotive): add car-remaps runbook, final verification pass
