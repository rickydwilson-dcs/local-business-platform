"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
export function CardsServicesGrid({
  sectionLabel = "What We Do",
  heading = "Our Services",
  subtext = "Complete signage solutions from concept to installation. Whatever your business needs, we've built it before — and we'll build it better for you.",
  cards = [
    {
      image: "/images/service-vehicle-graphics.jpg",
      label: "Vehicle Graphics",
      href: "/services/vehicle-graphics",
    },
    {
      image: "/images/service-shop-signage.jpg",
      label: "Shop Signage",
      href: "/services/shop-signage",
    },
    {
      image: "/images/service-banners-flags.jpg",
      label: "Banners & Flags",
      href: "/services/banners",
    },
    {
      image: "/images/service-window-graphics.jpg",
      label: "Window Graphics",
      href: "/services/window-graphics",
    },
    {
      image: "/images/service-exhibition-stands.jpg",
      label: "Exhibition Stands",
      href: "/services/exhibition",
    },
    {
      image: "/images/service-design-services.jpg",
      label: "Design Services",
      href: "/services/design",
    },
  ],
}) {
  return (
    <section className="section bg-surface-background relative overflow-hidden">
      <div className="container-standard mx-auto px-6">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div className="max-w-xl min-w-0">
              <span className="text-small font-sans uppercase tracking-widest text-brand-primary mb-4 block">
                {sectionLabel}
              </span>
              <h2 className="text-h2 font-heading font-bold text-surface-foreground">{heading}</h2>
            </div>
            <p className="text-body font-sans text-surface-muted-foreground leading-relaxed max-w-sm min-w-0">
              {subtext}
            </p>
          </div>
        </RevealOnScroll>

        {/* Service cards grid — asymmetric sizes for visual interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card: { image: string; label: string; href: string }, i: number) => (
            <RevealOnScroll key={i}>
              <a
                href={card.href}
                className={`card-interactive group block relative overflow-hidden min-w-0 ${
                  i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div
                  className={`aspect-[4/3] bg-surface-muted overflow-hidden ${i === 0 ? "lg:aspect-[16/10]" : ""}`}
                >
                  <img
                    src={card.image}
                    alt={card.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-transparent to-transparent opacity-80" />
                </div>
                {/* Label bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                  <span className="text-h4 font-heading font-bold text-surface-foreground">
                    {card.label}
                  </span>
                  <span className="w-10 h-10 border border-brand-primary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-on-brand-primary transition-all duration-300">
                    →
                  </span>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
