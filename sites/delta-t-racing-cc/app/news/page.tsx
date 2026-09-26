/**
 * News Index route
 * ================
 *
 * Lists all published articles from content/news/*.mdx.
 *
 * The route's job is data plumbing and metadata only; presentation is the Grid
 * Box `NewsIndexPage` component (Phase 5), which replaced the placeholder
 * markup this file previously carried.
 */
import type { Metadata } from 'next';
import { getAllNewsArticles } from '@/lib/news';
import { absUrl } from '@/lib/site';
import { NewsIndexPage } from '@/components/pages/news-index-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'News',
  description:
    'Race reports and team news from Delta T Racing in the 2026 Bemsee (BMCRC) championship.',
  alternates: {
    canonical: absUrl('/news'),
  },
};

export default async function NewsIndexRoute() {
  const articles = await getAllNewsArticles();

  return <NewsIndexPage articles={articles} />;
}
