import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DCH Automotive | Vehicle Security & Fleet Electrics',
  description:
    'Professional vehicle security, fleet electrics, and ECU remapping installer serving the South East. Thatcham and IMI certified expertise.',
};

const CREDENTIALS = [
  { label: 'Certified', value: 'City & Guilds' },
  { label: 'Accredited', value: 'IMI Approved' },
  { label: 'Security', value: 'Thatcham' },
  { label: 'Installer', value: 'Autowatch' },
  { label: 'Tracking', value: 'Smartrack' },
  { label: 'Dash Cams', value: 'Thinkware' },
];

const SERVICES = [
  {
    title: 'Vehicle Security',
    description:
      'Insurance approved trackers and Autowatch Ghost 2 immobilisers, fitted to Thatcham standards.',
    icon: 'security',
    image: '/stitch-images/img-006.jpg',
    href: '/services/vehicle-security',
  },
  {
    title: 'Bike Security',
    description:
      'Specialist tracking and anti-theft solutions specifically designed for motorcycles.',
    icon: 'motorcycle',
    image: '/stitch-images/img-003.jpg',
    href: '/services/vehicle-security',
  },
  {
    title: 'Parking Aids',
    description: 'Flush-fit parking sensors and high-definition reverse camera systems.',
    icon: 'settings_input_component',
    image: '/stitch-images/img-010.jpg',
    href: '/services/parking-aids',
  },
  {
    title: 'Fleet Solutions',
    description:
      'Mass-deployment of tracking, telematics, and security for commercial vehicle fleets.',
    icon: 'local_shipping',
    image: '/stitch-images/img-005.jpg',
    href: '/services/fleet-solutions',
  },
  {
    title: 'Accessories',
    description: 'Dash cams, beacon bars, work lights, and bespoke electrical modifications.',
    icon: 'construction',
    image: '/stitch-images/img-009.jpg',
    href: '/services/accessories',
  },
];

const TESTIMONIALS = [
  {
    quote:
      '"DCH Automotive fitted trackers to our entire 20-van fleet. The attention to detail and technical knowledge is second to none. They even fixed wiring issues from a previous installer."',
    initials: 'MS',
    name: 'Mark Stevens',
    role: 'Fleet Manager, Southern Logistics — SAMPLE QUOTE, not a real customer',
  },
  {
    quote:
      '"Had an Autowatch Ghost immobiliser and dash cam fitted to my new Defender. The finish is factory-standard. These guys really know their electrics. Wouldn\'t go anywhere else."',
    initials: 'JH',
    name: 'James Harrison',
    role: 'Private Client — SAMPLE QUOTE, not a real customer',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[620px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/stitch-images/img-011.jpg')" }}
            role="img"
            aria-label="A technician wiring a vehicle's dashboard"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-background via-surface-background/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-tight mb-6">
              Vehicle Security <br />
              <span className="text-brand-primary">Done Properly.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 font-light border-l-4 border-brand-primary pl-6">
              Professional vehicle security, fleet electrics, and ECU remapping installer serving
              the South East. Thatcham and IMI certified expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="bg-brand-primary text-brand-on-primary px-6 py-3 font-heading font-bold uppercase tracking-wide hover:bg-brand-primary-hover transition-colors"
              >
                View Services
              </Link>
              <Link
                href="/services/fleet-solutions"
                className="border-2 border-white text-white px-6 py-3 font-heading font-bold uppercase tracking-wide hover:bg-white hover:text-surface-background transition-all"
              >
                Fleet Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#080807] border-y border-white/5 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {CREDENTIALS.map((cred) => (
              <div key={cred.value} className="stamped-plate px-4 py-2 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-1">
                  {cred.label}
                </span>
                <span className="font-heading font-bold text-sm">{cred.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
            Specialist Installations
          </h2>
          <div className="w-20 h-1.5 bg-brand-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all"
            >
              <div className="h-56 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={service.title}
                  src={service.image}
                />
                <div className="absolute top-4 right-4 bg-brand-primary p-2">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {service.icon}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-heading font-bold uppercase mb-2">{service.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Car Remaps teaser */}
      <section className="py-24 bg-[#11100D] relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center bg-brand-primary text-white px-3 py-1 font-heading font-black text-xs uppercase tracking-widest">
                NEW SERVICE
              </span>
              <span className="text-white/50 text-xs font-heading uppercase tracking-widest">
                Viezu Approved Dealer
              </span>
            </div>
            <h2 className="text-5xl font-heading font-black uppercase tracking-tight mb-6">
              Corporate <span className="text-brand-primary">Fleet Remaps</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl">
              Engineered for efficiency. Stage 1-3, Economy Tuning (BlueOptimize), Performance
              Tuning and Gearbox Tuning — fitted on genuine Viezu KESS3 hardware, with fleet fuel
              savings as the headline use case.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Enhanced Fuel Economy for Fleets',
                'Optimized Torque for Towing & Loading',
                'Professional, Non-Intrusive ECU Tuning',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-brand-primary">check_circle</span>
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/car-remaps"
              className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
            >
              Inquire for Fleet
            </a>
          </div>
          <div className="relative">
            <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
              <img
                className="w-full h-full object-cover"
                alt="A diagnostic laptop connected to a commercial van's OBD port showing ECU mapping data"
                src="/stitch-images/img-002.jpg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-brand-primary/20" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
            Trusted by Drivers
          </h2>
          <div className="w-20 h-1.5 bg-brand-primary mx-auto" />
          <p className="text-xs uppercase tracking-widest text-brand-primary mt-4 font-bold">
            Sample layout — real client quotes to be added before launch
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.initials}
              className="bg-surface-card p-10 border-l-4 border-brand-primary relative"
            >
              <span className="material-symbols-outlined absolute top-8 right-8 text-brand-primary/20 text-6xl">
                format_quote
              </span>
              <p className="text-xl italic font-light text-white/90 mb-6 leading-relaxed">
                {t.quote}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-heading font-bold text-brand-primary">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold uppercase text-sm tracking-widest">{t.name}</p>
                  <p className="text-xs text-white/40 uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 z-0" />
        <div className="absolute left-0 top-0 w-2 h-full bg-brand-primary" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
              Secure your vehicle today
            </h2>
            <p className="text-xl text-white/60">
              Based in Polegate, serving the entire South East of England.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <a
              className="text-3xl font-heading font-black text-brand-primary mb-4 hover:brightness-125 transition-all"
              href="tel:07506016106"
            >
              07506 016106
            </a>
            <Link
              href="/contact"
              className="bg-brand-primary text-brand-on-primary px-10 py-5 font-heading font-black uppercase tracking-widest shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              Request a Callback
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
