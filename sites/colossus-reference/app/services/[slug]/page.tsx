import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";

import {
  ServiceHero,
  ServiceAbout,
  ServiceFAQ,
  ServiceCTA,
  Breadcrumbs,
  Schema,
} from "@platform/core-components";
import { absUrl } from "@/lib/site";
import { deriveLocationContext, getAreaServed } from "@/lib/location-utils";
import { getLocationSlugs } from "@/lib/locations-config";
import { getImageUrl } from "@/lib/image";
import { loadMdx } from "@/lib/mdx";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "services");

/** Default region-level areas for non-location-specific services */
const DEFAULT_AREAS = ["East Sussex", "West Sussex", "Kent", "Surrey"];

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
  about?: {
    whatIs: string;
    whenNeeded: string[];
    whatAchieve: string[];
    keyPoints?: string[];
  };
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
      heroImage: data.hero?.image || data.heroImage, // Read from hero.image or fallback to root heroImage
      galleryImages: data.galleryImages,
      about: data.about,
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
      title: "Service Not Found",
      description: "The requested service page could not be found.",
    };
  }

  const serviceName = serviceData.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  // Enhanced local SEO for service-location combinations
  const knownLocations = await getLocationSlugs();
  const locationContext = deriveLocationContext(slug, knownLocations);
  const isLocationSpecific = locationContext !== null;
  // SEO: Keep titles under 60 characters to prevent Google truncation
  let optimizedTitle = serviceData.seoTitle || `${serviceName} | Colossus`;
  const optimizedDescription = serviceData.description;
  let keywords: string[] = serviceData.keywords || [];

  if (isLocationSpecific && locationContext) {
    const { locationName } = locationContext;

    // Optimize title for local SEO (under 60 characters)
    // Pattern: "Commercial Scaffolding Brighton | Colossus" = ~41 chars
    optimizedTitle = serviceData.seoTitle || `${serviceName} ${locationName} | Colossus`;

    // Add location-specific keywords if not already present
    if (keywords.length === 0) {
      keywords = [
        `${slug.replace("-", " ")}`,
        `${locationName} scaffolding hire`,
        `scaffolding ${locationName}`,
        `${serviceName.toLowerCase()} ${locationName}`,
      ];
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
              url: getImageUrl(serviceData.heroImage),
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
        ? [getImageUrl(serviceData.heroImage)]
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

  // Load MDX content for body rendering
  const { content: mdxContent } = await loadMdx({ baseDir: "services", slug });

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
  const knownLocations = await getLocationSlugs();
  const locationContext = deriveLocationContext(slug, knownLocations);
  const isLocationSpecific = locationContext !== null;

  // Build breadcrumbs based on location-specific or general service
  const breadcrumbItems =
    isLocationSpecific && locationContext
      ? [
          { name: "Locations", href: "/locations" },
          {
            name: locationContext.locationName,
            href: `/locations/${locationContext.locationSlug}`,
          },
          { name: serviceName, href: `/services/${slug}`, current: true },
        ]
      : [
          { name: "Services", href: "/services" },
          { name: serviceName, href: `/services/${slug}`, current: true },
        ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Location Services Button for location-specific services */}
      {isLocationSpecific && locationContext && (
        <section className="bg-brand-primary/5 border-b">
          <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
            <Link
              href={`/locations/${locationContext.locationSlug}`}
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              More scaffolding services in {locationContext.locationName}
            </Link>
          </div>
        </section>
      )}

      <div>
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
          badge={serviceData.badge}
          heroImage={serviceData.heroImage}
        />

        <ServiceAbout serviceName={serviceName} slug={slug} about={serviceData.about} />

        {/* MDX Body Content - Process sections, location grids, related services */}
        {mdxContent}

        <ServiceFAQ items={serviceData.faqs} />

        <ServiceCTA />
      </div>

      <Schema
        service={{
          id: `/services/${slug}#service`,
          url: `/services/${slug}`,
          name: serviceData.title,
          description: serviceData.description,
          serviceType: serviceName,
          areaServed: locationContext ? getAreaServed(locationContext.location) : DEFAULT_AREAS,
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={
          isLocationSpecific && locationContext
            ? [
                { name: "Home", url: "/" },
                { name: "Locations", url: "/locations" },
                {
                  name: locationContext.locationName,
                  url: `/locations/${locationContext.locationSlug}`,
                },
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
