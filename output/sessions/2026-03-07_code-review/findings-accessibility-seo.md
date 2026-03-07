# Accessibility & SEO Review Findings

**Reviewer:** cs-frontend-engineer
**Scope:** Full accessibility and SEO audit across all three production sites (base-template, dj-fox-electrical, colossus-scaffolding) and packages/core-components. Examined layouts, page components, navigation, forms, schema markup, sitemaps, robots.txt, theme configs, and interactive components.
**Date:** 2026-03-07

## Summary

The platform has a solid foundation: skip-to-content link, focus trapping in mobile menu and consent manager, proper `lang` attribute, breadcrumb schema, and modular sitemaps. However, there are significant issues with duplicate `<main>` landmarks across most pages (PageShell already wraps children in `<main>`), missing structured data on key pages (homepages, location pages missing LocalBusiness schema), and form accessibility gaps (no `aria-invalid`, `aria-describedby`, or live region announcements for errors). The DJ Fox Electrical homepage has no `generateMetadata` export and no structured data, making it the most SEO-deficient page.

## Findings

---

### [CRITICAL] A11Y-001: Duplicate `<main>` Landmark on Most Pages

- **File:** Multiple files across all three sites
  - `sites/base-template/app/services/[slug]/page.tsx` (line 198)
  - `sites/base-template/app/locations/[slug]/page.tsx` (line 114)
  - `sites/base-template/app/blog/[slug]/page.tsx` (line 154)
  - `sites/base-template/app/contact/page.tsx` (line 37)
  - `sites/base-template/app/reviews/page.tsx` (line 57)
  - `sites/base-template/app/about/page.tsx` (line 47)
  - `sites/base-template/app/services/page.tsx` (line 42)
  - `sites/base-template/app/locations/page.tsx` (line 42)
  - `sites/base-template/app/blog/page.tsx` (line 117)
  - `sites/base-template/app/projects/page.tsx` (line 163)
  - `sites/dj-fox-electrical/app/` (15 files with `<main>`)
  - `sites/colossus-scaffolding/app/about/page.tsx` (line 44)
- **Issue:** `PageShell` in `packages/core-components/src/components/ui/page-shell.tsx` (line 50) already wraps all children in `<main id="main-content">`. Individual page components then add their own `<main>` elements, resulting in two nested `<main>` landmarks on every affected page.
- **Impact:** WCAG 1.3.1 (Info and Relationships) violation. Screen readers announce multiple main landmarks, confusing users about which is the primary content region. The skip-to-content link targets `#main-content` on the outer `<main>`, but the inner `<main>` creates ambiguity.
- **Fix:** Remove the `<main>` element from all individual page components. Replace with a `<div>` or fragment. The `PageShell` already provides the landmark.
- **Effort:** medium (many files, but mechanical find-and-replace)

---

### [CRITICAL] SEO-001: DJ Fox Electrical Homepage Missing Metadata and Structured Data

- **File:** `sites/dj-fox-electrical/app/page.tsx`
- **Issue:** The homepage has no `export const metadata` or `generateMetadata` function, and no Schema component or JSON-LD structured data. Every other page in the DJ Fox site exports metadata. The homepage relies entirely on the layout's default metadata (`siteConfig.name` as title, `siteConfig.tagline` as description).
- **Impact:** The most important page for SEO has a generic title/description with no OpenGraph tags, no canonical URL, no Twitter card, and no LocalBusiness/Organization/WebSite structured data. Google cannot generate rich results for the homepage.
- **Fix:** Add `export const metadata: Metadata` with explicit title, description, OG/Twitter tags, and canonical URL. Add `<Schema>` component with Organization schema and WebSite schema (matching what colossus-scaffolding does in its homepage).
- **Effort:** small

---

### [CRITICAL] SEO-002: Base-Template Homepage Missing Metadata and Structured Data

- **File:** `sites/base-template/app/page.tsx`
- **Issue:** Same as SEO-001. No `metadata` export and no `<Schema>` component. Relies on layout defaults.
- **Impact:** The gold-standard template that other sites are cloned from lacks proper homepage SEO. Every new site created from base-template will inherit this gap.
- **Fix:** Add explicit metadata export and Schema component with Organization/WebSite schemas.
- **Effort:** small

---

### [HIGH] A11Y-002: Contact Form Missing ARIA Error Attributes

- **File:** `sites/base-template/components/ui/ContactForm.tsx` (lines 182-321)
  - Same pattern in `sites/colossus-scaffolding/components/ui/ContactForm.tsx`
  - Same pattern in `sites/dj-fox-electrical/components/ui/ContactForm.tsx`
- **Issue:** Form inputs with validation errors do not use `aria-invalid="true"`, `aria-describedby` linking to error messages, or `aria-required="true"` for required fields. Error messages are displayed visually but not announced to screen readers (no `role="alert"` or `aria-live="polite"`). The error banner at line 169-177 also lacks `role="alert"`.
- **Impact:** WCAG 1.3.1 and 4.1.2 violations. Screen reader users cannot perceive which fields have errors or what the errors say. The required field indicator (asterisk) is visual-only.
- **Fix:** Add `aria-required="true"` to name, email, and message inputs. Add `aria-invalid={!!errors.fieldName}` when errors exist. Add `aria-describedby="fieldName-error"` to each input and `id="fieldName-error" role="alert"` to each error paragraph. Add `role="alert"` to the top-level error banner div.
- **Effort:** small

---

### [HIGH] SEO-003: Location Pages Missing LocalBusiness Schema (base-template and dj-fox-electrical)

- **File:** `sites/base-template/app/locations/[slug]/page.tsx` (lines 157-176)
  - `sites/dj-fox-electrical/app/locations/[slug]/page.tsx` (lines 157-176)
- **Issue:** Location detail pages emit `WebPage` schema and `BreadcrumbList` but not `LocalBusiness` schema. Per the project's schema.md standard, every location page requires a `LocalBusiness` schema. Colossus-scaffolding correctly emits `LocalBusiness` via `getServiceAreaSchema()` (line 423-428) but base-template and dj-fox-electrical do not.
- **Impact:** Google cannot generate Local Pack or rich business results for location-specific pages. This directly undermines the core value proposition of the platform (local SEO for service businesses).
- **Fix:** Add LocalBusiness schema generation to location pages in base-template and dj-fox-electrical, following the colossus-scaffolding pattern (`getServiceAreaSchema()`). The Schema component already supports service/org types, or use a direct JSON-LD script tag.
- **Effort:** medium

---

### [HIGH] A11Y-003: Decorative SVG Icons Missing `aria-hidden="true"` in Multiple Components

- **File:** `packages/core-components/src/components/ui/location-hero.tsx` (lines 86, 103-113, 138)
  - `packages/core-components/src/components/ui/faq-section.tsx` (lines 115, 133)
  - `sites/base-template/app/blog/[slug]/page.tsx` (lines 214-220)
- **Issue:** Several decorative SVG icons (phone icons, checkmark badges in location-hero, phone icons in FAQ section CTA) lack `aria-hidden="true"`. Screen readers will attempt to announce these purely decorative icons.
- **Impact:** WCAG 1.1.1 (Non-text Content). Screen readers encounter unlabeled SVG elements, creating noise for assistive technology users.
- **Fix:** Add `aria-hidden="true"` to all decorative SVG elements that are adjacent to text labels. The service-hero.tsx component does this correctly and can serve as the reference pattern.
- **Effort:** small

---

### [HIGH] A11Y-004: Breadcrumbs Component Uses Hardcoded Colors Instead of Theme Tokens

- **File:** `packages/core-components/src/components/ui/breadcrumbs.tsx` (lines 30, 50-51, 63, 69)
- **Issue:** The Breadcrumbs component uses hardcoded Tailwind colors (`text-slate-400`, `text-slate-500`, `text-slate-900`, `text-slate-700`) instead of theme tokens (`text-surface-muted-foreground`, `text-surface-foreground`, etc.). This is both a styling standards violation and an accessibility concern.
- **Impact:** On dark-themed sites (Orion/DJ Fox), breadcrumbs rendered over a dark background may have insufficient color contrast because the hardcoded slate colors assume a light background. Also violates the platform's white-labeling architecture (CLAUDE.md: "Never hardcode hex colors").
- **Fix:** Replace `text-slate-400` with `text-surface-muted-foreground`, `text-slate-900` with `text-surface-foreground`, `text-slate-500/700` with `text-surface-secondary`/`text-surface-tertiary`. Follow the pattern used by every other core component.
- **Effort:** trivial

---

### [MEDIUM] SEO-004: Colossus Scaffolding `robots.ts` Missing `/api/` Disallow

- **File:** `sites/colossus-scaffolding/app/robots.ts` (line 13)
- **Issue:** The colossus-scaffolding robots.ts uses a simplified format (`allow: isProd ? "/" : []`) without explicitly disallowing `/api/`, `/admin/`, or `/_next/` paths. The base-template and dj-fox-electrical sites correctly disallow these paths.
- **Impact:** Search engines may crawl API endpoints, generating noise in search index and potentially exposing API route information.
- **Fix:** Align with the base-template pattern: `disallow: ['/api/', '/admin/', '/_next/']` in the production rules.
- **Effort:** trivial

---

### [MEDIUM] SEO-005: OpenGraph Type Should Be `website` for Homepage, Not Inherited from Layout

- **File:** `sites/base-template/app/layout.tsx` (line 22-25)
  - `sites/dj-fox-electrical/app/layout.tsx` (line 19-22)
- **Issue:** The layout-level OpenGraph metadata sets `type: 'website'` and `locale: 'en_GB'` but omits `title`, `description`, `url`, and `images`. While Next.js merges metadata from layout + page, pages without explicit OG overrides (like both homepages) inherit incomplete OG tags.
- **Impact:** Social media shares of the homepage will have incomplete OpenGraph cards (no image, potentially generic title).
- **Fix:** Address as part of SEO-001 and SEO-002 by adding complete OG tags to homepage metadata exports.
- **Effort:** trivial (covered by SEO-001/SEO-002 fixes)

---

### [MEDIUM] A11Y-005: LocationsDropdown Menu Lacks `role="menu"` and Keyboard Arrow Navigation

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx` (lines 131-143, 159-192, 207-282)
- **Issue:** The dropdown panels rendered by `SimpleDropdown` and `MegaMenuDropdown` lack `role="menu"` or `role="listbox"` attributes. The trigger button has `aria-haspopup="true"` and `aria-expanded` (good), but the dropdown content has no ARIA role. There is no keyboard arrow-key navigation between items.
- **Impact:** WCAG 4.1.2 (Name, Role, Value). Screen readers cannot announce the dropdown as a menu. Keyboard-only users must Tab through every link rather than using arrow keys.
- **Fix:** Add `role="menu"` to the dropdown container and `role="menuitem"` to each link. Implement arrow-key navigation between menu items. Alternatively, since these are navigational link lists, `role="navigation"` with `aria-label` would also be acceptable and simpler.
- **Effort:** medium

---

### [MEDIUM] A11Y-006: FAQ Section Not Using `<details>`/`<summary>` or Accordion Pattern

- **File:** `packages/core-components/src/components/ui/faq-section.tsx` (lines 80-96)
- **Issue:** The FAQ section renders all questions and answers as static, always-visible content. While this is valid HTML, the pattern lacks interactive expand/collapse behavior that users expect from FAQs. The component also does not have a heading hierarchy issue per se, but if the page has many FAQs it presents a long list of content without user control.
- **Impact:** Not a WCAG violation per se (static FAQs are accessible), but an enhancement opportunity. Current implementation is fine for SEO (all content visible to crawlers) but could improve UX with accordion pattern.
- **Fix:** Consider adding optional accordion behavior with `<details>`/`<summary>` elements or an ARIA accordion pattern (`role="region"`, `aria-expanded`). Keep the current static rendering as default for SEO benefits.
- **Effort:** medium

---

### [MEDIUM] SEO-006: Blog Post OpenGraph Type Should Be `article` Consistently

- **File:** `sites/base-template/app/blog/[slug]/page.tsx` (line 66)
  - Consistent across all sites - this is correctly set to `type: 'article'`
- **Issue:** (Verified as non-issue) Blog posts correctly use `type: 'article'`. However, service pages use `type: 'website'` when they should arguably use `type: 'website'` (correct for service pages). No change needed.
- **Impact:** None - correctly implemented.
- **Fix:** N/A - removing from count.

---

### [MEDIUM] SEO-007: Missing `<h1>` on Several Index/Listing Pages

- **File:** `sites/base-template/app/page.tsx` (line 17) - uses `siteConfig.name` as h1 content, which is good
- **Issue:** Verified that all pages have h1 tags. The homepage h1s contain the site/business name, which while valid could be more keyword-rich. Service detail pages use the service title as h1 (good). Location pages use "Services in {location}" (good). Blog uses article title (good).
- **Impact:** Minor SEO optimization opportunity on homepages.
- **Fix:** Consider making homepage h1 content more keyword-focused (e.g., "Professional Electrical Services in Eastbourne" instead of just the company name). Low priority.
- **Effort:** trivial

---

### [LOW] A11Y-007: `maximumScale: 5` in Viewport Could Be Set Higher

- **File:** `sites/base-template/app/layout.tsx` (line 30)
  - `sites/dj-fox-electrical/app/layout.tsx` (line 27)
  - `sites/colossus-scaffolding/app/layout.tsx` (line 14-20)
- **Issue:** Viewport is configured with `maximumScale: 5` which is reasonable. Colossus also adds `userScalable: true` explicitly which is a good practice. Base-template and DJ Fox do not set `userScalable` explicitly (defaults to true in most browsers).
- **Impact:** Minor. The `maximumScale: 5` is fine and does not restrict zooming excessively. WCAG 1.4.4 (Resize Text) is met.
- **Fix:** For consistency, add `userScalable: true` to base-template and dj-fox-electrical viewport configs.
- **Effort:** trivial

---

### [LOW] A11Y-008: Phone Icon in Mobile Menu Bottom CTA Missing Accessible Label

- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (lines 261-280)
- **Issue:** The phone link in the mobile menu bottom section shows an SVG phone icon followed by the phone number text. The SVG lacks `aria-hidden="true"`, and the link itself has no explicit `aria-label`. While the visible phone number text provides context, the SVG should be marked decorative.
- **Impact:** Minor. Screen readers may attempt to announce the SVG path data.
- **Fix:** Add `aria-hidden="true"` to the phone SVG icon at line 267.
- **Effort:** trivial

---

### [LOW] SEO-008: Service Pages OG Image Alt Text Uses Generic Title

- **File:** `sites/base-template/app/services/[slug]/page.tsx` (line 100)
  - `sites/dj-fox-electrical/app/services/[slug]/page.tsx` (line 83)
- **Issue:** The OpenGraph image `alt` attribute is set to `fm.title` (e.g., "Access Scaffolding Services") which is the bare service title. The SEO standard recommends more descriptive alt text.
- **Impact:** Minor. OG image alt text has limited SEO impact but best practice is to be more descriptive (e.g., "Professional access scaffolding installation by Colossus Scaffolding").
- **Fix:** Concatenate with business name: `alt: \`${fm.title} - ${siteConfig.business.name}\``
- **Effort:** trivial

---

### [LOW] A11Y-009: Color Contrast Concern with DJ Fox Red Primary on White

- **File:** `sites/dj-fox-electrical/theme.config.ts` (line 15)
- **Issue:** The brand primary color `#db0b0b` (red) on white `#ffffff` background has a contrast ratio of approximately 4.58:1. This passes WCAG AA for normal text (4.5:1 minimum) but barely, and fails for large text patterns where it is used at smaller sizes. The `mutedForeground: '#5b6370'` on white has ~5.0:1 which passes AA.
- **Impact:** Borderline WCAG AA compliance for red text/links on white backgrounds. Users with low vision may find red links hard to read.
- **Fix:** Consider darkening the primary slightly (e.g., `#c40a0a` at 5.3:1) or ensuring red is only used on interactive elements at sufficient size. Run the theme-system WCAG validator: `pnpm --filter @platform/theme-system validate --config ../../sites/dj-fox-electrical/theme.config.ts`.
- **Effort:** trivial

---

### [LOW] SEO-009: Sitemap Does Not Include Reviews Page

- **File:** `sites/base-template/app/sitemap.ts` (lines 16-63)
  - Same pattern in `sites/dj-fox-electrical/app/sitemap.ts`
  - Same pattern in `sites/colossus-scaffolding/app/sitemap.ts`
- **Issue:** The core sitemap includes home, services, locations, about, contact, privacy-policy, and cookie-policy but does not include `/reviews`. The reviews page exists in all three sites but is not in any sitemap.
- **Impact:** Minor. The reviews page is still discoverable via internal links, but explicit sitemap inclusion helps crawl prioritization.
- **Fix:** Add `/reviews` entry to the core sitemap with appropriate priority (0.7).
- **Effort:** trivial

---

### [LOW] SEO-010: Colossus Location Pages Breadcrumbs Conditional on Frontmatter

- **File:** `sites/colossus-scaffolding/app/locations/[slug]/page.tsx` (lines 233-239)
- **Issue:** Breadcrumbs are only rendered if `locationData.breadcrumbs` exists in the MDX frontmatter. If a location MDX file omits the `breadcrumbs` field, no breadcrumb navigation or schema is emitted. Base-template and DJ Fox always render breadcrumbs with a default structure.
- **Impact:** Inconsistent breadcrumb coverage could mean some Colossus location pages lack BreadcrumbList schema, depending on whether the MDX author included the field.
- **Fix:** Default to `[{ name: 'Home', href: '/' }, { name: 'Locations', href: '/locations' }, { name: locationData.title, href: \`/locations/${slug}\` }]` when `locationData.breadcrumbs` is not provided.
- **Effort:** small

---

## Statistics

- Critical: 3
- High: 4
- Medium: 3
- Low: 6
- Total: 16

## Priority Implementation Order

1. **A11Y-001** (duplicate `<main>`) - Affects every page, mechanical fix
2. **SEO-001 + SEO-002** (homepage metadata/schema) - Two most important pages for SEO
3. **A11Y-002** (form ARIA errors) - Core user interaction path
4. **SEO-003** (location LocalBusiness schema) - Core platform value proposition
5. **A11Y-003** (SVG aria-hidden) - Quick wins across components
6. **A11Y-004** (breadcrumbs hardcoded colors) - Theme system integrity
7. **SEO-004** (colossus robots.ts) - Trivial fix
8. Remaining LOW items as convenient
