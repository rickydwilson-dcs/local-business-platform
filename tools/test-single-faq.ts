#!/usr/bin/env tsx

/**
 * Test FAQ extraction on a single file
 */

import { readFileSync } from "fs";
import { join } from "path";

const testFile = join(
  process.cwd(),
  "sites/dj-fox-electrical/content/services/access-control-systems.mdx"
);
const content = readFileSync(testFile, "utf-8");

// Extract FAQ section
const faqSectionRegex = /## Frequently Asked Questions\n+([\s\S]*?)(?=\n## |$)/;
const match = content.match(faqSectionRegex);

if (!match) {
  console.log("No FAQ section found");
  process.exit(1);
}

console.log("Found FAQ section:");
console.log("─".repeat(80));
console.log(match[0].substring(0, 500));
console.log("...");
console.log("─".repeat(80));

const faqSection = match[1];

// Extract Q&A pairs
const qaRegex = /\*\*Q:\s*([^\*]+?)\*\*\n+A:\s*([^\n]+(?:\n(?!\n|\*\*Q:)[^\n]+)*)/g;

const faqs = [];
let qaMatch;
while ((qaMatch = qaRegex.exec(faqSection)) !== null) {
  const question = qaMatch[1].trim();
  const answer = qaMatch[2].trim().replace(/\n+/g, " ");

  faqs.push({ question, answer });
}

console.log(`\nExtracted ${faqs.length} FAQs:\n`);

for (let i = 0; i < faqs.length; i++) {
  console.log(`${i + 1}. Q: ${faqs[i].question}`);
  console.log(
    `   A: ${faqs[i].answer.substring(0, 100)}${faqs[i].answer.length > 100 ? "..." : ""}\n`
  );
}
