#!/usr/bin/env tsx
/**
 * Upload the Delta T Racing site images to R2.
 *
 * Source: output/sessions/2026-09/2026-09-26_delta-t-racing-build/assets/<folder>/
 * (gitignored — the originals were pulled from the team's Wix site and
 * optimised/recoloured locally; see that session's notes).
 *
 * Usage:
 *   npx tsx tools/upload-delta-t-racing-to-r2.ts --dry-run
 *   npx tsx tools/upload-delta-t-racing-to-r2.ts
 */
import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "./lib/r2-client";

const SOURCE_DIR = "output/sessions/2026-09/2026-09-26_delta-t-racing-build/assets";
const R2_PREFIX = "delta-t-racing";

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const planned: Array<{ localPath: string; key: string; size: number }> = [];
  for (const folder of fs.readdirSync(SOURCE_DIR).sort()) {
    const dir = path.join(SOURCE_DIR, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).sort()) {
      const localPath = path.join(dir, file);
      if (!fs.statSync(localPath).isFile() || file.startsWith(".")) continue;
      planned.push({
        localPath,
        key: `${R2_PREFIX}/${folder}/${file}`,
        size: fs.statSync(localPath).size,
      });
    }
  }

  const totalKb = Math.round(planned.reduce((sum, p) => sum + p.size, 0) / 1024);
  console.log(`${planned.length} files (${totalKb} KB) -> ${R2_PREFIX}/\n`);
  for (const p of planned) console.log(`  ${p.localPath} -> ${p.key}`);

  if (dryRun) {
    console.log("\nDRY RUN — nothing uploaded.");
    return;
  }

  const r2 = getR2Client();
  let failed = 0;
  for (const p of planned) {
    if (await r2.headFile(p.key)) {
      console.log(`skip (exists): ${p.key}`);
      continue;
    }
    const result = await r2.uploadFile(p.localPath, p.key);
    if (result.success) console.log(`uploaded: ${result.url}`);
    else {
      console.error(`FAILED: ${p.key} — ${result.error}`);
      failed++;
    }
  }
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
