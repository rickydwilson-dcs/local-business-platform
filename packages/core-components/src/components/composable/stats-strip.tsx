import type { LayoutParams } from "./layout-params";

export interface StatsStripSlots {
  showLabel: boolean;
  showDescription: boolean;
  showDividers: boolean;
}

export const STATS_STRIP_DEFAULT_SLOTS: StatsStripSlots = {
  showLabel: true,
  showDescription: false,
  showDividers: true,
};

interface StatItem {
  value: string;
  label?: string;
  description?: string;
}

interface StatsStripProps {
  slots?: Partial<StatsStripSlots>;
  layout?: Pick<LayoutParams, "columns" | "background" | "paddingY">;
  data: Record<string, unknown>;
  className?: string;
}

export function StatsStrip({ slots: slotOverrides, layout, data, className }: StatsStripProps) {
  const slots = { ...STATS_STRIP_DEFAULT_SLOTS, ...slotOverrides };

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const py =
    layout?.paddingY === "compact" ? "py-8" : layout?.paddingY === "spacious" ? "py-24" : "py-16";

  const stats = Array.isArray(data.stats) ? (data.stats as StatItem[]) : [];
  const cols = layout?.columns ?? 4;
  const gridCols = cols === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

  return (
    <section
      className={`${bg} ${layout?.background === "inverse" || layout?.background === "brand" ? "noise-overlay" : ""} border-b border-surface-border ${className ?? ""}`}
      data-component="StatsStrip"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridCols} divide-x divide-surface-border`}>
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-8">
              <div>
                <p
                  data-slot="statValue"
                  className={`text-base font-bold tracking-tight stat-value ${layout?.background === "inverse" ? "text-white" : "text-brand-primary"}`}
                >
                  {stat.value}
                </p>
                {slots.showLabel && stat.label && (
                  <p
                    data-slot="statLabel"
                    className={`mt-1 text-xs uppercase tracking-widest ${layout?.background === "inverse" ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
                  >
                    {stat.label}
                  </p>
                )}
                {slots.showDescription && stat.description && (
                  <p
                    className={`mt-1 text-xs ${layout?.background === "inverse" ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
                  >
                    {stat.description}
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
