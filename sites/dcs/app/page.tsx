import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { SiteHomePage } from "@/components/pages/HomePage";
import { siteConfig } from "@/site.config";
import { getLocations } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { getLocalBusinessSchema } from "@/lib/schema";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
  description:
    "Bespoke websites for electricians, plumbers, scaffolders, and builders. Built-in local SEO. Fully managed.",
  openGraph: {
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      "Bespoke websites for electricians, plumbers, scaffolders, and builders. Built-in local SEO. Fully managed.",
    url: absUrl("/"),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl("/logo.svg"),
        width: 1200,
        height: 630,
        alt: `${siteConfig.business.name} - ${siteConfig.tagline}`,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      "Bespoke websites for electricians, plumbers, scaffolders, and builders. Built-in local SEO. Fully managed.",
    images: [absUrl("/logo.svg")],
  },
  alternates: {
    canonical: absUrl("/"),
  },
};

export default async function HomePage() {
  const locations = await getLocations();

  const localBusinessSchema = getLocalBusinessSchema();

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absUrl("/#website"),
    name: siteConfig.business.name,
    url: absUrl("/"),
    description: siteConfig.tagline,
    publisher: {
      "@id": absUrl("/#organization"),
    },
    inLanguage: "en-GB",
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

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );

  return (
    <SiteHomePage
      siteConfig={siteSummary}
      heroHeadline="Websites That Get Tradespeople More Jobs"
      heroSubheading="Bespoke websites for electricians, plumbers, scaffolders, and builders. Built-in local SEO. Fully managed."
      services={siteConfig.services.map((s) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
      }))}
      locations={locations.map((l) => ({
        slug: l.slug,
        title: l.title,
        description: l.description,
      }))}
      testimonials={(siteConfig.testimonials ?? []).map((t, i) => ({
        slug: `testimonial-${i + 1}`,
        name: t.name,
        rating: 5,
        body: t.quote,
        platform: t.trade,
      }))}
      schemaNodes={schemaNodes}
    />
  );
}
