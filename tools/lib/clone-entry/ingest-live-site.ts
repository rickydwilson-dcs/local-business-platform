/**
 * Entry A: Ingest Live Site
 *
 * Orchestrates the full clone of a live website into CPF format:
 * 1. Discover pages
 * 2. Fetch HTML
 * 3. Capture screenshots + computed styles
 * 4. Extract per-section styles
 * 5. Download assets
 * 6. Convert HTML to JSX
 * 7. Write meta.json
 * 8. Validate CPF
 */

import * as fs from "fs";
import * as path from "path";
import { chromium } from "@playwright/test";

import type { JobBrief } from "../pipeline-brief-types";
import { discoverPages } from "../site-discovery";
import { captureScreenshots } from "../screenshot-capture";
import { extractAllSectionStyles } from "../computed-style-extractor";
import { extractAssetUrls, downloadAssets } from "../asset-downloader";
import { convertHtmlToJsx } from "../html-to-jsx-converter";
import { validateCPF } from "../cpf-validator";
import { hasCompletedStep, markStepDone } from "../step-tracker";

const FETCH_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = "Mozilla/5.0 (compatible; ClonePipeline/1.0; +https://example.com)";

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ingestLiveSite(brief: JobBrief, outputDir: string): Promise<void> {
  if (brief.source.type !== "url") {
    throw new Error("ingestLiveSite requires source.type === 'url'");
  }

  const siteUrl = brief.source.value;
  console.log(`[ingest] Starting ingest of ${siteUrl} → ${outputDir}`);

  // Ensure output directory structure
  const dirs = [
    "assets/images",
    "assets/fonts",
    "assets/css",
    "html/pages",
    "jsx/pages",
    "styles",
    "reference-screenshots",
    "reports",
  ];
  for (const d of dirs) {
    fs.mkdirSync(path.join(outputDir, d), { recursive: true });
  }

  // ── Step 1: Discover pages ─────────────────────────────────────────────────
  let pages: Awaited<ReturnType<typeof discoverPages>>;
  const discoveryDoneFile = path.join(outputDir, ".done-discovery.json");
  const discoveredPagesFile = path.join(outputDir, ".discovered-pages.json");

  if (!hasCompletedStep(outputDir, "discovery")) {
    console.log("[ingest] Step 1: Discovering pages...");
    pages = await discoverPages(siteUrl);
    fs.writeFileSync(discoveredPagesFile, JSON.stringify(pages, null, 2), "utf-8");
    markStepDone(outputDir, "discovery", siteUrl);
    console.log(`[ingest] Found ${pages.length} pages`);
  } else {
    pages = JSON.parse(fs.readFileSync(discoveredPagesFile, "utf-8")) as typeof pages;
    console.log(`[ingest] Step 1: SKIP (${pages.length} pages already discovered)`);
  }

  // ── Step 2: Fetch HTML ─────────────────────────────────────────────────────
  const htmlMap: Record<string, string> = {};

  if (!hasCompletedStep(outputDir, "fetch-html")) {
    console.log("[ingest] Step 2: Fetching HTML...");
    for (const page of pages) {
      try {
        const html = await fetchPage(page.url);
        const filename = `${page.pageType}.html`;
        const filePath = path.join(outputDir, "html", "pages", filename);
        fs.writeFileSync(filePath, html, "utf-8");
        htmlMap[page.pageType] = html;
        console.log(`[ingest]   Fetched ${page.pageType} (${page.url})`);
        await sleep(FETCH_DELAY_MS);
      } catch (err) {
        console.warn(`[ingest]   SKIP ${page.url}: ${(err as Error).message}`);
      }
    }
    markStepDone(outputDir, "fetch-html", siteUrl);
  } else {
    console.log("[ingest] Step 2: SKIP (HTML already fetched)");
    const htmlDir = path.join(outputDir, "html", "pages");
    for (const f of fs.readdirSync(htmlDir).filter((f) => f.endsWith(".html"))) {
      const pageType = f.replace(".html", "");
      htmlMap[pageType] = fs.readFileSync(path.join(htmlDir, f), "utf-8");
    }
  }

  // ── Step 3 + 4: Capture screenshots + extract section styles ──────────────
  const sectionStylesMap: Record<string, unknown> = {};

  if (!hasCompletedStep(outputDir, "screenshots")) {
    console.log("[ingest] Steps 3+4: Capturing screenshots and section styles...");
    const screenshotsDir = path.join(outputDir, "reference-screenshots");

    // captureScreenshots handles Playwright internally and saves to outputDir/screenshots/
    // We also need section styles, so we launch our own browser pass
    await captureScreenshots(pages, outputDir);

    // Move screenshots from outputDir/screenshots/ to reference-screenshots/
    const generatedDir = path.join(outputDir, "screenshots");
    if (fs.existsSync(generatedDir)) {
      for (const f of fs.readdirSync(generatedDir)) {
        fs.renameSync(path.join(generatedDir, f), path.join(screenshotsDir, f));
      }
      fs.rmdirSync(generatedDir);
    }

    // Second pass: extract section styles with Playwright
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const discoveredPage of pages) {
      try {
        await page.goto(discoveredPage.url, { waitUntil: "networkidle", timeout: 20_000 });
        const sections = await extractAllSectionStyles(page);
        sectionStylesMap[discoveredPage.pageType] = sections;
      } catch (err) {
        console.warn(
          `[ingest]   Section style extraction failed for ${discoveredPage.url}: ${(err as Error).message}`
        );
      }
    }
    await browser.close();

    // Save section styles alongside computed-styles.json
    const stylesPath = path.join(outputDir, "styles", "computed-styles.json");
    // Read existing computed-styles if present (from captureScreenshots)
    let existing: Record<string, unknown> = {};
    const existingStylesPath = path.join(outputDir, "computed-styles.json");
    if (fs.existsSync(existingStylesPath)) {
      existing = JSON.parse(fs.readFileSync(existingStylesPath, "utf-8")) as Record<
        string,
        unknown
      >;
    }
    fs.writeFileSync(
      stylesPath,
      JSON.stringify({ ...existing, sectionStyles: sectionStylesMap }, null, 2),
      "utf-8"
    );

    markStepDone(outputDir, "screenshots", siteUrl);
  } else {
    console.log("[ingest] Steps 3+4: SKIP (screenshots already captured)");
  }

  // ── Step 5: Download assets ────────────────────────────────────────────────
  let assetManifest: Record<string, string> = {};

  if (!hasCompletedStep(outputDir, "assets")) {
    console.log("[ingest] Step 5: Downloading assets...");
    const allAssetUrls: ReturnType<typeof extractAssetUrls> = [];
    const seen = new Set<string>();

    for (const [, html] of Object.entries(htmlMap)) {
      const urls = extractAssetUrls(html, siteUrl);
      for (const asset of urls) {
        if (!seen.has(asset.url)) {
          seen.add(asset.url);
          allAssetUrls.push(asset);
        }
      }
    }

    assetManifest = await downloadAssets(allAssetUrls, path.join(outputDir, "assets"));
    markStepDone(outputDir, "assets", siteUrl);
    console.log(`[ingest]   Downloaded ${Object.keys(assetManifest).length} assets`);
  } else {
    console.log("[ingest] Step 5: SKIP (assets already downloaded)");
    const manifestPath = path.join(outputDir, "assets", "asset-manifest.json");
    if (fs.existsSync(manifestPath)) {
      assetManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, string>;
    }
  }

  // ── Step 6: Convert HTML to JSX ────────────────────────────────────────────
  if (!hasCompletedStep(outputDir, "jsx-convert")) {
    console.log("[ingest] Step 6: Converting HTML to JSX...");
    for (const [pageType, html] of Object.entries(htmlMap)) {
      const jsx = convertHtmlToJsx(html, assetManifest, pageType);
      const filename = `${pageType.charAt(0).toUpperCase() + pageType.slice(1)}Page.tsx`;
      fs.writeFileSync(path.join(outputDir, "jsx", "pages", filename), jsx, "utf-8");
      console.log(`[ingest]   Converted ${pageType} → ${filename}`);
    }
    markStepDone(outputDir, "jsx-convert", siteUrl);
  } else {
    console.log("[ingest] Step 6: SKIP (JSX already converted)");
  }

  // ── Step 7: Write meta.json ────────────────────────────────────────────────
  const metaPath = path.join(outputDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    const meta = {
      jobId: brief.id,
      sourceType: "url" as const,
      sourceRef: siteUrl,
      capturedAt: new Date().toISOString(),
      cpfVersion: "0.1" as const,
    };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
    console.log("[ingest] Step 7: Wrote meta.json");
  }

  // ── Step 8: Validate CPF ───────────────────────────────────────────────────
  console.log("[ingest] Step 8: Validating CPF...");
  const validation = validateCPF(outputDir);
  if (!validation.valid) {
    console.warn("[ingest] CPF validation warnings:");
    for (const err of validation.errors) {
      console.warn(`  - ${err}`);
    }
  } else {
    console.log("[ingest] CPF validation PASSED");
  }

  console.log(`[ingest] Done: ${outputDir}`);
}
