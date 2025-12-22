# Base Template Setup Guide

Complete guide to creating a new site from the base template.

## Quick Start

```bash
# 1. Copy template
cp -r sites/base-template sites/your-new-site
cd sites/your-new-site

# 2. Install dependencies
pnpm install

# 3. Configure site
# Edit site.config.ts with business info
# Edit theme.config.ts with brand colors

# 4. Start development
npm run dev
```

## Detailed Setup

### Step 1: Copy and Rename

```bash
# From monorepo root
cp -r sites/base-template sites/your-new-site
cd sites/your-new-site
```

### Step 2: Update package.json

Edit `package.json`:

```json
{
  "name": "your-new-site",
  "description": "Your business description"
}
```

### Step 3: Configure Site (site.config.ts)

Update all placeholder values:

```typescript
export const siteConfig: SiteConfig = {
  name: 'Your Business Name',
  tagline: 'Your business tagline',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'Your Business Name',
    legalName: 'Your Business Ltd',
    type: 'LocalBusiness', // or ProfessionalService, HomeAndConstructionBusiness
    phone: '+44 1234 567890',
    email: 'info@yourbusiness.com',
    address: {
      street: 'Your Street Address',
      city: 'Your City',
      region: 'Your County/Region',
      postalCode: 'YOUR POSTCODE',
      country: 'United Kingdom',
    },
    hours: {
      monday: '9:00 AM - 5:00 PM',
      // ... update all days
    },
    socialMedia: {
      facebook: 'https://facebook.com/yourbusiness',
      twitter: 'https://twitter.com/yourbusiness',
      instagram: 'https://instagram.com/yourbusiness',
    },
  },

  serviceAreas: ['Primary Area', 'Secondary Area', 'Other Areas'],

  services: [
    {
      title: 'Your Primary Service',
      slug: 'primary-service', // matches MDX filename
      description: 'Brief description',
    },
    // ... add more services
  ],

  features: {
    analytics: true, // enable when GA_MEASUREMENT_ID set
    consentBanner: true, // show cookie consent
    contactForm: true, // enable contact form
    rateLimit: false, // enable when Redis configured
    testimonials: true,
    blog: false,
  },
};
```

### Step 4: Configure Theme (theme.config.ts)

Customize your brand colors:

```typescript
export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: '#YOUR_PRIMARY_COLOR',
      primaryHover: '#YOUR_PRIMARY_HOVER',
      secondary: '#YOUR_SECONDARY_COLOR',
      accent: '#YOUR_ACCENT_COLOR',
    },
    // surface colors usually stay default
  },

  typography: {
    fontFamily: {
      sans: ['Your Font', 'fallback', 'sans-serif'],
      heading: ['Your Heading Font', 'fallback', 'sans-serif'],
    },
  },

  components: {
    button: {
      borderRadius: '0.5rem', // 8px rounded
      fontWeight: 600,
    },
    card: {
      borderRadius: '1rem', // 16px rounded
      shadow: 'sm', // or 'md', 'lg'
    },
    hero: {
      variant: 'centered', // or 'split', 'image-left', 'image-right'
    },
    navigation: {
      style: 'solid', // or 'transparent', 'bordered'
    },
  },
};
```

### Step 5: Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your Business Name"

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789

# Contact Form (required for contact page)
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_EMAIL_TO=info@yourbusiness.com
CONTACT_EMAIL_FROM=noreply@yourbusiness.com

# Rate Limiting (optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Image CDN (optional)
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### Step 6: Update Content

#### Replace Generic Service Files

For each service in `content/services/`:

1. **Rename file** to match your service (e.g., `plumbing-services.mdx`)
2. **Update frontmatter**:

   ```yaml
   ---
   title: 'Your Service Name'
   seoTitle: 'Your Service | Your Business'
   description: '50-200 character description for SEO'
   keywords:
     - 'primary keyword'
     - 'secondary keyword'
     - 'location + service'
   hero:
     heading: 'Service Heading'
     subheading: 'Compelling subheading'
     image: 'path/to/image.webp'
     cta:
       label: 'Get Started'
       href: '/contact'
   breadcrumbs:
     - { title: 'Home', href: '/' }
     - { title: 'Services', href: '/services' }
     - { title: 'Your Service', href: '/services/your-service' }
   faqs:
     - question: 'Relevant question?'
       answer: 'Detailed answer addressing customer concerns.'
   ---
   ```

3. **Write content**: Replace placeholder content with actual service information

#### Replace Generic Location Files

For each location in `content/locations/`:

1. **Rename file** to match location (e.g., `london.mdx`)
2. **Update frontmatter** with location-specific info
3. **Write content**: Include area-specific details, coverage map, local testimonials

### Step 7: Add Images

#### Required Images

Place in `public/static/`:

- `logo.svg` or `logo.png` - Your business logo
- `favicon.ico` - Favicon (16x16, 32x32)
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `og-image.png` - Social media preview image (1200x630)

#### Hero Images

Place in `public/images/` or use CDN:

- One hero image per service
- One hero image per location
- Homepage hero image

**Image specs:**

- Format: WebP (for web) or JPEG/PNG
- Size: 1920x1080 or similar 16:9 ratio
- Optimization: Compress for web (<200KB)

### Step 8: Configure Vercel Deployment

#### Create New Vercel Project

1. Go to Vercel dashboard
2. Import Git repository
3. Select `sites/your-new-site` as root directory
4. Add environment variables from `.env`
5. Deploy

#### Project Settings

```
Framework Preset: Next.js
Root Directory: sites/your-new-site
Build Command: npm run build
Output Directory: .next
Install Command: pnpm install
```

#### Environment Variables

Copy from your `.env` file to Vercel project settings.

### Step 9: Testing Checklist

Before launch:

- [ ] All pages load without errors
- [ ] Service pages have correct content
- [ ] Location pages have correct content
- [ ] Contact form works (test email delivery)
- [ ] All images load correctly
- [ ] Mobile responsive design works
- [ ] SEO metadata is correct
- [ ] Analytics tracking works (if enabled)
- [ ] Schema.org structured data validates
- [ ] Page speed is acceptable (Lighthouse > 90)

```bash
# Run tests
npm run type-check
npm run lint
npm run build
npm test
npm run test:e2e:smoke
```

### Step 10: Launch

1. **Configure custom domain** in Vercel
2. **Set up DNS** records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
3. **Enable SSL** (automatic with Vercel)
4. **Test production site** thoroughly
5. **Set up monitoring** (Vercel Analytics, Sentry, etc.)
6. **Submit sitemap** to Google Search Console

## Ongoing Maintenance

### Adding New Services

1. Create new MDX file in `content/services/`
2. Add to `services` array in `site.config.ts`
3. Create hero image
4. Test and deploy

### Adding New Locations

1. Create new MDX file in `content/locations/`
2. Add to `serviceAreas` array in `site.config.ts`
3. Create location hero image
4. Test and deploy

### Updating Content

1. Edit MDX files in `content/`
2. Commit changes to git
3. Push to trigger Vercel deployment
4. Automatic deployment and preview

### Theme Updates

1. Edit `theme.config.ts`
2. Test locally with `npm run dev`
3. Deploy changes

## Troubleshooting

### Build Errors

```bash
# Type errors
npm run type-check

# Fix automatically where possible
npm run lint -- --fix

# Clean and rebuild
npm run clean
npm run build
```

### Content Validation Errors

```bash
# Validate all content
npm run validate:content

# Common issues:
# - Description length (50-200 chars)
# - FAQ count (3-15 questions)
# - Missing required frontmatter fields
```

### Theme Not Applied

- Verify `theme.config.ts` exports `themeConfig`
- Check `tailwind.config.ts` imports theme correctly
- Restart dev server after theme changes
- Check browser console for CSS errors

### Images Not Loading

- Verify image paths are correct (relative to `/public`)
- Check image file names match MDX frontmatter
- Verify CDN configuration in `next.config.ts`
- Check browser network tab for 404s

## Getting Help

- Review documentation in `/docs/guides`
- Check `/docs/architecture` for architecture details
- See `/docs/standards` for content standards
- Reference `colossus-reference` site for examples

---

**Setup Version:** 1.0.0
**Last Updated:** December 2025
