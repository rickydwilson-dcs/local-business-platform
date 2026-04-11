/**
 * Cygnus Graphics Site Configuration
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
  slug: "cygnus-graphics",
  domain: "dcs-graphics.example.com",
  name: "DCS Graphics",
  tagline: "Creative design, signage and print example site — East Sussex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dcs-graphics.example.com",

  business: {
    name: "DCS Graphics",
    legalName: "Digital Consulting Services Ltd",
    type: "ProfessionalService",
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
      { value: "Est. 2019", label: "Established", description: "Creative studio since 2019" },
      {
        value: "20+",
        label: "Years Combined Experience",
        description: "Design and print expertise",
      },
      { value: "500+", label: "Design Projects", description: "Brands, signs and print" },
      { value: "In-House", label: "Design Team", description: "Consultative and creative" },
    ],
    certifications: [
      { name: "In-House Designers", description: "Full-time creative team on site" },
      { name: "Brand Strategy Specialists", description: "Strategy-first design approach" },
      { name: "Colour-Matched Print", description: "Pantone and CMYK colour accuracy" },
      { name: "Trade Association Member", description: "Industry-accredited studio" },
    ],
    insurance: {
      amount: "£2M",
      type: "Professional Indemnity",
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
      title: "Brand Identity & Logo Design",
      slug: "brand-identity-logo-design",
      description:
        "Strategy-first brand identity and logo design for East Sussex businesses. Moodboards, 3 concepts, 2 revision rounds, brand guidelines PDF.",
    },
    {
      title: "Graphic Design for Print",
      slug: "graphic-design-for-print",
      description:
        "Print-ready artwork design from brief to finished file. Pantone matching and proofing included.",
    },
    {
      title: "Vehicle Graphics & Livery",
      slug: "vehicle-graphics-livery",
      description:
        "UV-rated 7-year vinyl vehicle graphics and fleet livery. In-house design and Polegate workshop installation.",
    },
    {
      title: "Shop Signs & Signage",
      slug: "shop-signs-signage",
      description:
        "Shop front signage including illuminated options and heritage-area compliant designs for East Sussex.",
    },
    {
      title: "Business Stationery",
      slug: "business-stationery",
      description:
        "Matched business card, letterhead, compliment slip and email signature sets for East Sussex businesses.",
    },
    {
      title: "Brochures & Marketing Print",
      slug: "brochures-marketing-print",
      description:
        "Saddle-stitched and perfect-bound brochures on 150gsm to 400gsm stocks. Eco paper available.",
    },
    {
      title: "Exhibition & Event Graphics",
      slug: "exhibition-event-graphics",
      description:
        "Pop-up banners, pull-up stands, lightweight tension fabric displays with travel cases for events.",
    },
    {
      title: "Workwear & Branded Clothing",
      slug: "workwear-branded-clothing",
      description:
        "Embroidery and heat transfer branding on polos, hoodies, hi-vis and workwear. Bulk pricing available.",
    },
    {
      title: "Window Graphics & Retail Display",
      slug: "window-graphics-retail-display",
      description:
        "One-way vision film, cut vinyl and seasonal campaign window graphics with easy removal.",
    },
    {
      title: "Packaging & Label Design",
      slug: "packaging-label-design",
      description:
        "Die-line artwork, small-batch label runs, waterproof and UV-rated label options for East Sussex producers.",
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
    businessType: "ProfessionalService",
    businessConfig: {
      name: "DCS Graphics",
      legalName: "Digital Consulting Services Ltd",
      description:
        "DCS Graphics is an example site demonstrating the Local Business Platform for graphic design, signage and print studios. Operated by Digital Consulting Services from Polegate, East Sussex.",
      slogan: "Creative design, signage and print example site — East Sussex",
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
          name: "In-House Designers",
          description: "Full-time design team",
          category: "certification",
        },
        {
          name: "Brand Strategy Specialists",
          description: "Consultative design approach",
          category: "certification",
        },
        {
          name: "Colour-Matched Print",
          description: "Pantone accuracy guaranteed",
          category: "certification",
        },
        {
          name: "Trade Association Member",
          description: "Industry accredited",
          category: "certification",
        },
      ],
      socialProfiles: [
        "https://facebook.com/digitalconsultingservices",
        "https://linkedin.com/company/digital-consulting-services",
      ],
      knowsAbout: [
        "brand identity",
        "logo design",
        "graphic design",
        "signage",
        "print",
        "packaging",
        "creative studio",
        "vehicle graphics",
      ],
      offerCatalog: [
        {
          name: "Brand Identity & Logo Design",
          description:
            "Strategy-first brand identity with moodboards, concepts and brand guidelines",
          url: "/services/brand-identity-logo-design",
        },
        {
          name: "Graphic Design for Print",
          description: "Print-ready artwork from brief to finished file with Pantone matching",
          url: "/services/graphic-design-for-print",
        },
        {
          name: "Vehicle Graphics & Livery",
          description: "UV-rated 7-year vinyl vehicle graphics and fleet livery design",
          url: "/services/vehicle-graphics-livery",
        },
        {
          name: "Shop Signs & Signage",
          description: "Shop front and illuminated signage with heritage-area compliance",
          url: "/services/shop-signs-signage",
        },
        {
          name: "Business Stationery",
          description: "Matched business card, letterhead and stationery sets",
          url: "/services/business-stationery",
        },
        {
          name: "Brochures & Marketing Print",
          description: "Saddle-stitched and perfect-bound brochures on premium stocks",
          url: "/services/brochures-marketing-print",
        },
        {
          name: "Exhibition & Event Graphics",
          description: "Pop-up banners and tension fabric displays for events",
          url: "/services/exhibition-event-graphics",
        },
        {
          name: "Workwear & Branded Clothing",
          description: "Embroidery and heat transfer branding on workwear",
          url: "/services/workwear-branded-clothing",
        },
        {
          name: "Window Graphics & Retail Display",
          description: "One-way vision and cut vinyl window graphics",
          url: "/services/window-graphics-retail-display",
        },
        {
          name: "Packaging & Label Design",
          description: "Die-line artwork and small-batch label printing",
          url: "/services/packaging-label-design",
        },
      ],
    },
  },

  about: {
    heroBadges: ["Est. 2019", "East Sussex", "Example Site", "By DCS"],
    story: [
      "DCS Graphics was established in 2019 as the creative studio arm of Digital Consulting Services, bringing together in-house designers and print production specialists under one roof in Polegate, East Sussex. From the outset, the studio was built around a simple belief: effective design is both art and science — it must captivate an audience and communicate a clear message at the same time.",
      "The studio serves independent retailers, hospitality businesses, contractors, and professional services firms across East Sussex. Whether developing a brand from scratch, designing a full shop-front signage package, or producing fleet livery for a local contractor, DCS Graphics applies the same consultative, considered approach to every brief. We believe in educating clients about design — not just delivering artwork, but helping businesses understand why considered communication works.",
      "This is an example site by Digital Consulting Services, demonstrating the Local Business Platform. It is not a live trading business — all services, customer reviews, and case studies shown are illustrative only. For the real platform and real client sites, visit digitalconsultingservices.co.uk.",
    ],
    whyChooseUs: [
      "Strategy-first approach — we understand your audience before we open a design file",
      "In-house design team: no outsourcing, no handoffs, consistent quality throughout",
      "Consultative process with moodboards, concepts and revision rounds included",
      "Colour-matched print with Pantone accuracy on all production work",
      "Heritage-area and planning-permission guidance for shop signage",
      "Full brand guidelines PDF included with every brand identity project",
      "Vehicle livery installed in our Polegate workshop — UV-rated 7-year vinyl",
      "Serving East Sussex businesses since 2019 with a track record of effective design",
    ],
    values: [
      {
        title: "Art and Science",
        description:
          "Every design decision is backed by strategy. We ask what the work needs to achieve before we explore how it should look.",
      },
      {
        title: "Consultative Process",
        description:
          "We take the time to understand your business, your audience, and your brief before presenting solutions.",
      },
      {
        title: "Production Integrity",
        description:
          "Print-ready artwork, colour-matched proofs, and proper file handover — we get the technical details right.",
      },
      {
        title: "Lasting Results",
        description:
          "Good design outlasts trends. We create work that represents your business well for years, not months.",
      },
    ],
  },
};
