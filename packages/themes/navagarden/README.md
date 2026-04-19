# Navagarden Theme

**Reference site:** https://navagarden.hu/
**Analysis date:** 2026-04-17T19:17:52.282Z
**Analysis version:** 3

## Registry

- Theme: navagarden
- Confidence: high
- Reasoning: From DesignBrief

## Components

| Component                | Category | File                                       |
| ------------------------ | -------- | ------------------------------------------ |
| NavigationLogoLinks      | Custom   | components/navigation-logo-links.tsx       |
| HeroSplitImageText       | Custom   | components/hero-split-image-text.tsx       |
| CardsThreeColumnFeatures | Custom   | components/cards-three-column-features.tsx |
| ContentGalleryHeading    | Custom   | components/content-gallery-heading.tsx     |
| SocialProofProviderCard  | Custom   | components/social-proof-provider-card.tsx  |
| FooterContactInfo        | Custom   | components/footer-contact-info.tsx         |

## Wiring into a Site

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/themes/navagarden/*": ["../../packages/themes/navagarden/*"]
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
@import "../../packages/themes/navagarden/globals.css";
```

### 4. theme.config.ts

```ts
import { navagardenDefaultConfig } from "@platform/themes/navagarden";

export const themeConfig = {
  ...navagardenDefaultConfig,
  // Override colours as needed:
  // colors: { brand: { primary: "#your-hex" } },
};
```

## Verification

Colours in this theme were extracted from a screenshot and may not be pixel-perfect.
Verify against the reference site and adjust hex values as needed.
