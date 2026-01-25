/**
 * Content Generator Types
 *
 * Shared types for AI-powered content generation tools.
 * Used by service and location page generators.
 */

// ============================================================================
// Business Context Types
// ============================================================================

/**
 * Business contact and identity information
 */
export interface BusinessInfo {
  /** Display name (e.g., "Colossus Scaffolding") */
  name: string;
  /** Legal entity name for contracts */
  legalName?: string;
  /** Industry/sector (e.g., "scaffolding", "plumbing") */
  industry: string;
  /** Primary phone number */
  phone: string;
  /** Contact email */
  email: string;
  /** Website URL */
  website?: string;
}

/**
 * Business credentials and certifications
 */
export interface BusinessCredentials {
  /** List of certifications (e.g., ["TG20:21", "CHAS", "CISRS"]) */
  certifications: string[];
  /** Insurance description (e.g., "£10 million public liability") */
  insurance: string;
  /** Team qualifications summary */
  teamQualifications: string;
}

/**
 * Service definition for content generation
 */
export interface ServiceDefinition {
  /** URL-friendly identifier (e.g., "residential-scaffolding") */
  slug: string;
  /** Display title (e.g., "Residential Scaffolding Services") */
  title: string;
  /** Service category for grouping */
  category: "core" | "specialist" | "additional";
  /** Main features/benefits of this service */
  keyFeatures: string[];
  /** Related service slugs for cross-linking */
  relatedServices: string[];
}

/**
 * Location definition within a region
 */
export interface LocationDefinition {
  /** Location name (e.g., "Brighton") */
  name: string;
  /** URL slug (e.g., "brighton") */
  slug: string;
  /** Local authority name (e.g., "Brighton & Hove City Council") */
  localAuthority?: string;
  /** Type of location for content generation hints */
  type?: "coastal" | "urban" | "rural" | "historic" | "mixed";
  /** Notable landmarks or areas */
  landmarks?: string[];
  /** Notable building types in the area */
  buildingTypes?: string[];
  /** Neighborhoods or districts */
  neighborhoods?: string[];
  /** Whether location has heritage/conservation areas */
  hasHeritage?: boolean;
  /** Whether location is coastal */
  isCoastal?: boolean;
}

/**
 * Region/coverage area definition
 */
export interface RegionDefinition {
  /** Region name (e.g., "East Sussex") */
  name: string;
  /** Region slug (e.g., "east-sussex") */
  slug?: string;
  /** Location names within region (simple format) */
  locations?: string[];
  /** Location definitions within region (detailed format) */
  locationDefinitions?: LocationDefinition[];
}

/**
 * Pricing tier definition
 */
export interface PricingTier {
  /** Minimum price in GBP */
  min: number;
  /** Maximum price in GBP */
  max: number;
  /** Duration or unit (e.g., "per week", "per project") */
  duration?: string;
}

/**
 * Pricing information by customer type
 */
export interface PricingInfo {
  /** Domestic/residential pricing */
  domestic: PricingTier;
  /** Commercial/business pricing */
  commercial: PricingTier;
  /** Specialist/complex project pricing */
  specialist?: PricingTier;
}

/**
 * Brand voice guidelines for content generation
 */
export interface BrandVoice {
  /** Tone description (e.g., "professional, approachable, knowledgeable") */
  tone: string;
  /** Words/phrases to avoid */
  avoidWords?: string[];
  /** Preferred terminology */
  preferredTerms?: string[];
}

/**
 * Complete business context for content generation
 *
 * This provides all the information needed to generate
 * consistent, branded content across service and location pages.
 */
export interface BusinessContext {
  /** Business identity and contact */
  business: BusinessInfo;
  /** Credentials and certifications */
  credentials: BusinessCredentials;
  /** All services offered */
  services: ServiceDefinition[];
  /** Coverage regions */
  regions: RegionDefinition[];
  /** Pricing information */
  pricing: PricingInfo;
  /** Brand voice guidelines */
  brandVoice?: BrandVoice;
}

// ============================================================================
// Generation Manifest Types
// ============================================================================

/**
 * Status of an item in the generation pipeline
 */
export type GenerationStatus = "pending" | "generating" | "validating" | "complete" | "error";

/**
 * Single item in a generation manifest
 */
export interface GenerationItem {
  /** URL-friendly identifier (e.g., "residential-scaffolding") */
  slug: string;
  /** Display title */
  title: string;
  /** Current status in pipeline */
  status: GenerationStatus;
  /** Output file path relative to site root */
  filePath: string;
  /** Validation errors if status is "error" */
  validationErrors?: string[];
  /** ISO timestamp when content was generated */
  generatedAt?: string;
  /** Number of retry attempts */
  retryCount: number;
}

/**
 * Complete manifest for a generation run
 */
export interface GenerationManifest {
  /** ISO timestamp of manifest generation */
  generated: string;
  /** Manifest schema version */
  version: string;
  /** Path to business context file used */
  businessContext: string;
  /** Type of content being generated */
  type: "services" | "locations";
  /** Total number of items in manifest */
  totalItems: number;
  /** Counts by status */
  statusCounts: Record<GenerationStatus, number>;
  /** All items to generate */
  items: GenerationItem[];
}

// ============================================================================
// Generated Content Types
// ============================================================================

/**
 * FAQ item structure (matches Zod schema)
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * About section structure for services
 */
export interface AboutSection {
  /** What the service is */
  whatIs: string;
  /** When the service is needed (scenarios) */
  whenNeeded: string[];
  /** What customers achieve with this service */
  whatAchieve: string[];
  /** Key points/highlights */
  keyPoints?: string[];
}

/**
 * Hero section structure for services
 */
export interface HeroSection {
  heading?: string;
  subheading?: string;
  image: string;
  cta?: {
    label: string;
    href: string;
  };
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  title: string;
  href: string;
}

/**
 * Complete service frontmatter structure
 * (matches ServiceFrontmatterSchema in content-schemas.ts)
 */
export interface ServiceFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  keywords?: string[];
  hero?: HeroSection;
  breadcrumbs?: BreadcrumbItem[];
  faqs: FAQItem[];
  benefits?: string[];
  about?: AboutSection;
  heroImage?: string;
  galleryImages?: string[];
}

// ============================================================================
// Location Content Types
// ============================================================================

/**
 * Location hero section
 */
export interface LocationHeroSection {
  title: string;
  description: string;
  phone: string;
  trustBadges?: string[];
  ctaText?: string;
  ctaUrl?: string;
}

/**
 * Specialist card for location page
 */
export interface SpecialistCard {
  title: string;
  description: string;
  details?: string[];
  image?: string;
}

/**
 * Specialists section for location page
 */
export interface SpecialistsSection {
  title: string;
  description: string;
  columns?: number;
  backgroundColor?: "white" | "gray" | "blue";
  showBottomCTA?: boolean;
  cards: SpecialistCard[];
}

/**
 * Service card for location page
 */
export interface LocationServiceCard {
  title: string;
  subtitle?: string[];
  description: string;
  features: string[];
  href: string;
  ctaText: string;
  image?: string;
}

/**
 * Services section for location page
 */
export interface LocationServicesSection {
  title?: string;
  description?: string;
  cards: LocationServiceCard[];
}

/**
 * Pricing feature item
 */
export interface PricingFeature {
  text: string;
  included: boolean;
}

/**
 * Pricing package for location page
 */
export interface LocationPricingPackage {
  name: string;
  description: string;
  price: string;
  duration: string;
  popular?: boolean;
  features: PricingFeature[];
  ctaText: string;
  ctaUrl: string;
}

/**
 * Pricing section for location page
 */
export interface LocationPricingSection {
  title: string;
  description: string;
  packages: LocationPricingPackage[];
}

/**
 * Local authority expertise item
 */
export interface ExpertiseItem {
  title: string;
  description: string;
}

/**
 * Support item for local authority section
 */
export interface SupportItem {
  title: string;
  description: string;
}

/**
 * Local authority section for location page
 */
export interface LocalAuthoritySection {
  title: string;
  description: string;
  locationName: string;
  authorityName: string;
  expertiseItems: ExpertiseItem[];
  supportItems: SupportItem[];
}

/**
 * Coverage section for location page
 */
export interface CoverageSection {
  description: string;
  areas: string[];
}

/**
 * Location breadcrumb item
 */
export interface LocationBreadcrumb {
  name: string;
  href: string;
  current?: boolean;
}

/**
 * Schema.org service definition
 */
export interface SchemaService {
  id: string;
  name: string;
  description: string;
  url: string;
  serviceType: string;
  areaServed: string[];
}

/**
 * CTA section for location page
 */
export interface LocationCTASection {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  trustBadges: string[];
}

/**
 * Complete location frontmatter structure
 * (matches LocationFrontmatterSchema in content-schemas.ts)
 */
export interface LocationFrontmatter {
  title: string;
  seoTitle: string;
  description: string;
  keywords?: string[];
  heroImage?: string;
  hero: LocationHeroSection;
  specialists?: SpecialistsSection;
  services?: LocationServicesSection;
  faqs?: FAQItem[];
  pricing?: LocationPricingSection;
  localAuthority?: LocalAuthoritySection;
  coverage?: CoverageSection;
  breadcrumbs?: LocationBreadcrumb[];
  schema?: {
    service: SchemaService;
  };
  cta?: LocationCTASection;
}

// ============================================================================
// CLI Options Types
// ============================================================================

/**
 * Command line options for generate-services.ts
 */
export interface GenerateServicesOptions {
  /** Site directory name (e.g., "colossus-reference") */
  site: string;
  /** Path to business context JSON file */
  context: string;
  /** AI provider to use */
  provider: "claude" | "gemini";
  /** Specific services to generate (comma-separated slugs) */
  services?: string[];
  /** Preview without writing files */
  dryRun: boolean;
  /** Overwrite existing files */
  force: boolean;
  /** Limit number of services to generate */
  limit?: number;
}

/**
 * Command line options for generate-locations.ts
 */
export interface GenerateLocationsOptions {
  /** Site directory name (e.g., "colossus-reference") */
  site: string;
  /** Path to business context JSON file */
  context: string;
  /** AI provider to use */
  provider: "claude" | "gemini";
  /** Specific locations to generate (comma-separated slugs) */
  locations?: string[];
  /** Preview without writing files */
  dryRun: boolean;
  /** Overwrite existing files */
  force: boolean;
  /** Limit number of locations to generate */
  limit?: number;
}

/**
 * Result of generating a single service
 */
export interface ServiceGenerationResult {
  slug: string;
  status: "success" | "skipped" | "error";
  message?: string;
  validationErrors?: string[];
  filePath?: string;
}

/**
 * Result of generating a single location
 */
export interface LocationGenerationResult {
  slug: string;
  name: string;
  status: "success" | "skipped" | "error";
  message?: string;
  validationErrors?: string[];
  filePath?: string;
}

/**
 * Summary of a generation run
 */
export interface GenerationSummary {
  total: number;
  success: number;
  skipped: number;
  errors: number;
  results: ServiceGenerationResult[] | LocationGenerationResult[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Load business context from a JSON file
 *
 * @param filePath - Path to the context JSON file
 * @returns Parsed business context
 */
export async function loadBusinessContext(filePath: string): Promise<BusinessContext> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const resolvedPath = path.resolve(filePath);
  const content = await fs.readFile(resolvedPath, "utf-8");
  const context = JSON.parse(content) as BusinessContext;

  // Validate required fields
  if (!context.business?.name) {
    throw new Error("Business context missing required field: business.name");
  }
  if (!context.business?.industry) {
    throw new Error("Business context missing required field: business.industry");
  }
  if (!context.business?.phone) {
    throw new Error("Business context missing required field: business.phone");
  }
  if (!context.regions || context.regions.length === 0) {
    throw new Error("Business context missing required field: regions");
  }

  return context;
}

/**
 * Get all locations from business context
 *
 * @param context - Business context
 * @returns Array of location definitions
 */
export function getAllLocations(context: BusinessContext): LocationDefinition[] {
  const locations: LocationDefinition[] = [];

  for (const region of context.regions) {
    // Handle detailed location definitions
    if (region.locationDefinitions && region.locationDefinitions.length > 0) {
      locations.push(...region.locationDefinitions);
    }
    // Handle simple location name strings
    else if (region.locations && region.locations.length > 0) {
      for (const name of region.locations) {
        locations.push({
          name,
          slug: toSlug(name),
        });
      }
    }
  }

  return locations;
}

/**
 * Find location by slug
 *
 * @param context - Business context
 * @param slug - Location slug to find
 * @returns Location definition or undefined
 */
export function findLocationBySlug(
  context: BusinessContext,
  slug: string
): LocationDefinition | undefined {
  const allLocations = getAllLocations(context);
  return allLocations.find((loc) => loc.slug === slug);
}

/**
 * Get region for a location
 *
 * @param context - Business context
 * @param locationSlug - Location slug
 * @returns Region definition or undefined
 */
export function getRegionForLocation(
  context: BusinessContext,
  locationSlug: string
): RegionDefinition | undefined {
  for (const region of context.regions) {
    // Check detailed definitions
    if (region.locationDefinitions?.some((loc) => loc.slug === locationSlug)) {
      return region;
    }
    // Check simple names
    if (region.locations?.some((name) => toSlug(name) === locationSlug)) {
      return region;
    }
  }
  return undefined;
}

/**
 * Convert location name to URL slug
 *
 * @param name - Location name
 * @returns URL-safe slug
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Convert slug to title case
 *
 * @param slug - URL slug
 * @returns Title case string
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
