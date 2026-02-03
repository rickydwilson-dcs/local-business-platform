/**
 * Color Utilities
 *
 * Shared color manipulation and conversion utilities for theme extraction.
 */

import type { RGBColor, HSLColor } from "./types";

// ============================================================================
// Color Conversion
// ============================================================================

/**
 * Convert RGB to hex string
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number): string => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Convert hex string to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, "");

  // Handle 3-character hex
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(fullHex)) {
    return null;
  }

  return {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ============================================================================
// Color Analysis
// ============================================================================

/**
 * Calculate relative luminance of a color (WCAG formula)
 */
export function getLuminance(rgb: RGBColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const normalized = v / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA requirements
 * @param foreground - Foreground color
 * @param background - Background color
 * @param largeText - Whether text is large (14pt bold or 18pt regular)
 */
export function meetsContrastRequirement(
  foreground: RGBColor,
  background: RGBColor,
  largeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Determine if a color is light or dark
 */
export function isLightColor(rgb: RGBColor): boolean {
  return getLuminance(rgb) > 0.179;
}

/**
 * Calculate perceived brightness (0-255)
 */
export function getPerceivedBrightness(rgb: RGBColor): number {
  // Using perceived luminance formula
  return Math.sqrt(0.299 * rgb.r * rgb.r + 0.587 * rgb.g * rgb.g + 0.114 * rgb.b * rgb.b);
}

// ============================================================================
// Color Manipulation
// ============================================================================

/**
 * Generate a darker shade of a color
 * @param hex - Hex color string
 * @param amount - Amount to darken (0-100)
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  hsl.l = Math.max(0, hsl.l - amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Generate a lighter shade of a color
 * @param hex - Hex color string
 * @param amount - Amount to lighten (0-100)
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  hsl.l = Math.min(100, hsl.l + amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Adjust saturation of a color
 * @param hex - Hex color string
 * @param amount - Amount to adjust (-100 to 100)
 */
export function adjustSaturation(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Generate a complementary color (opposite on color wheel)
 */
export function getComplementary(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  hsl.h = (hsl.h + 180) % 360;
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function getAnalogous(hex: string, angle = 30): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex];

  const hsl = rgbToHsl(rgb);
  return [
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + angle) % 360 })),
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h - angle + 360) % 360 })),
  ];
}

/**
 * Generate triadic colors (evenly spaced on color wheel)
 */
export function getTriadic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex];

  const hsl = rgbToHsl(rgb);
  return [
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + 120) % 360 })),
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + 240) % 360 })),
  ];
}

/**
 * Generate a hover color variant
 * Darkens light colors, lightens dark colors
 */
export function generateHoverColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);

  // For light colors, darken; for dark colors, lighten
  if (hsl.l > 50) {
    hsl.l = Math.max(0, hsl.l - 10);
  } else {
    hsl.l = Math.min(100, hsl.l + 10);
  }

  return rgbToHex(hslToRgb(hsl));
}

// ============================================================================
// Color Distance
// ============================================================================

/**
 * Calculate Euclidean distance between two RGB colors
 */
export function colorDistance(color1: RGBColor, color2: RGBColor): number {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
}

/**
 * Check if two colors are similar (within threshold)
 * @param threshold - Maximum distance (0-441.67 for RGB)
 */
export function areColorsSimilar(color1: RGBColor, color2: RGBColor, threshold = 30): boolean {
  return colorDistance(color1, color2) < threshold;
}

// ============================================================================
// CSS Color Parsing
// ============================================================================

/**
 * Parse a CSS color string to hex
 * Supports: hex, rgb(), rgba(), hsl(), hsla(), and named colors
 * Returns null for transparent or invalid colors
 */
export function parseCssColor(cssColor: string): string | null {
  const trimmed = cssColor.trim().toLowerCase();

  // Handle transparent explicitly
  if (trimmed === "transparent") {
    return null;
  }

  // Already hex
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    const rgb = hexToRgb(trimmed);
    return rgb ? rgbToHex(rgb) : null;
  }

  // RGB/RGBA
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return rgbToHex({
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    });
  }

  // HSL/HSLA
  const hslMatch = trimmed.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
  if (hslMatch) {
    return rgbToHex(
      hslToRgb({
        h: parseInt(hslMatch[1], 10),
        s: parseInt(hslMatch[2], 10),
        l: parseInt(hslMatch[3], 10),
      })
    );
  }

  // Named colors (common ones)
  const namedColors: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#FF0000",
    green: "#008000",
    blue: "#0000FF",
    yellow: "#FFFF00",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    gray: "#808080",
    grey: "#808080",
    orange: "#FFA500",
    purple: "#800080",
    pink: "#FFC0CB",
    brown: "#A52A2A",
    navy: "#000080",
    teal: "#008080",
    olive: "#808000",
    maroon: "#800000",
    silver: "#C0C0C0",
    lime: "#00FF00",
    aqua: "#00FFFF",
    fuchsia: "#FF00FF",
  };

  return namedColors[trimmed] ?? null;
}

/**
 * Check if a string is a valid CSS color
 */
export function isValidCssColor(cssColor: string): boolean {
  return parseCssColor(cssColor) !== null;
}
