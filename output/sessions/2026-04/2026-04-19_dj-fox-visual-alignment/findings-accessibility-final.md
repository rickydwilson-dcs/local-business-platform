# Accessibility Audit Findings

**Reviewer:** cs-frontend-engineer (accessibility mode)
**Scope:** / /about /contact /services /services/emergency-electrical-callout /locations /locations/eastbourne /reviews /projects /blog /pricing
**Date:** 2026-04-19

---

## Findings

### [HIGH] A11Y-001: FAQSection `<details>/<summary>` open state not reliably announced to screen readers

- **File:** `packages/core-components/src/components/composable/faq-section.tsx` (lines 58–73)
- **Issue:** FAQ items use native `<details>/<summary>`. The default disclosure triangle is suppressed via `list-none [&::-webkit-details-marker]:hidden`. The visual open/closed indicator is a `+` `<span aria-hidden="true">` that rotates on open. Native `<details>` state exposure is browser/AT-dependent — Safari VoiceOver does not reliably announce open/closed state, and stripping the marker removes the only native cue. The `<summary>` has no `aria-expanded` attribute.
- **Impact:** Screen reader users on Safari/VoiceOver may not know whether an FAQ item is expanded or collapsed. Affects /contact, /services/[slug] (all service detail pages), and /pricing.
- **Fix:** Replace `<details>/<summary>` with a button-driven accordion: `<button aria-expanded={isOpen} aria-controls={answerId}>` with a controlled `<div id={answerId} hidden={!isOpen}>` for the answer. This is unambiguously correct across all AT. Alternatively add `aria-expanded` directly to `<summary>` via a React controlled pattern and keep the `<details>` element.
- **Effort:** medium

---

### [HIGH] A11Y-002: `WhyChooseUsSection` eyebrow uses `text-brand-primary` (#db0b0b) on dark inverse background — fails WCAG AA contrast for small text

- **File:** `packages/core-components/src/components/composable/why-choose-us-section.tsx` (line 60)
- **Issue:** The eyebrow `<p>` unconditionally applies `text-brand-primary` regardless of background. The component defaults to `bg-surface-inverse` (`#1f2937`) when no background is specified, which is how the home page renders it. Brand-primary is `#db0b0b` (red). Contrast ratio of `#db0b0b` on `#1f2937` is approximately 3.4:1 — below the WCAG AA threshold of 4.5:1 for small text (`text-sm`).
- **Impact:** Low-vision users cannot read the eyebrow label on the home page. Fails WCAG 1.4.3 (Contrast Minimum).
- **Fix:** Conditionally change the colour when the background is dark: `!layout?.background || layout?.background === "inverse" ? "text-white" : "text-brand-primary"`. `text-white` on `#1f2937` is ~16:1 — passes AAA.
- **Effort:** trivial

---

### [MEDIUM] A11Y-003: `LocationsDropdown` mega-menu rich-content indicator relies on `title` tooltip only

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 311–315)
- **Issue:** When `town.isRichContent` is true, a decorative dot `<span title="Detailed coverage" />` is rendered inline. The `title` attribute is not reliably exposed by screen readers and is not keyboard-accessible. The span has no `aria-label` and no visible text.
- **Impact:** Screen reader and keyboard-only users cannot determine which locations have detailed coverage pages.
- **Fix:** Replace `title` with an `aria-label`, or add a visually-hidden span: `<span className="sr-only"> — Detailed coverage available</span>` inside the link alongside `<span aria-hidden="true" className="... rounded-full" />`.
- **Effort:** trivial

---

### [MEDIUM] A11Y-004: `ContactSection` passes no `darkMode` prop to `ContactForm` when rendered on inverse background — form labels rendered with mismatched light-mode tokens

- **File:** `packages/core-components/src/components/composable/contact-section.tsx` (line 94)
- **Issue:** On /contact the `ContactSection` is rendered with `layout.background: "inverse"`. The section wrapper applies `bg-surface-inverse`, but `<ContactForm>` is rendered without `darkMode` so it defaults to `darkMode={false}`. The form's internal label class becomes `text-surface-foreground` (dark text) and input background `bg-surface-background` (white). The ContactForm component fully supports `darkMode` prop with corrected token classes. The mismatch means form labels may appear as near-invisible dark text on a dark background depending on the precise token values.
- **Impact:** Form labels on the contact page may have insufficient contrast. Affects /contact.
- **Fix:** In `ContactSection`, forward the background context: `<ContactForm darkMode={layout?.background === "inverse"} ... />`.
- **Effort:** small

---

### [MEDIUM] A11Y-005: `TextSection` table lacks column headers — cell relationships not programmatically determinable

- **File:** `packages/core-components/src/components/composable/text-section.tsx` (lines 121–135)
- **Issue:** The `"table"` block type renders a `<table>` with `<tbody>` only. Row headers use `<th scope="row">` correctly, but there are no `<th scope="col">` column headers. The value `<td>` has no programmatic association to a column header. Screen readers cannot announce what the value column represents (WCAG 1.3.1).
- **Impact:** Screen reader users navigating table cells non-linearly cannot determine the column context for value cells. Affects privacy/cookie policy pages using TextSection table blocks.
- **Fix:** Add `<thead><tr><th scope="col" className="sr-only">Item</th><th scope="col" className="sr-only">Detail</th></tr></thead>` above `<tbody>`. The `sr-only` class makes them invisible visually while preserving semantics.
- **Effort:** small

---

### [MEDIUM] A11Y-006: Mobile hamburger button has no visible focus indicator

- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (lines 107–110)
- **Issue:** The hamburger `<button>` has `className="lg:hidden p-2 rounded-md transition-colors ${hoverBg}"` with no `focus:ring-*` classes. The `.mobile-menu-toggle` utility class in `orion/globals.css` (line 327) does include `focus:ring-2 focus:ring-brand-primary`, but the `MobileMenu` component does not use that class — it uses its own inline Tailwind, omitting the focus ring.
- **Impact:** Keyboard and switch-access users cannot see focus on the hamburger button. Affects all pages at mobile viewport widths. Fails WCAG 2.4.7 (Focus Visible).
- **Fix:** Add `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2` to the hamburger button's className.
- **Effort:** trivial

---

### [MEDIUM] A11Y-007: `ImageGridSection` "View More →" arrow not hidden from assistive technology

- **File:** `packages/core-components/src/components/composable/image-grid-section.tsx` (line 88)
- **Issue:** The raw Unicode arrow `→` is rendered in a `<span>` with no `aria-hidden="true"`. Screen readers will announce it as a character name (e.g. "rightwards arrow"). The codebase already applies `<span aria-hidden="true">→</span>` in `ProjectGrid` (line 133) and `ServiceListSection` (line 93) — this file is inconsistent.
- **Impact:** Screen reader users hear redundant/confusing punctuation in card text. Affects /projects page and any ImageGridSection usage.
- **Fix:** Change to `<span data-slot="arrow" aria-hidden="true" className="mt-2 text-sm text-white/80">View More →</span>`.
- **Effort:** trivial

---

### [MEDIUM] A11Y-008: `CategoryCardsSection` nested `<section>` elements have no accessible names — unlabelled landmark regions

- **File:** `packages/core-components/src/components/composable/category-cards-section.tsx` (lines 32–55)
- **Issue:** The outer `<section>` and each inner `<section>` (one per category group) have no `aria-label` or `aria-labelledby`. ARIA landmark best practice requires that multiple `<section>` landmarks on a page each have a unique accessible name so AT users can distinguish them in landmark navigation (WCAG 1.3.6). The inner sections each contain an `<h2>`, but the association is not programmatic.
- **Impact:** Screen reader users navigating by landmarks hear repeated unlabelled "section" regions. Affects /services page.
- **Fix:** Assign a unique `id` to each inner `<h2>` (e.g. `id={`category-${i}`}`) and add `aria-labelledby={`category-${i}`}` to the corresponding `<section>`. Change the outer wrapper from `<section>` to `<div>` since it is a layout container, not a content landmark.
- **Effort:** small

---

### [LOW] A11Y-009: `StatsStrip` stat values and labels are adjacent paragraphs with no programmatic association

- **File:** `packages/core-components/src/components/composable/stats-strip.tsx` (lines 58–69)
- **Issue:** Each stat renders a `<p>` for the value and a sibling `<p>` for the label — two independent paragraphs. A user navigating by paragraph may encounter "15+" without its label "Years Experience" in the same read unit. The same issue appears in `ProjectGrid` stats (lines 82–87).
- **Impact:** Minor — linear reading order usually preserves context, but non-linear navigation breaks the association. Partial failure of WCAG 1.3.1.
- **Fix:** Wrap each stat in `<dl>` with `<dd>` for the value and `<dt>` for the label, or add an `aria-label` to the value `<p>`: `aria-label={stat.label ? `${stat.value} ${stat.label}` : undefined}`.
- **Effort:** small

---

### [LOW] A11Y-010: `BlogGrid` post images use post title as `alt` — identical text repeated in adjacent heading link

- **File:** `packages/core-components/src/components/composable/blog-grid.tsx` (line 103)
- **Issue:** `<Image alt={post.title}>` uses the post title verbatim. The same title is immediately rendered as `<h3><Link href="/blog/[slug]">{post.title}</Link></h3>` below the image. Screen readers announce the image alt and then the link text — both identical — resulting in doubled content.
- **Impact:** Minor redundancy for screen reader users. Affects /blog and any BlogGrid usage.
- **Fix:** Set `alt=""` so the image is treated as decorative relative to the adjacent heading link. The link provides all necessary context.
- **Effort:** trivial

---

### [LOW] A11Y-011: `SiteHeader` logo link accessible name does not indicate it is a "Home" link

- **File:** `packages/core-components/src/components/ui/site-header.tsx` (lines 111–124)
- **Issue:** The logo `<Link href="/">` contains only `<Image alt={siteName}>`. The accessible name is the site name alone ("D J Fox Electrical"), not indicating its destination. WCAG 2.4.4 (Link Purpose) is technically satisfied since the link goes to the home page and the name is recognisable, but best practice is to include "Home" in the accessible name to distinguish it from other mentions of the site name on the page (e.g. footer `<h2>`).
- **Impact:** Very minor. Screen reader users who open the links list may not immediately identify this as the home navigation link.
- **Fix:** Add `<span className="sr-only"> — Home</span>` inside the `<Link>` after `<Image>`.
- **Effort:** trivial

---

### [LOW] A11Y-012: `OrionFooter` contact info block should use `<address>` element

- **File:** `packages/themes/orion/components/footer.tsx` (lines 130–155)
- **Issue:** The Contact Info column renders phone, email, and physical address in generic `<div>` wrappers. HTML `<address>` is the semantically correct element for contact information associated with the page's organisation. `ContactSection`'s sidebar already correctly uses `<address className="not-italic">` (contact-section.tsx line 137) — the footer is inconsistent.
- **Impact:** Minor semantic gap. No AT barrier, but reduces semantic richness for screen readers and structured-data parsers.
- **Fix:** Wrap the contact details block in `<address className="not-italic space-y-3 ...">`.
- **Effort:** trivial

---

### [LOW] A11Y-013: Decorative emoji icons in `FeatureGrid`, `ServiceCards`, and `PricingTable` not hidden from assistive technology

- **File:** `packages/core-components/src/components/composable/feature-grid.tsx` (line 73); `service-cards.tsx` (line 81); `pricing-table.tsx` (line 73)
- **Issue:** When `feature.icon` / `service.icon` / `item.icon` is an emoji string, it is rendered as raw text content without `aria-hidden="true"` on the containing `<div>`. Screen readers announce emoji characters by their Unicode name (e.g. ⚡ = "high voltage sign", 🔧 = "wrench"). Since the title immediately below provides all context, the emoji is decorative.
- **Impact:** Screen reader users hear redundant emoji descriptions before each feature/service/pricing title. Affects /services, /pricing, /about, /locations pages.
- **Fix:** Add `aria-hidden="true"` to the icon wrapper `<div>` in all three components.
- **Effort:** trivial

---

## Statistics

- Critical: 0
- High: 2
- Medium: 6
- Low: 5
- Total: 13
