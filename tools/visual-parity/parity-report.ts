#!/usr/bin/env tsx
/**
 * Main CLI gate. Runs compareSuites across a baseline + target capture pair,
 * aggregates visual + semantic + route-coverage findings, writes a Markdown
 * parity-report.md, and exits non-zero on any FAIL.
 *
 * Usage:
 *   tsx tools/visual-parity/parity-report.ts \
 *     --baseline sites/colossus-scaffolding/tests/visual-baseline/production \
 *     --target   sites/colossus-scaffolding/tests/visual-baseline/target \
 *     --out      sites/colossus-scaffolding/tests/visual-baseline/diffs \
 *     [--page home,services,locations]
 */

import { parseArgs } from "node:util";
import * as fs from "fs";
import * as path from "path";
import { compareSuites, type SuiteReport, type RouteReport } from "./lib/compare";
import { VIEWPORTS, thresholdFor, SUITE_MEAN_THRESHOLD, WARN_THRESHOLD } from "./lib/thresholds";

async function main() {
  const { values } = parseArgs({
    options: {
      baseline: { type: "string" },
      target: { type: "string" },
      out: { type: "string" },
      page: { type: "string" },
    },
  });

  if (!values.baseline || !values.target) {
    console.error(
      "Usage: tsx tools/visual-parity/parity-report.ts --baseline <dir> --target <dir> [--out <dir>] [--page <pageType,...>]"
    );
    process.exit(1);
  }

  const outDir = values.out ?? path.join(values.target, "..", "diffs");
  fs.mkdirSync(outDir, { recursive: true });

  let suite = await compareSuites(values.baseline, values.target, outDir);

  if (values.page) {
    const selected = new Set(values.page.split(",").map((s) => s.trim()));
    suite = { ...suite, routes: suite.routes.filter((r) => selected.has(r.pageType)) };
  }

  const markdown = renderMarkdown(suite);
  const mdPath = path.join(outDir, "parity-report.md");
  fs.writeFileSync(mdPath, markdown);
  const jsonPath = path.join(outDir, "parity-report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(suite, null, 2));

  console.log(`[parity-report] Written ${mdPath}`);
  console.log(
    `[parity-report] Suite counts: ${suite.counts.pass} pass / ${suite.counts.warn} warn / ${suite.counts.fail} fail`
  );
  console.log(
    `[parity-report] Suite mean diff: ${(suite.suiteMeanDiff * 100).toFixed(2)}% (${suite.suiteMeanVerdict})`
  );

  if (suite.counts.fail > 0 || suite.suiteMeanVerdict === "FAIL") {
    process.exit(7);
  }
}

function renderMarkdown(suite: SuiteReport): string {
  const lines: string[] = [];
  lines.push(`# Visual Parity Report`);
  lines.push(``);
  lines.push(`- Generated: \`${suite.generatedAt}\``);
  lines.push(`- Baseline: \`${suite.baselineDir}\``);
  lines.push(`- Target: \`${suite.targetDir}\``);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Metric | Value |`);
  lines.push(`|---|---|`);
  lines.push(`| Total routes | ${suite.routes.length} |`);
  lines.push(`| PASS | ${suite.counts.pass} |`);
  lines.push(`| WARN | ${suite.counts.warn} |`);
  lines.push(`| FAIL | ${suite.counts.fail} |`);
  lines.push(`| Suite mean diff | ${(suite.suiteMeanDiff * 100).toFixed(2)}% |`);
  lines.push(`| Suite mean verdict | ${suite.suiteMeanVerdict} |`);
  lines.push(`| Suite mean threshold | ${(SUITE_MEAN_THRESHOLD * 100).toFixed(2)}% |`);
  lines.push(`| Warn band | ≥ ${(WARN_THRESHOLD * 100).toFixed(2)}% |`);
  lines.push(``);
  lines.push(`## Viewports captured`);
  lines.push(``);
  lines.push(`| Viewport | Size |`);
  lines.push(`|---|---|`);
  for (const [name, dims] of Object.entries(VIEWPORTS)) {
    lines.push(`| ${name} | ${dims.width}×${dims.height} |`);
  }
  lines.push(``);

  const failed = suite.routes.filter((r) => r.overallVerdict === "FAIL");
  if (failed.length > 0) {
    lines.push(`## FAIL (${failed.length})`);
    lines.push(``);
    for (const r of failed) lines.push(...renderRouteBlock(r));
  }

  const warned = suite.routes.filter((r) => r.overallVerdict === "WARN");
  if (warned.length > 0) {
    lines.push(`## WARN (${warned.length})`);
    lines.push(``);
    for (const r of warned) lines.push(...renderRouteBlock(r));
  }

  const passed = suite.routes.filter((r) => r.overallVerdict === "PASS");
  lines.push(`## PASS (${passed.length})`);
  lines.push(``);
  lines.push(`| Page | Path | Max diff |`);
  lines.push(`|---|---|---|`);
  for (const r of passed) {
    const maxDiff = Math.max(0, ...r.visual.map((v) => v.diffPercent));
    lines.push(`| ${r.pageType} | \`${r.path}\` | ${(maxDiff * 100).toFixed(2)}% |`);
  }
  return lines.join("\n");
}

function renderRouteBlock(r: RouteReport): string[] {
  const lines: string[] = [];
  lines.push(`### ${r.pageType} — \`${r.path}\``);
  lines.push(``);
  lines.push(`Threshold: ${(thresholdFor(r.pageType) * 100).toFixed(2)}%`);
  lines.push(``);
  if (r.visual.length > 0) {
    lines.push(`| Viewport | Diff | Verdict | Diff image |`);
    lines.push(`|---|---|---|---|`);
    for (const v of r.visual) {
      const img = v.diffImagePath ? `\`${v.diffImagePath}\`` : v.reason ? v.reason : "—";
      lines.push(
        `| ${v.viewport} | ${(v.diffPercent * 100).toFixed(2)}% | ${v.verdict} | ${img} |`
      );
    }
    lines.push(``);
  }
  const semFails = r.semantic.filter((s) => s.verdict === "FAIL");
  if (semFails.length > 0) {
    lines.push(`**Semantic failures:**`);
    lines.push(``);
    for (const f of semFails) lines.push(`- **${f.field}** — ${f.message}`);
    lines.push(``);
  }
  return lines;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
