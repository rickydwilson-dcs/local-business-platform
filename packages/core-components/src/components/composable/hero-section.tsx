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
  showBreadcrumbs: boolean;
}

export const HERO_SECTION_DEFAULT_SLOTS: HeroSectionSlots = {
  showEyebrow: true,
  showSubheading: true,
  showPrimaryCta: true,
  showSecondaryCta: true,
  showHeroImage: true,
  showTrustBadges: false,
  showBreadcrumbs: false,
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
      ? "bg-surface-inverse text-white"
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
            (data.overlayColor as string) === "brand" ? "bg-brand-primary/75" : "bg-black/75"
          }`}
        />
        <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white">
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
                  className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/80"
                >
                  {d.eyebrow}
                </p>
              )}
              <h1
                data-slot="heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white"
              >
                {d.heading ?? ""}
              </h1>
              {slots.showSubheading && d.subheading && (
                <p data-slot="subheading" className="mb-8 text-lg leading-relaxed text-white/90">
                  {d.subheading}
                </p>
              )}
              {slots.showTrustBadges && trustBadges.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3">
                  {trustBadges.map((badge, i) => (
                    <span key={i} className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
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
                    className="btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-transparent"
                  >
                    {d.primaryCtaText}
                  </a>
                )}
                {slots.showSecondaryCta && d.secondaryCtaText && (
                  <a
                    href={typeof data.secondaryCtaHref === "string" ? data.secondaryCtaHref : "#"}
                    className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-transparent"
                  >
                    {d.secondaryCtaText}
                  </a>
                )}
              </div>
              {slots.showBreadcrumbs && Array.isArray(data.breadcrumbs) && (
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="flex items-center gap-2 text-xs text-white/60">
                    {(data.breadcrumbs as Array<{ label: string; href: string }>).map(
                      (crumb, i, arr) => (
                        <li key={i} className="flex items-center gap-2">
                          {i < arr.length - 1 ? (
                            <>
                              <a
                                href={crumb.href}
                                className="hover:text-white transition-all duration-200 ease-out active:scale-[0.98]"
                              >
                                {crumb.label}
                              </a>
                              <span aria-hidden="true">/</span>
                            </>
                          ) : (
                            <span className="text-white/80">{crumb.label}</span>
                          )}
                        </li>
                      )
                    )}
                  </ol>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${bg} ${minHeight} ${className ?? ""}`} data-component="HeroSection">
      <div
        className={`mx-auto px-6 py-16 md:py-20 ${isSplit ? "w-full lg:w-[90%] grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center" : "max-w-4xl sm:px-6 lg:px-8"} ${isCenter && !isSplit ? "text-center" : ""}`}
      >
        <div>
          {slots.showEyebrow && d.eyebrow && (
            <p
              data-slot="eyebrow"
              className="text-brand-primary mb-3 text-xs font-semibold uppercase tracking-widest"
            >
              {d.eyebrow}
            </p>
          )}
          <h1
            data-slot="heading"
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${layout?.background === "inverse" ? "text-white" : "text-surface-foreground"}`}
          >
            {d.heading ?? ""}
          </h1>
          {slots.showSubheading && d.subheading && (
            <p
              data-slot="subheading"
              className={`mb-8 text-sm leading-relaxed ${layout?.background === "inverse" ? "text-white/80" : "text-surface-muted-foreground"}`}
            >
              {d.subheading}
            </p>
          )}
          {slots.showTrustBadges && trustBadges.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-3">
              {trustBadges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-surface-subtle text-surface-foreground rounded-full px-3 py-1 text-xs"
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
                className="btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                {d.primaryCtaText}
              </a>
            )}
            {slots.showSecondaryCta && d.secondaryCtaText && (
              <a
                href={typeof data.secondaryCtaHref === "string" ? data.secondaryCtaHref : "#"}
                className="btn-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                {d.secondaryCtaText}
              </a>
            )}
          </div>
          {slots.showBreadcrumbs && Array.isArray(data.breadcrumbs) && (
            <nav aria-label="Breadcrumb" className="mt-4">
              <ol
                className={`flex items-center gap-2 text-xs ${layout?.background === "inverse" ? "text-white/60" : "text-surface-muted-foreground"}`}
              >
                {(data.breadcrumbs as Array<{ label: string; href: string }>).map(
                  (crumb, i, arr) => (
                    <li key={i} className="flex items-center gap-2">
                      {i < arr.length - 1 ? (
                        <>
                          <a
                            href={crumb.href}
                            className="hover:text-surface-foreground transition-all duration-200 ease-out active:scale-[0.98]"
                          >
                            {crumb.label}
                          </a>
                          <span aria-hidden="true">/</span>
                        </>
                      ) : (
                        <span className="text-surface-foreground">{crumb.label}</span>
                      )}
                    </li>
                  )
                )}
              </ol>
            </nav>
          )}
        </div>
        {isSplit &&
          slots.showHeroImage &&
          (typeof data.heroImageSrc === "string" || typeof data.heroImage === "string") && (
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg lg:order-first">
              <Image
                src={getImageUrl(
                  (data.heroImageSrc as string | undefined) ?? (data.heroImage as string)
                )}
                alt={typeof data.heroImageAlt === "string" ? data.heroImageAlt : ""}
                aria-hidden={!data.heroImageAlt || undefined}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
      </div>
    </section>
  );
}

export { ComposableHeroSection as HeroSection };
