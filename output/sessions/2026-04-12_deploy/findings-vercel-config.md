# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-12
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

One finding: four `NEXT_PUBLIC_FEATURE_*` environment variables used in client components compiled at build time are absent from `turbo.json` `tasks.build.env`. Changing any of these feature flags in Vercel will produce a stale cache hit — the old build will be served. All other rules pass cleanly across all 11 sites.

## Findings

### HIGH VCA-004: Four NEXT*PUBLIC_FEATURE*\* vars missing from turbo.json env array

- **File:** `turbo.json` (lines 8-37, env array)
- **Rule:** VCA-004 — Every build-affecting env var must be listed in `turbo.json` `tasks.build.env`
- **Violation:** The following four variables are referenced in `packages/core-components/src/components/analytics/ConsentManager.tsx` (lines 78-81) and `packages/core-components/src/components/analytics/Analytics.tsx` (lines 47-50), which are client components compiled into every site's build output, but are not present in `turbo.json` `tasks.build.env`:
  - `NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED`
  - `NEXT_PUBLIC_FEATURE_GA4_ENABLED`
  - `NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL`
  - `NEXT_PUBLIC_FEATURE_GOOGLE_ADS`

  The server-side equivalents (`FEATURE_ANALYTICS_ENABLED`, `FEATURE_GA4_ENABLED`, `FEATURE_FACEBOOK_PIXEL`, `FEATURE_GOOGLE_ADS`) are declared in turbo.json, but `NEXT_PUBLIC_*` variables are separate — Next.js inlines them into the client bundle at build time under different names. Turborepo does not treat `FEATURE_GA4_ENABLED` and `NEXT_PUBLIC_FEATURE_GA4_ENABLED` as the same variable.

- **Impact:** If any of these feature flags are toggled in Vercel project settings, Turborepo will serve a cached build that was compiled with the old values. Analytics components will behave as if the flag was never changed until the cache is manually busted. This is the exact stale-build failure described in CLAUDE.md ("Stale builds after adding env var").

- **Fix:** Add the four missing variables to `turbo.json` → `tasks.build.env`:

  ```json
  "NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED",
  "NEXT_PUBLIC_FEATURE_GA4_ENABLED",
  "NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL",
  "NEXT_PUBLIC_FEATURE_GOOGLE_ADS"
  ```

  Commit separately from any code change so the cache bust is explicit.

- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 1
- Medium (cache/perf/correctness): 0
- Low / warning: 0
- Total: 1
