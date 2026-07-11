/**
 * Walks the live Viezu WooCommerce Store API catalogue
 * (`GET /wp-json/wc/store/v1/products`), page by page, returning every
 * product found. No filtering happens here — category-exclusion and
 * marque/model scope filtering both need the `ScopeIndex` from
 * `fetch-marques.ts`, so `sync.ts` applies both filters together (and logs
 * the funnel) once the full raw catalog and the scope index are both
 * available.
 */

import { parseStoreApiPage } from '../../lib/car-remaps/parsers';
import type { CatalogEntry } from '../../lib/car-remaps/types';
import { FETCH_DELAY_MS, FETCH_TIMEOUT_MS, USER_AGENT } from './config';

const STORE_API_URL = 'https://viezu.com/wp-json/wc/store/v1/products';
const PER_PAGE = 100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches every page of the Store API catalogue from page 1 until a page
 * returns fewer than `PER_PAGE` results (falling back to the `X-WP-TotalPages`
 * response header when present for an authoritative stop condition).
 */
export async function fetchAllCatalogPages(): Promise<CatalogEntry[]> {
  const allEntries: CatalogEntry[] = [];
  let page = 1;

  for (;;) {
    const url = `${STORE_API_URL}?page=${page}&per_page=${PER_PAGE}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`fetchAllCatalogPages: HTTP ${res.status} fetching page ${page} (${url})`);
    }
    const rawJson = await res.text();
    const entries = parseStoreApiPage(rawJson);
    allEntries.push(...entries);

    const totalPagesHeader = res.headers.get('X-WP-TotalPages');
    const totalPages = totalPagesHeader ? Number(totalPagesHeader) : undefined;

    console.log(
      `[car-remaps] fetched catalog page ${page}${totalPages && !Number.isNaN(totalPages) ? `/${totalPages}` : ''} (${entries.length} products, ${allEntries.length} total so far)`
    );

    const isLastByHeader =
      totalPages !== undefined && !Number.isNaN(totalPages) && page >= totalPages;
    const isLastByCount = entries.length < PER_PAGE;

    if (isLastByHeader || isLastByCount) {
      break;
    }

    page += 1;
    await sleep(FETCH_DELAY_MS);
  }

  return allEntries;
}
