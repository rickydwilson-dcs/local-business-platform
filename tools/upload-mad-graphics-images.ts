#!/usr/bin/env tsx
/**
 * Mad Graphics — Upload generated images to Cloudflare R2
 *
 * Usage:
 *   tsx tools/upload-mad-graphics-images.ts [--dry-run] [--force]
 *
 * Options:
 *   --dry-run   Preview what would be uploaded without doing it
 *   --force     Re-upload even if the file already exists in R2
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
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const SOURCE_DIR = path.join(process.cwd(), "output/generated-images/mad-graphics");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("\nError: R2 credentials not set. Check .env.local for:");
  console.error("  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
  process.exit(1);
}

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`\nError: Source directory not found: ${SOURCE_DIR}`);
  console.error("Run tsx tools/generate-mad-graphics-images.ts first.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function existsInR2(key: string): Promise<boolean> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(localPath: string, r2Key: string): Promise<boolean> {
  if (dryRun) {
    const size = fs.statSync(localPath).size;
    console.log(`  [dry-run] Would upload: ${r2Key} (${(size / 1024).toFixed(1)} KB)`);
    return true;
  }

  if (!force) {
    const exists = await existsInR2(r2Key);
    if (exists) {
      console.log(`  Skipped (exists): ${r2Key}`);
      return false;
    }
  }

  try {
    const body = fs.readFileSync(localPath);
    const contentType = lookup(localPath) || "image/jpeg";
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    console.log(`  Uploaded: ${r2Key}`);
    return true;
  } catch (err) {
    console.error(`  Failed: ${r2Key} —`, err instanceof Error ? err.message : String(err));
    return false;
  }
}

function findImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...findImages(full));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

async function main(): Promise<void> {
  console.log("\nMad Graphics — R2 Upload");
  console.log("========================");
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Bucket: ${R2_BUCKET_NAME}`);
  console.log(`Dry run: ${dryRun} | Force: ${force}`);
  console.log();

  const files = findImages(SOURCE_DIR);
  if (files.length === 0) {
    console.error("No images found in source directory.");
    process.exit(1);
  }

  console.log(`Found ${files.length} images to process\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    // Map local path to R2 key
    // e.g. .../mad-graphics/services/hero-van-graphics.jpg → mad-graphics/services/hero-van-graphics.jpg
    const relative = path.relative(SOURCE_DIR, file);
    const r2Key = `mad-graphics/${relative}`;

    const result = await uploadFile(file, r2Key);
    if (dryRun) {
      uploaded++;
    } else if (result) {
      uploaded++;
    } else {
      // was skipped or failed — distinguish by checking if exists
      skipped++;
    }
  }

  console.log(`\n========================`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);

  if (R2_PUBLIC_URL) {
    console.log(`\nPublic URL base: ${R2_PUBLIC_URL}/mad-graphics/`);
  }

  console.log(`\nNext step:`);
  console.log(`  tsx tools/update-mad-graphics-mdx.ts`);
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
