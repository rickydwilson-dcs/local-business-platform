import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { lyraRegistry } from "@platform/themes/lyra";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: lyraRegistry,
  colors: {
    brand: {
      primary: "#3b82f6", // placeholder — update per brand
      secondary: "#1d4ed8",
    },
  },
};
