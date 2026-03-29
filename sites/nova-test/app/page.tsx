import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b-2 border-zinc-100 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-1 group cursor-pointer">
            <span className="text-2xl font-black tracking-tighter text-[#E85118]">MAD</span>
            <span className="text-2xl font-black tracking-tighter text-[#5BA829]">GRAPHICS</span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-zinc-800 font-medium hover:text-[#E85118] hover:scale-105 transition-transform duration-200">Services</Link>
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
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/stitch-images/img-007.jpg"
              alt="Large format industrial printing"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E85118]/90 via-[#E85118]/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
                Making Your <span className="italic">Brand</span> Stand Out
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 max-w-xl opacity-95">
                Premier design, print, and signage specialists in Polegate, East Sussex. Precision craftsmanship for high-impact visual identity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="bg-white text-[#E85118] px-8 py-4 rounded-lg font-extrabold text-lg hover:bg-zinc-100 transition-colors shadow-xl">
                  Get a Quote
                </Link>
                <Link href="/services" className="bg-[#5BA829] text-white px-8 py-4 rounded-lg font-extrabold text-lg hover:brightness-110 transition-colors shadow-xl">
                  View Our Work
                </Link>
              </div>
            </div>
            {/* Floating Stats Card */}
            <div className="hidden lg:block relative">
              <div className="absolute -top-12 -right-6 bg-white p-8 rounded-xl shadow-2xl border-l-8 border-[#5BA829]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-[#5BA829]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#1a1a1a]">100%</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-zinc-500">Quality Guarantee</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full text-[#E85118]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#1a1a1a]">500+</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-zinc-500">Signage Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-zinc-50 py-12 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <span className="material-symbols-outlined text-5xl text-[#E85118]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              <div>
                <div className="text-4xl font-black text-[#1a1a1a] leading-none mb-1">500+</div>
                <p className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Projects Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-center">
              <span className="material-symbols-outlined text-5xl text-[#E85118]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              <div>
                <div className="text-4xl font-black text-[#1a1a1a] leading-none mb-1">15+</div>
                <p className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Years Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-center md:justify-end">
              <span className="material-symbols-outlined text-5xl text-[#E85118]" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
              <div>
                <div className="text-4xl font-black text-[#1a1a1a] leading-none mb-1">100%</div>
                <p className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Satisfaction Guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Our Core Services</h2>
            <div className="h-1.5 w-24 bg-[#5BA829] mx-auto mb-6" />
            <p className="text-lg text-zinc-600">From initial concept to final installation, we provide high-quality signage and print solutions tailored to your business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: 'img-022.jpg', icon: 'palette', title: 'Design', desc: 'Professional brand identity and graphic design services that capture your audience\'s attention.' },
              { img: 'img-013.jpg', icon: 'print', title: 'Print', desc: 'From business cards to large banners, our print quality is unmatched in sharpness and color.' },
              { img: 'img-016.jpg', icon: 'store', title: 'Building Signage', desc: 'Make your physical presence known with custom storefront signs, plaques, and exterior graphics.' },
              { img: 'img-010.jpg', icon: 'minor_crash', title: 'Vehicle Graphics', desc: 'Turn your vehicle into a mobile billboard with our professional vinyl wrapping and decals.' },
            ].map((s) => (
              <div key={s.title} className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <Image src={`/stitch-images/${s.img}`} alt={s.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[#E85118]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-black mb-3">{s.title}</h3>
                  <p className="text-zinc-600 mb-6 line-clamp-3">{s.desc}</p>
                  <Link href="/services" className="inline-flex items-center font-bold text-[#E85118] hover:gap-2 transition-all">
                    Details <span className="material-symbols-outlined ml-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-zinc-900 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-newsreader), serif' }}>What Our Clients Say</h2>
              <div className="h-1.5 w-24 bg-[#E85118]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-10 rounded-xl relative">
                <span className="material-symbols-outlined text-zinc-100 text-8xl absolute top-4 right-8 select-none">format_quote</span>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[#E85118]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <blockquote className="text-xl italic text-zinc-700 mb-8 relative z-10">
                  &ldquo;Mad Graphics transformed our fleet. The attention to detail on the vinyl wrapping was incredible. Our vehicles now act as our best marketing tool in East Sussex!&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#5BA829] rounded-full flex items-center justify-center text-white font-bold text-xl">JD</div>
                  <div>
                    <p className="font-black text-[#1a1a1a]">James Dalton</p>
                    <p className="text-zinc-500 text-sm">Dalton Logistics</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-white p-10 rounded-xl relative">
                <span className="material-symbols-outlined text-zinc-100 text-8xl absolute top-4 right-8 select-none">format_quote</span>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[#E85118]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <blockquote className="text-xl italic text-zinc-700 mb-8 relative z-10">
                  &ldquo;Speed and quality are hard to find, but Mad Graphics delivered both for our shop signage. Professional from start to finish. Highly recommended.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#E85118] rounded-full flex items-center justify-center text-white font-bold text-xl">SL</div>
                  <div>
                    <p className="font-black text-[#1a1a1a]">Sarah Laine</p>
                    <p className="text-zinc-500 text-sm">The Coffee Boutique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-[#E85118] py-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Ready to Make Your Brand Stand Out?</h2>
            <p className="text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto opacity-90">
              Get in touch today for a free, no-obligation quote. Our team in Polegate is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/contact" className="bg-white text-[#E85118] px-10 py-5 rounded-lg font-black text-xl hover:bg-zinc-100 transition-all shadow-2xl">
                Get a Free Quote
              </Link>
              <a href="tel:01323000000" className="bg-[#5BA829] text-white px-10 py-5 rounded-lg font-black text-xl hover:brightness-110 transition-all shadow-2xl">
                Call Us: 01323 000000
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="text-3xl font-black text-[#5BA829] mb-4 uppercase">Mad Graphics</div>
            <p className="text-zinc-400 leading-relaxed mb-6">
              &copy; 2024 Mad Graphics. Polegate, East Sussex. Making Your Brand Stand Out.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-zinc-400 hover:text-[#5BA829] cursor-pointer">public</span>
              <span className="material-symbols-outlined text-zinc-400 hover:text-[#5BA829] cursor-pointer">share</span>
              <span className="material-symbols-outlined text-zinc-400 hover:text-[#5BA829] cursor-pointer">mail</span>
            </div>
          </div>
          {/* Services Links */}
          <div>
            <h4 className="text-xl text-[#E85118] mb-6 font-light" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Design &amp; Print</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Design</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Print</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Banners</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Promotional Materials</Link></li>
            </ul>
          </div>
          {/* Signage Links */}
          <div>
            <h4 className="text-xl text-[#E85118] mb-6 font-light" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Signage</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Building Signage</Link></li>
              <li><Link href="/services/vehicle-graphics" className="text-zinc-400 hover:text-white transition-colors">Vehicle Graphics</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Vinyl Wrapping</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Exhibition Displays</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-xl text-[#E85118] mb-6 font-light" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#5BA829]">location_on</span>
                <p className="text-zinc-400">Unit X, Business Park,<br />Polegate, East Sussex</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5BA829]">phone</span>
                <p className="text-zinc-400">01323 000000</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5BA829]">mail</span>
                <p className="text-zinc-400">hello@madgraphics.co.uk</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 py-6 text-center">
          <p className="text-zinc-600 text-sm">Professional Signage &amp; Print Experts in the South East.</p>
        </div>
      </footer>
    </div>
  );
}
