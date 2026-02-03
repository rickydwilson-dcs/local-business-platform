/**
 * Website Analyzer
 *
 * Utilities for extracting styles and colors from websites.
 * Analyzes HTML, inline styles, and linked CSS to extract brand colors and fonts.
 */

import type { ExtractedStyles, StyleCategory, WebsiteAnalysisOptions } from "./types";
import { parseCssColor, hexToRgb, rgbToHsl, isLightColor } from "./color-utils";

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<WebsiteAnalysisOptions> = {
  timeout: 10000,
  fetchStylesheets: true,
  userAgent: "Mozilla/5.0 (compatible; ThemeExtractor/1.0; +https://example.com)",
};

// ============================================================================
// CSS Pattern Matching
// ============================================================================

// Patterns for finding color variables
const CSS_VARIABLE_PATTERNS = [
  // Primary color patterns
  /--(?:color-)?(?:primary|brand|main)(?:-color)?:\s*([^;}\n]+)/gi,
  /--(?:theme-)?primary:\s*([^;}\n]+)/gi,
  // Secondary color patterns
  /--(?:color-)?(?:secondary|accent)(?:-color)?:\s*([^;}\n]+)/gi,
  /--(?:theme-)?secondary:\s*([^;}\n]+)/gi,
  // Background patterns
  /--(?:color-)?(?:background|bg)(?:-color)?:\s*([^;}\n]+)/gi,
  /--(?:theme-)?(?:background|bg):\s*([^;}\n]+)/gi,
  // Text patterns
  /--(?:color-)?(?:text|foreground|fg)(?:-color)?:\s*([^;}\n]+)/gi,
  /--(?:theme-)?(?:text|foreground):\s*([^;}\n]+)/gi,
];

// Tailwind/utility class color patterns
const TAILWIND_COLOR_PATTERNS = [
  /(?:bg|text|border)-(?:blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-(\d+)/g,
  /(?:bg|text|border)-\[#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\]/g,
];

// Font family patterns
const FONT_PATTERNS = [
  /font-family:\s*([^;}\n]+)/gi,
  /--(?:font|typography)-(?:family|sans|serif|heading|body):\s*([^;}\n]+)/gi,
];

// ============================================================================
// HTML/CSS Parsing
// ============================================================================

/**
 * Extract colors from CSS text
 */
function extractColorsFromCss(css: string): Map<string, string[]> {
  const colors: Map<string, string[]> = new Map([
    ["primary", []],
    ["secondary", []],
    ["background", []],
    ["text", []],
    ["other", []],
  ]);

  // Find CSS variables
  for (const pattern of CSS_VARIABLE_PATTERNS) {
    const matches = css.matchAll(pattern);
    for (const match of matches) {
      const value = match[1]?.trim();
      if (!value) continue;

      const hex = parseCssColor(value);
      if (!hex) continue;

      // Categorize based on variable name
      const varName = match[0].toLowerCase();
      if (varName.includes("primary") || varName.includes("brand") || varName.includes("main")) {
        colors.get("primary")?.push(hex);
      } else if (varName.includes("secondary") || varName.includes("accent")) {
        colors.get("secondary")?.push(hex);
      } else if (varName.includes("background") || varName.includes("bg")) {
        colors.get("background")?.push(hex);
      } else if (varName.includes("text") || varName.includes("foreground")) {
        colors.get("text")?.push(hex);
      } else {
        colors.get("other")?.push(hex);
      }
    }
  }

  // Find inline color declarations
  const colorDeclarations = css.matchAll(
    /(?:color|background(?:-color)?|border-color):\s*([^;}\n]+)/gi
  );
  for (const match of colorDeclarations) {
    const value = match[1]?.trim();
    if (!value) continue;

    const hex = parseCssColor(value);
    if (!hex) continue;

    // Try to categorize
    const property = match[0].toLowerCase();
    if (property.startsWith("background")) {
      colors.get("background")?.push(hex);
    } else if (property.startsWith("color")) {
      colors.get("text")?.push(hex);
    } else {
      colors.get("other")?.push(hex);
    }
  }

  return colors;
}

/**
 * Extract font families from CSS
 */
function extractFontsFromCss(css: string): { heading: string[]; body: string[] } {
  const fonts = { heading: [] as string[], body: [] as string[] };

  for (const pattern of FONT_PATTERNS) {
    const matches = css.matchAll(pattern);
    for (const match of matches) {
      const value = match[1]?.trim();
      if (!value) continue;

      // Clean up font family string
      const fontFamily = value.replace(/["']/g, "").split(",")[0]?.trim();

      if (!fontFamily) continue;

      // Categorize based on context
      const context = match[0].toLowerCase();
      if (context.includes("heading") || context.includes("serif")) {
        fonts.heading.push(fontFamily);
      } else {
        fonts.body.push(fontFamily);
      }
    }
  }

  return fonts;
}

/**
 * Extract inline styles from HTML elements
 */
function extractInlineStyles(html: string): string {
  const styles: string[] = [];

  // Extract style attributes
  const styleAttrs = html.matchAll(/style=["']([^"']+)["']/gi);
  for (const match of styleAttrs) {
    if (match[1]) {
      styles.push(match[1]);
    }
  }

  // Extract style tags
  const styleTags = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  for (const match of styleTags) {
    if (match[1]) {
      styles.push(match[1]);
    }
  }

  return styles.join("\n");
}

/**
 * Extract linked stylesheet URLs from HTML
 */
function extractStylesheetUrls(html: string, baseUrl: string): string[] {
  const urls: string[] = [];
  const linkTags = html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi);

  for (const match of linkTags) {
    if (match[1]) {
      try {
        const url = new URL(match[1], baseUrl);
        urls.push(url.toString());
      } catch {
        // Invalid URL, skip
      }
    }
  }

  // Also check for href before rel
  const linkTagsAlt = html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi);

  for (const match of linkTagsAlt) {
    if (match[1]) {
      try {
        const url = new URL(match[1], baseUrl);
        urls.push(url.toString());
      } catch {
        // Invalid URL, skip
      }
    }
  }

  return [...new Set(urls)];
}

/**
 * Get most common value from array
 */
function getMostCommon<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;

  const counts = new Map<T, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  let maxCount = 0;
  let mostCommon: T | undefined;
  for (const [item, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = item;
    }
  }

  return mostCommon;
}

// ============================================================================
// Style Categorization
// ============================================================================

/**
 * Determine style category from extracted data
 */
export function categorizeStyle(styles: ExtractedStyles): StyleCategory {
  const { colors, fonts } = styles;

  // Check font characteristics
  const headingFont = fonts.heading?.toLowerCase() ?? "";
  const bodyFont = fonts.body?.toLowerCase() ?? "";

  const hasSerifHeading =
    headingFont.includes("serif") ||
    headingFont.includes("georgia") ||
    headingFont.includes("times") ||
    headingFont.includes("playfair");

  const hasSansBody =
    bodyFont.includes("sans") ||
    bodyFont.includes("inter") ||
    bodyFont.includes("roboto") ||
    bodyFont.includes("arial");

  // Check color characteristics
  const primaryRgb = colors.primary ? hexToRgb(colors.primary) : null;
  const primaryHsl = primaryRgb ? rgbToHsl(primaryRgb) : null;

  const isHighSaturation = primaryHsl ? primaryHsl.s > 70 : false;
  const isLowSaturation = primaryHsl ? primaryHsl.s < 30 : false;
  const isVeryDark = primaryHsl ? primaryHsl.l < 20 : false;
  const isVeryLight = primaryHsl ? primaryHsl.l > 80 : false;

  // Categorize
  if (hasSerifHeading && !isHighSaturation) {
    return isLowSaturation ? "elegant" : "traditional";
  }

  if (isHighSaturation && !hasSerifHeading) {
    return "bold";
  }

  if (isLowSaturation && hasSansBody) {
    return "minimal";
  }

  if (
    headingFont.includes("comic") ||
    headingFont.includes("marker") ||
    headingFont.includes("handwriting")
  ) {
    return "playful";
  }

  if (isVeryDark || (isLowSaturation && !isVeryLight)) {
    return "corporate";
  }

  return "modern";
}

// ============================================================================
// Main Analysis Functions
// ============================================================================

/**
 * Extract CSS styles from a website URL
 */
export async function extractStylesFromUrl(
  url: string,
  options: WebsiteAnalysisOptions = {}
): Promise<ExtractedStyles> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Fetch the HTML
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout);

  let html: string;
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": opts.userAgent,
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    html = await response.text();
  } finally {
    clearTimeout(timeout);
  }

  // Collect all CSS
  let allCss = extractInlineStyles(html);

  // Fetch linked stylesheets
  if (opts.fetchStylesheets) {
    const stylesheetUrls = extractStylesheetUrls(html, url);

    for (const cssUrl of stylesheetUrls.slice(0, 5)) {
      // Limit to 5 stylesheets
      try {
        const cssResponse = await fetch(cssUrl, {
          headers: { "User-Agent": opts.userAgent },
          signal: AbortSignal.timeout(5000),
        });

        if (cssResponse.ok) {
          const cssText = await cssResponse.text();
          allCss += "\n" + cssText;
        }
      } catch {
        // Skip failed stylesheet fetches
      }
    }
  }

  // Extract colors and fonts
  const extractedColors = extractColorsFromCss(allCss);
  const extractedFonts = extractFontsFromCss(allCss);

  // Build result
  const styles: ExtractedStyles = {
    colors: {
      primary:
        getMostCommon(extractedColors.get("primary") ?? []) ??
        getMostCommon(extractedColors.get("other") ?? []),
      secondary: getMostCommon(extractedColors.get("secondary") ?? []),
      background: getMostCommon(extractedColors.get("background") ?? []),
      text: getMostCommon(extractedColors.get("text") ?? []),
    },
    fonts: {
      heading: getMostCommon(extractedFonts.heading),
      body: getMostCommon(extractedFonts.body) ?? getMostCommon(extractedFonts.heading),
    },
    style: "modern", // Will be set below
  };

  styles.style = categorizeStyle(styles);

  return styles;
}

/**
 * Extract styles from HTML string (for already-fetched content)
 */
export async function extractStylesFromHtml(
  html: string,
  baseUrl?: string
): Promise<ExtractedStyles> {
  let allCss = extractInlineStyles(html);

  // Extract colors and fonts
  const extractedColors = extractColorsFromCss(allCss);
  const extractedFonts = extractFontsFromCss(allCss);

  const styles: ExtractedStyles = {
    colors: {
      primary:
        getMostCommon(extractedColors.get("primary") ?? []) ??
        getMostCommon(extractedColors.get("other") ?? []),
      secondary: getMostCommon(extractedColors.get("secondary") ?? []),
      background: getMostCommon(extractedColors.get("background") ?? []),
      text: getMostCommon(extractedColors.get("text") ?? []),
    },
    fonts: {
      heading: getMostCommon(extractedFonts.heading),
      body: getMostCommon(extractedFonts.body) ?? getMostCommon(extractedFonts.heading),
    },
    style: "modern",
  };

  styles.style = categorizeStyle(styles);

  return styles;
}

/**
 * Extract styles from CSS string directly
 */
export function extractStylesFromCss(css: string): ExtractedStyles {
  const extractedColors = extractColorsFromCss(css);
  const extractedFonts = extractFontsFromCss(css);

  const styles: ExtractedStyles = {
    colors: {
      primary:
        getMostCommon(extractedColors.get("primary") ?? []) ??
        getMostCommon(extractedColors.get("other") ?? []),
      secondary: getMostCommon(extractedColors.get("secondary") ?? []),
      background: getMostCommon(extractedColors.get("background") ?? []),
      text: getMostCommon(extractedColors.get("text") ?? []),
    },
    fonts: {
      heading: getMostCommon(extractedFonts.heading),
      body: getMostCommon(extractedFonts.body) ?? getMostCommon(extractedFonts.heading),
    },
    style: "modern",
  };

  styles.style = categorizeStyle(styles);

  return styles;
}

/**
 * Analyze multiple competitor websites
 */
export async function analyzeCompetitorSites(
  urls: string[],
  options: WebsiteAnalysisOptions = {}
): Promise<{
  results: Array<{ url: string; styles: ExtractedStyles; error?: string }>;
  commonColors: string[];
  commonFonts: string[];
  suggestedStyle: StyleCategory;
}> {
  const results: Array<{ url: string; styles: ExtractedStyles; error?: string }> = [];

  for (const url of urls) {
    try {
      const styles = await extractStylesFromUrl(url, options);
      results.push({ url, styles });
    } catch (error) {
      results.push({
        url,
        styles: {
          colors: {},
          fonts: {},
          style: "modern",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Find common colors
  const allColors: string[] = [];
  const allFonts: string[] = [];
  const allStyles: StyleCategory[] = [];

  for (const result of results) {
    if (result.error) continue;

    const { colors, fonts, style } = result.styles;
    if (colors.primary) allColors.push(colors.primary);
    if (colors.secondary) allColors.push(colors.secondary);
    if (fonts.body) allFonts.push(fonts.body);
    if (fonts.heading) allFonts.push(fonts.heading);
    allStyles.push(style);
  }

  return {
    results,
    commonColors: [...new Set(allColors)].slice(0, 5),
    commonFonts: [...new Set(allFonts)].slice(0, 3),
    suggestedStyle: getMostCommon(allStyles) ?? "modern",
  };
}
