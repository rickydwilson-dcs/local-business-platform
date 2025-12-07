#!/usr/bin/env tsx
/**
 * AI Image Generator - Batch API Version
 * Uses Gemini Batch API which has different quotas (2M tokens) vs real-time API (limited RPD)
 *
 * Usage:
 *   pnpm images:batch:create      # Create batch job for pending images
 *   pnpm images:batch:status      # Check batch job status
 *   pnpm images:batch:download    # Download completed images
 *
 * Environment Variables:
 *   GOOGLE_AI_API_KEY - Required API key for Gemini
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import type { ImageManifest, ImageEntry } from "./lib/manifest-types";

const MANIFEST_PATH = path.join(process.cwd(), "output/image-manifest.json");
const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images");
const BATCH_JOBS_PATH = path.join(process.cwd(), "output/batch-jobs.json");
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

interface BatchJob {
  name: string;
  displayName: string;
  state: string;
  createTime: string;
  imageIds: string[];
}

interface BatchJobsFile {
  jobs: BatchJob[];
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
 * Load batch jobs from disk
 */
function loadBatchJobs(): BatchJobsFile {
  try {
    if (fs.existsSync(BATCH_JOBS_PATH)) {
      const data = fs.readFileSync(BATCH_JOBS_PATH, "utf-8");
      return JSON.parse(data);
    }
    return { jobs: [] };
  } catch {
    return { jobs: [] };
  }
}

/**
 * Save batch jobs to disk
 */
function saveBatchJobs(jobs: BatchJobsFile): void {
  fs.writeFileSync(BATCH_JOBS_PATH, JSON.stringify(jobs, null, 2), "utf-8");
}

/**
 * Create a batch job request for an image entry
 */
function createBatchRequest(entry: ImageEntry): object {
  const prompt = `Generate a high-quality, photorealistic image: ${entry.prompt}

Important: Generate an 800x600 pixel landscape image. No text or watermarks on the image.`;

  return {
    key: entry.id,
    request: {
      model: `models/${GEMINI_MODEL}`,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    },
  };
}

/**
 * Create a batch job for pending images
 */
async function createBatchJob(limit?: number): Promise<void> {
  console.log("\n🎨 Gemini Batch Image Generator\n");
  console.log(`Model: ${GEMINI_MODEL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY environment variable is required");
  }

  // Load manifest
  console.log("📋 Loading manifest...");
  const manifest = loadManifest();

  // Filter for pending images
  const pendingImages = manifest.images.filter((img) => img.status === "pending");
  console.log(`   Found ${pendingImages.length} pending images\n`);

  if (pendingImages.length === 0) {
    console.log("✅ No pending images to process");
    return;
  }

  // Apply limit if specified
  const imagesToProcess = limit ? pendingImages.slice(0, limit) : pendingImages;
  console.log(`🚀 Creating batch job for ${imagesToProcess.length} images\n`);

  // Create JSONL file for batch input
  const jsonlPath = path.join(process.cwd(), "output/batch-input.jsonl");
  const jsonlContent = imagesToProcess
    .map((entry) => JSON.stringify(createBatchRequest(entry)))
    .join("\n");

  fs.writeFileSync(jsonlPath, jsonlContent, "utf-8");
  console.log(`📝 Created batch input file: ${jsonlPath}`);

  // First, upload the JSONL file to Google's file API
  console.log("📤 Uploading batch input file...");

  const formData = new FormData();
  const fileBlob = new Blob([jsonlContent], { type: "application/jsonl" });
  formData.append("file", fileBlob, "batch-input.jsonl");

  const uploadResponse = await fetch(`${API_BASE}/upload/v1beta/files?key=${apiKey}`, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Type": "application/jsonl",
    },
    body: JSON.stringify({
      file: {
        display_name: `batch-input-${Date.now()}.jsonl`,
      },
    }),
  });

  if (!uploadResponse.ok) {
    // Try inline batch instead
    console.log("⚠️  File upload not available, using inline batch...\n");

    // Create batch with inline requests - proper format with request/metadata wrapper
    const batchRequests = imagesToProcess.map((entry) => {
      const prompt = `Generate a high-quality, photorealistic image: ${entry.prompt}

Important: Generate an 800x600 pixel landscape image. No text or watermarks on the image.`;

      return {
        request: {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generation_config: {
            response_modalities: ["TEXT", "IMAGE"],
          },
        },
        metadata: {
          key: entry.id,
        },
      };
    });

    const batchResponse = await fetch(
      `${API_BASE}/models/${GEMINI_MODEL}:batchGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch: {
            display_name: `image-batch-${Date.now()}`,
            input_config: {
              requests: {
                requests: batchRequests,
              },
            },
          },
        }),
      }
    );

    if (!batchResponse.ok) {
      const errorText = await batchResponse.text();
      console.error("❌ Batch API error:", errorText);

      // Parse and show more details
      try {
        const errorJson = JSON.parse(errorText);
        console.error("\nError details:", JSON.stringify(errorJson, null, 2));
      } catch {
        // Not JSON, already printed
      }

      throw new Error(`Failed to create batch job: ${batchResponse.status}`);
    }

    const batchResult = await batchResponse.json();
    console.log("✅ Batch job created successfully!");
    console.log("\nBatch job details:");
    console.log(JSON.stringify(batchResult, null, 2));

    // Save batch job info
    const jobs = loadBatchJobs();
    jobs.jobs.push({
      name: batchResult.name || `batch-${Date.now()}`,
      displayName: `image-batch-${Date.now()}`,
      state: batchResult.state || "PENDING",
      createTime: new Date().toISOString(),
      imageIds: imagesToProcess.map((img) => img.id),
    });
    saveBatchJobs(jobs);

    // Mark images as processing
    for (const img of imagesToProcess) {
      const entry = manifest.images.find((i) => i.id === img.id);
      if (entry) {
        entry.status = "generated"; // Mark as in-progress
        entry.updatedAt = new Date().toISOString();
      }
    }
    saveManifest(manifest);

    console.log(`\n📋 ${imagesToProcess.length} images submitted to batch queue`);
    console.log("   Run 'pnpm images:batch:status' to check progress");
    return;
  }

  // Continue with file-based upload if successful
  const uploadResult = await uploadResponse.json();
  console.log("✅ File uploaded:", uploadResult);
}

/**
 * Check status of batch jobs
 */
async function checkBatchStatus(): Promise<void> {
  console.log("\n📊 Batch Job Status\n");

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY environment variable is required");
  }

  const jobs = loadBatchJobs();

  if (jobs.jobs.length === 0) {
    console.log("No batch jobs found. Create one with 'pnpm images:batch:create'");
    return;
  }

  for (const job of jobs.jobs) {
    console.log(`Job: ${job.displayName}`);
    console.log(`  Name: ${job.name}`);
    console.log(`  Created: ${job.createTime}`);
    console.log(`  Images: ${job.imageIds.length}`);

    // Check status via API if we have a valid job name
    if (job.name && job.name.startsWith("batches/")) {
      const response = await fetch(`${API_BASE}/${job.name}?key=${apiKey}`);

      if (response.ok) {
        const status = await response.json();
        console.log(`  State: ${status.state}`);
        if (status.batchStats) {
          console.log(`  Stats:`, status.batchStats);
        }
        job.state = status.state;
      } else {
        console.log(`  State: ${job.state} (cached)`);
      }
    } else {
      console.log(`  State: ${job.state}`);
    }

    console.log("");
  }

  saveBatchJobs(jobs);
}

/**
 * Download completed batch results
 */
async function downloadBatchResults(): Promise<void> {
  console.log("\n📥 Downloading Batch Results\n");

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY environment variable is required");
  }

  const jobs = loadBatchJobs();
  const manifest = loadManifest();

  if (jobs.jobs.length === 0) {
    console.log("No batch jobs found.");
    return;
  }

  let totalSaved = 0;
  let totalErrors = 0;

  for (const job of jobs.jobs) {
    console.log(`\nProcessing ${job.displayName}...`);
    console.log(`  Batch: ${job.name}`);
    console.log(`  Images: ${job.imageIds.length}`);

    // Fetch batch results
    const response = await fetch(`${API_BASE}/${job.name}?key=${apiKey}`);

    if (!response.ok) {
      console.error(`  ❌ Failed to fetch batch results: ${response.status}`);
      continue;
    }

    const batchResult = await response.json();

    // Check if batch is complete
    if (!batchResult.done) {
      console.log(
        `  ⏳ Batch not complete yet - state: ${batchResult.metadata?.state || "unknown"}`
      );
      continue;
    }

    // Handle the nested response structure:
    // batchResult.response.inlinedResponses.inlinedResponses[]
    const inlinedResponses = batchResult.response?.inlinedResponses?.inlinedResponses;
    if (!inlinedResponses || !Array.isArray(inlinedResponses)) {
      console.log(`  ⚠️  No inlined responses found in batch result`);
      continue;
    }

    console.log(`  Found ${inlinedResponses.length} responses`);

    // Process each response - use metadata.key to identify the image
    for (const responseItem of inlinedResponses) {
      // Get image ID from metadata.key
      const imageId = responseItem.metadata?.key;
      if (!imageId) {
        console.log(`  ⚠️  Response missing metadata.key`);
        totalErrors++;
        continue;
      }

      const entry = manifest.images.find((img) => img.id === imageId);
      if (!entry) {
        console.log(`  ⚠️  No manifest entry for: ${imageId}`);
        totalErrors++;
        continue;
      }

      // Extract image data from response
      const candidates = responseItem.response?.candidates;
      if (!candidates || candidates.length === 0) {
        console.log(`  ⚠️  No candidates for: ${imageId}`);
        totalErrors++;
        continue;
      }

      const parts = candidates[0].content?.parts;
      if (!parts || parts.length === 0) {
        console.log(`  ⚠️  No parts for: ${imageId}`);
        totalErrors++;
        continue;
      }

      // Find the part with image data
      let saved = false;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Save image
          const outputPath = path.join(OUTPUT_DIR, entry.r2Key);
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const buffer = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outputPath, buffer);

          console.log(`  ✅ ${entry.r2Key}`);

          entry.status = "generated";
          entry.updatedAt = new Date().toISOString();
          delete entry.error;
          totalSaved++;
          saved = true;
          break;
        }
      }

      if (!saved) {
        console.log(`  ⚠️  No image data found for: ${imageId}`);
        totalErrors++;
      }
    }
  }

  saveManifest(manifest);
  console.log("\n" + "=".repeat(60));
  console.log("📊 Download Summary\n");
  console.log(`  ✅ Saved: ${totalSaved}`);
  console.log(`  ❌ Errors: ${totalErrors}`);
  console.log("=".repeat(60));
}

/**
 * Parse command line arguments
 */
function parseArgs(): { command: string; limit?: number } {
  const args = process.argv.slice(2);
  const command = args[0] || "create";
  let limit: number | undefined;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--limit" && i + 1 < args.length) {
      limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        throw new Error("--limit must be a positive number");
      }
      i++;
    }
  }

  return { command, limit };
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    const { command, limit } = parseArgs();

    switch (command) {
      case "create":
        await createBatchJob(limit);
        break;
      case "status":
        await checkBatchStatus();
        break;
      case "download":
        await downloadBatchResults();
        break;
      default:
        console.log(`
Usage: pnpm images:batch:<command> [options]

Commands:
  create     Create a batch job for pending images
  status     Check status of existing batch jobs
  download   Download completed images from batch results

Options:
  --limit N  Process only N images (for create command)

Examples:
  pnpm images:batch:create
  pnpm images:batch:create --limit 50
  pnpm images:batch:status
  pnpm images:batch:download
        `);
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
