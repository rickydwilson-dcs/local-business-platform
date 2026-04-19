import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { navagardenRegistry } from '@platform/themes/navagarden';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: navagardenRegistry,

  colors: {
    brand: {
      primary: '#DBA746',
      primaryHover: '#DBA746',
      secondary: '#1E2F4B',
      accent: '#DBA746',
      onPrimary: '#1E2F4B',
    },
    surface: {
      background: '#F9FAFB',
      foreground: '#333333',
      muted: '#ECE3DC',
      mutedForeground: '#595959',
      card: '#FFFFFF',
      cardBorder: '#E5E7EB',
      inverse: '#000000',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: 'rgba(51,51,51,0.7)',
      light: 'rgba(255,255,255,0.8)',
      primary: 'rgba(219,167,70,0.8)',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Work Sans', 'system-ui', 'sans-serif'],
      heading: ['Audrey', 'Georgia', 'serif'],
    },
  },
};
