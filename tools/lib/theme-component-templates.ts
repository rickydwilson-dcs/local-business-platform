/**
 * Theme Component Templates
 *
 * Deterministic template fragments for generating per-theme components.
 * These wrap AI-generated JSX body with correct file structure.
 */

import type { SectionBlueprint } from "./reference-analysis-types";

/**
 * Generate a TypeScript props interface from contentSlots.
 */
export function generatePropsInterface(blueprint: SectionBlueprint): string {
  const interfaceName = `${blueprint.componentExportName}Props`;
  const lines: string[] = [];

  lines.push(`export interface ${interfaceName} {`);
  for (const slot of blueprint.contentSlots) {
    // Convert slot name to camelCase property
    const propName = slot.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    // Determine type based on common patterns
    const propType = inferPropType(slot);
    lines.push(`  /** ${slot} */`);
    lines.push(`  ${propName}?: ${propType};`);
  }
  lines.push("}");

  return lines.join("\n");
}

function inferPropType(slotName: string): string {
  const lower = slotName.toLowerCase();
  if (lower.includes("image") || lower.includes("src") || lower.includes("url") || lower.includes("href")) {
    return "string";
  }
  if (lower.includes("items") || lower.includes("list") || lower.includes("badges") || lower.includes("buttons") || lower.includes("links")) {
    return "Array<{ label: string; href?: string }>";
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
  const isClient = blueprint.interactionNeeds === "stateful";
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
  return `Generate ONLY the JSX return body (starting with "  return (") for a React component.

Component: ${blueprint.componentExportName}
Purpose: ${blueprint.purpose}
Layout pattern: ${blueprint.layoutPattern}
Category: ${blueprint.category}

Props interface is already defined as:
  ${interfaceName} with optional props: ${blueprint.contentSlots.join(", ")}

RULES:
1. Use ONLY these Tailwind theme token classes: ${blueprint.tokenUsageHints.join(", ")}
2. Additional standard Tailwind classes are fine (py-16, px-4, max-w-7xl, grid, flex, etc.)
3. NEVER use hex color values — only theme token classes (bg-brand-primary, text-surface-foreground, etc.)
4. Use responsive breakpoints: mobile-first with md: and lg: prefixes
5. The component receives "props" as the parameter name
6. Output ONLY the function body starting with "  return (" — no imports, no interface, no function declaration
7. Keep it clean, semantic, and accessible`;
}
