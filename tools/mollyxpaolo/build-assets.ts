#!/usr/bin/env tsx
/**
 * Build every derivative the mollyxpaolo gallery serves, plus its manifest. Local only — uploading
 * is a separate, dry-run-first step (upload-assets.ts).
 *
 * Per photo × tone (colour / sepia / bw):
 *   w480, w1080, w2048 WebP  — display sizes, metadata stripped
 *   4k JPEG                  — 3840px long edge, q90, EXIF kept (no GPS in the source set)
 *   original JPEG            — the photographer's file, byte-for-byte; for the enhanced set's
 *                              sepia/bw, our tone-mapped full-res render
 *   placeholder              — 16px WebP, inlined in the manifest as a data URI
 *
 * Idempotent: an output that already exists is not rebuilt. Delete it to force.
 *
 * Usage:
 *   npx tsx tools/mollyxpaolo/build-assets.ts --src <dir> --out <dir> --mapping <tone-mapping.json>
 *     [--only <id,id>] [--concurrency 4]
 */
import { execFileSync } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { applyToneMapping, type ToneMapping } from "./apply-tone-mapping";

const TONES = ["colour", "sepia", "bw"] as const;
type Tone = (typeof TONES)[number];
const DISPLAY_WIDTHS = [480, 1080, 2048] as const;
const FOURK = 3840;

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  if (fallback !== undefined) return fallback;
  throw new Error(`--${name} is required`);
}

const SRC = arg("src");
const OUT = arg("out");
const MAPPING = JSON.parse(fs.readFileSync(arg("mapping"), "utf8")) as ToneMapping;
const ONLY = new Set(arg("only", "").split(",").filter(Boolean));
const CONCURRENCY = Number(arg("concurrency", "4"));

const srcDirs = fs.readdirSync(SRC);
const dirFor = (tag: string) => path.join(SRC, srcDirs.find((d) => d.includes(tag))!);
const MAIN: Record<Tone, string> = {
  colour: dirFor("_color_"),
  sepia: dirFor("_sepia_"),
  bw: dirFor("_B_W_"),
};
const ENHANCED = dirFor("_enhanced_");

/**
 * The random path segment that keeps keys unguessable (public buckets cannot be listed, so a
 * key is only reachable by someone who has been given it). Generated once, then reused, so a
 * re-run never orphans uploaded objects.
 */
function pathToken(): string {
  const f = path.join(OUT, "path-token.txt");
  if (!fs.existsSync(f)) {
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(f, crypto.randomBytes(12).toString("base64url"));
  }
  return fs.readFileSync(f, "utf8").trim();
}

interface Source {
  id: string; // "vk-023"
  number: number;
  file: string; // photographer's filename
  enhanced: boolean;
}

function sources(): Source[] {
  const list: Source[] = [];
  const add = (dir: string, enhanced: boolean) => {
    for (const file of fs.readdirSync(dir)) {
      const m = /VK-(\d+)\.jpg$/.exec(file);
      if (!m) continue; // Waiver.jpg and anything else that isn't a photo
      const number = Number(m[1]);
      list.push({ id: `vk-${String(number).padStart(3, "0")}`, number, file, enhanced });
    }
  };
  add(MAIN.colour, false);
  add(ENHANCED, true);
  return list.sort((a, b) => a.number - b.number).filter((s) => ONLY.size === 0 || ONLY.has(s.id));
}

/** One exiftool pass over both colour sources for capture time — far cheaper than per-file. */
function captureTimes(): Map<string, string> {
  const json = execFileSync(
    "exiftool",
    ["-json", "-DateTimeOriginal", "-SubSecTimeOriginal", MAIN.colour, ENHANCED],
    {
      maxBuffer: 64 * 1024 * 1024,
    }
  ).toString();
  const out = new Map<string, string>();
  for (const r of JSON.parse(json) as {
    SourceFile: string;
    DateTimeOriginal?: string;
    SubSecTimeOriginal?: number | string;
  }[]) {
    if (!r.DateTimeOriginal) continue;
    // "2026:09:22 13:31:33" is local Las Vegas time (no offset recorded); keep it as such.
    const [d, t] = r.DateTimeOriginal.split(" ");
    const sub =
      r.SubSecTimeOriginal !== undefined ? `.${String(r.SubSecTimeOriginal).padEnd(2, "0")}` : "";
    out.set(path.basename(r.SourceFile), `${d.replace(/:/g, "-")}T${t}${sub}`);
  }
  return out;
}

const key = (token: string, tone: Tone, variant: string, id: string, ext: string) =>
  `${token}/${tone}/${variant}/${id}.${ext}`;

async function buildOne(s: Source, token: string) {
  const tones: Partial<Record<Tone, { variants: Record<string, string>; placeholder: string }>> =
    {};
  let width = 0,
    height = 0;

  for (const tone of TONES) {
    // The source for this tone: the photographer's file, or (enhanced sepia/bw) our render.
    const originalKey = key(token, tone, "original", s.id, "jpg");
    const originalOut = path.join(OUT, originalKey);
    if (!fs.existsSync(originalOut)) {
      fs.mkdirSync(path.dirname(originalOut), { recursive: true });
      if (!s.enhanced) fs.copyFileSync(path.join(MAIN[tone], s.file), originalOut);
      else if (tone === "colour") fs.copyFileSync(path.join(ENHANCED, s.file), originalOut);
      else
        fs.writeFileSync(
          originalOut,
          await applyToneMapping(MAPPING, tone, path.join(ENHANCED, s.file))
        );
    }

    // Decode once, fan out the resizes from the same pipeline.
    const base = sharp(originalOut, { limitInputPixels: false }).rotate();
    const meta = await base.metadata();
    width = meta.width!;
    height = meta.height!;
    const variants: Record<string, string> = { original: originalKey };

    for (const w of DISPLAY_WIDTHS) {
      const k = key(token, tone, `w${w}`, s.id, "webp");
      variants[`w${w}`] = k;
      const f = path.join(OUT, k);
      if (fs.existsSync(f)) continue;
      fs.mkdirSync(path.dirname(f), { recursive: true });
      await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w <= 480 ? 72 : 78, effort: 5 })
        .toFile(f);
    }

    const k4 = key(token, tone, "4k", s.id, "jpg");
    variants["4k"] = k4;
    const f4 = path.join(OUT, k4);
    if (!fs.existsSync(f4)) {
      fs.mkdirSync(path.dirname(f4), { recursive: true });
      await base
        .clone()
        .resize({ width: FOURK, height: FOURK, fit: "inside", withoutEnlargement: true })
        .withMetadata()
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(f4);
    }

    const ph = await base.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    tones[tone] = { variants, placeholder: `data:image/webp;base64,${ph.toString("base64")}` };
  }

  return { width, height, tones };
}

async function main() {
  const token = pathToken();
  const list = sources();
  const times = captureTimes();
  console.log(`Building ${list.length} photos × ${TONES.length} tones → ${OUT}`);

  const results: Record<string, Awaited<ReturnType<typeof buildOne>>> = {};
  let done = 0;
  const queue = [...list];
  const started = Date.now();
  await Promise.all(
    [...Array(CONCURRENCY)].map(async () => {
      for (let s = queue.shift(); s; s = queue.shift()) {
        results[s.id] = await buildOne(s, token);
        done++;
        if (done % 10 === 0 || done === list.length) {
          const rate = (Date.now() - started) / done / 1000;
          console.log(
            `  ${done}/${list.length}  (~${Math.round(rate * (list.length - done))}s left)`
          );
        }
      }
    })
  );

  const photos = list.map((s) => {
    const r = results[s.id];
    return {
      id: s.id,
      number: s.number,
      album: "wedding",
      sourceFile: s.file,
      takenAt: times.get(s.file) ?? null,
      width: r.width,
      height: r.height,
      orientation:
        r.width > r.height * 1.05 ? "landscape" : r.height > r.width * 1.05 ? "portrait" : "square",
      enhanced: s.enhanced,
      // Seeded from the brief: the enhanced set is the homepage feature. Molly's admin overrides it.
      featured: s.enhanced,
      // Tones generated by us rather than delivered by the photographer.
      generatedTones: s.enhanced ? ["sepia", "bw"] : [],
      tones: r.tones,
    };
  });
  // Chronological, photographer's number as the tie-break. A photo with no capture time (VK-349,
  // a collage built after the day) sorts after everything that has one.
  photos.sort((a, b) => (a.takenAt ?? "~").localeCompare(b.takenAt ?? "~") || a.number - b.number);

  const manifestPath = path.join(OUT, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      { version: 1, generatedAt: new Date().toISOString(), pathToken: token, photos },
      null,
      2
    )
  );
  console.log(
    `Wrote ${manifestPath} (${photos.length} photos, ${Math.round((Date.now() - started) / 1000)}s)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
