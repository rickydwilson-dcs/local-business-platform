import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { castorRegistry } from "@platform/themes/castor";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: castorRegistry,
  colors: {
    brand: {
      primary: "#1a3a6b",
      primaryHover: "#142d54",
      secondary: "#1a3a6b",
      accent: "#3a7d44",
      onPrimary: "#ffffff",
    },
    surface: {
      background: "#ffffff",
      foreground: "#1c1c1e",
      card: "#ffffff",
      cardBorder: "#e2e8f0",
      muted: "#f0f4f8",
    },
  },
};
