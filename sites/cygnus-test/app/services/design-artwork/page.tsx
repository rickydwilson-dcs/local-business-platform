import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehicle Graphics | Mad Graphics',
  description:
    'Professional vehicle graphics, van wraps, and fleet branding. Precision craftsmanship with durable, high-impact finishes since 2004.',
};

export default function DesignArtworkPage() {
  return (
    <div className="min-h-screen bg-surface-background text-surface-foreground">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="bg-[#131313] relative">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-5">
          <a
            href="/"
            className="text-2xl font-bold italic tracking-tighter text-[#f7941d]"
          >
            MAD GRAPHICS
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="text-sm uppercase tracking-widest text-[#dac2af] transition-colors hover:text-surface-foreground"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-sm uppercase tracking-widest text-[#dac2af] transition-colors hover:text-surface-foreground"
            >
              About
            </a>
            <a
              href="/services"
              className="text-sm uppercase tracking-widest text-surface-foreground"
            >
              Services
            </a>
            <a
              href="/projects"
              className="text-sm uppercase tracking-widest text-[#dac2af] transition-colors hover:text-surface-foreground"
            >
              Projects
            </a>
            <a
              href="/contact"
              className="text-sm uppercase tracking-widest text-[#dac2af] transition-colors hover:text-surface-foreground"
            >
              Contact
            </a>
          </div>

          <a
            href="/contact"
            className="hidden rounded-full bg-[#f7941d] px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-[#2d1600] transition-colors hover:bg-[#f7941d]/90 md:inline-block"
          >
            Get a Quote
          </a>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 w-full bg-[#353534]" />
      </nav>

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="bg-[#0e0e0e] px-8 py-4">
        <div className="mx-auto max-w-screen-2xl">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#dac2af]">
            <a href="/" className="transition-colors hover:text-surface-foreground">
              Home
            </a>
            <span>/</span>
            <a
              href="/services"
              className="transition-colors hover:text-surface-foreground"
            >
              Services
            </a>
            <span>/</span>
            <span className="text-surface-foreground">Vehicle Graphics</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[819px] w-full overflow-hidden">
        {/* Background image */}
        <img
          src="/stitch-images/img-011.jpg"
          alt="Black van with graphics in industrial workshop"
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-60"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-[#131313]/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 px-8 pb-16">
          <div className="mx-auto max-w-screen-2xl">
            <span className="mb-4 inline-block rounded-full bg-[#56a324] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#113000]">
              Premium Wrapping
            </span>
            <h1 className="font-headline text-7xl font-bold italic md:text-8xl">
              Vehicle graphics
              <br />
              that turn heads
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[#f7941d]" />
              <span className="text-sm uppercase tracking-widest text-[#dac2af]">
                Industrial Precision Since 2004
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Description ─────────────────────────────────── */}
      <section className="mx-auto max-w-screen-2xl px-8 py-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 h-1 w-16 bg-[#f7941d]" />
            <h2 className="font-headline mb-6 text-4xl font-bold italic md:text-5xl">
              Precision Craftsmanship
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-[#dac2af]">
              Every vehicle wrap we produce is a testament to precision engineering
              and creative excellence. Our team of certified installers uses
              cutting-edge materials and techniques to deliver finishes that are
              indistinguishable from factory paint, but infinitely more versatile.
            </p>
            <p className="text-lg leading-relaxed text-[#dac2af]">
              From full fleet branding to individual design statements, we approach
              each project with the same exacting standards. Our climate-controlled
              workshop and proprietary application process ensure bubble-free,
              seamless results every time.
            </p>
          </div>

          {/* Right: image with glass overlay */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/stitch-images/img-004.jpg"
                alt="Technician applying vinyl wrap with precision"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            {/* Glass panel overlay */}
            <div className="absolute bottom-8 right-8 max-w-xs border-l-4 border-brand-primary bg-[#353534]/40 p-6 backdrop-blur-[12px]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f7941d]">
                Calibrated Application
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[#dac2af]">
                Temperature-controlled environment with precision-cut templates for
                flawless edge-to-edge coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits Bento Grid ─────────────────────────────────── */}
      <section className="bg-surface-muted px-8 py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Visibility */}
            <div className="bg-surface-background p-8 transition-all duration-300 hover:bg-[#3a3939]">
              <span
                className="material-symbols-outlined mb-4 block text-4xl text-brand-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                visibility
              </span>
              <h3 className="font-headline mb-2 text-lg font-bold italic">
                Brand Visibility
              </h3>
              <p className="text-sm leading-relaxed text-[#dac2af]">
                Transform your fleet into mobile billboards that generate thousands
                of impressions daily across your service area.
              </p>
            </div>

            {/* Durable Finish */}
            <div className="bg-surface-background p-8 transition-all duration-300 hover:bg-[#3a3939]">
              <span
                className="material-symbols-outlined mb-4 block text-4xl text-brand-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </span>
              <h3 className="font-headline mb-2 text-lg font-bold italic">
                Durable Finish
              </h3>
              <p className="text-sm leading-relaxed text-[#dac2af]">
                Premium 3M and Avery vinyl with UV-resistant lamination ensures your
                wrap looks fresh for 5-7 years, even in harsh conditions.
              </p>
            </div>

            {/* Custom Design */}
            <div className="bg-surface-background p-8 transition-all duration-300 hover:bg-[#3a3939]">
              <span
                className="material-symbols-outlined mb-4 block text-4xl text-brand-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                edit_square
              </span>
              <h3 className="font-headline mb-2 text-lg font-bold italic">
                Custom Design
              </h3>
              <p className="text-sm leading-relaxed text-[#dac2af]">
                In-house design team creates bespoke graphics tailored to your brand
                identity, from concept sketches to final proofs.
              </p>
            </div>

            {/* Fast Turnaround */}
            <div className="bg-surface-background p-8 transition-all duration-300 hover:bg-[#3a3939]">
              <span
                className="material-symbols-outlined mb-4 block text-4xl text-brand-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                speed
              </span>
              <h3 className="font-headline mb-2 text-lg font-bold italic">
                Fast Turnaround
              </h3>
              <p className="text-sm leading-relaxed text-[#dac2af]">
                Most single-vehicle wraps completed within 3-5 working days. Fleet
                jobs scheduled to minimise downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Staggered Gallery ───────────────────────────────────── */}
      <section className="px-8 py-24">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header */}
          <div className="mb-12 flex items-center gap-4">
            <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-[#dac2af]">
              Field Output
            </h2>
            <span className="rounded-full bg-[#56a324] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#113000]">
              Case Studies
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Large image */}
            <div className="group relative col-span-12 h-[500px] overflow-hidden md:col-span-7">
              <img
                src="/stitch-images/img-001.jpg"
                alt="Transit Van Wrap — full livery design"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#131313]/80 to-transparent p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <h3 className="font-headline text-xl font-bold italic">
                    Transit Van Wrap
                  </h3>
                  <p className="mt-1 text-sm text-[#dac2af]">
                    Full livery design and installation for a plumbing fleet —
                    high-visibility branding on 12 vehicles.
                  </p>
                </div>
              </div>
            </div>

            {/* Right stacked */}
            <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
              {/* Top small */}
              <div className="group relative h-[242px] overflow-hidden">
                <img
                  src="/stitch-images/img-023.jpg"
                  alt="Sports car with custom wrap"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#131313]/80 to-transparent p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <h3 className="font-headline text-xl font-bold italic">
                      Sports Car Wrap
                    </h3>
                    <p className="mt-1 text-sm text-[#dac2af]">
                      Satin chrome finish with custom racing stripes — show-quality
                      detail work.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom small */}
              <div className="group relative h-[242px] overflow-hidden">
                <img
                  src="/stitch-images/img-012.jpg"
                  alt="Detail work on vehicle graphics"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#131313]/80 to-transparent p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <h3 className="font-headline text-xl font-bold italic">
                      Precision Detail Work
                    </h3>
                    <p className="mt-1 text-sm text-[#dac2af]">
                      Close-up vinyl application around complex curves and recessed
                      panels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ───────────────────────────────────────── */}
      <section className="bg-surface-background px-8 py-24">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="font-headline mb-12 text-4xl font-bold italic md:text-5xl">
            Technical Specifications &amp; FAQ
          </h2>

          <div className="flex flex-col gap-4">
            {/* Q1 */}
            <details className="group border-l-4 border-[#353534] transition-colors open:border-brand-primary">
              <summary className="flex cursor-pointer items-center justify-between bg-[#201f1f] px-8 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-headline text-lg font-bold italic">
                  How long does a vehicle wrap last?
                </span>
                <span className="material-symbols-outlined text-2xl text-[#dac2af] transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="bg-[#0e0e0e] px-8 py-6">
                <p className="leading-relaxed text-[#dac2af]">
                  A professionally installed vehicle wrap using premium vinyl from
                  3M or Avery Dennison will typically last between 5 and 7 years.
                  The longevity depends on factors such as exposure to UV light,
                  washing frequency, and whether the vehicle is garaged. We provide
                  a 3-year warranty on all installations covering adhesion, peeling,
                  and colour fade.
                </p>
              </div>
            </details>

            {/* Q2 */}
            <details className="group border-l-4 border-[#353534] transition-colors open:border-brand-primary">
              <summary className="flex cursor-pointer items-center justify-between bg-[#201f1f] px-8 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-headline text-lg font-bold italic">
                  Can you wrap any vehicle?
                </span>
                <span className="material-symbols-outlined text-2xl text-[#dac2af] transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="bg-[#0e0e0e] px-8 py-6">
                <p className="leading-relaxed text-[#dac2af]">
                  Yes — we wrap everything from small hatchbacks and sports cars to
                  large commercial vehicles, HGVs, and even boats. Our workshop can
                  accommodate vehicles up to 12 metres in length. The only
                  requirement is that the existing paintwork must be in reasonable
                  condition, as vinyl adheres best to smooth, undamaged surfaces. We
                  always carry out a pre-installation inspection.
                </p>
              </div>
            </details>

            {/* Q3 */}
            <details className="group border-l-4 border-[#353534] transition-colors open:border-brand-primary">
              <summary className="flex cursor-pointer items-center justify-between bg-[#201f1f] px-8 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-headline text-lg font-bold italic">
                  What is the process from quote to completion?
                </span>
                <span className="material-symbols-outlined text-2xl text-[#dac2af] transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="bg-[#0e0e0e] px-8 py-6">
                <p className="leading-relaxed text-[#dac2af]">
                  The process begins with a consultation where we assess your
                  vehicle and discuss design requirements. Our design team then
                  produces digital mockups for your approval. Once signed off, we
                  schedule the installation — typically within 1-2 weeks. The wrap
                  itself takes 3-5 working days for a single vehicle. Fleet jobs are
                  staggered to keep your business running. You receive a final
                  walkthrough inspection and care guide upon collection.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ── CTA Panel ───────────────────────────────────────────── */}
      <section className="p-8 md:p-12">
        <div className="relative flex flex-col items-center justify-between gap-12 overflow-hidden bg-[#f7941d] p-12 md:flex-row md:p-20">
          {/* Decorative icon */}
          <span
            className="material-symbols-outlined pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-[300px] text-[#2d1600] opacity-10"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            commute
          </span>

          {/* Content */}
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2d1600]">
              Ready to get started?
            </span>
            <p className="mt-1 text-sm text-[#2d1600]/70">
              Free consultation and no-obligation quote
            </p>
            <h2 className="font-headline mt-4 text-4xl font-bold italic text-[#2d1600] md:text-5xl">
              Get a vehicle graphics quote
            </h2>
            <p className="mt-4 text-lg font-bold text-[#2d1600]">
              <a href="tel:01onal" className="hover:underline">
                0800 123 4567
              </a>
            </p>
          </div>

          {/* Button */}
          <a
            href="/contact"
            className="relative z-10 inline-block rounded-full bg-[#2d1600] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#f7941d] transition-colors hover:bg-[#2d1600]/90"
          >
            Request a Quote
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t-4 border-[#f7941d] bg-[#0e0e0e] px-8 py-12">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 md:grid-cols-3">
          {/* Col 1: Brand */}
          <div>
            <a
              href="/"
              className="text-2xl font-bold italic tracking-tighter text-[#f7941d]"
            >
              MAD GRAPHICS
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#dac2af]">
              Professional vehicle wrapping, signage, and graphic design services
              for businesses across the UK. Precision craftsmanship since 2004.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-[#dac2af] transition-colors hover:text-[#f7941d]"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined text-xl">public</span>
              </a>
              <a
                href="#"
                className="text-[#dac2af] transition-colors hover:text-[#f7941d]"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-xl">
                  photo_camera
                </span>
              </a>
              <a
                href="#"
                className="text-[#dac2af] transition-colors hover:text-[#f7941d]"
                aria-label="LinkedIn"
              >
                <span className="material-symbols-outlined text-xl">work</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation + Legal */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-foreground">
              Navigation
            </h3>
            <ul className="mb-8 flex flex-col gap-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-foreground">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-sm text-[#dac2af] transition-colors hover:text-surface-foreground"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Workshop Location */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-foreground">
              Workshop
            </h3>
            <address className="not-italic text-sm leading-relaxed text-[#dac2af]">
              Unit 7, Industrial Estate
              <br />
              Workshop Lane
              <br />
              Birmingham, B12 0AA
            </address>
            <p className="mt-4 text-sm text-[#dac2af]">
              <a href="tel:08001234567" className="hover:text-[#f7941d]">
                0800 123 4567
              </a>
            </p>
            <p className="mt-1 text-sm text-[#dac2af]">
              <a
                href="mailto:info@madgraphics.co.uk"
                className="hover:text-[#f7941d]"
              >
                info@madgraphics.co.uk
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-12 max-w-screen-2xl border-t border-[#353534] pt-8">
          <p className="text-xs text-[#dac2af]">
            &copy; 2024 Mad Graphics Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
