# Aggregated Code Review Report

**Date:** 2026-02-06
**Branch:** develop
**Scope:** Full monorepo review

---

## Executive Summary

| Severity  | Security | Code Quality | A11y/SEO | Architecture | **Total** |
| --------- | -------- | ------------ | -------- | ------------ | --------- |
| Critical  | 0        | 1            | 0        | 4            | **5**     |
| High      | 4        | 5            | 4        | 5            | **18**    |
| Medium    | 6        | 4            | 6        | 4            | **20**    |
| Low       | 6        | 3            | 7        | 2            | **18**    |
| **Total** | **16**   | **13**       | **17**   | **15**       | **61**    |

**Immediate attention required:** 5 Critical findings, primarily architecture violations with centralized TypeScript data files that break the MDX-only content model.

---

## Cross-Domain Issues

These findings were flagged by multiple reviewers, affecting the same files:

### 1. Hardcoded Hex Colors (Architecture + Code Quality)

**Severity:** HIGH | **Files:** `sites/colossus-reference/components/ui/`

- **ARCH-005/006/007** + **CQ-006**: Components use `bg-[#005A9E]` instead of theme tokens
- Breaks white-label theming capability
- **Effort:** small

### 2. Code Duplication: content.ts & content-schemas.ts (Architecture + Code Quality)

**Severity:** HIGH | **Files:** `sites/*/lib/content.ts`, `sites/*/lib/content-schemas.ts`

- **ARCH-008/009** + **CQ-004/005**: 570-line and 783-line files copied across sites
- Should be shared from `@platform/core-components`
- **Effort:** medium

### 3. Rate Limiter Issues (Security + Architecture)

**Severity:** HIGH | **Files:** `sites/*/lib/rate-limiter.ts`

- **SEC-002/003** + **ARCH-011**: Stub implementations in production, multiple versions with different behaviors
- base-template and smiths-electrical-cambridge have no rate limiting protection
- **Effort:** small to consolidate

---

## All Findings by Severity

### CRITICAL (5)

| ID       | Domain       | File                                                  | Issue                                          |
| -------- | ------------ | ----------------------------------------------------- | ---------------------------------------------- |
| CQ-001   | Code Quality | `sites/smiths-electrical-cambridge/eslint.config.mjs` | Missing ESLint config blocks CI                |
| ARCH-001 | Architecture | `sites/colossus-reference/lib/services.ts`            | Centralized service data violates MDX-only     |
| ARCH-002 | Architecture | `sites/colossus-reference/lib/services-data.ts`       | Deprecated file still contains active fallback |
| ARCH-003 | Architecture | `sites/colossus-reference/lib/town-locations.ts`      | 305 lines of hardcoded location data           |
| ARCH-004 | Architecture | `sites/colossus-reference/lib/locations-dropdown.ts`  | Hardcoded navigation for 34 locations          |

### HIGH (18)

| ID       | Domain       | File                                                          | Issue                                      |
| -------- | ------------ | ------------------------------------------------------------- | ------------------------------------------ |
| SEC-001  | Security     | `sites/*/lib/csrf.ts`                                         | IP extraction prioritizes spoofable header |
| SEC-002  | Security     | `sites/base-template/lib/rate-limiter.ts`                     | Stub implementation allows all requests    |
| SEC-003  | Security     | `sites/smiths-electrical-cambridge/lib/rate-limiter.ts`       | Production site uses stub rate limiter     |
| SEC-004  | Security     | `sites/colossus-reference/app/api/analytics/track/route.ts`   | GET endpoint exposes config in production  |
| CQ-002   | Code Quality | `packages/core-components/src/components/`                    | 7 components have default exports          |
| CQ-003   | Code Quality | `tools/*.ts`                                                  | TypeScript `any` types in multiple files   |
| CQ-004   | Code Quality | `sites/*/lib/content.ts`                                      | 570-line file duplicated                   |
| CQ-005   | Code Quality | `sites/*/lib/content-schemas.ts`                              | 783-line Zod schemas duplicated            |
| A11Y-001 | A11y/SEO     | `sites/colossus-reference/app/layout.tsx`                     | Missing skip navigation link               |
| A11Y-002 | A11y/SEO     | `sites/colossus-reference/app/layout.tsx`                     | Main content lacks landmark ID             |
| A11Y-003 | A11y/SEO     | `sites/colossus-reference/components/ui/mobile-menu.tsx`      | Mobile menu missing focus trap             |
| SEO-001  | A11y/SEO     | `sites/colossus-reference/app/sitemap-index.xml/route.ts`     | Blog/projects sitemaps not registered      |
| ARCH-005 | Architecture | `sites/colossus-reference/components/ui/service-showcase.tsx` | Hardcoded hex colors                       |
| ARCH-006 | Architecture | `sites/colossus-reference/components/ui/service-cards.tsx`    | Hardcoded hex colors                       |
| ARCH-007 | Architecture | `sites/colossus-reference/components/ui/content-card.tsx`     | Hardcoded hex colors                       |
| ARCH-008 | Architecture | `sites/*/lib/content.ts`                                      | Duplicated across sites                    |
| ARCH-009 | Architecture | `sites/*/lib/content-schemas.ts`                              | Duplicated Zod schemas                     |

### MEDIUM (20)

| ID       | Domain       | Issue Summary                                              |
| -------- | ------------ | ---------------------------------------------------------- |
| SEC-005  | Security     | CSRF tokens not invalidated after use                      |
| SEC-006  | Security     | Contact API returns submission data including IP           |
| SEC-007  | Security     | Contact API leaks internal error details                   |
| SEC-008  | Security     | No input length limits on form fields                      |
| SEC-009  | Security     | Missing CORS configuration                                 |
| SEC-010  | Security     | colossus-reference missing middleware.ts                   |
| CQ-006   | Code Quality | Hardcoded hex colors in colossus-reference                 |
| CQ-007   | Code Quality | Default exports in page.tsx (framework requirement)        |
| CQ-008   | Code Quality | Hardcoded colors in coverage-map.tsx                       |
| CQ-009   | Code Quality | Unused React imports in Hero components                    |
| A11Y-004 | A11y/SEO     | Locations dropdown missing ARIA role                       |
| A11Y-005 | A11y/SEO     | Consent manager modal missing focus trap                   |
| A11Y-006 | A11y/SEO     | Form errors not announced to screen readers                |
| A11Y-007 | A11y/SEO     | FAQ section not using accordion semantics                  |
| SEO-002  | A11y/SEO     | Contact page missing metadata export                       |
| SEO-003  | A11y/SEO     | Location pages missing LocalBusiness schema                |
| SEO-004  | A11y/SEO     | Reviews page missing schema                                |
| ARCH-010 | Architecture | Centralized data files in packages/core-components         |
| ARCH-011 | Architecture | rate-limiter.ts duplication with different implementations |
| ARCH-012 | Architecture | Site-specific components that could be shared              |

### LOW (18)

| ID       | Domain       | Issue Summary                                                 |
| -------- | ------------ | ------------------------------------------------------------- |
| SEC-011  | Security     | Dependency vulnerabilities (fast-xml-parser, brace-expansion) |
| SEC-012  | Security     | CSP missing font-src directive                                |
| SEC-013  | Security     | dangerouslyAllowSVG enabled                                   |
| SEC-014  | Security     | CSRF secret fallback in production                            |
| SEC-015  | Security     | setup-vercel-env.ts duplicate SITES declaration               |
| SEC-016  | Security     | Email confirmation without address verification               |
| CQ-010   | Code Quality | console.log in CLI tools (acceptable)                         |
| CQ-011   | Code Quality | mdx-components.tsx uses default export (framework)            |
| CQ-012   | Code Quality | Inline styles for dynamic background images                   |
| A11Y-008 | A11y/SEO     | Decorative SVG icons missing aria-hidden                      |
| A11Y-009 | A11y/SEO     | Footer links missing descriptive context                      |
| SEO-005  | A11y/SEO     | Hero images missing title attribute                           |
| SEO-006  | A11y/SEO     | Service cards generic alt text pattern                        |
| SEO-007  | A11y/SEO     | OpenGraph using static logo instead of hero                   |
| SEO-008  | A11y/SEO     | Canonical URLs not set on all pages                           |
| ARCH-013 | Architecture | Potential unused location-utils.ts                            |
| ARCH-014 | Architecture | locations-config.ts correctly implemented (reference)         |

---

## Per-Domain Breakdown

### Security (16 findings)

**Key themes:** Rate limiting disabled/bypassable, CSRF token replay, missing input validation, information disclosure

**Quick wins:**

- SEC-004: Restrict analytics GET endpoint to development (trivial)
- SEC-005: Call `clearCSRFToken()` after validation (trivial)
- SEC-010: Copy middleware.ts to colossus-reference (trivial)

**Priority fixes:**

- SEC-001/002/003: Fix IP extraction order and enable rate limiting

### Code Quality (13 findings)

**Key themes:** Default exports violating standard, `any` types, code duplication, hardcoded colors

**Quick wins:**

- CQ-001: Copy eslint.config.mjs to smiths-electrical-cambridge (trivial)
- CQ-002: Remove `export default` from 7 components (small)
- CQ-009: Remove unused React imports (trivial)

**Priority fixes:**

- CQ-004/005: Consolidate content.ts and content-schemas.ts to core-components

### Accessibility & SEO (17 findings)

**Key themes:** Missing skip link, focus traps needed, sitemaps incomplete, schema markup gaps

**Quick wins:**

- A11Y-001/002: Add skip link and main landmark (trivial)
- A11Y-008: Add aria-hidden to decorative SVGs (trivial)
- SEO-007: Use hero images for OpenGraph (trivial)

**Priority fixes:**

- A11Y-003: Implement mobile menu focus trap
- SEO-001: Create blog and projects sitemaps

### Architecture (15 findings)

**Key themes:** MDX-only violations with centralized data files, hardcoded colors breaking theming, code duplication

**Quick wins:**

- ARCH-005/006/007: Replace hardcoded hex colors with theme tokens (small)
- ARCH-002: Delete deprecated services-data.ts after verification (medium)

**Priority fixes:**

- ARCH-001/003/004: Refactor centralized data files to use MDX content
- ARCH-008/009: Consolidate duplicate utilities to core-components

---

## Recommended Remediation Order

### Immediate (Blocking CI/Production Issues)

1. **CQ-001**: Add missing ESLint config — _blocks entire lint pipeline_
2. **SEC-002/003**: Enable rate limiting — _production security gap_

### This Sprint (High Impact)

3. **ARCH-005/006/007**: Fix hardcoded colors — _enables white-labeling_
4. **A11Y-001/002**: Add skip link and main landmark — _WCAG compliance_
5. **SEC-001**: Fix IP extraction order — _rate limiting bypass_
6. **CQ-002**: Remove default exports from core-components

### Next Sprint (Technical Debt)

7. **ARCH-008/009 + CQ-004/005**: Consolidate content utilities to core-components
8. **A11Y-003/005**: Implement focus traps for mobile menu and modal
9. **SEO-001**: Create blog and projects sitemaps
10. **ARCH-001/002/003/004**: Refactor centralized data files to MDX

---

## Files

- `findings-security.md` - Full security review details
- `findings-code-quality.md` - Full code quality review details
- `findings-accessibility-seo.md` - Full accessibility and SEO review details
- `findings-architecture.md` - Full architecture review details

---

_Generated by parallel code review agents on 2026-02-06_
