/**
 * Contact Page — thin wrapper
 *
 * Builds schema and delegates rendering to RigelContactPage template.
 */

import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { siteConfig } from "@/site.config";
import { BUSINESS_EMAIL } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";
import type { SiteConfigSummary, BreadcrumbItem } from "@platform/core-components";
import { RigelContactPage } from "@platform/themes/rigel/pages";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Contact | Digital Marketing Weekend 2026`,
  description: `Get in touch with the Digital Marketing Weekend team. Questions about the event, sponsorship, or speaking opportunities — we'd love to hear from you.`,
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactPage() {
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Contact", href: "/contact", current: true }];

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <>
      <RigelContactPage
        siteConfig={siteSummary}
        breadcrumbs={breadcrumbs}
        eventDate="Saturday 17 &amp; Sunday 18 October 2026"
        email={BUSINESS_EMAIL}
      />

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
