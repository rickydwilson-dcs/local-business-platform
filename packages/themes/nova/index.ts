/**
 * Nova Theme
 *
 * Generated from reference analysis of https://colorcode.events/.
 * Analysis date: 2026-02-20T12:32:12Z
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const novaRegistry: ComponentRegistry = {
  theme: "nova",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "standard",
  sectionVariant: "banded",
};

export const novaDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#2A2A64",
      primaryHover: "#1A1A4E",
      secondary: "#F5C800",
      accent: "#3B9E3B",
    },
    surface: {
      background: "#2A2A64",
      foreground: "#FFFFFF",
      muted: "#1A1A4E",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter","system-ui","sans-serif"],
      heading: ["Inter","system-ui","sans-serif"],
    },
  },
};

registerTheme({ name: "nova", label: "Nova", config: novaDefaultConfig });
