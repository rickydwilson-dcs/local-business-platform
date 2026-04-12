/**
 * Solaris Theme
 *
 * Soft blue-white background, sky blue primary, chartreuse accent, sage support.
 * Geometric hero with animated floating shapes. Bouncy ease-out entrances.
 * Designed for approachable, modern service businesses.
 *
 * Sites using Solaris: dcs (Digital Consulting Services)
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const solarisRegistry: ComponentRegistry = {
  theme: "solaris",
  heroVariant: "split-geometric",
  headerVariant: "light",
  cardVariant: "elevated",
  sectionVariant: "skewed",
};

export const solarisDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#61A3BA",
      primaryHover: "#4a8fa8",
      secondary: "#61A3BA",
      accent: "#D2DE32",
      onPrimary: "#ffffff",
    },
    surface: {
      background: "#F0F7FA",
      foreground: "#2a2e20",
      card: "#ffffff",
      cardBorder: "#d4e8f0",
      muted: "#e4f0f5",
      mutedForeground: "#3d4235",
    },
    semantic: {
      success: "#A2C579",
      info: "#61A3BA",
    },
    overlay: {
      dark: "rgba(42,46,32,0.7)",
      light: "rgba(240,247,250,0.85)",
      primary: "rgba(97,163,186,0.15)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      heading: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
    },
  },
};

registerTheme({ name: "solaris", label: "Solaris", config: solarisDefaultConfig });
