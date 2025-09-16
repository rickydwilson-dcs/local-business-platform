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
  title: "Professional Scaffolding Across West Sussex | Colossus Scaffolding",
  description: "Expert scaffolding services across all West Sussex towns. Local specialists covering Crawley, Worthing, Horsham, Chichester and 8+ locations with county-wide capabilities.",
  keywords: "West Sussex scaffolding, county scaffolding services, Crawley scaffolding, Worthing scaffolding, Horsham scaffolding, Chichester scaffolding",
  openGraph: {
    title: "Professional Scaffolding Across West Sussex | Colossus Scaffolding",
    description: "Expert scaffolding services across all West Sussex towns. Local specialists covering Crawley, Worthing, Horsham, Chichester and 8+ locations with county-wide capabilities.",
    url: absUrl("/locations/west-sussex"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Professional scaffolding services across West Sussex - Colossus Scaffolding"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Across West Sussex | Colossus Scaffolding",
    description: "Expert scaffolding services across all West Sussex towns. Local specialists covering Crawley, Worthing, Horsham, Chichester and 8+ locations with county-wide capabilities."
  },
  alternates: {
    canonical: absUrl("/locations/west-sussex")
  }
};

const westSussexTowns = [
  { name: "Crawley", slug: "crawley", description: "New town & airport projects", established: true },
  { name: "Worthing", slug: "worthing", description: "Seafront & Victorian specialist", established: true },
  { name: "Horsham", slug: "horsham", description: "Market town developments", established: true },
  { name: "Chichester", slug: "chichester", description: "Cathedral city heritage", established: true },
  { name: "Littlehampton", slug: "littlehampton", description: "Coastal & residential", established: true },
  { name: "Bognor Regis", slug: "bognor-regis", description: "Seaside town projects", established: true },
  { name: "Burgess Hill", slug: "burgess-hill", description: "Development hub", established: true },
  { name: "Haywards Heath", slug: "haywards-heath", description: "Commuter town specialist", established: true }
];

const heroData = {
  title: "Professional Scaffolding Across West Sussex",
  description: "County-wide scaffolding expertise covering 8+ West Sussex towns. From Crawley's commercial developments to Chichester's cathedral heritage, we deliver specialist solutions with deep local knowledge.",
  phone: "01424 466 661",
  trustBadges: ["TG20:21 Compliant", "Airport Approved", "County Coverage"],
  ctaText: "Get Your Free West Sussex Quote",
  ctaUrl: "/contact"
};

const countyCapabilities = {
  title: "West Sussex Scaffolding Specialists",
  description: "Comprehensive county-wide capabilities with specialized expertise across West Sussex's diverse industrial, coastal, and heritage environments.",
  columns: 3,
  backgroundColor: "gray" as const,
  showBottomCTA: false,
  cards: [
    {
      title: "Industrial & Aviation",
      description: "Specialist scaffolding for West Sussex's major industrial sites including Gatwick Airport periphery, manufacturing facilities, and distribution centers around Crawley.",
      details: [
        "Airport security clearance",
        "Industrial compliance",
        "Large-scale installations",
        "24/7 availability"
      ]
    },
    {
      title: "Heritage & Conservation",
      description: "Expert scaffolding for West Sussex's historic sites including Chichester Cathedral, Arundel Castle vicinity, and numerous listed buildings across market towns.",
      details: [
        "Cathedral scaffolding",
        "Listed building expertise",
        "Conservation sensitivity",
        "Heritage planning"
      ]
    },
    {
      title: "Coastal Engineering",
      description: "Marine-grade scaffolding solutions for West Sussex's coastline from Bognor Regis to Littlehampton, designed for sea spray and wind exposure.",
      details: [
        "Coastal corrosion protection",
        "Wind-resistant design",
        "Seafront access",
        "Marine-grade materials"
      ]
    }
  ]
};

const countyServices = {
  title: "County-Wide Project Capabilities",
  description: "Specialist scaffolding services designed for West Sussex's unique blend of industrial development, heritage sites, and coastal challenges.",
  cards: [
    {
      title: "Commercial & Industrial",
      description: "Large-scale scaffolding for West Sussex's major commercial and industrial developments, from Gatwick area logistics to coastal manufacturing.",
      href: "/services/commercial-scaffolding",
      features: [
        "High-access solutions",
        "Industrial compliance",
        "Project coordination",
        "24/7 scheduling"
      ]
    },
    {
      title: "Heritage Scaffolding",
      description: "Specialized systems for West Sussex's historic buildings, from Norman churches to Georgian market squares in Chichester and Horsham.",
      href: "/services/heritage-scaffolding",
      features: [
        "Cathedral expertise",
        "Listed building compliance",
        "Minimal impact systems",
        "Heritage consultation"
      ]
    },
    {
      title: "Residential Development",
      description: "Supporting West Sussex's growing residential developments with scalable scaffolding solutions across multiple sites and project phases.",
      href: "/services/residential-scaffolding",
      features: [
        "Multi-phase coordination",
        "Development support",
        "Suburban access",
        "Community liaison"
      ]
    }
  ]
};

const ctaData = {
  title: "Ready to Start Your West Sussex Project?",
  description: "Contact our West Sussex scaffolding specialists for expert solutions across the county. From industrial projects in Crawley to heritage work in Chichester.",
  primaryButtonText: "Get Free West Sussex Quote",
  primaryButtonUrl: "/contact",
  secondaryButtonText: "View All Services",
  secondaryButtonUrl: "/services",
  trustBadges: ["Free Quotes", "24/7 Support", "County Coverage"]
};

const breadcrumbItems = [
  { name: "Locations", href: "/locations" },
  { name: "West Sussex", href: "/locations/west-sussex", current: true }
];

const schemaData = {
  service: {
    id: "/locations/west-sussex#service",
    url: "/locations/west-sussex",
    name: "Scaffolding Services in West Sussex",
    description: "Professional scaffolding services across West Sussex including Crawley, Worthing, Horsham, Chichester and 8+ locations. Industrial and heritage specialists with county-wide capabilities.",
    serviceType: "Scaffolding",
    areaServed: ["West Sussex", "Crawley", "Worthing", "Horsham", "Chichester", "Littlehampton", "Bognor Regis", "Burgess Hill", "Haywards Heath"]
  }
};

const faqData = [
  {
    question: "Which West Sussex towns do you cover?",
    answer: "We provide scaffolding services across all major West Sussex towns including Crawley, Worthing, Horsham, Chichester, Littlehampton, Bognor Regis, Burgess Hill, and Haywards Heath. Full county coverage available."
  },
  {
    question: "Do you work near Gatwick Airport in West Sussex?",
    answer: "Yes, we have extensive experience working in the Gatwick Airport periphery area around Crawley. Our team holds appropriate security clearances and understands aviation industry requirements."
  },
  {
    question: "Can you handle heritage buildings like Chichester Cathedral?",
    answer: "Absolutely. We specialize in heritage scaffolding across West Sussex, including work on and around major historic sites. Our team has extensive experience with cathedral scaffolding and conservation requirements."
  },
  {
    question: "Do you coordinate multi-site projects across West Sussex?",
    answer: "Yes, we regularly manage multi-location projects across West Sussex, providing unified project management for developers and contractors working county-wide with optimized resource allocation."
  }
];

export default function WestSussexPage() {
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

        {/* West Sussex Towns Directory */}
        <section className="py-16 bg-white">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                West Sussex Towns We Serve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Local specialists in every West Sussex town. Click through to your specific location for detailed local knowledge and project examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {westSussexTowns.map((town) => (
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