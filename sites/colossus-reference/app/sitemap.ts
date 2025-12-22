import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

/**
 * Main sitemap for core/static pages.
 *
 * This sitemap only includes top-level static pages.
 * Each section (services, locations, blog, products, etc.) has its own sitemap:
 * - /services/sitemap.xml
 * - /locations/sitemap.xml
 * - /blog/sitemap.xml (future)
 * - /products/sitemap.xml (future)
 *
 * This modular architecture ensures:
 * 1. Each section's sitemap stays under Google's 50,000 URL limit
 * 2. Easy to add new sections without modifying this file
 * 3. Better organization for search engine crawlers
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Core static pages only - sections have their own sitemaps
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return staticPages;
}
