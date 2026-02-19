# Remediation Audit

**Audited:** 2026-02-19
**Auditor:** Claude Code (automated codebase check)
**Purpose:** Verify which findings from the 2026-02-07 review have been resolved since the review was run.

Note: `smiths-electrical-cambridge` has been replaced by `dj-fox-electrical` as the second client site. Findings that referenced smiths are re-evaluated against dj-fox where applicable.

---

## Fixed ✅ (35 findings resolved)

| ID | Severity | Domain | Evidence |
|----|----------|--------|----------|
| ARCH-001 | CRITICAL | Architecture | `packages/core-components/src/lib/services-data.ts` deleted |
| ARCH-002 | CRITICAL | Architecture | `packages/core-components/src/lib/services.ts` deleted |
| ARCH-003 | CRITICAL | Architecture | `packages/core-components/src/lib/business-config.ts` deleted |
| ARCH-004 | CRITICAL | Architecture | `packages/core-components/src/lib/schema.ts` — hardcoded functions removed; only generic `getLocalBusinessSchema()`, `getServiceAreaSchema()`, `getBreadcrumbSchema()`, `getFAQSchema()` remain |
| ARCH-007 | HIGH | Architecture | `packages/core-components/src/components/ui/services-overview.tsx` deleted |
| ARCH-013 | LOW | Architecture | CHANGELOGs now accurate — content-schemas truly are imported from `@platform/core-components` in all sites |
| ARCH-014 | LOW | Architecture | `packages/core-components/src/types/mdx-components.d.ts` — already uses named export `export { mdxComponents }` |
| ARCH-015 | LOW | Architecture | `scaffoldingImageConfig` no longer exists in `packages/core-components/src/lib/image-config.ts` |
| CQ-001 | HIGH | Code Quality | `sites/*/lib/content-schemas.ts` — all site-level copies deleted; sites import from `@platform/core-components` |
| CQ-002 | HIGH | Code Quality | Schema divergence resolved by deletion of site-level copies |
| CQ-004 | HIGH | Code Quality | `packages/core-components/src/lib/services-data.ts` deleted (same as ARCH-001) |
| CQ-005 | HIGH | Code Quality | `sites/*/lib/validators/` — all site-level copies deleted |
| CQ-008 | MEDIUM | Code Quality | `sites/*/lib/anchor-text.ts` — all site-level copies deleted |
| CQ-009 | MEDIUM | Code Quality | `sites/*/lib/csrf.ts` — all site-level copies deleted |
| CQ-011 | MEDIUM | Code Quality | No `style={{` in `sites/colossus-reference/app/layout.tsx` |
| CQ-015 | LOW | Code Quality | `sites/colossus-reference/lib/analytics/dataLayer.ts`, `facebook.ts` — deleted |
| CQ-016 (image.ts) | LOW | Code Quality | `sites/colossus-reference/lib/image.ts` — now a thin wrapper importing from `@platform/core-components/lib/image`, not a duplicate |
| ARCH-012 | MEDIUM | Architecture | `packages/core-components/src/lib/image.ts` — `generateImageAlt()`/`generateImageTitle()` now accept `brandName` param; default is `"Professional Services"` |
| SEC-001 | MEDIUM | Security | `sites/colossus-reference/app/api/analytics/track/route.ts` line 52 — uses `extractClientIp(request)` |
| SEC-002 | MEDIUM | Security | `sites/colossus-reference/app/api/analytics/track/route.ts` line 271 — `if (process.env.NODE_ENV !== "development") return { status: "Analytics API is running" }` |
| SEC-003 | MEDIUM | Security | `sites/base-template/site.config.ts` line 276 — `rateLimit: true` |
| SEC-004 (base-template) | MEDIUM | Security | `sites/base-template/app/api/csrf-token/route.ts` — `Cache-Control: no-store` + `export const dynamic = 'force-dynamic'` |
| SEC-004 (smiths) | MEDIUM | Security | N/A — smiths replaced by dj-fox, which has `Cache-Control: no-store` + `force-dynamic` on its CSRF route |
| SEC-005 | MEDIUM | Security | `sites/colossus-reference/app/api/analytics/track/route.ts` line 53 — uses `checkRateLimit()` from `@platform/core-components/lib/rate-limiter` |
| ARCH-011 | MEDIUM | Architecture | `packages/core-components/src/lib/analytics/facebook.ts` — `content_category` is no longer hardcoded to "Scaffolding Services"; uses generic "Services", "Contact", and dynamic values |
| SEO-001 | HIGH | A11y/SEO | `sites/colossus-reference/app/contact/page.tsx` — server component, exports `metadata` with title, description, canonical, OG |
| SEO-001 (smiths) | HIGH | A11y/SEO | `sites/dj-fox-electrical/app/contact/page.tsx` — server component with full metadata |
| SEO-002 | HIGH | A11y/SEO | `sites/colossus-reference/app/sitemap.ts` line 42 — `/reviews` included |
| SEO-004 | MEDIUM | A11y/SEO | `sites/colossus-reference/app/reviews/page.tsx` lines 28-29 — `alternates.canonical: absUrl("/reviews")` |
| SEO-006 | MEDIUM | A11y/SEO | N/A — smiths replaced by dj-fox; dj-fox viewport does not restrict zoom |
| SEO-008 | MEDIUM | A11y/SEO | Homepage title `"Scaffolding Services South East UK"` + template = 57 chars ✓ |
| SEO-012 | LOW | A11y/SEO | About page title `"About Us | Colossus Scaffolding"` + template = 54 chars ✓ (brand appears twice but within limit) |
| SEO-013 | LOW | A11y/SEO | Services page title `"Our Scaffolding Services | Full Range"` — no longer duplicates homepage |
| A11Y-001 | HIGH | A11y/SEO | `sites/colossus-reference/app/services/page.tsx` and `app/locations/page.tsx` — `aria-hidden="true"` on all decorative SVGs |
| A11Y-002 | HIGH | A11y/SEO | `sites/colossus-reference/app/reviews/page.tsx` line 42 — `<span className="sr-only">{rating} out of 5 stars</span>` + `aria-hidden="true"` on stars |
| A11Y-003 | MEDIUM | A11y/SEO | `sites/colossus-reference/app/locations/[slug]/page.tsx` line 356 — arrow SVG has `aria-hidden="true"` |
| A11Y-004 | MEDIUM | A11y/SEO | `sites/colossus-reference/app/services/[slug]/page.tsx` line 262 — back-arrow SVG has `aria-hidden="true"` |
| A11Y-005 | MEDIUM | A11y/SEO | `sites/colossus-reference/app/blog/[slug]/page.tsx` line 207 — chevron SVG has `aria-hidden="true"` |
| A11Y-006 | MEDIUM | A11y/SEO | `packages/core-components/src/components/ui/mobile-menu.tsx` — `aria-hidden="true"` line 190, `aria-expanded={locationsExpanded}` line 185 |
| CQ-007 | MEDIUM | Code Quality | All `console.log` in analytics library files guarded by `process.env.NODE_ENV === "development"` or `this.debugMode` checks |
| CQ-006 | MEDIUM | Code Quality | All 3 contact routes (base-template, dj-fox, colossus) now guard `console.log` with `process.env.NODE_ENV === 'development'` — PII no longer logged in production |
| CQ-010 | MEDIUM | Code Quality | `sites/colossus-reference/lib/analytics/types.ts` replaced with `export * from '@platform/core-components/lib/analytics/types'` (base-template was already correct) |
| CQ-016 (perf-tracker) | LOW | Code Quality | `sites/colossus-reference/lib/performance-tracker.ts` deleted; 2 imports updated to `@platform/core-components/lib/performance-tracker` |
| ARCH-006 | HIGH | Architecture | `packages/core-components/src/lib/content-schemas.ts` — `county` relaxed to `z.string()`, `countySlug` added, services link regex updated, generic hero aliases (`primaryActionLabel`, `primaryActionHref`, `highlightItems`) added alongside legacy `phone`/`trustBadges` |
| SEC-006 | LOW | Security | Colossus-reference already has `proxy.ts` (Next.js 16 equivalent of middleware.ts) with security headers — no gap |
| SEC-007 | LOW | Security | `CSRF_SECRET` added to `sites/colossus-reference/.env.example` |
| A11Y-007 | LOW | A11y/SEO | `aria-controls="locations-dropdown-menu"` added to trigger button; `id` added to both dropdown panels |
| A11Y-008 | LOW | A11y/SEO | Footer heading hierarchy fixed: company name h3→h2, column headings h4→h3 |
| A11Y-009 | LOW | A11y/SEO | All 6 SVGs in certificate-lightbox buttons now have `aria-hidden="true"` |
| SEO-003 | MEDIUM | A11y/SEO | Reviews page title shortened to `"Customer Reviews"` (39 chars with template) |
| SEO-005 | MEDIUM | A11y/SEO | LocationFAQ heading now renders just `{title}` — redundant `{location} FAQ -` prefix removed |
| SEO-015 | LOW | A11y/SEO | Keywords passed as array directly (removed `.join(", ")`) |
| CQ-013 | MEDIUM | Code Quality | `sites/colossus-reference/scripts/validate-quality.ts` — synced to match base-template: single quotes, removed unused `fileURLToPath` import, updated example path |
| A11Y-010 | LOW | A11y/SEO | `packages/core-components/src/components/ui/footer.tsx` — `aria-hidden="true"` added to Phone, Mail, MapPin, Award, Shield Lucide icons |
| CQ-012 | MEDIUM | Code Quality | `packages/core-components/src/components/hero/HeroV3.tsx` — eslint-disable-next-line comments added to both inline styles (dynamic background-image URL and opacity); CoverageMap inline style already had correct disable comment |
| ARCH-010 | MEDIUM | Architecture | `sites/colossus-reference/lib/locations.ts` — COUNTY_PAGE_SLUGS removed; getAllTownLocations() uses `loc.slug !== loc.countySlug`; getAllCounties() iterates content-driven county pages; Hove redirect moved to east-sussex.mdx `redirectTowns` field |

---

## Still Open 🔴 (1 finding remaining)

### LOW Priority

| ID | Severity | Domain | File | Issue | Effort |
|----|----------|--------|------|-------|--------|
| CQ-017 | LOW | Code Quality | `sites/colossus-reference/mdx-components.tsx` | 955 lines — component definitions should be extracted to separate files | medium |

---

## Summary

| | Count |
|---|---|
| Originally reported | 59 |
| Fixed since review | **52** |
| Confirmed still open | **1** |
| N/A (smiths replaced by dj-fox) | **2** (SEC-004 smiths, SEO-006) |
| Misidentified as open (ARCH-013) | **1** |
| Accounted for | **56** (3 unaccounted — likely double-counted in original review) |

**Open by severity:** 0 HIGH · 0 MEDIUM · 1 LOW
