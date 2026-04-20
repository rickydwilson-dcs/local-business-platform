/**
 * Service Detail Page — composition renderer version
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { FAQItem, AboutContent } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { getServices, getService } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import compositionConfig from "../../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

interface ServiceFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  badge?: string;
  keywords?: string[];
  hero?: { image?: string };
  heroImage?: string;
  benefits?: string[];
  faqs?: FAQItem[];
  about?: AboutContent;
}

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getService(slug);

  if (!result) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const fm = result.frontmatter as ServiceFrontmatter;
  const title = fm.seoTitle || `${fm.title} | ${siteConfig.business.name}`;
  const description = fm.description || `Learn about our ${fm.title} services.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    openGraph: {
      title: fm.title,
      description,
      url: absUrl(`/services/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [
            {
              url: getImageUrl(heroImage),
              width: 1200,
              height: 630,
              alt: `${fm.title} - ${siteConfig.business.name}`,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description,
      images: heroImage ? [getImageUrl(heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/services/${slug}`),
    },
  };
}

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getService(slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as ServiceFrontmatter;
  const { content } = await loadMdx({ baseDir: "services", slug });

  const serviceName = fm.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  const heroImage = fm.hero?.image || fm.heroImage;
  const benefits = fm.benefits || [];
  const faqs = fm.faqs || [];

  const schemaNodes = (
    <Schema
      org={{
        name: siteConfig.business.name,
        url: "/",
        logo: "/logo.svg",
      }}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: serviceName, url: `/services/${slug}` },
      ]}
      service={{
        id: `/services/${slug}#service`,
        url: `/services/${slug}`,
        name: fm.title,
        description: fm.description || "",
        serviceType: serviceName,
        areaServed: siteConfig.serviceAreas,
      }}
      faqs={faqs}
    />
  );

  const { elements } = renderComposedPage({
    composition: config,
    pageType: "service-detail",
    data: {
      ...(siteData as unknown as Record<string, unknown>),
      ...fm,
      title: fm.title,
      description: fm.description,
      badge: fm.badge,
      hero: {
        heading: fm.title,
        subheading:
          fm.description ||
          `Professional ${fm.title.toLowerCase()} services by ${siteConfig.business.name}.`,
        eyebrow: "Our Services",
        image: heroImage,
        heroImageSrc: heroImage,
        primaryCtaText: "Get Free Quote",
        primaryCtaHref: "/contact",
        secondaryCtaText: `Call ${PHONE_DISPLAY}`,
        secondaryCtaHref: `tel:${siteConfig.business.phone}`,
        trustBadges: ["NICEIC Approved", "Fully Insured", "Free Quotes"],
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: serviceName, href: `/services/${slug}` },
        ],
      },
      heroImage,
      benefits,
      faqs,
      mdxContent: { content },
      phone: siteConfig.business.phone,
      phoneDisplay: PHONE_DISPLAY,
    },
  });

  return (
    <>
      {schemaNodes}
      <main className="min-h-screen">{elements}</main>
    </>
  );
}
