#!/usr/bin/env tsx
/**
 * Location Page Generator CLI
 *
 * Generates MDX location pages using AI (Claude or Gemini).
 * Each location page contains hero, specialists, services, FAQs, and pricing sections.
 *
 * Usage:
 *   tsx tools/generate-locations.ts --site colossus-reference --context context.json
 *   tsx tools/generate-locations.ts --site colossus-reference --context context.json --provider=gemini
 *   tsx tools/generate-locations.ts --site colossus-reference --locations "brighton,hastings"
 *   tsx tools/generate-locations.ts --site colossus-reference --context context.json --dry-run
 *   tsx tools/generate-locations.ts --site colossus-reference --context context.json --force
 *   tsx tools/generate-locations.ts --site colossus-reference --context context.json --limit 3
 */

import * as path from "path";
import * as fs from "fs/promises";
import * as dotenv from "dotenv";
import * as yaml from "yaml";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { getAIClient, hasAPIKey, type AIProvider, type AIClient } from "./lib/ai-provider";
import {
  loadBusinessContext,
  getAllLocations,
  getRegionForLocation,
  toSlug,
  type BusinessContext,
  type LocationDefinition,
  type GenerateLocationsOptions,
  type LocationGenerationResult,
  type LocationFrontmatter,
  type LocationHeroSection,
  type SpecialistsSection,
  type LocationServicesSection,
  type FAQItem,
  type LocationPricingSection,
} from "./lib/content-generator-types";
import {
  getLocationHeroPrompt,
  getLocationSpecialistsPrompt,
  getLocationServicesPrompt,
  getLocationFAQsPrompt,
  getLocationPricingPrompt,
  getLocationSystemPrompt,
  HERO_SECTION_SCHEMA,
  SPECIALISTS_SECTION_SCHEMA,
  SERVICES_SECTION_SCHEMA,
  FAQS_SCHEMA,
  PRICING_SECTION_SCHEMA,
} from "./lib/location-prompts";

// ============================================================================
// ANSI Color Codes
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function log(message: string, color?: keyof typeof colors): void {
  if (color) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  } else {
    console.log(message);
  }
}

function logSuccess(message: string): void {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

function logError(message: string): void {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function logWarning(message: string): void {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function logInfo(message: string): void {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

function logProgress(current: number, total: number, name: string): void {
  const percentage = Math.round((current / total) * 100);
  const bar = "=".repeat(Math.floor(percentage / 5)).padEnd(20, " ");
  console.log(
    `${colors.cyan}[${bar}]${colors.reset} ${percentage}% (${current}/${total}) - ${name}`
  );
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs(): GenerateLocationsOptions {
  const args = process.argv.slice(2);
  const options: GenerateLocationsOptions = {
    site: "",
    context: "",
    provider: "claude",
    dryRun: false,
    force: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--site=")) {
      options.site = arg.split("=")[1];
    } else if (arg.startsWith("--context=")) {
      options.context = arg.split("=")[1];
    } else if (arg.startsWith("--provider=")) {
      const provider = arg.split("=")[1];
      if (provider === "claude" || provider === "gemini") {
        options.provider = provider;
      } else {
        logError(`Invalid provider: ${provider}. Use 'claude' or 'gemini'.`);
        process.exit(1);
      }
    } else if (arg.startsWith("--locations=")) {
      options.locations = arg
        .split("=")[1]
        .split(",")
        .map((s) => s.trim());
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg.startsWith("--limit=")) {
      options.limit = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  // Validate required arguments
  if (!options.site) {
    logError("Missing required argument: --site");
    printHelp();
    process.exit(1);
  }
  if (!options.context) {
    logError("Missing required argument: --context");
    printHelp();
    process.exit(1);
  }

  return options;
}

function printHelp(): void {
  console.log(`
${colors.bright}Location Page Generator${colors.reset}

Generate MDX location pages using AI (Claude or Gemini).

${colors.cyan}Usage:${colors.reset}
  tsx tools/generate-locations.ts --site <site-name> --context <context-file> [options]

${colors.cyan}Required Arguments:${colors.reset}
  --site=<name>           Site directory name (e.g., "colossus-reference")
  --context=<file>        Path to business context JSON file

${colors.cyan}Options:${colors.reset}
  --provider=<provider>   AI provider: claude (default) or gemini
  --locations=<slugs>     Comma-separated location slugs to generate
  --dry-run               Preview without writing files
  --force                 Overwrite existing files
  --limit=<n>             Limit number of locations to generate
  --help, -h              Show this help message

${colors.cyan}Examples:${colors.reset}
  # Generate all locations using Claude
  tsx tools/generate-locations.ts --site colossus-reference --context context.json

  # Generate specific locations using Gemini
  tsx tools/generate-locations.ts --site colossus-reference --context context.json \\
    --provider=gemini --locations="brighton,hastings,eastbourne"

  # Preview without writing (dry run)
  tsx tools/generate-locations.ts --site colossus-reference --context context.json --dry-run

  # Force overwrite existing files
  tsx tools/generate-locations.ts --site colossus-reference --context context.json --force

  # Generate first 3 locations only
  tsx tools/generate-locations.ts --site colossus-reference --context context.json --limit 3

${colors.cyan}Environment Variables:${colors.reset}
  ANTHROPIC_API_KEY       Required for Claude provider
  GOOGLE_AI_API_KEY       Required for Gemini provider
`);
}

// ============================================================================
// Content Generation Functions
// ============================================================================

/**
 * Maximum retry attempts for section generation
 */
const MAX_RETRIES = 2;

/**
 * Delay between retries in milliseconds
 */
const RETRY_DELAY_MS = 2000;

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate hero section with retries
 */
async function generateHeroSection(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition
): Promise<{ success: boolean; data?: LocationHeroSection; error?: string }> {
  const prompt = getLocationHeroPrompt(context, location);
  const systemPrompt = getLocationSystemPrompt(context);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await client.generateStructured<LocationHeroSection>(
      prompt,
      HERO_SECTION_SCHEMA,
      {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1024,
      }
    );

    if (result.success && result.data) {
      // Add phone from context
      result.data.phone = context.business.phone;
      return { success: true, data: result.data };
    }

    if (attempt < MAX_RETRIES) {
      logWarning(`  Hero section generation failed, retrying (${attempt + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY_MS);
    } else {
      return { success: false, error: result.error || "Failed to generate hero section" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

/**
 * Generate specialists section with retries
 */
async function generateSpecialistsSection(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition
): Promise<{ success: boolean; data?: SpecialistsSection; error?: string }> {
  const prompt = getLocationSpecialistsPrompt(context, location);
  const systemPrompt = getLocationSystemPrompt(context);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await client.generateStructured<SpecialistsSection>(
      prompt,
      SPECIALISTS_SECTION_SCHEMA,
      {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2048,
      }
    );

    if (result.success && result.data) {
      // Add default styling properties
      result.data.columns = 3;
      result.data.backgroundColor = "gray";
      result.data.showBottomCTA = true;
      return { success: true, data: result.data };
    }

    if (attempt < MAX_RETRIES) {
      logWarning(
        `  Specialists section generation failed, retrying (${attempt + 1}/${MAX_RETRIES})...`
      );
      await sleep(RETRY_DELAY_MS);
    } else {
      return { success: false, error: result.error || "Failed to generate specialists section" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

/**
 * Generate services section with retries
 */
async function generateServicesSection(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition
): Promise<{ success: boolean; data?: LocationServicesSection; error?: string }> {
  const prompt = getLocationServicesPrompt(context, location);
  const systemPrompt = getLocationSystemPrompt(context);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await client.generateStructured<LocationServicesSection>(
      prompt,
      SERVICES_SECTION_SCHEMA,
      {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 4096,
      }
    );

    if (result.success && result.data) {
      return { success: true, data: result.data };
    }

    if (attempt < MAX_RETRIES) {
      logWarning(
        `  Services section generation failed, retrying (${attempt + 1}/${MAX_RETRIES})...`
      );
      await sleep(RETRY_DELAY_MS);
    } else {
      return { success: false, error: result.error || "Failed to generate services section" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

/**
 * Generate FAQs section with retries
 */
async function generateFAQsSection(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition
): Promise<{ success: boolean; data?: FAQItem[]; error?: string }> {
  const prompt = getLocationFAQsPrompt(context, location);
  const systemPrompt = getLocationSystemPrompt(context);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await client.generateStructured<{ faqs: FAQItem[] }>(prompt, FAQS_SCHEMA, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2048,
    });

    if (result.success && result.data?.faqs) {
      return { success: true, data: result.data.faqs };
    }

    if (attempt < MAX_RETRIES) {
      logWarning(`  FAQs section generation failed, retrying (${attempt + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY_MS);
    } else {
      return { success: false, error: result.error || "Failed to generate FAQs section" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

/**
 * Generate pricing section with retries
 */
async function generatePricingSection(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition
): Promise<{ success: boolean; data?: LocationPricingSection; error?: string }> {
  const prompt = getLocationPricingPrompt(context, location);
  const systemPrompt = getLocationSystemPrompt(context);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await client.generateStructured<LocationPricingSection>(
      prompt,
      PRICING_SECTION_SCHEMA,
      {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2048,
      }
    );

    if (result.success && result.data) {
      return { success: true, data: result.data };
    }

    if (attempt < MAX_RETRIES) {
      logWarning(
        `  Pricing section generation failed, retrying (${attempt + 1}/${MAX_RETRIES})...`
      );
      await sleep(RETRY_DELAY_MS);
    } else {
      return { success: false, error: result.error || "Failed to generate pricing section" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// ============================================================================
// Static Content Generation
// ============================================================================

/**
 * Generate static sections that don't need AI
 */
function generateStaticSections(
  context: BusinessContext,
  location: LocationDefinition,
  siteId: string
): Partial<LocationFrontmatter> {
  const region = getRegionForLocation(context, location.slug);

  // Generate keywords
  const keywords = [
    `${location.slug} ${context.business.industry}`,
    `${location.name.toLowerCase()} ${context.business.industry} hire`,
    `${context.business.industry} ${location.name.toLowerCase()}`,
  ];

  if (location.landmarks) {
    keywords.push(
      ...location.landmarks.slice(0, 3).map((l) => `${l} ${context.business.industry}`)
    );
  }

  if (location.isCoastal) {
    keywords.push(`coastal ${context.business.industry}`, `seafront ${context.business.industry}`);
  }

  if (location.hasHeritage) {
    keywords.push(
      `heritage ${context.business.industry}`,
      `listed building ${context.business.industry}`
    );
  }

  // Generate local authority section
  const localAuthority = location.localAuthority
    ? {
        title: `Local ${location.name} Expertise`,
        description: `Established relationships with ${location.localAuthority} ensure smooth project delivery and full compliance with local regulations.`,
        locationName: location.name,
        authorityName: location.localAuthority,
        expertiseItems: [
          {
            title: `${location.localAuthority} planning procedures`,
            description: "Expert knowledge of local planning processes and requirements",
          },
          {
            title: "Conservation area requirements",
            description: "Understanding heritage constraints and sensitive area protocols",
          },
          {
            title: "Highway authority permits",
            description: "Efficient processing of street works and highway permits",
          },
          {
            title: "Building control coordination",
            description: "Direct liaison with building control officers",
          },
        ],
        supportItems: [
          {
            title: "Fast-Track Applications",
            description: `Our established relationships with ${location.localAuthority} mean faster processing times for your permits.`,
          },
          {
            title: "Compliance Guarantee",
            description: `All installations meet or exceed ${location.localAuthority} safety standards.`,
          },
        ],
      }
    : undefined;

  // Generate coverage section
  const coverage = {
    description: `Comprehensive ${context.business.industry} coverage throughout ${location.name} and surrounding areas.`,
    areas: location.neighborhoods || [
      `${location.name} Town Centre`,
      `${location.name} Residential Areas`,
      `${location.name} Commercial Districts`,
      "Surrounding Villages",
    ],
  };

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: "Locations", href: "/locations" },
    { name: location.name, href: `/locations/${location.slug}`, current: true },
  ];

  // Generate schema
  const schema = {
    service: {
      id: `https://www.${siteId.replace("-reference", "")}.co.uk/locations/${location.slug}#${context.business.industry}-service`,
      name: `${location.name} ${context.business.industry.charAt(0).toUpperCase() + context.business.industry.slice(1)} Services`,
      description: `Professional ${context.business.industry} services in ${location.name} covering all project types with full safety compliance.`,
      url: `https://www.${siteId.replace("-reference", "")}.co.uk/locations/${location.slug}`,
      serviceType: `${context.business.industry.charAt(0).toUpperCase() + context.business.industry.slice(1)} Services`,
      areaServed: [location.name, ...(location.neighborhoods?.slice(0, 4) || [])],
    },
  };

  // Generate CTA section
  const cta = {
    title: `Ready to Start Your ${location.name} Project?`,
    description: `Contact our expert team for professional ${context.business.industry} services in ${location.name}. Free quotes and rapid response times.`,
    primaryButtonText: "Get Free Quote",
    primaryButtonUrl: "/contact",
    secondaryButtonText: `Call: ${context.business.phone}`,
    secondaryButtonUrl: `tel:${context.business.phone.replace(/\s/g, "")}`,
    trustBadges: context.credentials.certifications.slice(0, 3),
  };

  return {
    title: location.name,
    seoTitle: `${location.name} ${context.business.industry.charAt(0).toUpperCase() + context.business.industry.slice(1)} Services`,
    keywords,
    heroImage: `${siteId}/hero/location/${location.slug}_01.webp`,
    localAuthority,
    coverage,
    breadcrumbs,
    schema,
    cta,
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Basic validation of generated frontmatter
 * More comprehensive validation happens via Zod schema in the site
 */
function validateFrontmatter(frontmatter: LocationFrontmatter): string[] {
  const errors: string[] = [];

  // Required fields
  if (!frontmatter.title || frontmatter.title.length < 2) {
    errors.push("title: Must be at least 2 characters");
  }
  if (!frontmatter.seoTitle || frontmatter.seoTitle.length < 10) {
    errors.push("seoTitle: Must be at least 10 characters");
  }
  if (!frontmatter.description || frontmatter.description.length < 50) {
    errors.push("description: Must be at least 50 characters");
  }
  if (frontmatter.description && frontmatter.description.length > 200) {
    errors.push("description: Must be less than 200 characters");
  }

  // Hero section
  if (!frontmatter.hero) {
    errors.push("hero: Required section is missing");
  } else {
    if (!frontmatter.hero.title || frontmatter.hero.title.length < 5) {
      errors.push("hero.title: Must be at least 5 characters");
    }
    if (!frontmatter.hero.description || frontmatter.hero.description.length < 20) {
      errors.push("hero.description: Must be at least 20 characters");
    }
    if (!frontmatter.hero.phone) {
      errors.push("hero.phone: Required field is missing");
    }
  }

  // Specialists section
  if (frontmatter.specialists) {
    if (!frontmatter.specialists.title || frontmatter.specialists.title.length < 5) {
      errors.push("specialists.title: Must be at least 5 characters");
    }
    if (!frontmatter.specialists.description || frontmatter.specialists.description.length < 50) {
      errors.push("specialists.description: Must be at least 50 characters");
    }
    if (!frontmatter.specialists.cards || frontmatter.specialists.cards.length < 1) {
      errors.push("specialists.cards: At least 1 card required");
    }
  }

  // Services section
  if (frontmatter.services) {
    if (!frontmatter.services.cards || frontmatter.services.cards.length < 3) {
      errors.push("services.cards: At least 3 service cards required");
    }
  }

  // FAQs
  if (frontmatter.faqs) {
    if (frontmatter.faqs.length < 5) {
      errors.push("faqs: At least 5 FAQs required");
    }
    if (frontmatter.faqs.length > 20) {
      errors.push("faqs: Maximum 20 FAQs allowed");
    }
  }

  return errors;
}

// ============================================================================
// MDX File Generation
// ============================================================================

/**
 * Generate MDX file content from frontmatter
 */
function generateMDXContent(frontmatter: LocationFrontmatter): string {
  const yamlContent = yaml.stringify(frontmatter, {
    lineWidth: 0, // Prevent line wrapping
    defaultKeyType: "PLAIN",
    defaultStringType: "QUOTE_DOUBLE",
  });

  return `---\n${yamlContent}---\n`;
}

/**
 * Write MDX file to disk
 */
async function writeMDXFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

/**
 * Check if file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Manifest Management
// ============================================================================

interface ManifestEntry {
  slug: string;
  name: string;
  status: "success" | "error" | "skipped";
  generatedAt: string;
  filePath: string;
  error?: string;
  validationErrors?: string[];
}

interface GenerationManifest {
  runAt: string;
  siteId: string;
  provider: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  entries: ManifestEntry[];
}

/**
 * Save generation manifest
 */
async function saveManifest(siteDir: string, manifest: GenerationManifest): Promise<void> {
  const manifestPath = path.join(siteDir, "content", "locations", ".generation-manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

// ============================================================================
// Main Generation Logic
// ============================================================================

/**
 * Generate a single location page
 */
async function generateLocation(
  client: AIClient,
  context: BusinessContext,
  location: LocationDefinition,
  siteDir: string,
  siteId: string,
  options: GenerateLocationsOptions
): Promise<LocationGenerationResult> {
  const filePath = path.join(siteDir, "content", "locations", `${location.slug}.mdx`);

  // Check if file exists
  if (!options.force && (await fileExists(filePath))) {
    return {
      slug: location.slug,
      name: location.name,
      status: "skipped",
      message: "File already exists (use --force to overwrite)",
      filePath,
    };
  }

  log(`\n  Generating content for ${location.name}...`, "cyan");

  // Generate static sections
  const staticSections = generateStaticSections(context, location, siteId);

  // Generate AI sections
  log("    - Generating hero section...", "dim");
  const heroResult = await generateHeroSection(client, context, location);
  if (!heroResult.success) {
    return {
      slug: location.slug,
      name: location.name,
      status: "error",
      message: `Hero generation failed: ${heroResult.error}`,
    };
  }

  log("    - Generating specialists section...", "dim");
  const specialistsResult = await generateSpecialistsSection(client, context, location);
  if (!specialistsResult.success) {
    return {
      slug: location.slug,
      name: location.name,
      status: "error",
      message: `Specialists generation failed: ${specialistsResult.error}`,
    };
  }

  log("    - Generating services section...", "dim");
  const servicesResult = await generateServicesSection(client, context, location);
  if (!servicesResult.success) {
    return {
      slug: location.slug,
      name: location.name,
      status: "error",
      message: `Services generation failed: ${servicesResult.error}`,
    };
  }

  log("    - Generating FAQs...", "dim");
  const faqsResult = await generateFAQsSection(client, context, location);
  if (!faqsResult.success) {
    return {
      slug: location.slug,
      name: location.name,
      status: "error",
      message: `FAQs generation failed: ${faqsResult.error}`,
    };
  }

  log("    - Generating pricing section...", "dim");
  const pricingResult = await generatePricingSection(client, context, location);
  if (!pricingResult.success) {
    return {
      slug: location.slug,
      name: location.name,
      status: "error",
      message: `Pricing generation failed: ${pricingResult.error}`,
    };
  }

  // Combine all sections
  const frontmatter: LocationFrontmatter = {
    ...staticSections,
    title: location.name,
    seoTitle: staticSections.seoTitle!,
    description: heroResult.data!.description,
    hero: heroResult.data!,
    specialists: specialistsResult.data!,
    services: servicesResult.data!,
    faqs: faqsResult.data!,
    pricing: pricingResult.data!,
  } as LocationFrontmatter;

  // Validate
  log("    - Validating frontmatter...", "dim");
  const validationErrors = validateFrontmatter(frontmatter);
  if (validationErrors.length > 0) {
    logWarning(`    Validation warnings for ${location.name}:`);
    validationErrors.forEach((err) => logWarning(`      - ${err}`));
  }

  // Generate MDX content
  const mdxContent = generateMDXContent(frontmatter);

  // Write file (unless dry run)
  if (options.dryRun) {
    log(`    [DRY RUN] Would write to: ${filePath}`, "yellow");
    log(`    Preview (first 500 chars):\n${mdxContent.substring(0, 500)}...`, "dim");
  } else {
    await writeMDXFile(filePath, mdxContent);
    logSuccess(`    Written: ${filePath}`);
  }

  return {
    slug: location.slug,
    name: location.name,
    status: "success",
    filePath,
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
  };
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  log("\n========================================", "bright");
  log("  Location Page Generator", "bright");
  log("========================================\n", "bright");

  // Parse arguments
  const options = parseArgs();

  // Validate API key
  if (!hasAPIKey(options.provider)) {
    logError(
      `API key not configured for ${options.provider}. Set ${options.provider === "claude" ? "ANTHROPIC_API_KEY" : "GOOGLE_AI_API_KEY"} in .env.local`
    );
    process.exit(1);
  }

  // Load business context
  logInfo(`Loading business context from: ${options.context}`);
  let context: BusinessContext;
  try {
    context = await loadBusinessContext(options.context);
    logSuccess(`Loaded context for: ${context.business.name}`);
  } catch (error) {
    logError(`Failed to load business context: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  // Get site directory
  const siteDir = path.join(process.cwd(), "sites", options.site);
  try {
    await fs.access(siteDir);
  } catch {
    logError(`Site directory not found: ${siteDir}`);
    process.exit(1);
  }

  // Get locations to generate
  let locations = getAllLocations(context);
  logInfo(`Found ${locations.length} locations in context`);

  // Filter by specific locations if provided
  if (options.locations && options.locations.length > 0) {
    locations = locations.filter((loc) => options.locations!.includes(loc.slug));
    logInfo(`Filtered to ${locations.length} specified locations`);
  }

  // Apply limit if provided
  if (options.limit && options.limit > 0) {
    locations = locations.slice(0, options.limit);
    logInfo(`Limited to first ${locations.length} locations`);
  }

  if (locations.length === 0) {
    logWarning("No locations to generate");
    process.exit(0);
  }

  // Initialize AI client
  logInfo(`Initializing ${options.provider} AI client...`);
  const client = getAIClient({ provider: options.provider });

  // Display options
  log("\nGeneration Options:", "cyan");
  log(`  Site: ${options.site}`);
  log(`  Provider: ${options.provider}`);
  log(`  Locations: ${locations.length}`);
  log(`  Dry Run: ${options.dryRun}`);
  log(`  Force: ${options.force}`);

  // Generate locations
  log("\n========================================", "bright");
  log("  Starting Generation", "bright");
  log("========================================\n", "bright");

  const results: LocationGenerationResult[] = [];
  const manifest: GenerationManifest = {
    runAt: new Date().toISOString(),
    siteId: options.site,
    provider: options.provider,
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    entries: [],
  };

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    logProgress(i + 1, locations.length, location.name);

    try {
      const result = await generateLocation(
        client,
        context,
        location,
        siteDir,
        options.site,
        options
      );
      results.push(result);

      manifest.entries.push({
        slug: result.slug,
        name: result.name,
        status: result.status,
        generatedAt: new Date().toISOString(),
        filePath: result.filePath || "",
        error: result.message,
        validationErrors: result.validationErrors,
      });

      if (result.status === "success") {
        manifest.successful++;
      } else if (result.status === "skipped") {
        manifest.skipped++;
      } else {
        manifest.failed++;
      }
      manifest.totalProcessed++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError(`  Failed to generate ${location.name}: ${errorMessage}`);
      results.push({
        slug: location.slug,
        name: location.name,
        status: "error",
        message: errorMessage,
      });
      manifest.failed++;
      manifest.totalProcessed++;
    }
  }

  // Save manifest
  if (!options.dryRun) {
    await saveManifest(siteDir, manifest);
    logInfo(
      `\nManifest saved to: ${path.join(siteDir, "content", "locations", ".generation-manifest.json")}`
    );
  }

  // Print summary
  log("\n========================================", "bright");
  log("  Generation Summary", "bright");
  log("========================================\n", "bright");

  const successful = results.filter((r) => r.status === "success").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "error").length;

  log(`Total Processed: ${results.length}`, "white");
  logSuccess(`Successful: ${successful}`);
  if (skipped > 0) logWarning(`Skipped: ${skipped}`);
  if (failed > 0) logError(`Failed: ${failed}`);

  if (failed > 0) {
    log("\nFailed Locations:", "red");
    results
      .filter((r) => r.status === "error")
      .forEach((r) => {
        logError(`  - ${r.name}: ${r.message}`);
      });
  }

  if (options.dryRun) {
    log("\n[DRY RUN] No files were written.", "yellow");
  }

  // Exit with error code if any failures
  if (failed > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    logError(`Fatal error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
}
