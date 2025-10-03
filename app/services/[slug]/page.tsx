import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";

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
  seoTitle?: string;
  description: string;
  badge?: string;
  keywords?: string[];
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  heroImage?: string;
  galleryImages?: string[];
  businessHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  localContact?: {
    phone: string;
    email: string;
    address?: string;
  };
}

/**
 * Read MDX file and parse frontmatter
 */
async function getServiceDataFromMDX(slug: string): Promise<ServiceData | null> {
  try {
    const filePath = path.join(DIR, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data } = matter(fileContent);

    // Map MDX frontmatter to ServiceData interface
    return {
      title: data.title,
      seoTitle: data.seoTitle,
      description: data.description,
      badge: data.badge,
      keywords: data.keywords,
      benefits: data.benefits || [],
      faqs: data.faqs || [],
      heroImage: data.heroImage,
      galleryImages: data.galleryImages,
      businessHours: data.businessHours,
      localContact: data.localContact,
    };
  } catch (error) {
    console.error(`Error reading MDX for ${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const entries = await fs.readdir(DIR);
  return entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const serviceData = await getServiceDataFromMDX(slug);

  if (!serviceData) {
    return {
      title: "Service Not Found | Colossus Scaffolding",
      description: "The requested service page could not be found.",
    };
  }

  const serviceName = serviceData.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  // Enhanced local SEO for service-location combinations
  const isLocationSpecific =
    slug.includes("-brighton") || slug.includes("-canterbury") || slug.includes("-hastings");
  let optimizedTitle = serviceData.seoTitle || `${serviceData.title} | Colossus Scaffolding`;
  const optimizedDescription = serviceData.description;
  let keywords: string[] = serviceData.keywords || [];

  if (isLocationSpecific) {
    // Extract location from slug
    const location = slug.split("-").pop();
    const locationName = location ? location.charAt(0).toUpperCase() + location.slice(1) : "";

    // Optimize title for local SEO (under 60 characters)
    optimizedTitle =
      serviceData.seoTitle || `${serviceData.title} | ${locationName} | Colossus Scaffolding`;

    // Add location-specific keywords if not already present
    if (keywords.length === 0) {
      if (location === "brighton") {
        keywords = [
          `${slug.replace("-", " ")}`,
          `${locationName} scaffolding hire`,
          `scaffolding ${locationName}`,
          "coastal scaffolding",
          "Victorian terrace scaffolding",
          "Regency property scaffolding",
        ];
      } else if (location === "canterbury") {
        keywords = [
          `${slug.replace("-", " ")}`,
          `${locationName} scaffolding hire`,
          `scaffolding ${locationName}`,
          "World Heritage Site scaffolding",
          "cathedral scaffolding",
          "medieval building scaffolding",
        ];
      } else if (location === "hastings") {
        keywords = [
          `${slug.replace("-", " ")}`,
          `${locationName} scaffolding hire`,
          `scaffolding ${locationName}`,
          "Old Town scaffolding",
          "medieval scaffolding",
          "cliff top scaffolding",
        ];
      }
    }
  } else {
    // General service keywords if not provided
    if (keywords.length === 0) {
      keywords = [
        serviceName.toLowerCase(),
        `${serviceName.toLowerCase()} hire`,
        "TG20:21 scaffolding",
        "professional scaffolding",
        "CISRS scaffolding",
        "scaffolding services UK",
      ];
    }
  }

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywords,
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: absUrl(`/services/${slug}`),
      siteName: "Colossus Scaffolding",
      images: serviceData.heroImage
        ? [
            {
              url: absUrl(serviceData.heroImage),
              width: 1200,
              height: 630,
              alt: `${serviceName} - ${serviceData.title}`,
            },
          ]
        : [
            {
              url: absUrl("/static/logo.png"),
              width: 1200,
              height: 630,
              alt: `${serviceName} - Colossus Scaffolding`,
            },
          ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: optimizedTitle,
      description: optimizedDescription,
      images: serviceData.heroImage
        ? [absUrl(serviceData.heroImage)]
        : [absUrl("/static/logo.png")],
    },
    alternates: {
      canonical: absUrl(`/services/${slug}`),
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const serviceData = await getServiceDataFromMDX(slug);

  if (!serviceData) {
    return (
      <div className="container-standard section-standard">
        <h1 className="heading-hero">Service Not Found</h1>
        <p className="text-body-lg">The requested service could not be found.</p>
        <Link href="/services" className="btn-primary mt-8">
          View All Services
        </Link>
      </div>
    );
  }

  const serviceName = serviceData.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  // Detect if this is a location-specific service
  const isLocationSpecific =
    slug.includes("-brighton") || slug.includes("-canterbury") || slug.includes("-hastings");
  let locationName = "";
  let locationSlug = "";

  if (isLocationSpecific) {
    const parts = slug.split("-");
    const lastPart = parts[parts.length - 1];
    locationName = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    locationSlug = lastPart;
  }

  // Build breadcrumbs based on location-specific or general service
  const breadcrumbItems = isLocationSpecific
    ? [
        { name: "Locations", href: "/locations" },
        { name: locationName, href: `/locations/${locationSlug}` },
        { name: serviceName, href: `/services/${slug}`, current: true },
      ]
    : [
        { name: "Services", href: "/services" },
        { name: serviceName, href: `/services/${slug}`, current: true },
      ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Location Services Button for location-specific services */}
      {isLocationSpecific && (
        <section className="bg-brand-blue/5 border-b">
          <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
            <Link
              href={`/locations/${locationSlug}`}
              className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-hover font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              More scaffolding services in {locationName}
            </Link>
          </div>
        </section>
      )}

      <ServiceHero
        title={serviceData.title}
        description={serviceData.description}
        badge={serviceData.badge}
        heroImage={serviceData.heroImage}
      />

      <ServiceAbout serviceName={serviceName} slug={slug} />

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

      <ServiceFAQ items={serviceData.faqs} />

      <ServiceCTA />

      <Schema
        service={{
          id: `/services/${slug}#service`,
          url: `/services/${slug}`,
          name: serviceData.title,
          description: serviceData.description,
          serviceType: serviceName,
          areaServed:
            slug.includes("-brighton") || slug.includes("-canterbury") || slug.includes("-hastings")
              ? (() => {
                  const location = slug.split("-").pop();
                  if (location === "brighton") {
                    return [
                      "Brighton",
                      "Brighton & Hove",
                      "Hove",
                      "The Lanes",
                      "Kemptown",
                      "Churchill Square",
                      "Brighton Marina",
                      "North Laine",
                      "Preston Park",
                      "Fiveways",
                    ];
                  } else if (location === "canterbury") {
                    return [
                      "Canterbury",
                      "Canterbury City Centre",
                      "World Heritage Site Canterbury",
                      "University of Kent",
                      "Canterbury Cathedral Precinct",
                      "Whitstable",
                      "Herne Bay",
                      "Faversham",
                    ];
                  } else if (location === "hastings") {
                    return [
                      "Hastings",
                      "Old Town Hastings",
                      "St Leonards",
                      "East Hill",
                      "West Hill",
                      "Ore",
                      "Hollington",
                      "Silverhill",
                    ];
                  }
                  return ["East Sussex", "West Sussex", "Kent", "Surrey"];
                })()
              : ["East Sussex", "West Sussex", "Kent", "Surrey"],
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={
          isLocationSpecific
            ? [
                { name: "Home", url: "/" },
                { name: "Locations", url: "/locations" },
                { name: locationName, url: `/locations/${locationSlug}` },
                { name: serviceName, url: `/services/${slug}` },
              ]
            : [
                { name: "Home", url: "/" },
                { name: "Services", url: "/services" },
                { name: serviceName, url: `/services/${slug}` },
              ]
        }
        faqs={serviceData.faqs}
      />
    </>
  );
}
