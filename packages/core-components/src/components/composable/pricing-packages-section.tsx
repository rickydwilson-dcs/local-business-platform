import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { LayoutParams } from "./layout-params";

export interface PricingPackagesSectionSlots {
  showSectionHeading: boolean;
  showIntro: boolean;
  showFeatures: boolean;
  showHighlightedBadge: boolean;
}

export const PRICING_PACKAGES_DEFAULT_SLOTS: PricingPackagesSectionSlots = {
  showSectionHeading: true,
  showIntro: true,
  showFeatures: true,
  showHighlightedBadge: true,
};

export interface PricingPackage {
  tier: "essential" | "standard" | "premium" | string;
  name: string;
  price?: string;
  priceSuffix?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badgeLabel?: string;
}

interface PricingPackagesSectionProps {
  slots?: Partial<PricingPackagesSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function PricingPackagesSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: PricingPackagesSectionProps) {
  const slots = { ...PRICING_PACKAGES_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;
  const packages = Array.isArray(data.packages) ? (data.packages as PricingPackage[]) : [];

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-on-brand-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="PricingPackagesSection">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2 className="heading-section tracking-tight text-center">{d.heading}</h2>
        )}
        {slots.showIntro && d.intro && (
          <p className="text-body-lg text-center opacity-80 mb-12 max-w-2xl mx-auto">{d.intro}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg) => {
            const isHighlighted = pkg.highlighted === true;
            const cardClasses = isHighlighted
              ? "relative bg-surface-card text-surface-foreground rounded-2xl border-2 border-brand-primary p-8 shadow-xl"
              : "bg-surface-card text-surface-foreground rounded-2xl border border-surface-card-border p-8";

            return (
              <div key={pkg.tier} className={cardClasses}>
                {slots.showHighlightedBadge && isHighlighted && (
                  <span className="text-label absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1 rounded-full bg-brand-primary text-on-brand-primary">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden />
                    {pkg.badgeLabel ?? "Most Popular"}
                  </span>
                )}
                <h3 className="heading-card-sm text-surface-foreground mb-2">{pkg.name}</h3>
                {pkg.description && (
                  <p className="text-body text-surface-muted-foreground mb-6">{pkg.description}</p>
                )}
                {pkg.price && (
                  <div className="mb-6">
                    <span className="stat-number text-surface-foreground mb-0">{pkg.price}</span>
                    {pkg.priceSuffix && (
                      <span className="text-body text-surface-muted-foreground ml-1">
                        {pkg.priceSuffix}
                      </span>
                    )}
                  </div>
                )}
                {slots.showFeatures && pkg.features.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-body flex items-start gap-2 text-surface-foreground"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0"
                          aria-hidden
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={pkg.cta.href}
                  className={
                    isHighlighted
                      ? "inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-brand-primary text-on-brand-primary font-semibold hover:bg-brand-primary-hover transition-colors"
                      : "inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-surface-card text-brand-primary border border-brand-primary font-semibold hover:bg-surface-subtle transition-colors"
                  }
                >
                  {pkg.cta.label}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
