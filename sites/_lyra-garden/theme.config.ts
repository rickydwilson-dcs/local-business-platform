import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { lyraRegistry } from "@platform/themes/lyra";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: lyraRegistry,
  colors: {
    brand: {
      primary: "#163526",
      primaryHover: "#132f21",
      secondary: "#77574d",
      accent: "#f8bd2a",
      onPrimary: "#ffffff",
    },
    surface: {
      background: "#fbf9f5",
      foreground: "#1b1c1a",
      card: "#ffffff",
      cardBorder: "#c2c8c1",
      muted: "#f5f3ef",
    },
  },
};
