# Local Business Platform - Architecture Overview

**Scope:** All sites in local-business-platform monorepo

---

## Overview

The Local Business Platform is a white-label website generation system for local service businesses (plumbers, scaffolders, builders, roofers, gardeners) targeting South East England. It uses a monorepo architecture with Turborepo + pnpm workspaces.

For detailed explanations of how each system works, see:

| Deep Dive                                                   | What It Teaches                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| [How Dynamic Routing Works](how-dynamic-routing-works.md)   | How MDX files become pages via `[slug]` routes and `generateStaticParams()` |
| [How the Theme System Works](how-theme-system-works.md)     | How `theme.config.ts` → CSS variables → Tailwind classes                    |
| [How the Build Pipeline Works](how-build-pipeline-works.md) | How Turborepo orchestrates packages and sites                               |
| [How Site Creation Works](how-site-creation-works.md)       | How new business clients become deployed websites                           |

## Repository Structure

```
local-business-platform/
├── sites/                          # Client websites
│   ├── colossus-reference/         # Reference implementation (scaffolding)
│   ├── smiths-electrical-cambridge/# Demo site (electrical)
│   └── base-template/              # Gold-standard template for new sites
├── packages/
│   ├── core-components/            # Shared UI components (@platform/core-components)
│   ├── theme-system/               # Theming engine (@platform/theme-system)
│   └── intake-system/              # Customer intake automation (@platform/intake-system)
├── tools/                          # Site creation & deployment CLI tools
├── docs/                           # Documentation
│   ├── architecture/               # How the systems work
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

`@platform/core-components` provides reusable UI components (heroes, service cards, footers, CTAs, analytics) that work with any site's theme. It exports raw TypeScript — no build step — and sites compile it directly.

### 5. Theme System (White-Labeling)

`@platform/theme-system` transforms per-site config into CSS custom properties and Tailwind utilities. Each site defines a `theme.config.ts` with brand colors; the plugin generates `:root` variables and classes like `bg-brand-primary`. Change the config, rebuild, and the entire site re-brands.

### 6. Intake System (Site Generation)

`@platform/intake-system` automates new client onboarding: collects business data via chat/forms, validates against Zod schemas, applies industry templates, extracts brand colors, and produces a project file that drives automated site generation.

## Technology Stack

| Category      | Technology                                  |
| ------------- | ------------------------------------------- |
| Framework     | Next.js (App Router, Turbopack)             |
| Language      | TypeScript (strict mode)                    |
| Styling       | Tailwind CSS + Theme System (CSS variables) |
| Content       | MDX with gray-matter                        |
| Testing       | Vitest + Playwright                         |
| Deployment    | Vercel                                      |
| Image Storage | Cloudflare R2                               |
| Rate Limiting | Supabase                                    |
| Monitoring    | NewRelic APM                                |
| Analytics     | GA4 (consent-managed)                       |
| Backend       | Supabase                                    |

## Content Flow

```
MDX File → gray-matter → Frontmatter Data → React Components → Rendered Page
```

1. MDX file contains YAML frontmatter (hero config, FAQs, keywords, etc.) and markdown body
2. `lib/content.ts` reads the file, `gray-matter` splits frontmatter from content
3. Frontmatter data populates React component props
4. MDX body rendered via `next-mdx-remote` with custom components
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

| Stage              | Checks                                                    |
| ------------------ | --------------------------------------------------------- |
| Pre-commit (Husky) | lint-staged (Prettier), MDX content validation            |
| Pre-push (Husky)   | TypeScript check, production build                        |
| CI (all branches)  | ESLint, TypeScript, content validation, unit tests, build |
| CI (staging/main)  | Full E2E test suite (Playwright)                          |

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

| Standard                                 | Description                                  |
| ---------------------------------------- | -------------------------------------------- |
| [Styling](../standards/styling.md)       | Tailwind CSS, theme tokens                   |
| [Components](../standards/components.md) | Component architecture, TypeScript props     |
| [Content](../standards/content.md)       | MDX-only architecture, frontmatter structure |
| [SEO](../standards/seo.md)               | Meta data, keywords, local SEO               |
| [Images](../standards/images.md)         | R2 storage, optimization, naming             |
| [Schema](../standards/schema.md)         | JSON-LD structured data                      |
| [Testing](../standards/testing.md)       | Unit tests, E2E tests, coverage              |
| [Security](../standards/security.md)     | Rate limiting, API security, GDPR            |
| [Analytics](../standards/analytics.md)   | Consent management, GA4                      |
| [Deployment](../standards/deployment.md) | CI/CD, monitoring, rollback                  |
| [Quality](../standards/quality.md)       | Quality gates, checklists                    |

| Guide                                             | Purpose                    |
| ------------------------------------------------- | -------------------------- |
| [Adding a New Site](../guides/adding-new-site.md) | Create a new client site   |
| [Theming](../guides/theming.md)                   | Theme system configuration |
| [Adding a Location](../guides/adding-location.md) | Add location MDX file      |
| [Adding a Service](../guides/adding-service.md)   | Add service MDX file       |
| [Deploying a Site](../guides/deploying-site.md)   | Deployment procedures      |
| [Git Workflow](../guides/git-workflow.md)         | Branch workflow            |
| [GitHub Actions](../guides/github-actions.md)     | CI/CD workflow guide       |

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - AI agent instructions and architectural briefing
- [content-validation.md](./content-validation.md) - Validation schemas
