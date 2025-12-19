import type { Metadata } from "next";
import Link from "next/link";
import { getAllCounties } from "@/lib/locations-dropdown";
import { absUrl } from "@/lib/site";
import { PageLayout } from "@/components/layouts/page-layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { CoverageStatsSection } from "@/components/ui/coverage-stats-section";
import { TownFinderSection } from "@/components/ui/town-finder-section";
import { CountyGatewayCards } from "@/components/ui/county-gateway-cards";
import { LocalSpecialistsBenefits } from "@/components/ui/local-specialists-benefits";
import { CoverageMapSection } from "@/components/ui/coverage-map-section";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Professional Scaffolding Across South East England | 30+ Towns Covered",
  description:
    "Professional scaffolding services across 30+ towns in East Sussex, West Sussex, Kent, and Surrey. Local specialists with heritage expertise and established council relationships.",
  openGraph: {
    title: "Professional Scaffolding Across South East England | 30+ Towns Covered",
    description:
      "From Brighton's seafront heritage to Canterbury's World Heritage sites, we provide expert scaffolding with genuine local knowledge and established council relationships.",
    url: absUrl("/locations"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Colossus Scaffolding - Professional Scaffolding Across South East England",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Across South East England | 30+ Towns Covered",
    description:
      "Local scaffolding specialists with heritage expertise and council relationships across the South East.",
    images: [absUrl("/static/logo.png")],
  },
  alternates: {
    canonical: absUrl("/locations"),
  },
};

export default function LocationsPage() {
  const counties = getAllCounties();

  const breadcrumbItems = [{ name: "Locations", href: "/locations", current: true }];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absUrl("/locations#organization"),
    name: "Colossus Scaffolding",
    url: absUrl("/"),
    logo: absUrl("/static/logo.png"),
    description:
      "Professional scaffolding specialists serving 30+ towns across South East England with local expertise and heritage building specialists.",
    areaServed: counties.map((county) => ({
      "@type": "Place",
      name: county.name,
      containsPlace: county.towns.map((town) => ({
        "@type": "Place",
        name: town.name,
      })),
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Local Scaffolding Services",
      itemListElement: counties.flatMap((county) =>
        county.towns.map((town, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            name: `Scaffolding Services in ${town.name}`,
            description: `Professional scaffolding solutions in ${town.name}, ${county.name} with local specialist knowledge.`,
            url: absUrl(town.href),
            areaServed: {
              "@type": "Place",
              name: town.name,
            },
          },
        }))
      ),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: absUrl("/locations"),
      },
    ],
  };

  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="container-standard py-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          {/* Hero Section */}
          <section className="section-standard lg:py-24 bg-white">
            <div className="container-standard">
              <div className="text-center">
                <h1 className="heading-hero">Professional Scaffolding Across South East England</h1>
                <p className="text-xl text-gray-800 mb-6 mx-auto w-full lg:w-[90%]">
                  30+ towns covered with local specialists who understand your area&apos;s unique
                  challenges
                </p>
                <p className="text-lg text-gray-700 mb-8 mx-auto w-full lg:w-[85%]">
                  From Brighton&apos;s seafront heritage to Canterbury&apos;s World Heritage sites,
                  we provide expert scaffolding with genuine local knowledge and established council
                  relationships.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link href="#town-finder" className="btn-primary-lg">
                    Find Your Local Specialist
                  </Link>
                  <Link
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call: {PHONE_DISPLAY}
                  </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    30+ Towns Covered
                  </div>
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Heritage Specialists
                  </div>
                  <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                    Local Council Partners
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Coverage Statistics */}
          <CoverageStatsSection />

          {/* Town Finder */}
          <TownFinderSection />

          {/* County Gateway Cards */}
          <CountyGatewayCards />

          {/* Local Specialists Benefits */}
          <LocalSpecialistsBenefits />

          {/* Coverage Map */}
          <CoverageMapSection />

          {/* Final CTA */}
          <section className="section-standard bg-white">
            <div className="container-standard text-center">
              <h2 className="heading-section">Ready to Work with Local Specialists?</h2>
              <p className="text-xl text-gray-800 mb-8 mx-auto w-full lg:w-[85%]">
                Connect with scaffolding experts who understand your area&apos;s specific
                requirements and challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#town-finder" className="btn-primary-lg">
                  Find Your Local Team
                </Link>
                <Link
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Call: {PHONE_DISPLAY}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
