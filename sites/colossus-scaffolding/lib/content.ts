// lib/content.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getLocationSlugs } from "./locations-config";
import type {
  BlogFrontmatter,
  ProjectFrontmatter,
  TestimonialFrontmatter,
  BlogCategoryType,
} from "@platform/core-components";

export type ContentType = "services" | "locations" | "blog" | "projects" | "testimonials";

export type ContentItem = {
  slug: string;
  title: string;
  description?: string;
  badge?: string;
  features?: string[];
  subtitle?: string[];
  image?: string;
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

  // Get location slugs for filtering location-specific services
  const locationSlugs = contentType === "services" ? await getLocationSlugs() : [];

  const items: ContentItem[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;

    const slug = file.replace(/\.mdx$/i, "");

    // Skip location-specific service files on main services page
    if (contentType === "services" && locationSlugs.some((loc) => slug.includes(`-${loc}`))) {
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

    // Extract service card display fields from MDX frontmatter
    // (migrated from services-data.ts to comply with MDX-only architecture)
    const badge = typeof data.badge === "string" ? data.badge : undefined;
    const features = Array.isArray(data.features) ? data.features : undefined;
    const subtitle = Array.isArray(data.subtitle) ? data.subtitle : undefined;

    // Get hero image from frontmatter
    const heroImage = data.hero?.image || data.heroImage;

    items.push({
      slug,
      title,
      description: typeof data.description === "string" ? data.description.trim() : undefined,
      badge,
      features,
      subtitle,
      image: heroImage,
      ...data,
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

// ============================================================================
// Blog Content Utilities
// ============================================================================

export type BlogPost = BlogFrontmatter & {
  slug: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), "content", "blog");

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;

    const slug = file.replace(/\.mdx$/i, "");
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    posts.push({
      slug,
      ...(data as BlogFrontmatter),
    });
  }

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(
  slug: string
): Promise<{ frontmatter: BlogPost; content: string } | null> {
  const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      frontmatter: {
        slug,
        ...(data as BlogFrontmatter),
      },
      content,
    };
  } catch {
    return null;
  }
}

export async function getBlogPostsByCategory(category: BlogCategoryType): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.category === category);
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const featured = posts.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, limit) : posts.slice(0, limit);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ============================================================================
// Projects Content Utilities
// ============================================================================

export type Project = ProjectFrontmatter & {
  slug: string;
};

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(process.cwd(), "content", "projects");

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const projects: Project[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;

    const slug = file.replace(/\.mdx$/i, "");
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    projects.push({
      slug,
      ...(data as ProjectFrontmatter),
    });
  }

  // Sort by completion date descending (newest first)
  return projects.sort(
    (a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
  );
}

export async function getProject(
  slug: string
): Promise<{ frontmatter: Project; content: string } | null> {
  const filePath = path.join(process.cwd(), "content", "projects", `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      frontmatter: {
        slug,
        ...(data as ProjectFrontmatter),
      },
      content,
    };
  } catch {
    return null;
  }
}

export async function getProjectsByService(serviceSlug: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.services.includes(serviceSlug));
}

export async function getProjectsByLocation(locationSlug: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.location === locationSlug);
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.status === "featured");
  return featured.length > 0 ? featured.slice(0, limit) : projects.slice(0, limit);
}

// ============================================================================
// Testimonials Content Utilities
// ============================================================================

export type Testimonial = TestimonialFrontmatter & {
  slug: string;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const dir = path.join(process.cwd(), "content", "testimonials");

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const testimonials: Testimonial[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;

    const slug = file.replace(/\.mdx$/i, "");
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    testimonials.push({
      slug,
      ...(data as TestimonialFrontmatter),
    });
  }

  // Sort by date descending (newest first)
  return testimonials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTestimonial(
  slug: string
): Promise<{ frontmatter: Testimonial; content: string } | null> {
  const filePath = path.join(process.cwd(), "content", "testimonials", `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      frontmatter: {
        slug,
        ...(data as TestimonialFrontmatter),
      },
      content,
    };
  } catch {
    return null;
  }
}

export async function getTestimonialsByService(serviceSlug: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((t) => t.serviceSlug === serviceSlug);
}

export async function getTestimonialsByLocation(locationSlug: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((t) => t.locationSlug === locationSlug);
}

export async function getFeaturedTestimonials(limit = 5): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter((t) => t.featured);
  return featured.length > 0 ? featured.slice(0, limit) : testimonials.slice(0, limit);
}

export function calculateAggregateRating(testimonials: Testimonial[]): {
  average: number;
  count: number;
} {
  if (testimonials.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return {
    average: Math.round((total / testimonials.length) * 10) / 10,
    count: testimonials.length,
  };
}
