import type { Config } from "tailwindcss";
import { createThemePlugin } from "@platform/theme-system/plugin";
import { themeConfig } from "./theme.config";
import typography from "@tailwindcss/typography";

/**
 * Tailwind Configuration with Theme System Integration
 *
 * Uses @platform/theme-system plugin for CSS variable-based theming.
 * Brand colors defined in theme.config.ts are mapped to:
 * - bg-brand-primary, text-brand-primary, etc. (theme tokens)
 * - Legacy support: bg-brand-blue maps to brand-primary for backward compatibility
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy color aliases for backward compatibility
        // These map to the theme system's CSS variables
        brand: {
          blue: "var(--color-brand-primary)",
          "blue-hover": "var(--color-brand-primary-hover)",
          "blue-light": "var(--color-brand-secondary)",
          primary: "var(--color-brand-primary)",
          "primary-hover": "var(--color-brand-primary-hover)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
        },
      },
      fontFamily: {
        sans: ["GeistSans", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
