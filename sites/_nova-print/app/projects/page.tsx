/**
 * Projects Listing Page
 * =====================
 *
 * Portfolio of completed projects.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { NovaProjectsPage } from "@platform/themes/nova/pages";
import { getProjects } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
  description: `View our portfolio of completed projects. From residential to commercial, see our work in action across ${siteConfig.serviceAreas.join(", ")}.`,
  keywords: ["projects", "case studies", "portfolio", "completed work", "examples"],
  openGraph: {
    title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
    description: `View our portfolio of completed projects. From residential to commercial developments.`,
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return (
    <>
      <NovaProjectsPage
        siteConfig={siteSummary}
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          heroImage: p.heroImage ? getImageUrl(p.heroImage) : undefined,
          date: p.year?.toString(),
          tags: p.services,
        }))}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ]}
        webpage={{
          "@type": "CollectionPage",
          "@id": absUrl("/projects#collection"),
          url: absUrl("/projects"),
          name: `${siteConfig.business.name} Projects`,
          description: `Portfolio of completed projects. From residential to commercial developments.`,
        }}
      />
    </>
  );
}
