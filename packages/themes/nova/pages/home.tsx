import type { HomePageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function NovaHomePage({
  siteConfig,
  services,
  locations,
  heroImage,
  heroHeadline,
  heroSubheading,
  schemaNodes,
}: HomePageTemplateProps) {
  const defaultStats = [
    { value: "500+", label: "Projects Completed", icon: "rocket_launch" },
    { value: "15+", label: "Years Experience", icon: "calendar_today" },
    { value: "100%", label: "Satisfaction Guaranteed", icon: "thumb_up" },
  ];

  const statsWithIcons =
    siteConfig.stats && siteConfig.stats.length > 0
      ? siteConfig.stats.map((stat, i) => ({
          ...stat,
          icon: defaultStats[i]?.icon || "star",
        }))
      : defaultStats;

  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* Hero Section — full-bleed image with orange gradient overlay */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual hero image URL from site config */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: heroImage ? `url(${heroImage})` : "url(/images/hero-home.jpg)",
            }}
          >
            <div className="w-full h-full bg-surface-muted" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--color-brand-primary) 0%, rgba(232,81,24,0.6) 50%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              {heroHeadline || (
                <>
                  Making Your <span className="italic">Brand</span> Stand Out
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-xl opacity-95">
              {heroSubheading || siteConfig.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-white text-brand-primary px-8 py-4 rounded-lg font-extrabold text-lg hover:bg-zinc-100 transition-colors shadow-xl"
              >
                {siteConfig.cta.primary.label}
              </Link>
              <Link
                href="/services"
                className="bg-brand-secondary text-white px-8 py-4 rounded-lg font-extrabold text-lg hover:brightness-110 transition-colors shadow-xl"
              >
                View Our Work
              </Link>
            </div>
          </div>

          {/* Floating Stats Card */}
          <div className="hidden lg:block relative">
            <div className="absolute -top-12 -right-6 bg-white p-8 rounded-xl shadow-2xl border-l-8 border-brand-secondary">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-brand-secondary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-brand-accent">
                      {statsWithIcons[0]?.value || "100%"}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                      {statsWithIcons[0]?.label || "Quality Guarantee"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-brand-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      precision_manufacturing
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-brand-accent">
                      {statsWithIcons[1]?.value || "500+"}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                      {statsWithIcons[1]?.label || "Projects Completed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-muted py-12 border-b border-surface-cardBorder">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsWithIcons.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center gap-6 justify-center ${
                index === 0
                  ? "md:justify-start"
                  : index === statsWithIcons.length - 1
                    ? "md:justify-end"
                    : ""
              }`}
            >
              <span
                className="material-symbols-outlined text-5xl text-brand-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {stat.icon}
              </span>
              <div>
                <div className="text-4xl font-black text-brand-accent leading-none mb-1">
                  {stat.value}
                </div>
                <p className="font-bold text-zinc-500 uppercase text-xs tracking-widest">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl md:text-5xl font-black text-brand-accent mb-4">
            Our Core Services
          </h2>
          <div className="h-1.5 w-24 bg-brand-secondary mx-auto mb-6" />
          <p className="text-lg text-zinc-600">
            From initial concept to final delivery, we provide high-quality solutions tailored to
            your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.slice(0, 4).map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="aspect-video relative overflow-hidden bg-surface-muted">
                {/* TODO: Service images from frontmatter heroImage */}
                <div className="w-full h-full bg-zinc-200 group-hover:scale-110 transition-transform duration-500" />
                {service.icon && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg text-brand-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {service.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-black mb-3 text-surface-foreground">{service.title}</h3>
                {service.description && (
                  <p className="text-zinc-600 mb-6 line-clamp-3">{service.description}</p>
                )}
                <span className="inline-flex items-center font-bold text-brand-primary hover:gap-2 transition-all">
                  Details <span className="material-symbols-outlined ml-1">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {services.length > 4 && (
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primaryHover transition-colors"
            >
              View All Services
            </Link>
          </div>
        )}
      </section>

      {/* Testimonials Section — dark background */}
      <section className="bg-brand-accent py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-black text-white mb-4">
              What Our Clients Say
            </h2>
            <div className="h-1.5 w-24 bg-brand-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder testimonials — sites will override with real data */}
            {[0, 1].map((i) => (
              <div key={i} className="bg-white p-10 rounded-xl relative">
                <span className="material-symbols-outlined text-zinc-100 text-8xl absolute top-4 right-8 select-none">
                  format_quote
                </span>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className="material-symbols-outlined text-brand-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <blockquote className="text-xl italic text-zinc-700 mb-8 relative z-10">
                  {i === 0
                    ? `"${siteConfig.name} transformed our business. The attention to detail was incredible. Highly recommended!"`
                    : `"Speed and quality are hard to find, but ${siteConfig.name} delivered both. Professional from start to finish."`}
                </blockquote>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 ${i === 0 ? "bg-brand-secondary" : "bg-brand-primary"} rounded-full flex items-center justify-center text-white font-bold text-xl`}
                  >
                    {i === 0 ? "JD" : "SL"}
                  </div>
                  <div>
                    <p className="font-black text-brand-accent">
                      {i === 0 ? "Satisfied Customer" : "Happy Client"}
                    </p>
                    <p className="text-zinc-500 text-sm">Local Business</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band — bold orange */}
      <section className="bg-brand-primary py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="font-headline text-4xl md:text-6xl font-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto opacity-90">
            Get in touch today for a free, no-obligation quote. Our team in{" "}
            {siteConfig.address.city} is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/contact"
              className="bg-white text-brand-primary px-10 py-5 rounded-lg font-black text-xl hover:bg-zinc-100 transition-all shadow-2xl"
            >
              Get a Free Quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="bg-brand-secondary text-white px-10 py-5 rounded-lg font-black text-xl hover:brightness-110 transition-all shadow-2xl"
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
