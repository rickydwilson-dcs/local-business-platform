#!/usr/bin/env tsx
/**
 * MDX Image Field Updater
 * Adds image references to MDX card definitions
 *
 * Usage: pnpm images:update-mdx [--dry-run] [--limit N] [--no-backup]
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import type { ImageManifest, ImageEntry } from "./lib/manifest-types";

const MANIFEST_PATH = "output/image-manifest.json";
const LOCATIONS_DIR = "sites/colossus-reference/content/locations";
const BACKUP_DIR = "output/mdx-backups";

// Command line flags
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const noBackup = args.includes("--no-backup");
const limitIndex = args.indexOf("--limit");
const limit =
  limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1]) : undefined;

/**
 * Load the image manifest
 */
function loadManifest(): ImageManifest {
  const manifestPath = path.join(process.cwd(), MANIFEST_PATH);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at ${manifestPath}`);
  }

  const content = fs.readFileSync(manifestPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Save the image manifest
 */
function saveManifest(manifest: ImageManifest): void {
  const manifestPath = path.join(process.cwd(), MANIFEST_PATH);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * Group entries by location slug
 */
function groupEntriesByLocation(entries: ImageEntry[]): Map<string, ImageEntry[]> {
  const grouped = new Map<string, ImageEntry[]>();

  for (const entry of entries) {
    const existing = grouped.get(entry.locationSlug) || [];
    existing.push(entry);
    grouped.set(entry.locationSlug, existing);
  }

  return grouped;
}

/**
 * Create backup of MDX file
 */
function backupFile(filePath: string): void {
  const backupPath = path.join(process.cwd(), BACKUP_DIR);

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const fileName = path.basename(filePath);
  const backupFile = path.join(backupPath, fileName);

  // Only create backup if it doesn't already exist
  if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(filePath, backupFile);
    console.log(`   💾 Created backup: ${fileName}`);
  }
}

/**
 * Find a card by title (case-insensitive, trimmed)
 */
function findCard(cards: any[], title: string): any | undefined {
  return cards.find((card) => card.title?.toLowerCase().trim() === title.toLowerCase().trim());
}

/**
 * Update a card with image field
 */
function updateCard(card: any, r2Key: string): boolean {
  if (!card) return false;

  // Add or update the image field
  card.image = r2Key;
  return true;
}

/**
 * Update an MDX file with image references
 */
async function updateMdxFile(
  locationSlug: string,
  entries: ImageEntry[],
  dryRun: boolean
): Promise<number> {
  const mdxPath = path.join(process.cwd(), LOCATIONS_DIR, `${locationSlug}.mdx`);

  if (!fs.existsSync(mdxPath)) {
    console.log(`   ⚠️  File not found: ${locationSlug}.mdx`);
    return 0;
  }

  // Read and parse MDX
  const fileContent = fs.readFileSync(mdxPath, "utf-8");
  const parsed = matter(fileContent);

  // Create backup before modifying (unless --no-backup or dry-run)
  if (!dryRun && !noBackup) {
    backupFile(mdxPath);
  }

  let updatedCount = 0;

  // Process each entry
  for (const entry of entries) {
    const isSpecialist = entry.type === "specialist-card";
    const cards = isSpecialist ? parsed.data.specialists?.cards : parsed.data.services?.cards;

    if (!cards || !Array.isArray(cards)) {
      console.log(`   ⚠️  No ${entry.type} cards array found`);
      continue;
    }

    // Find and update the card
    const card = findCard(cards, entry.cardTitle);
    if (card) {
      if (updateCard(card, entry.r2Key)) {
        updatedCount++;
        const cardType = isSpecialist ? "specialist" : "service";
        console.log(
          `   ✓ ${dryRun ? "[DRY RUN] Would add" : "Added"} image to ${cardType} card: "${entry.cardTitle}"`
        );
      }
    } else {
      console.log(`   ⚠️  Card not found: "${entry.cardTitle}"`);
    }
  }

  // Write the updated MDX file (unless dry-run)
  if (!dryRun && updatedCount > 0) {
    const updatedContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(mdxPath, updatedContent, "utf-8");
  }

  return updatedCount;
}

/**
 * Update manifest entries to "complete" status
 */
function updateManifestEntries(manifest: ImageManifest, locationSlug: string): void {
  for (const entry of manifest.images) {
    if (entry.locationSlug === locationSlug && entry.status === "uploaded") {
      entry.status = "complete";
      entry.updatedAt = new Date().toISOString();
    }
  }

  // Recalculate status counts
  manifest.statusCounts = {
    pending: 0,
    generated: 0,
    uploaded: 0,
    complete: 0,
    error: 0,
  };

  for (const entry of manifest.images) {
    manifest.statusCounts[entry.status]++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🖼️  MDX Image Field Updater");
  console.log("==========================\n");

  if (isDryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n");
  }
  if (limit) {
    console.log(`📊 Processing limited to ${limit} location(s)\n`);
  }
  if (noBackup) {
    console.log("⚠️  Backup creation disabled\n");
  }

  // Load manifest
  console.log("📂 Loading manifest...");
  const manifest = loadManifest();

  // Filter for uploaded images
  const uploadedEntries = manifest.images.filter((entry) => entry.status === "uploaded");
  console.log(`   Found ${uploadedEntries.length} uploaded images\n`);

  if (uploadedEntries.length === 0) {
    console.log("✨ No uploaded images to process");
    return;
  }

  // Group by location
  const locationGroups = groupEntriesByLocation(uploadedEntries);
  console.log(`📍 Processing ${locationGroups.size} location(s)\n`);

  // Process each location
  let processedLocations = 0;
  let totalUpdated = 0;

  for (const [locationSlug, entries] of locationGroups) {
    // Check limit
    if (limit && processedLocations >= limit) {
      console.log(`\n⏸️  Reached limit of ${limit} location(s)`);
      break;
    }

    console.log(`📁 Processing: ${locationSlug}.mdx`);

    const updated = await updateMdxFile(locationSlug, entries, isDryRun);

    if (updated > 0) {
      console.log(
        `   📝 ${isDryRun ? "Would update" : "Updated"} ${updated} card(s) in ${locationSlug}.mdx`
      );

      // Update manifest status (unless dry-run)
      if (!isDryRun) {
        updateManifestEntries(manifest, locationSlug);
      }
    } else {
      console.log(`   ℹ️  No cards updated in ${locationSlug}.mdx`);
    }

    console.log(); // Empty line between locations
    totalUpdated += updated;
    processedLocations++;
  }

  // Save updated manifest (unless dry-run)
  if (!isDryRun && totalUpdated > 0) {
    saveManifest(manifest);
    console.log("💾 Manifest updated\n");
  }

  // Summary
  console.log("==========================");
  console.log("📊 Summary");
  console.log(`   Locations processed: ${processedLocations}`);
  console.log(`   Cards ${isDryRun ? "that would be" : ""} updated: ${totalUpdated}`);

  if (isDryRun) {
    console.log("\n💡 Run without --dry-run to apply changes");
  } else if (totalUpdated > 0) {
    console.log("\n✅ MDX files updated successfully");
  }
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
});
