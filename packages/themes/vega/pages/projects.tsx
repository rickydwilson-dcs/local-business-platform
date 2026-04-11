import type { ProjectsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function VegaProjectsPage({ projects }: ProjectsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Projects', href: '/projects', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Title */}
      <section className="section-standard lg:py-24 bg-surface-background">
        <div className="container-standard">
          <div className="text-center">
            <h1 className="heading-hero">Our Projects</h1>
            <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
              Explore our portfolio of completed projects. From residential to commercial, we
              deliver excellence on every job.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-standard bg-surface-subtle">
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
                <article
                  key={project.slug}
                  className="bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border"
                >
                  <div className="p-6">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h2>
                    {project.description && (
                      <p className="text-surface-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.date && (
                      <p className="text-sm text-surface-muted-foreground mb-4">{project.date}</p>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-brand-primary font-medium text-sm hover:underline"
                    >
                      View Project &rarr;
                    </Link>
                  </div>
                </article>
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
    </>
  );
}
