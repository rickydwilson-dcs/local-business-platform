import type { DeepPartialThemeConfig, ThemeConfig } from '@platform/theme-system';
import { generateCssVariables } from '@platform/theme-system/generate-css';
import { getRegisteredThemes } from '@platform/theme-system';
import { defaultTheme } from '@platform/theme-system/defaults';
import { deepMerge } from '@platform/theme-system/utils';

/**
 * URL param schema: brand_primary, brand_secondary, brand_accent, font_sans
 * No # in color values — use db0b0b not %23db0b0b
 */

export const FONT_SCALE_FACTORS: Record<string, number> = {
  compact: 0.875,
  comfortable: 1.125,
  large: 1.25,
};

export interface BrandOverrides {
  brand_primary?: string;
  brand_secondary?: string;
  brand_accent?: string;
  font_sans?: string;
  font_heading?: string;
  font_size?: string; // "compact" | "comfortable" | "large" (absent = default)
}

export function parseBrandOverrides(params: URLSearchParams): BrandOverrides {
  const overrides: BrandOverrides = {};
  const primary = params.get('brand_primary');
  const secondary = params.get('brand_secondary');
  const accent = params.get('brand_accent');
  const fontSans = params.get('font_sans');
  const fontHeading = params.get('font_heading');
  const fontSize = params.get('font_size');

  if (primary) overrides.brand_primary = primary;
  if (secondary) overrides.brand_secondary = secondary;
  if (accent) overrides.brand_accent = accent;
  if (fontSans) overrides.font_sans = fontSans;
  if (fontHeading) overrides.font_heading = fontHeading;
  if (fontSize) overrides.font_size = fontSize;

  return overrides;
}

export function hasOverrides(overrides: BrandOverrides): boolean {
  return Object.values(overrides).some(v => v !== undefined);
}

export function overridesToConfig(overrides: BrandOverrides): DeepPartialThemeConfig {
  const config: DeepPartialThemeConfig = {};

  if (overrides.brand_primary || overrides.brand_secondary || overrides.brand_accent) {
    config.colors = { brand: {} };
    if (overrides.brand_primary) {
      config.colors.brand!.primary = `#${overrides.brand_primary}`;
      config.colors.brand!.primaryHover = `#${overrides.brand_primary}`;
    }
    if (overrides.brand_secondary) {
      config.colors.brand!.secondary = `#${overrides.brand_secondary}`;
    }
    if (overrides.brand_accent) {
      config.colors.brand!.accent = `#${overrides.brand_accent}`;
    }
  }

  if (overrides.font_sans || overrides.font_heading) {
    config.typography = { fontFamily: {} };
    if (overrides.font_sans) {
      config.typography.fontFamily!.sans = [overrides.font_sans, 'system-ui', 'sans-serif'];
    }
    if (overrides.font_heading) {
      config.typography.fontFamily!.heading = [overrides.font_heading, 'system-ui', 'sans-serif'];
    }
  }

  if (overrides.font_size) {
    const factor = FONT_SCALE_FACTORS[overrides.font_size];
    if (factor) {
      const baseScale = defaultTheme.typography.scale;
      const scaled: DeepPartialThemeConfig['typography'] = { scale: {} };
      for (const [key, entry] of Object.entries(baseScale)) {
        const remVal = parseFloat(entry.size);
        const newSize = (remVal * factor).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
        scaled.scale![key as keyof typeof baseScale] = {
          ...entry,
          size: `${newSize}rem`,
        };
      }
      config.typography = { ...config.typography, ...scaled };
    }
  }

  return config;
}

export function buildCustomVars(overrides: BrandOverrides): Record<string, string> {
  // Exclude font_size from CSS vars — visual scaling is handled via CSS zoom
  // in the preview wrapper. overridesToConfig retains the scale logic for
  // future theme.config.ts export.
  const { font_size: _, ...cssOverrides } = overrides;
  const partialConfig = overridesToConfig(cssOverrides);
  const merged = deepMerge(
    defaultTheme as unknown as Record<string, unknown>,
    partialConfig as Record<string, unknown>
  ) as unknown as ThemeConfig;
  return generateCssVariables(merged);
}

export function buildCustomVarsFromBase(
  baseThemeName: string,
  overrides: DeepPartialThemeConfig
): Record<string, string> {
  const themes = getRegisteredThemes();
  const base = themes.find(t => t.name === baseThemeName)?.config ?? {};
  const merged = deepMerge(
    deepMerge(defaultTheme as unknown as Record<string, unknown>, base as Record<string, unknown>),
    overrides as Record<string, unknown>
  ) as unknown as ThemeConfig;
  return generateCssVariables(merged);
}

export function overridesToSearchParams(overrides: BrandOverrides): string {
  const params = new URLSearchParams();
  if (overrides.brand_primary) params.set('brand_primary', overrides.brand_primary);
  if (overrides.brand_secondary) params.set('brand_secondary', overrides.brand_secondary);
  if (overrides.brand_accent) params.set('brand_accent', overrides.brand_accent);
  if (overrides.font_sans) params.set('font_sans', overrides.font_sans);
  if (overrides.font_heading) params.set('font_heading', overrides.font_heading);
  if (overrides.font_size) params.set('font_size', overrides.font_size);
  return params.toString();
}
