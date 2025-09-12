import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";

import { ServiceHero } from "@/components/ui/service-hero";
import { ServiceBenefits } from "@/components/ui/service-benefits";
import { ServiceGallery } from "@/components/ui/service-gallery";
import { ServiceFAQ } from "@/components/ui/service-faq";
import { ServiceCTA } from "@/components/ui/service-cta";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "services");

interface ServiceData {
  title: string;
  description: string;
  badge?: string;
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  heroImage?: string;
  galleryImages?: string[];
}

async function getMdx(slug: string) {
  const file = path.join(DIR, `${slug}.mdx`);
  const raw = await fs.readFile(file, "utf8");
  const { data } = matter(raw);
  const title = (data.title as string) || slug;
  const description = (data.description as string) || "";
  return { title, description, data };
}

// Generate location-specific FAQs for services
function getServiceFAQs(serviceName: string): Array<{ question: string; answer: string }> {
  const locationGroups = [
    { locations: "Brighton, Lewes, Eastbourne", county: "East Sussex" },
    { locations: "Crawley, Horsham, Worthing", county: "West Sussex" },
    { locations: "Maidstone, Canterbury, Ashford", county: "Kent" },
    { locations: "Guildford, Woking, Croydon", county: "Surrey" },
    { locations: "Chelmsford, Colchester, Southend", county: "Essex" },
    { locations: "Westminster, Camden, Southwark", county: "London" }
  ];

  return locationGroups.map(group => ({
    question: `Do you provide ${serviceName.toLowerCase()} in ${group.locations.split(', ')[0]}?`,
    answer: `Yes, we supply professional ${serviceName.toLowerCase()} services in ${group.locations}, fully compliant with UK safety standards.`
  }));
}

function getServiceData(slug: string): ServiceData {
  const serviceDataMap: Record<string, ServiceData> = {
    "access-scaffolding": {
      title: "Access Scaffolding Services", 
      description: "Safe, TG20:21-compliant access scaffolding for residential, commercial, and industrial projects across the South East UK. Professional installation with full insurance coverage.",
      badge: "Most Popular",
      heroImage: "/Access Scaffolding new build.png",
      benefits: [
        "TG20:21 compliant design and installation",
        "CISRS qualified and experienced scaffolders",
        "£10 million public liability insurance",
        "CHAS accredited safety standards",
        "Free site surveys and quotations",
        "Rapid response across South East UK",
        "Complete handover certificates provided",
        "Regular safety inspections included"
      ],
      faqs: getServiceFAQs("access scaffolding")
    },
    "facade-scaffolding": {
      title: "Facade Scaffolding Solutions",
      description: "Professional facade scaffolding for building maintenance, renovation, and construction projects. Weather-resistant systems with comprehensive access solutions.",
      benefits: [
        "Weatherproof scaffold systems",
        "Load-bearing structural design",
        "Planning permission assistance",
        "Professional installation teams",
        "Weather protection options",
        "Debris netting available",
        "Access platforms and walkways",
        "Safety barriers included"
      ],
      faqs: getServiceFAQs("facade scaffolding")
    },
    "edge-protection": {
      title: "Edge Protection Systems",
      description: "Comprehensive edge protection systems ensuring maximum safety on construction and maintenance sites. HSE compliant solutions for all project types.",
      benefits: [
        "HSE compliant edge protection",
        "Rapid installation systems",
        "Adjustable height options",
        "Temporary and permanent solutions",
        "Roof edge protection specialists",
        "Fall arrest system integration",
        "Regular safety inspections",
        "Certified installation teams"
      ],
      faqs: getServiceFAQs("edge protection")
    },
    "temporary-roof-systems": {
      title: "Temporary Roof Systems",
      description: "Weather protection and temporary roofing solutions for ongoing construction and maintenance work. Keep your project dry and on schedule.",
      benefits: [
        "Complete weather protection",
        "Load-rated temporary roofs",
        "Quick assembly systems",
        "Custom design solutions",
        "Gutter and drainage included",
        "Access integration options",
        "Professional installation",
        "Dismantling service provided"
      ],
      faqs: getServiceFAQs("temporary roof systems")
    },
    "birdcage-scaffolds": {
      title: "Birdcage Scaffold Systems",
      description: "Independent birdcage scaffold structures providing comprehensive access for complex commercial and industrial projects requiring extensive coverage.",
      benefits: [
        "Independent structure design",
        "Heavy-duty load capacity",
        "Complex access solutions",
        "Multi-level platforms",
        "Equipment support capability",
        "Professional engineering",
        "Safety compliance guaranteed",
        "Custom configuration options"
      ],
      faqs: getServiceFAQs("birdcage scaffolds")
    },
    "scaffold-towers-mast-systems": {
      title: "Scaffold Towers & Mast Systems",
      description: "Mobile and static scaffold towers for flexible access solutions on various project types. Height-adjustable systems with quick setup capability.",
      benefits: [
        "Mobile and static options",
        "Height adjustable systems",
        "Quick setup and dismantling",
        "Lightweight aluminum construction",
        "Narrow access capability",
        "Professional grade equipment",
        "Safety guardrails included",
        "Transport and delivery available"
      ],
      faqs: getServiceFAQs("scaffold towers & mast systems")
    }
  };

  return serviceDataMap[slug] || {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    description: "Professional scaffolding solution with full compliance and safety standards.",
    benefits: [
      "TG20:21 compliant installation",
      "CISRS qualified teams",
      "Full insurance coverage",
      "Professional service guarantee"
    ],
    faqs: getServiceFAQs(slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
  };
}

export async function generateStaticParams() {
  const entries = await fs.readdir(DIR);
  return entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const serviceData = getServiceData(slug);
  const serviceName = serviceData.title.replace(' Services', '').replace(' Solutions', '').replace(' Systems', '');
  
  return { 
    title: `${serviceData.title} | Professional Scaffolding | Colossus Scaffolding`,
    description: serviceData.description,
    openGraph: { 
      title: `${serviceData.title} | Professional Scaffolding | Colossus Scaffolding`,
      description: serviceData.description,
      url: absUrl(`/services/${slug}`),
      siteName: "Colossus Scaffolding",
      images: serviceData.heroImage ? [
        {
          url: absUrl(serviceData.heroImage),
          width: 1200,
          height: 630,
          alt: `${serviceName} - ${serviceData.title}`
        }
      ] : [
        {
          url: absUrl("/static/logo.png"),
          width: 1200,
          height: 630,
          alt: `${serviceName} - Colossus Scaffolding`
        }
      ],
      locale: "en_GB",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${serviceData.title} | Professional Scaffolding | Colossus Scaffolding`,
      description: serviceData.description,
      images: serviceData.heroImage ? [absUrl(serviceData.heroImage)] : [absUrl("/static/logo.png")]
    },
    alternates: {
      canonical: absUrl(`/services/${slug}`)
    }
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const serviceData = getServiceData(slug);
  const serviceName = serviceData.title.replace(' Services', '').replace(' Solutions', '').replace(' Systems', '');

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absUrl(`/services/${slug}#service`),
    name: serviceData.title,
    description: serviceData.description,
    url: absUrl(`/services/${slug}`),
    category: "Scaffolding",
    serviceType: serviceName,
    provider: {
      "@type": "Organization",
      "@id": absUrl("/#organization"),
      name: "Colossus Scaffolding",
      url: absUrl("/"),
      logo: absUrl("/static/logo.png")
    },
    areaServed: [
      { "@type": "Place", name: "East Sussex" },
      { "@type": "Place", name: "West Sussex" },
      { "@type": "Place", name: "Kent" },
      { "@type": "Place", name: "Surrey" },
      { "@type": "Place", name: "Essex" },
      { "@type": "Place", name: "London" }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${serviceName} Benefits`,
      itemListElement: serviceData.benefits.map((benefit, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: benefit,
          description: benefit
        }
      }))
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "45"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absUrl(`/services/${slug}#faq`),
    mainEntity: serviceData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: "Services",
        item: absUrl("/services")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: serviceName,
        item: absUrl(`/services/${slug}`)
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absUrl(`/services/${slug}`),
    name: serviceData.title,
    description: serviceData.description,
    url: absUrl(`/services/${slug}`),
    isPartOf: {
      "@id": absUrl("/#website")
    },
    about: {
      "@id": absUrl(`/services/${slug}#service`)
    },
    breadcrumb: {
      "@id": absUrl(`/services/${slug}#breadcrumb`)
    }
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />
      
      <ServiceHero
        title={serviceData.title}
        description={serviceData.description}
        badge={serviceData.badge}
        heroImage={serviceData.heroImage}
      />
      
      <ServiceBenefits
        title="Why Choose Our Service?"
        description="Professional scaffolding with complete safety compliance and expert installation teams."
        items={serviceData.benefits}
      />
      
      <ServiceGallery
        title="Project Gallery"
        description="View our professional scaffolding installations and completed projects."
        images={serviceData.galleryImages}
      />
      
      <ServiceFAQ
        items={serviceData.faqs}
      />
      
      <ServiceCTA />
    </>
  );
}
