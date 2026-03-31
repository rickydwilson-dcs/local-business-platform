import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    { img: 'img-022.jpg', icon: 'palette', title: 'Design', desc: 'Creative branding and graphic design services that translate your vision into impactful visual identities.' },
    { img: 'img-013.jpg', icon: 'print', title: 'Print', desc: 'High-quality printing for business cards, flyers, and promotional materials with premium finishes.' },
    { img: 'img-016.jpg', icon: 'storefront', title: 'Building Signage', desc: 'Custom exterior and interior signs that make your business location stand out and attract customers.' },
    { img: 'img-010.jpg', icon: 'local_shipping', title: 'Vehicle Graphics', desc: 'Turn your fleet into mobile billboards with professional vinyl lettering and partial wraps.', slug: 'vehicle-graphics' },
    { img: 'img-015.jpg', icon: 'layers', title: 'Vinyl Wrapping', desc: 'Specialist vinyl applications for furniture, walls, and vehicles to transform surfaces with ease.' },
    { img: 'img-019.jpg', icon: 'event_seat', title: 'Exhibition Displays', desc: 'Eye-catching pop-up stands, banners, and backdrops designed for maximum impact at trade shows.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 border-b-2 border-zinc-100 shadow-sm transition-all duration-300">
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

      <main className="pt-20">
        {/* Breadcrumb & Header */}
        <header className="bg-zinc-50 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6 font-medium">
              <Link href="/" className="hover:text-[#E85118]">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#E85118]">Services</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Our Services</h1>
            <p className="max-w-2xl text-xl text-zinc-600 leading-relaxed">
              Elevate your brand visibility with our comprehensive design, print, and signage solutions. From concept to installation, we bring precision and creativity to every project in Polegate and beyond.
            </p>
          </div>
        </header>

        {/* 6-Card Service Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md border border-zinc-100 transition-all hover:shadow-xl">
                <div className="h-56 overflow-hidden relative">
                  <Image
                    src={`/stitch-images/${service.img}`}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute top-4 left-4 bg-[#5BA829] text-white p-3 rounded-lg shadow-lg">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-newsreader), serif' }}>{service.title}</h3>
                  <p className="text-zinc-600 mb-6 flex-grow">{service.desc}</p>
                  <Link
                    href={service.slug ? `/services/${service.slug}` : '/services'}
                    className="flex items-center gap-2 text-[#E85118] font-bold group-hover:gap-3 transition-all"
                  >
                    Learn more <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-[#E85118] py-20 px-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <span className="material-symbols-outlined" style={{ fontSize: '20rem' }}>content_cut</span>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8">
              <span className="material-symbols-outlined text-white text-3xl">architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Get a Quote for Your Project</h2>
            <p className="text-white/90 text-xl mb-10 font-medium">
              Ready to make your brand stand out? Contact our experts for a tailored solution that fits your budget and timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-[#E85118] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#5BA829] hover:text-white transition-all shadow-xl">
                Get a Free Quote
              </Link>
              <Link href="/contact" className="bg-[#1a1a1a] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl border border-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-zinc-900 border-t border-zinc-800">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-xl font-bold text-[#5BA829]">MAD <span className="text-[#E85118]">GRAPHICS</span></span>
          <p className="text-zinc-400 max-w-xs text-center md:text-left text-sm">
            &copy; 2024 Mad Graphics. Making Your Brand Stand Out.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="/services" className="text-zinc-400 hover:text-white hover:underline decoration-2 transition-all">Design</Link>
          <Link href="/services" className="text-zinc-400 hover:text-white hover:underline decoration-2 transition-all">Print</Link>
          <Link href="/services" className="text-zinc-400 hover:text-white hover:underline decoration-2 transition-all">Signage</Link>
          <Link href="/services/vehicle-graphics" className="text-zinc-400 hover:text-white hover:underline decoration-2 transition-all">Vehicle Graphics</Link>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-zinc-400 hover:text-[#5BA829] transition-all">
            <span className="material-symbols-outlined">alternate_email</span>
          </Link>
          <Link href="#" className="text-zinc-400 hover:text-[#5BA829] transition-all">
            <span className="material-symbols-outlined">call</span>
          </Link>
          <Link href="#" className="text-zinc-400 hover:text-[#5BA829] transition-all">
            <span className="material-symbols-outlined">location_on</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
