#!/usr/bin/env tsx
/**
 * CLI: discover routes from a production site's sitemap and write manifest.json.
 *
 * Usage:
 *   tsx tools/visual-parity/route-manifest.ts --url https://example.com --slug example --out path/to/baseline
 */

import { parseArgs } from "node:util";
import { discoverRoutesFromSitemap, writeManifest } from "./lib/manifest";

async function main() {
  const { values } = parseArgs({
    options: {
      url: { type: "string" },
      slug: { type: "string" },
      out: { type: "string" },
    },
  });

  if (!values.url || !values.slug || !values.out) {
    console.error(
      "Usage: tsx tools/visual-parity/route-manifest.ts --url <siteUrl> --slug <siteSlug> --out <dir>"
    );
    process.exit(1);
  }

  const routes = await discoverRoutesFromSitemap(values.url);
  if (routes.length === 0) {
    console.error(`[route-manifest] No routes discovered for ${values.url} — aborting.`);
    process.exit(2);
  }

  writeManifest(values.out, {
    version: 1,
    siteSlug: values.slug,
    baselineUrl: values.url,
    capturedAt: new Date().toISOString(),
    routes,
  });

  console.log(
    `[route-manifest] Discovered ${routes.length} routes. Written to ${values.out}/manifest.json`
  );
  const pageTypeCounts = routes.reduce<Record<string, number>>((acc, r) => {
    acc[r.pageType] = (acc[r.pageType] ?? 0) + 1;
    return acc;
  }, {});
  for (const [pt, n] of Object.entries(pageTypeCounts).sort()) {
    console.log(`  ${pt.padEnd(28)} ${n}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
