/**
 * Clone Section Extractor
 *
 * Extracts top-level HTML sections from clone pages and correlates
 * them with vision analysis blueprints. Each blueprint gets enriched
 * with its corresponding HTML fragment and relevant CSS rules.
 */

import * as fs from "fs";
import * as path from "path";
import type { SectionBlueprint } from "./reference-analysis-types";
import type { ComponentCategory } from "../../packages/theme-system/src/types";
import { extractTopLevelBlocks, classifySection, countImages } from "./html-structure-analyzer";
import { extractRelevantCssForSection } from "./clone-css-rule-extractor";

export interface CloneSection {
  index: number;
  tag: string;
  headingText?: string;
  html: string; // the full HTML of this section
  cssClasses: string[];
  // Content-signal fields for source-agnostic correlation:
  estimatedCategory?: ComponentCategory;
  hasForm?: boolean;
  hasImages?: boolean;
  imageCount?: number;
  charCount: number;
  headingCandidates?: string[]; // all h1-h6 texts, not just first
  isSpacerLike?: boolean;
}

/**
 * Extract top-level HTML sections from a clone HTML page.
 */
export function extractCloneSections(htmlPath: string): CloneSection[] {
  const html = fs.readFileSync(htmlPath, "utf-8");

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  // Use the html-structure-analyzer's block extraction
  const blocks = extractTopLevelBlocks(bodyHtml);

  let isFirstContentSection = true;

  return blocks.map((block, index) => {
    // Extract heading text (first heading)
    const headingMatch = block.innerHtml.match(/<h[1-3][^>]*>([^<]+)</i);
    const headingText = headingMatch ? headingMatch[1].trim().slice(0, 80) : undefined;

    // Extract ALL heading texts (h1-h6) for correlation signals
    const headingCandidates: string[] = [];
    const allHeadingsRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    let hMatch: RegExpExecArray | null;
    while ((hMatch = allHeadingsRe.exec(block.innerHtml)) !== null) {
      const text = hMatch[1]
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (text) headingCandidates.push(text);
    }

    // Extract CSS classes from the opening tag
    const classMatch = block.openingTag.match(/class="([^"]*)"/);
    const cssClasses = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];

    // Content signal fields
    const hasForm = /<form[\s>]/i.test(block.innerHtml);
    const hasImages = /<img\b/i.test(block.innerHtml);
    const imageCount = countImages(block.innerHtml);
    const charCount = block.fullMatch.length;

    // Determine if this is the first content section for Hero classification
    const isFirst = isFirstContentSection && block.tag !== "nav" && block.tag !== "footer";

    const estimatedCategory = classifySection(
      block.tag,
      block.innerHtml,
      headingText,
      hasImages,
      hasForm,
      isFirst,
      cssClasses
    );

    // Update first-section tracking
    if (block.tag !== "nav" && block.tag !== "footer") {
      isFirstContentSection = false;
    }

    const isSpacerLike =
      charCount < 300 && !hasForm && imageCount <= 1 && headingCandidates.length === 0;

    return {
      index,
      tag: block.tag,
      headingText,
      html: block.fullMatch,
      cssClasses,
      estimatedCategory,
      hasForm,
      hasImages,
      imageCount,
      charCount,
      headingCandidates,
      isSpacerLike,
    };
  });
}

// ── Scoring Helpers ──────────────────────────────────────────────────────────

interface MatchScore {
  total: number;
  breakdown: string; // human-readable: "heading:+50, category:+30, keywords:+10"
}

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "with",
  "for",
  "of",
  "in",
  "to",
  "on",
  "is",
  "are",
  "has",
  "from",
  "that",
  "this",
  "its",
  "by",
  "as",
  "at",
]);

/**
 * Tokenise a PascalCase or camelCase name into lowercase words.
 * "CtaYellowBand" → ["cta", "yellow", "band"]
 */
function tokenizeCamelCase(name: string): string[] {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter((w) => w.length > 1);
}

/**
 * Tokenise a natural-language string into unique lowercase words, filtering stop words.
 */
function tokenizeText(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .split(/[\s\W]+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Extract keywords from a blueprint (source-agnostic — from the blueprint, not HTML).
 */
function extractBlueprintKeywords(blueprint: SectionBlueprint): Set<string> {
  const words = new Set<string>();

  // Tokenise name from PascalCase
  for (const w of tokenizeCamelCase(blueprint.name)) words.add(w);

  // Tokenise purpose, filtering stop words
  for (const w of tokenizeText(blueprint.purpose)) words.add(w);

  // Tokenise contentSlots names from camelCase
  for (const slot of blueprint.contentSlots) {
    for (const w of tokenizeCamelCase(slot)) words.add(w);
  }

  return words;
}

/**
 * Extract keywords from a section's visible text.
 */
function extractSectionKeywords(section: CloneSection): Set<string> {
  // Strip HTML tags to get visible text
  const visibleText = section.html.replace(/<[^>]*>/g, " ");
  const words = tokenizeText(visibleText);

  // Add heading candidates (lowercased)
  for (const heading of section.headingCandidates ?? []) {
    for (const w of tokenizeText(heading)) words.add(w);
  }

  return words;
}

const FORM_SLOT_KEYWORDS = new Set([
  "form",
  "input",
  "email",
  "subscribe",
  "newsletter",
  "contact",
  "submit",
]);
const IMAGE_SLOT_KEYWORDS = new Set([
  "image",
  "photo",
  "gallery",
  "logo",
  "icon",
  "background",
  "img",
]);

/**
 * Score the match between a blueprint and a section.
 * All signals are source-agnostic.
 */
function scoreMatch(blueprint: SectionBlueprint, section: CloneSection): MatchScore {
  let total = 0;
  const parts: string[] = [];
  const bpKeywords = extractBlueprintKeywords(blueprint);
  const sectionKeywords = extractSectionKeywords(section);

  // 1. Heading text match: +50 if any blueprint keyword appears in any heading candidate
  const headingCandidatesLower = (section.headingCandidates ?? []).map((h) => h.toLowerCase());
  if (headingCandidatesLower.length > 0) {
    const hasHeadingMatch = [...bpKeywords].some((kw) =>
      headingCandidatesLower.some((h) => h.includes(kw))
    );
    if (hasHeadingMatch) {
      total += 50;
      parts.push("heading:+50");
    }
  }

  // 2. Category match: +30 if blueprint.category === section.estimatedCategory
  if (blueprint.category === section.estimatedCategory) {
    total += 30;
    parts.push("category:+30");
  }

  // 3. Keyword overlap: +10 each, max +30
  let keywordOverlap = 0;
  for (const kw of bpKeywords) {
    if (sectionKeywords.has(kw) && keywordOverlap < 30) {
      keywordOverlap += 10;
    }
  }
  if (keywordOverlap > 0) {
    total += keywordOverlap;
    parts.push(`keywords:+${keywordOverlap}`);
  }

  // 4. Form shape match: +15 if blueprint has form-related contentSlots AND section has form
  const slotWords = blueprint.contentSlots.flatMap((s) => tokenizeCamelCase(s));
  const hasFormSlots = slotWords.some((w) => FORM_SLOT_KEYWORDS.has(w));
  if (hasFormSlots && section.hasForm) {
    total += 15;
    parts.push("form:+15");
  }

  // 5. Image shape match: +15 if blueprint has image-related contentSlots AND section has images
  const hasImageSlots = slotWords.some((w) => IMAGE_SLOT_KEYWORDS.has(w));
  if (hasImageSlots && section.hasImages) {
    total += 15;
    parts.push("images:+15");
  }

  // 6. Semantic tag match: +10 for Navigation↔header/nav, Footer↔footer
  if (
    (blueprint.category === "Navigation" && (section.tag === "header" || section.tag === "nav")) ||
    (blueprint.category === "Footer" && section.tag === "footer")
  ) {
    total += 10;
    parts.push("tag:+10");
  }

  // 7. Spacer penalty: -50 if section is spacer-like
  if (section.isSpacerLike) {
    total -= 50;
    parts.push("spacer:-50");
  }

  return {
    total,
    breakdown: parts.join(" "),
  };
}

function confidenceLevel(score: number): "high" | "medium" | "low" | "none" {
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  if (score >= 20) return "low";
  return "none";
}

/**
 * Correlate vision analysis blueprints with clone HTML sections.
 * Uses multi-signal scored matching: category, keywords, content shape,
 * semantic tags. All signals are source-agnostic.
 */
export function correlateWithBlueprints(
  sections: CloneSection[],
  blueprints: SectionBlueprint[],
  cssDir: string
): SectionBlueprint[] {
  const usedSectionIndices = new Set<number>();
  // Track which blueprint claimed each section (for mega-section logging)
  const claimedBy = new Map<number, string>();
  const results: SectionBlueprint[] = [];

  // Pre-compute mega-section set
  const megaSections = new Set<number>();
  for (const section of sections) {
    if (section.charCount > 5000 && (section.headingCandidates?.length ?? 0) >= 3) {
      megaSections.add(section.index);
    }
  }
  if (megaSections.size > 0) {
    console.log(
      `[extract] Mega-sections detected: ${[...megaSections].map((i) => `section ${i}`).join(", ")}`
    );
  }

  for (const blueprint of blueprints) {
    // Score all unclaimed sections
    let bestSection: CloneSection | undefined;
    let bestScore: MatchScore = { total: -Infinity, breakdown: "" };

    for (const section of sections) {
      if (usedSectionIndices.has(section.index)) continue;
      const score = scoreMatch(blueprint, section);
      if (score.total > bestScore.total) {
        bestScore = score;
        bestSection = section;
      }
    }

    // Check if the best candidate was already claimed as a mega-section
    // (This handles the case where the best unclaimed is below threshold,
    // but the actual best match was a mega-section already consumed.)
    let megaSectionBlocker: string | undefined;
    if (!bestSection || confidenceLevel(bestScore.total) === "none") {
      // Check if any claimed mega-section would have scored well
      for (const [sectionIdx, claimingBp] of claimedBy) {
        if (!megaSections.has(sectionIdx)) continue;
        const megaSection = sections.find((s) => s.index === sectionIdx);
        if (!megaSection) continue;
        const megaScore = scoreMatch(blueprint, megaSection);
        if (confidenceLevel(megaScore.total) !== "none" && megaScore.total > bestScore.total) {
          megaSectionBlocker = claimingBp;
        }
      }
    }

    const confidence = confidenceLevel(bestScore.total);

    if (bestSection && confidence !== "none") {
      // Claim this section
      usedSectionIndices.add(bestSection.index);
      claimedBy.set(bestSection.index, blueprint.name);

      const relevantCss = extractRelevantCssForSection(bestSection.html, cssDir);

      console.log(
        `[extract] ${blueprint.name} → section ${bestSection.index} (score: ${bestScore.total}, ${bestScore.breakdown}) [${confidence}]${megaSections.has(bestSection.index) ? " [MEGA]" : ""}`
      );

      results.push({
        ...blueprint,
        cloneHtmlFragment: bestSection.html,
        cloneRelevantCss: relevantCss,
        sectionIndex: bestSection.index,
        matchScore: bestScore.total,
        matchConfidenceLevel: confidence,
        matchBreakdown: bestScore.breakdown,
      });
    } else {
      // No match above threshold
      let reason: string;
      if (megaSectionBlocker) {
        reason = `best candidate section consumed as mega-section by ${megaSectionBlocker}`;
      } else if (bestSection) {
        reason = `best: section ${bestSection.index} score: ${bestScore.total}, below threshold 20`;
      } else {
        reason = "no candidate sections remaining";
      }
      console.log(`[extract] ${blueprint.name} → UNMATCHED (${reason})`);

      results.push({
        ...blueprint,
        matchScore: bestSection ? bestScore.total : undefined,
        matchConfidenceLevel: "none",
        matchBreakdown: megaSectionBlocker
          ? `mega-section consumed by ${megaSectionBlocker}`
          : bestSection
            ? `best: section ${bestSection.index} (${bestScore.total}, below threshold)`
            : "no candidates",
      });
    }
  }

  return results;
}

/**
 * Orchestrator: read clone HTML, extract sections, correlate with blueprints.
 */
export function enrichBlueprintsForPage(
  pageName: string,
  cloneDir: string,
  blueprints: SectionBlueprint[]
): SectionBlueprint[] {
  const htmlDir = path.join(cloneDir, "html", "pages");
  const cssDir = path.join(cloneDir, "assets", "css");

  // Find the HTML file for this page
  const htmlFile = path.join(htmlDir, `${pageName}.html`);
  if (!fs.existsSync(htmlFile)) {
    console.log(`[extract] No HTML file for page "${pageName}" — skipping enrichment`);
    return blueprints;
  }

  const sections = extractCloneSections(htmlFile);
  console.log(`[extract] Extracted ${sections.length} sections from ${pageName}.html`);

  return correlateWithBlueprints(sections, blueprints, cssDir);
}
