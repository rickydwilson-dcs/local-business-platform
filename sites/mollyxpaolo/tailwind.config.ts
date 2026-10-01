import type { Config } from 'tailwindcss';

/**
 * This site switches its whole palette and type at runtime (colour / sepia / B&W), so the tokens
 * are CSS custom properties under html[data-tone] in app/globals.css rather than a
 * theme.config.ts, whose plugin emits a single :root palette. The utilities below resolve to
 * those same variables for any one-off use in components.
 *
 * Preflight is off: globals.css carries the prototype's own reset, and Tailwind's would
 * override details the approved design depends on.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        line: 'var(--line)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        head: 'var(--font-head)',
        body: 'var(--font-body)',
        meta: 'var(--font-meta)',
      },
    },
  },
  plugins: [],
};

export default config;
