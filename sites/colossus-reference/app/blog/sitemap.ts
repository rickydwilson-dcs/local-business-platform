import type { MetadataRoute } from "next";
import { listSlugs, getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await listSlugs("blog");

  // Blog index page
  const indexEntry = {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  // Individual blog post pages with images
  const blogEntries = await Promise.all(
    blogSlugs.map(async (slug) => {
      const heroImage = await getPageImage("blog", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(imageUrl && {
          images: [imageUrl],
        }),
      };
    })
  );

  return [indexEntry, ...blogEntries];
}
