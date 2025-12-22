# Standards Documentation

**Version:** 1.1.0
**Last Updated:** 2025-12-21
**Scope:** All sites in local-business-platform

---

## Overview

This directory contains focused, single-topic standards documents for the Local Business Platform. Each document covers one area of development standards with clear rules, code examples, and verification checklists.

## Quick Navigation

| Standard                      | Description                        | Key Rules                             |
| ----------------------------- | ---------------------------------- | ------------------------------------- |
| [Styling](./styling.md)       | Tailwind CSS, theme tokens         | Use theme tokens, no hex colors       |
| [Components](./components.md) | Component architecture, TypeScript | Named exports, typed props            |
| [Content](./content.md)       | MDX-only architecture, frontmatter | Single source of truth                |
| [SEO](./seo.md)               | Meta data, keywords, local SEO     | Title < 60 chars, description 150-160 |
| [Images](./images.md)         | Image optimization, R2 storage     | Quality settings, naming conventions  |
| [Schema](./schema.md)         | JSON-LD schema markup              | LocalBusiness, FAQPage, Breadcrumb    |
| [Testing](./testing.md)       | Unit tests, E2E tests              | 141+ tests, tiered strategy           |
| [Security](./security.md)     | Rate limiting, API security        | Upstash Redis, GDPR compliance        |
| [Analytics](./analytics.md)   | Consent management, GA4            | Feature flags, privacy-first          |
| [Deployment](./deployment.md) | Pipeline, tools, monitoring        | Phased rollout, NewRelic APM          |
| [Quality](./quality.md)       | Quality gates, checklists          | Pre-commit, pre-push hooks            |

## Document Format

Each standards document follows this structure:

```markdown
# [Standard Name] Standards

**Version:** X.X.X
**Last Updated:** YYYY-MM-DD
**Scope:** All sites in local-business-platform

---

## Overview

Brief description of what this standard covers.

## Core Principles

Key rules that must always be followed.

## Implementation

Code examples showing correct usage.

## What NOT to Do

Anti-patterns and common mistakes.

## Verification Checklist

Steps to verify compliance.
```

## Related Documentation

- **[Guides](../guides/)** - Procedural how-to documentation
- **[Architecture](../architecture/)** - High-level system design
- **[Development](../development/)** - Development workflow and git setup

## Updating Standards

When updating a standard:

1. Update the version number (semantic versioning)
2. Update the "Last Updated" date
3. Run `/update.docs` to sync documentation
4. Follow git workflow: develop → staging → main

---

**Maintained By:** Digital Consulting Services
**Feedback:** Create an issue in the repository
