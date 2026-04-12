/**
 * Theme System
 * Comprehensive design token system for white-label platform theming
 */

// Types
export type {
  ThemeConfig,
  ThemeName,
  ComponentCategory,
  ComponentRegistry,
  PartialThemeConfig,
  DeepPartialThemeConfig,
  TypographyScaleEntry,
  FontPreload,
  ValidatedThemeConfig,
} from "./types";

export { THEME_NAMES, ThemeConfigSchema, ThemeNameSchema, ComponentRegistrySchema } from "./types";

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

// Theme registry
export { registerTheme, getRegisteredThemes } from "./theme-registry";
export type { ThemeRegistryEntry } from "./theme-registry";

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

// Validation (import directly from @platform/theme-system/cli/validate for CLI use)
// Not re-exported here to avoid pulling CLI-only code into browser bundles
