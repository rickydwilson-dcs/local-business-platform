/**
 * Projects Listing Page
 * =====================
 *
 * Portfolio of completed projects.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { SolarisProjectsPage } from "@platform/themes/solaris/pages";
import { getProjects } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Our Portfolio | Case Studies | ${siteConfig.business.name}`,
  description: `View our portfolio of completed websites. See how we've helped tradespeople across ${siteConfig.serviceAreas.join(", ")} get more jobs online.`,
  keywords: ["portfolio", "case studies", "web design examples", "tradesperson websites"],
  openGraph: {
    title: `Our Portfolio | Case Studies | ${siteConfig.business.name}`,
    description: `View our portfolio of completed websites for local tradespeople.`,
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
      <SolarisProjectsPage
        siteConfig={siteSummary}
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          heroImage: p.heroImage,
          date: p.year?.toString(),
          tags: [p.projectType],
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
          { name: "Portfolio", url: "/projects" },
        ]}
        webpage={{
          "@type": "CollectionPage",
          "@id": absUrl("/projects#collection"),
          url: absUrl("/projects"),
          name: `${siteConfig.business.name} Portfolio`,
          description: `Portfolio of completed websites for local tradespeople.`,
        }}
      />
    </>
  );
}
