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
        brand: {
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
