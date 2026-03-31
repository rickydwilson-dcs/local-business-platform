import Image from 'next/image';
import Link from 'next/link';

export default function VehicleGraphicsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 w-full z-50 border-b-2 border-zinc-100 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <span className="text-2xl font-black tracking-tighter text-[#E85118]">MAD</span>
            <span className="text-2xl font-black tracking-tighter text-[#5BA829]">GRAPHICS</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-[#E85118] font-bold border-b-2 border-[#E85118]">Services</Link>
            <Link href="/about" className="text-zinc-800 font-medium hover:text-[#E85118] hover:scale-105 transition-transform duration-200">About</Link>
            <Link href="/contact" className="text-zinc-800 font-medium hover:text-[#E85118] hover:scale-105 transition-transform duration-200">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <a className="hidden lg:flex items-center gap-2 font-bold text-[#1a1a1a]" href="tel:01323000000">
              <span className="material-symbols-outlined text-[#E85118]">call</span>
              01323 000000
            </a>
            <Link href="/contact" className="bg-[#E85118] text-white px-6 py-2.5 rounded-lg font-bold hover:scale-105 active:opacity-80 active:scale-95 transition-all duration-200 shadow-lg">
              Get a Quote
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm font-medium text-zinc-500">
          <Link href="/" className="hover:text-[#E85118]">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/services" className="hover:text-[#E85118]">Services</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#1a1a1a]">Vehicle Graphics</span>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/stitch-images/img-010.jpg" alt="Vehicle being wrapped with vinyl graphics" fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-[#1a1a1a]/60" />
          </div>
          <div className="relative z-10 max-w-4xl px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Vehicle Graphics</h1>
            <p className="text-xl md:text-2xl text-zinc-200 mb-10 max-w-2xl mx-auto leading-relaxed">Transform your fleet into high-impact moving billboards that command attention across East Sussex and beyond.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-[#E85118] text-white px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all shadow-xl">Get a Free Quote</Link>
              <Link href="/services" className="bg-[#5BA829] text-white px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all shadow-xl">View Our Work</Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="italic text-4xl md:text-5xl text-[#1a1a1a] mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Drive Your Brand Forward</h2>
              <p className="text-lg text-zinc-600 leading-relaxed mb-6">At Mad Graphics, we specialize in high-precision vehicle branding that stands the test of time. From single cars to entire commercial fleets, our expert team in Polegate uses industry-leading materials to ensure your message is clear, vibrant, and professional.</p>
              <div className="flex items-center gap-4 text-[#5BA829] font-bold">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>Certified 3M &amp; Avery Dennison Installers</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-zinc-50 p-8 rounded-xl border-l-4 border-[#E85118] shadow-sm">
                <span className="material-symbols-outlined text-[#E85118] text-4xl mb-4 block">minor_crash</span>
                <h3 className="font-bold text-xl mb-2">Full Wraps</h3>
                <p className="text-zinc-600 text-sm">Complete color changes and full-coverage digital prints for maximum impact.</p>
              </div>
              <div className="bg-zinc-50 p-8 rounded-xl border-l-4 border-[#5BA829] shadow-sm">
                <span className="material-symbols-outlined text-[#5BA829] text-4xl mb-4 block">brush</span>
                <h3 className="font-bold text-xl mb-2">Partial Graphics</h3>
                <p className="text-zinc-600 text-sm">Strategic placement of logos and contact info for a cost-effective professional look.</p>
              </div>
              <div className="bg-zinc-50 p-8 rounded-xl border-l-4 border-[#E85118] shadow-sm">
                <span className="material-symbols-outlined text-[#E85118] text-4xl mb-4 block">group_work</span>
                <h3 className="font-bold text-xl mb-2">Fleet Branding</h3>
                <p className="text-zinc-600 text-sm">Uniform branding across your entire fleet to build massive local recognition.</p>
              </div>
              <div className="bg-zinc-50 p-8 rounded-xl border-l-4 border-[#5BA829] shadow-sm">
                <span className="material-symbols-outlined text-[#5BA829] text-4xl mb-4 block">wb_sunny</span>
                <h3 className="font-bold text-xl mb-2">UV-Resistant</h3>
                <p className="text-zinc-600 text-sm">Premium vinyl with UV protection to prevent fading and peeling in British weather.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric Gallery */}
        <section className="bg-zinc-950 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="italic text-4xl text-white mb-12 text-center" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Recent Transformations</h2>
            <div className="grid grid-cols-12 gap-6" style={{ height: '800px' }}>
              <div className="col-span-12 md:col-span-7 relative group overflow-hidden rounded-xl">
                <Image src="/stitch-images/img-014.jpg" alt="Luxury vehicle wrap" fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#E85118]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                  <div className="text-center">
                    <h4 className="text-white text-2xl font-bold mb-2">Matte Stealth Wrap</h4>
                    <p className="text-white/90">Premium color change with custom detailing.</p>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-6">
                <div className="relative group overflow-hidden rounded-xl">
                  <Image src="/stitch-images/img-017.jpg" alt="Corporate fleet branding" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#5BA829]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                    <div className="text-center">
                      <h4 className="text-white text-xl font-bold mb-2">Corporate Fleet</h4>
                      <p className="text-white/90">High-visibility transit branding.</p>
                    </div>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-xl">
                  <Image src="/stitch-images/img-020.jpg" alt="Trade vehicle graphics" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#E85118]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                    <div className="text-center">
                      <h4 className="text-white text-xl font-bold mb-2">Trade Professional</h4>
                      <p className="text-white/90">Durable graphics for local trades.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#E85118] font-bold tracking-widest uppercase text-sm">Everything you need to know</span>
            <h2 className="italic text-4xl mt-2" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'How long does a vehicle wrap last?', a: 'With professional installation and proper care, a high-quality wrap typically lasts between 5 to 7 years. We use premium UV-resistant vinyl to ensure your graphics stay vibrant throughout their lifespan.' },
              { q: 'Can you wrap any vehicle?', a: 'Absolutely. From compact cars and motorcycles to large commercial vans, trucks, and even trailers. As long as the paint surface is in good condition, we can apply our high-performance vinyl.' },
              { q: 'How do I maintain my vehicle wrap?', a: 'Hand washing is best. Avoid high-pressure jet washes and harsh chemicals. We provide a full care guide with every installation to help you maximize the life of your graphics.' },
            ].map((faq, index) => (
              <details key={faq.q} className="border-2 border-zinc-100 rounded-xl overflow-hidden" open={index === 0}>
                <summary className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-50 transition-colors cursor-pointer">
                  <span className="font-bold text-lg">{faq.q}</span>
                  <span className="material-symbols-outlined text-[#E85118]">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-zinc-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Panel */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-[#E85118] rounded-3xl p-12 md:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5BA829]/30 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="italic text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Ready to Transform Your Vehicle?</h2>
                <p className="text-xl text-white/90 mb-8">Join hundreds of local businesses in East Sussex who have scaled their brand with Mad Graphics. Get a no-obligation quote today.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="bg-white text-[#E85118] px-8 py-4 rounded-lg font-extrabold text-lg shadow-lg hover:scale-105 transition-transform">Get a Free Quote</Link>
                  <a href="tel:01323000000" className="bg-[#1a1a1a] text-white px-8 py-4 rounded-lg font-extrabold text-lg shadow-lg hover:bg-black transition-colors">Call 01323 000000</a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#5BA829] flex items-center justify-center">
                      <span className="material-symbols-outlined">timer</span>
                    </div>
                    <div>
                      <p className="font-bold text-xl leading-tight">Fast Turnaround</p>
                      <p className="text-white/70 text-sm">Most wraps completed in 48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#5BA829] flex items-center justify-center">
                      <span className="material-symbols-outlined">star</span>
                    </div>
                    <div>
                      <p className="font-bold text-xl leading-tight">5-Star Service</p>
                      <p className="text-white/70 text-sm">Rated &ldquo;Excellent&rdquo; on Google Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t-4 border-[#E85118]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 w-full max-w-7xl mx-auto">
          <div>
            <span className="text-[#5BA829] font-black text-xl mb-6 block">MAD <span className="text-white">GRAPHICS</span></span>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">&copy; 2024 Mad Graphics. Making Your Brand Stand Out in Polegate, East Sussex.</p>
            <div className="flex gap-4">
              <span className="text-zinc-400 hover:text-[#E85118] transition-colors cursor-pointer"><span className="material-symbols-outlined">social_leaderboard</span></span>
              <span className="text-zinc-400 hover:text-[#E85118] transition-colors cursor-pointer"><span className="material-symbols-outlined">photo_camera</span></span>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="italic text-xl text-[#E85118] mb-2" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Services</h4>
              <Link href="/services" className="text-zinc-400 hover:text-[#5BA829] text-sm hover:translate-x-1 transition-transform">Design</Link>
              <Link href="/services" className="text-zinc-400 hover:text-[#5BA829] text-sm hover:translate-x-1 transition-transform">Print</Link>
              <Link href="/services/vehicle-graphics" className="text-white font-bold text-sm hover:translate-x-1 transition-transform">Vehicle Graphics</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="italic text-xl text-[#E85118] mb-2" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Company</h4>
              <Link href="/about" className="text-zinc-400 hover:text-[#5BA829] text-sm hover:translate-x-1 transition-transform">About Us</Link>
              <Link href="/contact" className="text-zinc-400 hover:text-[#5BA829] text-sm hover:translate-x-1 transition-transform">Contact</Link>
              <Link href="#" className="text-zinc-400 hover:text-[#5BA829] text-sm hover:translate-x-1 transition-transform">Privacy Policy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="italic text-xl text-[#E85118] mb-2" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Location</h4>
              <p className="text-zinc-400 text-sm">Unit X, Business Park<br />Polegate, East Sussex<br />BN26 6RS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
