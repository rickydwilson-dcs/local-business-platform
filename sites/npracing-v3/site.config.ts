/**
 * NPRacing Site Configuration
 *
 * NPRacing is a British Superbike (BSB) racing team based in Taunton,
 * Somerset — NOT a local service business. This file was originally an
 * unmodified copy of base-template's placeholder config; the config/
 * registry layer below has been made truthful for the team, sourced from
 * `output/briefs/npracing/brief.md` and `output/briefs/npracing/content/brand.md`.
 *
 * Visual tokens (colors/fonts) and page scaffolding (Gallery, Merchandise,
 * News, Races) come in a later phase — this file only covers the
 * config/registry layer.
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
 * NPRacing-specific brand/team fields. These don't fit the shared
 * BaseSiteConfig/local-service shape (no services, no service areas), so
 * they live here as their own extension type rather than being forced into
 * unrelated fields.
 */
export interface RacingTeamInfo {
  /** Public-facing team name */
  teamName: string;
  /** Team base (town/county — no public street address) */
  base: string;
  /** Championship the team competes in */
  championship: string;
  /** Machinery manufacturer */
  manufacturer: string;
  /** Race number carried on the team's bike */
  raceNumber: number;
  rider: {
    name: string;
    /** When/where the rider joined the team */
    joined: string;
  };
  owner: {
    name: string;
    /** Owner's parent business */
    company: string;
  };
  social: {
    instagramHandle: string;
    instagramUrl: string;
  };
  /** External merchandise store — no on-site checkout, deep links only */
  merchandiseStoreUrl: string;
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

  /** Service areas — intentionally empty; NPRacing is a brand/media site,
   *  not a local service business with a service area. */
  serviceAreas: string[];

  /** Service area regions for dropdown navigation (optional) */
  serviceAreaRegions?: ServiceAreaRegion[];

  /** Featured services — intentionally empty; NPRacing has no services. */
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

  /** NPRacing team/brand facts — see RacingTeamInfo above. */
  racing: RacingTeamInfo;

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
  slug: 'npracing-v3',
  // Placeholder until a real domain is confirmed for the client.
  domain: 'npracing-v3.vercel.app',
  name: 'NP Racing',
  tagline: 'British Superbike Team — Race #51',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://npracing-v3.vercel.app',

  business: {
    name: 'NP Racing',
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
    // Approximate Taunton town-centre coordinates (public geographic fact,
    // not a specific fabricated street address) representing the team base.
    geo: {
      latitude: 51.0158,
      longitude: -3.1027,
    },
  },

  navigation: {
    main: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Contact the Team',
      href: '/contact',
    },
    phone: {
      // No confirmed public phone number — don't show a call button.
      show: false,
    },
  },

  footer: {
    // No services/locations content types apply to this site.
    showServices: false,
    showLocations: false,
    maxServices: 0,
    maxLocations: 0,
    copyright: '2026 NP Racing. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    // "In the BSB paddock since 2004" per brief; first full Superbike
    // season came later, in 2020.
    yearEstablished: '2004',
    // Order and labels match the approved mockup exactly (design-03-number51.html).
    stats: [
      {
        value: '2004',
        label: 'Paddock since',
        description: 'Racing and team involvement since 2004',
      },
      {
        value: '2020',
        label: 'First full BSB season',
        description: "NP Racing's debut season in the premier class",
      },
      {
        value: 'Honda',
        label: 'Fireblade machinery',
        description: 'Professionally prepared Honda Fireblades',
      },
      {
        value: '#51',
        label: '2026 race number',
        description: "Brayden Elliott's number on track",
      },
    ],
    // No certifications/accreditations apply to a racing team — left empty
    // rather than inventing any.
    certifications: [],
  },

  serviceAreas: [],

  services: [],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    // No testimonials or blog content type for this brand/media site.
    testimonials: false,
    blog: false,
  },

  schema: {
    businessType: 'SportsTeam',
    businessConfig: {
      name: 'NP Racing',
      legalName: 'NP Motorcycles',
      description:
        'NP Racing is a private British Superbike (BSB) team run by Neil Pearson, based in Taunton, Somerset, competing on Honda machinery in the British Superbike Championship. Involved in the BSB paddock since 2004, with its first full season in the premier Superbike class in 2020, NP Racing is known for developing young talent and running professionally prepared Fireblades as a close-knit, independent operation.',
      slogan: 'British Superbike Team — Race #51',
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
    teamName: 'NP Racing',
    base: 'Taunton, Somerset',
    championship:
      'British Superbike Championship (branded the ZYN British Superbike Championship in 2026)',
    manufacturer: 'Honda',
    raceNumber: 51,
    rider: {
      name: 'Brayden Elliott',
      joined:
        "Brayden returned to the BSB grid with NP Racing from the Knockhill round in June 2026, riding the team's Honda Fireblade. Full season history and results to follow.",
    },
    owner: {
      name: 'Neil Pearson',
      company: 'NP Motorcycles',
    },
    social: {
      instagramHandle: '@npracingbsb',
      instagramUrl: 'https://www.instagram.com/npracingbsb/',
    },
    merchandiseStoreUrl: 'https://www.theclothingkings.co.uk/category/partnerships/npracing/',
  },

  about: {
    heroBadges: ['BSB Since 2004', 'Honda Machinery', 'Taunton, Somerset'],
    story: [
      'NP Racing is a private British Superbike (BSB) team run by Neil Pearson, based in Taunton, Somerset. The team has been involved in racing and the British Superbike paddock since 2004, with its first full season in the premier Superbike class arriving in 2020.',
      'For the 2026 season, NP Racing competes with Honda machinery and continues developing young talent — Brayden Elliott returned to the BSB grid with the team from the Knockhill round in June 2026.',
      'The team is run by Neil Pearson, founder of NP Motorcycles. Under his leadership the business has expanded from a motorcycle servicing and workshop operation into a recognised name in British motorcycle racing.',
    ],
    // Matches the approved mockup's value-strip copy exactly (design-03-number51.html).
    values: [
      {
        title: 'Developing riders',
        description: 'A genuine shot on the BSB grid for young talent.',
      },
      {
        title: 'Pro-prepared Hondas',
        description: 'Professional standard, race after race.',
      },
      {
        title: 'Family operation',
        description: 'Experienced technicians, close-knit crew.',
      },
      {
        title: 'Punching above weight',
        description: 'Competitive against bigger-budget teams.',
      },
    ],
  },
};
