/**
 * Content Quality Validator Types
 *
 * Type definitions for the content quality validation system.
 * These types extend the structural Zod validation with quality checks.
 */

/**
 * Represents a single validation issue found during quality analysis
 */
export interface ValidationIssue {
  /** Severity level of the issue */
  severity: "error" | "warning" | "info";
  /** Unique code identifying the issue type (e.g., "READ_001", "SEO_003") */
  code: string;
  /** Human-readable description of the issue */
  message: string;
  /** Optional field path where the issue was found (e.g., "description", "faqs[2].answer") */
  field?: string;
  /** Optional suggestion for how to fix the issue */
  suggestion?: string;
  /** Optional numeric score associated with the issue */
  score?: number;
  /** Optional additional details about the issue */
  details?: Record<string, unknown>;
}

/**
 * Result of running a single validator on a content file
 */
export interface ValidationResult {
  /** Path to the validated file */
  file: string;
  /** Content type (service or location) */
  type: "service" | "location";
  /** Name of the validator that produced this result */
  validator: string;
  /** Whether validation passed (no errors) */
  passed: boolean;
  /** List of issues found during validation */
  issues: ValidationIssue[];
  /** Optional metrics collected during validation */
  metrics?: Record<string, number>;
  /** Time taken to run validation in milliseconds */
  duration: number;
}

/**
 * Configuration options for a validator
 */
export interface ValidatorConfig {
  /** Whether the validator is enabled */
  enabled: boolean;
  /** Default severity level for issues from this validator */
  severity: "error" | "warning" | "info";
  /** Optional threshold values for quality metrics */
  thresholds?: Record<string, number>;
}

/**
 * Parsed content from an MDX file
 */
export interface ParsedContent {
  /** The full file path */
  filePath: string;
  /** The filename without directory */
  fileName: string;
  /** Content type derived from the file path */
  type: "service" | "location";
  /** Parsed frontmatter data */
  frontmatter: Record<string, unknown>;
  /** Raw MDX body content (after frontmatter) */
  body: string;
}

/**
 * Interface that all validators must implement
 */
export interface Validator {
  /** Unique name identifying this validator */
  name: string;
  /** Human-readable description of what this validator checks */
  description: string;
  /** Run validation on parsed content */
  validate(content: ParsedContent, config: ValidatorConfig): Promise<ValidationResult>;
}

/**
 * Options for the validator runner
 */
export interface ValidatorRunnerOptions {
  /** List of validator names to run (empty = all) */
  validators?: string[];
  /** Output format */
  outputFormat?: "text" | "json";
  /** Single file to validate (if not specified, validates all) */
  file?: string;
  /** Whether to show verbose output */
  verbose?: boolean;
  /** Custom validator configurations */
  configs?: Record<string, Partial<ValidatorConfig>>;
}

/**
 * Aggregated results from running multiple validators
 */
export interface AggregatedResults {
  /** Total number of files validated */
  totalFiles: number;
  /** Total number of files that passed all validators */
  passedFiles: number;
  /** Total number of files with errors */
  errorFiles: number;
  /** Total number of files with warnings only */
  warningFiles: number;
  /** Total number of errors across all files */
  totalErrors: number;
  /** Total number of warnings across all files */
  totalWarnings: number;
  /** Total number of info issues across all files */
  totalInfo: number;
  /** Individual results by file */
  results: Map<string, ValidationResult[]>;
  /** Total validation duration in milliseconds */
  duration: number;
}
