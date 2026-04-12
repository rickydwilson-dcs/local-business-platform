import type { HomePageTemplateProps, TestimonialSummary } from "@platform/core-components";
import Link from "next/link";

interface CastorHomePageProps extends HomePageTemplateProps {
  testimonials?: TestimonialSummary[];
}

export function CastorHomePage({
  siteConfig,
  services,
  heroHeadline,
  heroSubheading,
  testimonials,
  schemaNodes,
}: CastorHomePageProps) {
  const stats = siteConfig.stats ?? [
    { value: "15+ Years", label: "Professional Experience", icon: "schedule" },
    { value: "5,000+", label: "Jobs Completed Locally", icon: "handyman" },
    { value: "100%", label: "Workmanship Guarantee", icon: "thumb_up" },
  ];

  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* Hero Section */}
      <header className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: wire to heroImage prop or R2 asset */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-home.jpg')",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(26,58,107,0.75)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
          <div className="max-w-2xl">
            <h1 className="font-headline text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
              {heroHeadline || `Reliable services for every ${siteConfig.address.city} home.`}
            </h1>
            <p className="text-slate-200 font-body text-lg md:text-xl leading-relaxed mb-10 max-w-[60ch]">
              {heroSubheading || siteConfig.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold active:-translate-y-px transition-all"
              >
                {siteConfig.cta.primary.label}
              </Link>
              <Link
                href="/services"
                className="border-[1.5px] border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-brand-primary transition-all"
              >
                View Our Services
              </Link>
            </div>
          </div>
          {/* Floating Trust Card */}
          <div className="absolute bottom-8 right-6 md:right-8 bg-white p-5 rounded-xl shadow-lg border border-surface-subtle hidden sm:flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-[#f59e0b] mb-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-surface-foreground font-bold text-lg">4.9 / 5.0 Rating</span>
              <span className="text-surface-muted-foreground text-sm">
                Based on 250+ local reviews
              </span>
            </div>
            <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center text-brand-primary">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-surface-muted py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {(stats as Array<{ value: string; label: string; icon?: string }>).map((stat, index) => (
            <div key={index} className="flex items-center gap-5">
              <span className="material-symbols-outlined text-4xl text-brand-accent">
                {stat.icon ?? "check_circle"}
              </span>
              <div>
                <div className="font-headline text-3xl font-extrabold text-brand-accent">
                  {stat.value}
                </div>
                <div className="text-surface-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section (Zig-Zag) */}
      <section className="py-24 space-y-24 max-w-[1280px] mx-auto px-6 md:px-8">
        {services.slice(0, 4).map((service, index) => {
          const isReversed = index % 2 === 0;
          return (
            <div
              key={service.slug}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              <div className={isReversed ? "order-2 md:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  {service.icon && (
                    <span
                      className="material-symbols-outlined text-brand-accent"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {service.icon}
                    </span>
                  )}
                  <span className="text-surface-muted-foreground font-semibold tracking-wider text-xs uppercase">
                    {service.title}
                  </span>
                </div>
                <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
                  {service.description || service.title}
                </h2>
                <p className="font-body text-surface-foreground leading-relaxed mb-8">
                  {service.description || "Professional service delivered with care and expertise."}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-brand-accent font-semibold flex items-center gap-2 group"
                >
                  View Details
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className={isReversed ? "order-1 md:order-2" : ""}>
                {/* TODO: wire to service heroImage or R2 asset */}
                <div className="rounded-xl shadow-md w-full aspect-[4/3] bg-surface-muted" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-surface-muted py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="mb-16">
              <h2 className="font-headline text-surface-foreground text-4xl font-bold mb-4">
                What our customers say.
              </h2>
              <p className="text-surface-muted-foreground max-w-xl">
                Verified reviews from homeowners across {siteConfig.address.city}
                {siteConfig.address.county ? ` and ${siteConfig.address.county}` : ""}.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Column 1 */}
              <div className="space-y-8">
                {testimonials
                  .filter((_, i) => i % 2 === 0)
                  .map((testimonial) => (
                    <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
                  ))}
              </div>
              {/* Column 2 (Staggered) */}
              <div className="space-y-8 md:mt-12">
                {testimonials
                  .filter((_, i) => i % 2 === 1)
                  .map((testimonial) => (
                    <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="bg-brand-primary py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center">
          <span className="material-symbols-outlined text-brand-accent text-6xl mb-6">
            plumbing
          </span>
          <h2 className="font-headline text-white text-3xl md:text-5xl font-bold mb-8">
            Ready to start your project?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-accent text-white px-10 py-4 rounded-lg font-bold text-lg active:-translate-y-px transition-all"
            >
              {siteConfig.cta.primary.label}
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-[1.5px] border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-brand-primary transition-all"
              >
                Call Us: {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Testimonial Card sub-component ─────────────────────────────────────────── */

function TestimonialCard({ testimonial }: { testimonial: TestimonialSummary }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-surface-card p-8 rounded-xl border border-surface-subtle shadow-sm border-l-4 border-l-brand-accent">
      <div className="flex gap-0.5 text-[#f59e0b] mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
      <blockquote className="italic text-surface-foreground text-lg leading-relaxed mb-8">
        &ldquo;{testimonial.body}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
          {initials}
        </div>
        <div>
          <div className="font-bold text-surface-foreground">{testimonial.name}</div>
          {testimonial.platform && (
            <div className="text-surface-muted-foreground text-sm">{testimonial.platform}</div>
          )}
        </div>
      </div>
    </div>
  );
}
