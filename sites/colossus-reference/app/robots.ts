// app/robots.ts (App Router) – optional
import { baseUrl } from "@/lib/site";

export default function robots() {
  // Multiple checks for production environment to prevent accidental blocking
  // 1. VERCEL_ENV is set to "production" on Vercel production deployments
  // 2. Fallback: NODE_ENV is production AND NEXT_PUBLIC_SITE_URL is configured
  const isProd =
    process.env.VERCEL_ENV === "production" ||
    (process.env.NODE_ENV === "production" && !!process.env.NEXT_PUBLIC_SITE_URL);

  return {
    rules: [{ userAgent: "*", allow: isProd ? "/" : [], disallow: isProd ? [] : "/" }],
    // Point to sitemap index which lists all section sitemaps
    sitemap: isProd ? `${baseUrl}/sitemap-index.xml` : undefined,
  };
}
