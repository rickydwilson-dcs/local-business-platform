'use client';

/**
 * Cascading Make -> Model -> Fuel Type -> Variant selectors for the Car
 * Remaps ready reckoner.
 *
 * Talks to the progressive-disclosure `/api/car-remaps/lookup` endpoint (see
 * `lib/api/car-remaps-lookup-route.ts` for the exact response contract) —
 * never fetches the full catalogue into client state. Each selection fetches
 * only the next level of options, and the final (variant) selection reuses
 * that same fully-specified fetch to resolve the matching vehicle(s), which
 * is reported up via `onResolvedChange` rather than being fetched again.
 */

import { useEffect, useState } from 'react';
import type { NormalizedVehicle } from '@/lib/car-remaps/types';

export interface CarRemapsQuery {
  make?: string;
  model?: string;
  fuelType?: string;
  variant?: string;
}

export interface CarRemapsResolvedResult {
  query: CarRemapsQuery;
  results: NormalizedVehicle[];
  canonicalUrl?: string;
  sourceUpdatedAt?: string;
}

interface MakeOption {
  slug: string;
  name: string;
  modelCount: number;
}

interface ModelOption {
  model: string;
  modelSlug: string;
}

/** Shape returned at every level of `/api/car-remaps/lookup` — see route doc for the exact contract. */
interface RawLookupResponse {
  query: CarRemapsQuery;
  options?: {
    makes?: MakeOption[];
    models?: ModelOption[];
    fuelTypes?: string[];
    variants?: string[];
  };
  results?: NormalizedVehicle[];
  canonicalUrl?: string;
  sourceUpdatedAt?: string;
  error?: string;
}

interface CarRemapsSelectorsProps {
  onResolvedChange: (result: CarRemapsResolvedResult | null) => void;
  onPendingChange: (pending: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

async function fetchLookup(params: CarRemapsQuery): Promise<RawLookupResponse> {
  const search = new URLSearchParams();
  if (params.make) search.set('make', params.make);
  if (params.model) search.set('model', params.model);
  if (params.fuelType) search.set('fuelType', params.fuelType);
  if (params.variant) search.set('variant', params.variant);
  const qs = search.toString();

  const response = await fetch(`/api/car-remaps/lookup${qs ? `?${qs}` : ''}`);
  const data = (await response.json()) as RawLookupResponse;

  if (!response.ok) {
    throw new Error(data.error || 'Vehicle lookup failed. Please try again.');
  }

  return data;
}

const selectClasses =
  'w-full bg-surface-background border border-white/10 text-white font-sans px-4 py-3 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed';
const labelClasses =
  'block text-xs font-heading font-bold uppercase tracking-widest text-white/50 mb-2';

export function CarRemapsSelectors({
  onResolvedChange,
  onPendingChange,
  onErrorChange,
}: CarRemapsSelectorsProps) {
  const [makes, setMakes] = useState<MakeOption[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [variants, setVariants] = useState<string[]>([]);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');

  const [makesLoading, setMakesLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [fuelTypesLoading, setFuelTypesLoading] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);

  // Load makes on mount.
  useEffect(() => {
    let cancelled = false;
    setMakesLoading(true);
    fetchLookup({})
      .then((data) => {
        if (cancelled) return;
        setMakes(data.options?.makes ?? []);
        onErrorChange(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        onErrorChange(err instanceof Error ? err.message : 'Failed to load vehicle makes.');
      })
      .finally(() => {
        if (!cancelled) setMakesLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only fetch, callbacks are stable setters from the parent
  }, []);

  function handleMakeChange(value: string) {
    setSelectedMake(value);
    setSelectedModel('');
    setModels([]);
    setSelectedFuelType('');
    setFuelTypes([]);
    setSelectedVariant('');
    setVariants([]);
    onResolvedChange(null);
    onErrorChange(null);

    if (!value) return;

    setModelsLoading(true);
    fetchLookup({ make: value })
      .then((data) => {
        setModels(data.options?.models ?? []);
        onErrorChange(null);
      })
      .catch((err: unknown) => {
        onErrorChange(err instanceof Error ? err.message : 'Failed to load models.');
      })
      .finally(() => setModelsLoading(false));
  }

  function handleModelChange(value: string) {
    setSelectedModel(value);
    setSelectedFuelType('');
    setFuelTypes([]);
    setSelectedVariant('');
    setVariants([]);
    onResolvedChange(null);
    onErrorChange(null);

    if (!value) return;

    setFuelTypesLoading(true);
    fetchLookup({ make: selectedMake, model: value })
      .then((data) => {
        setFuelTypes(data.options?.fuelTypes ?? []);
        onErrorChange(null);
      })
      .catch((err: unknown) => {
        onErrorChange(err instanceof Error ? err.message : 'Failed to load fuel types.');
      })
      .finally(() => setFuelTypesLoading(false));
  }

  function handleFuelTypeChange(value: string) {
    setSelectedFuelType(value);
    setSelectedVariant('');
    setVariants([]);
    onResolvedChange(null);
    onErrorChange(null);

    if (!value) return;

    setVariantsLoading(true);
    fetchLookup({ make: selectedMake, model: selectedModel, fuelType: value })
      .then((data) => {
        setVariants(data.options?.variants ?? []);
        onErrorChange(null);
      })
      .catch((err: unknown) => {
        onErrorChange(err instanceof Error ? err.message : 'Failed to load variants.');
      })
      .finally(() => setVariantsLoading(false));
  }

  function handleVariantChange(value: string) {
    setSelectedVariant(value);
    onResolvedChange(null);
    onErrorChange(null);

    if (!value) return;

    onPendingChange(true);
    fetchLookup({
      make: selectedMake,
      model: selectedModel,
      fuelType: selectedFuelType,
      variant: value,
    })
      .then((data) => {
        onResolvedChange({
          query: data.query,
          results: data.results ?? [],
          canonicalUrl: data.canonicalUrl,
          sourceUpdatedAt: data.sourceUpdatedAt,
        });
        onErrorChange(null);
      })
      .catch((err: unknown) => {
        onResolvedChange(null);
        onErrorChange(err instanceof Error ? err.message : 'Failed to resolve vehicle.');
      })
      .finally(() => onPendingChange(false));
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label className={labelClasses} htmlFor="remap-make">
          Make
        </label>
        <select
          id="remap-make"
          className={selectClasses}
          value={selectedMake}
          disabled={makesLoading}
          onChange={(e) => handleMakeChange(e.target.value)}
        >
          <option value="">{makesLoading ? 'Loading makes…' : 'Select make'}</option>
          {makes.map((make) => (
            <option key={make.slug} value={make.slug}>
              {make.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses} htmlFor="remap-model">
          Model
        </label>
        <select
          id="remap-model"
          className={selectClasses}
          value={selectedModel}
          disabled={!selectedMake || modelsLoading}
          onChange={(e) => handleModelChange(e.target.value)}
        >
          <option value="">
            {!selectedMake
              ? 'Select a make first'
              : modelsLoading
                ? 'Loading models…'
                : 'Select model'}
          </option>
          {models.map((model) => (
            <option key={model.modelSlug} value={model.modelSlug}>
              {model.model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses} htmlFor="remap-fuel-type">
          Fuel Type
        </label>
        <select
          id="remap-fuel-type"
          className={selectClasses}
          value={selectedFuelType}
          disabled={!selectedModel || fuelTypesLoading}
          onChange={(e) => handleFuelTypeChange(e.target.value)}
        >
          <option value="">
            {!selectedModel
              ? 'Select a model first'
              : fuelTypesLoading
                ? 'Loading…'
                : 'Select fuel type'}
          </option>
          {fuelTypes.map((fuelType) => (
            <option key={fuelType} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses} htmlFor="remap-variant">
          Variant
        </label>
        <select
          id="remap-variant"
          className={selectClasses}
          value={selectedVariant}
          disabled={!selectedFuelType || variantsLoading}
          onChange={(e) => handleVariantChange(e.target.value)}
        >
          <option value="">
            {!selectedFuelType
              ? 'Select a fuel type first'
              : variantsLoading
                ? 'Loading…'
                : 'Select variant'}
          </option>
          {variants.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
