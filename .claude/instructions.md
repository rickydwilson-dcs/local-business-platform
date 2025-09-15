## **CLAUDE CODE ARCHITECTURAL GUIDELINES**

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

**Component Styling:**
```tsx
// ✅ CORRECT - Tailwind classes
<div className="bg-blue-600 text-white p-4 rounded-lg">

// ❌ WRONG - Inline styles
<div style={{ backgroundColor: '#005A9E', color: 'white', padding: '16px' }}>

// ❌ WRONG - CSS-in-JS
const StyledDiv = styled.div`background: blue;`
```

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

### **📄 CONTENT MANAGEMENT**

**MDX Files:**
- ✅ ALL content in appropriate `/content/` subdirectories
- ✅ Use frontmatter for metadata
- ✅ Consistent structure across similar content types
- ❌ NO content hardcoded in components

**Frontmatter Standard:**
```yaml
---
title: "Page Title"
description: "SEO description"
keywords: ["keyword1", "keyword2"]
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

// ✅ Service Schema (service pages)
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Service Name]",
  "description": "[Service Description]",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Colossus Scaffolding"
  },
  "areaServed": "[Location]",
  "serviceType": "[Service Type]"
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
- ❌ Default exports for UI components
- ❌ Props without TypeScript interfaces
- ❌ Pages without proper meta data
- ❌ Missing or invalid schema markup
- ❌ Images without alt text
- ❌ Broken heading hierarchy

### **✅ QUALITY CHECKLIST**

**Before completing any task, verify:**
- [ ] All new components in `/components/ui/`
- [ ] All styling uses Tailwind classes only
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

### **🔄 REFACTORING PRIORITY**

**When modifying existing code:**
1. **Fix styling first** - Remove inline styles, use Tailwind
2. **Move components** - Relocate to `/components/ui/` if reusable
3. **Extract content** - Move hardcoded content to MDX files
4. **Add TypeScript** - Ensure all props are typed
5. **SEO audit** - Add missing meta data and schema
6. **Accessibility check** - Ensure compliance maintained

### **📋 EXAMPLE TASK COMPLETION**

**When asked to "add a pricing section":**
1. ✅ Create `/components/ui/pricing-section.tsx`
2. ✅ Use Tailwind classes for all styling
3. ✅ Accept props with TypeScript interface
4. ✅ Keep content in MDX files, not component
5. ✅ Add appropriate schema markup (Service/Offer schema)
6. ✅ Include proper heading hierarchy
7. ✅ Add descriptive alt text to any images
8. ✅ Test component is reusable across locations
9. ✅ Validate schema with Google's testing tool

### **🛠️ TESTING REQUIREMENTS**

**Before marking task complete:**
- [ ] **Lighthouse SEO score:** 95+
- [ ] **Schema validation:** Pass Google's Rich Results Test
- [ ] **Accessibility:** Pass WCAG AA (contrast, alt text, headings)
- [ ] **Mobile responsive:** All breakpoints work correctly
- [ ] **Core Web Vitals:** LCP, CLS, FID within Google's thresholds

---
