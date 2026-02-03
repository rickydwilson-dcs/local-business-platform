# CLAUDE.md - Base Template

Guidance for Claude Code when working with base-template.

## Overview

Base-template is the gold-standard starting point for new local service business sites. It includes:

- MDX-only content architecture
- Zod validation schemas
- Comprehensive UI component library
- Schema.org structured data
- Theme system integration

## Content Types

All content is MDX files in `content/`:

| Type         | Directory               | Example Files                     | Count |
| ------------ | ----------------------- | --------------------------------- | ----- |
| Services     | `content/services/`     | `primary-service.mdx`             | 5     |
| Locations    | `content/locations/`    | `main-area.mdx`                   | 3     |
| Blog         | `content/blog/`         | `example-industry-tips.mdx`       | 2     |
| Projects     | `content/projects/`     | `example-residential-project.mdx` | 1     |
| Testimonials | `content/testimonials/` | `example-testimonial-1.mdx`       | 3     |

## Documentation

Detailed guides are in `docs/`:

| Guide                                               | Purpose                                                    |
| --------------------------------------------------- | ---------------------------------------------------------- |
| [CONTENT_STANDARDS.md](docs/CONTENT_STANDARDS.md)   | Frontmatter requirements, validation rules, SEO guidelines |
| [COMPONENTS.md](docs/COMPONENTS.md)                 | UI component reference with props and examples             |
| [BLOG_SETUP.md](docs/BLOG_SETUP.md)                 | Blog system configuration and content creation             |
| [PROJECTS_SETUP.md](docs/PROJECTS_SETUP.md)         | Portfolio/case study setup                                 |
| [TESTIMONIALS_SETUP.md](docs/TESTIMONIALS_SETUP.md) | Customer reviews and ratings system                        |

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build

# Validation
npm run validate:content # Validate all MDX content
npm run type-check       # TypeScript type checking
npm run lint             # ESLint

# Testing
npm test                 # Unit tests
npm run test:e2e         # E2E tests
```

## Content Validation

### Before Committing Content

Always validate content:

```bash
npm run validate:content
```

### Common Validation Errors

| Error                  | Fix                                    |
| ---------------------- | -------------------------------------- |
| Description too short  | Minimum 50 characters, aim for 150-160 |
| Not enough FAQs        | Services need 3-15 FAQs                |
| Invalid date format    | Use YYYY-MM-DD format                  |
| Missing required field | Check schema requirements              |

### Schema Locations

Validation schemas are in `lib/content-schemas.ts`:

- `ServiceFrontmatterSchema`
- `LocationFrontmatterSchema`
- `BlogFrontmatterSchema`
- `ProjectFrontmatterSchema`
- `TestimonialFrontmatterSchema`

## Routes

| Route               | Description       |
| ------------------- | ----------------- |
| `/`                 | Homepage          |
| `/services`         | Services listing  |
| `/services/[slug]`  | Service detail    |
| `/locations`        | Locations listing |
| `/locations/[slug]` | Location detail   |
| `/blog`             | Blog listing      |
| `/blog/[slug]`      | Blog post         |
| `/projects`         | Projects listing  |
| `/projects/[slug]`  | Project detail    |
| `/reviews`          | Testimonials page |

## Key Files

### Configuration

- `site.config.ts` - Business information
- `theme.config.ts` - Theme customization
- `tailwind.config.ts` - Tailwind + theme integration

### Content Utilities

- `lib/content.ts` - Content loading functions
- `lib/content-schemas.ts` - Zod validation schemas
- `lib/schema.ts` - Schema.org generators

### Components

- `components/ui/` - Reusable UI components
- `components/Schema.tsx` - JSON-LD renderer

## Content Architecture Rules

1. **MDX Only** - All content in MDX files, no centralized data files
2. **Frontmatter Validation** - All content validated against Zod schemas
3. **Type Safety** - TypeScript types exported from schemas
4. **SEO Requirements** - Descriptions 50-200 chars, titles 5-100 chars

## Creating New Content

### New Blog Post

```bash
# Create file
touch content/blog/your-post-slug.mdx

# Add frontmatter (see docs/BLOG_SETUP.md)
# Validate
npm run validate:content
```

### New Project

```bash
# Create file
touch content/projects/project-name.mdx

# Add frontmatter (see docs/PROJECTS_SETUP.md)
# Validate
npm run validate:content
```

### New Testimonial

```bash
# Create file
touch content/testimonials/customer-name.mdx

# Add frontmatter (see docs/TESTIMONIALS_SETUP.md)
# Validate
npm run validate:content
```

## Schema.org

The site generates JSON-LD structured data for:

- LocalBusiness (organization)
- BreadcrumbList (navigation)
- FAQPage (FAQ sections)
- BlogPosting (blog posts)
- AggregateRating (reviews)

Use the Schema component:

```tsx
import { Schema } from '@/components/Schema';

<Schema organization={orgSchema} breadcrumbs={breadcrumbs} faq={faqs} />;
```

## Theme System

Uses `@platform/theme-system` for consistent styling:

```css
/* Use theme tokens, not hardcoded colors */
bg-brand-primary      /* Primary brand color */
text-surface-foreground  /* Text on surfaces */
border-brand-secondary   /* Secondary border */
```

See `theme.config.ts` for available tokens.
