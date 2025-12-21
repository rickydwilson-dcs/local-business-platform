import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

/**
 * Sitemap Index - Automatically discovers and lists all sitemaps
 *
 * This route handler creates a sitemap index that references all
 * section-specific sitemaps. It auto-discovers sitemaps by scanning
 * the app directory for sitemap.ts files.
 *
 * Sitemaps are organized by section:
 * - /sitemap.xml (core pages)
 * - /services/sitemap.xml
 * - /locations/sitemap.xml
 * - /blog/sitemap.xml (when added)
 * - /products/sitemap.xml (when added)
 *
 * Submit this URL to Google Search Console: /sitemap-index.xml
 */

// Known sitemap paths - automatically detected at build time
// Add new section sitemaps here as they're created
const SITEMAP_PATHS = ["/sitemap.xml", "/services/sitemap.xml", "/locations/sitemap.xml"];

// Dynamically discover additional sitemaps from the app directory
async function discoverSitemaps(): Promise<string[]> {
  const sitemaps = new Set(SITEMAP_PATHS);

  // In production, we rely on the static list above
  // In development, we can scan the filesystem for sitemap.ts files
  if (process.env.NODE_ENV === "development") {
    try {
      const appDir = path.join(process.cwd(), "app");
      const entries = fs.readdirSync(appDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const sitemapPath = path.join(appDir, entry.name, "sitemap.ts");
          if (fs.existsSync(sitemapPath)) {
            sitemaps.add(`/${entry.name}/sitemap.xml`);
          }
        }
      }
    } catch {
      // Filesystem scan failed, use static list
    }
  }

  return Array.from(sitemaps);
}

function buildSitemapIndex(sitemapUrls: string[]): string {
  const lastmod = new Date().toISOString();

  const sitemapEntries = sitemapUrls
    .map(
      (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

export async function GET() {
  const sitemapPaths = await discoverSitemaps();
  const sitemapUrls = sitemapPaths.map((p) => `${BASE_URL}${p}`);

  const xml = buildSitemapIndex(sitemapUrls);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
