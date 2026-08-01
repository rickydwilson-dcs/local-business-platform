/**
 * Merchandise route
 *
 * Thin wrapper around `components/pages/merch-page.tsx`. Created here (rather
 * than left to the routes phase) because the header and footer both link to
 * `/merch` — without it the primary nav and the homepage merch CTA would 404.
 * Sitemap wiring and richer metadata are still the routes phase's job.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { MerchPage } from '@/components/pages/merch-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Merchandise | ${siteConfig.business.name}`,
  description: `Official ${siteConfig.business.name} team kit — tees, caps, hoodies and more, printed to order and fulfilled by The Clothing Kings.`,
  alternates: {
    canonical: absUrl('/merch'),
  },
};

export default function MerchRoute() {
  return <MerchPage />;
}
