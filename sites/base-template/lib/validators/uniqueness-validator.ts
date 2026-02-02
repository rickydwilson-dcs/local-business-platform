/**
 * Uniqueness Validator
 * =====================
 *
 * Hybrid validator that checks content uniqueness:
 * - N-gram fingerprinting (3-grams)
 * - Jaccard similarity between files
 * - Flag >70% similarity - UNIQ_001
 * - Detect boilerplate patterns (repeating phrases) - UNIQ_002
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationIssue,
  ParsedContent,
} from './types';

/**
 * Cache for content fingerprints to enable cross-file comparison
 * Key: file path, Value: set of n-grams
 */
const contentFingerprintCache = new Map<string, Set<string>>();

/**
 * Cache for raw text content to detect boilerplate
 */
const contentTextCache = new Map<string, string>();

/**
 * Extract text content from frontmatter for uniqueness analysis
 */
function extractTextContent(frontmatter: Record<string, unknown>): string {
  const textParts: string[] = [];

  // Extract description
  if (typeof frontmatter.description === 'string') {
    textParts.push(frontmatter.description);
  }

  // Extract hero text
  if (frontmatter.hero && typeof frontmatter.hero === 'object') {
    const hero = frontmatter.hero as Record<string, unknown>;
    if (typeof hero.heading === 'string') textParts.push(hero.heading);
    if (typeof hero.subheading === 'string') textParts.push(hero.subheading);
    if (typeof hero.description === 'string') textParts.push(hero.description);
    if (typeof hero.title === 'string') textParts.push(hero.title);
  }

  // Extract about section
  if (frontmatter.about && typeof frontmatter.about === 'object') {
    const about = frontmatter.about as Record<string, unknown>;
    if (typeof about.whatIs === 'string') textParts.push(about.whatIs);
    if (Array.isArray(about.whenNeeded)) {
      about.whenNeeded.forEach((item) => {
        if (typeof item === 'string') textParts.push(item);
      });
    }
    if (Array.isArray(about.whatAchieve)) {
      about.whatAchieve.forEach((item) => {
        if (typeof item === 'string') textParts.push(item);
      });
    }
    if (Array.isArray(about.keyPoints)) {
      about.keyPoints.forEach((item) => {
        if (typeof item === 'string') textParts.push(item);
      });
    }
  }

  // Extract FAQs
  if (Array.isArray(frontmatter.faqs)) {
    frontmatter.faqs.forEach((faq) => {
      if (faq && typeof faq === 'object') {
        const faqObj = faq as Record<string, unknown>;
        if (typeof faqObj.question === 'string') textParts.push(faqObj.question);
        if (typeof faqObj.answer === 'string') textParts.push(faqObj.answer);
      }
    });
  }

  // Extract specialists description (location pages)
  if (frontmatter.specialists && typeof frontmatter.specialists === 'object') {
    const specialists = frontmatter.specialists as Record<string, unknown>;
    if (typeof specialists.title === 'string') textParts.push(specialists.title);
    if (typeof specialists.description === 'string') {
      textParts.push(specialists.description);
    }
    if (Array.isArray(specialists.cards)) {
      specialists.cards.forEach((card) => {
        if (card && typeof card === 'object') {
          const cardObj = card as Record<string, unknown>;
          if (typeof cardObj.title === 'string') textParts.push(cardObj.title);
          if (typeof cardObj.description === 'string') {
            textParts.push(cardObj.description);
          }
        }
      });
    }
  }

  return textParts.join(' ');
}

/**
 * Normalize text for comparison (lowercase, remove punctuation, collapse whitespace)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate n-grams from text
 */
function generateNGrams(text: string, n: number = 3): Set<string> {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter((w) => w.length > 0);
  const ngrams = new Set<string>();

  for (let i = 0; i <= words.length - n; i++) {
    const ngram = words.slice(i, i + n).join(' ');
    ngrams.add(ngram);
  }

  return ngrams;
}

/**
 * Calculate Jaccard similarity between two sets
 * Returns a value between 0 (no overlap) and 1 (identical)
 */
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersection++;
    }
  }

  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Find repeating phrases in text (potential boilerplate)
 */
function findRepeatingPhrases(
  allTexts: Map<string, string>,
  minPhraseLength: number = 5,
  minOccurrences: number = 3
): Map<string, string[]> {
  const phraseOccurrences = new Map<string, string[]>();

  // Extract 5-word phrases from all files
  for (const [filePath, text] of allTexts) {
    const normalized = normalizeText(text);
    const words = normalized.split(' ').filter((w) => w.length > 0);

    for (let i = 0; i <= words.length - minPhraseLength; i++) {
      const phrase = words.slice(i, i + minPhraseLength).join(' ');

      // Skip very common/generic phrases
      if (isGenericPhrase(phrase)) continue;

      if (!phraseOccurrences.has(phrase)) {
        phraseOccurrences.set(phrase, []);
      }

      const files = phraseOccurrences.get(phrase)!;
      if (!files.includes(filePath)) {
        files.push(filePath);
      }
    }
  }

  // Filter to only phrases appearing in multiple files
  const repeatingPhrases = new Map<string, string[]>();
  for (const [phrase, files] of phraseOccurrences) {
    if (files.length >= minOccurrences) {
      repeatingPhrases.set(phrase, files);
    }
  }

  return repeatingPhrases;
}

/**
 * Check if a phrase is too generic to be considered boilerplate
 */
function isGenericPhrase(phrase: string): boolean {
  const genericPatterns = [
    /^(the|a|an|and|or|but|in|on|at|to|for)\s/,
    /\s(the|a|an|and|or|but)\s/,
    /^we (are|have|provide|offer)/,
    /^our (team|service|company)/,
    /^contact us/,
    /^free quote/,
  ];

  return genericPatterns.some((pattern) => pattern.test(phrase));
}

/**
 * Uniqueness Validator Implementation
 */
export const uniquenessValidator: Validator = {
  name: 'uniqueness',
  description: 'Checks content uniqueness using n-gram fingerprinting and Jaccard similarity',

  async validate(content: ParsedContent, config: ValidatorConfig): Promise<ValidationResult> {
    const startTime = performance.now();
    const issues: ValidationIssue[] = [];

    // Get thresholds from config or use defaults
    const thresholds = {
      similarityThreshold: config.thresholds?.similarityThreshold ?? 70,
      boilerplateMinOccurrences: config.thresholds?.boilerplateMinOccurrences ?? 3,
      boilerplateMinPhraseLength: config.thresholds?.boilerplateMinPhraseLength ?? 5,
    };

    // Extract and cache text content
    const textContent = extractTextContent(content.frontmatter);
    const fullText = textContent + ' ' + content.body;

    // Generate and cache fingerprint
    const fingerprint = generateNGrams(fullText, 3);
    contentFingerprintCache.set(content.filePath, fingerprint);
    contentTextCache.set(content.filePath, fullText);

    // Compare against other cached content (same type only)
    const similarFiles: Array<{ file: string; similarity: number }> = [];

    for (const [otherFilePath, otherFingerprint] of contentFingerprintCache) {
      // Skip self-comparison
      if (otherFilePath === content.filePath) continue;

      // Only compare same content types
      const otherType = otherFilePath.includes('/services/') ? 'service' : 'location';
      if (otherType !== content.type) continue;

      const similarity = calculateJaccardSimilarity(fingerprint, otherFingerprint) * 100;

      if (similarity >= thresholds.similarityThreshold) {
        similarFiles.push({
          file: otherFilePath.split('/').pop() || otherFilePath,
          similarity,
        });
      }
    }

    // UNIQ_001: Flag high similarity with other files
    if (similarFiles.length > 0) {
      // Sort by similarity (highest first)
      similarFiles.sort((a, b) => b.similarity - a.similarity);

      const topSimilar = similarFiles.slice(0, 3); // Report top 3

      issues.push({
        severity: config.severity,
        code: 'UNIQ_001',
        message: `Content is ${topSimilar[0].similarity.toFixed(1)}% similar to ${topSimilar[0].file}`,
        suggestion:
          'Add more unique content specific to this page. Differentiate headings, descriptions, and key points.',
        details: {
          similarFiles: topSimilar,
          threshold: thresholds.similarityThreshold,
        },
      });
    }

    // UNIQ_002: Detect boilerplate patterns across all cached content
    if (contentTextCache.size >= thresholds.boilerplateMinOccurrences) {
      const repeatingPhrases = findRepeatingPhrases(
        contentTextCache,
        thresholds.boilerplateMinPhraseLength,
        thresholds.boilerplateMinOccurrences
      );

      // Find phrases that appear in current file
      const currentNormalized = normalizeText(fullText);
      const boilerplateInCurrentFile: string[] = [];

      for (const [phrase, files] of repeatingPhrases) {
        if (currentNormalized.includes(phrase) && files.includes(content.filePath)) {
          boilerplateInCurrentFile.push(phrase);
        }
      }

      if (boilerplateInCurrentFile.length > 0) {
        issues.push({
          severity: 'info' as const, // Boilerplate is informational
          code: 'UNIQ_002',
          message: `Found ${boilerplateInCurrentFile.length} potential boilerplate phrase(s)`,
          suggestion: 'Consider rephrasing repeated content to improve uniqueness and SEO value.',
          details: {
            boilerplatePhrases: boilerplateInCurrentFile.slice(0, 5), // Show top 5
            totalFound: boilerplateInCurrentFile.length,
          },
        });
      }
    }

    const duration = performance.now() - startTime;

    return {
      file: content.filePath,
      type: content.type,
      validator: this.name,
      passed: !issues.some((issue) => issue.severity === 'error'),
      issues,
      metrics: {
        ngramCount: fingerprint.size,
        similarFilesCount: similarFiles.length,
        maxSimilarity: similarFiles.length > 0 ? similarFiles[0].similarity : 0,
      },
      duration,
    };
  },
};

/**
 * Clear the content caches (useful for testing or fresh runs)
 */
export function clearUniquenessCache(): void {
  contentFingerprintCache.clear();
  contentTextCache.clear();
}

/**
 * Get the current cache size (for metrics)
 */
export function getUniquenessCacheSize(): number {
  return contentFingerprintCache.size;
}
