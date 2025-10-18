#!/usr/bin/env tsx
/**
 * Quick script to upload a single image to R2
 */

import { R2Client } from "./lib/r2-client";
import { ImageProcessor } from "./lib/image-processor";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function uploadSingleImage(filePath: string, r2Path: string) {
  console.log(`📤 Uploading ${filePath} to ${r2Path}\n`);

  const r2 = new R2Client({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  });

  const processor = new ImageProcessor();

  // Process image
  console.log("🔄 Processing image...");
  const result = await processor.processImage(filePath, {
    generateWebP: true,
    generateAVIF: false,
    quality: 85,
    responsive: true,
    responsiveSizes: [640, 1280, 1920],
  });

  // Upload main WebP
  console.log("☁️  Uploading WebP...");
  const webpImage = result.processed.find((img) => img.format === "webp" && img.suffix === "");
  if (webpImage) {
    await r2.uploadBuffer(webpImage.buffer, `${r2Path}.webp`, { contentType: "image/webp" });
    console.log(`   ✅ ${r2Path}.webp`);
  } else {
    console.error("   ❌ WebP conversion failed");
    process.exit(1);
  }

  // Upload responsive variants
  const responsiveWebP = result.processed.filter(
    (img) => img.format === "webp" && img.suffix !== ""
  );
  for (const variant of responsiveWebP) {
    const variantPath = `${r2Path}${variant.suffix}.webp`;
    await r2.uploadBuffer(variant.buffer, variantPath, { contentType: "image/webp" });
    console.log(`   ✅ ${variantPath}`);
  }

  console.log("\n✅ Upload complete!");
  console.log(`   Public URL: ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Path}.webp`);
}

// Usage: tsx upload-single-image.ts <local-file-path> <r2-path>
const filePath = process.argv[2];
const r2Path = process.argv[3];

if (!filePath || !r2Path) {
  console.error("Usage: tsx upload-single-image.ts <local-file-path> <r2-path>");
  console.error(
    "Example: tsx upload-single-image.ts image.png colossus-reference/hero/service/image_01"
  );
  process.exit(1);
}

uploadSingleImage(filePath, r2Path);
