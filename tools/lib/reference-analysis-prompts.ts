/**
 * Reference Analysis Prompts
 *
 * Vision prompt template for Claude to analyse a reference website screenshot
 * and produce structured JSON matching the ReferenceAnalysis v2 schema.
 */

export const REFERENCE_ANALYSIS_PROMPT = `You are analysing a screenshot of a reference website to extract visual design patterns for a white-label website platform.

This screenshot may have been captured at a different time than today. Analyse what is visible, not what may have changed.

Return ONLY a JSON object (no prose, no markdown fences) matching this exact schema:

{
  "analysisVersion": "2",
  "reference": {
    "url": "<url if provided, otherwise null>",
    "screenshotPath": "<path if provided, otherwise null>",
    "capturedAt": "<ISO 8601 timestamp>"
  },
  "visualLanguage": {
    "palette": {
      "background": "<hex>",
      "foreground": "<hex>",
      "primary": "<hex — sample the actual dominant brand colour pixel, NEVER #000000 or #FFFFFF>",
      "secondary": "<hex — sample secondary brand colour, NEVER #000000 or #FFFFFF>",
      "accent": "<hex — sample accent/highlight colour, NEVER #000000 or #FFFFFF>",
      "additional": ["<hex>"],
      "confidence": "<one of: high, medium, low>"
    },
    "typography": {
      "headingWeight": "<one of: bold, extrabold, black>",
      "bodyWeight": "<one of: normal, medium>",
      "headingStyle": "<one of: sans, serif, display>",
      "usesInlineColourHighlights": "<boolean — true if headings use coloured spans or gradient text>"
    },
    "heroPattern": {
      "type": "<one of: dark-full-bleed, split, centered, light>",
      "hasBackgroundImage": "<boolean>",
      "headerDark": "<boolean>"
    },
    "spacingDensity": "<one of: compact, standard, spacious>"
  },
  "detectedSections": [
    {
      "name": "<descriptive name>",
      "background": "<hex or description>",
      "layoutType": "<one of: full-bleed-band, contained, split, grid, strip>",
      "purpose": "<one of: cta, info, blog, about, testimonial, nav, footer, sponsor, newsletter, hero, custom>",
      "notes": "<brief description of what this section contains>"
    }
  ],
  "sectionBlueprints": [
    {
      "id": "<unique slug, e.g. hero-full-bleed>",
      "name": "<PascalCase component name, e.g. HeroFullBleed>",
      "category": "<one of: Hero, Navigation, Cards, CTA, Content, Social Proof, Blog, Stats, Footer, Custom>",
      "purpose": "<what this section does>",
      "layoutPattern": "<structural description: full-bleed with overlay / 2-col grid / etc.>",
      "contentSlots": ["<named content area>"],
      "interactionNeeds": "<one of: none, minimal, stateful>",
      "componentFileName": "<kebab-case.tsx>",
      "componentExportName": "<PascalCase>",
      "tokenUsageHints": ["bg-brand-primary", "text-surface-foreground"],
      "confidence": "<one of: high, medium, low>",
      "referenceSection": "<which detectedSection name this maps to>"
    }
  ],
  "registryRecommendation": {
    "themeName": "<pick from constellation namespace: orion, vega, lyra, atlas, nova, etc.>",
    "confidence": "<one of: high, medium, low>",
    "reasoning": "<brief explanation>"
  },
  "themeTokenRecommendations": {
    "brand": {
      "primary": "<hex>",
      "primaryHover": "<hex — slightly darker/lighter variant>",
      "secondary": "<hex>",
      "accent": "<hex>"
    },
    "surface": {
      "background": "<hex>",
      "foreground": "<hex>",
      "muted": "<hex>"
    },
    "typography": {
      "fontFamilySans": ["<font name>", "system-ui", "sans-serif"],
      "fontFamilyHeading": ["<font name>", "system-ui", "sans-serif"]
    }
  }
}

IMPORTANT INSTRUCTIONS:
1. For palette colours, sample the ACTUAL pixel colours from the screenshot. Use hex values, not colour names.
2. List sections in order from top to bottom of the page.
3. For each detected section, produce a sectionBlueprint with all fields above. Do NOT match against existing components. Every section gets its own blueprint — this theme will have its own complete set of components.
4. The "id" should be a unique kebab-case slug derived from the section's category and layout (e.g. "hero-full-bleed", "cards-icon-grid", "cta-dark-band").
5. The "name" and "componentExportName" should be PascalCase (e.g. "HeroFullBleed").
6. The "componentFileName" should be the kebab-case version with .tsx extension (e.g. "hero-full-bleed.tsx").
7. The "contentSlots" should list all named content areas the component needs (e.g. ["heading", "subheading", "ctaButtons", "backgroundImage"]).
8. Set "interactionNeeds" to "stateful" only if the section clearly requires client-side state (accordion, carousel, tabs). Use "none" for static content, "minimal" for hover effects or simple transitions.
9. The "tokenUsageHints" should list Tailwind theme token classes the component should use (e.g. "bg-brand-primary", "text-surface-foreground").
10. Return ONLY the JSON object. No explanation, no markdown fences, no commentary.`;

export const PAGE_LAYOUT_ANALYSIS_PROMPT = `You are analysing a screenshot of a single page from a multi-page website.

Context:
- Page type: {{pageType}}
- URL path: {{path}}
- HTML structure hints are provided below as JSON.

Analyse the screenshot and HTML hints together. Identify every visual section from top to bottom.

Return ONLY valid JSON. No markdown fences. No commentary.

Schema:

{
  "pageType": "{{pageType}}",
  "path": "{{path}}",
  "title": "<page title from content>",
  "sections": [
    {
      "order": 1,
      "blueprintId": "<unique kebab-case slug, e.g. hero-full-bleed>",
      "name": "<PascalCase component name>",
      "category": "<one of: Hero, Navigation, Cards, CTA, Content, Social Proof, Blog, Stats, Footer, Custom>",
      "purpose": "<what this section does>",
      "layoutPattern": "<structural description>",
      "contentSlots": ["<named content area>"],
      "interactionNeeds": "<one of: none, minimal, stateful>",
      "tokenUsageHints": ["bg-brand-primary"],
      "confidence": "<one of: high, medium, low>",
      "isShared": false
    }
  ],
  "visualLanguage": {
    "palette": {
      "background": "<hex>",
      "foreground": "<hex>",
      "primary": "<hex — the dominant brand colour, NEVER #000000 or #FFFFFF>",
      "secondary": "<hex — secondary brand colour, NEVER #000000 or #FFFFFF>",
      "accent": "<hex — accent/highlight colour, NEVER #000000 or #FFFFFF>",
      "additional": [],
      "confidence": "<one of: high, medium, low>"
    },
    "typography": {
      "headingWeight": "<one of: bold, extrabold, black>",
      "bodyWeight": "<one of: normal, medium>",
      "headingStyle": "<one of: sans, serif, display>",
      "usesInlineColourHighlights": "<boolean — true if headings use coloured spans or gradient text>"
    },
    "heroPattern": {
      "type": "<one of: dark-full-bleed, split, centered, light>",
      "hasBackgroundImage": "<boolean>",
      "headerDark": "<boolean>"
    },
    "spacingDensity": "<one of: compact, standard, spacious>"
  },
  "confidence": "<one of: high, medium, low>"
}

INSTRUCTIONS:
1. Sample ACTUAL pixel colours from the screenshot. Use hex values. Never output #000000 or #FFFFFF as brand colours.
2. List sections in order from top to bottom.
3. Mark header and footer sections as "isShared": true.
4. The "blueprintId" should be unique kebab-case combining category and layout.
5. Return ONLY valid JSON. No markdown fences. No commentary.`;

export const SITE_SYNTHESIS_PROMPT = `You are consolidating per-page analysis results from a multi-page website into a unified site analysis.

Input: JSON array of per-page analysis results (each includes a visualLanguage object with colour data).

Tasks:
1. Identify shared sections that appear on every/most pages (header, footer, CTA bands). Mark them and deduplicate.
2. Deduplicate section blueprints across pages — same hero pattern on home + about = one blueprint.
3. Resolve conflicting colour readings: For each colour token, use the hex value that appears most frequently across pages. If tied, prefer the homepage's values. Never output #000000 or #FFFFFF as brand colours.
4. Produce consolidated themeTokenRecommendations (single palette for the whole site).
5. Determine registryRecommendation: pick from the constellation namespace (orion, vega, lyra, atlas, nova, etc.). orion = dark header + full-bleed hero + circular icons, vega = light header + split hero + card grid.

Return ONLY valid JSON. No markdown fences. No commentary.

Schema:

{
  "sharedSections": ["<blueprintId>"],
  "deduplicatedBlueprints": [
    {
      "id": "<unique kebab-case slug>",
      "name": "<PascalCase>",
      "category": "<one of: Hero, Navigation, Cards, CTA, Content, Social Proof, Blog, Stats, Footer, Custom>",
      "purpose": "<what this section does>",
      "layoutPattern": "<structural description>",
      "contentSlots": ["<slot>"],
      "interactionNeeds": "<one of: none, minimal, stateful>",
      "componentFileName": "<kebab-case.tsx>",
      "componentExportName": "<PascalCase>",
      "tokenUsageHints": ["<token>"],
      "confidence": "<one of: high, medium, low>",
      "referenceSection": "<source page type + section name>"
    }
  ],
  "visualLanguage": {
    "palette": {
      "background": "<hex>",
      "foreground": "<hex>",
      "primary": "<hex — NEVER #000000 or #FFFFFF>",
      "secondary": "<hex — NEVER #000000 or #FFFFFF>",
      "accent": "<hex — NEVER #000000 or #FFFFFF>",
      "additional": [],
      "confidence": "<one of: high, medium, low>"
    },
    "typography": {
      "headingWeight": "<one of: bold, extrabold, black>",
      "bodyWeight": "<one of: normal, medium>",
      "headingStyle": "<one of: sans, serif, display>",
      "usesInlineColourHighlights": "<boolean — true if headings use coloured spans or gradient text>"
    },
    "heroPattern": {
      "type": "<one of: dark-full-bleed, split, centered, light>",
      "hasBackgroundImage": "<boolean>",
      "headerDark": "<boolean>"
    },
    "spacingDensity": "<one of: compact, standard, spacious>"
  },
  "themeTokenRecommendations": {
    "brand": {
      "primary": "<hex>",
      "primaryHover": "<hex>",
      "secondary": "<hex>",
      "accent": "<hex>"
    },
    "surface": {
      "background": "<hex>",
      "foreground": "<hex>",
      "muted": "<hex>"
    },
    "typography": {
      "fontFamilySans": ["<font>", "system-ui", "sans-serif"],
      "fontFamilyHeading": ["<font>", "system-ui", "sans-serif"]
    }
  },
  "registryRecommendation": {
    "themeName": "<pick from constellation namespace: orion, vega, lyra, atlas, nova, etc.>",
    "confidence": "<one of: high, medium, low>",
    "reasoning": "<explanation>"
  }
}

INSTRUCTIONS:
1. For each colour token, use the hex value that appears most frequently across pages. If tied, prefer the homepage's values. Never output #000000 or #FFFFFF as brand colours.
2. Deduplicate blueprints by category + layoutPattern similarity.
3. Keep the most detailed version of each blueprint.
4. Return ONLY valid JSON. No markdown fences. No commentary.`;
