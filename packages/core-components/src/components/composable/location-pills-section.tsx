import type { LayoutParams } from "./layout-params";

export interface LocationPillsSectionSlots {
  showEyebrow: boolean;
  showCta: boolean;
  showArrow: boolean;
}

export const LOCATION_PILLS_SECTION_DEFAULT_SLOTS: LocationPillsSectionSlots = {
  showEyebrow: true,
  showCta: true,
  showArrow: true,
};

interface LocationItem {
  title: string;
  href: string;
}

interface LocationPillsSectionProps {
  slots?: Partial<LocationPillsSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function LocationPillsSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: LocationPillsSectionProps) {
  const slots = { ...LOCATION_PILLS_SECTION_DEFAULT_SLOTS, ...slotOverrides };

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const items = Array.isArray(data.items) ? (data.items as LocationItem[]) : [];
  const eyebrow = typeof data.eyebrow === "string" ? data.eyebrow : undefined;
  const heading = typeof data.heading === "string" ? data.heading : "";
  const ctaText = typeof data.ctaText === "string" ? data.ctaText : undefined;
  const ctaHref = typeof data.ctaHref === "string" ? data.ctaHref : "/locations";

  return (
    <section
      className={`${bg} py-16 lg:py-24 ${className ?? ""}`}
      data-component="LocationPillsSection"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            {slots.showEyebrow && eyebrow && (
              <p
                data-slot="eyebrow"
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-primary"
              >
                {eyebrow}
              </p>
            )}
            <h2 data-slot="heading" className="text-h2">
              {heading}
            </h2>
          </div>
          {slots.showCta && ctaText && (
            <a
              href={ctaHref}
              data-slot="cta"
              className="rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-on-primary"
            >
              {ctaText}
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((item, i) => (
            <a key={i} href={item.href} className="location-pill group">
              <span className="font-semibold text-surface-foreground transition-colors group-hover:text-brand-primary">
                {item.title}
              </span>
              {slots.showArrow && (
                <svg
                  className="location-pill-arrow h-4 w-4 flex-shrink-0"
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
          ))}
        </div>
      </div>
    </section>
  );
}
