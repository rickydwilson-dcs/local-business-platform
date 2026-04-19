import type { LayoutParams } from "./layout-params";

export interface ContentSectionSlots {
  showImage: boolean;
  showSubheading: boolean;
  showCta: boolean;
  showList: boolean;
}

export const CONTENT_SECTION_DEFAULT_SLOTS: ContentSectionSlots = {
  showImage: false,
  showSubheading: true,
  showCta: false,
  showList: false,
};

interface ContentSectionProps {
  slots?: Partial<ContentSectionSlots>;
  layout?: Pick<LayoutParams, "align" | "background" | "fullBleed">;
  data: Record<string, unknown>;
  className?: string;
}

export function ContentSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: ContentSectionProps) {
  const slots = { ...CONTENT_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const isSplit = layout?.align === "split";
  const isCenter = layout?.align === "center";
  const minHeight = layout?.fullBleed ? "min-h-[50vh]" : "";
  const listItems = Array.isArray(data.listItems) ? (data.listItems as string[]) : [];

  return (
    <section className={`${bg} ${minHeight} ${className ?? ""}`} data-component="ContentSection">
      <div
        className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${isSplit ? "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center" : ""}`}
      >
        <div className={isCenter ? "text-center" : ""}>
          {slots.showSubheading && d.subheading && (
            <p
              data-slot="subheading"
              className="text-brand-primary mb-3 text-sm font-semibold uppercase tracking-wide"
            >
              {d.subheading}
            </p>
          )}
          {d.heading && (
            <h2 data-slot="heading" className="text-h2 mb-6">
              {d.heading}
            </h2>
          )}
          {d.body && (
            <p
              data-slot="body"
              className="text-surface-muted-foreground mb-6 text-lg leading-relaxed"
            >
              {d.body}
            </p>
          )}
          {slots.showList && listItems.length > 0 && (
            <ul className="mb-6 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-brand-primary mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {slots.showCta && d.ctaText && (
            <a
              href={d.ctaHref ?? "#"}
              data-slot="cta"
              className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover inline-block rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              {d.ctaText}
            </a>
          )}
        </div>
        {slots.showImage && typeof data.image === "string" && (
          <div
            className={`overflow-hidden rounded-xl ${isSplit ? "relative aspect-video" : "mt-8"}`}
          >
            <img
              src={data.image}
              alt={(data.imageAlt as string | undefined) ?? ""}
              aria-hidden={!(data.imageAlt as string | undefined) || undefined}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
