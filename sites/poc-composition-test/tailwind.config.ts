import type { Config } from "tailwindcss";
import { createThemePlugin } from "@platform/theme-system/plugin";
import { themeConfig } from "./theme.config";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/component-composition/src/**/*.{js,ts,jsx,tsx}",
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
        surface: {
          background: "var(--color-surface-background)",
          foreground: "var(--color-surface-foreground)",
          muted: "var(--color-surface-muted)",
          "muted-foreground": "var(--color-surface-muted-foreground)",
          card: "var(--color-surface-card)",
          border: "var(--color-surface-card-border)",
          subtle: "var(--color-surface-muted)",
          inverse: "var(--color-surface-inverse)",
          "on-inverse": "var(--color-surface-background)",
        },
      },
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
