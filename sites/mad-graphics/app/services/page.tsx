/**
 * Services Page — Stitch Design Replica
 * ======================================
 *
 * Self-contained brutalist services page. No platform imports.
 * All styling inline via Tailwind + hardcoded hex tokens.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services | MAD GRAPHICS',
};

const services = [
  {
    category: 'Strategy & Creative',
    title: 'Design & Artwork',
    description:
      'Precision vector illustration, brand identity systems, and production-ready artwork engineered for any output medium.',
    image: '/stitch-images/img-024.jpg',
    href: '/services/design-artwork',
  },
  {
    category: 'High Velocity Output',
    title: 'Print & Production',
    description:
      'Wide format printing, precision cutting, and finishing. From concept to installed — no compromises on quality or turnaround.',
    image: '/stitch-images/img-009.jpg',
    href: '/services/print-production',
  },
  {
    category: 'Physical Presence',
    title: 'Building Signage',
    description:
      'Laser-cut 3D lettering, illuminated fascias, and architectural signage systems that command attention from the street.',
    image: '/stitch-images/img-005.jpg',
    href: '/services/building-signage',
  },
  {
    category: 'Mobile Branding',
    title: 'Vehicle Graphics',
    description:
      'Fleet graphics, partial wraps, and magnetic signage. Your brand on the move — engineered for durability and maximum visibility.',
    image: '/stitch-images/img-014.jpg',
    href: '/services/vehicle-graphics',
  },
  {
    category: 'Surface Transformation',
    title: 'Vinyl Wrapping',
    description:
      'Full color changes, chrome deletes, and protective film applications. Factory-finish quality with precision installation.',
    image: '/stitch-images/img-018.jpg',
    href: '/services/vinyl-wrapping',
  },
  {
    category: 'Event Impact',
    title: 'Exhibition Displays',
    description:
      'Modular exhibition systems, pull-up banners, and bespoke display solutions. Portable impact for trade shows and events.',
    image: '/stitch-images/img-007.jpg',
    href: '/services/exhibition-displays',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#131313] text-white" style={{ borderRadius: 0 }}>
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#131313]">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <Link href="/" className="text-3xl font-black italic tracking-tighter text-[#f7941d] font-headline">
            MAD GRAPHICS
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-headline uppercase tracking-tight text-white/60 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link href="/about" className="font-headline uppercase tracking-tight text-white/60 hover:text-white transition-colors text-sm">
              About
            </Link>
            <Link href="/services" className="font-headline uppercase tracking-tight text-[#f7941d] border-b-4 border-[#f7941d] pb-1 text-sm">
              Services
            </Link>
            <Link href="/projects" className="font-headline uppercase tracking-tight text-white/60 hover:text-white transition-colors text-sm">
              Projects
            </Link>
            <Link href="/contact" className="font-headline uppercase tracking-tight text-white/60 hover:text-white transition-colors text-sm">
              Contact
            </Link>
          </div>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 bg-[#f7941d] text-[#2d1600] px-6 py-2.5 font-headline uppercase tracking-tight text-sm font-bold hover:bg-[#e8870f] transition-colors"
          >
            Get a Quote
          </Link>
        </div>
        <div className="bg-[#353534] h-[4px] w-full absolute bottom-0" />
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="px-6 md:px-10 mb-12 pt-32">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
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
          {services.map((service) => (
            <div key={service.title} className="bg-[#1A1A1A] p-8 md:p-12 group">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/9] mb-8">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-[#f7941d]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
              </div>

              {/* Category */}
              <p className="text-[#f7941d] uppercase tracking-[0.2em] text-xs font-bold mb-3">
                {service.category}
              </p>

              {/* Title */}
              <h2 className="text-5xl font-headline font-bold text-white mb-4">
                {service.title}
              </h2>

              {/* Description */}
              <p className="text-white/60 mb-8 leading-relaxed">
                {service.description}
              </p>

              {/* Learn More */}
              <a
                href={service.href}
                className="inline-flex items-center gap-2 text-[#f7941d] font-headline uppercase tracking-tight text-sm font-bold hover:gap-4 transition-all duration-300"
              >
                <span>Learn more</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform duration-300">
                  arrow_forward
                </span>
              </a>
            </div>
          ))}
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

      {/* ── Footer ── */}
      <footer className="bg-[#1C1B1B] mt-20">
        <div className="px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Ghost brand */}
            <div>
              <p className="text-6xl md:text-7xl font-black italic tracking-tighter text-white/10 font-headline leading-none">
                MAD<br />GRAPHICS
              </p>
            </div>

            {/* Navigation + Legal */}
            <div className="flex gap-16">
              <div>
                <h3 className="font-headline uppercase tracking-widest text-xs text-white/40 mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">Home</Link></li>
                  <li><Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">About</Link></li>
                  <li><Link href="/services" className="text-[#f7941d] text-sm">Services</Link></li>
                  <li><Link href="/projects" className="text-white/60 hover:text-white transition-colors text-sm">Projects</Link></li>
                  <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-headline uppercase tracking-widest text-xs text-white/40 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="/privacy-policy" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="/cookie-policy" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Contact + Copyright */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-headline uppercase tracking-widest text-xs text-white/40 mb-4">Contact</h3>
                <a href="mailto:info@madgraphics.co.uk" className="text-white/60 hover:text-[#f7941d] transition-colors text-sm">
                  info@madgraphics.co.uk
                </a>
              </div>
              <p className="text-white/20 text-xs mt-8">
                &copy; {new Date().getFullYear()} MAD GRAPHICS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
