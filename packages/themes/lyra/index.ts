/**
 * Lyra Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-02-21T18:34:48.273Z
 */

import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const lyraDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#2d2a6e",
      primaryHover: "#1e1b4b",
      secondary: "#f5c800",
      accent: "#00b140",
    },
    surface: {
      background: "#2d2459",
      foreground: "#f5f5f5",
      muted: "#4a4580",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter","system-ui","sans-serif"],
      heading: ["Inter","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });
