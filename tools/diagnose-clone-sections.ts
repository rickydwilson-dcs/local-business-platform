/**
 * Diagnostic: Extract sections from a clone HTML file and report what enrichment would produce.
 * Usage: npx tsx tools/diagnose-clone-sections.ts --clone corvus
 */

import * as path from "path";
import { extractCloneSections, correlateWithBlueprints } from "./lib/clone-section-extractor";
import type { SectionBlueprint, ComponentCategory } from "./lib/reference-analysis-types";

const args = process.argv.slice(2);
const cloneFlag = args.indexOf("--clone");
if (cloneFlag === -1 || !args[cloneFlag + 1]) {
  console.error("Usage: npx tsx tools/diagnose-clone-sections.ts --clone <name>");
  process.exit(1);
}

const cloneName = args[cloneFlag + 1];
const cloneDir = path.resolve(__dirname, "..", "output", "clones", cloneName);
const htmlPath = path.join(cloneDir, "html", "pages", "home.html");
const cssDir = path.join(cloneDir, "assets", "css");

console.log(`\n=== Clone Section Diagnostic: ${cloneName} ===\n`);
console.log(`HTML: ${htmlPath}`);
console.log(`CSS:  ${cssDir}\n`);

// Step 1: Extract sections
const sections = extractCloneSections(htmlPath);

console.log(`--- Extracted ${sections.length} sections ---\n`);
console.log(
  "Idx | Tag       | Heading                                          | HTML chars | First 3 classes"
);
console.log(
  "----|-----------|--------------------------------------------------|------------|----------------"
);

for (const s of sections) {
  const heading = (s.headingText || "[no heading]").padEnd(48);
  const tag = s.tag.padEnd(9);
  const chars = String(s.html.length).padStart(10);
  const classes = s.cssClasses.slice(0, 3).join(", ") || "(none)";
  console.log(`${String(s.index).padStart(3)} | ${tag} | ${heading} | ${chars} | ${classes}`);
}

// Step 2: Simulate blueprint correlation
const corvusComponents: Array<{ name: string; fileName: string; category: ComponentCategory }> = [
  { name: "NavDarkBand", fileName: "nav-dark-band.tsx", category: "Navigation" },
  { name: "HeroHeadlineColoured", fileName: "hero-headline-coloured.tsx", category: "Hero" },
  { name: "HeroEventBanner", fileName: "hero-event-banner.tsx", category: "Hero" },
  { name: "CtaYellowBand", fileName: "cta-yellow-band.tsx", category: "CTA" },
  { name: "CtaBlueBand", fileName: "cta-blue-band.tsx", category: "CTA" },
  { name: "CtaGreenBand", fileName: "cta-green-band.tsx", category: "CTA" },
  { name: "BlogCardGrid", fileName: "blog-card-grid.tsx", category: "Blog" },
  { name: "AboutSplitDark", fileName: "about-split-dark.tsx", category: "Content" },
  { name: "GalleryPhotoStrip", fileName: "gallery-photo-strip.tsx", category: "Social Proof" },
  { name: "NewsletterDarkBand", fileName: "newsletter-dark-band.tsx", category: "CTA" },
  { name: "FooterMultiColumn", fileName: "footer-multi-column.tsx", category: "Footer" },
];

const mockBlueprints: SectionBlueprint[] = corvusComponents.map((c) => ({
  id: c.fileName.replace(".tsx", ""),
  name: c.name,
  category: c.category,
  purpose: `${c.name} component`,
  layoutPattern: "unknown",
  contentSlots: [],
  interactionNeeds: "none" as const,
  componentFileName: c.fileName,
  componentExportName: c.name,
  tokenUsageHints: [],
  confidence: "medium" as const,
  referenceSection: c.name,
}));

console.log(`\n--- Blueprint Correlation ---\n`);

const enriched = correlateWithBlueprints(sections, mockBlueprints, cssDir);

let enrichedCount = 0;
let emptyCount = 0;

console.log("Blueprint                | Matched? | Section Idx | HTML fragment size");
console.log("-------------------------|----------|-------------|-------------------");

for (const bp of enriched) {
  const hasHtml = !!bp.cloneHtmlFragment;
  if (hasHtml) enrichedCount++;
  else emptyCount++;

  const name = bp.name.padEnd(24);
  const matched = hasHtml ? "YES     " : "NO      ";
  const idx = bp.sectionIndex !== undefined ? String(bp.sectionIndex).padStart(11) : "          -";
  const size = hasHtml ? String(bp.cloneHtmlFragment!.length).padStart(18) : "                 -";
  console.log(`${name} | ${matched} | ${idx} | ${size}`);
}

console.log(`\n--- Summary ---`);
console.log(`Total sections extracted:    ${sections.length}`);
console.log(`Total blueprints:            ${mockBlueprints.length}`);
console.log(`Blueprints enriched (HTML):  ${enrichedCount}`);
console.log(`Blueprints left empty:       ${emptyCount}`);
console.log(
  `Enrichment rate:             ${Math.round((enrichedCount / mockBlueprints.length) * 100)}%\n`
);
