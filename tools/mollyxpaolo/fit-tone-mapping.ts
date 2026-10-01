#!/usr/bin/env tsx
/**
 * Fit the photographer's colour→B&W and colour→sepia mapping from the matched pairs, so the
 * enhanced set (colour only) can be given sepia/B&W versions that match the rest.
 *
 * Model: Y = wr·R + wg·G + wb·B (least squares against the photographer's B&W), then 256-bin LUTs
 * Y→B&W and Y→sepia(R,G,B) from bin means. Evaluated on held-out pairs (MAE, 0–255 scale).
 *
 * Usage: npx tsx tools/mollyxpaolo/fit-tone-mapping.ts <source-dir> <out.json>
 */
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const [srcDir, outPath] = process.argv.slice(2);
if (!srcDir || !outPath) throw new Error("usage: fit-tone-mapping.ts <source-dir> <out.json>");

const dirs = fs.readdirSync(srcDir);
const find = (tag: string) =>
  path.join(srcDir, dirs.find((d) => d.startsWith("341_") && d.includes(tag))!);
const colourDir = find("_color_");
const bwDir = find("_B_W_");
const sepiaDir = find("_sepia_");

const SAMPLE_W = 300;
async function raw(file: string): Promise<Buffer> {
  // Resize to an exact box so all three variants align pixel-for-pixel.
  return sharp(file)
    .resize(SAMPLE_W, 200, { fit: "fill" })
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer();
}

const names = fs
  .readdirSync(colourDir)
  .filter((f) => /VK-\d+\.jpg$/.test(f))
  .sort();
// Every 10th file for evaluation, a spread of others for fitting.
const evalSet = names.filter((_, i) => i % 10 === 5);
const fitSet = names.filter((_, i) => i % 10 !== 5 && i % 4 === 0);

async function load(set: string[]) {
  const out: { c: Buffer; bw: Buffer; sp: Buffer; name: string }[] = [];
  for (const n of set) {
    out.push({
      name: n,
      c: await raw(path.join(colourDir, n)),
      bw: await raw(path.join(bwDir, n)),
      sp: await raw(path.join(sepiaDir, n)),
    });
  }
  return out;
}

function solve3(A: number[][], b: number[]): number[] {
  // Gaussian elimination on a small dense system.
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
    [M[i], M[p]] = [M[p], M[i]];
    for (let k = i + 1; k < n; k++) {
      const f = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

(async () => {
  const fit = await load(fitSet);
  const ev = await load(evalSet);

  // 1. Channel weights (with intercept) for B&W.
  const AtA = [...Array(4)].map(() => new Array(4).fill(0));
  const Atb = new Array(4).fill(0);
  for (const { c, bw } of fit) {
    for (let p = 0; p < c.length; p += 3) {
      const v = [c[p], c[p + 1], c[p + 2], 255];
      const y = bw[p];
      for (let i = 0; i < 4; i++) {
        Atb[i] += v[i] * y;
        for (let j = 0; j < 4; j++) AtA[i][j] += v[i] * v[j];
      }
    }
  }
  const [wr, wg, wb] = solve3(AtA, Atb);
  const s = wr + wg + wb;
  const weights = [wr / s, wg / s, wb / s];
  const lum = (c: Buffer, p: number) =>
    Math.max(
      0,
      Math.min(255, Math.round(weights[0] * c[p] + weights[1] * c[p + 1] + weights[2] * c[p + 2]))
    );

  // 2. LUTs from Y bin means.
  const sums = [...Array(256)].map(() => [0, 0, 0, 0, 0]); // bw, sR, sG, sB, n
  for (const { c, bw, sp } of fit) {
    for (let p = 0; p < c.length; p += 3) {
      const y = lum(c, p);
      const t = sums[y];
      t[0] += bw[p];
      t[1] += sp[p];
      t[2] += sp[p + 1];
      t[3] += sp[p + 2];
      t[4]++;
    }
  }
  // Fill empty bins by interpolation, then enforce monotonic (non-decreasing) curves.
  const lut = (k: number) => {
    const v = sums.map((t) => (t[4] > 20 ? t[k] / t[4] : NaN));
    for (let i = 0; i < 256; i++)
      if (isNaN(v[i])) {
        let a = i - 1;
        while (a >= 0 && isNaN(v[a])) a--;
        let b = i + 1;
        while (b < 256 && isNaN(v[b])) b++;
        v[i] =
          a < 0
            ? b < 256
              ? v[b]
              : i
            : b > 255
              ? v[a]
              : v[a] + ((v[b] - v[a]) * (i - a)) / (b - a);
      }
    for (let i = 1; i < 256; i++) v[i] = Math.max(v[i], v[i - 1]);
    return v.map((x) => Math.round(Math.max(0, Math.min(255, x))));
  };
  const bwLut = lut(0);
  const sepiaLut = [lut(1), lut(2), lut(3)];

  // 3. Held-out error, plus a naive baseline for comparison.
  let eBw = 0,
    eSp = 0,
    eBase = 0,
    n = 0;
  const perImage: { name: string; bw: number; sepia: number }[] = [];
  for (const { c, bw, sp, name } of ev) {
    let ib = 0,
      is = 0,
      m = 0;
    for (let p = 0; p < c.length; p += 3) {
      const y = lum(c, p);
      ib += Math.abs(bwLut[y] - bw[p]);
      is +=
        (Math.abs(sepiaLut[0][y] - sp[p]) +
          Math.abs(sepiaLut[1][y] - sp[p + 1]) +
          Math.abs(sepiaLut[2][y] - sp[p + 2])) /
        3;
      eBase += Math.abs(Math.round(0.299 * c[p] + 0.587 * c[p + 1] + 0.114 * c[p + 2]) - bw[p]);
      m++;
    }
    eBw += ib;
    eSp += is;
    n += m;
    perImage.push({ name, bw: +(ib / m).toFixed(2), sepia: +(is / m).toFixed(2) });
  }
  const report = {
    fittedOn: fit.length,
    evaluatedOn: ev.length,
    weights: weights.map((w) => +w.toFixed(4)),
    maeBw: +(eBw / n).toFixed(2),
    maeSepia: +(eSp / n).toFixed(2),
    maeNaiveRec601Bw: +(eBase / n).toFixed(2),
    worst: perImage.sort((a, b) => b.bw + b.sepia - a.bw - a.sepia).slice(0, 5),
  };
  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync(outPath, JSON.stringify({ weights, bwLut, sepiaLut, report }, null, 2));
})();
