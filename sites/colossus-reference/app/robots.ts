// app/robots.ts (App Router) – optional
import { baseUrl } from "@/lib/site";

export default function robots() {
  const isProd = !!process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [{ userAgent: "*", allow: isProd ? "/" : [], disallow: isProd ? [] : "/" }],
    sitemap: isProd ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
