You are fixing the 5 remaining open findings from the 2026-02-07 code review.
Full audit status is in: output/sessions/2026-02-07_code-review/remediation-audit.md

Read that file first for context. Then apply every fix below in order. Do not auto-commit. Do not modify files outside this list.

After ALL fixes are applied, run: pnpm type-check && pnpm lint && pnpm build
Then report which fixes succeeded and which (if any) failed.

---

## FIX 1 — CQ-012: Remove inline style={{}} from HeroV3 and CoverageMap

### HeroV3 — background image

**File:** `packages/core-components/src/components/hero/HeroV3.tsx`

**Problem:** Line 44–46 uses `style={{ backgroundImage: \`url(...)\` }}`and line 52 uses`style={{ opacity: overlayOpacity }}`.

For the background image, switch to a CSS custom property via inline style on the wrapper so the value is still dynamic but the pattern is minimal:

```tsx
// Line 44 — replace the style prop with a CSS variable
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: `url(${backgroundImage || "https://images.unsplash.com/photo-1497366216548-37526070297c"})`,
  }}
  aria-hidden="true"
/>
```

This one is a dynamic URL — inline style is the correct approach here because Tailwind cannot handle runtime values. Add an eslint-disable comment to acknowledge this:

```tsx
<div
  className="absolute inset-0 bg-cover bg-center"
  /* eslint-disable-next-line react/forbid-dom-props -- dynamic background-image requires inline style */
  style={{
    backgroundImage: `url(${backgroundImage || "https://images.unsplash.com/photo-1497366216548-37526070297c"})`,
  }}
  aria-hidden="true"
/>
```

For the overlay opacity on line 52, same treatment — it's a runtime value from a prop, inline style is correct. Add the same eslint-disable comment:

```tsx
{
  /* Overlay */
}
<div
  className="absolute inset-0 bg-black"
  /* eslint-disable-next-line react/forbid-dom-props -- dynamic opacity requires inline style */
  style={{ opacity: overlayOpacity }}
/>;
```

### CoverageMap — map legend dot

**File:** `packages/core-components/src/components/ui/coverage-map.tsx`

**Problem:** Lines 208–215 use `style={{ backgroundColor: {...}[location.county] || "#4DB2E4" }}` for the county colour dot. This is a runtime-computed hex — same situation. The file already has an `eslint-disable no-restricted-syntax` comment wrapping it. Verify the comment is still present after any edits. If the lint rule is `react/forbid-dom-props` rather than `no-restricted-syntax`, update the comment to match. No logic change needed — just confirm the disable comment is correct for the actual lint rule that fires.

Check which lint rule fires:

```bash
cd /path/to/project && npx eslint packages/core-components/src/components/ui/coverage-map.tsx --rule '{"react/forbid-dom-props": "error"}' 2>&1 | head -20
```

If `react/forbid-dom-props` is the rule, replace the existing `eslint-disable no-restricted-syntax` wrapper with `eslint-disable-next-line react/forbid-dom-props`.

---

## FIX 2 — CQ-013: Deduplicate validate-quality.ts

**Files:**

- `sites/colossus-reference/scripts/validate-quality.ts`
- `sites/base-template/scripts/validate-quality.ts`

The two files are identical except for:

1. Quote style (colossus uses `"`, base-template uses `'`)
2. One example path in the header comment (`access-scaffolding.mdx` vs `my-service.mdx`)
3. colossus has `import { fileURLToPath } from "url"` which is unused (base-template doesn't have it)

**Fix:** Make colossus-reference match base-template exactly (base-template is the canonical source):

1. Remove the unused `import { fileURLToPath } from "url"` line from `sites/colossus-reference/scripts/validate-quality.ts`
2. Change all double-quoted strings to single quotes in that file to match base-template
3. Update the example path in the header comment from `content/services/access-scaffolding.mdx` to `content/services/my-service.mdx`

After the change, `diff sites/colossus-reference/scripts/validate-quality.ts sites/base-template/scripts/validate-quality.ts` should produce no output (or only whitespace differences acceptable to the linter).

Do not move the script to a shared location — the two sites may diverge in future and the script is site-local by design. The goal is consistency, not DRY extraction.

---

## FIX 3 — ARCH-010: Add note to locations.ts about countySlug migration path

**File:** `sites/colossus-reference/lib/locations.ts`

**Problem:** `COUNTY_PAGE_SLUGS = ["east-sussex", "west-sussex", "kent", "surrey"]` is hardcoded (line 36). The Hove→Brighton redirect is also hardcoded (line 101).

**Important context:** The `countySlug` field was added to `LocationFrontmatterSchema` as part of ARCH-006. That field now exists in the schema but colossus location MDX files have not been back-filled yet. The hardcoded array cannot be removed until MDX files have `countySlug` populated — that is a separate content migration task outside this fix.

**Fix for this finding:** Add a TODO comment above the hardcoded array documenting the migration path, so the intent is clear to the next developer:

```ts
// TODO(ARCH-010): COUNTY_PAGE_SLUGS is hardcoded pending content migration.
// Once location MDX files are back-filled with `countySlug` frontmatter field
// (added to LocationFrontmatterSchema in ARCH-006), this array can be replaced
// with a dynamic lookup from getAllLocations() filtering where countySlug is set.
// See: output/sessions/2026-02-07_code-review/remediation-audit.md
const COUNTY_PAGE_SLUGS = ["east-sussex", "west-sussex", "kent", "surrey"];
```

Also add a comment above the Hove redirect block (line 101):

```ts
// Hardcoded redirect: Hove is part of Brighton & Hove unitary authority.
// This can be moved to MDX frontmatter (a `redirectTo` field) once content
// migration is complete.
if (countySlug === "east-sussex") {
```

No logic changes — comments only. This finding is "documented" not "resolved" — mark it in the audit accordingly.

---

## FIX 4 — A11Y-010: Verify Lucide icon aria-hidden in footer

**File:** `packages/core-components/src/components/ui/footer.tsx`

Lucide React icons (Phone, Mail, MapPin, Shield, Award) render as `<svg>` elements. By default in lucide-react v0.x, SVGs do NOT have `aria-hidden` set automatically. They inherit from context. In a footer, these icons are purely decorative (the adjacent text provides the label).

Check: each icon usage in footer.tsx has a text label or `<Link>` text alongside it. Verify by reading the render output and confirm no icon is the sole accessible label for a link or piece of information.

**Fix:** Add `aria-hidden="true"` to each Lucide icon in the footer:

```tsx
<Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" aria-hidden="true" />
<Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" aria-hidden="true" />
<MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0 mt-1" aria-hidden="true" />
<Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" aria-hidden="true" />
<Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" aria-hidden="true" />
```

Read the file first to confirm exact line numbers and that adjacent text is present for each icon before adding `aria-hidden`.

---

## FIX 5 — CQ-017: Add TODO comment to mdx-components.tsx

**File:** `sites/colossus-reference/mdx-components.tsx`

At 955 lines, this file should eventually be split into separate component files. However, this is a medium-effort refactor that carries risk of breaking MDX rendering across all content pages. It should not be done in a single YOLO session.

**Fix for this finding:** Add a TODO comment at the top of the file (after the existing imports/header) documenting the intent:

```tsx
// TODO(CQ-017): This file is 955 lines. Component definitions should be extracted
// to separate files under sites/colossus-reference/components/mdx/ and re-exported
// here. Defer until a dedicated refactor session — splitting incorrectly can break
// MDX rendering across all content pages.
```

No logic changes — comment only. Mark in audit as "documented, deferred".

---

## VERIFICATION

After all fixes, run from the project root:

```bash
pnpm type-check && pnpm lint && pnpm build
```

---

## UPDATE REMEDIATION AUDIT

After all fixes and verification, update `output/sessions/2026-02-07_code-review/remediation-audit.md`:

For each fix applied successfully (note: FIX 3 and FIX 5 are "documented, deferred" — move them to Fixed with that note):

1. Move the finding row from the **Still Open** table to the **Fixed** table
2. Update the Evidence column with the file path and brief description of what was changed
3. Update the Summary counts at the bottom (Fixed count, Still Open count, Open by severity line)

Then report:

- Which fixes were applied successfully
- Which (if any) were skipped with reason
- Output of final type-check/lint/build (PASS or FAIL with errors)
- Confirmation that remediation-audit.md has been updated
