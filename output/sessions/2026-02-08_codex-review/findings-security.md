# Security Review Findings

**Reviewer:** OpenAI Codex (external)
**Scope:** Full monorepo — security focus
**Date:** 2026-02-08

## Summary

External review identified two security gaps: the analytics tracking endpoint uses an in-memory rate limiter that resets on cold starts (bypassing rate limiting in serverless), and the same endpoint extracts IPs inline instead of using the shared validated helper.

## Findings

### [HIGH] SEC-001: Analytics endpoint uses in-memory rate limiter

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (lines 16-49, 82-95)
- **Issue:** The analytics track API uses a JavaScript `Map` as an in-memory rate limiter (`rateLimitMap`). In a serverless environment (Vercel), each cold start creates a fresh Map, so bursty clients can bypass limits by hitting different instances. The shared Supabase-backed rate limiter (`@platform/core-components/lib/rate-limiter`) is already used by contact routes but not here.
- **Impact:** Attackers can flood GA4/Facebook analytics endpoints without being rate-limited, potentially exhausting third-party API quotas or inflating analytics data.
- **Fix:** Replace the in-memory `rateLimitMap` implementation (lines 16-49) with an import of `checkRateLimit` from `@platform/core-components/lib/rate-limiter`. Update the rate-limit check in the POST handler (lines 82-95) to call the shared Supabase-backed limiter instead of `checkRateLimit()` from the local implementation.
- **Effort:** small

### [MEDIUM] SEC-002: Analytics endpoint extracts IP without shared helper

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (lines 85-89)
- **Issue:** IP address is extracted inline from raw headers (`x-real-ip`, `cf-connecting-ip`, `x-forwarded-for`) without validation. The shared `extractClientIp` helper in `@platform/core-components/lib/security/ip-utils.ts` provides proper IPv4/IPv6 validation and priority ordering, and is already used by `proxy.ts`, but not by this route.
- **Impact:** IP spoofing can bypass rate-limit keys and corrupt analytics IP fields. Inconsistent IP extraction across routes creates security gaps.
- **Fix:** Import `extractClientIp` from `@platform/core-components/lib/security/ip-utils` and replace the inline IP extraction at lines 85-89 with `const clientIP = extractClientIp(request);`.
- **Effort:** trivial

### [MEDIUM] SEC-003: CSP allows unsafe-inline for scripts and styles

- **File:** `sites/colossus-reference/next.config.ts` (lines 78-79, 126), `sites/base-template/next.config.ts` (lines 78-79, 124), `sites/smiths-electrical-cambridge/next.config.ts` (lines 78-79, 124)
- **Issue:** All three sites include `'unsafe-inline'` in both `script-src` and `style-src` CSP directives. While a comment notes this is "required for Next.js hydration", Next.js supports nonce-based CSP which would allow removing unsafe-inline from script-src. The CSP also doesn't whitelist the R2 asset host that pages preconnect to.
- **Impact:** Weakened XSS protection — any injected inline script will execute. Missing R2 host in img-src/connect-src may block CDN assets.
- **Fix:** This is a larger change that requires nonce-based CSP setup with Next.js. For now, document as a known limitation. As a quick win, add the R2 asset host to `img-src` and `connect-src` directives. Moving to nonce-based CSP should be a separate tracked task.
- **Effort:** large (for nonce-based CSP), trivial (for R2 host addition)

## Statistics

- Critical: 0
- High: 1
- Medium: 2
- Low: 0
- Total: 3
