You are implementing an approved plan. Do not deviate from it. Do not auto-commit.

Read the full plan at:
output/sessions/codex-peer-review/2026-02-19_location-frontmatter-schema/synthesis.md

Then execute every step in order:

**Step 0 — Baseline:** Run validate:content for all 3 sites and pnpm type-check. All must pass before proceeding.

**Step 1 — Edit packages/core-components/src/lib/content-schemas.ts:**

- 1a: Replace county enum with z.string().min(2).optional() and add countySlug field with regex /^[a-z0-9-]+$/
- 1b: Replace services.items[].link startsWith('/services/') with regex /^\/[A-Za-z0-9\/_-]+$/
- 1c: Add primaryActionLabel, primaryActionHref, highlightItems fields to hero object alongside existing phone/trustBadges
- Run pnpm type-check then validate:content for all 3 sites before continuing.

**Step 2 — JSDoc:** Add comment block separators above the geographic fields section and hero object in that same file.

**Step 3 — CHANGELOGs:** Update sites/colossus-reference/CHANGELOG.md and packages/core-components/CHANGELOG.md (create if missing) with the changes made.

**Step 4 — Full verification:** pnpm type-check && pnpm lint && pnpm build, then validate:content for all 3 sites.

**Rules:**

- Never auto-commit
- Never modify any MDX content files
- Never modify any page components
- If any verification step fails, stop and report the error — do not attempt to fix by modifying MDX or component files
