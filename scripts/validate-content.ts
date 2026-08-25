#!/usr/bin/env tsx

/**
 * Content Validation Script
 *
 * Validates all MDX files in content/services/ and content/locations/
 * against their respective Zod schemas to catch content errors before
 * they reach production.
 *
 * Usage:
 *   npm run validate:content
 *   npm run validate:services
 *   npm run validate:locations
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import matter from "gray-matter";
import { z, ZodSchema } from "zod";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
};

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
}

/**
 * Validate a single MDX file against a Zod schema
 */
function validateFile(
  filePath: string,
  schema: ZodSchema,
  type: "service" | "location" | "blog" | "project"
): ValidationResult {
  const fileName = path.basename(filePath);

  try {
    // Read and parse MDX file
    const fileContent = fs.readFileSync(filePath, "utf-8");
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
        const pathStr = err.path.join(".");
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
  schema: ZodSchema,
  type: "service" | "location" | "blog" | "project"
): ValidationResult[] {
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dirPath, file));

  return files.map((file) => validateFile(file, schema, type));
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
      console.log("");
    });
  }

  // Print valid files (condensed)
  const validResults = results.filter((r) => r.valid);
  if (validResults.length > 0) {
    console.log(`${colors.green}✓ Passed Files (${validCount}):${colors.reset}`);
    validResults.forEach((result) => {
      console.log(`  ${colors.green}✓${colors.reset} ${colors.gray}${result.file}${colors.reset}`);
    });
    console.log("");
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
  console.log("");

  return invalidCount === 0;
}

/**
 * Main execution
 */
/**
 * Local DCS project frontmatter shape — deliberately NOT the shared
 * ProjectFrontmatterSchema from core-components, which requires fields
 * (projectType, location, completionDate, etc.) that don't apply to DCS's
 * simpler content/projects/*.mdx case-study format.
 */
const DcsProjectFrontmatterSchema = z.object({
  title: z.string().min(5, "Project title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  tags: z
    .array(z.string().min(2, "Tag must be at least 2 characters"))
    .min(1, "At least 1 tag required"),
  outcomes: z
    .array(z.string().min(10, "Outcome must be at least 10 characters"))
    .min(1, "At least 1 outcome required"),
  heroImage: z.string().optional(),
});

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || "all"; // 'all', 'services', 'locations', 'blog', or 'project'

  const contentDir = path.join(process.cwd(), "content");
  const servicesDir = path.join(contentDir, "services");
  const locationsDir = path.join(contentDir, "locations");
  const blogDir = path.join(contentDir, "blog");
  const projectsDir = path.join(contentDir, "projects");

  // Import content-schemas from the canonical source in core-components
  const schemasPath = path.join(
    process.cwd(),
    "..",
    "..",
    "packages",
    "core-components",
    "src",
    "lib",
    "content-schemas"
  );
  const { ServiceFrontmatterSchema, LocationFrontmatterSchema, BlogFrontmatterSchema } =
    await import(schemasPath);

  let allValid = true;

  // Validate services
  if (mode === "all" || mode === "services") {
    if (!fs.existsSync(servicesDir)) {
      console.error(
        `${colors.red}Error: Services directory not found: ${servicesDir}${colors.reset}`
      );
      process.exit(1);
    }

    const serviceResults = validateDirectory(servicesDir, ServiceFrontmatterSchema, "service");
    const servicesValid = printResults(serviceResults, "Services");
    allValid = allValid && servicesValid;
  }

  // Validate locations
  if (mode === "all" || mode === "locations") {
    if (!fs.existsSync(locationsDir)) {
      console.error(
        `${colors.red}Error: Locations directory not found: ${locationsDir}${colors.reset}`
      );
      process.exit(1);
    }

    const locationResults = validateDirectory(locationsDir, LocationFrontmatterSchema, "location");
    const locationsValid = printResults(locationResults, "Locations");
    allValid = allValid && locationsValid;
  }

  // Validate blog posts
  if (mode === "blog") {
    if (!fs.existsSync(blogDir)) {
      console.error(`${colors.red}Error: Blog directory not found: ${blogDir}${colors.reset}`);
      process.exit(1);
    }

    const blogResults = validateDirectory(blogDir, BlogFrontmatterSchema, "blog");
    const blogValid = printResults(blogResults, "Blog");
    allValid = allValid && blogValid;
  } else if (mode === "all" && fs.existsSync(blogDir)) {
    // Not every site has content/blog/ — only validate it in "all" mode when present.
    const blogResults = validateDirectory(blogDir, BlogFrontmatterSchema, "blog");
    const blogValid = printResults(blogResults, "Blog");
    allValid = allValid && blogValid;
  }

  // Validate projects (DCS-local shape, not the shared ProjectFrontmatterSchema)
  if (mode === "project") {
    if (!fs.existsSync(projectsDir)) {
      console.error(
        `${colors.red}Error: Projects directory not found: ${projectsDir}${colors.reset}`
      );
      process.exit(1);
    }

    const projectResults = validateDirectory(projectsDir, DcsProjectFrontmatterSchema, "project");
    const projectsValid = printResults(projectResults, "Projects");
    allValid = allValid && projectsValid;
  } else if (mode === "all" && fs.existsSync(projectsDir)) {
    // Not every site has content/projects/ — only validate it in "all" mode when present.
    const projectResults = validateDirectory(projectsDir, DcsProjectFrontmatterSchema, "project");
    const projectsValid = printResults(projectResults, "Projects");
    allValid = allValid && projectsValid;
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
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  import.meta.url === fileURLToPath(process.argv[1]);

if (isMainModule) {
  main().catch((error) => {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

export { validateFile, validateDirectory };
