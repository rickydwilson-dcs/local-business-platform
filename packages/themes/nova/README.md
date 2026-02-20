# Nova Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-02-20T12:32:12Z

## Registry Values

| Key | Value |
|-----|-------|
| heroVariant | image-overlay |
| headerVariant | dark |
| cardVariant | standard |
| sectionVariant | banded |
| confidence | high |

**Reasoning:** The site uses strongly coloured full-bleed bands alternating between navy, yellow, blue and green to create visual rhythm. The hero is a dark full-bleed with image overlay for the event details. Cards are standard rectangular with image thumbnails. The overall pattern is banded with high-contrast colour blocks rather than gradients or subtle backgrounds.

## Component Mapping

| Section | Status | Existing Component | Notes |
|---------|--------|-------------------|-------|
| Site Header | ADAPT | site-header | Use site-header with dark variant, swap logo, add pink CTA button alongside hamburger menu |
| Hero Banner | ADAPT | hero-section | Adapt hero-section to dark-full-bleed with large black-weight display heading supporting inline colour highlights via rich text or spans |
| Event Details Band | NEW | — | New EventDetailsBand component needed: full-bleed with background image overlay, event metadata fields and CTA button |
| Call For Speakers | ADAPT | cta-section | Adapt cta-section to split layout with yellow background, left text+button, right image panel |
| Call For Sponsors | ADAPT | cta-section | Adapt cta-section to split layout with blue background, text on right side, image on left |
| Call For Volunteers | ADAPT | cta-section | Adapt cta-section to full-bleed-band with green background, single column text and button |
| Blog Section | ADAPT | card-grid | Use card-grid with blog-post-card children, white background, two-column grid layout |
| ColorCode Events About | ADAPT | service-about | Adapt service-about to dark navy background split layout with heading left, body+CTA right |
| Photo Strip | NEW | — | New PhotoStrip component needed: horizontal scrolling or fixed row of event photos |
| Newsletter Signup | NEW | — | New NewsletterSignup component needed: dark band with heading, subtext, inline email input and submit button |
| Site Footer | ADAPT | footer | Adapt footer to dark navy with four-column link groups and logo with social icons |

## Gap Components

### EventDetailsBand

Full-bleed section with background image overlay displaying event name, date, time, location and a CTA button

```typescript
interface EventDetailsBandProps { backgroundImage: string; eventName: string; date: string; timeRange: string; venue: string; ctaLabel: string; ctaHref: string; overlayOpacity?: number; }
```

**Token constraints:** Must use brand.primary for overlay tint, brand.accent for CTA button, typography.fontFamilyHeading for event name

### PhotoStrip

Horizontal strip of event photography images displayed side by side at full viewport width

```typescript
interface PhotoStripProps { images: Array<{ src: string; alt: string }>; height?: number; objectFit?: 'cover' | 'contain'; }
```

**Token constraints:** No background token required; images fill the strip. Height should reference a spacing scale token.

### NewsletterSignup

Full-bleed band with newsletter subscription form including heading, subtext, email input and submit button

```typescript
interface NewsletterSignupProps { heading: string; subtext?: string; inputPlaceholder?: string; buttonLabel: string; onSubmit: (email: string) => void; background?: string; }
```

**Token constraints:** Must use surface.background or brand.primary for band background, brand.accent for submit button, typography.fontFamilySans for body text

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
