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
function sanitiseSlotName(slot: string): string {
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

  // Complex object types from name patterns
  if (/card|post|item/i.test(lower) && !lower.includes("image")) {
    return "Array<{ title?: string; description?: string; image?: string; href?: string }>";
  }
  if (/link|button|cta/i.test(lower) && !lower.includes("image")) {
    return "Array<{ label?: string; href?: string }>";
  }
  if (/image|photo/i.test(lower)) {
    return "{ src?: string; alt?: string }";
  }

  // Array types
  if (lower.includes("items") || lower.includes("list") || lower.includes("badges") || lower.includes("buttons") || lower.includes("links")) {
    return "Array<{ label: string; href?: string }>";
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

  return `/**
 * ${blueprint.componentExportName}
 *
 * ${blueprint.purpose}
 * Layout: ${blueprint.layoutPattern}
 * Category: ${blueprint.category}
 */

${propsInterface}

export function ${blueprint.componentExportName}(props: ${interfaceName}) {
${jsxBody}
}
`;
}

/**
 * Generate Client Component shell ('use client' + useState import).
 */
export function clientComponentShell(blueprint: SectionBlueprint, jsxBody: string): string {
  const propsInterface = generatePropsInterface(blueprint);
  const interfaceName = `${blueprint.componentExportName}Props`;

  return `'use client';

/**
 * ${blueprint.componentExportName}
 *
 * ${blueprint.purpose}
 * Layout: ${blueprint.layoutPattern}
 * Category: ${blueprint.category}
 */

import { useState } from 'react';

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
  const isClient = blueprint.interactionNeeds === "stateful"
    || blueprint.category === "Navigation"
    || blueprint.purpose.toLowerCase().includes("form")
    || blueprint.purpose.toLowerCase().includes("newsletter");
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

/**
 * Build the AI prompt for generating JSX body for a component.
 */
export function buildComponentGenerationPrompt(
  blueprint: SectionBlueprint,
  interfaceName: string
): string {
  const allowedColourClasses = [
    "bg-brand-primary", "bg-brand-secondary", "bg-brand-accent",
    "bg-surface-background", "bg-surface-foreground", "bg-surface-muted", "bg-surface-inverse",
    "text-brand-primary", "text-brand-secondary", "text-brand-accent",
    "text-surface-foreground", "text-surface-background", "text-surface-muted",
    "text-surface-secondary-foreground", "text-surface-muted-foreground",
    "text-on-brand-primary", "text-on-brand-secondary",
    "border-brand-primary", "border-surface-muted",
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
6. Output ONLY the function body starting with "  return (" — no imports, no interface, no function declaration.
7. Keep it clean, semantic, and accessible.`;
}
