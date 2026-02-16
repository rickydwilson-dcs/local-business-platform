#!/usr/bin/env tsx
/**
 * DJ Fox Electrical - Image Generation Script
 * Generates all hero images for services, locations, and main pages using Gemini API
 *
 * Usage:
 *   tsx tools/generate-djfox-images.ts --type [all|main|services|locations] [--limit N]
 *
 * Examples:
 *   tsx tools/generate-djfox-images.ts --type main              # Generate 14 main page images
 *   tsx tools/generate-djfox-images.ts --type services --limit 5 # Generate first 5 services
 *   tsx tools/generate-djfox-images.ts --type locations --limit 10 # Generate first 10 locations
 *   tsx tools/generate-djfox-images.ts --type all --limit 20     # Generate 20 total images
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import matter from "gray-matter";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SITE_DIR = path.join(process.cwd(), "sites/dj-fox-electrical");
const SERVICES_DIR = path.join(SITE_DIR, "content/services");
const LOCATIONS_DIR = path.join(SITE_DIR, "content/locations");
const OUTPUT_DIR = path.join(process.cwd(), "output/generated-images/djfoxelectrical");
const GEMINI_MODEL = "gemini-3-pro-image-preview";

interface ImageTask {
  id: string;
  type: "main" | "service" | "location";
  title: string;
  prompt: string;
  outputPath: string;
  r2Key: string;
}

// Base prompt context for electrical services
const ELECTRICAL_CONTEXT = {
  setting: "professional electrical contractor working in Eastbourne, East Sussex, UK",
  equipment: "modern electrical tools, testing equipment, cable management systems",
  safety: "electrician wearing appropriate PPE, high-visibility clothing",
  style:
    "photorealistic, professional photography style, natural daylight, sharp focus, commercial quality",
  location: "typical British residential or commercial property",
};

/**
 * Generate prompt for main page images
 */
function generateMainPagePrompt(pageName: string): string {
  const prompts: Record<string, string> = {
    "hero-electrician-work": `Professional electrician working on an electrical consumer unit/distribution board in a modern UK home. Close-up view showing skilled hands using testing equipment and installing circuit breakers. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Modern British interior, ${ELECTRICAL_CONTEXT.style}. Image should convey expertise, safety, and professionalism.`,

    "about-hero": `Portrait of a professional electrician in front of an electrical service van in Eastbourne, East Sussex. Friendly, approachable demeanor, wearing clean work uniform with company branding. Van has electrical equipment visible. ${ELECTRICAL_CONTEXT.location} in background, ${ELECTRICAL_CONTEXT.style}. Image should convey trustworthiness and professionalism.`,

    "services-hero": `Wide-angle shot of a professional electrician installing LED lighting in a modern commercial building in East Sussex. Shows the electrician on a stepladder working on ceiling lighting fixtures. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Modern British commercial interior with professional electrical work, ${ELECTRICAL_CONTEXT.style}.`,

    "contact-hero": `Professional electrical consultation scene - electrician discussing electrical plans with a homeowner at a residential property in Eastbourne. Both looking at electrical diagrams or tablet. Friendly, professional atmosphere. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Image should convey approachability and customer service.`,

    "pricing-hero": `Electrician conducting an electrical inspection with testing equipment (multimeter) on a consumer unit. Close-up of hands holding testing probes, digital display showing readings. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Professional electrical safety inspection, ${ELECTRICAL_CONTEXT.style}. Image should convey thorough, professional testing.`,

    "installation-work": `New electrical installation work - electrician installing power sockets and wiring in a newly renovated British home. Shows first-fix electrical work with cables being run and back boxes being fitted. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}.`,

    "installation-category": `Professional electrical installation of a new consumer unit/fuse box on a white wall. Shows modern circuit breakers and neat cable management. ${ELECTRICAL_CONTEXT.equipment}. Clean, professional installation work, ${ELECTRICAL_CONTEXT.style}. Focus on quality workmanship.`,

    "maintenance-work": `Electrician performing routine electrical maintenance, testing sockets and switches with professional testing equipment in a UK residential property. Shows careful testing procedures and attention to detail. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}.`,

    "maintenance-category": `Close-up of electrical maintenance work - electrician checking wiring connections in an opened consumer unit. Shows neat wiring, properly labeled circuits, and professional cable management. ${ELECTRICAL_CONTEXT.equipment}. Professional maintenance standards, ${ELECTRICAL_CONTEXT.style}.`,

    "repair-work": `Emergency electrical repair - electrician troubleshooting and fixing an electrical fault with testing equipment. Focused work with multimeter and tools. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Image should convey expertise in fault-finding.`,

    "repair-category": `Electrical repair work - electrician replacing a faulty circuit breaker in a consumer unit. Shows professional repair techniques and proper safety procedures. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Professional repair work, ${ELECTRICAL_CONTEXT.style}.`,

    "electrician-working": `Professional electrician working on electrical wiring installation in a domestic property. Side view showing skilled craftsman at work with cables and tools. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Image should show craftsmanship and attention to detail.`,

    "electrician-portrait": `Professional portrait of friendly, approachable electrician in clean work uniform, holding electrical testing equipment. Bright, professional studio-style lighting. Confident, trustworthy expression. ${ELECTRICAL_CONTEXT.style}. Suitable for contact page and team photos.`,

    "electrical-inspection": `Electrical safety inspection - EICR testing in progress. Electrician using professional test equipment on electrical installation, documenting results. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Image should convey thoroughness and compliance.`,
  };

  return prompts[pageName] || `Professional electrical work image for ${pageName}`;
}

/**
 * Generate prompt for service pages
 */
function generateServicePrompt(serviceTitle: string, serviceSlug: string): string {
  // Extract keywords from service title
  const lowercaseTitle = serviceTitle.toLowerCase();

  // Service-specific contexts
  if (lowercaseTitle.includes("emergency") || lowercaseTitle.includes("callout")) {
    return `Emergency electrical callout scenario - professional electrician arriving at a UK residential property with equipment and tools ready. Sense of urgency but professional composure. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Evening/night lighting for emergency context. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Red emergency van lights optional.`;
  }

  if (lowercaseTitle.includes("ev charger") || lowercaseTitle.includes("electric vehicle")) {
    return `Professional installation of an EV charger (electric vehicle charging point) on an exterior wall of a UK home. Modern white EV charger unit being installed by qualified electrician. Shows proper outdoor electrical installation. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}.`;
  }

  if (lowercaseTitle.includes("consumer unit") || lowercaseTitle.includes("fuse box")) {
    return `Electrician installing or upgrading a modern consumer unit (fuse box) in a UK property. Shows new RCD protection, circuit breakers, and professional cable management. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. Clean, professional installation. ${ELECTRICAL_CONTEXT.style}.`;
  }

  if (lowercaseTitle.includes("rewiring") || lowercaseTitle.includes("rewire")) {
    return `Full house rewiring in progress - electrician running new electrical cables through walls/ceilings in a UK property. Shows first-fix electrical work with proper cable routes. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Renovation/upgrade context.`;
  }

  if (lowercaseTitle.includes("lighting") || lowercaseTitle.includes("led")) {
    return `Professional electrical lighting installation - electrician fitting modern LED downlights in ceiling. Shows proper lighting circuit work and professional finish. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Well-lit, modern interior.`;
  }

  if (lowercaseTitle.includes("socket") || lowercaseTitle.includes("power point")) {
    return `Electrician installing additional power sockets in a UK residential property. Shows proper back box installation and neat cable routing. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Professional socket installation work.`;
  }

  if (
    lowercaseTitle.includes("eicr") ||
    lowercaseTitle.includes("safety") ||
    lowercaseTitle.includes("inspection")
  ) {
    return `Professional EICR electrical safety inspection - qualified electrician testing electrical installation with calibrated test equipment. Shows thorough testing procedures and documentation. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Compliance and safety focus.`;
  }

  if (lowercaseTitle.includes("fire alarm") || lowercaseTitle.includes("smoke")) {
    return `Installation of fire alarm system - electrician fitting smoke/heat detectors and testing system in UK property. Shows modern fire detection equipment and proper installation. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Safety system installation.`;
  }

  if (lowercaseTitle.includes("cctv") || lowercaseTitle.includes("security")) {
    return `Professional CCTV/security system installation - electrician mounting security cameras and running data cables on UK property exterior. Shows modern IP cameras and professional cable management. ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}.`;
  }

  // Generic electrical work prompt
  return `Professional electrician performing ${serviceTitle.toLowerCase()} work in Eastbourne, East Sussex. Shows skilled electrical work with ${ELECTRICAL_CONTEXT.equipment}, ${ELECTRICAL_CONTEXT.safety}. ${ELECTRICAL_CONTEXT.location}, ${ELECTRICAL_CONTEXT.style}. Image should convey expertise and professional service for ${serviceTitle}.`;
}

/**
 * Generate prompt for location pages
 */
function generateLocationPrompt(locationTitle: string): string {
  // Extract location name
  const location = locationTitle.replace(/Electrician in |Electrical Services in /gi, "").trim();

  return `Iconic landmark or street view of ${location}, East Sussex, UK. Shows recognizable buildings, town center, or characteristic architecture that represents ${location}. Professional photography, clear blue sky or pleasant overcast British weather, well-maintained streets. ${ELECTRICAL_CONTEXT.style}. Image should be suitable for local business service area page, showing the town/area in a positive, welcoming light. No people required, focus on place/architecture.`;
}

/**
 * Scan services directory
 */
function scanServices(limit?: number): ImageTask[] {
  const tasks: ImageTask[] = [];

  if (!fs.existsSync(SERVICES_DIR)) {
    console.warn(`⚠️  Services directory not found: ${SERVICES_DIR}`);
    return tasks;
  }

  const files = fs
    .readdirSync(SERVICES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const filesToProcess = limit ? files.slice(0, limit) : files;

  for (const file of filesToProcess) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(SERVICES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    tasks.push({
      id: `service-${slug}`,
      type: "service",
      title: data.title || slug,
      prompt: generateServicePrompt(data.title || slug, slug),
      outputPath: path.join(OUTPUT_DIR, "services", `${slug}.jpg`),
      r2Key: `djfoxelectrical/services/${slug}.jpg`,
    });
  }

  return tasks;
}

/**
 * Scan locations directory
 */
function scanLocations(limit?: number): ImageTask[] {
  const tasks: ImageTask[] = [];

  if (!fs.existsSync(LOCATIONS_DIR)) {
    console.warn(`⚠️  Locations directory not found: ${LOCATIONS_DIR}`);
    return tasks;
  }

  const files = fs
    .readdirSync(LOCATIONS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const filesToProcess = limit ? files.slice(0, limit) : files;

  for (const file of filesToProcess) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(LOCATIONS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    tasks.push({
      id: `location-${slug}`,
      type: "location",
      title: data.title || slug,
      prompt: generateLocationPrompt(data.title || slug),
      outputPath: path.join(OUTPUT_DIR, "locations", `${slug}.jpg`),
      r2Key: `djfoxelectrical/locations/${slug}.jpg`,
    });
  }

  return tasks;
}

/**
 * Get main page image tasks
 */
function getMainPageTasks(): ImageTask[] {
  const mainImages = [
    { name: "hero-electrician-work", folder: "hero" },
    { name: "about-hero", folder: "hero" },
    { name: "services-hero", folder: "hero" },
    { name: "contact-hero", folder: "hero" },
    { name: "pricing-hero", folder: "hero" },
    { name: "installation-work", folder: "categories" },
    { name: "installation-category", folder: "categories" },
    { name: "maintenance-work", folder: "categories" },
    { name: "maintenance-category", folder: "categories" },
    { name: "repair-work", folder: "categories" },
    { name: "repair-category", folder: "categories" },
    { name: "electrician-working", folder: "sections" },
    { name: "electrician-portrait", folder: "sections" },
    { name: "electrical-inspection", folder: "sections" },
  ];

  return mainImages.map((img) => ({
    id: `main-${img.name}`,
    type: "main" as const,
    title: img.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    prompt: generateMainPagePrompt(img.name),
    outputPath: path.join(OUTPUT_DIR, img.folder, `${img.name}.jpg`),
    r2Key: `djfoxelectrical/${img.folder}/${img.name}.jpg`,
  }));
}

/**
 * Generate a single image
 */
async function generateImage(task: ImageTask, genAI: GoogleGenerativeAI): Promise<boolean> {
  console.log(`\n🎨 Generating: ${task.title}`);
  console.log(`   Type: ${task.type}`);
  console.log(`   Prompt: ${task.prompt.substring(0, 100)}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities is available but not in types yet
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const result = await model.generateContent(task.prompt);
    const response = result.response;

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in API response");
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in API response");
    }

    let imageBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!imageBuffer) {
      throw new Error("No image data found in API response");
    }

    // Ensure output directory exists
    const dir = path.dirname(task.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(task.outputPath, imageBuffer);

    console.log(`   ✅ Saved: ${task.outputPath}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  // Parse command line args
  const args = process.argv.slice(2);
  const typeArg =
    args.find((arg) => arg.startsWith("--type="))?.split("=")[1] ||
    (args.includes("--type") ? args[args.indexOf("--type") + 1] : "all");
  const limitArg =
    args.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ||
    (args.includes("--limit") ? args[args.indexOf("--limit") + 1] : undefined);
  const limit = limitArg ? parseInt(limitArg, 10) : undefined;

  // Validate API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error("\n❌ Error: GOOGLE_AI_API_KEY environment variable is required");
    console.log("\nAdd to .env.local:");
    console.log("GOOGLE_AI_API_KEY=your-api-key-here");
    process.exit(1);
  }

  // Build task list
  let tasks: ImageTask[] = [];

  if (typeArg === "all" || typeArg === "main") {
    tasks.push(...getMainPageTasks());
  }

  if (typeArg === "all" || typeArg === "services") {
    tasks.push(...scanServices(typeArg === "services" ? limit : undefined));
  }

  if (typeArg === "all" || typeArg === "locations") {
    tasks.push(...scanLocations(typeArg === "locations" ? limit : undefined));
  }

  // Apply global limit if set and type is "all"
  if (typeArg === "all" && limit) {
    tasks = tasks.slice(0, limit);
  }

  if (tasks.length === 0) {
    console.error("\n❌ No tasks to process");
    console.log(
      "\nUsage: tsx tools/generate-djfox-images.ts --type [all|main|services|locations] [--limit N]"
    );
    process.exit(1);
  }

  console.log(`\n📋 Total images to generate: ${tasks.length}\n`);
  console.log(`Types breakdown:`);
  console.log(`   Main pages: ${tasks.filter((t) => t.type === "main").length}`);
  console.log(`   Services: ${tasks.filter((t) => t.type === "service").length}`);
  console.log(`   Locations: ${tasks.filter((t) => t.type === "location").length}`);
  console.log(``);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKey);

  // Generate images with progress tracking
  let completed = 0;
  let failed = 0;

  for (const task of tasks) {
    const success = await generateImage(task, genAI);
    if (success) {
      completed++;
    } else {
      failed++;
    }

    // Rate limiting pause (Gemini has rate limits)
    if (completed + failed < tasks.length) {
      console.log(`   ⏳ Waiting 3 seconds before next image...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   ✅ Completed: ${completed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Output directory: ${OUTPUT_DIR}`);
  console.log(``);
  console.log(`📝 Next steps:`);
  console.log(`   1. Review generated images in: ${OUTPUT_DIR}`);
  console.log(`   2. Upload to R2: tsx tools/upload-djfox-images.ts`);
  console.log(`   3. Test site with real images`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
}
