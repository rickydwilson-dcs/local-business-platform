import Link from "next/link";
import type { Metadata } from "next";
import { Schema } from "@/components/Schema";
import { ContentGrid } from "@/components/ui/content-grid";
import { getContentItems } from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Professional Scaffolding Services South East UK",
  description:
    "Professional scaffolding solutions across the South East UK. TG20:21 compliant, fully insured, and CHAS accredited. From residential repairs to large commercial projects.",
  keywords: [
    "scaffolding services",
    "professional scaffolding",
    "TG20:21 compliant",
    "CHAS accredited scaffolding",
    "South East UK",
  ],
  openGraph: {
    title: "Professional Scaffolding Services South East UK",
    description:
      "TG20:21 compliant scaffolding services for residential, commercial and industrial projects across the South East UK.",
    url: "/services",
    type: "website",
  },
};

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

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-white">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Our Scaffolding Services</h1>
              <p className="text-xl text-gray-800 mb-8 mx-auto w-full lg:w-[90%]">
                Professional scaffolding solutions across the South East UK. From residential
                repairs to large commercial projects, we deliver safe, compliant access solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact" className="btn-primary-lg">
                  Get Free Quote
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
                  Call Now: {PHONE_DISPLAY}
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

        {/* Services Grid */}
        <section className="section-standard bg-gray-50">
          <div className="container-standard">
            <div className="section-header">
              <h2 className="heading-section">Our Professional Scaffolding Services</h2>
              <p className="text-body-lg">
                Comprehensive scaffolding capabilities for every type of project, from heritage
                restoration to major commercial developments.
              </p>
            </div>

            <ContentGrid
              items={services}
              basePath="/services"
              emptyMessage="No services available."
              fallbackDescription={(title) => `Learn more about ${title.toLowerCase()}.`}
              contentType="services"
            />

            <div className="text-center mt-12">
              <p className="text-gray-800 mb-6">
                Need a custom scaffolding solution for your project?
              </p>
              <Link href="/contact" className="btn-primary-lg">
                Request Custom Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-compact bg-white">
          <div className="container-standard text-center">
            <h2 className="heading-subsection">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-800 mb-8">
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
      </main>

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
