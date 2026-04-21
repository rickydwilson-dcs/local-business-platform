import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { LayoutParams } from "./layout-params";

export interface CountyGatewayCardsSlots {
  showSectionHeading: boolean;
  showDescription: boolean;
  showHighlights: boolean;
  showTownCount: boolean;
}

export const COUNTY_GATEWAY_CARDS_DEFAULT_SLOTS: CountyGatewayCardsSlots = {
  showSectionHeading: true,
  showDescription: true,
  showHighlights: true,
  showTownCount: true,
};

export interface CountyCard {
  name: string;
  slug: string;
  href?: string;
  description?: string;
  highlights?: string[];
  townCount?: number;
}

interface CountyGatewayCardsProps {
  slots?: Partial<CountyGatewayCardsSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function CountyGatewayCards({
  slots: slotOverrides,
  layout,
  data,
  className,
}: CountyGatewayCardsProps) {
  const slots = { ...COUNTY_GATEWAY_CARDS_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;
  const counties = Array.isArray(data.counties) ? (data.counties as CountyCard[]) : [];
  const cols = layout?.columns ?? 3;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-on-brand-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const gridCols =
    cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
      data-component="CountyGatewayCards"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
            {d.heading}
          </h2>
        )}
        {d.intro && (
          <p className="text-base text-center opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {d.intro}
          </p>
        )}
        <div className={`grid gap-6 lg:gap-8 ${gridCols}`}>
          {counties.map((county) => (
            <Link
              key={county.slug}
              href={county.href ?? `/locations/${county.slug}`}
              className="group bg-surface-card text-surface-foreground rounded-2xl border border-surface-card-border p-8 hover:shadow-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-surface-foreground">{county.name}</h3>
                {slots.showTownCount && typeof county.townCount === "number" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    {county.townCount} towns
                  </span>
                )}
              </div>
              {slots.showDescription && county.description && (
                <p className="text-sm text-surface-muted-foreground leading-relaxed mb-6">
                  {county.description}
                </p>
              )}
              {slots.showHighlights && (county.highlights?.length ?? 0) > 0 && (
                <ul className="space-y-2 mb-6">
                  {county.highlights!.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-foreground">
                      <CheckCircle2
                        className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary group-hover:translate-x-1 transition-transform">
                Explore {county.name} <ArrowRight className="w-4 h-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
