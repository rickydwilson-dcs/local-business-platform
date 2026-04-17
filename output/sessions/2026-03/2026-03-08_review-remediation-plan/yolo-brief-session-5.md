# YOLO Brief: Session 5 -- Console.log Cleanup + Minor Code Quality

**Findings:** CQ-003, CQ-004, CQ-005, CQ-008, CQ-009, CQ-013
**Branch:** Create `fix/cq-session-5` from `develop`

---

## Pre-Flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull origin develop
git checkout -b fix/cq-session-5
```

---

## CQ-003: Gate Analytics.tsx console.log on NODE_ENV

**File:** `packages/core-components/src/components/analytics/Analytics.tsx`

**Problem:** The `debugMode` console.log statements are not gated on `NODE_ENV`. If `debugMode` is somehow true in production, logs leak to the browser console.

**Current state:** There are three `if (debugMode) { console.log(...) }` blocks (lines ~74, ~90, ~101). The debug Script block at line ~297 already checks `process.env.NODE_ENV === "development"` -- that one is fine.

**Change:** Wrap each of the three `debugMode` checks with an additional `NODE_ENV` guard:

```typescript
// BEFORE:
if (debugMode) {
  console.log("GA4 initialized with ID:", gaId, "and initial page view sent");
}

// AFTER:
if (process.env.NODE_ENV !== "production" && debugMode) {
  console.log("GA4 initialized with ID:", gaId, "and initial page view sent");
}
```

Apply this pattern to all three occurrences:

1. `initializeGA4` callback (~line 74)
2. `initializeFacebookPixel` callback (~line 90)
3. `initializeGoogleAds` callback (~line 101)

---

## CQ-004: Gate google-ads.ts console.log on NODE_ENV

**File:** `packages/core-components/src/lib/analytics/google-ads.ts`

**Problem:** Some `console.log` statements are already gated on `NODE_ENV === "development"` (lines ~113, ~139), but `console.warn` at line ~230 is unconditional.

**Current state after review:**

- Line 113: `if (process.env.NODE_ENV === "development") { console.log(...) }` -- ALREADY FINE
- Line 139: `if (process.env.NODE_ENV === "development") { console.log(...) }` -- ALREADY FINE
- Line 230: `console.warn("Google Ads configuration missing or invalid");` -- unconditional

**Change:** Gate the `console.warn` at line ~230:

```typescript
// BEFORE:
if (!this.validateConfig(customerId, conversionActionId)) {
  console.warn("Google Ads configuration missing or invalid");
  return null;
}

// AFTER:
if (!this.validateConfig(customerId, conversionActionId)) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("Google Ads configuration missing or invalid");
  }
  return null;
}
```

Keep all `console.error` calls as-is (error logging is acceptable in production).

---

## CQ-005: Gate rate-limiter.ts console.log on NODE_ENV

**File:** `packages/core-components/src/lib/rate-limiter.ts`

**Problem:** There are `console.log` calls that are informational and should not appear in production output.

**Current state after review:**

- Line 107: `console.warn("[Rate Limiter] Missing siteSlug in development - allowing request");` -- already inside a `NODE_ENV !== "production"` block (the else branch). ALREADY FINE.
- Line 119: `console.log("[Rate Limiter] Supabase not configured - allowing request");` -- gated on `NODE_ENV === "development"`. ALREADY FINE.
- Line 154: `console.log("[Rate Limiter] Request denied", { ... });` -- UNCONDITIONAL. This logs on every rate limit denial in production.

**Change:** Gate the denial log at line ~154:

```typescript
// BEFORE:
if (!data.allowed) {
  const retryAfter = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);

  // Structured logging for rate limit denials
  console.log("[Rate Limiter] Request denied", {
    siteSlug,
    identifier,
    endpoint,
    requestCount: data.request_count,
    maxRequests,
    timestamp: new Date().toISOString(),
  });

  return { allowed: false, retryAfter };
}

// AFTER:
if (!data.allowed) {
  const retryAfter = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Rate Limiter] Request denied", {
      siteSlug,
      identifier,
      endpoint,
      requestCount: data.request_count,
      maxRequests,
      timestamp: new Date().toISOString(),
    });
  }

  return { allowed: false, retryAfter };
}
```

Keep `console.error` calls as-is (line ~96 and ~168).

---

## CQ-008: Showcase site hardcoded gray colors

**File locations:** Multiple files in `sites/showcase/`

**Problem:** The showcase site uses hardcoded `text-gray-*` and `bg-gray-*` classes throughout its components instead of theme tokens.

**Current state:** The showcase site is a special-purpose demo/comparison tool. It has a `tailwind.config.ts` that uses the theme system plugin, meaning theme tokens ARE available. However, the showcase renders components inside `[data-theme="..."]` wrappers for comparison -- its own chrome (ElementBrowser, ElementCard, BrandInjectorModal, page layouts) uses hardcoded grays because the chrome itself is not themed.

**Decision:** The showcase chrome is intentionally NOT themed -- it is a neutral UI shell that wraps themed component previews. Applying theme tokens to the chrome would make it change appearance when switching themes, which defeats its purpose.

**Action:** Add eslint-disable comments at the file level for the three main chrome components, explaining the rationale. This is the same pattern used for CQ-007 exemptions.

### Files to update:

**`sites/showcase/components/ElementBrowser.tsx`** -- Add at top of file after imports:

```typescript
/* eslint-disable platform/no-hardcoded-tailwind-colors -- Showcase chrome is intentionally unthemed; it provides a neutral shell around themed component previews */
```

**`sites/showcase/components/ElementCard.tsx`** -- Same comment at top.

**`sites/showcase/components/BrandInjectorModal.tsx`** -- Same comment at top.

**`sites/showcase/app/page.tsx`** -- Same comment at top.

**`sites/showcase/app/compare/page.tsx`** -- Same comment at top.

**`sites/showcase/app/globals.css`** -- Add inline disable comment on the line with hardcoded grays:

```css
/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Showcase base styles are intentionally unthemed */
@apply bg-gray-50 text-gray-900 antialiased;
```

Note: If the ESLint rule does not apply to CSS files, skip this one.

---

## CQ-009: DJ Fox USAGE_EXAMPLES.tsx hardcoded grays

**File:** `sites/dj-fox-electrical/components/ui/USAGE_EXAMPLES.tsx`

**Problem:** This file contains `text-gray-*` and `bg-gray-*` hardcoded color classes.

**Current state:** The file already has some `eslint-disable-next-line` comments for the ESLint rule from the CQ-007 work. Check if all instances are covered.

**Action:** This is an example/documentation file, not production UI. Ensure every line with hardcoded gray classes has an eslint-disable comment. The file already has several -- verify coverage:

1. Search for any `text-gray-*` or `bg-gray-*` in the file that does NOT already have an eslint-disable comment on the preceding line.
2. For any uncovered instances, add: `{/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Example code; not production UI */}`

Based on the current file content, the following lines need checking:

- Line ~259: `text-gray-700` -- already has eslint-disable on line 258. OK.
- Line ~303: `bg-gray-50` -- already has eslint-disable on line 302. OK.
- Line ~359: `bg-gray-50` -- already has eslint-disable on line 358. OK.

If all instances are already covered, this finding is already resolved. Confirm in the aggregated report.

---

## CQ-013: Star rating hardcoded `text-yellow-400`

**Problem:** Star ratings use hardcoded `text-yellow-400` in multiple locations. The empty star color varies -- some use `text-gray-200`, some use `text-surface-subtle` (already migrated).

**Files with `text-yellow-400`:**

1. `packages/core-components/src/components/ui/star-rating.tsx` (lines 66, 76)
2. `packages/core-components/src/components/ui/article-callout.tsx` (line 168)
3. `sites/colossus-scaffolding/app/reviews/page.tsx` (lines 46, 76)
4. `sites/colossus-scaffolding/app/projects/page.tsx` (line 117)
5. `sites/base-template/app/projects/page.tsx` (line 119)
6. `sites/dj-fox-electrical/app/projects/page.tsx` (line 119)

**Approach:** Star rating yellow is a semantic UI color (like success green or warning amber). Adding a dedicated theme token is the correct long-term fix, but the theme token system would need to be extended. For now, use eslint-disable comments with a clear explanation, consistent with how CQ-007 handled semantic colors.

### For each file listed above, add eslint-disable comments:

**`packages/core-components/src/components/ui/star-rating.tsx`:**

Add a file-level comment after the imports:

```typescript
/* eslint-disable platform/no-hardcoded-tailwind-colors -- Star rating yellow is a semantic UI color; a dedicated theme token (e.g., text-rating) should be added in a future theme system update */
```

**`packages/core-components/src/components/ui/article-callout.tsx`:**

Add an inline comment before the star rating line (~168):

```typescript
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating yellow is a semantic UI color */
}
```

**`sites/colossus-scaffolding/app/reviews/page.tsx`:**

Add eslint-disable-next-line before each occurrence (lines ~46 and ~76):

```typescript
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating yellow is a semantic UI color */
}
```

**`sites/colossus-scaffolding/app/projects/page.tsx`:**

The line also references `text-gray-200` for empty stars. Add eslint-disable-next-line before line ~117:

```typescript
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating: yellow for filled, gray for empty; semantic UI colors pending theme token */
}
```

**`sites/base-template/app/projects/page.tsx`:**

Same pattern, add eslint-disable-next-line before line ~119:

```typescript
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating: yellow for filled, gray for empty; semantic UI colors pending theme token */
}
```

**`sites/dj-fox-electrical/app/projects/page.tsx`:**

Same pattern, add eslint-disable-next-line before line ~119:

```typescript
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating: yellow for filled, gray for empty; semantic UI colors pending theme token */
}
```

---

## Verification

Run all three checks from the monorepo root:

```bash
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
pnpm build
```

All three must pass. Fix any issues before committing.

---

## Commit

```bash
git add -A
git commit -m "fix(code-quality): gate console.log on NODE_ENV, eslint-disable for showcase/star-rating hardcoded colors (CQ-003/004/005/008/009/013)"
```

Do NOT push to `staging` or `main`. Leave the branch as `fix/cq-session-5`.

---

## UPDATE AGGREGATED REPORT

After all fixes and verification, update `output/sessions/2026-03-07_code-review/aggregated-report.md`:

1. In the **MEDIUM** findings table, add a note or strikethrough for **CQ-003**, **CQ-004**, **CQ-005** indicating they are fixed.
2. In the **LOW** findings table, add a note or strikethrough for **CQ-008**, **CQ-009**, **CQ-013** indicating they are fixed.
3. At the bottom of the file, add or update a **"Fixed in Session 5"** section:

```markdown
### Fixed in Session 5 (fix/cq-session-5)

| ID     | Fix Summary                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| CQ-003 | Added `process.env.NODE_ENV !== 'production'` guard to three `debugMode` console.log calls in `Analytics.tsx`                             |
| CQ-004 | Gated `console.warn` in `GoogleAdsAnalytics.fromEnvironment()` on `NODE_ENV !== 'production'`                                             |
| CQ-005 | Gated rate limit denial `console.log` on `NODE_ENV !== 'production'` in `rate-limiter.ts`                                                 |
| CQ-008 | Added file-level eslint-disable to showcase chrome components (intentionally unthemed neutral shell)                                      |
| CQ-009 | Verified all hardcoded grays in `USAGE_EXAMPLES.tsx` already have eslint-disable comments from CQ-007                                     |
| CQ-013 | Added eslint-disable comments to star rating `text-yellow-400` across 6 files; documented as semantic UI color pending future theme token |
```

4. Update the Executive Summary total counts to reflect 6 fewer open findings.

Confirm this update was done in your final report.
