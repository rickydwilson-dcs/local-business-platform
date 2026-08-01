import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * NPRacing v3 — "Number 51" Theme Configuration
 *
 * Self-contained site theme: no runtime import from any shared theme
 * package under packages/themes.
 * Token values are ported from the finalised design prototype at
 * `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/tokens.css`,
 * which the handoff names as the source of truth for the palette/typography
 * (the prototype HTML itself is throwaway and was NOT carried over).
 *
 * Identity: near-black page, off-white ink, one loud racing red. Squared-off
 * edges (the "Number 51" direction overrides the shared pill/rounded styling
 * to hard 0-radius rectangles), Bebas Neue for display type, Barlow for body.
 *
 * `surface.inverse` is deliberately the LIGHT end of the palette (as in
 * dch-automotive/lyra) — there is no darker tone to contrast against a
 * background that is already near-black.
 *
 * Deliberate duplication with npracing-v1: both sites are one brand and share
 * the palette/type foundation; they differ only in composition. Divergence
 * between the two files would be drift, not customisation.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#E11024', // --red
      primaryHover: '#FF1B34', // --red-bright (prototype .btn-primary:hover)
      secondary: '#A80D1C', // --red-deep
      accent: '#FF1B34', // --red-bright
      onPrimary: '#FFFFFF',
      light: '#FF1B34',
      dark: '#3D0A10', // --red-dim
    },
    surface: {
      background: '#0A0A0A', // --black
      foreground: '#F3F2EE', // --ink / --off-white
      secondaryForeground: 'rgba(243,242,238,0.66)', // --ink-soft
      tertiaryForeground: 'rgba(243,242,238,0.4)', // --ink-faint
      muted: '#141414', // --black-2
      mutedForeground: 'rgba(243,242,238,0.66)', // --ink-soft
      card: '#111111', // --card
      cardBorder: 'rgba(243,242,238,0.14)', // --line
      subtle: '#1B1B1B', // --black-3
      subtleBorder: 'rgba(243,242,238,0.08)', // --line-2
      inverse: '#F3F2EE', // light end — see file header
      inverseMutedForeground: '#4A4A48',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    overlay: {
      dark: 'rgba(10,10,10,0.8)',
      light: 'rgba(243,242,238,0.8)',
      primary: 'rgba(225,16,36,0.8)',
    },
  },

  typography: {
    fontFamily: {
      // Barlow for body copy, Bebas Neue for all display/heading type.
      //
      // tokens.css also defines Barlow Condensed (`--font-display`), but the
      // "Number 51" direction overrides every h1-h4 to Bebas Neue
      // (`--font-mega`) and uses Barlow for the remaining sub-headings — so
      // Barlow Condensed is not loaded here rather than shipping an unused
      // webfont. See design-03-number51.html's `h1,h2,h3,h4` rule.
      sans: ['Barlow', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Bebas Neue', 'Barlow Condensed', 'system-ui', 'sans-serif'],
    },
    scale: {
      // Bebas Neue ships a single weight (400) and is drawn tall/narrow, so the
      // display sizes run large with very tight leading — matching the poster
      // proportions in the prototype rather than the platform defaults.
      hero: {
        size: 'clamp(2.6rem, 6vw, 4.6rem)',
        lineHeight: '0.88',
        letterSpacing: '0.01em',
        weight: 400,
      },
      h1: {
        size: 'clamp(2.4rem, 5.4vw, 4.2rem)',
        lineHeight: '0.9',
        letterSpacing: '0.01em',
        weight: 400,
      },
      h2: {
        size: 'clamp(2rem, 4.6vw, 3.4rem)',
        lineHeight: '0.94',
        letterSpacing: '0.01em',
        weight: 400,
      },
      h3: { size: '1.6rem', lineHeight: '1.05', letterSpacing: '0.01em', weight: 400 },
      h4: { size: '1.2rem', lineHeight: '1.1', letterSpacing: '0.02em', weight: 400 },
      body: { size: '1rem', lineHeight: '1.6', letterSpacing: '0', weight: 400 },
      small: { size: '0.9rem', lineHeight: '1.55', letterSpacing: '0', weight: 400 },
      caption: { size: '0.72rem', lineHeight: '1.4', letterSpacing: '0.12em', weight: 700 },
    },
  },

  components: {
    button: {
      // Hard rectangles — the "Number 51" direction squares off the shared
      // pill buttons (`.btn{border-radius:0}` in design-03-number51.html).
      borderRadius: '0rem',
      fontWeight: 700,
    },
    card: {
      borderRadius: '0rem',
      shadow: 'none',
    },
    hero: {
      variant: 'full-bleed',
      minHeight: '100svh',
    },
    navigation: {
      style: 'solid',
      appearance: 'dark',
      height: '5rem',
    },
    section: {
      paddingY: '6rem',
      paddingYCompact: '3.5rem',
    },
  },
};

/**
 * Component registry — metadata only (nothing selects components from this at
 * runtime; this site imports its own components directly).
 *
 * `theme` is widened from `ThemeName` to `string` locally because this site is
 * self-contained: it does not consume any `packages/themes/*` package, so none
 * of the registered theme names would be truthful here. Same local-widening
 * pattern already used in `site.config.ts` for the `SportsTeam` schema type.
 */
export const registry: Omit<ComponentRegistry, 'theme'> & { theme: string } = {
  theme: 'npracing-v3',
  // Bold poster hero: full-bleed action photo with overlaid type and an
  // oversized decorative race numeral.
  heroVariant: 'image-overlay',
  headerVariant: 'dark',
  cardVariant: 'standard',
  sectionVariant: 'standard',
};
