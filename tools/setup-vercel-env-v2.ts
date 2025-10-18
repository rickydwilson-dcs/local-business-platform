#!/usr/bin/env tsx
/**
 * Setup Environment Variables for Vercel Projects (Enhanced)
 *
 * Automatically configures ALL environment variables for sites using Vercel API.
 * Handles both platform-wide variables (same for all) and site-specific variables.
 *
 * Usage:
 *   pnpm setup:vercel-env [options]
 *
 * Options:
 *   --dry-run       Show what would be done without making changes
 *   --site <name>   Configure single site only
 *   --r2-only       Only configure R2 variables
 *   --skip-existing Skip variables that already exist
 *
 * Prerequisites:
 *   1. VERCEL_TOKEN in .env.local
 *   2. All platform-wide credentials in .env.local
 *   3. Site-specific configs defined in SITE_CONFIGS below
 *   4. Sites deployed to Vercel
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
dotenv.config({ path: ".env.local" });

interface VercelEnvVar {
  key: string;
  value: string;
  type: "encrypted" | "plain" | "sensitive";
  target: ("production" | "preview" | "development")[];
}

interface EnvVarConfig {
  key: string;
  type: "encrypted" | "plain" | "sensitive";
  target: ("production" | "preview" | "development")[];
  required: boolean;
  category: "r2" | "analytics" | "email" | "features" | "business";
  description?: string;
}

interface SiteConfig {
  slug: string;
  vercelProjectName: string;
  businessEmail: string;
  businessName: string;
  siteUrl: string;
  resendApiKey?: string; // Optional - can be shared or site-specific
}

// Configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

// ============================================
// SITE CONFIGURATIONS
// ============================================
// Define each site's specific values here
const SITE_CONFIGS: SiteConfig[] = [
  {
    slug: "colossus-reference",
    vercelProjectName: "colossus-reference",
    businessEmail: "enquiries@colossus-scaffolding.co.uk",
    businessName: "Colossus Scaffolding",
    siteUrl: "https://colossus-scaffolding.vercel.app",
    // Optionally override shared Resend key per site
    // resendApiKey: 'site_specific_key_here',
  },
  {
    slug: "joes-plumbing-canterbury",
    vercelProjectName: "joes-plumbing-canterbury",
    businessEmail: "joe@joesplumbing.com",
    businessName: "Joe's Plumbing Canterbury",
    siteUrl: "https://joes-plumbing-canterbury.vercel.app",
  },
  // Add more sites here as you create them
];

// ============================================
// PLATFORM-WIDE VARIABLES (Same for all sites)
// ============================================
const PLATFORM_ENV_VARS: EnvVarConfig[] = [
  // R2 Image Storage
  {
    key: "R2_ACCOUNT_ID",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
    category: "r2",
    description: "Cloudflare R2 Account ID",
  },
  {
    key: "R2_ACCESS_KEY_ID",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
    category: "r2",
    description: "R2 API Access Key",
  },
  {
    key: "R2_SECRET_ACCESS_KEY",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
    category: "r2",
    description: "R2 API Secret Key",
  },
  {
    key: "R2_BUCKET_NAME",
    type: "plain",
    target: ["production", "preview", "development"],
    required: true,
    category: "r2",
    description: "R2 Bucket Name",
  },
  {
    key: "NEXT_PUBLIC_R2_PUBLIC_URL",
    type: "plain",
    target: ["production", "preview", "development"],
    required: true,
    category: "r2",
    description: "R2 Public URL",
  },

  // Email Service (Resend) - Shared key
  {
    key: "RESEND_API_KEY",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: false, // Some sites may not have email yet
    category: "email",
    description: "Resend API Key for sending emails",
  },

  // Vercel KV (Redis) - Rate limiting storage
  {
    key: "KV_URL",
    type: "sensitive",
    target: ["production", "preview"],
    required: false,
    category: "storage",
    description: "Vercel KV URL",
  },
  {
    key: "KV_REST_API_URL",
    type: "sensitive",
    target: ["production", "preview"],
    required: false,
    category: "storage",
    description: "Vercel KV REST API URL",
  },
  {
    key: "KV_REST_API_TOKEN",
    type: "sensitive",
    target: ["production", "preview"],
    required: false,
    category: "storage",
    description: "Vercel KV REST API Token",
  },
  {
    key: "KV_REST_API_READ_ONLY_TOKEN",
    type: "sensitive",
    target: ["production", "preview"],
    required: false,
    category: "storage",
    description: "Vercel KV REST API Read-Only Token",
  },
  {
    key: "REDIS_URL",
    type: "sensitive",
    target: ["production", "preview"],
    required: false,
    category: "storage",
    description: "Redis URL (legacy/alias)",
  },

  // Analytics - Google Analytics 4
  {
    key: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "analytics",
    description: "Google Analytics 4 Measurement ID",
  },
  {
    key: "GA4_API_SECRET",
    type: "sensitive",
    target: ["production", "preview"], // Production + Preview only (matches your setup)
    required: false,
    category: "analytics",
    description: "GA4 Measurement Protocol API Secret",
  },

  // Analytics - Facebook Pixel
  {
    key: "NEXT_PUBLIC_FACEBOOK_PIXEL_ID",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "analytics",
    description: "Facebook Pixel ID",
  },
  {
    key: "FACEBOOK_ACCESS_TOKEN",
    type: "sensitive",
    target: ["production", "preview"], // Production + Preview only (matches your setup)
    required: false,
    category: "analytics",
    description: "Facebook Conversions API Access Token",
  },

  // Analytics - Google Ads
  {
    key: "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "analytics",
    description: "Google Ads Conversion ID",
  },

  // Feature Flags
  {
    key: "FEATURE_ANALYTICS_ENABLED",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Master analytics feature flag",
  },
  {
    key: "FEATURE_SERVER_TRACKING",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Server-side tracking feature flag",
  },
  {
    key: "FEATURE_CONSENT_BANNER",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Consent banner feature flag",
  },
  {
    key: "FEATURE_GA4_ENABLED",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Google Analytics 4 feature flag",
  },
  {
    key: "FEATURE_FACEBOOK_PIXEL",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Facebook Pixel feature flag",
  },
  {
    key: "FEATURE_GOOGLE_ADS",
    type: "plain",
    target: ["production", "preview", "development"],
    required: false,
    category: "features",
    description: "Google Ads feature flag",
  },
];

// ============================================
// SITE-SPECIFIC VARIABLES (Different per site)
// ============================================
// These are generated from SITE_CONFIGS above
const SITE_SPECIFIC_VARS = ["BUSINESS_EMAIL", "BUSINESS_NAME", "NEXT_PUBLIC_SITE_URL"];

/**
 * Get Vercel project ID by name
 */
async function getProjectId(projectName: string): Promise<string | null> {
  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v9/projects/${projectName}?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v9/projects/${projectName}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(
      `  Error fetching project: ${error instanceof Error ? error.message : "Unknown"}`
    );
    return null;
  }
}

/**
 * Get existing environment variables for a project
 */
async function getExistingEnvVars(projectId: string): Promise<string[]> {
  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v9/projects/${projectId}/env?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v9/projects/${projectId}/env`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.envs?.map((env: any) => env.key) || [];
  } catch {
    return [];
  }
}

/**
 * Add environment variable to Vercel project
 */
async function addEnvVar(
  projectId: string,
  envVar: VercelEnvVar
): Promise<{ success: boolean; error?: string }> {
  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v10/projects/${projectId}/env`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envVar),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error?.message || "Unknown error" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate site-specific environment variables
 */
function getSiteSpecificVars(siteConfig: SiteConfig): EnvVarConfig[] {
  return [
    {
      key: "BUSINESS_EMAIL",
      type: "plain",
      target: ["production", "preview", "development"],
      required: true,
      category: "business",
      description: "Business contact email",
    },
    {
      key: "BUSINESS_NAME",
      type: "plain",
      target: ["production", "preview", "development"],
      required: true,
      category: "business",
      description: "Business name",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      type: "plain",
      target: ["production", "preview", "development"],
      required: true,
      category: "business",
      description: "Public site URL",
    },
  ];
}

/**
 * Get value for site-specific variable
 */
function getSiteSpecificValue(siteConfig: SiteConfig, key: string): string {
  switch (key) {
    case "BUSINESS_EMAIL":
      return siteConfig.businessEmail;
    case "BUSINESS_NAME":
      return siteConfig.businessName;
    case "NEXT_PUBLIC_SITE_URL":
      return siteConfig.siteUrl;
    case "RESEND_API_KEY":
      return siteConfig.resendApiKey || process.env.RESEND_API_KEY || "";
    default:
      return "";
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const r2Only = args.includes("--r2-only");
  const skipExisting = args.includes("--skip-existing");
  const singleSiteIndex = args.indexOf("--site");
  const singleSite = singleSiteIndex !== -1 ? args[singleSiteIndex + 1] : null;

  console.log("🚀 Vercel Environment Variable Setup\n");

  if (dryRun) {
    console.log("⚠️  DRY RUN MODE - No changes will be made\n");
  }

  // Validate Vercel token
  if (!VERCEL_TOKEN) {
    console.error("❌ VERCEL_TOKEN not found in .env.local\n");
    console.error("Get token from: https://vercel.com/account/tokens");
    console.error("Add to .env.local: VERCEL_TOKEN=your_token_here\n");
    process.exit(1);
  }

  // Filter variables if r2-only
  const platformVars = r2Only
    ? PLATFORM_ENV_VARS.filter((v) => v.category === "r2")
    : PLATFORM_ENV_VARS;

  // Get platform-wide credentials from environment
  const platformCredentials: Record<string, string> = {};
  const missingVars: string[] = [];

  for (const config of platformVars) {
    const value = process.env[config.key];
    if (!value && config.required) {
      missingVars.push(config.key);
    }
    platformCredentials[config.key] = value || "";
  }

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables in .env.local:\n");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\nSee documentation for setup instructions\n");
    process.exit(1);
  }

  console.log("✓ Loaded platform-wide credentials from .env.local");
  console.log(`✓ Found ${platformVars.length} platform-wide variable(s)`);

  if (r2Only) {
    console.log("  (R2-only mode: skipping other variables)");
  }

  console.log();

  // Determine which sites to process
  const sitesToProcess = singleSite
    ? SITE_CONFIGS.filter((s) => s.slug === singleSite || s.vercelProjectName === singleSite)
    : SITE_CONFIGS;

  if (sitesToProcess.length === 0) {
    console.error(`❌ No sites found matching "${singleSite}"\n`);
    process.exit(1);
  }

  console.log(`📦 Configuring ${sitesToProcess.length} site(s):\n`);

  // Process each site
  let successCount = 0;
  let failureCount = 0;
  let stats = {
    added: 0,
    skipped: 0,
    failed: 0,
  };

  for (const siteConfig of sitesToProcess) {
    console.log(`\n📦 ${siteConfig.slug}`);
    console.log("─".repeat(60));

    // Get project ID
    const projectId = await getProjectId(siteConfig.vercelProjectName);
    if (!projectId) {
      console.error(`  ❌ Project not found in Vercel: ${siteConfig.vercelProjectName}`);
      console.error(`     Make sure the site is deployed to Vercel`);
      failureCount++;
      continue;
    }

    console.log(`  ✓ Project ID: ${projectId}`);

    // Get existing variables
    const existingVars = await getExistingEnvVars(projectId);
    console.log(`  ✓ Existing variables: ${existingVars.length}`);

    // Prepare all variables for this site
    const allVars: { config: EnvVarConfig; value: string }[] = [];

    // Add platform-wide variables
    for (const config of platformVars) {
      allVars.push({
        config,
        value: platformCredentials[config.key],
      });
    }

    // Add site-specific variables (unless r2-only mode)
    if (!r2Only) {
      const siteSpecificVars = getSiteSpecificVars(siteConfig);
      for (const config of siteSpecificVars) {
        allVars.push({
          config,
          value: getSiteSpecificValue(siteConfig, config.key),
        });
      }
    }

    console.log(`  → Processing ${allVars.length} variable(s)\n`);

    // Add each environment variable
    let siteSuccess = true;

    for (const { config, value } of allVars) {
      // Skip if value is empty and not required
      if (!value && !config.required) {
        console.log(`  ⊘ ${config.key} (no value, skipping)`);
        stats.skipped++;
        continue;
      }

      // Check if already exists
      if (existingVars.includes(config.key)) {
        if (skipExisting) {
          console.log(`  ⊘ ${config.key} (already exists, skipping)`);
          stats.skipped++;
          continue;
        } else {
          console.log(
            `  ⚠ ${config.key} (already exists, will fail if you don't use --skip-existing)`
          );
        }
      }

      const envVar: VercelEnvVar = {
        key: config.key,
        value,
        type: config.type,
        target: config.target,
      };

      if (dryRun) {
        console.log(`  → ${config.key} (would add to ${config.target.join(", ")})`);
        continue;
      }

      const result = await addEnvVar(projectId, envVar);

      if (result.success) {
        console.log(`  ✓ ${config.key} (added)`);
        stats.added++;
      } else {
        console.error(`  ❌ ${config.key} (failed: ${result.error})`);
        stats.failed++;
        siteSuccess = false;
      }
    }

    if (siteSuccess) {
      console.log(`\n  ✅ ${siteConfig.slug} configured successfully`);
      successCount++;
    } else {
      console.log(`\n  ⚠️  ${siteConfig.slug} partially configured (some variables failed)`);
      failureCount++;
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total sites:      ${sitesToProcess.length}`);
  console.log(`Successful:       ${successCount}`);
  console.log(`Failed:           ${failureCount}`);
  console.log(`\nVariables added:  ${stats.added}`);
  console.log(`Variables skipped: ${stats.skipped}`);
  console.log(`Variables failed:  ${stats.failed}`);

  if (!dryRun && successCount > 0) {
    console.log("\n✅ Environment variables configured!");
    console.log("\n💡 Next steps:");
    console.log("   1. Redeploy affected sites for changes to take effect");
    console.log("   2. Verify sites load correctly in production");
    console.log("   3. Test functionality (images, email, analytics, etc.)");
  } else if (dryRun) {
    console.log("\n✓ Dry run complete - no changes made");
    console.log("  Run without --dry-run to apply changes");
  }

  if (failureCount > 0) {
    console.log("\n⚠️  Some sites failed to configure");
    console.log("   Check error messages above");
    console.log("   Tip: Use --skip-existing to skip variables that already exist");
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});
