import type { DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * Smith's Electrical Services - Theme Configuration
 *
 * Generated from project file: 550e8400-e29b-41d4-a716-446655440000
 * Generated at: 2026-02-03T13:53:41.050Z
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#2563eb',
      primaryHover: '#1f54c8',
      secondary: '#1e40af',
      accent: '#f59e0b',
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
