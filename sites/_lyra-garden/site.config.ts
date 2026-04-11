/**
 * Lyra Garden Site Configuration
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
  slug: "lyra-garden",
  domain: "dcs-garden.example.com",
  name: "DCS Garden",
  tagline: "Garden design and maintenance example site — East Sussex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dcs-garden.example.com",

  business: {
    name: "DCS Garden",
    legalName: "Digital Consulting Services Ltd",
    type: "HomeAndConstructionBusiness",
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
      {
        value: "Est. 2019",
        label: "Established",
        description: "Serving East Sussex gardens since 2019",
      },
      {
        value: "20+",
        label: "Years Combined Experience",
        description: "Landscaping and garden design",
      },
      { value: "500+", label: "Garden Projects", description: "Domestic and commercial" },
      { value: "NPTC", label: "Chainsaw Qualified", description: "Tree surgery accreditation" },
    ],
    certifications: [
      {
        name: "RHS-Aligned Practices",
        description: "Horticulture to Royal Horticultural Society standards",
      },
      {
        name: "BALI-Equivalent Member",
        description: "British Association of Landscape Industries standards",
      },
      { name: "NPTC Chainsaw Qualified", description: "Accredited tree surgery team" },
      { name: "Waste Carriers Licence", description: "Licensed garden waste removal" },
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
      title: "Garden Design & Landscaping",
      slug: "garden-design-landscaping",
      description:
        "Full garden design service with CAD plans, phased installation and planting schedules across East Sussex.",
    },
    {
      title: "Lawn Care & Mowing",
      slug: "lawn-care-mowing",
      description:
        "Weekly and fortnightly lawn care contracts including scarifying, feeding and moss treatment.",
    },
    {
      title: "Hedge Trimming & Pruning",
      slug: "hedge-trimming-pruning",
      description:
        "Species-appropriate hedge trimming up to 12m with MEWP access and waste removal included.",
    },
    {
      title: "Tree Surgery",
      slug: "tree-surgery",
      description:
        "NPTC-qualified tree surgery including dismantling, crown reduction, stump grinding and full insurance.",
    },
    {
      title: "Patio & Decking Installation",
      slug: "patio-decking-installation",
      description:
        "Natural stone, porcelain and composite decking installation with proper drainage compliance.",
    },
    {
      title: "Fencing & Gates",
      slug: "fencing-gates",
      description:
        "Closeboard, lap panel, post-and-rail fencing and automated gates across East Sussex.",
    },
    {
      title: "Garden Clearance",
      slug: "garden-clearance",
      description:
        "Full garden clearance with licensed waste removal. Overgrown gardens a speciality.",
    },
    {
      title: "Planting & Borders",
      slug: "planting-borders",
      description:
        "Chalk-soil planting schemes with year-round interest and pollinator-friendly plant selection.",
    },
    {
      title: "Turf Laying",
      slug: "turf-laying",
      description: "Ground preparation, topsoil, Rolawn-grade turf laying and aftercare guidance.",
    },
    {
      title: "Seasonal Garden Maintenance",
      slug: "seasonal-garden-maintenance",
      description:
        "Quarterly seasonal maintenance contracts: spring prep, summer mowing, autumn leaf clear, winter pruning.",
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
    businessType: "HomeAndConstructionBusiness",
    businessConfig: {
      name: "DCS Garden",
      legalName: "Digital Consulting Services Ltd",
      description:
        "DCS Garden is an example site demonstrating the Local Business Platform for garden design and landscaping businesses. Operated by Digital Consulting Services from Polegate, East Sussex.",
      slogan: "Garden design and maintenance example site — East Sussex",
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
          name: "RHS-Aligned Practices",
          description: "RHS horticultural standards",
          category: "certification",
        },
        {
          name: "BALI-Equivalent Member",
          description: "Landscape industry standards",
          category: "certification",
        },
        {
          name: "NPTC Chainsaw Qualified",
          description: "Tree surgery accreditation",
          category: "certification",
        },
        {
          name: "Waste Carriers Licence",
          description: "Licensed waste removal",
          category: "compliance",
        },
      ],
      socialProfiles: [
        "https://facebook.com/digitalconsultingservices",
        "https://linkedin.com/company/digital-consulting-services",
      ],
      knowsAbout: [
        "garden design",
        "landscaping",
        "lawn care",
        "hedge trimming",
        "tree surgery",
        "fencing",
        "planting",
        "maintenance",
        "chalk soil",
        "South Downs",
      ],
      offerCatalog: [
        {
          name: "Garden Design & Landscaping",
          description:
            "Full garden design with CAD plans, phased installation and planting schedules",
          url: "/services/garden-design-landscaping",
        },
        {
          name: "Lawn Care & Mowing",
          description: "Weekly and fortnightly lawn care contracts with scarifying and feeding",
          url: "/services/lawn-care-mowing",
        },
        {
          name: "Hedge Trimming & Pruning",
          description: "Species-appropriate hedge trimming up to 12m with waste removal",
          url: "/services/hedge-trimming-pruning",
        },
        {
          name: "Tree Surgery",
          description: "NPTC-qualified tree surgery including dismantling and stump grinding",
          url: "/services/tree-surgery",
        },
        {
          name: "Patio & Decking Installation",
          description: "Natural stone, porcelain and composite decking with drainage compliance",
          url: "/services/patio-decking-installation",
        },
        {
          name: "Fencing & Gates",
          description: "Closeboard, lap panel and post-and-rail fencing with automated gates",
          url: "/services/fencing-gates",
        },
        {
          name: "Garden Clearance",
          description: "Full clearance with licensed waste removal, overgrown gardens a speciality",
          url: "/services/garden-clearance",
        },
        {
          name: "Planting & Borders",
          description: "Chalk-soil planting schemes with year-round interest",
          url: "/services/planting-borders",
        },
        {
          name: "Turf Laying",
          description: "Ground preparation, topsoil and Rolawn-grade turf laying",
          url: "/services/turf-laying",
        },
        {
          name: "Seasonal Garden Maintenance",
          description: "Quarterly seasonal maintenance contracts across East Sussex",
          url: "/services/seasonal-garden-maintenance",
        },
      ],
    },
  },

  about: {
    heroBadges: ["Est. 2019", "East Sussex", "Example Site", "By DCS"],
    story: [
      "DCS Garden was founded in 2019 by Digital Consulting Services to demonstrate what a high-quality local garden and landscaping business website looks like on the Local Business Platform. Drawing on decades of combined horticultural and landscaping experience, the company specialises in the gardens, coastal plots, and chalk-soil environments of East Sussex — from the South Downs edge near Polegate to the exposed clifftop gardens of Seaford.",
      "From full garden redesigns and patio installations to regular lawn care contracts and tree surgery, DCS Garden covers the complete range of domestic and commercial garden services. Our NPTC-qualified team works to RHS-aligned horticultural standards, and every project — from a single hedge trim to a complete garden transformation — is completed with care for the plants, the soil, and the client's long-term enjoyment of their outdoor space.",
      "This is an example site by Digital Consulting Services, demonstrating the Local Business Platform. It is not a live trading business — all services, customer reviews, and case studies shown are illustrative only. For the real platform and real client sites, visit digitalconsultingservices.co.uk.",
    ],
    whyChooseUs: [
      "NPTC-qualified tree surgeons on all tree work — fully insured",
      "Chalk-soil and South Downs planting specialists",
      "Waste Carriers Licence — all green waste disposed of legally",
      "Seasonal maintenance contracts for year-round garden care",
      "Drainage-compliant patio and decking installations",
      "RHS-aligned horticultural practices on every project",
      "Fully insured with £5M public liability cover",
      "Serving East Sussex gardens from Polegate since 2019",
    ],
    values: [
      {
        title: "Respect for the Land",
        description:
          "We work with the natural character of East Sussex soil and climate — not against it. Sustainable planting that thrives long after we leave.",
      },
      {
        title: "Qualified Expertise",
        description:
          "Every tree job is carried out by NPTC-qualified surgeons. Every planting scheme is designed around RHS horticultural principles.",
      },
      {
        title: "Year-Round Care",
        description:
          "Gardens need attention through all four seasons. Our maintenance contracts ensure your outdoor space looks its best whatever the weather.",
      },
      {
        title: "Transparent Pricing",
        description:
          "Clear quotes before we start, no hidden charges when the work is done. We respect your budget and your garden.",
      },
    ],
  },
};
