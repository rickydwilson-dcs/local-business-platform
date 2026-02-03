/**
 * Image Analyzer
 *
 * Utilities for extracting dominant colors and analyzing images.
 * Uses sharp for image processing and implements color quantization
 * for efficient color extraction.
 */

import sharp from "sharp";
import type {
  ExtractedColors,
  ImageAnalysis,
  ImageAnalysisOptions,
  RGBColor,
  ColorFrequency,
} from "./types";
import {
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  isLightColor,
  getPerceivedBrightness,
  colorDistance,
  getComplementary,
  getAnalogous,
  darken,
  lighten,
  adjustSaturation,
} from "./color-utils";

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<ImageAnalysisOptions> = {
  maxColors: 5,
  quality: "balanced",
  colorThreshold: 25,
};

// Quality presets - smaller sample size for faster processing
const QUALITY_PRESETS = {
  fast: { sampleSize: 50 },
  balanced: { sampleSize: 100 },
  accurate: { sampleSize: 150 },
};

// ============================================================================
// Color Quantization
// ============================================================================

/**
 * Simple median cut color quantization
 * Groups similar colors and returns representative colors
 */
function quantizeColors(
  pixels: RGBColor[],
  maxColors: number,
  threshold: number
): ColorFrequency[] {
  if (pixels.length === 0) {
    return [];
  }

  // Group similar colors
  const colorGroups: Map<string, { color: RGBColor; count: number }> = new Map();

  for (const pixel of pixels) {
    // Skip very dark (near black) and very light (near white) pixels
    const brightness = getPerceivedBrightness(pixel);
    if (brightness < 20 || brightness > 235) {
      continue;
    }

    // Find existing similar color or create new group
    let foundGroup = false;
    for (const [key, group] of colorGroups) {
      if (colorDistance(pixel, group.color) < threshold) {
        group.count++;
        // Average the color
        group.color = {
          r: Math.round((group.color.r * (group.count - 1) + pixel.r) / group.count),
          g: Math.round((group.color.g * (group.count - 1) + pixel.g) / group.count),
          b: Math.round((group.color.b * (group.count - 1) + pixel.b) / group.count),
        };
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      const key = `${pixel.r}-${pixel.g}-${pixel.b}`;
      colorGroups.set(key, { color: pixel, count: 1 });
    }
  }

  // Convert to array and sort by frequency
  const sorted = Array.from(colorGroups.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors);

  const totalCount = sorted.reduce((sum, g) => sum + g.count, 0);

  return sorted.map((group) => ({
    color: group.color,
    hex: rgbToHex(group.color),
    count: group.count,
    percentage: (group.count / totalCount) * 100,
  }));
}

/**
 * Filter colors to get more vibrant/interesting colors
 * Filters out grays and very desaturated colors
 */
function filterVibrantColors(colors: ColorFrequency[]): ColorFrequency[] {
  return colors.filter((c) => {
    const hsl = rgbToHsl(c.color);
    // Keep colors with at least some saturation (not gray)
    return hsl.s > 10;
  });
}

/**
 * Select the best color for a role (primary, secondary, accent)
 */
function selectBestColorForRole(
  colors: ColorFrequency[],
  role: "primary" | "secondary" | "accent",
  existingColors: string[]
): string {
  const vibrant = filterVibrantColors(colors);
  const candidates = vibrant.length > 0 ? vibrant : colors;

  if (candidates.length === 0) {
    return "#005A9E"; // Default blue
  }

  switch (role) {
    case "primary":
      // Most dominant vibrant color
      return candidates[0].hex;

    case "secondary":
      // Find a color that complements the primary
      for (const color of candidates.slice(1)) {
        const isDifferent = existingColors.every((existing) => {
          const existingRgb = hexToRgb(existing);
          return existingRgb && colorDistance(color.color, existingRgb) > 50;
        });
        if (isDifferent) {
          return color.hex;
        }
      }
      // Fall back to generating complementary
      if (existingColors[0]) {
        return darken(existingColors[0], 20);
      }
      return candidates[0]?.hex ?? "#1A365D";

    case "accent":
      // Find a contrasting color
      for (const color of candidates) {
        const isDifferent = existingColors.every((existing) => {
          const existingRgb = hexToRgb(existing);
          return existingRgb && colorDistance(color.color, existingRgb) > 80;
        });
        if (isDifferent) {
          return color.hex;
        }
      }
      // Generate accent from primary
      if (existingColors[0]) {
        const analogous = getAnalogous(existingColors[0], 45);
        return analogous[0];
      }
      return candidates[candidates.length - 1]?.hex ?? "#38A169";
  }
}

// ============================================================================
// Image Analysis Functions
// ============================================================================

/**
 * Extract dominant colors from an image buffer
 */
export async function extractColorsFromBuffer(
  buffer: Buffer,
  options: ImageAnalysisOptions = {}
): Promise<ExtractedColors> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const quality = QUALITY_PRESETS[opts.quality];

  // Resize image for faster processing
  const resized = await sharp(buffer)
    .resize(quality.sampleSize, quality.sampleSize, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Extract pixels
  const pixels: RGBColor[] = [];
  const { data, info } = resized;

  for (let i = 0; i < data.length; i += 3) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    });
  }

  // Quantize colors
  const quantized = quantizeColors(pixels, opts.maxColors * 2, opts.colorThreshold);

  // Select colors for palette
  const palette = quantized.slice(0, opts.maxColors).map((c) => c.hex);

  // Get dominant color
  const dominant = palette[0] ?? "#005A9E";

  // Select suggested colors
  const primary = selectBestColorForRole(quantized, "primary", []);
  const secondary = selectBestColorForRole(quantized, "secondary", [primary]);
  const accent = selectBestColorForRole(quantized, "accent", [primary, secondary]);

  // Determine overall brightness
  const avgBrightness =
    pixels.reduce((sum, p) => sum + getPerceivedBrightness(p), 0) / pixels.length;
  const brightness = avgBrightness > 127 ? "light" : "dark";

  return {
    dominant,
    palette,
    suggested: {
      primary,
      secondary,
      accent,
    },
    brightness,
  };
}

/**
 * Extract dominant colors from an image file
 */
export async function extractColorsFromImage(
  imagePath: string,
  options: ImageAnalysisOptions = {}
): Promise<ExtractedColors> {
  const buffer = await sharp(imagePath).toBuffer();
  return extractColorsFromBuffer(buffer, options);
}

/**
 * Analyze an image for colors, dimensions, and format
 */
export async function analyzeImage(
  imagePath: string,
  options: ImageAnalysisOptions = {}
): Promise<ImageAnalysis> {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const buffer = await image.toBuffer();
  const colors = await extractColorsFromBuffer(buffer, options);

  return {
    colors,
    dimensions: {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
    },
    format: metadata.format ?? "unknown",
  };
}

/**
 * Analyze an image from a buffer
 */
export async function analyzeImageBuffer(
  buffer: Buffer,
  options: ImageAnalysisOptions = {}
): Promise<ImageAnalysis> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const colors = await extractColorsFromBuffer(buffer, options);

  return {
    colors,
    dimensions: {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
    },
    format: metadata.format ?? "unknown",
  };
}

/**
 * Extract colors from a URL (fetches the image first)
 */
export async function extractColorsFromUrl(
  url: string,
  options: ImageAnalysisOptions = {}
): Promise<ExtractedColors> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return extractColorsFromBuffer(buffer, options);
}

/**
 * Analyze multiple images and find common colors
 */
export async function analyzeMultipleImages(
  imagePaths: string[],
  options: ImageAnalysisOptions = {}
): Promise<{
  individualResults: ImageAnalysis[];
  commonColors: string[];
  suggestedPrimary: string;
}> {
  const results = await Promise.all(imagePaths.map((path) => analyzeImage(path, options)));

  // Find colors that appear in multiple images
  const colorCounts: Map<string, number> = new Map();
  const threshold = 40;

  for (const result of results) {
    for (const color of result.colors.palette) {
      const rgb = hexToRgb(color);
      if (!rgb) continue;

      // Check if similar color already counted
      let found = false;
      for (const [existingColor, count] of colorCounts) {
        const existingRgb = hexToRgb(existingColor);
        if (existingRgb && colorDistance(rgb, existingRgb) < threshold) {
          colorCounts.set(existingColor, count + 1);
          found = true;
          break;
        }
      }

      if (!found) {
        colorCounts.set(color, 1);
      }
    }
  }

  // Sort by frequency and get common colors
  const sortedColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  // Find most common vibrant color for primary
  const suggestedPrimary =
    sortedColors.find((color) => {
      const rgb = hexToRgb(color);
      if (!rgb) return false;
      const hsl = rgbToHsl(rgb);
      return hsl.s > 20; // Has some saturation
    }) ??
    sortedColors[0] ??
    "#005A9E";

  return {
    individualResults: results,
    commonColors: sortedColors.slice(0, 5),
    suggestedPrimary,
  };
}
