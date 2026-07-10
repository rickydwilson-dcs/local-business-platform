import Link from 'next/link';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';
import { getImageUrl } from '@/lib/image';

interface ProjectCard {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  date?: string;
  tags?: string[];
}

export function ProjectsPage({ projects }: { projects: ProjectCard[] }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects', current: true },
  ];

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="Our Projects"
        description="A selection of recent vehicle security, fleet and accessory installations."
      />

      <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
        <div className="container mx-auto px-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">
                No projects yet. Check back soon to see our latest work.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all"
                >
                  {project.heroImage && (
                    <div className="h-48 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={project.title}
                        src={getImageUrl(project.heroImage)}
                      />
                    </div>
                  )}
                  <div className="p-8">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wide px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-heading font-bold uppercase mb-2">
                      {project.title}
                    </h2>
                    {project.description && (
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    )}
                    {project.date && <p className="text-xs text-white/40 mb-3">{project.date}</p>}
                    <span className="inline-block text-brand-primary font-bold uppercase tracking-wide text-sm group-hover:translate-x-1 transition-transform">
                      View project &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-white/80 mb-6">Have a project that needs professional service?</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-primary text-brand-on-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
