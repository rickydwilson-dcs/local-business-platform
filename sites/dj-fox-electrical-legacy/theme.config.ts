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
      // Lighten muted text on dark sections: slate-300 (#cbd5e1) vs Orion default slate-400 (#94a3b8).
      // Contrast on surface.inverse (#1f2937): ~9.05:1 — passes WCAG AAA ✓
      inverseMutedForeground: '#cbd5e1',
    },
    overlay: {
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
      fontWeight: 600,
    },
    // NOTE: hero.variant conflict — this site sets 'centered' but the Orion component registry
    // declares heroVariant: 'image-overlay'. Needs human review to confirm which is authoritative
    // post-CSS-refactor to semantic tokens. Do not resolve without visual regression check.
    hero: {
      variant: 'centered',
    },
  },
};
