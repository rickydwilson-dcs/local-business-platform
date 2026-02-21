# Lyra Theme

**Reference site:** https://colorcode.events/
**Analysis date:** 2026-02-21T18:34:48.273Z
**Analysis version:** 3

## Registry

- Theme: orion
- Confidence: high
- Reasoning: The site consistently uses a dark header across all pages, a full-bleed hero with background image on the homepage, and a bold typographic-first layout with a deep navy/purple primary background. These characteristics — dark header, full-bleed hero, strong brand colour blocks, and icon/graphic accents — align directly with the orion constellation theme definition.

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
| HowItStarted | Content | components/how-it-started.tsx |
| TeamMemberCard | Cards | components/team-member-card.tsx |
| EventPhotoGallery | Social Proof | components/event-photo-gallery.tsx |
| ErrorMessageCard | Custom | components/error-message-card.tsx |
| SiteFooter | Footer | components/site-footer.tsx |
| BlogStats | Stats | components/blog-stats.tsx |
| TeamMemberBenDunkle | Cards | components/cards-team-member-green.tsx |
| TeamMemberRonBrennan | Cards | components/cards-team-member-orange.tsx |
| TeamMemberTimBouchard | Cards | components/cards-team-member-blue.tsx |
| SiteFooter | Footer | components/footer-site-links.tsx |
| BlogPostGrid | Blog | components/blog-cards-two-column-grid.tsx |
| NewsletterSubscribeCTA | CTA | components/cta-newsletter-inline-form.tsx |
| RegistrationErrorState | Custom | components/custom-error-message-centered.tsx |
| NewsletterSubscribeBanner | CTA | components/cta-newsletter-banner.tsx |
| SiteFooter | Footer | components/footer-multi-column.tsx |
| ErrorMessageCard | Content | components/content-error-card-centered.tsx |
| NewsletterSubscribeBanner | CTA | components/cta-newsletter-form-banner.tsx |
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
