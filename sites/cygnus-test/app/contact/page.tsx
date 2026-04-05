import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | MAD GRAPHICS',
  description:
    'Get in touch with MAD GRAPHICS for industrial signage, large format printing, and bespoke fabrication. Workshop in Polegate, East Sussex.',
};

export default function ContactPage() {
  return (
    <>
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(247,148,29,0.1)]">
        <div className="flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto">
          <div className="text-2xl font-headline font-black tracking-tighter text-surface-foreground">
            MAD GRAPHICS
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <a
              className="text-surface-foreground/60 font-body uppercase tracking-widest text-xs hover:text-[#FFB976] transition-colors duration-300"
              href="/projects"
            >
              Portfolio
            </a>
            <a
              className="text-surface-foreground/60 font-body uppercase tracking-widest text-xs hover:text-[#FFB976] transition-colors duration-300"
              href="/services"
            >
              Services
            </a>
            <a
              className="text-surface-foreground/60 font-body uppercase tracking-widest text-xs hover:text-[#FFB976] transition-colors duration-300"
              href="/about"
            >
              Process
            </a>
            <a
              className="text-[#f7941d] border-b-2 border-[#f7941d] pb-1 font-body uppercase tracking-widest text-xs"
              href="/contact"
            >
              Contact
            </a>
            <a
              className="bg-[#f7941d] text-[#2d1600] px-6 py-2.5 font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform"
              href="/contact"
            >
              Get a Quote
            </a>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden text-surface-foreground">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Page Hero ── */}
        <section className="relative h-[614px] flex items-end pb-24 px-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Close-up of industrial printing press machinery with vibrant orange ink rollers in a dark workshop"
              className="w-full h-full object-cover"
              src="/stitch-images/img-021.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto w-full">
            <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8">
              Get in touch
            </h1>
            <div className="w-24 h-1 bg-[#f7941d]" />
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="max-w-[1440px] mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#2a2a2a] p-8 md:p-12 border border-[#544435]/15 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f7941d]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#f7941d]/10 transition-colors duration-500" />
              <h2 className="mt-4 mb-12 text-5xl font-headline font-bold">Request a Brief</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-[#353534] border-b border-[#a28d7b]/30 focus:border-[#f7941d] py-4 px-0 focus:ring-0 transition-all text-surface-foreground placeholder-[#dac2af]/40"
                      placeholder="John Doe"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-[#353534] border-b border-[#a28d7b]/30 focus:border-[#f7941d] py-4 px-0 focus:ring-0 transition-all text-surface-foreground placeholder-[#dac2af]/40"
                      placeholder="john@example.com"
                      type="email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold">
                      Phone Number
                    </label>
                    <input
                      className="w-full bg-[#353534] border-b border-[#a28d7b]/30 focus:border-[#f7941d] py-4 px-0 focus:ring-0 transition-all text-surface-foreground placeholder-[#dac2af]/40"
                      placeholder="0800 XXX XXXX"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold">
                      Service Needed
                    </label>
                    <select className="w-full bg-[#353534] border-b border-[#a28d7b]/30 focus:border-[#f7941d] py-4 px-0 focus:ring-0 transition-all text-surface-foreground">
                      <option>Large Format Printing</option>
                      <option>Industrial Signage</option>
                      <option>Vehicle Wrapping</option>
                      <option>Bespoke Fabrication</option>
                      <option>Exhibition Stands</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold">
                    Your Project Brief
                  </label>
                  <textarea
                    className="w-full bg-[#353534] border-b border-[#a28d7b]/30 focus:border-[#f7941d] py-4 px-0 focus:ring-0 transition-all text-surface-foreground placeholder-[#dac2af]/40"
                    placeholder="Tell us about your requirements..."
                    rows={4}
                  />
                </div>
                <button
                  className="w-full md:w-auto bg-gradient-to-r from-[#f7941d] to-[#ffb976] text-[#2d1600] px-12 py-5 font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all duration-300"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h2 className="mt-4 mb-10 text-5xl font-headline font-bold">Direct Contact</h2>
              <div className="space-y-12">
                {/* Phone */}
                <div className="flex gap-6 items-start">
                  <div className="bg-[#f7941d]/10 p-4 border border-[#f7941d]/20">
                    <span
                      className="material-symbols-outlined text-[#f7941d]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      phone_in_talk
                    </span>
                  </div>
                  <div>
                    <span className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold mb-1">
                      Telephone
                    </span>
                    <p className="text-2xl font-headline italic font-bold">0800 XXX XXXX</p>
                  </div>
                </div>
                {/* Address */}
                <div className="flex gap-6 items-start">
                  <div className="bg-[#f7941d]/10 p-4 border border-[#f7941d]/20">
                    <span
                      className="material-symbols-outlined text-[#f7941d]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                  <div>
                    <span className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold mb-1">
                      Workshop Address
                    </span>
                    <p className="text-xl font-headline leading-relaxed italic">
                      Unit H2 Chaucer Business Park,
                      <br />
                      Dittons Road, Polegate,
                      <br />
                      East Sussex
                    </p>
                  </div>
                </div>
                {/* Opening Hours */}
                <div className="flex gap-6 items-start">
                  <div className="bg-[#f7941d]/10 p-4 border border-[#f7941d]/20">
                    <span
                      className="material-symbols-outlined text-[#f7941d]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      schedule
                    </span>
                  </div>
                  <div>
                    <span className="block font-body text-xs uppercase tracking-widest text-[#dac2af] font-bold mb-1">
                      Opening Hours
                    </span>
                    <div className="space-y-1 font-body text-[#dac2af]">
                      <div className="flex justify-between w-64 border-b border-[#544435]/10 pb-1">
                        <span>Mon - Fri</span>
                        <span className="text-surface-foreground">8am - 5:30pm</span>
                      </div>
                      <div className="flex justify-between w-64 border-b border-[#544435]/10 pb-1 pt-1">
                        <span>Sat</span>
                        <span className="text-surface-foreground">9am - 1pm</span>
                      </div>
                      <div className="flex justify-between w-64 pt-1">
                        <span>Sun</span>
                        <span className="text-[#f7941d] font-bold italic">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Quote */}
            <div className="border-l-4 border-[#f7941d] p-8 bg-surface-muted italic text-[#dac2af]/80 font-headline text-lg">
              &ldquo;Precision is not just a standard at MAD GRAPHICS; it&rsquo;s our obsession.
              Every print, every cut, every finish is executed with industrial mastery.&rdquo;
            </div>
          </div>
        </section>

        {/* ── Map Section ── */}
        <section className="w-full h-[500px] bg-[#201f1f] relative overflow-hidden grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity duration-700">
          <img
            alt="Dark industrial stylized map of the East Sussex region with pinpoint marking for Polegate"
            className="w-full h-full object-cover mix-blend-overlay"
            src="/stitch-images/img-017.jpg"
          />
          <div className="absolute inset-0 bg-[#131313]/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#f7941d] rounded-full animate-ping absolute opacity-20" />
            <div className="w-4 h-4 bg-[#f7941d] relative z-10" />
            <div className="mt-4 bg-[#353534] px-4 py-2 border border-[#f7941d]/40 text-xs font-bold uppercase tracking-widest text-[#f7941d]">
              MAD WORKSHOP HQ
            </div>
          </div>
        </section>

        {/* ── Visual Break ── */}
        <section className="py-24 overflow-hidden">
          <div className="relative h-[400px] w-full">
            <img
              alt="Large format neon and industrial signage installation in a modern corporate building entrance"
              className="w-full h-full object-cover"
              src="/stitch-images/img-022.jpg"
            />
            <div className="absolute inset-0 bg-[#f7941d]/10 mix-blend-multiply" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <span className="block font-body text-xs uppercase tracking-[0.4em] text-[#2d1600] mb-4 font-bold">
                  Industrial Scale. Artisan Detail.
                </span>
                <h2 className="text-5xl md:text-8xl italic font-headline font-bold mt-4">
                  Made in Britain.
                </h2>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full pt-24 pb-12 bg-[#0e0e0e] border-t border-[#f7941d]/15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-[1440px] mx-auto">
          <div className="md:col-span-1">
            <div className="text-xl font-headline font-bold text-surface-foreground mb-6">
              MAD GRAPHICS
            </div>
            <p className="font-body text-sm tracking-normal text-surface-foreground/60 leading-relaxed">
              The leading producer of high-performance industrial signage and large-format print
              solutions across the UK.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-surface-foreground/60 text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="/projects"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  className="text-surface-foreground/60 text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-surface-foreground/60 text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="/about"
                >
                  Process
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-[#f7941d] text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="/contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-surface-foreground/60 text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-surface-foreground/60 text-sm hover:text-[#f7941d] underline decoration-2 underline-offset-8 transition-all duration-200"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#f7941d] font-bold uppercase tracking-widest text-xs mb-6">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 border border-[#f7941d]/30 flex items-center justify-center hover:bg-[#f7941d] hover:text-[#2d1600] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  share
                </span>
              </a>
              <a
                className="w-10 h-10 border border-[#f7941d]/30 flex items-center justify-center hover:bg-[#f7941d] hover:text-[#2d1600] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  mail
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-8 mt-24 border-t border-[#f7941d]/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs tracking-widest text-surface-foreground/40 uppercase">
            &copy; 2024 MAD GRAPHICS. INDUSTRIAL PRECISION.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-surface-foreground/20 tracking-tighter uppercase font-bold">
              EST. 1998
            </span>
            <span className="text-[10px] text-surface-foreground/20 tracking-tighter uppercase font-bold">
              SOUTHEAST DIVISION
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
