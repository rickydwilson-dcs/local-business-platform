#!/usr/bin/env tsx
/**
 * Upload all DJ Fox Electrical images to R2
 * Uploads all generated images from output/generated-images/djfoxelectrical/ to R2
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { lookup } from "mime-types";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "local-business-platform";

const SOURCE_DIR = path.join(process.cwd(), "output/generated-images/djfoxelectrical");

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  totalBytes: number;
}

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Check if file exists in R2
 */
async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Upload a single file to R2
 */
async function uploadFile(
  localPath: string,
  r2Key: string,
  skipExisting: boolean = true
): Promise<boolean> {
  try {
    // Check if file already exists
    if (skipExisting) {
      const exists = await fileExistsInR2(r2Key);
      if (exists) {
        console.log(`   ⏭️  Skipped (exists): ${r2Key}`);
        return false;
      }
    }

    // Read file
    const fileContent = fs.readFileSync(localPath);
    const contentType = lookup(localPath) || "application/octet-stream";

    // Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileContent,
        ContentType: contentType,
      })
    );

    console.log(`   ✅ Uploaded: ${r2Key}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed: ${r2Key}`, error);
    return false;
  }
}

/**
 * Recursively find all image files
 */
function findImageFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findImageFiles(fullPath, baseDir));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Main upload function
 */
async function uploadAllImages() {
  console.log("📤 DJ Fox Electrical - R2 Upload\n");

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("❌ Error: R2 credentials not found in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Error: Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  console.log(`📁 Source: ${SOURCE_DIR}`);
  console.log(`☁️  Bucket: ${R2_BUCKET_NAME}`);
  console.log(`🌐 Base path: djfoxelectrical/\n`);

  // Find all images
  const imageFiles = findImageFiles(SOURCE_DIR);
  console.log(`📊 Found ${imageFiles.length} images to upload\n`);

  const stats: UploadStats = {
    total: imageFiles.length,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    totalBytes: 0,
  };

  // Upload each file
  for (let i = 0; i < imageFiles.length; i++) {
    const localPath = imageFiles[i];
    const relativePath = path.relative(SOURCE_DIR, localPath);
    const r2Key = `djfoxelectrical/${relativePath.replace(/\\/g, "/")}`;

    console.log(`\n[${i + 1}/${imageFiles.length}] ${relativePath}`);

    const fileSize = fs.statSync(localPath).size;
    stats.totalBytes += fileSize;

    const uploaded = await uploadFile(localPath, r2Key, true);

    if (uploaded) {
      stats.uploaded++;
    } else {
      // Check if it was skipped or failed
      const exists = await fileExistsInR2(r2Key);
      if (exists) {
        stats.skipped++;
      } else {
        stats.failed++;
      }
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Print summary
  console.log("\n\n📊 Upload Summary:");
  console.log(`   Total files: ${stats.total}`);
  console.log(`   ✅ Uploaded: ${stats.uploaded}`);
  console.log(`   ⏭️  Skipped: ${stats.skipped} (already exist)`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  console.log(`   📦 Total size: ${formatBytes(stats.totalBytes)}`);
  console.log(`\n✅ Upload complete!`);
  console.log(`\n🌐 Images will be available at:`);
  console.log(`   ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/djfoxelectrical/`);
}

if (require.main === module) {
  uploadAllImages().catch(console.error);
}
