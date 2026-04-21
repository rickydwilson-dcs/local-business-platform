#!/usr/bin/env tsx
/**
 * CLI: run visual diff only (pixel comparison) between baseline and target
 * capture dirs. Writes diff PNGs and a scoped JSON report.
 *
 * For the combined visual+semantic+preflight gate, use parity-report.ts.
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
      "diffs-out": { type: "string" },
    },
  });

  if (!values.baseline || !values.target) {
    console.error(
      "Usage: tsx tools/visual-parity/compare-visual.ts --baseline <dir> --target <dir> [--diffs-out <dir>]"
    );
    process.exit(1);
  }

  const diffsOut = values["diffs-out"] ?? path.join(values.target, "..", "diffs");
  const suite = await compareSuites(values.baseline, values.target, diffsOut);

  const scoped = {
    generatedAt: suite.generatedAt,
    suiteMeanDiff: suite.suiteMeanDiff,
    suiteMeanVerdict: suite.suiteMeanVerdict,
    routes: suite.routes.map((r) => ({
      path: r.path,
      pageType: r.pageType,
      visual: r.visual,
      overallVerdict: worstVisual(r.visual),
    })),
  };
  const outPath = path.join(diffsOut, "visual-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(scoped, null, 2));

  const fails = scoped.routes.filter((r) => r.overallVerdict === "FAIL");
  const warns = scoped.routes.filter((r) => r.overallVerdict === "WARN");
  console.log(
    `[compare-visual] suite mean ${(suite.suiteMeanDiff * 100).toFixed(2)}% (${suite.suiteMeanVerdict})`
  );
  console.log(
    `[compare-visual] routes: ${scoped.routes.length}, fails: ${fails.length}, warns: ${warns.length}`
  );
  if (fails.length > 0 || suite.suiteMeanVerdict === "FAIL") {
    process.exit(4);
  }
}

function worstVisual(findings: { verdict: string }[]) {
  if (findings.some((f) => f.verdict === "FAIL")) return "FAIL";
  if (findings.some((f) => f.verdict === "WARN")) return "WARN";
  return "PASS";
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
