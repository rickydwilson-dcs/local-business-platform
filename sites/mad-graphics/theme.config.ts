import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { cygnusRegistry } from '@platform/themes/cygnus';

/**
 * Mad Graphics - Theme Configuration
 *
 * Generated from project file: f3e1d2c0-1234-4ab5-9876-543210fedcba
 * Generated at: 2026-04-06T18:45:40.149Z
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,

  colors: {
    brand: {
      primary: '#F47B20',
      primaryHover: '#cf691b',
      secondary: '#7AC143',
      accent: '#dec498',
    },
    surface: {
      background: '#131313',
      foreground: '#e5e2e1',
      muted: '#1c1b1b',
      mutedForeground: '#9a9490',
      card: '#1c1b1b',
      cardBorder: '#2e2b2b',
      subtle: '#1c1b1b',
      subtleBorder: '#2e2b2b',
      secondaryForeground: '#b5b0ae',
      inverse: '#131313',
      inverseMutedForeground: '#9a9490',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Newsreader', 'system-ui', '-apple-system', 'sans-serif'],
    },
    // Typography scale uses defaults from theme-system
  },

  components: {
    button: {
      borderRadius: '0.375rem',
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
