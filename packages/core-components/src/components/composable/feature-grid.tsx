import Link from "next/link";
import type { LayoutParams } from "./layout-params";

export interface FeatureGridSlots {
  showSectionHeading: boolean;
  showSectionIntro: boolean;
  showIcons: boolean;
  showDescriptions: boolean;
}

export const FEATURE_GRID_DEFAULT_SLOTS: FeatureGridSlots = {
  showSectionHeading: true,
  showSectionIntro: true,
  showIcons: true,
  showDescriptions: true,
};

interface FeatureItem {
  title: string;
  description?: string;
  icon?: string;
  href?: string;
}

interface FeatureGridProps {
  slots?: Partial<FeatureGridSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function FeatureGrid({ slots: slotOverrides, layout, data, className }: FeatureGridProps) {
  const slots = { ...FEATURE_GRID_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 3;
  const gridCols =
    cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const features = Array.isArray(data.features) ? (data.features as FeatureItem[]) : [];

  return (
    <section
      className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
      data-component="FeatureGrid"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2
            data-slot="heading"
            className="text-2xl md:text-2xl font-bold tracking-tight mb-12 text-surface-foreground"
          >
            {d.heading}
          </h2>
        )}
        {slots.showSectionIntro && d.intro && (
          <p
            data-slot="intro"
            className="text-surface-muted-foreground mb-12 max-w-xl text-sm leading-relaxed"
          >
            {d.intro}
          </p>
        )}
        <div className={`grid gap-8 ${gridCols}`}>
          {features.map((feature, i) => {
            const cardContent = (
              <>
                {slots.showIcons && feature.icon && (
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
                    {feature.icon}
                  </div>
                )}
                <div>
                  <h3
                    data-slot="featureTitle"
                    className="text-base font-semibold text-surface-foreground mb-2"
                  >
                    {feature.title}
                  </h3>
                  {slots.showDescriptions && feature.description && (
                    <p
                      className={`text-sm leading-relaxed ${layout?.background === "inverse" ? "text-white/80" : "text-surface-muted-foreground"}`}
                    >
                      {feature.description}
                    </p>
                  )}
                  {feature.href && (
                    <span className="inline-flex items-center mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform text-sm">
                      View services <span aria-hidden="true">→</span>
                    </span>
                  )}
                </div>
              </>
            );

            return feature.href ? (
              <Link
                key={i}
                href={feature.href}
                className="flex gap-5 p-6 bg-surface-card rounded-2xl border border-surface-card-border group hover:shadow-xl transition-shadow block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded-2xl"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={i}
                className="flex gap-5 p-6 bg-surface-card rounded-2xl border border-surface-card-border"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
