import type { DeepPartialThemeConfig } from "@platform/theme-system";

export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#DBA746",
      primaryHover: "#DBA746",
      secondary: "#1E2F4B",
      accent: "#DBA746",
      onPrimary: "#1E2F4B",
    },
    surface: {
      background: "#F9FAFB",
      foreground: "#333333",
      secondaryForeground: "#1A1A1A",
      tertiaryForeground: "#333333",
      muted: "#ECE3DC",
      mutedForeground: "#595959",
      card: "#FFFFFF",
      cardBorder: "#E5E7EB",
      inverse: "#000000",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    overlay: {
      dark: "rgba(51,51,51,0.7)",
      light: "rgba(255,255,255,0.8)",
      primary: "rgba(219,167,70,0.8)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Work Sans", "system-ui", "sans-serif"],
      heading: ["Audrey", "system-ui", "sans-serif"],
    },
    scale: {
      hero: {
        size: "160px",
        lineHeight: "134px",
        letterSpacing: "normal",
        weight: 400,
      },
      h1: {
        size: "160px",
        lineHeight: "134px",
        letterSpacing: "normal",
        weight: 400,
      },
      h2: {
        size: "39.0625px",
        lineHeight: "46.875px",
        letterSpacing: "normal",
        weight: 500,
      },
      h3: {
        size: "31.25px",
        lineHeight: "37.5px",
        letterSpacing: "normal",
        weight: 500,
      },
      h4: {
        size: "25px",
        lineHeight: "30px",
        letterSpacing: "normal",
        weight: 500,
      },
      body: {
        size: "16px",
        lineHeight: "22.4px",
        letterSpacing: "normal",
        weight: 300,
      },
    },
    headingStyle: "serif",
    headingWeight: "bold",
    bodyWeight: "normal",
    usesInlineColorHighlights: false,
  },
  components: {
    button: {
      borderRadius: "rounded",
      fontWeight: 500,
      fontFamily: "var(--font-sans)",
      background: "var(--color-brand-primary)",
      color: "var(--color-brand-on-primary)",
      hoverBackground: "var(--color-brand-primary-hover)",
      paddingX: "1.5rem",
      paddingY: "0.75rem",
    },
    card: {
      borderRadius: "rounded-xl",
      background: "var(--color-surface-card)",
      borderColor: "var(--color-surface-card-border)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    navigation: {
      background: "var(--color-surface-card)",
      height: "var(--navigation-height)",
      linkColor: "var(--color-surface-foreground)",
      ctaBackground: "var(--color-brand-primary)",
      ctaColor: "var(--color-brand-on-primary)",
    },
    footer: {
      background: "var(--color-brand-secondary)",
      color: "var(--color-surface-card)",
      mutedColor: "var(--color-surface-muted)",
    },
  },
} as DeepPartialThemeConfig;
