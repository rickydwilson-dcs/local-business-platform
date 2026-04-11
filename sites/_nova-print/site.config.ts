/**
 * Nova Print Site Configuration
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
  slug: "nova-print",
  domain: "dcs-print.example.com",
  name: "DCS Print",
  tagline: "Commercial print and large format example site — East Sussex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dcs-print.example.com",

  business: {
    name: "DCS Print",
    legalName: "Digital Consulting Services Ltd",
    type: "LocalBusiness",
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
        description: "East Sussex print shop since 2019",
      },
      {
        value: "20+",
        label: "Years Combined Experience",
        description: "Commercial print expertise",
      },
      { value: "500+", label: "Print Jobs Delivered", description: "For local businesses" },
      { value: "FSC", label: "Certified Paper", description: "Sustainably sourced stocks" },
    ],
    certifications: [
      {
        name: "BPIF-Equivalent Member",
        description: "British Printing Industries Federation standards",
      },
      { name: "FSC-Certified Paper", description: "Sustainably sourced paper stocks" },
      { name: "In-House Production", description: "Full print production on site in Polegate" },
      { name: "Colour-Matched Proofs", description: "Proof approval before every print run" },
    ],
    insurance: {
      amount: "£2M",
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
      title: "Business Cards",
      slug: "business-cards",
      description:
        "350gsm silk, matt lam, spot UV and foil business cards. Print runs from 100 to 5,000. Next-day turnaround available.",
    },
    {
      title: "Flyers & Leaflets",
      slug: "flyers-leaflets",
      description:
        "A7 to A3 flyers and leaflets on 130–300gsm. Tri-fold, gate and cross-fold options with bulk pricing.",
    },
    {
      title: "Brochures & Catalogues",
      slug: "brochures-catalogues",
      description:
        "8 to 64 page brochures with saddle-stitch or perfect binding on 150–200gsm text stocks.",
    },
    {
      title: "Banners & Display Print",
      slug: "banners-display-print",
      description:
        "PVC, mesh and fabric banners up to 3m wide with eyelet or hem finishing for East Sussex businesses.",
    },
    {
      title: "Large Format Print",
      slug: "large-format-print",
      description:
        "Large format printing up to 1600mm wide on photo paper, canvas, vinyl and wall graphics.",
    },
    {
      title: "Poster Printing",
      slug: "poster-printing",
      description:
        "A4 to A0 poster printing in matt or gloss on 170–250gsm. Same-day rush available.",
    },
    {
      title: "Letterheads & Compliment Slips",
      slug: "letterheads-compliment-slips",
      description:
        "100gsm and 120gsm letterheads and compliment slips, full colour or one-colour. Conqueror stock available.",
    },
    {
      title: "Folders & Presentation Print",
      slug: "folders-presentation-print",
      description:
        "Pocket folders, interlocking folders with foil, embossing and business card slots.",
    },
    {
      title: "Stickers & Labels",
      slug: "stickers-labels",
      description:
        "Die-cut, kiss-cut, waterproof and UV-rated labels in clear vinyl and product label formats.",
    },
    {
      title: "Book & Booklet Printing",
      slug: "book-booklet-printing",
      description:
        "Short-run book and booklet printing from 50 copies with perfect or saddle binding and cover lamination.",
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
    businessType: "LocalBusiness",
    businessConfig: {
      name: "DCS Print",
      legalName: "Digital Consulting Services Ltd",
      description:
        "DCS Print is an example site demonstrating the Local Business Platform for commercial print businesses. Operated by Digital Consulting Services from Polegate, East Sussex.",
      slogan: "Commercial print and large format example site — East Sussex",
      foundingDate: "2019",
      numberOfEmployees: "1-10",
      priceRange: "£",
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
          name: "BPIF-Equivalent Member",
          description: "Print industry standards",
          category: "certification",
        },
        {
          name: "FSC-Certified Paper",
          description: "Sustainably sourced stocks",
          category: "certification",
        },
        {
          name: "In-House Production",
          description: "Full production on site",
          category: "certification",
        },
        {
          name: "Colour-Matched Proofs",
          description: "Proof approval before print run",
          category: "certification",
        },
      ],
      socialProfiles: [
        "https://facebook.com/digitalconsultingservices",
        "https://linkedin.com/company/digital-consulting-services",
      ],
      knowsAbout: [
        "print",
        "flyers",
        "brochures",
        "business cards",
        "posters",
        "banners",
        "large format",
        "commercial print",
        "stickers",
        "labels",
      ],
      offerCatalog: [
        {
          name: "Business Cards",
          description: "350gsm silk, matt lam and foil business cards from 100 to 5,000",
          url: "/services/business-cards",
        },
        {
          name: "Flyers & Leaflets",
          description: "A7 to A3 flyers on 130–300gsm with folded options and bulk pricing",
          url: "/services/flyers-leaflets",
        },
        {
          name: "Brochures & Catalogues",
          description: "8 to 64 page brochures with saddle-stitch or perfect binding",
          url: "/services/brochures-catalogues",
        },
        {
          name: "Banners & Display Print",
          description: "PVC, mesh and fabric banners up to 3m wide",
          url: "/services/banners-display-print",
        },
        {
          name: "Large Format Print",
          description: "Up to 1600mm wide on photo paper, canvas, vinyl and wall graphics",
          url: "/services/large-format-print",
        },
        {
          name: "Poster Printing",
          description: "A4 to A0 posters in matt or gloss with same-day rush option",
          url: "/services/poster-printing",
        },
        {
          name: "Letterheads & Compliment Slips",
          description: "100gsm and 120gsm letterheads and compliment slips",
          url: "/services/letterheads-compliment-slips",
        },
        {
          name: "Folders & Presentation Print",
          description: "Pocket folders with foil, embossing and card slots",
          url: "/services/folders-presentation-print",
        },
        {
          name: "Stickers & Labels",
          description: "Die-cut, waterproof and UV-rated labels in clear vinyl",
          url: "/services/stickers-labels",
        },
        {
          name: "Book & Booklet Printing",
          description: "Short-run books from 50 copies with cover lamination",
          url: "/services/book-booklet-printing",
        },
      ],
    },
  },

  about: {
    heroBadges: ["Est. 2019", "East Sussex", "Example Site", "By DCS"],
    story: [
      "DCS Print was established in 2019 as the commercial print division of Digital Consulting Services, operating from Unit H3 at Chaucer Business Park in Polegate. Built as a production-first print shop, DCS Print focuses on fast turnaround, honest pricing, and the kind of practical print advice that small businesses across East Sussex actually need — from their first 100 business cards to a full event print run.",
      "The business serves independent retailers, hospitality operators, charities, contractors, and professional services firms across Polegate, Eastbourne, Brighton, Hove, and the surrounding area. Whether it is A5 flyers, large format banners, premium business cards, or saddle-stitched booklets, all production is handled in-house on FSC-certified paper stocks with colour-matched proofing before every run.",
      "This is an example site by Digital Consulting Services, demonstrating the Local Business Platform. It is not a live trading business — all services, customer reviews, and case studies shown are illustrative only. For the real platform and real client sites, visit digitalconsultingservices.co.uk.",
    ],
    whyChooseUs: [
      "In-house production in Polegate — no middlemen, faster turnaround",
      "FSC-certified paper stocks — sustainable print for conscious businesses",
      "Colour-matched proofs before every print run — no nasty surprises",
      "Same-day rush available on posters and leaflets",
      "Bulk pricing on runs of 500, 1,000 and 5,000+",
      "Print-ready artwork help for clients without an in-house designer",
      "BPIF-equivalent production standards throughout",
      "Serving East Sussex small businesses since 2019",
    ],
    values: [
      {
        title: "Production First",
        description:
          "We are a print shop, not a design agency. Fast turnaround, consistent quality, and competitive pricing on every run.",
      },
      {
        title: "No Surprises",
        description:
          "Colour-matched proofs before every job. What you approve is what you receive.",
      },
      {
        title: "Practical Advice",
        description:
          "We help clients prepare print-ready artwork and choose the right stock without upselling them into specifications they don't need.",
      },
      {
        title: "Sustainable Print",
        description:
          "FSC-certified paper stocks and responsible ink choices. Good print doesn't have to cost the earth.",
      },
    ],
  },
};
