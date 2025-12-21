/**
 * Utility functions for theme system
 */

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue !== null &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result as T;
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;

  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * Normal text: 4.5:1
 * Large text (18pt+): 3:1
 */
export function meetsWcagAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 * Normal text: 7:1
 * Large text (18pt+): 4.5:1
 */
export function meetsWcagAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Find all missing keys between two objects (recursive)
 */
export function findMissingKeys(
  partial: Record<string, unknown>,
  full: Record<string, unknown>,
  prefix = ""
): string[] {
  const missing: string[] = [];

  for (const key in full) {
    if (Object.prototype.hasOwnProperty.call(full, key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      const fullValue = full[key];
      const partialValue = partial[key];

      if (partialValue === undefined) {
        missing.push(fullPath);
      } else if (
        fullValue !== null &&
        typeof fullValue === "object" &&
        !Array.isArray(fullValue) &&
        partialValue !== null &&
        typeof partialValue === "object" &&
        !Array.isArray(partialValue)
      ) {
        missing.push(
          ...findMissingKeys(
            partialValue as Record<string, unknown>,
            fullValue as Record<string, unknown>,
            fullPath
          )
        );
      }
    }
  }

  return missing;
}

/**
 * Get nested value from object using dot notation path
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}
