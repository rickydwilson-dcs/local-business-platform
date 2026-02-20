/**
 * Vega Theme
 *
 * Light-header, split hero, card-grid style.
 * Designed for professional service businesses (e.g. scaffolding, construction).
 *
 * Sites using Vega: colossus-reference, base-template
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const vegaRegistry: ComponentRegistry = {
  theme: "vega",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};

export const vegaDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: '#2563eb', primaryHover: '#1d4ed8', secondary: '#1e3a5f', accent: '#06b6d4' },
    surface: {
      background: '#ffffff', foreground: '#111827', muted: '#f8fafc',
      mutedForeground: '#64748b', card: '#ffffff', cardBorder: '#e2e8f0',
    },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    overlay: { dark: 'rgba(0,0,0,0.7)', light: 'rgba(255,255,255,0.8)', primary: 'rgba(37,99,235,0.8)' },
  },
};

registerTheme({ name: 'vega', label: 'Vega', config: vegaDefaultConfig });
