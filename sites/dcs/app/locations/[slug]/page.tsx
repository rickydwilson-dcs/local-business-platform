/**
 * Location Detail Page
 * ====================
 *
 * Individual location page with MDX content rendering.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema, type LocationFrontmatter } from "@platform/core-components";
import { SiteLocationDetailPage } from "@/components/pages/LocationDetailPage";
import { getLocations, getLocation } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { getServiceAreaSchema } from "@/lib/schema";
import { PHONE_DISPLAY } from "@/lib/contact-info";

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
  const title = fm.seoTitle || `Web Design in ${fm.title} | ${siteConfig.business.name}`;
  const description =
    fm.description ||
    `Professional web design services in ${fm.title} from ${siteConfig.business.name}.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    openGraph: {
      title: `Web Design in ${fm.title}`,
      description,
      url: absUrl(`/locations/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [
            {
              url: getImageUrl(heroImage),
              width: 1200,
              height: 630,
              alt: `Web Design in ${fm.title}`,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Web Design in ${fm.title}`,
      description,
      images: heroImage ? [getImageUrl(heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`),
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getLocation(slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as unknown as LocationFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: "locations", slug });

  const locationName = fm.title;
  const heroImage = fm.hero?.image || fm.heroImage;
  const faqs = fm.faqs || [];

  const locationSchema = getServiceAreaSchema(locationName, slug);

  const breadcrumbItems = [
    { name: "Locations", href: "/locations" },
    { name: locationName, href: `/locations/${slug}`, current: true },
  ];

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

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
          name: `Web Design in ${locationName}`,
          description: fm.description || "",
        }}
        faqs={faqs}
      />
    </>
  );

  return (
    <SiteLocationDetailPage
      siteConfig={siteSummary}
      frontmatter={{
        title: fm.title,
        description: fm.description,
        heroImage,
        faqs: fm.faqs,
        hero: fm.hero,
      }}
      mdxContent={mdxContent}
      breadcrumbs={breadcrumbItems}
      schemaNodes={schemaNodes}
    />
  );
}
