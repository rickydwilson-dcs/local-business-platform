import type { Metadata } from 'next';
import { FuelSavingsCalculator } from '@/components/fuel-savings-calculator';

export const metadata: Metadata = {
  title: 'Car Remaps | DCH Automotive — Viezu Approved Dealer',
  description:
    "ECU remapping fitted by DCH Automotive, a Viezu Approved Dealer — Stage 1-3, Economy Tuning, Performance Tuning and Gearbox Tuning, backed by Viezu's money-back and insurance-backed guarantees.",
};

const REMAP_SERVICES = [
  {
    title: 'Economy Tuning',
    brand: 'BlueOptimize',
    description:
      "Viezu's dedicated fuel-efficiency program — remapped to reduce fuel consumption and CO2 without chasing peak power. The default choice for fleet and commercial vehicles.",
    icon: 'eco',
    highlight: true,
  },
  {
    title: 'Gearbox Tuning',
    description:
      'ECU-based transmission remapping for smoother, faster gear changes and improved responsiveness — particularly effective on automatic and DSG-equipped vans and cars.',
    icon: 'settings_suggest',
  },
  {
    title: 'Stage 1 Remap',
    description:
      "The foundational remap, using the vehicle's existing hardware — turbo, injectors, intercooler all standard. Safe, fully reversible, and the most common starting point.",
    icon: 'looks_one',
  },
  {
    title: 'Stage 2 Remap',
    description:
      'For vehicles with supporting hardware upgrades already fitted — a more aggressive tune matched to those modifications.',
    icon: 'looks_two',
  },
  {
    title: 'Stage 3 Remap',
    description:
      'Our most advanced tier, for vehicles with major supporting hardware changes. Bespoke mapping built around your specific setup.',
    icon: 'looks_3',
  },
  {
    title: 'Performance Tuning',
    description:
      'Power and torque focused remapping for improved throttle response and drivability — scoped and mapped to your vehicle, not a generic file.',
    icon: 'speed',
  },
];

const GUARANTEES = [
  { image: '/viezu/seal-money-back.jpg', label: '30-Day Money-Back Guarantee' },
  { image: '/viezu/seal-insurance-backed.jpg', label: 'Insurance-Backed Guarantee' },
  { image: '/viezu/seal-approved-dealer.jpg', label: 'Viezu Approved Dealer' },
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
      'Our IMI-certified technicians perform installs at your workshop or mobile on-site, using Viezu KESS3 hardware. We work during vehicle downtime to ensure no operational disruption.',
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
    title: 'Fleet & Commercial Priority',
    description:
      'Our fleet work covers LCVs, HGVs, and plant machinery, prioritising longevity and cost-saving over outright power.',
  },
  {
    title: 'No Cosmetic Modifications',
    description:
      'We do not offer "pops and bangs" or aesthetic modifications. Every remap is a genuine technical tune, matched to your vehicle and your goals.',
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
  'Viezu Approved Dealer',
];

export default function CarRemapsPage() {
  return (
    <>
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
              ECU Remapping — Viezu Approved Dealer
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tight leading-[0.95] mb-6">
              ECU Remapping That <br />
              <span className="text-brand-primary">Pays For Itself.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl font-sans leading-relaxed mb-10">
              Professional fleet efficiency solutions for commercial vehicle operators. Reduce fuel
              costs, lower emissions, and optimize your fleet&apos;s performance without the
              enthusiast fluff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary font-heading font-bold uppercase tracking-tight px-10 py-5 transition-all active:scale-95">
                Request a Fleet Assessment
              </button>
              <a
                href="#services"
                className="inline-flex items-center justify-center border border-white/20 hover:bg-white/10 text-white font-heading font-bold uppercase tracking-tight px-10 py-5 transition-all"
              >
                View Remap Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Viezu trust strip */}
      <section className="bg-[#080807] border-y border-white/5 py-6">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- third-party supplier logo, not next/image */}
          <img
            src="/viezu/powered-by-viezu-white.png"
            alt="Powered by Viezu Performance Tuning"
            className="h-8 w-auto opacity-90"
          />
          <span className="text-white/30">|</span>
          <span className="text-white/70 font-heading uppercase tracking-widest text-sm">
            Genuine Viezu KESS3 tuning hardware
          </span>
        </div>
      </section>

      {/* Remap Services */}
      <section id="services" className="py-24 container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
            Our Remap Services
          </h2>
          <p className="text-white/60 font-sans">
            Every tune is built on Viezu&apos;s KESS3 platform and custom-mapped to your
            vehicle&apos;s age, mileage and condition — not a generic off-the-shelf file.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REMAP_SERVICES.map((service) => (
            <div
              key={service.title}
              className={
                service.highlight
                  ? 'bg-surface-card border-2 border-brand-primary p-6 relative'
                  : 'bg-surface-card border border-surface-card-border p-6'
              }
            >
              {service.highlight && (
                <span className="absolute -top-3 left-6 bg-brand-primary text-brand-on-primary text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1">
                  Recommended for Fleets
                </span>
              )}
              <span className="material-symbols-outlined text-brand-primary text-3xl mb-4 block">
                {service.icon}
              </span>
              <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-1">
                {service.title}
              </h3>
              {service.brand && (
                <p className="text-xs text-brand-primary font-heading uppercase tracking-widest mb-2">
                  {service.brand}
                </p>
              )}
              <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee badges */}
      <section className="py-16 bg-[#11100D] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {GUARANTEES.map((g) => (
              <div key={g.label} className="flex flex-col items-center gap-3 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- third-party guarantee seal, not next/image */}
                  <img
                    src={g.image}
                    alt={g.label}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-xs font-heading font-bold uppercase tracking-widest text-white/70 max-w-[10rem]">
                  {g.label}
                </span>
              </div>
            ))}
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
            <div className="lg:w-1/2 w-full aspect-video bg-surface-background border border-white/10 overflow-hidden group flex items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- real Viezu KESS3 product photo, not next/image */}
              <img
                className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="The Viezu KESS3 ECU tuning tool used for every remap"
                src="/viezu/kess3-tool.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Viezu vehicle-selector widget */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
            Check What&apos;s Available for Your Vehicle
          </h2>
          <p className="text-white/60 font-sans">
            Select your vehicle below — powered directly by Viezu, our tuning technology partner.
          </p>
        </div>
        <div className="max-w-4xl mx-auto border-2 border-surface-card-border overflow-hidden bg-white">
          <iframe
            src="https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace"
            title="Viezu vehicle tuning finder for DCH Automotive"
            className="w-full h-[950px] md:h-[1050px] block"
            loading="lazy"
          />
        </div>
        <p className="text-center text-xs text-white/40 mt-4 font-sans">
          This tool is provided directly by Viezu Technologies and opens results within this page.
        </p>
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
    </>
  );
}
