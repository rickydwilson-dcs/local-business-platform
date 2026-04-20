import { Phone, AlertCircle, Clock, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface BannerPoint {
  icon: string;
  label: string;
}

interface EmergencyBannerProps {
  slots?: {
    showHeading?: boolean;
    showPoints?: boolean;
    showDescription?: boolean;
    showCta?: boolean;
  };
  layout?: {
    background?: "inverse";
  };
  data: Record<string, unknown>;
  className?: string;
}

function getPointIcon(icon: string, index: number) {
  if (icon.includes("⏰") || index === 0)
    return <Clock className="w-5 h-5 text-brand-primary flex-shrink-0" />;
  if (icon.includes("⚡") || index === 1)
    return <Zap className="w-5 h-5 text-brand-primary flex-shrink-0" />;
  return <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />;
}

export function EmergencyBanner({ slots: slotOverrides, data, className }: EmergencyBannerProps) {
  const slots = {
    showHeading: true,
    showPoints: true,
    showDescription: true,
    showCta: true,
    ...slotOverrides,
  };

  const heading = typeof data.heading === "string" ? data.heading : undefined;
  const points = Array.isArray(data.points) ? (data.points as BannerPoint[]) : [];
  const description = typeof data.description === "string" ? data.description : undefined;
  const ctaText = typeof data.ctaText === "string" ? data.ctaText : undefined;
  const ctaHref = typeof data.ctaHref === "string" ? data.ctaHref : "#";

  return (
    <section
      className={`bg-black text-white py-12 ${className ?? ""}`}
      data-component="EmergencyBanner"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            {slots.showHeading && heading && <h2 className="text-2xl font-bold mb-3">{heading}</h2>}
            {slots.showPoints && points.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {points.map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {getPointIcon(point.icon, i)}
                    <span className="text-xs">{point.label}</span>
                  </div>
                ))}
              </div>
            )}
            {slots.showDescription && description && (
              <p className="text-surface-muted-foreground mb-4">{description}</p>
            )}
            {slots.showCta && ctaText && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
              >
                <Phone className="w-5 h-5" />
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
