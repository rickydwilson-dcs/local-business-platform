# Schema Markup Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

Schema markup (JSON-LD structured data) helps search engines understand page content and enables rich results in search listings. All pages must include appropriate schema markup.

## Core Principles

### 1. Required Schema Types

| Page Type       | Required Schema |
| --------------- | --------------- |
| All pages       | BreadcrumbList  |
| Location pages  | LocalBusiness   |
| Service pages   | Service         |
| Pages with FAQs | FAQPage         |

### 2. Implementation Method

```tsx
// Add to page head via JSON-LD script
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
/>
```

## Schema Templates

### LocalBusiness Schema (Location Pages)

```tsx
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Colossus Scaffolding",
  description: "Professional scaffolding services in Brighton",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brighton",
    addressRegion: "East Sussex",
    addressCountry: "GB",
  },
  telephone: "+44-1424-466-661",
  url: "https://colossusscaffolding.co.uk/locations/brighton",
  areaServed: "Brighton and surrounding areas",
  serviceType: "Scaffolding Services",
  priceRange: "££",
  openingHours: "Mo-Fr 07:00-18:00, Sa 08:00-14:00",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.8225,
    longitude: -0.1372,
  },
};
```

### Service Schema (Service Pages)

```tsx
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Access Scaffolding",
  description: "Professional access scaffolding for safe working at height",
  provider: {
    "@type": "LocalBusiness",
    name: "Colossus Scaffolding",
    telephone: "+44-1424-466-661",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 50.8225,
      longitude: -0.1372,
    },
    geoRadius: "50000",
  },
  serviceType: "Access Scaffolding",
};
```

### FAQPage Schema (Pages with FAQs)

```tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does scaffolding installation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Typically 1-2 days for residential projects, depending on size and complexity.",
      },
    },
    {
      "@type": "Question",
      name: "What certifications do you have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We hold CISRS certification and are TG20:21 compliant for all scaffolding work.",
      },
    },
  ],
};
```

### BreadcrumbList Schema (All Pages)

```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://colossusscaffolding.co.uk/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Locations",
      item: "https://colossusscaffolding.co.uk/locations",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Brighton",
      item: "https://colossusscaffolding.co.uk/locations/brighton",
    },
  ],
};
```

## Dynamic Schema Generation

### From MDX Frontmatter

```tsx
// Generate schema from MDX data
function generateLocationSchema(location: LocationData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Colossus Scaffolding",
    description: location.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.title,
      addressRegion: location.region || "South East England",
      addressCountry: "GB",
    },
    telephone: location.hero.phone,
    url: `https://colossusscaffolding.co.uk/locations/${location.slug}`,
    areaServed: `${location.title} and surrounding areas`,
    serviceType: "Scaffolding Services",
  };
}
```

### FAQ Schema from MDX

```tsx
function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
```

## Schema Placement

```tsx
// app/locations/[slug]/page.tsx
export default async function LocationPage({ params }) {
  const location = await getLocationData(params.slug);

  const schemas = [
    generateLocalBusinessSchema(location),
    generateBreadcrumbSchema(["Home", "Locations", location.title]),
    location.faqs && generateFAQSchema(location.faqs),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* Page content */}
    </>
  );
}
```

## Validation

### Google Rich Results Test

Validate schema at: https://search.google.com/test/rich-results

### Schema.org Validator

Validate at: https://validator.schema.org/

## What NOT to Do

| Anti-Pattern                     | Why It's Wrong    | Correct Approach            |
| -------------------------------- | ----------------- | --------------------------- |
| Missing schema on location pages | No rich results   | Add LocalBusiness           |
| Invalid JSON-LD                  | Errors, ignored   | Validate before deploy      |
| Wrong schema type                | Misleading        | Use appropriate type        |
| Hardcoded URLs                   | Not portable      | Generate dynamically        |
| Missing required properties      | Validation errors | Include all required fields |

## Schema Rules

- ✅ Every location page needs LocalBusiness schema
- ✅ Pages with FAQs need FAQPage schema
- ✅ All pages need Breadcrumb schema
- ✅ Service pages need Service schema
- ✅ Use structured data testing tool to validate
- ❌ NO invalid or incomplete schema markup
- ❌ NO schema types not relevant to page content

## Verification Checklist

Before completing any page:

- [ ] Appropriate schema type(s) included
- [ ] Schema validates with Google Rich Results Test
- [ ] All required properties present
- [ ] URLs generated dynamically (not hardcoded)
- [ ] FAQs match MDX frontmatter
- [ ] Business information accurate
- [ ] Schema matches page content

## Related Standards

- [SEO](./seo.md) - Meta data and keywords
- [Content](./content.md) - MDX frontmatter structure

---

**Maintained By:** Digital Consulting Services
