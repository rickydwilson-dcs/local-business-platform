import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { cygnusRegistry } from "@platform/themes/cygnus";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,
  colors: {
    brand: {
      primary: "#f7941d",
      primaryHover: "#e8850a",
      secondary: "#5ba829",
      accent: "#dec498",
      onPrimary: "#2d1600",
    },
    surface: {
      background: "#131313",
      foreground: "#e5e2e1",
      card: "#1c1b1b",
      cardBorder: "#544435",
      muted: "#201f1f",
    },
  },
};
