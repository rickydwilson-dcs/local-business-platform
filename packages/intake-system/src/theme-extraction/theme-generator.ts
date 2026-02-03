/**
 * Theme Generator
 *
 * Generate theme.config.ts content from extracted image and website data.
 * Produces theme suggestions that are compatible with the platform's theme system.
 */

import type {
  ThemeSuggestion,
  ThemeGenerationOptions,
  ImageAnalysis,
  ExtractedStyles,
  ExtractedColors,
  StyleCategory,
} from "./types";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  darken,
  lighten,
  isLightColor,
  getContrastRatio,
  meetsContrastRequirement,
  getComplementary,
  getAnalogous,
  adjustSaturation,
} from "./color-utils";

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<ThemeGenerationOptions> = {
  preferDarkMode: false,
  targetStyle: "modern",
  minContrastRatio: 4.5, // WCAG AA
};

// ============================================================================
// Font Suggestions
// ============================================================================

const FONT_SUGGESTIONS: Record<StyleCategory, { sans: string[]; heading: string[] }> = {
  modern: {
    sans: ["Inter", "system-ui", "sans-serif"],
    heading: ["Inter", "system-ui", "sans-serif"],
  },
  traditional: {
    sans: ["Georgia", "Times New Roman", "serif"],
    heading: ["Playfair Display", "Georgia", "serif"],
  },
  bold: {
    sans: ["Montserrat", "system-ui", "sans-serif"],
    heading: ["Oswald", "Impact", "sans-serif"],
  },
  minimal: {
    sans: ["Inter", "Helvetica Neue", "sans-serif"],
    heading: ["Inter", "Helvetica Neue", "sans-serif"],
  },
  corporate: {
    sans: ["Open Sans", "Arial", "sans-serif"],
    heading: ["Roboto", "Arial", "sans-serif"],
  },
  playful: {
    sans: ["Poppins", "Comic Sans MS", "sans-serif"],
    heading: ["Fredoka One", "Poppins", "sans-serif"],
  },
  elegant: {
    sans: ["Lora", "Georgia", "serif"],
    heading: ["Cormorant Garamond", "Georgia", "serif"],
  },
};

// ============================================================================
// Color Enhancement
// ============================================================================

/**
 * Ensure a color meets minimum saturation for brand use
 */
function ensureVibrant(hex: string, minSaturation = 30): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  if (hsl.s < minSaturation) {
    hsl.s = minSaturation;
    return rgbToHex(hslToRgb(hsl));
  }
  return hex;
}

/**
 * Ensure sufficient contrast between two colors
 */
function ensureContrast(foreground: string, background: string, minRatio = 4.5): string {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  if (!fgRgb || !bgRgb) return foreground;

  const ratio = getContrastRatio(fgRgb, bgRgb);
  if (ratio >= minRatio) return foreground;

  const fgHsl = rgbToHsl(fgRgb);
  const bgHsl = rgbToHsl(bgRgb);

  // Adjust lightness to achieve contrast
  if (bgHsl.l > 50) {
    // Dark foreground needed
    while (fgHsl.l > 0) {
      fgHsl.l -= 5;
      const newFg = hslToRgb(fgHsl);
      if (getContrastRatio(newFg, bgRgb) >= minRatio) {
        return rgbToHex(newFg);
      }
    }
  } else {
    // Light foreground needed
    while (fgHsl.l < 100) {
      fgHsl.l += 5;
      const newFg = hslToRgb(fgHsl);
      if (getContrastRatio(newFg, bgRgb) >= minRatio) {
        return rgbToHex(newFg);
      }
    }
  }

  return foreground;
}

/**
 * Generate appropriate surface colors
 */
function generateSurfaceColors(
  primaryHex: string,
  preferDark: boolean
): {
  background: string;
  foreground: string;
  muted: string;
} {
  if (preferDark) {
    return {
      background: "#1A1A1A",
      foreground: "#FFFFFF",
      muted: "#2D2D2D",
    };
  }

  return {
    background: "#FFFFFF",
    foreground: "#1A1A1A",
    muted: "#F5F5F5",
  };
}

/**
 * Generate a hover color variant
 */
export function generateHoverColor(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;

  const hsl = rgbToHsl(rgb);

  // For light colors, darken; for dark colors, lighten
  if (hsl.l > 50) {
    return darken(baseColor, 10);
  } else {
    return lighten(baseColor, 10);
  }
}

/**
 * Check if color combination has sufficient contrast
 */
export function checkContrast(foreground: string, background: string): boolean {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  if (!fgRgb || !bgRgb) return false;

  return meetsContrastRequirement(fgRgb, bgRgb, false);
}

// ============================================================================
// Theme Generation from Image
// ============================================================================

/**
 * Generate theme suggestion from image analysis
 */
export function generateThemeFromImage(
  analysis: ImageAnalysis,
  options: ThemeGenerationOptions = {}
): ThemeSuggestion {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { colors } = analysis;

  // Use suggested colors as base
  let primary = ensureVibrant(colors.suggested.primary);
  let secondary = colors.suggested.secondary;
  let accent = colors.suggested.accent;

  // Generate hover color
  const primaryHover = generateHoverColor(primary);

  // Generate surface colors
  const surface = generateSurfaceColors(primary, opts.preferDarkMode);

  // Ensure contrast for primary on background
  const adjustedPrimary = ensureContrast(primary, surface.background, opts.minContrastRatio);

  // Determine style based on colors
  const primaryRgb = hexToRgb(primary);
  const primaryHsl = primaryRgb ? rgbToHsl(primaryRgb) : { h: 0, s: 50, l: 50 };

  let style: StyleCategory = opts.targetStyle;
  if (primaryHsl.s > 70) {
    style = "bold";
  } else if (primaryHsl.s < 30) {
    style = "minimal";
  } else if (primaryHsl.l < 30) {
    style = "corporate";
  }

  // Calculate confidence based on color quality
  const hasDiversePalette = colors.palette.length >= 3;
  const hasVibrantColors = primaryHsl.s > 20;
  const confidence = (hasDiversePalette ? 0.4 : 0.2) + (hasVibrantColors ? 0.4 : 0.2) + 0.2;

  return {
    colors: {
      brand: {
        primary: adjustedPrimary,
        primaryHover,
        secondary,
        accent,
      },
      surface,
    },
    typography: {
      fontFamily: FONT_SUGGESTIONS[style],
    },
    style,
    confidence: Math.min(confidence, 1),
    source: "image",
  };
}

// ============================================================================
// Theme Generation from Website
// ============================================================================

/**
 * Generate theme suggestion from website analysis
 */
export function generateThemeFromWebsite(
  styles: ExtractedStyles,
  options: ThemeGenerationOptions = {}
): ThemeSuggestion {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { colors, fonts, style: detectedStyle } = styles;

  // Use extracted colors or generate defaults
  let primary = colors.primary ?? "#005A9E";
  let secondary = colors.secondary ?? darken(primary, 15);
  let accent = getAnalogous(primary, 45)[0];

  // Ensure vibrant
  primary = ensureVibrant(primary);

  // Generate hover color
  const primaryHover = generateHoverColor(primary);

  // Determine background/foreground
  const background = colors.background ?? "#FFFFFF";
  const foreground = colors.text ?? "#1A1A1A";

  // Generate surface colors
  const surface = {
    background,
    foreground: ensureContrast(foreground, background, opts.minContrastRatio),
    muted: opts.preferDarkMode ? "#2D2D2D" : "#F5F5F5",
  };

  // Build typography from extracted fonts
  const typography = {
    fontFamily: {
      sans: fonts.body
        ? [fonts.body, ...FONT_SUGGESTIONS[detectedStyle].sans.slice(1)]
        : FONT_SUGGESTIONS[detectedStyle].sans,
      heading: fonts.heading
        ? [fonts.heading, ...FONT_SUGGESTIONS[detectedStyle].heading.slice(1)]
        : FONT_SUGGESTIONS[detectedStyle].heading,
    },
  };

  // Calculate confidence
  const hasColors = !!(colors.primary || colors.secondary);
  const hasFonts = !!(fonts.body || fonts.heading);
  const confidence = (hasColors ? 0.5 : 0.2) + (hasFonts ? 0.3 : 0.1) + 0.2;

  return {
    colors: {
      brand: {
        primary,
        primaryHover,
        secondary,
        accent,
      },
      surface,
    },
    typography,
    style: detectedStyle,
    confidence: Math.min(confidence, 1),
    source: "website",
  };
}

// ============================================================================
// Theme Merging
// ============================================================================

/**
 * Merge multiple theme suggestions with weighted confidence
 */
export function mergeThemeSuggestions(suggestions: ThemeSuggestion[]): ThemeSuggestion {
  if (suggestions.length === 0) {
    return generateDefaultTheme();
  }

  if (suggestions.length === 1) {
    return { ...suggestions[0], source: "merged" };
  }

  // Sort by confidence
  const sorted = [...suggestions].sort((a, b) => b.confidence - a.confidence);
  const primary = sorted[0];

  // Use highest confidence colors
  const colors = { ...primary.colors };

  // Merge typography, preferring website-extracted fonts
  const websiteTypography = sorted.find((s) => s.source === "website")?.typography;
  const typography = websiteTypography ?? primary.typography;

  // Use most confident style
  const style = primary.style;

  // Average confidence
  const avgConfidence = sorted.reduce((sum, s) => sum + s.confidence, 0) / sorted.length;

  return {
    colors,
    typography,
    style,
    confidence: avgConfidence,
    source: "merged",
  };
}

/**
 * Generate a default theme when no data is available
 */
export function generateDefaultTheme(options: ThemeGenerationOptions = {}): ThemeSuggestion {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const primary = "#005A9E";
  const surface = generateSurfaceColors(primary, opts.preferDarkMode);

  return {
    colors: {
      brand: {
        primary,
        primaryHover: "#004680",
        secondary: "#1A365D",
        accent: "#38A169",
      },
      surface,
    },
    typography: {
      fontFamily: FONT_SUGGESTIONS[opts.targetStyle],
    },
    style: opts.targetStyle,
    confidence: 0.3,
    source: "merged",
  };
}

// ============================================================================
// Theme Config Generation
// ============================================================================

/**
 * Generate theme.config.ts content from a theme suggestion
 */
export function generateThemeConfigContent(suggestion: ThemeSuggestion, siteName: string): string {
  const { colors, typography, style } = suggestion;

  const config = `import { defineTheme } from '@platform/theme-system';

/**
 * Theme configuration for ${siteName}
 * Generated from extracted brand colors
 * Style: ${style}
 * Confidence: ${Math.round(suggestion.confidence * 100)}%
 */
export default defineTheme({
  name: '${siteName}',
  colors: {
    brand: {
      primary: '${colors.brand.primary}',
      primaryHover: '${colors.brand.primaryHover}',
      secondary: '${colors.brand.secondary}',
      accent: '${colors.brand.accent}',
    },${
      colors.surface
        ? `
    surface: {
      background: '${colors.surface.background}',
      foreground: '${colors.surface.foreground}',${colors.surface.muted ? `\n      muted: '${colors.surface.muted}',` : ""}
    },`
        : ""
    }
  },${
    typography
      ? `
  typography: {
    fontFamily: {
      sans: [${typography.fontFamily.sans.map((f) => `'${f}'`).join(", ")}],
      heading: [${typography.fontFamily.heading.map((f) => `'${f}'`).join(", ")}],
    },
  },`
      : ""
  }
});
`;

  return config;
}

/**
 * Generate a complete theme suggestion from both image and website
 */
export async function generateCompleteTheme(
  imageAnalysis: ImageAnalysis | null,
  websiteStyles: ExtractedStyles | null,
  options: ThemeGenerationOptions = {}
): Promise<ThemeSuggestion> {
  const suggestions: ThemeSuggestion[] = [];

  if (imageAnalysis) {
    suggestions.push(generateThemeFromImage(imageAnalysis, options));
  }

  if (websiteStyles) {
    suggestions.push(generateThemeFromWebsite(websiteStyles, options));
  }

  if (suggestions.length === 0) {
    return generateDefaultTheme(options);
  }

  return mergeThemeSuggestions(suggestions);
}
