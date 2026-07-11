/**
 * Config constants for the Viezu catalog sync pipeline (Phase 3).
 *
 * See `lib/car-remaps/__fixtures__/README.md` for the full investigation
 * behind these values — the "Car + Van category scope decision" section
 * for `EXCLUDED_NON_VEHICLE_CATEGORIES`, and the "Scope mechanism
 * (2026-07-11)" section for the AJAX marque/model cascade this pipeline
 * uses instead of a category include-list.
 */

/**
 * Unambiguous non-vehicle categories (tools, cables, accessories,
 * performance parts) — confirmed in the fixtures README's "Car + Van
 * category scope decision" section. This is the unchanged, always-solid
 * part of the original category-exclusion approach: an exclusion-only
 * list, never an include-list for vehicle scope (that job belongs to the
 * AJAX marque/model `ScopeIndex`, see `fetch-marques.ts`).
 */
export const EXCLUDED_NON_VEHICLE_CATEGORIES = [
  'Professional Tuning Tools Hardware & Software',
  'Cables & Accessories',
  'Alientech Cables & Accessories',
  'Alientech Tuning Tools',
  'Alientech KESS3 Tuning Tools',
  'Alientech ECM Titanium',
  'Alientech Powergate',
  'Bench & Boot Cables',
  'Agriculture Cables - Truck & Buses',
  'Bike Cables - ATV & UTV',
  'Car Cables - LCV',
  'Dimsport',
  'Dimsport Cables & Accessories',
  'Autotuner Professional Tools',
  'Autotuner Cables & Accessories',
  'Autotuner The One',
  'Magic Motorsport',
  'Magic Motorsport Cables & Accessories',
  'Tuning Accessories',
  'Tuning Tools',
  'Tuning Tool Subscription Renewals',
  'Vehicle Tuning Software',
  'EVC WinOLS',
  'VC Power Swiftec Tuning Software',
  'Swiftec',
  'Diagnostic Tools',
  'Battery Stablizer / Charger',
  'Bench Stands',
  'DIY Tuning Devices',
  'DIY Tuning Devices V-Switch',
  'V-Switch',
  'VIEZU V-Box',
  'Tuning Box',
  'JB4 Tuning Device',
  'Vehicle Performance Parts and Styling',
  'PWR Cooling',
  'Supercharger Pulley',
  'Charger cooler',
  'Supercharge cooler',
  'Carbon Fibre Performance Parts',
  'TAROX Brakes',
  'VIP Design London',
  'VIP Design Jaguar Packages',
  'Performance Exhaust Systems',
  'Paramount Performance Exhausts',
  'Milltek Performance Exhausts',
] as const;

/**
 * `vehicle-type` values to walk via the `admin-ajax.php` marque/model
 * cascade for scope determination. Structured as a plain array so HGV
 * (`hgv-tuning`) could be added later by appending one entry — a config
 * switch, not a plugin system. See the fixtures README's marque-collision
 * guardrail before ever adding `hgv-tuning` or `bike-tuning` here.
 */
export const IN_SCOPE_WIDGET_VEHICLE_TYPES = ['cars', 'vans'] as const;

/**
 * The live `/dealer` widget page whose inline JS carries the page-load-scoped
 * nonce (`custom_product_filter.security`) needed to call the
 * `admin-ajax.php` `get_filter_brands` / `get_filter_models` actions. Same
 * URL already embedded as the iframe `src` in `app/car-remaps/page.tsx`
 * before this rebuild.
 */
export const VIEZU_DEALER_WIDGET_URL =
  'https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace';

/** Polite delay between successive live HTTP requests (ms). */
export const FETCH_DELAY_MS = 400;

/** User-Agent sent on every live request (matches the fixture-capture policy). */
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/**
 * Abort the sync (no output files written) if more than this fraction of
 * in-scope product-detail fetches fail to parse. `0.1` = 10%.
 */
export const FAIL_FAST_THRESHOLD = 0.1;
