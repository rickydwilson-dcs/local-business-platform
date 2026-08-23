#!/usr/bin/env tsx
/**
 * Copy the DCS homepage's R2 assets from the prototype-scoped prefix to a
 * production prefix.
 *
 * The r9 homepage prototype (output/sessions/2026-08/2026-08-17_dcs-homepage-redesign)
 * references media under `prototypes/2026-08-17_dcs-homepage-redesign/assets/`. A
 * production homepage must not depend on a prototype-scoped path that a future
 * prototype cleanup could sweep. This script performs server-side S3 CopyObject
 * calls (never download+reupload, never regenerate) from that prefix to
 * `dcs/home/` on the same bucket, then verifies every URL the homepage will
 * reference — including the one asset that already lives at a production path
 * (npracing-v1/videos/rider-spotlight-2026-08.mp4) and is deliberately left
 * alone — via real HTTP HEAD requests against the public R2 URL.
 *
 * Usage:
 *   npx tsx tools/copy-dcs-home-assets.ts            Copy + verify + write manifest
 *   npx tsx tools/copy-dcs-home-assets.ts --verify    Re-run HEAD checks against
 *                                                      the existing manifest only
 *                                                      (no copying). Non-zero exit
 *                                                      on any mismatch. Repeatable
 *                                                      verification gate.
 */
import * as fs from "fs";
import * as path from "path";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const SOURCE_PREFIX = "prototypes/2026-08-17_dcs-homepage-redesign/assets/";
const TARGET_PREFIX = "dcs/home/";

const MANIFEST_PATH = path.resolve(
  __dirname,
  "..",
  "output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/assets-manifest.json"
);

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

interface AssetSpec {
  logicalName: string;
  /** Key relative to SOURCE_PREFIX. Null means this asset is NOT copied — it
   * already lives at a production path and finalKey is that existing key. */
  sourceRelKey: string | null;
  /** Final absolute R2 key (dcs/home/... for copied assets, or the existing
   * production key for the one asset left alone). */
  finalKey: string;
}

const ASSETS: AssetSpec[] = [
  {
    logicalName: "work-clothing-kings.video",
    sourceRelKey: "video/the-clothing-kings.mp4",
    finalKey: `${TARGET_PREFIX}video/the-clothing-kings.mp4`,
  },
  {
    logicalName: "work-clothing-kings.poster",
    sourceRelKey: "video/the-clothing-kings.jpg",
    finalKey: `${TARGET_PREFIX}video/the-clothing-kings.jpg`,
  },
  {
    logicalName: "work-cuddle-plush.video",
    sourceRelKey: "video/cuddle-plush-fabrics.mp4",
    finalKey: `${TARGET_PREFIX}video/cuddle-plush-fabrics.mp4`,
  },
  {
    logicalName: "work-cuddle-plush.poster",
    sourceRelKey: "video/cuddle-plush-fabrics.jpg",
    finalKey: `${TARGET_PREFIX}video/cuddle-plush-fabrics.jpg`,
  },
  {
    logicalName: "work-np-racing.video",
    sourceRelKey: null,
    finalKey: "npracing-v1/videos/rider-spotlight-2026-08.mp4",
  },
  {
    logicalName: "work-np-racing.poster",
    sourceRelKey: "video/np-racing.jpg",
    finalKey: `${TARGET_PREFIX}video/np-racing.jpg`,
  },
  {
    logicalName: "work-sm-commercial.video",
    sourceRelKey: "video/sm-commercial.mp4",
    finalKey: `${TARGET_PREFIX}video/sm-commercial.mp4`,
  },
  {
    logicalName: "work-sm-commercial.poster",
    sourceRelKey: "video/sm-commercial.jpg",
    finalKey: `${TARGET_PREFIX}video/sm-commercial.jpg`,
  },
  {
    logicalName: "work-colossus.video",
    sourceRelKey: "video/colossus-scaffolding.mp4",
    finalKey: `${TARGET_PREFIX}video/colossus-scaffolding.mp4`,
  },
  {
    logicalName: "work-colossus.poster",
    sourceRelKey: "video/colossus-scaffolding.jpg",
    finalKey: `${TARGET_PREFIX}video/colossus-scaffolding.jpg`,
  },
  {
    logicalName: "work-ink.video",
    sourceRelKey: "video/vid-ink.mp4",
    finalKey: `${TARGET_PREFIX}video/vid-ink.mp4`,
  },
  {
    logicalName: "work-ink.poster",
    sourceRelKey: "video/poster-ink.jpg",
    finalKey: `${TARGET_PREFIX}video/poster-ink.jpg`,
  },
  {
    logicalName: "work-ecommerce.video",
    sourceRelKey: "video/ecommerce-packing.mp4",
    finalKey: `${TARGET_PREFIX}video/ecommerce-packing.mp4`,
  },
  {
    logicalName: "work-ecommerce.poster",
    sourceRelKey: "video/ecommerce-packing.jpg",
    finalKey: `${TARGET_PREFIX}video/ecommerce-packing.jpg`,
  },
  {
    logicalName: "web-phone-on-site",
    sourceRelKey: "img/web/phone-on-site.jpg",
    finalKey: `${TARGET_PREFIX}img/web/phone-on-site.jpg`,
  },
  {
    logicalName: "web-laptop-store",
    sourceRelKey: "img/web/laptop-store.jpg",
    finalKey: `${TARGET_PREFIX}img/web/laptop-store.jpg`,
  },
  {
    logicalName: "web-abstract-mesh",
    sourceRelKey: "img/web/abstract-mesh.jpg",
    finalKey: `${TARGET_PREFIX}img/web/abstract-mesh.jpg`,
  },
  {
    logicalName: "web-sector-office",
    sourceRelKey: "img/web/sector-office.jpg",
    finalKey: `${TARGET_PREFIX}img/web/sector-office.jpg`,
  },
];

interface ManifestEntry {
  logicalName: string;
  oldUrl: string;
  newUrl: string;
  contentType: string;
  contentLength: number;
}

interface Manifest {
  generatedAt: string;
  bucket: string;
  sourcePrefix: string;
  targetPrefix: string;
  publicBase: string;
  assets: ManifestEntry[];
}

function contentTypeFor(key: string): string {
  const ext = path.extname(key).toLowerCase();
  const ct = CONTENT_TYPES[ext];
  if (!ct) {
    throw new Error(`No content type mapped for extension "${ext}" (key: ${key})`);
  }
  return ct;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set in .env.local`);
  }
  return value;
}

/** HEAD a public R2 URL and return the real response (status, content-type, content-length). */
async function headUrl(
  url: string
): Promise<{ status: number; contentType: string; contentLength: number }> {
  const response = await fetch(url, { method: "HEAD" });
  const contentType = response.headers.get("content-type") ?? "";
  const contentLengthHeader = response.headers.get("content-length");
  const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : NaN;
  return { status: response.status, contentType, contentLength };
}

/** Tracks how many of the 18 logical assets have been fully verified so far,
 * so a failure mid-run can report accurate progress instead of a hardcoded 0. */
let progressCount = 0;

async function runCopy(): Promise<void> {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET_NAME");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_URL").replace(/\/$/, "");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const toCopy = ASSETS.filter((a) => a.sourceRelKey !== null);
  const total = ASSETS.length; // 18 logical assets total (17 copied + 1 left in place)
  let processed = 0;

  console.log(`\nCopying ${toCopy.length} objects: ${SOURCE_PREFIX} -> ${TARGET_PREFIX}\n`);

  // --- Step 1: server-side copy for the 17 prototype-scoped objects ---
  for (const asset of toCopy) {
    const sourceKey = `${SOURCE_PREFIX}${asset.sourceRelKey}`;
    const contentType = contentTypeFor(asset.finalKey);
    const copySource = `${bucket}/${sourceKey.split("/").map(encodeURIComponent).join("/")}`;

    console.log(`  copy  ${sourceKey}  ->  ${asset.finalKey}`);
    await client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        Key: asset.finalKey,
        CopySource: copySource,
        MetadataDirective: "REPLACE",
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    processed++;
  }

  console.log(`\nCopied ${processed}/${toCopy.length} objects. Verifying byte-length parity...\n`);

  // --- Step 2: byte-length parity — real HTTP HEAD against source AND destination ---
  for (const asset of toCopy) {
    const sourceUrl = `${publicBase}/${SOURCE_PREFIX}${asset.sourceRelKey}`;
    const destUrl = `${publicBase}/${asset.finalKey}`;
    const [sourceHead, destHead] = await Promise.all([headUrl(sourceUrl), headUrl(destUrl)]);

    if (sourceHead.status !== 200) {
      throw new Error(`Source object not fetchable (HTTP ${sourceHead.status}): ${sourceUrl}`);
    }
    if (destHead.status !== 200) {
      throw new Error(`Copied object not fetchable (HTTP ${destHead.status}): ${destUrl}`);
    }
    if (sourceHead.contentLength !== destHead.contentLength) {
      throw new Error(
        `Byte-length mismatch for "${asset.logicalName}": source ${sourceUrl} = ${sourceHead.contentLength} bytes, ` +
          `dest ${destUrl} = ${destHead.contentLength} bytes`
      );
    }
    console.log(
      `  ok    ${asset.logicalName}  (${destHead.contentLength} bytes, ${destHead.contentType})`
    );
  }

  // --- Step 3: full 18-asset HEAD verification + manifest capture ---
  console.log(`\nVerifying all ${total} referenced URLs (17 copied + 1 already-production)...\n`);
  const manifestAssets: ManifestEntry[] = [];

  for (const asset of ASSETS) {
    const oldUrl =
      asset.sourceRelKey !== null
        ? `${publicBase}/${SOURCE_PREFIX}${asset.sourceRelKey}`
        : `${publicBase}/${asset.finalKey}`;
    const newUrl = `${publicBase}/${asset.finalKey}`;
    const expectedContentType = contentTypeFor(asset.finalKey);

    const head = await headUrl(newUrl);
    if (head.status !== 200) {
      throw new Error(
        `Final URL not fetchable (HTTP ${head.status}): ${newUrl} (asset: ${asset.logicalName})`
      );
    }
    if (!head.contentType.startsWith(expectedContentType)) {
      throw new Error(
        `Content-type mismatch for "${asset.logicalName}": got "${head.contentType}", expected "${expectedContentType}" (${newUrl})`
      );
    }
    if (newUrl.includes("prototypes/")) {
      throw new Error(
        `Final URL still points at the prototype prefix: ${newUrl} (asset: ${asset.logicalName})`
      );
    }

    manifestAssets.push({
      logicalName: asset.logicalName,
      oldUrl,
      newUrl,
      contentType: head.contentType,
      contentLength: head.contentLength,
    });
    progressCount++;
    console.log(`  head 200  ${asset.logicalName}  ${head.contentType}  ${head.contentLength}B`);
  }

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    bucket,
    sourcePrefix: SOURCE_PREFIX,
    targetPrefix: TARGET_PREFIX,
    publicBase,
    assets: manifestAssets,
  };

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log(`\nManifest written: ${path.relative(process.cwd(), MANIFEST_PATH)}`);

  console.log(`\nPASS — ${manifestAssets.length}/${total} records, 0 errors`);
}

/** Re-run HEAD checks against the already-written manifest. No copying. */
async function runVerify(): Promise<void> {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found: ${MANIFEST_PATH}. Run without --verify first.`);
  }
  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const total = manifest.assets.length;
  let ok = 0;

  console.log(`\nRe-verifying ${total} manifest entries against live R2 URLs...\n`);

  for (const entry of manifest.assets) {
    const head = await headUrl(entry.newUrl);
    if (head.status !== 200) {
      throw new Error(
        `HTTP ${head.status} (expected 200): ${entry.newUrl} (asset: ${entry.logicalName})`
      );
    }
    if (!head.contentType.startsWith(contentTypeFor(entry.newUrl))) {
      throw new Error(
        `Content-type drift for "${entry.logicalName}": got "${head.contentType}", expected "${entry.contentType}" (${entry.newUrl})`
      );
    }
    if (head.contentLength !== entry.contentLength) {
      throw new Error(
        `Content-length drift for "${entry.logicalName}": manifest says ${entry.contentLength}, live is ${head.contentLength} (${entry.newUrl})`
      );
    }
    if (entry.newUrl.includes("prototypes/")) {
      throw new Error(
        `Manifest URL still points at the prototype prefix: ${entry.newUrl} (asset: ${entry.logicalName})`
      );
    }
    ok++;
    progressCount++;
    console.log(`  ok    ${entry.logicalName}`);
  }

  console.log(`\nPASS — ${ok}/${total} records, 0 errors`);
}

async function main() {
  const verifyOnly = process.argv.includes("--verify");
  if (verifyOnly) {
    await runVerify();
  } else {
    await runCopy();
  }
}

main().catch((error) => {
  console.error("\nFAILED — uncaught exception:\n");
  console.error(error);
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nFAIL — ${progressCount}/${ASSETS.length} records, 1 errors: ${message}`);
  process.exit(1);
});
