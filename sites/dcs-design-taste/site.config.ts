/**
 * Digital Consulting Services — Site Configuration
 *
 * Platform websites + AI automation agency.
 * Pivoting from WordPress services to the Local Business Platform.
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

  about?: {
    heroBadges?: string[];
    story?: string[];
    whyChooseUs?: string[];
    values?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export const siteConfig: SiteConfig = {
  slug: 'dcs-design-taste',
  domain: 'digitalconsultingservices.co.uk',
  name: 'Digital Consulting Services',
  tagline: 'Websites as intelligent as your business',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalconsultingservices.co.uk',

  business: {
    name: 'Digital Consulting Services',
    legalName: 'Digital Consulting Services Ltd',
    type: 'ProfessionalService',
    phone: '+44 800 123 4567',
    email: 'hello@digitalconsultingservices.co.uk',
    address: {
      street: '1 Platform House',
      city: 'London',
      region: 'England',
      postalCode: 'EC1A 1BB',
      country: 'United Kingdom',
    },
    hours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/digitalconsultingservices',
      twitter: 'https://twitter.com/dcs_platform',
    },
    geo: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
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
    primary: {
      label: 'Start a Project',
      href: '/contact',
    },
    phone: {
      show: false,
    },
  },

  footer: {
    showServices: true,
    showLocations: false,
    maxServices: 6,
    maxLocations: 0,
    copyright: '2015 Digital Consulting Services Ltd. All rights reserved.',
  },

  credentials: {
    yearEstablished: '2015',
    stats: [
      { value: '47', label: 'Sites deployed', description: 'Platform websites live' },
      { value: '9', label: 'Years established', description: 'Since 2015' },
      { value: '23', label: 'Active clients', description: 'Under management' },
      { value: '99.3%', label: 'Uptime', description: 'Across all hosted sites' },
    ],
    certifications: [
      { name: 'Google Partner', description: 'Certified Google Partner agency' },
      { name: 'Next.js Experts', description: 'Full-stack Next.js development' },
    ],
  },

  serviceAreas: ['United Kingdom'],

  services: [
    {
      title: 'Platform Websites',
      slug: 'platform-websites',
      description: 'White-label websites built on our managed platform with automated deployment and updates.',
    },
    {
      title: 'AI Automation',
      slug: 'ai-automation',
      description: 'Intelligent automation workflows that connect your tools and eliminate manual processes.',
    },
    {
      title: 'eCommerce Solutions',
      slug: 'ecommerce',
      description: 'Scalable eCommerce builds optimized for conversion and search visibility.',
    },
    {
      title: 'Web Design',
      slug: 'web-design',
      description: 'Brand-led web design that communicates authority and builds trust.',
    },
    {
      title: 'SEO and Analytics',
      slug: 'seo-analytics',
      description: 'Technical SEO, structured data, and analytics that drive measurable organic growth.',
    },
    {
      title: 'Maintenance and Support',
      slug: 'maintenance',
      description: 'Ongoing platform management, security updates, and priority technical support.',
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
      legalName: 'Digital Consulting Services Ltd',
      description:
        'Platform websites and AI automation for UK businesses. We build and manage intelligent websites that grow with your business.',
      slogan: 'Websites as intelligent as your business',
      foundingDate: '2015',
      numberOfEmployees: '1-10',
      priceRange: '\u00a3\u00a3\u00a3',
      email: 'hello@digitalconsultingservices.co.uk',
      telephone: '+448001234567',
      address: {
        streetAddress: '1 Platform House',
        addressLocality: 'London',
        addressRegion: 'England',
        postalCode: 'EC1A 1BB',
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
      areaServed: ['United Kingdom'],
      credentials: [
        {
          name: 'Google Partner',
          description: 'Certified Google Partner agency',
          category: 'certification',
        },
      ],
      socialProfiles: [
        'https://linkedin.com/company/digitalconsultingservices',
        'https://twitter.com/dcs_platform',
      ],
      knowsAbout: [
        'Platform Websites',
        'AI Automation',
        'eCommerce Development',
        'Technical SEO',
        'Next.js Development',
        'Web Design',
      ],
      offerCatalog: [
        {
          name: 'Platform Websites',
          description: 'White-label websites on our managed platform',
          url: '/services/platform-websites',
        },
        {
          name: 'AI Automation',
          description: 'Intelligent automation workflows',
          url: '/services/ai-automation',
        },
        {
          name: 'eCommerce Solutions',
          description: 'Scalable eCommerce builds',
          url: '/services/ecommerce',
        },
      ],
    },
  },

  about: {
    heroBadges: ['Est. 2015', 'United Kingdom', 'Platform-First'],
    story: [
      'Digital Consulting Services was founded in 2015 with one goal: help local businesses compete online without the overhead of agency retainers or bespoke CMS headaches.',
      'In 2024 we rebuilt from the ground up — replacing WordPress with a managed Next.js platform and integrating AI automation into everything from content generation to client reporting.',
      'Today we manage 47 live sites across the UK, deploy new sites in days not months, and help our clients spend time on their business rather than chasing their web agency.',
    ],
    whyChooseUs: [
      'Platform-managed hosting — no server admin for clients',
      'AI-assisted content and automation built in',
      'Technical SEO and structured data by default',
      'Transparent monthly reporting with real numbers',
      'Fixed-price delivery — no hourly billing surprises',
      'Dedicated account manager from day one',
    ],
    values: [
      {
        title: 'Precision',
        description: 'We ship what we scope. No feature creep, no hidden costs.',
      },
      {
        title: 'Velocity',
        description: 'Fast iteration without cutting corners on quality or security.',
      },
      {
        title: 'Intelligence',
        description: 'AI automation woven into every workflow, not bolted on as an afterthought.',
      },
    ],
  },
};
