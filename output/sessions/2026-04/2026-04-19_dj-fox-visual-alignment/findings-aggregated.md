# Aggregated Review Findings

**Site:** dj-fox-electrical-test
**Date:** 2026-04-19
**Agents:** cs-visual-fidelity-reviewer (opus), cs-frontend-engineer (a11y, sonnet), cs-frontend-engineer (perf, sonnet)

---

## By Domain

### Visual Fidelity — Critical & High (22 findings)

**Critical (5):**

- **VFR-001** — Hero background image missing ("R2 URL Not Configured" text visible on every image-hero page). Fix: set R2_PUBLIC_URL env var; HeroSection should not render placeholder text.
- **VFR-006** — Why-Choose-Us section rendered as 4-column icon grid on white instead of dark table rows on inverse background.
- **VFR-014** — Contact form on white background instead of dark-navy card (bg-surface-inverse).
- **VFR-025** — Location detail page (locations/eastbourne) renders `/services` content instead of location MDX — routing/dataKey bug.
- **VFR-031** — Blog page crashes: `TypeError: Failed to construct 'URL': Invalid URL` — siteUrl empty or missing NEXT_PUBLIC_SITE_URL.

**High (17):**

- **VFR-002** — Stats strip renders on light grey (white) not dark-inverse; stat values are red not white.
- **VFR-003** — Services section is a 3-col card grid instead of 2-col sticky heading + divider list.
- **VFR-004** — Location pills section entirely missing from home page.
- **VFR-005** — Empty TestimonialGrid appears on home page (reference has none).
- **VFR-007** — CTASection is solid brand-red on every page; should be dark-inverse with dual buttons.
- **VFR-009** — About hero: no image, stats strip on white not dark-inverse.
- **VFR-010** — About Core Values: no card borders (flat vs bordered).
- **VFR-012** — About CTA: solid red instead of dark-inverse with dual buttons (covered by VFR-007).
- **VFR-015** — Contact hero: no image, no breadcrumbs.
- **VFR-018** — Services hero: no image, no breadcrumbs.
- **VFR-019** — Services: flat "All services" grid instead of grouped-by-category layout.
- **VFR-022** — Locations hero: wrong dataKey ("services.hero" → "locations.hero"), wrong copy.
- **VFR-024** — Locations CTA: solid red (should be inverse or removed).
- **VFR-026** — Reviews stats: wrong component; missing four-metric dark strip.
- **VFR-027** — Reviews: no Featured/All two-tier layout; no author avatars.
- **VFR-028** — Reviews CTA: correct colour but wrong copy ("Ready to Get Started?" vs "Ready to experience our service?").
- **VFR-032** — Pricing: missing 24/7 Emergency Callout card and Hourly Rates three-card section.

---

### Accessibility — Critical & High (3 findings)

- **A11Y-001** — No skip-navigation link; `<main>` has no `id` for skip target. WCAG 2.4.1 Level A.
- **A11Y-002** — `text-success` (#10b981) fails WCAG AA contrast (2.54:1) on contact form success state.
- **A11Y-003** — `text-error` (#ef4444) fails WCAG AA contrast (3.76:1) on contact form validation errors.

---

### Performance — Critical & High (0 findings)

No critical or high performance issues. Site config, image optimisation, and CSS are clean.

---

## All Medium + Low Findings

**Visual Fidelity (Medium: 10, Low: 6):**

- VFR-008 — Home page 38% shorter than reference (consequence of high findings)
- VFR-011 — About "Why Choose Us" checklist section missing
- VFR-013 — About hero heading left-aligned (should be centred)
- VFR-016 — Contact right-rail: single combined card vs three distinct stacked cards
- VFR-017 — Contact: extra FAQ section not in reference
- VFR-020 — Services: missing 3-image type-selector (Domestic/Commercial/Emergency)
- VFR-021 — 404 page: white bg vs dark-inverse reference
- VFR-023 — Locations card styling minor delta
- VFR-029 — Projects stats placement and data mismatch
- VFR-033 — Pricing: missing inspection section (image-text two-col)
- VFR-034 — Pricing: FeatureGrid on white instead of subtle background
- VFR-036 — Privacy hero: light instead of dark-inverse
- VFR-030, VFR-035, VFR-037, VFR-038 — Low/cosmetic

**Accessibility (Medium: 6, Low: 3):**

- A11Y-004 — Emoji icons missing `aria-hidden` (feature-grid, service-cards, pricing-table)
- A11Y-005 — Mobile menu phone SVG missing `aria-hidden`
- A11Y-006 — Mega-menu CTA arrow SVG missing `aria-hidden`
- A11Y-007 — Location dot indicator uses `title` not `sr-only` text
- A11Y-008 — CategoryCardsSection outer `<section>` has no accessible name (change to `<div>`)
- A11Y-009 — Footer external link does not announce new tab
- A11Y-010 — TextSection h1 composition constraint (future risk)
- A11Y-011 — StatsStrip stat value/label not semantically grouped
- A11Y-012 — FAQ details/summary older AT compatibility

**Performance (Medium: 7, Low: 1):**

- PERF-001 — Split hero raw `<img>` bypasses Next.js image optimisation
- PERF-002 to PERF-007 — `'use client'` on components with no client-side logic (6 components)
- PERF-008 — not-found.tsx entirely client for one `window.history.back()` call

---

## Aggregated Statistics

| Domain          | Critical | High   | Medium | Low    | Total  |
| --------------- | -------- | ------ | ------ | ------ | ------ |
| Visual Fidelity | 5        | 17     | 10     | 6      | 38     |
| Accessibility   | 0        | 3      | 6      | 3      | 12     |
| Performance     | 0        | 0      | 7      | 1      | 8      |
| **Total**       | **5**    | **20** | **23** | **10** | **58** |

**Gate:** Critical + High total = **25**

---

## Fix Sequencing (recommended)

### Tier 1 — Unblock broken pages (Critical)

1. VFR-031: Fix blog URL crash (guard siteUrl; set NEXT_PUBLIC_SITE_URL)
2. VFR-025: Fix location-detail routing (locations/[slug]/page.tsx)
3. VFR-001: Fix R2 URL env var or HeroSection fallback

### Tier 2 — Platform-level composable fixes (affect every page)

4. background: "inverse" not honoured → fix StatsStrip, FeatureGrid, CTASection (fixes VFR-002, VFR-006, VFR-007 family)
5. Noise overlay on inverse sections (Phase 2 of YOLO brief)
6. CTASection composition.json global: "brand" → "inverse" (VFR-007 et al.)

### Tier 3 — New composables (Phase 4 of YOLO brief)

7. ServiceListSection (replaces ServiceCards on home)
8. LocationPillsSection (adds missing home section)
9. WhyChooseUsSection (replaces FeatureGrid on home)

### Tier 4 — Page-specific composition.json fixes

10. Hero dataKey fix: locations page (VFR-022)
11. Remove empty TestimonialGrid from home (VFR-005)
12. About StatsStrip background: subtle → inverse (VFR-009)
13. Contact background: surface → inverse (VFR-014)
14. FeatureGrid subtle background on pricing (VFR-034)

### Tier 5 — Accessibility quick wins

15. A11Y-002/003: text-success/text-error contrast fixes
16. A11Y-004/005/006/007/008/009: aria-hidden + sr-only fixes (all trivial)
