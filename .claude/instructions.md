# **CLAUDE CODE ARCHITECTURAL GUIDELINES**

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
.btn-primary { @apply inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors; }
.card-interactive { @apply group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300; }
.section-standard { @apply py-16 lg:py-20; }
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
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
}

export const Button = ({ variant, children, className }: ButtonProps) => {
  return (
    <button className={`base-classes ${variant === 'primary' ? 'bg-[#005A9E]' : 'bg-gray-200'} ${className}`}>
      {children}
    </button>
  )
}
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
  const mdxContent = await readMDXFile(`/content/locations/${params.slug}.mdx`)

  if (mdxContent) {
    // Use rich MDX content with full component system
    return renderMDXContent(mdxContent)
  }

  // 2. FALLBACK: Use centralized data only if no MDX
  const fallbackData = getLocationFromCentralized(params.slug)
  return renderFallbackContent(fallbackData)
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
"We can scaffold everything from Victorian terraces to modern developments"
"Our team can handle the access challenges of narrow streets"
"We understand the requirements of conservation areas"
"We're equipped to work on heritage buildings"

// ❌ WRONG - Unverified claims
"We've scaffolded everything from Victorian terraces to modern developments"
"Our team regularly works on narrow street projects"
"We've completed hundreds of conservation area projects"
"We've worked on heritage buildings across the city"
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
    url: "https://domain.com/page-url"
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter title",
    description: "Twitter description"
  },
  alternates: {
    canonical: "https://domain.com/page-url"
  }
}
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

### **📊 SCHEMA MARKUP RULES**

**Required Schema Types:**
```tsx
// ✅ Local Business Schema (all location pages)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Colossus Scaffolding",
  "description": "Professional scaffolding services in [location]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[City]",
    "addressRegion": "[County]",
    "addressCountry": "GB"
  },
  "telephone": "+44-xxx-xxx-xxxx",
  "url": "https://domain.com/locations/[location]",
  "areaServed": "[Location] and surrounding areas",
  "serviceType": "Scaffolding Services"
}

// ✅ FAQPage Schema (pages with FAQs)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}

// ✅ BreadcrumbList Schema (all pages)
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://domain.com/"
    }
  ]
}
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
  title: string
  items: Array<{ name: string; value: string }>
}

export const ComponentName = ({ title, items }: ComponentProps) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {items.map(item => (
        <div key={item.name} className="mb-2">
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  )
}
```

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
- ❌ **CRITICAL: Using centralized data as primary content source**
- ❌ **CRITICAL: Individual location page files**
- ❌ **CRITICAL: Content-specific loaders**

### **✅ QUALITY CHECKLIST**

**Before completing any task, verify:**
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
- [ ] **CRITICAL:** MDX-First Architecture: Rich MDX content used as primary source
- [ ] **CRITICAL:** No Architecture Violations: No individual page files or content loaders
- [ ] **CRITICAL:** Dynamic Route: Reads MDX files first, centralized data as fallback only

### **🔄 REFACTORING PRIORITY**

**When modifying existing code:**
1. **Fix architecture first** - Ensure MDX-first pattern
2. **Fix styling** - Remove inline styles, use Tailwind
3. **Move components** - Relocate to `/components/ui/` if reusable
4. **Extract content** - Move hardcoded content to MDX files
5. **Add TypeScript** - Ensure all props are typed
6. **SEO audit** - Add missing meta data and schema
7. **Accessibility check** - Ensure compliance maintained

### **📋 EXAMPLE TASK COMPLETION**

**When asked to "create location pages":**
1. ✅ Create rich MDX content in `/content/locations/[location].mdx`
2. ✅ Ensure dynamic route reads MDX files as primary source
3. ✅ Use existing components with Tailwind classes only
4. ✅ Include comprehensive local content and knowledge
5. ✅ Add appropriate schema markup from MDX frontmatter
6. ✅ Include proper heading hierarchy and local SEO
7. ✅ Add descriptive alt text to any images
8. ✅ Test pages use MDX content, not centralized fallback
9. ✅ Validate schema with Google's testing tool
10. ✅ Verify no architecture violations exist

### **🛠️ TESTING REQUIREMENTS**

**Before marking task complete:**
- [ ] **Lighthouse SEO score:** 95+
- [ ] **Schema validation:** Pass Google's Rich Results Test
- [ ] **Accessibility:** Pass WCAG AA (contrast, alt text, headings)
- [ ] **Mobile responsive:** All breakpoints work correctly
- [ ] **Core Web Vitals:** LCP, CLS, FID within Google's thresholds
- [ ] **CRITICAL:** MDX content renders properly (not fallback data)
- [ ] **CRITICAL:** Rich local content displays correctly
- [ ] **CRITICAL:** All components sourced from `/components/ui/`

### **⚠️ CRITICAL ARCHITECTURE RULES**

**MDX-FIRST CONTENT SYSTEM:**
- ✅ **PRIMARY:** Rich MDX files with comprehensive local content
- ✅ **SECONDARY:** Centralized data as fallback only
- ✅ **DYNAMIC ROUTING:** Must read MDX first, fallback second
- ❌ **NEVER:** Use centralized data as primary content source
- ❌ **NEVER:** Create individual page files per location
- ❌ **NEVER:** Create content-specific loaders

**VIOLATION DETECTION:**
Any of these files indicate architecture violations and must be deleted immediately:
- `/app/locations/[specific-location]/page.tsx`
- `/lib/[specific-location]-content.ts`  
- Any location-specific routing or content files

**ENFORCEMENT:**
These rules are MANDATORY and NON-NEGOTIABLE. Any violations must be corrected immediately before proceeding with any other work.
```
