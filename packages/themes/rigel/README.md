# Rigel Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-03-29T19:54:17.236Z
**Analysis version:** 3

## Registry

- Theme: orion
- Confidence: high
- Reasoning: The site uses a dark header on every page, a full-bleed typographic hero with background imagery on the homepage, and strong brand colour accents throughout. The dominant dark navy/purple background, oversized black-weight headings with inline colour highlights, and full-bleed section bands all align with the orion pattern definition of dark header + full-bleed hero + bold graphic identity. The split hero and card grid elements are secondary patterns and do not override the dominant orion characteristics.

## Components

| Component | Category | File |
|-----------|----------|------|
| TopNavigation | Navigation | components/top-navigation.tsx |
| NewsletterSignupCTA | CTA | components/newsletter-signup-cta.tsx |
| SiteFooter | Footer | components/site-footer.tsx |
| HeroHeadline | Hero | components/hero-headline.tsx |
| EventDetailsBanner | Hero | components/event-details-banner.tsx |
| PageTitleBanner | Hero | components/page-title-banner.tsx |
| CallForSpeakersCTA | CTA | components/call-for-speakers-cta.tsx |
| CallForSponsorsCTA | CTA | components/call-for-sponsors-cta.tsx |
| CallForVolunteersCTA | CTA | components/call-for-volunteers-cta.tsx |
| BlogPreviewCards | Blog | components/blog-preview-cards.tsx |
| BlogPostArticle | Blog | components/blog-post-article.tsx |
| ColorCodeEventsAbout | Content | components/colorcode-events-about.tsx |
| HowItStarted | Content | components/how-it-started.tsx |
| TeamBioBlock | Content | components/team-bio-block.tsx |
| EventPhotoGallery | Social Proof | components/event-photo-gallery.tsx |
| EventStatsBlock | Stats | components/event-stats-block.tsx |
| SponsorsGrid | Cards | components/sponsors-grid.tsx |
| GetTicketsCTA | CTA | components/get-tickets-cta.tsx |
| RegistrationErrorCard | Custom | components/registration-error-card.tsx |
| LegalContent | Content | components/legal-content.tsx |
| CheckoutContent | Content | components/checkout-content.tsx |
| TeamBioBenDunkle | Content | components/content-team-bio-green.tsx |
| TeamBioRonBrennan | Content | components/content-team-bio-orange.tsx |
| TeamBioTimBouchard | Content | components/content-team-bio-blue.tsx |
| BlogPostGrid | Blog | components/blog-card-grid-two-col.tsx |
| BlogPageBanner | Hero | components/hero-blog-banner.tsx |
| BlogPostBody | Blog | components/content-blog-post-body.tsx |
| BlogPostArticle | Blog | components/blog-post-article-content.tsx |
| SiteHeader | Navigation | components/navigation-logo-cta-bar.tsx |
| NewsletterSignupBar | CTA | components/cta-newsletter-signup-bar.tsx |
| Hero | Hero | components/hero.tsx |
| NavigationBuffalo2025 | Navigation | components/navigation-buffalo-2025.tsx |
| StatsSaturday | Stats | components/stats-saturday.tsx |
| Stats | Stats | components/stats.tsx |
| StatsVenue | Stats | components/stats-venue.tsx |
| StatsSchedule | Stats | components/stats-schedule.tsx |
| StatsSpeakers | Stats | components/stats-speakers.tsx |
| CtaSubscribeToOurNewsletter | CTA | components/cta-subscribe-to-our-newsletter.tsx |
| Content | Content | components/content.tsx |
| CtaColorcodeBuffaloTicketsComi | CTA | components/cta-colorcode-buffalo-tickets-comi.tsx |
| NavigationJumpTo | Navigation | components/navigation-jump-to.tsx |
| ContentPrivacyPolicy | Content | components/content-privacy-policy.tsx |
| ContentWhoops | Content | components/content-whoops.tsx |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/rigel/*": ["../../packages/themes/rigel/*"]
    }
  }
}
```

### 2. next.config.mjs

```js
transpilePackages: ["@platform/themes"],
```

### 3. app/globals.css

```css
@import "../../packages/themes/rigel/globals.css";
```

### 4. theme.config.ts

```ts
import { rigelDefaultConfig } from "@platform/themes/rigel";

export const themeConfig = {
  ...rigelDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
