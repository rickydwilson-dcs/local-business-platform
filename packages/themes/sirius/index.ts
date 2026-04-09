/**
 * Sirius Theme
 *
 * Premium Tech Agency (Light) — editorial breathing room, fluid motion
 * Built for Digital Consulting Services (digitalconsultingservices.co.uk)
 * Design spec: output/sessions/2026-04-08_dcs-redesign/yolo-brief-design-taste.md
 *
 * Sites using Sirius: dcs-design-taste
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const siriusRegistry: ComponentRegistry = {
  theme: "sirius",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};

export const siriusDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#2563EB", // Electric blue — single saturated accent
      primaryHover: "#1D4ED8",
      secondary: "#0D9488", // Teal secondary
      accent: "#2563EB",
      onPrimary: "#FFFFFF",
    },
    surface: {
      background: "#FAFAFA", // Off-white — NOT pure white
      foreground: "#0D0D0D", // Off-black — NOT pure black
      card: "#FFFFFF",
      cardBorder: "#E4E4E7", // zinc-200
      muted: "#F4F4F5", // zinc-100
      mutedForeground: "#71717A", // zinc-500
      subtle: "#F4F4F5",
      subtleBorder: "#E4E4E7",
      inverse: "#0D0D0D",
      inverseMutedForeground: "#A1A1AA", // zinc-400
      secondaryForeground: "#3F3F46", // zinc-700
      tertiaryForeground: "#71717A", // zinc-500
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#2563EB",
    },
    overlay: {
      dark: "rgba(13, 13, 13, 0.9)",
      light: "rgba(250, 250, 250, 0.05)",
      primary: "rgba(37, 99, 235, 0.12)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Geist", "system-ui", "-apple-system", "sans-serif"],
      heading: ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
      mono: ["Geist Mono", "monospace"],
    },
  },
  components: {
    button: {
      borderRadius: "9999px", // pill buttons
      fontWeight: 600,
    },
    card: {
      borderRadius: "1rem",
      shadow: "sm",
    },
    hero: {
      variant: "split",
      minHeight: "100dvh",
    },
    navigation: {
      style: "blur",
      appearance: "light",
    },
  },
};

registerTheme({ name: "sirius", label: "Sirius", config: siriusDefaultConfig });
