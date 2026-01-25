# Local Business Platform - Architecture Overview

**Version:** 2.2.0
**Last Updated:** 2025-01-25
**Scope:** All sites in local-business-platform monorepo

---

## Overview

The Local Business Platform is a white-label website generation system for local service businesses (plumbers, scaffolders, builders, roofers, gardeners) targeting South East England. It uses a monorepo architecture with Turborepo + pnpm workspaces.

## Repository Structure

```
local-business-platform/
├── sites/                          # Client websites
│   ├── colossus-reference/         # Reference implementation (77 pages)
│   ├── joes-plumbing-canterbury/   # Demo plumber site (12 pages)
│   └── base-template/              # Gold-standard template for new sites
├── packages/
│   ├── core-components/            # Shared component library (@platform/core-components)
│   └── theme-system/               # Centralized theming (@platform/theme-system)
├── tools/                          # Deployment & site creation CLI tools
├── docs/                           # Documentation
│   ├── standards/                  # Standards reference documents
│   ├── guides/                     # How-to guides
│   └── architecture/               # Architecture documentation
└── .github/workflows/              # CI/CD workflows
```

## Core Architecture Decisions

### 1. Monorepo with Turborepo

- **Why:** Shared components, consistent tooling, atomic deployments
- **Pattern:** Option B - Root as Coordinator (root coordinates, no application code)
- **Package Manager:** pnpm with workspaces

### 2. Unified MDX-Only Content

All content is managed exclusively through MDX files with comprehensive frontmatter. There are no centralized TypeScript data structures.

```
content/
├── services/      # 25 service MDX files
├── locations/     # 37 location MDX files
├── blog/          # Blog posts (Week 6)
├── projects/      # Project case studies (Week 6)
└── testimonials/  # Customer testimonials (Week 6)
```

**Key Principle:** MDX is the single source of truth. No centralized data files like `lib/locations.ts`.

### 3. Dynamic Routing

All content pages use dynamic routing that reads MDX files directly:

```
app/services/[slug]/page.tsx    # Reads from content/services/
app/locations/[slug]/page.tsx   # Reads from content/locations/
app/blog/[slug]/page.tsx        # Reads from content/blog/ (Week 6)
app/projects/[slug]/page.tsx    # Reads from content/projects/ (Week 6)
app/reviews/page.tsx            # Reads from content/testimonials/ (Week 6)
```

### 4. Shared Component Library

`@platform/core-components` provides reusable UI components:

- Hero variants (HeroV1, HeroV2, HeroV3)
- Service cards
- Contact forms
- Layout components

### 5. Centralized Theme System

`@platform/theme-system` provides centralized theming with CSS custom properties:

- **Design tokens** - Colors, spacing, typography, shadows defined in TypeScript
- **CSS variables** - Generated automatically and injected into Tailwind
- **Tailwind plugin** - `createThemePlugin()` integrates theme into Tailwind config
- **WCAG validation** - CLI tool checks color contrast ratios for accessibility
- **Per-site configuration** - Each site has `theme.config.ts` for brand customization

```typescript
// theme.config.ts - Site-specific theming
import type { ThemeConfig } from "@platform/theme-system";

export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: "#005A9E",
      primaryHover: "#004d87",
      secondary: "#0066b5",
      accent: "#f59e0b",
    },
  },
};
```

See [Theming Guide](../guides/theming.md) for complete documentation.

## Technology Stack

| Category      | Technology                                  |
| ------------- | ------------------------------------------- |
| Framework     | Next.js 16.0.7 (Turbopack)                  |
| Language      | TypeScript (strict mode)                    |
| Styling       | Tailwind CSS + Theme System (CSS variables) |
| Content       | MDX with gray-matter                        |
| Testing       | Vitest + Playwright                         |
| Deployment    | Vercel                                      |
| Image Storage | Cloudflare R2                               |
| Rate Limiting | Upstash Redis                               |
| Monitoring    | NewRelic APM                                |
| Analytics     | GA4 (consent-managed)                       |

## Content Flow

```
MDX File → gray-matter → Frontmatter Data → React Components → Rendered Page
```

1. MDX file contains comprehensive frontmatter (hero, specialists, FAQs, etc.)
2. Dynamic route reads MDX file using `gray-matter`
3. Frontmatter data passed to React components
4. Components render with Tailwind styling

## Key Patterns

### Content Reading

```typescript
import fs from "fs/promises";
import matter from "gray-matter";

const filePath = path.join(process.cwd(), "content", "services", `${slug}.mdx`);
const fileContent = await fs.readFile(filePath, "utf-8");
const { data, content } = matter(fileContent);
```

### Static Generation

```typescript
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content", "services");
  const files = await fs.readdir(contentDir);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(".mdx", "") }));
}
```

## Quality Gates

| Stage             | Checks                                    |
| ----------------- | ----------------------------------------- |
| Pre-commit        | ESLint, Prettier, Content validation      |
| Pre-push          | TypeScript, Production build, Smoke tests |
| CI (develop)      | All checks + Smoke E2E (7 tests)          |
| CI (staging/main) | All checks + Full E2E (58 tests)          |

## Standards Reference

Detailed standards are documented in separate focused files:

| Standard                                 | Description                                  |
| ---------------------------------------- | -------------------------------------------- |
| [Styling](../standards/styling.md)       | Tailwind CSS, maintainable classes           |
| [Components](../standards/components.md) | Component architecture, TypeScript props     |
| [Content](../standards/content.md)       | MDX-only architecture, frontmatter structure |
| [SEO](../standards/seo.md)               | Meta data, keywords, local SEO               |
| [Images](../standards/images.md)         | R2 storage, optimization, naming             |
| [Schema](../standards/schema.md)         | JSON-LD markup requirements                  |
| [Testing](../standards/testing.md)       | Unit tests, E2E tests, coverage              |
| [Security](../standards/security.md)     | Rate limiting, API security, GDPR            |
| [Analytics](../standards/analytics.md)   | Consent management, GA4                      |
| [Deployment](../standards/deployment.md) | CI/CD, monitoring, rollback                  |
| [Quality](../standards/quality.md)       | Quality gates, checklists                    |

## How-To Guides

Step-by-step procedures for common tasks:

| Guide                                             | Purpose                    |
| ------------------------------------------------- | -------------------------- |
| [Adding a New Site](../guides/adding-new-site.md) | Create a new client site   |
| [Theming](../guides/theming.md)                   | Theme system configuration |
| [Adding a Location](../guides/adding-location.md) | Add location MDX file      |
| [Adding a Service](../guides/adding-service.md)   | Add service MDX file       |
| [Deploying a Site](../guides/deploying-site.md)   | Deployment procedures      |
| [Monitoring Setup](../guides/monitoring-setup.md) | NewRelic configuration     |
| [GitHub Actions](../guides/github-actions.md)     | CI/CD workflow guide       |
| [Git Workflow](../guides/git-workflow.md)         | Branch workflow            |

## Architecture Violations

These patterns indicate architecture violations:

```
❌ lib/locations.ts           # Centralized data (deleted)
❌ lib/services.ts            # Centralized data
❌ app/locations/brighton/    # Static page file
❌ app/services/scaffolding/  # Static page file
```

**Correct Pattern:** All content in MDX files, dynamic routing only.

## Build Performance

| Metric       | Target                  |
| ------------ | ----------------------- |
| Fresh build  | < 60s                   |
| Cached build | < 1s                    |
| Site pages   | 86 (colossus-reference) |

## Content Types (Week 6+)

The platform now supports five content types, all following MDX-only architecture:

| Content Type | Directory               | Schema                         | Page Routes                     |
| ------------ | ----------------------- | ------------------------------ | ------------------------------- |
| Services     | `content/services/`     | `ServiceFrontmatterSchema`     | `/services/[slug]`              |
| Locations    | `content/locations/`    | `LocationFrontmatterSchema`    | `/locations/[slug]`             |
| Blog         | `content/blog/`         | `BlogFrontmatterSchema`        | `/blog`, `/blog/[slug]`         |
| Projects     | `content/projects/`     | `ProjectFrontmatterSchema`     | `/projects`, `/projects/[slug]` |
| Testimonials | `content/testimonials/` | `TestimonialFrontmatterSchema` | `/reviews`                      |

### Blog Content Type

Blog posts support:

- Author information (name, role, avatar)
- Categories: `industry-tips`, `how-to-guide`, `case-study`, `seasonal`, `news`
- Tags for cross-referencing
- Related services and locations
- RSS feed at `/blog/rss.xml`

### Projects Content Type

Project case studies support:

- Project type: `residential`, `commercial`, `industrial`, `heritage`
- Category: `heritage`, `new-build`, `renovation`, `maintenance`, `emergency`
- Multiple images with captions
- Client testimonial with rating
- Scope details (building type, storeys, challenges)
- Results list

### Testimonials Content Type

Customer testimonials support:

- Rating (1-5 stars)
- Platform source: `internal`, `google`, `trustpilot`, `reviews.io`
- Verified badge
- Related service/location linking
- Aggregate rating calculation for Schema.org

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - AI agent instructions
- [CONTENT_VALIDATION.md](./CONTENT_VALIDATION.md) - Validation schemas
- [WHITE_LABEL_PLATFORM_DESIGN.md](../../WHITE_LABEL_PLATFORM_DESIGN.md) - Business plan

---

**Maintained By:** Digital Consulting Services
