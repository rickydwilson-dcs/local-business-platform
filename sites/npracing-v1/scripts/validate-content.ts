#!/usr/bin/env tsx

/**
 * Content Validation Script
 *
 * Validates all MDX files in content/services/, content/locations/,
 * content/merch/, content/news/, and content/brand/ against their respective
 * Zod schemas to catch content errors before they reach production.
 *
 * Usage:
 *   npm run validate-content          # all types
 *   npm run validate-content services
 *   npm run validate-content locations
 *   npm run validate-content merch
 *   npm run validate-content news
 *   npm run validate-content brand
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { ServiceFrontmatterSchema, LocationFrontmatterSchema } from '@platform/core-components';
import { MerchFrontmatterSchema } from '../lib/schemas/merch';
import { newsFrontmatterSchema } from '../lib/schemas/news';
import { BrandFrontmatterSchema } from '../lib/schemas/brand';
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

type AnySchema =
  | typeof ServiceFrontmatterSchema
  | typeof LocationFrontmatterSchema
  | typeof MerchFrontmatterSchema
  | typeof newsFrontmatterSchema
  | typeof BrandFrontmatterSchema;

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
}

/**
 * Validate a single MDX file against a Zod schema
 */
function validateFile(filePath: string, schema: AnySchema): ValidationResult {
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
function validateDirectory(dirPath: string, schema: AnySchema): ValidationResult[] {
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
 * Validate a content directory against a schema, an exact expected record
 * count, and a duplicate-slug check. Used for merch/news/brand, which have
 * fixed, known record counts (unlike services/locations).
 */
function validateExactCount(
  dirName: string,
  displayName: string,
  schema: AnySchema,
  expectedCount: number
): boolean {
  const contentDir = path.join(process.cwd(), 'content');
  const dirPath = path.join(contentDir, dirName);

  if (!fs.existsSync(dirPath)) {
    console.error(
      `${colors.red}Error: ${displayName} directory not found: ${dirPath}${colors.reset}`
    );
    return false;
  }

  const results = validateDirectory(dirPath, schema);
  const schemaValid = printResults(results, displayName);

  const duplicates = findDuplicateSlugs(dirPath);
  if (duplicates.length > 0) {
    console.log(
      `${colors.red}✗ Duplicate slugs found in ${dirName}: ${duplicates.join(', ')}${colors.reset}\n`
    );
  }

  const countValid = results.length === expectedCount;
  if (!countValid) {
    console.log(
      `${colors.red}✗ Expected exactly ${expectedCount} ${dirName} record(s), found ${results.length}${colors.reset}\n`
    );
  }

  return schemaValid && duplicates.length === 0 && countValid;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'all'; // 'all', 'services', 'locations', 'merch', 'news', 'brand'

  const contentDir = path.join(process.cwd(), 'content');
  const servicesDir = path.join(contentDir, 'services');
  const locationsDir = path.join(contentDir, 'locations');

  let allValid = true;

  // Validate services
  if (mode === 'all' || mode === 'services') {
    if (!fs.existsSync(servicesDir)) {
      console.error(
        `${colors.red}Error: Services directory not found: ${servicesDir}${colors.reset}`
      );
      process.exit(1);
    }

    const serviceResults = validateDirectory(servicesDir, ServiceFrontmatterSchema);
    const servicesValid = printResults(serviceResults, 'Services');
    allValid = allValid && servicesValid;
  }

  // Validate locations
  if (mode === 'all' || mode === 'locations') {
    if (!fs.existsSync(locationsDir)) {
      console.error(
        `${colors.red}Error: Locations directory not found: ${locationsDir}${colors.reset}`
      );
      process.exit(1);
    }

    const locationResults = validateDirectory(locationsDir, LocationFrontmatterSchema);
    const locationsValid = printResults(locationResults, 'Locations');
    allValid = allValid && locationsValid;
  }

  // Validate merch — exactly 8 real product records
  if (mode === 'all' || mode === 'merch') {
    allValid = allValid && validateExactCount('merch', 'Merch', MerchFrontmatterSchema, 8);
  }

  // Validate news — exactly 2 real article records
  if (mode === 'all' || mode === 'news') {
    allValid = allValid && validateExactCount('news', 'News', newsFrontmatterSchema, 2);
  }

  // Validate brand — exactly 1 singleton record
  if (mode === 'all' || mode === 'brand') {
    allValid = allValid && validateExactCount('brand', 'Brand', BrandFrontmatterSchema, 1);
  }

  // Exit with appropriate code
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
