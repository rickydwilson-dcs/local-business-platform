import type { ProjectsPageTemplateProps } from '@platform/core-components';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, isValidImagePath } from '@/lib/image';

export function SiteProjectsPage({ projects }: ProjectsPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-secondary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-heading text-white mb-4 leading-[1.1]">
            Our Work
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-sans max-w-2xl">
            Real websites built for real tradespeople.
          </p>
        </div>
      </header>

      {/* ─── Projects Grid ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {projects.length === 0 ? (
            <p className="text-surface-muted-foreground text-center py-12 font-sans">
              No projects to display yet — check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none m-0 p-0">
              {projects.map((project) => (
                <li key={project.slug}>
                  <article className="bg-surface-card rounded-[20px] shadow-md border border-surface-card-border overflow-hidden transition-transform hover:-translate-y-1 flex flex-col h-full">
                    {/* Thumbnail */}
                    {isValidImagePath(project.heroImage) && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-muted">
                        <Image
                          src={getImageUrl(project.heroImage)}
                          alt={`${project.title} — thumbnail`}
                          width={400}
                          height={300}
                          quality={58}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Colored strip */}
                    <div className="bg-brand-accent/10 px-6 pt-6 pb-4">
                      {project.date && (
                        <time
                          dateTime={project.date}
                          className="block text-surface-muted-foreground text-xs font-sans mb-2"
                        >
                          {project.date}
                        </time>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-brand-primary/15 text-brand-primary text-xs font-semibold px-2 py-1 rounded-full font-sans"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-heading font-bold text-xl text-surface-foreground mb-3 leading-snug">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-surface-muted-foreground text-sm font-sans line-clamp-3 mb-4 flex-1">
                          {project.description}
                        </p>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-brand-primary text-sm font-semibold font-sans hover:underline mt-auto inline-block"
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
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-surface-foreground mb-2">
              Want a site like these?
            </h2>
            <p className="text-surface-foreground/70 font-sans">
              Get a professional website built for your trade business.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-sans shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
