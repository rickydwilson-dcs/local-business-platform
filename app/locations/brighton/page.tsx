import { Metadata } from "next"
import { PageLayout } from "@/components/layouts/page-layout"
import { HeroSection } from "@/components/ui/hero-section"
import { LargeFeatureCards } from "@/components/ui/large-feature-cards"
import { ServiceCards } from "@/components/ui/service-cards"
import { CapabilityShowcase } from "@/components/ui/capability-showcase"
import { PricingPackages } from "@/components/ui/pricing-packages"
import { LocalAuthorityExpertise } from "@/components/ui/local-authority-expertise"
import { LocationFAQ } from "@/components/ui/location-faq"
import { CTASection } from "@/components/ui/cta-section"
import Breadcrumbs from "@/components/ui/breadcrumbs"
import Schema from "@/components/Schema"

export const metadata: Metadata = {
  title: "Brighton Scaffolding Services | Colossus Scaffolding",
  description: "Professional scaffolding in Brighton - seafront projects, Victorian terraces, commercial developments. TG20:21 compliant, fully insured. Free quotes 24/7.",
  keywords: "scaffolding brighton, brighton scaffolding hire, scaffolders in brighton, seafront scaffolding, victorian terrace scaffolding, heritage scaffolding brighton",
  openGraph: {
    title: "Professional Scaffolding Services in Brighton | Colossus Scaffolding",
    description: "Expert scaffolding for Brighton's unique architectural challenges. From Victorian terraces to modern seafront developments. TG20:21 compliant, fully insured.",
    url: "https://colossus-scaffolding.vercel.app/locations/brighton",
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: "https://colossus-scaffolding.vercel.app/brighton-scaffolding.jpg",
        width: 1200,
        height: 630,
        alt: "Professional scaffolding services in Brighton - Victorian terraces and seafront properties"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Services in Brighton | Colossus Scaffolding",
    description: "Expert scaffolding for Brighton's unique architectural challenges. From Victorian terraces to modern seafront developments."
  }
}

export default function BrightonPage() {
  // Brighton Specialist Capabilities
  const brightonSpecialists = {
    title: "Brighton Scaffolding Specialists",
    description: "Three decades of local experience serving Brighton's unique architectural and environmental challenges.",
    columns: 3 as const,
    backgroundColor: 'gray' as const,
    showBottomCTA: false,
    cards: [
      {
        title: "Historic Brighton",
        description: "Specialist scaffolding for listed buildings in The Lanes and conservation areas. Expert knowledge of heritage requirements and planning permissions.",
        details: [
          "Listed building compliance",
          "Conservation area expertise",
          "Heritage-sensitive solutions"
        ]
      },
      {
        title: "Coastal Engineering",
        description: "Marine-grade scaffolding designed for Brighton's seafront properties. Wind-resistant systems and salt-corrosion protection.",
        details: [
          "Wind-resistant design",
          "Salt corrosion protection",
          "Seafront specialist"
        ]
      },
      {
        title: "Development Support",
        description: "Supporting Brighton's growing student housing and residential developments with comprehensive scaffolding solutions.",
        details: [
          "Multi-story expertise",
          "Student housing projects",
          "Residential developments"
        ]
      }
    ]
  }

  // Complete Scaffolding Services Cards
  const brightonServices = {
    title: "Complete Scaffolding Services",
    description: "From residential extensions to major commercial developments, we provide comprehensive scaffolding solutions across Brighton.",
    cards: [
      {
        title: "Commercial Scaffolding",
        subtitle: "Churchill Square, Brighton Marina",
        description: "Office buildings, retail spaces, and commercial developments across Brighton.",
        features: [
          "High-rise access",
          "Complex structures",
          "Project management",
          "Safety compliance"
        ],
        href: "/contact",
        ctaText: "Get Quote for Commercial Scaffolding"
      },
      {
        title: "Residential Scaffolding",
        subtitle: "Victorian terraces, seafront properties",
        description: "House extensions, roof repairs, and maintenance for Brighton homes.",
        features: [
          "Loft conversions",
          "Roof repairs",
          "Extensions",
          "Maintenance access"
        ],
        href: "/contact",
        ctaText: "Get Quote for Residential Scaffolding"
      },
      {
        title: "Industrial Access",
        subtitle: "Brighton industrial estates",
        description: "Heavy-duty scaffolding for industrial facilities and manufacturing sites.",
        features: [
          "Heavy-duty systems",
          "Specialized access",
          "Long-term hire",
          "Custom solutions"
        ],
        href: "/contact",
        ctaText: "Get Quote for Industrial Access"
      },
      {
        title: "Emergency Scaffolding",
        subtitle: "Storm damage, urgent repairs",
        description: "24/7 emergency scaffolding for urgent structural support needs.",
        features: [
          "24/7 availability",
          "Rapid response",
          "Structural support",
          "Weather protection"
        ],
        href: "/contact",
        ctaText: "Get Quote for Emergency Scaffolding"
      },
      {
        title: "Event Scaffolding",
        subtitle: "Brighton Festival, seafront events",
        description: "Temporary structures for festivals, concerts, and public events.",
        features: [
          "Event platforms",
          "Viewing stands",
          "Temporary stages",
          "Crowd barriers"
        ],
        href: "/contact",
        ctaText: "Get Quote for Event Scaffolding"
      },
      {
        title: "Maintenance Access",
        subtitle: "Council buildings, schools",
        description: "Ongoing maintenance scaffolding for building upkeep and repairs.",
        features: [
          "Long-term contracts",
          "Flexible access",
          "Maintenance programs",
          "Cost-effective"
        ],
        href: "/contact",
        ctaText: "Get Quote for Maintenance Access"
      }
    ]
  }

  // What We Can Deliver - Capability Showcase
  const brightonCapabilityShowcase = {
    title: "What We Can Deliver",
    description: "From complex heritage projects to modern developments, our capabilities span Brighton's diverse architectural landscape.",
    capabilities: [
      {
        title: "Multi-Story Residential",
        subtitle: "2-4 weeks setup",
        description: "Complete scaffolding solutions for Brighton's growing apartment developments and student housing projects.",
        features: [
          "Up to 15 stories",
          "Complex geometries",
          "Phased installation"
        ]
      },
      {
        title: "Heritage Restoration",
        subtitle: "1-2 weeks setup",
        description: "Specialist scaffolding for Brighton's listed buildings and conservation projects in The Lanes and seafront.",
        features: [
          "Listed building approved",
          "Minimal visual impact",
          "Heritage compliance"
        ]
      },
      {
        title: "Commercial Developments",
        subtitle: "3-6 weeks setup",
        description: "Large-scale scaffolding for Brighton's commercial district including retail and office developments.",
        features: [
          "Complex access routes",
          "Pedestrian protection",
          "Phased construction"
        ]
      },
      {
        title: "Seafront Properties",
        subtitle: "1-3 weeks setup",
        description: "Marine-grade scaffolding designed for Brighton's challenging coastal environment and weather conditions.",
        features: [
          "Wind-resistant design",
          "Salt corrosion protection",
          "Tidal considerations"
        ]
      }
    ]
  }

  const brightonPricing = {
    title: "Brighton Scaffolding Costs & Estimates",
    description: "Typical Brighton Project Investment",
    packages: [
      {
        name: "Domestic Projects",
        description: "Perfect for house extensions, roof repairs, and maintenance work on Brighton homes.",
        price: "£900 - £1,350",
        duration: "6-8 weeks typical",
        features: [
          { text: "Standard domestic setup", included: true },
          { text: "Basic access platforms", included: true },
          { text: "Weekly safety inspections", included: true },
          { text: "Public liability insurance", included: true },
          { text: "Local permit handling", included: true }
        ],
        ctaText: "Get Free Quote",
        ctaUrl: "/contact"
      },
      {
        name: "Commercial Projects",
        description: "Comprehensive scaffolding for Brighton's commercial developments and office buildings.",
        price: "£2,500 - £8,000",
        duration: "8-16 weeks typical",
        popular: true,
        features: [
          { text: "Complex access solutions", included: true },
          { text: "Pedestrian protection", included: true },
          { text: "Phased installation", included: true },
          { text: "Advanced safety systems", included: true },
          { text: "Project management included", included: true }
        ],
        ctaText: "Get Free Quote",
        ctaUrl: "/contact"
      },
      {
        name: "Heritage & Specialist",
        description: "Specialist scaffolding for Brighton's listed buildings and conservation projects.",
        price: "£1,800 - £5,500",
        duration: "4-12 weeks typical",
        features: [
          { text: "Heritage compliance", included: true },
          { text: "Minimal visual impact", included: true },
          { text: "Conservation area approved", included: true },
          { text: "Specialist materials", included: true },
          { text: "Expert consultation", included: true }
        ],
        ctaText: "Get Free Quote",
        ctaUrl: "/contact"
      }
    ]
  }

  // Local Authority Expertise
  const brightonLocalAuthority = {
    title: "Complete Brighton Coverage",
    description: "Serving all areas of Brighton & Hove with deep local knowledge and area-specific expertise.",
    locationName: "Brighton",
    authorityName: "Brighton & Hove City Council",
    expertiseItems: [
      {
        title: "Brighton & Hove City Council planning procedures",
        description: "Expert knowledge of local planning processes and requirements"
      },
      {
        title: "Conservation area requirements and restrictions",
        description: "Understanding heritage constraints and sensitive area protocols"
      },
      {
        title: "Seafront development regulations",
        description: "Specialized knowledge of coastal development requirements"
      },
      {
        title: "Listed building consent processes",
        description: "Experience with heritage building permissions and constraints"
      },
      {
        title: "Highway authority permit applications",
        description: "Efficient processing of street works and highway permits"
      },
      {
        title: "Environmental impact assessments",
        description: "Comprehensive environmental consideration and compliance"
      }
    ],
    supportItems: [
      {
        title: "Fast-Track Applications",
        description: "Our established relationships with council departments mean faster processing times for your permits."
      },
      {
        title: "Compliance Guarantee",
        description: "All our scaffolding installations meet or exceed Brighton & Hove City Council safety standards."
      }
    ]
  }

  const brightonFAQs = {
    title: "Brighton Scaffolding FAQ",
    location: "Brighton",
    items: [
      {
        question: "How quickly can you start a scaffolding project in Brighton?",
        answer: "We typically provide detailed quotations within 24 hours of site survey and can often arrange same-day or next-day surveys for Brighton properties."
      },
      {
        question: "Do you handle planning permissions for Brighton scaffolding?",
        answer: "Yes, we handle all Brighton & Hove City Council applications, including complex seafront and conservation area submissions."
      },
      {
        question: "What makes your scaffolding suitable for Brighton's coastal environment?",
        answer: "Our scaffolding designs include enhanced wind loading calculations specifically for Brighton's coastal environment. We use corrosion-resistant materials and provide comprehensive weather monitoring throughout projects."
      },
      {
        question: "How much does scaffolding cost for a typical Brighton house?",
        answer: "Domestic projects typically range from £900-£1,350 for 6-8 weeks, depending on the size and complexity of your Brighton property."
      },
      {
        question: "Are you qualified to work on Brighton's historic buildings?",
        answer: "Yes, we specialize in heritage scaffolding and regularly coordinate with English Heritage, conservation officers, and planning departments on Brighton's historic properties."
      },
      {
        question: "What insurance and safety certifications do you have?",
        answer: "We carry £10 million public liability insurance and all installations are TG20:21 compliant with CISRS qualified teams."
      },
      {
        question: "Can you work around Brighton's busy streets and pedestrian areas?",
        answer: "Yes, we have extensive experience with street works permits and pedestrian protection systems for Brighton's busy areas."
      },
      {
        question: "Do you offer emergency scaffolding services in Brighton?",
        answer: "Yes, we provide 24/7 emergency scaffolding services subject to availability for urgent make-safe work across Brighton."
      }
    ]
  }

  const brightonCTA = {
    title: "Ready to Start Your Project?",
    description: "Contact our expert team for professional scaffolding services in Brighton. Free quotes and rapid response times across the area.",
    primaryButtonText: "Get Free Quote",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Call: 01424 466661",
    secondaryButtonUrl: "tel:01424466661",
    trustBadges: ["TG20:21 Compliant", "CHAS Accredited", "£10M Insured"]
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/locations" },
    { name: "Brighton", href: "/locations/brighton", current: true },
  ]

  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        <div className="bg-gray-50 border-b">
          <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
        <HeroSection
          title="Professional Scaffolding in Brighton"
          description="From Victorian terraces in The Lanes to modern seafront developments, we have the expertise to handle Brighton's unique architectural and coastal challenges."
          phone="01424 466 661"
          trustBadges={["TG20:21 Compliant", "CHAS Accredited", "Heritage Specialists"]}
          ctaText="Get Your Free Brighton Quote"
          ctaUrl="/contact"
        />

        <LargeFeatureCards {...brightonSpecialists} />

        <ServiceCards {...brightonServices} />

        <CapabilityShowcase {...brightonCapabilityShowcase} />

        <PricingPackages {...brightonPricing} />

        <LocalAuthorityExpertise {...brightonLocalAuthority} />

        <LocationFAQ {...brightonFAQs} />

        <CTASection {...brightonCTA} />
      </div>
      <Schema
        service={{
          id: "brighton-scaffolding",
          name: "Brighton Scaffolding Services",
          description: "Professional scaffolding services in Brighton covering seafront properties, Victorian terraces, and modern developments. TG20:21 compliant with full insurance coverage.",
          url: "/locations/brighton",
          serviceType: "Scaffolding Services",
          areaServed: ["Brighton", "Brighton & Hove", "Hove", "Rottingdean", "Saltdean"]
        }}
        faqs={brightonFAQs.items}
        breadcrumbs={breadcrumbs.map(b => ({ name: b.name, url: b.href }))}
      />
    </PageLayout>
  )
}