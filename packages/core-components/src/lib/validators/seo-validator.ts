/**
 * SEO Validator
 * ==============
 *
 * Rule-based validator that checks SEO quality metrics:
 * - Title length (50-60 chars) - SEO_001
 * - Description length (150-160 chars optimal) - SEO_002
 * - Keyword density (1-3% for primary keyword) - SEO_003
 * - Description has CTA - SEO_004
 * - Keywords array has 3-10 items - SEO_005
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationIssue,
  ParsedContent,
} from "./types";

/**
 * Common CTA phrases and words that indicate a call-to-action
 */
const CTA_PATTERNS = [
  /\bfree\s+quote/i,
  /\bget\s+a?\s*quote/i,
  /\bcontact\s+us/i,
  /\bcall\s+(us|now|today)/i,
  /\bbook\s+(now|today|online)/i,
  /\brequest\s+a?\s*(quote|consultation)/i,
  /\blearn\s+more/i,
  /\bget\s+started/i,
  /\bschedule\s+a?\s*(call|consultation)/i,
  /\b(24\/7|24\s*hours)/i,
  /\bfree\s+(consultation|estimate|survey)/i,
];

/**
 * Check if text contains a call-to-action
 */
function containsCTA(text: string): boolean {
  return CTA_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Count occurrences of a keyword in text (case-insensitive)
 */
function countKeywordOccurrences(text: string, keyword: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();

  // Create a regex that matches the keyword as a whole word
  const regex = new RegExp(`\\b${escapeRegex(normalizedKeyword)}\\b`, "gi");
  const matches = normalizedText.match(regex);

  return matches ? matches.length : 0;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Count total words in text
 */
function countWords(text: string): number {
  return text
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/**
 * Extract all text content for keyword density analysis
 */
function extractAllText(frontmatter: Record<string, unknown>, body: string): string {
  const textParts: string[] = [];

  // Extract title
  if (typeof frontmatter.title === "string") {
    textParts.push(frontmatter.title);
  }

  // Extract seoTitle
  if (typeof frontmatter.seoTitle === "string") {
    textParts.push(frontmatter.seoTitle);
  }

  // Extract description
  if (typeof frontmatter.description === "string") {
    textParts.push(frontmatter.description);
  }

  // Extract hero content
  if (frontmatter.hero && typeof frontmatter.hero === "object") {
    const hero = frontmatter.hero as Record<string, unknown>;
    if (typeof hero.heading === "string") textParts.push(hero.heading);
    if (typeof hero.subheading === "string") textParts.push(hero.subheading);
    if (typeof hero.title === "string") textParts.push(hero.title);
    if (typeof hero.description === "string") textParts.push(hero.description);
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

  // Add body content
  textParts.push(body);

  return textParts.join(" ");
}

/**
 * SEO Validator Implementation
 */
export const seoValidator: Validator = {
  name: "seo",
  description:
    "Checks SEO quality including title/description length, keyword density, and CTA presence",

  async validate(content: ParsedContent, config: ValidatorConfig): Promise<ValidationResult> {
    const startTime = performance.now();
    const issues: ValidationIssue[] = [];
    const { frontmatter, body } = content;

    // Get thresholds from config or use defaults
    const thresholds = {
      titleLengthMin: config.thresholds?.titleLengthMin ?? 50,
      titleLengthMax: config.thresholds?.titleLengthMax ?? 60,
      descriptionLengthMin: config.thresholds?.descriptionLengthMin ?? 150,
      descriptionLengthMax: config.thresholds?.descriptionLengthMax ?? 160,
      keywordDensityMin: config.thresholds?.keywordDensityMin ?? 1,
      keywordDensityMax: config.thresholds?.keywordDensityMax ?? 3,
      keywordsCountMin: config.thresholds?.keywordsCountMin ?? 3,
      keywordsCountMax: config.thresholds?.keywordsCountMax ?? 10,
    };

    // SEO_001: Check SEO title length
    const seoTitle = (frontmatter.seoTitle as string) || (frontmatter.title as string) || "";
    const titleLength = seoTitle.length;

    if (titleLength < thresholds.titleLengthMin) {
      issues.push({
        severity: config.severity,
        code: "SEO_001",
        message: `SEO title is ${titleLength} characters (target: ${thresholds.titleLengthMin}-${thresholds.titleLengthMax})`,
        field: "seoTitle",
        suggestion: `Add ${thresholds.titleLengthMin - titleLength} more characters to optimize for search results display.`,
        score: titleLength,
        details: {
          currentLength: titleLength,
          targetMin: thresholds.titleLengthMin,
          targetMax: thresholds.titleLengthMax,
        },
      });
    } else if (titleLength > thresholds.titleLengthMax) {
      issues.push({
        severity: config.severity,
        code: "SEO_001",
        message: `SEO title is ${titleLength} characters (target: ${thresholds.titleLengthMin}-${thresholds.titleLengthMax})`,
        field: "seoTitle",
        suggestion: `Remove ${titleLength - thresholds.titleLengthMax} characters to prevent truncation in search results.`,
        score: titleLength,
        details: {
          currentLength: titleLength,
          targetMin: thresholds.titleLengthMin,
          targetMax: thresholds.titleLengthMax,
        },
      });
    }

    // SEO_002: Check description length
    const description = (frontmatter.description as string) || "";
    const descriptionLength = description.length;

    if (descriptionLength > 0) {
      if (descriptionLength < thresholds.descriptionLengthMin) {
        issues.push({
          severity: config.severity,
          code: "SEO_002",
          message: `Description is ${descriptionLength} characters (optimal: ${thresholds.descriptionLengthMin}-${thresholds.descriptionLengthMax})`,
          field: "description",
          suggestion: `Add ${thresholds.descriptionLengthMin - descriptionLength} more characters to maximize search result visibility.`,
          score: descriptionLength,
          details: {
            currentLength: descriptionLength,
            targetMin: thresholds.descriptionLengthMin,
            targetMax: thresholds.descriptionLengthMax,
          },
        });
      } else if (descriptionLength > thresholds.descriptionLengthMax) {
        issues.push({
          severity: config.severity,
          code: "SEO_002",
          message: `Description is ${descriptionLength} characters (optimal: ${thresholds.descriptionLengthMin}-${thresholds.descriptionLengthMax})`,
          field: "description",
          suggestion: `Trim ${descriptionLength - thresholds.descriptionLengthMax} characters to prevent truncation in search results.`,
          score: descriptionLength,
          details: {
            currentLength: descriptionLength,
            targetMin: thresholds.descriptionLengthMin,
            targetMax: thresholds.descriptionLengthMax,
          },
        });
      }
    }

    // SEO_003: Check keyword density for primary keyword
    const keywords = (frontmatter.keywords as string[]) || [];
    const primaryKeyword = keywords[0];
    let keywordDensity = 0;

    if (primaryKeyword) {
      const allText = extractAllText(frontmatter, body);
      const totalWords = countWords(allText);
      const keywordOccurrences = countKeywordOccurrences(allText, primaryKeyword);
      keywordDensity = totalWords > 0 ? (keywordOccurrences / totalWords) * 100 : 0;

      if (keywordDensity < thresholds.keywordDensityMin) {
        issues.push({
          severity: config.severity,
          code: "SEO_003",
          message: `Primary keyword "${primaryKeyword}" density is ${keywordDensity.toFixed(2)}% (target: ${thresholds.keywordDensityMin}-${thresholds.keywordDensityMax}%)`,
          field: "keywords[0]",
          suggestion: `Use the primary keyword more frequently in headings, description, and content.`,
          score: keywordDensity,
          details: {
            keyword: primaryKeyword,
            occurrences: keywordOccurrences,
            totalWords,
            density: keywordDensity,
            targetMin: thresholds.keywordDensityMin,
            targetMax: thresholds.keywordDensityMax,
          },
        });
      } else if (keywordDensity > thresholds.keywordDensityMax) {
        issues.push({
          severity: config.severity,
          code: "SEO_003",
          message: `Primary keyword "${primaryKeyword}" density is ${keywordDensity.toFixed(2)}% (target: ${thresholds.keywordDensityMin}-${thresholds.keywordDensityMax}%)`,
          field: "keywords[0]",
          suggestion: `Reduce keyword usage to avoid appearing spammy. Use synonyms and related terms.`,
          score: keywordDensity,
          details: {
            keyword: primaryKeyword,
            occurrences: keywordOccurrences,
            totalWords,
            density: keywordDensity,
            targetMin: thresholds.keywordDensityMin,
            targetMax: thresholds.keywordDensityMax,
          },
        });
      }
    }

    // SEO_004: Check if description has a CTA
    if (description && !containsCTA(description)) {
      issues.push({
        severity: "info" as const, // CTA is a recommendation, not critical
        code: "SEO_004",
        message: "Description does not contain a clear call-to-action",
        field: "description",
        suggestion:
          'Add a CTA like "Free quotes", "Contact us today", or "24/7 service" to improve click-through rate.',
        details: {
          description,
        },
      });
    }

    // SEO_005: Check keywords array count
    const keywordCount = keywords.length;

    if (keywordCount < thresholds.keywordsCountMin) {
      issues.push({
        severity: config.severity,
        code: "SEO_005",
        message: `Only ${keywordCount} keywords provided (recommended: ${thresholds.keywordsCountMin}-${thresholds.keywordsCountMax})`,
        field: "keywords",
        suggestion: `Add ${thresholds.keywordsCountMin - keywordCount} more relevant keywords for better SEO coverage.`,
        score: keywordCount,
        details: {
          currentCount: keywordCount,
          targetMin: thresholds.keywordsCountMin,
          targetMax: thresholds.keywordsCountMax,
        },
      });
    } else if (keywordCount > thresholds.keywordsCountMax) {
      issues.push({
        severity: "info" as const, // Too many keywords is less critical
        code: "SEO_005",
        message: `${keywordCount} keywords provided (recommended: ${thresholds.keywordsCountMin}-${thresholds.keywordsCountMax})`,
        field: "keywords",
        suggestion: `Consider focusing on ${thresholds.keywordsCountMax} most important keywords.`,
        score: keywordCount,
        details: {
          currentCount: keywordCount,
          targetMin: thresholds.keywordsCountMin,
          targetMax: thresholds.keywordsCountMax,
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
        titleLength,
        descriptionLength,
        keywordCount,
        keywordDensity,
        hasCTA: containsCTA(description) ? 1 : 0,
      },
      duration,
    };
  },
};
