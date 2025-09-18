import path from "path";
import { promises as fs } from "fs";
import type { Metadata } from "next";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

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

import { LocationHero } from "@/components/ui/location-hero";
import { LocationServices } from "@/components/ui/location-services";
import { LocationCoverage } from "@/components/ui/location-coverage";
import { ServiceCTA } from "@/components/ui/service-cta";
import { absUrl } from "@/lib/site";
import { getLocationDataWithFallback, getAllLocations } from "@/lib/locations";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "locations");

// MDX content loading functions
async function getMDXContent(slug: string) {
  try {
    const filePath = path.join(DIR, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, "utf8");
    const { data: frontmatter, content } = matter(raw);
    return { frontmatter, content, hasMDX: true };
  } catch {
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
  const { frontmatter, content, hasMDX } = await getMDXContent(slug);

  // If we have MDX content, render it with Brighton-style components
  if (hasMDX && frontmatter) {
    // Transform frontmatter data for components
    const heroData = frontmatter.hero || {};
    const specialistsData = frontmatter.specialists || {};
    const servicesData = frontmatter.services || {};
    const pricingData = frontmatter.pricing || {};
    const localAuthorityData = frontmatter.localAuthority || {};
    const faqData = frontmatter.faqs || [];
    const ctaData = frontmatter.cta || {};
    const breadcrumbData = frontmatter.breadcrumbs || [];
    const schemaData = frontmatter.schema || {};

    return (
      <PageLayout>
        <div className="relative -mt-10 -mx-6 lg:-mx-6">
          <div className="bg-gray-50 border-b">
            <div className="container-standard py-4">
              <Breadcrumbs items={breadcrumbData} />
            </div>
          </div>

          <HeroSection
            title={heroData.title}
            description={heroData.description}
            phone={heroData.phone}
            trustBadges={heroData.trustBadges}
            ctaText={heroData.ctaText}
            ctaUrl={heroData.ctaUrl}
          />

          {specialistsData.title && (
            <LargeFeatureCards
              title={specialistsData.title}
              description={specialistsData.description}
              cards={specialistsData.cards}
              columns={specialistsData.columns || 2}
              backgroundColor={specialistsData.backgroundColor || "gray"}
              showBottomCTA={specialistsData.showBottomCTA || true}
            />
          )}

          {servicesData.title && (
            <ServiceShowcase
              title={servicesData.title}
              description={servicesData.description}
              services={servicesData.cards}
            />
          )}

          {pricingData.title && (
            <PricingPackages
              title={pricingData.title}
              description={pricingData.description}
              packages={pricingData.packages}
              location={frontmatter.title}
            />
          )}

          {localAuthorityData.title && (
            <LocalAuthorityExpertise
              title={localAuthorityData.title}
              description={localAuthorityData.description}
              locationName={localAuthorityData.locationName}
              authorityName={localAuthorityData.authorityName}
              expertiseItems={localAuthorityData.expertiseItems}
              supportItems={localAuthorityData.supportItems}
            />
          )}

          {faqData.length > 0 && (
            <LocationFAQ
              title={`${frontmatter.title} Scaffolding FAQ`}
              location={frontmatter.title}
              items={faqData}
            />
          )}

          {/* Render MDX content (service sections) */}
          {content && (
            <section className="section-standard bg-white">
              <div className="container-standard">
                <div className="prose prose-lg max-w-none">
                  <MDXRemote source={content} />
                </div>
              </div>
            </section>
          )}

          {ctaData.title && (
            <CTASection
              title={ctaData.title}
              description={ctaData.description}
              primaryButtonText={ctaData.primaryButtonText}
              primaryButtonUrl={ctaData.primaryButtonUrl}
              secondaryButtonText={ctaData.secondaryButtonText}
              secondaryButtonUrl={ctaData.secondaryButtonUrl}
              trustBadges={ctaData.trustBadges}
            />
          )}
        </div>

        {schemaData.service && (
          <Schema
            service={schemaData.service}
            faqs={faqData}
            breadcrumbs={breadcrumbData.map((b: { name: string; href: string }) => ({
              name: b.name,
              url: b.href,
            }))}
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
    <>
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

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <LocationHero
        title={locationData.title}
        description={locationData.description}
        badge={locationData.badge}
        heroImage={locationData.heroImage}
      />

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
    </>
  );
}
