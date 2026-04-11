/**
 * Contact Page — Digital Marketing Weekend
 *
 * Server Component with metadata, canonical URL, and structured data.
 * The interactive form is extracted to a client component.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Calendar } from "lucide-react";
import { siteConfig } from "@/site.config";
import { BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";
import { Schema, Breadcrumbs, ContactForm } from "@platform/core-components";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Contact | Digital Marketing Weekend 2026`,
  description: `Get in touch with the Digital Marketing Weekend team. Questions about the event, sponsorship, or speaking opportunities — we'd love to hear from you.`,
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactPage() {
  const breadcrumbItems = [{ name: "Contact", href: "/contact", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              Questions about the event, sponsorship opportunities, or speaking — we&apos;d love to
              hear from you.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm services={[]} serviceAreas={[]} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Information */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-6">
                    Event Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Date</p>
                        <p className="text-surface-muted-foreground text-sm">
                          Saturday 17 &amp; Sunday 18 October 2026
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Venue</p>
                        <p className="text-surface-muted-foreground text-sm">
                          The Winter Garden
                          <br />
                          {ADDRESS.street}
                          <br />
                          {ADDRESS.locality}, {ADDRESS.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Email</p>
                        <Link
                          href={`mailto:${BUSINESS_EMAIL}`}
                          className="text-brand-primary hover:underline text-sm"
                        >
                          {BUSINESS_EMAIL}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Quick Links</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/speakers" className="text-brand-primary hover:underline text-sm">
                        Meet the Speakers
                      </Link>
                    </li>
                    <li>
                      <Link href="/schedule" className="text-brand-primary hover:underline text-sm">
                        View the Schedule
                      </Link>
                    </li>
                    <li>
                      <Link href="/venue" className="text-brand-primary hover:underline text-sm">
                        Venue &amp; Travel Info
                      </Link>
                    </li>
                    <li>
                      <Link href="/sponsors" className="text-brand-primary hover:underline text-sm">
                        Sponsorship Opportunities
                      </Link>
                    </li>
                    <li>
                      <a
                        href={siteConfig.cta.primary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline font-medium text-sm"
                      >
                        Get Your Free Ticket &rarr;
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Schema Markup */}
      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
        webpage={{
          "@type": "ContactPage",
          "@id": absUrl("/contact#contactpage"),
          url: absUrl("/contact"),
          name: `Contact ${siteConfig.business.name}`,
          description: `Get in touch with the Digital Marketing Weekend team about the event, sponsorship, or speaking opportunities.`,
        }}
      />
    </>
  );
}
