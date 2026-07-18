#!/usr/bin/env npx tsx
/**
 * Regression Watchdog — triage orchestrator
 *
 * Reads a Playwright JSON results file, identifies failures, runs pattern
 * matching and Claude auto-triage for each, then creates GitHub issues and
 * (for high-confidence diagnoses) draft PRs.
 *
 * Usage:
 *   npx tsx tools/watchdog/index.ts --results=<path> [--env=prod|staging] [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import type { PlaywrightReport, PlaywrightSuiteResult } from "./lib/types";
import { matchPatterns } from "./lib/pattern-matcher";
import { queryAnomalies } from "./lib/langfuse-client";
import { runAutoTriage } from "./lib/auto-triage-agent";
import {
  createBranchAndApplyFix,
  openDraftPR,
  openIssue,
  getRecentCommits,
} from "./lib/github-client";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (key: string) =>
    args
      .find((a) => a.startsWith(`--${key}=`))
      ?.split("=")
      .slice(1)
      .join("=");
  return {
    resultsPath: get("results") ?? "smoke-results.json",
    env: (get("env") ?? "prod") as "prod" | "staging",
    dryRun: args.includes("--dry-run"),
  };
}

function collectFailures(
  report: PlaywrightReport
): { title: string; fullTitle: string; error: string }[] {
  const failures: { title: string; fullTitle: string; error: string }[] = [];

  function walk(suites: PlaywrightSuiteResult[], prefix = "") {
    for (const suite of suites) {
      const suiteTitle = prefix ? `${prefix} > ${suite.title}` : suite.title;
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests ?? []) {
          // "unexpected" = never passed across all retries; "flaky" passed on
          // retry and isn't treated as a failure worth triaging.
          if (test.status !== "unexpected") continue;
          const lastResult = test.results?.[test.results.length - 1];
          failures.push({
            title: spec.title,
            fullTitle: `${suiteTitle} > ${spec.title}`,
            error: [lastResult?.error?.message, lastResult?.error?.stack]
              .filter(Boolean)
              .join("\n"),
          });
        }
      }
      if (suite.suites) walk(suite.suites, suiteTitle);
    }
  }

  walk(report.suites ?? []);
  return failures;
}

function extractSiteUrl(fullTitle: string): string {
  const match = fullTitle.match(/\[([^\]]+)\]\s+(https?:\/\/[^\s>]+)/);
  return match?.[2] ?? "unknown";
}

function branchName(siteUrl: string, testSlug: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const site = siteUrl
    .replace(/https?:\/\/(www\.)?/, "")
    .replace(/[^a-z0-9]/gi, "-")
    .slice(0, 30);
  const slug = testSlug.replace(/[^a-z0-9]/gi, "-").slice(0, 20);
  return `auto-triage/${date}-${site}-${slug}`;
}

async function main() {
  const { resultsPath, dryRun } = parseArgs();

  console.log(`\n[watchdog] Reading results from: ${resultsPath}`);
  if (!fs.existsSync(resultsPath)) {
    // A missing results file is a failure, not "nothing to triage" — a smoke run
    // that produced no results has already gone wrong. Exit non-zero so the
    // watchdog cannot report success on an absent report.
    console.error("[watchdog] No results file found — treating as FAILURE.");
    process.exit(1);
  }

  const raw = fs.readFileSync(resultsPath, "utf8").trim();
  if (raw === "") {
    console.error("[watchdog] Results file is empty — treating as FAILURE.");
    process.exit(1);
  }

  const report: PlaywrightReport = JSON.parse(raw);

  const failures = collectFailures(report);
  const statsUnexpected = report.stats?.unexpected ?? 0;
  console.log(`[watchdog] ${failures.length} failure(s) to triage.`);

  const recentCommits = getRecentCommits(10);

  console.log("[watchdog] Querying Langfuse for anomalies...");
  const langfuseAnomalies = await queryAnomalies();
  if (langfuseAnomalies.length > 0) {
    console.log(`[watchdog] ${langfuseAnomalies.length} Langfuse anomaly(s) found.`);
  }

  for (const failure of failures) {
    const siteUrl = extractSiteUrl(failure.fullTitle);
    console.log(`\n[watchdog] Triaging: "${failure.title}" on ${siteUrl}`);

    const matchedPatterns = matchPatterns(failure.error);
    if (matchedPatterns.length > 0) {
      console.log(
        `[watchdog] Matched patterns: ${matchedPatterns.map((m) => m.pattern.id).join(", ")}`
      );
    }

    let triageResult;
    try {
      triageResult = await runAutoTriage({
        testName: failure.fullTitle,
        siteUrl,
        failureOutput: failure.error,
        recentCommits,
        matchedPatterns,
        langfuseAnomalies,
      });
    } catch (err) {
      console.error("[watchdog] Auto-triage agent failed:", err);
      continue;
    }

    console.log(
      `[watchdog] Hypothesis (${triageResult.confidence}): ${triageResult.hypothesis.slice(0, 120)}...`
    );

    if (dryRun) {
      console.log("[watchdog] --dry-run: would create issue/PR but skipping.");
      console.log("  PR title:", triageResult.pr_title);
      continue;
    }

    const issueLabels = ["auto-triage", "regression"];
    const issueTitle = `[auto-triage] ${triageResult.pr_title}`;
    const issueBody = buildIssueBody(triageResult, failure, siteUrl, langfuseAnomalies);

    try {
      const { url: issueUrl, number: issueNumber } = await openIssue({
        title: issueTitle,
        body: issueBody,
        labels: issueLabels,
      });
      console.log(`[watchdog] Issue created: ${issueUrl}`);

      if (
        triageResult.confidence === "high" &&
        triageResult.affected_file &&
        triageResult.old_string &&
        triageResult.new_string
      ) {
        const branch = branchName(siteUrl, failure.title);
        try {
          await createBranchAndApplyFix({
            branchName: branch,
            filePath: triageResult.affected_file,
            oldString: triageResult.old_string,
            newString: triageResult.new_string,
            commitMessage: `fix: ${triageResult.pr_title} [auto-triage #${issueNumber}]`,
          });

          const prBody = `Closes #${issueNumber}\n\n${triageResult.pr_body}`;
          const prUrl = await openDraftPR({
            title: triageResult.pr_title,
            body: prBody,
            branch,
            labels: ["auto-triage", "regression"],
          });
          console.log(`[watchdog] Draft PR created: ${prUrl}`);
        } catch (prErr) {
          console.error("[watchdog] Failed to create draft PR:", prErr);
          console.log("[watchdog] Issue remains open for manual investigation.");
        }
      } else {
        console.log(
          `[watchdog] Confidence=${triageResult.confidence} — issue created, no auto-PR.`
        );
      }
    } catch (issueErr) {
      console.error("[watchdog] Failed to create GitHub issue:", issueErr);
    }
  }

  console.log("\n[watchdog] Triage complete.");

  // Exit non-zero when the run actually failed. The watchdog is no longer
  // observation-only: opening issues is not enough — a run with real failures
  // must also surface a non-zero exit so nothing downstream reads it as success.
  if (failures.length > 0 || statsUnexpected > 0) {
    console.error(
      `[watchdog] ${failures.length} triaged failure(s), ${statsUnexpected} unexpected in stats — exiting non-zero.`
    );
    process.exit(1);
  }
}

function buildIssueBody(
  triage: import("./lib/types").TriageResult,
  failure: { title: string; fullTitle: string; error: string },
  siteUrl: string,
  anomalies: import("./lib/types").LangfuseAnomaly[]
): string {
  const sections = [
    `## Smoke Test Failure\n\n**Test:** \`${failure.fullTitle}\`\n**Site:** ${siteUrl}`,
    `## Root-Cause Hypothesis\n\n**Confidence:** ${triage.confidence}\n\n${triage.hypothesis}`,
  ];

  if (triage.matched_pattern) {
    sections.push(`## Matched Known Pattern\n\n\`${triage.matched_pattern}\``);
  }

  if (anomalies.length > 0) {
    sections.push(
      `## Langfuse Anomalies\n\n${anomalies.map((a) => `- **${a.type}**: ${a.description}`).join("\n")}`
    );
  }

  sections.push(`## Error Output\n\n\`\`\`\n${failure.error.slice(0, 2000)}\n\`\`\``);

  if (triage.confidence === "high" && triage.affected_file) {
    sections.push(`## Proposed Fix\n\n**File:** \`${triage.affected_file}\`\n\n${triage.pr_body}`);
  } else {
    sections.push(`## Suggested Investigation\n\n${triage.pr_body}`);
  }

  sections.push(
    `---\n*Auto-generated by the regression watchdog. Review before merging any auto-PR.*`
  );
  return sections.join("\n\n");
}

main().catch((err) => {
  console.error("[watchdog] Fatal error:", err);
  process.exit(1);
});
