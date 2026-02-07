# Documentation

Navigation index for the Local Business Platform docs.

---

## Architecture

How the platform's core systems work.

| Document                                                                 | Teaches                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------- |
| [Architecture Overview](architecture/architecture.md)                    | High-level system design and repository structure |
| [How Dynamic Routing Works](architecture/how-dynamic-routing-works.md)   | MDX files become pages via `[slug]` routes        |
| [How the Theme System Works](architecture/how-theme-system-works.md)     | Config to CSS variables to Tailwind classes       |
| [How the Build Pipeline Works](architecture/how-build-pipeline-works.md) | Turborepo orchestration, packages, caching        |
| [How Site Creation Works](architecture/how-site-creation-works.md)       | Intake to project file to deployed site           |
| [Content Validation](architecture/content-validation.md)                 | Zod schemas for MDX frontmatter                   |
| [Monitoring Dashboard](architecture/monitoring-dashboard.md)             | Dashboard design and implementation plan          |

## Standards

Rules and requirements for how things should be done.

| Standard                                    | Covers                                       |
| ------------------------------------------- | -------------------------------------------- |
| [Styling](standards/styling.md)             | Tailwind CSS, theme tokens                   |
| [Components](standards/components.md)       | Component architecture, TypeScript props     |
| [Content](standards/content.md)             | MDX-only architecture, frontmatter structure |
| [SEO](standards/seo.md)                     | Meta data, keywords, local SEO               |
| [Images](standards/images.md)               | R2 storage, optimisation, naming             |
| [Schema](standards/schema.md)               | JSON-LD structured data                      |
| [Testing](standards/testing.md)             | Unit tests, E2E tests                        |
| [Security](standards/security.md)           | Rate limiting, API security, GDPR            |
| [Analytics](standards/analytics.md)         | Consent management, GA4                      |
| [Deployment](standards/deployment.md)       | CI/CD, monitoring, rollback                  |
| [Quality](standards/quality.md)             | Quality gates, checklists                    |
| [Documentation](standards/documentation.md) | Doc standards, naming, templates             |

## Guides

Step-by-step instructions for common tasks.

| Guide                                                        | Purpose                                       |
| ------------------------------------------------------------ | --------------------------------------------- |
| [Adding a New Site](guides/adding-new-site.md)               | Create a new client site from base-template   |
| [Adding a Service](guides/adding-service.md)                 | Add service MDX content                       |
| [Adding a Location](guides/adding-location.md)               | Add location MDX content                      |
| [Adding a Content Section](guides/adding-content-section.md) | Add a new content type (blog, projects, etc.) |
| [Theming](guides/theming.md)                                 | Configure site theme and brand colours        |
| [Component Versioning](guides/component-versioning.md)       | Changesets workflow for core-components       |
| [Git Workflow](guides/git-workflow.md)                       | Branch workflow (develop to staging to main)  |
| [GitHub Actions](guides/github-actions.md)                   | CI/CD pipeline configuration                  |
| [Deploying a Site](guides/deploying-site.md)                 | Deployment procedures                         |
| [Monitoring Setup](guides/monitoring-setup.md)               | NewRelic configuration                        |
| [Registry Setup](guides/registry-setup.md)                   | Component registry configuration              |
| [End-to-End Workflow](guides/end-to-end-workflow.md)         | Complete workflow from intake to deployment   |

---

## Quick Start Paths

**New to the project?**

1. [Root README](../README.md) — project overview
2. [Architecture Overview](architecture/architecture.md) — system design
3. [Content Standards](standards/content.md) — MDX architecture

**Building a new site?**

1. [Adding a New Site](guides/adding-new-site.md)
2. [Adding Services](guides/adding-service.md)
3. [Adding Locations](guides/adding-location.md)

**Deploying?**

1. [Git Workflow](guides/git-workflow.md)
2. [Deploying a Site](guides/deploying-site.md)
