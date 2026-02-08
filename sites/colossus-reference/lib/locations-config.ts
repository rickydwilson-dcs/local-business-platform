import fs from "fs/promises";
import path from "path";

// Cache for location slugs (populated once per build)
let cachedLocationSlugs: string[] | null = null;

/**
 * Dynamically discover location slugs from MDX files
 * Results are cached for the duration of the build
 */
export async function getLocationSlugs(): Promise<string[]> {
  if (cachedLocationSlugs) {
    return cachedLocationSlugs;
  }

  const dir = path.join(process.cwd(), "content", "locations");
  try {
    const files = await fs.readdir(dir);
    cachedLocationSlugs = files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/i, ""));
    return cachedLocationSlugs;
  } catch {
    // Graceful fallback if directory doesn't exist
    return [];
  }
}

/**
 * Check if a service slug ends with a location suffix
 * Used to filter location-specific services from main listing
 */
export async function hasLocationSuffix(slug: string): Promise<boolean> {
  const locationSlugs = await getLocationSlugs();
  return locationSlugs.some((loc) => slug.endsWith(`-${loc}`));
}
