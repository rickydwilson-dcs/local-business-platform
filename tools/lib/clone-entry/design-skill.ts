/**
 * Entry C: Design Skill
 *
 * Reads pre-generated HTML from brief.source.outputDir, runs the
 * HTML-to-JSX converter, and captures reference screenshots.
 *
 * This handles output from design skills like /industrial-brutalist-ui
 * or /minimalist-ui that generate static HTML pages.
 */

import * as fs from "fs";
import * as path from "path";
import { chromium } from "@playwright/test";

import type { JobBrief } from "../pipeline-brief-types";
import { convertHtmlToJsx } from "../html-to-jsx-converter";
import { validateCPF } from "../cpf-validator";

export async function designSkillEntry(brief: JobBrief, outputDir: string): Promise<void> {
  if (brief.source.type !== "design-skill") {
    throw new Error("designSkillEntry requires source.type === 'design-skill'");
  }

  const { outputDir: sourceDir } = brief.source;
  console.log(`[design-skill] Reading pre-generated HTML from: ${sourceDir}`);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Design skill output directory not found: ${sourceDir}`);
  }

  // Ensure output structure
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

  // Find HTML files in source directory
  const htmlFiles = fs
    .readdirSync(sourceDir)
    .filter((f) => f.endsWith(".html") || f.endsWith(".htm"));

  if (htmlFiles.length === 0) {
    throw new Error(`No HTML files found in: ${sourceDir}`);
  }

  console.log(`[design-skill] Found ${htmlFiles.length} HTML file(s)`);

  // Copy HTML and convert to JSX
  const pageUrls: Array<{ pageName: string; filePath: string }> = [];

  for (const file of htmlFiles) {
    const pageName = file.replace(/\.(html|htm)$/, "");
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(outputDir, "html", "pages", file);

    const html = fs.readFileSync(srcPath, "utf-8");
    fs.copyFileSync(srcPath, destPath);

    // Convert to JSX with empty manifest (no remote assets to rewrite)
    const jsx = convertHtmlToJsx(html, {}, pageName);
    const jsxFilename = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page.tsx`;
    fs.writeFileSync(path.join(outputDir, "jsx", "pages", jsxFilename), jsx, "utf-8");

    pageUrls.push({ pageName, filePath: srcPath });
    console.log(`[design-skill]   Converted ${file}`);
  }

  // Capture reference screenshots using file:// protocol
  console.log("[design-skill] Capturing reference screenshots...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const { pageName, filePath } of pageUrls) {
    try {
      const fileUrl = `file://${path.resolve(filePath)}`;
      await page.goto(fileUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });
      const screenshotPath = path.join(outputDir, "reference-screenshots", `${pageName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`[design-skill]   Screenshot: ${pageName}.png`);
    } catch (err) {
      console.warn(`[design-skill]   Screenshot failed for ${pageName}: ${(err as Error).message}`);
    }
  }

  await browser.close();

  // Write minimal computed-styles.json
  const stylesPath = path.join(outputDir, "styles", "computed-styles.json");
  fs.writeFileSync(stylesPath, JSON.stringify({ sectionStyles: {}, pages: [] }, null, 2), "utf-8");

  // Write meta.json
  const metaPath = path.join(outputDir, "meta.json");
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        jobId: brief.id,
        sourceType: "design-skill" as const,
        sourceRef: brief.source.skill,
        capturedAt: new Date().toISOString(),
        cpfVersion: "0.1" as const,
      },
      null,
      2
    ),
    "utf-8"
  );

  // Validate CPF
  const validation = validateCPF(outputDir);
  if (!validation.valid) {
    console.warn("[design-skill] CPF validation warnings:");
    for (const err of validation.errors) {
      console.warn(`  - ${err}`);
    }
  } else {
    console.log("[design-skill] CPF validation PASSED");
  }

  console.log(`[design-skill] Done: ${outputDir}`);
}
