import type { AboutPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function NovaAboutPage({ siteConfig }: AboutPageTemplateProps) {
  const stats = siteConfig.stats || [];

  return (
    <>
      {/* Page Hero — image overlay with orange tint */}
      <section className="relative h-[614px] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual about hero image */}
          <div className="w-full h-full bg-brand-accent" />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(232,81,24,0.4)", mixBlendMode: "multiply" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-headline font-black text-5xl md:text-7xl mb-6 leading-tight">
              About {siteConfig.name}
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 mb-8 border-l-4 border-brand-secondary pl-6">
              {siteConfig.tagline}
            </p>
            <div className="flex gap-4">
              <Link
                href="/services"
                className="bg-brand-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all"
              >
                View Our Work
              </Link>
              <Link
                href="/contact"
                className="bg-brand-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Accreditations Bar */}
      <section className="bg-zinc-100 py-10 border-b border-surface-cardBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-60">
            {[
              { icon: "verified", label: "Industry Certified" },
              { icon: "workspace_premium", label: "Quality Assured" },
              { icon: "eco", label: "Eco Friendly" },
              { icon: "shield", label: "Fully Insured" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
                <span className="font-bold tracking-tighter uppercase text-xl">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">
              Our Journey
            </span>
            <h2 className="font-headline font-bold text-4xl md:text-5xl leading-tight text-surface-foreground">
              Built on Precision and Passion in {siteConfig.address.city}
            </h2>
            <div className="space-y-4 text-zinc-600 text-lg leading-relaxed">
              <p>
                Founded on the principle that quality should never be compromised, {siteConfig.name}{" "}
                started with a singular vision: to help businesses achieve excellence through
                superior craftsmanship.
              </p>
              <p>
                Over the years, we have grown into {siteConfig.address.city}&apos;s trusted
                specialists, investing in the latest technology while maintaining the personal
                approach that defines our brand. Every project that leaves our hands is a testament
                to our commitment to quality.
              </p>
            </div>
            <div className="pt-8 border-t border-zinc-100">
              <blockquote className="relative">
                <span
                  className="material-symbols-outlined text-6xl absolute -top-8 -left-4"
                  style={{ color: "rgba(91,168,41,0.2)" }}
                >
                  format_quote
                </span>
                <p className="font-headline italic text-2xl text-brand-accent leading-snug">
                  &ldquo;We don&apos;t just deliver services; we create results that command
                  attention. If it doesn&apos;t make your business stand out, we aren&apos;t done
                  yet.&rdquo;
                </p>
                <cite className="block mt-4 not-italic font-bold text-brand-primary">
                  &mdash; Founder &amp; Lead, {siteConfig.name}
                </cite>
              </blockquote>
            </div>
          </div>

          {/* Image + floating stat */}
          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden shadow-2xl bg-surface-muted">
              {/* TODO: Replace with actual about image */}
              <div className="w-full h-full bg-zinc-300" />
            </div>
            {stats.length > 0 && (
              <div className="absolute -bottom-8 -left-8 bg-brand-secondary text-white p-8 rounded-lg shadow-xl hidden lg:block">
                <div className="text-4xl font-black">{stats[0].value}</div>
                <div className="text-sm font-bold uppercase tracking-wider">{stats[0].label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-surface-muted py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline font-bold text-4xl mb-4 text-surface-foreground">
              The Values That Drive Us
            </h2>
            <p className="text-zinc-500">
              Every project we undertake is guided by a core set of principles that ensure we
              deliver nothing but the best for our clients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quality Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all group border-b-4 border-transparent hover:border-brand-primary">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: "rgba(232,81,24,0.1)" }}
              >
                <span
                  className="material-symbols-outlined text-3xl text-brand-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  high_quality
                </span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-surface-foreground">
                Uncompromising Quality
              </h3>
              <p className="text-zinc-600">
                We use only premium materials and the latest technology to ensure your project looks
                sharp and lasts longer.
              </p>
            </div>

            {/* Creativity Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all group border-b-4 border-transparent hover:border-brand-secondary">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: "rgba(91,168,41,0.1)" }}
              >
                <span
                  className="material-symbols-outlined text-3xl text-brand-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  brush
                </span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-surface-foreground">Bold Creativity</h3>
              <p className="text-zinc-600">
                Our team pushes boundaries to deliver solutions that are unique, energetic, and
                high-impact.
              </p>
            </div>

            {/* Reliability Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all group border-b-4 border-transparent hover:border-brand-accent">
              <div className="w-16 h-16 bg-zinc-100 text-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  handshake
                </span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-surface-foreground">
                Trusted Reliability
              </h3>
              <p className="text-zinc-600">
                Deadlines matter. We take pride in our punctuality and transparent communication
                throughout every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm">
              Meet the Team
            </span>
            <h2 className="font-headline font-bold text-4xl md:text-5xl mt-2 text-surface-foreground">
              The People Behind {siteConfig.name}
            </h2>
          </div>
          <p className="text-zinc-500 max-w-sm">
            A dedicated team of professionals committed to your success.
          </p>
        </div>

        {/* Team placeholder grid — sites customize with real team data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { color: "brand-primary", label: "Founder & Lead" },
            { color: "brand-secondary", label: "Operations Manager" },
            { color: "brand-accent", label: "Senior Specialist" },
            { color: "brand-primary", label: "Project Manager" },
          ].map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-zinc-100 aspect-[3/4]"
            >
              {/* TODO: Replace with actual team member images */}
              <div className="w-full h-full bg-zinc-300 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 text-white group-hover:opacity-0 transition-opacity">
                <h4 className="font-bold text-xl">Team Member</h4>
                <p className="text-sm opacity-80 uppercase tracking-wider font-semibold">
                  {member.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-brand-primary py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="font-headline font-black text-4xl md:text-5xl mb-6">
                Ready to Work With Us?
              </h2>
              <p className="text-xl opacity-90">
                Let&apos;s transform your project with results that demand attention. Our team in{" "}
                {siteConfig.address.city} is ready to bring your vision to life.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/contact"
                className="bg-white text-brand-primary px-10 py-5 rounded-lg font-bold text-xl hover:bg-brand-secondary hover:text-white transition-all shadow-xl"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/services"
                className="bg-brand-accent text-white px-10 py-5 rounded-lg font-bold text-xl hover:opacity-90 transition-all shadow-xl"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
