/**
 * Component Matcher
 *
 * Scores each SectionBlueprint against the core component catalog
 * to determine if an existing component can be reused.
 */

import type { SectionBlueprint, ComponentMatch } from "./reference-analysis-types";
import { CORE_COMPONENT_CATALOG, type CatalogEntry } from "./core-component-catalog";

// ============================================================================
// Scoring
// ============================================================================

/**
 * Jaccard similarity between two string arrays.
 * Returns a value between 0 and 1.
 */
function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Keyword overlap score between a layout pattern string and catalog layout cues.
 * Splits the pattern into words and checks how many match the cues.
 */
function layoutMatchScore(layoutPattern: string, layoutCues: string[]): number {
  if (!layoutPattern || layoutCues.length === 0) return 0;

  const patternWords = layoutPattern
    .toLowerCase()
    .split(/[\s,;:()/-]+/)
    .filter((w) => w.length > 2);

  if (patternWords.length === 0) return 0;

  const cueSet = new Set(layoutCues.map((c) => c.toLowerCase()));
  let matches = 0;

  for (const word of patternWords) {
    for (const cue of cueSet) {
      if (cue.includes(word) || word.includes(cue)) {
        matches++;
        break;
      }
    }
  }

  return matches / Math.max(patternWords.length, layoutCues.length);
}

/**
 * Score a single blueprint against a single catalog entry.
 * Returns a composite score from 0 to 1.
 */
function scoreMatch(blueprint: SectionBlueprint, entry: CatalogEntry): number {
  // Category must match to score at all
  if (blueprint.category !== entry.category) return 0;

  // Content slots overlap (Jaccard similarity)
  const slotsScore = jaccardSimilarity(blueprint.contentSlots, entry.requiredSlots);

  // Layout pattern keyword matching
  const layoutScore = layoutMatchScore(blueprint.layoutPattern, entry.layoutCues);

  // Weighted composite: category match is prerequisite, then slots and layout
  return slotsScore * 0.6 + layoutScore * 0.4;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Match section blueprints against the core component catalog.
 *
 * For each blueprint, finds the best matching catalog entry and returns
 * a ComponentMatch if the score exceeds the threshold.
 *
 * Thresholds:
 * - Score > 0.7 → "exact" (use core component directly)
 * - Score 0.4-0.7 → "close" (use with minor adaptation)
 * - Score < 0.4 → no match (generate new component)
 *
 * @param blueprints - Section blueprints from the analysis
 * @returns Map of blueprint ID to ComponentMatch or null
 */
export function matchComponents(
  blueprints: SectionBlueprint[]
): Map<string, ComponentMatch | null> {
  const results = new Map<string, ComponentMatch | null>();

  for (const blueprint of blueprints) {
    let bestScore = 0;
    let bestEntry: CatalogEntry | null = null;

    for (const entry of CORE_COMPONENT_CATALOG) {
      const score = scoreMatch(blueprint, entry);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }

    if (bestScore >= 0.4 && bestEntry) {
      const confidence: ComponentMatch["matchConfidence"] = bestScore > 0.7 ? "exact" : "close";

      results.set(blueprint.id, {
        blueprintId: blueprint.id,
        componentName: bestEntry.name,
        importPath: bestEntry.importPath,
        matchConfidence: confidence,
        adaptationNotes:
          confidence === "close"
            ? `Score ${bestScore.toFixed(2)} — may need minor prop adaptation`
            : undefined,
      });
    } else {
      results.set(blueprint.id, null);
    }
  }

  return results;
}
