#!/usr/bin/env tsx

/**
 * Content Quality Validation Script
 * ==================================
 *
 * Validates content quality beyond structural validation:
 * - Readability (Flesch-Kincaid metrics)
 * - SEO (title/description length, keyword density)
 * - Uniqueness (n-gram similarity, boilerplate detection)
 *
 * Usage:
 *   npm run validate:quality                           # Validate all content
 *   npm run validate:quality -- --validators=readability,seo
 *   npm run validate:quality -- --json                 # JSON output for CI
 *   npm run validate:quality -- --file=content/services/my-service.mdx
 */

import path from 'path';
import {
  runValidators,
  getValidatorNames,
  type AggregatedResults,
  type ValidationResult,
  type ValidationIssue,
} from '@platform/core-components/lib/validators';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

/**
 * Parse command line arguments
 */
function parseArgs(): {
  validators: string[];
  json: boolean;
  file?: string;
  verbose: boolean;
  help: boolean;
} {
  const args = process.argv.slice(2);
  const result = {
    validators: [] as string[],
    json: false,
    file: undefined as string | undefined,
    verbose: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--json') {
      result.json = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (arg.startsWith('--validators=')) {
      result.validators = arg.replace('--validators=', '').split(',').filter(Boolean);
    } else if (arg.startsWith('--file=')) {
      result.file = arg.replace('--file=', '');
    }
  }

  return result;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
${colors.bold}Content Quality Validation${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run validate:quality [options]

${colors.cyan}Options:${colors.reset}
  --validators=<list>   Comma-separated list of validators to run
                        Available: ${getValidatorNames().join(', ')}
  --file=<path>         Validate a single file
  --json                Output results as JSON
  --verbose, -v         Show detailed metrics
  --help, -h            Show this help message

${colors.cyan}Examples:${colors.reset}
  npm run validate:quality
  npm run validate:quality -- --validators=readability,seo
  npm run validate:quality -- --json
  npm run validate:quality -- --file=content/services/my-service.mdx
  npm run validate:quality -- --verbose
`);
}

/**
 * Get severity color
 */
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'error':
      return colors.red;
    case 'warning':
      return colors.yellow;
    case 'info':
      return colors.cyan;
    default:
      return colors.gray;
  }
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'error':
      return 'x';
    case 'warning':
      return '!';
    case 'info':
      return 'i';
    default:
      return '-';
  }
}

/**
 * Format a validation issue for display
 */
function formatIssue(issue: ValidationIssue, verbose: boolean): string {
  const color = getSeverityColor(issue.severity);
  const icon = getSeverityIcon(issue.severity);

  let output = `    ${color}${icon}${colors.reset} [${color}${issue.code}${colors.reset}] ${issue.message}`;

  if (issue.field) {
    output += ` ${colors.gray}(${issue.field})${colors.reset}`;
  }

  if (issue.suggestion && verbose) {
    output += `\n      ${colors.dim}Suggestion: ${issue.suggestion}${colors.reset}`;
  }

  return output;
}

/**
 * Get validator status display
 */
function getValidatorStatus(
  results: ValidationResult[],
  validatorName: string
): { passed: boolean; errorCount: number; warningCount: number; infoCount: number } {
  const result = results.find((r) => r.validator === validatorName);

  if (!result) {
    return { passed: true, errorCount: 0, warningCount: 0, infoCount: 0 };
  }

  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const issue of result.issues) {
    switch (issue.severity) {
      case 'error':
        errorCount++;
        break;
      case 'warning':
        warningCount++;
        break;
      case 'info':
        infoCount++;
        break;
    }
  }

  return {
    passed: errorCount === 0,
    errorCount,
    warningCount,
    infoCount,
  };
}

/**
 * Format metric value for display
 */
function formatMetric(name: string, value: number): string {
  // Format based on metric type
  if (name.includes('Percent') || name.includes('Density') || name.includes('Similarity')) {
    return `${value.toFixed(1)}%`;
  }
  if (name.includes('Length') || name.includes('Count') || name.includes('Words')) {
    return Math.round(value).toString();
  }
  return value.toFixed(1);
}

/**
 * Print results in text format
 */
function printTextResults(results: AggregatedResults, verbose: boolean): void {
  const divider = `${colors.blue}${'='.repeat(60)}${colors.reset}`;
  const thinDivider = `${colors.gray}${'-'.repeat(60)}${colors.reset}`;

  // Header
  console.log('');
  console.log(divider);
  console.log(`${colors.bold}${colors.blue}Content Quality Validation${colors.reset}`);
  console.log(divider);
  console.log('');

  // Process each file
  for (const [filePath, fileResults] of results.results) {
    const fileName = filePath.split('/').pop() || filePath;
    const fileType = filePath.includes('/services/') ? 'service' : 'location';

    // Check if file has any issues
    const hasIssues = fileResults.some((r) => r.issues.length > 0);

    if (!hasIssues && !verbose) {
      // Skip files with no issues in non-verbose mode
      continue;
    }

    // File header
    console.log(
      `${colors.bold}${fileName}${colors.reset} ${colors.gray}(${fileType})${colors.reset}`
    );
    console.log('');

    // Show each validator result
    for (const result of fileResults) {
      const status = getValidatorStatus(fileResults, result.validator);
      const validatorName = result.validator.charAt(0).toUpperCase() + result.validator.slice(1);

      // Validator status line
      if (status.errorCount > 0) {
        console.log(
          `  ${colors.red}x${colors.reset} ${validatorName}: ${colors.red}${status.errorCount} error(s)${colors.reset}${status.warningCount > 0 ? `, ${status.warningCount} warning(s)` : ''}`
        );
      } else if (status.warningCount > 0) {
        console.log(
          `  ${colors.yellow}!${colors.reset} ${validatorName}: ${colors.yellow}${status.warningCount} warning(s)${colors.reset}${status.infoCount > 0 ? `, ${status.infoCount} info` : ''}`
        );
      } else if (status.infoCount > 0) {
        console.log(
          `  ${colors.cyan}i${colors.reset} ${validatorName}: ${colors.cyan}${status.infoCount} info${colors.reset}`
        );
      } else {
        console.log(
          `  ${colors.green}v${colors.reset} ${validatorName}: ${colors.green}Passed${colors.reset}`
        );
      }

      // Show issues
      for (const issue of result.issues) {
        console.log(formatIssue(issue, verbose));
      }

      // Show metrics in verbose mode
      if (verbose && result.metrics) {
        console.log(`    ${colors.gray}Metrics:${colors.reset}`);
        for (const [name, value] of Object.entries(result.metrics)) {
          const formattedName = name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
          console.log(
            `      ${colors.dim}${formattedName}: ${formatMetric(name, value)}${colors.reset}`
          );
        }
      }
    }

    console.log('');
  }

  // Summary
  console.log(divider);
  console.log(`${colors.bold}Summary${colors.reset}`);
  console.log(thinDivider);
  console.log('');

  console.log(`  Total files:    ${results.totalFiles}`);
  console.log(`  ${colors.green}Passed:${colors.reset}        ${results.passedFiles}`);

  if (results.warningFiles > 0) {
    console.log(`  ${colors.yellow}With warnings:${colors.reset} ${results.warningFiles}`);
  }

  if (results.errorFiles > 0) {
    console.log(`  ${colors.red}With errors:${colors.reset}   ${results.errorFiles}`);
  }

  console.log('');
  console.log(`  ${colors.red}Errors:${colors.reset}   ${results.totalErrors}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset} ${results.totalWarnings}`);
  console.log(`  ${colors.cyan}Info:${colors.reset}     ${results.totalInfo}`);
  console.log('');
  console.log(`  Duration: ${(results.duration / 1000).toFixed(2)}s`);
  console.log('');

  // Final status
  if (results.totalErrors > 0) {
    console.log(`${colors.red}${colors.bold}x Content quality validation failed${colors.reset}`);
  } else if (results.totalWarnings > 0) {
    console.log(
      `${colors.yellow}${colors.bold}! Content quality validation passed with warnings${colors.reset}`
    );
  } else {
    console.log(`${colors.green}${colors.bold}v Content quality validation passed${colors.reset}`);
  }
  console.log('');
}

/**
 * Print results in JSON format
 */
function printJsonResults(results: AggregatedResults): void {
  // Convert Map to array for JSON serialization
  const fileResults: Record<string, ValidationResult[]> = {};
  for (const [filePath, validatorResults] of results.results) {
    fileResults[filePath] = validatorResults;
  }

  const output = {
    summary: {
      totalFiles: results.totalFiles,
      passedFiles: results.passedFiles,
      errorFiles: results.errorFiles,
      warningFiles: results.warningFiles,
      totalErrors: results.totalErrors,
      totalWarnings: results.totalWarnings,
      totalInfo: results.totalInfo,
      duration: results.duration,
    },
    results: fileResults,
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Validate specified validators
  const availableValidators = getValidatorNames();
  const invalidValidators = args.validators.filter((v) => !availableValidators.includes(v));

  if (invalidValidators.length > 0) {
    console.error(
      `${colors.red}Error: Unknown validator(s): ${invalidValidators.join(', ')}${colors.reset}`
    );
    console.error(`Available validators: ${availableValidators.join(', ')}`);
    process.exit(1);
  }

  try {
    const contentDir = path.join(process.cwd(), 'content');

    const results = await runValidators(contentDir, {
      validators: args.validators.length > 0 ? args.validators : undefined,
      file: args.file,
      verbose: args.verbose,
    });

    if (args.json) {
      printJsonResults(results);
    } else {
      printTextResults(results, args.verbose);
    }

    // Exit with appropriate code
    // Exit code 1 only for errors, not warnings
    process.exit(results.totalErrors > 0 ? 1 : 0);
  } catch (error) {
    if (args.json) {
      console.log(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        })
      );
    } else {
      console.error(
        `${colors.red}Error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
      );
    }
    process.exit(1);
  }
}

// Run if executed directly
const scriptPath = process.argv[1];
const isMainModule =
  import.meta.url === `file://${scriptPath}` ||
  (scriptPath && import.meta.url === new URL(`file://${scriptPath}`).href);

if (isMainModule) {
  main();
}

export { main };
