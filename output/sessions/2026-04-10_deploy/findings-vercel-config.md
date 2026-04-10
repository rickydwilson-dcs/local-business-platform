# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-10
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

The audit found 2 high-severity violations (VCA-004) and no critical failures. All site-level vercel.json files are clean, Tailwind globs are correctly scoped, no CSS theme() function usage was found, and all deployed sites use `next build --webpack`. The primary issues are: (1) `VERCEL_URL` and `VERCEL_ENV` are used at build time in Server Components and next.config but are absent from `turbo.json` env, creating stale-cache risk; and (2) `NEXT_PUBLIC_FEATURE_CONSENT_BANNER` and analytics measurement ID vars are used in a Server Component layout but only their non-`NEXT_PUBLIC_` counterparts are declared in turbo.json. Pipeline test sites (lyra-test, nova-test, test-rigel, castor-test) have no build script, but have no vercel.json and are flagged `pipelineTestSite`, so they are treated as warnings.

---

## Findings

### [High] VCA-004: VERCEL_URL and VERCEL_ENV used at build time but missing from turbo.json env

- **File:** `sites/colossus-scaffolding/app/layout.tsx` (line 23-24), `sites/colossus-scaffolding/app/robots.ts` (line 9), `sites/dj-fox-electrical/app/robots.ts` (line 16), `sites/colossus-scaffolding/next.config.ts` (line 83-84), `sites/dj-fox-electrical/next.config.ts` (line 83-84), `sites/showcase/next.config.ts` (line 12-13)
- **Rule:** VCA-004 — Every build-affecting env var must be listed in turbo.json tasks.build.env
- **Violation:** `process.env.VERCEL_URL` is used in `metadata.metadataBase` (a module-level export evaluated at build time for static generation) in colossus layout.tsx, and in `headers()` functions in colossus, dj-fox, and showcase next.config files. `process.env.VERCEL_ENV` is used in `robots.ts` in colossus and dj-fox to determine whether to allow or block all crawlers — this is a static file generated at build time. Neither `VERCEL_URL` nor `VERCEL_ENV` appear in `turbo.json` tasks.build.env.
- **Impact:** If `NEXT_PUBLIC_SITE_URL` is absent (e.g. on preview deployments or new site setup), the metadata base URL and CORS origin will be determined by `VERCEL_URL`, which changes per deployment. Turborepo will not detect the change and may serve a cached build with a stale URL. Separately, if `VERCEL_ENV` changes between deployments (e.g. switching from preview to production), robots.txt continues to serve the cached version — potentially blocking crawlers on production or allowing them on preview indefinitely.
- **Fix:** Add `"VERCEL_URL"` and `"VERCEL_ENV"` to the `env` array in `turbo.json` under `tasks.build`.
- **Effort:** trivial

### [High] VCA-004: NEXT*PUBLIC* analytics vars used in Server Component but absent from turbo.json env

- **File:** `sites/colossus-scaffolding/app/layout.tsx` (lines 122, 134, 135, 136)
- **Rule:** VCA-004 — Every build-affecting env var must be listed in turbo.json tasks.build.env
- **Violation:** `NEXT_PUBLIC_FEATURE_CONSENT_BANNER`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`, and `NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID` are referenced in the root Server Component layout. `NEXT_PUBLIC_*` vars are inlined at build time by Next.js — they become literal values in the compiled output. turbo.json declares `FEATURE_CONSENT_BANNER`, `FEATURE_GA4_ENABLED`, `FEATURE_FACEBOOK_PIXEL`, and `FEATURE_GOOGLE_ADS` (all without the `NEXT_PUBLIC_` prefix), which are different environment variables. Turborepo will not bust the cache when the `NEXT_PUBLIC_` variants change.
- **Impact:** Updating `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel will not invalidate the Turborepo cache. The cached build will continue to use the old GA4 measurement ID, causing analytics data to flow to the wrong property until the cache is manually cleared. Same applies to the consent banner toggle and ad tracking IDs.
- **Fix:** Add `"NEXT_PUBLIC_FEATURE_CONSENT_BANNER"`, `"NEXT_PUBLIC_GA_MEASUREMENT_ID"`, `"NEXT_PUBLIC_FACEBOOK_PIXEL_ID"`, and `"NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID"` to `turbo.json` tasks.build.env. Do not remove the existing non-prefixed variants — they may be used server-side at request time.
- **Effort:** trivial

### [Low / Warning] VCA-002: Pipeline test sites have no build script

- **File:** `sites/lyra-test/package.json` (no build key), `sites/nova-test/package.json` (no build key), `sites/test-rigel/package.json` (no build key), `sites/castor-test/package.json` (no build key)
- **Rule:** VCA-002 — Production build script must use `next build --webpack`, not Turbopack
- **Violation:** These four sites have `dev`, `start`, and `clean` scripts but no `build` script at all. If Turborepo attempts to run the build task for these sites, it will find no script and may produce an unclear error.
- **Impact:** Downgraded to warning because: (a) all four are marked `pipelineTestSite`, (b) none has a `vercel.json` file meaning they are not independently deployed to Vercel, (c) they appear in Turborepo's workspace but the filter in the Vercel `buildCommand` pattern would have to explicitly include them. If any of these sites is ever linked to a Vercel project, the missing build script will cause an immediate deploy failure with no clear error message.
- **Fix:** Add `"build": "next build --webpack"` to the scripts section of each test site's package.json.
- **Effort:** trivial

### [Low / Warning] VCA-007: Wildcard hostname pattern in remotePatterns

- **File:** `sites/base-template/next.config.ts` (line 52), `sites/colossus-scaffolding/next.config.ts` (line 52), `sites/dj-fox-electrical/next.config.ts` (line 52), `sites/mad-graphics/next.config.ts` (line 52), `sites/cygnus-test/next.config.ts` (line 52), `sites/dcs-design-taste/next.config.ts` (line 52), `sites/dcs-industrial-brutalist/next.config.ts` (line 52)
- **Rule:** VCA-007 — CSP / dangerouslyAllowSVG / image remote patterns must be explicit
- **Violation:** All seven sites use `hostname: '**.r2.dev'` (double-star wildcard) in remotePatterns. This allows images from any subdomain of r2.dev, not just the specific R2 bucket. R2 buckets are tenant-isolated but the wildcard allows any bucket under the r2.dev domain.
- **Impact:** Not a build failure. Security posture is slightly broader than necessary — any public R2 bucket URL would be served through Next.js image optimization. This is flagged for human review per rule VCA-007; it does not block the deploy.
- **Note:** `dangerouslyAllowSVG: true` is accompanied by `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` on all affected sites — this passes the VCA-007 CSP check.
- **Fix:** Replace `'**.r2.dev'` with the specific bucket hostname (e.g. `'pub-[account-id].r2.dev'`). If multiple buckets are used, enumerate them explicitly.
- **Effort:** small

---

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 2
- Medium (cache/perf/correctness): 0
- Low / warning: 2
- Total: 4
