#!/usr/bin/env tsx
/**
 * Update to R2 URLs Tool
 *
 * Updates all MDX files and code to use R2 image URLs instead of /public paths.
 *
 * Usage:
 *   pnpm update:r2-urls <site-slug>
 *
 * Example:
 *   pnpm update:r2-urls colossus-reference
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

interface ImageMapping {
  oldPath: string;
  newPath: string;
}

// Mapping of old public paths to new R2 paths
const IMAGE_MAPPINGS: ImageMapping[] = [
  // Service images
  {
    oldPath: "/Access-Scaffolding-new-build.png",
    newPath: "colossus-reference/hero/service/access-scaffolding_01.webp",
  },
  {
    oldPath: "/Facade-Scaffolding.png",
    newPath: "colossus-reference/hero/service/facade-scaffolding_01.webp",
  },
  {
    oldPath: "/Edge-Protection.png",
    newPath: "colossus-reference/hero/service/edge-protection_01.webp",
  },
  {
    oldPath: "/Temporary-Roof-Systems.png",
    newPath: "colossus-reference/hero/service/temporary-roof-systems_01.webp",
  },
  {
    oldPath: "/Birdcage-scaffolding.png",
    newPath: "colossus-reference/hero/service/birdcage-scaffolds_01.webp",
  },
  {
    oldPath: "/Scaffold-Towers-&-Mast-Systems.png",
    newPath: "colossus-reference/hero/service/scaffold-towers-mast-systems_02.webp",
  },
  {
    oldPath: "/Scaffold-Towers-and-Mast-Systems.png",
    newPath: "colossus-reference/hero/service/scaffold-towers-mast-systems_02.webp",
  },
  {
    oldPath: "/Crash-Decks-&-Crane-Decks.png",
    newPath: "colossus-reference/hero/service/crash-decks-crane-decks_02.webp",
  },
  {
    oldPath: "/Crash-Decks-and-Crane-Decks.png",
    newPath: "colossus-reference/hero/service/crash-decks-crane-decks_02.webp",
  },
  {
    oldPath: "/Heavy-Industrial-Scaffolding.png",
    newPath: "colossus-reference/hero/service/industrial-scaffolding_01.webp",
  },
  {
    oldPath: "/Pavement-Gantries-Loading-Bays.png",
    newPath: "colossus-reference/hero/service/pavement-gantries-loading-bays_01.webp",
  },
  {
    oldPath: "/Public-Access-Staircases.png",
    newPath: "colossus-reference/hero/service/public-access-staircases_01.webp",
  },
  {
    oldPath: "/Scaffold-Alarms.png",
    newPath: "colossus-reference/hero/service/scaffold-alarms_01.webp",
  },
  {
    oldPath: "/Scaffolding-Design-&-Drawings.png",
    newPath: "colossus-reference/hero/service/scaffolding-design-drawings_01.webp",
  },
  {
    oldPath: "/Scaffolding-Inspections-&-Maintenance.png",
    newPath: "colossus-reference/hero/service/scaffolding-inspections-maintenance_02.webp",
  },
  {
    oldPath: "/Scaffolding-Inspections-and-Maintenance.png",
    newPath: "colossus-reference/hero/service/scaffolding-inspections-maintenance_02.webp",
  },
  {
    oldPath: "/Sheeting-Netting-Encapsulation.png",
    newPath: "colossus-reference/hero/service/sheeting-netting-encapsulation_01.webp",
  },
  {
    oldPath: "/Staircase-Towers.png",
    newPath: "colossus-reference/hero/service/staircase-towers_01.webp",
  },
  {
    oldPath: "/Suspended-Scaffolding.png",
    newPath: "colossus-reference/hero/service/suspended-scaffolding_01.webp",
  },

  // Commercial scaffolding variants
  {
    oldPath: "/Commercial-Scaffolding-Brighton.png",
    newPath: "colossus-reference/hero/service/commercial-scaffolding_brighton.webp",
  },
  {
    oldPath: "/Commercial-Scaffolding-Canterbury.png",
    newPath: "colossus-reference/hero/service/commercial-scaffolding_canterbury.webp",
  },
  {
    oldPath: "/Commercial-Scaffolding-Hastings.png",
    newPath: "colossus-reference/hero/service/commercial-scaffolding_hastings.webp",
  },

  // Residential scaffolding variants
  {
    oldPath: "/Residentiial-Scaffolding-Brighton.png",
    newPath: "colossus-reference/hero/service/residential-scaffolding_brighton.webp",
  },
  {
    oldPath: "/Residentiial-Scaffolding-Canterbury.png",
    newPath: "colossus-reference/hero/service/residential-scaffolding_canterbury.webp",
  },
  {
    oldPath: "/Residentiial-Scaffolding-Hastings.png",
    newPath: "colossus-reference/hero/service/residential-scaffolding_hastings.webp",
  },

  // Location images
  {
    oldPath: "/Ashford-Scaffolding.png",
    newPath: "colossus-reference/hero/location/ashford_01.webp",
  },
  {
    oldPath: "/Battle-Scaffolding.png",
    newPath: "colossus-reference/hero/location/battle_01.webp",
  },
  {
    oldPath: "/Brighton-Scaffolding.png",
    newPath: "colossus-reference/hero/location/brighton_01.webp",
  },
  {
    oldPath: "/Camberley-Scaffolding.png",
    newPath: "colossus-reference/hero/location/camberley_01.webp",
  },
  {
    oldPath: "/Canterbury-Scaffolding.png",
    newPath: "colossus-reference/hero/location/canterbury_01.webp",
  },
  {
    oldPath: "/Chatham-Scaffolding.png",
    newPath: "colossus-reference/hero/location/chatham_01.webp",
  },
  {
    oldPath: "/Crawley-Scaffolding.png",
    newPath: "colossus-reference/hero/location/crawley_01.webp",
  },
  {
    oldPath: "/Dartford-Scaffolding.png",
    newPath: "colossus-reference/hero/location/dartford_01.webp",
  },
  { oldPath: "/Dover-Scaffolding.png", newPath: "colossus-reference/hero/location/dover_01.webp" },
  {
    oldPath: "/Eastbourne-Scaffolding.png",
    newPath: "colossus-reference/hero/location/eastbourne_01.webp",
  },
  { oldPath: "/Epsom-Scaffolding.png", newPath: "colossus-reference/hero/location/epsom_01.webp" },
  {
    oldPath: "/Folkestone-Scaffolding.png",
    newPath: "colossus-reference/hero/location/folkestone_01.webp",
  },
  {
    oldPath: "/Gillingham-Scaffolding.png",
    newPath: "colossus-reference/hero/location/gillingham_01.webp",
  },
  {
    oldPath: "/Gravesend-Scaffolding.png",
    newPath: "colossus-reference/hero/location/gravesend_01.webp",
  },
  {
    oldPath: "/Guildford-Scaffolding.png",
    newPath: "colossus-reference/hero/location/guildford_01.webp",
  },
  {
    oldPath: "/Hailsham-Scaffolding.png",
    newPath: "colossus-reference/hero/location/hailsham_01.webp",
  },
  {
    oldPath: "/Hastings-Scaffolding.png",
    newPath: "colossus-reference/hero/location/hastings_01.webp",
  },
  {
    oldPath: "/Haywards-Heath-Scaffolding.png",
    newPath: "colossus-reference/hero/location/haywards-heath_01.webp",
  },
  {
    oldPath: "/Horsham-Scaffolding.png",
    newPath: "colossus-reference/hero/location/horsham_01.webp",
  },
  { oldPath: "/Lewes-Scaffolding.png", newPath: "colossus-reference/hero/location/lewes_01.webp" },
  {
    oldPath: "/Littlehampton-Scaffolding.png",
    newPath: "colossus-reference/hero/location/littlehampton_01.webp",
  },
  {
    oldPath: "/Maidstone-Scaffolding.png",
    newPath: "colossus-reference/hero/location/maidstone_01.webp",
  },
  {
    oldPath: "/Ramsgate-Scaffolding.png",
    newPath: "colossus-reference/hero/location/ramsgate_01.webp",
  },
  {
    oldPath: "/Redhill-Scaffolding.png",
    newPath: "colossus-reference/hero/location/redhill_01.webp",
  },
  {
    oldPath: "/Rochester-Scaffolding.png",
    newPath: "colossus-reference/hero/location/rochester_01.webp",
  },
  {
    oldPath: "/Sevenoaks-Scaffolding.png",
    newPath: "colossus-reference/hero/location/sevenoaks_01.webp",
  },
  {
    oldPath: "/Tonbridge-Scaffolding.png",
    newPath: "colossus-reference/hero/location/tonbridge_01.webp",
  },
  {
    oldPath: "/Tunbridge-Wells-Scaffolding.png",
    newPath: "colossus-reference/hero/location/tunbridge-wells_01.webp",
  },
  {
    oldPath: "/Uckfield-Scaffolding.png",
    newPath: "colossus-reference/hero/location/uckfield_01.webp",
  },
  {
    oldPath: "/Worthing-Scaffolding.png",
    newPath: "colossus-reference/hero/location/worthing_01.webp",
  },

  // Homepage hero
  { oldPath: "/hero-scaffolding.jpg", newPath: "colossus-reference/hero/home/main_01.webp" },
];

async function updateFile(filePath: string, mappings: ImageMapping[]): Promise<number> {
  let content = fs.readFileSync(filePath, "utf-8");
  let replacements = 0;

  for (const mapping of mappings) {
    // Match the old path with various quote styles
    const patterns = [
      new RegExp(`image:\\s*"${mapping.oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
      new RegExp(`image:\\s*'${mapping.oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`, "g"),
      new RegExp(`heroImage="${mapping.oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
      new RegExp(`heroImage='${mapping.oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`, "g"),
      new RegExp(`heroImage:\\s*"${mapping.oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        const replacement = pattern.toString().includes("heroImage")
          ? `heroImage="${mapping.newPath}"`
          : `image: "${mapping.newPath}"`;

        content = content.replace(pattern, replacement);
        replacements++;
      }
    }
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, content, "utf-8");
  }

  return replacements;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: pnpm update:r2-urls <site-slug>");
    console.log("\nExample:");
    console.log("  pnpm update:r2-urls colossus-reference");
    process.exit(1);
  }

  const siteSlug = args[0];
  const siteDir = path.join(process.cwd(), "sites", siteSlug);

  // Validate site exists
  if (!fs.existsSync(siteDir)) {
    console.error(`❌ Site not found: ${siteSlug}`);
    console.error(`   Expected directory: ${siteDir}`);
    process.exit(1);
  }

  console.log("🔄 Updating Image Paths to R2 URLs\n");
  console.log(`Site: ${siteSlug}`);
  console.log(`Directory: ${siteDir}\n`);

  let totalFiles = 0;
  let totalReplacements = 0;

  // Find all MDX files
  console.log("📝 Updating MDX files...\n");
  const mdxFiles = await glob(`${siteDir}/content/**/*.mdx`);

  for (const file of mdxFiles) {
    const replacements = await updateFile(file, IMAGE_MAPPINGS);
    if (replacements > 0) {
      console.log(`  ✓ ${path.relative(siteDir, file)} (${replacements} replacement(s))`);
      totalFiles++;
      totalReplacements += replacements;
    }
  }

  // Find all TSX/TS files that might reference images
  console.log("\n🔧 Updating TSX/TS files...\n");
  const tsxFiles = await glob(`${siteDir}/app/**/*.{tsx,ts}`);

  for (const file of tsxFiles) {
    const replacements = await updateFile(file, IMAGE_MAPPINGS);
    if (replacements > 0) {
      console.log(`  ✓ ${path.relative(siteDir, file)} (${replacements} replacement(s))`);
      totalFiles++;
      totalReplacements += replacements;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY");
  console.log("=".repeat(70));
  console.log(`Files updated:        ${totalFiles}`);
  console.log(`Total replacements:   ${totalReplacements}`);
  console.log("=".repeat(70));

  if (totalReplacements > 0) {
    console.log("\n✅ Image paths updated to R2 URLs!");
    console.log("\n💡 Next steps:");
    console.log("   1. Update image helper to prepend R2 URL");
    console.log("   2. Test locally: pnpm dev");
    console.log('   3. Commit changes: git add . && git commit -m "Update images to R2"');
    console.log("   4. Deploy and verify images load from R2");
    console.log("   5. Remove old images from /public folder");
  } else {
    console.log("\n⚠️  No image paths found to update");
    console.log("   Images may already be using R2 URLs");
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});
