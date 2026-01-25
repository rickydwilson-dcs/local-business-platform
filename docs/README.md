# Local Business Platform - Documentation

Complete documentation for the white-label website platform for local service businesses.

**Last Updated:** 2025-01-25

---

## Quick Navigation

### Standards (Rules & Requirements)

Focused reference documents defining how things should be done.

| Standard                              | Description                                  |
| ------------------------------------- | -------------------------------------------- |
| [Styling](standards/styling.md)       | Tailwind CSS, maintainable classes           |
| [Components](standards/components.md) | Component architecture, TypeScript props     |
| [Content](standards/content.md)       | MDX-only architecture, frontmatter structure |
| [SEO](standards/seo.md)               | Meta data, keywords, local SEO               |
| [Images](standards/images.md)         | R2 storage, optimization, naming             |
| [Schema](standards/schema.md)         | JSON-LD markup requirements                  |
| [Testing](standards/testing.md)       | Unit tests, E2E tests, coverage              |
| [Security](standards/security.md)     | Rate limiting, API security, GDPR            |
| [Analytics](standards/analytics.md)   | Consent management, GA4                      |
| [Deployment](standards/deployment.md) | CI/CD, monitoring, rollback                  |
| [Quality](standards/quality.md)       | Quality gates, checklists                    |

### Guides (How-To Procedures)

Step-by-step instructions for common tasks.

| Guide                                          | Purpose                  | Time                     |
| ---------------------------------------------- | ------------------------ | ------------------------ |
| [Adding a New Site](guides/adding-new-site.md) | Create a new client site | 30-60 min                |
| [Adding a Location](guides/adding-location.md) | Add location MDX file    | 2-5 min (AI) / 15-20 min |
| [Adding a Service](guides/adding-service.md)   | Add service MDX file     | 2-5 min (AI) / 15-20 min |
| [Deploying a Site](guides/deploying-site.md)   | Deployment procedures    | 10-15 min                |
| [Monitoring Setup](guides/monitoring-setup.md) | NewRelic configuration   | 20-30 min                |
| [GitHub Actions](guides/github-actions.md)     | CI/CD workflow guide     | 15-20 min                |
| [Git Workflow](guides/git-workflow.md)         | Branch workflow          | 5-10 min                 |

### AI Content Generation (NEW)

Generate service and location pages automatically using Claude or Gemini AI:

```bash
pnpm content:generate:services --site <site-name> --context <context.json>
pnpm content:generate:locations --site <site-name> --context <context.json>
```

See [Adding a Service](guides/adding-service.md) and [Adding a Location](guides/adding-location.md) for details.

### Architecture

System design and patterns.

| Document                                                 | Description                               |
| -------------------------------------------------------- | ----------------------------------------- |
| [Architecture Overview](architecture/ARCHITECTURE.md)    | High-level architecture, technology stack |
| [Content Validation](architecture/CONTENT_VALIDATION.md) | Zod validation schemas                    |

### Progress Reports

Weekly completion reports.

| Week                                     | Status      | Focus                        |
| ---------------------------------------- | ----------- | ---------------------------- |
| [Week 1](progress/WEEK_1_COMPLETE.md)    | Complete    | Monorepo foundation          |
| [Week 2](progress/WEEK_2_COMPLETE.md)    | Complete    | Component versioning         |
| [Week 3](progress/WEEK_3_COMPLETE.md)    | Complete    | Testing infrastructure       |
| [Week 4](progress/WEEK_4_COMPLETE.md)    | Complete    | Deployment & monitoring      |
| [Week 5](progress/WEEK_5_COMPLETE.md)    | Complete    | AI content generation        |
| [Week 6](progress/WEEK_6_IN_PROGRESS.md) | In Progress | Blog, projects, testimonials |

---

## Documentation Structure

```
docs/
├── standards/           # Standards reference documents
│   ├── styling.md      # Tailwind, maintainable classes
│   ├── components.md   # Component architecture
│   ├── content.md      # MDX-only architecture
│   ├── seo.md          # SEO requirements
│   ├── images.md       # Image optimization, R2
│   ├── schema.md       # JSON-LD markup
│   ├── testing.md      # Testing standards
│   ├── security.md     # Security, rate limiting
│   ├── analytics.md    # Consent, GA4
│   ├── deployment.md   # CI/CD, monitoring
│   └── quality.md      # Quality gates
│
├── guides/              # How-to guides
│   ├── adding-new-site.md
│   ├── adding-location.md
│   ├── adding-service.md
│   ├── deploying-site.md
│   ├── monitoring-setup.md
│   ├── github-actions.md
│   └── git-workflow.md
│
├── architecture/        # System design
│   ├── ARCHITECTURE.md  # High-level overview
│   └── CONTENT_VALIDATION.md
│
├── development/         # Development setup
│   ├── DEVELOPMENT.md
│   ├── GITHUB_SETUP.md
│   └── BRANCH_PROTECTION_*.md
│
├── component-versioning/
│   └── VERSIONING_WORKFLOW.md
│
├── progress/            # Weekly reports
│   └── WEEK_*_COMPLETE.md
│
├── troubleshooting/     # Issue resolution
│   └── CORRUPTED_BUILD_CACHE.md
│
└── archived/            # Historical docs
    └── (old files)
```

---

## Quick Start

### New to this project?

1. [README.md](../README.md) - Project overview
2. [Architecture Overview](architecture/ARCHITECTURE.md) - System design
3. [Content Standards](standards/content.md) - MDX architecture
4. [Quality Standards](standards/quality.md) - Quality gates

### Building a new site?

1. [Adding a New Site](guides/adding-new-site.md) - Complete guide
2. [Adding Services](guides/adding-service.md) - Service MDX files
3. [Adding Locations](guides/adding-location.md) - Location MDX files

### Deploying?

1. [Git Workflow](guides/git-workflow.md) - Branch workflow
2. [Deploying a Site](guides/deploying-site.md) - Deployment procedures
3. [GitHub Actions](guides/github-actions.md) - CI/CD pipeline

---

## Project Statistics

### Sites

- **colossus-reference:** 86 pages (25 services + 37 locations + blog + projects + reviews)
- **joes-plumbing-canterbury:** 12 pages (3 services + 3 locations)
- **Target:** 50 sites by end of Year 1

### Documentation

- **Standards:** 11 focused reference documents
- **Guides:** 7 how-to procedures
- **Total:** ~3,000+ lines of documentation

### Build Performance

- Fresh build: 44.4s (2 sites)
- Cached build: 253ms (176x faster)
- Target for 50 sites: <5min

---

## Related Files

- [CLAUDE.md](../CLAUDE.md) - AI agent instructions
- [TODO.md](TODO.md) - Task tracking
- [WHITE_LABEL_PLATFORM_DESIGN.md](WHITE_LABEL_PLATFORM_DESIGN.md) - Business plan

---

**Maintained By:** Digital Consulting Services
