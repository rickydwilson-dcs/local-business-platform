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
  serviceAreaRegions?: ServiceAreaRegion[];
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
  slug: 'mad-graphics',
  domain: 'madgraphics.co.uk',
  name: 'Mad Graphics',
  tagline: 'Vehicle graphics, signs, banners & print — East Sussex',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://madgraphics.co.uk',

  business: {
    name: 'Mad Graphics',
    legalName: 'Mad Graphics',
    type: 'LocalBusiness',
    phone: '01323 589 700',
    email: 'office@madgraphics.co.uk',
    address: {
      street: 'Unit H2, Chaucer Business Park, Dittons Road',
      city: 'Polegate',
      region: 'East Sussex',
      postalCode: 'BN26',
      country: 'United Kingdom',
    },
    hours: {
      monday: '8:00 AM - 5:30 PM',
      tuesday: '8:00 AM - 5:30 PM',
      wednesday: '8:00 AM - 5:30 PM',
      thursday: '8:00 AM - 5:30 PM',
      friday: '8:00 AM - 5:30 PM',
      saturday: 'By appointment',
      sunday: 'Closed',
    },
    socialMedia: {
      instagram: 'https://instagram.com/mad_graphicssussex',
    },
    geo: {
      latitude: 50.8161,
      longitude: 0.2372,
    },
  },

  navigation: {
    main: [
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/projects' },
      { label: 'Locations', href: '/locations', hasDropdown: true },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  cta: {
    primary: {
      label: 'Get a Free Quote',
      href: '/contact',
    },
    phone: {
      show: true,
      label: 'Call 01323 589 700',
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 8,
    maxLocations: 12,
    copyright: '2026 Mad Graphics. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: '2004',
    stats: [
      { value: '20+', label: 'Years Experience', description: 'Est. 2004, Polegate' },
      { value: '5,000+', label: 'Projects Completed', description: 'Across East Sussex' },
      { value: 'Same Day', label: 'Quotes', description: 'Fast turnaround' },
      { value: 'No Wraps', label: 'Honest Service', description: 'Specialist focus' },
    ],
    certifications: [
      { name: 'Est. 2004', description: 'Over 20 years of vehicle graphics and signage' },
      { name: 'In-House Design', description: 'Full artwork and pre-press service' },
    ],
  },

  serviceAreas: [
    'Eastbourne',
    'Hastings',
    'Lewes',
    'Bexhill-on-Sea',
    'Uckfield',
    'Crowborough',
    'Seaford',
    'Hailsham',
    'Newhaven',
    'Polegate',
    'Peacehaven',
    'Battle',
    'St Leonards-on-Sea',
    'Heathfield',
    'Pevensey',
    'Ringmer',
    'Herstmonceux',
    'Wadhurst',
    'Alfriston',
  ],

  services: [
    {
      title: 'Vehicle Graphics',
      slug: 'vehicle-graphics',
      description: 'Van signwriting, car graphics, fleet branding, and magnetic signs for East Sussex businesses.',
    },
    {
      title: 'Signs & Signage',
      slug: 'signs-signage',
      description: 'Shop signs, fascia signs, site boards, window graphics, and safety signage.',
    },
    {
      title: 'Banners',
      slug: 'banners',
      description: 'PVC banners, roller banners, mesh banners, and fabric banners for events and promotions.',
    },
    {
      title: 'Large Format Print',
      slug: 'large-format-print',
      description: 'Poster printing, large format prints, canvas, exhibition graphics, and foam board.',
    },
    {
      title: 'Marketing Print',
      slug: 'marketing-print',
      description: 'Flyers, brochures, business cards, letterheads, folders, and menus.',
    },
    {
      title: 'Stickers & Wall Graphics',
      slug: 'stickers-labels',
      description: 'Custom stickers, labels, wall graphics, floor graphics, and window decals.',
    },
    {
      title: 'Workwear & Merchandise',
      slug: 'workwear-merchandise',
      description: 'Printed workwear, embroidered uniforms, hi-vis, merchandise, and personalised gifts.',
    },
    {
      title: 'Graphic Design',
      slug: 'graphic-design',
      description: 'Logo design, brand identity, print design, and artwork pre-press services.',
    },
  ],

  features: {
    analytics: false,
    consentBanner: true,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: true,
  },

  schema: {
    businessType: 'LocalBusiness',
    businessConfig: {
      name: 'Mad Graphics',
      legalName: 'Mad Graphics',
      description:
        'Mad Graphics provides vehicle graphics, signs, banners, and print services across East Sussex. Est. 2004. Based in Polegate.',
      slogan: 'Vehicle graphics, signs, banners & print — East Sussex',
      foundingDate: '2004',
      numberOfEmployees: '1-10',
      priceRange: '££',
      email: 'office@madgraphics.co.uk',
      telephone: '01323589700',
      address: {
        streetAddress: 'Unit H2, Chaucer Business Park, Dittons Road',
        addressLocality: 'Polegate',
        addressRegion: 'East Sussex',
        postalCode: 'BN26',
        addressCountry: 'GB',
      },
      geo: {
        latitude: '50.8161',
        longitude: '0.2372',
      },
      openingHours: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:30',
        },
      ],
      areaServed: [
        'Eastbourne',
        'Hastings',
        'Lewes',
        'Bexhill-on-Sea',
        'Uckfield',
        'Crowborough',
        'Seaford',
        'Hailsham',
        'Newhaven',
        'Polegate',
        'Peacehaven',
        'Battle',
        'St Leonards-on-Sea',
        'Heathfield',
        'Pevensey',
        'Ringmer',
        'Herstmonceux',
        'Wadhurst',
        'Alfriston',
      ],
      credentials: [
        {
          name: 'Est. 2004',
          description: 'Over 20 years serving East Sussex businesses',
          category: 'certification',
        },
      ],
      socialProfiles: ['https://instagram.com/mad_graphicssussex'],
      knowsAbout: [
        'vehicle graphics',
        'van signwriting',
        'fleet branding',
        'shop signs',
        'banners',
        'large format print',
        'workwear embroidery',
        'graphic design',
        'magnetic vehicle signs',
        'window graphics',
      ],
      offerCatalog: [
        { name: 'Vehicle Graphics', description: 'Van signwriting, car graphics, fleet branding', url: '/services/vehicle-graphics' },
        { name: 'Signs & Signage', description: 'Shop signs, fascia, site boards, window graphics', url: '/services/signs-signage' },
        { name: 'Banners', description: 'PVC, roller, mesh, and fabric banners', url: '/services/banners' },
        { name: 'Large Format Print', description: 'Posters, canvas, exhibition, foam board', url: '/services/large-format-print' },
        { name: 'Marketing Print', description: 'Flyers, brochures, business cards, menus', url: '/services/marketing-print' },
        { name: 'Stickers & Wall Graphics', description: 'Custom stickers, labels, wall and floor graphics', url: '/services/stickers-labels' },
        { name: 'Workwear & Merchandise', description: 'Printed workwear, embroidery, hi-vis, merchandise', url: '/services/workwear-merchandise' },
        { name: 'Graphic Design', description: 'Logo design, brand identity, print design, artwork', url: '/services/graphic-design' },
      ],
    },
  },

  about: {
    heroBadges: ['Est. 2004', 'Polegate, East Sussex', 'No Vehicle Wraps'],
    story: [
      'Mad Graphics was founded in 2004 by Martin Adams in Polegate, East Sussex. For over 20 years, we have been the go-to specialist for vehicle graphics, signage, banners, and print for businesses across the county.',
      'From our base at Chaucer Business Park, we serve sole traders and large fleets alike — bringing the same attention to detail and honest pricing to every job. We cover Eastbourne, Hastings, Lewes, Bexhill, and everywhere in between.',
      'One thing sets us apart: we are specialists. We do not offer full vehicle wraps. Instead, we focus on what we do best — cut vinyl graphics, signwriting, and printed graphics applied with precision. That focus means better results for our clients.',
    ],
    whyChooseUs: [
      'No full vehicle wraps — specialist focus on graphics and signwriting',
      'Same-day quotes for most enquiries',
      'In-house graphic design and artwork service',
      'Fleet discounts for multiple vehicles',
      'UV-rated materials for long-lasting colour',
      'Free artwork check before production',
      'Local East Sussex knowledge since 2004',
      'Honest, transparent pricing',
    ],
    values: [
      {
        title: 'Specialist Focus',
        description: 'We specialise in vehicle graphics and signwriting — not wraps. That focus means better quality and more competitive pricing.',
      },
      {
        title: 'Honest Pricing',
        description: 'No hidden fees, no upselling. You get a clear quote with everything included before we start.',
      },
      {
        title: 'Fast Turnaround',
        description: 'Same-day quotes and efficient production mean your vehicle or signage is ready when you need it.',
      },
      {
        title: 'Local Knowledge',
        description: 'Based in Polegate since 2004, we understand East Sussex businesses and what works in our local market.',
      },
    ],
  },
};
