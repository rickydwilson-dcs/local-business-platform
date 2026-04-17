# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-12
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One Critical finding: `sites/test-corvus/package.json` has no `build` script at all, meaning any Vercel deployment attempt would use bare `next build` (which may invoke Turbopack depending on Next.js defaults), violating the webpack-only production build rule. One Low/Warning: eleven sites use `hostname: '**.r2.dev'` in `remotePatterns`, which is a subdomain wildcard. All other rules pass cleanly.

## Findings

### CRITICAL VCA-002: test-corvus missing build script

- **File:** `sites/test-corvus/package.json` (scripts object, line 7–11)
- **Rule:** VCA-002 — Production build script must use `next build --webpack`, not Turbopack
- **Violation:** The `scripts` object contains `dev`, `start`, and `clean` but no `build` entry. Bare `next build` is not present at all.
- **Impact:** If this site is ever built by Vercel (or via `pnpm turbo run build`), Next.js will invoke its default bundler. In Next.js 16, the default may be Turbopack, which has known PostCSS panics in CI. The site is tagged `"pipelineTestSite": true` and currently has no `vercel.json`, reducing immediate deployment risk, but the absence makes it non-compliant and will fail a Turborepo build run if the task is invoked.
- **Fix:** Add `"build": "next build --webpack"` to the `scripts` section in `sites/test-corvus/package.json`.
- **Effort:** trivial

### LOW / WARNING VCA-007: Wildcard subdomain in remotePatterns (\*\*.r2.dev)

- **Files:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 52), `sites/dj-fox-electrical/next.config.ts` (line 52), `sites/mad-graphics/next.config.ts` (line 52), `sites/dcs/next.config.ts` (line 52), `sites/test-corvus/next.config.ts` (line 52), `sites/_castor-plumbing/next.config.ts` (line 52), `sites/_cygnus-graphics/next.config.ts` (line 52), `sites/_lyra-garden/next.config.ts` (line 52), `sites/_nova-print/next.config.ts` (line 52), `sites/_rigel-events/next.config.ts` (line 52)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** All eleven sites use `hostname: '**.r2.dev'` — a double-wildcard subdomain pattern that matches any subdomain of r2.dev. This is intentional (Cloudflare R2 assigns random bucket subdomains) but is broader than a pinned hostname.
- **Impact:** Not a build failure. The wildcard is scoped to the `r2.dev` domain and all sites that use `dangerouslyAllowSVG: true` correctly pair it with `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`. Risk is low. For human review: if the R2 bucket URLs are known and stable, consider pinning to the exact subdomain.
- **Fix:** No immediate action required. Optional: replace `**.r2.dev` with the specific bucket hostname (e.g., `pub-abc123.r2.dev`) for each site that has a stable R2 URL.
- **Effort:** small

## Out-of-scope observations

**Not covered by current rule set — for human review:**

- `package.json` (root) `pnpm.overrides` sets `"next": ">=16.1.5"`. All sites pin `next: 16.0.10` in their own `package.json`, but the pnpm override means the resolved/installed version may be `16.1.5` or later. This creates a divergence between the declared version and the installed version. The override appears to be a security patch override (likely addressing a CVE). If Next.js 16.1.x introduced a breaking change, this could surface as a build inconsistency. VCA-009 checks major version drift only and does not cover this minor/patch override scenario.

## Statistics

- Critical (blocks deploy): 1
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 2
