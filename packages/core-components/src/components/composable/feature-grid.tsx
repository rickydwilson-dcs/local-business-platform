import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
  image?: string;
  imageAlt?: string;
}

interface FeatureGridProps {
  slots?: Partial<FeatureGridSlots>;
  layout?: Pick<LayoutParams, "columns" | "background" | "variant">;
  data: Record<string, unknown>;
  className?: string;
}

export function FeatureGrid({ slots: slotOverrides, layout, data, className }: FeatureGridProps) {
  const slots = { ...FEATURE_GRID_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;
  const variant = layout?.variant ?? "card";

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

  if (variant === "large-feature") {
    return (
      <section
        className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
        data-component="FeatureGrid"
        data-variant="large-feature"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
          {slots.showSectionHeading && d.heading && (
            <h2
              data-slot="heading"
              className="heading-section tracking-tight text-surface-foreground"
            >
              {d.heading}
            </h2>
          )}
          {slots.showSectionIntro && d.intro && (
            <p className="text-body text-surface-muted-foreground mb-12 max-w-2xl">{d.intro}</p>
          )}
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, i) => (
              <article
                key={i}
                className="group bg-surface-card border border-surface-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.imageAlt ?? feature.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-8">
                  {slots.showIcons && feature.icon && (
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 text-2xl">
                      {feature.icon}
                    </div>
                  )}
                  <h3
                    data-slot="featureTitle"
                    className="heading-card text-surface-foreground mb-3"
                  >
                    {feature.title}
                  </h3>
                  {slots.showDescriptions && feature.description && (
                    <p className="text-body-sm text-surface-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                  {feature.href && (
                    <Link
                      href={feature.href}
                      className="text-label inline-flex items-center mt-5 text-brand-primary group-hover:translate-x-1 transition-transform"
                    >
                      Learn more{" "}
                      <span aria-hidden="true" className="ml-1">
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "list") {
    return (
      <section
        className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
        data-component="FeatureGrid"
      >
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
          {slots.showSectionHeading && d.heading && (
            <h2
              data-slot="heading"
              className="heading-section tracking-tight mb-8 text-surface-foreground"
            >
              {d.heading}
            </h2>
          )}
          {slots.showSectionIntro && d.intro && (
            <p className="text-body text-surface-muted-foreground mb-8 max-w-xl">{d.intro}</p>
          )}
          <div className={`grid gap-4 ${gridCols}`}>
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-surface-foreground mb-1">{feature.title}</h3>
                  {slots.showDescriptions && feature.description && (
                    <p className="text-body-sm text-surface-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
      data-component="FeatureGrid"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2
            data-slot="heading"
            className="heading-section tracking-tight mb-12 text-surface-foreground"
          >
            {d.heading}
          </h2>
        )}
        {slots.showSectionIntro && d.intro && (
          <p data-slot="intro" className="text-body text-surface-muted-foreground mb-12 max-w-xl">
            {d.intro}
          </p>
        )}
        <div className={`grid gap-8 ${gridCols}`}>
          {features.map((feature, i) => {
            const cardContent = (
              <>
                {slots.showIcons && feature.icon && (
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
                    {feature.icon}
                  </div>
                )}
                <div>
                  <h3 data-slot="featureTitle" className="text-label text-surface-foreground mb-2">
                    {feature.title}
                  </h3>
                  {slots.showDescriptions && feature.description && (
                    <p
                      className={`text-body-sm ${layout?.background === "inverse" ? "text-white/80" : "text-surface-muted-foreground"}`}
                    >
                      {feature.description}
                    </p>
                  )}
                  {feature.href && (
                    <span className="text-caption inline-flex items-center mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
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
