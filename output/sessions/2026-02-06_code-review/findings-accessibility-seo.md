# Accessibility & SEO Review Findings

**Reviewer:** cs-frontend-engineer
**Scope:** Accessibility and SEO review of local-business-platform monorepo, focusing on colossus-reference site, core-components package, and base-template. Examined layouts, navigation, forms, modals, images, meta tags, schema markup, and sitemaps.
**Date:** 2026-02-06

## Summary

The platform demonstrates solid SEO fundamentals with proper meta tags, schema markup, and sitemap architecture. Accessibility is partially implemented with good ARIA support on some interactive components (mobile menu, locations dropdown, lightbox) but lacks critical features like skip navigation links and has inconsistent focus management. Several SEO optimizations and accessibility improvements would strengthen compliance with WCAG 2.1 AA standards.

## Findings

### [HIGH] A11Y-001: Missing Skip Navigation Link

- **File:** `sites/colossus-reference/app/layout.tsx` (lines 168-270)
- **Issue:** No skip link exists to allow keyboard users to bypass the navigation and jump directly to main content. This is a WCAG 2.4.1 (Bypass Blocks) requirement.
- **Impact:** Keyboard-only users must tab through all navigation links on every page load, creating a frustrating experience. Screen reader users are similarly affected.
- **Fix:** Add a skip link as the first focusable element in the body:
  ```tsx
  <body>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-blue focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      Skip to main content
    </a>
    <header>...</header>
    <main id="main-content">{children}</main>
  </body>
  ```
- **Effort:** trivial

### [HIGH] A11Y-002: Main Content Lacks Landmark ID

- **File:** `sites/colossus-reference/app/layout.tsx` (line 241)
- **Issue:** The `{children}` content is rendered without a wrapping `<main>` element with an `id` attribute for skip link targeting. Some pages have their own `<main>` but this is inconsistent.
- **Impact:** Skip links cannot target main content reliably; screen readers cannot navigate to main landmark consistently.
- **Fix:** Wrap children in a `<main id="main-content">` element in the root layout:
  ```tsx
  <main id="main-content" tabIndex={-1}>
    {children}
  </main>
  ```
- **Effort:** trivial

### [HIGH] A11Y-003: Mobile Menu Missing Focus Trap

- **File:** `sites/colossus-reference/components/ui/mobile-menu.tsx` (lines 35-179)
- **Issue:** While the mobile menu has proper ARIA attributes (`aria-expanded`, `aria-label`), it does not trap focus within the overlay when open. Users can tab outside the menu to hidden elements.
- **Impact:** Keyboard users may lose focus context and interact with invisible elements behind the overlay.
- **Fix:** Implement focus trap using a library like `focus-trap-react` or custom solution that cycles focus between first and last focusable elements within the menu overlay.
- **Effort:** small

### [MEDIUM] A11Y-004: Locations Dropdown Missing ARIA Role

- **File:** `sites/colossus-reference/components/ui/locations-dropdown.tsx` (lines 41-145)
- **Issue:** The dropdown uses `aria-expanded` and `aria-haspopup="true"` but the dropdown menu itself lacks `role="menu"` and items lack `role="menuitem"`. The current implementation uses generic `<div>` and `<ul>` elements.
- **Impact:** Screen readers may not properly announce this as a menu component, reducing navigation clarity.
- **Fix:** Add `role="menu"` to the dropdown container and `role="menuitem"` to each link, or use `role="listbox"` pattern depending on interaction model.
- **Effort:** small

### [MEDIUM] A11Y-005: Consent Manager Modal Missing Focus Trap

- **File:** `sites/colossus-reference/components/analytics/ConsentManager.tsx` (lines 346-490)
- **Issue:** The customize preferences modal does not trap focus. While it has proper ARIA attributes and keyboard handling (Escape to close), focus can escape to elements behind the modal backdrop.
- **Impact:** Users may inadvertently interact with page content while the modal is open, leading to confusion.
- **Fix:** Implement focus trap within the modal container when `showCustomize` is true.
- **Effort:** small

### [MEDIUM] A11Y-006: Form Validation Errors Not Announced to Screen Readers

- **File:** `sites/colossus-reference/app/contact/page.tsx` (lines 221-412)
- **Issue:** Form validation errors are displayed visually but lack `role="alert"` or `aria-live="assertive"` to announce errors to screen reader users. Inputs also missing `aria-describedby` linking to error messages.
- **Impact:** Screen reader users may not be aware that validation errors occurred or what fields need correction.
- **Fix:** Add `role="alert"` to error messages and `aria-describedby` to inputs:
  ```tsx
  <input
    id="name"
    aria-describedby={errors.name ? "name-error" : undefined}
    aria-invalid={!!errors.name}
  />;
  {
    errors.name && (
      <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
        {errors.name}
      </p>
    );
  }
  ```
- **Effort:** small

### [MEDIUM] A11Y-007: FAQ Section Not Using Proper Accordion Semantics

- **File:** `sites/colossus-reference/components/ui/service-faq.tsx` (lines 1-61)
- **Issue:** FAQ items are rendered as static content without expandable/collapsible behavior. While semantically valid as static Q&A, the design suggests interactive accordion pattern but lacks keyboard interaction.
- **Impact:** Limited but if users expect interactive behavior, they cannot expand/collapse with keyboard.
- **Fix:** Either keep as static (current behavior is accessible but add note in design) or implement proper accordion with `aria-expanded`, button triggers, and keyboard support.
- **Effort:** medium (if making interactive)

### [LOW] A11Y-008: Decorative SVG Icons Missing aria-hidden

- **File:** Multiple files including `sites/colossus-reference/components/ui/service-hero.tsx` (lines 57-63, 75-85)
- **Issue:** Decorative SVG icons (phone icons, check badges) lack `aria-hidden="true"` to hide them from screen readers. While not critical, it adds unnecessary announcements.
- **Impact:** Screen readers may announce "graphic" or attempt to describe these decorative elements.
- **Fix:** Add `aria-hidden="true"` to all decorative SVGs that convey no unique information:
  ```tsx
  <svg aria-hidden="true" className="h-5 w-5" ...>
  ```
- **Effort:** trivial

### [LOW] A11Y-009: Footer Links Missing Descriptive Context

- **File:** `sites/colossus-reference/components/ui/footer.tsx` (lines 98-155)
- **Issue:** Footer navigation sections have heading elements (`h3`, `h4`) but links themselves are generic without additional context for screen reader users navigating out of context.
- **Impact:** Minor - when navigating links list, users may not understand context without section headings.
- **Fix:** Consider adding `aria-label` to navigation sections or visually hidden context to links.
- **Effort:** trivial

---

### [HIGH] SEO-001: Blog and Projects Sitemaps Not Registered

- **File:** `sites/colossus-reference/app/sitemap-index.xml/route.ts` (line 26)
- **Issue:** The sitemap index only registers `/sitemap.xml`, `/services/sitemap.xml`, and `/locations/sitemap.xml`. Blog and projects sections exist but have no dedicated sitemaps or registration.
- **Impact:** Blog posts and project case studies may not be indexed efficiently by search engines, reducing organic traffic to valuable content.
- **Fix:** Create `app/blog/sitemap.ts` and `app/projects/sitemap.ts`, then add to SITEMAP_PATHS array:
  ```typescript
  const SITEMAP_PATHS = [
    "/sitemap.xml",
    "/services/sitemap.xml",
    "/locations/sitemap.xml",
    "/blog/sitemap.xml",
    "/projects/sitemap.xml",
  ];
  ```
- **Effort:** small

### [MEDIUM] SEO-002: Contact Page Missing Metadata Export

- **File:** `sites/colossus-reference/app/contact/page.tsx`
- **Issue:** Contact page is a client component (`"use client"`) and does not export `generateMetadata`. It relies on default metadata from layout. The page should have unique title and description.
- **Impact:** Contact page appears in search results with generic "Colossus Scaffolding" title instead of optimized "Contact Us | Get Free Quote | Colossus Scaffolding".
- **Fix:** Create a separate server component wrapper or use `metadata` constant in a layout.tsx for the contact route. Alternatively, refactor to RSC if possible.
- **Effort:** small

### [MEDIUM] SEO-003: Location Pages Missing LocalBusiness Schema When No schema.service Defined

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 375-396)
- **Issue:** Location pages only render the Schema component if `locationData.schema?.service` exists. If MDX frontmatter lacks this, no LocalBusiness schema is generated. However, the ServiceArea schema is always rendered (line 390), which partially addresses this.
- **Impact:** Minor - ServiceArea schema provides coverage but full LocalBusiness schema with all properties (hours, credentials) would be more valuable for local SEO.
- **Fix:** Ensure all location MDX files have schema.service defined, or generate default schema from locationData if missing.
- **Effort:** small

### [MEDIUM] SEO-004: Reviews/Testimonials Page Missing Schema

- **File:** `sites/colossus-reference/app/reviews/page.tsx`
- **Issue:** The reviews page displays testimonials but does not include Review schema or AggregateRating schema markup. This is a missed opportunity for rich results.
- **Impact:** Reviews won't display star ratings in Google search results, reducing click-through rate.
- **Fix:** Add Review schema for individual testimonials and AggregateRating schema. Use the Schema component's `reviews` and `aggregateRating` props.
- **Effort:** small

### [LOW] SEO-005: Hero Images Missing title Attribute on Location Pages

- **File:** `sites/colossus-reference/components/ui/hero-section.tsx` (lines 87-96)
- **Issue:** The hero section Image component has a generic alt text but no `title` attribute for additional SEO value. Service hero does include title (line 97).
- **Impact:** Minor SEO benefit missed. Title attribute provides hover text and additional context.
- **Fix:** Add `title` attribute:
  ```tsx
  <Image src={getImageUrl(heroImage)} alt="..." title={`${title} - Colossus Scaffolding`} />
  ```
- **Effort:** trivial

### [LOW] SEO-006: Service Cards Image Alt Text Uses Generic Pattern

- **File:** `sites/colossus-reference/components/ui/service-cards.tsx` (line 73)
- **Issue:** Alt text pattern is `${card.title} scaffolding services - professional installation by Colossus Scaffolding`. While descriptive, it doesn't vary for location-specific services.
- **Impact:** Minor - alt text is acceptable but could be more contextually relevant.
- **Fix:** Accept an optional `locationName` prop to include in alt text for location-specific pages.
- **Effort:** trivial

### [LOW] SEO-007: OpenGraph Images Using Static Logo Instead of Hero Images

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 185-194)
- **Issue:** Location page metadata uses `/static/logo.png` for OpenGraph images instead of the actual heroImage from frontmatter.
- **Impact:** Social shares display generic logo instead of relevant location imagery, reducing engagement.
- **Fix:** Use `getImageUrl(locationData.heroImage)` when available:
  ```typescript
  images: locationData.heroImage
    ? [{ url: getImageUrl(locationData.heroImage), ... }]
    : [{ url: absUrl("/static/logo.png"), ... }]
  ```
- **Effort:** trivial

### [LOW] SEO-008: Canonical URLs Not Set on All Pages

- **File:** `sites/colossus-reference/app/about/page.tsx`, `sites/colossus-reference/app/privacy-policy/page.tsx`, `sites/colossus-reference/app/cookie-policy/page.tsx`
- **Issue:** Static pages like About, Privacy Policy, and Cookie Policy may be missing explicit canonical URL configuration in their metadata exports.
- **Impact:** Search engines may not properly consolidate page authority if accessed via different URLs.
- **Fix:** Verify and add `alternates.canonical` to all page metadata exports.
- **Effort:** trivial

---

## Statistics

| Severity  | Count  |
| --------- | ------ |
| Critical  | 0      |
| High      | 4      |
| Medium    | 6      |
| Low       | 7      |
| **Total** | **17** |

## Recommendations Priority

### Immediate (This Sprint)

1. A11Y-001: Add skip navigation link
2. A11Y-002: Add main content landmark
3. SEO-001: Create blog and projects sitemaps

### Next Sprint

4. A11Y-003: Implement mobile menu focus trap
5. A11Y-006: Add form validation announcements
6. SEO-002: Add contact page metadata
7. SEO-004: Add reviews schema

### Backlog

- Remaining low-severity items
- Consider accessibility audit with automated tools (axe-core)
- Test with actual screen readers (VoiceOver, NVDA)
