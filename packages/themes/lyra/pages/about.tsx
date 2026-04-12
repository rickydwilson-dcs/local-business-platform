import type { AboutPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function LyraAboutPage({ siteConfig }: AboutPageTemplateProps) {
  return (
    <main className="pt-20">
      {/* Hero Section — full-bleed image with gradient overlay */}
      <section className="relative h-[500px] md:h-[700px] flex items-center overflow-hidden">
        {/* TODO: accept heroImage prop; use background-image for full-bleed hero */}
        <div className="absolute inset-0 z-0 bg-brand-primary">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(145deg, rgba(22,53,38,0.9) 0%, rgba(45,76,59,0.7) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <span className="inline-block py-1 px-3 mb-6 bg-brand-accent text-surface-foreground font-medium text-xs tracking-widest uppercase rounded-sm font-body">
              About Us
            </span>
            <h1 className="text-6xl md:text-8xl font-headline italic leading-tight mb-6">
              A Legacy of Quality Service
            </h1>
            <p className="text-xl md:text-2xl font-body font-light text-[var(--color-brand-light)] max-w-xl leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-5xl font-headline text-brand-primary">
                The Story Behind {siteConfig.name}
              </h2>
              <div className="space-y-6 text-surface-muted-foreground leading-relaxed font-body text-lg">
                <p>
                  Our journey began with a simple belief: that every property deserves expert care
                  from people who truly understand their craft. From humble beginnings in{" "}
                  {siteConfig.address.city}, {siteConfig.name} has grown into a trusted local
                  business recognized for uncompromising attention to detail.
                </p>
                <p>
                  Every project we undertake is a testament to our values of patience, stewardship,
                  and local craftsmanship. We take pride in serving our community with the same care
                  and dedication that built our reputation.
                </p>
                <p className="italic font-headline text-brand-primary text-xl border-l-4 border-brand-secondary pl-6">
                  &ldquo;We don&apos;t just provide services; we build lasting relationships with
                  our clients.&rdquo;
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              {/* TODO: accept team/founder image prop */}
              <div className="bg-surface-muted aspect-[4/5] rounded-lg overflow-hidden shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-[var(--color-brand-dark)]/5" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-brand-primary p-8 rounded shadow-xl hidden md:block">
                <p className="text-white font-headline italic text-2xl">
                  {siteConfig.stats?.[0]
                    ? `${siteConfig.stats[0].value} ${siteConfig.stats[0].label}`
                    : "Years of Excellence"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline text-brand-primary mb-4">
              Our Values
            </h2>
            <div className="h-1 w-24 bg-brand-accent mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "temp_preferences_eco",
                title: "Rooted in Quality",
                body: "We use only the finest materials and techniques. Quality is not an option; it is the foundation of everything we do.",
              },
              {
                icon: "handshake",
                title: "Built on Trust",
                body: `Years of serving families across ${siteConfig.address.city} and beyond. Our reputation is built on reliability and honest, transparent communication.`,
              },
              {
                icon: "search_insights",
                title: "Dedicated to Detail",
                body: "We notice the small things that others miss. Perfection is in the details, and we take pride in every aspect of our work.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-surface-card p-10 rounded-lg group hover:bg-[var(--color-brand-dark)] transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[var(--color-brand-light)] rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-colors">
                  <span className="material-symbols-outlined text-brand-primary text-3xl">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-headline text-brand-primary mb-4 group-hover:text-white transition-colors">
                  {value.title}
                </h3>
                <p className="font-body text-surface-muted-foreground group-hover:text-[var(--color-brand-light)] transition-colors leading-relaxed">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Accreditations Bar */}
      <section className="py-12 bg-surface-card overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              { icon: "verified", label: "Fully Insured" },
              { icon: "workspace_premium", label: "Professional Body Member" },
              { icon: "gavel", label: "Approved Contractor" },
              { icon: "landscape", label: "Industry Accredited" },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 font-headline text-lg font-bold text-surface-foreground"
              >
                <span className="material-symbols-outlined text-brand-primary">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-headline italic mb-8">Ready to Get Started?</h2>
          <p className="font-body text-xl mb-12 opacity-90 leading-relaxed text-[var(--color-brand-light)]">
            Whether you require a one-off project or ongoing care, our team is ready to serve you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-accent text-surface-foreground px-10 py-4 rounded font-body font-bold text-lg hover:brightness-110 transition-all"
            >
              {siteConfig.cta.primary.label}
            </Link>
            <Link
              href="/services"
              className="border border-white/30 px-10 py-4 rounded font-body font-bold text-lg hover:bg-white/10 transition-all"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
