# Aggregated Code Review Report

**Date:** 2026-02-06
**Branch:** develop
**Scope:** full

---

## Executive Summary

| Severity  | Security | Code Quality | A11y/SEO | Architecture | **Total** |
| --------- | -------- | ------------ | -------- | ------------ | --------- |
| Critical  | 0        | 0            | 2        | 4            | **6**     |
| High      | 4        | 4            | 6        | 6            | **20**    |
| Medium    | 7        | 6            | 9        | 4            | **26**    |
| Low       | 7        | 3            | 7        | 2            | **19**    |
| **Total** | **18**   | **13**       | **24**   | **16**       | **71**    |

**Immediate attention required:** 6 CRITICAL findings — 4 architecture violations (hardcoded data files violating MDX-only rule) and 2 accessibility failures (missing skip navigation link and missing `<main>` landmark in colossus-reference).

---

## Cross-Domain Issues

Findings flagged by 2+ agents targeting the same file or pattern.

### 1. Hardcoded Hex Colors in Colossus Components (Code Quality + Architecture)

**Severity:** HIGH | **Files:** `sites/colossus-reference/components/ui/service-showcase.tsx`, `service-cards.tsx`, `content-card.tsx`

- **Finding IDs:** CQ-002, ARCH-006
- **Summary:** 10-11 instances of `bg-[#005A9E]` hardcoded hex colors that break white-label theming
- **Effort:** small

### 2. Deprecated Data Files Still Present (Code Quality + Architecture)

**Severity:** CRITICAL | **Files:** `sites/colossus-reference/lib/services-data.ts`, `services.ts`, `packages/core-components/src/lib/services-data.ts`

- **Finding IDs:** CQ-005, ARCH-001, ARCH-002
- **Summary:** Centralized TypeScript data files that violate the MDX-only content rule, marked deprecated but not deleted
- **Effort:** small

### 3. Dead Code page-old.tsx (Code Quality + Architecture)

**Severity:** MEDIUM/HIGH | **File:** `sites/colossus-reference/app/services/[slug]/page-old.tsx`

- **Finding IDs:** CQ-006, ARCH-005
- **Summary:** 1042-line dead file with hardcoded service data anti-pattern
- **Effort:** trivial

### 4. Code Duplication Across Sites (Code Quality + Architecture)

**Severity:** HIGH | **Files:** `content.ts`, `content-schemas.ts`, `validators/`, `contact-info.ts` across all 3 sites

- **Finding IDs:** CQ-003, CQ-013, ARCH-008, ARCH-009, ARCH-010, ARCH-012
- **Summary:** 5000+ lines of identical code duplicated across sites that should be in packages/
- **Effort:** large

### 5. Default Exports in Core Components (Code Quality)

**Severity:** HIGH | **Files:** `packages/core-components/src/components/`

- **Finding IDs:** CQ-001
- **Summary:** 7 components use default exports, violating project standard
- **Effort:** small

### 6. Rate Limiting Disabled (Security)

**Severity:** HIGH | **Files:** `sites/base-template/lib/rate-limiter.ts`, `sites/smiths-electrical-cambridge/lib/rate-limiter.ts`

- **Finding IDs:** SEC-002, SEC-003
- **Summary:** Stub rate limiters always return success, leaving contact forms unprotected
- **Effort:** small

---

## All Findings by Severity

### CRITICAL (6)

| ID       | Domain       | File                                                 | Issue                                           |
| -------- | ------------ | ---------------------------------------------------- | ----------------------------------------------- |
| ARCH-001 | Architecture | `sites/colossus-reference/lib/services.ts`           | Centralized service data violates MDX-only rule |
| ARCH-002 | Architecture | `sites/colossus-reference/lib/services-data.ts`      | Deprecated data file still present (180 lines)  |
| ARCH-003 | Architecture | `sites/colossus-reference/lib/town-locations.ts`     | 305 lines of hardcoded town data                |
| ARCH-004 | Architecture | `sites/colossus-reference/lib/locations-dropdown.ts` | Hardcoded location dropdown data (159 lines)    |
| A11Y-001 | A11y/SEO     | `sites/colossus-reference/app/layout.tsx`            | Missing skip navigation link                    |
| A11Y-002 | A11y/SEO     | `sites/colossus-reference/app/layout.tsx`            | Missing `<main>` landmark element               |

### HIGH (20)

| ID       | Domain       | File                                                               | Issue                                         |
| -------- | ------------ | ------------------------------------------------------------------ | --------------------------------------------- |
| SEC-001  | Security     | `sites/*/lib/csrf.ts`                                              | IP extraction prioritizes spoofable header    |
| SEC-002  | Security     | `sites/base-template/lib/rate-limiter.ts`                          | Stub rate limiter (always allows)             |
| SEC-003  | Security     | `sites/smiths-electrical-cambridge/lib/rate-limiter.ts`            | Stub rate limiter (always allows)             |
| SEC-004  | Security     | `sites/colossus-reference/app/api/analytics/track/route.ts`        | GET endpoint exposes config in production     |
| CQ-001   | Code Quality | `packages/core-components/src/components/`                         | 7 default exports violating named-only rule   |
| CQ-002   | Code Quality | `sites/colossus-reference/components/ui/`                          | 10 hardcoded hex colors (#005A9E)             |
| CQ-003   | Code Quality | Multiple sites                                                     | 5000+ lines of duplicated code                |
| CQ-004   | Code Quality | `sites/colossus-reference/app/locations/[slug]/page.tsx`           | 4 `as any` type assertions                    |
| A11Y-003 | A11y/SEO     | `sites/*/components/ui/mobile-menu.tsx`                            | Mobile menu lacks focus trap                  |
| A11Y-004 | A11y/SEO     | `sites/colossus-reference/components/ui/locations-dropdown.tsx`    | Dropdown missing ARIA roles                   |
| A11Y-005 | A11y/SEO     | Multiple colossus-reference files                                  | Decorative SVGs missing aria-hidden           |
| A11Y-006 | A11y/SEO     | `sites/colossus-reference/app/contact/page.tsx`                    | Form errors not announced to screen readers   |
| A11Y-007 | A11y/SEO     | `sites/colossus-reference/components/analytics/ConsentManager.tsx` | Consent banner lacks focus management         |
| SEO-001  | A11y/SEO     | `sites/colossus-reference/app/sitemap-index.xml/route.ts`          | Blog/projects sitemaps missing                |
| SEO-002  | A11y/SEO     | Multiple colossus-reference pages                                  | Page titles exceed 60-char limit              |
| ARCH-005 | Architecture | `sites/colossus-reference/app/services/[slug]/page-old.tsx`        | Dead 1042-line file                           |
| ARCH-006 | Architecture | `sites/colossus-reference/components/ui/`                          | Hardcoded hex colors break theming            |
| ARCH-007 | Architecture | `sites/colossus-reference/app/services/[slug]/[location]/page.tsx` | Hardcoded location-service map                |
| ARCH-008 | Architecture | `sites/*/lib/content.ts`                                           | content.ts duplicated across 3 sites          |
| ARCH-009 | Architecture | `sites/*/lib/content-schemas.ts`                                   | content-schemas.ts duplicated across 3 sites  |
| ARCH-010 | Architecture | `sites/*/lib/validators/`                                          | Validator framework duplicated across 3 sites |

### MEDIUM (26)

| ID       | Domain       | Issue Summary                                                |
| -------- | ------------ | ------------------------------------------------------------ |
| SEC-005  | Security     | CSRF token comparison not timing-safe                        |
| SEC-006  | Security     | CSRF token not invalidated after use (replay)                |
| SEC-007  | Security     | Contact API returns submission data including IP             |
| SEC-008  | Security     | Contact API leaks internal error details                     |
| SEC-009  | Security     | No input length limits on contact form fields                |
| SEC-010  | Security     | Missing CORS configuration on API routes                     |
| SEC-011  | Security     | Analytics endpoint lacks rate limiting                       |
| CQ-005   | Code Quality | Deprecated centralized data files still present              |
| CQ-006   | Code Quality | Dead page-old.tsx (1042 lines)                               |
| CQ-007   | Code Quality | Inline styles in core components                             |
| CQ-008   | Code Quality | 4 unused imports flagged by ESLint                           |
| CQ-009   | Code Quality | 28 unguarded console statements in production                |
| CQ-010   | Code Quality | 2 stale eslint-disable directives                            |
| A11Y-008 | A11y/SEO     | lang="en" instead of lang="en-GB"                            |
| A11Y-009 | A11y/SEO     | Consent toggle switches lack accessible labels               |
| A11Y-010 | A11y/SEO     | Hero image alt text is static, not context-aware             |
| A11Y-011 | A11y/SEO     | Blog post card images use title as alt text                  |
| SEO-003  | A11y/SEO     | Default meta description too short (55 chars)                |
| SEO-004  | A11y/SEO     | smiths-electrical-cambridge homepage missing structured data |
| SEO-005  | A11y/SEO     | smiths-electrical-cambridge homepage missing metadata        |
| SEO-006  | A11y/SEO     | Hardcoded phone number in FAQ components                     |
| SEO-007  | A11y/SEO     | Relative OpenGraph URLs instead of absolute                  |
| ARCH-011 | Architecture | Non-standard "brand-blue" token (100+ references)            |
| ARCH-012 | Architecture | contact-info.ts duplicated with divergent implementations    |
| ARCH-013 | Architecture | Hardcoded location patterns in location-utils.ts             |
| ARCH-014 | Architecture | core-components contains site-specific data files            |

### LOW (19)

| ID       | Domain       | Issue Summary                                             |
| -------- | ------------ | --------------------------------------------------------- |
| SEC-012  | Security     | colossus-reference missing middleware.ts                  |
| SEC-013  | Security     | 2 dependency vulnerabilities (pnpm audit)                 |
| SEC-014  | Security     | CSP missing font-src directive                            |
| SEC-015  | Security     | dangerouslyAllowSVG enabled in all sites                  |
| SEC-016  | Security     | CSRF secret fallback in production                        |
| SEC-017  | Security     | setup-vercel-env.ts duplicate SITES declaration           |
| SEC-018  | Security     | Email confirmation without address verification           |
| CQ-011   | Code Quality | Colossus branding in shared core components               |
| CQ-012   | Code Quality | Hero components use non-theme Tailwind colors             |
| CQ-013   | Code Quality | Content schemas in 3 locations                            |
| A11Y-012 | A11y/SEO     | Critical CSS removes focus outline                        |
| A11Y-013 | A11y/SEO     | Dropdown doesn't return focus after closing               |
| SEO-008  | A11y/SEO     | Location pages missing LocalBusiness schema conditionally |
| SEO-009  | A11y/SEO     | OG images use static logo instead of hero                 |
| SEO-010  | A11y/SEO     | Missing canonical URLs on services/blog index             |
| SEO-011  | A11y/SEO     | Hero section missing title attribute on images            |
| SEO-012  | A11y/SEO     | Inconsistent sitemap architecture between sites           |
| ARCH-015 | Architecture | bg-gray-50 instead of theme surface token                 |
| ARCH-016 | Architecture | Hardcoded SEO data in anchor-text.ts                      |

---

## Recommended Remediation Order

### Immediate (Blocking CI/Production Issues)

1. **ARCH-001 + ARCH-002 + ARCH-005 + CQ-005 + CQ-006** — Delete dead/deprecated data files (services.ts, services-data.ts, page-old.tsx). Zero risk, removes architecture violations.
2. **SEC-004** — Restrict analytics GET endpoint to development. Trivial fix, stops information disclosure.
3. **SEC-005 + SEC-006** — Fix CSRF timing-safe comparison and single-use tokens. Trivial effort.
4. **CQ-002 + ARCH-006** — Replace hardcoded hex colors with theme tokens. Small effort, fixes white-label breakage.
5. **CQ-001** — Fix default exports in core-components. Small effort.

### This Sprint (High Impact)

6. **SEC-001** — Fix IP extraction header priority. Small effort, fixes rate limiting bypass.
7. **SEC-002 + SEC-003** — Replace stub rate limiters. Small effort, enables security protection.
8. **A11Y-001 + A11Y-002** — Add skip link and `<main>` landmark. Trivial effort, critical a11y.
9. **SEO-002** — Shorten page titles to <60 chars. Trivial effort.
10. **SEO-001** — Create blog/projects sitemaps. Small effort.
11. **CQ-008 + CQ-010** — Remove unused imports and stale directives. Trivial effort.
12. **SEC-007 + SEC-008** — Fix API information disclosure. Trivial effort.

### Next Sprint (Technical Debt)

13. **ARCH-008 + ARCH-009 + ARCH-010 + CQ-003** — Consolidate duplicated code into packages/. Large effort, prevents ongoing drift.
14. **A11Y-003 + A11Y-007** — Focus traps for mobile menu and consent banner. Medium effort.
15. **A11Y-005 + A11Y-006** — SVG aria-hidden and form ARIA. Small effort.
16. **ARCH-011** — Migrate brand-blue to brand-primary. Medium effort (100+ replacements).

---

## Files

- `findings-security.md` - Full security review details (18 findings)
- `findings-code-quality.md` - Full code quality review details (13 findings)
- `findings-accessibility-seo.md` - Full accessibility and SEO review details (24 findings)
- `findings-architecture.md` - Full architecture review details (16 findings)

---

_Generated by parallel code review agents on 2026-02-06_
