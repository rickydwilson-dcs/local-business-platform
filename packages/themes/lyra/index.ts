/**
 * Lyra Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-02-21T08:23:13.752Z
 */

import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const lyraDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#000000",
      primaryHover: "#000000",
      secondary: "#6B7280",
      accent: "#000000",
    },
    surface: {
      background: "#EEEEEE",
      foreground: "#FFFFFF",
      muted: "#F3F4F6",
    },
  },
  typography: {
    fontFamily: {
      sans: ["monospace","system-ui","sans-serif"],
      heading: ["system-ui","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });
