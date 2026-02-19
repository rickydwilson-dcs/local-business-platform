# Claude's Plan: LocationFrontmatter Schema — White-Label Generalisation

**Date:** 2026-02-19
**Author:** Claude (independent, pre-synthesis)

---

## Summary Recommendation

Make three targeted changes to `LocationFrontmatterSchema` in core-components:

1. Replace the `county` hardcoded enum with a plain `z.string().optional()`
2. Rename `hero.phone` → `hero.ctaPhone` and `hero.trustBadges` → `hero.badges` — or more practically, just leave them as-is and add a comment that they are optional/industry-agnostic; the real fix is just ensuring everything remains `.optional()`
3. Relax the `/services/` path prefix constraint to `/`

Then update the colossus-reference page component to cast the `county` field using a local validation helper rather than the schema type. No MDX file edits required.

On reflection, I arrive at a more nuanced position below.

---

## Analysis

### Issue 1: `county` enum

The enum is the most urgent problem because it is the only constraint that would *cause a validation failure* for an out-of-area site that wants to use the county field. Since the field is `optional()`, any site that omits it passes fine. The constraint only bites if a new site tries to populate `county` with a value outside the four-county list.

**Decision:** Replace with `z.string().optional()`. This is the minimal, lowest-risk change. It's strictly more permissive — all existing values pass. The colossus-reference county navigation logic (which currently uses a string comparison against `COUNTY_PAGE_SLUGS`) is unaffected since it uses the MDX value directly, not the schema type.

### Issue 2: `hero.phone` and `hero.trustBadges`

These field names don't cause any validation failures for non-scaffolding sites because: (a) the hero object itself is `optional()`, and (b) all hero fields are `optional()` within it. A law firm site that doesn't include `phone` in its hero simply omits it and passes.

The real question is whether the *names* are confusing to a new site developer. On balance: renaming these fields would require:
- Updating the schema
- Updating all 37 colossus location MDX files (replacing `phone:` → `ctaPhone:` etc.)
- Updating the colossus page component to read the new field name
- Updating the TypeScript type

That's a meaningful blast radius for a cosmetic concern. The better fix is documentation: add a JSDoc comment to the schema making clear these fields are optional and named from the colossus reference implementation. New sites can ignore them entirely.

**Decision:** Leave `phone` and `trustBadges` field names as-is. Add JSDoc clarifying they are optional/industry-specific extensions. A site that doesn't need them simply doesn't include them in its MDX.

### Issue 3: `/services/` path prefix

The `startsWith("/services/")` constraint on `services.items[].link` is a real structural assumption. However, it only fires if a site populates the `services.items` array at all. The `services` object and `services.items` are both optional. A site with a different URL structure can simply omit `services` from its location frontmatter.

**Decision:** Relax to `z.string().startsWith("/", "Link must be an absolute path")`. This removes the `/services/` assumption while keeping the useful "must be an absolute path" validation. Existing colossus MDX files all use `/services/...` links — they pass the new constraint trivially.

### Issue 4: Monolithic schema vs. composition

The current single-schema approach is pragmatically correct for this stage of the platform. Introducing per-site schema extensions would require:
- A schema registry or factory pattern
- Changes to `validate-content.ts` to load site-specific schemas
- More complex CI configuration

The platform has 3 sites. The schema is already highly permissive (nearly all fields are optional). Composition is premature. The right approach is to continue with one canonical schema, keep all fields optional, and use clear naming/documentation to signal which fields are site-specific extensions.

**Decision:** Keep single monolithic schema. Add a `// Site-specific extensions (optional)` comment block grouping the colossus-specific-feeling fields.

---

## Implementation Plan

### Phase 1: Schema changes in core-components

**Files modified:** `packages/core-components/src/lib/content-schemas.ts`

**Step 1.1 — Relax `county` enum to plain string**

```typescript
// Before
county: z.enum(["East Sussex", "West Sussex", "Kent", "Surrey"]).optional(),

// After
/** Geographic county or region for location grouping and navigation. Free-form string — not constrained to any specific region. */
county: z.string().min(2, "County/region name must be at least 2 characters").optional(),
```

**Step 1.2 — Relax `services.items[].link` path constraint**

```typescript
// Before
link: z.string().startsWith("/services/", "Service link must start with /services/"),

// After
link: z.string().startsWith("/", "Link must be an absolute path starting with /"),
```

**Step 1.3 — Add clarifying JSDoc to hero fields**

```typescript
hero: z
  .object({
    title: z.string().min(5).optional(),
    description: z.string().min(20).optional(),
    image: ImagePathSchema.optional(),
    /** Primary contact phone number shown in hero. Optional — omit for industries where phone is not a primary hero CTA. */
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/).optional(),
    /** Trust/credential badges. Optional — naming is generic; use for any short credential labels. */
    trustBadges: z.array(z.string().min(3)).min(1).optional(),
    ctaText: z.string().min(5).optional(),
    ctaUrl: z.string().startsWith("/").optional(),
  })
  .optional(),
```

**Verification gate 1:** Run `pnpm type-check` from repo root. Exported `LocationFrontmatter` type changes: `county` goes from `"East Sussex" | "West Sussex" | "Kent" | "Surrey" | undefined` to `string | undefined`. Check that all page components that use `locationData.county` compile cleanly — they do, since they only use it as a string for comparison.

**Verification gate 2:** Run validate-content in all three sites:
```bash
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
cd sites/base-template && npx tsx scripts/validate-content.ts locations
cd sites/dj-fox-electrical && npm run validate:content
```
All should pass (new constraints are strictly more permissive than old ones).

---

### Phase 2: Update colossus page component type assertion

The colossus location slug page currently has a local TypeScript interface that includes `county?: "East Sussex" | "West Sussex" | "Kent" | "Surrey"` — or accesses it without an explicit type (relying on the inferred schema type). After the schema change, the type of `county` becomes `string | undefined`. The county navigation logic compares it against `COUNTY_PAGE_SLUGS` array values — this is unaffected by the type widening. No component logic changes are needed.

**Check:** Run `pnpm type-check` to confirm no TS errors from the type widening.

---

### Phase 3: Annotate the `county` enum removal in CHANGELOGs

Add a brief note to `sites/colossus-reference/CHANGELOG.md` and `packages/core-components/CHANGELOG.md` (or equivalent) documenting that the `county` field is now a free-form string, and that the old enum constraint has been removed.

**Files modified:**
- `sites/colossus-reference/CHANGELOG.md`
- `packages/core-components/CHANGELOG.md` (if it exists)

---

### Phase 4: Full verification

```bash
pnpm type-check      # TypeScript strict mode — must pass
pnpm lint            # ESLint — must pass
pnpm build           # Full build — must pass
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
cd sites/base-template && npx tsx scripts/validate-content.ts locations
cd sites/dj-fox-electrical && npm run validate:content
```

---

## Risks and Trade-offs

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `county` string widening breaks colossus county navigation TypeScript | Low | County nav compares strings against `COUNTY_PAGE_SLUGS` array — type widening from enum to string doesn't break this |
| A new site developer puts an invalid county string and it passes schema but breaks nav | Medium | Document the COUNTY_PAGE_SLUGS constraint in the colossus `locations.ts` file comments; schema validation is a floor, not a ceiling |
| Relaxing `/services/` to `/` allows completely wrong paths | Low | The constraint is non-enforced at runtime; content editors are guided by documentation; the schema remains useful as a format check |
| `trustBadges` and `phone` confuse a future developer | Low | JSDoc comments address this; the fields are clearly optional |

## What I Did NOT Recommend

- **Per-site schema overrides/composition:** Premature at 3 sites. Revisit when a site genuinely needs a field with a different type, not just a different value.
- **Renaming `phone` → `ctaPhone` or `trustBadges` → `badges`:** Cosmetic change with 40+ file blast radius. Not worth it until a site actually needs the old name for something different.
- **Adding a `heading`/`subheading` variant to hero:** The review found base-template was using these field names historically, but the current base-template MDX uses `title`/`description` (same as colossus). No migration needed.
- **Moving the county enum to a site-level config:** Overengineered. The schema should validate format, not enumerate valid values for a specific business.
