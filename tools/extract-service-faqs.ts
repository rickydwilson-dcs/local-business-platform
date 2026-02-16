#!/usr/bin/env tsx

/**
 * Extract FAQs from markdown content and convert to frontmatter structure
 *
 * This script:
 * 1. Reads each service MDX file
 * 2. Parses markdown FAQ section (looks for "## Frequently Asked Questions")
 * 3. Extracts Q&A pairs from markdown
 * 4. Converts to YAML frontmatter structure
 * 5. Removes FAQ section from body
 * 6. Writes updated file
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

interface FAQ {
  question: string;
  answer: string;
}

/**
 * Extract FAQs from markdown content
 */
function extractFAQs(content: string): { faqs: FAQ[]; remainingContent: string } {
  const faqs: FAQ[] = [];

  // Find the FAQ section - match everything from header until next ## section or end
  const faqSectionRegex = /## Frequently Asked Questions\n+([\s\S]*?)(?=\n## |$)/;
  const match = content.match(faqSectionRegex);

  if (!match) {
    console.log("  ⚠️  No FAQ section found");
    return { faqs: [], remainingContent: content };
  }

  const faqSection = match[1];

  // Extract Q&A pairs
  // Pattern: **Q: question**
  // Followed by A: answer (possibly multi-line)
  // Blank lines separate Q&A pairs
  const qaRegex = /\*\*Q:\s*([^\*]+?)\*\*\n+A:\s*([^\n]+(?:\n(?!\n|\*\*Q:)[^\n]+)*)/g;

  let qaMatch;
  while ((qaMatch = qaRegex.exec(faqSection)) !== null) {
    const question = qaMatch[1].trim();
    const answer = qaMatch[2].trim().replace(/\n+/g, " "); // Join multi-line answers with space

    faqs.push({
      question,
      answer,
    });
  }

  // Remove the entire FAQ section from content
  const remainingContent = content.replace(faqSectionRegex, "").trim();

  return { faqs, remainingContent };
}

/**
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content: string): { frontmatter: string; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error("No frontmatter found");
  }

  return {
    frontmatter: match[1],
    body: match[2],
  };
}

/**
 * Convert FAQs to YAML format
 */
function faqsToYaml(faqs: FAQ[]): string {
  if (faqs.length === 0) return "";

  let yaml = "faqs:\n";

  for (const faq of faqs) {
    // Escape quotes in question and answer
    const question = faq.question.replace(/"/g, '\\"');
    const answer = faq.answer.replace(/"/g, '\\"');

    yaml += `  - question: "${question}"\n`;
    yaml += `    answer: "${answer}"\n`;
  }

  return yaml;
}

/**
 * Process a single MDX file
 */
function processFile(filePath: string): void {
  console.log(`\nProcessing: ${filePath}`);

  try {
    // Read file
    const content = readFileSync(filePath, "utf-8");

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(content);

    // Extract FAQs from body
    const { faqs, remainingContent } = extractFAQs(body);

    if (faqs.length === 0) {
      console.log("  ⚠️  No FAQs extracted, skipping file");
      return;
    }

    console.log(`  ✓ Extracted ${faqs.length} FAQs`);

    // Validate FAQ count
    if (faqs.length < 3) {
      console.log(`  ⚠️  Warning: Only ${faqs.length} FAQs (schema requires min 3)`);
    }
    if (faqs.length > 15) {
      console.log(`  ⚠️  Warning: ${faqs.length} FAQs (schema recommends max 15)`);
    }

    // Convert FAQs to YAML
    const faqYaml = faqsToYaml(faqs);

    // Reconstruct file with FAQs in frontmatter
    const newFrontmatter = `${frontmatter}\n${faqYaml}`;
    const newContent = `---\n${newFrontmatter}---\n\n${remainingContent.trim()}\n`;

    // Write file
    writeFileSync(filePath, newContent, "utf-8");
    console.log("  ✓ File updated successfully");
  } catch (error) {
    console.error(
      `  ✗ Error processing file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Main execution
 */
async function main() {
  const servicesDir = join(process.cwd(), "sites/dj-fox-electrical/content/services");

  console.log("🔍 Finding service MDX files...");

  // Get all service MDX files
  const files = await glob("*.mdx", { cwd: servicesDir, absolute: true });

  console.log(`\nFound ${files.length} service files\n`);
  console.log("─".repeat(80));

  // Process each file
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      processFile(file);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`\n✗ Failed to process ${file}: ${error}`);
    }
  }

  console.log("\n" + "─".repeat(80));
  console.log(`\n✓ Processed ${successCount} files successfully`);
  if (errorCount > 0) {
    console.log(`✗ ${errorCount} files had errors`);
  }
  console.log("\n");
}

main().catch(console.error);
