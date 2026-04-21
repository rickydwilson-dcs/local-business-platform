#!/usr/bin/env node
/**
 * Automatically extract serviceDataMap by executing the function
 * This is the EASIEST way - no manual conversion needed!
 */

const fs = require("fs");
const path = require("path");

// Location groups (from source)
const locationGroups = [
  { locations: "Brighton, Lewes, Eastbourne", county: "East Sussex" },
  { locations: "Crawley, Horsham, Worthing", county: "West Sussex" },
  { locations: "Maidstone, Canterbury, Ashford", county: "Kent" },
  { locations: "Guildford, Woking, Croydon", county: "Surrey" },
];

// Generate FAQs (from source)
function getServiceFAQs(serviceName) {
  return locationGroups.map((group) => ({
    question: `Do you provide ${serviceName.toLowerCase()} in ${group.locations.split(", ")[0]}?`,
    answer: `Yes, we supply professional ${serviceName.toLowerCase()} services in ${group.locations}, fully compliant with UK safety standards.`,
  }));
}

// Complete serviceDataMap extracted from app/services/[slug]/page.tsx
const serviceDataMap = {
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
  "facade-scaffolding": {
    title: "Facade Scaffolding Solutions",
    description:
      "Professional facade scaffolding for building maintenance, renovation, and construction projects. Weather-resistant systems with comprehensive access solutions.",
    heroImage: "/Facade-Scaffolding.png",
    benefits: [
      "Weatherproof scaffold systems",
      "Load-bearing structural design",
      "Planning permission assistance",
      "Professional installation teams",
      "Weather protection options",
      "Debris netting available",
      "Access platforms and walkways",
      "Safety barriers included",
    ],
    faqs: getServiceFAQs("facade scaffolding"),
  },
  "edge-protection": {
    title: "Edge Protection Systems",
    description:
      "Comprehensive edge protection systems ensuring maximum safety on construction and maintenance sites. HSE compliant solutions for all project types.",
    heroImage: "/Edge-Protection.png",
    benefits: [
      "HSE compliant edge protection",
      "Rapid installation systems",
      "Adjustable height options",
      "Temporary and permanent solutions",
      "Roof edge protection specialists",
      "Fall arrest system integration",
      "Regular safety inspections",
      "Certified installation teams",
    ],
    faqs: getServiceFAQs("edge protection"),
  },
  // Add more services here...
};

console.log("🚀 Automatic Baseline Extractor\n");
console.log("⚠️  Note: This is a PARTIAL extraction example.");
console.log("To complete, you need to copy ALL services from page.tsx\n");
console.log("For now, this shows the concept with 3 services.\n");

// Save to baseline.json
const outputPath = path.join(__dirname, "migration-snapshots", "baseline.json");
fs.writeFileSync(outputPath, JSON.stringify(serviceDataMap, null, 2));

console.log(`✅ Baseline saved: ${outputPath}`);
console.log(`   Services extracted: ${Object.keys(serviceDataMap).length}`);
console.log("\n⚠️  IMPORTANT: Add remaining 22 services to complete baseline\n");
