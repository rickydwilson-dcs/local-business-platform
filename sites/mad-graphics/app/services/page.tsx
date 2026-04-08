/**
 * Services Page
 * =============
 * Dynamic services listing backed by MDX content from content/services/.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getContentItems } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { CtaBand } from '@/components/ui/cta-band';

export const metadata: Metadata = {
  title: 'Services | MAD GRAPHICS',
};

export default async function ServicesPage() {
  const services = await getContentItems('services');

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Breadcrumb ── */}
      <div className="px-6 md:px-10 mb-12 pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-white/60 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white/60">Services</span>
        </nav>
      </div>

      {/* ── Page Header ── */}
      <div className="px-6 md:px-10 mb-20">
        <h1 className="text-7xl md:text-8xl font-headline font-bold italic text-white">
          What we do
        </h1>
        <div className="mt-6 h-[2px] bg-[#544435]/30 w-full" />
      </div>

      {/* ── Services Grid ── */}
      <div className="px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-card-border border-y border-surface-card-border">
          {services.map((service, i) => {
            const hero = service.hero as { image?: string } | undefined;
            const heroImage = hero?.image || (service.heroImage as string | undefined);
            const imageSrc = heroImage ? getImageUrl(heroImage) : '/stitch-images/img-024.jpg';
            const tags = service.tags as string[] | undefined;
            const category = tags?.[0] ?? 'Service';

            return (
              <div key={service.slug} className="bg-surface-muted p-8 md:p-12 group">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] mb-8">
                  <Image
                    fill
                    src={imageSrc}
                    alt={service.title}
                    unoptimized={process.env.NODE_ENV === 'development'}
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-[#f7941d]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                </div>
                <p className="text-brand-primary uppercase tracking-[0.2em] text-xs font-bold mb-3">
                  {category}
                </p>
                <h2 className="text-5xl font-headline font-bold text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-white/60 mb-8 leading-relaxed">{service.description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-brand-primary font-headline uppercase tracking-tight text-sm font-bold hover:gap-4 transition-all duration-300"
                >
                  <span>Learn more</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform duration-300">
                    arrow_forward
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA Band ── */}
      <div className="mt-20 px-6 md:px-10">
        <CtaBand
          headline="Ready to get started?"
          subtext="Let's talk about your next project. No obligation, no hard sell."
          primaryLabel="Get a Quote"
          primaryHref="/contact"
        />
      </div>
    </div>
  );
}
