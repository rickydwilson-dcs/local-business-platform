import { Clock, AlertCircle, Shield, Zap } from "lucide-react";
import type { LayoutParams } from "./layout-params";

interface RateCard {
  icon: string;
  title: string;
  price: string;
  unit: string;
  description: string;
  featured?: boolean;
}

interface RateCardsSectionProps {
  slots?: {
    showHeading?: boolean;
  };
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

function getCardIcon(icon: string, title: string, featured: boolean) {
  const cls = `w-12 h-12 mx-auto mb-4 ${featured ? "text-white" : "text-brand-primary"}`;
  if (icon.includes("⏰") || title.includes("Standard")) return <Clock className={cls} />;
  if (icon.includes("🚨") || title.includes("Emergency")) return <AlertCircle className={cls} />;
  if (icon.includes("🛡️") || title.includes("Commercial")) return <Shield className={cls} />;
  return <Zap className={cls} />;
}

export function RateCardsSection({ slots: slotOverrides, data, className }: RateCardsSectionProps) {
  const showHeading = slotOverrides?.showHeading ?? true;
  const heading = typeof data.heading === "string" ? data.heading : "Hourly Rates";
  const cards = Array.isArray(data.cards) ? (data.cards as RateCard[]) : [];

  return (
    <section
      className={`bg-surface-background ${className ?? ""}`}
      data-component="RateCardsSection"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {showHeading && (
          <h2 className="heading-section text-surface-foreground mb-8 text-center">{heading}</h2>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const featured = card.featured === true;
            return featured ? (
              <div
                key={i}
                className="bg-brand-primary text-white rounded-lg p-6 border-4 border-brand-primary shadow-xl transform md:scale-105"
              >
                {getCardIcon(card.icon, card.title, true)}
                <h3 className="heading-card-sm mb-2 text-center">{card.title}</h3>
                <p className="stat-number mb-2 text-center">{card.price}</p>
                <p className="text-caption text-white/90 text-center">{card.unit}</p>
                <p className="text-caption text-white/90 mt-4 text-center">{card.description}</p>
              </div>
            ) : (
              <div
                key={i}
                className="bg-surface-subtle rounded-lg p-6 border-2 border-surface-border"
              >
                {getCardIcon(card.icon, card.title, false)}
                <h3 className="heading-card-sm text-surface-foreground mb-2 text-center">
                  {card.title}
                </h3>
                <p className="stat-number text-brand-primary mb-2 text-center">{card.price}</p>
                <p className="text-caption text-surface-muted-foreground text-center">
                  {card.unit}
                </p>
                <p className="text-caption text-surface-muted-foreground mt-4 text-center">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
