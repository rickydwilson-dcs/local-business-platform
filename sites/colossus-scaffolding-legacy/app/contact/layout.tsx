import { Metadata } from "next";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Contact ${siteConfig.business.name} | Free Quotes`,
  description: `Contact ${siteConfig.business.name} for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams, rapid response.`,
  openGraph: {
    title: `Contact ${siteConfig.business.name} | Free Quotes`,
    description: `Contact ${siteConfig.business.name} for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams.`,
    url: absUrl("/contact"),
    siteName: siteConfig.business.name,
    images: [
      {
        url: absUrl("/logo.svg"),
        width: 1200,
        height: 630,
        alt: `Contact ${siteConfig.business.name} - Professional Scaffolding Services`,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${siteConfig.business.name} | Free Quotes`,
    description: `Contact ${siteConfig.business.name} for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams.`,
    images: [absUrl("/logo.svg")],
  },
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": absUrl("/contact"),
    name: `Contact ${siteConfig.business.name}`,
    description: `Contact ${siteConfig.business.name} for free quotes on professional scaffolding services across South East UK.`,
    url: absUrl("/contact"),
    mainEntity: {
      "@id": absUrl("/#organization"),
    },
    breadcrumb: {
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
          name: "Contact",
          item: absUrl("/contact"),
        },
      ],
    },
  };

  const contactPointSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "@id": absUrl("/contact#contactpoint"),
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    contactType: "customer service",
    availableLanguage: "English",
    hoursAvailable: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
      },
    ],
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPointSchema),
        }}
      />

      {children}
    </>
  );
}
