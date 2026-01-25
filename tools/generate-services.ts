#!/usr/bin/env tsx
/**
 * Service Page Generator
 *
 * Generates MDX service pages using AI (Claude or Gemini).
 * Uses structured output for reliable content generation.
 *
 * Usage:
 *   tsx tools/generate-services.ts --site colossus-reference --context context.json
 *   tsx tools/generate-services.ts --site colossus-reference --context context.json --provider=gemini
 *   tsx tools/generate-services.ts --site colossus-reference --services "residential-scaffolding,commercial-scaffolding"
 *   tsx tools/generate-services.ts --site colossus-reference --context context.json --dry-run
 *   tsx tools/generate-services.ts --site colossus-reference --context context.json --force
 *   tsx tools/generate-services.ts --site colossus-reference --context context.json --limit 3
 *
 * Environment Variables:
 *   ANTHROPIC_API_KEY - Required for Claude provider
 *   GOOGLE_AI_API_KEY - Required for Gemini provider
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { z } from "zod";
import * as yaml from "yaml";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import type { AIClient, AIProvider } from "./lib/ai-provider";
import { getAIClient, hasAPIKey, getAPIKeyEnvVar } from "./lib/ai-provider";
import {
  loadBusinessContext,
  validateBusinessContext,
  findServiceBySlug,
} from "./lib/business-context";
import {
  getServiceFrontmatterPrompt,
  getServiceFrontmatterSchema,
  type GeneratedServiceContent,
} from "./lib/content-prompts";
import type {
  BusinessContext,
  ServiceDefinition,
  GenerateServicesOptions,
  ServiceGenerationResult,
  GenerationSummary,
  GenerationManifest,
  GenerationItem,
  ServiceFrontmatter,
  FAQItem,
} from "./lib/content-generator-types";

// ============================================================================
// Constants
// ============================================================================

const VERSION = "1.0.0";
const MAX_RETRIES = 2;

// ANSI color codes
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// ============================================================================
// Console Helpers
// ============================================================================

/**
 * Print colored message to console
 */
function log(message: string, color?: keyof typeof COLORS): void {
  if (color) {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
  } else {
    console.log(message);
  }
}

/**
 * Print success message
 */
function logSuccess(message: string): void {
  console.log(`${COLORS.green}[OK]${COLORS.reset} ${message}`);
}

/**
 * Print error message
 */
function logError(message: string): void {
  console.log(`${COLORS.red}[ERROR]${COLORS.reset} ${message}`);
}

/**
 * Print warning message
 */
function logWarning(message: string): void {
  console.log(`${COLORS.yellow}[WARN]${COLORS.reset} ${message}`);
}

/**
 * Print info message
 */
function logInfo(message: string): void {
  console.log(`${COLORS.blue}[INFO]${COLORS.reset} ${message}`);
}

/**
 * Print progress
 */
function logProgress(current: number, total: number, message: string): void {
  console.log(`${COLORS.cyan}[${current}/${total}]${COLORS.reset} ${message}`);
}

// ============================================================================
// MDX Generation
// ============================================================================

/**
 * Generate MDX body content for a service page
 *
 * This creates the MDX component content that follows the frontmatter.
 * Uses the existing service template structure.
 */
function generateMDXBody(
  context: BusinessContext,
  service: ServiceDefinition,
  frontmatter: ServiceFrontmatter
): string {
  // Build coverage section with regions from context
  const regionCards = context.regions
    .map((region) => {
      const locationTags = region.locations
        ?.map((loc) => {
          const slug = loc.toLowerCase().replace(/\s+/g, "-");
          return `    <LocationTag href="/locations/${slug}">${loc}</LocationTag>`;
        })
        .join("\n");
      return `  <RegionCard title="${region.name}">
${locationTags}
  </RegionCard>`;
    })
    .join("\n\n");

  // Build related services section
  const relatedServicesLinks = service.relatedServices
    .slice(0, 3)
    .map((slug) => {
      const related = findServiceBySlug(context, slug);
      const title =
        related?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `  <ServiceLink
    href="/services/${slug}"
    title="${title}"
    description="${service.keyFeatures[0] || "Professional scaffolding services"}"
    image="colossus-reference/hero/service/${slug}_01.webp"
  />`;
    })
    .join("\n");

  // Build sidebar items from key points or features
  const sidebarItems = (frontmatter.about?.keyPoints || service.keyFeatures)
    .slice(0, 6)
    .map((item) => `  <SidebarItem>${item}</SidebarItem>`)
    .join("\n");

  // Build process steps
  const processSteps = [
    "Free consultation and site survey",
    "TG20:21 compliant scaffold design",
    "Transparent quote with no hidden costs",
    "Professional CISRS-qualified installation",
    "Handover certificate and load ratings",
    "Weekly statutory inspections",
    "Weather and modification checks",
    "Safe dismantling and site restoration",
  ]
    .map((step) => `  <ProcessStep>${step}</ProcessStep>`)
    .join("\n");

  // Get the intro text from about.whatIs or generate a default
  const introText =
    frontmatter.about?.whatIs?.slice(0, 200) ||
    `Our ${service.title} provides professional solutions for residential, commercial, and industrial projects.`;

  // Build the MDX body
  return `
<ServiceIntro
  title="Professional ${service.title.replace(" Services", "")}"
  intro="${introText.replace(/"/g, '\\"')}"
  sidebarTitle="${service.title.replace(" Services", "")} Package Includes"
  stepsTitle="${service.title.replace(" Services", "")} Installation Process"
>
${sidebarItems}

${processSteps}
</ServiceIntro>

<CoverageSection
  title="${service.title.replace(" Services", "")} Across"
  titleHighlight="Sussex & South East"
  badge="${context.regions.reduce((sum, r) => sum + (r.locations?.length || 0), 0)} Locations Across the South East"
  description="We provide professional ${service.title.toLowerCase()} throughout the South East region."
  ctaText="View all service locations"
  ctaHref="/locations"
>
${regionCards}
</CoverageSection>

<RelatedServices title="Related ${service.title.replace(" Services", "")} Solutions">
${relatedServicesLinks}
</RelatedServices>
`;
}

/**
 * Convert frontmatter object to YAML string
 */
function frontmatterToYAML(frontmatter: ServiceFrontmatter): string {
  return yaml.stringify(frontmatter, {
    lineWidth: 0, // Don't wrap long lines
    defaultStringType: "QUOTE_DOUBLE",
    defaultKeyType: "PLAIN",
  });
}

/**
 * Generate complete MDX file content
 */
function generateMDXFile(
  context: BusinessContext,
  service: ServiceDefinition,
  generatedContent: GeneratedServiceContent
): string {
  // Build frontmatter object
  const frontmatter: ServiceFrontmatter = {
    title: service.title,
    description: generatedContent.description,
    hero: {
      image: `colossus-reference/hero/service/${service.slug}_01.webp`,
    },
    about: generatedContent.about,
    faqs: generatedContent.faqs,
  };

  // Convert to YAML
  const yamlContent = frontmatterToYAML(frontmatter);

  // Generate MDX body
  const mdxBody = generateMDXBody(context, service, frontmatter);

  // Combine frontmatter and body
  return `---
${yamlContent.trim()}
---
${mdxBody}`;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate generated content against schema requirements
 */
function validateGeneratedContent(content: GeneratedServiceContent): string[] {
  const errors: string[] = [];

  // Validate description
  if (!content.description) {
    errors.push("Missing description");
  } else if (content.description.length < 50) {
    errors.push(`Description too short (${content.description.length} chars, min 50)`);
  } else if (content.description.length > 200) {
    errors.push(`Description too long (${content.description.length} chars, max 200)`);
  }

  // Validate about section
  if (!content.about) {
    errors.push("Missing about section");
  } else {
    if (!content.about.whatIs || content.about.whatIs.length < 50) {
      errors.push("about.whatIs is required (min 50 chars)");
    }
    if (!Array.isArray(content.about.whenNeeded) || content.about.whenNeeded.length < 4) {
      errors.push("about.whenNeeded requires at least 4 items");
    }
    if (!Array.isArray(content.about.whatAchieve) || content.about.whatAchieve.length < 4) {
      errors.push("about.whatAchieve requires at least 4 items");
    }
    if (!Array.isArray(content.about.keyPoints) || content.about.keyPoints.length < 3) {
      errors.push("about.keyPoints requires at least 3 items");
    }
  }

  // Validate FAQs
  if (!Array.isArray(content.faqs) || content.faqs.length < 3) {
    errors.push("At least 3 FAQs required");
  } else if (content.faqs.length > 15) {
    errors.push("Maximum 15 FAQs allowed");
  } else {
    content.faqs.forEach((faq, i) => {
      if (!faq.question || faq.question.length < 10) {
        errors.push(`FAQ[${i}].question too short (min 10 chars)`);
      }
      if (!faq.answer || faq.answer.length < 20) {
        errors.push(`FAQ[${i}].answer too short (min 20 chars)`);
      }
    });
  }

  return errors;
}

// ============================================================================
// Generation Logic
// ============================================================================

/**
 * Generate content for a single service
 */
async function generateServiceContent(
  client: AIClient,
  context: BusinessContext,
  service: ServiceDefinition,
  retryCount: number = 0
): Promise<{ content: GeneratedServiceContent | null; errors: string[] }> {
  const prompt = getServiceFrontmatterPrompt(context, service);
  const schema = getServiceFrontmatterSchema();

  try {
    const result = await client.generateStructured<GeneratedServiceContent>(prompt, schema, {
      systemPrompt: `You are a professional content writer for ${context.business.name}, a ${context.business.industry} business in the UK. Generate SEO-optimized content for service pages. Use UK English spelling. Be specific and informative. Do not use emojis.`,
      temperature: 0.7,
      maxTokens: 4096,
    });

    if (!result.success || !result.data) {
      return {
        content: null,
        errors: [result.error || "Failed to generate content"],
      };
    }

    // Validate the generated content
    const validationErrors = validateGeneratedContent(result.data);

    if (validationErrors.length > 0 && retryCount < MAX_RETRIES) {
      logWarning(`Validation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      return generateServiceContent(client, context, service, retryCount + 1);
    }

    return {
      content: result.data,
      errors: validationErrors,
    };
  } catch (error) {
    return {
      content: null,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Process a single service
 */
async function processService(
  client: AIClient,
  context: BusinessContext,
  service: ServiceDefinition,
  options: GenerateServicesOptions,
  siteDir: string
): Promise<ServiceGenerationResult> {
  const outputPath = path.join(siteDir, "content", "services", `${service.slug}.mdx`);

  // Check if file exists
  if (fs.existsSync(outputPath) && !options.force) {
    return {
      slug: service.slug,
      status: "skipped",
      message: "File exists (use --force to overwrite)",
      filePath: outputPath,
    };
  }

  // Dry run - just show what would be generated
  if (options.dryRun) {
    log(`  Would generate: ${outputPath}`, "dim");
    log(`  Service: ${service.title}`, "dim");
    log(`  Features: ${service.keyFeatures.slice(0, 3).join(", ")}`, "dim");
    return {
      slug: service.slug,
      status: "skipped",
      message: "Dry run",
      filePath: outputPath,
    };
  }

  // Generate content
  log(`  Generating content via AI...`, "dim");
  const { content, errors } = await generateServiceContent(client, context, service);

  if (!content) {
    return {
      slug: service.slug,
      status: "error",
      message: "Content generation failed",
      validationErrors: errors,
      filePath: outputPath,
    };
  }

  if (errors.length > 0) {
    return {
      slug: service.slug,
      status: "error",
      message: "Validation failed",
      validationErrors: errors,
      filePath: outputPath,
    };
  }

  // Generate MDX file
  const mdxContent = generateMDXFile(context, service, content);

  // Write file
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, mdxContent, "utf-8");

    return {
      slug: service.slug,
      status: "success",
      message: "Generated successfully",
      filePath: outputPath,
    };
  } catch (error) {
    return {
      slug: service.slug,
      status: "error",
      message: `Failed to write file: ${error instanceof Error ? error.message : String(error)}`,
      filePath: outputPath,
    };
  }
}

// ============================================================================
// Manifest Management
// ============================================================================

/**
 * Create or update generation manifest
 */
function createManifest(contextPath: string, services: ServiceDefinition[]): GenerationManifest {
  const items: GenerationItem[] = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    status: "pending",
    filePath: `content/services/${s.slug}.mdx`,
    retryCount: 0,
  }));

  return {
    generated: new Date().toISOString(),
    version: VERSION,
    businessContext: contextPath,
    type: "services",
    totalItems: items.length,
    statusCounts: {
      pending: items.length,
      generating: 0,
      validating: 0,
      complete: 0,
      error: 0,
    },
    items,
  };
}

/**
 * Update manifest with results
 */
function updateManifest(
  manifest: GenerationManifest,
  results: ServiceGenerationResult[]
): GenerationManifest {
  const statusCounts = {
    pending: 0,
    generating: 0,
    validating: 0,
    complete: 0,
    error: 0,
  };

  for (const result of results) {
    const item = manifest.items.find((i) => i.slug === result.slug);
    if (item) {
      if (result.status === "success") {
        item.status = "complete";
        item.generatedAt = new Date().toISOString();
        statusCounts.complete++;
      } else if (result.status === "error") {
        item.status = "error";
        item.validationErrors = result.validationErrors;
        statusCounts.error++;
      } else {
        statusCounts.pending++;
      }
    }
  }

  return {
    ...manifest,
    generated: new Date().toISOString(),
    statusCounts,
  };
}

/**
 * Save manifest to disk
 */
function saveManifest(manifest: GenerationManifest, outputDir: string): void {
  const manifestPath = path.join(outputDir, "service-generation-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  logInfo(`Manifest saved: ${manifestPath}`);
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
${COLORS.bright}Service Page Generator${COLORS.reset}

Generate MDX service pages using AI (Claude or Gemini).

${COLORS.cyan}Usage:${COLORS.reset}
  tsx tools/generate-services.ts --site <site> --context <path> [options]

${COLORS.cyan}Required:${COLORS.reset}
  --site <name>        Site directory name (e.g., "colossus-reference")
  --context <path>     Path to business context JSON file

${COLORS.cyan}Options:${COLORS.reset}
  --provider <name>    AI provider: "claude" (default) or "gemini"
  --services <slugs>   Comma-separated service slugs to generate
  --dry-run            Preview without writing files
  --force              Overwrite existing files
  --limit <n>          Limit number of services to generate
  --help               Show this help message

${COLORS.cyan}Examples:${COLORS.reset}
  # Generate all services using Claude
  tsx tools/generate-services.ts --site colossus-reference --context context.json

  # Generate specific services
  tsx tools/generate-services.ts --site colossus-reference \\
    --services "residential-scaffolding,commercial-scaffolding"

  # Preview what would be generated
  tsx tools/generate-services.ts --site colossus-reference --context context.json --dry-run

  # Use Gemini instead of Claude
  tsx tools/generate-services.ts --site colossus-reference --context context.json --provider=gemini

${COLORS.cyan}Environment Variables:${COLORS.reset}
  ANTHROPIC_API_KEY    Required for Claude provider
  GOOGLE_AI_API_KEY    Required for Gemini provider
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(): GenerateServicesOptions {
  const args = process.argv.slice(2);
  const options: GenerateServicesOptions = {
    site: "",
    context: "",
    provider: "claude",
    dryRun: false,
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg === "--site" && i + 1 < args.length) {
      options.site = args[++i];
    } else if (arg === "--context" && i + 1 < args.length) {
      options.context = args[++i];
    } else if (arg === "--provider" && i + 1 < args.length) {
      const provider = args[++i];
      if (provider !== "claude" && provider !== "gemini") {
        throw new Error(`Invalid provider: ${provider}. Use "claude" or "gemini".`);
      }
      options.provider = provider;
    } else if (arg.startsWith("--provider=")) {
      const provider = arg.split("=")[1];
      if (provider !== "claude" && provider !== "gemini") {
        throw new Error(`Invalid provider: ${provider}. Use "claude" or "gemini".`);
      }
      options.provider = provider as AIProvider;
    } else if (arg === "--services" && i + 1 < args.length) {
      options.services = args[++i].split(",").map((s) => s.trim());
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--limit" && i + 1 < args.length) {
      const limit = parseInt(args[++i], 10);
      if (isNaN(limit) || limit <= 0) {
        throw new Error("--limit must be a positive number");
      }
      options.limit = limit;
    }
  }

  return options;
}

/**
 * Validate options
 */
function validateOptions(options: GenerateServicesOptions): void {
  if (!options.site) {
    throw new Error("--site is required");
  }

  if (!options.context && !options.services) {
    throw new Error("--context is required (or use --services to specify services)");
  }

  // Check API key
  if (!options.dryRun && !hasAPIKey(options.provider)) {
    throw new Error(
      `${getAPIKeyEnvVar(options.provider)} is required for ${options.provider} provider`
    );
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

/**
 * Main function
 */
async function main(): Promise<void> {
  log("\n" + "=".repeat(60), "cyan");
  log(" Service Page Generator", "bright");
  log("=".repeat(60) + "\n", "cyan");

  // Parse and validate arguments
  let options: GenerateServicesOptions;
  try {
    options = parseArgs();
    validateOptions(options);
  } catch (error) {
    logError(error instanceof Error ? error.message : String(error));
    console.log("\nRun with --help for usage information.\n");
    process.exit(1);
  }

  // Resolve paths
  const siteDir = path.join(process.cwd(), "sites", options.site);
  if (!fs.existsSync(siteDir)) {
    logError(`Site directory not found: ${siteDir}`);
    process.exit(1);
  }

  // Load business context
  let context: BusinessContext;
  if (options.context) {
    logInfo(`Loading business context: ${options.context}`);
    try {
      context = loadBusinessContext(options.context);
      logSuccess(`Loaded context for ${context.business.name}`);
    } catch (error) {
      logError(`Failed to load context: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  } else {
    // Create minimal context from services list
    logWarning("No context file provided, using minimal context");
    context = {
      business: {
        name: "Business",
        industry: "services",
        phone: "01234 567890",
        email: "info@example.com",
      },
      credentials: {
        certifications: [],
        insurance: "Fully insured",
        teamQualifications: "Qualified team",
      },
      services: (options.services || []).map((slug) => ({
        slug,
        title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Services",
        category: "core" as const,
        keyFeatures: [],
        relatedServices: [],
      })),
      regions: [],
      pricing: {
        domestic: { min: 100, max: 1000 },
        commercial: { min: 500, max: 5000 },
      },
    };
  }

  // Determine services to generate
  let servicesToGenerate: ServiceDefinition[];
  if (options.services && options.services.length > 0) {
    servicesToGenerate = options.services
      .map((slug) => findServiceBySlug(context, slug))
      .filter((s): s is ServiceDefinition => s !== undefined);

    if (servicesToGenerate.length !== options.services.length) {
      const missing = options.services.filter((s) => !findServiceBySlug(context, s));
      logWarning(`Services not found in context: ${missing.join(", ")}`);
    }
  } else {
    servicesToGenerate = context.services;
  }

  // Apply limit
  if (options.limit && options.limit < servicesToGenerate.length) {
    servicesToGenerate = servicesToGenerate.slice(0, options.limit);
  }

  logInfo(`Provider: ${options.provider}`);
  logInfo(`Site: ${options.site}`);
  logInfo(`Services to generate: ${servicesToGenerate.length}`);
  if (options.dryRun) {
    logWarning("DRY RUN MODE - No files will be written");
  }
  if (options.force) {
    logWarning("FORCE MODE - Existing files will be overwritten");
  }
  console.log();

  // Initialize AI client (unless dry run)
  let client: AIClient | null = null;
  if (!options.dryRun) {
    try {
      client = getAIClient({ provider: options.provider });
      logSuccess(`Initialized ${options.provider} client`);
    } catch (error) {
      logError(
        `Failed to initialize AI client: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  }

  // Create manifest
  const manifest = createManifest(options.context, servicesToGenerate);

  // Process services
  const results: ServiceGenerationResult[] = [];
  const summary: GenerationSummary = {
    total: servicesToGenerate.length,
    success: 0,
    skipped: 0,
    errors: 0,
    results: [],
  };

  for (let i = 0; i < servicesToGenerate.length; i++) {
    const service = servicesToGenerate[i];
    logProgress(i + 1, servicesToGenerate.length, `Processing: ${service.title}`);

    const result = await processService(client!, context, service, options, siteDir);

    results.push(result);

    if (result.status === "success") {
      logSuccess(result.message || "Generated");
      summary.success++;
    } else if (result.status === "skipped") {
      logWarning(result.message || "Skipped");
      summary.skipped++;
    } else {
      logError(result.message || "Failed");
      if (result.validationErrors) {
        result.validationErrors.forEach((e) => log(`    - ${e}`, "red"));
      }
      summary.errors++;
    }

    console.log();
  }

  // Update and save manifest
  if (!options.dryRun) {
    const updatedManifest = updateManifest(manifest, results);
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    saveManifest(updatedManifest, outputDir);
  }

  // Print summary
  console.log("=".repeat(60));
  log(" Generation Summary", "bright");
  console.log("=".repeat(60));
  console.log();
  log(`  Total:    ${summary.total}`, "cyan");
  log(`  Success:  ${summary.success}`, "green");
  log(`  Skipped:  ${summary.skipped}`, "yellow");
  log(`  Errors:   ${summary.errors}`, summary.errors > 0 ? "red" : undefined);
  console.log();

  // Exit with error code if there were failures
  if (summary.errors > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    logError(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
