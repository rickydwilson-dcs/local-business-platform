#!/usr/bin/env node
/**
 * Site Registry Management CLI
 *
 * Comprehensive CLI tool for managing the site registry system.
 * Provides commands for listing, syncing, and managing 50+ local business sites.
 *
 * Commands:
 * - list: List all sites with optional filters
 * - show: Show detailed site information
 * - sync: Sync a single site from filesystem to registry
 * - sync-all: Sync all sites in sites/ directory
 * - set-status: Update site status
 * - interactive: Interactive REPL mode
 *
 * Usage:
 *   pnpm sites:list
 *   pnpm sites:show colossus-reference
 *   pnpm sites:sync colossus-reference
 *   pnpm sites:sync-all
 *   pnpm sites:interactive
 */

import { Command } from "commander";
import {
  registry,
  type Site,
  type SiteStatus,
  type SiteCreate,
  type SiteUpdate,
} from "./lib/supabase-client";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { glob } from "glob";
import { join } from "path";
import * as readline from "readline";
import chalk from "chalk";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get status color based on site status
 */
function colorStatus(status: string): string {
  switch (status) {
    case "active":
      return chalk.green(status);
    case "paused":
      return chalk.yellow(status);
    case "archived":
      return chalk.red(status);
    default:
      return status;
  }
}

/**
 * Get severity emoji based on alert severity
 */
function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "critical":
      return "🚨";
    case "high":
    case "medium":
      return "⚠️";
    case "low":
      return "ℹ️";
    default:
      return "ℹ️";
  }
}

/**
 * Format date for display
 */
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format output as CSV
 */
function formatCsv(sites: Site[]): string {
  const headers = ["slug", "name", "domain", "industry", "status"];
  const rows = sites.map((site) => [
    site.slug,
    site.name,
    site.domain || "",
    site.industry,
    site.status,
  ]);

  return [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
    "\n"
  );
}

// ============================================================================
// Site Configuration Utilities
// ============================================================================

/**
 * Load site config from filesystem (site.config.ts)
 */
async function loadSiteConfig(slug: string) {
  const configPath = join(process.cwd(), "sites", slug, "site.config.ts");

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    // Use dynamic import to load the config
    const configModule = await import(configPath);
    const config = configModule.siteConfig || configModule.default;
    return config;
  } catch (error) {
    console.error(chalk.red(`Error loading config for ${slug}:`), error);
    return null;
  }
}

/**
 * Count MDX files matching a pattern
 */
function countMdxFiles(pattern: string): number {
  try {
    const files = glob.sync(pattern);
    return files.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Get site stats from filesystem
 */
function getSiteStats(slug: string) {
  const sitePath = join(process.cwd(), "sites", slug);

  return {
    service_count: countMdxFiles(`${sitePath}/content/services/*.mdx`),
    location_count: countMdxFiles(`${sitePath}/content/locations/*.mdx`),
    blog_count: countMdxFiles(`${sitePath}/content/blog/*.mdx`),
    project_count: countMdxFiles(`${sitePath}/content/projects/*.mdx`),
  };
}

/**
 * Get list of site directories (excluding base-template)
 */
function getSiteDirectories(): string[] {
  const sitesPath = join(process.cwd(), "sites");

  if (!existsSync(sitesPath)) {
    return [];
  }

  const dirs = readdirSync(sitesPath);

  return dirs.filter((dir) => {
    const dirPath = join(sitesPath, dir);
    const isDir = statSync(dirPath).isDirectory();
    const isNotBaseTemplate = dir !== "base-template";
    return isDir && isNotBaseTemplate;
  });
}

// ============================================================================
// Command Implementations
// ============================================================================

/**
 * List all sites with optional filters
 */
async function listCommand(options: {
  status?: SiteStatus;
  industry?: string;
  format: "table" | "json" | "csv";
}) {
  try {
    const filters: any = {};
    if (options.status) {
      filters.status = options.status;
    }
    if (options.industry) {
      filters.industry = options.industry;
    }

    const sites = await registry.listSites(filters);

    if (sites.length === 0) {
      console.log(chalk.yellow("No sites found."));
      return;
    }

    if (options.format === "json") {
      console.log(JSON.stringify(sites, null, 2));
    } else if (options.format === "csv") {
      console.log(formatCsv(sites));
    } else {
      // Table format
      console.log(chalk.bold("\n📋 Sites Registry\n"));
      console.table(
        sites.map((site) => ({
          Slug: site.slug,
          Name: site.name,
          Domain: site.domain || "-",
          Industry: site.industry,
          Status: site.status,
        }))
      );
      console.log(chalk.gray(`\nTotal: ${sites.length} sites\n`));
    }
  } catch (error) {
    console.error(chalk.red("❌ Error listing sites:"), error);
    process.exit(1);
  }
}

/**
 * Show detailed information for a single site
 */
async function showCommand(slug: string) {
  try {
    const site = await registry.getSite(slug);

    if (!site) {
      console.error(chalk.red(`❌ Site not found: ${slug}`));
      process.exit(1);
    }

    console.log(chalk.bold(`\n📊 Site Details: ${site.name}\n`));

    // Site Info
    console.log(chalk.bold("Site Information:"));
    console.log(`  Slug:             ${site.slug}`);
    console.log(`  Name:             ${site.name}`);
    console.log(`  Domain:           ${site.domain || "-"}`);
    console.log(`  Industry:         ${site.industry}`);
    console.log(`  Status:           ${colorStatus(site.status)}`);
    console.log(`  Vercel Project:   ${site.vercel_project_id || "-"}`);
    console.log(`  NewRelic App:     ${site.newrelic_app_id || "-"}`);
    console.log();

    // Content Stats
    const stats = (site.stats as any) || {};
    console.log(chalk.bold("Content Statistics:"));
    console.log(`  Services:         ${stats.service_count || 0}`);
    console.log(`  Locations:        ${stats.location_count || 0}`);
    console.log(`  Blog Posts:       ${stats.blog_count || 0}`);
    console.log(`  Projects:         ${stats.project_count || 0}`);
    console.log();

    // Recent Deployments
    try {
      const deployments = await registry.getRecentDeployments(slug, 5);
      if (deployments.length > 0) {
        console.log(chalk.bold("Recent Deployments (Last 5):"));
        deployments.forEach((dep, idx) => {
          const statusColor =
            dep.status === "ready"
              ? chalk.green(dep.status)
              : dep.status === "error"
                ? chalk.red(dep.status)
                : chalk.yellow(dep.status);
          console.log(
            `  ${idx + 1}. ${statusColor} - ${dep.environment} - ${dep.git_branch} - ${dep.git_commit_sha.substring(0, 7)} - ${formatDate(dep.created_at)}`
          );
        });
        console.log();
      }
    } catch (error) {
      // Deployments not available
    }

    // Active Alerts
    try {
      const alerts = await registry.getActiveAlerts(slug);
      if (alerts.length > 0) {
        console.log(chalk.bold("Active Alerts:"));
        alerts.forEach((alert) => {
          const emoji = getSeverityEmoji(alert.severity);
          console.log(
            `  ${emoji} ${chalk.bold(alert.type)} - ${alert.severity} - ${alert.message} - ${formatDate(alert.created_at)}`
          );
        });
        console.log();
      }
    } catch (error) {
      // Alerts not available
    }

    // Recent Metrics
    try {
      const metrics = await registry.getMetrics(slug, 7);
      if (metrics.length > 0) {
        console.log(chalk.bold("Recent Metrics (Last 7 Days):"));
        metrics.forEach((m) => {
          console.log(
            `  ${m.date} - Avg Response: ${m.response_time_avg_ms || "-"}ms - Error Rate: ${m.error_rate_percent || "-"}% - Throughput: ${m.throughput_rpm || "-"} RPM`
          );
        });
        console.log();
      }
    } catch (error) {
      // Metrics not available
    }

    console.log(chalk.gray(`Created: ${formatDate(site.created_at)}`));
    console.log(chalk.gray(`Updated: ${formatDate(site.updated_at)}\n`));
  } catch (error) {
    console.error(chalk.red("❌ Error showing site:"), error);
    process.exit(1);
  }
}

/**
 * Sync a single site from filesystem to registry
 */
async function syncCommand(slug: string) {
  try {
    const sitePath = join(process.cwd(), "sites", slug);

    // Check if site directory exists
    if (!existsSync(sitePath)) {
      console.error(chalk.red(`❌ Site directory not found: ${slug}`));
      process.exit(1);
    }

    // Load site config
    const config = await loadSiteConfig(slug);
    if (!config) {
      console.error(chalk.red(`❌ Could not load site.config.ts for: ${slug}`));
      process.exit(1);
    }

    // Get content stats
    const stats = getSiteStats(slug);

    // Check if site exists in registry
    const existingSite = await registry.getSite(slug);

    if (existingSite) {
      // Update existing site
      await registry.updateSite(slug, {
        name: config.name || config.business?.name,
        domain: config.url,
        industry: config.business?.industry || "unknown",
        business_info: config.business
          ? {
              name: config.business.name,
              phone: config.business.phone,
              email: config.business.email,
              address: config.business.address,
              hours: config.business.hours,
              social: config.business.social,
            }
          : null,
        theme_config: config.theme || null,
        stats: {
          service_count: stats.service_count,
          location_count: stats.location_count,
          blog_count: stats.blog_count,
          project_count: stats.project_count,
        },
      });

      console.log(
        chalk.green(
          `✅ Updated ${config.name || slug} (${stats.service_count} services, ${stats.location_count} locations, ${stats.blog_count} blog posts, ${stats.project_count} projects)`
        )
      );
    } else {
      // Create new site
      await registry.createSite({
        slug,
        name: config.name || config.business?.name || slug,
        domain: config.url,
        industry: config.business?.industry || "unknown",
        status: "active",
        business_info: config.business
          ? {
              name: config.business.name,
              phone: config.business.phone,
              email: config.business.email,
              address: config.business.address,
              hours: config.business.hours,
              social: config.business.social,
            }
          : null,
        theme_config: config.theme || null,
        stats: {
          service_count: stats.service_count,
          location_count: stats.location_count,
          blog_count: stats.blog_count,
          project_count: stats.project_count,
        },
      });

      console.log(
        chalk.green(
          `✅ Created ${config.name || slug} (${stats.service_count} services, ${stats.location_count} locations, ${stats.blog_count} blog posts, ${stats.project_count} projects)`
        )
      );
    }
  } catch (error) {
    console.error(chalk.red("❌ Error syncing site:"), error);
    process.exit(1);
  }
}

/**
 * Sync all sites from filesystem to registry
 */
async function syncAllCommand() {
  try {
    const siteDirs = getSiteDirectories();

    if (siteDirs.length === 0) {
      console.log(chalk.yellow("No site directories found."));
      return;
    }

    console.log(chalk.bold(`\n🔄 Syncing ${siteDirs.length} sites...\n`));

    let newCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < siteDirs.length; i++) {
      const slug = siteDirs[i];
      console.log(chalk.gray(`Syncing ${i + 1}/${siteDirs.length}: ${slug}...`));

      try {
        const sitePath = join(process.cwd(), "sites", slug);

        // Load site config
        const config = await loadSiteConfig(slug);
        if (!config) {
          console.error(chalk.red(`  Error: Could not load site.config.ts`));
          errorCount++;
          continue;
        }

        // Get content stats
        const stats = getSiteStats(slug);

        // Check if site exists in registry
        const existingSite = await registry.getSite(slug);

        if (existingSite) {
          // Update existing site
          await registry.updateSite(slug, {
            name: config.name || config.business?.name,
            domain: config.url,
            industry: config.business?.industry || "unknown",
            business_info: config.business
              ? {
                  name: config.business.name,
                  phone: config.business.phone,
                  email: config.business.email,
                  address: config.business.address,
                  hours: config.business.hours,
                  social: config.business.social,
                }
              : null,
            theme_config: config.theme || null,
            stats: {
              service_count: stats.service_count,
              location_count: stats.location_count,
              blog_count: stats.blog_count,
              project_count: stats.project_count,
            },
          });
          updatedCount++;
        } else {
          // Create new site
          await registry.createSite({
            slug,
            name: config.name || config.business?.name || slug,
            domain: config.url,
            industry: config.business?.industry || "unknown",
            status: "active",
            business_info: config.business
              ? {
                  name: config.business.name,
                  phone: config.business.phone,
                  email: config.business.email,
                  address: config.business.address,
                  hours: config.business.hours,
                  social: config.business.social,
                }
              : null,
            theme_config: config.theme || null,
            stats: {
              service_count: stats.service_count,
              location_count: stats.location_count,
              blog_count: stats.blog_count,
              project_count: stats.project_count,
            },
          });
          newCount++;
        }
      } catch (error) {
        console.error(chalk.red(`  Error syncing ${slug}`));
        errorCount++;
      }
    }

    console.log(chalk.bold("\n📊 Sync Summary:"));
    console.log(chalk.green(`  ✅ New sites: ${newCount}`));
    console.log(chalk.blue(`  🔄 Updated sites: ${updatedCount}`));
    if (errorCount > 0) {
      console.log(chalk.red(`  ❌ Errors: ${errorCount}`));
    }
    console.log();
  } catch (error) {
    console.error(chalk.red("❌ Error syncing all sites:"), error);
    process.exit(1);
  }
}

/**
 * Update site status
 */
async function setStatusCommand(slug: string, status: string) {
  try {
    // Validate status
    const validStatuses: SiteStatus[] = ["active", "paused", "archived"];
    if (!validStatuses.includes(status as SiteStatus)) {
      console.error(
        chalk.red(`❌ Invalid status: ${status}. Valid values: active, paused, archived`)
      );
      process.exit(1);
    }

    // Check if site exists
    const site = await registry.getSite(slug);
    if (!site) {
      console.error(chalk.red(`❌ Site not found: ${slug}`));
      process.exit(1);
    }

    // Update status
    await registry.updateSite(slug, { status: status as SiteStatus });

    console.log(chalk.green(`✅ Set ${site.name} status to ${colorStatus(status)}`));
  } catch (error) {
    console.error(chalk.red("❌ Error setting status:"), error);
    process.exit(1);
  }
}

/**
 * Interactive REPL mode
 */
async function interactiveCommand() {
  console.log(chalk.bold("\n🔧 Site Registry Interactive Mode"));
  console.log(chalk.gray("Type 'help' for available commands, 'exit' to quit\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan("registry> "),
  });

  const commands = {
    help: () => {
      console.log("\nAvailable commands:");
      console.log("  list                      - List all sites");
      console.log("  list --status <status>    - Filter by status");
      console.log("  list --industry <ind>     - Filter by industry");
      console.log("  show <slug>               - Show site details");
      console.log("  sync <slug>               - Sync site from filesystem");
      console.log("  sync-all                  - Sync all sites");
      console.log("  set-status <slug> <stat>  - Update site status");
      console.log("  help                      - Show this help");
      console.log("  exit                      - Exit interactive mode\n");
    },
  };

  rl.prompt();

  rl.on("line", async (line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      rl.prompt();
      return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    try {
      switch (command) {
        case "exit":
        case "quit":
          console.log(chalk.gray("Goodbye!"));
          rl.close();
          return;

        case "help":
          commands.help();
          break;

        case "list":
          const listOptions: any = { format: "table" };
          for (let i = 0; i < args.length; i += 2) {
            if (args[i] === "--status") {
              listOptions.status = args[i + 1];
            } else if (args[i] === "--industry") {
              listOptions.industry = args[i + 1];
            } else if (args[i] === "--format") {
              listOptions.format = args[i + 1];
            }
          }
          await listCommand(listOptions);
          break;

        case "show":
          if (args.length === 0) {
            console.log(chalk.red("Usage: show <slug>"));
          } else {
            await showCommand(args[0]);
          }
          break;

        case "sync":
          if (args.length === 0) {
            console.log(chalk.red("Usage: sync <slug>"));
          } else {
            await syncCommand(args[0]);
          }
          break;

        case "sync-all":
          await syncAllCommand();
          break;

        case "set-status":
          if (args.length < 2) {
            console.log(chalk.red("Usage: set-status <slug> <status>"));
          } else {
            await setStatusCommand(args[0], args[1]);
          }
          break;

        default:
          console.log(chalk.red(`Unknown command: ${command}`));
          console.log(chalk.gray("Type 'help' for available commands"));
          break;
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command();

program.name("manage-sites").description("Site registry management CLI").version("1.0.0");

program
  .command("list")
  .description("List all sites")
  .option("-s, --status <status>", "Filter by status (active|paused|archived)")
  .option("-i, --industry <industry>", "Filter by industry")
  .option("-f, --format <format>", "Output format (table|json|csv)", "table")
  .action(listCommand);

program.command("show <slug>").description("Show detailed site information").action(showCommand);

program
  .command("sync <slug>")
  .description("Sync site from filesystem to registry")
  .action(syncCommand);

program
  .command("sync-all")
  .description("Sync all sites in sites/ directory")
  .action(syncAllCommand);

program
  .command("set-status <slug> <status>")
  .description("Update site status (active|paused|archived)")
  .action(setStatusCommand);

program.command("interactive").description("Interactive shell mode").action(interactiveCommand);

program.parse();
