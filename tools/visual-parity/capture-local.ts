#!/usr/bin/env tsx
/**
 * CLI: capture the local dev server / preview build for a site.
 *
 * Usage:
 *   tsx tools/visual-parity/capture-local.ts --baseline-dir <dir> --target-dir <dir> --url http://localhost:3000
 *
 * The caller is responsible for ensuring the target URL is serving. This
 * tool does not spawn the dev server — keeps the concern of lifecycle
 * separate from capture so developers can use their own running server.
 */

import { parseArgs } from "node:util";
import { readManifest } from "./lib/manifest";
import { captureAll } from "./lib/capture";

async function main() {
  const { values } = parseArgs({
    options: {
      "baseline-dir": { type: "string" },
      "target-dir": { type: "string" },
      url: { type: "string" },
      viewports: { type: "string" },
    },
  });

  if (!values["baseline-dir"] || !values["target-dir"] || !values.url) {
    console.error(
      "Usage: tsx tools/visual-parity/capture-local.ts --baseline-dir <dir> --target-dir <dir> --url <localUrl>"
    );
    process.exit(1);
  }

  const manifest = readManifest(values["baseline-dir"]);
  const viewports = values.viewports
    ? (values.viewports.split(",") as ("desktop" | "tablet" | "mobile")[])
    : undefined;

  console.log(`[capture-local] Capturing ${manifest.routes.length} routes from ${values.url}`);
  const results = await captureAll({
    baseUrl: values.url,
    routes: manifest.routes,
    outDir: values["target-dir"],
    viewports,
  });

  const ok = results.filter((r) => !r.error).length;
  const failed = results.length - ok;
  console.log(`[capture-local] Done. ${ok}/${results.length} routes captured. ${failed} failed.`);
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
