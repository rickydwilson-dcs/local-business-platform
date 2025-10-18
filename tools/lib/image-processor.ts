/**
 * Image Processing Pipeline
 *
 * Uses Sharp to optimize, resize, and convert images for web delivery.
 * Generates multiple formats (WebP, AVIF) and responsive sizes.
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

export interface ImageProcessingOptions {
  /** Generate WebP version (recommended) */
  generateWebP?: boolean;
  /** Generate AVIF version (better compression, slower) */
  generateAVIF?: boolean;
  /** Quality for lossy formats (1-100) */
  quality?: number;
  /** Maximum width for resizing (maintains aspect ratio) */
  maxWidth?: number;
  /** Maximum height for resizing (maintains aspect ratio) */
  maxHeight?: number;
  /** Generate responsive sizes */
  responsive?: boolean;
  /** Responsive breakpoints in pixels */
  responsiveSizes?: number[];
}

export interface ProcessedImage {
  format: string;
  width: number;
  height: number;
  size: number;
  buffer: Buffer;
  suffix: string; // e.g., '', '-640w', '-1280w'
}

export interface ProcessingResult {
  original: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  processed: ProcessedImage[];
  totalSavings: number; // Percentage saved
}

/**
 * Image Processor using Sharp
 */
export class ImageProcessor {
  private defaultOptions: ImageProcessingOptions = {
    generateWebP: true,
    generateAVIF: false, // Slower, enable when needed
    quality: 85,
    maxWidth: 2000,
    maxHeight: 2000,
    responsive: true,
    responsiveSizes: [640, 1280, 1920], // Mobile, tablet, desktop
  };

  /**
   * Process a single image file
   */
  async processImage(
    inputPath: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessingResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Read and analyze original image
    const inputBuffer = fs.readFileSync(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const originalSize = inputBuffer.length;
    const processed: ProcessedImage[] = [];

    // Calculate target dimensions (maintain aspect ratio)
    const targetWidth = Math.min(metadata.width || 2000, opts.maxWidth || 2000);
    const targetHeight = Math.min(metadata.height || 2000, opts.maxHeight || 2000);

    // Process original format (optimized)
    const originalFormat = metadata.format || "jpeg";
    const optimizedOriginal = await this.optimizeImage(
      image,
      originalFormat,
      targetWidth,
      targetHeight,
      opts.quality || 85
    );

    processed.push({
      format: originalFormat,
      width: optimizedOriginal.info.width,
      height: optimizedOriginal.info.height,
      size: optimizedOriginal.data.length,
      buffer: optimizedOriginal.data,
      suffix: "",
    });

    // Generate WebP version
    if (opts.generateWebP) {
      const webp = await this.optimizeImage(
        sharp(inputBuffer),
        "webp",
        targetWidth,
        targetHeight,
        opts.quality || 85
      );

      processed.push({
        format: "webp",
        width: webp.info.width,
        height: webp.info.height,
        size: webp.data.length,
        buffer: webp.data,
        suffix: "",
      });
    }

    // Generate AVIF version (optional, slower)
    if (opts.generateAVIF) {
      const avif = await this.optimizeImage(
        sharp(inputBuffer),
        "avif",
        targetWidth,
        targetHeight,
        opts.quality || 85
      );

      processed.push({
        format: "avif",
        width: avif.info.width,
        height: avif.info.height,
        size: avif.data.length,
        buffer: avif.data,
        suffix: "",
      });
    }

    // Generate responsive sizes (only for main format)
    if (opts.responsive && opts.responsiveSizes) {
      for (const size of opts.responsiveSizes) {
        // Skip if smaller than original
        if (size >= targetWidth) continue;

        // Original format
        const resized = await this.optimizeImage(
          sharp(inputBuffer),
          originalFormat,
          size,
          undefined,
          opts.quality || 85
        );

        processed.push({
          format: originalFormat,
          width: resized.info.width,
          height: resized.info.height,
          size: resized.data.length,
          buffer: resized.data,
          suffix: `-${size}w`,
        });

        // WebP version
        if (opts.generateWebP) {
          const resizedWebP = await this.optimizeImage(
            sharp(inputBuffer),
            "webp",
            size,
            undefined,
            opts.quality || 85
          );

          processed.push({
            format: "webp",
            width: resizedWebP.info.width,
            height: resizedWebP.info.height,
            size: resizedWebP.data.length,
            buffer: resizedWebP.data,
            suffix: `-${size}w`,
          });
        }
      }
    }

    // Calculate total savings
    const totalProcessedSize = processed.reduce((sum, img) => sum + img.size, 0);
    const totalSavings = ((originalSize - totalProcessedSize) / originalSize) * 100;

    return {
      original: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: originalFormat,
        size: originalSize,
      },
      processed,
      totalSavings: Math.max(0, totalSavings),
    };
  }

  /**
   * Optimize and convert image
   */
  private async optimizeImage(
    image: sharp.Sharp,
    format: string,
    width?: number,
    height?: number,
    quality: number = 85
  ): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
    let pipeline = image.clone();

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: "inside", // Maintain aspect ratio
        withoutEnlargement: true, // Don't upscale
      });
    }

    // Convert to target format with optimization
    switch (format) {
      case "jpeg":
      case "jpg":
        pipeline = pipeline.jpeg({
          quality,
          progressive: true,
          mozjpeg: true, // Better compression
        });
        break;

      case "webp":
        pipeline = pipeline.webp({
          quality,
          effort: 4, // Balance between speed and compression (0-6)
        });
        break;

      case "avif":
        pipeline = pipeline.avif({
          quality,
          effort: 4, // Balance between speed and compression (0-9)
        });
        break;

      case "png":
        pipeline = pipeline.png({
          quality,
          compressionLevel: 9,
          progressive: true,
        });
        break;

      default:
        // Keep original format
        break;
    }

    // Execute pipeline
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    return { data, info };
  }

  /**
   * Validate image file
   */
  async validateImage(filePath: string): Promise<{
    valid: boolean;
    error?: string;
    metadata?: sharp.Metadata;
  }> {
    try {
      const buffer = fs.readFileSync(filePath);
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Check if it's a valid image format
      const validFormats = ["jpeg", "png", "webp", "gif", "avif", "svg"];
      if (!metadata.format || !validFormats.includes(metadata.format)) {
        return {
          valid: false,
          error: `Unsupported format: ${metadata.format}`,
        };
      }

      // Check dimensions
      if (!metadata.width || !metadata.height) {
        return {
          valid: false,
          error: "Could not determine image dimensions",
        };
      }

      // Check minimum dimensions (optional)
      const minDimension = 100;
      if (metadata.width < minDimension || metadata.height < minDimension) {
        return {
          valid: false,
          error: `Image too small (minimum ${minDimension}px)`,
        };
      }

      // Check file size (optional, max 20MB)
      const maxSizeBytes = 20 * 1024 * 1024;
      if (buffer.length > maxSizeBytes) {
        return {
          valid: false,
          error: `Image too large (maximum 20MB)`,
        };
      }

      return {
        valid: true,
        metadata,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get image information without processing
   */
  async getImageInfo(filePath: string): Promise<sharp.Metadata | null> {
    try {
      const buffer = fs.readFileSync(filePath);
      const image = sharp(buffer);
      return await image.metadata();
    } catch {
      return null;
    }
  }

  /**
   * Convert processed images to files (for testing)
   */
  async saveProcessedImages(
    processed: ProcessedImage[],
    outputDir: string,
    baseName: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const image of processed) {
      const fileName = `${baseName}${image.suffix}.${image.format}`;
      const outputPath = path.join(outputDir, fileName);
      fs.writeFileSync(outputPath, image.buffer);
    }
  }
}

/**
 * Create a singleton image processor instance
 */
let processorInstance: ImageProcessor | null = null;

export function getImageProcessor(): ImageProcessor {
  if (!processorInstance) {
    processorInstance = new ImageProcessor();
  }
  return processorInstance;
}

/**
 * Utility: Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
