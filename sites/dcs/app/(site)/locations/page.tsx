/**
 * `/locations` — the areas-covered index, ported to the r9 design.
 * See `components/locations/locations-list-page.tsx` for the port's own
 * notes.
 *
 * TIER 3, DELIBERATELY DEMOTED (session.md D2) — entry is the footer's
 * "Areas I cover" column, never the primary nav (`components/site/
 * site-chrome-data.ts`'s `LOCATION_LINKS`).
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { SiteLocationsListPage } from '@/components/locations/locations-list-page';
import { getLocations } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

// Title and description are the prototype's own <title>/<meta
// name="description"> (`prototype/locations-list.html:5-6`) — real, settled
// copy, not authored here.
const PAGE_TITLE = `Areas I cover — ${siteConfig.business.name}`;
const PAGE_DESCRIPTION =
  'Eight East Sussex towns with their own page, and the rest of the UK run remotely. The build, the price and the timescale are the same wherever you are.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ['locations', 'service areas', 'web design', ...siteConfig.serviceAreas],
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: '/locations',
    type: 'website',
  },
  alternates: {
    canonical: absUrl('/locations'),
  },
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <SiteLocationsListPage locations={locations} studioTown={siteConfig.business.address.city} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/locations#collection'),
          url: absUrl('/locations'),
          name: `${siteConfig.business.name} Service Areas`,
          description: PAGE_DESCRIPTION,
        }}
      />
    </>
  );
}
