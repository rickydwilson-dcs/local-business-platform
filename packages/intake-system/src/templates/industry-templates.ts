/**
 * Industry Templates
 *
 * Pre-defined templates for common industries to accelerate intake process.
 * Each template provides suggested services, brand voice, and other defaults.
 */

import type { ServiceDefinition, BrandVoice, PricingTier } from "../schemas/project-file.schema";

// ============================================================================
// Types
// ============================================================================

export interface IndustryTemplate {
  /** Industry identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of the industry */
  description: string;
  /** Suggested services for this industry */
  suggestedServices: Omit<ServiceDefinition, "includeInGeneration">[];
  /** Default brand voice */
  defaultBrandVoice: BrandVoice;
  /** Default pricing structure */
  defaultPricing?: {
    domestic?: Partial<PricingTier>;
    commercial?: Partial<PricingTier>;
    specialist?: Partial<PricingTier>;
  };
  /** Common certifications for this industry */
  commonCertifications: string[];
  /** Common keywords for SEO */
  commonKeywords: string[];
  /** Icon identifier for UI */
  icon?: string;
}

// ============================================================================
// Industry Templates
// ============================================================================

export const scaffoldingTemplate: IndustryTemplate = {
  id: "scaffolding",
  name: "Scaffolding",
  description: "Scaffolding erection and hire services for construction and maintenance",
  suggestedServices: [
    {
      slug: "residential-scaffolding",
      title: "Residential Scaffolding",
      category: "core",
      keyFeatures: [
        "Safe access for home improvements",
        "Loft conversions and extensions",
        "Roof repairs and maintenance",
        "Window replacement projects",
      ],
      relatedServices: ["commercial-scaffolding", "roof-scaffolding"],
    },
    {
      slug: "commercial-scaffolding",
      title: "Commercial Scaffolding",
      category: "core",
      keyFeatures: [
        "Large-scale construction projects",
        "Office and retail building access",
        "Industrial facility maintenance",
        "Multi-storey building work",
      ],
      relatedServices: ["residential-scaffolding", "industrial-scaffolding"],
    },
    {
      slug: "roof-scaffolding",
      title: "Roof Scaffolding",
      category: "core",
      keyFeatures: [
        "Complete roof access solutions",
        "Chimney repairs and maintenance",
        "Solar panel installation access",
        "Gutter and fascia work",
      ],
      relatedServices: ["residential-scaffolding", "temporary-roofing"],
    },
    {
      slug: "temporary-roofing",
      title: "Temporary Roofing",
      category: "specialist",
      keyFeatures: [
        "Weather protection during roof work",
        "Heritage building protection",
        "Insurance work coverage",
        "Extended project timelines",
      ],
      relatedServices: ["roof-scaffolding", "heritage-scaffolding"],
    },
    {
      slug: "heritage-scaffolding",
      title: "Heritage & Listed Building Scaffolding",
      category: "specialist",
      keyFeatures: [
        "Conservation-sensitive approach",
        "Listed building expertise",
        "Church and historic building work",
        "Planning compliance support",
      ],
      relatedServices: ["commercial-scaffolding", "temporary-roofing"],
    },
    {
      slug: "industrial-scaffolding",
      title: "Industrial Scaffolding",
      category: "specialist",
      keyFeatures: [
        "Factory and warehouse access",
        "Tank and silo scaffolding",
        "Power station maintenance",
        "Confined space solutions",
      ],
      relatedServices: ["commercial-scaffolding", "staircase-towers"],
    },
    {
      slug: "staircase-towers",
      title: "Staircase Towers",
      category: "additional",
      keyFeatures: [
        "Safe pedestrian access",
        "Multi-level site access",
        "Temporary staircase solutions",
        "Event and construction use",
      ],
      relatedServices: ["commercial-scaffolding", "industrial-scaffolding"],
    },
    {
      slug: "scaffolding-hire",
      title: "Scaffolding Hire",
      category: "additional",
      keyFeatures: [
        "Flexible hire periods",
        "Competitive weekly rates",
        "Delivery and collection included",
        "Full inspection and compliance",
      ],
      relatedServices: ["residential-scaffolding", "commercial-scaffolding"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, reliable, safety-focused",
    avoidWords: ["cheap", "budget", "basic"],
    preferredTerms: ["safe access", "fully compliant", "experienced team", "quality assured"],
    usps: [
      "Fully trained CISRS cardholders",
      "TG20:21 compliant designs",
      "Comprehensive insurance coverage",
      "Rapid response times",
    ],
  },
  defaultPricing: {
    domestic: { min: 350, max: 800, unit: "per week", currency: "GBP" },
    commercial: { min: 1500, max: 5000, unit: "per week", currency: "GBP" },
    specialist: { min: 3000, max: 15000, unit: "per project", currency: "GBP" },
  },
  commonCertifications: ["CISRS", "TG20:21", "CHAS", "SafeContractor", "Constructionline", "SSIP"],
  commonKeywords: [
    "scaffolding",
    "scaffold hire",
    "scaffolders",
    "access solutions",
    "safe access",
    "construction scaffolding",
  ],
  icon: "scaffold",
};

export const plumbingTemplate: IndustryTemplate = {
  id: "plumbing",
  name: "Plumbing & Heating",
  description: "Plumbing, heating, and gas services for residential and commercial properties",
  suggestedServices: [
    {
      slug: "emergency-plumbing",
      title: "Emergency Plumbing",
      category: "core",
      keyFeatures: [
        "24/7 emergency callout",
        "Rapid response times",
        "Burst pipe repairs",
        "Leak detection and repair",
      ],
      relatedServices: ["general-plumbing", "drainage-services"],
    },
    {
      slug: "general-plumbing",
      title: "General Plumbing",
      category: "core",
      keyFeatures: [
        "Tap and toilet repairs",
        "Pipe installation and repair",
        "Bathroom plumbing",
        "Kitchen plumbing",
      ],
      relatedServices: ["emergency-plumbing", "bathroom-installation"],
    },
    {
      slug: "boiler-installation",
      title: "Boiler Installation",
      category: "core",
      keyFeatures: [
        "New boiler installation",
        "Boiler replacement",
        "System upgrades",
        "Energy-efficient options",
      ],
      relatedServices: ["boiler-servicing", "central-heating"],
    },
    {
      slug: "boiler-servicing",
      title: "Boiler Servicing & Repair",
      category: "core",
      keyFeatures: [
        "Annual servicing",
        "Breakdown repairs",
        "Safety checks",
        "Efficiency optimization",
      ],
      relatedServices: ["boiler-installation", "central-heating"],
    },
    {
      slug: "central-heating",
      title: "Central Heating",
      category: "core",
      keyFeatures: [
        "Full system installation",
        "Radiator installation",
        "Underfloor heating",
        "System upgrades",
      ],
      relatedServices: ["boiler-installation", "power-flushing"],
    },
    {
      slug: "bathroom-installation",
      title: "Bathroom Installation",
      category: "specialist",
      keyFeatures: [
        "Complete bathroom fitting",
        "Suite installation",
        "Wet room conversion",
        "Disability adaptations",
      ],
      relatedServices: ["general-plumbing", "drainage-services"],
    },
    {
      slug: "drainage-services",
      title: "Drainage Services",
      category: "specialist",
      keyFeatures: [
        "Blocked drain clearing",
        "CCTV drain surveys",
        "Drain repairs",
        "Preventive maintenance",
      ],
      relatedServices: ["general-plumbing", "emergency-plumbing"],
    },
    {
      slug: "power-flushing",
      title: "Power Flushing",
      category: "additional",
      keyFeatures: [
        "System cleansing",
        "Improved efficiency",
        "Cold spot elimination",
        "Extended system life",
      ],
      relatedServices: ["central-heating", "boiler-servicing"],
    },
  ],
  defaultBrandVoice: {
    tone: "trustworthy, experienced, helpful",
    avoidWords: ["cheap", "budget", "quick fix"],
    preferredTerms: [
      "Gas Safe registered",
      "fully qualified",
      "guaranteed work",
      "transparent pricing",
    ],
    usps: [
      "Gas Safe registered engineers",
      "No call-out fees",
      "Fixed price quotes",
      "All work guaranteed",
    ],
  },
  defaultPricing: {
    domestic: { min: 80, max: 250, unit: "per job", currency: "GBP" },
    commercial: { min: 500, max: 3000, unit: "per project", currency: "GBP" },
    specialist: { min: 2000, max: 10000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: [
    "Gas Safe",
    "OFTEC",
    "City & Guilds",
    "NVQ Level 3",
    "Which? Trusted Trader",
    "Checkatrade",
  ],
  commonKeywords: [
    "plumber",
    "heating engineer",
    "gas engineer",
    "boiler installation",
    "emergency plumber",
    "bathroom fitter",
  ],
  icon: "wrench",
};

export const electricalTemplate: IndustryTemplate = {
  id: "electrical",
  name: "Electrical Services",
  description: "Electrical installation, testing, and repair services",
  suggestedServices: [
    {
      slug: "domestic-electrical",
      title: "Domestic Electrical Services",
      category: "core",
      keyFeatures: [
        "Socket and switch installation",
        "Lighting installation",
        "Fault finding and repair",
        "Appliance installation",
      ],
      relatedServices: ["commercial-electrical", "rewiring"],
    },
    {
      slug: "commercial-electrical",
      title: "Commercial Electrical Services",
      category: "core",
      keyFeatures: [
        "Office electrical installation",
        "Retail fit-outs",
        "Warehouse electrical systems",
        "Maintenance contracts",
      ],
      relatedServices: ["domestic-electrical", "emergency-lighting"],
    },
    {
      slug: "rewiring",
      title: "Rewiring Services",
      category: "core",
      keyFeatures: [
        "Full house rewiring",
        "Partial rewiring",
        "Consumer unit upgrades",
        "Certification and testing",
      ],
      relatedServices: ["domestic-electrical", "eicr-testing"],
    },
    {
      slug: "eicr-testing",
      title: "EICR Testing & Certification",
      category: "core",
      keyFeatures: [
        "Electrical safety inspections",
        "Landlord certificates",
        "PAT testing",
        "Compliance reports",
      ],
      relatedServices: ["rewiring", "domestic-electrical"],
    },
    {
      slug: "ev-charging",
      title: "EV Charger Installation",
      category: "specialist",
      keyFeatures: [
        "Home charger installation",
        "Workplace charging points",
        "OZEV grant processing",
        "Smart charger setup",
      ],
      relatedServices: ["domestic-electrical", "commercial-electrical"],
    },
    {
      slug: "emergency-lighting",
      title: "Emergency Lighting",
      category: "specialist",
      keyFeatures: [
        "Installation and design",
        "Testing and maintenance",
        "Compliance certification",
        "LED upgrades",
      ],
      relatedServices: ["commercial-electrical", "fire-alarm-systems"],
    },
    {
      slug: "fire-alarm-systems",
      title: "Fire Alarm Systems",
      category: "specialist",
      keyFeatures: [
        "System design and installation",
        "Testing and maintenance",
        "Certification",
        "Upgrades and repairs",
      ],
      relatedServices: ["emergency-lighting", "commercial-electrical"],
    },
    {
      slug: "smart-home",
      title: "Smart Home Installation",
      category: "additional",
      keyFeatures: [
        "Smart lighting systems",
        "Home automation",
        "Security system integration",
        "Voice control setup",
      ],
      relatedServices: ["domestic-electrical", "ev-charging"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, safety-conscious, modern",
    avoidWords: ["cheap", "DIY", "quick"],
    preferredTerms: [
      "fully certified",
      "Part P compliant",
      "NICEIC approved",
      "tested and certified",
    ],
    usps: [
      "NICEIC registered",
      "Part P certified",
      "Fully insured",
      "Certificates provided with all work",
    ],
  },
  defaultPricing: {
    domestic: { min: 100, max: 400, unit: "per job", currency: "GBP" },
    commercial: { min: 500, max: 5000, unit: "per project", currency: "GBP" },
    specialist: { min: 1500, max: 20000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: [
    "NICEIC",
    "Part P",
    "NAPIT",
    "ECS Card",
    "City & Guilds 18th Edition",
    "JIB",
  ],
  commonKeywords: [
    "electrician",
    "electrical contractor",
    "rewiring",
    "EICR",
    "EV charger installation",
    "electrical testing",
  ],
  icon: "bolt",
};

export const cleaningTemplate: IndustryTemplate = {
  id: "cleaning",
  name: "Cleaning Services",
  description: "Professional cleaning services for homes and businesses",
  suggestedServices: [
    {
      slug: "domestic-cleaning",
      title: "Domestic Cleaning",
      category: "core",
      keyFeatures: [
        "Regular house cleaning",
        "One-off deep cleans",
        "Spring cleaning",
        "Flexible scheduling",
      ],
      relatedServices: ["end-of-tenancy", "carpet-cleaning"],
    },
    {
      slug: "commercial-cleaning",
      title: "Commercial Cleaning",
      category: "core",
      keyFeatures: [
        "Office cleaning",
        "Retail cleaning",
        "Medical facility cleaning",
        "Contract cleaning",
      ],
      relatedServices: ["domestic-cleaning", "industrial-cleaning"],
    },
    {
      slug: "end-of-tenancy",
      title: "End of Tenancy Cleaning",
      category: "core",
      keyFeatures: [
        "Full property deep clean",
        "Deposit-back guarantee",
        "Landlord and agent approved",
        "Comprehensive checklist",
      ],
      relatedServices: ["domestic-cleaning", "carpet-cleaning"],
    },
    {
      slug: "carpet-cleaning",
      title: "Carpet & Upholstery Cleaning",
      category: "specialist",
      keyFeatures: [
        "Professional deep cleaning",
        "Stain removal",
        "Pet odor treatment",
        "Fabric protection",
      ],
      relatedServices: ["domestic-cleaning", "end-of-tenancy"],
    },
    {
      slug: "window-cleaning",
      title: "Window Cleaning",
      category: "specialist",
      keyFeatures: [
        "Interior and exterior",
        "High-reach specialists",
        "Frame and sill cleaning",
        "Regular service plans",
      ],
      relatedServices: ["commercial-cleaning", "domestic-cleaning"],
    },
    {
      slug: "industrial-cleaning",
      title: "Industrial Cleaning",
      category: "specialist",
      keyFeatures: [
        "Factory cleaning",
        "Warehouse cleaning",
        "Heavy machinery cleaning",
        "Health and safety compliance",
      ],
      relatedServices: ["commercial-cleaning", "specialist-cleaning"],
    },
    {
      slug: "specialist-cleaning",
      title: "Specialist Cleaning",
      category: "additional",
      keyFeatures: [
        "After-builders cleaning",
        "Hoarding clearance",
        "Trauma cleaning",
        "COVID-19 sanitization",
      ],
      relatedServices: ["industrial-cleaning", "commercial-cleaning"],
    },
  ],
  defaultBrandVoice: {
    tone: "friendly, thorough, reliable",
    avoidWords: ["cheap", "basic", "quick"],
    preferredTerms: ["thorough clean", "attention to detail", "trusted team", "eco-friendly"],
    usps: [
      "DBS checked staff",
      "Fully insured",
      "Eco-friendly products available",
      "Satisfaction guaranteed",
    ],
  },
  defaultPricing: {
    domestic: { min: 50, max: 150, unit: "per clean", currency: "GBP" },
    commercial: { min: 200, max: 1000, unit: "per week", currency: "GBP" },
    specialist: { min: 300, max: 2000, unit: "per service", currency: "GBP" },
  },
  commonCertifications: [
    "DBS Checked",
    "British Institute of Cleaning Science",
    "Safe Contractor",
    "ISO 9001",
    "CHAS",
  ],
  commonKeywords: [
    "cleaning services",
    "cleaners",
    "house cleaning",
    "office cleaning",
    "professional cleaners",
    "deep clean",
  ],
  icon: "sparkles",
};

export const landscapingTemplate: IndustryTemplate = {
  id: "landscaping",
  name: "Landscaping & Gardening",
  description: "Garden design, landscaping, and maintenance services",
  suggestedServices: [
    {
      slug: "garden-maintenance",
      title: "Garden Maintenance",
      category: "core",
      keyFeatures: [
        "Lawn mowing and edging",
        "Hedge trimming",
        "Weeding and planting",
        "Regular maintenance plans",
      ],
      relatedServices: ["lawn-care", "garden-design"],
    },
    {
      slug: "lawn-care",
      title: "Lawn Care Services",
      category: "core",
      keyFeatures: [
        "Lawn treatment programs",
        "Scarification and aeration",
        "Overseeding",
        "Weed and moss control",
      ],
      relatedServices: ["garden-maintenance", "turfing"],
    },
    {
      slug: "garden-design",
      title: "Garden Design",
      category: "core",
      keyFeatures: [
        "Bespoke garden designs",
        "3D visualizations",
        "Planting schemes",
        "Project management",
      ],
      relatedServices: ["landscaping", "garden-maintenance"],
    },
    {
      slug: "landscaping",
      title: "Landscaping Services",
      category: "core",
      keyFeatures: [
        "Hard landscaping",
        "Soft landscaping",
        "Patios and decking",
        "Garden renovation",
      ],
      relatedServices: ["garden-design", "fencing"],
    },
    {
      slug: "turfing",
      title: "Turfing & Lawn Installation",
      category: "specialist",
      keyFeatures: [
        "New lawn installation",
        "Lawn renovation",
        "Artificial grass",
        "Soil preparation",
      ],
      relatedServices: ["lawn-care", "landscaping"],
    },
    {
      slug: "fencing",
      title: "Fencing & Gates",
      category: "specialist",
      keyFeatures: ["Fence installation", "Gate installation", "Fence repairs", "Bespoke fencing"],
      relatedServices: ["landscaping", "decking"],
    },
    {
      slug: "decking",
      title: "Decking Installation",
      category: "specialist",
      keyFeatures: ["Composite decking", "Timber decking", "Raised decking", "Deck maintenance"],
      relatedServices: ["landscaping", "fencing"],
    },
    {
      slug: "tree-services",
      title: "Tree Surgery",
      category: "additional",
      keyFeatures: [
        "Tree pruning and shaping",
        "Tree removal",
        "Stump grinding",
        "Hedge reduction",
      ],
      relatedServices: ["garden-maintenance", "landscaping"],
    },
  ],
  defaultBrandVoice: {
    tone: "passionate, knowledgeable, creative",
    avoidWords: ["cheap", "quick", "basic"],
    preferredTerms: ["bespoke design", "expert care", "sustainable", "outdoor living"],
    usps: [
      "Award-winning designs",
      "Sustainable practices",
      "Qualified horticulturists",
      "Full project management",
    ],
  },
  defaultPricing: {
    domestic: { min: 80, max: 300, unit: "per visit", currency: "GBP" },
    commercial: { min: 500, max: 2000, unit: "per month", currency: "GBP" },
    specialist: { min: 5000, max: 50000, unit: "per project", currency: "GBP" },
  },
  commonCertifications: [
    "RHS Qualified",
    "BALI Registered",
    "City & Guilds",
    "NPTC Tree Surgery",
    "Lantra",
  ],
  commonKeywords: [
    "landscaping",
    "garden design",
    "gardening services",
    "lawn care",
    "landscapers",
    "garden maintenance",
  ],
  icon: "tree",
};

export const roofingTemplate: IndustryTemplate = {
  id: "roofing",
  name: "Roofing Services",
  description:
    "Roof repairs, replacements, and maintenance for residential and commercial properties",
  suggestedServices: [
    {
      slug: "roof-repairs",
      title: "Roof Repairs",
      category: "core",
      keyFeatures: [
        "Leak detection and repair",
        "Storm damage restoration",
        "Tile and slate replacement",
        "Ridge and hip repairs",
      ],
      relatedServices: ["roof-replacement", "emergency-roofing"],
    },
    {
      slug: "roof-replacement",
      title: "Roof Replacement",
      category: "core",
      keyFeatures: [
        "Full roof replacement",
        "Re-roofing services",
        "New roof installation",
        "All roofing materials",
      ],
      relatedServices: ["roof-repairs", "flat-roofing"],
    },
    {
      slug: "flat-roofing",
      title: "Flat Roofing",
      category: "core",
      keyFeatures: [
        "EPDM rubber roofing",
        "GRP fibreglass roofing",
        "Felt roofing systems",
        "Green roof installation",
      ],
      relatedServices: ["roof-replacement", "commercial-roofing"],
    },
    {
      slug: "guttering-services",
      title: "Guttering & Downpipes",
      category: "core",
      keyFeatures: [
        "Gutter installation",
        "Gutter cleaning and repairs",
        "Downpipe replacement",
        "Leaf guard systems",
      ],
      relatedServices: ["fascias-soffits", "roof-repairs"],
    },
    {
      slug: "fascias-soffits",
      title: "Fascias & Soffits",
      category: "specialist",
      keyFeatures: [
        "UPVC fascia installation",
        "Soffit replacement",
        "Cladding services",
        "Dry verge systems",
      ],
      relatedServices: ["guttering-services", "roof-repairs"],
    },
    {
      slug: "chimney-work",
      title: "Chimney Services",
      category: "specialist",
      keyFeatures: [
        "Chimney repairs",
        "Repointing and rebuilding",
        "Lead flashing replacement",
        "Chimney cowl fitting",
      ],
      relatedServices: ["roof-repairs", "lead-work"],
    },
    {
      slug: "lead-work",
      title: "Lead Work",
      category: "specialist",
      keyFeatures: [
        "Lead flashing installation",
        "Flat lead roofing",
        "Valley and gutter lining",
        "Heritage lead work",
      ],
      relatedServices: ["chimney-work", "flat-roofing"],
    },
    {
      slug: "emergency-roofing",
      title: "Emergency Roofing",
      category: "additional",
      keyFeatures: [
        "24/7 emergency response",
        "Storm damage repairs",
        "Temporary weatherproofing",
        "Insurance work",
      ],
      relatedServices: ["roof-repairs", "roof-replacement"],
    },
  ],
  defaultBrandVoice: {
    tone: "trustworthy, experienced, dependable",
    avoidWords: ["cheap", "budget", "temporary"],
    preferredTerms: ["quality materials", "long-lasting", "weatherproof", "expert roofers"],
    usps: [
      "NFRC registered contractors",
      "10-year guarantee on all work",
      "Free no-obligation surveys",
      "All work fully insured",
    ],
  },
  defaultPricing: {
    domestic: { min: 150, max: 800, unit: "per repair", currency: "GBP" },
    commercial: { min: 2000, max: 15000, unit: "per project", currency: "GBP" },
    specialist: { min: 5000, max: 25000, unit: "per roof", currency: "GBP" },
  },
  commonCertifications: [
    "NFRC",
    "TrustMark",
    "CompetentRoofer",
    "CHAS",
    "Constructionline",
    "SafeContractor",
  ],
  commonKeywords: [
    "roofers",
    "roofing contractor",
    "roof repairs",
    "roof replacement",
    "flat roofing",
    "guttering",
    "fascias and soffits",
  ],
  icon: "home",
};

export const paintingDecoratingTemplate: IndustryTemplate = {
  id: "painting-decorating",
  name: "Painting & Decorating",
  description: "Interior and exterior painting, decorating, and wallpapering services",
  suggestedServices: [
    {
      slug: "interior-painting",
      title: "Interior Painting",
      category: "core",
      keyFeatures: [
        "Walls and ceilings",
        "Woodwork and trim",
        "Feature walls",
        "Complete room makeovers",
      ],
      relatedServices: ["exterior-painting", "wallpapering"],
    },
    {
      slug: "exterior-painting",
      title: "Exterior Painting",
      category: "core",
      keyFeatures: [
        "House exterior painting",
        "Masonry and render painting",
        "Window and door painting",
        "Weatherproof finishes",
      ],
      relatedServices: ["interior-painting", "commercial-decorating"],
    },
    {
      slug: "wallpapering",
      title: "Wallpapering",
      category: "core",
      keyFeatures: [
        "Wallpaper hanging",
        "Feature wall installation",
        "Wallpaper removal",
        "Specialist papers",
      ],
      relatedServices: ["interior-painting", "decorating"],
    },
    {
      slug: "decorating",
      title: "Decorating Services",
      category: "core",
      keyFeatures: [
        "Full room decoration",
        "Colour consultation",
        "Surface preparation",
        "Quality finishes",
      ],
      relatedServices: ["interior-painting", "wallpapering"],
    },
    {
      slug: "spray-painting",
      title: "Spray Painting",
      category: "specialist",
      keyFeatures: [
        "Kitchen cabinet spraying",
        "UPVC spraying",
        "Large surface coverage",
        "Factory-quality finish",
      ],
      relatedServices: ["interior-painting", "commercial-decorating"],
    },
    {
      slug: "commercial-decorating",
      title: "Commercial Decorating",
      category: "specialist",
      keyFeatures: [
        "Office and retail spaces",
        "Out-of-hours working",
        "Minimal disruption",
        "Contract decorating",
      ],
      relatedServices: ["exterior-painting", "spray-painting"],
    },
    {
      slug: "specialist-finishes",
      title: "Specialist Finishes",
      category: "specialist",
      keyFeatures: [
        "Faux finishes",
        "Murals and effects",
        "Metallic finishes",
        "Textured coatings",
      ],
      relatedServices: ["interior-painting", "decorating"],
    },
    {
      slug: "property-maintenance",
      title: "Property Maintenance",
      category: "additional",
      keyFeatures: [
        "Landlord services",
        "End-of-tenancy refresh",
        "Regular maintenance",
        "Multi-property contracts",
      ],
      relatedServices: ["interior-painting", "exterior-painting"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, meticulous, creative",
    avoidWords: ["cheap", "quick", "basic"],
    preferredTerms: [
      "quality finish",
      "attention to detail",
      "professional painters",
      "clean and tidy",
    ],
    usps: [
      "Dulux Select Decorator",
      "TrustMark approved",
      "Full dust sheets and protection",
      "Premium paints and materials",
    ],
  },
  defaultPricing: {
    domestic: { min: 200, max: 600, unit: "per room", currency: "GBP" },
    commercial: { min: 1500, max: 10000, unit: "per project", currency: "GBP" },
    specialist: { min: 500, max: 3000, unit: "per feature", currency: "GBP" },
  },
  commonCertifications: [
    "PDA",
    "Dulux Select Decorator",
    "FMB",
    "TrustMark",
    "City & Guilds",
    "CSCS Card",
  ],
  commonKeywords: [
    "painter and decorator",
    "painting services",
    "interior decorator",
    "exterior painting",
    "wallpaper hanging",
    "house painters",
  ],
  icon: "paintbrush",
};

export const carpentryTemplate: IndustryTemplate = {
  id: "carpentry",
  name: "Carpentry & Joinery",
  description: "Bespoke carpentry, joinery, and woodwork services for homes and businesses",
  suggestedServices: [
    {
      slug: "kitchen-fitting",
      title: "Kitchen Fitting",
      category: "core",
      keyFeatures: [
        "Complete kitchen installation",
        "Worktop fitting",
        "Unit assembly and fitting",
        "Bespoke kitchen units",
      ],
      relatedServices: ["bespoke-furniture", "doors-windows"],
    },
    {
      slug: "doors-windows",
      title: "Doors & Windows",
      category: "core",
      keyFeatures: [
        "Internal door fitting",
        "External door installation",
        "Window fitting",
        "Door hanging and repairs",
      ],
      relatedServices: ["kitchen-fitting", "flooring"],
    },
    {
      slug: "flooring",
      title: "Flooring Installation",
      category: "core",
      keyFeatures: [
        "Hardwood flooring",
        "Laminate installation",
        "Engineered wood flooring",
        "Floor repairs and restoration",
      ],
      relatedServices: ["doors-windows", "skirting-architrave"],
    },
    {
      slug: "bespoke-furniture",
      title: "Bespoke Furniture",
      category: "specialist",
      keyFeatures: [
        "Fitted wardrobes",
        "Built-in storage",
        "Custom shelving",
        "Handmade furniture",
      ],
      relatedServices: ["kitchen-fitting", "alcove-units"],
    },
    {
      slug: "alcove-units",
      title: "Alcove Units & Shelving",
      category: "specialist",
      keyFeatures: ["Alcove cabinets", "Floating shelves", "Media units", "Home office solutions"],
      relatedServices: ["bespoke-furniture", "skirting-architrave"],
    },
    {
      slug: "structural-carpentry",
      title: "Structural Carpentry",
      category: "specialist",
      keyFeatures: [
        "Roof timber work",
        "Stud wall construction",
        "Floor joist repairs",
        "Loft conversions",
      ],
      relatedServices: ["flooring", "doors-windows"],
    },
    {
      slug: "skirting-architrave",
      title: "Skirting & Architrave",
      category: "additional",
      keyFeatures: [
        "Skirting board installation",
        "Architrave fitting",
        "Coving and cornices",
        "Period style mouldings",
      ],
      relatedServices: ["flooring", "doors-windows"],
    },
    {
      slug: "garden-structures",
      title: "Garden Structures",
      category: "additional",
      keyFeatures: [
        "Garden rooms",
        "Pergolas and gazebos",
        "Sheds and summerhouses",
        "Outdoor storage",
      ],
      relatedServices: ["bespoke-furniture", "structural-carpentry"],
    },
  ],
  defaultBrandVoice: {
    tone: "skilled, precise, craftsman",
    avoidWords: ["cheap", "flat-pack", "quick"],
    preferredTerms: ["handcrafted", "bespoke", "precision-fitted", "master craftsman"],
    usps: [
      "Guild of Master Craftsmen member",
      "Bespoke designs",
      "25+ years experience",
      "Premium materials only",
    ],
  },
  defaultPricing: {
    domestic: { min: 200, max: 800, unit: "per day", currency: "GBP" },
    commercial: { min: 1000, max: 5000, unit: "per project", currency: "GBP" },
    specialist: { min: 3000, max: 15000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: [
    "Guild of Master Craftsmen",
    "FMBA",
    "City & Guilds",
    "NVQ Level 3",
    "CSCS Card",
    "BWF",
  ],
  commonKeywords: [
    "carpenter",
    "joiner",
    "kitchen fitter",
    "bespoke carpentry",
    "fitted furniture",
    "door hanging",
  ],
  icon: "hammer",
};

export const locksmithTemplate: IndustryTemplate = {
  id: "locksmith",
  name: "Locksmith Services",
  description: "Emergency lockout, lock replacement, and security services",
  suggestedServices: [
    {
      slug: "emergency-lockout",
      title: "Emergency Lockout",
      category: "core",
      keyFeatures: [
        "24/7 emergency response",
        "Locked out assistance",
        "Non-destructive entry",
        "Rapid response times",
      ],
      relatedServices: ["lock-replacement", "lock-repairs"],
    },
    {
      slug: "lock-replacement",
      title: "Lock Replacement",
      category: "core",
      keyFeatures: [
        "All lock types fitted",
        "British Standard locks",
        "Insurance-approved locks",
        "Key cutting service",
      ],
      relatedServices: ["emergency-lockout", "security-upgrades"],
    },
    {
      slug: "lock-repairs",
      title: "Lock Repairs",
      category: "core",
      keyFeatures: [
        "Damaged lock repairs",
        "Stiff lock servicing",
        "Mechanism replacement",
        "Key extraction",
      ],
      relatedServices: ["lock-replacement", "emergency-lockout"],
    },
    {
      slug: "security-upgrades",
      title: "Security Upgrades",
      category: "core",
      keyFeatures: [
        "High-security locks",
        "Multi-point locking systems",
        "Security surveys",
        "Insurance compliance",
      ],
      relatedServices: ["lock-replacement", "smart-locks"],
    },
    {
      slug: "upvc-locks",
      title: "UPVC Door & Window Locks",
      category: "specialist",
      keyFeatures: [
        "UPVC lock repairs",
        "Mechanism replacement",
        "Handle and barrel fitting",
        "Double glazing security",
      ],
      relatedServices: ["lock-replacement", "security-upgrades"],
    },
    {
      slug: "smart-locks",
      title: "Smart Lock Installation",
      category: "specialist",
      keyFeatures: [
        "Keyless entry systems",
        "Smart lock fitting",
        "Access control",
        "App-controlled locks",
      ],
      relatedServices: ["security-upgrades", "commercial-locksmith"],
    },
    {
      slug: "safe-services",
      title: "Safe Services",
      category: "specialist",
      keyFeatures: ["Safe opening", "Safe installation", "Combination changes", "Safe repairs"],
      relatedServices: ["commercial-locksmith", "security-upgrades"],
    },
    {
      slug: "commercial-locksmith",
      title: "Commercial Locksmith",
      category: "additional",
      keyFeatures: [
        "Master key systems",
        "Access control systems",
        "Restricted key systems",
        "Contract maintenance",
      ],
      relatedServices: ["smart-locks", "safe-services"],
    },
  ],
  defaultBrandVoice: {
    tone: "trustworthy, rapid, security-focused",
    avoidWords: ["cheap", "break-in", "bypass"],
    preferredTerms: ["rapid response", "secure", "police vetted", "no call-out fee"],
    usps: [
      "MLA approved locksmith",
      "DBS checked and police vetted",
      "24/7 emergency service",
      "No call-out fees",
    ],
  },
  defaultPricing: {
    domestic: { min: 70, max: 200, unit: "per service", currency: "GBP" },
    commercial: { min: 200, max: 1000, unit: "per project", currency: "GBP" },
    specialist: { min: 150, max: 500, unit: "per job", currency: "GBP" },
  },
  commonCertifications: [
    "MLA",
    "SSAIB",
    "DBS Checked",
    "City & Guilds",
    "UKAS Accredited",
    "NSI Approved",
  ],
  commonKeywords: [
    "locksmith",
    "emergency locksmith",
    "locked out",
    "lock change",
    "24 hour locksmith",
    "security locks",
  ],
  icon: "key",
};

export const hvacTemplate: IndustryTemplate = {
  id: "hvac",
  name: "HVAC Services",
  description: "Air conditioning, ventilation, and heat pump installation and maintenance",
  suggestedServices: [
    {
      slug: "air-conditioning-installation",
      title: "Air Conditioning Installation",
      category: "core",
      keyFeatures: [
        "Split system installation",
        "Multi-split systems",
        "Ducted systems",
        "Energy-efficient units",
      ],
      relatedServices: ["air-conditioning-servicing", "heat-pumps"],
    },
    {
      slug: "air-conditioning-servicing",
      title: "Air Conditioning Servicing",
      category: "core",
      keyFeatures: [
        "Annual maintenance",
        "Filter cleaning and replacement",
        "Gas recharge",
        "Performance checks",
      ],
      relatedServices: ["air-conditioning-installation", "air-conditioning-repairs"],
    },
    {
      slug: "air-conditioning-repairs",
      title: "Air Conditioning Repairs",
      category: "core",
      keyFeatures: [
        "Fault diagnosis",
        "Component replacement",
        "Emergency repairs",
        "All makes and models",
      ],
      relatedServices: ["air-conditioning-servicing", "air-conditioning-installation"],
    },
    {
      slug: "heat-pumps",
      title: "Heat Pump Installation",
      category: "core",
      keyFeatures: [
        "Air source heat pumps",
        "Ground source heat pumps",
        "MCS certified installations",
        "Government grant assistance",
      ],
      relatedServices: ["air-conditioning-installation", "ventilation-systems"],
    },
    {
      slug: "ventilation-systems",
      title: "Ventilation Systems",
      category: "specialist",
      keyFeatures: [
        "MVHR systems",
        "Extract ventilation",
        "Kitchen extraction",
        "Bathroom ventilation",
      ],
      relatedServices: ["heat-pumps", "commercial-hvac"],
    },
    {
      slug: "commercial-hvac",
      title: "Commercial HVAC",
      category: "specialist",
      keyFeatures: [
        "Office air conditioning",
        "Server room cooling",
        "Retail climate control",
        "Industrial systems",
      ],
      relatedServices: ["ventilation-systems", "hvac-maintenance"],
    },
    {
      slug: "hvac-maintenance",
      title: "HVAC Maintenance Contracts",
      category: "specialist",
      keyFeatures: [
        "Planned maintenance",
        "Priority call-outs",
        "Annual inspections",
        "F-Gas compliance",
      ],
      relatedServices: ["commercial-hvac", "air-conditioning-servicing"],
    },
    {
      slug: "refrigeration",
      title: "Refrigeration Services",
      category: "additional",
      keyFeatures: [
        "Commercial refrigeration",
        "Cold room installation",
        "Refrigeration repairs",
        "Temperature monitoring",
      ],
      relatedServices: ["commercial-hvac", "hvac-maintenance"],
    },
  ],
  defaultBrandVoice: {
    tone: "technical, reliable, energy-conscious",
    avoidWords: ["cheap", "basic", "temporary"],
    preferredTerms: [
      "energy efficient",
      "certified engineers",
      "F-Gas compliant",
      "manufacturer approved",
    ],
    usps: [
      "F-Gas certified engineers",
      "Manufacturer-approved installers",
      "MCS accredited for heat pumps",
      "Comprehensive warranties",
    ],
  },
  defaultPricing: {
    domestic: { min: 1500, max: 4000, unit: "per unit", currency: "GBP" },
    commercial: { min: 5000, max: 30000, unit: "per system", currency: "GBP" },
    specialist: { min: 8000, max: 50000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: ["F-Gas", "REFCOM", "Gas Safe", "BESA", "MCS", "City & Guilds"],
  commonKeywords: [
    "air conditioning",
    "HVAC",
    "heat pump installer",
    "air con installation",
    "ventilation",
    "climate control",
  ],
  icon: "thermometer",
};

// ============================================================================
// NEW INDUSTRY TEMPLATES
// ============================================================================

export const handymanTemplate: IndustryTemplate = {
  id: "handyman",
  name: "Handyman Services",
  description: "General property repairs, maintenance, and home improvement services",
  suggestedServices: [
    {
      slug: "flat-pack-assembly",
      title: "Flat Pack Furniture Assembly",
      category: "core",
      keyFeatures: [
        "IKEA and all brands assembled",
        "Wardrobes, beds, and desks",
        "Secure wall mounting where needed",
        "Same-day service available",
      ],
      relatedServices: ["shelf-installation", "tv-mounting"],
    },
    {
      slug: "tv-mounting",
      title: "TV Wall Mounting",
      category: "core",
      keyFeatures: [
        "Secure bracket installation",
        "Cable management and hiding",
        "All wall types including plasterboard",
        "Soundbar and accessory mounting",
      ],
      relatedServices: ["shelf-installation", "picture-hanging"],
    },
    {
      slug: "door-repairs",
      title: "Door Repairs & Adjustment",
      category: "core",
      keyFeatures: [
        "Sticking door repairs",
        "Hinge adjustments and replacement",
        "Handle and lock fitting",
        "Door trimming and planing",
      ],
      relatedServices: ["lock-repairs", "window-repairs"],
    },
    {
      slug: "gutter-cleaning",
      title: "Gutter Cleaning",
      category: "core",
      keyFeatures: [
        "Debris and leaf removal",
        "Downpipe clearance",
        "Minor repair identification",
        "Before and after photos",
      ],
      relatedServices: ["gutter-repairs", "pressure-washing"],
    },
    {
      slug: "pressure-washing",
      title: "Pressure Washing",
      category: "specialist",
      keyFeatures: [
        "Driveway and patio cleaning",
        "Decking restoration",
        "Fence and wall cleaning",
        "Moss and algae removal",
      ],
      relatedServices: ["decking-maintenance", "gutter-cleaning"],
    },
    {
      slug: "fence-repairs",
      title: "Fence Repairs",
      category: "specialist",
      keyFeatures: [
        "Storm damage repairs",
        "Panel and post replacement",
        "Gate adjustments",
        "Fence staining and treatment",
      ],
      relatedServices: ["gate-repairs", "decking-maintenance"],
    },
    {
      slug: "loft-boarding",
      title: "Loft Boarding",
      category: "specialist",
      keyFeatures: [
        "Storage space creation",
        "Raised boarding over insulation",
        "Loft ladder installation",
        "Light fitting available",
      ],
      relatedServices: ["loft-ladder-fitting", "draught-proofing"],
    },
    {
      slug: "bathroom-repairs",
      title: "Bathroom Repairs",
      category: "additional",
      keyFeatures: [
        "Toilet seat replacement",
        "Towel rail and accessory fitting",
        "Sealant and grouting refresh",
        "Cabinet door adjustments",
      ],
      relatedServices: ["tap-repairs", "kitchen-repairs"],
    },
  ],
  defaultBrandVoice: {
    tone: "friendly, reliable, practical",
    avoidWords: ["cheap", "bodge", "quick fix"],
    preferredTerms: ["reliable service", "no job too small", "fully equipped", "local handyman"],
    usps: [
      "No job too small",
      "Fully equipped van",
      "Same-day service available",
      "Clear hourly rates",
    ],
  },
  defaultPricing: {
    domestic: { min: 40, max: 80, unit: "per hour", currency: "GBP" },
    commercial: { min: 200, max: 500, unit: "per day", currency: "GBP" },
    specialist: { min: 150, max: 600, unit: "per project", currency: "GBP" },
  },
  commonCertifications: [
    "City & Guilds",
    "TrustMark",
    "Which? Trusted Trader",
    "Checkatrade",
    "DBS Checked",
    "Public Liability Insurance",
  ],
  commonKeywords: [
    "handyman",
    "odd jobs",
    "property maintenance",
    "home repairs",
    "DIY help",
    "local handyman",
  ],
  icon: "tools",
};

export const plasteringTemplate: IndustryTemplate = {
  id: "plastering",
  name: "Plastering Services",
  description:
    "Internal plastering, rendering, and dry lining for residential and commercial properties",
  suggestedServices: [
    {
      slug: "wall-skimming",
      title: "Wall Skimming",
      category: "core",
      keyFeatures: [
        "Smooth finish over plasterboard",
        "Wallpaper-ready surfaces",
        "Paint-ready finishes",
        "All room sizes undertaken",
      ],
      relatedServices: ["ceiling-plastering", "plasterboard-installation"],
    },
    {
      slug: "ceiling-plastering",
      title: "Ceiling Plastering",
      category: "core",
      keyFeatures: [
        "Smooth ceiling finishes",
        "Artex covering and removal",
        "Crack repairs",
        "Texture matching",
      ],
      relatedServices: ["wall-skimming", "artex-removal"],
    },
    {
      slug: "full-room-plastering",
      title: "Full Room Plastering",
      category: "core",
      keyFeatures: [
        "Complete room renovation",
        "Walls and ceiling included",
        "Garage and outbuilding conversions",
        "New extension finishing",
      ],
      relatedServices: ["wall-skimming", "ceiling-plastering"],
    },
    {
      slug: "external-rendering",
      title: "External Rendering",
      category: "core",
      keyFeatures: [
        "Sand and cement render",
        "Weather protection",
        "Kerb appeal improvement",
        "Crack and damage repairs",
      ],
      relatedServices: ["silicone-render", "render-repairs"],
    },
    {
      slug: "silicone-render",
      title: "Silicone Render",
      category: "specialist",
      keyFeatures: [
        "Low-maintenance finish",
        "Wide colour range",
        "Self-cleaning properties",
        "Long-lasting protection",
      ],
      relatedServices: ["external-rendering", "monocouche-render"],
    },
    {
      slug: "plasterboard-installation",
      title: "Plasterboard Installation",
      category: "specialist",
      keyFeatures: [
        "Dry lining solutions",
        "Stud wall boarding",
        "Loft conversion boarding",
        "Fire-rated boards available",
      ],
      relatedServices: ["wall-skimming", "stud-wall-construction"],
    },
    {
      slug: "damp-proofing",
      title: "Damp Proofing Plaster",
      category: "specialist",
      keyFeatures: [
        "Renovating plaster systems",
        "Salt-resistant finishes",
        "Basement and cellar work",
        "Post-treatment replastering",
      ],
      relatedServices: ["plaster-repairs", "tanking"],
    },
    {
      slug: "coving-fitting",
      title: "Coving & Cornice Installation",
      category: "additional",
      keyFeatures: [
        "Period style restoration",
        "Modern coving installation",
        "Ceiling rose fitting",
        "Seamless corner joints",
      ],
      relatedServices: ["ceiling-plastering", "plaster-repairs"],
    },
  ],
  defaultBrandVoice: {
    tone: "skilled, experienced, quality-focused",
    avoidWords: ["cheap", "quick", "budget"],
    preferredTerms: [
      "smooth finish",
      "quality workmanship",
      "time-served plasterer",
      "clean and tidy",
    ],
    usps: [
      "Time-served craftsmen",
      "Dust sheets and protection included",
      "All waste removed",
      "Paint-ready finishes guaranteed",
    ],
  },
  defaultPricing: {
    domestic: { min: 150, max: 400, unit: "per room", currency: "GBP" },
    commercial: { min: 500, max: 2500, unit: "per project", currency: "GBP" },
    specialist: { min: 2000, max: 8000, unit: "per property", currency: "GBP" },
  },
  commonCertifications: ["NVQ Level 2/3", "CITB", "FMB", "TrustMark", "City & Guilds", "CSCS Card"],
  commonKeywords: [
    "plasterer",
    "plastering services",
    "rendering",
    "wall skimming",
    "ceiling plastering",
    "dry lining",
  ],
  icon: "trowel",
};

export const fencingDeckingTemplate: IndustryTemplate = {
  id: "fencing-decking",
  name: "Fencing & Decking",
  description: "Fence installation, decking construction, and garden structures",
  suggestedServices: [
    {
      slug: "fence-panel-installation",
      title: "Fence Panel Installation",
      category: "core",
      keyFeatures: [
        "Lap and closeboard panels",
        "Concrete or timber posts",
        "Gravel boards included",
        "All fixings supplied",
      ],
      relatedServices: ["closeboard-fencing", "gate-installation"],
    },
    {
      slug: "closeboard-fencing",
      title: "Closeboard Fencing",
      category: "core",
      keyFeatures: [
        "Maximum privacy and security",
        "Featheredge board construction",
        "Wind-resistant design",
        "Long-lasting durability",
      ],
      relatedServices: ["fence-panel-installation", "fence-post-installation"],
    },
    {
      slug: "decking-installation",
      title: "Decking Installation",
      category: "core",
      keyFeatures: [
        "Timber and composite options",
        "Proper sub-frame construction",
        "Non-slip finishes available",
        "Built to last design",
      ],
      relatedServices: ["decking-repairs", "deck-balustrade"],
    },
    {
      slug: "gate-installation",
      title: "Garden Gate Installation",
      category: "core",
      keyFeatures: [
        "Side and garden gates",
        "Driveway gates",
        "Heavy-duty hinges and locks",
        "Bespoke designs available",
      ],
      relatedServices: ["fence-panel-installation", "gate-repairs"],
    },
    {
      slug: "fence-repairs",
      title: "Fence Repairs",
      category: "specialist",
      keyFeatures: [
        "Storm damage repairs",
        "Panel replacement",
        "Post repair and replacement",
        "Quick turnaround",
      ],
      relatedServices: ["fence-panel-installation", "fence-treatment"],
    },
    {
      slug: "decking-repairs",
      title: "Decking Repairs",
      category: "specialist",
      keyFeatures: [
        "Board replacement",
        "Joist repairs",
        "Structural assessment",
        "Safety restoration",
      ],
      relatedServices: ["decking-installation", "decking-treatment"],
    },
    {
      slug: "pergola-installation",
      title: "Pergola Installation",
      category: "specialist",
      keyFeatures: [
        "Bespoke timber pergolas",
        "Climbing plant support",
        "Outdoor shade solutions",
        "Professional construction",
      ],
      relatedServices: ["decking-installation", "trellis-installation"],
    },
    {
      slug: "shed-base-installation",
      title: "Shed Base Installation",
      category: "additional",
      keyFeatures: [
        "Concrete slab bases",
        "Eco grid bases",
        "Level and solid foundations",
        "All shed sizes catered for",
      ],
      relatedServices: ["decking-installation", "fence-panel-installation"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, sturdy, outdoor-focused",
    avoidWords: ["cheap", "flimsy", "temporary"],
    preferredTerms: ["durable", "weather-resistant", "quality timber", "built to last"],
    usps: [
      "All waste removed",
      "10-year treatment guarantee",
      "Free site survey",
      "Quality materials only",
    ],
  },
  defaultPricing: {
    domestic: { min: 60, max: 120, unit: "per metre", currency: "GBP" },
    commercial: { min: 2000, max: 8000, unit: "per project", currency: "GBP" },
    specialist: { min: 3000, max: 15000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: [
    "Jacksons Approved",
    "TrustMark",
    "Which? Trusted Trader",
    "Checkatrade",
    "CITB",
    "Public Liability Insurance",
  ],
  commonKeywords: [
    "fencing",
    "fence installation",
    "decking",
    "garden decking",
    "fence panels",
    "garden gates",
  ],
  icon: "fence",
};

export const flooringTemplate: IndustryTemplate = {
  id: "flooring",
  name: "Flooring Services",
  description: "Professional flooring installation, repairs, and restoration for all floor types",
  suggestedServices: [
    {
      slug: "carpet-fitting",
      title: "Carpet Fitting",
      category: "core",
      keyFeatures: [
        "Professional stretch fitting",
        "Gripper and underlay included",
        "Seamless joins",
        "Furniture moving available",
      ],
      relatedServices: ["stair-carpet-fitting", "underlay-installation"],
    },
    {
      slug: "laminate-flooring",
      title: "Laminate Flooring Installation",
      category: "core",
      keyFeatures: [
        "Click-lock installation",
        "Underlay and trims included",
        "Door trimming service",
        "All brands fitted",
      ],
      relatedServices: ["engineered-wood-flooring", "floor-levelling"],
    },
    {
      slug: "lvt-flooring",
      title: "LVT Flooring Installation",
      category: "core",
      keyFeatures: [
        "Karndean and Amtico specialists",
        "Click and glue-down options",
        "Waterproof solutions",
        "Realistic wood and stone effects",
      ],
      relatedServices: ["vinyl-flooring", "floor-levelling"],
    },
    {
      slug: "engineered-wood-flooring",
      title: "Engineered Wood Flooring",
      category: "core",
      keyFeatures: [
        "Real wood top layer",
        "Underfloor heating compatible",
        "Herringbone and parquet patterns",
        "Professional finishing",
      ],
      relatedServices: ["laminate-flooring", "floor-sanding"],
    },
    {
      slug: "floor-sanding",
      title: "Floor Sanding & Restoration",
      category: "specialist",
      keyFeatures: [
        "Dust-free sanding technology",
        "Gap filling and repairs",
        "Oil, lacquer, or wax finishes",
        "Colour change options",
      ],
      relatedServices: ["engineered-wood-flooring", "floor-repairs"],
    },
    {
      slug: "floor-levelling",
      title: "Floor Levelling & Screeding",
      category: "specialist",
      keyFeatures: [
        "Self-levelling compound",
        "Uneven floor correction",
        "Preparation for all flooring types",
        "Professional sub-floor assessment",
      ],
      relatedServices: ["laminate-flooring", "lvt-flooring"],
    },
    {
      slug: "safety-flooring",
      title: "Safety Flooring Installation",
      category: "specialist",
      keyFeatures: [
        "Non-slip options",
        "Wet room solutions",
        "Healthcare and commercial grade",
        "Welded seams available",
      ],
      relatedServices: ["vinyl-flooring", "floor-levelling"],
    },
    {
      slug: "stair-carpet-fitting",
      title: "Stair Carpet Fitting",
      category: "additional",
      keyFeatures: [
        "Winding stair specialists",
        "Runner and full-width options",
        "Secure gripper installation",
        "Pattern matching expertise",
      ],
      relatedServices: ["carpet-fitting", "underlay-installation"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, precise, quality-driven",
    avoidWords: ["cheap", "budget", "quick"],
    preferredTerms: [
      "professional fitting",
      "quality installation",
      "expert fitters",
      "manufacturer approved",
    ],
    usps: [
      "NICF registered fitters",
      "Manufacturer-trained installers",
      "Furniture moving included",
      "All waste removed",
    ],
  },
  defaultPricing: {
    domestic: { min: 8, max: 25, unit: "per sqm", currency: "GBP" },
    commercial: { min: 500, max: 3000, unit: "per project", currency: "GBP" },
    specialist: { min: 30, max: 60, unit: "per sqm", currency: "GBP" },
  },
  commonCertifications: [
    "NICF",
    "FITA",
    "CFA",
    "City & Guilds",
    "Karndean Approved",
    "Amtico Approved",
  ],
  commonKeywords: [
    "flooring fitter",
    "carpet fitter",
    "laminate fitting",
    "LVT installation",
    "floor sanding",
    "flooring installation",
  ],
  icon: "floor",
};

export const tilingTemplate: IndustryTemplate = {
  id: "tiling",
  name: "Tiling Services",
  description:
    "Professional wall and floor tiling for bathrooms, kitchens, and throughout the home",
  suggestedServices: [
    {
      slug: "bathroom-wall-tiling",
      title: "Bathroom Wall Tiling",
      category: "core",
      keyFeatures: [
        "Full height and splash areas",
        "Waterproof installation",
        "Shower enclosure tiling",
        "All tile sizes and styles",
      ],
      relatedServices: ["shower-tiling", "floor-tiling-bathroom"],
    },
    {
      slug: "kitchen-wall-tiling",
      title: "Kitchen Wall Tiling",
      category: "core",
      keyFeatures: [
        "Splashback installation",
        "Behind hob and sink areas",
        "Metro and modern styles",
        "Easy-clean finishes",
      ],
      relatedServices: ["floor-tiling-kitchen", "feature-wall-tiling"],
    },
    {
      slug: "floor-tiling-bathroom",
      title: "Bathroom Floor Tiling",
      category: "core",
      keyFeatures: [
        "Non-slip options",
        "Underfloor heating compatible",
        "Waterproof preparation",
        "Threshold finishing",
      ],
      relatedServices: ["bathroom-wall-tiling", "floor-preparation"],
    },
    {
      slug: "floor-tiling-kitchen",
      title: "Kitchen Floor Tiling",
      category: "core",
      keyFeatures: [
        "Hard-wearing porcelain",
        "Large format specialists",
        "Underfloor heating options",
        "Minimal grout line finishes",
      ],
      relatedServices: ["kitchen-wall-tiling", "floor-preparation"],
    },
    {
      slug: "natural-stone-tiling",
      title: "Natural Stone Tiling",
      category: "specialist",
      keyFeatures: [
        "Marble, slate, and travertine",
        "Sealing and protection",
        "Period property specialists",
        "Bespoke cutting and fitting",
      ],
      relatedServices: ["floor-tiling-bathroom", "floor-tiling-kitchen"],
    },
    {
      slug: "large-format-tiling",
      title: "Large Format Tile Installation",
      category: "specialist",
      keyFeatures: [
        "Precision levelling systems",
        "Minimal grout joints",
        "Contemporary finishes",
        "Expert handling and cutting",
      ],
      relatedServices: ["floor-preparation", "floor-tiling-kitchen"],
    },
    {
      slug: "mosaic-tiling",
      title: "Mosaic Tiling",
      category: "specialist",
      keyFeatures: [
        "Decorative accent work",
        "Shower niche features",
        "Intricate pattern creation",
        "Glass and ceramic options",
      ],
      relatedServices: ["feature-wall-tiling", "bathroom-wall-tiling"],
    },
    {
      slug: "regrouting",
      title: "Tile Regrouting",
      category: "additional",
      keyFeatures: [
        "Old grout removal",
        "Colour matching or change",
        "Mould and mildew prevention",
        "Waterproof grout options",
      ],
      relatedServices: ["tile-repairs", "bathroom-wall-tiling"],
    },
  ],
  defaultBrandVoice: {
    tone: "skilled, detail-oriented, quality-focused",
    avoidWords: ["cheap", "quick", "basic"],
    preferredTerms: [
      "precision tiling",
      "quality finish",
      "attention to detail",
      "waterproof guarantee",
    ],
    usps: [
      "TTA registered tiler",
      "Waterproof installation guaranteed",
      "All waste removed",
      "Dust-free cutting where possible",
    ],
  },
  defaultPricing: {
    domestic: { min: 35, max: 70, unit: "per sqm", currency: "GBP" },
    commercial: { min: 1000, max: 5000, unit: "per project", currency: "GBP" },
    specialist: { min: 60, max: 120, unit: "per sqm", currency: "GBP" },
  },
  commonCertifications: [
    "NVQ Tiling",
    "TTA (Tile Association)",
    "City & Guilds",
    "CITB",
    "TrustMark",
    "Which? Trusted Trader",
  ],
  commonKeywords: [
    "tiler",
    "tiling services",
    "bathroom tiling",
    "kitchen tiling",
    "floor tiling",
    "wall tiling",
  ],
  icon: "tiles",
};

export const chimneyStoveTemplate: IndustryTemplate = {
  id: "chimney-stove",
  name: "Chimney & Stove Services",
  description: "Chimney sweeping, stove installation, and fireplace services",
  suggestedServices: [
    {
      slug: "chimney-sweeping",
      title: "Chimney Sweeping",
      category: "core",
      keyFeatures: [
        "Professional soot removal",
        "Blockage clearance",
        "Smoke test included",
        "Certificate provided",
      ],
      relatedServices: ["chimney-inspection", "cowl-fitting"],
    },
    {
      slug: "wood-burner-installation",
      title: "Wood Burning Stove Installation",
      category: "core",
      keyFeatures: [
        "HETAS registered installation",
        "Building control notification",
        "Flue connection and testing",
        "Certificate for insurance",
      ],
      relatedServices: ["chimney-lining", "hearth-construction"],
    },
    {
      slug: "multifuel-stove-installation",
      title: "Multi-Fuel Stove Installation",
      category: "core",
      keyFeatures: [
        "Coal and wood burning",
        "HETAS certification",
        "Complete installation service",
        "All necessary approvals",
      ],
      relatedServices: ["wood-burner-installation", "chimney-lining"],
    },
    {
      slug: "chimney-lining",
      title: "Chimney Lining",
      category: "core",
      keyFeatures: [
        "Stainless steel flexible liners",
        "Improved safety and efficiency",
        "Required for most stove installations",
        "Long-lasting durability",
      ],
      relatedServices: ["wood-burner-installation", "chimney-inspection"],
    },
    {
      slug: "chimney-inspection",
      title: "Chimney Inspection & CCTV Survey",
      category: "specialist",
      keyFeatures: [
        "Full CCTV survey",
        "Condition assessment",
        "Pre-purchase surveys",
        "Detailed written report",
      ],
      relatedServices: ["chimney-sweeping", "chimney-repairs"],
    },
    {
      slug: "stove-servicing",
      title: "Stove Servicing & Maintenance",
      category: "specialist",
      keyFeatures: [
        "Annual service checks",
        "Rope seal replacement",
        "Glass and baffle inspection",
        "Efficiency optimization",
      ],
      relatedServices: ["stove-repairs", "chimney-sweeping"],
    },
    {
      slug: "hearth-construction",
      title: "Hearth Construction",
      category: "specialist",
      keyFeatures: [
        "Building regulations compliant",
        "Slate, granite, and stone options",
        "Bespoke sizes and designs",
        "Heat-resistant construction",
      ],
      relatedServices: ["wood-burner-installation", "multifuel-stove-installation"],
    },
    {
      slug: "cowl-fitting",
      title: "Chimney Cowl Fitting",
      category: "additional",
      keyFeatures: [
        "Downdraught prevention",
        "Bird and debris protection",
        "Rain cap installation",
        "Improved chimney draw",
      ],
      relatedServices: ["chimney-sweeping", "bird-guard-installation"],
    },
  ],
  defaultBrandVoice: {
    tone: "experienced, safety-focused, traditional",
    avoidWords: ["cheap", "quick", "uncertified"],
    preferredTerms: [
      "HETAS registered",
      "certified installation",
      "safety-first",
      "professional sweep",
    ],
    usps: [
      "HETAS registered installers",
      "Guild of Master Chimney Sweeps member",
      "Building control notification included",
      "All necessary certificates provided",
    ],
  },
  defaultPricing: {
    domestic: { min: 60, max: 90, unit: "per sweep", currency: "GBP" },
    commercial: { min: 500, max: 2000, unit: "per project", currency: "GBP" },
    specialist: { min: 1500, max: 4000, unit: "per installation", currency: "GBP" },
  },
  commonCertifications: [
    "HETAS",
    "Guild of Master Chimney Sweeps",
    "NACS",
    "APICS",
    "ICS",
    "OFTEC",
  ],
  commonKeywords: [
    "chimney sweep",
    "wood burner installation",
    "stove fitter",
    "HETAS installer",
    "chimney lining",
    "log burner",
  ],
  icon: "fire",
};

export const drivewayPatioTemplate: IndustryTemplate = {
  id: "driveway-patio",
  name: "Driveway & Patio Services",
  description: "Block paving, resin driveways, natural stone patios, and outdoor surfacing",
  suggestedServices: [
    {
      slug: "block-paving-driveways",
      title: "Block Paving Driveway Installation",
      category: "core",
      keyFeatures: [
        "Full excavation and sub-base",
        "Proper drainage installation",
        "Wide range of styles and colours",
        "Long-lasting durability",
      ],
      relatedServices: ["patio-block-paving", "driveway-edging"],
    },
    {
      slug: "resin-bound-driveway",
      title: "Resin Bound Driveway",
      category: "core",
      keyFeatures: [
        "Permeable SuDS compliant",
        "Low maintenance surface",
        "Smooth seamless finish",
        "Wide colour choice",
      ],
      relatedServices: ["resin-bound-patio", "driveway-preparation"],
    },
    {
      slug: "natural-stone-patio",
      title: "Natural Stone Patio",
      category: "core",
      keyFeatures: [
        "Indian sandstone and limestone",
        "Proper jointing and pointing",
        "Premium natural materials",
        "Traditional or contemporary styles",
      ],
      relatedServices: ["porcelain-paving", "pathway-installation"],
    },
    {
      slug: "tarmac-driveway",
      title: "Tarmac Driveway Installation",
      category: "core",
      keyFeatures: [
        "Cost-effective solution",
        "Quick installation",
        "Smooth durable surface",
        "Machine-laid finish",
      ],
      relatedServices: ["tarmac-repairs", "driveway-edging"],
    },
    {
      slug: "porcelain-paving",
      title: "Porcelain Paving Installation",
      category: "specialist",
      keyFeatures: [
        "Low maintenance finish",
        "Frost and stain resistant",
        "Modern contemporary look",
        "Indoor-outdoor matching",
      ],
      relatedServices: ["natural-stone-patio", "patio-block-paving"],
    },
    {
      slug: "driveway-cleaning",
      title: "Driveway & Patio Cleaning",
      category: "specialist",
      keyFeatures: [
        "High-pressure cleaning",
        "Moss and algae removal",
        "Re-sanding service",
        "Sealing available",
      ],
      relatedServices: ["patio-restoration", "driveway-sealing"],
    },
    {
      slug: "step-construction",
      title: "Garden Step Construction",
      category: "specialist",
      keyFeatures: [
        "Natural stone and block steps",
        "Safe level changes",
        "Building regulations compliant",
        "Integrated lighting options",
      ],
      relatedServices: ["pathway-installation", "natural-stone-patio"],
    },
    {
      slug: "block-paving-repairs",
      title: "Block Paving Repairs",
      category: "additional",
      keyFeatures: [
        "Sunken area repair",
        "Re-sanding and re-levelling",
        "Weed removal and prevention",
        "Block replacement",
      ],
      relatedServices: ["driveway-cleaning", "driveway-sealing"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, quality-focused, transformative",
    avoidWords: ["cheap", "cowboy", "quick"],
    preferredTerms: ["quality materials", "proper preparation", "long-lasting", "kerb appeal"],
    usps: [
      "Marshalls Approved installer",
      "Full 10-year guarantee",
      "Proper drainage included",
      "All waste removed",
    ],
  },
  defaultPricing: {
    domestic: { min: 60, max: 120, unit: "per sqm", currency: "GBP" },
    commercial: { min: 5000, max: 25000, unit: "per project", currency: "GBP" },
    specialist: { min: 80, max: 150, unit: "per sqm", currency: "GBP" },
  },
  commonCertifications: [
    "BALI",
    "Marshalls Approved",
    "Brett Approved",
    "TrustMark",
    "Which? Trusted Trader",
    "Checkatrade",
  ],
  commonKeywords: [
    "block paving",
    "driveway installation",
    "patio laying",
    "resin driveway",
    "natural stone patio",
    "driveway contractors",
  ],
  icon: "driveway",
};

export const gardeningTemplate: IndustryTemplate = {
  id: "gardening",
  name: "Gardening Services",
  description: "Garden maintenance, lawn care, planting, and seasonal garden services",
  suggestedServices: [
    {
      slug: "garden-maintenance",
      title: "Regular Garden Maintenance",
      category: "core",
      keyFeatures: [
        "Weekly or fortnightly visits",
        "Mowing, weeding, and pruning",
        "Border maintenance",
        "All waste removed",
      ],
      relatedServices: ["lawn-mowing", "hedge-trimming"],
    },
    {
      slug: "lawn-mowing",
      title: "Regular Lawn Mowing",
      category: "core",
      keyFeatures: [
        "Professional cylinder or rotary cut",
        "Edging included",
        "Clippings collected",
        "Consistent cutting schedule",
      ],
      relatedServices: ["lawn-fertilising", "lawn-aeration"],
    },
    {
      slug: "hedge-trimming",
      title: "Hedge Trimming & Maintenance",
      category: "core",
      keyFeatures: [
        "Formal and informal hedge cutting",
        "Height and width reduction",
        "All cuttings removed",
        "Seasonal timing advice",
      ],
      relatedServices: ["tree-pruning", "garden-maintenance"],
    },
    {
      slug: "lawn-turfing",
      title: "Lawn Turfing & Installation",
      category: "core",
      keyFeatures: [
        "Quality turf supply and laying",
        "Ground preparation included",
        "Instant lawn results",
        "Aftercare advice provided",
      ],
      relatedServices: ["lawn-seeding", "lawn-fertilising"],
    },
    {
      slug: "tree-pruning",
      title: "Tree Pruning & Shaping",
      category: "specialist",
      keyFeatures: [
        "Crown reduction and thinning",
        "Deadwood removal",
        "Shape and size management",
        "Tree health assessment",
      ],
      relatedServices: ["tree-removal", "hedge-trimming"],
    },
    {
      slug: "garden-design",
      title: "Garden Design & Planning",
      category: "specialist",
      keyFeatures: [
        "Bespoke design service",
        "Planting plans",
        "Hard and soft landscaping",
        "3D visualisations available",
      ],
      relatedServices: ["garden-landscaping", "planting"],
    },
    {
      slug: "garden-clearance",
      title: "Garden Clearance",
      category: "specialist",
      keyFeatures: [
        "Overgrown garden restoration",
        "Rubbish and debris removal",
        "Full site clearance",
        "Skip or van removal",
      ],
      relatedServices: ["garden-maintenance", "spring-garden-cleanup"],
    },
    {
      slug: "planting",
      title: "Planting & Border Planting",
      category: "additional",
      keyFeatures: [
        "Plant supply and installation",
        "Seasonal bedding",
        "Shrub and tree planting",
        "Soil preparation included",
      ],
      relatedServices: ["garden-design", "garden-maintenance"],
    },
  ],
  defaultBrandVoice: {
    tone: "friendly, knowledgeable, nature-loving",
    avoidWords: ["cheap", "quick", "basic"],
    preferredTerms: ["expert gardeners", "garden care", "green-fingered", "professional service"],
    usps: [
      "RHS trained gardeners",
      "Reliable regular service",
      "All waste removed",
      "Seasonal advice included",
    ],
  },
  defaultPricing: {
    domestic: { min: 25, max: 50, unit: "per hour", currency: "GBP" },
    commercial: { min: 300, max: 1500, unit: "per month", currency: "GBP" },
    specialist: { min: 500, max: 5000, unit: "per project", currency: "GBP" },
  },
  commonCertifications: [
    "RHS",
    "BALI",
    "Lantra",
    "City & Guilds Horticulture",
    "NPTC",
    "Public Liability Insurance",
  ],
  commonKeywords: [
    "gardener",
    "gardening services",
    "garden maintenance",
    "lawn care",
    "hedge cutting",
    "local gardener",
  ],
  icon: "leaf",
};

export const buildingTemplate: IndustryTemplate = {
  id: "building",
  name: "Building Services",
  description:
    "Extensions, renovations, structural work, and building projects for residential and commercial properties",
  suggestedServices: [
    {
      slug: "single-storey-extension",
      title: "Single Storey Extension",
      category: "core",
      keyFeatures: [
        "Full design and build service",
        "Planning and building control",
        "Kitchen and living extensions",
        "Project management included",
      ],
      relatedServices: ["double-storey-extension", "kitchen-renovation"],
    },
    {
      slug: "loft-conversion",
      title: "Loft Conversion",
      category: "core",
      keyFeatures: [
        "Dormer and velux options",
        "Additional bedroom creation",
        "Full structural work",
        "All building control approvals",
      ],
      relatedServices: ["double-storey-extension", "bathroom-renovation"],
    },
    {
      slug: "garage-conversion",
      title: "Garage Conversion",
      category: "core",
      keyFeatures: [
        "Living space transformation",
        "Insulation and heating",
        "Full finish to match home",
        "Planning advice included",
      ],
      relatedServices: ["single-storey-extension", "internal-alterations"],
    },
    {
      slug: "kitchen-renovation",
      title: "Kitchen Renovation",
      category: "core",
      keyFeatures: [
        "Complete kitchen refits",
        "Layout reconfiguration",
        "Plumbing and electrical",
        "All finishes included",
      ],
      relatedServices: ["bathroom-renovation", "single-storey-extension"],
    },
    {
      slug: "bathroom-renovation",
      title: "Bathroom Renovation",
      category: "specialist",
      keyFeatures: [
        "Full bathroom transformation",
        "Wet room creation",
        "Plumbing and tiling",
        "En-suite installation",
      ],
      relatedServices: ["kitchen-renovation", "loft-conversion"],
    },
    {
      slug: "structural-alterations",
      title: "Structural Alterations",
      category: "specialist",
      keyFeatures: [
        "Load-bearing wall removal",
        "Steel beam installation",
        "Chimney breast removal",
        "Full structural calculations",
      ],
      relatedServices: ["internal-alterations", "loft-conversion"],
    },
    {
      slug: "rendering",
      title: "Rendering & External Wall Finishes",
      category: "specialist",
      keyFeatures: [
        "Sand cement and silicone render",
        "Property modernisation",
        "Weather protection",
        "Wide colour choice",
      ],
      relatedServices: ["brickwork", "external-wall-insulation"],
    },
    {
      slug: "brickwork",
      title: "Brickwork & Blockwork",
      category: "additional",
      keyFeatures: [
        "Extension walls",
        "Garden walls",
        "Brick repairs and matching",
        "Repointing services",
      ],
      relatedServices: ["rendering", "foundation-work"],
    },
  ],
  defaultBrandVoice: {
    tone: "professional, trustworthy, quality-focused",
    avoidWords: ["cheap", "cowboy", "quick fix"],
    preferredTerms: ["quality build", "project managed", "guaranteed work", "family business"],
    usps: [
      "FMB registered builder",
      "Full project management",
      "All work guaranteed",
      "Building control handled",
    ],
  },
  defaultPricing: {
    domestic: { min: 200, max: 400, unit: "per day", currency: "GBP" },
    commercial: { min: 20000, max: 100000, unit: "per project", currency: "GBP" },
    specialist: { min: 30000, max: 80000, unit: "per extension", currency: "GBP" },
  },
  commonCertifications: [
    "FMB",
    "NHBC",
    "TrustMark",
    "Federation of Master Builders",
    "Constructionline",
    "CHAS",
  ],
  commonKeywords: [
    "builder",
    "building contractor",
    "house extension",
    "loft conversion",
    "renovation",
    "local builder",
  ],
  icon: "building",
};

// ============================================================================
// Template Registry
// ============================================================================

export const industryTemplates: Record<string, IndustryTemplate> = {
  scaffolding: scaffoldingTemplate,
  plumbing: plumbingTemplate,
  electrical: electricalTemplate,
  cleaning: cleaningTemplate,
  landscaping: landscapingTemplate,
  roofing: roofingTemplate,
  "painting-decorating": paintingDecoratingTemplate,
  carpentry: carpentryTemplate,
  locksmith: locksmithTemplate,
  hvac: hvacTemplate,
  // New industry templates
  handyman: handymanTemplate,
  plastering: plasteringTemplate,
  "fencing-decking": fencingDeckingTemplate,
  flooring: flooringTemplate,
  tiling: tilingTemplate,
  "chimney-stove": chimneyStoveTemplate,
  "driveway-patio": drivewayPatioTemplate,
  gardening: gardeningTemplate,
  building: buildingTemplate,
};

/**
 * Get an industry template by ID
 * @param id - Industry template identifier
 * @returns IndustryTemplate or undefined
 */
export function getIndustryTemplate(id: string): IndustryTemplate | undefined {
  return industryTemplates[id.toLowerCase()];
}

/**
 * Get all available industry template IDs
 * @returns Array of template IDs
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(industryTemplates);
}

/**
 * Get all industry templates as an array
 * @returns Array of IndustryTemplate objects
 */
export function getAllIndustryTemplates(): IndustryTemplate[] {
  return Object.values(industryTemplates);
}

/**
 * Find industry templates that match a search query
 * @param query - Search query (matched against id, name, description)
 * @returns Array of matching templates
 */
export function searchIndustryTemplates(query: string): IndustryTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(industryTemplates).filter(
    (template) =>
      template.id.includes(lowercaseQuery) ||
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.commonKeywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))
  );
}
