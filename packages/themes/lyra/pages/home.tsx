import type { HomePageTemplateProps } from "@platform/core-components";
import Link from "next/link";
import Image from "next/image";

export function LyraHomePage({
  siteConfig,
  services,
  locations,
  heroImage,
  heroHeadline,
  heroSubheading,
  schemaNodes,
}: HomePageTemplateProps) {
  const defaultStats = [
    { value: "15+ Years", label: "In Business", icon: "history" },
    { value: "500+", label: "Happy Customers", icon: "sentiment_satisfied" },
    { value: "Daily", label: "Garden Maintenance", icon: "calendar_today" },
  ];

  const statItems =
    siteConfig.stats && siteConfig.stats.length > 0
      ? siteConfig.stats.map((s, i) => ({ ...s, icon: defaultStats[i]?.icon || "check_circle" }))
      : defaultStats;

  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* Hero Section — dark green gradient with image overlay */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background gradient + image overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-[var(--color-brand-dark)] opacity-95" />
          {heroImage && (
            <Image
              src={heroImage}
              alt={`Professional services by ${siteConfig.name}`}
              fill
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
              priority
            />
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block bg-brand-accent text-surface-foreground px-4 py-1 rounded-full text-sm font-semibold font-body mb-6">
              Now Booking
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-headline text-white mb-6 leading-[1.1]">
              {heroHeadline || (
                <>
                  Established Reliability for{" "}
                  <span className="text-[var(--color-brand-light)]">
                    {siteConfig.address.city} Landscapes.
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-brand-light)] opacity-90 mb-10 max-w-xl leading-relaxed font-body">
              {heroSubheading || siteConfig.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-[var(--color-brand-light)] text-brand-primary px-8 py-4 rounded-lg text-lg font-bold shadow-xl hover:bg-white transition-all text-center"
              >
                {siteConfig.cta.primary.label}
              </Link>
              <Link
                href="/services"
                className="border border-[var(--color-brand-light)]/30 text-white backdrop-blur-sm px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all text-center"
              >
                Our Services
              </Link>
            </div>
          </div>

          {/* Side image panel — hidden on mobile */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transform rotate-2">
              {/* TODO: accept a secondary hero image prop */}
              <div className="w-full h-full bg-[var(--color-brand-dark)]" />
            </div>
            {/* Floating testimonial card */}
            <div className="absolute -bottom-6 -left-6 bg-surface-muted p-6 rounded-xl shadow-xl max-w-xs transform -rotate-2">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-brand-accent"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium italic font-body">
                &ldquo;The most reliable service in the area. Our property has never looked
                better.&rdquo;
              </p>
              <p className="text-xs text-surface-muted-foreground mt-2">
                &mdash; Satisfied Customer
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-surface-muted py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {statItems.map((stat, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="bg-brand-primary/10 p-4 rounded-full">
                  <span className="material-symbols-outlined text-brand-primary text-4xl">
                    {stat.icon}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-primary font-headline">
                    {stat.value}
                  </div>
                  <div className="text-surface-muted-foreground text-sm uppercase tracking-wider font-semibold font-body">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-brand-primary mb-6">
                Our Professional Services
              </h2>
              <p className="text-lg text-surface-muted-foreground font-body">
                We offer a comprehensive suite of services tailored to the unique needs of your
                property.
              </p>
            </div>
            <Link
              href="/services"
              className="text-brand-secondary font-bold flex items-center gap-2 hover:underline group font-body"
            >
              View all services
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-surface-muted rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Image placeholder — services could optionally have heroImage */}
                <div className="aspect-video relative overflow-hidden bg-[var(--color-brand-dark)]/10">
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-transparent transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold font-headline mb-3 text-brand-primary">
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="text-surface-muted-foreground text-sm leading-relaxed mb-6 font-body line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  <span className="text-brand-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 font-body">
                    Details{" "}
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-surface-muted relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-brand-primary mb-4">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-brand-accent mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Testimonial placeholder cards */}
            {[
              {
                body: "Reliable and thorough! They have been looking after our property for years, and the level of detail is unmatched.",
                name: "Happy Customer",
                location: siteConfig.address.city,
                initials: "HC",
              },
              {
                body: "Transformed our outdoor space in just one day. The team was incredibly hardworking and left the place spotless.",
                name: "Satisfied Client",
                location: siteConfig.address.city,
                initials: "SC",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-surface-card p-10 rounded-xl relative shadow-sm border border-surface-cardBorder/10"
              >
                <span className="material-symbols-outlined text-6xl text-brand-primary/10 absolute top-4 right-8">
                  format_quote
                </span>
                <div className="flex items-center gap-1 text-brand-accent mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <blockquote className="text-xl font-headline italic text-brand-primary leading-relaxed mb-6">
                  &ldquo;{testimonial.body}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center text-white font-bold font-body">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-brand-primary font-body">{testimonial.name}</div>
                    <div className="text-sm text-surface-muted-foreground font-body">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[30rem] leading-none">park</span>
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-headline mb-8 max-w-3xl mx-auto">
            Ready to get started?
          </h2>
          <p className="text-xl text-[var(--color-brand-light)] opacity-80 mb-12 max-w-xl mx-auto font-body">
            Join hundreds of local families who trust {siteConfig.name} for their regular
            maintenance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-accent text-surface-foreground px-10 py-5 rounded-lg text-xl font-bold hover:scale-105 transition-transform text-center"
            >
              {siteConfig.cta.primary.label}
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">call</span>
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
