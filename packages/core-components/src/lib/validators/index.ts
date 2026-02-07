/**
 * Validator Registry
 * ===================
 *
 * Central registry for all content quality validators.
 * Provides a unified interface for running validators on content files.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ParsedContent,
  ValidatorRunnerOptions,
  AggregatedResults,
} from "./types";

import { readabilityValidator } from "./readability-validator";
import { seoValidator } from "./seo-validator";
import { uniquenessValidator, clearUniquenessCache } from "./uniqueness-validator";

// Re-export types
export * from "./types";

// Re-export validators
export { readabilityValidator } from "./readability-validator";
export { seoValidator } from "./seo-validator";
export { uniquenessValidator, clearUniquenessCache } from "./uniqueness-validator";

/**
 * Registry of all available validators
 */
const validatorRegistry = new Map<string, Validator>([
  [readabilityValidator.name, readabilityValidator],
  [seoValidator.name, seoValidator],
  [uniquenessValidator.name, uniquenessValidator],
]);

/**
 * Default configurations for validators
 */
const defaultConfigs: Record<string, ValidatorConfig> = {
  readability: {
    enabled: true,
    severity: "warning",
    thresholds: {
      fleschReadingEaseMin: 60,
      fleschReadingEaseMax: 70,
      fleschKincaidGradeMin: 8,
      fleschKincaidGradeMax: 12,
      avgSentenceLengthMin: 15,
      avgSentenceLengthMax: 20,
      complexWordPercentMax: 10,
    },
  },
  seo: {
    enabled: true,
    severity: "warning",
    thresholds: {
      titleLengthMin: 50,
      titleLengthMax: 60,
      descriptionLengthMin: 150,
      descriptionLengthMax: 160,
      keywordDensityMin: 1,
      keywordDensityMax: 3,
      keywordsCountMin: 3,
      keywordsCountMax: 10,
    },
  },
  uniqueness: {
    enabled: true,
    severity: "warning",
    thresholds: {
      similarityThreshold: 70,
      boilerplateMinOccurrences: 3,
      boilerplateMinPhraseLength: 5,
    },
  },
};

/**
 * Get all registered validator names
 */
export function getValidatorNames(): string[] {
  return Array.from(validatorRegistry.keys());
}

/**
 * Get a validator by name
 */
export function getValidator(name: string): Validator | undefined {
  return validatorRegistry.get(name);
}

/**
 * Parse an MDX file and return parsed content
 */
export function parseContentFile(filePath: string): ParsedContent {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content: body } = matter(fileContent);

  const fileName = path.basename(filePath);
  const type = filePath.includes("/services/") ? "service" : "location";

  return {
    filePath,
    fileName,
    type,
    frontmatter,
    body,
  };
}

/**
 * Get all MDX files from a directory
 */
export function getMdxFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dirPath, file));
}

/**
 * Run a single validator on parsed content
 */
export async function runValidator(
  content: ParsedContent,
  validatorName: string,
  config?: Partial<ValidatorConfig>
): Promise<ValidationResult | null> {
  const validator = validatorRegistry.get(validatorName);

  if (!validator) {
    console.error(`Validator "${validatorName}" not found`);
    return null;
  }

  const defaultConfig = defaultConfigs[validatorName] || {
    enabled: true,
    severity: "warning",
  };

  const mergedConfig: ValidatorConfig = {
    ...defaultConfig,
    ...config,
    thresholds: {
      ...defaultConfig.thresholds,
      ...config?.thresholds,
    },
  };

  if (!mergedConfig.enabled) {
    return null;
  }

  return validator.validate(content, mergedConfig);
}

/**
 * Run all validators on a single file
 */
export async function validateFile(
  filePath: string,
  options: ValidatorRunnerOptions = {}
): Promise<ValidationResult[]> {
  const content = parseContentFile(filePath);
  const results: ValidationResult[] = [];

  const validatorsToRun =
    options.validators && options.validators.length > 0 ? options.validators : getValidatorNames();

  for (const validatorName of validatorsToRun) {
    const config = options.configs?.[validatorName];
    const result = await runValidator(content, validatorName, config);

    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Run validators on all content files
 */
export async function runValidators(
  contentDir: string,
  options: ValidatorRunnerOptions = {}
): Promise<AggregatedResults> {
  const startTime = performance.now();

  // Clear uniqueness cache for fresh comparison
  clearUniquenessCache();

  const servicesDir = path.join(contentDir, "services");
  const locationsDir = path.join(contentDir, "locations");

  let files: string[] = [];

  if (options.file) {
    // Validate a single file
    const fullPath = path.isAbsolute(options.file)
      ? options.file
      : path.join(process.cwd(), options.file);

    if (fs.existsSync(fullPath)) {
      files = [fullPath];
    } else {
      throw new Error(`File not found: ${options.file}`);
    }
  } else {
    // Get all MDX files
    files = [...getMdxFiles(servicesDir), ...getMdxFiles(locationsDir)];
  }

  const results = new Map<string, ValidationResult[]>();
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfo = 0;
  let errorFiles = 0;
  let warningFiles = 0;

  // Run validators on each file
  for (const filePath of files) {
    const fileResults = await validateFile(filePath, options);
    results.set(filePath, fileResults);

    // Count issues
    let fileHasError = false;
    let fileHasWarning = false;

    for (const result of fileResults) {
      for (const issue of result.issues) {
        switch (issue.severity) {
          case "error":
            totalErrors++;
            fileHasError = true;
            break;
          case "warning":
            totalWarnings++;
            fileHasWarning = true;
            break;
          case "info":
            totalInfo++;
            break;
        }
      }
    }

    if (fileHasError) {
      errorFiles++;
    } else if (fileHasWarning) {
      warningFiles++;
    }
  }

  const duration = performance.now() - startTime;

  return {
    totalFiles: files.length,
    passedFiles: files.length - errorFiles - warningFiles,
    errorFiles,
    warningFiles,
    totalErrors,
    totalWarnings,
    totalInfo,
    results,
    duration,
  };
}
