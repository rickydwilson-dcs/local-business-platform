/**
 * Content utilities for dpm-autobody
 * Thin shim over the canonical createContentUtils factory.
 * Location filtering enabled via getLocationSlugs callback.
 *
 * `builds` is a DPM-specific content type (the restoration register — see
 * lib/content-schemas.ts's BuildFrontmatterSchema and
 * output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md Phase 2) and is
 * intentionally NOT part of @platform/core-components' shared `ContentType` union — no other
 * site needs it. `getBuilds`/`getBuild` below wire it into the same generic
 * getContentItems/getContentItem reader the shared content types use, via a type cast, since the
 * underlying reader is a generic MDX-directory-plus-frontmatter loader that never actually
 * branches on the literal `ContentType` union at runtime (see
 * packages/core-components/src/lib/content.ts).
 */

import { createContentUtils, type ContentType } from '@platform/core-components/lib/content';
import { getLocationSlugs } from './locations-config';
import type { BuildFrontmatter } from './content-schemas';

const utils = createContentUtils({ getLocationSlugs });

/** A build's frontmatter plus its slug — mirrors the BlogPost/Project/Testimonial pattern. */
export type Build = BuildFrontmatter & { slug: string };

/** All builds in content/builds/, sorted alphabetically by title (same default as getServices). */
export async function getBuilds(): Promise<Build[]> {
  const items = await utils.getContentItems('builds' as ContentType);
  return items as unknown as Build[];
}

/** A single build by slug, from content/builds/<slug>.mdx. */
export async function getBuild(slug: string): Promise<{ frontmatter: Build; content: string }> {
  const item = await utils.getContentItem('builds' as ContentType, slug);
  return item as unknown as { frontmatter: Build; content: string };
}

// Destructure all functions used by pages in this site
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
} = utils;

// Re-export types needed by consuming pages
export type {
  ContentType,
  ContentItem,
  BlogPost,
  Project,
  Testimonial,
  ContentUtilsOptions,
} from '@platform/core-components/lib/content';

export type { BuildFrontmatter } from './content-schemas';
