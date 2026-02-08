/**
 * Contact Page
 *
 * Server Component with metadata, canonical URL, and structured data.
 * The interactive form is extracted to a client component.
 */

import Link from "next/link";
import { Metadata } from "next";
import { Schema, Breadcrumbs } from "@platform/core-components";
import { absUrl } from "@/lib/site";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL } from "@/lib/contact-info";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact Colossus Scaffolding | Free Quote",
  description:
    "Get a free scaffolding quote from Colossus Scaffolding. Professional scaffolding services across South East UK. TG20:21 compliant, fully insured, CHAS accredited.",
  openGraph: {
    title: "Contact Colossus Scaffolding | Get a Free Quote",
    description:
      "Get in touch for scaffolding quotes, site surveys, and general enquiries across the South East UK.",
    url: absUrl("/contact"),
    siteName: "Colossus Scaffolding",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Colossus Scaffolding | Get a Free Quote",
    description:
      "Get in touch for scaffolding quotes, site surveys, and general enquiries across the South East UK.",
  },
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactPage() {
  const breadcrumbItems = [{ name: "Contact", href: "/contact", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Colossus Scaffolding</h1>
          <p className="text-xl text-gray-800 mx-auto w-full lg:w-[90%]">
            Get a free quote today. Professional scaffolding services across the South East UK.
            TG20:21 compliant, fully insured, and CHAS accredited.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Main Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-lg text-brand-primary font-semibold">
                      <a href={`tel:${PHONE_TEL}`} className="hover:underline">
                        {PHONE_DISPLAY}
                      </a>
                    </p>
                    <p className="text-sm text-gray-800">
                      Mon-Fri: 7:30am - 6:00pm
                      <br />
                      Sat: 8:00am - 4:00pm
                      <br />
                      Emergency call-outs available
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-brand-primary">
                      <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:underline">
                        {BUSINESS_EMAIL}
                      </a>
                    </p>
                    <p className="text-sm text-gray-800">We respond within 24 hours</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Areas</h3>
                    <p className="text-gray-700">East Sussex, West Sussex, Kent & Surrey</p>
                    <p className="text-sm text-gray-800">
                      <Link href="/locations" className="text-brand-primary hover:underline">
                        View All Coverage Areas
                      </Link>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Registered Office</h3>
                    <div className="text-gray-700 space-y-1">
                      <p>Office 7, 15-20 Gresley Road</p>
                      <p>St Leonards On Sea</p>
                      <p>East Sussex TN38 9PL</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Services</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/services/access-scaffolding"
                          className="text-brand-primary hover:underline"
                        >
                          Access Scaffolding
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/facade-scaffolding"
                          className="text-brand-primary hover:underline"
                        >
                          Facade Scaffolding
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/edge-protection"
                          className="text-brand-primary hover:underline"
                        >
                          Edge Protection
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services"
                          className="text-brand-primary hover:underline font-medium"
                        >
                          View All Scaffolding Services
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Schema
        service={{
          id: "/contact#service",
          url: "/contact",
          name: "Contact Colossus Scaffolding",
          description:
            "Get in touch for scaffolding quotes, site surveys, and general enquiries across the South East UK.",
          serviceType: "Contact",
          areaServed: ["South East UK", "East Sussex", "West Sussex", "Kent", "Surrey"],
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
        webpage={{
          "@type": "ContactPage",
          "@id": absUrl("/contact#contactpage"),
          url: absUrl("/contact"),
          name: "Contact Colossus Scaffolding",
          description:
            "Get in touch for scaffolding quotes, site surveys, and general enquiries across the South East UK.",
        }}
        faqs={[
          {
            question: "How quickly can you provide a quote?",
            answer: "We typically provide quotes within 24-48 hours after a free site survey.",
          },
          {
            question: "Do you offer emergency scaffolding?",
            answer:
              "Yes, we provide emergency scaffolding services subject to availability for urgent make-safe work.",
          },
          {
            question: "What information do you need for a quote?",
            answer:
              "We need project details including building height, access requirements, duration, and any special considerations.",
          },
          {
            question: "Are site surveys really free?",
            answer:
              "Yes, we provide completely free, no-obligation site surveys and detailed quotations for all projects.",
          },
        ]}
      />
    </>
  );
}
