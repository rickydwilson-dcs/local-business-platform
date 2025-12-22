# Content Standards

**Version:** 1.0.1
**Last Updated:** 2025-12-21
**Scope:** All sites in local-business-platform

---

## Overview

The Local Business Platform uses a **Unified MDX-Only Architecture**. All content (services AND locations) is managed exclusively through MDX files with comprehensive frontmatter. There are no centralized TypeScript data structures - MDX is the single source of truth.

## Core Principles

### 1. MDX is the Single Source of Truth

```
✅ REQUIRED - All content uses MDX as the ONLY source:
/content/services/[service].mdx       - All service content (25 files)
/content/locations/[location].mdx     - All location content (37 files)
/app/services/[slug]/page.tsx         - Dynamic routing (reads MDX only)
/app/locations/[slug]/page.tsx        - Dynamic routing (reads MDX only)
```

**Total:** 62 MDX content files across all sites

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
npm run validate:content    # Validate all 62 MDX files
npm run validate:services   # Validate 25 service files
npm run validate:locations  # Validate 37 location files
```

## Verification Checklist

Before completing any content work:

- [ ] Content is in MDX file in `/content/services/` or `/content/locations/`
- [ ] All frontmatter fields are populated
- [ ] Description is 50-200 characters
- [ ] Services have 3-15 FAQs
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

---

**Maintained By:** Digital Consulting Services
