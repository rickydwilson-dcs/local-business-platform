/**
 * Rigel Events Site Configuration
 *
 * Generic placeholder configuration for a local service business.
 * Copy this file when creating a new site and replace all placeholder values
 * with actual business information.
 */

import type { BaseSiteConfig } from "@platform/core-components/types/site-config";
import type { BusinessConfig, LocalBusinessSchemaOptions } from "@platform/core-components";

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
    type: "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness" | "Event";
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
    businessType: LocalBusinessSchemaOptions["businessType"];
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
  slug: "rigel-events",
  domain: "digitalmarketingweekend.co.uk",
  name: "Digital Marketing Weekend",
  tagline: "Two days of practical marketing sessions, workshops, and networking — free to attend",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  business: {
    name: "Digital Marketing Weekend",
    legalName: "Digital Marketing Weekend",
    type: "Event",
    phone: "",
    email: "hello@digitalmarketingweekend.co.uk",
    address: {
      street: "Winter Garden, Compton Street",
      city: "Eastbourne",
      region: "East Sussex",
      postalCode: "BN21 4BP",
      country: "United Kingdom",
    },
    hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    socialMedia: {
      twitter: "https://twitter.com/dmweekend",
      linkedin: "https://linkedin.com/company/digital-marketing-weekend",
      instagram: "https://instagram.com/dmweekend",
    },
    geo: {
      latitude: 50.7676,
      longitude: 0.2858,
    },
  },

  navigation: {
    main: [
      { label: "Speakers", href: "/speakers" },
      { label: "Schedule", href: "/schedule" },
      { label: "Venue", href: "/venue" },
      { label: "Sponsors", href: "/sponsors" },
      { label: "Contact", href: "/contact" },
    ],
  },

  cta: {
    primary: {
      label: "Get Tickets",
      href: "https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026",
    },
    phone: {
      show: false,
    },
  },

  footer: {
    showServices: false,
    showLocations: false,
    maxServices: 0,
    maxLocations: 0,
    copyright: "2026 Digital Marketing Weekend. All rights reserved.",
    builtBy: {
      name: "Digital Consulting Services",
      url: "https://www.digitalconsultingservices.co.uk",
    },
  },

  credentials: {
    yearEstablished: "2025",
    stats: [
      { value: "2", label: "Days" },
      { value: "10+", label: "Speakers" },
      { value: "20+", label: "Sessions" },
      { value: "300", label: "Attendees" },
    ],
    certifications: [],
  },

  serviceAreas: [],

  services: [],

  features: {
    analytics: false,
    consentBanner: false,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: false,
  },

  schema: {
    businessType: "LocalBusiness",
    businessConfig: {
      name: "Digital Marketing Weekend",
      legalName: "Digital Marketing Weekend",
      description:
        "Digital Marketing Weekend is a free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne on 17–18 October 2026.",
      slogan: "Two days of practical marketing. Completely free.",
      foundingDate: "2025",
      numberOfEmployees: "1-10",
      priceRange: "Free",
      email: "hello@digitalmarketingweekend.co.uk",
      telephone: "",
      address: {
        streetAddress: "Winter Garden, Compton Street",
        addressLocality: "Eastbourne",
        addressRegion: "East Sussex",
        postalCode: "BN21 4BP",
        addressCountry: "GB",
      },
      geo: {
        latitude: "50.7676",
        longitude: "0.2858",
      },
      openingHours: [],
      areaServed: ["Eastbourne", "East Sussex", "South East England"],
      credentials: [],
      socialProfiles: [
        "https://twitter.com/dmweekend",
        "https://linkedin.com/company/digital-marketing-weekend",
        "https://instagram.com/dmweekend",
      ],
      knowsAbout: [
        "Digital Marketing",
        "SEO",
        "Social Media Marketing",
        "Email Marketing",
        "Paid Advertising",
        "AI Marketing Tools",
      ],
      offerCatalog: [],
    },
  },

  about: {
    heroBadges: ["17–18 Oct 2026", "Eastbourne", "Free to Attend"],
    story: [
      "Digital Marketing Weekend is a free two-day event bringing together digital marketers, small business owners, and freelancers in the heart of Eastbourne.",
      "Across two packed days at the historic Winter Garden, you'll hear from industry experts on everything from SEO and social media to email marketing, paid advertising, and AI-powered tools.",
      "Whether you're just starting your digital journey or looking to sharpen your strategy, there's something for everyone — and it's completely free to attend.",
    ],
    whyChooseUs: [
      "Completely free to attend",
      "10+ industry expert speakers",
      "20+ practical sessions and workshops",
      "Networking opportunities with 300 attendees",
      "Stunning seafront venue",
      "Saturday and Sunday programme",
      "No sales pitches — just practical advice",
      "Suitable for all levels of digital marketing experience",
    ],
    values: [
      {
        title: "Practical Learning",
        description:
          "Every session is designed to give you actionable takeaways you can implement immediately.",
      },
      {
        title: "Accessible to All",
        description:
          "Free to attend and welcoming to everyone — from beginners to experienced marketers.",
      },
      {
        title: "Community First",
        description:
          "Built to bring together the local and regional business community around shared learning.",
      },
      {
        title: "No Fluff",
        description: "Real practitioners sharing real insights. No sales pitches, no filler.",
      },
    ],
  },
};
