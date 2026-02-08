/**
 * Image URL utilities for R2 integration
 */

/**
 * Get the full R2 URL for an image path
 * @param path - The R2 path (e.g., "site-name/hero/home/main_01.webp") or full URL
 * @returns The full R2 URL or the original URL if already complete
 */
export function getImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  // If path already starts with http/https, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If R2 URL is not configured, check if we're in development
  if (!baseUrl) {
    // In development, fallback to a placeholder or warn
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `NEXT_PUBLIC_R2_PUBLIC_URL is not set. Add it to .env.local:\nNEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev`
      );
      // Return a placeholder that won't break Next.js Image
      return `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent("R2 URL Not Configured")}`;
    }
    // In production, this should never happen but provide a fallback
    console.error("NEXT_PUBLIC_R2_PUBLIC_URL is not set in production!");
    return `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent("Image Missing")}`;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Construct full URL
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Generate SEO-optimized alt text for images
 * @param serviceName - The name of the service (e.g., "Emergency Plumbing")
 * @param locationName - Optional location name for geographic context
 * @param customAlt - Optional custom alt text that overrides auto-generation
 * @param brandName - Optional brand name suffix (default: "Professional Services")
 * @returns SEO-optimized alt text string
 */
export function generateImageAlt(
  serviceName: string,
  locationName?: string,
  customAlt?: string,
  brandName: string = "Professional Services"
): string {
  // Allow MDX override for custom descriptions
  if (customAlt) {
    return customAlt;
  }

  // Auto-generate with location context when available
  if (locationName) {
    return `${serviceName} in ${locationName} - ${brandName}`;
  }

  // Fallback to service name only
  return `${serviceName} - ${brandName}`;
}

/**
 * Generate SEO-optimized title attribute for images
 * @param serviceName - The name of the service (e.g., "Emergency Plumbing")
 * @param locationName - Optional location name for geographic context
 * @param customTitle - Optional custom title that overrides auto-generation
 * @param brandName - Optional brand name suffix (default: "Professional Services")
 * @returns SEO-optimized title string
 */
export function generateImageTitle(
  serviceName: string,
  locationName?: string,
  customTitle?: string,
  brandName: string = "Professional Services"
): string {
  if (customTitle) {
    return customTitle;
  }

  if (locationName) {
    return `Professional ${serviceName.toLowerCase()} services in ${locationName} by ${brandName}`;
  }

  return `Professional ${serviceName.toLowerCase()} services by ${brandName}`;
}

/**
 * Get responsive image sizes string for Next.js Image component
 * @param layout - The layout type: 'full', 'half', 'third', 'card'
 * @returns Responsive sizes string for the sizes prop
 */
export function getImageSizes(layout: "full" | "half" | "third" | "card"): string {
  const sizeMap = {
    full: "100vw",
    half: "(max-width: 768px) 100vw, 50vw",
    third: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  };

  return sizeMap[layout];
}

/**
 * Check if a path is a valid image URL or R2 path
 * @param path - The path to validate
 * @returns True if the path appears to be a valid image reference
 */
export function isValidImagePath(path: string | undefined | null): path is string {
  if (!path || typeof path !== "string") {
    return false;
  }

  // Check if it's a URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return true;
  }

  // Check if it has an image extension
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
}
