/**
 * Base Template Site Configuration
 *
 * Generic placeholder configuration for a local service business.
 * Copy this file when creating a new site and replace all placeholder values
 * with actual business information.
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
    geo: {
      latitude: 51.5074,
      longitude: -0.1278,
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
