import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

export const registry: ComponentRegistry = {
  theme: 'solaris',
  heroVariant: 'split-geometric',
  headerVariant: 'light',
  cardVariant: 'elevated',
  sectionVariant: 'skewed',
};

export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    // r9 rebrand — brand/surface/semantic/overlay derived from the r9 palette
    // in colors.custom below. primary=magenta (CTA/link accent), accent=aqua
    // (secondary highlight), secondary=navy (supporting brand tone) are a
    // judgment call: the r9 palette doesn't dictate this mapping on its own,
    // it just supplies the five hues (magenta/aqua/navy/ink/paper) and this
    // is the most natural fit to the existing key names. success/warning/error
    // are NOT in the r9 palette (no red/green in the 7 r9 colors) so success
    // keeps an independent, WCAG-checked green rather than being force-fit
    // into a brand hue.
    brand: {
      primary: '#D6006B', // r9 magenta
      primaryHover: '#AB0056', // magenta, ~20% darker
      secondary: '#17265E', // r9 navy
      accent: '#00D2D8', // r9 aqua
      onPrimary: '#ffffff', // r9 white
    },
    surface: {
      background: '#ECEBE9', // r9 paper
      foreground: '#0E0E12', // r9 ink
      card: '#ffffff', // r9 white
      cardBorder: '#D9D8D5', // paper, darkened ~5% for a visible-but-subtle edge
      muted: '#E2E1DE', // paper, darkened ~8% for muted surface fills
      mutedForeground: '#63636C', // r9 grey (#70707B), darkened ~12% to clear WCAG AA 4.5:1 on paper/muted
    },
    semantic: {
      success: '#2E9E5B', // not in r9 palette (no green) — independent, WCAG AA-checked
      info: '#00D2D8', // r9 aqua
    },
    overlay: {
      dark: 'rgba(14,14,18,0.7)', // r9 ink @ 70%
      light: 'rgba(236,235,233,0.85)', // r9 paper @ 85%
      primary: 'rgba(214,0,107,0.15)', // r9 magenta @ 15%
    },
    // r9 homepage palette — emitted as --color-{key} custom properties
    // (e.g. --color-ink, --color-magenta) for the ported r9 stylesheet
    // (Phase 3) to reference instead of hardcoded hex.
    custom: {
      ink: '#0E0E12',
      paper: '#ECEBE9',
      white: '#ffffff',
      magenta: '#D6006B',
      aqua: '#00D2D8',
      navy: '#17265E',
      grey: '#70707B',
    },
  },
  typography: {
    // r9 fonts, matching the roles already established in home-r9.css:
    // --f (body/sans) = Archivo, --f-logo (display/wordmark) = Poppins.
    fontFamily: {
      sans: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
      heading: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
    },
  },
};
