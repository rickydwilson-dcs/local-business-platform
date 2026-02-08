# Accessibility & SEO Review Findings

**Reviewer:** cs-frontend-engineer
**Scope:** Full review of all three sites (colossus-reference, smiths-electrical-cambridge, base-template), shared core-components package, theme configs, sitemaps, robots.ts, structured data, heading hierarchy, ARIA attributes, form accessibility, focus management, image alt text, meta tags, and color contrast.
**Date:** 2026-02-07

## Summary

The platform has a strong accessibility and SEO foundation -- skip links, focus traps, ARIA attributes on interactive components, `lang="en-GB"`, semantic HTML, and comprehensive structured data are already in place. The main gaps are: (1) several decorative SVG icons missing `aria-hidden="true"`, (2) contact pages on both live sites are `"use client"` components that cannot export Next.js `metadata`, leaving them with only the generic layout title/description, (3) the reviews page and contact page are missing from all sitemaps, and (4) a handful of heading hierarchy and SEO metadata issues that would reduce search visibility. Most fixes are trivial to small effort.

## Findings

---

### [HIGH] A11Y-001: Decorative SVGs missing `aria-hidden="true"` on services listing and locations listing pages

- **Files:**
  - `sites/colossus-reference/app/services/page.tsx` (line 66)
  - `sites/colossus-reference/app/services/page.tsx` (lines 80-90, 94-104)
  - `sites/colossus-reference/app/locations/page.tsx` (line 163)
  - `sites/colossus-reference/app/locations/page.tsx` (lines 177-186, 190-200)
- **Issue:** Multiple inline SVG icons (phone icon, badge checkmark icons) inside links and decorative elements do not have `aria-hidden="true"`. Screen readers will attempt to announce the SVG path data or treat the SVG as meaningful content.
- **Impact:** Screen reader users hear nonsensical SVG path data or duplicate content announcements alongside the visible text labels.
- **Fix:** Add `aria-hidden="true"` to each decorative `<svg>` element. The pattern is already correctly applied in `hero-section.tsx`, `service-hero.tsx`, `service-faq.tsx`, and the homepage -- it just needs to be consistent on the listing pages.
- **Effort:** trivial

---

### [HIGH] A11Y-002: Star rating SVGs on reviews page missing `aria-hidden` and accessible text

- **File:** `sites/colossus-reference/app/reviews/page.tsx` (lines 39-46)
- **Issue:** The `StarRating` component renders 5 SVG stars with no `aria-hidden="true"` and no accessible text alternative. Screen readers cannot determine the rating value.
- **Impact:** Screen reader users cannot understand review ratings, which is core content on this page.
- **Fix:** Add `aria-hidden="true"` to each star SVG and provide an accessible `<span className="sr-only">{rating} out of 5 stars</span>` alongside the visual stars.
- **Effort:** small

---

### [HIGH] SEO-001: Contact pages have no page-specific metadata (both live sites)

- **Files:**
  - `sites/colossus-reference/app/contact/page.tsx` (line 1: `"use client"`)
  - `sites/smiths-electrical-cambridge/app/contact/page.tsx` (line 1: `"use client"`)
- **Issue:** Both contact pages are client components (`"use client"`), which means they cannot export a `metadata` object or `generateMetadata` function. They inherit only the generic layout metadata (`"Colossus Scaffolding"` / `siteConfig.name`). This means:
  - No page-specific `<title>` (critical for SEO)
  - No page-specific `<meta name="description">`
  - No OpenGraph / Twitter cards
  - No canonical URL
- **Impact:** Google shows generic site name as the title for the contact page in search results. No description snippet. Missing canonical could cause duplicate content issues with query parameters.
- **Fix:** Extract the form into a separate client component (e.g., `ContactForm.tsx`) and make the page itself a server component that exports `metadata`. The existing form JSX moves to the client child component; everything else stays in the server parent.
- **Effort:** medium

---

### [HIGH] SEO-002: Reviews page missing from sitemap

- **File:** `sites/colossus-reference/app/sitemap.ts` (lines 22-56)
- **Issue:** The main sitemap includes `/about`, `/contact`, `/privacy-policy`, `/cookie-policy` but does NOT include `/reviews`. There is also no `reviews/sitemap.ts`. The reviews page exists and has content, but Google may not discover or prioritize it.
- **Impact:** The reviews page (with aggregate ratings and testimonials) may not be indexed efficiently. Review/testimonial pages with AggregateRating schema are valuable for rich results.
- **Fix:** Add `/reviews` to the core sitemap entries in `app/sitemap.ts`.
- **Effort:** trivial

---

### [MEDIUM] SEO-003: Reviews page title exceeds 60-character limit

- **File:** `sites/colossus-reference/app/reviews/page.tsx` (line 10)
- **Issue:** The title is `"Customer Reviews | What Our Clients Say | Colossus Scaffolding"`. Combined with the layout template `"%s | Colossus Scaffolding"`, this would render as `"Customer Reviews | What Our Clients Say | Colossus Scaffolding | Colossus Scaffolding"` -- far exceeding 60 characters. Even without double-appending the site name, the title alone is 66 characters.
- **Impact:** Google will truncate the title in search results, losing important keyword context.
- **Fix:** The page title should not include `"| Colossus Scaffolding"` since the layout template already appends it. Shorten to something like `"Customer Reviews | What Our Clients Say"` (40 chars) which becomes `"Customer Reviews | What Our Clients Say | Colossus Scaffolding"` (63 chars). Alternatively: `"Customer Reviews"` (16 chars -> ~40 with template).
- **Effort:** trivial

---

### [MEDIUM] SEO-004: Reviews page missing canonical URL and absolute OG URL

- **File:** `sites/colossus-reference/app/reviews/page.tsx` (lines 9-27)
- **Issue:** The metadata has no `alternates.canonical` field and the OpenGraph `url` is a relative path (`"/reviews"`) instead of an absolute URL using `absUrl()`.
- **Impact:** Without a canonical, search engines may treat parameterized versions (e.g., `/reviews?page=2`) as separate pages. Relative OG URLs may not resolve correctly on social platforms.
- **Fix:** Add `alternates: { canonical: absUrl("/reviews") }` and change `url: "/reviews"` to `url: absUrl("/reviews")` in the OpenGraph config.
- **Effort:** trivial

---

### [MEDIUM] SEO-005: Location FAQ heading produces redundant, keyword-stuffed text

- **Files:**
  - `packages/core-components/src/components/ui/location-faq.tsx` (line 29)
  - `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 318-322)
- **Issue:** The `LocationFAQ` component renders `{location} Scaffolding FAQ - {title}`. The calling page passes `title={locationData.title} Scaffolding FAQ` and `location={locationData.title}`. For a location named "Brighton" this produces: **"Brighton Scaffolding FAQ - Brighton Scaffolding FAQ"** -- a duplicated, keyword-stuffed heading.
- **Impact:** Google may perceive this as keyword stuffing. The heading is also confusing for screen reader users navigating via headings.
- **Fix:** Either (a) pass a cleaner title from the page like `title="Your Questions Answered"` which would render as `"Brighton Scaffolding FAQ - Your Questions Answered"`, or (b) change the component to use just `{title}` without prepending the location again since the caller already includes it.
- **Effort:** small

---

### [MEDIUM] A11Y-003: Location page SVGs in towns directory section missing `aria-hidden`

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 354-363)
- **Issue:** The arrow SVG icon in each town card link does not have `aria-hidden="true"`. It is purely decorative (the link text already provides the name).
- **Impact:** Screen readers may announce SVG path data alongside the town name.
- **Fix:** Add `aria-hidden="true"` to the arrow SVG.
- **Effort:** trivial

---

### [MEDIUM] A11Y-004: Service page back-arrow SVG missing `aria-hidden`

- **File:** `sites/colossus-reference/app/services/[slug]/page.tsx` (line 260)
- **Issue:** The left-arrow SVG in the "More scaffolding services in {location}" link does not have `aria-hidden="true"`.
- **Impact:** Screen readers may announce SVG path data alongside the link text.
- **Fix:** Add `aria-hidden="true"` to the SVG.
- **Effort:** trivial

---

### [MEDIUM] A11Y-005: Blog post related-services arrow SVG missing `aria-hidden`

- **File:** `sites/colossus-reference/app/blog/[slug]/page.tsx` (lines 205-215)
- **Issue:** The chevron-right SVG in the related services links does not have `aria-hidden="true"`.
- **Impact:** Screen readers may read the SVG path data as part of the link content.
- **Fix:** Add `aria-hidden="true"` to the SVG.
- **Effort:** trivial

---

### [MEDIUM] A11Y-006: Mobile menu locations toggle button chevron SVG missing `aria-hidden`

- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (lines 171-183)
- **Issue:** The chevron-down SVG inside the locations expand/collapse button has no `aria-hidden="true"`. The button also lacks `aria-expanded` to indicate the expansion state of the locations sub-menu.
- **Impact:** Screen readers will read the SVG as content. The expand/collapse state of the locations list is not programmatically conveyed.
- **Fix:** Add `aria-hidden="true"` to the SVG. Add `aria-expanded={locationsExpanded}` to the button element.
- **Effort:** small

---

### [MEDIUM] SEO-006: Smiths-electrical-cambridge site missing `userScalable: true` in viewport

- **File:** `sites/smiths-electrical-cambridge/app/layout.tsx` (lines 26-30)
- **Issue:** The viewport configuration does not include `userScalable: true`, unlike colossus-reference which explicitly sets it. While modern browsers default to allowing zoom, WCAG 2.1 SC 1.4.4 requires that text can be resized up to 200%.
- **Impact:** On some mobile browsers, zoom may be restricted, failing WCAG accessibility requirements.
- **Fix:** Add `userScalable: true` and `viewportFit: "cover"` to match the colossus-reference pattern.
- **Effort:** trivial

---

### [MEDIUM] SEO-007: Colossus-reference critical CSS inlines hardcoded hex colors

- **File:** `sites/colossus-reference/app/layout.tsx` (lines 44-178)
- **Issue:** The inline critical CSS block hardcodes `#ffffff`, `#0f172a`, `#334155`, `#e2e8f0` and other hex values for body, header, nav, and link styles. While it also uses CSS variables (`var(--color-brand-primary)`) for some hover states, the base colors are hardcoded and would not update if the theme config changes.
- **Impact:** If the site is re-themed (the entire point of the white-label system), these critical styles would show incorrect colors during the initial render flash before Tailwind loads. This is a theme portability issue, not an SEO issue per se, but the hardcoded `background-color` and `color` values contradict the project's styling standards.
- **Fix:** Replace hardcoded hex values with their CSS variable equivalents from the theme system (e.g., `var(--color-surface-background)`, `var(--color-surface-foreground)`).
- **Effort:** small

---

### [MEDIUM] SEO-008: Homepage title may exceed 60 characters

- **File:** `sites/colossus-reference/app/page.tsx` (line 10)
- **Issue:** The homepage title is `"Professional Scaffolding Services South East UK"` (49 chars). The layout template is `"%s | Colossus Scaffolding"`. Combined: `"Professional Scaffolding Services South East UK | Colossus Scaffolding"` = 70 characters, exceeding the 60-character limit.
- **Impact:** Google will truncate the title, losing the brand name.
- **Fix:** Shorten to something like `"Scaffolding Services South East UK"` (35 chars) which becomes 57 chars with the template. Or since this is the homepage, override the template with the full desired title directly (many sites use a different pattern for the homepage).
- **Effort:** trivial

---

### [LOW] SEO-009: Contact page not included in core sitemap

- **File:** `sites/colossus-reference/app/sitemap.ts`
- **Issue:** While the contact page is listed in the core sitemap at priority 0.8, the `/reviews` page is not. This has already been covered in SEO-002. However, verifying that `/about` (priority 0.7) has lower priority than `/contact` (0.8) is correct for a lead-generation business. No action needed.
- **Impact:** None -- this is informational.
- **Fix:** N/A
- **Effort:** N/A

---

### [LOW] A11Y-007: LocationsDropdown button missing `aria-controls` attribute

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 106-122)
- **Issue:** The dropdown trigger button has `aria-expanded` and `aria-haspopup="true"` but does not have `aria-controls` pointing to the dropdown menu's ID. The dropdown menu itself has no `id` attribute.
- **Impact:** Screen readers cannot programmatically associate the trigger with the controlled dropdown panel. This is a WCAG 4.1.2 recommendation (not a strict failure).
- **Fix:** Add an `id` to the dropdown panel (e.g., `id="locations-dropdown-menu"`) and add `aria-controls="locations-dropdown-menu"` to the trigger button.
- **Effort:** trivial

---

### [LOW] A11Y-008: Footer heading levels skip from h3 to h4

- **File:** `packages/core-components/src/components/ui/footer.tsx` (lines 39, 64, 94, 121)
- **Issue:** The footer uses `<h3>` for the company name and `<h4>` for column headings ("Our Services", "Service Areas", "Contact Info"). While this appears correct in the footer context, if there is no `<h2>` on the page above the footer (e.g., some pages might end with an `<h2>` CTA section), there could be a heading level gap. However, the footer headings are in a semantic `<footer>` landmark which somewhat mitigates this.
- **Impact:** Minor heading hierarchy issue. Automated accessibility tools may flag it, but screen reader navigation landmarks handle footer content correctly.
- **Fix:** Consider using `<h2>` for the primary footer heading and `<h3>` for column headings, which is more conventional. Or add `role="contentinfo"` (already implied by `<footer>`) and accept that footer heading levels operate independently from the main content hierarchy.
- **Effort:** trivial

---

### [LOW] SEO-010: OpenGraph images reference `/static/logo.png` which may not exist

- **Files:**
  - `sites/colossus-reference/app/page.tsx` (line 22)
  - `sites/colossus-reference/app/about/page.tsx` (line 22)
  - `sites/colossus-reference/app/locations/page.tsx` (line 30)
  - Multiple other pages referencing `absUrl("/static/logo.png")`
- **Issue:** Many OpenGraph image fallbacks reference `/static/logo.png`. If this file does not exist in the `public/static/` directory, social media sharing will show no image preview. The platform uses R2 for images, so this local fallback path should be verified.
- **Impact:** Social media shares may show no image, reducing click-through rates.
- **Fix:** Verify that `public/static/logo.png` exists in each site, or change the fallback to a known R2-hosted OG image. Create an OG-optimized image (1200x630) for social sharing.
- **Effort:** small

---

### [LOW] SEO-011: Colossus contact page `"use client"` prevents Schema/breadcrumb SSR

- **File:** `sites/colossus-reference/app/contact/page.tsx`
- **Issue:** Because the entire contact page is a client component, the `<Schema>` component at the bottom (lines 543-583) is rendered client-side. While Google can execute JavaScript, server-rendered JSON-LD is preferable for reliable indexing.
- **Impact:** The FAQ and breadcrumb structured data may not be consistently picked up by all search engine crawlers.
- **Fix:** This is resolved by the same refactor recommended in SEO-001 (extract form to client component, make page a server component).
- **Effort:** medium (same effort as SEO-001 fix)

---

### [LOW] A11Y-009: Certificate lightbox SVG icons missing `aria-hidden`

- **File:** `packages/core-components/src/components/ui/certificate-lightbox.tsx` (lines 237, 253, 264, 282, 334, 363)
- **Issue:** The zoom control SVGs (zoom in, zoom out, reset, close, previous, next) do not have `aria-hidden="true"`. Each button already has an `aria-label`, so the SVGs are purely decorative.
- **Impact:** Screen readers may attempt to read SVG path data inside buttons that already have aria-labels.
- **Fix:** Add `aria-hidden="true"` to all SVG elements within the lightbox buttons.
- **Effort:** trivial

---

### [LOW] SEO-012: About page title exceeds 60 characters with template

- **File:** `sites/colossus-reference/app/about/page.tsx` (line 10)
- **Issue:** Title is `"About Colossus Scaffolding | South East Specialists"` (52 chars). With the layout template `"%s | Colossus Scaffolding"`, this becomes `"About Colossus Scaffolding | South East Specialists | Colossus Scaffolding"` = 75 chars. The brand name also appears twice.
- **Impact:** Title truncated in search results and brand name duplication looks unprofessional.
- **Fix:** Since the layout template appends `"| Colossus Scaffolding"`, change the page title to just `"About Us | South East Scaffolding Specialists"` (46 chars -> 68 chars with template) or simply `"About Us"` if the template is sufficient.
- **Effort:** trivial

---

### [LOW] SEO-013: Services listing page title duplicates with homepage

- **File:** `sites/colossus-reference/app/services/page.tsx` (line 11)
- **Issue:** The services page title is `"Professional Scaffolding Services South East UK"` -- identical to the homepage title. With the layout template, both pages would have the same rendered title.
- **Impact:** Two pages competing with the same title in search results (title cannibalization). Google may have difficulty distinguishing which page to show.
- **Fix:** Differentiate the services listing title, e.g., `"Our Scaffolding Services | Full Range"` or `"Scaffolding Services Directory"`.
- **Effort:** trivial

---

### [LOW] A11Y-010: Lucide icons in footer lack `aria-hidden`

- **File:** `packages/core-components/src/components/ui/footer.tsx` (lines 49, 51, 124, 133, 142)
- **Issue:** Lucide React icons (`Phone`, `Mail`, `MapPin`, `Shield`, `Award`) are used decoratively alongside text labels but may not have `aria-hidden` set by default in all versions of lucide-react.
- **Impact:** Depends on lucide-react version behavior. Modern versions do set `aria-hidden` by default, but this should be verified.
- **Fix:** Verify that the installed lucide-react version sets `aria-hidden="true"` on icons by default. If not, add `aria-hidden="true"` explicitly to each decorative icon.
- **Effort:** trivial

---

### [LOW] SEO-014: Smiths-electrical-cambridge site missing ConsentManager and Analytics components

- **File:** `sites/smiths-electrical-cambridge/app/layout.tsx`
- **Issue:** Unlike colossus-reference, the smiths site layout does not include `ConsentManager` or `Analytics` components. While this may be intentional (the site may not yet have analytics configured), it means the site has no GDPR consent mechanism if analytics are later added.
- **Impact:** No impact currently if analytics are not active. Risk of GDPR non-compliance if analytics are enabled without adding the consent banner.
- **Fix:** Add `ConsentManager` and `Analytics` components to the layout, gated by feature flags as in colossus-reference.
- **Effort:** small

---

### [LOW] SEO-015: Location keywords passed as comma-separated string instead of array

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 180-182)
- **Issue:** The metadata `keywords` field is computed as `Array.isArray(locationData.keywords) ? locationData.keywords.join(", ") : locationData.keywords`. The Next.js Metadata API accepts `keywords` as either a `string` or `string[]`. Joining with commas and passing as a string loses the array structure that Next.js would properly format.
- **Impact:** Minor -- the rendered HTML meta tag will be functionally identical, but using the array form is cleaner and follows the pattern used on other pages.
- **Fix:** Pass `keywords: locationData.keywords` directly without the `.join(", ")` transformation.
- **Effort:** trivial

---

## Statistics

- Critical: 0
- High: 4
- Medium: 8
- Low: 7
- Total: 19
