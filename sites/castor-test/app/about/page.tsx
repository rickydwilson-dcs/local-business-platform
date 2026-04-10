export default function AboutPage() {
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

      {/* Page Hero */}
      <section className="relative min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            alt="DCS Plumbing Team Van"
            className="w-full h-full object-cover"
            src="/stitch-images/img-006.jpg"
          />
          <div className="absolute inset-0 bg-[#1a3a6b]/75"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
              Our Story
            </h1>
            <p className="text-white/90 text-xl leading-relaxed max-w-lg">
              Built on a foundation of integrity and technical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                Rooted in Eastbourne
              </h2>
              <div className="space-y-4 text-[#1c1c1e] leading-relaxed opacity-90">
                <p>
                  Founded in 1998, DCS Plumbing began as a small family operation with a single
                  mission: to provide the residents of Eastbourne and East Sussex with a level of
                  craftsmanship that is increasingly rare in the modern industry.
                </p>
                <p>
                  Our values haven&apos;t changed in over two decades. We believe in punctuality,
                  transparent pricing, and technical mastery. As a family-run business, we
                  understand the importance of a safe, functional home environment for your loved
                  ones.
                </p>
                <blockquote className="border-l-4 border-[#1a3a6b] pl-6 py-2 my-8 italic text-xl text-[#1a3a6b] font-medium">
                  &ldquo;We never sought to be the biggest plumbing firm in the South East, only the
                  most trusted.&rdquo;
                </blockquote>
                <p>
                  Today, while we utilize the latest leak detection technology and modern boiler
                  diagnostics, we still approach every job with the same dedication to service that
                  started it all in the late nineties.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-[rgba(226,232,240,0.6)]">
              <img
                alt="Plumbing Craftsmanship"
                className="w-full h-full object-cover aspect-[4/3]"
                src="/stitch-images/img-007.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-[#f0f4f8]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            <div className="grayscale hover:grayscale-0 transition-all duration-300 flex flex-col items-center group">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#64748b] group-hover:text-[#3a7d44]">
                verified
              </span>
              <span className="font-semibold text-xs tracking-widest uppercase">
                Gas Safe Registered
              </span>
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300 flex flex-col items-center group">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#64748b] group-hover:text-amber-500">
                star
              </span>
              <span className="font-semibold text-xs tracking-widest uppercase">
                Which? Trusted Trader
              </span>
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300 flex flex-col items-center group">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#64748b] group-hover:text-blue-600">
                handshake
              </span>
              <span className="font-semibold text-xs tracking-widest uppercase">
                Checkatrade Approved
              </span>
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300 flex flex-col items-center group">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#64748b] group-hover:text-[#1a3a6b]">
                school
              </span>
              <span className="font-semibold text-xs tracking-widest uppercase">CIPHE Member</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-10 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm hover:bg-[#1a3a6b] transition-all duration-300 cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#3a7d44] group-hover:text-white mb-6 block">
                schedule
              </span>
              <h3 className="text-2xl font-bold text-[#1c1c1e] group-hover:text-white mb-4">
                Reliability
              </h3>
              <p className="text-[#64748b] group-hover:text-white/80 leading-relaxed">
                We respect your time. When we set an appointment, we show up&mdash;equipped and
                ready to resolve your issue without delay.
              </p>
            </div>
            <div className="group bg-white p-10 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm hover:bg-[#1a3a6b] transition-all duration-300 cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#3a7d44] group-hover:text-white mb-6 block">
                construction
              </span>
              <h3 className="text-2xl font-bold text-[#1c1c1e] group-hover:text-white mb-4">
                Quality Workmanship
              </h3>
              <p className="text-[#64748b] group-hover:text-white/80 leading-relaxed">
                No shortcuts. Every joint, every valve, and every installation is executed to the
                highest industry standards for lasting peace of mind.
              </p>
            </div>
            <div className="group bg-white p-10 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm hover:bg-[#1a3a6b] transition-all duration-300 cursor-default">
              <span className="material-symbols-outlined text-4xl text-[#3a7d44] group-hover:text-white mb-6 block">
                location_on
              </span>
              <h3 className="text-2xl font-bold text-[#1c1c1e] group-hover:text-white mb-4">
                Local Knowledge
              </h3>
              <p className="text-[#64748b] group-hover:text-white/80 leading-relaxed">
                Deeply rooted in Eastbourne, we understand the specific water pressures and housing
                types unique to East Sussex.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-[#f0f4f8]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="mb-16">
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">Meet The Experts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'David',
                role: 'Founder & Master Plumber',
                bio: '25+ years of experience. David oversees all major projects and maintains our high standards of excellence.',
                img: 'img-008.jpg',
              },
              {
                name: 'Sarah',
                role: 'Office Manager',
                bio: 'The backbone of our operations. Sarah ensures scheduling is seamless and client communication is clear.',
                img: 'img-009.jpg',
              },
              {
                name: 'James',
                role: 'Lead Engineer',
                bio: 'Specializing in complex boiler repairs and heating system design. Our technical lead for field operations.',
                img: 'img-010.jpg',
              },
              {
                name: 'Paul',
                role: 'Junior Plumber',
                bio: 'Bringing fresh energy and modern training to the team. Paul assists on all emergency residential calls.',
                img: 'img-011.jpg',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="relative group overflow-hidden rounded-xl bg-white shadow-sm border border-[rgba(226,232,240,0.6)] h-[400px]"
              >
                <img
                  alt={`${member.name} - ${member.role}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={`/stitch-images/${member.img}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full transform transition-all duration-300">
                  <p className="text-white font-bold text-xl mb-1">{member.name}</p>
                  <p className="text-[#3a7d44] text-sm font-semibold mb-4">{member.role}</p>
                  <div className="max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500 ease-in-out">
                    <p className="text-white/90 text-sm leading-snug">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-24 bg-[#1a3a6b] text-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
                Ready to discuss your project?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                From simple repairs to full system installations, our team is ready to deliver the
                quality you deserve.
              </p>
            </div>
            <div className="shrink-0">
              <a
                className="bg-[#3a7d44] text-white px-10 py-5 rounded-lg font-bold text-lg active:-translate-y-px transition-all duration-150 shadow-lg shadow-black/20 inline-block"
                href="/contact"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a3a6b]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-6 md:px-8 max-w-[1280px] mx-auto">
          <div className="space-y-4">
            <div className="font-bold text-xl text-white">DCS Plumbing</div>
            <p className="leading-relaxed text-slate-300 text-sm">
              Providing professional plumbing services across Eastbourne and East Sussex since 1998.
            </p>
            <div className="text-slate-400 text-sm pt-4">
              &copy; 2024 DCS Plumbing. Eastbourne &amp; East Sussex Professional Plumbing.
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-3">
              <a
                className="text-slate-400 hover:text-[#3a7d44] transition-colors text-sm"
                href="/services"
              >
                Services
              </a>
              <a
                className="text-slate-400 hover:text-[#3a7d44] transition-colors text-sm"
                href="/services"
              >
                Emergency Plumbing
              </a>
              <a
                className="text-slate-400 hover:text-[#3a7d44] transition-colors text-sm"
                href="/services"
              >
                Boiler Repair
              </a>
              <a
                className="text-slate-400 hover:text-[#3a7d44] transition-colors text-sm"
                href="/contact"
              >
                Contact
              </a>
              <a
                className="text-slate-400 hover:text-[#3a7d44] transition-colors text-sm"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Get in Touch
            </h4>
            <div className="space-y-3 text-slate-300 text-sm">
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">call</span>
                0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">schedule</span>
                Mon - Fri: 8am - 6pm
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
