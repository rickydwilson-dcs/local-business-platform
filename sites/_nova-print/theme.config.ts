import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { novaRegistry } from "@platform/themes/nova";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: novaRegistry,
  colors: {
    brand: {
      primary: "#e85118",
      primaryHover: "#cc4715",
      secondary: "#5ba829",
      accent: "#1a1a1a",
      onPrimary: "#ffffff",
    },
    surface: {
      background: "#ffffff",
      foreground: "#1a1a1a",
      card: "#ffffff",
      cardBorder: "#d1d5db",
      muted: "#fafafa",
    },
  },
};
