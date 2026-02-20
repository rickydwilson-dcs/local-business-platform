#!/usr/bin/env node
/**
 * Convert serviceDataMap from TypeScript to JSON
 *
 * This script helps convert the complex serviceDataMap object to valid JSON
 * by handling common TypeScript-to-JSON conversions.
 */

const fs = require("fs");
const path = require("path");

const SERVICE_PAGE_PATH = path.join(process.cwd(), "app", "services", "[slug]", "page.tsx");
const OUTPUT_PATH = path.join(process.cwd(), "scripts", "migration-snapshots", "baseline.json");

// Location groups for FAQ generation (copied from source)
const locationGroups = [
  { locations: "Brighton, Lewes, Eastbourne", county: "East Sussex" },
  { locations: "Crawley, Horsham, Worthing", county: "West Sussex" },
  { locations: "Maidstone, Canterbury, Ashford", county: "Kent" },
  { locations: "Guildford, Woking, Croydon", county: "Surrey" },
];

/**
 * Generate FAQs exactly as the original function does
 */
function getServiceFAQs(serviceName) {
  return locationGroups.map((group) => ({
    question: `Do you provide ${serviceName.toLowerCase()} in ${group.locations.split(", ")[0]}?`,
    answer: `Yes, we supply professional ${serviceName.toLowerCase()} services in ${group.locations}, fully compliant with UK safety standards.`,
  }));
}

console.log("🔧 ServiceDataMap to JSON Converter\n");
console.log("This script will help convert the TypeScript serviceDataMap to JSON.\n");

// Read the source file
let sourceContent;
try {
  sourceContent = fs.readFileSync(SERVICE_PAGE_PATH, "utf-8");
  console.log("✅ Read source file: app/services/[slug]/page.tsx");
} catch (error) {
  console.error("❌ Error reading source file:", error.message);
  process.exit(1);
}

// Find the serviceDataMap
const mapStart = sourceContent.indexOf("const serviceDataMap: Record<string, ServiceData> = {");
const functionEnd = sourceContent.indexOf("\n  return (", mapStart);

if (mapStart === -1 || functionEnd === -1) {
  console.error("❌ Could not locate serviceDataMap in source file");
  process.exit(1);
}

console.log("✅ Located serviceDataMap in source\n");

// Extract the map content (between { and closing };)
const functionContent = sourceContent.substring(mapStart, functionEnd);
const mapStartBrace = functionContent.indexOf("{", functionContent.indexOf("= {"));
const mapContent = functionContent.substring(mapStartBrace);

console.log("📋 Manual Conversion Steps Required:\n");
console.log("Due to the complexity of the serviceDataMap (733 lines with function calls,");
console.log("template literals, and nested objects), here are the manual steps:\n");

console.log("STEP 1: Copy the serviceDataMap");
console.log("────────────────────────────────────────────────────────────");
console.log("Open: app/services/[slug]/page.tsx");
console.log("Find: Line 62 - function getServiceData(slug: string)");
console.log("Copy: Lines 63-755 (the entire serviceDataMap object)\n");

console.log("STEP 2: Handle getServiceFAQs() Function Calls");
console.log("────────────────────────────────────────────────────────────");
console.log("Replace this pattern:");
console.log('  faqs: getServiceFAQs("access scaffolding"),\n');
console.log("With the actual array:");
console.log('  "faqs": [');
console.log("    {");
console.log('      "question": "Do you provide access scaffolding in Brighton?",');
console.log(
  '      "answer": "Yes, we supply professional access scaffolding services in Brighton, Lewes, Eastbourne, fully compliant with UK safety standards."'
);
console.log("    },");
console.log("    ... (4 total FAQs)");
console.log("  ]\n");

console.log("Here are the FAQ arrays you need:\n");

// Generate all the FAQs that would be used
const faqExamples = [
  "access scaffolding",
  "facade scaffolding",
  "edge protection",
  "temporary roof systems",
  "birdcage scaffolds",
  "scaffold towers & mast systems",
  "crash decks & crane decks",
  "heavy duty industrial scaffolding",
  "pavement gantries & loading bays",
  "public access staircases",
  "scaffold alarm systems",
  "scaffolding design & drawings",
  "scaffolding inspections & maintenance",
  "sheeting, netting & encapsulation",
  "staircase towers",
  "suspended scaffolding",
];

console.log("// Generic FAQs for services that use getServiceFAQs():");
faqExamples.slice(0, 3).forEach((service) => {
  console.log(`\n// For: ${service}`);
  console.log(JSON.stringify(getServiceFAQs(service), null, 2).replace(/"([^"]+)":/g, "$1:"));
});
console.log("\n... (repeat pattern for other services)\n");

console.log("STEP 3: Convert TypeScript Syntax to JSON");
console.log("────────────────────────────────────────────────────────────");
console.log("1. Change all property names to quoted strings:");
console.log('   title: "..." → "title": "..."');
console.log('   benefits: [...] → "benefits": [...]');
console.log("");
console.log("2. Ensure all strings use double quotes (not single quotes)");
console.log("   'text' → \"text\"");
console.log("");
console.log("3. Remove trailing commas in arrays/objects (if any)");
console.log("");
console.log("4. Add outer curly braces to make valid JSON:");
console.log('   { "service-slug": { ... }, ... }\n');

console.log("STEP 4: Validate JSON");
console.log("────────────────────────────────────────────────────────────");
console.log("After conversion, validate with:");
console.log(
  "  node -e \"JSON.parse(require('fs').readFileSync('scripts/migration-snapshots/baseline.json', 'utf-8'))\""
);
console.log("");
console.log("Should output: (nothing) = valid JSON\n");

console.log("QUICK START - Copy/Paste Template:");
console.log("════════════════════════════════════════════════════════════");
console.log("Save this to scripts/migration-snapshots/baseline.json:\n");

// Generate a template with just one service as example
const exampleService = {
  "access-scaffolding": {
    title: "Access Scaffolding Services",
    description:
      "Safe, TG20:21-compliant access scaffolding for residential, commercial, and industrial projects across the South East UK. Professional installation with full insurance coverage.",
    badge: "Most Popular",
    heroImage: "/Access-Scaffolding-new-build.png",
    benefits: [
      "TG20:21 compliant design and installation",
      "CISRS qualified and experienced scaffolders",
      "£10 million public liability insurance",
      "CHAS accredited safety standards",
      "Free site surveys and quotations",
      "Rapid response across South East UK",
      "Complete handover certificates provided",
      "Regular safety inspections included",
    ],
    faqs: getServiceFAQs("access scaffolding"),
  },
};

console.log(JSON.stringify(exampleService, null, 2));
console.log("\n... add remaining 24 services following the same pattern\n");

console.log("OR - Use VS Code Find & Replace:");
console.log("════════════════════════════════════════════════════════════");
console.log("1. Copy serviceDataMap to a new file");
console.log('2. Find: faqs: getServiceFAQs\\("([^"]+)"\\),');
console.log("   Replace with the actual FAQ arrays (see above)");
console.log("3. Find: ([a-zA-Z]+):");
console.log('   Replace: "$1":');
console.log("4. Wrap in { } and validate\n");

console.log("Need help? The full FAQ arrays are available in this script.");
console.log("Run: node scripts/convert-servicemap-to-json.js --generate-faqs\n");

// Optional: Generate all FAQs
if (process.argv.includes("--generate-faqs")) {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("GENERATED FAQ ARRAYS FOR ALL SERVICES");
  console.log("═══════════════════════════════════════════════════════════\n");

  faqExamples.forEach((service) => {
    const slug = service.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
    console.log(`\n// ${slug}`);
    console.log('"faqs": ' + JSON.stringify(getServiceFAQs(service), null, 2));
  });

  console.log("\n\nCopy these arrays to replace getServiceFAQs() calls.\n");
}
