#!/usr/bin/env tsx
/**
 * Image Intake Tool
 *
 * Processes and uploads client images to Cloudflare R2.
 *
 * Usage:
 *   pnpm images:intake <site-slug> <source-directory>
 *
 * Example:
 *   pnpm images:intake joes-plumbing-canterbury ~/client-images/joe-plumbing/
 *
 * This tool:
 * 1. Validates all images in source directory
 * 2. Optimizes images (resize, compress, convert to WebP)
 * 3. Generates responsive sizes
 * 4. Renames to standard convention: {site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}
 * 5. Uploads to Cloudflare R2
 * 6. Reports results and savings
 */

import * as fs from "fs";
import * as path from "path";
import { getR2Client } from "./lib/r2-client";
import { getImageProcessor, formatBytes } from "./lib/image-processor";

interface IntakeOptions {
  siteSlug: string;
  sourceDir: string;
  dryRun?: boolean;
  skipWebP?: boolean;
  skipAVIF?: boolean;
  quality?: number;
  interactive?: boolean;
}

interface ImageMetadata {
  component: string; // hero, gallery, service-card, etc.
  pageType: string; // service, location, about, etc.
  pageSlug: string; // emergency-plumbing, canterbury, etc.
  variant: string; // 01, 02, 03, etc.
}

class ImageIntakeTool {
  private r2Client = getR2Client();
  private processor = getImageProcessor();
  private stats = {
    total: 0,
    processed: 0,
    failed: 0,
    totalOriginalSize: 0,
    totalProcessedSize: 0,
    uploaded: 0,
  };

  /**
   * Run the intake process
   */
  async run(options: IntakeOptions): Promise<void> {
    console.log("🖼️  Image Intake Tool\n");
    console.log(`Site: ${options.siteSlug}`);
    console.log(`Source: ${options.sourceDir}`);
    console.log(`R2 Bucket: ${this.r2Client.getBucketName()}\n`);

    if (options.dryRun) {
      console.log("⚠️  DRY RUN MODE - No files will be uploaded\n");
    }

    // Validate source directory
    if (!fs.existsSync(options.sourceDir)) {
      console.error(`❌ Source directory not found: ${options.sourceDir}`);
      process.exit(1);
    }

    // Get all image files
    const imageFiles = this.findImageFiles(options.sourceDir);
    this.stats.total = imageFiles.length;

    if (imageFiles.length === 0) {
      console.log("❌ No image files found in source directory");
      process.exit(0);
    }

    console.log(`Found ${imageFiles.length} image(s)\n`);

    // Process each image
    for (let i = 0; i < imageFiles.length; i++) {
      const filePath = imageFiles[i];
      console.log(`\n[${i + 1}/${imageFiles.length}] Processing: ${path.basename(filePath)}`);

      try {
        await this.processImage(filePath, options);
        this.stats.processed++;
      } catch (error) {
        console.error(
          `❌ Failed to process: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        this.stats.failed++;
      }
    }

    // Print summary
    this.printSummary();
  }

  /**
   * Process a single image file
   */
  private async processImage(filePath: string, options: IntakeOptions): Promise<void> {
    // Validate image
    const validation = await this.processor.validateImage(filePath);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    console.log(`  ✓ Validated (${validation.metadata?.width}x${validation.metadata?.height})`);

    // Get metadata (interactive or from filename)
    const metadata = options.interactive
      ? await this.getMetadataInteractive(filePath)
      : this.getMetadataFromFilename(filePath);

    // Process image (optimize, resize, convert)
    const result = await this.processor.processImage(filePath, {
      generateWebP: !options.skipWebP,
      generateAVIF: !options.skipAVIF,
      quality: options.quality,
      responsive: true,
      responsiveSizes: [640, 1280, 1920],
    });

    this.stats.totalOriginalSize += result.original.size;
    console.log(`  ✓ Processed ${result.processed.length} variant(s)`);
    console.log(`    Original: ${formatBytes(result.original.size)}`);

    // Upload each processed image
    for (const processed of result.processed) {
      // Generate R2 key (filename in bucket)
      const key = this.generateR2Key(
        options.siteSlug,
        metadata,
        processed.format,
        processed.suffix
      );

      console.log(`    → ${key} (${formatBytes(processed.size)})`);

      if (!options.dryRun) {
        // Upload to R2
        const uploadResult = await this.r2Client.uploadBuffer(processed.buffer, key, {
          contentType: `image/${processed.format}`,
          metadata: {
            site: options.siteSlug,
            component: metadata.component,
            pageType: metadata.pageType,
            pageSlug: metadata.pageSlug,
            variant: metadata.variant,
            originalWidth: result.original.width.toString(),
            originalHeight: result.original.height.toString(),
          },
        });

        if (uploadResult.success) {
          this.stats.uploaded++;
          this.stats.totalProcessedSize += processed.size;
        } else {
          throw new Error(`Upload failed: ${uploadResult.error}`);
        }
      } else {
        this.stats.totalProcessedSize += processed.size;
      }
    }

    const savings =
      ((result.original.size - result.processed.reduce((sum, p) => sum + p.size, 0)) /
        result.original.size) *
      100;
    console.log(`  ✓ Uploaded (${savings.toFixed(1)}% savings)`);
  }

  /**
   * Find all image files in directory (recursive)
   */
  private findImageFiles(dir: string): string[] {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];
    const files: string[] = [];

    const walk = (currentDir: string) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (imageExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    walk(dir);
    return files;
  }

  /**
   * Get metadata from filename (if follows convention)
   */
  private getMetadataFromFilename(filePath: string): ImageMetadata {
    const fileName = path.basename(filePath, path.extname(filePath));

    // Try to parse convention: {component}_{page-type}_{page-slug}_{variant}
    const parts = fileName.split("_");

    if (parts.length >= 4) {
      return {
        component: parts[0],
        pageType: parts[1],
        pageSlug: parts[2],
        variant: parts[3],
      };
    }

    // Fallback to generic metadata
    return {
      component: "image",
      pageType: "general",
      pageSlug: "default",
      variant: "01",
    };
  }

  /**
   * Get metadata interactively (prompt user)
   */
  private async getMetadataInteractive(_filePath: string): Promise<ImageMetadata> {
    // TODO: Implement interactive prompts using readline or prompts library
    // For now, use default values
    return {
      component: "hero",
      pageType: "service",
      pageSlug: "default",
      variant: "01",
    };
  }

  /**
   * Generate R2 key (path in bucket)
   */
  private generateR2Key(
    siteSlug: string,
    metadata: ImageMetadata,
    format: string,
    suffix: string
  ): string {
    // Format: {site-slug}/{component}/{page-type}/{page-slug}_{variant}{suffix}.{ext}
    // Example: joes-plumbing-canterbury/hero/service/emergency-plumbing_01.webp
    //          joes-plumbing-canterbury/hero/service/emergency-plumbing_01-640w.webp

    const fileName = `${metadata.pageSlug}_${metadata.variant}${suffix}.${format}`;
    return `${siteSlug}/${metadata.component}/${metadata.pageType}/${fileName}`;
  }

  /**
   * Print summary statistics
   */
  private printSummary(): void {
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total images:     ${this.stats.total}`);
    console.log(`Processed:        ${this.stats.processed}`);
    console.log(`Failed:           ${this.stats.failed}`);
    console.log(`Uploaded:         ${this.stats.uploaded} variant(s)`);
    console.log(`Original size:    ${formatBytes(this.stats.totalOriginalSize)}`);
    console.log(`Processed size:   ${formatBytes(this.stats.totalProcessedSize)}`);

    if (this.stats.totalOriginalSize > 0) {
      const savings =
        ((this.stats.totalOriginalSize - this.stats.totalProcessedSize) /
          this.stats.totalOriginalSize) *
        100;
      console.log(`Total savings:    ${savings.toFixed(1)}%`);
    }

    console.log("=".repeat(60));

    if (this.stats.failed > 0) {
      console.log(`\n⚠️  ${this.stats.failed} image(s) failed to process`);
    }

    if (this.stats.processed > 0) {
      console.log("\n✅ Image intake complete!");
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  if (args.length < 2) {
    console.log("Usage: pnpm images:intake <site-slug> <source-directory> [options]");
    console.log("\nOptions:");
    console.log("  --dry-run          Process images but don't upload");
    console.log("  --skip-webp        Skip WebP generation");
    console.log("  --skip-avif        Skip AVIF generation (default)");
    console.log("  --quality <1-100>  JPEG/WebP quality (default: 85)");
    console.log("  --interactive      Prompt for metadata");
    console.log("\nExample:");
    console.log("  pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/");
    process.exit(1);
  }

  const options: IntakeOptions = {
    siteSlug: args[0],
    sourceDir: path.resolve(args[1]),
    dryRun: args.includes("--dry-run"),
    skipWebP: args.includes("--skip-webp"),
    skipAVIF: !args.includes("--enable-avif"), // AVIF disabled by default (slow)
    interactive: args.includes("--interactive"),
  };

  // Parse quality option
  const qualityIndex = args.indexOf("--quality");
  if (qualityIndex !== -1 && args[qualityIndex + 1]) {
    options.quality = parseInt(args[qualityIndex + 1]);
  }

  // Run intake tool
  const tool = new ImageIntakeTool();
  await tool.run(options);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("\n❌ Fatal error:", error.message);
    process.exit(1);
  });
}

export { ImageIntakeTool, IntakeOptions };
