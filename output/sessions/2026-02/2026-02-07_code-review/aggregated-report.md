# Aggregated Code Review Report

**Date:** 2026-02-07
**Branch:** develop
**Scope:** full

---

## Executive Summary

| Severity  | Security | Code Quality | A11y/SEO | Architecture | **Total** |
| --------- | -------- | ------------ | -------- | ------------ | --------- |
| Critical  | 0        | 0            | 0        | 4            | **4**     |
| High      | 0        | 5            | 4        | 5            | **14**    |
| Medium    | 5        | 8            | 8        | 3            | **24**    |
| Low       | 3        | 4            | 7        | 3            | **17**    |
| **Total** | **8**    | **17**       | **19**   | **15**       | **59**    |

**Immediate attention required:** 4 CRITICAL architecture findings — the shared `core-components` package contains hardcoded Colossus Scaffolding business data (`services-data.ts`, `services.ts`, `business-config.ts`, `schema.ts`), violating the MDX-only content rule and breaking the white-label architecture. These files must be deleted or genericized before onboarding any new client site.

---

## Cross-Domain Issues

Findings flagged by 2+ agents targeting the same file or concern, merged under the highest severity.

### 1. services-data.ts in core-components (Code Quality + Architecture)

**Severity:** CRITICAL | **Files:** `packages/core-components/src/lib/services-data.ts`

- **Finding IDs:** CQ-004, ARCH-001
- **Summary:** Centralized TypeScript data file with 19 hardcoded scaffolding services violates both the MDX-only content architecture and code quality standards. Both agents independently flagged this as a high-priority deletion.
- **Effort:** medium

### 2. Content-schemas duplication and divergence (Code Quality + Architecture)

**Severity:** HIGH | **Files:** `sites/*/lib/content-schemas.ts`, `packages/core-components/src/lib/content-schemas.ts`

- **Finding IDs:** CQ-001, CQ-002, ARCH-005, ARCH-006
- **Summary:** Content schemas are duplicated in 4 locations despite CHANGELOGs claiming migration is complete. The LocationFrontmatterSchema has structurally diverged between colossus (required hero with `title/description`) and base-template (optional hero with `heading/subheading`). Both agents flagged duplication and drift.
- **Effort:** large (requires schema reconciliation + MDX frontmatter updates)

### 3. content.ts and utility file duplication (Code Quality + Architecture)

**Severity:** HIGH | **Files:** `sites/*/lib/content.ts`, `sites/*/lib/csrf.ts`, `sites/*/lib/anchor-text.ts`, `sites/*/lib/image.ts`

- **Finding IDs:** CQ-003, CQ-008, CQ-009, ARCH-009
- **Summary:** Multiple lib files are verbatim copies across all three sites despite canonical versions in core-components. Both agents identified this as the dominant maintenance burden.
- **Effort:** large (systematic sweep needed)

### 4. Colossus hardcoding in core-components analytics (Architecture + Code Quality)

**Severity:** MEDIUM | **Files:** `packages/core-components/src/lib/analytics/facebook.ts`, `packages/core-components/src/lib/analytics/dataLayer.ts`

- **Finding IDs:** ARCH-008, ARCH-011, CQ-007
- **Summary:** Analytics modules in the shared package hardcode "Scaffolding Services" category and have unguarded console.log statements. Non-scaffolding sites would get incorrect analytics data.
- **Effort:** small

### 5. Hardcoded hex colors in colossus layout critical CSS (A11y/SEO + Architecture)

**Severity:** MEDIUM | **Files:** `sites/colossus-reference/app/layout.tsx`

- **Finding IDs:** SEO-007, CQ-011
- **Summary:** The colossus layout uses both inline styles and hardcoded hex colors in the critical CSS block, contradicting both Tailwind-only and theme-token-only rules.
- **Effort:** small

### 6. Contact page "use client" prevents metadata + SSR schema (A11y/SEO)

**Severity:** HIGH | **Files:** `sites/colossus-reference/app/contact/page.tsx`, `sites/smiths-electrical-cambridge/app/contact/page.tsx`

- **Finding IDs:** SEO-001, SEO-011
- **Summary:** Contact pages are client components, preventing page-specific metadata and server-rendered structured data. Single refactor (extract form to client child) resolves both findings.
- **Effort:** medium

---

## All Findings by Severity

### CRITICAL (4)

| ID       | Domain       | File                                                  | Issue                                                  |
| -------- | ------------ | ----------------------------------------------------- | ------------------------------------------------------ |
| ARCH-001 | Architecture | `packages/core-components/src/lib/services-data.ts`   | Hardcoded scaffolding service data in shared package   |
| ARCH-002 | Architecture | `packages/core-components/src/lib/services.ts`        | Hardcoded service list in shared package               |
| ARCH-003 | Architecture | `packages/core-components/src/lib/business-config.ts` | Colossus business data in shared package               |
| ARCH-004 | Architecture | `packages/core-components/src/lib/schema.ts`          | Hardcoded Colossus Schema.org markup in shared package |

### HIGH (14)

| ID       | Domain       | File                                                               | Issue                                                  |
| -------- | ------------ | ------------------------------------------------------------------ | ------------------------------------------------------ |
| CQ-001   | Code Quality | `sites/*/lib/content-schemas.ts`                                   | content-schemas.ts duplicated across all sites         |
| CQ-002   | Code Quality | `sites/*/lib/content-schemas.ts`                                   | LocationFrontmatterSchema has silently diverged        |
| CQ-003   | Code Quality | `sites/*/lib/content.ts`                                           | content.ts duplicated across all three sites           |
| CQ-004   | Code Quality | `packages/core-components/src/lib/services-data.ts`                | services-data.ts violates MDX-only architecture        |
| CQ-005   | Code Quality | `sites/*/lib/validators/`                                          | Validator files duplicated across all sites            |
| A11Y-001 | A11y/SEO     | `sites/colossus-reference/app/services/page.tsx`                   | Decorative SVGs missing aria-hidden                    |
| A11Y-002 | A11y/SEO     | `sites/colossus-reference/app/reviews/page.tsx`                    | Star rating SVGs missing aria-hidden + accessible text |
| SEO-001  | A11y/SEO     | `sites/*/app/contact/page.tsx`                                     | Contact pages have no page-specific metadata           |
| SEO-002  | A11y/SEO     | `sites/colossus-reference/app/sitemap.ts`                          | Reviews page missing from sitemap                      |
| ARCH-005 | Architecture | `sites/*/lib/content-schemas.ts`                                   | Content schemas duplicated despite canonical in core   |
| ARCH-006 | Architecture | `sites/*/lib/content-schemas.ts`                                   | LocationFrontmatterSchema structural divergence        |
| ARCH-007 | Architecture | `packages/core-components/src/components/ui/services-overview.tsx` | Hardcoded Colossus service slugs                       |
| ARCH-008 | Architecture | 42 files in `packages/core-components/src/`                        | Scaffolding-specific content in shared package         |
| ARCH-009 | Architecture | `sites/*/lib/`                                                     | Content utility files duplicated across all sites      |

### MEDIUM (24)

| ID       | Domain       | Issue Summary                                        |
| -------- | ------------ | ---------------------------------------------------- |
| SEC-001  | Security     | Analytics track endpoint uses insecure IP extraction |
| SEC-002  | Security     | Analytics GET endpoint exposes config in production  |
| SEC-003  | Security     | Rate limiting disabled by default on base-template   |
| SEC-004  | Security     | CSRF token endpoints missing Cache-Control headers   |
| SEC-005  | Security     | In-memory rate limiter ineffective in serverless     |
| CQ-006   | Code Quality | console.log in production API routes logging PII     |
| CQ-007   | Code Quality | console.log in core-components not debug-guarded     |
| CQ-008   | Code Quality | anchor-text.ts duplicated across all sites           |
| CQ-009   | Code Quality | csrf.ts duplicated across sites                      |
| CQ-010   | Code Quality | analytics/types.ts duplicated across sites           |
| CQ-011   | Code Quality | Inline styles in colossus layout.tsx                 |
| CQ-012   | Code Quality | Inline styles in HeroV3 and CoverageMap              |
| CQ-013   | Code Quality | validate-quality.ts script duplicated                |
| SEO-003  | A11y/SEO     | Reviews page title exceeds 60 chars                  |
| SEO-004  | A11y/SEO     | Reviews page missing canonical URL                   |
| SEO-005  | A11y/SEO     | Location FAQ heading keyword-stuffed                 |
| A11Y-003 | A11y/SEO     | Location page arrow SVGs missing aria-hidden         |
| A11Y-004 | A11y/SEO     | Service page back-arrow SVG missing aria-hidden      |
| A11Y-005 | A11y/SEO     | Blog post related-services SVG missing aria-hidden   |
| A11Y-006 | A11y/SEO     | Mobile menu chevron SVG missing aria-hidden          |
| SEO-006  | A11y/SEO     | Smiths missing userScalable:true in viewport         |
| SEO-007  | A11y/SEO     | Colossus critical CSS hardcodes hex colors           |
| SEO-008  | A11y/SEO     | Homepage title exceeds 60 chars                      |
| ARCH-010 | Architecture | Hardcoded county slugs in location utility           |
| ARCH-011 | Architecture | Facebook analytics hardcodes "Scaffolding Services"  |
| ARCH-012 | Architecture | image.ts hardcodes "Colossus Scaffolding" brand      |

### LOW (17)

| ID       | Domain       | Issue Summary                                 |
| -------- | ------------ | --------------------------------------------- |
| SEC-006  | Security     | colossus-reference missing middleware.ts      |
| SEC-007  | Security     | CSRF_SECRET not in .env.example               |
| SEC-008  | Security     | Email confirmation to unverified addresses    |
| CQ-014   | Code Quality | TypeScript `any` in test file                 |
| CQ-015   | Code Quality | Colossus analytics files duplicated from core |
| CQ-016   | Code Quality | Colossus utility files duplicated from core   |
| CQ-017   | Code Quality | mdx-components.tsx 955 lines in colossus      |
| SEO-009  | A11y/SEO     | Contact page sitemap (informational)          |
| A11Y-007 | A11y/SEO     | LocationsDropdown missing aria-controls       |
| A11Y-008 | A11y/SEO     | Footer heading levels skip                    |
| SEO-010  | A11y/SEO     | OG images may reference missing file          |
| SEO-011  | A11y/SEO     | Contact page use client prevents SSR schema   |
| SEO-012  | A11y/SEO     | About page title exceeds 60 chars             |
| SEO-013  | A11y/SEO     | Services page title duplicates homepage       |
| A11Y-009 | A11y/SEO     | Certificate lightbox SVGs missing aria-hidden |
| A11Y-010 | A11y/SEO     | Lucide icons may lack aria-hidden             |
| SEO-014  | A11y/SEO     | Smiths missing ConsentManager/Analytics       |
| SEO-015  | A11y/SEO     | Location keywords string vs array             |
| ARCH-013 | Architecture | CHANGELOGs claim migration that didn't happen |
| ARCH-014 | Architecture | Default export in type declaration            |
| ARCH-015 | Architecture | scaffoldingImageConfig industry-specific name |

---

## Per-Domain Breakdown

### Security (8 findings)

**Key themes:** Analytics endpoint security gaps, CSRF caching, rate limiting defaults

**Quick wins:**

- SEC-001: Use existing `extractClientIp()` in analytics route (trivial)
- SEC-002: Add `NODE_ENV` check to analytics GET handler (trivial)
- SEC-003: Change `rateLimit: false` to `true` in base-template (trivial)
- SEC-004: Add Cache-Control headers to CSRF endpoints (trivial)

**Priority fixes:**

- SEC-005: Replace in-memory rate limiter with Supabase-backed one (small)

---

### Code Quality (17 findings)

**Key themes:** Massive code duplication (14/17 findings are duplication-related), console.log in production, inline styles

**Quick wins:**

- CQ-008: Delete site-level anchor-text.ts copies (trivial)
- CQ-009: Delete site-level csrf.ts copies (trivial)
- CQ-010: Delete site-level analytics/types.ts copies (trivial)
- CQ-011: Replace inline styles with Tailwind classes (trivial)
- CQ-014: Replace `any` with proper interface in test (trivial)

**Priority fixes:**

- CQ-001/002: Reconcile and centralize content-schemas (medium)
- CQ-003: Centralize content.ts utilities (medium)
- CQ-004: Delete services-data.ts after verifying MDX migration (medium)
- CQ-006: Remove PII from production console.log (small)

---

### Accessibility & SEO (19 findings)

**Key themes:** Missing aria-hidden on decorative SVGs, contact page metadata gap, page title length violations

**Quick wins:**

- A11Y-001/003/004/005: Add aria-hidden to decorative SVGs (trivial each)
- SEO-002: Add /reviews to sitemap (trivial)
- SEO-003/008/012: Shorten page titles (trivial each)
- SEO-004: Add canonical URL to reviews page (trivial)
- SEO-006: Add userScalable:true to smiths viewport (trivial)

**Priority fixes:**

- SEO-001: Refactor contact page from client to server component (medium)
- A11Y-002: Add accessible text to star ratings (small)
- A11Y-006: Add aria-expanded to mobile menu (small)

---

### Architecture (15 findings)

**Key themes:** Colossus data contamination of shared package (4 CRITICAL), code duplication, schema divergence

**Quick wins:**

- ARCH-002: Delete `services.ts` from core-components (small)
- ARCH-003: Delete `business-config.ts` from core-components (small)
- ARCH-013: Fix inaccurate CHANGELOGs (trivial)
- ARCH-014: Fix default export in type declaration (trivial)
- ARCH-015: Rename scaffoldingImageConfig (trivial)

**Priority fixes:**

- ARCH-001/004: Delete hardcoded data files from core-components (medium)
- ARCH-007: Genericize ServicesOverview component (medium)
- ARCH-008: Remove scaffolding references from 42 core files (large)
- ARCH-005/006: Centralize content-schemas, reconcile LocationFrontmatter (large)

---

## Recommended Remediation Order

### Immediate (Blocking White-Label Scalability)

1. **ARCH-001/002/003/004** — Delete hardcoded Colossus data files from core-components. These make the platform unusable for non-scaffolding clients.
2. **SEC-003** — Enable rate limiting by default on base-template. Trivial one-line change that protects all new sites.

### This Sprint (High Impact)

3. **CQ-001/002 + ARCH-005/006** — Reconcile LocationFrontmatterSchema divergence and centralize content-schemas. The longer this waits, the harder reconciliation becomes.
4. **SEO-001** — Refactor contact pages from client to server components. Fixes metadata, canonical, and SSR schema in one change.
5. **CQ-008/009/010 + CQ-005** — Delete all trivially duplicated site-level lib files (anchor-text, csrf, analytics/types, validators). Quick wins that reduce maintenance surface.
6. **CQ-006** — Remove PII from production console.log in API routes. GDPR compliance concern.
7. **A11Y-001/002/003/004/005** + **SEO-002/003/004** — Batch all trivial aria-hidden and SEO metadata fixes.

### Next Sprint (Technical Debt)

8. **ARCH-007/008** — Genericize core-components: remove scaffolding references, make components accept business category as props.
9. **CQ-003 + ARCH-009** — Centralize content.ts and other utility files into core-components.
10. **SEC-005** — Replace in-memory analytics rate limiter with Supabase-backed solution.
11. **SEO-007 + CQ-011/012** — Replace hardcoded hex colors and inline styles with theme tokens/Tailwind.

---

## Files

- `findings-security.md` - Full security review details (8 findings)
- `findings-code-quality.md` - Full code quality review details (17 findings)
- `findings-accessibility-seo.md` - Full accessibility and SEO review details (19 findings)
- `findings-architecture.md` - Full architecture review details (15 findings)

---

_Generated by parallel code review agents on 2026-02-07_
