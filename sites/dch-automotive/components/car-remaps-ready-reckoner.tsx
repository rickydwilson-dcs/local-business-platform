'use client';

/**
 * Interactive Car Remaps ready reckoner — replaces the embedded Viezu
 * `<iframe>` vehicle-selector widget on `/car-remaps` with a DCH-owned tool
 * built on the synced catalogue (`/api/car-remaps/lookup`).
 *
 * Composes `CarRemapsSelectors` (cascading Make/Model/Fuel Type/Variant
 * dropdowns) with `CarRemapsResultsTable` (the performance/economy tables),
 * owning the selection-resolution state and the loading/empty/error UI
 * between them.
 */

import { useState } from 'react';
import { CarRemapsSelectors, type CarRemapsResolvedResult } from './car-remaps-selectors';
import { CarRemapsResultsTable } from './car-remaps-results-table';

export function CarRemapsReadyReckoner() {
  const [resolved, setResolved] = useState<CarRemapsResolvedResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResolvedResults =
    !pending &&
    !error &&
    resolved !== null &&
    !!resolved.query.fuelType &&
    !!resolved.query.variant;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="bg-surface-card/30 border border-white/5 p-8 md:p-12">
        <CarRemapsSelectors
          onResolvedChange={setResolved}
          onPendingChange={setPending}
          onErrorChange={setError}
        />
      </div>

      {error && (
        <div
          role="alert"
          // eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: semantic error state tint. The theme's `error` token has no opacity-modifier or border variant (see components/contact-form.tsx for the same established pattern), so raw Tailwind red is used here instead of a no-op `bg-error/10`.
          className="bg-red-900/20 border border-red-700/50 text-error text-sm px-4 py-3 text-center"
        >
          {error}
        </div>
      )}

      {pending && (
        <p className="text-center text-white/50 font-sans py-8">Looking up performance figures…</p>
      )}

      {hasResolvedResults && resolved && (
        <CarRemapsResultsTable
          vehicles={resolved.results}
          fuelType={resolved.query.fuelType as string}
          variant={resolved.query.variant as string}
        />
      )}

      {!pending && !error && !resolved && (
        <p className="text-center text-white/40 text-sm font-sans">
          Select your vehicle above to see performance figures and Economy Tuning gains for your
          exact model.
        </p>
      )}
    </div>
  );
}
