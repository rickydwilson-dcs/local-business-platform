/**
 * Types for the Viezu catalogue parsers (`parsers.ts`).
 *
 * These model the real data shapes confirmed against live fixtures in
 * `__fixtures__/` (see `__fixtures__/README.md` for the full data-shape
 * investigation) — the WooCommerce Store API product catalogue, the
 * `data-product_variations` performance-data blob embedded in product
 * detail pages, and the `admin-ajax.php` marque/model cascade used by the
 * live `/dealer` widget to scope which vehicles are in-scope (cars + vans).
 */

/** One product from a WooCommerce Store API catalogue page. */
export interface CatalogEntry {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  categories: string[];
  attributes: {
    fuelTypes: string[];
    variants: string[];
  };
}

/**
 * Conservative model for Viezu's pipe-delimited numeric fields
 * (`original_bhp`, `power_bhp`, `original_torque`, `torque_nm`,
 * `economy_gain_bhp`, `economy_gain_nm`, `fuel_saving`, etc.).
 *
 * Confirmed (see fixtures README): when a single WooCommerce variation
 * bundles more than one real-world engine state-of-tune, Viezu encodes each
 * sub-variant as a `" | "`-separated position, positionally aligned across
 * every field on that variation.
 */
export interface PipeValue {
  raw: string;
  parsedValues: string[];
  primaryValue: string;
  secondaryValue?: string;
}

/**
 * One WooCommerce variation's performance data, decoded from the
 * `data-product_variations` attribute.
 *
 * NOTE on naming (Viezu's own inconsistency, not introduced here):
 * `power_bhp` / `torque_nm` are named as if absolute figures but are
 * actually the *gain* from the remap; `original_bhp` / `original_torque`
 * are the pre-remap absolute figures.
 */
export interface VariationPerformance {
  fuelType: string;
  variant: string;
  originalBhp: PipeValue;
  powerBhpGain: PipeValue;
  originalTorque: PipeValue;
  torqueNmGain: PipeValue;
  economyGainBhp: PipeValue;
  economyGainNm: PipeValue;
  fuelSaving: PipeValue;
  displayPriceCents: number;
}

/** A fully parsed, catalogue-sync-ready vehicle (Phase 3 consumer). */
export interface NormalizedVehicle {
  make: string;
  model: string;
  modelSlug: string;
  sourceProductId: number;
  sourceUrl: string;
  variations: VariationPerformance[];
}

/** One `<option>` from a `get_filter_brands` AJAX response. */
export interface ScopeMarque {
  slug: string;
  name: string;
}

/** One `<option>` from a `get_filter_models` AJAX response. */
export interface ScopeModel {
  slug: string;
  name: string;
}

/**
 * Normalized (marque, model) pairs considered in-scope for the car-remaps
 * catalogue, built from the live `cars` + `vans` AJAX marque/model cascade.
 *
 * Shape: `Map<normalizedMarque, Set<normalizedModel>>`. Marque keys are
 * merged across the `cars` and `vans` vehicle-type lists when they
 * normalize to the same string (e.g. "Ford Car Tuning & Remapping" and
 * "Ford Vans Tuning & ECU Remapping" both normalize to `"ford"`); when they
 * don't (the confirmed `Mercedes-Benz`/`Mercedes` and `Volkswagen`/`VW`
 * cars-vs-vans naming mismatches), they remain distinct keys — see fixtures
 * README's "Naming-mismatch caveat".
 */
export type ScopeIndex = Map<string, Set<string>>;
