/**
 * Castor Plumbing Site Configuration
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
    type: "LocalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness" | "Plumber";
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
  slug: "castor-plumbing",
  domain: "dcs-plumbing.example.com",
  name: "DCS Plumbing",
  tagline: "Family-run plumbing and heating example site — East Sussex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dcs-plumbing.example.com",

  business: {
    name: "DCS Plumbing",
    legalName: "Digital Consulting Services Ltd",
    type: "Plumber",
    phone: "+44 7395 063764",
    email: "mail@digitalconsultingservices.co.uk",
    address: {
      street: "Unit H3, Chaucer Business Park, Dittons Road",
      city: "Polegate",
      region: "East Sussex",
      postalCode: "BN26 6QH",
      country: "United Kingdom",
    },
    hours: {
      monday: "9:00 AM - 5:30 PM",
      tuesday: "9:00 AM - 5:30 PM",
      wednesday: "9:00 AM - 5:30 PM",
      thursday: "9:00 AM - 5:30 PM",
      friday: "9:00 AM - 5:30 PM",
      saturday: "By Appointment",
      sunday: "Closed",
    },
    socialMedia: {
      facebook: "https://facebook.com/digitalconsultingservices",
      linkedin: "https://linkedin.com/company/digital-consulting-services",
    },
    geo: {
      latitude: 50.8233,
      longitude: 0.2557,
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
      label: "Get a Free Quote",
      href: "/contact",
    },
    phone: {
      show: true,
      label: "Call 07395 063764",
    },
  },

  footer: {
    showServices: true,
    showLocations: true,
    maxServices: 10,
    maxLocations: 12,
    copyright: "2026 Digital Consulting Services Ltd. Example site.",
    builtBy: {
      name: "Digital Consulting Services",
      url: "https://www.digitalconsultingservices.co.uk",
    },
  },

  credentials: {
    yearEstablished: "2019",
    stats: [
      { value: "Est. 2019", label: "Established", description: "Serving East Sussex since 2019" },
      { value: "20+", label: "Years Combined Experience", description: "Expert plumbing team" },
      { value: "500+", label: "Plumbing Projects", description: "Residential and commercial" },
      { value: "Gas Safe", label: "Registered", description: "Gas Safe certification" },
    ],
    certifications: [
      { name: "Gas Safe Registered", description: "Reg. TBC — example site" },
      {
        name: "CIPHE Member",
        description: "Chartered Institute of Plumbing and Heating Engineering",
      },
      { name: "WaterSafe Approved", description: "WaterSafe contractor" },
      { name: "£5M Public Liability", description: "Fully insured" },
    ],
    insurance: {
      amount: "£5M",
      type: "Public Liability",
    },
  },

  serviceAreas: [
    "Polegate",
    "Eastbourne",
    "Hailsham",
    "Lewes",
    "Seaford",
    "Brighton",
    "Hove",
    "Uckfield",
  ],

  serviceAreaRegions: [
    {
      name: "South Coast",
      slug: "south-coast",
      towns: [
        { name: "Polegate", slug: "polegate" },
        { name: "Eastbourne", slug: "eastbourne" },
        { name: "Hailsham", slug: "hailsham" },
        { name: "Seaford", slug: "seaford" },
        { name: "Brighton", slug: "brighton" },
        { name: "Hove", slug: "hove" },
      ],
    },
    {
      name: "Mid Sussex",
      slug: "mid-sussex",
      towns: [
        { name: "Lewes", slug: "lewes" },
        { name: "Uckfield", slug: "uckfield" },
      ],
    },
  ],

  services: [
    {
      title: "Boiler Installation",
      slug: "boiler-installation",
      description:
        "Gas Safe boiler installation and replacement across East Sussex. Worcester Bosch and Vaillant specialists.",
    },
    {
      title: "Boiler Repair & Servicing",
      slug: "boiler-repair-servicing",
      description:
        "Annual boiler service plans and repair callouts for homes and landlords across East Sussex.",
    },
    {
      title: "Emergency Plumber (24/7)",
      slug: "emergency-plumber",
      description:
        "24/7 emergency plumbing callouts within East Sussex. 2-hour response within 10 miles of Polegate.",
    },
    {
      title: "Bathroom Installation",
      slug: "bathroom-installation",
      description:
        "Full bathroom supply and fit, including period-property specialists across East Sussex.",
    },
    {
      title: "Central Heating Installation",
      slug: "central-heating-installation",
      description:
        "New-build and upgrade central heating systems with smart thermostat and zone heating.",
    },
    {
      title: "Power Flushing",
      slug: "power-flushing",
      description:
        "System power flushing with MagnaClean filter fit to restore heating efficiency.",
    },
    {
      title: "Leak Detection & Repair",
      slug: "leak-detection-repair",
      description:
        "Thermal imaging and acoustic leak detection with minimal disruption across East Sussex.",
    },
    {
      title: "Blocked Drains",
      slug: "blocked-drains",
      description:
        "CCTV drain survey and high-pressure jetting to clear blocked drains across East Sussex.",
    },
    {
      title: "Radiator Installation & Repair",
      slug: "radiator-installation-repair",
      description: "Designer radiators, towel rails, and cold-at-top radiator troubleshooting.",
    },
    {
      title: "Landlord Gas Safety Certificates",
      slug: "landlord-gas-safety",
      description:
        "CP12 certificates issued same day. Portfolio pricing for landlords across East Sussex.",
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
    businessType: "Plumber",
    businessConfig: {
      name: "DCS Plumbing",
      legalName: "Digital Consulting Services Ltd",
      description:
        "DCS Plumbing is an example site demonstrating the Local Business Platform for plumbing and heating trades. Operated by Digital Consulting Services from Polegate, East Sussex.",
      slogan: "Family-run plumbing and heating example site — East Sussex",
      foundingDate: "2019",
      numberOfEmployees: "1-10",
      priceRange: "££",
      email: "mail@digitalconsultingservices.co.uk",
      telephone: "+447395063764",
      address: {
        streetAddress: "Unit H3, Chaucer Business Park, Dittons Road",
        addressLocality: "Polegate",
        addressRegion: "East Sussex",
        postalCode: "BN26 6QH",
        addressCountry: "GB",
      },
      geo: {
        latitude: "50.8233",
        longitude: "0.2557",
      },
      openingHours: [
        {
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:30",
        },
        {
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "12:00",
        },
      ],
      areaServed: [
        "Polegate",
        "Eastbourne",
        "Hailsham",
        "Lewes",
        "Seaford",
        "Brighton",
        "Hove",
        "Uckfield",
      ],
      credentials: [
        {
          name: "Gas Safe Registered",
          description: "Gas Safe registered plumber",
          category: "certification",
        },
        {
          name: "CIPHE Member",
          description: "Chartered Institute of Plumbing and Heating Engineering",
          category: "certification",
        },
        {
          name: "WaterSafe Approved",
          description: "WaterSafe approved contractor",
          category: "certification",
        },
        { name: "£5M Public Liability", description: "Fully insured", category: "compliance" },
      ],
      socialProfiles: [
        "https://facebook.com/digitalconsultingservices",
        "https://linkedin.com/company/digital-consulting-services",
      ],
      knowsAbout: [
        "boiler installation",
        "boiler repair",
        "plumbing",
        "gas safe",
        "central heating",
        "bathrooms",
        "emergency plumber",
        "leak detection",
        "blocked drains",
      ],
      offerCatalog: [
        {
          name: "Boiler Installation",
          description: "Gas Safe boiler installation and replacement across East Sussex",
          url: "/services/boiler-installation",
        },
        {
          name: "Boiler Repair & Servicing",
          description: "Annual boiler service plans and emergency repair callouts",
          url: "/services/boiler-repair-servicing",
        },
        {
          name: "Emergency Plumber (24/7)",
          description: "24/7 emergency plumbing callouts, 2-hour response near Polegate",
          url: "/services/emergency-plumber",
        },
        {
          name: "Bathroom Installation",
          description: "Full bathroom supply and fit including period-property specialists",
          url: "/services/bathroom-installation",
        },
        {
          name: "Central Heating Installation",
          description: "New-build and upgrade central heating with smart thermostat",
          url: "/services/central-heating-installation",
        },
        {
          name: "Power Flushing",
          description: "System power flushing with MagnaClean filter installation",
          url: "/services/power-flushing",
        },
        {
          name: "Leak Detection & Repair",
          description: "Thermal imaging and acoustic leak detection with minimal disruption",
          url: "/services/leak-detection-repair",
        },
        {
          name: "Blocked Drains",
          description: "CCTV drain survey and high-pressure jetting to clear blockages",
          url: "/services/blocked-drains",
        },
        {
          name: "Radiator Installation & Repair",
          description: "Designer radiators, towel rails and radiator troubleshooting",
          url: "/services/radiator-installation-repair",
        },
        {
          name: "Landlord Gas Safety Certificates",
          description: "CP12 certificates issued same day with portfolio pricing",
          url: "/services/landlord-gas-safety",
        },
      ],
    },
  },

  about: {
    heroBadges: ["Est. 2019", "East Sussex", "Example Site", "By DCS"],
    story: [
      "DCS Plumbing was founded in 2019 as part of Digital Consulting Services' family of local trade businesses across East Sussex. Built on decades of combined plumbing and heating experience, the company set out to offer Gas Safe work, honest pricing, and a genuinely responsive service to homeowners and landlords across Polegate, Eastbourne, Brighton, and the surrounding area.",
      "From boiler installations and central heating upgrades to emergency callouts and bathroom fit-outs, DCS Plumbing covers the full spectrum of residential and commercial plumbing needs. Our Gas Safe registered engineers work to the highest standards, and every job — from a minor repair to a full bathroom renovation — is backed by our commitment to quality and clear communication.",
      "This is an example site by Digital Consulting Services, demonstrating the Local Business Platform. It is not a live trading business — all services, customer reviews, and case studies shown are illustrative only. For the real platform and real client sites, visit digitalconsultingservices.co.uk.",
    ],
    whyChooseUs: [
      "Gas Safe registered engineers on every job",
      "24/7 emergency callout, 2-hour response within 10 miles of Polegate",
      "Fixed-price quotes — no hidden charges",
      "Annual service plans for boilers and heating systems",
      "Period-property and listed-building plumbing specialists",
      "Same-day Landlord Gas Safety Certificates (CP12)",
      "Fully insured with £5M public liability cover",
      "Proud to serve East Sussex homeowners and landlords since 2019",
    ],
    values: [
      {
        title: "Safety First",
        description:
          "Every gas job is completed by a Gas Safe registered engineer. We never cut corners where safety is at stake.",
      },
      {
        title: "Honest Pricing",
        description:
          "We provide clear, itemised quotes before starting work. No surprise charges when the invoice arrives.",
      },
      {
        title: "Reliable Response",
        description:
          "We show up when we say we will. Emergency callouts get a 2-hour response within 10 miles of Polegate.",
      },
      {
        title: "Quality Guaranteed",
        description:
          "Every installation is completed to manufacturer standards and backed by a workmanship guarantee.",
      },
    ],
  },
};
