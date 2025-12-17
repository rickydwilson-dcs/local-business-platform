import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";

import { PageLayout } from "@/components/layouts/page-layout";
import { HeroSection } from "@/components/ui/hero-section";
import { LargeFeatureCards } from "@/components/ui/large-feature-cards";
import { ServiceShowcase } from "@/components/ui/service-showcase";
import { PricingPackages } from "@/components/ui/pricing-packages";
import { LocalAuthorityExpertise } from "@/components/ui/local-authority-expertise";
import { LocationFAQ } from "@/components/ui/location-faq";
import { CTASection } from "@/components/ui/cta-section";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Schema from "@/components/Schema";
import { absUrl } from "@/lib/site";
import { getServiceAreaSchema } from "@/lib/schema";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "locations");

interface LocationData {
  title: string;
  seoTitle?: string;
  description: string;
  keywords?: string[];
  heroImage?: string;
  hero?: {
    title?: string;
    description?: string;
    phone?: string;
    trustBadges?: string[];
    ctaText?: string;
    ctaUrl?: string;
  };
  breadcrumbs?: Array<{
    name: string;
    href: string;
    current?: boolean;
  }>;
  specialists?: {
    title: string;
    description: string;
    cards: Array<{
      title: string;
      description: string;
      image?: string;
      details?: string[];
    }>;
    columns?: 2 | 3 | 4;
    backgroundColor?: "gray" | "white";
    showBottomCTA?: boolean;
  };
  services?: {
    title: string;
    description: string;
    cards: Array<{
      title: string;
      subtitle?: string[];
      description: string;
      features?: string[];
      href: string;
      ctaText?: string;
      image?: string;
    }>;
  };
  pricing?: {
    title: string;
    description: string;
    packages: Array<{
      name: string;
      description: string;
      price?: string;
      priceRange?: string;
      duration?: string;
      features: string[];
      highlighted?: boolean;
      ctaText?: string;
      ctaUrl?: string;
    }>;
  };
  localAuthority?: {
    title: string;
    description: string;
    locationName: string;
    authorityName: string;
    expertiseItems: Array<{
      title: string;
      description: string;
    }>;
    supportItems: Array<{
      title: string;
      description: string;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  towns?: {
    title: string;
    description: string;
    townsList: Array<{
      slug: string;
      name: string;
      description: string;
    }>;
  };
  cta?: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonUrl: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    trustBadges?: string[];
  };
  schema?: {
    service: {
      id: string;
      url: string;
      name: string;
      description: string;
      serviceType: string;
      areaServed: string[];
    };
  };
}

/**
 * Read MDX file and parse frontmatter
 */
async function getLocationData(slug: string): Promise<LocationData | null> {
  try {
    const filePath = path.join(DIR, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data } = matter(fileContent);

    return data as LocationData;
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
  const locationData = await getLocationData(slug);

  if (!locationData) {
    return {
      title: "Location Not Found",
      description: "The requested location page could not be found.",
    };
  }

  return {
    title: locationData.seoTitle || `${locationData.title} | Colossus Scaffolding`,
    description: locationData.description,
    keywords: Array.isArray(locationData.keywords)
      ? locationData.keywords.join(", ")
      : locationData.keywords,
    openGraph: {
      title: locationData.seoTitle || `${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
      url: absUrl(`/locations/${slug}`),
      siteName: "Colossus Scaffolding",
      images: [
        {
          url: absUrl("/static/logo.png"),
          width: 1200,
          height: 630,
          alt: `Professional scaffolding services in ${locationData.title} - Colossus Scaffolding`,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: locationData.seoTitle || `${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`),
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const locationData = await getLocationData(slug);

  if (!locationData) {
    return (
      <PageLayout>
        <div className="container-standard section-standard">
          <h1 className="heading-hero">Location Not Found</h1>
          <p className="text-body-lg">The requested location could not be found.</p>
          <Link href="/locations" className="btn-primary mt-8">
            View All Locations
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        {/* Breadcrumbs - always show if exists */}
        {locationData.breadcrumbs && (
          <div className="bg-gray-50 border-b">
            <div className="container-standard py-4">
              <Breadcrumbs items={locationData.breadcrumbs} />
            </div>
          </div>
        )}

        {/* Hero - always show */}
        <HeroSection
          title={locationData.hero?.title || `Professional Scaffolding in ${locationData.title}`}
          description={locationData.hero?.description || locationData.description}
          phone={locationData.hero?.phone || "01424 466 661"}
          trustBadges={
            locationData.hero?.trustBadges || [
              "TG20:21 Compliant",
              "CHAS Accredited",
              "£10M Insured",
            ]
          }
          heroImage={locationData.heroImage}
          ctaText={locationData.hero?.ctaText}
          ctaUrl={locationData.hero?.ctaUrl}
        />

        {/* Specialists - only show if exists */}
        {locationData.specialists?.title && (
          <LargeFeatureCards
            title={locationData.specialists.title}
            description={locationData.specialists.description}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cards={locationData.specialists.cards as any}
            columns={locationData.specialists.columns || 3}
            backgroundColor={locationData.specialists.backgroundColor || "gray"}
            showBottomCTA={locationData.specialists.showBottomCTA || false}
          />
        )}

        {/* Services - only show if exists */}
        {locationData.services?.title && (
          <ServiceShowcase
            title={locationData.services.title}
            description={locationData.services.description}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            services={locationData.services.cards as any}
          />
        )}

        {/* Pricing - only show if exists */}
        {locationData.pricing?.title && (
          <PricingPackages
            title={locationData.pricing.title}
            description={locationData.pricing.description}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            packages={locationData.pricing.packages as any}
            location={locationData.title}
          />
        )}

        {/* Local Authority - only show if exists */}
        {locationData.localAuthority?.title && (
          <LocalAuthorityExpertise
            title={locationData.localAuthority.title}
            description={locationData.localAuthority.description}
            locationName={locationData.localAuthority.locationName}
            authorityName={locationData.localAuthority.authorityName}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expertiseItems={locationData.localAuthority.expertiseItems as any}
            supportItems={locationData.localAuthority.supportItems}
          />
        )}

        {/* FAQs - only show if exists */}
        {locationData.faqs?.length > 0 && (
          <LocationFAQ
            title={`${locationData.title} Scaffolding FAQ`}
            location={locationData.title}
            items={locationData.faqs}
          />
        )}

        {/* Towns Directory - only show if exists */}
        {locationData.towns?.title && (
          <section className="py-16 bg-white">
            <div className="container-standard">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {locationData.towns.title}
                </h2>
                <p className="text-lg text-gray-800 max-w-3xl mx-auto">
                  {locationData.towns.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData.towns.townsList.map(
                  (town: { slug: string; name: string; description: string }) => (
                    <Link
                      key={town.slug}
                      href={`/locations/${town.slug}`}
                      className="group p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all duration-200"
                    >
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-blue mb-2">
                        {town.name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-3">{town.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Local Specialists
                        </span>
                        <svg
                          className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA - only show if exists */}
        {locationData.cta?.title && (
          <CTASection
            title={locationData.cta.title}
            description={locationData.cta.description}
            primaryButtonText={locationData.cta.primaryButtonText}
            primaryButtonUrl={locationData.cta.primaryButtonUrl}
            secondaryButtonText={locationData.cta.secondaryButtonText}
            secondaryButtonUrl={locationData.cta.secondaryButtonUrl}
            trustBadges={locationData.cta.trustBadges}
          />
        )}
      </div>

      {/* Schema - only show if exists */}
      {locationData.schema?.service && (
        <Schema
          service={locationData.schema.service}
          faqs={locationData.faqs || []}
          breadcrumbs={
            locationData.breadcrumbs?.map((b: { name: string; href: string }) => ({
              name: b.name,
              url: b.href,
            })) || []
          }
        />
      )}

      {/* ServiceArea Schema for location-specific SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getServiceAreaSchema(locationData.title, slug)),
        }}
      />
    </PageLayout>
  );
}
