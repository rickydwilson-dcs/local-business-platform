# Car Remaps — Viezu Data Fixtures

Raw data pulled from Viezu's live production WooCommerce site (`viezu.com`) on 2026-07-10,
used to design the Phase 2 catalogue-sync implementation for `sites/dch-automotive`'s
`/car-remaps` page (see `app/car-remaps/page.tsx` lines 485–506 — the embedded Viezu
`<iframe>` widget this data would eventually supplement or replace with a native
DCH-branded catalogue).

All requests used a real browser User-Agent
(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/120.0 Safari/537.36`) with a ~300–500ms delay between requests. Total catalogue size:
**3,188 products across 32 pages** (`per_page=100`), confirmed via the `X-WP-Total` /
`X-WP-TotalPages` response headers on the Store API.

## Files

### Store API catalogue pages (JSON)

Fetched from the public WooCommerce Store API — no auth required.

| File                    | Source                                                      | Notes                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `store-api-page-1.json` | `GET /wp-json/wc/store/v1/products?page=1&per_page=100`     | First 100 products (alphabetical-ish/DB order, not sorted by relevance)                                                                                    |
| `store-api-page-2.json` | `GET /wp-json/wc/store/v1/products?page=2&per_page=100`     | Next 100                                                                                                                                                   |
| `store-api-page-3.json` | `GET /wp-json/wc/store/v1/products?page=16&per_page=100`    | Mid-catalogue page (of 32 total) for variety — despite the filename ordering, this is `page=16`, not `page=3`, of the real API                             |
| `categories-full.json`  | `GET /wp-json/wc/store/v1/products/categories?per_page=100` | **Full, authoritative category list** — all 58 categories that exist site-wide, with `id`, `parent`, `count`. Not a sample; this is the complete taxonomy. |

300 products (of 3,188) were sampled this way to build the category/naming analysis below.
That's a ~9.4% sample, weighted toward the start and one mid-catalogue page — treat category
_counts_ as indicative, not exact, but the _taxonomy itself_ (from `categories-full.json`) is
complete since it come from the dedicated categories endpoint, not sampled from products.

### Product detail pages (HTML)

Fetched by following `permalink` values found in the Store API responses. Each contains a
`data-product_variations="[...]"` HTML attribute (WooCommerce's standard variable-product
JS bootstrap data) holding the per-variant BHP/torque/economy fields the task needs.

| File                                 | Product                                                                   | Why chosen                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product-mercedes-cle.html`          | Mercedes CLE Tuning (2023–Present)                                        | Car. Given as a known-good pipe-delimited example — its "Petrol / 2.0" variation bundles 2 real sub-variants.                                                                                                                                                                                                                                                                                                                   |
| `product-ford-transit-custom.html`   | Ford Transit Custom Tuning (2023–Present)                                 | Van. Single WooCommerce variation ("Diesel / 2.0") that itself bundles **3** pipe-delimited sub-variants — the richest pipe example found.                                                                                                                                                                                                                                                                                      |
| `product-ford-transit-courier.html`  | Ford Transit Courier Tuning (2023–Present)                                | Van, smaller/newer model. 2 variations (Petrol Hybrid 1.5, Diesel 1.5), both single-valued (no pipes) — good "simple" contrast case.                                                                                                                                                                                                                                                                                            |
| `product-toyota-camry.html`          | Toyota Camry Tuning (All)                                                 | Car with **4** variations, a mix of single-valued (Petrol 3.5, Petrol Hybrid 2.5) and pipe-delimited (Petrol 2.4 → 3 sub-variants, Petrol 2.0 → 4 sub-variants). Best "several combos" example.                                                                                                                                                                                                                                 |
| `product-tata-nano.html`             | Tata Nano Tuning (All)                                                    | Car, low-volume/niche model. Single variation, single-valued fields, `k_type: "nan"` — simplest possible case.                                                                                                                                                                                                                                                                                                                  |
| `product-nissan-navara-d22.html`     | Nissan Navara D22 Tuning (All)                                            | Pickup/LCV-adjacent. Single variation, single-valued, has real `k_type` (`57157`) and `fuel_saving: "10%"` populated (many others leave this blank).                                                                                                                                                                                                                                                                            |
| `product-peugeot-boxer.html`         | Peugeot Boxer Tuning (2000–2005)                                          | Van, older model. Single variation, single-valued, all economy fields populated — another clean "simple" reference.                                                                                                                                                                                                                                                                                                             |
| `product-noise-alientech-cable.html` | Alientech KESS3 – Adapter for Mazda-Nissan Denso ECU (Renesas SH705x-RD-) | **Category-noise fixture.** Not a vehicle listing at all — a tuning-tool cable/adapter accessory. Confirmed to have **no** `data-product_variations` attribute and **no** `original_bhp`/torque fields anywhere in the page. Breadcrumb: `Home / Professional Tuning Tools Hardware & Software / Cables & Accessories / Alientech Cables & Accessories`. Proves the eventual category filter must exclude this branch entirely. |

## Pipe-delimited field interpretation (CONFIRMED, not ambiguous)

Fields affected: `original_bhp`, `power_bhp` (this is actually the **gain**, not a power
figure — see note below), `original_torque`, `torque_nm` (also a gain, not the raw torque),
`economy_gain_bhp`, `economy_gain_nm`, `fuel_saving`, `v_switch_support`, and `k_type`.

**Finding:** when a single WooCommerce "variation" (one fuel-type + engine-displacement
dropdown combination, e.g. "Petrol / 2.0") actually corresponds to **more than one distinct
real-world engine state-of-tune**, Viezu encodes each of those real sub-variants as one
pipe-separated (`" | "`) position across _all_ of the numeric fields simultaneously. The Nth
value in `original_bhp` corresponds to the Nth value in `power_bhp`, the Nth value in
`original_torque`, the Nth value in `torque_nm`, the Nth value in `v_switch_support`, and the
Nth value in `k_type` — they are **positionally aligned across fields**, not independent lists.

Evidence, from three separate products with increasing confidence:

1. **Mercedes CLE, "Petrol / 2.0" variation** (2-way pipe):
   `original_bhp: "258 | 197"`, `power_bhp: "30 | 25"`, `original_torque: "370 | 320"`,
   `torque_nm: "50 | 40"`, `v_switch_support: "FALSE | FALSE"`, `k_type: "nan | nan"`.
   Two real sub-variants (likely two different CLE petrol engine states of tune sharing the
   "2.0L Petrol" dropdown bucket), each with its own original BHP, gain, original torque, and
   torque gain — index 0 (258 bhp / +30 bhp / 370 Nm / +50 Nm) and index 1 (197 bhp / +25 bhp
   / 320 Nm / +40 Nm) are self-consistent higher-power/lower-power pairs.

2. **Toyota Camry, "Petrol / 2.0" variation** (4-way pipe) and **"Petrol / 2.4"** (3-way pipe):
   `original_bhp: "147 | 152 | 171 | 178"` alongside `power_bhp: "8 | 10 | 12 | 13"`, all four
   fields (`original_bhp`, `power_bhp`, `original_torque`, `torque_nm`) carry exactly 4
   pipe-separated values in the 2.0L case and exactly 3 in the 2.4L case — the pipe count is
   consistent _within_ a variation across every field, which would not hold if the pipes were
   coincidental string concatenation.

3. **Ford Transit Custom, "Diesel / 2.0" variation** (3-way pipe, the strongest evidence):
   `original_bhp: "102 | 136 | 170"`, `power_bhp: "80 | 54 | 20"`,
   `original_torque: "375 | 410 | 405"`, `torque_nm: "65 | 30 | 35"`,
   `economy_gain_bhp: "40 | 25 | 10"`, `economy_gain_nm: "30 | 15 | 17"`,
   `fuel_saving: "10% | 10% | 10%"`, `v_switch_support: "FALSE | FALSE | FALSE"`, and
   critically `k_type: "151589 | x | 152507_152505"` — **every single field** on this variation
   has exactly 3 pipe-separated entries, including `k_type` where the middle entry is the
   literal placeholder string `"x"` (a missing/unknown ECU k-type code for that specific
   sub-variant) rather than a number. This confirms the positions are individually
   maintained per-sub-variant (including "field genuinely absent for this one") rather than
   being some kind of derived/formatted range string.

**What the pipe does NOT tell you:** there is no field anywhere in the variation object (or
elsewhere on the rendered page — checked by full-text search for the raw numbers, e.g. `258`
and `197` from the Mercedes CLE example only ever appear inside the JSON data attribute, never
in visible page text) that names _which_ real submodel each pipe position refers to. `k_type`
is Viezu's internal ECU-type lookup code and is usually `"nan"` for non-KESS3-mapped vehicles,
so it can't be used to reverse-map position → trim name either. **If Phase 2 needs
human-readable submodel labels (e.g. "CLE 200" vs "CLE 300") per pipe position, that data does
not exist in this API/HTML source and would need to come from elsewhere** (Viezu doesn't expose
it) — otherwise the safe approach is to treat each pipe position as an anonymous "variant N of
M" and either show the range (min–max bhp gain) or list all N rows under the one dropdown
selection.

**Naming caveat (worth flagging even though not asked):** `power_bhp` and `torque_nm` are
named as if they were absolute power/torque figures, but the values (e.g. `"30"`, `"25"`,
`"80"`) are clearly **gains** (extra bhp/Nm from the remap) — consistent with the site's own
public messaging about power increases, and far too small to be absolute engine outputs.
`original_bhp` / `original_torque` are the pre-remap absolute figures. This naming
inconsistency in Viezu's own data model, not something introduced by us — worth a comment in
Phase 2 code so nobody re-derives the wrong assumption from the field name alone.

## Car + Van category scope decision

**This could not be fully resolved by category alone — flagging as genuinely ambiguous, with a
recommended fallback below.**

### What's unambiguous: non-vehicle categories to exclude outright

`categories-full.json` is the complete, authoritative list of all 58 categories on the site.
The following are clearly tuning **tools, cables, accessories, or performance parts** —
not vehicle-model tuning listings — and should be excluded unconditionally regardless of the
Car/Van question:

- `Professional Tuning Tools Hardware & Software` (and all its children: `Cables & Accessories`,
  `Alientech Cables & Accessories`, `Alientech Tuning Tools`, `Alientech KESS3 Tuning Tools`,
  `Alientech ECM Titanium`, `Alientech Powergate`, `Bench & Boot Cables`,
  `Agriculture Cables – Truck & Buses`, `Bike Cables – ATV & UTV`, `Car Cables – LCV`
  — note this last one is a **cable/accessory** category despite the word "Car" in its name; it
  sells LCV OBD cables for the tuning tool, not vehicle listings — exclude it,
  `Dimsport`, `Dimsport Cables & Accessories`, `Autotuner Professional Tools`,
  `Autotuner Cables & Accessories`, `Autotuner The One`, `Magic Motorsport`,
  `Magic Motorsport Cables & Accessories`, `Tuning Accessories`, `Tuning Tools`,
  `Tuning Tool Subscription Renewals`, `Vehicle Tuning Software`, `EVC WinOLS`,
  `VC Power Swiftec Tuning Software`, `Swiftec`, `Diagnostic Tools`,
  `Battery Stablizer / Charger`, `Bench Stands`)
- `DIY Tuning Devices` (and children `DIY Tuning Devices V-Switch`, `V-Switch`, `VIEZU V-Box`,
  `Tuning Box`, `JB4 Tuning Device`)
- `Vehicle Performance Parts and Styling` (and children `PWR Cooling`, `Supercharger Pulley`,
  `Charger cooler`, `Supercharge cooler`, `Carbon Fibre Performance Parts`, `TAROX Brakes`,
  `VIP Design London`, `VIP Design Jaguar Packages`)
- `Performance Exhaust Systems` (and children `Paramount Performance Exhausts`,
  `Milltek Performance Exhausts`)

### What's ambiguous: there is no clean "Car" or "Van" category to include on

The task brief assumes categories exist that map to vehicle type (excluding
Agriculture/Marine/HGV/Bus/Bike/Motorhome, including Car/Van). **They don't, empirically:**

- The two largest "vehicle listing" buckets — `VLF` (id 169, 2,906 products, ~91% of the whole
  catalogue) and `Vehicle Tuning and Remapping` (id 155, 1,605 products) plus the near-duplicate
  `VLF | Vehicle Tuning and Remapping` (id 9512, 277 products) — are **not vehicle-type-specific
  at all**. Confirmed by direct product inspection:
  - `Toyota Camry Tuning (All)` (car) → `['VLF | Vehicle Tuning and Remapping']`
  - `Ford Transit Custom Tuning (2023-Present)` (van) → `['VLF | Vehicle Tuning and Remapping']`
  - `Triumph Trident Tuning (All)` (motorbike) → **also** `['VLF | Vehicle Tuning and Remapping']`
    — the same category holds cars, vans, _and_ motorbikes indiscriminately.
- Worse, of the 300 sampled products, **97 (32%) have an empty `categories: []` array entirely**
  — including most motorbike listings (Ducati, Derbi, CF Moto, Can-Am, BMW Motorrad all sampled
  with zero categories) _and_ all `DAF Truck` HGV listings sampled (`DAF Truck Xf95/Xf106/
Xf105/Lf55/Lf45/Cf85/Cf75/Cf65 Tuning` — all `categories: []`). So HGV trucks are _sometimes_
  uncategorized (good — they'd fall out of any category-based include-list) but bikes are
  _inconsistently_ categorized — some in `VLF` alongside cars/vans, some with no category at all.
- The only brand-specific vehicle categories that exist (`Audi Tuning`, `Mercedes Tuning`,
  `BMW Tuning`, `Volkswagen Tuning`, `Porsche Tuning`, `Land Rover Tuning`, `Ferrari Tuning`,
  `Jaguar Tuning`, `Lamborghini Tuning`) are all children of `Vehicle Tuning and Remapping` and
  are all car/luxury-car marques — none of them are Agriculture/Marine/HGV/Bus/Bike/Motorhome
  brand categories, so they're safely includable, but they only cover a small fraction (~460 of
  3,188) of the catalogue; the bulk of car+van listings sit in the undifferentiated `VLF` bucket
  alongside whatever bikes happen to be categorized.

**Conclusion:** category membership cannot reliably distinguish Car+Van from
Bike/Agriculture/Marine/HGV/Bus/Motorhome at the individual vehicle-model-product level in this
catalogue — only at the tools/cables/accessories/parts level (which _is_ clean, see above).
**Recommended fallback for Phase 2:** exclude the unambiguous non-vehicle branches listed above
categorically, then apply a **name/keyword heuristic** on the remaining `VLF` /
`Vehicle Tuning and Remapping` bucket to drop non-car/van listings — e.g. known motorcycle
marques (Ducati, Derbi, CF Moto, Can-Am, BMW Motorrad, Triumph [bike models], Harley-Davidson,
KTM, etc.), known HGV/bus marques (DAF, Scania, MAN, Volvo Trucks, Iveco — when combined with
"Truck"/"Bus" in the product name), and keywords in the product title itself (`Tractor`,
`Combine`, `Marine`, `Boat`, `Motorhome`, `Campervan`, `ATV`, `UTV`, `Quad`). This is a larger
and messier task than a category filter and should be scoped explicitly in the Phase 2 plan
rather than assumed to be a one-line `categories.includes(...)` check.

> **SUPERSEDED (2026-07-11).** The category/keyword-heuristic approach above was never
> implemented — a real investigation of the live `/dealer` widget on
> `app/car-remaps/page.tsx` found Viezu's own authoritative scope mechanism instead: the
> widget's cascading `Vehicle Type → Make → Model → Fuel Type → Variant` selector is powered
> by a WordPress AJAX endpoint (`admin-ajax.php`) with a `vehicle-type` param whose values
> (`cars`, `vans`, `bike-tuning`, `hgv-tuning`, `agriculture-tuning`, `marine`, `motorhomes`)
> return a **clean, disjoint marque list per vehicle type** — no motorbikes in the `cars` or
> `vans` lists, confirmed live (see below). Scope for Phase 2/3 is now determined by matching
> each Store API product's **name** against this AJAX marque/model taxonomy, not by category
> or keyword heuristics. The two sections above (pipe-delimited field interpretation, and the
> unambiguous non-vehicle category exclusion list) remain valid and unchanged — categories are
> still used, but only for that one unconditional exclusion list, never as an include-list.
> Everything below this line documents the new mechanism.

---

## Scope mechanism (2026-07-11): AJAX marque/model cascade, not categories

### `ajaxurl` / nonce mechanics

The live widget page `https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace` embeds an
inline script variable:

```js
var custom_product_filter = {
  ajaxurl: 'https://viezu.com/wp-admin/admin-ajax.php',
  security: '2d3d3c6ed8',
};
```

- `ajaxurl` is stable (`https://viezu.com/wp-admin/admin-ajax.php`) — the standard WordPress
  `admin-ajax.php` entry point.
- `security` is a **WordPress nonce scoped to that specific page load**. It is NOT a fixed
  secret and must **not** be hardcoded or cached across runs — Phase 3's `fetch-marques.ts`
  must re-fetch the `/dealer` page fresh and re-extract this value every time the sync script
  runs (and again mid-walk if a nonce expires — nonces are typically valid for ~12-24h but a
  long walk of 100+ marques should treat a nonce-failure response as a signal to refresh, not
  assume the nonce is good for the whole run).
- A nonce-failure response is the literal string `-1` (WordPress's generic AJAX nonce/action
  failure response) — not an HTTP error, not an empty body. `parseFilterBrandsResponse` /
  `parseFilterModelsResponse` (Phase 2) must treat exactly this and throw, since silently
  returning `[]` would look identical to "this marque genuinely has zero models."
- Both `get_filter_brands` and `get_filter_models` are POST requests (form-encoded body, not
  query string) to `ajaxurl` with `action=get_filter_brands|get_filter_models`,
  `vehicle-type=<type>`, `security=<nonce>`, and (for `get_filter_models`) an additional
  `vehicle-make=<make-slug>` field.

Fixtures captured (2026-07-11, same UA/delay policy as the Part B fixtures above):

| File                                             | Request                                                                                                     |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `ajax-brands-cars.html`                          | `get_filter_brands`, `vehicle-type=cars` — 85 marques                                                       |
| `ajax-brands-vans.html`                          | `get_filter_brands`, `vehicle-type=vans` — 23 marques                                                       |
| `ajax-models-bmw-tuning-remapping.html`          | `get_filter_models`, `vehicle-type=cars`, `vehicle-make=bmw-tuning-remapping` — 84 models                   |
| `ajax-models-ford-tuning-remapping.html`         | `get_filter_models`, `vehicle-type=cars`, `vehicle-make=ford-tuning-remapping` — 94 models                  |
| `ajax-models-ford-vans.html`                     | `get_filter_models`, `vehicle-type=vans`, `vehicle-make=ford-vans` — 22 models                              |
| `ajax-models-mercedes-benz-vans.html`            | `get_filter_models`, `vehicle-type=vans`, `vehicle-make=mercedes-benz-vans` — 16 models                     |
| `ajax-brands-bike-tuning-check.html`             | `get_filter_brands`, `vehicle-type=bike-tuning` — cross-check fixture, 34 marques                           |
| `ajax-brands-hgv-check.html`                     | `get_filter_brands`, `vehicle-type=hgv-tuning` — cross-check fixture, 63 marques                            |
| `ajax-models-ford-truck-264-hgv-tuning.html`     | `get_filter_models`, `vehicle-type=hgv-tuning`, `vehicle-make=ford-truck-264` — cross-check, 4 models       |
| `ajax-models-mercedes-truck-291-hgv-tuning.html` | `get_filter_models`, `vehicle-type=hgv-tuning`, `vehicle-make=mercedes-truck-291` — cross-check, 10+ models |
| `ajax-models-suzuki-tuning-remapping-cars.html`  | `get_filter_models`, `vehicle-type=cars`, `vehicle-make=suzuki-tuning-remapping` — cross-check, 13 models   |
| `ajax-models-suzuki-27-bike-tuning.html`         | `get_filter_models`, `vehicle-type=bike-tuning`, `vehicle-make=suzuki-27` — cross-check, 9 models           |

All twelve fixtures are real `<option>` HTML lists, none are the `-1` nonce-failure response.

### Full parsed marque lists and suffix patterns

**Cars (85 marques).** Every marque name is either bare (no vehicle-type-indicating suffix at
all) or carries one of these suffix patterns, which `normalizeMarqueName()` must strip (longest
match first, case-sensitive on the source, lowercase the result):

- `" Tuning & ECU Remapping"` — e.g. `Abarth Tuning & ECU Remapping` → `abarth`
- `" Car Tuning & ECU Remapping"` — e.g. `Alfa Romeo Car Tuning & ECU Remapping` → `alfa romeo`, `Aston Martin Car Tuning & ECU Remapping` → `aston martin`
- `" Tuning & Remapping"` — the most common pattern, e.g. `BMW Tuning & Remapping` → `bmw`, `Mercedes-Benz Tuning & Remapping` → `mercedes-benz` (covers the bulk of the list: Alpina, Audi, Buick, Cadillac, Chevrolet, Chrysler, Citroen, Dacia, Dodge, Ferrari, FIAT, Genesis, GMC, Holden, Honda, Hyundai, Infiniti, Isuzu, Jeep, Kia, Lancia, Land Rover, Lexus, Lotus, Mahindra, Maserati, Mazda, McLaren, MG, MICROCAR, Mini, Mitsubishi, Nissan, Opel, Peugeot, Porsche, Renault, Rolls Royce, Rover, Saab, Saturn, Seat, Skoda, Smart, Ssangyong, Subaru, Suzuki, Toyota, Vauxhall, Volkswagen, Volvo)
- `" Car Tuning & Remapping"` — e.g. `Bentley Car Tuning & Remapping` → `bentley`, `Ford Car Tuning & Remapping` → `ford`, `Lamborghini Car Tuning & Remapping` → `lamborghini`
- `" Tuning & Remapping Service - Viezu"` — one-off: `Jaguar Tuning & Remapping Service - Viezu` → `jaguar`
- No suffix (bare marque name, use as-is lowercased): Alpine, BUGATTI, Changan, CHERY, Cupra, Daewoo, Daihatsu, Dallara, Dongfeng, DS, Force Motors, Geely, GWM, Hummer, Ineos, Jaecoo, Lincoln, Luxgen, Mitsubishi Fuso, Morgan, Omoda, Pontiac, Proton, Roewe, Tata

**Vans (23 marques).** Suffix patterns:

- `" Vans Tuning & ECU Remapping"` — e.g. `Citroen Vans Tuning & ECU Remapping` → `citroen`, `Dacia Vans Tuning & ECU Remapping` → `dacia`, `Ford Vans Tuning & ECU Remapping` → `ford`
- `" Van Tuning & ECU Remapping"` (singular "Van", not "Vans" — a distinct pattern from the one above) — e.g. `Mercedes Van Tuning & ECU Remapping` → `mercedes` (note: this normalizes to `mercedes`, not `mercedes-benz` as the cars list does for the same real-world marque — see matching-key caveat below)
- `" Vans"` bare — e.g. `Chevrolet Vans` → `chevrolet`, `FIAT Vans` → `fiat`, `GMC Vans` → `gmc`, `Hyundai Vans` → `hyundai`, `Isuzu Vans` → `isuzu`, `Iveco Vans` → `iveco`, `Mazda Vans` → `mazda`, `Nissan Vans` → `nissan`, `Opel Vans` → `opel`, `Peugeot Vans` → `peugeot`, `Pontiac Vans` → `pontiac`, `Renault Vans` → `renault`, `Saturn Vans` → `saturn`, `Ssangyong Vans` → `ssangyong`, `Toyota Vans` → `toyota`, `VW Vans` → `vw` (note: `vw`, not `volkswagen` — another cars-vs-vans naming mismatch, see below)
- No suffix: LDV, MAN, SAIC

**Naming-mismatch caveat:** the same real marque is not always spelled identically between the
`cars` and `vans` lists after stripping suffixes — `Mercedes-Benz` (cars) vs `Mercedes` (vans),
`Volkswagen` (cars) vs `VW` (vans). If a normalizer is meant to unify both into one marque key
across vehicle types, it needs an explicit alias table (`vw` → `volkswagen`, `mercedes` →
`mercedes-benz`, etc.) — a plain suffix-strip alone is not sufficient for that case. This
doesn't block Phase 2 (Store API product names use full names like "Mercedes CLE Tuning" and
"Ford Transit Custom Tuning", so matching against the cars/vans list separately per vehicle-type
context works fine without needing to unify the two lists into one canonical marque key) but is
worth flagging if a future feature wants a single canonical marque list across both.

### Model-name pattern: AJAX `get_filter_models` vs. Store API product name

AJAX model names (already scoped under one marque via the `vehicle-make` param, so no marque
prefix):

- `"1 (E82 - 2011 - Present)"` (BMW 1 Series — includes a chassis code before the year range)
- `"B-Max (2012 - Present)"` (Ford)
- `"Tourneo Custom (2017 - Present)"` (Ford Vans)
- `"Transit Custom (2019 - Present ...)"` (Ford Vans — note the stray trailing `...`, a
  formatting glitch in Viezu's own data, not something to parse meaningfully)
- `"F-250 (- Present 2020)"` (Ford Vans — note the malformed/inverted year order, another
  Viezu data quirk)
- `"Sprinter (2000 - 2010)"` (Mercedes Vans)

Store API product names (from `store-api-page-*.json`, HTML-entity-encoded):

- `"Mercedes CLE Tuning (2023 &#8211; Present)"`
- `"Ford Transit Custom Tuning (2023 &#8211; Present)"`
- `"Ford Transit Courier Tuning (2023 &#8211; Present)"`

Differences, precisely:

1. **Marque prefix.** Store API names include the marque ("Ford Transit Custom"); AJAX model
   names don't (they're already scoped to one marque via `vehicle-make`). `normalizeMarqueName`
   handles the marque half separately — `normalizeModelName` only needs to handle the model half.
2. **The word "Tuning".** Store API names always include a literal `"Tuning"` word before the
   year parenthetical; AJAX model names never do.
3. **En-dash vs. hyphen.** Store API year ranges use the HTML entity `&#8211;` (decodes to `–`,
   U+2013 EN DASH); AJAX year ranges use a plain ASCII hyphen `-`.
4. **Year-range formatting is unreliable on the AJAX side** — inconsistent ordering (`"- Present
2020"` instead of `"2020 - Present"`), stray trailing punctuation (`"... "`), and the AJAX
   list's year ranges don't always match the Store API's for what's nominally the "same" vehicle
   (e.g. AJAX has `"Transit Custom (2019 - Present ...)"` while the Store API product for the
   same real van is `"Ford Transit Custom Tuning (2023 – Present)"` — 2019 vs. 2023 as the start
   year). **This confirms the brief's recommendation is correct and necessary**: match on
   normalized `(marque, base-model-name-without-year-range)`, not full-string or year-range
   equality — `normalizeModelName` should strip the entire trailing parenthetical (`/\s*\([^)]*\)\s*$/`)
   plus a trailing bare `"Tuning"` word, then lowercase/trim, and never attempt to compare or
   validate the year-range portion itself.

### Cross-vehicle-type marque check result

None of the four marques picked for the `get_filter_models` fixtures above (BMW cars, Ford cars,
Ford Vans, Mercedes-Benz Vans) has an **exact normalized-name collision** with the `bike-tuning`
or `hgv-tuning` brand lists: `BMW Motorrad` (bike) normalizes to `bmw motorrad`, not `bmw`
(`normalizeMarqueName` doesn't strip "Motorrad" — it's not one of the documented suffix
patterns), and `Ford Truck Tuning & ECU Remapping` / `Mercedes Truck Tuning & ECU Remapping`
(hgv) normalize to `ford truck` / `mercedes truck`, not `ford` / `mercedes`, for the same reason
("Truck" isn't a stripped suffix either).

However, a broader substring check (does the bare marque name "Ford" / "Mercedes" / "Suzuki"
appear _anywhere_ in another vehicle-type's brand list, ignoring suffix normalization) does turn
up real overlaps:

- `Ford Truck Tuning & ECU Remapping` (hgv-tuning) contains "Ford".
- `Mercedes Truck Tuning & ECU Remapping` (hgv-tuning) contains "Mercedes".
- **Suzuki is a genuine exact collision at the marque level**: `Suzuki Tuning & Remapping`
  (cars) normalizes to `suzuki`, and `Suzuki` (bike-tuning, bare, no suffix at all) _also_
  normalizes to `suzuki` — same normalized marque name, two different vehicle types.

To determine whether this actually breaks the (marque, model) matching key, `get_filter_models`
was fetched for the colliding marque under both vehicle types:

- **Suzuki cars** (`ajax-models-suzuki-tuning-remapping-cars.html`): Alto, Jimny, Kizashi,
  Liana, Splash, Swift (×3 year bands), SX4, SX4 S-Cross, Vitara (×2 year bands), XL7.
- **Suzuki bike-tuning** (`ajax-models-suzuki-27-bike-tuning.html`): B-King, Custom, Gladius,
  GSX, Naked, Sport Enduro Tourer, Street, Supersport, Suzuki VZR.
- **Ford truck** (`ajax-models-ford-truck-264-hgv-tuning.html`): Cargo, F-350, F-4000, F-750 —
  no overlap with Ford's car/van model names (B-Max, Transit Custom, Tourneo Custom, etc.).
- **Mercedes truck** (`ajax-models-mercedes-truck-291-hgv-tuning.html`): Accelo, Actros, Atego,
  Axor, Citaro, Cito, Conecto, Econic, Integro, Intouro, etc. — no overlap with Mercedes's
  car/van model names (CLE, Sprinter, etc.).

**Zero model-name overlap in every case checked**, despite marque-level name collisions being
real and not rare (at least 3 of ~85+23 marques collide: Suzuki, Ford, Mercedes-Benz — likely
more across the full list, e.g. any marque that makes both cars and HGVs/motorbikes).

**Recommendation: (marque, model) as a compound key is safe.** Marque name alone is _not_
reliably unique across vehicle types (multiple real collisions exist), but no evidence of any
model-name collision within a shared marque was found across cars/vans/hgv/bike — real model
names are specific enough to a body style/segment (hatchback names vs. HGV truck names vs.
motorcycle names) that they don't coincide in practice. `isInScopeVehicle` can safely check
membership of the full `(normalizedMarque, normalizedModel)` tuple in the `ScopeIndex` without
needing a third disambiguating signal.

**One implementation guardrail worth flagging for Phase 2:** `normalizeMarqueName` must strip
_only_ the specific documented suffix patterns above, not a looser pattern that would also match
vehicle-type-indicating words like "Truck", "Motorrad", "Van(s)" wherever they appear. The
compound-key safety demonstrated above depends on `Ford Truck Tuning & ECU Remapping` staying
distinct from `Ford Car Tuning & Remapping` at the marque-normalization stage — an
over-aggressive normalizer (e.g. one that strips any trailing "<Word> Tuning & ...Remapping"
pattern regardless of what `<Word>` is) would collapse `ford truck` down to `ford` too and
reintroduce exactly the ambiguity this check ruled out. Since Phase 3's `IN_SCOPE_WIDGET_VEHICLE_TYPES`
is `['cars', 'vans']` only (HGV/bike are never walked into the `ScopeIndex` at all), this
guardrail matters less for correctness today than for when HGV support is potentially added
later — flagging now so it isn't missed then.
