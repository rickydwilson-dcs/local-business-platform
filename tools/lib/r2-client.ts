/**
 * Cloudflare R2 Client
 *
 * S3-compatible client for uploading images to Cloudflare R2.
 * R2 provides global CDN, automatic optimization, and cost-effective storage.
 */

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl?: string;
}

export interface UploadOptions {
  /** Content type (e.g., image/jpeg, image/webp) */
  contentType?: string;
  /** Cache control header (default: 1 year) */
  cacheControl?: string;
  /** Additional metadata */
  metadata?: Record<string, string>;
}

export interface UploadResult {
  success: boolean;
  key: string;
  url: string;
  size: number;
  error?: string;
}

/**
 * R2 Client for image uploads
 */
export class R2Client {
  private client: S3Client;
  private config: R2Config;

  constructor(config?: Partial<R2Config>) {
    // Load config from environment variables with optional overrides
    this.config = {
      accountId: config?.accountId || process.env.R2_ACCOUNT_ID || "",
      accessKeyId: config?.accessKeyId || process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: config?.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY || "",
      bucketName: config?.bucketName || process.env.R2_BUCKET_NAME || "local-business-platform",
      publicUrl: config?.publicUrl || process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    };

    // Validate required config
    if (!this.config.accountId) {
      throw new Error("R2_ACCOUNT_ID is required");
    }
    if (!this.config.accessKeyId) {
      throw new Error("R2_ACCESS_KEY_ID is required");
    }
    if (!this.config.secretAccessKey) {
      throw new Error("R2_SECRET_ACCESS_KEY is required");
    }

    // Initialize S3 client for R2
    this.client = new S3Client({
      region: "auto", // R2 uses 'auto' region
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to R2
   */
  async uploadFile(
    filePath: string,
    key: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = fs.statSync(filePath).size;

      // Determine content type from extension if not provided
      const contentType = options.contentType || this.getContentType(filePath);

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: options.cacheControl || "public, max-age=31536000, immutable", // 1 year
        Metadata: options.metadata,
      });

      await this.client.send(command);

      // Generate public URL
      const url = this.getPublicUrl(key);

      return {
        success: true,
        key,
        url,
        size: fileSize,
      };
    } catch (error) {
      return {
        success: false,
        key,
        url: "",
        size: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Upload a buffer to R2
   */
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: buffer,
        ContentType: options.contentType || "application/octet-stream",
        CacheControl: options.cacheControl || "public, max-age=31536000, immutable",
        Metadata: options.metadata,
      });

      await this.client.send(command);

      const url = this.getPublicUrl(key);

      return {
        success: true,
        key,
        url,
        size: buffer.length,
      };
    } catch (error) {
      return {
        success: false,
        key,
        url: "",
        size: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Check if a file exists in R2
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List files in R2 with optional prefix
   */
  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: prefix,
      });
      const response = await this.client.send(command);
      return response.Contents?.map((obj) => obj.Key || "") || [];
    } catch {
      return [];
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${key}`;
    }
    // Default R2 public URL (requires public bucket or custom domain)
    return `https://pub-${this.config.accountId}.r2.dev/${key}`;
  }

  /**
   * Determine content type from file extension
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".avif": "image/avif",
      ".svg": "image/svg+xml",
    };
    return contentTypes[ext] || "application/octet-stream";
  }

  /**
   * Get bucket name
   */
  getBucketName(): string {
    return this.config.bucketName;
  }
}

/**
 * Create a singleton R2 client instance
 */
let r2ClientInstance: R2Client | null = null;

export function getR2Client(config?: Partial<R2Config>): R2Client {
  if (!r2ClientInstance) {
    r2ClientInstance = new R2Client(config);
  }
  return r2ClientInstance;
}
