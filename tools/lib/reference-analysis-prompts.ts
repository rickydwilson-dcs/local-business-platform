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
      "primary": "<hex — sample the actual dominant brand colour pixel>",
      "secondary": "<hex — sample secondary brand colour>",
      "accent": "<hex — sample accent/highlight colour>",
      "additional": ["<hex>", ...],
      "confidence": "high" | "medium" | "low"
    },
    "typography": {
      "headingWeight": "bold" | "extrabold" | "black",
      "bodyWeight": "normal" | "medium",
      "headingStyle": "sans" | "serif" | "display",
      "usesInlineColourHighlights": true | false
    },
    "heroPattern": {
      "type": "dark-full-bleed" | "split" | "centered" | "light",
      "hasBackgroundImage": true | false,
      "headerDark": true | false
    },
    "spacingDensity": "compact" | "standard" | "spacious"
  },
  "detectedSections": [
    {
      "name": "<descriptive name>",
      "background": "<hex or description>",
      "layoutType": "full-bleed-band" | "contained" | "split" | "grid" | "strip",
      "purpose": "cta" | "info" | "blog" | "about" | "testimonial" | "nav" | "footer" | "sponsor" | "newsletter" | "hero" | "custom",
      "notes": "<brief description of what this section contains>"
    }
  ],
  "sectionBlueprints": [
    {
      "id": "<unique slug, e.g. hero-full-bleed>",
      "name": "<PascalCase component name, e.g. HeroFullBleed>",
      "category": "Hero" | "Navigation" | "Cards" | "CTA" | "Content" | "Social Proof" | "Blog" | "Stats" | "Footer" | "Custom",
      "purpose": "<what this section does>",
      "layoutPattern": "<structural description: full-bleed with overlay / 2-col grid / etc.>",
      "contentSlots": ["<named content area>", ...],
      "interactionNeeds": "none" | "minimal" | "stateful",
      "componentFileName": "<kebab-case.tsx>",
      "componentExportName": "<PascalCase>",
      "tokenUsageHints": ["bg-brand-primary", "text-surface-foreground", ...],
      "confidence": "high" | "medium" | "low",
      "referenceSection": "<which detectedSection name this maps to>"
    }
  ],
  "registryRecommendation": {
    "themeName": "<suggested theme slug>",
    "confidence": "high" | "medium" | "low",
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
