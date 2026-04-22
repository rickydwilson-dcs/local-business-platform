# Local Business Platform - Architecture Overview

**Scope:** All sites in local-business-platform monorepo

---

## Overview

The Local Business Platform is a white-label website generation system for local service businesses (plumbers, scaffolders, builders, roofers, gardeners) targeting South East England. It uses a monorepo architecture with Turborepo + pnpm workspaces.

For detailed explanations of how each system works, see:

| Deep Dive                                                                   | What It Teaches                                                             |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [How Dynamic Routing Works](how-dynamic-routing-works.md)                   | How MDX files become pages via `[slug]` routes and `generateStaticParams()` |
| [How the Theme System Works](how-theme-system-works.md)                     | How `theme.config.ts` → CSS variables → Tailwind classes                    |
| [How the Build Pipeline Works](how-build-pipeline-works.md)                 | How Turborepo orchestrates packages and sites                               |
| [How Site Creation Works](how-site-creation-works.md)                       | How new business clients become deployed websites                           |
| [How the Ingestion Pipeline Works](how-ingestion-pipeline-works.md)         | How screenshots become analysed components and theme packages               |
| [How the Stitch Design Pipeline Works](how-stitch-design-pipeline-works.md) | How Stitch AI designs become tokens, theme packages, and test sites         |
| [Clone Package Format](../pipeline/CLONE_PACKAGE_FORMAT.md)                 | The CPF intermediate format used by the clone-to-scaffold pipeline          |

## Repository Structure

```
local-business-platform/
├── sites/                          # Client websites
│   ├── base-template/              # Gold-standard template for new sites
│   ├── colossus-scaffolding/       # Reference implementation (scaffolding)
│   ├── dcs/                        # Digital Consulting Services (polaris theme)
│   ├── dj-fox-electrical/          # Production site (electrical, composition-based)
│   ├── mad-graphics/               # Production site (vehicle graphics & print, cygnus theme)
│   ├── showcase/                   # Internal component/theme showcase
│   ├── poc-composition-test/       # Composition system PoC + UI library (/ui-library route)
│   ├── designlab-test/             # Pipeline test site (designlab theme)
│   ├── navagarden-test/            # Pipeline test site (navagarden theme)
│   └── [theme-name]-test/          # Temporary test sites (created by pipeline, removed after review)
├── packages/
│   ├── core-components/            # Shared UI components (@platform/core-components)
│   ├── component-composition/      # Config-driven page composition engine
│   ├── theme-system/               # Theming engine (@platform/theme-system)
│   ├── themes/                     # Named theme CSS packages (cygnus, designlab, navagarden, orion, solaris, vega)
│   ├── playwright-shared/          # Cross-site smoke suite for the regression watchdog
│   └── intake-system/              # Customer intake automation (@platform/intake-system)
├── tools/                          # Site creation & deployment CLI tools
├── docs/                           # Documentation
│   ├── architecture/               # How the systems work
│   ├── pipeline/                   # Pipeline-specific specs (CPF, etc.)
│   ├── standards/                  # How to do things right
│   └── guides/                     # How to do common tasks
└── .github/workflows/              # CI/CD workflows
```

## Core Architecture Decisions

### 1. Monorepo with Turborepo

- **Why:** Shared components, consistent tooling, atomic deployments
- **Pattern:** Root as Coordinator (root coordinates, no application code)
- **Package Manager:** pnpm with workspaces
- **Build order:** Turborepo builds packages first (they're dependencies), then sites in parallel

### 2. MDX-Only Content

All content is managed exclusively through MDX files with YAML frontmatter. There are no centralized TypeScript data structures. This means content editors never touch code — they create/edit MDX files and the dynamic routing picks them up automatically.

```
content/
├── services/      # Service pages (e.g., emergency-repair.mdx)
├── locations/     # Location pages (e.g., cambridge.mdx)
├── blog/          # Blog posts
├── projects/      # Project case studies
└── testimonials/  # Customer testimonials
```

**Key Principle:** MDX is the single source of truth. Never create `lib/locations.ts` or `app/services/specific-service/page.tsx`.

### 3. Dynamic Routing

All content pages use Next.js dynamic routes (`[slug]`) with `generateStaticParams()` for static generation:

```
app/services/[slug]/page.tsx    # Reads from content/services/
app/locations/[slug]/page.tsx   # Reads from content/locations/
app/blog/[slug]/page.tsx        # Reads from content/blog/
app/projects/[slug]/page.tsx    # Reads from content/projects/
app/reviews/page.tsx            # Reads from content/testimonials/
```

Drop a new MDX file in the right directory, build, and a new page appears. No code changes needed.

### 4. Shared Component Library

`@platform/core-components` provides reusable UI components (heroes, service cards, footers, CTAs, analytics) and shared utility factories that work with any site's theme. It exports raw TypeScript — no build step — and sites compile it directly.

**Factory pattern for shared utilities:** Core-components exports factory functions (`createContentUtils`, `createSchemaGenerators`, `createMdxLoader`, `createSiteUtils`, `createContactInfo`, `createContactHandler`) that accept site-specific configuration. Each site's `lib/` directory contains thin shims (5-10 lines) that call these factories and re-export configured utilities, preserving `@/lib/*` import paths. For example, `lib/content.ts` in each site calls `createContentUtils({ getLocationSlugs, serviceSortFn })` and re-exports `getServices`, `getLocations`, etc. This eliminates code duplication while allowing per-site customization (e.g., colossus's custom service sorting).

### 5. Theme System (White-Labeling)

`@platform/theme-system` transforms per-site config into CSS custom properties and Tailwind utilities. Each site defines a `theme.config.ts` with brand colors; the plugin generates `:root` variables and classes like `bg-brand-primary`. Change the config, rebuild, and the entire site re-brands.

**Named Themes** — `packages/themes/` contains pre-built CSS utility packages for each visual identity. `orion` (dark header, full-bleed hero, red accent), `vega` (light header, card grid, navy/blue), `cygnus` (dark mode, Signal Orange, Craft Green), `solaris` (soft blue-white, sky blue + chartreuse, geometric shapes), `designlab`, and `navagarden` are the available identities. Each site's `globals.css` imports its theme package, and `theme.config.ts` specifies a `componentRegistry` that selects the right component variants for that identity. `ThemeProvider` from `@platform/core-components` makes the registry available at runtime to client components. Themes also export **page layout templates** from `packages/themes/[name]/pages/` — props-based Server Components that own the visual layout of each page type; sites' `page.tsx` files are thin wrappers that fetch data, call `generateMetadata()`/`generateStaticParams()`, and render the theme template.

### 6. Intake System (Site Generation)

`@platform/intake-system` automates new client onboarding: collects business data via chat/forms, validates against Zod schemas, applies industry templates, extracts brand colors, and produces a project file that drives automated site generation.

### 7. Rate Limiting (Multi-Tenant)

All sites share a single Supabase database for rate limiting, with per-site isolation via `site_slug`. This architecture:

- **Cost-efficient:** One database serves all clients (no per-site infrastructure)
- **Isolated:** Each site has independent rate limit counters (same IP limited on Site A can still submit on Site B)
- **Automatic:** New sites inherit rate limiting by simply setting the `slug` field in `site.config.ts`
- **Secure:** Fail-closed behavior in production if site slug is missing

The implementation uses database-level UNIQUE constraints on `(identifier, endpoint, site_slug, window_start)` to enforce true isolation, with runtime validation and structured logging for observability.

## Technology Stack

| Category      | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js (App Router, Turbopack)                |
| Language      | TypeScript (strict mode)                       |
| Styling       | Tailwind CSS + Theme System (CSS variables)    |
| Content       | MDX with gray-matter                           |
| Testing       | Vitest + Playwright                            |
| Deployment    | Vercel                                         |
| Image Storage | Cloudflare R2                                  |
| Rate Limiting | Supabase (shared database, per-site isolation) |
| Monitoring    | NewRelic APM + Langfuse (AI pipeline tracing)  |
| Analytics     | GA4 (consent-managed)                          |
| Backend       | Supabase                                       |

## Content Flow

```
MDX File → gray-matter → Frontmatter Data → React Components → Rendered Page
```

1. MDX file contains YAML frontmatter (hero config, FAQs, keywords, etc.) and markdown body
2. Site's `lib/content.ts` shim calls `createContentUtils()` from core-components; `gray-matter` splits frontmatter from content
3. Frontmatter data populates React component props
4. MDX body rendered via `createMdxLoader()` with injected custom components
5. `generateMetadata()` creates SEO tags from frontmatter
6. Static HTML output at build time

## Content Types

Five content types, all following the same MDX-only + dynamic routing pattern:

| Content Type | Directory               | Route               | Notes                                |
| ------------ | ----------------------- | ------------------- | ------------------------------------ |
| Services     | `content/services/`     | `/services/[slug]`  | 3-15 FAQs required, hero config      |
| Locations    | `content/locations/`    | `/locations/[slug]` | Service area coverage                |
| Blog         | `content/blog/`         | `/blog/[slug]`      | Categories, author, tags, RSS        |
| Projects     | `content/projects/`     | `/projects/[slug]`  | Case studies with images, outcomes   |
| Testimonials | `content/testimonials/` | `/reviews`          | Ratings, platform source, Schema.org |

## Quality Gates

| Stage                              | Checks                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Pre-commit (Husky)                 | lint-staged (Prettier), MDX content validation                              |
| Pre-push (Husky)                   | TypeScript check only (~3s)                                                 |
| CI (all branches)                  | ESLint, TypeScript, content validation, unit tests, build                   |
| CI (staging/main)                  | Full E2E test suite (Playwright)                                            |
| Post-deploy (push to staging/main) | Regression watchdog: cross-site smoke suite + Claude auto-triage on failure |

## Architecture Violations

These patterns indicate architecture violations:

```
lib/locations.ts           # Centralized data file (use MDX instead)
lib/services.ts            # Centralized data file
app/locations/brighton/    # Static page file (use [slug] route instead)
app/services/scaffolding/  # Static page file
bg-[#005A9E]               # Hardcoded color (use theme tokens instead)
```

## Standards & Guides

| Standard                                       | Description                                  |
| ---------------------------------------------- | -------------------------------------------- |
| [Styling](../standards/styling.md)             | Tailwind CSS, theme tokens                   |
| [Components](../standards/components.md)       | Component architecture, TypeScript props     |
| [Content](../standards/content.md)             | MDX-only architecture, frontmatter structure |
| [SEO](../standards/seo.md)                     | Meta data, keywords, local SEO               |
| [Images](../standards/images.md)               | R2 storage, optimization, naming             |
| [Schema](../standards/schema.md)               | JSON-LD structured data                      |
| [Testing](../standards/testing.md)             | Unit tests, E2E tests, coverage              |
| [Security](../standards/security.md)           | Rate limiting, API security, GDPR            |
| [Analytics](../standards/analytics.md)         | Consent management, GA4                      |
| [Deployment](../standards/deployment.md)       | CI/CD, monitoring, rollback                  |
| [Quality](../standards/quality.md)             | Quality gates, checklists                    |
| [Documentation](../standards/documentation.md) | Documentation maintenance guidelines         |

| Guide                                                           | Purpose                                      |
| --------------------------------------------------------------- | -------------------------------------------- |
| [Adding a New Site](../guides/adding-new-site.md)               | Create a new client site                     |
| [Creating a New Theme](../guides/creating-new-theme.md)         | Create a theme via ingest or Stitch pipeline |
| [Theming](../guides/theming.md)                                 | Theme system configuration                   |
| [Adding a Service](../guides/adding-service.md)                 | Add service MDX file                         |
| [Adding a Location](../guides/adding-location.md)               | Add location MDX file                        |
| [Adding a Content Section](../guides/adding-content-section.md) | Add new MDX content type with dynamic route  |
| [Deploying a Site](../guides/deploying-site.md)                 | Deployment procedures                        |
| [Git Workflow](../guides/git-workflow.md)                       | Branch workflow                              |
| [GitHub Actions](../guides/github-actions.md)                   | CI/CD workflow guide                         |
| [Monitoring Setup](../guides/monitoring-setup.md)               | NewRelic and Vercel monitoring setup         |
| [Orchestration Patterns](../guides/orchestration-patterns.md)   | Skill patterns: sequential, parallel, hybrid |
| [Registry Setup](../guides/registry-setup.md)                   | Supabase site registry and monitoring setup  |
| [End-to-End Workflow](../guides/end-to-end-workflow.md)         | Full site creation workflow                  |
| [Component Versioning](../guides/component-versioning.md)       | Versioning shared components                 |

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - AI agent instructions and architectural briefing
- [content-validation.md](./content-validation.md) - Validation schemas
- [monitoring-dashboard.md](./monitoring-dashboard.md) - Dashboard design for site registry and monitoring
