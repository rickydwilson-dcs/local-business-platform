/**
 * Colossus Scaffolding Site Configuration
 *
 * Business information, navigation, credentials, and feature flags
 * for the Colossus Scaffolding website.
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
    type: "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness";
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
  name: "Colossus Scaffolding",
  tagline: "Safe, compliant and fully insured scaffolding specialists serving the South East UK",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  business: {
    name: "Colossus Scaffolding",
    legalName: "Colossus Scaffolding Ltd",
    type: "HomeAndConstructionBusiness",
    phone: "+441424466661",
    email: "info@colossusscaffolding.com",
    address: {
      street: "Office 7, 15-20 Gresley Road",
      city: "St Leonards On Sea",
      region: "East Sussex",
      postalCode: "TN38 9PL",
      country: "United Kingdom",
    },
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    socialMedia: {
      facebook: "https://www.facebook.com/colossusscaffolding",
      linkedin: "https://www.linkedin.com/company/colossus-scaffolding",
    },
    geo: {
      latitude: 50.8549,
      longitude: 0.5736,
    },
  },

  navigation: {
    main: [
      { label: "Services", href: "/services" },
      { label: "Locations", href: "/locations", hasDropdown: true },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },

  cta: {
    primary: {
      label: "Get Free Quote",
      href: "/contact",
    },
    phone: {
      show: true,
      label: "Call Us",
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 8,
    maxLocations: 12,
    copyright: "2025 Colossus Scaffolding Ltd. All rights reserved.",
    builtBy: {
      name: "Digital Consulting Services",
      url: "https://www.digitalconsultingservices.co.uk",
    },
  },

  credentials: {
    yearEstablished: "2009",
    stats: [
      {
        value: "15+",
        label: "Years Experience",
        description: "Established in 2009",
      },
      {
        value: "1000+",
        label: "Projects Completed",
        description: "Across the South East",
      },
      {
        value: "100%",
        label: "Satisfaction",
        description: "Customer focused",
      },
      {
        value: "24/7",
        label: "Support",
        description: "Always available",
      },
    ],
    certifications: [
      {
        name: "CHAS Accredited",
        description: "Health and safety assessment scheme approved contractor",
      },
      {
        name: "CISRS Qualified",
        description: "Construction Industry Scaffolders Record Scheme certified",
      },
      {
        name: "TG20:21 Compliant",
        description: "Latest technical guidance for scaffold design compliance",
      },
    ],
    insurance: {
      amount: "\u00A310M",
      type: "Public Liability",
    },
  },

  serviceAreas: ["East Sussex", "West Sussex", "Kent", "Surrey", "Essex", "London"],

  services: [
    {
      title: "Access Scaffolding",
      slug: "access-scaffolding",
      description: "Professional access scaffolding for residential and commercial projects",
    },
    {
      title: "Facade Scaffolding",
      slug: "facade-scaffolding",
      description: "Specialist facade scaffolding for building maintenance and renovation",
    },
    {
      title: "Edge Protection",
      slug: "edge-protection",
      description: "HSE compliant edge protection systems for construction sites",
    },
    {
      title: "Temporary Roof Systems",
      slug: "temporary-roof-systems",
      description: "Weather protection and temporary roofing solutions",
    },
  ],

  features: {
    analytics: true,
    consentBanner: true,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: true,
  },
};
