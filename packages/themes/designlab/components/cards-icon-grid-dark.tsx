"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
export function CardsIconGridDark({
  heading = "Why Choose DesignLab?",
  subtext = "We don't just make signs — we engineer first impressions. Here's what sets us apart from every other signage company.",
  cards = [
    {
      icon: "⚡",
      title: "Rapid Turnaround",
      description:
        "Most projects designed, produced and installed within 5–7 working days. Rush jobs? We thrive on them.",
    },
    {
      icon: "🎯",
      title: "In-House Everything",
      description:
        "Design, print, fabrication, installation — all under one roof. No outsourcing, no excuses, total quality control.",
    },
    {
      icon: "🔧",
      title: "Built to Last",
      description:
        "Premium materials and meticulous installation mean your signage weathers storms, sun, and the test of time.",
    },
    {
      icon: "✦",
      title: "Design-Led Approach",
      description:
        "Every project begins with strategy. We consider your brand, your audience, and the environment before a single pixel is placed.",
    },
  ],
}) {
  return (
    <section className="section bg-brand-secondary relative overflow-hidden">
      {/* Subtle grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, currentColor 59px, currentColor 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, currentColor 59px, currentColor 60px)",
        }}
      />

      <div className="container-standard mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-h2 font-heading font-bold text-surface-foreground mb-4">
              {heading}
            </h2>
            <p className="text-body font-sans text-surface-muted-foreground leading-relaxed max-w-xl mx-auto">
              {subtext}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-muted">
          {cards.map((card: { icon: string; title: string; description: string }, i: number) => (
            <RevealOnScroll key={i}>
              <div className="bg-brand-secondary p-8 lg:p-10 min-w-0 group hover:bg-surface-background transition-colors duration-300 h-full">
                {/* Icon circle with brand ring */}
                <div className="w-14 h-14 rounded-full border-2 border-brand-primary flex items-center justify-center mb-6 text-h3 group-hover:bg-brand-primary group-hover:text-on-brand-primary transition-all duration-300">
                  <span>{card.icon}</span>
                </div>
                <h3 className="text-h4 font-heading font-bold text-surface-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-body font-sans text-surface-muted-foreground leading-relaxed">
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
