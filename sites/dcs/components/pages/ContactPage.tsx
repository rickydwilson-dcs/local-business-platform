import type { ContactPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

const inputClass =
  'border border-surface-card-border rounded-[10px] px-4 py-3 w-full font-sans text-surface-foreground bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-primary';

export function SiteContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-heading text-white mb-4 leading-tight">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-xl mx-auto">
            We usually respond within a few hours.
          </p>
          <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full mt-6" />
        </div>
      </section>

      {/* ─── Two-column layout ───────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Contact form */}
            <div>
              <span className="text-sm uppercase tracking-wider font-semibold text-surface-muted-foreground">
                Get Started
              </span>
              <h2 className="text-xl font-bold font-heading text-surface-foreground mt-1 mb-2">
                Send Us a Message
              </h2>
              <div className="w-12 h-1 bg-brand-accent rounded-full mb-6" />

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
                    className="block text-sm font-semibold font-heading text-surface-foreground mb-1.5"
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
                    className="block text-sm font-semibold font-heading text-surface-foreground mb-1.5"
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
                    className="block text-sm font-semibold font-heading text-surface-foreground mb-1.5"
                  >
                    Phone{' '}
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
                    className="block text-sm font-semibold font-heading text-surface-foreground mb-1.5"
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
                  className="bg-brand-primary text-white px-8 py-4 rounded-xl text-base font-bold font-heading w-full shadow-lg hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right — Contact details panel */}
            <div className="bg-surface-card rounded-[20px] p-8 border border-surface-card-border shadow-sm h-fit">
              <h2 className="text-xl font-bold font-heading text-surface-foreground mb-2">
                Contact Details
              </h2>
              <div className="w-12 h-1 bg-brand-accent rounded-full mb-6" />

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined bg-brand-primary/10 text-brand-primary text-2xl leading-none w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    phone
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-surface-foreground text-sm mb-1">
                      Phone
                    </p>
                    <Link
                      href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                      className="text-brand-primary font-sans hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </Link>
                  </div>
                </div>

                {/* Email */}
                {/* TODO: add email field to SiteConfigSummary — using name-derived fallback for now */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined bg-brand-accent/20 text-brand-primary text-2xl leading-none w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-surface-foreground text-sm mb-1">
                      Email
                    </p>
                    <Link
                      href={`mailto:info@${siteConfig.name.toLowerCase().replace(/\s+/g, '')}.co.uk`}
                      className="text-brand-primary font-sans hover:underline"
                    >
                      {`info@${siteConfig.name.toLowerCase().replace(/\s+/g, '')}.co.uk`}
                    </Link>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined bg-brand-primary/10 text-brand-primary text-2xl leading-none w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    location_on
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-surface-foreground text-sm mb-1">
                      Area Served
                    </p>
                    <p className="text-surface-foreground font-sans">
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
                    className="material-symbols-outlined bg-brand-accent/20 text-brand-primary text-2xl leading-none w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    schedule
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-surface-foreground text-sm mb-1">
                      Opening Hours
                    </p>
                    <ul className="text-surface-foreground font-sans text-sm space-y-1">
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
