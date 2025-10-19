#!/usr/bin/env tsx
/**
 * Site Rollback Tool
 *
 * Quickly rollback a site to a previous deployment.
 *
 * Usage:
 *   tsx tools/rollback.ts <site-name> [options]
 *
 * Examples:
 *   tsx tools/rollback.ts colossus-reference
 *   tsx tools/rollback.ts colossus-reference --list
 *   tsx tools/rollback.ts colossus-reference --to=HEAD~1
 *   tsx tools/rollback.ts colossus-reference --dry-run
 *
 * Options:
 *   --list                 List recent deployments
 *   --to=<commit>          Rollback to specific commit (default: HEAD~1)
 *   --dry-run              Show what would be rolled back without actually doing it
 *   --help                 Show this help message
 *
 * Rollback Strategy:
 *   1. Revert to previous commit using git revert
 *   2. Push to main branch
 *   3. Vercel automatically redeploys the reverted code
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

interface RollbackOptions {
  siteName: string;
  listOnly: boolean;
  targetCommit: string;
  dryRun: boolean;
}

/**
 * Print colored message
 */
function log(message: string, color: keyof typeof colors = "reset"): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function logSection(title: string): void {
  console.log("\n" + "=".repeat(60));
  log(title, "bright");
  console.log("=".repeat(60) + "\n");
}

/**
 * Execute command
 */
function exec(command: string, options: { silent?: boolean } = {}): string {
  try {
    return execSync(command, {
      encoding: "utf-8",
      stdio: options.silent ? "pipe" : "inherit",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Command failed: ${command}\n${error.message}`);
    }
    throw error;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): RollbackOptions {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    console.log(readFileSync(__filename, "utf-8").split("\n").slice(1, 24).join("\n"));
    process.exit(0);
  }

  const siteName = args.find((arg) => !arg.startsWith("--")) || "";
  const listOnly = args.includes("--list");
  const targetCommit = args.find((arg) => arg.startsWith("--to="))?.split("=")[1] || "HEAD~1";
  const dryRun = args.includes("--dry-run");

  if (!siteName && !listOnly) {
    log("❌ Error: Site name is required", "red");
    log("\nUsage: tsx tools/rollback.ts <site-name> [options]", "yellow");
    process.exit(1);
  }

  return { siteName, listOnly, targetCommit, dryRun };
}

/**
 * Get recent deployment history from git log
 */
function listRecentDeployments(siteName: string, limit: number = 10): void {
  logSection(`📜 Recent Deployments for ${siteName}`);

  try {
    const log = exec(`git log --oneline --decorate --graph -${limit} -- sites/${siteName}`, {
      silent: true,
    });

    if (!log.trim()) {
      console.log("No recent commits found for this site.");
    } else {
      console.log(log);
    }
  } catch (error) {
    log("❌ Failed to retrieve deployment history", "red");
    throw error;
  }

  // Also show current commit
  console.log("\nCurrent commit:");
  exec("git log -1 --oneline", { silent: false });
}

/**
 * Get current git branch
 */
function getCurrentBranch(): string {
  return exec("git branch --show-current", { silent: true }).trim();
}

/**
 * Verify on main branch
 */
function verifyOnMainBranch(): void {
  logSection("🔍 Verifying Branch");

  const currentBranch = getCurrentBranch();

  if (currentBranch !== "main") {
    log(`❌ Error: Must be on main branch for rollback`, "red");
    log(`Current branch: ${currentBranch}`, "yellow");
    log("\nSwitch to main branch first: git checkout main", "yellow");
    process.exit(1);
  }

  log("✅ On main branch", "green");
}

/**
 * Check git status
 */
function checkGitStatus(): void {
  logSection("🔍 Checking Git Status");

  const status = exec("git status --porcelain", { silent: true });

  if (status.trim()) {
    log("❌ Error: Working directory has uncommitted changes", "red");
    log("\nUncommitted changes:", "yellow");
    console.log(status);
    log("\nPlease commit or stash changes before rolling back.", "yellow");
    process.exit(1);
  }

  log("✅ Working directory is clean", "green");
}

/**
 * Show commit details
 */
function showCommitDetails(commit: string): void {
  logSection(`📝 Commit Details: ${commit}`);

  try {
    exec(`git show --stat ${commit}`, { silent: false });
  } catch (error) {
    log(`❌ Failed to show commit details for: ${commit}`, "red");
    throw error;
  }
}

/**
 * Perform git revert
 */
function performRevert(targetCommit: string, dryRun: boolean): void {
  logSection("⏮️  Performing Rollback");

  if (dryRun) {
    log("🔍 DRY RUN - No actual rollback will occur", "yellow");
    log(`\nWould revert: ${targetCommit}`, "cyan");
    log("Command: git revert HEAD --no-edit", "cyan");
    log("Command: git push origin main", "cyan");
    return;
  }

  try {
    log("Reverting last commit...", "cyan");
    exec("git revert HEAD --no-edit");

    log("✅ Git revert successful", "green");
    log("\nPushing to main branch...", "cyan");

    exec("git push origin main");

    log("✅ Pushed to main - Vercel will auto-deploy", "green");
  } catch (error) {
    log("❌ Rollback failed", "red");
    log("\nTo undo the revert commit:", "yellow");
    log("  git reset --hard HEAD~1", "yellow");
    throw error;
  }
}

/**
 * Verify rollback success
 */
function verifyRollback(): void {
  logSection("✅ Verifying Rollback");

  log("Checking current commit...", "cyan");
  exec("git log -1 --oneline", { silent: false });

  log("\n✅ Rollback complete!", "green");
  log("\nVercel will automatically deploy the rolled-back version.", "cyan");
  log("Monitor deployment at: https://vercel.com/dashboard", "cyan");
}

/**
 * Main rollback function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  // If list-only mode, show deployments and exit
  if (options.listOnly) {
    listRecentDeployments(options.siteName);
    return;
  }

  logSection("🔄 Starting Rollback");
  log(`Site: ${options.siteName}`, "cyan");
  log(`Target: ${options.targetCommit}`, "cyan");
  log(`Dry Run: ${options.dryRun ? "Yes" : "No"}`, "cyan");

  try {
    // Pre-rollback checks
    verifyOnMainBranch();
    checkGitStatus();

    // Show what will be rolled back
    showCommitDetails("HEAD");

    // Confirm rollback
    if (!options.dryRun) {
      log("\n⚠️  This will revert the last commit and push to main.", "yellow");
      log("Vercel will automatically redeploy the previous version.", "yellow");

      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise<void>((resolve) => {
        readline.question("\nContinue with rollback? (y/N): ", (answer: string) => {
          readline.close();
          if (answer.toLowerCase() !== "y") {
            log("❌ Rollback cancelled", "red");
            process.exit(0);
          }
          resolve();
        });
      });
    }

    // Perform rollback
    performRevert(options.targetCommit, options.dryRun);

    if (!options.dryRun) {
      verifyRollback();
    }
  } catch (error) {
    log("\n❌ Rollback failed with error:", "red");
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { main, RollbackOptions };
