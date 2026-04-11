import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { cygnusRegistry } from "@platform/themes/cygnus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,
  colors: {
    brand: {
      primary: "#3b82f6", // placeholder — update per brand
      secondary: "#1d4ed8",
    },
  },
};
