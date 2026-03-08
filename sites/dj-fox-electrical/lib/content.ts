/**
 * Content utilities for dj-fox-electrical
 * Thin shim over the canonical createContentUtils factory.
 * No location filtering — DJ Fox does not have location-specific service pages.
 */

import { createContentUtils } from '@platform/core-components/lib/content';

const utils = createContentUtils();

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
