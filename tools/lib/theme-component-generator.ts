/**
 * Theme Component Generator
 *
 * Generates per-theme component files from section blueprints.
 * Uses a hybrid approach: deterministic file structure wraps AI-generated JSX.
 * Falls back to placeholder components when AI is unavailable.
 */

import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import type { SectionBlueprint } from "./reference-analysis-types";
import {
  serverComponentShell,
  clientComponentShell,
  placeholderComponent,
  buildComponentGenerationPrompt,
  generatePropsInterface,
} from "./theme-component-templates";

// ============================================================================
// Types
// ============================================================================

export interface GeneratedComponent {
  blueprint: SectionBlueprint;
  filePath: string;
  content: string;
  usedAI: boolean;
}

export interface GenerationResult {
  components: GeneratedComponent[];
  warnings: string[];
}

// ============================================================================
// Hex literal scanner
// ============================================================================

const HEX_LITERAL_REGEX = /#[0-9A-Fa-f]{3,8}/g;

function scanForHexLiterals(tsx: string): string[] {
  const matches = tsx.match(HEX_LITERAL_REGEX);
  return matches ?? [];
}

// ============================================================================
// Named export verification
// ============================================================================

function verifyNamedExport(content: string, expectedName: string): boolean {
  const exportRegex = new RegExp(`export\\s+function\\s+${expectedName}\\b`);
  return exportRegex.test(content);
}

// ============================================================================
// AI-powered JSX generation
// ============================================================================

async function generateJSXBody(
  client: Anthropic,
  blueprint: SectionBlueprint
): Promise<string | null> {
  const interfaceName = `${blueprint.componentExportName}Props`;
  const prompt = buildComponentGenerationPrompt(blueprint, interfaceName);

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;

    // Extract just the return body
    let body = text.text.trim();

    // Strip markdown fences if present
    body = body.replace(/^```(?:tsx?|jsx?)?\n?/m, "").replace(/\n?```$/m, "");

    // Ensure it starts with "  return ("
    if (!body.trimStart().startsWith("return")) {
      return null;
    }

    // Indent properly if needed
    if (!body.startsWith("  ")) {
      body = body.split("\n").map(line => `  ${line}`).join("\n");
    }

    return body;
  } catch (err) {
    console.warn(`    [Warning] AI generation failed for ${blueprint.name}: ${err}`);
    return null;
  }
}

// ============================================================================
// Single component generation
// ============================================================================

async function generateSingleComponent(
  client: Anthropic | null,
  blueprint: SectionBlueprint,
  outputDir: string
): Promise<{ component: GeneratedComponent; warnings: string[] }> {
  const warnings: string[] = [];
  const filePath = path.join(outputDir, blueprint.componentFileName);
  let content: string;
  let usedAI = false;

  if (client) {
    const jsxBody = await generateJSXBody(client, blueprint);

    if (jsxBody) {
      const isClient = blueprint.interactionNeeds === "stateful";
      content = isClient
        ? clientComponentShell(blueprint, jsxBody)
        : serverComponentShell(blueprint, jsxBody);
      usedAI = true;
    } else {
      content = placeholderComponent(blueprint);
      warnings.push(`${blueprint.name}: AI generation failed, using placeholder`);
    }
  } else {
    content = placeholderComponent(blueprint);
    warnings.push(`${blueprint.name}: No API key, using placeholder`);
  }

  // Post-generation validation: hex literal scan
  const hexLiterals = scanForHexLiterals(content);
  if (hexLiterals.length > 0) {
    warnings.push(`${blueprint.name}: Contains hex literals: ${hexLiterals.join(", ")} — replacing with placeholder`);
    content = placeholderComponent(blueprint);
    usedAI = false;
  }

  // Post-generation validation: named export verification
  if (!verifyNamedExport(content, blueprint.componentExportName)) {
    warnings.push(`${blueprint.name}: Export name mismatch — replacing with placeholder`);
    content = placeholderComponent(blueprint);
    usedAI = false;
  }

  return {
    component: { blueprint, filePath, content, usedAI },
    warnings,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Generate component files for all section blueprints.
 *
 * @param blueprints - Section blueprints from the analysis
 * @param outputDir - Directory to write component files to
 * @returns Generation result with component metadata and warnings
 */
export async function generateThemeComponents(
  blueprints: SectionBlueprint[],
  outputDir: string
): Promise<GenerationResult> {
  const allComponents: GeneratedComponent[] = [];
  const allWarnings: string[] = [];

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Set up AI client if available
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let client: Anthropic | null = null;
  if (apiKey) {
    client = new Anthropic({ apiKey });
  } else {
    console.warn("  [Warning] ANTHROPIC_API_KEY not set — generating placeholder components.");
  }

  console.log(`  Generating ${blueprints.length} components...`);

  for (const blueprint of blueprints) {
    console.log(`    ${blueprint.componentExportName} (${blueprint.category})...`);
    const { component, warnings } = await generateSingleComponent(client, blueprint, outputDir);

    // Write file
    fs.writeFileSync(component.filePath, component.content, "utf8");
    console.log(`    ✓ ${path.basename(component.filePath)}${component.usedAI ? " (AI)" : " (placeholder)"}`);

    allComponents.push(component);
    allWarnings.push(...warnings);
  }

  // Globals.css validation: scan for non-standard Tailwind classes
  const customClasses = scanForCustomClasses(allComponents);
  if (customClasses.length > 0) {
    allWarnings.push(
      `Custom Tailwind classes used in components (verify in globals.css): ${customClasses.join(", ")}`
    );
  }

  return { components: allComponents, warnings: allWarnings };
}

/**
 * Scan generated components for non-standard Tailwind classes.
 * Returns class names that aren't standard Tailwind or known theme tokens.
 */
function scanForCustomClasses(components: GeneratedComponent[]): string[] {
  // Known theme token prefixes
  const themeTokenPrefixes = [
    "bg-brand-", "text-brand-", "border-brand-",
    "bg-surface-", "text-surface-", "border-surface-",
    "text-h1", "text-h2", "text-h3", "text-h4", "text-hero",
    "text-body", "text-small", "text-caption",
    "text-on-brand-", "bg-success", "bg-warning", "bg-error", "bg-info",
    "btn-primary", "btn-secondary", "btn-ghost",
    "heading-section", "text-subtitle",
  ];

  // className extraction regex
  const classNameRegex = /className="([^"]*)"/g;
  const customClasses = new Set<string>();

  for (const comp of components) {
    let match: RegExpExecArray | null;
    while ((match = classNameRegex.exec(comp.content)) !== null) {
      const classes = match[1].split(/\s+/);
      for (const cls of classes) {
        // Skip empty, standard Tailwind patterns, and theme tokens
        if (!cls) continue;
        if (isStandardTailwind(cls)) continue;
        if (themeTokenPrefixes.some((prefix) => cls.startsWith(prefix))) continue;
        customClasses.add(cls);
      }
    }
  }

  return [...customClasses];
}

/**
 * Simple heuristic to detect standard Tailwind utility classes.
 */
function isStandardTailwind(cls: string): boolean {
  // Strip responsive/state prefixes
  const stripped = cls.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|group-hover:|dark:)+/, "");

  // Common Tailwind prefixes
  const standardPrefixes = [
    "p-", "px-", "py-", "pt-", "pb-", "pl-", "pr-",
    "m-", "mx-", "my-", "mt-", "mb-", "ml-", "mr-",
    "w-", "h-", "min-w-", "min-h-", "max-w-", "max-h-",
    "flex", "grid", "block", "inline", "hidden",
    "items-", "justify-", "gap-", "space-",
    "text-", "font-", "leading-", "tracking-",
    "bg-", "border", "rounded", "shadow",
    "absolute", "relative", "fixed", "sticky",
    "top-", "bottom-", "left-", "right-",
    "z-", "overflow-", "opacity-",
    "transition", "duration-", "ease-",
    "col-", "row-", "grid-cols-", "grid-rows-",
    "aspect-", "object-", "cursor-",
    "divide-", "ring-", "outline-",
    "sr-only", "not-sr-only",
    "container", "mx-auto",
    "line-clamp-", "truncate",
    "transform", "scale-", "rotate-", "translate-",
    "animate-", "whitespace-", "break-",
  ];

  return standardPrefixes.some((prefix) => stripped.startsWith(prefix)) || stripped === "flex" || stripped === "grid" || stripped === "hidden" || stripped === "container";
}
