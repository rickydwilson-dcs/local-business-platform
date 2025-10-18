#!/usr/bin/env tsx
/**
 * Rename Existing Images Tool
 *
 * Analyzes current image usage in the codebase and renames/copies them
 * according to the R2 naming convention for easy upload.
 *
 * Usage:
 *   pnpm rename:images <site-slug>
 *
 * Example:
 *   pnpm rename:images colossus-reference
 */

import * as fs from "fs";
import * as path from "path";

interface ImageMapping {
  currentPath: string;
  newName: string;
  component: string;
  pageType: string;
  pageSlug: string;
  variant: string;
  usedIn: string[];
}

// Map of current image filenames to their usage context
const IMAGE_MAPPINGS: Record<string, ImageMapping> = {
  // Service page hero images
  "Access-Scaffolding-new-build.png": {
    currentPath: "Access-Scaffolding-new-build.png",
    newName: "hero_service_access-scaffolding_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "access-scaffolding",
    variant: "01",
    usedIn: ["services/access-scaffolding"],
  },
  "Facade-Scaffolding.png": {
    currentPath: "Facade-Scaffolding.png",
    newName: "hero_service_facade-scaffolding_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "facade-scaffolding",
    variant: "01",
    usedIn: ["services/facade-scaffolding"],
  },
  "Edge-Protection.png": {
    currentPath: "Edge-Protection.png",
    newName: "hero_service_edge-protection_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "edge-protection",
    variant: "01",
    usedIn: ["services/edge-protection"],
  },
  "Temporary-Roof-Systems.png": {
    currentPath: "Temporary-Roof-Systems.png",
    newName: "hero_service_temporary-roof-systems_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "temporary-roof-systems",
    variant: "01",
    usedIn: ["services/temporary-roof-systems"],
  },
  "Birdcage-scaffolding.png": {
    currentPath: "Birdcage-scaffolding.png",
    newName: "hero_service_birdcage-scaffolds_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "birdcage-scaffolds",
    variant: "01",
    usedIn: ["services/birdcage-scaffolds"],
  },
  "Scaffold-Towers-&-Mast-Systems.png": {
    currentPath: "Scaffold-Towers-&-Mast-Systems.png",
    newName: "hero_service_scaffold-towers-mast-systems_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffold-towers-mast-systems",
    variant: "01",
    usedIn: ["services/scaffold-towers-mast-systems"],
  },
  "Scaffold-Towers-and-Mast-Systems.png": {
    currentPath: "Scaffold-Towers-and-Mast-Systems.png",
    newName: "hero_service_scaffold-towers-mast-systems_02.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffold-towers-mast-systems",
    variant: "02",
    usedIn: ["services/scaffold-towers-mast-systems"],
  },
  "Crash-Decks-&-Crane-Decks.png": {
    currentPath: "Crash-Decks-&-Crane-Decks.png",
    newName: "hero_service_crash-decks-crane-decks_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "crash-decks-crane-decks",
    variant: "01",
    usedIn: ["services/crash-decks-crane-decks"],
  },
  "Crash-Decks-and-Crane-Decks.png": {
    currentPath: "Crash-Decks-and-Crane-Decks.png",
    newName: "hero_service_crash-decks-crane-decks_02.png",
    component: "hero",
    pageType: "service",
    pageSlug: "crash-decks-crane-decks",
    variant: "02",
    usedIn: ["services/crash-decks-crane-decks"],
  },
  "Heavy-Industrial-Scaffolding.png": {
    currentPath: "Heavy-Industrial-Scaffolding.png",
    newName: "hero_service_industrial-scaffolding_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "industrial-scaffolding",
    variant: "01",
    usedIn: ["services/industrial-scaffolding", "services/heavy-duty-industrial-scaffolding"],
  },
  "Pavement-Gantries-Loading-Bays.png": {
    currentPath: "Pavement-Gantries-Loading-Bays.png",
    newName: "hero_service_pavement-gantries-loading-bays_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "pavement-gantries-loading-bays",
    variant: "01",
    usedIn: ["services/pavement-gantries-loading-bays"],
  },
  "Public-Access-Staircases.png": {
    currentPath: "Public-Access-Staircases.png",
    newName: "hero_service_public-access-staircases_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "public-access-staircases",
    variant: "01",
    usedIn: ["services/public-access-staircases"],
  },
  "Scaffold-Alarms.png": {
    currentPath: "Scaffold-Alarms.png",
    newName: "hero_service_scaffold-alarms_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffold-alarms",
    variant: "01",
    usedIn: ["services/scaffold-alarms"],
  },
  "Scaffolding-Design-&-Drawings.png": {
    currentPath: "Scaffolding-Design-&-Drawings.png",
    newName: "hero_service_scaffolding-design-drawings_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffolding-design-drawings",
    variant: "01",
    usedIn: ["services/scaffolding-design-drawings"],
  },
  "Scaffolding-Inspections-&-Maintenance.png": {
    currentPath: "Scaffolding-Inspections-&-Maintenance.png",
    newName: "hero_service_scaffolding-inspections-maintenance_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffolding-inspections-maintenance",
    variant: "01",
    usedIn: ["services/scaffolding-inspections-maintenance"],
  },
  "Scaffolding-Inspections-and-Maintenance.png": {
    currentPath: "Scaffolding-Inspections-and-Maintenance.png",
    newName: "hero_service_scaffolding-inspections-maintenance_02.png",
    component: "hero",
    pageType: "service",
    pageSlug: "scaffolding-inspections-maintenance",
    variant: "02",
    usedIn: ["services/scaffolding-inspections-maintenance"],
  },
  "Sheeting-Netting-Encapsulation.png": {
    currentPath: "Sheeting-Netting-Encapsulation.png",
    newName: "hero_service_sheeting-netting-encapsulation_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "sheeting-netting-encapsulation",
    variant: "01",
    usedIn: ["services/sheeting-netting-encapsulation"],
  },
  "Staircase-Towers.png": {
    currentPath: "Staircase-Towers.png",
    newName: "hero_service_staircase-towers_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "staircase-towers",
    variant: "01",
    usedIn: ["services/staircase-towers"],
  },
  "Suspended-Scaffolding.png": {
    currentPath: "Suspended-Scaffolding.png",
    newName: "hero_service_suspended-scaffolding_01.png",
    component: "hero",
    pageType: "service",
    pageSlug: "suspended-scaffolding",
    variant: "01",
    usedIn: ["services/suspended-scaffolding"],
  },

  // Commercial scaffolding variants
  "Commercial-Scaffolding-Brighton.png": {
    currentPath: "Commercial-Scaffolding-Brighton.png",
    newName: "hero_service_commercial-scaffolding_brighton.png",
    component: "hero",
    pageType: "service",
    pageSlug: "commercial-scaffolding",
    variant: "brighton",
    usedIn: ["services/commercial-scaffolding", "services/commercial-scaffolding-brighton"],
  },
  "Commercial-Scaffolding-Canterbury.png": {
    currentPath: "Commercial-Scaffolding-Canterbury.png",
    newName: "hero_service_commercial-scaffolding_canterbury.png",
    component: "hero",
    pageType: "service",
    pageSlug: "commercial-scaffolding",
    variant: "canterbury",
    usedIn: ["services/commercial-scaffolding-canterbury"],
  },
  "Commercial-Scaffolding-Hastings.png": {
    currentPath: "Commercial-Scaffolding-Hastings.png",
    newName: "hero_service_commercial-scaffolding_hastings.png",
    component: "hero",
    pageType: "service",
    pageSlug: "commercial-scaffolding",
    variant: "hastings",
    usedIn: ["services/commercial-scaffolding-hastings"],
  },

  // Residential scaffolding variants
  "Residentiial-Scaffolding-Brighton.png": {
    currentPath: "Residentiial-Scaffolding-Brighton.png",
    newName: "hero_service_residential-scaffolding_brighton.png",
    component: "hero",
    pageType: "service",
    pageSlug: "residential-scaffolding",
    variant: "brighton",
    usedIn: ["services/residential-scaffolding", "services/residential-scaffolding-brighton"],
  },
  "Residentiial-Scaffolding-Canterbury.png": {
    currentPath: "Residentiial-Scaffolding-Canterbury.png",
    newName: "hero_service_residential-scaffolding_canterbury.png",
    component: "hero",
    pageType: "service",
    pageSlug: "residential-scaffolding",
    variant: "canterbury",
    usedIn: ["services/residential-scaffolding-canterbury"],
  },
  "Residentiial-Scaffolding-Hastings.png": {
    currentPath: "Residentiial-Scaffolding-Hastings.png",
    newName: "hero_service_residential-scaffolding_hastings.png",
    component: "hero",
    pageType: "service",
    pageSlug: "residential-scaffolding",
    variant: "hastings",
    usedIn: ["services/residential-scaffolding-hastings"],
  },

  // Location page hero images - these will become location-specific
  "Ashford-Scaffolding.png": {
    currentPath: "Ashford-Scaffolding.png",
    newName: "hero_location_ashford_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "ashford",
    variant: "01",
    usedIn: ["locations/ashford"],
  },
  "Battle-Scaffolding.png": {
    currentPath: "Battle-Scaffolding.png",
    newName: "hero_location_battle_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "battle",
    variant: "01",
    usedIn: ["locations/battle"],
  },
  "Brighton-Scaffolding.png": {
    currentPath: "Brighton-Scaffolding.png",
    newName: "hero_location_brighton_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "brighton",
    variant: "01",
    usedIn: ["locations/brighton"],
  },
  "Camberley-Scaffolding.png": {
    currentPath: "Camberley-Scaffolding.png",
    newName: "hero_location_camberley_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "camberley",
    variant: "01",
    usedIn: ["locations/camberley"],
  },
  "Canterbury-Scaffolding.png": {
    currentPath: "Canterbury-Scaffolding.png",
    newName: "hero_location_canterbury_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "canterbury",
    variant: "01",
    usedIn: ["locations/canterbury"],
  },
  "Chatham-Scaffolding.png": {
    currentPath: "Chatham-Scaffolding.png",
    newName: "hero_location_chatham_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "chatham",
    variant: "01",
    usedIn: ["locations/chatham"],
  },
  "Crawley-Scaffolding.png": {
    currentPath: "Crawley-Scaffolding.png",
    newName: "hero_location_crawley_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "crawley",
    variant: "01",
    usedIn: ["locations/crawley"],
  },
  "Dartford-Scaffolding.png": {
    currentPath: "Dartford-Scaffolding.png",
    newName: "hero_location_dartford_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "dartford",
    variant: "01",
    usedIn: ["locations/dartford"],
  },
  "Dover-Scaffolding.png": {
    currentPath: "Dover-Scaffolding.png",
    newName: "hero_location_dover_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "dover",
    variant: "01",
    usedIn: ["locations/dover"],
  },
  "Eastbourne-Scaffolding.png": {
    currentPath: "Eastbourne-Scaffolding.png",
    newName: "hero_location_eastbourne_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "eastbourne",
    variant: "01",
    usedIn: ["locations/eastbourne"],
  },
  "Epsom-Scaffolding.png": {
    currentPath: "Epsom-Scaffolding.png",
    newName: "hero_location_epsom_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "epsom",
    variant: "01",
    usedIn: ["locations/epsom"],
  },
  "Folkestone-Scaffolding.png": {
    currentPath: "Folkestone-Scaffolding.png",
    newName: "hero_location_folkestone_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "folkestone",
    variant: "01",
    usedIn: ["locations/folkestone"],
  },
  "Gillingham-Scaffolding.png": {
    currentPath: "Gillingham-Scaffolding.png",
    newName: "hero_location_gillingham_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "gillingham",
    variant: "01",
    usedIn: ["locations/gillingham"],
  },
  "Gravesend-Scaffolding.png": {
    currentPath: "Gravesend-Scaffolding.png",
    newName: "hero_location_gravesend_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "gravesend",
    variant: "01",
    usedIn: ["locations/gravesend"],
  },
  "Guildford-Scaffolding.png": {
    currentPath: "Guildford-Scaffolding.png",
    newName: "hero_location_guildford_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "guildford",
    variant: "01",
    usedIn: ["locations/guildford"],
  },
  "Hailsham-Scaffolding.png": {
    currentPath: "Hailsham-Scaffolding.png",
    newName: "hero_location_hailsham_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "hailsham",
    variant: "01",
    usedIn: ["locations/hailsham"],
  },
  "Hastings-Scaffolding.png": {
    currentPath: "Hastings-Scaffolding.png",
    newName: "hero_location_hastings_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "hastings",
    variant: "01",
    usedIn: ["locations/hastings"],
  },
  "Haywards-Heath-Scaffolding.png": {
    currentPath: "Haywards-Heath-Scaffolding.png",
    newName: "hero_location_haywards-heath_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "haywards-heath",
    variant: "01",
    usedIn: ["locations/haywards-heath"],
  },
  "Horsham-Scaffolding.png": {
    currentPath: "Horsham-Scaffolding.png",
    newName: "hero_location_horsham_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "horsham",
    variant: "01",
    usedIn: ["locations/horsham"],
  },
  "Lewes-Scaffolding.png": {
    currentPath: "Lewes-Scaffolding.png",
    newName: "hero_location_lewes_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "lewes",
    variant: "01",
    usedIn: ["locations/lewes"],
  },
  "Littlehampton-Scaffolding.png": {
    currentPath: "Littlehampton-Scaffolding.png",
    newName: "hero_location_littlehampton_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "littlehampton",
    variant: "01",
    usedIn: ["locations/littlehampton"],
  },
  "Maidstone-Scaffolding.png": {
    currentPath: "Maidstone-Scaffolding.png",
    newName: "hero_location_maidstone_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "maidstone",
    variant: "01",
    usedIn: ["locations/maidstone"],
  },
  "Ramsgate-Scaffolding.png": {
    currentPath: "Ramsgate-Scaffolding.png",
    newName: "hero_location_ramsgate_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "ramsgate",
    variant: "01",
    usedIn: ["locations/ramsgate"],
  },
  "Redhill-Scaffolding.png": {
    currentPath: "Redhill-Scaffolding.png",
    newName: "hero_location_redhill_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "redhill",
    variant: "01",
    usedIn: ["locations/redhill"],
  },
  "Rochester-Scaffolding.png": {
    currentPath: "Rochester-Scaffolding.png",
    newName: "hero_location_rochester_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "rochester",
    variant: "01",
    usedIn: ["locations/rochester"],
  },
  "Sevenoaks-Scaffolding.png": {
    currentPath: "Sevenoaks-Scaffolding.png",
    newName: "hero_location_sevenoaks_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "sevenoaks",
    variant: "01",
    usedIn: ["locations/sevenoaks"],
  },
  "Tonbridge-Scaffolding.png": {
    currentPath: "Tonbridge-Scaffolding.png",
    newName: "hero_location_tonbridge_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "tonbridge",
    variant: "01",
    usedIn: ["locations/tonbridge"],
  },
  "Tunbridge-Wells-Scaffolding.png": {
    currentPath: "Tunbridge-Wells-Scaffolding.png",
    newName: "hero_location_tunbridge-wells_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "tunbridge-wells",
    variant: "01",
    usedIn: ["locations/tunbridge-wells"],
  },
  "Uckfield-Scaffolding.png": {
    currentPath: "Uckfield-Scaffolding.png",
    newName: "hero_location_uckfield_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "uckfield",
    variant: "01",
    usedIn: ["locations/uckfield"],
  },
  "Worthing-Scaffolding.png": {
    currentPath: "Worthing-Scaffolding.png",
    newName: "hero_location_worthing_01.png",
    component: "hero",
    pageType: "location",
    pageSlug: "worthing",
    variant: "01",
    usedIn: ["locations/worthing"],
  },

  // Homepage hero
  "hero-scaffolding.jpg": {
    currentPath: "hero-scaffolding.jpg",
    newName: "hero_home_main_01.jpg",
    component: "hero",
    pageType: "home",
    pageSlug: "main",
    variant: "01",
    usedIn: ["home"],
  },
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: pnpm rename:images <site-slug>");
    console.log("\nExample:");
    console.log("  pnpm rename:images colossus-reference");
    process.exit(1);
  }

  const siteSlug = args[0];
  const siteDir = path.join(process.cwd(), "sites", siteSlug);
  const publicDir = path.join(siteDir, "public");
  const outputDir = path.join(process.cwd(), "renamed-images", siteSlug);

  // Validate site exists
  if (!fs.existsSync(siteDir)) {
    console.error(`❌ Site not found: ${siteSlug}`);
    console.error(`   Expected directory: ${siteDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Public directory not found: ${publicDir}`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("🖼️  Image Renaming Tool\n");
  console.log(`Site: ${siteSlug}`);
  console.log(`Source: ${publicDir}`);
  console.log(`Output: ${outputDir}\n`);

  let renamed = 0;
  let skipped = 0;
  let notFound = 0;

  // Process each mapped image
  for (const [originalName, mapping] of Object.entries(IMAGE_MAPPINGS)) {
    const sourcePath = path.join(publicDir, originalName);
    const destPath = path.join(outputDir, mapping.newName);

    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⊘ ${originalName} (not found in public dir)`);
      notFound++;
      continue;
    }

    // Copy and rename
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ ${originalName}`);
    console.log(`    → ${mapping.newName}`);
    console.log(
      `       Component: ${mapping.component} | Page: ${mapping.pageType}/${mapping.pageSlug}`
    );
    renamed++;
  }

  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total mapped:     ${Object.keys(IMAGE_MAPPINGS).length}`);
  console.log(`Renamed & copied: ${renamed}`);
  console.log(`Not found:        ${notFound}`);
  console.log(`Output directory: ${outputDir}`);
  console.log("=".repeat(70));

  console.log("\n✅ Images renamed and ready for R2 upload!");
  console.log("\n💡 Next steps:");
  console.log(`   1. Review images in: ${outputDir}`);
  console.log(`   2. Upload to R2:`);
  console.log(`      pnpm images:intake ${siteSlug} ${outputDir}`);
  console.log(`   3. Update your code to use R2 URLs`);
  console.log(`   4. Remove images from /public directory`);
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});
