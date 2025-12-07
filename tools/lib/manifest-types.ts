/**
 * Image Manifest Types
 * Shared types for the AI image generation pipeline
 */

/** Status of an image in the generation pipeline */
export type ImageStatus = "pending" | "generated" | "uploaded" | "complete" | "error";

/** Type of card the image is for */
export type CardType = "specialist-card" | "service-card";

/** Image dimensions in pixels */
export interface ImageDimensions {
  width: number;
  height: number;
}

/** Single image entry in the manifest */
export interface ImageEntry {
  /** Unique identifier: e.g., "loc-battle-specialist-battle-abbey-heritage" */
  id: string;

  /** Card type: specialist-card or service-card */
  type: CardType;

  /** Location name from MDX: e.g., "Battle" */
  location: string;

  /** Location slug for file paths: e.g., "battle" */
  locationSlug: string;

  /** Card title from MDX: e.g., "Battle Abbey Heritage" */
  cardTitle: string;

  /** Card description from MDX */
  cardDescription: string;

  /** R2 storage key: e.g., "colossus-reference/cards/locations/battle/specialist-battle-abbey-heritage.webp" */
  r2Key: string;

  /** Image dimensions */
  dimensions: ImageDimensions;

  /** AI prompt for image generation */
  prompt: string;

  /** Current status in pipeline */
  status: ImageStatus;

  /** Error message if status is "error" */
  error?: string;

  /** Timestamp of last status update */
  updatedAt?: string;
}

/** Complete manifest file structure */
export interface ImageManifest {
  /** ISO timestamp of manifest generation */
  generated: string;

  /** Version for future compatibility */
  version: string;

  /** Total number of images in manifest */
  totalImages: number;

  /** Counts by status */
  statusCounts: Record<ImageStatus, number>;

  /** All image entries */
  images: ImageEntry[];
}

/** Helper type for manifest file operations */
export interface ManifestUpdateResult {
  success: boolean;
  updated: number;
  errors: string[];
}
