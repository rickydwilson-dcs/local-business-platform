# Atlas Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-03-29T19:02:15.647Z
**Analysis version:** 3

## Registry

- Theme: orion
- Confidence: high
- Reasoning: The site consistently uses a dark header across all pages, a full-bleed hero with oversized typographic treatment on the homepage, and bold brand-primary dark-purple backgrounds for key sections. The navigation is dark with a logo-left, controls-right pattern. These characteristics — dark header, full-bleed hero, strong colour-block sections — align directly with the orion constellation theme definition.

## Components

| Component | Category | File |
|-----------|----------|------|
| TopNavBar | Navigation | components/top-nav-bar.tsx |
| HeroFullBleed | Hero | components/hero-full-bleed-text.tsx |
| EventDetailsBanner | Hero | components/hero-event-details-split.tsx |
| PageTitleBanner | Hero | components/hero-page-title-banner.tsx |
| NewsletterSignup | CTA | components/cta-newsletter-signup.tsx |
| SiteFooter | Footer | components/footer-multi-column.tsx |
| CallForSpeakers | CTA | components/cta-call-for-speakers.tsx |
| CallForSponsors | CTA | components/cta-call-for-sponsors.tsx |
| CallForVolunteers | CTA | components/cta-call-for-volunteers.tsx |
| CtaGetTickets | CTA | components/cta-get-tickets.tsx |
| BlogPreviewGrid | Blog | components/blog-cards-grid.tsx |
| BlogPostArticle | Blog | components/blog-post-article.tsx |
| ColorCodeEventsAbout | Content | components/content-about-events.tsx |
| HowItStartedSection | Content | components/content-two-column-origin-story.tsx |
| TeamMemberCard | Cards | components/cards-team-member.tsx |
| SponsorsGrid | Cards | components/cards-sponsors.tsx |
| EventStats | Stats | components/stats-event.tsx |
| PhotoGalleryStrip | Custom | components/custom-photo-gallery-strip.tsx |
| RegistrationErrorState | Custom | components/custom-error-message-centered.tsx |
| ContentBlock | Content | components/content-generic.tsx |
| NavigationJumpTo | Navigation | components/navigation-jump-to.tsx |
| TeamMemberBenDunkle | Cards | components/cards-team-member-green.tsx |
| TeamMemberRonBrennan | Cards | components/cards-team-member-orange.tsx |
| TeamMemberTimBouchard | Cards | components/cards-team-member-blue.tsx |
| SiteFooter | Footer | components/footer-multi-column-links.tsx |
| BlogPostGrid | Blog | components/blog-cards-two-column.tsx |
| NewsletterSubscribeCTA | CTA | components/cta-newsletter-inline-form.tsx |
| PageBanner | Hero | components/hero-page-banner.tsx |
| BlogPostArticle | Blog | components/blog-post-content-article.tsx |
| NewsletterSignup | CTA | components/cta-newsletter-form.tsx |
| BlogPostArticle | Blog | components/blog-post-content-single.tsx |
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
| ContentPrivacyPolicy | Content | components/content-privacy-policy.tsx |
| ContentCheckout | Content | components/content-checkout.tsx |
| ContentWhoops | Content | components/content-whoops.tsx |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/atlas/*": ["../../packages/themes/atlas/*"]
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
@import "../../packages/themes/atlas/globals.css";
```

### 4. theme.config.ts

```ts
import { atlasDefaultConfig } from "@platform/themes/atlas";

export const themeConfig = {
  ...atlasDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
