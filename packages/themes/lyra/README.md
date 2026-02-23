# Lyra Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-02-22T07:23:38.432Z
**Analysis version:** 3

## Registry

- Theme: orion
- Confidence: high
- Reasoning: The site consistently uses a dark header across all pages, a full-bleed dark-background hero on the homepage with oversized typographic treatment, and bold coloured accent bands. The navigation is dark-on-dark with a logo left and controls right. These characteristics — dark header, full-bleed hero, strong brand colour blocks — align directly with the orion constellation pattern. The vega pattern (light header, split hero, card grid) does not match the dominant visual language observed across the high-confidence vision-analysed pages.

## Components

| Component | Category | File |
|-----------|----------|------|
| TopNavigation | Navigation | components/top-navigation.tsx |
| HeroHeadline | Hero | components/hero-headline.tsx |
| EventDetailsBanner | Hero | components/event-details-banner.tsx |
| PageTitleBanner | Hero | components/page-title-banner.tsx |
| NewsletterSignup | CTA | components/newsletter-signup.tsx |
| CallForSpeakersCTA | CTA | components/call-for-speakers-cta.tsx |
| CallForSponsorsCTA | CTA | components/call-for-sponsors-cta.tsx |
| CallForVolunteersCTA | CTA | components/call-for-volunteers-cta.tsx |
| BlogPostGrid | Blog | components/blog-post-grid.tsx |
| ColorCodeEventsAbout | Content | components/colorcode-events-about.tsx |
| HowItStartedSection | Content | components/how-it-started-section.tsx |
| EventPhotoGallery | Social Proof | components/event-photo-gallery.tsx |
| TeamMemberBio | Custom | components/team-member-bio.tsx |
| ErrorStateCentered | Custom | components/error-state-centered.tsx |
| BlogStats | Stats | components/blog-stats.tsx |
| SiteFooter | Footer | components/site-footer.tsx |
| TeamMemberBenDunkle | Custom | components/custom-team-member-green.tsx |
| TeamMemberRonBrennan | Custom | components/custom-team-member-orange.tsx |
| TeamMemberTimBouchard | Custom | components/custom-team-member-blue.tsx |
| BlogPostGrid | Blog | components/blog-cards-two-column.tsx |
| NewsletterSubscribeCTA | CTA | components/cta-newsletter-inline-form.tsx |
| SiteFooter | Footer | components/footer-multi-column-links.tsx |
| RegistrationErrorState | Custom | components/custom-error-message-centered.tsx |
| OrderErrorMessage | Custom | components/custom-error-card-centered.tsx |
| NewsletterSubscribeBanner | CTA | components/cta-newsletter-banner.tsx |
| OrderErrorCard | Content | components/content-error-card-centered.tsx |
| Hero | Hero | components/hero.tsx |
| ContentCheckout | Content | components/content-checkout.tsx |
| CtaSubscribeToOurNewsletter | CTA | components/cta-subscribe-to-our-newsletter.tsx |
| Content | Content | components/content.tsx |
| CtaColorcodeBuffaloTicketsComi | CTA | components/cta-colorcode-buffalo-tickets-comi.tsx |
| NavigationJumpTo | Navigation | components/navigation-jump-to.tsx |
| ContentWhoops | Content | components/content-whoops.tsx |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/lyra/*": ["../../packages/themes/lyra/*"]
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
@import "../../packages/themes/lyra/globals.css";
```

### 4. theme.config.ts

```ts
import { lyraDefaultConfig } from "@platform/themes/lyra";

export const themeConfig = {
  ...lyraDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
