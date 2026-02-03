/**
 * Business Configuration for Schema.org Markup
 * =============================================
 *
 * This file contains structured business data used for generating
 * Schema.org JSON-LD markup for rich search results.
 *
 * Instructions:
 * 1. Replace all placeholder values with your actual business information
 * 2. Update the businessType to match your industry
 * 3. Configure credentials, services, and areas served
 *
 * @see https://schema.org/LocalBusiness for available business types
 */

import type { BusinessConfig, LocalBusinessSchemaOptions } from '@platform/core-components';

/**
 * Schema.org business type for this site
 *
 * Common types:
 * - LocalBusiness: Generic local business (default)
 * - HomeAndConstructionBusiness: Construction, renovation, trades
 * - ProfessionalService: Consulting, legal, accounting
 * - Plumber: Plumbing services
 * - Electrician: Electrical services
 * - RoofingContractor: Roofing services
 *
 * @see https://schema.org/LocalBusiness for full list of subtypes
 */
export const businessType: LocalBusinessSchemaOptions['businessType'] = 'LocalBusiness';

/**
 * Complete business configuration
 *
 * This configuration is used by:
 * - Schema.org LocalBusiness markup (homepage)
 * - Schema.org ServiceArea markup (location pages)
 * - Schema.org Organization markup (all pages)
 * - Open Graph metadata
 *
 * @example
 * // Usage in schema.ts
 * import { businessConfig, businessType } from './business-config';
 * const schema = getLocalBusinessSchema(businessConfig, businessType);
 */
export const businessConfig: BusinessConfig = {
  // ============================================================================
  // BASIC INFORMATION
  // ============================================================================

  /** Business name as it appears publicly */
  name: 'Your Business Name',

  /** Legal registered business name */
  legalName: 'Your Business Ltd',

  /**
   * Business description for SEO and schema markup
   * Should be 150-200 characters and include key services/locations
   */
  description:
    'Professional local services serving [Your Area]. Quality workmanship, competitive pricing, and excellent customer service.',

  /** Business slogan or tagline */
  slogan: 'Your trusted local experts',

  /** Year business was founded (ISO 8601 format) */
  foundingDate: '2020',

  /** Approximate number of employees */
  numberOfEmployees: '1-10',

  /**
   * Price range indicator for Schema.org
   * Options: "$", "$$", "$$$", "$$$$"
   */
  priceRange: '$$',

  // ============================================================================
  // CONTACT INFORMATION
  // ============================================================================

  /** Primary contact email */
  email: 'info@yourbusiness.com',

  /**
   * Primary contact phone number
   * Include country code (e.g., +44 for UK)
   */
  telephone: '+441234567890',

  /** Physical business address */
  address: {
    streetAddress: '123 Main Street',
    addressLocality: 'Your City',
    addressRegion: 'Your County',
    postalCode: 'AB12 3CD',
    addressCountry: 'GB',
  },

  /**
   * Geographic coordinates for Google Maps/Local Pack
   * Get coordinates from Google Maps: right-click location > "What's here?"
   */
  geo: {
    latitude: '51.5074',
    longitude: '-0.1278',
  },

  // ============================================================================
  // OPERATING HOURS
  // ============================================================================

  /**
   * Business opening hours
   * Define multiple entries for different day ranges
   */
  openingHours: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    // Uncomment and modify for weekend hours:
    // {
    //   dayOfWeek: ['Saturday'],
    //   opens: '09:00',
    //   closes: '13:00',
    // },
  ],

  // ============================================================================
  // SERVICE AREAS
  // ============================================================================

  /**
   * Geographic areas served
   * Can be cities, counties, regions, or countries
   */
  areaServed: ['Main Area', 'North Region', 'South Region', 'East Region', 'West Region'],

  // ============================================================================
  // CREDENTIALS & CERTIFICATIONS
  // ============================================================================

  /**
   * Professional credentials, certifications, and memberships
   *
   * Categories:
   * - certification: Industry certifications (ISO, professional bodies)
   * - compliance: Regulatory compliance (health & safety, data protection)
   * - membership: Trade association memberships
   */
  credentials: [
    {
      name: 'Fully Insured',
      description: 'Public liability and professional indemnity insurance',
      category: 'certification',
    },
    {
      name: 'Qualified Team',
      description: 'All staff are fully trained and certified',
      category: 'certification',
    },
    // Add your specific credentials:
    // {
    //   name: 'Gas Safe Registered',
    //   description: 'Registered to work safely on gas appliances',
    //   category: 'certification',
    // },
  ],

  // ============================================================================
  // SOCIAL MEDIA
  // ============================================================================

  /**
   * Social media profile URLs
   * Used for Schema.org sameAs property
   */
  socialProfiles: [
    'https://www.facebook.com/yourbusiness',
    'https://www.linkedin.com/company/yourbusiness',
    // 'https://www.twitter.com/yourbusiness',
    // 'https://www.instagram.com/yourbusiness',
  ],

  // ============================================================================
  // EXPERTISE & SERVICES
  // ============================================================================

  /**
   * Topics and services the business is knowledgeable about
   * Used for Schema.org knowsAbout property
   */
  knowsAbout: [
    'Service Category 1',
    'Service Category 2',
    'Service Category 3',
    'Industry Best Practices',
    'Local Area Expertise',
  ],

  /**
   * Service catalog for Schema.org markup
   * Each service appears as an Offer in the OfferCatalog
   */
  offerCatalog: [
    {
      name: 'Primary Service',
      description: 'Our main service offering for residential and commercial clients',
      url: '/services/primary-service',
    },
    {
      name: 'Secondary Service',
      description: 'Complementary service that enhances our primary offering',
      url: '/services/secondary-service',
    },
    {
      name: 'Service Three',
      description: 'Specialized service for unique client needs',
      url: '/services/service-three',
    },
  ],

  // ============================================================================
  // RATINGS (Optional)
  // ============================================================================

  /**
   * Aggregate rating from reviews
   * Uncomment and update when you have reviews to display
   */
  // aggregateRating: {
  //   ratingValue: '4.9',
  //   ratingCount: '127',
  // },
};
