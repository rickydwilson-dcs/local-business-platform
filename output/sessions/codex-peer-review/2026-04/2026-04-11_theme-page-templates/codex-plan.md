I’ll draft the peer-review implementation plan and write it to `output/sessions/codex-peer-review/2026-04-11_theme-page-templates/codex-plan.md`, then provide the required Claude command.

Implemented plan content for `codex-plan.md`:

````md
# Codex Peer Review Plan — Theme Page Templates

Date: 2026-04-11  
Scope: platform-wide theme-owned page templates for tradesperson + rigel event variants

## 0) Scope alignment and gap checks (pre-work)

1. **Confirm canonical page matrix per site class**
   - Tradesperson themes (`castor`, `cygnus`, `lyra`, `nova`, `orion`, `vega`):  
     `/`, `/services`, `/services/[slug]`, `/locations`, `/locations/[slug]`, `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/reviews`, `/about`, `/contact`
   - Event theme (`rigel`): `/`, `/speakers`, `/schedule`, `/venue`, `/sponsors`, `/blog`, `/blog/[slug]`
2. **Confirm reference sites**
   - Existing underscore references include 5 sites only; **orion/vega have no underscore reference site in brief**.
   - Plan assumes these are still required theme packages with full page exports but migrated site validation focuses on the 5 named underscore sites + base-template.
3. **Freeze constraints**
   - Server Components only in theme `pages/`.
   - `generateMetadata` + `generateStaticParams` remain in site wrappers.
   - Theme pages receive pre-fetched props only; no `@/lib/content` imports in theme packages.
   - Schema stays in wrapper or passed as prop node/string.

**Gate:** architecture sign-off on page matrix + validation scope before coding.

---

## 1) Define shared page-template prop contracts

### Files to add

- `packages/themes/theme-page-types.ts` (new shared types module under `packages/themes/` workspace root, or alternatively duplicated per theme if workspace export constraints block this)
- (If needed) `packages/themes/package.json` export for shared types

### Design

Use a **small set of reusable interfaces** to avoid 7× drift:

- `ThemeHomePageProps`
- `ThemeServicesPageProps`
- `ThemeServiceDetailPageProps`
- `ThemeLocationsPageProps`
- `ThemeLocationDetailPageProps`
- `ThemeBlogPageProps`
- `ThemeBlogPostPageProps`
- `ThemeProjectsPageProps`
- `ThemeProjectDetailPageProps`
- `ThemeReviewsPageProps`
- `ThemeAboutPageProps`
- `ThemeContactPageProps`
- Rigel-specific:
  - `ThemeEventHomePageProps`
  - `ThemeSpeakersPageProps`
  - `ThemeSchedulePageProps`
  - `ThemeVenuePageProps`
  - `ThemeSponsorsPageProps`

Each includes:

- Content data (frontmatter-derived objects, lists)
- `mdxContent: React.ReactNode` for detail pages
- Optional presentational fields from site config/content (hero image, headline, CTA copy)
- Optional `schemaNodes?: React.ReactNode` (wrapper can pass JSON-LD script blocks when desired)

Do **not** include data-fetching callbacks or site-local utilities.

**Gate:** `pnpm type-check` passes after introducing shared types (no runtime changes yet).

---

## 2) Add `pages/` exports to all target theme packages

### Files to modify (each theme: castor/cygnus/lyra/nova/orion/vega/rigel)

- `packages/themes/<theme>/package.json`  
  Add:
  ```json
  "./pages": "./pages/index.ts"
  ```
````

- `packages/themes/<theme>/pages/index.ts` (new)
- `packages/themes/<theme>/pages/*.tsx` (new page template components)

### Naming convention (required)

- Tradesperson:
  - `<Theme>HomePage`, `<Theme>ServicesPage`, `<Theme>ServiceDetailPage`, `<Theme>LocationsPage`, `<Theme>LocationDetailPage`, `<Theme>BlogPage`, `<Theme>BlogPostPage`, `<Theme>ProjectsPage`, `<Theme>ProjectDetailPage`, `<Theme>ReviewsPage`, `<Theme>AboutPage`, `<Theme>ContactPage`
- Rigel:
  - `RigelHomePage`, `RigelSpeakersPage`, `RigelSchedulePage`, `RigelVenuePage`, `RigelSponsorsPage`, `RigelBlogPage`, `RigelBlogPostPage`

Keep existing `./components` export unchanged for backward compatibility.

**Gate:** import resolution check:

- `import { CastorHomePage } from '@platform/themes/castor/pages'` compiles in a test file.
- Existing `@platform/themes/<theme>/components` imports still compile.

---

## 3) Implement theme page templates (composition only)

### Files to add

For each theme package, add `pages/*.tsx` as above.

### Implementation rules

1. Server component only (`no 'use client'`).
2. Compose existing core components and theme components (header/footer already handled by layouts).
3. Accept props only; no content loading.
4. Accept `mdxContent` prop on detail pages and render in designated content section.
5. Keep templates structurally consistent with existing Stitch intent per theme (especially castor homepage acceptance target).

### Trade-off handling

- Avoid over-generalized “one mega template.”  
  Keep one component per route type for explicit control and better visual consistency.
- Avoid schema generation in theme pages; either:
  - wrappers render `<script>` directly, or
  - wrappers pass `schemaNodes` prop and template places it near root.

**Gate:** theme package type-check + story/screenshot spot checks per theme homepage + one detail page.

---

## 4) Migrate `base-template` to thin wrappers (Vega pages)

### Files to modify (all route wrappers)

- `sites/base-template/app/page.tsx`
- `sites/base-template/app/services/page.tsx`
- `sites/base-template/app/services/[slug]/page.tsx`
- `sites/base-template/app/locations/page.tsx`
- `sites/base-template/app/locations/[slug]/page.tsx`
- `sites/base-template/app/blog/page.tsx`
- `sites/base-template/app/blog/[slug]/page.tsx`
- `sites/base-template/app/projects/page.tsx`
- `sites/base-template/app/projects/[slug]/page.tsx`
- `sites/base-template/app/reviews/page.tsx`
- `sites/base-template/app/about/page.tsx`
- `sites/base-template/app/contact/page.tsx`

### Wrapper pattern

- Keep `generateMetadata` and `generateStaticParams` in wrapper files.
- Keep content fetching in wrapper files (`getServices`, `getLocations`, MDX loaders, related posts logic, etc.).
- Pass parsed/derived data + `mdxContent` into `Vega*Page` components.
- Preserve schema behavior in wrapper (or pass via prop if standardized).

**Gate:**

- Wrapper LOC drops significantly (~30–70 lines typical depending on metadata logic).
- `pnpm type-check` green.
- `base-template` local build + route smoke test green.

---

## 5) Migrate underscore reference sites to theme wrappers

### Sites in scope

- `sites/_castor-plumbing`
- `sites/_cygnus-graphics`
- `sites/_lyra-garden`
- `sites/_nova-print`
- `sites/_rigel-events`

### Files to modify

Same app route set as applicable (tradesperson full set; rigel event set).

### Notes

- Castor homepage visual parity is explicit acceptance criterion: verify hero/header/type/image-overlay/services grid alignment to Stitch intent.
- Keep per-site differences in props/content only (hero text, image paths, featured lists).

**Gate:**

- `_castor-plumbing/app/page.tsx` thin wrapper (~30 lines target; metadata/schema may add some lines).
- All 5 sites type-check and build.
- Manual visual QA for castor homepage and one interior page per migrated site.

---

## 6) Update scaffolding tool for new default behavior

### File to modify

- `tools/create-site-from-project.ts`

### Required changes

1. Expand `THEME_REFERENCE_SITE_MAP` from 3 themes to 7:
   - castor, cygnus, lyra, nova, orion, vega, rigel
2. Expand `THEMED_PAGE_FILES` to include complete route wrapper set:
   - Tradesperson: 12 page files listed above
   - Rigel event variant: include event routes + blog routes
3. Ensure logic handles **theme-specific page manifests** (important for rigel divergence):
   - Recommend replacing flat `THEMED_PAGE_FILES` with:
     - `THEMED_PAGE_FILES_BY_THEME` (or by site class), falling back to tradesperson default.
4. Ensure generated sites copy thin wrappers, not old inline-layout files.

**Gate:** dry-run scaffold for at least:

- one tradesperson theme (e.g., castor)
- rigel event theme  
  Then build both generated outputs.

---

## 7) Backward compatibility and rollout safety

1. Keep all existing theme component exports unchanged.
2. Do not force immediate migration of non-reference sites (`dj-fox-electrical`, `colossus-scaffolding`, `mad-graphics`).
3. No breaking changes to site-local content loaders.
4. If shared types package introduces coupling risk, duplicate minimal prop types per theme first; consolidate later.

**Gate:** full monorepo `pnpm type-check` and `pnpm build` including non-migrated sites.

---

## 8) Verification matrix (final)

1. **Static checks**
   - `pnpm lint`
   - `pnpm type-check` (0 errors)
2. **Build checks**
   - `pnpm build` monorepo
3. **Import contract checks**
   - `@platform/themes/<theme>/pages` resolves for all 7 themes
4. **Acceptance checks**
   - Castor exports full required set
   - Equivalent sets for cygnus/lyra/nova/orion/vega
   - Rigel exports event set
   - `base-template` uses `Vega*Page`
   - `_castor-plumbing` homepage wrapper thin + visual match
5. **Scaffolder checks**
   - `create-site-from-project` generates thin wrappers and correct themed route files per selected theme

---

## 9) Risks / trade-offs

1. **Type drift across themes** if prop types are duplicated.  
   Mitigation: shared contracts + per-theme extension types.
2. **Rigel route divergence** may break generic scaffolder assumptions.  
   Mitigation: theme-specific page manifest map.
3. **Visual regressions** when extracting inline JSX to theme templates.  
   Mitigation: snapshot/manual QA against reference sites and Stitch images.
4. **Over-thin wrapper target (~30 lines)** may be unrealistic on dynamic routes with metadata/schema/static params.  
   Mitigation: treat as guideline; prioritize architectural separation over exact LOC.
5. **Missing clarified brief for orion/vega reference sites**.  
   Mitigation: proceed with package-level page exports; validate runtime via base-template + existing themed sites.

```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-11_theme-page-templates/
```
