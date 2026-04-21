# Hero Component System - DJ Fox Electrical

This document describes the hero components designed specifically for DJ Fox Electrical, featuring full-width background images with dark overlays and accent underline effects on keywords.

## Components

### 1. HeroWithImage

Full-width background image hero with dark overlay and centered content. Used for homepage and major landing pages.

**File:** `components/ui/hero-with-image.tsx`

#### Props

| Prop           | Type                                                     | Required | Default          | Description                                                                       |
| -------------- | -------------------------------------------------------- | -------- | ---------------- | --------------------------------------------------------------------------------- |
| `imageSrc`     | `string`                                                 | Yes      | -                | Path to hero background image (relative to R2 bucket root)                        |
| `imageAlt`     | `string`                                                 | Yes      | -                | Alt text for background image (important for accessibility)                       |
| `heading`      | `ReactNode`                                              | Yes      | -                | Main heading - can include AccentUnderline component for emphasis                 |
| `subheading`   | `string`                                                 | No       | -                | Subheading text displayed below main heading                                      |
| `ctaPrimary`   | `{ label: string; href: string }`                        | No       | -                | Primary CTA button (typically "Get Quote" or "Contact Us")                        |
| `ctaSecondary` | `{ label: string; href: string }`                        | No       | -                | Secondary CTA button (typically "Learn More" or "View Services")                  |
| `overlay`      | `'dark' \| 'darker' \| 'red'`                            | No       | `'dark'`         | Overlay darkness: 'dark' = 50% black, 'darker' = 70% black, 'red' = 30% brand red |
| `breadcrumbs`  | `Array<{name: string, href: string, current?: boolean}>` | No       | -                | Optional breadcrumb navigation displayed at bottom                                |
| `minHeight`    | `string`                                                 | No       | `'min-h-[60vh]'` | Minimum height of hero section                                                    |

#### Usage Examples

##### Homepage Hero with Accent Underline

```tsx
import { HeroWithImage } from '@/components/ui/hero-with-image';
import { AccentUnderline } from '@platform/core-components';

export default function HomePage() {
  return (
    <HeroWithImage
      imageSrc="/images/electrician-working-panel.jpg"
      imageAlt="Professional electrician working on electrical panel"
      heading={
        <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
          High Quality **Electrical** Services
        </AccentUnderline>
      }
      subheading="NICEIC Approved Contractor in Eastbourne"
      ctaPrimary={{
        label: 'Get Free Quote',
        href: '/contact',
      }}
      ctaSecondary={{
        label: 'Our Services',
        href: '/services',
      }}
      overlay="dark"
    />
  );
}
```

##### Service Landing Page with Darker Overlay

```tsx
<HeroWithImage
  imageSrc="/images/emergency-electrical-services.jpg"
  imageAlt="Emergency electrical services available 24/7"
  heading={
    <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
      24/7 **Emergency** Electrical Services
    </AccentUnderline>
  }
  subheading="Fast Response Across East Sussex"
  ctaPrimary={{
    label: 'Call Now: 01323 123456',
    href: 'tel:01323123456',
  }}
  overlay="darker"
  breadcrumbs={[
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Emergency Services', href: '/services/emergency', current: true },
  ]}
/>
```

##### With Red Overlay (Brand Color)

```tsx
<HeroWithImage
  imageSrc="/images/team-photo.jpg"
  imageAlt="DJ Fox Electrical team of qualified electricians"
  heading={
    <h1 className="text-5xl md:text-6xl font-bold text-white">
      Your Local <span className="text-brand-accent">Electrical</span> Experts
    </h1>
  }
  subheading="Serving East Sussex Since 2005"
  ctaPrimary={{
    label: 'Meet the Team',
    href: '/about',
  }}
  overlay="red"
  minHeight="min-h-[70vh]"
/>
```

### 2. PageHero

Shorter hero section for interior pages with background image overlay. Designed for service pages, location pages, and content pages.

**File:** `components/ui/page-hero.tsx`

#### Props

| Prop          | Type                                                     | Required | Default          | Description                                        |
| ------------- | -------------------------------------------------------- | -------- | ---------------- | -------------------------------------------------- |
| `title`       | `string`                                                 | Yes      | -                | Page title displayed as h1                         |
| `subtitle`    | `string`                                                 | No       | -                | Optional subtitle text                             |
| `imageSrc`    | `string`                                                 | Yes      | -                | Background image path (relative to R2 bucket root) |
| `imageAlt`    | `string`                                                 | Yes      | -                | Alt text for background image                      |
| `breadcrumbs` | `Array<{name: string, href: string, current?: boolean}>` | No       | -                | Optional breadcrumb navigation                     |
| `minHeight`   | `string`                                                 | No       | `'min-h-[30vh]'` | Custom minimum height                              |

#### Usage Examples

##### Service Page Hero

```tsx
import { PageHero } from '@/components/ui/page-hero';

export default function ServicePage() {
  return (
    <PageHero
      title="Electrical Installation Services"
      subtitle="Professional installation services across East Sussex"
      imageSrc="/images/electrical-installation.jpg"
      imageAlt="Electrical installation work in progress"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Installation', href: '/services/installation', current: true },
      ]}
    />
  );
}
```

##### Location Page Hero

```tsx
<PageHero
  title="Electrician in Eastbourne"
  subtitle="Trusted electrical services throughout Eastbourne"
  imageSrc="/images/eastbourne-electrical-services.jpg"
  imageAlt="Electrical services in Eastbourne"
  breadcrumbs={[
    { name: 'Home', href: '/' },
    { name: 'Coverage Areas', href: '/coverage' },
    { name: 'Eastbourne', href: '/coverage/eastbourne', current: true },
  ]}
  minHeight="min-h-[35vh]"
/>
```

##### Blog Post Hero

```tsx
<PageHero
  title="Understanding EICR Certificates"
  subtitle="A complete guide to Electrical Installation Condition Reports"
  imageSrc="/images/eicr-certificate.jpg"
  imageAlt="EICR electrical safety certificate"
  breadcrumbs={[
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'EICR Guide', href: '/blog/eicr-guide', current: true },
  ]}
/>
```

## AccentUnderline Component

The `AccentUnderline` component is imported from `@platform/core-components` and adds a colored underline to specific words in headings.

**File:** `packages/core-components/src/components/ui/accent-underline.tsx`

### Usage

Use double asterisks `**word**` to mark text for underlining:

```tsx
import { AccentUnderline } from "@platform/core-components";

// As h1
<AccentUnderline as="h1" className="text-5xl font-bold text-white">
  High Quality **Electrical** Services
</AccentUnderline>

// As h2
<AccentUnderline as="h2" className="text-4xl font-bold">
  Latest **Useful** News
</AccentUnderline>

// Multiple words
<AccentUnderline as="h1" className="text-6xl font-bold text-white">
  **Professional** Electrical **Solutions**
</AccentUnderline>

// Custom underline styling
<AccentUnderline
  as="h1"
  className="text-5xl font-bold text-white"
  underlineThickness={6}
  underlineOffset={10}
>
  **Quality** You Can Trust
</AccentUnderline>
```

### Props

| Prop                 | Type                | Default | Description                                     |
| -------------------- | ------------------- | ------- | ----------------------------------------------- |
| `children`           | `string`            | -       | Text with `**marked**` sections for underlining |
| `as`                 | `React.ElementType` | `'h2'`  | HTML tag to render (h1, h2, h3, p, span, etc.)  |
| `className`          | `string`            | `''`    | Additional CSS classes for the container        |
| `underlineThickness` | `number`            | `4`     | Thickness of underline in pixels                |
| `underlineOffset`    | `number`            | `8`     | Offset from text baseline in pixels             |

## Design Guidelines

### When to Use HeroWithImage

- Homepage
- Major landing pages (service categories, location landing pages)
- Campaign-specific pages
- Pages where visual impact is critical

**Minimum height:** 60vh (mobile and desktop)

### When to Use PageHero

- Service detail pages
- Location detail pages
- Blog posts
- About page
- Contact page
- Any interior content page

**Minimum height:** 30vh (can be adjusted via `minHeight` prop)

### Overlay Choices

- **`dark`** (50% black): Default choice, works for most images
- **`darker`** (70% black): Use when image is very bright or text readability is compromised
- **`red`** (30% brand red): Use sparingly for special brand moments (about page, team page)

### Image Requirements

- **Dimensions:** Minimum 1920x1080px (Full HD)
- **Aspect Ratio:** 16:9 preferred
- **Subject Matter:** Ensure important subject matter is centered (will be visible with overlay)
- **Format:** JPEG or WebP
- **Quality:** High quality source images (will be optimized by Next.js Image component)

### Accessibility

Both components include:

- Proper semantic HTML (`<section>`, `<h1>`, `<nav>`)
- `aria-hidden="true"` on decorative overlay layers
- `aria-label` on breadcrumb navigation
- `aria-current="page"` on current breadcrumb
- Alt text required for all images
- Sufficient color contrast (white text on dark overlay meets WCAG AA)

### Mobile Responsiveness

Both components are fully responsive:

- Text scales down on mobile (text-4xl → text-5xl → text-6xl)
- CTA buttons stack vertically on mobile (`flex-col sm:flex-row`)
- Container padding adjusts (py-12 → py-16 → py-24)
- Images use Next.js responsive sizing (`sizes="100vw"`)
- Breadcrumbs remain readable on all screen sizes

## Examples in Context

### Complete Homepage Implementation

```tsx
import { HeroWithImage } from '@/components/ui/hero-with-image';
import { AccentUnderline } from '@platform/core-components';
import { ServiceCards } from '@platform/core-components';
import { CTASection } from '@platform/core-components';

export default function HomePage() {
  return (
    <>
      <HeroWithImage
        imageSrc="/images/dj-fox-electrical-hero.jpg"
        imageAlt="Professional electrician working on modern electrical panel"
        heading={
          <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
            High Quality **Electrical** Services
          </AccentUnderline>
        }
        subheading="NICEIC Approved Contractor in Eastbourne"
        ctaPrimary={{
          label: 'Get Free Quote',
          href: '/contact',
        }}
        ctaSecondary={{
          label: 'Our Services',
          href: '/services',
        }}
        overlay="dark"
      />

      <ServiceCards />

      <CTASection
        title="Need an Electrician?"
        description="Contact us today for a free, no-obligation quote"
        ctaText="Get in Touch"
        ctaLink="/contact"
      />
    </>
  );
}
```

### Complete Service Page Implementation

```tsx
import { PageHero } from '@/components/ui/page-hero';
import { ServiceFaq } from '@platform/core-components';
import { CTASection } from '@platform/core-components';

export default function ServicePage() {
  return (
    <>
      <PageHero
        title="Electrical Installation Services"
        subtitle="Professional installation services across East Sussex"
        imageSrc="/images/electrical-installation.jpg"
        imageAlt="Electrical installation work in progress"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: 'Installation', href: '/services/installation', current: true },
        ]}
      />

      <section className="section-standard">
        <div className="container-standard">{/* Service content here */}</div>
      </section>

      <ServiceFaq faqs={serviceFaqs} />

      <CTASection
        title="Ready to Start Your Project?"
        description="Get a free quote for your electrical installation"
        ctaText="Contact Us"
        ctaLink="/contact"
      />
    </>
  );
}
```

## Verification Checklist

- [x] AccentUnderline component available in core-components
- [x] HeroWithImage component created with full TypeScript types
- [x] PageHero component created with full TypeScript types
- [x] Full-width background images render correctly
- [x] Dark overlays ensure text readability
- [x] Mobile responsive (320px - 1920px)
- [x] Accessibility features implemented (ARIA labels, semantic HTML)
- [x] Breadcrumb navigation works correctly
- [x] CTA buttons styled with theme tokens
- [x] Components use theme system (`bg-brand-primary`, `text-brand-accent`)
- [x] Documentation with usage examples provided
- [x] JSDoc comments added to all components

## Theme Integration

Both hero components use DJ Fox Electrical's theme configuration:

**Brand Colors (from `theme.config.ts`):**

- `brand-primary`: #db0b0b (Red) - Used in CTA buttons, underlines
- `brand-accent`: #fbbf24 (Amber) - Used for emphasis text
- `brand-primaryHover`: #ba0909 - Button hover states

**Usage in Components:**

- `btn-primary-lg` class uses `bg-brand-primary` and `hover:bg-brand-primaryHover`
- `AccentUnderline` uses `var(--color-brand-primary)` for underline color
- Text emphasis can use `text-brand-accent` for amber highlights

## Performance Notes

- Both components use Next.js `<Image>` component with automatic optimization
- `priority` attribute set on hero images (loads before other images)
- `sizes="100vw"` ensures proper responsive image sizing
- Quality set to 75 (HeroWithImage) and 70 (PageHero) for optimized file sizes
- Overlay layers use `aria-hidden="true"` to reduce accessibility tree complexity
