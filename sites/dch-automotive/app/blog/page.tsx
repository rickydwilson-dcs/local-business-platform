/**
 * Blog Listing Page
 * =================
 *
 * Displays all blog posts.
 * Adapts to site branding via site.config.ts.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { BlogPage } from '@/components/pages/blog-page';
import { getBlogPosts } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Blog | Industry Insights & Expert Tips | ${siteConfig.business.name}`,
  description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team. Stay informed with professional advice and industry news.`,
  keywords: ['blog', 'tips', 'industry news', 'expert advice', 'guidance'],
  openGraph: {
    title: `Blog | Industry Insights & Expert Tips`,
    description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogPageRoute() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogPage
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: p.date,
          category: p.category,
          heroImage: p.heroImage,
          readingTime: p.readingTime,
          author: { name: p.author.name },
        }))}
      />

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
          description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
        }}
      />
    </>
  );
}
