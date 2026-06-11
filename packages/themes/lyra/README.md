# Lyra Theme

**Reference site:** https://www.fountaindigital.co.uk/
**Analysis date:** 2026-04-27T06:23:40.913Z
**Analysis version:** 3

## Registry

- Theme: vega
- Confidence: high
- Reasoning: The site consistently uses a light header on a white or near-white background, a split hero layout on the homepage with text left and media right, and a card grid for services and case studies — all hallmarks of the vega pattern. The header is never dark; navigation is always light with a branded CTA button. The primary colour is a strong blue (#2563eb) with a spacious layout density and extrabold sans headings, which aligns well with vega's light-header, split-hero, card-grid archetype.

## Components

| Component                   | Category     | File                                            |
| --------------------------- | ------------ | ----------------------------------------------- |
| AnnouncementBar             | Navigation   | components/announcement-bar.tsx                 |
| PrimaryNavigation           | Navigation   | components/primary-navigation.tsx               |
| HeroSplit                   | Hero         | components/hero-split.tsx                       |
| CenteredPageHero            | Hero         | components/centered-page-hero.tsx               |
| ClientLogoStrip             | Social Proof | components/client-logo-strip.tsx                |
| TeamAvatarRow               | Social Proof | components/team-avatar-row.tsx                  |
| CustomerCountBanner         | Social Proof | components/customer-count-banner.tsx            |
| TestimonialsGrid            | Social Proof | components/testimonials-grid.tsx                |
| ServicesGrid                | Cards        | components/services-grid.tsx                    |
| FilteredCardsGrid           | Cards        | components/filtered-cards-grid.tsx              |
| FeaturedBlogPost            | Blog         | components/featured-blog-post.tsx               |
| GradientDividerBand         | CTA          | components/gradient-divider-band.tsx            |
| HelpCTABanner               | CTA          | components/help-cta-banner.tsx                  |
| FAQAccordion                | Content      | components/faq-accordion.tsx                    |
| ContactInformation          | Content      | components/contact-information.tsx              |
| ContactFormPanel            | Custom       | components/contact-form-panel.tsx               |
| LogoDesignQuestionnaireForm | Custom       | components/logo-design-questionnaire-form.tsx   |
| SiteFooter                  | Footer       | components/site-footer.tsx                      |
| AnnouncementBar             | Navigation   | components/navigation-top-bar-announcement.tsx  |
| PrimaryNavigation           | Navigation   | components/navigation-horizontal-logo-links.tsx |
| HeroSplit                   | Hero         | components/hero-split-text-illustration.tsx     |
| ClientLogoStrip             | Social Proof | components/social-proof-logo-strip.tsx          |
| SupportCTABanner            | CTA          | components/cta-dark-support-banner.tsx          |
| SiteFooter                  | Footer       | components/footer-multi-column-dark.tsx         |
| TopNavigation               | Navigation   | components/navigation-top-bar.tsx               |
| AboutHero                   | Hero         | components/hero-split-about.tsx                 |
| TeamAvatarCarousel          | Social Proof | components/social-proof-logo-carousel.tsx       |
| HelpCTABanner               | CTA          | components/cta-help-banner.tsx                  |
| SiteFooter                  | Footer       | components/footer-multi-column.tsx              |
| BlogHero                    | Hero         | components/hero-centered-blog-intro.tsx         |
| BlogArticleGrid             | Blog         | components/blog-cards-grid-filtered.tsx         |
| HelpCTABanner               | CTA          | components/cta-help-banner-dark.tsx             |
| ContactHero                 | Hero         | components/hero-split-contact-intro.tsx         |
| ContactFormPanel            | Custom       | components/custom-contact-form-split.tsx        |
| ContactInformation          | Content      | components/content-contact-information-list.tsx |
| EmergencyHelpCTA            | CTA          | components/cta-dark-split-emergency-help.tsx    |
| WebsiteHelpCTA              | CTA          | components/cta-dark-banner.tsx                  |
| LogoDesignQuestionnaireForm | Custom       | components/custom-multi-step-form.tsx           |
| HelpCTABanner               | CTA          | components/cta-split-illustration.tsx           |
| Navigation                  | Navigation   | components/navigation.tsx                       |

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
