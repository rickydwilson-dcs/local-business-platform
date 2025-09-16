// Organized location structure for navigation dropdown
// Separates rich town pages (with MDX) from county overview pages

interface LocationItem {
  name: string;
  slug: string;
  href: string;
  isRichContent?: boolean; // Has detailed MDX content
}

interface County {
  name: string;
  slug: string;
  href: string;
  towns: LocationItem[];
}

// Rich town pages with comprehensive MDX content
const RICH_TOWN_PAGES: LocationItem[] = [
  // East Sussex
  { name: "Brighton", slug: "brighton", href: "/locations/brighton", isRichContent: true },
  { name: "Eastbourne", slug: "eastbourne", href: "/locations/eastbourne", isRichContent: true },
  { name: "Hastings", slug: "hastings", href: "/locations/hastings", isRichContent: true },

  // West Sussex
  { name: "Crawley", slug: "crawley", href: "/locations/crawley", isRichContent: true },
  { name: "Worthing", slug: "worthing", href: "/locations/worthing", isRichContent: true },
  { name: "Horsham", slug: "horsham", href: "/locations/horsham", isRichContent: true },

  // Kent
  { name: "Maidstone", slug: "maidstone", href: "/locations/maidstone", isRichContent: true },
  { name: "Canterbury", slug: "canterbury", href: "/locations/canterbury", isRichContent: true },
  { name: "Tunbridge Wells", slug: "tunbridge-wells", href: "/locations/tunbridge-wells", isRichContent: true },

  // Surrey
  { name: "Guildford", slug: "guildford", href: "/locations/guildford", isRichContent: true },
];

// County overview pages
const COUNTY_PAGES: LocationItem[] = [
  { name: "East Sussex", slug: "east-sussex", href: "/locations/east-sussex" },
  { name: "West Sussex", slug: "west-sussex", href: "/locations/west-sussex" },
  { name: "Kent", slug: "kent", href: "/locations/kent" },
  { name: "Surrey", slug: "surrey", href: "/locations/surrey" },
  { name: "London", slug: "london", href: "/locations/london" },
  { name: "Essex", slug: "essex", href: "/locations/essex" },
];

// Organized dropdown structure
export const LOCATIONS_DROPDOWN: County[] = [
  {
    name: "East Sussex",
    slug: "east-sussex",
    href: "/locations/east-sussex",
    towns: [
      { name: "Brighton", slug: "brighton", href: "/locations/brighton", isRichContent: true },
      { name: "Eastbourne", slug: "eastbourne", href: "/locations/eastbourne", isRichContent: true },
      { name: "Hastings", slug: "hastings", href: "/locations/hastings", isRichContent: true },
      { name: "Hove", slug: "hove", href: "/locations/brighton" }, // Links to Brighton page
      { name: "Lewes", slug: "lewes", href: "/locations/east-sussex" },
      { name: "Seaford", slug: "seaford", href: "/locations/east-sussex" },
    ]
  },
  {
    name: "West Sussex",
    slug: "west-sussex",
    href: "/locations/west-sussex",
    towns: [
      { name: "Crawley", slug: "crawley", href: "/locations/crawley", isRichContent: true },
      { name: "Worthing", slug: "worthing", href: "/locations/worthing", isRichContent: true },
      { name: "Horsham", slug: "horsham", href: "/locations/horsham", isRichContent: true },
      { name: "Chichester", slug: "chichester", href: "/locations/west-sussex" },
      { name: "Bognor Regis", slug: "bognor-regis", href: "/locations/west-sussex" },
      { name: "Littlehampton", slug: "littlehampton", href: "/locations/west-sussex" },
    ]
  },
  {
    name: "Kent",
    slug: "kent",
    href: "/locations/kent",
    towns: [
      { name: "Canterbury", slug: "canterbury", href: "/locations/canterbury", isRichContent: true },
      { name: "Maidstone", slug: "maidstone", href: "/locations/maidstone", isRichContent: true },
      { name: "Tunbridge Wells", slug: "tunbridge-wells", href: "/locations/tunbridge-wells", isRichContent: true },
      { name: "Dover", slug: "dover", href: "/locations/kent" },
      { name: "Folkestone", slug: "folkestone", href: "/locations/kent" },
      { name: "Ashford", slug: "ashford", href: "/locations/kent" },
    ]
  },
  {
    name: "Surrey",
    slug: "surrey",
    href: "/locations/surrey",
    towns: [
      { name: "Guildford", slug: "guildford", href: "/locations/guildford", isRichContent: true },
      { name: "Woking", slug: "woking", href: "/locations/guildford" }, // Links to Guildford page
      { name: "Kingston upon Thames", slug: "kingston", href: "/locations/surrey" },
      { name: "Epsom", slug: "epsom", href: "/locations/surrey" },
      { name: "Redhill", slug: "redhill", href: "/locations/surrey" },
      { name: "Camberley", slug: "camberley", href: "/locations/surrey" },
    ]
  },
  {
    name: "London",
    slug: "london",
    href: "/locations/london",
    towns: [
      { name: "South London", slug: "south-london", href: "/locations/london" },
      { name: "West London", slug: "west-london", href: "/locations/london" },
      { name: "East London", slug: "east-london", href: "/locations/london" },
      { name: "Central London", slug: "central-london", href: "/locations/london" },
      { name: "Croydon", slug: "croydon", href: "/locations/london" },
      { name: "Bromley", slug: "bromley", href: "/locations/london" },
    ]
  },
  {
    name: "Essex",
    slug: "essex",
    href: "/locations/essex",
    towns: [
      { name: "Chelmsford", slug: "chelmsford", href: "/locations/essex" },
      { name: "Southend-on-Sea", slug: "southend", href: "/locations/essex" },
      { name: "Colchester", slug: "colchester", href: "/locations/essex" },
      { name: "Basildon", slug: "basildon", href: "/locations/essex" },
      { name: "Harlow", slug: "harlow", href: "/locations/essex" },
      { name: "Brentwood", slug: "brentwood", href: "/locations/essex" },
    ]
  }
];

// Helper functions for easy access
export function getAllCounties(): County[] {
  return LOCATIONS_DROPDOWN;
}

export function getCountyBySlug(slug: string): County | undefined {
  return LOCATIONS_DROPDOWN.find(county => county.slug === slug);
}

export function getAllRichTownPages(): LocationItem[] {
  return RICH_TOWN_PAGES;
}

export function getTownsByCounty(countySlug: string): LocationItem[] {
  const county = getCountyBySlug(countySlug);
  return county ? county.towns : [];
}

// Get all locations (counties + towns) for search/filtering
export function getAllLocations(): LocationItem[] {
  const counties = LOCATIONS_DROPDOWN.map(county => ({
    name: county.name,
    slug: county.slug,
    href: county.href,
    isRichContent: false
  }));

  const towns = LOCATIONS_DROPDOWN.flatMap(county => county.towns);

  return [...counties, ...towns];
}