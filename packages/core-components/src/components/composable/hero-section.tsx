import type { LayoutParams } from "./layout-params";

export interface HeroSectionSlots {
  showEyebrow: boolean;
  showSubheading: boolean;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
  showHeroImage: boolean;
  showTrustBadges: boolean;
}

export const HERO_SECTION_DEFAULT_SLOTS: HeroSectionSlots = {
  showEyebrow: true,
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: true,
  showHeroImage: true,
  showTrustBadges: false,
};

interface HeroSectionProps {
  slots?: Partial<HeroSectionSlots>;
  layout?: Pick<LayoutParams, "background" | "align" | "fullBleed">;
  data: Record<string, unknown>;
  className?: string;
}

export function ComposableHeroSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: HeroSectionProps) {
  const slots = { ...HERO_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | string[] | undefined>;

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
  const minHeight = layout?.fullBleed ? "min-h-[60vh]" : "";
  const trustBadges = Array.isArray(data.trustBadges) ? (data.trustBadges as string[]) : [];

  return (
    <section className={`${bg} ${minHeight} ${className ?? ""}`} data-component="HeroSection">
      <div
        className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${isSplit ? "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center" : isCenter ? "text-center" : ""}`}
      >
        <div>
          {slots.showEyebrow && d.eyebrow && (
            <p className="text-brand-primary mb-4 text-sm font-semibold uppercase tracking-widest">
              {d.eyebrow}
            </p>
          )}
          <h1 className="text-h1 mb-6">{d.heading ?? ""}</h1>
          {slots.showSubheading && d.subheading && (
            <p className="text-surface-muted-foreground mb-8 text-xl leading-relaxed">
              {d.subheading}
            </p>
          )}
          {slots.showTrustBadges && trustBadges.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-3">
              {trustBadges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-surface-subtle text-surface-foreground rounded-full px-3 py-1 text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          <div className={`flex gap-4 ${isCenter ? "justify-center" : ""}`}>
            {slots.showPrimaryCta && d.primaryCtaText && (
              <a
                href={typeof data.primaryCtaHref === "string" ? data.primaryCtaHref : "#"}
                className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                {d.primaryCtaText}
              </a>
            )}
            {slots.showSecondaryCta && d.secondaryCtaText && (
              <a
                href={typeof data.secondaryCtaHref === "string" ? data.secondaryCtaHref : "#"}
                className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg border px-6 py-3 font-semibold transition-colors"
              >
                {d.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
        {isSplit && slots.showHeroImage && typeof data.heroImage === "string" && (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img src={data.heroImage} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export { ComposableHeroSection as HeroSection };
