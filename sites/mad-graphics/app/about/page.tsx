import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | MAD GRAPHICS',
};

export default function AboutPage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl shadow-[0_40px_40px_rgba(247,148,29,0.1)]">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-serif italic font-bold text-[#f7941d]">MAD GRAPHICS</div>
          {/* Desktop Links */}
          <div className="hidden md:flex gap-12 items-center">
            <a
              className="text-[#E5E2E1] hover:text-[#f7941d] transition-colors font-sans font-bold uppercase tracking-wider"
              href="#"
            >
              Portfolio
            </a>
            <a
              className="text-[#E5E2E1] hover:text-[#f7941d] transition-colors font-sans font-bold uppercase tracking-wider"
              href="#"
            >
              Services
            </a>
            <a
              className="text-[#E5E2E1] hover:text-[#f7941d] transition-colors font-sans font-bold uppercase tracking-wider"
              href="#"
            >
              Process
            </a>
            <a
              className="text-[#f7941d] border-b-2 border-[#f7941d] pb-1 font-sans font-bold uppercase tracking-wider"
              href="#"
            >
              Contact
            </a>
          </div>
          <a
            href="/contact"
            className="bg-[#f7941d] text-[#2d1600] px-6 py-2.5 font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-all duration-300 active:scale-95 lg:rounded-lg"
          >
            Get a Quote
          </a>
        </div>
      </nav>

      <main>
        {/* Page Hero */}
        <section className="relative min-h-[870px] flex items-end pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              fill
              alt="Mad Graphics Print Workshop"
              className="object-cover grayscale opacity-40"
              src="/stitch-images/img-002.jpg"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(14,14,14,0.4), rgba(19,19,19,1))',
              }}
            />
          </div>
          <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
            <span className="inline-block text-[#f7941d] font-label font-bold uppercase tracking-[0.3em] mb-4">
              Established 2012
            </span>
            <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8">
              Our story
            </h1>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-32 bg-surface-background">
          <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-7">
              <p className="text-[#f7941d] font-label font-bold uppercase tracking-widest mb-6">
                Mastering the Craft
              </p>
              <h2 className="text-5xl font-headline font-bold mt-4 mb-8">
                Twelve years of precision in the heart of East Sussex.
              </h2>
              <div className="space-y-6 text-surface-foreground/80 text-lg leading-relaxed max-w-2xl">
                <p>
                  Founded in Polegate, Mad Graphics emerged from a singular vision: to bridge the
                  gap between technical industrial precision and high-end design aesthetics. We
                  don&apos;t just print; we manufacture identity.
                </p>
                <p>
                  Over the last decade, our workshop has become a hub for local and national brands
                  seeking signage that commands attention. From large-format environmental graphics
                  to intricate vehicle wraps, every project is handled with artisanal care and
                  industrial-grade technology.
                </p>
              </div>
            </div>
            <div className="md:col-span-5 pt-12 md:pt-24">
              <div className="relative p-12 bg-[#2a2a2a] border-l-4 border-[#f7941d]">
                <span className="material-symbols-outlined text-5xl text-[#f7941d] opacity-30 absolute top-4 right-8">
                  format_quote
                </span>
                <blockquote className="text-2xl font-headline italic leading-snug text-surface-foreground">
                  &ldquo;In an industry of shortcuts, we choose the long road of craftsmanship.
                  Every sign that leaves our workshop carries our reputation. We build to last, not
                  just to look good for a season.&rdquo;
                </blockquote>
                <div className="mt-8">
                  <p className="font-bold text-surface-foreground">Martin Adams</p>
                  <p className="text-sm uppercase tracking-widest text-[#f7941d]">
                    Founder &amp; Lead Artisan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-16 bg-[#0e0e0e]">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-[#544435]/10">
                <span className="material-symbols-outlined text-4xl mb-4 text-surface-foreground group-hover:text-[#5BA829]">
                  verified
                </span>
                <p className="text-center font-label font-bold uppercase tracking-tighter text-sm">
                  ISO Certified
                </p>
              </div>
              <div className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-[#544435]/10">
                <span className="material-symbols-outlined text-4xl mb-4 text-surface-foreground group-hover:text-[#f7941d]">
                  stars
                </span>
                <p className="text-center font-label font-bold uppercase tracking-tighter text-sm">
                  5-Star Rated
                </p>
              </div>
              <div className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-[#544435]/10">
                <span className="material-symbols-outlined text-4xl mb-4 text-surface-foreground group-hover:text-[#5BA829]">
                  history
                </span>
                <p className="text-center font-label font-bold uppercase tracking-tighter text-sm">
                  12+ Years Experience
                </p>
              </div>
              <div className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-[#544435]/10">
                <span className="material-symbols-outlined text-4xl mb-4 text-surface-foreground group-hover:text-[#f7941d]">
                  location_on
                </span>
                <p className="text-center font-label font-bold uppercase tracking-tighter text-sm">
                  East Sussex Based
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Cards */}
        <section className="py-32 bg-surface-background">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-16">
              <h2 className="text-5xl font-headline font-bold mt-4">Our Principles.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="group p-12 border border-[#544435]/15 hover:bg-[#f7941d] transition-colors duration-500">
                <span className="material-symbols-outlined text-5xl mb-8 group-hover:text-[#2d1600] text-[#f7941d]">
                  architecture
                </span>
                <h3 className="text-3xl font-headline font-bold mb-4 group-hover:text-[#2d1600]">
                  Precision
                </h3>
                <p className="text-surface-foreground/70 group-hover:text-[#2d1600]/80 leading-relaxed">
                  Measurements down to the millimeter. Color matching that hits the mark every time.
                  We don&apos;t settle for &lsquo;close enough&rsquo;.
                </p>
              </div>
              <div className="group p-12 border border-[#544435]/15 border-l-0 border-r-0 hover:bg-[#f7941d] transition-colors duration-500">
                <span className="material-symbols-outlined text-5xl mb-8 group-hover:text-[#2d1600] text-[#f7941d]">
                  brush
                </span>
                <h3 className="text-3xl font-headline font-bold mb-4 group-hover:text-[#2d1600]">
                  Creativity
                </h3>
                <p className="text-surface-foreground/70 group-hover:text-[#2d1600]/80 leading-relaxed">
                  Turning industrial materials into visual masterpieces. We find the art in the
                  technical and the beauty in the functional.
                </p>
              </div>
              <div className="group p-12 border border-[#544435]/15 hover:bg-[#f7941d] transition-colors duration-500">
                <span className="material-symbols-outlined text-5xl mb-8 group-hover:text-[#2d1600] text-[#f7941d]">
                  handshake
                </span>
                <h3 className="text-3xl font-headline font-bold mb-4 group-hover:text-[#2d1600]">
                  Reliability
                </h3>
                <p className="text-surface-foreground/70 group-hover:text-[#2d1600]/80 leading-relaxed">
                  On time, on budget, and built to withstand the elements. When we give our word,
                  consider it set in vinyl and steel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-32 bg-surface-muted">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <p className="text-[#f7941d] font-label font-bold uppercase tracking-widest mb-4">
                  The Workshop Hands
                </p>
                <h2 className="text-5xl font-headline font-bold mt-4">Meet the Makers.</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="relative group aspect-[3/4] overflow-hidden bg-[#353534]">
                <Image
                  fill
                  alt="Martin Adams"
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  src="/stitch-images/img-016.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-1">
                    Founder &amp; Lead Artisan
                  </p>
                  <p className="text-2xl font-headline font-bold">Martin Adams</p>
                </div>
                <div className="absolute top-8 left-8">
                  <p className="text-lg font-headline font-bold text-surface-foreground group-hover:opacity-0 transition-opacity">
                    M. Adams
                  </p>
                </div>
              </div>
              {/* Team Member 2 */}
              <div className="relative group aspect-[3/4] overflow-hidden bg-[#353534]">
                <Image
                  fill
                  alt="Sarah Jenkins"
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  src="/stitch-images/img-013.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-1">
                    Creative Director
                  </p>
                  <p className="text-2xl font-headline font-bold">Sarah Jenkins</p>
                </div>
                <div className="absolute top-8 left-8">
                  <p className="text-lg font-headline font-bold text-surface-foreground group-hover:opacity-0 transition-opacity">
                    S. Jenkins
                  </p>
                </div>
              </div>
              {/* Team Member 3 */}
              <div className="relative group aspect-[3/4] overflow-hidden bg-[#353534]">
                <Image
                  fill
                  alt="David Thorne"
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  src="/stitch-images/img-020.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-1">
                    Production Manager
                  </p>
                  <p className="text-2xl font-headline font-bold">David Thorne</p>
                </div>
                <div className="absolute top-8 left-8">
                  <p className="text-lg font-headline font-bold text-surface-foreground group-hover:opacity-0 transition-opacity">
                    D. Thorne
                  </p>
                </div>
              </div>
              {/* Team Member 4 */}
              <div className="relative group aspect-[3/4] overflow-hidden bg-[#353534]">
                <Image
                  fill
                  alt="Elena Rossi"
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  src="/stitch-images/img-026.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-1">
                    Client Relations
                  </p>
                  <p className="text-2xl font-headline font-bold">Elena Rossi</p>
                </div>
                <div className="absolute top-8 left-8">
                  <p className="text-lg font-headline font-bold text-surface-foreground group-hover:opacity-0 transition-opacity">
                    E. Rossi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-[#f7941d] py-24">
          <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 text-[#2d1600]">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-5xl font-headline font-bold mt-0 mb-4">Work with us</h2>
              <p className="text-xl font-body opacity-90">
                Ready to elevate your brand&apos;s physical presence? Let&apos;s discuss your next
                project.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-[#2d1600] text-[#f7941d] px-12 py-5 font-bold uppercase tracking-widest text-lg hover:bg-[#2d1600]/90 transition-all duration-300 lg:rounded-lg shadow-2xl"
            >
              Get a Quote
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] w-full border-t border-[#f7941d]/15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-20 max-w-screen-2xl mx-auto">
          <div>
            <div className="text-[#f7941d] font-serif font-black text-2xl mb-6">MAD GRAPHICS</div>
            <p className="font-sans text-sm uppercase tracking-tighter text-[#E5E2E1]/60 leading-relaxed">
              &copy; 2024 MAD GRAPHICS. INDUSTRIAL PRECISION.
              <br />
              POLEGATE, EAST SUSSEX.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-serif text-xl text-[#f7941d] mb-2">Explore</p>
            <a
              className="text-[#E5E2E1]/60 hover:text-[#f7941d] hover:underline underline-offset-4 transition-all font-sans text-sm uppercase tracking-tighter"
              href="#"
            >
              Portfolio
            </a>
            <a
              className="text-[#E5E2E1]/60 hover:text-[#f7941d] hover:underline underline-offset-4 transition-all font-sans text-sm uppercase tracking-tighter"
              href="#"
            >
              Services
            </a>
            <a
              className="text-[#E5E2E1]/60 hover:text-[#f7941d] hover:underline underline-offset-4 transition-all font-sans text-sm uppercase tracking-tighter"
              href="#"
            >
              The Process
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-serif text-xl text-[#f7941d] mb-2">Headquarters</p>
            <p className="text-[#E5E2E1]/60 font-sans text-sm uppercase tracking-tighter">
              Unit 4, Highpoint Business Park
              <br />
              Polegate, East Sussex BN26 6NX
            </p>
            <div className="mt-4 flex gap-6">
              <a
                className="text-[#E5E2E1]/60 hover:text-[#f7941d] transition-colors focus:ring-1 focus:ring-[#f7941d] p-1"
                href="#"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
              <a
                className="text-[#E5E2E1]/60 hover:text-[#f7941d] transition-colors focus:ring-1 focus:ring-[#f7941d] p-1"
                href="#"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
              <a
                className="text-[#E5E2E1]/60 hover:text-[#f7941d] transition-colors focus:ring-1 focus:ring-[#f7941d] p-1"
                href="#"
              >
                <span className="material-symbols-outlined">call</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
