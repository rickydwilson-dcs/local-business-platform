# DCH Automotive - Deployment History

Vehicle security, fleet electrics and ECU remapping installer serving the South East (Polegate/Eastbourne/Hailsham), migrated from a standalone WordPress site. Scaffolded from `sites/base-template` — entries before 2026-07 describe that shared template history, inherited at the time of copy.

---

## 2026-07-11

### Features

- **Car Remaps rebuilt around DCH-owned data, replacing the embedded Viezu iframe.** The `/car-remaps` page now has an interactive ready reckoner (cascading Make → Model → Fuel Type → Variant selectors backed by a progressive JSON API) instead of a third-party widget. New crawlable per-make AEO pages (`/car-remaps/[make]`, ~144 statically generated) render real server-side performance tables plus `Product`/`Service` JSON-LD. A new public JSON API (`/api/car-remaps/lookup`) and an MCP endpoint (`/api/[transport]`, `lookup_vehicle_tuning` tool) both read through one shared repository (`lib/car-remaps/repository.ts`), so there's no duplicated lookup logic. A new `llms.txt` documents both for LLM agents.
- **Lorries/HGVs added to the Car Remaps catalogue scope, alongside cars and vans.** The original build deliberately scoped the sync to `cars`+`vans` only; HGV was added same day once real demand for van/lorry savings data showed up (see the Savings Calculator entry below). 61 new HGV makes synced — DAF, Scania, MAN, Volvo Trucks, Mercedes Truck, Ford Truck, Kenworth, Peterbilt, Mack, Western Star and more — taking the catalogue from 1,598 vehicles (83 makes) to 1,887 (144 makes). HGV marques normalize to a distinct key from their car/van namesake (e.g. `"ford truck"` vs `"ford"`), confirmed collision-free by a new executable test suite. See `docs/car-remaps-runbook.md` §5.
- **Vehicle scope determination uses Viezu's own live vehicle-finder widget, not WooCommerce categories.** Categories were tried first and rejected — real investigation found the two largest category buckets mix cars, vans, and motorbikes with no clean split. The sync pipeline instead walks Viezu's `/dealer` widget's own AJAX cascade (`get_filter_brands`/`get_filter_models`) to build an authoritative (marque, model) scope index. See `docs/car-remaps-runbook.md` for the full mechanism, its data-quality risks, and how to re-run the sync.
- A new manual sync pipeline (`pnpm --filter dch-automotive run car-remaps:sync`, `scripts/car-remaps/`) walks Viezu's live catalogue (~3,200 products) and writes the committed `data/car-remaps/` dataset the site reads at build/runtime — not a live API call per page.
- **The `/car-remaps` Savings Calculator is now vehicle-aware, using real per-vehicle data instead of a guessed slider.** It embeds the same cascading Make/Model/Fuel Type/Variant selector as the ready reckoner, and once a customer picks their exact vehicle, the savings math uses that vehicle's real Viezu-quoted `fuelSaving` percentage rather than a manual 5-20% slider with no vehicle context. The fuel price field auto-fills from a new live UK average petrol/diesel price source (`lib/fuel-prices/`, served via `/api/fuel-prices/current`) — sourced from DESNZ's official weekly open-data feed (data.gov.uk), cached for a week at a time, and falling back to a hardcoded value if the source ever changes shape. See `docs/car-remaps-runbook.md` §7 for the full mechanism and why a live-fetch approach was chosen over a cron/committed-JSON pipeline.

### Fixes

- Two scope-matching bugs found and fixed the same day, both silently excluding real in-scope vehicles from the initial sync: a marque-abbreviation mismatch (Volkswagen cars use the "VW" abbreviation in Viezu's product names but the full "Volkswagen" spelling in the AJAX marque list) and a model-name normalizer that failed to strip a suffix pattern repeated after the year-range parenthetical on many product names (not VW-specific — affected nearly every marque). Re-synced after both fixes: in-scope vehicle count rose from 1,518 to 1,598 (+80), VW alone from 1 to 81 real models, and enrichment failures dropped from 6 to 0.
- Two more bugs found and fixed while adding HGV scope: (1) the scope-matcher's marque-prefix fallback split on spaces as well as hyphens, which could have misattributed a plain car product to an unrelated space-separated HGV marque sharing its first word (e.g. a plain "Ford F-4000" product matching under "Ford Truck") — now hyphen-only, matching its original intent (Mercedes-Benz/Mercedes-style spelling variants only); (2) the sync had no request timeout anywhere, so a single unresponsive Viezu page could hang the whole run indefinitely (confirmed live — a run stalled 10+ minutes on one silent connection) — every live fetch now has a 30s timeout and counts as a normal failure rather than hanging. Also fixed: the sync never deleted stale make files for marques that dropped out of scope between runs, so `data/car-remaps/makes/` could accumulate orphaned files.

---

## 2026-07-09

### Redesign & Launch

- Full visual redesign into a bespoke dark/orange, self-contained theme (no `@platform/themes/*` import) — see `theme.config.ts`
- Bespoke `ContactForm` (last generic UI component on the site) replacing the shared `@platform/core-components` version
- Real Car Remaps catalogue (Stage 1-3, Economy Tuning/BlueOptimize, Performance Tuning, Gearbox Tuning) as a Viezu Approved Dealer, with the embedded Viezu dealer-finder widget
- Real location content for Eastbourne, Polegate and Hailsham, replacing base-template placeholder locations
- Migrated the WordPress service catalogue per the client's keep/delete list: Vehicle Security (Bike Security merged in, Alarms removed), Parking Aids, Fleet Solutions (rebuilt around ViewMeLive's real categories), Accessories, and a new Dash Cameras category; **Tow Bars deleted entirely** per client instruction
- Site-specific `vercel.json` and `.env.example` prepared for first Vercel deployment, targeting the Vercel-assigned URL pending `dchautomotive.co.uk` domain cutover

### Fixes

- `-webkit-autofill` CSS override so browser-autofilled contact form fields (name/email/phone) keep white text legible against the dark theme
- Real hero imagery added to all three location pages (previously a placeholder icon)
- Dead `<button>` elements on the homepage and Car Remaps hero wired to real destinations
- Homepage hero heading/subtext/buttons resized down from an oversized all-caps treatment
- Removed lingering Tow Bars and Alarms references that survived into location-page copy and the homepage credentials strip after those services were deleted from the service catalogue during migration; trade-certification count corrected 7 → 6
- `CLAUDE.md` rewritten to describe this site's actual architecture (bespoke homepage/Car Remaps pages, dark theme, bespoke ContactForm) — was still the unmodified `base-template` guide
- All images (35 files: stock photography, Viezu marketing assets, site logo) migrated from local `public/` to the shared platform R2 bucket under the `dch-automotive/` key prefix, via new `tools/upload-dch-automotive-to-r2.ts`; every render call site now resolves through `getImageUrl()`

### Content

- `/car-remaps` expanded with a "What Is ECU Remapping?" explainer, a benefits section, and a 12-question FAQ covering legality, insurance, warranty, reversibility, Stage 1-3 differences and emissions/MOT compliance — with `FAQPage` JSON-LD

### Known Gaps

- `/reviews` still serves generic base-template placeholder testimonials; homepage testimonials are explicitly marked as samples pending real client quotes
- All imagery site-wide is still the Stitch-generated stock set, not real DCH photography — R2-hosted now, but not yet client-specific

---

## 2026-02-08

### Content

- Content schemas now imported from @platform/core-components (deduplication completed)
- Location MDX frontmatter aligned to canonical schema (heading→title, subheading→description, cta→ctaText/ctaUrl)

---

## 2026-02-07

### Features

- Supabase rate limiter integration (centralised from core-components)
- Focus trap for mobile menu and consent manager
- brand-primary theme tokens (replacing brand-blue)

### Content

- Location data moved to MDX frontmatter (coordinates, region, isCounty)

---

## 2025-12-21

### Launch

- Base template created as copy-and-customise foundation for new sites
- Theme system integration with `theme.config.ts`
- Complete site structure: app routes, components, content directory, lib utilities
- Example content: services, locations, blog posts, projects, testimonials
- Content validation system with Zod schemas
- Schema.org JSON-LD generators
