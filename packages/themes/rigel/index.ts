/**
 * Rigel Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-03-29T19:54:17.236Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const rigelRegistry: ComponentRegistry = {
  theme: "rigel",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};

export const rigelDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#292661",
      primaryHover: "#292661",
      secondary: "#F5D121",
      accent: "#00b140",
    },
    surface: {
      background: "#292661",
      foreground: "#FFFFFF",
      muted: "#292661",
      inverse: "#292661",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Aeonik","system-ui","sans-serif"],
      heading: ["Inter","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "rigel", label: "Rigel", config: rigelDefaultConfig });
