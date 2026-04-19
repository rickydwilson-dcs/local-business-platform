# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-19
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-009
**Rules skipped:** VCA-008 (no middleware.ts or middleware.js files found anywhere in sites/)

## Summary

One low-severity warning was found. All critical and high-severity rules pass clean. No findings block the deploy. The single violation is VCA-007 on `sites/poc-composition-test/next.config.ts`: `dangerouslyAllowSVG: true` is set without a `contentSecurityPolicy`, which is a security gap but does not cause a build failure. `poc-composition-test` is not a deployed production site; however the config still violates the rule and should be corrected before it is promoted.

## Findings

### Low / Warning: VCA-007: dangerouslyAllowSVG set without contentSecurityPolicy

- **File:** `sites/poc-composition-test/next.config.ts` (line 16)
- **Rule:** VCA-007 — dangerouslyAllowSVG / image CSP must be explicit
- **Violation:** `dangerouslyAllowSVG: true` is present but no `contentSecurityPolicy` or `contentDispositionType` is configured alongside it. The file contains no `contentSecurityPolicy` key in the `images` block at all.
- **Impact:** SVG images served through Next.js image optimization could contain embedded scripts that execute in the browser if a malicious SVG is served from the allowed remote pattern (`**.r2.dev`). Does not cause a build failure but is a configuration gap that worsens the security posture.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` (and optionally `contentDispositionType: "attachment"`) to the `images` block, matching the pattern used by all other sites in this monorepo.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1

## Out-of-scope observations

- `sites/dcs/vercel.json` uses `buildCommand: "cd ../.. && pnpm build --filter @platform/dcs"` (bare `pnpm build`) rather than the canonical `pnpm turbo run build --filter=<name>` form used by all other sites. This does not violate any current VCA rule (the rule governs `outputDirectory` and `turbo-ignore`, not the exact form of the build command), but it deviates from the pattern documented in `docs/standards/deployment.md` and could behave differently if the root `package.json` `build` script is ever changed. For human review — not covered by current rule set.
- `sites/navagarden-test`, `sites/designlab-test`, `sites/poc-composition-test`, `sites/showcase`, and `sites/base-template` have no `vercel.json`. These sites are not currently wired to Vercel projects. If any of them are promoted to a live Vercel project, they will need a `vercel.json` created following the canonical pattern in `docs/standards/deployment.md`. Not a current violation — for human awareness.
