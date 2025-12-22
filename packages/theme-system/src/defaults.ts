/**
 * Default Theme Configuration
 * Sensible defaults for all design tokens
 */

import type { ThemeConfig } from "./types";

export const defaultTheme: ThemeConfig = {
  colors: {
    brand: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      secondary: "#1e40af",
      accent: "#f59e0b",
    },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  },
  radii: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },
  transitions: {
    fast: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
    timing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
  opacity: {
    disabled: 0.5,
    muted: 0.7,
    overlay: 0.8,
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    scale: {
      hero: { size: "3.75rem", lineHeight: "1.1", letterSpacing: "-0.02em", weight: 700 },
      h1: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.01em", weight: 700 },
      h2: { size: "1.875rem", lineHeight: "1.3", letterSpacing: "-0.01em", weight: 600 },
      h3: { size: "1.5rem", lineHeight: "1.4", letterSpacing: "0", weight: 600 },
      h4: { size: "1.25rem", lineHeight: "1.4", letterSpacing: "0", weight: 600 },
      body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0", weight: 400 },
      small: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0", weight: 400 },
      caption: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.01em", weight: 400 },
    },
  },
  fonts: {
    preload: [],
  },
  components: {
    button: {
      borderRadius: "0.5rem",
      paddingX: "1.5rem",
      paddingY: "0.75rem",
    },
    card: {
      borderRadius: "1rem",
      shadow: "sm",
      padding: "1.5rem",
    },
    hero: {
      variant: "centered",
      minHeight: "80vh",
    },
    navigation: {
      style: "solid",
      height: "4rem",
    },
    section: {
      paddingY: "5rem",
      paddingYCompact: "3rem",
    },
  },
};
