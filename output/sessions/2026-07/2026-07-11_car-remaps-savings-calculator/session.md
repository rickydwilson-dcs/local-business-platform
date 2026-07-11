# Session: 2026-07-11_car-remaps-savings-calculator

**Start Date:** 2026-07-11
**Status:** Completed
**Objective:** Make the DCH Automotive `/car-remaps` Savings Calculator vehicle-aware (use real per-vehicle `fuelSaving` data instead of a manual efficiency-gain slider) and auto-populate the fuel price from a live UK source instead of a static hardcoded default.

## Summary

The calculator (`components/fuel-savings-calculator.tsx`) was a generic fleet-level tool completely disconnected from the real vehicle data already synced from Viezu and already exposed via the Ready Reckoner section further down the same page. This session:

1. Rewired the calculator to a single-vehicle model, embedding the existing `CarRemapsSelectors` component (same one used by the Ready Reckoner) so the customer picks their exact make/model/fuel type/variant, and the efficiency gain used in the savings math comes from that vehicle's real `fuelSaving` percentage.
2. Added a new `lib/fuel-prices/` module that fetches DESNZ's official weekly UK average petrol/diesel price feed (data.gov.uk open data) at request time via a Next.js API route, cached with `revalidate: 604800` (weekly), with a hardcoded fallback if the fetch/parse ever fails.

## Key Decisions

- **Single vehicle, not fleet** — user confirmed the calculator should reflect one specific vehicle's savings, not a fleet-size-multiplied estimate. Fleet size input removed entirely.
- **Reuse `CarRemapsSelectors` as a second independent instance**, rather than merging with the Ready Reckoner section or building a new selector — user confirmed. The two sections stay visually/functionally separate.
- **Weekly gov.uk open data feed, not a real-time API** — the only genuinely real-time UK fuel price source (CMA's "Fuel Finder" API) requires formal accreditation as a registered data recipient, judged out of scope. The DESNZ weekly feed is free, official (OGL v3.0), and the user explicitly accepted the weekly-not-daily cadence after this tradeoff was surfaced.
- **No new cron/scheduled-job infrastructure** — this repo has none (confirmed: no GitHub Actions `schedule:`, no Vercel `crons` anywhere), and the car-remaps catalogue sync deliberately stays manual/commit-based. Rather than being the first feature to add a bot-commit cron pipeline for one number, the fuel price is fetched live at request time with Next's built-in `fetch()` revalidation — matches the existing `/api/car-remaps/lookup` route's caching philosophy without inventing new automation.
- **CO2 constant made fuel-type-aware** (petrol 2.31 kg/L vs diesel 2.68 kg/L) instead of the old hardcoded diesel-only assumption, since the resolved vehicle's real fuel type is now known.

## Files Modified

- `sites/dch-automotive/components/fuel-savings-calculator.tsx` — full rewrite: single-vehicle, `CarRemapsSelectors`-driven, real `fuelSaving` %, auto-filled fuel-type-aware fuel price.
- `sites/dch-automotive/lib/fuel-prices/types.ts` — new: `FuelPriceSnapshot` type + `FUEL_PRICE_FALLBACK` constant.
- `sites/dch-automotive/lib/fuel-prices/fetch.ts` — new: `fetchLatestFuelPrices()`, scrapes + parses the DESNZ workbook, fails safe to the fallback.
- `sites/dch-automotive/app/api/fuel-prices/current/route.ts` — new: thin GET route.
- `sites/dch-automotive/package.json` — added `xlsx` dependency (no spreadsheet-parsing library existed anywhere in the monorepo before this).
- `sites/dch-automotive/docs/car-remaps-runbook.md` — new §7 documenting the fuel-price module, its verified real data structure, and its fail-safe behavior.
- `sites/dch-automotive/CLAUDE.md` — added a `lib/fuel-prices/` bullet to the "Car Remaps Subsystem" section.

## Next Steps

- [x] Run verification gates (type-check, build, lint) for `dch-automotive` — all pass.
- [x] Verify `/api/fuel-prices/current` against the running dev server — returns real gov.uk data (petrol 149.80p, diesel 164.77p, week ending 2026-07-06).
- [x] Verify the full `/api/car-remaps/lookup` cascade against a real multi-generation vehicle (Ford F-250, two `sourceProductId`s both offering Diesel 6.7) — confirmed `findMatchingVariation()`'s "take the first match" behavior resolves correctly, and that an empty `fuelSaving` value (e.g. the F-250's Petrol 6.2 variation) correctly falls through to the "no data" state rather than a bogus 0%/NaN.
- [x] Server-rendered HTML of `/car-remaps` confirmed to contain the new calculator markup (labels, empty-state copy, selector `id`s).
- [x] Committed on `feature/car-remaps-savings-calculator`, merged to `develop`, promoted `develop → staging → main` via `/deploy.changes` — all CI/E2E/watchdog gates green at every step.

## Follow-up: HGV scope added (same day, `feature/car-remaps-hgv-scope`)

User asked whether vans and lorries were both covered by the Car Remaps catalogue. Vans: yes.
Lorries: no — `IN_SCOPE_WIDGET_VEHICLE_TYPES` was deliberately `['cars', 'vans']` only from the
original build. Added `'hgv-tuning'`, which required generalizing `buildScopeIndex()` and
`fetch-marques.ts` beyond their hardcoded `{cars, vans}` shape (previously never designed for a
third vehicle type, despite a code comment anticipating it).

**Bugs found and fixed along the way** (see `docs/car-remaps-runbook.md` §5 for full detail):

1. `isInScopeVehicle()`'s marque-prefix fallback split on spaces as well as hyphens — safe before
   (no space-separated marque ever shared a first word with an independently-scoped marque), but
   HGV introduced exactly that case (`"Ford Truck"` vs. car `"Ford"`), causing a real false-positive
   risk. Caught immediately by a new fixture-based unit test before ever running live. Fixed by
   restricting the fallback to hyphens only.
2. The sync had no fetch timeout anywhere — confirmed live when a sync run hung 10+ minutes on one
   unresponsive Viezu page (`lsof` showed an `ESTABLISHED` connection that never responded). Added
   a 30s `AbortSignal.timeout` to all three live-fetch call sites.
3. The sync never deleted stale make files for marques that dropped out of scope between runs —
   found when a transient scope-fetch failure for one marque (Jaecoo) left an orphaned file from
   an earlier run. Fixed: `sync.ts` now removes any `makes/*.json` file not in the current run's
   output.

**Operational lesson, not just a code fix:** after the transient Jaecoo failure, the instinct was
to just re-run the entire ~2,000-request live sync to recover 2 vehicles — the user correctly
pushed back on this as disproportionate. Course-corrected to: accept the first (already-valid)
sync's output, delete the one orphaned file by hand, and document the gap rather than re-hammering
a third-party site for a tiny, isolated loss. Documented this judgment call directly in the runbook
(§1) so a future session doesn't repeat the same overkill instinct.

**Result:** 1,598 → 1,887 vehicles, 83 → 144 makes, 61 new HGV makes (DAF, Scania, MAN, Volvo
Trucks, Mercedes Truck, Ford Truck, Kenworth, Peterbilt, Mack, Western Star, and more). Verified
via a fresh dev server (a stale one, running since before this session's `pnpm build`, briefly
gave false-positive 500s from cache corruption — restarting it cleanly resolved that and confirmed
everything working end to end).

## Notes

Verified the real DESNZ workbook structure directly (downloaded the live `weekly_road_fuel_prices_060726.xlsx`) rather than trusting web-search summaries — an initial web search suggested petrol ~156p/diesel ~188p for the relevant period, but the actual source file showed petrol 149.80p/diesel 164.77p for the week ending 2026-07-06. The parser locates the header row and petrol/diesel columns by text matching (not hardcoded indices), so it should tolerate minor future changes to the workbook's column layout.

The HGV scope addition is a good example of why fixture-based tests (real Viezu HTML, not synthetic
data) earn their keep: the first version of the new HGV test used a model name ("F-350") that
turned out to genuinely collide across two real marques in Viezu's own data — not a bug, just a
bad test example — and a _second_, real bug (the space-splitting fallback) was only found because
the corrected test still failed after fixing the first false alarm.
