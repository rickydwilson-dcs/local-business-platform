# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-24
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

All critical and high-severity checks passed. One low/warning-level finding was identified: the wildcard `**.r2.dev` hostname in the `remotePatterns` image configuration across all production sites. This is not a build blocker and is assessed as an intentional operational pattern for Cloudflare R2 CDN, but is flagged for human review per VCA-007. No hard failures.

## Findings

### [Low / Warning] VCA-007: Wildcard R2 hostname in remotePatterns

- **File:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 52), `sites/dcs/next.config.ts` (line 52), `sites/dj-fox-electrical/next.config.ts` (line 54), `sites/mad-graphics/next.config.ts` (line 52)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** All five sites declare `hostname: '**.r2.dev'` in `images.remotePatterns`. The double-star wildcard matches any subdomain of r2.dev, not just the specific R2 bucket subdomain(s) in use by this platform.
- **Impact:** No build failure. Runtime: Next.js image optimization will proxy images from any `*.r2.dev` domain, not only the platform's own R2 bucket. This is a security posture concern rather than a deployment blocker. `dangerouslyAllowSVG: true` is present on all affected files, but is appropriately paired with `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` on all five sites — that part passes.
- **Fix:** Replace `hostname: '**.r2.dev'` with the specific bucket subdomain (e.g. `hostname: 'pub-<bucket-id>.r2.dev'`). If multiple buckets are in use, add one entry per bucket. This is a tightening of the configuration rather than a correction of a misconfiguration.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
