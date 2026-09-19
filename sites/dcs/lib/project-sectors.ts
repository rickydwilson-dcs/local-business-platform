/**
 * The five-sector taxonomy used by `/projects` (the portfolio list) and
 * `/projects/[slug]` (case studies).
 *
 * SOURCE: `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/
 * prototype/projects-list.html` — the sectors, their order, their filter-bar
 * labels and the `data-sector` value assigned to each of the 13
 * `content/projects/*.mdx` files are all read directly off that approved,
 * already-signed-off HTML (lines 132-441). Nothing here is invented: no
 * `sector` field exists in `ProjectFrontmatterSchema`
 * (`packages/core-components/src/lib/content-schemas.ts`), so this file is
 * the single place that records the design's own assignment, the same
 * pattern the Phase 3 brief prescribes for `lib/blog-sectors.ts` — except
 * this mapping is copied verbatim from an approved design rather than
 * derived from post text, so it does not carry that file's "provisional,
 * pending confirmation" caveat.
 */

export const SECTOR_KEYS = ['retail', 'trades', 'studios', 'property', 'creative'] as const;

export type SectorKey = (typeof SECTOR_KEYS)[number];

/** The filter bar's own labels, in the filter bar's own order (`all` first). */
export const SECTOR_LABELS: Record<SectorKey, string> = {
  retail: 'Retail & eCommerce',
  trades: 'Trades & Contractors',
  studios: 'Studios & Practitioners',
  property: 'Professional & Property',
  creative: 'Creative & B2B',
};

/**
 * The natural-language plural used in the "More like this" lead sentence on
 * a case study page (`project-detail.html:261`: "…are trades and
 * contractors — the other seven are retail, studios, property and
 * creative."). Authored by hand rather than derived from `SECTOR_LABELS`
 * because a mechanical lowercase of "Retail & eCommerce" loses the
 * mid-word capital in "eCommerce".
 */
export const SECTOR_PLURAL_LABEL: Record<SectorKey, string> = {
  retail: 'retail and eCommerce',
  trades: 'trades and contractors',
  studios: 'studios and practitioners',
  property: 'professional and property',
  creative: 'creative and B2B',
};

/** `content/projects/*.mdx` slug -> sector, read off every `data-sector="…"`
 *  attribute in `prototype/projects-list.html`'s 13 `.card` elements. */
export const PROJECT_SECTOR: Record<string, SectorKey> = {
  'the-clothing-kings': 'retail',
  'sanctuary-ida': 'studios',
  'colossus-scaffolding': 'trades',
  'cuddle-plush-fabrics': 'retail',
  'dj-fox-electrical': 'trades',
  'mad-graphics': 'creative',
  'nicola-noble-tuition': 'studios',
  'wordpress-to-platform-rebuild': 'trades',
  'silvero-homes': 'property',
  'dch-automotive': 'trades',
  'luna-landings': 'retail',
  'bexhill-removals': 'trades',
  'new-website-from-scratch': 'trades',
};

/** Small English number words, only as far as this 13-item portfolio needs —
 *  used to reproduce the prototype's "Six of the thirteen…" phrasing on
 *  every case study page rather than falling back to digits. */
const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
] as const;

export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function capitalise(word: string): string {
  return word.length === 0 ? word : word[0].toUpperCase() + word.slice(1);
}
