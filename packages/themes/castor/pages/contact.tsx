import type { ContactPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

interface CastorContactPageProps extends ContactPageTemplateProps {
  /** Opening hours lines */
  openingHours?: Array<{ day: string; hours: string }>;
  /** Trust stats shown below the form */
  trustStats?: Array<{ value: string; label: string }>;
}

export function CastorContactPage({
  siteConfig,
  openingHours,
  trustStats,
}: CastorContactPageProps) {
  const defaultHours = [
    { day: "Mon-Fri", hours: "8am-6pm" },
    { day: "Sat", hours: "9am-1pm" },
    { day: "Sunday", hours: "Closed" },
  ];

  const defaultStats = [
    { value: "15+", label: "Years experience" },
    { value: "24/7", label: "Emergency callout" },
    { value: "500+", label: "Happy clients" },
    { value: "100%", label: "Guaranteed work" },
  ];

  const hours = openingHours ?? defaultHours;
  const stats = trustStats ?? defaultStats;

  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-[409px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: wire to heroImage prop or R2 asset */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-contact.jpg')",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(26,58,107,0.75)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
          <h1 className="font-headline text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
            Get in touch
          </h1>
          <p className="text-white/80 font-body max-w-[500px] text-lg leading-relaxed">
            Professional services across {siteConfig.address.city}
            {siteConfig.address.county ? ` and ${siteConfig.address.county}` : ""}. We&apos;re here
            to help with emergencies, maintenance, and new installations.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
              Send us a message
            </h2>
            <p className="font-body text-surface-muted-foreground mb-10 max-w-[65ch]">
              Complete the form below and one of our team will get back to you shortly. For
              emergencies, please call us directly.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    className="font-body font-semibold text-sm text-surface-foreground"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 outline-none transition-all placeholder:text-surface-muted-foreground/50"
                    id="name"
                    name="name"
                    required
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="font-body font-semibold text-sm text-surface-foreground"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 outline-none transition-all placeholder:text-surface-muted-foreground/50"
                    id="email"
                    name="email"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-body font-semibold text-sm text-surface-foreground"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 outline-none transition-all placeholder:text-surface-muted-foreground/50"
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-body font-semibold text-sm text-surface-foreground"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 outline-none transition-all placeholder:text-surface-muted-foreground/50"
                  id="message"
                  name="message"
                  required
                  rows={5}
                />
              </div>
              <button
                className="bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold text-base shadow-sm hover:brightness-110 active:translate-y-[1px] transition-all w-full md:w-auto"
                type="submit"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-5 space-y-12">
            {/* Contact Info Card */}
            <div className="bg-surface-muted p-8 md:p-10 rounded-xl space-y-8">
              <h3 className="font-headline text-surface-foreground text-2xl font-bold">
                Contact Details
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-brand-accent">phone_in_talk</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-muted-foreground mb-1">
                      Call us
                    </p>
                    <p className="text-xl font-bold text-brand-primary">
                      <Link href={`tel:${siteConfig.phone}`}>{siteConfig.phoneDisplay}</Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-brand-accent">location_on</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-muted-foreground mb-1">
                      Our location
                    </p>
                    <p className="text-lg text-surface-foreground leading-snug">
                      {siteConfig.address.city}
                      {siteConfig.address.county ? `, ${siteConfig.address.county}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-brand-accent">schedule</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-muted-foreground mb-1">
                      Opening hours
                    </p>
                    <ul className="text-surface-foreground space-y-1">
                      {hours.map((h, i) => (
                        <li key={i}>
                          {h.day}: <span className="font-medium">{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-surface-subtle h-[300px] bg-surface-muted">
              {/* TODO: wire to map embed or static map image */}
              <div className="w-full h-full bg-surface-muted grayscale opacity-80 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-surface-muted-foreground">
                  map
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Trust Stats Section */}
      <section className="bg-surface-muted py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-brand-accent text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-surface-muted-foreground text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
