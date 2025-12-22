/**
 * Base Template Site Configuration
 *
 * Generic placeholder configuration for a local service business.
 * Copy this file when creating a new site and replace all placeholder values
 * with actual business information.
 */

export interface SiteConfig {
  /** Site name and branding */
  name: string;
  tagline: string;
  url: string;

  /** Business information */
  business: {
    name: string;
    legalName: string;
    type: 'LocalBusiness' | 'ProfessionalService' | 'HomeAndConstructionBusiness';
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    hours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };

  /** Service areas */
  serviceAreas: string[];

  /** Featured services */
  services: {
    title: string;
    slug: string;
    description: string;
  }[];

  /** Feature flags */
  features: {
    analytics: boolean;
    consentBanner: boolean;
    contactForm: boolean;
    rateLimit: boolean;
    testimonials: boolean;
    blog: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Base Template Site',
  tagline: 'Professional Local Services',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'Your Business Name',
    legalName: 'Your Business Ltd',
    type: 'LocalBusiness',
    phone: '+44 1234 567890',
    email: 'info@example.com',
    address: {
      street: '123 Main Street',
      city: 'City Name',
      region: 'County/Region',
      postalCode: 'AB12 3CD',
      country: 'United Kingdom',
    },
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    socialMedia: {
      facebook: 'https://facebook.com/yourbusiness',
      twitter: 'https://twitter.com/yourbusiness',
      instagram: 'https://instagram.com/yourbusiness',
    },
  },

  serviceAreas: ['Main Area', 'North Region', 'South Region'],

  services: [
    {
      title: 'Primary Service',
      slug: 'primary-service',
      description: 'Our flagship service offering for residential and commercial clients.',
    },
    {
      title: 'Secondary Service',
      slug: 'secondary-service',
      description: 'Complementary service that enhances our primary offering.',
    },
    {
      title: 'Service Three',
      slug: 'service-three',
      description: 'Specialized service for unique client needs.',
    },
  ],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: false,
    testimonials: true,
    blog: false,
  },
};
