# Implementation Plan

## 1. Establish the integration and parallel-worktree strategy

1. Start from an up-to-date `develop` branch and confirm the repository is clean.
2. Create a temporary integration branch from `develop`, for example:
   - `feature/npracing-sites`
3. On that branch, bootstrap both site directories in one commit:
   - `sites/npracing-v1/`
   - `sites/npracing-v3/`
4. Create two feature branches from the bootstrap commit:
   - `feature/npracing-v1`
   - `feature/npracing-v3`
5. Check each branch out into a separate git worktree. Assign one implementation session to each worktree and restrict each session to its corresponding site tree.
6. Use separate session-observability run IDs:
   - `npracing-v1`
   - `npracing-v3`
7. After both implementations pass their own gates, merge both branches back into `feature/npracing-sites`, resolve only integration-level conflicts, run repository-wide verification, then merge through the repository’s normal pull-request flow into `develop`.
8. Promote from `develop` to `staging` and then `main` only through the documented workflow. Never push directly to `staging` or `main`.

**Why this strategy:** the two builds are naturally parallel, but creating both skeletons first avoids duplicate package-lock and workspace setup changes. The worktrees then isolate implementation edits while preserving a common starting point.

**Verification gate**

- `git status` is clean before branching.
- Both site directories exist in the bootstrap commit.
- Both worktrees are based on the same commit.
- Each worktree has a distinct branch and observability run ID.
- No implementation session is permitted to edit the other site’s directory.

---

## 2. Inspect the references and record the implementation contract

Before changing the generated sites, inspect:

- Root `CLAUDE.md`, especially the critical git workflow.
- `sites/dch-automotive/` for the current self-contained-site pattern.
- `sites/base-template/` only as a file scaffold, not as the authoritative theme architecture.
- `docs/guides/adding-new-site.md`.
- `docs/guides/adding-content-section.md`.
- `docs/standards/images.md`.
- `output/briefs/npracing/brief.md`.
- The NPRacing `HANDOFF.md`.
- `prototype/tokens.css`.
- All eight prototype HTML files to recover composition and copy, without copying their implementation.
- `prototype/assets/` to inventory source dimensions, formats, ownership, and intended placements.
- The live merch retailer and BSB sources, where accessible, to verify URLs, prices, dates, names, and article facts.

Create a short implementation checklist in each branch’s working notes covering:

- Current `DeepPartialThemeConfig` keys used by `dch-automotive`.
- Current local Header/Footer/page component structure.
- Existing `lib/mdx.tsx` signatures and `ContentType` behavior.
- Existing sitemap conventions.
- Existing font-loading and `next/image` remote-pattern conventions.
- Exact build, lint, type-check, and validation scripts.

Do not treat the prototype HTML as source code. Use it only as a visual and content reference; use `tokens.css` as the design-system source of truth.

**Verification gate**

- Every proposed config key and loader API is confirmed against current repository code.
- Prototype content and assets are inventoried.
- Any stale or unverifiable merch/news values are explicitly listed before MDX authoring begins.

---

## 3. Bootstrap both self-contained sites

Create both sites from the base template, then immediately align them with the newer `dch-automotive` pattern.

### Files created in each site

At minimum:

- `sites/npracing-v1/package.json`
- `sites/npracing-v1/app/`
- `sites/npracing-v1/components/`
- `sites/npracing-v1/content/`
- `sites/npracing-v1/lib/`
- `sites/npracing-v1/public/`
- `sites/npracing-v1/site.config.ts`
- `sites/npracing-v1/theme.config.ts`
- `sites/npracing-v1/tailwind.config.ts`
- `sites/npracing-v1/next.config.*`
- `sites/npracing-v1/vercel.json`

Repeat for `sites/npracing-v3`.

### Bootstrap rules

- Set package names to `npracing-v1` and `npracing-v3`.
- Remove irrelevant service/location/project/testimonial content and routes.
- Remove runtime imports from retired `@platform/themes/*` packages.
- Keep type-only imports from `@platform/theme-system` where required.
- Add local:
  - `components/site-header.tsx`
  - `components/site-footer.tsx`
  - `components/pages/*`
- Ensure each site can build independently.
- Scope Tailwind content globs to the site’s own `app`, `components`, `content`, and other genuinely used local files.
- Do not add `packages/themes/**/*` globs.
- Make the package build script use `next build --webpack`.
- Use a site-level `vercel.json` patterned after `dch-automotive`, with a root-level Turbo build command and no `outputDirectory`.
- Do not add `ignoreCommand` or `turbo-ignore`.

Update `pnpm-lock.yaml` once in the bootstrap commit if creating the sites changes workspace package metadata or dependencies.

**Verification gate**

- `pnpm install --lockfile-only` or the repository-standard install completes without unexpected dependency changes.
- `pnpm --filter npracing-v1 run type-check` and the v3 equivalent can at least resolve their base modules.
- No runtime import from `@platform/themes/*` exists under either site.
- Both `vercel.json` files omit `outputDirectory` and ignore commands.

---

## 4. Define the NPRacing content architecture

Use three MDX-backed content types in each site.

### 4.1 `merch`

Create eight files:

- `content/merch/<product-slug>.mdx`

Recommended Zod frontmatter fields:

- `title: string`
- `description: string`
- `externalUrl: url`
- `priceAmount: nonnegative integer` — value in minor GBP units
- `currency: literal "GBP"`
- `displayPrice: string` — preserves the retailer’s current public display
- `image: url`
- `imageAlt: non-empty string`
- `category: enum` based on the actual catalogue
- `sortOrder: nonnegative integer`
- `featured: boolean`
- `available: boolean`
- `capturedAt: ISO date`
- `updatedAt: ISO date optional`

The filename is the canonical slug. Do not duplicate the slug in frontmatter unless the platform loader requires it.

Merchandise has an index route only. Cards link directly to The Clothing Kings using normal external anchors. There are no internal product detail routes.

### 4.2 `news`

Create two files:

- `content/news/<article-slug>.mdx`

Recommended frontmatter fields:

- `title: string`
- `excerpt: string`
- `publishedAt: ISO date`
- `updatedAt: ISO date optional`
- `author: string optional`
- `category: string`
- `heroImage: url`
- `heroImageAlt: non-empty string`
- `sourceName: string`
- `sourceUrl: url`
- `featured: boolean`
- `draft: boolean`

The MDX body contains the on-site article copy. It should be original or approved NPRacing copy, not an unlicensed reproduction of a third-party article.

Implement both news index and news detail routes. Two articles are enough to justify detail pages because they provide stable, shareable URLs, metadata, structured navigation, and a content model that can grow without another routing migration.

### 4.3 `brand`

Create one singleton-style file:

- `content/brand/npracing.mdx`

Recommended frontmatter fields:

- `teamName: string`
- `shortName: string`
- `tagline: string`
- `championship: string`
- `raceNumber: string`
- `riderName: string`
- `bike: string optional`
- `email: valid email`
- `instagramHandle: string`
- `instagramUrl: url`
- `locationLabel: string optional`
- `foundedYear: integer optional`
- `logo: url`
- `logoAlt: non-empty string`

Use the MDX body for team history and brand narrative. Homepage and contact-page team copy should be loaded from this file rather than embedded in JSX.

### Loader and schema files

Create or adapt in each site:

- `lib/mdx.tsx`
- `lib/schemas/merch.ts`
- `lib/schemas/news.ts`
- `lib/schemas/brand.ts`
- `lib/schemas/index.ts`
- `lib/content/merch.ts` if a thin typed query layer is useful
- `lib/content/news.ts`
- `lib/content/brand.ts`

Extend the local `ContentType` union with:

- `merch`
- `news`
- `brand`

Use the documented `listSlugs` and `loadMdx` pattern. Thin helper functions may sort/filter loaded MDX, but they must not become alternate hardcoded data stores.

### Validation approach

Add a site-scoped content validator instead of expanding the root service/location-only validator during two parallel site builds:

- `sites/npracing-v1/scripts/validate-content.ts`
- `sites/npracing-v3/scripts/validate-content.ts`

Add a `validate-content` package script to each site. The validator should:

- Parse every MDX file.
- Validate frontmatter against the corresponding Zod schema.
- Reject duplicate or malformed slugs.
- Reject missing images and alt text.
- Reject invalid external URLs.
- Enforce exactly eight merch records and two published news records for this launch.
- Enforce exactly one `brand` record.
- Detect duplicate merch `sortOrder` values.
- Optionally perform network link checking in a separate non-blocking script, since CI network access may be unreliable.

This avoids root-script merge collisions while satisfying the requirement that the new collections have explicit schema validation.

**Verification gate**

Run in each worktree:

- `pnpm --filter npracing-v1 run validate-content`
- `pnpm --filter npracing-v3 run validate-content`

Also test at least one deliberately invalid fixture locally or with a unit test to prove schemas reject malformed content.

---

## 5. Re-verify and author the real content

Before committing final MDX values:

1. Open every captured retailer URL from the prototype.
2. Confirm:
   - Product name
   - Current GBP price
   - Availability
   - Destination URL
   - Product image correspondence
3. Open the relevant BSB or team sources.
4. Confirm:
   - Article date
   - Names and championship terminology
   - Quotes
   - Source link
5. Compare verified values with the prototype HTML and handoff.
6. Record the verification date in `capturedAt` or `updatedAt`.

If network access or the source site prevents verification:

- Preserve the captured 2026-08-01 values only as provisional content.
- Mark the affected records in implementation notes.
- Do not invent replacements.
- Require human confirmation before calling the client-facing deployment final.

Keep contact email, Instagram link, team details, and homepage claims in MDX where they represent client content. Generic UI text such as “Submit” or form validation labels may remain in components.

**Verification gate**

- All eight external merch links resolve or are explicitly marked provisional.
- Prices match the live retailer on the verification date.
- Both news source URLs resolve.
- Article copy is original/approved and properly attributed.
- No product or article data is stored in a TS array or page component.

---

## 6. Resolve the production image pipeline

### Preferred path: upload to R2

At the start of implementation, check whether valid R2 upload credentials and the platform’s normal upload procedure are available without exposing secrets.

If available:

1. Inventory source assets and reject base64-embedded copies from HTML.
2. Normalize filenames according to `docs/standards/images.md`, for example:
   - `npracing/brand/logo-*`
   - `npracing/team/*`
   - `npracing/news/*`
   - `npracing/merch/*`
3. Optimize source images into suitable production formats and dimensions.
4. Upload one shared NPRacing asset library to R2.
5. Record canonical R2 URLs in both sites’ MDX.
6. Configure `next/image` remote patterns for the exact R2 host.
7. Verify dimensions, crop behavior, responsive `sizes`, and alt text.

Both sites may reference the same R2 objects. They should not duplicate binary assets in Git.

### Fallback path: architecture-complete placeholders

If R2 credentials are unavailable:

1. Use the documented `placehold.co` development fallback.
2. Configure its host explicitly in `next.config.*`.
3. Store placeholder URLs in MDX, not components.
4. Keep the real source assets outside committed site directories.
5. Produce an asset manifest mapping every placeholder to:
   - Source filename
   - Intended R2 object name
   - Placement
   - Required crop/aspect ratio
   - Final alt text
6. Treat any Vercel deployment with placeholders as provisional and unsuitable for final visual approval.

Do not commit source photos, logos, or product images merely to avoid the R2 dependency.

**Human-only dependency if credentials are absent**

A user with R2 access must provide an approved upload route or upload the mapped assets. The implementation agent can then replace placeholder URLs in MDX and redeploy.

**Verification gate**

- No base64 image data remains.
- No production image binary is committed to Git.
- Every rendered content image uses `next/image`.
- All remote image hosts are narrowly configured.
- A placeholder-based deployment is visibly and explicitly labelled provisional in handoff notes.

---

## 7. Implement the shared token foundation independently in both sites

Translate `prototype/tokens.css` into each site’s local `theme.config.ts`.

### Shared visual foundation

Map the confirmed source values for:

- NPRacing red, including `#E11024`.
- Near-black, including `#0a0a0a`.
- Off-white and supporting neutral palette.
- Text and background semantic tokens.
- Barlow Condensed display typography.
- Barlow body typography.
- Bebas Neue number/poster typography.
- Heading and body scales.
- Pill navigation and button radii.
- Borders, spacing, shadows, and motion durations.
- Marquee, stat-strip, and texture-related semantic tokens.

Use the actual `DeepPartialThemeConfig` shape found in `dch-automotive`; do not invent keys based solely on the prototype CSS.

Use `next/font` if compatible with the current platform pattern. Expose font variables through the supported local theme mechanism.

### CSS constraints

- Components use semantic Tailwind classes such as `bg-brand-primary`, not hex values.
- No inline `style` props.
- No CSS-in-JS.
- No Tailwind `theme()` calls in plain CSS.
- Local CSS must use generated variables such as `var(--color-brand-primary)`.
- Any noise texture should use an approved R2 asset or a local CSS treatment based solely on theme variables. It must not reintroduce embedded base64 prototype data.
- Respect `prefers-reduced-motion` for marquee, reveal, and decorative movement.

### Duplication decision

Duplicate the token configuration in both sites. Do not create a runtime shared theme package. The shared values are small, stable, and intentionally site-owned under the self-contained-site rule.

Use local `ComponentRegistry` entries only where the current system requires them. Composition differences belong primarily in local React components, not in a cross-site runtime registry.

**Verification gate**

- Search both sites for hardcoded hex colors in components and reject any result.
- Search plain CSS for `theme(` and reject any result.
- Fonts load without layout-breaking fallback behavior.
- Both sites expose the same palette/type foundation while retaining independent component implementations.

---

## 8. Build the shared route structure with distinct visual compositions

Both sites should expose:

- `/`
- `/merch`
- `/news`
- `/news/[slug]`
- `/contact`

Also implement:

- `not-found.tsx`
- Route metadata
- Open Graph metadata
- robots configuration
- sitemap index and section sitemaps
- Accessible skip link
- Local Header and Footer

### Common functional behavior

- Header navigation includes Home, Merch, News, and Contact.
- Merch cards are external retailer links and clearly indicate that they leave NPRacing.
- News cards link to local detail routes.
- Contact information comes from brand MDX.
- Contact form is structurally real:
  - Correct `<form>` semantics
  - Associated labels
  - Name, email, and message fields
  - Required constraints
  - Suitable autocomplete attributes
  - Validation-ready error/status region
- The form must not imply successful delivery. Either disable submission with an honest “coming soon” note or intercept it with a clear non-sending status. Do not create a fake success state.
- Include an explicit implementation follow-up for Resend and server-side spam protection.

### Site-specific v1 composition

Create local components such as:

- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/pages/home-page.tsx`
- `components/pages/merch-page.tsx`
- `components/pages/news-index-page.tsx`
- `components/pages/news-detail-page.tsx`
- `components/pages/contact-page.tsx`
- `components/sections/gridbox-hero.tsx`
- `components/sections/stat-strip.tsx`
- `components/sections/marquee-ribbon.tsx`
- `components/cards/merch-card.tsx`
- `components/cards/news-card.tsx`

The v1 homepage should reproduce the cinematic full-bleed and grid-box direction, including its image hierarchy and restrained overlay motion.

### Site-specific v3 composition

Create equivalent local files, with distinct implementations such as:

- `components/sections/number-51-hero.tsx`
- Poster-style title/number layers
- Bold editorial content blocks
- v3-specific merch and news card treatments
- v3-specific Header/Footer composition

The v3 homepage should make race number 51 the principal visual structure, while preserving semantic heading order and readable responsive behavior.

### Sharing decision

Share content semantics, URL structure, field names, and R2 URLs conceptually, but duplicate the implementation inside each self-contained site:

- Schemas duplicated locally
- Content duplicated locally
- Loaders duplicated locally
- Components distinct and local
- Theme configuration local

Do not introduce a new `packages/npracing-*` runtime package. The small amount of duplication is preferable to coupling two comparison builds that may diverge after the client chooses a direction.

**Verification gate**

For both sites:

- All routes return successfully.
- Navigation works by keyboard.
- Heading hierarchy is valid.
- Focus states are visible.
- Motion is reduced under `prefers-reduced-motion`.
- There is no horizontal overflow at common mobile widths.
- External merch links have safe and accessible behavior.
- Contact submission does not claim to send a message.

---

## 9. Add metadata and sitemap support

Create or update in each site:

- `app/layout.tsx`
- `app/page.tsx`
- `app/merch/page.tsx`
- `app/news/page.tsx`
- `app/news/[slug]/page.tsx`
- `app/contact/page.tsx`
- `app/sitemap-index.xml/route.ts`
- `app/news/sitemap.xml/route.ts`
- `app/merch/sitemap.xml/route.ts`
- `app/robots.ts` or the repository-standard equivalent

Sitemap behavior:

- News sitemap contains both published detail URLs.
- Merch sitemap contains only `/merch`, because product cards deliberately have no internal detail routes.
- Main/index sitemap includes home, contact, merch, news, and references section sitemaps according to the existing platform convention.
- Draft news is excluded.
- Canonical base URLs come from environment/config rather than hardcoded deployment URLs.

If a build-output-affecting environment variable such as `NEXT_PUBLIC_SITE_URL` is introduced:

1. Declare it in both site configurations as required.
2. Add it to root `turbo.json`’s `env` array.
3. Coordinate that root-file edit on the integration branch rather than allowing both worktrees to edit it independently.
4. Configure values separately in both Vercel projects.

Prefer an existing platform-standard URL variable if one already exists.

**Verification gate**

- Metadata renders correctly on all routes.
- News detail pages generate static params from MDX.
- Unknown news slugs return 404.
- Sitemap XML is valid and contains no placeholder host in the final R2-backed deployment.
- Every build-affecting environment variable appears in `turbo.json`.

---

## 10. Run per-site quality gates before integration

In each worktree, run the repository-confirmed equivalents of:

1. Content validation:
   - `pnpm --filter npracing-v1 run validate-content`
   - `pnpm --filter npracing-v3 run validate-content`
2. Lint:
   - `pnpm --filter npracing-v1 run lint`
   - `pnpm --filter npracing-v3 run lint`
3. Type checking:
   - The site-level command if present.
   - Root `npm run type-check` where practical.
4. Production build:
   - `pnpm --filter npracing-v1 run build`
   - `pnpm --filter npracing-v3 run build`
   - Confirm logs show `next build --webpack`.
5. Local production smoke test using `next start`.
6. Route checks for every required URL.
7. Browser checks at representative mobile, tablet, desktop, and ultrawide dimensions.
8. Accessibility review:
   - Keyboard navigation
   - Focus order
   - Labels
   - Color contrast
   - Reduced motion
   - Image alt text
9. Search-based architecture checks:
   - No `@platform/themes/*` runtime imports
   - No hardcoded product/news arrays
   - No committed production image binaries
   - No `theme()` CSS calls
   - No component hex colors
   - No `outputDirectory`
   - No `ignoreCommand`

The pre-push hook is not sufficient because it only runs type checking. Do not merge based on a successful push alone.

**Verification gate**

Each site must have a recorded pass for content validation, lint, type checking, production build, route smoke testing, and architecture searches before its branch is merged.

---

## 11. Integrate the two branches and run combined repository checks

Merge `feature/npracing-v1` and `feature/npracing-v3` into `feature/npracing-sites`.

Integration-level work includes:

- Resolving `pnpm-lock.yaml` deterministically.
- Applying any coordinated `turbo.json` environment-variable additions once.
- Confirming both package names are unique.
- Confirming both sites remain independently filterable.
- Comparing duplicated content to ensure factual parity.
- Comparing theme tokens to ensure accidental palette drift has not occurred.
- Ensuring design differences are compositional rather than accidental content differences.

Run:

- `pnpm install --frozen-lockfile`
- Root `npm run type-check`
- Both lint commands
- Both content-validation commands
- Both production builds
- Any repository CI-equivalent checks documented for changed sites

Where repository resources permit, run the two builds concurrently. If memory limits make that unreliable, run them independently while retaining parallel development as the primary delivery strategy.

Create pull requests according to the repository workflow:

1. `feature/npracing-sites` → `develop`
2. Normal promotion from `develop` → `staging`
3. Normal promotion from `staging` → `main`

**Verification gate**

- A clean clone or CI runner can install and build both sites.
- No uncommitted generated output is required.
- Both sites coexist on the same integration commit.
- CI passes before any Vercel production setup.

---

## 12. Create two GitHub-linked Vercel projects

The recommended production setup is the Vercel dashboard’s **Import Git Repository** flow, because the available MCP upload deploy would create a disconnected file-tree project and would break the platform’s Git-integrated deployment model.

This step requires a human with access to the correct Vercel team and GitHub repository unless an already-authenticated Vercel REST/CLI workflow is independently confirmed.

### Human dashboard procedure for v1

After the implementation exists on the branch intended for Vercel production, preferably `main` after normal promotion:

1. Open Vercel.
2. Select the correct team/account.
3. Choose **Add New → Project**.
4. Select **Import Git Repository**.
5. Choose the existing monorepo’s GitHub repository.
6. Set project name to `npracing-v1`.
7. Set **Root Directory** to:
   - `sites/npracing-v1`
8. Confirm framework preset is Next.js.
9. Do not set an Output Directory override.
10. Retain the site-level `vercel.json` build command.
11. Do not add an Ignore Command.
12. Add required environment variables, including the final v1 site URL if used for metadata.
13. Set the normal production branch, expected to be `main`.
14. Deploy.

### Human dashboard procedure for v3

Repeat with:

- Project name: `npracing-v3`
- Root Directory: `sites/npracing-v3`
- Its own site URL environment value

### Agent-executable follow-up after project creation

If the local Vercel CLI is authenticated, the agent can:

- Link each local site directory to its existing project using `vercel link`.
- Run `vercel pull` to confirm project settings and environment metadata.
- Inspect deployments with the CLI or available read-only MCP tools.
- Verify project IDs, names, root directories, deployment status, and build logs.
- Avoid committing `.vercel/project.json`; it should remain ignored local state.

Do not use the MCP `deploy_to_vercel` file-tree upload for the final projects. It is acceptable only for an explicitly disposable diagnostic deployment, not the GitHub-linked deliverable.

Do not run an ad hoc `vercel --prod` from an unpromoted feature branch as a substitute for the repository’s normal release workflow.

**Verification gate**

For each Vercel project:

- It is connected to the correct GitHub repository.
- Root Directory is exactly the corresponding site directory.
- There is no Output Directory override.
- Production branch matches the repository workflow.
- Build command ultimately runs the site’s webpack production build.
- A Git commit triggers the expected deployment.
- The default `*.vercel.app` URL returns the correct design.

---

## 13. Validate deployed URLs side by side

For both Vercel URLs, verify:

- Home, merch, news index, both news details, and contact return 200.
- Invalid news paths return 404.
- Fonts and R2 images load without CORS or remote-pattern errors.
- Merch cards open the verified retailer URLs.
- Canonical and Open Graph URLs belong to the correct Vercel project.
- Sitemap and robots endpoints use the correct host.
- The v1 deployment cannot accidentally render v3 branding, and vice versa.
- Mobile navigation works.
- No hydration or browser-console errors occur.
- No contact-form submission falsely reports successful delivery.
- Performance is acceptable for image-heavy hero sections.
- Placeholder imagery, if unavoidable, is clearly reported as provisional.

Produce a comparison handoff containing:

- v1 URL
- v3 URL
- Deployment commit SHA
- Vercel project names
- Asset status: R2-final or placeholder-provisional
- Content verification date
- Known follow-ups
- Confirmation that no direction has been selected

---

## 14. Structure the subsequent automated execution

Use two parallel YOLO briefs after the shared bootstrap commit:

### Brief A: NPRacing v1

- Branch/worktree: `feature/npracing-v1`
- Observability run ID: `npracing-v1`
- Allowed primary edit scope: `sites/npracing-v1/**`
- Design target: Grid Box
- Required gates: content validation, lint, type-check, webpack build, route smoke tests

### Brief B: NPRacing v3

- Branch/worktree: `feature/npracing-v3`
- Observability run ID: `npracing-v3`
- Allowed primary edit scope: `sites/npracing-v3/**`
- Design target: Number 51
- Required gates: content validation, lint, type-check, webpack build, route smoke tests

Use a short integration brief or manually supervised integration phase for:

- `pnpm-lock.yaml`
- `turbo.json`
- Root type-check
- Combined builds
- Pull requests and promotion
- Vercel project verification

This is preferable to one large brief with internal parallel phases because separate worktrees provide stronger file isolation, clearer observability, independent recovery, and independent completion status.

---

## 15. Explicit agent versus human responsibility

### Agent-executable

- Repository inspection
- Bootstrap and implementation
- Branch and worktree creation, subject to normal repository permissions
- MDX schema and content work
- Source verification where public web access is available
- Theme and component implementation
- Local validation, lint, type-check, and builds
- R2 upload only if credentials and approved tooling are already available
- Pull-request preparation
- Vercel CLI linking and deployment inspection if authenticated
- Post-deployment technical checks

### Human-required or potentially human-required

- Providing or authorizing R2 credentials if unavailable
- Confirming any private or ambiguous team facts
- Approving provisional merch prices or article copy when sources cannot be verified
- Approving GitHub/Vercel access
- Importing the Git repository into two Vercel projects through the dashboard
- Selecting the correct Vercel team
- Setting project root directories and environment values
- Approving promotion to `staging` and `main`
- Any later DNS or custom-domain work
- Resend credentials and final contact-delivery requirements

---

## Risks and Trade-offs

1. **R2 credentials may block final visual fidelity.** Placeholder deployments can prove routing and architecture but should not be presented as final design-comparison URLs. The asset manifest and upload follow-up must remain a release blocker for final client review.

2. **Retailer data is volatile.** Prices, availability, URLs, and imagery may change after capture. Recording verification dates makes staleness visible but does not eliminate the need for rechecking before client presentation.

3. **Third-party article rights require care.** News content should summarize or use approved team copy and link to sources, rather than reproducing copyrighted articles wholesale.

4. **Self-containment creates deliberate duplication.** Schemas, content, tokens, and loaders will exist twice. This is acceptable because the designs may diverge or one may be removed after selection. A runtime shared package would conflict with the current site architecture and increase coupling.

5. **Bootstrap and lockfile changes can undermine parallelism if not coordinated.** Creating both skeletons in one shared commit before opening worktrees minimizes this risk. Root config edits should be deferred to integration.

6. **Vercel CLI authentication is not equivalent to a GitHub-linked project setup.** The dashboard import flow is the safest documented route. The available MCP upload deploy must not be mistaken for the final CI/CD configuration.

7. **Production URLs depend on branch promotion.** Importing before the site directories reach the configured production branch may fail or produce an inconsistent project. Normal promotion should complete before final production deployment.

8. **Decorative motion can harm accessibility and performance.** Marquees, large numerals, texture, and cinematic imagery must be progressively enhanced, reduced for user motion preferences, and tested on mobile hardware.

9. **The contact form is intentionally incomplete.** It must remain honest and non-sending until Resend, server-side validation, rate limiting, spam protection, and privacy handling are implemented in a later pass.

10. **Two production-quality builds increase review surface.** Functional behavior and content should remain equivalent, while visual composition remains intentionally different. A side-by-side parity checklist is necessary to prevent one direction from appearing stronger merely because it has more complete content or fewer defects.
