# Accessibility & SEO Review Findings

**Reviewer:** cs-frontend-engineer
**Scope:** Full accessibility and SEO audit of all three sites (colossus-reference, smiths-electrical-cambridge, base-template) including root layouts, all page components, navigation (desktop dropdown + mobile menu), forms, modals (lightbox, consent manager), schema markup, sitemaps, robots configuration, theme color tokens, MDX content structure, and image alt text across core-components and site-specific components.
**Date:** 2026-02-06

## Summary

The platform demonstrates strong SEO foundations -- structured data via a reusable Schema component, modular sitemaps with a sitemap index, canonical URLs, and OpenGraph metadata are well-implemented across the colossus-reference site. Accessibility has significant gaps that constitute WCAG 2.1 AA failures: no skip navigation links exist on any site, the root layout lacks a `<main>` landmark, decorative SVGs throughout the entire codebase lack `aria-hidden` attributes, the mobile menu has no focus trap, the locations dropdown is missing keyboard navigation beyond Escape, form error messages are not announced to screen readers, and the consent banner blocks the page visually but not for keyboard users. The smiths-electrical-cambridge site additionally lacks structured data on its homepage and uses a less specific `lang` attribute. SEO issues include multiple page titles exceeding the 60-character limit, blog/projects content missing from sitemaps, and relative OpenGraph URLs on some pages.

## Findings

### [CRITICAL] A11Y-001: No Skip Navigation Link on Any Site

- **File:** `sites/colossus-reference/app/layout.tsx` (lines 168-270)
- **File:** `sites/smiths-electrical-cambridge/app/layout.tsx` (lines 41-137)
- **File:** `sites/base-template/app/layout.tsx`
- **Issue:** No skip-to-content link exists in any site's root layout. Keyboard-only users must tab through the entire header navigation (logo, nav links, locations dropdown with potentially dozens of links, phone number, CTA button) on every page before reaching main content.
- **Impact:** WCAG 2.1 SC 2.4.1 (Bypass Blocks) failure. Keyboard-only users face excessive tabbing on every page load. This is one of the most commonly tested accessibility requirements and a frequent audit failure point.
- **Fix:** Add a visually-hidden skip link as the first child of `<body>` in each layout:
  ```tsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-blue focus:text-white focus:px-4 focus:py-2 focus:rounded"
  >
    Skip to main content
  </a>
  ```
  Then add `id="main-content"` to the `<main>` element. The colossus-reference layout currently wraps children directly without a `<main>` tag (line 241: `{children}`), so a `<main id="main-content">` wrapper is also needed (see A11Y-002).
- **Effort:** trivial

### [CRITICAL] A11Y-002: Missing `<main>` Landmark in Colossus Reference Root Layout

- **File:** `sites/colossus-reference/app/layout.tsx` (line 241)
- **Issue:** The root layout renders `{children}` directly between `<header>` and `<Footer>` without wrapping it in a `<main>` landmark element. The inline critical CSS defines `main { width: 100%; }` (lines 163-165), suggesting a `<main>` was intended, but the actual HTML tag is not present. Some individual pages add their own `<main>` (e.g., `services/[slug]/page.tsx` line 288, `services/page.tsx` line 45) creating inconsistency -- some pages have the landmark, others do not. Nested `<main>` elements would also be invalid HTML when both the layout and page include one.
- **Impact:** Screen reader users cannot quickly navigate to the main content region using landmark navigation. This is a WCAG 2.1 SC 1.3.1 (Info and Relationships) and SC 2.4.1 (Bypass Blocks) failure. Landmark navigation is one of the primary ways screen reader users orient themselves on a page.
- **Fix:** Wrap `{children}` in `<main id="main-content">` in the root layout. Remove `<main>` from individual page components that add their own (services/page.tsx, blog/page.tsx, services/[slug]/page.tsx) to avoid invalid nested `<main>` elements.
- **Effort:** small

### [HIGH] A11Y-003: Mobile Menu Overlay Has No Focus Trap

- **File:** `sites/colossus-reference/components/ui/mobile-menu.tsx` (lines 35-179)
- **File:** `sites/smiths-electrical-cambridge/components/ui/mobile-menu.tsx` (lines 57-206)
- **Issue:** When the mobile menu overlay opens, it covers the entire screen and prevents body scroll, but focus is not trapped within the overlay. A keyboard user can Tab past the visible menu items and reach hidden elements behind the overlay. The colossus-reference mobile menu also does not move focus to the close button or first menu item when it opens -- focus stays on the hamburger button, which is now visually hidden behind the full-screen overlay.
- **Impact:** WCAG 2.1 SC 2.4.3 (Focus Order) failure. Keyboard users can tab into invisible content behind the overlay. The smiths-electrical-cambridge version partially addresses this (it locks body scroll and handles Escape), but still lacks a focus trap.
- **Fix:** Implement a focus trap that:
  1. Moves focus to the close button or first menu item when the menu opens
  2. Traps Tab/Shift+Tab cycling within the overlay
  3. Returns focus to the hamburger button when the menu closes
     Use a library like `focus-trap-react` or implement manually with first/last focusable element boundary detection.
- **Effort:** medium

### [HIGH] A11Y-004: Locations Dropdown Missing `role` and Keyboard Navigation

- **File:** `sites/colossus-reference/components/ui/locations-dropdown.tsx` (lines 41-145)
- **Issue:** The dropdown button correctly has `aria-expanded` and `aria-haspopup="true"`, and Escape key closes it. However, the dropdown panel itself lacks `role="menu"` or `role="region"`, items lack `role="menuitem"`, and there is no Arrow key navigation between menu items. Tab moves focus linearly through all links rather than allowing arrow-key traversal. The dropdown also does not return focus to the trigger button when closed via Escape or outside click.
- **Impact:** WCAG 2.1 SC 4.1.2 (Name, Role, Value) partial failure. Screen readers will not announce the dropdown as a navigational region. The lack of arrow-key navigation does not match the ARIA Authoring Practices for disclosure/menu patterns.
- **Fix:** At minimum, add `role="navigation"` with `aria-label="Location navigation"` to the dropdown panel. For a full menu pattern, add `role="menu"` to the container, `role="menuitem"` to each link, and implement ArrowDown/ArrowUp navigation. Also store a ref to the trigger button and call `.focus()` when the dropdown closes programmatically.
- **Effort:** medium

### [HIGH] A11Y-005: Decorative SVG Icons Missing `aria-hidden="true"` Across All Pages

- **File:** `sites/colossus-reference/app/page.tsx` (multiple SVGs, lines 141-228)
- **File:** `sites/colossus-reference/components/ui/hero-section.tsx` (lines 44-78)
- **File:** `sites/colossus-reference/components/ui/service-hero.tsx` (lines 57-88)
- **File:** `sites/colossus-reference/components/ui/service-faq.tsx` (line 47)
- **File:** `sites/colossus-reference/components/ui/location-faq.tsx` (line 62)
- **File:** `sites/colossus-reference/app/about/page.tsx` (all value/stat/icon SVGs)
- **File:** `sites/colossus-reference/app/layout.tsx` (line 226, phone icon SVG)
- **Issue:** Dozens of inline SVGs used as decorative icons (phone icons, checkmark badges, stat icons, arrow icons, shield icons) do not have `aria-hidden="true"`. Screen readers will attempt to announce these as "image" or read SVG path data, creating noise. A grep across the colossus-reference components directory found only 7 occurrences of `aria-hidden` (in breadcrumbs, coverage-map, county-gateway-cards, location components, and card-grid) -- the vast majority of SVGs are unaddressed.
- **Impact:** WCAG 2.1 SC 1.1.1 (Non-text Content). Screen reader users hear meaningless SVG announcements mixed with content. This affects virtually every page on every site.
- **Fix:** Add `aria-hidden="true"` to all decorative SVGs. For SVGs within links/buttons that have adjacent text or `aria-label`, `aria-hidden="true"` is correct. For standalone icon buttons, ensure the button has an `aria-label` instead (the mobile menu buttons already do this correctly).
- **Effort:** small (mechanical but touches many files)

### [HIGH] A11Y-006: Form Error Messages Not Announced to Screen Readers

- **File:** `sites/colossus-reference/app/contact/page.tsx` (lines 224-412)
- **Issue:** When form validation fails, error messages appear visually but:
  1. Error `<p>` elements lack `role="alert"` or `aria-live="assertive"`, so screen readers do not announce them
  2. Inputs lack `aria-invalid="true"` when they have errors
  3. Inputs lack `aria-describedby` pointing to their error message elements
  4. Required fields are indicated only by visual asterisks ("Full Name \*") without `aria-required="true"` on the inputs
  5. The success/error status messages at lines 202-219 and 390-407 also lack `role="alert"`
- **Impact:** WCAG 2.1 SC 3.3.1 (Error Identification) and SC 3.3.2 (Labels or Instructions) failure. Screen reader users cannot perceive validation errors, cannot identify which fields are required, and cannot associate error messages with specific fields.
- **Fix:** For each form field:
  1. Add `aria-required="true"` to required inputs (name, email, message)
  2. Add `aria-invalid={!!errors.fieldname}` dynamically
  3. Give each error `<p>` a stable `id` (e.g., `id="name-error"`)
  4. Add `aria-describedby="name-error"` to the input (conditionally when error exists)
  5. Add `role="alert"` to error message containers and success/error status divs
- **Effort:** small

### [HIGH] A11Y-007: Consent Banner Lacks Focus Management, Trap, and Dialog Role

- **File:** `sites/colossus-reference/components/analytics/ConsentManager.tsx` (lines 269-491)
- **Issue:** The consent banner appears as a fixed overlay with a backdrop that blocks visual interaction (line 272: `<div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40" />`). However:
  1. Focus is not moved to the banner when it appears -- it stays wherever it was on the page
  2. There is no focus trap -- keyboard users can Tab behind the backdrop to invisible elements
  3. The customize modal (line 346) similarly lacks a focus trap
  4. Neither the banner nor the customize modal can be dismissed with Escape
  5. The banner container has no `role="dialog"` or `aria-modal="true"` attribute
  6. The customize modal overlay also lacks these ARIA attributes
- **Impact:** WCAG 2.1 SC 2.4.3 (Focus Order) and SC 2.1.2 (No Keyboard Trap -- paradoxically, the issue here is that the modal does NOT trap focus when it should). Keyboard users can navigate behind the visually blocking overlay.
- **Fix:**
  1. Add `role="dialog"` and `aria-modal="true"` and `aria-labelledby` to both the banner and customize modal containers
  2. Implement focus trap on open for both
  3. Move focus to the first actionable element when each opens
  4. Add Escape key handler to dismiss
  5. Return focus to the previous element when dismissed
- **Effort:** medium

### [HIGH] SEO-001: Blog and Projects Sitemaps Missing from Colossus Sitemap Index

- **File:** `sites/colossus-reference/app/sitemap-index.xml/route.ts` (line 26)
- **Issue:** The sitemap index explicitly lists only three sitemaps: `/sitemap.xml`, `/services/sitemap.xml`, and `/locations/sitemap.xml`. The site has a blog section (`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`) and a projects section (`app/projects/page.tsx`, `app/projects/[slug]/page.tsx`), but neither has a dedicated sitemap, and neither is included in the sitemap index. The core `app/sitemap.ts` also does not include blog, projects, or reviews pages.
- **Impact:** Blog posts, project case studies, and the reviews page are not included in any sitemap, reducing their crawl priority and discovery by search engines. This directly undermines the SEO value of content marketing efforts.
- **Fix:** Create `app/blog/sitemap.ts` and `app/projects/sitemap.ts` following the existing pattern from `app/services/sitemap.ts`. Add the reviews page to `app/sitemap.ts`. Then add `/blog/sitemap.xml` and `/projects/sitemap.xml` to the `SITEMAP_PATHS` array.
- **Effort:** small

### [HIGH] SEO-002: Multiple Page Titles Exceed 60-Character Limit

- **File:** `sites/colossus-reference/app/about/page.tsx` (line 11) -- 82 chars: "About Colossus Scaffolding | Professional Scaffolding Specialists South East UK"
- **File:** `sites/colossus-reference/app/contact/layout.tsx` (line 5) -- 65 chars: "Contact Colossus Scaffolding | Free Quotes & Professional Service"
- **File:** `sites/colossus-reference/app/locations/page.tsx` (line 17) -- 72 chars: "Professional Scaffolding Across South East England | 30+ Towns Covered"
- **Issue:** Three pages have titles exceeding the 60-character SEO standard from `docs/standards/seo.md`. Google will truncate these titles in search results, potentially cutting off important information.
- **Impact:** Truncated titles in SERPs reduce click-through rates and may lose key selling points. The standard explicitly states "Page title < 60 characters".
- **Fix:** Shorten titles:
  - About: "About Colossus Scaffolding | South East Specialists" (52 chars)
  - Contact: "Contact Colossus Scaffolding | Free Quotes" (43 chars)
  - Locations: "Scaffolding Across South East | 30+ Towns" (42 chars)
- **Effort:** trivial

### [MEDIUM] A11Y-008: smiths-electrical-cambridge Uses `lang="en"` Instead of `lang="en-GB"`

- **File:** `sites/smiths-electrical-cambridge/app/layout.tsx` (line 42)
- **Issue:** The `<html>` element uses `lang="en"` while colossus-reference correctly uses `lang="en-GB"` (line 169). Since all sites in this platform target UK audiences, the language should specify the British English variant for correct screen reader pronunciation.
- **Impact:** Screen readers may use American English pronunciation rules for British English content. The base-template should also be checked for consistency.
- **Fix:** Change `lang="en"` to `lang="en-GB"` in smiths-electrical-cambridge and base-template layouts.
- **Effort:** trivial

### [MEDIUM] A11Y-009: Consent Manager Toggle Switches Lack Accessible Labels

- **File:** `sites/colossus-reference/components/analytics/ConsentManager.tsx` (lines 401-435)
- **Issue:** The cookie preference toggle switches use `<label>` elements wrapping invisible `<input type="checkbox">` elements, but the labels contain no text content or `aria-label`. The visual toggle `<div>` is purely decorative. Screen readers will announce these as unlabeled checkboxes. The category title (e.g., "Analytics Cookies") is a sibling `<h3>` element not programmatically associated with the input.
- **Impact:** WCAG 2.1 SC 1.3.1 (Info and Relationships) and SC 4.1.2 (Name, Role, Value). Screen reader users cannot determine what each toggle controls.
- **Fix:** Add `aria-label={category.title}` to each `<input type="checkbox">` element. Alternatively, add an `id` to the `<h3>` and use `aria-labelledby` on the input.
- **Effort:** trivial

### [MEDIUM] A11Y-010: Hero Section Image Alt Text Is Static, Not Context-Aware

- **File:** `sites/colossus-reference/components/ui/hero-section.tsx` (line 90)
- **Issue:** The hero image uses a hardcoded alt text: `"Professional scaffolding installation by Colossus Scaffolding showing safe access solutions with TG20:21 compliant design"`. This same alt text appears regardless of which page the hero is rendered on (home page, Brighton location page, Canterbury location page). Location pages pass different hero images for different locations, but the alt text never reflects the location context. The `service-hero.tsx` component (line 96) does a better job by interpolating the service title into the alt text.
- **Impact:** WCAG 2.1 SC 1.1.1 (Non-text Content) -- alt text should describe the image or its purpose in context. Repeated identical alt text across dozens of pages also provides no SEO differentiation.
- **Fix:** Accept an `altText` prop on `HeroSection` or generate the alt text dynamically from the `title` prop: `alt={\`Professional scaffolding services - ${title}\`}`. Update location MDX frontmatter to optionally include `heroAlt` for custom descriptions.
- **Effort:** small

### [MEDIUM] A11Y-011: Blog Post Card Images Use Title as Alt Text

- **File:** `sites/colossus-reference/app/blog/page.tsx` (line 52)
- **Issue:** Blog card images use `alt={post.title}` which just repeats the post title that is visible immediately below the image. This provides no additional information about what the image depicts. The SEO standard at `docs/standards/seo.md` explicitly calls out `<Image alt={title} ... />` as wrong under "Image SEO > Alt Text Requirements".
- **Impact:** Missed SEO opportunity and screen readers just repeat the title text that's already announced via the heading below.
- **Fix:** Add a `heroAlt` or `imageAlt` field to the blog post MDX frontmatter schema and use that for alt text. Fall back to a generated descriptive alt like `"Featured image for: ${post.title}"` if no custom alt is provided.
- **Effort:** small

### [MEDIUM] SEO-003: Colossus Reference Root Layout Default Meta Description Is Too Short

- **File:** `sites/colossus-reference/app/layout.tsx` (line 28)
- **Issue:** The default meta description is `"Professional scaffolding services across the South East."` which is only 55 characters. The SEO standard requires descriptions of 150-160 characters. This is the fallback description for any page that doesn't define its own via `generateMetadata`.
- **Impact:** Any page relying on the default template metadata (e.g., policy pages) will have an extremely short description in SERPs, leaving valuable space unused.
- **Fix:** Expand to 150-160 characters: `"Professional scaffolding services across South East England. TG20:21 compliant, CISRS qualified teams with over 15 years experience. Free quotes available."` (158 characters).
- **Effort:** trivial

### [MEDIUM] SEO-004: smiths-electrical-cambridge Homepage Missing All Structured Data

- **File:** `sites/smiths-electrical-cambridge/app/page.tsx` (lines 1-176)
- **Issue:** The homepage has no JSON-LD structured data -- no LocalBusiness schema, no BreadcrumbList, no WebSite schema. Compare with colossus-reference homepage which includes all three. The `Schema.tsx` component exists in the site but is not used on the homepage.
- **Impact:** The schema standard (`docs/standards/schema.md`) requires BreadcrumbList on all pages and Service/LocalBusiness on relevant pages. Missing structured data means no rich snippets in search results for this site's most important page.
- **Fix:** Add LocalBusiness, WebSite, and BreadcrumbList schemas to the homepage, following the colossus-reference pattern. Use the site's `siteConfig` to populate business details dynamically.
- **Effort:** small

### [MEDIUM] SEO-005: smiths-electrical-cambridge Homepage Missing Page-Specific Metadata

- **File:** `sites/smiths-electrical-cambridge/app/page.tsx`
- **Issue:** The homepage has no page-specific `metadata` export or `generateMetadata` function. It relies entirely on the root layout's default metadata (`siteConfig.name` as title, `siteConfig.tagline` as description). There is no OpenGraph configuration, no Twitter card, no canonical URL, and no keywords for the homepage specifically.
- **Impact:** The homepage is the most important page for SEO. Missing OG tags means poor social sharing appearance. Missing canonical URL risks duplicate content issues.
- **Fix:** Add an explicit `metadata` export with full OpenGraph, Twitter, canonical, and keyword configuration matching the pattern in colossus-reference's `app/page.tsx`.
- **Effort:** small

### [MEDIUM] SEO-006: Hardcoded Phone Number in FAQ Components Breaks White-Label

- **File:** `sites/colossus-reference/components/ui/service-faq.tsx` (line 46)
- **File:** `sites/colossus-reference/components/ui/location-faq.tsx` (line 61)
- **Issue:** Both FAQ components hardcode the phone number `01424466661` in `tel:` links and `01424 466661` in display text instead of using the centralized `PHONE_TEL` / `PHONE_DISPLAY` constants from `@/lib/contact-info`. When these components are used as patterns for other sites, the wrong phone number will appear.
- **Impact:** Inconsistent NAP (Name, Address, Phone) data across the site is an SEO negative signal. For the white-label platform, this is a functional defect that would propagate to new sites.
- **Fix:** Import `PHONE_TEL` and `PHONE_DISPLAY` from `@/lib/contact-info` and use them instead of hardcoded values. Or accept phone number as a component prop.
- **Effort:** trivial

### [MEDIUM] SEO-007: Services and Blog Index Pages Have Relative OpenGraph URLs

- **File:** `sites/colossus-reference/app/services/page.tsx` (line 27)
- **File:** `sites/colossus-reference/app/blog/page.tsx` (line 28)
- **Issue:** OpenGraph URLs are set to relative paths (`url: "/services"` and `url: "/blog"`) rather than absolute URLs via `absUrl()`. The OpenGraph protocol specification requires absolute URLs. Other pages in the same site correctly use `absUrl()` for their OpenGraph metadata.
- **Impact:** Social media crawlers may not correctly resolve the page URL, potentially causing incorrect canonical URLs in social shares.
- **Fix:** Change `url: "/services"` to `url: absUrl("/services")` and `url: "/blog"` to `url: absUrl("/blog")`. Import `absUrl` from `@/lib/site`.
- **Effort:** trivial

### [LOW] A11Y-012: Critical CSS Removes Focus Outline on Primary Buttons

- **File:** `sites/colossus-reference/app/layout.tsx` (lines 144-147)
- **Issue:** The inline critical CSS defines `.btn-primary:focus { outline: none; ... }` with a box-shadow as a replacement focus indicator. While the box-shadow provides visibility, `outline: none` removes the browser's default focus ring. The Tailwind classes in `globals.css` use the more robust `focus:ring-2 focus:ring-brand-blue focus:ring-offset-2` pattern.
- **Impact:** Potential WCAG 2.1 SC 2.4.7 (Focus Visible) risk if the box-shadow CSS fails to apply. The Tailwind styles likely override the critical CSS anyway, but `outline: none` in any CSS rule is a fragile pattern.
- **Fix:** Remove `outline: none` from the critical CSS or change to `outline: 2px solid transparent; outline-offset: 2px;` to maintain smooth transitions while preserving the fallback.
- **Effort:** trivial

### [LOW] A11Y-013: LocationsDropdown Does Not Return Focus After Closing

- **File:** `sites/colossus-reference/components/ui/locations-dropdown.tsx` (lines 41-145)
- **Issue:** When the dropdown closes via Escape or clicking outside, focus is not explicitly returned to the trigger button. The Escape handler calls `setIsOpen(false)` but does not call `buttonRef.focus()`. When clicking a link, page navigation handles focus, but for non-navigating closures, focus should return to the trigger.
- **Impact:** Minor keyboard navigation inconvenience. Not a hard WCAG failure but diverges from ARIA Authoring Practices.
- **Fix:** Store a ref to the trigger button and call `.focus()` when the dropdown is programmatically closed (Escape, outside click).
- **Effort:** trivial

### [LOW] SEO-008: Location Pages Missing LocalBusiness Schema When MDX Lacks schema.service

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 376-387)
- **Issue:** The Schema component is only rendered conditionally: `{locationData.schema?.service && (<Schema ... />)}`. If a location's MDX frontmatter does not include a `schema.service` field, no Service, FAQ, or Breadcrumb schema is emitted via the Schema component. The `ServiceArea` schema (lines 390-395) is always rendered, which partially compensates. Per the `docs/standards/schema.md` standard, all location pages require LocalBusiness schema.
- **Impact:** Location pages without `schema.service` in their MDX will lack Service and FAQ structured data. The always-present ServiceArea schema provides some coverage but is not a full LocalBusiness schema.
- **Fix:** Generate Service/FAQ/Breadcrumb schemas automatically from page data (title, description, faqs) rather than requiring a `schema.service` block in every MDX file. Create a fallback that always generates at least LocalBusiness and BreadcrumbList schemas.
- **Effort:** medium

### [LOW] SEO-009: OpenGraph Images on Location Pages Use Static Logo Instead of Hero Images

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 185-194)
- **Issue:** Location page metadata uses `absUrl("/static/logo.png")` for OpenGraph images even when `locationData.heroImage` is available in the frontmatter. Compare with the service pages which correctly use `getImageUrl(serviceData.heroImage)` when available.
- **Impact:** Social media shares display a generic logo instead of relevant location-specific imagery, reducing engagement and click-through rates.
- **Fix:** Use `getImageUrl(locationData.heroImage)` when `heroImage` is present, falling back to the logo:
  ```typescript
  images: locationData.heroImage
    ? [{ url: getImageUrl(locationData.heroImage), width: 1200, height: 630, alt: `...` }]
    : [{ url: absUrl("/static/logo.png"), width: 1200, height: 630, alt: `...` }];
  ```
- **Effort:** trivial

### [LOW] SEO-010: Missing Canonical URLs on Services and Blog Index Pages

- **File:** `sites/colossus-reference/app/services/page.tsx` (lines 11-29)
- **File:** `sites/colossus-reference/app/blog/page.tsx` (lines 12-35)
- **Issue:** The services index page metadata does not include `alternates.canonical`. The blog index page has `alternates.types` for RSS but no `alternates.canonical`. Other index pages (locations, contact, about, homepage) all correctly include canonical URLs.
- **Impact:** Without canonical URLs, search engines may index duplicate versions of these pages (with/without trailing slashes, with query parameters).
- **Fix:** Add `alternates: { canonical: absUrl("/services") }` and update blog to `alternates: { canonical: absUrl("/blog"), types: { "application/rss+xml": "/blog/rss.xml" } }`.
- **Effort:** trivial

### [LOW] SEO-011: Hero Section Missing `title` Attribute on Images

- **File:** `sites/colossus-reference/components/ui/hero-section.tsx` (lines 87-96)
- **Issue:** The hero section Image component has alt text but no `title` attribute. The `docs/standards/images.md` standard states "All images should include a `title` attribute for additional SEO value." The `service-hero.tsx` correctly includes a `title` attribute (line 97), but `hero-section.tsx` does not.
- **Impact:** Minor SEO benefit missed. The `title` attribute provides hover text and additional search engine context.
- **Fix:** Add `title={`${title} - Colossus Scaffolding`}` to the Image component.
- **Effort:** trivial

### [LOW] SEO-012: Inconsistent Sitemap Architecture Between Sites

- **File:** `sites/colossus-reference/app/robots.ts` (line 15) -- points to `/sitemap-index.xml`
- **File:** `sites/smiths-electrical-cambridge/app/robots.ts` (line 38) -- points to `/sitemap.xml`
- **Issue:** Colossus uses modular sitemaps with a sitemap index while smiths-electrical-cambridge uses a single monolithic sitemap. Both approaches are valid, but the inconsistency means the base-template needs careful configuration for new sites. The smiths sitemap (single file) would eventually hit scalability limits with many pages.
- **Impact:** Not a current problem, but new sites derived from the base-template need to be configured correctly. Worth tracking for platform consistency.
- **Fix:** Document the architectural difference. Consider standardizing all sites on the modular sitemap approach as the platform scales.
- **Effort:** trivial (documentation only)

## Statistics

| Severity  | Count  |
| --------- | ------ |
| Critical  | 2      |
| High      | 6      |
| Medium    | 9      |
| Low       | 7      |
| **Total** | **24** |

## Recommendations Priority

### Immediate (This Sprint)

1. **A11Y-001** + **A11Y-002**: Add skip navigation link and `<main>` landmark to all three site layouts (CRITICAL, trivial effort, platform-wide impact)
2. **A11Y-005**: Add `aria-hidden="true"` to all decorative SVGs (HIGH, small effort, mechanical)
3. **SEO-002**: Fix page titles exceeding 60-character limit (HIGH, trivial)
4. **SEO-001**: Create blog and projects sitemaps and register them (HIGH, small effort)

### Next Sprint

5. **A11Y-003**: Implement mobile menu focus trap (HIGH, medium effort)
6. **A11Y-006**: Add form validation ARIA attributes (HIGH, small effort)
7. **A11Y-007**: Add focus management and dialog role to consent banner (HIGH, medium effort)
8. **A11Y-004**: Add ARIA roles and keyboard navigation to locations dropdown (HIGH, medium effort)
9. **SEO-004** + **SEO-005**: Add structured data and metadata to smiths-electrical-cambridge homepage (MEDIUM, small effort)
10. **SEO-006**: Replace hardcoded phone numbers in FAQ components (MEDIUM, trivial)

### Backlog

11. All MEDIUM and LOW severity items
12. Run automated accessibility tests with axe-core integration
13. Manual screen reader testing with VoiceOver (macOS) and NVDA (Windows)
14. Lighthouse accessibility audit on all page types
