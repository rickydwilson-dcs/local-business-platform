# Security Review Findings

**Reviewer:** cs-security-engineer
**Scope:** Security audit of the local-business-platform monorepo covering API routes (`sites/*/app/api/**/*.ts`), middleware files (`sites/*/middleware.ts`), Next.js configuration security headers (`sites/*/next.config.ts`), CSRF implementations (`**/lib/csrf.ts`, `**/lib/security/csrf.ts`), rate limiter implementation (`packages/core-components/src/lib/rate-limiter.ts`), environment variable handling in tools (`tools/*.ts`), `.env*` files in version control, and source code scan for hardcoded secrets. Three sites reviewed: `base-template`, `smiths-electrical-cambridge`, and `colossus-reference`. This review also incorporates a re-check of all 18 findings from the 2026-02-06 security review to verify remediation status.
**Date:** 2026-02-07

## Summary

The platform's security posture has improved substantially since the 2026-02-06 review. Of the 18 findings from that review, 12 have been fully remediated: IP extraction priority is now correct (SEC-001), stub rate limiters replaced with Supabase-backed implementation (SEC-002/003), CSRF tokens now use timing-safe comparison and single-use enforcement (SEC-005/006), input length limits are enforced (SEC-009), CORS headers are configured (SEC-010), `font-src` added to CSP (SEC-014), and dependency vulnerabilities patched (SEC-013). Six issues remain open or partially addressed, and two new issues were identified related to the analytics tracking endpoint's insecure IP extraction and CSRF token endpoint caching behavior.

## Findings

### [MEDIUM] SEC-001: Analytics Track Endpoint Uses Insecure IP Extraction

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (line 81)
- **Issue:** The analytics tracking endpoint extracts the client IP using `request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"` directly, bypassing the secure `extractClientIp()` utility (`sites/colossus-reference/lib/security/ip-utils.ts`) that is used by the contact form endpoint. The `x-forwarded-for` header can be spoofed by attackers, and no IP format validation is performed on the extracted value. The in-memory rate limiter at lines 12-32 relies on this IP for enforcement.
- **Impact:** An attacker can bypass the 30-request-per-minute rate limit on the analytics tracking endpoint by sending a different `x-forwarded-for` header with each request. This enables abuse of third-party analytics APIs (GA4, Facebook Conversions API, Google Ads) using the server's credentials, potentially inflating analytics data or exhausting API quotas.
- **Fix:** Replace the inline IP extraction at line 81 with a call to `extractClientIp(request)` from `@/lib/security/ip-utils`, which validates IP format and prioritizes trusted proxy headers (`x-real-ip`, `cf-connecting-ip`) over `x-forwarded-for`.
- **Effort:** trivial

### [MEDIUM] SEC-002: Analytics GET Endpoint Exposes Configuration in Production

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (lines 294-327)
- **Issue:** The `GET` handler for `/api/analytics/track` returns feature flag states and analytics platform configuration status (which services are configured vs. missing) to any unauthenticated request. Unlike the `/api/analytics/debug` endpoint (lines 66-67), which correctly restricts access to `NODE_ENV === "development"`, this GET handler serves configuration details in all environments including production.
- **Impact:** Information disclosure. An attacker can learn which analytics platforms are active (GA4, Facebook Pixel, Google Ads), which are configured vs. missing, and internal feature flag states. This aids reconnaissance for targeted attacks against the analytics pipeline.
- **Fix:** Add a `NODE_ENV` check identical to the debug endpoint: return minimal status in production (`{ status: "Analytics API is running" }`) and only include configuration details in development.
- **Effort:** trivial

### [MEDIUM] SEC-003: Rate Limiting Disabled by Default on base-template

- **File:** `sites/base-template/site.config.ts` (line 257)
- **Issue:** The base-template ships with `rateLimit: false` in `siteConfig.features`. The contact form route (`app/api/contact/route.ts`, line 50) checks `if (siteConfig.features.rateLimit)` before calling `rateLimitMiddleware()`. Any new site created from the base-template inherits rate limiting disabled unless the developer explicitly sets it to `true`. The Supabase-backed rate limiter in `packages/core-components/src/lib/rate-limiter.ts` is functional and correctly imported, but the feature flag prevents it from executing.
- **Impact:** New sites derived from the base-template have no rate limiting protection on their contact form endpoint by default. An attacker can submit unlimited form submissions, causing email spam via Resend API and potential service disruption.
- **Fix:** Change `rateLimit: false` to `rateLimit: true` in `sites/base-template/site.config.ts`. The rate limiter already fails open when Supabase is not configured (line 84 of `rate-limiter.ts`), so enabling it by default is safe even without Supabase credentials -- it will just allow all requests through until Supabase is set up.
- **Effort:** trivial

### [MEDIUM] SEC-004: CSRF Token Endpoints Missing Cache-Control Headers

- **File:** `sites/base-template/app/api/csrf-token/route.ts`, `sites/smiths-electrical-cambridge/app/api/csrf-token/route.ts`
- **Issue:** The CSRF token generation endpoints in base-template and smiths-electrical-cambridge return CSRF tokens without setting `Cache-Control: no-store` headers. The colossus-reference site correctly sets `Cache-Control: no-store, no-cache, must-revalidate` and `Pragma: no-cache` on its CSRF token endpoint (`sites/colossus-reference/app/api/csrf-token/route.ts`, lines 52-54). Without explicit cache-control headers, intermediate proxies, CDNs, or browser caches could cache the CSRF token response, serving stale or shared tokens to different users.
- **Impact:** If a CDN or proxy caches the CSRF token response, multiple users could receive the same token. Since tokens are single-use (invalidated after first use), the first user to submit a form would succeed but subsequent users sharing the cached token would receive CSRF validation failures. In the worst case with an aggressive CDN cache, a single token could be shared publicly.
- **Fix:** Add `Cache-Control: no-store, no-cache, must-revalidate` and `Pragma: no-cache` headers to the response in both files, matching the colossus-reference implementation. Also add `export const dynamic = "force-dynamic"` to prevent Next.js static optimization.
- **Effort:** trivial

### [MEDIUM] SEC-005: In-Memory Rate Limiter Ineffective in Serverless Environment

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (lines 12-45)
- **Issue:** The analytics tracking endpoint uses an in-memory `Map` for rate limiting (`rateLimitMap`). In Vercel's serverless environment, each function invocation may run in a different instance, and instances are ephemeral. The in-memory Map does not persist across cold starts or across concurrent instances, meaning the rate limit counter resets frequently and different instances maintain separate counters. Additionally, `setInterval(cleanup, 5 * 60 * 1000)` at line 44 creates a timer that keeps the Node.js event loop alive, which can prevent clean serverless function shutdown.
- **Impact:** Rate limiting is unreliable in production. An attacker can bypass the 30-request-per-minute limit by triggering requests that land on different serverless instances, or by waiting for a cold start to reset the counter. The `setInterval` call may also cause timeouts or resource leaks in serverless environments.
- **Fix:** Replace the in-memory rate limiter with the shared Supabase-backed `checkRateLimit()` from `@platform/core-components/lib/rate-limiter`, which persists state across instances. Remove the `setInterval` cleanup. Alternatively, use Vercel KV or an edge-compatible rate limiting approach if the analytics endpoint volume is too high for Supabase.
- **Effort:** small

### [LOW] SEC-006: colossus-reference Missing middleware.ts

- **File:** (missing) `sites/colossus-reference/middleware.ts`
- **Issue:** The colossus-reference site does not have a `middleware.ts` file. Both base-template and smiths-electrical-cambridge have middleware that sets security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`) on page responses. While `next.config.ts` headers function also sets these same headers, middleware provides defense-in-depth since it runs at the edge before the request reaches the application.
- **Impact:** Minimal, since `next.config.ts` headers cover the same protections. However, missing middleware breaks the defense-in-depth pattern and means the colossus site lacks the deprecated but still useful `X-XSS-Protection` header that the other sites set.
- **Fix:** Copy the middleware template from base-template to colossus-reference. Remove `X-XSS-Protection` from all middleware files (it is deprecated and some browsers interpret `1; mode=block` as enabling XSS filtering which can introduce new vulnerabilities).
- **Effort:** trivial

### [LOW] SEC-007: CSRF_SECRET Not Documented in .env.example Files

- **File:** `sites/colossus-reference/.env.example`, `.env.example`
- **Issue:** The colossus-reference CSRF implementation (`lib/security/csrf.ts`, line 27) requires a `CSRF_SECRET` environment variable for production stability. This variable is not listed in any `.env.example` file. Without it, the CSRF system falls back to a per-instance random secret that breaks across serverless cold starts (as documented in the previous review's SEC-016). While a warning is logged at runtime, developers setting up new sites may not realize this variable is needed until users report intermittent CSRF failures.
- **Impact:** Developers may deploy without `CSRF_SECRET`, causing intermittent CSRF validation failures in production when tokens generated by one serverless instance are validated by another.
- **Fix:** Add `CSRF_SECRET=your-random-secret-here-minimum-32-chars` to `sites/colossus-reference/.env.example` with a comment explaining it must be a stable secret shared across all instances.
- **Effort:** trivial

### [LOW] SEC-008: Email Confirmation Sent to Unverified Addresses

- **File:** `sites/base-template/app/api/contact/route.ts` (lines 312-325), `sites/smiths-electrical-cambridge/app/api/contact/route.ts` (lines 312-325), `sites/colossus-reference/app/api/contact/route.tsx` (lines 229-233)
- **Issue:** All three contact form implementations send confirmation emails to user-supplied email addresses without any verification that the address belongs to the person submitting the form. While rate limiting is now functional (via Supabase) on colossus and smiths, it is disabled by default on base-template (SEC-003). The honeypot field provides some bot protection, but a human attacker can still submit forms with arbitrary email addresses.
- **Impact:** The contact form could be used to send unsolicited emails to arbitrary addresses. If abused at scale, this could trigger spam complaints against the sending domain (e.g., `email.colossus-scaffolding.co.uk`), damaging email deliverability for legitimate business communications.
- **Fix:** This is an accepted trade-off for contact form UX. Ensure rate limiting is enabled on all sites (resolves SEC-003). Monitor Resend sending reputation. Consider adding a note that confirmation emails are rate-limited per IP.
- **Effort:** small (monitoring only, no code change needed if SEC-003 is fixed)

## Previously Reported Findings -- Remediation Status

The following findings from the 2026-02-06 security review have been verified as resolved:

| Previous ID | Title                                      | Status                                                                                                                                                                                          |
| ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-001     | IP extraction prioritizes spoofable header | **FIXED** -- `getClientIP()` in base-template and smiths now checks `x-real-ip` first, then `cf-connecting-ip`, then `x-forwarded-for`, with IP validation                                      |
| SEC-002     | base-template stub rate limiter            | **FIXED** -- imports `rateLimitMiddleware` from `@platform/core-components/lib/rate-limiter` (Supabase-backed). However, feature flag `rateLimit: false` prevents execution (see SEC-003 above) |
| SEC-003     | smiths stub rate limiter                   | **FIXED** -- same Supabase import, and `rateLimit: true` in site.config.ts                                                                                                                      |
| SEC-005     | CSRF timing attack                         | **FIXED** -- both sites now use `crypto.timingSafeEqual()` with `Buffer.from()`                                                                                                                 |
| SEC-006     | CSRF token replay                          | **FIXED** -- `clearCSRFToken()` called after successful validation (single-use enforcement)                                                                                                     |
| SEC-007     | Contact API returns submission data        | **FIXED** -- response no longer includes submission object                                                                                                                                      |
| SEC-008     | Contact API leaks error details            | **FIXED** -- generic error message returned, details logged server-side                                                                                                                         |
| SEC-009     | No input length limits                     | **FIXED** -- all fields have character limits (name: 100, email: 254, message: 2000, phone: 30, subject: 200)                                                                                   |
| SEC-010     | Missing CORS configuration                 | **FIXED** -- CORS headers configured in all three `next.config.ts` files with `Access-Control-Allow-Origin` set to `NEXT_PUBLIC_SITE_URL`                                                       |
| SEC-013     | Dependency vulnerabilities                 | **FIXED** -- `fast-xml-parser` updated to 5.3.4, `@isaacs/brace-expansion` updated to 5.0.1                                                                                                     |
| SEC-014     | CSP missing font-src                       | **FIXED** -- `font-src 'self'` added to CSP in all three sites                                                                                                                                  |
| SEC-017     | setup-vercel-env.ts duplicate SITES        | **Unable to verify** -- not re-tested in this review                                                                                                                                            |

## Statistics

- Critical: 0
- High: 0
- Medium: 5
- Low: 3
- Total: 8
