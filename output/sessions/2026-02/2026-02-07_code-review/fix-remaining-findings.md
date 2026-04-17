You are fixing confirmed open findings from the 2026-02-07 code review. The full finding details are in:
output/sessions/2026-02-07_code-review/remediation-audit.md

Read that file first for context. Then apply every fix below in order. Do not auto-commit. Do not modify files outside this list.

After ALL fixes are applied, run: pnpm type-check && pnpm lint && pnpm build
Then report which fixes succeeded and which (if any) failed.

---

## FIX 1 — CQ-006: Remove PII from contact form console.log (3 files)

**sites/base-template/app/api/contact/route.ts** lines 164-171:
Replace the console.log that logs name/email/service/location with a NODE_ENV-guarded version that omits PII:

```ts
if (process.env.NODE_ENV === "development") {
  console.log("Contact form submission received", { receivedAt: submission.receivedAt, emailSent });
}
```

Also guard lines 190-191 (the "Resend not configured" logs) with the same NODE_ENV check.

**sites/dj-fox-electrical/app/api/contact/route.ts** — same lines, same fix (identical code).

**sites/colossus-reference/app/api/contact/route.tsx** lines 185-191, 210:

- Lines 185-191: guard the "Email service not configured" block with `if (process.env.NODE_ENV === 'development')`
- Line 210: guard the "Email sent successfully" log with `if (process.env.NODE_ENV === 'development')`

---

## FIX 2 — CQ-010: Replace analytics/types.ts full copies with re-exports (2 files)

**sites/base-template/lib/analytics/types.ts** — already correct (`export * from '@platform/core-components/lib/analytics/types'`). No change needed.

**sites/colossus-reference/lib/analytics/types.ts** — currently exports individual named types with a verbose re-export block. Replace entire file content with:

```ts
/**
 * Analytics types — re-exported from core-components.
 */
export * from "@platform/core-components/lib/analytics/types";
```

---

## FIX 3 — CQ-016: Delete colossus performance-tracker.ts duplicate

**sites/colossus-reference/lib/performance-tracker.ts** is byte-for-byte identical to packages/core-components/src/lib/performance-tracker.ts.

1. Check for any imports of this file within the colossus site: `grep -r "performance-tracker" sites/colossus-reference/`
2. If no site-specific code imports it directly, delete the file.
3. If something imports it, update that import to `@platform/core-components/lib/performance-tracker`.

---

## FIX 4 — SEC-007: Add CSRF_SECRET to colossus .env.example

**sites/colossus-reference/.env.example** — add after the existing secrets section:

```
# ===== CSRF PROTECTION =====
# Required for stable CSRF token validation across serverless instances.
# Generate with: openssl rand -base64 32
# Must be the same value across all deployment instances.
CSRF_SECRET=your-random-secret-here-minimum-32-chars
```

---

## FIX 5 — SEC-006: Add middleware.ts to colossus-reference

**sites/colossus-reference/middleware.ts** — create this file. Copy the pattern from sites/dj-fox-electrical/middleware.ts if it exists, otherwise from sites/base-template/middleware.ts.

Check which template sites have middleware.ts first:

```bash
ls sites/*/middleware.ts 2>/dev/null
```

Then copy and adapt it for colossus-reference (update any site-specific paths/config if needed).

---

## FIX 6 — A11Y-007: Add aria-controls to LocationsDropdown

**packages/core-components/src/components/ui/locations-dropdown.tsx**

The dropdown trigger button has `aria-expanded` and `aria-haspopup` but no `aria-controls`. The dropdown panel has no `id`.

1. Add `id="locations-dropdown-menu"` to the dropdown panel element (the `<div>` or `<ul>` that appears when open).
2. Add `aria-controls="locations-dropdown-menu"` to the trigger button alongside the existing `aria-expanded`.

---

## FIX 7 — A11Y-009: Add aria-hidden to certificate-lightbox button SVGs

**packages/core-components/src/components/ui/certificate-lightbox.tsx**

Each control button (zoom in, zoom out, reset, close, previous, next) already has `aria-label`. The SVG inside each button is purely decorative. Add `aria-hidden="true"` to each `<svg>` element inside these buttons (lines ~237, 253, 264, 282, 334, 358).

---

## FIX 8 — A11Y-008: Fix footer heading level skip h3→h4

**packages/core-components/src/components/ui/footer.tsx**

Currently: company name is `<h3>`, column headings ("Our Services", "Service Areas", "Contact Info") are `<h4>`. Change the column headings from `<h4>` to `<h3>` and the company name from `<h3>` to `<h2>`. This gives a clean h2→h3 hierarchy within the footer landmark.

---

## FIX 9 — SEO-003: Shorten reviews page title

**sites/colossus-reference/app/reviews/page.tsx** line 11:

Current: `"Customer Reviews | What Our Clients Say"` — with the layout template `%s | Colossus Scaffolding` this renders as 62 chars (2 over limit).

Change to: `"Customer Reviews"` — renders as `"Customer Reviews | Colossus Scaffolding"` = 39 chars. ✓

---

## FIX 10 — SEO-015: Pass location keywords as array not joined string

**sites/colossus-reference/app/locations/[slug]/page.tsx** lines 181-183:

Current:

```ts
keywords: Array.isArray(locationData.keywords)
  ? locationData.keywords.join(", ")
  : locationData.keywords,
```

Replace with:

```ts
keywords: locationData.keywords,
```

The Next.js Metadata API accepts `keywords` as `string | string[]` — pass the array directly.

---

## FIX 11 — SEO-005: Fix LocationFAQ heading redundancy

**packages/core-components/src/components/ui/location-faq.tsx** line 29:

Current renders: `{location} FAQ - {title}` — for Brighton with title="Frequently Asked Questions" this produces "Brighton FAQ - Frequently Asked Questions".

Change the heading to render just `{title}` (drop the `{location} FAQ -` prefix). The calling page already provides a meaningful title, and the location context is clear from the page itself.

Check the call site first: `grep -rn "LocationFAQ" sites/colossus-reference/app/locations/` — confirm title prop value before changing.

---

## VERIFICATION

After all fixes, run from the project root:

```bash
pnpm type-check && pnpm lint && pnpm build
```

---

## UPDATE REMEDIATION AUDIT

After all fixes and verification, update `output/sessions/2026-02-07_code-review/remediation-audit.md`:

For each fix that was applied successfully:

1. Move the finding row from the **Still Open** table to the **Fixed** table
2. Update the Evidence column with the file path and brief description of the change made
3. Update the **Summary** section counts at the bottom of the file

Then report:

- Which fixes were applied successfully
- Which (if any) were skipped with reason
- Output of final type-check/lint/build (PASS or FAIL with errors)
- Confirmation that remediation-audit.md has been updated
