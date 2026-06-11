/**
 * Lyra Theme
 *
 * Generated from reference analysis of https://www.fountaindigital.co.uk/.
 * Analysis date: 2026-04-27T06:23:40.913Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const lyraRegistry: ComponentRegistry = {
  theme: "lyra",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};

export const lyraDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#025EFF",
      primaryHover: "#025EFF",
      secondary: "#100946",
      accent: "#06b6d4",
    },
    surface: {
      background: "#FFFFFF",
      foreground: "#000000",
      muted: "#FFFFFF",
      card: "#FFFFFF",
      cardBorder: "#e5e7eb",
      mutedForeground: "#6b7280",
      subtle: "#FFFFFF",
      inverse: "#000000",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    overlay: {
      dark: "rgba(0,0,0,0.8)",
      light: "rgba(255,255,255,0.8)",
      primary: "rgba(2,94,255,0.8)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
    },
    scale: {
      hero: { size: "4rem", lineHeight: "1.1", letterSpacing: "-0.02em", weight: 800 },
      h1: { size: "3rem", lineHeight: "1.15", letterSpacing: "-0.015em", weight: 700 },
      h2: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.01em", weight: 700 },
      h3: { size: "1.875rem", lineHeight: "1.25", letterSpacing: "-0.005em", weight: 600 },
      h4: { size: "1.5rem", lineHeight: "1.3", letterSpacing: "0", weight: 600 },
      body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0", weight: 400 },
      small: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0", weight: 400 },
      caption: { size: "0.75rem", lineHeight: "1.5", letterSpacing: "0.01em", weight: 400 },
    },
  },
};

registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });
