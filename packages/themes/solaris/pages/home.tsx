import type { HomePageTemplateProps, TestimonialSummary } from "@platform/core-components";
import Link from "next/link";

export interface SolarisHomePageProps extends HomePageTemplateProps {
  testimonials?: TestimonialSummary[];
}

const defaultStats = [
  { value: "10+ Years", label: "In Business", icon: "history" },
  { value: "500+", label: "Happy Clients", icon: "sentiment_satisfied" },
  { value: "5-Star", label: "Rated Service", icon: "star" },
];

const serviceIcons: Record<string, string> = {
  default: "build_circle",
  garden: "yard",
  cleaning: "cleaning_services",
  electrical: "bolt",
  plumbing: "plumbing",
  painting: "format_paint",
  landscaping: "nature",
};

function resolveServiceIcon(title: string, provided?: string): string {
  if (provided) return provided;
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (key !== "default" && lower.includes(key)) return icon;
  }
  return serviceIcons.default;
}

export function SolarisHomePage({
  siteConfig,
  services,
  locations,
  heroImage: _heroImage,
  heroHeadline,
  heroSubheading,
  schemaNodes,
  testimonials,
}: SolarisHomePageProps) {
  const statItems =
    siteConfig.stats && siteConfig.stats.length > 0
      ? siteConfig.stats.map((s, i) => ({
          ...s,
          icon: s.icon ?? defaultStats[i]?.icon ?? "check_circle",
        }))
      : defaultStats;

  const displayedServices = services.slice(0, 6);
  const showTestimonials = testimonials && testimonials.length > 0;

  return (
    <div className="min-h-screen font-body">
      {schemaNodes}

      {/* ─── Hero — Split Layout ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row min-h-[580px] md:min-h-[660px]">
            {/* Left panel — 60% — headline + CTAs */}
            <div className="flex flex-col justify-center py-16 lg:py-24 lg:w-[60%] lg:pr-12">
              <span className="inline-block bg-brand-primary/15 text-brand-primary px-4 py-1.5 rounded-full text-sm font-semibold font-body mb-6 w-fit">
                {siteConfig.address.city} &amp; Surrounding Areas
              </span>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-surface-foreground mb-6 leading-[1.1]">
                {heroHeadline ?? (
                  <>
                    Professional services you can{" "}
                    <span className="text-brand-primary">count on.</span>
                  </>
                )}
              </h1>

              <p className="text-lg md:text-xl text-surface-muted-foreground mb-10 max-w-lg leading-relaxed font-body">
                {heroSubheading ?? siteConfig.tagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={siteConfig.cta.primary.href}
                  className="bg-brand-primary text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:bg-brand-primary/90 transition-colors text-center"
                >
                  {siteConfig.cta.primary.label}
                </Link>
                {siteConfig.cta.phone.show && (
                  <Link
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center justify-center gap-2 border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl text-base font-bold hover:bg-brand-primary/10 transition-colors text-center"
                  >
                    <span
                      className="material-symbols-outlined text-xl leading-none"
                      aria-hidden="true"
                    >
                      call
                    </span>
                    {siteConfig.phoneDisplay}
                  </Link>
                )}
              </div>

              {locations.length > 0 && (
                <p className="mt-8 text-sm text-surface-muted-foreground font-body">
                  <span
                    className="material-symbols-outlined text-base align-middle mr-1"
                    aria-hidden="true"
                  >
                    location_on
                  </span>
                  Serving{" "}
                  {locations
                    .slice(0, 3)
                    .map((l) => l.title)
                    .join(", ")}
                  {locations.length > 3 ? ` +${locations.length - 3} more` : ""}
                </p>
              )}
            </div>

            {/* Right panel — 40% — geometric shapes */}
            <div
              className="hidden lg:flex lg:w-[40%] relative items-center justify-center overflow-hidden rounded-bl-[60px]"
              style={{ background: "rgba(97,163,186,0.1)" }}
            >
              {/* Decorative geo shapes — styled via globals.css / site CSS */}
              <div className="solaris-geo-shape solaris-geo-1" />
              <div className="solaris-geo-shape solaris-geo-2" />
              <div className="solaris-geo-shape solaris-geo-3" />
              <div className="solaris-geo-shape solaris-geo-4" />

              {/* Centre badge */}
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl text-center">
                <div className="flex items-center gap-1 justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-brand-accent text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-surface-foreground font-body">
                  Trusted by local families
                </p>
                <p className="text-xs text-surface-muted-foreground mt-1 font-body">
                  {siteConfig.address.city}
                  {siteConfig.address.county ? `, ${siteConfig.address.county}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Stats Bar ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {statItems.map((stat, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 justify-center md:justify-start solaris-reveal solaris-stagger-${index + 1}`}
              >
                <div className="bg-white/20 p-3 rounded-full shrink-0">
                  <span
                    className="material-symbols-outlined text-white text-3xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {stat.icon}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-headline leading-none">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wider font-semibold font-body mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services Grid ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold font-headline text-surface-foreground mb-4 solaris-heading">
              What We Do
            </h2>
            <p className="text-lg text-surface-muted-foreground max-w-2xl mx-auto font-body">
              From routine maintenance to complete transformations — we handle it all.
            </p>
            <div className="mt-5 w-16 h-1 bg-brand-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedServices.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`block bg-surface-card rounded-[20px] shadow-md solaris-card-hover solaris-card-accent p-6 border border-surface-card-border group solaris-reveal solaris-stagger-${index + 1}`}
              >
                <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-primary/20 transition-colors">
                  <span
                    className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {resolveServiceIcon(service.title, service.icon)}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-headline text-surface-foreground mb-2 group-hover:text-brand-primary transition-colors">
                  {service.title}
                </h3>

                {service.description && (
                  <p className="text-surface-muted-foreground text-sm leading-relaxed font-body line-clamp-3 mb-4">
                    {service.description}
                  </p>
                )}

                <span className="inline-flex items-center gap-1 text-brand-primary text-sm font-semibold font-body group-hover:gap-2 transition-all">
                  Learn more
                  <span
                    className="material-symbols-outlined text-base leading-none"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {services.length > 6 && (
            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors font-body"
              >
                View all services
                <span
                  className="material-symbols-outlined text-base leading-none"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Why Us ──────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold font-headline text-surface-foreground mb-4 solaris-heading">
              Why choose {siteConfig.name}?
            </h2>
            <p className="text-lg text-surface-muted-foreground max-w-2xl mx-auto font-body">
              We make it simple to get quality work done — no stress, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: "handyman",
                title: "No DIY hassle",
                body: "Skip the weekend YouTube tutorials. We arrive fully equipped and get the job done right first time.",
              },
              {
                icon: "search",
                title: "Built for Google",
                body: "Our sites rank locally so when your neighbours search, they find us — and we find you more business.",
              },
              {
                icon: "price_check",
                title: "Fixed pricing",
                body: "No surprise invoices. You get a clear quote upfront and pay exactly that. No hidden extras.",
              },
            ].map((feature, index) => (
              <div
                key={feature.icon}
                className={`flex flex-col items-start bg-surface-card rounded-[20px] p-8 border border-surface-card-border shadow-sm solaris-reveal solaris-stagger-${index + 1}`}
              >
                <div className="bg-brand-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <span
                    className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-headline text-surface-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-muted-foreground font-body leading-relaxed text-sm">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────────────────── */}
      {showTestimonials && (
        <section className="py-20 md:py-28 bg-surface-muted">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold font-headline text-surface-foreground mb-4 solaris-heading">
                What our clients say
              </h2>
              <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials!.slice(0, 3).map((testimonial, index) => (
                <div
                  key={testimonial.slug}
                  className={`bg-surface-card rounded-[20px] p-6 border border-surface-card-border shadow-sm flex flex-col solaris-reveal solaris-stagger-${index + 1}`}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-brand-accent text-lg leading-none"
                        style={{
                          fontVariationSettings: i < testimonial.rating ? "'FILL' 1" : "'FILL' 0",
                        }}
                        aria-hidden="true"
                      >
                        star
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-surface-foreground font-body leading-relaxed flex-1 text-sm">
                    &ldquo;{testimonial.body}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="mt-5 pt-4 border-t border-surface-card-border flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-surface-foreground font-body">
                        {testimonial.name}
                      </div>
                      {testimonial.platform && (
                        <div className="text-xs text-surface-muted-foreground mt-0.5 font-body">
                          via {testimonial.platform}
                        </div>
                      )}
                    </div>
                    <span
                      className="material-symbols-outlined text-brand-primary/40 text-4xl leading-none"
                      aria-hidden="true"
                    >
                      format_quote
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold font-headline text-[var(--color-surface-foreground)] mb-4 solaris-heading">
            Ready to get more enquiries?
          </h2>
          <p className="text-lg text-[var(--color-surface-foreground)]/80 font-body mb-10 max-w-xl mx-auto">
            Let&rsquo;s get your business in front of the right customers in{" "}
            {siteConfig.address.city}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-surface-foreground text-white px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:opacity-90 transition-opacity text-center font-body"
            >
              Get a free quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="flex items-center justify-center gap-2 border-2 border-[var(--color-surface-foreground)] text-[var(--color-surface-foreground)] px-10 py-4 rounded-xl text-base font-bold hover:bg-black/10 transition-colors font-body"
              >
                <span className="material-symbols-outlined text-xl leading-none" aria-hidden="true">
                  call
                </span>
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
