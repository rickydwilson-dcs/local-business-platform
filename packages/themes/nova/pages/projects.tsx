import type { ProjectsPageTemplateProps, ProjectSummary } from '@platform/core-components';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@platform/core-components';

function NovaProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="bg-surface-card border border-surface-cardBorder rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      {project.heroImage && (
        <Link href={`/projects/${project.slug}`} className="block relative h-56 overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-lg line-clamp-2">{project.title}</h2>
          </div>
        </Link>
      )}
      <div className="p-5">
        {!project.heroImage && (
          <h2 className="font-bold text-surface-foreground mb-2 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h2>
        )}
        {project.description && (
          <p className="text-surface-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        {project.date && (
          <p className="text-xs text-surface-muted-foreground mb-4">{project.date}</p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-brand-primary font-semibold text-sm hover:underline"
        >
          View Project &rarr;
        </Link>
      </div>
    </article>
  );
}

export function NovaProjectsPage({ siteConfig, projects }: ProjectsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Projects', href: '/projects', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-primary py-16 md:py-24">
        <div className="container-standard text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Projects</h1>
          <p className="text-xl text-white/90 mx-auto max-w-3xl">
            Explore our portfolio of completed projects. From residential to commercial, we deliver
            excellence on every job.
          </p>

          {/* Stats */}
          {projects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{projects.length}+</div>
                <div className="text-sm text-white/80">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/80">Client Satisfaction</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-standard bg-surface-background">
        <div className="container-standard">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No projects yet. Check back soon to see our latest work.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <NovaProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-surface-foreground mb-6">
              Have a project that needs professional service?
            </p>
            <Link
              href="/contact"
              className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primary-hover transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
