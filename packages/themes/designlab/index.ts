/**
 * Designlab Theme
 *
 * Generated from reference analysis of https://www.designlab-eastbourne.co.uk/.
 * Analysis date: 2026-04-18T05:48:16.259Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const designlabRegistry: ComponentRegistry = {
  theme: "designlab",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};

export const designlabDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#ED9507",
      primaryHover: "#ED9507",
      secondary: "#2A2A2A",
      accent: "#ED9507",
    },
    surface: {
      background: "#121212",
      foreground: "#FFFFFF",
      muted: "#2A2A2A",
      card: "#2A2A2A",
      cardBorder: "#E5E7EB",
      secondaryForeground: "#D1D1D1",
      mutedForeground: "#FFFFFF",
      inverse: "#000000",
    },
  },
  typography: {
    fontFamily: {
      sans: ["century-gothic", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
    },
    scale: {
      hero: { size: "48px", lineHeight: "52.8px", letterSpacing: "-0.050em", weight: 700 },
      h1: { size: "48px", lineHeight: "52.8px", letterSpacing: "-0.050em", weight: 700 },
      h2: { size: "40px", lineHeight: "42px", letterSpacing: "normal", weight: 700 },
      h3: { size: "28px", lineHeight: "33.6px", letterSpacing: "normal", weight: 500 },
      h4: { size: "20px", lineHeight: "24px", letterSpacing: "normal", weight: 500 },
      body: { size: "16px", lineHeight: "25.6px", letterSpacing: "normal", weight: 400 },
    },
  },
};

registerTheme({ name: "designlab", label: "Designlab", config: designlabDefaultConfig });
