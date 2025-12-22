#!/usr/bin/env ts-node
/**
 * Theme Validation CLI
 * Validates theme configurations for correctness and accessibility
 */

import { ThemeConfig, ThemeConfigSchema, DeepPartialThemeConfig } from "../types";
import { defaultTheme } from "../defaults";
import { deepMerge, getContrastRatio, findMissingKeys, getNestedValue } from "../utils";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Contrast pairs to validate for WCAG AA compliance
 * [foreground path, background path/value, min ratio, description]
 */
const CONTRAST_PAIRS: [string, string, number, string][] = [
  ["colors.brand.primary", "#ffffff", 4.5, "Primary brand color on white (button text)"],
  ["colors.surface.foreground", "colors.surface.background", 4.5, "Body text on background"],
  ["colors.surface.mutedForeground", "colors.surface.background", 4.5, "Muted text on background"],
  ["colors.surface.mutedForeground", "colors.surface.muted", 4.5, "Muted text on muted background"],
  ["colors.surface.foreground", "colors.surface.card", 4.5, "Body text on card"],
];

/**
 * Get color value from config or return raw value if it's a hex color
 */
function getColor(config: ThemeConfig, pathOrValue: string): string {
  if (pathOrValue.startsWith("#")) {
    return pathOrValue;
  }
  const value = getNestedValue(config as unknown as Record<string, unknown>, pathOrValue);
  if (typeof value === "string" && value.startsWith("#")) {
    return value;
  }
  return "#000000"; // Fallback
}

/**
 * Validate a theme configuration
 */
export function validateTheme(userConfig: DeepPartialThemeConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Merge with defaults to get complete config
  const config = deepMerge(
    defaultTheme as unknown as Record<string, unknown>,
    userConfig as Record<string, unknown>
  ) as unknown as ThemeConfig;

  // 1. Schema validation with Zod
  const parseResult = ThemeConfigSchema.safeParse(config);
  if (!parseResult.success) {
    for (const issue of parseResult.error.issues) {
      errors.push(`${issue.path.join(".")}: ${issue.message}`);
    }
  }

  // 2. WCAG AA contrast checks
  for (const [fgPath, bgPath, minRatio, description] of CONTRAST_PAIRS) {
    const fg = getColor(config, fgPath);
    const bg = getColor(config, bgPath);
    const ratio = getContrastRatio(fg, bg);

    if (ratio < minRatio) {
      warnings.push(
        `Contrast ratio for "${description}" is ${ratio.toFixed(2)}:1, minimum ${minRatio}:1 required for WCAG AA`
      );
    }
  }

  // 3. Missing token warnings
  const missingTokens = findMissingKeys(
    userConfig as Record<string, unknown>,
    defaultTheme as unknown as Record<string, unknown>
  );

  // Only warn about high-level missing sections, not every nested property
  const importantMissing = missingTokens.filter((token) => {
    const parts = token.split(".");
    return parts.length <= 2; // Only warn about top-level or one-deep missing
  });

  for (const token of importantMissing) {
    warnings.push(`Missing token: ${token} - using default value`);
  }

  // 4. Validate font preload paths
  for (const font of config.fonts.preload) {
    if (!font.src.startsWith("/") && !font.src.startsWith("http")) {
      warnings.push(
        `Font preload path "${font.src}" should be absolute (start with "/" or "http")`
      );
    }
  }

  // 5. Validate z-index ordering
  const zIndexValues = [
    ["dropdown", config.zIndex.dropdown],
    ["sticky", config.zIndex.sticky],
    ["modal", config.zIndex.modal],
    ["popover", config.zIndex.popover],
    ["tooltip", config.zIndex.tooltip],
  ] as const;

  for (let i = 1; i < zIndexValues.length; i++) {
    const [prevName, prevValue] = zIndexValues[i - 1];
    const [currName, currValue] = zIndexValues[i];
    if (currValue < prevValue) {
      warnings.push(
        `z-index "${currName}" (${currValue}) should be greater than "${prevName}" (${prevValue})`
      );
    }
  }

  // 6. Validate spacing scale is ordered
  const spacingKeys = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
  const spacingValues = spacingKeys.map((key) => {
    const value = config.spacing[key];
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  });

  for (let i = 1; i < spacingValues.length; i++) {
    if (spacingValues[i] < spacingValues[i - 1]) {
      warnings.push(`Spacing scale is not monotonically increasing at "${spacingKeys[i]}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format validation result for CLI output
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push("✓ Theme configuration is valid");
  } else {
    lines.push("✗ Theme configuration has errors:");
    for (const error of result.errors) {
      lines.push(`  ✗ ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push("");
    lines.push("Warnings:");
    for (const warning of result.warnings) {
      lines.push(`  ⚠ ${warning}`);
    }
  }

  return lines.join("\n");
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: pnpm theme-system validate <path-to-theme-config.ts>");
    console.log("");
    console.log("Example:");
    console.log("  pnpm theme-system validate ./theme.config.ts");
    process.exit(1);
  }

  const configPath = args[0];

  try {
    // Dynamic import of the theme config
    const configModule = await import(configPath);
    const userConfig = configModule.themeConfig || configModule.default || configModule;

    const result = validateTheme(userConfig);
    console.log(formatValidationResult(result));

    process.exit(result.valid ? 0 : 1);
  } catch (error) {
    console.error(`Failed to load theme config from "${configPath}":`, error);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}
