/**
 * Site-local JSON-LD generators for the Car Remaps make pages
 * (`app/car-remaps/[make]/page.tsx`).
 *
 * Deliberately **site-local**, not promoted to the shared factory in
 * `packages/core-components/src/lib/schema-generators.ts` — this is a
 * deliberate architecture decision recorded in this project's peer-review
 * synthesis (`output/sessions/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/`):
 * Product/vehicle-tuning schema is domain-specific to DCH Automotive's
 * Viezu-sourced repository (`./repository.ts`), and no other site in the
 * platform has an equivalent MDX-free, repository-backed product catalogue
 * today. Follows the same plain-function, options-in/`@context`+`@type`-out
 * style as `getArticleSchema`/`getServiceAreaSchema` in the shared factory.
 *
 * TODO: promote to packages/core-components/src/lib/schema-generators.ts if
 * a second site needs Product schema.
 */

import { getBreadcrumbSchema } from '@/lib/schema';
import { absUrl } from '@/lib/site';
import type { NormalizedVehicle, PipeValue } from './types';

/** `displayPriceCents` is in cents — schema.org `Offer.price` expects a decimal string in the given currency unit. */
function centsToPoundsString(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * True if a `PipeValue` field actually carries a value worth surfacing in
 * structured data — Viezu's source data leaves many economy fields as an
 * empty string (see `__fixtures__/README.md`) rather than omitting the field
 * entirely.
 */
function hasValue(value: PipeValue | undefined): value is PipeValue {
  return Boolean(value && value.primaryValue);
}

/**
 * Product-with-Offers JSON-LD for a single `NormalizedVehicle` (one
 * generation of one model, per `repository.ts`'s module-level gotcha — a
 * popular model line like BMW's "5" often has several `NormalizedVehicle`
 * entries sharing `modelSlug`, one per generation, so callers rendering a
 * full make page should call this once per generation, not once per model).
 *
 * One `Offer` per variation (fuel type + engine variant), priced from that
 * variation's `displayPriceCents` (Viezu's stated remap price for that
 * variation, converted from cents to pounds — not a derived/estimated
 * price).
 */
export function getVehicleTuningSchema(vehicle: NormalizedVehicle, pageUrl: string) {
  const name = `${vehicle.make} ${vehicle.model} ECU Remap`;
  const description = `ECU remapping for the ${vehicle.make} ${vehicle.model}, fitted by DCH Automotive — a Viezu Approved Dealer. Stage 1-3, Economy (BlueOptimize) and Performance tuning available, matched to your vehicle's fuel type and engine variant.`;

  const offers = vehicle.variations
    .filter((variation) => hasValue(variation.originalBhp) || variation.displayPriceCents > 0)
    .map((variation) => ({
      '@type': 'Offer' as const,
      name: `${vehicle.model} ${variation.fuelType} ${variation.variant} ECU Remap`,
      price: centsToPoundsString(variation.displayPriceCents),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: absUrl(pageUrl),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absUrl(`${pageUrl}#product-${vehicle.sourceProductId}`),
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    ...(offers.length > 0 && { offers }),
  };
}

/**
 * Breadcrumb schema for a make page (`Home / Car Remaps / <Make>`) — thin
 * wrapper reusing the site's shared `getBreadcrumbSchema` (from
 * `@/lib/schema`, itself `createSchemaGenerators()` bound with this site's
 * `absUrl`/business config) rather than reimplementing breadcrumb JSON-LD
 * locally.
 */
export function getMakeBreadcrumbSchema(makeName: string, makeSlug: string) {
  return getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Car Remaps', url: '/car-remaps' },
    { name: makeName, url: `/car-remaps/${makeSlug}` },
  ]);
}
