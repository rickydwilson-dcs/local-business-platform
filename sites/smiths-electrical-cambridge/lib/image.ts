/**
 * Image URL Utilities
 * ===================
 *
 * Utilities for handling image URLs with R2/CDN integration.
 * Supports both external URLs and R2 bucket paths.
 *
 * CUSTOMIZATION:
 * - Set NEXT_PUBLIC_R2_PUBLIC_URL in .env.local
 * - Update generateImageAlt/Title for your business name
 */

/**
 * Get the full R2/CDN URL for an image path
 *
 * @param path - The R2 path (e.g., "site-name/hero/home/main_01.webp") or full URL
 * @returns The full R2 URL or the original URL if already complete
 *
 * @example
 * // With R2 configured
 * getImageUrl("site/hero.webp") // => "https://pub-xxx.r2.dev/site/hero.webp"
 *
 * // Already a full URL
 * getImageUrl("https://example.com/img.jpg") // => "https://example.com/img.jpg"
 */
export function getImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  // If path already starts with http/https, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If R2 URL is not configured, provide helpful fallback
  if (!baseUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `NEXT_PUBLIC_R2_PUBLIC_URL is not set. Add it to .env.local:\n` +
          `NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev`
      );
      // Return a placeholder that won't break Next.js Image
      return `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent('Configure R2 URL')}`;
    }
    // In production, this should never happen but provide a fallback
    console.error('NEXT_PUBLIC_R2_PUBLIC_URL is not set in production!');
    return `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent('Image Missing')}`;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Construct full URL
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Generate SEO-optimized alt text for images
 *
 * CUSTOMIZATION: Update the brand suffix in the fallback return
 *
 * @param subjectName - The primary subject (e.g., service name, product name)
 * @param locationName - Optional location for geographic context
 * @param customAlt - Optional custom alt text that overrides auto-generation
 * @returns SEO-optimized alt text string
 *
 * @example
 * generateImageAlt("Residential Scaffolding", "Brighton")
 * // => "Residential Scaffolding in Brighton - Your Business Name"
 */
export function generateImageAlt(
  subjectName: string,
  locationName?: string,
  customAlt?: string
): string {
  // Allow MDX override for custom descriptions
  if (customAlt) {
    return customAlt;
  }

  // Import business config for dynamic brand name
  // TODO: Replace with actual business name from config
  const brandName = 'Your Business';

  // Auto-generate with location context when available
  if (locationName) {
    return `${subjectName} in ${locationName} - ${brandName}`;
  }

  // Fallback to subject name only
  return `${subjectName} - ${brandName}`;
}

/**
 * Generate SEO-optimized title attribute for images
 *
 * CUSTOMIZATION: Update the brand suffix in the fallback return
 *
 * @param subjectName - The primary subject (e.g., service name, product name)
 * @param locationName - Optional location for geographic context
 * @param customTitle - Optional custom title that overrides auto-generation
 * @returns SEO-optimized title string
 *
 * @example
 * generateImageTitle("Residential Scaffolding", "Brighton")
 * // => "Professional residential scaffolding services in Brighton by Your Business Name"
 */
export function generateImageTitle(
  subjectName: string,
  locationName?: string,
  customTitle?: string
): string {
  if (customTitle) {
    return customTitle;
  }

  // TODO: Replace with actual business name from config
  const brandName = 'Your Business';

  if (locationName) {
    return `Professional ${subjectName.toLowerCase()} services in ${locationName} by ${brandName}`;
  }

  return `Professional ${subjectName.toLowerCase()} services by ${brandName}`;
}

/**
 * Get responsive image sizes string for Next.js Image component
 *
 * @param layout - The layout type: 'full', 'half', 'third', 'card'
 * @returns Responsive sizes string for the sizes prop
 *
 * @example
 * <Image sizes={getImageSizes('card')} ... />
 */
export function getImageSizes(layout: 'full' | 'half' | 'third' | 'card'): string {
  const sizeMap = {
    full: '100vw',
    half: '(max-width: 768px) 100vw, 50vw',
    third: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  };

  return sizeMap[layout];
}

/**
 * Check if a path is a valid image URL or R2 path
 *
 * @param path - The path to validate
 * @returns True if the path appears to be a valid image reference
 */
export function isValidImagePath(path: string | undefined | null): path is string {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Check if it's a URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return true;
  }

  // Check if it has an image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
}
