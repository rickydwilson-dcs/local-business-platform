import type { ComponentRegistry, DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * DPM Autobody Theme Configuration
 *
 * Colors and fonts sourced directly from the approved static prototype's CSS custom
 * properties (output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/src/
 * library.html — "Direction D", Ricky-approved 2026-09-08): near-black ground, paint-code
 * red accent, auction-lot-page structure. The brand.primaryHover/secondary/semantic
 * mappings below are this pass's best-effort role assignment, not values verified against
 * real component usage yet — confirm against actual component behaviour when the real
 * header/footer/pages are built (see build-out session.md Phase 1/2).
 *
 * Not yet done: loading Archivo/Fraunces/Newsreader as real fonts (the platform's
 * typography.fontFamily schema only has sans/heading slots, no separate "display" slot —
 * Archivo, the prototype's display face, has nowhere to go yet without either extending
 * that schema or reusing one of the two existing slots). Components/pages themselves are
 * still base-template's generic placeholders, not the real ledger/register design.
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#A61C24', // --accent, paint-code red
      primaryHover: '#E4776C', // --accent-ink, the prototype's lighter accent variant
      secondary: '#C7BBA1', // --house, sampled house-colour fill
      accent: '#E4776C', // --accent-ink
    },
    surface: {
      background: '#0B0B0C', // --ground
      foreground: '#E8E4DC', // --bone
      muted: '#141416', // --surface
      mutedForeground: '#A8A399', // --bone-dim
      card: '#1A1A1D', // --panel
      cardBorder: 'rgba(232, 228, 220, 0.14)', // --hair
    },
    // Not sourced from the prototype — it has no success/warning/error/info states defined.
    // Left as base-template defaults until a real need for them appears in the design.
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: 'rgba(11, 11, 12, 0.74)', // --veil
      light: 'rgba(255, 255, 255, 0.8)',
      primary: 'rgba(166, 28, 36, 0.8)', // brand primary with opacity
    },
  },

  typography: {
    fontFamily: {
      // --font-text (Newsreader) is the prototype's body copy face.
      sans: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
      // --font-heading (Fraunces) — still an open question per open-questions.md
      // (type-study not yet resolved), used here as the current best-known value.
      heading: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
    },
  },

  components: {
    button: {
      borderRadius: '0.5rem',
      fontWeight: 600,
    },
    card: {
      borderRadius: '1rem',
      shadow: 'sm',
    },
    hero: {
      variant: 'centered',
    },
    navigation: {
      style: 'solid',
    },
  },
};

export const registry: ComponentRegistry = {
  // Metadata only (self-contained site, no @platform/themes/* import) — "vega" is the
  // nearest reference tag in the fixed THEME_NAMES enum, not a functional import.
  theme: 'vega',
  heroVariant: 'split',
  headerVariant: 'dark',
  cardVariant: 'standard',
  sectionVariant: 'standard',
};
