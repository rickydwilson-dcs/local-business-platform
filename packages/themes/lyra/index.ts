/**
 * Lyra Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-02-22T07:23:38.432Z
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
      primary: "#292661",
      primaryHover: "#292661",
      secondary: "#F5D121",
      accent: "#e8185a",
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

registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });
