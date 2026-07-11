/**
 * Groups fetched-and-parsed catalog entries into per-make `NormalizedVehicle`
 * lists, ready to write to `data/car-remaps/makes/<make-slug>.json`.
 */

import { decodeHtmlEntities, normalizeModelName } from '../../lib/car-remaps/parsers';
import type {
  CatalogEntry,
  NormalizedVehicle,
  ScopeIndex,
  VariationPerformance,
} from '../../lib/car-remaps/types';

/** A handful of marques whose canonical display casing isn't simple title-case. */
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  bmw: 'BMW',
  mg: 'MG',
  vw: 'VW',
  gwm: 'GWM',
  ds: 'DS',
  fiat: 'FIAT',
  ldv: 'LDV',
  man: 'MAN',
  saic: 'SAIC',
};

function titleCase(value: string): string {
  return value
    .split(' ')
    .map((word) =>
      DISPLAY_NAME_OVERRIDES[word]
        ? DISPLAY_NAME_OVERRIDES[word]
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Finds which marque (from `scopeIndex`'s known marque keys) a Store API
 * product name belongs to, and returns the raw model-name remainder after
 * stripping the marque prefix. Mirrors the candidate-prefix matching
 * strategy `isInScopeVehicle` (Phase 2, `lib/car-remaps/parsers.ts`) uses to
 * confirm scope membership, but returns the match instead of a boolean —
 * `normalizeMarqueName` alone can't do this split because it only strips a
 * known *suffix* off an already-isolated marque name; it has no way to find
 * where a multi-word marque like "Land Rover" or "Aston Martin" ends and the
 * model starts inside a full product name, so this needs the ScopeIndex's
 * known marque list.
 */
function matchMakeAndModel(
  productName: string,
  scopeIndex: ScopeIndex
): { marqueKey: string; modelRaw: string } | null {
  const decoded = decodeHtmlEntities(productName).trim();
  const lower = decoded.toLowerCase();

  const marqueKeys = Array.from(scopeIndex.keys()).sort((a, b) => b.length - a.length);

  for (const marqueKey of marqueKeys) {
    const candidatePrefixes = Array.from(new Set([marqueKey, marqueKey.split(/[\s-]+/)[0]]));

    for (const prefix of candidatePrefixes) {
      if (!prefix || !lower.startsWith(`${prefix} `)) continue;

      const remainder = decoded.slice(prefix.length).trim();
      const normalizedModel = normalizeModelName(remainder);
      const models = scopeIndex.get(marqueKey);
      if (models?.has(normalizedModel)) {
        return { marqueKey, modelRaw: remainder };
      }
    }
  }

  return null;
}

/** Strips the trailing "Tuning (year range)" tail for a human-readable model display name. */
function displayModelName(modelRaw: string): string {
  return modelRaw
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\s+Tuning\s*$/i, '')
    .trim();
}

/**
 * Groups normalized vehicles by make-slug. The make is derived from the
 * product name by matching it against the known marques in `scopeIndex` —
 * the same (marque, model) matching `sync.ts` already used via
 * `isInScopeVehicle` to confirm the entry is in-scope — not from the
 * WooCommerce category, which the fixtures README confirmed is unreliable
 * for this purpose.
 *
 * Every `entry` passed in is expected to have already passed
 * `isInScopeVehicle(entry.name, scopeIndex)` in `sync.ts`, so the "no match"
 * branch below should not occur in practice; it's a defensive fallback
 * (bucketed under `"unknown"`) rather than a thrown error, so one
 * unexpectedly-unmatchable entry can't abort the whole normalize step after
 * all the fetching work is done.
 */
export function groupByMake(
  entries: Array<CatalogEntry & { variations: VariationPerformance[] }>,
  scopeIndex: ScopeIndex
): Map<string, NormalizedVehicle[]> {
  const grouped = new Map<string, NormalizedVehicle[]>();

  for (const entry of entries) {
    const match = matchMakeAndModel(entry.name, scopeIndex);

    const makeSlug = match ? slugify(match.marqueKey) : 'unknown';
    const make = match ? titleCase(match.marqueKey) : 'Unknown';
    const modelRaw = match ? match.modelRaw : entry.name;
    const model = displayModelName(modelRaw);

    const vehicle: NormalizedVehicle = {
      make,
      model,
      modelSlug: slugify(model),
      sourceProductId: entry.id,
      sourceUrl: entry.permalink,
      variations: entry.variations,
    };

    const existing = grouped.get(makeSlug) ?? [];
    existing.push(vehicle);
    grouped.set(makeSlug, existing);
  }

  return grouped;
}
