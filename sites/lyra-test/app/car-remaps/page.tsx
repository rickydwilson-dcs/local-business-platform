import type { Metadata } from 'next';
import { FuelSavingsCalculator } from '@/components/fuel-savings-calculator';

export const metadata: Metadata = {
  title: 'Car Remaps | DCH Automotive — Professional Fleet Solutions',
  description:
    "Professional fleet efficiency solutions for commercial vehicle operators. Reduce fuel costs, lower emissions, and optimize your fleet's performance without the enthusiast fluff.",
};

const NAV_LINKS = [
  { label: 'Services', href: '/' },
  { label: 'Fleet Solutions', href: '/' },
  { label: 'Car Remaps', href: '/car-remaps', active: true },
  { label: 'Contact', href: '/' },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Free Fleet Assessment',
    description:
      'We analyze your vehicle data, usage patterns, and efficiency goals to provide a detailed ROI projection for your specific fleet configuration.',
  },
  {
    number: '02',
    title: 'Scheduled Remapping',
    description:
      'Our IMI-certified technicians perform installs at your workshop or mobile on-site. We work during vehicle downtime to ensure no operational disruption.',
  },
  {
    number: '03',
    title: 'Measured Results Review',
    description:
      'After implementation, we provide a performance review to track real-world fuel savings and ensure your vehicles are operating at peak efficiency.',
  },
];

const NOT_A_PERFORMANCE_SHOP = [
  {
    title: 'Fleet & Commercial Only',
    description:
      'We specialize exclusively in LCVs, HGVs, and plant machinery. Our focus is longevity and cost-saving.',
  },
  {
    title: 'No Cosmetic or Track Packages',
    description:
      'We do not offer "pops and bangs," Stage 3 tuning, or aesthetic modifications. Technical efficiency is our only metric.',
  },
  {
    title: 'Reversible and Logged',
    description:
      'Every remap is fully reversible and documented. We maintain strict software version control for your maintenance logs.',
  },
  {
    title: 'Fitted Around Your Operation',
    description:
      'Out-of-hours service is standard. We minimize your key-to-key downtime through specialized batch-processing.',
  },
];

const CERTIFICATIONS = [
  'THATCHAM APPROVED',
  'City & Guilds',
  'IMI Certified',
  'Autowatch',
  'Smartrack',
];

export default function CarRemapsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-full bg-surface-background border-b border-surface-card-border">
        <div className="text-xl font-heading font-black text-white uppercase tracking-tight">
          DCH Automotive
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? 'text-brand-primary font-bold border-b-2 border-brand-primary pb-1 font-heading uppercase tracking-tight'
                  : 'text-white/80 font-medium hover:text-white transition-colors font-heading uppercase tracking-tight'
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button className="bg-brand-primary text-brand-on-primary px-6 py-2 text-sm font-heading font-bold uppercase tracking-tight transition-transform active:scale-95">
          Get a Quote
        </button>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
            <img
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              alt=""
              aria-hidden="true"
              src="/stitch-images/img-008.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-background via-surface-background/80 to-transparent" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <span className="text-brand-primary font-heading font-bold uppercase tracking-[0.2em] mb-4 block">
                Fleet Efficiency Programs
              </span>
              <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tight leading-[0.95] mb-6">
                ECU Remapping That <br />
                <span className="text-brand-primary">Pays For Itself.</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl font-sans leading-relaxed mb-10">
                Professional fleet efficiency solutions for commercial vehicle operators. Reduce
                fuel costs, lower emissions, and optimize your fleet&apos;s performance without the
                enthusiast fluff.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary font-heading font-bold uppercase tracking-tight px-10 py-5 transition-all active:scale-95">
                  Request a Fleet Assessment
                </button>
                <button className="border border-white/20 hover:bg-white/10 text-white font-heading font-bold uppercase tracking-tight px-10 py-5 transition-all">
                  View Case Studies
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Fuel Savings Calculator */}
        <section className="py-24 bg-surface-background relative">
          <div className="container mx-auto px-6">
            <FuelSavingsCalculator />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
                A Zero-Friction Process
              </h2>
              <p className="text-white/60 font-sans">
                We integrate with your fleet schedule to ensure maximum uptime while delivering
                performance enhancements.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="group">
                  <div className="text-6xl font-heading font-black text-white/10 group-hover:text-brand-primary transition-colors mb-6">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-heading font-bold uppercase tracking-tight mb-4">
                    {step.title}
                  </h4>
                  <p className="text-white/60 font-sans leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Band — "Not a performance shop" */}
        <section className="py-24 bg-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-8">
                  This Isn&apos;t a <span className="text-brand-primary">Performance Shop.</span>
                </h2>
                <div className="space-y-8">
                  {NOT_A_PERFORMANCE_SHOP.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-brand-primary mt-1">
                        check_circle
                      </span>
                      <div>
                        <h5 className="font-heading font-bold uppercase tracking-tight text-lg mb-1">
                          {item.title}
                        </h5>
                        <p className="text-white/60 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 w-full aspect-video bg-surface-background border border-white/10 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                <img
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt="A technician's hand connecting a diagnostic laptop to a commercial van's OBD-II port"
                  src="/stitch-images/img-001.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Enquiry Form (static — see note in car-remaps-stitch conversion) */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="bg-surface-card/20 border border-white/10 p-8 md:p-16 max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-16">
                <div className="lg:col-span-2">
                  <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-6">
                    Fleet Enquiry
                  </h2>
                  <p className="text-white/60 mb-8 font-sans">
                    Speak with a specialist about your fleet size and efficiency goals. We usually
                    provide initial estimates within 24 hours.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-brand-primary">
                      <span className="material-symbols-outlined">call</span>
                      <span className="font-heading font-bold">07506 016106</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/70">
                      <span className="material-symbols-outlined">verified</span>
                      <span className="text-xs uppercase tracking-widest font-heading">
                        Thatcham &amp; Autowatch Approved
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  {/* Static layout reference — not wired to a backend yet */}
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label
                          className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white/40"
                          htmlFor="vehicleType"
                        >
                          Vehicle Type
                        </label>
                        <select
                          id="vehicleType"
                          className="w-full bg-surface-background/50 border border-white/10 px-4 py-3 text-white font-sans focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        >
                          <option>Light Commercial (Vans)</option>
                          <option>Heavy Goods (Trucks)</option>
                          <option>Plant &amp; Machinery</option>
                          <option>Mixed Fleet</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white/40"
                          htmlFor="fleetSizeField"
                        >
                          Fleet Size
                        </label>
                        <input
                          id="fleetSizeField"
                          type="text"
                          placeholder="e.g. 15 vehicles"
                          className="w-full bg-surface-background/50 border border-white/10 px-4 py-3 text-white font-sans focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white/40">
                        Interest
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Efficiency', 'Power', 'Both'].map((option) => (
                          <label
                            key={option}
                            className="flex items-center justify-center p-3 border border-white/10 bg-surface-background/50 text-xs font-heading font-bold uppercase cursor-pointer hover:bg-brand-primary/10 transition-colors"
                          >
                            <input className="hidden" name="interest" type="radio" value={option} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label
                          className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white/40"
                          htmlFor="fullName"
                        >
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          className="w-full bg-surface-background/50 border border-white/10 px-4 py-3 text-white font-sans focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white/40"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          className="w-full bg-surface-background/50 border border-white/10 px-4 py-3 text-white font-sans focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-primary text-brand-on-primary font-heading font-bold uppercase tracking-widest py-4 hover:bg-brand-primary-hover transition-all active:scale-[0.98]"
                    >
                      Submit Request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-12 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="container mx-auto px-6 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-black tracking-widest border-2 border-white px-2 py-1 uppercase"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-start gap-8 bg-surface-background border-t border-surface-card-border">
        <div className="max-w-md">
          <div className="text-lg font-heading font-bold text-white mb-4 uppercase tracking-tight">
            DCH Automotive
          </div>
          <p className="font-sans text-sm text-white/60 leading-relaxed mb-6">
            © 2026 DCH Automotive. Vehicle security and fleet electrics, done properly. Serving the
            South East of England with industry-leading diagnostic and security solutions.
          </p>
          <div className="flex gap-4">
            <a className="text-white/60 hover:text-brand-primary transition-colors" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a className="text-white/60 hover:text-brand-primary transition-colors" href="#">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="space-y-3">
            <h6 className="text-xs font-heading font-bold uppercase tracking-widest text-brand-primary">
              Services
            </h6>
            <nav className="flex flex-col gap-2">
              <a
                className="text-white/60 hover:text-brand-primary text-sm hover:underline"
                href="/"
              >
                Services
              </a>
              <a
                className="text-white/60 hover:text-brand-primary text-sm hover:underline"
                href="/"
              >
                Fleet Solutions
              </a>
              <a
                className="text-white/60 hover:text-brand-primary text-sm hover:underline"
                href="/car-remaps"
              >
                Car Remaps
              </a>
            </nav>
          </div>
          <div className="space-y-3">
            <h6 className="text-xs font-heading font-bold uppercase tracking-widest text-brand-primary">
              Legal
            </h6>
            <nav className="flex flex-col gap-2">
              <a
                className="text-white/60 hover:text-brand-primary text-sm hover:underline"
                href="/"
              >
                Privacy Policy
              </a>
              <a
                className="text-white/60 hover:text-brand-primary text-sm hover:underline"
                href="/"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
