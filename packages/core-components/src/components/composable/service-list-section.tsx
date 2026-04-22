import type { LayoutParams } from "./layout-params";

export interface ServiceListSectionSlots {
  showEyebrow: boolean;
  showDescription: boolean;
  showCta: boolean;
  showItemDescription: boolean;
  showArrow: boolean;
}

export const SERVICE_LIST_SECTION_DEFAULT_SLOTS: ServiceListSectionSlots = {
  showEyebrow: true,
  showDescription: true,
  showCta: true,
  showItemDescription: true,
  showArrow: true,
};

interface ServiceItem {
  title: string;
  description?: string;
  href?: string;
}

interface ServiceListSectionProps {
  slots?: Partial<ServiceListSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function ServiceListSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: ServiceListSectionProps) {
  const slots = { ...SERVICE_LIST_SECTION_DEFAULT_SLOTS, ...slotOverrides };

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const items = Array.isArray(data.items) ? (data.items as ServiceItem[]) : [];
  const eyebrow = typeof data.eyebrow === "string" ? data.eyebrow : undefined;
  const heading = typeof data.heading === "string" ? data.heading : "";
  const description = typeof data.description === "string" ? data.description : undefined;
  const ctaText = typeof data.ctaText === "string" ? data.ctaText : undefined;
  const ctaHref = typeof data.ctaHref === "string" ? data.ctaHref : "/services";

  return (
    <section
      className={`${bg} py-16 md:py-24 ${className ?? ""}`}
      data-component="ServiceListSection"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-x-12 gap-y-0 items-start md:grid-cols-2">
          <div className="md:sticky md:top-24 pb-8 md:pb-0">
            {slots.showEyebrow && eyebrow && (
              <p
                data-slot="eyebrow"
                className="text-eyebrow mb-3 tracking-[0.2em] text-brand-primary"
              >
                {eyebrow}
              </p>
            )}
            <h2
              data-slot="heading"
              className="heading-section tracking-tight text-surface-foreground mb-6"
            >
              {heading}
            </h2>
            {slots.showDescription && description && (
              <p
                data-slot="description"
                className="mb-8 leading-relaxed text-surface-muted-foreground"
              >
                {description}
              </p>
            )}
            {slots.showCta && ctaText && (
              <a
                href={ctaHref}
                data-slot="cta"
                className="btn-secondary inline-flex items-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                {ctaText}
                {slots.showArrow && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </a>
            )}
          </div>

          <div className="divide-y divide-surface-card-border">
            {items.map((item, i) => {
              const inner = (
                <>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 font-semibold text-surface-foreground transition-colors group-hover:text-brand-primary">
                      {item.title}
                    </h3>
                    {slots.showItemDescription && item.description && (
                      <p className="text-body-sm line-clamp-2 text-surface-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {slots.showArrow && (
                    <svg
                      className="hidden h-4 w-4 flex-shrink-0 mt-1 text-surface-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-primary md:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </>
              );
              return item.href ? (
                <a
                  key={i}
                  href={item.href}
                  className="group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  {inner}
                </a>
              ) : (
                <div key={i} className="flex items-start gap-4 py-6">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
