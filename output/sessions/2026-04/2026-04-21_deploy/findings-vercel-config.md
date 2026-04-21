# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-21
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One low-severity warning was found: `sites/poc-composition-test` declares `dangerouslyAllowSVG: true` in its Next.js image config without the accompanying `contentSecurityPolicy` field that all other sites include. No critical or high-severity violations were detected. The audit is clear to proceed.

## Findings

### [Low / Warning] VCA-007: `poc-composition-test` — dangerouslyAllowSVG without contentSecurityPolicy

- **File:** `sites/poc-composition-test/next.config.ts` (line 16)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** `images.dangerouslyAllowSVG: true` is set but no `images.contentSecurityPolicy` or `images.contentDispositionType` is present. Every other site in the monorepo includes `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` alongside `dangerouslyAllowSVG`.
- **Impact:** SVG files served through Next.js Image Optimization from the R2 CDN can execute embedded scripts in the browser. This is a security risk, not a build-time failure. The deploy will succeed, but the site is exposed to SVG-based XSS from any SVG stored in the R2 bucket.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` and `contentDispositionType: "attachment"` to the `images` block, matching the pattern used by all other sites.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
