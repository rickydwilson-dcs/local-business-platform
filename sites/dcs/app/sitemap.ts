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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Phase 8 (2026-08-23): the 14 inner routes are `noindex` until they ship,
  // so they come out of the sitemap too — a noindex page listed in a sitemap
  // is a Search Console warning. Uncomment to restore once a section is
  // ready to be indexed again. See Phase 8 of
  // output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/yolo-brief.md.
  // {
  //   url: `${baseUrl}/services`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly",
  //   priority: 0.9,
  // },
  // {
  //   url: `${baseUrl}/locations`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly",
  //   priority: 0.9,
  // },
  // {
  //   url: `${baseUrl}/about`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly",
  //   priority: 0.8,
  // },
  // {
  //   url: `${baseUrl}/contact`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly",
  //   priority: 0.8,
  // },
  // {
  //   url: `${baseUrl}/reviews`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.7,
  // },
  // {
  //   url: `${baseUrl}/privacy-policy`,
  //   lastModified: new Date(),
  //   changeFrequency: "yearly",
  //   priority: 0.3,
  // },
  // {
  //   url: `${baseUrl}/cookie-policy`,
  //   lastModified: new Date(),
  //   changeFrequency: "yearly",
  //   priority: 0.3,
  // },

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
