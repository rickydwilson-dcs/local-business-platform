# SEO Quick Wins Action Plan

## Colossus Scaffolding - Priority Fixes

**Date**: December 19, 2025
**Estimated Total Time**: 16 hours (Week 1-2)
**Expected Impact**: +7-10 points SEO score, +20-30% organic traffic

---

## WEEK 1: CRITICAL FIXES (8 hours)

### 1. Fix NAP Consistency [CRITICAL] ⚠️

**Time**: 2 hours
**Impact**: HIGH - Critical for local SEO
**Files to Create/Edit**:

#### Step 1: Create Business Info Library (30 min)

Create `/Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My Drive/Websites/GitHub/local-business-platform/sites/colossus-reference/lib/business-info.ts`:

```typescript
// lib/business-info.ts
/**
 * Single source of truth for business NAP (Name, Address, Phone)
 * CRITICAL: All references to business contact info MUST use this file
 */

export const BUSINESS_INFO = {
  name: {
    legal: "Colossus Scaffolding Ltd",
    display: "Colossus Scaffolding",
  },
  address: {
    street: "Office 7, 15-20 Gresley Road",
    city: "St Leonards On Sea",
    region: "East Sussex",
    postcode: "TN38 9PL",
    country: "GB",
    // Full formatted address for display
    full: "Office 7, 15-20 Gresley Road, St Leonards On Sea, East Sussex TN38 9PL",
  },
  phone: {
    // Display format (user-facing text)
    display: "01424 466 661",
    // Tel link format (href="tel:...")
    tel: "01424466661",
    // International schema format (Schema.org)
    schema: "+441424466661",
  },
  email: {
    general: "info@colossusscaffolding.com",
    enquiries: "enquiries@email.colossus-scaffolding.co.uk",
  },
  geo: {
    latitude: "50.8549",
    longitude: "0.5736",
  },
  social: {
    facebook: "https://www.facebook.com/colossusscaffolding",
    linkedin: "https://www.linkedin.com/company/colossus-scaffolding",
  },
} as const;

// Helper function for Schema.org PostalAddress
export function getSchemaAddress() {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: BUSINESS_INFO.address.street,
    addressLocality: BUSINESS_INFO.address.city,
    addressRegion: BUSINESS_INFO.address.region,
    postalCode: BUSINESS_INFO.address.postcode,
    addressCountry: BUSINESS_INFO.address.country,
  };
}

// Helper function for Schema.org GeoCoordinates
export function getSchemaGeo() {
  return {
    "@type": "GeoCoordinates" as const,
    latitude: BUSINESS_INFO.geo.latitude,
    longitude: BUSINESS_INFO.geo.longitude,
  };
}
```

#### Step 2: Update Layout Header (15 min)

Edit `app/layout.tsx`:

```typescript
// Before:
const PHONE_NUMBER = "01424 466 661";

// After:
import { BUSINESS_INFO } from "@/lib/business-info";

// Then replace:
<a href={`tel:${PHONE_NUMBER}`} className="phone-link">
  <span className="font-medium">{PHONE_NUMBER}</span>
</a>

// With:
<a href={`tel:${BUSINESS_INFO.phone.tel}`} className="phone-link">
  <span className="font-medium">{BUSINESS_INFO.phone.display}</span>
</a>

// And update MobileMenu:
<MobileMenu phoneNumber={BUSINESS_INFO.phone.display} />
```

#### Step 3: Update Homepage Schema (20 min)

Edit `app/page.tsx`:

```typescript
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "@/lib/site";

// Update organizationSchema:
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "Contractor"], // Added LocalBusiness!
  "@id": absUrl("/#organization"),
  name: BUSINESS_INFO.name.display,
  legalName: BUSINESS_INFO.name.legal,
  url: absUrl("/"),
  logo: absUrl("/static/logo.png"),
  email: BUSINESS_INFO.email.general,
  telephone: BUSINESS_INFO.phone.schema,
  address: getSchemaAddress(),
  geo: getSchemaGeo(),
  // Add opening hours:
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  priceRange: "££",
  // ... rest of schema
};
```

#### Step 4: Update Footer (20 min)

Edit `components/ui/footer.tsx`:

```typescript
import { BUSINESS_INFO } from "@/lib/business-info";

// Replace phone link:
<Link href={`tel:${BUSINESS_INFO.phone.tel}`} className="hover:text-brand-blue transition-colors">
  {BUSINESS_INFO.phone.display}
</Link>

// Replace email link:
<Link href={`mailto:${BUSINESS_INFO.email.general}`}>
  {BUSINESS_INFO.email.general}
</Link>

// Replace address:
<address className="not-italic">
  {BUSINESS_INFO.address.full}
</address>
```

#### Step 5: Verify All Pages (15 min)

Search and replace remaining hardcoded instances:

```bash
cd sites/colossus-reference
grep -r "01424 466 661" --include="*.tsx" --include="*.ts" .
grep -r "01424466661" --include="*.tsx" --include="*.ts" .
grep -r "+441424466661" --include="*.tsx" --include="*.ts" .
```

---

### 2. Fix Robots.txt Production Logic [CRITICAL] ⚠️

**Time**: 1 hour
**Impact**: CRITICAL - Prevents accidental de-indexing
**File**: `app/robots.ts`

#### Before:

```typescript
const isProd = !!process.env.NEXT_PUBLIC_SITE_URL;
```

#### After:

```typescript
// app/robots.ts
import { baseUrl } from "@/lib/site";

export default function robots() {
  // Explicit production check using multiple signals
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_SITE_URL &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost");

  // Log for debugging (remove in production after verification)
  console.log("Robots.txt config:", {
    NODE_ENV: process.env.NODE_ENV,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    isProd,
  });

  return {
    rules: [
      {
        userAgent: "*",
        allow: isProd ? "/" : [],
        disallow: isProd
          ? [
              "/api/", // Block API routes
              "/_next/", // Block Next.js internals
              "/admin/", // Block admin if exists
            ]
          : ["/"], // Block everything in dev/preview
      },
      // Block AI crawlers (optional)
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
    ],
    sitemap: isProd ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
```

**Testing**:

```bash
# Test locally:
npm run build
npm start
curl http://localhost:3000/robots.txt

# Expected output:
User-agent: *
Disallow: /

# Test in production (after deploy):
curl https://colossus-scaffolding.vercel.app/robots.txt

# Expected output:
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: https://colossus-scaffolding.vercel.app/sitemap.xml
```

---

### 3. Add LocalBusiness Schema to Location Pages [HIGH]

**Time**: 3 hours
**Impact**: HIGH - Enables Google Local Pack visibility
**File**: `app/locations/[slug]/page.tsx`

#### Step 1: Create Location Schema Helper (45 min)

Create `lib/location-schema.ts`:

```typescript
// lib/location-schema.ts
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "@/lib/business-info";
import { absUrl } from "@/lib/site";

export function getLocalBusinessSchema(locationName: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absUrl(`/locations/${slug}#localbusiness`),
    name: `${BUSINESS_INFO.name.display} - ${locationName}`,
    description: `Professional scaffolding services in ${locationName}. TG20:21 compliant, CHAS accredited, fully insured.`,
    url: absUrl(`/locations/${slug}`),
    telephone: BUSINESS_INFO.phone.schema,
    email: BUSINESS_INFO.email.general,
    // Main business address (not location-specific office)
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    // Service area for this location
    areaServed: {
      "@type": "City",
      name: locationName,
    },
    priceRange: "££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "CHAS Accreditation",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "CISRS Qualified Teams",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "compliance",
        name: "TG20:21 Compliance",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "127",
    },
    image: absUrl("/static/logo.png"),
    logo: absUrl("/Colossus-Scaffolding-Logo.svg"),
    sameAs: [BUSINESS_INFO.social.facebook, BUSINESS_INFO.social.linkedin],
  };
}
```

#### Step 2: Update Location Page (30 min)

Edit `app/locations/[slug]/page.tsx`:

```typescript
import { getLocalBusinessSchema } from "@/lib/location-schema";

// In the component, after existing schemas:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(getLocalBusinessSchema(locationData.title, slug)),
  }}
/>
```

#### Step 3: Test Schema (15 min)

```bash
# Build and start:
npm run build && npm start

# Test with Google Rich Results Test:
# Visit: https://search.google.com/test/rich-results
# Enter: http://localhost:3000/locations/brighton
# Verify: LocalBusiness schema detected
```

---

### 4. Add Priority to Hero Images [HIGH]

**Time**: 1 hour
**Impact**: MEDIUM - Improves LCP (Largest Contentful Paint)
**Files**: `components/ui/service-hero.tsx`, `components/ui/hero-section.tsx`

#### Update ServiceHero Component:

```typescript
// components/ui/service-hero.tsx
<Image
  src={getImageUrl(heroImage)}
  alt={`${title} - Professional scaffolding services`}
  fill
  sizes="100vw"
  priority={true}  // ADD THIS
  style={{ objectFit: "cover" }}
/>
```

#### Update HeroSection Component:

```typescript
// components/ui/hero-section.tsx
{heroImage && (
  <div className="absolute inset-0 z-0">
    <Image
      src={getImageUrl(heroImage)}
      alt={title}
      fill
      sizes="100vw"
      priority={true}  // ADD THIS
      style={{ objectFit: "cover" }}
    />
  </div>
)}
```

---

### 5. Optimize Title Tags for Length [HIGH]

**Time**: 1 hour
**Impact**: HIGH - Improves CTR from search results
**File**: `app/services/[slug]/page.tsx`

#### Current Problem:

```typescript
optimizedTitle =
  serviceData.seoTitle || `${serviceData.title} | ${locationName} | Colossus Scaffolding`;
// Result: 66+ characters (truncated in Google)
```

#### Fixed Version:

```typescript
// Optimize title for location-specific services (under 60 chars)
if (isLocationSpecific && locationContext) {
  const { locationName } = locationContext;

  // Calculate available space: 60 chars - " | Colossus" = 49 chars
  const maxServiceLocationLength = 49;
  const serviceLocationCombo = `${serviceName} ${locationName}`;

  if (serviceLocationCombo.length <= maxServiceLocationLength) {
    optimizedTitle = `${serviceName} ${locationName} | Colossus`;
  } else {
    // Truncate service name if needed
    const maxServiceLength = maxServiceLocationLength - locationName.length - 1;
    const truncatedService = serviceName.substring(0, maxServiceLength);
    optimizedTitle = `${truncatedService} ${locationName} | Colossus`;
  }
} else {
  // General service title
  optimizedTitle = serviceData.seoTitle || `${serviceName} | Colossus Scaffolding`;
}

// Examples:
// "Commercial Scaffolding Brighton | Colossus" (47 chars) ✅
// "Access Scaffolding | Colossus Scaffolding" (41 chars) ✅
```

---

## WEEK 2: HIGH IMPACT FIXES (8 hours)

### 6. Add Image Alt Text Optimization [HIGH]

**Time**: 3 hours
**Impact**: MEDIUM - Improves image SEO and accessibility

**Strategy**: Audit all images and add descriptive, keyword-rich alt text.

#### Script to Find Missing/Generic Alt Text:

```bash
cd sites/colossus-reference
grep -r 'alt=' components/ --include="*.tsx" | grep -E 'alt="""|alt="Image"|alt="Hero'
```

#### Examples of Good vs Bad Alt Text:

**Bad**:

```typescript
alt = "Colossus Scaffolding";
alt = "Hero image";
alt = "Service image";
```

**Good**:

```typescript
alt = "TG20:21 compliant access scaffolding installation on Victorian terrace in Brighton";
alt = "Professional facade scaffolding for commercial building renovation in East Sussex";
alt = "CISRS qualified scaffolding team erecting industrial scaffolding system";
```

#### Template for Alt Text:

```
[Type] scaffolding [action] [for/on] [building type] [in location]
```

#### Files to Update:

1. `components/ui/service-hero.tsx`
2. `components/ui/hero-section.tsx`
3. `components/ui/large-feature-cards.tsx`
4. `components/ui/service-showcase.tsx`
5. All other image components

---

### 7. Implement Service-to-Service Cross-Linking [MEDIUM]

**Time**: 2 hours
**Impact**: MEDIUM - Improves internal link equity

#### Step 1: Create Related Services Map (30 min)

Create `lib/related-services.ts`:

```typescript
// lib/related-services.ts
export const RELATED_SERVICES: Record<
  string,
  Array<{ slug: string; title: string; relation: string }>
> = {
  "access-scaffolding": [
    { slug: "edge-protection", title: "Edge Protection", relation: "for fall prevention" },
    {
      slug: "scaffold-towers-mast-systems",
      title: "Scaffold Towers",
      relation: "for mobile access",
    },
    {
      slug: "temporary-roof-systems",
      title: "Temporary Roofing",
      relation: "for weather protection",
    },
  ],
  "facade-scaffolding": [
    { slug: "access-scaffolding", title: "Access Scaffolding", relation: "for internal work" },
    { slug: "edge-protection", title: "Edge Protection", relation: "for safety compliance" },
    {
      slug: "commercial-scaffolding",
      title: "Commercial Scaffolding",
      relation: "for large projects",
    },
  ],
  "edge-protection": [
    { slug: "access-scaffolding", title: "Access Scaffolding", relation: "often combined with" },
    {
      slug: "temporary-roof-systems",
      title: "Temporary Roofing",
      relation: "for complete protection",
    },
    {
      slug: "scaffolding-inspections-maintenance",
      title: "Inspections",
      relation: "for ongoing compliance",
    },
  ],
  // ... add more mappings
};
```

#### Step 2: Create Related Services Component (45 min)

Create `components/ui/related-services.tsx`:

```typescript
// components/ui/related-services.tsx
import Link from "next/link";
import { RELATED_SERVICES } from "@/lib/related-services";

interface Props {
  currentServiceSlug: string;
}

export function RelatedServices({ currentServiceSlug }: Props) {
  const related = RELATED_SERVICES[currentServiceSlug];

  if (!related || related.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-standard">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          Related Scaffolding Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-blue mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Often used {service.relation}
              </p>
              <span className="text-brand-blue text-sm font-medium group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### Step 3: Add to Service Pages (15 min)

Edit `app/services/[slug]/page.tsx`:

```typescript
import { RelatedServices } from "@/components/ui/related-services";

// In the return statement, before ServiceCTA:
<RelatedServices currentServiceSlug={slug} />
<ServiceCTA />
```

---

### 8. Create Sitemap Index [MEDIUM]

**Time**: 2 hours
**Impact**: MEDIUM - Better crawl efficiency as site grows

#### Current Sitemap:

- Single file with 76 URLs

#### New Structure:

- `/sitemap.xml` (index)
- `/sitemap-services.xml` (25 service URLs)
- `/sitemap-locations.xml` (37 location URLs)
- `/sitemap-pages.xml` (static pages)

#### Implementation:

Rename `app/sitemap.ts` to `app/sitemap/route.ts` and update:

```typescript
// app/sitemap/route.ts (sitemap index)
import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-services.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-locations.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
```

Create individual sitemaps:

- `app/sitemap-services/route.ts`
- `app/sitemap-locations/route.ts`
- `app/sitemap-pages/route.ts`

---

## TESTING CHECKLIST

After implementing all fixes, verify:

- [ ] NAP consistency across all pages (header, footer, schema)
- [ ] Phone number formats correctly (display vs tel vs schema)
- [ ] Robots.txt allows crawling in production
- [ ] LocalBusiness schema validated (Google Rich Results Test)
- [ ] Hero images load with priority attribute
- [ ] Title tags under 60 characters on all pages
- [ ] Alt text descriptive on all images
- [ ] Related services links working
- [ ] Sitemap index accessible and valid
- [ ] No console errors in browser
- [ ] Mobile responsive (test on real device)

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

1. **Environment Variables**:
   - [ ] NEXT_PUBLIC_SITE_URL set correctly
   - [ ] NODE_ENV=production in Vercel

2. **Search Console**:
   - [ ] Submit new sitemap index
   - [ ] Request re-indexing of updated pages

3. **Monitoring**:
   - [ ] Check robots.txt is correct: `curl https://[domain]/robots.txt`
   - [ ] Verify sitemap: `curl https://[domain]/sitemap.xml`
   - [ ] Test schema: Google Rich Results Test

4. **Analytics**:
   - [ ] Set baseline metrics (traffic, rankings)
   - [ ] Monitor for 1 week post-deployment
   - [ ] Compare before/after metrics at 2 weeks

---

## EXPECTED RESULTS

**Immediate (1-7 days)**:

- NAP consistency score: 100%
- Schema validation: 0 errors
- Page speed improvement: +5-10 points
- Technical SEO score: +5-7 points

**Short-term (2-4 weeks)**:

- Google recrawl of all pages
- Local pack eligibility restored
- Click-through rate improvement: +10-20%
- Keyword ranking improvements: 3-5 positions

**Medium-term (1-3 months)**:

- Organic traffic: +20-30%
- Local search visibility: +30-40%
- Featured snippet appearances: 2-5 keywords
- Top 10 rankings: +10-15 keywords

---

**Next Steps After Week 2**:
Proceed to Month 2-3 priorities from main audit report.
