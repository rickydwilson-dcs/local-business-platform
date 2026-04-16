import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { corvusRegistry } from '@platform/themes/corvus';

/**
 * Corvus Theme Configuration — ColorCode Events
 *
 * Deep purple primary with blue secondary, dark surface palette.
 * Font: Aeonik (loaded via layout.tsx link tag).
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,

  colors: {
    brand: {
      primary: '#292661', // Deep purple (from computed styles)
      primaryHover: '#1e1c4d', // Darker purple on hover
      secondary: '#0F80C4', // Blue (hero sections, CTAs)
      accent: '#f5c518', // Yellow (CTA bands)
    },
    surface: {
      background: '#000000', // Black (most section backgrounds)
      foreground: '#ffffff', // White text on dark
      muted: '#1a1a2e', // Near-black muted
      mutedForeground: '#a0a0b0', // Light grey text
      card: '#111127', // Dark card surface
      cardBorder: '#292661', // Purple border on cards
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0F80C4',
    },
    overlay: {
      dark: 'rgba(0, 0, 0, 0.8)',
      light: 'rgba(255, 255, 255, 0.8)',
      primary: 'rgba(41, 38, 97, 0.8)', // Brand purple with opacity
    },
  },

  typography: {
    fontFamily: {
      sans: ['Aeonik', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Aeonik', 'system-ui', '-apple-system', 'sans-serif'],
    },
  },

  components: {
    button: {
      borderRadius: '9999px', // Pill-shaped buttons (from reference)
      fontWeight: 600,
    },
    card: {
      borderRadius: '0.5rem',
      shadow: 'sm',
    },
    hero: {
      variant: 'centered',
    },
    navigation: {
      style: 'solid',
    },
  },
};
