import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-[#E85118]">MAD GRAPHICS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-neutral-700 font-medium hover:text-[#E85118] transition-colors duration-200">Home</Link>
          <Link href="/services" className="text-neutral-700 font-medium hover:text-[#E85118] transition-colors duration-200">Services</Link>
          <Link href="/about" className="text-neutral-700 font-medium hover:text-[#E85118] transition-colors duration-200">About</Link>
          <Link href="/contact" className="text-[#5BA829] font-bold border-b-2 border-[#5BA829] pb-1">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="bg-[#E85118] text-white px-6 py-2 rounded-lg font-bold hover:scale-95 duration-150 transition-transform">
            Get a Quote
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/stitch-images/img-001.jpg" alt="Signage Workshop" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-[#E85118]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
                Get In Touch
              </h1>
              <p className="text-xl text-white/90 max-w-xl">
                Get a free quote or discuss your project with our expert team in Polegate. We&apos;re here to make your brand stand out.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Two-Column Layout */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Form Column */}
              <div className="lg:col-span-7">
                <div className="bg-neutral-50 p-8 md:p-12 rounded-xl border border-neutral-100">
                  <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Send an Enquiry</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Name</label>
                        <input className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-[#E85118] focus:border-[#E85118] focus:outline-none" placeholder="Your full name" type="text" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Email</label>
                        <input className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-[#E85118] focus:border-[#E85118] focus:outline-none" placeholder="email@address.com" type="email" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Phone</label>
                      <input className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-[#E85118] focus:border-[#E85118] focus:outline-none" placeholder="01234 567890" type="tel" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Message</label>
                      <textarea className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-[#E85118] focus:border-[#E85118] focus:outline-none resize-none" placeholder="Tell us about your project requirements..." rows={5} />
                    </div>
                    <button className="w-full md:w-auto px-10 py-4 bg-[#E85118] text-white font-bold rounded-lg hover:scale-95 transition-transform duration-150 shadow-lg" type="submit">
                      Send Enquiry
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar Info Column */}
              <div className="lg:col-span-5 flex flex-col gap-10">
                <div>
                  <h3 className="text-xl font-bold text-[#5BA829] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">contact_support</span>
                    Contact Information
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E85118]/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#E85118]">call</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-newsreader), serif' }}>01323 000000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E85118]/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#E85118]">location_on</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Visit Us</p>
                        <p className="text-lg leading-relaxed">
                          Unit X, Business Park,<br />
                          Polegate, East Sussex<br />
                          BN26 6RS
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E85118]/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#E85118]">schedule</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Opening Hours</p>
                        <div className="text-lg">
                          <div className="flex justify-between gap-8 mb-1">
                            <span className="font-medium">Monday - Friday</span>
                            <span>8am - 6pm</span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span className="font-medium">Saturday</span>
                            <span>9am - 1pm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Trust Badge */}
                <div className="p-6 border-2 border-dashed border-[#5BA829]/30 rounded-xl bg-[#5BA829]/5">
                  <p className="text-[#5BA829] font-bold text-center italic text-xl" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
                    &ldquo;Precision, Creativity, and Impact &ndash; guaranteed with every project.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full h-[450px] relative">
          <div className="absolute inset-0 bg-neutral-200">
            <Image src="/stitch-images/img-006.jpg" alt="Map location of Polegate" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#1a1a1a]/10 pointer-events-none flex items-center justify-center">
            <div className="bg-white px-8 py-4 rounded-full shadow-2xl border border-neutral-100 flex items-center gap-3">
              <span className="w-3 h-3 bg-[#E85118] rounded-full animate-pulse" />
              <span className="font-bold">Find us in Polegate Business Park</span>
            </div>
          </div>
        </section>

        {/* Landscape Image Break */}
        <section className="relative h-[500px] overflow-hidden">
          <Image src="/stitch-images/img-012.jpg" alt="Vehicle Graphics Work" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/60 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-xl">
                <span className="inline-block px-4 py-1 bg-[#5BA829] text-white text-xs font-black uppercase tracking-widest mb-4">Portfolio Highlight</span>
                <h2 className="text-4xl font-bold text-white mb-4 italic" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Making Your Brand Stand Out</h2>
                <p className="text-white/80 text-lg">From full vehicle wraps to building signage, we deliver precision and visual impact that gets you noticed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-t border-neutral-200">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-black text-[#5BA829]">MAD GRAPHICS</span>
          <p className="text-neutral-500 text-sm">&copy; 2024 Mad Graphics. Making Your Brand Stand Out.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="text-neutral-500 hover:text-[#5BA829] transition-colors text-sm font-medium">Privacy Policy</Link>
          <Link href="#" className="text-neutral-500 hover:text-[#5BA829] transition-colors text-sm font-medium">Terms of Service</Link>
          <Link href="#" className="text-neutral-500 hover:text-[#5BA829] transition-colors text-sm font-medium">Cookie Policy</Link>
          <Link href="#" className="text-neutral-500 hover:text-[#5BA829] transition-colors text-sm font-medium">Sitemap</Link>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-[#E85118] hover:text-white transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm">share</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-[#E85118] hover:text-white transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm">thumb_up</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
