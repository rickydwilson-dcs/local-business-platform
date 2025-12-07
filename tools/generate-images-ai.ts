#!/usr/bin/env tsx
/**
 * AI Image Generator
 * Generates images using Gemini 2.0 Flash API from manifest prompts
 *
 * Usage:
 *   pnpm images:generate              # Generate all pending images
 *   pnpm images:generate --limit 5    # Generate only 5 images
 *   pnpm images:generate --dry-run    # Preview without executing
 *
 * Environment Variables:
 *   GOOGLE_AI_API_KEY - Required API key for Gemini
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ImageManifest, ImageEntry } from "./lib/manifest-types";

const MANIFEST_PATH = path.join(process.cwd(), "output/image-manifest.json");
const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images");
// Available image generation models:
// - gemini-2.0-flash-exp - Experimental Flash model (geo-restricted for image gen)
// - gemini-3-pro-image-preview (aka "Nano Banana Pro") - Advanced model with higher quality
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const REQUEST_DELAY_MS = 3000; // 3 seconds between requests to avoid rate limits
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 10000; // Start with 10 second backoff for rate limits

interface GeneratorOptions {
  limit?: number;
  dryRun?: boolean;
  continue?: boolean;
}

interface GenerationResult {
  success: number;
  errors: number;
  skipped: number;
  details: {
    id: string;
    status: "success" | "error" | "skipped";
    message?: string;
  }[];
}

/**
 * Load the image manifest from disk
 */
function loadManifest(): ImageManifest {
  try {
    const data = fs.readFileSync(MANIFEST_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load manifest: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save the updated manifest to disk
 */
function saveManifest(manifest: ImageManifest): void {
  try {
    // Update timestamp and status counts
    manifest.generated = new Date().toISOString();
    manifest.statusCounts = {
      pending: 0,
      generated: 0,
      uploaded: 0,
      complete: 0,
      error: 0,
    };

    for (const image of manifest.images) {
      manifest.statusCounts[image.status]++;
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save manifest: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Ensure output directory exists for the given r2Key
 */
function ensureOutputDirectory(r2Key: string): string {
  const fullPath = path.join(OUTPUT_DIR, r2Key);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return fullPath;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate an image using Gemini API with retry logic
 */
async function generateImage(
  entry: ImageEntry,
  genAI: GoogleGenerativeAI,
  retryCount = 0
): Promise<Buffer> {
  try {
    // Configure model for image generation
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities is available but not in types yet
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Create a prompt optimized for image generation
    const prompt = `Generate a high-quality, photorealistic image: ${entry.prompt}

Important: Generate an 800x600 pixel landscape image. No text or watermarks on the image.`;

    console.log(`  📤 Calling Gemini API...`);
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image data from response candidates
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in API response");
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in API response");
    }

    // Look for image data in the parts
    for (const part of parts) {
      // Check for inline image data (base64)
      if (part.inlineData && part.inlineData.data) {
        console.log(`  📥 Received image data (${part.inlineData.mimeType || "image/png"})`);
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        return buffer;
      }
    }

    // If no image found, log what we received
    console.log(
      `  ℹ️  Response parts:`,
      parts.map((p) => ({
        hasText: !!p.text,
        hasInlineData: !!p.inlineData,
      }))
    );

    throw new Error(
      "No image data found in API response. The model may have returned text instead of an image."
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(`  ⚠️  API Error: ${error.message}`);

      // Handle rate limiting with exponential backoff
      if (
        error.message.includes("429") ||
        error.message.includes("rate limit") ||
        error.message.includes("RESOURCE_EXHAUSTED") ||
        error.message.includes("quota")
      ) {
        if (retryCount < MAX_RETRIES) {
          const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, retryCount);
          console.log(
            `  ⏳ Rate limited. Retrying in ${Math.round(backoffMs / 1000)}s (attempt ${retryCount + 1}/${MAX_RETRIES})`
          );
          await sleep(backoffMs);
          return generateImage(entry, genAI, retryCount + 1);
        }
        throw new Error(
          `Rate limit exceeded after ${MAX_RETRIES} retries. Please wait and try again, or enable billing for higher quotas.`
        );
      }

      // Handle model not found errors
      if (error.message.includes("not found") || error.message.includes("404")) {
        throw new Error(
          `Model "${GEMINI_MODEL}" not found. Try using "gemini-2.0-flash-exp" or check available models at https://ai.google.dev/gemini-api/docs/models`
        );
      }

      throw error;
    }
    throw error;
  }
}

/**
 * Save image buffer to disk
 */
async function saveImage(buffer: Buffer, r2Key: string): Promise<void> {
  try {
    const outputPath = ensureOutputDirectory(r2Key);
    fs.writeFileSync(outputPath, buffer);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Process a single image entry
 */
async function processImageEntry(
  entry: ImageEntry,
  genAI: GoogleGenerativeAI | null,
  manifest: ImageManifest,
  options: GeneratorOptions
): Promise<{ status: "success" | "error" | "skipped"; message?: string }> {
  try {
    // Skip if already generated and continue flag is set (default behavior)
    if (options.continue !== false && entry.status === "generated") {
      return { status: "skipped", message: "Already generated" };
    }

    // Check if output file already exists
    const outputPath = path.join(OUTPUT_DIR, entry.r2Key);
    if (fs.existsSync(outputPath) && options.continue !== false) {
      return { status: "skipped", message: "File already exists" };
    }

    if (options.dryRun) {
      console.log(`  [DRY RUN] Would generate: ${entry.r2Key}`);
      console.log(`  Prompt: ${entry.prompt.substring(0, 100)}...`);
      return { status: "skipped", message: "Dry run" };
    }

    if (!genAI) {
      throw new Error("GoogleGenerativeAI not initialized");
    }

    // Generate the image
    const imageBuffer = await generateImage(entry, genAI);

    // Save the image
    await saveImage(imageBuffer, entry.r2Key);

    // Update manifest entry
    entry.status = "generated";
    entry.updatedAt = new Date().toISOString();
    delete entry.error;

    return { status: "success" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Update manifest entry with error
    entry.status = "error";
    entry.error = errorMessage;
    entry.updatedAt = new Date().toISOString();

    return { status: "error", message: errorMessage };
  }
}

/**
 * Main processing function
 */
async function processImages(options: GeneratorOptions): Promise<void> {
  console.log("\n🎨 AI Image Generator\n");
  console.log(`Model: ${GEMINI_MODEL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Validate API key (not required for dry run)
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey && !options.dryRun) {
    throw new Error("GOOGLE_AI_API_KEY environment variable is required");
  }

  if (options.dryRun) {
    console.log("⚠️  DRY RUN MODE - No images will be generated\n");
  }

  // Load manifest
  console.log("📋 Loading manifest...");
  const manifest = loadManifest();

  // Filter for pending images
  const pendingImages = manifest.images.filter((img) => img.status === "pending");
  console.log(`   Found ${pendingImages.length} pending images (${manifest.totalImages} total)\n`);

  if (pendingImages.length === 0) {
    console.log("✅ No pending images to process");
    return;
  }

  // Apply limit if specified
  const imagesToProcess = options.limit ? pendingImages.slice(0, options.limit) : pendingImages;

  console.log(
    `🚀 Processing ${imagesToProcess.length} images${options.limit ? ` (limited from ${pendingImages.length})` : ""}\n`
  );

  // Initialize Gemini (only if not dry run)
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  // Process images
  const results: GenerationResult = {
    success: 0,
    errors: 0,
    skipped: 0,
    details: [],
  };

  for (let i = 0; i < imagesToProcess.length; i++) {
    const entry = imagesToProcess[i];
    const progress = `[${i + 1}/${imagesToProcess.length}]`;

    console.log(`${progress} ${entry.id}`);
    console.log(`   Type: ${entry.type}`);
    console.log(`   Location: ${entry.location}`);
    console.log(`   Title: ${entry.cardTitle}`);

    const result = await processImageEntry(entry, genAI, manifest, options);

    if (result.status === "success") {
      console.log(`   ✅ Generated successfully`);
      results.success++;
    } else if (result.status === "error") {
      console.log(`   ❌ Error: ${result.message}`);
      results.errors++;
    } else {
      console.log(`   ⏭️  Skipped: ${result.message}`);
      results.skipped++;
    }

    results.details.push({
      id: entry.id,
      status: result.status,
      message: result.message,
    });

    // Save manifest after each image (for progress tracking)
    if (!options.dryRun) {
      saveManifest(manifest);
    }

    // Rate limiting delay (except for last image)
    if (i < imagesToProcess.length - 1 && !options.dryRun) {
      await sleep(REQUEST_DELAY_MS);
    }

    console.log(""); // Blank line between images
  }

  // Print summary
  console.log("=".repeat(60));
  console.log("📊 Generation Summary\n");
  console.log(`   ✅ Successful: ${results.success}`);
  console.log(`   ❌ Errors:     ${results.errors}`);
  console.log(`   ⏭️  Skipped:    ${results.skipped}`);
  console.log(`   📝 Total:      ${imagesToProcess.length}`);
  console.log("=".repeat(60));

  // Show errors if any
  if (results.errors > 0) {
    console.log("\n❌ Errors encountered:\n");
    results.details
      .filter((d) => d.status === "error")
      .forEach((d) => {
        console.log(`   ${d.id}: ${d.message}`);
      });
  }

  if (!options.dryRun) {
    console.log(`\n✅ Manifest updated: ${MANIFEST_PATH}`);
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): GeneratorOptions {
  const args = process.argv.slice(2);
  const options: GeneratorOptions = {
    continue: true, // Default to skipping already generated
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--limit" && i + 1 < args.length) {
      const limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        throw new Error("--limit must be a positive number");
      }
      options.limit = limit;
      i++; // Skip next arg
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-continue") {
      options.continue = false;
    } else if (arg === "--help") {
      console.log(`
Usage: pnpm images:generate [options]

Options:
  --limit N      Process only N images (default: all pending)
  --dry-run      Preview API calls without executing
  --no-continue  Regenerate images even if already generated
  --help         Show this help message

Environment Variables:
  GOOGLE_AI_API_KEY  Required API key for Gemini (required)

Examples:
  pnpm images:generate
  pnpm images:generate --limit 5
  pnpm images:generate --dry-run --limit 3
      `);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    const options = parseArgs();
    await processImages(options);
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
