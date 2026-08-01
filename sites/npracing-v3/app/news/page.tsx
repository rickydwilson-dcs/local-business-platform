/**
 * News route
 *
 * Thin wrapper around `components/pages/news-index-page.tsx`. That component
 * is self-fetching (loads and sorts published articles itself), so this file
 * only supplies metadata.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { NewsIndexPage } from '@/components/pages/news-index-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'News',
  description: `Race reports, team announcements, and rider news from ${siteConfig.business.name} — the ${siteConfig.racing.championship}.`,
  alternates: {
    canonical: absUrl('/news'),
  },
};

export default function NewsRoute() {
  return <NewsIndexPage />;
}
