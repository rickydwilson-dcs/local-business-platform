#!/usr/bin/env node
/**
 * External Services Sync CLI
 *
 * Syncs data from external services (Vercel, NewRelic) into the Supabase registry.
 * This tool enables centralized monitoring and tracking of deployments and performance metrics.
 *
 * Commands:
 * - sync-vercel <slug>     - Sync deployments for a single site from Vercel API
 * - sync-vercel-all        - Sync deployments for all sites with Vercel project IDs
 * - sync-newrelic <slug>   - Sync metrics for a single site from NewRelic API
 * - sync-newrelic-all      - Sync metrics for all sites with NewRelic app IDs
 * - sync-all               - Run all syncs (Vercel + NewRelic)
 *
 * Environment Variables Required:
 * - VERCEL_TOKEN           - Vercel API token
 * - VERCEL_TEAM_ID         - Vercel team ID (optional for personal accounts)
 * - NEW_RELIC_API_KEY      - NewRelic API key (User key, not Ingest key)
 * - NEW_RELIC_ACCOUNT_ID   - NewRelic account ID
 * - SUPABASE_URL           - Supabase project URL
 * - SUPABASE_SERVICE_KEY   - Supabase service role key
 *
 * Usage:
 *   pnpm sync:vercel colossus-reference
 *   pnpm sync:vercel-all
 *   pnpm sync:newrelic colossus-reference
 *   pnpm sync:newrelic-all
 *   pnpm sync:all
 *   pnpm sync:all --dry-run
 */

import { Command } from "commander";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// ============================================================================
// Types
// ============================================================================

/**
 * Vercel deployment from API response
 */
interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  created: number;
  buildingAt?: number;
  ready?: number;
  meta?: {
    githubCommitSha?: string;
    githubCommitRef?: string;
    gitlabCommitSha?: string;
    gitlabCommitRef?: string;
    bitbucketCommitSha?: string;
    bitbucketCommitRef?: string;
  };
  target?: "production" | "preview" | null;
  projectId?: string;
}

/**
 * Vercel API list deployments response
 */
interface VercelDeploymentsResponse {
  deployments: VercelDeployment[];
  pagination?: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

/**
 * NewRelic NRQL query result
 */
interface NewRelicNRQLResult {
  results: Array<{
    average?: number;
    percentile?: number;
    count?: number;
    sum?: number;
    [key: string]: unknown;
  }>;
  performanceStats?: {
    inspectedCount: number;
  };
}

/**
 * NewRelic GraphQL response
 */
interface NewRelicGraphQLResponse {
  data?: {
    actor?: {
      account?: {
        nrql?: {
          results: Array<Record<string, unknown>>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Sync result for tracking success/failure
 */
interface SyncResult {
  slug: string;
  success: boolean;
  message: string;
  deploymentsCreated?: number;
  metricsUpserted?: number;
}

// ============================================================================
// ANSI Color Helpers
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground colors
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

/**
 * Apply color to text
 */
function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Bold text
 */
function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

/**
 * Dim text
 */
function dim(text: string): string {
  return `${colors.dim}${text}${colors.reset}`;
}

// ============================================================================
// Lazy Registry Loader
// ============================================================================

// Lazy load registry to avoid initialization errors when using --help
let _registry: Awaited<typeof import("./lib/supabase-client")>["registry"] | null = null;

/**
 * Get the registry client (lazy loaded)
 * This prevents errors when running --help without environment variables
 */
async function getRegistry() {
  if (!_registry) {
    const { registry } = await import("./lib/supabase-client");
    _registry = registry;
  }
  return _registry;
}

// ============================================================================
// Environment Validation
// ============================================================================

/**
 * Validate required environment variables
 */
function validateEnv(service: "vercel" | "newrelic" | "supabase"): boolean {
  const required: Record<string, string[]> = {
    vercel: ["VERCEL_TOKEN"],
    newrelic: ["NEW_RELIC_API_KEY", "NEW_RELIC_ACCOUNT_ID"],
    supabase: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
  };

  const missing = required[service].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(colorize(`\n   Missing required environment variables for ${service}:`, "red"));
    missing.forEach((key) => {
      console.error(colorize(`     - ${key}`, "red"));
    });
    return false;
  }

  return true;
}

// ============================================================================
// Vercel API Client
// ============================================================================

/**
 * Fetch deployments from Vercel API for a project
 * @param projectId - Vercel project ID or name
 * @param limit - Maximum number of deployments to fetch
 */
async function fetchVercelDeployments(projectId: string, limit = 20): Promise<VercelDeployment[]> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) {
    throw new Error("VERCEL_TOKEN environment variable is required");
  }

  // Build URL with query parameters
  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("limit", limit.toString());

  // Add team ID if provided (required for team projects)
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After") || "60";
    throw new Error(`Vercel API rate limited. Retry after ${retryAfter} seconds.`);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Vercel API error (${response.status}): ${errorBody}`);
  }

  const data: VercelDeploymentsResponse = await response.json();
  return data.deployments || [];
}

/**
 * Map Vercel deployment state to our DeploymentStatus
 */
function mapVercelStatus(
  state: VercelDeployment["state"]
): "building" | "ready" | "error" | "canceled" {
  switch (state) {
    case "READY":
      return "ready";
    case "ERROR":
      return "error";
    case "CANCELED":
      return "canceled";
    case "BUILDING":
    case "INITIALIZING":
    case "QUEUED":
    default:
      return "building";
  }
}

/**
 * Extract git info from Vercel deployment meta
 */
function extractGitInfo(deployment: VercelDeployment): {
  branch: string;
  sha: string;
} {
  const meta = deployment.meta || {};

  // Try GitHub first, then GitLab, then Bitbucket
  const sha = meta.githubCommitSha || meta.gitlabCommitSha || meta.bitbucketCommitSha || "unknown";
  const branch =
    meta.githubCommitRef || meta.gitlabCommitRef || meta.bitbucketCommitRef || "unknown";

  return { branch, sha };
}

/**
 * Calculate build time from Vercel deployment timestamps
 */
function calculateBuildTime(deployment: VercelDeployment): number | undefined {
  if (deployment.buildingAt && deployment.ready) {
    return deployment.ready - deployment.buildingAt;
  }
  return undefined;
}

// ============================================================================
// NewRelic API Client
// ============================================================================

/**
 * Execute a NRQL query against NewRelic
 * @param nrql - NRQL query string
 */
async function executeNRQLQuery(nrql: string): Promise<NewRelicNRQLResult["results"]> {
  const apiKey = process.env.NEW_RELIC_API_KEY;
  const accountId = process.env.NEW_RELIC_ACCOUNT_ID;

  if (!apiKey || !accountId) {
    throw new Error(
      "NEW_RELIC_API_KEY and NEW_RELIC_ACCOUNT_ID environment variables are required"
    );
  }

  // Use NewRelic GraphQL API (NerdGraph)
  const query = `
    {
      actor {
        account(id: ${accountId}) {
          nrql(query: "${nrql.replace(/"/g, '\\"')}") {
            results
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.newrelic.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": apiKey,
    },
    body: JSON.stringify({ query }),
  });

  // Handle rate limiting
  if (response.status === 429) {
    throw new Error("NewRelic API rate limited. Please try again later.");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NewRelic API error (${response.status}): ${errorBody}`);
  }

  const data: NewRelicGraphQLResponse = await response.json();

  // Check for GraphQL errors
  if (data.errors && data.errors.length > 0) {
    throw new Error(`NewRelic GraphQL error: ${data.errors[0].message}`);
  }

  return data.data?.actor?.account?.nrql?.results || [];
}

/**
 * Fetch daily metrics from NewRelic for an application
 * @param appName - NewRelic application name
 * @param date - Date to fetch metrics for (YYYY-MM-DD)
 */
async function fetchNewRelicMetrics(
  appName: string,
  date: string
): Promise<{
  responseTimeAvgMs: number | null;
  responseTimeP95Ms: number | null;
  errorRatePercent: number | null;
  throughputRpm: number | null;
  apdexScore: number | null;
  pageViews: number | null;
  uniqueVisitors: number | null;
}> {
  // NRQL query to get web transaction metrics for a specific day
  // We use multiple queries to get different metrics
  const startTime = `${date} 00:00:00`;
  const endTime = `${date} 23:59:59`;

  // Query for response time (average and p95)
  const responseTimeQuery = `
    SELECT average(duration) * 1000 as avgMs, percentile(duration, 95) * 1000 as p95Ms
    FROM Transaction
    WHERE appName = '${appName}'
    AND transactionType = 'Web'
    SINCE '${startTime}' UNTIL '${endTime}'
  `;

  // Query for error rate
  const errorRateQuery = `
    SELECT percentage(count(*), WHERE error IS true) as errorRate
    FROM Transaction
    WHERE appName = '${appName}'
    AND transactionType = 'Web'
    SINCE '${startTime}' UNTIL '${endTime}'
  `;

  // Query for throughput (requests per minute)
  const throughputQuery = `
    SELECT rate(count(*), 1 minute) as rpm
    FROM Transaction
    WHERE appName = '${appName}'
    AND transactionType = 'Web'
    SINCE '${startTime}' UNTIL '${endTime}'
  `;

  // Query for Apdex score
  const apdexQuery = `
    SELECT apdex(duration, t: 0.5) as apdex
    FROM Transaction
    WHERE appName = '${appName}'
    AND transactionType = 'Web'
    SINCE '${startTime}' UNTIL '${endTime}'
  `;

  // Query for page views and unique visitors (from Browser)
  const browserQuery = `
    SELECT count(*) as pageViews, uniqueCount(session) as uniqueVisitors
    FROM PageView
    WHERE appName = '${appName}'
    SINCE '${startTime}' UNTIL '${endTime}'
  `;

  try {
    // Execute queries in parallel for better performance
    const [responseTimeResults, errorRateResults, throughputResults, apdexResults, browserResults] =
      await Promise.all([
        executeNRQLQuery(responseTimeQuery).catch(() => []),
        executeNRQLQuery(errorRateQuery).catch(() => []),
        executeNRQLQuery(throughputQuery).catch(() => []),
        executeNRQLQuery(apdexQuery).catch(() => []),
        executeNRQLQuery(browserQuery).catch(() => []),
      ]);

    // Extract values from results (NewRelic returns arrays)
    const responseTime = responseTimeResults[0] || {};
    const errorRate = errorRateResults[0] || {};
    const throughput = throughputResults[0] || {};
    const apdex = apdexResults[0] || {};
    const browser = browserResults[0] || {};

    return {
      responseTimeAvgMs: (responseTime.avgMs as number) || null,
      responseTimeP95Ms: (responseTime.p95Ms as number) || null,
      errorRatePercent: (errorRate.errorRate as number) || null,
      throughputRpm: (throughput.rpm as number) || null,
      apdexScore: (apdex.apdex as number) || null,
      pageViews: (browser.pageViews as number) || null,
      uniqueVisitors: (browser.uniqueVisitors as number) || null,
    };
  } catch (error) {
    // If queries fail, return nulls
    console.error(dim(`    Warning: Could not fetch some metrics: ${error}`));
    return {
      responseTimeAvgMs: null,
      responseTimeP95Ms: null,
      errorRatePercent: null,
      throughputRpm: null,
      apdexScore: null,
      pageViews: null,
      uniqueVisitors: null,
    };
  }
}

// ============================================================================
// Sync Functions
// ============================================================================

/**
 * Sync Vercel deployments for a single site
 */
async function syncVercelSite(slug: string, dryRun: boolean): Promise<SyncResult> {
  const registry = await getRegistry();

  try {
    // Get site from registry
    const site = await registry.getSite(slug);
    if (!site) {
      return {
        slug,
        success: false,
        message: "Site not found in registry",
      };
    }

    // Check if site has Vercel project ID
    if (!site.vercel_project_id) {
      return {
        slug,
        success: false,
        message: "No Vercel project ID configured for this site",
      };
    }

    console.log(
      `  ${colorize("->", "cyan")} Fetching deployments for ${bold(site.name)} (${site.vercel_project_id})...`
    );

    // Fetch deployments from Vercel
    const deployments = await fetchVercelDeployments(site.vercel_project_id, 20);

    if (deployments.length === 0) {
      return {
        slug,
        success: true,
        message: "No deployments found",
        deploymentsCreated: 0,
      };
    }

    // Get existing deployments to avoid duplicates
    const existingDeployments = await registry.getRecentDeployments(slug, 100);
    const existingIds = new Set(existingDeployments.map((d) => d.deployment_id));

    let created = 0;

    for (const deployment of deployments) {
      // Skip if already exists
      if (existingIds.has(deployment.uid)) {
        continue;
      }

      const gitInfo = extractGitInfo(deployment);
      const buildTime = calculateBuildTime(deployment);

      if (dryRun) {
        console.log(
          dim(
            `    [DRY RUN] Would create deployment: ${deployment.uid.slice(0, 12)} (${deployment.state})`
          )
        );
        created++;
        continue;
      }

      // Create deployment record
      await registry.createDeployment({
        site_slug: slug,
        deployment_id: deployment.uid,
        url: `https://${deployment.url}`,
        status: mapVercelStatus(deployment.state),
        build_time_ms: buildTime,
        git_branch: gitInfo.branch,
        git_commit_sha: gitInfo.sha,
        environment: deployment.target === "production" ? "production" : "preview",
      });

      created++;
    }

    return {
      slug,
      success: true,
      message: `Synced ${created} new deployments`,
      deploymentsCreated: created,
    };
  } catch (error) {
    return {
      slug,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sync NewRelic metrics for a single site
 */
async function syncNewRelicSite(slug: string, dryRun: boolean, days = 7): Promise<SyncResult> {
  const registry = await getRegistry();

  try {
    // Get site from registry
    const site = await registry.getSite(slug);
    if (!site) {
      return {
        slug,
        success: false,
        message: "Site not found in registry",
      };
    }

    // Check if site has NewRelic app ID
    if (!site.newrelic_app_id) {
      return {
        slug,
        success: false,
        message: "No NewRelic app ID configured for this site",
      };
    }

    console.log(
      `  ${colorize("->", "cyan")} Fetching metrics for ${bold(site.name)} (${site.newrelic_app_id})...`
    );

    let upserted = 0;

    // Fetch metrics for each day
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Fetch metrics from NewRelic
      const metrics = await fetchNewRelicMetrics(site.newrelic_app_id, dateStr);

      // Skip if no data
      if (
        metrics.responseTimeAvgMs === null &&
        metrics.pageViews === null &&
        metrics.throughputRpm === null
      ) {
        continue;
      }

      if (dryRun) {
        console.log(
          dim(
            `    [DRY RUN] Would upsert metrics for ${dateStr}: avg=${metrics.responseTimeAvgMs?.toFixed(0)}ms, views=${metrics.pageViews}`
          )
        );
        upserted++;
        continue;
      }

      // Upsert metrics
      await registry.upsertMetrics({
        site_slug: slug,
        date: dateStr,
        response_time_avg_ms: metrics.responseTimeAvgMs ?? undefined,
        response_time_p95_ms: metrics.responseTimeP95Ms ?? undefined,
        error_rate_percent: metrics.errorRatePercent ?? undefined,
        throughput_rpm: metrics.throughputRpm ?? undefined,
        apdex_score: metrics.apdexScore ?? undefined,
        page_views: metrics.pageViews ?? undefined,
        unique_visitors: metrics.uniqueVisitors ?? undefined,
      });

      upserted++;
    }

    return {
      slug,
      success: true,
      message: `Synced ${upserted} days of metrics`,
      metricsUpserted: upserted,
    };
  } catch (error) {
    return {
      slug,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// Command Implementations
// ============================================================================

/**
 * Sync Vercel deployments for a single site
 */
async function syncVercelCommand(slug: string, options: { dryRun?: boolean }) {
  console.log(colorize("\n🔄 Syncing Vercel deployments...\n", "cyan"));

  // Validate environment
  if (!validateEnv("vercel") || !validateEnv("supabase")) {
    process.exit(1);
  }

  const result = await syncVercelSite(slug, options.dryRun || false);

  if (result.success) {
    console.log(colorize(`\n   ✅ ${result.slug}: ${result.message}`, "green"));
  } else {
    console.log(colorize(`\n   ❌ ${result.slug}: ${result.message}`, "red"));
    process.exit(1);
  }
}

/**
 * Sync Vercel deployments for all sites
 */
async function syncVercelAllCommand(options: { dryRun?: boolean }) {
  console.log(colorize("\n🔄 Syncing Vercel deployments for all sites...\n", "cyan"));

  // Validate environment
  if (!validateEnv("vercel") || !validateEnv("supabase")) {
    process.exit(1);
  }

  const registry = await getRegistry();
  const sites = await registry.listSites({ status: "active" });

  // Filter to sites with Vercel project IDs
  const sitesWithVercel = sites.filter((s) => s.vercel_project_id);

  if (sitesWithVercel.length === 0) {
    console.log(colorize("   No sites with Vercel project IDs found.", "yellow"));
    return;
  }

  console.log(dim(`   Found ${sitesWithVercel.length} sites with Vercel projects\n`));

  const results: SyncResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  let totalDeployments = 0;

  for (const site of sitesWithVercel) {
    const result = await syncVercelSite(site.slug, options.dryRun || false);
    results.push(result);

    if (result.success) {
      successCount++;
      totalDeployments += result.deploymentsCreated || 0;
      console.log(colorize(`   ✅ ${site.name}: ${result.message}`, "green"));
    } else {
      errorCount++;
      console.log(colorize(`   ❌ ${site.name}: ${result.message}`, "red"));
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Summary
  console.log(colorize("\n📊 Sync Summary:", "cyan"));
  console.log(`   ${colorize(`✅ Success: ${successCount}`, "green")}`);
  if (errorCount > 0) {
    console.log(`   ${colorize(`❌ Errors: ${errorCount}`, "red")}`);
  }
  console.log(`   ${colorize(`📦 Total deployments synced: ${totalDeployments}`, "blue")}`);
  console.log("");
}

/**
 * Sync NewRelic metrics for a single site
 */
async function syncNewRelicCommand(slug: string, options: { dryRun?: boolean; days?: string }) {
  console.log(colorize("\n📈 Syncing NewRelic metrics...\n", "cyan"));

  // Validate environment
  if (!validateEnv("newrelic") || !validateEnv("supabase")) {
    process.exit(1);
  }

  const days = options.days ? parseInt(options.days, 10) : 7;
  const result = await syncNewRelicSite(slug, options.dryRun || false, days);

  if (result.success) {
    console.log(colorize(`\n   ✅ ${result.slug}: ${result.message}`, "green"));
  } else {
    console.log(colorize(`\n   ❌ ${result.slug}: ${result.message}`, "red"));
    process.exit(1);
  }
}

/**
 * Sync NewRelic metrics for all sites
 */
async function syncNewRelicAllCommand(options: { dryRun?: boolean; days?: string }) {
  console.log(colorize("\n📈 Syncing NewRelic metrics for all sites...\n", "cyan"));

  // Validate environment
  if (!validateEnv("newrelic") || !validateEnv("supabase")) {
    process.exit(1);
  }

  const registry = await getRegistry();
  const sites = await registry.listSites({ status: "active" });

  // Filter to sites with NewRelic app IDs
  const sitesWithNewRelic = sites.filter((s) => s.newrelic_app_id);

  if (sitesWithNewRelic.length === 0) {
    console.log(colorize("   No sites with NewRelic app IDs found.", "yellow"));
    return;
  }

  console.log(dim(`   Found ${sitesWithNewRelic.length} sites with NewRelic apps\n`));

  const days = options.days ? parseInt(options.days, 10) : 7;
  const results: SyncResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  let totalMetrics = 0;

  for (const site of sitesWithNewRelic) {
    const result = await syncNewRelicSite(site.slug, options.dryRun || false, days);
    results.push(result);

    if (result.success) {
      successCount++;
      totalMetrics += result.metricsUpserted || 0;
      console.log(colorize(`   ✅ ${site.name}: ${result.message}`, "green"));
    } else {
      errorCount++;
      console.log(colorize(`   ❌ ${site.name}: ${result.message}`, "red"));
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log(colorize("\n📊 Sync Summary:", "cyan"));
  console.log(`   ${colorize(`✅ Success: ${successCount}`, "green")}`);
  if (errorCount > 0) {
    console.log(`   ${colorize(`❌ Errors: ${errorCount}`, "red")}`);
  }
  console.log(`   ${colorize(`📈 Total metric days synced: ${totalMetrics}`, "blue")}`);
  console.log("");
}

/**
 * Sync all external services
 */
async function syncAllCommand(options: { dryRun?: boolean; days?: string }) {
  console.log(colorize("\n🔄 Syncing all external services...\n", "cyan"));

  // Validate all environments
  const hasVercel = validateEnv("vercel");
  const hasNewRelic = validateEnv("newrelic");

  if (!validateEnv("supabase")) {
    process.exit(1);
  }

  if (!hasVercel && !hasNewRelic) {
    console.error(
      colorize(
        "\n   No external service credentials configured. Set VERCEL_TOKEN or NEW_RELIC_API_KEY.",
        "red"
      )
    );
    process.exit(1);
  }

  // Sync Vercel if configured
  if (hasVercel) {
    console.log(colorize("\n--- Vercel Deployments ---\n", "magenta"));
    await syncVercelAllCommand(options);
  } else {
    console.log(dim("\n   Skipping Vercel (not configured)\n"));
  }

  // Sync NewRelic if configured
  if (hasNewRelic) {
    console.log(colorize("\n--- NewRelic Metrics ---\n", "magenta"));
    await syncNewRelicAllCommand(options);
  } else {
    console.log(dim("\n   Skipping NewRelic (not configured)\n"));
  }

  console.log(colorize("\n✨ All syncs complete!\n", "green"));
}

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command();

program
  .name("sync-external-services")
  .description("Sync data from external services (Vercel, NewRelic) into the registry")
  .version("1.0.0");

// Command: sync-vercel <slug>
program
  .command("sync-vercel <slug>")
  .description("Sync Vercel deployments for a single site")
  .option("--dry-run", "Preview changes without writing to database")
  .action(async (slug: string, options) => {
    await syncVercelCommand(slug, options);
  });

// Command: sync-vercel-all
program
  .command("sync-vercel-all")
  .description("Sync Vercel deployments for all sites with Vercel project IDs")
  .option("--dry-run", "Preview changes without writing to database")
  .action(async (options) => {
    await syncVercelAllCommand(options);
  });

// Command: sync-newrelic <slug>
program
  .command("sync-newrelic <slug>")
  .description("Sync NewRelic metrics for a single site")
  .option("--dry-run", "Preview changes without writing to database")
  .option("--days <number>", "Number of days to sync (default: 7)", "7")
  .action(async (slug: string, options) => {
    await syncNewRelicCommand(slug, options);
  });

// Command: sync-newrelic-all
program
  .command("sync-newrelic-all")
  .description("Sync NewRelic metrics for all sites with NewRelic app IDs")
  .option("--dry-run", "Preview changes without writing to database")
  .option("--days <number>", "Number of days to sync (default: 7)", "7")
  .action(async (options) => {
    await syncNewRelicAllCommand(options);
  });

// Command: sync-all
program
  .command("sync-all")
  .description("Run all syncs (Vercel deployments + NewRelic metrics)")
  .option("--dry-run", "Preview changes without writing to database")
  .option("--days <number>", "Number of days for metrics sync (default: 7)", "7")
  .action(async (options) => {
    await syncAllCommand(options);
  });

// Parse command line arguments
program.parse();
