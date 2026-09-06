#!/usr/bin/env node
/**
 * Generate a hosted document page from an artifact source file.
 *
 * The artifact source is a head-fragment plus a body-fragment (claude.ai wraps it).
 * Vercel needs a whole document, so this wraps it — and swaps the Google Fonts
 * stylesheet for self-hosted woff2.
 *
 * Why the swap: the Google stylesheet is render-blocking and chains to a second
 * origin for the font files (Lighthouse measured ~1,680ms of savings). The DCS
 * Next.js sites never hit this because next/font self-hosts at build time; a
 * hand-built static page has to do it explicitly. Archivo is a variable font, so
 * every weight we use comes from one file.
 *
 *   node build-page.mjs <artifact-source.html> <out-dir>
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [src, outDir] = process.argv.slice(2);
if (!src || !outDir) {
  console.error("usage: node build-page.mjs <artifact-source.html> <out-dir>");
  process.exit(1);
}

const raw = readFileSync(src, "utf8");
const cut = raw.indexOf("</style>") + "</style>".length;
let head = raw.slice(0, cut);
const body = raw.slice(cut);

// drop the third-party font requests: the stylesheet and the preconnects that serve it
const before = head;
head = head
  .replace(/<link rel="preconnect"[^>]*>\s*/g, "")
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g, "");
if (head === before) console.warn("! no Google Fonts link found to replace — check the source");

const fonts = `<link rel="preload" href="/fonts/archivo-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/poppins-300-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
  /* self-hosted, latin subset, same origin — no third-party request on the critical path */
  @font-face {
    font-family: "Archivo";
    src: url("/fonts/archivo-latin-var.woff2") format("woff2");
    font-weight: 100 900;  /* variable: one file covers every weight the page uses */
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    src: url("/fonts/poppins-300-latin.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
</style>`;

const doc = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="referrer" content="no-referrer">
${fonts}
${head}
<style>
  html { color-scheme: dark; }
  body { margin: 0; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
</head>
<body>
${body}
</body>
</html>
`;

const out = join(outDir, "index.html");
writeFileSync(out, doc);
console.log(`wrote ${out} (${doc.length} bytes)`);
