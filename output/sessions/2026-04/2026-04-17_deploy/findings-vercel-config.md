# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-17
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-009
**Rules skipped:** VCA-008 (no middleware.ts or middleware.js files exist in any site)

## Summary

One Critical finding blocks deploy: `sites/test-sirius/package.json` has no `build` script at all. If this site is ever invoked via `pnpm turbo run build`, Turbopack's bare `next build` default would apply (the `dev` script confirms Turbopack is the intent for dev). All other rules pass cleanly across all 7 sites. No High, Medium, or Low findings.

## Findings

### [Critical] VCA-002: test-sirius has no build script

- **File:** `sites/test-sirius/package.json` (scripts section, no `build` key)
- **Rule:** VCA-002 — Production build script must use `next build --webpack`, not Turbopack
- **Violation:** The `scripts` object contains only `dev`, `start`, and `clean`. There is no `build` script. If Turborepo or Vercel attempts to run a build for this site, it will either fail silently or fall through to a bare `next build` (which defaults to Turbopack in Next.js 16), triggering PostCSS panics in CI.
- **Impact:** Any CI run or Vercel deploy targeting test-sirius will either error on missing build script or invoke Turbopack, causing CSS parser panics.
- **Fix:** Add `"build": "next build --webpack"` to `sites/test-sirius/package.json` scripts.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 1
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 0
- Total: 1

## Out-of-scope observations

- `sites/dcs/vercel.json` uses `"buildCommand": "cd ../.. && pnpm build --filter @platform/dcs"` — bare `pnpm build` rather than `pnpm turbo run build --filter=...`. This differs from the canonical pattern in `docs/standards/deployment.md` (which shows `pnpm turbo run build --filter=<site-name>`). It also lacks the `$schema` field present in all other site vercel.json files. Not covered by current rule set (no rule covers buildCommand format) — for human review. Functional risk is low since `pnpm build` at root resolves to `turbo run build`, but the filter syntax (`--filter @platform/dcs` vs `--filter=dcs`) is non-standard.
