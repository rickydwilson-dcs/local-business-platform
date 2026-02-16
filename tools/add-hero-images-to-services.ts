#!/usr/bin/env tsx
/**
 * Add hero images to DJ Fox service MDX files
 *
 * This script adds both `image` (for cards) and `hero.image` (for hero sections)
 * to service MDX frontmatter, following the same pattern as locations.
 *
 * Images are placeholders based on category. Replace with service-specific images at:
 * djfoxelectrical/services/[service-slug].jpg
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const SERVICES_DIR = join(process.cwd(), "sites/dj-fox-electrical/content/services");

// Map categories to generic hero images (category-level fallbacks)
const CATEGORY_IMAGES: Record<string, string> = {
  installation: "djfoxelectrical/categories/installation-category.jpg",
  maintenance: "djfoxelectrical/categories/maintenance-category.jpg",
  repair: "djfoxelectrical/categories/repair-category.jpg",
};

const DEFAULT_IMAGE = "djfoxelectrical/hero/services-hero.jpg";

function addHeroImages() {
  const files = readdirSync(SERVICES_DIR).filter((f) => f.endsWith(".mdx"));

  console.log(`\nProcessing ${files.length} service files...\n`);

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = join(SERVICES_DIR, file);
    const content = readFileSync(filePath, "utf-8");
    const { data, content: mdxContent } = matter(content);

    // Skip if already has both image and hero.image
    if ((data.image || data.heroImage) && data.hero?.image) {
      console.log(`⏭️  ${file} - already has images`);
      skipped++;
      continue;
    }

    // Determine image based on category
    const category = data.category as string | undefined;
    const placeholderImage =
      category && CATEGORY_IMAGES[category] ? CATEGORY_IMAGES[category] : DEFAULT_IMAGE;

    // Add image field (for ContentCard in services listing)
    if (!data.image && !data.heroImage) {
      data.image = placeholderImage;
    }

    // Add hero.image field (for ServiceHero on individual pages)
    if (!data.hero) {
      data.hero = {};
    }
    if (!data.hero.image) {
      data.hero.image = placeholderImage;
    }

    // Reconstruct file
    const newContent = matter.stringify(mdxContent, data);
    writeFileSync(filePath, newContent, "utf-8");

    console.log(`✅ ${file} - added images: ${placeholderImage}`);
    updated++;
  }

  console.log(`\n✨ Complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\nNote: These are category-level placeholder images.`);
  console.log(`For service-specific images, upload to R2 at:`);
  console.log(`  djfoxelectrical/services/[service-slug].jpg`);
  console.log(`\nThen update the frontmatter in each service MDX file.`);
}

addHeroImages();
