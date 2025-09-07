import React from "react";
import { absUrl } from "@/lib/site";

type FAQ = { question: string; answer: string };

type Props = {
  service: {
    id: string;      // can be "/access-scaffolding#service" or absolute
    url: string;     // can be "/access-scaffolding" or absolute
    name: string;
    description: string;
    serviceType: string;
    areaServed?: string[];
  };
  faqs: FAQ[];
  org?: { name: string; url: string; logo?: string; id?: string };
};

export default function Schema({ service, faqs, org }: Props) {
  const graph = [
    {
      "@type": "Service",
      "@id": absUrl(service.id),
      name: service.name,
      description: service.description,
      url: absUrl(service.url),
      category: "Scaffolding",
      serviceType: service.serviceType,
      ...(org && {
        provider: {
          "@type": "Organization",
          ...(org.id ? { "@id": absUrl(org.id) } : {}),
          name: org.name,
          url: absUrl(org.url),
          ...(org.logo ? { logo: absUrl(org.logo) } : {}),
        },
      }),
      ...(service.areaServed?.length
        ? { areaServed: service.areaServed.map((c) => ({ "@type": "City", name: c })) }
        : {}),
    },
    {
      "@type": "FAQPage",
      "@id": absUrl(service.url + (service.url.includes("#") ? "" : "#faq")),
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
