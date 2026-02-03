/**
 * @platform/intake-system
 *
 * Multi-channel customer intake system for site generation.
 * Provides schemas, validation, industry templates, chat intake
 * utilities, and theme extraction for the intake process.
 *
 * @packageDocumentation
 */

// ============================================================================
// Schema Exports
// ============================================================================

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
} from "./schemas";

// Export all types from schemas
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
} from "./schemas";

// ============================================================================
// Template Exports
// ============================================================================

export {
  // Types
  type IndustryTemplate,

  // Individual Templates
  scaffoldingTemplate,
  plumbingTemplate,
  electricalTemplate,
  cleaningTemplate,
  landscapingTemplate,

  // Registry
  industryTemplates,

  // Utility Functions
  getIndustryTemplate,
  getAvailableIndustries,
  getAllIndustryTemplates,
  searchIndustryTemplates,
} from "./templates";

// ============================================================================
// Chat Intake Exports
// ============================================================================

export {
  // System Prompts
  INTAKE_SYSTEM_PROMPT,
  INTAKE_SYSTEM_PROMPT_MINIMAL,
  INTAKE_SYSTEM_PROMPT_VOICE,
  INTAKE_SECTION_PROMPTS,

  // Tool Definitions
  INTAKE_TOOLS,
  getIndustryTemplateTool,
  suggestNearbyLocationsTool,
  validateProjectSectionTool,
  generateProjectFileTool,
  formatServicesTool,
  formatLocationsTool,
  suggestBrandColorsTool,
  validatePhoneNumberTool,
  validatePostcodeTool,

  // Utility Functions
  getIntakeTool,
  getIntakeToolNames,

  // Types
  type ToolDefinition,
  type ToolHandler,
  type IntakeToolHandlers,
  type GetIndustryTemplateResponse,
  type SuggestNearbyLocationsResponse,
  type ValidateProjectSectionResponse,
  type GenerateProjectFileResponse,
  type FormatServicesResponse,
  type FormatLocationsResponse,
} from "./chat-intake";

// ============================================================================
// Theme Extraction Exports
// ============================================================================

export {
  // Image analysis
  extractColorsFromImage,
  extractColorsFromBuffer,
  extractColorsFromUrl,
  analyzeImage,
  analyzeImageBuffer,
  analyzeMultipleImages,

  // Website analysis
  extractStylesFromUrl,
  extractStylesFromHtml,
  extractStylesFromCss,
  analyzeCompetitorSites,
  categorizeStyle,

  // Theme generation
  generateThemeFromImage,
  generateThemeFromWebsite,
  generateCompleteTheme,
  generateDefaultTheme,
  mergeThemeSuggestions,
  generateThemeConfigContent,
  generateHoverColor,
  checkContrast,

  // Color utilities
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  isLightColor,
  getPerceivedBrightness,
  darken,
  lighten,
  adjustSaturation,
  getComplementary,
  getAnalogous,
  getTriadic,
  colorDistance,
  areColorsSimilar,
  parseCssColor,
  isValidCssColor,

  // Types
  type RGBColor,
  type HSLColor,
  type ColorFrequency,
  type ExtractedColors,
  type ImageAnalysis,
  type ImageAnalysisOptions,
  type ExtractedStyles,
  type StyleCategory,
  type WebsiteAnalysisOptions,
  type ThemeSuggestion,
  type ThemeGenerationOptions,
} from "./theme-extraction";
