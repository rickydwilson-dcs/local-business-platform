import type { LayoutParams } from "./layout-params";

export interface ServiceCardsSlots {
  showIcon: boolean;
  showImage: boolean;
  showDescription: boolean;
  showCta: boolean;
  showBadge: boolean;
}

export const SERVICE_CARDS_DEFAULT_SLOTS: ServiceCardsSlots = {
  showIcon: true,
  showImage: false,
  showDescription: true,
  showCta: true,
  showBadge: false,
};

interface ServiceItem {
  title: string;
  description?: string;
  icon?: string;
  image?: string;
  href?: string;
  badge?: string;
}

interface ServiceCardsProps {
  slots?: Partial<ServiceCardsSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function ServiceCards({ slots: slotOverrides, layout, data, className }: ServiceCardsProps) {
  const slots = { ...SERVICE_CARDS_DEFAULT_SLOTS, ...slotOverrides };
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

  const services = Array.isArray(data.services) ? (data.services as ServiceItem[]) : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="ServiceCards">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {d.heading && (
          <h2 data-slot="heading" className="text-h2 mb-4 text-center">
            {d.heading}
          </h2>
        )}
        {d.subheading && (
          <p className="text-surface-muted-foreground mb-12 text-center text-lg">{d.subheading}</p>
        )}
        <div className={`grid gap-6 ${gridCols}`}>
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-surface-card border-surface-card-border rounded-xl border p-6 transition-shadow hover:shadow-md"
            >
              {slots.showBadge && service.badge && (
                <span className="bg-brand-primary/10 text-brand-primary mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                  {service.badge}
                </span>
              )}
              {slots.showIcon && service.icon && (
                <div className="mb-4 text-3xl">{service.icon}</div>
              )}
              {slots.showImage && service.image && (
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 data-slot="serviceTitle" className="text-h3 mb-2">
                {service.title}
              </h3>
              {slots.showDescription && service.description && (
                <p className="text-surface-muted-foreground mb-4">{service.description}</p>
              )}
              {slots.showCta && service.href && (
                <a
                  href={service.href}
                  aria-label={`Learn more about ${service.title}`}
                  className="text-brand-primary font-semibold hover:underline"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
