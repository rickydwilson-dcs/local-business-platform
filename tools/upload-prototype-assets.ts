#!/usr/bin/env tsx
/**
 * Upload prototype assets to Cloudflare R2 and rewrite prototype HTML to use them.
 *
 * Design prototypes (output/sessions/**\/prototype) generate large image and video
 * assets. Those must never enter git — see docs/guides/prototype-hosting.md for the
 * 117MB near-miss that prompted this tool. Assets go to R2 under a per-session
 * prefix; the HTML is rewritten in place to reference absolute R2 URLs.
 *
 * Usage:
 *   npx tsx tools/upload-prototype-assets.ts <prototype-dir> [options]
 *
 * Options:
 *   --dry-run      Print the full plan and write nothing (run this first)
 *   --no-rewrite   Upload only; leave the HTML untouched
 *   --force        Re-upload objects even when R2 already holds identical bytes
 *   --pages <list> Comma-separated pages (relative to the prototype dir) to scan,
 *                  rewrite and upload assets for. Without it every HTML file under
 *                  the directory is scanned and the whole of assets/ is uploaded.
 */
import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "./lib/r2-client";

/**
 * Explicit content types. Deliberately not delegated to a mime lookup: R2Client's
 * own map has no video entry, and a wrong type on .svg makes the browser offer a
 * download instead of rendering it. Unknown extensions fail loudly.
 */
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

/**
 * Live assets are re-generated mid-session, and overwriting an R2 key does not bust
 * the CDN cache — so the client's default `immutable, 1 year` would serve stale
 * bytes indefinitely. Archived masters are never fetched by a browser, so they keep
 * the long TTL.
 */
const CACHE_LIVE = "public, max-age=300";
const CACHE_ARCHIVE = "public, max-age=31536000, immutable";

/**
 * Files inside assets/ that are documentation, tooling or scratch, not deployable
 * assets. The generator scripts that rebuild the plates (make-plates.zsh, gen.sh)
 * live beside their output by design, and a .tsv of generation parameters with
 * them — none of it belongs on a public CDN, and without this the unknown-extension
 * guard aborts the whole run on them.
 */
const SKIP_EXTENSIONS = new Set([
  ".md",
  ".html",
  ".txt",
  ".json",
  ".sh",
  ".zsh",
  ".bash",
  ".mjs",
  ".ts",
  ".tsv",
  ".csv",
]);

interface AssetPlan {
  localPath: string;
  /** Path relative to the prototype dir, e.g. "assets/img/web/sector-cafe.jpg" */
  relativePath: string;
  key: string;
  url: string;
  contentType: string;
  cacheControl: string;
  bytes: number;
  archive: boolean;
}

interface Options {
  dryRun: boolean;
  rewrite: boolean;
  force: boolean;
  /** Restrict scanning, rewriting and upload to these pages (relative to the prototype dir). */
  pages: string[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Derive the session slug from a prototype directory path.
 * ".../2026-08-17_dcs-homepage-redesign/prototype" -> "2026-08-17_dcs-homepage-redesign"
 */
function deriveSlug(prototypeDir: string): string {
  const resolved = path.resolve(prototypeDir);
  const base = path.basename(resolved);
  return base === "prototype" ? path.basename(path.dirname(resolved)) : base;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // .DS_Store, .urls, .media4, .impeccable
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/**
 * Build the upload plan. Masters sitting directly in assets/img are unreferenced
 * 2048px sources, so they are routed to an _archive/ prefix that keeps cold storage
 * visibly separate from the assets the prototypes actually load.
 */
function buildPlan(prototypeDir: string, prefix: string, publicBase: string): AssetPlan[] {
  const assetsDir = path.join(prototypeDir, "assets");
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`No assets/ directory in ${prototypeDir}`);
  }

  const plan: AssetPlan[] = [];
  for (const localPath of walk(assetsDir)) {
    const ext = path.extname(localPath).toLowerCase();
    if (SKIP_EXTENSIONS.has(ext)) continue;

    const contentType = CONTENT_TYPES[ext];
    if (!contentType) {
      throw new Error(
        `No content type mapped for "${ext}" (${localPath}). Add it to CONTENT_TYPES rather than falling back to octet-stream.`
      );
    }

    const relFromAssets = path.relative(assetsDir, localPath).split(path.sep).join("/");
    const archive = /^img\/[^/]+\.png$/i.test(relFromAssets);
    const keySuffix = archive ? relFromAssets.replace(/^img\//, "img/_archive/") : relFromAssets;
    const key = `${prefix}assets/${keySuffix}`;

    plan.push({
      localPath,
      relativePath: `assets/${relFromAssets}`,
      key,
      url: `${publicBase}/${key}`,
      contentType,
      cacheControl: archive ? CACHE_ARCHIVE : CACHE_LIVE,
      bytes: fs.statSync(localPath).size,
      archive,
    });
  }
  return plan.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Matches "assets/ and "../assets/ at any depth.
 *
 * Anchoring on a bare "assets/ was correct only for a flat prototype folder. The
 * two-build pattern (src/ -> client/ + annotated/) puts the pages that matter one
 * level down, and they reach the shared assets/ tree by climbing — so the original
 * regex missed exactly the files such a session cares about. Idempotent either
 * way: a rewritten reference starts with the R2 origin and no longer matches.
 */
const ASSET_REF = /(["'])(?:\.\.\/)*assets\//g;

/**
 * Every HTML page under the prototype directory, recursively.
 *
 * Scanning only the top level silently skipped subdirectory builds: the deploy
 * then succeeded and every image 404'd, because publish-prototype.ts excludes
 * assets/ from the upload. assets/ is skipped here because an .html sitting
 * inside it is documentation, not a page.
 */
function findHtml(dir: string, prototypeDir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.relative(prototypeDir, full) === "assets") continue;
      out.push(...findHtml(full, prototypeDir));
    } else if (entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out.sort();
}

/**
 * Resolve --pages to absolute paths, failing loudly on a typo rather than
 * silently scanning nothing (which would upload nothing and rewrite nothing).
 */
function resolvePages(prototypeDir: string, pages: string[]): string[] {
  return pages.map((page) => {
    const full = path.resolve(prototypeDir, page);
    if (!fs.existsSync(full)) {
      throw new Error(`--pages: no such file "${page}" under ${prototypeDir}`);
    }
    return full;
  });
}

/**
 * The asset paths (relative to assets/) that a set of pages actually references.
 * Both forms count: not-yet-rewritten relative references, and already-rewritten
 * R2 URLs — so re-running against an already-published session still resolves the
 * same set rather than finding none.
 */
function referencedAssets(htmlFiles: string[], prefix: string, publicBase: string): Set<string> {
  const found = new Set<string>();
  const relative = /["'](?:\.\.\/)*assets\/([^"']+)/g;
  const absolute = new RegExp(
    `["']${publicBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/${prefix}assets/([^"']+)`,
    "g"
  );

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf-8");
    for (const re of [relative, absolute]) {
      re.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = re.exec(html)) !== null) found.add(match[1]);
    }
  }
  return found;
}

/** Rewrite relative asset references in the given files to absolute R2 URLs. */
function rewriteHtml(htmlFiles: string[], prefix: string, publicBase: string, dryRun: boolean) {
  const replacement = `$1${publicBase}/${prefix}assets/`;
  let changedFiles = 0;
  let totalRefs = 0;

  for (const file of htmlFiles) {
    const before = fs.readFileSync(file, "utf-8");
    const matches = before.match(ASSET_REF);
    if (!matches) continue;

    totalRefs += matches.length;
    changedFiles++;
    if (!dryRun) {
      fs.writeFileSync(file, before.replace(ASSET_REF, replacement), "utf-8");
    }
  }

  return { htmlFiles: htmlFiles.length, changedFiles, totalRefs };
}

/** Confirm every uploaded object is actually fetchable over the public URL. */
async function verify(plan: AssetPlan[]): Promise<string[]> {
  const failures: string[] = [];
  const batchSize = 8;

  for (let i = 0; i < plan.length; i += batchSize) {
    const batch = plan.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (asset) => {
        try {
          const response = await fetch(asset.url, { method: "HEAD" });
          if (!response.ok) {
            failures.push(`${response.status} ${asset.url}`);
            return;
          }
          const served = response.headers.get("content-type") ?? "";
          if (!served.startsWith(asset.contentType)) {
            failures.push(
              `content-type "${served}" (expected "${asset.contentType}") ${asset.url}`
            );
          }
        } catch (error) {
          failures.push(`${error instanceof Error ? error.message : "fetch failed"} ${asset.url}`);
        }
      })
    );
    process.stdout.write(`   verified ${Math.min(i + batchSize, plan.length)}/${plan.length}\r`);
  }
  process.stdout.write("\n");
  return failures;
}

async function main() {
  const args = process.argv.slice(2);
  const pagesFlag = args.indexOf("--pages");
  const pagesValue = pagesFlag !== -1 ? args[pagesFlag + 1] : undefined;
  const positional = args.filter(
    (a, i) => !a.startsWith("--") && !(pagesFlag !== -1 && i === pagesFlag + 1)
  );
  const options: Options = {
    dryRun: args.includes("--dry-run"),
    rewrite: !args.includes("--no-rewrite"),
    force: args.includes("--force"),
    pages: pagesValue
      ? pagesValue
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [],
  };

  if (positional.length !== 1) {
    console.error(
      "Usage: npx tsx tools/upload-prototype-assets.ts <prototype-dir> [--dry-run] [--no-rewrite] [--force] [--pages a.html,sub/b.html]"
    );
    process.exit(1);
  }

  const prototypeDir = path.resolve(positional[0]);
  if (!fs.existsSync(prototypeDir)) {
    console.error(`Prototype directory not found: ${prototypeDir}`);
    process.exit(1);
  }

  const client = getR2Client();
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!publicBase) {
    console.error(
      "NEXT_PUBLIC_R2_PUBLIC_URL is not set in .env.local — refusing to rewrite HTML to an unknown origin."
    );
    process.exit(1);
  }

  const slug = deriveSlug(prototypeDir);
  const prefix = `prototypes/${slug}/`;
  const base = publicBase.replace(/\/$/, "");

  // --pages narrows the job to the pages actually being published. Without it a
  // session that has accumulated superseded directions uploads their assets too:
  // this session carries 137MB of art-direction plates referenced only by work
  // the client has already rejected.
  const htmlFiles = options.pages.length
    ? resolvePages(prototypeDir, options.pages)
    : findHtml(prototypeDir, prototypeDir);

  const fullPlan = buildPlan(prototypeDir, prefix, base);
  let plan = fullPlan;
  let excluded: AssetPlan[] = [];
  if (options.pages.length) {
    const wanted = referencedAssets(htmlFiles, prefix, base);
    plan = fullPlan.filter((a) => wanted.has(a.relativePath.replace(/^assets\//, "")));
    excluded = fullPlan.filter((a) => !plan.includes(a));

    const missing = [...wanted].filter(
      (rel) => !fullPlan.some((a) => a.relativePath === `assets/${rel}`)
    );
    if (missing.length) {
      console.error(
        `\n❌ ${missing.length} referenced asset(s) do not exist locally — rebuild them before uploading:`
      );
      missing.slice(0, 10).forEach((m) => console.error(`   assets/${m}`));
      process.exit(1);
    }
  }

  const live = plan.filter((a) => !a.archive);
  const archived = plan.filter((a) => a.archive);
  const sum = (items: AssetPlan[]) => items.reduce((n, a) => n + a.bytes, 0);

  console.log(
    `\n📦 Prototype asset upload${options.dryRun ? " (DRY RUN — nothing will be written)" : ""}\n`
  );
  console.log(`   Source:  ${prototypeDir}`);
  console.log(`   Bucket:  ${client.getBucketName()}`);
  console.log(`   Prefix:  ${prefix}`);
  console.log(`   Base:    ${publicBase}\n`);
  console.log(`   Live assets:  ${live.length} files, ${formatBytes(sum(live))}  (${CACHE_LIVE})`);
  console.log(
    `   Archived:     ${archived.length} files, ${formatBytes(sum(archived))}  (${CACHE_ARCHIVE})`
  );
  console.log(`   Total:        ${plan.length} files, ${formatBytes(sum(plan))}\n`);
  console.log(
    `   Pages:        ${htmlFiles.length} HTML file(s)${options.pages.length ? ` (--pages: ${options.pages.join(", ")})` : " (all, recursive)"}`
  );
  if (excluded.length) {
    console.log(
      `   Not uploaded: ${excluded.length} files, ${formatBytes(sum(excluded))} — present in assets/ but referenced by no published page`
    );
  }
  console.log("");

  if (options.dryRun) {
    console.log("   Sample keys:");
    for (const asset of [...live.slice(0, 3), ...archived.slice(0, 2)]) {
      console.log(`     ${asset.relativePath}  ->  ${asset.key}  [${asset.contentType}]`);
    }
    const rewriteStats = rewriteHtml(htmlFiles, prefix, base, true);
    console.log(
      `\n   Rewrite: ${rewriteStats.totalRefs} references across ${rewriteStats.changedFiles}/${rewriteStats.htmlFiles} HTML files`
    );
    console.log("\n   Dry run complete. Re-run without --dry-run to apply.\n");
    return;
  }

  // Upload
  let uploaded = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (let i = 0; i < plan.length; i++) {
    const asset = plan[i];
    const position = `[${i + 1}/${plan.length}]`;

    if (!options.force) {
      const existing = await client.headFile(asset.key);
      if (existing && existing.size === asset.bytes) {
        skipped++;
        process.stdout.write(`${position} skip (unchanged) ${asset.key}\n`);
        continue;
      }
    }

    const result = await client.uploadFile(asset.localPath, asset.key, {
      contentType: asset.contentType,
      cacheControl: asset.cacheControl,
    });

    if (result.success) {
      uploaded++;
      process.stdout.write(`${position} up   ${asset.key} (${formatBytes(asset.bytes)})\n`);
    } else {
      failed.push(`${asset.key}: ${result.error}`);
      process.stdout.write(`${position} FAIL ${asset.key} — ${result.error}\n`);
    }
  }

  console.log(`\n   Uploaded ${uploaded}, skipped ${skipped}, failed ${failed.length}`);
  if (failed.length) {
    console.error(
      "\n❌ Uploads failed — not rewriting HTML:\n" + failed.map((f) => `   ${f}`).join("\n")
    );
    process.exit(1);
  }

  // Verify before touching the HTML, so a bad upload can never orphan a reference.
  console.log("\n🔎 Verifying public URLs...");
  const failures = await verify(plan);
  if (failures.length) {
    console.error(`\n❌ ${failures.length} object(s) not fetchable — not rewriting HTML:`);
    failures.slice(0, 10).forEach((f) => console.error(`   ${f}`));
    process.exit(1);
  }
  console.log(`   All ${plan.length} objects return 200 with the expected content type.`);

  // Manifest — the record of what is where, for cleanup or re-pointing later.
  const manifestPath = path.join(prototypeDir, "assets-manifest.json");
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        slug,
        bucket: client.getBucketName(),
        prefix,
        publicBase,
        totalBytes: sum(plan),
        assets: plan.map(({ relativePath, key, url, contentType, bytes, archive }) => ({
          relativePath,
          key,
          url,
          contentType,
          bytes,
          archive,
        })),
      },
      null,
      2
    ) + "\n",
    "utf-8"
  );
  console.log(`\n📝 Manifest: ${path.relative(process.cwd(), manifestPath)}`);

  if (options.rewrite) {
    const stats = rewriteHtml(htmlFiles, prefix, base, false);
    console.log(
      `✏️  Rewrote ${stats.totalRefs} references across ${stats.changedFiles}/${stats.htmlFiles} HTML files`
    );
  } else {
    console.log("✏️  Skipped HTML rewrite (--no-rewrite)");
  }

  console.log("\n✅ Done. Local asset files can now be removed — they are all in R2.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
