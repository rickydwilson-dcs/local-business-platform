import type { Metadata } from 'next';
import Link from 'next/link';
import { Schema } from '@platform/core-components';
import { FuelSavingsCalculator } from '@/components/fuel-savings-calculator';
import { CarRemapsReadyReckoner } from '@/components/car-remaps-ready-reckoner';
import { FaqAccordion } from '@/components/faq-accordion';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';

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
  { image: 'dch-automotive/viezu/seal-money-back.jpg', label: '30-Day Money-Back Guarantee' },
  { image: 'dch-automotive/viezu/seal-insurance-backed.jpg', label: 'Insurance-Backed Guarantee' },
  { image: 'dch-automotive/viezu/seal-approved-dealer.jpg', label: 'Viezu Approved Dealer' },
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

const HOW_IT_WORKS_STEPS = [
  {
    icon: 'memory',
    title: 'Your ECU, Explained',
    description:
      'Every modern vehicle runs on an Engine Control Unit (ECU) — an onboard computer that decides fuelling, boost pressure, ignition timing and gearbox behaviour thousands of times a second. Manufacturers set these parameters conservatively from the factory, to suit every climate, fuel grade and driving style a vehicle might face worldwide.',
  },
  {
    icon: 'tune',
    title: 'What Remapping Actually Changes',
    description:
      "Remapping connects genuine Viezu KESS3 hardware to your vehicle's OBD port and rewrites those factory parameters with a tune calibrated to your specific vehicle, mileage and condition. No physical parts are removed or fitted for a standard remap — it's a software recalibration, not a hardware modification.",
  },
  {
    icon: 'verified',
    title: 'Matched, Not Generic',
    description:
      "We don't load an off-the-shelf file. Every tune is built around your vehicle's exact engine code, current condition and your stated goals — fuel economy for a fleet van and outright drivability for an individual customer are two different calibrations, not the same map with a different label.",
  },
];

const BENEFITS = [
  {
    icon: 'local_gas_station',
    title: 'Fuel Economy',
    description:
      'Economy Tuning (BlueOptimize) is calibrated specifically to reduce fuel consumption and CO2 across a duty cycle, rather than chasing peak power — the default choice for fleets where fuel is the largest running cost.',
  },
  {
    icon: 'speed',
    title: 'Throttle Response & Drivability',
    description:
      'Performance Tuning sharpens throttle response and smooths the power delivery through the rev range, so the vehicle feels less hesitant and more predictable to drive — particularly noticeable pulling away and overtaking.',
  },
  {
    icon: 'trending_up',
    title: 'Torque for Towing & Loading',
    description:
      'A broader, earlier torque curve makes a real difference to vehicles that regularly tow, carry loads or run at GVW — less strain on the engine and gearbox to do the same job, which fleet operators feel in wear as much as in performance.',
  },
  {
    icon: 'settings_suggest',
    title: 'Smoother Gear Changes',
    description:
      'Gearbox Tuning recalibrates shift points and clutch behaviour on automatic and DSG-equipped vehicles, for faster, smoother changes rather than working purely on engine parameters.',
  },
];

const CAR_REMAPS_FAQS = [
  {
    question: 'What is ECU remapping?',
    answer:
      "ECU remapping is the process of rewriting the software parameters your vehicle's Engine Control Unit uses to manage fuelling, boost, ignition timing and (where applicable) gearbox behaviour. It's a recalibration of the factory settings for your specific vehicle and goals, not a physical or hardware modification.",
  },
  {
    question: 'How does DCH Automotive carry out a remap?',
    answer:
      "We connect genuine Viezu KESS3 tuning hardware to your vehicle's OBD port and upload a tune built around your vehicle's engine code, mileage and condition. There's no need to remove any components for a standard remap — most vehicles are done within a few hours, either at your workshop, on-site, or during scheduled downtime for fleets.",
  },
  {
    question: 'Is ECU remapping legal in the UK?',
    answer:
      "Remapping itself isn't illegal, but the vehicle must still meet MOT emissions requirements and remain roadworthy afterwards — which is exactly why we map to your vehicle rather than loading a generic file. You are responsible for informing your insurer of any performance modification, including a remap.",
  },
  {
    question: 'Will remapping affect my car insurance?',
    answer:
      "Almost certainly yes, and you should declare it. Most UK insurers treat an ECU remap as a modification that must be disclosed, and failing to do so can invalidate a claim. Some insurers charge a modest additional premium; others don't, but it varies by provider — check with yours before or shortly after your remap.",
  },
  {
    question: 'Will a remap void my manufacturer warranty?',
    answer:
      "This depends on your manufacturer and the specific fault — under UK consumer law a manufacturer generally can't refuse an entire warranty claim unless they can show the remap directly caused that fault. That said, some manufacturers take a stricter line on drivetrain and emissions components. If your vehicle is still under warranty, it's worth checking with your dealer before proceeding.",
  },
  {
    question: 'Is a remap reversible?',
    answer:
      'Yes — every remap we carry out is fully reversible and logged. We keep strict software version records for your maintenance history, so the original factory map can be restored at any time, for example ahead of a warranty visit or a vehicle sale.',
  },
  {
    question: "What's the difference between Economy Tuning and Performance Tuning?",
    answer:
      "Economy Tuning (Viezu's BlueOptimize program) is calibrated to reduce fuel consumption and CO2 without chasing peak power — it's our default recommendation for fleet and commercial vehicles, where running cost matters more than outright pace. Performance Tuning is calibrated the other way: for individual customers who want sharper throttle response and more usable power and torque, matched to their specific vehicle rather than a generic file.",
  },
  {
    question: "What's the difference between Stage 1, 2 and 3 remaps?",
    answer:
      "Stage 1 uses your vehicle's existing hardware — standard turbo, injectors and intercooler — and is the safest, most common and fully reversible starting point. Stage 2 is for vehicles that already have supporting hardware upgrades fitted, with a more aggressive tune matched to those changes. Stage 3 is our most advanced tier, built around vehicles with major supporting hardware changes and bespoke to that specific setup.",
  },
  {
    question: 'Can any vehicle be remapped?',
    answer:
      "Most modern petrol and diesel vehicles with an ECU can be remapped, including cars, vans, HGVs and plant machinery. Some very new models or unusual engine codes may have limited support on the tuning platform at any given time — the vehicle finder tool further down this page, provided directly by Viezu, will confirm what's currently available for your specific vehicle.",
  },
  {
    question: 'Will remapping damage my engine?',
    answer:
      "Not when it's done properly and matched to your vehicle's condition — which is the entire reason we map individually rather than loading a generic file. A poorly calibrated or overly aggressive generic remap can put unnecessary strain on an engine; a correctly calibrated one, backed by Viezu's guarantees, should not.",
  },
  {
    question: 'Does remapping affect emissions or MOT compliance?',
    answer:
      "Your vehicle still has to pass its MOT emissions test after a remap — we calibrate within that requirement rather than around it. This is a key part of why we don't use generic off-the-shelf files: a tune matched to your specific vehicle can be built to stay compliant, where a one-size-fits-all map risks pushing emissions outside the legal limit.",
  },
  {
    question: 'What guarantees come with a DCH Automotive remap?',
    answer:
      "Every remap is backed by Viezu's 30-day money-back guarantee and insurance-backed guarantee, as a Viezu Approved Dealer — see the guarantee badges further up this page. Combined with our full reversibility and software version logging, you're not committing to anything permanent.",
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

export default async function CarRemapsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[calc(85vh-5rem)] min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
          <img
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            alt=""
            aria-hidden="true"
            src={getImageUrl('dch-automotive/stitch-images/img-008.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-background via-surface-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-brand-primary font-heading font-bold uppercase tracking-[0.2em] mb-4 block">
              ECU Remapping — Viezu Approved Dealer
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-tight mb-6">
              ECU Remapping That <br />
              <span className="text-brand-primary">Pays For Itself.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl font-sans leading-relaxed mb-10">
              Professional fleet efficiency solutions for commercial vehicle operators. Reduce fuel
              costs, lower emissions, and optimize your fleet&apos;s performance without the
              enthusiast fluff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#fleet-enquiry"
                className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary font-heading font-bold uppercase tracking-tight px-10 py-5 transition-all active:scale-95"
              >
                Request a Fleet Assessment
              </a>
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
            src={getImageUrl('dch-automotive/viezu/powered-by-viezu-white.png')}
            alt="Powered by Viezu Performance Tuning"
            className="h-8 w-auto opacity-90"
          />
          <span className="text-white/30">|</span>
          <span className="text-white/70 font-heading uppercase tracking-widest text-sm">
            Genuine Viezu KESS3 tuning hardware
          </span>
        </div>
      </section>

      {/* What Is ECU Remapping? */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
            What Is <span className="text-brand-primary">ECU Remapping?</span>
          </h2>
          <p className="text-white/60 font-sans">
            A quick explainer before you look at the service tiers below — remapping is software,
            not hardware, and it's calibrated to your specific vehicle, not loaded from a generic
            file.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.title} className="bg-surface-card border border-surface-card-border p-8">
              <span className="material-symbols-outlined text-brand-primary text-3xl mb-4 block">
                {step.icon}
              </span>
              <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[#11100D] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
              What Benefits Can Be <span className="text-brand-primary">Gained?</span>
            </h2>
            <p className="text-white/60 font-sans">
              Which of these matters most depends on the tier — Economy Tuning and Performance
              Tuning are calibrated toward different ends of this list, not all of it at once.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 bg-surface-card border border-surface-card-border p-6"
              >
                <span className="material-symbols-outlined text-brand-primary text-2xl flex-shrink-0">
                  {benefit.icon}
                </span>
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-tight mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
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
                    src={getImageUrl(g.image)}
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
                src={getImageUrl('dch-automotive/viezu/kess3-tool.jpg')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Car Remaps Ready Reckoner — DCH-owned interactive vehicle finder over our synced catalogue */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-4">
            Check What&apos;s Available for Your Vehicle
          </h2>
          <p className="text-white/60 font-sans">
            Select your make, model, fuel type and variant below to see performance figures and
            Economy Tuning gains for your exact vehicle.
          </p>
        </div>
        <CarRemapsReadyReckoner />
        <p className="text-center mt-10">
          <Link
            href="/car-remaps/by-make"
            className="inline-flex items-center justify-center border border-white/20 hover:bg-white/10 text-white font-heading font-bold uppercase tracking-tight px-8 py-4 transition-all"
          >
            Remap Services by Make
          </Link>
        </p>
      </section>

      {/* Fleet Enquiry Form (static — see note in car-remaps-stitch conversion) */}
      <section id="fleet-enquiry" className="py-24">
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

      {/* FAQs */}
      <FaqAccordion items={CAR_REMAPS_FAQS} title="Car Remaps Frequently Asked Questions" />

      {/* Developer Integration — MCP Endpoint */}
      <section className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6">
          <p className="text-xs text-white/40 font-sans leading-relaxed max-w-2xl">
            <span className="font-heading font-bold uppercase tracking-widest text-white/50 block mb-2">
              For Developers
            </span>
            The car remaps catalogue is available via Model Context Protocol (MCP) at{' '}
            <code className="bg-surface-card/50 px-1.5 py-0.5 rounded text-[0.85em] text-white/70 font-mono">
              /api/mcp
            </code>
            — agents and MCP clients can query the{' '}
            <code className="bg-surface-card/50 px-1.5 py-0.5 rounded text-[0.85em] text-white/70 font-mono">
              lookup_vehicle_tuning
            </code>
            tool to retrieve performance specs and pricing programmatically.
          </p>
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

      {/* Schema Markup */}
      <Schema
        org={{
          name: 'DCH Automotive',
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Car Remaps', url: '/car-remaps' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/car-remaps#webpage'),
          url: absUrl('/car-remaps'),
          name: 'Car Remaps | DCH Automotive — Viezu Approved Dealer',
          description:
            "ECU remapping fitted by DCH Automotive, a Viezu Approved Dealer — Stage 1-3, Economy Tuning, Performance Tuning and Gearbox Tuning, backed by Viezu's money-back and insurance-backed guarantees.",
        }}
        faqs={CAR_REMAPS_FAQS}
      />
    </>
  );
}
