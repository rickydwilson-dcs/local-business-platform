#!/usr/bin/env ts-node
/**
 * Service Migration Testing Script
 *
 * This script validates that migrated MDX-first services produce identical output
 * to the current serviceDataMap implementation.
 *
 * Usage:
 *   npm run test:migration -- --phase [snapshot|compare|validate]
 */

import fs from "fs";
import path from "path";

interface ServiceSnapshot {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  heroImage?: string;
  galleryImages?: string[];
  businessHours?: Record<string, string>;
  localContact?: {
    phone: string;
    email: string;
    address?: string;
  };
}

interface ComparisonResult {
  slug: string;
  passed: boolean;
  differences: string[];
}

const SNAPSHOT_DIR = path.join(process.cwd(), "scripts", "migration-snapshots");

/**
 * Create snapshot directory if it doesn't exist
 */
function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
}

/**
 * Save current serviceDataMap state as baseline
 */
export function createBaseline(serviceData: Record<string, ServiceSnapshot>) {
  ensureSnapshotDir();
  const baselinePath = path.join(SNAPSHOT_DIR, "baseline.json");
  fs.writeFileSync(baselinePath, JSON.stringify(serviceData, null, 2));
  console.log(`✅ Baseline snapshot saved: ${baselinePath}`);
  console.log(`   Total services: ${Object.keys(serviceData).length}`);
}

/**
 * Compare MDX-parsed data against baseline
 */
export function compareWithBaseline(mdxData: Record<string, ServiceSnapshot>): ComparisonResult[] {
  const baselinePath = path.join(SNAPSHOT_DIR, "baseline.json");

  if (!fs.existsSync(baselinePath)) {
    throw new Error("Baseline snapshot not found. Run with --phase snapshot first.");
  }

  const baseline: Record<string, ServiceSnapshot> = JSON.parse(
    fs.readFileSync(baselinePath, "utf-8")
  );

  const results: ComparisonResult[] = [];

  // Check all baseline services exist in MDX
  for (const [slug, baselineService] of Object.entries(baseline)) {
    const mdxService = mdxData[slug];
    const differences: string[] = [];

    if (!mdxService) {
      results.push({
        slug,
        passed: false,
        differences: ["Service missing in MDX migration"],
      });
      continue;
    }

    // Compare each field
    if (baselineService.title !== mdxService.title) {
      differences.push(`Title mismatch: "${baselineService.title}" vs "${mdxService.title}"`);
    }

    if (baselineService.description !== mdxService.description) {
      differences.push(
        `Description mismatch (lengths: ${baselineService.description.length} vs ${mdxService.description.length})`
      );
    }

    if (baselineService.badge !== mdxService.badge) {
      differences.push(`Badge mismatch: "${baselineService.badge}" vs "${mdxService.badge}"`);
    }

    if (baselineService.heroImage !== mdxService.heroImage) {
      differences.push(
        `Hero image mismatch: "${baselineService.heroImage}" vs "${mdxService.heroImage}"`
      );
    }

    // Compare arrays
    if (baselineService.benefits.length !== mdxService.benefits.length) {
      differences.push(
        `Benefits count mismatch: ${baselineService.benefits.length} vs ${mdxService.benefits.length}`
      );
    } else {
      baselineService.benefits.forEach((benefit, idx) => {
        if (benefit !== mdxService.benefits[idx]) {
          differences.push(`Benefit ${idx + 1} differs`);
        }
      });
    }

    if (baselineService.faqs.length !== mdxService.faqs.length) {
      differences.push(
        `FAQs count mismatch: ${baselineService.faqs.length} vs ${mdxService.faqs.length}`
      );
    } else {
      baselineService.faqs.forEach((faq, idx) => {
        if (
          faq.question !== mdxService.faqs[idx]?.question ||
          faq.answer !== mdxService.faqs[idx]?.answer
        ) {
          differences.push(`FAQ ${idx + 1} differs`);
        }
      });
    }

    results.push({
      slug,
      passed: differences.length === 0,
      differences,
    });
  }

  // Check for extra services in MDX not in baseline
  for (const slug of Object.keys(mdxData)) {
    if (!baseline[slug]) {
      results.push({
        slug,
        passed: false,
        differences: ["Service exists in MDX but not in baseline"],
      });
    }
  }

  return results;
}

/**
 * Generate comparison report
 */
export function generateReport(results: ComparisonResult[]): void {
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  console.log("\n" + "=".repeat(60));
  console.log("SERVICE MIGRATION VALIDATION REPORT");
  console.log("=".repeat(60));
  console.log(`Total Services: ${results.length}`);
  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log("=".repeat(60) + "\n");

  if (failed.length > 0) {
    console.log("FAILURES:\n");
    failed.forEach((result) => {
      console.log(`❌ ${result.slug}`);
      result.differences.forEach((diff) => {
        console.log(`   - ${diff}`);
      });
      console.log("");
    });
  }

  if (passed.length > 0) {
    console.log(`\n✅ PASSED (${passed.length} services):`);
    passed.forEach((result) => {
      console.log(`   ✓ ${result.slug}`);
    });
  }

  // Save report
  const reportPath = path.join(SNAPSHOT_DIR, "comparison-report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        passed,
        failed,
        summary: { total: results.length, passed: passed.length, failed: failed.length },
      },
      null,
      2
    )
  );
  console.log(`\n📄 Full report saved: ${reportPath}\n`);

  // Exit with error if any failures
  if (failed.length > 0) {
    process.exit(1);
  }
}

/**
 * Validate HTML output matches between old and new
 */
export async function validateHTMLOutput(slug: string): Promise<boolean> {
  // This would require actually rendering the pages and comparing HTML
  // For now, we'll focus on data comparison
  console.log(`Would validate HTML output for: ${slug}`);
  return true;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const phase = args[args.indexOf("--phase") + 1];

  console.log(`Running migration test - Phase: ${phase || "not specified"}\n`);

  if (!phase) {
    console.error("Usage: npm run test:migration -- --phase [snapshot|compare|validate]");
    process.exit(1);
  }

  // Implementation will be added after extracting serviceDataMap
  console.log("Test framework ready. Implementation pending serviceDataMap extraction.");
}
