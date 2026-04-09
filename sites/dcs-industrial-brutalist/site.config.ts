/**
 * DCS Site Configuration
 *
 * Digital Consulting Services — digitalconsultingservices.co.uk
 * Polaris theme (Tactical Telemetry / Industrial Brutalist)
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
}

export interface SiteConfig extends BaseSiteConfig {
  name: string;
  tagline: string;
  url: string;

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

  navigation: {
    main: NavItem[];
  };

  cta: CTAConfig;

  footer: FooterConfig;

  credentials: CredentialsConfig;

  /** Service areas — empty for digital agency (not geographically restricted) */
  serviceAreas: string[];

  services: {
    title: string;
    slug: string;
    description: string;
  }[];

  features: {
    analytics: boolean;
    consentBanner: boolean;
    contactForm: boolean;
    rateLimit: boolean;
    testimonials: boolean;
    blog: boolean;
  };

  schema: {
    businessConfig: BusinessConfig;
    businessType: LocalBusinessSchemaOptions['businessType'];
  };
}

export const siteConfig: SiteConfig = {
  slug: 'dcs-industrial-brutalist',
  domain: 'digitalconsultingservices.co.uk',
  name: 'Digital Consulting Services',
  tagline: 'Websites as intelligent as your business',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'Digital Consulting Services',
    legalName: 'Digital Consulting Services',
    type: 'ProfessionalService',
    phone: '0800 XXX XXXX',
    email: 'hello@digitalconsultingservices.co.uk',
    address: {
      street: '',
      city: 'United Kingdom',
      region: '',
      postalCode: '',
      country: 'GB',
    },
    hours: {
      monday: '9:00 AM - 5:30 PM',
      tuesday: '9:00 AM - 5:30 PM',
      wednesday: '9:00 AM - 5:30 PM',
      thursday: '9:00 AM - 5:30 PM',
      friday: '9:00 AM - 5:30 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/digital-consulting-services',
    },
    geo: { latitude: 51.5074, longitude: -0.1278 },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/projects' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: { label: '[ INITIATE CONTACT ]', href: '/contact' },
    phone: { show: false },
  },

  footer: {
    showServices: true,
    showLocations: false,
    maxServices: 6,
    maxLocations: 0,
    copyright: '2026 Digital Consulting Services',
  },

  credentials: {
    yearEstablished: '2015',
    stats: [
      { value: '047', label: 'Sites Deployed' },
      { value: '99.9%', label: 'Uptime' },
      { value: '023', label: 'Clients Served' },
    ],
    certifications: [],
  },

  serviceAreas: ['United Kingdom'],

  services: [
    {
      title: 'Platform Websites',
      slug: 'platform-websites',
      description:
        'Custom sites deployed on our proprietary platform. Fast, themed, SEO-optimized.',
    },
    {
      title: 'AI Automation',
      slug: 'ai-automation',
      description: 'AI-powered workflows, chatbots, and business automation systems.',
    },
    {
      title: 'Ecommerce Solutions',
      slug: 'ecommerce',
      description: 'Online shops with payment processing, inventory, and order management.',
    },
    {
      title: 'Web Design',
      slug: 'web-design',
      description: 'Brand identity, UI/UX design, and responsive layouts.',
    },
    {
      title: 'SEO & Analytics',
      slug: 'seo-analytics',
      description: 'Search optimization, GA4 setup, and performance tracking.',
    },
    {
      title: 'Maintenance & Support',
      slug: 'maintenance',
      description: 'Ongoing updates, security monitoring, and technical support.',
    },
  ],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    testimonials: false,
    blog: true,
  },

  schema: {
    businessType: 'ProfessionalService',
    businessConfig: {
      name: 'Digital Consulting Services',
      legalName: 'Digital Consulting Services',
      description:
        'Digital Consulting Services builds websites, AI automation systems, and ecommerce platforms for UK businesses.',
      slogan: 'Websites as intelligent as your business',
      foundingDate: '2015',
      numberOfEmployees: '1-10',
      priceRange: '$$',
      email: 'hello@digitalconsultingservices.co.uk',
      telephone: '0800XXXXXXX',
      address: {
        streetAddress: '',
        addressLocality: 'United Kingdom',
        addressRegion: '',
        postalCode: '',
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
          closes: '17:30',
        },
      ],
      areaServed: ['United Kingdom'],
      credentials: [],
      socialProfiles: ['https://www.linkedin.com/company/digital-consulting-services'],
      knowsAbout: ['Web Development', 'AI Automation', 'Ecommerce', 'SEO', 'Digital Strategy'],
      offerCatalog: [
        {
          name: 'Platform Websites',
          description: 'Custom sites on our proprietary platform',
          url: '/services/platform-websites',
        },
        {
          name: 'AI Automation',
          description: 'AI-powered workflows and chatbots',
          url: '/services/ai-automation',
        },
        {
          name: 'Ecommerce Solutions',
          description: 'Online shops with payment processing',
          url: '/services/ecommerce',
        },
        {
          name: 'Web Design',
          description: 'Brand identity and UI/UX design',
          url: '/services/web-design',
        },
        {
          name: 'SEO & Analytics',
          description: 'Search optimization and GA4',
          url: '/services/seo-analytics',
        },
        {
          name: 'Maintenance & Support',
          description: 'Ongoing updates and security',
          url: '/services/maintenance',
        },
      ],
    },
  },
};
