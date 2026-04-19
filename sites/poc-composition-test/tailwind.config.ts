import type { Config } from "tailwindcss";
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
          "on-primary": "var(--color-brand-on-primary)",
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
          "inverse-foreground": "var(--color-surface-inverse-foreground)",
          "on-inverse": "var(--color-surface-background)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
    },
  },
  plugins: [typography],
};

export default config;
