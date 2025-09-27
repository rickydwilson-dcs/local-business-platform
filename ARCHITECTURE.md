# **COLOSSUS SCAFFOLDING ARCHITECTURAL GUIDELINES**

**Universal standards for all developers - human and AI code generators**

### **📁 FILE STRUCTURE & ORGANIZATION**

**Strict Directory Structure:**

```
/components/ui/          - All reusable UI components
/content/locations/      - All location MDX files (.mdx only)
/content/services/       - All service MDX files (.mdx only)
/app/                    - Next.js app router pages
/public/                 - Static assets
```

**Rules:**

- ❌ NO components outside `/components/ui/`
- ❌ NO content files outside `/content/`
- ❌ NO mixing .tsx and .mdx in same directories
- ✅ Always use established directory patterns

### **🎨 STYLING STANDARDS**

**Tailwind CSS Only:**

- ✅ ALL styling via Tailwind utility classes
- ❌ NO inline styles (style={{}} properties)
- ❌ NO styled-components or CSS-in-JS
- ❌ NO custom CSS files unless absolutely necessary

**Maintainable Styling System:**

- ✅ **REQUIRED**: All repeated styling patterns must be extracted to maintainable classes in `globals.css`
- ✅ **PROCESS**: Before creating new styling elements, check if similar patterns exist
- ✅ **APPROVAL**: New maintainable classes must be agreed upon and added to `globals.css` before use
- ❌ **FORBIDDEN**: Creating similar styling patterns multiple times across components
- ❌ **FORBIDDEN**: Custom styling without establishing reusable classes

**Maintainable Class Examples:**

```css
/* globals.css - Approved maintainable classes */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors;
}
.card-interactive {
  @apply group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}
.section-standard {
  @apply py-16 lg:py-20;
}
```

**Component Styling:**

```tsx
// ✅ CORRECT - Maintainable classes
<button className="btn-primary">Click me</button>
<div className="card-interactive">Content</div>

// ✅ CORRECT - Tailwind utilities for unique styling
<div className="bg-blue-600 text-white p-4 rounded-lg">

// ❌ WRONG - Repeated custom patterns
<button className="inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors">
<button className="inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors">

// ❌ WRONG - Inline styles
<div style={{ backgroundColor: '#005A9E', color: 'white', padding: '16px' }}>

// ❌ WRONG - CSS-in-JS
const StyledDiv = styled.div`background: blue;`
```

**Styling Workflow:**

1. **Check existing**: Search `globals.css` for similar patterns
2. **Propose new class**: If pattern will be reused, propose maintainable class name
3. **Add to globals.css**: Create the class with `@apply` Tailwind utilities
4. **Use consistently**: Apply the class across all relevant components
5. **Document**: Add to this standards section if it establishes a new pattern

### **🧩 COMPONENT ARCHITECTURE**

**UI Components:**

- ✅ All reusable components in `/components/ui/`
- ✅ Accept props for customization
- ✅ Use TypeScript interfaces for all props
- ✅ Export as named exports, not default

**Component Props Pattern:**

```tsx
// ✅ CORRECT
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ variant, children, className }: ButtonProps) => {
  return (
    <button
      className={`base-classes ${variant === "primary" ? "bg-[#005A9E]" : "bg-gray-200"} ${className}`}
    >
      {children}
    </button>
  );
};
```

### **📂 CONTENT ARCHITECTURE PATTERNS - CRITICAL**

**MANDATORY MDX-FIRST ARCHITECTURE:**

```
✅ REQUIRED - All content categories use MDX as PRIMARY source:
/content/locations/[location].mdx     - Rich location content (PRIMARY)
/lib/locations.ts                     - Fallback data only (SECONDARY)
/app/locations/[slug]/page.tsx        - Dynamic routing (reads MDX first)
```

**MDX Content Priority System:**

```tsx
// ✅ CORRECT - MDX First approach
1. Check for /content/locations/[slug].mdx file
2. Parse MDX frontmatter and content
3. Render using existing component system
4. Fallback to /lib/locations.ts only if MDX missing
```

**PROHIBITED CONTENT PATTERNS:**

- ❌ Centralized data as primary content source
- ❌ Individual page files per content item (/app/locations/brighton/page.tsx)
- ❌ Content-specific loaders (/lib/brighton-content.ts)
- ❌ Bypassing MDX content system

**Dynamic Route Requirements:**

```tsx
// ✅ REQUIRED in /app/locations/[slug]/page.tsx
export default async function LocationPage({ params }: { params: { slug: string } }) {
  // 1. FIRST: Try to read MDX file
  const mdxContent = await readMDXFile(`/content/locations/${params.slug}.mdx`);

  if (mdxContent) {
    // Use rich MDX content with full component system
    return renderMDXContent(mdxContent);
  }

  // 2. FALLBACK: Use centralized data only if no MDX
  const fallbackData = getLocationFromCentralized(params.slug);
  return renderFallbackContent(fallbackData);
}
```

### **📄 CONTENT MANAGEMENT**

**MDX Files (Primary Content):**

- ✅ ALL rich content in appropriate `/content/` subdirectories
- ✅ Use comprehensive frontmatter for metadata
- ✅ Full component-mappable structure
- ✅ Local customization and detailed content
- ❌ NO content hardcoded in components

**Centralized Data (Fallback Only):**

- ✅ Basic fallback data in `/lib/[category].ts`
- ✅ Simple structure for locations without MDX
- ❌ NOT primary content source
- ❌ Should not replace rich MDX content

### **📝 CONTENT ACCURACY & CLAIMS**

**CRITICAL: Truthful Content Standards**

- ✅ **CAPABILITIES**: Use "We can scaffold...", "Our team can work on...", "We specialize in..."
- ✅ **EXPERTISE**: Describe knowledge, understanding, and ability to handle specific challenges
- ✅ **QUALIFICATIONS**: Reference actual certifications (TG20:21, CISRS, etc.)
- ❌ **FALSE CLAIMS**: Never claim specific work history without verification
- ❌ **UNFOUNDED STATEMENTS**: Avoid "We've worked on...", "We regularly scaffold...", "We've completed..."

**Content Language Guidelines:**

```tsx
// ✅ CORRECT - Capability focused
"We can scaffold everything from Victorian terraces to modern developments";
"Our team can handle the access challenges of narrow streets";
"We understand the requirements of conservation areas";
"We're equipped to work on heritage buildings";

// ❌ WRONG - Unverified claims
"We've scaffolded everything from Victorian terraces to modern developments";
"Our team regularly works on narrow street projects";
"We've completed hundreds of conservation area projects";
"We've worked on heritage buildings across the city";
```

**Professional Positioning:**

- ✅ Focus on **ability**, **knowledge**, **qualifications**, and **equipment**
- ✅ Demonstrate **understanding** of local challenges and requirements
- ✅ Highlight **compliance**, **certifications**, and **professional standards**
- ❌ Never fabricate **work history**, **client lists**, or **project portfolios**
- ❌ Avoid **specific claims** that cannot be substantiated

**Enforcement:**

- All content must be reviewed for unsubstantiated claims before publication
- Any language suggesting completed work must be verified or changed to capability language
- Location content should focus on area knowledge and ability to serve, not claimed work history

**Frontmatter Standard:**

```yaml
---
title: "Page Title"
description: "SEO description"
keywords: ["keyword1", "keyword2"]
hero:
  title: "Hero Title"
  description: "Hero description"
specialists:
  title: "Section Title"
  cards: [...]
services:
  cards: [...]
pricing:
  packages: [...]
# Full structured content here
---
```

### **🔍 SEO STANDARDS**

**Meta Data Requirements:**

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

**SEO Content Rules:**

- ✅ H1 tag must contain primary keyword
- ✅ H2/H3 hierarchy must be logical and include related keywords
- ✅ Meta descriptions 150-160 characters max
- ✅ Page titles under 60 characters
- ✅ Images must have descriptive alt text
- ✅ Internal linking to related pages/services
- ❌ NO keyword stuffing
- ❌ NO duplicate content across pages

**Local SEO Requirements:**

```tsx
// ✅ For location pages, include
title: "[Service] in [Location] | Company Name"
description: "Professional [service] in [location] - [key benefits]. [Credentials]. Free quotes 24/7."

// ✅ Content must include
- Location name in H1
- Local landmarks/areas mentioned naturally
- Service + location combinations
- Local business information
```

### **🖼️ IMAGE OPTIMIZATION STANDARDS**

**Next.js 15 Image Configuration:**

Our `next.config.ts` includes optimized image settings for the scaffolding business:

```typescript
// next.config.ts - Image optimization configuration
images: {
  domains: [], // Add external domains if needed
  dangerouslyAllowSVG: true, // For logos and icons
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Component-level sizes
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1-year cache for performance
}
```

**Image Quality Configuration:**

Use the centralized image quality settings from `/lib/image-config.ts`:

```typescript
// lib/image-config.ts - Quality settings for 10% better compression
export const DEFAULT_IMAGE_QUALITY = 65; // Reduced from 75 for ~10% compression
export const HIGH_QUALITY = 80; // Hero images and critical visuals
export const LOW_QUALITY = 50; // Thumbnails and non-critical images

// Business-specific configurations
export const scaffoldingImageConfig = {
  project: { quality: 65, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" },
  hero: { quality: 80, sizes: "100vw", priority: true },
  service: { quality: 65, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" },
  team: { quality: 65, sizes: "(max-width: 768px) 100vw, 300px" },
};
```

**Image Component Usage:**

```tsx
// ✅ CORRECT - Using quality settings and proper sizing
import Image from 'next/image';
import { getImageQuality, scaffoldingImageConfig } from '@/lib/image-config';

// Hero image with high quality
<Image
  src="/hero-scaffolding.jpg"
  alt="Professional scaffolding services in Brighton"
  width={1920}
  height={1080}
  quality={getImageQuality('hero')}
  priority={true}
  sizes={scaffoldingImageConfig.hero.sizes}
  className="w-full h-auto"
/>

// Project gallery image with optimized quality
<Image
  src="/project-example.jpg"
  alt="Residential scaffolding project in East Sussex"
  width={800}
  height={600}
  quality={getImageQuality('content')}
  sizes={scaffoldingImageConfig.project.sizes}
  className="rounded-lg"
/>

// Thumbnail with low quality for faster loading
<Image
  src="/service-thumb.jpg"
  alt="Access scaffolding service thumbnail"
  width={300}
  height={200}
  quality={getImageQuality('thumbnail')}
  sizes={scaffoldingImageConfig.service.sizes}
  className="object-cover"
/>
```

**Modern Format Support:**

Next.js 15 automatically serves WebP and AVIF formats when browsers support them:

- ✅ **WebP**: ~25-35% smaller than JPEG with same quality
- ✅ **AVIF**: ~50% smaller than JPEG with better quality
- ✅ **Automatic fallback**: JPEG for unsupported browsers
- ✅ **Progressive loading**: Built-in blur placeholders

**Image Optimization Rules:**

- ✅ **Always use Next.js Image component** for all images
- ✅ **Set explicit width/height** to prevent layout shift
- ✅ **Use quality settings from lib/image-config.ts** consistently
- ✅ **Add descriptive alt text** with keywords where natural
- ✅ **Use priority={true}** for above-fold images only
- ✅ **Configure responsive sizes** for different breakpoints
- ❌ **NO direct img tags** except for external/unoptimized images
- ❌ **NO hardcoded quality values** (use centralized config)
- ❌ **NO missing alt text** on any images

**Performance Benefits:**

- **10% smaller files**: Quality reduced from 75 to 65
- **Automatic format conversion**: WebP/AVIF when supported
- **Responsive images**: Correct size served per device
- **Lazy loading**: Images load as user scrolls
- **1-year caching**: Faster repeat visits

## **⚡ PERFORMANCE OPTIMIZATION STANDARDS**

### **Critical CSS Inlining**

**Performance Strategy**: Critical above-the-fold CSS is inlined directly in `app/layout.tsx` to eliminate render-blocking CSS and reduce critical path latency by 100-150ms.

**Critical CSS Implementation:**

```typescript
// app/layout.tsx - Critical CSS inlined in <head>
const criticalStyles = `
  /* Above-the-fold styles only */
  body { /* Base styles */ }
  header { /* Header container */ }
  nav { /* Navigation */ }
  .btn-primary { /* CTA buttons */ }
  main { /* Content container */ }
`;

return (
  <html lang="en">
    <head>
      <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
    </head>
    {/* ... rest of layout */}
  </html>
);
```

**Critical CSS Rules:**

- ✅ **INLINE**: Above-the-fold styles (body, header, nav, main container, primary buttons)
- ✅ **RESPONSIVE**: Include mobile/desktop breakpoints for critical elements
- ✅ **EXACT MATCH**: Styles must match current Tailwind output exactly
- ❌ **NON-CRITICAL**: Keep forms, utilities, page-specific styles in globals.css
- ❌ **OVER-INLINING**: Only include styles visible before user interaction

**Target Elements:**

- Body base styles (background, text color, font smoothing)
- Header layout and styling
- Navigation container and links with hover states
- Desktop phone/CTA container positioning
- Main content container responsive layout
- Primary button styling and interactions

**Performance Impact:**

- **Expected Reduction**: 100-150ms critical path latency
- **Trade-off**: ~2KB additional inline CSS for faster initial render
- **Benefit**: Above-the-fold content styled immediately without CSS blocking

### **📊 SCHEMA MARKUP RULES**

**Required Schema Types:**

```tsx
// ✅ Local Business Schema (all location pages)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Colossus Scaffolding",
  description: "Professional scaffolding services in [location]",
  address: {
    "@type": "PostalAddress",
    addressLocality: "[City]",
    addressRegion: "[County]",
    addressCountry: "GB",
  },
  telephone: "+44-xxx-xxx-xxxx",
  url: "https://domain.com/locations/[location]",
  areaServed: "[Location] and surrounding areas",
  serviceType: "Scaffolding Services",
};

// ✅ FAQPage Schema (pages with FAQs)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Question text",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Answer text",
      },
    },
  ],
};

// ✅ BreadcrumbList Schema (all pages)
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://domain.com/",
    },
  ],
};
```

**Schema Implementation:**

```tsx
// ✅ Add to page head
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
/>
```

**Schema Rules:**

- ✅ Every location page needs LocalBusiness schema
- ✅ Pages with FAQs need FAQPage schema
- ✅ All pages need Breadcrumb schema
- ✅ Service pages need Service schema
- ✅ Use structured data testing tool to validate
- ❌ NO invalid or incomplete schema markup
- ❌ NO schema types not relevant to page content

### **🏷️ STRUCTURED DATA STANDARDS**

**Image Requirements:**

```tsx
// ✅ All images must have
<img
  src="/path/to/image.jpg"
  alt="Descriptive alt text with keywords where natural"
  width={800}
  height={600}
  loading="lazy" // except above fold images
/>
```

**Heading Hierarchy:**

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

### **⚛️ REACT PATTERNS**

**Component Structure:**

```tsx
// ✅ CORRECT - Clean, typed, reusable
interface ComponentProps {
  title: string;
  items: Array<{ name: string; value: string }>;
}

export const ComponentName = ({ title, items }: ComponentProps) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {items.map((item) => (
        <div key={item.name} className="mb-2">
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
};
```

## **🚨 CRITICAL: ARCHITECTURE INVESTIGATION FIRST**

**BEFORE implementing ANY feature, ALL developers (human or AI) MUST complete this mandatory investigation phase:**

### **Phase 1: Pattern Discovery (MANDATORY)**

```bash
# Step 1: Identify existing routing patterns
find app -name "*.tsx" -path "*/[slug]/*" | head -10

# Step 2: Read the relevant routing file FIRST
# For services: ALWAYS read app/services/[slug]/page.tsx BEFORE coding
# For locations: ALWAYS read app/locations/[slug]/page.tsx BEFORE coding

# Step 3: Understand the data architecture
# Check: Is content sourced from MDX files or TypeScript data structures?
# Verify: How do existing implementations actually work?
```

### **Phase 2: Architecture Pattern Confirmation (MANDATORY)**

Before writing ANY code, confirm these critical patterns:

**Services Architecture (Dual System):**

```bash
# ✅ CORRECT: Services use DUAL ARCHITECTURE
# Route Generation: Minimal MDX files in content/services/ (for generateStaticParams)
# Content Source: Centralized serviceDataMap in app/services/[slug]/page.tsx
# Pattern: MDX files provide routing structure, TypeScript provides content

# Structure:
# content/services/[service].mdx        ← Minimal frontmatter only (routing)
# app/services/[slug]/page.tsx          ← serviceDataMap + rendering logic
# generateStaticParams()                ← Reads MDX files to build routes

# ❌ WRONG: Rich content in MDX files (content comes from serviceDataMap)
# ❌ WRONG: Deleting MDX files entirely (breaks route generation)
# ❌ WRONG: Assuming services follow pure location patterns
```

**Locations Architecture (UNIFIED TEMPLATE):**

```bash
# ✅ CORRECT: Locations use unified dynamic template with MDX-first architecture
# Content: Rich MDX files in content/locations/[location].mdx
# Template: Single dynamic route app/locations/[slug]/page.tsx handles ALL locations
# Features: Conditional rendering for towns directory, hero images, pricing, etc.
# Data Flow: MDX frontmatter → props → conditional component rendering

# ❌ WRONG: Creating static pages like app/locations/surrey/page.tsx
# ❌ WRONG: Using centralized data files for locations
# ❌ WRONG: Individual location-specific components or routing
```

### **Phase 3: Implementation Path Confirmation (MANDATORY)**

**For Services:**

- [ ] Confirmed serviceDataMap exists in app/services/[slug]/page.tsx
- [ ] Verified existing services use dual architecture (minimal MDX + data map)
- [ ] Checked that minimal MDX files exist for route generation
- [ ] Ready to add new service to serviceDataMap AND create minimal MDX file

**For Locations:**

- [ ] Confirmed MDX files exist in content/locations/
- [ ] Verified existing locations follow MDX-first pattern
- [ ] Checked that routing file reads MDX content
- [ ] Ready to create new .mdx file with proper frontmatter

## **🔍 HYBRID ARCHITECTURE UNDERSTANDING**

This codebase uses **DIFFERENT PATTERNS** for different content types:

### **Services = Dual Architecture (Routing + Data)**

- **Route Generation**: Minimal MDX files in content/services/ (frontmatter only)
- **Content Source**: TypeScript objects in serviceDataMap (app/services/[slug]/page.tsx)
- **Build Process**: generateStaticParams() reads MDX files to create routes
- **Rendering**: Rich content from centralized serviceDataMap, not MDX content
- **Pattern**: MDX provides structure, TypeScript provides all actual content

### **Locations = MDX-First (File-Based)**

- **Primary Source**: Individual .mdx files in content/locations/
- **Content**: Rich markdown with comprehensive frontmatter
- **Routing**: Dynamic route reads filesystem for MDX content
- **Pattern**: Each location gets its own detailed .mdx file

## **🚫 MANDATORY VIOLATION PREVENTION**

**These actions indicate you DID NOT follow the discovery protocol:**

### **Service Implementation Violations:**

- ❌ Creating rich content in MDX files (content should be in serviceDataMap)
- ❌ Deleting all MDX files (breaks route generation in generateStaticParams)
- ❌ Building pure file-based service architecture without serviceDataMap
- ❌ Ignoring the dual architecture pattern (both MDX structure + data content needed)

### **Location Implementation Violations:**

- ❌ Adding location data to centralized TypeScript files
- ❌ Assuming locations use data structures like services
- ❌ Creating static page files like app/locations/surrey/page.tsx (DELETED - USE DYNAMIC ROUTING ONLY)
- ❌ Bypassing the unified dynamic location template at app/locations/[slug]/page.tsx
- ❌ Creating individual location-specific components or loaders
- ❌ Hardcoding location data instead of using MDX frontmatter

## **🎯 CORRECT IMPLEMENTATION APPROACHES**

### **Adding New Services (Dual Architecture Pattern):**

```typescript
// ✅ STEP 1: Add to serviceDataMap in app/services/[slug]/page.tsx
"new-service-slug": {
  title: "New Service Title",
  description: "Service description...",
  badge: "Service Badge",
  benefits: [
    "Benefit 1",
    "Benefit 2"
  ],
  faqs: [
    {
      question: "Question?",
      answer: "Answer..."
    }
  ]
}
```

```mdx
## // ✅ STEP 2: Create minimal MDX file: content/services/new-service-slug.mdx

title: "New Service Title"
description: "Service description for SEO..."

---
```

### **Adding New Locations (Unified Template Pattern):**

```mdx
## // ✅ CORRECT: Create content/locations/new-location.mdx

title: "New Location"
seoTitle: "New Location Scaffolding Services | Colossus Scaffolding"
description: "Professional scaffolding services in New Location..."
keywords: ["scaffolding new-location", "new-location scaffolding hire"]
heroImage: "/New-Location-Scaffolding.png"
hero:
title: "Professional Scaffolding in New Location"
description: "Local expertise for New Location's unique challenges..."
phone: "01424 466 661"
trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
ctaText: "Get Your Free Quote"
ctaUrl: "/contact"
specialists:
title: "New Location Scaffolding Specialists"
cards: [...]
services:
cards: [...]
pricing:
packages: [...]

# Towns directory for counties only

towns:
title: "New Location Towns We Serve"
townsList: [...]

---

## Markdown content renders below structured sections
```

**Key Features of Unified Template:**

- ✅ Automatic hero image display via heroImage frontmatter
- ✅ Conditional towns directory rendering for counties
- ✅ Structured sections (specialists, services, pricing) via frontmatter
- ✅ No-wrap phone button styling built-in
- ✅ Single template handles both town and county content types

## **⚡ IMMEDIATE VIOLATION DETECTION**

If you create any of these patterns, you have violated the architecture:

```bash
# 🚨 SERVICE VIOLATIONS (Architectural errors):
# Creating rich content in service MDX files (content should be in serviceDataMap)
# Deleting all service MDX files (breaks generateStaticParams route generation)
# Building service architecture without serviceDataMap (missing centralized data)

# 🚨 LOCATION VIOLATIONS (Delete immediately):
app/locations/brighton/page.tsx
app/locations/hastings/page.tsx
lib/brighton-data.ts
lib/hastings-data.ts
```

## **🔧 VIOLATION RECOVERY PROCESS**

If violations are discovered:

1. **STOP all development immediately**
2. **DELETE violation files** listed above
3. **READ the correct architecture patterns** in existing code
4. **RESTART implementation** following established patterns
5. **VERIFY implementation** matches existing content type

## **✅ ARCHITECTURE DISCOVERY CHECKLIST**

Before ANY content implementation:

- [ ] **Read existing routing file** for the content type
- [ ] **Understand data source pattern** (MDX vs TypeScript)
- [ ] **Confirm content structure** matches existing implementations
- [ ] **Identify correct implementation approach** (file vs data)
- [ ] **Verify no architectural violations** in planned approach
- [ ] **Test implementation** matches established patterns

## **🎯 SUCCESS CRITERIA**

Your implementation is correct when:

**Services:**

- [ ] New service added to serviceDataMap in existing routing file
- [ ] Minimal MDX file created in content/services/ (frontmatter only)
- [ ] Service data follows existing TypeScript pattern in serviceDataMap
- [ ] Service page renders using existing component system
- [ ] generateStaticParams() can find the service for route generation

**Locations:**

- [ ] New .mdx file created in content/locations/
- [ ] Content follows established MDX frontmatter pattern
- [ ] Location renders via existing dynamic routing
- [ ] No centralized data files created for the location

## **🚨 ENFORCEMENT PRIORITY**

This discovery protocol is **MORE IMPORTANT** than any feature request. If asked to implement something that violates architecture patterns, you must:

1. **Refuse to implement** the violating approach
2. **Explain the architectural requirement** to follow established patterns
3. **Propose the correct approach** based on discovery findings
4. **Implement only** using established architectural patterns

**NO EXCEPTIONS:** Architecture consistency prevents the exact chaos we experienced with multiple AI instances creating incompatible implementations.

### **🚫 WHAT NOT TO DO**

**Banned Practices:**

- ❌ Inline styles anywhere
- ❌ Components outside `/components/ui/`
- ❌ Hardcoded content in components
- ❌ Custom CSS unless approved
- ❌ Any styling not using Tailwind
- ❌ **Repeated styling patterns without maintainable classes**
- ❌ **Creating new styling elements without checking globals.css first**
- ❌ Default exports for UI components
- ❌ Props without TypeScript interfaces
- ❌ Pages without proper meta data
- ❌ Missing or invalid schema markup
- ❌ Images without alt text
- ❌ Broken heading hierarchy
- ❌ **CRITICAL: Using centralized data as primary content source (locations)**
- ❌ **CRITICAL: Individual location page files**
- ❌ **CRITICAL: Content-specific loaders**
- ❌ **CRITICAL: Implementing services without architecture discovery first**

### **✅ QUALITY CHECKLIST**

**Before completing any task, verify:**

- [ ] **MANDATORY: Architecture Discovery Protocol completed first**
- [ ] All new components in `/components/ui/`
- [ ] All styling uses Tailwind classes only
- [ ] **Styling:** All repeated patterns extracted to maintainable classes in `globals.css`
- [ ] **Styling:** No duplicate styling patterns across components
- [ ] **Styling:** New styling elements checked against existing classes first
- [ ] All props have TypeScript interfaces
- [ ] No inline styles anywhere
- [ ] Content in appropriate `/content/` directory
- [ ] Consistent with existing patterns
- [ ] No hardcoded content in components
- [ ] **SEO:** Proper meta data included
- [ ] **SEO:** H1/H2/H3 hierarchy correct
- [ ] **SEO:** Images have alt text
- [ ] **Schema:** Appropriate schema markup added
- [ ] **Schema:** Schema validates with testing tools
- [ ] **Accessibility:** WCAG AA compliance maintained
- [ ] **CRITICAL:** Services use dual architecture (minimal MDX + serviceDataMap)
- [ ] **CRITICAL:** Locations use MDX-first architecture
- [ ] **CRITICAL:** No Architecture Violations: Implementation follows discovered patterns
- [ ] **CRITICAL:** Route generation works (services have minimal MDX files)

### **🔄 REFACTORING PRIORITY**

**When modifying existing code:**

1. **Complete architecture discovery first** - Understand existing patterns
2. **Fix architecture violations** - Ensure correct dual/MDX patterns
3. **Fix styling** - Remove inline styles, use Tailwind
4. **Move components** - Relocate to `/components/ui/` if reusable
5. **Extract content** - Move hardcoded content to appropriate structure
6. **Add TypeScript** - Ensure all props are typed
7. **SEO audit** - Add missing meta data and schema
8. **Accessibility check** - Ensure compliance maintained

### **📋 EXAMPLE TASK COMPLETION**

**When asked to "create service pages":**

1. ✅ **FIRST:** Complete Architecture Discovery Protocol
2. ✅ **DISCOVER:** Services use dual architecture (minimal MDX + serviceDataMap)
3. ✅ **IMPLEMENT:** Add service data to serviceDataMap in app/services/[slug]/page.tsx
4. ✅ **IMPLEMENT:** Create minimal MDX file in content/services/[service].mdx
5. ✅ **VERIFY:** generateStaticParams() can find the service
6. ✅ **TEST:** Service page renders with content from serviceDataMap
7. ✅ **VALIDATE:** No architectural violations exist

**When asked to "create location pages":**

1. ✅ **FIRST:** Complete Architecture Discovery Protocol
2. ✅ **DISCOVER:** Locations use MDX-first architecture
3. ✅ Create rich MDX content in `/content/locations/[location].mdx`
4. ✅ Ensure dynamic route reads MDX files as primary source
5. ✅ Use existing components with Tailwind classes only
6. ✅ Include comprehensive local content and knowledge
7. ✅ Add appropriate schema markup from MDX frontmatter
8. ✅ Include proper heading hierarchy and local SEO
9. ✅ Add descriptive alt text to any images
10. ✅ Test pages use MDX content, not centralized fallback
11. ✅ Validate schema with Google's testing tool
12. ✅ Verify no architecture violations exist

### **🛠️ TESTING REQUIREMENTS**

**Before marking task complete:**

- [ ] **CRITICAL:** Architecture Discovery Protocol completed and documented
- [ ] **CRITICAL:** Implementation follows discovered patterns exactly
- [ ] **Lighthouse SEO score:** 95+
- [ ] **Schema validation:** Pass Google's Rich Results Test
- [ ] **Accessibility:** Pass WCAG AA (contrast, alt text, headings)
- [ ] **Mobile responsive:** All breakpoints work correctly
- [ ] **Core Web Vitals:** LCP, CLS, FID within Google's thresholds
- [ ] **Services:** Content from serviceDataMap renders properly
- [ ] **Services:** Route generation works (minimal MDX files exist)
- [ ] **Locations:** Rich MDX content displays correctly (not fallback data)
- [ ] **Components:** All sourced from `/components/ui/`

### **⚠️ CRITICAL ARCHITECTURE RULES**

**MDX-FIRST CONTENT SYSTEM (LOCATIONS):**

- ✅ **PRIMARY:** Rich MDX files with comprehensive local content
- ✅ **SECONDARY:** Centralized data as fallback only
- ✅ **DYNAMIC ROUTING:** Must read MDX first, fallback second
- ❌ **NEVER:** Use centralized data as primary content source
- ❌ **NEVER:** Create individual page files per location
- ❌ **NEVER:** Create content-specific loaders

**DUAL ARCHITECTURE SYSTEM (SERVICES):**

- ✅ **ROUTE GENERATION:** Minimal MDX files in content/services/ for generateStaticParams()
- ✅ **CONTENT SOURCE:** Rich data in serviceDataMap within routing file
- ✅ **RENDERING:** Content comes from TypeScript data, not MDX
- ❌ **NEVER:** Delete all service MDX files (breaks route generation)
- ❌ **NEVER:** Put rich content in service MDX files
- ❌ **NEVER:** Build services without serviceDataMap

**VIOLATION DETECTION:**
Any of these files indicate architecture violations and must be corrected immediately:

**Location Violations (DELETE IMMEDIATELY):**

- `/app/locations/surrey/page.tsx` (DELETED)
- `/app/locations/kent/page.tsx` (DELETED)
- `/app/locations/east-sussex/page.tsx` (DELETED)
- `/app/locations/west-sussex/page.tsx` (DELETED)
- `/app/locations/[specific-location]/page.tsx` (any static location pages)
- `/lib/[specific-location]-content.ts` (location-specific data files)
- `/components/[location]-specific-component.tsx` (location-specific components)

**Service Violations:**

- Service architecture without both minimal MDX files AND serviceDataMap
- Rich content in service MDX files instead of serviceDataMap
- Deleting all service MDX files (breaks generateStaticParams)

**ENFORCEMENT:**
These rules are MANDATORY and NON-NEGOTIABLE. Any violations must be corrected immediately before proceeding with any other work. The Architecture Discovery Protocol MUST be completed before any implementation begins.
