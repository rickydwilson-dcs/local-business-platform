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
      ? "bg-surface-inverse text-surface-inverse-foreground"
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2 data-slot="heading" className="text-h2 mb-4 text-center">
            {d.heading}
          </h2>
        )}
        {slots.showSectionIntro && d.intro && (
          <p data-slot="intro" className="text-surface-muted-foreground mb-12 text-center text-lg">
            {d.intro}
          </p>
        )}
        <div className={`grid gap-8 ${gridCols}`}>
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              {slots.showIcons && feature.icon && (
                <div className="bg-brand-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl">
                  {feature.icon}
                </div>
              )}
              <h3 data-slot="featureTitle" className="text-h3 mb-2">
                {feature.title}
              </h3>
              {slots.showDescriptions && feature.description && (
                <p
                  className={
                    layout?.background === "inverse"
                      ? "text-surface-inverse-foreground opacity-80"
                      : "text-surface-muted-foreground"
                  }
                >
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
