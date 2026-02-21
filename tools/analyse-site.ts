#!/usr/bin/env npx tsx
/**
 * Analyse Site — Ingestion Pipeline v2
 *
 * Multi-page crawling, screenshot capture, layout analysis,
 * component matching, and theme package generation.
 *
 * Usage:
 *   npx tsx tools/analyse-site.ts --url https://example.com/
 *
 * Flags:
 *   --url <website>      (required) Website to analyse
 *   --name <slug>        (optional) Theme name, auto-assigned from constellation namespace if omitted
 *   --output <dir>       (optional) Output directory, default: ./output/<theme-name>/
 *   --max-pages <n>      (optional) Max pages to discover, default: 10
 *   --dry-run            (optional) Analysis only, no file generation
 *   --skip-examples      (optional) Skip example page generation
 *   --html-only          (optional) Allow running without API key (degraded mode)
 */

import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });
import * as fs from "fs";
import * as path from "path";
import type {
  SiteAnalysis,
  SectionBlueprint,
  ComponentMatch,
  DiscoveredPage,
} from "./lib/reference-analysis-types";
import {
  SiteSynthesisResponseSchema,
  type SiteSynthesisResponse,
} from "./lib/analysis-schemas";
import { discoverPages } from "./lib/site-discovery";
import { captureScreenshots } from "./lib/screenshot-capture";
import { pickNextThemeName } from "./lib/theme-name-picker";
import { analyzeHtmlStructure } from "./lib/html-structure-analyzer";
import { analyzeMultiplePages } from "./lib/multi-page-analyzer";
import { matchComponents } from "./lib/component-matcher";
import { generateThemeComponents } from "./lib/theme-component-generator";
import { generateExamplePages } from "./lib/page-template-generator";
import { scaffoldThemePackage } from "./scaffold-theme-package";
import { extractStylesFromUrl } from "../packages/intake-system/src/theme-extraction/website-analyzer";

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CliArgs {
  url: string;
  name?: string;
  output?: string;
  maxPages: number;
  dryRun: boolean;
  skipExamples: boolean;
  htmlOnly: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: Partial<CliArgs> = { maxPages: 10, dryRun: false, skipExamples: false, htmlOnly: false };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case "--url":
        args.url = next;
        i++;
        break;
      case "--name":
        args.name = next;
        i++;
        break;
      case "--output":
        args.output = next;
        i++;
        break;
      case "--max-pages":
        args.maxPages = parseInt(next, 10);
        i++;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--skip-examples":
        args.skipExamples = true;
        break;
      case "--html-only":
        args.htmlOnly = true;
        break;
    }
  }

  if (!args.url) {
    console.error("Error: --url is required");
    console.error("Usage: npx tsx tools/analyse-site.ts --url https://example.com/");
    process.exit(1);
  }

  return args as CliArgs;
}

// ============================================================================
// Timing Helper
// ============================================================================

function elapsed(start: number): string {
  return `${((Date.now() - start) / 1000).toFixed(1)}s`;
}

// ============================================================================
// Markdown Report Generator
// ============================================================================

function generateMarkdownReport(
  analysis: SiteAnalysis,
  componentMatchMap: Map<string, ComponentMatch | null>,
): string {
  const lines: string[] = [];

  lines.push(`# Site Analysis Report`);
  lines.push("");
  lines.push(`**URL:** ${analysis.reference.url}`);
  lines.push(`**Date:** ${analysis.reference.capturedAt}`);
  lines.push(`**Pages analysed:** ${analysis.reference.pagesAnalysed}`);
  lines.push(`**Analysis version:** ${analysis.analysisVersion}`);
  lines.push("");

  // Discovered pages table
  lines.push(`## Discovered Pages`);
  lines.push("");
  lines.push("| URL | Type | Source | Depth |");
  lines.push("|-----|------|--------|-------|");
  for (const page of analysis.discoveredPages) {
    lines.push(`| ${page.path} | ${page.pageType} | ${page.source} | ${page.depth} |`);
  }
  lines.push("");

  // Page blueprints
  lines.push(`## Page Blueprints`);
  lines.push("");
  for (const bp of analysis.pageBlueprints) {
    lines.push(`### ${bp.title} (${bp.pageType})`);
    lines.push(`- Path: \`${bp.path}\``);
    lines.push(`- Analysis source: ${bp.analysisSource}`);
    lines.push(`- Confidence: ${bp.confidence}`);
    lines.push(`- Sections: ${bp.sections.length}`);
    lines.push("");
    for (const section of bp.sections) {
      const match = componentMatchMap.get(section.blueprintId);
      const matchInfo = match
        ? ` → **${match.componentName}** (${match.matchConfidence})`
        : " → *new component*";
      lines.push(`  ${section.order}. \`${section.blueprintId}\`${section.isShared ? " [shared]" : ""}${matchInfo}`);
    }
    lines.push("");
  }

  // Component matches
  lines.push(`## Component Match Decisions`);
  lines.push("");
  lines.push("| Section Blueprint | Decision | Core Component |");
  lines.push("|-------------------|----------|----------------|");

  let reusedCount = 0;
  let generatedCount = 0;

  for (const bp of analysis.sectionBlueprints) {
    const match = componentMatchMap.get(bp.id);
    if (match) {
      reusedCount++;
      lines.push(`| ${bp.id} | Reuse (${match.matchConfidence}) | ${match.componentName} |`);
    } else {
      generatedCount++;
      lines.push(`| ${bp.id} | Generate | — |`);
    }
  }
  lines.push("");
  lines.push(`**Reused:** ${reusedCount} | **Generated:** ${generatedCount}`);
  lines.push("");

  // Theme tokens
  lines.push(`## Theme Token Recommendations`);
  lines.push("");
  const tokens = analysis.themeTokenRecommendations;
  lines.push(`- Primary: \`${tokens.brand.primary}\``);
  lines.push(`- Secondary: \`${tokens.brand.secondary}\``);
  lines.push(`- Accent: \`${tokens.brand.accent}\``);
  lines.push(`- Background: \`${tokens.surface.background}\``);
  lines.push(`- Foreground: \`${tokens.surface.foreground}\``);
  lines.push("");

  // Registry recommendation
  const reg = analysis.registryRecommendation;
  lines.push(`## Registry Recommendation`);
  lines.push("");
  lines.push(`- Theme: **${reg.themeName}**`);
  lines.push(`- Confidence: ${reg.confidence}`);
  lines.push(`- Reasoning: ${reg.reasoning}`);
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// Main Pipeline
// ============================================================================

async function main() {
  const args = parseArgs(process.argv);
  const pipelineStart = Date.now();

  // Preflight: API key check
  if (!process.env.ANTHROPIC_API_KEY) {
    if (args.htmlOnly) {
      console.warn("⚠ ANTHROPIC_API_KEY not set — running in HTML-only mode (--html-only)");
    } else {
      console.error("❌ ANTHROPIC_API_KEY not set. Set it in .env.local or pass --html-only for degraded mode.");
      process.exit(1);
    }
  }

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║       Ingestion Pipeline v2 — analyse-site      ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // ── Step 1: Parse args, determine theme name ──
  let stepStart = Date.now();
  console.log("[1/14] Determining theme name...");
  const themeName = args.name ?? pickNextThemeName();
  const outputDir = args.output
    ? path.resolve(args.output)
    : path.resolve(`./output/${themeName}/`);
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`  Theme: ${themeName}`);
  console.log(`  Output: ${outputDir}`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 2: Discover pages ──
  stepStart = Date.now();
  console.log("[2/14] Discovering pages...");
  const discoveredPages = await discoverPages(args.url, { maxPages: args.maxPages });
  console.log(`  Found ${discoveredPages.length} pages`);
  for (const page of discoveredPages) {
    console.log(`    ${page.pageType}: ${page.path} (${page.source})`);
  }
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 3: Fetch HTML for all pages ──
  stepStart = Date.now();
  console.log("[3/14] Fetching HTML...");
  const htmlMap = new Map<string, string>();
  for (const page of discoveredPages) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(page.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ThemeExtractor/1.0; +https://example.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      clearTimeout(timeout);
      if (response.ok) {
        htmlMap.set(page.url, await response.text());
        console.log(`  ✓ ${page.path}`);
      }
    } catch {
      console.warn(`  ✗ ${page.path} (fetch failed)`);
    }
    // 500ms delay between fetches
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`  Fetched HTML for ${htmlMap.size}/${discoveredPages.length} pages`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 4: Capture screenshots ──
  stepStart = Date.now();
  console.log("[4/14] Capturing screenshots via Playwright...");
  const screenshotMap = await captureScreenshots(discoveredPages, outputDir);
  console.log(`  Captured ${screenshotMap.size} screenshots`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 5: HTML structural analysis ──
  stepStart = Date.now();
  console.log("[5/14] Running HTML structural analysis...");
  const pageStructures = [];
  for (const page of discoveredPages) {
    const html = htmlMap.get(page.url);
    if (html) {
      const structure = analyzeHtmlStructure(html, page);
      pageStructures.push(structure);
      console.log(`  ${page.pageType}: ${structure.sections.length} sections`);
    }
  }
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 6: Colour extraction from homepage CSS ──
  stepStart = Date.now();
  console.log("[6/14] Extracting colours from CSS...");
  let scrapedStyles;
  try {
    scrapedStyles = await extractStylesFromUrl(args.url);
    console.log(`  Primary: ${scrapedStyles.colors.primary ?? "not found"}`);
    console.log(`  Style: ${scrapedStyles.style}`);
  } catch (err) {
    console.warn(`  [Warning] CSS extraction failed: ${err}`);
    scrapedStyles = null;
  }
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 7-8: Per-page vision analysis + site synthesis ──
  stepStart = Date.now();
  console.log("[7-8/14] Per-page vision analysis + site synthesis...");
  const { perPage, synthesis } = await analyzeMultiplePages(
    discoveredPages,
    htmlMap,
    screenshotMap,
    outputDir,
  );
  console.log(`  Analysed ${perPage.length} pages`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 9: Component matching ──
  stepStart = Date.now();
  console.log("[9/14] Matching sections to core components...");
  const allBlueprints: SectionBlueprint[] = perPage.flatMap((p) => p.sections);
  const componentMatchMap = matchComponents(allBlueprints);
  let matchedCount = 0;
  for (const [id, match] of componentMatchMap) {
    if (match) {
      matchedCount++;
      console.log(`  ✓ ${id} → ${match.componentName} (${match.matchConfidence})`);
    }
  }
  console.log(`  ${matchedCount} matched, ${allBlueprints.length - matchedCount} to generate`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 10: Token reconciliation ──
  stepStart = Date.now();
  console.log("[10/14] Reconciling tokens...");

  // Validate synthesis with Zod
  const synthValidation = SiteSynthesisResponseSchema.safeParse(synthesis);
  const validatedSynthesis: SiteSynthesisResponse | null = synthValidation.success
    ? synthValidation.data
    : null;

  // Find homepage vision palette (fallback source #2)
  const homepageVision = perPage.find(
    (p) => p.page.pageType === "home" && p.visualLanguage,
  );
  const visionPalette = homepageVision?.visualLanguage?.palette;
  const hasVisionPalette = visionPalette &&
    (visionPalette.confidence === "high" || visionPalette.confidence === "medium");

  // Check if CSS-scraped values are non-default
  const hasCssValues = scrapedStyles &&
    scrapedStyles.colors.primary &&
    scrapedStyles.colors.primary !== "#000000";

  // Determine token source using fallback chain:
  // 1. Synthesis tokens (Zod validated) → 2. Homepage vision palette → 3. CSS-scraped → 4. Defaults
  let tokenSource: "synthesis" | "vision" | "css" | "defaults";
  let themeTokens: SiteAnalysis["themeTokenRecommendations"];

  if (validatedSynthesis) {
    tokenSource = "synthesis";
    themeTokens = validatedSynthesis.themeTokenRecommendations;
  } else if (hasVisionPalette && visionPalette) {
    tokenSource = "vision";
    themeTokens = {
      brand: {
        primary: visionPalette.primary,
        primaryHover: visionPalette.primary,
        secondary: visionPalette.secondary,
        accent: visionPalette.accent,
      },
      surface: {
        background: visionPalette.background,
        foreground: visionPalette.foreground,
        muted: "#F3F4F6",
      },
      typography: {
        fontFamilySans: [scrapedStyles?.fonts.body ?? "Inter", "system-ui", "sans-serif"],
        fontFamilyHeading: [scrapedStyles?.fonts.heading ?? "Inter", "system-ui", "sans-serif"],
      },
    };
  } else if (hasCssValues && scrapedStyles) {
    tokenSource = "css";
    themeTokens = {
      brand: {
        primary: scrapedStyles.colors.primary ?? "#3B82F6",
        primaryHover: scrapedStyles.colors.primary ?? "#2563EB",
        secondary: scrapedStyles.colors.secondary ?? "#6B7280",
        accent: scrapedStyles.colors.primary ?? "#F59E0B",
      },
      surface: {
        background: scrapedStyles.colors.background ?? "#FFFFFF",
        foreground: scrapedStyles.colors.text ?? "#111827",
        muted: "#F3F4F6",
      },
      typography: {
        fontFamilySans: [scrapedStyles.fonts.body ?? "Inter", "system-ui", "sans-serif"],
        fontFamilyHeading: [scrapedStyles.fonts.heading ?? "Inter", "system-ui", "sans-serif"],
      },
    };
  } else {
    tokenSource = "defaults";
    themeTokens = {
      brand: {
        primary: "#3B82F6",
        primaryHover: "#2563EB",
        secondary: "#6B7280",
        accent: "#F59E0B",
      },
      surface: {
        background: "#FFFFFF",
        foreground: "#111827",
        muted: "#F3F4F6",
      },
      typography: {
        fontFamilySans: ["Inter", "system-ui", "sans-serif"],
        fontFamilyHeading: ["Inter", "system-ui", "sans-serif"],
      },
    };
  }

  const visualLanguage: SiteAnalysis["visualLanguage"] = validatedSynthesis?.visualLanguage
    ?? (homepageVision?.visualLanguage as SiteAnalysis["visualLanguage"] | undefined)
    ?? {
      palette: {
        background: themeTokens.surface.background,
        foreground: themeTokens.surface.foreground,
        primary: themeTokens.brand.primary,
        secondary: themeTokens.brand.secondary,
        accent: themeTokens.brand.accent,
        additional: [],
        confidence: "low" as const,
      },
      typography: {
        headingWeight: "bold" as const,
        bodyWeight: "normal" as const,
        headingStyle: "sans" as const,
        usesInlineColourHighlights: false,
      },
      heroPattern: {
        type: "centered" as const,
        hasBackgroundImage: false,
        headerDark: false,
      },
      spacingDensity: "standard" as const,
    };

  const registryRecommendation: SiteAnalysis["registryRecommendation"] =
    validatedSynthesis?.registryRecommendation ?? {
      themeName: "vega",
      confidence: "low" as const,
      reasoning: "Default fallback — insufficient data for confident match",
    };

  console.log(`  TOKEN_SOURCE: ${tokenSource}`);
  console.log(`  Primary: ${themeTokens.brand.primary}`);
  console.log(`  Registry: ${registryRecommendation.themeName} (${registryRecommendation.confidence})`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 11: Build SiteAnalysis and write JSON/MD ──
  stepStart = Date.now();
  console.log("[11/14] Writing analysis files...");

  // Deduplicate section blueprints
  const seenIds = new Set<string>();
  const deduplicatedBlueprints: SectionBlueprint[] = [];

  // Use synthesis deduplicated blueprints if available
  const synthBlueprints = validatedSynthesis?.deduplicatedBlueprints as SectionBlueprint[] | undefined;
  if (synthBlueprints && Array.isArray(synthBlueprints)) {
    for (const bp of synthBlueprints) {
      if (!seenIds.has(bp.id)) {
        seenIds.add(bp.id);
        deduplicatedBlueprints.push(bp);
      }
    }
  }
  // Add any remaining from per-page that weren't in synthesis
  for (const bp of allBlueprints) {
    if (!seenIds.has(bp.id)) {
      seenIds.add(bp.id);
      deduplicatedBlueprints.push(bp);
    }
  }

  const componentMatches: ComponentMatch[] = [];
  for (const [, match] of componentMatchMap) {
    if (match) componentMatches.push(match);
  }

  const siteAnalysis: SiteAnalysis = {
    analysisVersion: "3",
    reference: {
      url: args.url,
      capturedAt: new Date().toISOString(),
      pagesAnalysed: discoveredPages.length,
    },
    discoveredPages,
    pageBlueprints: perPage.map((p) => p.blueprint),
    visualLanguage,
    sectionBlueprints: deduplicatedBlueprints,
    componentMatches,
    themeTokenRecommendations: themeTokens,
    registryRecommendation,
  };

  // Write JSON
  const jsonPath = path.join(outputDir, "site-analysis.json");
  fs.writeFileSync(jsonPath, JSON.stringify(siteAnalysis, null, 2), "utf8");
  console.log(`  ✓ ${jsonPath}`);

  // Write markdown report
  const mdReport = generateMarkdownReport(siteAnalysis, componentMatchMap);
  const mdPath = path.join(outputDir, "site-analysis.md");
  fs.writeFileSync(mdPath, mdReport, "utf8");
  console.log(`  ✓ ${mdPath}`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  if (args.dryRun) {
    console.log("═══ DRY RUN — skipping generation steps ═══\n");
    console.log(`Total time: ${elapsed(pipelineStart)}`);
    return;
  }

  // ── Step 12: Component generation ──
  stepStart = Date.now();
  console.log("[12/14] Generating theme components...");
  const componentsDir = path.join(outputDir, "components");
  const genResult = await generateThemeComponents(
    deduplicatedBlueprints,
    componentsDir,
    componentMatchMap,
  );
  if (genResult.warnings.length > 0) {
    console.log("  Warnings:");
    for (const w of genResult.warnings) {
      console.log(`    ${w}`);
    }
  }
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Step 13: Example page generation ──
  if (!args.skipExamples) {
    stepStart = Date.now();
    console.log("[13/14] Generating example pages...");
    generateExamplePages(
      siteAnalysis.pageBlueprints,
      deduplicatedBlueprints,
      componentMatchMap,
      themeName,
      outputDir,
    );
    console.log(`  Done (${elapsed(stepStart)})\n`);
  } else {
    console.log("[13/14] Skipping example pages (--skip-examples)\n");
  }

  // ── Step 14: Scaffold theme package ──
  stepStart = Date.now();
  console.log("[14/14] Scaffolding theme package...");
  const themeDir = scaffoldThemePackage(siteAnalysis, themeName);
  console.log(`  Theme package: ${themeDir}`);
  console.log(`  Done (${elapsed(stepStart)})\n`);

  // ── Summary ──
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║              Pipeline Complete                   ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`  Theme: ${themeName}`);
  console.log(`  Pages discovered: ${discoveredPages.length}`);
  console.log(`  Screenshots: ${screenshotMap.size}`);
  console.log(`  Section blueprints: ${deduplicatedBlueprints.length}`);
  console.log(`  Components matched: ${matchedCount}`);
  console.log(`  Components generated: ${genResult.components.length}`);
  console.log(`  Output: ${outputDir}`);
  console.log(`  Total time: ${elapsed(pipelineStart)}`);
  console.log("");
}

main().catch((err) => {
  console.error("\n[FATAL]", err);
  process.exit(1);
});
