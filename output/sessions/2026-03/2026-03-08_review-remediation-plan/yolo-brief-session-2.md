# YOLO Brief: Session 2 — Security Hardening (3 Fixes)

**Date:** 2026-03-08
**Branch:** Start on `develop`
**Scope:** Security fixes from 2026-03-07 code review
**Estimated time:** 15-20 minutes

---

## Prerequisites

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop
git pull origin develop
```

---

## Fix 1: SEC-005 — Add Origin validation to analytics track endpoint

**Problem:** The analytics track endpoint (`/api/analytics/track/route.ts`) accepts POST requests without any CSRF or Origin validation. While the contact form route validates CSRF tokens, the analytics route does not.

**Files:**

- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/api/analytics/track/route.ts`
- `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/api/analytics/track/route.ts`

**Action:** Add Origin header validation at the top of the `POST` handler in each file. This is a lightweight check — it does not require CSRF tokens (since analytics events are fire-and-forget from the client), but it prevents cross-origin abuse.

Add this helper function near the top of each file (after the imports):

```ts
/**
 * Validate that the request Origin matches the site's domain.
 * Prevents cross-site analytics injection.
 */
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Same-origin requests from some browsers may not send Origin
    // Accept requests without Origin header (they come from same-origin fetch)
    return true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

  const allowedOrigins = [
    siteUrl,
    vercelUrl,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ].filter(Boolean) as string[];

  return allowedOrigins.some((allowed) => origin === allowed);
}
```

Then add this check at the top of the `POST` handler, before the existing logic:

```ts
export async function POST(request: NextRequest) {
  // SEC-005: Origin validation to prevent cross-site analytics injection
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid origin" },
      { status: 403 }
    );
  }

  // ... rest of existing handler
```

**Important:** Do NOT add this to DJ Fox's analytics track route — check if DJ Fox has its own `app/api/analytics/track/route.ts`. If it does, apply the same fix there. If it shares the same route as base-template (via workspace linking), no action needed.

```bash
ls /Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/api/analytics/track/route.ts 2>/dev/null
```

If the file exists, apply the same fix.

---

## Fix 2: SEC-006 — HTML-escape email subject in colossus contact route

**Problem:** In the colossus contact route, the email subject may contain user-provided content that is not HTML-escaped. While Resend likely handles this, defense in depth is appropriate.

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/api/contact/route.tsx`

**Context:** The file already imports `escapeHtml` from `@platform/core-components/lib/security/html-escape` (line 4). The email body content is already escaped using this function. The issue is specifically with the email subject line.

**Location:** Around line 143-145, the email subject is constructed:

```ts
const emailSubject =
  subject ||
  `New enquiry from ${name}${service ? ` - ${service}` : ""}${location ? ` (${location})` : ""}`;
```

**Action:** Apply `escapeHtml` to the user-provided values in the subject:

```ts
const emailSubject = subject
  ? escapeHtml(subject)
  : `New enquiry from ${escapeHtml(name)}${service ? ` - ${escapeHtml(service)}` : ""}${location ? ` (${escapeHtml(location)})` : ""}`;
```

Also check the confirmation email subject (around line 257):

```ts
subject: `Thank you for your enquiry - ${process.env.BUSINESS_NAME}`,
```

This one is fine — `process.env.BUSINESS_NAME` is server-controlled, not user input.

**Also check:** Does the base-template or DJ Fox contact route have the same issue? Check:

- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/api/contact/route.ts`
- `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/api/contact/route.ts`

If they construct email subjects from user input without escaping, apply the same fix.

---

## Fix 3: SEC-007 — Add comment about in-memory CSRF replay set limitation

**Problem:** The CSRF token replay prevention uses an in-memory `Set` that only works within a single serverless instance. This is a known limitation, not a bug, but it should be documented.

**File:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/lib/security/csrf.ts`

**Location:** Around line 52-53, where the `usedTokens` Set is declared:

**Current:**

```ts
// Single-use token enforcement: track used tokens to prevent replay attacks
const usedTokens = new Set<string>();
```

**Action:** Expand the comment to document the distributed limitation:

```ts
// Single-use token enforcement: track used tokens to prevent replay attacks.
//
// LIMITATION: This in-memory Set only tracks replays within a single serverless
// instance. In a distributed/serverless environment (e.g., Vercel), different
// instances maintain separate Sets, so a token could theoretically be replayed
// across instances. For stronger replay protection in production, consider using
// a shared store (Redis, Vercel KV, or Supabase) for cross-instance tracking.
// The current approach still provides meaningful protection against automated
// replay attacks hitting the same instance.
const usedTokens = new Set<string>();
```

This is documentation-only. No functional change.

---

## Verification

After all changes:

```bash
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
pnpm build
```

All three commands must pass cleanly.

Specific checks:

- Verify the `validateOrigin` function compiles correctly (NextRequest type is imported)
- Verify `escapeHtml` is already imported in the colossus contact route (it is — line 4)
- Verify the comment change in `csrf.ts` does not affect any logic

---

## UPDATE AGGREGATED REPORT

After all fixes and verification, update `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-03-07_code-review/aggregated-report.md`:

Add a new section at the bottom (after any Session 1 section if it exists, before the final `_Generated by...` line):

```markdown
## Session 2 Fixes Applied (2026-03-08)

| Finding ID | Status | Evidence                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------- |
| SEC-005    | Fixed  | Added `validateOrigin()` check to analytics track route in base-template and colossus |
| SEC-006    | Fixed  | Applied `escapeHtml()` to email subject in colossus contact route                     |
| SEC-007    | Fixed  | Added distributed limitation comment to `csrf.ts` usedTokens Set                      |
```

Update the Executive Summary table counts to reflect the reduced open findings.

---

## Commit

```bash
git add -A
git commit -m "fix(security): add origin validation to analytics, escape email subject, document CSRF limitation

Fixes: SEC-005, SEC-006, SEC-007

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

Do NOT push. Do NOT merge to staging or main.
