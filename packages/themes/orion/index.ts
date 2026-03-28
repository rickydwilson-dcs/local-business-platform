/**
 * Orion Theme
 *
 * Dark-header, full-bleed hero, circular icon style.
 * Designed for industrial/trade service businesses (e.g. electrical contractors).
 *
 * Sites using Orion: dj-fox-electrical
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const orionRegistry: ComponentRegistry = {
  theme: "orion",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};

export const orionDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: '#dc2626', primaryHover: '#b91c1c', secondary: '#1f2937', accent: '#f97316' },
    surface: {
      background: '#ffffff', foreground: '#1f2937', muted: '#f3f4f6',
      mutedForeground: '#5b6370', card: '#ffffff', cardBorder: '#e5e7eb',
      inverse: '#000000',
    },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    overlay: { dark: 'rgba(0,0,0,0.8)', light: 'rgba(255,255,255,0.8)', primary: 'rgba(220,38,38,0.8)' },
  },
};

registerTheme({ name: 'orion', label: 'Orion', config: orionDefaultConfig });
