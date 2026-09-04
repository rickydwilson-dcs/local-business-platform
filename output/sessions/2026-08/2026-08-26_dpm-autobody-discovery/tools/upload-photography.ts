#!/usr/bin/env tsx
/**
 * Upload the curated, plate-redacted DPM Autobody photography shortlist to R2.
 *
 * Source: /tmp/dpm_staging/<car-slug>/<filename>.jpg (built by the plate-redact
 * pipeline from output/sessions/2026-08-26_dpm-autobody-discovery/tools/plate-redact/).
 * Destination: dpm-autobody/photography/<car-slug>/<filename>.jpg in R2.
 *
 * These are real client assets (not disposable prototype scratch), so they get their
 * own top-level prefix rather than living under prototypes/<session>/ — the eventual
 * site build will reference the same dpm-autobody/photography/ paths.
 */
import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "../../../../../tools/lib/r2-client";

const SRC_DIR = "/tmp/dpm_staging";
const R2_PREFIX = "dpm-autobody/photography/";
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".jpg")) out.push(full);
  }
  return out;
}

async function main() {
  const client = getR2Client();
  const files = walk(SRC_DIR).sort();

  console.log(`\n📦 DPM Autobody photography upload\n`);
  console.log(`   Bucket: ${client.getBucketName()}`);
  console.log(`   Prefix: ${R2_PREFIX}`);
  console.log(`   Files:  ${files.length}\n`);

  const manifest: Array<{ relativePath: string; key: string; url: string; bytes: number }> = [];
  let uploaded = 0;
  const failed: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const localPath = files[i];
    const relativePath = path.relative(SRC_DIR, localPath).split(path.sep).join("/");
    const key = `${R2_PREFIX}${relativePath}`;
    const bytes = fs.statSync(localPath).size;

    const result = await client.uploadFile(localPath, key, {
      contentType: "image/jpeg",
      cacheControl: CACHE_CONTROL,
    });

    if (result.success) {
      uploaded++;
      manifest.push({ relativePath, key, url: result.url, bytes });
      console.log(`[${i + 1}/${files.length}] up   ${key} (${(bytes / 1024).toFixed(0)}KB)`);
    } else {
      failed.push(`${key}: ${result.error}`);
      console.log(`[${i + 1}/${files.length}] FAIL ${key} — ${result.error}`);
    }
  }

  console.log(`\n   Uploaded ${uploaded}/${files.length}, failed ${failed.length}`);
  if (failed.length) {
    console.error("\n❌ Failures:\n" + failed.map((f) => `   ${f}`).join("\n"));
    process.exit(1);
  }

  const manifestPath = path.join(__dirname, "..", "research", "photography-manifest.json");
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      { prefix: R2_PREFIX, uploadedAt: new Date().toISOString(), assets: manifest },
      null,
      2
    ) + "\n"
  );
  console.log(`\n📝 Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log("\n✅ Done.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
