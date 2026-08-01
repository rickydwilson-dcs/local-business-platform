/**
 * NPRacing Site Configuration
 *
 * British Superbike (BSB) race team, not a local service business —
 * adapted from base-template's SiteConfig shape. Fields that don't apply
 * to a racing team (serviceAreas, services) are left empty rather than
 * filled with placeholder local-service data. NPRacing-specific fields
 * live in the local `RacingConfig` extension type / `racing` field below.
 */

import type { BaseSiteConfig } from '@platform/core-components/types/site-config';
import type { BusinessConfig, LocalBusinessSchemaOptions } from '@platform/core-components';

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface CTAConfig {
  primary: {
    label: string;
    href: string;
  };
  phone: {
    show: boolean;
    label?: string;
  };
}

export interface FooterConfig {
  showServices: boolean;
  showLocations: boolean;
  maxServices: number;
  maxLocations: number;
  copyright: string;
  builtBy?: {
    name: string;
    url: string;
  };
}

export interface CredentialStat {
  value: string;
  label: string;
  description?: string;
}

export interface Certification {
  name: string;
  description: string;
  icon?: string;
}

export interface CredentialsConfig {
  yearEstablished: string;
  stats: CredentialStat[];
  certifications: Certification[];
  insurance?: {
    amount: string;
    type: string;
  };
}

export interface ServiceAreaRegion {
  name: string;
  slug: string;
  towns: Array<{ name: string; slug: string }>;
}

/**
 * NPRacing-specific fields (British Superbike race team).
 *
 * Local extension type — not part of the shared `BaseSiteConfig` /
 * `@platform/core-components` contract, since none of these fields are
 * meaningful for the platform's usual local-service-business sites.
 */
export interface RacingConfig {
  /** Team name as used in BSB paddock materials. */
  teamName: string;
  /** Championship the team competes in. */
  championship: string;
  /** Race number carried on the bike (BSB rider #51 for the 2026 season). */
  raceNumber: number;
  rider: {
    name: string;
  };
  instagram: {
    handle: string;
    url: string;
  };
  /**
   * Merch store base URL (The Clothing Kings partnership storefront).
   * TODO: confirm this is the final live URL before launch.
   */
  merchStoreUrl?: string;
}

export interface SiteConfig extends BaseSiteConfig {
  /** Site name and branding */
  name: string;
  tagline: string;
  url: string;

  /** Business information */
  business: {
    name: string;
    legalName: string;
    /**
     * Local, descriptive type — NOT the schema.org type used for JSON-LD
     * (see `schema.businessType` below, which is constrained to the shared
     * `LocalBusinessSchemaOptions` union and does not include `SportsTeam`).
     * This field is declared locally in this file, so it's safe to widen it
     * for site-specific descriptive purposes.
     */
    type: 'LocalBusiness' | 'ProfessionalService' | 'HomeAndConstructionBusiness' | 'SportsTeam';
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
    geo?: {
      latitude: number;
      longitude: number;
    };
  };

  /** Navigation configuration */
  navigation: {
    main: NavItem[];
  };

  /** Call-to-action configuration */
  cta: CTAConfig;

  /** Footer configuration */
  footer: FooterConfig;

  /** Credentials and accreditations */
  credentials: CredentialsConfig;

  /** Service areas */
  serviceAreas: string[];

  /** Service area regions for dropdown navigation (optional) */
  serviceAreaRegions?: ServiceAreaRegion[];

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

  /** Schema.org business configuration */
  schema: {
    businessConfig: BusinessConfig;
    businessType: LocalBusinessSchemaOptions['businessType'];
  };

  /** NPRacing-specific fields (see RacingConfig) */
  racing: RacingConfig;

  /** Optional rich about page content */
  about?: {
    /** Short badges/tags shown in the hero (e.g. "Est. 2009", "Family Business") */
    heroBadges?: string[];
    /** Company founding narrative — each string is a paragraph */
    story?: string[];
    /** Why-choose-us bullet points */
    whyChooseUs?: string[];
    /** Company values shown as a card grid */
    values?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export const siteConfig: SiteConfig = {
  slug: 'npracing-v1',
  // PENDING/UNCONFIRMED: no production domain has been confirmed yet for
  // NPRacing. Using the Vercel preview domain as a placeholder until a real
  // domain is purchased and confirmed.
  domain: 'npracing-v1.vercel.app',
  name: 'NPRacing',
  // Matches content/brand/npracing.mdx's `tagline` frontmatter field exactly.
  tagline: 'An independent Honda team punching above its weight in British Superbike',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'NPRacing',
    legalName: 'Your Business Ltd',
    type: 'SportsTeam',
    phone: '+44 1234 567890',
    email: 'npracingbsb@hotmail.com',
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
    // No confirmed public street address/geo for NPRacing (team is based in
    // Taunton, Somerset per brand.mdx, but no exact coordinates were ever
    // confirmed) — omitted rather than emitting fake London coordinates.
    // `geo` is optional; app/layout.tsx's `{siteConfig.business.geo && (...)}`
    // guard already handles it being absent.
  },

  navigation: {
    main: [
      { label: 'Team', href: '/#team' },
      { label: 'Rider', href: '/#rider' },
      { label: 'Gallery', href: '/#gallery' },
      { label: 'Merch', href: '/merch' },
      { label: 'News', href: '/news' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Shop',
      href: '/merch',
    },
    phone: {
      show: true,
      label: 'Call Us',
    },
  },

  footer: {
    // NPRacing has no services/locations content (not a local service
    // business) — these are the location/service-oriented flags that don't
    // apply to this site, per the base-template's local-service model.
    showServices: false,
    showLocations: false,
    maxServices: 10,
    maxLocations: 12,
    copyright: '2025 Your Business Name. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: '2020',
    stats: [
      { value: '5+', label: 'Years Experience', description: 'Serving local customers' },
      { value: '500+', label: 'Projects Completed', description: 'Satisfied clients' },
      { value: '100%', label: 'Satisfaction', description: 'Customer focused' },
      { value: '24/7', label: 'Support', description: 'Always available' },
    ],
    certifications: [
      { name: 'Certified Professional', description: 'Industry certification' },
      { name: 'Fully Insured', description: 'Comprehensive coverage' },
    ],
    insurance: {
      amount: '£5M',
      type: 'Public Liability',
    },
  },

  // NPRacing is a BSB race team, not a local service business — no service
  // areas or services to list. Left as empty arrays rather than fabricated
  // placeholder data (the type does not allow omitting these fields).
  serviceAreas: [],

  services: [],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: false,
  },

  schema: {
    businessType: 'LocalBusiness',
    businessConfig: {
      name: 'Your Business Name',
      legalName: 'Your Business Ltd',
      description:
        'Professional local services serving [Your Area]. Quality workmanship, competitive pricing, and excellent customer service.',
      slogan: 'Your trusted local experts',
      foundingDate: '2020',
      numberOfEmployees: '1-10',
      priceRange: '$$',
      email: 'info@yourbusiness.com',
      telephone: '+441234567890',
      address: {
        streetAddress: '123 Main Street',
        addressLocality: 'Your City',
        addressRegion: 'Your County',
        postalCode: 'AB12 3CD',
        addressCountry: 'GB',
      },
      geo: {
        latitude: '51.5074',
        longitude: '-0.1278',
      },
      openingHours: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      ],
      areaServed: ['Main Area', 'North Region', 'South Region', 'East Region', 'West Region'],
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
      ],
      socialProfiles: [
        'https://www.facebook.com/yourbusiness',
        'https://www.linkedin.com/company/yourbusiness',
      ],
      knowsAbout: [
        'Service Category 1',
        'Service Category 2',
        'Service Category 3',
        'Industry Best Practices',
        'Local Area Expertise',
      ],
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
    },
  },

  racing: {
    teamName: 'NPRacing',
    championship: 'British Superbike Championship (BSB)',
    raceNumber: 51,
    rider: {
      name: 'Brayden Elliott',
    },
    instagram: {
      handle: '@npracingbsb',
      url: 'https://www.instagram.com/npracingbsb',
    },
    // Confirmed URL from brief materials (The Clothing Kings partnership storefront).
    merchStoreUrl: 'https://www.theclothingkings.co.uk/category/partnerships/npracing/',
  },

  about: {
    heroBadges: ['Est. 2020', 'Local Experts', 'Fully Insured'],
    story: [
      'Founded in 2020, Your Business Name was built on a simple promise: deliver professional, reliable service that our customers can count on every time.',
      'From our base in City Name, we serve residential and commercial clients across Main Area, North Region, and South Region. Every project, large or small, receives the same dedication to quality.',
      'Today we are proud to be a trusted local business — known for honest pricing, skilled workmanship, and the kind of service that earns referrals from neighbours and friends.',
    ],
    whyChooseUs: [
      'Fully insured with comprehensive public liability cover',
      'Free quotes and consultations',
      'Competitive, transparent pricing',
      'Quality workmanship guaranteed',
      'Professional, uniformed team',
      'Clear communication throughout',
      'Flexible scheduling to suit you',
      'Comprehensive aftercare and support',
    ],
    values: [
      {
        title: 'Quality First',
        description:
          'We maintain the highest standards in everything we do, ensuring exceptional results for every project.',
      },
      {
        title: 'Professional Excellence',
        description:
          'Our team is fully qualified and continuously trained to deliver professional service.',
      },
      {
        title: 'Reliable Service',
        description:
          'We arrive on time, complete projects efficiently, and communicate clearly throughout.',
      },
      {
        title: 'Customer Focus',
        description:
          'Your satisfaction is our priority. We listen to your needs and deliver tailored solutions.',
      },
    ],
  },
};
