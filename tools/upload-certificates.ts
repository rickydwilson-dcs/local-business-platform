#!/usr/bin/env tsx
/**
 * Upload certificate images to R2 (pre-converted WebP files)
 */

import { R2Client } from "./lib/r2-client";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const CERTIFICATES = [
  { slug: "chas-membership", name: "CHAS Premium Plus" },
  { slug: "construction-line-gold", name: "Construction Line Gold" },
  { slug: "iasme-cyber-essentials", name: "IASME Cyber Essentials" },
  { slug: "business-registration", name: "Business Registration" },
  { slug: "scaffolding-contractor", name: "Scaffolding Contractor" },
];

const SOURCE_DIR = "/tmp/certificate-images";

async function uploadCertificates() {
  console.log("📤 Uploading certificate images to R2\n");

  const r2 = new R2Client({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  });

  const results: { name: string; thumbUrl: string; fullUrl: string }[] = [];

  for (const cert of CERTIFICATES) {
    console.log(`\n📄 ${cert.name}:`);

    // Upload thumbnail
    const thumbPath = path.join(SOURCE_DIR, "thumbs", `${cert.slug}-thumb.webp`);
    if (fs.existsSync(thumbPath)) {
      const thumbBuffer = fs.readFileSync(thumbPath);
      const thumbKey = `colossus-reference/certificates/thumbs/${cert.slug}-thumb.webp`;
      await r2.uploadBuffer(thumbBuffer, thumbKey, { contentType: "image/webp" });
      console.log(`   ✅ Thumbnail: ${thumbKey}`);
    } else {
      console.log(`   ❌ Thumbnail not found: ${thumbPath}`);
    }

    // Upload full-size
    const fullPath = path.join(SOURCE_DIR, "full", `${cert.slug}-full.webp`);
    if (fs.existsSync(fullPath)) {
      const fullBuffer = fs.readFileSync(fullPath);
      const fullKey = `colossus-reference/certificates/full/${cert.slug}-full.webp`;
      await r2.uploadBuffer(fullBuffer, fullKey, { contentType: "image/webp" });
      console.log(`   ✅ Full-size: ${fullKey}`);
    } else {
      console.log(`   ❌ Full-size not found: ${fullPath}`);
    }

    results.push({
      name: cert.name,
      thumbUrl: `colossus-reference/certificates/thumbs/${cert.slug}-thumb.webp`,
      fullUrl: `colossus-reference/certificates/full/${cert.slug}-full.webp`,
    });
  }

  console.log("\n\n✅ Upload complete!");
  console.log("\n📋 Certificate URLs (for use in components):\n");

  const baseUrl =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-b92cff08b0efdaabc1f1e20985410d5d.r2.dev";

  console.log("const certificates = [");
  for (const cert of results) {
    console.log(`  {`);
    console.log(`    id: "${cert.name.toLowerCase().replace(/\s+/g, "-")}",`);
    console.log(`    name: "${cert.name}",`);
    console.log(`    thumbnail: "${baseUrl}/${cert.thumbUrl}",`);
    console.log(`    fullImage: "${baseUrl}/${cert.fullUrl}",`);
    console.log(`    description: "",`);
    console.log(`  },`);
  }
  console.log("];");
}

uploadCertificates().catch(console.error);
