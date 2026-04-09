/**
 * Polaris Theme
 *
 * Tactical Telemetry (Dark) — Industrial Brutalist
 * Built for Digital Consulting Services (digitalconsultingservices.co.uk)
 * Design spec: output/sessions/2026-04-08_dcs-redesign/DESIGN.md
 *
 * Sites using Polaris: dcs
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const polarisRegistry: ComponentRegistry = {
  theme: "polaris",
  heroVariant: "minimal",
  headerVariant: "dark",
  cardVariant: "standard",
  sectionVariant: "dark-accent",
};

export const polarisDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#FF2A2A", // Aviation Red — the ONLY accent
      primaryHover: "#CC2222",
      secondary: "#EAEAEA", // White phosphor doubles as secondary
      accent: "#FF2A2A",
      onPrimary: "#FFFFFF",
    },
    surface: {
      background: "#0A0A0A", // CRT black
      foreground: "#EAEAEA", // White phosphor
      card: "#111111",
      cardBorder: "#2A2A2A",
      muted: "#161616",
      mutedForeground: "#777777",
    },
    semantic: {
      success: "#4AF626", // Terminal green — status indicators only
      warning: "#FF2A2A",
      error: "#FF2A2A",
      info: "#EAEAEA",
    },
    overlay: {
      dark: "rgba(10, 10, 10, 0.9)",
      light: "rgba(234, 234, 234, 0.05)",
      primary: "rgba(255, 42, 42, 0.15)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
      heading: ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
    },
  },
  components: {
    button: { borderRadius: "0" },
    card: { borderRadius: "0", shadow: "none" },
    hero: { variant: "centered" },
    navigation: { style: "solid" },
  },
};

registerTheme({ name: "polaris", label: "Polaris", config: polarisDefaultConfig });
