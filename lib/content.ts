// lib/content.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getServiceData } from "./services-data";
import { getAllLocations } from "./locations";

export type ContentType = "services" | "locations";

export type ContentItem = {
  slug: string;
  title: string;
  description?: string;
  [key: string]: unknown;
};

export async function getContentItems(contentType: ContentType): Promise<ContentItem[]> {
  if (contentType === "locations") {
    // For locations, use the centralized location data
    return getAllLocations().map(location => ({
      ...location,
      // Ensure these properties override any duplicates from spread
      slug: location.slug,
      title: location.title,
      description: location.description
    }));
  }

  const dir = path.join(process.cwd(), "content", contentType);
  
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const items: ContentItem[] = [];
  
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;
    
    const slug = file.replace(/\.mdx$/i, "");
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    const title = (typeof data.title === "string" && data.title.trim()) ||
      slug.split("-").map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");

    // For services, merge with service data
    const serviceData = contentType === "services" ? getServiceData(slug) : {};

    items.push({
      slug,
      title,
      description: serviceData.description || (typeof data.description === "string" ? data.description.trim() : undefined),
      badge: serviceData.badge,
      image: serviceData.image,
      features: serviceData.features,
      ...data,
      ...serviceData,
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getContentItem(contentType: ContentType, slug: string): Promise<{
  frontmatter: ContentItem;
  content: string;
}> {
  const filePath = path.join(process.cwd(), "content", contentType, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  
  const title = (typeof data.title === "string" && data.title.trim()) ||
    slug.split("-").map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
  
  return {
    frontmatter: {
      slug,
      title,
      description: typeof data.description === "string" ? data.description.trim() : undefined,
      ...data,
    },
    content,
  };
}

export async function generateContentParams(contentType: ContentType) {
  const items = await getContentItems(contentType);
  return items.map(({ slug }) => ({ slug }));
}