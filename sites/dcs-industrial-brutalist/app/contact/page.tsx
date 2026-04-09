import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description:
    'Initiate contact with Digital Consulting Services. Platform websites, AI automation, and ecommerce for UK businesses.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          <a
            href="/"
            className="font-bold text-[#EAEAEA] tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            [ DCS ]
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[
              ['SYS.001', 'SERVICES', '/services'],
              ['SYS.002', 'PORTFOLIO', '/projects'],
              ['SYS.003', 'ABOUT', '/about'],
              ['SYS.004', 'CONTACT', '/contact'],
            ].map(([id, label, href]) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 text-[0.75rem] tracking-[0.08em] text-[#EAEAEA] hover:text-[#FF2A2A] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                <span className="text-[#777777]">{id}</span>
                {label}
              </a>
            ))}
          </nav>
          <a
            href="/contact"
            className="bg-[#FF2A2A] text-white text-[0.75rem] tracking-[0.08em] uppercase px-4 py-2 hover:bg-[#CC2222] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            [ INITIATE CONTACT ]
          </a>
        </div>
      </header>

      <main className="flex-1 pt-14">
        {/* HERO */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-24 md:py-32">
          <h1
            className="uppercase text-[#EAEAEA] whitespace-pre-line"
            style={{
              fontFamily: 'var(--font-space-grotesk, system-ui)',
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: '0.9',
            }}
          >
            {`INITIATE*\nCONTACT > `}
            <span className="cursor-blink">*</span>
          </h1>
        </section>

        <hr className="border-[#2A2A2A]" />

        {/* 2-COLUMN: FORM + DATA */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-px bg-[#2A2A2A]">
            {/* LEFT: Form */}
            <div className="bg-[#0A0A0A] p-8 md:p-12">
              <p
                className="uppercase mb-8"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                /// CONTACT FORM
              </p>
              <form className="flex flex-col gap-6" action="#" method="POST">
                {[
                  {
                    id: 'name',
                    label: 'NAME',
                    type: 'text',
                    required: true,
                    placeholder: 'Your full name',
                  },
                  {
                    id: 'email',
                    label: 'EMAIL',
                    type: 'email',
                    required: true,
                    placeholder: 'you@company.com',
                  },
                  {
                    id: 'phone',
                    label: 'PHONE (OPTIONAL)',
                    type: 'tel',
                    required: false,
                    placeholder: '+44 XXXX XXXXXX',
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block mb-2 uppercase"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        color: '#777777',
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full bg-[#111111] border border-[#2A2A2A] px-4 py-3 text-[#EAEAEA] placeholder-[#444444] focus:border-[#FF2A2A] focus:outline-none transition-colors duration-100"
                      style={{ fontFamily: 'var(--font-geist, system-ui)', fontSize: '1rem' }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="service"
                    className="block mb-2 uppercase"
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      color: '#777777',
                    }}
                  >
                    SERVICE
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full bg-[#111111] border border-[#2A2A2A] px-4 py-3 text-[#EAEAEA] focus:border-[#FF2A2A] focus:outline-none transition-colors duration-100 appearance-none"
                    style={{ fontFamily: 'var(--font-geist, system-ui)', fontSize: '1rem' }}
                  >
                    <option value="">Select a service...</option>
                    {siteConfig.services.map((svc) => (
                      <option key={svc.slug} value={svc.slug}>
                        {svc.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 uppercase"
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      color: '#777777',
                    }}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Describe your project or requirements..."
                    className="w-full bg-[#111111] border border-[#2A2A2A] px-4 py-3 text-[#EAEAEA] placeholder-[#444444] focus:border-[#FF2A2A] focus:outline-none transition-colors duration-100 resize-none"
                    style={{ fontFamily: 'var(--font-geist, system-ui)', fontSize: '1rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#FF2A2A] text-white px-8 py-4 hover:bg-[#CC2222] transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase w-full md:w-auto"
                  style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
                >
                  [ TRANSMIT MESSAGE ]
                </button>
              </form>
            </div>

            {/* RIGHT: Contact data */}
            <div className="bg-[#0A0A0A] p-8 border-l border-[#2A2A2A]">
              <p
                className="uppercase mb-8"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                /// CONTACT DATA
              </p>
              <div className="flex flex-col gap-6">
                {[
                  ['EMAIL', siteConfig.business.email],
                  ['PHONE', siteConfig.business.phone],
                  ['LOCATION', 'UK-001'],
                  ['HOURS', 'MON-FRI 09:00-17:30'],
                  ['STATUS', 'ACCEPTING PROJECTS'],
                ].map(([key, val]) => (
                  <div key={key} className="border-b border-[#2A2A2A] pb-6">
                    <p
                      className="uppercase mb-1"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        color: '#777777',
                      }}
                    >
                      {key}
                    </p>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.875rem',
                        letterSpacing: '0.08em',
                        color: key === 'STATUS' ? '#4AF626' : '#EAEAEA',
                      }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-[#2A2A2A] gap-px">
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="font-bold text-[#EAEAEA] text-lg mb-2"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                [ DCS ]
              </p>
              <p
                className="uppercase leading-relaxed"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                Digital Consulting
                <br />
                Services
                <br />
                <br />
                EST. 2015
              </p>
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                Systems
              </p>
              {[
                ['SYS.001', 'PLATFORM WEBSITES', '/services/platform-websites'],
                ['SYS.002', 'AI AUTOMATION', '/services/ai-automation'],
                ['SYS.003', 'ECOMMERCE', '/services/ecommerce'],
                ['SYS.004', 'WEB DESIGN', '/services/web-design'],
                ['SYS.005', 'SEO & ANALYTICS', '/services/seo-analytics'],
                ['SYS.006', 'MAINTENANCE', '/services/maintenance'],
              ].map(([id, label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2 mb-2 hover:text-[#FF2A2A] transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    color: '#EAEAEA',
                  }}
                >
                  <span style={{ color: '#777777' }}>{id}</span>
                  {label}
                </a>
              ))}
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                Coordinates
              </p>
              <p
                className="uppercase leading-relaxed"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#EAEAEA',
                }}
              >
                UK-001
                <br />
                digitalconsultingservices.co.uk
                <br />
                <br />
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#4AF626]" />
                  STATUS: ONLINE
                </span>
              </p>
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: '#777777',
              }}
            >
              (C) 2026 DIGITAL CONSULTING SERVICES
            </p>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: '#777777',
              }}
            >
              REV 2.6
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
