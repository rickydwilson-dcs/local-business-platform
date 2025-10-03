#!/usr/bin/env ts-node
/**
 * Extract current serviceDataMap from app/services/[slug]/page.tsx
 * and save as baseline JSON for comparison testing
 */

import fs from "fs";
import path from "path";

const SNAPSHOT_DIR = path.join(process.cwd(), "scripts", "migration-snapshots");
const SERVICE_PAGE_PATH = path.join(process.cwd(), "app", "services", "[slug]", "page.tsx");

interface ServiceData {
  title: string;
  description: string;
  badge?: string;
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  heroImage?: string;
  galleryImages?: string[];
  businessHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  localContact?: {
    phone: string;
    email: string;
    address?: string;
  };
}

/**
 * Extract serviceDataMap by parsing the TypeScript file
 * Note: This is a simplified extraction - for production, consider using TypeScript AST
 */
function extractServiceDataMap(): Record<string, ServiceData> {
  const fileContent = fs.readFileSync(SERVICE_PAGE_PATH, "utf-8");

  // Find the serviceDataMap object
  const mapStart = fileContent.indexOf("const serviceDataMap: Record<string, ServiceData> = {");
  const mapEnd = fileContent.indexOf("};", mapStart);

  if (mapStart === -1 || mapEnd === -1) {
    throw new Error("Could not find serviceDataMap in page.tsx");
  }

  // Extract the map content
  const mapContent = fileContent.substring(mapStart, mapEnd + 2);

  console.log("⚠️  Manual extraction required.");
  console.log("The serviceDataMap is too complex for simple regex parsing.\n");
  console.log("Please manually copy the serviceDataMap to migration-snapshots/baseline.json\n");
  console.log("Location: app/services/[slug]/page.tsx:62-755\n");

  return {};
}

/**
 * Save baseline snapshot
 */
function saveBaseline(data: Record<string, ServiceData>) {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }

  const baselinePath = path.join(SNAPSHOT_DIR, "baseline.json");
  fs.writeFileSync(baselinePath, JSON.stringify(data, null, 2));

  console.log(`✅ Baseline saved to: ${baselinePath}`);
  console.log(`   Services extracted: ${Object.keys(data).length}`);
}

/**
 * Generate service inventory report
 */
function generateInventory() {
  const contentDir = path.join(process.cwd(), "content", "services");
  const mdxFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  console.log("\n📋 Current Service Inventory:");
  console.log("=".repeat(60));
  console.log(`MDX files in content/services/: ${mdxFiles.length}`);
  console.log("\nServices:");

  mdxFiles.forEach((file, idx) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(contentDir, file);
    const stat = fs.statSync(filePath);
    console.log(`  ${idx + 1}. ${slug} (${stat.size} bytes)`);
  });

  console.log("=".repeat(60) + "\n");

  return mdxFiles.map((f) => f.replace(".mdx", ""));
}

// Main execution
if (require.main === module) {
  console.log("🔍 Service Data Extraction Tool\n");

  // Generate inventory
  const existingSlugs = generateInventory();

  console.log(`Found ${existingSlugs.length} existing MDX files`);
  console.log("\nNext steps:");
  console.log("1. We need to create a JSON representation of serviceDataMap");
  console.log("2. This will serve as our baseline for comparison testing");
  console.log("3. After migration, we'll compare MDX output to this baseline\n");
}

export { extractServiceDataMap, saveBaseline };
