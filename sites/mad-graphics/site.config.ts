/**
 * Mad Graphics - Site Configuration
 *
 * Generated from project file: f3e1d2c0-1234-4ab5-9876-543210fedcba
 * Generated at: 2026-04-06T18:45:40.149Z
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
  /** Site identifier (used for logging, routing, and API handlers) */
  slug: string;

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
  slug: 'mad-graphics',
  name: "Mad Graphics",
  tagline: "Vehicle graphics, signs, banners & print — East Sussex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://madgraphics.co.uk",

  business: {
    name: "Mad Graphics",
    legalName: "Mad Graphics",
    type: "LocalBusiness",
    phone: "01323 589 700",
    email: "office@madgraphics.co.uk",
    address: {
      street: "Unit H2, Chaucer Business Park, Dittons Road",
      city: "Polegate",
      region: "East Sussex",
      postalCode: "BN26",
      country: "United Kingdom",
    },
    hours: {
      monday: "8:00 AM - 5:30 PM",
      tuesday: "8:00 AM - 5:30 PM",
      wednesday: "8:00 AM - 5:30 PM",
      thursday: "8:00 AM - 5:30 PM",
      friday: "8:00 AM - 5:30 PM",
      saturday: "By appointment",
      sunday: "Closed",
    },
    socialMedia: {
      
      
      instagram: "https://instagram.com/mad_graphicssussex",
      
    },
    geo: {
      latitude: 50.8161,
      longitude: 0.2372,
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
      label: "Get Free Quote",
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
    copyright: '2026 Mad Graphics. All rights reserved.',
    builtBy: {
      name: 'Digital Consulting Services',
      url: 'https://www.digitalconsultingservices.co.uk',
    },
  },

  credentials: {
    yearEstablished: "2004",
    stats: [
          {
                "value": "22+",
                "label": "Years Experience",
                "description": "Serving local customers"
          },
          {
                "value": "500+",
                "label": "Projects Completed",
                "description": "Satisfied clients"
          },
          {
                "value": "100%",
                "label": "Satisfaction",
                "description": "Customer focused"
          },
          {
                "value": "Fast",
                "label": "Response",
                "description": "Quick turnaround"
          }
    ],
    certifications: [
          {
                "name": "Est. 2004",
                "description": "Mad Graphics"
          },
          {
                "name": "In-House Design",
                "description": "Mad Graphics"
          }
    ],
    
  },

  serviceAreas: ["East Sussex"],

  serviceAreaRegions: [
      {
          "name": "East Sussex",
          "slug": "east-sussex",
          "towns": [
              {
                  "name": "Eastbourne",
                  "slug": "eastbourne"
              },
              {
                  "name": "Hastings",
                  "slug": "hastings"
              },
              {
                  "name": "Lewes",
                  "slug": "lewes"
              },
              {
                  "name": "Bexhill-on-Sea",
                  "slug": "bexhill-on-sea"
              },
              {
                  "name": "Uckfield",
                  "slug": "uckfield"
              },
              {
                  "name": "Crowborough",
                  "slug": "crowborough"
              },
              {
                  "name": "Seaford",
                  "slug": "seaford"
              },
              {
                  "name": "Hailsham",
                  "slug": "hailsham"
              },
              {
                  "name": "Newhaven",
                  "slug": "newhaven"
              },
              {
                  "name": "Polegate",
                  "slug": "polegate"
              },
              {
                  "name": "Peacehaven",
                  "slug": "peacehaven"
              },
              {
                  "name": "Battle",
                  "slug": "battle"
              },
              {
                  "name": "St Leonards-on-Sea",
                  "slug": "st-leonards-on-sea"
              },
              {
                  "name": "Heathfield",
                  "slug": "heathfield"
              },
              {
                  "name": "Pevensey",
                  "slug": "pevensey"
              },
              {
                  "name": "Ringmer",
                  "slug": "ringmer"
              },
              {
                  "name": "Herstmonceux",
                  "slug": "herstmonceux"
              },
              {
                  "name": "Wadhurst",
                  "slug": "wadhurst"
              },
              {
                  "name": "Alfriston",
                  "slug": "alfriston"
              }
          ]
      }
  ],

  services: [
      {
          "title": "Vehicle Graphics",
          "slug": "vehicle-graphics",
          "description": "Van lettering, car graphics, fleet branding and magnetic signs for East Sussex businesses."
      },
      {
          "title": "Signs & Signage",
          "slug": "signs-signage",
          "description": "Shop signs, site boards, A-boards, hoardings and window graphics across East Sussex."
      },
      {
          "title": "Banners",
          "slug": "banners",
          "description": "PVC, roller, mesh, fabric banners and flags for events, promotions and businesses."
      },
      {
          "title": "Large Format Print",
          "slug": "large-format-print",
          "description": "Posters, canvas prints, exhibition displays, foam board and Correx boards."
      },
      {
          "title": "Marketing Print",
          "slug": "marketing-print",
          "description": "Flyers, brochures, business cards and letterheads for East Sussex businesses."
      },
      {
          "title": "Stickers & Wall Graphics",
          "slug": "stickers-labels",
          "description": "Custom stickers, wall graphics, floor graphics and window decals."
      },
      {
          "title": "Workwear & Merchandise",
          "slug": "workwear-merchandise",
          "description": "Printed and embroidered workwear, hi-vis clothing and branded merchandise."
      },
      {
          "title": "Graphic Design",
          "slug": "graphic-design",
          "description": "Logo design, brand identity and print-ready artwork for East Sussex businesses."
      },
      {
          "title": "Van Graphics",
          "slug": "van-graphics",
          "description": "Custom van graphics and lettering for tradespeople and businesses across East Sussex."
      },
      {
          "title": "Fleet Graphics",
          "slug": "fleet-graphics",
          "description": "Consistent fleet branding for vans and vehicles across East Sussex."
      },
      {
          "title": "Car Graphics",
          "slug": "car-graphics",
          "description": "Branded car graphics and decals for businesses and individuals in East Sussex."
      },
      {
          "title": "Vehicle Livery",
          "slug": "vehicle-livery",
          "description": "Professional vehicle livery design and application across East Sussex."
      },
      {
          "title": "Magnetic Signs",
          "slug": "magnetic-signs",
          "description": "Removable magnetic vehicle signs for vans and cars in East Sussex."
      },
      {
          "title": "Shop Signs",
          "slug": "shop-signs",
          "description": "Fascia signs, projecting signs and shop-front graphics for East Sussex businesses."
      },
      {
          "title": "Site Boards",
          "slug": "site-boards",
          "description": "Construction site boards, hoarding graphics and project signage across East Sussex."
      },
      {
          "title": "A-Boards",
          "slug": "a-boards",
          "description": "Pavement A-boards and forecourt signs for shops and businesses in East Sussex."
      },
      {
          "title": "Safety Signs",
          "slug": "safety-signs",
          "description": "Health and safety signage, fire exit signs and warning signs for East Sussex businesses."
      },
      {
          "title": "Directional Signs",
          "slug": "directional-signs",
          "description": "Wayfinding and directional signage for buildings and sites across East Sussex."
      },
      {
          "title": "Hoarding Graphics",
          "slug": "hoarding-graphics",
          "description": "Large-scale hoarding graphics and construction site branding in East Sussex."
      },
      {
          "title": "Window Graphics",
          "slug": "window-graphics",
          "description": "Frosted, printed and cut-vinyl window graphics for shops and offices in East Sussex."
      },
      {
          "title": "Window Stickers",
          "slug": "window-stickers",
          "description": "Custom window stickers and decals for retail and commercial premises in East Sussex."
      },
      {
          "title": "PVC Banners",
          "slug": "pvc-banners",
          "description": "Heavy-duty PVC banners for outdoor events and advertising across East Sussex."
      },
      {
          "title": "Roller Banners",
          "slug": "roller-banners",
          "description": "Pull-up roller banners and pop-up displays for exhibitions and events."
      },
      {
          "title": "Mesh Banners",
          "slug": "mesh-banners",
          "description": "Wind-resistant mesh banners for scaffolding and outdoor sites in East Sussex."
      },
      {
          "title": "Fabric Banners",
          "slug": "fabric-banners",
          "description": "Premium fabric banners and flags for events and indoor displays."
      },
      {
          "title": "Poster Printing",
          "slug": "poster-printing",
          "description": "A0, A1, A2 and custom-size poster printing for East Sussex businesses."
      },
      {
          "title": "Canvas Prints",
          "slug": "canvas-prints",
          "description": "Custom canvas prints for offices, hospitality and retail spaces in East Sussex."
      },
      {
          "title": "Foam Board & Correx",
          "slug": "foam-board-correx",
          "description": "Lightweight foam board and Correx boards for displays and site signs."
      },
      {
          "title": "Exhibition Prints",
          "slug": "exhibition-prints",
          "description": "Exhibition display prints and pop-up systems for trade shows and events."
      },
      {
          "title": "Large Format Printing",
          "slug": "large-format",
          "description": "Wide-format printing for any size requirement across East Sussex businesses."
      },
      {
          "title": "Flyers & Leaflets",
          "slug": "flyers-leaflets",
          "description": "Full-colour flyers and leaflets for marketing campaigns in East Sussex."
      },
      {
          "title": "Brochures",
          "slug": "brochures",
          "description": "Professionally printed brochures and booklets for East Sussex businesses."
      },
      {
          "title": "Business Cards",
          "slug": "business-cards",
          "description": "Premium business card printing for professionals and businesses in East Sussex."
      },
      {
          "title": "Letterheads",
          "slug": "letterheads",
          "description": "Branded letterheads and stationery for East Sussex businesses."
      },
      {
          "title": "Presentation Folders",
          "slug": "folders",
          "description": "Custom printed presentation folders and document wallets for East Sussex businesses."
      },
      {
          "title": "Menu Printing",
          "slug": "menus",
          "description": "Restaurant and cafe menus, boards and printed materials for East Sussex hospitality."
      },
      {
          "title": "Custom Stickers",
          "slug": "custom-stickers",
          "description": "Custom-shaped and printed stickers for branding and packaging in East Sussex."
      },
      {
          "title": "Labels",
          "slug": "labels",
          "description": "Printed labels for products, packaging and assets across East Sussex businesses."
      },
      {
          "title": "Wall Graphics",
          "slug": "wall-graphics",
          "description": "Large-format wall graphics and murals for offices and retail spaces in East Sussex."
      },
      {
          "title": "Floor Graphics",
          "slug": "floor-graphics",
          "description": "Non-slip floor graphics and vinyl for retail, events and wayfinding."
      },
      {
          "title": "Printed Workwear",
          "slug": "printed-workwear",
          "description": "Screen printed and heat transfer workwear for East Sussex trade and business."
      },
      {
          "title": "Embroidered Uniforms",
          "slug": "embroidered-uniforms",
          "description": "Embroidered polo shirts, jackets and uniforms for East Sussex businesses."
      },
      {
          "title": "Hi-Vis Clothing",
          "slug": "hi-vis",
          "description": "Branded hi-vis vests, jackets and workwear for construction and trade in East Sussex."
      },
      {
          "title": "Branded Merchandise",
          "slug": "merchandise",
          "description": "Promotional merchandise and branded gifts for East Sussex businesses."
      },
      {
          "title": "Personalised Gifts",
          "slug": "personalised-gifts",
          "description": "Custom personalised gifts and keepsakes printed in East Sussex."
      },
      {
          "title": "Logo Design",
          "slug": "logo-design",
          "description": "Professional logo design and brand identity creation for East Sussex businesses."
      },
      {
          "title": "Brand Identity",
          "slug": "brand-identity",
          "description": "Full brand identity packages including logo, colours, typography and assets."
      },
      {
          "title": "Print Design",
          "slug": "print-design",
          "description": "Print-ready artwork and layout design for all print products in East Sussex."
      },
      {
          "title": "Artwork & Pre-Press",
          "slug": "artwork-prepress",
          "description": "Artwork preparation, file checking and pre-press services for all print jobs."
      }
  ],

  features: {
      "analytics": false,
      "consentBanner": false,
      "contactForm": true,
      "rateLimit": true,
      "testimonials": true,
      "blog": true
  },
};
