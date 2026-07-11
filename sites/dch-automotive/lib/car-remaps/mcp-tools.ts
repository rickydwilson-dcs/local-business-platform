/**
 * MCP tool definitions for the Car Remaps catalogue.
 *
 * Exposes the same Viezu-sourced tuning data as the JSON lookup API
 * (`@/lib/api/car-remaps-lookup-route`) to MCP clients (AI agents), so an
 * agent can look up stage-by-stage remap figures for a real vehicle and cite
 * DCH Automotive's make page (`canonicalUrl`) as the source.
 *
 * DESIGN — no duplicated lookup logic:
 * The actual data queries live in `@/lib/car-remaps/repository` (`listMakes`,
 * `listModelsForMake`, `listFuelTypes`, `listVariants`, `findVehicle`,
 * `getManifest`). This module reuses those exact functions; it only adds the
 * thin progressive-disclosure orchestration that mirrors the JSON API's
 * levels (make -> models -> fuelTypes -> variants -> vehicles). The
 * make/model/fuelType/variant matching uses the same `slugify`-based
 * resolution the JSON API uses, so the two endpoints stay behaviourally
 * identical over the same data.
 *
 * The tool is progressive on purpose: an agent that doesn't know valid model
 * names can call with just `make` and get back the available models, then
 * drill down one field at a time until a fully-specified query returns the
 * matched vehicle(s) with performance/economy figures and price.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
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
import type { NormalizedVehicle, PipeValue } from '@/lib/car-remaps/types';

export const LOOKUP_VEHICLE_TUNING_TOOL_NAME = 'lookup_vehicle_tuning';

export const LOOKUP_VEHICLE_TUNING_TOOL_DESCRIPTION =
  'Look up Viezu ECU-remap tuning figures for a vehicle from DCH Automotive’s ' +
  'catalogue (a Viezu Approved Dealer). Progressive: call with just `make` to get the ' +
  'available models, then add `model`, `fuelType`, and `engineVariant` one at a time to ' +
  'narrow down. A fully-specified query returns the matched vehicle(s) with stage-by-stage ' +
  'performance figures (original vs. power/torque gain), Blue Optimize economy figures, ' +
  'fuel saving, remap price, the canonical DCH Automotive page URL for citation, and the ' +
  'date the catalogue was last synced from Viezu.';

/**
 * Zod raw shape for the tool input. Note `engineVariant` here maps onto the
 * repository/JSON-API `variant` field — the tool uses the clearer public name.
 */
export const lookupVehicleTuningInputShape = {
  make: z
    .string()
    .describe('Vehicle make/marque, e.g. "BMW", "Ford", "audi". Case-insensitive; required.'),
  model: z
    .string()
    .optional()
    .describe(
      'Model line, e.g. "5", "Focus", "z8". Omit to get the list of available models for the make.'
    ),
  fuelType: z
    .string()
    .optional()
    .describe(
      'Fuel type, e.g. "Petrol" or "Diesel". Omit to get the list of available fuel types for the model.'
    ),
  engineVariant: z
    .string()
    .optional()
    .describe(
      'Engine variant label, e.g. "3.0", "2.0 TDI". Omit to get the list of available variants for the fuel type.'
    ),
} as const;

// ---------------------------------------------------------------------------
// Output shaping
// ---------------------------------------------------------------------------

/** Renders a Viezu pipe-delimited figure for output. Empty -> null (Viezu leaves many economy fields blank). */
function figure(value: PipeValue | undefined): string | null {
  if (!value || !value.primaryValue) return null;
  return value.parsedValues.length > 1 ? value.parsedValues.join(' / ') : value.primaryValue;
}

/** `displayPriceCents` is in cents; surface a human GBP string plus the raw pounds number. */
function priceFromCents(cents: number): { display: string; gbp: number } {
  return { display: `£${(cents / 100).toFixed(2)}`, gbp: cents / 100 };
}

/**
 * Shape a `NormalizedVehicle` for the tool output. When `fuelType`/`variant`
 * are supplied we filter to just the requested tuning options (mirroring
 * `CarRemapsResultsTable`); otherwise every variation is surfaced.
 */
function shapeVehicle(
  vehicle: NormalizedVehicle,
  filter?: { fuelType?: string; variant?: string }
) {
  const variations = vehicle.variations.filter(
    (v) =>
      (!filter?.fuelType || v.fuelType.toLowerCase() === filter.fuelType.toLowerCase()) &&
      (!filter?.variant || v.variant.toLowerCase() === filter.variant.toLowerCase())
  );

  return {
    make: vehicle.make,
    model: vehicle.model,
    modelSlug: vehicle.modelSlug,
    sourceUrl: vehicle.sourceUrl,
    tuningOptions: variations.map((v) => ({
      fuelType: v.fuelType,
      engineVariant: v.variant,
      performance: {
        originalBhp: figure(v.originalBhp),
        powerGainBhp: figure(v.powerBhpGain),
        originalTorqueNm: figure(v.originalTorque),
        torqueGainNm: figure(v.torqueNmGain),
      },
      economy: {
        economyGainBhp: figure(v.economyGainBhp),
        economyGainNm: figure(v.economyGainNm),
        fuelSavingUpTo: figure(v.fuelSaving),
      },
      price: priceFromCents(v.displayPriceCents),
    })),
  };
}

// ---------------------------------------------------------------------------
// Tool handler — progressive disclosure over the repository
// ---------------------------------------------------------------------------

export interface LookupVehicleTuningArgs {
  make: string;
  model?: string;
  fuelType?: string;
  engineVariant?: string;
}

/** Wraps a JSON-able payload as an MCP tool result (text content). */
function ok(payload: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
}

/** Wraps an error payload as an MCP tool result flagged `isError`. */
function fail(payload: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }], isError: true };
}

export async function handleLookupVehicleTuning(
  args: LookupVehicleTuningArgs
): Promise<CallToolResult> {
  const make = args.make?.trim() || undefined;
  const model = args.model?.trim() || undefined;
  const fuelType = args.fuelType?.trim() || undefined;
  const engineVariant = args.engineVariant?.trim() || undefined;

  const query = {
    ...(make ? { make } : {}),
    ...(model ? { model } : {}),
    ...(fuelType ? { fuelType } : {}),
    ...(engineVariant ? { engineVariant } : {}),
  };

  const manifest = await getManifest();
  const lastSyncedAt = manifest.generatedAt;

  if (!make) {
    // `make` is a required tool input, but guard anyway.
    return fail({ error: 'A `make` is required.', query, lastSyncedAt });
  }

  // --- Resolve `make` ------------------------------------------------------
  const makes = await listMakes();
  const matchedMake = makes.find(
    (m) => m.slug === make || m.slug === slugify(make) || slugify(m.name) === slugify(make)
  );

  if (!matchedMake) {
    return fail({
      error: `Unknown make: "${make}". Call with no arguments-worth of narrowing to see valid makes.`,
      query,
      options: { makes },
      lastSyncedAt,
    });
  }

  const makeSlug = matchedMake.slug;
  const canonicalUrl = absUrl(getMakePageUrl(makeSlug));

  // --- Level 1: make only -> list models -----------------------------------
  if (!model) {
    const models = await listModelsForMake(makeSlug);
    return ok({ query, make: matchedMake.name, options: { models }, canonicalUrl, lastSyncedAt });
  }

  const models = await listModelsForMake(makeSlug);
  const matchedModel = models.find(
    (m) => m.modelSlug === model || slugify(m.model) === slugify(model)
  );

  if (!matchedModel) {
    return fail({
      error: `Unknown model "${model}" for make "${matchedMake.name}".`,
      query,
      options: { models },
      canonicalUrl,
      lastSyncedAt,
    });
  }

  const modelSlug = matchedModel.modelSlug;

  // --- Level 2: make + model -> list fuel types ----------------------------
  if (!fuelType) {
    const fuelTypes = await listFuelTypes(makeSlug, modelSlug);
    return ok({ query, options: { fuelTypes }, canonicalUrl, lastSyncedAt });
  }

  const fuelTypes = await listFuelTypes(makeSlug, modelSlug);
  const matchedFuelType = fuelTypes.find((f) => f.toLowerCase() === fuelType.toLowerCase());

  if (!matchedFuelType) {
    return fail({
      error: `Unknown fuelType "${fuelType}" for ${matchedMake.name} ${matchedModel.model}.`,
      query,
      options: { fuelTypes },
      canonicalUrl,
      lastSyncedAt,
    });
  }

  // --- Level 3: make + model + fuelType -> list variants -------------------
  if (!engineVariant) {
    const variants = await listVariants(makeSlug, modelSlug, matchedFuelType);
    return ok({ query, options: { variants }, canonicalUrl, lastSyncedAt });
  }

  const variants = await listVariants(makeSlug, modelSlug, matchedFuelType);
  const matchedVariant = variants.find((v) => v.toLowerCase() === engineVariant.toLowerCase());

  if (!matchedVariant) {
    return fail({
      error: `Unknown engineVariant "${engineVariant}" for ${matchedMake.name} ${matchedModel.model} ${matchedFuelType}.`,
      query,
      options: { variants },
      canonicalUrl,
      lastSyncedAt,
    });
  }

  // --- Fully specified -> resolve the vehicle(s) ---------------------------
  const found = await findVehicle({
    make: makeSlug,
    model: modelSlug,
    fuelType: matchedFuelType,
    variant: matchedVariant,
  });

  if (!found) {
    return fail({
      error: 'No vehicle found for the given make/model/fuelType/engineVariant combination.',
      query,
      canonicalUrl,
      lastSyncedAt,
    });
  }

  // `results` is always an array — the same variant label can match more than
  // one generation sharing a `modelSlug` (see repository.ts module doc).
  const vehicles = (Array.isArray(found) ? found : [found]).map((v) =>
    shapeVehicle(v, { fuelType: matchedFuelType, variant: matchedVariant })
  );

  return ok({ query, vehicles, canonicalUrl, lastSyncedAt });
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/** Registers the `lookup_vehicle_tuning` tool on an MCP server instance. */
export function registerCarRemapsTools(server: McpServer): void {
  server.tool(
    LOOKUP_VEHICLE_TUNING_TOOL_NAME,
    LOOKUP_VEHICLE_TUNING_TOOL_DESCRIPTION,
    lookupVehicleTuningInputShape,
    (args) => handleLookupVehicleTuning(args as LookupVehicleTuningArgs)
  );
}
