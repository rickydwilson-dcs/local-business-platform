import * as XLSX from 'xlsx';
import { FUEL_PRICE_FALLBACK, type FuelPriceSnapshot } from './types';

/**
 * Fetches the current UK weekly average petrol/diesel pump price from
 * DESNZ's "Weekly road fuel prices" open data workbook.
 *
 * The dataset page is scraped (not a stable URL) because the workbook's own
 * download link is date-stamped and changes every week (e.g.
 * `weekly_road_fuel_prices_060726.xlsx`). Both the dataset page fetch and
 * the workbook fetch use Next's `revalidate` so this only actually hits
 * gov.uk roughly once a week — the DESNZ source itself only updates weekly.
 *
 * Never throws: any failure (page restructured, network error, an
 * out-of-range parsed value) falls back to `FUEL_PRICE_FALLBACK` so the
 * Savings Calculator always has a usable price.
 */
export async function fetchLatestFuelPrices(): Promise<FuelPriceSnapshot> {
  try {
    return await fetchAndParse();
  } catch (error) {
    console.error('[fuel-prices] Falling back to hardcoded snapshot:', error);
    return FUEL_PRICE_FALLBACK;
  }
}

const DATASET_PAGE_URL =
  'https://www.data.gov.uk/dataset/21db6396-3daf-4d90-8b3f-054995256018/petrol-and-diesel-prices';
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7; // 7 days — matches the source's own weekly cadence
const MIN_PLAUSIBLE_PENCE = 80;
const MAX_PLAUSIBLE_PENCE = 300;

async function fetchAndParse(): Promise<FuelPriceSnapshot> {
  const datasetPageResponse = await fetch(DATASET_PAGE_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!datasetPageResponse.ok) {
    throw new Error(`Dataset page fetch failed: ${datasetPageResponse.status}`);
  }
  const datasetPageHtml = await datasetPageResponse.text();

  const xlsxUrlMatch = datasetPageHtml.match(
    /https:\/\/assets\.publishing\.service\.gov\.uk\/media\/[^"]+\.xlsx/
  );
  if (!xlsxUrlMatch) {
    throw new Error('Could not find a .xlsx download link on the dataset page');
  }
  const xlsxUrl = xlsxUrlMatch[0];

  const workbookResponse = await fetch(xlsxUrl, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!workbookResponse.ok) {
    throw new Error(`Workbook fetch failed: ${workbookResponse.status}`);
  }
  const workbookBuffer = await workbookResponse.arrayBuffer();

  const workbook = XLSX.read(workbookBuffer, { type: 'array' });
  const dataSheet = workbook.Sheets['Data'];
  if (!dataSheet) {
    throw new Error('Workbook has no "Data" sheet');
  }

  const rows: unknown[][] = XLSX.utils.sheet_to_json(dataSheet, { header: 1, raw: true });

  const headerRowIndex = rows.findIndex((row) => row[0] === 'Date');
  if (headerRowIndex === -1) {
    throw new Error('Could not find the header row (no row starting with "Date")');
  }
  const headerRow = rows[headerRowIndex];

  const petrolColumn = headerRow.findIndex(
    (cell) => typeof cell === 'string' && cell.includes('ULSP') && cell.includes('Pump price')
  );
  const dieselColumn = headerRow.findIndex(
    (cell) => typeof cell === 'string' && cell.includes('ULSD') && cell.includes('Pump price')
  );
  if (petrolColumn === -1 || dieselColumn === -1) {
    throw new Error('Could not find ULSP/ULSD pump price columns in the header row');
  }

  const dataRows = rows
    .slice(headerRowIndex + 1)
    .filter(
      (row) =>
        typeof row[0] === 'number' &&
        typeof row[petrolColumn] === 'number' &&
        typeof row[dieselColumn] === 'number'
    );
  const latestRow = dataRows.at(-1);
  if (!latestRow) {
    throw new Error('No data rows with valid date/petrol/diesel values found');
  }

  const petrolPencePerLitre = latestRow[petrolColumn] as number;
  const dieselPencePerLitre = latestRow[dieselColumn] as number;
  if (
    !isPlausiblePencePerLitre(petrolPencePerLitre) ||
    !isPlausiblePencePerLitre(dieselPencePerLitre)
  ) {
    throw new Error(
      `Parsed values out of plausible range: petrol=${petrolPencePerLitre}, diesel=${dieselPencePerLitre}`
    );
  }

  const dateCode = XLSX.SSF.parse_date_code(latestRow[0] as number);
  const weekEnding = `${dateCode.y}-${String(dateCode.m).padStart(2, '0')}-${String(dateCode.d).padStart(2, '0')}`;

  return {
    weekEnding,
    petrolPencePerLitre,
    dieselPencePerLitre,
    sourceUrl: DATASET_PAGE_URL,
  };
}

function isPlausiblePencePerLitre(value: number): boolean {
  return value >= MIN_PLAUSIBLE_PENCE && value <= MAX_PLAUSIBLE_PENCE;
}
