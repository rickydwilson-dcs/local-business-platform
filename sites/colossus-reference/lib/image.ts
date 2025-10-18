/**
 * Image URL utilities for R2 integration
 */

/**
 * Get the full R2 URL for an image path
 * @param path - The R2 path (e.g., "colossus-reference/hero/home/main_01.webp")
 * @returns The full R2 URL or a local fallback path
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
