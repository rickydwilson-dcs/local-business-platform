/**
 * D J Fox Electrical - Site Configuration
 *
 * Generated from project file: 550e8400-e29b-41d4-a716-446655440015
 * Generated at: 2026-02-15T19:18:53.726Z
 */

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

export interface SiteConfig {
  /** Site name and branding */
  name: string;
  slug: string;
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
}

export const siteConfig: SiteConfig = {
  name: 'D J Fox Electrical',
  slug: 'dj-fox-electrical',
  tagline: 'Your trusted electrical experts in Eastbourne',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.djfoxelectrical.com',

  business: {
    name: 'D J Fox Electrical',
    legalName: 'D J Fox Electrical Ltd',
    type: 'HomeAndConstructionBusiness',
    phone: '01323 123456',
    email: 'info@djfoxelectrical.com',
    address: {
      street: 'Mobile Service',
      city: 'Eastbourne',
      region: 'East Sussex',
      postalCode: 'BN21 1XX',
      country: 'United Kingdom',
    },
    hours: {
      monday: '24/7 Emergency Service',
      tuesday: '24/7 Emergency Service',
      wednesday: '24/7 Emergency Service',
      thursday: '24/7 Emergency Service',
      friday: '24/7 Emergency Service',
      saturday: '24/7 Emergency Service',
      sunday: '24/7 Emergency Service',
    },
    socialMedia: {
      facebook: 'https://facebook.com/djfoxelectrical',

      instagram: 'https://instagram.com/djfoxelectrical',
    },
    geo: {
      latitude: 50.7604,
      longitude: 0.2799,
    },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Locations', href: '/locations', hasDropdown: true },
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
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
    copyright: '2026 D J Fox Electrical. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: '2025',
    stats: [
      {
        value: '15+',
        label: 'Years Expertise',
        description: 'Professional electrical experience',
      },
      {
        value: 'NICEIC',
        label: 'Approved',
        description: 'Certified contractor',
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
        name: 'Part P Registered Electrician',
        description: 'Part P Scheme',
      },
      {
        name: 'TrustMark Government Endorsed Scheme',
        description: 'TrustMark',
      },
    ],
    insurance: { amount: '£5M', type: 'Public Liability' },
  },

  serviceAreas: ['East Sussex'],

  serviceAreaRegions: [
    {
      name: 'East Sussex',
      slug: 'east-sussex',
      towns: [
        {
          name: 'Eastbourne',
          slug: 'eastbourne',
        },
        {
          name: 'Brighton & Hove',
          slug: 'brighton-hove',
        },
        {
          name: 'Hastings',
          slug: 'hastings',
        },
        {
          name: 'Bexhill',
          slug: 'bexhill',
        },
        {
          name: 'Lewes',
          slug: 'lewes',
        },
        {
          name: 'Seaford',
          slug: 'seaford',
        },
        {
          name: 'Newhaven',
          slug: 'newhaven',
        },
        {
          name: 'Hailsham',
          slug: 'hailsham',
        },
        {
          name: 'Polegate',
          slug: 'polegate',
        },
        {
          name: 'Crowborough',
          slug: 'crowborough',
        },
      ],
    },
  ],

  services: [
    {
      title: '24/7 Emergency Electrical Callout',
      slug: 'emergency-electrical-callout',
      description:
        'Round-the-clock emergency electrician service for urgent electrical issues that cannot wait until morning.',
    },
    {
      title: 'Power Outage Restoration',
      slug: 'power-outage-restoration',
      description:
        'Rapid diagnosis and restoration of power when your home or business experiences a sudden electrical outage.',
    },
    {
      title: 'Electrical Fault Finding',
      slug: 'fault-finding',
      description:
        'Professional diagnostic service to locate and identify electrical faults causing problems in your property.',
    },
    {
      title: 'Consumer Unit Upgrade',
      slug: 'consumer-unit-upgrade',
      description:
        'Upgrade your old fuse box to a modern consumer unit with RCD protection for improved safety and compliance.',
    },
    {
      title: 'Full House Rewiring',
      slug: 'rewiring',
      description:
        'Complete electrical rewiring of your property to bring it up to current safety standards and meet modern demands.',
    },
    {
      title: 'Additional Socket Installation',
      slug: 'additional-sockets',
      description:
        'Installation of new electrical sockets in convenient locations to meet your power needs.',
    },
    {
      title: 'USB Socket Installation',
      slug: 'usb-socket-installation',
      description:
        'Replace standard sockets with USB-integrated sockets for convenient device charging without adaptors.',
    },
    {
      title: 'Outdoor Socket Installation',
      slug: 'outdoor-socket-installation',
      description:
        'Weatherproof external socket installation for gardens, garages and outdoor power needs.',
    },
    {
      title: 'EV Charger Installation',
      slug: 'ev-charger-installation',
      description:
        'Professional installation of electric vehicle charging points at your home with OZEV grant assistance where eligible.',
    },
    {
      title: 'Lighting Installation',
      slug: 'lighting-installation',
      description:
        'Professional installation of all types of lighting including downlights, pendants, wall lights and feature lighting.',
    },
    {
      title: 'LED Lighting Upgrade',
      slug: 'led-lighting-upgrade',
      description:
        'Upgrade your existing lighting to energy-efficient LED to reduce electricity bills and improve light quality.',
    },
    {
      title: 'Garden Lighting Installation',
      slug: 'garden-lighting',
      description:
        'Transform your outdoor space with professionally installed garden lighting for ambience and security.',
    },
    {
      title: 'Dimmer Switch Installation',
      slug: 'dimmer-switch-installation',
      description:
        'Installation of dimmer switches to control lighting levels and create the perfect ambience in any room.',
    },
    {
      title: 'Socket Repair & Replacement',
      slug: 'socket-repair',
      description:
        'Repair or replacement of faulty, damaged or outdated electrical sockets to restore safe operation.',
    },
    {
      title: 'Light Switch Repair & Replacement',
      slug: 'light-switch-repair',
      description:
        'Repair or replacement of faulty light switches including upgrades to modern styles.',
    },
    {
      title: 'Circuit Repair',
      slug: 'circuit-repair',
      description:
        'Diagnosis and repair of faulty electrical circuits to restore safe and reliable power supply.',
    },
    {
      title: 'Extractor Fan Installation',
      slug: 'extractor-fan-installation',
      description:
        'Installation of extractor fans in bathrooms, kitchens and utility rooms to improve ventilation and reduce damp.',
    },
    {
      title: 'Electrical Installation Condition Report (EICR)',
      slug: 'electrical-safety-certificate',
      description:
        'Comprehensive inspection and testing of your electrical installation with a formal safety certificate.',
    },
    {
      title: 'PAT Testing',
      slug: 'pat-testing',
      description:
        'Portable Appliance Testing for businesses and landlords to ensure electrical equipment is safe to use.',
    },
    {
      title: 'Emergency Lighting Testing',
      slug: 'emergency-lighting-testing',
      description:
        'Regular testing and maintenance of emergency lighting systems to ensure compliance with fire safety regulations.',
    },
    {
      title: 'Smart Lighting Installation',
      slug: 'smart-lighting',
      description:
        'Installation and setup of smart lighting systems you can control from your phone or voice assistants.',
    },
    {
      title: 'Smart Home Wiring',
      slug: 'smart-home-wiring',
      description:
        'Future-proof your home with structured cabling and wiring for smart home devices and automation.',
    },
    {
      title: 'Security Lighting Installation',
      slug: 'security-lighting',
      description:
        'Installation of motion-sensor security lights to deter intruders and improve safety around your property.',
    },
    {
      title: 'Smoke & Fire Alarm Installation',
      slug: 'fire-alarm-installation',
      description:
        'Installation of smoke detectors, heat detectors and carbon monoxide alarms to protect your family.',
    },
    {
      title: 'Additional Circuit Installation',
      slug: 'additional-circuits',
      description:
        'Installation of new dedicated electrical circuits for high-power appliances or to distribute load safely.',
    },
    {
      title: 'Electric Shower Installation',
      slug: 'electric-shower-installation',
      description:
        'Professional installation of electric shower units with dedicated circuits and appropriate electrical protection.',
    },
    {
      title: 'Electric Cooker Installation',
      slug: 'electric-cooker-installation',
      description:
        'Safe installation and wiring of electric cookers, ovens, hobs and ranges with appropriate circuit protection.',
    },
    {
      title: 'Kitchen & Bathroom Electrical Work',
      slug: 'kitchen-bathroom-electrical',
      description:
        'Complete electrical services for kitchen and bathroom renovations including rewiring, new circuits and appliance installation.',
    },
    {
      title: 'Landlord Safety Package',
      slug: 'landlord-safety-package',
      description:
        'Comprehensive electrical safety package for landlords including EICR, smoke alarms, CO detectors and compliance certification.',
    },
    {
      title: 'Solar Panel Installation',
      slug: 'solar-panel-installation',
      description:
        'Design and installation of solar PV systems to generate renewable electricity and reduce energy bills.',
    },
    {
      title: 'Battery Storage Installation',
      slug: 'battery-storage-installation',
      description:
        'Installation of home battery storage systems to store solar energy or use cheaper off-peak electricity.',
    },
    {
      title: 'CCTV Installation',
      slug: 'cctv-installation',
      description:
        'Professional installation of CCTV security camera systems for residential and commercial properties.',
    },
    {
      title: 'Intruder Alarm Installation',
      slug: 'intruder-alarm-installation',
      description:
        'Installation of burglar alarm systems with motion sensors, door contacts and remote monitoring capabilities.',
    },
    {
      title: 'Access Control Systems',
      slug: 'access-control-systems',
      description:
        'Installation of electronic access control including keypad entry, card readers, fob systems and intercom integration.',
    },
    {
      title: 'Commercial Maintenance Contracts',
      slug: 'commercial-maintenance-contracts',
      description:
        'Ongoing electrical maintenance contracts for businesses including regular inspections, testing and priority callouts.',
    },
    {
      title: 'Commercial Fire Alarm Systems',
      slug: 'commercial-fire-alarm-systems',
      description:
        'Design, installation and maintenance of fire alarm systems to BS 5839 standards for commercial premises.',
    },
    {
      title: 'Three-Phase Installation',
      slug: 'three-phase-installation',
      description:
        'Installation of three-phase electrical systems for industrial machinery, commercial equipment and high-power applications.',
    },
    {
      title: 'Office Fit-Out Electrical',
      slug: 'office-fitout-electrical',
      description:
        'Complete electrical design and installation for office fit-outs including lighting, power, data and emergency systems.',
    },
    {
      title: 'Data & Network Cabling',
      slug: 'data-network-cabling',
      description:
        'Installation of structured data cabling including Cat6, Cat6a, fiber optic and network infrastructure for reliable connectivity.',
    },
    {
      title: 'New Build Electrical Installation',
      slug: 'new-build-electrical',
      description:
        'Complete electrical installations for new construction projects from first fix through to final testing and certification.',
    },
    {
      title: 'Electric Gate Installation',
      slug: 'electric-gates',
      description:
        'Installation of automated electric gate systems including sliding gates, swing gates and remote access controls.',
    },
    {
      title: 'Electric Underfloor Heating',
      slug: 'underfloor-heating-electric',
      description:
        'Installation of electric underfloor heating systems for comfortable, energy-efficient warmth in any room.',
    },
    {
      title: 'Storage Heater Installation',
      slug: 'storage-heater-installation',
      description:
        'Installation and replacement of electric storage heaters for efficient Economy 7 heating solutions.',
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
    businessType: 'LocalBusiness',
    businessConfig: {
      name: 'Your Business Name',
      legalName: 'Your Business Ltd',
      description:
        'Professional local services serving [Your Area]. Quality workmanship, competitive pricing, and excellent customer service.',
      slogan: 'Your trusted local experts',
      foundingDate: '2020',
      numberOfEmployees: '1-10',
      priceRange: '$$',
      email: 'info@yourbusiness.com',
      telephone: '+441234567890',
      address: {
        streetAddress: '123 Main Street',
        addressLocality: 'Your City',
        addressRegion: 'Your County',
        postalCode: 'AB12 3CD',
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
      areaServed: ['Main Area', 'North Region', 'South Region', 'East Region', 'West Region'],
      credentials: [
        {
          name: 'Fully Insured',
          description: 'Public liability and professional indemnity insurance',
          category: 'certification',
        },
        {
          name: 'Qualified Team',
          description: 'All staff are fully trained and certified',
          category: 'certification',
        },
      ],
      socialProfiles: [
        'https://www.facebook.com/yourbusiness',
        'https://www.linkedin.com/company/yourbusiness',
      ],
      knowsAbout: [
        'Service Category 1',
        'Service Category 2',
        'Service Category 3',
        'Industry Best Practices',
        'Local Area Expertise',
      ],
      offerCatalog: [
        {
          name: 'Primary Service',
          description: 'Our main service offering for residential and commercial clients',
          url: '/services/primary-service',
        },
        {
          name: 'Secondary Service',
          description: 'Complementary service that enhances our primary offering',
          url: '/services/secondary-service',
        },
        {
          name: 'Service Three',
          description: 'Specialized service for unique client needs',
          url: '/services/service-three',
        },
      ],
    },
  },
};
