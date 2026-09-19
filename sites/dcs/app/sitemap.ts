/**
 * Core Sitemap — static pages only.
 *
 * Section-specific sitemaps handle dynamic content:
 * - /services/sitemap.xml
 * - /locations/sitemap.xml
 * - /blog/sitemap.xml
 * - /projects/sitemap.xml
 *
 * Submit /sitemap-index.xml to Google Search Console.
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { TOPIC_ORDER } from '@/lib/blog-topics';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // (The `/reviews` entry that sat here was removed on 2026-09-18 along with
  // the route itself — decision D3, inner-pages port Phase 1. Its three
  // testimonials live on /projects and in the case studies instead. Do not
  // restore it: uncommenting an entry for a route that no longer resolves
  // would publish a 404 in the sitemap.)

  // Phase 5 (2026-09-18) of the inner-pages port opted 8 more static routes
  // (below, plus the 7 /blog/category/[slug] entries further down) into
  // indexing per-page (`app/(site)/*/page.tsx`'s `robots` export) — each
  // entry below moves together with that page-level opt-in, per PRODUCT.md's
  // "a noindex page listed in a sitemap is a Search Console warning" rule.
  // /services and /locations are list pages whose own detail slugs are
  // covered by their section sitemaps (`/services/sitemap.xml` etc.), listed
  // in `sitemap-index.xml` alongside /blog and /projects.
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // /blog/category/[slug] — the 7 topic pages have no dedicated section
    // sitemap file (unlike /services, /locations, /blog and /projects, each
    // of which generates its own from `listSlugs`). The category set is a
    // fixed, code-defined list (`lib/blog-topics.ts`'s `TOPIC_ORDER`), not
    // content-driven, so it's enumerated here rather than in a new
    // `blog/category/sitemap.ts`. Priority sits below the blog index (0.8)
    // and above individual posts (0.6) as a derivative listing view.
    ...TOPIC_ORDER.map((slug) => ({
      url: `${baseUrl}/blog/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
