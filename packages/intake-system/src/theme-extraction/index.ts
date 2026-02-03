/**
 * Theme Extraction Module
 *
 * Utilities for extracting colors from images and styles from websites
 * to generate theme suggestions for the platform.
 *
 * @example
 * ```typescript
 * import {
 *   analyzeImage,
 *   extractStylesFromUrl,
 *   generateCompleteTheme,
 * } from '@platform/intake-system/theme-extraction';
 *
 * // Extract colors from a logo
 * const imageAnalysis = await analyzeImage('/path/to/logo.png');
 *
 * // Extract styles from a website
 * const websiteStyles = await extractStylesFromUrl('https://example.com');
 *
 * // Generate a complete theme suggestion
 * const theme = await generateCompleteTheme(imageAnalysis, websiteStyles);
 *
 * // Generate theme.config.ts content
 * const configContent = generateThemeConfigContent(theme, 'my-site');
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Color types
  RGBColor,
  HSLColor,
  ColorFrequency,

  // Image analysis types
  ExtractedColors,
  ImageAnalysis,
  ImageAnalysisOptions,

  // Website analysis types
  ExtractedStyles,
  StyleCategory,
  WebsiteAnalysisOptions,

  // Theme generation types
  ThemeSuggestion,
  ThemeGenerationOptions,
} from "./types";

// ============================================================================
// Image Analyzer Exports
// ============================================================================

export {
  // Core functions
  extractColorsFromImage,
  extractColorsFromBuffer,
  extractColorsFromUrl,
  analyzeImage,
  analyzeImageBuffer,
  analyzeMultipleImages,
} from "./image-analyzer";

// ============================================================================
// Website Analyzer Exports
// ============================================================================

export {
  // Core functions
  extractStylesFromUrl,
  extractStylesFromHtml,
  extractStylesFromCss,
  analyzeCompetitorSites,

  // Utilities
  categorizeStyle,
} from "./website-analyzer";

// ============================================================================
// Theme Generator Exports
// ============================================================================

export {
  // Generation functions
  generateThemeFromImage,
  generateThemeFromWebsite,
  generateCompleteTheme,
  generateDefaultTheme,
  mergeThemeSuggestions,

  // Config generation
  generateThemeConfigContent,

  // Utilities
  generateHoverColor,
  checkContrast,
} from "./theme-generator";

// ============================================================================
// Color Utilities Exports
// ============================================================================

export {
  // Conversion
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,

  // Analysis
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  isLightColor,
  getPerceivedBrightness,

  // Manipulation
  darken,
  lighten,
  adjustSaturation,
  getComplementary,
  getAnalogous,
  getTriadic,

  // Distance
  colorDistance,
  areColorsSimilar,

  // CSS parsing
  parseCssColor,
  isValidCssColor,
} from "./color-utils";
