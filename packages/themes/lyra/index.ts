/**
 * Lyra Theme
 *
 * Generated from reference analysis of https://www.fountaindigital.co.uk/.
 * Analysis date: 2026-04-25T05:33:40.645Z
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
      primary: "#0041B3",
      primaryHover: "#0041B3",
      secondary: "#6c3fc5",
      accent: "#00bcd4",
    },
    surface: {
      background: "#FFFFFF",
      foreground: "#000000",
      muted: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
    },
  },
};

registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });
