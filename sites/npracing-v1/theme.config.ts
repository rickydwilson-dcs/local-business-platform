import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * NPRacing v1 — "Grid Box" Theme Configuration
 *
 * Dark-first race-team identity taken from the approved Grid Box design
 * direction (output/sessions/2026-08/2026-08-01_npracing-homepage-options/
 * prototype/tokens.css). Black / red / off-white only — the palette is pulled
 * from the team logo, so there is deliberately no third hue.
 *
 * Palette mapping from the prototype's raw tokens:
 *   --black    #0a0a0a  -> surface.background
 *   --black-2  #141414  -> surface.subtle   (banded strips, marquee, inputs)
 *   --black-3  #1b1b1b  -> surface.muted    (secondary panels)
 *   --card     #111111  -> surface.card
 *   --red      #E11024  -> brand.primary
 *   --red-bright #FF1B34 -> brand.primaryHover / brand.accent / brand.light
 *   --red-deep #A80D1C  -> brand.secondary
 *   --red-dim  #3d0a10  -> brand.dark (hairline borders on red-tinted chips)
 *   --ink      #F3F2EE  -> surface.foreground
 *
 * The prototype expresses its greys as alpha-over-black (rgba(243,242,238,.66)
 * etc). The theme system's Zod schema requires 6-digit hex, so those are
 * flattened here against the #0a0a0a page background:
 *   ink-soft  .66 -> #A4A3A0   (surface.secondaryForeground / mutedForeground)
 *   ink-faint .40 -> #8A8985   (surface.tertiaryForeground — bumped from the
 *     prototype's literal #676765 in August 2026: that value only cleared
 *     3.49:1 against #0a0a0a, failing WCAG AA's 4.5:1 for normal text.
 *     #8A8985 clears 4.5:1 against every surface shade this token appears
 *     on (background/card/subtle/muted), worst case 4.92:1 on muted #1b1b1b.)
 *   line      .14 -> #2B2B2A   (surface.cardBorder)
 *   line-2    .08 -> #1D1D1C   (surface.subtleBorder)
 *
 * As on sites/dch-automotive, `surface.inverse` is deliberately the LIGHT end
 * of the palette: the page background is already near-black, so there is no
 * darker tone left to contrast against.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#E11024',
      primaryHover: '#FF1B34',
      secondary: '#A80D1C',
      accent: '#FF1B34',
      onPrimary: '#FFFFFF',
      light: '#FF1B34',
      dark: '#3D0A10',
    },
    surface: {
      background: '#0A0A0A',
      foreground: '#F3F2EE',
      secondaryForeground: '#A4A3A0',
      tertiaryForeground: '#8A8985',
      muted: '#1B1B1B',
      mutedForeground: '#A4A3A0',
      card: '#111111',
      cardBorder: '#2B2B2A',
      subtle: '#141414',
      subtleBorder: '#1D1D1C',
      inverse: '#F3F2EE',
      inverseMutedForeground: '#55534E',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#FF1B34',
      info: '#60A5FA',
    },
    overlay: {
      dark: 'rgba(10,10,10,0.85)',
      light: 'rgba(243,242,238,0.8)',
      primary: 'rgba(225,16,36,0.8)',
    },
  },

  typography: {
    fontFamily: {
      // Loaded via <link> in app/layout.tsx — a CSS @import of a Google Fonts
      // URL is silently dropped by this platform's Tailwind pipeline.
      sans: ['Barlow', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Barlow Condensed', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // Condensed display type: very tight line-height, near-zero tracking, heavy
    // weights. Fluid clamp() sizes match the prototype's responsive headings.
    scale: {
      hero: {
        size: 'clamp(2rem, 5.2vw, 4.4rem)',
        lineHeight: '0.98',
        letterSpacing: '-0.01em',
        weight: 800,
      },
      h1: {
        size: 'clamp(2.4rem, 5vw, 3.8rem)',
        lineHeight: '0.98',
        letterSpacing: '-0.01em',
        weight: 800,
      },
      h2: {
        size: 'clamp(2rem, 4vw, 3.2rem)',
        lineHeight: '1',
        letterSpacing: '-0.01em',
        weight: 700,
      },
      h3: {
        size: '1.5rem',
        lineHeight: '1.15',
        letterSpacing: '0',
        weight: 700,
      },
      h4: {
        size: '1.15rem',
        lineHeight: '1.2',
        letterSpacing: '0',
        weight: 700,
      },
      body: {
        size: '1rem',
        lineHeight: '1.6',
        letterSpacing: '0',
        weight: 400,
      },
      small: {
        size: '0.9rem',
        lineHeight: '1.55',
        letterSpacing: '0',
        weight: 400,
      },
      caption: {
        size: '0.72rem',
        lineHeight: '1.4',
        letterSpacing: '0.14em',
        weight: 700,
      },
    },
  },

  components: {
    button: {
      // Pill buttons and pill nav are the signature of the Grid Box direction.
      borderRadius: '999px',
      paddingX: '1.5rem',
      paddingY: '0.9rem',
      fontWeight: 700,
    },
    card: {
      borderRadius: '1.1rem',
      shadow: 'none',
      padding: '1.8rem',
    },
    hero: {
      variant: 'full-bleed',
      minHeight: '100svh',
    },
    navigation: {
      // Floating pill nav sits on a translucent, backdrop-blurred bar.
      style: 'blur',
      appearance: 'dark',
      height: '4.5rem',
    },
    section: {
      paddingY: '6rem',
      paddingYCompact: '3.5rem',
    },
  },
};

/**
 * Resolved literal colours for transactional HTML email.
 *
 * Email clients cannot resolve CSS custom properties, so the contact
 * notification template needs concrete values. They are resolved here — beside
 * the palette, in the one file that is allowed to hold literal hex — rather
 * than in `app/api/contact/route.ts`, which must stay free of hardcoded
 * colours. The fallbacks mirror the palette above, so a partially-specified
 * `themeConfig` degrades to NPRacing red rather than the base-template blue.
 */
export const emailThemeColors = {
  brandPrimary: themeConfig.colors?.brand?.primary ?? '#E11024',
  textPrimary: themeConfig.colors?.surface?.foreground ?? '#F3F2EE',
  background: themeConfig.colors?.surface?.muted ?? '#1B1B1B',
  textMuted: themeConfig.colors?.surface?.mutedForeground ?? '#A4A3A0',
} as const;

export const registry: ComponentRegistry = {
  // `theme` is a closed ThemeName union (packages/themes/*), not a free
  // string — this site does not import from @platform/themes/* at runtime
  // (self-contained, per root CLAUDE.md), so this is purely a lineage/
  // classification label. 'orion' is documented as "dark header, full-bleed
  // hero, circular icons (industrial style)" — the closest existing match
  // to NPRacing's full-bleed cinematic dark hero, same pattern as
  // sites/dch-automotive labelling itself 'lyra'.
  theme: 'orion',
  // Closest valid ComponentRegistry enum values to a full-bleed cinematic
  // dark hero: heroVariant has no 'full-bleed' member, so 'image-overlay'
  // (background photo + gradient scrim + overlaid copy) is the accurate one.
  heroVariant: 'image-overlay',
  headerVariant: 'dark',
  // Flat, hairline-bordered panels — not elevated, not icon-circle, not a
  // photo-overlay card.
  cardVariant: 'standard',
  // The design's sections are separated by full-width hairline bands (stat
  // strip, marquee ribbon, rider strip) rather than by a contrasting dark
  // block — 'banded' is the closest accurate enum member.
  sectionVariant: 'banded',
};
