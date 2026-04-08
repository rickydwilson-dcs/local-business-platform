/**
 * Services Page
 * =============
 * Dynamic services listing backed by MDX content from content/services/.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getContentItems } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services | MAD GRAPHICS',
};

export default async function ServicesPage() {
  const services = await getContentItems('services');

  return (
    <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#544435]/10 border-y border-[#544435]/10">
          {services.map((service, i) => {
            const FALLBACK_IMAGES = [
              '/stitch-images/img-024.jpg',
              '/stitch-images/img-009.jpg',
              '/stitch-images/img-005.jpg',
              '/stitch-images/img-014.jpg',
              '/stitch-images/img-018.jpg',
              '/stitch-images/img-007.jpg',
            ];
            const hero = service.hero as { image?: string } | undefined;
            const imageSrc = hero?.image
              ? `/${hero.image}`
              : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            const tags = service.tags as string[] | undefined;
            const category = tags?.[0] ?? 'Service';

            return (
              <div key={service.slug} className="bg-[#1A1A1A] p-8 md:p-12 group">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] mb-8">
                  <Image
                    fill
                    src={imageSrc}
                    alt={service.title}
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-[#f7941d]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                </div>
                <p className="text-[#f7941d] uppercase tracking-[0.2em] text-xs font-bold mb-3">
                  {category}
                </p>
                <h2 className="text-5xl font-headline font-bold text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-white/60 mb-8 leading-relaxed">{service.description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-[#f7941d] font-headline uppercase tracking-tight text-sm font-bold hover:gap-4 transition-all duration-300"
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
        <div className="bg-[#f7941d] text-[#131313] px-8 py-20 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <span
              className="material-symbols-outlined text-8xl text-[#131313]/30 hidden lg:block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
            <div>
              <h2 className="text-4xl md:text-5xl font-headline font-bold italic">
                Ready to get started?
              </h2>
              <p className="text-[#2d1600]/70 text-lg mt-2">
                Let&apos;s talk about your next project. No obligation, no hard sell.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#131313] text-white px-8 py-4 font-headline uppercase tracking-tight text-sm font-bold hover:bg-[#2a2a2a] transition-colors whitespace-nowrap"
          >
            Get a Quote
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
}
