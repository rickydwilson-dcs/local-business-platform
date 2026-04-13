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
import { extractTopLevelBlocks } from "./html-structure-analyzer";
import { extractRelevantCssForSection } from "./clone-css-rule-extractor";

export interface CloneSection {
  index: number;
  tag: string;
  headingText?: string;
  html: string; // the full HTML of this section
  cssClasses: string[];
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

  return blocks.map((block, index) => {
    // Extract heading text
    const headingMatch = block.innerHtml.match(/<h[1-3][^>]*>([^<]+)</i);
    const headingText = headingMatch ? headingMatch[1].trim().slice(0, 80) : undefined;

    // Extract CSS classes from the opening tag
    const classMatch = block.openingTag.match(/class="([^"]*)"/);
    const cssClasses = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];

    return {
      index,
      tag: block.tag,
      headingText,
      html: block.fullMatch,
      cssClasses,
    };
  });
}

/**
 * Correlate vision analysis blueprints with clone HTML sections.
 * Enriches each blueprint with cloneHtmlFragment and cloneRelevantCss.
 *
 * Matching strategy:
 * 1. Match by heading text (fuzzy — case-insensitive substring)
 * 2. Fall back to index order (vision sections are top-to-bottom)
 */
export function correlateWithBlueprints(
  sections: CloneSection[],
  blueprints: SectionBlueprint[],
  cssDir: string
): SectionBlueprint[] {
  const usedSectionIndices = new Set<number>();

  return blueprints.map((blueprint, bpIndex) => {
    // Try heading-text match first
    let matched: CloneSection | undefined;

    if (blueprint.name) {
      const bpName = blueprint.name.toLowerCase();
      matched = sections.find((s, i) => {
        if (usedSectionIndices.has(i)) return false;
        if (!s.headingText) return false;
        return (
          s.headingText.toLowerCase().includes(bpName) ||
          bpName.includes(s.headingText.toLowerCase())
        );
      });
    }

    // Fall back to index order
    if (!matched) {
      // Skip header/nav sections (index 0 is often a <header>)
      const contentSections = sections.filter((s) => s.tag === "section");
      if (bpIndex < contentSections.length) {
        const candidate = contentSections[bpIndex];
        if (candidate && !usedSectionIndices.has(candidate.index)) {
          matched = candidate;
        }
      }
    }

    if (matched) {
      usedSectionIndices.add(matched.index);

      // Extract relevant CSS for this section
      const relevantCss = extractRelevantCssForSection(matched.html, cssDir);

      return {
        ...blueprint,
        cloneHtmlFragment: matched.html,
        cloneRelevantCss: relevantCss,
        sectionIndex: matched.index,
      };
    }

    return { ...blueprint, sectionIndex: bpIndex };
  });
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
