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
        // Site-local: the prototype's neutral "house ink" (#D8CBAE) used for eyebrow
        // labels, CTA text, and nav-underline colour on every page except an individual
        // build/car detail page — see theme.config.ts's colors.custom.accentInkNeutral
        // comment for the full verification note. Backed by the CSS var the shared
        // theme-system plugin already emits for any `colors.custom` entry
        // (--color-accent-ink-neutral) — no shared ThemeConfig type change needed.
        // Gives `text-ink-neutral`, `bg-ink-neutral`, `border-ink-neutral`, etc.
        ink: {
          neutral: 'var(--color-accent-ink-neutral)',
        },
      },
      fontFamily: {
        // Site-local: the prototype's Newsreader prose/lede paragraph face. Not part of
        // the shared ThemeConfig fontFamily schema (sans/heading/mono only) — see
        // theme.config.ts's file header comment. Apply `font-prose` explicitly to
        // prose/lede paragraph copy; plain text otherwise inherits `font-sans` (Archivo)
        // via Tailwind Preflight. Backed by `--font-newsreader`, set by next/font/google
        // in app/layout.tsx.
        prose: ['var(--font-newsreader)', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
