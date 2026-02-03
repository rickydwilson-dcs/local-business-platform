/**
 * ProjectFile Schema
 *
 * Comprehensive Zod schema for the multi-channel intake system.
 * Extends and enhances the BusinessContext pattern from content-generator-types.ts
 * to support intake from various channels (web form, voice, document upload, etc.)
 */

import { z } from "zod";

// ============================================================================
// Enums and Constants
// ============================================================================

export const IntakeChannelEnum = z.enum([
  "web_form",
  "voice_call",
  "document_upload",
  "api",
  "manual_entry",
  "import",
]);

export const ProjectStatusEnum = z.enum([
  "draft",
  "intake_complete",
  "validated",
  "generation_ready",
  "generating",
  "review_pending",
  "approved",
  "deployed",
  "archived",
]);

export const BusinessTypeEnum = z.enum([
  "sole_trader",
  "partnership",
  "limited_company",
  "llp",
  "plc",
  "other",
]);

export const ServiceCategoryEnum = z.enum(["core", "specialist", "additional"]);

export const LocationTypeEnum = z.enum([
  "coastal",
  "urban",
  "rural",
  "historic",
  "mixed",
  "suburban",
  "industrial",
]);

export const DayOfWeekEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// ============================================================================
// Metadata Schema
// ============================================================================

export const ProjectMetadataSchema = z.object({
  /** Unique project identifier (UUID) */
  projectId: z.string().uuid(),
  /** Schema version for migrations */
  version: z.string().default("1.0.0"),
  /** Current project status */
  status: ProjectStatusEnum.default("draft"),
  /** Channel through which intake was initiated */
  intakeChannel: IntakeChannelEnum,
  /** ISO timestamp of creation */
  createdAt: z.string().datetime(),
  /** ISO timestamp of last update */
  updatedAt: z.string().datetime(),
  /** User who created the project (if applicable) */
  createdBy: z.string().optional(),
  /** Notes from intake session */
  intakeNotes: z.string().optional(),
});

// ============================================================================
// Address Schema
// ============================================================================

export const AddressSchema = z.object({
  /** Street address line 1 */
  line1: z.string().min(1),
  /** Street address line 2 (optional) */
  line2: z.string().optional(),
  /** City or town */
  city: z.string().min(1),
  /** County or region */
  county: z.string().optional(),
  /** Postal code */
  postcode: z.string().min(1),
  /** Country (defaults to UK) */
  country: z.string().default("United Kingdom"),
});

// ============================================================================
// Business Hours Schema
// ============================================================================

export const TimeSlotSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
});

export const DayHoursSchema = z.object({
  day: DayOfWeekEnum,
  /** Whether business is open on this day */
  isOpen: z.boolean().default(true),
  /** Time slots (supports split hours like lunch break) */
  slots: z.array(TimeSlotSchema).optional(),
  /** Display string for special cases (e.g., "By appointment only") */
  displayText: z.string().optional(),
});

export const BusinessHoursSchema = z.object({
  /** Regular operating hours */
  regular: z.array(DayHoursSchema),
  /** Whether 24/7 emergency service is available */
  emergency24h: z.boolean().default(false),
  /** Emergency contact number (if different from main) */
  emergencyPhone: z.string().optional(),
  /** Holiday schedule notes */
  holidayNotes: z.string().optional(),
});

// ============================================================================
// Social Media Schema
// ============================================================================

export const SocialMediaSchema = z.object({
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  /** Google Business Profile URL */
  googleBusiness: z.string().url().optional(),
  /** Trustpilot profile URL */
  trustpilot: z.string().url().optional(),
  /** Checkatrade profile URL */
  checkatrade: z.string().url().optional(),
});

// ============================================================================
// Geo Schema
// ============================================================================

export const GeoLocationSchema = z.object({
  /** Latitude coordinate */
  latitude: z.number().min(-90).max(90),
  /** Longitude coordinate */
  longitude: z.number().min(-180).max(180),
});

export const GeoSchema = z.object({
  /** Business headquarters/primary location */
  headquarters: GeoLocationSchema.optional(),
  /** Service radius in miles */
  serviceRadiusMiles: z.number().positive().optional(),
  /** Specific postcodes served */
  postcodesCovered: z.array(z.string()).optional(),
});

// ============================================================================
// Business Info Schema
// ============================================================================

export const BusinessInfoSchema = z.object({
  /** Display name (e.g., "Colossus Scaffolding") */
  name: z.string().min(1).max(100),
  /** Legal entity name for contracts */
  legalName: z.string().optional(),
  /** Type of business entity */
  type: BusinessTypeEnum.optional(),
  /** Industry/sector (e.g., "scaffolding", "plumbing") */
  industry: z.string().min(1),
  /** Primary phone number */
  phone: z.string().min(1),
  /** Secondary phone number */
  phoneSecondary: z.string().optional(),
  /** Contact email */
  email: z.string().email(),
  /** Website URL (existing site to reference) */
  website: z.string().url().optional(),
  /** Business address */
  address: AddressSchema.optional(),
  /** Operating hours */
  hours: BusinessHoursSchema.optional(),
  /** Social media profiles */
  socialMedia: SocialMediaSchema.optional(),
  /** Geographic information */
  geo: GeoSchema.optional(),
  /** Company registration number */
  companyNumber: z.string().optional(),
  /** VAT registration number */
  vatNumber: z.string().optional(),
});

// ============================================================================
// Credentials Schema
// ============================================================================

export const CertificationSchema = z.object({
  /** Certification name (e.g., "TG20:21") */
  name: z.string().min(1),
  /** Issuing body */
  issuedBy: z.string().optional(),
  /** Certificate number */
  certificateNumber: z.string().optional(),
  /** Expiry date (if applicable) */
  expiryDate: z.string().datetime().optional(),
  /** URL to certificate image/document */
  documentUrl: z.string().url().optional(),
});

export const InsuranceSchema = z.object({
  /** Type of insurance (e.g., "Public Liability") */
  type: z.string().min(1),
  /** Coverage amount (e.g., "10000000" for GBP 10M) */
  coverageAmount: z.number().positive(),
  /** Currency code */
  currency: z.string().default("GBP"),
  /** Insurance provider */
  provider: z.string().optional(),
  /** Policy number */
  policyNumber: z.string().optional(),
  /** Expiry date */
  expiryDate: z.string().datetime().optional(),
});

export const CredentialsSchema = z.object({
  /** Year business was established */
  yearEstablished: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  /** Professional certifications */
  certifications: z.array(CertificationSchema).default([]),
  /** Insurance policies */
  insurance: z.array(InsuranceSchema).default([]),
  /** Team qualifications summary */
  teamQualifications: z.string().optional(),
  /** Industry body memberships */
  memberships: z.array(z.string()).default([]),
  /** Awards and recognitions */
  awards: z.array(z.string()).default([]),
});

// ============================================================================
// Service Definition Schema
// ============================================================================

export const ServiceDefinitionSchema = z.object({
  /** URL-friendly identifier (e.g., "residential-scaffolding") */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  /** Display title (e.g., "Residential Scaffolding Services") */
  title: z.string().min(1).max(100),
  /** Service category for grouping */
  category: ServiceCategoryEnum,
  /** Short description for listings */
  shortDescription: z.string().max(200).optional(),
  /** Main features/benefits of this service */
  keyFeatures: z.array(z.string()).default([]),
  /** Related service slugs for cross-linking */
  relatedServices: z.array(z.string()).default([]),
  /** Whether to include in site generation */
  includeInGeneration: z.boolean().default(true),
  /** Custom keywords for SEO */
  keywords: z.array(z.string()).optional(),
  /** Estimated price range for this service */
  priceRange: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
      unit: z.string().optional(),
    })
    .optional(),
});

// ============================================================================
// Location Definition Schema
// ============================================================================

export const LocationDefinitionSchema = z.object({
  /** Location name (e.g., "Brighton") */
  name: z.string().min(1),
  /** URL slug (e.g., "brighton") */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  /** Local authority name (e.g., "Brighton & Hove City Council") */
  localAuthority: z.string().optional(),
  /** Type of location for content generation hints */
  type: LocationTypeEnum.optional(),
  /** Notable landmarks or areas */
  landmarks: z.array(z.string()).default([]),
  /** Notable building types in the area */
  buildingTypes: z.array(z.string()).default([]),
  /** Neighborhoods or districts */
  neighborhoods: z.array(z.string()).default([]),
  /** Whether location has heritage/conservation areas */
  hasHeritage: z.boolean().default(false),
  /** Whether location is coastal */
  isCoastal: z.boolean().default(false),
  /** Whether to include in site generation */
  includeInGeneration: z.boolean().default(true),
});

// ============================================================================
// Region Definition Schema
// ============================================================================

export const RegionDefinitionSchema = z.object({
  /** Region name (e.g., "East Sussex") */
  name: z.string().min(1),
  /** Region slug (e.g., "east-sussex") */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens")
    .optional(),
  /** Detailed location definitions within region */
  locations: z.array(LocationDefinitionSchema).default([]),
});

// ============================================================================
// Pricing Schema
// ============================================================================

export const PricingTierSchema = z.object({
  /** Minimum price */
  min: z.number().nonnegative(),
  /** Maximum price */
  max: z.number().nonnegative(),
  /** Duration or unit (e.g., "per week", "per project") */
  unit: z.string().optional(),
  /** Currency code */
  currency: z.string().default("GBP"),
  /** Description of what's included */
  includes: z.array(z.string()).optional(),
});

export const PricingSchema = z.object({
  /** Domestic/residential pricing */
  domestic: PricingTierSchema.optional(),
  /** Commercial/business pricing */
  commercial: PricingTierSchema.optional(),
  /** Specialist/complex project pricing */
  specialist: PricingTierSchema.optional(),
  /** Free quote offered */
  freeQuote: z.boolean().default(true),
  /** Pricing notes */
  notes: z.string().optional(),
});

// ============================================================================
// Brand Voice Schema
// ============================================================================

export const BrandVoiceSchema = z.object({
  /** Tone description (e.g., "professional, approachable, knowledgeable") */
  tone: z.string().min(1),
  /** Words/phrases to avoid */
  avoidWords: z.array(z.string()).default([]),
  /** Preferred terminology */
  preferredTerms: z.array(z.string()).default([]),
  /** Target audience description */
  targetAudience: z.string().optional(),
  /** Unique selling propositions */
  usps: z.array(z.string()).default([]),
  /** Tagline or slogan */
  tagline: z.string().optional(),
});

// ============================================================================
// Theme Schema
// ============================================================================

export const ColorPaletteSchema = z.object({
  /** Primary brand color (hex) */
  primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  /** Secondary brand color (hex) */
  secondary: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),
  /** Accent color (hex) */
  accent: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),
});

export const SurfaceColorsSchema = z.object({
  /** Background color (hex) */
  background: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .default("#FFFFFF"),
  /** Foreground/text color (hex) */
  foreground: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .default("#1A1A1A"),
  /** Muted background color (hex) */
  muted: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),
  /** Card background color (hex) */
  card: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),
});

export const TypographySchema = z.object({
  /** Primary font family */
  fontFamily: z.string().optional(),
  /** Heading font family (if different) */
  headingFontFamily: z.string().optional(),
  /** Base font size in pixels */
  baseFontSize: z.number().positive().default(16),
});

export const ComponentStylesSchema = z.object({
  /** Border radius for buttons (e.g., "8px", "full") */
  buttonRadius: z.string().optional(),
  /** Border radius for cards */
  cardRadius: z.string().optional(),
  /** Whether to use shadows */
  useShadows: z.boolean().default(true),
});

export const ThemeSchema = z.object({
  /** Brand colors */
  colors: z.object({
    brand: ColorPaletteSchema,
    surface: SurfaceColorsSchema.optional(),
  }),
  /** Typography settings */
  typography: TypographySchema.optional(),
  /** Component style overrides */
  components: ComponentStylesSchema.optional(),
  /** Logo URL */
  logoUrl: z.string().url().optional(),
  /** Favicon URL */
  faviconUrl: z.string().url().optional(),
});

// ============================================================================
// Deployment Schema
// ============================================================================

export const DeploymentFeaturesSchema = z.object({
  /** Enable contact form */
  contactForm: z.boolean().default(true),
  /** Enable quote request form */
  quoteForm: z.boolean().default(true),
  /** Enable blog/news section */
  blog: z.boolean().default(false),
  /** Enable reviews/testimonials section */
  reviews: z.boolean().default(true),
  /** Enable live chat widget */
  liveChat: z.boolean().default(false),
  /** Enable booking/scheduling */
  booking: z.boolean().default(false),
  /** Enable gallery */
  gallery: z.boolean().default(true),
});

export const DeploymentSchema = z.object({
  /** Site name/identifier for deployment */
  siteName: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Site name must be lowercase with hyphens"),
  /** Custom domain (if applicable) */
  domain: z.string().optional(),
  /** Subdomain (if using platform domain) */
  subdomain: z.string().optional(),
  /** Features to enable */
  features: DeploymentFeaturesSchema.optional(),
  /** Google Analytics ID */
  gaId: z.string().optional(),
  /** Google Tag Manager ID */
  gtmId: z.string().optional(),
});

// ============================================================================
// References Schema
// ============================================================================

export const CompetitorReferenceSchema = z.object({
  /** Competitor business name */
  name: z.string(),
  /** Competitor website URL */
  url: z.string().url(),
  /** Notes about what to reference */
  notes: z.string().optional(),
});

export const UploadedFileSchema = z.object({
  /** Original filename */
  filename: z.string(),
  /** Storage URL */
  url: z.string().url(),
  /** MIME type */
  mimeType: z.string(),
  /** File size in bytes */
  sizeBytes: z.number().int().positive(),
  /** Upload timestamp */
  uploadedAt: z.string().datetime(),
  /** Description or notes */
  description: z.string().optional(),
});

export const ReferencesSchema = z.object({
  /** Competitor websites to analyze */
  competitors: z.array(CompetitorReferenceSchema).default([]),
  /** Uploaded images (logos, photos, etc.) */
  uploadedImages: z.array(UploadedFileSchema).default([]),
  /** Uploaded documents (brochures, certificates, etc.) */
  uploadedDocuments: z.array(UploadedFileSchema).default([]),
  /** Existing website content to migrate */
  existingContent: z.array(z.string()).default([]),
});

// ============================================================================
// Inferred Data Schema
// ============================================================================

export const InferredServiceSchema = z.object({
  /** Suggested service slug */
  slug: z.string(),
  /** Suggested service title */
  title: z.string(),
  /** Confidence score (0-1) */
  confidence: z.number().min(0).max(1),
  /** Reason for suggestion */
  reason: z.string().optional(),
  /** Whether accepted by user */
  accepted: z.boolean().optional(),
});

export const InferredLocationSchema = z.object({
  /** Suggested location name */
  name: z.string(),
  /** Suggested location slug */
  slug: z.string(),
  /** Confidence score (0-1) */
  confidence: z.number().min(0).max(1),
  /** Reason for suggestion */
  reason: z.string().optional(),
  /** Whether accepted by user */
  accepted: z.boolean().optional(),
});

export const ExtractedThemeSchema = z.object({
  /** Extracted from source */
  source: z.enum(["website", "document", "logo", "manual"]),
  /** Extracted colors */
  colors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
  /** Detected font families */
  fonts: z.array(z.string()).optional(),
  /** Confidence score (0-1) */
  confidence: z.number().min(0).max(1).optional(),
});

export const InferredDataSchema = z.object({
  /** AI-suggested services based on industry/context */
  suggestedServices: z.array(InferredServiceSchema).default([]),
  /** AI-suggested locations based on address/geo */
  suggestedLocations: z.array(InferredLocationSchema).default([]),
  /** Theme extracted from existing website/documents */
  extractedTheme: ExtractedThemeSchema.optional(),
  /** AI-generated business description */
  generatedDescription: z.string().optional(),
  /** AI-suggested USPs */
  suggestedUsps: z.array(z.string()).default([]),
});

// ============================================================================
// Main ProjectFile Schema
// ============================================================================

export const ProjectFileSchema = z.object({
  /** Project metadata */
  metadata: ProjectMetadataSchema,

  /** Business identity and contact information */
  business: BusinessInfoSchema,

  /** Business credentials and certifications */
  credentials: CredentialsSchema.optional(),

  /** Services offered */
  services: z.array(ServiceDefinitionSchema).default([]),

  /** Coverage regions with locations */
  regions: z.array(RegionDefinitionSchema).default([]),

  /** Pricing information */
  pricing: PricingSchema.optional(),

  /** Brand voice guidelines */
  brandVoice: BrandVoiceSchema.optional(),

  /** Theme and visual settings */
  theme: ThemeSchema.optional(),

  /** Deployment configuration */
  deployment: DeploymentSchema.optional(),

  /** Reference materials */
  references: ReferencesSchema.optional(),

  /** AI-inferred/suggested data */
  inferred: InferredDataSchema.optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type IntakeChannel = z.infer<typeof IntakeChannelEnum>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type BusinessType = z.infer<typeof BusinessTypeEnum>;
export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;
export type LocationType = z.infer<typeof LocationTypeEnum>;
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type DayHours = z.infer<typeof DayHoursSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type GeoLocation = z.infer<typeof GeoLocationSchema>;
export type Geo = z.infer<typeof GeoSchema>;
export type BusinessInfo = z.infer<typeof BusinessInfoSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Insurance = z.infer<typeof InsuranceSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;
export type ServiceDefinition = z.infer<typeof ServiceDefinitionSchema>;
export type LocationDefinition = z.infer<typeof LocationDefinitionSchema>;
export type RegionDefinition = z.infer<typeof RegionDefinitionSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type Pricing = z.infer<typeof PricingSchema>;
export type BrandVoice = z.infer<typeof BrandVoiceSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type SurfaceColors = z.infer<typeof SurfaceColorsSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type ComponentStyles = z.infer<typeof ComponentStylesSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type DeploymentFeatures = z.infer<typeof DeploymentFeaturesSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type CompetitorReference = z.infer<typeof CompetitorReferenceSchema>;
export type UploadedFile = z.infer<typeof UploadedFileSchema>;
export type References = z.infer<typeof ReferencesSchema>;
export type InferredService = z.infer<typeof InferredServiceSchema>;
export type InferredLocation = z.infer<typeof InferredLocationSchema>;
export type ExtractedTheme = z.infer<typeof ExtractedThemeSchema>;
export type InferredData = z.infer<typeof InferredDataSchema>;
export type ProjectFile = z.infer<typeof ProjectFileSchema>;

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate a ProjectFile object
 * @param data - Raw data to validate
 * @returns Validated ProjectFile
 * @throws ZodError if validation fails
 */
export function validateProjectFile(data: unknown): ProjectFile {
  return ProjectFileSchema.parse(data);
}

/**
 * Safely validate a ProjectFile object
 * @param data - Raw data to validate
 * @returns Result with success status and data or error
 */
export function safeValidateProjectFile(
  data: unknown
): z.SafeParseReturnType<unknown, ProjectFile> {
  return ProjectFileSchema.safeParse(data);
}

/**
 * Create a new ProjectFile with default values
 * @param overrides - Partial ProjectFile to override defaults
 * @returns New ProjectFile with generated metadata
 */
export function createProjectFile(
  overrides: Partial<Omit<ProjectFile, "metadata">> & {
    metadata?: Partial<ProjectMetadata>;
  }
): ProjectFile {
  const now = new Date().toISOString();
  const projectId = crypto.randomUUID();

  return ProjectFileSchema.parse({
    metadata: {
      projectId,
      version: "1.0.0",
      status: "draft",
      intakeChannel: "web_form",
      createdAt: now,
      updatedAt: now,
      ...overrides.metadata,
    },
    business: overrides.business ?? {
      name: "",
      industry: "",
      phone: "",
      email: "",
    },
    credentials: overrides.credentials,
    services: overrides.services ?? [],
    regions: overrides.regions ?? [],
    pricing: overrides.pricing,
    brandVoice: overrides.brandVoice,
    theme: overrides.theme,
    deployment: overrides.deployment,
    references: overrides.references,
    inferred: overrides.inferred,
  });
}
