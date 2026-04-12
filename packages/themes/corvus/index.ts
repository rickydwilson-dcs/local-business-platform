/**
 * Corvus Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-04-12T21:50:40.240Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const corvusRegistry: ComponentRegistry = {
  theme: "corvus",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};

export const corvusDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#292661",
      primaryHover: "#1e1b4b",
      secondary: "#F5D121",
      accent: "#e8175d",
    },
    surface: {
      background: "#292661",
      foreground: "#FFFFFF",
      muted: "#1e1b4b",
      mutedForeground: "#a5b4fc",
      card: "#1e1b4b",
      cardBorder: "#3730a3",
      inverse: "#ffffff",
      inverseMutedForeground: "#6b7280",
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
      primary: "rgba(41,38,97,0.85)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Aeonik", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
    },
    scale: {
      hero: { size: "4.5rem", weight: 900, lineHeight: "1", letterSpacing: "-0.02em" },
      h1: { size: "3rem", weight: 800, lineHeight: "1.1", letterSpacing: "-0.02em" },
      h2: { size: "2.25rem", weight: 700, lineHeight: "1.2", letterSpacing: "-0.01em" },
      h3: { size: "1.875rem", weight: 700, lineHeight: "1.3", letterSpacing: "-0.01em" },
      h4: { size: "1.5rem", weight: 600, lineHeight: "1.4", letterSpacing: "0em" },
      body: { size: "1rem", weight: 400, lineHeight: "1.6", letterSpacing: "0em" },
      small: { size: "0.875rem", weight: 400, lineHeight: "1.5", letterSpacing: "0em" },
      caption: { size: "0.75rem", weight: 400, lineHeight: "1.4", letterSpacing: "0.01em" },
    },
  },
};

registerTheme({ name: "corvus", label: "Corvus", config: corvusDefaultConfig });
