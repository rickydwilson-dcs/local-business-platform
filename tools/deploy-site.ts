#!/usr/bin/env tsx
/**
 * Single Site Deployment Tool
 *
 * Deploys a single site to Vercel with pre-deployment validation.
 *
 * Usage:
 *   tsx tools/deploy-site.ts <site-name> [options]
 *
 * Examples:
 *   tsx tools/deploy-site.ts colossus-reference
 *   tsx tools/deploy-site.ts colossus-reference --env=production
 *   tsx tools/deploy-site.ts joes-plumbing-canterbury --skip-tests
 *   tsx tools/deploy-site.ts colossus-reference --dry-run
 *
 * Options:
 *   --env=<environment>    Target environment (development, staging, production)
 *   --skip-tests           Skip pre-deployment smoke tests
 *   --dry-run              Show what would be deployed without actually deploying
 *   --help                 Show this help message
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

interface DeploymentOptions {
  siteName: string;
  environment: "development" | "staging" | "production";
  skipTests: boolean;
  dryRun: boolean;
}

interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  duration: number;
}

/**
 * Print colored message to console
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
 * Execute command and return output
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
function parseArgs(): DeploymentOptions {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    console.log(readFileSync(__filename, "utf-8").split("\n").slice(1, 18).join("\n"));
    process.exit(0);
  }

  const siteName = args.find((arg) => !arg.startsWith("--")) || "";
  const environment = (args.find((arg) => arg.startsWith("--env="))?.split("=")[1] ||
    "production") as DeploymentOptions["environment"];
  const skipTests = args.includes("--skip-tests");
  const dryRun = args.includes("--dry-run");

  if (!siteName) {
    log("❌ Error: Site name is required", "red");
    log("\nUsage: tsx tools/deploy-site.ts <site-name> [options]", "yellow");
    process.exit(1);
  }

  return { siteName, environment, skipTests, dryRun };
}

/**
 * Verify site exists in sites/ directory
 */
function verifySiteExists(siteName: string): void {
  logSection("🔍 Verifying Site");

  const sitePath = join(process.cwd(), "sites", siteName);

  if (!existsSync(sitePath)) {
    log(`❌ Site not found: sites/${siteName}`, "red");
    log("\nAvailable sites:", "yellow");
    exec("ls -1 sites/", { silent: false });
    process.exit(1);
  }

  log(`✅ Site found: sites/${siteName}`, "green");
}

/**
 * Check git status - ensure no uncommitted changes
 */
function checkGitStatus(): void {
  logSection("🔍 Checking Git Status");

  const status = exec("git status --porcelain", { silent: true });

  if (status.trim()) {
    log("⚠️  Warning: You have uncommitted changes", "yellow");
    log("\nUncommitted changes:", "yellow");
    console.log(status);
    log("\nConsider committing or stashing changes before deploying.", "yellow");

    // Ask for confirmation
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question("\nContinue anyway? (y/N): ", (answer: string) => {
      readline.close();
      if (answer.toLowerCase() !== "y") {
        log("❌ Deployment cancelled", "red");
        process.exit(1);
      }
    });
  } else {
    log("✅ Working directory is clean", "green");
  }
}

/**
 * Get current git branch
 */
function getCurrentBranch(): string {
  return exec("git branch --show-current", { silent: true }).trim();
}

/**
 * Verify correct branch for environment
 */
function verifyBranch(environment: string): void {
  logSection("🔍 Verifying Branch");

  const currentBranch = getCurrentBranch();
  const expectedBranch =
    environment === "production" ? "main" : environment === "staging" ? "staging" : "develop";

  if (currentBranch !== expectedBranch) {
    log(
      `⚠️  Warning: Current branch is '${currentBranch}' but deploying to '${environment}'`,
      "yellow"
    );
    log(`Expected branch: '${expectedBranch}'`, "yellow");
    log("\nYou may want to switch branches before deploying.", "yellow");
  } else {
    log(`✅ On correct branch: ${currentBranch}`, "green");
  }
}

/**
 * Run TypeScript validation
 */
function runTypeCheck(siteName: string): void {
  logSection("🔍 Running TypeScript Validation");

  try {
    log("Running: pnpm --filter " + siteName + " run type-check", "cyan");
    exec(`pnpm --filter ${siteName} run type-check`);
    log("✅ TypeScript validation passed", "green");
  } catch (error) {
    log("❌ TypeScript validation failed", "red");
    throw error;
  }
}

/**
 * Run production build
 */
function runBuild(siteName: string): void {
  logSection("🔨 Running Production Build");

  try {
    log("Running: pnpm --filter " + siteName + " run build", "cyan");
    exec(`pnpm --filter ${siteName} run build`);
    log("✅ Production build successful", "green");
  } catch (error) {
    log("❌ Production build failed", "red");
    throw error;
  }
}

/**
 * Run E2E smoke tests
 */
function runSmokeTests(siteName: string, skipTests: boolean): void {
  if (skipTests) {
    logSection("⏭️  Skipping Smoke Tests");
    log("⚠️  Smoke tests skipped via --skip-tests flag", "yellow");
    return;
  }

  logSection("🧪 Running E2E Smoke Tests");

  try {
    log("Running: pnpm --filter " + siteName + " run test:e2e:smoke", "cyan");
    exec(`pnpm --filter ${siteName} run test:e2e:smoke`);
    log("✅ Smoke tests passed", "green");
  } catch (error) {
    log("❌ Smoke tests failed", "red");
    throw error;
  }
}

/**
 * Deploy to Vercel
 */
function deployToVercel(siteName: string, environment: string, dryRun: boolean): DeploymentResult {
  logSection(`🚀 Deploying to Vercel (${environment})`);

  const startTime = Date.now();

  if (dryRun) {
    log("🔍 DRY RUN - No actual deployment will occur", "yellow");
    log(`\nWould deploy: sites/${siteName}`, "cyan");
    log(`Environment: ${environment}`, "cyan");
    log(`Command: vercel deploy ${environment === "production" ? "--prod" : ""}`, "cyan");

    return {
      success: true,
      url: `https://${siteName}-preview.vercel.app (dry run)`,
      duration: Date.now() - startTime,
    };
  }

  try {
    const sitePath = join(process.cwd(), "sites", siteName);
    const prodFlag = environment === "production" ? "--prod" : "";

    log(`Deploying from: ${sitePath}`, "cyan");
    log(`Command: cd ${sitePath} && vercel deploy ${prodFlag}`, "cyan");

    // Change to site directory and deploy
    const output = exec(`cd ${sitePath} && vercel deploy ${prodFlag} --yes`, { silent: true });

    // Extract deployment URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : undefined;

    const duration = Date.now() - startTime;

    if (url) {
      log("✅ Deployment successful!", "green");
      log(`\n🌐 URL: ${url}`, "cyan");
      log(`⏱️  Duration: ${(duration / 1000).toFixed(1)}s`, "cyan");
    } else {
      log("⚠️  Deployment completed but URL not found in output", "yellow");
    }

    return {
      success: true,
      url,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    log("❌ Deployment failed", "red");

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration,
    };
  }
}

/**
 * Print deployment summary
 */
function printSummary(options: DeploymentOptions, result: DeploymentResult): void {
  logSection("📊 Deployment Summary");

  console.log(`Site:        ${options.siteName}`);
  console.log(`Environment: ${options.environment}`);
  console.log(`Status:      ${result.success ? "✅ Success" : "❌ Failed"}`);
  console.log(`Duration:    ${(result.duration / 1000).toFixed(1)}s`);

  if (result.url) {
    console.log(`URL:         ${result.url}`);
  }

  if (result.error) {
    console.log(`\nError: ${result.error}`);
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

/**
 * Main deployment function
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  // Parse command line arguments
  const options = parseArgs();

  logSection("🚀 Starting Deployment");
  log(`Site: ${options.siteName}`, "cyan");
  log(`Environment: ${options.environment}`, "cyan");
  log(`Dry Run: ${options.dryRun ? "Yes" : "No"}`, "cyan");
  log(`Skip Tests: ${options.skipTests ? "Yes" : "No"}`, "cyan");

  try {
    // Pre-deployment checks
    verifySiteExists(options.siteName);
    checkGitStatus();
    verifyBranch(options.environment);
    runTypeCheck(options.siteName);
    runBuild(options.siteName);
    runSmokeTests(options.siteName, options.skipTests);

    // Deploy
    const result = deployToVercel(options.siteName, options.environment, options.dryRun);
    result.duration = Date.now() - startTime;

    // Print summary
    printSummary(options, result);

    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    log("\n❌ Deployment failed with error:", "red");
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

export { main, DeploymentOptions, DeploymentResult };
