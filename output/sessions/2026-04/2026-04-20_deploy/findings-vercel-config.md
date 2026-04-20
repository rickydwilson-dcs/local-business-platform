# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-20
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One Low/Warning finding across all nine rules. All Critical and High severity rules pass cleanly. The sole finding is `poc-composition-test` setting `dangerouslyAllowSVG: true` without an accompanying `contentSecurityPolicy` in its image config — a security gap on a test site only, not a deploy blocker. No issues exist that would block or destabilise a Vercel deploy.

## Findings

### Low / Warning — VCA-007: `dangerouslyAllowSVG: true` without `contentSecurityPolicy` in poc-composition-test

- **File:** `/Users/rickywilson/Sites/local-business-platform/sites/poc-composition-test/next.config.ts` (lines 15–17)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** `dangerouslyAllowSVG: true` is set in the `images` block with no accompanying `contentSecurityPolicy` or `contentDispositionType`. All other sites that enable this flag include `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`.
- **Impact:** SVG images served through Next.js image optimization may contain embedded scripts that execute in the user's browser context when the CSP restraint is absent. This is a test-only site, so production blast radius is nil today, but the pattern must not propagate to production sites copied from this config.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` inside the `images` block, or remove `dangerouslyAllowSVG: true` if SVG optimization is not required for this test site.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1

## Out-of-scope observations

- `sites/dcs/vercel.json` uses `pnpm build --filter @platform/dcs` (line 4) instead of the standard `pnpm turbo run build --filter=<name>` pattern used by all other deployed sites. This bypasses Turborepo task orchestration: the `"dependsOn": ["^build"]` guarantee is not enforced, so in a cold-cache CI environment packages could theoretically be compiled after the site attempts to build. Not covered by current rule set — for human review.
