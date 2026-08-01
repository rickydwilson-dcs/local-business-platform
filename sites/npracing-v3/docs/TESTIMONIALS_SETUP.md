# Testimonials Setup Guide

This guide covers setting up and managing customer testimonials/reviews in base-template.

## Directory Structure

```
content/
└── testimonials/
    ├── example-testimonial-1.mdx
    ├── example-testimonial-2.mdx
    ├── example-testimonial-3.mdx
    └── your-new-testimonial.mdx
```

## Creating a Testimonial

### 1. Create the MDX File

Create a new file in `content/testimonials/`:

- Use descriptive filenames: `sarah-johnson-residential.mdx`
- Or sequential: `testimonial-001.mdx`

### 2. Required Frontmatter

```yaml
---
customerName: 'Sarah Johnson'
rating: 5
text: 'Outstanding service from start to finish. The team was professional, punctual, and delivered exceptional results.'
date: '2025-12-15'
---
```

### 3. Full Example

```yaml
---
customerName: 'Sarah Johnson'
customerRole: 'Homeowner'
customerCompany: 'N/A'
rating: 5
text: "Outstanding service from start to finish. The team was professional, punctual, and delivered exceptional results. I couldn't be happier with the quality of work and would highly recommend them to anyone looking for reliable, expert service."
excerpt: 'Outstanding service from start to finish.'
photo: '/images/testimonials/sarah-johnson.webp'
date: '2025-12-15'
service: 'Primary Service'
serviceSlug: 'primary-service'
location: 'Main Area'
locationSlug: 'main-area'
projectType: 'residential'
featured: true
verified: true
platform: 'google'
---
Optional additional context about this review...
```

## Rating System

Ratings use a 1-5 star scale:

| Stars | Meaning       |
| ----- | ------------- |
| 5     | Excellent     |
| 4     | Good          |
| 3     | Average       |
| 2     | Below Average |
| 1     | Poor          |

```yaml
rating: 5 # Required, 1-5
```

## Platform Tracking

Track where reviews originated:

```yaml
platform: "internal"   # Collected directly
platform: "google"     # Google Business Profile
platform: "trustpilot" # Trustpilot
platform: "reviews.io" # Reviews.io
```

### Why Track Platforms?

- Shows review diversity
- Adds credibility
- Enables platform-specific badges/icons
- Supports Schema.org markup

## Featured Testimonials

Mark your best reviews as featured:

```yaml
featured: true
```

Featured testimonials:

- Appear in the "Featured Reviews" section
- May display on homepage
- Should be your strongest endorsements

## Verified Badge

Indicate verified reviews:

```yaml
verified: true   # Default
verified: false  # Unverified
```

Verified reviews display a verification badge, adding credibility.

## Service & Location Linking

Link testimonials to services and locations:

```yaml
# Service linking
service: 'Emergency Plumbing'
serviceSlug: 'emergency-plumbing'

# Location linking
location: 'Canterbury'
locationSlug: 'canterbury'
```

### Benefits of Linking

- Testimonials appear on relevant service pages
- Testimonials appear on relevant location pages
- Improves local SEO
- Helps customers find relevant reviews

## Project Type

Categorise by project type:

```yaml
projectType: "residential"   # Homes, private clients
projectType: "commercial"    # Businesses, offices
projectType: "industrial"    # Factories, warehouses
```

This enables filtering reviews by client type.

## Customer Information

### Minimum Required

```yaml
customerName: 'John S.' # Can be partial for privacy
```

### Full Details

```yaml
customerName: 'John Smith'
customerRole: 'Homeowner'
customerCompany: 'Smith Family' # Optional
photo: '/images/testimonials/john.webp' # Optional
```

### B2B Testimonials

```yaml
customerName: 'James Mitchell'
customerRole: 'Operations Director'
customerCompany: 'Mitchell Enterprises Ltd'
```

## Text Guidelines

### Main Text

- 20-1000 characters
- Should tell a story
- Include specific details
- Mention results achieved

### Excerpt

- Max 200 characters
- Used in listings/cards
- Most impactful sentence

```yaml
text: "The team completely renovated our kitchen in just two weeks. They were professional throughout, cleaned up daily, and the finished result exceeded our expectations. We've already recommended them to three neighbours."
excerpt: 'The finished result exceeded our expectations.'
```

## Aggregate Rating

The reviews page automatically calculates:

- Average rating across all testimonials
- Total review count
- Rating distribution (5-star, 4-star, etc.)

This powers the AggregateRating Schema.org markup for rich search results.

## Integration Points

### Reviews Page (`/reviews`)

All testimonials display here with:

- Aggregate rating summary
- Featured reviews section
- All reviews grid
- Rating distribution chart

### Service Pages

Display service-specific testimonials:

```typescript
// In service page
const testimonials = await getTestimonialsByService('service-slug');
```

### Location Pages

Display location-specific testimonials:

```typescript
// In location page
const testimonials = await getTestimonialsByLocation('location-slug');
```

### Homepage

Display featured testimonials:

```typescript
// In homepage
const featured = await getFeaturedTestimonials(3);
```

## Schema.org Markup

Testimonials generate rich search data:

### AggregateRating

```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "127"
}
```

### Individual Reviews

```json
{
  "@type": "Review",
  "author": "Sarah Johnson",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "reviewBody": "Outstanding service..."
}
```

## Content Moderation

### Before Publishing

- Verify review authenticity
- Get permission to publish
- Check for identifying information
- Ensure appropriate language

### Privacy Considerations

- Can use partial names: "John S." or "Sarah J."
- Photos are optional
- Company names optional for residential

## Routes

| Route      | Description           |
| ---------- | --------------------- |
| `/reviews` | All testimonials page |

Note: Individual testimonial pages are not generated by default. Testimonials are displayed in card format on listing pages.

## Validation

```bash
npm run validate:content
```

Check for:

- customerName present (2-100 chars)
- rating present (1-5)
- text present (20-1000 chars)
- date format (YYYY-MM-DD)

## Best Practices

### Collecting Reviews

1. Ask customers soon after project completion
2. Make it easy (provide direct links)
3. Ask for specific feedback
4. Thank customers for reviews

### Displaying Reviews

1. Mix featured and recent reviews
2. Include variety of ratings (4-5 stars)
3. Show reviews for different services
4. Update regularly with new reviews

### Responding to Reviews

While not stored in MDX, consider:

- Thank positive reviewers
- Address concerns professionally
- Use feedback to improve
