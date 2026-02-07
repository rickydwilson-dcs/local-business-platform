import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Schema, Breadcrumbs } from "@platform/core-components";
import { getProjects, type Project } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Our Projects | Scaffolding Case Studies South East",
  description:
    "View our portfolio of scaffolding projects across Sussex, Kent, and Surrey. From heritage restorations to commercial developments, see our work in action.",
  keywords: [
    "scaffolding projects",
    "scaffolding case studies",
    "scaffolding portfolio",
    "commercial scaffolding projects",
    "residential scaffolding projects",
  ],
  openGraph: {
    title: "Our Projects | Scaffolding Case Studies South East",
    description:
      "View our portfolio of scaffolding projects across Sussex, Kent, and Surrey. From heritage restorations to commercial developments.",
    url: "/projects",
    type: "website",
  },
};

const projectTypeLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  heritage: "Heritage",
};

const categoryLabels: Record<string, string> = {
  heritage: "Heritage",
  "new-build": "New Build",
  renovation: "Renovation",
  maintenance: "Maintenance",
  emergency: "Emergency",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <Link href={`/projects/${project.slug}`} className="block relative h-56 overflow-hidden">
        <Image
          src={getImageUrl(project.heroImage)}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2">
            <span className="bg-brand-blue text-white text-xs font-semibold px-2 py-1 rounded">
              {projectTypeLabels[project.projectType] || project.projectType}
            </span>
            <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded">
              {categoryLabels[project.category] || project.category}
            </span>
          </div>
          <h2 className="text-white font-bold text-lg line-clamp-2">{project.title}</h2>
        </div>
      </Link>
      <div className="p-5">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {project.locationName}
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {project.year}
          </div>
          {project.duration && (
            <>
              <span className="text-gray-300">|</span>
              <span>{project.duration}</span>
            </>
          )}
        </div>

        {project.client?.rating && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < project.client!.rating! ? "text-yellow-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-1">Client Rating</span>
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-brand-blue font-medium text-sm hover:underline"
        >
          View Project
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featuredProjects = projects.filter((p) => p.status === "featured");

  // Calculate stats
  const uniqueLocations = new Set(projects.map((p) => p.location)).size;
  const totalProjects = projects.length;

  const breadcrumbItems = [{ name: "Projects", href: "/projects", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-white">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Our Projects</h1>
              <p className="text-xl text-gray-800 mb-8 mx-auto max-w-3xl">
                Explore our portfolio of scaffolding projects across the South East. From heritage
                restorations to large commercial developments, we deliver excellence on every job.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue">{totalProjects}+</div>
                  <div className="text-sm text-gray-600">Completed Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue">{uniqueLocations}</div>
                  <div className="text-sm text-gray-600">Locations Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue">100%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="section-standard bg-white">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Featured Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredProjects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Projects */}
        <section className="section-standard bg-gray-50">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredProjects.length > 0 ? "All Projects" : "Our Projects"}
            </h2>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No projects yet. Check back soon to see our latest work.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-gray-800 mb-6">
                Have a project that needs professional scaffolding?
              </p>
              <Link href="/contact" className="btn-primary-lg">
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Schema
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ]}
        webpage={{
          "@type": "CollectionPage",
          "@id": absUrl("/projects#collection"),
          url: absUrl("/projects"),
          name: "Colossus Scaffolding Projects",
          description:
            "Portfolio of scaffolding projects across Sussex, Kent, and Surrey. From heritage restorations to commercial developments.",
        }}
      />
    </>
  );
}
