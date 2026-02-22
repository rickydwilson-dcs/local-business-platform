/**
 * Atlas Theme
 *
 * Generated from reference analysis of https://themes.boldway.agency/deep/bold/.
 * Analysis date: 2026-02-22T07:25:52.892Z
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const atlasRegistry: ComponentRegistry = {
  theme: "atlas",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};

export const atlasDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#3b6fba",
      primaryHover: "#0047AB",
      secondary: "#5a8fd4",
      accent: "#0047AB",
    },
    surface: {
      background: "#e8e8e8",
      foreground: "#555555",
      muted: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter","system-ui","sans-serif"],
      heading: ["Lato","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "atlas", label: "Atlas", config: atlasDefaultConfig });
