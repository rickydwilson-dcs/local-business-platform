// Export Hero variants
export * from "./components/hero";

// Orion theme components (migrated from dj-fox-electrical)
export * from "./components/ui/hero-with-image";
export * from "./components/ui/page-hero-image";
export * from "./components/ui/circular-icon-card";
export * from "./components/ui/info-card";
export * from "./components/ui/dark-stat-card";
export * from "./components/ui/image-overlay-card";

// Export all UI components (generic, usable across all sites)
export * from "./components/ui/accent-underline";
export * from "./components/ui/aggregate-rating-display";
export * from "./components/ui/article-callout";
export * from "./components/ui/author-card";
export * from "./components/ui/blog-post-card";
export * from "./components/ui/blog-post-hero";
export * from "./components/ui/breadcrumbs";
export * from "./components/ui/capability-showcase";
export * from "./components/ui/card-grid";
export * from "./components/ui/certificate-gallery";
export * from "./components/ui/certificate-lightbox";
export * from "./components/ui/contact-form";
export * from "./components/ui/content-card";
export * from "./components/ui/content-grid";
export * from "./components/ui/coverage-areas";
export * from "./components/ui/coverage-map-section";
export * from "./components/ui/coverage-stats-section";
export * from "./components/ui/cta-section";
export * from "./components/ui/event-details-band";
export * from "./components/ui/faq-accordion-item";
export * from "./components/ui/faq-section";
// Note: footer.tsx imports getContentItems (@/lib/content → fs/promises) — server-only async component.
// Cannot be in barrel because client components also import from this barrel.
// Import directly: import { Footer } from "@platform/core-components/src/components/ui/footer";
export * from "./components/ui/hero-section";
export * from "./components/ui/large-feature-cards";
export * from "./components/ui/local-authority-expertise";
export * from "./components/ui/local-specialists-benefits";
// Note: location-components.tsx is an aggregate that re-exports LocationFAQ, LocationServices etc.
// Import from standalone files (location-faq, location-services) to avoid naming conflicts.
export * from "./components/ui/location-coverage";
export * from "./components/ui/location-faq";
export * from "./components/ui/location-hero";
export * from "./components/ui/location-services";
export * from "./components/ui/locations-dropdown";
export * from "./components/ui/mobile-menu";
export * from "./components/ui/newsletter-signup";
export * from "./components/ui/page-hero";
export * from "./components/ui/photo-strip";
export * from "./components/ui/pricing-packages";
export * from "./components/ui/section-wrapper";
export * from "./components/ui/service-about";
export * from "./components/ui/service-benefits";
export * from "./components/ui/service-cards";
// Note: service-components.tsx is an aggregate that re-exports ServiceHero, CoverageAreas, FAQ etc.
// Import from standalone files to avoid naming conflicts.
export * from "./components/ui/service-cta";
export * from "./components/ui/service-faq";
export * from "./components/ui/service-gallery";
export * from "./components/ui/service-hero";
export * from "./components/ui/service-showcase";
export * from "./components/ui/star-rating";
export * from "./components/ui/testimonial-card";

// Location components — props-based, no site-specific imports needed
export * from "./components/ui/county-gateway-cards";
export * from "./components/ui/coverage-map";
export * from "./components/ui/coverage-map-section";
export * from "./components/ui/town-finder-section";

// Export Schema component
export * from "./components/Schema";

// Export layout components
export { PageLayout } from "./components/layouts/page-layout";
export * from "./components/ui/site-header";
export * from "./components/ui/page-shell";

// Export theme context (client-side atoms)
export * from "./context/theme-context";

// Export hooks
export * from "./hooks";

// Export type-only utilities from lib (no fs/server dependencies)
export * from "./lib/content-schemas";
export * from "./lib/schema";
export * from "./lib/schema-types";

// Export shared utility factories
export * from "./lib/site-utils";
export { createContactInfo } from "./lib/contact-info";
export type { ContactInfoConfig } from "./lib/contact-info";
export { createSchemaGenerators } from "./lib/schema-generators";
export type { SchemaContext, ArticleSchemaOptions, AggregateRatingOptions } from "./lib/schema-generators";

// Export platform-level types
export * from "./types/site-config";

// Server-only lib modules (use fs/promises) are NOT exported from barrel.
// Import directly from site-local @/lib/ modules or from subpaths:
//   import { getContentItems } from "@/lib/content";
//   import { absUrl } from "@/lib/site";
//   import { getServices } from "@/lib/services";

// API route factories depend on rate-limiter (Supabase) — import via subpath:
//   import { createContactHandler } from "@platform/core-components/src/lib/api/contact-route";

// Analytics components depend on site-specific @/lib/analytics/types.
// Import directly from subpaths if needed:
//   import { ConsentManager } from "@platform/core-components/src/components/analytics/ConsentManager";
