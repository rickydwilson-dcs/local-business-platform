# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-12
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One low-severity warning was found. All critical and high-severity rules pass cleanly. The `hostname: '**.r2.dev'` pattern in the `images.remotePatterns` of 9 sites uses a double-wildcard that matches any subdomain of r2.dev — this is intentional for Cloudflare R2 public bucket URLs but warrants acknowledgment. All sites have `dangerouslyAllowSVG: true` paired with a correct `contentSecurityPolicy` on the image optimizer, so VCA-007's security condition is met. No deployment-blocking issues were found.

## Findings

### [Low / Warning] VCA-007: `hostname: '**.r2.dev'` is a broad wildcard in remotePatterns

- **File:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 51), `sites/dj-fox-electrical/next.config.ts` (line 52), `sites/mad-graphics/next.config.ts` (line 52), `sites/_castor-plumbing/next.config.ts` (line 52), `sites/_cygnus-graphics/next.config.ts` (line 52), `sites/_lyra-garden/next.config.ts` (line 52), `sites/_nova-print/next.config.ts` (line 52), `sites/_rigel-events/next.config.ts` (line 52)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** `hostname: '**.r2.dev'` allows any subdomain of r2.dev, not only the specific project bucket. This is a wildcard hostname per Next.js docs.
- **Impact:** Does not cause a build failure. Any Cloudflare R2 bucket on r2.dev can serve images through Next.js image optimization. If a malicious image were injected via a different R2 bucket URL, it would be optimized and served. Low practical risk given the CSP is correctly set.
- **Fix:** Scope the pattern to the specific R2 bucket hostname (e.g., `pub-abc123.r2.dev`) once bucket URLs are confirmed per site. Until then, this is a warning, not a hard failure.
- **Effort:** small

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
