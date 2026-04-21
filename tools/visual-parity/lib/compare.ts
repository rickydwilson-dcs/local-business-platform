/**
 * Visual + semantic comparison between a baseline capture dir and a target
 * capture dir, both produced by `capture.ts`.
 *
 * Produces per-route verdicts and writes diff PNGs for every visual FAIL/WARN.
 */

import * as fs from "fs";
import * as path from "path";

import { compareImages } from "../../lib/pipeline-visual-compare";
import {
  VIEWPORTS,
  type Viewport,
  type Verdict,
  verdictFor,
  SEMANTIC_TOLERANCES,
  SUITE_MEAN_THRESHOLD,
} from "./thresholds";
import type { DomSnapshot, RouteCaptureResult } from "./capture";

export interface VisualFinding {
  viewport: Viewport;
  diffPercent: number;
  verdict: Verdict;
  diffImagePath: string | null;
  reason?: string;
}

export interface SemanticFinding {
  field: string;
  verdict: "PASS" | "FAIL";
  message: string;
  baselineValue?: unknown;
  targetValue?: unknown;
}

export interface RouteReport {
  path: string;
  pageType: string;
  slug: string;
  overallVerdict: Verdict;
  visual: VisualFinding[];
  semantic: SemanticFinding[];
  missing: { baseline: Viewport[]; target: Viewport[] };
}

export interface SuiteReport {
  baselineDir: string;
  targetDir: string;
  generatedAt: string;
  routes: RouteReport[];
  suiteMeanDiff: number;
  suiteMeanVerdict: Verdict;
  counts: { pass: number; warn: number; fail: number };
}

const VIEWPORT_ORDER: Viewport[] = ["desktop", "tablet", "mobile"];

export async function compareSuites(
  baselineDir: string,
  targetDir: string,
  diffOutDir: string
): Promise<SuiteReport> {
  fs.mkdirSync(diffOutDir, { recursive: true });

  const baselineIndex = readIndex(baselineDir);
  const targetIndex = readIndex(targetDir);
  const baselineMap = new Map(baselineIndex.map((r) => [r.path, r]));
  const targetMap = new Map(targetIndex.map((r) => [r.path, r]));

  const routes: RouteReport[] = [];
  const diffs: number[] = [];

  for (const [routePath, baselineResult] of baselineMap) {
    const targetResult = targetMap.get(routePath);
    const report: RouteReport = {
      path: routePath,
      pageType: baselineResult.pageType,
      slug: baselineResult.slug,
      overallVerdict: "PASS",
      visual: [],
      semantic: [],
      missing: { baseline: [], target: [] },
    };

    if (!targetResult) {
      report.overallVerdict = "FAIL";
      report.semantic.push({
        field: "route",
        verdict: "FAIL",
        message: `Route present in baseline but missing in target: ${routePath}`,
      });
      routes.push(report);
      continue;
    }

    for (const viewport of VIEWPORT_ORDER) {
      const baselinePng = baselineResult.screenshots[viewport];
      const targetPng = targetResult.screenshots[viewport];
      if (!baselinePng) {
        report.missing.baseline.push(viewport);
        report.visual.push({
          viewport,
          diffPercent: 1,
          verdict: "FAIL",
          diffImagePath: null,
          reason: "missing baseline screenshot",
        });
        continue;
      }
      if (!targetPng) {
        report.missing.target.push(viewport);
        report.visual.push({
          viewport,
          diffPercent: 1,
          verdict: "FAIL",
          diffImagePath: null,
          reason: "missing target screenshot",
        });
        continue;
      }
      const diffImagePath = path.join(
        diffOutDir,
        `${baselineResult.pageType}--${baselineResult.slug}`,
        `${viewport}.png`
      );
      try {
        const targetBuffer = fs.readFileSync(targetPng);
        const { diffPercent } = await compareImages(baselinePng, targetBuffer, diffImagePath);
        diffs.push(diffPercent);
        const verdict = verdictFor(diffPercent, baselineResult.pageType);
        report.visual.push({
          viewport,
          diffPercent,
          verdict,
          diffImagePath: verdict === "PASS" ? null : diffImagePath,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        report.visual.push({
          viewport,
          diffPercent: 1,
          verdict: "FAIL",
          diffImagePath: null,
          reason: `diff failed: ${message}`,
        });
      }
    }

    const baselineDom = readDomSnapshot(baselineDir, baselineResult);
    const targetDom = readDomSnapshot(targetDir, targetResult);
    if (baselineDom && targetDom) {
      report.semantic = compareSemantic(baselineDom, targetDom);
    } else {
      report.semantic.push({ field: "dom.json", verdict: "FAIL", message: "missing DOM snapshot" });
    }

    report.overallVerdict = rollupVerdict(report);
    routes.push(report);
  }

  for (const [routePath, targetResult] of targetMap) {
    if (baselineMap.has(routePath)) continue;
    routes.push({
      path: routePath,
      pageType: targetResult.pageType,
      slug: targetResult.slug,
      overallVerdict: "WARN",
      visual: [],
      semantic: [
        {
          field: "route",
          verdict: "PASS",
          message: `Route present in target but absent from baseline (new route or baseline stale): ${routePath}`,
        },
      ],
      missing: { baseline: [], target: [] },
    });
  }

  const suiteMeanDiff = diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
  const suiteMeanVerdict: Verdict = suiteMeanDiff > SUITE_MEAN_THRESHOLD ? "FAIL" : "PASS";

  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const r of routes) {
    if (r.overallVerdict === "PASS") counts.pass++;
    else if (r.overallVerdict === "WARN") counts.warn++;
    else counts.fail++;
  }

  return {
    baselineDir,
    targetDir,
    generatedAt: new Date().toISOString(),
    routes,
    suiteMeanDiff,
    suiteMeanVerdict,
    counts,
  };
}

function rollupVerdict(report: RouteReport): Verdict {
  if (report.visual.some((v) => v.verdict === "FAIL")) return "FAIL";
  if (report.semantic.some((s) => s.verdict === "FAIL")) return "FAIL";
  if (report.visual.some((v) => v.verdict === "WARN")) return "WARN";
  return "PASS";
}

function readIndex(dir: string): RouteCaptureResult[] {
  const indexPath = path.join(dir, "capture-index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`capture-index.json not found in ${dir}. Run capture first.`);
  }
  const data = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  return data.results as RouteCaptureResult[];
}

function readDomSnapshot(dir: string, result: RouteCaptureResult): DomSnapshot | null {
  const folder = path.join(dir, `${result.pageType}--${result.slug}`);
  const p = path.join(folder, "dom.json");
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as DomSnapshot;
}

function compareSemantic(baseline: DomSnapshot, target: DomSnapshot): SemanticFinding[] {
  const findings: SemanticFinding[] = [];

  findings.push(
    baseline.h1 === target.h1
      ? { field: "h1", verdict: "PASS", message: `H1 matches: "${baseline.h1.slice(0, 60)}"` }
      : {
          field: "h1",
          verdict: "FAIL",
          message: `H1 mismatch`,
          baselineValue: baseline.h1,
          targetValue: target.h1,
        }
  );

  const baseOutline = baseline.headingOutline.map((h) => `${h.level}:${h.text}`).join("\n");
  const targetOutline = target.headingOutline.map((h) => `${h.level}:${h.text}`).join("\n");
  findings.push(
    baseOutline === targetOutline
      ? {
          field: "headingOutline",
          verdict: "PASS",
          message: `Heading outline matches (${baseline.headingOutline.length} headings)`,
        }
      : {
          field: "headingOutline",
          verdict: "FAIL",
          message: `Heading outline mismatch (baseline=${baseline.headingOutline.length}, target=${target.headingOutline.length})`,
          baselineValue: baseline.headingOutline,
          targetValue: target.headingOutline,
        }
  );

  findings.push(
    baseline.sectionCount === target.sectionCount
      ? {
          field: "sectionCount",
          verdict: "PASS",
          message: `Section count matches (${baseline.sectionCount})`,
        }
      : {
          field: "sectionCount",
          verdict: "FAIL",
          message: `Section count mismatch (baseline=${baseline.sectionCount}, target=${target.sectionCount})`,
        }
  );

  for (const key of ["header", "main", "footer", "nav"] as const) {
    const b = baseline.landmarks[key];
    const t = target.landmarks[key];
    if (b !== t) {
      findings.push({
        field: `landmark.${key}`,
        verdict: "FAIL",
        message: `${key} landmark count mismatch (baseline=${b}, target=${t})`,
      });
    }
  }

  const imageDelta = Math.abs(baseline.imageCount - target.imageCount);
  if (imageDelta > SEMANTIC_TOLERANCES.imageCount) {
    findings.push({
      field: "imageCount",
      verdict: "FAIL",
      message: `Image count drift exceeds tolerance (baseline=${baseline.imageCount}, target=${target.imageCount}, delta=${imageDelta}, tolerance=±${SEMANTIC_TOLERANCES.imageCount})`,
    });
  }

  const linkDelta = Math.abs(baseline.linkCount - target.linkCount);
  const linkTolerance = Math.max(
    2,
    Math.round(baseline.linkCount * SEMANTIC_TOLERANCES.linkCountRatio)
  );
  if (linkDelta > linkTolerance) {
    findings.push({
      field: "linkCount",
      verdict: "FAIL",
      message: `Link count drift exceeds ±${Math.round(SEMANTIC_TOLERANCES.linkCountRatio * 100)}% (baseline=${baseline.linkCount}, target=${target.linkCount}, delta=${linkDelta})`,
    });
  }

  if (baseline.markerCount > 0) {
    if (baseline.markerCount !== target.markerCount) {
      findings.push({
        field: "markerCount",
        verdict: "FAIL",
        message: `Leaflet marker count mismatch (baseline=${baseline.markerCount}, target=${target.markerCount})`,
      });
    }
  }

  return findings;
}
