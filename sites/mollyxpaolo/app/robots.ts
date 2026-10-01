import type { MetadataRoute } from 'next';

/** A private gallery: nothing is crawlable, on any deployment. No sitemap. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
