import type { LayoutParams } from "./layout-params";

export interface TestimonialGridSlots {
  showStars: boolean;
  showDate: boolean;
  showAvatar: boolean;
  showAuthorName: boolean;
  showLocation: boolean;
  showTitle: boolean;
}

export const TESTIMONIAL_GRID_DEFAULT_SLOTS: TestimonialGridSlots = {
  showStars: true,
  showDate: false,
  showAvatar: true,
  showAuthorName: true,
  showLocation: true,
  showTitle: false,
};

interface TestimonialItem {
  name: string;
  location?: string;
  rating?: number;
  text: string;
  title?: string;
  date?: string;
  avatarInitials?: string;
}

interface TestimonialGridProps {
  slots?: Partial<TestimonialGridSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function TestimonialGrid({
  slots: slotOverrides,
  layout,
  data,
  className,
}: TestimonialGridProps) {
  const slots = { ...TESTIMONIAL_GRID_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 2;
  const gridCols =
    cols === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : cols === 1
        ? "grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2";

  const testimonials = Array.isArray(data.testimonials)
    ? (data.testimonials as TestimonialItem[])
    : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="TestimonialGrid">
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
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-surface-card border-surface-card-border rounded-xl border p-6"
            >
              {slots.showStars && t.rating != null && (
                <div className="mb-3 flex gap-0.5" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span
                      key={s}
                      aria-hidden={true}
                      className={s < t.rating! ? "text-brand-primary" : "text-surface-muted"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              {slots.showTitle && t.title && <p className="mb-2 font-semibold">{t.title}</p>}
              <p data-slot="quote" className="text-surface-foreground mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {slots.showAvatar && t.avatarInitials && (
                  <div className="bg-brand-primary text-brand-on-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                    {t.avatarInitials}
                  </div>
                )}
                <div>
                  {slots.showAuthorName && (
                    <p data-slot="authorName" className="font-semibold">
                      {t.name}
                    </p>
                  )}
                  {slots.showLocation && t.location && (
                    <p className="text-surface-muted-foreground text-sm">{t.location}</p>
                  )}
                  {slots.showDate && t.date && (
                    <p className="text-surface-muted-foreground text-xs">{t.date}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
