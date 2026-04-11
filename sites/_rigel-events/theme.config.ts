import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { rigelRegistry } from "@platform/themes/rigel";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: rigelRegistry,
  colors: {
    brand: {
      primary: "#3b82f6", // placeholder — update per brand
      secondary: "#1d4ed8",
    },
  },
};
