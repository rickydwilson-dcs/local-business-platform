# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-11
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-009
**Rules skipped:** VCA-008 (no middleware.ts or middleware.js files exist in any site)

## Summary

All critical and high-severity checks passed. The codebase is clean of the known-bad configurations that cause Vercel deployment failures: no `outputDirectory` in site vercel.json files, all sites use `next build --webpack`, no turbo-ignore usage, all build-time env vars are declared in turbo.json, Tailwind content globs are correctly scoped, and no `theme()` function appears in CSS files. One Low/Warning finding is raised for the `**.r2.dev` double-wildcard hostname in remotePatterns — it is accompanied by the required `contentSecurityPolicy` in all cases, so this does not block deployment.

## Findings

### [Low / Warning] VCA-007: Double-wildcard hostname in remotePatterns across all sites

- **File:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 52), `sites/dj-fox-electrical/next.config.ts` (line 52), `sites/mad-graphics/next.config.ts` (line 52), and all `sites/_*/next.config.ts` files (line 52)
- **Rule:** VCA-007 — image remote patterns must be explicit; wildcard hostnames flagged for review
- **Violation:** All sites set `hostname: '**.r2.dev'` in `images.remotePatterns`. The double-wildcard `**` matches any subdomain path at any depth under `r2.dev` — a broader scope than a single bucket subdomain requires.
- **Impact:** Any Cloudflare R2 bucket URL (or other `*.r2.dev` subdomain) is allowed for image optimization without further restriction. Not a build-time failure, but a surface-area concern. `dangerouslyAllowSVG: true` is correctly paired with `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` in all sites, which mitigates the SVG attack vector.
- **Fix:** Tighten the pattern to the specific R2 bucket subdomain in use, e.g. `hostname: 'your-bucket-name.r2.dev'`. This is a configuration hygiene improvement, not a deployment blocker.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
