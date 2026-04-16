/**
 * Diagnostic: Extract sections from a clone HTML file and report what enrichment would produce.
 * Usage: npx tsx tools/diagnose-clone-sections.ts --clone corvus [--verbose]
 */

import * as path from "path";
import { extractCloneSections, correlateWithBlueprints } from "./lib/clone-section-extractor";
import type { SectionBlueprint, ComponentCategory } from "./lib/reference-analysis-types";

const args = process.argv.slice(2);
const cloneFlag = args.indexOf("--clone");
if (cloneFlag === -1 || !args[cloneFlag + 1]) {
  console.error("Usage: npx tsx tools/diagnose-clone-sections.ts --clone <name> [--verbose]");
  process.exit(1);
}

const cloneName = args[cloneFlag + 1];
const verbose = args.includes("--verbose");
const cloneDir = path.resolve(__dirname, "..", "output", "clones", cloneName);
const htmlPath = path.join(cloneDir, "html", "pages", "home.html");
const cssDir = path.join(cloneDir, "assets", "css");

console.log(`\n=== Clone Section Diagnostic: ${cloneName} ===\n`);
console.log(`HTML: ${htmlPath}`);
console.log(`CSS:  ${cssDir}\n`);

// Step 1: Extract sections with content signals
const sections = extractCloneSections(htmlPath);

console.log(`--- Extracted ${sections.length} sections ---\n`);
console.log(
  "Idx  | Tag       | Category       | Heading                          | Chars  | Spacer | Form | Imgs | Headings"
);
console.log(
  "-----|-----------|----------------|----------------------------------|--------|--------|------|------|--------"
);

for (const s of sections) {
  const heading = (s.headingText || "[none]").slice(0, 32).padEnd(32);
  const tag = s.tag.padEnd(9);
  const category = (s.estimatedCategory ?? "?").padEnd(14);
  const chars = String(s.charCount).padStart(6);
  const spacer = s.isSpacerLike ? "yes" : "no ";
  const form = s.hasForm ? "yes" : "no ";
  const imgs = String(s.imageCount ?? 0).padStart(4);
  const isMega = s.charCount > 5000 && (s.headingCandidates?.length ?? 0) >= 3;
  const headingCount = `${s.headingCandidates?.length ?? 0}${isMega ? " (MEGA)" : ""}`;
  console.log(
    `${String(s.index).padStart(4)} | ${tag} | ${category} | ${heading} | ${chars} | ${spacer.padEnd(6)} | ${form.padEnd(4)} | ${imgs} | ${headingCount}`
  );
}

// Step 2: Simulate blueprint correlation
const corvusComponents: Array<{
  name: string;
  fileName: string;
  category: ComponentCategory;
  purpose: string;
  contentSlots: string[];
}> = [
  {
    name: "NavDarkBand",
    fileName: "nav-dark-band.tsx",
    category: "Navigation",
    purpose: "Main navigation bar with dark background",
    contentSlots: ["logo", "navLinks", "ctaButton"],
  },
  {
    name: "HeroHeadlineColoured",
    fileName: "hero-headline-coloured.tsx",
    category: "Hero",
    purpose: "Hero section with coloured headline and call to action",
    contentSlots: ["heading", "subheading", "ctaButtons", "backgroundImage"],
  },
  {
    name: "HeroEventBanner",
    fileName: "hero-event-banner.tsx",
    category: "Hero",
    purpose: "Event promotion banner with date and call to action",
    contentSlots: ["heading", "eventDate", "ctaButton"],
  },
  {
    name: "CtaYellowBand",
    fileName: "cta-yellow-band.tsx",
    category: "CTA",
    purpose: "Call to action band with yellow background",
    contentSlots: ["heading", "subheading", "ctaButton"],
  },
  {
    name: "CtaBlueBand",
    fileName: "cta-blue-band.tsx",
    category: "CTA",
    purpose: "Call to action band with blue background",
    contentSlots: ["heading", "subheading", "ctaButton"],
  },
  {
    name: "CtaGreenBand",
    fileName: "cta-green-band.tsx",
    category: "CTA",
    purpose: "Call to action band with green background",
    contentSlots: ["heading", "subheading", "ctaButton"],
  },
  {
    name: "BlogCardGrid",
    fileName: "blog-card-grid.tsx",
    category: "Blog",
    purpose: "Grid of blog post cards with images and excerpts",
    contentSlots: ["heading", "blogCards", "viewAllLink"],
  },
  {
    name: "AboutSplitDark",
    fileName: "about-split-dark.tsx",
    category: "Content",
    purpose: "About section with split layout and dark background",
    contentSlots: ["heading", "bodyText", "image", "ctaButton"],
  },
  {
    name: "GalleryPhotoStrip",
    fileName: "gallery-photo-strip.tsx",
    category: "Social Proof",
    purpose: "Photo gallery strip showcasing work and projects",
    contentSlots: ["heading", "galleryImages"],
  },
  {
    name: "NewsletterDarkBand",
    fileName: "newsletter-dark-band.tsx",
    category: "CTA",
    purpose: "Newsletter subscription form with dark background",
    contentSlots: ["heading", "subheading", "emailInput", "submitButton"],
  },
  {
    name: "FooterMultiColumn",
    fileName: "footer-multi-column.tsx",
    category: "Footer",
    purpose: "Footer with multiple columns of links and contact info",
    contentSlots: ["logo", "navColumns", "contactInfo", "socialLinks", "copyright"],
  },
];

const mockBlueprints: SectionBlueprint[] = corvusComponents.map((c) => ({
  id: c.fileName.replace(".tsx", ""),
  name: c.name,
  category: c.category,
  purpose: c.purpose,
  layoutPattern: "unknown",
  contentSlots: c.contentSlots,
  interactionNeeds: "none" as const,
  componentFileName: c.fileName,
  componentExportName: c.name,
  tokenUsageHints: [],
  confidence: "medium" as const,
  referenceSection: c.name,
}));

console.log(`\n--- Blueprint Correlation ---\n`);

const enriched = correlateWithBlueprints(sections, mockBlueprints, cssDir);

console.log("");
console.log(
  "Blueprint                | Match | Idx | Score | Breakdown                              | Confidence"
);
console.log(
  "-------------------------|-------|-----|-------|----------------------------------------|----------"
);

let enrichedCount = 0;
let emptyCount = 0;
const confidenceCounts = { high: 0, medium: 0, low: 0, none: 0 };
const unmatchedReasons: string[] = [];

for (const bp of enriched) {
  const hasHtml = !!bp.cloneHtmlFragment;
  if (hasHtml) enrichedCount++;
  else emptyCount++;

  const confidence = bp.matchConfidenceLevel ?? "none";
  confidenceCounts[confidence]++;

  const name = bp.name.padEnd(24);
  const matched = hasHtml ? "YES  " : "NO   ";
  const idx =
    bp.sectionIndex !== undefined && hasHtml ? String(bp.sectionIndex).padStart(3) : "  —";
  const score = bp.matchScore !== undefined ? String(bp.matchScore).padStart(5) : "    —";
  const breakdown = (bp.matchBreakdown ?? "—").padEnd(38);
  const conf = confidence.padEnd(10);
  console.log(`${name} | ${matched} | ${idx} | ${score} | ${breakdown} | ${conf}`);

  if (!hasHtml) {
    unmatchedReasons.push(`  ${bp.name}: ${bp.matchBreakdown ?? "unknown"}`);
  }
}

// Verbose: show top-3 candidates per blueprint
if (verbose) {
  console.log(`\n--- Verbose: Top-3 Candidates per Blueprint ---\n`);
  for (const bp of mockBlueprints) {
    const scores: Array<{ index: number; total: number; breakdown: string }> = [];
    for (const section of sections) {
      // We can't call the private scoreMatch directly, so re-import it
      // Instead, we approximate by reading the enriched data
      // For true verbose, we need scoreMatch exported — but for now,
      // show the matched section info
    }
    const enrichedBp = enriched.find((e) => e.name === bp.name);
    console.log(
      `${bp.name}: matched=${enrichedBp?.cloneHtmlFragment ? "yes" : "no"} idx=${enrichedBp?.sectionIndex ?? "—"} score=${enrichedBp?.matchScore ?? "—"} (${enrichedBp?.matchBreakdown ?? "—"})`
    );
  }
}

// Summary
console.log(`\n--- Summary ---`);
console.log(`Total sections extracted:    ${sections.length}`);
console.log(`Total blueprints:            ${mockBlueprints.length}`);
console.log(`Blueprints matched (HTML):   ${enrichedCount}`);
console.log(`Blueprints unmatched:        ${emptyCount}`);
console.log(
  `Enrichment rate:             ${Math.round((enrichedCount / mockBlueprints.length) * 100)}%`
);
console.log(
  `Average confidence:          high: ${confidenceCounts.high}, medium: ${confidenceCounts.medium}, low: ${confidenceCounts.low}, none: ${confidenceCounts.none}`
);

// Mega-section warnings
const megaSections = sections.filter(
  (s) => s.charCount > 5000 && (s.headingCandidates?.length ?? 0) >= 3
);
if (megaSections.length > 0) {
  console.log(`\nMega-sections (>5000 chars, 3+ headings):`);
  for (const ms of megaSections) {
    const claimedByBp = enriched.find((bp) => bp.sectionIndex === ms.index && bp.cloneHtmlFragment);
    console.log(
      `  Section ${ms.index}: ${ms.charCount} chars, ${ms.headingCandidates?.length ?? 0} headings → ${claimedByBp ? `claimed by ${claimedByBp.name}` : "unclaimed"}`
    );
  }
}

if (unmatchedReasons.length > 0) {
  console.log(`\nUnmatched blueprint reasons:`);
  for (const reason of unmatchedReasons) {
    console.log(reason);
  }
}

console.log("");
