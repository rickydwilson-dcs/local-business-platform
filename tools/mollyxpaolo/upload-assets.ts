#!/usr/bin/env tsx
/**
 * Upload the mollyxpaolo build (build-assets.ts output) to R2. Dry run unless --execute.
 *
 * Download variants (4k, original) carry `Content-Disposition: attachment` with a readable
 * filename, so a plain link saves the file instead of opening it. Keys are never overwritten
 * with different bytes (the path token makes them unique per build), so everything is cached
 * immutably. An object already present at the same size is skipped.
 *
 * The shared R2Client (tools/lib/r2-client.ts) has no Content-Disposition option, so this
 * talks to the S3 API directly rather than widening the shared client for one site.
 *
 * Usage:
 *   npx tsx tools/mollyxpaolo/upload-assets.ts --build <dir> [--execute]
 *     [--only-ids vk-001,vk-002] [--concurrency 8]
 * Credentials (root .env.local): R2_ACCOUNT_ID, plus the site's own bucket-scoped token
 * MXP_R2_BUCKET, MXP_R2_ACCESS_KEY_ID, MXP_R2_SECRET_ACCESS_KEY.
 */
import * as fs from "fs";
import * as path from "path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--"))
    return process.argv[i + 1];
  if (fallback !== undefined) return fallback;
  throw new Error(`--${name} is required`);
}
const BUILD = arg("build");
const BUCKET = arg("bucket", process.env.MXP_R2_BUCKET ?? "");
if (!BUCKET) throw new Error("set MXP_R2_BUCKET or pass --bucket");
const EXECUTE = process.argv.includes("--execute");
const ONLY = new Set(arg("only-ids", "").split(",").filter(Boolean));
const CONCURRENCY = Number(arg("concurrency", "8"));

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};
const TONE_LABEL: Record<string, string> = {
  colour: "colour",
  sepia: "sepia",
  bw: "black-and-white",
};
const CACHE = "public, max-age=31536000, immutable";

interface Item {
  local: string;
  key: string;
  size: number;
  contentType: string;
  disposition?: string;
}

function plan(): Item[] {
  const manifest = JSON.parse(fs.readFileSync(path.join(BUILD, "manifest.json"), "utf8"));
  const items: Item[] = [];
  for (const p of manifest.photos) {
    if (ONLY.size && !ONLY.has(p.id)) continue;
    for (const [tone, t] of Object.entries<{ variants: Record<string, string> }>(p.tones)) {
      for (const [variant, key] of Object.entries(t.variants)) {
        const local = path.join(BUILD, key);
        const ext = path.extname(key);
        const item: Item = { local, key, size: fs.statSync(local).size, contentType: TYPES[ext] };
        if (variant === "4k" || variant === "original") {
          const n = String(p.number).padStart(3, "0");
          item.disposition = `attachment; filename="MollyxPaolo-${n}-${TONE_LABEL[tone]}-${variant === "4k" ? "4K" : "full"}${ext}"`;
        }
        items.push(item);
      }
    }
  }
  // The video lives beside the photos under the same token.
  const video = path.join(BUILD, "video");
  if (!ONLY.size && fs.existsSync(video)) {
    for (const f of fs.readdirSync(video)) {
      if (f.endsWith(".mp4") || f === "poster.jpg") {
        const local = path.join(video, f);
        items.push({
          local,
          key: `${manifest.pathToken}/video/${f}`,
          size: fs.statSync(local).size,
          contentType: TYPES[path.extname(f)],
        });
      }
    }
  }
  return items;
}

const gb = (b: number) => `${(b / 1024 ** 3).toFixed(2)}GB`;

async function main() {
  const items = plan();
  const byVariant = new Map<string, { n: number; bytes: number }>();
  for (const it of items) {
    const v = it.key.split("/").slice(1, 3).join("/"); // tone/variant
    const e = byVariant.get(v) ?? { n: 0, bytes: 0 };
    e.n++;
    e.bytes += it.size;
    byVariant.set(v, e);
  }
  const total = items.reduce((s, i) => s + i.size, 0);
  console.log(`${EXECUTE ? "UPLOAD" : "DRY RUN"} → bucket "${BUCKET}"`);
  console.log(`${items.length} objects, ${gb(total)}\n`);
  for (const [v, e] of [...byVariant].sort())
    console.log(`  ${v.padEnd(22)} ${String(e.n).padStart(5)}  ${gb(e.bytes)}`);
  console.log("\nSample:");
  for (const it of [items[0], items.find((i) => i.disposition), items[items.length - 1]].filter(
    Boolean
  ) as Item[]) {
    console.log(`  ${it.key}  ${it.contentType}${it.disposition ? `  [${it.disposition}]` : ""}`);
  }
  if (!EXECUTE) return console.log("\nNothing uploaded. Re-run with --execute.");

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.MXP_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.MXP_R2_SECRET_ACCESS_KEY!,
    },
  });
  let uploaded = 0,
    skipped = 0,
    failed = 0,
    bytes = 0;
  const failures: string[] = [];
  const queue = [...items];
  await Promise.all(
    [...Array(CONCURRENCY)].map(async () => {
      for (let it = queue.shift(); it; it = queue.shift()) {
        try {
          const head = await s3
            .send(new HeadObjectCommand({ Bucket: BUCKET, Key: it.key }))
            .catch(() => null);
          if (head?.ContentLength === it.size) {
            skipped++;
            continue;
          }
          await s3.send(
            new PutObjectCommand({
              Bucket: BUCKET,
              Key: it.key, // A Buffer body (not a stream) lets the SDK retry a failed request on its own.
              Body: fs.readFileSync(it.local),
              ContentLength: it.size,
              ContentType: it.contentType,
              CacheControl: CACHE,
              ContentDisposition: it.disposition,
            })
          );
          uploaded++;
          bytes += it.size;
        } catch (e) {
          failed++;
          failures.push(`${it.key}: ${e instanceof Error ? e.message : e}`);
          // Report as it happens: a long run killed before the summary would otherwise hide every failure.
          console.log(`  FAILED ${failures[failures.length - 1]}`);
        }
        const n = uploaded + skipped + failed;
        if (n % 100 === 0)
          console.log(
            `  ${n}/${items.length}  (${gb(bytes)} sent, ${skipped} skipped, ${failed} failed)`
          );
      }
    })
  );
  console.log(
    `\nUploaded ${uploaded} (${gb(bytes)}), skipped ${skipped} already present, failed ${failed}`
  );
  if (failures.length) {
    console.log(failures.slice(0, 20).join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
