/**
 * Clone CSS Preprocessor
 *
 * Sanitises raw clone CSS files into a deployable bundle:
 * - Strips broken url() references, rewrites valid ones to /clone-assets/ paths
 * - Handles @font-face (keep if remote, rewrite if local files exist, strip + fallback if not)
 * - Splits mega-lines, removes source maps, excludes plugin CSS
 * - Produces a manifest for debugging (included/excluded files, warnings)
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PreprocessorConfig {
  cloneDir: string; // e.g., "output/clones/corvus"
  themeName: string; // e.g., "corvus"
  customProperties?: string; // :root CSS variables block (full rule or just declarations)
  inlineCss?: string; // CSS extracted from clone JSX comment blocks
  excludePatterns?: string[]; // Additional file patterns to exclude
  sourceDomain?: string; // e.g. "https://colorcode.events" — clone origin domain
}

export interface PreprocessorResult {
  css: string; // The sanitised, combined CSS content
  manifest: {
    includedFiles: string[];
    excludedFiles: string[];
    rewrittenUrls: number;
    strippedFontFaces: string[];
    copiedFontFiles: string[];
    warnings: string[];
  };
  fontFiles: string[]; // Absolute paths to font files found in clone
  imageFiles: string[]; // Absolute paths to image files found in clone
}

// ── Pattern matching ──────────────────────────────────────────────────────────

/**
 * Simple glob-like pattern matching for bare filenames.
 * Supports * as a wildcard (no ** or directory traversal).
 */
function matchesGlob(filename: string, pattern: string): boolean {
  if (!pattern.includes("*")) return filename === pattern;
  // Escape regex metacharacters except *, then convert * to .*
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(filename);
}

/** Default patterns that should be included in the bundle */
const DEFAULT_INCLUDE_PATTERNS: string[] = [
  "*-defaults.css",
  "post-*.css",
  "global-settings.css",
  "presets.css",
  "common-*.css",
  "normalize*.css",
  "custom_font_*.css",
];

/** Default patterns that should be excluded from the bundle */
const DEFAULT_EXCLUDE_PATTERNS: string[] = [
  "rsvp.css",
  "rsvp-v1.css",
  "square.css",
  "free.css",
  "woocommerce*.css",
  "style.min.css",
];

function shouldInclude(filename: string): boolean {
  return DEFAULT_INCLUDE_PATTERNS.some((p) => matchesGlob(filename, p));
}

function shouldExclude(filename: string, extraPatterns: string[]): boolean {
  const all = [...DEFAULT_EXCLUDE_PATTERNS, ...extraPatterns];
  return all.some((p) => matchesGlob(filename, p));
}

// ── URL handling ──────────────────────────────────────────────────────────────

function escapeRegexStr(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRemoteOrDataUrl(url: string): boolean {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("//")
  );
}

/**
 * Normalise a relative CSS URL to an asset subpath.
 * Strips leading `/`, `./`, or `../assets/` prefixes.
 *
 * Examples:
 *   "icons/eye.svg"       → "icons/eye.svg"
 *   "../assets/images/x"  → "images/x"
 *   "./images/logo.png"   → "images/logo.png"
 */
function normaliseAssetPath(url: string): string {
  let p = url.trim();
  p = p.replace(/^\.\.\/assets\//, ""); // strip ../assets/ prefix
  p = p.replace(/^\.?\//, ""); // strip leading ./ or /
  return p;
}

function cloneAssetExists(assetsDir: string, relativePath: string): boolean {
  return fs.existsSync(path.join(assetsDir, relativePath));
}

// ── @font-face block extractor ────────────────────────────────────────────────

interface FontFaceBlock {
  raw: string;
  fontFamily: string;
  srcUrls: string[];
  allRemote: boolean; // every src URL is http/https/data
  hasLocalUrls: boolean; // at least one non-remote src URL
}

function extractFontFaceBlocks(css: string): FontFaceBlock[] {
  const blocks: FontFaceBlock[] = [];
  let i = 0;

  while (i < css.length) {
    const atIdx = css.indexOf("@font-face", i);
    if (atIdx === -1) break;

    const braceStart = css.indexOf("{", atIdx);
    if (braceStart === -1) break;

    // Walk to matching closing brace
    let depth = 1;
    let j = braceStart + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }

    const raw = css.slice(atIdx, j);
    const inner = css.slice(braceStart + 1, j - 1);

    // Parse font-family
    const familyMatch = inner.match(/font-family\s*:\s*['"]?([^'";\n}]+)['"]?\s*[;}/]/i);
    const fontFamily = familyMatch ? familyMatch[1].trim() : "unknown";

    // Extract src URLs — look inside the src: ... ; declaration
    const srcDeclaration = inner.match(/src\s*:[^;]+;/);
    const srcContent = srcDeclaration ? srcDeclaration[0] : inner;
    const srcUrls: string[] = [];
    const urlRe = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
    let m: RegExpExecArray | null;
    while ((m = urlRe.exec(srcContent)) !== null) {
      srcUrls.push(m[2].trim());
    }

    const allRemote = srcUrls.length > 0 && srcUrls.every((u) => isRemoteOrDataUrl(u));
    const hasLocalUrls = srcUrls.some((u) => !isRemoteOrDataUrl(u));

    blocks.push({ raw, fontFamily, srcUrls, allRemote, hasLocalUrls });
    i = j;
  }

  return blocks;
}

// ── Mega-line splitter ────────────────────────────────────────────────────────

function splitMegaLines(css: string, maxLen = 10000): string {
  return css
    .split("\n")
    .map((line) => {
      if (line.length <= maxLen) return line;
      // Insert a newline after every } to break up minified CSS
      return line.replace(/\}/g, "}\n");
    })
    .join("\n");
}

// ── Per-file sanitiser ────────────────────────────────────────────────────────

interface SanitiseResult {
  content: string;
  rewrittenUrls: number;
  strippedFontFaces: string[];
  warnings: string[];
}

function sanitiseFile(
  raw: string,
  filename: string,
  assetsDir: string,
  themeName: string,
  sourceDomain?: string
): SanitiseResult {
  let content = raw;
  let rewrittenUrls = 0;
  const strippedFontFaces: string[] = [];
  const warnings: string[] = [];

  // 1. Strip source map comments
  content = content.replace(/\/\*#\s*sourceURL=[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "");
  content = content.replace(/\/\*#\s*sourceMappingURL=[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "");

  // 2. Handle @font-face blocks before general URL rewriting
  const fontFaceBlocks = extractFontFaceBlocks(content);
  for (const block of fontFaceBlocks) {
    if (block.allRemote) {
      // All remote — keep as-is; the browser will load them directly
      continue;
    }

    if (block.hasLocalUrls) {
      // Has relative (local) src URLs — check if files exist in clone assets
      const localUrls = block.srcUrls.filter((u) => !isRemoteOrDataUrl(u));
      const anyExist = localUrls.some((u) => cloneAssetExists(assetsDir, normaliseAssetPath(u)));

      if (!anyExist) {
        // No local font files exist — strip the entire @font-face block
        content = content.replace(block.raw, "");
        if (!strippedFontFaces.includes(block.fontFamily)) {
          strippedFontFaces.push(block.fontFamily);
        }
      }
      // If some local files exist, leave block for URL rewrite step below
    }
    // No src at all — leave (malformed, harmless)
  }

  // 3. Rewrite url() references for relative paths
  const urlRe = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
  content = content.replace(urlRe, (_full, _quote, innerUrl) => {
    const url = innerUrl.trim();

    if (isRemoteOrDataUrl(url)) return _full; // keep remote/data as-is

    const normalised = normaliseAssetPath(url);
    const exists = cloneAssetExists(assetsDir, normalised);

    if (exists) {
      rewrittenUrls++;
      return `url(/clone-assets/${themeName}/${normalised})`;
    } else {
      warnings.push(`[${filename}] Broken URL removed: ${url}`);
      return `url(data:,)`;
    }
  });

  // 3b. Strip clone-domain remote URLs (e.g. fonts loaded from WP uploads)
  if (sourceDomain) {
    const domainRe = new RegExp(
      `url\\(\\s*['"]?(${escapeRegexStr(sourceDomain)}[^)'"]*)['"]?\\s*\\)`,
      "gi"
    );
    content = content.replace(domainRe, (_full, urlValue) => {
      rewrittenUrls++;
      warnings.push(`[${filename}] Stripped clone-domain URL: ${urlValue}`);
      return "url(data:,)";
    });
  }

  // 4. Split mega-lines (minified CSS with very long single lines)
  content = splitMegaLines(content);

  return { content, rewrittenUrls, strippedFontFaces, warnings };
}

// ── Asset discovery ───────────────────────────────────────────────────────────

function discoverFiles(dir: string, extensions: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => extensions.includes(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f));
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function preprocessCloneCss(config: PreprocessorConfig): Promise<PreprocessorResult> {
  const {
    cloneDir,
    themeName,
    customProperties,
    inlineCss,
    excludePatterns = [],
    sourceDomain,
  } = config;

  const cssDir = path.join(cloneDir, "assets", "css");
  const assetsDir = path.join(cloneDir, "assets");

  const manifest: PreprocessorResult["manifest"] = {
    includedFiles: [],
    excludedFiles: [],
    rewrittenUrls: 0,
    strippedFontFaces: [],
    copiedFontFiles: [],
    warnings: [],
  };

  // ── Step 1: Discover .css files ───────────────────────────────────────────

  if (!fs.existsSync(cssDir)) {
    manifest.warnings.push(`CSS directory not found: ${cssDir}`);
    return { css: "", manifest, fontFiles: [], imageFiles: [] };
  }

  const allCssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"));

  // ── Step 2: Classify files ────────────────────────────────────────────────

  const includedFiles: string[] = [];

  for (const filename of allCssFiles) {
    const filePath = path.join(cssDir, filename);
    const stat = fs.statSync(filePath);

    if (stat.size > 500 * 1024) {
      manifest.excludedFiles.push(`${filename} (too large: ${Math.round(stat.size / 1024)}KB)`);
      continue;
    }

    if (shouldExclude(filename, excludePatterns)) {
      manifest.excludedFiles.push(`${filename} (excluded by pattern)`);
      continue;
    }

    if (shouldInclude(filename)) {
      includedFiles.push(filename);
      manifest.includedFiles.push(filename);
    } else {
      manifest.excludedFiles.push(`${filename} (not in include list)`);
    }
  }

  // ── Step 3: Sanitise each included file ───────────────────────────────────

  const sanitisedSections: string[] = [];
  let totalRewrittenUrls = 0;

  for (const filename of includedFiles) {
    const filePath = path.join(cssDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");

    const result = sanitiseFile(raw, filename, assetsDir, themeName, sourceDomain);

    totalRewrittenUrls += result.rewrittenUrls;
    for (const fam of result.strippedFontFaces) {
      if (!manifest.strippedFontFaces.includes(fam)) {
        manifest.strippedFontFaces.push(fam);
      }
    }
    manifest.warnings.push(...result.warnings);

    sanitisedSections.push(`/* === ${filename} === */\n${result.content.trim()}`);
  }

  manifest.rewrittenUrls = totalRewrittenUrls;

  // ── Step 4: Assemble bundle ───────────────────────────────────────────────

  const parts: string[] = [];

  // :root custom properties from computed styles
  if (customProperties && customProperties.trim()) {
    parts.push(customProperties.trim());
  }

  // Container utility
  parts.push(
    `.container {\n  max-width: 1280px;\n  margin-inline: auto;\n  padding-inline: 1.5rem;\n}`
  );

  // Sanitised CSS sections (one per included file)
  parts.push(...sanitisedSections);

  // Inline CSS extracted from clone JSX comment headers
  if (inlineCss && inlineCss.trim()) {
    parts.push(`/* === inline CSS from clone JSX === */\n${inlineCss.trim()}`);
  }

  // Font fallback if any @font-face blocks were stripped
  if (manifest.strippedFontFaces.length > 0) {
    parts.push(
      `/* Font fallback — original fonts not available */\nbody, .breakdance, .breakdance * {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}`
    );
  }

  const css = parts.join("\n\n");

  // ── Step 5: Discover assets ───────────────────────────────────────────────

  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".avif", ".ico"];
  const fontExtensions = [".woff", ".woff2", ".ttf", ".otf", ".eot"];

  const imageFiles = discoverFiles(path.join(cloneDir, "assets", "images"), imageExtensions);
  const fontFiles = discoverFiles(path.join(cloneDir, "assets", "fonts"), fontExtensions);

  return { css, manifest, fontFiles, imageFiles };
}
