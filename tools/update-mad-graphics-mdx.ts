#!/usr/bin/env tsx
/**
 * Mad Graphics — Update MDX image references
 * Replaces placeholder/ paths in frontmatter with real R2 paths after upload.
 *
 * Usage:
 *   tsx tools/update-mad-graphics-mdx.ts [--dry-run]
 *
 * What it does:
 *   - Scans all MDX files in sites/mad-graphics/content/
 *   - Finds `image: "placeholder/hero-*.webp"` and `heroImage: "placeholder/*.webp"` lines
 *   - Maps placeholder filename → real R2 path (mad-graphics/services/hero-*.jpg etc.)
 *   - Writes updated files (or just reports with --dry-run)
 */
import * as fs from "fs";
import * as path from "path";

const SITE_CONTENT = path.join(process.cwd(), "sites/mad-graphics/content");
const dryRun = process.argv.includes("--dry-run");

// Mapping: placeholder filename → R2 path (relative, no leading slash)
// getImageUrl() in core-components prepends NEXT_PUBLIC_R2_PUBLIC_URL automatically.
const PLACEHOLDER_TO_R2: Record<string, string> = {
  // Services — uploaded as .jpg, referenced as R2 path
  "placeholder/hero-vehicle-graphics.webp": "mad-graphics/services/hero-vehicle-graphics.jpg",
  "placeholder/hero-van-graphics.webp": "mad-graphics/services/hero-van-graphics.jpg",
  "placeholder/hero-car-graphics.webp": "mad-graphics/services/hero-car-graphics.jpg",
  "placeholder/hero-fleet-graphics.webp": "mad-graphics/services/hero-fleet-graphics.jpg",
  "placeholder/hero-vehicle-livery.webp": "mad-graphics/services/hero-vehicle-livery.jpg",
  "placeholder/hero-magnetic-signs.webp": "mad-graphics/services/hero-magnetic-signs.jpg",
  "placeholder/hero-window-graphics.webp": "mad-graphics/services/hero-window-graphics.jpg",
  "placeholder/hero-hoarding-graphics.webp": "mad-graphics/services/hero-hoarding-graphics.jpg",
  "placeholder/hero-signs-signage.webp": "mad-graphics/services/hero-signs-signage.jpg",
  "placeholder/hero-shop-signs.webp": "mad-graphics/services/hero-shop-signs.jpg",
  "placeholder/hero-directional-signs.webp": "mad-graphics/services/hero-directional-signs.jpg",
  "placeholder/hero-safety-signs.webp": "mad-graphics/services/hero-safety-signs.jpg",
  "placeholder/hero-site-boards.webp": "mad-graphics/services/hero-site-boards.jpg",
  "placeholder/hero-a-boards.webp": "mad-graphics/services/hero-a-boards.jpg",
  "placeholder/hero-banners.webp": "mad-graphics/services/hero-banners.jpg",
  "placeholder/hero-pvc-banners.webp": "mad-graphics/services/hero-pvc-banners.jpg",
  "placeholder/hero-roller-banners.webp": "mad-graphics/services/hero-roller-banners.jpg",
  "placeholder/hero-mesh-banners.webp": "mad-graphics/services/hero-mesh-banners.jpg",
  "placeholder/hero-fabric-banners.webp": "mad-graphics/services/hero-fabric-banners.jpg",
  "placeholder/hero-large-format-print.webp": "mad-graphics/services/hero-large-format-print.jpg",
  "placeholder/hero-large-format.webp": "mad-graphics/services/hero-large-format.jpg",
  "placeholder/hero-poster-printing.webp": "mad-graphics/services/hero-poster-printing.jpg",
  "placeholder/hero-canvas-prints.webp": "mad-graphics/services/hero-canvas-prints.jpg",
  "placeholder/hero-exhibition-prints.webp": "mad-graphics/services/hero-exhibition-prints.jpg",
  "placeholder/hero-foam-board-correx.webp": "mad-graphics/services/hero-foam-board-correx.jpg",
  "placeholder/hero-marketing-print.webp": "mad-graphics/services/hero-marketing-print.jpg",
  "placeholder/hero-flyers-leaflets.webp": "mad-graphics/services/hero-flyers-leaflets.jpg",
  "placeholder/hero-brochures.webp": "mad-graphics/services/hero-brochures.jpg",
  "placeholder/hero-business-cards.webp": "mad-graphics/services/hero-business-cards.jpg",
  "placeholder/hero-letterheads.webp": "mad-graphics/services/hero-letterheads.jpg",
  "placeholder/hero-folders.webp": "mad-graphics/services/hero-folders.jpg",
  "placeholder/hero-menus.webp": "mad-graphics/services/hero-menus.jpg",
  "placeholder/hero-stickers-labels.webp": "mad-graphics/services/hero-stickers-labels.jpg",
  "placeholder/hero-custom-stickers.webp": "mad-graphics/services/hero-custom-stickers.jpg",
  "placeholder/hero-labels.webp": "mad-graphics/services/hero-labels.jpg",
  "placeholder/hero-wall-graphics.webp": "mad-graphics/services/hero-wall-graphics.jpg",
  "placeholder/hero-floor-graphics.webp": "mad-graphics/services/hero-floor-graphics.jpg",
  "placeholder/hero-window-stickers.webp": "mad-graphics/services/hero-window-stickers.jpg",
  "placeholder/hero-workwear-merchandise.webp": "mad-graphics/services/hero-workwear-merchandise.jpg",
  "placeholder/hero-printed-workwear.webp": "mad-graphics/services/hero-printed-workwear.jpg",
  "placeholder/hero-embroidered-uniforms.webp": "mad-graphics/services/hero-embroidered-uniforms.jpg",
  "placeholder/hero-hi-vis.webp": "mad-graphics/services/hero-hi-vis.jpg",
  "placeholder/hero-merchandise.webp": "mad-graphics/services/hero-merchandise.jpg",
  "placeholder/hero-personalised-gifts.webp": "mad-graphics/services/hero-personalised-gifts.jpg",
  "placeholder/hero-graphic-design.webp": "mad-graphics/services/hero-graphic-design.jpg",
  "placeholder/hero-logo-design.webp": "mad-graphics/services/hero-logo-design.jpg",
  "placeholder/hero-brand-identity.webp": "mad-graphics/services/hero-brand-identity.jpg",
  "placeholder/hero-print-design.webp": "mad-graphics/services/hero-print-design.jpg",
  "placeholder/hero-artwork-prepress.webp": "mad-graphics/services/hero-artwork-prepress.jpg",

  // Locations
  "placeholder/hero-eastbourne.webp": "mad-graphics/locations/hero-eastbourne.jpg",
  "placeholder/hero-hastings.webp": "mad-graphics/locations/hero-hastings.jpg",
  "placeholder/hero-lewes.webp": "mad-graphics/locations/hero-lewes.jpg",
  "placeholder/hero-bexhill-on-sea.webp": "mad-graphics/locations/hero-bexhill-on-sea.jpg",
  "placeholder/hero-uckfield.webp": "mad-graphics/locations/hero-uckfield.jpg",
  "placeholder/hero-crowborough.webp": "mad-graphics/locations/hero-crowborough.jpg",
  "placeholder/hero-seaford.webp": "mad-graphics/locations/hero-seaford.jpg",
  "placeholder/hero-hailsham.webp": "mad-graphics/locations/hero-hailsham.jpg",
  "placeholder/hero-newhaven.webp": "mad-graphics/locations/hero-newhaven.jpg",
  "placeholder/hero-polegate.webp": "mad-graphics/locations/hero-polegate.jpg",
  "placeholder/hero-peacehaven.webp": "mad-graphics/locations/hero-peacehaven.jpg",
  "placeholder/hero-battle.webp": "mad-graphics/locations/hero-battle.jpg",
  "placeholder/hero-st-leonards-on-sea.webp": "mad-graphics/locations/hero-st-leonards-on-sea.jpg",
  "placeholder/hero-heathfield.webp": "mad-graphics/locations/hero-heathfield.jpg",
  "placeholder/hero-pevensey.webp": "mad-graphics/locations/hero-pevensey.jpg",
  "placeholder/hero-ringmer.webp": "mad-graphics/locations/hero-ringmer.jpg",
  "placeholder/hero-herstmonceux.webp": "mad-graphics/locations/hero-herstmonceux.jpg",
  "placeholder/hero-wadhurst.webp": "mad-graphics/locations/hero-wadhurst.jpg",
  "placeholder/hero-alfriston.webp": "mad-graphics/locations/hero-alfriston.jpg",

  // Blog
  "placeholder/blog-vehicle-graphics-guide.webp": "mad-graphics/blog/blog-vehicle-graphics-guide.jpg",
  "placeholder/blog-shop-signs-guide.webp": "mad-graphics/blog/blog-shop-signs-guide.jpg",

  // Projects
  "placeholder/project-fleet-eastbourne.webp": "mad-graphics/projects/project-fleet-eastbourne.jpg",
  "placeholder/project-fleet-eastbourne-1.webp": "mad-graphics/projects/project-fleet-eastbourne-1.jpg",
  "placeholder/project-fleet-eastbourne-2.webp": "mad-graphics/projects/project-fleet-eastbourne-2.jpg",
  "placeholder/project-fleet-eastbourne-3.webp": "mad-graphics/projects/project-fleet-eastbourne-3.jpg",
};

function findMdxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (entry.endsWith(".mdx")) {
      results.push(full);
    }
  }
  return results;
}

function processFile(filePath: string): { changed: boolean; replacements: number } {
  const content = fs.readFileSync(filePath, "utf-8");
  let updated = content;
  let replacements = 0;

  for (const [placeholder, r2Path] of Object.entries(PLACEHOLDER_TO_R2)) {
    if (updated.includes(placeholder)) {
      updated = updated.replaceAll(placeholder, r2Path);
      replacements++;
    }
  }

  if (replacements > 0 && !dryRun) {
    fs.writeFileSync(filePath, updated, "utf-8");
  }

  return { changed: replacements > 0, replacements };
}

function main(): void {
  console.log("\nMad Graphics — MDX Image Reference Update");
  console.log("==========================================");
  console.log(`Dry run: ${dryRun}`);
  console.log();

  const files = findMdxFiles(SITE_CONTENT);
  console.log(`Found ${files.length} MDX files\n`);

  let totalChanged = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const relative = path.relative(process.cwd(), file);
    const { changed, replacements } = processFile(file);
    if (changed) {
      console.log(`  ${dryRun ? "[dry-run] Would update" : "Updated"}: ${relative} (${replacements} replacement${replacements > 1 ? "s" : ""})`);
      totalChanged++;
      totalReplacements += replacements;
    }
  }

  if (totalChanged === 0) {
    console.log("No placeholder references found — already up to date.");
  } else {
    console.log(`\n==========================================`);
    console.log(`Files updated:   ${totalChanged}`);
    console.log(`Total replaced:  ${totalReplacements}`);
    if (dryRun) {
      console.log(`\nRun without --dry-run to apply changes.`);
    } else {
      console.log(`\nMDX files updated. Rebuild the site to pick up new images.`);
    }
  }

  // Warn about any placeholder refs that still remain (no mapping defined)
  console.log("\nChecking for unmapped placeholders...");
  let unmapped = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const matches = content.match(/placeholder\/[^"']+/g);
    if (matches) {
      for (const m of matches) {
        console.warn(`  WARN: No mapping for "${m}" in ${path.relative(process.cwd(), file)}`);
        unmapped++;
      }
    }
  }
  if (unmapped === 0) {
    console.log("  All placeholder references mapped.");
  }
}

main();
