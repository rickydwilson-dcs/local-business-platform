import type { LayoutParams } from "./layout-params";

export interface WhyChooseUsSectionSlots {
  showEyebrow: boolean;
  showHeadingHighlight: boolean;
  showStat: boolean;
}

export const WHY_CHOOSE_US_SECTION_DEFAULT_SLOTS: WhyChooseUsSectionSlots = {
  showEyebrow: true,
  showHeadingHighlight: true,
  showStat: true,
};

interface WhyChooseUsItem {
  title: string;
  body: string;
  stat?: string;
}

interface WhyChooseUsSectionProps {
  slots?: Partial<WhyChooseUsSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function WhyChooseUsSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: WhyChooseUsSectionProps) {
  const slots = { ...WHY_CHOOSE_US_SECTION_DEFAULT_SLOTS, ...slotOverrides };

  const isDark =
    layout?.background === "brand" || !layout?.background || layout?.background === "inverse";
  const bg =
    layout?.background === "brand"
      ? "bg-brand-primary"
      : layout?.background === "subtle"
        ? "bg-surface-subtle"
        : layout?.background === "surface"
          ? "bg-surface-background"
          : "bg-surface-inverse";

  const items = Array.isArray(data.items) ? (data.items as WhyChooseUsItem[]) : [];
  const eyebrow = typeof data.eyebrow === "string" ? data.eyebrow : undefined;
  const heading = typeof data.heading === "string" ? data.heading : "";
  const headingHighlight =
    typeof data.headingHighlight === "string" ? data.headingHighlight : undefined;

  return (
    <section
      className={`${bg} noise-overlay py-16 md:py-24 ${className ?? ""}`}
      data-component="WhyChooseUsSection"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {slots.showEyebrow && eyebrow && (
          <p
            data-slot="eyebrow"
            className={`text-eyebrow mb-3 ${
              bg.includes("bg-surface-inverse") || bg.includes("bg-brand-primary")
                ? "text-white/70"
                : "text-brand-primary"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          data-slot="heading"
          className={`heading-section tracking-tight mb-16 ${isDark ? "text-white" : "text-surface-foreground"}`}
        >
          {heading}
          {slots.showHeadingHighlight && headingHighlight && (
            <>
              {" "}
              <span className="text-brand-primary">{headingHighlight}</span>
            </>
          )}
        </h2>

        <div className="border-t border-surface-border">
          {items.map((item, i) => (
            <div
              key={i}
              className={`grid items-center gap-6 border-b border-surface-border py-8 ${slots.showStat ? "md:grid-cols-[2fr_3fr_1fr]" : "md:grid-cols-[2fr_3fr]"}`}
            >
              <h3 className={`text-label ${isDark ? "text-white" : "text-surface-foreground"}`}>
                {item.title}
              </h3>
              <p
                className={`text-body ${isDark ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
              >
                {item.body}
              </p>
              {slots.showStat && item.stat && (
                <p
                  data-slot="stat"
                  className={`text-caption font-mono uppercase tracking-widest md:text-right ${isDark ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
                >
                  {item.stat}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
