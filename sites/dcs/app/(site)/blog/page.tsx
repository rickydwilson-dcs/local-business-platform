/**
 * `/blog` — the library index, ported to the r9 design.
 * See `components/blog/blog-list-page.tsx` for the port's own notes.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { BlogListPage } from '@/components/blog/blog-list-page';
import { getBlogPosts } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Blog | Insights for Tradespeople | ${siteConfig.business.name}`,
  description:
    'Twenty-one plain-English guides on getting a small business found online — local search, what a site costs, what to put on it, and how to make it fast.',
  keywords: ['blog', 'web design tips', 'local SEO', 'tradespeople', 'digital marketing'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Blog | Insights for Tradespeople',
    description: 'Plain-English guides on getting a small business found online.',
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogListPage posts={posts} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
        webpage={{
          '@type': 'Blog',
          '@id': absUrl('/blog#blog'),
          url: absUrl('/blog'),
          name: `${siteConfig.business.name} Blog`,
          description: `${posts.length} guides on websites, local SEO, and getting found online.`,
        }}
      />
    </>
  );
}
