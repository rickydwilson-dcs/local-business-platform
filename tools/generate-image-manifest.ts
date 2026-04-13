#!/usr/bin/env tsx
/**
 * Image Manifest Generator
 * Scans MDX files and generates manifest of required images with AI prompts.
 *
 * Usage:
 *   tsx tools/generate-image-manifest.ts [--dry-run] [--site <path>] [--style-prompt <text>]
 *
 * Examples:
 *   tsx tools/generate-image-manifest.ts --site sites/colossus-scaffolding
 *   tsx tools/generate-image-manifest.ts --site sites/dj-fox-electrical --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import type { ImageManifest, ImageEntry, CardType } from "./lib/manifest-types";

// ── Argument parsing ─────────────────────────────────────────────────────────

function parseArgs(): { dryRun: boolean; site: string; stylePrompt?: string } {
  const args = process.argv.slice(2);
  let dryRun = false;
  let site = "sites/colossus-scaffolding"; // backward-compatible default
  let stylePrompt: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--site" && args[i + 1]) site = args[++i];
    else if (args[i] === "--style-prompt" && args[i + 1]) stylePrompt = args[++i];
  }

  return { dryRun, site, stylePrompt };
}

const cliArgs = parseArgs();
const SITE_DIR = path.resolve(cliArgs.site);
const OUTPUT_FILE = path.join(process.cwd(), "output/image-manifest.json");
const IMAGE_DIMENSIONS = { width: 800, height: 600 };
const MANIFEST_VERSION = "1.0.0";
const isDryRun = cliArgs.dryRun;

// ── Types ────────────────────────────────────────────────────────────────────

interface Card {
  title: string;
  description: string;
}

interface MDXFrontmatter {
  title: string;
  image?: string;
  specialists?: {
    cards?: Card[];
  };
  services?: {
    cards?: Card[];
  };
  [key: string]: unknown;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generatePrompt(card: Card, context: string, type: CardType, stylePrompt?: string): string {
  const baseContext = card.description;
  const locationContext = `in ${context}, UK setting`;

  const styleModifiers = stylePrompt
    ? [stylePrompt]
    : [
        "photorealistic",
        "professional photography style",
        "natural daylight",
        "sharp focus",
        "commercial quality",
      ];

  const focusContext =
    type === "specialist-card"
      ? `featuring ${card.title.toLowerCase()}`
      : `showing ${card.title.toLowerCase()} setup`;

  const prompt = `${baseContext} ${focusContext} ${locationContext}, ${styleModifiers.join(", ")}`;

  return prompt
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
}

function createImageEntry(
  card: Card,
  contextName: string,
  contextSlug: string,
  type: CardType,
  siteName: string,
  stylePrompt?: string
): ImageEntry {
  const cardSlug = slugify(card.title);
  const typePrefix = type === "specialist-card" ? "specialist" : "service";
  const id = `loc-${contextSlug}-${typePrefix}-${cardSlug}`;
  const r2Key = `${siteName}/cards/locations/${contextSlug}/${typePrefix}-${cardSlug}.webp`;
  const prompt = generatePrompt(card, contextName, type, stylePrompt);

  return {
    id,
    type,
    location: contextName,
    locationSlug: contextSlug,
    cardTitle: card.title,
    cardDescription: card.description,
    r2Key,
    dimensions: IMAGE_DIMENSIONS,
    prompt,
    status: "pending",
  };
}

// ── Scanners ─────────────────────────────────────────────────────────────────

function scanContentDir(
  contentDir: string,
  contentType: string,
  siteName: string,
  stylePrompt?: string
): ImageEntry[] {
  const entries: ImageEntry[] = [];

  if (!fs.existsSync(contentDir)) return entries;

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const slug = file.replace(/\.mdx$/, "");

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const frontmatter = data as MDXFrontmatter;

    const contextName = frontmatter.title;
    let count = 0;

    // Specialist cards
    if (frontmatter.specialists?.cards) {
      for (const card of frontmatter.specialists.cards) {
        entries.push(
          createImageEntry(card, contextName, slug, "specialist-card", siteName, stylePrompt)
        );
        count++;
      }
    }

    // Service cards
    if (frontmatter.services?.cards) {
      for (const card of frontmatter.services.cards) {
        entries.push(
          createImageEntry(card, contextName, slug, "service-card", siteName, stylePrompt)
        );
        count++;
      }
    }

    // Frontmatter image placeholder
    if (
      frontmatter.image !== undefined &&
      (!frontmatter.image || frontmatter.image.includes("placeholder"))
    ) {
      const card: Card = {
        title: frontmatter.title,
        description: `${contentType.slice(0, -1)} page for ${frontmatter.title}`,
      };
      entries.push(
        createImageEntry(card, contextName, slug, "service-card", siteName, stylePrompt)
      );
      count++;
    }

    if (count > 0) {
      console.log(`  ${contentType}/${file}: ${count} image entries`);
    }
  }

  return entries;
}

// ── Manifest utilities ────────────────────────────────────────────────────────

function calculateStatusCounts(entries: ImageEntry[]): Record<string, number> {
  const counts: Record<string, number> = {
    pending: 0,
    generated: 0,
    uploaded: 0,
    complete: 0,
    error: 0,
  };
  for (const entry of entries) {
    counts[entry.status]++;
  }
  return counts;
}

function generateManifest(entries: ImageEntry[]): ImageManifest {
  return {
    generated: new Date().toISOString(),
    version: MANIFEST_VERSION,
    totalImages: entries.length,
    statusCounts: calculateStatusCounts(entries),
    images: entries,
  };
}

function writeManifest(manifest: ImageManifest): void {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
}

function displaySummary(manifest: ImageManifest): void {
  console.log("\n" + "=".repeat(60));
  console.log("MANIFEST GENERATION SUMMARY");
  console.log("=".repeat(60) + "\n");
  console.log(`Total Images:     ${manifest.totalImages}`);
  console.log(`Locations:        ${new Set(manifest.images.map((e) => e.locationSlug)).size}`);
  console.log("\nStatus Breakdown:");
  for (const [status, count] of Object.entries(manifest.statusCounts)) {
    if (count > 0) console.log(`  ${status.padEnd(10)}: ${count}`);
  }
  if (!isDryRun) {
    console.log(`\nOutput: ${OUTPUT_FILE}`);
  }
  console.log("\n" + "=".repeat(60) + "\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\nImage Manifest Generator");
  console.log("=".repeat(60) + "\n");

  if (isDryRun) {
    console.log("DRY RUN MODE - No files will be written\n");
  }

  if (!fs.existsSync(SITE_DIR)) {
    console.error(`Site directory not found: ${SITE_DIR}`);
    process.exit(1);
  }

  const siteName = path.basename(SITE_DIR);
  console.log(`Site: ${siteName} (${SITE_DIR})\n`);

  try {
    const contentRoot = path.join(SITE_DIR, "content");
    const allEntries: ImageEntry[] = [];

    // Scan all content types
    const contentTypes = ["services", "locations", "blog", "projects"];
    for (const ct of contentTypes) {
      const dir = path.join(contentRoot, ct);
      const entries = scanContentDir(dir, ct, siteName, cliArgs.stylePrompt);
      allEntries.push(...entries);
    }

    const manifest = generateManifest(allEntries);

    if (!isDryRun) {
      writeManifest(manifest);
    }

    displaySummary(manifest);

    if (isDryRun) {
      console.log("Dry run complete - no files written\n");
    } else {
      console.log("Manifest generated successfully!\n");
    }
  } catch (error) {
    console.error("Error generating manifest:", error);
    process.exit(1);
  }
}

main();
