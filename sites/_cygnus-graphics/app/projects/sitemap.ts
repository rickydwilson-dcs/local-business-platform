import type { MetadataRoute } from "next";
import { listSlugs, getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";
import { siteConfig } from "@/site.config";

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs("projects");

  const indexEntry = {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const projectEntries = await Promise.all(
    slugs.map(async (slug) => {
      const heroImage = await getPageImage("projects", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(imageUrl && { images: [imageUrl] }),
      };
    })
  );

  return [indexEntry, ...projectEntries];
}
