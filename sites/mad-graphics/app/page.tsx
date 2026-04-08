import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ImageOverlayHero } from '@platform/core-components';
import { cygnusRegistry } from '@platform/themes/cygnus';
import { siteConfig } from '@/site.config';
import { getContentItems } from '@/lib/content';
import { getImageUrl } from '@/lib/image';

export const metadata: Metadata = {
  title: 'Mad Graphics | Precision in Print & Signage',
  description:
    'Expert print and signage solutions for East Sussex. From high-impact vehicle graphics to precision architectural signage, we turn your vision into physical reality.',
};

export default async function HomePage() {
  const [allServices, allTestimonials] = await Promise.all([
    getContentItems('services'),
    getContentItems('testimonials'),
  ]);
  const featuredServices = allServices.slice(0, 6);
  const featuredTestimonials = allTestimonials.filter((t) => t.featured).slice(0, 2);
  // fallback if no featured testimonials
  const displayTestimonials =
    featuredTestimonials.length >= 2 ? featuredTestimonials : allTestimonials.slice(0, 2);

  return (
    <main>
      {/* Hero Section */}
      {cygnusRegistry.heroVariant === 'image-overlay' ? (
        <ImageOverlayHero
          headline="Your brand,"
          headlineAccent="made bold."
          subheadline={siteConfig.tagline}
          primaryCta={{ label: 'Get a Quote', href: '/contact' }}
          secondaryCta={{ label: 'View Our Work', href: '/projects' }}
          backgroundImage="/stitch-images/img-006.jpg"
          backgroundImageAlt="Professional large format print workshop with industrial machinery"
          badge="847 projects completed"
          stats={[
            { value: '847', label: 'Projects Delivered' },
            { value: '12', label: 'Years of Craft' },
            { value: '5★', label: 'Client Rated' },
          ]}
        />
      ) : (
        /* Fallback: original Stitch hero — preserved as fallback */
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              fill
              className="object-cover opacity-40 grayscale-[0.5]"
              src="/stitch-images/img-006.jpg"
              alt="dramatic wide angle shot of a professional large format print workshop with industrial machinery and vibrant orange lighting accents"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8">
                Your brand, <br />
                <span className="text-brand-primary">made bold.</span>
              </h1>
              <p className="text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed">
                {siteConfig.tagline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary px-10 py-4 text-lg font-bold">
                  Get a Quote
                </Link>
                <Link href="/projects" className="btn-outline px-10 py-4 text-lg font-bold">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section id="services" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-[#f7941d] font-body uppercase tracking-[0.3em] font-bold text-sm">
            Capabilities
          </span>
          <h2 className="text-5xl font-headline font-bold mt-4">Precision Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, i) => {
            const hero = service.hero as { image?: string } | undefined;
            const heroImage = hero?.image || (service.heroImage as string | undefined);
            const imageSrc = heroImage ? getImageUrl(heroImage) : '/stitch-images/img-019.jpg';
            const tags = service.tags as string[] | undefined;
            const category = tags?.[0] ?? 'Service';

            return (
              <div
                key={service.slug}
                className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <Image
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    src={imageSrc}
                    alt={service.title}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                  <div className="absolute inset-0 bg-[#0e0e0e]/20" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                    {category}
                  </span>
                  <h3 className="text-2xl font-headline font-bold mb-4">{service.title}</h3>
                  <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  >
                    Learn more{' '}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0e0e0e] py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-[#5BA829] font-body uppercase tracking-[0.3em] font-bold text-sm">
              Word on the shop floor
            </span>
            <h2 className="text-5xl font-headline font-bold mt-4">Trusted by the best</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayTestimonials.map((t) => {
              const rating = (t.rating as number | undefined) ?? 5;
              const text = t.text as string;
              const customerName = t.customerName as string;
              const customerCompany =
                (t.customerCompany as string | undefined) ?? (t.customerRole as string | undefined);

              return (
                <div
                  key={t.slug}
                  className="bg-surface-background p-12 rounded-lg border border-[#544435]/10"
                >
                  <div className="flex text-[#f7941d] mb-6">
                    {Array.from({ length: rating }).map((_, i) => (
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
                    &ldquo;{text}&rdquo;
                  </p>
                  <div>
                    <div className="font-bold text-lg uppercase tracking-wider font-body">
                      {customerName}
                    </div>
                    <div className="text-[#dac2af] text-xs font-body uppercase tracking-widest">
                      {customerCompany}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#f7941d] py-24">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="md:text-6xl mb-4 text-5xl font-headline font-bold mt-4">
              Ready to make your brand stand out?
            </h2>
            <p className="text-[#613500] text-lg font-body font-medium">
              Let&apos;s discuss your project today and get a custom quote within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact"
              className="bg-[#131313] text-[#F7941D] px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
            >
              Get a Quote
            </a>
            <a
              href="/contact"
              className="bg-[#613500]/20 text-[#2d1600] border border-[#2d1600]/30 px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#613500]/30 transition-colors uppercase tracking-widest"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
