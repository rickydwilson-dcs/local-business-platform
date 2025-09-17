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
  title: "Professional Scaffolding Across Kent | Colossus Scaffolding",
  description: "Expert scaffolding services across all Kent towns. Local specialists covering Maidstone, Canterbury, Tunbridge Wells, Ashford and 9+ locations with county-wide capabilities.",
  keywords: "Kent scaffolding, county scaffolding services, Maidstone scaffolding, Canterbury scaffolding, Dover scaffolding, Folkestone scaffolding",
  openGraph: {
    title: "Professional Scaffolding Across Kent | Colossus Scaffolding",
    description: "Expert scaffolding services across all Kent towns. Local specialists covering Maidstone, Canterbury, Tunbridge Wells, Ashford and 9+ locations with county-wide capabilities.",
    url: absUrl("/locations/kent"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Professional scaffolding services across Kent - Colossus Scaffolding"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Across Kent | Colossus Scaffolding",
    description: "Expert scaffolding services across all Kent towns. Local specialists covering Maidstone, Canterbury, Tunbridge Wells, Ashford and 9+ locations with county-wide capabilities."
  },
  alternates: {
    canonical: absUrl("/locations/kent")
  }
};

const kentTowns = [
  { name: "Maidstone", slug: "maidstone", description: "County town & commercial hub", established: true },
  { name: "Canterbury", slug: "canterbury", description: "Cathedral city heritage", established: true },
  { name: "Tunbridge Wells", slug: "tunbridge-wells", description: "Royal spa town specialist", established: true },
  { name: "Ashford", slug: "ashford", description: "High-speed rail hub", established: true },
  { name: "Folkestone", slug: "folkestone", description: "Channel port specialist", established: true },
  { name: "Dover", slug: "dover", description: "Port & heritage projects", established: true },
  { name: "Margate", slug: "margate", description: "Coastal regeneration", established: true },
  { name: "Sevenoaks", slug: "sevenoaks", description: "Commuter belt specialist", established: true },
  { name: "Dartford", slug: "dartford", description: "Industrial & logistics", established: true }
];

const heroData = {
  title: "Professional Scaffolding Across Kent",
  description: "County-wide scaffolding expertise covering 9+ Kent towns. From Canterbury's cathedral heritage to Dover's port infrastructure, we deliver specialist solutions with deep local knowledge.",
  phone: "01424 466 661",
  trustBadges: ["TG20:21 Compliant", "Heritage Specialists", "Port Approved"],
  ctaText: "Get Your Free Kent Quote",
  ctaUrl: "/contact"
};

const countyCapabilities = {
  title: "Kent Scaffolding Specialists",
  description: "Comprehensive county-wide capabilities with specialized expertise across Kent's diverse heritage sites, modern infrastructure, and industrial developments.",
  columns: 3 as const,
  backgroundColor: "gray" as const,
  showBottomCTA: false,
  cards: [
    {
      title: "Heritage & Ecclesiastical",
      description: "Specialist scaffolding for Kent's world-famous heritage sites including Canterbury Cathedral, Dover Castle vicinity, and hundreds of medieval churches across the county.",
      details: [
        "Cathedral scaffolding",
        "UNESCO site compliance",
        "Medieval building expertise",
        "Ecclesiastical specialists"
      ]
    },
    {
      title: "Port & Marine Infrastructure",
      description: "Expert scaffolding for Kent's major ports at Dover and Folkestone, with specialist knowledge of marine environments and port authority requirements.",
      details: [
        "Port authority approved",
        "Marine-grade materials",
        "Security clearances",
        "24/7 port operations"
      ]
    },
    {
      title: "Transport Infrastructure",
      description: "Scaffolding solutions for Kent's major transport links including High Speed 1 periphery, M25/M20 corridor developments, and Channel Tunnel infrastructure area.",
      details: [
        "Rail corridor expertise",
        "Highway scaffold permits",
        "Transport infrastructure",
        "24/7 availability"
      ]
    }
  ]
};

const countyServices = {
  title: "County-Wide Project Capabilities",
  description: "Specialist scaffolding services designed for Kent's unique combination of ancient heritage, modern transport infrastructure, and coastal challenges.",
  cards: [
    {
      title: "Heritage Scaffolding",
      description: "Specialized systems for Kent's unparalleled heritage sites, from Norman cathedrals to medieval castles and Tudor buildings across the county.",
      href: "/services/heritage-scaffolding",
      ctaText: "Learn More",
      features: [
        "Cathedral expertise",
        "Castle scaffolding",
        "Medieval specialists",
        "UNESCO compliance"
      ]
    },
    {
      title: "Industrial & Port",
      description: "Heavy-duty scaffolding for Kent's industrial sites, port facilities, and logistics centers serving the Channel gateway infrastructure.",
      href: "/services/industrial-scaffolding",
      ctaText: "Learn More",
      features: [
        "Port facility access",
        "Heavy industrial",
        "Security clearances",
        "Marine environment"
      ]
    },
    {
      title: "Transport Corridor",
      description: "Specialized scaffolding for projects along Kent's major transport arteries, including rail, highway, and Channel Tunnel periphery developments.",
      href: "/services/infrastructure-scaffolding",
      ctaText: "Learn More",
      features: [
        "Rail corridor work",
        "Highway permits",
        "Infrastructure support",
        "Traffic management"
      ]
    }
  ]
};

const ctaData = {
  title: "Ready to Start Your Kent Project?",
  description: "Contact our Kent scaffolding specialists for expert solutions across the county. From heritage projects in Canterbury to port developments in Dover.",
  primaryButtonText: "Get Free Kent Quote",
  primaryButtonUrl: "/contact",
  secondaryButtonText: "View All Services",
  secondaryButtonUrl: "/services",
  trustBadges: ["Free Quotes", "24/7 Support", "County Coverage"]
};

const breadcrumbItems = [
  { name: "Locations", href: "/locations" },
  { name: "Kent", href: "/locations/kent", current: true }
];

const schemaData = {
  service: {
    id: "/locations/kent#service",
    url: "/locations/kent",
    name: "Scaffolding Services in Kent",
    description: "Professional scaffolding services across Kent including Canterbury, Maidstone, Dover, Folkestone and 9+ locations. Heritage and port specialists with county-wide capabilities.",
    serviceType: "Scaffolding",
    areaServed: ["Kent", "Canterbury", "Maidstone", "Dover", "Folkestone", "Ashford", "Tunbridge Wells", "Margate", "Sevenoaks", "Dartford"]
  }
};

const faqData = [
  {
    question: "Which Kent towns do you cover?",
    answer: "We provide scaffolding services across all major Kent towns including Canterbury, Maidstone, Dover, Folkestone, Ashford, Tunbridge Wells, Margate, Sevenoaks, and Dartford. Full county coverage available."
  },
  {
    question: "Do you work on cathedral and heritage buildings in Kent?",
    answer: "Yes, we specialize in heritage scaffolding across Kent's extensive historic sites. Our team has particular expertise with cathedral scaffolding, including work on and around Canterbury Cathedral and medieval churches throughout the county."
  },
  {
    question: "Can you handle port and marine projects in Kent?",
    answer: "Absolutely. We're approved to work at Kent's major ports including Dover and Folkestone, with specialist knowledge of marine environments, port authority requirements, and appropriate security clearances."
  },
  {
    question: "Do you coordinate projects across multiple Kent locations?",
    answer: "Yes, we regularly manage county-wide projects across Kent, providing unified project management for developers and contractors working on multiple sites with optimized logistics and resource allocation."
  }
];

export default function KentPage() {
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

        {/* Kent Towns Directory */}
        <section className="py-16 bg-white">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Kent Towns We Serve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Local specialists in every Kent town. Click through to your specific location for detailed local knowledge and project examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kentTowns.map((town) => (
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