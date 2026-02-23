# Atlas Theme

**Reference site:** https://themes.boldway.agency/deep/bold/
**Analysis date:** 2026-02-22T07:25:52.892Z
**Analysis version:** 3

## Registry

- Theme: vega
- Confidence: medium
- Reasoning: The site uses a light header, light background (#e8e8e8), and no dark full-bleed hero or circular icon patterns. The overall aesthetic — light surfaces, a blue primary palette, and a tabular content layout — aligns most closely with the vega profile (light header, content-forward layout). Only a single page was analysed, so confidence is medium rather than high.

## Components

| Component | Category | File |
|-----------|----------|------|
| DirectoryListing | Custom | components/custom-directory-listing.tsx |

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
