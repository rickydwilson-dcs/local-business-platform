# Aggregated Review Findings

**Site:** test-lyra
**Date:** 2026-04-27
**Agents:** cs-visual-fidelity-reviewer, cs-frontend-engineer (a11y), cs-frontend-engineer (perf)

## By Domain

### Visual Fidelity

No Critical or High findings. One Low finding (VFR-014): body font is declared as "Be Vietnam Pro" in `lyraDefaultConfig` but `Work_Sans` is loaded in `layout.tsx` — the two are mismatched but both are valid fonts, so the visual impact is low.

### Accessibility

**[CRITICAL] A11Y-001: No `<main>` landmark on any page**

- Every page (`/`, `/about`, `/contact`, `/blog/`, `/blog/test-post`) renders a React fragment with no `<main>` element. Screen reader users cannot skip repeated navigation. Fails WCAG 2.4.1 Level A.
- **Fix:** Wrap page body content in `<main>` in each page file, or add it centrally in `app/layout.tsx`.

**[CRITICAL] A11Y-002: Contact form has no submit button**

- `ContactFormPanel` (`packages/themes/lyra/components/contact-form-panel.tsx`) accepts a `submitButton` prop but never renders a `<button type="submit">`. The form on `/contact` cannot be submitted by keyboard. Fails WCAG 2.1.1 Level A.
- **Fix:** Add `<button type="submit">Submit</button>` inside the form element.

**[HIGH] A11Y-003: File upload input unreachable by keyboard**

- `contact-form-panel.tsx` — `type="file"` input has `className="hidden"`, drop-zone `<div>` has no `tabIndex`, role, or keyboard handler.
- **Fix:** Replace `hidden` with `sr-only` and make drop zone keyboard-operable.

**[HIGH] A11Y-004: `PrimaryNavigation` `<nav>` has no `aria-label`**

- `primary-navigation.tsx` line 21 — missing `aria-label="Primary navigation"`.
- **Fix:** Add `aria-label="Primary navigation"` to the `<nav>` element.

**[HIGH] A11Y-005: Mobile menu buttons have no `aria-expanded`**

- `primary-navigation.tsx`, `navigation-top-bar.tsx`, `navigation-sticky-top.tsx` — hamburger buttons statically rendered with no open/closed state. Fails WCAG 4.1.2 Level A.
- **Fix:** Add a Client Component wrapper tracking state and setting `aria-expanded`.

**[HIGH] A11Y-006: `ServicesGrid` card headings use `text-surface-background` on `bg-surface-foreground`**

- `services-grid.tsx` lines 75, 105, 135 — token names semantically inverted (white text token on black card). Any theme update changing `surface.background` will break contrast.
- **Fix:** Replace with a stable dark-card text token (e.g. `text-white` or a dedicated contrast token).

### Performance

**[HIGH] PERF-001: `images.formats` not configured — AVIF not enabled**

- `sites/test-lyra/next.config.ts` images block — default is `['image/webp']` only. Remote images from `*.r2.dev` not transcoded to AVIF.
- **Fix:** Add `formats: ['image/avif', 'image/webp']` to the `images` block.

**[HIGH] PERF-002: `compress` not explicitly set**

- `sites/test-lyra/next.config.ts` — absent `compress` option could silently disable gzip/brotli in a custom-server scenario.
- **Fix:** Add `compress: true` to `nextConfig`.

## All Medium + Low findings

| ID       | Domain          | Severity | Summary                                                                                  |
| -------- | --------------- | -------- | ---------------------------------------------------------------------------------------- |
| PERF-003 | Performance     | Medium   | Global `sideEffects: false` in webpack config — can silently strip CSS in production     |
| PERF-004 | Performance     | Medium   | Material Symbols loaded via render-blocking `<link>`                                     |
| PERF-005 | Performance     | Medium   | `not-found.tsx` is full Client Component — only back button needs client                 |
| A11Y-007 | Accessibility   | Medium   | `ClientLogoStrip` images all have identical `alt="Client logo"`                          |
| A11Y-008 | Accessibility   | Medium   | `BlogArticleGrid` filter buttons lack `aria-pressed` and may have empty accessible names |
| A11Y-009 | Accessibility   | Medium   | `ContactFormPanel` `<form>` has no `aria-labelledby`                                     |
| A11Y-010 | Accessibility   | Medium   | Breadcrumb current item missing `aria-current="page"`                                    |
| VFR-014  | Visual Fidelity | Low      | Body font mismatch: `Be Vietnam Pro` in config vs `Work_Sans` loaded                     |
| PERF-006 | Performance     | Low      | `package.json` missing `build` script — CI may use Turbopack                             |
| PERF-007 | Performance     | Low      | `swcMinify` informational note only                                                      |
| A11Y-011 | Accessibility   | Low      | `AnnouncementBar` bare emoji read aloud by screen readers                                |
| A11Y-012 | Accessibility   | Low      | `FeaturedBlogPost` "Read Full Article" link has `href="#"`                               |
| A11Y-013 | Accessibility   | Low      | `SiteFooter` social icon `aria-label` has no fallback for `undefined`                    |

## Aggregated Statistics

| Domain          | Critical | High  | Medium | Low   | Total  |
| --------------- | -------- | ----- | ------ | ----- | ------ |
| Visual Fidelity | 0        | 0     | 0      | 1     | 1      |
| Accessibility   | 2        | 4     | 4      | 3     | 13     |
| Performance     | 0        | 2     | 3      | 2     | 7      |
| **Total**       | **2**    | **6** | **7**  | **6** | **21** |

**Gate:** Critical + High total = **8** → fix agent runs
