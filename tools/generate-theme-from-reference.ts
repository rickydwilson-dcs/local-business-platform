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
 *   npx tsx tools/generate-theme-from-reference.ts --url https://example.com --image ./screenshot.png --analyse
 *
 * Output:
 *   Writes theme.config.ts content to stdout (or --output path).
 *   Writes component registry choice (orion|vega) to stdout.
 *   With --analyse: also writes reference-analysis.json and reference-analysis.md.
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
import type { ReferenceAnalysis } from "./lib/reference-analysis-types";
import { REFERENCE_ANALYSIS_PROMPT } from "./lib/reference-analysis-prompts";

// ============================================================================
// Types
// ============================================================================

interface ThemeGenerationInput {
  url?: string;
  imagePath?: string;
  themeName?: string;
  outputPath?: string;
  dryRun?: boolean;
  analyse?: boolean;
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
    } else if (arg === "--analyse" || arg === "--analyze") {
      args.analyse = true;
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
// Vision-based reference analysis
// ============================================================================

async function analyseWithVision(
  screenshotPath: string,
  url: string | undefined,
  suggestion: ThemeSuggestion
): Promise<ReferenceAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("  [Warning] ANTHROPIC_API_KEY not set — returning minimal analysis.");
    return createMinimalAnalysis(url, screenshotPath);
  }

  const client = new Anthropic({ apiKey });

  try {
    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString("base64");

    // Detect media type from extension
    const ext = path.extname(screenshotPath).toLowerCase();
    const mediaType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

    const contextNote = [
      url ? `Reference URL: ${url}` : null,
      `Screenshot path: ${screenshotPath}`,
      `Extracted primary colour: ${suggestion.colors.brand.primary}`,
      `Style category: ${suggestion.style}`,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `${REFERENCE_ANALYSIS_PROMPT}\n\nAdditional context:\n${contextNote}`,
            },
          ],
        },
      ],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error("No text response from Claude");

    const jsonMatch = text.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in Claude response");

    const parsed = JSON.parse(jsonMatch[0]) as ReferenceAnalysis;
    // Ensure version is set
    parsed.analysisVersion = "1";
    parsed.reference = {
      ...parsed.reference,
      url: url ?? parsed.reference.url,
      screenshotPath,
    };
    return parsed;
  } catch (err) {
    console.warn(`  [Warning] Vision analysis failed: ${err}. Returning minimal analysis.`);
    return createMinimalAnalysis(url, screenshotPath);
  }
}

function createMinimalAnalysis(
  url: string | undefined,
  screenshotPath: string
): ReferenceAnalysis {
  return {
    analysisVersion: "1",
    reference: {
      url,
      screenshotPath,
      capturedAt: new Date().toISOString(),
    },
    visualLanguage: {
      palette: {
        background: "#FFFFFF",
        foreground: "#000000",
        primary: "#000000",
        secondary: "#666666",
        accent: "#333333",
        additional: [],
        confidence: "low",
      },
      typography: {
        headingWeight: "bold",
        bodyWeight: "normal",
        headingStyle: "sans",
        usesInlineColourHighlights: false,
      },
      heroPattern: {
        type: "centered",
        hasBackgroundImage: false,
        headerDark: false,
      },
      spacingDensity: "standard",
    },
    detectedSections: [],
    componentMappings: [],
    newComponentBacklog: [],
    registryRecommendation: {
      themeName: "nova",
      heroVariant: "minimal",
      headerVariant: "light",
      cardVariant: "standard",
      sectionVariant: "standard",
      confidence: "low",
      reasoning: "Minimal analysis — vision call failed.",
    },
    themeTokenRecommendations: {
      brand: {
        primary: "#000000",
        primaryHover: "#333333",
        secondary: "#666666",
        accent: "#999999",
      },
      surface: {
        background: "#FFFFFF",
        foreground: "#111111",
        muted: "#F5F5F5",
      },
      typography: {
        fontFamilySans: ["system-ui", "sans-serif"],
        fontFamilyHeading: ["system-ui", "sans-serif"],
      },
    },
  };
}

// ============================================================================
// Markdown report generation
// ============================================================================

function generateMarkdownReport(analysis: ReferenceAnalysis): string {
  const lines: string[] = [];

  lines.push("# Reference Analysis Report");
  lines.push("");
  lines.push(`**Analysis Version:** ${analysis.analysisVersion}`);
  if (analysis.reference.url) lines.push(`**Reference URL:** ${analysis.reference.url}`);
  if (analysis.reference.screenshotPath) lines.push(`**Screenshot:** ${analysis.reference.screenshotPath}`);
  lines.push(`**Captured:** ${analysis.reference.capturedAt}`);
  lines.push("");

  // Palette
  lines.push("## Palette");
  lines.push("");
  lines.push("| Token | Hex |");
  lines.push("|-------|-----|");
  const p = analysis.visualLanguage.palette;
  lines.push(`| Background | ${p.background} |`);
  lines.push(`| Foreground | ${p.foreground} |`);
  lines.push(`| Primary | ${p.primary} |`);
  lines.push(`| Secondary | ${p.secondary} |`);
  lines.push(`| Accent | ${p.accent} |`);
  for (const c of p.additional) {
    lines.push(`| Additional | ${c} |`);
  }
  lines.push("");
  lines.push(`**Confidence:** ${p.confidence}`);
  lines.push("");

  // Typography & Hero
  lines.push("## Visual Language");
  lines.push("");
  const t = analysis.visualLanguage.typography;
  lines.push(`- Heading weight: ${t.headingWeight}`);
  lines.push(`- Body weight: ${t.bodyWeight}`);
  lines.push(`- Heading style: ${t.headingStyle}`);
  lines.push(`- Inline colour highlights: ${t.usesInlineColourHighlights ? "yes" : "no"}`);
  lines.push(`- Hero pattern: ${analysis.visualLanguage.heroPattern.type}`);
  lines.push(`- Spacing density: ${analysis.visualLanguage.spacingDensity}`);
  lines.push("");

  // Section inventory
  lines.push("## Detected Sections");
  lines.push("");
  lines.push("| # | Name | Background | Layout | Purpose | Notes |");
  lines.push("|---|------|------------|--------|---------|-------|");
  analysis.detectedSections.forEach((s, i) => {
    lines.push(`| ${i + 1} | ${s.name} | ${s.background} | ${s.layoutType} | ${s.purpose} | ${s.notes} |`);
  });
  lines.push("");

  // Component mappings
  lines.push("## Component Mappings");
  lines.push("");
  lines.push("| Section | Status | Existing Component | Notes | Confidence |");
  lines.push("|---------|--------|-------------------|-------|------------|");
  for (const m of analysis.componentMappings) {
    lines.push(`| ${m.section} | ${m.status} | ${m.existingComponent ?? "—"} | ${m.notes} | ${m.confidence} |`);
  }
  lines.push("");

  // Gap components
  if (analysis.newComponentBacklog.length > 0) {
    lines.push("## New Component Backlog");
    lines.push("");
    for (const comp of analysis.newComponentBacklog) {
      lines.push(`### ${comp.name}`);
      lines.push("");
      lines.push(comp.description);
      lines.push("");
      lines.push(`**Reference section:** ${comp.referenceSection}`);
      lines.push("");
      lines.push("**Props contract:**");
      lines.push("```typescript");
      lines.push(comp.propsContract);
      lines.push("```");
      lines.push("");
      lines.push(`**Token constraints:** ${comp.tokenConstraints}`);
      lines.push("");
      lines.push("**Acceptance criteria:**");
      for (const ac of comp.acceptanceCriteria) {
        lines.push(`- ${ac}`);
      }
      lines.push("");
    }
  }

  // Registry recommendation
  lines.push("## Registry Recommendation");
  lines.push("");
  const r = analysis.registryRecommendation;
  lines.push(`- Theme: ${r.themeName}`);
  lines.push(`- Hero variant: ${r.heroVariant}`);
  lines.push(`- Header variant: ${r.headerVariant}`);
  lines.push(`- Card variant: ${r.cardVariant}`);
  lines.push(`- Section variant: ${r.sectionVariant}`);
  lines.push(`- Confidence: ${r.confidence}`);
  lines.push(`- Reasoning: ${r.reasoning}`);
  lines.push("");

  // Theme token recommendations
  lines.push("## Theme Token Recommendations");
  lines.push("");
  const tk = analysis.themeTokenRecommendations;
  lines.push("| Token | Value |");
  lines.push("|-------|-------|");
  lines.push(`| brand.primary | ${tk.brand.primary} |`);
  lines.push(`| brand.primaryHover | ${tk.brand.primaryHover} |`);
  lines.push(`| brand.secondary | ${tk.brand.secondary} |`);
  lines.push(`| brand.accent | ${tk.brand.accent} |`);
  lines.push(`| surface.background | ${tk.surface.background} |`);
  lines.push(`| surface.foreground | ${tk.surface.foreground} |`);
  lines.push(`| surface.muted | ${tk.surface.muted} |`);
  lines.push(`| typography.sans | ${tk.typography.fontFamilySans.join(", ")} |`);
  lines.push(`| typography.heading | ${tk.typography.fontFamilyHeading.join(", ")} |`);
  lines.push("");

  return lines.join("\n");
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
      suggestion = await generateCompleteTheme(imageAnalysis, websiteStyles);
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

  // ── Step 2b: Vision-based reference analysis (--analyse) ─────────────────

  if (args.analyse) {
    if (!args.imagePath) {
      console.warn("\n  [Warning] --analyse requires --image <screenshot>. Skipping analysis.");
    } else {
      console.log("\n  Running vision-based reference analysis...");
      const analysis = await analyseWithVision(args.imagePath, args.url, suggestion);

      const outputDir = args.outputPath ?? "./";
      fs.mkdirSync(outputDir, { recursive: true });

      const jsonPath = path.join(outputDir, "reference-analysis.json");
      fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2), "utf8");
      console.log(`  ✓ Written: ${jsonPath}`);

      const mdReport = generateMarkdownReport(analysis);
      const mdPath = path.join(outputDir, "reference-analysis.md");
      fs.writeFileSync(mdPath, mdReport, "utf8");
      console.log(`  ✓ Written: ${mdPath}`);

      console.log(`  ✓ Sections: ${analysis.detectedSections.length}`);
      console.log(`  ✓ Component mappings: ${analysis.componentMappings.length}`);
      console.log(`  ✓ Gap components: ${analysis.newComponentBacklog.length}`);
    }
  }

  // ── Step 3: Generate theme.config.ts content ─────────────────────────────

  const configContent = generateEnrichedThemeConfig(suggestion, layout, themeName);

  // ── Step 4: Output ───────────────────────────────────────────────────────

  console.log("\n─── Generated theme.config.ts ───────────────────────────────────\n");
  console.log(configContent);
  console.log("─────────────────────────────────────────────────────────────────\n");

  if (!args.dryRun && args.outputPath) {
    // In --analyse mode, outputPath is a directory; write theme.config.ts inside it
    const outputFile = args.analyse
      ? path.join(args.outputPath, "theme.config.ts")
      : args.outputPath;
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, configContent, "utf8");
    console.log(`  ✓ Written to: ${outputFile}`);
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
