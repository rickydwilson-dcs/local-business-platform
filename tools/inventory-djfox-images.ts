#!/usr/bin/env tsx
/**
 * DJ Fox Electrical - Complete Image Inventory
 * Scans all pages, components, and MDX files to create comprehensive image requirements list
 *
 * Usage: tsx tools/inventory-djfox-images.ts
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const SITE_DIR = path.join(process.cwd(), "sites/dj-fox-electrical");
const SERVICES_DIR = path.join(SITE_DIR, "content/services");
const LOCATIONS_DIR = path.join(SITE_DIR, "content/locations");
const BLOG_DIR = path.join(SITE_DIR, "content/blog");
const PROJECTS_DIR = path.join(SITE_DIR, "content/projects");
const OUTPUT_FILE = path.join(process.cwd(), "output/djfox-image-inventory.json");

interface ImageRequirement {
  id: string;
  category: "main" | "service-hero" | "location-hero" | "blog" | "project" | "component";
  path: string;
  description: string;
  dimensions: string;
  priority: "high" | "medium" | "low";
  status: "required" | "optional";
  r2Key: string;
  usedIn: string[];
}

interface Inventory {
  generated: string;
  totalImages: number;
  breakdown: {
    main: number;
    serviceHeros: number;
    locationHeros: number;
    blog: number;
    projects: number;
    other: number;
  };
  images: ImageRequirement[];
}

/**
 * Main page images (static pages)
 */
function getMainPageImages(): ImageRequirement[] {
  return [
    {
      id: "main-hero-home",
      category: "main",
      path: "djfoxelectrical/hero/hero-electrician-work.jpg",
      description: "Homepage hero - electrician working on electrical panel",
      dimensions: "1920x1080",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/hero/hero-electrician-work.jpg",
      usedIn: ["app/page.tsx"],
    },
    {
      id: "main-hero-about",
      category: "main",
      path: "djfoxelectrical/hero/about-hero.jpg",
      description: "About page hero - team photo or professional portrait",
      dimensions: "1920x1080",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/hero/about-hero.jpg",
      usedIn: ["app/about/page.tsx"],
    },
    {
      id: "main-hero-services",
      category: "main",
      path: "djfoxelectrical/hero/services-hero.jpg",
      description: "Services page hero - electrical services in action",
      dimensions: "1920x1080",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/hero/services-hero.jpg",
      usedIn: ["app/services/page.tsx"],
    },
    {
      id: "main-hero-contact",
      category: "main",
      path: "djfoxelectrical/hero/contact-hero.jpg",
      description: "Contact page hero - professional setting or consultation",
      dimensions: "1920x1080",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/hero/contact-hero.jpg",
      usedIn: ["app/contact/page.tsx"],
    },
    {
      id: "main-hero-pricing",
      category: "main",
      path: "djfoxelectrical/hero/pricing-hero.jpg",
      description: "Pricing page hero - electrical inspection or testing",
      dimensions: "1920x1080",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/hero/pricing-hero.jpg",
      usedIn: ["app/pricing/page.tsx"],
    },
    {
      id: "main-category-installation",
      category: "main",
      path: "djfoxelectrical/categories/installation-work.jpg",
      description: "Installation category card - homepage",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/installation-work.jpg",
      usedIn: ["app/page.tsx"],
    },
    {
      id: "main-category-installation-services",
      category: "main",
      path: "djfoxelectrical/categories/installation-category.jpg",
      description: "Installation category card - services page",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/installation-category.jpg",
      usedIn: ["app/services/page.tsx"],
    },
    {
      id: "main-category-maintenance",
      category: "main",
      path: "djfoxelectrical/categories/maintenance-work.jpg",
      description: "Maintenance category card - homepage",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/maintenance-work.jpg",
      usedIn: ["app/page.tsx"],
    },
    {
      id: "main-category-maintenance-services",
      category: "main",
      path: "djfoxelectrical/categories/maintenance-category.jpg",
      description: "Maintenance category card - services page",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/maintenance-category.jpg",
      usedIn: ["app/services/page.tsx"],
    },
    {
      id: "main-category-repair",
      category: "main",
      path: "djfoxelectrical/categories/repair-work.jpg",
      description: "Repair category card - homepage",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/repair-work.jpg",
      usedIn: ["app/page.tsx"],
    },
    {
      id: "main-category-repair-services",
      category: "main",
      path: "djfoxelectrical/categories/repair-category.jpg",
      description: "Repair category card - services page",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/categories/repair-category.jpg",
      usedIn: ["app/services/page.tsx"],
    },
    {
      id: "main-section-working",
      category: "main",
      path: "djfoxelectrical/sections/electrician-working.jpg",
      description: "About page 50/50 section - electrician at work",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/sections/electrician-working.jpg",
      usedIn: ["app/about/page.tsx"],
    },
    {
      id: "main-section-portrait",
      category: "main",
      path: "djfoxelectrical/sections/electrician-portrait.jpg",
      description: "Contact page form section - professional portrait",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/sections/electrician-portrait.jpg",
      usedIn: ["app/contact/page.tsx"],
    },
    {
      id: "main-section-inspection",
      category: "main",
      path: "djfoxelectrical/sections/electrical-inspection.jpg",
      description: "Pricing page checklist section - safety inspection",
      dimensions: "800x600",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/sections/electrical-inspection.jpg",
      usedIn: ["app/pricing/page.tsx"],
    },
    {
      id: "main-team-daniel",
      category: "main",
      path: "djfoxelectrical/team/daniel-fox.jpg",
      description: "Team section - Daniel Fox circular portrait",
      dimensions: "512x512",
      priority: "high",
      status: "required",
      r2Key: "djfoxelectrical/team/daniel-fox.jpg",
      usedIn: ["app/about/page.tsx"],
    },
  ];
}

/**
 * Scan service MDX files for hero image requirements
 */
function scanServiceImages(): ImageRequirement[] {
  const images: ImageRequirement[] = [];

  if (!fs.existsSync(SERVICES_DIR)) {
    return images;
  }

  const files = fs
    .readdirSync(SERVICES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(SERVICES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    // Check if heroImage is already defined
    const hasHeroImage = data.heroImage || data.hero?.image;

    images.push({
      id: `service-${slug}`,
      category: "service-hero",
      path: `djfoxelectrical/services/${slug}.jpg`,
      description: `Service page hero: ${data.title || slug}`,
      dimensions: "1920x1080",
      priority: "medium",
      status: hasHeroImage ? "optional" : "required",
      r2Key: `djfoxelectrical/services/${slug}.jpg`,
      usedIn: [`app/services/[slug]/page.tsx - ${slug}`],
    });
  }

  return images;
}

/**
 * Scan location MDX files for hero image requirements
 */
function scanLocationImages(): ImageRequirement[] {
  const images: ImageRequirement[] = [];

  if (!fs.existsSync(LOCATIONS_DIR)) {
    return images;
  }

  const files = fs
    .readdirSync(LOCATIONS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(LOCATIONS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    // Check if heroImage is already defined
    const hasHeroImage = data.heroImage || data.hero?.image;

    images.push({
      id: `location-${slug}`,
      category: "location-hero",
      path: `djfoxelectrical/locations/${slug}.jpg`,
      description: `Location page hero: ${data.title || slug}`,
      dimensions: "1920x1080",
      priority: "medium",
      status: hasHeroImage ? "optional" : "required",
      r2Key: `djfoxelectrical/locations/${slug}.jpg`,
      usedIn: [`app/locations/[slug]/page.tsx - ${slug}`],
    });
  }

  return images;
}

/**
 * Scan blog MDX files for hero image requirements
 */
function scanBlogImages(): ImageRequirement[] {
  const images: ImageRequirement[] = [];

  if (!fs.existsSync(BLOG_DIR)) {
    return images;
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    const hasHeroImage = data.heroImage || data.image;

    images.push({
      id: `blog-${slug}`,
      category: "blog",
      path: `djfoxelectrical/blog/${slug}.jpg`,
      description: `Blog post image: ${data.title || slug}`,
      dimensions: "1200x630",
      priority: "low",
      status: hasHeroImage ? "optional" : "required",
      r2Key: `djfoxelectrical/blog/${slug}.jpg`,
      usedIn: [`app/blog/[slug]/page.tsx - ${slug}`],
    });
  }

  return images;
}

/**
 * Scan project MDX files for hero image requirements
 */
function scanProjectImages(): ImageRequirement[] {
  const images: ImageRequirement[] = [];

  if (!fs.existsSync(PROJECTS_DIR)) {
    return images;
  }

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(PROJECTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    const hasHeroImage = data.heroImage || data.featuredImage;

    images.push({
      id: `project-${slug}`,
      category: "project",
      path: `djfoxelectrical/projects/${slug}.jpg`,
      description: `Project image: ${data.title || slug}`,
      dimensions: "800x600",
      priority: "low",
      status: hasHeroImage ? "optional" : "required",
      r2Key: `djfoxelectrical/projects/${slug}.jpg`,
      usedIn: [`app/projects/[slug]/page.tsx - ${slug}`],
    });
  }

  return images;
}

/**
 * Generate complete inventory
 */
function generateInventory(): Inventory {
  console.log("📊 Scanning DJ Fox Electrical site for image requirements...\n");

  const mainImages = getMainPageImages();
  const serviceImages = scanServiceImages();
  const locationImages = scanLocationImages();
  const blogImages = scanBlogImages();
  const projectImages = scanProjectImages();

  const allImages = [
    ...mainImages,
    ...serviceImages,
    ...locationImages,
    ...blogImages,
    ...projectImages,
  ];

  const inventory: Inventory = {
    generated: new Date().toISOString(),
    totalImages: allImages.length,
    breakdown: {
      main: mainImages.length,
      serviceHeros: serviceImages.length,
      locationHeros: locationImages.length,
      blog: blogImages.length,
      projects: projectImages.length,
      other: 0,
    },
    images: allImages,
  };

  return inventory;
}

/**
 * Main execution
 */
function main(): void {
  console.log("🖼️  DJ Fox Electrical - Image Inventory Generator\n");

  const inventory = generateInventory();

  console.log("📋 Inventory Summary:");
  console.log(`   Total images required: ${inventory.totalImages}`);
  console.log(`   Main pages: ${inventory.breakdown.main}`);
  console.log(`   Service heros: ${inventory.breakdown.serviceHeros}`);
  console.log(`   Location heros: ${inventory.breakdown.locationHeros}`);
  console.log(`   Blog images: ${inventory.breakdown.blog}`);
  console.log(`   Project images: ${inventory.breakdown.projects}`);
  console.log(``);

  // Calculate required vs optional
  const required = inventory.images.filter((img) => img.status === "required").length;
  const optional = inventory.images.filter((img) => img.status === "optional").length;

  console.log("📊 Status Breakdown:");
  console.log(`   Required: ${required}`);
  console.log(`   Optional: ${optional}`);
  console.log(``);

  // Priority breakdown
  const high = inventory.images.filter((img) => img.priority === "high").length;
  const medium = inventory.images.filter((img) => img.priority === "medium").length;
  const low = inventory.images.filter((img) => img.priority === "low").length;

  console.log("🎯 Priority Breakdown:");
  console.log(`   High: ${high}`);
  console.log(`   Medium: ${medium}`);
  console.log(`   Low: ${low}`);
  console.log(``);

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2));

  console.log(`✅ Inventory saved to: ${OUTPUT_FILE}`);
  console.log(``);
  console.log("📝 Next steps:");
  console.log(`   1. Review inventory: cat ${OUTPUT_FILE}`);
  console.log(`   2. Generate images: tsx tools/generate-djfox-images.ts --type all`);
  console.log(`   3. Or generate by priority: tsx tools/generate-djfox-images.ts --type main`);
}

if (require.main === module) {
  main();
}
