/**
 * Performance Test Results Tracker
 * Saves test results to JSON files and provides historical comparison
 */

import fs from "fs/promises";
import path from "path";

export interface PerformanceResult {
  timestamp: string;
  testName: string;
  page: string;
  metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    tbt?: number;
    domContentLoaded?: number;
    loadComplete?: number;
    totalSize?: number;
    resourceCount?: number;
    imageCount?: number;
    jsCount?: number;
    cssCount?: number;
  };
  status: "pass" | "warning" | "fail";
  thresholds: {
    lcp?: { good: number; warning: number; critical: number };
    cls?: { good: number; warning: number; critical: number };
  };
}

export interface PerformanceHistory {
  version: string;
  results: PerformanceResult[];
  summary: {
    totalRuns: number;
    lastRun: string;
    averageMetrics: Record<string, number>;
    trends: {
      metric: string;
      direction: "improving" | "degrading" | "stable";
      percentageChange: number;
    }[];
  };
}

const RESULTS_DIR = path.join(process.cwd(), "test-results", "performance");
const HISTORY_FILE = path.join(RESULTS_DIR, "performance-history.json");
const LATEST_FILE = path.join(RESULTS_DIR, "latest-results.json");

/**
 * Ensure results directory exists
 */
async function ensureResultsDir(): Promise<void> {
  try {
    await fs.mkdir(RESULTS_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create results directory:", error);
  }
}

/**
 * Load existing performance history
 */
async function loadHistory(): Promise<PerformanceHistory> {
  try {
    const content = await fs.readFile(HISTORY_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    // No history file exists yet
    return {
      version: "1.0.0",
      results: [],
      summary: {
        totalRuns: 0,
        lastRun: "",
        averageMetrics: {},
        trends: [],
      },
    };
  }
}

/**
 * Save performance result to history
 */
export async function savePerformanceResult(result: PerformanceResult): Promise<void> {
  await ensureResultsDir();

  // Load existing history
  const history = await loadHistory();

  // Add new result
  history.results.push(result);
  history.summary.totalRuns = history.results.length;
  history.summary.lastRun = result.timestamp;

  // Keep only last 100 results to prevent file from growing too large
  if (history.results.length > 100) {
    history.results = history.results.slice(-100);
  }

  // Calculate average metrics
  history.summary.averageMetrics = calculateAverageMetrics(history.results);

  // Calculate trends (compare last 10 vs previous 10)
  history.summary.trends = calculateTrends(history.results);

  // Save updated history
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));

  // Save latest result for quick access
  await fs.writeFile(LATEST_FILE, JSON.stringify(result, null, 2));

  console.log(`✅ Performance result saved to ${HISTORY_FILE}`);
}

/**
 * Calculate average metrics across all results
 */
function calculateAverageMetrics(results: PerformanceResult[]): Record<string, number> {
  if (results.length === 0) return {};

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const result of results) {
    for (const [key, value] of Object.entries(result.metrics)) {
      if (typeof value === "number") {
        sums[key] = (sums[key] || 0) + value;
        counts[key] = (counts[key] || 0) + 1;
      }
    }
  }

  const averages: Record<string, number> = {};
  for (const key of Object.keys(sums)) {
    averages[key] = Math.round((sums[key] / counts[key]) * 100) / 100;
  }

  return averages;
}

/**
 * Calculate performance trends
 */
function calculateTrends(
  results: PerformanceResult[]
): { metric: string; direction: "improving" | "degrading" | "stable"; percentageChange: number }[] {
  if (results.length < 20) {
    return []; // Need at least 20 results for meaningful trends
  }

  const recent = results.slice(-10);
  const previous = results.slice(-20, -10);

  const recentAvg = calculateAverageMetrics(recent);
  const previousAvg = calculateAverageMetrics(previous);

  const trends: {
    metric: string;
    direction: "improving" | "degrading" | "stable";
    percentageChange: number;
  }[] = [];

  for (const metric of ["lcp", "cls", "fcp", "ttfb", "loadComplete"]) {
    if (recentAvg[metric] && previousAvg[metric]) {
      const change = ((recentAvg[metric] - previousAvg[metric]) / previousAvg[metric]) * 100;

      let direction: "improving" | "degrading" | "stable";
      if (Math.abs(change) < 5) {
        direction = "stable";
      } else if (change < 0) {
        direction = "improving"; // Lower is better for these metrics
      } else {
        direction = "degrading";
      }

      trends.push({
        metric,
        direction,
        percentageChange: Math.round(change * 100) / 100,
      });
    }
  }

  return trends;
}

/**
 * Get latest performance results
 */
export async function getLatestResults(): Promise<PerformanceResult | null> {
  try {
    const content = await fs.readFile(LATEST_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Get performance history
 */
export async function getPerformanceHistory(): Promise<PerformanceHistory> {
  return loadHistory();
}

/**
 * Compare current result against historical baseline
 */
export async function compareWithBaseline(current: PerformanceResult): Promise<{
  alerts: string[];
  degradations: { metric: string; current: number; baseline: number; change: number }[];
}> {
  const history = await loadHistory();

  if (history.results.length < 10) {
    return { alerts: [], degradations: [] };
  }

  const baseline = history.summary.averageMetrics;
  const alerts: string[] = [];
  const degradations: { metric: string; current: number; baseline: number; change: number }[] = [];

  // Check for significant degradations (>10% worse than baseline)
  for (const [metric, currentValue] of Object.entries(current.metrics)) {
    if (typeof currentValue !== "number") continue;

    const baselineValue = baseline[metric];
    if (!baselineValue) continue;

    const change = ((currentValue - baselineValue) / baselineValue) * 100;

    if (change > 10) {
      // More than 10% degradation
      degradations.push({
        metric,
        current: currentValue,
        baseline: baselineValue,
        change: Math.round(change * 100) / 100,
      });

      alerts.push(
        `⚠️ ${metric.toUpperCase()} degraded by ${Math.round(change)}% (${baselineValue} → ${currentValue})`
      );
    }
  }

  return { alerts, degradations };
}

/**
 * Generate performance report markdown
 */
export async function generatePerformanceReport(): Promise<string> {
  const history = await getPerformanceHistory();

  if (history.results.length === 0) {
    return "# Performance Report\n\nNo performance data available yet.";
  }

  const latest = history.results[history.results.length - 1];

  let report = "# Performance Test Report\n\n";
  report += `**Last Run**: ${latest.timestamp}\n`;
  report += `**Total Test Runs**: ${history.summary.totalRuns}\n\n`;

  report += "## Latest Results\n\n";
  report += `**Page**: ${latest.page}\n`;
  report += `**Status**: ${latest.status === "pass" ? "✅ PASS" : latest.status === "warning" ? "⚠️ WARNING" : "❌ FAIL"}\n\n`;

  report += "### Core Web Vitals\n\n";
  report += "| Metric | Value | Threshold | Status |\n";
  report += "|--------|-------|-----------|--------|\n";

  if (latest.metrics.lcp) {
    const status =
      latest.metrics.lcp <= (latest.thresholds.lcp?.good || 1200)
        ? "✅ Good"
        : latest.metrics.lcp <= (latest.thresholds.lcp?.warning || 2000)
          ? "⚠️ Warning"
          : "❌ Critical";
    report += `| LCP | ${latest.metrics.lcp}ms | <${latest.thresholds.lcp?.good}ms | ${status} |\n`;
  }

  if (latest.metrics.cls) {
    const status =
      latest.metrics.cls <= (latest.thresholds.cls?.good || 0.1)
        ? "✅ Good"
        : latest.metrics.cls <= (latest.thresholds.cls?.warning || 0.15)
          ? "⚠️ Warning"
          : "❌ Critical";
    report += `| CLS | ${latest.metrics.cls} | <${latest.thresholds.cls?.good} | ${status} |\n`;
  }

  if (latest.metrics.fcp) {
    report += `| FCP | ${latest.metrics.fcp}ms | - | - |\n`;
  }

  report += "\n### Average Metrics (Last 100 Runs)\n\n";
  report += "| Metric | Average |\n";
  report += "|--------|---------|\n";

  for (const [metric, value] of Object.entries(history.summary.averageMetrics)) {
    report += `| ${metric.toUpperCase()} | ${value} |\n`;
  }

  if (history.summary.trends.length > 0) {
    report += "\n### Trends\n\n";
    report += "| Metric | Direction | Change |\n";
    report += "|--------|-----------|--------|\n";

    for (const trend of history.summary.trends) {
      const icon =
        trend.direction === "improving" ? "📈 ↓" : trend.direction === "degrading" ? "📉 ↑" : "→";
      report += `| ${trend.metric.toUpperCase()} | ${icon} ${trend.direction} | ${trend.percentageChange}% |\n`;
    }
  }

  report += `\n---\n*Report generated: ${new Date().toISOString()}*\n`;

  return report;
}
