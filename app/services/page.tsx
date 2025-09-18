import Link from "next/link";
import Schema from "@/components/Schema";
import { ContentGrid } from "@/components/ui/content-grid";
import { getContentItems } from "@/lib/content";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { ServiceLocationMatrix } from "@/components/ui/service-location-matrix";

export const dynamic = "force-static";

export default async function ServicesPage() {
  const services = await getContentItems("services");

  const breadcrumbItems = [{ name: "Services", href: "/services", current: true }];

  return (
    <>
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
              <h1 className="heading-hero">Our Scaffolding Services</h1>
              <p className="text-xl text-gray-600 mb-8 mx-auto w-full lg:w-[90%]">
                Professional scaffolding solutions across the South East UK. From residential
                repairs to large commercial projects, we deliver safe, compliant access solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact" className="btn-primary-lg">
                  Get Free Quote
                </Link>
                <Link
                  href="tel:01424466661"
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
                  Call Now: 01424 466 661
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
                  TG20:21 Compliant
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
                  CHAS Accredited
                </div>
                <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                  £10M Insured
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Service Categories */}
        <section className="section-standard bg-white">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="heading-section">Main Service Categories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional scaffolding solutions designed for every type of project and
                environment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Commercial Scaffolding */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:bg-blue-100 transition-colors">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏢</div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Commercial Scaffolding</h3>
                  <p className="text-gray-700 mb-6">
                    Professional scaffolding for office buildings, retail developments, and business
                    districts. Minimizing disruption while maintaining the highest safety standards.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-blue-800">✓ Business continuity planning</div>
                    <div className="text-sm text-blue-800">✓ Pedestrian protection systems</div>
                    <div className="text-sm text-blue-800">✓ Out-of-hours installation</div>
                  </div>
                  <Link
                    href="/services/commercial-scaffolding"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Residential Scaffolding */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 hover:bg-green-100 transition-colors">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4">
                    Residential Scaffolding
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Safe, reliable scaffolding for homes, extensions, and renovations.
                    Family-friendly approach with minimal garden disruption.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-green-800">✓ Garden and property protection</div>
                    <div className="text-sm text-green-800">✓ Family schedule coordination</div>
                    <div className="text-sm text-green-800">✓ Heritage property expertise</div>
                  </div>
                  <Link
                    href="/services/residential-scaffolding"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Learn More
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Industrial Scaffolding */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 hover:bg-orange-100 transition-colors">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏭</div>
                  <h3 className="text-2xl font-bold text-orange-900 mb-4">
                    Industrial Scaffolding
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Heavy-duty scaffolding systems for industrial facilities, ports, and
                    manufacturing sites. Engineered for complex structural challenges.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-orange-800">✓ Heavy-duty load capacity</div>
                    <div className="text-sm text-orange-800">✓ Specialized access solutions</div>
                    <div className="text-sm text-orange-800">✓ Long-term project support</div>
                  </div>
                  <Link
                    href="/services/industrial-scaffolding"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Learn More
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service-Location Matrix */}
        <ServiceLocationMatrix />

        {/* All Services Grid */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="heading-section">All Scaffolding Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive range of specialized scaffolding solutions for every requirement.
              </p>
            </div>
            <ContentGrid
              items={services}
              basePath="/services"
              emptyMessage="No services available."
              fallbackDescription={(title) => `Learn more about ${title.toLowerCase()}.`}
              contentType="services"
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-compact bg-white">
          <div className="container-standard text-center">
            <h2 className="heading-subsection">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Every project is unique. Contact our expert team to discuss your specific scaffolding
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary-lg">
                Get Free Quote
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Schema
        service={{
          id: "/services#service",
          url: "/services",
          name: "Scaffolding Services",
          description:
            "Professional scaffolding solutions across the South East UK. TG20:21 compliant, fully insured, and CHAS accredited.",
          serviceType: "Scaffolding Services",
          areaServed: ["South East UK", "East Sussex", "West Sussex", "Kent", "Surrey"],
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
        faqs={[
          {
            question: "What types of scaffolding services do you offer?",
            answer:
              "We offer comprehensive scaffolding services including access scaffolding, facade scaffolding, temporary roof systems, edge protection, and industrial solutions.",
          },
          {
            question: "Are your scaffolds safety compliant?",
            answer:
              "Yes, all scaffolds are TG20:21 compliant and installed by CISRS-qualified scaffolders with regular inspections.",
          },
          {
            question: "Which areas do you serve?",
            answer:
              "We serve the South East UK including East Sussex, West Sussex, Kent, and Surrey.",
          },
          {
            question: "Do you provide free quotes?",
            answer:
              "Yes, we provide free site surveys and detailed quotes for all scaffolding projects across our coverage areas.",
          },
        ]}
      />
    </>
  );
}
