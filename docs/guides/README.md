# How-To Guides

**Version:** 1.3.0
**Last Updated:** 2026-01-27
**Scope:** All sites in local-business-platform

---

## Overview

This directory contains procedural, step-by-step guides for common tasks in the Local Business Platform. Unlike standards (which define rules), guides show you how to accomplish specific goals.

## Quick Navigation

### Complete Workflows

| Guide                                           | Purpose                                      | Time      |
| ----------------------------------------------- | -------------------------------------------- | --------- |
| [End-to-End Workflow](./end-to-end-workflow.md) | Complete site creation from intake to launch | 2-3 hours |
| [Adding a New Site](./adding-new-site.md)       | Create a new client site from scratch        | 30-60 min |

### Content Creation

| Guide                                                   | Purpose                                 | Time                     |
| ------------------------------------------------------- | --------------------------------------- | ------------------------ |
| [Adding a Content Section](./adding-content-section.md) | Add a new content type (blog, products) | 30-45 min                |
| [Adding a Location](./adding-location.md)               | Add a new location MDX file             | 2-5 min (AI) / 15-20 min |
| [Adding a Service](./adding-service.md)                 | Add a new service MDX file              | 2-5 min (AI) / 15-20 min |

### AI Content Generation

Generate service and location pages automatically using Claude or Gemini AI:

```bash
# Generate service pages
pnpm content:generate:services --site <site-name> --context <context.json>

# Generate location pages
pnpm content:generate:locations --site <site-name> --context <context.json>

# Preview without writing
pnpm content:generate:services --dry-run
```

See [Adding a Service](./adding-service.md) and [Adding a Location](./adding-location.md) for details.

### Configuration

| Guide                                 | Purpose                                  | Time      |
| ------------------------------------- | ---------------------------------------- | --------- |
| [Theming](./theming.md)               | Configure brand colors and design tokens | 15-30 min |
| [Registry Setup](./registry-setup.md) | Set up Supabase site registry            | 30-45 min |

### Operations

| Guide                                     | Purpose                                   | Time      |
| ----------------------------------------- | ----------------------------------------- | --------- |
| [Deploying a Site](./deploying-site.md)   | Deploy to staging and production          | 10-15 min |
| [Monitoring Setup](./monitoring-setup.md) | Configure NewRelic APM                    | 20-30 min |
| [GitHub Actions](./github-actions.md)     | CI/CD workflow guide                      | 15-20 min |
| [Git Workflow](./git-workflow.md)         | Branch workflow: develop → staging → main | 5-10 min  |

## Recommended Reading Order

For new platform administrators:

1. **[End-to-End Workflow](./end-to-end-workflow.md)** - Start here for the complete picture
2. **[Git Workflow](./git-workflow.md)** - Understand the branching strategy
3. **[Adding a New Site](./adding-new-site.md)** - Deep dive into site creation
4. **[Theming](./theming.md)** - Brand customization details
5. **[Deploying a Site](./deploying-site.md)** - Deployment procedures

## Guide Format

Each guide follows this structure:

```markdown
# How to [Action]

**Estimated Time:** X minutes
**Prerequisites:** What you need before starting
**Difficulty:** Beginner | Intermediate | Advanced

---

## Overview

What this guide helps you accomplish.

## Prerequisites

- Required tools
- Required access
- Required knowledge

## Steps

1. Step one with details
2. Step two with details
3. ...

## Verification

How to confirm success.

## Troubleshooting

Common issues and solutions.

## Related

- Links to standards
- Links to other guides
```

## Guides vs Standards

| Guides                  | Standards                         |
| ----------------------- | --------------------------------- |
| **How to do something** | **Rules to follow**               |
| Step-by-step procedures | Reference documentation           |
| Task-oriented           | Principle-oriented                |
| "Add a location MDX"    | "MDX frontmatter must include..." |

## Related Documentation

- **[Standards](../standards/)** - Rules and requirements
- **[Architecture](../architecture/)** - System design overview
- **[Development](../development/)** - Development environment setup

---

**Maintained By:** Digital Consulting Services
**Feedback:** Create an issue in the repository
