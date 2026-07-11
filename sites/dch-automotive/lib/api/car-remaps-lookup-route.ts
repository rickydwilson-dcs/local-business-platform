/**
 * GET handler for the Car Remaps catalogue lookup API.
 *
 * Progressive-disclosure endpoint over the read-side repository in
 * `@/lib/car-remaps/repository` (see that file's module-level doc for the
 * `modelSlug`-reuse gotcha and `findVehicle()`'s return contract, which this
 * handler builds on directly per its own "Phase 6 (JSON API)" note).
 *
 * Query params (all optional, each requires the previous one to be present
 * and valid): `make`, `model`, `fuelType`, `variant`.
 *
 * Response shapes:
 * - Any level short of fully-specified -> `{ query, options: { <nextLevel> },
 *   canonicalUrl?, sourceUpdatedAt }`, where `<nextLevel>` is whichever of
 *   `makes` / `models` / `fuelTypes` / `variants` is the next thing the
 *   caller can narrow by. `canonicalUrl` is present once `make` resolves.
 * - Fully specified (make + model + fuelType + variant, each validated
 *   against the previous level's options) -> `{ query, results:
 *   NormalizedVehicle[], canonicalUrl, sourceUpdatedAt }`. `results` is
 *   always an array — even a single match — because `findVehicle()` can
 *   legitimately return multiple `NormalizedVehicle`s for one fully-specified
 *   query (same variant label across generations sharing a `modelSlug`).
 * - Any param that doesn't resolve against its parent level (unknown make,
 *   unknown model for that make, unknown fuelType for that model, unknown
 *   variant for that fuelType, or a fully-specified combo with no match) ->
 *   HTTP 400 with `{ error: string, query }`. Never a silent empty 200.
 *
 * Cacheable: this data only changes on a manual Viezu re-sync
 * (`scripts/car-remaps/sync.ts`), so the route file exports `runtime =
 * 'nodejs'` only — no `dynamic = 'force-dynamic'` — unlike
 * `app/api/csrf-token/route.ts`, which must stay dynamic because CSRF tokens
 * need to be fresh on every request.
 */

import { absUrl, slugify } from '@/lib/site';
import {
  findVehicle,
  getManifest,
  listFuelTypes,
  listMakes,
  listModelsForMake,
  listVariants,
} from '@/lib/car-remaps/repository';
import { getMakePageUrl } from '@/lib/car-remaps/url';

interface LookupQuery {
  make?: string;
  model?: string;
  fuelType?: string;
  variant?: string;
}

export async function handleCarRemapsLookup(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const makeParam = url.searchParams.get('make')?.trim() || undefined;
  const modelParam = url.searchParams.get('model')?.trim() || undefined;
  const fuelTypeParam = url.searchParams.get('fuelType')?.trim() || undefined;
  const variantParam = url.searchParams.get('variant')?.trim() || undefined;

  const query: LookupQuery = {
    ...(makeParam ? { make: makeParam } : {}),
    ...(modelParam ? { model: modelParam } : {}),
    ...(fuelTypeParam ? { fuelType: fuelTypeParam } : {}),
    ...(variantParam ? { variant: variantParam } : {}),
  };

  const manifest = await getManifest();
  const sourceUpdatedAt = manifest.generatedAt;

  // --- Level 0: no `make` -> list makes ---------------------------------
  if (!makeParam) {
    const makes = await listMakes();
    return Response.json({ query, options: { makes }, sourceUpdatedAt });
  }

  // --- Resolve `make` ------------------------------------------------------
  const makes = await listMakes();
  const matchedMake = makes.find(
    (m) =>
      m.slug === makeParam ||
      m.slug === slugify(makeParam) ||
      slugify(m.name) === slugify(makeParam)
  );

  if (!matchedMake) {
    return Response.json({ error: `Unknown make: "${makeParam}"`, query }, { status: 400 });
  }

  const makeSlug = matchedMake.slug;
  const canonicalUrl = absUrl(getMakePageUrl(makeSlug));

  // --- Level 1: make only -> list models -----------------------------------
  if (!modelParam) {
    const models = await listModelsForMake(makeSlug);
    return Response.json({ query, options: { models }, canonicalUrl, sourceUpdatedAt });
  }

  const models = await listModelsForMake(makeSlug);
  const matchedModel = models.find(
    (m) => m.modelSlug === modelParam || slugify(m.model) === slugify(modelParam)
  );

  if (!matchedModel) {
    return Response.json(
      { error: `Unknown model "${modelParam}" for make "${matchedMake.name}"`, query },
      { status: 400 }
    );
  }

  const modelSlug = matchedModel.modelSlug;

  // --- Level 2: make + model -> list fuel types ----------------------------
  if (!fuelTypeParam) {
    const fuelTypes = await listFuelTypes(makeSlug, modelSlug);
    return Response.json({ query, options: { fuelTypes }, canonicalUrl, sourceUpdatedAt });
  }

  const fuelTypes = await listFuelTypes(makeSlug, modelSlug);
  const matchedFuelType = fuelTypes.find((f) => f.toLowerCase() === fuelTypeParam.toLowerCase());

  if (!matchedFuelType) {
    return Response.json(
      {
        error: `Unknown fuelType "${fuelTypeParam}" for ${matchedMake.name} ${matchedModel.model}`,
        query,
      },
      { status: 400 }
    );
  }

  // --- Level 3: make + model + fuelType -> list variants -------------------
  if (!variantParam) {
    const variants = await listVariants(makeSlug, modelSlug, matchedFuelType);
    return Response.json({ query, options: { variants }, canonicalUrl, sourceUpdatedAt });
  }

  const variants = await listVariants(makeSlug, modelSlug, matchedFuelType);
  const matchedVariant = variants.find((v) => v.toLowerCase() === variantParam.toLowerCase());

  if (!matchedVariant) {
    return Response.json(
      {
        error: `Unknown variant "${variantParam}" for ${matchedMake.name} ${matchedModel.model} ${matchedFuelType}`,
        query,
      },
      { status: 400 }
    );
  }

  // --- Fully specified -> resolve the vehicle(s) ---------------------------
  const found = await findVehicle({
    make: makeSlug,
    model: modelSlug,
    fuelType: matchedFuelType,
    variant: matchedVariant,
  });

  if (!found) {
    return Response.json(
      { error: 'No vehicle found for the given make/model/fuelType/variant combination.', query },
      { status: 400 }
    );
  }

  const results = Array.isArray(found) ? found : [found];

  return Response.json({ query, results, canonicalUrl, sourceUpdatedAt });
}
