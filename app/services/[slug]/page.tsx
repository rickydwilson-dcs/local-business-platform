import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";

import { ServiceHero } from "@/components/ui/service-hero";
import ServiceAbout from "@/components/ui/service-about";
import { ServiceBenefits } from "@/components/ui/service-benefits";
import { ServiceGallery } from "@/components/ui/service-gallery";
import { ServiceFAQ } from "@/components/ui/service-faq";
import { ServiceCTA } from "@/components/ui/service-cta";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Schema from "@/components/Schema";
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


// Generate location-specific FAQs for services
function getServiceFAQs(serviceName: string): Array<{ question: string; answer: string }> {
  const locationGroups = [
    { locations: "Brighton, Lewes, Eastbourne", county: "East Sussex" },
    { locations: "Crawley, Horsham, Worthing", county: "West Sussex" },
    { locations: "Maidstone, Canterbury, Ashford", county: "Kent" },
    { locations: "Guildford, Woking, Croydon", county: "Surrey" },
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
      heroImage: "/Facade Scaffolding.png",
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
      heroImage: "/Edge Protection.png",
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
      heroImage: "/Temporary Roof Systems.png",
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
      heroImage: "/Birdcage scaffolding.png",
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
      heroImage: "/Scaffold Towers & Mast Systems.png",
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
    },
    "crash-decks-crane-decks": {
      title: "Crash Decks & Crane Decks",
      description: "Protective crash decks and crane decks ensuring safety during construction operations with load-bearing capabilities and professional installation.",
      heroImage: "/Crash Decks & Crane Decks.png",
      benefits: [
        "Load-bearing deck systems",
        "Professional safety compliance",
        "Custom design solutions",
        "Rapid installation service",
        "Heavy-duty construction",
        "Weather-resistant materials",
        "Safety barrier integration",
        "Expert engineering support"
      ],
      faqs: getServiceFAQs("crash decks & crane decks")
    },
    "heavy-duty-industrial-scaffolding": {
      title: "Heavy Duty Industrial Scaffolding",
      description: "Heavy-duty scaffolding solutions for complex industrial projects and infrastructure work with high load capacity and expert engineering.",
      heroImage: "/Heavy Industrial Scaffolding.png",
      benefits: [
        "Heavy load capacity systems",
        "Industrial-grade materials",
        "Complex structure capability",
        "Professional engineering design",
        "Safety compliance guaranteed",
        "Custom configuration options",
        "Expert installation teams",
        "Long-term project support"
      ],
      faqs: getServiceFAQs("heavy duty industrial scaffolding")
    },
    "pavement-gantries-loading-bays": {
      title: "Pavement Gantries & Loading Bays",
      description: "Specialized pavement gantries and loading bay solutions for urban construction projects with pedestrian safety and loading access.",
      heroImage: "/Pavement Gantries Loading Bays.png",
      benefits: [
        "Urban construction solutions",
        "Pedestrian safety priority",
        "Loading access capability",
        "Traffic management integration",
        "Planning permission support",
        "Professional installation",
        "Safety barrier systems",
        "Custom design solutions"
      ],
      faqs: getServiceFAQs("pavement gantries & loading bays")
    },
    "public-access-staircases": {
      title: "Public Access Staircases",
      description: "Safe and compliant public access staircase systems for construction sites with accessible design and code compliance.",
      heroImage: "/Public Access Staircases.png",
      benefits: [
        "Public safety compliance",
        "Accessible design standards",
        "Building code compliant",
        "Professional installation",
        "Safety handrail systems",
        "Weather-resistant construction",
        "Custom configuration options",
        "Regular safety inspections"
      ],
      faqs: getServiceFAQs("public access staircases")
    },
    "scaffold-alarms": {
      title: "Scaffold Alarm Systems",
      description: "Advanced scaffold alarm systems for enhanced site security and safety monitoring with 24/7 monitoring and instant alerts.",
      heroImage: "/Scaffold Alarms.png",
      benefits: [
        "24/7 security monitoring",
        "Instant alert systems",
        "Security system integration",
        "Professional installation",
        "Remote monitoring capability",
        "Theft prevention systems",
        "Custom alarm configuration",
        "Expert technical support"
      ],
      faqs: getServiceFAQs("scaffold alarm systems")
    },
    "scaffolding-design-drawings": {
      title: "Scaffolding Design & Drawings",
      description: "Professional scaffolding design and technical drawings ensuring structural integrity and compliance with all safety regulations.",
      heroImage: "/Scaffolding Design & Drawings.png",
      benefits: [
        "Structural engineering analysis",
        "CAD technical drawings",
        "Load calculation reports",
        "Safety compliance documentation",
        "Planning permission support",
        "Method statement preparation",
        "Risk assessment inclusion",
        "Professional certification"
      ],
      faqs: getServiceFAQs("scaffolding design & drawings")
    },
    "scaffolding-inspections-maintenance": {
      title: "Scaffolding Inspections & Maintenance",
      description: "Comprehensive scaffolding inspections and maintenance services ensuring ongoing safety compliance and structural integrity.",
      heroImage: "/Scaffolding Inspections & Maintenance.png",
      benefits: [
        "Weekly safety inspections",
        "Detailed inspection reports",
        "Maintenance scheduling",
        "Compliance certification",
        "Emergency repair service",
        "Documentation management",
        "Safety standard updates",
        "Professional inspector teams"
      ],
      faqs: getServiceFAQs("scaffolding inspections & maintenance")
    },
    "sheeting-netting-encapsulation": {
      title: "Sheeting, Netting & Encapsulation",
      description: "Weather protection and safety encapsulation systems including scaffolding sheeting, debris netting, and full encapsulation solutions.",
      heroImage: "/Sheeting Netting Encapsulation.png",
      benefits: [
        "Weather protection systems",
        "Debris containment netting",
        "Full encapsulation solutions",
        "Fire-retardant materials",
        "UV-resistant sheeting",
        "Custom fitting service",
        "Professional installation",
        "Maintenance support included"
      ],
      faqs: getServiceFAQs("sheeting, netting & encapsulation")
    },
    "staircase-towers": {
      title: "Staircase Towers",
      description: "Safe and compliant staircase tower systems providing secure vertical access for construction and maintenance projects.",
      heroImage: "/Staircase Towers.png",
      benefits: [
        "Safe vertical access",
        "Compliant stair design",
        "Handrail safety systems",
        "Multi-level capability",
        "Quick assembly process",
        "Weather-resistant construction",
        "Load-bearing capacity",
        "Professional installation"
      ],
      faqs: getServiceFAQs("staircase towers")
    },
    "suspended-scaffolding": {
      title: "Suspended Scaffolding",
      description: "Specialized suspended scaffolding systems for high-rise building maintenance and construction work requiring overhead access.",
      heroImage: "/Suspended Scaffolding.png",
      benefits: [
        "High-rise access capability",
        "Suspended platform systems",
        "Safety harness integration",
        "Load-tested equipment",
        "Professional rigging service",
        "Emergency descent systems",
        "Weather monitoring inclusion",
        "Certified operator training"
      ],
      faqs: getServiceFAQs("suspended scaffolding")
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

  const breadcrumbItems = [
    { name: "Services", href: "/services" },
    { name: serviceName, href: `/services/${slug}`, current: true }
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <ServiceHero
        title={serviceData.title}
        description={serviceData.description}
        badge={serviceData.badge}
        heroImage={serviceData.heroImage}
      />

      <ServiceAbout
        serviceName={serviceName}
        slug={slug}
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

      <Schema
        service={{
          id: `/services/${slug}#service`,
          url: `/services/${slug}`,
          name: serviceData.title,
          description: serviceData.description,
          serviceType: serviceName,
          areaServed: ["East Sussex", "West Sussex", "Kent", "Surrey"]
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg"
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: serviceName, url: `/services/${slug}` }
        ]}
        faqs={serviceData.faqs}
      />
    </>
  );
}
