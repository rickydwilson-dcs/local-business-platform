import type { Metadata } from 'next';
import { ImageOverlayHero } from '@platform/core-components';
import { cygnusRegistry } from '@platform/themes/cygnus';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Mad Graphics | Precision in Print & Signage',
  description:
    'Expert print and signage solutions for East Sussex. From high-impact vehicle graphics to precision architectural signage, we turn your vision into physical reality.',
};

export default function HomePage() {
  return (
    <>
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl shadow-[0_40px_40px_rgba(247,148,29,0.1)]">
        <nav className="flex justify-between items-center px-8 py-4 max-w-full">
          <div className="text-2xl font-headline font-black tracking-tighter text-surface-foreground">
            MAD <span className="text-brand-primary">GRAPHICS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-brand-primary border-b-2 border-brand-primary pb-1 font-body font-medium uppercase tracking-widest text-xs"
              href="#portfolio"
            >
              Portfolio
            </a>
            <a
              className="text-surface-foreground hover:text-brand-primary transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#services"
            >
              Services
            </a>
            <a
              className="text-surface-foreground hover:text-brand-primary transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#process"
            >
              Process
            </a>
            <a
              className="text-surface-foreground hover:text-brand-primary transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#contact"
            >
              Contact
            </a>
          </div>
          <a
            href="#quote"
            className="hidden md:inline-block bg-brand-primary text-[#2d1600] px-6 py-2.5 rounded-lg font-bold hover:opacity-80 transition-all duration-300 scale-95 active:scale-90 font-body uppercase tracking-wider text-sm"
          >
            Get a Quote
          </a>
          {/* Mobile hamburger (visual only) */}
          <span className="material-symbols-outlined md:hidden text-surface-foreground">
            menu
          </span>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        {cygnusRegistry.heroVariant === "image-overlay" ? (
          <ImageOverlayHero
            headline="Your brand,"
            headlineAccent="made bold."
            subheadline={siteConfig.tagline}
            primaryCta={{ label: "Get a Quote", href: "/contact" }}
            secondaryCta={{ label: "View Our Work", href: "/projects" }}
            backgroundImage="/stitch-images/img-006.jpg"
            backgroundImageAlt="Professional large format print workshop with industrial machinery"
            badge="847 projects completed"
            stats={[
              { value: "847", label: "Projects Delivered" },
              { value: "12", label: "Years of Craft" },
              { value: "5★", label: "Client Rated" },
            ]}
          />
        ) : (
          /* Fallback: original Stitch hero — preserved as fallback */
          <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
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
                  <a href="/contact" className="btn-primary px-10 py-4 text-lg font-bold">
                    Get a Quote
                  </a>
                  <a href="/projects" className="btn-outline px-10 py-4 text-lg font-bold">
                    View Our Work
                  </a>
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
            <h2 className="text-5xl font-headline font-bold mt-4">
              Precision Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 - Design */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-019.jpg"
                  alt="macro close-up of a digital design workspace with high-end monitor showing vector branding and print layouts"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Design
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Design &amp; Artwork
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  From initial concept to print-ready files, we ensure your
                  brand&apos;s DNA is preserved with technical accuracy.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 2 - Print */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-010.jpg"
                  alt="industrial printing machine rollers feeding bright orange paper at high speed in a professional print shop"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Production
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Print &amp; Production
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  Large format prints with stunning color depth. We use
                  state-of-the-art machinery for ultra-sharp results.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 3 - Signage */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-003.jpg"
                  alt="exterior of a modern building featuring sleek 3D architectural signage with glowing backlight at dusk"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Architectural
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Building Signage
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  Transform your premises with premium facias, 3D lettering, and
                  architectural illumination.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 4 - Vehicle */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-025.jpg"
                  alt="close up of a professional applicator finishing a high-gloss black vinyl wrap on a modern car door panel"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Automotive
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Vehicle Graphics
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  Turn your fleet into mobile billboards with durable,
                  UV-resistant graphics that command attention.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 5 - Vinyl */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-008.jpg"
                  alt="modern office interior with large scale custom typography vinyl graphics applied to glass partition walls"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Specialty
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Vinyl Wrapping
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  Custom interior wraps for walls, glass, and furniture to create
                  a fully immersive brand environment.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 6 - Exhibition */}
            <div className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="/stitch-images/img-015.jpg"
                  alt="vibrant trade show floor featuring modular exhibition stands with large graphic panels and integrated lighting"
                />
                <div className="absolute inset-0 bg-[#0e0e0e]/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                  Events
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">
                  Exhibition Displays
                </h3>
                <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">
                  High-impact pull-ups, backdrops, and modular stands designed
                  for quick assembly and maximum visibility.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                  href="#"
                >
                  Learn more{' '}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#0e0e0e] py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <span className="text-[#5BA829] font-body uppercase tracking-[0.3em] font-bold text-sm">
                Word on the shop floor
              </span>
              <h2 className="text-5xl font-headline font-bold mt-4">
                Trusted by the best
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quote 1 */}
              <div className="bg-surface-background p-12 rounded-lg border border-[#544435]/10">
                <div className="flex text-[#f7941d] mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-2xl font-headline italic text-surface-foreground leading-relaxed mb-8">
                  &ldquo;The precision in their work is unmatched. We needed
                  complex vehicle graphics for a ten-van fleet, and Mad Graphics
                  delivered ahead of schedule with flawless execution.&rdquo;
                </p>
                <div>
                  <div className="font-bold text-lg uppercase tracking-wider font-body">
                    James Sterling
                  </div>
                  <div className="text-[#dac2af] text-xs font-body uppercase tracking-widest">
                    Sterling Logistics
                  </div>
                </div>
              </div>

              {/* Quote 2 */}
              <div className="bg-surface-background p-12 rounded-lg border border-[#544435]/10">
                <div className="flex text-[#f7941d] mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-2xl font-headline italic text-surface-foreground leading-relaxed mb-8">
                  &ldquo;Finding a printer who understands high-end finishes is
                  rare. Mad Graphics treated our branding project with the kind
                  of artisan care you just don&apos;t see anymore.&rdquo;
                </p>
                <div>
                  <div className="font-bold text-lg uppercase tracking-wider font-body">
                    Sarah Chen
                  </div>
                  <div className="text-[#dac2af] text-xs font-body uppercase tracking-widest">
                    Aura Interior Design
                  </div>
                </div>
              </div>
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
                Let&apos;s discuss your project today and get a custom quote
                within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#quote"
                className="bg-[#131313] text-[#F7941D] px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
              >
                Get a Quote
              </a>
              <a
                href="#contact"
                className="bg-[#613500]/20 text-[#2d1600] border border-[#2d1600]/30 px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#613500]/30 transition-colors uppercase tracking-widest"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] w-full py-20 px-8 border-t border-[#e5e2e1]/15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {/* Brand Column */}
          <div>
            <div className="text-xl font-headline font-bold text-[#f7941d] mb-6">
              MAD GRAPHICS
            </div>
            <p className="text-[#dac2af] text-sm font-body leading-relaxed mb-8">
              Precision in print. Passion in craft. Based in Polegate, serving
              the boldest brands across East Sussex and beyond.
            </p>
            <div className="text-[#e5e2e1]/60 font-body font-medium uppercase tracking-widest text-[10px]">
              &copy; 2024 Mad Graphics Polegate HQ. Precision in Print.
            </div>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#f7941d] font-body uppercase tracking-[0.2em] font-bold text-xs mb-4">
              Quick Links
            </h4>
            <a
              className="text-[#e5e2e1]/60 hover:text-[#f7941d] transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#portfolio"
            >
              Portfolio
            </a>
            <a
              className="text-[#e5e2e1]/60 hover:text-[#f7941d] transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#services"
            >
              Services
            </a>
            <a
              className="text-[#e5e2e1]/60 hover:text-[#f7941d] transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#process"
            >
              Process
            </a>
            <a
              className="text-[#e5e2e1]/60 hover:text-[#f7941d] transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#contact"
            >
              Contact
            </a>
            <a
              className="text-[#e5e2e1]/60 hover:text-[#f7941d] transition-colors font-body font-medium uppercase tracking-widest text-xs"
              href="#privacy"
            >
              Privacy Policy
            </a>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[#f7941d] font-body uppercase tracking-[0.2em] font-bold text-xs mb-4">
              Polegate HQ
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f7941d]">
                  location_on
                </span>
                <p className="text-[#dac2af] text-sm font-body">
                  Unit 4, High Street Workshop
                  <br />
                  Polegate, East Sussex
                  <br />
                  BN26 5AB
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f7941d]">
                  call
                </span>
                <p className="text-[#dac2af] text-sm font-body">
                  01323 48XXXX
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f7941d]">
                  mail
                </span>
                <p className="text-[#dac2af] text-sm font-body">
                  studio@madgraphics.co.uk
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
