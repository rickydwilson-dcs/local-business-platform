/**
 * Read-side repository for the synced Viezu car-remaps catalogue.
 *
 * Reads the generated JSON under `data/car-remaps/` (produced by
 * `scripts/car-remaps/sync.ts` — see `manifest.json` for provenance/freshness
 * metadata). This module is server-only (`fs/promises`, `process.cwd()`),
 * following the same read pattern as `createContentUtils` in
 * `@platform/core-components/lib/content` (list functions catch a missing
 * file/dir and return an empty/null result rather than throwing; only truly
 * unexpected fs errors propagate).
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT DATA-SHAPE GOTCHA: `modelSlug` is not unique within a make.
 * ---------------------------------------------------------------------------
 * Viezu's catalogue reuses the model-line slug across every generation of
 * that model — e.g. BMW's `makes/bmw.json` has five separate
 * `NormalizedVehicle` entries (distinct `sourceProductId`/`sourceUrl`, one
 * per generation: E34, E39, E60, F10, G30) that all share `modelSlug: "5"`.
 * This is confirmed against the real generated data (not a hypothetical):
 * 17 of BMW's 83 model entries share a `modelSlug` with at least one sibling
 * generation, and the same is true for Ford/Audi (24 each) and most
 * multi-generation makes.
 *
 * Consequence: even a fully-specified lookup (make + model + fuelType +
 * variant) can genuinely match more than one `NormalizedVehicle`, because
 * the same variant label (e.g. "3.0" Petrol) exists on multiple generations
 * of the same model line. `findVehicle()` documents its return contract
 * with this in mind below.
 */

import fs from 'fs/promises';
import path from 'path';
import { slugify } from '@platform/core-components/lib/site-utils';
import type { NormalizedVehicle } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'car-remaps');

// ---------------------------------------------------------------------------
// Raw JSON shapes (as written by scripts/car-remaps/sync.ts)
// ---------------------------------------------------------------------------

interface MakeIndexEntry {
  slug: string;
  name: string;
  modelCount: number;
}

interface IndexJson {
  makes: MakeIndexEntry[];
}

/** Shape of `manifest.json` — sync provenance/freshness metadata. */
export interface CarRemapsManifest {
  generatedAt: string;
  sourceUrl: string;
  totalFetched: number;
  totalExcludedByCategory: number;
  totalExcludedByScope: number;
  totalInScope: number;
  totalFailed: number;
  failedUrls: string[];
  makes: string[];
  scopeIndexStats: {
    carsMarqueCount: number;
    vansMarqueCount: number;
    totalModelsCounted: number;
  };
}

// ---------------------------------------------------------------------------
// Internal fs readers
// ---------------------------------------------------------------------------

async function readIndex(): Promise<IndexJson> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'index.json'), 'utf8');
  return JSON.parse(raw) as IndexJson;
}

/** Reads `makes/<makeSlug>.json`. Returns `null` (not a throw) if the make doesn't exist. */
async function readMakeFile(makeSlug: string): Promise<NormalizedVehicle[] | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, 'makes', `${makeSlug}.json`), 'utf8');
    return JSON.parse(raw) as NormalizedVehicle[];
  } catch {
    return null;
  }
}

/** Tries `makeSlug` as given, then falls back to a slugified form (callers may pass a display name). */
async function resolveMakeVehicles(make: string): Promise<NormalizedVehicle[] | null> {
  const direct = await readMakeFile(make);
  if (direct) return direct;

  const slugified = slugify(make);
  if (slugified === make) return null;

  return readMakeFile(slugified);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Reads `manifest.json` — used downstream for `lastSyncedAt` / `sourceUpdatedAt` fields. */
export async function getManifest(): Promise<CarRemapsManifest> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'manifest.json'), 'utf8');
  return JSON.parse(raw) as CarRemapsManifest;
}

/** All makes in the catalogue, alphabetical by display name. */
export async function listMakes(): Promise<
  Array<{ slug: string; name: string; modelCount: number }>
> {
  const index = await readIndex();
  return [...index.makes]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ slug, name, modelCount }) => ({ slug, name, modelCount }));
}

/**
 * Distinct models for a make, deduplicated by `modelSlug` (see module-level
 * gotcha above — this collapses generations of the same model line into one
 * entry, matching what a "models for this make" listing page should show).
 * Returns `[]` if the make doesn't exist.
 */
export async function listModelsForMake(
  makeSlug: string
): Promise<Array<{ model: string; modelSlug: string }>> {
  const vehicles = await resolveMakeVehicles(makeSlug);
  if (!vehicles) return [];

  const seen = new Map<string, { model: string; modelSlug: string }>();
  for (const vehicle of vehicles) {
    if (!seen.has(vehicle.modelSlug)) {
      seen.set(vehicle.modelSlug, { model: vehicle.model, modelSlug: vehicle.modelSlug });
    }
  }

  return [...seen.values()].sort((a, b) =>
    a.model.localeCompare(b.model, undefined, { numeric: true })
  );
}

/**
 * Distinct fuel types across every generation sharing `modelSlug` for this
 * make. Returns `[]` if the make or model doesn't exist.
 */
export async function listFuelTypes(makeSlug: string, modelSlug: string): Promise<string[]> {
  const vehicles = await resolveMakeVehicles(makeSlug);
  if (!vehicles) return [];

  const fuelTypes = new Set<string>();
  for (const vehicle of vehicles) {
    if (vehicle.modelSlug !== modelSlug) continue;
    for (const variation of vehicle.variations) {
      fuelTypes.add(variation.fuelType);
    }
  }

  return [...fuelTypes].sort((a, b) => a.localeCompare(b));
}

/**
 * Distinct variant labels for a make+model+fuelType combo, across every
 * generation sharing `modelSlug`. Returns `[]` if nothing matches.
 */
export async function listVariants(
  makeSlug: string,
  modelSlug: string,
  fuelType: string
): Promise<string[]> {
  const vehicles = await resolveMakeVehicles(makeSlug);
  if (!vehicles) return [];

  const variants = new Set<string>();
  for (const vehicle of vehicles) {
    if (vehicle.modelSlug !== modelSlug) continue;
    for (const variation of vehicle.variations) {
      if (variation.fuelType === fuelType) {
        variants.add(variation.variant);
      }
    }
  }

  return [...variants].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export interface FindVehicleParams {
  make: string;
  model?: string;
  fuelType?: string;
  variant?: string;
}

/**
 * Progressive lookup across the catalogue. Phase 6 (JSON API) and Phase 8
 * (MCP endpoint) both build directly on this function, so the return
 * contract is fixed here and MUST NOT change without updating both:
 *
 * - `make` doesn't resolve to a known make file -> `null`.
 * - `make` given, `model` omitted -> `null`. A make-only lookup is not
 *   resolvable to a vehicle (or even a single vehicle *shape* — a make has
 *   many models); callers wanting "what's under this make" should use
 *   `listModelsForMake()` instead, not `findVehicle()`.
 * - `make` + `model` given, model slug doesn't exist under that make ->
 *   `null`.
 * - `make` + `model` (+ optionally `fuelType` and/or `variant`) given, and
 *   exactly one `NormalizedVehicle` (i.e. one generation/`sourceProductId`)
 *   has at least one variation matching whichever of `fuelType`/`variant`
 *   were supplied -> that single `NormalizedVehicle`, unwrapped (not an
 *   array).
 * - Same as above but **more than one** generation matches — the common
 *   case for popular multi-generation models, since `modelSlug` is shared
 *   across generations (see module-level gotcha) -> `NormalizedVehicle[]`
 *   of every matching generation.
 *
 * Note: matched `NormalizedVehicle` objects are returned with their full,
 * unfiltered `variations` array (not narrowed to just the requested
 * fuelType/variant) — callers that need exactly the matched combination
 * should filter `.variations` themselves using the same `fuelType`/`variant`
 * they passed in. This keeps the returned shape identical to the stored
 * `NormalizedVehicle` type rather than inventing a derived shape.
 */
export async function findVehicle(
  params: FindVehicleParams
): Promise<NormalizedVehicle | NormalizedVehicle[] | null> {
  const { make, model, fuelType, variant } = params;

  const vehicles = await resolveMakeVehicles(make);
  if (!vehicles) return null;

  if (!model) return null;

  const modelMatches = vehicles.filter(
    (vehicle) => vehicle.modelSlug === model || slugify(vehicle.model) === slugify(model)
  );
  if (modelMatches.length === 0) return null;

  const filtered =
    fuelType || variant
      ? modelMatches.filter((vehicle) =>
          vehicle.variations.some(
            (v) => (!fuelType || v.fuelType === fuelType) && (!variant || v.variant === variant)
          )
        )
      : modelMatches;

  if (filtered.length === 0) return null;
  if (filtered.length === 1) return filtered[0];
  return filtered;
}
