/**
 * Multi-Page Analyzer
 *
 * Orchestrates per-page vision analysis across multiple discovered pages.
 * Pages with screenshots get Claude Sonnet vision calls; pages without
 * screenshots fall back to HTML-only structural analysis.
 *
 * Priority order for vision calls: home > services-list > about > blog-list > contact > others
 * Maximum 6 vision calls per run.
 */

import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import type {
  DiscoveredPage,
  PageBlueprint,
  PageSection,
  PageType,
  SectionBlueprint,
} from "./reference-analysis-types";
import type { HtmlSection, PageStructure } from "./html-structure-analyzer";
import { analyzeHtmlStructure } from "./html-structure-analyzer";
import {
  PAGE_LAYOUT_ANALYSIS_PROMPT,
  SITE_SYNTHESIS_PROMPT,
} from "./reference-analysis-prompts";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_VISION_CALLS = 6;
const VISION_MODEL = "claude-sonnet-4-6";
const VISION_MAX_TOKENS = 4096;
const VISION_TEMPERATURE = 0;

/** Priority order for selecting which pages get vision analysis. */
const VISION_PRIORITY: PageType[] = [
  "home",
  "services-list",
  "about",
  "blog-list",
  "contact",
];

// ── Exported Types ───────────────────────────────────────────────────────────

export interface PerPageAnalysis {
  page: DiscoveredPage;
  blueprint: PageBlueprint;
  sections: SectionBlueprint[];
  analysisSource: "vision" | "html-only" | "hybrid";
}

// ── Helper: Convert HtmlSection to SectionBlueprint ──────────────────────────

/**
 * Generate a kebab-case blueprint ID from a category and optional heading text.
 */
function generateBlueprintId(category: string, heading?: string): string {
  const base = category.toLowerCase().replace(/\s+/g, "-");
  if (heading) {
    const slug = heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);
    return `${base}-${slug}`;
  }
  return base;
}

/**
 * Convert a category string to PascalCase component name.
 */
function categoryToPascalCase(category: string): string {
  return category
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Convert a kebab-case ID to a PascalCase name.
 */
function kebabToPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

/**
 * Derive content slots from an HTML section based on its structural signals.
 */
function deriveContentSlots(section: HtmlSection): string[] {
  const slots: string[] = [];

  if (section.headingText) {
    slots.push("heading");
  }

  // Infer slots based on category
  switch (section.estimatedCategory) {
    case "Hero":
      slots.push("subheading", "ctaButtons");
      if (section.hasImages) slots.push("backgroundImage");
      break;
    case "Navigation":
      slots.push("logo", "navLinks", "ctaButton");
      break;
    case "Cards":
      slots.push("cards");
      if (section.hasImages) slots.push("cardImages");
      break;
    case "CTA":
      slots.push("description", "ctaButton");
      if (section.hasForm) slots.push("form");
      break;
    case "Content":
      slots.push("body");
      if (section.hasImages) slots.push("image");
      break;
    case "Social Proof":
      slots.push("testimonials");
      break;
    case "Blog":
      slots.push("posts");
      break;
    case "Stats":
      slots.push("statItems");
      break;
    case "Footer":
      slots.push("links", "copyright");
      break;
    case "Custom":
      slots.push("content");
      break;
  }

  return slots;
}

/**
 * Determine interaction needs based on HTML section signals.
 */
function deriveInteractionNeeds(
  section: HtmlSection,
): "none" | "minimal" | "stateful" {
  // Forms and high child counts suggest statefulness
  if (section.hasForm) return "stateful";

  // Navigation typically needs mobile toggle
  if (section.estimatedCategory === "Navigation") return "stateful";

  // Cards with many children might have carousel/tabs
  if (section.estimatedCategory === "Cards" && section.childCount > 6) {
    return "stateful";
  }

  // Social proof often has carousel
  if (section.estimatedCategory === "Social Proof") return "minimal";

  return "none";
}

/**
 * Derive token usage hints from the section category and background hint.
 */
function deriveTokenUsageHints(section: HtmlSection): string[] {
  const hints: string[] = [];

  switch (section.estimatedCategory) {
    case "Hero":
      hints.push("bg-brand-primary", "text-surface-background");
      break;
    case "Navigation":
      hints.push("bg-surface-background", "text-surface-foreground");
      break;
    case "CTA":
      hints.push("bg-brand-primary", "text-surface-background");
      break;
    case "Footer":
      hints.push("bg-surface-inverse", "text-surface-background");
      break;
    default:
      hints.push("bg-surface-background", "text-surface-foreground");
  }

  if (section.backgroundHint) {
    if (/dark|black|inverse/i.test(section.backgroundHint)) {
      hints.push("bg-surface-inverse");
    }
  }

  return [...new Set(hints)];
}

/**
 * Convert an HtmlSection into a SectionBlueprint for HTML-only analysis.
 */
function htmlSectionToBlueprint(
  section: HtmlSection,
  pageType: string,
): SectionBlueprint {
  const blueprintId = generateBlueprintId(
    section.estimatedCategory,
    section.headingText,
  );
  const componentName =
    kebabToPascalCase(blueprintId) ||
    categoryToPascalCase(section.estimatedCategory);

  return {
    id: blueprintId,
    name: componentName,
    category: section.estimatedCategory,
    purpose: section.headingText
      ? `${section.estimatedCategory} section: ${section.headingText}`
      : `${section.estimatedCategory} section`,
    layoutPattern: section.tag === "nav" ? "horizontal bar" : "contained",
    contentSlots: deriveContentSlots(section),
    interactionNeeds: deriveInteractionNeeds(section),
    componentFileName: `${blueprintId}.tsx`,
    componentExportName: componentName,
    tokenUsageHints: deriveTokenUsageHints(section),
    confidence: "low",
    referenceSection: `${pageType} - ${section.estimatedCategory} (index ${section.index})`,
  };
}

/**
 * Convert an HtmlSection into a PageSection for the page blueprint.
 */
function htmlSectionToPageSection(
  section: HtmlSection,
  pageType: string,
): PageSection {
  const blueprintId = generateBlueprintId(
    section.estimatedCategory,
    section.headingText,
  );
  const isShared =
    section.estimatedCategory === "Navigation" ||
    section.estimatedCategory === "Footer";

  return {
    order: section.index + 1,
    blueprintId,
    isShared,
  };
}

// ── Helper: Build prompt with template replacement ───────────────────────────

function buildPagePrompt(pageType: string, pagePath: string): string {
  return PAGE_LAYOUT_ANALYSIS_PROMPT.replace(/\{\{pageType\}\}/g, pageType).replace(
    /\{\{path\}\}/g,
    pagePath,
  );
}

// ── Helper: Detect media type from file extension ────────────────────────────

function getMediaType(
  filePath: string,
): "image/png" | "image/jpeg" | "image/webp" | "image/gif" {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/png";
  }
}

// ── Helper: Parse vision response JSON ───────────────────────────────────────

interface VisionPageResult {
  pageType: string;
  path: string;
  title: string;
  sections: Array<{
    order: number;
    blueprintId: string;
    name: string;
    category: string;
    purpose: string;
    layoutPattern: string;
    contentSlots: string[];
    interactionNeeds: "none" | "minimal" | "stateful";
    tokenUsageHints: string[];
    confidence: "high" | "medium" | "low";
    isShared: boolean;
  }>;
  visualLanguage: {
    palette: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      additional: string[];
      confidence: "high" | "medium" | "low";
    };
    typography: {
      headingWeight: string;
      bodyWeight: string;
      headingStyle: string;
      usesInlineColourHighlights: boolean;
    };
    heroPattern: {
      type: string;
      hasBackgroundImage: boolean;
      headerDark: boolean;
    };
    spacingDensity: string;
  };
  confidence: "high" | "medium" | "low";
}

/**
 * Convert a parsed vision response into PerPageAnalysis.
 */
function visionResultToPerPageAnalysis(
  result: VisionPageResult,
  page: DiscoveredPage,
): PerPageAnalysis {
  const sections: SectionBlueprint[] = result.sections.map((s) => ({
    id: s.blueprintId,
    name: s.name,
    category: s.category as SectionBlueprint["category"],
    purpose: s.purpose,
    layoutPattern: s.layoutPattern,
    contentSlots: s.contentSlots,
    interactionNeeds: s.interactionNeeds,
    componentFileName: `${s.blueprintId}.tsx`,
    componentExportName: s.name,
    tokenUsageHints: s.tokenUsageHints,
    confidence: s.confidence,
    referenceSection: `${result.pageType} - ${s.name}`,
  }));

  const pageSections: PageSection[] = result.sections.map((s) => ({
    order: s.order,
    blueprintId: s.blueprintId,
    isShared: s.isShared,
  }));

  const sharedSections = result.sections
    .filter((s) => s.isShared)
    .map((s) => s.blueprintId);

  const blueprint: PageBlueprint = {
    pageType: page.pageType,
    path: page.path,
    title: result.title,
    sections: pageSections,
    sharedSections,
    analysisSource: "vision",
    confidence: result.confidence,
    routePattern: page.path,
    isContentBacked: false,
  };

  return {
    page,
    blueprint,
    sections,
    analysisSource: "vision",
  };
}

// ── Core: Vision analysis for a single page ──────────────────────────────────

async function analyzePageWithVision(
  client: Anthropic,
  page: DiscoveredPage,
  screenshotPath: string,
  htmlHints: PageStructure | null,
): Promise<PerPageAnalysis> {
  const imageBuffer = fs.readFileSync(screenshotPath);
  const base64Image = imageBuffer.toString("base64");
  const mediaType = getMediaType(screenshotPath);

  const prompt = buildPagePrompt(page.pageType, page.path);

  // Build the HTML hints summary if available
  let htmlHintText = "";
  if (htmlHints && htmlHints.sections.length > 0) {
    const hintsJson = JSON.stringify(
      {
        sectionCount: htmlHints.sections.length,
        sections: htmlHints.sections.map((s) => ({
          index: s.index,
          tag: s.tag,
          heading: s.headingText ?? null,
          category: s.estimatedCategory,
          hasImages: s.hasImages,
          hasForm: s.hasForm,
          childCount: s.childCount,
          backgroundHint: s.backgroundHint ?? null,
        })),
        navigationLinks: htmlHints.navigationLinks.slice(0, 20),
        footerLinks: htmlHints.footerLinks.slice(0, 20),
      },
      null,
      2,
    );
    htmlHintText = `\n\nHTML Structure Hints:\n${hintsJson}`;
  }

  const response = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: VISION_MAX_TOKENS,
    temperature: VISION_TEMPERATURE,
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
            text: `${prompt}${htmlHintText}`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(
      `No text response from Claude for page: ${page.pageType} (${page.path})`,
    );
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `No JSON object found in Claude response for page: ${page.pageType} (${page.path})`,
    );
  }

  const parsed = JSON.parse(jsonMatch[0]) as VisionPageResult;
  return visionResultToPerPageAnalysis(parsed, page);
}

// ── Core: HTML-only analysis for a single page ──────────────────────────────

function analyzePageHtmlOnly(
  page: DiscoveredPage,
  html: string,
): PerPageAnalysis {
  const structure = analyzeHtmlStructure(html, page);

  const sections: SectionBlueprint[] = structure.sections.map((s) =>
    htmlSectionToBlueprint(s, page.pageType),
  );

  const pageSections: PageSection[] = structure.sections.map((s) =>
    htmlSectionToPageSection(s, page.pageType),
  );

  const sharedSections = structure.sections
    .filter(
      (s) =>
        s.estimatedCategory === "Navigation" ||
        s.estimatedCategory === "Footer",
    )
    .map((s) =>
      generateBlueprintId(s.estimatedCategory, s.headingText),
    );

  const blueprint: PageBlueprint = {
    pageType: page.pageType,
    path: page.path,
    title:
      page.title ??
      structure.sections.find((s) => s.headingText)?.headingText ??
      page.pageType,
    sections: pageSections,
    sharedSections,
    analysisSource: "html-only",
    confidence: "low",
    routePattern: page.path,
    isContentBacked: false,
  };

  return {
    page,
    blueprint,
    sections,
    analysisSource: "html-only",
  };
}

// ── Core: Site synthesis call ────────────────────────────────────────────────

async function synthesizeSiteAnalysis(
  client: Anthropic,
  perPageResults: PerPageAnalysis[],
): Promise<Record<string, unknown>> {
  // Build a JSON summary of all per-page analyses for the synthesis prompt
  const summaryPayload = perPageResults.map((result) => ({
    pageType: result.page.pageType,
    path: result.page.path,
    analysisSource: result.analysisSource,
    title: result.blueprint.title,
    confidence: result.blueprint.confidence,
    sections: result.blueprint.sections,
    sectionBlueprints: result.sections.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      purpose: s.purpose,
      layoutPattern: s.layoutPattern,
      contentSlots: s.contentSlots,
      interactionNeeds: s.interactionNeeds,
      tokenUsageHints: s.tokenUsageHints,
      confidence: s.confidence,
    })),
    visualLanguage:
      result.analysisSource === "vision"
        ? (result as PerPageAnalysis & { visualLanguage?: unknown })
            .visualLanguage ?? null
        : null,
  }));

  const response = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: VISION_MAX_TOKENS,
    temperature: VISION_TEMPERATURE,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${SITE_SYNTHESIS_PROMPT}\n\nPer-page analysis results:\n${JSON.stringify(summaryPayload, null, 2)}`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude for site synthesis");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in Claude synthesis response");
  }

  return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
}

// ── Main Export ──────────────────────────────────────────────────────────────

/**
 * Analyze multiple discovered pages using vision (for pages with screenshots)
 * and HTML structural analysis (for pages without).
 *
 * Prioritizes pages by type: home > services-list > about > blog-list > contact.
 * Caps vision calls at 6 maximum.
 *
 * After all per-page analyses are complete, runs a synthesis call to consolidate
 * into a unified site analysis.
 *
 * @param pages - All discovered pages
 * @param htmlMap - Map of URL to raw HTML string
 * @param screenshotMap - Map of pageType to screenshot file path
 * @returns Per-page analyses and consolidated site synthesis
 */
export async function analyzeMultiplePages(
  pages: DiscoveredPage[],
  htmlMap: Map<string, string>,
  screenshotMap: Map<string, string>,
): Promise<{ perPage: PerPageAnalysis[]; synthesis: Record<string, unknown> }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const client = apiKey ? new Anthropic({ apiKey }) : null;

  if (!client) {
    console.warn(
      "  [Warning] ANTHROPIC_API_KEY not set — using HTML-only analysis for all pages.",
    );
  }

  // Sort pages by vision priority, then by remaining pages
  const priorityIndex = (pageType: PageType): number => {
    const idx = VISION_PRIORITY.indexOf(pageType);
    return idx === -1 ? VISION_PRIORITY.length : idx;
  };

  const sortedPages = [...pages].sort(
    (a, b) => priorityIndex(a.pageType) - priorityIndex(b.pageType),
  );

  // Determine which pages get vision calls (have screenshots + within cap)
  let visionCallCount = 0;
  const visionPages: DiscoveredPage[] = [];
  const htmlOnlyPages: DiscoveredPage[] = [];

  for (const page of sortedPages) {
    const hasScreenshot = screenshotMap.has(page.pageType);
    if (client && hasScreenshot && visionCallCount < MAX_VISION_CALLS) {
      visionPages.push(page);
      visionCallCount++;
    } else {
      htmlOnlyPages.push(page);
    }
  }

  const perPageResults: PerPageAnalysis[] = [];

  // Process vision pages sequentially to respect API rate limits
  for (const page of visionPages) {
    const screenshotPath = screenshotMap.get(page.pageType)!;
    const html = htmlMap.get(page.url);

    // Run HTML pre-pass for structural hints if HTML is available
    let htmlHints: PageStructure | null = null;
    if (html) {
      htmlHints = analyzeHtmlStructure(html, page);
    }

    try {
      const result = await analyzePageWithVision(
        client!,
        page,
        screenshotPath,
        htmlHints,
      );
      perPageResults.push(result);
    } catch (err) {
      // Fall back to HTML-only if vision fails
      console.warn(
        `  [Warning] Vision analysis failed for ${page.pageType} (${page.path}): ${err}`,
      );
      if (html) {
        perPageResults.push(analyzePageHtmlOnly(page, html));
      }
    }
  }

  // Process HTML-only pages
  for (const page of htmlOnlyPages) {
    const html = htmlMap.get(page.url);
    if (html) {
      perPageResults.push(analyzePageHtmlOnly(page, html));
    }
  }

  // Run site synthesis across all per-page results
  let synthesis: Record<string, unknown> = {};
  if (client && perPageResults.length > 0) {
    try {
      synthesis = await synthesizeSiteAnalysis(client, perPageResults);
    } catch (err) {
      console.warn(`  [Warning] Site synthesis failed: ${err}`);
      synthesis = { error: String(err), perPageCount: perPageResults.length };
    }
  }

  return { perPage: perPageResults, synthesis };
}
