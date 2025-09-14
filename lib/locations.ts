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
  "east-sussex": {
    slug: "east-sussex",
    title: "East Sussex",
    description: "Professional scaffolding services across East Sussex with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and industrial projects.",
    badge: "Our Headquarters",
    heroImage: "/Facade Scaffolding.png",
    county: "East Sussex",
    towns: ["Hastings", "Bexhill", "Eastbourne", "St Leonards", "Rye", "Battle"],
    isHeadquarters: true,
    projectTypes: [
      "Hastings seafront Victorian terraces and period properties",
      "Eastbourne promenade hotels and commercial buildings",
      "Battle Abbey and historic Norman architecture",
      "Rye medieval timber-framed buildings",
      "Bexhill Edwardian seaside villas",
      "Sussex Downs rural farmhouses and barn conversions"
    ],
    coverageAreas: ["Hastings", "Eastbourne", "Bexhill", "St Leonards", "Battle", "Rye"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe and compliant access scaffolding for building maintenance, construction, and renovation projects throughout East Sussex.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding", 
        description: "Professional facade scaffolding solutions for external building work including rendering, painting, and cladding projects.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection Systems",
        description: "HSE compliant edge protection for construction sites and roofing projects across East Sussex locations.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      {
        question: "Do you handle permits in Brighton?",
        answer: "Yes, we assist with all necessary permits and planning applications in Brighton and Eastbourne, including seafront areas. Our team knows local council processes across Lewes, Hastings, and Bexhill."
      },
      {
        question: "Can you provide temporary roof systems in Hastings?",
        answer: "Absolutely. We install TG20:21-compliant temporary roof scaffolds in Hastings, Eastbourne, and Uckfield to protect worksites from rain and wind."
      },
      {
        question: "Do you offer residential scaffolding in Eastbourne?",
        answer: "Yes, we provide scaffolding for homes, extensions, and renovations across Eastbourne, Bexhill, and Hailsham, with flexible hire periods."
      },
      {
        question: "Can you supply crash decks for industrial projects in Newhaven?",
        answer: "Certainly. We provide strong crash decks and loading platforms in Newhaven, Seaford, and Peacehaven, suitable for factories and warehouses."
      },
      {
        question: "Do you offer facade scaffolding in Lewes?",
        answer: "Yes, we install facade scaffolds for brickwork, painting, and roofing projects in Lewes, Hastings, and Rye, ensuring safe access."
      },
      {
        question: "Are scaffold inspections available in East Sussex?",
        answer: "Definitely. Our qualified team carries out regular scaffold inspections across East Sussex, ensuring compliance with UK safety standards."
      },
      {
        question: "Do you provide scaffold alarms in Hastings?",
        answer: "Yes, we fit scaffold alarms in Hastings, Eastbourne, and Uckfield to secure sites against theft and vandalism."
      },
      {
        question: "Can you supply edge protection in Uckfield?",
        answer: "Absolutely. We install edge protection systems for roof works and construction sites in Uckfield, Lewes, and Crowborough."
      },
      {
        question: "Do you work on heritage sites in Rye?",
        answer: "Yes, we have extensive experience scaffolding heritage properties in Rye, Lewes, and Battle, always following conservation guidelines."
      },
      {
        question: "Can you provide loading bays in Bexhill?",
        answer: "Certainly. We design and install scaffold loading bays for construction projects in Bexhill, Hastings, and Eastbourne."
      }
    ]
  },
  "west-sussex": {
    slug: "west-sussex",
    title: "West Sussex",
    description: "Professional scaffolding solutions throughout West Sussex for all project types and sizes.",
    heroImage: "/Access Scaffolding new build.png",
    county: "West Sussex",
    towns: ["Brighton", "Crawley", "Worthing", "Chichester", "Horsham", "Burgess Hill"],
    projectTypes: [
      "Brighton seafront Regency terraces and crescents",
      "West Sussex South Downs chalk downland properties",
      "Chichester cathedral quarter Georgian buildings",
      "Worthing pier and promenade Victorian architecture",
      "Gatwick airport commercial and industrial buildings",
      "Sussex countryside oast houses and barn conversions"
    ],
    coverageAreas: ["Brighton", "Worthing", "Chichester", "Crawley", "Horsham", "Haywards Heath"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe access scaffolding for construction and maintenance projects in West Sussex.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: "Professional facade scaffolding for external building work throughout West Sussex.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in West Sussex.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Do you offer commercial scaffolding in Crawley?", 
        answer: "Yes, our team delivers safe commercial scaffolding for offices, warehouses, and retail premises in Crawley, Horsham, and Gatwick." 
      },
      { 
        question: "Can you install scaffold towers for homes in Chichester?", 
        answer: "Absolutely. We supply lightweight scaffold towers for painting, roofing, and extensions in Chichester, Bognor Regis, and Littlehampton." 
      },
      { 
        question: "Do you provide temporary roof scaffolds in Worthing?", 
        answer: "Yes, we erect temporary roof systems in Worthing, Shoreham, and Lancing to protect building works from the weather." 
      },
      { 
        question: "Can you provide pavement gantries in Horsham?", 
        answer: "Certainly. We build pavement gantries and access platforms in Horsham, Crawley, and Burgess Hill to keep pedestrian areas safe." 
      },
      { 
        question: "Do you install public access staircases in Haywards Heath?", 
        answer: "Yes, we design and fit public staircases in Haywards Heath, Burgess Hill, and East Grinstead for safe site access." 
      },
      { 
        question: "Are scaffold inspections available in West Sussex?", 
        answer: "Definitely. We offer weekly and ad-hoc scaffold inspections across West Sussex to ensure compliance with TG20:21 and HSE rules." 
      }
    ]
  },
  "kent": {
    slug: "kent",
    title: "Kent",
    description: "Expert scaffolding services across Kent with full compliance and insurance coverage.",
    heroImage: "/Birdcage scaffolding.png",
    county: "Kent",
    towns: ["Canterbury", "Maidstone", "Dover", "Ashford", "Folkestone", "Tunbridge Wells"],
    projectTypes: [
      "Kent countryside traditional oast houses",
      "Canterbury cathedral precinct medieval buildings",
      "Dover castle and coastal fortification structures",
      "Kentish ragstone farmhouses and cottages",
      "Channel Tunnel infrastructure and industrial buildings",
      "Medway estuary maritime heritage structures"
    ],
    coverageAreas: ["Canterbury", "Maidstone", "Ashford", "Dover", "Folkestone", "Tunbridge Wells"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe access scaffolding for construction and maintenance projects in Kent.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: "Professional facade scaffolding for external building work throughout Kent.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Kent.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Do you provide pavement gantries in Maidstone?", 
        answer: "Yes, we design and install pavement gantries and loading bays in Maidstone, Ashford, and Sevenoaks, keeping pedestrians safe." 
      },
      { 
        question: "Is edge protection available in Canterbury?", 
        answer: "Absolutely. We supply edge protection systems for construction and roofing projects in Canterbury, Whitstable, and Herne Bay." 
      },
      { 
        question: "Do you install temporary roof scaffolds in Tunbridge Wells?", 
        answer: "Yes, we provide full temporary roofing in Tunbridge Wells, Tonbridge, and Paddock Wood to protect against bad weather." 
      },
      { 
        question: "Can you provide crash decks in Dartford?", 
        answer: "Certainly. We supply crash decks and loading platforms for safe industrial and residential works in Dartford, Gravesend, and Bexley." 
      },
      { 
        question: "Do you offer birdcage scaffolding in Ashford?", 
        answer: "Yes, we erect birdcage scaffolds for interior works in Ashford, Folkestone, and Romney Marsh, ideal for ceilings and plastering." 
      },
      { 
        question: "Are scaffold inspections available in Kent?", 
        answer: "Definitely. Our accredited inspectors provide weekly safety checks across Kent, including Maidstone, Canterbury, and Dover." 
      }
    ]
  },
  "surrey": {
    slug: "surrey",
    title: "Surrey",
    description: "Reliable scaffolding installations throughout Surrey for residential and commercial projects.",
    heroImage: "/Heavy Industrial Scaffolding.png",
    county: "Surrey",
    towns: ["Guildford", "Woking", "Croydon", "Kingston", "Epsom", "Reigate"],
    projectTypes: [
      "Surrey Hills Area of Outstanding Natural Beauty properties",
      "Thames-side Georgian and Victorian riverside buildings",
      "Guildford cathedral and university campus buildings",
      "London commuter belt residential developments",
      "North Downs chalk downland country houses",
      "Surrey heathland Arts and Crafts movement buildings"
    ],
    coverageAreas: ["Guildford", "Woking", "Croydon", "Kingston upon Thames", "Epsom", "Reigate"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe access scaffolding for construction and maintenance projects in Surrey.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: "Professional facade scaffolding for external building work throughout Surrey.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Surrey.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Can you supply birdcage scaffolds in Guildford?", 
        answer: "Yes, we provide birdcage scaffolding for interior work in Guildford, Woking, and Farnham, perfect for plastering and ceilings." 
      },
      { 
        question: "Do you offer facade scaffolding in Woking?", 
        answer: "Absolutely. We supply facade scaffolds for roofing and repairs in Woking, Walton-on-Thames, and Weybridge." 
      },
      { 
        question: "Can you provide scaffold design drawings in Croydon?", 
        answer: "Certainly. Our in-house design team prepares scaffold drawings for projects in Croydon, Epsom, and Redhill." 
      },
      { 
        question: "Do you install public access staircases in Epsom?", 
        answer: "Yes, we provide safe staircase scaffolds for public and workforce access in Epsom, Leatherhead, and Banstead." 
      },
      { 
        question: "Do you offer temporary roof scaffolding in Redhill?", 
        answer: "Absolutely. We install weatherproof temporary roofs in Redhill, Reigate, and Caterham." 
      },
      { 
        question: "Are scaffold inspections available in Surrey?", 
        answer: "Definitely. We carry out full scaffold inspections across Surrey, including Guildford, Woking, and Croydon." 
      }
    ]
  },
  "london": {
    slug: "london",
    title: "London",
    description: "Specialized urban scaffolding services across all London boroughs with traffic management expertise.",
    heroImage: "/Public Access Staircases.png",
    county: "London",
    towns: ["All London Boroughs", "Central London", "Greater London"],
    projectTypes: [
      "Georgian and Victorian terraced houses",
      "Modern high-rise residential and commercial buildings",
      "Historic churches and listed buildings",
      "Thames-side wharves and converted warehouses",
      "Art Deco and Edwardian mansion blocks",
      "Contemporary glass and steel developments"
    ],
    coverageAreas: ["Central London", "North London", "South London", "East London", "West London", "Greater London"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe access scaffolding for construction and maintenance projects in London.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: "Professional facade scaffolding for external building work throughout London.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in London.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Do you provide public access staircases in Central London?", 
        answer: "Yes, we design and install staircase scaffolds across Central London including Westminster, Camden, and Southwark." 
      },
      { 
        question: "Are you experienced with heritage scaffolding in London?", 
        answer: "Absolutely. We work on listed buildings in Greenwich, Islington, and Kensington, always following conservation rules." 
      },
      { 
        question: "Do you install temporary roof scaffolds in North London?", 
        answer: "Yes, we provide full weatherproof scaffolds in Enfield, Barnet, and Haringey for construction projects." 
      },
      { 
        question: "Can you provide birdcage scaffolds in South London?", 
        answer: "Certainly. We install birdcage scaffolding for internal works in Croydon, Lewisham, and Bromley." 
      },
      { 
        question: "Do you fit scaffold alarms in East London?", 
        answer: "Yes, we supply and install scaffold alarms in Hackney, Stratford, and Barking for site security." 
      },
      { 
        question: "Are scaffold inspections available in London?", 
        answer: "Certainly. We offer regular inspections across Greater London, ensuring compliance with TG20:21 and HSE rules." 
      }
    ]
  },
  "essex": {
    slug: "essex",
    title: "Essex",
    description: "Complete scaffolding services across Essex with experienced local teams and competitive pricing.",
    heroImage: "/Scaffold Towers & Mast Systems.png",
    county: "Essex",
    towns: ["Chelmsford", "Colchester", "Southend", "Basildon", "Harlow", "Brentwood"],
    projectTypes: [
      "Essex countryside traditional farmhouses and barns",
      "Thames estuary industrial and commercial buildings",
      "Chelmsford cathedral quarter Georgian architecture",
      "Southend pier and seafront Victorian properties",
      "London commuter belt residential developments",
      "Rural Essex oast houses and heritage buildings"
    ],
    coverageAreas: ["Chelmsford", "Southend", "Colchester", "Basildon", "Braintree", "Harlow"],
    services: [
      {
        name: "Access Scaffolding",
        description: "Safe access scaffolding for construction and maintenance projects in Essex.",
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: "Professional facade scaffolding for external building work throughout Essex.",
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: "HSE compliant edge protection systems for construction sites in Essex.",
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Do you provide heavy-duty scaffolding in Chelmsford?", 
        answer: "Yes, we supply heavy-duty industrial scaffolds in Chelmsford, Witham, and Maldon for large-scale construction projects." 
      },
      { 
        question: "Can you install scaffold alarms in Southend?", 
        answer: "Absolutely. We fit scaffold alarm systems in Southend, Leigh-on-Sea, and Westcliff for 24/7 protection." 
      },
      { 
        question: "Do you offer facade scaffolding in Colchester?", 
        answer: "Yes, we provide facade scaffolding for residential and commercial buildings in Colchester, Braintree, and Clacton." 
      },
      { 
        question: "Can you supply birdcage scaffolds in Basildon?", 
        answer: "Certainly. We install interior birdcage scaffolds in Basildon, Wickford, and Pitsea, perfect for ceiling works." 
      },
      { 
        question: "Do you install temporary roofs in Brentwood?", 
        answer: "Yes, we offer full temporary roof scaffolds in Brentwood, Shenfield, and Ingatestone to keep projects dry." 
      },
      { 
        question: "Are scaffold inspections available in Essex?", 
        answer: "Definitely. Our certified team inspects scaffolding across Essex towns including Chelmsford, Southend, and Colchester." 
      }
    ]
  }
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
export function getLocationDataWithFallback(slug: string): LocationData {
  const locationData = locationDataMap[slug];
  
  if (locationData) {
    return locationData;
  }

  // Generate default location data for unmapped slugs
  const locationTitle = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  
  return {
    slug,
    title: locationTitle,
    description: `Professional scaffolding services in ${locationTitle} with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for all project types.`,
    county: locationTitle,
    towns: [locationTitle, "Local Area", "Surrounding Towns", "Regional Coverage", "County Wide", "Adjacent Areas"],
    projectTypes: [
      `Traditional ${locationTitle} period properties and heritage buildings`,
      `Modern residential developments throughout ${locationTitle}`,
      `Commercial and retail premises in ${locationTitle} town center`,
      `Industrial and warehouse buildings in ${locationTitle} area`,
      `Rural properties and barn conversions near ${locationTitle}`,
      `Coastal or countryside properties around ${locationTitle}`
    ],
    coverageAreas: [locationTitle, "Local Area", "Surrounding Towns", "Regional Coverage", "County Wide", "Adjacent Areas"],
    services: [
      {
        name: "Access Scaffolding",
        description: `Safe access scaffolding for construction and maintenance projects in ${locationTitle}.`,
        href: "/services/access-scaffolding"
      },
      {
        name: "Facade Scaffolding",
        description: `Professional facade scaffolding for external building work throughout ${locationTitle}.`,
        href: "/services/facade-scaffolding"
      },
      {
        name: "Edge Protection",
        description: `HSE compliant edge protection systems for construction sites in ${locationTitle}.`,
        href: "/services/edge-protection"
      }
    ],
    faqs: [
      { 
        question: "Do you handle permits in Brighton?", 
        answer: "Yes, we assist with all necessary permits and planning applications in Brighton and Eastbourne, including seafront areas. Our team knows local council processes across Lewes, Hastings, and Bexhill." 
      },
      { 
        question: "Can you provide temporary roof systems in Hastings?", 
        answer: "Absolutely. We install TG20:21-compliant temporary roof scaffolds in Hastings, Eastbourne, and Uckfield to protect worksites from rain and wind." 
      },
      { 
        question: "Do you offer residential scaffolding in Eastbourne?", 
        answer: "Yes, we provide scaffolding for homes, extensions, and renovations across Eastbourne, Bexhill, and Hailsham, with flexible hire periods." 
      },
      { 
        question: "Are scaffold inspections available in East Sussex?", 
        answer: "Definitely. Our qualified team carries out regular scaffold inspections across East Sussex, ensuring compliance with UK safety standards." 
      }
    ]
  };
}