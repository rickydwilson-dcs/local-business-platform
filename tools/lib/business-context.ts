/**
 * Business Context Utilities
 *
 * Functions for loading, validating, and providing business context
 * for AI-powered content generation.
 *
 * Re-exports utility functions from content-generator-types.ts and adds
 * synchronous loading and validation helpers.
 */

import * as fs from "fs";
import * as path from "path";
import type {
  BusinessContext,
  BusinessInfo,
  BusinessCredentials,
  ServiceDefinition,
  RegionDefinition,
  PricingInfo,
  BrandVoice,
} from "./content-generator-types";

// Re-export utility functions from content-generator-types
export {
  getAllLocations,
  findLocationBySlug,
  getRegionForLocation,
  toSlug,
  slugToTitle,
} from "./content-generator-types";

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate business info object
 */
function validateBusinessInfo(data: unknown): BusinessInfo {
  if (!data || typeof data !== "object") {
    throw new Error("business must be an object");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.name !== "string" || obj.name.length < 2) {
    throw new Error("business.name is required (min 2 characters)");
  }
  if (typeof obj.industry !== "string" || obj.industry.length < 2) {
    throw new Error("business.industry is required (min 2 characters)");
  }
  if (typeof obj.phone !== "string" || obj.phone.length < 5) {
    throw new Error("business.phone is required (min 5 characters)");
  }
  if (typeof obj.email !== "string" || !obj.email.includes("@")) {
    throw new Error("business.email must be a valid email");
  }

  return {
    name: obj.name,
    legalName: typeof obj.legalName === "string" ? obj.legalName : undefined,
    industry: obj.industry,
    phone: obj.phone,
    email: obj.email,
    website: typeof obj.website === "string" ? obj.website : undefined,
  };
}

/**
 * Validate credentials object
 */
function validateCredentials(data: unknown): BusinessCredentials {
  if (!data || typeof data !== "object") {
    throw new Error("credentials must be an object");
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.certifications) || obj.certifications.length === 0) {
    throw new Error("credentials.certifications must be a non-empty array");
  }
  if (typeof obj.insurance !== "string" || obj.insurance.length < 5) {
    throw new Error("credentials.insurance is required");
  }
  if (typeof obj.teamQualifications !== "string") {
    throw new Error("credentials.teamQualifications is required");
  }

  return {
    certifications: obj.certifications.map((c) => String(c)),
    insurance: obj.insurance,
    teamQualifications: obj.teamQualifications,
  };
}

/**
 * Validate service definition
 */
function validateServiceDefinition(data: unknown, index: number): ServiceDefinition {
  if (!data || typeof data !== "object") {
    throw new Error(`services[${index}] must be an object`);
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.slug !== "string" || obj.slug.length < 2) {
    throw new Error(`services[${index}].slug is required`);
  }
  if (typeof obj.title !== "string" || obj.title.length < 5) {
    throw new Error(`services[${index}].title is required`);
  }
  if (!["core", "specialist", "additional"].includes(String(obj.category))) {
    throw new Error(`services[${index}].category must be core, specialist, or additional`);
  }
  if (!Array.isArray(obj.keyFeatures) || obj.keyFeatures.length === 0) {
    throw new Error(`services[${index}].keyFeatures must be a non-empty array`);
  }
  if (!Array.isArray(obj.relatedServices)) {
    throw new Error(`services[${index}].relatedServices must be an array`);
  }

  return {
    slug: obj.slug,
    title: obj.title,
    category: obj.category as "core" | "specialist" | "additional",
    keyFeatures: obj.keyFeatures.map((f) => String(f)),
    relatedServices: obj.relatedServices.map((s) => String(s)),
  };
}

/**
 * Validate region definition
 */
function validateRegionDefinition(data: unknown, index: number): RegionDefinition {
  if (!data || typeof data !== "object") {
    throw new Error(`regions[${index}] must be an object`);
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.name !== "string" || obj.name.length < 2) {
    throw new Error(`regions[${index}].name is required`);
  }

  // At least one of locations or locationDefinitions must be present
  const hasLocations = Array.isArray(obj.locations) && obj.locations.length > 0;
  const hasLocationDefs =
    Array.isArray(obj.locationDefinitions) && obj.locationDefinitions.length > 0;

  if (!hasLocations && !hasLocationDefs) {
    throw new Error(`regions[${index}] must have locations or locationDefinitions`);
  }

  return {
    name: obj.name,
    slug: typeof obj.slug === "string" ? obj.slug : undefined,
    locations: hasLocations ? (obj.locations as string[]).map((l) => String(l)) : undefined,
    locationDefinitions: hasLocationDefs
      ? (obj.locationDefinitions as RegionDefinition["locationDefinitions"])
      : undefined,
  };
}

/**
 * Validate pricing info
 */
function validatePricingInfo(data: unknown): PricingInfo {
  if (!data || typeof data !== "object") {
    throw new Error("pricing must be an object");
  }

  const obj = data as Record<string, unknown>;

  const validateTier = (tier: unknown, name: string) => {
    if (!tier || typeof tier !== "object") {
      throw new Error(`pricing.${name} must be an object`);
    }
    const t = tier as Record<string, unknown>;
    if (typeof t.min !== "number" || t.min < 0) {
      throw new Error(`pricing.${name}.min must be a positive number`);
    }
    if (typeof t.max !== "number" || t.max < t.min) {
      throw new Error(`pricing.${name}.max must be >= min`);
    }
    return {
      min: t.min,
      max: t.max,
      duration: typeof t.duration === "string" ? t.duration : undefined,
    };
  };

  return {
    domestic: validateTier(obj.domestic, "domestic"),
    commercial: validateTier(obj.commercial, "commercial"),
    specialist: obj.specialist ? validateTier(obj.specialist, "specialist") : undefined,
  };
}

/**
 * Validate brand voice (optional)
 */
function validateBrandVoice(data: unknown): BrandVoice | undefined {
  if (!data) return undefined;
  if (typeof data !== "object") {
    throw new Error("brandVoice must be an object");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.tone !== "string") {
    throw new Error("brandVoice.tone is required");
  }

  return {
    tone: obj.tone,
    avoidWords: Array.isArray(obj.avoidWords) ? obj.avoidWords.map((w) => String(w)) : undefined,
    preferredTerms: Array.isArray(obj.preferredTerms)
      ? obj.preferredTerms.map((t) => String(t))
      : undefined,
  };
}

// ============================================================================
// Public Functions
// ============================================================================

/**
 * Load business context from a JSON file (synchronous)
 *
 * @param filePath - Path to the context JSON file (absolute or relative to cwd)
 * @returns Validated business context
 * @throws Error if file doesn't exist or validation fails
 *
 * @example
 * ```typescript
 * const context = loadBusinessContext('./sites/colossus-reference/context.json');
 * console.log(context.business.name); // "Colossus Scaffolding"
 * ```
 */
export function loadBusinessContext(filePath: string): BusinessContext {
  // Resolve path relative to current working directory if not absolute
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  // Check file exists
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Business context file not found: ${resolvedPath}`);
  }

  // Read and parse JSON
  let rawData: unknown;
  try {
    const content = fs.readFileSync(resolvedPath, "utf-8");
    rawData = JSON.parse(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse business context: ${error.message}`);
    }
    throw error;
  }

  // Validate and return
  return validateBusinessContext(rawData);
}

/**
 * Validate an unknown value as a BusinessContext
 *
 * @param data - Raw data to validate
 * @returns Validated business context
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * const rawContext = JSON.parse(someJsonString);
 * const context = validateBusinessContext(rawContext);
 * ```
 */
export function validateBusinessContext(data: unknown): BusinessContext {
  if (!data || typeof data !== "object") {
    throw new Error("Business context must be an object");
  }

  const obj = data as Record<string, unknown>;

  // Validate required sections
  const business = validateBusinessInfo(obj.business);
  const credentials = validateCredentials(obj.credentials);

  // Validate services array
  if (!Array.isArray(obj.services) || obj.services.length === 0) {
    throw new Error("services must be a non-empty array");
  }
  const services = obj.services.map((s, i) => validateServiceDefinition(s, i));

  // Validate regions array
  if (!Array.isArray(obj.regions) || obj.regions.length === 0) {
    throw new Error("regions must be a non-empty array");
  }
  const regions = obj.regions.map((r, i) => validateRegionDefinition(r, i));

  // Validate pricing
  const pricing = validatePricingInfo(obj.pricing);

  // Validate optional brand voice
  const brandVoice = validateBrandVoice(obj.brandVoice);

  return {
    business,
    credentials,
    services,
    regions,
    pricing,
    brandVoice,
  };
}

/**
 * Get a default business context for testing
 *
 * This provides a complete, valid context that can be used
 * for testing and development without needing a real context file.
 *
 * @returns Default business context
 *
 * @example
 * ```typescript
 * const context = getDefaultContext();
 * // Use for testing or as a template
 * ```
 */
export function getDefaultContext(): BusinessContext {
  return {
    business: {
      name: "Colossus Scaffolding",
      legalName: "Colossus Scaffolding Ltd",
      industry: "scaffolding",
      phone: "01424 466 661",
      email: "info@colossusscaffolding.co.uk",
      website: "https://colossusscaffolding.co.uk",
    },
    credentials: {
      certifications: ["TG20:21", "CHAS", "CISRS", "Constructionline"],
      insurance: "£10 million public liability insurance",
      teamQualifications: "CISRS qualified scaffolders with extensive experience",
    },
    services: [
      {
        slug: "residential-scaffolding",
        title: "Residential Scaffolding Services",
        category: "core",
        keyFeatures: [
          "Safe working at height",
          "TG20:21 compliant design",
          "Family-friendly security",
          "Minimal garden disruption",
        ],
        relatedServices: ["access-scaffolding", "scaffold-towers-mast-systems"],
      },
      {
        slug: "commercial-scaffolding",
        title: "Commercial Scaffolding Services",
        category: "core",
        keyFeatures: [
          "Large-scale project capability",
          "Minimal business disruption",
          "24/7 availability",
          "Multi-phase project support",
        ],
        relatedServices: ["industrial-scaffolding", "facade-scaffolding"],
      },
      {
        slug: "access-scaffolding",
        title: "Access Scaffolding Services",
        category: "core",
        keyFeatures: [
          "Safe working platforms",
          "TG20:21 compliant",
          "Residential and commercial",
          "Full documentation",
        ],
        relatedServices: ["residential-scaffolding", "commercial-scaffolding"],
      },
    ],
    regions: [
      {
        name: "East Sussex",
        locations: ["Brighton", "Eastbourne", "Hastings", "Lewes", "Seaford", "Crowborough"],
      },
      {
        name: "West Sussex",
        locations: ["Worthing", "Chichester", "Crawley", "Horsham", "Bognor Regis"],
      },
      {
        name: "Kent",
        locations: ["Canterbury", "Maidstone", "Tunbridge Wells", "Folkestone", "Dover"],
      },
    ],
    pricing: {
      domestic: {
        min: 800,
        max: 2500,
        duration: "per project",
      },
      commercial: {
        min: 2000,
        max: 15000,
        duration: "per project",
      },
      specialist: {
        min: 3000,
        max: 25000,
        duration: "per project",
      },
    },
    brandVoice: {
      tone: "professional, approachable, knowledgeable",
      avoidWords: ["cheap", "budget", "discount"],
      preferredTerms: ["professional", "qualified", "compliant", "safe"],
    },
  };
}

/**
 * Find a service by slug in the context
 *
 * @param context - Business context
 * @param slug - Service slug to find
 * @returns Service definition or undefined
 */
export function findServiceBySlug(
  context: BusinessContext,
  slug: string
): ServiceDefinition | undefined {
  return context.services.find((s) => s.slug === slug);
}

/**
 * Format pricing for display in content
 *
 * @param tier - Pricing tier
 * @returns Formatted string like "from £800"
 */
export function formatPricing(tier: { min: number; max: number; duration?: string }): string {
  const duration = tier.duration ? ` ${tier.duration}` : "";
  if (tier.min === tier.max) {
    return `£${tier.min.toLocaleString()}${duration}`;
  }
  return `£${tier.min.toLocaleString()}-£${tier.max.toLocaleString()}${duration}`;
}
