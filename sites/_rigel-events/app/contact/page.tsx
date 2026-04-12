/**
 * Contact Page
 *
 * Event contact page with ContactForm from core-components.
 */

import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { siteConfig } from "@/site.config";
import { BUSINESS_EMAIL } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";
import { PageTitleBanner } from "@platform/themes/corvus/components";
import { ContactForm } from "@platform/core-components";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Contact | Digital Marketing Weekend 2026`,
  description: `Get in touch with the Digital Marketing Weekend team. Questions about the event, sponsorship, or speaking opportunities — we'd love to hear from you.`,
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <PageTitleBanner pageTitle="Contact Us" />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6">Get in Touch</h2>
              <p className="text-surface-muted-foreground text-lg mb-8">
                Questions about the event, sponsorship, or speaking opportunities? We&apos;d love to
                hear from you.
              </p>

              <div className="space-y-6">
                <div className="bg-surface-card border border-surface-border rounded-lg p-5">
                  <h3 className="font-semibold text-surface-foreground mb-1">Email</h3>
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-brand-primary hover:text-brand-primary-hover transition-colors"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </div>

                <div className="bg-surface-card border border-surface-border rounded-lg p-5">
                  <h3 className="font-semibold text-surface-foreground mb-1">Event Dates</h3>
                  <p className="text-surface-muted-foreground">
                    Saturday 17 &amp; Sunday 18 October 2026
                  </p>
                </div>

                <div className="bg-surface-card border border-surface-border rounded-lg p-5">
                  <h3 className="font-semibold text-surface-foreground mb-1">Venue</h3>
                  <p className="text-surface-muted-foreground">
                    Winter Garden, Compton Street, Eastbourne, BN21 4BP
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-6 lg:p-8">
              <h2 className="text-xl font-bold text-surface-foreground mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

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
