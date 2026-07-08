/**
 * Base Template Site Configuration
 *
 * Generic placeholder configuration for a local service business.
 * Copy this file when creating a new site and replace all placeholder values
 * with actual business information.
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
  slug: 'dch-automotive',
  domain: 'localhost',
  name: 'DCH Automotive',
  tagline: 'Vehicle security and fleet electrics, done properly.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'DCH Automotive',
    legalName: 'DCH Automotive',
    type: 'LocalBusiness',
    phone: '+44 7506 016106',
    email: 'info@DCHautomotive.co.uk',
    address: {
      street: 'Unit H2 Chaucer Business Park',
      city: 'Polegate',
      region: 'East Sussex',
      postalCode: 'BN26 6QH',
      country: 'United Kingdom',
    },
    hours: {
      monday: 'By appointment (usually 8:30 AM - 5:00 PM)',
      tuesday: 'By appointment (usually 8:30 AM - 5:00 PM)',
      wednesday: 'By appointment (usually 8:30 AM - 5:00 PM)',
      thursday: 'By appointment (usually 8:30 AM - 5:00 PM)',
      friday: 'By appointment (usually 8:30 AM - 5:00 PM)',
      saturday: 'By appointment',
      sunday: 'By appointment',
    },
    socialMedia: {
      facebook: 'https://www.facebook.com/DCHautomotive-105166288262588',
      instagram: 'https://www.instagram.com/dchautomotive/',
    },
    geo: {
      latitude: 50.8236,
      longitude: 0.2478,
    },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Car Remaps', href: '/car-remaps' },
      { label: 'Locations', href: '/locations', hasDropdown: true },
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
    copyright: '2026 DCH Automotive. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: '2018',
    stats: [
      { value: '2018', label: 'Established', description: 'Trading since 2018' },
      {
        value: '7',
        label: 'Trade Certifications',
        description: 'City & Guilds, IMI, Thatcham + more',
      },
      {
        value: 'Public & Trade',
        label: 'Who We Serve',
        description: 'Private and motor trade customers',
      },
      { value: 'South East', label: 'Coverage', description: 'Based in Polegate, East Sussex' },
    ],
    certifications: [
      { name: 'City & Guilds', description: 'Certified installer' },
      { name: 'IMI Accredited', description: 'Institute of the Motor Industry' },
      { name: 'Thatcham Approved', description: 'Insurer-recognised security' },
      { name: 'Autowatch Approved', description: 'Approved installer' },
      { name: 'Witter Approved', description: 'Tow bar installer' },
      { name: 'Smartrack Approved', description: 'Tracking installer' },
      { name: 'Thinkware Approved', description: 'Dash cam installer' },
      { name: 'Viezu Approved Dealer', description: 'ECU remapping partner' },
    ],
  },

  serviceAreas: ['Eastbourne', 'Polegate', 'Hailsham'],

  services: [
    {
      title: 'Vehicle Security',
      slug: 'vehicle-security',
      description:
        'Trackers, plant machinery security, immobilisers and motorbike security, fitted by City & Guilds and IMI accredited installers.',
    },
    {
      title: 'Parking Aids',
      slug: 'parking-aids',
      description: 'Flush-fit parking sensors for cars, vans and motorhomes.',
    },
    {
      title: 'Fleet Solutions',
      slug: 'fleet-solutions',
      description:
        'Fleet tracking and reporting, MDVR and dashcam systems, asset tracking, and DVS progressive safe systems for HGVs.',
    },
    {
      title: 'Accessories',
      slug: 'accessories',
      description: 'LED auto lamps and audio upgrades for cars, vans and motorbikes.',
    },
    {
      title: 'Dash Cameras',
      slug: 'dash-cameras',
      description: 'IROAD dash cameras supplied and fitted — front, rear and 4K systems.',
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

  schema: {
    businessType: 'LocalBusiness',
    businessConfig: {
      name: 'DCH Automotive',
      legalName: 'DCH Automotive',
      description:
        'Vehicle security, fleet electrics and Viezu-approved ECU remapping, serving the South East of England from Polegate, East Sussex since 2018.',
      slogan: 'Vehicle security and fleet electrics, done properly.',
      foundingDate: '2018',
      numberOfEmployees: '1-10',
      priceRange: '$$',
      email: 'info@DCHautomotive.co.uk',
      telephone: '+447506016106',
      address: {
        streetAddress: 'Unit H2 Chaucer Business Park',
        addressLocality: 'Polegate',
        addressRegion: 'East Sussex',
        postalCode: 'BN26 6QH',
        addressCountry: 'GB',
      },
      geo: {
        latitude: '50.8236',
        longitude: '0.2478',
      },
      openingHours: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:30',
          closes: '17:00',
        },
      ],
      areaServed: ['Eastbourne', 'Polegate', 'Hailsham', 'South East England'],
      credentials: [
        { name: 'City & Guilds', description: 'Certified installer', category: 'certification' },
        {
          name: 'IMI Accredited',
          description: 'Institute of the Motor Industry',
          category: 'certification',
        },
        {
          name: 'Thatcham Approved',
          description: 'Insurer-recognised vehicle security',
          category: 'certification',
        },
        {
          name: 'Viezu Approved Dealer',
          description: 'ECU remapping partner, KESS3 hardware',
          category: 'certification',
        },
      ],
      socialProfiles: [
        'https://www.facebook.com/DCHautomotive-105166288262588',
        'https://www.instagram.com/dchautomotive/',
      ],
      knowsAbout: [
        'Vehicle Security',
        'Fleet Electrics',
        'ECU Remapping',
        'Dash Camera Installation',
        'Parking Sensor Fitting',
      ],
      offerCatalog: [
        {
          name: 'Vehicle Security',
          description: 'Trackers, plant machinery security, immobilisers and motorbike security',
          url: '/services/vehicle-security',
        },
        {
          name: 'Parking Aids',
          description: 'Flush-fit parking sensors for cars, vans and motorhomes',
          url: '/services/parking-aids',
        },
        {
          name: 'Fleet Solutions',
          description:
            'Fleet tracking, MDVR/dashcam systems, asset tracking and DVS progressive safe systems',
          url: '/services/fleet-solutions',
        },
        {
          name: 'Accessories',
          description: 'LED auto lamps and audio upgrades',
          url: '/services/accessories',
        },
        {
          name: 'Dash Cameras',
          description: 'IROAD dash cameras supplied and fitted',
          url: '/services/dash-cameras',
        },
      ],
    },
  },

  about: {
    heroBadges: ['Est. 2018', 'City & Guilds Certified', 'Viezu Approved Dealer'],
    story: [
      'Founded in 2018, DCH Automotive was built on a simple promise: deliver professional vehicle security and electrical work that our customers — and the trade — can count on every time.',
      'From our base in Polegate, we serve private and motor trade customers across Eastbourne, Hailsham and the wider South East, fitting everything from trackers and immobilisers to fleet camera systems and Viezu-approved ECU remapping.',
      'Today we are proud to be a trusted name in vehicle security — known for honest pricing, City & Guilds and IMI accredited workmanship, and the kind of service that earns referrals from private customers and trade partners alike.',
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
