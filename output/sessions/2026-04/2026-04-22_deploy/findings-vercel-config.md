# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-22
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One low-severity warning was found. All critical and high-severity checks passed cleanly: no site-level `vercel.json` sets `outputDirectory`, every site uses `next build --webpack`, no `turbo-ignore` or `ignoreCommand` is present, all build-time env vars are declared in `turbo.json`, Tailwind content globs are correctly scoped, no CSS file uses `theme()`, no middleware files exist, and all sites pin Next.js to the same major version (16). The single finding is `sites/poc-composition-test` enabling `dangerouslyAllowSVG: true` without the accompanying `contentSecurityPolicy` image option.

## Findings

### [Low / Warning] VCA-007: poc-composition-test dangerouslyAllowSVG without contentSecurityPolicy

- **File:** `sites/poc-composition-test/next.config.ts` (line 17)
- **Rule:** VCA-007 — dangerouslyAllowSVG must be accompanied by images.contentSecurityPolicy
- **Violation:** `dangerouslyAllowSVG: true` is set but `images.contentSecurityPolicy` is absent. All other sites in the repo pair the flag with `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`.
- **Impact:** SVG images served through Next.js image optimization can execute embedded scripts in the browser context. For a test/PoC site this is low risk; it becomes a hard security issue if the pattern is copied to a production site.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` to the `images` block immediately after `dangerouslyAllowSVG: true`.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
