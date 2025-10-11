# Component Versioning Workflow

This document explains how to version the shared component library (`@platform/core-components`) using Changesets.

---

## 📦 Package Structure

```
packages/
  core-components/          # Shared component library
    src/
      components/
        hero/                # Example: Hero variants
          HeroV1.tsx         # Variant 1
          HeroV2.tsx         # Variant 2
          HeroV3.tsx         # Variant 3
          index.ts           # Exports all variants
      index.ts               # Main package exports
    package.json             # version: "1.1.0"
    CHANGELOG.md             # Auto-generated changelog
```

---

## 🔄 Versioning Workflow

### 1. Make Changes to Components

```bash
# Create or modify components in packages/core-components/src/
```

### 2. Create a Changeset

```bash
pnpm changeset
```

This will:
- Ask what type of change (major, minor, patch)
- Ask which packages are affected
- Generate a `.changeset/*.md` file

**Example changeset file:**
```markdown
---
"@platform/core-components": minor
---

Add Hero component variants (V1, V2, V3)

Detailed description of changes...
```

### 3. Commit the Changeset

```bash
git add .changeset/*.md
git commit -m "Add changeset: Hero variants"
git push
```

### 4. Bump Versions

When ready to release:

```bash
pnpm version-packages
```

This will:
- ✅ Consume all changeset files
- ✅ Bump package.json versions
- ✅ Generate/update CHANGELOG.md
- ✅ Follow semantic versioning

### 5. Commit & Release

```bash
git add -A
git commit -m "Version bump: v1.1.0"
git push
```

---

## 📊 Semantic Versioning

| Type | Version | When to Use |
|------|---------|-------------|
| **Major** | 1.0.0 → 2.0.0 | Breaking changes |
| **Minor** | 1.0.0 → 1.1.0 | New features (backwards compatible) |
| **Patch** | 1.0.0 → 1.0.1 | Bug fixes |

---

## 🎯 Component Variant Strategy

Each major component should have **3 variants** to support different business types:

### Example: Hero Components

**V1 - Traditional/Classic**
- Simple, proven design
- Best for: Traditional businesses, professional services
- Conservative styling

**V2 - Modern/Split**
- Contemporary two-column layout
- Best for: Modern businesses, SaaS, tech
- Feature-rich with multiple CTAs

**V3 - Immersive/Creative**
- Bold, full-screen design
- Best for: Creative agencies, portfolios
- Video/image backgrounds

### Variant Benefits

✅ Sites can choose the variant that fits their brand
✅ Variants evolve independently
✅ Easy A/B testing
✅ Gradual migration paths

---

## 🚀 Site Upgrade Process

### Current Setup

Sites are configured to ignore versioning (in `.changeset/config.json`):

```json
{
  "ignore": [
    "colossus-reference",
    "joes-plumbing-canterbury"
  ]
}
```

### How Sites Use Components

Sites can:
1. Import specific variants
2. Upgrade independently
3. Test new versions before upgrading

**Example Usage:**

```tsx
// Site chooses which Hero variant to use
import { HeroV1 } from '@platform/core-components';

function HomePage() {
  return (
    <HeroV1
      title="Welcome to Joe's Plumbing"
      subtitle="24/7 Emergency Service"
      ctaText="Call Now"
      ctaHref="tel:01227123456"
    />
  );
}
```

---

## 📈 Version History

### v1.1.0 (Current)
- ✨ Added Hero component variants (V1, V2, V3)
- 📝 Complete TypeScript typing
- 🎨 Flexible prop interfaces

### v1.0.0
- 🎉 Initial release
- 📦 Base component library structure

---

## 🔧 Maintenance

### Adding New Components

1. Create component files in `packages/core-components/src/components/`
2. Export from `index.ts`
3. Run `pnpm changeset`
4. Choose "minor" for new features
5. Commit and push

### Fixing Bugs

1. Fix the bug in component code
2. Run `pnpm changeset`
3. Choose "patch" for bug fixes
4. Commit and push

### Breaking Changes

1. Make breaking changes (rarely needed)
2. Run `pnpm changeset`
3. Choose "major" for breaking changes
4. Provide migration guide in changeset
5. Commit and push

---

## 🎓 Best Practices

### ✅ DO:
- Create a changeset for every component change
- Write detailed changeset descriptions
- Follow semantic versioning strictly
- Document breaking changes thoroughly
- Test components before releasing

### ❌ DON'T:
- Manually edit package.json versions
- Skip changeset creation
- Make breaking changes in minor/patch releases
- Delete CHANGELOG.md files
- Rush releases without testing

---

## 📚 Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Component Variant Strategy](/docs/architecture/COMPONENT_VARIANTS.md)

---

## 🆘 Troubleshooting

**Q: Changeset not found after running `pnpm version-packages`?**
A: This is expected - changesets are consumed during version bumping.

**Q: Version didn't bump?**
A: Make sure you committed the `.changeset/*.md` file before running `pnpm version-packages`.

**Q: Multiple changesets pending?**
A: Running `pnpm version-packages` will consume ALL pending changesets and bump versions accordingly.

**Q: Want to preview version changes?**
A: Check `.changeset/*.md` files to see pending version bumps.
