/**
 * Atlas Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-03-29T19:02:15.647Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const atlasRegistry: ComponentRegistry = {
  theme: "atlas",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};

export const atlasDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#292661",
      primaryHover: "#292661",
      secondary: "#1a73e8",
      accent: "#F5D121",
    },
    surface: {
      background: "#292661",
      foreground: "#FFFFFF",
      muted: "#292661",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Aeonik","system-ui","sans-serif"],
      heading: ["Inter","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "atlas", label: "Atlas", config: atlasDefaultConfig });
