import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { novaRegistry } from "@platform/themes/nova";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: novaRegistry,
  colors: {
    brand: {
      primary: "#3b82f6", // placeholder — update per brand
      secondary: "#1d4ed8",
    },
  },
};
