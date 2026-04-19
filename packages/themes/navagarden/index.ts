/**
 * Navagarden Theme
 *
 * Generated from reference analysis of https://navagarden.hu/.
 * Analysis date: 2026-04-17T19:17:52.282Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const navagardenRegistry: ComponentRegistry = {
  theme: "navagarden",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};

export const navagardenDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#DBA746",
      primaryHover: "#DBA746",
      secondary: "#1E2F4B",
      accent: "#DBA746",
      onPrimary: "#1E2F4B",
    },
    surface: {
      background: "#F9FAFB",
      foreground: "#333333",
      muted: "#ECE3DC",
      card: "#FFFFFF",
      cardBorder: "#E5E7EB",
      secondaryForeground: "#1A1A1A",
      mutedForeground: "#595959",
      tertiaryForeground: "#595959",
      subtle: "#F3F4F6",
      subtleBorder: "#E5E7EB",
      inverse: "#000000",
      inverseMutedForeground: "#94A3B8",
    },
    semantic: { success: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" },
    overlay: {
      dark: "rgba(51,51,51,0.7)",
      light: "rgba(255,255,255,0.8)",
      primary: "rgba(219,167,70,0.8)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Work Sans", "system-ui", "sans-serif"],
      heading: ["Audrey", "system-ui", "sans-serif"],
    },
    scale: {
      hero: { size: "160px", lineHeight: "134px", letterSpacing: "normal", weight: 400 },
      h1: { size: "160px", lineHeight: "134px", letterSpacing: "normal", weight: 400 },
      h2: { size: "39.0625px", lineHeight: "46.875px", letterSpacing: "normal", weight: 500 },
      h3: { size: "31.25px", lineHeight: "37.5px", letterSpacing: "normal", weight: 500 },
      h4: { size: "25px", lineHeight: "30px", letterSpacing: "normal", weight: 500 },
      body: { size: "16px", lineHeight: "22.4px", letterSpacing: "normal", weight: 300 },
      small: { size: "14px", lineHeight: "20px", letterSpacing: "normal", weight: 300 },
      caption: { size: "12px", lineHeight: "16px", letterSpacing: "normal", weight: 300 },
    },
  },
};

registerTheme({ name: "navagarden", label: "Navagarden", config: navagardenDefaultConfig });
