# Lyra Theme

**Reference site:** https://www.fountaindigital.co.uk/
**Analysis date:** 2026-04-25T05:33:40.645Z
**Analysis version:** 3

## Registry

- Theme: vega
- Confidence: high
- Reasoning: The site consistently uses a light white header with no dark background, a two-column split hero on the primary page, and card grids for services and case studies — all hallmarks of the vega pattern. The header is light across all pages, the hero is split rather than full-bleed dark, and the layout relies on card grids rather than circular icon arrangements. The dark navy is reserved for the footer and CTA banners only, not the header or hero, ruling out orion.

## Components

| Component                   | Category     | File                                            |
| --------------------------- | ------------ | ----------------------------------------------- |
| AnnouncementBar             | Navigation   | components/announcement-bar.tsx                 |
| SiteHeader                  | Navigation   | components/site-header.tsx                      |
| HeroSplit                   | Hero         | components/hero-split.tsx                       |
| HeroCentered                | Hero         | components/hero-centered.tsx                    |
| ClientLogoStrip             | Social Proof | components/client-logo-strip.tsx                |
| ClientLogoCarousel          | Social Proof | components/client-logo-carousel.tsx             |
| TestimonialsStrip           | Social Proof | components/testimonials-strip.tsx               |
| ServicesGrid                | Cards        | components/services-grid.tsx                    |
| CaseStudiesGrid             | Cards        | components/case-studies-grid.tsx                |
| MidPageCTABanner            | CTA          | components/mid-page-cta-banner.tsx              |
| HelpCTABanner               | CTA          | components/help-cta-banner.tsx                  |
| CustomerCountBanner         | Stats        | components/customer-count-banner.tsx            |
| FAQSection                  | Content      | components/faq-section.tsx                      |
| FeaturedBlogPost            | Blog         | components/featured-blog-post.tsx               |
| BlogArticleGrid             | Blog         | components/blog-article-grid.tsx                |
| ContactFormPanel            | Custom       | components/contact-form-panel.tsx               |
| LogoDesignQuestionnaireForm | Custom       | components/logo-design-questionnaire-form.tsx   |
| SiteFooter                  | Footer       | components/site-footer.tsx                      |
| SiteHeader                  | Navigation   | components/navigation-sticky-top.tsx            |
| HeroSplit                   | Hero         | components/hero-split-animated.tsx              |
| MidPageCTABanner            | CTA          | components/cta-full-bleed-gradient.tsx          |
| SupportCTABanner            | CTA          | components/cta-dark-support-banner.tsx          |
| AnnouncementBar             | Navigation   | components/navigation-top-bar-announcement.tsx  |
| PrimaryNavigation           | Navigation   | components/navigation-horizontal-logo-links.tsx |
| AboutHero                   | Hero         | components/hero-split-text-image.tsx            |
| ContentSpacer               | Content      | components/content-blank-spacer.tsx             |
| HelpCTABanner               | CTA          | components/cta-dark-split-with-avatars.tsx      |
| SiteFooter                  | Footer       | components/footer-multi-column-links.tsx        |
| SiteHeader                  | Navigation   | components/navigation-top-bar.tsx               |
| BlogHero                    | Hero         | components/hero-blog-centered.tsx               |
| ContactHero                 | Hero         | components/hero-split-contact-intro.tsx         |
| SupportCTABanner            | CTA          | components/cta-dark-split-support.tsx           |
| SiteFooter                  | Footer       | components/footer-multi-column-dark.tsx         |
| CaseStudiesHero             | Hero         | components/hero-centered-light.tsx              |
| EmergencyCTABanner          | CTA          | components/cta-dark-full-bleed.tsx              |
| PrimaryNavigation           | Navigation   | components/navigation-header-logo-links.tsx     |
| PageHero                    | Hero         | components/hero-centered-page-title.tsx         |
| HelpCTABanner               | CTA          | components/cta-help-banner-split.tsx            |
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
