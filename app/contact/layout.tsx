import { Metadata } from "next";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Colossus Scaffolding | Free Quotes & Professional Service",
  description: "Contact Colossus Scaffolding for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams, rapid response.",
  openGraph: {
    title: "Contact Colossus Scaffolding | Free Quotes & Professional Service",
    description: "Contact Colossus Scaffolding for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams.",
    url: absUrl("/contact"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Contact Colossus Scaffolding - Professional Scaffolding Services"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Colossus Scaffolding | Free Quotes & Professional Service",
    description: "Contact Colossus Scaffolding for free quotes on professional scaffolding services across South East UK. TG20:21 compliant, CISRS qualified teams.",
    images: [absUrl("/static/logo.png")]
  },
  alternates: {
    canonical: absUrl("/contact")
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": absUrl("/contact"),
    name: "Contact Colossus Scaffolding",
    description: "Contact Colossus Scaffolding for free quotes on professional scaffolding services across South East UK.",
    url: absUrl("/contact"),
    mainEntity: {
      "@id": absUrl("/#organization")
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absUrl("/")
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: absUrl("/contact")
        }
      ]
    }
  };

  const contactPointSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "@id": absUrl("/contact#contactpoint"),
    telephone: "+441424466661",
    email: "info@colossusscaffolding.co.uk",
    contactType: "customer service",
    availableLanguage: "English",
    hoursAvailable: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00"
      }
    ],
    areaServed: [
      { "@type": "Place", name: "East Sussex" },
      { "@type": "Place", name: "West Sussex" },
      { "@type": "Place", name: "Kent" },
      { "@type": "Place", name: "Surrey" },
    ]
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPointSchema)
        }}
      />
      
      {children}
    </>
  );
}