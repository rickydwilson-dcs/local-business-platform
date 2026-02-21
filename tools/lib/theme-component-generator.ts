/**
 * Theme Component Generator
 *
 * Generates per-theme component files from section blueprints.
 * Uses a hybrid approach: deterministic file structure wraps AI-generated JSX.
 * Falls back to placeholder components when AI is unavailable.
 */

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import Anthropic from "@anthropic-ai/sdk";
import type { SectionBlueprint, ComponentMatch } from "./reference-analysis-types";
import {
  serverComponentShell,
  clientComponentShell,
  placeholderComponent,
  buildComponentGenerationPrompt,
  generatePropsInterface,
} from "./theme-component-templates";
import { isAllowedClass, looksLikeColorClass } from "./token-class-allowlist";

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

function scanForHexLiterals(tsx: string): string[] {
  const hexRegex = /#[0-9A-Fa-f]{3,8}/g;
  const matches = tsx.match(hexRegex);
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
// TypeScript syntax validation
// ============================================================================

function validateTypeScriptSyntax(content: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors: string[] = [];
  const diagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics;
  if (diagnostics) {
    for (const d of diagnostics) {
      errors.push(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
    }
  }
  return errors;
}

// ============================================================================
// Token class validation
// ============================================================================

/** Common non-standard patterns and their replacements. */
const CLASS_REPLACEMENTS: Record<string, string> = {
  "bg-brand-dark": "bg-brand-primary",
  "bg-brand-light": "bg-surface-muted",
  "text-brand-dark": "text-brand-primary",
  "text-brand-light": "text-brand-secondary",
  "bg-accent": "bg-brand-accent",
  "text-accent": "text-brand-accent",
  "border-accent": "border-brand-accent",
  "bg-primary": "bg-brand-primary",
  "text-primary": "text-brand-primary",
  "bg-secondary": "bg-brand-secondary",
  "text-secondary": "text-brand-secondary",
  "bg-muted": "bg-surface-muted",
  "text-muted": "text-surface-muted-foreground",
};

function validateAndFixTokenClasses(content: string): { content: string; violations: string[] } {
  const violations: string[] = [];
  let fixed = content;

  // Extract all className values
  const classNameRegex = /className="([^"]*)"/g;
  let match: RegExpExecArray | null;
  classNameRegex.lastIndex = 0;

  while ((match = classNameRegex.exec(fixed)) !== null) {
    const classes = match[1].split(/\s+/);
    for (const cls of classes) {
      if (!cls) continue;
      if (!isAllowedClass(cls)) {
        violations.push(cls);
        // Try auto-replacement
        const stripped = cls.replace(/^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:)+/, "");
        const prefix = cls.slice(0, cls.length - stripped.length);
        if (CLASS_REPLACEMENTS[stripped]) {
          fixed = fixed.replace(
            new RegExp(`\\b${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"),
            `${prefix}${CLASS_REPLACEMENTS[stripped]}`
          );
        }
      }
    }
    // Reset lastIndex to avoid state leak
    classNameRegex.lastIndex = match.index + match[0].length;
  }

  return { content: fixed, violations };
}

// ============================================================================
// "use client" directive detection
// ============================================================================

const CLIENT_PATTERNS = /\b(useState|useEffect|useRef|useCallback|useMemo|onClick|onChange|onSubmit|onKeyDown|onMouseEnter|onFocus|onBlur)\b|<form\b/;

/**
 * Determine if a component needs "use client" directive.
 * Returns true when ANY of:
 * - interactionNeeds === "stateful"
 * - Category is "Navigation" (mobile menu toggle)
 * - Category is "Forms" or "Newsletter"
 * - JSX body contains interactive hooks/handlers
 */
function needsUseClient(blueprint: SectionBlueprint, jsxBody: string): boolean {
  if (blueprint.interactionNeeds === "stateful") return true;
  if (blueprint.category === "Navigation") return true;
  const purpose = blueprint.purpose.toLowerCase();
  if (purpose.includes("form") || purpose.includes("newsletter")) return true;
  if (CLIENT_PATTERNS.test(jsxBody)) return true;
  return false;
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
    let jsxBody = await generateJSXBody(client, blueprint);

    if (jsxBody) {
      const needsClient = needsUseClient(blueprint, jsxBody);
      content = needsClient
        ? clientComponentShell(blueprint, jsxBody)
        : serverComponentShell(blueprint, jsxBody);
      usedAI = true;

      // Post-generation: TypeScript syntax check
      const syntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
      if (syntaxErrors.length > 0) {
        warnings.push(`${blueprint.name}: TS syntax errors: ${syntaxErrors.join("; ")}`);
        // Retry once
        jsxBody = await generateJSXBody(client, blueprint);
        if (jsxBody) {
          content = needsClient
            ? clientComponentShell(blueprint, jsxBody)
            : serverComponentShell(blueprint, jsxBody);
          const retryErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
          if (retryErrors.length > 0) {
            warnings.push(`${blueprint.name}: Retry also failed — using placeholder`);
            content = placeholderComponent(blueprint);
            usedAI = false;
          }
        } else {
          content = placeholderComponent(blueprint);
          usedAI = false;
        }
      }

      // Post-generation: Token class validation with auto-replace
      if (usedAI) {
        const { content: fixedContent, violations } = validateAndFixTokenClasses(content);
        if (violations.length > 0) {
          warnings.push(`${blueprint.name}: Non-standard colour classes auto-fixed: ${violations.join(", ")}`);
          content = fixedContent;
          // Re-check syntax after auto-fix
          const fixSyntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
          if (fixSyntaxErrors.length > 0) {
            content = placeholderComponent(blueprint);
            usedAI = false;
          }
        }
      }
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
 * When componentMatches is provided (v3 pipeline), blueprints with an "exact"
 * or "close" match are skipped — they reuse existing core-components.
 * Only unmatched or "partial" match blueprints get generated.
 *
 * @param blueprints - Section blueprints from the analysis
 * @param outputDir - Directory to write component files to
 * @param componentMatches - Optional map of blueprint ID to ComponentMatch (v3 pipeline)
 * @returns Generation result with component metadata and warnings
 */
export async function generateThemeComponents(
  blueprints: SectionBlueprint[],
  outputDir: string,
  componentMatches?: Map<string, ComponentMatch | null>,
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

  // Filter blueprints: skip those with "exact" or "close" matches
  const blueprintsToGenerate = componentMatches
    ? blueprints.filter((bp) => {
        const match = componentMatches.get(bp.id);
        if (match && (match.matchConfidence === "exact" || match.matchConfidence === "close")) {
          console.log(`    ✓ ${bp.componentExportName} → reusing ${match.componentName} (${match.matchConfidence})`);
          return false;
        }
        return true;
      })
    : blueprints;

  console.log(`  Generating ${blueprintsToGenerate.length} components (${blueprints.length - blueprintsToGenerate.length} reused from core)...`);

  for (const blueprint of blueprintsToGenerate) {
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
  const customClasses = new Set<string>();

  for (const comp of components) {
    const classNameRegex = /className="([^"]*)"/g;
    classNameRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = classNameRegex.exec(comp.content)) !== null) {
      const classes = match[1].split(/\s+/);
      for (const cls of classes) {
        if (!cls) continue;
        if (!isAllowedClass(cls)) {
          customClasses.add(cls);
        }
      }
    }
  }

  return [...customClasses];
}
