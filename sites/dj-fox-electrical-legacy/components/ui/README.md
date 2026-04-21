# DJ Fox Electrical - UI Components

Custom UI components for the DJ Fox Electrical website.

## Component Overview

### Hero Components

#### HeroWithImage

Full-width background image hero for homepage and major landing pages.

**File:** `hero-with-image.tsx`

**Usage:**

```tsx
import { HeroWithImage } from '@/components/ui/hero-with-image';
import { AccentUnderline } from '@platform/core-components';

<HeroWithImage
  imageSrc="/images/hero.jpg"
  imageAlt="Description"
  heading={<AccentUnderline>Text with **accent**</AccentUnderline>}
  subheading="Subtitle text"
  ctaPrimary={{ label: 'CTA', href: '/link' }}
/>;
```

#### PageHero

Shorter hero for interior pages (services, locations, blog).

**File:** `page-hero.tsx`

**Usage:**

```tsx
import { PageHero } from "@/components/ui/page-hero";

<PageHero
  title="Page Title"
  subtitle="Optional subtitle"
  imageSrc="/images/page-hero.jpg"
  imageAlt="Description"
  breadcrumbs={[...]}
/>
```

### Card Components

#### CircularIconCard

Card with circular icon background (service cards).

**File:** `circular-icon-card.tsx`

#### DarkStatCard

Dark-themed statistic card with icon (homepage stats).

**File:** `dark-stat-card.tsx`

#### ImageOverlayCard

Card with image background and dark overlay (location cards).

**File:** `image-overlay-card.tsx`

#### InfoCard

Simple information card with icon (benefit cards).

**File:** `info-card.tsx`

### Form Components

#### ContactForm

Complete contact form with CSRF protection and validation.

**File:** `ContactForm.tsx`

## Documentation

- **HERO_COMPONENTS.md** - Complete hero component documentation with API reference
- **USAGE_EXAMPLES.tsx** - 13+ ready-to-use component examples

## Component Hierarchy

```
Homepage
├── HeroWithImage (full-width, 60vh)
│   ├── AccentUnderline (from core-components)
│   ├── CTAs (primary + secondary)
│   └── Optional breadcrumbs
├── ServiceCards (CircularIconCard × 6)
├── StatsSection (DarkStatCard × 4)
└── CTASection

Service Page
├── PageHero (shorter, 30vh)
│   └── Breadcrumbs
├── Content sections
└── CTASection

Location Page
├── PageHero (shorter, 30vh)
│   └── Breadcrumbs
├── LocationServices
├── LocationCoverage
└── CTASection
```

## Design System

### Colors (from theme.config.ts)

- **Primary:** `#db0b0b` (Red)
- **Primary Hover:** `#ba0909`
- **Accent:** `#fbbf24` (Amber)

### Typography

- **Font Family:** Inter
- **Headings:** Bold, 700 weight
- **Body:** Regular, 400 weight

### Spacing

- **Container:** `container-standard` class
- **Section:** `section-standard` class
- **Card Gap:** `gap-6` or `gap-8`

### Overlay Options (Hero Components)

- **dark:** 50% black opacity (default)
- **darker:** 70% black opacity (very bright images)
- **red:** 30% brand red (brand emphasis)

## Accessibility

All components include:

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Sufficient color contrast (WCAG AA)
- Alt text requirements
- Focus indicators

## Responsive Breakpoints

- **Mobile:** 320px - 639px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px+

Components use Tailwind's responsive prefixes:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

## TypeScript

All components are fully typed with:

- Strict prop interfaces
- JSDoc comments
- Named exports only (no default exports)
- Optional vs required props clearly defined

## Performance

- Next.js Image component for optimization
- `priority` attribute on hero images
- Responsive image sizing (`sizes` prop)
- CSS-only overlays (no extra images)
- Theme tokens for efficient styling

## Quick Start

```tsx
// Import components
import { HeroWithImage, PageHero } from '@/components/ui/[component]';
import { AccentUnderline } from '@platform/core-components';

// Use in page
export default function Page() {
  return (
    <>
      <HeroWithImage {...props} />
      {/* Your content */}
    </>
  );
}
```

## See Also

- `HERO_COMPONENTS.md` - Full hero component documentation
- `USAGE_EXAMPLES.tsx` - Copy-paste examples
- `/packages/core-components/CLAUDE.md` - Core components guide
- `/docs/standards/components.md` - Platform component standards
