import type { Metadata } from 'next';
import { ImageOverlayHero } from '@platform/core-components';
import { cygnusRegistry } from '@platform/themes/cygnus';
import { siteConfig } from '@/site.config';
import { getTestimonials } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
  description:
    'Vehicle graphics, van signwriting, shop signs, banners, and print for East Sussex businesses. Made and applied from our Polegate workshop since 2004.',
  openGraph: {
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      'Vehicle graphics, van signwriting, shop signs, banners, and print for East Sussex businesses. Made and applied from our Polegate workshop since 2004.',
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [{ url: absUrl('/logo.svg'), width: 1200, height: 630, alt: siteConfig.name }],
    locale: 'en_GB',
    type: 'website',
  },
  alternates: { canonical: absUrl('/') },
};

const SERVICE_IMAGES: Record<string, string> = {
  'vehicle-graphics':     '/stitch-images/img-025.jpg',
  'signs-signage':        '/stitch-images/img-003.jpg',
  'banners':              '/stitch-images/img-002.jpg',
  'large-format-print':  '/stitch-images/img-006.jpg',
  'marketing-print':     '/stitch-images/img-010.jpg',
  'stickers-labels':     '/stitch-images/img-008.jpg',
  'workwear-merchandise': '/stitch-images/img-015.jpg',
  'graphic-design':      '/stitch-images/img-019.jpg',
};

// Category labels for each service
const SERVICE_CATEGORIES: Record<string, string> = {
  'vehicle-graphics':     'Automotive',
  'signs-signage':        'Architectural',
  'banners':              'Outdoor',
  'large-format-print':  'Print',
  'marketing-print':     'Marketing',
  'stickers-labels':     'Specialty',
  'workwear-merchandise': 'Apparel',
  'graphic-design':      'Design',
};

export default async function HomePage() {
  const allTestimonials = await getTestimonials();
  const featuredTestimonials = allTestimonials
    .filter((t) => t.featured)
    .slice(0, 2);

  const localBusinessSchema = getLocalBusinessSchema();

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: { '@id': absUrl('/#organization') },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      {cygnusRegistry.heroVariant === 'image-overlay' ? (
        <ImageOverlayHero
          headline="Vehicle Graphics, Signs"
          headlineAccent="& Print."
          subheadline={siteConfig.tagline}
          backgroundImage="/stitch-images/img-006.jpg"
          backgroundImageAlt="Wide-format print workshop at Mad Graphics, Polegate, East Sussex"
          primaryCta={{ label: 'Get a Free Quote', href: '/contact' }}
          secondaryCta={{ label: 'Our Work', href: '/projects' }}
          badge="Est. 2004 — Polegate, East Sussex"
          stats={[
            { value: '20+', label: 'Years Experience' },
            { value: '5,000+', label: 'Projects Completed' },
            { value: '5★', label: 'Client Rated' },
          ]}
        />
      ) : (
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
              src="/stitch-images/img-006.jpg"
              alt="Wide-format print workshop at Mad Graphics"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8">
                Vehicle Graphics, Signs <br />
                <span className="text-brand-primary">&amp; Print.</span>
              </h1>
              <p className="text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed">
                {siteConfig.tagline}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/contact" className="btn-primary px-10 py-4 text-lg font-bold">
                  Get a Free Quote
                </a>
                <a href="/projects" className="btn-outline px-10 py-4 text-lg font-bold">
                  Our Work
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section id="services" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm">
            Capabilities
          </span>
          <h2 className="text-5xl font-headline font-bold mt-4">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => {
            const image = SERVICE_IMAGES[service.slug] ?? '/stitch-images/img-006.jpg';
            const category = SERVICE_CATEGORIES[service.slug] ?? 'Service';
            return (
              <div key={service.slug} className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={image}
                    alt={service.title}
                  />
                  <div className="absolute inset-0 bg-surface-muted/20" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-brand-primary font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                    {category}
                  </span>
                  <h3 className="text-2xl font-headline font-bold mb-4">{service.title}</h3>
                  <p className="text-sm text-surface-muted-foreground font-body mb-6 flex-1">
                    {service.description}
                  </p>
                  <a
                    className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                    href={`/services/${service.slug}`}
                  >
                    Learn more{' '}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <a href="/services" className="btn-outline px-8 py-3">
            View All Services
          </a>
        </div>
      </section>

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="bg-surface-muted py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <span className="text-brand-secondary font-body uppercase tracking-[0.3em] font-bold text-sm">
                Word on the shop floor
              </span>
              <h2 className="text-5xl font-headline font-bold mt-4">
                Trusted by East Sussex businesses
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.slug}
                  className="bg-surface-background p-12 rounded-lg border border-surface-border"
                >
                  <div className="flex text-brand-primary mb-6">
                    {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-2xl font-headline italic text-surface-foreground leading-relaxed mb-8">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-bold text-lg uppercase tracking-wider font-body">
                      {testimonial.customerName}
                    </div>
                    {testimonial.customerRole && (
                      <div className="text-surface-muted-foreground text-xs font-body uppercase tracking-widest">
                        {testimonial.customerRole}
                        {testimonial.customerCompany ? ` — ${testimonial.customerCompany}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="bg-brand-primary py-24">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="md:text-6xl mb-4 text-5xl font-headline font-bold mt-4">
              Ready to make your brand stand out?
            </h2>
            <p className="text-[var(--color-brand-on-primary)] text-lg font-body font-medium">
              Let&apos;s discuss your project today and get a custom quote within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact"
              className="bg-surface-background text-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
            >
              Get a Quote
            </a>
            <a
              href="tel:01323589700"
              className="border border-surface-foreground/30 text-surface-background px-10 py-4 rounded-lg font-bold text-lg hover:bg-surface-foreground/10 transition-colors uppercase tracking-widest"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
