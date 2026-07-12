# Car Remaps Runbook

Operational guide for the DCH Automotive Car Remaps feature: the Viezu-sourced catalogue sync,
the data it produces, the pages/API/MCP endpoint built on top of it, and the known data-quality
gaps that need follow-up. Written 2026-07-11 at the end of the
`feature/car-remaps-reckoner-aeo-mcp` build; updated same day when HGV scope was added
(`feature/car-remaps-hgv-scope`, see §5). See also:

- `sites/dch-automotive/lib/car-remaps/__fixtures__/README.md` — the full data-shape
  investigation (pipe-delimited fields, category ambiguity, AJAX scope mechanism, marque suffix
  patterns) that every parser and config constant in this feature is built against.
- `output/sessions/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/` — the peer-review synthesis
  and phase-by-phase build notes for this feature.

---

## 1. Re-running the sync

```bash
pnpm --filter dch-automotive run car-remaps:sync
# equivalent, run from sites/dch-automotive/:
npm run car-remaps:sync
```

This runs `scripts/car-remaps/sync.ts` (`tsx`, no build step needed). It performs, in order:

1. **Scope index** (`fetch-marques.ts`) — fetches the live `/dealer` widget page
   (`VIEZU_DEALER_WIDGET_URL` in `scripts/car-remaps/config.ts`) to extract a fresh nonce, then
   walks the `admin-ajax.php` `get_filter_brands` / `get_filter_models` cascade for every
   vehicle type in `IN_SCOPE_WIDGET_VEHICLE_TYPES` (currently `['cars', 'vans', 'hgv-tuning']`),
   building a normalized `(marque, model)` membership index (`ScopeIndex`).
2. **Full catalogue walk** (`fetch-store-api.ts`) — pages through the WooCommerce Store API
   (`/wp-json/wc/store/v1/products`) to fetch every product on the site (currently ~3,188).
3. **Filter** — each product is checked against `EXCLUDED_NON_VEHICLE_CATEGORIES` (unconditional
   exclusion of tools/cables/accessories categories) and then `isInScopeVehicle()` (does the
   product name match a `(marque, model)` pair in the scope index).
4. **Per-product enrichment** (`fetch-product-html.ts`) — fetches each in-scope product's detail
   page and parses its `data-product_variations` attribute for performance/pricing data.
5. **Normalize + write** (`normalize.ts` + `sync.ts`) — groups results by make and writes
   `data/car-remaps/makes/<make-slug>.json`, `data/car-remaps/manifest.json`, and
   `data/car-remaps/index.json`. Any make file left over from a previous run whose marque isn't in
   this run's output is deleted, so `makes/` never accumulates stale files (see §5's "stale make
   files" entry — this was a real bug until 2026-07-11).

A polite `FETCH_DELAY_MS` (400ms) is applied between successive live HTTP requests — a full sync
walks ~3,000+ live URLs (more since HGV scope was added, see §5), so expect it to take a while
(an hour or more), not minutes. Every live fetch has a `FETCH_TIMEOUT_MS` (30s) safety net (see
§5's "sync could hang indefinitely" entry) — a single unresponsive page counts as one more failure
rather than stalling the whole run, but the pipeline still has **no resume/incremental mode**: it's
all-or-nothing by design (matches `FAIL_FAST_THRESHOLD`'s "no partial output" philosophy). If a run
is interrupted or produces a small, isolated gap (e.g. one marque lost to a transient fetch
failure), prefer accepting the gap and documenting it (§5) over re-running the entire ~2,000-request
pipeline to fix a handful of vehicles — a full re-sync is expensive against a live third-party site
and the FAIL_FAST/stale-file safety nets mean a low failure count from one run doesn't corrupt
anything.

### How often to run it

**Manual only, run before each deploy that ships Car Remaps changes.** There is no scheduled
automation (no cron, no GitHub Action) in this pass — a future session could add one, but that
was explicitly out of scope here. Re-run it:

- Before any production deploy, to pick up new/changed Viezu listings.
- Whenever you suspect the live Viezu site has changed (new vehicles added, prices updated).
- After fixing a parser/scope bug (see §5), to regenerate the data files with the fix applied.

The output files (`data/car-remaps/**`) are committed to git — the site reads them at
build/runtime from the repository, not from a live API call. Committing regenerated output is
part of the normal workflow after a sync run.

---

## 2. Reading `manifest.json`

`data/car-remaps/manifest.json` is the sync report — check it after every run.

| Field                     | Meaning                                                                                                                                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generatedAt`             | ISO timestamp of the sync run.                                                                                                                                                                                                                                               |
| `sourceUrl`               | Always `https://viezu.com`.                                                                                                                                                                                                                                                  |
| `totalFetched`            | Total products returned by the Store API walk (all vehicle types, tools, accessories — everything).                                                                                                                                                                          |
| `totalExcludedByCategory` | Products dropped by the unconditional `EXCLUDED_NON_VEHICLE_CATEGORIES` list (tools/cables/accessories/parts).                                                                                                                                                               |
| `totalExcludedByScope`    | Products that passed the category filter but didn't match any `(marque, model)` pair in the scope index — i.e. not a car, van or HGV Viezu currently tunes (bikes, agriculture, marine, motorhomes, or a name the scope matcher failed to recognize).                        |
| `totalInScope`            | Products that made it through to the enrichment step.                                                                                                                                                                                                                        |
| `totalFailed`             | Enrichment fetches that threw (see below) — parse or fetch failures on an otherwise in-scope product.                                                                                                                                                                        |
| `failedUrls`              | The actual URLs that failed, with enough context to investigate individually.                                                                                                                                                                                                |
| `makes`                   | Sorted list of make slugs that got a `data/car-remaps/makes/<slug>.json` file written.                                                                                                                                                                                       |
| `scopeIndexStats`         | `carsMarqueCount`, `vansMarqueCount`, `hgvMarqueCount`, `totalModelsCounted` — sanity-check numbers for the scope index itself (85 car marques, 23 van marques, 66 HGV marques, 2,177 models counted as of the 2026-07-11 HGV-scope run — see §5's "HGV scope added" entry). |

### Fail-fast threshold

`FAIL_FAST_THRESHOLD` in `scripts/car-remaps/config.ts` is currently `0.1` (10%). If the fraction
of in-scope products whose enrichment fetch/parse fails exceeds this threshold, `sync.ts` aborts
**before writing any output files** — you get a clean failure with the list of failed URLs printed
to the console, not a partially-overwritten data directory. This is a safety net against Viezu
changing their product-page markup mid-run and silently corrupting most of the catalogue.

A **low, non-zero** `totalFailed` (well under the 10% threshold) is normal and expected — the
2026-07-11 run had 6 failures out of 1,518 in-scope products (0.4%), all traced to individual
product pages returning HTTP errors or unusual markup (see `failedUrls` in the committed
manifest) rather than a systemic issue. The HGV-scope run (same day, see §5) had 9 failures out of
1,887 (0.5%) — all older HGV/truck listings whose `data-product_variations` attribute didn't
decode to an array, a page-template quirk on a handful of legacy Viezu listings, not a parser bug
(see §5's residual note). Don't chase these to zero; only investigate if:

- The failure rate is climbing across successive runs.
- The failure rate crosses the 10% threshold and the sync aborts.
- A specific failed URL, when checked manually, reveals a markup change worth handling in
  `parseProductVariations()`.

### What "drift" looks like in the manifest

Compare `scopeIndexStats` and `totalInScope` against the previous run's manifest (check `git log
-p -- sites/dch-automotive/data/car-remaps/manifest.json` for history). Red flags:

- `carsMarqueCount` / `vansMarqueCount` dropping sharply — Viezu may have changed the `/dealer`
  widget's marque list, or the nonce/AJAX mechanism broke (see §4's known-issue flag on this
  point).
- `totalInScope` dropping sharply with `totalExcludedByScope` rising — could mean Viezu renamed
  a batch of products (breaking the marque/model name-matching in `isInScopeVehicle()`), or
  could mean a genuine catalogue change upstream. Cross-check against §3 before assuming it's a
  bug.
- `totalFailed` climbing steadily run-over-run even while staying under 10% — an early warning
  the product-detail markup is drifting before it crosses the fail-fast line.

---

## 3. Spot-checking synced data against live Viezu

Manual verification recipe — no tooling required, just a browser and the JSON files:

1. Pick 2–3 real vehicles from different makes, e.g. a BMW, a Ford, and something less common
   like a Dacia.
2. Open the corresponding `data/car-remaps/makes/<make>.json` file and find that vehicle's entry
   — note its `sourceUrl` (the live Viezu product page), `originalBhp`/`powerBhpGain` figures,
   and `displayPriceCents` for a variation.
3. Open that `sourceUrl` directly in a browser (it's a real, live Viezu product page).
4. Compare:
   - **BHP figures** — Viezu's product page shows an "Original BHP" / "Tuned BHP" table per
     fuel type/variant. Confirm the synced `originalBhp.primaryValue` and the gain match what's
     shown live (remember `displayPriceCents` is in **cents**, so divide by 100 for pounds).
   - **Torque figures** — same comparison for `originalTorque` / `torqueNmGain`.
   - **Price** — the live page's displayed remap price for that variation should match
     `displayPriceCents / 100`.
5. Repeat for a make with a Store API `?search=` query to sanity-check the _set_ of models, not
   just one vehicle's figures — e.g. `https://viezu.com/wp-json/wc/store/v1/products?search=golf`
   returns live Volkswagen Golf products; compare that list against
   `data/car-remaps/makes/vw.json` (see §4 — this specific comparison is how the VW gap below
   was found).

If a spot-check figure doesn't match, check first whether Viezu's live page changed _after_ the
last sync (expected — re-run the sync) versus a parsing bug (unexpected — check
`parseProductVariations()` in `lib/car-remaps/parsers.ts` against the live page's HTML).

---

## 4. Architectural decisions recorded during this build

### Scope mechanism: AJAX marque/model cascade, not WooCommerce categories

**Categories were tried first and rejected.** The original plan was a category include-list
(include "Car"/"Van" categories, exclude "HGV"/"Bike"/"Agriculture"/"Marine"/"Motorhome"). Real
investigation (documented in full in
`lib/car-remaps/__fixtures__/README.md`, "Car + Van category scope decision") found this doesn't
work: the two largest vehicle-listing category buckets (`VLF`, `Vehicle Tuning and Remapping`)
mix cars, vans, **and motorbikes** indiscriminately with no clean split, and ~32% of sampled
products have no category at all (including all sampled HGV listings). Category membership is
only reliable for excluding the unambiguous non-vehicle branches (tools, cables, accessories,
performance parts) — never for including/distinguishing vehicle types.

**What replaced it:** Viezu's own `/dealer` widget (the same page previously embedded as an
iframe in `app/car-remaps/page.tsx`) has a cascading `Vehicle Type → Make → Model → Fuel Type →
Variant` selector backed by a WordPress AJAX endpoint
(`admin-ajax.php`, actions `get_filter_brands` / `get_filter_models`), keyed on a `vehicle-type`
param (`cars`, `vans`, `bike-tuning`, `hgv-tuning`, `agriculture-tuning`, `marine`, `motorhomes`).
Each vehicle type returns a clean, disjoint marque list — no motorbikes in `cars` or `vans`,
confirmed live. The sync pipeline walks this cascade for the in-scope vehicle types and builds a
normalized `(marque, model)` membership index (`ScopeIndex`), then matches each Store API
product's **name** against that index (`isInScopeVehicle()` in `lib/car-remaps/parsers.ts`).
Categories are still used, but only for the unconditional tools/cables/accessories exclusion —
never as a vehicle-type include-list.

Full investigation, including the nonce mechanics, the twelve captured cross-check fixtures, and
the marque-suffix normalization patterns: `lib/car-remaps/__fixtures__/README.md`, sections
"Scope mechanism (2026-07-11)" onward.

### Adding HGV (or another vehicle type) later

The scope is a **config switch**, not a plugin system. To bring HGV vehicles into scope:

1. Add `'hgv-tuning'` to `IN_SCOPE_WIDGET_VEHICLE_TYPES` in `scripts/car-remaps/config.ts`
   (currently `['cars', 'vans']`).
2. Re-run `pnpm --filter dch-automotive run car-remaps:sync`.

**Before doing this**, read the fixtures README's marque-collision guardrail (referenced in the
`MARQUE_SUFFIXES` comment in `lib/car-remaps/parsers.ts`): the suffix list used to normalize
marque names must stay an exact, closed set of documented suffixes. A looser pattern would
collapse a distinct marque like `"Ford Truck Tuning & ECU Remapping"` (HGV) down to `"ford"`,
colliding it with the car marque `"Ford"`. If you add `hgv-tuning`, first confirm (via the
`ajax-brands-hgv-check.html` / `ajax-models-ford-truck-264-hgv-tuning.html` cross-check fixtures
already captured, or fresh live fetches) whether HGV marque names introduce any new suffix
pattern not already in `MARQUE_SUFFIXES`, and add it explicitly if so.

### ⚠️ This scope mechanism depends on an undocumented internal endpoint

**Flag this prominently for whoever debugs the next sync failure.** The entire scope-determination
mechanism relies on:

- `admin-ajax.php` — WordPress's generic AJAX entry point, not a documented or versioned public
  API. Viezu (or their plugin vendor) can change the `get_filter_brands`/`get_filter_models`
  action names, their request/response shape, or remove them entirely with no notice and no
  changelog.
- A page-scoped nonce (`custom_product_filter.security`), extracted fresh from the live
  `/dealer` widget page's inline JS on every sync run. This is not a stable credential — it's
  tied to that specific plugin's markup being present on that page in the expected form.

**If `car-remaps:sync` starts failing, check this first**, before assuming a bug in this
repo's code:

- A **nonce/action failure** surfaces as `parseFilterBrandsResponse` / `parseFilterModelsResponse`
  throwing an explicit error about receiving the literal string `-1` — this is WordPress's
  generic AJAX failure response. It means either the nonce extraction broke (the `/dealer` page's
  inline JS changed) or the AJAX action itself was renamed/removed.
- A **markup drift** on the widget page itself (the `<select>`/`<option>` structure changing)
  will surface as "parsed zero `<option>` marques/models from the response" — also an explicit
  throw, not a silent empty result.
- Either failure mode will either abort immediately (scope index build happens in Step 1, before
  any output is written) or, if it degrades more subtly (e.g. some marques/models silently
  missing rather than a hard failure), will show up as the `FAIL_FAST_THRESHOLD` being crossed in
  Step 4, or as a `scopeIndexStats` number that's dropped sharply versus the previous run (see
  §2's drift-detection guidance).
- There is no fallback data source if Viezu removes this widget/plugin entirely — the category
  approach was already investigated and rejected as unworkable (see above). A sync failure of
  this kind would require a fresh investigation into whatever replaces the widget, following the
  same fixture-capture-then-parse methodology documented in
  `lib/car-remaps/__fixtures__/README.md`.

### Site-local schema generator, not the shared factory

`lib/car-remaps/schema.ts` (Product+Offers and breadcrumb JSON-LD for the make pages) is
deliberately **site-local**, not promoted to
`packages/core-components/src/lib/schema-generators.ts`. Rationale (also recorded in the file's
own header comment): Product/vehicle-tuning schema is specific to DCH Automotive's Viezu-sourced,
repository-backed catalogue, and no other site in the platform has an equivalent MDX-free product
catalogue today. The file carries a `TODO: promote to
packages/core-components/src/lib/schema-generators.ts if a second site needs Product schema` —
check this file first if a future site needs similar Product/Offer JSON-LD, rather than
reimplementing it from scratch.

### MCP endpoint: zod v4 compatibility

`app/api/[transport]/route.ts` implements the MCP server using `mcp-handler@1.1.0` and
`@modelcontextprotocol/sdk@1.26.0` directly on this site's existing `zod@^4.1.11` — **no zod
downgrade was needed.** This was verified live via npm before implementation, not assumed:
`@modelcontextprotocol/sdk@1.26.0`'s peer dependency on zod is `^3.25 || ^4.0`, and
`mcp-handler@1.1.0`'s peers (`@modelcontextprotocol/sdk@1.26.0`, `next: >=13`) are satisfied by
this site's existing dependencies. This let the build use the ergonomic `createMcpHandler()` path
with a single root-level zod v4 instance shared by the SDK and the tool's own Zod schema, instead
of hand-rolling the lower-level Streamable HTTP transport or maintaining a second zod version.

**How to test the MCP endpoint:**

- Route file: `app/api/[transport]/route.ts`. Dynamic `[transport]` segment serves both
  Streamable HTTP (`/api/mcp`) and the legacy SSE pair (`/api/sse` + `/api/message`) from one
  handler, `basePath: '/api'`.
- Tool name: `lookup_vehicle_tuning` (exported as `LOOKUP_VEHICLE_TUNING_TOOL_NAME` from
  `lib/car-remaps/mcp-tools.ts`). Progressive input: `make` (required), then optionally `model`,
  `fuelType`, `engineVariant` — omit a field to get back the list of valid values for that level,
  mirroring the JSON API's progressive-disclosure behaviour (they share the same
  `lib/car-remaps/repository.ts` read functions, no duplicated lookup logic).
- Manual test with an MCP-aware client (e.g. Claude Desktop, or any Streamable-HTTP MCP client):
  point it at `http://localhost:3000/api/mcp` (dev) or `https://<production-domain>/api/mcp`,
  call `lookup_vehicle_tuning` with `{ "make": "BMW" }` first to confirm the tool responds with
  a model list, then narrow down to a fully-specified query and confirm it returns performance
  figures, price, and a `canonicalUrl`.
- `runtime = 'nodejs'` is required on this route (not edge) — the tool reads the synced catalogue
  from the filesystem via `lib/car-remaps/repository.ts` (`fs/promises`, `process.cwd()`), which
  only works in the Node runtime.

---

## 5. Known Issues / Follow-up Required

### ✅ Fixed: Volkswagen cars were silently missing from the synced catalogue

**Confirmed bug, fixed same day (2026-07-11) — `data/car-remaps/makes/vw.json` now has 81
entries, up from 1.**

**Root cause 1 — marque abbreviation mismatch:** Store API product names for Volkswagen _cars_
use the abbreviation **"VW"** as their leading token (e.g. `"VW Golf GTI Tuning (Golf 7 – 2012 –
2019) Tuning & ECU Remapping"`), but the `cars` AJAX marque list spells the marque out in full
(`"Volkswagen Tuning & Remapping"` → scope-index key `"volkswagen"`). This is structurally
different from the Mercedes-Benz/Mercedes mismatch (a hyphenated compound, already handled by
`isInScopeVehicle()`'s first-token split) — an abbreviation can't be derived from the full name by
any prefix/suffix rule. **Fix:** an explicit `MARQUE_ALIASES` table in `lib/car-remaps/parsers.ts`
(`{ volkswagen: ['vw'] }`, extensible for future cases), applied in `buildScopeIndex()` so both
keys share the merged (cars ∪ vans) model set.

**Root cause 2 — a second, deeper bug found while verifying the fix:** even after the alias fix,
most VW _model_ names still didn't match (`vw.json` only grew to 4 entries, not the expected
dozens). Many Store API product names — confirmed on VW Golf variants, but the same pattern
turned out to affect nearly every marque once fixed (the diff touched 83 of 83 `makes/*.json`
files) — repeat one of the documented `MARQUE_SUFFIXES` patterns a _second_ time, **after** the
year-range parenthetical rather than instead of it, e.g. `"Golf GTI Tuning (Golf 7 – 2012 – 2019)
Tuning & ECU Remapping"`. `normalizeModelName()`'s parenthetical-strip regex is end-anchored
(`\s*\([^)]*\)\s*$`), so it silently failed to strip the parenthetical whenever trailing text
followed it. **Fix:** `normalizeModelName()` now strips a trailing `MARQUE_SUFFIXES` match first,
before attempting the parenthetical strip.

**Verified:** `pnpm --filter dch-automotive test` (parsers.test.ts has explicit regression tests
for both fixes) and a full live re-sync — `totalInScope` went from 1518 → 1598 (+80 vehicles),
`totalFailed` 6 → 0 (the 6 prior Kia failures were a transient network issue, unrelated to either
fix), all 83 makes present. See commit history for the exact diff.

**Residual, out-of-scope data-quality note:** some Viezu product names contain literal `?`
characters in place of what should be en-dashes or hyphens (e.g. `"VW Polo Tuning (2014 ? 2017
Tuning ( 6C ) Tuning & ECU Remapping"`) — confirmed present in Viezu's own live API response, not
introduced by this pipeline. Cosmetic only; not corrected in this pass. If it needs cleaning up
for the public-facing pages, that's a separate `normalizeMarqueName`/`normalizeModelName`-adjacent
follow-up, not a scope-correctness bug.

**If a future audit finds another marque/model naming mismatch**, add it to `MARQUE_ALIASES` (for
whole-word abbreviations) or extend the relevant suffix-stripping logic (for suffix-pattern
variants) in `lib/car-remaps/parsers.ts` — do not special-case it in `isInScopeVehicle()`.

### ✅ Added: HGV scope (2026-07-11)

`IN_SCOPE_WIDGET_VEHICLE_TYPES` now includes `hgv-tuning` alongside `cars`/`vans` — DCH's Savings
Calculator needed real per-vehicle data for vans and lorries, and lorries turned out to be
completely absent from the synced catalogue (a deliberate scoping decision from the original
2026-07-11 build, not a bug — see the fixtures README's "Cross-vehicle-type marque check" section,
which had already confirmed HGV was safe to add whenever needed). Result: `totalInScope` went from
1,598 (83 makes) to 1,887 (144 makes) — 61 new HGV makes (DAF, Scania, MAN, Volvo Trucks, Mercedes
Truck, Ford Truck, Kenworth, Peterbilt, Mack, Western Star, and more).

`buildScopeIndex()`'s `marques` parameter gained an optional `hgv` field (existing cars/vans-only
callers, including `parsers.test.ts`, are unaffected). `fetch-marques.ts`'s internal `marques`
object and `ScopeIndexStats` (`hgvMarqueCount`) were generalized the same way. See
`parsers.test.ts`'s "buildScopeIndex HGV scope (no collision with car/van marques)" suite for the
executable proof that HGV marques merge into the index without colliding with a car/van marque of
the same base name.

### ✅ Fixed: `isInScopeVehicle`'s marque-prefix fallback could misattribute a product to the wrong marque

**Found immediately when adding HGV scope, via the new HGV unit tests — never triggered before
because no space-separated multi-word marque previously shared its first word with an
independently-scoped marque.**

**Root cause:** the fallback that lets a product name match a marque by its first token — added
for the genuine `"mercedes-benz"` (index key) vs. `"Mercedes ..."` (product name) mismatch — split
on **both spaces and hyphens** (`/[\s-]+/`). That's correct for a hyphenated compound (the short
form is just a different spelling of the _same_ marque), but wrong for a plain multi-word marque
like `"Ford Truck"` (space-separated) whose first word, `"Ford"`, is an entirely different,
independently-populated marque. Because longer keys are tried first, a plain product named
`"Ford F-4000 Tuning (2012-2014)"` (no "Truck" anywhere in the name) matched under the `"ford
truck"` key via its first-token fallback, purely because `"ford truck"` sorted before `"ford"` —
even though `"F-4000"` is an HGV-only model that was never meant to be reachable from a plain
`"Ford"` prefix.

**Fix:** the first-token fallback now splits on hyphens only (`marqueKey.split('-')[0]`), not
spaces. Every hyphenated marque confirmed in the real data (`"Mercedes-Benz"`) is one marque
spelled two ways; every space-separated multi-word HGV marque confirmed in the real data (`"Ford
Truck"`, `"Mercedes Truck"`, `"Astra Truck"`, `"Daewoo Truck"`, etc.) is a _different_,
deliberately-distinct marque bucket that happens to share a leading word — those two cases needed
different handling, and the single space-or-hyphen split couldn't tell them apart.

**Verified:** `parsers.test.ts`'s HGV scope suite (`f-4000`, an HGV-only DAF... Ford Truck model,
confirmed absent from car "Ford"'s own model list) plus all 108 pre-existing tests still pass
unchanged — this was a pure bug fix, not a behavior change for any previously-working case.

### ✅ Fixed: the sync could hang indefinitely on a single unresponsive product page

**Found live 2026-07-11** while running the HGV-scope sync: a run stalled for 10+ minutes with no
progress and no error, confirmed (via `lsof -p <pid>`) to be holding an `ESTABLISHED` TCP
connection to Viezu's server that was never responding. None of the three live-fetch call sites
(`fetch-product-html.ts`, `fetch-store-api.ts`, `fetch-marques.ts`) had a request timeout — a plain
`fetch()` with no `AbortSignal` can wait forever on a connection the server opened but never
answered.

**Fix:** added `FETCH_TIMEOUT_MS` (30s) in `config.ts` and `signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)`
on all three call sites. `fetchProductPerformanceData()` already treats any thrown error
(including now an abort) as one more counted failure rather than a fatal one, so this just bounds
"hangs forever" down to "counts as a failure after 30s and the sync moves on" — no behavior change
for the fast/normal path, and `fetchAllCatalogPages()`/`fetchNonce()`'s existing "throw and abort
the whole sync" behavior on a genuine failure is preserved, just now time-bounded too.

### Known, transient: Jaecoo (2 vehicles) missing from the current `data/car-remaps/`

The 2026-07-11 HGV-scope sync run's `get_filter_models` request for the `jaecoo` marque failed
with a generic `fetch failed` (not the documented Mitsubishi-Fuso-style confirmed-zero-model case
above — this one logged as a plain fetch failure, most likely transient network flakiness).
`jaecoo`'s scope-index entry ended up with zero models for that run, so `isInScopeVehicle()`
correctly excluded its 2 real products (J5, J7) as a result — not a bug, just a small, isolated gap
from one failed request during the scope-index walk (Pass A), unrelated to the per-product
enrichment failures tracked in `manifest.json`'s `totalFailed`.

**Deliberately not fixed by re-running the full sync** — a ~2,000-request live re-sync is expensive
against a third-party site and disproportionate for a 2-vehicle gap; see §1's guidance on this.
Expected to self-heal on the next routine re-sync (before the next Car Remaps deploy). If Jaecoo
still shows a zero-model scope-index warning on a future run, check whether `jaecoo`'s marque slug
or AJAX response shape changed upstream.

---

## 6. Verification gates (for reference)

Run after any change to the sync pipeline, parsers, repository, pages, API route, or MCP tool
code:

```bash
pnpm type-check
pnpm --filter dch-automotive run build
pnpm --filter dch-automotive run lint
```

Manual smoke test:

1. `/car-remaps` — confirm the interactive ready reckoner resolves make → model → fuel type →
   variant for a few real vehicles, and that the old Viezu iframe is gone.
2. A few `/car-remaps/[make]` pages — confirm the performance table renders and view-source shows
   the JSON-LD `<script type="application/ld+json">` tag (Product+Offers schema from
   `lib/car-remaps/schema.ts`).
3. `curl` the JSON API (`/api/car-remaps/lookup`) with a few real `make`/`model`/`fuelType`/
   `variant` combinations, confirming progressive narrowing and a 400 on invalid params.
4. Confirm `/llms.txt` is reachable and its listed `/car-remaps/[make]` URLs return 200.

---

## 7. Fuel Savings Calculator + live fuel prices

Added 2026-07-11. The Savings Calculator on `/car-remaps` (`components/fuel-savings-calculator.tsx`)
embeds the same `CarRemapsSelectors` used by the Ready Reckoner, so the efficiency-gain figure it
uses is the selected vehicle's real `fuelSaving` percentage from the synced catalogue — not a
guessed slider value. It's a separate `CarRemapsSelectors` instance from the Ready Reckoner's, so
selecting a vehicle in one doesn't affect the other.

The fuel price field auto-fills from the UK weekly average petrol/diesel price
(`lib/fuel-prices/fetch.ts`, served via `/api/fuel-prices/current`) but stays editable — a manual
edit is never overwritten by a later vehicle selection (`fuelPriceTouched` state in the
component).

**Data source**: DESNZ's "Weekly road fuel prices" open data workbook (data.gov.uk, OGL v3.0), the
same one behind the government's official fuel price index. This feed updates **weekly**, not
daily or live — the CMA's real-time "Fuel Finder" API exists but requires formal accreditation as
a registered data recipient, which was judged out of scope for this feature.

**How it's fetched**: unlike the car-remaps catalogue sync, this is **not** a committed-JSON
pattern — there's no cron or scheduled job anywhere in this repo to build on (see §1's "How often
to run it" for the same gap in the catalogue sync). Instead, `fetchLatestFuelPrices()` fetches
live at request time inside the API route, using Next's `fetch()` `revalidate: 604800` (7 days) so
it only actually hits gov.uk roughly once a week, matching the source's own cadence:

1. Fetch the data.gov.uk dataset page and regex-extract the current `.xlsx` download link (it's
   date-stamped, e.g. `weekly_road_fuel_prices_060726.xlsx`, so the URL isn't stable — it must be
   scraped each time, not hardcoded).
2. Fetch and parse that workbook's `Data` sheet with the `xlsx` package. The header row is found
   dynamically (first row where column 0 is the literal string `"Date"`), and the petrol/diesel
   columns are found by matching header text containing `"ULSP"`/`"ULSD"` and `"Pump price"` —
   not hardcoded column indices — so the parser tolerates the workbook growing new columns.
3. Take the last data row (most recent week), convert its Excel date serial to an ISO date, and
   sanity-check both prices fall within 80–300 pence/litre.

**Verified during implementation** against the real workbook (week ending 2026-07-06): `Data`
sheet, header row at index 7, `ULSP: Pump price (p/litre)` and `ULSD: Pump price (p/litre)`
columns — confirmed values were petrol 149.80p, diesel 164.77p (notably different from initial
web-search estimates used during planning, which is why the parser was verified against the real
downloaded file rather than assumed).

**Fails safe**: any error at any step (page restructured, network failure, an out-of-range value)
is caught, logged with `console.error`, and `fetchLatestFuelPrices()` returns
`FUEL_PRICE_FALLBACK` (`lib/fuel-prices/types.ts`) — a hand-updated constant set to the last
confirmed-real values. The calculator always has a usable price; it never surfaces a fetch error
to the customer. If the fallback starts looking stale, update the constant by hand (no sync script
for this — the live fetch is expected to keep it current under normal conditions).
