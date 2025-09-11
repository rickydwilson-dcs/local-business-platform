import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";

import { ServiceHero } from "@/components/ui/service-hero";
import { ServiceBenefits } from "@/components/ui/service-benefits";
import { ServiceGallery } from "@/components/ui/service-gallery";
import { ServiceFAQ } from "@/components/ui/service-faq";
import { ServiceCTA } from "@/components/ui/service-cta";

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

function getServiceData(slug: string): ServiceData {
  const serviceDataMap: Record<string, ServiceData> = {
    "access-scaffolding": {
      title: "Access Scaffolding Services",
      description: "Safe, TG20:21-compliant access scaffolding for residential, commercial, and industrial projects across the South East UK. Professional installation with full insurance coverage.",
      badge: "Most Popular",
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
      faqs: [
        {
          question: "How quickly can you install access scaffolding?",
          answer: "For standard residential projects, we can typically install within 24-48 hours of confirmation. Larger commercial projects may require 2-3 days depending on complexity and design requirements."
        },
        {
          question: "Do you provide scaffolding inspections?",
          answer: "Yes, all scaffolding installations include a handover certificate and we conduct regular inspections at least every 7 days, after adverse weather, and following any modifications."
        },
        {
          question: "Is your scaffolding compliant with safety regulations?",
          answer: "All our scaffolding is designed and erected to TG20:21 standards, with CHAS accreditation and full compliance with HSE regulations. We're fully insured with £10M public liability coverage."
        },
        {
          question: "Can you handle planning permissions for scaffolding?",
          answer: "We assist with planning requirements and can handle license applications for scaffolding on public land. Our experienced team knows local authority requirements across the South East."
        }
      ]
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
      faqs: [
        {
          question: "What types of facade work can your scaffolding support?",
          answer: "Our facade scaffolding supports all types of external building work including rendering, painting, window replacement, cladding, and general maintenance work on residential and commercial properties."
        },
        {
          question: "Do you provide weather protection for facade scaffolding?",
          answer: "Yes, we offer weather protection systems including scaffold sheeting, temporary roofs, and protective barriers to ensure work can continue in various weather conditions."
        },
        {
          question: "How do you handle scaffolding around windows and architectural features?",
          answer: "Our experienced team designs bespoke solutions to work around windows, bay windows, balconies, and other architectural features while maintaining full access and safety compliance."
        }
      ]
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
      faqs: [
        {
          question: "What heights require edge protection?",
          answer: "HSE regulations require edge protection for any working height above 2 meters where there's a risk of falling. We provide compliant systems for all heights and situations."
        },
        {
          question: "Can edge protection be installed on existing structures?",
          answer: "Yes, our edge protection systems can be retrofitted to existing buildings, scaffolding, and structures. We assess each situation to provide the most suitable solution."
        },
        {
          question: "How quickly can edge protection be installed?",
          answer: "Most edge protection systems can be installed within a few hours to a day, depending on the complexity and size of the area requiring protection."
        }
      ]
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
      faqs: [
        {
          question: "How long can temporary roofs remain in place?",
          answer: "Our temporary roof systems are designed for both short-term (weeks) and long-term (months) installations, depending on your project requirements and local authority permissions."
        },
        {
          question: "Can temporary roofs support additional loads?",
          answer: "Yes, our temporary roofs are engineered to specific load requirements and can support additional equipment, materials, and snow loads as required by your project."
        },
        {
          question: "Do you provide drainage solutions for temporary roofs?",
          answer: "All temporary roof installations include proper drainage systems with guttering and downpipes to effectively manage rainwater and prevent water damage."
        }
      ]
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
      faqs: [
        {
          question: "What projects require birdcage scaffolding?",
          answer: "Birdcage scaffolding is ideal for large commercial projects, industrial maintenance, ceiling work, and any project requiring extensive access coverage over a wide area."
        },
        {
          question: "How much weight can birdcage scaffolding support?",
          answer: "Our birdcage scaffolds are engineered to support specific loads including materials, equipment, and personnel. Load calculations are provided with each design."
        },
        {
          question: "Can birdcage scaffolding be modified during a project?",
          answer: "Yes, birdcage systems can be modified and extended as project requirements change. All modifications are properly engineered and certified."
        }
      ]
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
      faqs: [
        {
          question: "What's the maximum height for scaffold towers?",
          answer: "Our scaffold towers can reach heights up to 12 meters for mobile towers and higher for static installations, all designed to relevant safety standards."
        },
        {
          question: "Are scaffold towers suitable for outdoor use?",
          answer: "Yes, our towers are designed for both indoor and outdoor use, with stabilization systems and weather-resistant components for safe outdoor operation."
        },
        {
          question: "Can I hire towers for DIY projects?",
          answer: "We provide towers for professional use only, with full installation, inspection, and safety certification included in our service."
        }
      ]
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
    faqs: [
      {
        question: "How can I get a quote for this service?",
        answer: "Contact our team for a free, no-obligation quote. We'll assess your requirements and provide a detailed proposal within 24 hours."
      }
    ]
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
  return { 
    title: serviceData.title, 
    description: serviceData.description, 
    openGraph: { 
      title: serviceData.title, 
      description: serviceData.description 
    } 
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const serviceData = getServiceData(slug);

  return (
    <>
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
