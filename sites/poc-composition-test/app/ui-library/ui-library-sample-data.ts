// Sample theme: FastFlo Plumbing & Heating (London)

export const heroData = {
  heading: "Expert Plumbing & Heating in London",
  eyebrow: "FastFlo Plumbing & Heating",
  subheading:
    "From blocked drains to full boiler installations — 24/7 emergency cover across Greater London.",
  primaryCtaText: "Get a Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: "Call Now",
  secondaryCtaHref: "tel:02071234567",
  heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  trustBadges: ["Gas Safe Registered", "Which? Trusted Trader", "24/7 Emergency"],
};

export const heroSlots = {
  showEyebrow: true,
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: true,
  showHeroImage: true,
  showTrustBadges: true,
};

export const serviceCardsData = {
  heading: "Our Plumbing & Heating Services",
  subheading: "Residential and commercial across all 32 London boroughs.",
  services: [
    {
      title: "Boiler Installation",
      description: "Gas Safe certified boiler fitting, commissioning, and landlord certificates.",
      icon: "🔥",
      href: "/services/boiler-installation",
    },
    {
      title: "Emergency Callouts",
      description: "24/7 emergency plumbing — burst pipes, no hot water, gas leaks.",
      icon: "⚡",
      href: "/services/emergency",
    },
    {
      title: "Drain Unblocking",
      description: "High-pressure water jetting and CCTV drain surveys.",
      icon: "🔧",
      href: "/services/drains",
    },
    {
      title: "Central Heating",
      description: "Full system installs, powerflushes, and annual servicing.",
      icon: "🏠",
      href: "/services/heating",
    },
    {
      title: "Bathroom Fitting",
      description: "Full strip-out and fit, tiling, and wet room conversions.",
      icon: "🚿",
      href: "/services/bathrooms",
    },
    {
      title: "Leak Detection",
      description: "Non-destructive acoustic and thermal imaging leak tracing.",
      icon: "💧",
      href: "/services/leak-detection",
    },
  ],
};

export const serviceCardsSlots = {
  showIcon: true,
  showImage: false,
  showDescription: true,
  showCta: true,
  showBadge: false,
};

export const featureGridData = {
  heading: "Why London Trusts FastFlo",
  intro: "Over 4,000 homes and businesses served since 2008.",
  features: [
    {
      title: "Gas Safe Registered",
      description: "Every engineer fully certified — registration number on every invoice.",
      icon: "🔒",
    },
    {
      title: "Same-Day Service",
      description: "Most non-emergency jobs booked the day you call.",
      icon: "📅",
    },
    {
      title: "Transparent Pricing",
      description: "Fixed quotes before we start — no hidden call-out fees, ever.",
      icon: "💷",
    },
    {
      title: "1-Hour Response",
      description: "Emergency callout engineers on the road within 60 minutes.",
      icon: "⚡",
    },
    {
      title: "10-Year Guarantee",
      description: "New boiler installations backed by manufacturer warranty.",
      icon: "✅",
    },
    {
      title: "Fully Insured",
      description: "£5m public liability insurance on all work.",
      icon: "🛡️",
    },
  ],
};

export const featureGridSlots = {
  showSectionHeading: true,
  showSectionIntro: true,
  showIcons: true,
  showDescriptions: true,
};

export const testimonialGridData = {
  heading: "What Our Customers Say",
  subheading: "4.9 stars across 200+ Google reviews.",
  testimonials: [
    {
      name: "James T.",
      location: "Hackney",
      rating: 5,
      text: "FastFlo fixed our boiler on Christmas Eve. Engineer arrived within 45 minutes, had the part on the van, sorted in 2 hours. Couldn't recommend more.",
      avatarInitials: "JT",
    },
    {
      name: "Sarah M.",
      location: "Islington",
      rating: 5,
      text: "Same-day drain unblock in our restaurant kitchen. Professional, tidy, and explained everything. Back up and running before lunch service.",
      avatarInitials: "SM",
    },
    {
      name: "David K.",
      location: "Lambeth",
      rating: 5,
      text: "New combi boiler installed in a day — clean install, all flues and pipework neat, and they even patched the plaster. Exactly what you want.",
      avatarInitials: "DK",
    },
    {
      name: "Priya N.",
      location: "Tower Hamlets",
      rating: 5,
      text: "Leak detection saved us from ripping up the kitchen floor. They found it with a camera in 20 minutes. Honest and efficient.",
      avatarInitials: "PN",
    },
    {
      name: "Marcus B.",
      location: "Wandsworth",
      rating: 5,
      text: "Annual boiler service done on time, reminder sent in advance. Engineer was friendly and thorough. Five stars every year.",
      avatarInitials: "MB",
    },
    {
      name: "Rachel S.",
      location: "Camden",
      rating: 5,
      text: "Full bathroom refit came in on budget and on schedule. The tiling alone was worth the price — absolutely immaculate finish.",
      avatarInitials: "RS",
    },
  ],
};

export const testimonialGridSlots = {
  showStars: true,
  showDate: false,
  showAvatar: true,
  showAuthorName: true,
  showLocation: true,
  showTitle: false,
};

export const statsStripData = {
  stats: [
    { value: "15+", label: "Years Experience" },
    { value: "4,000+", label: "Jobs Completed" },
    { value: "4.9★", label: "Google Rating" },
    { value: "24/7", label: "Emergency Cover" },
  ],
};

export const statsStripSlots = {
  showLabel: true,
  showDescription: false,
  showDividers: true,
};

export const ctaSectionData = {
  heading: "Need a Plumber in London Today?",
  subheading:
    "We cover all 32 boroughs — same-day appointments available for non-emergencies, 1-hour response for emergencies.",
  primaryCtaText: "Get a Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: "Call 020 7123 4567",
  secondaryCtaHref: "tel:02071234567",
  trustLine: "No call-out fee · Gas Safe registered · 1-hour emergency response",
};

export const ctaSectionSlots = {
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: false,
  showTrustLine: false,
};

export const contentSectionData = {
  heading: "Plumbing & Heating Since 2008",
  subheading: "About FastFlo",
  body: "FastFlo was founded in East London by two Gas Safe engineers who were tired of seeing customers overcharged by unaccountable firms. Today we are a team of 12, covering all 32 London boroughs with honest pricing and fast response times. Every engineer is directly employed — no subcontractors, no surprises.",
  image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
  ctaText: "Meet the Team",
  ctaHref: "/about",
  listItems: [
    "All engineers Gas Safe registered",
    "Fixed pricing — no hidden call-out fees",
    "1-hour emergency response across Greater London",
    "10-year guarantee on new boiler installations",
    "Directly employed engineers — no subcontractors",
  ],
};

export const contentSectionSlots = {
  showSubheading: true,
  showImage: false,
  showCta: false,
  showList: false,
};
