/**
 * Car Remaps — Make Page
 * ======================
 *
 * Per-make performance-figures and pricing listing for the Viezu catalogue
 * synced by `scripts/car-remaps/sync.ts` (see `lib/car-remaps/repository.ts`
 * for the read-side data-access API this page is built on).
 *
 * Not MDX-driven — there is no `content/car-remaps/` folder. This route
 * follows the platform's usual `generateStaticParams`/`generateMetadata`
 * page conventions (see `app/locations/[slug]/page.tsx`) but sources its
 * data straight from the synced JSON catalogue via the Phase 4 repository,
 * per `sites/dch-automotive/CLAUDE.md`'s note that `/car-remaps` and its
 * children are a deliberate exception to the MDX-only rule.
 *
 * Tables are rendered as real server-side HTML (not client-side JS) so the
 * performance figures and pricing are crawlable — this is the whole point
 * of this route versus the embedded Viezu `<iframe>` on `/car-remaps`,
 * which is opaque to crawlers.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { listMakes, listModelsForMake, findVehicle } from '@/lib/car-remaps/repository';
import { getVehicleTuningSchema, getMakeBreadcrumbSchema } from '@/lib/car-remaps/schema';
import type { NormalizedVehicle, PipeValue } from '@/lib/car-remaps/types';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';
import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { make: string };

/** Renders a `PipeValue` for a table cell. Multi-position (pipe-delimited) fields are joined with " / " — see `__fixtures__/README.md` for why a cleaner per-position label isn't derivable from Viezu's source data. */
function cellValue(value: PipeValue | undefined): string {
  if (!value || !value.primaryValue) return 'N/A';
  return value.parsedValues.length > 1 ? value.parsedValues.join(' / ') : value.primaryValue;
}

async function resolveMakeVehicles(
  makeSlug: string
): Promise<Array<{ model: string; modelSlug: string; vehicles: NormalizedVehicle[] }>> {
  const models = await listModelsForMake(makeSlug);

  const resolved = await Promise.all(
    models.map(async ({ model, modelSlug }) => {
      const result = await findVehicle({ make: makeSlug, model: modelSlug });
      const vehicles = result ? (Array.isArray(result) ? result : [result]) : [];
      return { model, modelSlug, vehicles };
    })
  );

  return resolved.filter((entry) => entry.vehicles.length > 0);
}

export async function generateStaticParams() {
  const makes = await listMakes();
  return makes.map(({ slug }) => ({ make: slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { make } = await params;
  const makes = await listMakes();
  const makeEntry = makes.find((m) => m.slug === make);

  if (!makeEntry) {
    return {
      title: 'Make Not Found',
      description: 'The requested vehicle make could not be found.',
    };
  }

  const title = `${makeEntry.name} ECU Remapping — Performance Figures & Prices | DCH Automotive`;
  const description = `Performance figures and pricing for ${makeEntry.name} ECU remapping — Stage 1-3, Economy (BlueOptimize) and Performance tuning fitted by DCH Automotive, a Viezu Approved Dealer.`;

  return {
    title,
    description,
    alternates: {
      canonical: absUrl(`/car-remaps/${make}`),
    },
    openGraph: {
      title,
      description,
      url: absUrl(`/car-remaps/${make}`),
      type: 'website',
    },
  };
}

export default async function CarRemapsMakePage({ params }: { params: Promise<Params> }) {
  const { make } = await params;
  const makes = await listMakes();
  const makeEntry = makes.find((m) => m.slug === make);

  if (!makeEntry) {
    notFound();
  }

  const modelVehicles = await resolveMakeVehicles(make);

  if (modelVehicles.length === 0) {
    notFound();
  }

  const pageUrl = `/car-remaps/${make}`;
  const breadcrumbSchema = getMakeBreadcrumbSchema(makeEntry.name, make);
  const productSchemas = modelVehicles.flatMap(({ vehicles }) =>
    vehicles.map((vehicle) => getVehicleTuningSchema(vehicle, pageUrl))
  );

  return (
    <>
      <BreadcrumbBar
        items={[
          { name: 'Home', href: '/' },
          { name: 'Car Remaps', href: '/car-remaps' },
          { name: makeEntry.name, href: pageUrl, current: true },
        ]}
      />

      <PageHero
        title={`${makeEntry.name} ECU Remapping`}
        description={`Performance figures and Economy (BlueOptimize) tuning prices for every ${makeEntry.name} model we support, fitted by DCH Automotive — a Viezu Approved Dealer.`}
      />

      <section className="py-12 container mx-auto px-6 space-y-20">
        {modelVehicles.map(({ model, modelSlug, vehicles }) =>
          vehicles.map((vehicle, vehicleIndex) => (
            <div key={`${modelSlug}-${vehicle.sourceProductId}`}>
              <h2 className="text-2xl font-heading font-black uppercase tracking-tight mb-2">
                {makeEntry.name} {model}
                {vehicles.length > 1 && (
                  <span className="text-white/40 text-base font-normal normal-case tracking-normal ml-2">
                    (Generation {vehicleIndex + 1} of {vehicles.length})
                  </span>
                )}
              </h2>

              <div className="space-y-10">
                {vehicle.variations.map((variation) => (
                  <div
                    key={`${variation.fuelType}-${variation.variant}`}
                    className="bg-surface-card border border-surface-card-border p-6"
                  >
                    <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-6 text-brand-primary">
                      {variation.fuelType} {variation.variant}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-heading font-bold uppercase tracking-widest text-white/50 mb-3">
                          Performance Figures
                        </h4>
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-surface-card-border">
                              <th className="text-left py-2 pr-3 font-heading uppercase tracking-tight text-white/60">
                                Original BHP
                              </th>
                              <th className="text-left py-2 pr-3 font-heading uppercase tracking-tight text-white/60">
                                Power + (Perf) BHP
                              </th>
                              <th className="text-left py-2 pr-3 font-heading uppercase tracking-tight text-white/60">
                                Original Torque
                              </th>
                              <th className="text-left py-2 font-heading uppercase tracking-tight text-white/60">
                                Torque + (Perf) Nm
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 pr-3 text-white/90">
                                {cellValue(variation.originalBhp)}
                              </td>
                              <td className="py-2 pr-3 text-white/90">
                                {cellValue(variation.powerBhpGain)}
                              </td>
                              <td className="py-2 pr-3 text-white/90">
                                {cellValue(variation.originalTorque)}
                              </td>
                              <td className="py-2 text-white/90">
                                {cellValue(variation.torqueNmGain)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="text-sm font-heading font-bold uppercase tracking-widest text-white/50 mb-3">
                          Blue Optimize Fuel Efficiency Tune
                        </h4>
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-surface-card-border">
                              <th className="text-left py-2 pr-3 font-heading uppercase tracking-tight text-white/60">
                                Economy Gain BHP
                              </th>
                              <th className="text-left py-2 pr-3 font-heading uppercase tracking-tight text-white/60">
                                Economy Gain Nm
                              </th>
                              <th className="text-left py-2 font-heading uppercase tracking-tight text-white/60">
                                Fuel Saving Up To
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 pr-3 text-white/90">
                                {cellValue(variation.economyGainBhp)}
                              </td>
                              <td className="py-2 pr-3 text-white/90">
                                {cellValue(variation.economyGainNm)}
                              </td>
                              <td className="py-2 text-white/90">
                                {cellValue(variation.fuelSaving)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 mt-4 font-sans">
                      Remap price from &pound;{(variation.displayPriceCents / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema) => (
        <script
          key={schema['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
