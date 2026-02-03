/**
 * Dynamic Robots.txt
 *
 * Controls search engine crawling behavior.
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  // Check if we're in production (allow indexing) or development (block indexing)
  const isProduction =
    process.env.NODE_ENV === 'production' &&
    !baseUrl.includes('localhost') &&
    !baseUrl.includes('vercel.app');

  if (!isProduction) {
    // Block all indexing for development/preview
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Production rules
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
