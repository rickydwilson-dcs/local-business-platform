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
  { name: "Battle", slug: "battle", href: "/locations/battle", isRichContent: true },
  { name: "Crowborough", slug: "crowborough", href: "/locations/crowborough", isRichContent: true },
  { name: "Hailsham", slug: "hailsham", href: "/locations/hailsham", isRichContent: true },
  { name: "Lewes", slug: "lewes", href: "/locations/lewes", isRichContent: true },
  { name: "Newhaven", slug: "newhaven", href: "/locations/newhaven", isRichContent: true },
  { name: "Seaford", slug: "seaford", href: "/locations/seaford", isRichContent: true },
  { name: "Uckfield", slug: "uckfield", href: "/locations/uckfield", isRichContent: true },

  // West Sussex
  { name: "Crawley", slug: "crawley", href: "/locations/crawley", isRichContent: true },
  { name: "Worthing", slug: "worthing", href: "/locations/worthing", isRichContent: true },
  { name: "Horsham", slug: "horsham", href: "/locations/horsham", isRichContent: true },
  { name: "Chichester", slug: "chichester", href: "/locations/chichester", isRichContent: true },
  { name: "Littlehampton", slug: "littlehampton", href: "/locations/littlehampton", isRichContent: true },
  { name: "Bognor Regis", slug: "bognor-regis", href: "/locations/bognor-regis", isRichContent: true },
  { name: "Burgess Hill", slug: "burgess-hill", href: "/locations/burgess-hill", isRichContent: true },
  { name: "Haywards Heath", slug: "haywards-heath", href: "/locations/haywards-heath", isRichContent: true },

  // Kent
  { name: "Maidstone", slug: "maidstone", href: "/locations/maidstone", isRichContent: true },
  { name: "Canterbury", slug: "canterbury", href: "/locations/canterbury", isRichContent: true },
  { name: "Tunbridge Wells", slug: "tunbridge-wells", href: "/locations/tunbridge-wells", isRichContent: true },
  { name: "Ashford", slug: "ashford", href: "/locations/ashford", isRichContent: true },
  { name: "Folkestone", slug: "folkestone", href: "/locations/folkestone", isRichContent: true },
  { name: "Dover", slug: "dover", href: "/locations/dover", isRichContent: true },
  { name: "Margate", slug: "margate", href: "/locations/margate", isRichContent: true },
  { name: "Sevenoaks", slug: "sevenoaks", href: "/locations/sevenoaks", isRichContent: true },
  { name: "Dartford", slug: "dartford", href: "/locations/dartford", isRichContent: true },

  // Surrey
  { name: "Guildford", slug: "guildford", href: "/locations/guildford", isRichContent: true },
  { name: "Woking", slug: "woking", href: "/locations/woking", isRichContent: true },
  { name: "Epsom", slug: "epsom", href: "/locations/epsom", isRichContent: true },
  { name: "Kingston upon Thames", slug: "kingston-upon-thames", href: "/locations/kingston-upon-thames", isRichContent: true },
  { name: "Redhill", slug: "redhill", href: "/locations/redhill", isRichContent: true },
  { name: "Camberley", slug: "camberley", href: "/locations/camberley", isRichContent: true },
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
      { name: "Battle", slug: "battle", href: "/locations/battle", isRichContent: true },
      { name: "Crowborough", slug: "crowborough", href: "/locations/crowborough", isRichContent: true },
      { name: "Hailsham", slug: "hailsham", href: "/locations/hailsham", isRichContent: true },
      { name: "Lewes", slug: "lewes", href: "/locations/lewes", isRichContent: true },
      { name: "Newhaven", slug: "newhaven", href: "/locations/newhaven", isRichContent: true },
      { name: "Seaford", slug: "seaford", href: "/locations/seaford", isRichContent: true },
      { name: "Uckfield", slug: "uckfield", href: "/locations/uckfield", isRichContent: true },
      { name: "Hove", slug: "hove", href: "/locations/brighton" }, // Links to Brighton page
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
      { name: "Chichester", slug: "chichester", href: "/locations/chichester", isRichContent: true },
      { name: "Littlehampton", slug: "littlehampton", href: "/locations/littlehampton", isRichContent: true },
      { name: "Bognor Regis", slug: "bognor-regis", href: "/locations/bognor-regis", isRichContent: true },
      { name: "Burgess Hill", slug: "burgess-hill", href: "/locations/burgess-hill", isRichContent: true },
      { name: "Haywards Heath", slug: "haywards-heath", href: "/locations/haywards-heath", isRichContent: true },
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
      { name: "Ashford", slug: "ashford", href: "/locations/ashford", isRichContent: true },
      { name: "Folkestone", slug: "folkestone", href: "/locations/folkestone", isRichContent: true },
      { name: "Dover", slug: "dover", href: "/locations/dover", isRichContent: true },
      { name: "Margate", slug: "margate", href: "/locations/margate", isRichContent: true },
      { name: "Sevenoaks", slug: "sevenoaks", href: "/locations/sevenoaks", isRichContent: true },
      { name: "Dartford", slug: "dartford", href: "/locations/dartford", isRichContent: true },
    ]
  },
  {
    name: "Surrey",
    slug: "surrey",
    href: "/locations/surrey",
    towns: [
      { name: "Guildford", slug: "guildford", href: "/locations/guildford", isRichContent: true },
      { name: "Woking", slug: "woking", href: "/locations/woking", isRichContent: true },
      { name: "Epsom", slug: "epsom", href: "/locations/epsom", isRichContent: true },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames", href: "/locations/kingston-upon-thames", isRichContent: true },
      { name: "Redhill", slug: "redhill", href: "/locations/redhill", isRichContent: true },
      { name: "Camberley", slug: "camberley", href: "/locations/camberley", isRichContent: true },
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