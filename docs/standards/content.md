# Content Standards

**Version:** 1.2.0
**Last Updated:** 2025-01-25
**Scope:** All sites in local-business-platform

---

## Overview

The Local Business Platform uses a **Unified MDX-Only Architecture**. All content is managed exclusively through MDX files with comprehensive frontmatter. There are no centralized TypeScript data structures - MDX is the single source of truth.

## Core Principles

### 1. MDX is the Single Source of Truth

```
✅ REQUIRED - All content uses MDX as the ONLY source:
/content/services/[service].mdx       - All service content (25 files)
/content/locations/[location].mdx     - All location content (37 files)
/content/blog/[post].mdx              - Blog posts (Week 6)
/content/projects/[project].mdx       - Project case studies (Week 6)
/content/testimonials/[review].mdx    - Customer testimonials (Week 6)
/app/services/[slug]/page.tsx         - Dynamic routing (reads MDX only)
/app/locations/[slug]/page.tsx        - Dynamic routing (reads MDX only)
/app/blog/[slug]/page.tsx             - Dynamic routing (reads MDX only)
/app/projects/[slug]/page.tsx         - Dynamic routing (reads MDX only)
```

**Total:** 62+ MDX content files across all sites (services + locations + blog + projects + testimonials)

### 2. No Centralized Data Files

- ❌ NO `lib/locations.ts` (deleted)
- ❌ NO `lib/services.ts`
- ❌ NO fallback data structures
- ❌ NO individual static page files

### 3. Dynamic Routing Only

All content pages use dynamic routing that reads MDX files directly:

```tsx
// ✅ REQUIRED pattern in /app/[category]/[slug]/page.tsx
export default async function ContentPage({ params }: { params: { slug: string } }) {
  const mdxContent = await readMDXFile(`/content/category/${params.slug}.mdx`);

  if (!mdxContent) {
    notFound(); // Return 404 if MDX doesn't exist
  }

  return renderMDXContent(mdxContent);
}
```

## MDX Frontmatter Structure

### Service Frontmatter

```yaml
---
title: "Access Scaffolding"
seoTitle: "Access Scaffolding Services | Colossus Scaffolding"
description: "Professional access scaffolding services for safe working at height. TG20:21 compliant systems."
keywords: ["access scaffolding", "scaffolding hire", "scaffolding services"]
heroImage: "/Access-Scaffolding.png"
hero:
  title: "Professional Access Scaffolding"
  description: "Safe, reliable scaffolding solutions for all access requirements."
  phone: "01424 466 661"
  trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
  ctaText: "Get Your Free Quote"
  ctaUrl: "/contact"
about:
  whatIs: "Access scaffolding is a temporary structure system designed to provide safe, stable working platforms..."
  whenNeeded:
    - "Building maintenance and exterior repairs"
    - "Window cleaning and replacement projects"
  whatAchieve:
    - "Safe working at height with full fall protection"
    - "Improved productivity through stable working platforms"
  keyPoints:
    - "TG20:21 compliant design ensuring latest safety standards"
    - "CISRS qualified scaffolders with extensive experience"
benefits:
  - "Full TG20:21 compliance"
  - "CISRS qualified teams"
faqs:
  - question: "How long does installation take?"
    answer: "Typically 1-2 days for residential projects..."
  - question: "What certifications do you have?"
    answer: "We hold CISRS certification and are TG20:21 compliant..."
---
## Additional Content

Markdown content renders below structured sections.
```

### Location Frontmatter

```yaml
---
title: "Brighton"
seoTitle: "Brighton Scaffolding Services | Colossus Scaffolding"
description: "Professional scaffolding services in Brighton. Local expertise for all scaffolding requirements."
keywords: ["scaffolding brighton", "brighton scaffolding hire"]
heroImage: "/Brighton-Scaffolding.png"
hero:
  title: "Professional Scaffolding in Brighton"
  description: "Local expertise for Brighton's unique challenges..."
  phone: "01424 466 661"
  trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
specialists:
  title: "Brighton Scaffolding Specialists"
  cards:
    - title: "Residential"
      description: "Home scaffolding solutions"
services:
  cards:
    - title: "Access Scaffolding"
      href: "/services/access-scaffolding"
pricing:
  packages:
    - name: "Basic"
      price: "From £500"
# Towns directory for counties only
towns:
  title: "Brighton Towns We Serve"
  townsList:
    - name: "Hove"
      slug: "hove"
---
## Local Content

Markdown content about Brighton.
```

### Blog Frontmatter (Week 6)

```yaml
---
title: "How to Choose the Right Scaffolding for Your Project"
date: "2025-01-15"
author:
  name: "John Smith"
  role: "Operations Director"
category: "how-to-guide" # industry-tips | how-to-guide | case-study | seasonal | news
tags:
  - planning
  - residential
  - guide
description: "Expert guide to selecting the right scaffolding type..."
excerpt: "Selecting the right scaffolding can make the difference..."
heroImage: "colossus-reference/blog/choosing-scaffolding.webp"
featured: true
relatedServices:
  - residential-scaffolding
  - commercial-scaffolding
---
Blog post content in markdown...
```

### Project Frontmatter (Week 6)

```yaml
---
title: "Victorian Terrace Restoration - Brighton"
description: "Complete scaffolding solution for a Grade II listed property..."
projectType: "residential" # residential | commercial | industrial | heritage
category: "heritage" # heritage | new-build | renovation | maintenance | emergency
status: "featured" # completed | in-progress | featured
location: "brighton"
locationName: "Brighton"
completionDate: "2024-09-15"
year: 2024
duration: "8 weeks"
services:
  - residential-scaffolding
  - facade-scaffolding
heroImage: "colossus-reference/projects/terrace-brighton/hero.webp"
images:
  - path: "colossus-reference/projects/terrace-brighton/01.webp"
    caption: "Initial survey"
    order: 1
client:
  type: "Private Homeowner" # Private Homeowner | Property Developer | Local Authority | Business
  testimonial: "Excellent work on our historic property..."
  rating: 5
scope:
  buildingType: "Victorian Terrace"
  storeys: 3
  challenges:
    - "Grade II listed building constraints"
    - "Narrow street access"
results:
  - "Full scaffold access for 3-storey facade"
  - "Completed on schedule"
faqs:
  - question: "How did you protect the listed building?"
    answer: "We used padded fixtures and non-invasive fixing methods..."
---
Project case study content in markdown...
```

### Testimonial Frontmatter (Week 6)

```yaml
---
customerName: "John Smith"
customerRole: "Homeowner"
customerCompany: null # Optional
rating: 5 # 1-5 stars
text: "Colossus Scaffolding provided excellent service..."
excerpt: "Excellent service for our renovation." # Optional short version
photo: "colossus-reference/testimonials/john-smith.webp" # Optional
date: "2024-11-15"
service: "Residential Scaffolding"
serviceSlug: "residential-scaffolding"
location: "Brighton"
locationSlug: "brighton"
projectType: "residential" # residential | commercial | industrial
featured: true
verified: true
platform: "internal" # internal | google | trustpilot | reviews.io
---
```

## Content Reading Pattern

```typescript
// Reading service/location content from MDX
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const filePath = path.join(process.cwd(), "content", "services", `${slug}.mdx`);
const fileContent = await fs.readFile(filePath, "utf-8");
const { data } = matter(fileContent); // data = frontmatter object
```

## Content Accuracy Standards

### Truthful Claims Only

- ✅ **CAPABILITIES**: "We can scaffold...", "Our team can work on..."
- ✅ **EXPERTISE**: "We specialize in...", "We understand..."
- ✅ **QUALIFICATIONS**: Reference actual certifications
- ❌ **FALSE CLAIMS**: Never "We've worked on..." without verification
- ❌ **UNFOUNDED**: Avoid "We regularly scaffold...", "We've completed..."

### Content Language

```tsx
// ✅ CORRECT - Capability focused
"We can scaffold everything from Victorian terraces to modern developments";
"Our team can handle the access challenges of narrow streets";

// ❌ WRONG - Unverified claims
"We've scaffolded everything from Victorian terraces to modern developments";
"Our team regularly works on narrow street projects";
```

## What NOT to Do

| Anti-Pattern                       | Why It's Wrong   | Correct Approach       |
| ---------------------------------- | ---------------- | ---------------------- |
| `lib/locations.ts`                 | Centralized data | MDX frontmatter only   |
| `/app/locations/brighton/page.tsx` | Static page file | Dynamic routing        |
| Hardcoded content in components    | Not editable     | Read from MDX          |
| Dual architecture                  | Confusing        | Single source of truth |

## Validation

Content is validated using Zod schemas on every commit:

- **Description length**: 50-200 characters
- **FAQ requirements**: 3-15 FAQs per service
- **YAML syntax**: Proper formatting
- **Required fields**: All mandatory frontmatter present

```bash
npm run validate:content       # Validate all MDX files
npm run validate:services      # Validate service files
npm run validate:locations     # Validate location files
npm run validate:blog          # Validate blog posts (Week 6)
npm run validate:projects      # Validate projects (Week 6)
npm run validate:testimonials  # Validate testimonials (Week 6)
```

### Quality Validators

Additional quality checks beyond schema validation:

| Validator   | Type       | Checks                                               |
| ----------- | ---------- | ---------------------------------------------------- |
| Readability | Rule-based | Flesch-Kincaid score, sentence length, passive voice |
| SEO         | Rule-based | Title/description length, keyword density            |
| Uniqueness  | Rule-based | N-gram fingerprinting, similarity detection          |

```bash
npm run validate:quality      # Run all quality validators
npm run validate:quality:ai   # Include AI-powered validators (future)
```

## AI Content Generation

Service and location pages can be generated using AI:

```bash
# Generate services (from root)
pnpm content:generate:services --site colossus-reference --context tools/examples/colossus-context.json

# Generate locations (from root)
pnpm content:generate:locations --site colossus-reference --context tools/examples/colossus-context.json

# Preview without writing
pnpm content:generate:services --dry-run
```

Supports both Claude (default) and Gemini via `--provider` flag. See [Adding a Service](../guides/adding-service.md) for details.

## Verification Checklist

Before completing any content work:

- [ ] Content is in MDX file in appropriate `/content/` subdirectory
- [ ] All frontmatter fields are populated per schema requirements
- [ ] Description is 50-200 characters
- [ ] Services have 3-15 FAQs
- [ ] Blog posts have category, tags, and excerpt
- [ ] Projects have heroImage, services, and results
- [ ] Testimonials have rating, date, and text
- [ ] No centralized data files created
- [ ] Dynamic routing template handles the content
- [ ] `npm run validate:content` passes

## Related Standards

- [SEO](./seo.md) - Meta data and keyword requirements
- [Schema](./schema.md) - JSON-LD markup for content
- [Quality](./quality.md) - Content validation in CI

## Related Guides

- [Adding a Location](../guides/adding-location.md)
- [Adding a Service](../guides/adding-service.md)
- [Adding a Blog Post](../guides/adding-blog-post.md) (Week 6)
- [Adding a Project](../guides/adding-project.md) (Week 6)

---

**Maintained By:** Digital Consulting Services
