import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

import { LocationServices } from "@/components/ui/location-services";
import { LocationCoverage } from "@/components/ui/location-coverage";
import { ServiceCTA } from "@/components/ui/service-cta";
import { absUrl } from "@/lib/site";
import { getLocationDataWithFallback, getAllLocations } from "@/lib/locations";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "locations");

// MDX content loading functions
async function getMDXContent(slug: string) {
  try {
    const filePath = path.join(DIR, `${slug}.mdx`);
    console.log(`DEBUG: Attempting to read MDX file: ${filePath}`);
    const raw = await fs.readFile(filePath, "utf8");
    console.log(`DEBUG: MDX file read successfully, length: ${raw.length}`);
    const { data: frontmatter, content } = matter(raw);
    console.log(`DEBUG: Frontmatter parsed, keys: ${Object.keys(frontmatter)}`);
    return { frontmatter, content, hasMDX: true };
  } catch (error) {
    console.log(`DEBUG: Failed to read MDX file: ${error}`);
    // No MDX file found, will fallback to centralized data
    return { frontmatter: null, content: null, hasMDX: false };
  }
}

export async function generateStaticParams() {
  // Generate params from both MDX files and centralized location data
  const mdxEntries = await fs.readdir(DIR).catch(() => []);
  const mdxParams = mdxEntries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));

  // Add params from centralized location data
  const locationParams = getAllLocations().map((location) => ({ slug: location.slug }));

  // Combine and deduplicate
  const allParams = [...mdxParams, ...locationParams];
  const uniqueParams = Array.from(new Map(allParams.map((p) => [p.slug, p])).values());

  console.log("DEBUG: generateStaticParams - MDX params:", mdxParams);
  console.log("DEBUG: generateStaticParams - Location params:", locationParams);
  console.log("DEBUG: generateStaticParams - All unique params:", uniqueParams);

  return uniqueParams;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await getMDXContent(slug);

  // Use MDX frontmatter if available, otherwise fallback to centralized data
  if (frontmatter) {
    return {
      title: frontmatter.seoTitle || `${frontmatter.title} | Colossus Scaffolding`,
      description: frontmatter.description,
      keywords: Array.isArray(frontmatter.keywords)
        ? frontmatter.keywords.join(", ")
        : frontmatter.keywords,
      openGraph: {
        title: frontmatter.seoTitle || `${frontmatter.title} | Colossus Scaffolding`,
        description: frontmatter.description,
        url: absUrl(`/locations/${slug}`),
        siteName: "Colossus Scaffolding",
        images: [
          {
            url: absUrl("/static/logo.png"),
            width: 1200,
            height: 630,
            alt: `Professional scaffolding services in ${frontmatter.title} - Colossus Scaffolding`,
          },
        ],
        locale: "en_GB",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.seoTitle || `${frontmatter.title} | Colossus Scaffolding`,
        description: frontmatter.description,
      },
      alternates: {
        canonical: absUrl(`/locations/${slug}`),
      },
    };
  }

  // Fallback to centralized data
  const locationData = getLocationDataWithFallback(slug);
  return {
    title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
    description: locationData.description,
    openGraph: {
      title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
      url: absUrl(`/locations/${slug}`),
      siteName: "Colossus Scaffolding",
      images: locationData.heroImage
        ? [
            {
              url: absUrl(locationData.heroImage),
              width: 1200,
              height: 630,
              alt: `Scaffolding Services in ${locationData.title} - Colossus Scaffolding`,
            },
          ]
        : [
            {
              url: absUrl("/static/logo.png"),
              width: 1200,
              height: 630,
              alt: `Scaffolding Services in ${locationData.title} - Colossus Scaffolding`,
            },
          ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Scaffolding Services in ${locationData.title} | Colossus Scaffolding`,
      description: locationData.description,
      images: locationData.heroImage
        ? [absUrl(locationData.heroImage)]
        : [absUrl("/static/logo.png")],
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`),
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  // Try to load MDX first for ALL locations
  const { frontmatter, hasMDX } = await getMDXContent(slug);

  // UNIFIED TEMPLATE: Show sections based on what content exists
  if (hasMDX && frontmatter) {
    console.log(`✅ SIMPLE FIX: Loading unified template for ${slug}`);

    return (
      <PageLayout>
        <div className="relative -mt-10 -mx-6 lg:-mx-6">
          {/* Breadcrumbs - always show if exists */}
          {frontmatter.breadcrumbs && (
            <div className="bg-gray-50 border-b">
              <div className="container-standard py-4">
                <Breadcrumbs items={frontmatter.breadcrumbs} />
              </div>
            </div>
          )}

          {/* Hero - always show */}
          <HeroSection
            title={frontmatter.hero?.title || `Professional Scaffolding in ${frontmatter.title}`}
            description={frontmatter.hero?.description || frontmatter.description}
            phone={frontmatter.hero?.phone || "01424 466 661"}
            trustBadges={
              frontmatter.hero?.trustBadges || [
                "TG20:21 Compliant",
                "CHAS Accredited",
                "£10M Insured",
              ]
            }
            heroImage={frontmatter.heroImage}
            ctaText={frontmatter.hero?.ctaText}
            ctaUrl={frontmatter.hero?.ctaUrl}
          />

          {/* Specialists - only show if exists */}
          {frontmatter.specialists?.title && (
            <LargeFeatureCards
              title={frontmatter.specialists.title}
              description={frontmatter.specialists.description}
              cards={frontmatter.specialists.cards}
              columns={frontmatter.specialists.columns || 3}
              backgroundColor={frontmatter.specialists.backgroundColor || "gray"}
              showBottomCTA={frontmatter.specialists.showBottomCTA || false}
            />
          )}

          {/* Services - only show if exists */}
          {frontmatter.services?.title && (
            <ServiceShowcase
              title={frontmatter.services.title}
              description={frontmatter.services.description}
              services={frontmatter.services.cards}
            />
          )}

          {/* Pricing - only show if exists */}
          {frontmatter.pricing?.title && (
            <PricingPackages
              title={frontmatter.pricing.title}
              description={frontmatter.pricing.description}
              packages={frontmatter.pricing.packages}
              location={frontmatter.title}
            />
          )}

          {/* Local Authority - only show if exists */}
          {frontmatter.localAuthority?.title && (
            <LocalAuthorityExpertise
              title={frontmatter.localAuthority.title}
              description={frontmatter.localAuthority.description}
              locationName={frontmatter.localAuthority.locationName}
              authorityName={frontmatter.localAuthority.authorityName}
              expertiseItems={frontmatter.localAuthority.expertiseItems}
              supportItems={frontmatter.localAuthority.supportItems}
            />
          )}

          {/* FAQs - only show if exists */}
          {frontmatter.faqs?.length > 0 && (
            <LocationFAQ
              title={`${frontmatter.title} Scaffolding FAQ`}
              location={frontmatter.title}
              items={frontmatter.faqs}
            />
          )}

          {/* Towns Directory - only show if exists */}
          {frontmatter.towns?.title && (
            <section className="py-16 bg-white">
              <div className="container-standard">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    {frontmatter.towns.title}
                  </h2>
                  <p className="text-lg text-gray-800 max-w-3xl mx-auto">
                    {frontmatter.towns.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {frontmatter.towns.townsList.map(
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
          {frontmatter.cta?.title && (
            <CTASection
              title={frontmatter.cta.title}
              description={frontmatter.cta.description}
              primaryButtonText={frontmatter.cta.primaryButtonText}
              primaryButtonUrl={frontmatter.cta.primaryButtonUrl}
              secondaryButtonText={frontmatter.cta.secondaryButtonText}
              secondaryButtonUrl={frontmatter.cta.secondaryButtonUrl}
              trustBadges={frontmatter.cta.trustBadges}
            />
          )}
        </div>

        {/* Schema - only show if exists */}
        {frontmatter.schema?.service && (
          <Schema
            service={frontmatter.schema.service}
            faqs={frontmatter.faqs || []}
            breadcrumbs={
              frontmatter.breadcrumbs?.map((b: { name: string; href: string }) => ({
                name: b.name,
                url: b.href,
              })) || []
            }
          />
        )}
      </PageLayout>
    );
  }

  // Fallback to centralized data approach
  const locationData = getLocationDataWithFallback(slug);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absUrl(`/locations/${slug}#localbusiness`),
    name: `Colossus Scaffolding - ${locationData.title}`,
    description: locationData.description,
    url: absUrl(`/locations/${slug}`),
    serviceArea: {
      "@type": "Place",
      name: locationData.title,
      containedInPlace: {
        "@type": "Place",
        name: locationData.county,
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Scaffolding Services in ${locationData.title}`,
      itemListElement: locationData.services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: absUrl(service.href),
        },
      })),
    },
    parentOrganization: {
      "@id": absUrl("/#organization"),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "67",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absUrl(`/locations/${slug}#faq`),
    mainEntity: locationData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: absUrl("/locations"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: locationData.title,
        item: absUrl(`/locations/${slug}`),
      },
    ],
  };

  const breadcrumbItems = [
    { name: "Locations", href: "/locations" },
    { name: locationData.title, href: `/locations/${slug}`, current: true },
  ];

  return (
    <PageLayout>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="container-standard py-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        {/* County Hero Section - Rebuilt from scratch */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto w-full lg:w-[90%] px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  {locationData.badge && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-blue/10 text-brand-blue border border-brand-blue/20 mb-4">
                      {locationData.badge}
                    </div>
                  )}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Scaffolding in {locationData.title}
                  </h1>
                  <p className="text-xl text-gray-800 mt-6 leading-relaxed">
                    {locationData.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="btn-primary-lg">
                    Get Free Quote
                  </Link>
                  <Link
                    href="tel:01424466661"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call: 01424 466661
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-brand-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    TG20:21 Compliant
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-brand-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    CHAS Accredited
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-brand-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    £10M Insured
                  </div>
                </div>
              </div>

              <div className="lg:order-first">
                <div className="relative h-[400px] rounded-2xl shadow-lg overflow-hidden bg-gray-200">
                  {locationData.heroImage ? (
                    <Image
                      src={locationData.heroImage}
                      alt={`Scaffolding services in ${locationData.title}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-lg font-medium">Location Hero Image</span>
                        <p className="text-sm mt-1">{locationData.title} scaffolding project</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LocationServices
          title="Professional Scaffolding Services"
          description="Comprehensive scaffolding solutions delivered by CISRS qualified teams with full TG20:21 compliance."
          services={locationData.services}
          location={locationData.title}
        />

        <LocationCoverage
          location={locationData.title}
          county={locationData.county}
          projectTypes={locationData.projectTypes}
          coverageAreas={locationData.coverageAreas}
        />

        <LocationFAQ items={locationData.faqs} location={locationData.title} />

        <ServiceCTA
          title="Ready to Start Your Project?"
          description={`Contact our expert team for professional scaffolding services in ${locationData.title}. Free quotes and rapid response times across the area.`}
        />
      </div>
    </PageLayout>
  );
}
