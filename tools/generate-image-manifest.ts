#!/usr/bin/env tsx
/**
 * Image Manifest Generator
 * Scans MDX files and generates manifest of required images with AI prompts
 *
 * Usage: tsx tools/generate-image-manifest.ts [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import type { ImageManifest, ImageEntry, CardType } from "./lib/manifest-types";

// Configuration
const LOCATIONS_DIR = path.join(process.cwd(), "sites/colossus-reference/content/locations");
const OUTPUT_FILE = path.join(process.cwd(), "output/image-manifest.json");
const IMAGE_DIMENSIONS = { width: 800, height: 600 };
const MANIFEST_VERSION = "1.0.0";

// Command line flags
const isDryRun = process.argv.includes("--dry-run");

interface Card {
  title: string;
  description: string;
}

interface MDXFrontmatter {
  title: string;
  specialists?: {
    cards?: Card[];
  };
  services?: {
    cards?: Card[];
  };
}

/**
 * Convert text to URL-safe slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate AI-friendly prompt for a card image
 */
function generatePrompt(card: Card, location: string, type: CardType): string {
  const baseContext = card.description;
  const locationContext = `in ${location}, UK setting`;

  // Build scaffolding-specific context
  const scaffoldingKeywords = [
    "professional scaffolding",
    "scaffolding tubes and boards",
    "construction site safety equipment",
    "metal framework",
  ];

  // Style modifiers
  const styleModifiers = [
    "photorealistic",
    "professional photography style",
    "natural daylight",
    "sharp focus",
    "commercial quality",
  ];

  // Combine elements into a descriptive prompt
  const cardContext = baseContext.toLowerCase().includes("scaffolding")
    ? baseContext
    : `${baseContext} with professional scaffolding installation`;

  // For specialist cards, focus on the specific heritage/building type
  // For service cards, focus on the scaffolding service being provided
  const focusContext =
    type === "specialist-card"
      ? `featuring ${card.title.toLowerCase()}`
      : `showing ${card.title.toLowerCase()} setup`;

  const prompt = `${cardContext} ${focusContext} ${locationContext}, ${scaffoldingKeywords.join(", ")}, construction workers in high-visibility safety gear and hard hats, ${styleModifiers.join(", ")}`;

  // Clean up the prompt - remove duplicate spaces and ensure proper capitalization
  return prompt
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
}

/**
 * Create an image entry for a card
 */
function createImageEntry(
  card: Card,
  location: string,
  locationSlug: string,
  type: CardType,
  index: number
): ImageEntry {
  const cardSlug = slugify(card.title);
  const typePrefix = type === "specialist-card" ? "specialist" : "service";

  const id = `loc-${locationSlug}-${typePrefix}-${cardSlug}`;
  const r2Key = `colossus-reference/cards/locations/${locationSlug}/${typePrefix}-${cardSlug}.webp`;
  const prompt = generatePrompt(card, location, type);

  return {
    id,
    type,
    location,
    locationSlug,
    cardTitle: card.title,
    cardDescription: card.description,
    r2Key,
    dimensions: IMAGE_DIMENSIONS,
    prompt,
    status: "pending",
  };
}

/**
 * Scan location MDX files and extract cards
 */
function scanLocationFiles(): ImageEntry[] {
  const entries: ImageEntry[] = [];

  console.log(`📂 Scanning MDX files in: ${LOCATIONS_DIR}\n`);

  // Read all MDX files
  const files = fs
    .readdirSync(LOCATIONS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  console.log(`📄 Found ${files.length} location files\n`);

  for (const file of files) {
    const filePath = path.join(LOCATIONS_DIR, file);
    const locationSlug = file.replace(/\.mdx$/, "");

    // Parse MDX frontmatter
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const frontmatter = data as MDXFrontmatter;

    const locationName = frontmatter.title;
    let locationCardCount = 0;

    // Extract specialist cards
    if (frontmatter.specialists?.cards) {
      const specialistCards = frontmatter.specialists.cards;
      console.log(`  🏛️  ${locationName}: Processing ${specialistCards.length} specialist cards`);

      specialistCards.forEach((card, index) => {
        const entry = createImageEntry(card, locationName, locationSlug, "specialist-card", index);
        entries.push(entry);
        locationCardCount++;
      });
    }

    // Extract service cards
    if (frontmatter.services?.cards) {
      const serviceCards = frontmatter.services.cards;
      console.log(`  🔧 ${locationName}: Processing ${serviceCards.length} service cards`);

      serviceCards.forEach((card, index) => {
        const entry = createImageEntry(card, locationName, locationSlug, "service-card", index);
        entries.push(entry);
        locationCardCount++;
      });
    }

    console.log(`  ✅ ${locationName}: Generated ${locationCardCount} image entries\n`);
  }

  return entries;
}

/**
 * Calculate status counts for manifest
 */
function calculateStatusCounts(entries: ImageEntry[]): Record<string, number> {
  const counts: Record<string, number> = {
    pending: 0,
    generated: 0,
    uploaded: 0,
    complete: 0,
    error: 0,
  };

  entries.forEach((entry) => {
    counts[entry.status]++;
  });

  return counts;
}

/**
 * Generate the complete manifest
 */
function generateManifest(entries: ImageEntry[]): ImageManifest {
  return {
    generated: new Date().toISOString(),
    version: MANIFEST_VERSION,
    totalImages: entries.length,
    statusCounts: calculateStatusCounts(entries),
    images: entries,
  };
}

/**
 * Write manifest to file
 */
function writeManifest(manifest: ImageManifest): void {
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write manifest with pretty formatting
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * Display summary statistics
 */
function displaySummary(manifest: ImageManifest): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 MANIFEST GENERATION SUMMARY");
  console.log("=".repeat(60) + "\n");

  console.log(`Total Images:        ${manifest.totalImages}`);
  console.log(
    `Specialist Cards:    ${manifest.images.filter((e) => e.type === "specialist-card").length}`
  );
  console.log(
    `Service Cards:       ${manifest.images.filter((e) => e.type === "service-card").length}`
  );
  console.log(`Locations Processed: ${new Set(manifest.images.map((e) => e.locationSlug)).size}`);

  console.log("\nStatus Breakdown:");
  Object.entries(manifest.statusCounts).forEach(([status, count]) => {
    if (count > 0) {
      console.log(`  ${status.padEnd(10)}: ${count}`);
    }
  });

  if (!isDryRun) {
    console.log(`\n📁 Output File: ${OUTPUT_FILE}`);
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log(`📦 File Size:   ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
    }
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

/**
 * Display sample prompts
 */
function displaySamplePrompts(manifest: ImageManifest): void {
  console.log("🎨 SAMPLE PROMPTS\n");

  // Show 1 specialist and 1 service card example
  const specialistExample = manifest.images.find((e) => e.type === "specialist-card");
  const serviceExample = manifest.images.find((e) => e.type === "service-card");

  if (specialistExample) {
    console.log("Example Specialist Card:");
    console.log(`  Location: ${specialistExample.location}`);
    console.log(`  Title:    ${specialistExample.cardTitle}`);
    console.log(`  ID:       ${specialistExample.id}`);
    console.log(`  Prompt:   ${specialistExample.prompt}`);
    console.log();
  }

  if (serviceExample) {
    console.log("Example Service Card:");
    console.log(`  Location: ${serviceExample.location}`);
    console.log(`  Title:    ${serviceExample.cardTitle}`);
    console.log(`  ID:       ${serviceExample.id}`);
    console.log(`  Prompt:   ${serviceExample.prompt}`);
    console.log();
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("\n🚀 Image Manifest Generator");
  console.log("=".repeat(60) + "\n");

  if (isDryRun) {
    console.log("⚠️  DRY RUN MODE - No files will be written\n");
  }

  try {
    // Scan and generate entries
    const entries = scanLocationFiles();

    // Generate complete manifest
    const manifest = generateManifest(entries);

    // Write manifest first (unless dry run)
    if (!isDryRun) {
      writeManifest(manifest);
    }

    // Display summary
    displaySummary(manifest);

    // Display sample prompts
    displaySamplePrompts(manifest);

    // Final message
    if (!isDryRun) {
      console.log("✅ Manifest generated successfully!\n");
    } else {
      console.log("ℹ️  Dry run complete - no files written\n");
    }
  } catch (error) {
    console.error("❌ Error generating manifest:", error);
    process.exit(1);
  }
}

// Execute
main();
