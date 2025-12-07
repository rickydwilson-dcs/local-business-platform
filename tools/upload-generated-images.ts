#!/usr/bin/env tsx
/**
 * R2 Image Uploader
 * Uploads generated images to Cloudflare R2
 *
 * Usage: pnpm images:upload [--dry-run] [--limit N] [--verify]
 */

import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "./lib/r2-client";
import type { ImageManifest, ImageEntry } from "./lib/manifest-types";

const MANIFEST_PATH = "output/image-manifest.json";
const IMAGES_DIR = "output/generated-images";

interface UploadStats {
  totalToUpload: number;
  successCount: number;
  failCount: number;
  totalBytes: number;
  averageSize: number;
}

interface UploadOptions {
  dryRun?: boolean;
  limit?: number;
  verify?: boolean;
}

/**
 * Load the image manifest
 */
function loadManifest(): ImageManifest {
  try {
    const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to load manifest:", error);
    throw new Error("Could not load image manifest. Run 'pnpm images:manifest' first.");
  }
}

/**
 * Save the updated manifest
 */
function saveManifest(manifest: ImageManifest): void {
  try {
    // Update status counts
    manifest.statusCounts = {
      pending: 0,
      generated: 0,
      uploaded: 0,
      complete: 0,
      error: 0,
    };

    manifest.images.forEach((img) => {
      manifest.statusCounts[img.status]++;
    });

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save manifest:", error);
    throw error;
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Upload a single image to R2
 */
async function uploadImage(entry: ImageEntry, options: UploadOptions): Promise<boolean> {
  const r2Client = getR2Client();
  const localPath = path.join(IMAGES_DIR, entry.r2Key);

  // Check if file exists locally
  if (!fs.existsSync(localPath)) {
    console.error(`  ✗ File not found: ${localPath}`);
    entry.status = "error";
    entry.error = "Local file not found";
    entry.updatedAt = new Date().toISOString();
    return false;
  }

  const fileStats = fs.statSync(localPath);
  const fileSize = fileStats.size;

  if (options.dryRun) {
    console.log(`  → Would upload: ${entry.r2Key} (${formatBytes(fileSize)})`);
    return true;
  }

  try {
    const result = await r2Client.uploadFile(localPath, entry.r2Key, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        location: entry.location,
        type: entry.type,
        generatedAt: entry.updatedAt || new Date().toISOString(),
      },
    });

    if (result.success) {
      entry.status = "uploaded";
      entry.error = undefined;
      entry.updatedAt = new Date().toISOString();
      console.log(`  ✓ Uploaded: ${entry.r2Key} (${formatBytes(fileSize)})`);
      return true;
    } else {
      entry.status = "error";
      entry.error = result.error || "Upload failed";
      entry.updatedAt = new Date().toISOString();
      console.error(`  ✗ Failed: ${entry.r2Key} - ${result.error}`);
      return false;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    entry.status = "error";
    entry.error = errorMsg;
    entry.updatedAt = new Date().toISOString();
    console.error(`  ✗ Exception: ${entry.r2Key} - ${errorMsg}`);
    return false;
  }
}

/**
 * Verify that an image exists in R2
 */
async function verifyUpload(r2Key: string): Promise<boolean> {
  const r2Client = getR2Client();
  try {
    const exists = await r2Client.fileExists(r2Key);
    return exists;
  } catch {
    return false;
  }
}

/**
 * Process uploads with given options
 */
async function processUploads(options: UploadOptions): Promise<void> {
  console.log("\n🚀 R2 Image Upload Tool\n");

  // Load manifest
  console.log("📋 Loading manifest...");
  const manifest = loadManifest();

  // Filter for images that need uploading (status: "generated")
  const toUpload = manifest.images.filter((img) => img.status === "generated");

  if (toUpload.length === 0) {
    console.log(
      "\n✓ No images to upload. All images are either pending, already uploaded, or have errors."
    );
    console.log("\nStatus Summary:");
    console.log(`  Pending:   ${manifest.statusCounts.pending}`);
    console.log(`  Generated: ${manifest.statusCounts.generated}`);
    console.log(`  Uploaded:  ${manifest.statusCounts.uploaded}`);
    console.log(`  Complete:  ${manifest.statusCounts.complete}`);
    console.log(`  Error:     ${manifest.statusCounts.error}`);
    return;
  }

  // Apply limit if specified
  const imagesToProcess = options.limit ? toUpload.slice(0, options.limit) : toUpload;

  console.log(`\nFound ${toUpload.length} generated images`);
  if (options.limit && options.limit < toUpload.length) {
    console.log(`Limiting to first ${options.limit} images`);
  }

  if (options.dryRun) {
    console.log("\n⚠️  DRY RUN MODE - No files will be uploaded\n");
  }

  // Initialize stats
  const stats: UploadStats = {
    totalToUpload: imagesToProcess.length,
    successCount: 0,
    failCount: 0,
    totalBytes: 0,
    averageSize: 0,
  };

  // Process each image
  console.log("\n📤 Uploading images...\n");
  for (let i = 0; i < imagesToProcess.length; i++) {
    const entry = imagesToProcess[i];
    const progress = `[${i + 1}/${imagesToProcess.length}]`;

    console.log(`${progress} ${entry.location} - ${entry.cardTitle}`);

    const success = await uploadImage(entry, options);

    if (success && !options.dryRun) {
      const localPath = path.join(IMAGES_DIR, entry.r2Key);
      if (fs.existsSync(localPath)) {
        const fileSize = fs.statSync(localPath).size;
        stats.totalBytes += fileSize;
      }
      stats.successCount++;
    } else if (!success && !options.dryRun) {
      stats.failCount++;
    }

    // Save manifest after each batch of 10 uploads (or if it's the last one)
    if (!options.dryRun && ((i + 1) % 10 === 0 || i === imagesToProcess.length - 1)) {
      saveManifest(manifest);
      console.log(`  💾 Manifest saved (${i + 1} processed)`);
    }
  }

  // Verify uploads if requested
  if (options.verify && !options.dryRun && stats.successCount > 0) {
    console.log("\n🔍 Verifying uploads...\n");
    let verifiedCount = 0;
    let missingCount = 0;

    for (const entry of imagesToProcess) {
      if (entry.status === "uploaded") {
        const exists = await verifyUpload(entry.r2Key);
        if (exists) {
          verifiedCount++;
        } else {
          missingCount++;
          console.log(`  ⚠️  Missing: ${entry.r2Key}`);
        }
      }
    }

    console.log(`\nVerification: ${verifiedCount} confirmed, ${missingCount} missing`);
  }

  // Calculate average size
  if (stats.successCount > 0) {
    stats.averageSize = stats.totalBytes / stats.successCount;
  }

  // Print final statistics
  console.log("\n" + "=".repeat(60));
  console.log("📊 Upload Statistics");
  console.log("=".repeat(60));
  console.log(`Total to upload:     ${stats.totalToUpload}`);
  console.log(`Successfully uploaded: ${stats.successCount}`);
  console.log(`Failed:              ${stats.failCount}`);
  console.log(`Total bytes:         ${formatBytes(stats.totalBytes)}`);
  if (stats.successCount > 0) {
    console.log(`Average file size:   ${formatBytes(stats.averageSize)}`);
  }
  console.log("=".repeat(60));

  if (!options.dryRun) {
    console.log("\n✓ Manifest updated and saved");
    console.log("\nCurrent Status:");
    console.log(`  Pending:   ${manifest.statusCounts.pending}`);
    console.log(`  Generated: ${manifest.statusCounts.generated}`);
    console.log(`  Uploaded:  ${manifest.statusCounts.uploaded}`);
    console.log(`  Complete:  ${manifest.statusCounts.complete}`);
    console.log(`  Error:     ${manifest.statusCounts.error}`);
  }

  console.log("\n✓ Upload process complete\n");
}

/**
 * Parse CLI arguments
 */
function parseArgs(): UploadOptions {
  const args = process.argv.slice(2);
  const options: UploadOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--verify") {
      options.verify = true;
    } else if (arg === "--limit" && i + 1 < args.length) {
      const limit = parseInt(args[i + 1], 10);
      if (!isNaN(limit) && limit > 0) {
        options.limit = limit;
        i++; // Skip next arg
      } else {
        console.error("Error: --limit must be followed by a positive number");
        process.exit(1);
      }
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
R2 Image Upload Tool

Usage: pnpm images:upload [options]

Options:
  --dry-run       Show what would be uploaded without actually uploading
  --limit N       Process only the first N images
  --verify        Verify uploads by checking if files exist in R2
  --help, -h      Show this help message

Examples:
  pnpm images:upload --dry-run --limit 3
  pnpm images:upload --limit 10
  pnpm images:upload --verify
      `);
      process.exit(0);
    } else {
      console.error(`Error: Unknown argument '${arg}'`);
      console.error("Use --help for usage information");
      process.exit(1);
    }
  }

  return options;
}

/**
 * Main execution
 */
async function main() {
  try {
    const options = parseArgs();
    await processUploads(options);
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
