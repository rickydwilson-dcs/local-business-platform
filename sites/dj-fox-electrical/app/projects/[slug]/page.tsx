/**
 * Project Detail Page — composition renderer version
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { getProjects, getProject } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import compositionConfig from "../../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const { frontmatter } = project;

  return {
    title: frontmatter.seoTitle || `${frontmatter.title} | ${siteConfig.business.name}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/projects/${slug}`),
      siteName: siteConfig.business.name,
      type: "article",
      images: [
        {
          url: getImageUrl(frontmatter.heroImage),
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [getImageUrl(frontmatter.heroImage)],
    },
    alternates: {
      canonical: absUrl(`/projects/${slug}`),
    },
  };
}

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter } = project;
  const { content } = await loadMdx({ baseDir: "projects", slug });

  const schemaNodes = (
    <Schema
      org={{
        name: siteConfig.business.name,
        url: "/",
        logo: "/logo.svg",
      }}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: frontmatter.title, url: `/projects/${slug}` },
      ]}
      webpage={{
        "@type": "WebPage",
        "@id": absUrl(`/projects/${slug}#webpage`),
        url: absUrl(`/projects/${slug}`),
        name: frontmatter.title,
        description: frontmatter.description,
      }}
    />
  );

  const { elements } = renderComposedPage({
    composition: config,
    pageType: "project-detail",
    data: {
      ...(siteData as unknown as Record<string, unknown>),
      ...frontmatter,
      title: frontmatter.title,
      description: frontmatter.description,
      heroImage: frontmatter.heroImage,
      hero: {
        heading: frontmatter.title,
        subheading: frontmatter.description || "",
        eyebrow: frontmatter.category || "Projects",
        image: frontmatter.heroImage,
        heroImageSrc: frontmatter.heroImage,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: frontmatter.title, href: `/projects/${slug}` },
        ],
      },
      outcomes: frontmatter.results,
      category: frontmatter.category,
      locationName: frontmatter.locationName,
      year: frontmatter.year,
      duration: frontmatter.duration,
      faqs: frontmatter.faqs,
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
