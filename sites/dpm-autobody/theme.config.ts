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
 * Fonts (2026-09-11 font-loading pass): the platform's shared `typography.fontFamily`
 * schema only has sans/heading/mono slots — no separate "display" slot for Archivo, the
 * prototype's grotesk. Rather than extend the shared ThemeConfig type (which every other
 * site's theme.config.ts also depends on), the `sans` slot is repurposed here to carry
 * Archivo (the prototype's actual nav/UI/label/caption/micro-copy face — NOT prose body
 * copy) and `heading` carries Fraunces as before. Newsreader (the prototype's prose/lede
 * paragraph face) has nowhere to go in the shared schema at all, so it's wired up as a
 * site-local `font-prose` Tailwind utility in tailwind.config.ts instead — components that
 * render lede/prose paragraph copy must apply `font-prose` explicitly; plain body text
 * otherwise inherits `font-sans` (Archivo) via Tailwind Preflight. All three faces are
 * loaded with next/font/google in app/layout.tsx (self-hosted, no external font request),
 * matching the precedent already set by sites/dcs and sites/dj-fox-electrical. **`weight` is a
 * discrete list of the exact weights actually used, not `'variable'`** (changed 2026-09-12, see
 * `app/layout.tsx`'s own comment for the full rationale and the grep to re-run before adding a
 * new weight anywhere) — `next/font/google` has no way to request a bounded range like the
 * prototype's own `Fraunces:opsz,wght@9..144,300..600` Google Fonts syntax, so `'variable'` was
 * downloading each family's entire default axis, and fonts turned out to be the single largest
 * asset category on the homepage. This also means Fraunces/Newsreader no longer carry
 * `axes: ['opsz']` — next/font throws a build error combining a fixed `axes` list with a
 * discrete `weight` (only valid alongside `weight: 'variable'`) — so optical-size interpolation
 * is gone in favour of each weight's static default opsz. No visible regression found.
 *
 * Components/pages themselves are still base-template's generic placeholders, not the
 * real ledger/register design (separate, in-progress work by other agents).
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '#A61C24', // --accent, paint-code red
      primaryHover: '#E4776C', // --accent-ink, the candy-red variant used ONLY on the
      // build/car pages whose paint code is this red (e.g. the E-type — see
      // etype-941pvo.html's data-accent/data-ink attributes). Verified 2026-09-11 against
      // every prototype page's embedded CSS custom properties (`--accent-ink: #E4776C` +
      // per-page `data-accent`/`data-ink` attrs) — do NOT use this for generic eyebrow/
      // CTA/nav-underline styling on non-build pages; see `custom.accentInkNeutral` below.
      secondary: '#C7BBA1', // --house, sampled house-colour fill. Verified 2026-09-11
      // against the prototype's actual `--house` custom property, which is #C7BBA1 on
      // every page (home/workshop/contact/library/etype/volvo) — a reviewer's suggested
      // correction to #D9CDB1 does not hold up against the source CSS and was not applied;
      // that figure appears to be an eyeballed approximation of the separate `--house-ink`
      // token (#D8CBAE, see `custom.accentInkNeutral` below), not `--house` itself.
      accent: '#E4776C', // --accent-ink (candy variant, see primaryHover note above)
    },
    // Arbitrary site-specific token (emits --color-accent-ink-neutral). Use this — via the
    // `text-ink-neutral` / `border-ink-neutral` / `bg-ink-neutral` Tailwind utilities added
    // in tailwind.config.ts — for eyebrow labels, CTA text, and nav-underline colour on
    // every page EXCEPT an individual build/car detail page (which should use its own car's
    // paint ink, e.g. brand.primaryHover for the E-type's red). Verified 2026-09-11: home.html
    // (outside its car-reveal "lot" sections), workshop.html, contact.html and library.html
    // all set `data-accent="#C7BBA1" data-ink="#D8CBAE"` (the prototype's --house/--house-ink
    // pair) on their top-level sections, which the page's scroll-linked script reads into the
    // `--accent-ink` CSS custom property actually applied to eyebrow/nav-underline/CTA
    // elements — i.e. the rendered colour on those pages is #D8CBAE (stone/cream), NOT the
    // #E4776C candy-red that brand.primaryHover/accent resolve to. Do not confuse this with
    // brand.secondary (#C7BBA1, --house itself, a fill colour) — this is the separate
    // --house-ink token used for text/ink, not fill.
    custom: {
      accentInkNeutral: '#D8CBAE', // --house-ink
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
      // --font-display (Archivo) — the prototype's nav/UI/label/caption/micro-copy grotesk.
      // Repurposing the shared `sans` slot for this (see file header comment) rather than
      // Newsreader, which the prototype actually uses for prose/lede body copy, not general
      // UI text — see the site-local `font-prose` Tailwind extension for that.
      // `--font-archivo` is set by next/font/google in app/layout.tsx.
      sans: ['var(--font-archivo)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      // --font-heading (Fraunces), loaded with its variable opsz axis via next/font/google
      // in app/layout.tsx as `--font-fraunces`.
      heading: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
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
