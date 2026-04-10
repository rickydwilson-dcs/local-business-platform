export default function ProjectsPage() {
  const projects = [
    {
      title: 'Victorian bathroom renovation, Eastbourne',
      badge: 'Bathroom Fitting',
      scope:
        'Complete strip-out and refit of a period bathroom with modern plumbing and heritage-style fixtures.',
      img: 'img-004.jpg',
      href: '/projects/victorian-bathroom-renovation',
    },
    {
      title: 'New boiler installation, Hailsham',
      badge: 'Heating',
      scope:
        'Replacement of a 20-year-old conventional boiler with a high-efficiency combi system and smart controls.',
      img: 'img-015.jpg',
      href: '/projects',
    },
    {
      title: 'Central heating upgrade, Lewes',
      badge: 'Heating',
      scope:
        'Full central heating redesign for a three-storey Georgian townhouse including radiator upgrades and power flush.',
      img: 'img-016.jpg',
      href: '/projects',
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
              alt="Project portfolio"
              className="w-full h-full object-cover opacity-40"
              src="/stitch-images/img-027.jpg"
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
              <span className="text-white">Projects</span>
            </nav>
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-2xl">
              Our projects
            </h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              A selection of recent plumbing and heating projects across East Sussex. Quality
              craftsmanship you can see.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-[clamp(4rem,8vw,7rem)] bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-8">
            <header className="mb-16">
              <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                Recent projects
              </h2>
              <div className="w-20 h-1 bg-[#3a7d44]"></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="bg-white rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      alt={project.title}
                      className="w-full h-full object-cover"
                      src={`/stitch-images/${project.img}`}
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="inline-block text-[#3a7d44] text-xs font-bold tracking-widest uppercase mb-3">
                      {project.badge}
                    </span>
                    <h3 className="text-xl font-bold text-[#1c1c1e] leading-tight mb-3">
                      {project.title}
                    </h3>
                    <p className="text-[#64748b] mb-6 leading-relaxed flex-grow">{project.scope}</p>
                    <a
                      className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
                      href={project.href}
                    >
                      View project &rarr;
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
              Have a project in mind?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              From small repairs to full installations, we&apos;d love to hear about your project.
              Get in touch for a free, no-obligation quote.
            </p>
            <a
              className="bg-[#3a7d44] text-white px-8 py-3 rounded-lg font-semibold text-lg active:translate-y-[1px] transition-transform inline-block"
              href="/contact"
            >
              Get a free quote
            </a>
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
            <p className="text-white/80 leading-relaxed">
              &copy; 2024 DCS Plumbing Eastbourne. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/projects"
                >
                  Projects
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-[#3a7d44] transition-colors" href="/about">
                  About Us
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-[#3a7d44] transition-colors" href="/contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
            <div className="space-y-4 text-white/80">
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">phone</span>0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
