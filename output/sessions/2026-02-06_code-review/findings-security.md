# Security Review Findings

**Reviewer:** cs-security-engineer
**Scope:** Security audit of the local-business-platform monorepo covering API routes (`sites/*/app/api/**/*.ts`), middleware files (`sites/*/middleware.ts`), Next.js configuration security headers (`sites/*/next.config.ts`), CSRF implementations (`**/lib/csrf.ts`), rate limiter implementations (`**/lib/rate-limiter.ts`), environment variable handling in tools (`tools/*.ts`), dependency vulnerabilities via `pnpm audit`, and source code scan for hardcoded secrets. Three sites reviewed: `base-template`, `smiths-electrical-cambridge`, and `colossus-reference`.
**Date:** 2026-02-06

## Summary

The platform demonstrates solid security foundations with CSRF protection implemented across all sites, HTML escaping for XSS prevention in email templates, comprehensive security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options, Permissions-Policy), and proper environment variable handling for secrets. However, several significant issues were identified: rate limiting is disabled or uses stub implementations on two of three sites, IP extraction in base-template and smiths-electrical-cambridge prioritizes the spoofable `x-forwarded-for` header over trusted proxy headers, CSRF tokens are not invalidated after use allowing replay attacks, the analytics GET endpoint exposes configuration details in production, and there are two high-severity dependency vulnerabilities.

## Findings

### [HIGH] SEC-001: IP Extraction Prioritizes Spoofable Header Over Trusted Proxy Headers

- **File:** `sites/base-template/lib/csrf.ts` (lines 109-129), `sites/smiths-electrical-cambridge/lib/csrf.ts` (lines 109-129)
- **Issue:** The `getClientIP()` function checks `x-forwarded-for` FIRST (line 111-114), before checking `x-real-ip` (line 117). The security standard (`docs/standards/security.md` lines 183-200) explicitly documents that trusted proxy headers (`x-real-ip`, `cf-connecting-ip`) should be checked FIRST because `x-forwarded-for` can be spoofed by attackers. The colossus-reference site correctly implements this priority order in `lib/security/ip-utils.ts`. Additionally, the `getClientIP()` function performs no IP format validation -- it returns whatever string is in the header without checking if it is a valid IP address.
- **Impact:** An attacker can bypass rate limiting by setting a fake `x-forwarded-for` header with a different IP address on each request. This completely defeats rate limiting protection on contact form endpoints.
- **Fix:** Refactor `getClientIP()` in both sites to match the colossus-reference implementation: check `x-real-ip` first, then `cf-connecting-ip`, then `x-forwarded-for` last, and add IP validation using the `isValidIp()` function from `sites/colossus-reference/lib/security/ip-utils.ts`.
- **Effort:** small

### [HIGH] SEC-002: Rate Limiting Disabled by Default on base-template (Stub Implementation)

- **File:** `sites/base-template/lib/rate-limiter.ts` (lines 1-37)
- **Issue:** The base-template ships with a stub rate limiter that always returns `{ success: true, remaining: 999 }` and never blocks requests. The `checkRateLimit()` and `rateLimitMiddleware()` functions are no-ops. Any site created from the base template inherits no rate limiting protection unless the file is manually replaced with the real implementation.
- **Impact:** Contact form endpoints on base-template-derived sites are completely unprotected against abuse. An attacker can submit unlimited form submissions causing email spam, Resend API quota exhaustion, and potential service disruption.
- **Fix:** Replace the stub implementation with the real Upstash Redis rate limiter from `sites/colossus-reference/lib/rate-limiter.ts`. Update the site creation documentation to highlight that Upstash credentials must be configured.
- **Effort:** small

### [HIGH] SEC-003: smiths-electrical-cambridge Uses Stub Rate Limiter

- **File:** `sites/smiths-electrical-cambridge/lib/rate-limiter.ts` (lines 1-37)
- **Issue:** This production site has an identical stub rate limiter to base-template. The `rateLimitMiddleware()` always returns `null` (allow request) regardless of how many requests are made. If `siteConfig.features.rateLimit` is `true`, the code path enters rate limiting but the check always passes.
- **Impact:** This site has zero rate limiting protection. Contact form abuse is possible at scale.
- **Fix:** Copy the real rate limiter implementation from `sites/colossus-reference/lib/rate-limiter.ts` and configure the Upstash Redis environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`).
- **Effort:** small

### [HIGH] SEC-004: Analytics GET Endpoint Exposes Configuration in Production

- **File:** `sites/colossus-reference/app/api/analytics/track/route.ts` (lines 250-279)
- **Issue:** The `GET` handler for `/api/analytics/track` returns feature flag states and analytics platform configuration status to any unauthenticated requester in all environments. Unlike the `/api/analytics/debug` endpoint which correctly gates access behind `NODE_ENV !== "development"`, this GET handler has no access restriction.
- **Impact:** Information disclosure -- attackers can learn which analytics services are active, which platforms are configured, and internal feature flag states. This aids reconnaissance for targeted attacks.
- **Fix:** Either remove the GET handler, restrict it to development environment (like the debug endpoint), or strip sensitive configuration from the response in production.
- **Effort:** trivial

### [MEDIUM] SEC-005: CSRF Token Not Invalidated After Use (Replay Attack)

- **File:** `sites/base-template/lib/csrf.ts` (lines 52-81), `sites/smiths-electrical-cambridge/lib/csrf.ts` (lines 52-81)
- **Issue:** The `validateCSRFToken()` function verifies the token but does not delete or invalidate it after successful validation. A valid CSRF token can be reused multiple times until it expires (1 hour). The `clearCSRFToken()` function exists (lines 86-89) but is never called after validation.
- **Impact:** A captured CSRF token can be replayed within its 1-hour validity window. Combined with the rate limiting bypass issues, this allows automated form spam using a single stolen token.
- **Fix:** Call `clearCSRFToken()` after successful token validation in the `validateCSRFToken()` function to make each token single-use.
- **Effort:** trivial

### [MEDIUM] SEC-006: Contact API Returns Submission Data Including IP in Response

- **File:** `sites/colossus-reference/app/api/contact/route.tsx` (lines 160-167, 225-232, 237-244)
- **Issue:** The contact API returns the full `submission` object (including IP address, user agent, referer) in the response body via `received: submission` on all three success paths.
- **Impact:** Information disclosure. While mostly the user's own data, this pattern is problematic if responses are cached or logged by intermediaries. It also establishes a bad pattern for other developers to follow.
- **Fix:** Remove `received: submission` from all response objects. Log submissions server-side only.
- **Effort:** trivial

### [MEDIUM] SEC-007: Contact API Leaks Internal Error Details

- **File:** `sites/colossus-reference/app/api/contact/route.tsx` (line 252)
- **Issue:** The catch block returns `details: message` where `message` is the raw error message from any thrown exception. This can leak implementation details, file paths, or database error messages.
- **Impact:** Information disclosure that aids attacker reconnaissance. The base-template and smiths-electrical-cambridge correctly return generic error messages.
- **Fix:** Return a generic error message (`{ error: "An unexpected error occurred" }`) and log details server-side only.
- **Effort:** trivial

### [MEDIUM] SEC-008: No Input Length Limits on Contact Form Fields

- **File:** `sites/base-template/app/api/contact/route.ts` (lines 77-96), `sites/smiths-electrical-cambridge/app/api/contact/route.ts` (lines 77-96), `sites/colossus-reference/app/api/contact/route.tsx` (lines 60-80)
- **Issue:** None of the contact form routes enforce maximum length on input fields. The security standard recommends Zod validation with limits (name: 100 chars, message: 2000 chars) but actual implementations use simple truthy checks without length constraints.
- **Impact:** Attackers can submit arbitrarily large payloads causing email delivery failures, increased API costs, and potential memory issues.
- **Fix:** Add Zod schema validation as documented in `docs/standards/security.md` lines 254-277.
- **Effort:** small

### [MEDIUM] SEC-009: Missing CORS Configuration on API Routes

- **File:** `sites/base-template/next.config.ts`, `sites/smiths-electrical-cambridge/next.config.ts`, `sites/colossus-reference/next.config.ts`
- **Issue:** The security standard requires CORS headers restricting `Access-Control-Allow-Origin` to the specific domain. None of the sites implement CORS headers in their `next.config.ts` headers function.
- **Impact:** Any website can make cross-origin requests to API endpoints. While CSRF protection mitigates dangerous scenarios for POST requests, the lack of CORS means any site can probe GET endpoints like the analytics API.
- **Fix:** Add CORS headers as documented in `docs/standards/security.md` lines 279-294.
- **Effort:** small

### [MEDIUM] SEC-010: colossus-reference Site Missing middleware.ts

- **File:** (missing) `sites/colossus-reference/middleware.ts`
- **Issue:** The colossus-reference site does not have a `middleware.ts` file. The base-template and smiths-electrical-cambridge both have middleware that sets additional security headers. While `next.config.ts` headers function also sets these, middleware provides defense-in-depth.
- **Impact:** Reduced defense-in-depth for the reference site. The `next.config.ts` headers should cover most cases.
- **Fix:** Copy the middleware template from base-template to colossus-reference.
- **Effort:** trivial

### [LOW] SEC-011: Dependency Vulnerabilities (pnpm audit)

- **File:** `pnpm-lock.yaml` (transitive dependencies)
- **Issue:** `pnpm audit` reports 2 high-severity vulnerabilities: (1) `fast-xml-parser` (>=4.3.6 <=5.3.3) RangeError DoS via numeric entities (GHSA-37qj-frw5-hhjh), from `@aws-sdk/client-s3`. (2) `@isaacs/brace-expansion` (<=5.0.0) uncontrolled resource consumption (GHSA-7h2j-956f-4vf2), from `glob > minimatch`.
- **Impact:** Low practical risk. The fast-xml-parser vulnerability requires attacker control over XML parsed by S3 client (internal tool use only). The brace-expansion issue affects glob in build tooling, not runtime.
- **Fix:** Update dependencies: `pnpm update @aws-sdk/client-s3` and `pnpm update glob` to pull patched versions.
- **Effort:** small

### [LOW] SEC-012: CSP Missing font-src Directive

- **File:** `sites/base-template/next.config.ts` (line 99), `sites/smiths-electrical-cambridge/next.config.ts` (line 99), `sites/colossus-reference/next.config.ts` (line 99)
- **Issue:** The Content-Security-Policy header omits `font-src`. Without it, browser falls back to `default-src 'self'` which would block external font CDNs if added later.
- **Impact:** Minor. Currently not exploitable since no external fonts are used.
- **Fix:** Add `font-src 'self'` to the CSP for completeness.
- **Effort:** trivial

### [LOW] SEC-013: dangerouslyAllowSVG Enabled in All Sites

- **File:** `sites/base-template/next.config.ts` (line 61), `sites/smiths-electrical-cambridge/next.config.ts` (line 61), `sites/colossus-reference/next.config.ts` (line 61)
- **Issue:** All sites have `dangerouslyAllowSVG: true` in Next.js images config. SVG can contain JavaScript. However, `contentSecurityPolicy: "script-src 'none'; sandbox;"` mitigates script execution.
- **Impact:** Low risk due to restrictive CSP on image endpoint. Acceptable if SVG sources are trusted (R2 bucket).
- **Fix:** Document as conscious risk acceptance. Revisit if untrusted SVG uploads are ever added.
- **Effort:** trivial (documentation only)

### [LOW] SEC-014: CSRF Secret Fallback in Production

- **File:** `sites/colossus-reference/lib/security/csrf.ts` (lines 20-27)
- **Issue:** If `CSRF_SECRET` is not set, code falls back to `crypto.randomBytes()`. In serverless deployment, each cold start generates a new secret, causing token validation failures across instances. A warning is logged but execution continues.
- **Impact:** CSRF tokens may intermittently fail in multi-instance deployments. More a reliability issue than security issue.
- **Fix:** Ensure `CSRF_SECRET` is always set in production. Consider failing hard instead of falling back.
- **Effort:** trivial

### [LOW] SEC-015: setup-vercel-env.ts Contains Duplicate SITES Declaration

- **File:** `tools/setup-vercel-env.ts` (lines 43-47 and 325-329)
- **Issue:** The file declares `SITES` constant twice, which will cause a TypeScript error. While not directly a security issue, broken tooling could lead to misconfigured production secrets.
- **Impact:** The setup script will fail, potentially leaving sites without required environment variables.
- **Fix:** Remove the duplicate `SITES` declaration at lines 325-329.
- **Effort:** trivial

### [LOW] SEC-016: Email Confirmation Sent Without Address Verification

- **File:** `sites/base-template/app/api/contact/route.ts` (lines 276-288), `sites/smiths-electrical-cambridge/app/api/contact/route.ts` (lines 276-288), `sites/colossus-reference/app/api/contact/route.tsx` (lines 218-223)
- **Issue:** Contact forms send confirmation emails to user-supplied addresses without verification. Combined with rate limiting issues, this could be used to send unwanted emails to third parties.
- **Impact:** Potential spam complaints could damage sending domain reputation. Mitigated once rate limiting is properly implemented.
- **Fix:** Ensure rate limiting works (SEC-002, SEC-003). Consider making confirmation emails opt-in.
- **Effort:** medium

## Statistics

- Critical: 0
- High: 4
- Medium: 6
- Low: 6
- Total: 16
