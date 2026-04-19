# Accessibility Audit Findings

**Reviewer:** cs-frontend-engineer (accessibility mode)
**Scope:** 12 pages — `/` `/about` `/contact` `/services` `/services/emergency-callout` `/locations` `/locations/eastbourne` `/reviews` `/projects` `/blog` `/pricing` `/privacy-policy`
**Date:** 2026-04-19

---

## Findings

### [HIGH] A11Y-001: No skip-navigation link — keyboard users must Tab through entire header on every page

- **File:** `packages/core-components/src/components/ui/site-header.tsx` (line 107)
- **Issue:** There is no "Skip to main content" link rendered before the `<header>`. The sticky header contains a logo link, up to seven nav items, a phone link, a CTA button, and a hamburger — all of which a keyboard user must Tab through before reaching page content. The `<main>` element on each page has no `id` that a skip link could target.
- **Impact:** Keyboard-only users and screen reader users cannot bypass repetitive navigation. WCAG 2.4.1 (Bypass Blocks) — Level A.
- **Fix:** Add a visually-hidden skip link as the first child of `<body>` in `layout.tsx`, and add `id="main-content"` to the `<main>` in each page file.
- **Effort:** small

### [HIGH] A11Y-002: Contact form success state uses `text-success` (#10b981) — contrast fails WCAG AA

- **File:** `packages/core-components/src/components/ui/contact-form/index.tsx` (lines 217–219)
- **Issue:** `text-success` (`#10b981`) on white = 2.54:1; on `bg-green-50` = 2.42:1. Both fail WCAG AA threshold of 4.5:1.
- **Impact:** Low-vision users cannot read post-submission confirmation. WCAG 1.4.3 — Level AA.
- **Fix:** Replace `text-success` with `text-green-700` (#15803d, 4.79:1 on green-50) for text elements. Icon can remain `text-green-600`.
- **Effort:** trivial

### [HIGH] A11Y-003: Contact form `text-error` (#ef4444) — contrast fails on all usage backgrounds

- **File:** `packages/core-components/src/components/ui/contact-form/index.tsx` (lines 317–320, 368, 396, 529, 576, 600, 708)
- **Issue:** `text-error` = `#ef4444`. On white = 3.76:1 (fail); on `bg-red-50` = 3.44:1 (fail). Used for error banner text and all inline field-level error messages.
- **Impact:** Low-vision users may not read validation errors, preventing form submission. WCAG 1.4.3 — Level AA.
- **Fix:** Replace `text-error` with `text-red-700` (#b91c1c, 5.91:1 on red-50, 4.65:1 on white) for all error text labels.
- **Effort:** small

### [MEDIUM] A11Y-004: Emoji icons in `FeatureGrid`, `ServiceCards`, and `PricingTable` lack `aria-hidden`

- **File:** `packages/core-components/src/components/composable/feature-grid.tsx` (line 71); `service-cards.tsx` (line 81); `pricing-table.tsx` (line 72)
- **Issue:** Icon values (emoji characters like "⚡", "🔧") rendered in bare `<div>` containers with no `aria-hidden="true"`. Screen readers announce emoji by Unicode description, interrupting adjacent title text.
- **Impact:** Screen reader users hear redundant/confusing emoji announcements for every card. WCAG 1.1.1.
- **Fix:** Add `aria-hidden="true"` to the icon container `<div>` in all three components.
- **Effort:** trivial

### [MEDIUM] A11Y-005: Mobile menu phone SVG icon missing `aria-hidden`

- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (lines 264–276)
- **Issue:** The phone `<svg>` inside the phone `<Link>` has no `aria-hidden="true"`. The link already provides a text label from `{phoneDisplay}`; the SVG is decorative.
- **Impact:** Screen reader users hear an extraneous element announcement before the phone number. Affects all pages. WCAG 1.1.1.
- **Fix:** Add `aria-hidden="true"` to the `<svg>` at line 264.
- **Effort:** trivial

### [MEDIUM] A11Y-006: Mega-menu "Get Free Quote" footer SVG arrow lacks `aria-hidden`

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 336–343)
- **Issue:** Decorative right-arrow SVG in the mega-menu footer has no `aria-hidden="true"`. The link text "Get Free Quote" is the accessible name.
- **Impact:** Screen readers announce a nameless embedded graphic inside the link. WCAG 1.1.1.
- **Fix:** Add `aria-hidden="true"` to the `<svg>` at line 336.
- **Effort:** trivial

### [MEDIUM] A11Y-007: Mega-menu rich-content dot indicator uses `title` attribute — not reliably announced by screen readers

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 311–315)
- **Issue:** A small brand-red dot uses `title="Detailed coverage"`. The `title` attribute is not reliably exposed by modern screen readers.
- **Impact:** Screen reader users cannot distinguish which location links lead to full content pages. WCAG 1.3.1 — Level A.
- **Fix:** Replace with `aria-hidden="true"` on dot + `<span className="sr-only"> (detailed coverage page)</span>`.
- **Effort:** trivial

### [MEDIUM] A11Y-008: `CategoryCardsSection` outer `<section>` element has no accessible name

- **File:** `packages/core-components/src/components/composable/category-cards-section.tsx` (lines 32–54)
- **Issue:** Outer `<section>` wrapping inner category group sections has no `aria-label` or `aria-labelledby`. Serves only as a layout wrapper.
- **Impact:** Screen readers show an unnamed region in landmark navigation. Affects `/services` page. WCAG 4.1.2 advisory.
- **Fix:** Change outer `<section>` to `<div>`.
- **Effort:** trivial

### [MEDIUM] A11Y-009: Footer "Built by" external link does not announce it opens in a new tab

- **File:** `packages/themes/orion/components/footer.tsx` (lines 175–183)
- **Issue:** The optional `builtBy` link uses `target="_blank"` with no screen reader indication that a new tab will open.
- **Impact:** Screen reader users may be disoriented when browser context switches unexpectedly. WCAG 3.2.2 / 2.4.4 advisory.
- **Fix:** Add `aria-label={`${builtBy.name} (opens in new tab)`}`.
- **Effort:** trivial

### [LOW] A11Y-010: `TextSection` renders an `<h1>` — must never be combined with `HeroSection` in the same page composition

- **File:** `packages/core-components/src/components/composable/text-section.tsx` (line 215)
- **Issue:** `TextSection` renders the page title as `<h1>`. No schema guard prevents adding `TextSection` to a page that already includes a `HeroSection`.
- **Impact:** No current defect — future risk only. WCAG 1.3.1 potential.
- **Fix:** Add JSDoc comment noting the `<h1>` constraint; consider `showPageHeading` slot.
- **Effort:** small

### [LOW] A11Y-011: `StatsStrip` stat value and label are not semantically grouped

- **File:** `packages/core-components/src/components/composable/stats-strip.tsx` (lines 56–64)
- **Issue:** Each stat renders as two sibling `<p>` elements with no explicit association. Screen readers announce value and label as independent items.
- **Impact:** Screen reader users may not pair stat values with their labels. Low severity — content remains technically accessible.
- **Fix:** Add `aria-label` on the container: `aria-label={`${stat.value} ${stat.label}`}` with `aria-hidden="true"` on child `<p>` elements.
- **Effort:** small

### [LOW] A11Y-012: FAQ `<details>/<summary>` expanded/collapsed state not announced by older enterprise AT

- **File:** `packages/core-components/src/components/composable/faq-section.tsx` (lines 58–66)
- **Issue:** Native `<details>/<summary>` pattern. Modern AT handles correctly; older JAWS versions (pre-2021) may not expose state.
- **Impact:** Minimal on modern consumer AT. Potential concern in enterprise contexts. WCAG 4.1.2 — Level A (only for older AT).
- **Fix:** No immediate action required for consumer use cases. Consider `<button aria-expanded>` pattern if enterprise AT support is a requirement.
- **Effort:** medium (only if needed)

---

## Statistics

- Critical: 0
- High: 3
- Medium: 6
- Low: 3
- Total: 12
