import type { ContactPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

const inputClass =
  "border border-surface-card-border rounded-[10px] px-4 py-3 w-full font-body text-surface-foreground bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-primary";

export function SolarisContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-tight">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-body max-w-xl mx-auto">
            We usually respond within a few hours.
          </p>
        </div>
      </section>

      {/* ─── Two-column layout ───────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Contact form */}
            <div>
              <form action="/api/contact" method="POST" className="space-y-6">
                {/* Honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold font-headline text-surface-foreground mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold font-headline text-surface-foreground mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-semibold font-headline text-surface-foreground mb-1.5"
                  >
                    Phone{" "}
                    <span className="text-surface-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="Your phone number"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold font-headline text-surface-foreground mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={inputClass}
                    placeholder="Tell us how we can help…"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-primary text-white px-8 py-3 rounded-[10px] font-headline font-semibold w-full hover:bg-brand-primary transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right — Contact details panel */}
            <div className="bg-surface-card rounded-[20px] p-8 border border-surface-card-border h-fit">
              <h2 className="text-xl font-bold font-headline text-surface-foreground mb-6">
                Contact Details
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    phone
                  </span>
                  <div>
                    <p className="font-headline font-semibold text-surface-foreground text-sm mb-1">
                      Phone
                    </p>
                    <Link
                      href={`tel:${siteConfig.phone}`}
                      className="text-brand-primary font-body hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </Link>
                  </div>
                </div>

                {/* Email */}
                {/* TODO: add email field to SiteConfigSummary — using name-derived fallback for now */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                  <div>
                    <p className="font-headline font-semibold text-surface-foreground text-sm mb-1">
                      Email
                    </p>
                    <Link
                      href={`mailto:info@${siteConfig.name.toLowerCase().replace(/\s+/g, "")}.co.uk`}
                      className="text-brand-primary font-body hover:underline"
                    >
                      {`info@${siteConfig.name.toLowerCase().replace(/\s+/g, "")}.co.uk`}
                    </Link>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    location_on
                  </span>
                  <div>
                    <p className="font-headline font-semibold text-surface-foreground text-sm mb-1">
                      Area Served
                    </p>
                    <p className="text-surface-foreground font-body">
                      {siteConfig.address.city}
                      {siteConfig.address.county && (
                        <>
                          <br />
                          {siteConfig.address.county}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    schedule
                  </span>
                  <div>
                    <p className="font-headline font-semibold text-surface-foreground text-sm mb-1">
                      Opening Hours
                    </p>
                    <ul className="text-surface-foreground font-body text-sm space-y-1">
                      <li>Mon–Fri: 9:00 AM – 5:30 PM</li>
                      <li>Sat: By appointment</li>
                      <li className="text-surface-muted-foreground">Sun: Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
