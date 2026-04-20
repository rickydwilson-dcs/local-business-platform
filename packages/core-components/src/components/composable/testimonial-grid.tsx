import type { LayoutParams } from "./layout-params";
import { TestimonialCard } from "../ui/testimonial-card";

// NOTE: after 2026-04-19 refactor, slot toggles are no-ops — TestimonialCard manages internal sections.
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
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {d.heading && (
          <h2
            data-slot="heading"
            className="text-xl md:text-xl font-bold tracking-tight mb-4 text-center"
          >
            {d.heading}
          </h2>
        )}
        {d.subheading && (
          <p className="text-surface-muted-foreground mb-12 text-center text-base">
            {d.subheading}
          </p>
        )}
        <div className={`grid gap-6 ${gridCols}`}>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              name={t.name}
              rating={t.rating ?? 5}
              text={t.text}
              title={t.title}
              date={t.date}
              location={t.location}
              featured={(t as { featured?: boolean }).featured ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
