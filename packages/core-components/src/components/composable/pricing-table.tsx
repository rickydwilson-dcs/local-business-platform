import type { LayoutParams } from "./layout-params";

export interface PricingTableSlots {
  showSectionHeading: boolean;
  showDisclaimer: boolean;
  showIcons: boolean;
}

export const PRICING_TABLE_DEFAULT_SLOTS: PricingTableSlots = {
  showSectionHeading: true,
  showDisclaimer: true,
  showIcons: false,
};

interface PricingItem {
  label: string;
  priceRange: string;
  icon?: string;
}

interface PricingTableProps {
  slots?: Partial<PricingTableSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function PricingTable({ slots: slotOverrides, layout, data, className }: PricingTableProps) {
  const slots = { ...PRICING_TABLE_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "subtle"
      ? "bg-surface-subtle text-surface-foreground"
      : layout?.background === "muted"
        ? "bg-surface-muted text-surface-foreground"
        : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 4;
  const gridCols =
    cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const items = Array.isArray(data.items) ? (data.items as PricingItem[]) : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="PricingTable">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
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
        <div className={`grid gap-4 ${gridCols}`}>
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-surface-card border-surface-border rounded-lg border p-4 text-center"
            >
              {slots.showIcons && item.icon && (
                <div data-slot="icon" className="mb-2 text-2xl">
                  {item.icon}
                </div>
              )}
              <div data-slot="label" className="text-surface-foreground text-sm font-medium">
                {item.label}
              </div>
              <div data-slot="priceRange" className="text-brand-primary text-lg font-bold">
                {item.priceRange}
              </div>
            </div>
          ))}
        </div>
        {slots.showDisclaimer && d.disclaimer && (
          <p data-slot="disclaimer" className="text-surface-muted-foreground mt-4 text-sm">
            {d.disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
