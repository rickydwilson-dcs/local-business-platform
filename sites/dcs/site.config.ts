/**
 * Digital Consulting Services — Site Configuration
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
  } | null;
}

export interface CredentialStat {
  value: string;
  label: string;
  description?: string;
  icon?: string;
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

export interface SiteConfig extends BaseSiteConfig {
  /** Site name and branding */
  name: string;
  tagline: string;
  url: string;

  /** Business information */
  business: {
    name: string;
    legalName: string;
    type: 'LocalBusiness' | 'ProfessionalService' | 'HomeAndConstructionBusiness' | 'Plumber';
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

  /** Optional rich about page content */
  about?: {
    heroBadges?: string[];
    story?: string[];
    whyChooseUs?: string[];
    values?: Array<{
      title: string;
      description: string;
    }>;
  };

  /** Testimonials */
  testimonials?: Array<{
    name: string;
    trade: string;
    quote: string;
  }>;
}

export const siteConfig: SiteConfig = {
  slug: 'dcs',
  domain: 'digitalconsultingservices.co.uk',
  name: 'Digital Consulting Services',
  tagline: 'Websites that get small businesses more customers',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalconsultingservices.co.uk',

  business: {
    name: 'Digital Consulting Services',
    legalName: 'Digital Consulting Services Ltd',
    type: 'ProfessionalService',
    phone: '+44 7383 666268',
    email: 'mail@digitalconsultingservices.co.uk',
    address: {
      street: 'Unit H3, Chaucer Business Park, Dittons Road',
      city: 'Polegate',
      region: 'East Sussex',
      postalCode: 'BN26 6QH',
      country: 'United Kingdom',
    },
    hours: {
      monday: '9:00 AM - 5:30 PM',
      tuesday: '9:00 AM - 5:30 PM',
      wednesday: '9:00 AM - 5:30 PM',
      thursday: '9:00 AM - 5:30 PM',
      friday: '9:00 AM - 5:30 PM',
      saturday: 'By Appointment',
      sunday: 'Closed',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/digital-consulting-services',
    },
    geo: {
      latitude: 50.8233,
      longitude: 0.2557,
    },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Portfolio', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ],
  },

  cta: {
    primary: {
      label: 'Get a free quote',
      href: '/contact',
    },
    phone: {
      show: true,
      label: 'Call 07383 666268',
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 4,
    maxLocations: 6,
    copyright: '© 2026 Digital Consulting Services. All rights reserved.',
    builtBy: null,
  },

  credentials: {
    yearEstablished: '2019',
    stats: [
      { value: '5+', label: 'Years Building Local Websites', icon: 'schedule' },
      { value: '20+', label: 'Sites Delivered', icon: 'language' },
      { value: '100%', label: 'Managed — We Handle Everything', icon: 'support_agent' },
    ],
    certifications: [],
  },

  serviceAreas: [
    'Polegate',
    'Eastbourne',
    'Hailsham',
    'Lewes',
    'Seaford',
    'Brighton',
    'Hove',
    'Uckfield',
  ],

  services: [
    {
      slug: 'web-design',
      title: 'Website Design',
      description: 'Bespoke websites built for local tradespeople. No templates, no DIY.',
    },
    {
      slug: 'local-seo',
      title: 'Local SEO',
      description:
        'Built-in local SEO: service pages, location pages, Schema markup, Google ranking.',
    },
    {
      slug: 'monthly-management',
      title: 'Ongoing Management',
      description: 'We look after your site so you can focus on your trade.',
    },
    {
      slug: 'google-workspace',
      title: 'Google Workspace Email',
      description: 'Professional business email setup via Google Workspace.',
    },
    {
      slug: 'ecommerce',
      title: 'eCommerce Websites',
      description:
        'Start selling online with a WooCommerce or custom store — we build it and load your products.',
    },
    {
      slug: 'analytics',
      title: 'Analytics & Reporting',
      description:
        "Google Analytics setup, Search Console, and monthly traffic reports so you know what's working.",
    },
  ],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: true,
  },

  schema: {
    businessType: 'ProfessionalService',
    businessConfig: {
      name: 'Digital Consulting Services',
      legalName: 'Digital Consulting Services Ltd',
      description:
        'Digital Consulting Services builds websites for local tradespeople across the UK. Based in Polegate, East Sussex.',
      slogan: 'Websites that get local tradespeople more jobs',
      foundingDate: '2019',
      email: 'mail@digitalconsultingservices.co.uk',
      telephone: '+447383666268',
      address: {
        streetAddress: 'Unit H3, Chaucer Business Park, Dittons Road',
        addressLocality: 'Polegate',
        addressRegion: 'East Sussex',
        postalCode: 'BN26 6QH',
        addressCountry: 'GB',
      },
      geo: {
        latitude: '50.8233',
        longitude: '0.2557',
      },
      openingHours: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:30',
        },
        {
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '12:00',
        },
      ],
      areaServed: [
        'Polegate',
        'Eastbourne',
        'Hailsham',
        'Lewes',
        'Seaford',
        'Brighton',
        'Hove',
        'Uckfield',
        'UK-wide',
      ],
      socialProfiles: ['https://linkedin.com/company/digital-consulting-services'],
      knowsAbout: [
        'website design',
        'local SEO',
        'web development',
        'tradespeople websites',
        'Google Workspace',
      ],
      offerCatalog: [
        {
          name: 'Website Design',
          description: 'Bespoke websites for tradespeople',
          url: '/services/web-design',
        },
        {
          name: 'Local SEO',
          description: 'Built-in local SEO with service and location pages',
          url: '/services/local-seo',
        },
        {
          name: 'Ongoing Management',
          description: 'Full website management so you focus on your trade',
          url: '/services/monthly-management',
        },
        {
          name: 'Google Workspace Email',
          description: 'Professional business email setup',
          url: '/services/google-workspace',
        },
        {
          name: 'eCommerce Websites',
          description: 'WooCommerce and custom online stores, built and loaded with products',
          url: '/services/ecommerce',
        },
        {
          name: 'Analytics & Reporting',
          description: 'Google Analytics, Search Console setup and monthly traffic reporting',
          url: '/services/analytics',
        },
      ],
    },
  },

  about: {
    heroBadges: ['Est. 2019', 'East Sussex', 'UK-Wide'],
    story: [
      'Digital Consulting Services was founded in 2019 to help local tradespeople get more work from the internet. We build websites that look professional, load fast, and rank on Google — without the jargon or the high price tag.',
      "Based in Polegate, East Sussex, we work with electricians, plumbers, scaffolders, builders, and other tradespeople across the UK. Every site we build comes with local SEO built in — service pages, location pages, and Schema markup — because a website that can't be found isn't worth having.",
      "We handle everything: design, build, hosting, and ongoing management. You focus on your trade. We'll keep your website working.",
    ],
    whyChooseUs: [
      'Bespoke design — not a template you fiddle with',
      'Local SEO built into every site',
      'Managed hosting, SSL, and support included',
      'No login, no CMS to learn — we handle updates',
      'Fixed pricing, no surprise bills',
      'Based in East Sussex, serving tradespeople UK-wide',
    ],
    values: [
      {
        title: 'Results-first',
        description:
          "A website that doesn't get you more work isn't doing its job. We measure success by your enquiries, not our design awards.",
      },
      {
        title: 'No jargon',
        description:
          "We explain what we're doing in plain English. No technical overwhelm, no unnecessary complexity.",
      },
      {
        title: 'Always reachable',
        description:
          "You can call or email us when you need us. We're a small team that cares about every client.",
      },
    ],
  },

  testimonials: [
    {
      name: 'Sarah',
      trade: 'Cuddle Plush Fabrics',
      quote:
        "Ricky has built and managed our online store for over 5 years. I couldn't be happier with his work.",
    },
    {
      name: 'Nicola',
      trade: 'Nicola Noble Tuition',
      quote:
        'I feared I would have to close my tutoring business when Covid struck, but now offer my classes online.',
    },
    {
      name: 'Molly',
      trade: 'Sanctuary Ida',
      quote: 'My yoga students love that they can book and pay for my classes on my website.',
    },
  ],
};
