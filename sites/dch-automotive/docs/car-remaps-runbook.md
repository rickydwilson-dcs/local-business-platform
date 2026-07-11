# Car Remaps Runbook

Operational guide for the DCH Automotive Car Remaps feature: the Viezu-sourced catalogue sync,
the data it produces, the pages/API/MCP endpoint built on top of it, and the known data-quality
gap that needs a follow-up fix. Written 2026-07-11 at the end of the
`feature/car-remaps-reckoner-aeo-mcp` build. See also:

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
   vehicle type in `IN_SCOPE_WIDGET_VEHICLE_TYPES` (currently `['cars', 'vans']`), building a
   normalized `(marque, model)` membership index (`ScopeIndex`).
2. **Full catalogue walk** (`fetch-store-api.ts`) — pages through the WooCommerce Store API
   (`/wp-json/wc/store/v1/products`) to fetch every product on the site (currently ~3,188).
3. **Filter** — each product is checked against `EXCLUDED_NON_VEHICLE_CATEGORIES` (unconditional
   exclusion of tools/cables/accessories categories) and then `isInScopeVehicle()` (does the
   product name match a `(marque, model)` pair in the scope index).
4. **Per-product enrichment** (`fetch-product-html.ts`) — fetches each in-scope product's detail
   page and parses its `data-product_variations` attribute for performance/pricing data.
5. **Normalize + write** (`normalize.ts` + `sync.ts`) — groups results by make and writes
   `data/car-remaps/makes/<make-slug>.json`, `data/car-remaps/manifest.json`, and
   `data/car-remaps/index.json`.

A polite `FETCH_DELAY_MS` (400ms) is applied between successive live HTTP requests — a full sync
walks ~3,000+ live URLs, so expect it to take a while (tens of minutes), not seconds.

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

| Field                     | Meaning                                                                                                                                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generatedAt`             | ISO timestamp of the sync run.                                                                                                                                                                                                                        |
| `sourceUrl`               | Always `https://viezu.com`.                                                                                                                                                                                                                           |
| `totalFetched`            | Total products returned by the Store API walk (all vehicle types, tools, accessories — everything).                                                                                                                                                   |
| `totalExcludedByCategory` | Products dropped by the unconditional `EXCLUDED_NON_VEHICLE_CATEGORIES` list (tools/cables/accessories/parts).                                                                                                                                        |
| `totalExcludedByScope`    | Products that passed the category filter but didn't match any `(marque, model)` pair in the scope index — i.e. not a car or van Viezu currently tunes (bikes, HGV, agriculture, marine, motorhomes, or a name the scope matcher failed to recognize). |
| `totalInScope`            | Products that made it through to the enrichment step.                                                                                                                                                                                                 |
| `totalFailed`             | Enrichment fetches that threw (see below) — parse or fetch failures on an otherwise in-scope product.                                                                                                                                                 |
| `failedUrls`              | The actual URLs that failed, with enough context to investigate individually.                                                                                                                                                                         |
| `makes`                   | Sorted list of make slugs that got a `data/car-remaps/makes/<slug>.json` file written.                                                                                                                                                                |
| `scopeIndexStats`         | `carsMarqueCount`, `vansMarqueCount`, `totalModelsCounted` — sanity-check numbers for the scope index itself (currently 85 car marques, 23 van marques, 1,893 models counted as of the 2026-07-11 run).                                               |

### Fail-fast threshold

`FAIL_FAST_THRESHOLD` in `scripts/car-remaps/config.ts` is currently `0.1` (10%). If the fraction
of in-scope products whose enrichment fetch/parse fails exceeds this threshold, `sync.ts` aborts
**before writing any output files** — you get a clean failure with the list of failed URLs printed
to the console, not a partially-overwritten data directory. This is a safety net against Viezu
changing their product-page markup mid-run and silently corrupting most of the catalogue.

A **low, non-zero** `totalFailed` (well under the 10% threshold) is normal and expected — the
2026-07-11 run had 6 failures out of 1,518 in-scope products (0.4%), all traced to individual
product pages returning HTTP errors or unusual markup (see `failedUrls` in the committed
manifest) rather than a systemic issue. Don't chase these to zero; only investigate if:

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

### 🔴 Volkswagen cars are silently missing from the synced catalogue

**Confirmed bug, not yet fixed — do not assume VW coverage is complete.**

`data/car-remaps/makes/vw.json` currently contains exactly **one vehicle**: the "VW Crafter"
(a van). This entry only exists because it matched via a _separate_ `"vw"` marque key that came
from the **vans** AJAX marque list — a different bucket from the **cars** marque list, which
uses the full name `"Volkswagen Tuning & Remapping"` (normalizing to the scope-index key
`"volkswagen"`, per `normalizeMarqueName()`).

**Root cause:** Store API product names for Volkswagen _cars_ use the abbreviation **"VW"** as
their leading token — e.g. `"VW Golf GTI Tuning (Golf 7 – 2012 – 2019) Tuning & ECU Remapping"`
(confirmed live via `https://viezu.com/wp-json/wc/store/v1/products?search=golf`, which returns
real, in-scope Volkswagen car tuning products). `isInScopeVehicle()` in
`lib/car-remaps/parsers.ts` generates its candidate prefixes from the scope-index marque key
itself: the full key (`"volkswagen"`) or its first whitespace/hyphen-split token (still
`"volkswagen"`, since it's one word — the split logic exists to handle compound keys like
`"mercedes-benz"` → `"mercedes"`, which _is_ handled correctly). It never tries `"vw"` as an
alias for the `"volkswagen"` key, so **every VW car product name fails the prefix match and is
silently excluded from scope.**

The `isInScopeVehicle()` doc comment currently claims Mercedes-Benz/Mercedes is "the" naming
mismatch the function tolerates — that claim is only half-true. Mercedes-Benz's mismatch is
solved by the existing hyphen-split logic; **Volkswagen/VW is a structurally different kind of
mismatch (a whole-word abbreviation, not a hyphenated compound) that the current logic does not
handle**, despite the surrounding comments implying full coverage.

**Impact:** the current sync is missing an entire major marque's worth of _cars_ — Golf, Polo,
Passat, Tiguan, T-Roc, and likely dozens of other models never made it into any `makes/*.json`
file. (VW _vans_, e.g. Crafter, Transporter, are unaffected — they come through the separate
`"vw"` van marque key, which does happen to already match the Store API's "VW" prefix.)

**Fix (for a future session — NOT done in this pass):**

1. Add an explicit marque-alias table, e.g. `{ volkswagen: ['vw'] }`, either to
   `isInScopeVehicle()`'s candidate-prefix generation or to `buildScopeIndex()` (so the index
   itself carries both keys), in `lib/car-remaps/parsers.ts`.
2. Re-run `pnpm --filter dch-automotive run car-remaps:sync`.
3. Verify `data/car-remaps/makes/vw.json` (or a merged `volkswagen.json`, depending on how the
   alias is implemented) grows well beyond 1 entry — expect real Golf/Polo/Passat/Tiguan/T-Roc
   models to appear.
4. **Audit other marques for the same failure mode** — any marque with a full-name-vs-abbreviation
   split (not a hyphenated compound like Mercedes-Benz) is a candidate for the same bug. Check
   the full marque list in `lib/car-remaps/__fixtures__/README.md`'s "Full parsed marque lists
   and suffix patterns" section against real Store API product name prefixes for each, the same
   way this VW gap was found (a live `?search=<model>` query compared against the corresponding
   `makes/<slug>.json` file).

**This pass's data has already been committed and accepted with this gap present** — it is
documented here as a known, explicit follow-up, not something to silently patch by re-running the
sync or modifying `parsers.ts` outside of a dedicated fix session.

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
