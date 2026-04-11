import type { ProjectsPageTemplateProps, ProjectSummary } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

function CygnusProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="bg-surface-card border border-surface-card-border rounded-2xl overflow-hidden hover:border-brand-primary hover:shadow-xl transition-all group">
      <div className="p-6">
        <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        {project.description && (
          <p className="text-surface-muted-foreground mb-4 line-clamp-3">{project.description}</p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-brand-primary font-medium text-sm hover:underline"
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

export function CygnusProjectsPage({ siteConfig, projects }: ProjectsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Projects', href: '/projects', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <section className="section-standard bg-surface-inverse">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
              Our Projects
            </h1>
            <p className="text-xl text-surface-secondary-foreground mb-8 mx-auto max-w-3xl">
              Explore our portfolio of completed projects. From residential to commercial, we
              deliver excellence on every job.
            </p>
            {projects.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-primary">{projects.length}+</div>
                  <div className="text-sm text-surface-secondary-foreground">Completed Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-primary">100%</div>
                  <div className="text-sm text-surface-secondary-foreground">Client Satisfaction</div>
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
                  <CygnusProjectCard key={project.slug} project={project} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-surface-foreground mb-6">
                Have a project that needs professional service?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-on-brand-primary font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
