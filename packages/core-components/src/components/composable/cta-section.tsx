import type { LayoutParams } from "./layout-params";

export interface CTASectionSlots {
  showSubheading: boolean;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
  showTrustLine: boolean;
}

export const CTA_SECTION_DEFAULT_SLOTS: CTASectionSlots = {
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: false,
  showTrustLine: false,
};

interface CTASectionProps {
  slots?: Partial<CTASectionSlots>;
  layout?: Pick<LayoutParams, "background" | "align">;
  data: Record<string, unknown>;
  className?: string;
}

export function ComposableCTASection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: CTASectionProps) {
  const slots = { ...CTA_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-white"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const isCenter = layout?.align !== "left";

  return (
    <section
      className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
      data-component="CTASection"
    >
      <div
        className={`mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 ${isCenter ? "text-center" : ""}`}
      >
        <h2 data-slot="heading" className="text-h2 mb-4 tracking-tight">
          {d.heading ?? ""}
        </h2>
        {slots.showSubheading && d.subheading && (
          <p
            data-slot="subheading"
            className={`mb-8 text-xl ${layout?.background === "brand" ? "text-brand-on-primary" : layout?.background === "inverse" ? "text-white opacity-80" : "text-surface-muted-foreground"}`}
          >
            {d.subheading}
          </p>
        )}
        <div className={`flex flex-wrap gap-4 ${isCenter ? "justify-center" : ""}`}>
          {slots.showPrimaryCta && d.primaryCtaText && (
            <a
              href={d.primaryCtaHref ?? "#"}
              data-slot="primaryCta"
              className={`inline-flex items-center justify-center bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-xl px-8 py-4 font-semibold shadow-brand-lg transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2${layout?.background === "inverse" || layout?.background === "brand" ? " focus-visible:ring-offset-surface-inverse" : ""}`}
            >
              {d.primaryCtaText}
            </a>
          )}
          {slots.showSecondaryCta && d.secondaryCtaText && (
            <a
              href={d.secondaryCtaHref ?? "#"}
              className="inline-flex items-center justify-center border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-xl border px-8 py-4 font-semibold transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {d.secondaryCtaText}
            </a>
          )}
        </div>
        {slots.showTrustLine && d.trustLine && (
          <p className="text-surface-muted-foreground mt-8 text-xs uppercase tracking-[0.18em] font-medium">
            {d.trustLine}
          </p>
        )}
      </div>
    </section>
  );
}

export { ComposableCTASection as CTASection };
