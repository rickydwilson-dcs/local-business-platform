#!/usr/bin/env tsx
/**
 * Apply a fitted tone mapping (see fit-tone-mapping.ts) to a colour JPEG at full resolution.
 * Usage: npx tsx tools/mollyxpaolo/apply-tone-mapping.ts <mapping.json> <bw|sepia> <in.jpg> <out.jpg>
 */
import * as fs from "fs";
import sharp from "sharp";

export interface ToneMapping {
  weights: number[];
  bwLut: number[];
  sepiaLut: number[][];
}

export async function applyToneMapping(
  m: ToneMapping,
  tone: "bw" | "sepia",
  input: string
): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  const [wr, wg, wb] = m.weights;
  for (let p = 0; p < data.length; p += 3) {
    const y = Math.max(
      0,
      Math.min(255, Math.round(wr * data[p] + wg * data[p + 1] + wb * data[p + 2]))
    );
    if (tone === "bw") out[p] = out[p + 1] = out[p + 2] = m.bwLut[y];
    else {
      out[p] = m.sepiaLut[0][y];
      out[p + 1] = m.sepiaLut[1][y];
      out[p + 2] = m.sepiaLut[2][y];
    }
  }
  // Keep EXIF (capture time, camera) so the generated variants sort and describe like the originals.
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .withMetadata()
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();
}

if (require.main === module) {
  const [mapPath, tone, input, output] = process.argv.slice(2);
  if (!output || (tone !== "bw" && tone !== "sepia"))
    throw new Error("usage: apply-tone-mapping.ts <mapping.json> <bw|sepia> <in.jpg> <out.jpg>");
  const m = JSON.parse(fs.readFileSync(mapPath, "utf8")) as ToneMapping;
  applyToneMapping(m, tone, input).then((b) => fs.writeFileSync(output, b));
}
