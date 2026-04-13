/**
 * Corvus Theme
 *
 * Dark-header, full-bleed hero style.
 * Generated from colorcode.events via the clone pipeline.
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const corvusRegistry: ComponentRegistry = {
  theme: "corvus",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "standard",
  sectionVariant: "dark-accent",
};

export const corvusDefaultConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,
  colors: {
    brand: {
      primary: "#292661",
      primaryHover: "#1e1b4b",
      secondary: "#F5D121",
      accent: "#e8175d",
    },
    surface: {
      background: "#ffffff",
      foreground: "#1f2937",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
      inverse: "#2d2a6e",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    overlay: {
      dark: "rgba(0, 0, 0, 0.8)",
      light: "rgba(255, 255, 255, 0.8)",
      primary: "rgba(41, 38, 97, 0.8)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      heading: ["Inter", "system-ui", "-apple-system", "sans-serif"],
    },
  },
};

registerTheme({
  name: "corvus",
  label: "Corvus",
  config: corvusDefaultConfig,
});
