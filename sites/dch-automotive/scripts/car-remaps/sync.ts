#!/usr/bin/env tsx

/**
 * Viezu catalog sync orchestrator (Phase 3).
 *
 * Pass A (catalog): walk the live scope index (marque/model AJAX cascade)
 * and the full Store API catalogue.
 * Pass B (enrichment): fetch per-product performance data for every
 * in-scope entry.
 * Normalize: group into per-make `NormalizedVehicle[]` and write JSON data
 * files, with a fail-fast threshold to catch upstream markup drift before
 * writing partial/broken output.
 *
 * Usage: `npm run car-remaps:sync` (from `sites/dch-automotive/`), or
 * `pnpm --filter dch-automotive run car-remaps:sync` from the repo root.
 */

import fs from 'fs';
import path from 'path';

import { filterInScopeCategories, isInScopeVehicle } from '../../lib/car-remaps/parsers';
import type {
  CatalogEntry,
  NormalizedVehicle,
  VariationPerformance,
} from '../../lib/car-remaps/types';
import { FAIL_FAST_THRESHOLD } from './config';
import { fetchScopeIndex, type ScopeIndexStats } from './fetch-marques';
import { fetchAllCatalogPages } from './fetch-store-api';
import { fetchProductPerformanceData, type ProductFetchError } from './fetch-product-html';
import { groupByMake } from './normalize';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'car-remaps');
const MAKES_DIR = path.join(OUTPUT_DIR, 'makes');
const SOURCE_URL = 'https://viezu.com';

function isFetchError(
  value: VariationPerformance[] | ProductFetchError
): value is ProductFetchError {
  return !Array.isArray(value);
}

async function main(): Promise<void> {
  const generatedAt = new Date().toISOString();

  // ── Step 1: scope index (marque/model AJAX cascade) ──────────────────────
  console.log('[car-remaps] Step 1/4: walking the live marque/model scope index...');
  const scopeIndexStats: ScopeIndexStats = {
    carsMarqueCount: 0,
    vansMarqueCount: 0,
    hgvMarqueCount: 0,
    totalModelsCounted: 0,
  };
  const scopeIndex = await fetchScopeIndex(scopeIndexStats);
  console.log(
    `[car-remaps] scope index built: ${scopeIndexStats.carsMarqueCount} car marques, ${scopeIndexStats.vansMarqueCount} van marques, ${scopeIndexStats.hgvMarqueCount} HGV marques, ${scopeIndexStats.totalModelsCounted} models counted`
  );

  // ── Step 2: full catalog walk ─────────────────────────────────────────────
  console.log('[car-remaps] Step 2/4: fetching the full Store API catalog...');
  const catalog = await fetchAllCatalogPages();
  console.log(`[car-remaps] catalog fetched: ${catalog.length} total products`);

  // ── Step 3: filter — category exclusion, then marque/model scope match ───
  const afterCategoryFilter = catalog.filter((entry) => filterInScopeCategories(entry.categories));
  const afterScopeFilter = afterCategoryFilter.filter((entry) =>
    isInScopeVehicle(entry.name, scopeIndex)
  );

  const totalFetched = catalog.length;
  const totalExcludedByCategory = totalFetched - afterCategoryFilter.length;
  const totalExcludedByScope = afterCategoryFilter.length - afterScopeFilter.length;
  const totalInScope = afterScopeFilter.length;

  console.log(
    `[car-remaps] filter funnel: ${totalFetched} total -> ${afterCategoryFilter.length} after category exclusion (-${totalExcludedByCategory}) -> ${totalInScope} after marque/model scope match (-${totalExcludedByScope})`
  );

  // ── Step 4: per-product performance data ──────────────────────────────────
  console.log(
    `[car-remaps] Step 3/4: fetching performance data for ${totalInScope} in-scope products...`
  );
  const successes: Array<CatalogEntry & { variations: VariationPerformance[] }> = [];
  const failures: ProductFetchError[] = [];

  let attempted = 0;
  for (const entry of afterScopeFilter) {
    const result = await fetchProductPerformanceData(entry);
    attempted += 1;

    if (isFetchError(result)) {
      failures.push(result);
      console.warn(
        `[car-remaps]   [${attempted}/${totalInScope}] FAILED ${entry.name}: ${result.error}`
      );
    } else {
      successes.push({ ...entry, variations: result });
      if (attempted % 25 === 0 || attempted === totalInScope) {
        console.log(
          `[car-remaps]   [${attempted}/${totalInScope}] fetched (${failures.length} failures so far)`
        );
      }
    }
  }

  const totalFailed = failures.length;
  const failureRate = attempted > 0 ? totalFailed / attempted : 0;

  console.log(
    `[car-remaps] performance-data fetch complete: ${successes.length} succeeded, ${totalFailed} failed (${(failureRate * 100).toFixed(1)}%)`
  );

  // ── Fail-fast check ────────────────────────────────────────────────────────
  if (failureRate > FAIL_FAST_THRESHOLD) {
    console.error('');
    console.error(
      `[car-remaps] ABORT: failure rate ${(failureRate * 100).toFixed(1)}% exceeds FAIL_FAST_THRESHOLD (${(FAIL_FAST_THRESHOLD * 100).toFixed(0)}%). No output files written.`
    );
    console.error('[car-remaps] Failed URLs:');
    for (const failure of failures) {
      console.error(`  - ${failure.url}: ${failure.error}`);
    }
    process.exit(1);
  }

  // ── Step 5: normalize + write output ──────────────────────────────────────
  console.log('[car-remaps] Step 4/4: normalizing and writing output files...');
  const grouped = groupByMake(successes, scopeIndex);

  fs.mkdirSync(MAKES_DIR, { recursive: true });

  const makeSlugs = Array.from(grouped.keys()).sort();

  // Remove stale make files left over from a previous run whose marque is no
  // longer in scope this run (e.g. a transient scope-index fetch failure, or
  // a marque genuinely delisted upstream) — otherwise `data/car-remaps/makes/`
  // accumulates orphaned files that no longer match `index.json`.
  const makeSlugSet = new Set(makeSlugs);
  const staleFiles = fs
    .readdirSync(MAKES_DIR)
    .filter((file) => file.endsWith('.json') && !makeSlugSet.has(file.slice(0, -'.json'.length)));
  for (const file of staleFiles) {
    fs.unlinkSync(path.join(MAKES_DIR, file));
    console.log(`[car-remaps] removed stale make file no longer in scope: ${file}`);
  }

  const indexMakes: Array<{ slug: string; name: string; modelCount: number }> = [];

  for (const makeSlug of makeSlugs) {
    const vehicles = grouped.get(makeSlug) as NormalizedVehicle[];
    fs.writeFileSync(
      path.join(MAKES_DIR, `${makeSlug}.json`),
      JSON.stringify(vehicles, null, 2),
      'utf-8'
    );
    indexMakes.push({
      slug: makeSlug,
      name: vehicles[0]?.make ?? makeSlug,
      modelCount: vehicles.length,
    });
  }

  const manifest = {
    generatedAt,
    sourceUrl: SOURCE_URL,
    totalFetched,
    totalExcludedByCategory,
    totalExcludedByScope,
    totalInScope,
    totalFailed,
    failedUrls: failures.map((f) => f.url),
    makes: makeSlugs,
    scopeIndexStats,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify({ makes: indexMakes }, null, 2),
    'utf-8'
  );

  // ── Summary ─────────────────────────────────────────────────────────────
  const totalModels = indexMakes.reduce((sum, m) => sum + m.modelCount, 0);
  console.log('');
  console.log('[car-remaps] ==================== SUMMARY ====================');
  console.log(`[car-remaps] Generated at:              ${generatedAt}`);
  console.log(
    `[car-remaps] Scope index:                ${scopeIndexStats.carsMarqueCount} car marques, ${scopeIndexStats.vansMarqueCount} van marques, ${scopeIndexStats.hgvMarqueCount} HGV marques, ${scopeIndexStats.totalModelsCounted} models counted`
  );
  console.log(
    `[car-remaps] Filter funnel:               ${totalFetched} total -> ${afterCategoryFilter.length} after category exclusion -> ${totalInScope} after scope match`
  );
  console.log(
    `[car-remaps] Performance-data fetches:    ${successes.length} succeeded, ${totalFailed} failed (${(failureRate * 100).toFixed(1)}%)`
  );
  console.log(`[car-remaps] Makes written:                ${makeSlugs.length}`);
  console.log(`[car-remaps] Models written:               ${totalModels}`);
  console.log(`[car-remaps] Output directory:             ${OUTPUT_DIR}`);
  console.log('[car-remaps] ===================================================');
}

main().catch((err) => {
  console.error('[car-remaps] Sync failed with an unexpected error:');
  console.error(err);
  process.exit(1);
});
