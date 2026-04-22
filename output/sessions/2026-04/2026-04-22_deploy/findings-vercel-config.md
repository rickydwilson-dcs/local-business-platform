# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-22
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

The audit found one finding, rated Low/Warning. All critical and high-severity checks pass cleanly: no site sets `outputDirectory`, all sites use `next build --webpack`, no `turbo-ignore` or `ignoreCommand` is present, all build-time env vars are declared in `turbo.json`, Tailwind content globs are correctly scoped, no `theme()` calls exist in CSS files, no middleware files are present, and all sites pin Next.js 16.0.10. The single finding is `sites/poc-composition-test/next.config.ts` setting `dangerouslyAllowSVG: true` without a companion `contentSecurityPolicy` on the images config object.

## Findings

### Low/Warning — VCA-007: dangerouslyAllowSVG set without contentSecurityPolicy in poc-composition-test

- **File:** `sites/poc-composition-test/next.config.ts` (line 16)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** `images.dangerouslyAllowSVG` is set to `true`. No `images.contentSecurityPolicy` or `images.contentDispositionType` is present alongside it. All other sites with this flag set include `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`.
- **Impact:** SVG images served through Next.js image optimization can execute embedded scripts in the browser. This is a security risk if any SVG is sourced from user content or remote URLs rather than trusted static assets. For a test site the practical risk is low, but the pattern should not propagate to production sites via template copying.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` and optionally `contentDispositionType: "attachment"` to the `images` config block, mirroring the pattern used in all other sites.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
