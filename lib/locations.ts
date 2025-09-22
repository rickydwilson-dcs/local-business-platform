interface LocationData {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  heroImage?: string;
  county: string;
  towns: string[];
  isHeadquarters?: boolean;
  projectTypes: string[];
  coverageAreas: string[];
  services: Array<{
    name: string;
    description: string;
    href: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const locationDataMap: Record<string, LocationData> = {
  brighton: {
    slug: "brighton",
    title: "Brighton",
    description:
      "Professional scaffolding services in Brighton with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and heritage projects.",
    heroImage: "/Facade Scaffolding.png",
    county: "East Sussex",
    towns: ["Brighton", "Hove", "Portslade", "Saltdean", "Rottingdean", "Peacehaven"],
    projectTypes: [
      "Brighton seafront Regency terraces and crescents",
      "Victorian and Edwardian residential squares",
      "Brighton Marina modern apartment developments",
      "The Lanes historic commercial buildings",
      "Brighton Pavilion area heritage properties",
      "South Downs residential developments",
    ],
    coverageAreas: ["Brighton", "Hove", "Portslade", "Saltdean", "Rottingdean", "Peacehaven"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Brighton.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Brighton.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Brighton.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Brighton?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Brighton, including seafront areas. Our team knows Brighton & Hove City Council processes.",
      },
      {
        question: "Can you provide scaffolding for Regency buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Brighton's historic Regency terraces and crescents with heritage-appropriate solutions.",
      },
      {
        question: "Do you work in Brighton Marina?",
        answer:
          "Yes, we provide scaffolding services for apartments and commercial buildings in Brighton Marina and surrounding waterfront areas.",
      },
      {
        question: "Can you scaffold in The Lanes area?",
        answer:
          "Certainly. We have experience working in Brighton's historic Lanes quarter, managing narrow streets and heritage building requirements.",
      },
      {
        question: "Do you offer weekend installations in Brighton?",
        answer:
          "Yes, we provide flexible scheduling including weekend installations to minimize disruption in busy Brighton locations.",
      },
      {
        question: "Are scaffold inspections available in Brighton?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Brighton, ensuring compliance with UK safety standards.",
      },
    ],
  },
  eastbourne: {
    slug: "eastbourne",
    title: "Eastbourne",
    description:
      "Professional scaffolding services in Eastbourne with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for coastal, residential, and commercial projects.",
    heroImage: "/Access Scaffolding new build.png",
    county: "East Sussex",
    towns: ["Eastbourne", "Meads", "Sovereign Harbour", "Old Town", "Hampden Park", "Langney"],
    projectTypes: [
      "Eastbourne seafront Victorian terraces and hotels",
      "Sovereign Harbour modern marina developments",
      "Meads area Edwardian villas and mansion blocks",
      "South Downs chalk cliff properties",
      "Eastbourne Pier and promenade structures",
      "Coastal erosion protection works",
    ],
    coverageAreas: [
      "Eastbourne",
      "Meads",
      "Sovereign Harbour",
      "Old Town",
      "Hampden Park",
      "Langney",
    ],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Eastbourne.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Eastbourne.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Eastbourne.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Eastbourne?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Eastbourne, including seafront and conservation areas. Our team knows Eastbourne Borough Council processes.",
      },
      {
        question: "Can you work on Victorian seafront buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Eastbourne's Victorian seafront terraces and hotels with heritage-sensitive solutions.",
      },
      {
        question: "Do you work at Sovereign Harbour?",
        answer:
          "Yes, we provide scaffolding services for residential and commercial buildings at Sovereign Harbour marina development.",
      },
      {
        question: "Can you handle coastal wind conditions?",
        answer:
          "Certainly. Our scaffolding is designed for coastal conditions with additional tie-ins and wind-resistant configurations for Eastbourne's seafront.",
      },
      {
        question: "Do you work in Meads conservation area?",
        answer:
          "Yes, we have extensive experience in Meads conservation area, following all heritage building requirements and council guidelines.",
      },
      {
        question: "Are scaffold inspections available in Eastbourne?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Eastbourne, ensuring compliance with UK safety standards.",
      },
    ],
  },
  hastings: {
    slug: "hastings",
    title: "Hastings",
    description:
      "Professional scaffolding services in Hastings with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for heritage, residential, and commercial projects.",
    heroImage: "/Birdcage scaffolding.png",
    county: "East Sussex",
    towns: ["Hastings", "St Leonards", "Old Town", "West Hill", "East Hill", "Ore"],
    projectTypes: [
      "Hastings Old Town medieval and Tudor buildings",
      "St Leonards Regency terraces and crescents",
      "East and West Hill cliff-top properties",
      "Hastings Castle and heritage structures",
      "Victorian seaside architecture",
      "Fishermen's Quarter historic buildings",
    ],
    coverageAreas: ["Hastings", "St Leonards", "Old Town", "West Hill", "East Hill", "Ore"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Hastings.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Hastings.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Hastings.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Hastings?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Hastings, including Old Town conservation areas. Our team knows Hastings Borough Council processes.",
      },
      {
        question: "Can you scaffold medieval buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Hastings' medieval and Tudor buildings with heritage-appropriate techniques and materials.",
      },
      {
        question: "Do you work on cliff-top properties?",
        answer:
          "Yes, we provide scaffolding for East and West Hill cliff-top properties with specialized anchor systems for challenging terrain.",
      },
      {
        question: "Can you work in the Old Town?",
        answer:
          "Certainly. We have extensive experience in Hastings Old Town, managing narrow streets and working around historic structures.",
      },
      {
        question: "Do you scaffold fishing quarter buildings?",
        answer:
          "Yes, we work throughout the Fishermen's Quarter, understanding the unique requirements of these historic working buildings.",
      },
      {
        question: "Are scaffold inspections available in Hastings?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Hastings, ensuring compliance with UK safety standards.",
      },
    ],
  },
  crawley: {
    slug: "crawley",
    title: "Crawley",
    description:
      "Professional scaffolding services in Crawley with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and industrial projects.",
    heroImage: "/Heavy Industrial Scaffolding.png",
    county: "West Sussex",
    towns: ["Crawley", "Gatwick", "Three Bridges", "Pound Hill", "Langley Green", "Furnace Green"],
    projectTypes: [
      "Crawley New Town modern residential developments",
      "Gatwick Airport commercial and industrial buildings",
      "Three Bridges railway infrastructure projects",
      "Pound Hill residential estates and schools",
      "Surrey/Sussex border countryside properties",
      "Industrial warehouse and logistics facilities",
    ],
    coverageAreas: [
      "Crawley",
      "Gatwick",
      "Three Bridges",
      "Pound Hill",
      "Langley Green",
      "Furnace Green",
    ],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Crawley.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Crawley.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Crawley.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Crawley?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Crawley. Our team knows Crawley Borough Council processes and requirements.",
      },
      {
        question: "Can you work near Gatwick Airport?",
        answer:
          "Absolutely. We have experience working in Gatwick area with understanding of airport proximity requirements and height restrictions.",
      },
      {
        question: "Do you provide industrial scaffolding?",
        answer:
          "Yes, we specialize in heavy-duty industrial scaffolding for warehouses, logistics facilities, and commercial buildings throughout Crawley.",
      },
      {
        question: "Can you handle large residential developments?",
        answer:
          "Certainly. We work on new build developments, housing estates, and apartment blocks across Crawley's residential areas.",
      },
      {
        question: "Do you work on railway projects?",
        answer:
          "Yes, we have experience with railway-adjacent projects in Three Bridges area, following Network Rail safety protocols.",
      },
      {
        question: "Are scaffold inspections available in Crawley?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Crawley, ensuring compliance with UK safety standards.",
      },
    ],
  },
  worthing: {
    slug: "worthing",
    title: "Worthing",
    description:
      "Professional scaffolding services in Worthing with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for coastal, residential, and commercial projects.",
    heroImage: "/Public Access Staircases.png",
    county: "West Sussex",
    towns: ["Worthing", "Lancing", "Sompting", "Goring", "Ferring", "East Worthing"],
    projectTypes: [
      "Worthing seafront Victorian and Edwardian terraces",
      "South Downs chalk downland properties",
      "Worthing Pier and promenade structures",
      "Lancing College and institutional buildings",
      "Coastal retirement and care home developments",
      "West Sussex seaside commercial properties",
    ],
    coverageAreas: ["Worthing", "Lancing", "Sompting", "Goring", "Ferring", "East Worthing"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Worthing.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Worthing.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Worthing.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Worthing?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Worthing, including seafront areas. Our team knows Worthing Borough Council processes.",
      },
      {
        question: "Can you work on seafront buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Worthing's seafront Victorian and Edwardian buildings with coastal wind-resistant configurations.",
      },
      {
        question: "Do you work in Lancing area?",
        answer:
          "Yes, we provide scaffolding services throughout Lancing, including work on Lancing College and surrounding residential areas.",
      },
      {
        question: "Can you handle retirement home projects?",
        answer:
          "Certainly. We have extensive experience with care homes and retirement developments, ensuring minimal disruption to residents.",
      },
      {
        question: "Do you work on South Downs properties?",
        answer:
          "Yes, we scaffold properties on the South Downs above Worthing, with specialized equipment for challenging terrain access.",
      },
      {
        question: "Are scaffold inspections available in Worthing?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Worthing, ensuring compliance with UK safety standards.",
      },
    ],
  },
  horsham: {
    slug: "horsham",
    title: "Horsham",
    description:
      "Professional scaffolding services in Horsham with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and heritage projects.",
    heroImage: "/Scaffold Towers & Mast Systems.png",
    county: "West Sussex",
    towns: ["Horsham", "Billingshurst", "Storrington", "Henfield", "Steyning", "Pulborough"],
    projectTypes: [
      "Horsham market town Georgian and Victorian buildings",
      "Sussex countryside farmhouses and barn conversions",
      "South Downs National Park properties",
      "Historic village churches and heritage buildings",
      "Rural estate and manor house projects",
      "Horsham stone traditional architecture",
    ],
    coverageAreas: [
      "Horsham",
      "Billingshurst",
      "Storrington",
      "Henfield",
      "Steyning",
      "Pulborough",
    ],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Horsham.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Horsham.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Horsham.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Horsham?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Horsham District. Our team knows local council processes and rural planning requirements.",
      },
      {
        question: "Can you work on heritage buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Georgian and Victorian buildings in Horsham with heritage-appropriate solutions.",
      },
      {
        question: "Do you work on barn conversions?",
        answer:
          "Yes, we have extensive experience with barn conversions and rural property developments throughout the Sussex countryside.",
      },
      {
        question: "Can you access remote rural properties?",
        answer:
          "Certainly. We provide scaffolding access to rural properties, farmhouses, and estates with specialized transport for countryside locations.",
      },
      {
        question: "Do you work in the South Downs National Park?",
        answer:
          "Yes, we work within the South Downs National Park area, following all environmental and heritage protection requirements.",
      },
      {
        question: "Are scaffold inspections available in Horsham?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Horsham district, ensuring compliance with UK safety standards.",
      },
    ],
  },
  maidstone: {
    slug: "maidstone",
    title: "Maidstone",
    description:
      "Professional scaffolding services in Maidstone with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and heritage projects.",
    heroImage: "/Edge Protection Systems.png",
    county: "Kent",
    towns: ["Maidstone", "Medway", "Chatham", "Rochester", "Gillingham", "Strood"],
    projectTypes: [
      "Maidstone county town Georgian and Victorian architecture",
      "Medway Towns historic naval dockyard buildings",
      "Kent countryside oast houses and hop farms",
      "Rochester Cathedral and castle heritage structures",
      "Chatham Maritime modern developments",
      "River Medway waterfront commercial properties",
    ],
    coverageAreas: ["Maidstone", "Medway", "Chatham", "Rochester", "Gillingham", "Strood"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Maidstone.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Maidstone.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Maidstone.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Maidstone?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Maidstone Borough and Medway. Our team knows local council processes.",
      },
      {
        question: "Can you work on heritage naval buildings?",
        answer:
          "Absolutely. We have experience with Historic Royal Palaces and heritage naval buildings in the Medway Towns area.",
      },
      {
        question: "Do you work on oast houses?",
        answer:
          "Yes, we specialize in scaffolding Kent's traditional oast houses and agricultural buildings with appropriate heritage techniques.",
      },
      {
        question: "Can you handle waterfront projects?",
        answer:
          "Certainly. We work on River Medway waterfront properties and maritime developments with specialized waterside access.",
      },
      {
        question: "Do you work at Rochester Cathedral?",
        answer:
          "Yes, we have experience with cathedral and church scaffolding, following conservation requirements for historic religious buildings.",
      },
      {
        question: "Are scaffold inspections available in Maidstone?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Maidstone and Medway, ensuring compliance with UK safety standards.",
      },
    ],
  },
  canterbury: {
    slug: "canterbury",
    title: "Canterbury",
    description:
      "Professional scaffolding services in Canterbury with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for heritage, residential, and commercial projects.",
    heroImage: "/Heritage Scaffolding.png",
    county: "Kent",
    towns: ["Canterbury", "Whitstable", "Herne Bay", "Faversham", "Deal", "Sandwich"],
    projectTypes: [
      "Canterbury Cathedral and World Heritage Site buildings",
      "Medieval city walls and historic gates",
      "University of Kent campus developments",
      "Whitstable coastal Victorian architecture",
      "Kent seaside resort buildings",
      "Cinque Ports historic harbour structures",
    ],
    coverageAreas: ["Canterbury", "Whitstable", "Herne Bay", "Faversham", "Deal", "Sandwich"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Canterbury.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Canterbury.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Canterbury.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Canterbury?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Canterbury, including World Heritage Site requirements. Our team knows Canterbury City Council processes.",
      },
      {
        question: "Can you work on Canterbury Cathedral?",
        answer:
          "We have experience with cathedral and religious building scaffolding, working closely with conservation officers on heritage structures.",
      },
      {
        question: "Do you work on medieval buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Canterbury's medieval buildings and city walls with heritage-appropriate conservation techniques.",
      },
      {
        question: "Can you work at the University of Kent?",
        answer:
          "Yes, we provide scaffolding for university buildings and campus developments, understanding academic scheduling requirements.",
      },
      {
        question: "Do you work in coastal areas like Whitstable?",
        answer:
          "Certainly. We work throughout coastal Kent including Whitstable, Herne Bay, and Deal with wind-resistant coastal configurations.",
      },
      {
        question: "Are scaffold inspections available in Canterbury?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Canterbury and East Kent, ensuring compliance with UK safety standards.",
      },
    ],
  },
  "tunbridge-wells": {
    slug: "tunbridge-wells",
    title: "Tunbridge Wells",
    description:
      "Professional scaffolding services in Tunbridge Wells with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for heritage, residential, and commercial projects.",
    heroImage: "/Georgian Architecture Scaffolding.png",
    county: "Kent",
    towns: ["Tunbridge Wells", "Tonbridge", "Sevenoaks", "Edenbridge", "Paddock Wood", "Cranbrook"],
    projectTypes: [
      "Royal Tunbridge Wells Regency and Georgian architecture",
      "Pantiles historic colonnaded shopping area",
      "Kent Weald countryside manor houses",
      "Tonbridge Castle and medieval structures",
      "High Weald Area of Outstanding Natural Beauty properties",
      "Sevenoaks Knole House and stately home projects",
    ],
    coverageAreas: [
      "Tunbridge Wells",
      "Tonbridge",
      "Sevenoaks",
      "Edenbridge",
      "Paddock Wood",
      "Cranbrook",
    ],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Tunbridge Wells.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Tunbridge Wells.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description:
          "HSE compliant edge protection systems for construction sites in Tunbridge Wells.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Tunbridge Wells?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Tunbridge Wells Borough and Sevenoaks District. Our team knows local conservation requirements.",
      },
      {
        question: "Can you work on The Pantiles?",
        answer:
          "We have experience with heritage commercial areas and understand the requirements for working in Tunbridge Wells' historic Pantiles area.",
      },
      {
        question: "Do you work on Georgian buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Georgian and Regency architecture throughout Royal Tunbridge Wells with heritage-appropriate methods.",
      },
      {
        question: "Can you handle stately home projects?",
        answer:
          "Yes, we work on large heritage properties, manor houses, and estates throughout the Kent Weald and High Weald areas.",
      },
      {
        question: "Do you work at Tonbridge Castle?",
        answer:
          "We have experience with castle and medieval structure scaffolding, following English Heritage conservation requirements.",
      },
      {
        question: "Are scaffold inspections available in Tunbridge Wells?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across West Kent, ensuring compliance with UK safety standards.",
      },
    ],
  },
  guildford: {
    slug: "guildford",
    title: "Guildford",
    description:
      "Professional scaffolding services in Guildford with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for heritage, residential, and commercial projects.",
    heroImage: "/Cathedral Scaffolding.png",
    county: "Surrey",
    towns: ["Guildford", "Woking", "Farnham", "Godalming", "Cranleigh", "Haslemere"],
    projectTypes: [
      "Guildford Cathedral and modern religious architecture",
      "Surrey Hills Area of Outstanding Natural Beauty properties",
      "University of Surrey campus developments",
      "Historic Guildford High Street medieval buildings",
      "Thames-side Georgian and Victorian houses",
      "North Downs chalk downland countryside estates",
    ],
    coverageAreas: ["Guildford", "Woking", "Farnham", "Godalming", "Cranleigh", "Haslemere"],
    services: [
      {
        name: "Access Scaffolding",
        description:
          "Safe access scaffolding for construction and maintenance projects in Guildford.",
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description:
          "Professional facade scaffolding for external building work throughout Guildford.",
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Guildford.",
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Guildford?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Guildford Borough and Waverley. Our team knows Surrey planning requirements.",
      },
      {
        question: "Can you work on Guildford Cathedral?",
        answer:
          "We have experience with cathedral and modern religious building scaffolding, understanding the requirements for contemporary architectural heritage.",
      },
      {
        question: "Do you work on High Street historic buildings?",
        answer:
          "Absolutely. We specialize in scaffolding Guildford's historic High Street medieval and Tudor buildings with conservation techniques.",
      },
      {
        question: "Can you handle University of Surrey projects?",
        answer:
          "Yes, we work on university buildings and campus developments, coordinating with academic schedules and student safety requirements.",
      },
      {
        question: "Do you work in the Surrey Hills AONB?",
        answer:
          "Certainly. We work throughout the Surrey Hills Area of Outstanding Natural Beauty, following environmental protection requirements.",
      },
      {
        question: "Are scaffold inspections available in Guildford?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across Surrey, ensuring compliance with UK safety standards.",
      },
    ],
  },
};

// Get all locations for the library page
export function getAllLocations(): LocationData[] {
  return Object.values(locationDataMap);
}

// Get a specific location by slug
export function getLocationData(slug: string): LocationData | undefined {
  return locationDataMap[slug];
}

// Get location data with fallback for dynamic generation
// Helper function to generate service links with location-specific pages when available
function getServiceHref(serviceName: string, locationSlug: string): string {
  const serviceMapping: Record<string, string> = {
    "Commercial Scaffolding": "commercial-scaffolding",
    "Residential Scaffolding": "residential-scaffolding",
    "Industrial Scaffolding": "industrial-scaffolding",
    "Access Scaffolding": "access-scaffolding",
    "Facade Scaffolding": "facade-scaffolding",
    "Edge Protection": "edge-protection",
  };

  const serviceSlug = serviceMapping[serviceName];
  if (!serviceSlug) {
    return "/services"; // fallback
  }

  // Define which location-specific service pages actually exist
  const locationServicePages = {
    brighton: ["commercial-scaffolding", "residential-scaffolding"],
    canterbury: ["commercial-scaffolding", "residential-scaffolding"],
    hastings: ["commercial-scaffolding", "residential-scaffolding"],
  };

  // Check if location-specific service page exists
  if (
    locationServicePages[locationSlug as keyof typeof locationServicePages]?.includes(serviceSlug)
  ) {
    return `/services/${serviceSlug}-${locationSlug}`;
  }

  // Default to generic service page
  return `/services/${serviceSlug}`;
}

export function getLocationDataWithFallback(slug: string): LocationData {
  const locationData = locationDataMap[slug];

  if (locationData) {
    // Add main service categories as first 3 services for existing location data
    const mainServices = [
      {
        name: "Commercial Scaffolding",
        description: `Professional commercial scaffolding for office buildings, retail developments, and business districts in ${locationData.title}.`,
        href: getServiceHref("Commercial Scaffolding", slug),
      },
      {
        name: "Residential Scaffolding",
        description: `Safe, reliable scaffolding for homes, extensions, and renovations in ${locationData.title}. Family-friendly approach with minimal disruption.`,
        href: getServiceHref("Residential Scaffolding", slug),
      },
      {
        name: "Industrial Scaffolding",
        description: `Heavy-duty scaffolding systems for industrial facilities, ports, and manufacturing sites in ${locationData.title}. Engineered for complex challenges.`,
        href: getServiceHref("Industrial Scaffolding", slug),
      },
    ];

    return {
      ...locationData,
      services: [...mainServices, ...locationData.services],
    };
  }

  // Generate default location data for unmapped slugs
  const locationTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    title: locationTitle,
    description: `Professional scaffolding services in ${locationTitle} with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for all project types.`,
    county: locationTitle,
    towns: [
      locationTitle,
      "Local Area",
      "Surrounding Towns",
      "Regional Coverage",
      "County Wide",
      "Adjacent Areas",
    ],
    projectTypes: [
      `Traditional ${locationTitle} period properties and heritage buildings`,
      `Modern residential developments throughout ${locationTitle}`,
      `Commercial and retail premises in ${locationTitle} town center`,
      `Industrial and warehouse buildings in ${locationTitle} area`,
      `Rural properties and barn conversions near ${locationTitle}`,
      `Coastal or countryside properties around ${locationTitle}`,
    ],
    coverageAreas: [
      locationTitle,
      "Local Area",
      "Surrounding Towns",
      "Regional Coverage",
      "County Wide",
      "Adjacent Areas",
    ],
    services: [
      {
        name: "Access Scaffolding",
        description: `Safe access scaffolding for construction and maintenance projects in ${locationTitle}.`,
        href: "/services/access-scaffolding",
      },
      {
        name: "Facade Scaffolding",
        description: `Professional facade scaffolding for external building work throughout ${locationTitle}.`,
        href: "/services/facade-scaffolding",
      },
      {
        name: "Edge Protection",
        description: `HSE compliant edge protection systems for construction sites in ${locationTitle}.`,
        href: "/services/edge-protection",
      },
    ],
    faqs: [
      {
        question: "Do you handle permits in Brighton?",
        answer:
          "Yes, we assist with all necessary permits and planning applications in Brighton and Eastbourne, including seafront areas. Our team knows local council processes across Lewes, Hastings, and Bexhill.",
      },
      {
        question: "Can you provide temporary roof systems in Hastings?",
        answer:
          "Absolutely. We install TG20:21-compliant temporary roof scaffolds in Hastings, Eastbourne, and Uckfield to protect worksites from rain and wind.",
      },
      {
        question: "Do you offer residential scaffolding in Eastbourne?",
        answer:
          "Yes, we provide scaffolding for homes, extensions, and renovations across Eastbourne, Bexhill, and Hailsham, with flexible hire periods.",
      },
      {
        question: "Are scaffold inspections available in East Sussex?",
        answer:
          "Definitely. Our qualified team carries out regular scaffold inspections across East Sussex, ensuring compliance with UK safety standards.",
      },
    ],
  };
}
