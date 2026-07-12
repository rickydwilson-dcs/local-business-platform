/**
 * Fetches the live Viezu `/dealer` widget's marque/model AJAX cascade
 * (`admin-ajax.php`, `get_filter_brands` / `get_filter_models`) and builds
 * the `ScopeIndex` used to determine which Store API catalog products are
 * in-scope (car or van) vehicle listings.
 *
 * See `lib/car-remaps/__fixtures__/README.md`'s "Scope mechanism
 * (2026-07-11)" section for the full investigation this is built against —
 * particularly the nonce mechanics and the `-1` nonce-failure response.
 */

import {
  buildScopeIndex,
  parseFilterBrandsResponse,
  parseFilterModelsResponse,
} from '../../lib/car-remaps/parsers';
import type { ScopeIndex, ScopeMarque, ScopeModel } from '../../lib/car-remaps/types';
import {
  FETCH_DELAY_MS,
  FETCH_TIMEOUT_MS,
  IN_SCOPE_WIDGET_VEHICLE_TYPES,
  USER_AGENT,
  VIEZU_DEALER_WIDGET_URL,
} from './config';

export interface Nonce {
  ajaxUrl: string;
  security: string;
}

/** Stats about the scope-index walk, populated in-place by `fetchScopeIndex`. */
export interface ScopeIndexStats {
  carsMarqueCount: number;
  vansMarqueCount: number;
  hgvMarqueCount: number;
  totalModelsCounted: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches the live `/dealer` widget page and extracts the page-load-scoped
 * `custom_product_filter = { ajaxurl: '...', security: '...' }` inline JS
 * object. Throws if the pattern isn't found (widget markup drift detector).
 */
export async function fetchNonce(): Promise<Nonce> {
  const res = await fetch(VIEZU_DEALER_WIDGET_URL, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`fetchNonce: HTTP ${res.status} fetching ${VIEZU_DEALER_WIDGET_URL}`);
  }
  const html = await res.text();

  const blockMatch = html.match(/custom_product_filter\s*=\s*\{([^}]*)\}/);
  if (!blockMatch) {
    throw new Error(
      'fetchNonce: could not find the custom_product_filter inline script variable on the /dealer page — widget markup may have drifted'
    );
  }
  const block = blockMatch[1];

  // Key may or may not be quoted (confirmed live: `{"ajaxurl":"...","security":"..."}` —
  // JSON-style quoted keys, not the bare-key JS object literal shown in early
  // investigation notes) — tolerate both.
  const ajaxUrlMatch = block.match(/ajaxurl["']?\s*:\s*['"]([^'"]+)['"]/);
  const securityMatch = block.match(/security["']?\s*:\s*['"]([^'"]+)['"]/);
  if (!ajaxUrlMatch || !securityMatch) {
    throw new Error(
      'fetchNonce: found custom_product_filter but could not extract ajaxurl/security fields — widget markup may have drifted'
    );
  }

  return { ajaxUrl: ajaxUrlMatch[1], security: securityMatch[1] };
}

async function postAjax(
  action: string,
  params: Record<string, string>,
  nonce: Nonce
): Promise<string> {
  const body = new URLSearchParams({ action, security: nonce.security, ...params });
  const res = await fetch(nonce.ajaxUrl, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`postAjax: HTTP ${res.status} for action=${action}`);
  }
  return res.text();
}

/** POSTs `get_filter_brands` for a given `vehicle-type` and parses the marque `<option>` list. */
export async function fetchFilterBrands(vehicleType: string, nonce: Nonce): Promise<ScopeMarque[]> {
  const text = await postAjax('get_filter_brands', { 'vehicle-type': vehicleType }, nonce);
  return parseFilterBrandsResponse(text);
}

/** POSTs `get_filter_models` for a given `vehicle-type` + marque slug and parses the model `<option>` list. */
export async function fetchFilterModels(
  vehicleType: string,
  makeSlug: string,
  nonce: Nonce
): Promise<ScopeModel[]> {
  const text = await postAjax(
    'get_filter_models',
    { 'vehicle-type': vehicleType, 'vehicle-make': makeSlug },
    nonce
  );
  return parseFilterModelsResponse(text);
}

function isNonceFailure(err: unknown): boolean {
  return err instanceof Error && /nonce/i.test(err.message);
}

/**
 * Orchestrates the full scope-index walk: fetches a nonce once, then for
 * each vehicle type in `IN_SCOPE_WIDGET_VEHICLE_TYPES` fetches its marque
 * list, then fetches models for every marque returned (with `FETCH_DELAY_MS`
 * between every request). If a nonce-failure error (`-1` response) surfaces
 * partway through the walk, refreshes the nonce once and retries that single
 * request before giving up.
 *
 * `stats`, if provided, is populated in-place with marque/model counts for
 * the sync manifest — kept as an optional out-param rather than changing the
 * return type so the primary `Promise<ScopeIndex>` signature stays simple
 * for callers that don't need the counts.
 */
export async function fetchScopeIndex(stats?: ScopeIndexStats): Promise<ScopeIndex> {
  let nonce = await fetchNonce();

  async function withNonceRetry<T>(fn: (n: Nonce) => Promise<T>): Promise<T> {
    try {
      return await fn(nonce);
    } catch (err) {
      if (!isNonceFailure(err)) throw err;
      console.warn('[car-remaps] nonce expired mid-walk — refreshing and retrying once');
      nonce = await fetchNonce();
      return fn(nonce);
    }
  }

  const marques: Record<(typeof IN_SCOPE_WIDGET_VEHICLE_TYPES)[number], ScopeMarque[]> = {
    cars: [],
    vans: [],
    'hgv-tuning': [],
  };

  for (const vehicleType of IN_SCOPE_WIDGET_VEHICLE_TYPES) {
    const list = await withNonceRetry((n) => fetchFilterBrands(vehicleType, n));
    marques[vehicleType] = list;
    console.log(`[car-remaps] fetched ${list.length} marques for vehicle-type=${vehicleType}`);
    await sleep(FETCH_DELAY_MS);
  }

  const allMarques: Array<{
    slug: string;
    name: string;
    vehicleType: (typeof IN_SCOPE_WIDGET_VEHICLE_TYPES)[number];
  }> = IN_SCOPE_WIDGET_VEHICLE_TYPES.flatMap((vehicleType) =>
    marques[vehicleType].map((m) => ({ ...m, vehicleType }))
  );

  const modelsByMarque = new Map<string, ScopeModel[]>();
  let completed = 0;
  let totalModelsCounted = 0;

  for (const marque of allMarques) {
    let models: ScopeModel[];
    try {
      models = await withNonceRetry((n) => fetchFilterModels(marque.vehicleType, marque.slug, n));
    } catch (err) {
      if (isNonceFailure(err)) {
        // A nonce failure that survives withNonceRetry's one refresh-and-retry
        // means the nonce mechanism itself is broken (not just stale) —
        // that's a systemic problem worth aborting the whole walk for.
        throw err;
      }
      // A genuine live-data quirk, confirmed against `Mitsubishi Fuso`
      // (`cars` vehicle-type, slug `mitsubishi-fuso-116`): it's listed in the
      // marque cascade but its own `get_filter_models` response consistently
      // parses to zero <option>s — not a nonce failure, not transient (two
      // separate live fetches both returned the same empty result). Phase 2's
      // `parseFilterModelsResponse` intentionally throws on this (so it can't
      // be silently confused with a real nonce failure) rather than returning
      // `[]` itself, so this is the one place that turns "confirmed
      // zero-model marque" into an actual empty model set instead of letting
      // one marque's data gap crash the entire 100+-marque walk.
      console.warn(
        `[car-remaps] WARNING: zero models for marque "${marque.name}" (${marque.slug}, vehicle-type=${marque.vehicleType}) — treating as a zero-model marque and continuing: ${(err as Error).message}`
      );
      models = [];
    }
    modelsByMarque.set(marque.slug, models);
    totalModelsCounted += models.length;
    completed += 1;
    console.log(
      `[car-remaps] fetched models for ${completed}/${allMarques.length} marques (${marque.name}: ${models.length} models)`
    );
    await sleep(FETCH_DELAY_MS);
  }

  if (stats) {
    stats.carsMarqueCount = marques.cars.length;
    stats.vansMarqueCount = marques.vans.length;
    stats.hgvMarqueCount = marques['hgv-tuning'].length;
    stats.totalModelsCounted = totalModelsCounted;
  }

  return buildScopeIndex(
    { cars: marques.cars, vans: marques.vans, hgv: marques['hgv-tuning'] },
    modelsByMarque
  );
}
