import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { siteConfig } from '@/site.config';

/**
 * Sitemap Index — lists all section sitemaps.
 *
 * Submit this URL to Google Search Console: /sitemap-index.xml
 *
 * Section sitemaps:
 * - /sitemap.xml          (static pages)
 * - /services/sitemap.xml
 * - /locations/sitemap.xml
 * - /blog/sitemap.xml
 * - /projects/sitemap.xml
 * - /car-remaps/sitemap.xml
 */

const SITEMAP_PATHS = [
  '/sitemap.xml',
  '/services/sitemap.xml',
  '/locations/sitemap.xml',
  '/blog/sitemap.xml',
  '/projects/sitemap.xml',
  '/car-remaps/sitemap.xml',
];

async function discoverSitemaps(): Promise<string[]> {
  const sitemaps = new Set(SITEMAP_PATHS);

  // In development, scan filesystem for any additional sitemap.ts files
  if (process.env.NODE_ENV === 'development') {
    try {
      const appDir = path.join(process.cwd(), 'app');
      const entries = fs.readdirSync(appDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const sitemapPath = path.join(appDir, entry.name, 'sitemap.ts');
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
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

export async function GET() {
  const BASE_URL = siteConfig.url;
  const sitemapPaths = await discoverSitemaps();
  const sitemapUrls = sitemapPaths.map((p) => `${BASE_URL}${p}`);

  const xml = buildSitemapIndex(sitemapUrls);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
