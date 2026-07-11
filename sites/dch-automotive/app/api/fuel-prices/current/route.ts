import { fetchLatestFuelPrices } from '@/lib/fuel-prices/fetch';

// Deliberately no `dynamic = 'force-dynamic'` — freshness comes from the
// `revalidate` window on the underlying fetches in `fetchLatestFuelPrices()`,
// not from route-level dynamic rendering. Same caching philosophy as
// `app/api/car-remaps/lookup/route.ts`.
export const runtime = 'nodejs';

export async function GET() {
  const snapshot = await fetchLatestFuelPrices();
  return Response.json(snapshot);
}
