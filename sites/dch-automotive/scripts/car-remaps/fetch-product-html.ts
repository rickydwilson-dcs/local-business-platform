/**
 * Fetches a single product detail page and extracts its per-variation
 * performance data via Phase 2's `parseProductVariations`.
 */

import { parseProductVariations } from '../../lib/car-remaps/parsers';
import type { CatalogEntry, VariationPerformance } from '../../lib/car-remaps/types';
import { FETCH_TIMEOUT_MS, USER_AGENT } from './config';

export interface ProductFetchError {
  error: string;
  url: string;
}

/**
 * Fetches `entry.permalink` and parses its `data-product_variations` blob.
 * Never throws — catches HTTP errors and `parseProductVariations` parse
 * failures alike and returns an error record instead, so the orchestrator
 * (`sync.ts`) can collect failures across many products without a single bad
 * product aborting the whole run. The caller is responsible for checking the
 * collected failure count against `FAIL_FAST_THRESHOLD`.
 */
export async function fetchProductPerformanceData(
  entry: CatalogEntry
): Promise<VariationPerformance[] | ProductFetchError> {
  try {
    const res = await fetch(entry.permalink, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      return { error: `HTTP ${res.status}`, url: entry.permalink };
    }
    const html = await res.text();
    return parseProductVariations(html);
  } catch (err) {
    return { error: (err as Error).message, url: entry.permalink };
  }
}
