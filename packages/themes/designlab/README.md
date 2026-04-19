# Designlab Theme

**Reference site:** https://www.designlab-eastbourne.co.uk/
**Analysis date:** 2026-04-18T05:48:16.259Z
**Analysis version:** 3

## Registry

- Theme: designlab
- Confidence: high
- Reasoning: From DesignBrief

## Components

| Component              | Category | File                                     |
| ---------------------- | -------- | ---------------------------------------- |
| NavigationLogoLinksCta | Custom   | components/navigation-logo-links-cta.tsx |
| HeroSplitImageRight    | Custom   | components/hero-split-image-right.tsx    |
| CardsIconGridDark      | Custom   | components/cards-icon-grid-dark.tsx      |
| CardsServicesGrid      | Custom   | components/cards-services-grid.tsx       |
| CustomPortfolioGallery | Custom   | components/custom-portfolio-gallery.tsx  |
| SocialProofReviews     | Custom   | components/social-proof-reviews.tsx      |
| CtaBannerFullWidth     | Custom   | components/cta-banner-full-width.tsx     |
| FooterMultiColumn      | Custom   | components/footer-multi-column.tsx       |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/designlab/*": ["../../packages/themes/designlab/*"]
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
@import "../../packages/themes/designlab/globals.css";
```

### 4. theme.config.ts

```ts
import { designlabDefaultConfig } from "@platform/themes/designlab";

export const themeConfig = {
  ...designlabDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
