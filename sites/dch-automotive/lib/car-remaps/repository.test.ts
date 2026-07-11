/**
 * Tests run against the real generated data under `data/car-remaps/` (not
 * mocks) — this is real synced Viezu data, and the fixtures asserted on here
 * (Alpine A110, BMW 5-series) are chosen from what's actually present in
 * `data/car-remaps/makes/alpine.json` and `bmw.json`.
 */

import { describe, it, expect } from 'vitest';
import {
  listMakes,
  listModelsForMake,
  listFuelTypes,
  listVariants,
  findVehicle,
  getManifest,
} from './repository';
import type { NormalizedVehicle } from './types';

describe('listMakes', () => {
  it('returns a non-empty, alphabetically sorted array', async () => {
    const makes = await listMakes();
    expect(makes.length).toBeGreaterThan(0);

    const bmw = makes.find((m) => m.slug === 'bmw');
    expect(bmw).toBeDefined();
    expect(bmw!.name).toBe('BMW');
    expect(bmw!.modelCount).toBeGreaterThan(0);

    const sorted = [...makes].sort((a, b) => a.name.localeCompare(b.name));
    expect(makes.map((m) => m.slug)).toEqual(sorted.map((m) => m.slug));
  });
});

describe('listModelsForMake', () => {
  it('returns distinct models for bmw, deduplicated by modelSlug', async () => {
    const models = await listModelsForMake('bmw');
    expect(models.length).toBeGreaterThan(0);

    const five = models.find((m) => m.modelSlug === '5');
    expect(five).toBeDefined();
    expect(five!.model).toBe('5');

    // modelSlug is unique within the returned list even though bmw.json has
    // multiple generations sharing modelSlug "5" (e34/e39/e60/f10/g30 etc).
    const slugs = models.map((m) => m.modelSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('returns [] for a nonexistent make', async () => {
    const models = await listModelsForMake('not-a-real-make');
    expect(models).toEqual([]);
  });
});

describe('listFuelTypes / listVariants', () => {
  it('returns Petrol for alpine a110, and variant 1.8', async () => {
    const fuelTypes = await listFuelTypes('alpine', 'a110');
    expect(fuelTypes).toEqual(['Petrol']);

    const variants = await listVariants('alpine', 'a110', 'Petrol');
    expect(variants).toEqual(['1.8']);
  });
});

describe('findVehicle', () => {
  it('returns a single NormalizedVehicle for a fully-specified, unambiguous match (alpine a110)', async () => {
    const result = await findVehicle({
      make: 'alpine',
      model: 'a110',
      fuelType: 'Petrol',
      variant: '1.8',
    });

    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(false);
    const vehicle = result as NormalizedVehicle;
    expect(vehicle.model).toBe('A110');
    expect(vehicle.sourceProductId).toBe(17915);
  });

  it('returns an array of NormalizedVehicle when multiple generations match (bmw 5-series, Petrol 3.0)', async () => {
    const result = await findVehicle({
      make: 'bmw',
      model: '5',
      fuelType: 'Petrol',
      variant: '3.0',
    });

    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBeGreaterThan(1);
  });

  it('returns null for a nonexistent make (not a throw)', async () => {
    const result = await findVehicle({ make: 'not-a-real-make', model: 'anything' });
    expect(result).toBeNull();
  });

  it('returns null when make is given but model is omitted', async () => {
    const result = await findVehicle({ make: 'bmw' });
    expect(result).toBeNull();
  });

  it('returns null for a nonexistent model under a real make', async () => {
    const result = await findVehicle({ make: 'bmw', model: 'not-a-real-model' });
    expect(result).toBeNull();
  });

  it('is deterministic: two sequential calls to the same lookup return deep-equal results', async () => {
    const first = await findVehicle({ make: 'alpine', model: 'a110', fuelType: 'Petrol' });
    const second = await findVehicle({ make: 'alpine', model: 'a110', fuelType: 'Petrol' });
    expect(second).toEqual(first);

    const firstMany = await findVehicle({ make: 'bmw', model: '5' });
    const secondMany = await findVehicle({ make: 'bmw', model: '5' });
    expect(secondMany).toEqual(firstMany);
  });
});

describe('getManifest', () => {
  it('returns generatedAt and other provenance fields', async () => {
    const manifest = await getManifest();
    expect(typeof manifest.generatedAt).toBe('string');
    expect(manifest.generatedAt.length).toBeGreaterThan(0);
    expect(manifest.sourceUrl).toBe('https://viezu.com');
    expect(Array.isArray(manifest.makes)).toBe(true);
    expect(manifest.makes.length).toBeGreaterThan(0);
  });
});
