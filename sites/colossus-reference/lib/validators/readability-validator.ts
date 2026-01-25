/**
 * Readability Validator
 *
 * Rule-based validator that checks content readability metrics:
 * - Flesch-Kincaid Grade Level (target: 8-12)
 * - Flesch Reading Ease Score (target: 60-70)
 * - Average sentence length (target: 15-20 words)
 * - Complex word percentage (>3 syllables, target: <10%)
 *
 * Issue codes: READ_001, READ_002, READ_003, READ_004
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationIssue,
  ParsedContent,
} from "./types";

/**
 * Count syllables in a word using heuristics
 * Based on common English pronunciation patterns
 */
function countSyllables(word: string): number {
  const normalizedWord = word.toLowerCase().replace(/[^a-z]/g, "");

  if (normalizedWord.length === 0) return 0;
  if (normalizedWord.length <= 2) return 1;

  // Count vowel groups
  let syllables = 0;
  let prevWasVowel = false;
  const vowels = "aeiouy";

  for (let i = 0; i < normalizedWord.length; i++) {
    const isVowel = vowels.includes(normalizedWord[i]);
    if (isVowel && !prevWasVowel) {
      syllables++;
    }
    prevWasVowel = isVowel;
  }

  // Handle silent e at end
  if (normalizedWord.endsWith("e") && syllables > 1) {
    // Check if it's not a word ending in "le" which is pronounced
    if (!normalizedWord.endsWith("le") || normalizedWord.length <= 3) {
      syllables--;
    }
  }

  // Handle common suffixes that add syllables
  if (normalizedWord.endsWith("ed")) {
    // "ed" is usually silent unless preceded by t or d
    const beforeEd = normalizedWord.charAt(normalizedWord.length - 3);
    if (beforeEd !== "t" && beforeEd !== "d") {
      // Do nothing - ed is silent
    }
  }

  // Handle -tion, -sion (counted as one syllable already)
  // Handle -ious, -eous (two syllables)
  if (normalizedWord.endsWith("ious") || normalizedWord.endsWith("eous")) {
    syllables++;
  }

  // Ensure at least one syllable
  return Math.max(1, syllables);
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end of string
  return text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z]/.test(s));
}

/**
 * Split text into words
 */
function splitIntoWords(text: string): string[] {
  return text
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && /[a-zA-Z]/.test(w));
}

/**
 * Extract all text content from frontmatter for analysis
 */
function extractTextContent(frontmatter: Record<string, unknown>): string {
  const textParts: string[] = [];

  // Extract description
  if (typeof frontmatter.description === "string") {
    textParts.push(frontmatter.description);
  }

  // Extract hero text
  if (frontmatter.hero && typeof frontmatter.hero === "object") {
    const hero = frontmatter.hero as Record<string, unknown>;
    if (typeof hero.heading === "string") textParts.push(hero.heading);
    if (typeof hero.subheading === "string") textParts.push(hero.subheading);
    if (typeof hero.description === "string") textParts.push(hero.description);
    if (typeof hero.title === "string") textParts.push(hero.title);
  }

  // Extract about section
  if (frontmatter.about && typeof frontmatter.about === "object") {
    const about = frontmatter.about as Record<string, unknown>;
    if (typeof about.whatIs === "string") textParts.push(about.whatIs);
    if (Array.isArray(about.whenNeeded)) {
      about.whenNeeded.forEach((item) => {
        if (typeof item === "string") textParts.push(item);
      });
    }
    if (Array.isArray(about.whatAchieve)) {
      about.whatAchieve.forEach((item) => {
        if (typeof item === "string") textParts.push(item);
      });
    }
    if (Array.isArray(about.keyPoints)) {
      about.keyPoints.forEach((item) => {
        if (typeof item === "string") textParts.push(item);
      });
    }
  }

  // Extract FAQs
  if (Array.isArray(frontmatter.faqs)) {
    frontmatter.faqs.forEach((faq) => {
      if (faq && typeof faq === "object") {
        const faqObj = faq as Record<string, unknown>;
        if (typeof faqObj.question === "string") textParts.push(faqObj.question);
        if (typeof faqObj.answer === "string") textParts.push(faqObj.answer);
      }
    });
  }

  // Extract specialists description (location pages)
  if (frontmatter.specialists && typeof frontmatter.specialists === "object") {
    const specialists = frontmatter.specialists as Record<string, unknown>;
    if (typeof specialists.description === "string") {
      textParts.push(specialists.description);
    }
    if (Array.isArray(specialists.cards)) {
      specialists.cards.forEach((card) => {
        if (card && typeof card === "object") {
          const cardObj = card as Record<string, unknown>;
          if (typeof cardObj.description === "string") {
            textParts.push(cardObj.description);
          }
        }
      });
    }
  }

  return textParts.join(" ");
}

/**
 * Calculate Flesch Reading Ease score
 * Formula: 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
 */
function calculateFleschReadingEase(
  totalWords: number,
  totalSentences: number,
  totalSyllables: number
): number {
  if (totalSentences === 0 || totalWords === 0) return 0;

  const avgSentenceLength = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;

  const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Flesch-Kincaid Grade Level
 * Formula: 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59
 */
function calculateFleschKincaidGrade(
  totalWords: number,
  totalSentences: number,
  totalSyllables: number
): number {
  if (totalSentences === 0 || totalWords === 0) return 0;

  const avgSentenceLength = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;

  const grade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;

  // Clamp to reasonable range (0-20)
  return Math.max(0, Math.min(20, grade));
}

/**
 * Readability Validator Implementation
 */
export const readabilityValidator: Validator = {
  name: "readability",
  description:
    "Checks content readability using Flesch-Kincaid metrics, sentence length, and complex word analysis",

  async validate(content: ParsedContent, config: ValidatorConfig): Promise<ValidationResult> {
    const startTime = performance.now();
    const issues: ValidationIssue[] = [];

    // Get thresholds from config or use defaults
    const thresholds = {
      fleschReadingEaseMin: config.thresholds?.fleschReadingEaseMin ?? 60,
      fleschReadingEaseMax: config.thresholds?.fleschReadingEaseMax ?? 70,
      fleschKincaidGradeMin: config.thresholds?.fleschKincaidGradeMin ?? 8,
      fleschKincaidGradeMax: config.thresholds?.fleschKincaidGradeMax ?? 12,
      avgSentenceLengthMin: config.thresholds?.avgSentenceLengthMin ?? 15,
      avgSentenceLengthMax: config.thresholds?.avgSentenceLengthMax ?? 20,
      complexWordPercentMax: config.thresholds?.complexWordPercentMax ?? 10,
    };

    // Extract text content from frontmatter
    const textContent = extractTextContent(content.frontmatter);

    // Also include the body content (MDX)
    const fullText = textContent + " " + content.body;

    // Analyze text
    const sentences = splitIntoSentences(fullText);
    const words = splitIntoWords(fullText);

    // Calculate metrics
    let totalSyllables = 0;
    let complexWordCount = 0;

    words.forEach((word) => {
      const syllableCount = countSyllables(word);
      totalSyllables += syllableCount;
      if (syllableCount > 3) {
        complexWordCount++;
      }
    });

    const totalWords = words.length;
    const totalSentences = Math.max(1, sentences.length);

    const avgSentenceLength = totalWords / totalSentences;
    const complexWordPercent = totalWords > 0 ? (complexWordCount / totalWords) * 100 : 0;
    const fleschReadingEase = calculateFleschReadingEase(
      totalWords,
      totalSentences,
      totalSyllables
    );
    const fleschKincaidGrade = calculateFleschKincaidGrade(
      totalWords,
      totalSentences,
      totalSyllables
    );

    // Check Flesch-Kincaid Grade Level (READ_001)
    if (
      fleschKincaidGrade < thresholds.fleschKincaidGradeMin ||
      fleschKincaidGrade > thresholds.fleschKincaidGradeMax
    ) {
      const isLow = fleschKincaidGrade < thresholds.fleschKincaidGradeMin;
      issues.push({
        severity: config.severity,
        code: "READ_001",
        message: `Flesch-Kincaid Grade Level is ${fleschKincaidGrade.toFixed(1)} (target: ${thresholds.fleschKincaidGradeMin}-${thresholds.fleschKincaidGradeMax})`,
        suggestion: isLow
          ? "Content may be too simple. Consider adding more detailed technical information."
          : "Content may be too complex. Consider using simpler words and shorter sentences.",
        score: fleschKincaidGrade,
        details: {
          gradeLevel: fleschKincaidGrade,
          targetMin: thresholds.fleschKincaidGradeMin,
          targetMax: thresholds.fleschKincaidGradeMax,
        },
      });
    }

    // Check Flesch Reading Ease (READ_002)
    if (
      fleschReadingEase < thresholds.fleschReadingEaseMin ||
      fleschReadingEase > thresholds.fleschReadingEaseMax
    ) {
      const isLow = fleschReadingEase < thresholds.fleschReadingEaseMin;
      issues.push({
        severity: config.severity,
        code: "READ_002",
        message: `Flesch Reading Ease score is ${fleschReadingEase.toFixed(1)} (target: ${thresholds.fleschReadingEaseMin}-${thresholds.fleschReadingEaseMax})`,
        suggestion: isLow
          ? "Content is difficult to read. Simplify sentence structure and word choice."
          : "Content might be oversimplified. Consider adding more substance.",
        score: fleschReadingEase,
        details: {
          readingEase: fleschReadingEase,
          targetMin: thresholds.fleschReadingEaseMin,
          targetMax: thresholds.fleschReadingEaseMax,
        },
      });
    }

    // Check Average Sentence Length (READ_003)
    if (
      avgSentenceLength < thresholds.avgSentenceLengthMin ||
      avgSentenceLength > thresholds.avgSentenceLengthMax
    ) {
      const isShort = avgSentenceLength < thresholds.avgSentenceLengthMin;
      issues.push({
        severity: config.severity,
        code: "READ_003",
        message: `Average sentence length is ${avgSentenceLength.toFixed(1)} words (target: ${thresholds.avgSentenceLengthMin}-${thresholds.avgSentenceLengthMax})`,
        suggestion: isShort
          ? "Sentences are too short. Consider combining related ideas."
          : "Sentences are too long. Break complex sentences into shorter ones.",
        score: avgSentenceLength,
        details: {
          avgLength: avgSentenceLength,
          targetMin: thresholds.avgSentenceLengthMin,
          targetMax: thresholds.avgSentenceLengthMax,
          totalSentences,
          totalWords,
        },
      });
    }

    // Check Complex Word Percentage (READ_004)
    if (complexWordPercent > thresholds.complexWordPercentMax) {
      issues.push({
        severity: config.severity,
        code: "READ_004",
        message: `Complex word percentage is ${complexWordPercent.toFixed(1)}% (target: <${thresholds.complexWordPercentMax}%)`,
        suggestion:
          "Too many complex words (>3 syllables). Replace some with simpler alternatives.",
        score: complexWordPercent,
        details: {
          complexPercent: complexWordPercent,
          complexWordCount,
          totalWords,
          targetMax: thresholds.complexWordPercentMax,
        },
      });
    }

    const duration = performance.now() - startTime;

    return {
      file: content.filePath,
      type: content.type,
      validator: this.name,
      passed: !issues.some((issue) => issue.severity === "error"),
      issues,
      metrics: {
        fleschReadingEase,
        fleschKincaidGrade,
        avgSentenceLength,
        complexWordPercent,
        totalWords,
        totalSentences,
        totalSyllables,
      },
      duration,
    };
  },
};

export default readabilityValidator;
