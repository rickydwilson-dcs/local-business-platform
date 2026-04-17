# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-08_architecture-dedup/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-03-08_architecture-dedup/
```

---

## Brief: Architecture Deduplication

### Problem Statement

The Local Business Platform monorepo has accumulated significant code duplication across its three sites (`base-template`, `dj-fox-electrical`, `colossus-scaffolding`). Twelve findings from a code review audit (ARCH-001 through ARCH-011, plus CQ-010, CQ-011, CQ-012) identify files that are copied across sites with minimal or no variation. This violates the platform's white-label architecture principle: shared logic belongs in packages, site-specific configuration stays in sites.

The duplication creates real maintenance burden. When a bug is fixed in `content.ts` in one site, it must be manually replicated to the other two. When the contact form validation logic changes, three files need updating. The platform currently has 3 sites; adding a 4th would mean copying ~2,500 lines of duplicated code.

### Goals

1. **Extract all duplicated utility code** into `packages/core-components` (or a new `packages/site-utils` if warranted), so each site imports from the shared package instead of maintaining its own copy.
2. **Handle divergences gracefully.** Colossus has legitimately different behaviour in some files (custom service sorting in `content.ts`, extra form fields in `ContactForm.tsx`, different email provider in contact route, hardcoded business name in email templates). The shared abstractions must accommodate these variants without site-specific if/else branches.
3. **Eliminate the colossus dual-config problem.** Colossus has both `site.config.ts` AND `lib/business-config.ts` with overlapping data. All sites should use a single config source.
4. **Fix the coverage-map hex color issue.** The `CoverageMap` component hardcodes county-to-color mappings. These should be passed as props or derived from theme tokens.

### Non-Goals

- Refactoring page-level components (`app/about/page.tsx`, etc.) -- those are site-specific by design.
- Changing the MDX content architecture.
- Adding new features or changing user-facing behaviour.
- Moving files that are legitimately site-specific (e.g., `theme.config.ts`, `site.config.ts`).

### Acceptance Criteria

1. Each site's `lib/content.ts` is deleted and replaced by `import { ... } from '@platform/core-components'` (or a subpath).
2. Each site's `lib/mdx.tsx` is deleted and replaced by shared import. The `loadMdx` function must accept an MDX components map parameter (since `mdx-components.tsx` may eventually differ per site).
3. Each site's `mdx-components.tsx` is deleted and replaced by shared import from core-components. The `InfoBox` component inside uses semantic colour classes (blue-50, green-50, etc.) which are acceptable for callout styling -- do NOT convert these to theme tokens.
4. Each site's `lib/schema.ts` is deleted and replaced by shared import. The schema generators take `businessConfig` and `absUrl` as parameters rather than importing them directly.
5. Each site's `lib/contact-info.ts` and `lib/site.ts` are deleted and replaced by shared imports. The shared versions take `siteConfig` as a parameter.
6. `ContactForm` exists once in `core-components` with a props-based API that accommodates colossus's extra fields (`projectType`, `urgency`, hardcoded service/location lists).
7. Contact API route uses a shared factory function: `createContactRoute(config)` that returns a `POST` handler. Config includes business name, email address, theme colors, and email provider choice (fetch-based vs Resend SDK).
8. CSRF token route uses a shared one-liner re-export pattern or route factory.
9. Analytics track route exists once (it's already identical across sites).
10. `CoverageMap` accepts a `countyColors` prop instead of hardcoding hex values.
11. Colossus's `lib/business-config.ts` is removed; its data is consolidated into `site.config.ts`.
12. All sites build successfully (`pnpm build`).
13. All existing tests pass.

### Constraints

- **core-components has no build step.** Sites import raw TypeScript source via path mapping. Any new exports must work with this model.
- **core-components is already in the Turborepo dependency graph.** No new packages should be needed unless there's a strong reason (e.g., a lib that needs `gray-matter` as a dependency but core-components shouldn't depend on it).
- **`content.ts` uses `process.cwd()` to find MDX files.** This is correct for Next.js server-side rendering -- `process.cwd()` resolves to the site's root directory at build time. Moving the code to a package does NOT break this.
- **`lib/mdx.tsx` imports `mdx-components` via `@/mdx-components`.** When shared, the components map must be injected as a parameter instead.
- **`schema.ts` imports `businessConfig` and `absUrl` from site-local files.** When shared, these must be passed as parameters or configured via a factory.
- **The contact route divergence is significant.** Base-template/DJ-Fox use raw `fetch()` to Resend API. Colossus uses the Resend SDK (`new Resend(key)`). Colossus also uses `Response.json()` while base-template uses `NextResponse.json()`. Colossus returns `{ ok: true }` while base-template returns `{ success: true }`. Colossus has hardcoded "Colossus Scaffolding" strings in email templates. The shared abstraction must normalize these differences.
- **ContactForm divergence.** Base-template/DJ-Fox accept `services` and `serviceAreas` as props. Colossus hardcodes its service/location lists and has extra fields (`projectType`, `urgency`). The shared component needs a flexible props contract.
- **Git workflow:** All work happens on `develop` branch. Never push directly to `staging` or `main`.

### Relevant Architecture

```
local-business-platform/
  packages/
    core-components/        # Shared code -- NO build step, raw TS source
      src/
        components/ui/      # Shared UI components
        lib/
          content.ts        # EXISTS but UNUSED -- identical to colossus copy
          content-schemas.ts # Zod schemas (already shared and used)
        index.ts            # Barrel exports
    theme-system/           # CSS variable generation
    themes/orion/           # Dark header theme (DJ Fox)
    themes/vega/            # Light header theme (base-template, colossus)
  sites/
    base-template/          # Gold-standard template
    dj-fox-electrical/      # Live client site
    colossus-scaffolding/   # Live client site
```

### Codebase Snapshot (key divergences found during research)

#### content.ts (3 copies + 1 unused in core-components)

- **base-template** (580 lines): Imports `getLocationSlugs` from `@/lib/locations-config`. Imports types from `@platform/core-components`. Has `getServices`, `getLocations` convenience wrappers. Has `getProjectsByType` function.
- **dj-fox-electrical** (571 lines): Nearly identical to base-template but does NOT import `getLocationSlugs` (no location-specific service filtering). Image field uses `heroImage: imageUrl` in addition to `image: imageUrl`.
- **colossus-scaffolding** (384 lines): Imports from local `./content-schemas` instead of `@platform/core-components`. Has custom service sorting (main categories first). Has `getLocationSlugs` import. Missing `getProjectsByType`, `getTestimonialsByService`, `getTestimonialsByLocation`.
- **core-components** (362 lines): Identical to colossus copy. Imports from local `./content-schemas`. Unused by any site.

**Key differences to reconcile:**

1. Import source for types (`@platform/core-components` vs `./content-schemas`)
2. Location slug filtering (present in base-template + colossus, absent in dj-fox)
3. Custom service sorting (colossus only -- hardcoded category names)
4. `getProjectsByType` (base-template + dj-fox only)
5. `heroImage` field handling (slightly different across copies)

#### mdx-components.tsx (base-template = dj-fox, 277 lines each)

- Identical files. Both use `default export` (violates named-export convention but required by Next.js MDX).
- Contains `InfoBox`, `QuoteBlock`, `ImageWithCaption` custom components.
- `InfoBox` uses semantic Tailwind colours (blue-50, green-50, amber-50, emerald-50) -- these are intentional for callout styling, not theme-token violations.
- Colossus does NOT have this file (may use a different MDX setup or inherit it differently).

#### lib/mdx.tsx (base-template = dj-fox, 180 lines each)

- Identical files. Contains `loadMdx()` which uses `next-mdx-remote/rsc` with remark/rehype plugins.
- Imports `mdxComponents` from `@/mdx-components` (site-root path alias).
- Also has sync helpers (`getMdxFiles`, `getMdxContent`) and `getPageImage`.

#### lib/schema.ts (base-template = dj-fox, 419 lines each)

- Identical files. Imports `absUrl` from `./site` and `businessConfig` from `./business-config`.
- Generates LocalBusiness, WebSite, BreadcrumbList, FAQPage, ServiceArea, Article, AggregateRating schemas.

#### lib/contact-info.ts (base-template = dj-fox, 137 lines each)

- Identical files. Imports `siteConfig` from `@/site.config`.
- Phone formatters, address formatters, business hours helpers.

#### lib/site.ts (base-template = dj-fox, 45 lines each)

- Identical files. Contains `absUrl()`, `formatPhone()`, `telLink()`, `mailtoLink()`, `slugify()`.

#### ContactForm (3 different implementations)

- **base-template** (346 lines): Accepts `services: ServiceOption[]` and `serviceAreas: string[]` props. Uses `lucide-react` icons. 7 form fields.
- **dj-fox** (329 lines): Similar to base-template, likely minor styling differences.
- **colossus** (383 lines): Hardcodes service and location lists. Has extra `projectType` and `urgency` fields (9 fields total). Does NOT accept props for services/locations.

#### Contact API route

- **base-template** (347 lines): Uses `NextRequest`/`NextResponse`. Uses raw `fetch()` to Resend API. Returns `{ success: true }`. Imports `BUSINESS_EMAIL`/`BUSINESS_NAME` from `@/lib/contact-info`.
- **dj-fox**: Likely identical to base-template.
- **colossus** (286 lines): Uses `Request`/`Response`. Uses Resend SDK (`new Resend(key)`). Returns `{ ok: true }`. Uses `process.env.BUSINESS_EMAIL`/`BUSINESS_NAME`. Has hardcoded "Colossus Scaffolding" in email templates. Different validation approach (collects all errors vs returns on first error).

#### CSRF token route (3 copies, functionally identical)

- All three are 39-63 lines. Same logic: `generateCsrfToken(3600)` with identical response shape. Only difference is quote style and colossus has extra JSDoc comments.

#### Analytics track route (base-template = colossus, 304 lines each)

- Identical files. DJ Fox likely has the same.

#### CoverageMap (core-components)

- Hardcodes county-to-color map: East Sussex=#2563eb, West Sussex=#059669, Kent=#dc2626, Surrey=#7c3aed, default=#4DB2E4.
- Has `eslint-disable` comments acknowledging the hardcoded hex colours.
- Should accept `countyColors` as a prop.

#### Colossus dual-config

- `site.config.ts`: Contains business info, nav, CTA, footer config, feature flags -- the standard site config.
- `lib/business-config.ts`: Contains Schema.org-specific business data (BusinessConfig type). Exports `colossusBusinessConfig` and `businessType`.
- `lib/schema.ts` imports from `./business-config`, creating a dependency on the site-local file.
- Base-template and dj-fox also have `lib/business-config.ts` -- so it's not a colossus-only thing. The problem is that colossus has overlapping data between the two configs (name, email, phone, address appear in both).

---

## What a Good Plan Should Cover

1. **Dependency analysis**: Which files can be moved independently vs which have circular dependencies on each other? (e.g., `schema.ts` depends on `site.ts` and `business-config.ts`; `mdx.tsx` depends on `mdx-components.tsx`)
2. **Migration order**: What should be extracted first to minimize risk? Consider: files with zero divergence are safest; files with colossus divergence need design decisions.
3. **API design for configurable modules**: How should `schema.ts` receive `businessConfig` and `absUrl`? Factory pattern? Parameter injection? Module-level configuration?
4. **ContactForm unification strategy**: How to handle colossus's extra fields without making the base component overly complex?
5. **Contact route factory design**: What does the config object look like? How to handle the Resend SDK vs fetch() difference?
6. **Package boundary decisions**: Does everything go in `core-components`, or should a new `packages/site-utils` be created for non-component utilities?
7. **Testing strategy**: How to verify nothing breaks during migration? What's the minimum test surface?
8. **Backwards compatibility**: Can sites be migrated one at a time, or must all switch simultaneously?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps
- Any risks or trade-offs worth calling out
