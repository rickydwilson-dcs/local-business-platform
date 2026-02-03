# Base Template Site

The base template site provides a neutral starting point for creating new white-label websites in the local business platform. It includes generic placeholder content and integrates the `@platform/theme-system` for easy customization.

## Purpose

This template serves as the foundation for all new sites in the platform. Copy this directory structure and customize the configuration files and content to match your specific business requirements.

## What's Included

### Configuration Files

- **`site.config.ts`** - Business information, contact details, service areas, feature flags
- **`theme.config.ts`** - Theme customization (colors, typography, components)
- **`tailwind.config.ts`** - Tailwind CSS configuration with theme system integration
- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`package.json`** - Dependencies and scripts

### Generic Content

**Services** (`content/services/`):

- `primary-service.mdx`
- `secondary-service.mdx`
- `service-three.mdx`
- `service-four.mdx`
- `service-five.mdx`

**Locations** (`content/locations/`):

- `main-area.mdx`
- `north-region.mdx`
- `south-region.mdx`

All content files use generic placeholder text that should be replaced with actual business content.

## Creating a New Site

### 1. Copy the Template

```bash
cp -r sites/base-template sites/your-new-site
cd sites/your-new-site
```

### 2. Update Configuration

Edit `site.config.ts` with your business information:

- Business name, tagline, contact details
- Address and operating hours
- Service areas
- Social media links
- Feature flags

### 3. Customize Theme

Edit `theme.config.ts` to match your brand:

- Primary, secondary, and accent colors
- Typography (fonts)
- Component styles (buttons, cards, navigation)

### 4. Update Content

Replace generic MDX content with actual business content:

- Service descriptions and details
- Location-specific information
- FAQ answers
- Hero images and CTAs

### 5. Install Dependencies

```bash
pnpm install
```

### 6. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to preview your site.

### 7. Update Package.json

Edit `package.json` to change:

- `name` field to your site name
- `description` field

## Theme System Integration

The base template uses `@platform/theme-system` for centralized theming:

### Theme Configuration

The `theme.config.ts` file defines your site's visual identity:

```typescript
export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: '#3b82f6', // Main brand color
      primaryHover: '#2563eb', // Hover state
      secondary: '#1e40af', // Secondary elements
      accent: '#f59e0b', // Highlights
    },
    // ... more colors
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  components: {
    button: { borderRadius: '0.5rem' },
    card: { borderRadius: '1rem', shadow: 'sm' },
    hero: { variant: 'centered' },
    navigation: { style: 'solid' },
  },
};
```

### Tailwind Integration

The theme is automatically applied via the Tailwind plugin in `tailwind.config.ts`:

```typescript
import { createThemePlugin } from '@platform/theme-system/plugin';
import { themeConfig } from './theme.config';

const config: Config = {
  // ... content paths
  plugins: [typography, createThemePlugin(themeConfig)],
};
```

This generates CSS variables and Tailwind utilities based on your theme configuration.

## Directory Structure

```
sites/base-template/
├── app/                      # Next.js app directory
│   ├── blog/                # Blog listing and posts
│   ├── locations/           # Location listing and pages
│   ├── projects/            # Projects/portfolio pages
│   ├── reviews/             # Customer reviews page
│   └── services/            # Service listing and pages
├── components/
│   ├── Schema.tsx           # Schema.org JSON-LD component
│   └── ui/                  # Reusable UI components
├── content/                  # MDX content files
│   ├── blog/                # Blog posts
│   ├── locations/           # Location pages
│   ├── projects/            # Project case studies
│   ├── services/            # Service pages
│   └── testimonials/        # Customer testimonials
├── lib/                      # Utility functions
│   ├── content.ts           # Content loading utilities
│   ├── content-schemas.ts   # Zod validation schemas
│   ├── image.ts             # Image URL utilities
│   ├── mdx.tsx              # MDX rendering utilities
│   ├── schema.ts            # Schema.org generators
│   └── site.ts              # Site URL utilities
├── public/                   # Static assets
├── site.config.ts           # Business configuration
├── theme.config.ts          # Theme configuration
├── tailwind.config.ts       # Tailwind + theme system
├── mdx-components.tsx       # Custom MDX components
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## UI Components

The template includes a comprehensive UI component library in `components/ui/`:

### Content Components

- **Breadcrumbs** - Navigation breadcrumb trail
- **BlogPostCard** - Blog post preview card
- **BlogPostHero** - Blog/project hero section
- **ArticleCallout** - Highlighted callout boxes
- **AuthorCard** - Author bio card

### Service/Location Components

- **PageHero** - Generic page hero section
- **ServiceHero** - Service-specific hero with CTA
- **LocationHero** - Location-specific hero
- **ServiceAbout** - Detailed service information
- **ServiceBenefits** - Benefits grid
- **FAQSection** - Accordion FAQ list
- **CTASection** - Call-to-action banner

### Testimonial Components

- **StarRating** - Star rating display
- **AggregateRatingDisplay** - Overall rating summary
- **TestimonialCard** - Individual review card

### Layout Components

- **ContentCard** - Generic content card
- **ContentGrid** - Responsive content grid
- **CardGrid** - Simple card grid

All components use theme CSS variables (`brand-primary`, `surface-foreground`, etc.) for consistent branding.

## Content Schemas

All content types have Zod validation schemas in `lib/content-schemas.ts`:

### Service Frontmatter

```yaml
---
title: 'Service Name'
seoTitle: 'SEO Title | Business Name'
description: '50-200 character description'
keywords:
  - keyword1
  - keyword2
badge: 'Optional Badge Text'
hero:
  image: '/images/service-hero.webp'
benefits:
  - 'Benefit 1'
  - 'Benefit 2'
about:
  whatIs: 'What this service is...'
  whenNeeded:
    - 'Use case 1'
    - 'Use case 2'
  whatAchieve:
    - 'Outcome 1'
    - 'Outcome 2'
faqs:
  - question: 'Question?'
    answer: 'Answer...'
---
```

### Location Frontmatter

```yaml
---
title: 'Location Name'
seoTitle: 'Services in Location | Business Name'
description: '50-200 character description'
keywords:
  - location keyword
hero:
  title: 'Custom Hero Title'
  description: 'Hero description'
  image: '/images/location.webp'
  trustBadges:
    - 'Licensed'
    - 'Insured'
towns:
  - 'Town 1'
  - 'Town 2'
faqs:
  - question: 'Location-specific question?'
    answer: 'Answer...'
---
```

### Blog Post Frontmatter

```yaml
---
title: 'Post Title'
seoTitle: 'SEO Title'
description: 'Post excerpt'
excerpt: 'Short excerpt for cards'
date: '2025-01-15'
category: 'industry-tips' # industry-tips, how-to-guide, case-study, seasonal, news
author:
  name: 'Author Name'
  role: 'Author Role'
heroImage: '/images/blog-post.webp'
readingTime: 5
featured: true
tags:
  - tag1
  - tag2
keywords:
  - keyword1
relatedServices:
  - service-slug
---
```

### Project Frontmatter

```yaml
---
title: 'Project Title'
seoTitle: 'SEO Title'
description: 'Project description'
keywords:
  - keyword1
heroImage: '/images/project.webp'
projectType: 'residential' # residential, commercial, industrial, heritage
category: 'renovation' # heritage, new-build, renovation, maintenance, emergency
completionDate: '2025-01-15'
year: 2025
location: 'location-slug'
locationName: 'Location Name'
duration: '4 weeks'
services:
  - service-slug-1
  - service-slug-2
results:
  - 'Outcome 1'
  - 'Outcome 2'
client:
  type: 'Commercial Client'
  testimonial: 'Great work...'
  rating: 5
status: 'completed' # completed, featured, draft
---
```

### Testimonial Frontmatter

```yaml
---
customerName: 'John Smith'
customerRole: 'Homeowner'
customerCompany: 'Optional Company'
location: 'Location Name'
locationSlug: 'location-slug'
service: 'Service Name'
serviceSlug: 'service-slug'
rating: 5
date: '2025-01-15'
text: 'Full testimonial text...'
featured: true
verified: true
---
```

## Content Guidelines

### Service Pages

Each service MDX file should include:

- Title, SEO title, description
- Keywords for SEO
- Hero section with image
- Benefits list (4-8 items)
- About section with whenNeeded/whatAchieve
- FAQs (minimum 3, recommended 8-12)
- Main MDX content with proper headings

### Location Pages

Each location MDX file should include:

- Location-specific title and description
- Local keywords
- Hero with location name
- Towns/areas served list
- Location-specific FAQs
- Main MDX content

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run validate:content` - Validate MDX content

## Next Steps

1. Review the colossus-reference site for a complete example
2. Check platform documentation in `/docs`
3. Read theme system documentation in `/packages/theme-system`
4. Review content standards in `/docs/standards`

## Support

For questions or issues:

- Check `/docs/guides` for how-to guides
- Review `/docs/architecture` for architecture details
- See `/docs/standards` for coding standards

---

**Template Version:** 2.0.0
**Updated:** January 2026 (Migration from colossus-reference patterns)
**Platform:** Local Business Platform v1.1
