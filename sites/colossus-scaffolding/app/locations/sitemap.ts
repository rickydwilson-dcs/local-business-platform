import type { MetadataRoute } from "next";
import { listSlugs, getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locationSlugs = await listSlugs("locations");

  // Locations index page
  const indexEntry = {
    url: `${BASE_URL}/locations`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  };

  // Individual location pages with images
  const locationEntries = await Promise.all(
    locationSlugs.map(async (slug) => {
      const heroImage = await getPageImage("locations", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/locations/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        ...(imageUrl && {
          images: [imageUrl],
        }),
      };
    })
  );

  return [indexEntry, ...locationEntries];
}
