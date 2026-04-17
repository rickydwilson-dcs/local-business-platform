# Reference Analysis Report

**Analysis Version:** 1
**Reference URL:** https://colorcode.events/
**Screenshot:** /Users/rickywilson/Sites/local-business-platform/output/screencapture-colorcode-events-2026-02-20-12_32_12.png
**Captured:** 2026-02-20T12:32:12Z

## Palette

| Token      | Hex     |
| ---------- | ------- |
| Background | #2A2A64 |
| Foreground | #FFFFFF |
| Primary    | #2A2A64 |
| Secondary  | #F5C800 |
| Accent     | #3B9E3B |
| Additional | #2E7DD1 |
| Additional | #E8334A |
| Additional | #FF6B35 |
| Additional | #8B5CF6 |

**Confidence:** high

## Visual Language

- Heading weight: black
- Body weight: normal
- Heading style: display
- Inline colour highlights: yes
- Hero pattern: dark-full-bleed
- Spacing density: standard

## Detected Sections

| #   | Name                   | Background | Layout          | Purpose    | Notes                                                                                                                          |
| --- | ---------------------- | ---------- | --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Site Header            | #2A2A64    | full-bleed-band | nav        | Dark navy header with ColorCode logo on left, a pink/red CTA button and hamburger menu on right                                |
| 2   | Hero Banner            | #2A2A64    | full-bleed-band | hero       | Large bold headline with inline colour highlights and decorative icons, dark navy background, no background image in text area |
| 3   | Event Details Band     | #1A1A4E    | full-bleed-band | info       | Full-width dark band with event photo background overlay, shows event name, date, time, location and an Event Info CTA button  |
| 4   | Call For Speakers      | #F5C800    | split           | cta        | Yellow background split section with heading, body text, Apply to Speak button on left and a photo of a speaker on right       |
| 5   | Call For Sponsors      | #2E7DD1    | split           | sponsor    | Blue background split section with heading and body text on right, View Sponsor Ladder CTA button, image implied on left       |
| 6   | Call For Volunteers    | #3B9E3B    | full-bleed-band | cta        | Green full-width band with heading, short body text and Apply to Volunteer button                                              |
| 7   | Blog Section           | #FFFFFF    | grid            | blog       | White background with Blog heading, two blog post cards each with thumbnail image, title, date and Read More button            |
| 8   | ColorCode Events About | #2A2A64    | split           | about      | Dark navy split section with heading on left, body text and Learn More button on right, decorative dot pattern                 |
| 9   | Photo Strip            | #000000    | full-bleed-band | custom     | Full-width horizontal strip of event photography images side by side                                                           |
| 10  | Newsletter Signup      | #2A2A64    | full-bleed-band | newsletter | Dark navy band with Subscribe to Newsletter heading, subtext, email input field and Submit button                              |
| 11  | Site Footer            | #1A1A4E    | contained       | footer     | Dark footer with four columns: Events, Support, Legal, Company links, plus ColorCode logo and social icons                     |

## Component Mappings

| Section                | Status | Existing Component | Notes                                                                                                                                    | Confidence |
| ---------------------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Site Header            | ADAPT  | site-header        | Use site-header with dark variant, swap logo, add pink CTA button alongside hamburger menu                                               | high       |
| Hero Banner            | ADAPT  | hero-section       | Adapt hero-section to dark-full-bleed with large black-weight display heading supporting inline colour highlights via rich text or spans | medium     |
| Event Details Band     | NEW    | —                  | New EventDetailsBand component needed: full-bleed with background image overlay, event metadata fields and CTA button                    | high       |
| Call For Speakers      | ADAPT  | cta-section        | Adapt cta-section to split layout with yellow background, left text+button, right image panel                                            | medium     |
| Call For Sponsors      | ADAPT  | cta-section        | Adapt cta-section to split layout with blue background, text on right side, image on left                                                | medium     |
| Call For Volunteers    | ADAPT  | cta-section        | Adapt cta-section to full-bleed-band with green background, single column text and button                                                | high       |
| Blog Section           | ADAPT  | card-grid          | Use card-grid with blog-post-card children, white background, two-column grid layout                                                     | high       |
| ColorCode Events About | ADAPT  | service-about      | Adapt service-about to dark navy background split layout with heading left, body+CTA right                                               | medium     |
| Photo Strip            | NEW    | —                  | New PhotoStrip component needed: horizontal scrolling or fixed row of event photos                                                       | high       |
| Newsletter Signup      | NEW    | —                  | New NewsletterSignup component needed: dark band with heading, subtext, inline email input and submit button                             | medium     |
| Site Footer            | ADAPT  | footer             | Adapt footer to dark navy with four-column link groups and logo with social icons                                                        | high       |

## New Component Backlog

### EventDetailsBand

Full-bleed section with background image overlay displaying event name, date, time, location and a CTA button

**Reference section:** Event Details Band

**Props contract:**

```typescript
interface EventDetailsBandProps {
  backgroundImage: string;
  eventName: string;
  date: string;
  timeRange: string;
  venue: string;
  ctaLabel: string;
  ctaHref: string;
  overlayOpacity?: number;
}
```

**Token constraints:** Must use brand.primary for overlay tint, brand.accent for CTA button, typography.fontFamilyHeading for event name

**Acceptance criteria:**

- Renders full-width with background image and dark overlay
- Displays event name, date, time and venue in white text
- CTA button links to event info page
- Overlay opacity is configurable via prop
- Responsive: stacks metadata vertically on mobile

### PhotoStrip

Horizontal strip of event photography images displayed side by side at full viewport width

**Reference section:** Photo Strip

**Props contract:**

```typescript
interface PhotoStripProps {
  images: Array<{ src: string; alt: string }>;
  height?: number;
  objectFit?: "cover" | "contain";
}
```

**Token constraints:** No background token required; images fill the strip. Height should reference a spacing scale token.

**Acceptance criteria:**

- Renders images in a single horizontal row
- Images fill available height without gaps
- On mobile, strip scrolls horizontally or collapses to a 2-column grid
- Alt text is applied to each image for accessibility

### NewsletterSignup

Full-bleed band with newsletter subscription form including heading, subtext, email input and submit button

**Reference section:** Newsletter Signup

**Props contract:**

```typescript
interface NewsletterSignupProps {
  heading: string;
  subtext?: string;
  inputPlaceholder?: string;
  buttonLabel: string;
  onSubmit: (email: string) => void;
  background?: string;
}
```

**Token constraints:** Must use surface.background or brand.primary for band background, brand.accent for submit button, typography.fontFamilySans for body text

**Acceptance criteria:**

- Renders full-width band with configurable background colour
- Email input and submit button are inline on desktop, stacked on mobile
- Validates email format before submission
- Shows success/error state after submission
- Heading and subtext are configurable via props

## Registry Recommendation

- Theme: colorcode-events
- Hero variant: image-overlay
- Header variant: dark
- Card variant: standard
- Section variant: banded
- Confidence: high
- Reasoning: The site uses strongly coloured full-bleed bands alternating between navy, yellow, blue and green to create visual rhythm. The hero is a dark full-bleed with image overlay for the event details. Cards are standard rectangular with image thumbnails. The overall pattern is banded with high-contrast colour blocks rather than gradients or subtle backgrounds.

## Theme Token Recommendations

| Token              | Value                        |
| ------------------ | ---------------------------- |
| brand.primary      | #2A2A64                      |
| brand.primaryHover | #1A1A4E                      |
| brand.secondary    | #F5C800                      |
| brand.accent       | #3B9E3B                      |
| surface.background | #2A2A64                      |
| surface.foreground | #FFFFFF                      |
| surface.muted      | #1A1A4E                      |
| typography.sans    | Inter, system-ui, sans-serif |
| typography.heading | Inter, system-ui, sans-serif |
