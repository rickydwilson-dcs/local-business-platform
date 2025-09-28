# Colossus Scaffolding Website

A modern Next.js website for Colossus Scaffolding - professional scaffolding services across the South East UK. Built with React 19, Next.js 15, TypeScript, and Tailwind CSS for optimal SEO and lead generation.

## 🏗️ Architecture

### Page Structure

- **`app/page.tsx`** - Homepage with service overview
- **`app/services/page.tsx`** - Services index (dynamically lists all services)
- **`app/locations/page.tsx`** - Locations index (dynamically lists all areas)
- **`app/contact/page.tsx`** - Main contact page with form
- **`app/about/page.tsx`** - About page
- **`app/health-safety/page.tsx`** - Health & Safety information
- **`app/projects/page.tsx`** - Projects showcase
- **Dynamic Routes:**
  - `app/services/[slug]/page.tsx` - Individual service pages (dual architecture)
  - `app/locations/[slug]/page.tsx` - **UNIFIED LOCATION TEMPLATE** - handles all locations
  - `app/contact/services/[slug]/page.tsx` - Service-specific contact pages
  - `app/contact/locations/[slug]/page.tsx` - Location-specific contact pages

### Content Management

**Two Different Architectures:**

1. **Services (Dual Architecture):**
   - Minimal MDX files in `content/services/` for route generation
   - Rich content in `serviceDataMap` within `app/services/[slug]/page.tsx`
   - Pattern: MDX provides routing, TypeScript provides content

2. **Locations (Unified Template):**
   - Rich MDX files in `content/locations/` with comprehensive frontmatter
   - Single template `app/locations/[slug]/page.tsx` handles ALL locations
   - Conditional rendering based on frontmatter (towns directory, pricing, etc.)
   - Pattern: MDX-first with dynamic template features

- **Dynamic Loading:** Pages automatically discover and render content
- **Schema.org Integration:** Automatic structured data for SEO

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.2 (App Router)
- **React:** 19.1.0 with Server Components
- **TypeScript:** Full type safety throughout
- **Styling:** Tailwind CSS 3.4.17 with custom brand colors
- **Content:** MDX with `next-mdx-remote` for flexible content management
- **SEO:** Built-in metadata generation and Schema.org structured data
- **Performance:** Static generation with dynamic imports

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local`:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Business Configuration
BUSINESS_EMAIL=your-business@email.com
BUSINESS_NAME=Colossus Scaffolding

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📝 Content Management

### Adding Services

1. Create `content/services/your-service-slug.mdx`
2. Add frontmatter:

```mdx
---
title: "Your Service Name"
description: "Brief description for SEO"
---

# Your Service Content

Your detailed service information here...

<Schema
  service={{
    id: "/services/your-service-slug#service",
    url: "/services/your-service-slug",
    name: "Your Service Name",
    description: "Detailed service description",
    serviceType: "Scaffolding",
    areaServed: ["South East UK"],
  }}
  org={{ name: "Colossus Scaffolding", url: "/", logo: "/logo-white.svg" }}
  faqs={[
    {
      question: "Common question about this service?",
      answer: "Detailed answer for SEO and user value.",
    },
  ]}
/>
```

### Adding Locations (Unified Template)

1. Create `content/locations/location-slug.mdx` with comprehensive frontmatter
2. Use structured frontmatter sections:

```mdx
---
title: "Location Name"
seoTitle: "Location Name Scaffolding Services | Colossus Scaffolding"
description: "Professional scaffolding services in Location Name..."
keywords: ["scaffolding location-name", "location scaffolding hire"]
heroImage: "/Location-Scaffolding.png"
hero:
  title: "Professional Scaffolding in Location Name"
  description: "Local expertise for unique challenges..."
  phone: "01424 466 661"
  trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
specialists:
  title: "Location Scaffolding Specialists"
  cards: [...]
services:
  cards: [...]
pricing: # Optional
  packages: [...]
towns: # For counties only
  title: "County Towns We Serve"
  townsList: [...]
---

# Markdown content here
```

3. **Key Features:**
   - Automatic hero image display via `heroImage` frontmatter
   - Conditional towns directory for counties (shows town grid with links)
   - Structured sections render from frontmatter data
   - No-wrap phone button styling built-in
   - Single template handles both town and county content types

### Content Best Practices

- **SEO-First:** Every page should have unique title and description
- **FAQ Integration:** Use the Schema component for rich snippets
- **Local Focus:** Include location-specific information and keywords
- **Call-to-Actions:** Clear paths to contact/quote requests

## 🎨 Styling & Branding

### Brand Colors

```css
colors: {
  brand: {
    blue: '#00607A',    /* Primary brand color */
    black: '#000000',   /* Headers and nav */
    white: '#FFFFFF',   /* Clean backgrounds */
  }
}
```

### Typography

- **Headings:** Libre Caslon Display (elegant serif)
- **Body:** Arial/Helvetica (clean, readable)

### Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Optimized for lead generation on all devices

## 🔧 Configuration Files

### Next.js Config (`next.config.ts`)

- **TypeScript Configuration:** Full type safety with `NextConfig`
- **MDX Integration:** Rust-based compiler for performance
- **Security Headers:** Production-ready security
- **Image Optimization:** SVG support and external domains

### Tailwind Config (`tailwind.config.ts`)

- **Custom Brand Colors:** Consistent color palette
- **Typography Plugin:** Enhanced text styling
- **Content Paths:** Includes all TypeScript and MDX files

### TypeScript Config (`tsconfig.json`)

- **Path Aliases:** `@/*` for clean imports
- **Strict Mode:** Maximum type safety
- **Next.js Integration:** Optimized for App Router

## 📊 SEO Features

### Built-in Optimizations

- **Static Generation:** Fast loading times
- **Meta Tags:** Dynamic title, description, and OpenGraph
- **Structured Data:** Schema.org markup for services and FAQs
- **Sitemap Ready:** Automatic route discovery
- **Image Optimization:** WebP conversion and lazy loading

### Local SEO

- **Location Pages:** Individual pages for each service area
- **Schema Markup:** LocalBusiness and Service structured data
- **Contact Information:** Consistent NAP (Name, Address, Phone)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repository for automatic deployments
```

### Build Optimization

```bash
# Analyze bundle size
npm run build
npm run start

# Check for issues
npm run lint
```

## 📞 Contact Form Integration

The contact form at `/app/api/contact/route.tsx` includes:

- **Resend Email Service:** Professional HTML email templates
- **Business Notifications:** Automatic email alerts with submission details
- **Customer Confirmations:** Branded confirmation emails with enquiry summary
- **Graceful Fallbacks:** Development-friendly logging when email not configured
- **Comprehensive Validation:** Email format, required fields, and error handling
- **Submission Tracking:** IP address, user agent, and referrer data

## 🔍 Content Strategy

### Services Content

Focus on these service pages with rich, SEO-optimized content:

- Access Scaffolding
- Facade Scaffolding
- Edge Protection
- Scaffolding Inspections & Maintenance
- Heavy Duty Industrial Scaffolding
- Temporary Roof Systems

### Location Content

Target these key areas in South East UK:

- East Sussex (Brighton, Hastings, Eastbourne)
- West Sussex (Chichester, Crawley)
- Kent (Maidstone, Canterbury)
- Surrey (Guildford, Woking)
- London (South London boroughs)

### Lead Generation Focus

- **Free Quotes:** Prominent calls-to-action
- **Case Studies:** Project galleries and testimonials
- **Certifications:** TG20:21 compliance, CHAS accreditation
- **Emergency Services:** 24/7 availability messaging

## 🧪 Development Guidelines

### Code Quality

- **ESLint:** Strict linting with Next.js recommended rules
- **TypeScript:** Strict mode enabled for type safety
- **Prettier:** Consistent code formatting (add `.prettierrc` if needed)

### Component Structure

- **Server Components:** Default for better performance
- **Client Components:** Only when interactivity needed (`'use client'`)
- **Reusable Components:** Store in `/components` directory

### Performance

- **Image Optimization:** Use `next/image` for all images
- **Font Loading:** Self-hosted fonts with `@fontsource`
- **Bundle Analysis:** Regular size monitoring

---

## 🎯 Recent Improvements

1. **✅ Service Card Design:** Unified visual consistency with location cards
2. **✅ Contact Form:** Complete Resend email integration with professional templates
3. **✅ Component Cleanup:** Removed unused components, improved reusability
4. **✅ Brand Colors:** Updated to #00607A for improved accessibility
5. **✅ Content Management:** Enhanced services data with categorization
6. **✅ MAJOR: Unified Location Template:** Deleted static county pages, implemented single dynamic template
   - Consolidated all locations to use `app/locations/[slug]/page.tsx`
   - Added conditional towns directory rendering for counties
   - Fixed hero image display issues
   - Added no-wrap phone button styling
   - Counties now show town grids with local specialist links

## 🎯 Next Steps

1. **Local SEO:** Submit to Google My Business and directories
2. **Location-Service Pages:** Monitor performance and usefulness of Brighton and Canterbury Location-Service pages and assess if worthwhile extending to other locations

Built with ❤️ for Colossus Scaffolding - Professional scaffolding services across the South East UK.
