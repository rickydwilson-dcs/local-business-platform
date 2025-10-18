#!/usr/bin/env tsx
/**
 * Test R2 Connection
 *
 * Simple script to verify R2 credentials are working.
 * Attempts to list objects in the bucket.
 */

import { getR2Client } from "./lib/r2-client";
import * as fs from "fs";
import * as path from "path";

async function testConnection() {
  console.log("🧪 Testing R2 Connection\n");

  try {
    // Initialize client
    const client = getR2Client();
    console.log(`✓ R2 Client initialized`);
    console.log(`  Bucket: ${client.getBucketName()}\n`);

    // Test: List objects in bucket
    console.log("📋 Listing objects in bucket...");
    const files = await client.listFiles();
    console.log(`✓ Connection successful!`);
    console.log(`  Found ${files.length} object(s) in bucket\n`);

    if (files.length > 0) {
      console.log("📁 Sample files:");
      files.slice(0, 5).forEach((file) => {
        console.log(`  - ${file}`);
      });
      if (files.length > 5) {
        console.log(`  ... and ${files.length - 5} more`);
      }
    }

    // Test: Create a test file and upload
    console.log("\n📤 Testing upload...");
    const testContent = Buffer.from("Test file from R2 setup", "utf-8");
    const testKey = "test/r2-connection-test.txt";

    const uploadResult = await client.uploadBuffer(testContent, testKey, {
      contentType: "text/plain",
      metadata: {
        test: "true",
        timestamp: new Date().toISOString(),
      },
    });

    if (uploadResult.success) {
      console.log(`✓ Upload successful!`);
      console.log(`  Key: ${uploadResult.key}`);
      console.log(`  URL: ${uploadResult.url}`);
      console.log(`  Size: ${uploadResult.size} bytes`);

      // Clean up test file
      console.log("\n🧹 Cleaning up test file...");
      const deleted = await client.deleteFile(testKey);
      if (deleted) {
        console.log("✓ Test file deleted");
      }
    } else {
      console.error(`❌ Upload failed: ${uploadResult.error}`);
      process.exit(1);
    }

    console.log("\n✅ All tests passed! R2 is configured correctly.");
    console.log("\nYou can now use:");
    console.log("  pnpm images:intake <site-slug> <source-directory>");
    console.log("\nExample:");
    console.log("  pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/");
  } catch (error) {
    console.error("\n❌ Connection failed!\n");

    if (error instanceof Error) {
      console.error("Error:", error.message);

      // Provide helpful diagnostics
      if (error.message.includes("R2_ACCOUNT_ID")) {
        console.error("\n💡 Missing R2_ACCOUNT_ID in .env.local");
      } else if (error.message.includes("R2_ACCESS_KEY_ID")) {
        console.error("\n💡 Missing R2_ACCESS_KEY_ID in .env.local");
      } else if (error.message.includes("R2_SECRET_ACCESS_KEY")) {
        console.error("\n💡 Missing R2_SECRET_ACCESS_KEY in .env.local");
      } else if (error.message.includes("Forbidden") || error.message.includes("AccessDenied")) {
        console.error("\n💡 Check your R2 API token permissions");
      } else if (error.message.includes("NoSuchBucket")) {
        console.error('\n💡 Bucket "local-business-platform" not found');
        console.error("   Create it in Cloudflare Dashboard → R2");
      }
    }

    console.error("\n📝 Setup steps:");
    console.error("1. Go to Cloudflare Dashboard → R2");
    console.error('2. Create bucket "local-business-platform" (if not exists)');
    console.error('3. Go to "Manage R2 API Tokens"');
    console.error('4. Create a new API token with "Edit" permissions');
    console.error("5. Copy credentials to .env.local:");
    console.error("   R2_ACCOUNT_ID=your-account-id");
    console.error("   R2_ACCESS_KEY_ID=your-access-key-id");
    console.error("   R2_SECRET_ACCESS_KEY=your-secret-access-key");
    console.error("   R2_BUCKET_NAME=local-business-platform");

    process.exit(1);
  }
}

// Run test
testConnection();
