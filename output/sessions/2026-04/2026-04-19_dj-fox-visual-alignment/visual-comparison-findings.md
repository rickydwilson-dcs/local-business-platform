# Visual Comparison Findings: DJ Fox Test vs Production

**Date:** 2026-04-19
**Reference:** https://djfoxelectrical.com (production, Orion templates)
**Test:** http://localhost:3000 (dj-fox-electrical-test, composition system)
**Pages:** 12 (screenshots captured at 1280px)

Full specialist reports:

- Visual fidelity: `findings-visual-fidelity.md` (38 findings: 5 critical, 17 high)
- Accessibility: `findings-accessibility.md` (12 findings: 0 critical, 3 high)
- Performance: `findings-performance.md` (8 findings: 0 critical, 0 high)
- Aggregated: `findings-aggregated.md`

---

## Summary: Root Causes

The gap is not colour drift — tokens are correctly resolved. The gap is structural:

1. **`background: "inverse"` not honoured** by StatsStrip, FeatureGrid, CTASection → all dark sections render on white
2. **Noise overlay absent** on all dark sections
3. **Hero images not loading** (R2_PUBLIC_URL not set) → "R2 URL Not Configured" text visible
4. **3 missing composables** on home page: ServiceListSection, LocationPillsSection, WhyChooseUsSection
5. **Blog page crashes** (Invalid URL — siteUrl empty)
6. **Location detail routing broken** — locations/eastbourne renders services page

---

## Page-by-Page: Critical & High Findings

| Page                 | Finding                                                       | Severity | File to Fix                                     |
| -------------------- | ------------------------------------------------------------- | -------- | ----------------------------------------------- |
| All                  | Hero image = "R2 URL Not Configured"                          | Critical | `site.config.ts` env var / HeroSection fallback |
| All                  | No breadcrumbs on non-home pages                              | High     | `hero-section.tsx` + `composition.json`         |
| All                  | CTASection solid red (should be dark-inverse)                 | High     | `composition.json` (global) + `cta-section.tsx` |
| Home                 | Stats strip: light grey bg, red values                        | High     | `stats-strip.tsx` + `composition.json`          |
| Home                 | Services: 3-col card grid (should be 2-col sticky list)       | High     | New `ServiceListSection` composable             |
| Home                 | Location pills section missing                                | High     | New `LocationPillsSection` composable           |
| Home                 | Empty TestimonialGrid (not in reference)                      | High     | `composition.json`: remove section              |
| Home                 | Why-Choose-Us: white bg card grid (should be dark table rows) | Critical | New `WhyChooseUsSection` composable             |
| About                | Stats strip: white bg, red values                             | High     | `composition.json`: inverse background          |
| About                | Core Values: no card borders                                  | High     | `feature-grid.tsx` variant                      |
| Contact              | Form: white bg (should be dark-navy card)                     | Critical | `contact-section.tsx` + `composition.json`      |
| Contact              | No hero image, no breadcrumbs                                 | High     | `composition.json` + HeroSection                |
| Services             | No hero image, no breadcrumbs                                 | High     | `composition.json` + HeroSection                |
| Services             | Flat "all services" grid (should be categorised)              | High     | `composition.json`                              |
| Locations            | Wrong dataKey ("services.hero")                               | High     | `composition.json`                              |
| Locations/Eastbourne | Shows /services page (routing bug)                            | Critical | `app/locations/[slug]/page.tsx`                 |
| Reviews              | Wrong stats component; missing dark strip                     | High     | `composition.json`                              |
| Reviews              | No Featured/All two-tier layout                               | High     | `composition.json` + new composable             |
| Blog                 | Page crashes: TypeError Invalid URL                           | Critical | `site.config.ts` + `blog-grid.tsx`              |
| Pricing              | Missing Emergency Callout + Hourly Rates sections             | High     | `composition.json` + new composables            |

---

## Phase 2 Targets (quick wins — no new composables needed)

These are fixable now without new component builds:

1. `stats-strip.tsx` — white values on inverse background (not red)
2. `hero-section.tsx` — bg-black/70 overlay, noise on image hero
3. `cta-section.tsx` — noise on inverse, subheading contrast
4. `feature-grid.tsx` — noise on inverse, description text contrast
5. `composition.json` — home CTA: "brand" → "inverse"
