#!/usr/bin/env tsx

/**
 * Test script for Supabase Registry Client
 *
 * Tests basic CRUD operations and connection to Supabase database.
 * Run with: tsx tools/test-registry-client.ts
 */

import { registry } from "./lib/supabase-client";

async function testRegistryClient() {
  console.log("Testing Supabase Registry Client...\n");

  try {
    // Test 1: Connection test
    console.log("1. Testing database connection...");
    const connected = await registry.testConnection();
    if (connected) {
      console.log("✓ Database connection successful\n");
    } else {
      console.log("✗ Database connection failed\n");
      return;
    }

    // Test 2: List sites
    console.log("2. Listing all sites...");
    const sites = await registry.listSites();
    console.log(`✓ Found ${sites.length} sites`);
    if (sites.length > 0) {
      console.log(`  First site: ${sites[0].slug} (${sites[0].name})\n`);
    } else {
      console.log("  No sites found in database\n");
    }

    // Test 3: Get site by slug (if any exist)
    if (sites.length > 0) {
      console.log("3. Getting site by slug...");
      const site = await registry.getSite(sites[0].slug);
      if (site) {
        console.log(`✓ Retrieved site: ${site.name}`);
        console.log(`  Industry: ${site.industry}`);
        console.log(`  Status: ${site.status}`);
        console.log(`  Created: ${new Date(site.created_at).toLocaleDateString()}\n`);
      }

      // Test 4: Get recent deployments
      console.log("4. Getting recent deployments...");
      const deployments = await registry.getRecentDeployments(sites[0].slug, 5);
      console.log(`✓ Found ${deployments.length} deployments\n`);

      // Test 5: Get recent builds
      console.log("5. Getting recent builds...");
      const builds = await registry.getRecentBuilds(sites[0].slug, 5);
      console.log(`✓ Found ${builds.length} builds\n`);

      // Test 6: Get metrics
      console.log("6. Getting metrics (last 7 days)...");
      const metrics = await registry.getMetrics(sites[0].slug, 7);
      console.log(`✓ Found ${metrics.length} metrics records\n`);

      // Test 7: Get active alerts
      console.log("7. Getting active alerts...");
      const alerts = await registry.getActiveAlerts(sites[0].slug);
      console.log(`✓ Found ${alerts.length} active alerts\n`);

      // Test 8: Get content generation stats
      console.log("8. Getting content generation stats...");
      const stats = await registry.getContentGenerationStats(sites[0].slug);
      console.log(`✓ Content generation stats:`);
      console.log(`  Total generations: ${stats.generation_count}`);
      console.log(`  Total cost: $${stats.total_cost_usd.toFixed(4)}`);
      console.log(`  Total tokens: ${stats.total_tokens.toLocaleString()}\n`);
    }

    // Test 9: List sites with filters
    console.log("9. Testing site filters...");
    const activeSites = await registry.listSites({ status: "active" });
    console.log(`✓ Found ${activeSites.length} active sites\n`);

    console.log("All tests completed successfully!");
  } catch (error) {
    console.error("\n✗ Test failed with error:");
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
      console.error(`\n  Stack trace:`);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run tests
testRegistryClient();
