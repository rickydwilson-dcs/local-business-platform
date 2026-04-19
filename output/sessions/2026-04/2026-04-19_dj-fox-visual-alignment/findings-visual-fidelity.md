# Visual Fidelity Findings

**Reviewer:** cs-visual-fidelity-reviewer
**Date:** 2026-04-19
**Pages reviewed:** 12
**Reference:** djfoxelectrical.com (production, hand-crafted Orion templates)
**Test:** dj-fox-electrical-test (localhost:3000, composition system)

## Summary

This is not a colour-drift or token-drift problem — both sites correctly render brand red `rgb(219,11,11)` and dark navy header `rgb(17,24,39)`. The problem is **structural and compositional**: the test site's `composition.json` is producing a fundamentally different page layout than the hand-crafted Orion templates on every page. The single most pervasive finding is that **the `bg-surface-inverse` / dark-background treatment from the Orion template is not being applied to Stats, Why-Choose-Us, Contact form, or About stat-card sections on the test site** — those sections render on plain white instead. Additional structural gaps: no hero background image is loading (R2 URL Not Configured), the home page is missing the location-pills section and the services 2-column sticky layout, the CTA section is solid brand-red instead of dark-inverse, and the blog page crashes with `Failed to construct 'URL': Invalid URL`. The test home page is 3112px tall vs reference 5004px tall — a 38% content shortfall that reflects several missing/collapsed sections.

---

## Page: home (/)

### [Critical] VFR-001: Hero background image missing — placeholder text visible

- **Section:** Hero
- **Reference:** Full-bleed hero photograph of technician/van with dark gradient overlay; white headline "High Quality Electrical Services in Eastbourne" reads cleanly over image.
- **Test:** Large red text reading "R2 URL Not Configured" occupies the hero area — the hero background image URL is never resolved. The correct headline is rendered but is fading into the background because the overlay is absent and the hero is washed out.
- **File to fix:** `sites/dj-fox-electrical-test/content/pages/home.mdx` (or wherever the hero image path is sourced), plus the HeroSection composable component in `packages/core-components/src/components/composable/hero-section.tsx` should not render the placeholder string as user-facing text — it should fall back silently or to a default asset. Confirm `R2_PUBLIC_URL` (or the equivalent public env var) is set for the test site.
- **Effort:** small

### [High] VFR-002: Stats strip has wrong background (light grey instead of dark-inverse)

- **Section:** Stats strip immediately below hero
- **Reference:** Dark navy/inverse background (`bg-surface-inverse`), stat values rendered in WHITE, four metrics separated by vertical dividers, noise texture visible.
- **Test:** Light grey background (`srgb(229,231,235)` ≈ `#E5E7EB`), stat values `15+`, `NICEIC`, `100%`, `24/7` rendered in brand RED, no noise texture. Measured: test stats bg pixel returns `rgb(229,231,235)`; reference returns `rgb(67,59,7)` (dark olive — inverse navy + texture).
- **File to fix:** `sites/dj-fox-electrical-test/composition.json` home page → StatsStrip has `"background": "inverse"` (line 24) but the StatsStrip composable is evidently not honouring the `inverse` background variant. Check `packages/core-components/src/components/composable/stats-strip.tsx` — the `background` layout prop is probably not wired to apply `bg-surface-inverse text-inverse-foreground` classes; it may be hard-coded to use a subtle/brand surface. Also check that the stat VALUE colour is driven by the parent section (should inherit white on dark) rather than always rendering `text-brand-primary`.
- **Effort:** medium

### [High] VFR-003: Services section rendered as 3-column card grid instead of 2-column sticky list

- **Section:** Services section (under stats strip)
- **Reference:** 2-column layout — left column contains a sticky heading "Our Services" + a "View all services →" CTA button; right column contains a flat list of services (not cards, no per-item borders), each service has title + body text with generous vertical rhythm.
- **Test:** 3-column card grid of six services. Each card is a bordered box with title + description + "Learn more →" link. Entirely different visual treatment — closer to a generic features grid than to the Orion signature services layout.
- **File to fix:** `sites/dj-fox-electrical-test/composition.json` line 27–30 — the `ServiceCards` composable with `"columns": 3` is the wrong choice here. The Orion home template uses a dedicated sticky-heading-plus-list component. Either (a) add a `ServicesListSticky` (or similar name) composable to `packages/core-components/src/components/composable/` and reference it here, or (b) extend `ServiceCards` with a `"variant": "sticky-list"` layout option.
- **Effort:** large (new composable component required)

### [High] VFR-004: Location pills section is missing from home page

- **Section:** Between services and why-choose-us
- **Reference:** A dedicated "Areas We Serve" section containing three dropdown-style filter controls (Location / Type / Budget) and a "View all Locations →" CTA, all rendered as a pill-grid card.
- **Test:** This section is entirely absent. The composition goes straight from ServiceCards → TestimonialGrid → FeatureGrid without any location picker.
- **File to fix:** `sites/dj-fox-electrical-test/composition.json` home page `sections` array — insert a new `LocationPills` (or `LocationPicker`) composable entry between the services and why-choose-us sections. This composable does not yet exist in `packages/core-components/src/components/composable/` and must be added.
- **Effort:** large (new composable component required)

### [High] VFR-005: "What our customers say" testimonials section appears where none exists in reference

- **Section:** Between services and why-choose-us on test only
- **Reference:** The reference home page has NO testimonials block between Services and Why-Choose-Us. Testimonials live on `/reviews` only.
- **Test:** A "What our customers say" heading is rendered with no visible cards beneath it — it's an empty section that consumes vertical space.
- **File to fix:** `sites/dj-fox-electrical-test/composition.json` line 31–35 — remove the `TestimonialGrid` entry from the home `sections` array. Alternatively, if testimonials are wanted here, pass real review data; the current config references `"dataKey": "reviews"` but the rendered page shows the heading with no content, suggesting the data lookup is failing.
- **Effort:** trivial (remove section) or small (fix data wiring if intentional)

### [Critical] VFR-006: Why-Choose-Us section rendered as 4-column icon grid instead of dark table rows

- **Section:** Why Choose D J Fox Electrical
- **Reference:** Dark navy full-bleed section (`bg-surface-inverse`), heading left-aligned, followed by four table-style rows each with a label and value separated by a horizontal divider (e.g., "NICEIC approved", "20+ years experience", "Fast response", "NICEIC compliant"). Noise texture visible.
- **Test:** White background (not dark), rendered as a 4-column grid of tiny icon-plus-title-plus-body cards. Completely different layout treatment; the dark-inverse signature of this section is lost.
- **File to fix:** (1) `composition.json` line 37–40 — `FeatureGrid` with `"background": "inverse"` is configured but does not render as inverse. (2) `packages/core-components/src/components/composable/feature-grid.tsx` — the `background: "inverse"` option is likely not honoured. (3) The Orion reference uses a different component altogether — a `ComparisonRows` or `WhyChooseRows` table-style composable. The correct fix is to add that composable and reference it in composition.json, not to keep using `FeatureGrid`.
- **Effort:** large

### [High] VFR-007: CTA section is solid red brand bg instead of dark-inverse

- **Section:** "Ready to Get Started?" block before footer
- **Reference:** Dark navy inverse background (`bg-surface-inverse`), "Ready to Get Started?" heading in white, two CTA buttons: a solid red "Get Free Quote" and an outline "Call 01323 123 456" with phone icon. Subheading "Available across Eastbourne and surrounding areas" in muted white. Measured reference pixel: `rgb(22,28,42)` dark navy.
- **Test:** Solid brand-red bar (`rgb(219,11,11)`), only one "Get Free Quote" white button, no outline phone button, subheading reads grey-white on red. Measured test pixel: `rgb(219,11,11)`.
- **File to fix:** `composition.json` line 44 — change `"background": "brand"` to `"background": "inverse"` on every `CTASection`. Also verify `packages/core-components/src/components/composable/cta-section.tsx` renders the second phone-CTA button when appropriate slot props are passed; the composition currently shows only one button where the reference has two. This finding affects almost every page because `CTASection` with `"background": "brand"` is reused on home, about, services, locations, location-detail, reviews, projects, project-detail, blog-post, pricing.
- **Effort:** small (global config change) + small (button slot wiring)

### [Medium] VFR-008: Home page is missing 1,892px (38%) of content vertical space

- **Section:** Whole page
- **Reference:** 1280 × 5004 total height.
- **Test:** 1280 × 3112 total height.
- **Impact:** Combined effect of VFR-003 (collapsed services), VFR-004 (missing location pills), VFR-005 (empty testimonials), VFR-006 (flattened why-choose-us), VFR-007 (compressed CTA). Page reads as substantially shorter and less rich than the production equivalent.
- **Effort:** resolved by fixing VFR-003/004/005/006/007

---

## Page: about (/about)

### [High] VFR-009: Hero has no background image, stat cards have wrong position and styling

- **Section:** Hero + stat strip
- **Reference:** Hero has full-bleed photograph (van/technician), white heading "About D J Fox Electrical" centred, subtitle "Serving Eastbourne & East Sussex since 2025". Directly below is a dark-navy stats strip with three white stat cards (15+ / NICEIC / 1000+), each with an icon on the right.
- **Test:** No hero image — plain white background, left-aligned "About D J Fox Electrical" heading, two buttons ("Get Free Quote" / "Call 01323 123 456") below. Stats strip appears later on the page and is rendered on plain white with stat values in brand RED, not white on dark.
- **File to fix:** (1) `composition.json` about page line 51–55 has `"slots": { "showHeroImage": false }` — change to `true` and provide an `about.hero.image` value in content. (2) StatsStrip with `"background": "subtle"` (line 68) should be `"background": "inverse"`.
- **Effort:** small

### [High] VFR-010: Core Values rendered as flat icon grid instead of bordered card grid

- **Section:** Our Core Values
- **Reference:** 2×2 grid of cards with visible light-grey borders; each card has a red icon, bold title, and body text; cards sit on a light muted grey section background (`bg-surface-subtle`).
- **Test:** 2×2 grid but with NO card borders — values render as flat icon + title + body on plain white. Layout is also differently proportioned.
- **File to fix:** `packages/core-components/src/components/composable/feature-grid.tsx` — when used for values, cards need visible borders (`border border-surface-border rounded-2xl p-6`). Check if the composable supports a `"variant": "cards"` vs `"variant": "plain"` prop. Also `composition.json` line 60–64 may need a `"variant": "bordered"` slot.
- **Effort:** small

### [Medium] VFR-011: "Why Choose Us" section is missing from test about page

- **Section:** Below Core Values on reference
- **Reference:** A "Why choose us?" section with 8 table-style rows, each a red checkmark + label on a horizontal divider.
- **Test:** This section is entirely absent from the about page.
- **File to fix:** `composition.json` about page `sections` array — add a `ChecklistRows` or `FeatureList` composable. Requires the same base component as VFR-006.
- **Effort:** medium

### [High] VFR-012: About CTA is solid red instead of dark-inverse with dual buttons

- **Section:** Ready to work with us?
- **Reference:** Dark navy inverse section, heading "Ready to work with us?", two buttons "Get a free quote" + "01323 123 456" (with phone icon).
- **Test:** Solid red "Ready to Get Started?" bar with one "Get Free Quote" button. (Same pattern as VFR-007.)
- **File to fix:** `composition.json` line 72–74 — change `"background": "brand"` to `"background": "inverse"` (covered globally by VFR-007 fix).
- **Effort:** trivial (covered by VFR-007)

### [Low] VFR-013: About heading is left-aligned instead of centred

- **Section:** About page hero heading
- **Reference:** Heading is centred within the hero container.
- **Test:** Heading is left-aligned starting from the left edge of the content container.
- **File to fix:** `packages/core-components/src/components/composable/hero-section.tsx` — when `showHeroImage: false`, default alignment is probably `text-left`; should match the reference which centres hero text.
- **Effort:** trivial

---

## Page: contact (/contact)

### [Critical] VFR-014: Contact form is rendered on white background instead of dark navy card

- **Section:** Main contact form
- **Reference:** Entire form area is wrapped in a dark-navy card (`bg-surface-inverse`, `rgb(17,24,39)` measured). Form inputs are light-cream fills inside the dark card, labels are white, "Get in touch" heading is red uppercase eyebrow + white "Write to us for fast feedback" title, "Send Message" button is solid red full-width at the bottom of the dark card.
- **Test:** Form renders on plain white `rgb(255,255,255)`, labels in dark text, inputs have light grey borders, "Send Message" button is red but the surrounding context is pure white. The dark-card treatment is entirely absent.
- **File to fix:** `composition.json` line 86–89 has `"background": "surface"` (white). Change to `"background": "inverse"` AND update `packages/core-components/src/components/composable/contact-section.tsx` so the form itself renders as a dark-navy card.
- **Effort:** medium

### [High] VFR-015: Missing hero image and breadcrumbs on contact page

- **Section:** Hero
- **Reference:** Full-bleed hero photograph, breadcrumb trail "Home › Contact", white centred heading "Contact Us", subtitle "Get in touch for a free quote".
- **Test:** No hero image, no breadcrumbs, left-aligned heading with body text and two red CTA buttons.
- **File to fix:** (1) `composition.json` contact page — set `"showHeroImage": true`. (2) HeroSection composable needs a `"showBreadcrumbs"` slot that is `true` on non-home pages.
- **Effort:** medium

### [Medium] VFR-016: Right-rail Direct Contact + Business Hours + Our Services card missing

- **Section:** Adjacent to form in reference
- **Reference:** Form on LEFT, right rail contains three stacked cards: "Direct Contact", "Business Hours", "Our Services".
- **Test:** Single combined right-rail card with phone/email/address/hours/services. Different visual treatment.
- **File to fix:** `packages/core-components/src/components/composable/contact-section.tsx` right-rail slot — refactor to render three separate visually-distinct cards.
- **Effort:** medium

### [Low] VFR-017: Extra "Frequently Asked Questions" section added on test page

- **Section:** Below form
- **Reference:** No FAQ section on contact page.
- **Test:** Four-question FAQ block is rendered after the form.
- **File to fix:** `composition.json` line 91–96 — remove or confirm the FAQSection entry.
- **Effort:** trivial

---

## Page: services (/services)

### [High] VFR-018: Hero image missing, breadcrumbs missing

- **Section:** Hero
- **Reference:** Full-bleed hero photograph, breadcrumb trail "Home › Services", filter bar with dropdowns.
- **Test:** No hero image, "Our Electrical Services" heading on white, no breadcrumbs, no filter bar.
- **File to fix:** `composition.json` services page — set `"showHeroImage": true`. Add a `ServiceTypeFilter` composable section.
- **Effort:** medium

### [High] VFR-019: Services grouped by category on reference; test renders flat list

- **Section:** Service list body
- **Reference:** Three named category sections: "Installation services", "Maintenance services", "Repair & emergency services".
- **Test:** All services in a single flat 3-column grid titled "All services" with no category grouping.
- **File to fix:** `composition.json` services page — replace `ServiceCards` with a `CategorizedServiceList` composable or verify `CategoryCardsSection` is grouping by category.
- **Effort:** medium

### [Medium] VFR-020: "Browse services by type" image-card selector missing

- **Section:** Between hero and service list
- **Reference:** Three large image cards (Domestic, Commercial, Emergency) as a visual type-selector.
- **Test:** Missing entirely.
- **File to fix:** Add a `ServiceTypeImageCards` composable and reference it in `composition.json`.
- **Effort:** large (new composable)

---

## Page: services/emergency-callout

Both sides return 404. The 404 styling differs.

### [Medium] VFR-021: 404 page rendering differs — reference is dark-inverse, test is white

- **Section:** Entire 404 page
- **Reference:** Dark navy page background, red "404" headline, white body text.
- **Test:** White page background, dark "404" headline.
- **File to fix:** `sites/dj-fox-electrical-test/app/not-found.tsx` — apply `bg-surface-inverse text-inverse-foreground` to the root wrapper.
- **Effort:** trivial

---

## Page: locations (/locations)

### [High] VFR-022: Hero missing image and breadcrumbs; wrong data key

- **Section:** Hero
- **Reference:** Centred heading "Our Service Areas" with breadcrumb "Home › Locations".
- **Test:** Left-aligned "Our Electrical Services" heading (wrong copy — should be "Areas We Serve").
- **File to fix:** `composition.json` line 177–179 — `"dataKey": "services.hero"` is wrong; should be `"dataKey": "locations.hero"`.
- **Effort:** trivial (data key fix)

### [Medium] VFR-023: Location cards layout matches grid but card styling differs slightly

- **Section:** Locations grid
- **Reference:** 3×6 grid of location cards, borderless, generous white padding.
- **Test:** Very similar but minor styling delta.
- **File to fix:** Minor card hover states and link colour.
- **Effort:** small

### [High] VFR-024: CTA section on locations page is solid red

- **Section:** Ready to Get Started
- **Reference:** No red CTA bar — page ends with location cards then footer.
- **Test:** Solid red CTA bar before footer.
- **File to fix:** `composition.json` line 187–190 — CTASection to inverse, or remove entirely.
- **Effort:** trivial

---

## Page: locations/eastbourne

### [Critical] VFR-025: Wrong page is being rendered — shows services list instead of location detail

- **Section:** Entire page body
- **Reference:** Location detail page — hero with photograph, "Services in Expert Electrician in Eastbourne" heading, long prose body, FAQs accordion.
- **Test:** The page renders as the full `/services` page — "All services" flat grid with 30+ service cards. Location-specific content does not appear at all.
- **File to fix:** (1) `sites/dj-fox-electrical-test/app/locations/[slug]/page.tsx` — verify it passes `pageType: "location-detail"` to `renderComposedPage`. (2) Check that `content/locations/eastbourne.mdx` exists and is loaded. (3) Check composition.json location-detail config.
- **Effort:** medium

---

## Page: reviews (/reviews)

### [High] VFR-026: Star rating block replaces four-metric stats strip

- **Section:** Below hero
- **Reference:** Light grey rating card with "4.7" + stars + review count, THEN dark inverse strip with four quality metrics (Quality assured / Expert team / Fast response / Fully insured).
- **Test:** Three red stats on white background; the four-metric dark strip is missing entirely.
- **File to fix:** `composition.json` line 202–205 — need two sections: a `RatingCard` composable AND a `QualityMetricsStrip`.
- **Effort:** medium

### [High] VFR-027: Featured Reviews + All Reviews two-tier layout is missing

- **Section:** Reviews body
- **Reference:** "Featured reviews" (two large cards with badges on dark-inverse) AND "All Reviews" (three-column card grid in light-grey). Visually differentiated.
- **Test:** Single "What our customers say" heading followed by three testimonial cards. No featured/all separation, no author avatars.
- **File to fix:** `composition.json` reviews page — need two sections: `FeaturedTestimonials` (dark bg) and `TestimonialGrid` (light bg).
- **Effort:** large

### [High] VFR-028: Reviews CTA copy differs (correct colour for this page)

- **Section:** Bottom CTA
- **Reference:** Solid red "Ready to experience our service?" — correct colour for reviews page.
- **Test:** Solid red "Ready to Get Started?" — correct colour but wrong copy.
- **File to fix:** Copy alignment only.
- **Effort:** trivial

---

## Page: projects (/projects)

### [Medium] VFR-029: Stats placement on projects page differs

- **Section:** Below hero
- **Reference:** Two stats centred in hero area. "Our Projects" heading on subtle grey.
- **Test:** Three stats shown AFTER "Recent projects" heading, left-aligned. Data values differ.
- **File to fix:** `composition.json` projects page — move StatsStrip before ProjectGrid; correct stat values.
- **Effort:** small

### [Low] VFR-030: Project CTA is solid red (covered globally by VFR-007)

- **Section:** CTA
- **File to fix:** `composition.json` line 232–235 — CTASection to inverse.
- **Effort:** trivial

---

## Page: blog (/blog)

### [Critical] VFR-031: Blog page crashes with TypeError "Failed to construct 'URL': Invalid URL"

- **Section:** Entire page
- **Reference:** Full blog index with hero, "Featured Articles" section, "Latest Articles" 3-column grid, pagination.
- **Test:** Page fails to render — shows Next.js dev error overlay: `TypeError: Failed to construct 'URL': Invalid URL`.
- **File to fix:** Likely in blog card component attempting to construct canonical URL from empty string. Guard against empty `siteUrl` in `site.config.ts` or `blog-grid.tsx`. Verify `NEXT_PUBLIC_SITE_URL` env var is set.
- **Effort:** small

---

## Page: pricing (/pricing)

### [High] VFR-032: Pricing page missing "24/7 Emergency Callout" card + "Hourly Rates" section

- **Section:** Top of page
- **Reference:** "24/7 Emergency Callout" callout card with phone button. "Hourly Rates" three-card section (Standard / Emergency / Commercial).
- **Test:** Missing. Page jumps from hero straight to "Example Job Costs" table.
- **File to fix:** `composition.json` pricing page — insert `EmergencyCalloutCard` and `HourlyRatesCards` composables.
- **Effort:** large

### [Medium] VFR-033: "Comprehensive Electrical System Check" inspection section missing

- **Section:** Mid-page
- **Reference:** Two-column section with photograph left and description right.
- **Test:** Missing entirely.
- **File to fix:** Add `ImageTextSection` composable reference in `composition.json` pricing page.
- **Effort:** medium

### [Medium] VFR-034: Why Choose D J Fox section on white instead of light-grey background

- **Section:** Benefits row
- **Reference:** Light-grey banded section background.
- **Test:** Plain white background.
- **File to fix:** `composition.json` — set `"background": "subtle"` on the FeatureGrid section.
- **Effort:** trivial

### [Low] VFR-035: Pricing CTA copy alignment (correct colour for this page)

- **Section:** Bottom CTA
- **Reference:** Solid red "Get Your Free Quote Today" with two buttons.
- **Test:** Solid red "Ready to Get Started?" with one button.
- **File to fix:** Copy + second phone-CTA button.
- **Effort:** trivial

---

## Page: privacy-policy (/privacy-policy)

### [Medium] VFR-036: Privacy hero rendered with dark bg in reference, light in test

- **Section:** Hero
- **Reference:** Dark-navy section containing "Privacy Policy" heading + table-of-contents card.
- **Test:** White hero with "Privacy Policy" heading + muted-grey TOC card.
- **File to fix:** `composition.json` privacy page — extend `TextSection` with inverse background support or wrap with `HeroSection`.
- **Effort:** medium

### [Low] VFR-037: Data We Collect coloured info cards differ slightly

- **Section:** "2. Data We Collect"
- **Reference:** Vibrant left colour bars on four pill cards.
- **Test:** Softer tints on same cards.
- **File to fix:** MDX content or TextSection prose styling.
- **Effort:** small

### [Low] VFR-038: Your Rights section numbered box styling differs slightly

- **Section:** "7. Your Rights"
- **File to fix:** Minor prose styling.
- **Effort:** trivial

---

## Cross-page patterns

1. **Hero image never loads** — "R2 URL Not Configured" on every page with hero image. Fix env var or HeroSection fallback.
2. **No breadcrumbs on any non-home page** — HeroSection needs `showBreadcrumbs` slot.
3. **`"background": "inverse"` broken** across StatsStrip, FeatureGrid, CTASection — platform-level bug in composable `layout.background` prop wiring.
4. **CTASection with `"background": "brand"`** should be `"inverse"` on most pages. Second outline phone-number button missing everywhere.
5. **Noise texture absent** on all test dark sections.
6. **Hero alignment**: left-aligned on test vs centred on reference for non-image heroes.

---

## Statistics

- Critical: 5
- High: 17
- Medium: 10
- Low: 6
- **Total: 38**

**Suggested fix sequencing:**

1. Platform-level bugs: VFR-031 (blog crash), VFR-025 (location-detail routing), VFR-001 (R2 URL), `background: "inverse"` in composables (fixes VFR-002, VFR-006, VFR-007, VFR-014 in one change)
2. composition.json-only fixes: CTASection inverse (global), StatsStrip inverse, hero dataKey corrections, background subtle flags, remove empty TestimonialGrid
3. New composables: ServiceListSection, LocationPillsSection, WhyChooseUsSection, FeaturedTestimonials, ServiceTypeImageCards, EmergencyCalloutCard, HourlyRatesCards
