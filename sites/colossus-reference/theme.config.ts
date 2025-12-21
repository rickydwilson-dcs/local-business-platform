import type { DeepPartialThemeConfig } from "@platform/theme-system";

/**
 * Colossus Scaffolding Theme Configuration
 *
 * Brand colors mapped from the original Tailwind config.
 * Uses the theme system for consistent CSS variable generation.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#005A9E", // Colossus brand blue
      primaryHover: "#004d87", // Darker blue on hover
      secondary: "#0066b5", // Light blue variant
      accent: "#f59e0b", // Amber accent for highlights
    },
    surface: {
      background: "#ffffff",
      foreground: "#1f2937",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#005A9E", // Use brand blue for info
    },
  },

  typography: {
    fontFamily: {
      sans: ["GeistSans", "Arial", "Helvetica", "sans-serif"],
      heading: ["GeistSans", "Arial", "Helvetica", "sans-serif"],
    },
  },

  components: {
    button: {
      borderRadius: "0.5rem",
      fontWeight: 600,
    },
    card: {
      borderRadius: "1rem",
      shadow: "lg",
    },
    hero: {
      variant: "centered",
    },
    navigation: {
      style: "solid",
    },
  },
};
