/**
 * Theme System
 * Comprehensive design token system for white-label platform theming
 */

// Types
export type {
  ThemeConfig,
  PartialThemeConfig,
  DeepPartialThemeConfig,
  TypographyScaleEntry,
  FontPreload,
  ValidatedThemeConfig,
} from "./types";

export { ThemeConfigSchema } from "./types";

// Default theme
export { defaultTheme } from "./defaults";

// CSS generation
export {
  generateCssVariables,
  generateCssString,
  generateFontPreloadLinks,
  generateFontFaceDeclarations,
} from "./generate-css";

// Tailwind plugin
export { createThemePlugin } from "./tailwind-plugin";

// Utilities
export {
  deepMerge,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  findMissingKeys,
  getNestedValue,
} from "./utils";

// Validation
export { validateTheme, formatValidationResult } from "./cli/validate";
export type { ValidationResult } from "./cli/validate";
