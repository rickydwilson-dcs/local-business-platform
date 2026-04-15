# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-15
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-009
**Rules skipped:** VCA-008 (no middleware files found in any site)

## Summary

All critical and high-severity checks passed. The codebase is clean of the failure classes that historically blocked Vercel deployments. One low/warning finding exists under VCA-007: five sites use `dangerouslyAllowSVG: true` alongside a correctly-configured `contentSecurityPolicy`, which satisfies the rule's hard-failure condition but is flagged for human awareness. The `**.r2.dev` wildcard in `remotePatterns` is noted as an out-of-scope observation.

## Findings

### Low / Warning — VCA-007: dangerouslyAllowSVG enabled across 5 sites (review advised)

- **Files:**
  - `sites/base-template/next.config.ts` (line 61)
  - `sites/colossus-scaffolding/next.config.ts` (line 61)
  - `sites/dj-fox-electrical/next.config.ts` (line 61)
  - `sites/mad-graphics/next.config.ts` (line 61)
  - `sites/dcs/next.config.ts` (line 61)
  - `sites/_corvus-digital-marketing-events/next.config.ts` (line 61)
- **Rule:** VCA-007 — dangerouslyAllowSVG must be paired with contentSecurityPolicy
- **Violation:** `dangerouslyAllowSVG: true` is set in all sites. Each site does include `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` alongside it, satisfying the hard-failure condition. This is flagged as a warning because enabling SVG from arbitrary domains (including the wildcard `**.r2.dev`) is a decision that should be consciously maintained, not inherited from a template.
- **Impact:** No deploy failure expected. Potential XSS vector if SVG content served from the R2 bucket is untrusted.
- **Fix:** No immediate action required. If SVGs in R2 are user-controlled (not platform-controlled), consider adding `contentDispositionType: 'attachment'` to force download rather than inline rendering. Otherwise, document the decision in `docs/standards/security.md`.
- **Effort:** trivial

## Out-of-scope observations

The following items were noticed during the audit and are not covered by the current rule set. They are for human review only.

**sites/dcs/vercel.json buildCommand format:** The `dcs` site uses `"buildCommand": "cd ../.. && pnpm build --filter @platform/dcs"` (line 4). All other sites use `pnpm turbo run build --filter=<name>`. The `pnpm build` invocation delegates to Turborepo via the root `package.json` scripts, so this likely works. However it bypasses the explicit `turbo run` call and relies on the root script definition remaining stable. Recommend aligning to `cd ../.. && pnpm turbo run build --filter=@platform/dcs` for consistency. Not covered by current rule set — for human review.

**Root package.json pnpm override for next:** The root `package.json` `pnpm.overrides` includes `"next": ">=16.1.5"`. All sites pin `next: 16.0.10`, but the override may cause pnpm to resolve a newer patch version (e.g. 16.1.5+) in the lockfile. VCA-009 checks declared versions, not resolved versions. If the resolved version differs across sites due to the override, it could break the shared component contract in ways that VCA-009 does not detect. Not covered by current rule set — for human review.

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1
