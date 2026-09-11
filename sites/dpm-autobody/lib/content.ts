/**
 * Content utilities for base-template
 * Thin shim over the canonical createContentUtils factory.
 * Location filtering enabled via getLocationSlugs callback.
 */

import { createContentUtils } from '@platform/core-components/lib/content';
import { getLocationSlugs } from './locations-config';

const utils = createContentUtils({ getLocationSlugs });

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
