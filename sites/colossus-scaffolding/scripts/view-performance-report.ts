#!/usr/bin/env node

/**
 * View Performance Test Report
 * Displays the latest performance test results and historical trends
 */

import {
  generatePerformanceReport,
  getPerformanceHistory,
} from "@platform/core-components/lib/performance-tracker";

async function main() {
  console.log("=".repeat(80));
  console.log("📊 PERFORMANCE TEST REPORT");
  console.log("=".repeat(80) + "\n");

  try {
    const history = await getPerformanceHistory();

    if (history.results.length === 0) {
      console.log("No performance test data available yet.");
      console.log("\nRun performance tests first:");
      console.log("  npm run test:e2e:performance");
      process.exit(0);
    }

    const report = await generatePerformanceReport();
    console.log(report);

    console.log("\n" + "=".repeat(80));
    console.log("📁 Data Files:");
    console.log("=".repeat(80));
    console.log(
      `  • test-results/performance/performance-history.json (${history.results.length} runs)`
    );
    console.log("  • test-results/performance/latest-results.json");

    if (history.summary.trends.length > 0) {
      console.log("\n" + "=".repeat(80));
      console.log("📈 TREND ANALYSIS");
      console.log("=".repeat(80));

      for (const trend of history.summary.trends) {
        const emoji =
          trend.direction === "improving" ? "✅" : trend.direction === "degrading" ? "⚠️" : "ℹ️";
        console.log(
          `${emoji} ${trend.metric.toUpperCase()}: ${trend.direction} (${trend.percentageChange > 0 ? "+" : ""}${trend.percentageChange}%)`
        );
      }
    }

    console.log("\n");
  } catch (error) {
    console.error("Error generating report:", error);
    process.exit(1);
  }
}

main();
