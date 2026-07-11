/**
 * Renders the "Performance Figures" / "Blue Optimize Fuel Efficiency Tune"
 * tables for a fully-specified vehicle selection from the interactive Car
 * Remaps ready reckoner — same field labels and layout as the static
 * per-make pages (`app/car-remaps/[make]/page.tsx`) so the interactive
 * results read as the same product, not a different tool.
 *
 * `vehicles` is always an array per the lookup API's contract: the same
 * make/model/fuelType/variant combination can genuinely match more than one
 * `NormalizedVehicle` when several generations of a model share the same
 * `modelSlug` (see `lib/car-remaps/repository.ts`'s module-level gotcha —
 * confirmed against real data, e.g. BMW X5 spans 5 generations under one
 * `modelSlug`). Each matching generation renders as its own card.
 *
 * Per the lookup API's own doc comment, `NormalizedVehicle.variations` is
 * returned unfiltered — this component filters to the fuelType/variant the
 * caller actually selected before rendering.
 */

import type { NormalizedVehicle, PipeValue } from '@/lib/car-remaps/types';

interface CarRemapsResultsTableProps {
  vehicles: NormalizedVehicle[];
  fuelType: string;
  variant: string;
}

/** Renders a `PipeValue` for a table cell — see `__fixtures__/README.md` for why multi-position fields can't be split into cleaner per-position labels. */
function cellValue(value: PipeValue | undefined): string {
  if (!value || !value.primaryValue) return 'N/A';
  return value.parsedValues.length > 1 ? value.parsedValues.join(' / ') : value.primaryValue;
}

export function CarRemapsResultsTable({ vehicles, fuelType, variant }: CarRemapsResultsTableProps) {
  const matches = vehicles
    .map((vehicle) => ({
      vehicle,
      variations: vehicle.variations.filter(
        (v) => v.fuelType === fuelType && v.variant === variant
      ),
    }))
    .filter((entry) => entry.variations.length > 0);

  if (matches.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-card-border p-8 text-center">
        <p className="text-white/60 font-sans">
          No performance data found for that exact combination. Try a different variant above, or{' '}
          <a href="#fleet-enquiry" className="text-brand-primary hover:underline">
            get in touch
          </a>{' '}
          — new vehicles are added to the tuning platform regularly.
        </p>
      </div>
    );
  }

  const multiGeneration = matches.length > 1;

  return (
    <div className="space-y-10">
      {matches.map(({ vehicle, variations }, vehicleIndex) => (
        <div key={vehicle.sourceProductId}>
          {multiGeneration && (
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-white/40 mb-4">
              Generation {vehicleIndex + 1} of {matches.length}
            </p>
          )}
          <div className="space-y-6">
            {variations.map((variation) => (
              <div
                key={`${vehicle.sourceProductId}-${variation.fuelType}-${variation.variant}`}
                className="bg-surface-card border border-surface-card-border p-6"
              >
                <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-6 text-brand-primary">
                  {vehicle.make} {vehicle.model} — {variation.fuelType} {variation.variant}
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
                          <td className="py-2 text-white/90">{cellValue(variation.fuelSaving)}</td>
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
      ))}
    </div>
  );
}
