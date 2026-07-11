/**
 * Types for the UK weekly average fuel price snapshot (`fetch.ts`), sourced
 * from DESNZ's "Weekly road fuel prices" open data (data.gov.uk, OGL v3.0).
 */

export interface FuelPriceSnapshot {
  /** ISO date (YYYY-MM-DD) of the week this average covers. */
  weekEnding: string;
  petrolPencePerLitre: number;
  dieselPencePerLitre: number;
  sourceUrl: string;
}

/**
 * Hand-updated fallback used whenever the live fetch/parse fails (source
 * page restructured, network error, out-of-range value), so the Savings
 * Calculator never breaks even if gov.uk changes their page format.
 *
 * Confirmed against the real DESNZ "Weekly road fuel prices" workbook
 * (Data sheet, week ending 2026-07-06) during implementation — see
 * `docs/car-remaps-runbook.md` for the verification notes.
 */
export const FUEL_PRICE_FALLBACK: FuelPriceSnapshot = {
  weekEnding: '2026-07-06',
  petrolPencePerLitre: 149.8,
  dieselPencePerLitre: 164.77,
  sourceUrl:
    'https://www.data.gov.uk/dataset/21db6396-3daf-4d90-8b3f-054995256018/petrol-and-diesel-prices',
};
