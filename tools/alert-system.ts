#!/usr/bin/env node
/**
 * Alert System CLI
 *
 * Automated monitoring and alerting system for the site registry.
 * Checks for build failures, deployment errors, high error rates,
 * and performance degradation across all monitored sites.
 *
 * Commands:
 * - check [slug]    - Run alert checks (all sites or specific site)
 * - list [slug]     - List active/unresolved alerts
 * - ack <alert-id>  - Acknowledge an alert
 * - resolve <id>    - Resolve an alert
 * - notify          - Send email notifications for unnotified alerts
 *
 * Usage:
 *   pnpm alerts:check                    # Check all sites
 *   pnpm alerts:check colossus-reference # Check specific site
 *   pnpm alerts:list                     # List all active alerts
 *   pnpm alerts:list --severity critical # Filter by severity
 *   pnpm alerts:ack <alert-id>           # Acknowledge alert
 *   pnpm alerts:resolve <alert-id>       # Resolve alert
 *   pnpm alerts:notify                   # Send pending notifications
 *
 * Environment Variables:
 *   SUPABASE_URL        - Supabase project URL
 *   SUPABASE_SERVICE_KEY - Supabase service role key
 *   RESEND_API_KEY      - Resend API key for email notifications
 *   ALERT_EMAIL         - Email address to receive alerts
 *
 * Alert Types:
 *   - build_failure: Recent CI/CD build failed
 *   - deploy_failure: Vercel deployment errored
 *   - high_error_rate: Error rate exceeded threshold (>1% warning, >5% critical)
 *   - performance_degradation: Response time >2000ms average
 *
 * @author Claude Code
 * @version 1.0.0
 */

import { Command } from "commander";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Alert check result - represents a potential issue found during checks
 */
interface AlertCheckResult {
  siteSlug: string;
  siteName: string;
  type: "deployment" | "build" | "performance" | "error_rate";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  metadata: Record<string, unknown>;
}

/**
 * Extended Alert type with site information for display
 */
interface AlertWithSite {
  id: string;
  site_id: string;
  site_slug?: string;
  site_name?: string;
  type: string;
  severity: string;
  status: string;
  message: string;
  metadata: Record<string, unknown> | null;
  notified_at: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Resend API email payload
 */
interface ResendEmailPayload {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}

// ============================================================================
// Color Utilities (ANSI escape codes for terminal output)
// ============================================================================

/**
 * Terminal color utilities for consistent output formatting
 * Uses ANSI escape codes for broad compatibility
 */
const colors = {
  // Text colors
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,

  // Text styles
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,

  // Combined styles
  boldRed: (text: string) => `\x1b[1m\x1b[31m${text}\x1b[0m`,
  boldGreen: (text: string) => `\x1b[1m\x1b[32m${text}\x1b[0m`,
  boldYellow: (text: string) => `\x1b[1m\x1b[33m${text}\x1b[0m`,
  boldBlue: (text: string) => `\x1b[1m\x1b[34m${text}\x1b[0m`,
};

/**
 * Get color function based on severity level
 * @param severity - Alert severity level
 * @returns Color function for the severity
 */
function getSeverityColor(severity: string): (text: string) => string {
  switch (severity) {
    case "critical":
      return colors.boldRed;
    case "high":
      return colors.red;
    case "medium":
    case "warning":
      return colors.yellow;
    case "low":
    case "info":
      return colors.blue;
    default:
      return colors.gray;
  }
}

/**
 * Get status color based on alert status
 * @param status - Alert status
 * @returns Color function for the status
 */
function getStatusColor(status: string): (text: string) => string {
  switch (status) {
    case "active":
      return colors.red;
    case "acknowledged":
      return colors.yellow;
    case "resolved":
      return colors.green;
    default:
      return colors.gray;
  }
}

// ============================================================================
// Lazy Loading - Registry Client
// ============================================================================

/**
 * Registry client instance - lazy loaded to avoid initialization errors
 * when running --help or other commands that don't need database access
 */
let _registry: InstanceType<typeof import("./lib/supabase-client").RegistryClient> | null = null;

/**
 * Get the registry client instance, initializing if needed
 * This pattern avoids errors when SUPABASE_URL is not set (e.g., --help)
 * @returns Registry client instance
 * @throws Error if Supabase credentials are missing
 */
function getRegistry() {
  if (!_registry) {
    // Dynamically import to avoid initialization at module load time
    const { RegistryClient } = require("./lib/supabase-client");
    _registry = new RegistryClient();
  }
  return _registry;
}

// ============================================================================
// Alert Check Functions
// ============================================================================

/**
 * Check for recent build failures in the last 24 hours
 * @param siteSlug - Site slug to check
 * @param siteName - Site name for alert message
 * @returns Array of alert check results for failed builds
 */
async function checkBuildFailures(siteSlug: string, siteName: string): Promise<AlertCheckResult[]> {
  const alerts: AlertCheckResult[] = [];
  const registry = getRegistry();

  try {
    // Get recent builds (last 10)
    const builds = await registry.getRecentBuilds(siteSlug, 10);

    // Filter to builds from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentFailedBuilds = builds.filter((build) => {
      const buildDate = new Date(build.created_at);
      return build.status === "failed" && buildDate > twentyFourHoursAgo;
    });

    // Create alert for each failed build (deduplicate by run_id)
    const seenRunIds = new Set<string>();
    for (const build of recentFailedBuilds) {
      if (seenRunIds.has(build.run_id)) continue;
      seenRunIds.add(build.run_id);

      alerts.push({
        siteSlug,
        siteName,
        type: "build",
        severity: "medium", // Build failures are warning-level
        message: `Build failed: ${build.workflow} on branch ${build.git_branch} (run: ${build.run_id.slice(0, 8)})`,
        metadata: {
          run_id: build.run_id,
          workflow: build.workflow,
          git_branch: build.git_branch,
          git_commit_sha: build.git_commit_sha,
          checks_passed: build.checks_passed,
          created_at: build.created_at,
        },
      });
    }
  } catch (error) {
    // Log but don't fail - site may not have builds yet
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error(
        colors.dim(`  Warning: Could not check builds for ${siteSlug}: ${error.message}`)
      );
    }
  }

  return alerts;
}

/**
 * Check for recent deployment failures in the last 24 hours
 * @param siteSlug - Site slug to check
 * @param siteName - Site name for alert message
 * @returns Array of alert check results for failed deployments
 */
async function checkDeploymentFailures(
  siteSlug: string,
  siteName: string
): Promise<AlertCheckResult[]> {
  const alerts: AlertCheckResult[] = [];
  const registry = getRegistry();

  try {
    // Get recent deployments (last 10)
    const deployments = await registry.getRecentDeployments(siteSlug, 10);

    // Filter to deployments from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentFailedDeployments = deployments.filter((deployment) => {
      const deployDate = new Date(deployment.created_at);
      return deployment.status === "error" && deployDate > twentyFourHoursAgo;
    });

    // Create alert for each failed deployment
    const seenDeploymentIds = new Set<string>();
    for (const deployment of recentFailedDeployments) {
      if (seenDeploymentIds.has(deployment.deployment_id)) continue;
      seenDeploymentIds.add(deployment.deployment_id);

      alerts.push({
        siteSlug,
        siteName,
        type: "deployment",
        severity: "critical", // Deployment failures are critical
        message: `Deployment failed: ${deployment.environment} environment on branch ${deployment.git_branch}`,
        metadata: {
          deployment_id: deployment.deployment_id,
          url: deployment.url,
          environment: deployment.environment,
          git_branch: deployment.git_branch,
          git_commit_sha: deployment.git_commit_sha,
          created_at: deployment.created_at,
        },
      });
    }
  } catch (error) {
    // Log but don't fail - site may not have deployments yet
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error(
        colors.dim(`  Warning: Could not check deployments for ${siteSlug}: ${error.message}`)
      );
    }
  }

  return alerts;
}

/**
 * Check for high error rates in the last 24 hours
 * Thresholds:
 * - Critical: >5% error rate
 * - Warning: >1% error rate
 * @param siteSlug - Site slug to check
 * @param siteName - Site name for alert message
 * @returns Array of alert check results for high error rates
 */
async function checkHighErrorRate(siteSlug: string, siteName: string): Promise<AlertCheckResult[]> {
  const alerts: AlertCheckResult[] = [];
  const registry = getRegistry();

  // Thresholds for error rate alerts
  const CRITICAL_ERROR_RATE = 5.0; // 5%
  const WARNING_ERROR_RATE = 1.0; // 1%

  try {
    // Get metrics for last 1 day
    const metrics = await registry.getMetrics(siteSlug, 1);

    if (metrics.length === 0) {
      return alerts; // No metrics available
    }

    // Get the most recent metric (should be today or yesterday)
    const latestMetric = metrics[0];

    if (latestMetric.error_rate_percent === null) {
      return alerts; // No error rate data
    }

    const errorRate = latestMetric.error_rate_percent;

    if (errorRate > CRITICAL_ERROR_RATE) {
      alerts.push({
        siteSlug,
        siteName,
        type: "error_rate",
        severity: "critical",
        message: `Critical error rate: ${errorRate.toFixed(2)}% (threshold: ${CRITICAL_ERROR_RATE}%)`,
        metadata: {
          error_rate_percent: errorRate,
          threshold: CRITICAL_ERROR_RATE,
          date: latestMetric.date,
          throughput_rpm: latestMetric.throughput_rpm,
        },
      });
    } else if (errorRate > WARNING_ERROR_RATE) {
      alerts.push({
        siteSlug,
        siteName,
        type: "error_rate",
        severity: "medium",
        message: `Elevated error rate: ${errorRate.toFixed(2)}% (threshold: ${WARNING_ERROR_RATE}%)`,
        metadata: {
          error_rate_percent: errorRate,
          threshold: WARNING_ERROR_RATE,
          date: latestMetric.date,
          throughput_rpm: latestMetric.throughput_rpm,
        },
      });
    }
  } catch (error) {
    // Log but don't fail - site may not have metrics yet
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error(
        colors.dim(`  Warning: Could not check error rate for ${siteSlug}: ${error.message}`)
      );
    }
  }

  return alerts;
}

/**
 * Check for performance degradation (slow response times)
 * Threshold: >2000ms average response time
 * @param siteSlug - Site slug to check
 * @param siteName - Site name for alert message
 * @returns Array of alert check results for performance issues
 */
async function checkPerformanceDegradation(
  siteSlug: string,
  siteName: string
): Promise<AlertCheckResult[]> {
  const alerts: AlertCheckResult[] = [];
  const registry = getRegistry();

  // Threshold for response time (milliseconds)
  const RESPONSE_TIME_THRESHOLD = 2000; // 2 seconds

  try {
    // Get metrics for last 1 day
    const metrics = await registry.getMetrics(siteSlug, 1);

    if (metrics.length === 0) {
      return alerts; // No metrics available
    }

    // Get the most recent metric
    const latestMetric = metrics[0];

    if (latestMetric.response_time_avg_ms === null) {
      return alerts; // No response time data
    }

    const responseTime = latestMetric.response_time_avg_ms;

    if (responseTime > RESPONSE_TIME_THRESHOLD) {
      alerts.push({
        siteSlug,
        siteName,
        type: "performance",
        severity: "medium", // Performance issues are warning-level
        message: `Slow response time: ${responseTime.toFixed(0)}ms average (threshold: ${RESPONSE_TIME_THRESHOLD}ms)`,
        metadata: {
          response_time_avg_ms: responseTime,
          response_time_p95_ms: latestMetric.response_time_p95_ms,
          threshold: RESPONSE_TIME_THRESHOLD,
          date: latestMetric.date,
          apdex_score: latestMetric.apdex_score,
        },
      });
    }
  } catch (error) {
    // Log but don't fail - site may not have metrics yet
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error(
        colors.dim(`  Warning: Could not check performance for ${siteSlug}: ${error.message}`)
      );
    }
  }

  return alerts;
}

/**
 * Run all alert checks for a single site
 * @param siteSlug - Site slug to check
 * @param siteName - Site name for alert messages
 * @returns Array of all alert check results
 */
async function runAllChecksForSite(
  siteSlug: string,
  siteName: string
): Promise<AlertCheckResult[]> {
  const allAlerts: AlertCheckResult[] = [];

  // Run all checks in parallel for efficiency
  const [buildAlerts, deployAlerts, errorRateAlerts, perfAlerts] = await Promise.all([
    checkBuildFailures(siteSlug, siteName),
    checkDeploymentFailures(siteSlug, siteName),
    checkHighErrorRate(siteSlug, siteName),
    checkPerformanceDegradation(siteSlug, siteName),
  ]);

  allAlerts.push(...buildAlerts, ...deployAlerts, ...errorRateAlerts, ...perfAlerts);

  return allAlerts;
}

// ============================================================================
// Email Notification Functions
// ============================================================================

/**
 * Send email notification using Resend API
 * @param alert - Alert to send notification for
 * @returns True if notification sent successfully
 */
async function sendEmailNotification(alert: AlertWithSite): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;

  if (!resendApiKey) {
    console.error(colors.red("  RESEND_API_KEY environment variable is not set"));
    return false;
  }

  if (!alertEmail) {
    console.error(colors.red("  ALERT_EMAIL environment variable is not set"));
    return false;
  }

  // Build email content
  const severityEmoji = alert.severity === "critical" ? "!!" : alert.severity === "high" ? "!" : "";
  const subject = `[${alert.severity.toUpperCase()}${severityEmoji}] ${alert.site_name || alert.site_slug || "Unknown Site"}: ${alert.type} Alert`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${alert.severity === "critical" ? "#dc2626" : alert.severity === "high" ? "#ea580c" : "#d97706"}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 18px; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .badge-critical { background: #fee2e2; color: #dc2626; }
    .badge-high { background: #ffedd5; color: #ea580c; }
    .badge-medium { background: #fef3c7; color: #d97706; }
    .badge-low { background: #dbeafe; color: #2563eb; }
    .detail { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .detail-label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .detail-value { margin-top: 4px; }
    .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Alert: ${alert.type.replace("_", " ").toUpperCase()}</h1>
    </div>
    <div class="content">
      <p><span class="badge badge-${alert.severity}">${alert.severity}</span></p>

      <div class="detail">
        <div class="detail-label">Site</div>
        <div class="detail-value">${alert.site_name || alert.site_slug || "Unknown"}</div>
      </div>

      <div class="detail">
        <div class="detail-label">Message</div>
        <div class="detail-value">${alert.message}</div>
      </div>

      <div class="detail">
        <div class="detail-label">Alert ID</div>
        <div class="detail-value"><code>${alert.id}</code></div>
      </div>

      <div class="detail">
        <div class="detail-label">Created At</div>
        <div class="detail-value">${new Date(alert.created_at).toLocaleString()}</div>
      </div>

      ${
        alert.metadata
          ? `
      <div class="detail">
        <div class="detail-label">Additional Details</div>
        <div class="detail-value"><pre style="margin: 0; font-size: 12px; overflow-x: auto;">${JSON.stringify(alert.metadata, null, 2)}</pre></div>
      </div>
      `
          : ""
      }

      <div class="footer">
        <p>This alert was generated by the Site Registry Alert System.</p>
        <p>To acknowledge: <code>pnpm alerts:ack ${alert.id}</code></p>
        <p>To resolve: <code>pnpm alerts:resolve ${alert.id}</code></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const payload: ResendEmailPayload = {
    from: "Site Registry Alerts <alerts@resend.dev>",
    to: alertEmail,
    subject,
    html,
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(colors.red(`  Failed to send email: ${response.status} ${errorText}`));
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      colors.red(`  Email send error: ${error instanceof Error ? error.message : "Unknown error"}`)
    );
    return false;
  }
}

// ============================================================================
// Duplicate Alert Detection
// ============================================================================

/**
 * Check if a similar alert already exists (active or acknowledged)
 * Prevents creating duplicate alerts for the same issue
 * @param siteSlug - Site slug
 * @param type - Alert type
 * @param metadata - Alert metadata (used for matching)
 * @returns True if a similar active alert exists
 */
async function isDuplicateAlert(
  siteSlug: string,
  type: string,
  metadata: Record<string, unknown>
): Promise<boolean> {
  const registry = getRegistry();

  try {
    // Get active alerts for this site
    const activeAlerts = await registry.getActiveAlerts(siteSlug);

    // Check for matching alert (same type and similar metadata)
    for (const alert of activeAlerts) {
      if (alert.type !== type) continue;

      // For builds, match by run_id
      if (type === "build" && alert.metadata?.run_id === metadata.run_id) {
        return true;
      }

      // For deployments, match by deployment_id
      if (type === "deployment" && alert.metadata?.deployment_id === metadata.deployment_id) {
        return true;
      }

      // For error_rate and performance, match by date (only one alert per day)
      if (
        (type === "error_rate" || type === "performance") &&
        alert.metadata?.date === metadata.date
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    // If we can't check, assume not duplicate to be safe
    return false;
  }
}

// ============================================================================
// Command Implementations
// ============================================================================

/**
 * Check command - Run alert checks for all sites or a specific site
 * @param slug - Optional site slug (if not provided, checks all sites)
 * @param options - Command options (dryRun, quiet)
 */
async function checkCommand(
  slug: string | undefined,
  options: { dryRun?: boolean; quiet?: boolean }
): Promise<void> {
  const registry = getRegistry();
  const { dryRun, quiet } = options;

  if (!quiet) {
    console.log(colors.cyan("\n[Alert System] Running alert checks...\n"));
    if (dryRun) {
      console.log(colors.yellow("  (dry-run mode - no alerts will be created)\n"));
    }
  }

  try {
    // Get sites to check
    let sites: Array<{ slug: string; name: string }>;

    if (slug) {
      // Single site
      const site = await registry.getSite(slug);
      if (!site) {
        console.error(colors.red(`Site not found: ${slug}`));
        process.exit(1);
      }
      sites = [{ slug: site.slug, name: site.name }];
    } else {
      // All active sites
      const allSites = await registry.listSites({ status: "active" });
      sites = allSites.map((s) => ({ slug: s.slug, name: s.name }));
    }

    if (!quiet) {
      console.log(colors.dim(`  Checking ${sites.length} site(s)...\n`));
    }

    let totalAlerts = 0;
    let newAlerts = 0;
    let duplicateAlerts = 0;

    // Check each site
    for (const site of sites) {
      if (!quiet) {
        process.stdout.write(`  Checking ${colors.bold(site.name)}... `);
      }

      // Run all checks for this site
      const alerts = await runAllChecksForSite(site.slug, site.name);

      if (alerts.length === 0) {
        if (!quiet) {
          console.log(colors.green("OK"));
        }
        continue;
      }

      totalAlerts += alerts.length;

      if (!quiet) {
        console.log(colors.yellow(`${alerts.length} issue(s) found`));
      }

      // Process each alert
      for (const alertResult of alerts) {
        // Check for duplicate
        const isDuplicate = await isDuplicateAlert(
          alertResult.siteSlug,
          alertResult.type,
          alertResult.metadata
        );

        if (isDuplicate) {
          duplicateAlerts++;
          if (!quiet) {
            console.log(colors.dim(`    - [SKIP] ${alertResult.message} (already exists)`));
          }
          continue;
        }

        // Create alert in database (unless dry-run)
        if (!dryRun) {
          try {
            await registry.createAlert({
              site_slug: alertResult.siteSlug,
              type: alertResult.type,
              severity: alertResult.severity,
              message: alertResult.message,
              metadata: alertResult.metadata,
            });
            newAlerts++;
          } catch (error) {
            console.error(
              colors.red(
                `    - [ERROR] Failed to create alert: ${error instanceof Error ? error.message : "Unknown error"}`
              )
            );
            continue;
          }
        } else {
          newAlerts++;
        }

        // Print alert details
        if (!quiet) {
          const severityColor = getSeverityColor(alertResult.severity);
          console.log(
            `    - ${severityColor(`[${alertResult.severity.toUpperCase()}]`)} ${alertResult.message}`
          );
        }
      }
    }

    // Summary
    if (!quiet) {
      console.log(colors.cyan("\n[Summary]"));
      console.log(`  Sites checked: ${sites.length}`);
      console.log(`  Issues found: ${totalAlerts}`);
      console.log(`  New alerts: ${dryRun ? `${newAlerts} (not created - dry run)` : newAlerts}`);
      console.log(`  Duplicates skipped: ${duplicateAlerts}`);
      console.log("");
    } else {
      // Quiet mode - only output if there are new alerts
      if (newAlerts > 0) {
        console.log(`${newAlerts} new alert(s) created`);
      }
    }
  } catch (error) {
    console.error(
      colors.red(
        `\nError running checks: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  }
}

/**
 * List command - List active/unresolved alerts
 * @param slug - Optional site slug to filter by
 * @param options - Command options (severity filter, format)
 */
async function listCommand(
  slug: string | undefined,
  options: { severity?: string; format?: "table" | "json" }
): Promise<void> {
  const registry = getRegistry();

  try {
    // Get active alerts
    let alerts = await registry.getActiveAlerts(slug);

    // Filter by severity if specified
    if (options.severity) {
      alerts = alerts.filter((a) => a.severity === options.severity);
    }

    if (alerts.length === 0) {
      console.log(colors.green("\nNo active alerts found.\n"));
      return;
    }

    // Enrich alerts with site information
    const sitesMap = new Map<string, { slug: string; name: string }>();
    const allSites = await registry.listSites();
    for (const site of allSites) {
      sitesMap.set(site.id, { slug: site.slug, name: site.name });
    }

    const enrichedAlerts: AlertWithSite[] = alerts.map((alert) => {
      const site = sitesMap.get(alert.site_id);
      return {
        ...alert,
        site_slug: site?.slug,
        site_name: site?.name,
      };
    });

    // Output format
    if (options.format === "json") {
      console.log(JSON.stringify(enrichedAlerts, null, 2));
      return;
    }

    // Table format
    console.log(colors.bold("\nActive Alerts\n"));
    console.log(colors.dim("-".repeat(100)));

    for (const alert of enrichedAlerts) {
      const severityColor = getSeverityColor(alert.severity);
      const statusColor = getStatusColor(alert.status);
      const timeAgo = getRelativeTime(new Date(alert.created_at));

      console.log(
        `${severityColor(`[${alert.severity.toUpperCase().padEnd(8)}]`)} ` +
          `${colors.cyan(alert.type.padEnd(12))} ` +
          `${colors.bold(alert.site_name || alert.site_slug || "Unknown")}`
      );
      console.log(`  ${alert.message}`);
      console.log(
        colors.dim(
          `  ID: ${alert.id.slice(0, 8)}... | Status: ${statusColor(alert.status)} | Created: ${timeAgo}` +
            `${alert.notified_at ? " | Notified" : ""}`
        )
      );
      console.log("");
    }

    console.log(colors.dim("-".repeat(100)));
    console.log(colors.gray(`Total: ${enrichedAlerts.length} active alert(s)\n`));
  } catch (error) {
    console.error(
      colors.red(
        `\nError listing alerts: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  }
}

/**
 * Acknowledge command - Mark an alert as acknowledged
 * @param alertId - Alert ID to acknowledge
 */
async function ackCommand(alertId: string): Promise<void> {
  const registry = getRegistry();

  console.log(colors.cyan(`\nAcknowledging alert ${alertId}...\n`));

  try {
    const alert = await registry.acknowledgeAlert(alertId);
    console.log(colors.green(`Alert acknowledged successfully.`));
    console.log(colors.dim(`  Status: ${alert.status}`));
    console.log(
      colors.dim(`  Acknowledged at: ${new Date(alert.acknowledged_at!).toLocaleString()}`)
    );
    console.log("");
  } catch (error) {
    console.error(
      colors.red(
        `\nError acknowledging alert: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  }
}

/**
 * Resolve command - Mark an alert as resolved
 * @param alertId - Alert ID to resolve
 */
async function resolveCommand(alertId: string): Promise<void> {
  const registry = getRegistry();

  console.log(colors.cyan(`\nResolving alert ${alertId}...\n`));

  try {
    const alert = await registry.resolveAlert(alertId);
    console.log(colors.green(`Alert resolved successfully.`));
    console.log(colors.dim(`  Status: ${alert.status}`));
    console.log(colors.dim(`  Resolved at: ${new Date(alert.resolved_at!).toLocaleString()}`));
    console.log("");
  } catch (error) {
    console.error(
      colors.red(
        `\nError resolving alert: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  }
}

/**
 * Notify command - Send email notifications for unnotified alerts
 * @param options - Command options (dryRun, quiet)
 */
async function notifyCommand(options: { dryRun?: boolean; quiet?: boolean }): Promise<void> {
  const registry = getRegistry();
  const { dryRun, quiet } = options;

  if (!quiet) {
    console.log(colors.cyan("\n[Alert System] Sending notifications...\n"));
    if (dryRun) {
      console.log(colors.yellow("  (dry-run mode - no emails will be sent)\n"));
    }
  }

  try {
    // Get all active alerts
    const alerts = await registry.getActiveAlerts();

    // Filter to unnotified alerts
    const unnotifiedAlerts = alerts.filter((a) => !a.notified_at);

    if (unnotifiedAlerts.length === 0) {
      if (!quiet) {
        console.log(colors.green("  No pending notifications.\n"));
      }
      return;
    }

    if (!quiet) {
      console.log(colors.dim(`  Found ${unnotifiedAlerts.length} unnotified alert(s)\n`));
    }

    // Get site information for alerts
    const sitesMap = new Map<string, { slug: string; name: string }>();
    const allSites = await registry.listSites();
    for (const site of allSites) {
      sitesMap.set(site.id, { slug: site.slug, name: site.name });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const alert of unnotifiedAlerts) {
      const site = sitesMap.get(alert.site_id);
      const enrichedAlert: AlertWithSite = {
        ...alert,
        site_slug: site?.slug,
        site_name: site?.name,
      };

      if (!quiet) {
        const severityColor = getSeverityColor(alert.severity);
        process.stdout.write(
          `  ${severityColor(`[${alert.severity.toUpperCase()}]`)} ${enrichedAlert.site_name}: ${alert.type}... `
        );
      }

      // Send notification (unless dry-run)
      if (!dryRun) {
        const success = await sendEmailNotification(enrichedAlert);

        if (success) {
          // Update alert with notified_at timestamp
          try {
            const supabase = (registry as any).supabase;
            await supabase
              .from("alerts")
              .update({ notified_at: new Date().toISOString() })
              .eq("id", alert.id);

            sentCount++;
            if (!quiet) {
              console.log(colors.green("sent"));
            }
          } catch (error) {
            // Email sent but failed to update DB - still count as sent
            sentCount++;
            if (!quiet) {
              console.log(colors.yellow("sent (db update failed)"));
            }
          }
        } else {
          failedCount++;
          if (!quiet) {
            console.log(colors.red("failed"));
          }
        }
      } else {
        sentCount++;
        if (!quiet) {
          console.log(colors.yellow("(would send)"));
        }
      }
    }

    // Summary
    if (!quiet) {
      console.log(colors.cyan("\n[Summary]"));
      console.log(
        `  Notifications sent: ${dryRun ? `${sentCount} (not sent - dry run)` : sentCount}`
      );
      if (failedCount > 0) {
        console.log(`  Failed: ${failedCount}`);
      }
      console.log("");
    } else {
      if (sentCount > 0) {
        console.log(`${sentCount} notification(s) sent`);
      }
    }
  } catch (error) {
    console.error(
      colors.red(
        `\nError sending notifications: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get human-readable relative time string
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 hours ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  if (diffMins > 0) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  }
  return "just now";
}

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command();

program
  .name("alert-system")
  .description("Automated monitoring and alerting for the site registry")
  .version("1.0.0");

// Command: check [slug]
program
  .command("check [slug]")
  .description("Run alert checks (all sites or specific site)")
  .option("--dry-run", "Check without creating alerts")
  .option("-q, --quiet", "Minimal output (for cron jobs)")
  .action(async (slug: string | undefined, options) => {
    await checkCommand(slug, options);
  });

// Command: list [slug]
program
  .command("list [slug]")
  .description("List active/unresolved alerts")
  .option("-s, --severity <level>", "Filter by severity (critical|high|medium|low)")
  .option("-f, --format <format>", "Output format (table|json)", "table")
  .action(async (slug: string | undefined, options) => {
    await listCommand(slug, options);
  });

// Command: ack <alert-id>
program
  .command("ack <alert-id>")
  .description("Acknowledge an alert")
  .action(async (alertId: string) => {
    await ackCommand(alertId);
  });

// Command: resolve <alert-id>
program
  .command("resolve <alert-id>")
  .description("Resolve an alert")
  .action(async (alertId: string) => {
    await resolveCommand(alertId);
  });

// Command: notify
program
  .command("notify")
  .description("Send email notifications for unnotified alerts")
  .option("--dry-run", "Check without sending emails")
  .option("-q, --quiet", "Minimal output (for cron jobs)")
  .action(async (options) => {
    await notifyCommand(options);
  });

// Parse command line arguments
program.parse();
