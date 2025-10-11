// Town location data with coordinates for interactive map
// All coordinates are accurate for South East England towns

export interface TownLocation {
  name: string;
  coords: [number, number]; // [latitude, longitude]
  county: string;
  url: string;
  isRichContent?: boolean;
  description?: string;
}

export const TOWN_LOCATIONS: TownLocation[] = [
  // East Sussex
  {
    name: "Brighton",
    coords: [50.8225, -0.1372],
    county: "East Sussex",
    url: "/locations/brighton",
    isRichContent: true,
    description: "Coastal city with heritage pier and regency architecture"
  },
  {
    name: "Eastbourne",
    coords: [50.7684, 0.2903],
    county: "East Sussex",
    url: "/locations/eastbourne",
    isRichContent: true,
    description: "Victorian seaside resort with heritage buildings"
  },
  {
    name: "Hastings",
    coords: [50.8520, 0.5726],
    county: "East Sussex",
    url: "/locations/hastings",
    isRichContent: true,
    description: "Historic fishing port with medieval castle"
  },
  {
    name: "Lewes",
    coords: [50.8759, 0.0149],
    county: "East Sussex",
    url: "/locations/lewes",
    isRichContent: true,
    description: "Historic county town with Norman castle"
  },
  {
    name: "Uckfield",
    coords: [50.9707, 0.0978],
    county: "East Sussex",
    url: "/locations/uckfield",
    isRichContent: true,
    description: "Market town in the Weald countryside"
  },
  {
    name: "Hailsham",
    coords: [50.8618, 0.2593],
    county: "East Sussex",
    url: "/locations/hailsham",
    isRichContent: true,
    description: "Market town with growing residential development"
  },
  {
    name: "Newhaven",
    coords: [50.7930, 0.0535],
    county: "East Sussex",
    url: "/locations/newhaven",
    isRichContent: true,
    description: "Port town with ferry terminal and regeneration projects"
  },
  {
    name: "Seaford",
    coords: [50.7719, 0.1019],
    county: "East Sussex",
    url: "/locations/seaford",
    isRichContent: true,
    description: "Coastal town beneath the South Downs"
  },
  {
    name: "Battle",
    coords: [50.9158, 0.4903],
    county: "East Sussex",
    url: "/locations/battle",
    isRichContent: true,
    description: "Historic town site of the Battle of Hastings"
  },
  {
    name: "Crowborough",
    coords: [51.0506, 0.1647],
    county: "East Sussex",
    url: "/locations/crowborough",
    isRichContent: true,
    description: "Hilltop town in the High Weald"
  },

  // West Sussex
  {
    name: "Crawley",
    coords: [51.1107, -0.1863],
    county: "West Sussex",
    url: "/locations/crawley",
    isRichContent: true,
    description: "Major commercial town near Gatwick Airport"
  },
  {
    name: "Worthing",
    coords: [50.8179, -0.3728],
    county: "West Sussex",
    url: "/locations/worthing",
    isRichContent: true,
    description: "Large seaside town with Victorian heritage"
  },
  {
    name: "Horsham",
    coords: [51.0628, -0.3258],
    county: "West Sussex",
    url: "/locations/horsham",
    isRichContent: true,
    description: "Historic market town with expanding residential areas"
  },
  {
    name: "Chichester",
    coords: [50.8365, -0.7792],
    county: "West Sussex",
    url: "/locations/chichester",
    isRichContent: true,
    description: "Cathedral city with Roman heritage and cultural venues"
  },
  {
    name: "Littlehampton",
    coords: [50.8092, -0.5419],
    county: "West Sussex",
    url: "/locations/littlehampton",
    isRichContent: true,
    description: "Coastal town with working harbor and beach resort"
  },
  {
    name: "Bognor Regis",
    coords: [50.7823, -0.6756],
    county: "West Sussex",
    url: "/locations/bognor-regis",
    isRichContent: true,
    description: "Seaside resort town with Victorian pier"
  },
  {
    name: "Burgess Hill",
    coords: [50.9586, -0.1290],
    county: "West Sussex",
    url: "/locations/burgess-hill",
    isRichContent: true,
    description: "Growing town in the Sussex countryside"
  },
  {
    name: "Haywards Heath",
    coords: [51.0036, -0.1025],
    county: "West Sussex",
    url: "/locations/haywards-heath",
    isRichContent: true,
    description: "Commuter town with Victorian railway heritage"
  },

  // Kent
  {
    name: "Canterbury",
    coords: [51.2802, 1.0789],
    county: "Kent",
    url: "/locations/canterbury",
    isRichContent: true,
    description: "World Heritage cathedral city"
  },
  {
    name: "Maidstone",
    coords: [51.2704, 0.5218],
    county: "Kent",
    url: "/locations/maidstone",
    isRichContent: true,
    description: "County town with River Medway heritage"
  },
  {
    name: "Tunbridge Wells",
    coords: [51.1326, 0.2635],
    county: "Kent",
    url: "/locations/tunbridge-wells",
    isRichContent: true,
    description: "Historic spa town with Georgian architecture"
  },
  {
    name: "Ashford",
    coords: [51.1464, 0.8750],
    county: "Kent",
    url: "/locations/ashford",
    isRichContent: true,
    description: "International railway hub with modern development"
  },
  {
    name: "Folkestone",
    coords: [51.0814, 1.1696],
    county: "Kent",
    url: "/locations/folkestone",
    isRichContent: true,
    description: "Channel port town with creative quarter"
  },
  {
    name: "Dover",
    coords: [51.1279, 1.3134],
    county: "Kent",
    url: "/locations/dover",
    isRichContent: true,
    description: "Major port with white cliffs and medieval castle"
  },
  {
    name: "Margate",
    coords: [51.3813, 1.3862],
    county: "Kent",
    url: "/locations/margate",
    isRichContent: true,
    description: "Historic seaside resort with Turner Contemporary"
  },
  {
    name: "Sevenoaks",
    coords: [51.2720, 0.1908],
    county: "Kent",
    url: "/locations/sevenoaks",
    isRichContent: true,
    description: "Commuter town in Kent Downs Area of Outstanding Beauty"
  },
  {
    name: "Dartford",
    coords: [51.4470, 0.2170],
    county: "Kent",
    url: "/locations/dartford",
    isRichContent: true,
    description: "Industrial town with major commercial developments"
  },

  // Surrey
  {
    name: "Guildford",
    coords: [51.2362, -0.5704],
    county: "Surrey",
    url: "/locations/guildford",
    isRichContent: true,
    description: "Cathedral city and university town"
  },
  {
    name: "Woking",
    coords: [51.3183, -0.5585],
    county: "Surrey",
    url: "/locations/woking",
    isRichContent: true,
    description: "Modern commercial center with excellent transport links"
  },
  {
    name: "Epsom",
    coords: [51.3304, -0.2693],
    county: "Surrey",
    url: "/locations/epsom",
    isRichContent: true,
    description: "Famous for racecourse and spa town heritage"
  },
  {
    name: "Kingston upon Thames",
    coords: [51.4085, -0.3064],
    county: "Surrey",
    url: "/locations/kingston-upon-thames",
    isRichContent: true,
    description: "Ancient market town and major retail center"
  },
  {
    name: "Redhill",
    coords: [51.2407, -0.1710],
    county: "Surrey",
    url: "/locations/redhill",
    isRichContent: true,
    description: "Commercial town beneath the North Downs"
  },
  {
    name: "Camberley",
    coords: [51.3374, -0.7434],
    county: "Surrey",
    url: "/locations/camberley",
    isRichContent: true,
    description: "Modern town with military college heritage"
  }
];

// Helper function to get locations by county
export function getLocationsByCounty(county: string): TownLocation[] {
  return TOWN_LOCATIONS.filter(location => location.county === county);
}

// Helper function to get all counties with their location counts
export function getCountySummary() {
  const counties = ['East Sussex', 'West Sussex', 'Kent', 'Surrey'];
  return counties.map(county => ({
    name: county,
    slug: county.toLowerCase().replace(' ', '-'),
    locationCount: getLocationsByCounty(county).length,
    locations: getLocationsByCounty(county)
  }));
}

// Map center coordinates (roughly central to South East England)
export const MAP_CENTER: [number, number] = [51.0, 0.5];
export const MAP_ZOOM = 9;