import { TownFinderClient } from "./town-finder-section.client";
import type { LayoutParams } from "./layout-params";

export interface TownFinderSectionSlots {
  showSectionHeading: boolean;
  showIntro: boolean;
  showCountyBadge: boolean;
}

export const TOWN_FINDER_DEFAULT_SLOTS: TownFinderSectionSlots = {
  showSectionHeading: true,
  showIntro: true,
  showCountyBadge: true,
};

export interface TownFinderTown {
  name: string;
  slug: string;
  href: string;
  county?: string;
}

interface TownFinderSectionProps {
  slots?: Partial<TownFinderSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function TownFinderSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: TownFinderSectionProps) {
  const slots = { ...TOWN_FINDER_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;
  const towns = Array.isArray(data.towns) ? (data.towns as TownFinderTown[]) : [];

  if (towns.length === 0) return null;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-on-brand-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="TownFinderSection">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 md:py-20 sm:px-6 lg:px-8">
        {slots.showSectionHeading && d.heading && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
            {d.heading}
          </h2>
        )}
        {slots.showIntro && d.intro && (
          <p className="text-base text-center opacity-80 mb-8 leading-relaxed">{d.intro}</p>
        )}
        <TownFinderClient
          towns={towns}
          placeholder={d.placeholder}
          showCountyBadge={slots.showCountyBadge}
        />
      </div>
    </section>
  );
}
