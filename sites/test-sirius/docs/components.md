# Component Reference

This guide documents the UI components available in base-template, including props, variants, and usage examples.

## Component Categories

| Category   | Components                                            |
| ---------- | ----------------------------------------------------- |
| Hero       | PageHero, ServiceHero, LocationHero, BlogPostHero     |
| Content    | FAQSection, CTASection, ServiceAbout, ServiceBenefits |
| Cards      | BlogPostCard, TestimonialCard, ContentCard            |
| Navigation | Breadcrumbs                                           |
| Ratings    | StarRating, AggregateRatingDisplay                    |
| Layout     | ContentGrid, CardGrid                                 |
| Schema     | Schema (JSON-LD wrapper)                              |

---

## Hero Components

### PageHero / ServiceHero

Generic page hero section with heading, subheading, image, and CTA.

```tsx
import { ServiceHero } from '@/components/ui/service-hero';

<ServiceHero
  heading="Service Title"
  subheading="Supporting value proposition"
  image="/images/hero.webp"
  cta={{
    label: 'Get Quote',
    href: '/contact',
  }}
/>;
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| heading | string | Yes | Main heading text |
| subheading | string | No | Supporting text |
| image | string | No | Background/feature image |
| cta | { label, href } | No | Call-to-action button |

### LocationHero

Location-specific hero with phone and trust badges.

```tsx
import { LocationHero } from '@/components/ui/location-hero';

<LocationHero
  heading="Services in Canterbury"
  subheading="Your trusted local experts"
  phone="01234 567890"
  trustBadges={['Licensed', 'Insured', 'Local']}
  cta={{
    label: 'Call Now',
    href: 'tel:01234567890',
  }}
/>;
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| heading | string | Yes | Main heading |
| subheading | string | No | Supporting text |
| phone | string | No | Contact phone number |
| trustBadges | string[] | No | Trust indicator badges |
| cta | { label, href } | No | CTA button |

### BlogPostHero

Dual-variant hero for blog posts and projects.

```tsx
import { BlogPostHero } from '@/components/ui/blog-post-hero';

// Blog variant
<BlogPostHero
  variant="blog"
  title="Article Title"
  excerpt="Article excerpt..."
  author={{ name: "John Smith", role: "Writer" }}
  date="2026-01-15"
  readingTime={5}
  category="industry-tips"
  heroImage="/images/blog.webp"
/>

// Project variant
<BlogPostHero
  variant="project"
  title="Project Title"
  description="Project description..."
  locationName="Canterbury"
  year={2025}
  duration="6 weeks"
  heroImage="/images/project.webp"
/>
```

**Blog Variant Props:**
| Prop | Type | Required |
|------|------|----------|
| variant | "blog" | Yes |
| title | string | Yes |
| excerpt | string | Yes |
| author | { name, role? } | Yes |
| date | string | Yes |
| readingTime | number | No |
| category | string | No |
| heroImage | string | No |

**Project Variant Props:**
| Prop | Type | Required |
|------|------|----------|
| variant | "project" | Yes |
| title | string | Yes |
| description | string | Yes |
| locationName | string | Yes |
| year | number | Yes |
| duration | string | No |
| heroImage | string | No |

---

## Content Sections

### FAQSection

Renders FAQs with accordion behaviour.

```tsx
import { FAQSection } from '@/components/ui/faq-section';

<FAQSection
  title="Frequently Asked Questions"
  faqs={[
    { question: 'How long does it take?', answer: 'Typically 2-4 hours.' },
    { question: "What's included?", answer: 'Full service with cleanup.' },
  ]}
/>;
```

**Props:**
| Prop | Type | Required |
|------|------|----------|
| title | string | No |
| faqs | { question, answer }[] | Yes |
| schema | boolean | No (adds JSON-LD) |

### CTASection

Call-to-action section with heading and button.

```tsx
import { CTASection } from '@/components/ui/cta-section';

<CTASection
  title="Ready to Get Started?"
  description="Contact us today for a free quote."
  buttonText="Get Quote"
  buttonHref="/contact"
/>;
```

**Props:**
| Prop | Type | Required |
|------|------|----------|
| title | string | Yes |
| description | string | No |
| buttonText | string | Yes |
| buttonHref | string | Yes |
| variant | "primary" \| "secondary" | No |

### ServiceAbout

Structured about section for services.

```tsx
import { ServiceAbout } from '@/components/ui/service-about';

<ServiceAbout
  whatIs="Description of the service..."
  whenNeeded={['When you need X', 'When you experience Y']}
  whatAchieve={['Outcome 1', 'Outcome 2']}
  keyPoints={['Key point 1', 'Key point 2']}
/>;
```

### ServiceBenefits

List of service benefits.

```tsx
import { ServiceBenefits } from '@/components/ui/service-benefits';

<ServiceBenefits
  title="Why Choose Us"
  benefits={['24/7 availability', 'Free quotes', 'Licensed professionals']}
/>;
```

---

## Card Components

### BlogPostCard

Card for blog listing pages.

```tsx
import { BlogPostCard } from '@/components/ui/blog-post-card';

<BlogPostCard
  title="Article Title"
  excerpt="Short excerpt..."
  slug="article-slug"
  date="2026-01-15"
  category="industry-tips"
  heroImage="/images/blog.webp"
  author={{ name: 'John Smith' }}
/>;
```

### TestimonialCard

Customer testimonial display card.

```tsx
import { TestimonialCard } from '@/components/ui/testimonial-card';

<TestimonialCard
  customerName="Sarah Johnson"
  customerRole="Homeowner"
  rating={5}
  text="Outstanding service..."
  date="2025-12-15"
  verified={true}
  serviceSlug="primary-service"
  service="Primary Service"
/>;
```

**Props:**
| Prop | Type | Required |
|------|------|----------|
| customerName | string | Yes |
| customerRole | string | No |
| customerCompany | string | No |
| rating | number (1-5) | Yes |
| text | string | Yes |
| excerpt | string | No |
| date | string | Yes |
| verified | boolean | No |
| platform | string | No |
| service | string | No |
| serviceSlug | string | No |
| location | string | No |
| locationSlug | string | No |

---

## Rating Components

### StarRating

Displays 1-5 star rating.

```tsx
import { StarRating } from '@/components/ui/star-rating';

<StarRating rating={4} size="md" />;
```

**Props:**
| Prop | Type | Options |
|------|------|---------|
| rating | number | 1-5 |
| size | string | "sm" \| "md" \| "lg" |

### AggregateRatingDisplay

Shows overall rating with distribution.

```tsx
import { AggregateRatingDisplay } from '@/components/ui/aggregate-rating-display';

<AggregateRatingDisplay
  average={4.8}
  count={127}
  distribution={{
    5: 95,
    4: 22,
    3: 7,
    2: 2,
    1: 1,
  }}
/>;
```

---

## Navigation

### Breadcrumbs

Breadcrumb navigation trail.

```tsx
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

<Breadcrumbs
  items={[
    { title: 'Home', href: '/' },
    { title: 'Services', href: '/services' },
    { title: 'Plumbing', href: '/services/plumbing' },
  ]}
/>;
```

---

## Schema Component

Renders JSON-LD structured data.

```tsx
import { Schema } from '@/components/Schema';

<Schema
  organization={organizationSchema}
  breadcrumbs={breadcrumbItems}
  faq={faqItems}
  aggregateRating={{
    average: 4.8,
    count: 127,
  }}
/>;
```

---

## Layout Components

### ContentGrid

Responsive grid for content items.

```tsx
import { ContentGrid } from '@/components/ui/content-grid';

<ContentGrid columns={3}>
  <Card />
  <Card />
  <Card />
</ContentGrid>;
```

### CardGrid

Responsive grid specifically for cards.

```tsx
import { CardGrid } from '@/components/ui/card-grid';

<CardGrid>
  {posts.map((post) => (
    <BlogPostCard key={post.slug} {...post} />
  ))}
</CardGrid>;
```

---

## Accessibility Notes

All components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management
- Color contrast compliance

When using components, ensure:

- Images have meaningful alt text
- Links have descriptive text
- Form elements have labels
- Interactive elements are keyboard accessible
