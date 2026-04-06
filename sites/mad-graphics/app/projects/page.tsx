/**
 * Projects Listing Page
 * =====================
 *
 * Portfolio of completed projects with stats and featured highlights.
 * Adapts to site branding via site.config.ts.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Schema, Breadcrumbs } from '@platform/core-components';
import { getProjects, type Project } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
  description: `View our portfolio of completed projects. From residential to commercial, see our work in action across ${siteConfig.serviceAreas.join(', ')}.`,
  keywords: ['projects', 'case studies', 'portfolio', 'completed work', 'examples'],
  openGraph: {
    title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
    description: `View our portfolio of completed projects. From residential to commercial developments.`,
    url: '/projects',
    type: 'website',
  },
};

const projectTypeLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  heritage: 'Heritage',
};

const categoryLabels: Record<string, string> = {
  // Scaffolding categories
  heritage: 'Heritage',
  'new-build': 'New Build',
  renovation: 'Renovation',
  maintenance: 'Maintenance',
  emergency: 'Emergency',
  // Graphics categories
  'vehicle-graphics': 'Vehicle Graphics',
  'signs-signage': 'Signs & Signage',
  banners: 'Banners',
  'large-format-print': 'Large Format Print',
  'marketing-print': 'Marketing Print',
  'stickers-labels': 'Stickers & Labels',
  'workwear-merchandise': 'Workwear',
  'graphic-design': 'Graphic Design',
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-surface-background rounded-lg overflow-hidden group border border-surface-border hover:border-brand-primary/50 transition-colors">
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
            <span className="bg-brand-primary text-brand-on-primary text-xs font-semibold px-2 py-1 rounded">
              {projectTypeLabels[project.projectType] || project.projectType}
            </span>
            <span className="bg-surface-background/90 text-surface-foreground text-xs font-medium px-2 py-1 rounded">
              {categoryLabels[project.category] || project.category}
            </span>
          </div>
          <h2 className="text-surface-foreground font-bold text-lg line-clamp-2">{project.title}</h2>
        </div>
      </Link>
      <div className="p-5">
        <p className="text-surface-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 text-sm text-surface-muted mb-4">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
            {project.locationName}
          </div>
          <span className="text-surface-border">|</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              calendar_month
            </span>
            {project.year}
          </div>
          {project.duration && (
            <>
              <span className="text-surface-border">|</span>
              <span>{project.duration}</span>
            </>
          )}
        </div>

        {project.client?.rating && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-base ${i < project.client!.rating! ? 'text-brand-primary' : 'text-surface-border'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
            <span className="text-sm text-surface-muted ml-1">Client Rating</span>
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-brand-primary font-medium text-sm hover:underline"
        >
          View Project
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featuredProjects = projects.filter((p) => p.status === 'featured');

  // Calculate stats
  const uniqueLocations = new Set(projects.map((p) => p.location)).size;
  const totalProjects = projects.length;

  const breadcrumbItems = [{ name: 'Projects', href: '/projects', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-surface-subtle to-surface-background">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Our Projects</h1>
              <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
                Explore our portfolio of completed projects. From residential to commercial, we
                deliver excellence on every job.
              </p>

              {/* Stats */}
              {totalProjects > 0 && (
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">{totalProjects}+</div>
                    <div className="text-sm text-surface-muted-foreground">Completed Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">{uniqueLocations}</div>
                    <div className="text-sm text-surface-muted-foreground">Locations Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">100%</div>
                    <div className="text-sm text-surface-muted-foreground">Client Satisfaction</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="section-standard bg-surface-background">
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
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredProjects.length > 0 ? 'All Projects' : 'Our Projects'}
            </h2>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-surface-muted-foreground text-lg">
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
              <p className="text-surface-foreground mb-6">
                Have a project that needs professional service?
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
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/projects' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/projects#collection'),
          url: absUrl('/projects'),
          name: `${siteConfig.business.name} Projects`,
          description: `Portfolio of completed projects. From residential to commercial developments.`,
        }}
      />
    </>
  );
}
