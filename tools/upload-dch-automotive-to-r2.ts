#!/usr/bin/env tsx
/**
 * Upload all DCH Automotive images to R2
 * Uploads sites/dch-automotive/public/{stitch-images,viezu,logo} to R2
 * under the dch-automotive/ key prefix.
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

const SITE_PREFIX = "dch-automotive";
const SOURCE_DIRS = ["stitch-images", "viezu", "logo"];
const PUBLIC_DIR = path.join(process.cwd(), "sites/dch-automotive/public");

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  totalBytes: number;
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    await r2Client.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(
  localPath: string,
  r2Key: string
): Promise<"uploaded" | "skipped" | "failed"> {
  try {
    if (await fileExistsInR2(r2Key)) {
      console.log(`   ⏭️  Skipped (exists): ${r2Key}`);
      return "skipped";
    }

    const fileContent = fs.readFileSync(localPath);
    const contentType = lookup(localPath) || "application/octet-stream";

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    console.log(`   ✅ Uploaded: ${r2Key}`);
    return "uploaded";
  } catch (error) {
    console.error(`   ❌ Failed: ${r2Key}`, error);
    return "failed";
  }
}

function findImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((item) => path.join(dir, item))
    .filter(
      (fullPath) =>
        fs.statSync(fullPath).isFile() && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fullPath)
    );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function uploadAllImages() {
  console.log("📤 DCH Automotive - R2 Upload\n");

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("❌ Error: R2 credentials not found in .env.local (run from repo root)");
    process.exit(1);
  }

  console.log(`📁 Source: ${PUBLIC_DIR}/{${SOURCE_DIRS.join(",")}}`);
  console.log(`☁️  Bucket: ${R2_BUCKET_NAME}`);
  console.log(`🌐 Key prefix: ${SITE_PREFIX}/\n`);

  const stats: UploadStats = { total: 0, uploaded: 0, skipped: 0, failed: 0, totalBytes: 0 };

  for (const subdir of SOURCE_DIRS) {
    const dir = path.join(PUBLIC_DIR, subdir);
    const files = findImageFiles(dir);
    console.log(`\n📂 ${subdir}/ — ${files.length} files`);

    for (const localPath of files) {
      const relativePath = path.relative(PUBLIC_DIR, localPath).replace(/\\/g, "/");
      const r2Key = `${SITE_PREFIX}/${relativePath}`;
      const fileSize = fs.statSync(localPath).size;

      stats.total++;
      stats.totalBytes += fileSize;

      const result = await uploadFile(localPath, r2Key);
      stats[result]++;

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log("\n\n📊 Upload Summary:");
  console.log(`   Total files: ${stats.total}`);
  console.log(`   ✅ Uploaded: ${stats.uploaded}`);
  console.log(`   ⏭️  Skipped: ${stats.skipped} (already exist)`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  console.log(`   📦 Total size: ${formatBytes(stats.totalBytes)}`);
  console.log(`\n✅ Upload complete!`);
  console.log(`\n🌐 Images available at:`);
  console.log(`   ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${SITE_PREFIX}/`);
}

if (require.main === module) {
  uploadAllImages().catch(console.error);
}
