import { HeroSection } from "@/components/ui/hero-section";
import { ServicesOverview } from "@/components/ui/services-overview";
import { CoverageAreas } from "@/components/ui/coverage-areas";
import { PageLayout } from "@/components/layouts/page-layout";
import { absUrl } from "@/lib/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Scaffolding Services South East UK | Colossus Scaffolding",
  description:
    "TG20:21 compliant scaffolding services across South East England. CISRS qualified teams, £10M insured, CHAS accredited. Access scaffolding, facade work & more.",
  openGraph: {
    title: "Professional Scaffolding Services South East UK | Colossus Scaffolding",
    description:
      "TG20:21 compliant scaffolding services across South East England. CISRS qualified teams, £10M insured, CHAS accredited.",
    url: absUrl("/"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Colossus Scaffolding - Professional Scaffolding Services South East UK",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Scaffolding Services South East UK | Colossus Scaffolding",
    description:
      "TG20:21 compliant scaffolding services across South East England. CISRS qualified teams, £10M insured, CHAS accredited.",
    images: [absUrl("/static/logo.png")],
  },
  alternates: {
    canonical: absUrl("/"),
  },
};

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absUrl("/#organization"),
    name: "Colossus Scaffolding",
    legalName: "Colossus Scaffolding Ltd",
    url: absUrl("/"),
    logo: absUrl("/static/logo.png"),
    description:
      "Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, CISRS qualified teams, and comprehensive insurance coverage.",
    foundingDate: "2009",
    numberOfEmployees: "10-50",
    email: "info@colossusscaffolding.co.uk",
    telephone: "+441424466661",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 7, Ivyhouse Lane",
      addressLocality: "Hastings",
      addressRegion: "East Sussex",
      postalCode: "TN35 4NN",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "50.8549",
      longitude: "0.5736",
    },
    areaServed: [
      { "@type": "Place", name: "East Sussex" },
      { "@type": "Place", name: "West Sussex" },
      { "@type": "Place", name: "Kent" },
      { "@type": "Place", name: "Surrey" },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "CHAS Accreditation",
        description: "Health and safety assessment scheme approved contractor",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "CISRS Qualified Teams",
        description: "Construction Industry Scaffolders Record Scheme certified scaffolders",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "compliance",
        name: "TG20:21 Compliance",
        description: "Latest technical guidance for scaffold design and installation compliance",
      },
    ],
    slogan: "Safe, compliant and fully insured scaffolding specialists serving the South East UK",
    knowsAbout: [
      "Access Scaffolding",
      "Facade Scaffolding",
      "Industrial Scaffolding",
      "Edge Protection",
      "Scaffold Design",
      "TG20:21 Compliance",
      "Scaffold Inspections",
      "Temporary Roof Systems",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Scaffolding Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Access Scaffolding",
            description: "Professional access scaffolding for residential and commercial projects",
            url: absUrl("/services/access-scaffolding"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Facade Scaffolding",
            description: "Specialist facade scaffolding for building maintenance and renovation",
            url: absUrl("/services/facade-scaffolding"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Edge Protection",
            description: "HSE compliant edge protection systems for construction sites",
            url: absUrl("/services/edge-protection"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Temporary Roof Systems",
            description: "Weather protection and temporary roofing solutions",
            url: absUrl("/services/temporary-roof-systems"),
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "127",
    },
    sameAs: [
      "https://www.facebook.com/colossusscaffolding",
      "https://www.linkedin.com/company/colossus-scaffolding",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absUrl("/#website"),
    name: "Colossus Scaffolding",
    url: absUrl("/"),
    description:
      "Professional scaffolding services across South East England with TG20:21 compliance and CISRS qualified teams.",
    publisher: {
      "@id": absUrl("/#organization"),
    },
    inLanguage: "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absUrl("/?s={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
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
    ],
  };

  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <HeroSection
          title="Scaffolding Services Across Sussex and the South East"
          description="TG20:21 compliant scaffolding solutions for residential, commercial, and industrial projects. Fully insured with CHAS accreditation and £10M liability coverage."
          heroImage="/hero-scaffolding.jpg"
          phone="01424 466 661"
          trustBadges={["TG20:21 Compliant", "CHAS Accredited", "£10M Insured"]}
          ctaText="Get Free Quote"
          ctaUrl="/contact"
        />
        <ServicesOverview />
        <CoverageAreas
          areas={[
            { name: "East Sussex", slug: "east-sussex" },
            { name: "West Sussex", slug: "west-sussex" },
            { name: "Kent", slug: "kent" },
            { name: "Surrey", slug: "surrey" },
          ]}
          phone="01424 466661"
        />
        {/* Trust Indicators Section */}
        <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100 border-t border-b border-gray-200">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="heading-section font-semibold">
                Trusted by Customers Across the South East
              </h2>
              <p className="text-lg text-gray-800 mx-auto w-full lg:w-[90%]">
                Industry-leading certifications and proven track record you can rely on.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-brand-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="stat-number">15+</div>
                  <div className="text-gray-900 font-medium">Years Experience</div>
                  <div className="text-sm text-gray-500 mt-1">Serving the South East</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-brand-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="stat-number">£10M</div>
                  <div className="text-gray-900 font-medium">Liability Insurance</div>
                  <div className="text-sm text-gray-500 mt-1">Comprehensive Coverage</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-brand-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div className="stat-number">TG20:21</div>
                  <div className="text-gray-900 font-medium">Compliant</div>
                  <div className="text-sm text-gray-500 mt-1">Latest Safety Standards</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-brand-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="stat-number">CHAS</div>
                  <div className="text-gray-900 font-medium">Accredited</div>
                  <div className="text-sm text-gray-500 mt-1">Health & Safety Approved</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-800 mb-6">
                Get professional scaffolding services from the team you can trust.
              </p>
              <a href="/contact" className="btn-primary-lg">
                Request Free Quote
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
