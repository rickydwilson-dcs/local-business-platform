/**
 * Content Utilities for Base Template
 * ====================================
 * Functions for reading and processing MDX content from the content/ directory.
 *
 * Content Types:
 * - Services: Business service offerings (content/services/)
 * - Locations: Geographic service areas (content/locations/)
 * - Blog: Articles and guides (content/blog/)
 * - Projects: Portfolio/case studies (content/projects/)
 * - Testimonials: Customer reviews (content/testimonials/)
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type {
  BlogFrontmatter,
  ProjectFrontmatter,
  TestimonialFrontmatter,
  BlogCategoryType,
  ProjectTypeValue,
} from '@platform/core-components';

// ============================================================================
// TYPES
// ============================================================================

/** Available content types in the content/ directory */
export type ContentType = 'services' | 'locations' | 'blog' | 'projects' | 'testimonials';

/** Generic content item returned from content reading functions */
export type ContentItem = {
  /** URL slug derived from filename */
  slug: string;
  /** Content title from frontmatter or derived from slug */
  title: string;
  /** Meta description */
  description?: string;
  /** Optional badge text for display */
  badge?: string;
  /** Feature list for card displays */
  features?: string[];
  /** Subtitle lines for card displays */
  subtitle?: string[];
  /** Hero/feature image path */
  image?: string;
  /** Additional frontmatter fields */
  [key: string]: unknown;
};

// ============================================================================
// GENERIC CONTENT FUNCTIONS
// ============================================================================

/**
 * Get all content items of a specific type
 *
 * @param contentType - The type of content to retrieve
 * @returns Array of content items sorted alphabetically by title
 *
 * @example
 * const services = await getContentItems('services');
 * const locations = await getContentItems('locations');
 */
export async function getContentItems(contentType: ContentType): Promise<ContentItem[]> {
  const dir = path.join(process.cwd(), 'content', contentType);

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    // Directory doesn't exist - return empty array
    return [];
  }

  const items: ContentItem[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.mdx')) continue;

    const slug = file.replace(/\.mdx$/i, '');
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);

    // Generate title from frontmatter or derive from slug
    const title =
      (typeof data.title === 'string' && data.title.trim()) ||
      slug
        .split('-')
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' ');

    // Extract display fields from MDX frontmatter
    const badge = typeof data.badge === 'string' ? data.badge : undefined;
    const features = Array.isArray(data.features) ? data.features : undefined;
    const subtitle = Array.isArray(data.subtitle) ? data.subtitle : undefined;

    // Get hero image from frontmatter (supports both formats)
    const heroImage = data.hero?.image || data.heroImage;

    items.push({
      slug,
      title,
      description: typeof data.description === 'string' ? data.description.trim() : undefined,
      badge,
      features,
      subtitle,
      image: heroImage,
      ...data,
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get a single content item by slug
 *
 * @param contentType - The type of content
 * @param slug - The content slug (filename without extension)
 * @returns The content item frontmatter and MDX content
 *
 * @example
 * const { frontmatter, content } = await getContentItem('services', 'plumbing');
 */
export async function getContentItem(
  contentType: ContentType,
  slug: string
): Promise<{
  frontmatter: ContentItem;
  content: string;
}> {
  const filePath = path.join(process.cwd(), 'content', contentType, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);

  const title =
    (typeof data.title === 'string' && data.title.trim()) ||
    slug
      .split('-')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');

  return {
    frontmatter: {
      slug,
      title,
      description: typeof data.description === 'string' ? data.description.trim() : undefined,
      ...data,
    },
    content,
  };
}

/**
 * Generate static params for dynamic routes
 *
 * @param contentType - The type of content
 * @returns Array of slug params for generateStaticParams
 *
 * @example
 * export async function generateStaticParams() {
 *   return generateContentParams('services');
 * }
 */
export async function generateContentParams(contentType: ContentType) {
  const items = await getContentItems(contentType);
  return items.map(({ slug }) => ({ slug }));
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Get all services
 * @returns Array of service content items
 */
export async function getServices(): Promise<ContentItem[]> {
  return getContentItems('services');
}

/**
 * Get a single service by slug
 * @param slug - Service slug
 */
export async function getService(slug: string) {
  return getContentItem('services', slug);
}

// ============================================================================
// LOCATION FUNCTIONS
// ============================================================================

/**
 * Get all locations
 * @returns Array of location content items
 */
export async function getLocations(): Promise<ContentItem[]> {
  return getContentItems('locations');
}

/**
 * Get a single location by slug
 * @param slug - Location slug
 */
export async function getLocation(slug: string) {
  return getContentItem('locations', slug);
}

// ============================================================================
// BLOG CONTENT UTILITIES
// ============================================================================

/** Blog post with slug */
export type BlogPost = BlogFrontmatter & {
  slug: string;
};

/**
 * Get all blog posts sorted by date (newest first)
 *
 * @returns Array of blog posts
 *
 * @example
 * const posts = await getBlogPosts();
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), 'content', 'blog');

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.mdx')) continue;

    const slug = file.replace(/\.mdx$/i, '');
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);

    posts.push({
      slug,
      ...(data as BlogFrontmatter),
    });
  }

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug
 *
 * @param slug - Blog post slug
 * @returns Blog post frontmatter and content, or null if not found
 */
export async function getBlogPost(
  slug: string
): Promise<{ frontmatter: BlogPost; content: string } | null> {
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
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

/**
 * Get blog posts by category
 *
 * @param category - Blog category to filter by
 * @returns Array of blog posts in that category
 */
export async function getBlogPostsByCategory(category: BlogCategoryType): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.category === category);
}

/**
 * Get featured blog posts (or most recent if none featured)
 *
 * @param limit - Maximum number of posts to return (default: 3)
 * @returns Array of featured blog posts
 */
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const featured = posts.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, limit) : posts.slice(0, limit);
}

/**
 * Calculate estimated reading time for content
 *
 * @param content - The text content to analyze
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ============================================================================
// PROJECTS CONTENT UTILITIES
// ============================================================================

/** Project with slug */
export type Project = ProjectFrontmatter & {
  slug: string;
};

/**
 * Get all projects sorted by completion date (newest first)
 *
 * @returns Array of projects
 */
export async function getProjects(): Promise<Project[]> {
  const dir = path.join(process.cwd(), 'content', 'projects');

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const projects: Project[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.mdx')) continue;

    const slug = file.replace(/\.mdx$/i, '');
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, 'utf8');
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

/**
 * Get a single project by slug
 *
 * @param slug - Project slug
 * @returns Project frontmatter and content, or null if not found
 */
export async function getProject(
  slug: string
): Promise<{ frontmatter: Project; content: string } | null> {
  const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
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

/**
 * Get projects by service slug
 *
 * @param serviceSlug - Service slug to filter by
 * @returns Array of projects using that service
 */
export async function getProjectsByService(serviceSlug: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.services.includes(serviceSlug));
}

/**
 * Get projects by location slug
 *
 * @param locationSlug - Location slug to filter by
 * @returns Array of projects in that location
 */
export async function getProjectsByLocation(locationSlug: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.location === locationSlug);
}

/**
 * Get projects by type
 *
 * @param type - Project type to filter by
 * @returns Array of projects of that type
 */
export async function getProjectsByType(type: ProjectTypeValue): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.projectType === type);
}

/**
 * Get featured projects (or most recent if none featured)
 *
 * @param limit - Maximum number of projects to return (default: 6)
 * @returns Array of featured projects
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.status === 'featured');
  return featured.length > 0 ? featured.slice(0, limit) : projects.slice(0, limit);
}

// ============================================================================
// TESTIMONIALS CONTENT UTILITIES
// ============================================================================

/** Testimonial with slug */
export type Testimonial = TestimonialFrontmatter & {
  slug: string;
};

/**
 * Get all testimonials sorted by date (newest first)
 *
 * @returns Array of testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const dir = path.join(process.cwd(), 'content', 'testimonials');

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const testimonials: Testimonial[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.mdx')) continue;

    const slug = file.replace(/\.mdx$/i, '');
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);

    testimonials.push({
      slug,
      ...(data as TestimonialFrontmatter),
    });
  }

  // Sort by date descending (newest first)
  return testimonials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single testimonial by slug
 *
 * @param slug - Testimonial slug
 * @returns Testimonial frontmatter and content, or null if not found
 */
export async function getTestimonial(
  slug: string
): Promise<{ frontmatter: Testimonial; content: string } | null> {
  const filePath = path.join(process.cwd(), 'content', 'testimonials', `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
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

/**
 * Get testimonials by service slug
 *
 * @param serviceSlug - Service slug to filter by
 * @returns Array of testimonials for that service
 */
export async function getTestimonialsByService(serviceSlug: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((t) => t.serviceSlug === serviceSlug);
}

/**
 * Get testimonials by location slug
 *
 * @param locationSlug - Location slug to filter by
 * @returns Array of testimonials for that location
 */
export async function getTestimonialsByLocation(locationSlug: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((t) => t.locationSlug === locationSlug);
}

/**
 * Get featured testimonials (or most recent if none featured)
 *
 * @param limit - Maximum number of testimonials to return (default: 5)
 * @returns Array of featured testimonials
 */
export async function getFeaturedTestimonials(limit = 5): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter((t) => t.featured);
  return featured.length > 0 ? featured.slice(0, limit) : testimonials.slice(0, limit);
}

/**
 * Calculate aggregate rating from testimonials
 *
 * @param testimonials - Array of testimonials to calculate from
 * @returns Object with average rating and count
 *
 * @example
 * const testimonials = await getTestimonials();
 * const { average, count } = calculateAggregateRating(testimonials);
 * // { average: 4.8, count: 25 }
 */
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
