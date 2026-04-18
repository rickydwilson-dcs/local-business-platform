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
] as const;
