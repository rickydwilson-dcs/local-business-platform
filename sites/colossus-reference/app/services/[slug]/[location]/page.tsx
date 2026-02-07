import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";

import { ServiceHero } from "@/components/ui/service-hero";
import { ServiceAbout } from "@/components/ui/service-about";
import { ServiceFAQ } from "@/components/ui/service-faq";
import { ServiceCTA } from "@/components/ui/service-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Schema } from "@/components/Schema";
import { absUrl } from "@/lib/site";
import { getAreaServed } from "@/lib/location-utils";
import { getImageUrl } from "@/lib/image";
import { loadMdx } from "@/lib/mdx";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string; location: string };

/**
 * Location-specific service pages use nested URL pattern:
 * /services/{service}/{location}
 *
 * Example: /services/commercial-scaffolding/brighton
 *
 * Content is stored in: content/services/{service}/{location}.mdx
 */

const SERVICES_DIR = path.join(process.cwd(), "content", "services");

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
 * Get the MDX file path for a service-location combination
 */
function getContentPath(slug: string, location: string): string {
  return path.join(SERVICES_DIR, slug, `${location}.mdx`);
}

/**
 * Read MDX file and parse frontmatter
 */
async function getServiceDataFromMDX(slug: string, location: string): Promise<ServiceData | null> {
  try {
    const filePath = getContentPath(slug, location);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      seoTitle: data.seoTitle,
      description: data.description,
      badge: data.badge,
      keywords: data.keywords,
      benefits: data.benefits || [],
      faqs: data.faqs || [],
      heroImage: data.hero?.image || data.heroImage,
      galleryImages: data.galleryImages,
      about: data.about,
      businessHours: data.businessHours,
      localContact: data.localContact,
    };
  } catch (error) {
    console.error(`Error reading MDX for ${slug}/${location}:`, error);
    return null;
  }
}

/**
 * Dynamically discover all service-location combinations by scanning
 * content/services/ for subdirectories containing .mdx files.
 */
async function discoverLocationServices(): Promise<Params[]> {
  const params: Params[] = [];
  const entries = await fs.readdir(SERVICES_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const serviceSlug = entry.name;
    const serviceDir = path.join(SERVICES_DIR, serviceSlug);
    const files = await fs.readdir(serviceDir);

    for (const file of files) {
      if (file.toLowerCase().endsWith(".mdx")) {
        params.push({
          slug: serviceSlug,
          location: file.replace(/\.mdx$/i, ""),
        });
      }
    }
  }

  return params;
}

/**
 * Generate static params for all service-location combinations
 */
export async function generateStaticParams() {
  return discoverLocationServices();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, location } = await params;
  const serviceData = await getServiceDataFromMDX(slug, location);

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

  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  // SEO: Keep titles under 60 characters to prevent Google truncation
  const optimizedTitle = serviceData.seoTitle || `${serviceName} ${locationName} | Colossus`;
  const optimizedDescription = serviceData.description;
  const canonicalUrl = `/services/${slug}/${location}`;

  // Location-specific keywords
  let keywords: string[] = serviceData.keywords || [];
  if (keywords.length === 0) {
    keywords = [
      `${serviceName.toLowerCase()} ${locationName.toLowerCase()}`,
      `${locationName} scaffolding hire`,
      `scaffolding ${locationName}`,
      `${serviceName.toLowerCase()} services ${locationName}`,
    ];
  }

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywords,
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: absUrl(canonicalUrl),
      siteName: "Colossus Scaffolding",
      images: serviceData.heroImage
        ? [
            {
              url: getImageUrl(serviceData.heroImage),
              width: 1200,
              height: 630,
              alt: `${serviceName} in ${locationName}`,
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
      canonical: absUrl(canonicalUrl),
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug, location } = await params;
  const serviceData = await getServiceDataFromMDX(slug, location);

  // Load MDX content - use nested path format
  const { content: mdxContent } = await loadMdx({
    baseDir: "services",
    slug: `${slug}/${location}`,
  });

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

  const locationName = location.charAt(0).toUpperCase() + location.slice(1);
  const canonicalUrl = `/services/${slug}/${location}`;

  // Build breadcrumbs for location-specific service
  const breadcrumbItems = [
    { name: "Services", href: "/services" },
    { name: serviceName.replace(` ${locationName}`, ""), href: `/services/${slug}` },
    { name: locationName, href: canonicalUrl, current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Location Services Button */}
      <section className="bg-brand-blue/5 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Link
            href={`/locations/${location}`}
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

      <div>
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
          badge={serviceData.badge}
          heroImage={serviceData.heroImage}
        />

        <ServiceAbout
          serviceName={serviceName}
          slug={`${slug}/${location}`}
          about={serviceData.about}
        />

        {/* MDX Body Content */}
        {mdxContent}

        <ServiceFAQ items={serviceData.faqs} />

        <ServiceCTA />
      </div>

      <Schema
        service={{
          id: `${canonicalUrl}#service`,
          url: canonicalUrl,
          name: serviceData.title,
          description: serviceData.description,
          serviceType: serviceName,
          areaServed: getAreaServed(location),
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: serviceName.replace(` ${locationName}`, ""), url: `/services/${slug}` },
          { name: locationName, url: canonicalUrl },
        ]}
        faqs={serviceData.faqs}
      />
    </>
  );
}
