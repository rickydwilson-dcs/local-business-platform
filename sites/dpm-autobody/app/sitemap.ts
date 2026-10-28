/**
 * Core sitemap — the static routes plus one entry per built `/builds/[slug]` page.
 *
 * Build pages come from the same `getBuilds()` + `pageStatus === 'built'` filter that
 * `app/builds/[slug]/page.tsx` uses for `generateStaticParams`, so the sitemap can never list a
 * page that 404s, and a new build appears here the moment it is flipped to `built`.
 *
 * Submit /sitemap-index.xml to Google Search Console.
 */

import type { MetadataRoute } from 'next';
import { getBuilds } from '@/lib/content';
import { siteConfig } from '@/site.config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const builds = await getBuilds();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/workshop`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...builds
      .filter((build) => build.pageStatus === 'built')
      .map((build) => ({
        url: `${baseUrl}/builds/${build.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    {
      url: `${baseUrl}/contact`,
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
  ];
}
