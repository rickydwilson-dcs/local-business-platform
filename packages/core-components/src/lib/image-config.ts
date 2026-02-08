/**
 * Image optimization configuration
 *
 * This file contains image optimization settings that can be used
 * across the application to ensure consistent image quality and performance.
 *
 * Next.js 15 automatically handles:
 * - WebP and AVIF format conversion for supported browsers
 * - Responsive image sizing based on deviceSizes and imageSizes
 * - Lazy loading and progressive loading
 */

// Default image quality for optimization (reduced from 75 to 65 to 58 for ~20% total compression)
export const DEFAULT_IMAGE_QUALITY = 58;

// High quality setting for hero images and critical visuals (reduced from 80 to 72)
export const HIGH_QUALITY = 72;

// Low quality setting for thumbnails and non-critical images (reduced from 50 to 45)
export const LOW_QUALITY = 45;

// Common image sizes used throughout the application
export const IMAGE_SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200,
  hero: 1920,
} as const;

// Default props for Next.js Image components
export const defaultImageProps = {
  quality: DEFAULT_IMAGE_QUALITY,
  placeholder: "blur" as const,
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
};

// Image optimization utilities
export const getImageQuality = (type: "hero" | "content" | "thumbnail" = "content"): number => {
  switch (type) {
    case "hero":
      return HIGH_QUALITY;
    case "thumbnail":
      return LOW_QUALITY;
    case "content":
    default:
      return DEFAULT_IMAGE_QUALITY;
  }
};

// Scaffolding business specific image configurations
export const scaffoldingImageConfig = {
  // Project photos and gallery images
  project: {
    quality: DEFAULT_IMAGE_QUALITY,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  },

  // Hero images for pages
  hero: {
    quality: HIGH_QUALITY,
    sizes: "100vw",
    priority: true,
  },

  // Service showcase images
  service: {
    quality: DEFAULT_IMAGE_QUALITY,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
  },

  // Team member photos and testimonials
  team: {
    quality: DEFAULT_IMAGE_QUALITY,
    sizes: "(max-width: 768px) 100vw, 300px",
  },
} as const;
