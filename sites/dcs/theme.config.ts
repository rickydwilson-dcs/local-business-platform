import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";

export const registry: ComponentRegistry = {
  theme: "solaris",
  heroVariant: "split-geometric",
  headerVariant: "light",
  cardVariant: "elevated",
  sectionVariant: "skewed",
};

export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#61A3BA",
      primaryHover: "#4a8fa8",
      secondary: "#61A3BA",
      accent: "#D2DE32",
      onPrimary: "#ffffff",
    },
    surface: {
      background: "#F0F7FA",
      foreground: "#2a2e20",
      card: "#ffffff",
      cardBorder: "#d4e8f0",
      muted: "#e4f0f5",
      mutedForeground: "#3d4235",
    },
    semantic: {
      success: "#A2C579",
      info: "#61A3BA",
    },
    overlay: {
      dark: "rgba(42,46,32,0.7)",
      light: "rgba(240,247,250,0.85)",
      primary: "rgba(97,163,186,0.15)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      heading: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
    },
  },
};
