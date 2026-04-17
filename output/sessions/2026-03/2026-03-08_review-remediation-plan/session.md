# Review Remediation Plan

**Date:** 2026-03-08
**Status:** Ready for execution
**Source:** Aggregated review from 2026-03-07 (49 findings total)

## Already Fixed (6 findings)

| ID       | Severity | Status                                           |
| -------- | -------- | ------------------------------------------------ |
| SEO-001  | CRITICAL | Merged to develop                                |
| SEO-002  | CRITICAL | Merged to develop                                |
| A11Y-001 | CRITICAL | On feature/cq-007-hardcoded-colors (needs merge) |
| SEC-001  | HIGH     | On feature/cq-007-hardcoded-colors (needs merge) |
| A11Y-002 | HIGH     | On feature/cq-007-hardcoded-colors (needs merge) |
| CQ-007   | HIGH     | On feature/cq-007-hardcoded-colors (needs merge) |

**Pre-requisite:** Merge `feature/cq-007-hardcoded-colors` → `develop` before starting any sessions below.

---

## Remaining Findings: 43 grouped into 6 sessions

### Session 1: Quick Wins — Trivial Fixes (YOLO)

**Effort:** ~30 min | **Findings:** 14 | **Type:** YOLO Brief

Mechanical, isolated changes that don't interact with each other. Perfect for autonomous execution.

| ID       | Severity | Fix                                                                                                                |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| SEC-002  | MEDIUM   | Add `CSRF_SECRET=your-secret-here` to `.env.example` in root, base-template, dj-fox                                |
| SEC-003  | MEDIUM   | Copy security headers from dj-fox `next.config.ts` to `sites/showcase/next.config.ts`                              |
| SEC-004  | MEDIUM   | Sanitize `appName` with regex in `tools/sync-external-services.ts` NRQL query                                      |
| SEC-008  | LOW      | Move NODE_ENV check outside try-catch in analytics debug endpoint                                                  |
| CQ-001   | MEDIUM   | Remove `export default` from `packages/core-components/src/components/ui/accent-underline.tsx`                     |
| CQ-002   | MEDIUM   | Replace inline `style={{}}` in accent-underline.tsx with Tailwind class                                            |
| CQ-006   | MEDIUM   | Add `NODE_ENV !== 'production'` guard to console.log in `sites/*/instrumentation.ts`                               |
| CQ-014   | MEDIUM   | Fix `docs/standards/content.md` — change `services.cards` to `services.items`                                      |
| A11Y-004 | HIGH     | Replace hardcoded `text-slate-*` in `packages/core-components/src/components/ui/breadcrumbs.tsx` with theme tokens |
| A11Y-008 | LOW      | Add `aria-hidden="true"` to phone SVG in mobile menu bottom CTA                                                    |
| A11Y-003 | HIGH     | Add `aria-hidden="true"` to decorative SVGs in faq-section.tsx and blog slug pages                                 |
| SEO-004  | MEDIUM   | Add `/api/` disallow to `sites/colossus-scaffolding/app/robots.ts`                                                 |
| SEO-009  | LOW      | Add `/reviews` to `sites/base-template/app/sitemap.ts` (dj-fox + colossus already have it)                         |
| ARCH-010 | LOW      | Read brand name from `siteConfig` in `image.ts` wrappers instead of hardcoding                                     |

**Brief:** [yolo-brief-session-1.md](yolo-brief-session-1.md)

---

### Session 2: Security Hardening (YOLO)

**Effort:** ~45 min | **Findings:** 3 | **Type:** YOLO Brief

Focused security fixes that are well-scoped but need careful implementation.

| ID      | Severity | Fix                                                                                |
| ------- | -------- | ---------------------------------------------------------------------------------- |
| SEC-005 | MEDIUM   | Add CSRF/Origin validation to `/api/analytics/track` endpoint                      |
| SEC-006 | LOW      | HTML-escape email subject in colossus contact route                                |
| SEC-007 | LOW      | Document in-memory CSRF replay limitation (serverless caveat — no code fix needed) |

**Brief:** [yolo-brief-session-2.md](yolo-brief-session-2.md)

---

### Session 3: SEO & Schema Enhancements (YOLO)

**Effort:** ~1 hr | **Findings:** 4 | **Type:** YOLO Brief

Schema and metadata work — well-defined patterns already exist in colossus.

| ID      | Severity | Fix                                                                                               |
| ------- | -------- | ------------------------------------------------------------------------------------------------- |
| SEO-003 | HIGH     | Add LocalBusiness schema to location pages in base-template + dj-fox (copy pattern from colossus) |
| SEO-005 | MEDIUM   | Complete OG metadata in layout (image/url) — partially covered by SEO-001/002                     |
| SEO-007 | MEDIUM   | Make homepage h1 more keyword-focused across sites                                                |
| SEO-010 | LOW      | Add breadcrumb default fallback in colossus when frontmatter omits it                             |

**Brief:** [yolo-brief-session-3.md](yolo-brief-session-3.md)

---

### Session 4: Accessibility Improvements (YOLO)

**Effort:** ~1 hr | **Findings:** 4 | **Type:** YOLO Brief

Accessibility fixes that are well-scoped with clear patterns.

| ID       | Severity | Fix                                                                      |
| -------- | -------- | ------------------------------------------------------------------------ |
| A11Y-005 | MEDIUM   | Add `role="menu"` and arrow-key keyboard navigation to LocationsDropdown |
| A11Y-006 | MEDIUM   | Add expand/collapse accordion behavior to FAQ section                    |
| A11Y-007 | LOW      | Set `userScalable` explicitly in base-template + dj-fox viewport         |
| A11Y-009 | LOW      | Evaluate DJ Fox `#db0b0b` red contrast; adjust if needed                 |

**Brief:** [yolo-brief-session-4.md](yolo-brief-session-4.md)

---

### Session 5: Console.log Cleanup + Minor Code Quality (YOLO)

**Effort:** ~20 min | **Findings:** 4 | **Type:** YOLO Brief

| ID     | Severity | Fix                                                                      |
| ------ | -------- | ------------------------------------------------------------------------ |
| CQ-003 | MEDIUM   | Gate Analytics.tsx console.log on NODE_ENV (not just debugMode)          |
| CQ-004 | MEDIUM   | Gate google-ads.ts console.log on NODE_ENV                               |
| CQ-005 | MEDIUM   | Gate rate-limiter.ts console.log on NODE_ENV                             |
| CQ-008 | LOW      | Replace hardcoded gray colors in showcase site with theme tokens         |
| CQ-009 | LOW      | Replace hardcoded gray in dj-fox USAGE_EXAMPLES.tsx                      |
| CQ-013 | LOW      | Create theme token for star rating color (text-yellow-400 → theme token) |

**Brief:** [yolo-brief-session-5.md](yolo-brief-session-5.md)

---

### Session 6: Architecture — Code Deduplication (CODEX PEER REVIEW)

**Effort:** Large | **Findings:** 9 | **Type:** Codex Brief

This is the only session that warrants a Codex peer review. It involves extracting shared code into packages — high-risk for breaking imports, changing the build graph, and affecting all three sites simultaneously. The decisions about where to put shared code, how to handle site-specific divergence (especially colossus ContactForm), and how to migrate incrementally are exactly the kind of architectural trade-offs that benefit from dual-model review.

| ID       | Severity | Fix                                                                             |
| -------- | -------- | ------------------------------------------------------------------------------- |
| ARCH-001 | HIGH     | Consolidate `content.ts` into core-components (3 copies → 1)                    |
| ARCH-002 | HIGH     | Accept countyColors as prop in coverage-map.tsx                                 |
| ARCH-003 | HIGH     | Extract mdx-components.tsx to shared package (base-template + dj-fox identical) |
| ARCH-004 | HIGH     | Extract schema.ts to shared package (base-template + dj-fox identical)          |
| ARCH-005 | MEDIUM   | Shared ContactForm with site-specific variants                                  |
| ARCH-006 | MEDIUM   | Shared contact API route (base-template + dj-fox identical, colossus diverged)  |
| ARCH-007 | MEDIUM   | CSRF token route factory function                                               |
| ARCH-008 | MEDIUM   | Remove colossus dual-config (business-config.ts)                                |
| ARCH-009 | MEDIUM   | Extract contact-info.ts + site.ts utilities                                     |
| ARCH-011 | LOW      | Extract lib/mdx.tsx to shared (base-template + dj-fox identical)                |
| CQ-010   | MEDIUM   | (Same as ARCH-003 — mdx-components dedup)                                       |
| CQ-011   | MEDIUM   | (Same as ARCH-006 — contact route dedup)                                        |
| CQ-012   | MEDIUM   | Shared analytics track route (base-template + colossus identical)               |

**Brief:** [codex-brief-session-6.md](codex-brief-session-6.md) — Run `/plan.with.codex` for this session.

---

## Execution Order

1. **Merge feature branch** → develop (prerequisite)
2. **Session 1** (Quick Wins) — clears 14 findings in ~30 min
3. **Session 2** (Security) — clears 3 findings in ~45 min
4. **Session 5** (Console.log) — clears 6 findings in ~20 min
5. **Session 3** (SEO/Schema) — clears 4 findings in ~1 hr
6. **Session 4** (Accessibility) — clears 4 findings in ~1 hr
7. **Session 6** (Architecture dedup) — clears 13 findings (with overlaps), requires Codex peer review first

Sessions 1-5 can run in any order. Session 6 should go last because it's the largest and riskiest.

After all sessions: deploy via `/deploy.changes`.

## Score After Full Remediation

- **Before:** 49 findings (3 critical, 10 high, 20 medium, 16 low)
- **Already fixed:** 6 (all 3 critical, 3 high)
- **After sessions 1-5:** 31 more fixed → 12 remaining (all architecture dedup)
- **After session 6:** 0 remaining
