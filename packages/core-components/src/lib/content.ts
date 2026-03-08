/**
 * Canonical Content Utilities
 * ===========================
 * Factory-based content system for reading MDX files from content/ directories.
 * All sites use createContentUtils() with optional callbacks for site-specific behavior.
 *
 * process.cwd() resolves to the consuming site's root at build time — this is safe
 * because Next.js builds always run from the site directory.
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
} from './content-schemas';

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

/** Blog post with slug */
export type BlogPost = BlogFrontmatter & {
  slug: string;
};

/** Project with slug */
export type Project = ProjectFrontmatter & {
  slug: string;
};

/** Testimonial with slug */
export type Testimonial = TestimonialFrontmatter & {
  slug: string;
};

// ============================================================================
// FACTORY OPTIONS
// ============================================================================

export interface ContentUtilsOptions {
  /** Optional location slug provider for filtering location-specific services */
  getLocationSlugs?: () => Promise<string[]>;
  /** Optional custom service sort function */
  serviceSortFn?: (a: ContentItem, b: ContentItem) => number;
  /** Optional image field resolver (for heroImage vs image differences) */
  imageResolver?: (frontmatter: Record<string, unknown>) => string | undefined;
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/** Derive a title from a slug when frontmatter title is missing */
function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Default image resolver — checks heroImage, hero.image, and image fields */
function defaultImageResolver(data: Record<string, unknown>): string | undefined {
  const hero = data.hero as Record<string, unknown> | undefined;
  return (data.heroImage as string) || (hero?.image as string) || (data.image as string) || undefined;
}

// ============================================================================
// FACTORY
// ============================================================================

export function createContentUtils(options?: ContentUtilsOptions) {
  const getLocationSlugs = options?.getLocationSlugs;
  const serviceSortFn = options?.serviceSortFn;
  const imageResolver = options?.imageResolver ?? defaultImageResolver;

  // --------------------------------------------------------------------------
  // Generic content functions
  // --------------------------------------------------------------------------

  async function getContentItems(contentType: ContentType): Promise<ContentItem[]> {
    const dir = path.join(process.cwd(), 'content', contentType);

    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      return [];
    }

    // For services, optionally filter out location-specific slugs
    const locationSlugs =
      contentType === 'services' && getLocationSlugs ? await getLocationSlugs() : [];

    const items: ContentItem[] = [];

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.mdx')) continue;

      const slug = file.replace(/\.mdx$/i, '');

      // Skip location-specific service files on main services page
      if (
        contentType === 'services' &&
        locationSlugs.length > 0 &&
        locationSlugs.some((loc) => slug.includes(`-${loc}`))
      ) {
        continue;
      }

      const filePath = path.join(dir, file);
      const raw = await fs.readFile(filePath, 'utf8');
      const { data } = matter(raw);

      const title =
        (typeof data.title === 'string' && data.title.trim()) || titleFromSlug(slug);

      const badge = typeof data.badge === 'string' ? data.badge : undefined;
      const features = Array.isArray(data.features) ? data.features : undefined;
      const subtitle = Array.isArray(data.subtitle) ? data.subtitle : undefined;
      const heroImage = imageResolver(data as Record<string, unknown>);

      items.push({
        slug,
        title,
        description: typeof data.description === 'string' ? data.description.trim() : undefined,
        badge,
        features,
        subtitle,
        image: heroImage,
        heroImage,
        ...data,
      });
    }

    // Custom sort for services if provided, otherwise alphabetical
    if (contentType === 'services' && serviceSortFn) {
      return items.sort(serviceSortFn);
    }

    return items.sort((a, b) => a.title.localeCompare(b.title));
  }

  async function getContentItem(
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
      (typeof data.title === 'string' && data.title.trim()) || titleFromSlug(slug);

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

  async function generateContentParams(contentType: ContentType) {
    const items = await getContentItems(contentType);
    return items.map(({ slug }) => ({ slug }));
  }

  // --------------------------------------------------------------------------
  // Service functions
  // --------------------------------------------------------------------------

  async function getServices(): Promise<ContentItem[]> {
    return getContentItems('services');
  }

  async function getService(slug: string) {
    return getContentItem('services', slug);
  }

  // --------------------------------------------------------------------------
  // Location functions
  // --------------------------------------------------------------------------

  async function getLocations(): Promise<ContentItem[]> {
    return getContentItems('locations');
  }

  async function getLocation(slug: string) {
    return getContentItem('locations', slug);
  }

  // --------------------------------------------------------------------------
  // Blog functions
  // --------------------------------------------------------------------------

  async function getBlogPosts(): Promise<BlogPost[]> {
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

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async function getBlogPost(
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

  async function getBlogPostsByCategory(category: BlogCategoryType): Promise<BlogPost[]> {
    const posts = await getBlogPosts();
    return posts.filter((p) => p.category === category);
  }

  async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
    const posts = await getBlogPosts();
    const featured = posts.filter((p) => p.featured);
    return featured.length > 0 ? featured.slice(0, limit) : posts.slice(0, limit);
  }

  function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // --------------------------------------------------------------------------
  // Project functions
  // --------------------------------------------------------------------------

  async function getProjects(): Promise<Project[]> {
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

    return projects.sort(
      (a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
    );
  }

  async function getProject(
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

  async function getProjectsByService(serviceSlug: string): Promise<Project[]> {
    const projects = await getProjects();
    return projects.filter((p) => p.services.includes(serviceSlug));
  }

  async function getProjectsByLocation(locationSlug: string): Promise<Project[]> {
    const projects = await getProjects();
    return projects.filter((p) => p.location === locationSlug);
  }

  async function getProjectsByType(type: ProjectTypeValue): Promise<Project[]> {
    const projects = await getProjects();
    return projects.filter((p) => p.projectType === type);
  }

  async function getFeaturedProjects(limit = 6): Promise<Project[]> {
    const projects = await getProjects();
    const featured = projects.filter((p) => p.status === 'featured');
    return featured.length > 0 ? featured.slice(0, limit) : projects.slice(0, limit);
  }

  // --------------------------------------------------------------------------
  // Testimonial functions
  // --------------------------------------------------------------------------

  async function getTestimonials(): Promise<Testimonial[]> {
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

    return testimonials.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async function getTestimonial(
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

  async function getTestimonialsByService(serviceSlug: string): Promise<Testimonial[]> {
    const testimonials = await getTestimonials();
    return testimonials.filter((t) => t.serviceSlug === serviceSlug);
  }

  async function getTestimonialsByLocation(locationSlug: string): Promise<Testimonial[]> {
    const testimonials = await getTestimonials();
    return testimonials.filter((t) => t.locationSlug === locationSlug);
  }

  async function getFeaturedTestimonials(limit = 5): Promise<Testimonial[]> {
    const testimonials = await getTestimonials();
    const featured = testimonials.filter((t) => t.featured);
    return featured.length > 0 ? featured.slice(0, limit) : testimonials.slice(0, limit);
  }

  function calculateAggregateRating(testimonials: Testimonial[]): {
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

  // --------------------------------------------------------------------------
  // Return full superset
  // --------------------------------------------------------------------------

  return {
    // Generic
    getContentItems,
    getContentItem,
    generateContentParams,
    // Services
    getServices,
    getService,
    // Locations
    getLocations,
    getLocation,
    // Blog
    getBlogPosts,
    getBlogPost,
    getBlogPostsByCategory,
    getFeaturedBlogPosts,
    calculateReadingTime,
    // Projects
    getProjects,
    getProject,
    getProjectsByService,
    getProjectsByLocation,
    getProjectsByType,
    getFeaturedProjects,
    // Testimonials
    getTestimonials,
    getTestimonial,
    getTestimonialsByService,
    getTestimonialsByLocation,
    getFeaturedTestimonials,
    calculateAggregateRating,
  };
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================
// Exported for use by core-components internal files (e.g. footer.tsx,
// content-grid.tsx) that import from "@/lib/content". When consumed inside
// core-components' standalone type-check, @/ resolves here. At runtime in a
// real site build, the site's own lib/content.ts shim takes precedence because
// the site's tsconfig maps @/ to its own src/lib.
//
// No options = no location filtering, alphabetical service sort, default image
// resolver. This is the correct fallback for shared components that must work
// across all sites without site-specific configuration.

const _default = createContentUtils();

export const {
  getContentItems,
  getContentItem,
  generateContentParams,
  getServices,
  getService,
  getLocations,
  getLocation,
  getBlogPosts,
  getBlogPost,
  getBlogPostsByCategory,
  getFeaturedBlogPosts,
  calculateReadingTime,
  getProjects,
  getProject,
  getProjectsByService,
  getProjectsByLocation,
  getProjectsByType,
  getFeaturedProjects,
  getTestimonials,
  getTestimonial,
  getTestimonialsByService,
  getTestimonialsByLocation,
  getFeaturedTestimonials,
  calculateAggregateRating,
} = _default;
