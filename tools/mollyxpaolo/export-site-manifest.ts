#!/usr/bin/env tsx
/**
 * Write sites/mollyxpaolo/content/photos.json from the build manifest (build-assets.ts output).
 *
 * The site only needs what it can't derive: variant keys follow
 * `<pathToken>/<tone>/<variant>/<id>.<ext>`, so they're dropped, and the media base (which holds
 * the path token) comes from the site's MXP_MEDIA_BASE env var instead of the repo. The path
 * token never lands in git.
 *
 * Hero curation is data here, not code: `heroOk` is false for the enhanced photos whose
 * lettering collides with the title (341, 347) and for the collages (349, 350); `heroOrder`
 * leads with the bright, wide favourites.
 *
 * Usage: npx tsx tools/mollyxpaolo/export-site-manifest.ts --build ~/Downloads/mollyxpaolo-build
 */
import * as fs from "fs";
import * as path from "path";

const TONES = ["colour", "sepia", "bw"] as const;
const NO_HERO = new Set(["vk-341", "vk-347", "vk-349", "vk-350"]);
const HERO_ORDER = ["vk-343", "vk-348", "vk-345", "vk-342"];

interface BuildPhoto {
  id: string;
  number: number;
  album: string;
  takenAt: string | null;
  width: number;
  height: number;
  featured: boolean;
  enhanced: boolean;
  tones: Record<(typeof TONES)[number], { placeholder: string }>;
}

function arg(name: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i < 0 || !process.argv[i + 1]) throw new Error(`--${name} is required`);
  return process.argv[i + 1].replace(/^~(?=\/)/, process.env.HOME ?? "~");
}

const manifest = JSON.parse(fs.readFileSync(path.join(arg("build"), "manifest.json"), "utf8")) as {
  version: number;
  photos: BuildPhoto[];
};

const photos = manifest.photos.map((p) => {
  for (const t of TONES) if (!p.tones[t]) throw new Error(`${p.id} is missing tone ${t}`);
  return {
    id: p.id,
    n: p.number,
    album: p.album,
    // Wall-clock capture time only: the chapters are windows within the one afternoon. A few
    // enhanced exports carry a wrong camera date but the right time of day.
    t: p.takenAt ? p.takenAt.slice(11, 16) : null,
    w: p.width,
    h: p.height,
    featured: p.featured,
    enhanced: p.enhanced,
    heroOk: p.enhanced && !NO_HERO.has(p.id),
    ph: Object.fromEntries(TONES.map((t) => [t, p.tones[t].placeholder])),
  };
});

const out = path.resolve(__dirname, "../../sites/mollyxpaolo/content/photos.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(
  out,
  JSON.stringify({ version: manifest.version, heroOrder: HERO_ORDER, photos }, null, 1) + "\n"
);
console.log(
  `${photos.length} photos (${photos.filter((p) => p.featured).length} featured) → ${path.relative(process.cwd(), out)}, ${Math.round(fs.statSync(out).size / 1024)} KB`
);
