import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Services | ${siteConfig.business.name}`,
  description: `Vehicle graphics, signs, banners, large format print, marketing print, stickers, workwear, and graphic design — made in-house at our Polegate workshop.`,
  keywords: ['vehicle graphics', 'signs', 'banners', 'large format print', 'marketing print', 'East Sussex'],
  openGraph: {
    title: `Our Services | ${siteConfig.business.name}`,
    description: `Professional vehicle graphics, signage, and print services from ${siteConfig.business.name}, Polegate, East Sussex.`,
    url: absUrl('/services'),
    type: 'website',
  },
  alternates: { canonical: absUrl('/services') },
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

export default function ServicesPage() {
  return (
    <>
      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/services#collection'),
          url: absUrl('/services'),
          name: `${siteConfig.business.name} Services`,
          description: `Professional vehicle graphics, signage, and print services from ${siteConfig.business.name}.`,
        }}
      />

      {/* Breadcrumb */}
      <div className="px-6 md:px-10 mb-12 pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-surface-muted-foreground">
          <a href="/" className="hover:text-surface-foreground transition-colors">Home</a>
          <span>/</span>
          <span className="text-surface-foreground">Services</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="px-6 md:px-10 mb-20">
        <span className="text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm block mb-4">
          What we do
        </span>
        <h1 className="text-7xl md:text-8xl font-headline font-bold italic text-surface-foreground">
          Our Services
        </h1>
        <div className="mt-6 h-[2px] bg-surface-border w-full" />
      </div>

      {/* Services Grid */}
      <div className="px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-border/20 border-y border-surface-border/20">
          {siteConfig.services.map((service) => {
            const image = SERVICE_IMAGES[service.slug] ?? '/stitch-images/img-006.jpg';
            const category = SERVICE_CATEGORIES[service.slug] ?? 'Service';
            return (
              <div key={service.slug} className="bg-surface-muted p-8 md:p-12 group">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] mb-8">
                  <img
                    src={image}
                    alt={service.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                </div>

                {/* Category */}
                <p className="text-brand-primary uppercase tracking-[0.2em] text-xs font-bold mb-3">
                  {category}
                </p>

                {/* Title */}
                <h2 className="text-5xl font-headline font-bold text-surface-foreground mb-4">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-surface-muted-foreground mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Learn More */}
                <a
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-brand-primary font-headline uppercase tracking-tight text-sm font-bold hover:gap-4 transition-all duration-300"
                >
                  <span>Learn more</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Band */}
      <div className="mt-20 px-6 md:px-10 pb-20">
        <div className="bg-brand-primary px-8 py-20 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <span
              className="material-symbols-outlined text-8xl text-surface-background/30 hidden lg:block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
            <div>
              <h2 className="text-4xl md:text-5xl font-headline font-bold italic text-surface-foreground">
                Ready to get started?
              </h2>
              <p className="text-[var(--color-brand-on-primary)]/70 text-lg mt-2">
                Let&apos;s talk about your next project. No obligation, no hard sell.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface-background text-brand-primary px-8 py-4 font-headline uppercase tracking-tight text-sm font-bold hover:opacity-80 transition-colors whitespace-nowrap"
          >
            Get a Quote
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      </div>
    </>
  );
}
