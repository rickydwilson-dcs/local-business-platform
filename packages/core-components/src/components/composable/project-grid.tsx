import Link from "next/link";
import type { LayoutParams } from "./layout-params";

export interface ProjectGridSlots {
  showSectionHeading: boolean;
  showStats: boolean;
  showTags: boolean;
  showDate: boolean;
  showDescription: boolean;
  showCta: boolean;
}

export const PROJECT_GRID_DEFAULT_SLOTS: ProjectGridSlots = {
  showSectionHeading: true,
  showStats: true,
  showTags: true,
  showDate: true,
  showDescription: true,
  showCta: false,
};

interface ProjectStat {
  value: string;
  label: string;
}

interface ProjectItem {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
}

interface ProjectGridProps {
  slots?: Partial<ProjectGridSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function ProjectGrid({ slots: slotOverrides, layout, data, className }: ProjectGridProps) {
  const slots = { ...PROJECT_GRID_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "subtle"
        ? "bg-surface-subtle text-surface-foreground"
        : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 3;
  const gridCols =
    cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const stats = Array.isArray(data.stats) ? (data.stats as ProjectStat[]) : [];
  const projects = Array.isArray(data.projects) ? (data.projects as ProjectItem[]) : [];
  const ctaText = d.ctaText;
  const ctaHref = d.ctaHref;

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="ProjectGrid">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2 data-slot="heading" className="text-h2 mb-4 text-center">
            {d.heading}
          </h2>
        )}
        {slots.showSectionHeading && d.subheading && (
          <p
            data-slot="subheading"
            className="text-surface-muted-foreground mb-12 text-center text-lg"
          >
            {d.subheading}
          </p>
        )}

        {slots.showStats && stats.length > 0 && (
          <div data-slot="stats" className="mb-12 flex flex-wrap gap-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-brand-primary text-3xl font-bold">{stat.value}</div>
                <div className="text-surface-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols}`}>
          {projects.map((project) => (
            <article
              key={project.slug}
              className="bg-surface-card border-surface-border rounded-lg border p-6"
            >
              {slots.showTags && project.tags && project.tags.length > 0 && (
                <div data-slot="tags" className="mb-3 flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-brand-primary/10 text-brand-primary rounded px-2 py-1 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h3 data-slot="projectTitle" className="mb-2 text-xl font-bold">
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              </h3>

              {slots.showDescription && project.description && (
                <p
                  data-slot="description"
                  className="text-surface-muted-foreground mb-3 line-clamp-2 text-sm"
                >
                  {project.description}
                </p>
              )}

              {slots.showDate && project.date && (
                <div data-slot="date" className="text-surface-muted-foreground mb-3 text-sm">
                  {project.date.substring(0, 4)}
                </div>
              )}

              <Link
                href={`/projects/${project.slug}`}
                className="text-brand-primary text-sm font-medium"
              >
                View Project →
              </Link>
            </article>
          ))}
        </div>

        {slots.showCta && ctaText && ctaHref && (
          <div data-slot="cta" className="mt-12 text-center">
            <Link
              href={ctaHref}
              className="bg-brand-primary text-brand-on-primary inline-block rounded px-6 py-3 font-semibold"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
