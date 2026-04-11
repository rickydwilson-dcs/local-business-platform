import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { rigelRegistry } from "@platform/themes/rigel";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: rigelRegistry,
  colors: {
    brand: {
      primary: "#292661",
      primaryHover: "#1e1b4b",
      secondary: "#F5D121",
    },
  },
};
