/**
 * Speaker Bio Page — thin wrapper
 *
 * Loads speaker data + MDX content, delegates rendering to RigelSpeakerDetailPage.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentItems, getContentItem } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary, SpeakerSummary, BreadcrumbItem } from "@platform/core-components";
import { RigelSpeakerDetailPage } from "@platform/themes/rigel/pages";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

interface SpeakerFrontmatter {
  name: string;
  slug: string;
  title: string;
  topic: string;
  description: string;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
  featured: boolean;
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
}

export async function generateStaticParams() {
  const speakers = await getContentItems("speakers");
  return speakers.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getContentItem("speakers", slug);

  if (!result) {
    return { title: "Speaker Not Found" };
  }

  const fm = result.frontmatter as unknown as SpeakerFrontmatter;

  return {
    title: `${fm.name} | Speakers | Digital Marketing Weekend 2026`,
    description: fm.description,
    openGraph: {
      title: `${fm.name} — ${fm.topic}`,
      description: fm.description,
      url: `/speakers/${slug}`,
      type: "website",
    },
  };
}

export default async function SpeakerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getContentItem("speakers", slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as unknown as SpeakerFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: "speakers", slug });

  const speakerData: SpeakerSummary = {
    slug,
    name: fm.name,
    title: fm.title,
    topic: fm.topic,
    description: fm.description,
    day: fm.day,
    time: fm.time,
    stage: fm.stage,
    featured: fm.featured,
    imageAlt: fm.imageAlt,
    social: fm.social,
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Speakers", href: "/speakers" },
    { name: fm.name, href: `/speakers/${slug}`, current: true },
  ];

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <RigelSpeakerDetailPage
      siteConfig={siteSummary}
      frontmatter={speakerData}
      mdxContent={mdxContent}
      breadcrumbs={breadcrumbs}
    />
  );
}
