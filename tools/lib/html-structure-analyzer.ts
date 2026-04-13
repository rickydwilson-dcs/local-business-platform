/**
 * HTML Structure Analyzer
 *
 * Fast deterministic pre-pass (no API calls) that analyzes HTML structure
 * using regex-based parsing. Extracts semantic sections, classifies them
 * into ComponentCategory types, and gathers navigation/footer links.
 */

import type { DiscoveredPage } from "./reference-analysis-types";
import type { ComponentCategory } from "../../packages/theme-system/src/types";

// ── Exported Interfaces ───────────────────────────────────────────────────────

export interface HtmlSection {
  index: number;
  tag: string;
  headingText?: string;
  estimatedCategory: ComponentCategory;
  hasImages: boolean;
  hasForm: boolean;
  childCount: number;
  cssClasses: string[];
  backgroundHint?: string;
}

export interface PageStructure {
  page: DiscoveredPage;
  sections: HtmlSection[];
  navigationLinks: string[];
  footerLinks: string[];
}

// ── Internal Helpers ──────────────────────────────────────────────────────────

/**
 * Extract the value of a specific attribute from an opening tag string.
 * Returns undefined if the attribute is not present.
 */
function extractAttribute(openingTag: string, attr: string): string | undefined {
  // Match attr="value" or attr='value'
  const re = new RegExp(`${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i");
  const match = openingTag.match(re);
  if (match) {
    return match[1] ?? match[2];
  }
  return undefined;
}

/**
 * Extract CSS classes from a tag's class attribute.
 */
function extractClasses(openingTag: string): string[] {
  const classValue = extractAttribute(openingTag, "class");
  if (!classValue) return [];
  return classValue
    .split(/\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/**
 * Extract the first heading (h1-h6) text from an HTML fragment.
 */
function extractFirstHeading(html: string): string | undefined {
  const headingRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i;
  const match = html.match(headingRe);
  if (!match) return undefined;
  // Strip inner HTML tags and clean whitespace
  const text = match[1]
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined;
}

/**
 * Approximate count of direct child elements within an HTML fragment.
 * Counts top-level opening tags that are not self-closing.
 */
function estimateChildCount(innerHtml: string): number {
  // Strip nested elements deeper than one level by removing content inside
  // matched tags. As a fast approximation, count opening tags at the top level.
  // We count tags that appear right after the start or after a closing tag.
  let count = 0;
  let depth = 0;
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
  let tagMatch: RegExpExecArray | null;

  while ((tagMatch = tagRe.exec(innerHtml)) !== null) {
    const fullMatch = tagMatch[0];
    const isSelfClosing =
      fullMatch.endsWith("/>") ||
      /^(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)$/i.test(tagMatch[1]);
    const isClosing = fullMatch.startsWith("</");

    if (isClosing) {
      depth = Math.max(0, depth - 1);
    } else if (!isSelfClosing) {
      if (depth === 0) {
        count++;
      }
      depth++;
    } else {
      // Self-closing at depth 0 counts as a child
      if (depth === 0) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Detect a background hint from inline styles or CSS class names.
 */
function detectBackgroundHint(openingTag: string, classes: string[]): string | undefined {
  const hints: string[] = [];

  // Check inline style for background
  const style = extractAttribute(openingTag, "style") ?? "";
  if (/background(?:-color|-image)?\s*:/i.test(style)) {
    // Extract color or url
    const colorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
    if (colorMatch) {
      hints.push(colorMatch[1].trim());
    }
    const urlMatch = style.match(/url\(([^)]+)\)/i);
    if (urlMatch) {
      hints.push(`image: ${urlMatch[1].replace(/['"]/g, "").trim()}`);
    }
  }

  // Check class names for background keywords
  const bgKeywords = [
    "bg-",
    "dark",
    "hero",
    "light",
    "gradient",
    "overlay",
    "banner",
    "inverted",
    "black",
    "white",
  ];
  for (const cls of classes) {
    const lower = cls.toLowerCase();
    for (const keyword of bgKeywords) {
      if (lower.includes(keyword)) {
        hints.push(cls);
        break;
      }
    }
  }

  return hints.length > 0 ? hints.join("; ") : undefined;
}

/**
 * Extract all href values from anchor tags within an HTML fragment.
 */
function extractLinks(html: string): string[] {
  const links: string[] = [];
  const anchorRe = /<a\s[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRe.exec(html)) !== null) {
    const href = (match[1] ?? match[2] ?? "").trim();
    if (href && href !== "#" && !href.startsWith("javascript:")) {
      links.push(href);
    }
  }

  return links;
}

/**
 * Check whether an HTML fragment contains stat-like numeric content.
 * Looks for patterns like "500+", "100%", "$1M", "24/7", standalone numbers, etc.
 */
function hasStatContent(html: string): boolean {
  // Strip tags to get text only
  const text = html.replace(/<[^>]*>/g, " ");
  // Look for multiple stat-like patterns
  const statPatterns =
    /(?:\d{1,3}(?:,\d{3})*\+?%?|\$[\d,.]+[KMBkmb]?|\d+\/\d+|\d+\s*(?:years?|clients?|projects?|customers?|employees?|locations?|reviews?|stars?))/gi;
  const matches = text.match(statPatterns);
  return (matches?.length ?? 0) >= 2;
}

/**
 * Check whether an HTML fragment contains testimonial/social-proof indicators.
 */
function hasTestimonialContent(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    /<blockquote/i.test(html) ||
    /testimonial/i.test(lower) ||
    /(?:what\s+(?:our\s+)?(?:customers?|clients?)\s+say)/i.test(lower) ||
    /(?:reviews?|rating)/i.test(lower) ||
    /\bstars?\b/i.test(lower)
  );
}

/**
 * Check whether an HTML fragment contains blog/article indicators.
 */
function hasBlogContent(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    /\b(?:blog|article|post|news|latest\s+(?:posts?|articles?|news))\b/i.test(lower) ||
    /<article/i.test(html)
  );
}

/**
 * Count the number of <img> tags in an HTML fragment.
 */
function countImages(html: string): number {
  const imgRe = /<img\b/gi;
  const matches = html.match(imgRe);
  return matches?.length ?? 0;
}

/**
 * Classify an HTML section into a ComponentCategory based on structural signals.
 */
function classifySection(
  tag: string,
  innerHtml: string,
  headingText: string | undefined,
  hasImages: boolean,
  hasForm: boolean,
  isFirstSection: boolean,
  classes: string[]
): ComponentCategory {
  const lowerInner = innerHtml.toLowerCase();
  const lowerHeading = (headingText ?? "").toLowerCase();
  const lowerClasses = classes.map((c) => c.toLowerCase()).join(" ");

  // Has <nav> element inside or is a nav tag
  if (tag === "nav" || /<nav[\s>]/i.test(innerHtml)) {
    return "Navigation";
  }

  // Is a footer element
  if (tag === "footer") {
    return "Footer";
  }

  // Hero detection: heading contains hero/banner keywords, or is the first section,
  // or class names suggest hero
  if (
    /\bhero\b/.test(lowerClasses) ||
    /\bbanner\b/.test(lowerClasses) ||
    /\bhero\b/.test(lowerHeading) ||
    /\bbanner\b/.test(lowerHeading)
  ) {
    return "Hero";
  }
  if (isFirstSection && tag !== "footer" && tag !== "nav") {
    return "Hero";
  }

  // Has form -> CTA
  if (hasForm) {
    return "CTA";
  }

  // Testimonial / social proof
  if (hasTestimonialContent(innerHtml)) {
    return "Social Proof";
  }

  // Stats
  if (hasStatContent(innerHtml)) {
    return "Stats";
  }

  // Blog / article content
  if (hasBlogContent(innerHtml)) {
    return "Blog";
  }

  // Many images -> Cards
  if (
    countImages(innerHtml) >= 3 ||
    (hasImages && /\bgrid\b|\bcards?\b|\bgallery\b/i.test(lowerClasses + " " + lowerInner))
  ) {
    return "Cards";
  }

  // Default
  return "Content";
}

// ── Section Extraction ────────────────────────────────────────────────────────

/**
 * Represents a raw extracted block from the HTML before classification.
 */
export interface RawBlock {
  tag: string;
  openingTag: string;
  innerHtml: string;
  fullMatch: string;
}

/**
 * Extract top-level semantic sections and major div elements from HTML.
 * Uses regex-based matching to find <section>, <main>, <header>, <footer>,
 * <nav>, and <div> elements with ARIA roles.
 */
export function extractTopLevelBlocks(html: string): RawBlock[] {
  const blocks: RawBlock[] = [];

  // Target semantic elements and divs with roles
  const semanticTags = ["section", "main", "header", "footer", "nav", "article"];

  for (const tag of semanticTags) {
    // Match opening tag, capture inner content, and closing tag.
    // Uses a non-greedy approach with a balancing heuristic for nested same-tags.
    const openTagRe = new RegExp(`<${tag}(\\s[^>]*)?>`, "gi");
    let openMatch: RegExpExecArray | null;

    while ((openMatch = openTagRe.exec(html)) !== null) {
      const startIndex = openMatch.index;
      const openingTag = openMatch[0];
      const afterOpen = startIndex + openingTag.length;

      // Find the matching closing tag, handling nesting
      let depth = 1;
      const nestedRe = new RegExp(`<(/?)(${tag})(\\s[^>]*)?>`, "gi");
      nestedRe.lastIndex = afterOpen;
      let nestedMatch: RegExpExecArray | null;
      let endIndex = -1;

      while ((nestedMatch = nestedRe.exec(html)) !== null) {
        if (nestedMatch[1] === "/") {
          depth--;
          if (depth === 0) {
            endIndex = nestedMatch.index;
            break;
          }
        } else {
          depth++;
        }
      }

      if (endIndex === -1) {
        // No matching close tag found; skip
        continue;
      }

      const innerHtml = html.slice(afterOpen, endIndex);
      const closingTag = `</${tag}>`;
      const fullMatch = html.slice(startIndex, endIndex + closingTag.length);

      blocks.push({ tag, openingTag, innerHtml, fullMatch });
    }
  }

  // Also extract <div> elements with ARIA roles (role="main", role="banner", etc.)
  const roleRe = /<div\s[^>]*role\s*=\s*(?:"([^"]*)"|'([^']*)')([^>]*)>/gi;
  let roleMatch: RegExpExecArray | null;

  while ((roleMatch = roleRe.exec(html)) !== null) {
    const role = (roleMatch[1] ?? roleMatch[2] ?? "").toLowerCase();
    const targetRoles = ["main", "banner", "contentinfo", "navigation", "complementary", "region"];
    if (!targetRoles.includes(role)) continue;

    const startIndex = roleMatch.index;
    const openingTag = roleMatch[0];
    const afterOpen = startIndex + openingTag.length;

    // Find matching closing </div>, handling nesting
    let depth = 1;
    const divRe = /<(\/?)div(\s[^>]*)?\/?>/gi;
    divRe.lastIndex = afterOpen;
    let divMatch: RegExpExecArray | null;
    let endIndex = -1;

    while ((divMatch = divRe.exec(html)) !== null) {
      if (divMatch[1] === "/") {
        depth--;
        if (depth === 0) {
          endIndex = divMatch.index;
          break;
        }
      } else if (!divMatch[0].endsWith("/>")) {
        depth++;
      }
    }

    if (endIndex === -1) continue;

    const innerHtml = html.slice(afterOpen, endIndex);
    const fullMatch = html.slice(startIndex, endIndex + "</div>".length);

    // Map ARIA role to a semantic tag name for classification
    const roleTagMap: Record<string, string> = {
      main: "main",
      banner: "header",
      contentinfo: "footer",
      navigation: "nav",
      complementary: "aside",
      region: "section",
    };

    blocks.push({
      tag: roleTagMap[role] ?? "div",
      openingTag,
      innerHtml,
      fullMatch,
    });
  }

  // Sort blocks by their position in the HTML (order of appearance)
  blocks.sort((a, b) => {
    const posA = html.indexOf(a.fullMatch);
    const posB = html.indexOf(b.fullMatch);
    return posA - posB;
  });

  // Deduplicate: remove blocks that are fully contained within another block
  const deduped: RawBlock[] = [];
  for (const block of blocks) {
    const blockStart = html.indexOf(block.fullMatch);
    const blockEnd = blockStart + block.fullMatch.length;

    let isContained = false;
    for (const existing of deduped) {
      const existingStart = html.indexOf(existing.fullMatch);
      const existingEnd = existingStart + existing.fullMatch.length;

      if (
        blockStart >= existingStart &&
        blockEnd <= existingEnd &&
        block.fullMatch !== existing.fullMatch
      ) {
        isContained = true;
        break;
      }
    }

    if (!isContained) {
      deduped.push(block);
    }
  }

  return deduped;
}

// ── Nav and Footer Link Extraction ────────────────────────────────────────────

/**
 * Extract navigation links from all <nav> elements in the HTML.
 */
function extractNavLinks(html: string): string[] {
  const links: string[] = [];
  const navRe = /<nav[\s>][\s\S]*?<\/nav>/gi;
  let match: RegExpExecArray | null;

  while ((match = navRe.exec(html)) !== null) {
    links.push(...extractLinks(match[0]));
  }

  // Also check divs with role="navigation"
  const roleNavRe = /<div\s[^>]*role\s*=\s*(?:"navigation"|'navigation')[^>]*>[\s\S]*?<\/div>/gi;
  while ((match = roleNavRe.exec(html)) !== null) {
    links.push(...extractLinks(match[0]));
  }

  // Deduplicate
  return [...new Set(links)];
}

/**
 * Extract footer links from all <footer> elements in the HTML.
 */
function extractFooterLinks(html: string): string[] {
  const links: string[] = [];
  const footerRe = /<footer[\s>][\s\S]*?<\/footer>/gi;
  let match: RegExpExecArray | null;

  while ((match = footerRe.exec(html)) !== null) {
    links.push(...extractLinks(match[0]));
  }

  // Also check divs with role="contentinfo"
  const roleFooterRe =
    /<div\s[^>]*role\s*=\s*(?:"contentinfo"|'contentinfo')[^>]*>[\s\S]*?<\/div>/gi;
  while ((match = roleFooterRe.exec(html)) !== null) {
    links.push(...extractLinks(match[0]));
  }

  // Deduplicate
  return [...new Set(links)];
}

// ── Main Export ───────────────────────────────────────────────────────────────

/**
 * Analyze the structural layout of an HTML page without any API calls.
 *
 * Extracts semantic sections, classifies each into a ComponentCategory,
 * and gathers navigation and footer links -- all via regex-based parsing.
 */
export function analyzeHtmlStructure(html: string, page: DiscoveredPage): PageStructure {
  const rawBlocks = extractTopLevelBlocks(html);

  let isFirstContentSection = true;

  const sections: HtmlSection[] = rawBlocks.map((block, index) => {
    const classes = extractClasses(block.openingTag);
    const headingText = extractFirstHeading(block.innerHtml);
    const hasImages = /<img\b/i.test(block.innerHtml);
    const hasForm = /<form[\s>]/i.test(block.innerHtml);
    const childCount = estimateChildCount(block.innerHtml);
    const backgroundHint = detectBackgroundHint(block.openingTag, classes);

    // Determine if this is the first non-nav, non-header section for Hero classification
    const isFirst = isFirstContentSection && block.tag !== "nav" && block.tag !== "footer";

    // Only the first qualifying section gets the "first section" flag
    const estimatedCategory = classifySection(
      block.tag,
      block.innerHtml,
      headingText,
      hasImages,
      hasForm,
      isFirst,
      classes
    );

    // Once we have classified a non-nav, non-footer section, no longer "first"
    if (block.tag !== "nav" && block.tag !== "footer") {
      isFirstContentSection = false;
    }

    return {
      index,
      tag: block.tag,
      headingText,
      estimatedCategory,
      hasImages,
      hasForm,
      childCount,
      cssClasses: classes,
      backgroundHint,
    };
  });

  const navigationLinks = extractNavLinks(html);
  const footerLinks = extractFooterLinks(html);

  return {
    page,
    sections,
    navigationLinks,
    footerLinks,
  };
}
