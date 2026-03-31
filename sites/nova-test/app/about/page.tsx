import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b-2 border-zinc-100 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <span className="text-2xl font-black tracking-tighter text-[#E85118]">MAD</span>
            <span className="text-2xl font-black tracking-tighter text-[#5BA829]">GRAPHICS</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-zinc-800 font-medium hover:text-[#E85118] hover:scale-105 transition-transform duration-200">Services</Link>
            <Link href="/about" className="text-[#E85118] font-bold border-b-2 border-[#E85118]">About</Link>
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

      {/* Page Hero */}
      <section className="relative h-[614px] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/stitch-images/img-002.jpg" alt="Mad Graphics workshop" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-[#E85118]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-black text-5xl md:text-7xl mb-6 leading-tight" style={{ fontFamily: 'var(--font-newsreader), serif' }}>About Mad Graphics</h1>
            <p className="text-xl md:text-2xl font-light opacity-90 mb-8 border-l-4 border-[#5BA829] pl-6">
              Polegate&apos;s trusted specialists in high-impact signage and precision print media.
            </p>
            <div className="flex gap-4">
              <Link href="/services" className="bg-[#E85118] text-white px-8 py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all">View Our Work</Link>
              <Link href="/contact" className="bg-[#5BA829] text-white px-8 py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Accreditations Bar */}
      <section className="bg-zinc-100 py-10 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-60">
            {[
              { icon: 'verified', label: 'Industry Certified' },
              { icon: 'palette', label: 'Design Guild' },
              { icon: 'print', label: 'Print Masters' },
              { icon: 'eco', label: 'Eco Material Pro' },
            ].map((item) => (
              <div key={item.label} className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                <span className="font-bold tracking-tighter uppercase text-xl">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[#E85118] font-bold uppercase tracking-widest text-sm">Our Journey</span>
            <h2 className="font-bold text-4xl md:text-5xl leading-tight" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Built on Precision and Passion in Polegate</h2>
            <div className="space-y-4 text-zinc-600 text-lg leading-relaxed">
              <p>Founded on the principle that graphics should be more than just ink on vinyl, Mad Graphics started as a small local workshop with a singular vision: to help businesses stand out through superior craftsmanship.</p>
              <p>Over the years, we&apos;ve grown into Polegate&apos;s leading signage specialists, investing in state-of-the-art technology while maintaining the artisan approach that defines our brand. Every vehicle wrap, building sign, and printed banner that leaves our studio is a testament to our commitment to quality.</p>
            </div>
            <div className="pt-8 border-t border-zinc-100">
              <blockquote className="relative">
                <span className="material-symbols-outlined text-6xl text-[#5BA829]/20 absolute -top-8 -left-4">format_quote</span>
                <p className="italic text-2xl text-[#1a1a1a] leading-snug" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
                  &ldquo;We don&apos;t just print graphics; we create visual identities that command attention. If it doesn&apos;t make your brand stand out, we aren&apos;t done yet.&rdquo;
                </p>
                <cite className="block mt-4 not-italic font-bold text-[#E85118]">&mdash; Founder &amp; Lead Designer</cite>
              </blockquote>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
              <Image src="/stitch-images/img-003.jpg" alt="Designer applying vinyl graphics" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-[#5BA829] text-white p-8 rounded-lg shadow-xl hidden lg:block">
              <div className="text-4xl font-black">15+</div>
              <div className="text-sm font-bold uppercase tracking-wider">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-bold text-4xl mb-4" style={{ fontFamily: 'var(--font-newsreader), serif' }}>The Values That Drive Us</h2>
            <p className="text-zinc-500">Every project we undertake is guided by a core set of principles that ensure we deliver nothing but the best for our clients.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quality Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl hover:bg-[#E85118]/5 transition-all group border-b-4 border-transparent hover:border-[#E85118]">
              <div className="w-16 h-16 bg-[#E85118]/10 text-[#E85118] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>high_quality</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Uncompromising Quality</h3>
              <p className="text-zinc-600">We use only premium materials and the latest print technology to ensure your brand looks sharp and lasts longer.</p>
            </div>
            {/* Creativity Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl hover:bg-[#5BA829]/5 transition-all group border-b-4 border-transparent hover:border-[#5BA829]">
              <div className="w-16 h-16 bg-[#5BA829]/10 text-[#5BA829] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Bold Creativity</h3>
              <p className="text-zinc-600">Our design team pushes boundaries to create visual solutions that are unique, energetic, and high-impact.</p>
            </div>
            {/* Reliability Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl hover:bg-zinc-800/5 transition-all group border-b-4 border-transparent hover:border-zinc-800">
              <div className="w-16 h-16 bg-zinc-100 text-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Trusted Reliability</h3>
              <p className="text-zinc-600">Deadlines matter. We take pride in our punctuality and transparent communication throughout every project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#5BA829] font-bold uppercase tracking-widest text-sm">Meet the Makers</span>
            <h2 className="font-bold text-4xl md:text-5xl mt-2" style={{ fontFamily: 'var(--font-newsreader), serif' }}>The Minds Behind the Graphics</h2>
          </div>
          <p className="text-zinc-500 max-w-sm">A collective of designers, installers, and print masters dedicated to your brand.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { img: 'img-003.jpg', name: 'Mark Andrews', role: 'Founder & Lead Designer', color: 'bg-[#E85118]/80', bio: 'Over 12 years in large-format printing. Expert in vehicle wrapping and structural signage design.' },
            { img: 'img-005.jpg', name: 'Sarah Jenkins', role: 'Production Manager', color: 'bg-[#5BA829]/80', bio: 'Manages all print workflows with surgical precision. Ensuring every color is perfect and every cut is clean.' },
            { img: 'img-008.jpg', name: 'David Chen', role: 'Creative Specialist', color: 'bg-zinc-900/80', bio: "Specializes in bold branding and digital layouts. Bringing the 'Mad' energy to every visual concept." },
            { img: 'img-011.jpg', name: 'Tom Harris', role: 'Installation Lead', color: 'bg-[#E85118]/80', bio: 'The hands-on expert for on-site installations. From high-rise signage to intricate wall vinyls.' },
          ].map((member) => (
            <div key={member.name} className="group relative overflow-hidden rounded-xl bg-zinc-100 aspect-[3/4]">
              <Image src={`/stitch-images/${member.img}`} alt={member.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className={`absolute inset-0 ${member.color} flex flex-col justify-center p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}>
                <p className="text-white text-sm leading-relaxed">{member.bio}</p>
              </div>
              <div className="absolute bottom-0 left-0 p-6 text-white group-hover:opacity-0 transition-opacity">
                <h4 className="font-bold text-xl">{member.name}</h4>
                <p className="text-sm opacity-80 uppercase tracking-wider font-semibold">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#E85118] py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="font-black text-4xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-newsreader), serif' }}>Ready to Work With Us?</h2>
              <p className="text-xl opacity-90">Let&apos;s transform your brand with graphics that demand attention. Our team in Polegate is ready to bring your vision to life.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link href="/contact" className="bg-white text-[#E85118] px-10 py-5 rounded-lg font-bold text-xl hover:bg-[#5BA829] hover:text-white transition-all shadow-xl text-center">Get a Free Quote</Link>
              <Link href="/services" className="bg-[#1a1a1a] text-white px-10 py-5 rounded-lg font-bold text-xl hover:opacity-90 transition-all shadow-xl text-center">Our Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-800">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-xl font-black uppercase"><span className="text-[#5BA829]">MAD</span> <span className="text-[#E85118]">GRAPHICS</span></div>
          <p className="text-zinc-400 text-sm text-center md:text-left">&copy; 2024 Mad Graphics. Polegate, East Sussex. Making Your Brand Stand Out.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/services" className="text-zinc-400 hover:text-[#5BA829] transition-colors text-sm">Design</Link>
          <Link href="/services" className="text-zinc-400 hover:text-[#5BA829] transition-colors text-sm">Print</Link>
          <Link href="/services" className="text-zinc-400 hover:text-[#5BA829] transition-colors text-sm">Signage</Link>
          <Link href="/services/vehicle-graphics" className="text-zinc-400 hover:text-[#5BA829] transition-colors text-sm">Vehicle Graphics</Link>
        </div>
        <div className="flex gap-4">
          <span className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-[#E85118] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">share</span>
          </span>
          <span className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-[#5BA829] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">mail</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
