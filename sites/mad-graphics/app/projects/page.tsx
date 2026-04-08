/**
 * Projects Listing Page
 * =====================
 *
 * Portfolio of completed projects in the site's dark editorial style.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { getProjects, type Project } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PageHeader } from '@/components/ui/page-header';
import { CtaBand } from '@/components/ui/cta-band';

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
  heritage: 'Heritage',
  'new-build': 'New Build',
  renovation: 'Renovation',
  maintenance: 'Maintenance',
  emergency: 'Emergency',
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block bg-surface-muted overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={getImageUrl(project.heroImage)}
          alt={project.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-3 mb-3">
            <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">
              {projectTypeLabels[project.projectType] || project.projectType}
            </span>
            <span className="text-surface-muted-foreground text-xs uppercase tracking-widest">
              {categoryLabels[project.category] || project.category}
            </span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-surface-foreground">
            {project.title}
          </h2>
        </div>
      </div>
      <div className="p-6">
        <p className="text-surface-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-surface-muted-foreground uppercase tracking-widest mb-4">
          <span>{project.locationName}</span>
          <span>{project.year}</span>
          {project.duration && <span>{project.duration}</span>}
        </div>
        {project.client?.rating && (
          <div className="flex text-brand-primary mb-4">
            {Array.from({ length: project.client.rating }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
        )}
        <span className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
          View project <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Calculate stats
  const uniqueLocations = new Set(projects.map((p) => p.location)).size;
  const totalProjects = projects.length;

  return (
    <>
      <PageHeader overline="Portfolio" title="Our work" />

      {/* Stats */}
      {totalProjects > 0 && (
        <div className="px-8 pb-12">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-12">
            <div>
              <span className="text-4xl font-headline font-bold text-brand-primary">
                {totalProjects}+
              </span>
              <span className="text-surface-muted-foreground text-sm uppercase tracking-widest ml-3">
                projects
              </span>
            </div>
            <div>
              <span className="text-4xl font-headline font-bold text-brand-primary">
                {uniqueLocations}
              </span>
              <span className="text-surface-muted-foreground text-sm uppercase tracking-widest ml-3">
                locations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <p className="text-surface-muted-foreground text-lg">
            No projects yet. Check back soon to see our latest work.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-card-border/20">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <CtaBand
        headline="Have a project in mind?"
        subtext="Let's discuss what you need. No obligation, no hard sell."
        primaryLabel="Get a Quote"
        primaryHref="/contact"
      />

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
