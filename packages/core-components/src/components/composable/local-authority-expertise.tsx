import { CheckCircle2, Shield, MapPin } from "lucide-react";
import type { LayoutParams } from "./layout-params";

export interface LocalAuthorityExpertiseSlots {
  showExpertiseBullets: boolean;
  showFastTrackClaims: boolean;
  showCoverageNeighbourhoods: boolean;
}

export const LOCAL_AUTHORITY_EXPERTISE_DEFAULT_SLOTS: LocalAuthorityExpertiseSlots = {
  showExpertiseBullets: true,
  showFastTrackClaims: true,
  showCoverageNeighbourhoods: true,
};

interface LocalAuthorityData {
  name: string;
  description?: string;
  expertiseBullets?: string[];
  fastTrackClaims?: string[];
  coverageNeighbourhoods?: string[];
  heading?: string;
}

interface LocalAuthorityExpertiseProps {
  slots?: Partial<LocalAuthorityExpertiseSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function LocalAuthorityExpertise({
  slots: slotOverrides,
  layout,
  data,
  className,
}: LocalAuthorityExpertiseProps) {
  const authority = data.localAuthority as LocalAuthorityData | null | undefined;
  if (!authority || !authority.name) return null;

  const slots = { ...LOCAL_AUTHORITY_EXPERTISE_DEFAULT_SLOTS, ...slotOverrides };

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-on-brand-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const heading = authority.heading ?? `${authority.name} — Local Authority Expertise`;

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="LocalAuthorityExpertise">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{heading}</h2>
        {authority.description && (
          <p className="text-base leading-relaxed mb-10 max-w-3xl opacity-80">
            {authority.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {slots.showExpertiseBullets && (authority.expertiseBullets?.length ?? 0) > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-brand-primary" aria-hidden />
                <h3 className="text-base font-semibold">Expertise</h3>
              </div>
              <ul className="space-y-3">
                {authority.expertiseBullets!.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0"
                      aria-hidden
                    />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slots.showFastTrackClaims && (authority.fastTrackClaims?.length ?? 0) > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-brand-primary" aria-hidden />
                <h3 className="text-base font-semibold">Fast-track Claims</h3>
              </div>
              <ul className="space-y-3">
                {authority.fastTrackClaims!.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0"
                      aria-hidden
                    />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slots.showCoverageNeighbourhoods &&
            (authority.coverageNeighbourhoods?.length ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-brand-primary" aria-hidden />
                  <h3 className="text-base font-semibold">Coverage</h3>
                </div>
                <ul className="grid grid-cols-1 gap-2 text-sm">
                  {authority.coverageNeighbourhoods!.map((item, i) => (
                    <li key={i} className="opacity-90">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
