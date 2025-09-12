import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";

import { LocationHero } from "@/components/ui/location-hero";
import { LocationServices } from "@/components/ui/location-services";
import { LocationCoverage } from "@/components/ui/location-coverage";
import { LocationFAQ } from "@/components/ui/location-faq";
import { ServiceCTA } from "@/components/ui/service-cta";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "locations");

interface LocationData {
  title: string;
  description: string;
  badge?: string;
  heroImage?: string;
  county: string;
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

async function getMdx(slug: string) {
  const file = path.join(DIR, `${slug}.mdx`);
  const raw = await fs.readFile(file, "utf8");
  const { data } = matter(raw);
  const title = (data.title as string) || slug;
  const description = (data.description as string) || "";
  return { title, description, data };
}

function getLocationData(slug: string): LocationData {
  const locationDataMap: Record<string, LocationData> = {
    "east-sussex": {
      title: "East Sussex",
      description: "Professional scaffolding services across East Sussex with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for residential, commercial, and industrial projects.",
      badge: "Our Headquarters",
      county: "East Sussex",
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
    "hastings": {
      title: "Hastings",
      description: "Local scaffolding specialists serving Hastings with professional access solutions, facade scaffolding, and emergency services. TG20:21 compliant with rapid response times.",
      badge: "Local Specialists",
      county: "East Sussex",
      projectTypes: [
        "Old Town Victorian and Georgian terraced houses",
        "Seafront hotels and B&Bs with coastal exposure",
        "Historic castle and heritage building conservation",
        "Net shops and traditional fishing quarter buildings",
        "Cliff-top properties with challenging access",
        "East Hill funicular railway structures"
      ],
      coverageAreas: ["Hastings", "St Leonards", "Ore", "Hollington", "West Hill", "East Hill"],
      services: [
        {
          name: "Residential Scaffolding",
          description: "Safe access scaffolding for Hastings homes including Victorian terraces, seafront properties, and modern developments.",
          href: "/services/access-scaffolding"
        },
        {
          name: "Commercial Scaffolding",
          description: "Professional scaffolding for Hastings businesses, shops, restaurants, and commercial buildings in the town center and seafront.",
          href: "/services/facade-scaffolding"
        },
        {
          name: "Emergency Scaffolding",
          description: "24/7 emergency scaffolding response for Hastings properties requiring urgent structural support or make-safe solutions.",
          href: "/services/access-scaffolding"
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
          question: "Do you work on heritage sites in Rye?",
          answer: "Yes, we have extensive experience scaffolding heritage properties in Rye, Lewes, and Battle, always following conservation guidelines."
        }
      ]
    },
    "eastbourne": {
      title: "Eastbourne",
      description: "Professional scaffolding services for Eastbourne properties including seafront buildings, residential developments, and commercial projects with full TG20:21 compliance.",
      county: "East Sussex",
      projectTypes: [
        "Grand seafront hotels and Victorian promenade buildings",
        "Meads village Edwardian villas and mansion blocks",
        "Devonshire Park theatre and cultural buildings",
        "South Downs cliff-top properties with sea views",
        "Town center shopping arcades and commercial premises",
        "Sovereign Harbour marina apartments and townhouses"
      ],
      coverageAreas: ["Eastbourne", "Meads", "Old Town", "Langney", "Hampden Park", "Willingdon"],
      services: [
        {
          name: "Seafront Scaffolding",
          description: "Specialist scaffolding for Eastbourne's seafront properties, hotels, and commercial buildings with wind-resistant systems.",
          href: "/services/facade-scaffolding"
        },
        {
          name: "Residential Access",
          description: "Safe access scaffolding for Eastbourne homes, flats, and residential developments across the town.",
          href: "/services/access-scaffolding"
        },
        {
          name: "Commercial Projects",
          description: "Professional scaffolding for Eastbourne businesses, shops, offices, and industrial buildings.",
          href: "/services/access-scaffolding"
        }
      ],
      faqs: [
        {
          question: "Do you handle permits in Brighton?",
          answer: "Yes, we assist with all necessary permits and planning applications in Brighton and Eastbourne, including seafront areas. Our team knows local council processes across Lewes, Hastings, and Bexhill."
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
          question: "Are scaffold inspections available in East Sussex?",
          answer: "Definitely. Our qualified team carries out regular scaffold inspections across East Sussex, ensuring compliance with UK safety standards."
        }
      ]
    }
  };

  // Default data for locations not specifically mapped
  const locationTitle = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  
  // Get county-specific FAQ data
  const getCountyFAQs = (slug: string) => {
    if (slug.includes("west-sussex") || ["brighton", "worthing", "chichester", "crawley", "horsham"].includes(slug)) {
      return [
        { question: "Do you offer commercial scaffolding in Crawley?", answer: "Yes, our team delivers safe commercial scaffolding for offices, warehouses, and retail premises in Crawley, Horsham, and Gatwick." },
        { question: "Can you install scaffold towers for homes in Chichester?", answer: "Absolutely. We supply lightweight scaffold towers for painting, roofing, and extensions in Chichester, Bognor Regis, and Littlehampton." },
        { question: "Do you provide temporary roof scaffolds in Worthing?", answer: "Yes, we erect temporary roof systems in Worthing, Shoreham, and Lancing to protect building works from the weather." },
        { question: "Can you provide pavement gantries in Horsham?", answer: "Certainly. We build pavement gantries and access platforms in Horsham, Crawley, and Burgess Hill to keep pedestrian areas safe." },
        { question: "Do you install public access staircases in Haywards Heath?", answer: "Yes, we design and fit public staircases in Haywards Heath, Burgess Hill, and East Grinstead for safe site access." },
        { question: "Are scaffold inspections available in West Sussex?", answer: "Definitely. We offer weekly and ad-hoc scaffold inspections across West Sussex to ensure compliance with TG20:21 and HSE rules." }
      ];
    } else if (slug.includes("kent") || ["canterbury", "maidstone", "ashford", "dover", "folkestone"].includes(slug)) {
      return [
        { question: "Do you provide pavement gantries in Maidstone?", answer: "Yes, we design and install pavement gantries and loading bays in Maidstone, Ashford, and Sevenoaks, keeping pedestrians safe." },
        { question: "Is edge protection available in Canterbury?", answer: "Absolutely. We supply edge protection systems for construction and roofing projects in Canterbury, Whitstable, and Herne Bay." },
        { question: "Do you install temporary roof scaffolds in Tunbridge Wells?", answer: "Yes, we provide full temporary roofing in Tunbridge Wells, Tonbridge, and Paddock Wood to protect against bad weather." },
        { question: "Can you provide crash decks in Dartford?", answer: "Certainly. We supply crash decks and loading platforms for safe industrial and residential works in Dartford, Gravesend, and Bexley." },
        { question: "Do you offer birdcage scaffolding in Ashford?", answer: "Yes, we erect birdcage scaffolds for interior works in Ashford, Folkestone, and Romney Marsh, ideal for ceilings and plastering." },
        { question: "Are scaffold inspections available in Kent?", answer: "Definitely. Our accredited inspectors provide weekly safety checks across Kent, including Maidstone, Canterbury, and Dover." }
      ];
    } else if (slug.includes("surrey") || ["guildford", "woking", "croydon", "kingston", "epsom"].includes(slug)) {
      return [
        { question: "Can you supply birdcage scaffolds in Guildford?", answer: "Yes, we provide birdcage scaffolding for interior work in Guildford, Woking, and Farnham, perfect for plastering and ceilings." },
        { question: "Do you offer facade scaffolding in Woking?", answer: "Absolutely. We supply facade scaffolds for roofing and repairs in Woking, Walton-on-Thames, and Weybridge." },
        { question: "Can you provide scaffold design drawings in Croydon?", answer: "Certainly. Our in-house design team prepares scaffold drawings for projects in Croydon, Epsom, and Redhill." },
        { question: "Do you install public access staircases in Epsom?", answer: "Yes, we provide safe staircase scaffolds for public and workforce access in Epsom, Leatherhead, and Banstead." },
        { question: "Do you offer temporary roof scaffolding in Redhill?", answer: "Absolutely. We install weatherproof temporary roofs in Redhill, Reigate, and Caterham." },
        { question: "Are scaffold inspections available in Surrey?", answer: "Definitely. We carry out full scaffold inspections across Surrey, including Guildford, Woking, and Croydon." }
      ];
    } else if (slug.includes("essex") || ["chelmsford", "southend", "colchester", "basildon", "braintree"].includes(slug)) {
      return [
        { question: "Do you provide heavy-duty scaffolding in Chelmsford?", answer: "Yes, we supply heavy-duty industrial scaffolds in Chelmsford, Witham, and Maldon for large-scale construction projects." },
        { question: "Can you install scaffold alarms in Southend?", answer: "Absolutely. We fit scaffold alarm systems in Southend, Leigh-on-Sea, and Westcliff for 24/7 protection." },
        { question: "Do you offer facade scaffolding in Colchester?", answer: "Yes, we provide facade scaffolding for residential and commercial buildings in Colchester, Braintree, and Clacton." },
        { question: "Can you supply birdcage scaffolds in Basildon?", answer: "Certainly. We install interior birdcage scaffolds in Basildon, Wickford, and Pitsea, perfect for ceiling works." },
        { question: "Do you install temporary roofs in Brentwood?", answer: "Yes, we offer full temporary roof scaffolds in Brentwood, Shenfield, and Ingatestone to keep projects dry." },
        { question: "Are scaffold inspections available in Essex?", answer: "Definitely. Our certified team inspects scaffolding across Essex towns including Chelmsford, Southend, and Colchester." }
      ];
    } else if (slug.includes("london") || ["westminster", "camden", "greenwich", "croydon", "hackney"].includes(slug)) {
      return [
        { question: "Do you provide public access staircases in Central London?", answer: "Yes, we design and install staircase scaffolds across Central London including Westminster, Camden, and Southwark." },
        { question: "Are you experienced with heritage scaffolding in London?", answer: "Absolutely. We work on listed buildings in Greenwich, Islington, and Kensington, always following conservation rules." },
        { question: "Do you install temporary roof scaffolds in North London?", answer: "Yes, we provide full weatherproof scaffolds in Enfield, Barnet, and Haringey for construction projects." },
        { question: "Can you provide birdcage scaffolds in South London?", answer: "Certainly. We install birdcage scaffolding for internal works in Croydon, Lewisham, and Bromley." },
        { question: "Do you fit scaffold alarms in East London?", answer: "Yes, we supply and install scaffold alarms in Hackney, Stratford, and Barking for site security." },
        { question: "Are scaffold inspections available in London?", answer: "Certainly. We offer regular inspections across Greater London, ensuring compliance with TG20:21 and HSE rules." }
      ];
    } else {
      // Default East Sussex FAQs for other locations
      return [
        { question: "Do you handle permits in Brighton?", answer: "Yes, we assist with all necessary permits and planning applications in Brighton and Eastbourne, including seafront areas. Our team knows local council processes across Lewes, Hastings, and Bexhill." },
        { question: "Can you provide temporary roof systems in Hastings?", answer: "Absolutely. We install TG20:21-compliant temporary roof scaffolds in Hastings, Eastbourne, and Uckfield to protect worksites from rain and wind." },
        { question: "Do you offer residential scaffolding in Eastbourne?", answer: "Yes, we provide scaffolding for homes, extensions, and renovations across Eastbourne, Bexhill, and Hailsham, with flexible hire periods." },
        { question: "Are scaffold inspections available in East Sussex?", answer: "Definitely. Our qualified team carries out regular scaffold inspections across East Sussex, ensuring compliance with UK safety standards." }
      ];
    }
  };

  // Determine county and coverage areas based on slug patterns
  const getCountyData = (slug: string) => {
    if (slug.includes("west-sussex") || ["brighton", "worthing", "chichester", "crawley", "horsham"].includes(slug)) {
      return {
        county: "West Sussex",
        coverageAreas: ["Brighton", "Worthing", "Chichester", "Crawley", "Horsham", "Haywards Heath"],
        projectTypes: [
          "Brighton seafront Regency terraces and crescents",
          "West Sussex South Downs chalk downland properties",
          "Chichester cathedral quarter Georgian buildings",
          "Worthing pier and promenade Victorian architecture",
          "Gatwick airport commercial and industrial buildings",
          "Sussex countryside oast houses and barn conversions"
        ]
      };
    } else if (slug.includes("kent") || ["canterbury", "maidstone", "ashford", "dover", "folkestone"].includes(slug)) {
      return {
        county: "Kent",
        coverageAreas: ["Canterbury", "Maidstone", "Ashford", "Dover", "Folkestone", "Tunbridge Wells"],
        projectTypes: [
          "Kent countryside traditional oast houses",
          "Canterbury cathedral precinct medieval buildings",
          "Dover castle and coastal fortification structures",
          "Kentish ragstone farmhouses and cottages",
          "Channel Tunnel infrastructure and industrial buildings",
          "Medway estuary maritime heritage structures"
        ]
      };
    } else if (slug.includes("surrey") || ["guildford", "woking", "croydon", "kingston", "epsom"].includes(slug)) {
      return {
        county: "Surrey",
        coverageAreas: ["Guildford", "Woking", "Croydon", "Kingston upon Thames", "Epsom", "Reigate"],
        projectTypes: [
          "Surrey Hills Area of Outstanding Natural Beauty properties",
          "Thames-side Georgian and Victorian riverside buildings",
          "Guildford cathedral and university campus buildings",
          "London commuter belt residential developments",
          "North Downs chalk downland country houses",
          "Surrey heathland Arts and Crafts movement buildings"
        ]
      };
    } else if (slug.includes("essex") || ["chelmsford", "southend", "colchester", "basildon", "braintree"].includes(slug)) {
      return {
        county: "Essex",
        coverageAreas: ["Chelmsford", "Southend", "Colchester", "Basildon", "Braintree", "Harlow"],
        projectTypes: [
          "Essex countryside traditional farmhouses and barns",
          "Thames estuary industrial and commercial buildings",
          "Chelmsford cathedral quarter Georgian architecture",
          "Southend pier and seafront Victorian properties",
          "London commuter belt residential developments",
          "Rural Essex oast houses and heritage buildings"
        ]
      };
    } else if (slug.includes("london") || ["westminster", "camden", "greenwich", "croydon", "hackney"].includes(slug)) {
      return {
        county: "London",
        coverageAreas: ["Central London", "North London", "South London", "East London", "West London", "Greater London"],
        projectTypes: [
          "Georgian and Victorian terraced houses",
          "Modern high-rise residential and commercial buildings",
          "Historic churches and listed buildings",
          "Thames-side wharves and converted warehouses",
          "Art Deco and Edwardian mansion blocks",
          "Contemporary glass and steel developments"
        ]
      };
    } else {
      return {
        county: locationTitle,
        coverageAreas: [locationTitle, "Local Area", "Surrounding Towns", "Regional Coverage", "County Wide", "Adjacent Areas"],
        projectTypes: [
          `Traditional ${locationTitle} period properties and heritage buildings`,
          `Modern residential developments throughout ${locationTitle}`,
          `Commercial and retail premises in ${locationTitle} town center`,
          `Industrial and warehouse buildings in ${locationTitle} area`,
          `Rural properties and barn conversions near ${locationTitle}`,
          `Coastal or countryside properties around ${locationTitle}`
        ]
      };
    }
  };

  const countyData = getCountyData(slug);
  
  const defaultLocation: LocationData = {
    title: locationTitle,
    description: `Professional scaffolding services in ${locationTitle} with TG20:21 compliant installation, CISRS qualified teams, and comprehensive insurance coverage for all project types.`,
    county: countyData.county,
    projectTypes: countyData.projectTypes,
    coverageAreas: countyData.coverageAreas,
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
    faqs: getCountyFAQs(slug)
  };

  return locationDataMap[slug] || defaultLocation;
}

export async function generateStaticParams() {
  const entries = await fs.readdir(DIR);
  return entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const locationData = getLocationData(slug);
  
  return { 
    title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
    description: locationData.description,
    openGraph: { 
      title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
      url: absUrl(`/locations/${slug}`),
      siteName: "Colossus Scaffolding",
      images: locationData.heroImage ? [
        {
          url: absUrl(locationData.heroImage),
          width: 1200,
          height: 630,
          alt: `Scaffolding Services in ${locationData.title} - Colossus Scaffolding`
        }
      ] : [
        {
          url: absUrl("/static/logo.png"),
          width: 1200,
          height: 630,
          alt: `Scaffolding Services in ${locationData.title} - Colossus Scaffolding`
        }
      ],
      locale: "en_GB",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
      images: locationData.heroImage ? [absUrl(locationData.heroImage)] : [absUrl("/static/logo.png")]
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`)
    }
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const locationData = getLocationData(slug);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absUrl(`/locations/${slug}#localbusiness`),
    name: `Colossus Scaffolding - ${locationData.title}`,
    description: locationData.description,
    url: absUrl(`/locations/${slug}`),
    serviceArea: {
      "@type": "Place",
      name: locationData.title,
      containedInPlace: {
        "@type": "Place", 
        name: locationData.county
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Scaffolding Services in ${locationData.title}`,
      itemListElement: locationData.services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: absUrl(service.href)
        }
      }))
    },
    parentOrganization: {
      "@id": absUrl("/#organization")
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5", 
      ratingCount: "67"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absUrl(`/locations/${slug}#faq`),
    mainEntity: locationData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: absUrl("/locations")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: locationData.title,
        item: absUrl(`/locations/${slug}`)
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absUrl(`/locations/${slug}`),
    name: `Scaffolding Services in ${locationData.title}`,
    description: locationData.description,
    url: absUrl(`/locations/${slug}`),
    isPartOf: {
      "@id": absUrl("/#website")
    },
    about: {
      "@id": absUrl(`/locations/${slug}#localbusiness`)
    },
    breadcrumb: {
      "@id": absUrl(`/locations/${slug}#breadcrumb`)
    }
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": absUrl(`/locations/${slug}#place`),
    name: locationData.title,
    containedInPlace: {
      "@type": "Place",
      name: locationData.county
    },
    geo: locationData.title === "Hastings" ? {
      "@type": "GeoCoordinates",
      latitude: "50.8549",
      longitude: "0.5736"
    } : undefined
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeSchema)
        }}
      />
      
      <LocationHero
        title={locationData.title}
        description={locationData.description}
        badge={locationData.badge}
        heroImage={locationData.heroImage}
      />
      
      <LocationServices
        title="Professional Scaffolding Services"
        description="Comprehensive scaffolding solutions delivered by CISRS qualified teams with full TG20:21 compliance."
        services={locationData.services}
        location={locationData.title}
      />
      
      <LocationCoverage
        location={locationData.title}
        county={locationData.county}
        projectTypes={locationData.projectTypes}
        coverageAreas={locationData.coverageAreas}
      />
      
      <LocationFAQ
        items={locationData.faqs}
        location={locationData.title}
      />
      
      <ServiceCTA
        title="Ready to Start Your Project?"
        description={`Contact our expert team for professional scaffolding services in ${locationData.title}. Free quotes and rapid response times across the area.`}
      />
    </>
  );
}
