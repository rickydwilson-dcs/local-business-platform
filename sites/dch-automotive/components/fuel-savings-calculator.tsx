'use client';

/**
 * Single-vehicle fuel savings calculator for `/car-remaps`.
 *
 * Reuses `CarRemapsSelectors` (the same cascading Make/Model/Fuel
 * Type/Variant picker as the Ready Reckoner section further down the page)
 * so the efficiency gain used in the savings math is the vehicle's real,
 * Viezu-quoted `fuelSaving` percentage — not a guessed slider value. The
 * fuel price is auto-filled from the live UK weekly average
 * (`/api/fuel-prices/current`, backed by `lib/fuel-prices/fetch.ts`) but
 * stays editable, since the customer's actual local price may differ.
 */

import { useEffect, useMemo, useState } from 'react';
import { CarRemapsSelectors, type CarRemapsResolvedResult } from './car-remaps-selectors';
import type { VariationPerformance } from '@/lib/car-remaps/types';
import { FUEL_PRICE_FALLBACK, type FuelPriceSnapshot } from '@/lib/fuel-prices/types';

const LITRES_PER_GALLON = 4.546;
const KG_CO2_PER_LITRE: Record<'petrol' | 'diesel', number> = {
  petrol: 2.31,
  diesel: 2.68,
};

function fuelTypeKey(fuelType: string | undefined): 'petrol' | 'diesel' {
  return fuelType?.toLowerCase().includes('petrol') ? 'petrol' : 'diesel';
}

/**
 * Finds the variation matching the fully-resolved selection. `resolved.results`
 * can contain more than one vehicle when several generations of a model share
 * a `modelSlug` (see `lib/car-remaps/repository.ts`) — unlike the results
 * table, which shows every generation, the calculator just needs one
 * representative fuel-saving figure, so the first match is used.
 */
function findMatchingVariation(
  resolved: CarRemapsResolvedResult | null
): VariationPerformance | null {
  if (!resolved?.query.fuelType || !resolved.query.variant) return null;
  for (const vehicle of resolved.results) {
    const match = vehicle.variations.find(
      (v) => v.fuelType === resolved.query.fuelType && v.variant === resolved.query.variant
    );
    if (match) return match;
  }
  return null;
}

function parseFuelSavingPercent(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function poundsFromPence(pencePerLitre: number): number {
  return Number((pencePerLitre / 100).toFixed(2));
}

export function FuelSavingsCalculator() {
  const [resolved, setResolved] = useState<CarRemapsResolvedResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [annualMileage, setAnnualMileage] = useState(12000);
  const [currentMpg, setCurrentMpg] = useState(32);
  const [fuelPrices, setFuelPrices] = useState<FuelPriceSnapshot>(FUEL_PRICE_FALLBACK);
  const [fuelPrice, setFuelPrice] = useState(
    poundsFromPence(FUEL_PRICE_FALLBACK.dieselPencePerLitre)
  );
  const [fuelPriceTouched, setFuelPriceTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/fuel-prices/current')
      .then((res) => res.json())
      .then((data: FuelPriceSnapshot) => {
        if (!cancelled) setFuelPrices(data);
      })
      .catch(() => {
        // Keep the FUEL_PRICE_FALLBACK already set as initial state.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matchedVariation = useMemo(() => findMatchingVariation(resolved), [resolved]);
  const fuelKey = fuelTypeKey(resolved?.query.fuelType);
  const efficiencyGain = matchedVariation
    ? parseFuelSavingPercent(matchedVariation.fuelSaving.primaryValue)
    : null;
  const hasVehicle = efficiencyGain !== null;

  // Auto-fill the fuel price from the live snapshot whenever the resolved
  // vehicle's fuel type (or the snapshot itself) changes, unless the
  // customer has already edited the field manually.
  useEffect(() => {
    if (fuelPriceTouched) return;
    const pencePerLitre =
      fuelKey === 'petrol' ? fuelPrices.petrolPencePerLitre : fuelPrices.dieselPencePerLitre;
    setFuelPrice(poundsFromPence(pencePerLitre));
  }, [fuelKey, fuelPrices, fuelPriceTouched]);

  const { totalSavings, co2Reduction } = useMemo(() => {
    if (efficiencyGain === null) return { totalSavings: 0, co2Reduction: 0 };

    const gain = efficiencyGain / 100;
    const annualLitresCurrent = (annualMileage / currentMpg) * LITRES_PER_GALLON;
    const currentFuelCost = annualLitresCurrent * fuelPrice;

    const newMpg = currentMpg * (1 + gain);
    const annualLitresNew = (annualMileage / newMpg) * LITRES_PER_GALLON;
    const newFuelCost = annualLitresNew * fuelPrice;

    const litresSaved = annualLitresCurrent - annualLitresNew;

    return {
      totalSavings: currentFuelCost - newFuelCost,
      co2Reduction: litresSaved * KG_CO2_PER_LITRE[fuelKey],
    };
  }, [annualMileage, currentMpg, fuelPrice, efficiencyGain, fuelKey]);

  const showNoDataMessage =
    !pending && !error && !!resolved?.query.fuelType && !!resolved.query.variant && !hasVehicle;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
      {/* Inputs */}
      <div className="bg-surface-card/30 border border-white/5 p-8 md:p-12">
        <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-8">
          Savings Calculator
        </h2>
        <div className="space-y-6">
          <div>
            <p className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50 mb-2">
              Your Vehicle
            </p>
            <CarRemapsSelectors
              onResolvedChange={setResolved}
              onPendingChange={setPending}
              onErrorChange={setError}
            />
            {error && (
              <p role="alert" className="text-error text-sm mt-3">
                {error}
              </p>
            )}
            {pending && (
              <p className="text-white/50 text-sm mt-3">Looking up your fuel saving figures…</p>
            )}
            {showNoDataMessage && (
              <p className="text-white/50 text-sm mt-3">
                No fuel saving data found for that exact combination — try a different variant
                above.
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="annualMileage"
              >
                Annual Mileage
              </label>
              <input
                id="annualMileage"
                type="number"
                className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
                value={annualMileage}
                onChange={(e) => setAnnualMileage(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="currentMpg"
              >
                Your Current MPG
              </label>
              <input
                id="currentMpg"
                type="number"
                className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
                value={currentMpg}
                onChange={(e) => setCurrentMpg(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
              htmlFor="fuelPrice"
            >
              Fuel Price (£/Litre)
            </label>
            <input
              id="fuelPrice"
              type="number"
              step="0.01"
              className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
              value={fuelPrice}
              onChange={(e) => {
                setFuelPriceTouched(true);
                setFuelPrice(Number(e.target.value) || 0);
              }}
            />
            <p className="text-xs text-white/40">
              Auto-filled: UK avg {fuelKey} price, week of {fuelPrices.weekEnding} (gov.uk data).
              Edit if you know your local price.
            </p>
          </div>

          {hasVehicle && (
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-white/50">
                Manufacturer-Quoted Fuel Saving
              </span>
              <span className="text-brand-primary font-bold font-heading">{efficiencyGain}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-brand-primary flex flex-col justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 opacity-10">
          <span className="material-symbols-outlined text-[300px]">calculate</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-heading font-black uppercase tracking-tight mb-12 border-b border-white/20 pb-4">
            Projected Annual Impact
          </h3>
          {hasVehicle ? (
            <>
              <div className="mb-10">
                <div className="text-sm font-heading font-bold uppercase tracking-widest opacity-80 mb-2">
                  Estimated Annual Saving
                </div>
                <div className="text-6xl md:text-8xl font-heading font-black tracking-tighter tabular-nums">
                  £{Math.round(totalSavings).toLocaleString('en-GB')}
                </div>
              </div>
              <div>
                <div className="text-sm font-heading font-bold uppercase tracking-widest opacity-80 mb-2">
                  CO2 Reduction (kg)
                </div>
                <div className="text-4xl font-heading font-black tracking-tight tabular-nums">
                  {Math.round(co2Reduction).toLocaleString('en-GB')} kg
                </div>
              </div>
              <p className="mt-12 text-sm text-white/70 italic border-t border-white/20 pt-6">
                * Illustrative estimate based on the manufacturer-quoted fuel saving for your
                selected vehicle and variant. Individual results vary based on vehicle condition,
                driving style and fuel price.
              </p>
            </>
          ) : (
            <p className="text-white/80 font-sans text-lg">
              Select your vehicle on the left to see your estimated annual saving.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
