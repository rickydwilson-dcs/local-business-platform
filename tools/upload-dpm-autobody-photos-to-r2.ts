#!/usr/bin/env tsx
/**
 * Upload the curated/redacted DPM Autobody build photos to R2.
 *
 * Source: output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/<album>/redacted/
 * (contact sheets excluded — those are triage artifacts, not content).
 *
 * Usage:
 *   npx tsx tools/upload-dpm-autobody-photos-to-r2.ts --dry-run
 *   npx tsx tools/upload-dpm-autobody-photos-to-r2.ts
 */
import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "./lib/r2-client";

const SESSION_DIR = "output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox";

// iCloud album directory -> R2 path under dpm-autobody/builds/
// (bentley-s3-1964 gets two subfolders since two albums feed one build)
const ALBUM_TO_R2_PATH: Record<string, string> = {
  "p1800-restomod": "p1800-candy-restomod",
  "bentley-s3-chassis": "bentley-s3-1964/chassis-rebuild",
  "bentley-s3-metalwork": "bentley-s3-1964/metalwork",
  "porsche-356sc": "porsche-356-sc",
  "db6-pink-aston": "aston-martin-db6-pink",
  "p1800-red": "p1800-red",
  "p1800-pearl-white": "p1800-pearl-white",
  "p1800-candy-underside": "p1800-candy",
};

const R2_PREFIX = "dpm-autobody/builds";

interface PlannedUpload {
  album: string;
  localPath: string;
  key: string;
  size: number;
}

interface ManifestEntry extends PlannedUpload {
  url: string;
  status: "uploaded" | "skipped-exists" | "failed";
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function planUploads(): PlannedUpload[] {
  const planned: PlannedUpload[] = [];

  for (const [album, r2Subpath] of Object.entries(ALBUM_TO_R2_PATH)) {
    const redactedDir = path.join(SESSION_DIR, album, "redacted");
    if (!fs.existsSync(redactedDir)) {
      console.warn(`⚠️  Missing directory, skipping: ${redactedDir}`);
      continue;
    }

    const files = fs
      .readdirSync(redactedDir)
      .filter((f) => !/contact-sheet/i.test(f))
      .filter((f) => fs.statSync(path.join(redactedDir, f)).isFile())
      .sort();

    for (const file of files) {
      const localPath = path.join(redactedDir, file);
      planned.push({
        album,
        localPath,
        key: `${R2_PREFIX}/${r2Subpath}/${file}`,
        size: fs.statSync(localPath).size,
      });
    }
  }

  return planned;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("📤 DPM Autobody build photos — R2 upload\n");
  console.log(`📁 Source: ${SESSION_DIR}/<album>/redacted/`);
  console.log(`🌐 Key prefix: ${R2_PREFIX}/\n`);

  const planned = planUploads();

  const totalBytes = planned.reduce((sum, p) => sum + p.size, 0);
  console.log(
    `Found ${planned.length} photos across ${Object.keys(ALBUM_TO_R2_PATH).length} albums (${formatBytes(totalBytes)}).\n`
  );

  const byAlbum = new Map<string, PlannedUpload[]>();
  for (const p of planned) {
    if (!byAlbum.has(p.album)) byAlbum.set(p.album, []);
    byAlbum.get(p.album)!.push(p);
  }
  for (const [album, items] of byAlbum) {
    console.log(`  ${album} (${ALBUM_TO_R2_PATH[album]}): ${items.length} files`);
  }
  console.log();

  if (dryRun) {
    console.log("--- DRY RUN — sample of planned keys ---");
    for (const p of planned.slice(0, 5)) {
      console.log(`  ${p.localPath} -> ${p.key}`);
    }
    console.log(`  ... and ${Math.max(0, planned.length - 5)} more`);
    console.log("\nNo files uploaded. Re-run without --dry-run to upload.");
    return;
  }

  const r2 = getR2Client();
  const manifest: ManifestEntry[] = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of planned) {
    const existing = await r2.headFile(p.key);
    if (existing) {
      console.log(`⏭️  Skipped (exists): ${p.key}`);
      manifest.push({ ...p, url: r2.getPublicUrl(p.key), status: "skipped-exists" });
      skipped++;
      continue;
    }

    const result = await r2.uploadFile(p.localPath, p.key);
    if (result.success) {
      console.log(`✅ Uploaded: ${p.key}`);
      manifest.push({ ...p, url: result.url, status: "uploaded" });
      uploaded++;
    } else {
      console.error(`❌ Failed: ${p.key} — ${result.error}`);
      manifest.push({ ...p, url: "", status: "failed", error: result.error });
      failed++;
    }
  }

  const manifestPath = path.join(SESSION_DIR, "..", "photos-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("\n📊 Upload Summary:");
  console.log(`   Total: ${planned.length}`);
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped (already existed): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n📝 Manifest written to ${manifestPath}`);

  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
