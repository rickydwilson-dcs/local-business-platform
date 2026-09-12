/**
 * DPM Autobody Site Configuration
 *
 * Real business facts, sourced from output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/
 * client-brief.md and the 2026-09-08 review-meeting content in that session's BACKLOG.md.
 * Fields marked UNCONFIRMED below are not yet known — confirm with David before relying on them
 * anywhere user-facing (they currently only feed schema.org JSON-LD, not visible page copy).
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

export interface SiteConfig extends BaseSiteConfig {
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
      youtube?: string;
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

  /** Featured services (schema.org / metadata only — no dedicated /services route) */
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
}

export const siteConfig: SiteConfig = {
  slug: 'dpm-autobody',
  domain: 'dpmautobody.co.uk',
  name: 'DPM Autobody',
  tagline: 'High-end concours car restoration',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'DPM Autobody',
    // UNCONFIRMED — no registered company name given in the brief; using the trading name.
    legalName: 'DPM Autobody',
    type: 'LocalBusiness',
    phone: '01323 552827',
    email: 'info@dpmautobody.co.uk',
    address: {
      // UNCONFIRMED — David has not given a street address or postcode yet.
      street: '',
      city: 'Berwick',
      region: 'East Sussex',
      postalCode: '',
      country: 'United Kingdom',
    },
    hours: {
      // UNCONFIRMED — no opening hours given in the brief yet.
      monday: 'TBC',
      tuesday: 'TBC',
      wednesday: 'TBC',
      thursday: 'TBC',
      friday: 'TBC',
      saturday: 'TBC',
      sunday: 'TBC',
    },
    socialMedia: {
      // Facebook handle confirmed in client-brief.md. Instagram/YouTube URLs below are
      // transcribed verbatim from the approved static prototype's own colophon markup
      // (output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/
      // library.html ~L1732-1740, repeated identically on every other prototype page) —
      // not guessed.
      facebook: 'https://facebook.com/dpmautobody',
      instagram: 'https://www.instagram.com/dpm_autobody/',
      youtube: 'https://www.youtube.com/channel/UC3ZpDFw1FbgXrMy5CCONqyw',
    },
    // No geo omitted deliberately — no confirmed address to place a pin against yet.
  },

  navigation: {
    // Originally matched the approved prototype's masthead nav exactly — see
    // output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html
    // ~L1269-1278 (and workshop.html/contact.html, which repeat the same 4-item set with the
    // current page marked `is-active` rather than removed from the list). "Proof" is still an
    // in-page anchor on the homepage (home-page.tsx has id="proof"); "The Workshop" and "Contact"
    // are real routes. "The Work" was changed 2026-09-12, at Ricky's request, from the homepage's
    // `#work` in-page anchor to `/library` — the real, full register of every build, not just the
    // four featured on the homepage. The `id="work"` anchor on the homepage itself is unchanged
    // (nothing else linked to it), only this nav entry's target moved.
    main: [
      { label: 'The Work', href: '/library' },
      { label: 'The Workshop', href: '/workshop' },
      { label: 'Proof', href: '/#proof' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Enquire',
      href: '/contact',
    },
    phone: {
      show: true,
      label: 'Call Us',
    },
  },

  footer: {
    showServices: false,
    showLocations: false,
    maxServices: 0,
    maxLocations: 0,
    copyright: `${new Date().getFullYear()} DPM Autobody. All rights reserved.`,
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    // UNCONFIRMED — no founding year, stats, or certifications given in the brief. Left empty
    // rather than inventing numbers; the approved design (evidence, not shop self-image) doesn't
    // call for a stats strip anyway.
    yearEstablished: 'TBC',
    stats: [],
    certifications: [],
  },

  // Real location, used for schema.org areaServed only — DPM is a single workshop, not a
  // multi-location trade business, so there is no /locations route.
  serviceAreas: ['Berwick, East Sussex'],

  // Schema.org / metadata only — grounded in client-brief.md's own description of the business.
  // No dedicated /services route; the site's real structure is home/workshop/library/builds.
  services: [
    {
      title: 'Concours Restoration',
      slug: 'concours-restoration',
      description: 'High-end concours-standard classic car restoration, hand-crafted in house.',
    },
    {
      title: 'Coachwork & Paint',
      slug: 'coachwork-and-paint',
      description: "Paintwork and bodywork finishing — the workshop's own core speciality.",
    },
    {
      title: 'Bodywork & Fabrication',
      slug: 'bodywork-and-fabrication',
      description: 'In-house bodywork, panel and fabrication work for full restorations.',
    },
  ],

  features: {
    analytics: false,
    consentBanner: false,
    // The current prototype's enquiry form is mocked (onsubmit="return false") — not wired to
    // a real handler yet. Flip once the real contact page is built and wired.
    contactForm: false,
    rateLimit: true,
    testimonials: true,
    blog: false,
  },

  schema: {
    businessType: 'LocalBusiness',
    businessConfig: {
      name: 'DPM Autobody',
      legalName: 'DPM Autobody',
      description:
        'High-end concours classic car restoration in Berwick, East Sussex. Bodywork, coachwork and paint hand-crafted in house.',
      email: 'info@dpmautobody.co.uk',
      telephone: '+441323552827',
      address: {
        // UNCONFIRMED street/postcode — see business.address above.
        streetAddress: '',
        addressLocality: 'Berwick',
        addressRegion: 'East Sussex',
        postalCode: '',
        addressCountry: 'GB',
      },
      geo: {
        // Approximate Berwick, East Sussex village-centre coordinates (general geographic
        // knowledge, not a confirmed workshop address) — refine once David gives a real address.
        latitude: '50.8657',
        longitude: '0.1897',
      },
      openingHours: [],
      areaServed: ['Berwick, East Sussex'],
      socialProfiles: ['https://facebook.com/dpmautobody'],
      knowsAbout: [
        'Concours Car Restoration',
        'Classic Car Coachwork & Paint',
        'Classic Car Bodywork',
      ],
      offerCatalog: [
        {
          name: 'Concours Restoration',
          description: 'High-end concours-standard classic car restoration, hand-crafted in house.',
          url: '/workshop',
        },
      ],
    },
  },
};
