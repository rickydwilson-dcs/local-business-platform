# Content Validation System

This project uses **Zod schemas** to validate MDX frontmatter before deployment, catching content errors in CI rather than at runtime.

## Why Content Validation?

With 25+ services and 37+ locations, manual content review is error-prone. This system:

✅ **Catches errors before deployment** - Invalid content fails in CI, not production
✅ **Enforces content standards** - Ensures descriptions, FAQs, and metadata meet SEO requirements
✅ **Provides clear error messages** - Shows exactly what's wrong and where
✅ **Runs automatically** - Validates on every commit via pre-commit hooks

## Quick Start

### Run Validation

```bash
# Validate all content (services + locations)
npm run validate:content

# Validate only services
npm run validate:services

# Validate only locations
npm run validate:locations
```

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ Failed Files:

✗ access-scaffolding.mdx
  description: Description should be under 200 characters
  faqs: At least 3 FAQs required for good SEO

✓ Passed Files (24):
  ✓ birdcage-scaffolds.mdx
  ✓ facade-scaffolding.mdx
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total files: 25
✓ Valid: 24
✗ Invalid: 1
```

## What's Validated

### Services (`content/services/*.mdx`)

| Field             | Required | Rules                                               |
| ----------------- | -------- | --------------------------------------------------- |
| `title`           | Yes      | 5-100 characters                                    |
| `description`     | No\*     | 50-200 characters (ideally 160 for Google)          |
| `seoTitle`        | No       | Max 60 characters                                   |
| `keywords`        | No       | 3-10 keywords, 2+ chars each                        |
| `faqs`            | Yes      | 3-15 FAQs with 10+ char questions, 20+ char answers |
| `hero.heading`    | No       | 5+ characters if present                            |
| `hero.subheading` | No       | 10+ characters if present                           |

_\*Optional to allow stub pages during development_

### Locations (`content/locations/*.mdx`)

| Field              | Required | Rules                                      |
| ------------------ | -------- | ------------------------------------------ |
| `title`            | Yes      | 2-50 characters                            |
| `seoTitle`         | Yes      | 10-80 characters (ideally 60 for Google)   |
| `description`      | Yes      | 50-200 characters (ideally 160 for Google) |
| `hero.title`       | Yes      | 5+ characters                              |
| `hero.description` | Yes      | 20+ characters                             |
| `hero.phone`       | Yes      | Valid phone number format                  |
| `services.items`   | No       | If present, min 3 services                 |
| `faqs`             | No       | If present, 5-20 FAQs                      |

## Common Errors & Fixes

### ❌ Description too long

```
description: Description should be under 200 characters
```

**Fix**: Shorten description. Google shows ~160 characters in search results.

### ❌ Missing FAQs

```
faqs: At least 3 FAQs required for good SEO
```

**Fix**: Add FAQ array to frontmatter:

```yaml
---
faqs:
  - question: "What is..."
    answer: "..."
---
```

### ❌ YAML syntax error

```
Unexpected error: end of the stream or a document separator is expected
```

**Fix**: Check YAML syntax. Common issues:

- Missing closing `---`
- Incorrect indentation (use 2 spaces)
- Unquoted strings with special characters

### ❌ Invalid phone number

```
hero.phone: Phone must be valid
```

**Fix**: Use format like `01424 466 661` or `+44 1424 466661`

## Files & Architecture

```
lib/
  └── content-schemas.ts          # Zod schemas for validation

scripts/
  └── validate-content.ts         # Validation script

.husky/
  └── pre-commit                  # Runs validation on commit

package.json                      # npm scripts for validation
```

### Schema Files

**[lib/content-schemas.ts](lib/content-schemas.ts)**
Defines Zod schemas for:

- `ServiceFrontmatterSchema` - Services validation
- `LocationFrontmatterSchema` - Locations validation
- Shared schemas (FAQ, Hero, Breadcrumbs)

**[scripts/validate-content.ts](scripts/validate-content.ts)**
Executable validation script that:

- Reads all MDX files
- Parses frontmatter with `gray-matter`
- Validates against Zod schemas
- Outputs colored, formatted results

## CI Integration

### Pre-commit Hook

Validation runs automatically on commit:

```bash
git commit -m "Update service content"
# → Runs: npx lint-staged
# → Runs: npm run validate:content
# ✓ If validation passes, commit succeeds
# ✗ If validation fails, commit is blocked
```

### Pre-push Hook (Optional)

For additional safety, add to `.husky/pre-push`:

```bash
npm run validate:content && npm run type-check && npm run build
```

## Modifying Validation Rules

### Make a field required

```typescript
// Before (optional)
description: z.string().min(50).max(200).optional(),

// After (required)
description: z.string().min(50).max(200),
```

### Change length limits

```typescript
// Increase max description length
description: z.string()
  .min(50)
  .max(250), // Changed from 200

// Decrease min FAQs
faqs: z.array(FaqSchema)
  .min(1) // Changed from 3
```

### Add new field validation

```typescript
export const ServiceFrontmatterSchema = z.object({
  // ... existing fields

  // Add new field
  author: z.string().min(2, "Author name required").optional(),
});
```

## Skipping Validation (Emergency Only)

```bash
# Skip pre-commit hooks (NOT RECOMMENDED)
git commit --no-verify -m "Emergency fix"

# Or temporarily disable in .husky/pre-commit
# Comment out: npm run validate:content
```

## Troubleshooting

### Validation passes locally but fails in CI

**Cause**: Different content between branches
**Fix**: Pull latest changes: `git pull origin main`

### False positives (valid content flagged as invalid)

**Cause**: Schema too strict
**Fix**: Adjust schema in `lib/content-schemas.ts` and commit

### Performance issues with validation

**Cause**: Too many files
**Fix**: Validation is fast (<5s for 60+ files). If slow, check disk I/O.

## Benefits

| Before Validation            | After Validation               |
| ---------------------------- | ------------------------------ |
| Runtime errors in production | Errors caught in development   |
| Manual content review        | Automated enforcement          |
| Inconsistent metadata        | Standardized content structure |
| SEO issues slip through      | SEO requirements enforced      |
| Debugging in production      | Clear error messages in CI     |

## Learn More

- **Zod Documentation**: https://zod.dev
- **gray-matter**: https://github.com/jonschlinkert/gray-matter
- **MDX Frontmatter**: https://mdxjs.com/guides/frontmatter/

---

**Questions?** Check existing schemas in `lib/content-schemas.ts` for examples.
