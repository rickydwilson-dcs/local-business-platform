import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * Lyra Theme Configuration — DCH Automotive test site
 *
 * Extracted from a Stitch design exploration (output/ingestion/lyra-stitch/).
 * Dark-first identity: near-black background, off-white text, a single
 * confident orange accent used sparingly. Not light-with-a-dark-section
 * like base-template's default — the background itself IS the dark tone.
 *
 * `surface.inverse` is deliberately the LIGHT end of the palette here (the
 * opposite of every other current site's theme.config.ts) since there's no
 * darker tone to contrast against a background that's already near-black.
 * See packages/themes/lyra/globals.css for the `.section-dark-accent` note.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#F2730D',
      primaryHover: '#D9640A',
      secondary: '#1C1B19',
      accent: '#FF8B3D',
      onPrimary: '#FFFFFF', // matches the Stitch-generated screens (white text on orange, not black)
      light: '#FF8B3D',
      dark: '#0C0B09',
    },
    surface: {
      background: '#0C0B09',
      foreground: '#F5F5F5',
      secondaryForeground: '#C9C4BA',
      tertiaryForeground: '#8B857A',
      muted: '#1C1B19',
      mutedForeground: '#A8A29C',
      card: '#1C1B19',
      cardBorder: 'rgba(255,255,255,0.1)',
      subtle: '#141311',
      subtleBorder: 'rgba(255,255,255,0.06)',
      inverse: '#F5F5F5',
      inverseMutedForeground: '#55524C',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: 'rgba(12,11,9,0.8)',
      light: 'rgba(245,245,245,0.8)',
      primary: 'rgba(242,115,13,0.8)',
    },
  },

  typography: {
    fontFamily: {
      sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Public Sans', 'system-ui', '-apple-system', 'sans-serif'],
    },
  },

  components: {
    button: {
      borderRadius: '0.125rem', // Stitch's ROUND_FOUR request resolved to this sharp radius
      fontWeight: 800,
    },
    card: {
      borderRadius: '0.25rem',
      shadow: 'sm',
    },
    hero: {
      variant: 'full-bleed',
    },
    navigation: {
      style: 'solid',
    },
  },
};

export const registry: ComponentRegistry = {
  theme: 'lyra',
  heroVariant: 'image-overlay',
  headerVariant: 'dark',
  cardVariant: 'standard',
  sectionVariant: 'standard',
};
