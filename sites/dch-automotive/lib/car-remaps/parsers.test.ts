import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import {
  parseStoreApiPage,
  parsePipeValue,
  parseProductVariations,
  parseFilterBrandsResponse,
  parseFilterModelsResponse,
  normalizeMarqueName,
  normalizeModelName,
  buildScopeIndex,
  isInScopeVehicle,
  filterInScopeCategories,
} from './parsers';
import type { ScopeMarque, ScopeModel } from './types';

const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

function loadFixture(name: string): string {
  return readFileSync(path.join(FIXTURES_DIR, name), 'utf-8');
}

describe('parseStoreApiPage', () => {
  it('extracts id/name/slug/permalink/categories/attributes from a real Store API page', () => {
    const raw = loadFixture('store-api-page-1.json');
    const entries = parseStoreApiPage(raw);

    expect(entries.length).toBe(100);

    const mercedesCle = entries.find((e) => e.slug === 'mercedes-cle-2023-present');
    expect(mercedesCle).toBeDefined();
    expect(mercedesCle!.id).toBe(63446);
    // HTML entity &#8211; must be decoded to an en dash, not left raw.
    expect(mercedesCle!.name).toBe('Mercedes CLE Tuning (2023 – Present)');
    expect(mercedesCle!.permalink).toBe('https://viezu.com/shop/mercedes-cle-2023-present/');
    expect(mercedesCle!.categories).toContain('Mercedes Tuning');
    expect(mercedesCle!.categories).toContain('VLF | Vehicle Tuning and Remapping');
    expect(mercedesCle!.attributes.fuelTypes).toContain('Petrol');
    expect(mercedesCle!.attributes.variants).toContain('2.0');
  });

  it('decodes noise/cable-accessory product categories with entities resolved', () => {
    const raw = loadFixture('store-api-page-1.json');
    const entries = parseStoreApiPage(raw);
    const cableProduct = entries.find((e) => e.slug.includes('mazda-nissan-denso'));
    expect(cableProduct).toBeDefined();
    expect(cableProduct!.categories).toEqual(['Bench & Boot Cables', 'Tuning Accessories']);
  });

  it('throws on invalid JSON rather than returning an empty array', () => {
    expect(() => parseStoreApiPage('not json')).toThrow();
  });
});

describe('parseProductVariations', () => {
  it('parses the Mercedes CLE fixture (2-way pipe on "Petrol / 2.0")', () => {
    const html = loadFixture('product-mercedes-cle.html');
    const variations = parseProductVariations(html);

    expect(variations.length).toBeGreaterThan(0);
    const petrolTwoLitre = variations.find((v) => v.fuelType === 'Petrol' && v.variant === '2.0');
    expect(petrolTwoLitre).toBeDefined();
    expect(petrolTwoLitre!.originalBhp).toEqual({
      raw: '258 | 197',
      parsedValues: ['258', '197'],
      primaryValue: '258',
      secondaryValue: '197',
    });
    expect(petrolTwoLitre!.powerBhpGain.parsedValues).toEqual(['30', '25']);
    expect(petrolTwoLitre!.displayPriceCents).toBe(32900);
  });

  it('parses the Ford Transit Custom fixture (3-way pipe on "Diesel / 2.0", incl. the "x" k_type placeholder case)', () => {
    const html = loadFixture('product-ford-transit-custom.html');
    const variations = parseProductVariations(html);

    expect(variations.length).toBe(1);
    const dieselTwoLitre = variations[0];
    expect(dieselTwoLitre.fuelType).toBe('Diesel');
    expect(dieselTwoLitre.variant).toBe('2.0');
    expect(dieselTwoLitre.originalBhp.parsedValues).toEqual(['102', '136', '170']);
    expect(dieselTwoLitre.powerBhpGain.parsedValues).toEqual(['80', '54', '20']);
    expect(dieselTwoLitre.economyGainBhp.parsedValues).toEqual(['40', '25', '10']);
    expect(dieselTwoLitre.displayPriceCents).toBe(28900);
  });

  it('parses the Ford Transit Courier fixture (simple, single-valued fields, no pipes)', () => {
    const html = loadFixture('product-ford-transit-courier.html');
    const variations = parseProductVariations(html);

    expect(variations.length).toBe(2);
    for (const v of variations) {
      expect(v.originalBhp.parsedValues.length).toBe(1);
      expect(v.originalBhp.secondaryValue).toBeUndefined();
    }
  });

  it('parses the Toyota Camry fixture (mix of single-valued and pipe-delimited variations)', () => {
    const html = loadFixture('product-toyota-camry.html');
    const variations = parseProductVariations(html);

    expect(variations.length).toBe(4);
    const twoLitre = variations.find((v) => v.variant === '2.0');
    const twoFourLitre = variations.find((v) => v.variant === '2.4');
    const threeFiveLitre = variations.find((v) => v.variant === '3.5');

    expect(twoLitre!.originalBhp.parsedValues.length).toBe(4);
    expect(twoFourLitre!.originalBhp.parsedValues.length).toBe(3);
    expect(threeFiveLitre!.originalBhp.parsedValues.length).toBe(1);
  });

  it('EXPECTED FAILURE: throws when data-product_variations is stripped from the HTML', () => {
    const html = loadFixture('product-mercedes-cle.html');
    const stripped = html.replace(/data-product_variations="[^"]*"/, '');

    expect(stripped).not.toContain('data-product_variations=');
    expect(() => parseProductVariations(stripped)).toThrow(
      /no data-product_variations attribute found/
    );
  });

  it('EXPECTED FAILURE: throws for the category-noise fixture, which has no data-product_variations attribute at all', () => {
    const html = loadFixture('product-noise-alientech-cable.html');
    expect(() => parseProductVariations(html)).toThrow();
  });
});

describe('parseFilterBrandsResponse', () => {
  it('parses the real cars marque list', () => {
    const html = loadFixture('ajax-brands-cars.html');
    const marques = parseFilterBrandsResponse(html);

    expect(marques.length).toBeGreaterThan(0);
    const bmw = marques.find((m) => m.slug === 'bmw-tuning-remapping');
    expect(bmw).toBeDefined();
    expect(bmw!.name).toBe('BMW Tuning & Remapping');
  });

  it('parses the real vans marque list', () => {
    const html = loadFixture('ajax-brands-vans.html');
    const marques = parseFilterBrandsResponse(html);

    expect(marques.length).toBeGreaterThan(0);
    const ford = marques.find((m) => m.slug === 'ford-vans');
    expect(ford).toBeDefined();
    expect(ford!.name).toBe('Ford Vans Tuning & ECU Remapping');
  });

  it('EXPECTED FAILURE: throws on the literal "-1" nonce-failure response', () => {
    expect(() => parseFilterBrandsResponse('-1')).toThrow(/nonce/i);
  });
});

describe('parseFilterModelsResponse', () => {
  it('parses the real Ford (cars) model list', () => {
    const html = loadFixture('ajax-models-ford-tuning-remapping.html');
    const models = parseFilterModelsResponse(html);

    expect(models.length).toBeGreaterThan(0);
    expect(models.some((m) => m.slug === 'b-max-2012-present')).toBe(true);
  });

  it('parses the real Ford Vans model list, including the Transit Custom entry', () => {
    const html = loadFixture('ajax-models-ford-vans.html');
    const models = parseFilterModelsResponse(html);

    const transitCustom = models.find((m) => m.slug === 'transit-custom-2019-present');
    expect(transitCustom).toBeDefined();
    expect(transitCustom!.name).toBe('Transit Custom (2019 - Present ...)');
  });

  it('throws on a literal "-1" nonce-failure response', () => {
    expect(() => parseFilterModelsResponse('-1')).toThrow(/nonce/i);
  });
});

describe('normalizeMarqueName', () => {
  it('strips the documented suffix patterns from real cars marque names', () => {
    expect(normalizeMarqueName('Abarth Tuning & ECU Remapping')).toBe('abarth');
    expect(normalizeMarqueName('Alfa Romeo Car Tuning & ECU Remapping')).toBe('alfa romeo');
    expect(normalizeMarqueName('BMW Tuning & Remapping')).toBe('bmw');
    expect(normalizeMarqueName('Ford Car Tuning & Remapping')).toBe('ford');
    expect(normalizeMarqueName('Mercedes-Benz Tuning & Remapping')).toBe('mercedes-benz');
    expect(normalizeMarqueName('Jaguar Tuning & Remapping Service - Viezu')).toBe('jaguar');
    expect(normalizeMarqueName('Alpine')).toBe('alpine');
  });

  it('strips the documented suffix patterns from real vans marque names', () => {
    expect(normalizeMarqueName('Ford Vans Tuning & ECU Remapping')).toBe('ford');
    expect(normalizeMarqueName('Mercedes Van Tuning & ECU Remapping')).toBe('mercedes');
    expect(normalizeMarqueName('FIAT Vans')).toBe('fiat');
    expect(normalizeMarqueName('VW Vans')).toBe('vw');
  });

  it('documents the known cars-vs-vans naming mismatches (no unifying alias table)', () => {
    // Mercedes-Benz (cars) vs Mercedes (vans) — confirmed mismatch, not unified.
    expect(normalizeMarqueName('Mercedes-Benz Tuning & Remapping')).not.toBe(
      normalizeMarqueName('Mercedes Van Tuning & ECU Remapping')
    );
    // Volkswagen (cars) vs VW (vans) — confirmed mismatch, not unified.
    expect(normalizeMarqueName('Volkswagen Tuning & Remapping')).not.toBe(
      normalizeMarqueName('VW Vans')
    );
  });

  it('does not over-strip a vehicle-type word that is not a documented suffix (HGV/bike guardrail)', () => {
    // "Truck" and "Motorrad" must NOT be stripped — this is what keeps the
    // (marque, model) compound key collision-free across vehicle types.
    expect(normalizeMarqueName('Ford Truck Tuning & ECU Remapping')).toBe('ford truck');
    expect(normalizeMarqueName('Mercedes Truck Tuning & ECU Remapping')).toBe('mercedes truck');
  });
});

describe('normalizeModelName', () => {
  it('normalizes a real AJAX model name and its corresponding real Store API product name to the same value', () => {
    // AJAX: "Transit Custom (2019 - Present ...)" (Ford Vans, get_filter_models)
    const ajaxModelName = 'Transit Custom (2019 - Present ...)';
    // Store API: "Ford Transit Custom Tuning (2023 &#8211; Present)" — model half only
    // (normalizeModelName only handles the model half; marque-prefix removal is
    // isInScopeVehicle's job, tested separately below).
    const storeApiModelHalf = 'Transit Custom Tuning (2023 – Present)';

    expect(normalizeModelName(ajaxModelName)).toBe('transit custom');
    expect(normalizeModelName(storeApiModelHalf)).toBe('transit custom');
    expect(normalizeModelName(ajaxModelName)).toBe(normalizeModelName(storeApiModelHalf));
  });

  it('strips the malformed/inverted year-range parenthetical without trying to parse it', () => {
    expect(normalizeModelName('F-250 (- Present 2020)')).toBe('f-250');
  });

  it('handles a bare "(All)" parenthetical', () => {
    expect(normalizeModelName('Camry Tuning (All)')).toBe('camry');
  });

  it('strips a repeated marque-suffix pattern appended after the year-range parenthetical (real VW Golf products)', () => {
    // Confirmed live: several VW Golf variants repeat a MARQUE_SUFFIXES
    // pattern a second time, after the parenthetical rather than instead of
    // it, so the plain end-anchored parenthetical strip alone can't reach it.
    expect(
      normalizeModelName('Golf GTI Tuning (Golf 7 – 2012 – 2019) Tuning & ECU Remapping')
    ).toBe('golf gti');
    expect(normalizeModelName('Golf Tuning (Golf 8 – 2020 – Present) Tuning & ECU Remapping')).toBe(
      'golf'
    );
  });
});

describe('filterInScopeCategories', () => {
  it('returns true for real in-scope car/van categories', () => {
    expect(filterInScopeCategories(['Mercedes Tuning', 'VLF | Vehicle Tuning and Remapping'])).toBe(
      true
    );
  });

  it('returns false for the real category-noise fixture categories', () => {
    expect(filterInScopeCategories(['Bench & Boot Cables', 'Tuning Accessories'])).toBe(false);
  });

  it('returns false if any one category in a mixed list is excluded', () => {
    expect(filterInScopeCategories(['Mercedes Tuning', 'Tuning Accessories'])).toBe(false);
  });
});

describe('buildScopeIndex + isInScopeVehicle (end-to-end against real AJAX fixtures)', () => {
  const cars = parseFilterBrandsResponse(loadFixture('ajax-brands-cars.html'));
  const vans = parseFilterBrandsResponse(loadFixture('ajax-brands-vans.html'));

  const modelsByMarque = new Map<string, ScopeModel[]>();
  modelsByMarque.set(
    'bmw-tuning-remapping',
    parseFilterModelsResponse(loadFixture('ajax-models-bmw-tuning-remapping.html'))
  );
  modelsByMarque.set(
    'ford-tuning-remapping',
    parseFilterModelsResponse(loadFixture('ajax-models-ford-tuning-remapping.html'))
  );
  modelsByMarque.set(
    'ford-vans',
    parseFilterModelsResponse(loadFixture('ajax-models-ford-vans.html'))
  );
  modelsByMarque.set(
    'mercedes-benz-vans',
    parseFilterModelsResponse(loadFixture('ajax-models-mercedes-benz-vans.html'))
  );

  const index = buildScopeIndex({ cars, vans }, modelsByMarque);

  it('builds a non-empty scope index with merged marque keys', () => {
    expect(index.size).toBeGreaterThan(0);
    expect(index.has('ford')).toBe(true);
    expect(index.get('ford')!.size).toBeGreaterThan(0);
  });

  it('returns true for a real in-scope product (Ford Transit Custom)', () => {
    const productName = 'Ford Transit Custom Tuning (2023 – Present)';
    expect(isInScopeVehicle(productName, index)).toBe(true);
  });

  it('returns false for a real out-of-scope product (category-noise cable/adapter, no recognizable marque)', () => {
    const productName =
      'Alientech KESS3 – Adapter for Mazda- Nissan Denso ECU ( Renesas SH705x -RD-)';
    expect(isInScopeVehicle(productName, index)).toBe(false);
  });

  it('returns false for a product whose marque exists but whose model does not', () => {
    const productName = 'Ford Nonexistent Model Tuning (2023 – Present)';
    expect(isInScopeVehicle(productName, index)).toBe(false);
  });
});

describe('buildScopeIndex marque aliasing (Volkswagen/VW abbreviation fix)', () => {
  // Synthetic input, not a fixture: this tests the MARQUE_ALIASES table's
  // mechanics directly, mirroring the real shapes confirmed live (runbook
  // "Known Issues" §5) — the cars list spells the marque out in full, but
  // Store API car product names use the "VW" abbreviation.
  const cars: ScopeMarque[] = [
    { slug: 'volkswagen-tuning-remapping', name: 'Volkswagen Tuning & Remapping' },
  ];
  const vans: ScopeMarque[] = [{ slug: 'vw-vans', name: 'VW Vans' }];
  const modelsByMarque = new Map<string, ScopeModel[]>([
    [
      'volkswagen-tuning-remapping',
      [{ slug: 'golf-gti-7-2012-2019', name: 'Golf GTI (Golf 7 - 2012 - 2019)' }],
    ],
    ['vw-vans', [{ slug: 'transporter-t6', name: 'Transporter T6' }]],
  ]);
  const index = buildScopeIndex({ cars, vans }, modelsByMarque);

  it('cross-aliases "volkswagen" and "vw" to the union of both keys\' models', () => {
    expect(index.get('vw')).toEqual(index.get('volkswagen'));
    // normalizeModelName strips the trailing year-range parenthetical too.
    expect(index.get('vw')?.has('golf gti')).toBe(true);
    expect(index.get('volkswagen')?.has('transporter t6')).toBe(true);
  });

  it('matches a real VW car product name (previously silently excluded)', () => {
    const productName = 'VW Golf GTI Tuning (Golf 7 – 2012 – 2019)';
    expect(isInScopeVehicle(productName, index)).toBe(true);
  });

  it('matches a real VW car product name with the repeated trailing suffix (previously still excluded after the alias fix alone)', () => {
    const productName = 'VW Golf GTI Tuning (Golf 7 – 2012 – 2019) Tuning & ECU Remapping';
    expect(isInScopeVehicle(productName, index)).toBe(true);
  });
});

describe('parsePipeValue', () => {
  it('splits and trims a multi-value pipe field', () => {
    expect(parsePipeValue('258 | 197')).toEqual({
      raw: '258 | 197',
      parsedValues: ['258', '197'],
      primaryValue: '258',
      secondaryValue: '197',
    });
  });

  it('handles a single-value (non-pipe) field with no secondaryValue', () => {
    expect(parsePipeValue('305')).toEqual({
      raw: '305',
      parsedValues: ['305'],
      primaryValue: '305',
      secondaryValue: undefined,
    });
  });

  it('handles the 3-way "x" placeholder case from the Ford Transit Custom k_type field', () => {
    const result = parsePipeValue('151589 | x | 152507_152505');
    expect(result.parsedValues).toEqual(['151589', 'x', '152507_152505']);
    expect(result.primaryValue).toBe('151589');
    expect(result.secondaryValue).toBe('x');
  });
});
