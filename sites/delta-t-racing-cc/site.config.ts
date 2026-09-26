/**
 * Delta T Racing Site Configuration
 *
 * UK club motorcycle racing team (Bemsee / BMCRC), not a local service
 * business — copied from sites/npracing-v1, which adapted base-template's
 * SiteConfig shape. Fields that don't apply to a racing team (serviceAreas,
 * services, credentials) are left empty or unused rather than filled with
 * placeholder local-service data. Team copy lives in
 * content/brand/delta-t-racing-cc.mdx; this file holds config only.
 */

import type { BaseSiteConfig } from '@platform/core-components/types/site-config';

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
 * Racing-team fields — local extension, not part of the shared BaseSiteConfig.
 */
export interface RacingConfig {
  teamName: string;
  /** Championship / organising club, used in metadata. */
  championship: string;
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

  /**
   * Schema.org SportsTeam data. Deliberately NOT the shared BusinessConfig /
   * LocalBusiness generator: that type requires geo coordinates, and the team
   * has no public base to put there. lib/schema.ts builds the JSON-LD.
   */
  schema: {
    description: string;
    slogan: string;
    sport: string;
    sameAs: string[];
  };

  /** Racing-team fields (see RacingConfig) */
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
  slug: 'delta-t-racing-cc',
  // The team's own domain (delta-t-racing.cc) still points at their Wix site.
  // Until it is cut over, the Vercel production domain is canonical — set
  // NEXT_PUBLIC_SITE_URL in Vercel to switch.
  domain: 'delta-t-racing-cc.vercel.app',
  name: 'Delta T Racing',
  tagline: 'UK motorcycle racing team — Bemsee (BMCRC) 2026',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'Delta T Racing',
    // No registered legal entity confirmed — team name used as-is.
    legalName: 'Delta T Racing',
    type: 'SportsTeam',
    // No public phone number — email is the team's only published contact.
    phone: '',
    email: 'Delta-T-Racing-UK@proton.me',
    // No public base or address confirmed — left blank rather than invented.
    address: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'United Kingdom',
    },
    hours: {
      monday: 'N/A — no public office',
      tuesday: 'N/A — no public office',
      wednesday: 'N/A — no public office',
      thursday: 'N/A — no public office',
      friday: 'N/A — no public office',
      saturday: 'N/A — no public office',
      sunday: 'N/A — no public office',
    },
    // No team social accounts confirmed yet (riders' personal Instagram
    // accounts live on their content/team records instead).
    socialMedia: {},
  },

  navigation: {
    main: [
      { label: 'About', href: '/about' },
      { label: 'Riders', href: '/team' },
      { label: 'Calendar', href: '/#calendar' },
      { label: 'Gallery', href: '/#gallery' },
      { label: 'Sponsors', href: '/sponsors' },
      { label: 'News', href: '/news' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Sponsor us',
      href: '/contact',
    },
    phone: {
      show: false,
    },
  },

  footer: {
    showServices: false,
    showLocations: false,
    maxServices: 0,
    maxLocations: 0,
    copyright: '2026 Delta T Racing. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  // Required by the shared SiteConfig shape; not rendered anywhere on this site.
  credentials: {
    yearEstablished: '',
    stats: [],
    certifications: [],
  },

  serviceAreas: [],

  services: [],

  features: {
    analytics: false,
    consentBanner: false,
    // Off until Resend + CSRF env vars are set on the Vercel project — the
    // contact page shows the team email instead of a form that can't send.
    contactForm: false,
    rateLimit: true,
    testimonials: false,
    blog: false,
  },

  schema: {
    description:
      'Delta T Racing is a UK motorcycle racing team built by people from the refrigeration industry. In 2026 its four riders race the Bemsee (BMCRC) championship across the MRO Supertwins, MRO Minitwins and BMCRC Thunderbike 500 classes.',
    slogan: 'From the plant room to the grid',
    sport: 'Motorcycle racing',
    // No team social accounts confirmed yet.
    sameAs: [],
  },

  racing: {
    teamName: 'Delta T Racing',
    championship: 'Bemsee (BMCRC) 2026',
  },
};
