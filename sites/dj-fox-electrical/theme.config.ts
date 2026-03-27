import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { orionRegistry } from '@platform/themes/orion';

/**
 * D J Fox Electrical - Theme Configuration
 *
 * Generated from project file: 550e8400-e29b-41d4-a716-446655440015
 * Generated at: 2026-02-15T19:18:53.726Z
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: orionRegistry,

  colors: {
    brand: {
      // Contrast ratio vs white (#fff): ~4.58:1 — passes WCAG AA (4.5:1) but not AAA (7:1).
      // If a darker variant is needed for small text on white, use primaryHover (#ba0909, ~5.73:1).
      primary: '#db0b0b',
      primaryHover: '#ba0909',
      secondary: '#b00909',
      accent: '#fbbf24',
    },
    surface: {
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f3f4f6',
      mutedForeground: '#5b6370',
      card: '#ffffff',
      cardBorder: '#e5e7eb',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: 'rgba(0, 0, 0, 0.8)',
      light: 'rgba(255, 255, 255, 0.8)',
      primary: 'rgba(219, 11, 11, 0.8)', // Brand red with opacity
    },
  },

  typography: {
    fontFamily: {
      sans: ['var(--font-outfit)', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['var(--font-outfit)', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
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
