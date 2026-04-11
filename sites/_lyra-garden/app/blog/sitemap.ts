import type { MetadataRoute } from "next";
import { listSlugs, getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";
import { siteConfig } from "@/site.config";

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs("blog");

  const indexEntry = {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const blogEntries = await Promise.all(
    slugs.map(async (slug) => {
      const heroImage = await getPageImage("blog", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(imageUrl && { images: [imageUrl] }),
      };
    })
  );

  return [indexEntry, ...blogEntries];
}
