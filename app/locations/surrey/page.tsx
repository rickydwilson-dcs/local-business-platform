import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layouts/page-layout";
import { HeroSection } from "@/components/ui/hero-section";
import { LargeFeatureCards } from "@/components/ui/large-feature-cards";
import { ServiceShowcase } from "@/components/ui/service-showcase";
import { CTASection } from "@/components/ui/cta-section";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Schema from "@/components/Schema";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Scaffolding Across Surrey | Colossus Scaffolding",
  description: "Expert scaffolding services across all Surrey towns. Local specialists covering Guildford, Woking, Epsom, Kingston and 6+ locations with county-wide capabilities.",
  keywords: "Surrey scaffolding, county scaffolding services, Guildford scaffolding, Woking scaffolding, Epsom scaffolding, Kingston scaffolding",
  openGraph: {
    title: "Professional Scaffolding Across Surrey | Colossus Scaffolding",
    description: "Expert scaffolding services across all Surrey towns. Local specialists covering Guildford, Woking, Epsom, Kingston and 6+ locations with county-wide capabilities.",
    url: absUrl("/locations/surrey"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Professional scaffolding services across Surrey - Colossus Scaffolding"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Across Surrey | Colossus Scaffolding",
    description: "Expert scaffolding services across all Surrey towns. Local specialists covering Guildford, Woking, Epsom, Kingston and 6+ locations with county-wide capabilities."
  },
  alternates: {
    canonical: absUrl("/locations/surrey")
  }
};

const surreyTowns = [
  { name: "Guildford", slug: "guildford", description: "Cathedral city & university town", established: true },
  { name: "Woking", slug: "woking", description: "Commercial & residential hub", established: true },
  { name: "Epsom", slug: "epsom", description: "Historic town & racecourse", established: true },
  { name: "Kingston upon Thames", slug: "kingston-upon-thames", description: "Market town specialist", established: true },
  { name: "Redhill", slug: "redhill", description: "Transport gateway", established: true },
  { name: "Camberley", slug: "camberley", description: "Military town specialist", established: true }
];

const heroData = {
  title: "Professional Scaffolding Across Surrey",
  description: "County-wide scaffolding expertise covering 6+ Surrey towns. From Guildford's cathedral heritage to Woking's modern developments, we deliver specialist solutions with deep local knowledge.",
  phone: "01424 466 661",
  trustBadges: ["TG20:21 Compliant", "MOD Approved", "County Coverage"],
  ctaText: "Get Your Free Surrey Quote",
  ctaUrl: "/contact"
};

const countyCapabilities = {
  title: "Surrey Scaffolding Specialists",
  description: "Comprehensive county-wide capabilities with specialized expertise across Surrey's affluent towns, heritage sites, and modern commercial developments.",
  columns: 3 as const,
  backgroundColor: "gray" as const,
  showBottomCTA: false,
  cards: [
    {
      title: "Heritage & Ecclesiastical",
      description: "Specialist scaffolding for Surrey's historic sites including Guildford Cathedral, medieval churches, and Georgian architecture across the county's affluent towns.",
      details: [
        "Cathedral scaffolding",
        "Listed building expertise",
        "Georgian architecture",
        "Heritage consultation"
      ]
    },
    {
      title: "High-End Residential",
      description: "Premium scaffolding solutions for Surrey's luxury residential market, from period properties to contemporary developments in leafy commuter towns.",
      details: [
        "Premium service standards",
        "Discreet installations",
        "Luxury home expertise",
        "Commuter town specialists"
      ]
    },
    {
      title: "Commercial & Defence",
      description: "Specialist scaffolding for Surrey's business parks, defence facilities around Aldershot periphery, and major commercial developments across the M25 corridor.",
      details: [
        "MOD security clearance",
        "Business park expertise",
        "Commercial installations",
        "M25 corridor projects"
      ]
    }
  ]
};

const countyServices = {
  title: "County-Wide Project Capabilities",
  description: "Specialist scaffolding services designed for Surrey's unique blend of heritage architecture, luxury residential developments, and modern commercial facilities.",
  cards: [
    {
      title: "Premium Residential",
      description: "High-end scaffolding solutions for Surrey's prestigious residential areas, with discreet installations and premium service standards for luxury properties.",
      href: "/services/residential-scaffolding",
      features: [
        "Luxury property expertise",
        "Discreet installations",
        "Premium materials",
        "Concierge-level service"
      ]
    },
    {
      title: "Heritage Scaffolding",
      description: "Specialized systems for Surrey's historic buildings, from Norman churches to Georgian mansions, with expert knowledge of conservation requirements.",
      href: "/services/heritage-scaffolding",
      features: [
        "Cathedral expertise",
        "Listed building compliance",
        "Georgian specialists",
        "Conservation liaison"
      ]
    },
    {
      title: "Commercial & Business",
      description: "Professional scaffolding for Surrey's thriving business sector, from modern office developments to established business parks across the county.",
      href: "/services/commercial-scaffolding",
      features: [
        "Business park access",
        "Office developments",
        "Minimal disruption",
        "Flexible scheduling"
      ]
    }
  ]
};

const ctaData = {
  title: "Ready to Start Your Surrey Project?",
  description: "Contact our Surrey scaffolding specialists for expert solutions across the county. From heritage projects in Guildford to luxury residential work in Epsom.",
  primaryButtonText: "Get Free Surrey Quote",
  primaryButtonUrl: "/contact",
  secondaryButtonText: "View All Services",
  secondaryButtonUrl: "/services",
  trustBadges: ["Free Quotes", "24/7 Support", "County Coverage"]
};

const breadcrumbItems = [
  { name: "Locations", href: "/locations" },
  { name: "Surrey", href: "/locations/surrey", current: true }
];

const schemaData = {
  service: {
    id: "/locations/surrey#service",
    url: "/locations/surrey",
    name: "Scaffolding Services in Surrey",
    description: "Professional scaffolding services across Surrey including Guildford, Woking, Epsom, Kingston and 6+ locations. Heritage and luxury residential specialists with county-wide capabilities.",
    serviceType: "Scaffolding",
    areaServed: ["Surrey", "Guildford", "Woking", "Epsom", "Kingston upon Thames", "Redhill", "Camberley"]
  }
};

const faqData = [
  {
    question: "Which Surrey towns do you cover?",
    answer: "We provide scaffolding services across all major Surrey towns including Guildford, Woking, Epsom, Kingston upon Thames, Redhill, and Camberley. Full county coverage available for residential and commercial projects."
  },
  {
    question: "Do you specialize in high-end residential projects in Surrey?",
    answer: "Yes, we specialize in premium residential scaffolding across Surrey's affluent areas. Our service includes discreet installations, premium materials, and concierge-level project management for luxury properties."
  },
  {
    question: "Can you work on heritage buildings like Guildford Cathedral?",
    answer: "Absolutely. We have extensive experience with Surrey's historic buildings including cathedral work. Our team understands conservation requirements and heritage planning processes across the county."
  },
  {
    question: "Do you handle MOD and defence facility projects in Surrey?",
    answer: "Yes, our team holds appropriate MOD security clearances and has experience working on defence-related facilities in and around Surrey, particularly in the Aldershot periphery area."
  }
];

export default function SurreyPage() {
  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        <div className="bg-gray-50 border-b">
          <div className="container-standard py-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <HeroSection
          title={heroData.title}
          description={heroData.description}
          phone={heroData.phone}
          trustBadges={heroData.trustBadges}
          ctaText={heroData.ctaText}
          ctaUrl={heroData.ctaUrl}
        />

        <LargeFeatureCards
          title={countyCapabilities.title}
          description={countyCapabilities.description}
          cards={countyCapabilities.cards}
          columns={countyCapabilities.columns}
          backgroundColor={countyCapabilities.backgroundColor}
          showBottomCTA={countyCapabilities.showBottomCTA}
        />

        <ServiceShowcase
          title={countyServices.title}
          description={countyServices.description}
          services={countyServices.cards}
        />

        {/* Surrey Towns Directory */}
        <section className="py-16 bg-white">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Surrey Towns We Serve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Local specialists in every Surrey town. Click through to your specific location for detailed local knowledge and project examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surreyTowns.map((town) => (
                <Link
                  key={town.slug}
                  href={`/locations/${town.slug}`}
                  className="group p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-blue mb-2">
                    {town.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {town.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Local Specialists
                    </span>
                    <svg className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title={ctaData.title}
          description={ctaData.description}
          primaryButtonText={ctaData.primaryButtonText}
          primaryButtonUrl={ctaData.primaryButtonUrl}
          secondaryButtonText={ctaData.secondaryButtonText}
          secondaryButtonUrl={ctaData.secondaryButtonUrl}
          trustBadges={ctaData.trustBadges}
        />
      </div>

      <Schema
        service={schemaData.service}
        faqs={faqData}
        breadcrumbs={breadcrumbItems.map(b => ({ name: b.name, url: b.href }))}
      />
    </PageLayout>
  );
}