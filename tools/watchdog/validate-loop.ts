#!/usr/bin/env npx tsx
/**
 * Regression Watchdog — End-to-End Validation
 *
 * Proves the full triage loop works by deliberately injecting a failing test
 * (pointing to a non-existent path), running the watchdog, verifying a GitHub
 * issue was created, and cleaning up.
 *
 * Modes:
 *   --inject   Patch sites.json to add a broken staging URL (called by watchdog.yml before smoke run)
 *   --restore  Undo the patch and delete the test issue/branch (called after smoke + triage)
 *   (no flag)  Run the full validation locally in one shot
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { execSync } from "child_process";
import { openIssue, closeIssue, deleteBranch } from "./lib/github-client";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const SITES_JSON = path.resolve(__dirname, "../../packages/playwright-shared/sites.json");
const BACKUP_PATH = `${SITES_JSON}.validate-backup`;
const VALIDATE_MARKER = "__validate_loop__";

interface SiteEntry {
  name: string;
  baseURL: string;
  hasLocations: boolean;
  firstServiceSlug: string | null;
  firstLocationSlug: string | null;
}

interface SitesFile {
  prod: SiteEntry[];
  staging: SiteEntry[];
}

function inject() {
  console.log("[validate-loop] Injecting deliberate failure into staging sites.json...");
  const original = fs.readFileSync(SITES_JSON, "utf8");
  fs.writeFileSync(BACKUP_PATH, original, "utf8");

  const sites: SitesFile = JSON.parse(original);
  sites.staging.push({
    name: VALIDATE_MARKER,
    baseURL: "https://this-domain-does-not-exist-validate-loop-lbp.invalid",
    hasLocations: false,
    firstServiceSlug: null,
    firstLocationSlug: null,
  });

  fs.writeFileSync(SITES_JSON, JSON.stringify(sites, null, 2) + "\n", "utf8");
  console.log("[validate-loop] Injected broken site entry.");
}

function restore() {
  console.log("[validate-loop] Restoring sites.json...");
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, SITES_JSON);
    fs.unlinkSync(BACKUP_PATH);
    console.log("[validate-loop] sites.json restored.");
  } else {
    console.log("[validate-loop] No backup found — sites.json may already be clean.");
  }
}

async function verifyIssueCreated(): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    console.log("[validate-loop] No GITHUB_TOKEN/GITHUB_REPOSITORY — skipping issue verification.");
    return null;
  }

  // Wait up to 60s for the triage issue to appear
  const since = new Date(Date.now() - 120_000).toISOString();
  const url = `https://api.github.com/repos/${repo}/issues?labels=auto-triage&state=open&since=${since}&per_page=5`;

  for (let i = 0; i < 6; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (res.ok) {
      const issues = (await res.json()) as { number: number; title: string; created_at: string }[];
      const found = issues.find((i) => new Date(i.created_at) > new Date(Date.now() - 120_000));
      if (found) {
        console.log(`[validate-loop] ✓ Issue #${found.number} created: "${found.title}"`);
        return found.number;
      }
    }
    console.log(`[validate-loop] Waiting for issue... (attempt ${i + 1}/6)`);
  }

  console.error("[validate-loop] ✗ No auto-triage issue was created within 60s.");
  return null;
}

async function runLocal() {
  console.log("\n[validate-loop] === Starting end-to-end validation ===\n");

  inject();

  console.log("[validate-loop] Running Playwright smoke tests (staging, expecting failure)...");
  let smokeOutput = "";
  try {
    smokeOutput = execSync(
      "WATCHDOG_ENV=staging npx playwright test --config packages/playwright-shared/smoke.config.ts --reporter=json",
      { cwd: path.resolve(__dirname, "../.."), encoding: "utf8" }
    );
  } catch (err) {
    smokeOutput = err instanceof Error ? err.message : String(err);
  }

  const resultsPath = path.resolve(
    __dirname,
    "../../packages/playwright-shared/smoke-results.json"
  );
  if (!fs.existsSync(resultsPath)) {
    fs.writeFileSync(
      resultsPath,
      JSON.stringify({ stats: { ok: false, unexpected: 1 }, suites: [] }),
      "utf8"
    );
  }

  console.log("\n[validate-loop] Running auto-triage...");
  try {
    execSync(`npx tsx tools/watchdog/index.ts --results=${resultsPath} --env=staging`, {
      cwd: path.resolve(__dirname, "../.."),
      stdio: "inherit",
      env: { ...process.env },
    });
  } catch {
    // triage exits 0 by design, but keep going regardless
  }

  const issueNumber = await verifyIssueCreated();

  // Cleanup
  restore();
  if (issueNumber) {
    console.log(`[validate-loop] Closing test issue #${issueNumber}...`);
    try {
      await closeIssue(issueNumber);
      console.log(`[validate-loop] ✓ Issue #${issueNumber} closed.`);
    } catch {
      console.log(`[validate-loop] Could not close issue #${issueNumber} — close it manually.`);
    }
  }

  // Clean up any auto-triage branches created during validation
  try {
    const branches = execSync("git branch -r --list 'origin/auto-triage/*'", { encoding: "utf8" })
      .split("\n")
      .map((b) => b.trim().replace("origin/", ""))
      .filter(Boolean);
    for (const branch of branches) {
      const createdAt = execSync(
        `git log -1 --format="%ct" "origin/${branch}" 2>/dev/null || echo 0`,
        { encoding: "utf8" }
      ).trim();
      const ageSeconds = Math.floor(Date.now() / 1000) - parseInt(createdAt, 10);
      if (ageSeconds < 300) {
        console.log(`[validate-loop] Deleting test branch: ${branch}`);
        await deleteBranch(branch).catch(() => undefined);
      }
    }
  } catch {
    // non-critical
  }

  if (issueNumber) {
    console.log("\n[validate-loop] ✓ PASS — triage loop is working end-to-end.");
    process.exit(0);
  } else {
    console.error("\n[validate-loop] ✗ FAIL — no issue was created. Check watchdog logs.");
    process.exit(1);
  }
}

const mode = process.argv.includes("--inject")
  ? "inject"
  : process.argv.includes("--restore")
    ? "restore"
    : "local";

if (mode === "inject") {
  inject();
} else if (mode === "restore") {
  restore();
} else {
  runLocal().catch((err) => {
    console.error("[validate-loop] Fatal:", err);
    restore();
    process.exit(1);
  });
}
