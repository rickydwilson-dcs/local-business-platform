# SEO Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

SEO is critical for local service businesses. All pages must follow strict SEO standards including proper meta data, heading hierarchy, and local SEO optimization to rank well in local search results.

## Core Principles

### 1. Every Page Needs Metadata

```tsx
// ✅ EVERY page must have
export const metadata: Metadata = {
  title: "Primary Keyword | Brand Name",
  description: "150-160 character description with target keywords naturally integrated",
  keywords: ["primary-keyword", "secondary-keyword", "local-keyword"],
  openGraph: {
    title: "Social sharing title",
    description: "Social description",
    images: ["/images/og-image.jpg"],
    url: "https://domain.com/page-url",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter title",
    description: "Twitter description",
  },
  alternates: {
    canonical: "https://domain.com/page-url",
  },
};
```

### 2. Title and Description Limits

| Element          | Limit              | Example                                                                                                                 |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Page title       | < 60 characters    | "Scaffolding Brighton \| Colossus Scaffolding"                                                                          |
| Meta description | 150-160 characters | "Professional scaffolding services in Brighton. TG20:21 compliant, CISRS qualified. Free quotes available. Call today." |

### 3. Heading Hierarchy

```tsx
// ✅ CORRECT structure
<h1>Main Page Topic</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
  <h2>Another Major Section</h2>
    <h3>Subsection</h3>

// ❌ WRONG - skipping levels
<h1>Main Topic</h1>
<h4>Subsection</h4> // Missing h2, h3
```

## SEO Content Rules

### Required Elements

- ✅ H1 tag must contain primary keyword
- ✅ H2/H3 hierarchy must be logical and include related keywords
- ✅ Meta descriptions 150-160 characters max
- ✅ Page titles under 60 characters
- ✅ Images must have descriptive alt text
- ✅ Internal linking to related pages/services

### Prohibited Practices

- ❌ NO keyword stuffing
- ❌ NO duplicate content across pages
- ❌ NO missing alt text on images
- ❌ NO broken heading hierarchy

## Local SEO Requirements

### Location Page Titles

```tsx
// ✅ CORRECT format for location pages
title: "[Service] in [Location] | Company Name";
// Example: "Scaffolding in Brighton | Colossus Scaffolding"

description: "Professional [service] in [location] - [key benefits]. [Credentials]. Free quotes 24/7.";
// Example: "Professional scaffolding in Brighton - TG20:21 compliant systems. CISRS qualified. Free quotes 24/7."
```

### Location Content Requirements

- ✅ Location name in H1
- ✅ Local landmarks/areas mentioned naturally
- ✅ Service + location combinations
- ✅ Local business information
- ✅ Towns/areas served listed

### Example Location Meta Data

```tsx
// /app/locations/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = await getLocationData(params.slug);

  return {
    title: `${location.title} Scaffolding Services | Colossus Scaffolding`,
    description: `Professional scaffolding services in ${location.title}. TG20:21 compliant, CISRS qualified scaffolders. Free quotes available. Call 01424 466 661.`,
    keywords: [
      `scaffolding ${location.title.toLowerCase()}`,
      `${location.title.toLowerCase()} scaffolding hire`,
      `scaffolders ${location.title.toLowerCase()}`,
    ],
    openGraph: {
      title: `Scaffolding ${location.title} | Colossus Scaffolding`,
      description: `Expert scaffolding services in ${location.title} and surrounding areas.`,
      url: `https://colossusscaffolding.co.uk/locations/${params.slug}`,
    },
    alternates: {
      canonical: `https://colossusscaffolding.co.uk/locations/${params.slug}`,
    },
  };
}
```

## Service Page SEO

### Service Title Format

```tsx
title: "[Service Name] Services | Company Name";
// Example: "Access Scaffolding Services | Colossus Scaffolding"
```

### Service Description Format

```tsx
description: "[Service] for [use cases]. [Key benefit]. [Credential].";
// Example: "Access scaffolding for safe working at height. TG20:21 compliant systems. CISRS qualified teams."
```

## Internal Linking Strategy

### Link from Locations to Services

```tsx
// In location pages
<Link href="/services/access-scaffolding">Access Scaffolding in {locationName}</Link>
```

### Link from Services to Locations

```tsx
// In service pages
<Link href="/locations/brighton">{serviceName} in Brighton</Link>
```

## Image SEO

### Alt Text Requirements

```tsx
// ✅ CORRECT - Descriptive alt text
<Image
  alt="Professional scaffolding installation on Victorian terrace in Brighton"
  ...
/>

// ❌ WRONG - Generic or missing
<Image alt="scaffolding" ... />
<Image alt="" ... />
```

## What NOT to Do

| Anti-Pattern            | Why It's Wrong              | Correct Approach        |
| ----------------------- | --------------------------- | ----------------------- |
| Title > 60 chars        | Truncated in search results | Keep under 60           |
| Description > 160 chars | Truncated in search results | Keep to 150-160         |
| Skipping heading levels | Poor accessibility & SEO    | Sequential h1→h2→h3     |
| Keyword stuffing        | Penalized by Google         | Natural language        |
| Duplicate content       | Competing with yourself     | Unique content per page |

## Verification Checklist

Before completing any page:

- [ ] Title under 60 characters with primary keyword
- [ ] Description 150-160 characters with natural keywords
- [ ] H1 contains primary keyword
- [ ] Heading hierarchy is sequential (h1→h2→h3)
- [ ] All images have descriptive alt text
- [ ] Internal links to related pages
- [ ] Canonical URL set
- [ ] OpenGraph meta configured
- [ ] Location pages mention local areas
- [ ] Lighthouse SEO score 95+

## Related Standards

- [Content](./content.md) - MDX content structure
- [Schema](./schema.md) - JSON-LD structured data
- [Images](./images.md) - Image optimization and alt text

---

**Maintained By:** Digital Consulting Services
