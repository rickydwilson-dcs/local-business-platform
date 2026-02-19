# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-19_location-frontmatter-schema/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: LocationFrontmatter Schema — White-Label Generalisation

**Date:** 2026-02-19
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The platform is a white-label website system: a single shared component library (`packages/core-components`) serves multiple client sites (`sites/`). Each site has its own MDX content, theme config, and business data. Content is MDX-only — there are no centralised TypeScript data files; all business-specific content lives in MDX frontmatter, validated by Zod schemas.

The `LocationFrontmatterSchema` in `packages/core-components/src/lib/content-schemas.ts` is the single canonical schema all sites use to validate their `content/locations/*.mdx` files. It currently passes validation for all three sites. However, it contains structural issues that will become blockers as the platform onboards new client sites:

**Issue 1 — The `county` field has a hardcoded geographic enum.** The schema declares `county: z.enum(["East Sussex", "West Sussex", "Kent", "Surrey"]).optional()`. This is the exact four-county service area of the colossus-reference scaffolding business in South East England. Any client site in a different region — even within the UK — cannot use the `county` field, since any other county name fails validation. The field is optional, so non-SE-England sites currently omit it and pass. But county grouping/navigation is a useful general UX pattern that other sites should be able to adopt.

**Issue 2 — Hero field names embed industry assumptions.** The schema's `hero` object includes `phone`, `trustBadges`, `ctaText`, `ctaUrl`. These originate from the colossus scaffolding reference site. A different business type may not have a `phone` number as a primary hero CTA, or "trust badges" in the scaffolding sense. All fields are optional, so non-scaffolding sites pass validation by simply omitting them. But the field names embed industry-specific assumptions in the shared schema.

**Issue 3 — The `services` items have a hardcoded path constraint.** `services.items[].link` requires `startsWith("/services/")`. This embeds an assumption that service pages always live under `/services/`. A site with a different URL structure (e.g. `/what-we-do/`) would fail validation if it tried to populate this section.

All three issues are currently dormant — all sites pass validation. They become blockers when a new client site is added in a different region, industry, or URL structure.

### Constraints

- **MDX-only content architecture is non-negotiable.** All content lives in MDX frontmatter. The schema must validate frontmatter — it must not introduce centralised TypeScript data.
- **The canonical schema lives in `packages/core-components/src/lib/content-schemas.ts`.** All three sites import `LocationFrontmatterSchema` from `@platform/core-components`. There are no site-level copies. Any change immediately affects all sites.
- **All current location MDX files must continue to pass validation after the change.** Colossus has 37 files, dj-fox has 23, base-template has 3. None must regress.
- **No changes to page component logic required.** The schema change must not force component rewrites — only schema and potentially frontmatter edits.
- **Zod v3.** The solution must use Zod v3 idioms.
- **TypeScript strict mode.** The exported `LocationFrontmatter` type (inferred from the schema via `z.infer<>`) is used in page components. Schema changes that alter the type shape must not break TypeScript compilation in any site.
- **No runtime validation.** Schema validation runs only in `scripts/validate-content.ts` at content-authoring time, not in the Next.js app at build or request time.

### Relevant Architecture

- **Monorepo:** Turborepo + pnpm workspaces. `packages/core-components` is a dependency of all sites.
- **Content pipeline:** MDX files → `gray-matter` parses frontmatter → `validate-content.ts` script validates against Zod schema → `generateStaticParams()` in Next.js page reads the same frontmatter at build time (no Zod, just TypeScript typing).
- **Schema export path:** `packages/core-components/src/lib/content-schemas.ts` → exported via `packages/core-components/src/index.ts` → consumed as `import { LocationFrontmatterSchema } from "@platform/core-components"`.
- **Type export:** `export type LocationFrontmatter = z.infer<typeof LocationFrontmatterSchema>` is exported from the same file and used in page components.
- **Validation scripts:** All sites have `scripts/validate-content.ts` that imports `LocationFrontmatterSchema` from `@platform/core-components`. The root-level `scripts/validate-content.ts` is used by dj-fox via `tsx ../../scripts/validate-content.ts all`.
- **Page component typing:** Each site's location slug page reads frontmatter with `gray-matter`, types against a local interface or `LocationFrontmatter`, and accesses fields like `locationData.hero?.title`, `locationData.hero?.phone`, `locationData.county`.

### Codebase Snapshot

```
packages/core-components/src/lib/content-schemas.ts
  LocationFrontmatterSchema (lines 130–230):
    title: string (required, 2–50 chars)
    seoTitle: string (required, 10–80 chars)
    description: string (required, 50–200 chars)
    keywords: string[] (optional, min 3 items)
    county: z.enum(["East Sussex","West Sussex","Kent","Surrey"]).optional()
    coords: [lat, lng] tuple (optional)
    heroImage: ImagePathSchema (optional)
    hero: object (optional):
      title: string (optional)
      description: string (optional)
      image: ImagePathSchema (optional)
      phone: string regex (optional)
      trustBadges: string[] (optional)
      ctaText: string (optional)
      ctaUrl: string startsWith("/") (optional)
    specialists: object (optional) — title, description, cards[]
    services: object (optional):
      title: string (optional)
      description: string (optional)
      items: array (optional):
        title: string
        description: string
        link: string.startsWith("/services/")   ← hardcoded prefix
        icon: string (optional)
    faqs: FaqSchema[] (optional, 5–20 items)

sites/colossus-reference/content/locations/  — 37 MDX files
  All use: hero.title, hero.description, hero.phone, hero.trustBadges, hero.ctaText, hero.ctaUrl
  All use: county with East Sussex / West Sussex / Kent / Surrey values
  All currently PASS validation

sites/dj-fox-electrical/content/locations/  — 23 MDX files
  Use: hero.title, hero.description, hero.image
  Use: county: "East Sussex" (dj-fox operates in East Sussex)
  No phone, no trustBadges
  All currently PASS validation

sites/base-template/content/locations/  — 3 MDX files (main-area, north-region, south-region)
  Use: hero.title, hero.description, hero.image, hero.ctaText, hero.ctaUrl
  No county field
  All currently PASS validation

sites/colossus-reference/app/locations/[slug]/page.tsx
  Reads: locationData.hero?.title, hero?.description, hero?.phone, hero?.trustBadges,
         hero?.ctaText, hero?.ctaUrl, locationData.county

sites/dj-fox-electrical/app/locations/[slug]/page.tsx
  Reads: hero?.title, hero?.description (no phone/trustBadges access)
```

### What a Good Plan Should Cover

1. **How to generalise the `county` enum** without breaking colossus's existing county-grouping navigation. Options: remove the enum constraint (plain string), introduce a configurable per-site approach, or allow schema extension. Trade-offs between permissiveness and catching mistakes.

2. **Whether `phone` and `trustBadges` should change** — rename, remove, or leave as-is with documentation. If renamed, what is the migration path for 37 existing colossus MDX files and the page components that read them?

3. **How to handle the `/services/` path constraint** — relax to any absolute path, remove entirely, or something else.

4. **Whether a single monolithic schema is still the right approach** as the platform scales to more client site types, or whether schema composition/extension is warranted — and how that would integrate with the existing import pattern.

5. **Migration path and verification.** Which files change, in what order, and how to confirm no regressions at each step.

6. **TypeScript type compatibility risk.** If field names or types change, the inferred `LocationFrontmatter` type changes. Any page component reading a renamed field will get a TypeScript error. The plan must address this explicitly.

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-19_location-frontmatter-schema/`.
