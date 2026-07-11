/**
 * Pure-function parsers for the Viezu WooCommerce Store API catalogue, the
 * `data-product_variations` performance-data blob, and the `admin-ajax.php`
 * marque/model cascade that scopes cars+vans on the live `/dealer` widget.
 *
 * No network calls here — every function takes raw text (JSON or HTML) and
 * returns parsed data, or throws. See `__fixtures__/README.md` for the full
 * data-shape investigation these parsers are built against.
 */

import type {
  CatalogEntry,
  PipeValue,
  ScopeIndex,
  ScopeMarque,
  ScopeModel,
  VariationPerformance,
} from './types';

// ---------------------------------------------------------------------------
// HTML entity decoding
// ---------------------------------------------------------------------------

/**
 * Named HTML entities observed across the Viezu fixtures. Not an
 * exhaustive HTML5 entity table — just the entities that actually appear
 * in this data source (see fixtures README's entity scan).
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  raquo: '»',
  laquo: '«',
  euro: '€',
  pound: '£',
  copy: '©',
  reg: '®',
  trade: '™',
  times: '×',
  divide: '÷',
};

/** Decodes HTML entities (named + numeric decimal/hex) found in Viezu data. */
export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1] === 'x' || entity[1] === 'X';
      const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    const named = NAMED_ENTITIES[entity];
    return named !== undefined ? named : match;
  });
}

// ---------------------------------------------------------------------------
// Store API catalogue parsing
// ---------------------------------------------------------------------------

/** Parses one WooCommerce Store API catalogue page (`GET /wp-json/wc/store/v1/products`). */
export function parseStoreApiPage(rawJson: string): CatalogEntry[] {
  let data: unknown;
  try {
    data = JSON.parse(rawJson);
  } catch (err) {
    throw new Error(`parseStoreApiPage: failed to JSON.parse response: ${(err as Error).message}`);
  }
  if (!Array.isArray(data)) {
    throw new Error('parseStoreApiPage: expected the response to decode to an array of products');
  }
  return data.map((raw) => parseStoreApiProduct(raw as Record<string, unknown>));
}

function parseStoreApiProduct(raw: Record<string, unknown>): CatalogEntry {
  const categories = Array.isArray(raw.categories)
    ? (raw.categories as Array<Record<string, unknown>>).map((c) =>
        decodeHtmlEntities(String(c.name ?? ''))
      )
    : [];

  const attributesRaw = Array.isArray(raw.attributes)
    ? (raw.attributes as Array<Record<string, unknown>>)
    : [];

  const fuelTypeAttr = attributesRaw.find((a) => String(a.name ?? '') === 'Fuel Type');
  const variantAttr = attributesRaw.find((a) => String(a.name ?? '') === 'Variant');

  const termNames = (attr: Record<string, unknown> | undefined): string[] =>
    Array.isArray(attr?.terms)
      ? (attr!.terms as Array<Record<string, unknown>>).map((t) =>
          decodeHtmlEntities(String(t.name ?? ''))
        )
      : [];

  return {
    id: Number(raw.id ?? 0),
    name: decodeHtmlEntities(String(raw.name ?? '')),
    slug: String(raw.slug ?? ''),
    permalink: String(raw.permalink ?? ''),
    categories,
    attributes: {
      fuelTypes: termNames(fuelTypeAttr),
      variants: termNames(variantAttr),
    },
  };
}

// ---------------------------------------------------------------------------
// Pipe-delimited field parsing
// ---------------------------------------------------------------------------

/**
 * Parses a pipe-delimited field per the confirmed interpretation in
 * `__fixtures__/README.md`: split on `|`, trim whitespace on each token,
 * `primaryValue` is the first token, `secondaryValue` the second (if any).
 */
export function parsePipeValue(raw: string): PipeValue {
  const parsedValues = raw.split('|').map((v) => v.trim());
  return {
    raw,
    parsedValues,
    primaryValue: parsedValues[0] ?? '',
    secondaryValue: parsedValues.length > 1 ? parsedValues[1] : undefined,
  };
}

// ---------------------------------------------------------------------------
// data-product_variations parsing
// ---------------------------------------------------------------------------

/** Extracts a `<link rel="canonical">` URL from a product page, for error context. */
function productContext(html: string): string {
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/);
  return canonical ? ` (product: ${canonical[1]})` : '';
}

/**
 * Locates the `data-product_variations="..."` attribute in a Viezu product
 * detail page, HTML-entity-decodes it, `JSON.parse()`s it, and maps each
 * variation object into a `VariationPerformance` record.
 *
 * Breakage detection: throws an explicit `Error` (never returns `[]`
 * silently) if the attribute is missing, unterminated, or fails to
 * `JSON.parse()` — this is the primary Viezu-markup-drift detector for the
 * Phase 3 sync script's fail-fast threshold.
 */
export function parseProductVariations(html: string): VariationPerformance[] {
  const marker = 'data-product_variations="';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    throw new Error(
      `parseProductVariations: no data-product_variations attribute found${productContext(html)}`
    );
  }

  const contentStart = startIdx + marker.length;
  const endIdx = html.indexOf('"', contentStart);
  if (endIdx === -1) {
    throw new Error(
      `parseProductVariations: unterminated data-product_variations attribute${productContext(html)}`
    );
  }

  const rawAttr = html.slice(contentStart, endIdx);
  const decoded = decodeHtmlEntities(rawAttr);

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch (err) {
    throw new Error(
      `parseProductVariations: failed to JSON.parse data-product_variations${productContext(html)}: ${(err as Error).message}`
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `parseProductVariations: expected data-product_variations to decode to an array${productContext(html)}`
    );
  }

  return parsed.map((raw) => parseVariationRecord(raw as Record<string, unknown>));
}

function parseVariationRecord(raw: Record<string, unknown>): VariationPerformance {
  const attributes = (raw.attributes ?? {}) as Record<string, unknown>;
  return {
    fuelType: String(attributes['attribute_fuel-type'] ?? ''),
    variant: String(attributes['attribute_variant'] ?? ''),
    originalBhp: parsePipeValue(String(raw.original_bhp ?? '')),
    powerBhpGain: parsePipeValue(String(raw.power_bhp ?? '')),
    originalTorque: parsePipeValue(String(raw.original_torque ?? '')),
    torqueNmGain: parsePipeValue(String(raw.torque_nm ?? '')),
    economyGainBhp: parsePipeValue(String(raw.economy_gain_bhp ?? '')),
    economyGainNm: parsePipeValue(String(raw.economy_gain_nm ?? '')),
    fuelSaving: parsePipeValue(String(raw.fuel_saving ?? '')),
    displayPriceCents: Number(raw.display_price_cents ?? 0),
  };
}

// ---------------------------------------------------------------------------
// AJAX marque/model cascade parsing (`admin-ajax.php`)
// ---------------------------------------------------------------------------

function parseOptionList(html: string): Array<{ slug: string; name: string }> {
  const options: Array<{ slug: string; name: string }> = [];
  const optionRegex = /<option\s+value="([^"]*)"\s*>([^<]*)<\/option>/g;
  let match: RegExpExecArray | null;
  while ((match = optionRegex.exec(html)) !== null) {
    const slug = match[1];
    if (!slug) continue; // skip the "Select Make" / "Select Model" placeholder
    options.push({ slug, name: decodeHtmlEntities(match[2]).trim() });
  }
  return options;
}

/**
 * Parses a `get_filter_brands` AJAX response into marque records.
 *
 * Breakage detection: throws if the response is the literal string `-1`
 * (WordPress's generic AJAX nonce/action failure response) or if zero
 * `<option>` marques were parsed — silently returning `[]` would look
 * identical to "this vehicle type genuinely has zero marques."
 */
export function parseFilterBrandsResponse(html: string): ScopeMarque[] {
  if (html.trim() === '-1') {
    throw new Error(
      'parseFilterBrandsResponse: received "-1" (WordPress AJAX nonce/action failure response) — the nonce likely expired and needs refreshing'
    );
  }
  const marques = parseOptionList(html);
  if (marques.length === 0) {
    throw new Error('parseFilterBrandsResponse: parsed zero <option> marques from the response');
  }
  return marques;
}

/**
 * Parses a `get_filter_models` AJAX response into model records. Same
 * nonce-failure / zero-options breakage detection as
 * `parseFilterBrandsResponse`.
 */
export function parseFilterModelsResponse(html: string): ScopeModel[] {
  if (html.trim() === '-1') {
    throw new Error(
      'parseFilterModelsResponse: received "-1" (WordPress AJAX nonce/action failure response) — the nonce likely expired and needs refreshing'
    );
  }
  const models = parseOptionList(html);
  if (models.length === 0) {
    throw new Error('parseFilterModelsResponse: parsed zero <option> models from the response');
  }
  return models;
}

// ---------------------------------------------------------------------------
// Marque / model name normalization
// ---------------------------------------------------------------------------

/**
 * Documented marque-name suffix patterns (fixtures README, "Full parsed
 * marque lists and suffix patterns"). Sorted longest-first at use time so a
 * more specific suffix (e.g. `" Car Tuning & ECU Remapping"`) is always
 * tried before a shorter suffix it would otherwise also match as a tail
 * substring (e.g. `" Tuning & ECU Remapping"`).
 *
 * Guardrail (per fixtures README's cross-vehicle-type marque check): this
 * list must stay an exact, closed set of documented suffixes — never a
 * looser pattern like "any trailing `<Word> Tuning & ...Remapping`" — or it
 * would collapse distinct marques like "Ford Truck Tuning & ECU Remapping"
 * (hgv) down to "ford", reintroducing a marque-level collision with the car
 * "Ford" that the (marque, model) compound key was confirmed safe against.
 */
const MARQUE_SUFFIXES = [
  ' Tuning & ECU Remapping',
  ' Car Tuning & ECU Remapping',
  ' Tuning & Remapping',
  ' Car Tuning & Remapping',
  ' Tuning & Remapping Service - Viezu',
  ' Vans Tuning & ECU Remapping',
  ' Van Tuning & ECU Remapping',
  ' Vans',
].sort((a, b) => b.length - a.length);

/**
 * Strips the documented vehicle-type-indicating suffix (if any) from a raw
 * marque name and lowercases the result, e.g. `"BMW Tuning & Remapping"` →
 * `"bmw"`, `"Ford Vans Tuning & ECU Remapping"` → `"ford"`.
 */
export function normalizeMarqueName(raw: string): string {
  const decoded = decodeHtmlEntities(raw).trim();
  for (const suffix of MARQUE_SUFFIXES) {
    if (decoded.endsWith(suffix)) {
      return decoded
        .slice(0, decoded.length - suffix.length)
        .trim()
        .toLowerCase();
    }
  }
  return decoded.toLowerCase();
}

/**
 * Marque keys with a whole-word abbreviation mismatch between the `cars` and
 * `vans` AJAX marque lists, confirmed live (fixtures README + runbook
 * "Known Issues"): the `cars` list spells the marque out in full
 * ("Volkswagen Tuning & Remapping" → normalized key `"volkswagen"`), but
 * Store API *car* product names use the abbreviation "VW" as their leading
 * token, matching only the `vans` list's own `"vw"` key. This is structurally
 * different from the Mercedes-Benz/Mercedes mismatch (a hyphenated compound,
 * already handled by `isInScopeVehicle`'s first-token split) — an
 * abbreviation isn't a prefix or suffix of the full name, so no suffix-strip
 * or split rule can derive one from the other. `buildScopeIndex` uses this
 * table to alias each key to the others' merged model set.
 *
 * If a future audit (see runbook §5) finds another marque with this same
 * failure mode, add it here rather than special-casing it in
 * `isInScopeVehicle`.
 */
const MARQUE_ALIASES: Record<string, string[]> = {
  volkswagen: ['vw'],
};

/**
 * Strips the trailing year-range parenthetical and a trailing bare "Tuning"
 * word from a model name, then lowercases/trims. Handles both AJAX model
 * names (no marque prefix, no "Tuning" word) and the model-only portion of
 * a Store API product name (has a trailing "Tuning" word before the
 * parenthetical) — see fixtures README's "Model-name pattern" section.
 *
 * Some Store API product names (confirmed live for several VW Golf variants,
 * e.g. `"Golf GTI Tuning (Golf 7 – 2012 – 2019) Tuning & ECU Remapping"`)
 * repeat one of the `MARQUE_SUFFIXES` patterns a *second* time, after the
 * year-range parenthetical rather than instead of it. The plain
 * end-anchored parenthetical strip below can't reach the parenthetical when
 * that trailing suffix follows it, so it must be stripped first.
 *
 * Deliberately does not attempt to parse or validate the year-range
 * portion itself — the AJAX side's year ranges are confirmed unreliable
 * (inconsistent ordering, stray punctuation, mismatched vs. the Store API's
 * range for the same real vehicle).
 */
export function normalizeModelName(raw: string): string {
  let value = decodeHtmlEntities(raw).trim();
  for (const suffix of MARQUE_SUFFIXES) {
    if (value.endsWith(suffix)) {
      value = value.slice(0, value.length - suffix.length).trim();
      break;
    }
  }
  value = value.replace(/\s*\([^)]*\)\s*$/, '');
  value = value.replace(/\s+Tuning\s*$/i, '');
  return value.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// Scope index (in-scope (marque, model) membership)
// ---------------------------------------------------------------------------

/**
 * Builds the normalized (marque, model) in-scope index from the raw `cars`
 * + `vans` AJAX marque lists and their fetched models. Marque keys that
 * normalize identically across `cars` and `vans` (the common case) are
 * merged into one entry with the union of both vehicle types' models.
 * Marques with a hyphenated-compound naming mismatch (e.g. Mercedes-Benz vs.
 * Mercedes) remain distinct keys — `isInScopeVehicle`'s first-token split
 * handles that case. Marques with a whole-word-abbreviation mismatch (e.g.
 * Volkswagen vs. VW) are additionally cross-aliased via `MARQUE_ALIASES`
 * below, since no prefix/suffix rule can derive one spelling from the other.
 */
export function buildScopeIndex(
  marques: { cars: ScopeMarque[]; vans: ScopeMarque[] },
  modelsByMarque: Map<string, ScopeModel[]>
): ScopeIndex {
  const index: ScopeIndex = new Map();
  const allMarques = [...marques.cars, ...marques.vans];

  for (const marque of allMarques) {
    const normalizedMarque = normalizeMarqueName(marque.name);
    const models = modelsByMarque.get(marque.slug) ?? [];
    const existing = index.get(normalizedMarque) ?? new Set<string>();
    for (const model of models) {
      existing.add(normalizeModelName(model.name));
    }
    index.set(normalizedMarque, existing);
  }

  // Cross-alias whole-word-abbreviation marques (e.g. "volkswagen" <-> "vw")
  // so a product name matching under either spelling resolves to the union
  // of both keys' models.
  for (const [canonical, aliases] of Object.entries(MARQUE_ALIASES)) {
    const merged = new Set<string>([
      ...(index.get(canonical) ?? []),
      ...aliases.flatMap((alias) => Array.from(index.get(alias) ?? [])),
    ]);
    if (merged.size === 0) continue;
    index.set(canonical, merged);
    for (const alias of aliases) {
      index.set(alias, merged);
    }
  }

  return index;
}

/**
 * Checks whether a raw Store API product name is a real, in-scope
 * (car or van) vehicle listing, per the `ScopeIndex` built from the live
 * AJAX marque/model cascade.
 *
 * Confirmed safe (fixtures README, "Cross-vehicle-type marque check
 * result"): no model-name overlap was found within a shared marque across
 * cars/vans/hgv/bike, so a (normalizedMarque, normalizedModel) membership
 * check alone is sufficient — no third disambiguating signal is needed.
 */
export function isInScopeVehicle(productName: string, index: ScopeIndex): boolean {
  const decoded = decodeHtmlEntities(productName).trim();
  const lower = decoded.toLowerCase();

  // Try longer (more specific) marque keys first so a multi-word marque
  // isn't shadowed by a shorter false-positive prefix.
  const marqueKeys = Array.from(index.keys()).sort((a, b) => b.length - a.length);

  for (const marqueKey of marqueKeys) {
    // Tolerate the confirmed cars-vs-vans naming mismatch (e.g. index key
    // "mercedes-benz" but the Store API product name only says "Mercedes")
    // by also trying just the marque key's first hyphen/space-separated
    // token as a prefix.
    const candidatePrefixes = Array.from(new Set([marqueKey, marqueKey.split(/[\s-]+/)[0]]));

    for (const prefix of candidatePrefixes) {
      if (!prefix || !lower.startsWith(`${prefix} `)) continue;

      const remainder = decoded.slice(prefix.length).trim();
      const normalizedModel = normalizeModelName(remainder);
      const models = index.get(marqueKey);
      if (models?.has(normalizedModel)) {
        return true;
      }
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Category-based exclusion (unconditional, independent of isInScopeVehicle)
// ---------------------------------------------------------------------------

/**
 * Unambiguous non-vehicle categories (tools, cables, accessories,
 * performance parts) confirmed in `__fixtures__/README.md`'s "Car + Van
 * category scope decision" section. This is an exclusion-only list — it is
 * NOT used as an include-list for vehicle scope (that's `isInScopeVehicle`'s
 * job); it only catches noise `isInScopeVehicle` was never designed to
 * catch, e.g. a diagnostic-tool product with no recognizable marque name.
 */
const EXCLUDED_CATEGORY_NAMES = new Set(
  [
    'Professional Tuning Tools Hardware & Software',
    'Cables & Accessories',
    'Alientech Cables & Accessories',
    'Alientech Tuning Tools',
    'Alientech KESS3 Tuning Tools',
    'Alientech ECM Titanium',
    'Alientech Powergate',
    'Bench & Boot Cables',
    'Agriculture Cables - Truck & Buses',
    'Bike Cables - ATV & UTV',
    'Car Cables - LCV',
    'Dimsport',
    'Dimsport Cables & Accessories',
    'Autotuner Professional Tools',
    'Autotuner Cables & Accessories',
    'Autotuner The One',
    'Magic Motorsport',
    'Magic Motorsport Cables & Accessories',
    'Tuning Accessories',
    'Tuning Tools',
    'Tuning Tool Subscription Renewals',
    'Vehicle Tuning Software',
    'EVC WinOLS',
    'VC Power Swiftec Tuning Software',
    'Swiftec',
    'Diagnostic Tools',
    'Battery Stablizer / Charger',
    'Bench Stands',
    'DIY Tuning Devices',
    'DIY Tuning Devices V-Switch',
    'V-Switch',
    'VIEZU V-Box',
    'Tuning Box',
    'JB4 Tuning Device',
    'Vehicle Performance Parts and Styling',
    'PWR Cooling',
    'Supercharger Pulley',
    'Charger cooler',
    'Supercharge cooler',
    'Carbon Fibre Performance Parts',
    'TAROX Brakes',
    'VIP Design London',
    'VIP Design Jaguar Packages',
    'Performance Exhaust Systems',
    'Paramount Performance Exhausts',
    'Milltek Performance Exhausts',
  ].map(normalizeCategoryName)
);

/** Normalizes dash variants (en/em dash vs. hyphen) and whitespace for category-name comparison. */
function normalizeCategoryName(name: string): string {
  return decodeHtmlEntities(name).replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Returns `false` if any of the given categories is one of the
 * unconditionally-excluded non-vehicle categories (tools/cables/
 * accessories/tuning-tool-brand categories); `true` otherwise. Runs
 * independent of, and prior to, `isInScopeVehicle`.
 */
export function filterInScopeCategories(categories: string[]): boolean {
  return !categories.some((c) => EXCLUDED_CATEGORY_NAMES.has(normalizeCategoryName(c)));
}
