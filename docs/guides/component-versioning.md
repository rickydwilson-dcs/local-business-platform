# Component Versioning Guide

**Estimated Time:** 5-10 minutes per changeset
**Prerequisites:** pnpm installed, familiarity with core-components
**Difficulty:** Beginner

---

## Overview

The shared component library (`@platform/core-components`) is versioned using [Changesets](https://github.com/changesets/changesets). This guide explains how to create changesets, bump versions, and manage component variants.

## When You Need a Changeset

Create a changeset whenever you modify code in `packages/core-components/`. This includes:

- Adding new components or variants
- Fixing bugs in existing components
- Changing component props or behaviour
- Removing or renaming exports (breaking change)

## Workflow

### 1. Make Your Changes

Edit components in `packages/core-components/src/`. Build and test locally before proceeding.

### 2. Create a Changeset

```bash
pnpm changeset
```

The CLI will ask:

1. **Which packages changed?** Select `@platform/core-components`
2. **What type of change?** Choose major, minor, or patch (see table below)
3. **Description** — Write a clear summary of what changed and why

This creates a markdown file in `.changeset/` describing the change.

### 3. Commit the Changeset

```bash
git add .changeset/*.md
git commit -m "changeset: describe your change"
```

### 4. Bump Versions (When Ready to Release)

```bash
pnpm version-packages
```

This consumes all pending changeset files, bumps `package.json` versions, and updates `CHANGELOG.md`.

```bash
git add -A
git commit -m "version: bump core-components"
```

## Semantic Versioning

| Type      | Example       | When to Use                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| **Patch** | 1.0.0 → 1.0.1 | Bug fixes, no API changes                                    |
| **Minor** | 1.0.0 → 1.1.0 | New features, new components (backwards compatible)          |
| **Major** | 1.0.0 → 2.0.0 | Breaking changes (removed/renamed props, deleted components) |

## Component Variant Strategy

Major components provide multiple variants to support different business types:

| Variant | Style               | Best For                            |
| ------- | ------------------- | ----------------------------------- |
| V1      | Traditional/Classic | Professional services, tradespeople |
| V2      | Modern/Split        | Contemporary businesses, tech       |
| V3      | Immersive/Creative  | Creative agencies, portfolios       |

Sites choose which variant to import:

```tsx
import { HeroV1 } from "@platform/core-components";

function HomePage() {
  return (
    <HeroV1
      title="Smith's Electrical"
      subtitle="Cambridge's Trusted Electricians"
      ctaText="Get a Quote"
      ctaHref="/contact"
    />
  );
}
```

## Site Ignore List

Sites are excluded from version bumps in `.changeset/config.json` because they consume core-components as a workspace dependency rather than a published package:

```json
{
  "ignore": ["colossus-reference", "smiths-electrical-cambridge"]
}
```

When adding a new site, add its package name to this ignore list.

## Troubleshooting

**Changeset files disappeared after `pnpm version-packages`?**
Expected — changesets are consumed during version bumping.

**Version didn't bump?**
Make sure you committed the `.changeset/*.md` file before running `pnpm version-packages`.

**Multiple changesets pending?**
`pnpm version-packages` consumes all pending changesets in one go and calculates the correct version bump.

---

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
