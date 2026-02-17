#!/usr/bin/env node
/**
 * Add category field to DJ Fox Electrical service MDX files
 *
 * Usage: npx tsx tools/add-service-categories.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { globSync } from "glob";

const SERVICES_DIR = "sites/dj-fox-electrical/content/services";

// Category mapping based on service purpose
const CATEGORY_MAP: Record<string, "installation" | "maintenance" | "repair"> = {
  // Installation services (new equipment/systems)
  "access-control-systems": "installation",
  "additional-circuits": "installation",
  "additional-sockets": "installation",
  "battery-storage-installation": "installation",
  "cctv-installation": "installation",
  "commercial-fire-alarm-systems": "installation",
  "data-network-cabling": "installation",
  "dimmer-switch-installation": "installation",
  "electric-cooker-installation": "installation",
  "electric-gates": "installation",
  "electric-shower-installation": "installation",
  "extractor-fan-installation": "installation",
  "ev-charger-installation": "installation",
  "fire-alarm-installation": "installation",
  "garden-lighting": "installation",
  "intruder-alarm-installation": "installation",
  "led-lighting-upgrade": "installation",
  "lighting-installation": "installation",
  "new-build-electrical": "installation",
  "office-fitout-electrical": "installation",
  "outdoor-socket-installation": "installation",
  "security-lighting": "installation",
  "smart-home-wiring": "installation",
  "smart-lighting": "installation",
  "solar-panel-installation": "installation",
  "storage-heater-installation": "installation",
  "three-phase-installation": "installation",
  "underfloor-heating-electric": "installation",
  "usb-socket-installation": "installation",

  // Maintenance services (inspections/upgrades/servicing)
  "commercial-maintenance-contracts": "maintenance",
  "consumer-unit-upgrade": "maintenance",
  "electrical-safety-certificate": "maintenance",
  "emergency-lighting-testing": "maintenance",
  "kitchen-bathroom-electrical": "maintenance",
  "landlord-safety-package": "maintenance",
  "pat-testing": "maintenance",
  rewiring: "maintenance",

  // Repair services (fixing problems/emergencies)
  "circuit-repair": "repair",
  "emergency-electrical-callout": "repair",
  "fault-finding": "repair",
  "light-switch-repair": "repair",
  "power-outage-restoration": "repair",
  "socket-repair": "repair",

  // Template/placeholder files (default to installation)
  "primary-service": "installation",
  "secondary-service": "installation",
  "service-three": "installation",
  "service-four": "installation",
  "service-five": "installation",
};

interface ProcessResult {
  file: string;
  status: "added" | "already-exists" | "skipped" | "error";
  category?: string;
  error?: string;
}

function addCategoryToMdx(filePath: string): ProcessResult {
  const fileName = filePath.split("/").pop()?.replace(".mdx", "") || "";
  const category = CATEGORY_MAP[fileName];

  if (!category) {
    return {
      file: filePath,
      status: "skipped",
      error: "No category mapping found",
    };
  }

  try {
    const content = readFileSync(filePath, "utf-8");

    // Check if category already exists
    if (content.match(/^category:/m)) {
      return {
        file: filePath,
        status: "already-exists",
        category,
      };
    }

    // Find the frontmatter closing and insert category before it
    const lines = content.split("\n");
    const closingIndex = lines.findIndex((line, idx) => idx > 0 && line.trim() === "---");

    if (closingIndex === -1) {
      return {
        file: filePath,
        status: "error",
        error: "Could not find frontmatter closing ---",
      };
    }

    // Insert category field before the closing ---
    lines.splice(closingIndex, 0, `category: "${category}"`);

    writeFileSync(filePath, lines.join("\n"), "utf-8");

    return {
      file: filePath,
      status: "added",
      category,
    };
  } catch (error) {
    return {
      file: filePath,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function main() {
  console.log("Adding category field to DJ Fox Electrical service MDX files...\n");

  // Find all service MDX files
  const files = globSync(`${SERVICES_DIR}/*.mdx`, {
    absolute: true,
  });

  if (files.length === 0) {
    console.error(`No MDX files found in ${SERVICES_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} service files\n`);

  const results: ProcessResult[] = files.map(addCategoryToMdx);

  // Group results by status
  const added = results.filter((r) => r.status === "added");
  const alreadyExists = results.filter((r) => r.status === "already-exists");
  const skipped = results.filter((r) => r.status === "skipped");
  const errors = results.filter((r) => r.status === "error");

  // Print summary
  console.log("=== SUMMARY ===\n");
  console.log(`✓ Added category: ${added.length}`);
  console.log(`- Already exists: ${alreadyExists.length}`);
  console.log(`⊘ Skipped: ${skipped.length}`);
  console.log(`✗ Errors: ${errors.length}`);
  console.log("");

  // Print details for added
  if (added.length > 0) {
    console.log("=== ADDED ===");
    added.forEach((r) => {
      const fileName = r.file.split("/").pop();
      console.log(`  ${fileName} → ${r.category}`);
    });
    console.log("");
  }

  // Print details for already exists
  if (alreadyExists.length > 0) {
    console.log("=== ALREADY EXISTS ===");
    alreadyExists.forEach((r) => {
      const fileName = r.file.split("/").pop();
      console.log(`  ${fileName} (${r.category})`);
    });
    console.log("");
  }

  // Print details for skipped
  if (skipped.length > 0) {
    console.log("=== SKIPPED ===");
    skipped.forEach((r) => {
      const fileName = r.file.split("/").pop();
      console.log(`  ${fileName}: ${r.error}`);
    });
    console.log("");
  }

  // Print details for errors
  if (errors.length > 0) {
    console.log("=== ERRORS ===");
    errors.forEach((r) => {
      const fileName = r.file.split("/").pop();
      console.log(`  ${fileName}: ${r.error}`);
    });
    console.log("");
  }

  // Exit with error code if there were errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
