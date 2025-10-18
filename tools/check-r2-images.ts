#!/usr/bin/env tsx
/**
 * Check if images exist in R2 bucket
 */

import { R2Client } from "./lib/r2-client";
import * as dotenv from "dotenv";
import * as path from "path";

// Load root .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const imagePaths = [
  "colossus-reference/hero/service/commercial-scaffolding_01.webp",
  "colossus-reference/hero/service/residential-scaffolding_01.webp",
  "colossus-reference/hero/service/access-scaffolding_01.webp",
  "colossus-reference/hero/service/facade-scaffolding_01.webp",
  "colossus-reference/hero/service/edge-protection_01.webp",
  "colossus-reference/hero/service/scaffolding-design-drawings_01.webp",
  "colossus-reference/hero/home/main_01.webp",
];

async function checkImages() {
  console.log("🔍 Checking R2 images...\n");

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  console.log("Environment variables:");
  console.log(`  R2_ACCOUNT_ID: ${accountId ? "✅ Set" : "❌ Missing"}`);
  console.log(`  R2_ACCESS_KEY_ID: ${accessKeyId ? "✅ Set" : "❌ Missing"}`);
  console.log(`  R2_SECRET_ACCESS_KEY: ${secretAccessKey ? "✅ Set" : "❌ Missing"}`);
  console.log(`  R2_BUCKET_NAME: ${bucketName || "❌ Missing"}`);
  console.log(`  NEXT_PUBLIC_R2_PUBLIC_URL: ${publicUrl || "❌ Missing"}\n`);

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("❌ Missing R2 configuration");
    process.exit(1);
  }

  const r2 = new R2Client(accountId, accessKeyId, secretAccessKey, bucketName);

  console.log("Checking sample images:\n");

  for (const imagePath of imagePaths) {
    try {
      const exists = await r2.fileExists(imagePath);
      const publicImageUrl = `${publicUrl}/${imagePath}`;
      if (exists) {
        console.log(`✅ ${imagePath}`);
        console.log(`   URL: ${publicImageUrl}\n`);
      } else {
        console.log(`❌ ${imagePath} - NOT FOUND\n`);
      }
    } catch (error) {
      console.log(`⚠️  ${imagePath} - Error: ${error}\n`);
    }
  }

  console.log("\n📊 Listing all files in bucket...");
  const files = await r2.listFiles();
  console.log(`\nTotal files: ${files.length}\n`);

  if (files.length === 0) {
    console.log("⚠️  No files found in bucket!");
  } else {
    console.log("Sample files:");
    files.slice(0, 10).forEach((file) => {
      console.log(`  - ${file}`);
    });
    if (files.length > 10) {
      console.log(`  ... and ${files.length - 10} more`);
    }
  }
}

checkImages().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
