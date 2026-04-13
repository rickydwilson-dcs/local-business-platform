# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-13
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One low/warning finding. All critical, high, and medium rules pass. The `dangerouslyAllowSVG: true` image configs are properly accompanied by `contentSecurityPolicy`, so no hard failure is raised. The `**.r2.dev` wildcard hostname in `remotePatterns` across five sites is flagged as a low-severity warning for human review per VCA-007. No blocking issues; deployment may proceed.

## Findings

### [Low / Warning] VCA-007: Wildcard hostname `**.r2.dev` in remotePatterns

- **File:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 52), `sites/dj-fox-electrical/next.config.ts` (line 52), `sites/mad-graphics/next.config.ts` (line 52), `sites/dcs/next.config.ts` (line 52)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** `images.remotePatterns` uses `hostname: '**.r2.dev'` — a wildcard that matches any subdomain prefix of `.r2.dev`, not a specific known bucket hostname.
- **Impact:** Any R2 bucket URL (not just the platform's own) can be served via Next.js image optimization. Low risk in practice since R2 CDN URLs are non-guessable, but violates the principle of least privilege for remote image origins.
- **Fix:** Replace `'**.r2.dev'` with the specific Cloudflare R2 public bucket hostname for each site (e.g. `pub-<hash>.r2.dev`). If a single hostname is shared across all sites, use `NEXT_PUBLIC_R2_PUBLIC_URL` to derive the hostname at config time. Note: `dangerouslyAllowSVG: true` is properly paired with `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` in all affected files — no additional CSP finding.
- **Effort:** small

## Out-of-scope observations

- `sites/dcs/vercel.json` (line 4) uses `pnpm build --filter @platform/dcs` instead of the canonical `pnpm turbo run build --filter=dcs` pattern documented in `docs/standards/deployment.md`. This means Turborepo task orchestration is bypassed for this site's Vercel build — packages are not guaranteed to build before the site, and Turborepo caching is not used. Not covered by current rule set — for human review.

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
