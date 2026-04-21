export const COMPOSITION_CATALOG = [
  {
    name: "HeroSection",
    description:
      "Primary above-fold hero section. Use for the first section of any page. Handles full-bleed, split (text/image), and centered layouts via layout.align.",
    slots: {
      showEyebrow: "Small label above heading",
      showSubheading: "Subheading or intro text below heading",
      showPrimaryCta: "Primary call-to-action button",
      showSecondaryCta: "Secondary/outline CTA button",
      showHeroImage: "Hero image or illustration",
      showTrustBadges: "Trust indicators (badges, certifications)",
    },
    layoutParams: {
      align: ["left", "center", "split"],
      background: ["surface", "subtle", "inverse", "brand"],
      fullBleed: "boolean — makes section min-h-[60vh]",
    },
  },
  {
    name: "ServiceCards",
    description:
      "Grid of service cards with icons, images, descriptions, and CTA links. Use for showcasing services, products, or offerings.",
    slots: {
      showIcon: "Emoji or icon above card title",
      showImage: "Card image (aspect-video)",
      showDescription: "Short description paragraph",
      showCta: "Learn more link",
      showBadge: "Small badge label on card",
    },
    layoutParams: {
      columns: [2, 3, 4],
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "FeatureGrid",
    description:
      "Icon-card grid for features, benefits, or USPs. Icon above title above description.",
    slots: {
      showSectionHeading: "Section-level heading",
      showSectionIntro: "Section-level intro paragraph",
      showIcons: "Icon circle above feature title",
      showDescriptions: "Description text below feature title",
    },
    layoutParams: {
      columns: [2, 3, 4],
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "TestimonialGrid",
    description: "Grid of testimonial/review cards with stars, author info, and quote text.",
    slots: {
      showStars: "Star rating (1–5)",
      showDate: "Date of review",
      showAvatar: "Author avatar initials circle",
      showAuthorName: "Author name",
      showLocation: "Author location",
      showTitle: "Review title/headline",
    },
    layoutParams: {
      columns: [1, 2, 3],
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "StatsStrip",
    description:
      "Horizontal strip of stat items (value + label). Use for social proof numbers, achievements, or key metrics.",
    slots: {
      showLabel: "Label below stat value",
      showDescription: "Optional description below label",
      showDividers: "Vertical dividers between stat items",
    },
    layoutParams: {
      columns: [3, 4],
      background: ["surface", "subtle", "inverse", "brand"],
      paddingY: ["compact", "standard", "spacious"],
    },
  },
  {
    name: "CTASection",
    description:
      "Full-width conversion band with heading, optional subheading, and CTA buttons. Use at section boundaries or page bottom.",
    slots: {
      showSubheading: "Subheading below main heading",
      showPrimaryCta: "Primary CTA button",
      showSecondaryCta: "Secondary CTA button",
      showTrustLine: "Small trust text below buttons",
    },
    layoutParams: {
      background: ["surface", "subtle", "inverse", "brand"],
      align: ["left", "center"],
    },
  },
  {
    name: "ContentSection",
    description:
      "Flexible content section: heading + body prose + optional image. Supports split (text/image) and stacked layouts.",
    slots: {
      showImage: "Image alongside content",
      showSubheading: "Eyebrow/subheading above heading",
      showCta: "CTA button below content",
      showList: "Bullet/checkmark list of items",
    },
    layoutParams: {
      align: ["left", "center", "split"],
      background: ["surface", "subtle", "inverse", "brand"],
      fullBleed: "boolean — makes section min-h-[50vh]",
    },
  },
  {
    name: "CountyGatewayCards",
    description:
      "Gateway cards per county linking to county overview pages. Use on locations index when locations are grouped by region.",
    slots: {
      showSectionHeading: "Section-level heading",
      showDescription: "County description paragraph",
      showHighlights: "List of up to 4 county highlights",
      showTownCount: "Badge showing number of towns in county",
    },
    layoutParams: {
      columns: [2, 3],
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "TownFinderSection",
    description:
      "Search-driven town autocomplete (client component). Use on locations index when users need to find a specific town by name.",
    slots: {
      showSectionHeading: "Section-level heading",
      showIntro: "Intro paragraph",
      showCountyBadge: "Display parent county name next to each town result",
    },
    layoutParams: {
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "LocalAuthorityExpertise",
    description:
      "Three-column display of local authority / council expertise: expertise bullets, fast-track claims, coverage neighbourhoods. Renders nothing if frontmatter field is absent.",
    slots: {
      showExpertiseBullets: "Council expertise bullet list",
      showFastTrackClaims: "Fast-track / accelerated claims bullets",
      showCoverageNeighbourhoods: "Neighbourhood coverage list",
    },
    layoutParams: {
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "CoverageMapSection",
    description:
      "Leaflet-based map with town markers. Lazy-loaded via next/dynamic; renders a semantic marker list below the map.",
    slots: {
      showSectionHeading: "Section-level heading",
      showIntro: "Intro paragraph above the map",
      showMarkerList: "Plain-text list of marker names below the map",
    },
    layoutParams: {
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
  {
    name: "PricingPackagesSection",
    description:
      "Three-tier pricing packages (essential / standard / premium pattern). One of the packages may be marked highlighted: true for emphasis.",
    slots: {
      showSectionHeading: "Section-level heading",
      showIntro: "Intro paragraph",
      showFeatures: "Feature bullet list per package",
      showHighlightedBadge: "Ribbon badge on the highlighted tier",
    },
    layoutParams: {
      background: ["surface", "subtle", "inverse", "brand"],
    },
  },
] as const;
