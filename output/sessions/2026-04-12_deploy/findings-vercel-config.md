# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-12
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** VCA-008 (no middleware files found in any site directory)

## Summary

All critical and high-severity checks pass. No hard failures detected. One low/warning-level finding on VCA-007: every site's `next.config.ts` uses `hostname: '**.r2.dev'` in `remotePatterns`, which is a subdomain wildcard. This is flagged for human review per the rule but does not block the deploy.

## Findings

### Low / Warning — VCA-007: Wildcard hostname `**.r2.dev` in remotePatterns

- **Files:**
  - `sites/base-template/next.config.ts` (line 52)
  - `sites/colossus-scaffolding/next.config.ts` (line 52)
  - `sites/dj-fox-electrical/next.config.ts` (line 52)
  - `sites/mad-graphics/next.config.ts` (line 52)
  - `sites/dcs/next.config.ts` (line 52)
- **Rule:** VCA-007 — remotePatterns must be explicit; wildcard hostnames flagged for review
- **Violation:** All five sites declare `{ protocol: 'https', hostname: '**.r2.dev' }` — the `**` prefix matches any subdomain of r2.dev, not a specific Cloudflare R2 bucket hostname.
- **Impact:** No build failure. A wildcard pattern could serve images from any R2 tenant's subdomain if a URL were crafted to reference it. This is a permissiveness concern, not a breakage concern.
- **Fix:** Replace with the specific R2 bucket hostname (e.g., `pub-<id>.r2.dev`) once each site's R2 bucket is provisioned. Until then, the `**.r2.dev` pattern is acceptable as a temporary placeholder — confirm this is intentional.
- **Effort:** trivial (once bucket hostnames are known)

Note: `dangerouslyAllowSVG: true` is present in all five sites and is accompanied by `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` in every case. That combination satisfies the VCA-007 CSP presence requirement.

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
