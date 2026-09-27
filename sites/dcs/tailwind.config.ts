import type { Config } from 'tailwindcss';
import { createThemePlugin } from '@platform/theme-system/plugin';
import { themeConfig } from './theme.config';

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
    },
  },
  /**
   * `@tailwindcss/typography` is deliberately NOT loaded (removed 2026-09-27).
   *
   * It emits a `.prose` class — the same class name `styles/inner-pages.css`
   * §31 hand-authors for the r9 long-form body. Two design systems styling one
   * class name, with the plugin winning every property the kit leaves to its
   * own `*{margin:0;padding:0}` reset. It cost, across 67 pages: body copy in
   * Tailwind gray-700 (`#374151`) on an ink ground, `margin-bottom` on every
   * block, an 8.25px `li` margin against a grid that spaces with `gap`, a
   * doubled list indent on the legal pages (26px + the kit's 28px), and a 65ch
   * cap that shrank `/blog/[slug]` and the legal body inside their own 74ch
   * columns.
   *
   * Nothing on this site uses the plugin: no `prose-lg`, `prose-invert` or
   * `prose-*:` modifier utility appears in any `.tsx` or `.mdx` file here, and
   * DCS renders none of the shared `core-components` that do (`content-section`,
   * `text-section`, `content-page`). Those components are still scanned by the
   * `content` glob above, which is the only reason the classes were emitted at
   * all. Guarded by `test/tailwind-typography-absent.test.ts`.
   *
   * Every OTHER site in the monorepo keeps the plugin and genuinely uses it —
   * they are Tailwind-themed and have no hand-authored `.prose`. This removal
   * is DCS-specific.
   */
  plugins: [createThemePlugin(themeConfig)],
};

export default config;
