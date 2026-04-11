import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { castorRegistry } from "@platform/themes/castor";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: castorRegistry,
  colors: {
    brand: {
      primary: "#3b82f6", // placeholder — update per brand
      secondary: "#1d4ed8",
    },
  },
};
