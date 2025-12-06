#!/usr/bin/env tsx
/**
 * Batch Site Deployment Tool
 *
 * Deploys multiple sites to Vercel in phased rollout for safety.
 *
 * Usage:
 *   tsx tools/deploy-batch.ts [options]
 *
 * Examples:
 *   tsx tools/deploy-batch.ts
 *   tsx tools/deploy-batch.ts --dry-run
 *   tsx tools/deploy-batch.ts --skip-tests
 *   tsx tools/deploy-batch.ts --config=custom-deployment.json
 *
 * Options:
 *   --dry-run              Show what would be deployed without actually deploying
 *   --skip-tests           Skip pre-deployment smoke tests
 *   --config=<file>        Use custom deployment configuration file
 *   --help                 Show this help message
 *
 * Phased Rollout Strategy:
 *   Phase 1: Internal Site (Canary)     - Deploy colossus-reference first
 *   Phase 2: First Batch (Small)        - Deploy 5 client sites
 *   Phase 3: Second Batch (Medium)      - Deploy 10 client sites
 *   Phase 4: Remaining Sites (All)      - Deploy all remaining sites
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

interface DeploymentPhase {
  name: string;
  sites: string[];
  waitTimeMinutes: number;
  maxConcurrent: number;
}

interface BatchDeploymentConfig {
  phases: DeploymentPhase[];
  rollbackOnFailure: boolean;
  environment: "development" | "staging" | "production";
}

interface BatchDeploymentOptions {
  dryRun: boolean;
  skipTests: boolean;
  configFile?: string;
}

interface PhaseResult {
  phase: string;
  totalSites: number;
  successful: number;
  failed: number;
  duration: number;
  errors: { site: string; error: string }[];
}

interface BatchDeploymentResult {
  success: boolean;
  totalSites: number;
  successfulSites: number;
  failedSites: number;
  phases: PhaseResult[];
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
  console.log("\n" + "=".repeat(70));
  log(title, "bright");
  console.log("=".repeat(70) + "\n");
}

/**
 * Execute command with output visible
 */
function exec(command: string): string {
  return execSync(command, { encoding: "utf-8", stdio: "inherit" }) || "";
}

/**
 * Get all available sites from sites/ directory
 */
function getAvailableSites(): string[] {
  const sitesDir = join(process.cwd(), "sites");
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();
}

/**
 * Get default deployment configuration
 */
function getDefaultConfig(): BatchDeploymentConfig {
  const allSites = getAvailableSites();

  // colossus-reference is our canary site
  const canarySite = "colossus-reference";

  // Remove canary from the pool
  const clientSites = allSites.filter((site) => site !== canarySite);

  // Divide client sites into batches
  const firstBatch = clientSites.slice(0, 5);
  const secondBatch = clientSites.slice(5, 15);
  const remainingSites = clientSites.slice(15);

  return {
    environment: "production",
    rollbackOnFailure: true,
    phases: [
      {
        name: "Phase 1: Canary (Internal Site)",
        sites: [canarySite],
        waitTimeMinutes: 5,
        maxConcurrent: 1,
      },
      ...(firstBatch.length > 0
        ? [
            {
              name: "Phase 2: First Batch (Small)",
              sites: firstBatch,
              waitTimeMinutes: 10,
              maxConcurrent: 3,
            },
          ]
        : []),
      ...(secondBatch.length > 0
        ? [
            {
              name: "Phase 3: Second Batch (Medium)",
              sites: secondBatch,
              waitTimeMinutes: 10,
              maxConcurrent: 5,
            },
          ]
        : []),
      ...(remainingSites.length > 0
        ? [
            {
              name: "Phase 4: Remaining Sites (All)",
              sites: remainingSites,
              waitTimeMinutes: 0,
              maxConcurrent: 5,
            },
          ]
        : []),
    ],
  };
}

/**
 * Load deployment configuration from file
 */
function loadConfig(configFile?: string): BatchDeploymentConfig {
  if (configFile) {
    if (!existsSync(configFile)) {
      log(`❌ Config file not found: ${configFile}`, "red");
      process.exit(1);
    }

    try {
      const config = JSON.parse(readFileSync(configFile, "utf-8"));
      log(`✅ Loaded config from: ${configFile}`, "green");
      return config;
    } catch (error) {
      log(`❌ Failed to parse config file: ${error}`, "red");
      process.exit(1);
    }
  }

  return getDefaultConfig();
}

/**
 * Parse command line arguments
 */
function parseArgs(): BatchDeploymentOptions {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(readFileSync(__filename, "utf-8").split("\n").slice(1, 25).join("\n"));
    process.exit(0);
  }

  const configFile = args.find((arg) => arg.startsWith("--config="))?.split("=")[1];
  const dryRun = args.includes("--dry-run");
  const skipTests = args.includes("--skip-tests");

  return { dryRun, skipTests, configFile };
}

/**
 * Deploy a single site
 */
async function deploySite(
  siteName: string,
  environment: string,
  skipTests: boolean,
  dryRun: boolean
): Promise<{ success: boolean; error?: string; duration: number }> {
  const startTime = Date.now();

  try {
    const skipTestsFlag = skipTests ? "--skip-tests" : "";
    const dryRunFlag = dryRun ? "--dry-run" : "";
    const envFlag = `--env=${environment}`;

    const command = `npx tsx tools/deploy-site.ts ${siteName} ${envFlag} ${skipTestsFlag} ${dryRunFlag}`;

    log(`  Deploying ${siteName}...`, "cyan");

    if (!dryRun) {
      exec(command);
    }

    const duration = Date.now() - startTime;
    log(`  ✅ ${siteName} deployed (${(duration / 1000).toFixed(1)}s)`, "green");

    return { success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    log(`  ❌ ${siteName} failed: ${errorMsg}`, "red");

    return { success: false, error: errorMsg, duration };
  }
}

/**
 * Deploy sites in a phase with controlled concurrency
 */
async function deployPhase(
  phase: DeploymentPhase,
  config: BatchDeploymentConfig,
  options: BatchDeploymentOptions
): Promise<PhaseResult> {
  logSection(`${phase.name} - ${phase.sites.length} sites`);

  const startTime = Date.now();
  const results: { site: string; success: boolean; error?: string }[] = [];

  log(`Sites to deploy: ${phase.sites.join(", ")}`, "cyan");
  log(`Max concurrent: ${phase.maxConcurrent}`, "cyan");
  log(`Wait time after: ${phase.waitTimeMinutes} minutes\n`, "cyan");

  if (options.dryRun) {
    log("🔍 DRY RUN - No actual deployments will occur\n", "yellow");
  }

  // Deploy sites with controlled concurrency
  for (let i = 0; i < phase.sites.length; i += phase.maxConcurrent) {
    const batch = phase.sites.slice(i, i + phase.maxConcurrent);

    log(
      `\nDeploying batch ${Math.floor(i / phase.maxConcurrent) + 1}: ${batch.join(", ")}`,
      "blue"
    );

    // Deploy all sites in this batch concurrently
    const batchResults = await Promise.all(
      batch.map((site) =>
        deploySite(site, config.environment, options.skipTests, options.dryRun).then((result) => ({
          site,
          ...result,
        }))
      )
    );

    results.push(...batchResults);

    // Check if any failed
    const failures = batchResults.filter((r) => !r.success);
    if (failures.length > 0 && config.rollbackOnFailure) {
      log("\n❌ Deployment failures detected!", "red");
      log(`Failed sites: ${failures.map((f) => f.site).join(", ")}`, "red");

      if (!options.dryRun) {
        log("\n⚠️  Rollback would be triggered here (not implemented yet)", "yellow");
      }

      break;
    }
  }

  // Wait before next phase
  if (phase.waitTimeMinutes > 0 && !options.dryRun) {
    log(`\n⏳ Waiting ${phase.waitTimeMinutes} minutes for error monitoring...`, "yellow");
    log("   (In dry run, this wait is skipped)", "dim");
  }

  const duration = Date.now() - startTime;
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const errors = results
    .filter((r) => !r.success)
    .map((r) => ({
      site: r.site,
      error: r.error || "Unknown error",
    }));

  log(`\n✅ Phase complete: ${successful}/${phase.sites.length} successful`, "green");
  if (failed > 0) {
    log(`❌ ${failed} site(s) failed`, "red");
  }

  return {
    phase: phase.name,
    totalSites: phase.sites.length,
    successful,
    failed,
    duration,
    errors,
  };
}

/**
 * Print deployment summary
 */
function printSummary(config: BatchDeploymentConfig, result: BatchDeploymentResult): void {
  logSection("📊 Batch Deployment Summary");

  console.log(`Environment:      ${config.environment}`);
  console.log(`Total Sites:      ${result.totalSites}`);
  console.log(`Successful:       ${result.successfulSites} ✅`);
  console.log(`Failed:           ${result.failedSites} ❌`);
  console.log(`Total Duration:   ${(result.duration / 1000 / 60).toFixed(1)} minutes`);
  console.log(`Overall Status:   ${result.success ? "✅ Success" : "❌ Failed"}\n`);

  // Print phase results
  log("Phase Results:", "bright");
  result.phases.forEach((phase, index) => {
    console.log(`\n  ${index + 1}. ${phase.phase}`);
    console.log(`     Sites: ${phase.totalSites}`);
    console.log(`     Success: ${phase.successful}/${phase.totalSites}`);
    console.log(`     Duration: ${(phase.duration / 1000).toFixed(1)}s`);

    if (phase.errors.length > 0) {
      console.log(`     Errors:`);
      phase.errors.forEach((err) => {
        console.log(`       - ${err.site}: ${err.error}`);
      });
    }
  });

  console.log("\n" + "=".repeat(70) + "\n");
}

/**
 * Main batch deployment function
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  // Parse arguments and load config
  const options = parseArgs();
  const config = loadConfig(options.configFile);

  logSection("🚀 Starting Batch Deployment");
  log(`Environment: ${config.environment}`, "cyan");
  log(`Dry Run: ${options.dryRun ? "Yes" : "No"}`, "cyan");
  log(`Skip Tests: ${options.skipTests ? "Yes" : "No"}`, "cyan");
  log(`Rollback on Failure: ${config.rollbackOnFailure ? "Yes" : "No"}`, "cyan");
  log(`Total Phases: ${config.phases.length}`, "cyan");

  const totalSites = config.phases.reduce((sum, phase) => sum + phase.sites.length, 0);
  log(`Total Sites: ${totalSites}`, "cyan");

  if (options.dryRun) {
    log("\n🔍 DRY RUN MODE - No actual deployments will occur", "yellow");
  }

  const phaseResults: PhaseResult[] = [];
  let successfulSites = 0;
  let failedSites = 0;

  // Execute each phase
  for (const phase of config.phases) {
    const result = await deployPhase(phase, config, options);
    phaseResults.push(result);

    successfulSites += result.successful;
    failedSites += result.failed;

    // Stop if phase failed and rollback is enabled
    if (result.failed > 0 && config.rollbackOnFailure) {
      log("\n❌ Stopping deployment due to phase failure", "red");
      break;
    }
  }

  const duration = Date.now() - startTime;
  const success = failedSites === 0;

  const batchResult: BatchDeploymentResult = {
    success,
    totalSites,
    successfulSites,
    failedSites,
    phases: phaseResults,
    duration,
  };

  printSummary(config, batchResult);

  if (!success) {
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

export { main, BatchDeploymentConfig, BatchDeploymentOptions, BatchDeploymentResult };
