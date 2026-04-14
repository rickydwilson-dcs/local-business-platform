/**
 * Theme Component Templates
 *
 * Deterministic template fragments for generating per-theme components.
 * These wrap AI-generated JSX body with correct file structure.
 */

import type { SectionBlueprint } from "./reference-analysis-types";

/**
 * Sanitise a slot name to a valid camelCase identifier.
 * - Strip hyphens and convert to camelCase
 * - Prefix leading digits with underscore
 * - Remove any remaining non-identifier characters
 */
export function sanitiseSlotName(slot: string): string {
  // Convert hyphens/spaces to camelCase
  let name = slot
    .replace(/[-\s]+([a-zA-Z])/g, (_, c: string) => c.toUpperCase())
    .replace(/[-\s]+/g, "");

  // Remove non-identifier characters
  name = name.replace(/[^a-zA-Z0-9_$]/g, "");

  // Prefix leading digits
  if (/^\d/.test(name)) {
    name = `_${name}`;
  }

  // Ensure non-empty
  if (!name) {
    name = "content";
  }

  return name;
}

/**
 * Generate a TypeScript props interface from contentSlots.
 */
export function generatePropsInterface(blueprint: SectionBlueprint): string {
  const interfaceName = `${blueprint.componentExportName}Props`;
  const lines: string[] = [];
  const seenNames = new Set<string>();

  lines.push(`export interface ${interfaceName} {`);
  for (const slot of blueprint.contentSlots) {
    const propName = sanitiseSlotName(slot);
    // Skip duplicates
    if (seenNames.has(propName)) continue;
    seenNames.add(propName);

    const propType = inferPropType(slot);
    lines.push(`  /** ${slot} */`);
    lines.push(`  ${propName}?: ${propType};`);
  }
  lines.push("}");

  return lines.join("\n");
}

function inferPropType(slotName: string): string {
  const lower = slotName.toLowerCase();

  // Explicit plural array types — AI must .map() over these
  if (
    lower.endsWith("cards") ||
    lower.endsWith("posts") ||
    lower.endsWith("items") ||
    lower.endsWith("badges") ||
    lower.endsWith("buttons") ||
    lower.endsWith("links") ||
    lower.endsWith("columns") ||
    lower.endsWith("photos") ||
    lower.endsWith("testimonials") ||
    lower.endsWith("features") ||
    lower.endsWith("services") ||
    lower.endsWith("steps") ||
    lower.endsWith("members") ||
    lower.includes("list")
  ) {
    return "Array<{ title?: string; description?: string; image?: string; href?: string; label?: string; [key: string]: string | undefined }>";
  }

  // Singular CTA/button/link → scalar object (AI accesses these as scalars)
  if (/button$|^cta|link$/i.test(lower) && !lower.includes("image")) {
    return "{ label?: string; href?: string }";
  }

  // Singular card/post/item → scalar
  if (/card$|post$|item$/i.test(lower) && !lower.includes("image")) {
    return "{ title?: string; description?: string; image?: string; href?: string }";
  }

  if (/image|photo/i.test(lower)) {
    return "{ src?: string; alt?: string }";
  }

  // Primitive types
  if (lower.includes("src") || lower.includes("url") || lower.includes("href")) {
    return "string";
  }
  if (lower.includes("show") || lower.includes("visible") || lower.includes("enabled")) {
    return "boolean";
  }
  if (lower.includes("count") || lower.includes("rating") || lower.includes("number")) {
    return "number";
  }
  return "string";
}

/**
 * Generate Server Component shell (no directive).
 */
export function serverComponentShell(blueprint: SectionBlueprint, jsxBody: string): string {
  const propsInterface = generatePropsInterface(blueprint);
  const interfaceName = `${blueprint.componentExportName}Props`;
  const animationPrimitives = detectAnimationImports(jsxBody);
  const animationImport = buildAnimationImportLine(animationPrimitives);

  return `/**
 * ${blueprint.componentExportName}
 *
 * ${blueprint.purpose}
 * Layout: ${blueprint.layoutPattern}
 * Category: ${blueprint.category}
 */
${animationImport ? "\n" + animationImport + "\n" : ""}
${propsInterface}

export function ${blueprint.componentExportName}(props: ${interfaceName}) {
${jsxBody}
}
`;
}

/**
 * Detect which React hooks are used in a JSX body.
 * Always includes useState. Returns a deduplicated, sorted array.
 */
export function detectReactImports(jsxBody: string): string[] {
  const hooks = new Set<string>(["useState"]);
  const candidates = ["useEffect", "useRef", "useCallback", "useMemo"];
  for (const hook of candidates) {
    if (new RegExp(`\\b${hook}\\b`).test(jsxBody)) {
      hooks.add(hook);
    }
  }
  return [...hooks].sort();
}

/**
 * Animation primitives that may appear in AI-generated JSX.
 */
const ANIMATION_PRIMITIVES = [
  "RevealOnScroll",
  "Carousel",
  "ParallaxSection",
  "useScrollParallax",
] as const;

/**
 * Detect which animation primitives are used in a JSX body.
 * Returns a deduplicated array of names found.
 */
export function detectAnimationImports(jsxBody: string): string[] {
  const found: string[] = [];
  for (const name of ANIMATION_PRIMITIVES) {
    if (new RegExp(`\\b${name}\\b`).test(jsxBody)) {
      found.push(name);
    }
  }
  return found;
}

/**
 * Build the animation import line for detected primitives.
 * Returns empty string if no animation primitives are used.
 */
function buildAnimationImportLine(primitives: string[]): string {
  if (primitives.length === 0) return "";
  return `import { ${primitives.join(", ")} } from "@platform/core-components/components/animation";`;
}

/**
 * Generate Client Component shell ("use client" + dynamic React imports).
 */
export function clientComponentShell(blueprint: SectionBlueprint, jsxBody: string): string {
  const propsInterface = generatePropsInterface(blueprint);
  const interfaceName = `${blueprint.componentExportName}Props`;
  const reactImports = detectReactImports(jsxBody).join(", ");
  const animationPrimitives = detectAnimationImports(jsxBody);
  const animationImport = buildAnimationImportLine(animationPrimitives);

  return `"use client";

/**
 * ${blueprint.componentExportName}
 *
 * ${blueprint.purpose}
 * Layout: ${blueprint.layoutPattern}
 * Category: ${blueprint.category}
 */

import { ${reactImports} } from "react";
${animationImport ? animationImport + "\n" : ""}
${propsInterface}

export function ${blueprint.componentExportName}(props: ${interfaceName}) {
${jsxBody}
}
`;
}

/**
 * Generate a placeholder component when AI generation is not available.
 */
export function placeholderComponent(blueprint: SectionBlueprint): string {
  const isClient =
    blueprint.interactionNeeds === "stateful" ||
    blueprint.category === "Navigation" ||
    blueprint.purpose.toLowerCase().includes("form") ||
    blueprint.purpose.toLowerCase().includes("newsletter");
  const interfaceName = `${blueprint.componentExportName}Props`;

  const jsxBody = `  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">${blueprint.category}</p>
        <h2 className="text-h2 text-surface-foreground mb-4">${blueprint.name}</h2>
        <p className="text-body text-surface-secondary-foreground">${blueprint.purpose}</p>
      </div>
    </section>
  );`;

  if (isClient) {
    return clientComponentShell(blueprint, jsxBody);
  }
  return serverComponentShell(blueprint, jsxBody);
}

// ── Internal helper ───────────────────────────────────────────────────────────

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + "\n/* ... truncated ... */";
}

/**
 * Build a prompt for translating a clone HTML section to native Tailwind JSX.
 * This prompt gives the AI both the HTML structure and CSS rules as reference,
 * plus token mappings and the gold-standard output format.
 */
export function buildCloneTranslationPrompt(
  blueprint: SectionBlueprint,
  interfaceName: string,
  tokenMappings?: string
): string {
  const slotsDescription = (blueprint.contentSlots ?? []).map((slot) => `- ${slot}`).join("\n");

  const htmlContext = blueprint.cloneHtmlFragment
    ? `\n## REFERENCE HTML (structure and layout reference — do NOT copy class names)\n\n\`\`\`html\n${truncate(blueprint.cloneHtmlFragment, 6000)}\n\`\`\``
    : "";

  const cssContext = blueprint.cloneRelevantCss
    ? `\n## REFERENCE CSS (spacing, layout, sizing reference — do NOT copy rules)\n\nRead these rules to understand spacing (padding, margin, gap), layout (flex, grid, max-width), font sizes, and responsive breakpoints. Then recreate the same visual result using Tailwind utility classes.\n\n\`\`\`css\n${truncate(blueprint.cloneRelevantCss, 4000)}\n\`\`\``
    : "";

  const tokenSection = tokenMappings
    ? `\n## TOKEN MAPPINGS\n\nUse these theme tokens instead of hardcoded colours:\n\n${tokenMappings}`
    : "";

  return `You are converting a cloned website section into a React Server Component using native Tailwind CSS for a Next.js platform.

## TASK

Reproduce the visual layout and design of the reference section below using ONLY Tailwind CSS utility classes and the platform's theme token classes. The result must look like the reference but be built entirely with Tailwind — no copied CSS class names.

## COMPONENT SPEC

- Component name: ${blueprint.componentExportName ?? blueprint.name}
- Props interface: ${interfaceName}
- Category: ${blueprint.category}
- Layout pattern: ${blueprint.layoutPattern ?? "standard"}
- Purpose: ${blueprint.purpose ?? "content section"}

Content slots (these become component props):
${slotsDescription || "- (derive from the HTML structure)"}
${htmlContext}
${cssContext}
${tokenSection}

## TRANSLATION RULES

1. **Layout**: Reproduce the layout using Tailwind utilities (flex, grid, max-w-*, gap-*, etc.). Read the CSS for exact spacing values and convert: 16px→py-4, 24px→py-6, 32px→py-8, 48px→py-12, 64px→py-16, 96px→py-24.
2. **Colours**: NEVER hardcode hex values. Use theme tokens: bg-brand-primary, bg-brand-secondary, bg-surface-inverse, bg-surface-muted, bg-surface-card, text-surface-foreground, text-brand-primary, text-on-brand-primary, text-on-inverse-muted, border-surface-border.
3. **Typography**: Use Tailwind text sizing (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl). Use font-bold, font-semibold, font-medium, tracking-tight, leading-tight, leading-relaxed.
4. **Responsive**: Mobile-first with md: and lg: breakpoints. Read the CSS @media queries for responsive behaviour.
5. **Semantic HTML**: Use section, div, h1-h6, p, a, img, ul, li. Keep heading hierarchy logical.
6. **Props**: Access props via dot notation (props.heading, props.items). For arrays, use .map() with proper keys.
7. **Array content**: When the HTML has repeating items (cards, posts, list items), model them as a SINGLE array prop: \`items?: Array<{ title?: string; description?: string; image?: string; href?: string; [key: string]: string | undefined }>\`. Never call \`.map()\` on a string prop — if it needs mapping, it must be typed as an array.
8. **Images**: Use standard <img> tags with props for src/alt. Decorative images can use hardcoded /images/ paths.
9. **No imports**: Do NOT import React, next/link, lucide-react, or any external modules. The shell wrapper handles imports.
10. **Component classes**: You may use these component utility classes (defined in globals.css): btn-primary, btn-secondary, card, card-interactive, section, container-standard, container-narrow.

## OUTPUT FORMAT

Return ONLY the JSX body — the content of the return statement. Start with a \`<section\` or \`<div\` element. Do NOT include the function signature, imports, or interface.

Example output format:
\`\`\`
<section className="py-16 bg-surface-inverse">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-on-brand-primary">{props.heading}</h2>
    ...
  </div>
</section>
\`\`\``;
}

/**
 * Build the AI prompt for generating JSX body for a component.
 */
export function buildComponentGenerationPrompt(
  blueprint: SectionBlueprint,
  interfaceName: string
): string {
  const allowedColourClasses = [
    "bg-brand-primary",
    "bg-brand-secondary",
    "bg-brand-accent",
    "bg-surface-background",
    "bg-surface-foreground",
    "bg-surface-muted",
    "bg-surface-inverse",
    "text-brand-primary",
    "text-brand-secondary",
    "text-brand-accent",
    "text-surface-foreground",
    "text-surface-background",
    "text-surface-muted",
    "text-surface-secondary-foreground",
    "text-surface-muted-foreground",
    "text-on-brand-primary",
    "text-on-brand-secondary",
    "border-brand-primary",
    "border-surface-muted",
  ].join(", ");

  return `Return ONLY JSX body starting with \`  return (\`. No interfaces, no imports, no function declaration.

Component: ${blueprint.componentExportName}
Purpose: ${blueprint.purpose}
Layout pattern: ${blueprint.layoutPattern}
Category: ${blueprint.category}

Props interface is already defined as:
  ${interfaceName} with optional props: ${blueprint.contentSlots.join(", ")}

ALLOWED colour classes (use ONLY these for colours):
${allowedColourClasses}

Suggested token hints: ${blueprint.tokenUsageHints.join(", ")}

RULES:
1. NEVER invent colour names like bg-brand-dark-purple, text-accent-light, etc.
2. NEVER use hex color values — only the allowed colour classes above.
3. Standard Tailwind layout/spacing classes are fine (py-16, px-4, max-w-7xl, grid, flex, etc.)
4. Use responsive breakpoints: mobile-first with md: and lg: prefixes.
5. The component receives "props" as the parameter name.
6. Access props using ONLY dot notation with camelCase names matching the interface:
   CORRECT: props.backgroundImage, props.ctaButtons, props.heading
   WRONG: props['background-image'], props['cta-buttons'], props['heading']
   The interface defines camelCase prop names — use dot notation to access them.
   REQUIRED: props.camelCase (e.g., props.postThumbnail, props.heroTitle)
   FORBIDDEN: props['post-thumbnail'], props["hero-title"], props['cta_button']
   The TypeScript interface uses camelCase. Your JSX must use the exact same names with dot notation.
7. **Array props**: When multiple content slots share a common prefix (e.g. post-thumbnail, post-title, post-date) or represent per-item data, model them as a SINGLE array prop in the interface. Never call \`.map()\` on a string prop.
8. Output ONLY the function body starting with "  return (" — no imports, no interface, no function declaration.
9. Keep it clean, semantic, and accessible.

ANIMATION PRIMITIVES (use these when the layout pattern suggests animation):
- Scroll-triggered reveals: wrap section content in <RevealOnScroll variant="fade-up">
  Import: import { RevealOnScroll } from '@platform/core-components/components/animation';
- Image carousels/sliders: use <Carousel autoPlay showDots loop>
  Import: import { Carousel } from '@platform/core-components/components/animation';
- Parallax backgrounds: use <ParallaxSection backgroundImage={props.backgroundImage} speed={0.3}>
  Import: import { ParallaxSection } from '@platform/core-components/components/animation';
- CSS animation classes: animate-fade-in-up, animate-slide-in-left, animate-slide-in-right, animate-scale-up

ANIMATION RULES:
10. Do NOT animate every section. Use RevealOnScroll on 2-3 content sections max.
11. Carousels are for hero images, testimonials, and blog post grids ONLY when the layout says "slider" or "carousel".
12. ParallaxSection is for hero backgrounds or full-bleed image sections only.
13. Always respect prefers-reduced-motion (the primitives handle this internally).`;
}
