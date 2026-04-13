#!/usr/bin/env tsx
/**
 * Clone Package Format (CPF) Validator
 *
 * Validates that a clone directory conforms to the CPF spec.
 * Run standalone: npx tsx tools/lib/cpf-validator.ts output/clones/corvus/
 */

import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

// ── Meta schema ─────────────────────────────────────────────────────────────

const CpfMetaSchema = z.object({
  jobId: z.string(),
  sourceType: z.enum(["url", "stitch", "design-skill"]),
  sourceRef: z.string(),
  capturedAt: z.string().datetime(),
  cpfVersion: z.literal("0.1"),
});

type CpfMeta = z.infer<typeof CpfMetaSchema>;

// ── Validator ────────────────────────────────────────────────────────────────

export function validateCPF(clonePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const abs = path.resolve(clonePath);

  if (!fs.existsSync(abs)) {
    return { valid: false, errors: [`Clone path does not exist: ${abs}`] };
  }

  // meta.json
  const metaPath = path.join(abs, "meta.json");
  if (!fs.existsSync(metaPath)) {
    errors.push("meta.json is missing");
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as unknown;
      const result = CpfMetaSchema.safeParse(raw);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`meta.json: ${issue.path.join(".")} — ${issue.message}`);
        }
      }
    } catch {
      errors.push("meta.json: not valid JSON");
    }
  }

  // assets/images/
  const imagesDir = path.join(abs, "assets", "images");
  if (!fs.existsSync(imagesDir)) {
    errors.push("assets/images/ directory is missing");
  }

  // html/pages/ — at least one .html file
  const htmlPagesDir = path.join(abs, "html", "pages");
  if (!fs.existsSync(htmlPagesDir)) {
    errors.push("html/pages/ directory is missing");
  } else {
    const htmlFiles = fs.readdirSync(htmlPagesDir).filter((f) => f.endsWith(".html"));
    if (htmlFiles.length === 0) {
      errors.push("html/pages/ has no .html files");
    }
  }

  // jsx/pages/ — at least one .tsx file
  const jsxPagesDir = path.join(abs, "jsx", "pages");
  if (!fs.existsSync(jsxPagesDir)) {
    errors.push("jsx/pages/ directory is missing");
  } else {
    const tsxFiles = fs.readdirSync(jsxPagesDir).filter((f) => f.endsWith(".tsx"));
    if (tsxFiles.length === 0) {
      errors.push("jsx/pages/ has no .tsx files");
    }
  }

  // reference-screenshots/ — at least one .png file
  const screenshotsDir = path.join(abs, "reference-screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    errors.push("reference-screenshots/ directory is missing");
  } else {
    const pngFiles = fs.readdirSync(screenshotsDir).filter((f) => f.endsWith(".png"));
    if (pngFiles.length === 0) {
      errors.push("reference-screenshots/ has no .png files");
    }
  }

  // styles/computed-styles.json — exists and is valid JSON
  const stylesPath = path.join(abs, "styles", "computed-styles.json");
  if (!fs.existsSync(stylesPath)) {
    errors.push("styles/computed-styles.json is missing");
  } else {
    try {
      JSON.parse(fs.readFileSync(stylesPath, "utf-8"));
    } catch {
      errors.push("styles/computed-styles.json: not valid JSON");
    }
  }

  // reports/ directory
  const reportsDir = path.join(abs, "reports");
  if (!fs.existsSync(reportsDir)) {
    errors.push("reports/ directory is missing");
  }

  return { valid: errors.length === 0, errors };
}

// ── CLI entry point ──────────────────────────────────────────────────────────

if (require.main === module || process.argv[1]?.endsWith("cpf-validator.ts")) {
  const clonePath = process.argv[2];
  if (!clonePath) {
    console.error("Usage: npx tsx tools/lib/cpf-validator.ts <clone-path>");
    process.exit(1);
  }

  const result = validateCPF(clonePath);
  if (result.valid) {
    console.log(`CPF validation PASSED: ${clonePath}`);
    process.exit(0);
  } else {
    console.error(`CPF validation FAILED: ${clonePath}`);
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
}
