/**
 * Content utilities for colossus-scaffolding
 * Thin shim over the canonical createContentUtils factory.
 * Location filtering enabled via getLocationSlugs callback.
 * Custom service sorting: main scaffolding categories first, then alphabetical.
 */

import { createContentUtils } from "@platform/core-components/lib/content";
import type { ContentItem } from "@platform/core-components/lib/content";
import { getLocationSlugs } from "./locations-config";

/** Main scaffolding categories displayed first in this specific order */
const mainCategories = [
  "Commercial Scaffolding",
  "Residential Scaffolding",
  "Industrial Scaffolding",
];

/** Colossus category-first sorting: main categories pinned to top in order, rest alphabetical */
const scaffoldingSortFn = (a: ContentItem, b: ContentItem): number => {
  const aIsMain = mainCategories.includes(a.title);
  const bIsMain = mainCategories.includes(b.title);

  if (aIsMain && !bIsMain) return -1;
  if (!aIsMain && bIsMain) return 1;
  if (aIsMain && bIsMain) {
    return mainCategories.indexOf(a.title) - mainCategories.indexOf(b.title);
  }

  return a.title.localeCompare(b.title);
};

const utils = createContentUtils({
  getLocationSlugs,
  serviceSortFn: scaffoldingSortFn,
});

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
} from "@platform/core-components/lib/content";
