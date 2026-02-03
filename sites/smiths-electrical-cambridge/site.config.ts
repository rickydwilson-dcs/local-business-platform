/**
 * Smith's Electrical Services - Site Configuration
 *
 * Generated from project file: 550e8400-e29b-41d4-a716-446655440000
 * Generated at: 2026-02-03T13:53:41.050Z
 */

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
}

export const siteConfig: SiteConfig = {
  name: "Smith's Electrical Services",
  tagline: "Cambridge's Trusted Electricians",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smithselectrical.co.uk',

  business: {
    name: "Smith's Electrical Services",
    legalName: "Smith's Electrical Ltd",
    type: 'HomeAndConstructionBusiness',
    phone: '01234 567890',
    email: 'info@smithselectrical.co.uk',
    address: {
      street: '45 High Street',
      city: 'Cambridge',
      region: 'Cambridgeshire',
      postalCode: 'CB2 1LA',
      country: 'United Kingdom',
    },
    hours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed',
    },
    socialMedia: {
      facebook: 'https://facebook.com/smithselectrical',

      instagram: 'https://instagram.com/smithselectrical',
    },
    geo: {
      latitude: 52.2053,
      longitude: 0.1218,
    },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Locations', href: '/locations', hasDropdown: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Get Free Quote',
      href: '/contact',
    },
    phone: {
      show: true,
      label: 'Call Us',
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 10,
    maxLocations: 12,
    copyright: "2026 Smith's Electrical Services. All rights reserved.",
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: '2010',
    stats: [
      {
        value: '16+',
        label: 'Years Experience',
        description: 'Serving local customers',
      },
      {
        value: '500+',
        label: 'Projects Completed',
        description: 'Satisfied clients',
      },
      {
        value: '100%',
        label: 'Satisfaction',
        description: 'Customer focused',
      },
      {
        value: '24/7',
        label: 'Emergency Service',
        description: 'Always available',
      },
    ],
    certifications: [
      {
        name: 'NICEIC Approved Contractor',
        description: 'NICEIC',
      },
      {
        name: 'Part P Registered',
        description: 'Part P Scheme',
      },
      {
        name: 'TrustMark',
        description: 'TrustMark',
      },
    ],
    insurance: { amount: '£5M', type: 'Public Liability' },
  },

  serviceAreas: ['Cambridgeshire'],

  serviceAreaRegions: [
    {
      name: 'Cambridgeshire',
      slug: 'cambridgeshire',
      towns: [
        {
          name: 'Cambridge',
          slug: 'cambridge',
        },
        {
          name: 'Ely',
          slug: 'ely',
        },
        {
          name: 'Huntingdon',
          slug: 'huntingdon',
        },
      ],
    },
  ],

  services: [
    {
      title: 'Domestic Electrical Services',
      slug: 'domestic-electrical',
      description: 'Complete electrical services for homes across Cambridgeshire',
    },
    {
      title: 'EICR Testing & Certification',
      slug: 'eicr-testing',
      description: 'Electrical Installation Condition Reports for landlords and homeowners',
    },
    {
      title: 'EV Charger Installation',
      slug: 'ev-charger-installation',
      description: 'Electric vehicle charging point installation for homes and businesses',
    },
    {
      title: 'Smart Home Installation',
      slug: 'smart-home',
      description: 'Transform your home with smart lighting and automation',
    },
  ],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: false,
  },
};
