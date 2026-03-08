# Codex Plan: Architecture Deduplication

## 1. Dependency analysis and sequencing constraints

1. `lib/site.ts`, `lib/contact-info.ts`, and `lib/schema.ts` form a dependency chain.
- `schema.ts` currently imports `absUrl` (`lib/site.ts`) and business config (`lib/business-config.ts`), so `schema.ts` cannot be safely centralized until URL + business-config injection interfaces exist.

2. `lib/mdx.tsx` currently imports `@/mdx-components` directly.
- Shared `loadMdx` must accept an MDX components map parameter to break the site alias dependency.
- Base-template and DJ Fox also include sync helpers (`getMdxFiles`, `getMdxContent`, `getAllServices`, `getAllLocations`) not present in colossus/core copy; decide whether to keep as shared legacy helpers or remove with call-site audit.

3. `lib/content.ts` has the highest utility divergence.
- Base + DJ share most behavior.
- Colossus has custom service sorting and different location-specific filtering logic.
- Existing `packages/core-components/src/lib/content.ts` is closer to colossus and currently not a full superset.

4. Contact stack is coupled across component + route.
- UI divergence: base/DJ props-driven service/location lists vs colossus hardcoded lists and extra fields (`projectType`, `urgency`).
- API divergence: base/DJ use fetch to Resend REST API + `NextResponse`, colossus uses Resend SDK + `Response`, and payload/response semantics differ.
- These should be extracted together via shared contracts to avoid drift.

5. Route-level dedup is feasible with factories/re-exports.
- CSRF routes are functionally identical.
- Analytics track route is identical where present (base + colossus); DJ currently does not have this route in this snapshot.

6. Package boundary decision: keep in `@platform/core-components`.
- `core-components` already depends on `gray-matter`, `next-mdx-remote`, security/rate-limiter libs, and is already path-mapped into sites.
- New package (`site-utils`) is not justified unless dependency isolation becomes a hard requirement.

## 2. Migration strategy (phased, with verification gates)

1. Phase 0: Baseline and safety harness.
- Create/modify:
  - `output/sessions/codex-peer-review/2026-03-08_architecture-dedup/` (notes only)
- Actions:
  - Record checksums of dedup targets (content/mdx/schema/contact-info/site/contact routes/csrf routes).
  - Capture current test inventory and route behavior deltas (especially colossus contact route tests).
- Verification gate:
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm build`
  - Existing targeted tests green (at minimum colossus contact route + schema tests).
- Risk control:
  - Ensures regressions are attributable to migration steps, not pre-existing drift.

2. Phase 1: Extract lowest-risk utility modules first (`site`, `contact-info`, `schema`) via factories.
- Create/modify:
  - `packages/core-components/src/lib/site.ts` (replace stub/legacy with final shared API)
  - `packages/core-components/src/lib/contact-info.ts` (replace stub with factory)
  - `packages/core-components/src/lib/schema.ts` (convert to dependency-injected factory or pure functions requiring args)
  - `packages/core-components/src/index.ts` (export stable APIs/types)
  - `sites/base-template/lib/site.ts`
  - `sites/dj-fox-electrical/lib/site.ts`
  - `sites/colossus-scaffolding/lib/site.ts`
  - `sites/base-template/lib/contact-info.ts`
  - `sites/dj-fox-electrical/lib/contact-info.ts`
  - `sites/colossus-scaffolding/lib/contact-info.ts`
  - `sites/base-template/lib/schema.ts`
  - `sites/dj-fox-electrical/lib/schema.ts`
  - `sites/colossus-scaffolding/lib/schema.ts`
- API design:
  - `createSiteUtils({ siteUrl })` returning `absUrl` (+ pure helpers exported directly).
  - `createContactInfo({ siteConfig })` or `createContactInfo({ business })` returning constants + formatters.
  - `createSchemaHelpers({ businessConfig, businessType, absUrl })` returning schema generators; no site-local imports inside shared module.
- Backward compatibility:
  - Keep site `lib/*.ts` files as thin wrappers initially; delete only after all imports are switched (single PR may still delete wrappers if all call-sites are updated atomically).
- Verification gate:
  - `pnpm type-check`
  - `pnpm build`
  - schema tests in base-template + colossus pass after adapting fixtures.
- Risks/trade-offs:
  - Function signature changes in schema tests/pages are broad; wrapper pattern minimizes churn.

3. Phase 2: Consolidate business config and remove colossus dual-config.
- Create/modify:
  - `sites/colossus-scaffolding/site.config.ts`
  - `sites/colossus-scaffolding/lib/business-config.ts` (remove)
  - (Optionally for consistency) `sites/base-template/lib/business-config.ts`, `sites/dj-fox-electrical/lib/business-config.ts` replaced with derivation adapters or removed if schema builders consume `site.config.ts` directly.
- Design:
  - Define a shared mapper in core-components (e.g., `mapSiteConfigToBusinessConfig(siteConfig)`) to derive schema business config from a single canonical `site.config.ts` source.
  - Preserve existing user-facing values; only source-of-truth changes.
- Verification gate:
  - Re-run schema tests and homepage/location schema rendering pages in all sites.
  - `pnpm type-check && pnpm build`.
- Risks/trade-offs:
  - Mapping can accidentally normalize fields (e.g., `country` vs `GB`, phone format); require explicit mapping tests.

4. Phase 3: Deduplicate MDX component map and MDX loader.
- Create/modify:
  - `packages/core-components/src/lib/mdx.tsx` (shared loader with injected component map)
  - `packages/core-components/src/mdx-components.tsx` (shared default MDX map for base/DJ parity)
  - `packages/core-components/src/index.ts` (or explicit subpath exports)
  - `sites/base-template/lib/mdx.tsx` (replace with shared import/wrapper)
  - `sites/dj-fox-electrical/lib/mdx.tsx` (replace with shared import/wrapper)
  - `sites/colossus-scaffolding/lib/mdx.tsx` (replace with shared import/wrapper)
  - `sites/base-template/mdx-components.tsx` (delete)
  - `sites/dj-fox-electrical/mdx-components.tsx` (delete)
  - `sites/colossus-scaffolding/mdx-components.tsx` (delete only if fully compatible; otherwise keep site override and still use injected `loadMdx`)
- API design:
  - `loadMdx({ baseDir, slug, components })` or `createMdxUtils({ components })`.
  - Keep `InfoBox` semantic color classes (`blue-50`, `green-50`, etc.) unchanged.
- Verification gate:
  - `pnpm type-check`
  - Build each site and render sample service/blog/location/project MDX pages.
  - Validate sitemap generation (`listSlugs`, `getPageImage`) still works.
- Risks/trade-offs:
  - Colossus has a richer custom MDX component surface; if incompatible, preserve per-site override while still sharing loader.

5. Phase 4: Deduplicate `content.ts` using strategy-based options.
- Create/modify:
  - `packages/core-components/src/lib/content.ts` (becomes canonical superset)
  - `packages/core-components/src/index.ts` (exports)
  - `sites/base-template/lib/content.ts` (delete/replace import)
  - `sites/dj-fox-electrical/lib/content.ts` (delete/replace import)
  - `sites/colossus-scaffolding/lib/content.ts` (delete/replace import)
- API design:
  - `createContentApi({ getLocationSlugs?, serviceSort?, imageResolver? })`.
  - Default behavior matches base-template.
  - Colossus passes custom service sort strategy.
  - Optional location filtering callback supports sites that need it.
  - Include full function superset (`getProjectsByType`, testimonial filters, etc.).
- Backward compatibility:
  - Maintain existing exported names/signatures at site wrapper level to avoid page-level refactors.
- Verification gate:
  - Snapshot or targeted tests for service listing order and filtering.
  - Manual checks: services index ordering, location-specific service suppression, projects/blog/testimonials pages.
  - `pnpm build`.
- Risks/trade-offs:
  - Most regression-prone phase because it drives many pages and static params.

6. Phase 5: Deduplicate form + API routes + analytics/csrf route factories.
- Create/modify:
  - `packages/core-components/src/components/ui/contact-form.tsx` (single shared component)
  - `packages/core-components/src/lib/api/contact-route.ts` (factory)
  - `packages/core-components/src/lib/api/csrf-route.ts` (factory or shared handler)
  - `packages/core-components/src/lib/api/analytics-track-route.ts` (shared handler/factory)
  - `packages/core-components/src/index.ts` (or subpath exports)
  - `sites/base-template/components/ui/ContactForm.tsx` (delete/replace import)
  - `sites/dj-fox-electrical/components/ui/ContactForm.tsx` (delete/replace import)
  - `sites/colossus-scaffolding/components/ui/ContactForm.tsx` (delete/replace import)
  - `sites/base-template/app/api/contact/route.ts`
  - `sites/dj-fox-electrical/app/api/contact/route.ts`
  - `sites/colossus-scaffolding/app/api/contact/route.tsx` (normalize to `route.ts`)
  - `sites/base-template/app/api/csrf-token/route.ts`
  - `sites/dj-fox-electrical/app/api/csrf-token/route.ts`
  - `sites/colossus-scaffolding/app/api/csrf-token/route.ts`
  - `sites/base-template/app/api/analytics/track/route.ts`
  - `sites/colossus-scaffolding/app/api/analytics/track/route.ts`
  - (Optional) `sites/dj-fox-electrical/app/api/analytics/track/route.ts` if desired for consistency.
- ContactForm API design:
  - Base props:
    - `services?: ServiceOption[]`
    - `serviceAreas?: string[]`
    - `locations?: { name: string; slug?: string }[]`
    - `extraFields?: Array<FieldConfig>` for extensibility
    - `defaults?: Partial<FormState>`
  - Colossus passes `extraFields` for `projectType`/`urgency` and hardcoded option sets through props (not embedded in shared component).
- Contact route factory design:
  - `createContactRoute({ provider, business, emailTheme, responseShape, validationMode, rateLimitConfig })`.
  - Provider abstraction:
    - `resendFetchProvider`
    - `resendSdkProvider`
  - Normalize response contract internally, then allow site-level mapping (`{ success: true }` vs `{ ok: true }`) only at adapter boundary.
- CSRF route:
  - One-line route file pattern: `export { GET, runtime, dynamic } from '@platform/core-components/lib/api/csrf-route'` (or factory call).
- Analytics route:
  - Shared route module used by identical implementations.
- Verification gate:
  - Existing colossus contact route tests pass after refactor (possibly migrated to shared test suite + site adapter tests).
  - Add/adjust tests for both email providers and response shape mapping.
  - `pnpm type-check && pnpm build`.
- Risks/trade-offs:
  - Over-generalized factory can become unreadable; keep provider interface narrow and explicit.

7. Phase 6: CoverageMap color de-hardcoding.
- Create/modify:
  - `packages/core-components/src/components/ui/coverage-map.tsx`
  - `packages/core-components/src/components/ui/coverage-map-section.tsx`
  - Any site call-sites passing map/legend colors
- Design:
  - Add prop: `countyColors?: Record<string, string>` with safe defaults.
  - Use passed map for both marker color and legend chip color.
  - Remove eslint disable comments tied to hardcoded hex map in component internals.
- Verification gate:
  - Visual check in locations pages across sites.
  - `pnpm build` with no lint rule suppressions needed for map color constants.
- Risks/trade-offs:
  - Token-only approach may not support arbitrary county palettes; prop-based map keeps behavior stable and configurable.

## 3. Backwards compatibility and rollout model

1. Preferred rollout: per-domain module migration, cross-site in one phase.
- Migrate a given module type across all three sites before moving to next phase (e.g., all `schema.ts` wrappers at once).
- Avoid mixed old/new contracts for the same module family.

2. Keep temporary site adapters during transition.
- Thin wrappers in `sites/*/lib` and route files allow stable import paths during migration.
- Delete wrappers only once all call-sites and tests are updated.

3. Avoid page-level behavioral changes.
- Any differences in output (sort order, schema content, contact response body) must be preserved unless explicitly accepted.

## 4. Test strategy and verification matrix

1. Required checks each phase:
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

2. Focused tests to add/retain:
- Schema builder unit tests for injected config + absUrl behavior.
- Content API tests for service filtering/sorting variants (default + colossus strategy).
- MDX loader tests for component-map injection.
- Contact route tests for:
  - required/optional field validation
  - provider abstraction (fetch vs SDK)
  - CSRF/rate-limit paths
  - normalized success/error responses.

3. Manual smoke checks:
- Each site: homepage, service page, location page, blog page, contact form submission path.
- Sitemaps for services/locations/blog/projects.
- Coverage map marker colors and legend consistency.

## 5. Key risks and trade-offs

1. Existing core-components files with same names are partly stubs or divergent implementations.
- Risk: importing wrong module variant and silently changing behavior.
- Mitigation: explicitly rewrite these modules as canonical APIs and lock with tests.

2. Colossus-specific behavior can be lost if abstractions are too narrow.
- Mitigation: strategy injection for sorting/fields/providers, not site-name conditionals.

3. Contact route complexity may balloon.
- Mitigation: split into small units (`validatePayload`, `buildTemplates`, `sendEmail(provider)`), then compose in `createContactRoute`.

4. Route file naming (`route.tsx` vs `route.ts`) inconsistency.
- Mitigation: normalize to `route.ts` for non-JSX handlers during migration.

5. Brief vs current repo drift (important).
- In this snapshot, some “site-local” utilities already exist in core-components and colossus has an `mdx-components.tsx` file.
- Plan should treat these as current-state migrations, not assume the older snapshot.
