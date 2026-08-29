#!/usr/bin/env node
/**
 * trace-logo.mjs — turn the DPM wordmark raster into a real vector.
 *
 * DPM have no AI/EPS/SVG of their logo; the best copy that exists anywhere is a
 * 1955x849 PNG on their Wix site, which does at least carry a clean alpha
 * channel. This traces that alpha to closed polygons so the mark scales.
 *
 * It is a stopgap, not a redraw. The output is polygonal — curves are many
 * short straight segments, not Béziers — so it is crisp at any size a browser
 * will render it at, and wrong to hand to a signwriter or an embroiderer.
 * Replace it the moment DPM supply real artwork.
 *
 * Pipeline: alpha channel -> binary grid -> marching-squares contours ->
 * Ramer-Douglas-Peucker simplification -> SVG paths with fill-rule evenodd
 * (which is what makes the counters of D, P, O, B drop out).
 *
 * Input is a raw 8-bit greyscale dump of the alpha channel, which is what
 * `magick <png> -alpha extract -depth 8 gray:-` produces. Dimensions are
 * passed in because a headerless gray dump carries none.
 *
 *   magick logo.png -alpha extract -depth 8 gray:alpha.raw
 *   node trace-logo.mjs alpha.raw <w> <h> out.svg
 */

import { readFileSync, writeFileSync } from 'node:fs';

const [, , rawPath, wArg, hArg, outPath] = process.argv;
if (!rawPath || !wArg || !hArg || !outPath) {
  console.error('usage: trace-logo.mjs <alpha.raw> <width> <height> <out.svg>');
  process.exit(1);
}

const W = Number(wArg);
const H = Number(hArg);
const raw = readFileSync(rawPath);
if (raw.length !== W * H) {
  console.error(`expected ${W * H} bytes for ${W}x${H}, got ${raw.length}`);
  process.exit(1);
}

/* Binary field, padded by one transparent pixel all round so every contour is
   closed and nothing runs off the edge of the grid. */
const THRESHOLD = 128;
const GW = W + 2;
const GH = H + 2;
const solid = new Uint8Array(GW * GH);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    solid[(y + 1) * GW + (x + 1)] = raw[y * W + x] >= THRESHOLD ? 1 : 0;
  }
}
const at = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : solid[y * GW + x]);

/*
 * Marching squares on the DUAL grid: each lattice point (x, y) sits at the
 * corner of four pixels, and the 4-bit case number says which of those four
 * are solid. Contours therefore run along pixel boundaries, which is exactly
 * where a glyph edge is.
 *
 *   bit 1 = pixel above-left    bit 2 = above-right
 *   bit 4 = below-left          bit 8 = below-right
 */
function caseAt(x, y) {
  return at(x - 1, y - 1) | (at(x, y - 1) << 1) | (at(x - 1, y) << 2) | (at(x, y) << 3);
}

/*
 * Direction to leave a lattice point, per case, chosen so that solid always
 * lies to the LEFT of travel. In screen coordinates (y down) the left of a
 * heading (dx, dy) is (dy, -dx), which is what each entry below was derived
 * against.
 *
 * 6 and 9 are the saddles — the two solid pixels meet only at this point.
 * Neither occurs anywhere in this artwork (verified: the case histogram for
 * the DPM alpha channel contains zero 6s and zero 9s), so the resolution
 * below is a consistent fallback rather than a considered choice.
 */
const STEP = {
  1: [0, -1],  // NW solid — vertical-ish corner, head north
  2: [1, 0],   // NE solid
  3: [1, 0],   // top row solid — horizontal edge, head east
  4: [-1, 0],  // SW solid
  5: [0, -1],  // left column solid — vertical edge, head north
  6: [0, -1],  // saddle (NE + SW)
  7: [1, 0],   // all but SE
  8: [0, 1],   // SE solid
  9: [0, 1],   // saddle (NW + SE)
  10: [0, 1],  // right column solid — vertical edge, head south
  11: [0, 1],  // all but SW
  12: [-1, 0], // bottom row solid — horizontal edge, head west
  13: [0, -1], // all but NE
  14: [-1, 0], // all but NW
};

const visited = new Set();
const key = (x, y, dx, dy) => `${x},${y},${dx},${dy}`;
const contours = [];

for (let y = 0; y <= GH; y++) {
  for (let x = 0; x <= GW; x++) {
    const c = caseAt(x, y);
    if (c === 0 || c === 15) continue;
    const step = STEP[c];
    if (!step) continue;
    if (visited.has(key(x, y, step[0], step[1]))) continue;

    const pts = [];
    let cx = x;
    let cy = y;
    let guard = 0;
    const limit = GW * GH * 4;
    while (guard++ < limit) {
      const cc = caseAt(cx, cy);
      const s = STEP[cc];
      if (!s) break;
      const k = key(cx, cy, s[0], s[1]);
      if (visited.has(k)) break;
      visited.add(k);
      pts.push([cx, cy]);
      cx += s[0];
      cy += s[1];
      if (cx === x && cy === y) break;
    }
    if (pts.length > 7) contours.push(pts);
  }
}

/*
 * Ramer-Douglas-Peucker. Tolerance is in source pixels.
 *
 * Applied naively to a closed ring this collapses to nothing: the first and
 * last point are the same, so the baseline segment has zero length and every
 * interior point measures zero distance from it. `simplifyRing` below breaks
 * the ring at its two most distant points first, so each half is an open
 * polyline with a real baseline.
 */
function rdp(points, eps) {
  if (points.length < 3) return points;
  let maxD = 0;
  let idx = 0;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps) return [points[0], points[points.length - 1]];
  return [
    ...rdp(points.slice(0, idx + 1), eps).slice(0, -1),
    ...rdp(points.slice(idx), eps),
  ];
}

function simplifyRing(ring, eps) {
  if (ring.length < 4) return ring;
  /* Split at the vertex furthest from ring[0]; that guarantees two arcs that
     each have a baseline long enough for RDP to measure against. */
  const [ax, ay] = ring[0];
  let far = 1;
  let farD = -1;
  for (let i = 1; i < ring.length; i++) {
    const d = Math.hypot(ring[i][0] - ax, ring[i][1] - ay);
    if (d > farD) { farD = d; far = i; }
  }
  const a = rdp(ring.slice(0, far + 1), eps);
  const b = rdp([...ring.slice(far), ring[0]], eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

const EPS = Number(process.env.EPS || 0.8);   /* 14.7 KB at 1.9% ink difference from the source raster; 0.4 costs 3x the bytes for 0.25 points of accuracy */
const paths = contours
  .map((c) => simplifyRing(c, EPS))
  .filter((c) => c.length >= 3)
  .map((c) =>
    'M' +
    c
      .map(([x, y]) => `${(x - 1).toFixed(1)} ${(y - 1).toFixed(1)}`)
      .join('L') +
    'Z'
  );

const d = paths.join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="DPM Autobody">
<title>DPM Autobody</title>
<path fill="currentColor" fill-rule="evenodd" d="${d}"/>
</svg>
`;

writeFileSync(outPath, svg);
const pts = contours.reduce((n, c) => n + c.length, 0);
const kept = paths.reduce((n, p) => n + (p.match(/L/g) || []).length + 1, 0);
console.log(
  `${outPath}: ${contours.length} contours, ${pts} -> ${kept} points, ${(svg.length / 1024).toFixed(1)} KB`
);
