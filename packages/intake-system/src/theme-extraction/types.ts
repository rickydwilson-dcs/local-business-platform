/**
 * Theme Extraction Types
 *
 * Type definitions for theme extraction utilities.
 */

// ============================================================================
// Color Types
// ============================================================================

/**
 * RGB color representation
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL color representation
 */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Color with frequency count from color quantization
 */
export interface ColorFrequency {
  color: RGBColor;
  hex: string;
  count: number;
  percentage: number;
}

// ============================================================================
// Image Analysis Types
// ============================================================================

/**
 * Colors extracted from an image
 */
export interface ExtractedColors {
  /** Most dominant color (hex) */
  dominant: string;
  /** Top colors from the palette (hex) */
  palette: string[];
  /** Suggested theme colors based on analysis */
  suggested: {
    primary: string;
    secondary: string;
    accent: string;
  };
  /** Overall brightness of the image */
  brightness: "light" | "dark";
}

/**
 * Complete image analysis result
 */
export interface ImageAnalysis {
  /** Extracted color information */
  colors: ExtractedColors;
  /** Image dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Image format (e.g., 'jpeg', 'png', 'webp') */
  format: string;
}

// ============================================================================
// Website Analysis Types
// ============================================================================

/**
 * Styles extracted from a website
 */
export interface ExtractedStyles {
  /** Color values found */
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  /** Font families found */
  fonts: {
    heading?: string;
    body?: string;
  };
  /** Detected style category */
  style: StyleCategory;
}

/**
 * Style categories for classification
 */
export type StyleCategory =
  | "modern"
  | "traditional"
  | "bold"
  | "minimal"
  | "corporate"
  | "playful"
  | "elegant";

// ============================================================================
// Theme Generation Types
// ============================================================================

/**
 * Theme suggestion generated from extracted data
 */
export interface ThemeSuggestion {
  /** Suggested colors */
  colors: {
    brand: {
      primary: string;
      primaryHover: string;
      secondary: string;
      accent: string;
    };
    surface?: {
      background: string;
      foreground: string;
      muted?: string;
    };
  };
  /** Typography suggestions */
  typography?: {
    fontFamily: {
      sans: string[];
      heading: string[];
    };
  };
  /** Style category */
  style: StyleCategory;
  /** Confidence score (0-1) */
  confidence: number;
  /** Source of the theme data */
  source: "image" | "website" | "merged";
}

/**
 * Options for theme generation
 */
export interface ThemeGenerationOptions {
  /** Prefer dark mode theme */
  preferDarkMode?: boolean;
  /** Target style category */
  targetStyle?: StyleCategory;
  /** Minimum contrast ratio for accessibility */
  minContrastRatio?: number;
}

// ============================================================================
// Analysis Options Types
// ============================================================================

/**
 * Options for image analysis
 */
export interface ImageAnalysisOptions {
  /** Maximum number of colors to extract */
  maxColors?: number;
  /** Quality of analysis (affects processing time) */
  quality?: "fast" | "balanced" | "accurate";
  /** Minimum color difference threshold (0-255) */
  colorThreshold?: number;
}

/**
 * Options for website analysis
 */
export interface WebsiteAnalysisOptions {
  /** Timeout for fetching the website (ms) */
  timeout?: number;
  /** Whether to fetch and analyze linked stylesheets */
  fetchStylesheets?: boolean;
  /** User agent string for requests */
  userAgent?: string;
}
