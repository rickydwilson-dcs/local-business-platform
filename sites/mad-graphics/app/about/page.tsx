import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} — vehicle graphics and signage specialists in Polegate, East Sussex since ${siteConfig.credentials.yearEstablished}.`,
  alternates: { canonical: absUrl('/about') },
};

const ICON_BY_VALUE: Record<number, string> = {
  0: 'architecture',
  1: 'price_check',
  2: 'schedule',
  3: 'location_on',
};

export default function AboutPage() {
  const { about, credentials, business, name, tagline } = siteConfig;

  return (
    <>
      <Schema
        org={{ name: business.name, url: '/', logo: '/logo.svg' }}
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${business.name}`,
          description: `Learn about ${business.name} — professional services since ${credentials.yearEstablished}.`,
        }}
      />

      {/* Page Hero */}
      <section className="relative min-h-[640px] flex items-end pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt={`${name} workshop`}
            className="w-full h-full object-cover grayscale opacity-40"
            src="/stitch-images/img-002.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-background/40 to-surface-background" />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          {about?.heroBadges && about.heroBadges.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {about.heroBadges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-block text-brand-primary font-body font-bold uppercase tracking-[0.3em] text-xs border border-brand-primary/30 px-4 py-1.5"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-4">
            Our story
          </h1>
        </div>
      </section>

      {/* Company Story Section */}
      {about?.story && about.story.length > 0 && (
        <section className="py-32 bg-surface-background">
          <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-7">
              <p className="text-brand-primary font-body font-bold uppercase tracking-widest mb-6">
                Est. {credentials.yearEstablished} — Polegate, East Sussex
              </p>
              <h2 className="text-5xl font-headline font-bold mb-8">
                Over 20 years of vehicle graphics and print in East Sussex.
              </h2>
              <div className="space-y-6 text-surface-muted-foreground text-lg leading-relaxed max-w-2xl">
                {about.story.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 pt-12 md:pt-24">
              <div className="relative p-12 bg-surface-muted border-l-4 border-brand-primary">
                <span className="material-symbols-outlined text-5xl text-brand-primary opacity-30 absolute top-4 right-8">
                  format_quote
                </span>
                <blockquote className="text-2xl font-headline italic leading-snug text-surface-foreground">
                  &ldquo;We do not offer full vehicle wraps. We focus on what we do best — cut vinyl graphics, signwriting, and printed graphics applied with precision. That focus means better results.&rdquo;
                </blockquote>
                <div className="mt-8">
                  <p className="font-bold text-surface-foreground">Martin Adams</p>
                  <p className="text-sm uppercase tracking-widest text-brand-primary">Founder</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar */}
      <section className="py-16 bg-surface-muted">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {credentials.stats.map((stat, i) => (
              <div
                key={i}
                className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-surface-border"
              >
                <p className="text-3xl font-headline font-bold text-brand-primary mb-2">{stat.value}</p>
                <p className="text-center font-body font-bold uppercase tracking-tighter text-sm text-surface-foreground">
                  {stat.label}
                </p>
                {stat.description && (
                  <p className="text-xs text-surface-muted-foreground mt-1 text-center">{stat.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Cards */}
      {about?.values && about.values.length > 0 && (
        <section className="py-32 bg-surface-background">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-16">
              <span className="text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm block mb-4">
                How we work
              </span>
              <h2 className="text-5xl font-headline font-bold">Our Principles.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {about.values.map((value, i) => {
                const icon = ICON_BY_VALUE[i] ?? 'verified';
                const isMiddle = i > 0 && i < about.values!.length - 1;
                return (
                  <div
                    key={i}
                    className={`group p-12 border border-surface-border hover:bg-brand-primary transition-colors duration-500${isMiddle ? ' border-l-0 border-r-0' : ''}`}
                  >
                    <span className="material-symbols-outlined text-5xl mb-8 text-brand-primary group-hover:text-[var(--color-brand-on-primary)] block">
                      {icon}
                    </span>
                    <h3 className="text-3xl font-headline font-bold mb-4 group-hover:text-[var(--color-brand-on-primary)] text-surface-foreground">
                      {value.title}
                    </h3>
                    <p className="text-surface-muted-foreground group-hover:text-[var(--color-brand-on-primary)]/80 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {about?.whyChooseUs && about.whyChooseUs.length > 0 && (
        <section className="py-32 bg-surface-muted">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-16">
              <span className="text-brand-secondary font-body uppercase tracking-[0.3em] font-bold text-sm block mb-4">
                The Mad Graphics difference
              </span>
              <h2 className="text-5xl font-headline font-bold text-surface-foreground">
                Why choose us?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {about.whyChooseUs.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-surface-background border border-surface-border">
                  <span className="material-symbols-outlined text-brand-secondary mt-0.5 flex-shrink-0">check_circle</span>
                  <span className="text-surface-foreground font-body font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="bg-brand-primary py-24">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-5xl font-headline font-bold mb-4 text-surface-foreground">
              Work with us
            </h2>
            <p className="text-xl font-body text-[var(--color-brand-on-primary)] opacity-90">
              Ready to get your vehicles and premises looking sharp? Let&apos;s discuss your project.
            </p>
          </div>
          <a
            href="/contact"
            className="bg-surface-background text-brand-primary px-12 py-5 font-bold uppercase tracking-widest text-lg hover:opacity-80 transition-all duration-300 shadow-2xl whitespace-nowrap"
          >
            Get a Quote
          </a>
        </div>
      </section>
    </>
  );
}
