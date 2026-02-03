/**
 * Schema Exports
 *
 * Central export point for all intake system schemas and types.
 */

// Export all schemas
export {
  // Enums
  IntakeChannelEnum,
  ProjectStatusEnum,
  BusinessTypeEnum,
  ServiceCategoryEnum,
  LocationTypeEnum,
  DayOfWeekEnum,

  // Component Schemas
  ProjectMetadataSchema,
  AddressSchema,
  TimeSlotSchema,
  DayHoursSchema,
  BusinessHoursSchema,
  SocialMediaSchema,
  GeoLocationSchema,
  GeoSchema,
  BusinessInfoSchema,
  CertificationSchema,
  InsuranceSchema,
  CredentialsSchema,
  ServiceDefinitionSchema,
  LocationDefinitionSchema,
  RegionDefinitionSchema,
  PricingTierSchema,
  PricingSchema,
  BrandVoiceSchema,
  ColorPaletteSchema,
  SurfaceColorsSchema,
  TypographySchema,
  ComponentStylesSchema,
  ThemeSchema,
  DeploymentFeaturesSchema,
  DeploymentSchema,
  CompetitorReferenceSchema,
  UploadedFileSchema,
  ReferencesSchema,
  InferredServiceSchema,
  InferredLocationSchema,
  ExtractedThemeSchema,
  InferredDataSchema,

  // Main Schema
  ProjectFileSchema,

  // Validation Utilities
  validateProjectFile,
  safeValidateProjectFile,
  createProjectFile,
} from "./project-file.schema";

// Export all types
export type {
  // Enum Types
  IntakeChannel,
  ProjectStatus,
  BusinessType,
  ServiceCategory,
  LocationType,
  DayOfWeek,

  // Component Types
  ProjectMetadata,
  Address,
  TimeSlot,
  DayHours,
  BusinessHours,
  SocialMedia,
  GeoLocation,
  Geo,
  BusinessInfo,
  Certification,
  Insurance,
  Credentials,
  ServiceDefinition,
  LocationDefinition,
  RegionDefinition,
  PricingTier,
  Pricing,
  BrandVoice,
  ColorPalette,
  SurfaceColors,
  Typography,
  ComponentStyles,
  Theme,
  DeploymentFeatures,
  Deployment,
  CompetitorReference,
  UploadedFile,
  References,
  InferredService,
  InferredLocation,
  ExtractedTheme,
  InferredData,

  // Main Type
  ProjectFile,
} from "./project-file.schema";
