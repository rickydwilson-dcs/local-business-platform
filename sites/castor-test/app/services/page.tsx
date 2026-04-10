export default function ServicesPage() {
  const services = [
    {
      icon: 'heat_pump',
      title: 'Boiler installation',
      desc: 'Energy-efficient boiler replacements and new installations from leading manufacturers to keep your home warm and bills low.',
      img: 'img-015.jpg',
      href: '/services/boiler-installation',
    },
    {
      icon: 'emergency_home',
      title: 'Emergency plumbing repairs',
      desc: 'Rapid response for burst pipes, major leaks, and plumbing failures. Available when you need us most across East Sussex.',
      img: 'img-003.jpg',
      href: '/services',
    },
    {
      icon: 'shower',
      title: 'Bathroom fitting',
      desc: 'Complete bathroom transformations from design to final tile. We handle all plumbing, fixtures, and finishes with precision.',
      img: 'img-004.jpg',
      href: '/services',
    },
    {
      icon: 'water_drop',
      title: 'Leak detection and repair',
      desc: 'Non-invasive leak detection using advanced technology to find hidden water issues before they cause structural damage.',
      img: 'img-005.jpg',
      href: '/services',
    },
    {
      icon: 'thermostat',
      title: 'Central heating',
      desc: 'Full heating system design, radiator upgrades, and power flushing to ensure your entire home stays warm and efficient.',
      img: 'img-016.jpg',
      href: '/services',
    },
    {
      icon: 'plumbing',
      title: 'Drain unblocking',
      desc: 'Professional clearance of internal and external blockages using high-pressure equipment to restore full flow quickly.',
      img: 'img-017.jpg',
      href: '/services',
    },
  ];

  return (
    <>
      {/* TopNavBar — Navy variant */}
      <nav className="bg-[#1a3a6b] sticky top-0 z-50 shadow-lg border-none">
        <div className="flex justify-between items-center px-8 py-4 max-w-[1280px] mx-auto w-full">
          <a className="font-bold text-2xl text-white" href="/">
            DCS Plumbing
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/services"
            >
              Services
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/about"
            >
              About Us
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/blog"
            >
              FAQs
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/contact"
            >
              Contact
            </a>
          </div>
          <a
            className="bg-[#3a7d44] text-white px-6 py-2 rounded-lg font-semibold text-sm active:translate-y-[1px] transition-transform"
            href="/contact"
          >
            Get a Quote
          </a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex flex-col justify-center bg-[#1a3a6b] overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="Professional plumbing tools"
              className="w-full h-full object-cover opacity-40"
              src="/stitch-images/img-018.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a6b] via-[#1a3a6b]/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1280px] mx-auto w-full px-8 py-12">
            <nav className="flex mb-8 text-sm font-medium tracking-wide text-white/60">
              <a
                className="hover:text-white transition-colors after:content-['/'] after:mx-2 after:text-white/40"
                href="/"
              >
                Home
              </a>
              <span className="text-white">Services</span>
            </nav>
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-2xl">
              Our services
            </h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Reliable plumbing solutions for Eastbourne and East Sussex. From emergency repairs to
              complete bathroom installations, we deliver craft-oriented quality.
            </p>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-[clamp(4rem,8vw,7rem)] bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-8">
            <header className="mb-16">
              <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                Expert plumbing &amp; heating solutions
              </h2>
              <div className="w-20 h-1 bg-[#3a7d44]"></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={service.title}
                      className="w-full h-full object-cover"
                      src={`/stitch-images/${service.img}`}
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-[#3a7d44] text-3xl">
                        {service.icon}
                      </span>
                      <h3 className="text-xl font-bold text-[#1c1c1e] leading-tight">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-[#64748b] mb-6 leading-relaxed flex-grow">{service.desc}</p>
                    <a
                      className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
                      href={service.href}
                    >
                      Learn more
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-[#1a3a6b] py-16 overflow-hidden relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem]">plumbing</span>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-left">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Need a plumber in East Sussex?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              Our team is ready to help with any project, large or small. Get in touch today for a
              transparent, no-obligation quote.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="bg-[#3a7d44] text-white px-8 py-3 rounded-lg font-semibold text-lg active:translate-y-[1px] transition-transform"
                href="/contact"
              >
                Get a free quote
              </a>
              <a
                className="border-[1.5px] border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1a3a6b] transition-colors flex items-center gap-2"
                href="tel:0800XXXXXXX"
              >
                <span className="material-symbols-outlined">call</span>
                0800 XXX XXXX
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3a6b] border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-[1280px] mx-auto w-full">
          <div>
            <a className="font-bold text-xl text-white mb-6 block" href="/">
              DCS Plumbing
            </a>
            <p className="text-white/80 leading-relaxed mb-6">
              Providing professional plumbing and heating services to Eastbourne and the surrounding
              East Sussex area for over 15 years.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Services</h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services/boiler-installation"
                >
                  Boiler Services
                </a>
              </li>
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Bathroom Installations
                </a>
              </li>
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Emergency Repairs
                </a>
              </li>
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Heating Systems
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
            <div className="space-y-4 text-white/80">
              <p className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">phone</span>
                0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">mail</span>
                info@dcsplumbing.co.uk
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-8 py-8 border-t border-white/5">
          <p className="text-white/40 text-sm text-center md:text-left">
            &copy; DCS Plumbing. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
