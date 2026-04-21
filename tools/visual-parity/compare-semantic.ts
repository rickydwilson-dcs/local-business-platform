#!/usr/bin/env tsx
/**
 * CLI: run semantic DOM diff only (no pixel comparison) between baseline
 * and target capture dirs. Writes a scoped JSON report.
 *
 * For the combined gate, use parity-report.ts.
 */

import { parseArgs } from "node:util";
import * as fs from "fs";
import * as path from "path";
import { compareSuites } from "./lib/compare";

async function main() {
  const { values } = parseArgs({
    options: {
      baseline: { type: "string" },
      target: { type: "string" },
      out: { type: "string" },
    },
  });

  if (!values.baseline || !values.target) {
    console.error(
      "Usage: tsx tools/visual-parity/compare-semantic.ts --baseline <dir> --target <dir> [--out <dir>]"
    );
    process.exit(1);
  }

  const outDir = values.out ?? path.join(values.target, "..", "diffs");
  const suite = await compareSuites(values.baseline, values.target, outDir);

  const scoped = {
    generatedAt: suite.generatedAt,
    routes: suite.routes.map((r) => {
      const fails = r.semantic.filter((s) => s.verdict === "FAIL");
      return {
        path: r.path,
        pageType: r.pageType,
        findings: r.semantic,
        overallVerdict: fails.length > 0 ? "FAIL" : "PASS",
      };
    }),
  };

  const outPath = path.join(outDir, "semantic-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(scoped, null, 2));

  const fails = scoped.routes.filter((r) => r.overallVerdict === "FAIL");
  console.log(`[compare-semantic] routes: ${scoped.routes.length}, fails: ${fails.length}`);
  if (fails.length > 0) {
    for (const r of fails) {
      console.log(`  FAIL ${r.path}`);
      for (const f of r.findings.filter((x) => x.verdict === "FAIL")) {
        console.log(`    - ${f.field}: ${f.message}`);
      }
    }
    process.exit(5);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
