# Colossus Scaffolding Website

A modern Next.js website for Colossus Scaffolding - professional scaffolding services across the South East UK. Built with React 19, Next.js 15, TypeScript, and Tailwind CSS for optimal SEO and lead generation.

## 🏗️ Architecture

### Page Structure
- **`app/page.tsx`** - Homepage with service overview
- **`app/services/page.tsx`** - Services index (dynamically lists all services)
- **`app/locations/page.tsx`** - Locations index (dynamically lists all areas)
- **`app/contact/page.mdx`** - Main contact page with form
- **`app/contact/about/page.mdx`** - Contact information page
- **Dynamic Routes:**
  - `app/services/[slug]/page.tsx` - Individual service pages
  - `app/locations/[slug]/page.tsx` - Individual location pages
  - `app/contact/services/[slug]/page.tsx` - Service-specific contact pages
  - `app/contact/locations/[slug]/page.tsx` - Location-specific contact pages

### Content Management
- **MDX Files:** Store content in `content/services/` and `content/locations/`
- **Dynamic Loading:** Pages automatically discover and render MDX content
- **Frontmatter Support:** Title, description, and custom fields
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
    areaServed: ["South East UK"]
  }}
  org={{ name: "Colossus Scaffolding", url: "/", logo: "/logo-white.svg" }}
  faqs={[
    {
      question: "Common question about this service?",
      answer: "Detailed answer for SEO and user value."
    }
  ]}
/>
```

### Adding Locations
1. Create `content/locations/location-slug.mdx`
2. Follow similar pattern as services with location-specific content
3. Include local SEO information and area-specific details

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
    blue: '#4DB2E4',    /* Primary accent */
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

### Other Platforms
- **Netlify:** Works with static export
- **AWS/DigitalOcean:** Standard Node.js deployment
- **Self-hosted:** PM2 or Docker containerization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npm run start

# Check for issues
npm run lint
```

## 📞 Contact Form Integration

The contact form at `/app/api/contact/route.tsx` is ready for:
- **Email Services:** SendGrid, AWS SES, Resend
- **CRM Integration:** HubSpot, Salesforce, Pipedrive  
- **Form Analytics:** Track conversion rates and lead sources

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

## 🎯 Next Steps

1. **Content Creation:** Add service and location MDX files
2. **Visual Enhancement:** Improve homepage and styling
3. **Form Integration:** Connect contact form to email service
4. **Analytics:** Add Google Analytics/Tag Manager
5. **Local SEO:** Submit to Google My Business and directories

Built with ❤️ for Colossus Scaffolding - Professional scaffolding services across the South East UK.
