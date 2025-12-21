import type { DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * Base Template Theme Configuration
 *
 * Neutral default theme with professional blue palette.
 * Copy this file when creating a new site and customize colors, typography, and components.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#3b82f6', // Neutral professional blue
      primaryHover: '#2563eb', // Darker blue on hover
      secondary: '#1e40af', // Deep blue for secondary elements
      accent: '#f59e0b', // Amber accent for highlights
    },
    surface: {
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f3f4f6',
      mutedForeground: '#6b7280',
      card: '#ffffff',
      cardBorder: '#e5e7eb',
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
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    // Typography scale uses defaults from theme-system
  },

  components: {
    button: {
      borderRadius: '0.5rem',
      fontWeight: 600,
    },
    card: {
      borderRadius: '1rem',
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
