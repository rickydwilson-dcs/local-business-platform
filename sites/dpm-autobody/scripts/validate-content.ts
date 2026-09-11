#!/usr/bin/env tsx

/**
 * Content Validation Script
 *
 * Validates all MDX files in content/builds/ against BuildFrontmatterSchema
 * to catch content errors before they reach production.
 *
 * DPM Autobody's approved design has no service-list or location pages —
 * base-template's services/locations routes and content dirs were deleted
 * at scaffold time (see site-level CLAUDE.md) — so this site has no
 * content/services/ or content/locations/ and must not be wired to the
 * root scripts/validate-content.ts. See
 * docs/architecture/content-validation.md#non-standard-content-types.
 *
 * Usage:
 *   npm run validate:content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { BuildFrontmatterSchema } from '../lib/content-schemas';
import { z } from 'zod';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
}

/**
 * Validate a single MDX file against a Zod schema
 */
function validateFile(filePath: string, schema: typeof BuildFrontmatterSchema): ValidationResult {
  const fileName = path.basename(filePath);

  try {
    // Read and parse MDX file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter } = matter(fileContent);

    // Validate frontmatter against schema
    schema.parse(frontmatter);

    return {
      file: fileName,
      valid: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => {
        const pathStr = err.path.join('.');
        return `  ${colors.gray}${pathStr}${colors.reset}: ${err.message}`;
      });

      return {
        file: fileName,
        valid: false,
        errors,
      };
    }

    return {
      file: fileName,
      valid: false,
      errors: [`  Unexpected error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Validate all MDX files in a directory
 */
function validateDirectory(
  dirPath: string,
  schema: typeof BuildFrontmatterSchema
): ValidationResult[] {
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(dirPath, file));

  return files.map((file) => validateFile(file, schema));
}

/**
 * Check for duplicate slugs (filenames without extension) in a directory.
 */
function findDuplicateSlugs(dirPath: string): string[] {
  const slugs = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      duplicates.add(slug);
    }
    seen.add(slug);
  }
  return Array.from(duplicates);
}

/**
 * Print validation results
 */
function printResults(results: ValidationResult[], type: string): boolean {
  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;
  const totalCount = results.length;

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}Validating ${type}${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Print invalid files first
  const invalidResults = results.filter((r) => !r.valid);
  if (invalidResults.length > 0) {
    console.log(`${colors.red}✗ Failed Files:${colors.reset}\n`);
    invalidResults.forEach((result) => {
      console.log(`${colors.red}✗${colors.reset} ${result.file}`);
      if (result.errors) {
        result.errors.forEach((error) => console.log(error));
      }
      console.log('');
    });
  }

  // Print valid files (condensed)
  const validResults = results.filter((r) => r.valid);
  if (validResults.length > 0) {
    console.log(`${colors.green}✓ Passed Files (${validCount}):${colors.reset}`);
    validResults.forEach((result) => {
      console.log(`  ${colors.green}✓${colors.reset} ${colors.gray}${result.file}${colors.reset}`);
    });
    console.log('');
  }

  // Summary
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`Total files: ${totalCount}`);
  console.log(`${colors.green}✓ Valid: ${validCount}${colors.reset}`);
  if (invalidCount > 0) {
    console.log(`${colors.red}✗ Invalid: ${invalidCount}${colors.reset}`);
  }
  console.log('');

  return invalidCount === 0;
}

/**
 * Main execution
 */
function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const buildsDir = path.join(contentDir, 'builds');

  if (!fs.existsSync(buildsDir)) {
    console.error(`${colors.red}Error: Builds directory not found: ${buildsDir}${colors.reset}`);
    process.exit(1);
  }

  const results = validateDirectory(buildsDir, BuildFrontmatterSchema);
  const schemaValid = printResults(results, 'Builds');

  const duplicates = findDuplicateSlugs(buildsDir);
  if (duplicates.length > 0) {
    console.log(
      `${colors.red}✗ Duplicate slugs found in builds: ${duplicates.join(', ')}${colors.reset}\n`
    );
  }

  const allValid = schemaValid && duplicates.length === 0;

  if (allValid) {
    console.log(`${colors.green}✓ All content validation passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(
      `${colors.red}✗ Content validation failed. Please fix the errors above.${colors.reset}\n`
    );
    process.exit(1);
  }
}

// Run if executed directly (ESM compatible)
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === fileURLToPath(process.argv[1]);

if (isMainModule) {
  main();
}

export { validateFile, validateDirectory };
