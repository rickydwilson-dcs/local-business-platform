import * as fs from "fs";
import * as path from "path";
import type { KnownPattern, PatternMatch } from "./types";

let _patterns: KnownPattern[] | null = null;

function loadPatterns(): KnownPattern[] {
  if (_patterns) return _patterns;
  const patternsPath = path.join(__dirname, "../known-patterns.json");
  const raw = JSON.parse(fs.readFileSync(patternsPath, "utf8")) as { patterns: KnownPattern[] };
  _patterns = raw.patterns;
  return _patterns;
}

export function matchPatterns(failureOutput: string): PatternMatch[] {
  const patterns = loadPatterns();
  const lower = failureOutput.toLowerCase();

  const matches: PatternMatch[] = [];
  for (const pattern of patterns) {
    const matchedSymptoms = pattern.symptoms.filter((s) => lower.includes(s.toLowerCase()));
    if (matchedSymptoms.length > 0) {
      matches.push({ pattern, hitCount: matchedSymptoms.length, matchedSymptoms });
    }
  }

  return matches.sort((a, b) => b.hitCount - a.hitCount);
}
