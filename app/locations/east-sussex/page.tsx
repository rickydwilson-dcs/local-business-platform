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
  title: "Professional Scaffolding Across East Sussex | Colossus Scaffolding",
  description: "Expert scaffolding services across all East Sussex towns. Local specialists covering Brighton, Eastbourne, Hastings, Lewes and 10+ locations with county-wide capabilities.",
  keywords: "East Sussex scaffolding, county scaffolding services, Brighton scaffolding, Eastbourne scaffolding, Hastings scaffolding, heritage scaffolding",
  openGraph: {
    title: "Professional Scaffolding Across East Sussex | Colossus Scaffolding",
    description: "Expert scaffolding services across all East Sussex towns. Local specialists covering Brighton, Eastbourne, Hastings, Lewes and 10+ locations with county-wide capabilities.",
    url: absUrl("/locations/east-sussex"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Professional scaffolding services across East Sussex - Colossus Scaffolding"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Across East Sussex | Colossus Scaffolding",
    description: "Expert scaffolding services across all East Sussex towns. Local specialists covering Brighton, Eastbourne, Hastings, Lewes and 10+ locations with county-wide capabilities."
  },
  alternates: {
    canonical: absUrl("/locations/east-sussex")
  }
};

const eastSussexTowns = [
  { name: "Brighton", slug: "brighton", description: "Seafront & heritage specialist", established: true },
  { name: "Eastbourne", slug: "eastbourne", description: "Victorian & coastal projects", established: true },
  { name: "Hastings", slug: "hastings", description: "Historic town & cliff projects", established: true },
  { name: "Lewes", slug: "lewes", description: "County town & heritage sites", established: true },
  { name: "Uckfield", slug: "uckfield", description: "Market town developments", established: true },
  { name: "Hailsham", slug: "hailsham", description: "Residential & commercial", established: true },
  { name: "Newhaven", slug: "newhaven", description: "Port & industrial projects", established: true },
  { name: "Seaford", slug: "seaford", description: "Coastal residential works", established: true },
  { name: "Battle", slug: "battle", description: "Historic conservation", established: true },
  { name: "Crowborough", slug: "crowborough", description: "High Weald projects", established: true }
];

const heroData = {
  title: "Professional Scaffolding Across East Sussex",
  description: "County-wide scaffolding expertise covering 10+ East Sussex towns. From Brighton's seafront developments to Hastings' heritage projects, we deliver specialist solutions backed by local knowledge.",
  phone: "01424 466 661",
  trustBadges: ["TG20:21 Compliant", "Heritage Specialists", "County Coverage"],
  ctaText: "Get Your Free East Sussex Quote",
  ctaUrl: "/contact"
};

const countyCapabilities = {
  title: "East Sussex Scaffolding Specialists",
  description: "Comprehensive county-wide capabilities with deep local expertise across East Sussex's diverse architectural and geographical challenges.",
  columns: 3,
  backgroundColor: "gray" as const,
  showBottomCTA: false,
  cards: [
    {
      title: "Heritage & Conservation",
      description: "Specialist scaffolding for East Sussex's extensive listed buildings, conservation areas, and UNESCO World Heritage sites including Battle Abbey and Brighton's Regency architecture.",
      details: [
        "Listed building compliance",
        "Conservation area expertise",
        "Heritage planning permissions",
        "Sensitive access solutions"
      ]
    },
    {
      title: "Coastal Engineering",
      description: "Marine-grade scaffolding solutions designed for East Sussex's 40-mile coastline. Wind-resistant systems for seafront properties from Brighton to Rye.",
      details: [
        "Salt corrosion protection",
        "High wind resistance",
        "Seafront specialists",
        "Tidal access planning"
      ]
    },
    {
      title: "Council Relationships",
      description: "Established working relationships with East Sussex County Council, Brighton & Hove, and district councils for streamlined permissions and compliance.",
      details: [
        "Planning permission support",
        "Highway permits handled",
        "Council liaison services",
        "Compliance guarantee"
      ]
    }
  ]
};

const countyServices = {
  title: "County-Wide Project Capabilities",
  description: "Specialist scaffolding services designed for East Sussex's unique project requirements and architectural heritage.",
  cards: [
    {
      title: "Heritage Scaffolding",
      description: "Specialist systems for East Sussex's extensive historic building stock, from medieval churches to Regency terraces.",
      href: "/services/heritage-scaffolding",
      features: [
        "Listed building compliance",
        "Conservation area sensitivity",
        "Minimal building contact",
        "Heritage planning support"
      ]
    },
    {
      title: "Coastal Scaffolding",
      description: "Marine-grade scaffolding engineered for East Sussex's challenging coastal environment and high wind conditions.",
      href: "/services/facade-scaffolding",
      features: [
        "Salt corrosion resistance",
        "High wind capability",
        "Seafront access solutions",
        "Tide-resistant installations"
      ]
    },
    {
      title: "Multi-Site Coordination",
      description: "Cross-county project management for developers and contractors working across multiple East Sussex locations.",
      href: "/services/temporary-roof-systems",
      features: [
        "Multi-location planning",
        "Resource coordination",
        "Unified project management",
        "Cost optimization"
      ]
    }
  ]
};

const ctaData = {
  title: "Ready to Start Your East Sussex Project?",
  description: "Contact our East Sussex scaffolding specialists for expert solutions across the county. From heritage projects in Battle to seafront developments in Brighton.",
  primaryButtonText: "Get Free East Sussex Quote",
  primaryButtonUrl: "/contact",
  secondaryButtonText: "View All Services",
  secondaryButtonUrl: "/services",
  trustBadges: ["Free Quotes", "24/7 Support", "County Coverage"]
};

const breadcrumbItems = [
  { name: "Locations", href: "/locations" },
  { name: "East Sussex", href: "/locations/east-sussex", current: true }
];

const schemaData = {
  service: {
    id: "/locations/east-sussex#service",
    url: "/locations/east-sussex",
    name: "Scaffolding Services in East Sussex",
    description: "Professional scaffolding services across East Sussex including Brighton, Eastbourne, Hastings and 10+ locations. Heritage specialists with county-wide capabilities.",
    serviceType: "Scaffolding",
    areaServed: ["East Sussex", "Brighton", "Eastbourne", "Hastings", "Lewes", "Battle", "Crowborough", "Hailsham", "Newhaven", "Seaford", "Uckfield"]
  }
};

const faqData = [
  {
    question: "Which East Sussex towns do you cover?",
    answer: "We provide scaffolding services across all major East Sussex towns including Brighton, Eastbourne, Hastings, Lewes, Battle, Crowborough, Hailsham, Newhaven, Seaford, and Uckfield. Full county coverage available."
  },
  {
    question: "Do you handle heritage and listed building scaffolding in East Sussex?",
    answer: "Yes, we specialize in heritage scaffolding across East Sussex's extensive historic building stock. Our team has extensive experience with conservation areas, listed buildings, and heritage planning requirements."
  },
  {
    question: "Can you coordinate projects across multiple East Sussex locations?",
    answer: "Absolutely. We regularly manage multi-site projects across East Sussex, providing unified project management, resource coordination, and cost optimization for developers working county-wide."
  },
  {
    question: "Are you equipped for East Sussex's coastal conditions?",
    answer: "Yes, our coastal scaffolding systems are specifically engineered for East Sussex's marine environment, featuring salt corrosion protection and high wind resistance for seafront properties."
  }
];

export default function EastSussexPage() {
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

        {/* East Sussex Towns Directory */}
        <section className="py-16 bg-white">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                East Sussex Towns We Serve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Local specialists in every East Sussex town. Click through to your specific location for detailed local knowledge and project examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {eastSussexTowns.map((town) => (
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