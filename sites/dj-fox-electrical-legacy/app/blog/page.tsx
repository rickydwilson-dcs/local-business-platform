/**
 * Blog Listing Page — thin wrapper around OrionBlogPage
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { getBlogPosts } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';
import { OrionBlogPage } from '@platform/themes/orion/pages';

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

const siteSummary: SiteConfigSummary = {
  name: siteConfig.business.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.business.phone,
  phoneDisplay: PHONE_DISPLAY,
  address: { city: siteConfig.business.address.city },
  cta: siteConfig.cta,
  stats: siteConfig.credentials?.stats,
};

export default async function BlogPageWrapper() {
  const posts = await getBlogPosts();

  const postSummaries = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    category: p.category,
    heroImage: p.heroImage,
    readingTime: p.readingTime,
    author: p.author ? { name: p.author.name } : undefined,
    featured: p.featured,
  }));

  return (
    <>
      <OrionBlogPage siteConfig={siteSummary} posts={postSummaries} />

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
