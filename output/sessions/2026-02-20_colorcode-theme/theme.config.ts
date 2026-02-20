import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { vegaRegistry } from '@platform/themes/vega';

/**
 * Theme configuration for colorcode-events
 * Generated from extracted brand colors
 * Style: corporate
 * Confidence: 100%
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: vegaRegistry,

  colors: {
    brand: {
      primary: '#2A2A64',
      primaryHover: '#393989',
      secondary: '#0975BD',
      accent: '#E9C425',
    },
    surface: {
      background: '#FFFFFF',
      foreground: '#1A1A1A',
      muted: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: {
      sans: ['monospace', 'Arial', 'sans-serif'],
      heading: ['system-ui', 'Arial', 'sans-serif'],
    },
  },
};
