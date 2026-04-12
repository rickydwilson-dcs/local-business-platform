import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { corvusRegistry } from "@platform/themes/corvus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,
  colors: {
    brand: {
      primary: "#2d2a6e",
      primaryHover: "#1e1b4b",
      secondary: "#F5D121",
      accent: "#00b140",
    },
  },
};
