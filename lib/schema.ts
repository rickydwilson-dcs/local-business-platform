import { absUrl } from "./site";

export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": absUrl("/#organization"),
  name: "Colossus Scaffolding",
  legalName: "Colossus Scaffolding Ltd",
  url: absUrl("/"),
  logo: absUrl("/static/logo.png"),
  description: "Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, CISRS qualified teams, and comprehensive insurance coverage.",
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
    addressCountry: "GB"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "50.8549",
    longitude: "0.5736"
  },
  areaServed: [
    { "@type": "Place", name: "East Sussex" },
    { "@type": "Place", name: "West Sussex" },
    { "@type": "Place", name: "Kent" },
    { "@type": "Place", name: "Surrey" },
    { "@type": "Place", name: "Essex" },
    { "@type": "Place", name: "London" }
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "CHAS Accreditation",
      description: "Health and safety assessment scheme approved contractor"
    },
    {
      "@type": "EducationalOccupationalCredential", 
      credentialCategory: "certification",
      name: "CISRS Qualified Teams",
      description: "Construction Industry Scaffolders Record Scheme certified scaffolders"
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "compliance", 
      name: "TG20:21 Compliance",
      description: "Latest technical guidance for scaffold design and installation compliance"
    }
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
    "Temporary Roof Systems"
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
          url: absUrl("/services/access-scaffolding")
        }
      },
      {
        "@type": "Offer", 
        itemOffered: {
          "@type": "Service",
          name: "Facade Scaffolding",
          description: "Specialist facade scaffolding for building maintenance and renovation",
          url: absUrl("/services/facade-scaffolding")
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service", 
          name: "Edge Protection",
          description: "HSE compliant edge protection systems for construction sites",
          url: absUrl("/services/edge-protection")
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service", 
          name: "Temporary Roof Systems",
          description: "Weather protection and temporary roofing solutions",
          url: absUrl("/services/temporary-roof-systems")
        }
      }
    ]
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    ratingCount: "127"
  },
  sameAs: [
    "https://www.facebook.com/colossusscaffolding",
    "https://www.linkedin.com/company/colossus-scaffolding"
  ]
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absUrl("/#website"),
  name: "Colossus Scaffolding",
  url: absUrl("/"),
  description: "Professional scaffolding services across South East England with TG20:21 compliance and CISRS qualified teams.",
  publisher: {
    "@id": absUrl("/#organization")
  },
  inLanguage: "en-GB",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absUrl("/?s={search_term_string}")
    },
    "query-input": "required name=search_term_string"
  }
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absUrl(item.url)
  }))
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>, pageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": absUrl(`${pageUrl}#faq`),
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});