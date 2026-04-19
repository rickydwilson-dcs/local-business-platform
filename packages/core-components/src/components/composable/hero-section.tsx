import Image from "next/image";
import type { LayoutParams } from "./layout-params";
import { getImageUrl } from "../../lib/image";

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
  const heroImageSrc = typeof data.heroImageSrc === "string" ? data.heroImageSrc : undefined;

  if (layout?.background === "image") {
    return (
      <section
        className={`relative overflow-hidden min-h-[500px] flex items-center noise-overlay ${className ?? ""}`}
        data-component="HeroSection"
      >
        {heroImageSrc && (
          <Image
            src={getImageUrl(heroImageSrc)}
            alt={(data.heroImageAlt as string | undefined) ?? ""}
            aria-hidden={!(data.heroImageAlt as string | undefined) || undefined}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div
          className={`absolute inset-0 ${
            (data.overlayColor as string) === "brand" ? "bg-brand-primary/60" : "bg-black/70"
          }`}
        />
        <div className="relative z-10 container mx-auto px-4 py-16 text-white">
          <div
            className={
              isSplit
                ? "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
                : isCenter
                  ? "text-center"
                  : ""
            }
          >
            <div>
              {slots.showEyebrow && d.eyebrow && (
                <p
                  data-slot="eyebrow"
                  className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/80"
                >
                  {d.eyebrow}
                </p>
              )}
              <h1 data-slot="heading" className="text-h1 mb-6 text-white">
                {d.heading ?? ""}
              </h1>
              {slots.showSubheading && d.subheading && (
                <p data-slot="subheading" className="mb-8 text-xl leading-relaxed text-white/90">
                  {d.subheading}
                </p>
              )}
              {slots.showTrustBadges && trustBadges.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3">
                  {trustBadges.map((badge, i) => (
                    <span key={i} className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <div className={`flex gap-4 ${isCenter ? "justify-center" : ""}`}>
                {slots.showPrimaryCta && d.primaryCtaText && (
                  <a
                    href={typeof data.primaryCtaHref === "string" ? data.primaryCtaHref : "#"}
                    data-slot="primaryCta"
                    className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-lg px-6 py-3 font-semibold transition-colors"
                  >
                    {d.primaryCtaText}
                  </a>
                )}
                {slots.showSecondaryCta && d.secondaryCtaText && (
                  <a
                    href={typeof data.secondaryCtaHref === "string" ? data.secondaryCtaHref : "#"}
                    className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {d.secondaryCtaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${bg} ${minHeight} ${className ?? ""}`} data-component="HeroSection">
      <div
        className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${isSplit ? "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center" : isCenter ? "text-center" : ""}`}
      >
        <div>
          {slots.showEyebrow && d.eyebrow && (
            <p
              data-slot="eyebrow"
              className="text-brand-primary mb-4 text-sm font-semibold uppercase tracking-widest"
            >
              {d.eyebrow}
            </p>
          )}
          <h1 data-slot="heading" className="text-h1 mb-6">
            {d.heading ?? ""}
          </h1>
          {slots.showSubheading && d.subheading && (
            <p
              data-slot="subheading"
              className="text-surface-muted-foreground mb-8 text-xl leading-relaxed"
            >
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
                data-slot="primaryCta"
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
            <img
              src={data.heroImage}
              alt={typeof data.heroImageAlt === "string" ? data.heroImageAlt : ""}
              aria-hidden={!data.heroImageAlt || undefined}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export { ComposableHeroSection as HeroSection };
