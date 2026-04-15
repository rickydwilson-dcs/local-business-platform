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
  buildCloneTranslationPrompt,
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

/** Maps Tailwind color utility prefixes to nearest named theme token class. */
const ARBITRARY_COLOR_TOKEN_MAP: Record<string, string> = {
  bg: "bg-brand-primary",
  text: "text-surface-foreground",
  border: "border-brand-primary",
  ring: "ring-brand-primary",
  fill: "fill-none",
  stroke: "stroke-1",
  from: "from-brand-primary",
  via: "via-brand-primary",
  to: "to-brand-primary",
  outline: "outline-none",
  shadow: "shadow",
  accent: "accent-brand-primary",
  caret: "caret-brand-primary",
  decoration: "decoration-brand-primary",
};

/**
 * Attempt to replace hex color literals with CSS variable refs or theme token classes.
 * Handles: inline style objects, SVG JSX attributes, and Tailwind arbitrary-value classes.
 * Returns the fixed content and the count of replacements made.
 */
export function autoRepairHexLiterals(tsx: string): { content: string; replacements: number } {
  let replacements = 0;

  const fixed = tsx
    // Inline style: camelCase backgroundColor / color / borderColor
    .replace(/backgroundColor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'backgroundColor: "var(--color-brand-primary)"';
    })
    .replace(/\bcolor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'color: "var(--color-surface-foreground)"';
    })
    .replace(/borderColor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'borderColor: "var(--color-surface-border)"';
    })
    // Inline style: background (longhand)
    .replace(/\bbackground:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'background: "var(--color-brand-primary)"';
    })
    // Inline style: fill / stroke (SVG in style object)
    .replace(/\bfill:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'fill: "currentColor"';
    })
    .replace(/\bstroke:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'stroke: "currentColor"';
    })
    // SVG JSX attributes: fill="#xxx" stroke="#xxx"
    .replace(/\bfill="#[0-9A-Fa-f]{3,8}"/g, () => {
      replacements++;
      return 'fill="currentColor"';
    })
    .replace(/\bstroke="#[0-9A-Fa-f]{3,8}"/g, () => {
      replacements++;
      return 'stroke="currentColor"';
    })
    // Tailwind arbitrary-value color classes: bg-[#xxx], text-[#xxx], etc.
    .replace(
      /\b(bg|text|border|ring|fill|stroke|from|via|to|outline|shadow|accent|caret|decoration)-\[#[0-9A-Fa-f]{3,8}\]/g,
      (_match, prefix: string) => {
        replacements++;
        return ARBITRARY_COLOR_TOKEN_MAP[prefix] ?? `${prefix}-brand-primary`;
      }
    );

  return { content: fixed, replacements };
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
    ts.ScriptKind.TSX
  );
  const errors: string[] = [];
  const diagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] })
    .parseDiagnostics;
  if (diagnostics) {
    for (const d of diagnostics) {
      errors.push(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
    }
  }
  return errors;
}

// ============================================================================
// Semantic type-checking constants
// ============================================================================

/** Error codes to suppress from semantic diagnostics (import-resolution and JSX noise). */
const SEMANTIC_SKIP_CODES = new Set<number>([
  2307, // Cannot find module 'x'
  2304, // Cannot find name (cascades from unresolved imports)
  7016, // Could not find declaration file for module
  2792, // Cannot find module or its type declarations
  7026, // JSX element implicitly 'any' (without @types/react)
  17004, // Cannot use JSX unless '--jsx' flag is provided
]);

/** Compiler options for semantic validation. noEmit + skipLibCheck for speed. */
const SEMANTIC_COMPILER_OPTIONS: ts.CompilerOptions = {
  jsx: ts.JsxEmit.React,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  typeRoots: [path.resolve(process.cwd(), "packages/core-components/node_modules/@types")],
  types: ["react"],
};

/**
 * Run a full TypeScript semantic type check on generated component content.
 * Catches errors that the parse-only check misses: .map() on string props,
 * objects rendered as ReactNode, required prop mismatches, etc.
 * Returns an array of error strings, filtered to suppress import-resolution noise.
 */
function validateTypeScriptSemantic(content: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TSX
  );

  const defaultHost = ts.createCompilerHost(SEMANTIC_COMPILER_OPTIONS);
  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, lang) =>
      name === fileName ? sourceFile : defaultHost.getSourceFile(name, lang),
    fileExists: (f) => f === fileName || defaultHost.fileExists(f),
    readFile: (f) => (f === fileName ? content : defaultHost.readFile(f)),
  };

  const program = ts.createProgram([fileName], SEMANTIC_COMPILER_OPTIONS, customHost);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return Array.from(diagnostics)
    .filter((d) => !SEMANTIC_SKIP_CODES.has(d.code))
    .map((d) => {
      const line = d.file ? `:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : "";
      return `[TS${d.code}]${line} ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`;
    });
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
  "bg-on-brand-primary": "bg-brand-on-primary",
  "text-white": "text-on-brand-primary",
  "text-black": "text-surface-foreground",
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
// Bracket-notation props fix
// ============================================================================

export function fixBracketNotationProps(content: string): { content: string; fixCount: number } {
  let fixCount = 0;
  const fixed = content.replace(
    /props\[['"]([a-zA-Z_$][a-zA-Z0-9_$-]*)['"]\]/g,
    (_match, key: string) => {
      const camelKey = key
        .replace(/[-_]([a-zA-Z0-9])/g, (_: string, c: string) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
      fixCount++;
      return `props.${camelKey}`;
    }
  );
  return { content: fixed, fixCount };
}

export function validateNoBracketProps(content: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const regex = /props\[['"][^'"]+['"]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split("\n").length;
    const context = content.substring(match.index, match.index + 50);
    violations.push(`Line ${line}: ${context}`);
  }
  return { valid: violations.length === 0, violations };
}

export function validatePropsAgainstInterface(content: string): {
  valid: boolean;
  undeclaredProps: string[];
} {
  // Extract prop names from the interface
  const interfaceMatch = content.match(/interface\s+\w+Props\s*\{([^}]+)\}/s);
  if (!interfaceMatch) return { valid: true, undeclaredProps: [] };

  const declaredProps = new Set<string>();
  const propRegex = /(\w+)\s*[?:]|(\w+)\s*:/g;
  let propMatch;
  while ((propMatch = propRegex.exec(interfaceMatch[1])) !== null) {
    declaredProps.add(propMatch[1] || propMatch[2]);
  }

  // Extract prop references from the body (after the interface)
  const bodyStart = content.indexOf(interfaceMatch[0]) + interfaceMatch[0].length;
  const body = content.substring(bodyStart);
  const usedProps = new Set<string>();
  const usageRegex = /props\.(\w+)/g;
  let usageMatch;
  while ((usageMatch = usageRegex.exec(body)) !== null) {
    usedProps.add(usageMatch[1]);
  }

  const undeclaredProps = [...usedProps].filter((p) => !declaredProps.has(p));
  return { valid: undeclaredProps.length === 0, undeclaredProps };
}

export function hasResidualBracketProps(content: string): boolean {
  return !validateNoBracketProps(content).valid;
}

// ============================================================================
// "use client" directive detection
// ============================================================================

const CLIENT_PATTERNS =
  /\b(useState|useEffect|useRef|useCallback|useMemo|onClick|onChange|onSubmit|onKeyDown|onMouseEnter|onFocus|onBlur|RevealOnScroll|Carousel|ParallaxSection|useScrollParallax|IntersectionObserver)\b|<form\b/;

/**
 * Determine if a component needs "use client" directive.
 * Returns true when ANY of:
 * - interactionNeeds === "stateful"
 * - Category is "Navigation" (mobile menu toggle)
 * - Category is "Forms" or "Newsletter"
 * - JSX body contains interactive hooks/handlers
 */
export function needsUseClient(blueprint: SectionBlueprint, jsxBody: string): boolean {
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
  blueprint: SectionBlueprint,
  tokenMappings?: string
): Promise<string | null> {
  const interfaceName = `${blueprint.componentExportName}Props`;

  // Use clone translation prompt when clone context is available
  const useCloneTranslation = !!blueprint.cloneHtmlFragment;
  const prompt = useCloneTranslation
    ? buildCloneTranslationPrompt(blueprint, interfaceName, tokenMappings)
    : buildComponentGenerationPrompt(blueprint, interfaceName);

  // Increase max_tokens for clone translation (output is typically larger)
  const maxTokens = useCloneTranslation ? 4096 : 2048;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;

    // Extract just the return body
    let body = text.text.trim();

    // Strip markdown fences if present
    body = body.replace(/^```(?:tsx?|jsx?)?\n?/m, "").replace(/\n?```$/m, "");

    const trimmed = body.trimStart();

    // Clone translation prompt returns raw JSX (starts with <section or <div).
    // Wrap it in a return statement so the shell wrappers work correctly.
    if (
      useCloneTranslation &&
      (trimmed.startsWith("<section") ||
        trimmed.startsWith("<div") ||
        trimmed.startsWith("<main") ||
        trimmed.startsWith("<header") ||
        trimmed.startsWith("<footer") ||
        trimmed.startsWith("<nav"))
    ) {
      // Indent and wrap in return
      const indented = body
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");
      body = `  return (\n${indented}\n  );`;
    } else if (!trimmed.startsWith("return")) {
      // Blueprint-only prompt must start with "return"
      return null;
    } else if (!body.startsWith("  ")) {
      // Indent properly if needed
      body = body
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n");
    }

    return body;
  } catch (err) {
    console.warn(`    [Warning] AI generation failed for ${blueprint.name}: ${err}`);
    return null;
  }
}

// ============================================================================
// Syntax-error targeted retry
// ============================================================================

/**
 * Targeted syntax-error retry: sends the broken component + exact parse errors
 * to the AI for a focused fix. Returns the full corrected component string, or
 * null if the fix attempt fails or the content is too large to retry.
 */
async function retryWithSyntaxErrors(
  client: Anthropic,
  blueprint: SectionBlueprint,
  brokenContent: string,
  syntaxErrors: string[]
): Promise<string | null> {
  // Guard: if content is very large, skip targeted retry (token cost)
  if (brokenContent.length > 10000) {
    return null;
  }

  const errorList = syntaxErrors.slice(0, 5).join("\n- ");

  const fixPrompt = `The following TSX component has syntax errors. Fix ONLY the syntax errors listed below — do not change the logic, layout, or prop names.

ERRORS:
- ${errorList}

BROKEN COMPONENT:
\`\`\`tsx
${brokenContent}
\`\`\`

Return ONLY the corrected TSX component, starting with the first line of the file. No markdown fences, no explanation.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      temperature: 0,
      messages: [{ role: "user", content: fixPrompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;

    let fixed = text.text.trim();
    // Strip markdown fences if present
    fixed = fixed.replace(/^```(?:tsx?|jsx?)?\n?/m, "").replace(/\n?```$/m, "");
    return fixed || null;
  } catch (err) {
    console.warn(`    [Warning] Syntax-error retry failed for ${blueprint.name}: ${err}`);
    return null;
  }
}

// ============================================================================
// Single component generation
// ============================================================================

async function generateSingleComponent(
  client: Anthropic | null,
  blueprint: SectionBlueprint,
  outputDir: string,
  tokenMappings?: string
): Promise<{ component: GeneratedComponent; warnings: string[] }> {
  const warnings: string[] = [];
  const filePath = path.join(outputDir, blueprint.componentFileName);
  let content: string;
  let usedAI = false;

  if (client) {
    let jsxBody = await generateJSXBody(client, blueprint, tokenMappings);

    // If clone translation failed, fall back to blueprint-only generation
    if (!jsxBody && blueprint.cloneHtmlFragment) {
      warnings.push(
        `${blueprint.name}: Clone translation failed — falling back to blueprint-only generation`
      );
      const blueprintOnly = {
        ...blueprint,
        cloneHtmlFragment: undefined,
        cloneRelevantCss: undefined,
      };
      jsxBody = await generateJSXBody(client, blueprintOnly);
    }

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
        // Targeted retry: show AI the broken content + exact errors
        const fixedContent = await retryWithSyntaxErrors(client, blueprint, content, syntaxErrors);
        if (fixedContent) {
          // Verify the fix has the correct named export before accepting
          if (!verifyNamedExport(fixedContent, blueprint.componentExportName)) {
            warnings.push(
              `${blueprint.name}: Syntax-fix retry changed export name — using placeholder`
            );
            content = placeholderComponent(blueprint);
            usedAI = false;
          } else {
            const retryErrors = validateTypeScriptSyntax(fixedContent, blueprint.componentFileName);
            if (retryErrors.length > 0) {
              warnings.push(`${blueprint.name}: Syntax-fix retry also failed — using placeholder`);
              content = placeholderComponent(blueprint);
              usedAI = false;
            } else {
              warnings.push(`${blueprint.name}: Syntax-fix retry succeeded`);
              content = fixedContent;
              // usedAI stays true
            }
          }
        } else {
          // Fallback: blind regeneration (original behavior, used when content > 10k)
          jsxBody = await generateJSXBody(client, blueprint);
          if (jsxBody) {
            content = needsClient
              ? clientComponentShell(blueprint, jsxBody)
              : serverComponentShell(blueprint, jsxBody);
            const retryErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
            if (retryErrors.length > 0) {
              warnings.push(`${blueprint.name}: Blind retry also failed — using placeholder`);
              content = placeholderComponent(blueprint);
              usedAI = false;
            }
          } else {
            content = placeholderComponent(blueprint);
            usedAI = false;
          }
        }
      }

      // Post-generation: Semantic type check
      if (usedAI) {
        const semanticErrors = validateTypeScriptSemantic(content, blueprint.componentFileName);
        if (semanticErrors.length > 0) {
          warnings.push(`${blueprint.name}: TS semantic errors: ${semanticErrors.join("; ")}`);
          // Targeted repair: show AI the broken content + exact semantic errors
          const fixedContent = await retryWithSyntaxErrors(
            client,
            blueprint,
            content,
            semanticErrors
          );
          if (fixedContent) {
            if (!verifyNamedExport(fixedContent, blueprint.componentExportName)) {
              warnings.push(
                `${blueprint.name}: Semantic-fix retry changed export name — using placeholder`
              );
              content = placeholderComponent(blueprint);
              usedAI = false;
            } else {
              const retryErrors = validateTypeScriptSemantic(
                fixedContent,
                blueprint.componentFileName
              );
              if (retryErrors.length > 0) {
                warnings.push(
                  `${blueprint.name}: Semantic-fix retry also failed — using placeholder`
                );
                content = placeholderComponent(blueprint);
                usedAI = false;
              } else {
                warnings.push(`${blueprint.name}: Semantic-fix retry succeeded`);
                content = fixedContent;
              }
            }
          } else {
            // retryWithSyntaxErrors returned null (content > 10k or API error)
            warnings.push(
              `${blueprint.name}: Semantic errors, content too large to retry — using placeholder`
            );
            content = placeholderComponent(blueprint);
            usedAI = false;
          }
        }
      }

      // Post-generation: Token class validation with auto-replace
      if (usedAI) {
        const { content: fixedContent, violations } = validateAndFixTokenClasses(content);
        if (violations.length > 0) {
          const strippedViolations = violations.map((v) => ({
            original: v,
            stripped: v.replace(/^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:)+/, ""),
          }));
          const fixedClasses = strippedViolations
            .filter((v) => CLASS_REPLACEMENTS[v.stripped])
            .map((v) => v.original);
          const unfixedClasses = strippedViolations
            .filter((v) => !CLASS_REPLACEMENTS[v.stripped])
            .map((v) => v.original);

          if (fixedClasses.length > 0) {
            warnings.push(
              `${blueprint.name}: Non-standard colour classes replaced: ${fixedClasses.join(", ")}`
            );
          }
          if (unfixedClasses.length > 0) {
            warnings.push(
              `${blueprint.name}: Unknown colour classes (not in token allowlist): ${unfixedClasses.join(", ")}`
            );
          }
          content = fixedContent;
          // Re-check syntax after auto-fix
          const fixSyntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
          if (fixSyntaxErrors.length > 0) {
            content = placeholderComponent(blueprint);
            usedAI = false;
          }
        }
      }

      // Post-generation: Fix bracket-notation prop access
      if (usedAI) {
        const { content: propsFixed, fixCount } = fixBracketNotationProps(content);
        if (fixCount > 0) {
          warnings.push(
            `${blueprint.name}: Fixed ${fixCount} bracket-notation prop accesses → dot notation`
          );
          content = propsFixed;
        }
        // Hard-fail if bracket notation still remains after fix
        const { valid: noBracket, violations: bracketViolations } = validateNoBracketProps(content);
        if (!noBracket) {
          warnings.push(
            `${blueprint.name}: Residual bracket-notation props detected after fix — using placeholder: ${bracketViolations[0]}`
          );
          content = placeholderComponent(blueprint);
          usedAI = false;
        }
        // Informational: check for undeclared props
        if (usedAI) {
          const { valid: propsValid, undeclaredProps } = validatePropsAgainstInterface(content);
          if (!propsValid) {
            warnings.push(
              `${blueprint.name}: Undeclared props used (informational): ${undeclaredProps.join(", ")}`
            );
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

  // Post-generation: hex literal auto-repair then hard-fail
  if (usedAI) {
    const hexLiterals = scanForHexLiterals(content);
    if (hexLiterals.length > 0) {
      // Attempt inline style substitution first
      const { content: hexFixed, replacements } = autoRepairHexLiterals(content);
      const remaining = scanForHexLiterals(hexFixed);
      if (remaining.length === 0) {
        warnings.push(
          `${blueprint.name}: Replaced ${replacements} hex literal(s) with CSS variable refs`
        );
        content = hexFixed;
        // Re-verify syntax after substitution
        const hexFixSyntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
        if (hexFixSyntaxErrors.length > 0) {
          warnings.push(`${blueprint.name}: Hex fix introduced syntax errors — using placeholder`);
          content = placeholderComponent(blueprint);
          usedAI = false;
        }
      } else {
        // Still has hex literals that couldn't be auto-fixed — hard-fail
        warnings.push(
          `${blueprint.name}: Contains hex literals: ${remaining.join(", ")} — replacing with placeholder`
        );
        content = placeholderComponent(blueprint);
        usedAI = false;
      }
    }
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
  componentMatches?: Map<string, ComponentMatch | null>
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
          console.log(
            `    ✓ ${bp.componentExportName} → reusing ${match.componentName} (${match.matchConfidence})`
          );
          return false;
        }
        return true;
      })
    : blueprints;

  console.log(
    `  Generating ${blueprintsToGenerate.length} components (${blueprints.length - blueprintsToGenerate.length} reused from core)...`
  );

  for (const blueprint of blueprintsToGenerate) {
    console.log(`    ${blueprint.componentExportName} (${blueprint.category})...`);
    const { component, warnings } = await generateSingleComponent(client, blueprint, outputDir);

    // Write file
    fs.writeFileSync(component.filePath, component.content, "utf8");
    console.log(
      `    ✓ ${path.basename(component.filePath)}${component.usedAI ? " (AI)" : " (placeholder)"}`
    );

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
 * Generate component files from clone-enriched blueprints.
 *
 * Uses the clone translation prompt (HTML + CSS reference) when a blueprint
 * has cloneHtmlFragment. Falls back to blueprint-only generation on failure.
 *
 * @param blueprints - Section blueprints enriched with clone context
 * @param outputDir - Directory to write component files to
 * @param tokenMappings - Optional formatted string of color token mappings for the AI prompt
 * @param componentMatches - Optional map of blueprint ID to ComponentMatch (v3 pipeline)
 * @returns Generation result with component metadata and warnings
 */
export async function generateThemeComponentsFromClone(
  blueprints: SectionBlueprint[],
  outputDir: string,
  tokenMappings?: string,
  componentMatches?: Map<string, ComponentMatch | null>
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
          console.log(
            `    ✓ ${bp.componentExportName} → reusing ${match.componentName} (${match.matchConfidence})`
          );
          return false;
        }
        return true;
      })
    : blueprints;

  const cloneCount = blueprintsToGenerate.filter((bp) => bp.cloneHtmlFragment).length;
  console.log(
    `  Generating ${blueprintsToGenerate.length} components (${cloneCount} with clone context, ${blueprintsToGenerate.length - cloneCount} blueprint-only)...`
  );

  for (const blueprint of blueprintsToGenerate) {
    const contextLabel = blueprint.cloneHtmlFragment ? " [clone]" : "";
    console.log(`    ${blueprint.componentExportName} (${blueprint.category})${contextLabel}...`);
    const { component, warnings } = await generateSingleComponent(
      client,
      blueprint,
      outputDir,
      tokenMappings
    );

    // Write file
    fs.writeFileSync(component.filePath, component.content, "utf8");
    console.log(
      `    ✓ ${path.basename(component.filePath)}${component.usedAI ? " (AI)" : " (placeholder)"}`
    );

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
