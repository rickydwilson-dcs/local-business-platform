#!/usr/bin/env ts-node
/**
 * Create baseline snapshots before migration
 * - Extract serviceDataMap to JSON
 * - Capture screenshots of all service pages
 * - Record metadata for comparison
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const SNAPSHOT_DIR = path.join(process.cwd(), "scripts", "migration-snapshots");
const SERVICE_PAGE_PATH = path.join(process.cwd(), "app", "services", "[slug]", "page.tsx");

// Service slugs to snapshot
const SERVICE_SLUGS = [
  // Base services
  "access-scaffolding",
  "facade-scaffolding",
  "edge-protection",
  "temporary-roof-systems",
  "birdcage-scaffolds",
  "scaffold-towers-mast-systems",
  "crash-decks-crane-decks",
  "heavy-duty-industrial-scaffolding",
  "pavement-gantries-loading-bays",
  "public-access-staircases",
  "scaffold-alarms",
  "scaffolding-design-drawings",
  "scaffolding-inspections-maintenance",
  "sheeting-netting-encapsulation",
  "staircase-towers",
  "suspended-scaffolding",
  "commercial-scaffolding",
  "industrial-scaffolding",
  "residential-scaffolding",
  // Location-specific services
  "commercial-scaffolding-brighton",
  "commercial-scaffolding-canterbury",
  "commercial-scaffolding-hastings",
  "residential-scaffolding-brighton",
  "residential-scaffolding-canterbury",
  "residential-scaffolding-hastings",
];

function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
  ["screenshots", "html-snapshots", "metadata"].forEach((dir) => {
    const dirPath = path.join(SNAPSHOT_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

/**
 * Read serviceDataMap from source file and extract as JSON
 * This is a manual process - the map is too complex for automated parsing
 */
function promptManualExtraction() {
  console.log("📋 MANUAL STEP REQUIRED:");
  console.log("=".repeat(60));
  console.log("\nPlease manually extract serviceDataMap to JSON:\n");
  console.log("1. Open: app/services/[slug]/page.tsx");
  console.log("2. Find: function getServiceData(slug: string)");
  console.log("3. Copy the entire serviceDataMap object (lines 63-733)");
  console.log("4. Convert to JSON format");
  console.log("5. Save to: scripts/migration-snapshots/baseline.json\n");
  console.log("Structure should be:");
  console.log("  {");
  console.log('    "access-scaffolding": { ... },');
  console.log('    "facade-scaffolding": { ... },');
  console.log("    ...");
  console.log("  }");
  console.log("\n" + "=".repeat(60));
}

/**
 * Generate service inventory
 */
function generateInventory() {
  const inventory = {
    totalServices: SERVICE_SLUGS.length,
    baseServices: SERVICE_SLUGS.filter(
      (s) => !s.includes("-brighton") && !s.includes("-canterbury") && !s.includes("-hastings")
    ).length,
    locationServices: SERVICE_SLUGS.filter(
      (s) => s.includes("-brighton") || s.includes("-canterbury") || s.includes("-hastings")
    ).length,
    services: SERVICE_SLUGS,
    timestamp: new Date().toISOString(),
  };

  const inventoryPath = path.join(SNAPSHOT_DIR, "inventory.json");
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));

  console.log("\n✅ Service inventory created");
  console.log(`   Total: ${inventory.totalServices}`);
  console.log(`   Base: ${inventory.baseServices}`);
  console.log(`   Location-specific: ${inventory.locationServices}`);
  console.log(`   Saved to: ${inventoryPath}\n`);

  return inventory;
}

/**
 * Create README for snapshot directory
 */
function createSnapshotReadme() {
  const readme = `# Migration Snapshots

This directory contains baseline snapshots taken before migrating services to MDX-first architecture.

## Contents

- **baseline.json** - Complete serviceDataMap extracted from page.tsx
- **inventory.json** - List of all services to be migrated
- **screenshots/** - Visual snapshots of each service page (requires Playwright)
- **html-snapshots/** - Raw HTML of rendered pages (requires dev server)
- **metadata/** - SEO metadata extracted from each page

## Usage

These snapshots are used for comparison testing to ensure zero regression during migration.

Run comparison test:
\`\`\`bash
npm run test:migration -- --phase compare
\`\`\`

## Timestamp

Created: ${new Date().toISOString()}
Branch: ${getCurrentBranch()}
Commit: ${getCurrentCommit()}
`;

  const readmePath = path.join(SNAPSHOT_DIR, "README.md");
  fs.writeFileSync(readmePath, readme);
  console.log(`✅ README created: ${readmePath}`);
}

function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

function getCurrentCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🔍 Creating Baseline Snapshot");
  console.log("=".repeat(60) + "\n");

  // Setup
  ensureSnapshotDir();

  // Generate inventory
  const inventory = generateInventory();

  // Create README
  createSnapshotReadme();

  // Manual extraction prompt
  promptManualExtraction();

  console.log("\n📝 Next Steps After Manual Extraction:");
  console.log("1. ✅ Inventory created");
  console.log("2. ⏳ Extract serviceDataMap to baseline.json (MANUAL)");
  console.log("3. ⏳ Run visual tests: npm run test:visual-regression (optional)");
  console.log("4. ⏳ Proceed with migration once baseline.json exists");
  console.log("\nOnce baseline.json is ready, run:");
  console.log("  npm run test:migration -- --phase compare\n");
}

if (require.main === module) {
  main().catch(console.error);
}

export { SERVICE_SLUGS, generateInventory };
