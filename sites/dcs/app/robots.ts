/**
 * Dynamic Robots.txt
 *
 * Controls search engine crawling behavior.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  // VERCEL_ENV === 'production' on Vercel production deployments;
  // fallback for self-hosted: NODE_ENV production + NEXT_PUBLIC_SITE_URL set
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (process.env.NODE_ENV === "production" && !!process.env.NEXT_PUBLIC_SITE_URL);

  if (!isProduction) {
    // Block all indexing for development/preview
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Production rules
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap-index.xml`,
  };
}
