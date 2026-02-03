/**
 * UI Components Barrel Export
 * ===========================
 *
 * Central export file for all UI components.
 * Import components from '@/components/ui' instead of individual files.
 *
 * @example
 * import { Breadcrumbs, BlogPostCard, CTASection, StarRating } from '@/components/ui';
 */

// ============================================================================
// Article/Content Components (Task 4.1)
// ============================================================================
export { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs';
export { BlogPostCard } from './blog-post-card';
export { BlogPostHero } from './blog-post-hero';
export { ArticleCallout } from './article-callout';
export { AuthorCard } from './author-card';

// ============================================================================
// Service/Location Components (Task 4.2)
// ============================================================================
export { PageHero } from './page-hero';
export { FAQSection, type FAQItem } from './faq-section';
export { CTASection } from './cta-section';
export { ServiceBenefits } from './service-benefits';
export { ServiceAbout } from './service-about';
export { ServiceHero } from './service-hero';
export { LocationHero } from './location-hero';

// ============================================================================
// Testimonial Components (Task 4.3)
// ============================================================================
export { StarRating } from './star-rating';
export { AggregateRatingDisplay } from './aggregate-rating-display';
export { TestimonialCard } from './testimonial-card';

// ============================================================================
// Layout Components (Task 4.4)
// ============================================================================
export { ContentCard } from './content-card';
export { ContentGrid, type ContentItem } from './content-grid';
export { CardGrid } from './card-grid';
