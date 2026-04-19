export const siteData: Record<string, unknown> = {
  header: {
    siteName: "Designlab",
    navigation: [
      { label: "Signs", href: "/services" },
      { label: "Vehicles", href: "/services/vehicle-graphics" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
    ],
    primaryCta: { label: "Get a Quote", href: "/contact" },
  },
  footer: {
    siteName: "Designlab",
    tagline: "Eastbourne's leading sign makers",
    email: "hello@designlab.co.uk",
    services: [
      { label: "Shop Signs", href: "/services/shop-signs" },
      { label: "Vehicle Graphics", href: "/services/vehicle-graphics" },
      { label: "Banners & Displays", href: "/services/banners" },
      { label: "Window Graphics", href: "/services/window-graphics" },
    ],
    copyright: `© ${new Date().getFullYear()} Designlab. All rights reserved.`,
  },

  heading: "Signs & Graphics That Get You Noticed",
  eyebrow: "Eastbourne's leading sign makers",
  subheading:
    "From shop fronts to vehicle wraps, we design and install signage that makes your brand impossible to ignore.",
  primaryCtaText: "Get a Quote",
  primaryCtaHref: "/contact",
  heroImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop",

  featuresSection: {
    heading: "Why Clients Choose Us",
    intro: "Quality craftsmanship, fast turnaround, and a team that cares about your brand.",
    features: [
      {
        title: "Shop Signs",
        description: "Bold, durable signage for retail and hospitality.",
        icon: "🏪",
      },
      {
        title: "Vehicle Wraps",
        description: "Turn your fleet into moving billboards.",
        icon: "🚐",
      },
      {
        title: "Exhibition Displays",
        description: "Stand out at trade shows and events.",
        icon: "🖼️",
      },
    ],
  },

  services: [
    {
      title: "Shop Fronts",
      description: "Custom fascias, built-up letters, and illuminated signs.",
      icon: "✦",
      href: "/services/shop-fronts",
    },
    {
      title: "Vehicle Graphics",
      description: "Full wraps, partial graphics, and fleet branding.",
      icon: "✦",
      href: "/services/vehicle-graphics",
    },
    {
      title: "Banners & Displays",
      description: "Roller banners, pop-ups, and exhibition systems.",
      icon: "✦",
      href: "/services/displays",
    },
    {
      title: "Window Graphics",
      description: "Frosted vinyl, full-colour prints, and manifestations.",
      icon: "✦",
      href: "/services/window-graphics",
    },
  ],

  stats: [
    { value: "20+", label: "Years Experience" },
    { value: "5,000+", label: "Projects Completed" },
    { value: "4.9★", label: "Google Rating" },
    { value: "48hr", label: "Turnaround Available" },
  ],

  testimonials: [
    {
      name: "James T.",
      location: "Eastbourne",
      rating: 5,
      text: "Incredible quality and fast turnaround. Our shop front looks amazing.",
      avatarInitials: "JT",
    },
    {
      name: "Sarah M.",
      location: "Brighton",
      rating: 5,
      text: "Professional from start to finish. Highly recommend for vehicle wraps.",
      avatarInitials: "SM",
    },
  ],

  ctaHeading: "Ready to Make Your Brand Stand Out?",
  ctaSubheading: "Get a free quote today — fast turnaround, competitive pricing.",

  aboutSection: {
    heading: "Crafted in Eastbourne. Installed Everywhere.",
    subheading: "Who We Are",
    body: "Designlab has been producing high-quality signs and graphics from our Eastbourne studio since 2004. We work with independent businesses, national brands, and everyone in between — delivering signage that's built to last and designed to impress.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
  },

  whyUsSection: {
    heading: "Why Businesses Choose Designlab",
    subheading: "Our Promise",
    body: "We're not a faceless print shop. You deal directly with our design and installation team from first enquiry to final fit — no hand-offs, no surprises.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ctaText: "See Our Work",
    ctaHref: "/projects",
    listItems: [
      "Free design consultation and site survey",
      "In-house design team — no outsourcing",
      "Installation across Sussex and the South East",
      "5-year guarantee on all manufactured signs",
    ],
  },
};
