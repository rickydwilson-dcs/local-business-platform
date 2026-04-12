import type { ProjectsPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function SolarisProjectsPage({ siteConfig, projects }: ProjectsPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1]">
            Our Work
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-body max-w-2xl">
            Real websites built for real tradespeople.
          </p>
        </div>
      </header>

      {/* ─── Projects Grid ───────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {projects.length === 0 ? (
            <p className="text-surface-muted-foreground text-center py-12 font-body">
              No projects to display yet — check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none m-0 p-0">
              {projects.map((project) => (
                <li key={project.slug}>
                  <article className="bg-surface-card rounded-[20px] shadow-md solaris-card-hover solaris-card-accent border border-surface-card-border overflow-hidden flex flex-col h-full">
                    {/* Top strip */}
                    <div className="bg-brand-primary/10 px-6 pt-6 pb-4">
                      {project.date && (
                        <time
                          dateTime={project.date}
                          className="block text-surface-muted-foreground text-xs font-body mb-2"
                        >
                          {project.date}
                        </time>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-1 rounded-full font-body"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-headline font-bold text-xl text-surface-foreground mb-3 leading-snug">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-surface-muted-foreground text-sm font-body line-clamp-3 mb-4 flex-1">
                          {project.description}
                        </p>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-brand-primary text-sm font-semibold font-body hover:underline mt-auto inline-block"
                      >
                        View project →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ─── CTA Strip ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-surface-foreground mb-2">
              Want a site like these?
            </h2>
            <p className="text-surface-foreground/70 font-body">
              Get a professional website built for your trade business.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-body shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
