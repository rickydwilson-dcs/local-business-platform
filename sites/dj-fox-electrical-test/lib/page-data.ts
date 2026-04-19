/**
 * Site data for dj-fox-electrical-test.
 *
 * All values here were sourced from:
 * - sites/dj-fox-electrical/site.config.ts
 * - sites/dj-fox-electrical/app/**\/page.tsx
 *
 * This file feeds the composition.json pipeline — every `dataKey` used in
 * composition.json resolves to a key path inside this object.
 */

import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";

// ---------------------------------------------------------------------------
// Derived lists from siteConfig
// ---------------------------------------------------------------------------

const topServicesForHome = siteConfig.services.slice(0, 6).map((s) => ({
  title: s.title,
  description: s.description,
  href: `/services/${s.slug}`,
}));

const allServiceCards = siteConfig.services.map((s) => ({
  title: s.title,
  description: s.description,
  href: `/services/${s.slug}`,
}));

const footerServices = siteConfig.services
  .slice(0, siteConfig.footer.maxServices)
  .map((s) => ({ slug: s.slug, title: s.title }));

// Priority locations used on the home page — sourced from app/page.tsx
const priorityLocationSlugs = [
  "eastbourne",
  "hastings",
  "bexhill-on-sea",
  "brighton",
  "lewes",
  "hailsham",
];

// Locations known from serviceAreaRegions in siteConfig
const allLocationsFromConfig = (siteConfig.serviceAreaRegions?.[0]?.towns ?? []).map((t) => ({
  slug: t.slug,
  title: t.name,
  description: `Professional electrical services in ${t.name} and surrounding areas.`,
}));

const priorityLocationCards = allLocationsFromConfig
  .filter((loc) => priorityLocationSlugs.includes(loc.slug))
  .sort((a, b) => priorityLocationSlugs.indexOf(a.slug) - priorityLocationSlugs.indexOf(b.slug));

const footerLocations = allLocationsFromConfig
  .slice(0, siteConfig.footer.maxLocations)
  .map((l) => ({ slug: l.slug, title: l.title }));

// Counties for OrionHeader — built from serviceAreaRegions
const headerCounties = (siteConfig.serviceAreaRegions ?? []).map((region) => ({
  name: region.name,
  slug: region.slug,
  href: `/locations#${region.slug}`,
  towns: region.towns.map((t) => ({
    name: t.name,
    slug: t.slug,
    href: `/locations/${t.slug}`,
  })),
}));

// ---------------------------------------------------------------------------
// siteData — keyed by the dataKeys used in composition.json
// ---------------------------------------------------------------------------

export const siteData = {
  meta: {
    title: "D J Fox Electrical | Electricians in Eastbourne",
    description: "NICEIC Approved electricians serving Eastbourne and East Sussex.",
  },

  // -------------------------------------------------------------------------
  // Header — must match OrionHeaderProps exactly
  // -------------------------------------------------------------------------
  header: {
    siteName: siteConfig.business.name,
    phoneDisplay: PHONE_DISPLAY,
    phoneTel: PHONE_TEL,
    showPhone: true,
    primaryCta: siteConfig.cta.primary,
    navigation: siteConfig.navigation.main,
    locations: allLocationsFromConfig.map((l) => ({ name: l.title, slug: l.slug })),
    counties: headerCounties,
    maxTownsPerCounty: 10,
  } as any,

  // -------------------------------------------------------------------------
  // Footer — must match OrionFooterProps exactly
  // -------------------------------------------------------------------------
  footer: {
    siteName: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phoneDisplay: PHONE_DISPLAY,
    phoneTel: PHONE_TEL,
    email: BUSINESS_EMAIL,
    address: {
      locality: ADDRESS.locality,
      region: ADDRESS.region,
    },
    certifications: siteConfig.credentials.certifications,
    services: footerServices,
    locations: footerLocations,
    totalServices: siteConfig.services.length,
    totalLocations: allLocationsFromConfig.length,
    maxServices: siteConfig.footer.maxServices,
    maxLocations: siteConfig.footer.maxLocations,
    showServices: siteConfig.footer.showServices,
    showLocations: siteConfig.footer.showLocations,
    copyright: siteConfig.footer.copyright,
    builtBy: siteConfig.footer.builtBy,
  } as any,

  // -------------------------------------------------------------------------
  // Home page
  // -------------------------------------------------------------------------
  home: {
    hero: {
      eyebrow: "NICEIC Approved",
      heading: "High Quality Electrical Services in Eastbourne",
      subheading: "NICEIC Approved Contractor | 15+ Years Experience | 24/7 Emergency Service",
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: "Our Services",
      secondaryCtaHref: "/services",
      heroImage: "djfoxelectrical/hero/hero-electrician-work.jpg",
      trustBadges: ["NICEIC Approved", "Part P Registered", "TrustMark Endorsed"],
    },

    stats: {
      stats: siteConfig.credentials.stats.map((s) => ({
        value: s.value,
        label: s.label,
        description: s.description,
      })),
    },

    services: {
      heading: "Our Services",
      subheading: `Professional electrical services for homes and businesses across ${siteConfig.business.address.city} and surrounding areas.`,
      services: topServicesForHome,
    },

    categories: {
      heading: "Check Your Needs",
      subheading: "From new installations to emergency repairs, we cover all your requirements",
      cards: [
        {
          imageSrc: "djfoxelectrical/categories/installation-work.jpg",
          imageAlt: "Electrical installation services",
          category: "Installation",
          title: "New Installations",
          href: "/services#installation",
        },
        {
          imageSrc: "djfoxelectrical/categories/maintenance-work.jpg",
          imageAlt: "Electrical maintenance services",
          category: "Maintenance",
          title: "Regular Maintenance",
          href: "/services#maintenance",
        },
        {
          imageSrc: "djfoxelectrical/categories/repair-work.jpg",
          imageAlt: "Electrical repair services",
          category: "Repair",
          title: "Expert Repairs",
          href: "/services#repair",
        },
      ],
    },

    locations: {
      heading: "Areas We Serve",
      cards: priorityLocationCards,
    },

    whyChooseUs: {
      heading: `Why Choose ${siteConfig.business.name}`,
      intro: "Certified expertise, rapid response, and customer-first service.",
      features: [
        {
          icon: "🛡️",
          title: "NICEIC Approved",
          description:
            "Fully certified and approved contractor, ensuring all work meets the highest safety standards and building regulations.",
        },
        {
          icon: "🏆",
          title: "15+ years experience",
          description:
            "Over 15 years of professional electrical experience serving homes and businesses across East Sussex.",
        },
        {
          icon: "⏰",
          title: "24/7 emergency service",
          description:
            "Round-the-clock emergency callout service for urgent electrical issues that cannot wait until morning.",
        },
        {
          icon: "👥",
          title: "1,000+ jobs completed",
          description:
            "Customer-focused service with a commitment to quality workmanship and complete satisfaction on every job.",
        },
      ],
    },

    cta: {
      heading: "Ready to Get Started?",
      subheading: `Available across ${siteConfig.business.address.city} and surrounding areas`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
      trustLine: "NICEIC Approved | 15+ years experience | £5M public liability",
    },
  },

  // -------------------------------------------------------------------------
  // About page
  // -------------------------------------------------------------------------
  about: {
    hero: {
      eyebrow: "About Us",
      heading: `About ${siteConfig.business.name}`,
      subheading: `Serving ${siteConfig.business.address.city} & East Sussex since ${siteConfig.credentials.yearEstablished}`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },

    content: {
      subheading: "Our Work",
      heading: "What sets us apart",
      body: "We are committed to delivering exceptional electrical service and value to every customer across Eastbourne and East Sussex.",
      listItems: [
        "Fully qualified and NICEIC approved electricians",
        "Comprehensive electrical services for all needs",
        "24/7 emergency callout service available",
        "Part P certified and fully insured with £5M cover",
      ],
    },

    values: {
      heading: "Our Core Values",
      intro: "What Drives Us",
      features: [
        {
          icon: "🏆",
          title: "Quality first",
          description:
            "We maintain the highest standards in everything we do, ensuring exceptional results for every project.",
        },
        {
          icon: "🛡️",
          title: "Professional excellence",
          description:
            "Our team is fully qualified and continuously trained to deliver professional service.",
        },
        {
          icon: "👥",
          title: "Reliable service",
          description:
            "We arrive on time, complete projects efficiently, and communicate clearly throughout.",
        },
        {
          icon: "⏰",
          title: "Customer focus",
          description:
            "Your satisfaction is our priority. We listen to your needs and deliver tailored solutions.",
        },
      ],
    },

    stats: {
      stats: [
        { value: "15+", label: "Years Electrical Expertise" },
        { value: "NICEIC", label: "Approved Contractor" },
        { value: "1000+", label: "Satisfied Customers" },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Contact page
  // -------------------------------------------------------------------------
  contact: {
    hero: {
      eyebrow: "Contact Us",
      heading: `Contact ${siteConfig.business.name}`,
      subheading: `Get in touch for a free quote or to discuss your electrical requirements. We serve ${siteConfig.serviceAreas.slice(0, 3).join(", ")} and surrounding areas.`,
      primaryCtaText: `Call ${PHONE_DISPLAY}`,
      primaryCtaHref: `tel:${PHONE_TEL}`,
      secondaryCtaText: "Email us",
      secondaryCtaHref: `mailto:${BUSINESS_EMAIL}`,
    },

    heading: "Get in touch",
    subheading:
      "We respond to enquiries within 2 working hours, and our emergency line is open 24/7.",
    email: BUSINESS_EMAIL,
    phoneDisplay: PHONE_DISPLAY,
    phoneTel: PHONE_TEL,
    address: {
      street: ADDRESS.street,
      locality: ADDRESS.locality,
      region: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
    },
    hours: {
      weekdays: siteConfig.business.hours.monday,
      saturday: siteConfig.business.hours.saturday,
      sunday: siteConfig.business.hours.sunday,
    },
    serviceLinks: siteConfig.services.slice(0, 5).map((s) => ({
      slug: s.slug,
      title: s.title,
    })),

    faqs: {
      heading: "Frequently asked questions",
      phoneDisplay: PHONE_DISPLAY,
      phoneTel: PHONE_TEL,
      faqs: [
        {
          question: "Do you offer free quotes?",
          answer:
            "Yes — every quote is free and obligation-free. We assess your requirements on-site or by phone and provide a clear, written breakdown before any work begins.",
        },
        {
          question: "How quickly can you attend an emergency?",
          answer:
            "Our emergency callout line is staffed 24/7. Typical response time across Eastbourne and surrounding areas is 1–2 hours.",
        },
        {
          question: "Are you NICEIC approved?",
          answer:
            "Yes. We are a NICEIC Approved Contractor and Part P registered, so all notifiable electrical work is certified and building-regulations compliant.",
        },
        {
          question: "Do you cover commercial as well as domestic work?",
          answer:
            "We do — from EICRs and PAT testing through to office fit-outs, three-phase installation, and ongoing maintenance contracts.",
        },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Services list page
  // -------------------------------------------------------------------------
  services: {
    hero: {
      eyebrow: "What We Do",
      heading: "Our Electrical Services",
      subheading: `Professional electrical services offered by ${siteConfig.business.name}. Quality work, competitive prices, and excellent customer service across ${siteConfig.business.address.city} and East Sussex.`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },

    heading: "All services",
    subheading:
      "Browse our full range of electrical services, from emergency callouts to smart home installations.",
    services: allServiceCards,

    featuredServices: [
      {
        title: "Emergency Callout",
        description:
          "24/7 emergency electrical service. Rapid response for urgent issues that cannot wait — we arrive fast and fix it right.",
        href: "/services/emergency-electrical-callout",
      },
      {
        title: "Safety Testing",
        description:
          "EICR certificates and comprehensive electrical safety inspections. Complete peace of mind for landlords, homeowners, and businesses.",
        href: "/services/electrical-safety-certificate",
      },
      {
        title: "Installations",
        description:
          "Professional installation of electrical systems and appliances, from consumer units to EV chargers and solar panels.",
        href: "/services#installation",
      },
    ],

    categories: [
      {
        imageSrc: "djfoxelectrical/categories/installation-category.jpg",
        imageAlt: "New electrical installations",
        category: "Installation",
        title: "Installation Services",
        href: "#installation-services",
      },
      {
        imageSrc: "djfoxelectrical/categories/maintenance-category.jpg",
        imageAlt: "Electrical maintenance and upgrades",
        category: "Maintenance",
        title: "Maintenance & Upgrades",
        href: "#maintenance-services",
      },
      {
        imageSrc: "djfoxelectrical/categories/repair-category.jpg",
        imageAlt: "Emergency electrical repairs",
        category: "Repair",
        title: "Repair & Emergency",
        href: "#repair-services",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Locations list page — FeatureGrid data shape
  // -------------------------------------------------------------------------
  locations: {
    heading: "Areas We Serve",
    intro: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(", ")}. Find our electrical services in your area.`,
    features: allLocationsFromConfig.map((l) => ({
      title: l.title,
      description: l.description,
    })),
  },

  // -------------------------------------------------------------------------
  // Reviews page
  // -------------------------------------------------------------------------
  reviews: {
    hero: {
      eyebrow: "Customer Reviews",
      heading: "What Our Clients Say",
      subheading: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses for professional electrical services.`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },

    heading: "What our customers say",
    subheading: "Real reviews from real customers across Eastbourne and East Sussex.",

    stats: {
      stats: [
        { value: "4.9", label: "Average rating", description: "Verified customer reviews" },
        { value: "100+", label: "Reviews" },
        { value: "100%", label: "Satisfaction" },
      ],
    },

    // testimonials loaded from MDX at build time
    testimonials: [],
  },

  // -------------------------------------------------------------------------
  // Projects page
  // -------------------------------------------------------------------------
  projects: {
    hero: {
      eyebrow: "Case Studies",
      heading: "Our Projects",
      subheading: `View our portfolio of completed electrical projects. From residential to commercial, see our work in action across ${siteConfig.serviceAreas.join(", ")}.`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },

    heading: "Recent projects",
    subheading:
      "A selection of our recent electrical work, from residential rewires to commercial fit-outs.",
    stats: [
      { value: "1,000+", label: "Jobs completed" },
      { value: "15+", label: "Years experience" },
      { value: "East Sussex", label: "Primary service area" },
    ],
    // projects loaded from MDX
    projects: [],
  },

  // -------------------------------------------------------------------------
  // Blog page
  // -------------------------------------------------------------------------
  blog: {
    hero: {
      eyebrow: "Blog",
      heading: "Industry Insights & Expert Tips",
      subheading: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team. Stay informed with professional advice and industry news.`,
      primaryCtaText: siteConfig.cta.primary.label,
      primaryCtaHref: siteConfig.cta.primary.href,
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },
    heading: "Latest articles",
    subheading:
      "Electrical guides, safety tips, and industry news from the D J Fox Electrical team.",
    // posts loaded from MDX
    posts: [],
  },

  // -------------------------------------------------------------------------
  // Pricing page — sourced from app/pricing/page.tsx
  // -------------------------------------------------------------------------
  pricing: {
    hero: {
      eyebrow: "Pricing",
      heading: "Transparent Pricing",
      subheading: "No hidden fees, clear costs, free quotes",
      primaryCtaText: "Request Free Quote",
      primaryCtaHref: "/contact",
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
    },

    emergencyBanner: {
      heading: "24/7 Emergency Callout",
      points: [
        { icon: "⏰", label: "Available 24/7" },
        { icon: "⚡", label: "1-2 Hour Response" },
        { icon: "✅", label: "£100 Callout Fee" },
      ],
      description: `Our £100 emergency callout fee includes up to 2 hours of labour. Additional work charged at standard rates. We respond urgently to electrical emergencies across ${siteConfig.business.address.city} and surrounding areas.`,
      ctaText: `Call Now: ${PHONE_DISPLAY}`,
      ctaHref: `tel:${PHONE_TEL}`,
    },

    rateCards: [
      {
        icon: "⏰",
        title: "Standard Work",
        price: "£45-65",
        unit: "per hour",
        description: "Planned electrical work during normal business hours",
      },
      {
        icon: "🚨",
        title: "Emergency Callout",
        price: "£100",
        unit: "includes 2 hours labour",
        description: "24/7 availability with rapid 1-2 hour response time",
        featured: true,
      },
      {
        icon: "🛡️",
        title: "Commercial Work",
        price: "£50-75",
        unit: "per hour",
        description: "Business premises, offices, and commercial installations",
      },
    ],

    jobCosts: {
      heading: "Example Job Costs",
      subheading:
        "Typical price ranges for common electrical work. Final quotes depend on specific requirements, property size, and complexity.",
      disclaimer:
        "Prices shown are indicative ranges based on typical installations. Final quotes depend on specific requirements, property access, existing installations, and materials needed. We always provide a free, detailed quote before starting work.",
      items: [
        {
          label: "Consumer Unit Upgrade",
          priceRange: "£400-800",
          icon: "🛡️",
        },
        {
          label: "Full House Rewire (3-bed)",
          priceRange: "£3,500-6,000",
          icon: "⚡",
        },
        {
          label: "EICR Certificate",
          priceRange: "£150-350",
          icon: "✅",
        },
        {
          label: "EV Charger Installation",
          priceRange: "£800-1,200",
          icon: "🔌",
        },
        {
          label: "Additional Sockets",
          priceRange: "£80-150 each",
          icon: "🔌",
        },
        {
          label: "LED Lighting Upgrade",
          priceRange: "£200-500 per room",
          icon: "💡",
        },
        {
          label: "Smart Home Wiring",
          priceRange: "£500-2,000",
          icon: "🏠",
        },
        {
          label: "Solar Panel Installation",
          priceRange: "£4,000-8,000",
          icon: "☀️",
        },
      ],
    },

    checklist: {
      heading: "Comprehensive Electrical System Check",
      image: "djfoxelectrical/sections/electrical-inspection.jpg",
      items: [
        "Consumer unit inspection and testing",
        "Circuit protection verification",
        "Socket and switch condition check",
        "Full safety compliance report",
        "Recommendations for any remedial work",
      ],
      body: "Our comprehensive electrical system checks ensure your home or business is safe and compliant with current electrical standards. Get peace of mind with a detailed report.",
    },

    benefits: {
      heading: `Why Choose ${siteConfig.business.name}?`,
      features: [
        {
          icon: "✅",
          title: "Transparent Pricing",
          description:
            "No hidden fees or surprise charges. We provide detailed quotes before starting any work.",
        },
        {
          icon: "🛡️",
          title: "NICEIC Approved",
          description:
            "Fully qualified and accredited electricians with £5M public liability insurance.",
        },
        {
          icon: "🔧",
          title: "Quality Workmanship",
          description:
            "15+ years of professional experience with meticulous attention to detail and safety.",
        },
        {
          icon: "📜",
          title: "Guaranteed Work",
          description:
            "All work guaranteed with comprehensive warranty and certification provided.",
        },
        {
          icon: "⏰",
          title: "24/7 Emergency Service",
          description:
            "Round-the-clock availability for urgent electrical issues with rapid response times.",
        },
        {
          icon: "📍",
          title: "Local & Reliable",
          description: `Based in ${siteConfig.business.address.city}, serving local communities with dependable service.`,
        },
      ],
    },

    faqs: {
      heading: "Pricing FAQs",
      phoneDisplay: PHONE_DISPLAY,
      phoneTel: PHONE_TEL,
      faqs: [
        {
          question: "Are quotes really free?",
          answer:
            "Yes — every quote is free and without obligation. We assess your needs and provide a clear written breakdown of costs before any work begins.",
        },
        {
          question: "Why is there a price range for most jobs?",
          answer:
            "Electrical work varies significantly based on property size, access, existing installations, materials, and the scope of additional work needed. We provide firm written quotes once we've assessed the specifics.",
        },
        {
          question: "What's included in the emergency callout fee?",
          answer:
            "The £100 fee includes up to 2 hours of on-site labour plus our 24/7 rapid response. Additional work beyond 2 hours is charged at our standard hourly rate, and any materials are quoted separately.",
        },
        {
          question: "Do you offer payment plans?",
          answer:
            "For larger installations such as rewires or solar, we can discuss staged payments. Speak to us when you receive your quote and we'll put something sensible in writing.",
        },
        {
          question: "Do you provide certificates?",
          answer:
            "Yes. All notifiable work is certified under Part P, and we issue EICRs, minor works certificates, and installation certificates as required.",
        },
      ],
    },

    cta: {
      heading: "Get Your Free Quote Today",
      subheading:
        "Request a detailed, no-obligation quote for your electrical project. We'll assess your requirements and provide transparent pricing.",
      primaryCtaText: "Request Free Quote",
      primaryCtaHref: "/contact",
      secondaryCtaText: `Call ${PHONE_DISPLAY}`,
      secondaryCtaHref: `tel:${PHONE_TEL}`,
      trustLine: `Serving ${siteConfig.business.address.city}, ${(
        siteConfig.serviceAreaRegions?.[0]?.towns ?? []
      )
        .slice(0, 3)
        .map((t) => t.name)
        .join(", ")} and surrounding areas`,
    },
  },

  // -------------------------------------------------------------------------
  // Privacy policy — TextSection data shape
  // Sourced from app/privacy-policy/page.tsx
  // -------------------------------------------------------------------------
  privacy: {
    heading: "Privacy Policy",
    lastUpdated: new Date().toISOString().slice(0, 10),
    tableOfContents: [
      { id: "data-controller", label: "Data Controller Information" },
      { id: "data-we-collect", label: "Data We Collect" },
      { id: "how-we-use", label: "How We Use Your Data" },
      { id: "legal-basis", label: "Legal Basis for Processing" },
      { id: "data-sharing", label: "Data Sharing & Third Parties" },
      { id: "data-retention", label: "Data Retention" },
      { id: "your-rights", label: "Your Rights" },
      { id: "cookies", label: "Cookies" },
      { id: "contact", label: "Contact & Complaints" },
    ],
    intro: `This policy explains how ${siteConfig.business.legalName} collects, uses, and protects your personal data when you interact with our services.`,
    sections: [
      {
        id: "data-controller",
        heading: "1. Data Controller Information",
        type: "two-col",
        items: [
          {
            label: "Business Name",
            description: siteConfig.business.legalName,
          },
          {
            label: "Address",
            description: `${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region} ${ADDRESS.postalCode}`,
          },
          {
            label: "Phone",
            description: PHONE_DISPLAY,
          },
          {
            label: "Email",
            description: BUSINESS_EMAIL,
          },
        ],
      },
      {
        id: "data-we-collect",
        heading: "2. Data We Collect",
        type: "callout-grid",
        items: [
          {
            label: "Contact Information",
            description:
              "Name, email address, phone number, and postal address when you contact us or request a quote.",
            color: "blue",
          },
          {
            label: "Project Information",
            description:
              "Details about your project requirements, property information, and service preferences.",
            color: "green",
          },
          {
            label: "Technical Data",
            description:
              "IP address, browser type, device information, and cookies when you visit our website.",
            color: "purple",
          },
          {
            label: "Communication Records",
            description:
              "Records of correspondence if you contact us, including emails and phone call notes.",
            color: "amber",
          },
        ],
      },
      {
        id: "how-we-use",
        heading: "3. How We Use Your Data",
        type: "list",
        items: [
          { label: "To respond to your enquiries and provide quotes" },
          { label: "To deliver our services and fulfil contracts" },
          { label: "To send service updates and communications" },
          { label: "To improve our website and services" },
          { label: "To comply with legal obligations" },
          { label: "To protect our legitimate business interests" },
        ],
      },
      {
        id: "legal-basis",
        heading: "4. Legal Basis for Processing",
        type: "two-col",
        items: [
          {
            label: "Contract",
            description: "Processing necessary to perform our services",
          },
          {
            label: "Legitimate Interest",
            description: "Business operations and service improvement",
          },
          {
            label: "Consent",
            description: "Marketing communications with your permission",
          },
          {
            label: "Legal Obligation",
            description: "Compliance with laws and regulations",
          },
        ],
      },
      {
        id: "data-sharing",
        heading: "5. Data Sharing & Third Parties",
        type: "list",
        items: [
          {
            label:
              "Service providers who assist our operations (e.g., IT support, payment processors)",
          },
          { label: "Professional advisors (accountants, lawyers) when required" },
          { label: "Regulatory authorities when legally required" },
        ],
      },
      {
        id: "data-retention",
        heading: "6. Data Retention",
        type: "table",
        items: [
          { label: "Quote enquiries", value: "2 years" },
          { label: "Customer records", value: "7 years after last service" },
          { label: "Financial records", value: "7 years (legal requirement)" },
          { label: "Marketing consent", value: "Until withdrawn" },
        ],
      },
      {
        id: "your-rights",
        heading: "7. Your Rights",
        type: "numbered-grid",
        items: [
          {
            label: "Right of Access",
            description: "Request copies of your personal data",
          },
          {
            label: "Right to Rectification",
            description: "Request correction of inaccurate data",
          },
          {
            label: "Right to Erasure",
            description: "Request deletion of your data",
          },
          {
            label: "Right to Restrict Processing",
            description: "Limit how we use your data",
          },
          {
            label: "Right to Data Portability",
            description: "Receive your data in a portable format",
          },
          {
            label: "Right to Object",
            description: "Object to certain types of processing",
          },
        ],
      },
      {
        id: "cookies",
        heading: "8. Cookies",
        type: "prose",
        body: "Our website uses cookies to enhance your experience. For detailed information about the cookies we use and how to manage them, please see our Cookie Policy.",
      },
      {
        id: "contact",
        heading: "9. Contact & Complaints",
        type: "two-col",
        items: [
          {
            label: "Contact Us",
            description: `For any questions about this privacy policy or our data practices: email ${BUSINESS_EMAIL} or call ${PHONE_DISPLAY}.`,
          },
          {
            label: "Supervisory Authority",
            description:
              "You have the right to lodge a complaint with the Information Commissioner's Office (ICO). Website: ico.org.uk. Helpline: 0303 123 1113.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cookie policy — TextSection data shape
  // Sourced from app/cookie-policy/page.tsx
  // -------------------------------------------------------------------------
  cookie: {
    heading: "Cookie Policy",
    lastUpdated: new Date().toISOString().slice(0, 10),
    tableOfContents: [
      { id: "what-are-cookies", label: "What Are Cookies?" },
      { id: "how-we-use", label: "How We Use Cookies" },
      { id: "cookie-categories", label: "Cookie Categories" },
      { id: "managing-cookies", label: "Managing Your Cookies" },
      { id: "third-party", label: "Third-Party Cookies" },
      { id: "contact", label: "Contact Us" },
    ],
    intro:
      'Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain until they expire or you delete them).',
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. What Are Cookies?",
        type: "prose",
        body: "Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. Cookies can be session cookies (deleted when you close your browser) or persistent cookies (remain until they expire or you delete them).",
      },
      {
        id: "how-we-use",
        heading: "2. How We Use Cookies",
        type: "list",
        items: [
          { label: "Remember your cookie consent preferences" },
          { label: "Understand how you use our website" },
          { label: "Improve our website performance" },
          { label: "Provide relevant content and advertisements" },
          { label: "Ensure website security" },
        ],
      },
      {
        id: "cookie-categories",
        heading: "3. Cookie Categories",
        type: "callout-grid",
        items: [
          {
            label: "Necessary Cookies",
            description: "Required for the website to function. Cannot be disabled.",
            color: "green",
          },
          {
            label: "Analytics Cookies",
            description: "Help us understand how visitors use our website.",
            color: "blue",
          },
          {
            label: "Marketing Cookies",
            description:
              "Used to deliver relevant advertisements and track campaign effectiveness.",
            color: "purple",
          },
        ],
      },
      {
        id: "cookie-reference",
        heading: "Cookie Reference",
        type: "table",
        items: [
          { label: "cookie_consent", value: "Stores your cookie preferences — 1 year" },
          { label: "csrf_token", value: "Security token for form submissions — Session" },
          { label: "_ga", value: "Google Analytics — distinguishes users — 2 years" },
          { label: "_ga_*", value: "Google Analytics — stores session state — 2 years" },
          { label: "_fbp", value: "Facebook Pixel — tracks conversions — 90 days" },
          { label: "gclid", value: "Google Ads — tracks ad clicks — 90 days" },
        ],
      },
      {
        id: "managing-cookies",
        heading: "4. Managing Your Cookies",
        type: "list",
        items: [
          {
            label:
              "Consent Banner: when you first visit our site, you can choose which cookie categories to accept.",
          },
          { label: "Chrome: Settings > Privacy and Security > Cookies" },
          { label: "Firefox: Options > Privacy & Security > Cookies" },
          { label: "Safari: Preferences > Privacy > Cookies" },
          { label: "Edge: Settings > Privacy, Search, and Services > Cookies" },
          { label: "Note: Blocking all cookies may affect website functionality." },
        ],
      },
      {
        id: "third-party",
        heading: "5. Third-Party Cookies",
        type: "two-col",
        items: [
          {
            label: "Google Analytics",
            description:
              "Website analytics to understand visitor behaviour. See Google's Privacy Policy at policies.google.com/privacy.",
          },
          {
            label: "Facebook Pixel",
            description:
              "Advertising and conversion tracking. See Facebook's Privacy Policy at facebook.com/privacy/explanation.",
          },
        ],
      },
      {
        id: "contact",
        heading: "6. Contact Us",
        type: "prose",
        body: `If you have questions about our use of cookies, please contact us at ${BUSINESS_EMAIL}. For more information about how we handle your personal data, please see our Privacy Policy.`,
      },
    ],
  },
};
