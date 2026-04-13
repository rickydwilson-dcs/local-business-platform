/**
 * Asset Downloader
 *
 * Parses HTML for all referenced assets and downloads them into a CPF
 * assets/ directory. No download cap — all assets are fetched.
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { URL } from "url";
import { parse as parseHtml } from "node-html-parser";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AssetUrl {
  url: string;
  type: "image" | "font" | "css" | "unknown";
  source: string; // which HTML element referenced it
}

export interface AssetManifest {
  [originalUrl: string]: string; // local relative path
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function classifyByExtension(url: string): AssetUrl["type"] {
  const pathname = url.split("?")[0].toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico|avif)$/.test(pathname)) return "image";
  if (/\.(woff2?|ttf|otf|eot)$/.test(pathname)) return "font";
  if (/\.css$/.test(pathname)) return "css";
  return "unknown";
}

function resolveUrl(href: string, base: string): string | null {
  if (!href) return null;
  // Skip data URIs and inline SVG
  if (href.startsWith("data:") || href.startsWith("#")) return null;
  try {
    // Protocol-relative
    if (href.startsWith("//")) {
      const baseUrl = new URL(base);
      return `${baseUrl.protocol}${href}`;
    }
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function sanitizeFilename(url: string): string {
  try {
    const parsed = new URL(url);
    let name = parsed.pathname;
    // Remove query strings, decode, replace special chars
    name = decodeURIComponent(name).replace(/[^a-zA-Z0-9._/-]/g, "-");
    // Remove leading slash
    name = name.replace(/^\//, "");
    // Ensure it has content
    if (!name || name === "/") name = "index";
    return name;
  } catch {
    return url.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
  }
}

function extractCssUrls(css: string, base: string, source: string): AssetUrl[] {
  const results: AssetUrl[] = [];
  // Match url('...'), url("..."), url(...)
  const urlRegex = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
  let match;
  while ((match = urlRegex.exec(css)) !== null) {
    const href = match[2].trim();
    const resolved = resolveUrl(href, base);
    if (resolved) {
      results.push({ url: resolved, type: classifyByExtension(resolved), source });
    }
  }
  // @font-face src
  const fontSrcRegex = /src:\s*([^;]+);/gi;
  while ((match = fontSrcRegex.exec(css)) !== null) {
    const srcValue = match[1];
    const fontUrlRegex = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
    let fontMatch;
    while ((fontMatch = fontUrlRegex.exec(srcValue)) !== null) {
      const href = fontMatch[2].trim();
      const resolved = resolveUrl(href, base);
      if (resolved) {
        results.push({ url: resolved, type: "font", source: "@font-face" });
      }
    }
  }
  return results;
}

function parseSrcset(srcset: string, base: string): string[] {
  return srcset
    .split(",")
    .map((s) => s.trim().split(/\s+/)[0])
    .filter(Boolean)
    .map((href) => resolveUrl(href, base))
    .filter((u): u is string => u !== null);
}

// ── Main Functions ───────────────────────────────────────────────────────────

export function extractAssetUrls(html: string, baseUrl: string): AssetUrl[] {
  const results: AssetUrl[] = [];
  const seen = new Set<string>();

  function add(url: string | null, type: AssetUrl["type"], source: string) {
    if (!url || seen.has(url)) return;
    seen.add(url);
    results.push({ url, type, source });
  }

  const root = parseHtml(html);

  // <img src> and <img srcset>
  for (const img of root.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (src) add(resolveUrl(src, baseUrl), "image", "<img src>");
    const srcset = img.getAttribute("srcset");
    if (srcset) {
      for (const u of parseSrcset(srcset, baseUrl)) {
        add(u, "image", "<img srcset>");
      }
    }
  }

  // <link rel="stylesheet" href>
  for (const link of root.querySelectorAll('link[rel="stylesheet"]')) {
    const href = link.getAttribute("href");
    if (href) add(resolveUrl(href, baseUrl), "css", "<link rel=stylesheet>");
  }

  // <source src> and <source srcset>
  for (const source of root.querySelectorAll("source")) {
    const src = source.getAttribute("src");
    if (src) add(resolveUrl(src, baseUrl), classifyByExtension(src), "<source src>");
    const srcset = source.getAttribute("srcset");
    if (srcset) {
      for (const u of parseSrcset(srcset, baseUrl)) {
        add(u, classifyByExtension(u), "<source srcset>");
      }
    }
  }

  // CSS url() in <style> blocks
  for (const styleEl of root.querySelectorAll("style")) {
    const css = styleEl.innerHTML;
    for (const asset of extractCssUrls(css, baseUrl, "<style> block")) {
      add(asset.url, asset.type, asset.source);
    }
  }

  // CSS url() in style attributes
  for (const el of root.querySelectorAll("[style]")) {
    const style = el.getAttribute("style") ?? "";
    for (const asset of extractCssUrls(style, baseUrl, "style attribute")) {
      add(asset.url, asset.type, asset.source);
    }
  }

  return results;
}

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https:") ? https : http;
    const file = fs.createWriteStream(destPath);

    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      // Follow redirects (up to 5)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode && res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", (err) => {
        file.close();
        fs.unlinkSync(destPath);
        reject(err);
      });
    });

    req.on("error", (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

export async function downloadAssets(urls: AssetUrl[], outputDir: string): Promise<AssetManifest> {
  const manifest: AssetManifest = {};

  // Ensure subdirectories
  const subdirs = ["images", "fonts", "css"];
  for (const sub of subdirs) {
    fs.mkdirSync(path.join(outputDir, sub), { recursive: true });
  }

  for (const asset of urls) {
    const subdir =
      asset.type === "image"
        ? "images"
        : asset.type === "font"
          ? "fonts"
          : asset.type === "css"
            ? "css"
            : "images";

    const sanitized = sanitizeFilename(asset.url);
    const filename = path.basename(sanitized) || "asset";
    const localPath = path.join(subdir, filename);
    const destPath = path.join(outputDir, localPath);

    // Ensure parent dir exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    try {
      await downloadFile(asset.url, destPath);
      manifest[asset.url] = localPath;
    } catch (err) {
      console.warn(`[asset-downloader] SKIP ${asset.url}: ${(err as Error).message}`);
    }
  }

  // Write manifest
  const manifestPath = path.join(outputDir, "asset-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  return manifest;
}
