# YOLO Brief: Session 1 — Quick Wins (14 Trivial Fixes)

**Date:** 2026-03-08
**Branch:** Start on `develop`
**Scope:** Low-effort fixes from 2026-03-07 code review
**Estimated time:** 20-30 minutes

---

## Prerequisites

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop
git pull origin develop
```

---

## Fix 1: SEC-002 — Add CSRF_SECRET to .env.example files

**Problem:** Three `.env.example` files are missing the `CSRF_SECRET` variable. New site setups will get intermittent 403 errors on contact forms.

**Files to edit:**

### 1a. Root `.env.example`

**Path:** `/Users/rickywilson/Sites/local-business-platform/.env.example`

Add this line in an appropriate section (near other security/auth variables):

```
# CSRF Protection (required for contact forms)
CSRF_SECRET=your-csrf-secret-change-in-production
```

### 1b. Base-template `.env.example`

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/base-template/.env.example`

Add after the existing env vars (before the analytics section or at end):

```
# CSRF Protection (required for contact forms)
CSRF_SECRET=your-csrf-secret-change-in-production
```

### 1c. DJ Fox `.env.example`

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/.env.example`

Add in the same location as the other site:

```
# CSRF Protection (required for contact forms)
CSRF_SECRET=your-csrf-secret-change-in-production
```

---

## Fix 2: SEC-003 — Add security headers to showcase next.config.ts

**Problem:** `sites/showcase/next.config.ts` has zero security headers while production sites have comprehensive headers.

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/showcase/next.config.ts`

**Current content** (minimal config with no headers):

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@platform/core-components', '@platform/theme-system', '@platform/themes'],
  images: {
    remotePatterns: [
      { hostname: 'placehold.co' },
    ],
  },
};

export default config;
```

**Action:** Add the `headers()` function from DJ Fox's `next.config.ts`. Copy the entire `async headers()` block from `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/next.config.ts` (lines 75-146) into the showcase config object. The showcase site does not use MDX or `@next/mdx`, so keep the existing config shape — just add the `headers()` function inside the config object.

The headers to copy include: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy, Strict-Transport-Security, Cross-Origin-Resource-Policy, Permissions-Policy, and the CORS headers for API routes.

Adapt the CSP if needed — showcase may not use Google Analytics or Facebook, so you can use a simpler `script-src 'self' 'unsafe-inline'` if the full CSP references services showcase does not use.

---

## Fix 3: SEC-004 — Sanitize appName in NRQL query

**Problem:** `tools/sync-external-services.ts` interpolates `appName` directly into NRQL queries, enabling injection.

**File:** `/Users/rickywilson/Sites/local-business-platform/tools/sync-external-services.ts`

**Location:** The `fetchNewRelicMetrics` function (around line 369).

**Action:** Add input validation at the top of the function body, before the NRQL queries are constructed:

```ts
async function fetchNewRelicMetrics(
  appName: string,
  date: string
): Promise<...> {
  // SEC-004: Validate appName to prevent NRQL injection
  if (!/^[a-zA-Z0-9_\-. ]+$/.test(appName)) {
    throw new Error(`Invalid app name: "${appName}". Only alphanumeric characters, underscores, hyphens, dots, and spaces are allowed.`);
  }

  // ... rest of existing function
```

Note: Include space and dot in the allowed characters since NewRelic app names commonly contain those (e.g., "DJ Fox Electrical").

---

## Fix 4: SEC-008 — Prevent error message leaking in analytics debug endpoint

**Problem:** The debug endpoint's catch blocks return `error.message` to the client. Although the route already checks `NODE_ENV !== "development"` and returns 404 for non-dev, the error messages in catch blocks could still theoretically leak if the check were bypassed.

**Files:**
- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/api/analytics/debug/route.ts`
- `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/api/analytics/debug/route.ts`

**Action:** In each file, in the catch blocks of both the `GET` and `POST` handlers (lines ~99-109 and ~143-153), remove the `message` field from the error response. The `NODE_ENV` check already gates access, but defense in depth means the error response should not include raw error messages:

**Before (in both GET and POST catch blocks):**
```ts
return NextResponse.json(
  {
    error: "Internal server error",
    message: error instanceof Error ? error.message : "Unknown error",
  },
  { status: 500 }
);
```

**After:**
```ts
return NextResponse.json(
  {
    error: "Internal server error",
  },
  { status: 500 }
);
```

Keep the `console.error` line — that stays server-side.

---

## Fix 5: CQ-001 — Remove default export from accent-underline.tsx

**Problem:** `accent-underline.tsx` has both a named export and a default export. Platform convention is named exports only.

**File:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/components/ui/accent-underline.tsx`

**Action:** Delete line 88:

```ts
export default AccentUnderline;
```

Keep the existing named export on line 76: `export const AccentUnderline`.

**Verify no consumers use the default import:**
```bash
grep -r "import AccentUnderline from" /Users/rickywilson/Sites/local-business-platform/sites/ /Users/rickywilson/Sites/local-business-platform/packages/ --include="*.ts" --include="*.tsx" 2>/dev/null
```

If any do, convert them to `import { AccentUnderline } from ...`.

---

## Fix 6: CQ-002 — Replace inline style in accent-underline.tsx with Tailwind

**Problem:** The `accent-underline.tsx` component uses inline `style={{}}` (lines 60-65) instead of Tailwind classes.

**File:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/components/ui/accent-underline.tsx`

**Current code (lines 57-69):**
```tsx
<span
  key={index}
  className="accent-underline"
  style={{
    textDecoration: "underline",
    textDecorationColor: "var(--color-brand-primary)",
    textDecorationThickness: `${underlineThickness}px`,
    textUnderlineOffset: `${underlineOffset}px`,
  }}
>
```

**Challenge:** The `underlineThickness` and `underlineOffset` are dynamic props (numbers), so they cannot be pure Tailwind utility classes. The best approach here is to keep the CSS custom property reference but use Tailwind's arbitrary value syntax where possible, and accept that truly dynamic pixel values require inline style or CSS variables.

**Recommended approach:** Use Tailwind classes for what you can, and a minimal inline style for the dynamic pixel values:

```tsx
<span
  key={index}
  className="accent-underline underline decoration-brand-primary"
  style={{
    textDecorationThickness: `${underlineThickness}px`,
    textUnderlineOffset: `${underlineOffset}px`,
  }}
>
```

This replaces `textDecoration: "underline"` with `underline` class and `textDecorationColor: "var(--color-brand-primary)"` with `decoration-brand-primary` class. The two remaining dynamic pixel values stay as inline style since they depend on component props.

If `decoration-brand-primary` is not available in the Tailwind config, check whether the theme system plugin registers it. If not, use `decoration-[var(--color-brand-primary)]` as the arbitrary value form.

Update the `parseText` function signature to still accept the thickness/offset params.

---

## Fix 7: CQ-006 — Gate console.log in instrumentation.ts

**Problem:** Both base-template and colossus-scaffolding log on every cold start unconditionally.

**Files:**
- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/instrumentation.ts`
- `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/instrumentation.ts`

**Action:** In each file, wrap the console.log:

**Before:**
```ts
console.log("NewRelic instrumentation loaded");
```

**After:**
```ts
if (process.env.NODE_ENV !== "production") {
  console.log("NewRelic instrumentation loaded");
}
```

Note: DJ Fox's `next.config.ts` uses `compiler.removeConsole` for production, but that only works for client-side code. Server-side instrumentation runs in Node.js, so an explicit guard is needed.

---

## Fix 8: CQ-014 — Fix content.md documentation mismatch

**Problem:** The `docs/standards/content.md` example frontmatter shows `services.cards` but the actual Zod schema in `content-schemas.ts` uses `services.items` for the services section service list.

**File:** `/Users/rickywilson/Sites/local-business-platform/docs/standards/content.md`

**Location:** Around line 121-124 in the example location frontmatter block.

**Current:**
```yaml
services:
  cards:
    - title: "Access Scaffolding"
      href: "/services/access-scaffolding"
```

**Change to:**
```yaml
services:
  items:
    - title: "Access Scaffolding"
      href: "/services/access-scaffolding"
```

Note: The `specialists.cards` field on line 118 is correct — the schema does use `cards` for specialists. Only the `services` section uses `items`.

---

## Fix 9: A11Y-004 — Replace hardcoded slate colors in breadcrumbs.tsx

**Problem:** `breadcrumbs.tsx` uses `text-slate-400`, `text-slate-500`, `text-slate-700`, `text-slate-900` which break dark themes and violate the theme token rule.

**File:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/components/ui/breadcrumbs.tsx`

**Replacements:**

| Line | Current | Replacement |
|------|---------|-------------|
| 29 | `text-slate-400` (ChevronRightIcon) | `text-surface-muted` |
| 50 | `text-slate-400 hover:text-slate-500` (Home link) | `text-surface-muted hover:text-surface-foreground` |
| 63 | `text-slate-900` (current page span) | `text-surface-foreground` |
| 69 | `text-slate-500 hover:text-slate-700` (breadcrumb links) | `text-surface-muted hover:text-surface-foreground` |

---

## Fix 10: A11Y-008 — Add aria-hidden to phone SVG in mobile menu CTA

**Problem:** A phone SVG in the mobile menu bottom CTA is missing `aria-hidden="true"`.

**Likely file:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/components/ui/faq-section.tsx`

The faq-section has two phone SVGs (around lines 115 and 133). Add `aria-hidden="true"` to both:

**Before (line ~115):**
```tsx
<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
```

**After:**
```tsx
<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
```

Do the same for the second phone SVG (around line 133).

Also check these locations for phone SVGs without `aria-hidden="true"`:
- Any header/navigation components in site `components/ui/` directories
- The mobile menu component already has `aria-hidden="true"` on its dropdown chevron, so verify the phone CTA SVG at the bottom of the menu is similarly tagged

Search comprehensively:
```bash
grep -rn '<svg' packages/core-components/src/components/ui/ --include="*.tsx" | grep -v 'aria-hidden'
```

Add `aria-hidden="true"` to any decorative SVGs found.

---

## Fix 11: A11Y-003 — Add aria-hidden to decorative SVGs

**Problem:** Decorative SVGs in several components are missing `aria-hidden="true"`.

### 11a. Blog [slug]/page.tsx — chevron SVGs in related services links

**Files:**
- `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/blog/[slug]/page.tsx`
- `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/app/blog/[slug]/page.tsx`
- `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/blog/[slug]/page.tsx`

**Location:** Around line 214 — a chevron SVG next to service links.

**Before:**
```tsx
<svg
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
```

**After:**
```tsx
<svg
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  aria-hidden="true"
>
```

### 11b. location-hero.tsx — decorative SVGs

**File:** `/Users/rickywilson/Sites/local-business-platform/packages/core-components/src/components/ui/location-hero.tsx`

There are three SVGs (around lines 86, 103, 138). Check each one — the phone icon (line 86) and placeholder image icon (line 138) should get `aria-hidden="true"`. The trust badge checkmark SVGs (line 103) are also decorative. Add `aria-hidden="true"` to all SVGs that don't already have it.

---

## Fix 12: SEO-004 — Add /api/ disallow to colossus robots.ts

**Problem:** Colossus `robots.ts` does not disallow `/api/` routes from crawlers.

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/app/robots.ts`

**Current (line 13):**
```ts
rules: [{ userAgent: "*", allow: isProd ? "/" : [], disallow: isProd ? [] : "/" }],
```

**Change to:**
```ts
rules: [{ userAgent: "*", allow: isProd ? "/" : [], disallow: isProd ? ["/api/"] : "/" }],
```

---

## Fix 13: SEO-009 — Add /reviews to base-template sitemap.ts

**Problem:** The `/reviews` page is missing from the base-template core sitemap.

**File:** `/Users/rickywilson/Sites/local-business-platform/sites/base-template/app/sitemap.ts`

**Action:** Add a `/reviews` entry to the return array, after the `/contact` entry (around line 49):

```ts
{
  url: `${baseUrl}/reviews`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.7,
},
```

Also check `sites/dj-fox-electrical/app/sitemap.ts` and `sites/colossus-scaffolding/app/sitemap.ts` — the aggregated report says "dj-fox and colossus already have it" but verify. If they are missing it, add it there too.

---

## Fix 14: ARCH-010 — Replace hardcoded brand name in image.ts wrappers

**Problem:** `image.ts` files in sites hardcode a `BRAND_NAME` string instead of reading from `siteConfig`.

**Files to change:**

### 14a. Base-template

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/base-template/lib/image.ts`

**Before:**
```ts
// TODO: Replace with actual business name from site.config
const BRAND_NAME = 'Your Business';
```

**After:**
```ts
import { siteConfig } from '@/site.config';

const BRAND_NAME = siteConfig.business.name;
```

Remove the TODO comment.

### 14b. DJ Fox

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical/lib/image.ts`

**Before:**
```ts
const BRAND_NAME = 'D J Fox Electrical';
```

**After:**
```ts
import { siteConfig } from '@/site.config';

const BRAND_NAME = siteConfig.business.name;
```

### 14c. Colossus

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/colossus-scaffolding/lib/image.ts`

**Before:**
```ts
const BRAND_NAME = "Colossus Scaffolding";
```

**After:**
```ts
import { siteConfig } from "@/site.config";

const BRAND_NAME = siteConfig.business.name;
```

### 14d. Showcase

**Path:** `/Users/rickywilson/Sites/local-business-platform/sites/showcase/lib/image.ts`

This file has a completely different structure (stub implementation). It doesn't use the core-components wrapper pattern, so it does not need this change. Skip it.

---

## Verification

After all changes:

```bash
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
pnpm build
```

All three commands must pass cleanly. If `type-check` fails, fix the issues before proceeding. Common issues:
- Import path typos in the `siteConfig` imports
- `decoration-brand-primary` not being a valid Tailwind class (use arbitrary value form if needed)

---

## UPDATE AGGREGATED REPORT

After all fixes and verification, update `/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-03-07_code-review/aggregated-report.md`:

Add a new section at the bottom, before the final `_Generated by...` line:

```markdown
---

## Session 1 Fixes Applied (2026-03-08)

| Finding ID | Status | Evidence |
|-----------|--------|----------|
| SEC-002 | Fixed | Added `CSRF_SECRET` to root, base-template, and dj-fox `.env.example` files |
| SEC-003 | Fixed | Added security headers to `sites/showcase/next.config.ts` |
| SEC-004 | Fixed | Added regex validation for `appName` in `tools/sync-external-services.ts` |
| SEC-008 | Fixed | Removed `error.message` from catch blocks in analytics debug routes |
| CQ-001 | Fixed | Removed default export from `accent-underline.tsx` |
| CQ-002 | Fixed | Replaced inline `style={{}}` with Tailwind classes in `accent-underline.tsx` |
| CQ-006 | Fixed | Added `NODE_ENV !== 'production'` guard to `instrumentation.ts` in both sites |
| CQ-014 | Fixed | Changed `services.cards` to `services.items` in `docs/standards/content.md` |
| A11Y-004 | Fixed | Replaced `text-slate-*` with theme tokens in `breadcrumbs.tsx` |
| A11Y-008 | Fixed | Added `aria-hidden="true"` to phone SVGs in `faq-section.tsx` |
| A11Y-003 | Fixed | Added `aria-hidden="true"` to decorative SVGs in blog slug pages and `location-hero.tsx` |
| SEO-004 | Fixed | Added `/api/` disallow to `sites/colossus-scaffolding/app/robots.ts` |
| SEO-009 | Fixed | Added `/reviews` entry to `sites/base-template/app/sitemap.ts` |
| ARCH-010 | Fixed | Replaced hardcoded `BRAND_NAME` with `siteConfig.business.name` in 3 site `image.ts` files |
```

Update the Executive Summary table counts to reflect the reduced open findings.

---

## Commit

```bash
git add -A
git commit -m "fix: resolve 14 quick-win findings from 2026-03-07 code review

Fixes: SEC-002, SEC-003, SEC-004, SEC-008, CQ-001, CQ-002, CQ-006,
CQ-014, A11Y-003, A11Y-004, A11Y-008, SEO-004, SEO-009, ARCH-010

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

Do NOT push. Do NOT merge to staging or main.
