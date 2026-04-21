#!/usr/bin/env tsx
/**
 * CLI: capture the production baseline for a site.
 *
 * Usage:
 *   tsx tools/visual-parity/capture-production.ts --baseline-dir <dir>
 *   tsx tools/visual-parity/capture-production.ts --baseline-dir <dir> --url <override-url>
 *
 * The baseline dir must already contain manifest.json (run route-manifest.ts first).
 */

import { parseArgs } from "node:util";
import * as path from "path";
import { readManifest } from "./lib/manifest";
import { captureAll } from "./lib/capture";

async function main() {
  const { values } = parseArgs({
    options: {
      "baseline-dir": { type: "string" },
      url: { type: "string" },
      viewports: { type: "string" },
    },
  });

  if (!values["baseline-dir"]) {
    console.error(
      "Usage: tsx tools/visual-parity/capture-production.ts --baseline-dir <dir> [--url <override>]"
    );
    process.exit(1);
  }

  const baselineDir = values["baseline-dir"];
  const manifest = readManifest(baselineDir);
  const baseUrl = values.url ?? manifest.baselineUrl;

  const viewports = values.viewports
    ? (values.viewports.split(",") as ("desktop" | "tablet" | "mobile")[])
    : undefined;

  console.log(`[capture-production] Capturing ${manifest.routes.length} routes from ${baseUrl}`);
  const outDir = path.join(baselineDir, "production");
  const results = await captureAll({
    baseUrl,
    routes: manifest.routes,
    outDir,
    viewports,
  });

  const ok = results.filter((r) => !r.error).length;
  const failed = results.length - ok;
  console.log(
    `[capture-production] Done. ${ok}/${results.length} routes captured. ${failed} failed.`
  );
  if (failed > 0) {
    for (const r of results.filter((x) => x.error)) {
      console.error(`  FAILED ${r.path}: ${r.error}`);
    }
    process.exit(3);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
