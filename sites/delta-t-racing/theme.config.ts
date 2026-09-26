import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * Delta T Racing — "Grid Box" Theme Configuration
 *
 * A direct copy of sites/npracing-v1's dark-first Grid Box design (Delta T is
 * NPRacing's sister team), re-keyed from NPRacing red to the BLUE in the Delta T
 * logo, per the client brief. The logo's red (#D30306) stays inside the logo
 * artwork only — it is deliberately not a UI colour.
 *
 * Brand colours:
 *   #113A93  -> brand.primary. Sampled from the logo PNG (most frequent blue
 *               pixel). Used for every FILL: buttons, announce bar, race plates,
 *               sponsor CTA band. White text on it measures 10.24:1.
 *   #3558A3  -> brand.primaryHover (primary + 15% white). White on it: 6.83:1.
 *   #0C2967  -> brand.secondary (primary + 30% black), hairline chip borders.
 *   #061433  -> brand.dark.
 *   #7089BE  -> brand.accent / brand.light — primary + 40% white, same hue.
 *               Used for TEXT accents on the near-black surfaces (links,
 *               eyebrows, race numbers, highlighted headline words). This exists
 *               because #113A93 as text on #0A0A0A measures only 1.93:1, far
 *               below WCAG AA's 4.5:1. #7089BE measures 5.67:1 on the page
 *               background and 4.93:1 on the lightest surface it sits on
 *               (surface.muted #1B1B1B). Flagged to the client as a derived tint,
 *               not a supplied colour.
 *
 * Every text-on-dark use of the brand colour in this site's components uses
 * `text-brand-accent`, never `text-brand-primary`, for the reason above.
 *
 * Surfaces, greys and type are unchanged from npracing-v1 — see that file for
 * the alpha-flattening notes behind the grey values.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#113A93',
      primaryHover: '#3558A3',
      secondary: '#0C2967',
      accent: '#7089BE',
      onPrimary: '#FFFFFF',
      light: '#7089BE',
      dark: '#061433',
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
      error: '#FF4D5E',
      info: '#60A5FA',
    },
    overlay: {
      dark: 'rgba(10,10,10,0.85)',
      light: 'rgba(243,242,238,0.8)',
      primary: 'rgba(17,58,147,0.8)',
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
 * `themeConfig` degrades to Delta T blue.
 */
export const emailThemeColors = {
  brandPrimary: themeConfig.colors?.brand?.primary ?? '#113A93',
  textPrimary: themeConfig.colors?.surface?.foreground ?? '#F3F2EE',
  background: themeConfig.colors?.surface?.muted ?? '#1B1B1B',
  textMuted: themeConfig.colors?.surface?.mutedForeground ?? '#A4A3A0',
} as const;

export const registry: ComponentRegistry = {
  // Lineage label only (self-contained site) — inherited from npracing-v1.
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
