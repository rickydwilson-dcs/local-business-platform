import type { MetadataRoute } from "next";
import { listSlugs, getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await listSlugs("projects");

  // Projects index page
  const indexEntry = {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  // Individual project pages with images
  const projectEntries = await Promise.all(
    projectSlugs.map(async (slug) => {
      const heroImage = await getPageImage("projects", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(imageUrl && {
          images: [imageUrl],
        }),
      };
    })
  );

  return [indexEntry, ...projectEntries];
}
