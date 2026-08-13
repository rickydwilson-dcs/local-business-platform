/**
 * Sponsors route
 *
 * Server Component: metadata and canonical URL only. The page body is the
 * spotlight-list `SponsorsPage` component, which renders one section per
 * content/sponsors/*.mdx record.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getSponsors } from '@/lib/sponsors';
import { absUrl } from '@/lib/site';
import { SponsorsPage } from '@/components/pages/sponsors-page';

export const metadata: Metadata = {
  title: 'Sponsors',
  description:
    'Meet the sponsors and partners behind NP Racing — the businesses supporting the team on and off the track.',
  openGraph: {
    title: `Sponsors | ${siteConfig.name}`,
    description:
      'Meet the sponsors and partners behind NP Racing — the businesses supporting the team on and off the track.',
    url: absUrl('/sponsors'),
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
  },
  alternates: {
    canonical: absUrl('/sponsors'),
  },
};

export default async function SponsorsPageRoute() {
  const sponsors = await getSponsors();

  return <SponsorsPage sponsors={sponsors} />;
}
