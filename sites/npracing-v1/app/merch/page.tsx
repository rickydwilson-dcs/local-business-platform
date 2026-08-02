/**
 * Merch route
 *
 * Server Component: metadata and canonical URL only. The page body is the
 * Grid Box `MerchPage` client-free component, which renders one card per
 * content/merch/*.mdx record and links out to the retailer's own product
 * pages (NPRacing doesn't sell or fulfil anything itself).
 *
 * All 8 records are shown (available and currently-unavailable alike) —
 * `MerchPage` already renders an "Currently unavailable" badge for items
 * with `available: false` rather than hiding them.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getMerchProducts } from '@/lib/merch';
import { absUrl } from '@/lib/site';
import { MerchPage } from '@/components/pages/merch-page';

export const metadata: Metadata = {
  title: 'Merch',
  description:
    'Official NPRacing team merchandise — t-shirts, hoodies and caps in team colours, sold via The Clothing Kings.',
  openGraph: {
    title: `Merch | ${siteConfig.name}`,
    description:
      'Official NPRacing team merchandise — t-shirts, hoodies and caps in team colours, sold via The Clothing Kings.',
    url: absUrl('/merch'),
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
  },
  alternates: {
    canonical: absUrl('/merch'),
  },
};

export default async function MerchPageRoute() {
  const products = await getMerchProducts();

  return (
    <MerchPage
      products={products}
      retailerName="The Clothing Kings"
      retailerUrl={siteConfig.racing.merchStoreUrl ?? 'https://www.theclothingkings.co.uk/'}
    />
  );
}
