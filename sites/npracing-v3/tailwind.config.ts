import type { Config } from 'tailwindcss';
import { createThemePlugin } from '@platform/theme-system/plugin';
import { themeConfig } from './theme.config';
import typography from '@tailwindcss/typography';

/**
 * Tailwind Configuration with Theme System Integration
 *
 * This configuration uses the @platform/theme-system plugin to apply
 * the theme from theme.config.ts as CSS variables and Tailwind utilities.
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    '../../packages/core-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors mapped to theme system CSS variables
        brand: {
          primary: 'var(--color-brand-primary)',
          'primary-hover': 'var(--color-brand-primary-hover)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-brand-accent)',
        },
        surface: {
          background: 'var(--color-surface-background)',
          foreground: 'var(--color-surface-foreground)',
          muted: 'var(--color-surface-muted)',
          'muted-foreground': 'var(--color-surface-muted-foreground)',
          card: 'var(--color-surface-card)',
          border: 'var(--color-surface-card-border)',
          subtle: 'var(--color-surface-muted)',
          inverse: 'var(--color-surface-inverse)',
          'on-inverse': 'var(--color-surface-background)',
        },
      },
      keyframes: {
        // Infinite ticker ribbon — the track holds two identical copies of the
        // content, so translating by -50% loops seamlessly.
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
