#!/usr/bin/env npx tsx
/**
 * Generate Theme from Reference
 *
 * Analyses a reference website URL or local logo image to generate a
 * platform-compatible theme package. Uses the existing intake-system
 * theme-extraction utilities for colour analysis and Claude for layout
 * pattern classification → Orion or Vega ComponentRegistry.
 *
 * Usage:
 *   npx tsx tools/generate-theme-from-reference.ts --url https://example.com
 *   npx tsx tools/generate-theme-from-reference.ts --image ./logo.png
 *   npx tsx tools/generate-theme-from-reference.ts --url https://example.com --image ./logo.png --name my-client
 *   npx tsx tools/generate-theme-from-reference.ts --url https://example.com --dry-run
 *
 * Output:
 *   Writes theme.config.ts content to stdout (or --output path).
 *   Writes component registry choice (orion|vega) to stdout.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

// Load env vars from monorepo root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Import directly from source (no build step needed)
import {
  generateThemeFromImage,
  generateThemeFromWebsite,
  generateCompleteTheme,
  generateThemeConfigContent,
  analyzeImage,
  extractStylesFromUrl,
} from "../packages/intake-system/src/theme-extraction/index";
import type { ThemeSuggestion } from "../packages/intake-system/src/theme-extraction/types";

// ============================================================================
// Types
// ============================================================================

interface ThemeGenerationInput {
  url?: string;
  imagePath?: string;
  themeName?: string;
  outputPath?: string;
  dryRun?: boolean;
}

interface LayoutClassification {
  /** Which named theme best matches this business's visual style */
  theme: "orion" | "vega";
  /** Hero pattern detected */
  heroVariant: "image-overlay" | "split" | "centered";
  /** Header style */
  headerVariant: "dark" | "light";
  /** Primary card style */
  cardVariant: "icon-circle" | "standard" | "image-overlay";
  /** Primary section dark/light style */
  sectionVariant: "dark-accent" | "standard";
  /** Reasoning from Claude */
  reasoning: string;
}

// ============================================================================
// CLI argument parsing
// ============================================================================

function parseArgs(argv: string[]): ThemeGenerationInput {
  const args: ThemeGenerationInput = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--url" && next) {
      args.url = next;
      i++;
    } else if (arg === "--image" && next) {
      args.imagePath = next;
      i++;
    } else if (arg === "--name" && next) {
      args.themeName = next;
      i++;
    } else if (arg === "--output" && next) {
      args.outputPath = next;
      i++;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

// ============================================================================
// Layout classification via Claude
// ============================================================================

async function classifyLayoutPattern(
  websiteUrl: string | undefined,
  imagePath: string | undefined,
  suggestion: ThemeSuggestion
): Promise<LayoutClassification> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn(
      "  [Warning] ANTHROPIC_API_KEY not set — defaulting to Vega theme without AI classification."
    );
    return {
      theme: "vega",
      heroVariant: "centered",
      headerVariant: "light",
      cardVariant: "standard",
      sectionVariant: "standard",
      reasoning: "Defaulted to Vega (no ANTHROPIC_API_KEY set).",
    };
  }

  const client = new Anthropic({ apiKey });

  const colorContext = `
Brand primary colour: ${suggestion.colors.brand.primary}
Style category: ${suggestion.style}
Confidence: ${Math.round(suggestion.confidence * 100)}%
`.trim();

  const websiteContext = websiteUrl
    ? `Reference website URL: ${websiteUrl}`
    : "No reference website URL provided.";

  const prompt = `You are classifying a local service business's visual style to choose the best theme from our platform.

We have two named themes:
- **Orion**: Dark header, full-bleed image hero, circular icon cards, dark black CTA sections. Best for: trades businesses (electrical, plumbing, construction), dramatic / bold brands, dark colour schemes, businesses that want a powerful premium feel.
- **Vega**: Light header, standard card grid, clean and minimal. Best for: professional services, scaffolding, consulting, any brand with a blue/navy/green palette, businesses that want a clean approachable feel.

Business brand analysis:
${colorContext}
${websiteContext}

Based on this information, classify the most appropriate theme and component variants.

Respond with a JSON object matching this schema:
{
  "theme": "orion" | "vega",
  "heroVariant": "image-overlay" | "split" | "centered",
  "headerVariant": "dark" | "light",
  "cardVariant": "icon-circle" | "standard" | "image-overlay",
  "sectionVariant": "dark-accent" | "standard",
  "reasoning": "Brief explanation of why you chose this theme"
}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error("No text response from Claude");

    // Extract JSON from response (may have markdown fences)
    const jsonMatch = text.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in Claude response");

    const parsed = JSON.parse(jsonMatch[0]) as LayoutClassification;
    return parsed;
  } catch (err) {
    console.warn(`  [Warning] Layout classification failed: ${err}. Defaulting to Vega.`);
    return {
      theme: "vega",
      heroVariant: "centered",
      headerVariant: "light",
      cardVariant: "standard",
      sectionVariant: "standard",
      reasoning: `Defaulted to Vega due to classification error: ${err}`,
    };
  }
}

// ============================================================================
// Generate theme.config.ts content with componentRegistry
// ============================================================================

function generateEnrichedThemeConfig(
  suggestion: ThemeSuggestion,
  layout: LayoutClassification,
  themeName: string
): string {
  // Pass themeVariant directly — generateThemeConfigContent now emits complete output
  return generateThemeConfigContent(suggestion, themeName, layout.theme);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = parseArgs(process.argv);

  if (!args.url && !args.imagePath) {
    console.error("Error: Provide at least --url <website> or --image <path>\n");
    console.error(
      "Usage: npx tsx tools/generate-theme-from-reference.ts --url https://example.com"
    );
    process.exit(1);
  }

  const themeName = args.themeName ?? "new-site";
  console.log(`\n🎨 Generating theme for: ${themeName}`);

  // ── Step 1: Extract colours ──────────────────────────────────────────────

  let suggestion: ThemeSuggestion | null = null;

  if (args.url && args.imagePath) {
    console.log(`  Analysing website: ${args.url}`);
    const websiteStyles = await extractStylesFromUrl(args.url).catch((e) => {
      console.warn(`  [Warning] Website analysis failed: ${e}`);
      return null;
    });

    console.log(`  Analysing image: ${args.imagePath}`);
    const imageAnalysis = await analyzeImage(args.imagePath).catch((e) => {
      console.warn(`  [Warning] Image analysis failed: ${e}`);
      return null;
    });

    if (imageAnalysis && websiteStyles) {
      suggestion = generateCompleteTheme(imageAnalysis, websiteStyles);
    } else if (imageAnalysis) {
      suggestion = generateThemeFromImage(imageAnalysis);
    } else if (websiteStyles) {
      suggestion = generateThemeFromWebsite(websiteStyles);
    }
  } else if (args.url) {
    console.log(`  Analysing website: ${args.url}`);
    const websiteStyles = await extractStylesFromUrl(args.url).catch((e) => {
      console.warn(`  [Warning] Website analysis failed: ${e}`);
      return null;
    });
    if (websiteStyles) suggestion = generateThemeFromWebsite(websiteStyles);
  } else if (args.imagePath) {
    console.log(`  Analysing image: ${args.imagePath}`);
    const imageAnalysis = await analyzeImage(args.imagePath).catch((e) => {
      console.warn(`  [Warning] Image analysis failed: ${e}`);
      return null;
    });
    if (imageAnalysis) suggestion = generateThemeFromImage(imageAnalysis);
  }

  if (!suggestion) {
    console.error("  [Error] Could not extract any theme data from provided inputs.");
    process.exit(1);
  }

  console.log(`  ✓ Primary colour: ${suggestion.colors.brand.primary}`);
  console.log(`  ✓ Style category: ${suggestion.style}`);
  console.log(`  ✓ Confidence: ${Math.round(suggestion.confidence * 100)}%`);

  // ── Step 2: Classify layout pattern via Claude ───────────────────────────

  console.log("\n  Classifying layout pattern...");
  const layout = await classifyLayoutPattern(args.url, args.imagePath, suggestion);
  console.log(`  ✓ Theme: ${layout.theme}`);
  console.log(`  ✓ Hero: ${layout.heroVariant}`);
  console.log(`  ✓ Reasoning: ${layout.reasoning}`);

  // ── Step 3: Generate theme.config.ts content ─────────────────────────────

  const configContent = generateEnrichedThemeConfig(suggestion, layout, themeName);

  // ── Step 4: Output ───────────────────────────────────────────────────────

  console.log("\n─── Generated theme.config.ts ───────────────────────────────────\n");
  console.log(configContent);
  console.log("─────────────────────────────────────────────────────────────────\n");

  if (!args.dryRun && args.outputPath) {
    fs.mkdirSync(path.dirname(args.outputPath), { recursive: true });
    fs.writeFileSync(args.outputPath, configContent, "utf8");
    console.log(`  ✓ Written to: ${args.outputPath}`);
  } else if (args.dryRun) {
    console.log("  [dry-run] Output not written to disk.");
  } else {
    console.log("  Tip: Pass --output ./path/to/theme.config.ts to write to disk.");
  }

  console.log("\n✅ Theme generation complete.\n");
}

main().catch((err) => {
  console.error("[Fatal]", err);
  process.exit(1);
});
