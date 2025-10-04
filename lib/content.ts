// lib/content.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getServiceData } from "./services-data";

export type ContentType = "services" | "locations";

export type ContentItem = {
  slug: string;
  title: string;
  description?: string;
  [key: string]: unknown;
};

export async function getContentItems(contentType: ContentType): Promise<ContentItem[]> {
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

    // Skip location-specific service files on main services page
    if (
      contentType === "services" &&
      (slug.includes("-brighton") ||
        slug.includes("-canterbury") ||
        slug.includes("-hastings") ||
        slug.includes("-ashford") ||
        slug.includes("-maidstone") ||
        slug.includes("-folkestone") ||
        slug.includes("-dover") ||
        slug.includes("-tunbridge-wells") ||
        slug.includes("-sevenoaks") ||
        slug.includes("-dartford") ||
        slug.includes("-gravesend") ||
        slug.includes("-medway") ||
        slug.includes("-crawley") ||
        slug.includes("-horsham") ||
        slug.includes("-worthing") ||
        slug.includes("-chichester") ||
        slug.includes("-bognor-regis") ||
        slug.includes("-littlehampton") ||
        slug.includes("-east-grinstead") ||
        slug.includes("-haywards-heath") ||
        slug.includes("-burgess-hill") ||
        slug.includes("-lewes") ||
        slug.includes("-newhaven") ||
        slug.includes("-seaford") ||
        slug.includes("-eastbourne") ||
        slug.includes("-hailsham") ||
        slug.includes("-uckfield") ||
        slug.includes("-heathfield") ||
        slug.includes("-battle") ||
        slug.includes("-rye") ||
        slug.includes("-crowborough") ||
        slug.includes("-wadhurst") ||
        slug.includes("-ticehurst") ||
        slug.includes("-robertsbridge") ||
        slug.includes("-winchelsea") ||
        slug.includes("-guildford") ||
        slug.includes("-woking") ||
        slug.includes("-farnham") ||
        slug.includes("-camberley") ||
        slug.includes("-staines") ||
        slug.includes("-epsom") ||
        slug.includes("-leatherhead") ||
        slug.includes("-dorking") ||
        slug.includes("-redhill") ||
        slug.includes("-reigate") ||
        slug.includes("-banstead") ||
        slug.includes("-caterham") ||
        slug.includes("-oxted") ||
        slug.includes("-warlingham") ||
        slug.includes("-godstone"))
    ) {
      continue;
    }

    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    const title =
      (typeof data.title === "string" && data.title.trim()) ||
      slug
        .split("-")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");

    // For services, merge with service data
    const serviceData = contentType === "services" ? getServiceData(slug) : {};

    items.push({
      slug,
      title,
      description:
        serviceData.description ||
        (typeof data.description === "string" ? data.description.trim() : undefined),
      badge: serviceData.badge,
      image: serviceData.image,
      features: serviceData.features,
      ...data,
      ...serviceData,
    });
  }

  // For services, sort with main categories first
  if (contentType === "services") {
    const mainCategories = [
      "Commercial Scaffolding",
      "Residential Scaffolding",
      "Industrial Scaffolding",
    ];

    return items.sort((a, b) => {
      const aIsMain = mainCategories.includes(a.title);
      const bIsMain = mainCategories.includes(b.title);

      if (aIsMain && !bIsMain) return -1;
      if (!aIsMain && bIsMain) return 1;
      if (aIsMain && bIsMain) {
        return mainCategories.indexOf(a.title) - mainCategories.indexOf(b.title);
      }

      return a.title.localeCompare(b.title);
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getContentItem(
  contentType: ContentType,
  slug: string
): Promise<{
  frontmatter: ContentItem;
  content: string;
}> {
  const filePath = path.join(process.cwd(), "content", contentType, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);

  const title =
    (typeof data.title === "string" && data.title.trim()) ||
    slug
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");

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
