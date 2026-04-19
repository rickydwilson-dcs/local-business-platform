import type { ReactElement } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CardFeature {
  icon: string;
  heading: string;
  description: string;
}

export interface CardsThreeColumnFeaturesProps {
  cards?: CardFeature[];
}

const DEFAULT_CARDS: CardFeature[] = [
  {
    icon: "exterior",
    heading: "Külső terek",
    description:
      "Gondozott kert, fedett terasz és kerti grillezési lehetőség — minden, ami a szabadtéri pihenéshez kell.",
  },
  {
    icon: "interior",
    heading: "Belső terek",
    description:
      "Tágas, stílusosan berendezett szobák modern kényelemmel és otthonos hangulattal öt fő részére.",
  },
  {
    icon: "activities",
    heading: "Sport & Kikapcsolódás",
    description:
      "Kerékpározás, túrázás, vízi sportok és helyi borászatok — aktív és pihentető programok egyaránt.",
  },
];

const ICON_MAP: Record<string, ReactElement> = {
  exterior: (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 28V14L16 4l12 10v14H4z" />
      <path d="M12 28v-8h8v8" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  ),
  interior: (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="12" width="24" height="12" rx="1" />
      <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" />
      <path d="M4 20h24" />
    </svg>
  ),
  activities: (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="16" cy="8" r="3" />
      <path d="M10 28l3-10 3 4 3-4 3 10" />
      <path d="M8 18h16" />
    </svg>
  ),
};

export function CardsThreeColumnFeatures({ cards = DEFAULT_CARDS }: CardsThreeColumnFeaturesProps) {
  return (
    <section className="section bg-surface-background py-20 lg:py-28">
      <div className="container-standard mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-surface-muted">
          {cards.map((card, index) => (
            <RevealOnScroll key={card.heading}>
              <div
                className={`min-w-0 py-12 px-8 lg:px-10 ${
                  index < cards.length - 1 ? "md:border-r border-surface-muted" : ""
                } border-b md:border-b-0 border-surface-muted`}
              >
                {/* Card number */}
                <span
                  className="text-caption text-brand-primary font-medium mb-6 block"
                  style={{ fontFamily: "Work Sans, system-ui, sans-serif", letterSpacing: "0.1em" }}
                >
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="text-brand-secondary mb-6">
                  {ICON_MAP[card.icon] ?? ICON_MAP.exterior}
                </div>

                {/* Heading */}
                <h3
                  className="text-h4 text-brand-secondary mb-4"
                  style={{ fontFamily: "Audrey, Georgia, serif", fontWeight: 500 }}
                >
                  {card.heading}
                </h3>

                {/* Description */}
                <p
                  className="text-body text-surface-muted-foreground leading-relaxed"
                  style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
                >
                  {card.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
