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
    /** Widened locally to allow 'SportsTeam' — the shared
     *  LocalBusinessSchemaOptions['businessType'] union has no SportsTeam
     *  member and docs/standards/schema.md doesn't document one either.
     *  The runtime JSON-LD generator (createSchemaGenerators in lib/schema.ts)
     *  types businessType as plain string, so this serializes fine — the
     *  widening here only unblocks the local TS annotation. */
    businessType: LocalBusinessSchemaOptions['businessType'] | 'SportsTeam';
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
    // Best-available fact from the brief: Neil Pearson, the team owner, is
    // also the founder of NP Motorcycles. Not confirmed as the racing
    // team's exact registered legal entity name — update once confirmed.
    legalName: 'NP Motorcycles',
    type: 'SportsTeam',
    // No public phone number confirmed for NPRacing (brief only confirms
    // email as live). Left empty rather than inventing a number.
    phone: '',
    email: 'npracingbsb@hotmail.com',
    // NPRacing has no public storefront/office — this is a racing team, not
    // a local service business. City/region reflect the team's real base
    // (Taunton, Somerset, per brief); street/postcode are left blank rather
    // than fabricated since no public address is confirmed.
    address: {
      street: '',
      city: 'Taunton',
      region: 'Somerset',
      postalCode: '',
      country: 'United Kingdom',
    },
    // Not applicable — racing team, no public office hours.
    hours: {
      monday: 'N/A — no public office',
      tuesday: 'N/A — no public office',
      wednesday: 'N/A — no public office',
      thursday: 'N/A — no public office',
      friday: 'N/A — no public office',
      saturday: 'N/A — no public office',
      sunday: 'N/A — no public office',
    },
    socialMedia: {
      // Confirmed and approved as an image/content source per the brief.
      instagram: 'https://www.instagram.com/npracingbsb/',
      facebook: 'https://www.facebook.com/npracingbsb/',
    },
    // No confirmed public street address/geo for NPRacing (team is based in
    // Taunton, Somerset per brand.mdx, but no exact coordinates were ever
    // confirmed) — omitted rather than emitting fake London coordinates.
    // `geo` is optional; app/layout.tsx's `{siteConfig.business.geo && (...)}`
    // guard already handles it being absent.
  },

  navigation: {
    main: [
      { label: 'Team', href: '/team' },
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
    businessType: 'SportsTeam',
    businessConfig: {
      name: 'NPRacing',
      legalName: 'NP Motorcycles',
      description:
        'NPRacing is a private British Superbike (BSB) team run by Neil Pearson, based in Taunton, Somerset, competing on Honda machinery in the British Superbike Championship. Part of the BSB paddock since 2004, with its first full season in the premier Superbike class in 2020, NPRacing is known for developing young talent and running professionally prepared Fireblades as a close-knit, independent operation.',
      slogan: 'Punching above our weight in British Superbike',
      foundingDate: '2004',
      // No public headcount confirmed — omitted rather than guessed
      // (numberOfEmployees is optional on BusinessConfig).
      email: 'npracingbsb@hotmail.com',
      // No public phone number confirmed.
      telephone: '',
      // No public street address — city/region reflect the team's real
      // base (Taunton, Somerset); street/postcode left blank rather than
      // fabricated.
      address: {
        streetAddress: '',
        addressLocality: 'Taunton',
        addressRegion: 'Somerset',
        postalCode: '',
        addressCountry: 'GB',
      },
      // Approximate Taunton town-centre coordinates, not a fabricated
      // specific address.
      geo: {
        latitude: '51.0158',
        longitude: '-3.1027',
      },
      // No public opening hours for a racing team — left empty; the
      // schema generator omits openingHoursSpecification entirely when
      // this array is empty.
      openingHours: [],
      // Not a location-based service business — left empty rather than
      // inventing an area served.
      areaServed: [],
      socialProfiles: [
        'https://www.instagram.com/npracingbsb/',
        'https://www.facebook.com/npracingbsb/',
      ],
      // No services/products catalog — merchandise is sold via an
      // external store (The Clothing Kings), not an on-site catalog.
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
