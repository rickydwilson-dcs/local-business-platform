#!/usr/bin/env tsx
/**
 * Setup R2 Environment Variables for Vercel Projects
 *
 * Automatically configures R2 credentials for all sites using Vercel API.
 * Reads credentials from .env.local and applies to all listed sites.
 *
 * Usage:
 *   pnpm setup:vercel-env [options]
 *
 * Options:
 *   --dry-run    Show what would be done without making changes
 *   --site       Configure single site only
 *
 * Prerequisites:
 *   1. VERCEL_TOKEN in .env.local (get from https://vercel.com/account/tokens)
 *   2. R2 credentials in .env.local
 *   3. Sites deployed to Vercel
 */

import * as dotenv from "dotenv";
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
}

// Configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional for team accounts

// Sites to configure (update this as you add more sites)
const SITES = [
  "colossus-reference",
  "smiths-electrical-cambridge",
  // Add more sites here as you create them
];

// R2 environment variables configuration
const R2_ENV_VARS: EnvVarConfig[] = [
  {
    key: "R2_ACCOUNT_ID",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
  },
  {
    key: "R2_ACCESS_KEY_ID",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
  },
  {
    key: "R2_SECRET_ACCESS_KEY",
    type: "sensitive",
    target: ["production", "preview"], // Sensitive vars cannot target development via API
    required: true,
  },
  {
    key: "R2_BUCKET_NAME",
    type: "plain",
    target: ["production", "preview", "development"],
    required: true,
  },
  {
    key: "NEXT_PUBLIC_R2_PUBLIC_URL",
    type: "plain",
    target: ["production", "preview", "development"],
    required: true,
  },
];

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
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const singleSiteIndex = args.indexOf("--site");
  const singleSite = singleSiteIndex !== -1 ? args[singleSiteIndex + 1] : null;

  console.log("🚀 Vercel Environment Variable Setup for R2\n");

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

  // Get R2 credentials from environment
  const r2Credentials: Record<string, string> = {};
  const missingVars: string[] = [];

  for (const config of R2_ENV_VARS) {
    const value = process.env[config.key];
    if (!value && config.required) {
      missingVars.push(config.key);
    }
    r2Credentials[config.key] = value || "";
  }

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables in .env.local:\n");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\nSee R2_SETUP.md for instructions\n");
    process.exit(1);
  }

  console.log("✓ Loaded R2 credentials from .env.local");
  console.log(`✓ Found ${R2_ENV_VARS.length} environment variables to set\n`);

  // Determine which sites to process
  const sitesToProcess = singleSite ? [singleSite] : SITES;

  if (singleSite && !SITES.includes(singleSite)) {
    console.warn(`⚠️  Warning: "${singleSite}" not in SITES list\n`);
  }

  console.log(`📦 Configuring ${sitesToProcess.length} site(s):\n`);

  // Process each site
  let successCount = 0;
  let failureCount = 0;

  for (const site of sitesToProcess) {
    console.log(`\n📦 ${site}`);
    console.log("─".repeat(50));

    // Get project ID
    const projectId = await getProjectId(site);
    if (!projectId) {
      console.error(`  ❌ Project not found in Vercel`);
      console.error(`     Make sure the site is deployed to Vercel`);
      failureCount++;
      continue;
    }

    console.log(`  ✓ Project ID: ${projectId}`);

    // Get existing variables
    const existingVars = await getExistingEnvVars(projectId);
    console.log(`  ✓ Existing variables: ${existingVars.length}`);

    // Add each environment variable
    let siteSuccess = true;

    for (const config of R2_ENV_VARS) {
      const value = r2Credentials[config.key];

      // Check if already exists
      if (existingVars.includes(config.key)) {
        console.log(`  ⊘ ${config.key} (already exists, skipping)`);
        continue;
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
        console.log(`  ✓ ${config.key} (added to ${config.target.join(", ")})`);
      } else {
        console.error(`  ❌ ${config.key} (failed: ${result.error})`);
        siteSuccess = false;
      }
    }

    if (siteSuccess) {
      console.log(`\n  ✅ ${site} configured successfully`);
      successCount++;
    } else {
      console.log(`\n  ⚠️  ${site} partially configured (some variables failed)`);
      failureCount++;
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total sites:      ${sitesToProcess.length}`);
  console.log(`Successful:       ${successCount}`);
  console.log(`Failed:           ${failureCount}`);

  if (!dryRun && successCount > 0) {
    console.log("\n✅ Environment variables configured!");
    console.log("\n💡 Next steps:");
    console.log("   1. Redeploy affected sites for changes to take effect");
    console.log("   2. Verify images load correctly in production");
    console.log("   3. Check /api/test-env endpoint (optional)");
  } else if (dryRun) {
    console.log("\n✓ Dry run complete - no changes made");
    console.log("  Run without --dry-run to apply changes");
  }

  if (failureCount > 0) {
    console.log("\n⚠️  Some sites failed to configure");
    console.log("   Check error messages above and try again");
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});
