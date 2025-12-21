import type { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";
import { getPageImage } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colossus-scaffolding.vercel.app";
const SERVICES_DIR = path.join(process.cwd(), "content", "services");

/**
 * List all service slugs, including nested location-specific services
 * Returns: ['access-scaffolding', 'commercial-scaffolding/brighton', ...]
 */
async function listAllServiceSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  const entries = await fs.readdir(SERVICES_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      // Flat service: access-scaffolding.mdx -> access-scaffolding
      slugs.push(entry.name.replace(/\.mdx$/, ""));
    } else if (entry.isDirectory()) {
      // Nested service folder: commercial-scaffolding/
      const subDir = path.join(SERVICES_DIR, entry.name);
      const subEntries = await fs.readdir(subDir);
      for (const subEntry of subEntries) {
        if (subEntry.endsWith(".mdx")) {
          // Nested service: commercial-scaffolding/brighton.mdx -> commercial-scaffolding/brighton
          slugs.push(`${entry.name}/${subEntry.replace(/\.mdx$/, "")}`);
        }
      }
    }
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = await listAllServiceSlugs();

  // Services index page
  const indexEntry = {
    url: `${BASE_URL}/services`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  };

  // Individual service pages with images
  const serviceEntries = await Promise.all(
    serviceSlugs.map(async (slug) => {
      const heroImage = await getPageImage("services", slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: slug.includes("/") ? 0.7 : 0.8, // Lower priority for location-specific
        ...(imageUrl && {
          images: [imageUrl],
        }),
      };
    })
  );

  return [indexEntry, ...serviceEntries];
}
