/**
 * Location Detail Page — composition renderer version
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Schema, type LocationFrontmatter } from "@platform/core-components";
import { getLocations, getLocation } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import { getServiceAreaSchema } from "@/lib/schema";
import compositionConfig from "../../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getLocation(slug);

  if (!result) {
    return {
      title: "Location Not Found",
      description: "The requested location could not be found.",
    };
  }

  const fm = result.frontmatter as unknown as LocationFrontmatter;
  const title = fm.seoTitle || `Services in ${fm.title} | ${siteConfig.business.name}`;
  const description =
    fm.description || `Professional services in ${fm.title} from ${siteConfig.business.name}.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    openGraph: {
      title: `Services in ${fm.title}`,
      description,
      url: absUrl(`/locations/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [
            {
              url: getImageUrl(heroImage),
              width: 1200,
              height: 630,
              alt: `Services in ${fm.title}`,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Services in ${fm.title}`,
      description,
      images: heroImage ? [getImageUrl(heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`),
    },
  };
}

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getLocation(slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as unknown as LocationFrontmatter;
  const { content } = await loadMdx({ baseDir: "locations", slug });

  const locationName = fm.title;
  const heroImage = fm.hero?.image || fm.heroImage;
  const faqs = fm.faqs || [];

  const locationSchema = getServiceAreaSchema(locationName, slug);

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Locations", url: "/locations" },
          { name: locationName, url: `/locations/${slug}` },
        ]}
        webpage={{
          "@type": "WebPage",
          "@id": absUrl(`/locations/${slug}#webpage`),
          url: absUrl(`/locations/${slug}`),
          name: `Services in ${locationName}`,
          description: fm.description || "",
        }}
        faqs={faqs}
      />
    </>
  );

  const { elements } = renderComposedPage({
    composition: config,
    pageType: "location-detail",
    data: {
      ...(siteData as unknown as Record<string, unknown>),
      ...fm,
      title: fm.title,
      description: fm.description,
      hero: {
        heading: `Electricians in ${locationName}`,
        subheading:
          (fm as unknown as Record<string, string | undefined>).description ||
          `Professional electrical services in ${locationName} by ${siteConfig.business.name}.`,
        eyebrow: locationName,
        heroImageSrc: heroImage,
        primaryCtaText: "Get Free Quote",
        primaryCtaHref: "/contact",
        secondaryCtaText: `Call ${PHONE_DISPLAY}`,
        secondaryCtaHref: `tel:${siteConfig.business.phone}`,
        trustBadges: ["NICEIC Approved", "Fully Insured", "Free Quotes"],
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: locationName, href: `/locations/${slug}` },
        ],
      },
      heroImage,
      faqs,
      mdxContent: { content },
      phone: siteConfig.business.phone,
      phoneDisplay: PHONE_DISPLAY,
      services: {
        heading: `Services in ${locationName}`,
        services: siteConfig.services.slice(0, 6).map((s) => ({
          title: s.title,
          description: s.description,
          href: `/services/${s.slug}`,
        })),
      },
    },
  });

  return (
    <>
      {schemaNodes}
      <main className="min-h-screen">{elements}</main>
    </>
  );
}
