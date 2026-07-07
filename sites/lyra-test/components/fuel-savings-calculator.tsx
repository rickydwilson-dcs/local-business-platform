'use client';

import { useMemo, useState } from 'react';

const LITRES_PER_GALLON = 4.546;
const KG_CO2_PER_LITRE_DIESEL = 2.68;

export function FuelSavingsCalculator() {
  const [fleetSize, setFleetSize] = useState(10);
  const [mileage, setMileage] = useState(25000);
  const [currentMpg, setCurrentMpg] = useState(32);
  const [fuelPrice, setFuelPrice] = useState(1.45);
  const [efficiencyGain, setEfficiencyGain] = useState(12);

  const { totalSavings, co2Reduction } = useMemo(() => {
    const gain = efficiencyGain / 100;
    const annualLitresPerVehicle = (mileage / currentMpg) * LITRES_PER_GALLON;
    const currentTotalFuelCost = fleetSize * annualLitresPerVehicle * fuelPrice;

    const newMpg = currentMpg * (1 + gain);
    const newAnnualLitresPerVehicle = (mileage / newMpg) * LITRES_PER_GALLON;
    const newTotalFuelCost = fleetSize * newAnnualLitresPerVehicle * fuelPrice;

    const savings = currentTotalFuelCost - newTotalFuelCost;
    const co2 = fuelPrice > 0 ? (savings / fuelPrice) * KG_CO2_PER_LITRE_DIESEL : 0;

    return { totalSavings: savings, co2Reduction: co2 };
  }, [fleetSize, mileage, currentMpg, fuelPrice, efficiencyGain]);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
      {/* Inputs */}
      <div className="bg-surface-card/30 border border-white/5 p-8 md:p-12">
        <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-8">
          Savings Calculator
        </h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="fleetSize"
              >
                Fleet Size (Vehicles)
              </label>
              <input
                id="fleetSize"
                type="number"
                className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="mileage"
              >
                Annual Mileage (Per Van)
              </label>
              <input
                id="mileage"
                type="number"
                className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="block text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="currentMpg"
              >
                Current Avg MPG
              </label>
              <input
                id="currentMpg"
                type="number"
                className="w-full bg-surface-background border border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all px-4 py-3"
                value={currentMpg}
                onChange={(e) => setCurrentMpg(Number(e.target.value) || 1)}
              />
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
                onChange={(e) => setFuelPrice(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                className="text-xs font-heading font-bold uppercase tracking-widest text-white/50"
                htmlFor="efficiencyGain"
              >
                Target Efficiency Gain
              </label>
              <span className="text-brand-primary font-bold font-heading">{efficiencyGain}%</span>
            </div>
            <input
              id="efficiencyGain"
              type="range"
              min={5}
              max={20}
              className="w-full h-1 bg-white/10 accent-brand-primary cursor-pointer"
              value={efficiencyGain}
              onChange={(e) => setEfficiencyGain(Number(e.target.value))}
            />
          </div>
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
            * Illustrative estimates based on typical fleet performance. Individual results vary
            based on vehicle condition and driving style.
          </p>
        </div>
      </div>
    </div>
  );
}
