# Accessibility Audit Findings

**Reviewer:** cs-frontend-engineer (accessibility mode)
**Scope:** sites/dj-fox-electrical-test
**Date:** 2026-04-19

## Findings

### [HIGH] A11Y-001: Multiple `<nav>` elements have no distinguishing `aria-label`

- **File:** `packages/core-components/src/components/ui/site-header.tsx` (line 125), `packages/core-components/src/components/ui/mobile-menu.tsx` (line 176)
- **Issue:** The desktop `<nav>` in `SiteHeader` and the `<nav>` inside `MobileMenu` have no `aria-label`. Screen readers list all nav landmarks; without labels users cannot distinguish "Main navigation" from "Mobile navigation".
- **Impact:** Screen reader users navigating by landmarks hear multiple unlabelled "navigation" regions. Violates WCAG 2.1 SC 1.3.6.
- **Fix:** Add `aria-label="Main navigation"` to `site-header.tsx` line 125. Add `aria-label="Mobile navigation"` to `mobile-menu.tsx` line 176.
- **Effort:** trivial

### [HIGH] A11Y-002: `.mobile-menu-close` CSS removes focus outline without a replacement ring

- **File:** `packages/themes/orion/globals.css` (line 369)
- **Issue:** `.mobile-menu-close` applies `focus:outline-none` but does not chain a `focus:ring-*` replacement. The close button inside the mobile menu overlay loses its visible focus indicator when reached by keyboard.
- **Impact:** Keyboard users cannot see focus on the close button. Violates WCAG 2.1 SC 2.4.7 (Focus Visible, Level AA).
- **Fix:** Change line 369 to also add `focus:ring-2 focus:ring-brand-primary focus:ring-offset-2`.
- **Effort:** trivial

### [HIGH] A11Y-003: `LocationsDropdown` chevron SVGs not `aria-hidden`

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (line 164), `packages/core-components/src/components/ui/mobile-menu.tsx` (line 188)
- **Issue:** Dropdown trigger button chevron `<svg>` elements have no `aria-hidden="true"`. Screen readers announce SVG path data or inject an "image" announcement after the button label.
- **Impact:** Superfluous content announced after button labels on any page with the Locations dropdown or mobile menu.
- **Fix:** Add `aria-hidden="true"` to the chevron `<svg>` at `locations-dropdown.tsx` line 165 and `mobile-menu.tsx` line 189.
- **Effort:** trivial

### [HIGH] A11Y-004: `LocationsDropdown` menu items have redundant `tabIndex={0}` and wrong `aria-haspopup`

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 220, 271, 285)
- **Issue:** `<Link role="menuitem" tabIndex={0}>` — `<a>` elements are inherently tab-focusable; adding `tabIndex={0}` makes each item a separate Tab stop in addition to arrow-key navigation. Also `aria-haspopup="true"` should be `aria-haspopup="menu"` to match the `role="menu"` child.
- **Impact:** Tab key traversal through the mega-menu is very slow for keyboard users with many locations. Violates ARIA Authoring Practices Guide Menu Button pattern.
- **Fix:** Remove `tabIndex={0}` from the three `<Link role="menuitem">` elements. Change `aria-haspopup="true"` to `aria-haspopup="menu"`.
- **Effort:** small

### [MEDIUM] A11Y-005: `TestimonialGrid` star ratings have no accessible numeric value

- **File:** `packages/core-components/src/components/composable/testimonial-grid.tsx` (lines 86–93)
- **Issue:** Five `<span>★</span>` elements with no `aria-hidden` on individual spans and no `aria-label` on the container conveying the numeric value.
- **Impact:** Screen reader users cannot determine the rating. Affects home page, reviews page, and every page using `TestimonialGrid`.
- **Fix:** Add `aria-label={\`${t.rating} out of 5 stars\`}`to the container div and`aria-hidden="true"` to individual star spans.
- **Effort:** trivial

### [MEDIUM] A11Y-006: `ContactSection` renders a placeholder paragraph instead of a functional form

- **File:** `packages/core-components/src/components/composable/contact-section.tsx` (lines 87–92)
- **Issue:** The `data-slot="contactForm"` div contains only `<p>Contact form placeholder</p>`. No `<form>`, `<input>`, or `<label>` elements present.
- **Impact:** All users are unable to submit an enquiry via the composition-rendered contact page.
- **Fix:** Replace the placeholder `<p>` with `<ContactForm>` from `@platform/core-components`, or accept `children` for page-level injection.
- **Effort:** medium

### [MEDIUM] A11Y-007: Hero and ContentSection images use unconditional `alt=""`

- **File:** `packages/core-components/src/components/composable/hero-section.tsx` (line 110), `packages/core-components/src/components/composable/content-section.tsx` (line 98)
- **Issue:** Both components render `<img ... alt="">` unconditionally. Content images (team photos, job sites) are not decorative and require descriptive alt text.
- **Impact:** Screen reader users receive no information about content images.
- **Fix:** Accept optional `heroImageAlt` / `imageAlt` data keys. Fall back to `""` only when explicitly absent.
- **Effort:** small

### [MEDIUM] A11Y-008: `TextSection` table variant uses `<td>` for row headers

- **File:** `packages/core-components/src/components/composable/text-section.tsx` (lines 121–132)
- **Issue:** The `type === "table"` render uses `<td>` for both columns. The first column is functionally a row label and should be `<th scope="row">`. No `<caption>` or `aria-label`.
- **Impact:** Screen reader users navigating tables cell-by-cell receive no header context.
- **Fix:** Change the first `<td>` in each table row to `<th scope="row">`.
- **Effort:** trivial

### [LOW] A11Y-009: `not-found.tsx` decorative icons inside links lack `aria-hidden`

- **File:** `sites/dj-fox-electrical-test/app/not-found.tsx` (lines 22, 28, 41, 48)
- **Issue:** Lucide `Home`, `ArrowLeft`, `Phone`, `Mail` icons inside labelled links/buttons without `aria-hidden="true"`.
- **Impact:** Screen readers may announce icon names before visible label text.
- **Fix:** Add `aria-hidden="true"` to each icon component.
- **Effort:** trivial

### [LOW] A11Y-010: Repeated "Learn more →" and "View Project →" links are ambiguous

- **File:** `packages/core-components/src/components/composable/service-cards.tsx` (line 100), `packages/core-components/src/components/composable/project-grid.tsx` (line 132)
- **Issue:** Multiple identically-labelled links on the same page. The `→` character is also read aloud by some screen readers.
- **Impact:** Screen reader users navigating by links cannot identify which service/project each link targets.
- **Fix:** Add `aria-label={\`Learn more about ${service.title}\`}`and wrap`→`in`<span aria-hidden="true">`.
- **Effort:** trivial

### [LOW] A11Y-011: `CTASection` subheading uses muted foreground on brand-red background — low contrast

- **File:** `packages/core-components/src/components/composable/cta-section.tsx` (line 53)
- **Issue:** When `layout.background === "brand"`, the subheading `<p>` unconditionally uses `text-surface-muted-foreground` (≈`#6b7280`). Against DJ Fox brand primary `#db0b0b`, contrast ratio is approximately 2.5:1 — below WCAG AA 4.5:1.
- **Impact:** Users with low vision cannot read the CTA subheading on any brand-background CTA section.
- **Fix:** When `bg === "brand"`, use `text-brand-on-primary` (white) for the subheading.
- **Effort:** small

### [LOW] A11Y-012: `BlogGrid` post dates rendered as `<p>` instead of `<time>`

- **File:** `packages/core-components/src/components/composable/blog-grid.tsx` (lines 118–121)
- **Issue:** Post dates are `<p data-slot="date">` elements rather than `<time dateTime={post.date}>`.
- **Impact:** Machine-readable date semantics are lost.
- **Fix:** Replace `<p data-slot="date">` with `<time dateTime={post.date} data-slot="date">`.
- **Effort:** trivial

## Statistics

- Critical: 0
- High: 4
- Medium: 4
- Low: 4
- Total: 12
