import { Phone } from "lucide-react";
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

  const isInverse = layout?.background === "inverse";
  const isBrand = layout?.background === "brand";
  const isDark = isInverse || isBrand;

  const sectionClass = isInverse
    ? "section-dark-accent noise-overlay"
    : isBrand
      ? "bg-brand-primary text-white py-16 md:py-24 noise-overlay"
      : layout?.background === "subtle"
        ? "bg-surface-subtle text-surface-foreground py-16 md:py-24"
        : "bg-surface-background text-surface-foreground py-16 md:py-24";

  const phoneTel = typeof data.phoneTel === "string" ? data.phoneTel : undefined;
  const phoneDisplay = typeof data.phoneDisplay === "string" ? data.phoneDisplay : undefined;
  const showPhoneCta = Boolean(phoneTel || phoneDisplay);

  const headingScale = isInverse
    ? "text-3xl md:text-4xl font-bold tracking-tight"
    : "text-2xl md:text-2xl font-bold tracking-tight";

  const subheadingClass = isBrand
    ? "text-lg mt-3 text-white/80 max-w-xl"
    : isInverse
      ? "text-xl mt-4 text-on-inverse-muted max-w-xl"
      : "text-lg mt-3 text-surface-muted-foreground max-w-xl";

  const ringOffset = isDark
    ? "focus-visible:ring-offset-surface-inverse"
    : "focus-visible:ring-offset-surface-background";

  return (
    <section className={`${sectionClass} ${className ?? ""}`} data-component="CTASection">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 data-slot="heading" className={headingScale}>
              {d.heading ?? ""}
            </h2>
            {slots.showSubheading && d.subheading && (
              <p data-slot="subheading" className={subheadingClass}>
                {d.subheading}
              </p>
            )}
          </div>
          <div className={isInverse ? "flex flex-col gap-3" : "flex flex-col sm:flex-row gap-3"}>
            {slots.showPrimaryCta && d.primaryCtaText && (
              <a
                href={d.primaryCtaHref ?? "#"}
                data-slot="primaryCta"
                className={
                  (isBrand ? "btn-on-brand-primary" : "btn-primary") +
                  " active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                {d.primaryCtaText}
              </a>
            )}
            {slots.showSecondaryCta && d.secondaryCtaText && (
              <a
                href={d.secondaryCtaHref ?? "#"}
                className={
                  (isBrand ? "btn-on-brand-primary-outline" : "btn-secondary") +
                  " active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                {d.secondaryCtaText}
              </a>
            )}
            {showPhoneCta && (
              <a
                href={phoneTel ? `tel:${phoneTel}` : `tel:${phoneDisplay}`}
                data-slot="phoneCta"
                className={
                  (isBrand
                    ? "btn-on-brand-primary-outline"
                    : isInverse
                      ? "btn-tertiary"
                      : "btn-secondary") +
                  " inline-flex items-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                {isInverse && phoneDisplay ? `Call ${phoneDisplay}` : phoneDisplay}
              </a>
            )}
          </div>
        </div>
        {slots.showTrustLine && d.trustLine && (
          <p
            className={`mt-8 text-xs uppercase tracking-widest font-medium ${isDark ? "text-white/70" : "text-surface-muted-foreground"}`}
          >
            {d.trustLine}
          </p>
        )}
      </div>
    </section>
  );
}

export { ComposableCTASection as CTASection };
