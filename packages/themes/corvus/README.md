# Corvus Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-04-12T21:50:40.240Z
**Analysis version:** 3

## Registry

- Theme: orion
- Confidence: high
- Reasoning: The site consistently uses a dark header, full-bleed hero sections with background imagery, and a deep navy/purple primary colour across all high-confidence vision-analysed pages. The homepage hero is a dark full-bleed typographic layout with coloured inline highlights, the navigation is dark throughout, and the overall density and layout patterns align closely with the orion definition of dark header plus full-bleed hero. The multi-colour accent system (yellow, red, green, blue, pink) layered over a dark primary surface further reinforces this classification.

## Components

| Component                      | Category     | File                                              |
| ------------------------------ | ------------ | ------------------------------------------------- |
| TopNavBar                      | Navigation   | components/top-nav-bar.tsx                        |
| HeroFullBleed                  | Hero         | components/hero-full-bleed-text.tsx               |
| EventDetailsBanner             | Hero         | components/hero-event-details-split.tsx           |
| PageTitleBanner                | Hero         | components/hero-page-title-banner.tsx             |
| CallForSpeakersCTA             | CTA          | components/cta-call-for-speakers-yellow.tsx       |
| CallForSponsorsCTA             | CTA          | components/cta-call-for-sponsors-blue.tsx         |
| CallForVolunteersCTA           | CTA          | components/cta-call-for-volunteers-green.tsx      |
| NewsletterSignupCTA            | CTA          | components/cta-newsletter-signup.tsx              |
| CtaGetTickets                  | CTA          | components/cta-get-tickets.tsx                    |
| BlogPreviewGrid                | Blog         | components/blog-card-grid.tsx                     |
| BlogPostBody                   | Blog         | components/blog-post-content-single.tsx           |
| ColorCodeEventsAbout           | Content      | components/content-about-events-dark.tsx          |
| HowItStartedSection            | Content      | components/content-two-column-origin-story.tsx    |
| ContentBlock                   | Content      | components/content-generic.tsx                    |
| ContentPrivacyPolicy           | Content      | components/content-privacy-policy.tsx             |
| ContentCheckout                | Content      | components/content-checkout.tsx                   |
| OrderErrorMessage              | Custom       | components/custom-error-message-centered.tsx      |
| TeamMemberCard                 | Cards        | components/cards-team-member.tsx                  |
| CardsSponsors                  | Cards        | components/cards-sponsors.tsx                     |
| EventPhotoGallery              | Social Proof | components/social-proof-photo-gallery.tsx         |
| EventStats                     | Stats        | components/stats-event.tsx                        |
| SiteFooter                     | Footer       | components/footer-multi-column.tsx                |
| NavigationJumpTo               | Navigation   | components/navigation-jump-to.tsx                 |
| TeamMemberBenDunkle            | Cards        | components/cards-team-member-green.tsx            |
| TeamMemberRonBrennan           | Cards        | components/cards-team-member-orange.tsx           |
| TeamMemberTimBouchard          | Cards        | components/cards-team-member-blue.tsx             |
| SiteFooter                     | Footer       | components/footer-multi-column-links.tsx          |
| BlogPageBanner                 | Hero         | components/hero-blog-banner.tsx                   |
| Hero                           | Hero         | components/hero.tsx                               |
| NavigationBuffalo2025          | Navigation   | components/navigation-buffalo-2025.tsx            |
| StatsSaturday                  | Stats        | components/stats-saturday.tsx                     |
| Stats                          | Stats        | components/stats.tsx                              |
| StatsVenue                     | Stats        | components/stats-venue.tsx                        |
| StatsSchedule                  | Stats        | components/stats-schedule.tsx                     |
| StatsSpeakers                  | Stats        | components/stats-speakers.tsx                     |
| CtaSubscribeToOurNewsletter    | CTA          | components/cta-subscribe-to-our-newsletter.tsx    |
| Content                        | Content      | components/content.tsx                            |
| CtaColorcodeBuffaloTicketsComi | CTA          | components/cta-colorcode-buffalo-tickets-comi.tsx |
| ContentWhoops                  | Content      | components/content-whoops.tsx                     |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/corvus/*": ["../../packages/themes/corvus/*"]
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
@import "../../packages/themes/corvus/globals.css";
```

### 4. theme.config.ts

```ts
import { corvusDefaultConfig } from "@platform/themes/corvus";

export const themeConfig = {
  ...corvusDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
