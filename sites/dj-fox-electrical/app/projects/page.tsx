import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";
import { getProjects } from "@/lib/content";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Our Projects | Case Studies | D J Fox Electrical",
  description:
    "View our portfolio of completed projects. From residential to commercial, see our work in action across Eastbourne, Hastings, Bexhill-on-Sea, Brighton, Lewes, Hailsham.",
  keywords: ["projects", "case studies", "portfolio", "completed work", "examples"],
  openGraph: {
    title: "Our Projects | Case Studies | D J Fox Electrical",
    description:
      "View our portfolio of completed projects. From residential to commercial developments.",
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const data = {
    ...(siteData as unknown as Record<string, unknown>),
    projects: {
      ...((siteData as unknown as Record<string, unknown>).projects as Record<string, unknown>),
      projects: projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.completionDate,
        tags: p.services,
      })),
    },
  };
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "projects",
    data,
  });
  return <main className="min-h-screen">{elements}</main>;
}
