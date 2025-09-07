// app/robots.ts (App Router) – optional
export default function robots() {
  const isProd = !!process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [
      { userAgent: "*", allow: isProd ? "/" : [], disallow: isProd ? [] : "/" },
    ],
    sitemap: isProd ? "https://www.colossus-scaffolding.co.uk/sitemap.xml" : undefined,
  };
}
