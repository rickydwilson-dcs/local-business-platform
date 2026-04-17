# Implementation Plan: LocationFrontmatter Schema — White-Label Generalisation

**Date:** 2026-02-19
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                   | Claude                                              | Codex                                                                                                   | Synthesised Decision                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema structure         | Single monolithic schema — composition is premature | Introduce `BaseLocationFrontmatterSchema` + `createLocationFrontmatterSchema()` factory                 | **Keep monolithic for now.** Factory is good architecture but introduces API surface that needs documentation and buy-in before any site actually needs it. Defer until a second site needs a genuinely different field type.                                                                                                                                                            |
| `countySlug` field       | Not proposed — relax `county` to string only        | Add new `countySlug: regex /^[a-z0-9-]+$/` alongside human-readable `county`                            | **Add `countySlug`.** Codex is right: the current `county` field is a human-readable label (e.g. "East Sussex"), while grouping/routing logic works on slugs (e.g. "east-sussex"). Separating them removes an implicit assumption that the human label is also URL-safe. Colossus location MDX can populate it optionally; `COUNTY_PAGE_SLUGS` logic in `locations.ts` can reference it. |
| Hero field strategy      | JSDoc on `phone`/`trustBadges` only                 | Add generic aliases `primaryActionLabel`, `primaryActionHref`, `highlightItems` alongside legacy fields | **Add generic aliases.** Future sites get clean field names. Colossus keeps its existing `phone`/`trustBadges` MDX untouched. Both sets coexist as optional fields — no migration required.                                                                                                                                                                                              |
| Services link constraint | `startsWith("/")` — simple, uses Zod built-in       | Regex `/^\/[A-Za-z0-9\/_-]+$/` — blocks external URLs and special chars                                 | **Use Codex's regex.** `startsWith("/")` allows `//external.com` (protocol-relative URL), which is an XSS vector in `href` attributes. The regex is stricter and correct. Keep the error message human-readable: `"Service link must be a relative path (e.g. /services/my-service)"`.                                                                                                   |
| Baseline capture step    | Not explicit                                        | Step 1: run all validate:content + type-check before any changes                                        | **Include Codex's baseline step.** Good discipline — confirms green state before editing.                                                                                                                                                                                                                                                                                                |
| CHANGELOG update         | Explicit step                                       | Mentioned briefly                                                                                       | **Explicit step, as Claude proposed.**                                                                                                                                                                                                                                                                                                                                                   |

## Blind Spots Caught

**Codex caught:**

- `countySlug` separation — the human-readable county label and the URL slug are conflated in the current schema; adding a distinct field makes the intent explicit and gives colossus a migration path to move `COUNTY_PAGE_SLUGS` logic to content-driven slugs rather than hardcoded arrays.
- `startsWith("/")` is not safe — protocol-relative URLs pass it. The regex prevents this.
- Baseline verification before any changes — Claude assumed the green state without making it an explicit step.
- Explicitly deferring future colossus migration (phone → primaryActionLabel) as separate tickets, not coupling it to this change.

**Claude caught:**

- Schema composition/factory is premature for 3 sites — Codex's `createLocationFrontmatterSchema()` adds complexity without a concrete use case today. Correctly deferred.
- The TypeScript type widening risk for `county` — Codex didn't explicitly call out that page components may have local interfaces that pin the county type to the enum values, which would break on type-check even though the schema change is permissive. (Confirmed via audit: colossus page component uses `county` only for string comparison, so no issue — but worth verifying explicitly.)

---

## Implementation Plan

### Step 0: Baseline verification (before any changes)

Run in all three sites to confirm current green state:

```bash
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
cd sites/base-template && npx tsx scripts/validate-content.ts locations
cd sites/dj-fox-electrical && npm run validate:content
pnpm type-check
```

All must pass before proceeding.

---

### Step 1: Update `LocationFrontmatterSchema` in core-components

**File:** `packages/core-components/src/lib/content-schemas.ts`

**1a — Relax `county` enum + add `countySlug`**

```typescript
// Before
county: z.enum(["East Sussex", "West Sussex", "Kent", "Surrey"]).optional(),

// After
/** Human-readable county or region label (e.g. "East Sussex"). Free-form — not constrained to any geographic region. */
county: z.string().min(2, "County/region name must be at least 2 characters").optional(),

/** URL-safe county/region slug for grouping and routing (e.g. "east-sussex"). Must be lowercase with hyphens only. */
countySlug: z.string().regex(/^[a-z0-9-]+$/, "County slug must be lowercase letters, numbers, and hyphens only").optional(),
```

**1b — Relax services link constraint**

```typescript
// Before
link: z.string().startsWith("/services/", "Service link must start with /services/"),

// After
link: z.string().regex(/^\/[A-Za-z0-9\/_-]+$/, "Service link must be a relative path (e.g. /services/my-service)"),
```

**1c — Add generic hero aliases alongside legacy fields**

```typescript
hero: z
  .object({
    title: z.string().min(5, "Hero title must be at least 5 characters").optional(),
    description: z.string().min(20, "Hero description must be at least 20 characters").optional(),
    image: ImagePathSchema.optional(),
    // --- Legacy colossus fields (scaffolding-industry origin) ---
    /** Primary contact phone. Colossus-origin field — omit for industries where phone is not a primary hero CTA. */
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, "Phone must be valid digits/spaces/+/-/()").optional(),
    /** Credential/trust badges. Colossus-origin field — use for any short credential labels. */
    trustBadges: z.array(z.string().min(3, "Badge text too short")).min(1).optional(),
    // --- Generic fields for all site types ---
    /** Generic primary CTA label (e.g. "Get a Free Quote", "Book a Consultation"). */
    primaryActionLabel: z.string().min(3, "Primary action label must be at least 3 characters").optional(),
    /** Generic primary CTA href. Must be a relative path. */
    primaryActionHref: z.string().regex(/^\/[A-Za-z0-9\/_-]*$/, "Primary action href must be a relative path").optional(),
    /** Generic highlight items (replaces trustBadges for non-scaffolding sites). */
    highlightItems: z.array(z.string().min(3, "Highlight item text too short")).min(1).optional(),
    ctaText: z.string().min(5, "CTA text must be at least 5 characters").optional(),
    ctaUrl: z.string().startsWith("/", "CTA URL must start with /").optional(),
  })
  .optional(),
```

**Verification gate 1:** `pnpm type-check` — must pass. Key check: `LocationFrontmatter` type now has `county: string | undefined` (was enum union). Colossus page uses `county` only for string comparison — no breakage. New fields (`countySlug`, `primaryActionLabel`, `primaryActionHref`, `highlightItems`) all optional — no existing code breaks.

**Verification gate 2:** Run validate:content for all three sites — all must still pass (changes are strictly additive/permissive).

---

### Step 2: Add JSDoc comment block grouping to content-schemas.ts

Above the `county` field, add a comment block:

```typescript
// ---------------------------------------------------------------------------
// Geographic fields
// ---------------------------------------------------------------------------
```

Above the `hero` object:

```typescript
// ---------------------------------------------------------------------------
// Hero section — all fields optional. Legacy colossus fields (phone, trustBadges)
// coexist with generic alternatives (primaryActionLabel, highlightItems).
// New sites should use the generic fields; colossus can migrate gradually.
// ---------------------------------------------------------------------------
```

**File:** `packages/core-components/src/lib/content-schemas.ts`

---

### Step 3: Update CHANGELOG

**File:** `sites/colossus-reference/CHANGELOG.md`

Add entry:

```markdown
- LocationFrontmatterSchema: `county` field relaxed from East Sussex/West Sussex/Kent/Surrey enum to free-form string; new optional `countySlug` field added for URL-safe grouping
- LocationFrontmatterSchema: services link constraint relaxed from `/services/` prefix to any relative path
- LocationFrontmatterSchema: generic hero fields added (`primaryActionLabel`, `primaryActionHref`, `highlightItems`); legacy `phone`/`trustBadges` fields retained for backward compatibility
```

Also update `packages/core-components/CHANGELOG.md` (create if not present) with the same entry scoped to the package.

---

### Step 4: Full verification

```bash
pnpm type-check                # TypeScript strict — must pass
pnpm lint                      # ESLint — must pass
pnpm build                     # Full Turborepo build — must pass
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
cd sites/base-template && npx tsx scripts/validate-content.ts locations
cd sites/dj-fox-electrical && npm run validate:content
```

All must pass before committing.

---

## Risks and Trade-offs

| Risk                                                                                               | Likelihood | Mitigation                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `county` type widening breaks colossus TS locally                                                  | Low        | Colossus uses `county` only for string comparisons against `COUNTY_PAGE_SLUGS` — widening from enum to string is a no-op for comparisons. `pnpm type-check` confirms.                                                                                                             |
| A developer populates `countySlug` inconsistently with `county`                                    | Medium     | Both fields are optional and independent. No runtime enforcement of consistency between them. Document that `countySlug` should be the slug-form of `county` (e.g. `"East Sussex"` → `"east-sussex"`). A future linting rule could enforce this if it becomes a problem.          |
| Generic hero fields (`primaryActionLabel`) and legacy fields (`ctaText`) overlap in purpose        | Medium     | Both coexist in the schema. A site will choose one or the other. No conflicting validation. Document the intent: `ctaText`/`ctaUrl` are the original colossus fields; `primaryActionLabel`/`primaryActionHref` are the forward-looking equivalents. Colossus migrates when ready. |
| Regex on services link `/^\/[A-Za-z0-9\/_-]+$/` blocks paths with dots (e.g. `/services/pvc.html`) | Low        | Current colossus paths don't use dots. If needed, extend the regex character class to `[A-Za-z0-9\/_.-]`.                                                                                                                                                                         |
| `createLocationFrontmatterSchema()` factory deferred — a future dev adds it inconsistently         | Low        | Defer is the right call. If the need arises, adding the factory is a non-breaking additive change. Document in a comment in `content-schemas.ts` that extension is deferred intentionally.                                                                                        |

## Deferred (explicitly out of scope for this change)

- **Migration of colossus `phone`/`trustBadges` → `primaryActionLabel`/`highlightItems`:** Requires updating 37 MDX files and the colossus hero component. Separate task once the generic fields are established.
- **`countySlug` back-fill in colossus location MDX:** Colossus can continue using `county` string for navigation; adopting `countySlug` is optional and can be done per-file over time.
- **`createLocationFrontmatterSchema()` factory:** Deferred until a concrete use case emerges (a new site type needing a field with a genuinely different type constraint, not just a different value).
- **Root-level `validate-content.ts` update:** The root script is used by dj-fox. It imports `LocationFrontmatterSchema` from `@platform/core-components` — no changes needed; it picks up the updated schema automatically.
